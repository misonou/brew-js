import $ from "./include/jquery.js";
import dom, { reportError } from "zeta-dom/dom";
import { notifyAsync } from "zeta-dom/domLock";
import { bind } from "zeta-dom/domUtil";
import { ZetaEventContainer } from "zeta-dom/events";
import { resolveAll, each, is, isFunction, camel, defineOwnProperty, define, definePrototype, extend, kv, throwNotFunction, watchable, combineFn, deferrable, grep, isArray, isPlainObject, defineObservableProperty, makeAsync, mapObject, fill, noop, always, createPrivateStore, makeArray, hasOwnProperty, isObservableProperty, watch, sameValue } from "zeta-dom/util";
import { } from "./libCheck.js";
import { initDefaults } from "./defaults.js";

const _ = createPrivateStore();
const emitter = new ZetaEventContainer();
const root = dom.root;
const featureDetections = {};

/** @type {Brew.AppInstance} */
export var app;
/** @type {boolean} */
export var appReady;
/** @type {boolean} */
export var appInited;

function exactTargetWrapper(handler) {
    return function (e) {
        if (e.target === e.context) {
            return handler.apply(this, arguments);
        }
    };
}

function wrapEventHandlers(event, handler, noChildren) {
    if (isPlainObject(event)) {
        return noChildren ? mapObject(event, exactTargetWrapper) : event;
    }
    if (noChildren) {
        handler = exactTargetWrapper(handler);
    }
    return fill(event, handler);
}

function resolveDependency(callbacks, loaded) {
    return callbacks && callbacks[0] && combineFn(callbacks.splice(0))(loaded);
}

function initExtension(app, name, deps, options, callback) {
    var state = _(app);
    var extensions = state.extensions;
    var dependencies = state.dependencies;
    if (extensions[name]) {
        throw new Error('Extension ' + name + ' is already initiated');
    }
    deps = grep(deps, function (v) {
        if (v[0] !== '?' && extensions[v] === undefined) {
            resolveDependency(dependencies[name], false);
            return true;
        }
        return extensions[v.replace(/^\?/, '')] === 0;
    });
    var counter = deps.length || 1;
    var wrapper = function (dep, optional, loaded) {
        if (!loaded && !optional) {
            state.reject(new Error('Extension ' + name + ' requires ' + dep));
        } else if (!--counter) {
            extensions[name] = true;
            callback(app, options || {});
            resolveDependency(dependencies[name], true);
        }
    };
    if (deps[0]) {
        each(deps, function (i, v) {
            var key = v.replace(/^\?/, '');
            var arr = dependencies[key] || (dependencies[key] = []);
            arr.push(wrapper.bind(0, key, v[0] === '?'));
        });
    } else {
        wrapper('', true);
    }
}

function defineUseMethod(app, name, deps, callback) {
    var method = camel('use-' + name);
    define(app, kv(method, function (options) {
        initExtension(this, name, deps, options, callback);
    }));
}

function App(initList) {
    var self = this;
    var appReadyResolve, appReadyReject;
    var state = _(self, {
        dependencies: Object.create(null),
        extensions: Object.create(null),
        initList: makeArray(initList),
        init: function () {
            var deferred = deferrable(dom.ready);
            state.waitFor = function (promise) {
                deferred.waitFor(promise.then(null, state.reject));
            };
            return deferred.then(appReadyResolve);
        },
        reject: function (error) {
            appReadyReject(error);
            reportError(error);
        }
    });
    var setReadyState = defineObservableProperty(self, 'readyState', 'init', true);
    defineOwnProperty(self, 'element', root, true);
    defineOwnProperty(self, 'ready', new Promise(function (resolve, reject) {
        appReadyResolve = resolve.bind(0, self);
        appReadyReject = reject;
    }), true);
    always(self.ready, function (resolved) {
        setReadyState(resolved ? 'ready' : 'error');
        if (resolved) {
            if (app === defaultApp) {
                appReady = true;
            }
            self.emit('ready');
        }
    });
}

definePrototype(App, {
    emit: function (event, element, data, options) {
        if (!is(element, Node)) {
            return emitter.emit(event, this, element, data);
        }
        var result = dom.emit(event, element, data, options);
        if (!result && (element === root || options === true || (options || '').bubbles)) {
            // backward compatibility where app will receive event bubbled up from dom element
            data = extend({
                target: element
            }, isPlainObject(data) || { data });
            result = emitter.emit(event, this, data, options);
        }
        return result;
    },
    define: function (props) {
        define(this, props);
    },
    beforeInit: function (promise) {
        if (isFunction(promise)) {
            promise = makeAsync(promise).call(this);
        }
        _(this).waitFor(promise);
    },
    halt: function () {
        _(this).waitFor(new Promise(noop));
    },
    isElementActive: function () {
        return true;
    },
    detect: function (names, callback) {
        var app = this;
        var supports = {};
        each(names, function (i, v) {
            if (featureDetections[v]) {
                supports[v] = isFunction(featureDetections[v]) ? (featureDetections[v] = resolveAll(featureDetections[v]()).catch(function (e) {
                    console.warn('Detection for ' + v + ' has thrown exception:', e);
                    return false;
                })) : featureDetections[v];
            }
        });
        this.beforeInit(resolveAll(supports, function (supports) {
            supports = Object.freeze(extend({}, app.supports, supports));
            define(app, { supports: supports });
            return isFunction(callback) && callback(supports);
        }));
    },
    when: function (value, callback) {
        this.beforeInit(resolveAll(value, function (value) {
            if (value) {
                return callback();
            }
        }));
    },
    on: function (target, event, handler, noChildren) {
        if (isFunction(event) || event === undefined) {
            return emitter.add(this, wrapEventHandlers(target, event));
        }
        var handlers = wrapEventHandlers(event, handler, (noChildren || handler) === true);
        if (!is(target, Node)) {
            return combineFn($(target).get().map(function (v) {
                return dom.on(v, handlers);
            }));
        }
        return dom.on(target, handlers);
    },
    matchElement: noop,
    beforeUpdate: noop
});
watchable(App.prototype);

const defaultApp = new App(initDefaults);
app = {
    on: defaultApp.on.bind(defaultApp)
};

function initApp(app, callback) {
    var state = _(app);
    var appInit = state.init();
    var init = function () {
        while (state.initList.length) {
            var v = state.initList.shift();
            if (isPlainObject(v)) {
                define(app, v);
            } else {
                throwNotFunction(v)(app);
            }
        }
        state.initComplete = true;
        callback(app);
        each(state.dependencies, function (i, v) {
            resolveDependency(v, false);
        });
    };
    state.waitFor(makeAsync(init)());
    return appInit;
}

function init(callback) {
    throwNotFunction(callback);
    if (app === defaultApp) {
        throw new Error('brew() can only be called once');
    }
    app = defaultApp;
    notifyAsync(root, initApp(app, callback));
    appInited = true;
    bind(window, 'pagehide', function (e) {
        app.emit('unload', { persisted: e.persisted }, { handleable: false });
    });
    return app;
}

define(init, {
    with: function () {
        var initList = _(defaultApp).initList;
        initList.push.apply(initList, arguments);
        return this;
    }
});

function createProxyConstructor(baseApp) {
    function AppProxy(initList) {
        var setters, handleChanges;
        var self = new Proxy(this, {
            get: function (t, p, r) {
                return p in t ? Reflect.get(t, p, r) : baseApp[p];
            },
            set: function (t, p, v, r) {
                if (hasOwnProperty(t, p) || !(p in baseApp)) {
                    Reflect.set(t, p, v, r);
                } else if (!t.disposed) {
                    baseApp[p] = v;
                }
                return true;
            },
            has: function (t, p) {
                return p in t || p in baseApp;
            },
            getOwnPropertyDescriptor: function (t, p) {
                var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
                var desc = getOwnPropertyDescriptor(t, p);
                if (desc || !isObservableProperty(baseApp, p)) {
                    return desc;
                }
                if (!setters) {
                    setters = {};
                    self.onDispose(watch(baseApp, function (e) {
                        each(e.newValues, function (i, v) {
                            if (hasOwnProperty(setters, i)) {
                                setters[i](v);
                            }
                        });
                        handleChanges();
                    }));
                }
                var readonly = !getOwnPropertyDescriptor(baseApp, p).set;
                defineOwnProperty(t, p, baseApp[p]);
                setters[p] = defineObservableProperty(self, p, t[p], readonly || function (newValue) {
                    if (!self.disposed && !sameValue(baseApp[p], newValue)) {
                        baseApp[p] = newValue;
                    }
                    return baseApp[p];
                });
                return getOwnPropertyDescriptor(t, p);
            }
        });
        handleChanges = watch(self, false);
        defineOwnProperty(self, 'readyState', 'init');
        App.call(self, initList);
        Object.setPrototypeOf(_(self).extensions, _(baseApp).extensions);
        return self;
    }
    definePrototype(AppProxy, App, {
        on: function () {
            var cb1 = App.prototype.on.apply(this, arguments);
            if (this.disposed) {
                return cb1;
            }
            var cb2 = baseApp.on.apply(baseApp, arguments);
            this.onDispose(cb2);
            return combineFn(cb1, cb2);
        }
    });
    return AppProxy;
}

function createDisposableApp(ctor, initList, callback) {
    var disposed = false;
    var handlers = [];
    var app = new ctor(initList.slice());
    define(app, {
        get disposed() {
            return disposed;
        },
        onDispose: function (callback) {
            if (disposed) {
                return callback();
            }
            handlers.push(throwNotFunction(callback));
        },
        dispose: function () {
            if (!disposed) {
                disposed = true;
                combineFn(handlers.splice(0))();
            }
        }
    });
    initApp(app, callback);
    return app;
}

export function installDisposable() {
    define(init, {
        disposableWith: function () {
            var initList = makeArray(arguments);
            var baseApp = is(initList[0], App) && initList.shift();
            var state = _(baseApp) || {
                ctor: App
            };
            var AppProxy = state.ctor || (state.ctor = createProxyConstructor(baseApp));
            return createDisposableApp.bind(null, AppProxy, initList);
        }
    });
    return init;
}

export function install(name, callback) {
    defineUseMethod(defaultApp, name, [], throwNotFunction(callback));
}

export function addExtension(autoInit, name, deps, callback) {
    callback = throwNotFunction(callback || deps || name);
    deps = isArray(deps) || isArray(name) || [];
    name = autoInit === true ? name : autoInit;
    return function (app) {
        var state = _(app);
        state.extensions[name] |= 0;
        if (autoInit !== true) {
            defineUseMethod(app, name, deps, callback);
        } else if (state.initComplete) {
            initExtension(app, name, deps, {}, callback);
        } else {
            state.initList.push(function (app) {
                initExtension(app, name, deps, {}, callback);
            });
        }
    };
}

export function addDetect(name, callback) {
    featureDetections[name] = throwNotFunction(callback);
}

export function emitAppEvent() {
    return defaultApp.emit.apply(defaultApp, arguments);
}

export function isElementActive(element) {
    return !app || app.isElementActive(element);
}

export default init;
