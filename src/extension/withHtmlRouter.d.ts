/// <reference path="withRouter.d.ts"/>

namespace Brew {
    interface WithHtmlRouter extends WithRouter {
        /**
         * @param callback
         */
        beforePageEnter(callback: (element: Element) => PromiseOrEmpty): void;

        /**
         * @param route
         * @param callback
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
         * @param options
         */
        useHtmlRouter(options: RouterOptions): void;
    }
}
