declare namespace Brew {
    /* -------------------------------------------------------------
     * Helper interfaces
     * ------------------------------------------------------------- */
    type HTTPMethod = 'get' | 'post' | 'delete';
    type EventHandler<E extends string, M> = Zeta.ZetaEventHandler<E, M>;
    type EventHandlers<T extends string, M> = { [E in T]: EventHandler<E, M> }
    type AppInstance<T = {}> = App<T> & T & Brew.EventDispatcher;
    type PromiseOrEmpty<T = any> = Promise<T> | void;
    type DOMProcessorCallback = (element: Element, getState: (element: Element) => Zeta.Dictionary, applyDOMUpdates: (element: Element, updates: Brew.DOMUpdateState) => void) => void;

    interface DOMUpdateState extends Zeta.Dictionary {
        /**
         * Gets the new style being applied to the element.
         */
        style?: Zeta.Dictionary<string>;
        /**
         * Gets the new computed values from `set-class` attribute of the element.
         * These values will be passed to `zeta.util.setClass`.
         */
        $$class?: Zeta.Dictionary<string>;
        /**
         * Gets the new inline text content.
         */
        $$text?: string;
    }

    interface VarContext extends Zeta.InheritedNode {
        [s: string]: any;
    }

    interface EventDispatcher<T extends string = string, M = any> {
        /**
         * Listens global events or events triggered from any elements.
         * @param event Event name.
         * @param handler Callack to be fired when such events are triggered.
         * @param noChildren When set to true, events triggered from child elements will not be listened.
         */
        on<E extends T>(event: E, handler: EventHandler<E, M>, noChildren?: true): void;

        /**
         * Listens events triggered from target elements.
         * @param target A DOM element or a CSS selector to identify elements.
         * @param event Event name.
         * @param handler Callack to be fired when such events are triggered.
         * @param noChildren When set to true, events triggered from child elements will not be listened.
         */
        on<E extends T>(target: string | Element, event: E, handler: EventHandler<E, M>, noChildren?: true): void;

        /**
         * Listens multiple events.
         * @param handlers A dictionary which keys are event names and values are the associated handlers.
         * @param noChildren When set to true, events triggered from child elements will not be listened.
         */
        on(handlers: EventHandlers<T, M>, noChildren?: true): void;

        /**
         * Listens multiple events.
         * @param target A DOM element or a CSS selector to identify elements.
         * @param handlers A dictionary which keys are event names and values are the associated handlers.
         * @param noChildren When set to true, events triggered from child elements will not be listened.
         */
        on(target: string | Element, handlers: EventHandlers<T, M>, noChildren?: true): void;
    }

    interface APIOptions {
        /**
         * Specifies the types of requests the factory should generate functions for.
         * @deprecated
         */
        methods?: HTTPMethod | HTTPMethod[];
        /**
         * Specifies the base URL prepended to the request path.
         */
        baseUrl?: string;
        /**
         * Specifies the bearer authorization token to be sent with the requests.
         */
        token?: string;
        /**
         * Gets the new token which will replace the current authorization token.
         * If the token remains unchanged, i.e. same as `currentToken`,
         * the function must still return the current token.
         */
        getTokenFromResponse?: (response: any, currentToken: string) => string;
    }

    interface APIMethod {
        /**
         * Performs request to the specified path with parameters.
         */
        (path: string, params?: any): Promise<any>;
        /**
         * Gets or sets the base URL prepended to the request path.
         */
        baseUrl?: string;
        /**
         * Gets or sets the bearer authorization token to be sent with the requests.
         */
        token?: string;
    }

    interface API extends Record<HTTPMethod, APIMethod> {
        /**
         * Gets or sets the base URL prepended to the request path.
         */
        baseUrl?: string;
        /**
         * Gets or sets the bearer authorization token to be sent with the requests.
         */
        token?: string;
    }

    /* -------------------------------------------------------------
     * App
     * ------------------------------------------------------------- */
    type BrewEventName = 'ready' | 'animationstart' | 'domchange' | 'statechange' | 'preventLeave' | 'mounted' | 'validate' | 'reset';

    type BrewEventMap = {
        animationstart: AnimationEvent;
        animationcomplete: AnimationEvent;
        statechange: StateChangeEvent;
        validate: ValidateEvent;
    }

    interface AnimationEvent extends Zeta.ZetaEventBase {
        /**
         * Gets whether the animation is intro or outro.
         */
        readonly animationType: 'in' | 'out'
        /**
         * Gets the trigger source for the animation.
         * Possible sources include `show`, `statechange` or others.
         */
        readonly animationTrigger: string;
    }

    interface StateChangeEvent extends Zeta.ZetaEventBase {
        readonly data: Zeta.Dictionary;
        readonly oldValues: Zeta.Dictionary;
        readonly newValues: Zeta.Dictionary;
    }

    interface ValidateEvent extends Zeta.ZetaAsyncHandleableEvent<boolean> {
    }

    interface App<T = {}> extends EventDispatcher<BrewEventName, BrewEventMap>, Zeta.Watchable<AppInstance<T>> {
        /**
         * Gets the root element associated with the app.
         */
        readonly element: HTMLElement;

        /**
         * Gets the promise which is resolved when app is ready.
         */
        readonly ready: Promise<App<T>>;

        /**
         * Defines properties and methods on the app instance.
         * @param props
         */
        define(props: Partial<T>): void;

        /**
         * Performs feature detections before the app starts.
         * @param names Names of feature.
         * @param callback
         */
        detect<T extends string | string[]>(names: T, callback?: (result: Record<T, any>) => void): void;

        /**
         * Registers a callback that will be fired only when the promise resolves to a truthy value.
         * App start is postponed until the promise is fulfilled.
         * @param promise A promise-like object.
         * @param callback A callback to be fired.
         */
        when<T>(promise: T | PromiseLike<T>, callback: (value: T) => void): void;

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
         * Registers handler to be fired when each matched element is being mounted.
         * @param selector A valid CSS selector identifying elements.
         * @param handler A callback function which receives is the matched element.
         */
        matchElement(selector: string, handler: (element: Element) => void): void;

        /**
         * Determines whether a route matches a given path.
         * @param {string} route
         * @param {string} path Path to match.
         * @param {boolean=} ignoreExact Whether to match child paths even though there is no trailing wildcard character in the route.
         */
        matchRoute(route: string, path: string, ignoreExact?: boolean): boolean;

        /**
         * Postpones app start until the promise is fulfilled.
         * @param promise A promise-like object or a callback that returns promise-like object when called.
         */
        beforeInit(promise: PromiseLike<any> | (() => PromiseOrEmpty)): void;

        /**
         * Registers handler to perform asychronous operations when DOM is about to change.
         * If the handler returns a promise, DOM changes are delayed until the promise resolves.
         * @param callback A callback function which receives a list of updates.
         */
        beforeUpdate(callback: (domUpdates: Map<Element, DOMUpdateState>) => PromiseOrEmpty): void;

        /**
         * Register handler to perform asynchronous operations before page is displayed after navigation.
         * If the handler returns a promise, the `pageenter` event is delayed until the promise resolves.
         * @param callback A callback function which receives is the matched element.
         */
        beforePageEnter(callback: (element: Element) => PromiseOrEmpty): void;

        emit(event: string, data?: any, bubble?: boolean): PromiseOrEmpty;

        emit(event: string, target: Element, data?: any, bubble?: boolean): PromiseOrEmpty;
    }
}
