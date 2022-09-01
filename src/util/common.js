import $ from "../include/external/jquery.js";
import Promise from "../include/external/promise-polyfill.js";
import { isCssUrlValue } from "../include/zeta-dom/cssUtil.js";
import { createNodeIterator, iterateNode, matchSelector } from "../include/zeta-dom/domUtil.js";
import { defineAliasProperty, defineGetterProperty, defineHiddenProperty, each, errorWithCode, extend, isArray, isFunction, isPlainObject, keys, kv, matchWord, resolve, resolveAll, setPromiseTimeout, values, watchOnce } from "../include/zeta-dom/util.js";
import { combinePath, withBaseUrl } from "./path.js";
import * as ErrorCode from "../errorCode.js";

/** @type {Zeta.Dictionary<Promise<void>>} */
const preloadImagesCache = {};
/** @type {Zeta.Dictionary<Promise<Zeta.Dictionary>>} */
const loadScriptCache = {};

export function getAttrValues(element) {
    var values = {};
    each(element.attributes, function (i, v) {
        values[v.name] = v.value;
    });
    return values;
}

export function isBoolAttr(element, name) {
    return matchWord(name, 'allowfullscreen async autofocus autoplay checked controls default defer disabled formnovalidate ismap itemscope loop multiple muted nomodule novalidate open playsinline readonly required reversed selected truespeed') && name in element;
}

export function hasAttr(element, name) {
    return !!element.attributes[name];
}

export function getAttr(element, name) {
    var attr = element.attributes[name];
    return attr && attr.value;
}

export function setAttr(element, name, value) {
    each(isPlainObject(name) || kv(name, value), function (i, v) {
        element.setAttribute(i, v);
    });
}

export function copyAttr(src, dst) {
    each(src.attributes, function (i, v) {
        dst.setAttribute(v.name, v.value);
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

/**
 * @param {string} name
 */
export function getQueryParam(name) {
    return new RegExp('[?&]' + name + '=([^&]+)', 'i').test(location.search) && decodeURIComponent(RegExp.$1);
}

/**
 * @param {string} name
 */
export function getCookie(name) {
    return new RegExp('(?:^|\\s|;)' + name + '=([^;]+)').test(document.cookie) && RegExp.$1;
}

/**
 * @param {string} name
 * @param {string} value
 * @param {number=} expiry
 */
export function setCookie(name, value, expiry) {
    document.cookie = name + '=' + value + ';path=/' + (expiry ? ';expires=' + new Date(Date.now() + expiry).toGMTString() : '');
    return value;
}

/**
 * @param {string} name
 */
export function deleteCookie(name) {
    document.cookie = name + '=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT';
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
    var httpMethods = 'get post delete';
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
    return setPromiseTimeout(resolveAll(values(preloadImagesCache)), ms, true);
}
