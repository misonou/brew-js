import { declareVar, evalAttr, getVar, setVar } from "./var";
import { addRenderer, addTemplate, addTransformer, handleAsync, preventLeave } from "./dom";
import { addDetect, addExtension, install } from "./app";
import { getDirectiveComponent, registerDirective } from "./directive.js";
import defaults from "./defaults";

import * as path from "./util/path";
import * as commonUtil from "./util/common";
import * as storageUtil from "./util/storage";
import * as animation from "./anim";
import * as domAction from "./domAction";
import * as ErrorCode from "./errorCode.js";

import { AppInit, isElementActive } from "./app";

declare const SYMBOL_INTERFACE: unique symbol;

export interface Extension<T> {
    (): void;
    [SYMBOL_INTERFACE]: T;
}

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
    addTemplate
};
const brew: AppInit & typeof method;
export default brew;
