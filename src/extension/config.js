import { define, deepFreeze, extend, isFunction, watchable } from "../include/zeta/util.js";
import { getJSON } from "../util/common.js";
import { install } from "../app.js";

install('config', function (app, options) {
    var config = watchable();
    define(app, { config });
    app.beforeInit(getJSON(options.path).catch(isFunction(options.fallback) || null).then(function (d) {
        extend(config, d);
        if (options.freeze) {
            deepFreeze(config);
        }
    }));
});

export default null;
