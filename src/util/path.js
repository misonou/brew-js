const defaultPort = {
    http: 80,
    https: 443
};

export var baseUrl = '/';

/**
 * @param {string} b
 */
export function setBaseUrl(b) {
    baseUrl = normalizePath(b, true);
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
 * @param {boolean=} resolveDotDir
 */
export function normalizePath(path, resolveDotDir) {
    if (path === undefined || path === null) {
        return '/';
    }
    if (/(:\/\/)|\?|#/.test(path)) {
        var a = document.createElement('a');
        a.href = path;
        return (RegExp.$1 && (a.origin || (a.protocol + '//' + a.hostname + (a.port && +a.port !== defaultPort[a.protocol.slice(0, -1)] ? ':' + a.port : '')))) + normalizePath(a.pathname, resolveDotDir) + a.search + a.hash;
    }
    path = String(path).replace(/\/+(\/|$)/g, '$1');
    if (resolveDotDir && path.indexOf('./') >= 0) {
        var segments = path.split('/');
        for (var j = 0; j < segments.length;) {
            if (segments[j] === '.' || (segments[j] === '..' && !j)) {
                segments.splice(j, 1);
            } else if (segments[j] === '..') {
                segments.splice(--j, 2);
            } else {
                j++;
            }
        }
        path = segments.join('/');
    }
    return path[0] === '/' ? path : '/' + path;
}

/**
 * @param {string} url
 */
export function withBaseUrl(url) {
    url = normalizePath(url);
    return baseUrl && url[0] === '/' && !isSubPathOf(url, baseUrl) ? combinePath(baseUrl, url) : url;
}

/**
 * @param {string} url
 */
export function toAbsoluteUrl(url) {
    return url.indexOf('://') > 0 ? url : location.origin + withBaseUrl(url);
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
