import { $ } from "./include/zeta/shim.js";
import waterpipe from "./include/waterpipe.js"
import { selectIncludeSelf } from "./include/zeta/domUtil.js";
import { defineOwnProperty, each, extend, hasOwnProperty, htmlDecode, isPlainObject, keys } from "./include/zeta/util.js";
import dom from "./include/zeta/dom.js";
import { app, appReady } from "./app.js";
import { batch, markUpdated, processStateChange } from "./dom.js";
import { groupLog } from "./util/console.js";
import { InheritedNodeTree } from "./include/zeta/tree.js";

const DEBUG_EVAL = /localhost:?/i.test(location.host);

const root = dom.root;
const varAttrs = {
    'var': true,
    'auto-var': true,
    'switch': { matched: null },
    'error-scope': { error: null }
};
const tree = new InheritedNodeTree(root, VarContext);

/**
 * @class
 * @this {Brew.VarContext}
 */
function VarContext() {
    var self = this;
    var element = self.element;
    if (!element.attributes.var) {
        element.setAttribute('var', '');
    }
    // @ts-ignore: does not throw error when property dataset does not exist
    each(element.dataset, function (i, v) {
        defineOwnProperty(self, i, waterpipe.eval('`' + v));
    });
    each(getDeclaredVar(element, true, self), function (i, v) {
        defineOwnProperty(self, i, v);
    });
    if (element === root) {
        self.loading = null;
        self.error = null;
    }
}

function getDeclaredVar(element, resetToNull, state) {
    var initValues = {};
    each(varAttrs, function (i, v) {
        if (v === true) {
            extend(initValues, evalAttr(element, i, false, state));
        } else if (isPlainObject(v) && element.attributes[i]) {
            extend(initValues, v);
        }
    });
    if (resetToNull) {
        for (var i in initValues) {
            initValues[i] = null;
        }
    }
    return initValues;
}

/**
 * @param {string} varname
 * @param {Element} element
 */
export function getVarScope(varname, element) {
    for (var s = getVar(element); s !== null; s = Object.getPrototypeOf(s)) {
        if (hasOwnProperty(s, varname)) {
            return s.element;
        }
    }
    console.warn('Undeclared state: %s', varname, { element: element });
    return element;
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
        var state = tree.setNode(element);
        each(newStates || evalAttr(element, 'set-var'), function (i, v) {
            if (state[i] !== v) {
                state[i] = v;
                hasUpdated = true;
                markUpdated(getVarScope(i, element));
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
    });
}

/**
 * @param {Element} element
 * @returns {Brew.VarContext}
 */
export function getVar(element) {
    // @ts-ignore
    return tree.getNode(element);
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
 * @param {VarContext=} context
 */
export function evalAttr(element, attrName, templateMode, context) {
    var str = element.getAttribute(attrName);
    if (!str) {
        return templateMode ? '' : null;
    }
    return evaluate(str, context || getVar(element), element, attrName, templateMode);
}

dom.watchAttributes(root, keys(varAttrs), function (elements) {
    each(elements, function (i, v) {
        tree.setNode(v);
    });
}, true);

tree.on('update', function (e) {
    each(e.updatedNodes, function (i, v) {
        markUpdated(v.element);
    });
});
