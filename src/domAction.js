import Promise from "./include/external/promise-polyfill.js";
import $ from "./include/external/jquery.js";
import waterpipe from "./include/external/waterpipe.js"
import { runCSSTransition } from "./include/zeta-dom/cssUtil.js";
import { setClass, selectClosestRelative, dispatchDOMMouseEvent, selectIncludeSelf } from "./include/zeta-dom/domUtil.js";
import dom from "./include/zeta-dom/dom.js";
import { throwNotFunction, isFunction, camel, extend, resolveAll, each, mapGet, keys, reject, isThenable } from "./include/zeta-dom/util.js";
import { app } from "./app.js";
import { handleAsync } from "./dom.js";
import { animateIn, animateOut } from "./anim.js";
import { getFormValues } from "./util/common.js";
import { setVar } from "./var.js";

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
    // @ts-ignore: type inference issue
    $(flyout || '[is-flyout].open').each(function (i, v) {
        var state = flyoutStates.get(v);
        if (state) {
            flyoutStates.delete(v);
            state.resolve(value);
            if (state.source) {
                setClass(state.source, 'target-opened', false);
            }
        }
        animateOut(v, 'show').then(function () {
            setClass(v, 'open', false);
        });
    });
}

/**
 * @param {string} selector
 * @param {any=} states
 * @param {Element=} source
 * @param {boolean=} closeIfOpened
 */
export function openFlyout(selector, states, source, closeIfOpened) {
    var container = source || dom.root;
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
    }
    if (states) {
        setVar(element, states);
    }
    runCSSTransition(element, 'open', function () {
        dom.focus(element);
    });
    animateIn(element, 'open');
    if (element.attributes['is-modal']) {
        dom.lock(element, promise);
    }
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
                    throw 'validation-failed';
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
        var params = {};
        var valid = true;
        if (form) {
            valid = dom.emit('validate', form) || form.checkValidity();
            extend(params, getFormValues(form));
        } else {
            extend(params, self.dataset);
        }
        return resolveAll(valid, function (valid) {
            if (!valid) {
                throw 'validation-failed';
            }
            return app[method](params);
        });
    }
});

dom.ready.then(function () {
    app.on('mounted', function (e) {
        $(selectIncludeSelf('[' + keys(asyncActions).join('],[') + ']', e.target)).attr('async-action', '');
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
        var self = e.currentTarget;
        if (self.target !== '_blank' && 'navigate' in app) {
            e.preventDefault();
            e.stopPropagation();
            var modalParent = $(self).closest('[is-modal]')[0];
            if (modalParent) {
                // handle links inside modal popup
                // this will return the promise which is resolved after modal popup is closed and release the lock
                openFlyout(modalParent).then(function () {
                    // @ts-ignore: app.navigate checked for truthiness
                    app.navigate(self.getAttribute('data-href') || self.getAttribute('href'));
                });
                closeFlyout(modalParent);
            } else {
                // @ts-ignore: app.navigate checked for truthiness
                app.navigate(self.getAttribute('data-href') || self.getAttribute('href'));
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
        openFlyout(self.getAttribute('toggle'), null, self, true);
    });

    $('body').on('click', '[toggle-class]', function (e) {
        e.stopPropagation();
        var self = e.currentTarget;
        var selector = self.getAttribute('toggle-class-for');
        var target = selector ? selectClosestRelative(selector, self) : e.currentTarget;
        each(self.getAttribute('toggle-class'), function (i, v) {
            setClass(target, v.slice(1), v[0] === '+');
        });
    });

    $('body').on('click', function () {
        closeFlyout();
    });
});
