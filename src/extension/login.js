import { catchAsync, defineObservableProperty, either, extend, isFunction, resolve, resolveAll } from "../include/zeta/util.js";
import { cookie } from "../util/common.js";
import { install } from "../app.js";
import { preventLeave } from "../dom.js";

install('login', function (app, options) {
    options = extend({
        loginPagePath: '',
        defaultRedirectPath: '',
        cookie: '',
        expiry: 0,
        logout: null,
        login: null,
        tokenLogin: null,
        getTokenFromResponse: null
    }, options);

    var authCookie = cookie(options.cookie, options.expiry);
    var setLoggedIn = defineObservableProperty(app, 'loggedIn', false, true);

    function handleLogin(response) {
        setLoggedIn(true);
        if (isFunction(options.getTokenFromResponse)) {
            authCookie.set(options.getTokenFromResponse(response));
        }
        app.emit('login', { data: response });
    }

    function handleLogout() {
        setLoggedIn(false);
        authCookie.delete();
        app.emit('logout');
    }

    var redirectPath = app.initialPath;
    var previousToken = authCookie.get();
    if (previousToken && isFunction(options.tokenLogin)) {
        app.beforeInit(catchAsync(resolveAll(options.tokenLogin(previousToken), handleLogin)));
    }
    app.define({
        login: function (params, nextPath, callback) {
            callback = isFunction(callback || nextPath);
            nextPath = typeof nextPath === 'string' && nextPath;
            return resolveAll(options.login(params)).then(function (d) {
                handleLogin(d);
                return callback && callback();
            }, function (e) {
                setLoggedIn(false);
                throw e.status >= 500 ? 'server-error' : 'incorrect-cred';
            }).then(function () {
                if (redirectPath === app.resolvePath(options.loginPagePath)) {
                    redirectPath = '';
                }
                app.navigate(nextPath || redirectPath || options.defaultRedirectPath);
                redirectPath = '';
            });
        },
        logout: function (nextPath, callback) {
            if (!app.loggedIn) {
                return resolve();
            }
            callback = isFunction(callback || nextPath);
            nextPath = typeof nextPath === 'string' && nextPath;
            return resolve(preventLeave()).then(function () {
                return options.logout();
            }).then(function () {
                handleLogout();
                return callback && callback();
            }).then(function () {
                app.navigate(nextPath || options.loginPagePath);
            });
        }
    });
    app.on('navigate', function (e) {
        var loginPagePath = app.resolvePath(options.loginPagePath);
        if (either(app.loggedIn, e.pathname !== loginPagePath)) {
            if (app.loggedIn) {
                app.navigate(options.defaultRedirectPath);
            } else {
                redirectPath = e.pathname;
                app.navigate(loginPagePath);
            }
        }
    });
});

export default null;
