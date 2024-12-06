import $ from "./include/jquery.js";
import waterpipe from "./include/waterpipe.js"
import { always, camel, catchAsync, combineFn, definePrototype, each, extend, grep, is, isPlainObject, isThenable, mapGet, mapRemove, matchWord, pipe, reject, resolve, resolveAll, throwNotFunction } from "zeta-dom/util";
import { runCSSTransition } from "zeta-dom/cssUtil";
import { setClass, dispatchDOMMouseEvent, matchSelector, selectIncludeSelf, containsOrEquals } from "zeta-dom/domUtil";
import dom, { blur, focus, focusable, focused, releaseFocus, releaseModal, retainFocus, setModal, setTabRoot, textInputAllowed, unsetTabRoot } from "zeta-dom/dom";
import { CancellationRequest, cancelLock, locked, notifyAsync, subscribeAsync } from "zeta-dom/domLock";
import { ZetaEventSource } from "zeta-dom/events";
import { createAutoCleanupMap, watchElements } from "zeta-dom/observe";
import { app } from "./app.js";
import { animateIn, animateOut } from "./anim.js";
import { getAttr, hasAttr, selectorForAttr } from "./util/common.js";
import { registerSimpleDirective } from "./directive.js";

const SELECTOR_DISABLED = '[disabled],.disabled,:disabled';

const root = dom.root;
const flyoutStates = createAutoCleanupMap(function (element, state) {
    state.resolve();
});
const executedAsyncActions = new Map();
/** @type {Zeta.Dictionary<Zeta.AnyFunction>} */
const asyncActions = {};

export function NavigationCancellationRequest(path, external) {
    CancellationRequest.call(this, 'navigate');
    this.external = !!external;
    this[external ? 'url' : 'path'] = path;
}

definePrototype(NavigationCancellationRequest, CancellationRequest, {
    path: null,
    url: null
});

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
    var elements = $(flyout || '[is-flyout].open').get();
    var source = new ZetaEventSource();
    return resolveAll(elements.map(function (v) {
        var state = flyoutStates.get(v);
        if (!state) {
            return resolve();
        }
        var promise = state.closePromise;
        if (!promise) {
            promise = resolveAll([runCSSTransition(v, 'closing'), animateOut(v, 'open')].map(catchAsync), function () {
                if (flyoutStates.get(v) === state) {
                    flyoutStates.delete(v);
                    setClass(v, { open: false, closing: false, visible: false });
                    dom.emit('flyouthide', v, null, { source });
                }
            });
            state.closePromise = promise;
            state.resolve(value);
            releaseModal(v);
            releaseFocus(v);
            blur(v);
            if (state.source) {
                setClass(state.source, 'target-opened', false);
            }
            dom.emit('flyoutclose', v, null, { source });
        }
        return promise;
    }));
}

export function toggleFlyout(selector, source, options) {
    return openFlyout(selector, null, source, options, true);
}

/**
 * @param {string} selector
 * @param {any=} states
 * @param {Element=} source
 * @param {(Zeta.Dictionary | boolean)=} options
 * @param {boolean=} closeIfOpened
 */
export function openFlyout(selector, states, source, options, closeIfOpened) {
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
        if ((closeIfOpened || options) === true) {
            closeFlyout(element, source && waterpipe.eval('`' + source.value));
        } else {
            prev.path = app.path;
        }
        return prev.promise;
    }
    options = extend({
        focus: !source || !textInputAllowed(source),
        tabThrough: hasAttr(element, 'tab-through'),
        modal: hasAttr(element, 'is-modal')
    }, options);

    var scope = is(options.containment, Node) || $(element).closest(options.containment)[0] || root;
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
    resolveAll([runCSSTransition(element, 'open'), animateIn(element, 'open')].map(catchAsync), function () {
        if (options.focus && !focused(element)) {
            var focusTarget = options.focus === true ? element : $(element).find(options.focus)[0];
            if (focusTarget) {
                focus(focusTarget);
            } else {
                focus(element, false);
            }
        }
    });
    if (options.modal) {
        setModal(element);
    }
    if (options.tabThrough) {
        unsetTabRoot(element);
    } else {
        setTabRoot(element);
    }
    var createHandler = function (callback) {
        return function (e) {
            if (callback(e)) {
                closeFlyout(element);
                if (dom.event) {
                    dom.event.preventDefault();
                }
                e.handled();
            }
        };
    };
    var shouldCloseOnFocusEvent = function (e) {
        return options.closeOnBlur !== false && !getAttr(element, 'swipe-dismiss') && (e.type === 'focusin' ? !containsOrEquals(element, dom.activeElement) : containsOrEquals(scope, dom.activeElement));
    };
    always(promise, combineFn(
        dom.on(source || element, 'focusout', createHandler(shouldCloseOnFocusEvent)),
        dom.on(scope, 'focusin', createHandler(shouldCloseOnFocusEvent)),
        dom.on(element, 'gesture', createHandler(function (e) {
            return e.data === camel('swipe-' + getAttr(element, 'swipe-dismiss'));
        }))
    ));
    dom.emit('flyoutshow', element, { data: states });
    return promise;
}

registerSimpleDirective('enableLoadingClass', 'loading-class', function (element) {
    return subscribeAsync(element, function (loading) {
        if (loading) {
            setClass(element, 'loading', loading);
        } else {
            catchAsync(runCSSTransition(element, 'loading-complete', function () {
                setClass(element, 'loading', false);
            }));
        }
    });
});

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
            cancelLock(root, new NavigationCancellationRequest(href, true)).then(function () {
                var features = grep([matchWord(self.rel, 'noreferrer'), matchWord(self.rel, 'noopener')], pipe);
                window.open(dataHref || href, '_self', features.join(','));
            }, function () {
                console.warn('Navigation cancelled');
            });
        }
    });
});
