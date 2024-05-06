import { define, deepFreeze, extend, isFunction, watchable } from "zeta-dom/util";
import { getJSON } from "../util/common.js";
import { addExtension } from "../app.js";

export default addExtension('config', function (app, options) {
    var config = watchable();
    define(app, { config });
    app.beforeInit(getJSON(options.path).catch(isFunction(options.fallback) || null).then(function (d) {
        extend(config, d);
        if (options.freeze) {
            deepFreeze(config);
        }
    }));
});
