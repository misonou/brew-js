/**
 * Gets whether a given element is part of the active layout of the current path.
 * @param {Element} v A DOM element.
 * @param {Element[]=} arr
 */
export function isElementActive(v: Element, arr?: Element[] | undefined): boolean;

/**
 * @param {Zeta.AnyFunction} callback
 */
export function hookBeforePageEnter(callback: Zeta.AnyFunction): void;

/**
 * @param {string} route
 * @param {Zeta.AnyFunction} callback
 */
export function hookBeforePageEnter(route: string, callback: Zeta.AnyFunction): void;

/**
 * Determines whether a route matches a given path.
 * @param {string} route
 * @param {string} path Path to match.
 * @param {boolean=} ignoreExact Whether to match child paths even though there is no trailing wildcard character in the route.
 */
export function matchRoute(route: string, path: string, ignoreExact?: boolean): boolean;
