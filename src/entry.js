import brew from "./core.js";

import lib1 from "./extension/config.js";
import lib2 from "./extension/template.js";
import lib3 from "./extension/i18n.js";
import lib4 from "./extension/login.js";
import lib5 from "./extension/preloadImage.js";
import lib6 from "./extension/scrollable.js";
import lib7 from "./extension/viewport.js";
import lib8 from "./extension/router.js";
import lib9 from "./extension/htmlRouter.js";

function exportAppToGlobal(app) {
    window.app = app;
}

export default brew.with(exportAppToGlobal, lib1, lib2, lib3, lib4, lib5, lib6, lib7, lib8, lib9);
