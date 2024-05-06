import { define } from "zeta-dom/util";
import * as path from "./util/path.js";
import * as commonUtil from "./util/common.js";
import * as storageUtil from "./util/storage.js";
import * as animation from "./anim.js";
import * as ErrorCode from "./errorCode.js";
import { declareVar, evalAttr, getVar, setVar } from "./var.js";
import { addRenderer, addTemplate, addTransformer, handleAsync, preventLeave } from "./dom.js";
import * as domAction from "./domAction.js";
import brew, { addDetect, addExtension, install, isElementActive } from "./app.js";
import { getDirectiveComponent, registerDirective } from "./directive.js";
import defaults from "./defaults.js";

const method = {
    ErrorCode,
    defaults,
    ...commonUtil,
    ...storageUtil,
    ...path,
    ...animation,
    ...domAction,
    getDirectiveComponent,
    registerDirective,
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
};

define(brew, method);

export default brew;
