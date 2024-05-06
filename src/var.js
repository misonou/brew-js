import $ from "./include/external/jquery.js";
import waterpipe from "./include/external/waterpipe.js"
import { defineGetterProperty, defineOwnProperty, each, extend, hasOwnProperty, isFunction, isPlainObject, kv, noop, pick, setImmediateOnce, trim } from "zeta-dom/util";
import dom from "zeta-dom/dom";
import { app, appReady } from "./app.js";
import { batch, markUpdated, processStateChange } from "./dom.js";
import { InheritedNodeTree } from "zeta-dom/tree";
import { getAttr, selectorForAttr } from "./util/common.js";

const root = dom.root;
const varAttrs = {
    'var': true,
    'auto-var': true,
    'loading-scope': { loading: false },
    'error-scope': { error: null }
};
const globals = {
    get app() {
        return app;
    }
};
const tree = new InheritedNodeTree(root, VarContext, {
    selector: selectorForAttr(varAttrs)
});
var inited = true;

/**
 * @class
 * @this {Brew.VarContext}
 */
function VarContext() {
    var self = this;
    var element = self.element;
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
    var values = inited && (hasDataAttributes(element) ? tree.setNode(element) : tree.getNode(element)) || {};
    if (name !== true) {
        return name ? values[name] : extend({}, values);
    }
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
    return (templateMode ? evalTemplate : evalExpression)(template, context);
}

export function evalExpression(template, context) {
    return template ? waterpipe.eval(template, extend({}, context), { globals }) : null;
}

export function evalTemplate(template, context, html) {
    return template ? waterpipe(template, extend({}, context), { globals, html: !!html }) : '';
}

/**
 * @param {Element} element
 * @param {string} attrName
 * @param {boolean=} templateMode
 * @param {VarContext=} context
 */
export function evalAttr(element, attrName, templateMode, context) {
    return (templateMode ? evalTemplate : evalExpression)(getAttr(element, attrName), context || getVar(element));
}

tree.on('update', function (e) {
    each(e.updatedNodes, function (i, v) {
        markUpdated(v.element);
    });
});
