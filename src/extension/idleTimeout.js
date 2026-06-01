import { setIntervalSafe } from "zeta-dom/util";
import { bind } from "zeta-dom/domUtil";
import { addExtension } from "../app.js";

export default addExtension('idleTimeout', function (app, options) {
    var key = options.key || 'app.lastInteract';
    var timestamp;

    function setTimestamp(value) {
        timestamp = value || undefined;
        if (options.crossFrame) {
            localStorage[key] = value;
        }
    }

    setTimestamp(Date.now());
    bind(window, 'keydown mousedown touchstart wheel', function () {
        setTimestamp(Date.now());
    });
    setIntervalSafe(function () {
        if (options.crossFrame) {
            timestamp = +localStorage[key] || timestamp;
        }
        var elapsed = Date.now() - timestamp;
        if (elapsed > options.timeout) {
            setTimestamp('');
            return app.emit('idle', { elapsed });
        }
    }, 10000);
});
