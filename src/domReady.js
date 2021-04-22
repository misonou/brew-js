import $ from "./include/external/jquery.js";
import { each } from "./include/zeta-dom/util.js";
import { isCssUrlValue } from "./include/zeta-dom/cssUtil.js";
import dom from "./include/zeta-dom/dom.js";
import { addTemplate, preventLeave } from "./dom.js";
import { toRelativeUrl, withBaseUrl } from "./util/path.js";

dom.ready.then(function () {
    $('[brew-template]').each(function (i, v) {
        addTemplate(v.getAttribute('brew-template') || '', v.cloneNode(true));
    });

    $('apply-attributes').each(function (i, v) {
        var $target = $(v.getAttribute('elements') || '', v.parentNode || dom.root);
        each(v.attributes, function (i, v) {
            if (v.name !== 'elements') {
                $target.each(function (i, w) {
                    w.setAttribute(v.name, v.value);
                });
            }
        });
    }).remove();

    // replace inline background-image to prevent browser to load unneccessary images
    $('[style]').each(function (i, v) {
        var backgroundImage = isCssUrlValue(v.style.backgroundImage);
        if (backgroundImage) {
            v.setAttribute('data-bg-src', decodeURIComponent(withBaseUrl(toRelativeUrl(backgroundImage))));
            v.style.backgroundImage = 'none';
        }
    });

    window.onbeforeunload = function (e) {
        if (preventLeave(true)) {
            e.returnValue = '';
            e.preventDefault();
        }
    };
});

export default null;
