/// <reference path="withRouter.d.ts"/>

namespace Brew {
    interface WithHtmlRouter extends WithRouter {
        /**
         * Registers hook to perform operation before `pageenter` event.
         * @param callback Callback to be invoked. If promise is returned, `pageenter` event is deferred until promise is resolved.
         */
        beforePageEnter(callback: (element: Element) => PromiseOrEmpty): void;

        /**
         * Registers hook to perform operation before `pageenter` event for specific paths.
         * @param route A string containing a valid route. Wildcard and segments containing regular expression filter is supported.
         * @param callback Callback to be invoked. If promise is returned, `pageenter` event is deferred until promise is resolved.
         */
        beforePageEnter(route: string, callback: (element: Element) => PromiseOrEmpty): void;

        /**
         * Registers handler to be fired when each element matched the given path is being mounted.
         * @param path A path that matched the `match-path` attribute of an element. The current route prefix `~/` can be used.
         * @param handler A callback function where the first argument is the matched element.
         */
        matchPath(path: string, handler: (element: Element) => void): void;

        /**
         * Registers handler to be fired when each element matched the given path is being mounted.
         * @param path A path that matched the `match-path` attribute of an element. The current route prefix `~/` can be used.
         * @param selector A valid CSS selector that filters elements.
         * @param handler A callback function which receives the matched element.
         */
        matchPath(path: string, selector: string, handler: (element: Element) => void): void;

        /**
         * Configures router.
         * @param options Options for router.
         * @see {@link RouterOptions}
         */
        useHtmlRouter(options: RouterOptions): void;
    }
}
