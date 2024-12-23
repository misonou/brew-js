const defaultPort = {
    http: 80,
    https: 443
};

export var baseUrl = '/';

function getIndexOfQueryAndHash(path) {
    var pos1 = path.indexOf('?') + 1;
    var pos2 = path.indexOf('#') + 1;
    return pos1 && pos2 ? Math.min(pos1, pos2) - 1 : (pos1 || pos2) - 1;
}

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
    if (b === '/') {
        return a;
    }
    if (a === '/' || b.indexOf('://') > 0) {
        return b;
    }
    return a + b;
}

/**
 * @param {string} path
 */
export function parsePath(path) {
    var a = document.createElement('a');
    a.href = path;
    return a;
}

/**
 * @param {string} path
 * @param {boolean=} resolveDotDir
 * @param {boolean=} returnEmpty
 */
export function normalizePath(path, resolveDotDir, returnEmpty) {
    if (!path || path === '/') {
        return returnEmpty ? '' : '/';
    }
    path = String(path);
    if (!returnEmpty && /(^(?:[a-z0-9]+:)?\/\/)|[^A-Za-z0-9-._~:/\[\]@!$&'()*+,;=]/.test(path)) {
        var a = parsePath(path);
        return ((RegExp.$1 && (a.origin || (a.protocol + '//' + a.hostname + (a.port && +a.port !== defaultPort[a.protocol.slice(0, -1)] ? ':' + a.port : '')))) + normalizePath(a.pathname, resolveDotDir, true) || '/') + a.search + a.hash;
    }
    path = path.replace(/\/+(\/|$)|(%[0-9a-fA-F]{2})/g, function (v, a, b) {
        return b ? b.toUpperCase() : a;
    });
    if (resolveDotDir && /(^|\/)\.{1,2}(\/|$)/.test(path)) {
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

export function getQueryAndHash(path) {
    var pos = getIndexOfQueryAndHash(path);
    return pos >= 0 ? path.slice(pos) : '';
}

export function removeQueryAndHash(path) {
    var pos = getIndexOfQueryAndHash(path);
    return pos >= 0 ? path.slice(0, pos) : path;
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
    return isSubPathOf(url, location.origin) || url;
}

/**
 * @param {string} a
 * @param {string} b
 */
export function isSubPathOf(a, b) {
    var len = b.length;
    return a.substr(0, len) === b && (!a[len] || /[/?#]/.test(a[len]) || b[len - 1] === '/') && ((a[len] === '/' ? '' : '/') + a.slice(len));
}

/**
 * @param {string} path
 */
export function toSegments(path) {
    path = normalizePath(path);
    return path === '/' ? [] : path.slice(1).split('/').map(decodeURIComponent);
}
