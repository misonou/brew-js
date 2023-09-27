export function getAttrValues(element: Element): Zeta.Dictionary<string>;

/**
 * Gets whether a given attribute is a boolean-mapped attribute for an element.
 * @param element A DOM element.
 * @param name Name of attribute to test.
 */
export function isBoolAttr(element: Element, name: string): boolean;

export function hasAttr(element: Element, name: string): boolean;

export function getAttr(element: Element, name: string): string | null;

export function setAttr(element: Element, name: string, value: string | null): void;

export function setAttr(element: Element, values: Zeta.Dictionary<string | null>): void;

export function copyAttr(src: Element, dst: Element): void;

export function selectorForAttr(attr: string[] | Zeta.Dictionary): string;

export function getFormValues(form: HTMLFormElement): Zeta.Dictionary;

export function getQueryParam(name: string, current?: string): string | false;

export function setQueryParam(name: string, value: string, current?: string): string;

export function getCookie(name: string): string;

export function setCookie(name: string, value: string, expiry?: number): string;

export function deleteCookie(name: string): void;

export function cookie(name: string, expiry?: number): {
    get: () => string;
    set: (value: any) => string;
    delete: () => void;
};

export function api(options?: Brew.APIOptions): Brew.API;

export function api(method: Brew.HTTPMethod, baseUrl: string): Brew.APIMethod;

export function api(method: Brew.HTTPMethod, options?: Omit<Brew.APIOptions<T>, 'methods'>): Brew.APIMethod;

export function getJSON(path: string): Promise<Zeta.Dictionary>;

export function loadScript(url: string | string[], options?: {
    nomodule?: boolean;
    module?: boolean;
}): Promise<Zeta.Dictionary>;

export function addStyleSheet(url: string, media?: string): void;

export function preloadImages(urls: string[] | Element, ms?: number): Promise<any>;

/**
 * Opens a new window with URL that is yet to be resolved asynchronously.
 *
 * The returned promise will resolve to `true` when the resolved URL is being loaded in target window;
 * otherwise to `false` if the new window cannot be opened or the opened window is closed before URL is resolved.
 * It will forward rejection result if the given promise rejects.
 *
 * @param promise A promise that resolves the target URL.
 * @param initialUrl URL to show during loading, typically a loading screen. A blank page with text "Loading..." will be used if not specified.
 * @param target Name of target window.
 * @param features A string containing a comma-separated list of window features, same as {@link Window.open}.
 */
export function openDeferredURL(promise: Promise<string>, initialUrl?: string, target?: string, features?: string): Promise<boolean>;
