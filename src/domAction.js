import Promise from "./include/external/promise-polyfill.js";
import $ from "./include/external/jquery.js";
import waterpipe from "./include/external/waterpipe.js"
import { always, any, catchAsync, errorWithCode, mapRemove } from "./include/zeta-dom/util.js";
import { runCSSTransition } from "./include/zeta-dom/cssUtil.js";
import { setClass, selectClosestRelative, dispatchDOMMouseEvent, selectIncludeSelf } from "./include/zeta-dom/domUtil.js";
import dom, { focus, focused, releaseModal, retainFocus, setModal } from "./include/zeta-dom/dom.js";
import { preventLeave } from "./include/zeta-dom/domLock.js";
import { watchElements } from "./include/zeta-dom/observe.js";
import { throwNotFunction, isFunction, camel, resolveAll, each, mapGet, reject, isThenable, makeArray, randomId } from "./include/zeta-dom/util.js";
import { app } from "./app.js";
import { handleAsync } from "./dom.js";
import { animateIn, animateOut } from "./anim.js";
import { getFormValues, selectorForAttr } from "./util/common.js";
import { evalAttr, setVar } from "./var.js";
import * as ErrorCode from "./errorCode.js";

const SELECTOR_FOCUSABLE = 'button,input,select,textarea,[contenteditable],a[href],area[href],iframe';
const SELECTOR_TABROOT = '[is-flyout]:not([tab-through]),[tab-root]';

const root = dom.root;
const flyoutStates = new Map();
const executedAsyncActions = new Map();
/** @type {Zeta.Dictionary<Zeta.AnyFunction>} */
const asyncActions = {};

/**
 * @param {string} attr
 * @param {(this: Element, e: JQuery.UIEventBase) => Brew.PromiseOrEmpty} callback
 */
export function addAsyncAction(attr, callback) {
    asyncActions[attr] = throwNotFunction(callback);
}

/**
 * @param {Element | string=} flyout
 * @param {any=} value
 */
export function closeFlyout(flyout, value) {
    /** @type {Element[]} */
    // @ts-ignore: type inference issue
    var elements = $(flyout || '[is-flyout].open').get();
    return resolveAll(elements.map(function (v) {
        var state = flyoutStates.get(v);
        if (state) {
            flyoutStates.delete(v);
            releaseModal(v);
            state.resolve(value);
            if (state.source) {
                setClass(state.source, 'target-opened', false);
            }
        }
        return catchAsync(v.attributes['animate-out'] ? (setClass(v, 'closing', true), animateOut(v, 'open')) : runCSSTransition(v, 'closing')).then(function () {
            setClass(v, { open: false, closing: false, visible: false });
        });
    }));
}

/**
 * @param {string} selector
 * @param {any=} states
 * @param {Element=} source
 * @param {boolean=} closeIfOpened
 */
export function openFlyout(selector, states, source, closeIfOpened) {
    var container = source || root;
    var element = selector ? selectClosestRelative(selector, container) : $(container).closest('[is-flyout]')[0];
    if (!element) {
        return reject();
    }
    var prev = flyoutStates.get(element);
    if (prev) {
        if (closeIfOpened) {
            // @ts-ignore: can accept if no such property
            closeFlyout(element, source && waterpipe.eval('`' + source.value));
        } else {
            // @ts-ignore: extended app property
            prev.path = app.path;
        }
        return prev.promise;
    }
    var resolve;
    var promise = new Promise(function (resolve_) {
        resolve = resolve_;
    });
    flyoutStates.set(element, {
        source: source,
        promise: promise,
        resolve: resolve,
        // @ts-ignore: extended app property
        path: app.path
    });
    if (source) {
        setClass(source, 'target-opened', true);
        retainFocus(element, source);
    }
    if (states) {
        setVar(element, states);
    }
    setClass(element, 'visible', true);
    runCSSTransition(element, 'open', function () {
        focus(element);
    });
    animateIn(element, 'open');
    if (element.attributes['is-modal']) {
        preventLeave(element, promise);
        setModal(element);
    }
    var closeHandler = function (e) {
        var swipeDismiss = element.getAttribute('swipe-dismiss');
        if (e.type === 'focusout' ? !swipeDismiss : e.data === camel('swipe-' + swipeDismiss)) {
            closeFlyout(element);
            if (dom.event) {
                dom.event.preventDefault();
            }
            e.handled();
        }
    };
    always(promise, dom.on(element, {
        focusout: closeHandler,
        gesture: closeHandler
    }));
    return promise;
}

addAsyncAction('validate', function (e) {
    var target = selectClosestRelative(this.getAttribute('validate') || '', e.target);
    if (target) {
        // @ts-ignore: type inference issue
        var valid = dom.emit('validate', target) || !target.checkValidity || target.checkValidity();
        if (!valid) {
            e.stopImmediatePropagation();
            e.preventDefault();
        } else if (isThenable(valid)) {
            return valid.then(function (valid) {
                if (!valid) {
                    throw errorWithCode(ErrorCode.validationFailed);
                }
            });
        }
    }
});

addAsyncAction('context-method', function (e) {
    var self = e.currentTarget;
    var method = camel(self.getAttribute('context-method') || '');
    if (isFunction(app[method])) {
        var formSelector = self.getAttribute('context-form');
        // @ts-ignore: acceptable if self.form is undefined
        var form = formSelector ? selectClosestRelative(formSelector, self) : self.form;
        var params;
        var valid = true;
        if (form) {
            valid = dom.emit('validate', form) || form.checkValidity();
            params = [getFormValues(form)];
        } else {
            params = makeArray(evalAttr(self, 'method-args'));
        }
        return resolveAll(valid, function (valid) {
            if (!valid) {
                throw errorWithCode(ErrorCode.validationFailed);
            }
            return app[method].apply(app, params);
        });
    }
});

dom.ready.then(function () {
    var tabindexMap = new WeakMap();
    var tabRoot = root;

    function setTabIndex(nodes) {
        $(nodes || SELECTOR_FOCUSABLE).each(function (i, v) {
            var closest = $(v).closest(SELECTOR_TABROOT)[0] || root;
            if (closest !== tabRoot) {
                if (!tabindexMap.has(v)) {
                    tabindexMap.set(v, v.tabIndex);
                }
                v.tabIndex = -1;
            } else {
                $(v).attr('tabindex', mapRemove(tabindexMap, v) || null);
            }
        });
    }

    dom.on('focuschange', function () {
        var newRoot = any($(SELECTOR_TABROOT).get().reverse(), function (v) {
            return focused(v);
        }) || root;
        if (newRoot !== tabRoot) {
            tabRoot = newRoot;
            setTabIndex();
        }
    });

    watchElements(root, SELECTOR_FOCUSABLE, setTabIndex, true);

    app.on('mounted', function (e) {
        $(selectIncludeSelf(selectorForAttr(asyncActions), e.target)).attr('async-action', '');
    });

    app.on('navigate', function () {
        setTimeout(function () {
            flyoutStates.forEach(function (v, i) {
                // @ts-ignore: extended app property
                if (v.path !== app.path) {
                    closeFlyout(i);
                }
            });
        });
    });

    $('body').on('click', '[disabled], .disabled, :disabled', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
    });

    $('body').on('click', '[async-action]', function (e) {
        var element = e.currentTarget;
        var executed = mapGet(executedAsyncActions, element, Array);
        var callback = null;
        each(asyncActions, function (i, v) {
            if (element.attributes[i] && executed.indexOf(v) < 0) {
                callback = v;
                return false;
            }
        });
        if (!callback) {
            executedAsyncActions.delete(element);
        } else {
            executed.push(callback);
            // @ts-ignore: type inference issue
            var returnValue = callback.call(element, e);
            if (isThenable(returnValue) && !e.isImmediatePropagationStopped()) {
                e.stopImmediatePropagation();
                e.preventDefault();
                handleAsync(returnValue).then(function () {
                    dispatchDOMMouseEvent(e);
                }, function (e) {
                    executedAsyncActions.delete(element);
                    console.warn('Action threw an error:', e);
                });
            }
        }
    });

    $('body').on('click', 'a[href]:not([rel]), [data-href]', function (e) {
        if (e.isDefaultPrevented()) {
            return;
        }
        var self = e.currentTarget;
        var href = self.getAttribute('data-href') || self.getAttribute('href');
        e.preventDefault();
        e.stopPropagation();
        if (self.getAttribute('target') === '_blank') {
            window.open(href, randomId());
        } else {
            var navigate = function () {
                if (!('navigate' in app) || /^([a-z0-9]+:|\/\/)/.test(href)) {
                    location.href = href;
                } else {
                    // @ts-ignore: app.navigate checked for truthiness
                    app.navigate(href);
                }
            };
            var modalParent = $(self).closest('[is-modal]')[0];
            if (modalParent) {
                // handle links inside modal popup
                // this will return the promise which is resolved after modal popup is closed and release the lock
                openFlyout(modalParent).then(navigate);
                closeFlyout(modalParent);
            } else {
                // @ts-ignore: app.navigate checked for truthiness
                navigate();
                closeFlyout();
            }
        }
    });

    $('body').on('click', '[set-var]:not([match-path])', function (e) {
        var self = e.currentTarget;
        if (self === $(e.target).closest('[set-var]')[0]) {
            setVar(self);
            closeFlyout();
        }
    });

    $('body').on('click', '[toggle]', function (e) {
        var self = e.currentTarget;
        e.stopPropagation();
        if (!self.attributes['toggle-if'] || evalAttr(self, 'toggle-if')) {
            openFlyout(self.getAttribute('toggle'), null, self, true);
        }
    });

    $('body').on('click', '[toggle-class]', function (e) {
        var self = e.currentTarget;
        e.stopPropagation();
        if (!self.attributes['toggle-if'] || evalAttr(self, 'toggle-if')) {
            var selector = self.getAttribute('toggle-class-for');
            var target = selector ? selectClosestRelative(selector, self) : e.currentTarget;
            each(self.getAttribute('toggle-class'), function (i, v) {
                setClass(target, v.slice(1), v[0] === '+');
            });
        }
    });
});
