import { define, defineObservableProperty, either, setTimeoutOnce } from "zeta-dom/util";
import { bind, getRect } from "zeta-dom/domUtil";
import dom from "zeta-dom/dom";
import { animateIn } from "../anim.js";
import { addExtension } from "../app.js";

export default addExtension(true, 'viewport', function (app) {
    var setOrientation = defineObservableProperty(app, 'orientation', '', true);
    var visualViewport = window.visualViewport;
    var aspectRatio, viewportWidth, viewportHeight;

    function checkViewportSize(triggerEvent) {
        var previousAspectRatio = aspectRatio;
        var rect = getRect();
        viewportWidth = rect.width;
        viewportHeight = rect.height;
        aspectRatio = viewportWidth / viewportHeight;
        setOrientation(aspectRatio >= 1 ? 'landscape' : 'portrait');

        if (triggerEvent !== false) {
            var data = {
                aspectRatio: aspectRatio,
                orientation: app.orientation,
                viewportWidth: viewportWidth,
                viewportHeight: viewportHeight
            };
            app.emit('resize', data);
            if (either(aspectRatio >= 1, previousAspectRatio >= 1)) {
                app.emit('orientationchange', data);
            }
        }
    }

    define(app, {
        get aspectRatio() {
            return aspectRatio;
        },
        get viewportWidth() {
            return viewportWidth;
        },
        get viewportHeight() {
            return viewportHeight;
        }
    });

    app.on('orientationchange', function () {
        animateIn(dom.root, 'orientationchange');
    });
    if (visualViewport) {
        bind(visualViewport, 'resize', checkViewportSize);
        checkViewportSize(false);
    } else {
        bind(window, 'resize', function () {
            setTimeoutOnce(checkViewportSize);
        });
        app.beforeInit(function () {
            return dom.ready.then(function () {
                checkViewportSize(false);
            });
        });
    }
});
