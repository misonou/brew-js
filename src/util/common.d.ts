export function compareObject<T extends any[] | Map | Set | Record<string, any>>(a: T, b: T): boolean;

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

export function api(options: Brew.APIOptions): Brew.API;

export function api(method: Brew.HTTPMethod, options?: Brew.APIOptions): Brew.APIMethod;

export function getJSON(path: string): Promise<Zeta.Dictionary>;

export function loadScript(url: string | string[], options?: {
    nomodule?: boolean;
    module?: boolean;
}): Promise<Zeta.Dictionary>;

export function addStyleSheet(url: string, media?: string): void;

export function preloadImages(urls: string[] | Element, ms?: number): any;
