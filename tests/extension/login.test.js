import { waitFor } from "@testing-library/dom";
import { _, bindEvent, delay, initApp, mockFn } from "../testUtil";
import login from "src/extension/login";
import router from "src/extension/router";

/** @type {Brew.AppInstance<Brew.WithLogin & Brew.WithRouter>} */
var app;
var initialLoggedIn;

const loginCb = mockFn();
const logoutCb = mockFn();
const tokenLoginCb = mockFn();
const getTokenFromResponseCb = mockFn();

beforeAll(async () => {
    app = await initApp(login, router, app => {
        app.useRouter({
            routes: ['/*'],
            initialPath: '/initial'
        });
        app.useLogin({
            loginPagePath: '/login',
            defaultRedirectPath: '/default',
            cookie: 'auth',
            expiry: 1000000,
            logout: logoutCb,
            login: loginCb,
            tokenLogin: tokenLoginCb,
            getTokenFromResponse: getTokenFromResponseCb
        });
    });
    initialLoggedIn = app.loggedIn;
});

beforeEach(async () => {
    await app.logout();
    await delay(10);
});

describe('Login extension', () => {
    it('should be initially in logged out state by default', () => {
        expect(initialLoggedIn).toBe(false);
    });

    it('should redirect to initial path', async () => {
        await app.login();
        await 0;
        expect(app.path).toBe('/initial');
    });

    it('should keep app in login page when user is not logged in', async () => {
        expect(app.path).toBe('/login');
        await expect(app.navigate('/other')).rejects.toBeErrorWithCode('brew/navigation-cancelled');
    });

    it('should keep app out of login page when user is logged in', async () => {
        await app.login();
        await 0;
        expect(app.path).not.toBe('/login');

        await delay(10);
        await expect(app.navigate('/login')).rejects.toBeErrorWithCode('brew/navigation-cancelled');
    });
});

describe('app.login', () => {
    it('should invoke login callback with given params', async () => {
        const params = {};
        await app.login(params);
        expect(loginCb).toBeCalledWith(expect.sameObject(params));
    });

    it('should invoke getTokenFromResponse callback and save token to cookie', async () => {
        const response = {};
        loginCb.mockReturnValueOnce(response);
        getTokenFromResponseCb.mockReturnValueOnce('token-value');

        expect(document.cookie).not.toContain('token-value');
        await app.login();

        expect(getTokenFromResponseCb).toBeCalledWith(response);
        expect(document.cookie).toContain('token-value');
    });

    it('should emit login event with response data', async () => {
        const cb = mockFn();
        const response = {};
        loginCb.mockResolvedValueOnce(response);
        bindEvent(app, 'login', cb);

        await app.login();
        expect(cb).toBeCalledWith(expect.objectContaining({ data: expect.sameObject(response) }), _);
    });

    it('should invoke supplied callback before navigation', async () => {
        let resolve;
        const promise = new Promise(res => resolve = res);
        const syncCb = mockFn(() => promise);
        const onnavigate = mockFn();
        bindEvent(app, 'navigate', onnavigate);

        app.login({}, '', syncCb);
        await delay(10);
        expect(syncCb).toBeCalledTimes(1);
        expect(onnavigate).not.toBeCalled();

        resolve();
        await waitFor(() => expect(onnavigate).toBeCalledTimes(1));
    });

    it('should redirect to given path', async () => {
        await app.login({}, '/next');
        await 0;
        expect(app.path).toBe('/next');
    });

    it('should redirect to default path', async () => {
        // skip first time as it may redirect to initial path
        await app.login();
        await app.login();
        await 0;
        expect(app.path).toBe('/default');
    });

    it('should redirect to previous path', async () => {
        await expect(app.navigate('/foo')).rejects.toBeTruthy();
        expect(app.path).toBe('/login');

        await app.login();
        await 0;
        expect(app.path).toBe('/foo');
    });

    it('should logout when returned promise rejects', async () => {
        await app.login();
        expect(app.loggedIn).toBe(true);

        loginCb.mockRejectedValueOnce(new Error());
        await expect(app.login()).rejects.toMatch(/./);
        expect(app.loggedIn).toBe(false);
    });
});

describe('app.logout', () => {
    it('should invoke logout callback when user is logged in', async () => {
        await app.login();
        await app.logout();
        expect(logoutCb).toBeCalledTimes(1);
    });

    it('should not invoke logout callback when user is not logged in', async () => {
        await app.logout();
        expect(logoutCb).not.toBeCalled();
    });

    it('should emit logout event when user is logged in', async () => {
        const cb = mockFn();
        bindEvent(app, 'logout', cb);
        await app.login();
        await app.logout();
        expect(cb).toBeCalledTimes(1);
    });

    it('should not emit logout event when user is not logged in', async () => {
        const cb = mockFn();
        bindEvent(app, 'logout', cb);
        await app.logout();
        expect(cb).not.toBeCalled();
    });

    it('should delete token cookie', async () => {
        getTokenFromResponseCb.mockReturnValueOnce('token-value');
        await app.login();
        expect(document.cookie).toContain('token-value');

        await app.logout();
        expect(document.cookie).not.toContain('token-value');
    });

    it('should invoke supplied callback before navigation', async () => {
        let resolve;
        const promise = new Promise(res => resolve = res);
        const syncCb = mockFn(() => promise);
        const onnavigate = mockFn();

        await app.login();
        bindEvent(app, 'navigate', onnavigate);

        app.logout('', syncCb);
        await delay(10);
        expect(syncCb).toBeCalledTimes(1);
        expect(onnavigate).not.toBeCalled();

        resolve();
        await waitFor(() => expect(onnavigate).toBeCalledTimes(1));
    });

    it('should redirect to login page', async () => {
        await app.login();
        await 0;
        expect(app.path).not.toBe('/login');

        await app.logout();
        await 0;
        expect(app.path).toBe('/login');
    });
});
