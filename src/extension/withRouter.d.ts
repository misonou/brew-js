declare namespace Brew {
    type RouterEventMap = {
        navigate: NavigateEvent;
        pageenter: PageEvent;
        pageleave: PageEvent;
    }

    interface NavigateEvent extends Zeta.ZetaEventBase {
        readonly pathname: string;
        readonly oldPathname: string;
        readonly route: Readonly<RouteParam>;
    }

    interface PageEvent extends Zeta.ZetaEventBase {
        readonly pathname: string;
    }

    interface NavigateResult {
        /**
         * A unique ID that can identify page load caused by navigation.
         */
        readonly id: string;
        /**
         * Gets the path being navigated to.
         * If redirection has occured, redirected path will be returned.
         */
        readonly path: string;
        /**
         * Gets if navigation event has actually fired as caused a page load.
         */
        readonly navigated: boolean;
        /**
         * Gets if the app landed on current path through redirection.
         */
        readonly redirected: boolean;
        /**
         * Gets the original path that is passed to `app.navigate` if it has been redirected.
         */
        readonly originalPath: string | null;
    }

    interface WithRouter extends EventDispatcher<keyof RouterEventMap, RouterEventMap> {
        /**
         * Gets or sets the current path.
         * @description When setting a different path, the path will be resolved with `App<T>.resolvePath`
         * for path starting with `~/`, containing `.` or `..` and parameter substitutions.
         * @see App<T>.resolvePath
         */
        path: string;
        /**
         * Gets the initial path before the app is initialized.
         */
        readonly initialPath: string;
        /**
         * Gets the Route object for accessing route parameters.
         * @description Setting unrecorgnized keys will have no effects.
         * Also, setting one parameter may unset other parameters if the new matched route does not contains such parameters.
         * Therefore, when setting multiple parameters at once, use `Route.set`.
         */
        readonly route: Route;
        /**
         * Gets if user can move back to previous page (or screen)
         * without leaving the single-page app.
         */
        readonly canNavigateBack: boolean;
        /**
         * Gets the path that will be navigated to if user click 'Back' on browser or by calling `app.back()`.
         */
        readonly previousPath: string | null;

        /**
         * Navigate to the specified path.
         * @param path Path to navigate.
         * @param replace If given true, visit of current page in the history stack will be replaced.
         * @returns A promise that is fulfilled when the call has caused a page load, or is a no-op
         * or is rejected if the navigation is cancelled due to another navigation or due to user actions.
         */
        navigate(path: string, replace?: boolean): Promise<NavigateResult>;
        /**
         * Navigate to the previous path in history stack.
         * @param defaultPath Path to navigate when there is no previous path.
         * @returns A promise that is fulfilled when the call has caused a page load, or is a no-op
         * or is rejected if the navigation is cancelled due to another navigation or due to user actions.
         */
        back(defaultPath?: string): Promise<NavigateResult> | false;

        /**
         * Resolves given path by substituting current route parameters.
         * @param path A relative or absolute path that may contains route parameters.
         * @param refPath If specified, path will be resolved against supplied path instead of current path.
         * @description Path starting with `~/` is resolved against the current route,
         * without the trailing part matched by wildcard.
         * Path containing any relative path segment (`.` or `..`) will also be correctly resolved.
         * However, it will never resolve to path that is parent to the app's base path.
         */
        resolvePath(path: string, refPath?: string): string;
        /**
         * Configures router.
         * @param options
         */
        useRouter(options: RouterOptions): void;
    }

    interface RouteParam {
        /**
         * Gets or sets the path matched by the ending wildcard ("*").
         * The value is always normalized, i.e. starts with "/" and without a trailing "/".
         */
        remainingSegments: string;
        [s: string]: any;
    }

    interface Route extends RouteParam, Zeta.Watchable<Route> {
        /**
         * Parses a given string and returns route parameters if any route matches the path.
         * @param path A string specifying a path.
         */
        parse(path: string): RouteParam;
        /**
         * Sets multiple parameters at once, such that the app will navigate to
         * the final path represented by the updated parameters.
         * @param params A dictionary containing new parameter values. Unrecorgnized keys are omitted.
         */
        set(params: Zeta.Dictionary<string>): void;
        /**
         * Updates router and cause the app to navigate to the specified path.
         * @description It is similar to directly setting `App<T>.path` except that
         * the path must be absolute and not contain parameter subsitution.
         * @param path A string specifying a path.
         * @deprecated Use {@link Brew.WithRouter.navigate} instead.
         */
        set(path: string): void;
        /**
         * Updates router and cause the app to redirect to the specified path.
         * Visit of current page in the history stack will be replaced.
         * @param key Name of route parameter.
         * @param value New value.
         */
        replace(key: string, value: string): Promise<NavigateResult>;
        /**
         * Updates router and cause the app to redirect to the specified path.
         * Visit of current page in the history stack will be replaced.
         * @param params A dictionary containing new parameter values. Unrecorgnized keys are omitted.
         */
        replace(params: RouteParam): Promise<NavigateResult>;
        /**
         * Gets the path represented by specified route parameters.
         * If none of the routes matches, the root path `/` is returned.
         * @param params A dictionary containing route parameters.
         */
        getPath(params: Zeta.Dictionary<string>): string;
        /**
         * Gets all route parameters as a plain JSON object.
         */
        toJSON(): RouteParam;
        /**
         * Gets the path represented by current route parameters.
         */
        toString(): string;
    }

    interface RouterOptions {
        /**
         * Specifies base path of the app, that is excluded in route matching and always appears in address bar.
         */
        baseUrl?: string;
        /**
         * Specifies base path must be explicitly included in {@link WithRouter.path} and related method like {@link WithRouter.navigate}.
         */
        explicitBaseUrl?: boolean;
        /**
         * Specifies initial path to be landed on when the app starts.
         */
        initialPath?: string;
        /**
         * Specifies query string parameters that contains initial path.
         * This will have no effect if `initialPath` is specified.
         */
        queryParam?: string;
        /**
         * Specifies routes for parameter extraction.
         * First route will take effect if multiple routes matches the path.
         * @example
         * "/{language:[a-z]{2}}/path" // parameter with regular expression checking
         * "/{action}"                 // simple parameter
         * "/path/*"                   // wildcard matching all extra segments
         */
        routes?: string[];
    }
}
