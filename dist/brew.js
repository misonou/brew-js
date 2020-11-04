(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("zeta-dom")["util"], require("zeta-dom")["shim"], require("zeta-dom")["css"], require("zeta-dom")["dom"], require("waterpipe"), require("jQuery"), require("historyjs"), require("zeta-dom"));
	else if(typeof define === 'function' && define.amd)
		define("brew", [["zeta-dom","util"], ["zeta-dom","shim"], ["zeta-dom","css"], ["zeta-dom","dom"], "waterpipe", "jQuery", "historyjs", "zeta-dom"], factory);
	else if(typeof exports === 'object')
		exports["brew"] = factory(require("zeta-dom")["util"], require("zeta-dom")["shim"], require("zeta-dom")["css"], require("zeta-dom")["dom"], require("waterpipe"), require("jQuery"), require("historyjs"), require("zeta-dom"));
	else
		root["brew"] = factory(root["zeta"]["util"], root["zeta"]["shim"], root["zeta"]["css"], root["zeta"]["dom"], root["waterpipe"], root["jQuery"], root["History"], root["zeta"]);
})(self, function(__WEBPACK_EXTERNAL_MODULE__990__, __WEBPACK_EXTERNAL_MODULE__774__, __WEBPACK_EXTERNAL_MODULE__260__, __WEBPACK_EXTERNAL_MODULE__50__, __WEBPACK_EXTERNAL_MODULE__160__, __WEBPACK_EXTERNAL_MODULE__609__, __WEBPACK_EXTERNAL_MODULE__229__, __WEBPACK_EXTERNAL_MODULE__163__) {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 349:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => /* binding */ src
});

// NAMESPACE OBJECT: ./src/util/path.js
var path_namespaceObject = {};
__webpack_require__.r(path_namespaceObject);
__webpack_require__.d(path_namespaceObject, {
  "baseUrl": () => baseUrl,
  "combinePath": () => combinePath,
  "isSubPathOf": () => isSubPathOf,
  "normalizePath": () => normalizePath,
  "setBaseUrl": () => setBaseUrl,
  "toAbsoluteUrl": () => toAbsoluteUrl,
  "toRelativeUrl": () => toRelativeUrl,
  "withBaseUrl": () => path_withBaseUrl
});

// NAMESPACE OBJECT: ./src/util/common.js
var common_namespaceObject = {};
__webpack_require__.r(common_namespaceObject);
__webpack_require__.d(common_namespaceObject, {
  "addStyleSheet": () => addStyleSheet,
  "api": () => api,
  "cookie": () => cookie,
  "deleteCookie": () => deleteCookie,
  "getCookie": () => getCookie,
  "getFormValues": () => getFormValues,
  "getJSON": () => getJSON,
  "getQueryParam": () => getQueryParam,
  "loadScript": () => loadScript,
  "preloadImages": () => preloadImages,
  "setCookie": () => setCookie
});

// NAMESPACE OBJECT: ./src/anim.js
var anim_namespaceObject = {};
__webpack_require__.r(anim_namespaceObject);
__webpack_require__.d(anim_namespaceObject, {
  "addAnimateIn": () => addAnimateIn,
  "addAnimateOut": () => addAnimateOut,
  "animateIn": () => animateIn,
  "animateOut": () => animateOut
});

// NAMESPACE OBJECT: ./src/domAction.js
var domAction_namespaceObject = {};
__webpack_require__.r(domAction_namespaceObject);
__webpack_require__.d(domAction_namespaceObject, {
  "addAsyncAction": () => addAsyncAction,
  "closeFlyout": () => closeFlyout,
  "openFlyout": () => openFlyout
});

// EXTERNAL MODULE: external {"commonjs":["zeta-dom","util"],"commonjs2":["zeta-dom","util"],"amd":["zeta-dom","util"],"root":["zeta","util"]}
var external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_ = __webpack_require__(990);
// CONCATENATED MODULE: ./src/include/zeta/util.js


// CONCATENATED MODULE: ./src/util/path.js
var baseUrl = '';

/**
 * @param {string} b 
 */
function setBaseUrl(b) {
    baseUrl = b;
}

/**
 * @param {string} a 
 * @param {string} b 
 */
function combinePath(a, b) {
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
function normalizePath(path) {
    path = path.replace(/\/+$/, '') || '/';
    return path.indexOf('://') >= 0 || path[0] === '/' ? path : '/' + path;
}

/**
 * @param {string} url 
 */
function path_withBaseUrl(url) {
    url = normalizePath(url);
    return baseUrl && url[0] === '/' && !isSubPathOf(url, baseUrl) ? normalizePath(baseUrl + url) : url;
}

/**
 * @param {string} url 
 */
function toAbsoluteUrl(url) {
    return location.origin + path_withBaseUrl(url);
}

/**
 * @param {string} url 
 */
function toRelativeUrl(url) {
    return url.substr(0, location.origin.length) === location.origin ? url.substr(location.origin.length) : url;
}

/**
 * @param {string} a 
 * @param {string} b 
 */
function isSubPathOf(a, b) {
    return a.substr(0, b.length) === b && (a.length === b.length || a[b.length] === '/');
}

// EXTERNAL MODULE: external {"commonjs":["zeta-dom","shim"],"commonjs2":["zeta-dom","shim"],"amd":["zeta-dom","shim"],"root":["zeta","shim"]}
var external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_ = __webpack_require__(774);
// CONCATENATED MODULE: ./src/include/zeta/shim.js


// EXTERNAL MODULE: external {"commonjs":["zeta-dom","css"],"commonjs2":["zeta-dom","css"],"amd":["zeta-dom","css"],"root":["zeta","css"]}
var external_commonjs_zeta_dom_css_commonjs2_zeta_dom_css_amd_zeta_dom_css_root_zeta_css_ = __webpack_require__(260);
// CONCATENATED MODULE: ./src/include/zeta/cssUtil.js


// CONCATENATED MODULE: ./src/include/zeta/domUtil.js


// CONCATENATED MODULE: ./src/util/common.js
// @ts-nocheck






/** @type {Zeta.Dictionary<Promise<void>>} */
const preloadImagesCache = {};
/** @type {Zeta.Dictionary<Promise<Zeta.Dictionary>>} */
const loadScriptCache = {};

/**
 * @param {HTMLFormElement} form 
 */
function getFormValues(form) {
    var values = {};
    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(form.elements, function (i, v) {
        if (v.name && !(v.name in values)) {
            var item = form.elements[v.name];
            (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.defineGetterProperty)(values, v.name, function () {
                return item.type === 'checkbox' ? item.checked : item.value;
            });
        }
    });
    return values;
}

/**
 * @param {string} name 
 */
function getQueryParam(name) {
    return new RegExp('[?&]' + name + '=([^&]+)', 'i').test(location.search) && decodeURIComponent(RegExp.$1);
}

/**
 * @param {string} name 
 */
function getCookie(name) {
    return new RegExp('(?:^|\\s|;)' + name + '=([^;]+)').test(document.cookie) && RegExp.$1;
}

/**
 * @param {string} name 
 * @param {string} value 
 * @param {number=} expiry 
 */
function setCookie(name, value, expiry) {
    document.cookie = name + '=' + value + ';path=/' + (expiry ? ';expires=' + new Date(Date.now() + expiry).toGMTString() : '');
    return value;
}

/**
 * @param {string} name 
 */
function deleteCookie(name) {
    document.cookie = name + '=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT';
}

/**
 * @param {string} name 
 * @param {number=} expiry 
 */
function cookie(name, expiry) {
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
function api(options, extra) {
    var httpMethods = 'get post delete';
    if (typeof options === 'string' && (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.matchWord)(options, httpMethods)) {
        extra = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.extend)({}, typeof extra === 'string' ? { baseUrl: extra } : extra, { methods: options });
        return api(extra)[options];
    }
    options = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.extend)({}, options);
    var obj = {
        baseUrl: options.baseUrl,
        token: options.token
    };
    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(options.methods || httpMethods, function (i, v) {
        if ((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.matchWord)(v, httpMethods)) {
            (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.defineHiddenProperty)(obj, v, function request(method, data) {
                if (!obj.baseUrl) {
                    return (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.watchOnce)(obj, 'baseUrl', function () {
                        return request(method, data);
                    });
                }
                var headers = { 'Content-Type': 'application/json' };
                if (obj.token) {
                    headers.Authorization = 'Bearer ' + obj.token;
                }
                return external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$.ajax({
                    method: v,
                    url: combinePath(obj.baseUrl, method),
                    headers: headers,
                    dataType: 'json',
                    data: JSON.stringify(data || {}),
                    success: function (response) {
                        if ((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.isFunction)(options.getTokenFromResponse)) {
                            obj.token = options.getTokenFromResponse(response, obj.token);
                        }
                    }
                }).catch(function (e) {
                    if (e.status === 0) {
                        throw 'network-failed';
                    }
                    var response = e.responseJSON;
                    if (response) {
                        console.error(method + ':', response.error || response.message);
                        throw response.error || response.message;
                    }
                    throw e.statusText;
                });
            });
            (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.defineAliasProperty)(obj[v], 'baseUrl', obj);
            (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.defineAliasProperty)(obj[v], 'token', obj);
        }
    });
    return obj;
}

/**
 * @param {string} path 
 */
function getJSON(path) {
    return external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$.getJSON(path_withBaseUrl(path));
}

/**
 * @param {string | string[]} url 
 * @param {{ nomodule?: boolean; module?: boolean }=} options 
 */
function loadScript(url, options) {
    if ((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.isArray)(url)) {
        return url.reduce(function (v, a) {
            return v.then(function () {
                return loadScript(a, options);
            });
        }, (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.resolve)());
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
                reject();
            });
            script.src = path_withBaseUrl(url);
            document.head.appendChild(script);
        });
    }
    return loadScriptCache[url];
}

/**
 * @param {string} url 
 * @param {string=} media 
 */
function addStyleSheet(url, media) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = path_withBaseUrl(url);
    if (media) {
        link.media = media;
    }
    document.head.appendChild(link);
}

/**
 * @param {string[]|Element} urls 
 * @param {number=} ms 
 */
function preloadImages(urls, ms) {
    if (!(0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.isArray)(urls)) {
        var map = {};
        var testValue = function (value) {
            if ((0,external_commonjs_zeta_dom_css_commonjs2_zeta_dom_css_amd_zeta_dom_css_root_zeta_css_.isCssUrlValue)(value)) {
                map[RegExp.$1 || RegExp.$2 || RegExp.$3] = true;
            }
        };
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.iterateNode)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.createNodeIterator)(urls, 1), function (node) {
            if ((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.is)(node, 'img') && node.src) {
                map[node.src] = true;
            }
            testValue(getComputedStyle(node).backgroundImage);
            testValue(getComputedStyle(node, '::before').backgroundImage);
            testValue(getComputedStyle(node, '::after').backgroundImage);
        });
        urls = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.keys)(map);
    }
    var promises = [];
    var preloadUrls = [];
    urls.forEach(function (url) {
        promises.push(preloadImagesCache[url] || (preloadImagesCache[url] = new Promise(function (resolve) {
            preloadUrls.push(url);
            (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)('<img>').on('load error', function () {
                preloadImagesCache[url] = true;
                resolve();
            }).attr('src', url);
        })));
    });
    if (!promises.length || promises.every(function (v) { return v === true; })) {
        return (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.resolve)();
    }
    if (preloadUrls.length) {
        console.log('Preload image', { urls: preloadUrls });
    }
    return (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.setPromiseTimeout)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.resolveAll)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.values)(preloadImagesCache)), ms, true);
}

// EXTERNAL MODULE: external {"commonjs":["zeta-dom","dom"],"commonjs2":["zeta-dom","dom"],"amd":["zeta-dom","dom"],"root":["zeta","dom"]}
var external_commonjs_zeta_dom_dom_commonjs2_zeta_dom_dom_amd_zeta_dom_dom_root_zeta_dom_ = __webpack_require__(50);
var external_commonjs_zeta_dom_dom_commonjs2_zeta_dom_dom_amd_zeta_dom_dom_root_zeta_dom_default = /*#__PURE__*/__webpack_require__.n(external_commonjs_zeta_dom_dom_commonjs2_zeta_dom_dom_amd_zeta_dom_dom_root_zeta_dom_);
// CONCATENATED MODULE: ./src/include/zeta/dom.js

/* harmony default export */ const dom = ((external_commonjs_zeta_dom_dom_commonjs2_zeta_dom_dom_amd_zeta_dom_dom_root_zeta_dom_default()));

// CONCATENATED MODULE: ./src/anim.js






const customAnimateIn = {};
const customAnimateOut = {};
const animatingElements = new external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.Map();

var nextId = 0;

function handleAnimation(element, elements, promises, trigger) {
    if (!promises.length) {
        return (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.resolve)();
    }
    var id = ++nextId;
    var timeout, timeoutReject, timeoutResolve;
    promises = promises.map(function (v) {
        return v instanceof Promise ? (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.catchAsync)(v) : new Promise(function (resolve) {
            v.then(resolve, resolve);
        });
    });
    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.catchAsync)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.resolveAll)(promises, function () {
        clearTimeout(timeout);
        timeoutResolve();
        animatingElements.delete(element);
        console.log('Animation #%i completed', id);
    }));
    promises.push(new Promise(function (resolve, reject) {
        timeoutResolve = resolve;
        timeoutReject = reject;
    }));
    timeout = setTimeout(function () {
        timeoutReject('Animation #' + id + ' timed out');
        console.log('Animation #%i might take longer than expected', id, promises);
        animatingElements.delete(element);
    }, 1500);

    var promise = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.catchAsync)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.resolveAll)(promises));
    console.log('Animation #%i triggered on %s', id, trigger, { elements: elements });
    animatingElements.set(element, promise);
    return promise;
}

function animateElement(element, cssClass, eventName, customAnimation) {
    var promises = [(0,external_commonjs_zeta_dom_css_commonjs2_zeta_dom_css_amd_zeta_dom_css_root_zeta_css_.runCSSTransition)(element, cssClass), dom.emit(eventName, element)];
    var delay = parseFloat((0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(element).css('transition-delay'));
    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(customAnimation, function (i, v) {
        if (element.attributes[i]) {
            var attrValue = element.getAttribute(i);
            promises.push(new Promise(function (resolve, reject) {
                setTimeout(function () {
                    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.resolveAll)(v(element, attrValue)).then(resolve, reject);
                }, delay * 1000);
            }));
        }
    });
    return (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.resolveAll)(promises, function () {
        return element;
    });
}

/**
 * @param {Element} element 
 * @param {string} trigger 
 * @param {string=} scope
 * @param {((elm: Element) => boolean)=} filterCallback 
 */
function animateIn(element, trigger, scope, filterCallback) {
    if (animatingElements.has(element)) {
        return animatingElements.get(element).then(function () {
            return animateIn(element, trigger, scope, filterCallback);
        });
    }
    filterCallback = filterCallback || function () { return true; };
    dom.emit('animationstart', element, { animationType: 'in', animationTrigger: trigger }, true);

    var $innerScope = scope ? (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(scope, element) : (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)();
    var filter = trigger === 'show' ? ':not([animate-on]), [animate-on~="' + trigger + '"]' : '[animate-on~="' + trigger + '"]';
    var elements = [];
    var promises = [];

    (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectIncludeSelf)('[animate-in]', element)).filter(filter).each(function (i, v) {
        // @ts-ignore: filterCallback must be function
        if (!$innerScope.find(v)[0] && filterCallback(v) && (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.isVisible)(v)) {
            elements.push(v);
            promises.push(animateElement(v, 'tweening-in', 'animatein', customAnimateIn));
        }
    });
    (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectIncludeSelf)('[animate-sequence]', element)).filter(filter).each(function (i, v) {
        // @ts-ignore: filterCallback must be function
        if (!$innerScope.find(v)[0] && filterCallback(v) && (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.isVisible)(v)) {
            var selector = v.getAttribute('animate-sequence') || '';
            var type = v.getAttribute('animate-sequence-type') || '';
            var $elements = (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(v).find(selector[0] === '>' ? selector : (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(selector));
            if ((0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(v).attr('animate-sequence-reverse') !== undefined) {
                [].reverse.apply($elements);
            }
            $elements.css('transition-duration', '0s');
            $elements.attr('animate-in', type).attr('is-animate-sequence', '');
            $elements.each(function (i, v) {
                if ((0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(v).css('display') === 'inline') {
                    // transform cannot apply on inline elements
                    (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(v).css('display', 'inline-block');
                }
                elements.push(v);
                promises.push(new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(v).css('transition-duration', '');
                        animateElement(v, 'tweening-in', 'animatein', customAnimateIn).then(resolve, reject);
                    }, i * 50);
                }));
            });
            if (!v.attributes['animate-in']) {
                (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(v).attr('animate-in', '').addClass('tweening-in');
            }
        }
    });
    return handleAnimation(element, elements, promises, trigger).then(function () {
        dom.emit('animationcomplete', element, { animationType: 'in', animationTrigger: trigger }, true);
    });
}

/**
 * @param {Element} element 
 * @param {string} trigger 
 * @param {string=} scope
 * @param {((elm: Element) => boolean)=} filterCallback 
 * @param {boolean=} excludeSelf
 */
function animateOut(element, trigger, scope, filterCallback, excludeSelf) {
    filterCallback = filterCallback || function () { return true; };
    dom.emit('animationstart', element, { animationType: 'out', animationTrigger: trigger }, true);

    var $innerScope = scope ? (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(scope, element) : (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)();
    var filter = trigger === 'show' ? ':not([animate-on]), [animate-on~="' + trigger + '"]' : '[animate-on~="' + trigger + '"]';
    var elements = [];
    var promises = [];

    var $target = (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)((excludeSelf ? external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$ : external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectIncludeSelf)('[animate-out]', element)).filter(filter);
    $target.each(function (i, v) {
        // @ts-ignore: filterCallback must be function
        if (!$innerScope.find(v)[0] && filterCallback(v)) {
            elements.push(v);
            promises.push(animateElement(v, 'tweening-out', 'animateout', customAnimateOut));
        }
    });
    return handleAnimation(element, elements, promises, trigger).then(function () {
        // reset animation state after outro animation has finished
        var $target = (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)((excludeSelf ? external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$ : external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectIncludeSelf)('[animate-out], .tweening-in, .tweening-out', element));
        if (trigger !== 'show') {
            $target = $target.filter(filter);
        }
        $target = $target.filter(function (i, v) {
            // @ts-ignore: filterCallback must be function
            return filterCallback(v);
        });
        $target.removeClass('tweening-in tweening-out');
        $target.find('[is-animate-sequence]').removeAttr('animate-in').removeClass('tweening-in tweening-out');
        dom.emit('animationcomplete', element, { animationType: 'out', animationTrigger: trigger }, true);
    });
}

/**
 * @param {string} name 
 * @param {(elm: Element, attrValue: string) => Promise<any>} callback 
 */
function addAnimateIn(name, callback) {
    customAnimateIn[name] = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.throwNotFunction)(callback);
}

/**
 * @param {string} name 
 * @param {(elm: Element, attrValue: string) => Promise<any>} callback 
 */
function addAnimateOut(name, callback) {
    customAnimateOut[name] = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.throwNotFunction)(callback);
}

// CONCATENATED MODULE: ./src/include/waterpipe.js
// @ts-nocheck

/** @type {Waterpipe} */
const waterpipe = window.waterpipe || __webpack_require__(160);
/* harmony default export */ const include_waterpipe = (waterpipe);

// CONCATENATED MODULE: ./src/defaults.js
/** @type {Zeta.Dictionary} */
const defaults = {};
/* harmony default export */ const src_defaults = (defaults);

// CONCATENATED MODULE: ./src/include/history.js
// @ts-nocheck

var History = window.History;
if (!History || !History.Adapter) {
    window.jQuery = __webpack_require__(609);
    __webpack_require__(229);
    History = window.History;
}
/* harmony default export */ const include_history = (History);

// CONCATENATED MODULE: ./src/util/console.js



function toElementTag(element) {
    return element.tagName.toLowerCase() + (element.id ? '#' + element.id : element.className.trim() && element.className.replace(/^\s*|\s+(?=\S)/g, '.'));
}

function truncateJSON(json) {
    return '[{"]'.indexOf(json[0]) >= 0 && json.length > 200 ? json[0] + json.substr(1, 199) + '\u2026' + json[json.length - 1] : json;
}

function formatMessage(eventSource, message) {
    message = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.makeArray)(message).map(function (v) {
        return (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.is)(v, Element) ? toElementTag(v) + ':' : v && typeof v === 'object' ? truncateJSON(JSON.stringify(v)) : v;
    }).join(' ');
    return '[' + eventSource + '] ' + message;
}

/**
 * @param {string} eventSource 
 * @param {string | Element | Record<any, any> | any[]} message
 */
function writeLog(eventSource, message) {
    message = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.makeArray)(message).map(function (v) {
        return (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.is)(v, Element) ? toElementTag(v) + ':' : v && typeof v === 'object' ? truncateJSON(JSON.stringify(v)) : v;
    }).join(' ');
    return '[' + eventSource + '] ' + message;
}

/**
 * @param {string} eventSource 
 * @param {string | Element | Record<any, any> | any[]} message
 * @param {(console: Console) => void} callback 
 */
function groupLog(eventSource, message, callback) {
    var close;
    try {
        console.groupCollapsed(formatMessage(eventSource, message));
        close = true;
    } catch (e) { }
    try {
        callback(console);
    } finally {
        if (close) {
            try {
                console.groupEnd();
            } catch (e) { }
        }
    }
}

// CONCATENATED MODULE: ./src/extension/router.js













const _ = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.createPrivateStore)();
const matchByPathElements = new external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.Map();
const preloadHandlers = [];

/** @type {Element[]} */
var activeElements = [dom.root];

/**
 * Gets whether a given element is part of the active layout of the current path.
 * @param {Element} v A DOM element. 
 * @param {Element[]=} arr
 */
function isElementActive(v, arr) {
    var parent = (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(v).closest('[match-path]')[0];
    return !parent || (arr || activeElements).indexOf(parent) >= 0;
}

/**
 * @param {Zeta.AnyFunction} callback 
 */
function hookBeforePageEnter(callback) {
    preloadHandlers.push((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.throwNotFunction)(callback));
}

function createRouteState(route, segments, params) {
    route = route || [];
    params = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.extend)({}, params);
    delete params.remainingSegments;
    return {
        path: normalizePath(segments.slice(0, route.length).join('/')),
        route: route,
        params: params
    };
}

function Route(app, routes, initialPath) {
    var self = this;
    var state = _(self, {});
    state.routes = routes.map(function (path) {
        var tokens = [];
        // @ts-ignore: no side effect to not return
        // @ts-ignore
        String(path).replace(/\/(\*|[^{][^\/]*|\{([a.-z_$][a-z0-9_$]*)(?::(?![*+?])((?:(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])([*+?]|\{\d+(?:,\d+)\})?)+))?\})(?=\/|$)/gi, function (v, a, b, c) {
            tokens.push(b ? { name: b, pattern: c ? new RegExp('^' + c + '$', 'i') : /./ } : a.toLowerCase());
            self[b || 'remainingSegments'] = null;
        });
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.defineHiddenProperty)(tokens, 'value', path);
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.defineHiddenProperty)(tokens, 'exact', !(tokens[tokens.length - 1] === '*' && tokens.splice(-1)));
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.defineHiddenProperty)(tokens, 'names', (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.map)(tokens, function (v) {
            return v.name;
        }));
        return tokens;
    });
    Object.preventExtensions(self);
    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.extend)(self, self.parse(initialPath));
    state.current = state.lastMatch;
    state.handleChanges = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.watch)(self, true);

    Object.getOwnPropertyNames(self).forEach(function (prop) {
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.defineObservableProperty)(self, prop);
    });
    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.watch)(self, function () {
        var compareState = function (input) {
            return (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.any)(input.params, function (v, i) {
                return v !== self[i];
            }) === false;
        };
        var paramChanged = false;
        var routeChanged = !compareState(state.current);
        if (routeChanged && state.lastMatch) {
            state.current = state.lastMatch;
            routeChanged = !compareState(state.current);
        }
        if (routeChanged) {
            var segments = [], i, len;
            var matched = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.any)(state.routes, function (tokens) {
                segments.length = 0;
                for (i = 0, len = tokens.length; i < len; i++) {
                    var varname = tokens[i].name;
                    if (varname && !tokens[i].pattern.test(self[varname])) {
                        return false;
                    }
                    segments[i] = varname ? self[varname] : tokens[i];
                }
                for (i in self) {
                    if (i !== 'remainingSegments' && self[i] && tokens.names.indexOf(i) < 0) {
                        self[i] = null;
                        paramChanged = true;
                    }
                }
                return true;
            });
            state.current = createRouteState(matched, segments, self);
        }
        if ((state.current.route || '').exact && self.remainingSegments !== '/') {
            self.remainingSegments = '/';
            return;
        }
        if (paramChanged) {
            return;
        }
        app.navigate(self.toString());
    });
}

(0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.definePrototype)(Route, {
    parse: function (path) {
        var self = this;
        var state = _(self);
        var segments = normalizePath(path).slice(1).split('/');
        var params = {};

        var matched = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.any)(state.routes, function (tokens) {
            params = {};
            if (segments.length < tokens.length) {
                return false;
            }
            for (var i = 0, len = tokens.length; i < len; i++) {
                var varname = tokens[i].name;
                if (!(varname ? tokens[i].pattern.test(segments[i]) : (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.iequal)(segments[i], tokens[i]))) {
                    return false;
                }
                if (varname) {
                    params[varname] = segments[i];
                }
            }
            params.remainingSegments = tokens.exact ? '/' : normalizePath(segments.slice(tokens.length).join('/'));
            return true;
        });
        for (var i in self) {
            params[i] = params[i] || null;
        }
        state.lastMatch = createRouteState(matched, segments, params);
        return params;
    },
    set: function (params) {
        var self = this;
        if (typeof params === 'string') {
            if ((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.iequal)(params, self.toString())) {
                return;
            }
            params = self.parse(params);
        }
        _(self).handleChanges(function () {
            (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.extend)(self, params);
        });
    },
    toString: function () {
        // @ts-ignore: unable to infer this
        return combinePath(_(this).current.path || '/', this.remainingSegments);
    }
});
(0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.watchable)(Route.prototype);

/**
 * @param {Brew.AppInstance<Brew.WithRouter>} app
 * @param {Record<string, any>} options
 */
function configureRouter(app, options) {
    var initialPath = app.path || options.initialPath || (options.queryParam && getQueryParam(options.queryParam)) || location.pathname.substr(options.baseUrl.length) || '/';
    var route = new Route(app, options.routes, initialPath);
    var lockedPath;
    var navigated = 0;

    function resolvePath(path, currentPath) {
        path = decodeURI(path);
        currentPath = currentPath || app.path;
        if (path[0] === '~') {
            var extra = ((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.iequal)(currentPath, app.path) ? route : route.parse(currentPath)).remainingSegments;
            path = combinePath(extra === '/' ? currentPath : currentPath.slice(0, -extra.length), path.slice(1));
        } else if (path[0] !== '/') {
            path = combinePath(currentPath, path);
        }
        if (path.indexOf('./') >= 0) {
            var segments = path.split('/');
            for (var j = 1; j < segments.length;) {
                if (segments[j] === '.') {
                    segments.splice(j, 1);
                } else if (segments[j] === '..') {
                    segments.splice(--j, 2);
                } else {
                    j++;
                }
            }
            path = normalizePath(segments.join('/'));
        }
        if (path.indexOf('{') < 0) {
            return path;
        }
        return path.replace(/\{([^}]+)\}/g, function (v, a) {
            return route[a] || v;
        });
    }

    function navigate(path, replace) {
        path = path_withBaseUrl(resolvePath(path));
        include_history[replace ? 'replaceState' : 'pushState']({}, document.title, path);
        app.path = path.substr(baseUrl.length) || '/';
    }

    function processPageChange(path, oldPath, newActiveElements) {
        var preload = new external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.Map();
        var eventSource = dom.eventSource;
        var previousActiveElements = activeElements.slice(0);

        // synchronize path in address bar if navigation is triggered by script
        if (location.pathname.substr(baseUrl.length) !== path) {
            include_history[navigated ? 'pushState' : 'replaceState']({}, document.title, path_withBaseUrl(path));
        }
        navigated++;
        activeElements = newActiveElements;

        groupLog(eventSource, ['pageenter', path], function () {
            matchByPathElements.forEach(function (element) {
                var matched = activeElements.indexOf(element) >= 0;
                if (matched === (previousActiveElements.indexOf(element) < 0)) {
                    if (matched) {
                        resetVar(element, false);
                        setVar(element, null);
                        setTimeout(function () {
                            // animation and pageenter event of inner scope
                            // must be after those of parent scope
                            var dependencies = preload.get((0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(element).parents('[match-path]')[0]);
                            var promises = preloadHandlers.map(function (v) {
                                return v(element, path);
                            });
                            promises.push(dependencies);
                            preload.set(element, (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.resolveAll)(promises, function () {
                                if (activeElements.indexOf(element) >= 0) {
                                    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.setClass)(element, 'hidden', false);
                                    animateIn(element, 'show', '[match-path]');
                                    dom.emit('pageenter', element, { pathname: path }, true);
                                }
                            }));
                        });
                    } else {
                        dom.emit('pageleave', element, { pathname: oldPath }, true);
                        animateOut(element, 'show', '[match-path]').then(function () {
                            if (activeElements.indexOf(element) < 0) {
                                groupLog(eventSource, ['pageleave', oldPath], function () {
                                    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.setClass)(element, 'hidden', true);
                                    resetVar(element, true);
                                });
                            }
                        });
                    }
                }
            });
        });
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(preload, function (element, promise) {
            handleAsync(promise, element);
        });
    }

    setBaseUrl(options.baseUrl || '');
    app.define({
        path: '',
        resolvePath: resolvePath,
        navigate: navigate,
        back: function () {
            if (navigated > 1) {
                // @ts-ignore
                include_history.back();
            } else if (app.path !== '/') {
                navigate('/');
            }
        }
    });
    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.defineOwnProperty)(app, 'initialPath', initialPath, true);
    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.defineOwnProperty)(app, 'route', route, true);

    app.watch('path', function (path, oldPath) {
        if (!appReady) {
            app.path = '';
            return;
        }
        path = resolvePath(path, oldPath);
        console.log('Nagivate', path);
        route.set(path);

        // forbid navigation when DOM is locked (i.e. [is-modal] from openFlyout) or leaving is prevented
        if (dom.locked(dom.activeElement, true)) {
            lockedPath = path === lockedPath ? null : oldPath;
            navigate(lockedPath || path, true);
            return;
        }
        var promise = preventLeave();
        if (promise) {
            lockedPath = oldPath;
            navigate(oldPath, true);
            (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.resolve)(promise).then(function () {
                navigate(path, true);
            });
            return;
        }
        lockedPath = null;

        // find active elements i.e. with match-path that is equal to or is parent of the new path
        // redirect to the default view if there is no match because every switch must have a match
        /** @type {HTMLElement[]} */
        var newActiveElements = [dom.root];
        var redirectPath;
        batch(true, function () {
            matchByPathElements.forEach(function (v, placeholder) {
                var targetPath = resolvePath(v.getAttribute('match-path'));
                var matched = (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)('[switch=""]', v)[0] ? isSubPathOf(path, targetPath) : path === targetPath;
                if (matched) {
                    newActiveElements.push(v);
                    if (!v.parentNode) {
                        (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(placeholder).replaceWith(v);
                        markUpdated(v);
                        mountElement(v);
                    }
                }
            });
        });
        // @ts-ignore
        (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)('[switch=""]').each(function (i, v) {
            if (isElementActive(v, newActiveElements)) {
                var $children = (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(v).children('[match-path]');
                // @ts-ignore
                var currentMatched = $children.filter(function (i, v) {
                    return newActiveElements.indexOf(v) >= 0;
                })[0];
                if (!currentMatched) {
                    redirectPath = ($children.filter('[default]')[0] || $children[0]).getAttribute('match-path');
                    return false;
                }
            }
        });
        if (redirectPath) {
            navigate(redirectPath, true);
            return;
        }

        batch(true, function () {
            app.emit('navigate', {
                pathname: path,
                oldPathname: oldPath,
                route: Object.freeze((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.extend)({}, route))
            });
            if (app.path === path) {
                processPageChange(path, oldPath, newActiveElements);
            }
        });
    });

    app.beforeInit(function () {
        dom.ready.then(function () {
            // detach elements which its visibility is controlled by current path
            // @ts-ignore
            (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)('[match-path]').addClass('hidden').each(function (i, v) {
                var placeholder = document.createElement('div');
                placeholder.setAttribute('style', 'display: none !important');
                placeholder.setAttribute('match-path', v.getAttribute('match-path') || '');
                if (v.attributes.default) {
                    placeholder.setAttribute('default', '');
                }
                (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(v).before(placeholder);
                (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(v).detach();
                matchByPathElements.set(placeholder, v);
            });
            // @ts-ignore
            include_history.Adapter.bind(window, 'statechange', function () {
                app.path = location.pathname.substr(baseUrl.length) || '/';
            });
        });
    });

    app.on('ready', function () {
        app.path = initialPath;
    });

    app.on('mounted', function (e) {
        var $autoplay = (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectIncludeSelf)('video[autoplay], audio[autoplay]', e.target));
        if ($autoplay[0]) {
            $autoplay.removeAttr('autoplay');
            app.on(e.target, {
                pageenter: function () {
                    // @ts-ignore
                    $autoplay.each(function (i, v) {
                        // @ts-ignore: known element type
                        if (v.readyState !== 0) {
                            // @ts-ignore: known element type
                            v.currentTime = 0;
                        }
                        // @ts-ignore: known element type
                        v.play();
                    });
                },
                pageleave: function () {
                    // @ts-ignore
                    $autoplay.each(function (i, v) {
                        // @ts-ignore: known element type
                        v.pause();
                    });
                }
            }, true);
        }
    })

    app.on('pageleave', function (e) {
        // @ts-ignore
        ;(0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectIncludeSelf)('form', e.target)).each(function (i, v) {
            if (!app.emit('reset', v, null, false)) {
                // @ts-ignore: known element type
                v.reset();
            }
        });
    });
}

install('router', function (app, options) {
    // @ts-ignore
    configureRouter(app, options || {});
});

// CONCATENATED MODULE: ./src/dom.js













const TEMPLATE_ATTRS = 'template set-class set-style'.split(' ');
const IMAGE_STYLE_PROPS = 'background-image'.split(' ');

const dom_hasOwnProperty = Object.prototype.hasOwnProperty;
const getOwnPropertyNames = Object.getOwnPropertyNames;

const root = dom.root;
const updatedElements = new external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.Set();
const pendingDOMUpdates = new external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.Map();
const preupdateHandlers = [];
const matchElementHandlers = [];
const selectorHandlers = [];

var batchCounter = 0;

function updateDOM(element, props) {
    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(props, function (j, v) {
        if (j === '$$state') {
            (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.setClass)(element, v);
        } else if (j === '$$text') {
            element.textContent = v;
        } else if (j === 'style') {
            (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(element).css(v);
        } else {
            element.setAttribute(j, v);
        }
    });
    dom.emit('domchange', element);
}

function addPendingDOMUpdates(element, props) {
    var dict = pendingDOMUpdates.get(element);
    if (!dict) {
        dict = {};
        pendingDOMUpdates.set(element, dict);
    }
    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(props, function (j, v) {
        if (j === '$$state' || j === 'style') {
            dict[j] = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.extend)({}, dict[j], v);
        } else {
            dict[j] = v;
        }
    });
}

/**
 * @param {string} target 
 * @param {Zeta.Dictionary} handlers 
 */
function addSelectHandlers(target, handlers) {
    selectorHandlers.push({
        target: target,
        handlers: handlers
    });
}

/**
 * @param {string} selector 
 * @param {(ele: Element) => void} handler 
 */
function matchElement(selector, handler) {
    matchElementHandlers.push({ selector, handler });
}

/**
 * @param {(domChanges: Map<Element, Brew.DOMUpdateState>) => Brew.PromiseOrEmpty} callback 
 */
function hookBeforeUpdate(callback) {
    preupdateHandlers.push((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.throwNotFunction)(callback));
}

/**
 * @param {Promise<any>} promise 
 * @param {Element=} element 
 */
function handleAsync(promise, element) {
    if (element || dom.eventSource !== 'script') {
        element = element || dom.activeElement;
        var state = getVar(element);
        var s1 = getVarObjWithProperty(state, 'loading');
        var s2 = getVarObjWithProperty(state, 'error');
        if (!dom_hasOwnProperty.call(s1, '__counter')) {
            (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.defineHiddenProperty)(s1, '__counter', 0);
        }
        s1.__counter++;
        setVar(s1.element, { loading: s1.loading || true });
        setVar(s2.element, { error: null });
        promise.then(function () {
            setVar(s1.element, { loading: !!--s1.__counter });
        }, function (e) {
            setVar(s1.element, { loading: !!--s1.__counter });
            setVar(s2.element, { error: '' + (e.message || e) });
        });
    }
    return promise;
}

/**
 * @param {Element} element 
 */
function markUpdated(element) {
    updatedElements.add(element);
}

/**
 * @param {boolean=} suppressAnim 
 */
function processStateChange(suppressAnim) {
    if (batchCounter) {
        return;
    }
    var updatedProps = new external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.Map();
    var domUpdates = new external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.Map();

    // compute auto variables and evaluates DOM changes from templates
    groupLog(dom.eventSource, 'statechange', function () {
        var arr = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.makeArray)(updatedElements);
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectIncludeSelf)('[foreach]', arr), function (i, element) {
            var state = getVar(element);
            if (!state.__foreach) {
                (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.defineHiddenProperty)(state, '__foreach', {
                    // @ts-ignore: type inference issue
                    template: (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(element).contents().detach().filter(function (i, v) { return v.nodeType === 1 || /\S/.test(v.data || ''); }).get(),
                    nodes: [],
                    data: []
                });
            }
            var templateNodes = state.__foreach.template;
            var currentNodes = state.__foreach.nodes;
            var oldItems = state.__foreach.data;
            var newItems = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.makeArray)(evalAttr(element, 'foreach'));

            if (newItems.length !== oldItems.length || newItems.some(function (v, i) { return oldItems[i] !== v; })) {
                var newChildren = [];
                (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(newItems, function (i, v) {
                    var currentIndex = oldItems.indexOf(v);
                    if (currentIndex < 0) {
                        var parts = (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(templateNodes).clone().get();
                        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(parts, function (i, w) {
                            if (w.nodeType === 1) {
                                (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(element).append(w);
                                setVar(w, (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.kv)('foreach', v), true);
                            }
                        });
                        newChildren.push.apply(newChildren, parts);
                    } else {
                        newChildren.push.apply(newChildren, currentNodes.slice(currentIndex * templateNodes.length, (currentIndex + 1) * templateNodes.length));
                    }
                });
                (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.extend)(state.__foreach, {
                    nodes: newChildren,
                    data: newItems
                });
                (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(currentNodes).detach();
                (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(element).append(newChildren);
            }
        });
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectIncludeSelf)('[auto-var]', arr), function (i, element) {
            setVar(element, evalAttr(element, 'auto-var'), true);
        });
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectIncludeSelf)('[switch][switch!=""]', arr), function (i, element) {
            var state = getVar(element);
            if (!dom_hasOwnProperty.call(state, 'matched')) {
                (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.defineOwnProperty)(state, 'matched');
            }
            if (!isElementActive(element)) {
                return;
            }
            var varname = element.getAttribute('switch') || '';
            var matchValue = include_waterpipe.eval(varname, (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.extend)({}, state));
            var $target = (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)('[match-' + varname + ']', element).filter(function (i, w) {
                return (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(w).parents('[switch]')[0] === element;
            });
            var matched;
            var itemValues = new external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.Map();
            $target.each(function (i, v) {
                var thisValue = include_waterpipe.eval('"null" ?? ' + v.getAttribute('match-' + varname), (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.extend)({}, getVar(v)));
                itemValues.set(v, thisValue);
                if (include_waterpipe.eval('$0 == $1', [matchValue, thisValue])) {
                    matched = v;
                    return false;
                }
            });
            matched = matched || $target.filter('[default]')[0] || $target[0];
            if (!state.matched || state.matched.element !== matched) {
                groupLog('switch', [element, varname, '→', matchValue], function (console) {
                    console.log('Matched: ', matched);
                    setVar(matched, null, true);
                    setVar(element, { matched: getVar(matched) }, true);
                    $target.each(function (i, v) {
                        var props = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.mapGet)(domUpdates, v, Object);
                        props.$$state = { active: v === matched };
                    });
                });
            } else {
                writeLog('switch', [element, varname, '→', matchValue, '(unchanged)']);
                if (varname in state && itemValues.get(matched) !== undefined) {
                    setVar(element, (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.kv)(varname, itemValues.get(matched)), true);
                }
            }
        });

        arr = external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$.uniqueSort((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.makeArray)(updatedElements));
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(arr, function (i, v) {
            var state = getVar(v);
            updatedProps.set(v, {
                newValues: (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.extend)({}, state.__newValues),
                oldValues: (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.extend)({}, state.__oldValues)
            });
        });

        var visited = [];
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(arr.reverse(), function (i, v) {
            groupLog('statechange', [v, updatedProps.get(v).newValues], function (console) {
                console.log(v === root ? document : v);
                (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectIncludeSelf)('[' + TEMPLATE_ATTRS.join('],[') + ']', v)).not(visited).each(function (i, element) {
                    visited.push(element);
                    if (element.attributes.template || element.attributes['set-style']) {
                        var state = getVar(element);
                        if (!state.__template) {
                            (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.defineHiddenProperty)(state, '__template', {});
                            if (element.attributes['set-style']) {
                                state.__template.style = element.getAttribute('set-style');
                            }
                            if (element.attributes.template) {
                                (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(element.attributes, function (i, w) {
                                    if (w.value.indexOf('{{') >= 0) {
                                        state.__template[w.name] = w.value;
                                    }
                                });
                                if (!element.childElementCount && (element.textContent || '').indexOf('{{') >= 0) {
                                    state.__template.$$text = element.textContent;
                                }
                            }
                        }
                        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(state.__template, function (i, w) {
                            var value = evaluate(w, state, element, i, false);
                            if (domUpdates.get(element) || (i === '$$text' ? element.textContent : (element.getAttribute(i) || '').replace(/["']/g, '')) !== value) {
                                var props = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.mapGet)(domUpdates, element, Object);
                                if (i === 'style') {
                                    var styles = (0,external_commonjs_zeta_dom_css_commonjs2_zeta_dom_css_amd_zeta_dom_css_root_zeta_css_.parseCSS)(value);
                                    props[i] = styles;
                                    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(IMAGE_STYLE_PROPS, function (i, v) {
                                        var imageUrl = (0,external_commonjs_zeta_dom_css_commonjs2_zeta_dom_css_amd_zeta_dom_css_root_zeta_css_.isCssUrlValue)(styles[v]);
                                        if (imageUrl) {
                                            styles[v] = 'url("' + path_withBaseUrl(imageUrl) + '")';
                                        }
                                    });
                                } else {
                                    props[i] = value;
                                }
                            }
                        });
                    }
                    if (element.attributes['set-class']) {
                        var newStates = evalAttr(element, 'set-class');
                        var props = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.mapGet)(domUpdates, element, Object);
                        props.$$state = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.extend)(props.$$state || {}, newStates);
                    }
                });
            });
        });
    });

    // perform any async task that is related or required by the DOM changes
    var preupdatePromise = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.resolveAll)(preupdateHandlers.map(function (v) {
        return v(domUpdates);
    }));

    // perform DOM updates, or add to pending updates if previous update is not completed
    // also wait for animation completed if suppressAnim is off
    preupdatePromise.then(function () {
        var animScopes = new external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.Map();
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(domUpdates, function (element, props) {
            if (!suppressAnim) {
                var animParent = (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(element).filter('[match-path]')[0] || (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(element).parents('[match-path]')[0] || root;
                var groupElements = animScopes.get(animParent);
                if (!groupElements) {
                    var filter = function (v) {
                        var haystack = v.getAttribute('animate-on-statechange');
                        if (!haystack) {
                            return true;
                        }
                        for (var cur; v && !(cur = updatedProps.get(v)); v = v.parentNode);
                        return cur && (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.any)(haystack, function (v) {
                            return v in cur.newValues;
                        });
                    };
                    groupElements = [];
                    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.setImmediate)(function () {
                        animateOut(animParent, 'statechange', '[match-path]', filter, true).then(function () {
                            (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(groupElements, function (i, v) {
                                updateDOM(v, pendingDOMUpdates.get(v));
                                pendingDOMUpdates.delete(v);
                            });
                            animateIn(animParent, 'statechange', '[match-path]', filter);
                        });
                    });
                    animScopes.set(animParent, groupElements);
                }
                addPendingDOMUpdates(element, props);
                groupElements.push(element);
            } else if (pendingDOMUpdates.has(element)) {
                addPendingDOMUpdates(element, props);
            } else {
                updateDOM(element, props);
            }
        });
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(updatedProps, function (i, v) {
            dom.emit('statechange', i, {
                data: (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.extend)({}, getVar(i)),
                newValues: v.newValues,
                oldValues: v.oldValues
            }, true);
        });
    });

    // reset variable state objects for next cycle
    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(updatedElements, function (i, v) {
        var state = getVar(v);
        var newValues = state.__newValues;
        var oldValues = state.__oldValues;
        getOwnPropertyNames(newValues).forEach(function (v) {
            delete newValues[v];
        });
        getOwnPropertyNames(oldValues).forEach(function (v) {
            delete oldValues[v];
        });
    });
    updatedElements.clear();
}

/**
 * 
 * @param {true|(()=>void)} suppressAnim 
 * @param {()=>void=} callback 
 */
function batch(suppressAnim, callback) {
    var doUpdate = true;
    try {
        batchCounter = (batchCounter || 0) + 1;
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.throwNotFunction)(callback || suppressAnim)();
    } catch (e) {
        doUpdate = false;
        throw e;
    } finally {
        if (!--batchCounter && doUpdate) {
            processStateChange(suppressAnim === true);
        }
    }
}

/**
 * @param {Element} element 
 */
function mountElement(element) {
    // ensure mounted event is correctly fired on the newly mounted element
    dom.on(element, '__brew_handler__', external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.noop);

    var mountedElements = [element];
    var firedOnRoot = element === root;
    var index = -1, index2 = 0;
    while (index < selectorHandlers.length) {
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(selectorHandlers.slice(index < 0 ? 0 : index), function (i, v) {
            (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectIncludeSelf)(v.target, element)).each(function (i, w) {
                app.on(w, v.handlers);
                if (v.handlers.mounted && mountedElements.indexOf(w) < 0) {
                    mountedElements.push(w);
                }
            });
        });
        index = selectorHandlers.length;
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$.uniqueSort(mountedElements.slice(index2)), function (i, v) {
            dom.emit('mounted', v);
        });
        if (!firedOnRoot) {
            firedOnRoot = true;
            dom.emit('mounted', root, { target: element });
        }
        index2 = mountedElements.length;
    }
    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(matchElementHandlers, function (i, v) {
        (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectIncludeSelf)(v.selector, element)).each(function (i, w) {
            v.handler.call(w, w);
        });
    });
}

/**
 * @param {boolean=} suppressPrompt 
 */
function preventLeave(suppressPrompt) {
    var element = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.any)((0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)('[prevent-leave]').get(), function (v) {
        var state = getVar(v);
        var allowLeave = Object.hasOwnProperty.call(state, '__allowLeave');
        if (isElementActive(v) || allowLeave) {
            var preventLeave = evalAttr(v, 'prevent-leave');
            if (!preventLeave && allowLeave) {
                delete state.__allowLeave;
            }
            return preventLeave && !allowLeave;
        }
    });
    if (element && !suppressPrompt) {
        return (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.resolveAll)(dom.emit('preventLeave', element, null, true), function (result) {
            if (result) {
                // @ts-ignore: element checked for truthiness
                (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.defineHiddenProperty)(getVar(element), '__allowLeave', true);
            } else {
                throw 'user_rejected';
            }
        });
    }
    return !!element;
}

// CONCATENATED MODULE: ./src/domReady.js







dom.ready.then(function () {
    (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)('apply-attributes').each(function (i, v) {
        var $target = (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(v.getAttribute('elements') || '', v.parentNode || dom.root);
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(v.attributes, function (i, v) {
            if (v.name !== 'elements') {
                $target.attr(v.name, v.value);
            }
        });
    }).remove();

    // replace inline background-image to prevent browser to load unneccessary images
    (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)('[style]').each(function (i, v) {
        var backgroundImage = (0,external_commonjs_zeta_dom_css_commonjs2_zeta_dom_css_amd_zeta_dom_css_root_zeta_css_.isCssUrlValue)(v.style.backgroundImage);
        if (backgroundImage) {
            v.setAttribute('data-bg-src', decodeURIComponent(path_withBaseUrl(backgroundImage)));
            v.style.backgroundImage = 'none';
        }
    });

    window.onbeforeunload = function (e) {
        if (preventLeave(true)) {
            e.returnValue = '';
            e.preventDefault();
        }
    };
});

/* harmony default export */ const domReady = (null);

// CONCATENATED MODULE: ./src/app.js









const app_ = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.createPrivateStore)();
const app_root = dom.root;
const featureDetections = {};

/** @type {Brew.AppInstance} */
var app;
/** @type {boolean} */
var appReady;
/** @type {boolean} */
var appInited;

function processUntilEmpty(arr) {
    return (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.resolveAll)(arr.splice(0), function () {
        return arr.length && processUntilEmpty(arr);
    });
}

function noChildrenHandler(handler) {
    return function (e) {
        if (e.target === e.context) {
            return handler.apply(this, arguments);
        }
    };
}

function applyTemplate(element) {
    /** @type {HTMLElement} */
    // @ts-ignore: type inference issue
    var template = (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)('[brew-template="' + element.getAttribute('apply-template') + '"]')[0].cloneNode(true);
    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(template.attributes, function (i, w) {
        element.setAttribute(w.name, w.value);
    });
    var $contents = (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(element);
    (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectIncludeSelf)('content[for]', template)).each(function (i, v) {
        (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(v).replaceWith($contents.find(v.getAttribute('for') || ''));
    });
    (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectIncludeSelf)('content', template)[0]).replaceWith($contents.contents());
    $contents.append((0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(template).contents());
}

/**
 * @param {Zeta.ZetaEvent} e
 */
function onElementMounted(e) {
    var element = e.target;
    (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectIncludeSelf)('[apply-template]', element)).each(function (i, v) {
        applyTemplate(v);
    });
    (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectIncludeSelf)('img[src^="/"], video[src^="/"]', element)).each(function (i, v) {
        // @ts-ignore: known element type
        v.src = withBaseUrl(v.getAttribute('src'));
    });
    (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectIncludeSelf)('a[href^="/"]', element)).each(function (i, v) {
        // @ts-ignore: known element type
        v.href = withBaseUrl(v.getAttribute('href'));
    });
    (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectIncludeSelf)('[data-src]', element)).each(function (i, v) {
        // @ts-ignore: known element type
        v.src = withBaseUrl(v.dataset.src);
        v.removeAttribute('data-src');
    });
    (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectIncludeSelf)('[data-bg-src]', element)).each(function (i, v) {
        // @ts-ignore: known element type
        v.style.backgroundImage = 'url("' + withBaseUrl(v.dataset.bgSrc) + '")';
        v.removeAttribute('data-bg-src');
    });
    (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectIncludeSelf)('form', element)).on('submit', function (e) {
        e.preventDefault();
    });
}

function App() {
    var self = this;
    app_(self, {
        init: [],
        options: {}
    });
    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.defineOwnProperty)(self, 'element', app_root, true);
    self.on('mounted', onElementMounted);
}

(0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.definePrototype)(App, {
    emit: function (event, element, data, bubbles) {
        if (!(0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.is)(element, Node)) {
            bubbles = data;
            data = element;
            element = this.element;
        }
        return dom.emit(event, element, data, bubbles);
    },
    define: function (props) {
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.define)(this, props);
    },
    beforeInit: function (promise) {
        if ((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.isFunction)(promise)) {
            promise = promise.call(this);
        }
        app_(this).init.push(promise);
    },
    detect: function (names, callback) {
        var app = this;
        var supports = {};
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(names, function (i, v) {
            if (featureDetections[v]) {
                supports[v] = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.isFunction)(featureDetections[v]) ? (featureDetections[v] = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.resolveAll)(featureDetections[v]()).catch(function (e) {
                    console.warn('Detection for ' + v + ' has thrown exception:', e);
                    return false;
                })) : featureDetections[v];
            }
        });
        this.beforeInit((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.resolveAll)(supports, function (supports) {
            supports = Object.freeze((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.extend)(app.supports || {}, supports));
            (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.define)(app, { supports: supports });
            return (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.isFunction)(callback) && callback(supports);
        }));
    },
    when: function (value, callback) {
        this.beforeInit((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.resolveAll)(value, function (value) {
            if (value) {
                return callback();
            }
        }));
    },
    on: function (target, event, handler, noChildren) {
        noChildren = (noChildren || handler) === true;
        if ((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.isFunction)(event)) {
            handler = event;
            event = target;
            target = app_root;
        }
        var handlers = event;
        if (typeof event === 'string') {
            if (noChildren) {
                handler = noChildrenHandler(handler);
            }
            if (event.indexOf(' ') >= 0) {
                handlers = {};
                (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(event, function (i, v) {
                    handlers[v] = handler;
                });
            } else {
                handlers = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.kv)(event, handler);
            }
        } else if (noChildren) {
            for (var i in event) {
                event[i] = noChildrenHandler(event[i]);
            }
        }
        if (typeof target === 'string') {
            addSelectHandlers(target, handlers);
            if (!appReady) {
                return;
            }
            target = (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(target).get();
        } else if (target instanceof Node) {
            target = [target];
        }
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(target, function (i, v) {
            dom.on(v, handlers);
        });
    },
    matchPath: function (path, selector, handler) {
        if ((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.isFunction)(selector)) {
            handler = selector;
            selector = null;
        }
        this.on('mounted', function (e) {
            if (e.target.getAttribute('match-path') === path && (!selector || (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(e.target).is(selector))) {
                handler.call(e.target, e.target);
            }
        });
    },
    matchElement: matchElement,
    beforeUpdate: hookBeforeUpdate,
    beforePageEnter: hookBeforePageEnter
});
(0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.watchable)(App.prototype);

/* harmony default export */ function src_app(callback) {
    if (appInited) {
        throw new Error('brew() can only be called once');
    }
    app = new App();
    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(src_defaults, function (i, v) {
        var fn = v && (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.isFunction)(app[(0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.camel)('use-' + i)]);
        if (fn) {
            fn.call(app, v);
        }
    });
    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.throwNotFunction)(callback)(app);
    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.extend)(window, { app });

    appInited = true;
    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.defineOwnProperty)(getVar(app_root), 'loading', 'initial');
    handleAsync((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.resolveAll)([dom.ready, processUntilEmpty(app_(app).init)], function () {
        appReady = true;
        mountElement(app_root);
        app.emit('ready');
    }), app_root);
}

function install(name, callback) {
    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.throwNotFunction)(callback);
    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.definePrototype)(App, (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.kv)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.camel)('use-' + name), function (options) {
        var state = app_(this);
        state.options[name] = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.extend)(state.options[name] || {}, options);
        callback(this, state.options[name]);
    }));
}

function addDetect(name, callback) {
    featureDetections[name] = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.throwNotFunction)(callback);
}



// CONCATENATED MODULE: ./src/var.js









const DEBUG_EVAL = /localhost:?/i.test(location.host);
const VAR_SCOPE_ATTRS = 'var switch auto-var error-scope'.split(' ');

const var_root = dom.root;
const var_hasOwnProperty = Object.prototype.hasOwnProperty;
const setPrototypeOf = Object.setPrototypeOf;
const stateStore = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.createPrivateStore)();

// assign to a new variable to avoid incompatble declaration issue by typescript compiler
const waterpipe_ = include_waterpipe;
waterpipe_.pipes['{'] = function (value, varargs) {
    var o = {};
    while (varargs.hasArgs()) {
        var key = varargs.raw();
        if (key === '}') {
            break;
        }
        o[String(key).replace(/:$/, '')] = varargs.next();
    }
    return o;
};
// @ts-ignore: add member to function
waterpipe_.pipes['{'].varargs = true;

/**
 * @param {Brew.VarState} state 
 * @param {string} varname 
 */
function getVarObjWithProperty(state, varname) {
    for (var s = state; s !== null; s = Object.getPrototypeOf(s)) {
        if (var_hasOwnProperty.call(s, varname)) {
            return s;
        }
    }
    console.warn('Undeclared state: %s', varname, { element: state.element });
    return state;
}

/**
 * Sets template variables on the specified element.
 * @param {Element | string} element A DOM element or a valid CSS selector. 
 * @param {Zeta.Dictionary | null=} newStates A simple object containing variables to set.
 * @param {boolean=} suppressEvent A boolean value specifying whether to suppress statechange event and DOM updates.
 */
function setVar(element, newStates, suppressEvent) {
    var hasUpdated = false;
    if (typeof element === 'string') {
        (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(element).each(function (i, v) {
            if (setVar(v, newStates, suppressEvent)) {
                hasUpdated = true;
            }
        });
    } else {
        var state = getVar(element);
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(newStates || evalAttr(element, 'set-var', state), function (i, v) {
            if (state[i] !== v) {
                var s = getVarObjWithProperty(state, i);
                s.__oldValues[i] = s[i];
                s.__newValues[i] = v;
                s[i] = v;
                hasUpdated = true;
                markUpdated(s.element);
            }
        });
        if (hasUpdated && !suppressEvent && appReady) {
            processStateChange();
        }
    }
    return !!hasUpdated;
}

/**
 * @param {Element} element 
 * @param {boolean=} resetToNull 
 */
function resetVar(element, resetToNull) {
    batch(function () {
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectIncludeSelf)('[var]', element), function (i, v) {
            setVar(v, getDeclaredVar(v, resetToNull));
        });
        if (resetToNull) {
            (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectIncludeSelf)('[switch][switch!=""]', element), function (i, v) {
                setVar(v, { matched: null });
            });
        }
    });
}

/**
 * @param {Element} element 
 * @param {boolean=} resetToNull 
 * @returns {Zeta.Dictionary}
 */
function getDeclaredVar(element, resetToNull) {
    var initValues = {};
    if (element.attributes['error-scope']) {
        initValues.error = null;
    }
    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.extend)(initValues, evalAttr(element, 'var'), evalAttr(element, 'auto-var'));
    if (resetToNull) {
        for (var i in initValues) {
            initValues[i] = null;
        }
    }
    return initValues;
}

/**
 * Gets template variables defined on the specified element.
 * @param {Element} element A DOM element.
 * @returns {Brew.VarState}
 */
function getVar(element) {
    if (!(0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.containsOrEquals)(var_root, element)) {
        console.error('State should not be accessed when element is detached.', { element: element });
    }
    var state = stateStore(element);
    if (!state) {
        state = stateStore(element, {});
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.defineHiddenProperty)(state, 'element', element);
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.defineHiddenProperty)(state, '__newValues', {});
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.defineHiddenProperty)(state, '__oldValues', {});
        // @ts-ignore: dataset can be on Element
        if ((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.keys)(element.dataset)[0]) {
            // @ts-ignore: dataset can be on Element
            var dataset = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.extend)({}, element.dataset);
            (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(dataset, function (i, v) {
                dataset[i] = include_waterpipe.eval('"' + v + '"');
            });
            (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.extend)(state, dataset);
        }
        var parent = (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(element).parents('[' + VAR_SCOPE_ATTRS.join('],[') + ']')[0] || var_root;
        if (parent !== element) {
            var parentState = getVar(parent);
            setPrototypeOf(state, parentState);
            setPrototypeOf(state.__newValues, parentState.__newValues);
            setPrototypeOf(state.__oldValues, parentState.__oldValues);
        } else {
            setPrototypeOf(state, function () { }.prototype);
        }
        if (!element.childElementCount) {
            (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.defineGetterProperty)(state, 'textContent', function () {
                return element.textContent;
            });
        }
    }
    if (!var_hasOwnProperty.call(state, '__init')) {
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.defineHiddenProperty)(state, '__init', true);
        var newStates = getDeclaredVar(element, !(0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.containsOrEquals)(var_root, element) || !!(0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(element).parents('[match-path]')[0]);
        for (var i in newStates) {
            (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.defineOwnProperty)(state, i, newStates[i]);
        }
    }
    return state;
}

/**
 * @param {string} template 
 * @param {any} context 
 * @param {Element} element 
 * @param {string} attrName 
 * @param {boolean=} returnAsIs 
 */
function evaluate(template, context, element, attrName, returnAsIs) {
    var options = { globals: { app: app } };
    var result = returnAsIs ? include_waterpipe.eval(template, (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.extend)({}, context), options) : (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.htmlDecode)(include_waterpipe(template, (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.extend)({}, context), options));
    if (DEBUG_EVAL) {
        groupLog('eval', [element, attrName, '→', result], function (console) {
            console.log('%c%s%c', 'background-color:azure;color:darkblue;font-weight:bold', template, '', '→', result);
            console.log('Context:', (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.extend)({}, context));
            console.log('Element:', element === var_root ? document : element);
        });
    }
    return result;
}

/**
 * @param {Element} element 
 * @param {string} attrName 
 * @param {any=} context 
 */
function evalAttr(element, attrName, context) {
    var str = element.getAttribute(attrName);
    if (!str) {
        return {};
    }
    context = context || getVar(element);
    return evaluate(str, context, element, attrName, true);
}

// CONCATENATED MODULE: ./src/domAction.js












const flyoutStates = new external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.Map();
const executedAsyncActions = new external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.Map();
/** @type {Zeta.Dictionary<Zeta.AnyFunction>} */
const asyncActions = {};

/**
 * @param {string} attr 
 * @param {(this: Element, e: JQuery.UIEventBase) => Brew.PromiseOrEmpty} callback 
 */
function addAsyncAction(attr, callback) {
    asyncActions[attr] = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.throwNotFunction)(callback);
}

/**
 * @param {Element | string=} flyout 
 * @param {any=} value 
 */
function closeFlyout(flyout, value) {
    // @ts-ignore: type inference issue
    (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(flyout || '[is-flyout].open').each(function (i, v) {
        var state = flyoutStates.get(v);
        if (state) {
            flyoutStates.delete(v);
            state.resolve(value);
            if (state.source) {
                (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.setClass)(state.source, 'target-opened', false);
            }
        }
        animateOut(v, 'show').then(function () {
            (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.setClass)(v, 'open', false);
        });
    });
}

/**
 * @param {string} selector 
 * @param {any=} states 
 * @param {Element=} source 
 * @param {boolean=} closeIfOpened 
 */
function openFlyout(selector, states, source, closeIfOpened) {
    var container = source || dom.root;
    var element = selector ? (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectClosestRelative)(selector, container) : (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(container).closest('[is-flyout]')[0];
    if (!element) {
        return Promise.reject();
    }
    var prev = flyoutStates.get(element);
    if (prev) {
        if (closeIfOpened) {
            // @ts-ignore: can accept if no such property
            closeFlyout(element, source && include_waterpipe.eval('`' + source.value));
        } else {
            // @ts-ignore: extended app property
            prev.path = app.path;
        }
        return prev.promise;
    }
    var resolve;
    var promise = new Promise(function (resolve_) {
        resolve = resolve_;
    });
    flyoutStates.set(element, {
        source: source,
        promise: promise,
        resolve: resolve,
        // @ts-ignore: extended app property
        path: app.path
    });
    if (source) {
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.setClass)(source, 'target-opened', true);
    }
    if (states) {
        setVar(element, states);
    }
    (0,external_commonjs_zeta_dom_css_commonjs2_zeta_dom_css_amd_zeta_dom_css_root_zeta_css_.runCSSTransition)(element, 'open', function () {
        dom.focus(element);
    });
    animateIn(element, 'open');
    if (element.attributes['is-modal']) {
        dom.lock(element, promise);
    }
    return promise;
}

addAsyncAction('validate', function (e) {
    var target = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectClosestRelative)(this.getAttribute('validate') || '', e.target);
    if (target) {
        // @ts-ignore: type inference issue
        var valid = dom.emit('validate', target) || !target.checkValidity || target.checkValidity();
        if (!valid) {
            e.stopImmediatePropagation();
            e.preventDefault();
        } else if ((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.isFunction)(valid.then)) {
            return valid.then(function (valid) {
                if (!valid) {
                    throw 'validation-failed';
                }
            });
        }
    }
});

addAsyncAction('context-method', function (e) {
    var self = e.currentTarget;
    var method = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.camel)(self.getAttribute('context-method') || '');
    if ((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.isFunction)(app[method])) {
        var formSelector = self.getAttribute('context-form');
        // @ts-ignore: acceptable if self.form is undefined
        var form = formSelector ? (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectClosestRelative)(formSelector, self) : self.form;
        var params = {};
        var valid = true;
        if (form) {
            valid = dom.emit('validate', form) || form.checkValidity();
            (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.extend)(params, getFormValues(form));
        } else {
            (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.extend)(params, self.dataset);
        }
        return (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.resolveAll)(valid, function (valid) {
            if (!valid) {
                throw 'validation-failed';
            }
            return app[method](params);
        });
    }
});

dom.ready.then(function () {
    app.on('mounted', function (e) {
        (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectIncludeSelf)('[' + (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.keys)(asyncActions).join('],[') + ']', e.target)).attr('async-action', '');
    });

    app.on('navigate', function () {
        setTimeout(function () {
            flyoutStates.forEach(function (v, i) {
                // @ts-ignore: extended app property
                if (v.path !== app.path) {
                    closeFlyout(i);
                }
            });
        });
    });

    (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)('body').on('click', '[disabled], .disabled, :disabled', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
    });

    (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)('body').on('click', '[async-action]', function (e) {
        var element = e.currentTarget;
        var executed = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.mapGet)(executedAsyncActions, element, Array);
        var callback = null;
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(asyncActions, function (i, v) {
            if (element.attributes[i] && executed.indexOf(v) < 0) {
                callback = v;
                return false;
            }
        });
        if (!callback) {
            executedAsyncActions.delete(element);
        } else {
            executed.push(callback);
            // @ts-ignore: type inference issue
            var returnValue = callback.call(element, e);
            if (returnValue && (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.isFunction)(returnValue.then) && !e.isImmediatePropagationStopped()) {
                e.stopImmediatePropagation();
                e.preventDefault();
                handleAsync(returnValue).then(function () {
                    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.dispatchDOMMouseEvent)(e);
                }, function (e) {
                    executedAsyncActions.delete(element);
                    console.warn('Action threw an error:', e);
                });
            }
        }
    });

    (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)('body').on('click', 'a[href]:not([rel]), [data-href]', function (e) {
        var self = e.currentTarget;
        if (self.target !== '_blank' && 'navigate' in app) {
            e.preventDefault();
            e.stopPropagation();
            var modalParent = (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(self).closest('[is-modal]')[0];
            if (modalParent) {
                // handle links inside modal popup
                // this will return the promise which is resolved after modal popup is closed and release the lock
                openFlyout(modalParent).then(function () {
                    // @ts-ignore: app.navigate checked for truthiness
                    app.navigate(self.getAttribute('data-href') || self.getAttribute('href'));
                });
                closeFlyout(modalParent);
            } else {
                // @ts-ignore: app.navigate checked for truthiness
                app.navigate(self.getAttribute('data-href') || self.getAttribute('href'));
                closeFlyout();
            }
        }
    });

    (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)('body').on('click', '[set-var]:not([match-path])', function (e) {
        var self = e.currentTarget;
        if (self === (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(e.target).closest('[set-var]')[0]) {
            setVar(self);
            closeFlyout();
        }
    });

    (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)('body').on('click', '[toggle]', function (e) {
        var self = e.currentTarget;
        e.stopPropagation();
        openFlyout(self.getAttribute('toggle'), null, self, true);
    });

    (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)('body').on('click', '[toggle-class]', function (e) {
        e.stopPropagation();
        var self = e.currentTarget;
        var selector = self.getAttribute('toggle-class-for');
        var target = selector ? (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectClosestRelative)(selector, self) : e.currentTarget;
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(self.getAttribute('toggle-class'), function (i, v) {
            (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.setClass)(target, v.slice(1), v[0] === '+');
        });
    });

    (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)('body').on('click', function () {
        closeFlyout();
    });
});

// CONCATENATED MODULE: ./src/brew.js











(0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.define)(src_app, {
    defaults: src_defaults,
    ...common_namespaceObject,
    ...path_namespaceObject,
    ...anim_namespaceObject,
    ...domAction_namespaceObject,
    getVar: getVar,
    setVar: setVar,
    evalAttr: evalAttr,
    isElementActive: isElementActive,
    handleAsync: handleAsync,
    preventLeave: preventLeave,
    install: install,
    addDetect: addDetect
});

/* harmony default export */ const brew = (src_app);

// CONCATENATED MODULE: ./src/extension/config.js




install('config', function (app, options) {
    var config = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.watchable)();
    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.define)(app, { config });
    app.beforeInit(getJSON(options.path).catch((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.isFunction)(options.fallback) || null).then(function (d) {
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.extend)(config, d);
        if (options.freeze) {
            (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.deepFreeze)(config);
        }
    }));
});

/* harmony default export */ const config = (null);

// CONCATENATED MODULE: ./src/extension/formVar.js










src_defaults.formVar = true;

install('formVar', function (app) {
    app.matchElement('form[form-var]', function (form) {
        var varname = form.getAttribute('form-var');
        // @ts-ignore: form must be HTMLFormElement
        var values = getFormValues(form);
        var update = function () {
            setVar(form, varname ? (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.kv)(varname, (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.extend)({}, values)) : values);
        };
        dom.watchElements(form, ':input', function (addedInputs, removedInputs) {
            (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(addedInputs).on('change', update);
            (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(removedInputs).off('change', update);
            // @ts-ignore: form must be HTMLFormElement
            values = getFormValues(form);
            update();
        });
        app.on(form, 'reset', function () {
            var state = getVar(form);
            if (varname) {
                if (!isElementActive(getVarObjWithProperty(state, varname).element)) {
                    // @ts-ignore: form must be HTMLFormElement
                    form.reset();
                }
            } else {
                // @ts-ignore: form must be HTMLFormElement
                (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(form.elements, function (i, v) {
                    if (!isElementActive(getVarObjWithProperty(state, v.name).element)) {
                        v.reset();
                    }
                });
            }
            return true;
        });
        (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(':input', form).on('change', update);
        update();
    });
    
    app.on('pageenter', function (e) {
        (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectIncludeSelf)('form[form-var]', e.target)).each(function (i, v) {
            (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(':input:eq(0)', v).trigger('change');
        });
    });
});

/* harmony default export */ const formVar = (null);

// CONCATENATED MODULE: ./src/extension/i18n.js



function detectLanguage(languages, defaultLanguage) {
    var userLanguages = navigator.languages ? [].slice.apply(navigator.languages) : [navigator.language || ''];
    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(userLanguages, function (i, v) {
        if (v.indexOf('-') > 0) {
            var invariant = v.split('-')[0];
            if (userLanguages.indexOf(invariant) < 0) {
                for (var j = userLanguages.length - 1; j >= 0; j--) {
                    if (userLanguages[j].split('-')[0] === invariant) {
                        userLanguages.splice(j + 1, 0, invariant);
                    }
                }
            }
        }
    });
    languages = languages || userLanguages;
    return (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.any)(userLanguages, function (v) {
        return languages.indexOf(v) >= 0;
    }) || defaultLanguage || languages[0];
}

install('i18n', function (app, options) {
    var routeParam = app.route && options.routeParam;
    var cookie = options.cookie && cookie(options.cookie, 86400000);
    var language = (routeParam && app.route[routeParam]) || (cookie && cookie.get()) || detectLanguage(options.languages, options.defaultLanguage);
    var setLanguage = function (newLangauge) {
        if (options.languages.indexOf(newLangauge) < 0) {
            newLangauge = language;
        }
        app.language = newLangauge;
        if (cookie) {
            cookie.set(newLangauge);
        }
        if (routeParam) {
            app.route[routeParam] = newLangauge;
        }
        if (language !== newLangauge) {
            language = newLangauge;
            if (options.reloadOnChange) {
                location.reload();
            }
        }
    };

    app.define({
        language,
        setLanguage,
        detectLanguage
    });
    app.watch('language', setLanguage);
    if (routeParam) {
        app.route.watch(routeParam, setLanguage);
        app.on('ready', function () {
            app.route[routeParam] = language;
        });
    }
});

/* harmony default export */ const i18n = (null);

// CONCATENATED MODULE: ./src/extension/login.js





install('login', function (app, options) {
    options = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.extend)({
        loginPagePath: '',
        defaultRedirectPath: '',
        cookie: '',
        expiry: 0,
        logout: null,
        login: null,
        tokenLogin: null,
        getTokenFromResponse: null
    }, options);

    var authCookie = cookie(options.cookie, options.expiry);
    var setLoggedIn = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.defineObservableProperty)(app, 'loggedIn', false);

    function handleLogin(response) {
        setLoggedIn(true);
        if ((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.isFunction)(options.getTokenFromResponse)) {
            authCookie.set(options.getTokenFromResponse(response));
        }
        app.emit('login', { data: response });
    }

    function handleLogout() {
        setLoggedIn(false);
        authCookie.delete();
        app.emit('logout');
    }

    var redirectPath = app.initialPath;
    var previousToken = authCookie.get();
    if (previousToken && (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.isFunction)(options.tokenLogin)) {
        app.beforeInit((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.catchAsync)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.resolveAll)(options.tokenLogin(previousToken), handleLogin)));
    }
    app.define({
        login: function (params, nextPath, callback) {
            callback = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.isFunction)(callback || nextPath);
            nextPath = typeof nextPath === 'string' && nextPath;
            return (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.resolveAll)(options.login(params)).then(function (d) {
                handleLogin(d);
                return callback && callback();
            }, function (e) {
                setLoggedIn(false);
                throw e.status >= 500 ? 'server-error' : 'incorrect-cred';
            }).then(function () {
                if (redirectPath === app.resolvePath(options.loginPagePath)) {
                    redirectPath = '';
                }
                app.navigate(nextPath || redirectPath || options.defaultRedirectPath);
                redirectPath = '';
            });
        },
        logout: function (nextPath, callback) {
            if (!app.loggedIn) {
                return (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.resolve)();
            }
            callback = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.isFunction)(callback || nextPath);
            nextPath = typeof nextPath === 'string' && nextPath;
            return (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.resolve)(preventLeave()).then(function () {
                return options.logout();
            }).then(function () {
                handleLogout();
                return callback && callback();
            }).then(function () {
                app.navigate(nextPath || options.loginPagePath);
            });
        }
    });
    app.on('navigate', function (e) {
        var loginPagePath = app.resolvePath(options.loginPagePath);
        if ((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.either)(app.loggedIn, e.pathname !== loginPagePath)) {
            if (app.loggedIn) {
                app.navigate(options.defaultRedirectPath);
            } else {
                redirectPath = e.pathname;
                app.navigate(loginPagePath);
            }
        }
    });
});

/* harmony default export */ const login = (null);

// CONCATENATED MODULE: ./src/extension/preloadImage.js








const preloadImage_IMAGE_STYLE_PROPS = 'background-image'.split(' ');

src_defaults.preloadImage = true;

install('preloadImage', function (app) {
    app.beforeUpdate(function (domUpdates) {
        var urls = {};
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(domUpdates, function (element, props) {
            if ((props.src || props.style) && isElementActive(element)) {
                if (props.src) {
                    urls[props.src] = true;
                }
                if (props.style) {
                    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.each)(preloadImage_IMAGE_STYLE_PROPS, function (i, v) {
                        // @ts-ignore: props.style checked for truthiness
                        var imageUrl = (0,external_commonjs_zeta_dom_css_commonjs2_zeta_dom_css_amd_zeta_dom_css_root_zeta_css_.isCssUrlValue)(props.style[v]);
                        if (imageUrl) {
                            urls[path_withBaseUrl(imageUrl)] = true;
                        }
                    });
                }
            }
        });
        return preloadImages((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.keys)(urls), 200);
    });
    app.beforePageEnter(function (element) {
        return preloadImages(element, 1000);
    });
});

/* harmony default export */ const preloadImage = (null);

// CONCATENATED MODULE: ./src/extension/scrollable.js









install('scrollable', function (app) {
    // @ts-ignore: non-standard member
    var DOMMatrix = window.DOMMatrix || window.WebKitCSSMatrix || window.MSCSSMatrix;
    var store = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.createPrivateStore)();
    var id = 0;

    function getState(container) {
        return store(container) || store(container, {
            childClass: 'scrollable-target-' + (++id)
        });
    }

    function initScrollable(container) {
        var dir = container.getAttribute('scrollable');
        var paged = container.getAttribute('scroller-snap-page') || '';
        var varname = container.getAttribute('scroller-state') || '';
        var selector = container.getAttribute('scroller-page') || '';

        var items = selector && (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(selector, container).get();
        var scrolling = false;
        var needRefresh = false;
        var isControlledScroll;

        // @ts-ignore: signature ignored
        (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(container).scrollable({
            bounce: false,
            handle: (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.matchWord)(dir, 'auto scrollbar content') || 'content',
            hScroll: !(0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.matchWord)(dir, 'y-only'),
            vScroll: !(0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.matchWord)(dir, 'x-only'),
            content: '.' + getState(container).childClass + ':visible:not(.disabled)',
            pageItem: selector,
            snapToPage: (paged === 'always' || paged === app.orientation),
            scrollbar: false,
            scrollStart: function (e) {
                app.emit('scrollStart', container, e, true);
            },
            scrollMove: function (e) {
                app.emit('scrollMove', container, e, true);
            },
            scrollEnd: function (e) {
                app.emit('scrollStop', container, e, true);
            }
        });

        function setState(index) {
            if (varname) {
                var obj = {};
                obj[varname] = index;
                setVar(container, obj);
            }
        }

        function scrollTo(index, align) {
            align = align || 'center top';
            if (!scrolling && (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.isVisible)(container)) {
                scrolling = true;
                isControlledScroll = true;
                setState(index);
                (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(container).scrollable('scrollToElement', items[index], align, align, 200, function () {
                    scrolling = false;
                    isControlledScroll = false;
                });
            }
        }

        function refresh() {
            var isPaged = (paged === 'always' || paged === app.orientation);
            if (isPaged && (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.isVisible)(container)) {
                if (scrolling) {
                    needRefresh = true;
                } else {
                    needRefresh = false;
                    scrollTo(getVar(container)[varname]);
                }
            }
        }

        if (selector) {
            if (paged !== 'always') {
                app.on('orientationchange', function () {
                    (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(container).scrollable('setOptions', {
                        snapToPage: paged === app.orientation
                    });
                });
            }
            if (varname) {
                app.on(container, {
                    statechange: function (e) {
                        var newIndex = e.data[varname];
                        if (!scrolling) {
                            if (((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.getRect)(items[newIndex]).width | 0) > ((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.getRect)().width | 0)) {
                                scrollTo(newIndex, 'left center');
                            } else {
                                scrollTo(newIndex);
                            }
                        }
                    },
                    scrollMove: function (e) {
                        scrolling = true;
                        if (!isControlledScroll) {
                            setState(e.pageIndex);
                        }
                    },
                    scrollStop: function (e) {
                        setState(e.pageIndex);
                        scrolling = false;
                        if (needRefresh) {
                            refresh();
                        }
                    }
                }, true);
                var timeout;
                (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(window).on('resize', function () {
                    clearTimeout(timeout);
                    timeout = setTimeout(refresh, 200);
                });
            }
        }
    }

    app.on('mounted', function (e) {
        (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectIncludeSelf)('[scrollable-target]', e.target)).each(function (i, v) {
            var scrollable = (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(v).closest('[scrollable]')[0];
            (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(v).addClass(getState(scrollable).childClass);
        });
        (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectIncludeSelf)('[scrollable]', e.target)).each(function (i, v) {
            initScrollable(v);
        });
    });

    // update scroller on events other than window resize
    function refresh() {
        (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)('[scrollable]:visible').scrollable('refresh');
    }
    app.on('statechange orientationchange animationcomplete', function () {
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.setTimeoutOnce)(refresh);
    });
    app.on('pageenter', function (e) {
        var $scrollables = (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectIncludeSelf)('[scrollable]', e.target)).add((0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(e.target).parents('[scrollable]'));
        (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.selectIncludeSelf)('[scrollable-target]', e.target)).each(function (i, v) {
            (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(v).toggleClass('disabled', !isElementActive(v));
        });
        $scrollables.scrollable('refresh');
        $scrollables.filter(':not([keep-scroll-offset])').scrollable('scrollTo', 0, 0);
    });

    // scroll-into-view animation trigger
    function updateScrollIntoView() {
        (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)('[animate-on~="scroll-into-view"]:not(.tweening-in):visible').each(function (i, v) {
            var m = new DOMMatrix(getComputedStyle(v).transform);
            var rootRect = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.getRect)(dom.root);
            var thisRect = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.getRect)(v);
            if ((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.rectIntersects)(rootRect, thisRect.translate(-m.e || 0, 0)) ||
                (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.rectIntersects)(rootRect, thisRect.translate(0, -m.f || 0))) {
                animateIn(v, 'scroll-into-view');
            }
        });
    }

    app.on('resize pageenter statechange scrollMove orientationchange', function () {
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.setTimeoutOnce)(updateScrollIntoView);
    });
});

/* harmony default export */ const scrollable = (null); 

// EXTERNAL MODULE: external {"commonjs":"zeta-dom","commonjs2":"zeta-dom","amd":"zeta-dom","root":"zeta"}
var external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_ = __webpack_require__(163);
// CONCATENATED MODULE: ./src/include/zeta/index.js

/* harmony default export */ const zeta = ((/* unused pure expression or super */ null && (index)));



// CONCATENATED MODULE: ./src/extension/viewport.js








src_defaults.viewport = true;

install('viewport', function (app) {
    var setOrientation = (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.defineObservableProperty)(app, 'orientation', '');
    var useAvailOrInner = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.IS_TOUCH && navigator.platform !== 'MacIntel';
    var availWidth = screen.availWidth;
    var availHeight = screen.availHeight;
    var aspectRatio, viewportWidth, viewportHeight;

    function checkViewportSize(triggerEvent) {
        if (external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.IS_TOUCH && screen.availWidth === availWidth && screen.availHeight === availHeight && screen.availWidth === window.innerWidth) {
            // set min-height on body container so that page size is correct when virtual keyboard pops out
            (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)('body').css('min-height', (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)('body').height() + 'px');
        } else {
            (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)('body').css('min-height', '0');
        }
        availWidth = screen.availWidth;
        availHeight = screen.availHeight;

        // scroll properly by CSS transform when height of body is larger than root
        var bodyHeight = (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)('body').height() || 0;
        var htmlHeight = (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)('html').height() || 0;
        if (htmlHeight < bodyHeight && (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(dom.activeElement).is(':text')) {
            dom.scrollIntoView(dom.activeElement);
        }
        var previousAspectRatio = aspectRatio;
        viewportWidth = useAvailOrInner ? availWidth : document.body.offsetWidth;
        viewportHeight = useAvailOrInner ? (availWidth === window.innerWidth ? availHeight : window.innerHeight) : document.body.offsetHeight;
        aspectRatio = viewportWidth / viewportHeight;
        setOrientation(aspectRatio >= 1 ? 'landscape' : 'portrait');
        if (triggerEvent !== false) {
            app.emit('resize', {
                aspectRatio: aspectRatio,
                viewportWidth: viewportWidth,
                viewportHeight: viewportHeight
            });
            if ((0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.either)(aspectRatio >= 1, previousAspectRatio >= 1)) {
                app.emit('orientationchange', {
                    orientation: app.orientation
                });
            }
        }
    }

    (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.define)(app, {
        get aspectRatio() {
            return aspectRatio;
        },
        get viewportWidth() {
            return viewportWidth;
        },
        get viewportHeight() {
            return viewportHeight;
        }
    });

    app.on('orientationchange', function () {
        animateIn(dom.root, 'orientationchange');
    });
    (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(window).on('resize', function () {
        (0,external_commonjs_zeta_dom_util_commonjs2_zeta_dom_util_amd_zeta_dom_util_root_zeta_util_.setTimeoutOnce)(checkViewportSize);
    });
    (0,external_commonjs_zeta_dom_shim_commonjs2_zeta_dom_shim_amd_zeta_dom_shim_root_zeta_shim_.$)(function () {
        checkViewportSize(false);
    });
});

/* harmony default export */ const viewport = (null);

// CONCATENATED MODULE: ./src/index.js










/* harmony default export */ const src = (brew);


/***/ }),

/***/ 609:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__609__;

/***/ }),

/***/ 160:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__160__;

/***/ }),

/***/ 229:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__229__;

/***/ }),

/***/ 163:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__163__;

/***/ }),

/***/ 260:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__260__;

/***/ }),

/***/ 50:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__50__;

/***/ }),

/***/ 774:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__774__;

/***/ }),

/***/ 990:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__990__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(349);
/******/ })()
;
});
//# sourceMappingURL=brew.js.map