import $ from "./include/external/jquery.js";
import dom from "./include/zeta-dom/dom.js";
import { selectIncludeSelf } from "./include/zeta-dom/domUtil.js";
import { resolveAll, each, is, isFunction, camel, defineOwnProperty, define, definePrototype, extend, kv, throwNotFunction, watchable, createPrivateStore, combineFn, deferrable } from "./include/zeta-dom/util.js";
import defaults from "./defaults.js";
import { addSelectHandlers, handleAsync, hookBeforeUpdate, matchElement, mountElement } from "./dom.js";
import { setVar } from "./var.js";
import { withBaseUrl } from "./util/path.js";

const _ = createPrivateStore();
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

/**
 * @param {Zeta.ZetaEvent} e
 */
function onElementMounted(e) {
    var element = e.target;
    $(selectIncludeSelf('img[src^="/"], video[src^="/"]', element)).each(function (i, v) {
        // @ts-ignore: known element type
        v.src = withBaseUrl(v.getAttribute('src'));
    });
    $(selectIncludeSelf('a[href^="/"]', element)).each(function (i, v) {
        // @ts-ignore: known element type
        v.href = withBaseUrl(v.getAttribute('href'));
    });
    $(selectIncludeSelf('[data-src]', element)).each(function (i, v) {
        // @ts-ignore: known element type
        v.src = withBaseUrl(v.dataset.src);
        v.removeAttribute('data-src');
    });
    $(selectIncludeSelf('[data-bg-src]', element)).each(function (i, v) {
        // @ts-ignore: known element type
        v.style.backgroundImage = 'url("' + withBaseUrl(v.dataset.bgSrc) + '")';
        v.removeAttribute('data-bg-src');
    });
    $(selectIncludeSelf('form', element)).on('submit', function (e) {
        e.preventDefault();
    });
}

function App() {
    var self = this;
    _(self, {
        init: deferrable(dom.ready),
        options: {}
    });
    defineOwnProperty(self, 'element', root, true);
    defineOwnProperty(self, 'ready', new Promise(function (resolve) {
        self.on('ready', resolve.bind(0, self));
    }), true);
    self.on('mounted', onElementMounted);
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
            promise = promise.call(this);
        }
        _(this).init.waitFor(promise);
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
        noChildren = (noChildren || handler) === true;
        if (isFunction(event)) {
            handler = event;
            event = target;
            target = root;
        }
        var handlers = event;
        if (typeof event === 'string') {
            if (noChildren) {
                handler = exactTargetWrapper(handler);
            }
            if (event.indexOf(' ') >= 0) {
                handlers = {};
                each(event, function (i, v) {
                    handlers[v] = handler;
                });
            } else {
                handlers = kv(event, handler);
            }
        } else if (noChildren) {
            for (var i in event) {
                event[i] = exactTargetWrapper(event[i]);
            }
        }
        var arr = [];
        if (typeof target === 'string') {
            addSelectHandlers(target, handlers, arr);
            target = $(target).get();
        } else if (target instanceof Node) {
            target = [target];
        }
        each(target, function (i, v) {
            arr.push(dom.on(v, handlers));
        });
        return combineFn(arr);
    },
    matchElement: matchElement,
    beforeUpdate: hookBeforeUpdate
});
watchable(App.prototype);

export default function () {
    if (appInited) {
        throw new Error('brew() can only be called once');
    }
    app = new App();
    each(defaults, function (i, v) {
        var fn = v && isFunction(app[camel('use-' + i)]);
        if (fn) {
            fn.call(app, v);
        }
    });
    each(arguments, function (i, v) {
        throwNotFunction(v)(app);
    });

    appInited = true;
    setVar(root, { loading: 'initial' });
    handleAsync(_(app).init, root, function () {
        appReady = true;
        mountElement(root);
        app.emit('ready');
    });
    return app;
}

export function install(name, callback) {
    name = camel('use-' + name);
    throwNotFunction(callback);
    definePrototype(App, kv(name, function (options) {
        var dict = _(this).options;
        if (dict[name]) {
            throw new Error(name + '() can only be called once');
        }
        dict[name] = options || {};
        callback(this, dict[name]);
    }));
}

export function addExtension(autoInit, name, callback) {
    if (autoInit === true) {
        return function (app) {
            callback(app, {});
        };
    }
    return install.bind(0, autoInit, name);
}

export function addDetect(name, callback) {
    featureDetections[name] = throwNotFunction(callback);
}

export function isElementActive(element) {
    return !app || app.isElementActive(element);
}
