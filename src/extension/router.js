import { bind } from "zeta-dom/domUtil";
import dom from "zeta-dom/dom";
import { cancelLock, locked, notifyAsync } from "zeta-dom/domLock";
import { extend, watch, defineObservableProperty, any, definePrototype, iequal, watchable, each, defineOwnProperty, resolve, createPrivateStore, setImmediateOnce, exclude, equal, isArray, single, randomId, always, noop, pick, keys, isPlainObject, kv, errorWithCode, deepFreeze, freeze, isUndefinedOrNull, deferrable, reject, pipe, mapGet, mapObject, catchAsync } from "zeta-dom/util";
import { addExtension, appReady } from "../app.js";
import { getQueryParam, setQueryParam } from "../util/common.js";
import { normalizePath, combinePath, isSubPathOf, setBaseUrl, removeQueryAndHash, toSegments, parsePath, getQueryAndHash } from "../util/path.js";
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

function initStorage(path) {
    storage = createObjectStorage(sessionStorage, 'brew.router.' + path);
    storage.registerType('HistoryStorage', HistoryStorage, function (target, data) {
        each(data, target.set.bind(target));
    });
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
        var minLength, hasParams;
        path.replace(/\/(\*|[^{][^\/]*|\{([a.-z_$][a-z0-9_$]*)(\?)?(?::(?![*+?])((?:(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])([*+?]|\{\d+(?:,\d+)\})?)+))?\})(?=\/|$)/gi, function (v, a, b, c, d) {
            if (c && !minLength) {
                minLength = tokens.length;
            }
            if (b) {
                var re = d ? new RegExp('^' + d + '$', 'i') : /./;
                params[b] = tokens.length;
                hasParams = true;
                tokens.push({ name: b, test: re.test.bind(re) });
            } else {
                tokens.push(a.toLowerCase());
            }
        });
        extend(tokens, {
            pattern: path,
            params: params,
            hasParams: !!hasParams,
            exact: !(tokens[tokens.length - 1] === '*' && tokens.splice(-1)),
            minLength: minLength || tokens.length
        });
        parsedRoutes[path] = deepFreeze(tokens);
    }
    return parsedRoutes[path];
}

function createRouteState(state, route, segments, params, remainingSegments) {
    segments = segments.map(encodeURIComponent);
    remainingSegments = remainingSegments || '/' + segments.slice(route.length).join('/');
    return updateRouteState({
        route: route,
        params: extend({}, state.params, params),
        minPath: '/' + segments.slice(0, route.minLength).join('/'),
        maxPath: '/' + segments.slice(0, route.length).join('/')
    }, remainingSegments);
}

function updateRouteState(matched, remainingSegments) {
    remainingSegments = matched.route.exact !== false ? '/' : normalizePath(remainingSegments);
    matched.params.remainingSegments = remainingSegments;
    matched.path = fromRoutePath(combinePath(matched.maxPath, remainingSegments));
    return matched;
}

function matchRouteByParams(state, params, partial) {
    var matched = single(state.routes, function (tokens) {
        var valid = !tokens.hasParams || single(tokens.params, function (v, i) {
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
        return createRouteState(state, tokens, segments, pick(params, keys(tokens.params)), params.remainingSegments);
    });
    return matched || (!partial && matchRouteByParams(state, params, true));
}

function matchRouteByPath(state, path) {
    var segments = toSegments(toRoutePath(removeQueryAndHash(path)));
    var matched = any(state.routes, function (tokens) {
        return matchRoute(tokens, segments, true);
    }) || [];
    return createRouteState(state, matched, segments, mapObject(matched.params, function (v) {
        return segments[v] || null;
    }));
}

function Route(app, routes, initialPath) {
    var self = this;
    var params = {};
    var state = _(self, {
        handleChanges: watch(self, true),
        routes: routes.map(parseRoute),
        params: params,
        app: app
    });
    each(state.routes, function (i, v) {
        each(v.params, function (i) {
            params[i] = null;
        });
    });
    var initial = matchRouteByPath(state, initialPath);
    state.current = initial;
    each(initial.params, function (i, v) {
        defineObservableProperty(self, i, v, function (v) {
            return isUndefinedOrNull(v) || v === '' ? null : String(v);
        });
    });
    watch(self, function () {
        if (!equal(state.current.params, self.toJSON())) {
            catchAsync(routeCommitParams(self, state));
        }
    });
    Object.preventExtensions(self);
}

function routeCommitParams(self, state, matched, params, replace, force) {
    if (!matched) {
        params = extend({}, self, params);
        matched = matchRouteByParams(state, params) || updateRouteState(state.current, params.remainingSegments);
    }
    var result = matched.path !== removeQueryAndHash(state.app.path);
    state.current = matched;
    state.handleChanges(function () {
        extend(self, matched.params);
        if (result || force) {
            result = state.app.navigate(matched.path + (result ? '' : getQueryAndHash(state.app.path)), replace);
        }
    });
    return result;
}

definePrototype(Route, {
    parse: function (path) {
        return extend({}, matchRouteByPath(_(this), path).params);
    },
    set: function (params) {
        var self = this;
        var state = _(self);
        if (typeof params === 'string') {
            if (params !== self.toString()) {
                catchAsync(routeCommitParams(self, state, matchRouteByPath(state, params)));
            }
            return;
        }
        catchAsync(routeCommitParams(self, state, null, params));
    },
    replace: function (key, value) {
        return routeCommitParams(this, _(this), null, isPlainObject(key) || kv(key, value), true, true);
    },
    getPath: function (params) {
        var matched = matchRouteByParams(_(this), params);
        return matched ? matched.path : fromRoutePath('/');
    },
    toJSON: function () {
        return extend({}, this);
    },
    toString: function () {
        return _(this).current.path;
    }
});
watchable(Route.prototype);

function PageInfo(page, path, params) {
    var self = this;
    defineOwnProperty(self, 'pageId', page.id, true);
    defineOwnProperty(self, 'path', path, true);
    defineOwnProperty(self, 'params', params, true);
    _(self, page);
}

definePrototype(PageInfo, {
    get data() {
        return _(this).data;
    },
    getSavedStates() {
        return _(this).last.storage.toJSON();
    },
    clearNavigateData: function () {
        _(this).data = null;
    },
    clearHistoryStorage: function () {
        each(_(this).states, function (i, v) {
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
    var redirectCount = 0;
    var currentIndex = 0;
    var indexOffset = 0;
    var pendingState;
    var lastState = {};

    function getPersistedStorage(key, ctor) {
        return storage.revive(key, ctor) || mapGet(storage, key, ctor);
    }

    function commitPath(newPath) {
        currentPath = newPath;
        app.path = newPath;
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
        if (previous && previous.sessionId !== sessionId) {
            previous = null;
        }
        if (data === undefined) {
            data = null;
        }
        if (storageMap) {
            storage.set(id, storageMap);
        }
        var resolvePromise = noop;
        var rejectPromise = noop;
        var pathNoQuery = removeQueryAndHash(path);
        var page = previous && snapshot ? previous.page : { id, data, states: {} };
        var resolved, promise;
        var savedState = [id, path, index, snapshot, data, sessionId];
        var state = {
            id: id,
            path: path,
            index: index,
            pathname: pathNoQuery,
            type: 'navigate',
            previous: previous && (keepPreviousPath || snapshot ? previous.previous : previous),
            page: page,
            sessionId: sessionId,
            resumedId: previous ? previous.resumedId : sessionId,
            deleted: false,
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
                return page.info || (page.info = new PageInfo(page, pathNoQuery, freeze(route.parse(pathNoQuery))));
            },
            get storage() {
                return storageMap || (storageMap = state.deleted ? new HistoryStorage() : getPersistedStorage(id, HistoryStorage));
            },
            commit: function () {
                pendingState = state;
                page.last = state;
                commitPath(state.path);
                route.set(pathNoQuery);
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
                    redirectCount = 0;
                    lastState = state;
                    page.last = state;
                    commitPath(state.path);
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
                savedState[4] = page.data;
                return savedState;
            }
        };
        page.states[id] = state;
        return state;
    }

    function updateQueryAndHash(state, newPath, oldPath) {
        state.path = newPath;
        history.replaceState(state.id, '', toPathname(newPath));
        if (state.done) {
            var oldHash = parsePath(oldPath).hash;
            var newHash = parsePath(newPath).hash;
            commitPath(newPath);
            if (oldHash !== newHash) {
                app.emit('hashchange', { oldHash, newHash }, { handleable: false });
            }
            return { promise: resolve(createNavigateResult(state.page.id, newPath, null, false)) };
        }
        return state;
    }

    function applyState(state, replace, snapshot, previous, callback) {
        var currentState = states[currentIndex];
        if (currentState && currentState !== state && !currentState.done) {
            redirectCount++;
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
                state.resolve(createNavigateResult(state.page.id, state.path, null, false));
                updateQueryAndHash(state, state.path, currentState.path);
            } else {
                setImmediateOnce(handlePathChange);
            }
        }
    }

    function pushState(path, replace, snapshot, data, storageMap) {
        path = resolvePath(path);
        if (redirectCount > 30 || !isSubPathOf(path, basePath)) {
            return { promise: reject(errorWithCode(ErrorCode.navigationRejected)) };
        }
        var currentState = states[currentIndex];
        var previous = currentState;
        if (currentState) {
            if (snapshot) {
                storageMap = new HistoryStorage(previous.storage.toJSON());
            } else if (isUndefinedOrNull(data)) {
                var pathNoQuery = removeQueryAndHash(path);
                if (pathNoQuery === currentState.pathname) {
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
        }
        var id = randomId();
        var replaceHistory = replace || (currentState && !currentState.done);
        var index = Math.max(0, currentIndex + !replaceHistory);
        var state = createState(id, path, indexOffset + index, snapshot, snapshot ? previous.page.data : data, sessionId, previous, replaceHistory, storageMap);
        applyState(state, replace, snapshot, previous, function () {
            currentIndex = index;
            if (!replace) {
                each(states.splice(currentIndex), function (i, v) {
                    v.deleted = true;
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
        var snapshot = state.page === states[currentIndex].page;
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
            var a = parsePath(currentPath);
            var b = parsePath(path);
            return a.pathname + (path[0] === '#' ? a.search : b.search) + b.hash;
        }
        if (path[0] === '~' || path.indexOf('{') >= 0) {
            var fullPath = (isRoutePath ? fromRoutePath : pipe)(currentPath);
            parsedState = fullPath === route.toString() ? _(route).current : matchRouteByPath(_(route), fullPath);
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
            route: state.pageInfo.params,
            data: state.page.data
        }, data);
        return app.emit(eventName, data, options);
    }

    function processPageChange(state) {
        var deferred = deferrable();
        state.commit();
        emitNavigationEvent('beforepageload', state, { waitFor: deferred.waitFor }, { handleable: false });
        always(deferred, function () {
            if (states[currentIndex] === state) {
                pendingState = null;
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
            state.resolve(createNavigateResult(lastState.page.id, newPath, null, false));
            return;
        }

        console.log('Nagivate', newPath);
        var promise = resolve(emitNavigationEvent('navigate', state));
        notifyAsync(root, promise);
        always(promise, function () {
            if (states[currentIndex] === state) {
                processPageChange(state);
            }
        });
    }

    baseUrl = normalizePath(options.baseUrl);
    if (options.urlMode === 'none') {
        baseUrl = '/';
        isAppPath = constant(false);
        fromPathname = function (path) {
            var parts = parsePath(currentPath || '/' + getCurrentQuery());
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
            var query = setQueryParam(options.queryParam, function (oldValue) {
                path = normalizePath(oldValue || '');
            }, parts.search);
            return path + query + parts.hash;
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
    initStorage(typeof options.resume === 'string' ? options.resume : parsePath(toPathname(basePath)).pathname);

    app.define({
        get canNavigateBack() {
            return (states[currentIndex - 1] || '').sessionId === sessionId;
        },
        get canNavigateForward() {
            return (states[currentIndex + 1] || '').sessionId === sessionId;
        },
        get previousPath() {
            return (states[currentIndex].previous || '').path || null;
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
        backToPreviousPath: function () {
            var previous = states[currentIndex].previous;
            return !!previous && popState(getHistoryIndex(previous.id)).promise;
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
    defineObservableProperty(app, 'path', initialPath, function (newValue) {
        newValue = resolvePath(newValue);
        if (newValue !== currentPath) {
            pushState(newValue);
        }
        return currentPath;
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
    states[currentIndex].commit();

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
