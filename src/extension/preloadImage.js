import { each, keys } from "zeta-dom/util";
import { isCssUrlValue } from "zeta-dom/cssUtil";
import { preloadImages } from "../util/common.js";
import { toAbsoluteUrl } from "../util/path.js";
import { addExtension, isElementActive } from "../app.js";

const IMAGE_STYLE_PROPS = 'background-image'.split(' ');

export default addExtension(true, 'preloadImage', ['?htmlRouter'], function (app) {
    app.beforeUpdate(function (domUpdates) {
        var urls = {};
        each(domUpdates, function (element, props) {
            if ((props.src || props.style) && isElementActive(element)) {
                if (props.src) {
                    urls[toAbsoluteUrl(props.src)] = true;
                }
                if (props.style) {
                    each(IMAGE_STYLE_PROPS, function (i, v) {
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
    if (app.beforePageEnter) {
        app.beforePageEnter(function (element) {
            return preloadImages(element, 1000);
        });
    }
});
