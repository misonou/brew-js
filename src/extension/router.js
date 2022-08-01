import $ from "../include/external/jquery.js";
import { bind, containsOrEquals, selectIncludeSelf, setClass } from "../include/zeta-dom/domUtil.js";
import dom from "../include/zeta-dom/dom.js";
import { cancelLock, locked } from "../include/zeta-dom/domLock.js";
import { watchElements } from "../include/zeta-dom/observe.js";
import { extend, watch, defineObservableProperty, any, definePrototype, iequal, watchable, resolveAll, each, defineOwnProperty, resolve, createPrivateStore, throwNotFunction, defineAliasProperty, setImmediateOnce, exclude, equal, mapGet, isFunction, isArray, define, single, randomId, always, setImmediate, noop, pick, keys, isPlainObject, kv, errorWithCode, deepFreeze, freeze, isUndefinedOrNull } from "../include/zeta-dom/util.js";
import { addExtension, appReady } from "../app.js";
import { batch, handleAsync, markUpdated, mountElement, preventLeave } from "../dom.js";
import { animateIn, animateOut } from "../anim.js";
import { groupLog } from "../util/console.js";
import { getQueryParam } from "../util/common.js";
import { normalizePath, combinePath, isSubPathOf, baseUrl, setBaseUrl, removeQueryAndHash } from "../util/path.js";
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
    return path === '/' ? [] : path.slice(1).split('/').map(decodeURIComponent);
}

function getCurrentQuery() {
    return location.search + location.hash;
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
                return v && !tokens.has(i);
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
        var path = self.getPath(extend(self, isPlainObject(key) || kv(key, value)));
        return _(self).app.navigate(path + (path === self.toString() ? getCurrentQuery() : ''), true);
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
    var currentPath = '';
    var redirectSource = {};
    var lockedPath;
    var newPath = '';
    var currentIndex = -1;
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

    function handleNoop(path, originalPath) {
        var pathNoQuery = removeQueryAndHash(path);
        for (var i = currentIndex; i >= 0; i--) {
            if (states[i].done && states[i].pathname === pathNoQuery) {
                history.replaceState(history.state, '', toPathname(path));
                return createNavigateResult(states[i].id, path, originalPath, false);
            }
        }
    }

    function pushState(path, replace) {
        path = resolvePath(path);
        newPath = path;
        var currentState = states[currentIndex];
        var pathNoQuery = removeQueryAndHash(path);
        if (currentState && pathNoQuery === currentState.pathname) {
            currentState.path = path;
            if (currentState.done) {
                currentPath = path;
                app.path = path;
                return { promise: resolve(handleNoop(path)) };
            } else {
                history.replaceState(currentState.id, '', toPathname(path));
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
            pathname: pathNoQuery,
            route: freeze(route.parse(pathNoQuery)),
            previous: currentState,
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
                    (other.promise || other.then(function (other) {
                        return other.promise;
                    })).then(function (data) {
                        state.resolve(createNavigateResult(data.id, data.path, state.path));
                    }, rejectPromise);
                    rejectPromise = noop;
                }
            },
            resolve: function (result) {
                resolved = true;
                resolvePromise(result || createNavigateResult(id, state.path));
                each(states, function (i, v) {
                    v.reject();
                });
                if (states[currentIndex] === state) {
                    lastState = state;
                    app.emit('pageload', { pathname: state.path }, { handleable: false });
                }
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
        if (path[0] === '~') {
            path = (isRoutePath ? pass : fromRoutePath)(combinePath(parsedState.minPath, path.slice(1)));
        } else if (path[0] !== '/') {
            path = combinePath(currentPath, path);
        }
        return normalizePath(path, true);
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

    function processPageChange(state, newActiveElements) {
        var oldPath = currentPath;
        var path = state.path;
        var preload = new Map();
        var eventSource = dom.eventSource;
        var previousActiveElements = activeElements.slice(0);

        currentPath = path;
        app.path = path;
        route.set(path);
        app.emit('beforepageload', { pathname: path }, { handleable: false });

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
                if (states[currentIndex] === state) {
                    state.resolve();
                }
            });
        });
    }

    function handlePathChange() {
        var state = states[currentIndex];
        if (!state || (location.pathname + getCurrentQuery()) !== toPathname(newPath)) {
            pushState(newPath);
            state = states[currentIndex];
        }
        if (currentIndex > 0 && removeQueryAndHash(newPath) === removeQueryAndHash(currentPath)) {
            state.resolve(handleNoop(newPath));
            return;
        }
        if (state.handled) {
            return;
        }
        state.handled = true;

        // forbid navigation when DOM is locked (i.e. [is-modal] from openFlyout) or leaving is prevented
        var previous = state.previous;
        var leavePath = newPath;
        var promise = locked(root, true) ? cancelLock(root) : preventLeave();
        if (promise) {
            lockedPath = newPath === lockedPath ? null : currentPath;
            promise = resolve(promise).then(function () {
                return pushState(leavePath);
            }, function () {
                throw errorWithCode(ErrorCode.navigationRejected);
            });
            if (states[currentIndex - 1] === previous) {
                popState();
            } else {
                states[currentIndex] = previous;
                history.replaceState(previous.id, '', toPathname(previous.path));
            }
            state.forward(promise);
            return;
        }
        lockedPath = null;

        // find active elements i.e. with match-path that is equal to or is parent of the new path
        /** @type {HTMLElement[]} */
        var newActiveElements = [root];
        var redirectPath;
        registerMatchPathElements();
        batch(true, function () {
            var newRoutePath = toRoutePath(removeQueryAndHash(newPath));
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
        if (previous && redirectSource[newPath] && redirectSource[previous.path]) {
            processPageChange(state, newActiveElements);
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
        promise = resolve(app.emit('navigate', {
            pathname: newPath,
            oldPathname: lastState.path,
            oldStateId: lastState.id,
            newStateId: state.id,
            route: state.route
        }));
        handleAsync(promise, root, function () {
            if (states[currentIndex] === state) {
                processPageChange(state, newActiveElements);
            }
        });
    }

    defineObservableProperty(app, 'path', '', function (newValue) {
        if (!appReady) {
            return currentPath;
        }
        newValue = resolvePath(newValue);
        if (newValue !== currentPath) {
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
    }
    var initialPath = options.initialPath || (options.queryParam && getQueryParam(options.queryParam));
    var includeQuery = !initialPath;
    initialPath = fromPathname(initialPath || location.pathname);
    route = new Route(app, options.routes, initialPath);

    app.define({
        get canNavigateBack() {
            return currentIndex > 0;
        },
        get previousPath() {
            return (states[currentIndex - 1] || '').path || null;
        },
        parseRoute: parseRoute,
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
    defineOwnProperty(app, 'initialPath', initialPath + (includeQuery ? location.search : ''), true);
    defineOwnProperty(app, 'route', route, true);
    defineOwnProperty(app, 'routes', freeze(options.routes));

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

    pushState(initialPath + (includeQuery ? getCurrentQuery() : ''), true);
    app.on('ready', function () {
        if (currentIndex === 0) {
            pushState(initialPath + (includeQuery ? getCurrentQuery() : ''), true);
        }
        handlePathChange();
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

    watchElements(root, 'video[autoplay], audio[autoplay]', function (addedNodes) {
        $(addedNodes).attr('x-autoplay', '').removeAttr('autoplay');
    }, true);
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
