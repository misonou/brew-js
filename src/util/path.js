export var baseUrl = '';

/**
 * @param {string} b 
 */
export function setBaseUrl(b) {
    baseUrl = b;
}

/**
 * @param {string} a 
 * @param {string} b 
 */
export function combinePath(a, b) {
    a = normalizePath(a);
    b = normalizePath(b);
    if (a === '/') {
        return b;
    }
    if (b === '/') {
        return a;
    }
    return a + b;
}

/**
 * @param {string} path 
 */
export function normalizePath(path) {
    path = path.replace(/\/+$/, '') || '/';
    return path.indexOf('://') >= 0 || path[0] === '/' ? path : '/' + path;
}

/**
 * @param {string} url 
 */
export function withBaseUrl(url) {
    url = normalizePath(url);
    return baseUrl && url[0] === '/' && !isSubPathOf(url, baseUrl) ? normalizePath(baseUrl + url) : url;
}

/**
 * @param {string} url 
 */
export function toAbsoluteUrl(url) {
    return location.origin + withBaseUrl(url);
}

/**
 * @param {string} url 
 */
export function toRelativeUrl(url) {
    return url.substr(0, location.origin.length) === location.origin ? url.substr(location.origin.length) : url;
}

/**
 * @param {string} a 
 * @param {string} b 
 */
export function isSubPathOf(a, b) {
    return a.substr(0, b.length) === b && (a.length === b.length || a[b.length] === '/');
}
