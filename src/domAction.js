import Promise from "./include/external/promise-polyfill.js";
import $ from "./include/external/jquery.js";
import waterpipe from "./include/external/waterpipe.js"
import { always, camel, catchAsync, combineFn, each, extend, grep, is, isPlainObject, isThenable, mapGet, mapRemove, matchWord, pipe, reject, resolve, resolveAll, throwNotFunction } from "./include/zeta-dom/util.js";
import { runCSSTransition } from "./include/zeta-dom/cssUtil.js";
import { setClass, dispatchDOMMouseEvent, matchSelector, selectIncludeSelf } from "./include/zeta-dom/domUtil.js";
import dom, { focus, focusable, releaseFocus, releaseModal, retainFocus, setModal, setTabRoot, textInputAllowed, unsetTabRoot } from "./include/zeta-dom/dom.js";
import { cancelLock, locked, notifyAsync } from "./include/zeta-dom/domLock.js";
import { createAutoCleanupMap, watchElements } from "./include/zeta-dom/observe.js";
import { app } from "./app.js";
import { animateIn, animateOut } from "./anim.js";
import { hasAttr, selectorForAttr } from "./util/common.js";

const SELECTOR_DISABLED = '[disabled],.disabled,:disabled';

const root = dom.root;
const flyoutStates = createAutoCleanupMap(function (element, state) {
    state.resolve();
});
const executedAsyncActions = new Map();
/** @type {Zeta.Dictionary<Zeta.AnyFunction>} */
const asyncActions = {};

function disableEvent(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
}

function isSameWindow(target) {
    return !target || target === '_self' || target === window.name;
}

/**
 * @param {string} attr
 * @param {(this: Element, e: JQuery.UIEventBase) => Brew.PromiseOrEmpty} callback
 */
export function addAsyncAction(attr, callback) {
    asyncActions[attr] = throwNotFunction(callback);
}

export function isFlyoutOpen(selector) {
    var state = flyoutStates.get($(selector)[0]);
    return !!state && !state.closePromise;
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
        if (!state) {
            return resolve();
        }
        var promise = state.closePromise;
        if (!promise) {
            releaseModal(v);
            releaseFocus(v);
            state.resolve(value);
            if (state.source) {
                setClass(state.source, 'target-opened', false);
            }
            promise = resolveAll([
                runCSSTransition(v, 'closing'),
                hasAttr(v, 'animate-out') && animateOut(v, 'open')
            ]);
            promise = always(promise, function () {
                if (flyoutStates.get(v) === state) {
                    flyoutStates.delete(v);
                    setClass(v, { open: false, closing: false, visible: false });
                    dom.emit('flyouthide', v);
                }
            });
            state.closePromise = promise;
        }
        return promise;
    }));
}

export function toggleFlyout(selector, source) {
    return openFlyout(selector, null, source, true);
}

/**
 * @param {string} selector
 * @param {any=} states
 * @param {Element=} source
 * @param {(Zeta.Dictionary | boolean)=} options
 */
export function openFlyout(selector, states, source, options) {
    var element = $(selector)[0];
    if (!element) {
        return reject();
    }
    if (is(states, Node) || isPlainObject(source)) {
        options = source;
        source = states;
        states = null;
    }
    var prev = flyoutStates.get(element);
    if (prev && !prev.closePromise) {
        if (options === true) {
            // @ts-ignore: can accept if no such property
            closeFlyout(element, source && waterpipe.eval('`' + source.value));
        } else {
            // @ts-ignore: extended app property
            prev.path = app.path;
        }
        return prev.promise;
    }
    options = extend({
        focus: !source || !textInputAllowed(source),
        tabThrough: hasAttr(element, 'tab-through'),
        modal: hasAttr(element, 'is-modal')
    }, options);

    var focusFriend = source;
    if (!focusFriend && !focusable(element)) {
        focusFriend = dom.modalElement;
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
    if (focusFriend) {
        retainFocus(focusFriend, element);
    }
    if (source) {
        setClass(source, 'target-opened', true);
    }
    if (states && app.setVar) {
        app.setVar(element, states);
    }
    setClass(element, { visible: true, closing: false });
    catchAsync(runCSSTransition(element, 'open', function () {
        if (options.focus !== false) {
            focus(element);
        }
    }));
    animateIn(element, 'open');
    if (options.modal) {
        setModal(element);
    }
    if (options.tabThrough) {
        unsetTabRoot(element);
    } else {
        setTabRoot(element);
    }
    var closeHandler = function (e) {
        var swipeDismiss = element.getAttribute('swipe-dismiss');
        if (e.type === 'focusout' ? !swipeDismiss && options.closeOnBlur !== false : e.data === camel('swipe-' + swipeDismiss)) {
            closeFlyout(element);
            if (dom.event) {
                dom.event.preventDefault();
            }
            e.handled();
        }
    };
    always(promise, combineFn(
        dom.on(source || element, 'focusout', closeHandler),
        dom.on(element, 'gesture', closeHandler)
    ));
    dom.emit('flyoutshow', element);
    return promise;
}

dom.ready.then(function () {
    watchElements(root, '[tab-root]', function (addedNodes, removedNodes) {
        addedNodes.forEach(setTabRoot);
        removedNodes.forEach(unsetTabRoot);
    }, true);

    app.on('mounted', function (e) {
        var selector = selectorForAttr(asyncActions);
        if (selector) {
            $(selectIncludeSelf(selector, e.target)).attr('async-action', '');
        }
    });

    app.on('beforepageload', function () {
        flyoutStates.forEach(function (v, i) {
            if (v.path && v.path !== app.path) {
                closeFlyout(i);
            }
        });
    });

    /**
     * @param {JQuery.UIEventBase} e
     */
    function handleAsyncAction(e) {
        var element = e.currentTarget;
        if (matchSelector(element, SELECTOR_DISABLED)) {
            mapRemove(executedAsyncActions, element);
            disableEvent(e);
            return;
        }
        var executed = mapGet(executedAsyncActions, element, Array);
        var callback = null;
        var next = function (next) {
            if (focusable(element)) {
                next(e);
            } else {
                mapRemove(executedAsyncActions, element);
            }
        };
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
            var returnValue = callback.call(element, e);
            if (!e.isImmediatePropagationStopped()) {
                if (isThenable(returnValue)) {
                    disableEvent(e);
                    notifyAsync(element, returnValue);
                    returnValue.then(function () {
                        next(dispatchDOMMouseEvent);
                    }, function (e) {
                        executedAsyncActions.delete(element);
                        console.warn('Action threw an error:', e);
                    });
                } else {
                    next(handleAsyncAction);
                }
            }
        }
    }

    watchElements(root, '[async-action]', function (added, removed) {
        $(added).on('click', handleAsyncAction);
        $(removed).off('click', handleAsyncAction);
    });

    $('body').on('submit', 'form:not([action])', function (e) {
        e.preventDefault();
    });

    $('body').on('click', SELECTOR_DISABLED, disableEvent);

    $('body').on('click', 'a[href]:not([download]), [data-href]', function (e) {
        if (e.isDefaultPrevented()) {
            return;
        }
        var self = e.currentTarget;
        var href = (self.origin === location.origin ? '' : self.origin) + self.pathname + self.search + self.hash;
        var dataHref = self.getAttribute('data-href');
        e.stopPropagation();
        if (!isSameWindow(self.target)) {
            return;
        }
        if ('navigate' in app && (dataHref || app.isAppPath(href))) {
            e.preventDefault();
            app.navigate(dataHref || app.fromHref(href));
        } else if (locked(root)) {
            e.preventDefault();
            cancelLock(root).then(function () {
                var features = grep([matchWord(self.rel, 'noreferrer'), matchWord(self.rel, 'noopener')], pipe);
                window.open(dataHref || href, '_self', features.join(','));
            });
        }
    });
});
