import { setIntervalSafe } from "../include/zeta-dom/util.js";
import { bind } from "../include/zeta-dom/domUtil.js";
import { addExtension } from "../app.js";

export default addExtension('idleTimeout', function (app, options) {
    var key = options.key || 'app.lastInteract';
    var timestamp = Date.now();

    function setTimestamp(value) {
        timestamp = value || undefined;
        if (options.crossFrame) {
            localStorage[key] = value;
        }
    }

    bind(window, 'keydown mousedown touchstart wheel', function () {
        setTimestamp(Date.now());
    });
    setIntervalSafe(function () {
        if (options.crossFrame) {
            timestamp = +localStorage[key] || timestamp;
        }
        if (Date.now() - timestamp > options.timeout) {
            setTimestamp('');
            return app.emit('idle');
        }
    }, 10000);
});
