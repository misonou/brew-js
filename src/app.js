import $ from "./include/external/jquery.js";
import dom from "./include/zeta-dom/dom.js";
import { notifyAsync } from "./include/zeta-dom/domLock.js";
import { resolveAll, each, is, isFunction, camel, defineOwnProperty, define, definePrototype, extend, kv, throwNotFunction, watchable, combineFn, deferrable, grep, isArray, isPlainObject, defineObservableProperty, makeAsync, mapObject, fill, noop } from "./include/zeta-dom/util.js";
import { } from "./libCheck.js";
import defaults from "./defaults.js";

const root = dom.root;
const featureDetections = {};
const dependencies = {};
const extensions = {};
const initList = [];

/** @type {Brew.AppInstance} */
export var app;
/** @type {boolean} */
export var appReady;
/** @type {boolean} */
export var appInited;
/** @type {Promise<void> & Zeta.Deferrable} */
var appInit;
var setReadyState;

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
    return (event.indexOf(' ') >= 0 ? fill : kv)(event, handler);
}

function initExtension(app, name, deps, options, callback) {
    deps = grep(deps, function (v) {
        return !extensions[v.replace(/^\?/, '')];
    });
    var counter = deps.length || 1;
    var wrapper = function (loaded) {
        if (!counter) {
            throw new Error('Extension' + name + 'is already initiated');
        }
        if (loaded && !--counter) {
            extensions[name] = true;
            callback(app, options || {});
            if (dependencies[name]) {
                combineFn(dependencies[name].splice(0))(true);
            }
        }
    };
    if (deps[0]) {
        each(deps, function (i, v) {
            var key = v.replace(/^\?/, '');
            var arr = dependencies[key] || (dependencies[key] = []);
            arr.push(key === v ? wrapper : wrapper.bind(0, true));
        });
    } else {
        wrapper(true);
    }
}

function defineUseMethod(name, deps, callback) {
    var method = camel('use-' + name);
    definePrototype(App, kv(method, function (options) {
        initExtension(this, name, deps, options, callback);
    }));
}

function App() {
    var self = this;
    defineOwnProperty(self, 'element', root, true);
    defineOwnProperty(self, 'ready', new Promise(function (resolve) {
        self.on('ready', resolve.bind(0, self));
    }), true);
    setReadyState = defineObservableProperty(self, 'readyState', 'init', true);
}

definePrototype(App, {
    emit: function (event, element, data, bubbles) {
        if (!is(element, Node)) {
            bubbles = data;
            data = element;
            element = this.element;
        }
        return dom.emit(event, element, data, bubbles);
    },
    define: function (props) {
        define(this, props);
    },
    beforeInit: function (promise) {
        if (isFunction(promise)) {
            promise = makeAsync(promise).call(this);
        }
        appInit.waitFor(promise.then(null, function (error) {
            console.error('Failed to initialize', error);
            setReadyState('error');
        }));
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
        if (isFunction(event)) {
            noChildren = handler;
            handler = event;
            event = target;
            target = root;
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

const defaultApp = new App();
app = {
    on: defaultApp.on.bind(defaultApp)
};

function init(callback) {
    throwNotFunction(callback);
    if (appInit) {
        throw new Error('brew() can only be called once');
    }
    appInit = deferrable(dom.ready);
    app = defaultApp;
    each(defaults, function (i, v) {
        var fn = v && isFunction(app[camel('use-' + i)]);
        if (fn) {
            fn.call(app, v);
        }
    });
    each(initList, function (i, v) {
        if (isPlainObject(v)) {
            define(app, v);
        } else {
            throwNotFunction(v)(app);
        }
    });
    app.beforeInit(makeAsync(callback)(app));
    each(dependencies, function (i, v) {
        combineFn(v)();
    });

    appInited = true;
    notifyAsync(root, appInit);
    appInit.then(function () {
        if (app.readyState === 'init') {
            appReady = true;
            setReadyState('ready');
            app.emit('ready');
        }
    });
    return app;
}

define(init, {
    with: function () {
        initList.push.apply(initList, arguments);
        return this;
    }
});

export function install(name, callback) {
    defineUseMethod(name, [], throwNotFunction(callback));
}

export function addExtension(autoInit, name, deps, callback) {
    callback = throwNotFunction(callback || deps || name);
    deps = isArray(deps) || isArray(name) || [];
    return function (app) {
        if (autoInit === true) {
            initExtension(app, name, deps, {}, callback);
        } else {
            defineUseMethod(autoInit, deps, callback);
        }
    };
}

export function addDetect(name, callback) {
    featureDetections[name] = throwNotFunction(callback);
}

export function isElementActive(element) {
    return !app || app.isElementActive(element);
}

export default init;
