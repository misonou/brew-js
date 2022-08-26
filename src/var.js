import $ from "./include/external/jquery.js";
import waterpipe from "./include/external/waterpipe.js"
import { defineGetterProperty, defineOwnProperty, each, extend, hasOwnProperty, htmlDecode, isFunction, isPlainObject, keys, kv, noop, pick, setImmediateOnce, trim } from "./include/zeta-dom/util.js";
import dom from "./include/zeta-dom/dom.js";
import { app, appReady } from "./app.js";
import { batch, markUpdated, processStateChange } from "./dom.js";
import { InheritedNodeTree } from "./include/zeta-dom/tree.js";
import { selectorForAttr } from "./util/common.js";

const root = dom.root;
const varAttrs = {
    'var': true,
    'auto-var': true,
    'loading-scope': { loading: false },
    'error-scope': { error: null }
};
const tree = new InheritedNodeTree(root, VarContext, {
    selector: selectorForAttr(varAttrs)
});

/**
 * @class
 * @this {Brew.VarContext}
 */
function VarContext() {
    var self = this;
    var element = self.element;
    // @ts-ignore: does not throw error when property dataset does not exist
    each(element.dataset, function (i, v) {
        defineOwnProperty(self, i, waterpipe.eval('`' + trim(v || 'null')));
    });
    each(getDeclaredVar(element, true, self), function (i, v) {
        defineOwnProperty(self, i, v);
    });
    if (element === root) {
        self.loading = null;
        self.error = null;
    }
}

function hasDataAttributes(element) {
    for (var i in element.dataset) {
        return true;
    }
}

function getDeclaredVar(element, resetToNull, state) {
    var initValues = {};
    each(varAttrs, function (i, v) {
        if (element.attributes[i]) {
            if (v === true) {
                v = evalAttr(element, i, false, state);
                if (!isPlainObject(v)) {
                    return;
                }
            }
            // @ts-ignore: v should be object
            for (var j in v) {
                initValues[j] = v[j] === undefined || resetToNull ? null : v[j];
            }
        }
    });
    return initValues;
}

function findVarContext(varname, element) {
    element = element || root;
    for (var s = tree.getNode(element); s !== null; s = Object.getPrototypeOf(s)) {
        if (hasOwnProperty(s, varname)) {
            return s;
        }
    }
    console.warn('Undeclared state: %s', varname, { element: element });
    return tree.setNode(element);
}

/**
 * @param {string} varname
 * @param {Element} element
 */
export function getVarScope(varname, element) {
    var context = findVarContext(varname, element);
    return context.element;
}

/**
 * @param {Element | string} element
 * @param {any} name
 * @param {any=} value
 */
export function setVar(element, name, value) {
    var values = name && (isPlainObject(name) || kv(name, value));
    var hasUpdated = false;
    if (typeof element === 'string') {
        batch(function () {
            $(element).each(function (i, v) {
                // @ts-ignore: boolean arithmetics
                hasUpdated |= setVar(v, values);
            });
        });
    } else {
        var state = tree.setNode(element);
        each(values || evalAttr(element, 'set-var'), function (i, v) {
            if (state[i] !== v) {
                var node = findVarContext(i, element);
                node[i] = v;
                hasUpdated = true;
                markUpdated(node.element);
            }
        });
        if (hasUpdated && appReady) {
            setImmediateOnce(processStateChange);
        }
    }
    return !!hasUpdated;
}

/**
 * @param {Element} element
 * @param {any} name
 * @param {any=} value
 */
export function declareVar(element, name, value) {
    var values = isPlainObject(name) || kv(name, value);
    var context = tree.setNode(element);
    var newValues = {};
    for (var i in values) {
        if (isFunction(values[i])) {
            defineGetterProperty(context, i, values[i], noop);
        } else {
            defineOwnProperty(context, i, context[i]);
            newValues[i] = values[i];
        }
    }
    return setVar(element, newValues);
}

/**
 * @param {Element} element
 * @param {boolean=} resetToNull
 */
export function resetVar(element, resetToNull) {
    batch(function () {
        each(tree.descendants(element), function (i, v) {
            setVar(v.element, getDeclaredVar(v.element, resetToNull));
        });
    });
}

/**
 * @param {Element} element
 * @param {string|boolean=} name
 */
export function getVar(element, name) {
    var values = hasDataAttributes(element) ? tree.setNode(element) : tree.getNode(element) || {};
    if (name !== true) {
        return name ? values[name] : extend({}, values);
    }
    // @ts-ignore: element property exists on tree node
    if (values.element !== element) {
        return {};
    }
    var keys = Object.getOwnPropertyNames(values);
    keys.splice(keys.indexOf('element'), 1);
    return pick(values, keys);
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
    var result = templateMode ? waterpipe(template, extend({}, context), options) : waterpipe.eval(template, extend({}, context), options);
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
    var value = evaluate(str, context || getVar(element), element, attrName, templateMode);
    return templateMode ? htmlDecode(value) : value;
}

tree.on('update', function (e) {
    each(e.updatedNodes, function (i, v) {
        markUpdated(v.element);
    });
});
