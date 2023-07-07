import Promise from "./include/external/promise-polyfill.js";
import $ from "./include/external/jquery.js";
import waterpipe from "./include/external/waterpipe.js"
import { always, any, grep, mapRemove, matchWord, pipe, resolve } from "./include/zeta-dom/util.js";
import { runCSSTransition } from "./include/zeta-dom/cssUtil.js";
import { setClass, selectClosestRelative, dispatchDOMMouseEvent, matchSelector, selectIncludeSelf } from "./include/zeta-dom/domUtil.js";
import dom, { focus, focusable, focused, releaseFocus, releaseModal, retainFocus, setModal } from "./include/zeta-dom/dom.js";
import { cancelLock, locked, notifyAsync } from "./include/zeta-dom/domLock.js";
import { watchElements } from "./include/zeta-dom/observe.js";
import { throwNotFunction, camel, resolveAll, each, mapGet, reject, isThenable } from "./include/zeta-dom/util.js";
import { app } from "./app.js";
import { animateIn, animateOut } from "./anim.js";
import { hasAttr, selectorForAttr } from "./util/common.js";
import { evalAttr, setVar } from "./var.js";

const SELECTOR_FOCUSABLE = 'button,input,select,textarea,[contenteditable],a[href],area[href],iframe';
const SELECTOR_TABROOT = '[is-flyout]:not([tab-through]),[tab-root]';
const SELECTOR_DISABLED = '[disabled],.disabled,:disabled';

const root = dom.root;
const flyoutStates = new Map();
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
            if (hasAttr(v, 'animate-out')) {
                setClass(v, 'closing', true);
                promise = animateOut(v, 'open');
            } else {
                promise = runCSSTransition(v, 'closing');
            }
            promise = always(promise, function () {
                flyoutStates.delete(v);
                setClass(v, { open: false, closing: false, visible: false });
                dom.emit('flyouthide', v);
            });
            state.closePromise = promise;
        }
        return promise;
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
    if (states) {
        setVar(element, states);
    }
    setClass(element, 'visible', true);
    runCSSTransition(element, 'open', function () {
        focus(element);
    });
    animateIn(element, 'open');
    if (element.attributes['is-modal']) {
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
    dom.emit('flyoutshow', element);
    return promise;
}

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
            setTimeout(setTabIndex);
        }
    });

    watchElements(root, SELECTOR_FOCUSABLE, setTabIndex, true);

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
