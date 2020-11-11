import { $ } from "./include/zeta/shim.js";
import waterpipe from "./include/waterpipe.js"
import { containsOrEquals, selectIncludeSelf } from "./include/zeta/domUtil.js";
import { createPrivateStore, defineGetterProperty, defineHiddenProperty, defineOwnProperty, each, extend, htmlDecode, keys } from "./include/zeta/util.js";
import dom from "./include/zeta/dom.js";
import { app, appReady } from "./app.js";
import { batch, markUpdated, processStateChange } from "./dom.js";
import { groupLog } from "./util/console.js";

const DEBUG_EVAL = /localhost:?/i.test(location.host);
const VAR_SCOPE_ATTRS = 'var switch auto-var error-scope'.split(' ');

const root = dom.root;
const hasOwnProperty = Object.prototype.hasOwnProperty;
const setPrototypeOf = Object.setPrototypeOf;
const stateStore = createPrivateStore();

// assign to a new variable to avoid incompatble declaration issue by typescript compiler
const waterpipe_ = waterpipe;
waterpipe_.pipes['{'] = function (_, varargs) {
    var o = {};
    while (varargs.hasArgs()) {
        var key = varargs.raw();
        if (key === '}') {
            break;
        }
        o[String(key).replace(/:$/, '')] = varargs.next();
    }
    return o;
};
// @ts-ignore: add member to function
waterpipe_.pipes['{'].varargs = true;

/**
 * @param {Brew.VarState} state
 * @param {string} varname
 */
export function getVarObjWithProperty(state, varname) {
    for (var s = state; s !== null; s = Object.getPrototypeOf(s)) {
        if (hasOwnProperty.call(s, varname)) {
            return s;
        }
    }
    console.warn('Undeclared state: %s', varname, { element: state.element });
    return state;
}

/**
 * @param {Element | string} element
 * @param {Zeta.Dictionary | null=} newStates
 * @param {boolean=} suppressEvent
 */
export function setVar(element, newStates, suppressEvent) {
    var hasUpdated = false;
    if (typeof element === 'string') {
        $(element).each(function (i, v) {
            if (setVar(v, newStates, suppressEvent)) {
                hasUpdated = true;
            }
        });
    } else {
        var state = getVar(element);
        if (!element.attributes.var) {
            element.setAttribute('var', '');
        }
        each(newStates || evalAttr(element, 'set-var'), function (i, v) {
            if (state[i] !== v) {
                var s = getVarObjWithProperty(state, i);
                s.__oldValues[i] = s[i];
                s.__newValues[i] = v;
                s[i] = v;
                hasUpdated = true;
                markUpdated(s.element);
            }
        });
        if (hasUpdated && !suppressEvent && appReady) {
            processStateChange();
        }
    }
    return !!hasUpdated;
}

/**
 * @param {Element} element
 * @param {boolean=} resetToNull
 */
export function resetVar(element, resetToNull) {
    batch(function () {
        each(selectIncludeSelf('[var]', element), function (i, v) {
            setVar(v, getDeclaredVar(v, resetToNull));
        });
        if (resetToNull) {
            each(selectIncludeSelf('[switch][switch!=""]', element), function (i, v) {
                setVar(v, { matched: null });
            });
        }
    });
}

/**
 * @param {Element} element
 * @param {boolean=} resetToNull
 * @returns {Zeta.Dictionary}
 */
export function getDeclaredVar(element, resetToNull) {
    var initValues = {};
    if (element.attributes['error-scope']) {
        initValues.error = null;
    }
    extend(initValues, evalAttr(element, 'var'), evalAttr(element, 'auto-var'));
    if (resetToNull) {
        for (var i in initValues) {
            initValues[i] = null;
        }
    }
    return initValues;
}

/**
 * @param {Element} element
 * @returns {Brew.VarState}
 */
export function getVar(element) {
    if (!containsOrEquals(root, element)) {
        console.error('State should not be accessed when element is detached.', { element: element });
    }
    var state = stateStore(element);
    if (!state) {
        state = stateStore(element, {});
        defineHiddenProperty(state, 'element', element);
        defineHiddenProperty(state, '__newValues', {});
        defineHiddenProperty(state, '__oldValues', {});
        // @ts-ignore: dataset can be on Element
        if (keys(element.dataset)[0]) {
            // @ts-ignore: dataset can be on Element
            var dataset = extend({}, element.dataset);
            each(dataset, function (i, v) {
                dataset[i] = waterpipe.eval('"' + v + '"');
            });
            extend(state, dataset);
        }
        var parent = $(element).parents('[' + VAR_SCOPE_ATTRS.join('],[') + ']')[0] || root;
        if (parent !== element) {
            var parentState = getVar(parent);
            setPrototypeOf(state, parentState);
            setPrototypeOf(state.__newValues, parentState.__newValues);
            setPrototypeOf(state.__oldValues, parentState.__oldValues);
        } else {
            setPrototypeOf(state, function () { }.prototype);
        }
        if (!element.childElementCount) {
            defineGetterProperty(state, 'textContent', function () {
                return element.textContent;
            });
        }
    }
    if (!hasOwnProperty.call(state, '__init')) {
        defineHiddenProperty(state, '__init', true);
        var newStates = getDeclaredVar(element, !containsOrEquals(root, element) || !!$(element).parents('[match-path]')[0]);
        for (var i in newStates) {
            defineOwnProperty(state, i, newStates[i]);
        }
    }
    return state;
}

/**
 * @param {string} template
 * @param {any} context
 * @param {Element} element
 * @param {string} attrName
 * @param {boolean=} templateMode
 */
export function evaluate(template, context, element, attrName, templateMode) {
    var options = { globals: { app: app } };
    var result = templateMode ? htmlDecode(waterpipe(template, extend({}, context), options)) : waterpipe.eval(template, extend({}, context), options);
    if (DEBUG_EVAL) {
        groupLog('eval', [element, attrName, '→', result], function (console) {
            console.log('%c%s%c', 'background-color:azure;color:darkblue;font-weight:bold', template, '', '→', result);
            console.log('Context:', extend({}, context));
            console.log('Element:', element === root ? document : element);
        });
    }
    return result;
}

/**
 * @param {Element} element
 * @param {string} attrName
 * @param {boolean=} templateMode
 */
export function evalAttr(element, attrName, templateMode) {
    var str = element.getAttribute(attrName);
    if (!str) {
        return templateMode ? '' : {};
    }
    return evaluate(str, getVar(element), element, attrName, templateMode);
}
