declare namespace Brew {
    /* -------------------------------------------------------------
     * useLogin
     * ------------------------------------------------------------- */
    type LoginEventMap<T = any> = {
        login: LoginEvent<T>
    }

    interface LoginEvent<T> extends Zeta.ZetaEventBase {
        /**
         * Gets the response from `LoginOptions<T>.login` callback.
         */
        readonly data: T;
    }

    interface WithLogin<T = any> extends EventDispatcher<keyof LoginEventMap, LoginEventMap<T>> {
        /**
         * Performs login action with the specified parameters.
         * @param params An object containing parameters such as username and password.
         * @param nextPath The path to navigate after user has successfully logged in. If not specified, the app will navigate to `defaultRedirectPath` or `initialPath`.
         * @param callback Callback for async actions before navigating after login.
         * @see LoginOptions<T>.login
         */
        login(params?: any, nextPath?: string, callback?: () => PromiseLike<any>): Promise<T>;
        /**
         * Performs logout action.
         * @param nextPath The path to navigate after user has successfully logged out. If not specified, the app will navigate to `loginPagePath`.
         * @param callback Callback for async actions before navigating after logout.
         * @see LoginAction<T>.logout
         */
        logout(nextPath?: string, callback?: () => PromiseLike<any>): Promise<void>;
        /**
         * Enables the login module.
         * @param options Options to be passed to the module.
         */
        useLogin(options: LoginOptions<T>): void;
    }

    interface LoginOptions<T> {
        /**
         * Specifies the path of login page.
         * The app will redirect to this page if user is not logged in.
         */
        loginPagePath: string,
        /**
         * Specifies the default path to redirect after user has successfully logged in.
         */
        defaultRedirectPath: string,
        /**
         * Specifies the cookie name to store the token for future authentication.
         */
        cookie?: string,
        /**
         * Specified the valid period of the cookie, in milliseconds.
         */
        expiry?: number,
        /**
         * Specifies callback to log in with given parameters.
         */
        login: (params: object) => T | Promise<T>,
        /**
         * Specifies callback to sign out current user.
         * If none is given, the app will simply remove the authorization token from cookie.
         */
        logout?: () => void | Promise<void>,
        /**
         * Specifies callback to perform login by authorization token saved previously.
         */
        tokenLogin?: (token: string) => T | Promise<T>,
        /**
         * Specifies callback to extract authorization token from login response.
         * The token will be saved to cookie and be passed to `tokenLogin` callback for auto authorization.
         */
        getTokenFromResponse?: (response: T) => string
    }
}
