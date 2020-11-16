import waterpipe from "./include/waterpipe.js"
import { $, Map, Set } from "./include/zeta/shim.js";
import { parseCSS, isCssUrlValue } from "./include/zeta/cssUtil.js";
import { setClass, selectIncludeSelf } from "./include/zeta/domUtil.js";
import dom from "./include/zeta/dom.js";
import { each, extend, makeArray, defineHiddenProperty, kv, defineOwnProperty, mapGet, resolve, resolveAll, any, noop, setImmediate, throwNotFunction, isThenable, createPrivateStore } from "./include/zeta/util.js";
import { app } from "./app.js";
import { isElementActive } from "./extension/router.js";
import { animateOut, animateIn } from "./anim.js";
import { groupLog, writeLog } from "./util/console.js";
import { withBaseUrl } from "./util/path.js";
import { getVar, evalAttr, setVar, evaluate, getVarObjWithProperty } from "./var.js";
import { copyAttr, getAttrValues, setAttr } from "./util/common.js";

const TEMPLATE_ATTRS = 'template set-class set-style'.split(' ');
const IMAGE_STYLE_PROPS = 'background-image'.split(' ');

const hasOwnProperty = Object.prototype.hasOwnProperty;
const getOwnPropertyNames = Object.getOwnPropertyNames;

const _ = createPrivateStore();
const root = dom.root;
const updatedElements = new Set();
const pendingDOMUpdates = new Map();
const preupdateHandlers = [];
const matchElementHandlers = [];
const selectorHandlers = [];
const templates = {};

var batchCounter = 0;

function updateDOM(element, props) {
    each(props, function (j, v) {
        if (j === '$$class') {
            setClass(element, v);
        } else if (j === '$$text') {
            element.textContent = v;
        } else if (j === 'style') {
            $(element).css(v);
        } else {
            element.setAttribute(j, v);
        }
    });
    dom.emit('domchange', element);
}

function addPendingDOMUpdates(element, props) {
    var dict = pendingDOMUpdates.get(element);
    if (!dict) {
        dict = {};
        pendingDOMUpdates.set(element, dict);
    }
    each(props, function (j, v) {
        if (j === '$$class' || j === 'style') {
            dict[j] = extend({}, dict[j], v);
        } else {
            dict[j] = v;
        }
    });
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
 * @param {string} target
 * @param {Zeta.Dictionary} handlers
 */
export function addSelectHandlers(target, handlers) {
    selectorHandlers.push({
        target: target,
        handlers: handlers
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
        return resolve((callback || noop)());
    }
    if (element || dom.eventSource !== 'script') {
        element = element || dom.activeElement;
        var state = getVar(element);
        var s1 = getVarObjWithProperty(state, 'loading');
        var s2 = getVarObjWithProperty(state, 'error');
        if (!hasOwnProperty.call(s1, '__counter')) {
            defineHiddenProperty(s1, '__counter', 0);
        }
        s1.__counter++;
        setVar(s1.element, { loading: s1.loading || true });
        setVar(s2.element, { error: null });
        promise.then(function () {
            setVar(s1.element, { loading: !!--s1.__counter });
        }, function (e) {
            setVar(s1.element, { loading: !!--s1.__counter });
            setVar(s2.element, { error: '' + (e.message || e) });
        });
    }
    return promise.then(callback || null);
}

/**
 * @param {Element} element
 */
export function markUpdated(element) {
    updatedElements.add(element);
}

/**
 * @param {boolean=} suppressAnim
 */
export function processStateChange(suppressAnim) {
    if (batchCounter) {
        return;
    }
    var updatedProps = new Map();
    var domUpdates = new Map();

    // compute auto variables and evaluates DOM changes from templates
    groupLog(dom.eventSource, 'statechange', function () {
        var arr = makeArray(updatedElements);
        each(selectIncludeSelf('[apply-template]', arr), function (i, element) {
            applyTemplate(element);
        });
        each(selectIncludeSelf('[foreach]', arr), function (i, element) {
            var state = getVar(element);
            if (!state.__foreach) {
                defineHiddenProperty(state, '__foreach', {
                    // @ts-ignore: type inference issue
                    template: $(element).contents().detach().filter(function (i, v) { return v.nodeType === 1 || /\S/.test(v.data || ''); }).get(),
                    nodes: [],
                    data: []
                });
            }
            var templateNodes = state.__foreach.template;
            var currentNodes = state.__foreach.nodes;
            var oldItems = state.__foreach.data;
            var newItems = makeArray(evalAttr(element, 'foreach'));

            if (newItems.length !== oldItems.length || newItems.some(function (v, i) { return oldItems[i] !== v; })) {
                var newChildren = [];
                each(newItems, function (i, v) {
                    var currentIndex = oldItems.indexOf(v);
                    if (currentIndex < 0) {
                        var parts = $(templateNodes).clone().get();
                        each(parts, function (i, w) {
                            if (w.nodeType === 1) {
                                $(element).append(w);
                                setVar(w, kv('foreach', v), true);
                                mountElement(w);
                            }
                        });
                        newChildren.push.apply(newChildren, parts);
                    } else {
                        newChildren.push.apply(newChildren, currentNodes.slice(currentIndex * templateNodes.length, (currentIndex + 1) * templateNodes.length));
                    }
                });
                extend(state.__foreach, {
                    nodes: newChildren,
                    data: newItems
                });
                $(currentNodes).detach();
                $(element).append(newChildren);
            }
        });
        each(selectIncludeSelf('[auto-var]', arr), function (i, element) {
            setVar(element, evalAttr(element, 'auto-var'), true);
        });
        each(selectIncludeSelf('[switch][switch!=""]', arr), function (i, element) {
            var state = getVar(element);
            if (!hasOwnProperty.call(state, 'matched')) {
                defineOwnProperty(state, 'matched');
            }
            if (!isElementActive(element)) {
                return;
            }
            var varname = element.getAttribute('switch') || '';
            var matchValue = waterpipe.eval(varname, extend({}, state));
            var $target = $('[match-' + varname + ']', element).filter(function (i, w) {
                return $(w).parents('[switch]')[0] === element;
            });
            var matched;
            var itemValues = new Map();
            $target.each(function (i, v) {
                var thisValue = waterpipe.eval('"null" ?? ' + v.getAttribute('match-' + varname), extend({}, getVar(v)));
                itemValues.set(v, thisValue);
                if (waterpipe.eval('$0 == $1', [matchValue, thisValue])) {
                    matched = v;
                    return false;
                }
            });
            matched = matched || $target.filter('[default]')[0] || $target[0] || null;
            if (!state.matched || state.matched.element !== matched) {
                groupLog('switch', [element, varname, '→', matchValue], function (console) {
                    console.log('Matched: ', matched || '(none)');
                    if (matched) {
                        setVar(matched, null, true);
                    }
                    setVar(element, { matched: matched && getVar(matched) }, true);
                    $target.each(function (i, v) {
                        var props = mapGet(domUpdates, v, Object);
                        props.$$class = { active: v === matched };
                    });
                });
            } else {
                writeLog('switch', [element, varname, '→', matchValue, '(unchanged)']);
                if (varname in state && itemValues.get(matched) !== undefined) {
                    setVar(element, kv(varname, itemValues.get(matched)), true);
                }
            }
        });

        arr = $.uniqueSort(makeArray(updatedElements));
        each(arr, function (i, v) {
            var state = getVar(v);
            updatedProps.set(v, {
                newValues: extend({}, state.__newValues),
                oldValues: extend({}, state.__oldValues)
            });
        });

        var visited = [];
        each(arr.reverse(), function (i, v) {
            groupLog('statechange', [v, updatedProps.get(v).newValues], function (console) {
                console.log(v === root ? document : v);
                $(selectIncludeSelf('[' + TEMPLATE_ATTRS.join('],[') + ']', v)).not(visited).each(function (i, element) {
                    var props = mapGet(domUpdates, element, Object);
                    if (element.attributes.template) {
                        var state = getVar(element);
                        var templates = state.__template || {};
                        if (!state.__template) {
                            defineHiddenProperty(state, '__template', templates);
                            if (element.attributes.template) {
                                each(element.attributes, function (i, w) {
                                    if (w.value.indexOf('{{') >= 0) {
                                        templates[w.name] = w.value;
                                    }
                                });
                                if (!element.childElementCount && (element.textContent || '').indexOf('{{') >= 0) {
                                    templates.$$text = element.textContent;
                                }
                            }
                        }
                        each(templates, function (i, w) {
                            var value = evaluate(w, state, element, i, true);
                            if (domUpdates.get(element) || (i === '$$text' ? element.textContent : (element.getAttribute(i) || '').replace(/["']/g, '')) !== value) {
                                props[i] = value;
                            }
                        });
                    }
                    if (element.attributes['set-style']) {
                        var styles = parseCSS(evalAttr(element, 'set-style', true));
                        props.style = styles;
                        each(IMAGE_STYLE_PROPS, function (i, v) {
                            var imageUrl = isCssUrlValue(styles[v]);
                            if (imageUrl) {
                                styles[v] = 'url("' + withBaseUrl(imageUrl) + '")';
                            }
                        });
                    }
                    if (element.attributes['set-class']) {
                        props.$$class = evalAttr(element, 'set-class');
                    }
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
                                updateDOM(v, pendingDOMUpdates.get(v));
                                pendingDOMUpdates.delete(v);
                            });
                            animateIn(animParent, 'statechange', '[match-path]', filter);
                        });
                    });
                    animScopes.set(animParent, groupElements);
                }
                addPendingDOMUpdates(element, props);
                groupElements.push(element);
            } else if (pendingDOMUpdates.has(element)) {
                addPendingDOMUpdates(element, props);
            } else {
                updateDOM(element, props);
            }
        });
        each(updatedProps, function (i, v) {
            dom.emit('statechange', i, {
                data: extend({}, getVar(i)),
                newValues: v.newValues,
                oldValues: v.oldValues
            }, true);
        });
    });

    // reset variable state objects for next cycle
    each(updatedElements, function (i, v) {
        var state = getVar(v);
        var newValues = state.__newValues;
        var oldValues = state.__oldValues;
        getOwnPropertyNames(newValues).forEach(function (v) {
            delete newValues[v];
        });
        getOwnPropertyNames(oldValues).forEach(function (v) {
            delete oldValues[v];
        });
    });
    updatedElements.clear();
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
    // ensure mounted event is correctly fired on the newly mounted element
    dom.on(element, '__brew_handler__', noop);

    // apply templates before element mounted
    $(selectIncludeSelf('[apply-template]', element)).each(function (i, v) {
        applyTemplate(v);
    });

    var mountedElements = [element];
    var firedOnRoot = element === root;
    var index = -1, index2 = 0;
    while (index < selectorHandlers.length) {
        each(selectorHandlers.slice(index < 0 ? 0 : index), function (i, v) {
            $(selectIncludeSelf(v.target, element)).each(function (i, w) {
                app.on(w, v.handlers);
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
}

/**
 * @param {boolean=} suppressPrompt
 */
export function preventLeave(suppressPrompt) {
    var element = any($('[prevent-leave]').get(), function (v) {
        var state = getVar(v);
        var allowLeave = Object.hasOwnProperty.call(state, '__allowLeave');
        if (isElementActive(v) || allowLeave) {
            var preventLeave = evalAttr(v, 'prevent-leave');
            if (!preventLeave && allowLeave) {
                delete state.__allowLeave;
            }
            return preventLeave && !allowLeave;
        }
    });
    if (element && !suppressPrompt) {
        return resolveAll(dom.emit('preventLeave', element, null, true), function (result) {
            if (result) {
                // @ts-ignore: element checked for truthiness
                defineHiddenProperty(getVar(element), '__allowLeave', true);
            } else {
                throw 'user_rejected';
            }
        });
    }
    return !!element;
}

export function addTemplate(name, template) {
    templates[name] = $(template)[0];
}
