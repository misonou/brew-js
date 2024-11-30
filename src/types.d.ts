declare namespace Brew {
    /* -------------------------------------------------------------
     * Re-exports from module
     * ------------------------------------------------------------- */
    type Extension<T> = import("./core").Extension<T>;
    type ExtensionEventMap<T> = import("./core").ExtensionEventMap<T>;
    type CookieAttributes = import("./util").CookieAttributes;

    /* -------------------------------------------------------------
     * Helper interfaces
     * ------------------------------------------------------------- */
    type HTTPMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head';
    type EventHandler<E extends string, M, T = Element> = Zeta.ZetaEventHandler<E, M, T>;
    type EventHandlers<E extends string, M, T = Element> = { [P in E]?: Zeta.ZetaEventHandler<P, M, T> };
    type ExtendedEventMap<E extends string, M> = E extends keyof M ? M : { [P in E]: P extends keyof M ? M[P] : Zeta.ZetaEvent<Element> };
    type AppInstance<T = {}> = App<T> & T & Zeta.ZetaEventDispatcher<T extends ExtensionEventMap<infer M> ? M : {}, any>;
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
        /**
         * Gets the new inline HTML content.
         */
        $$html?: string;
    }

    interface VarContext {
        readonly element: HTMLElement;
        [s: string]: any;
    }

    interface DirectiveComponent {
        readonly element: Element;

        /**
         * Toggles whether to apply `loading` CSS class when async operation is registered
         * through `notifyAsync` or `runAsync`.
         */
        enableLoadingClass: boolean;
    }

    interface EventDispatcher<T extends string = string, M = {}> extends ExtensionEventMap<ExtendedEventMap<T, M>> {
        /**
         * Listens global events or events triggered from any elements.
         * @param event Event name.
         * @param handler Callack to be fired when such events are triggered.
         * @param noChildren When set to true, events triggered from child elements will not be listened.
         */
        on<E extends T>(event: E, handler: EventHandler<E, M, this>, noChildren?: true): Zeta.UnregisterCallback;

        /**
         * Listens events triggered from target elements.
         * @param target A DOM element or a CSS selector to identify elements.
         * @param event Event name.
         * @param handler Callack to be fired when such events are triggered.
         * @param noChildren When set to true, events triggered from child elements will not be listened.
         */
        on<E extends T, K extends Element | string>(target: K, event: E, handler: EventHandler<E, M, K extends string ? Zeta.ElementType<K> : K>, noChildren?: true): Zeta.UnregisterCallback;

        /**
         * Listens multiple events.
         * @param handlers A dictionary which keys are event names and values are the associated handlers.
         * @param noChildren When set to true, events triggered from child elements will not be listened.
         */
        on(handlers: EventHandlers<T, M, this>, noChildren?: true): Zeta.UnregisterCallback;

        /**
         * Listens multiple events.
         * @param target A DOM element or a CSS selector to identify elements.
         * @param handlers A dictionary which keys are event names and values are the associated handlers.
         * @param noChildren When set to true, events triggered from child elements will not be listened.
         */
        on<K extends Element | string>(target: K, handlers: EventHandlers<T, M, K extends string ? Zeta.ElementType<K> : K>, noChildren?: true): Zeta.UnregisterCallback;
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
    type BrewEventName = 'ready' | 'animationstart' | 'animationcomplete' | 'domchange' | 'statechange' | 'flyoutshow' | 'flyouthide' | 'preventLeave' | 'mounted' | 'validate' | 'reset' | 'unload';

    type BrewEventMap = {
        animationstart: AnimationEvent;
        animationcomplete: AnimationEvent;
        statechange: StateChangeEvent;
        unload: UnloadEvent;
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

    interface UnloadEvent extends Zeta.ZetaEventBase {
        readonly persisted: boolean;
    }

    interface ValidateEvent extends Zeta.ZetaAsyncHandleableEvent<boolean> {
    }

    interface Watchable {
        /**
         * Watches a property on the object.
         * @param prop Property name.
         * @param handler Callback to be fired and the property is changed.
         * @param fireInit Optionally fire the handler immediately.
         */
        watch<P extends keyof this>(prop: P, handler?: (this: this, newValue: Zeta.PropertyTypeOrAny<this, P>, oldValue: Zeta.PropertyTypeOrAny<this, P>, prop: P, obj: this) => void, fireInit?: boolean): Zeta.UnregisterCallback;
        /**
         * Watches a property and resolves when the property is changed.
         * @param prop Property name.
         * @param handler Callback to be fired when the property is changed.
         */
        watchOnce<P extends keyof this>(prop: P, handler?: (this: this, newValue: Zeta.PropertyTypeOrAny<this, P>, oldValue: Zeta.PropertyTypeOrAny<this, P>, prop: P, obj: this) => void): Promise<Zeta.PropertyTypeOrAny<this, P>>;
    }

    interface App<T = {}> extends EventDispatcher<BrewEventName, BrewEventMap>, Watchable {
        /**
         * Gets the root element associated with the app.
         */
        readonly element: HTMLElement;

        /**
         * Gets the promise which is resolved when app is ready.
         */
        readonly ready: Promise<App<T>>;

        /**
         * Gets the ready state of the app instance.
         */
        readonly readyState: 'init' | 'ready' | 'error';

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
        detect<T extends string>(names: T, callback?: (result: Record<T, any>) => void): void;

        /**
         * Performs feature detections before the app starts.
         * @param names Names of feature.
         * @param callback
         */
        detect<T extends string[]>(names: T, callback?: (result: Record<Zeta.ArrayMember<T>, any>) => void): void;

        /**
         * Registers a callback that will be fired only when the promise resolves to a truthy value.
         * App start is postponed until the promise is fulfilled.
         * @param promise A promise-like object.
         * @param callback A callback to be fired.
         */
        when<T>(promise: T | PromiseLike<T>, callback: (value: T) => void): void;

        /**
         * Postpones app start until the promise is fulfilled.
         *
         * When all operations have completed, {@link AppInstance.readyState} will be set to `ready`
         * and {@link AppInstance.ready} will resolve. When error is thrown in callback or a promise rejects,
         * the app will halt and never be started, whereas {@link AppInstance.readyState} will be set to `error`.
         *
         * @param promise A promise-like object or a callback that returns promise-like object when called.
         */
        beforeInit(promise: PromiseLike<any> | (() => PromiseOrEmpty)): void;

        /**
         * Postpones app start indefinitely.
         *
         * It is intended to avoid unnecessary rendering when the page is about to navigate away during app init.
         * It has no effects if initialization has ended, i.e. {@link AppInstance.readyState} is `ready` or `error`.
         */
        halt(): void;

        emit(event: string, data?: any, options?: boolean | Zeta.EventEmitOptions): PromiseOrEmpty;

        emit(event: string, target: Element, data?: any, options?: boolean | Zeta.EventEmitOptions): PromiseOrEmpty;

        /**
         * Gets whether a given element is part of the active layout of the current path.
         * @param element A DOM element.
         */
        isElementActive(element: Element): boolean;
    }
}
