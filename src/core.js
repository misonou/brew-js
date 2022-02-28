import { define, isFunction, isPlainObject, map, noop } from "./include/zeta-dom/util.js";
import * as path from "./util/path.js";
import * as commonUtil from "./util/common.js";
import * as animation from "./anim.js";
import { declareVar, evalAttr, getVar, setVar } from "./var.js";
import { addTemplate, handleAsync, preventLeave } from "./dom.js";
import { isElementActive } from "./extension/router.js";
import * as domAction from "./domAction.js";
import brew, { addDetect, addExtension, install } from "./app.js";
import defaults from "./defaults.js";
import _ from "./domReady.js";

function with_() {
    var fn = this.bind.apply(brew, [0].concat(map(arguments, function (v) {
        if (isPlainObject(v)) {
            return function (app) {
                define(app, v);
            };
        }
        return isFunction(v) || noop;
    })));
    define(fn, method);
    return fn;
}

const method = {
    defaults,
    ...commonUtil,
    ...path,
    ...animation,
    ...domAction,
    getVar,
    setVar,
    declareVar,
    evalAttr,
    isElementActive,
    handleAsync,
    preventLeave,
    install,
    addDetect,
    addExtension,
    addTemplate,
    with: with_
};

define(brew, method);

export default brew;
