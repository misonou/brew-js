/**
 * Gets all attributes present on an element.
 * @param element A DOM element.
 */
export function getAttrValues(element: Element): Zeta.Dictionary<string>;

/**
 * Gets whether a given attribute is a boolean-mapped attribute for an element.
 * @param element A DOM element.
 * @param name Name of attribute to test.
 */
export function isBoolAttr(element: Element, name: string): boolean;

/**
 * Gets whether an element has attribute with the specified name.
 * @param element A DOM element.
 * @param name Name of attribute to test.
 */
export function hasAttr(element: Element, name: string): boolean;

/**
 * Gets the value of the specified attribute on an element.
 * @param element A DOM element.
 * @param name Name of attribute.
 * @returns Value of the attribute if present; `null` otherwise.
 */
export function getAttr(element: Element, name: string): string | null;

/**
 * Sets or removes attribute on an element.
 * @param element A DOM element.
 * @param name Name of attribute.
 * @param value Value to set. If `null` is given, the attribute will be removed.
 */
export function setAttr(element: Element, name: string, value: string | null): void;

/**
 * Sets or removes multiple attributes on an element.
 * @param element A DOM element.
 * @param values A dictionary which each key specifies the name of attribute to set or remove.
 */
export function setAttr(element: Element, values: Zeta.Dictionary<string | null>): void;

/**
 * Copies all attributes from one element to another.
 * Existing attributes on the target element will remain if those are not present on the source element.
 * @param src A DOM element from which its attributes are copied.
 * @param dst A DOM element on where copied attributes are set.
 */
export function copyAttr(src: Element, dst: Element): void;

/**
 * @private
 */
export function selectorForAttr(attr: string[] | Zeta.Dictionary): string;

/**
 * @private
 */
export function getFormValues(form: HTMLFormElement): Zeta.Dictionary;

/**
 * Gets the value of a query parameter from current location.
 * If the parameter is not present in the query string, `false` will be returned.
 * @param name Name of the query parameter.
 */
export function getQueryParam(name: string): string | false;

/**
 * Gets the value of a query parameter from the given query string.
 * If the parameter is not present in the query string, `false` will be returned.
 * @param name Name of the query parameter.
 * @param url A query string or a URL.
 */
export function getQueryParam(name: string, url: string): string | false;

/**
 * Returns a query string that includes the specific parameter, along with existing query parameters in current location.
 * @param name Name of the query parameter.
 * @param value Value to set. When given `false` or `null`, the parameter will be removed from query string.
 */
export function setQueryParam(name: string, value: string | false | null): string;

/**
 * Returns a query string that includes the specific parameter, along with query parameters from the given query string.
 * @param name Name of the query parameter.
 * @param value Value to set. When given `false` or `null`, the parameter will be removed from query string.
 * @param url A query string or a URL.
 */
export function setQueryParam(name: string, value: string | false | null, url: string): string;

/**
 * Gets the value of a cookie from the current document.
 * @param name Name of the cookie.
 */
export function getCookie(name: string): string;

/**
 * Sets a cookie to the current document.
 * @param name Name of the cookie.
 * @param value Value to set.
 * @param expiry An optional expiry date in milliseconds relative to current time.
 */
export function setCookie(name: string, value: string, expiry?: number): string;

/**
 * Deletes a cookie from the current document.
 * @param name Name of the cookie.
 */
export function deleteCookie(name: string): void;

/**
 * Creates a collection of functions that read or write a specific cookie.
 */
export function cookie(name: string, expiry?: number): {
    get: () => string;
    set: (value: any) => string;
    delete: () => void;
};

/**
 * Creates a collection of functions that executes HTTP requests.
 */
export function api(options?: Brew.APIOptions): Brew.API;

/**
 * Creates a function that executes a specific type of HTTP requests.
 */
export function api(method: Brew.HTTPMethod, baseUrl: string): Brew.APIMethod;

/**
 * Creates a function that executes a specific type of HTTP requests.
 */
export function api(method: Brew.HTTPMethod, options?: Omit<Brew.APIOptions<T>, 'methods'>): Brew.APIMethod;

/**
 * @deprecated
 */
export function getJSON(path: string): Promise<Zeta.Dictionary>;

/**
 * Loads and execute JavaScript codes at the specified URLs.
 * If multiple URLs are given, subsequent ones will be loaded after the previous is loaded.
 * @param url One or more URLs that points to JavaScript documents.
 */
export function loadScript(url: string | string[], options?: {
    nomodule?: boolean;
    module?: boolean;
}): Promise<Zeta.Dictionary>;

/**
 * Loads a stylesheet at the specified URL.
 * @param url A URL that points to a stylesheet.
 * @param media An optional string to be set as the `media` attribute of the `<link>` element.
 */
export function addStyleSheet(url: string, media?: string): void;

/**
 * Preloads images at the specifed URLs.
 * @param urls An array of image URLs.
 * @param ms A optional timeout.
 * @returns A promise that resolved when all images are loaded or failed to load, or has reached timeout.
 */
export function preloadImages(urls: string[], ms?: number): Promise<any>;

/**
 * Preloads images sourced by any decendant `<img>` elements, or by `background-image` CSS properties of any decendant elements.
 * @param element A DOM element.
 * @param ms A optional timeout.
 * @returns A promise that resolved when all images are loaded or failed to load, or has reached timeout.
 */
export function preloadImages(element: Element, ms?: number): Promise<any>;

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
