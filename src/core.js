import { define, isFunction, isPlainObject, map, noop } from "./include/zeta-dom/util.js";
import * as path from "./util/path.js";
import * as commonUtil from "./util/common.js";
import * as animation from "./anim.js";
import * as ErrorCode from "./errorCode.js";
import { declareVar, evalAttr, getVar, setVar } from "./var.js";
import { addRenderer, addTemplate, addTransformer, handleAsync, preventLeave } from "./dom.js";
import * as domAction from "./domAction.js";
import brew, { addDetect, addExtension, install, isElementActive } from "./app.js";
import defaults from "./defaults.js";

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
    ErrorCode,
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
    addRenderer,
    addTransformer,
    addTemplate,
    with: with_
};

define(brew, method);

export default brew;
