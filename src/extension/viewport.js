import $ from "../include/external/jquery.js";
import { define, defineObservableProperty, either, setTimeoutOnce } from "../include/zeta-dom/util.js";
import { IS_TOUCH } from "../include/zeta-dom/env.js";
import dom from "../include/zeta-dom/dom.js";
import { animateIn } from "../anim.js";
import { addExtension } from "../app.js";

export default addExtension(true, 'viewport', function (app) {
    var setOrientation = defineObservableProperty(app, 'orientation', '', true);
    var useAvailOrInner = IS_TOUCH && navigator.platform !== 'MacIntel';
    var aspectRatio, viewportWidth, viewportHeight;

    function checkViewportSize(triggerEvent) {
        var availWidth = screen.availWidth;
        var availHeight = screen.availHeight;
        var previousAspectRatio = aspectRatio;
        viewportWidth = useAvailOrInner ? availWidth : document.body.offsetWidth;
        viewportHeight = useAvailOrInner ? (availWidth === window.innerWidth ? availHeight : window.innerHeight) : document.body.offsetHeight;
        aspectRatio = viewportWidth / viewportHeight;
        setOrientation(aspectRatio >= 1 ? 'landscape' : 'portrait');

        if (triggerEvent !== false) {
            app.emit('resize', {
                aspectRatio: aspectRatio,
                viewportWidth: viewportWidth,
                viewportHeight: viewportHeight
            });
            if (either(aspectRatio >= 1, previousAspectRatio >= 1)) {
                app.emit('orientationchange', {
                    orientation: app.orientation
                });
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
    $(window).on('resize', function () {
        setTimeoutOnce(checkViewportSize);
    });
    $(function () {
        checkViewportSize(false);
    });
});
