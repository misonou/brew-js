export function getAttrValues(element: Element): Zeta.Dictionary<string>;

export function hasAttr(element: Element, name: string): boolean;

export function getAttr(element: Element, name: string): string | undefined;

export function setAttr(element: Element, name: string, value: string): void;

export function setAttr(element: Element, values: Zeta.Dictionary<string>): void;

export function copyAttr(src: Element, dst: Element): void;

export function selectorForAttr(attr: string[] | Zeta.Dictionary): string;

export function getFormValues(form: HTMLFormElement): Zeta.Dictionary;

export function getQueryParam(name: string): string;

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
