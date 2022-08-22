import $ from "./include/external/jquery.js";
import { each } from "./include/zeta-dom/util.js";
import { watchElements } from "./include/zeta-dom/observe.js";
import dom from "./include/zeta-dom/dom.js";
import { addTemplate, preventLeave } from "./dom.js";
import { hasAttr, selectorForAttr } from "./util/common.js";
import { setVar } from "./var.js";

const ATTR_LOADING_SCOPE = 'loading-scope';
const ATTR_ERROR_SCOPE = 'error-scope';

const root = dom.root;

dom.ready.then(function () {
    $('[brew-template]').each(function (i, v) {
        addTemplate(v.getAttribute('brew-template') || '', v.cloneNode(true));
    });

    $('apply-attributes').each(function (i, v) {
        var $target = $(v.getAttribute('elements') || '', v.parentNode || root);
        each(v.attributes, function (i, v) {
            if (v.name !== 'elements') {
                $target.each(function (i, w) {
                    w.setAttribute(v.name, v.value);
                });
            }
        });
    }).remove();

    window.onbeforeunload = function (e) {
        if (preventLeave(true)) {
            e.returnValue = '';
            e.preventDefault();
        }
    };

    watchElements(root, selectorForAttr([ATTR_LOADING_SCOPE, ATTR_ERROR_SCOPE]), function (addedNodes) {
        each(addedNodes, function (i, v) {
            dom.lock(v);
            dom.on(v, {
                asyncStart: function () {
                    if (hasAttr(v, ATTR_LOADING_SCOPE)) {
                        setVar(v, 'loading', true);
                    }
                    if (hasAttr(v, ATTR_ERROR_SCOPE)) {
                        setVar(v, 'error', null);
                    }
                },
                asyncEnd: function () {
                    if (hasAttr(v, ATTR_LOADING_SCOPE)) {
                        setVar(v, 'loading', false);
                    }
                },
                error: function (e) {
                    if (hasAttr(v, ATTR_ERROR_SCOPE)) {
                        var error = e.error || {};
                        setVar(v, 'error', error.code || error.message || true);
                    }
                }
            });
        })
    }, true);

    if (hasAttr(root, ATTR_LOADING_SCOPE)) {
        setVar(root, 'loading', 'initial');
    }
});

export default null;
