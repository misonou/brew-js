import { bind } from "../include/zeta-dom/domUtil.js";
import dom from "../include/zeta-dom/dom.js";
import { cancelLock, locked, notifyAsync } from "../include/zeta-dom/domLock.js";
import { extend, watch, defineObservableProperty, any, definePrototype, iequal, watchable, each, defineOwnProperty, resolve, createPrivateStore, setImmediateOnce, exclude, equal, isArray, single, randomId, always, noop, pick, keys, isPlainObject, kv, errorWithCode, deepFreeze, freeze, isUndefinedOrNull, deferrable, reject, pipe, mapGet, mapObject } from "../include/zeta-dom/util.js";
import { addExtension, appReady } from "../app.js";
import { getQueryParam, setQueryParam } from "../util/common.js";
import { normalizePath, combinePath, isSubPathOf, setBaseUrl, removeQueryAndHash, toSegments, parsePath } from "../util/path.js";
import { createObjectStorage } from "../util/storage.js";
import * as ErrorCode from "../errorCode.js";

const _ = createPrivateStore();
const mapProto = Map.prototype;
const parsedRoutes = {};
const root = dom.root;

var states = [];
var baseUrl;
var storage;
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

function HistoryStorage(obj) {
    var map = new Map(obj && Object.entries(obj));
    Object.setPrototypeOf(map, HistoryStorage.prototype);
    return map;
}

function stringOrSymbol(key) {
    return typeof key === 'symbol' ? key : String(key);
}

definePrototype(HistoryStorage, Map, {
    has: function (k) {
        return mapProto.has.call(this, stringOrSymbol(k));
    },
    get: function (k) {
        return mapProto.get.call(this, stringOrSymbol(k));
    },
    set: function (k, v) {
        return mapProto.set.call(this, stringOrSymbol(k), v);
    },
    delete: function (k) {
        return mapProto.delete.call(this, stringOrSymbol(k));
    },
    toJSON: function () {
        return mapObject(this, pipe);
    }
});

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
        return fromRoutePath(combinePath(_(this).current.maxPath || '/', this.remainingSegments));
    }
});
watchable(Route.prototype);

function PageInfo(props) {
    for (var i in props) {
        defineOwnProperty(this, i, props[i], true);
    }
}

function pageInfoForEachState(self, callback) {
    var pageId = self.pageId;
    each(states, function (i, v) {
        if (v.pageId === pageId) {
            callback(v);
        }
    });
}

definePrototype(PageInfo, {
    clearNavigateData: function () {
        pageInfoForEachState(this, function (v) {
            v.data = null;
        });
        defineOwnProperty(this, 'data', null, true);
    },
    clearHistoryStorage: function () {
        pageInfoForEachState(this, function (v) {
            v.storage.clear();
        });
    }
});

/**
 * @param {Brew.AppInstance<Brew.WithRouter>} app
 * @param {Record<string, any>} options
 */
function configureRouter(app, options) {
    var sessionId = randomId();
    var resumedId = sessionId;
    var route;
    var basePath = '/';
    var currentPath = '';
    var redirectSource = {};
    var currentIndex = 0;
    var indexOffset = 0;
    var pendingState;
    var lastState = {};
    var pageInfos = {};

    function getPersistedStorage(key, ctor) {
        return storage.revive(key, ctor) || mapGet(storage, key, ctor);
    }

    function createNavigateResult(id, path, originalPath, navigated) {
        return Object.freeze({
            id: id,
            path: path,
            navigated: navigated !== false,
            redirected: !!originalPath,
            originalPath: originalPath || null
        });
    }

    function createState(id, path, index, snapshot, data, sessionId, previous, keepPreviousPath, storageMap) {
        previous = previous || states[currentIndex];
        if (storageMap) {
            storage.set(id, storageMap);
        }
        var resolvePromise = noop;
        var rejectPromise = noop;
        var pathNoQuery = removeQueryAndHash(path);
        var pageId = previous && snapshot ? previous.pageId : id;
        var resumedId = previous && (snapshot || sessionId === previous.sessionId) ? previous.resumedId : sessionId;
        var resolved, promise;
        var savedState = [id, path, index, snapshot, data, sessionId];
        var state = {
            id: id,
            path: path,
            index: index,
            pathname: pathNoQuery,
            route: freeze(route.parse(pathNoQuery)),
            data: data,
            type: 'navigate',
            previous: previous,
            previousPath: previous && (keepPreviousPath || snapshot ? previous.previousPath : previous.path),
            pageId: pageId,
            sessionId: sessionId,
            resumedId: resumedId,
            get done() {
                return resolved;
            },
            get promise() {
                return promise || (promise = resolve(resolved || new Promise(function (resolve_, reject_) {
                    resolvePromise = resolve_;
                    rejectPromise = reject_;
                })));
            },
            get pageInfo() {
                return pageInfos[pageId] || (pageInfos[pageId] = new PageInfo({
                    path: pathNoQuery,
                    pageId: pageId,
                    params: state.route,
                    data: data
                }));
            },
            get storage() {
                return storageMap || (storageMap = getPersistedStorage(id, HistoryStorage));
            },
            reset: function () {
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
                var previousState = lastState;
                resolved = result || createNavigateResult(id, state.path);
                resolvePromise(resolved);
                if (states[currentIndex] === state) {
                    lastState = state;
                    if (resolved.navigated) {
                        app.emit('pageload', { pathname: state.path }, { handleable: false });
                    } else if (state.type === 'back_forward') {
                        app.emit('popstate', { oldStateId: previousState.id, newStateId: state.id }, { handleable: false });
                    }
                }
            },
            reject: function (error) {
                promise = null;
                rejectPromise(error || errorWithCode(ErrorCode.navigationCancelled));
            },
            toJSON: function () {
                savedState[1] = state.path;
                savedState[4] = state.data;
                return savedState;
            }
        };
        return state;
    }

    function updateQueryAndHash(state, newPath, oldPath) {
        state.path = newPath;
        history.replaceState(state.id, '', toPathname(newPath));
        if (state.done) {
            var oldHash = parsePath(oldPath).hash;
            var newHash = parsePath(newPath).hash;
            currentPath = newPath;
            app.path = newPath;
            if (oldHash !== newHash) {
                app.emit('hashchange', { oldHash, newHash }, { handleable: false });
            }
            return { promise: resolve(createNavigateResult(state.pageId, newPath, null, false)) };
        }
        return state;
    }

    function applyState(state, replace, snapshot, previous, callback) {
        var currentState = states[currentIndex];
        if (currentState && currentState !== state && !currentState.done) {
            if (replace) {
                currentState.forward(state);
            } else {
                currentState.reject();
            }
        }
        if (appReady && !snapshot && locked(root)) {
            cancelLock(root).then(function () {
                if (states[currentIndex] === currentState && callback() !== false) {
                    setImmediateOnce(handlePathChange);
                }
            }, function () {
                state.reject(errorWithCode(ErrorCode.navigationRejected));
            });
        } else if (callback() !== false) {
            if (snapshot && previous.done) {
                state.resolve(createNavigateResult(state.pageId, state.path, null, false));
                updateQueryAndHash(state, state.path, currentState.path);
            } else {
                setImmediateOnce(handlePathChange);
            }
        }
    }

    function pushState(path, replace, snapshot, data, storageMap) {
        path = resolvePath(path);
        if (!isSubPathOf(path, basePath)) {
            return { promise: reject(errorWithCode(ErrorCode.navigationRejected)) };
        }
        var currentState = states[currentIndex];
        var previous = currentState;
        if (currentState) {
            var pathNoQuery = removeQueryAndHash(path);
            if (snapshot) {
                storageMap = new HistoryStorage(previous.storage.toJSON());
            } else if (pathNoQuery === currentState.pathname) {
                if (!currentState.done || replace || path === currentState.path) {
                    return updateQueryAndHash(currentState, path, currentState.path);
                }
                snapshot = true;
                storageMap = currentState.storage;
            } else if (pathNoQuery === lastState.pathname && removeQueryAndHash(currentPath) === pathNoQuery) {
                snapshot = true;
                previous = lastState;
                storageMap = lastState.storage;
            }
        }
        var id = randomId();
        var replaceHistory = replace || (currentState && !currentState.done);
        var index = Math.max(0, currentIndex + !replaceHistory);
        var state = createState(id, path, indexOffset + index, snapshot, snapshot ? previous.data : data, sessionId, previous, replaceHistory, storageMap);
        applyState(state, replace, snapshot, previous, function () {
            currentIndex = index;
            if (!replace) {
                each(states.splice(currentIndex), function (i, v) {
                    storage.delete(v.id);
                    if (v.resumedId !== resumedId) {
                        storage.delete(v.resumedId);
                    }
                });
            }
            states[currentIndex] = state;
            history[replaceHistory ? 'replaceState' : 'pushState'](id, '', toPathname(path));
        });
        return state;
    }

    function popState(index, isNative) {
        var state = states[index].reset();
        var step = state.index - states[currentIndex].index;
        var snapshot = state.pageId === states[currentIndex].pageId;
        var isLocked = !snapshot && locked(root);
        if (isLocked && isNative) {
            history.go(-step);
        }
        applyState(state, false, snapshot, states[currentIndex], function () {
            state.type = 'back_forward';
            currentIndex = index;
            if (isLocked && isNative && history.state === state.id) {
                // lock is cancelled before popstate event take place
                // history.go has no effect until then
                var unbind = bind(window, 'popstate', function () {
                    unbind();
                    history.go(step);
                });
                return false;
            }
            if (!isNative || isLocked) {
                history.go(step);
            }
        });
        return state;
    }

    function getHistoryIndex(stateId) {
        return states.findIndex(function (v, i) {
            return v.id === stateId;
        });
    }

    function resolvePath(path, currentPath, isRoutePath) {
        var parsedState;
        path = decodeURI(path) || '/';
        currentPath = currentPath || app.path;
        if (path[0] === '#' || path[0] === '?') {
            var parts = parsePath(currentPath);
            return parts.pathname + (path[0] === '#' ? parts.search + path : path);
        }
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
            path = combinePath(removeQueryAndHash(currentPath), path);
        }
        return normalizePath(path, true);
    }

    function emitNavigationEvent(eventName, state, data, options) {
        data = extend({
            navigationType: state.type,
            pathname: state.path,
            oldPathname: lastState.path,
            oldStateId: lastState.id,
            newStateId: state.id,
            route: state.route,
            data: state.data
        }, data);
        return app.emit(eventName, data, options);
    }

    function processPageChange(state) {
        var path = state.path;
        var deferred = deferrable();

        currentPath = path;
        pendingState = state;
        app.path = path;
        route.set(path);
        emitNavigationEvent('beforepageload', state, { waitFor: deferred.waitFor }, { handleable: false });

        always(deferred, function () {
            if (states[currentIndex] === state) {
                pendingState = null;
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
        if (lastState === state) {
            state.resolve(createNavigateResult(lastState.pageId, newPath, null, false));
            return;
        }

        // prevent infinite redirection loop
        // redirectSource will not be reset until processPageChange is fired
        var previous = state.previous;
        if (previous && redirectSource[newPath] && redirectSource[previous.path]) {
            processPageChange(state);
            return;
        }
        redirectSource[newPath] = true;

        console.log('Nagivate', newPath);
        var promise = resolve(emitNavigationEvent('navigate', state));
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
        fromPathname = function (path) {
            var parts = parsePath(currentPath);
            return parts.pathname + parts.search + parsePath(path).hash;
        };
        toPathname = function (path) {
            return location.pathname + location.search + parsePath(path).hash;
        };
    } else if (options.urlMode === 'query') {
        baseUrl = '/';
        isAppPath = function (path) {
            return (path || '')[0] === '?' || /^\/($|[?#])/.test(isSubPathOf(path, location.pathname) || '');
        };
        fromPathname = function (path) {
            var parts = parsePath(path);
            var value = getQueryParam(options.queryParam, parts.search);
            var l = RegExp.leftContext;
            var r = RegExp.rightContext;
            return normalizePath(value || '') + (value === false ? parts.search : l + (l || !r ? r : '?' + r.slice(1))) + parts.hash;
        };
        toPathname = function (path) {
            path = parsePath(path);
            return location.pathname + setQueryParam(options.queryParam, path.pathname, path.search || '?') + path.hash;
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
        setBaseUrl(baseUrl);
    }
    var initialPathHint = fromPathname(getCurrentPathAndQuery());
    var initialPath = options.initialPath || (options.queryParam && getQueryParam(options.queryParam)) || initialPathHint;
    var includeQuery = initialPath === initialPathHint || removeQueryAndHash(initialPath) === removeQueryAndHash(initialPathHint);
    if (!isSubPathOf(initialPath, basePath)) {
        initialPath = basePath;
    } else if (includeQuery && removeQueryAndHash(initialPath) === initialPath) {
        initialPath = initialPathHint;
    }
    var navigationType = ({ 1: 'reload', 2: 'back_forward' })[performance.navigation.type];
    if (navigationType) {
        options.resume = false;
    } else if (options.resume) {
        navigationType = 'resume';
    }
    route = new Route(app, options.routes, initialPath);
    storage = createObjectStorage(sessionStorage, 'brew.router.' + (typeof options.resume === 'string' ? options.resume : parsePath(toPathname('/')).pathname));

    app.define({
        get canNavigateBack() {
            return (states[currentIndex - 1] || '').sessionId === sessionId;
        },
        get canNavigateForward() {
            return (states[currentIndex + 1] || '').sessionId === sessionId;
        },
        get previousPath() {
            return states[currentIndex].previousPath || null;
        },
        get page() {
            return (pendingState || lastState).pageInfo;
        },
        matchRoute: matchRoute,
        parseRoute: parseRoute,
        resolvePath: resolvePath,
        isAppPath: isAppPath,
        toHref: toPathname,
        fromHref: fromPathname,
        snapshot: function () {
            return states[currentIndex] === lastState && !!pushState(currentPath, false, true);
        },
        navigate: function (path, replace, data) {
            return pushState(path, replace, false, data).promise;
        },
        back: function (defaultPath) {
            if (this.canNavigateBack) {
                return popState(currentIndex - 1).promise;
            } else {
                return !!defaultPath && pushState(defaultPath).promise;
            }
        },
        historyStorage: {
            get current() {
                return (pendingState || lastState).storage;
            },
            for: function (stateId) {
                var state = states[getHistoryIndex(stateId)];
                return state ? state.storage : null;
            }
        }
    });
    defineOwnProperty(app, 'basePath', basePath, true);
    defineOwnProperty(app, 'initialPath', initialPath.replace(/#.*$/, ''), true);
    defineOwnProperty(app, 'route', route, true);
    defineOwnProperty(app, 'routes', freeze(options.routes));
    defineOwnProperty(app, 'cache', getPersistedStorage('g', HistoryStorage), true);

    bind(window, 'popstate', function () {
        var index = getHistoryIndex(history.state);
        if (index < 0) {
            pushState(fromPathname(getCurrentPathAndQuery()));
        } else if (index !== currentIndex) {
            popState(index, true);
        }
    });

    try {
        each(storage.get('s'), function (i, v) {
            states.push(createState.apply(0, v));
            currentIndex = i;
        });
    } catch (e) { }

    var initialState;
    var index = getHistoryIndex(navigationType === 'resume' ? storage.get('c') : history.state);
    if (index >= 0) {
        resumedId = states[index].resumedId;
        currentIndex = index;
        if (navigationType === 'resume') {
            indexOffset = history.length - currentIndex - 1;
            pushState(states[index].path, false, true);
        } else {
            indexOffset = states[index].index - currentIndex;
            sessionId = states[index].sessionId || sessionId;
            if (navigationType === 'reload' && !options.resumeOnReload) {
                storage.delete(history.state);
                initialState = options.urlMode === 'none';
            }
        }
        states[currentIndex].type = navigationType;
    } else {
        currentIndex = states.length;
        indexOffset = history.length - currentIndex;
        initialState = true;
    }
    if (initialState) {
        initialState = pushState(initialPath, true);
    }

    app.on('ready', function () {
        if (initialState && states[currentIndex] === initialState && includeQuery) {
            pushState(fromPathname(getCurrentPathAndQuery()), true);
        }
        handlePathChange();
    });
    app.on('unload', function () {
        storage.set('c', states[currentIndex].id);
        storage.set('s', states);
        storage.persistAll();
    });

    defineOwnProperty(app, 'sessionId', resumedId, true);
    defineOwnProperty(app, 'sessionStorage', getPersistedStorage(resumedId, HistoryStorage), true);
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
