import { declareVar, evalAttr, getVar, setVar } from "./var";
import { addTemplate, handleAsync, preventLeave } from "./dom";
import { isElementActive } from "./extension/router";
import { addDetect, addExtension, install } from "./app";
import defaults from "./defaults";

import * as path from "./util/path";
import * as commonUtil from "./util/common";
import * as animation from "./anim";
import * as domAction from "./domAction";

import { AppInit } from "./app";

type WithExport<T> = T extends Extension<infer P> ? P : T;
type WithExtension<T extends any[]> = T extends [infer U, ...infer TRest] ? WithExport<U> & WithExtension<TRest> : {};

declare const SYMBOL_INTERFACE: unique symbol;

interface AppInitExtension {
    /**
     * Uses the supplied extensions.
     * Extension can be either a function returned by {@link addExtension},
     * or an object which its properties are copied to the app instance.
     * @param args A list of extensions.
     */
    with<T extends any[]>(...args: T): AppInit<WithExtension<T>>;
}

export interface Extension<T> {
    (): void;
    [SYMBOL_INTERFACE]: T;
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
    addTemplate
};
const brew: AppInit & AppInitExtension & typeof method;
export default brew;
