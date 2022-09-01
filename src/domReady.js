import dom from "./include/zeta-dom/dom.js";
import { preventLeave } from "./dom.js";

dom.ready.then(function () {
    window.onbeforeunload = function (e) {
        if (preventLeave(true)) {
            e.returnValue = '';
            e.preventDefault();
        }
    };
});

export default null;
