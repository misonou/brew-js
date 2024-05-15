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

type Util = typeof commonUtil & typeof storageUtil & typeof path & typeof animation & typeof domAction & {
    ErrorCode: typeof ErrorCode,
    defaults: typeof defaults,
    getDirectiveComponent: typeof getDirectiveComponent,
    registerDirective: typeof registerDirective,
    getVar: typeof getVar,
    setVar: typeof setVar,
    declareVar: typeof declareVar,
    evalAttr: typeof evalAttr,
    isElementActive: typeof isElementActive,
    handleAsync: typeof handleAsync,
    preventLeave: typeof preventLeave,
    install: typeof install,
    addDetect: typeof addDetect,
    addExtension: typeof addExtension,
    addRenderer: typeof addRenderer,
    addTransformer: typeof addTransformer,
    addTemplate: typeof addTemplate
};
declare const brew: AppInit & Util;
export default brew;
