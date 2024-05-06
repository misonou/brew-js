import { define } from "zeta-dom/util";
import * as path from "./util/path.js";
import * as commonUtil from "./util/common.js";
import * as storageUtil from "./util/storage.js";
import * as animation from "./anim.js";
import * as ErrorCode from "./errorCode.js";
import * as domAction from "./domAction.js";
import brew, { addDetect, addExtension, install } from "./app.js";
import { getDirectiveComponent, registerDirective } from "./directive.js";
import defaults from "./defaults.js";

define(brew, {
    ErrorCode,
    defaults,
    ...commonUtil,
    ...storageUtil,
    ...path,
    ...animation,
    ...domAction,
    getDirectiveComponent,
    registerDirective,
    install,
    addDetect,
    addExtension
});

import lib3 from "./extension/i18n.js";
import lib6 from "./extension/scrollable.js";
import lib7 from "./extension/viewport.js";
import lib8 from "./extension/router.js";

function exportAppToGlobal(app) {
    window.app = app;
}

export default brew.with(exportAppToGlobal, lib3, lib6, lib7, lib8);
