export interface AppInit {
    /**
     * Initialize an app instance.
     * App instance will become ready once all promises registered through {@link Brew.AppInstance.beforeInit}
     * during the init callback are all settled.
     * @param init Callback to initialize before app starts.
     */
    <T = {}>(init: (app: Brew.AppInstance<T>) => void): Brew.AppInstance<T>;
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
 */
export function install(name: string, callback: (this: Brew.AppInstance<Zeta.Dictionary>, app: Brew.AppInstance<Zeta.Dictionary>, options: Zeta.Dictionary) => void): void;

/**
 * Adds a feature detection.
 * @param name Name of the feature.
 * @param callback A callback to perform the detection and return the result.
 */
export function addDetect(name: string, callback: () => boolean | Promise<boolean>): void;
