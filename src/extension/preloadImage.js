import { each, keys } from "../include/zeta-dom/util.js";
import { isCssUrlValue } from "../include/zeta-dom/cssUtil.js";
import { preloadImages } from "../util/common.js";
import { toAbsoluteUrl } from "../util/path.js";
import { isElementActive } from "./router.js";
import { install } from "../app.js";
import defaults from "../defaults.js";

const IMAGE_STYLE_PROPS = 'background-image'.split(' ');

defaults.preloadImage = true;

install('preloadImage', function (app) {
    app.beforeUpdate(function (domUpdates) {
        var urls = {};
        each(domUpdates, function (element, props) {
            if ((props.src || props.style) && isElementActive(element)) {
                if (props.src) {
                    urls[toAbsoluteUrl(props.src)] = true;
                }
                if (props.style) {
                    each(IMAGE_STYLE_PROPS, function (i, v) {
                        // @ts-ignore: props.style checked for truthiness
                        var imageUrl = isCssUrlValue(props.style[v]);
                        if (imageUrl) {
                            urls[toAbsoluteUrl(imageUrl)] = true;
                        }
                    });
                }
            }
        });
        return preloadImages(keys(urls), 200);
    });
    app.beforePageEnter(function (element) {
        return preloadImages(element, 1000);
    });
});

export default null;
