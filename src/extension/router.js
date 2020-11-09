import History from "../include/history.js";
import { $, Map } from "../include/zeta/shim.js";
import { containsOrEquals, selectIncludeSelf, setClass } from "../include/zeta/domUtil.js";
import dom from "../include/zeta/dom.js";
import { extend, defineHiddenProperty, map, watch, defineObservableProperty, any, definePrototype, iequal, watchable, resolveAll, each, defineOwnProperty, resolve, createPrivateStore, throwNotFunction, defineAliasProperty, setImmediateOnce } from "../include/zeta/util.js";
import { appReady, install } from "../app.js";
import { batch, handleAsync, markUpdated, mountElement, preventLeave } from "../dom.js";
import { animateIn, animateOut } from "../anim.js";
import { groupLog } from "../util/console.js";
import { getQueryParam } from "../util/common.js";
import { normalizePath, combinePath, withBaseUrl, isSubPathOf, baseUrl, setBaseUrl } from "../util/path.js";
import { evalAttr, resetVar, setVar } from "../var.js";

const _ = createPrivateStore();
const matchByPathElements = new Map();
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

/**
 * @param {Zeta.AnyFunction} callback
 */
export function hookBeforePageEnter(callback) {
    preloadHandlers.push(throwNotFunction(callback));
}

function createRouteState(route, segments, params) {
    route = route || [];
    params = extend({}, params);
    delete params.remainingSegments;
    return {
        minPath: normalizePath(segments.slice(0, route.minLength).join('/')),
        maxPath: normalizePath(segments.slice(0, route.length).join('/')),
        route: route,
        params: params
    };
}

function Route(app, routes, initialPath) {
    var self = this;
    var state = _(self, {});
    state.routes = routes.map(function (path) {
        var tokens = [];
        var minLength;
        // @ts-ignore: no side effect to not return
        String(path).replace(/\/(\*|[^{][^\/]*|\{([a.-z_$][a-z0-9_$]*)(\?)?(?::(?![*+?])((?:(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])([*+?]|\{\d+(?:,\d+)\})?)+))?\})(?=\/|$)/gi, function (v, a, b, c, d) {
            if (c && !minLength) {
                minLength = tokens.length;
            }
            tokens.push(b ? { name: b, pattern: d ? new RegExp('^' + d + '$', 'i') : /./ } : a.toLowerCase());
            self[b || 'remainingSegments'] = null;
        });
        defineHiddenProperty(tokens, 'value', path);
        defineHiddenProperty(tokens, 'exact', !(tokens[tokens.length - 1] === '*' && tokens.splice(-1)));
        defineHiddenProperty(tokens, 'minLength', minLength || tokens.length);
        defineHiddenProperty(tokens, 'names', map(tokens, function (v) {
            return v.name;
        }));
        return tokens;
    });
    Object.preventExtensions(self);
    extend(self, self.parse(initialPath));
    state.current = state.lastMatch;
    state.handleChanges = watch(self, true);

    Object.getOwnPropertyNames(self).forEach(function (prop) {
        defineObservableProperty(self, prop);
    });
    watch(self, function () {
        var compareState = function (input) {
            return any(input.params, function (v, i) {
                return v !== self[i];
            }) === false;
        };
        var paramChanged = false;
        var routeChanged = !compareState(state.current);
        if (routeChanged && state.lastMatch) {
            state.current = state.lastMatch;
            routeChanged = !compareState(state.current);
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
                    if (i !== 'remainingSegments' && self[i] && tokens.names.indexOf(i) < 0) {
                        self[i] = null;
                        paramChanged = true;
                    }
                }
                return true;
            });
            state.current = createRouteState(matched, segments, self);
        }
        if ((state.current.route || '').exact && self.remainingSegments !== '/') {
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
        var segments = normalizePath(path).slice(1).split('/');
        var params = {};

        var matched = any(state.routes, function (tokens) {
            params = {};
            if (segments.length < tokens.minLength) {
                return false;
            }
            for (var i = 0, len = tokens.length; i < len; i++) {
                var varname = tokens[i].name;
                if (segments[i] && !(varname ? tokens[i].pattern.test(segments[i]) : iequal(segments[i], tokens[i]))) {
                    return false;
                }
                if (varname) {
                    params[varname] = segments[i];
                }
            }
            params.remainingSegments = tokens.exact ? '/' : normalizePath(segments.slice(tokens.length).join('/'));
            return true;
        });
        for (var i in self) {
            params[i] = params[i] || null;
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
        path = decodeURI(path);
        currentPath = currentPath || app.path;
        if (path[0] === '~') {
            var parsedState = iequal(currentPath, route.toString()) ? _(route).current : route.parse(currentPath) && _(route).lastMatch;
            path = combinePath(parsedState.minPath, path.slice(1));
        } else if (path[0] !== '/') {
            path = combinePath(currentPath, path);
        }
        path = normalizePath(path, true);
        if (path.indexOf('{') < 0) {
            return path;
        }
        return path.replace(/\{([^}]+)\}/g, function (v, a) {
            return route[a] || v;
        });
    }

    function navigate(path, replace) {
        path = withBaseUrl(resolvePath(path));
        History[replace ? 'replaceState' : 'pushState']({}, document.title, path);
        app.path = path.substr(baseUrl.length) || '/';
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
        var pageTitle = evalAttr(pageTitleElement, 'page-title', true);
        if (location.pathname.substr(baseUrl.length) !== path) {
            History[navigated ? 'pushState' : 'replaceState']({}, pageTitle, withBaseUrl(path));
        }
        navigated++;
        document.title = pageTitle;

        batch(true, function () {
            groupLog(eventSource, ['pageenter', path], function () {
                matchByPathElements.forEach(function (element) {
                    var matched = activeElements.indexOf(element) >= 0;
                    if (matched === (previousActiveElements.indexOf(element) < 0)) {
                        if (matched) {
                            resetVar(element, false);
                            setVar(element, null);
                            setTimeout(function () {
                                // animation and pageenter event of inner scope
                                // must be after those of parent scope
                                var dependencies = preload.get($(element).parents('[match-path]')[0]);
                                var promises = preloadHandlers.map(function (v) {
                                    return v(element, path);
                                });
                                promises.push(dependencies);
                                preload.set(element, resolveAll(promises, function () {
                                    if (activeElements.indexOf(element) >= 0) {
                                        setClass(element, 'hidden', false);
                                        animateIn(element, 'show', '[match-path]');
                                        dom.emit('pageenter', element, { pathname: path }, true);
                                    }
                                }));
                            });
                        } else {
                            dom.emit('pageleave', element, { pathname: oldPath }, true);
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
        if (promise) {
            lockedPath = currentPath;
            navigate(currentPath, true);
            resolve(promise).then(function () {
                navigate(newPath, true);
            });
            return;
        }
        lockedPath = null;

        // find active elements i.e. with match-path that is equal to or is parent of the new path
        /** @type {HTMLElement[]} */
        var newActiveElements = [dom.root];
        var oldPath = currentPath;
        var redirectPath;
        batch(true, function () {
            matchByPathElements.forEach(function (v, placeholder) {
                var targetPath = resolvePath(v.getAttribute('match-path'), newPath);
                var matched = $('[switch=""]', v)[0] ? isSubPathOf(newPath, targetPath) : newPath === targetPath;
                if (matched) {
                    newActiveElements.unshift(v);
                    if (!v.parentNode) {
                        $(placeholder).replaceWith(v);
                        markUpdated(v);
                        mountElement(v);
                    }
                }
            });
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

        promise = app.emit('navigate', {
            pathname: newPath,
            oldPathname: oldPath,
            route: Object.freeze(extend({}, route))
        });
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
                // @ts-ignore: History.js
                History.back();
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
            // detach elements which its visibility is controlled by current path
            $('[match-path]').addClass('hidden').each(function (i, v) {
                var placeholder = document.createElement('div');
                placeholder.setAttribute('style', 'display: none !important');
                placeholder.setAttribute('match-path', v.getAttribute('match-path') || '');
                if (v.attributes.default) {
                    placeholder.setAttribute('default', '');
                }
                $(v).before(placeholder);
                $(v).detach();
                matchByPathElements.set(placeholder, v);
            });
            // @ts-ignore: History.js
            History.Adapter.bind(window, 'statechange', function () {
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
