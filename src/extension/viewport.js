import { $ } from "../include/zeta/shim.js";
import { define, defineObservableProperty, either, setTimeoutOnce } from "../include/zeta/util.js";
import { IS_TOUCH } from "../include/zeta/index.js";
import dom from "../include/zeta/dom.js";
import { animateIn } from "../anim.js";
import { install } from "../app.js";
import defaults from "../defaults.js";

defaults.viewport = true;

install('viewport', function (app) {
    var setOrientation = defineObservableProperty(app, 'orientation', '', true);
    var useAvailOrInner = IS_TOUCH && navigator.platform !== 'MacIntel';
    var availWidth = screen.availWidth;
    var availHeight = screen.availHeight;
    var aspectRatio, viewportWidth, viewportHeight;

    function checkViewportSize(triggerEvent) {
        if (IS_TOUCH && screen.availWidth === availWidth && screen.availHeight === availHeight && screen.availWidth === window.innerWidth) {
            // set min-height on body container so that page size is correct when virtual keyboard pops out
            $('body').css('min-height', $('body').height() + 'px');
        } else {
            $('body').css('min-height', '0');
        }
        availWidth = screen.availWidth;
        availHeight = screen.availHeight;

        // scroll properly by CSS transform when height of body is larger than root
        var bodyHeight = $('body').height() || 0;
        var htmlHeight = $('html').height() || 0;
        if (htmlHeight < bodyHeight && $(dom.activeElement).is(':text')) {
            dom.scrollIntoView(dom.activeElement);
        }
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

export default null;
