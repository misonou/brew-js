import { declareVar, evalAttr, getVar, setVar } from "./var";
import { addTemplate, handleAsync, preventLeave } from "./dom";
import { isElementActive } from "./extension/router";
import { addDetect, install } from "./app";
import defaults from "./defaults";

import * as path from "./util/path";
import * as commonUtil from "./util/common";
import * as animation from "./anim";
import * as domAction from "./domAction";

import { AppInit } from "./app";

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
    addTemplate
};
const brew: AppInit & typeof method;
export default brew;
export as namespace brew;
