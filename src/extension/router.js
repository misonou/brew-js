import $ from "../include/external/jquery.js";
import { bind, containsOrEquals, selectIncludeSelf, setClass } from "../include/zeta-dom/domUtil.js";
import dom from "../include/zeta-dom/dom.js";
import { extend, watch, defineObservableProperty, any, definePrototype, iequal, watchable, resolveAll, each, defineOwnProperty, resolve, createPrivateStore, throwNotFunction, defineAliasProperty, setImmediateOnce, exclude, equal, mapGet, isFunction, isArray, define, single, randomId, always, setImmediate, noop, pick, keys, isPlainObject, kv, errorWithCode } from "../include/zeta-dom/util.js";
import { addExtension, appReady } from "../app.js";
import { batch, handleAsync, markUpdated, mountElement, preventLeave } from "../dom.js";
import { animateIn, animateOut } from "../anim.js";
import { groupLog } from "../util/console.js";
import { getQueryParam } from "../util/common.js";
import { normalizePath, combinePath, isSubPathOf, baseUrl, setBaseUrl } from "../util/path.js";
import { evalAttr, resetVar, setVar } from "../var.js";
import * as ErrorCode from "../errorCode.js";

const _ = createPrivateStore();
const matchByPathElements = new Map();
const parsedRoutes = {};
const preloadHandlers = [];
const root = dom.root;

/** @type {Element[]} */
var activeElements = [root];
var pageTitleElement;

var pass = function (path) {
    return path;
};
var fromPathname = function (path) {
    return isSubPathOf(path, baseUrl) || '/';
};
var toPathname = function (path) {
    return combinePath(baseUrl, path);
};
var fromRoutePath = pass;
var toRoutePath = pass;

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

function matchRouteByParams(routes, params) {
    return single(routes, function (tokens) {
        var hasParam = single(tokens.params, function (v, i) {
            return params[i] !== null;
        });
        if (!hasParam) {
            return;
        }
        var segments = [];
        for (var i = 0, len = tokens.length; i < len; i++) {
            var varname = tokens[i].name;
            if (varname && !tokens[i].pattern.test(params[varname] || '')) {
                if (i < tokens.minLength || params[varname]) {
                    return false;
                }
                break;
            }
            segments[i] = varname ? params[varname] : tokens[i];
        }
        return createRouteState(tokens, segments, pick(params, keys(tokens.params)));
    });
}

function Route(app, routes, initialPath) {
    var self = this;
    var params = {};
    var state = _(self, {
        routes: routes.map(parseRoute),
        params: params,
        app: app
    });
    each(state.routes, function (i, v) {
        each(v.params, function (i) {
            params[i] = null;
        });
    });
    extend(self, params, self.parse(initialPath));
    state.current = state.lastMatch;
    state.handleChanges = watch(self, true);

    Object.preventExtensions(self);
    Object.getOwnPropertyNames(self).forEach(function (prop) {
        defineObservableProperty(self, prop);
    });
    watch(self, function () {
        var params = exclude(self, ['remainingSegments']);
        var current = state.current;
        var previous = current;
        var routeChanged = !equal(params, current.params);
        if (routeChanged && state.lastMatch) {
            current = state.lastMatch;
            state.lastMatch = null;
            routeChanged = !equal(params, current.params);
        }
        if (routeChanged) {
            current = matchRouteByParams(state.routes, params) || previous;
        }
        state.current = current;
        if (current.route.exact) {
            self.remainingSegments = '/';
        }
        self.set(extend({}, state.params, current.params));
        if (current !== previous) {
            app.path = fromRoutePath(combinePath(current.maxPath, self.remainingSegments));
        }
    });
}

definePrototype(Route, {
    parse: function (path) {
        var self = this;
        var state = _(self);
        var segments = toSegments(toRoutePath(path));
        var matched = any(state.routes, function (tokens) {
            return matchRoute(tokens, segments, true);
        });
        var params = {};
        if (matched) {
            for (var i in state.params) {
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
    replace: function (key, value) {
        var self = this;
        var path = self.getPath(extend(self, isPlainObject(key) || kv(key, value)));
        return _(self).app.navigate(path, true);
    },
    getPath: function (params) {
        var matched = matchRouteByParams(_(this).routes, params);
        return fromRoutePath(matched ? combinePath(matched.maxPath || '/', matched.route.exact ? '/' : params.remainingSegments) : '/');
    },
    toJSON: function () {
        return extend({}, this);
    },
    toString: function () {
        // @ts-ignore: unable to infer this
        return fromRoutePath(combinePath(_(this).current.maxPath || '/', this.remainingSegments));
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
    var currentIndex = -1;
    var states = [];

    function createNavigateResult(id, path, originalPath, navigated) {
        return Object.freeze({
            id: id,
            path: path,
            navigated: navigated !== false,
            redirected: !!originalPath,
            originalPath: originalPath || null
        });
    }

    function handleNoop(path, originalPath) {
        for (var i = currentIndex; i >= 0; i--) {
            if (states[i].result && states[i].path === path) {
                history.replaceState(history.state, '', toPathname(path));
                return createNavigateResult(states[i].result, path, originalPath, false);
            }
        }
    }

    function pushState(path, replace) {
        var currentState = states[currentIndex];
        path = resolvePath(path);
        if (currentState && path === currentState.path && path === newPath) {
            if (currentState.result) {
                return { promise: resolve(handleNoop(path)) };
            } else {
                return currentState;
            }
        }
        replace = replace || currentIndex < 0;
        // @ts-ignore: boolean arithmetics
        currentIndex = Math.max(0, currentIndex + !replace);

        var id = randomId();
        var resolvePromise = noop;
        var rejectPromise = noop;
        var promise, resolved;
        var previous = states.splice(currentIndex);
        var state = {
            id: id,
            path: path,
            result: '',
            get promise() {
                return promise || (promise = new Promise(function (resolve_, reject_) {
                    var wrapper = function (fn) {
                        return function (value) {
                            resolved = true;
                            fn(value);
                        };
                    };
                    resolved = false;
                    resolvePromise = wrapper(resolve_);
                    rejectPromise = wrapper(reject_);
                }));
            },
            reset: function () {
                if (resolved) {
                    promise = null;
                }
                return state;
            },
            forward: function (other) {
                if (promise && !resolved) {
                    (other.promise || other.then(function (other) {
                        return other.promise;
                    })).then(function (data) {
                        state.resolve(createNavigateResult(data.id, data.path, path));
                    }, rejectPromise);
                    rejectPromise = noop;
                }
            },
            resolve: function (result) {
                result = result || createNavigateResult(id, path);
                state.path = result.path;
                state.result = state.result || result.id;
                resolvePromise(result);
                each(states, function (i, v) {
                    v.reject();
                });
            },
            reject: function () {
                rejectPromise(errorWithCode(ErrorCode.navigationCancelled));
            }
        };
        states[currentIndex] = state;
        history[replace ? 'replaceState' : 'pushState'](id, '', toPathname(path));
        app.path = path;

        if (previous[0]) {
            if (replace && !previous[1]) {
                previous[0].forward(state);
            } else {
                setImmediate(function () {
                    each(previous, function (i, v) {
                        v.reject();
                    });
                });
            }
        }
        return state;
    }

    function popState() {
        history.back();
        return --currentIndex;
    }

    function resolvePath(path, currentPath, isRoutePath) {
        var parsedState;
        path = decodeURI(path) || '/';
        currentPath = currentPath || app.path;
        if (path[0] === '~' || path.indexOf('{') >= 0) {
            var fullPath = (isRoutePath ? fromRoutePath : pass)(currentPath);
            parsedState = iequal(fullPath, route.toString()) ? _(route).current : route.parse(fullPath) && _(route).lastMatch;
            path = path.replace(/\{([^}?]+)(\??)\}/g, function (v, a, b, i) {
                return parsedState.params[a] || ((b && i + v.length === path.length) ? '' : 'null');
            });
        }
        switch (path[0]) {
            case '~':
                return (isRoutePath ? pass : fromRoutePath)(combinePath(parsedState.minPath, path.slice(1)));
            case '/':
                return normalizePath(path, true);
            default:
                return combinePath(currentPath, path);
        }
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
        var state = states[currentIndex];
        var preload = new Map();
        var eventSource = dom.eventSource;
        var previousActiveElements = activeElements.slice(0);
        activeElements = newActiveElements;
        pageTitleElement = $(newActiveElements).filter('[page-title]')[0];
        redirectSource = {};

        // assign document title from matched active elements and
        document.title = pageTitleElement ? evalAttr(pageTitleElement, 'page-title', true) : document.title;

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
            always(resolveAll(preload), function () {
                state.resolve();
            });
        });
    }

    function handlePathChange() {
        var state = states[currentIndex];
        if (!state || location.pathname !== toPathname(newPath)) {
            pushState(newPath);
            state = states[currentIndex];
        }
        if (currentIndex > 0 && newPath === currentPath) {
            state.resolve(handleNoop(newPath));
            return;
        }

        // forbid navigation when DOM is locked (i.e. [is-modal] from openFlyout) or leaving is prevented
        var leavePath = newPath;
        var promise = dom.locked(root, true) ? dom.cancelLock(root) : preventLeave();
        if (promise) {
            lockedPath = newPath === lockedPath ? null : currentPath;
            promise = resolve(promise).then(function () {
                let state = pushState(leavePath);
                setImmediateOnce(handlePathChange);
                return state;
            }, function () {
                throw errorWithCode(ErrorCode.navigationRejected);
            });
            popState();
            state.forward(promise);
            return;
        }
        lockedPath = null;

        // find active elements i.e. with match-path that is equal to or is parent of the new path
        /** @type {HTMLElement[]} */
        var newActiveElements = [root];
        var oldPath = currentPath;
        var redirectPath;
        registerMatchPathElements();
        batch(true, function () {
            var newRoutePath = toRoutePath(newPath);
            var switchElements = $('[switch=""]').get();
            var current;
            while (current = switchElements.shift()) {
                if (isElementActive(current, newActiveElements)) {
                    var children = $(current).children('[match-path]').get().map(function (v) {
                        var element = mapGet(matchByPathElements, v) || v;
                        var children = $('[switch=""]', element).get();
                        var path = resolvePath(element.getAttribute('match-path'), newRoutePath, true);
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
                    redirectPath = fromRoutePath(($children.filter('[default]')[0] || $children[0]).getAttribute('match-path'));
                    return false;
                }
            }
        });
        if (redirectPath && redirectPath !== newPath) {
            if (redirectPath === currentPath) {
                state.resolve(handleNoop(redirectPath, newPath));
            } else {
                state.forward(pushState(redirectPath, true));
            }
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
        handleAsync(promise, root, function () {
            if (states[currentIndex] === state) {
                processPageChange(newPath, oldPath, newActiveElements);
            }
        });
    }

    watch(observable, true);
    defineObservableProperty(observable, 'path', '', function (newValue) {
        if (!appReady) {
            return currentPath;
        }
        newValue = resolvePath(newValue, currentPath);
        if (newValue !== currentPath && newValue !== newPath) {
            newPath = newValue;
            setImmediateOnce(handlePathChange);
        }
        return currentPath;
    });

    setBaseUrl(options.baseUrl || '');
    if (baseUrl === '/') {
        fromPathname = pass;
        toPathname = pass;
    } else if (options.explicitBaseUrl) {
        fromRoutePath = toPathname;
        toRoutePath = fromPathname;
        fromPathname = pass;
        toPathname = pass;
        if (!isSubPathOf(initialPath, baseUrl)) {
            initialPath = baseUrl;
        }
    }
    app.define({
        get canNavigateBack() {
            return currentIndex > 0;
        },
        get previousPath() {
            return (states[currentIndex - 1] || '').path || null;
        },
        resolvePath: resolvePath,
        navigate: function (path, replace) {
            return pushState(path, replace).promise;
        },
        back: function (defaultPath) {
            if (currentIndex > 0) {
                return states[popState()].reset().promise;
            } else {
                return !!defaultPath && pushState(defaultPath).promise;
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
                var index = single(states, function (v, i) {
                    return v.id === history.state && i + 1;
                });
                if (index) {
                    currentIndex = index - 1;
                    newPath = states[currentIndex].reset().path;
                    setImmediateOnce(handlePathChange);
                } else {
                    pushState(fromPathname(location.pathname));
                }
            });
        });
    });

    app.on('ready', function () {
        pushState(initialPath, true);
    });

    app.on('pageenter', function (e) {
        $(selectIncludeSelf('[x-autoplay]', e.target)).each(function (i, v) {
            if (isElementActive(v)) {
                // @ts-ignore: known element type
                if (v.readyState !== 0) {
                    // @ts-ignore: known element type
                    v.currentTime = 0;
                }
                // @ts-ignore: known element type
                v.play();
            }
        });
    });

    app.on('pageleave', function (e) {
        $(selectIncludeSelf('form', e.target)).each(function (i, v) {
            if (!app.emit('reset', v, null, false)) {
                // @ts-ignore: known element type
                v.reset();
            }
        });
        $(selectIncludeSelf('[x-autoplay]', e.target)).each(function (i, v) {
            // @ts-ignore: known element type
            v.pause();
        });
    });

    app.on('statechange', function (e) {
        if (containsOrEquals(e.target, pageTitleElement)) {
            document.title = evalAttr(pageTitleElement, 'page-title', true);
        }
    });

    dom.watchElements(root, 'video[autoplay], audio[autoplay]', function (addedNodes) {
        $(addedNodes).attr('x-autoplay', '').removeAttr('autoplay');
    }, true);
}

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

export default addExtension('router', configureRouter);
