import { camel, each, isFunction } from "zeta-dom/util";

/** @deprecated @type {Zeta.Dictionary} */
const defaults = {};
export default defaults;

export function initDefaults(app) {
    each(defaults, function (i, v) {
        var fn = v && isFunction(app[camel('use-' + i)]);
        if (fn) {
            fn.call(app, v);
        }
    });
}
