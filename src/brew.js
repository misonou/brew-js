import { define } from "./include/zeta/util.js";
import * as path from "./util/path.js";
import * as commonUtil from "./util/common.js";
import * as animation from "./anim.js";
import { evalAttr, getVar, setVar } from "./var.js";
import { handleAsync, preventLeave } from "./dom.js";
import { isElementActive } from "./extension/router.js";
import * as domAction from "./domAction.js";
import brew, { addDetect, install } from "./app.js";
import defaults from "./defaults.js";
import _ from "./domReady.js";

define(brew, {
    defaults,
    ...commonUtil,
    ...path,
    ...animation,
    ...domAction,
    getVar,
    setVar,
    evalAttr,
    isElementActive,
    handleAsync,
    preventLeave,
    install,
    addDetect
});

export default brew;
