import $ from "../include/jquery.js";
import dom from "zeta-dom/dom";
import { isCssUrlValue } from "zeta-dom/cssUtil";
import { setClass, selectIncludeSelf, containsOrEquals } from "zeta-dom/domUtil";
import { notifyAsync } from "zeta-dom/domLock";
import { watchElements } from "zeta-dom/observe";
import { each, mapGet, single, resolveAll, isFunction, throwNotFunction, define, any } from "zeta-dom/util";
import { removeQueryAndHash, isSubPathOf, toSegments, withBaseUrl, toRelativeUrl } from "../util/path.js";
import { groupLog } from "../util/console.js";
import { animateIn, animateOut } from "../anim.js";
import { batch, markUpdated, mountElement } from "../dom.js";
import { evalAttr, resetVar, setVar } from "../var.js";
import { addExtension } from "../app.js";
import Router, { fromRoutePath, matchRoute, toRoutePath } from "./router.js";

const root = dom.root;
const matchByPathElements = new Map();
const preloadHandlers = [];

/** @type {Element[]} */
var activeElements = [root];
var pageTitleElement;

/**
 * @param {Element} v
 * @param {Element[]=} arr
 */
function isElementActive(v, arr) {
    var parent = $(v).closest('[match-path]')[0];
    return !parent || (arr || activeElements).indexOf(parent) >= 0;
}

function registerMatchPathElements(container) {
    $('[match-path]', container).each(function (i, v) {
        if (!matchByPathElements.has(v)) {
            var placeholder = document.createElement('div');
            placeholder.setAttribute('style', 'display: none !important');
            placeholder.setAttribute('match-path', v.getAttribute('match-path') || '');
            if (v.attributes.default) {
                placeholder.setAttribute('default', '');
            }
            $(v).before(placeholder);
            $(v).detach();
            setClass(v, 'hidden', true);
            matchByPathElements.set(placeholder, v);
            matchByPathElements.set(v, v);
        }
    });
}

/**
 * @param {Brew.AppInstance<Brew.WithRouter>} app
 * @param {Brew.RouterOptions} options
 */
function initHtmlRouter(app, options) {
    var newActiveElements;

    app.on('beforepageload', function (e) {
        // find active elements i.e. with match-path that is equal to or is parent of the new path
        /** @type {HTMLElement[]} */
        newActiveElements = [root];
        registerMatchPathElements();
        batch(true, function () {
            var newRoutePath = toRoutePath(removeQueryAndHash(e.pathname));
            var switchElements = $('[switch=""]').get();
            var current;
            while (current = switchElements.shift()) {
                if (isElementActive(current, newActiveElements)) {
                    var children = $(current).children('[match-path]').get().map(function (v) {
                        var element = mapGet(matchByPathElements, v) || v;
                        var children = $('[switch=""]', element).get();
                        var path = app.resolvePath(element.getAttribute('match-path'), newRoutePath, true);
                        return {
                            element: element,
                            path: path.replace(/\/\*$/, ''),
                            exact: !children[0] && path.slice(-2) !== '/*',
                            placeholder: (v !== element) && v,
                            children: children
                        };
                    });
                    children.sort(function (a, b) {
                        return b.path.localeCompare(a.path);
                    });
                    var matchedPath = single(children, function (v) {
                        return (v.exact ? newRoutePath === v.path : isSubPathOf(newRoutePath, v.path)) && v.path;
                    });
                    each(children, function (i, v) {
                        if (v.path === matchedPath) {
                            var element = v.element;
                            newActiveElements.unshift(element);
                            if (v.placeholder) {
                                $(v.placeholder).replaceWith(element);
                                mountElement(element);
                                switchElements.push.apply(switchElements, v.children);
                            }
                        }
                    });
                }
            }
        });
        // redirect to the default view if there is no match because every switch must have a match
        var bailOut = any(selectIncludeSelf('[switch=""]'), function (v) {
            if (isElementActive(v, newActiveElements)) {
                var $children = $(v).children('[match-path]');
                var currentMatched = $children.filter(function (i, v) {
                    return newActiveElements.indexOf(v) >= 0;
                })[0];
                if (!currentMatched) {
                    return app.navigate(fromRoutePath(($children.filter('[default]')[0] || $children[0]).getAttribute('match-path')), true);
                }
            }
        });
        if (bailOut) {
            return;
        }

        var previousActiveElements = activeElements.slice(0);
        var oldPath = app.previousPath;
        var path = e.pathname;
        var eventSource = dom.eventSource;

        activeElements = newActiveElements;
        pageTitleElement = $(newActiveElements).filter('[page-title]')[0];

        // assign document title from matched active elements and
        document.title = pageTitleElement ? evalAttr(pageTitleElement, 'page-title', true) : document.title;

        batch(true, function () {
            var preload = new Map();
            groupLog(eventSource, ['pageenter', path], function () {
                matchByPathElements.forEach(function (element, placeholder) {
                    var matched = activeElements.indexOf(element) >= 0;
                    if (element !== placeholder && matched === (previousActiveElements.indexOf(element) < 0)) {
                        if (matched) {
                            resetVar(element, false);
                            setVar(element);
                            markUpdated(element);
                            // animation and pageenter event of inner scope
                            // must be after those of parent scope
                            var dependencies = preload.get($(element).parents('[match-path]')[0]);
                            var segments = toSegments(element.getAttribute('match-path'));
                            var promises = preloadHandlers.map(function (v) {
                                if (matchRoute(v.route, segments)) {
                                    return v.callback(element, path);
                                }
                            });
                            promises.push(dependencies);
                            preload.set(element, resolveAll(promises, function () {
                                if (activeElements.indexOf(element) >= 0) {
                                    setClass(element, 'hidden', false);
                                    animateIn(element, 'show', '[match-path]', true);
                                    app.emit('pageenter', element, { pathname: path }, true);
                                }
                            }));
                        } else {
                            app.emit('pageleave', element, { pathname: oldPath }, true);
                            animateOut(element, 'show', '[match-path]').then(function () {
                                if (activeElements.indexOf(element) < 0) {
                                    groupLog(eventSource, ['pageleave', oldPath], function () {
                                        setClass(element, 'hidden', true);
                                        resetVar(element, true);
                                    });
                                }
                            });
                        }
                    }
                });
            });
            each(preload, function (element, promise) {
                notifyAsync(element, promise);
                e.waitFor(promise);
            });
        });
    });

    app.on('pageenter', function (e) {
        $(selectIncludeSelf('[x-autoplay]', e.target)).each(function (i, v) {
            if (isElementActive(v)) {
                if (v.readyState !== 0) {
                    v.currentTime = 0;
                }
                v.play();
            }
        });
    });

    app.on('pageleave', function (e) {
        $(selectIncludeSelf('form', e.target)).each(function (i, v) {
            if (!app.emit('reset', v, null, false)) {
                v.reset();
            }
        });
        $(selectIncludeSelf('[x-autoplay]', e.target)).each(function (i, v) {
            v.pause();
        });
    });

    app.on('statechange', function (e) {
        if (containsOrEquals(e.target, pageTitleElement)) {
            document.title = evalAttr(pageTitleElement, 'page-title', true);
        }
    });

    app.on('mounted', function (e) {
        var element = e.target;
        $(selectIncludeSelf('img[src^="/"], video[src^="/"]', element)).each(function (i, v) {
            v.src = withBaseUrl(v.getAttribute('src'));
        });
        if (!options.explicitBaseUrl) {
            $(selectIncludeSelf('a[href^="/"]', element)).each(function (i, v) {
                var href = v.getAttribute('href');
                v.dataset.href = href;
                v.href = withBaseUrl(href);
            });
        }
    });

    dom.ready.then(function () {
        // replace inline background-image to prevent browser to load unneccessary images
        $('[style]').each(function (i, v) {
            var backgroundImage = isCssUrlValue(v.style.backgroundImage);
            if (backgroundImage) {
                v.setAttribute('data-bg-src', decodeURIComponent(withBaseUrl(toRelativeUrl(backgroundImage))));
                v.style.backgroundImage = 'none';
            }
        });
        registerMatchPathElements();
    });

    watchElements(root, 'video[autoplay], audio[autoplay]', function (addedNodes) {
        $(addedNodes).attr('x-autoplay', '').removeAttr('autoplay');
    }, true);

    define(app, {
        isElementActive: isElementActive,
        beforePageEnter: function (path, callback) {
            if (isFunction(path)) {
                callback = path;
                path = '/*';
            }
            preloadHandlers.push({
                route: app.parseRoute(path),
                callback: throwNotFunction(callback)
            });
        },
        matchPath: function (path, selector, handler) {
            if (isFunction(selector)) {
                handler = selector;
                selector = null;
            }
            this.on('mounted', function (e) {
                var matchPath = e.target.getAttribute('match-path');
                if (matchPath && matchRoute(path, matchPath) && (!selector || $(e.target).is(selector))) {
                    handler.call(e.target, e.target);
                }
            });
        },
    });
}

export default addExtension('htmlRouter', function (app, options) {
    Router();
    app.useRouter(options);
    initHtmlRouter(app, options);
});
