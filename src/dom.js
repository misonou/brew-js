import waterpipe from "./include/external/waterpipe.js"
import $ from "./include/external/jquery.js";
import { parseCSS, isCssUrlValue } from "./include/zeta-dom/cssUtil.js";
import { setClass, selectIncludeSelf, containsOrEquals } from "./include/zeta-dom/domUtil.js";
import { notifyAsync } from "./include/zeta-dom/domLock.js";
import dom from "./include/zeta-dom/dom.js";
import { each, extend, makeArray, mapGet, resolveAll, any, noop, setImmediate, throwNotFunction, isThenable, createPrivateStore, mapRemove, grep, map, matchWord, errorWithCode, makeAsync, setImmediateOnce } from "./include/zeta-dom/util.js";
import { app, isElementActive } from "./app.js";
import { animateOut, animateIn } from "./anim.js";
import { groupLog, writeLog } from "./util/console.js";
import { toRelativeUrl, withBaseUrl } from "./util/path.js";
import { getVar, evalAttr, setVar, evaluate, declareVar, resetVar } from "./var.js";
import { copyAttr, getAttrValues, isBoolAttr, selectorForAttr, setAttr } from "./util/common.js";
import * as ErrorCode from "./errorCode.js";

const IMAGE_STYLE_PROPS = 'background-image'.split(' ');

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
const templates = {};

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
    var transformed = new Set();
    var exclude;
    do {
        elements = grep(makeArray(elements), function (v) {
            return containsOrEquals(root, v);
        });
        exclude = makeArray(transformed);
        $(selectIncludeSelf(selectorForAttr(transformationHandlers), elements)).not(exclude).each(function (j, element) {
            each(transformationHandlers, function (i, v) {
                if (element.attributes[i]) {
                    v(element, getComponentState.bind(0, i), applyDOMUpdates);
                    transformed.add(element);
                }
            });
        });
    } while (exclude.length !== transformed.size);
}

/**
 * @param {string} target
 * @param {Zeta.Dictionary} handlers
 * @param {any[]} unbindHandlers
 */
export function addSelectHandlers(target, handlers, unbindHandlers) {
    selectorHandlers.push({
        target: target,
        handlers: handlers,
        unbindHandlers: unbindHandlers
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

            var visited = [];
            each(arr.reverse(), function (i, v) {
                groupLog('statechange', [v, updatedProps.get(v).newValues], function (console) {
                    console.log(v === root ? document : v);
                    $(selectIncludeSelf(selectorForAttr(renderHandlers), v)).not(visited).each(function (i, element) {
                        each(renderHandlers, function (i, v) {
                            if (element.attributes[i]) {
                                v(element, getComponentState.bind(0, i), applyDOMUpdates);
                            }
                        });
                        visited.push(element);
                    });
                });
            });
        });

        // perform any async task that is related or required by the DOM changes
        var preupdatePromise = resolveAll(preupdateHandlers.map(function (v) {
            return v(domUpdates);
        }));

        // perform DOM updates, or add to pending updates if previous update is not completed
        // also wait for animation completed if suppressAnim is off
        preupdatePromise.then(function () {
            var animScopes = new Map();
            each(domUpdates, function (element, props) {
                if (!suppressAnim) {
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
                    var dict = mapGet(pendingDOMUpdates, element, Object);
                    mergeDOMUpdates(dict, props);
                    groupElements.push(element);
                } else if (pendingDOMUpdates.has(element)) {
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
            $(selectIncludeSelf(v.target, element)).each(function (i, w) {
                v.unbindHandlers.push(app.on(w, v.handlers));
                if (v.handlers.mounted && mountedElements.indexOf(w) < 0) {
                    mountedElements.push(w);
                }
            });
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
    var element = any($('[prevent-leave]').get(), function (v) {
        var state = getComponentState('preventLeave', v);
        var allowLeave = state.allowLeave;
        if (isElementActive(v) || allowLeave) {
            var preventLeave = evalAttr(v, 'prevent-leave');
            if (!preventLeave && allowLeave) {
                delete state.allowLeave;
            }
            return preventLeave && !allowLeave;
        }
    });
    if (element && !suppressPrompt) {
        return resolveAll(dom.emit('preventLeave', element, null, true), function (result) {
            if (result) {
                var state = getComponentState('preventLeave', element);
                state.allowLeave = true;
            } else {
                throw errorWithCode(ErrorCode.navigationRejected);
            }
        });
    }
    return !!element;
}

export function addTemplate(name, template) {
    templates[name] = $(template)[0];
}

export function addTransformer(name, callback) {
    transformationHandlers[name] = throwNotFunction(callback);
}

export function addRenderer(name, callback) {
    renderHandlers[name] = throwNotFunction(callback);
}


/* --------------------------------------
 * Built-in transformers and renderers
 * -------------------------------------- */

addTransformer('apply-template', function (element, getState) {
    var state = getState(element);
    var templateName = element.getAttribute('apply-template');
    var template = templates[templateName] || templates[evalAttr(element, 'apply-template')];
    var currentTemplate = state.template;

    if (!state.attributes) {
        extend(state, {
            attributes: getAttrValues(element),
            childNodes: makeArray(element.childNodes)
        });
    }
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
});

addTransformer('auto-var', function (element) {
    setVar(element, evalAttr(element, 'auto-var'));
});

addTransformer('foreach', function (element, getState) {
    var state = getState(element);
    var templateNodes = state.template || (state.template = $(element).contents().detach().filter(function (i, v) { return v.nodeType === 1 || /\S/.test(v.data || ''); }).get());
    var currentNodes = state.nodes || [];
    var oldItems = state.data || [];
    var newItems = makeArray(evalAttr(element, 'foreach'));

    if (newItems.length !== oldItems.length || newItems.some(function (v, i) { return oldItems[i] !== v; })) {
        var newChildren = map(newItems, function (v) {
            var currentIndex = oldItems.indexOf(v);
            if (currentIndex >= 0) {
                oldItems.splice(currentIndex, 1);
                return currentNodes.splice(currentIndex * templateNodes.length, (currentIndex + 1) * templateNodes.length);
            }
            var parts = $(templateNodes).clone().get();
            var nested = $(selectIncludeSelf('[foreach]', parts));
            if (nested[0]) {
                $(selectIncludeSelf('[foreach]', templateNodes)).each(function (i, v) {
                    getState(nested[i]).template = getState(v).template;
                });
            }
            each(parts, function (i, w) {
                if (w.nodeType === 1) {
                    $(element).append(w);
                    declareVar(w, { foreach: v });
                    mountElement(w);
                }
            });
            return parts;
        });
        extend(state, {
            nodes: newChildren,
            data: newItems.slice()
        });
        $(currentNodes).detach();
        $(element).append(newChildren);
    }
});

addTransformer('switch', function (element, getState, applyDOMUpdates) {
    var varname = element.getAttribute('switch') || '';
    if (!isElementActive(element) || !varname) {
        return;
    }
    var state = getState(element);
    if (state.matched === undefined) {
        declareVar(element, 'matched', function () {
            return state.matched && getVar(state.matched, true);
        });
    }
    var context = getVar(element);
    var matchValue = waterpipe.eval(varname, context);
    var $target = $('[match-' + varname + ']', element).filter(function (i, w) {
        return $(w).parents('[switch]')[0] === element;
    });
    var resetOnChange = !matchWord('switch', element.getAttribute('keep-child-state') || '');
    var previous = state.matched;
    var matched;
    var itemValues = new Map();
    $target.each(function (i, v) {
        var thisValue = waterpipe.eval('"null" ?? ' + v.getAttribute('match-' + varname), getVar(v));
        itemValues.set(v, thisValue);
        if (waterpipe.eval('$0 == $1', [matchValue, thisValue])) {
            matched = v;
            return false;
        }
    });
    matched = matched || $target.filter('[default]')[0] || $target[0] || null;
    if (previous !== matched) {
        groupLog('switch', [element, varname, '→', matchValue], function (console) {
            console.log('Matched: ', matched || '(none)');
            if (matched) {
                if (resetOnChange) {
                    resetVar(matched);
                }
                setVar(matched);
            }
            if (previous && resetOnChange) {
                resetVar(previous, true);
            }
            $target.each(function (i, v) {
                applyDOMUpdates(v, { $$class: { active: v === matched } });
            });
        });
    } else {
        writeLog('switch', [element, varname, '→', matchValue, '(unchanged)']);
        if (varname in context && itemValues.get(matched) !== undefined) {
            setVar(element, varname, itemValues.get(matched));
        }
    }
    state.matched = matched;
});

addRenderer('template', function (element, getState, applyDOMUpdates) {
    var state = getState(element);
    var templates = state.templates;
    if (!templates) {
        templates = {};
        each(element.attributes, function (i, w) {
            if (w.value.indexOf('{{') >= 0) {
                templates[w.name] = isBoolAttr(element, w.name) ? w.value.replace(/^{{|}}$/g, '') : w.value;
            }
        });
        if (!element.childElementCount && (element.textContent || '').indexOf('{{') >= 0) {
            templates.$$html = element.textContent.replace(/(\{\{(?:\}(?!\})|[^}])*\}*\}\})|</g, function (v, a) {
                return a || '&lt;';
            });
        }
        state.templates = templates;
    }
    var context = getVar(element);
    var props = {};
    each(templates, function (i, w) {
        var value = evaluate(w, context, element, i, !isBoolAttr(element, i));
        if ((i === '$$html' ? element.innerHTML : (element.getAttribute(i) || '').replace(/["']/g, '')) !== value) {
            props[i] = value;
        }
    });
    applyDOMUpdates(element, props);
});

addRenderer('set-style', function (element, getState, applyDOMUpdates) {
    var style = parseCSS(evalAttr(element, 'set-style', true));
    each(IMAGE_STYLE_PROPS, function (i, v) {
        var imageUrl = isCssUrlValue(style[v]);
        if (imageUrl) {
            style[v] = 'url("' + withBaseUrl(toRelativeUrl(imageUrl)) + '")';
        }
    });
    applyDOMUpdates(element, { style });
});

addRenderer('set-class', function (element, getState, applyDOMUpdates) {
    applyDOMUpdates(element, { $$class: evalAttr(element, 'set-class') });
});
