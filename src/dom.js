import $ from "./include/external/jquery.js";
import { setClass, selectIncludeSelf, containsOrEquals } from "./include/zeta-dom/domUtil.js";
import { cancelLock, locked, notifyAsync } from "./include/zeta-dom/domLock.js";
import dom from "./include/zeta-dom/dom.js";
import { each, extend, makeArray, mapGet, resolveAll, any, noop, setImmediate, throwNotFunction, isThenable, createPrivateStore, mapRemove, grep, makeAsync, setImmediateOnce, arrRemove } from "./include/zeta-dom/util.js";
import { app } from "./app.js";
import { animateOut, animateIn } from "./anim.js";
import { groupLog } from "./util/console.js";
import { getVar, resetVar } from "./var.js";
import { isBoolAttr, selectorForAttr } from "./util/common.js";

const _ = createPrivateStore();
const root = dom.root;
const updatedElements = new Set();
const pendingDOMUpdates = new Map();
const preupdateHandlers = [];
const matchElementHandlers = [];
const selectorHandlers = [];
/** @type {Zeta.Dictionary<Brew.DOMProcessorCallback>} */
const transformationHandlers = {};
/** @type {Zeta.Dictionary<Brew.DOMProcessorCallback>} */
const renderHandlers = {};

var batchCounter = 0;
var stateChangeLock = false;

function getComponentState(ns, element) {
    var obj = _(element) || _(element, {});
    return obj[ns] || (obj[ns] = {});
}

function updateDOM(element, props, suppressEvent) {
    each(props, function (j, v) {
        if (j === '$$class') {
            setClass(element, v);
        } else if (j === '$$text') {
            element.textContent = v;
        } else if (j === '$$html') {
            element.innerHTML = v;
        } else if (j === 'style') {
            $(element).css(v);
        } else if (isBoolAttr(element, j)) {
            element[j] = !!v;
        } else {
            element.setAttribute(j, v);
        }
    });
    if (!suppressEvent) {
        dom.emit('domchange', element);
    }
}

function mergeDOMUpdates(dict, props) {
    each(props, function (j, v) {
        if (j === '$$class' || j === 'style') {
            dict[j] = extend({}, dict[j], v);
        } else {
            dict[j] = v;
        }
    });
}

function processTransform(elements, applyDOMUpdates) {
    var selector = selectorForAttr(transformationHandlers);
    if (!selector) {
        return;
    }
    var transformed = new Set();
    var exclude;
    do {
        elements = grep(makeArray(elements), function (v) {
            return containsOrEquals(root, v);
        });
        exclude = makeArray(transformed);
        $(selectIncludeSelf(selector, elements)).not(exclude).each(function (j, element) {
            each(transformationHandlers, function (i, v) {
                if (element.attributes[i]) {
                    v(element, getComponentState.bind(0, i), applyDOMUpdates);
                    transformed.add(element);
                }
            });
        });
    } while (exclude.length !== transformed.size);
}

function processRender(elements, updatedProps, applyDOMUpdates) {
    var selector = selectorForAttr(renderHandlers);
    if (!selector) {
        return;
    }
    var visited = [];
    each(elements.reverse(), function (i, v) {
        groupLog('statechange', [v, updatedProps.get(v).newValues], function (console) {
            console.log(v === root ? document : v);
            $(selectIncludeSelf(selector, v)).not(visited).each(function (i, element) {
                each(renderHandlers, function (i, v) {
                    if (element.attributes[i]) {
                        v(element, getComponentState.bind(0, i), applyDOMUpdates);
                    }
                });
                visited.push(element);
            });
        });
    });
}

/**
 * @param {string} target
 * @param {Zeta.Dictionary} handlers
 * @param {any[]} unbindHandlers
 */
export function addSelectHandlers(target, handlers, unbindHandlers) {
    var obj = {
        target: target,
        handlers: handlers,
        unbindHandlers: unbindHandlers
    };
    selectorHandlers.push(obj);
    unbindHandlers.push(function () {
        // remove entries from array in next event loop
        // to prevent misindexing in mountElement
        obj.disposed = true;
        setImmediate(function () {
            arrRemove(selectorHandlers, obj);
        });
    });
}

/**
 * @param {string} selector
 * @param {(ele: Element) => void} handler
 */
export function matchElement(selector, handler) {
    matchElementHandlers.push({ selector, handler });
}

/**
 * @param {(domChanges: Map<Element, Brew.DOMUpdateState>) => Brew.PromiseOrEmpty} callback
 */
export function hookBeforeUpdate(callback) {
    preupdateHandlers.push(throwNotFunction(callback));
}

/**
 * @param {Promise<any>} promise
 * @param {Element=} element
 * @param {() => any=} callback
 */
export function handleAsync(promise, element, callback) {
    if (!isThenable(promise)) {
        return makeAsync(callback || noop)();
    }
    notifyAsync(element || root, promise);
    return promise.then(callback);
}

/**
 * @param {Element} element
 */
export function markUpdated(element) {
    if (containsOrEquals(root, element)) {
        updatedElements.add(element);
    }
}

/**
 * @param {boolean=} suppressAnim
 */
export function processStateChange(suppressAnim) {
    if (batchCounter || stateChangeLock) {
        return;
    }
    var updatedProps = new Map();
    var domUpdates = new Map();
    var applyDOMUpdates = function (element, props) {
        var dict = mapGet(domUpdates, element, Object);
        mergeDOMUpdates(dict, props);
    };
    stateChangeLock = true;
    try {
        groupLog(dom.eventSource, 'statechange', function () {
            // recursively perform transformation until there is no new element produced
            processTransform(updatedElements, applyDOMUpdates);

            var arr = $.uniqueSort(grep(updatedElements, function (v) {
                return containsOrEquals(root, v);
            }));
            updatedElements.clear();
            each(arr, function (i, v) {
                var state = getComponentState('oldValues', v);
                var oldValues = {};
                var newValues = {};
                each(getVar(v, true), function (j, v) {
                    if (state[j] !== v) {
                        oldValues[j] = state[j];
                        newValues[j] = v;
                        state[j] = v;
                    }
                });
                updatedProps.set(v, {
                    oldValues: oldValues,
                    newValues: newValues
                });
                while (v = v.parentNode) {
                    var parent = updatedProps.get(v);
                    if (parent) {
                        for (var j in parent.newValues) {
                            if (!(j in newValues)) {
                                newValues[j] = parent.newValues[j];
                                oldValues[j] = parent.oldValues[j];
                            }
                        }
                    }
                }
            });

            processRender(arr, updatedProps, applyDOMUpdates);
        });

        // perform any async task that is related or required by the DOM changes
        var preupdatePromise = resolveAll(preupdateHandlers.map(function (v) {
            return v(domUpdates);
        }));

        // perform DOM updates, or add to pending updates if previous update is not completed
        // also wait for animation completed if suppressAnim is off
        preupdatePromise.then(function () {
            var animScopes = new Map();
            if (!suppressAnim) {
                each(updatedProps, function (element) {
                    var animParent = $(element).filter('[match-path]')[0] || $(element).parents('[match-path]')[0] || root;
                    var groupElements = animScopes.get(animParent);
                    if (!groupElements) {
                        var filter = function (v) {
                            var haystack = v.getAttribute('animate-on-statechange');
                            if (!haystack) {
                                return true;
                            }
                            for (var cur; v && !(cur = updatedProps.get(v)); v = v.parentNode);
                            return cur && any(haystack, function (v) {
                                return v in cur.newValues;
                            });
                        };
                        groupElements = [];
                        setImmediate(function () {
                            animateOut(animParent, 'statechange', '[match-path]', filter, true).then(function () {
                                each(groupElements, function (i, v) {
                                    updateDOM(v, mapRemove(pendingDOMUpdates, v));
                                });
                                animateIn(animParent, 'statechange', '[match-path]', filter);
                            });
                        });
                        animScopes.set(animParent, groupElements);
                    }
                    mapGet(pendingDOMUpdates, element, Object);
                    groupElements.push(element);
                });
            }
            each(domUpdates, function (element, props) {
                if (pendingDOMUpdates.has(element)) {
                    mergeDOMUpdates(pendingDOMUpdates.get(element), props);
                } else {
                    updateDOM(element, props);
                }
            });
            each(updatedProps, function (i, v) {
                dom.emit('statechange', i, {
                    data: getVar(i),
                    newValues: v.newValues,
                    oldValues: v.oldValues
                }, true);
            });
        });
    } finally {
        stateChangeLock = false;
    }
}

/**
 *
 * @param {true|(()=>void)} suppressAnim
 * @param {()=>void=} callback
 */
export function batch(suppressAnim, callback) {
    var doUpdate = true;
    try {
        batchCounter = (batchCounter || 0) + 1;
        throwNotFunction(callback || suppressAnim)();
    } catch (e) {
        doUpdate = false;
        throw e;
    } finally {
        if (!--batchCounter && doUpdate) {
            processStateChange(suppressAnim === true);
        }
    }
}

/**
 * @param {Element} element
 */
export function mountElement(element) {
    // apply transforms before element mounted
    // suppress domchange event before element is mounted
    var prevStateChangeLock = stateChangeLock;
    stateChangeLock = true;
    resetVar(element);
    try {
        processTransform(element, function (element, props) {
            updateDOM(element, props, true);
        });
    } finally {
        stateChangeLock = prevStateChangeLock;
    }

    var mountedElements = [element];
    var firedOnRoot = element === root;
    var index = -1, index2 = 0;
    while (index < selectorHandlers.length) {
        each(selectorHandlers.slice(index < 0 ? 0 : index), function (i, v) {
            if (!v.disposed) {
                $(selectIncludeSelf(v.target, element)).each(function (i, w) {
                    if (index < 0) {
                        v.unbindHandlers.push(app.on(w, v.handlers));
                    }
                    if (v.handlers.mounted && mountedElements.indexOf(w) < 0) {
                        mountedElements.push(w);
                    }
                });
            }
        });
        index = selectorHandlers.length;
        each($.uniqueSort(mountedElements.slice(index2)), function (i, v) {
            dom.emit('mounted', v);
        });
        if (!firedOnRoot) {
            firedOnRoot = true;
            dom.emit('mounted', root, { target: element });
        }
        index2 = mountedElements.length;
    }
    each(matchElementHandlers, function (i, v) {
        $(selectIncludeSelf(v.selector, element)).each(function (i, w) {
            v.handler.call(w, w);
        });
    });
    markUpdated(element);
    setImmediateOnce(processStateChange);
}

/**
 * @param {boolean=} suppressPrompt
 */
export function preventLeave(suppressPrompt) {
    return suppressPrompt ? locked(root) : cancelLock(root);
}

export function addTemplate(name, template) {
    $(template).clone().attr('brew-template', name).appendTo(document.body);
}

export function addTransformer(name, callback) {
    transformationHandlers[name] = throwNotFunction(callback);
}

export function addRenderer(name, callback) {
    renderHandlers[name] = throwNotFunction(callback);
}
