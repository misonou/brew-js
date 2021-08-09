import $ from "../include/external/jquery.js";
import { bind, containsOrEquals, selectIncludeSelf, setClass } from "../include/zeta-dom/domUtil.js";
import dom from "../include/zeta-dom/dom.js";
import { extend, watch, defineObservableProperty, any, definePrototype, iequal, watchable, resolveAll, each, defineOwnProperty, resolve, createPrivateStore, throwNotFunction, defineAliasProperty, setImmediateOnce, exclude, equal, mapGet, grep, isFunction, isArray, define, single } from "../include/zeta-dom/util.js";
import { appReady, install } from "../app.js";
import { batch, handleAsync, markUpdated, mountElement, preventLeave } from "../dom.js";
import { animateIn, animateOut } from "../anim.js";
import { groupLog } from "../util/console.js";
import { getQueryParam } from "../util/common.js";
import { normalizePath, combinePath, withBaseUrl, isSubPathOf, baseUrl, setBaseUrl } from "../util/path.js";
import { evalAttr, resetVar, setVar } from "../var.js";

const _ = createPrivateStore();
const matchByPathElements = new Map();
const parsedRoutes = {};
const preloadHandlers = [];

/** @type {Element[]} */
var activeElements = [dom.root];
var pageTitleElement;

/**
 * @param {Element} v
 * @param {Element[]=} arr
 */
export function isElementActive(v, arr) {
    var parent = $(v).closest('[match-path]')[0];
    return !parent || (arr || activeElements).indexOf(parent) >= 0;
}

export function hookBeforePageEnter(path, callback) {
    if (isFunction(path)) {
        callback = path;
        path = '/*';
    }
    preloadHandlers.push({
        route: parseRoute(path),
        callback: throwNotFunction(callback)
    });
}

export function matchRoute(route, segments, ignoreExact) {
    if (!route || !route.test) {
        route = parseRoute(route);
    }
    if (!isArray(segments)) {
        segments = toSegments(segments);
    }
    return route.test(segments, ignoreExact);
}

function toSegments(path) {
    path = normalizePath(path);
    return path === '/' ? [] : path.slice(1).split('/');
}

function parseRoute(path) {
    path = String(path);
    if (!parsedRoutes[path]) {
        var tokens = [];
        var params = {};
        var minLength;
        path.replace(/\/(\*|[^{][^\/]*|\{([a.-z_$][a-z0-9_$]*)(\?)?(?::(?![*+?])((?:(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])([*+?]|\{\d+(?:,\d+)\})?)+))?\})(?=\/|$)/gi, function (v, a, b, c, d) {
            if (c && !minLength) {
                minLength = tokens.length;
            }
            if (b) {
                params[b] = tokens.length;
            }
            tokens.push(b ? { name: b, pattern: d ? new RegExp('^' + d + '$', 'i') : /./ } : a.toLowerCase());
        });
        define(tokens, {
            value: path,
            params: params,
            exact: !(tokens[tokens.length - 1] === '*' && tokens.splice(-1)),
            minLength: minLength || tokens.length,
            test: function (segments, ignoreExact) {
                // @ts-ignore: custom properties on array
                return segments.length >= tokens.minLength && (ignoreExact || !tokens.exact || segments.length <= tokens.length) && !any(tokens, function (v, i) {
                    return segments[i] && !(v.name ? v.pattern.test(segments[i]) : iequal(segments[i], v));
                });
            }
        });
        parsedRoutes[path] = tokens;
    }
    return parsedRoutes[path];
}

function createRouteState(route, segments, params) {
    route = route || [];
    return {
        route: route,
        params: exclude(params, ['remainingSegments']),
        minPath: normalizePath(segments.slice(0, route.minLength).join('/')),
        maxPath: normalizePath(segments.slice(0, route.length).join('/'))
    };
}

function Route(app, routes, initialPath) {
    var self = this;
    var state = _(self, {
        routes: routes.map(parseRoute)
    });
    each(state.routes, function (i, v) {
        each(v.params, function (i) {
            self[i] = null;
        });
    });
    extend(self, self.parse(initialPath));
    state.current = state.lastMatch;
    state.handleChanges = watch(self, true);

    Object.preventExtensions(self);
    Object.getOwnPropertyNames(self).forEach(function (prop) {
        defineObservableProperty(self, prop);
    });
    watch(self, function () {
        var current = exclude(self, ['remainingSegments']);
        var paramChanged = false;
        var routeChanged = !equal(current, state.current.params);
        if (routeChanged && state.lastMatch) {
            state.current = state.lastMatch;
            routeChanged = !equal(current, state.current.params);
        }
        if (routeChanged) {
            var segments = [], i, len;
            var matched = any(state.routes, function (tokens) {
                segments.length = 0;
                for (i = 0, len = tokens.length; i < len; i++) {
                    var varname = tokens[i].name;
                    if (varname && i < tokens.minLength && !tokens[i].pattern.test(self[varname] || '')) {
                        return false;
                    }
                    segments[i] = varname ? self[varname] : tokens[i];
                }
                for (i in self) {
                    if (i !== 'remainingSegments' && self[i] && !(i in tokens.params)) {
                        self[i] = null;
                        paramChanged = true;
                    }
                }
                return true;
            });
            state.current = createRouteState(matched, segments, self);
        }
        if (state.current.route.exact && self.remainingSegments !== '/') {
            self.remainingSegments = '/';
            return;
        }
        if (paramChanged) {
            return;
        }
        app.navigate(self.toString());
    });
}

definePrototype(Route, {
    parse: function (path) {
        var self = this;
        var state = _(self);
        var segments = toSegments(path);
        var matched = any(state.routes, function (tokens) {
            return matchRoute(tokens, segments, true);
        });
        var params = {};
        if (matched) {
            for (var i in self) {
                params[i] = segments[matched.params[i]] || null;
            }
            params.remainingSegments = matched.exact ? '/' : normalizePath(segments.slice(matched.length).join('/'));
        }
        state.lastMatch = createRouteState(matched, segments, params);
        return params;
    },
    set: function (params) {
        var self = this;
        if (typeof params === 'string') {
            if (iequal(params, self.toString())) {
                return;
            }
            params = self.parse(params);
        }
        _(self).handleChanges(function () {
            extend(self, params);
        });
    },
    toString: function () {
        // @ts-ignore: unable to infer this
        return combinePath(_(this).current.maxPath || '/', this.remainingSegments);
    }
});
watchable(Route.prototype);

/**
 * @param {Brew.AppInstance<Brew.WithRouter>} app
 * @param {Record<string, any>} options
 */
function configureRouter(app, options) {
    var initialPath = app.path || options.initialPath || (options.queryParam && getQueryParam(options.queryParam)) || location.pathname.substr(options.baseUrl.length) || '/';
    var route = new Route(app, options.routes, initialPath);
    var currentPath = '';
    var observable = {};
    var redirectSource = {};
    var lockedPath;
    var newPath;
    var navigated = 0;

    function resolvePath(path, currentPath) {
        var parsedState;
        path = decodeURI(path);
        currentPath = currentPath || app.path;
        if (path[0] === '~' || path.indexOf('{') >= 0) {
            parsedState = iequal(currentPath, route.toString()) ? _(route).current : route.parse(currentPath) && _(route).lastMatch;
            path = path.replace(/\{([^}?]+)(\??)\}/g, function (v, a, b, i) {
                return parsedState.params[a] || ((b && i + v.length === path.length) ? '' : 'null');
            });
        }
        if (path[0] === '~') {
            path = combinePath(parsedState.minPath, path.slice(1));
        } else if (path[0] !== '/') {
            path = combinePath(currentPath, path);
        }
        return normalizePath(path, true);
    }

    function navigate(path, replace) {
        path = withBaseUrl(resolvePath(path));
        if (path !== location.pathname) {
            history[replace ? 'replaceState' : 'pushState']({}, document.title, path);
        }
        app.path = baseUrl === '/' ? path : path.substr(baseUrl.length) || '/';
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

    function processPageChange(path, oldPath, newActiveElements) {
        if (currentPath !== path) {
            return;
        }
        var preload = new Map();
        var eventSource = dom.eventSource;
        var previousActiveElements = activeElements.slice(0);
        activeElements = newActiveElements;
        pageTitleElement = $(newActiveElements).filter('[page-title]')[0];
        redirectSource = {};

        // assign document title from matched active elements and
        // synchronize path in address bar if navigation is triggered by script
        var pageTitle = pageTitleElement ? evalAttr(pageTitleElement, 'page-title', true) : document.title;
        if (location.pathname.substr(baseUrl.length) !== path) {
            history[navigated ? 'pushState' : 'replaceState']({}, pageTitle, withBaseUrl(path));
        }
        navigated++;
        document.title = pageTitle;

        batch(true, function () {
            groupLog(eventSource, ['pageenter', path], function () {
                matchByPathElements.forEach(function (element, placeholder) {
                    var matched = activeElements.indexOf(element) >= 0;
                    if (element !== placeholder && matched === (previousActiveElements.indexOf(element) < 0)) {
                        if (matched) {
                            resetVar(element, false);
                            setVar(element);
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
                                    animateIn(element, 'show', '[match-path]');
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
                handleAsync(promise, element);
            });
        });
    }

    function handlePathChange() {
        if (newPath === currentPath) {
            return;
        }
        // forbid navigation when DOM is locked (i.e. [is-modal] from openFlyout) or leaving is prevented
        if (dom.locked(dom.activeElement, true)) {
            lockedPath = newPath === lockedPath ? null : currentPath;
            navigate(lockedPath || newPath, true);
            return;
        }
        var promise = preventLeave();
        var leavePath = newPath;
        if (promise) {
            lockedPath = currentPath;
            navigate(currentPath, true);
            resolve(promise).then(function () {
                navigate(leavePath, true);
            });
            return;
        }
        lockedPath = null;

        // find active elements i.e. with match-path that is equal to or is parent of the new path
        /** @type {HTMLElement[]} */
        var newActiveElements = [dom.root];
        var oldPath = currentPath;
        var redirectPath;
        registerMatchPathElements();
        batch(true, function () {
            var switchElements = $('[switch=""]').get();
            var current;
            while (current = switchElements.shift()) {
                if (isElementActive(current, newActiveElements)) {
                    var children = $(current).children('[match-path]').get().map(function (v) {
                        var element = mapGet(matchByPathElements, v) || v;
                        var children = $('[switch=""]', element).get();
                        var path = resolvePath(element.getAttribute('match-path'), newPath);
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
                        return (v.exact ? newPath === v.path : isSubPathOf(newPath, v.path)) && v.path;
                    });
                    each(children, function (i, v) {
                        if (v.path === matchedPath) {
                            var element = v.element;
                            newActiveElements.unshift(element);
                            if (v.placeholder) {
                                $(v.placeholder).replaceWith(element);
                                markUpdated(element);
                                mountElement(element);
                                switchElements.push.apply(switchElements, v.children);
                            }
                        }
                    });
                }
            }
        });

        // prevent infinite redirection loop
        // redirectSource will not be reset until processPageChange is fired
        if (redirectSource[newPath] && redirectSource[oldPath]) {
            processPageChange(newPath, oldPath, newActiveElements);
            return;
        }
        redirectSource[newPath] = true;

        // redirect to the default view if there is no match because every switch must have a match
        $('[switch=""]').each(function (i, v) {
            if (isElementActive(v, newActiveElements)) {
                var $children = $(v).children('[match-path]');
                var currentMatched = $children.filter(function (i, v) {
                    return newActiveElements.indexOf(v) >= 0;
                })[0];
                if (!currentMatched) {
                    redirectPath = ($children.filter('[default]')[0] || $children[0]).getAttribute('match-path');
                    return false;
                }
            }
        });
        if (redirectPath) {
            navigate(redirectPath, true);
            return;
        }

        console.log('Nagivate', newPath);
        currentPath = newPath;
        app.path = newPath;
        route.set(newPath);

        promise = resolve(app.emit('navigate', {
            pathname: newPath,
            oldPathname: oldPath,
            route: Object.freeze(extend({}, route))
        }));
        handleAsync(promise, dom.root, function () {
            processPageChange(newPath, oldPath, newActiveElements);
        });
    }

    watch(observable, true);
    defineObservableProperty(observable, 'path', '', function (newValue) {
        if (!appReady) {
            return currentPath;
        }
        newPath = resolvePath(newValue, currentPath);
        if (newPath !== currentPath) {
            setImmediateOnce(handlePathChange);
        }
        return currentPath;
    });

    setBaseUrl(options.baseUrl || '');
    app.define({
        resolvePath: resolvePath,
        navigate: navigate,
        back: function () {
            if (navigated > 1) {
                history.back();
            } else if (app.path !== '/') {
                navigate('/');
            }
        }
    });
    defineOwnProperty(app, 'initialPath', initialPath, true);
    defineOwnProperty(app, 'route', route, true);
    defineAliasProperty(app, 'path', observable);

    app.beforeInit(function () {
        dom.ready.then(function () {
            registerMatchPathElements();
            bind(window, 'popstate', function () {
                app.path = location.pathname.substr(baseUrl.length) || '/';
            });
        });
    });

    app.on('ready', function () {
        app.path = initialPath;
    });

    app.on('mounted', function (e) {
        var $autoplay = $(selectIncludeSelf('video[autoplay], audio[autoplay]', e.target));
        if ($autoplay[0]) {
            $autoplay.removeAttr('autoplay');
            app.on(e.target, {
                pageenter: function () {
                    $autoplay.each(function (i, v) {
                        // @ts-ignore: known element type
                        if (v.readyState !== 0) {
                            // @ts-ignore: known element type
                            v.currentTime = 0;
                        }
                        // @ts-ignore: known element type
                        v.play();
                    });
                },
                pageleave: function () {
                    $autoplay.each(function (i, v) {
                        // @ts-ignore: known element type
                        v.pause();
                    });
                }
            }, true);
        }
    })

    app.on('pageleave', function (e) {
        $(selectIncludeSelf('form', e.target)).each(function (i, v) {
            if (!app.emit('reset', v, null, false)) {
                // @ts-ignore: known element type
                v.reset();
            }
        });
    });

    app.on('statechange', function (e) {
        if (containsOrEquals(e.target, pageTitleElement)) {
            document.title = evalAttr(pageTitleElement, 'page-title', true);
        }
    });
}

install('router', function (app, options) {
    // @ts-ignore
    configureRouter(app, options || {});
});

parsedRoutes['/*'] = {
    value: '/*',
    exact: false,
    length: 0,
    minLength: 0,
    params: {},
    test: function () {
        return true;
    }
};
