import { always } from "zeta-dom/util";
import { bind } from "zeta-dom/domUtil";
import { addExtension } from "../app.js";

export default addExtension('idleTimeout', function (app, options) {
    var key = options.key || 'app.lastInteract';
    var timestamp;

    function setTimestamp() {
        timestamp = Date.now();
        if (options.crossFrame) {
            localStorage[key] = timestamp;
        }
    }

    function resetTimer() {
        setTimestamp();
        setTimeout(function next() {
            if (options.crossFrame) {
                timestamp = +localStorage[key] || timestamp;
            }
            var elapsed = Date.now() - timestamp;
            var ms = options.timeout - elapsed;
            if (ms >= 0) {
                setTimeout(next, ms);
            } else {
                var promise = app.emit('idle', { elapsed });
                always(promise, resetTimer);
            }
        }, options.timeout);
    }

    resetTimer();
    bind(window, 'keydown mousedown touchstart wheel', setTimestamp);
});
