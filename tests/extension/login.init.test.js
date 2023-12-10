import { mockFn } from "@misonou/test-utils";
import login from "src/extension/login";
import router from "src/extension/router";
import { initApp } from "../testUtil";
import { waitFor } from "@testing-library/dom";

const loginCb = mockFn();
const logoutCb = mockFn();
const tokenLoginCb = mockFn();
const getTokenFromResponseCb = mockFn();

describe('Login extension', () => {
    it('should automatically login when cookie is present', async () => {
        const cb = mockFn();
        document.cookie = 'auth=token';

        const app = await initApp(login, router, app => {
            app.useRouter({
                routes: ['/*'],
                initialPath: '/initial'
            });
            app.useLogin({
                cookie: 'auth',
                expiry: 1000000,
                logout: logoutCb,
                login: loginCb,
                tokenLogin: tokenLoginCb,
                getTokenFromResponse: getTokenFromResponseCb
            });
            app.on('login', cb);
        });
        expect(tokenLoginCb).toHaveBeenCalledWith('token');
        expect(cb).toBeCalledTimes(1);
        expect(app.loggedIn).toBe(true);
        await waitFor(() => expect(app.path).toBe('/initial'));
    });
});
