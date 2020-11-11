import { $ } from "./include/zeta/shim.js";
import dom from "./include/zeta/dom.js";
import { is, selectIncludeSelf } from "./include/zeta/domUtil.js";
import { resolveAll, each, isFunction, camel, defineOwnProperty, define, definePrototype, extend, kv, throwNotFunction, watchable, createPrivateStore, makeArray } from "./include/zeta/util.js";
import defaults from "./defaults.js";
import { addSelectHandlers, handleAsync, hookBeforeUpdate, matchElement, mountElement } from "./dom.js";
import { hookBeforePageEnter } from "./extension/router.js";
import { evalAttr, getVar } from "./var.js";
import { withBaseUrl } from "./util/path.js";
import { copyAttr, getAttrValues, setAttr } from "./util/common.js";

const _ = createPrivateStore();
const root = dom.root;
const templates = {};
const featureDetections = {};

/** @type {Brew.AppInstance} */
export var app;
/** @type {boolean} */
export var appReady;
/** @type {boolean} */
export var appInited;

function processUntilEmpty(arr) {
    return resolveAll(arr.splice(0), function () {
        return arr.length && processUntilEmpty(arr);
    });
}

function exactTargetWrapper(handler) {
    return function (e) {
        if (e.target === e.context) {
            return handler.apply(this, arguments);
        }
    };
}

function applyTemplate(element) {
    var templateName = element.getAttribute('apply-template');
    var template = templates[templateName] || templates[evalAttr(element, 'apply-template')];
    var state = _(element) || _(element, {
        template: null,
        attributes: getAttrValues(element),
        childNodes: makeArray(element.childNodes),
        isStatic: !!templates[templateName] || app.on(element, 'statechange', applyTemplate.bind(0, element))
    });
    var currentTemplate = state.template;

    if (template && template !== currentTemplate) {
        state.template = template;
        template = template.cloneNode(true);

        // reset attributes on the apply-template element
        // before applying new attributes
        if (currentTemplate) {
            each(currentTemplate.attributes, function (i, v) {
                element.removeAttribute(v.name);
            });
        }
        setAttr(element, state.attributes);
        copyAttr(template, element);

        var $contents = $(state.childNodes).detach();
        $(selectIncludeSelf('content:not([for])', template)).replaceWith($contents);
        $(selectIncludeSelf('content[for]', template)).each(function (i, v) {
            $(v).replaceWith($contents.filter(v.getAttribute('for') || ''));
        });
        $(element).empty().append(template.childNodes);
    }
}

/**
 * @param {Zeta.ZetaEvent} e
 */
function onElementMounted(e) {
    var element = e.target;
    $(selectIncludeSelf('[apply-template]', element)).each(function (i, v) {
        applyTemplate(v);
    });
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
        init: [],
        options: {}
    });
    defineOwnProperty(self, 'element', root, true);
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
        _(this).init.push(promise);
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
            supports = Object.freeze(extend(app.supports || {}, supports));
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
        if (typeof target === 'string') {
            addSelectHandlers(target, handlers);
            if (!appReady) {
                return;
            }
            target = $(target).get();
        } else if (target instanceof Node) {
            target = [target];
        }
        each(target, function (i, v) {
            dom.on(v, handlers);
        });
    },
    matchPath: function (path, selector, handler) {
        if (isFunction(selector)) {
            handler = selector;
            selector = null;
        }
        this.on('mounted', function (e) {
            if (e.target.getAttribute('match-path') === path && (!selector || $(e.target).is(selector))) {
                handler.call(e.target, e.target);
            }
        });
    },
    matchElement: matchElement,
    beforeUpdate: hookBeforeUpdate,
    beforePageEnter: hookBeforePageEnter
});
watchable(App.prototype);

dom.ready.then(function () {
    $('[brew-template]').each(function (i, v) {
        templates[v.getAttribute('brew-template')] = v.cloneNode(true);
    });
});

export default function (callback) {
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
    throwNotFunction(callback)(app);
    extend(window, { app });

    appInited = true;
    defineOwnProperty(getVar(root), 'loading', 'initial');
    handleAsync(resolveAll([dom.ready, processUntilEmpty(_(app).init)], function () {
        appReady = true;
        mountElement(root);
        app.emit('ready');
    }), root);
}

export function install(name, callback) {
    throwNotFunction(callback);
    definePrototype(App, kv(camel('use-' + name), function (options) {
        var state = _(this);
        state.options[name] = extend(state.options[name] || {}, options);
        callback(this, state.options[name]);
    }));
}

export function addDetect(name, callback) {
    featureDetections[name] = throwNotFunction(callback);
}

export function addTemplate(name, template) {
    templates[name] = $(template)[0];
}
