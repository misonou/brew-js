import $ from "../include/jquery.js";
import { isCssUrlValue } from "zeta-dom/cssUtil";
import { createNodeIterator, iterateNode, matchSelector } from "zeta-dom/domUtil";
import { defineAliasProperty, defineGetterProperty, defineHiddenProperty, delay, each, errorWithCode, extend, iequal, isArray, isFunction, isPlainObject, isUndefinedOrNull, keys, kv, map, matchWord, pipe, resolve, resolveAll, single, values, watchOnce } from "zeta-dom/util";
import { combinePath, withBaseUrl } from "./path.js";
import * as ErrorCode from "../errorCode.js";

/** @type {Zeta.Dictionary<Promise<void>>} */
const preloadImagesCache = {};
/** @type {Zeta.Dictionary<Promise<Zeta.Dictionary>>} */
const loadScriptCache = {};
const boolAttrMap = {};

each('allowFullscreen async autofocus autoplay checked controls default defer disabled formNoValidate isMap loop multiple muted noModule noValidate open playsInline readOnly required reversed selected trueSpeed', function (i, v) {
    boolAttrMap[v.toLowerCase()] = v;
});

function encodeNameValue(name, value) {
    return value || value === '' || value === 0 ? encodeURIComponent(name) + '=' + encodeURIComponent(value) : '';
}

function decodeValue(value) {
    return value && value.indexOf('%') >= 0 ? decodeURIComponent(value) : value;
}

export function getAttrValues(element) {
    var values = {};
    each(element.attributes, function (i, v) {
        values[v.name] = v.value;
    });
    return values;
}

export function isBoolAttr(element, name) {
    return name === 'itemscope' || boolAttrMap[name] in Object.getPrototypeOf(element);
}

export function hasAttr(element, name) {
    return !!element.attributes[name];
}

export function getAttr(element, name) {
    return element.getAttribute(name);
}

export function setAttr(element, name, value) {
    if (typeof name !== 'string') {
        each(name, setAttr.bind(0, element));
    } else if (value === null) {
        element.removeAttribute(name);
    } else {
        value = String(value);
        if (getAttr(element, name) !== value) {
            element.setAttribute(name, value);
        }
    }
}

export function copyAttr(src, dst) {
    each(src.attributes, function (i, v) {
        setAttr(dst, v.name, v.value);
    });
}

export function selectorForAttr(attr) {
    if (isPlainObject(attr)) {
        attr = keys(attr);
    }
    return attr[0] ? '[' + attr.join('],[') + ']' : '';
}

/**
 * @param {HTMLFormElement} form
 */
export function getFormValues(form) {
    var values = {};
    each(form.elements, function (i, v) {
        if (v.name && !(v.name in values)) {
            var item = form.elements[v.name];
            defineGetterProperty(values, v.name, function () {
                return item.type === 'checkbox' ? item.checked : item.value;
            });
        }
    });
    return values;
}

function processQueryString(str, name, callback) {
    if (isUndefinedOrNull(str)) {
        str = location.search;
    }
    var getIndex = function (str, ch, from, until) {
        var pos = str.indexOf(ch, from);
        return pos < 0 || pos > until ? until : pos;
    };
    var e = getIndex(str, '#', 0, str.length);
    var s = getIndex(str, '?', 0, e) + 1;
    for (var i = s, j, k; i < e; i = j + 1) {
        j = getIndex(str, '&', i, e);
        k = getIndex(str, '=', i, j);
        if (iequal(name, decodeValue(str.slice(i, k)))) {
            return callback(str.slice(k + 1, j), str, i, j, s, e);
        }
    }
    return callback(false, str, -1, -1, s, e);
}

/**
 * @param {string} name
 */
export function getQueryParam(name, current) {
    return processQueryString(current, name, decodeValue);
}

/**
 * @param {string} name
 * @param {string} value
 * @param {string=} current
 */
export function setQueryParam(name, value, current) {
    return processQueryString(current, name, function (cur, input, i, j, s, e) {
        var replacement = encodeNameValue(name, isFunction(value) ? value(decodeValue(cur)) : value);
        var splice = function (str, from, to, replace) {
            return str.slice(0, from) + replace + str.slice(to);
        };
        if (cur !== false) {
            return replacement ? splice(input, i, j, replacement) : splice(input, i - (j >= e - 1), j + (j < e), '');
        } else {
            var p = input[e - 1] === '?' ? '' : e > s ? '&' : '?';
            return replacement ? splice(input, e, e, p + replacement) : p ? input : splice(input, e - 1, e, '');
        }
    });
}

/**
 * @param {Zeta.Dictionary<string>} values
 */
export function toQueryString(values) {
    var result = map(values, function (v, i) {
        return encodeNameValue(i, v) || null;
    });
    return result[0] ? '?' + result.join('&') : '';
}

/**
 * @param {string} name
 */
export function getCookie(name) {
    return single(document.cookie.split(/;\s?/), function (v) {
        var pos = v.indexOf('=');
        return name === decodeValue(v.slice(0, pos)) ? decodeValue(v.slice(pos + 1)) : false;
    });
}

/**
 * @param {string} name
 * @param {string} value
 * @param {number=} expiry
 */
export function setCookie(name, value, expiry) {
    document.cookie = encodeNameValue(name, String(value)) + ';path=/' + (expiry ? ';expires=' + new Date(Date.now() + expiry).toGMTString() : '');
    return value;
}

/**
 * @param {string} name
 */
export function deleteCookie(name) {
    document.cookie = encodeNameValue(name, '') + ';path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT';
}

/**
 * @param {string} name
 * @param {number=} expiry
 */
export function cookie(name, expiry) {
    return {
        get: function () {
            return getCookie(name);
        },
        set: function (value) {
            return setCookie(name, value, expiry);
        },
        delete: function () {
            return deleteCookie(name);
        }
    };
}

/**
 * @param {Brew.APIMethod | Brew.APIOptions} options
 * @param {=} extra
 */
export function api(options, extra) {
    var httpMethods = 'get post put delete';
    if (typeof options === 'string' && matchWord(options, httpMethods)) {
        extra = extend({}, typeof extra === 'string' ? { baseUrl: extra } : extra, { methods: options });
        return api(extra)[options];
    }
    options = extend({}, options);
    var obj = {
        baseUrl: options.baseUrl,
        token: options.token
    };
    each(options.methods || httpMethods, function (i, v) {
        if (matchWord(v, httpMethods)) {
            defineHiddenProperty(obj, v, function request(method, data) {
                if (!obj.baseUrl) {
                    return watchOnce(obj, 'baseUrl', function () {
                        return request(method, data);
                    });
                }
                var headers = { 'Content-Type': 'application/json' };
                if (obj.token) {
                    headers.Authorization = 'Bearer ' + obj.token;
                }
                return $.ajax({
                    method: v,
                    url: combinePath(obj.baseUrl, method),
                    headers: headers,
                    dataType: 'json',
                    data: JSON.stringify(data || {}),
                    success: function (response) {
                        if (isFunction(options.getTokenFromResponse)) {
                            obj.token = options.getTokenFromResponse(response, obj.token);
                        }
                    }
                }).catch(function (e) {
                    if (e.status === 0) {
                        throw errorWithCode(ErrorCode.networkError);
                    }
                    var response = e.responseJSON;
                    if (response) {
                        console.error(method + ':', response.error || response.message);
                        throw errorWithCode(ErrorCode.apiError, response.error || response.message);
                    }
                    throw errorWithCode(ErrorCode.apiError, e.statusText);
                });
            });
            defineAliasProperty(obj[v], 'baseUrl', obj);
            defineAliasProperty(obj[v], 'token', obj);
        }
    });
    return obj;
}

/**
 * @param {string} path
 */
export function getJSON(path) {
    return $.getJSON(withBaseUrl(path));
}

/**
 * @param {string | string[]} url
 * @param {{ nomodule?: boolean; module?: boolean }=} options
 */
export function loadScript(url, options) {
    if (isArray(url)) {
        return url.reduce(function (v, a) {
            return v.then(function () {
                return loadScript(a, options);
            });
        }, resolve());
    }
    if (!loadScriptCache[url]) {
        loadScriptCache[url] = new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            options = options || {};
            if (options.nomodule) {
                if ('noModule' in script) {
                    resolve();
                    return;
                }
                script.setAttribute('nomodule', '');
            }
            if (options.module) {
                script.setAttribute('type', 'module');
            }
            script.addEventListener('load', function () {
                resolve({});
            });
            script.addEventListener('error', function () {
                reject(errorWithCode(ErrorCode.resourceError));
            });
            script.src = withBaseUrl(url);
            document.head.appendChild(script);
        });
    }
    return loadScriptCache[url];
}

/**
 * @param {string} url
 * @param {string=} media
 */
export function addStyleSheet(url, media) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = withBaseUrl(url);
    if (media) {
        link.media = media;
    }
    document.head.appendChild(link);
}

/**
 * @param {string[]|Element} urls
 * @param {number=} ms
 */
export function preloadImages(urls, ms) {
    if (!isArray(urls)) {
        var map = {};
        var testValue = function (value) {
            if (isCssUrlValue(value)) {
                map[RegExp.$1 || RegExp.$2 || RegExp.$3] = true;
            }
        };
        iterateNode(createNodeIterator(urls, 1), function (node) {
            if (matchSelector(node, 'img') && node.src) {
                map[node.src] = true;
            }
            testValue(getComputedStyle(node).backgroundImage);
            testValue(getComputedStyle(node, '::before').backgroundImage);
            testValue(getComputedStyle(node, '::after').backgroundImage);
        });
        urls = keys(map);
    }
    var promises = [];
    var preloadUrls = [];
    urls.forEach(function (url) {
        promises.push(preloadImagesCache[url] || (preloadImagesCache[url] = new Promise(function (resolve) {
            preloadUrls.push(url);
            $('<img>').on('load error', function () {
                preloadImagesCache[url] = true;
                resolve();
            }).attr('src', url);
        })));
    });
    if (!promises.length || promises.every(function (v) { return v === true; })) {
        return resolve();
    }
    if (preloadUrls.length) {
        console.log('Preload image', { urls: preloadUrls });
    }
    return Promise.race([delay(ms), resolveAll(values(preloadImagesCache))]);
}

export function openDeferredURL(promise, loadingUrl, target, features) {
    var win = window.open(loadingUrl || 'data:text/html;base64,TG9hZGluZy4uLg==', target || '_blank', features || '');
    if (!win) {
        return resolve(false);
    }
    return promise.then(function (url) {
        if (win.closed) {
            return false;
        }
        win.location.replace(url);
        return true;
    }, function (e) {
        win.close();
        throw e;
    });
}
