import brew, { Extension } from "./core";

type WithExport<T> = T extends Extension<infer P> ? P : T;
type WithExtension<T extends any[]> = T extends [infer U, ...infer TRest] ? WithExport<U> & WithExtension<TRest> : {};

export interface AppInit<U = {}> {
    /**
     * Initialize an app instance.
     * App instance will become ready once all promises registered through {@link Brew.AppInstance.beforeInit}
     * during the init callback are all settled.
     * @param init Callback to initialize before app starts.
     */
    <T = {}>(init: (app: Brew.AppInstance<T & U>) => void): Brew.AppInstance<T & U>;

    /**
     * Uses the supplied extensions.
     * Extension can be either a function returned by {@link addExtension},
     * or an object which its properties are copied to the app instance.
     * @param args A list of extensions.
     */
    with<T extends any[]>(...args: T): AppInit<WithExtension<T>>;
};

declare const init: AppInit;

export default init;

/**
 * Gets the app instance.
 */
export var app: Brew.AppInstance;

/**
 * Gets whether the app has started.
 */
export var appReady: boolean;

/**
 * Gets whether the app initialization callback has been execute.
 */
export var appInited: boolean;

/**
 * Registers an extension to the app.
 * A method of the name `use{Name}` in camel-case is automatically generated,
 * for which when called, the given initialization callback will be invoked.
 * @param name Name of the extension.
 * @param callback A callback to initialize the extension.
 * @deprecated Use {@link addExtension} instead.
 */
export function install(name: string, callback: (this: Brew.AppInstance<Zeta.Dictionary>, app: Brew.AppInstance<Zeta.Dictionary>, options: Zeta.Dictionary) => void): void;

/**
 * Registers an extension that will be initialized when passed to {@link brew.with}.
 * @param name Name of the extension.
 * @param callback A callback to initialize the extension.
 */
export function addExtension<T = Zeta.Dictionary>(autoInit: true, name: string, callback: (this: Brew.AppInstance<T>, app: Brew.AppInstance<T>, options: {}) => void): Extension<T>;

/**
 * Registers an extension that will be initialized when passed to {@link brew.with}.
 * @param name Name of the extension.
 * @param deps A list of dependencies. Extension names can be prefixed with `?` for optional dependencies.
 * @param callback A callback to initialize the extension.
 */
export function addExtension<T = Zeta.Dictionary>(autoInit: true, name: string, deps: string[], callback: (this: Brew.AppInstance<T>, app: Brew.AppInstance<T>, options: {}) => void): Extension<T>;

/**
 * Registers an extension to the app.
 * A method of the name `use{Name}` in camel-case is automatically generated,
 * for which when called, the given initialization callback will be invoked.
 * @param name Name of the extension.
 * @param callback A callback to initialize the extension.
 */
export function addExtension<T = Zeta.Dictionary, U = Zeta.Dictionary>(name: string, callback: (this: Brew.AppInstance<T>, app: Brew.AppInstance<T>, options: U) => void): Extension<T>;

/**
 * Registers an extension to the app.
 * A method of the name `use{Name}` in camel-case is automatically generated,
 * for which when called, the given initialization callback will be invoked.
 * @param name Name of the extension.
 * @param deps A list of dependencies. Extension names can be prefixed with `?` for optional dependencies.
 * @param callback A callback to initialize the extension.
 */
export function addExtension<T = Zeta.Dictionary, U = Zeta.Dictionary>(name: string, deps: string[], callback: (this: Brew.AppInstance<T>, app: Brew.AppInstance<T>, options: U) => void): Extension<T>;

/**
 * Adds a feature detection.
 * @param name Name of the feature.
 * @param callback A callback to perform the detection and return the result.
 */
export function addDetect(name: string, callback: () => boolean | Promise<boolean>): void;

export function isElementActive(element: Element): boolean;
