import { bind } from "../include/zeta-dom/domUtil.js";
import dom from "../include/zeta-dom/dom.js";
import { cancelLock, locked, notifyAsync } from "../include/zeta-dom/domLock.js";
import { extend, watch, defineObservableProperty, any, definePrototype, iequal, watchable, each, defineOwnProperty, resolve, createPrivateStore, setImmediateOnce, exclude, equal, isArray, single, randomId, always, setImmediate, noop, pick, keys, isPlainObject, kv, errorWithCode, deepFreeze, freeze, isUndefinedOrNull, deferrable, reject, pipe } from "../include/zeta-dom/util.js";
import { addExtension, appReady } from "../app.js";
import { getQueryParam, setQueryParam } from "../util/common.js";
import { normalizePath, combinePath, isSubPathOf, setBaseUrl, removeQueryAndHash, toSegments, parsePath } from "../util/path.js";
import * as ErrorCode from "../errorCode.js";

const SESSION_KEY = 'brew.history.';

const _ = createPrivateStore();
const parsedRoutes = {};
const sessionStorage = window.sessionStorage;
const root = dom.root;

var baseUrl;
var constant = function (value) {
    return pipe.bind(0, value);
};
var isAppPath = function (path) {
    return !!isSubPathOf(path, baseUrl);
};
var fromPathname = function (path) {
    return isSubPathOf(path, baseUrl) || '/';
};
var toPathname = function (path) {
    return combinePath(baseUrl, path);
};
export var fromRoutePath = pipe;
export var toRoutePath = pipe;

export function matchRoute(route, segments, ignoreExact) {
    if (!route || !route.test) {
        route = parseRoute(route);
    }
    if (!isArray(segments)) {
        segments = toSegments(segments);
    }
    return route.test(segments, ignoreExact);
}

function getCurrentQuery() {
    return location.search + location.hash;
}

function getCurrentPathAndQuery() {
    return location.pathname + getCurrentQuery();
}

function RoutePattern(props) {
    extend(this, props);
}

definePrototype(RoutePattern, Array, {
    has: function (name) {
        return name in this.params;
    },
    match: function (index, value) {
        if (typeof index === 'string') {
            index = this.params[index];
        }
        var part = this[index];
        return !!part && (part.name ? part.test(value) : iequal(part, value));
    },
    test: function (segments, ignoreExact) {
        var self = this;
        return segments.length >= self.minLength && (ignoreExact || !self.exact || segments.length <= self.length) && !any(self, function (v, i) {
            return segments[i] && !(v.name ? v.test(segments[i]) : iequal(segments[i], v));
        });
    }
});

function parseRoute(path) {
    path = String(path);
    if (!parsedRoutes[path]) {
        var tokens = new RoutePattern();
        var params = {};
        var minLength;
        path.replace(/\/(\*|[^{][^\/]*|\{([a.-z_$][a-z0-9_$]*)(\?)?(?::(?![*+?])((?:(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])([*+?]|\{\d+(?:,\d+)\})?)+))?\})(?=\/|$)/gi, function (v, a, b, c, d) {
            if (c && !minLength) {
                minLength = tokens.length;
            }
            if (b) {
                var re = d ? new RegExp('^' + d + '$', 'i') : /./;
                params[b] = tokens.length;
                tokens.push({ name: b, test: re.test.bind(re) });
            } else {
                tokens.push(a.toLowerCase());
            }
        });
        extend(tokens, {
            pattern: path,
            params: params,
            exact: !(tokens[tokens.length - 1] === '*' && tokens.splice(-1)),
            minLength: minLength || tokens.length
        });
        parsedRoutes[path] = deepFreeze(tokens);
    }
    return parsedRoutes[path];
}

function createRouteState(route, segments, params) {
    route = route || [];
    segments = segments.map(encodeURIComponent);
    return {
        route: route,
        params: exclude(params, ['remainingSegments']),
        minPath: normalizePath(segments.slice(0, route.minLength).join('/')),
        maxPath: normalizePath(segments.slice(0, route.length).join('/'))
    };
}

function matchRouteByParams(routes, params, partial) {
    var matched = single(routes, function (tokens) {
        var valid = single(tokens.params, function (v, i) {
            return params[i] !== null;
        });
        if (valid && !partial) {
            valid = !single(params, function (v, i) {
                return v && i !== 'remainingSegments' && !tokens.has(i);
            });
        }
        if (!valid) {
            return;
        }
        var segments = [];
        for (var i = 0, len = tokens.length; i < len; i++) {
            var varname = tokens[i].name;
            if (varname && !tokens[i].test(params[varname] || '')) {
                if (i < tokens.minLength || params[varname]) {
                    return false;
                }
                break;
            }
            segments[i] = varname ? params[varname] : tokens[i];
        }
        return createRouteState(tokens, segments, pick(params, keys(tokens.params)));
    });
    return matched || (!partial && matchRouteByParams(routes, params, true));
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
        defineObservableProperty(self, prop, null, function (v) {
            return isUndefinedOrNull(v) || v === '' ? null : String(v);
        });
    });
    watch(self, function () {
        var current = state.lastMatch;
        if (!equal(current.params, exclude(self, ['remainingSegments']))) {
            current = matchRouteByParams(state.routes, self) || state.current;
        }
        var remainingSegments = current.route.exact ? '/' : normalizePath(self.remainingSegments);
        var newPath = fromRoutePath(combinePath(current.maxPath, remainingSegments));
        state.current = current;
        self.set(extend({}, state.params, current.params, {
            remainingSegments: remainingSegments
        }));
        if (!iequal(newPath, removeQueryAndHash(app.path))) {
            app.path = newPath;
        }
    });
}

definePrototype(Route, {
    parse: function (path) {
        var self = this;
        var state = _(self);
        var segments = toSegments(toRoutePath(removeQueryAndHash(path)));
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
        var result;
        _(self).handleChanges(function () {
            var path = self.getPath(extend(self, isPlainObject(key) || kv(key, value)));
            result = _(self).app.navigate(path + (path === self.toString() ? getCurrentQuery() : ''), true);
        });
        return result;
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
    var route;
    var basePath = '/';
    var currentPath = '';
    var redirectSource = {};
    var currentIndex = 0;
    var indexOffset = 0;
    var pendingState;
    var lastState = {};
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

    function createState(id, path, index) {
        var resolvePromise = noop;
        var rejectPromise = noop;
        var pathNoQuery = removeQueryAndHash(path);
        var promise, resolved;
        var state = {
            id: id,
            path: path,
            index: index,
            pathname: pathNoQuery,
            route: freeze(route.parse(pathNoQuery)),
            previous: states[currentIndex],
            handled: false,
            get done() {
                return resolved;
            },
            get promise() {
                return promise || (promise = new Promise(function (resolve_, reject_) {
                    resolvePromise = resolve_;
                    rejectPromise = reject_;
                }));
            },
            reset: function () {
                state.handled = false;
                if (resolved) {
                    resolved = false;
                    promise = null;
                }
                return state;
            },
            forward: function (other) {
                if (promise && !resolved) {
                    other.promise.then(function (data) {
                        state.resolve(createNavigateResult(data.id, data.path, state.path, data.navigated));
                    }, state.reject);
                }
            },
            resolve: function (result) {
                resolved = true;
                resolvePromise(result || createNavigateResult(id, state.path));
                if (pendingState === state) {
                    pendingState = null;
                    lastState = state;
                    app.emit('pageload', { pathname: state.path }, { handleable: false });
                }
            },
            reject: function (error) {
                promise = null;
                rejectPromise(error || errorWithCode(ErrorCode.navigationCancelled));
                if (pendingState === state) {
                    pendingState = null;
                }
            }
        };
        return state;
    }

    function updatePath(state, path) {
        if (removeQueryAndHash(path) === state.pathname) {
            state.path = path;
            if (history.state === state.id) {
                history.replaceState(state.id, '', toPathname(path));
                if (state.done) {
                    currentPath = path;
                    app.path = path;
                }
            }
            return true;
        }
    }

    function applyState(state, replace, callback) {
        if (pendingState && pendingState !== state) {
            if (replace) {
                pendingState.forward(state);
            } else {
                pendingState.reject();
            }
        }
        pendingState = state;
        if (appReady && locked(root)) {
            cancelLock(root).then(function () {
                if (pendingState === state && callback()) {
                    setImmediateOnce(handlePathChange);
                }
            }, function () {
                state.reject(errorWithCode(ErrorCode.navigationRejected));
            });
        } else if (callback()) {
            setImmediateOnce(handlePathChange);
        }
    }

    function pushState(path, replace) {
        path = resolvePath(path);
        if (!isSubPathOf(path, basePath)) {
            return { promise: reject(errorWithCode(ErrorCode.navigationRejected)) };
        }
        var currentState = pendingState || states[currentIndex];
        if (currentState && updatePath(currentState, path)) {
            if (currentState.done) {
                return { promise: resolve(createNavigateResult(currentState.id, path, null, false)) };
            }
            return currentState;
        }

        var id = randomId();
        var index = Math.max(0, currentIndex + !replace);
        var state = createState(id, path, indexOffset + index);
        applyState(state, replace, function () {
            currentIndex = index;
            if (!replace) {
                states.splice(currentIndex);
            }
            states[currentIndex] = state;
            history[replace ? 'replaceState' : 'pushState'](id, '', toPathname(path));
            sessionStorage.setItem(SESSION_KEY + baseUrl, JSON.stringify(states.map(function (v) {
                return [v.id, v.path, v.index];
            })));
            return true;
        });
        return state;
    }

    function popState(index, isNative) {
        var state = states[index].reset();
        var step = state.index - states[currentIndex].index;
        var isLocked = locked(root);
        if (isLocked && isNative && step) {
            history.go(-step);
        }
        applyState(state, false, function () {
            currentIndex = index;
            if (!isNative || isLocked) {
                history.go(step);
            }
            return isNative && !isLocked;
        });
        return state;
    }

    function resolvePath(path, currentPath, isRoutePath) {
        var parsedState;
        path = decodeURI(path) || '/';
        currentPath = currentPath || app.path;
        if (path[0] === '~' || path.indexOf('{') >= 0) {
            var fullPath = (isRoutePath ? fromRoutePath : pipe)(currentPath);
            parsedState = iequal(fullPath, route.toString()) ? _(route).current : route.parse(fullPath) && _(route).lastMatch;
            path = path.replace(/\{([^}?]+)(\??)\}/g, function (v, a, b, i) {
                return parsedState.params[a] || ((b && i + v.length === path.length) ? '' : 'null');
            });
        }
        if (path[0] === '~') {
            path = (isRoutePath ? pipe : fromRoutePath)(combinePath(parsedState.minPath, path.slice(1)));
        } else if (path[0] !== '/') {
            path = combinePath(currentPath, path);
        }
        return normalizePath(path, true);
    }

    function processPageChange(state) {
        var path = state.path;
        var deferred = deferrable();

        currentPath = path;
        app.path = path;
        route.set(path);
        app.emit('beforepageload', { pathname: path, waitFor: deferred.waitFor }, { handleable: false });

        always(deferred, function () {
            if (states[currentIndex] === state) {
                redirectSource = {};
                state.resolve();
            }
        });
    }

    function handlePathChange() {
        if (!appReady) {
            return;
        }
        var state = states[currentIndex];
        var newPath = state.path;
        if (lastState && state.pathname === removeQueryAndHash(currentPath) && updatePath(lastState, newPath)) {
            state.resolve(createNavigateResult(lastState.id, newPath, null, false));
            return;
        }
        if (state.handled) {
            return;
        }
        state.handled = true;

        // prevent infinite redirection loop
        // redirectSource will not be reset until processPageChange is fired
        var previous = state.previous;
        if (previous && redirectSource[newPath] && redirectSource[previous.path]) {
            processPageChange(state);
            return;
        }
        redirectSource[newPath] = true;

        console.log('Nagivate', newPath);
        var promise = resolve(app.emit('navigate', {
            pathname: newPath,
            oldPathname: lastState.path,
            oldStateId: lastState.id,
            newStateId: state.id,
            route: state.route
        }));
        notifyAsync(root, promise);
        promise.then(function () {
            if (states[currentIndex] === state) {
                processPageChange(state);
            }
        });
    }

    defineObservableProperty(app, 'path', '', function (newValue) {
        if (!appReady) {
            return currentPath;
        }
        newValue = resolvePath(newValue);
        if (newValue !== currentPath) {
            pushState(newValue);
        }
        return currentPath;
    });

    baseUrl = normalizePath(options.baseUrl);
    if (options.urlMode === 'none') {
        baseUrl = '/';
        isAppPath = constant(false);
        fromPathname = constant(baseUrl);
        toPathname = getCurrentPathAndQuery;
    } else if (options.urlMode === 'query') {
        baseUrl = '/';
        isAppPath = function (path) {
            return (path || '')[0] === '?' || /^\/($|[?#])/.test(isSubPathOf(path, location.pathname) || '');
        };
        fromPathname = function () {
            return getQueryParam(options.queryParam) || baseUrl;
        };
        toPathname = function (path) {
            path = parsePath(path);
            return setQueryParam(options.queryParam, path.pathname, path.search || '?') + path.hash;
        };
    } else if (baseUrl === '/') {
        fromPathname = pipe;
        toPathname = pipe;
    } else if (options.explicitBaseUrl) {
        fromRoutePath = toPathname;
        toRoutePath = fromPathname;
        fromPathname = pipe;
        toPathname = pipe;
        basePath = baseUrl;
    } else {
        isAppPath = function (path) {
            return (path || '')[0] === '/';
        };
        setBaseUrl(baseUrl);
    }
    var initialPath = options.initialPath || (options.queryParam && getQueryParam(options.queryParam));
    var includeQuery = !initialPath;
    initialPath = initialPath || fromPathname(location.pathname);
    if (!isSubPathOf(initialPath, basePath)) {
        initialPath = basePath;
    }
    route = new Route(app, options.routes, initialPath);

    app.define({
        get canNavigateBack() {
            return currentIndex > 0;
        },
        get previousPath() {
            return (states[currentIndex - 1] || '').path || null;
        },
        matchRoute: matchRoute,
        parseRoute: parseRoute,
        resolvePath: resolvePath,
        isAppPath: isAppPath,
        navigate: function (path, replace) {
            return pushState(path, replace).promise;
        },
        back: function (defaultPath) {
            if (currentIndex > 0) {
                return popState(currentIndex - 1).promise;
            } else {
                return !!defaultPath && pushState(defaultPath).promise;
            }
        }
    });
    defineOwnProperty(app, 'basePath', basePath, true);
    defineOwnProperty(app, 'initialPath', initialPath + (includeQuery ? location.search : ''), true);
    defineOwnProperty(app, 'route', route, true);
    defineOwnProperty(app, 'routes', freeze(options.routes));

    bind(window, 'popstate', function () {
        var index = states.findIndex(function (v, i) {
            return v.id === history.state;
        });
        if (index >= 0) {
            popState(index, true);
        } else {
            pushState(fromPathname(location.pathname));
        }
    });

    try {
        each(JSON.parse(sessionStorage.getItem(SESSION_KEY + baseUrl) || '[]'), function (i, v) {
            states.push(createState.apply(0, v));
            currentIndex = i;
        });
    } catch (e) { }

    var initialState;
    var index = states.findIndex(function (v) {
        return v.id === history.state;
    });
    if (index >= 0) {
        currentIndex = index;
        indexOffset = states[index].index - currentIndex;
    } else {
        currentIndex = states.length;
        indexOffset = history.length - currentIndex;
        initialState = pushState(initialPath + (includeQuery ? getCurrentQuery() : ''), true);
    }
    app.on('ready', function () {
        if (pendingState === initialState && includeQuery) {
            pushState(initialPath + getCurrentQuery(), true);
        }
        handlePathChange();
    });
}

parsedRoutes['/*'] = deepFreeze(new RoutePattern({
    value: '/*',
    exact: false,
    length: 0,
    minLength: 0,
    params: {},
    test: function () {
        return true;
    }
}));

export default addExtension('router', configureRouter);
