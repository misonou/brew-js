import $ from "../include/external/jquery.js";
import { define, defineObservableProperty, either, setTimeoutOnce } from "../include/zeta-dom/util.js";
import { bind } from "../include/zeta-dom/domUtil.js";
import { IS_TOUCH } from "../include/zeta-dom/env.js";
import dom from "../include/zeta-dom/dom.js";
import { animateIn } from "../anim.js";
import { addExtension } from "../app.js";

export default addExtension(true, 'viewport', function (app) {
    var setOrientation = defineObservableProperty(app, 'orientation', '', true);
    var visualViewport = window.visualViewport;
    var useAvailOrInner = IS_TOUCH && navigator.platform !== 'MacIntel';
    var aspectRatio, viewportWidth, viewportHeight;

    function checkViewportSize(triggerEvent) {
        if (visualViewport) {
            viewportWidth = visualViewport.width;
            viewportHeight = visualViewport.height;
        } else {
            var availWidth = screen.availWidth;
            var availHeight = screen.availHeight;
            viewportWidth = useAvailOrInner ? availWidth : document.body.offsetWidth;
            viewportHeight = useAvailOrInner ? (availWidth === window.innerWidth ? availHeight : window.innerHeight) : document.body.offsetHeight;
        }
        var previousAspectRatio = aspectRatio;
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
        $(window).on('resize', function () {
            setTimeoutOnce(checkViewportSize);
        });
        $(function () {
            checkViewportSize(false);
        });
    }
});
