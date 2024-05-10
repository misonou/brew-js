declare namespace Brew {
    type RouterEventMap = {
        navigate: NavigateEvent;
        beforepageload: BeforePageLoadEvent;
        pageload: PageEvent;
        pageenter: PageEvent;
        pageleave: PageEvent;
        hashchange: HashChangeEvent;
        popstate: PopStateEvent;
    }

    type NavigationType = 'navigate' | 'reload' | 'back_forward' | 'resume';

    interface RouterEvent {
        /**
         * Gets the path where user is navigating to.
         */
        readonly pathname: string;
        /**
         * Gets the path where user is navigating from.
         */
        readonly oldPathname: string;
        /**
         * Gets the unique state ID for the page about to leave.
         */
        readonly oldStateId: string;
        /**
         * Gets the unique state ID for the page going to navigate.
         */
        readonly newStateId: string;
        /**
         * Gets the route parameters extracted from the path navigating to.
         */
        readonly route: Readonly<RouteParam>;
        /**
         * Gets the data passed to {@link WithRouter.navigate}.
         */
        readonly data: any;
        /**
         * Gets how user has triggered navigation.
         *
         * It takes on the following four values, the first three being semantically the same as {@link NavigationTimingType}.
         *
         * - `navigate`     - User has directly visited the page through address bar or hyperlinks, or any navigation within the app.
         * - `reload`       - User has reloaded the page through browser.
         * - `back_forward` - User has moved back or forward through browser history.
         * - `resume`       - User has briefly left the page and now resumed the previous page in this app, when router is initialized with `resume` option.
         */
        readonly navigationType: NavigationType;
    }

    interface NavigateEvent extends RouterEvent, Zeta.ZetaAsyncHandleableEvent {
    }

    interface BeforePageLoadEvent extends RouterEvent, Zeta.Deferrable {
        waitFor(...args: Promise<any>[]): boolean;
    }

    interface PageEvent extends Zeta.ZetaEventBase {
        /**
         * Gets the path associating to the page that triggered the event.
         * It does not necessarily equal to the current path, i.e. {@link WithRouter.path}.
         */
        readonly pathname: string;
    }

    interface HashChangeEvent extends Zeta.ZetaEventBase {
        readonly oldHash: string;
        readonly newHash: string;
    }

    interface PopStateEvent extends Zeta.ZetaEventBase {
        /**
         * Gets the unique state ID for the previous snapshot.
         */
        readonly oldStateId: string;
        /**
         * Gets the unique state ID for the current snapshot.
         */
        readonly newStateId: string;
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

    interface PageInfo {
        /**
         * Gets a unique ID representing current visit to the path.
         */
        readonly pageId: string;
        /**
         * Gets the navigated path.
         */
        readonly path: string;
        /**
         * Gets the route parameters parsed from the navigated path.
         */
        readonly params: RouteParam;
        /**
         * Gets data passed by {@link WithRouter.navigate}.
         */
        readonly data: any;
        /**
         * Deletes data passed by {@link WithRouter.navigate}.
         */
        clearNavigateData(): void;
        /**
         * Clears all data stored in history storage for this page.
         * When there are multiple snapshots, all of them will be cleared.
         */
        clearHistoryStorage(): void;
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
         * Gets the base path that can navigate to through the app instance.
         * Note that it is not the same as the path containing the HTML document, and
         * only when {@link RouterOptions.explicitBaseUrl} is true will affect the value, default is the root path `/`.
         */
        readonly basePath: string;
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
         * Gets the route patterns provided to router.
         */
        readonly routes: ReadonlyArray<string>;
        /**
         * Gets if user can move back to previous page (or screen)
         * without leaving the single-page app.
         */
        readonly canNavigateBack: boolean;
        /**
         * Gets if user can move forward to next page (or screen)
         * without leaving the single-page app.
         */
        readonly canNavigateForward: boolean;
        /**
         * Gets the path that will be navigated to if user click 'Back' on browser or by calling `app.back()`.
         */
        readonly previousPath: string | null;
        /**
         * Gets a unique ID that represent an app session.
         *
         * Note that an app session is different from a browser session which typically associates to the lifetime of a tab.
         *
         * By constrast, an app session is created for every unique visit to the single-page app, for example from a link.
         * When the page is reloaded, or is restored by going forward or backward in browser history, previous app session is resumed.
         * App sessions can also be explicitly resumed when `resume` option is specified when configuring the router.
         */
        readonly sessionId: string;
        /**
         * Gets the storage that persists over and gets restored in the same app session.
         * @see {@link WithRouter.sessionId} for definition of an app session.
         */
        readonly sessionStorage: PersistedStorage;
        /**
         * Gets the storage that persists over and gets restored in the current tab.
         *
         * It is essentially like storing items directly to {@link Window.sessionStorage}, but with the benefits that
         * data is compressed, as well as that data will not be stored in duplication if it is also saved to {@link WithRouter.sessionStorage}
         * or {@link WithRouter.historyStorage}.
         */
        readonly cache: PersistedStorage;
        /**
         * Gets information of and performs actions on current page.
         */
        readonly page: PageInfo

        /**
         * Navigate to the specified path.
         * @param path Path to navigate.
         * @param replace If given true, visit of current page in the history stack will be replaced.
         * @param data Additional data to be passed to `navigate` and `beforepageload` events.
         * @returns A promise that is fulfilled when the call has caused a page load, or is a no-op
         * or is rejected if the navigation is cancelled due to another navigation or due to user actions.
         */
        navigate(path: string, replace?: boolean, data?: any): Promise<NavigateResult>;
        /**
         * Navigate to the previous path in history stack.
         * @param defaultPath Path to navigate when there is no previous path.
         * @returns A promise that is fulfilled when the call has caused a page load, or is a no-op
         * or is rejected if the navigation is cancelled due to another navigation or due to user actions.
         */
        back(defaultPath?: string): Promise<NavigateResult> | false;
        /**
         * Navigate back to previous path in history stack, skipping all snapshots taken in current path.
         * @returns A promise that is fulfilled when navigation completes or is rejected if navigation is cancelled;
         * or `false` if there is no previous path navigateable, i.e. when {@link WithRouter.previousPath} is `null`.
         */
        backToPreviousPath(): Promise<NavigateResult> | false;
        /**
         * Push a new state to history stack without navigation.
         * Note that it only works when the app is not navigating.
         * @returns Whether a new state is pushed to history stack.
         */
        snapshot(): boolean;

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
         * Parses a given route pattern and returns its information.
         * @param pattern A valid route pattern.
         */
        parseRoute(pattern: string): RoutePattern;
        /**
         * Determines whether a route matches a given path.
         * @param {string} route
         * @param {string} path Path to match.
         * @param {boolean=} ignoreExact Whether to match child paths even though there is no trailing wildcard character in the route.
         */
        matchRoute(route: string, path: string, ignoreExact?: boolean): boolean;
        /**
         * Determines whether a path should be processed by the router.
         * The result is always false if an absolute URL (i.e. beginning with http: or https:) is given.
         * @param path A path or url.
         */
        isAppPath(path: string): boolean;
        /**
         * Converts an app path to a path that can be processed by the browser,
         * e.g. to be used in `href` attribute of an anchor element or be passed to `window.open`.
         * @param path A path to be converted. It must be an absolute path, i.e. starting with `/`.
         */
        toHref(path: string): string;
        /**
         * Converts a browser path, e.g. to be used in `href` attribute of an anchor element or be passed to `window.open`,
         * to a path that can be processed by the app.
         *
         * This method is intended to be in junction with {@link WithRouter.toHref}.
         * It does not gurantee the return value if the given path is not a valid app path,
         * thus it is recommended to check the input using {@link WithRouter.isAppPath} first.
         *
         * @param path A path to be converted. It must be an absolute path, i.e. starting with `/`.
         */
        fromHref(path: string): string;

        readonly historyStorage: {
            /**
             * Gets the storage instance for current page step.
             */
            readonly current: HistoryStorage;
            /**
             * Gets the storage for a specific page step in history.
             * @param stateId A unique string identifying the point in history, exposed in properties like `history.state` or {@link NavigateResult.id}.
             * @returns The storage instance associated to the specific page step; or `null` if `stateId` is invalid.
             */
            for(stateId: string): HistoryStorage | null;
        };

        /**
         * Configures router.
         * @param options
         */
        useRouter(options: RouterOptions): void;
    }

    /**
     * A map for storing and retrieving states.
     *
     * Only string and symbol keys are allowed, where other type are coerced into string.
     * Also entries with symbol as key are not persisted into session storage.
     */
    interface PersistedStorage extends Map<string | symbol, any> {
        toJSON(): object;
    }

    /**
     * A map for storing and retrieving states associated to a specific page step in history.
     */
    type HistoryStorage = PersistedStorage;

    interface RoutePattern {
        /**
         * Gets the input route pattern.
         */
        readonly pattern: string;
        /**
         * Gets a dictionary that maps a route parameter name to a zero-based index.
         */
        readonly params: Zeta.Dictionary<number>;
        /**
         * Gets whether the route accepts extra segments.
         */
        readonly exact: boolean;
        /**
         * Gets the minimum number of segments.
         * If the route is exact, the minimum length is the same as the number of segments of the input route pattern.
         */
        readonly minLength: number;
        /**
         * Gets the number of segments, including optional ones.
         */
        readonly length: number;
        /**
         * Gets whether the route has the named route parameter.
         * @param name Name of a route parameter.
         */
        has(name: string): boolean;
        /**
         * Tests whether a value matches the constraints of a named route parameter.
         * @param name Name of a route parameter.
         * @param value A string being tested.
         */
        match(name: string, value: string): boolean;
        /**
         * Tests whether a value matches the constraints of the n-th segment.
         * @param name A zero-based index.
         * @param value A string being tested.
         */
        match(index: number, value: string): boolean;
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
        replace(params: Partial<RouteParam>): Promise<NavigateResult>;
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
         * Specifies how the router will update URL in browser's address bar.
         * Default is "pathname".
         */
        urlMode?: 'pathname' | 'query' | 'none';
        /**
         * Specifies base path of the app, that is excluded in route matching and always appears in address bar.
         * Value is ignored if {@link RouterOptions.urlMode} is not "pathname".
         */
        baseUrl?: string;
        /**
         * Specifies base path must be explicitly included in {@link WithRouter.path} and related method like {@link WithRouter.navigate}.
         * Value is ignored if {@link RouterOptions.urlMode} is not "pathname".
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
        routes?: readonly string[];
        /**
         * Specifies whether to resume previous router state when the page is temporarily left.
         * The option is ignored when the page is being reload, or by back or forward action.
         *
         * When set to `true`, it will resume of history of the same page, where the key is the pathname resolved from app's root path,
         * i.e. the `baseUrl` option in `pathname` mode, or `location.pathname` in `query` or `none` mode.
         *
         * To resume history from another page, specify the pathname of the that page.
         * For example, from the page of another language which the path is not controlled by in app router.
         */
        resume?: boolean | string;
        /**
         * Specifies whether to resume previous router state when the page is reloaded.
         * The option is ignored when the page is landed through address bar or hyperlinks, or by back or forward action.
         *
         * In default behavior, i.e. when it is `false`, either the history storage is cleared,
         * or if `urlMode` is `none`, the app is reset to initial path.
         */
        resumeOnReload?: boolean;
    }
}
