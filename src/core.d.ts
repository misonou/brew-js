import { declareVar, evalAttr, getVar, getVarScope, resetVar, setVar } from "./var";
import { addRenderer, addTemplate, addTransformer, handleAsync, preventLeave } from "./dom";
import { addDetect, addExtension, install } from "./app";
import { getDirectiveComponent, registerDirective } from "./directive.js";
import defaults from "./defaults";

import * as path from "./util/path";
import * as fetch from "./util/fetch";
import * as commonUtil from "./util/common";
import * as storageUtil from "./util/storage";
import * as animation from "./anim";
import * as domAction from "./domAction";
import * as ErrorCode from "./errorCode.js";

import { AppInit, isElementActive } from "./app";

declare const SYMBOL_INTERFACE: unique symbol;
declare const SYMBOL_EVENT: unique symbol;

export interface Extension<T> {
    (): void;
    [SYMBOL_INTERFACE]: T;
}

export interface ExtensionEventMap<T> {
    [SYMBOL_EVENT]: T;
}

type Util = typeof commonUtil & typeof storageUtil & typeof path & typeof fetch & typeof animation & typeof domAction & {
    ErrorCode: typeof ErrorCode,
    defaults: typeof defaults,
    getDirectiveComponent: typeof getDirectiveComponent,
    registerDirective: typeof registerDirective,
    getVarScope: typeof getVarScope,
    getVar: typeof getVar,
    setVar: typeof setVar,
    resetVar: typeof resetVar,
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
