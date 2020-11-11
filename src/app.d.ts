export interface AppInit {
    /**
     * Initialize an app instance.
     * @param init Callback to initialize before app starts.
     */
    <T = {}>(init: (app: Brew.AppInstance<T>) => void): void;
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

/**
 * Adds a named template that is later applied to element with `apply-template` attribute.
 * @param name Name of the template.
 * @param template A DOM node or a valid HTML string. It should not be a DocumentFragment, nor an HTML string containing multiple root elements.
 */
export function addTemplate(name: string, template: Node | JQuery.htmlString): void;
