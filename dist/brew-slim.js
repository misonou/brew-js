/*! brew-js v0.5.10 | (c) misonou | http://hackmd.io/@misonou/brew-js */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("zeta-dom"), require("jQuery"), require("jq-scrollable"), require("waterpipe"));
	else if(typeof define === 'function' && define.amd)
		define("brew", ["zeta-dom", "jQuery", "jq-scrollable", "waterpipe"], factory);
	else if(typeof exports === 'object')
		exports["brew"] = factory(require("zeta-dom"), require("jQuery"), require("jq-scrollable"), require("waterpipe"));
	else
		root["brew"] = factory(root["zeta"], root["jQuery"], root["jq-scrollable"], root["waterpipe"]);
})(self, function(__WEBPACK_EXTERNAL_MODULE__163__, __WEBPACK_EXTERNAL_MODULE__609__, __WEBPACK_EXTERNAL_MODULE__172__, __WEBPACK_EXTERNAL_MODULE__160__) {
return /******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 268:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ entry_slim; }
});

// NAMESPACE OBJECT: ./src/util/path.js
var path_namespaceObject = {};
__webpack_require__.r(path_namespaceObject);
__webpack_require__.d(path_namespaceObject, {
  "baseUrl": function() { return baseUrl; },
  "combinePath": function() { return combinePath; },
  "isSubPathOf": function() { return isSubPathOf; },
  "normalizePath": function() { return normalizePath; },
  "parsePath": function() { return parsePath; },
  "removeQueryAndHash": function() { return removeQueryAndHash; },
  "setBaseUrl": function() { return setBaseUrl; },
  "toAbsoluteUrl": function() { return toAbsoluteUrl; },
  "toRelativeUrl": function() { return toRelativeUrl; },
  "toSegments": function() { return toSegments; },
  "withBaseUrl": function() { return withBaseUrl; }
});

// NAMESPACE OBJECT: ./src/errorCode.js
var errorCode_namespaceObject = {};
__webpack_require__.r(errorCode_namespaceObject);
__webpack_require__.d(errorCode_namespaceObject, {
  "apiError": function() { return apiError; },
  "navigationCancelled": function() { return navigationCancelled; },
  "navigationRejected": function() { return navigationRejected; },
  "networkError": function() { return networkError; },
  "resourceError": function() { return resourceError; },
  "timeout": function() { return errorCode_timeout; },
  "validationFailed": function() { return validationFailed; }
});

// NAMESPACE OBJECT: ./src/util/common.js
var common_namespaceObject = {};
__webpack_require__.r(common_namespaceObject);
__webpack_require__.d(common_namespaceObject, {
  "addStyleSheet": function() { return addStyleSheet; },
  "api": function() { return api; },
  "cookie": function() { return common_cookie; },
  "copyAttr": function() { return copyAttr; },
  "deleteCookie": function() { return deleteCookie; },
  "getAttr": function() { return getAttr; },
  "getAttrValues": function() { return getAttrValues; },
  "getCookie": function() { return getCookie; },
  "getFormValues": function() { return getFormValues; },
  "getJSON": function() { return getJSON; },
  "getQueryParam": function() { return getQueryParam; },
  "hasAttr": function() { return hasAttr; },
  "isBoolAttr": function() { return isBoolAttr; },
  "loadScript": function() { return loadScript; },
  "preloadImages": function() { return preloadImages; },
  "selectorForAttr": function() { return selectorForAttr; },
  "setAttr": function() { return setAttr; },
  "setCookie": function() { return setCookie; },
  "setQueryParam": function() { return setQueryParam; }
});

// NAMESPACE OBJECT: ./src/util/storage.js
var storage_namespaceObject = {};
__webpack_require__.r(storage_namespaceObject);
__webpack_require__.d(storage_namespaceObject, {
  "createObjectStorage": function() { return createObjectStorage; }
});

// NAMESPACE OBJECT: ./src/anim.js
var anim_namespaceObject = {};
__webpack_require__.r(anim_namespaceObject);
__webpack_require__.d(anim_namespaceObject, {
  "addAnimateIn": function() { return addAnimateIn; },
  "addAnimateOut": function() { return addAnimateOut; },
  "animateIn": function() { return animateIn; },
  "animateOut": function() { return animateOut; }
});

// NAMESPACE OBJECT: ./src/domAction.js
var domAction_namespaceObject = {};
__webpack_require__.r(domAction_namespaceObject);
__webpack_require__.d(domAction_namespaceObject, {
  "addAsyncAction": function() { return addAsyncAction; },
  "closeFlyout": function() { return closeFlyout; },
  "isFlyoutOpen": function() { return isFlyoutOpen; },
  "openFlyout": function() { return openFlyout; },
  "toggleFlyout": function() { return toggleFlyout; }
});

// EXTERNAL MODULE: external {"commonjs":"zeta-dom","commonjs2":"zeta-dom","amd":"zeta-dom","root":"zeta"}
var external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_ = __webpack_require__(163);
// CONCATENATED MODULE: ./tmp/zeta-dom/util.js

var _zeta$util = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.util,
    noop = _zeta$util.noop,
    pipe = _zeta$util.pipe,
    either = _zeta$util.either,
    is = _zeta$util.is,
    isUndefinedOrNull = _zeta$util.isUndefinedOrNull,
    isArray = _zeta$util.isArray,
    isFunction = _zeta$util.isFunction,
    isThenable = _zeta$util.isThenable,
    isPlainObject = _zeta$util.isPlainObject,
    isArrayLike = _zeta$util.isArrayLike,
    makeArray = _zeta$util.makeArray,
    extend = _zeta$util.extend,
    each = _zeta$util.each,
    map = _zeta$util.map,
    grep = _zeta$util.grep,
    splice = _zeta$util.splice,
    any = _zeta$util.any,
    single = _zeta$util.single,
    kv = _zeta$util.kv,
    fill = _zeta$util.fill,
    pick = _zeta$util.pick,
    exclude = _zeta$util.exclude,
    mapObject = _zeta$util.mapObject,
    mapGet = _zeta$util.mapGet,
    mapRemove = _zeta$util.mapRemove,
    arrRemove = _zeta$util.arrRemove,
    setAdd = _zeta$util.setAdd,
    equal = _zeta$util.equal,
    combineFn = _zeta$util.combineFn,
    executeOnce = _zeta$util.executeOnce,
    createPrivateStore = _zeta$util.createPrivateStore,
    util_setTimeout = _zeta$util.setTimeout,
    setTimeoutOnce = _zeta$util.setTimeoutOnce,
    util_setInterval = _zeta$util.setInterval,
    setIntervalSafe = _zeta$util.setIntervalSafe,
    setImmediate = _zeta$util.setImmediate,
    setImmediateOnce = _zeta$util.setImmediateOnce,
    util_throws = _zeta$util.throws,
    throwNotFunction = _zeta$util.throwNotFunction,
    errorWithCode = _zeta$util.errorWithCode,
    isErrorWithCode = _zeta$util.isErrorWithCode,
    util_keys = _zeta$util.keys,
    values = _zeta$util.values,
    util_hasOwnProperty = _zeta$util.hasOwnProperty,
    getOwnPropertyDescriptors = _zeta$util.getOwnPropertyDescriptors,
    util_define = _zeta$util.define,
    definePrototype = _zeta$util.definePrototype,
    defineOwnProperty = _zeta$util.defineOwnProperty,
    defineGetterProperty = _zeta$util.defineGetterProperty,
    defineHiddenProperty = _zeta$util.defineHiddenProperty,
    defineAliasProperty = _zeta$util.defineAliasProperty,
    defineObservableProperty = _zeta$util.defineObservableProperty,
    watch = _zeta$util.watch,
    watchOnce = _zeta$util.watchOnce,
    watchable = _zeta$util.watchable,
    inherit = _zeta$util.inherit,
    freeze = _zeta$util.freeze,
    deepFreeze = _zeta$util.deepFreeze,
    iequal = _zeta$util.iequal,
    randomId = _zeta$util.randomId,
    repeat = _zeta$util.repeat,
    camel = _zeta$util.camel,
    hyphenate = _zeta$util.hyphenate,
    ucfirst = _zeta$util.ucfirst,
    lcfirst = _zeta$util.lcfirst,
    trim = _zeta$util.trim,
    matchWord = _zeta$util.matchWord,
    matchWordMulti = _zeta$util.matchWordMulti,
    htmlDecode = _zeta$util.htmlDecode,
    resolve = _zeta$util.resolve,
    reject = _zeta$util.reject,
    always = _zeta$util.always,
    resolveAll = _zeta$util.resolveAll,
    retryable = _zeta$util.retryable,
    deferrable = _zeta$util.deferrable,
    catchAsync = _zeta$util.catchAsync,
    setPromiseTimeout = _zeta$util.setPromiseTimeout,
    delay = _zeta$util.delay,
    makeAsync = _zeta$util.makeAsync;

// CONCATENATED MODULE: ./src/include/zeta-dom/util.js

// CONCATENATED MODULE: ./src/util/path.js
var defaultPort = {
  http: 80,
  https: 443
};
var baseUrl = '/';
/**
 * @param {string} b
 */

function setBaseUrl(b) {
  baseUrl = normalizePath(b, true);
}
/**
 * @param {string} a
 * @param {string} b
 */

function combinePath(a, b) {
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

function parsePath(path) {
  var a = document.createElement('a');
  a.href = path;
  return a;
}
/**
 * @param {string} path
 * @param {boolean=} resolveDotDir
 * @param {boolean=} returnEmpty
 */

function normalizePath(path, resolveDotDir, returnEmpty) {
  if (!path || path === '/') {
    return returnEmpty ? '' : '/';
  }

  if (/(^(?:[a-z0-9]+:)?\/\/)|\?|#/.test(path)) {
    var a = parsePath(path);
    return ((RegExp.$1 && (a.origin || a.protocol + '//' + a.hostname + (a.port && +a.port !== defaultPort[a.protocol.slice(0, -1)] ? ':' + a.port : ''))) + normalizePath(a.pathname, resolveDotDir, true) || '/') + a.search + a.hash;
  }

  path = String(path).replace(/\/+(\/|$)/g, '$1');

  if (resolveDotDir && /(^|\/)\.{1,2}(\/|$)/.test(path)) {
    var segments = path.split('/');

    for (var j = 0; j < segments.length;) {
      if (segments[j] === '.' || segments[j] === '..' && !j) {
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
function removeQueryAndHash(path) {
  var pos1 = path.indexOf('?') + 1;
  var pos2 = path.indexOf('#') + 1;

  if (!pos1 && !pos2) {
    return path;
  }

  return path.slice(0, Math.min(pos1 || pos2, pos2 || pos1) - 1);
}
/**
 * @param {string} url
 */

function withBaseUrl(url) {
  url = normalizePath(url);
  return baseUrl && url[0] === '/' && !isSubPathOf(url, baseUrl) ? combinePath(baseUrl, url) : url;
}
/**
 * @param {string} url
 */

function toAbsoluteUrl(url) {
  return url.indexOf('://') > 0 ? url : location.origin + withBaseUrl(url);
}
/**
 * @param {string} url
 */

function toRelativeUrl(url) {
  return isSubPathOf(url, location.origin) || url;
}
/**
 * @param {string} a
 * @param {string} b
 */

function isSubPathOf(a, b) {
  var len = b.length;
  return a.substr(0, len) === b && (!a[len] || /[/?#]/.test(a[len]) || b[len - 1] === '/') && (a[len] === '/' ? '' : '/') + a.slice(len);
}
/**
 * @param {string} path
 */

function toSegments(path) {
  path = normalizePath(path);
  return path === '/' ? [] : path.slice(1).split('/').map(decodeURIComponent);
}
// EXTERNAL MODULE: external "jQuery"
var external_jQuery_ = __webpack_require__(609);
// EXTERNAL MODULE: external "jq-scrollable"
var external_jq_scrollable_ = __webpack_require__(172);
// CONCATENATED MODULE: ./src/include/external/jquery.js


/* harmony default export */ const jquery = (external_jQuery_);
// CONCATENATED MODULE: ./src/include/external/promise-polyfill.js
var promise_polyfill_Promise = window.Promise;
/* harmony default export */ const promise_polyfill = (promise_polyfill_Promise);
// CONCATENATED MODULE: ./tmp/zeta-dom/cssUtil.js

var _zeta$css = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.css,
    parseCSS = _zeta$css.parseCSS,
    isCssUrlValue = _zeta$css.isCssUrlValue,
    runCSSTransition = _zeta$css.runCSSTransition;

// CONCATENATED MODULE: ./src/include/zeta-dom/cssUtil.js

// CONCATENATED MODULE: ./tmp/zeta-dom/domUtil.js

var domUtil_zeta$util = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.util,
    domReady = domUtil_zeta$util.domReady,
    tagName = domUtil_zeta$util.tagName,
    isVisible = domUtil_zeta$util.isVisible,
    matchSelector = domUtil_zeta$util.matchSelector,
    comparePosition = domUtil_zeta$util.comparePosition,
    connected = domUtil_zeta$util.connected,
    containsOrEquals = domUtil_zeta$util.containsOrEquals,
    acceptNode = domUtil_zeta$util.acceptNode,
    combineNodeFilters = domUtil_zeta$util.combineNodeFilters,
    iterateNode = domUtil_zeta$util.iterateNode,
    iterateNodeToArray = domUtil_zeta$util.iterateNodeToArray,
    getCommonAncestor = domUtil_zeta$util.getCommonAncestor,
    parentsAndSelf = domUtil_zeta$util.parentsAndSelf,
    selectIncludeSelf = domUtil_zeta$util.selectIncludeSelf,
    selectClosestRelative = domUtil_zeta$util.selectClosestRelative,
    createNodeIterator = domUtil_zeta$util.createNodeIterator,
    createTreeWalker = domUtil_zeta$util.createTreeWalker,
    bind = domUtil_zeta$util.bind,
    bindUntil = domUtil_zeta$util.bindUntil,
    dispatchDOMMouseEvent = domUtil_zeta$util.dispatchDOMMouseEvent,
    removeNode = domUtil_zeta$util.removeNode,
    getClass = domUtil_zeta$util.getClass,
    setClass = domUtil_zeta$util.setClass,
    getSafeAreaInset = domUtil_zeta$util.getSafeAreaInset,
    getScrollOffset = domUtil_zeta$util.getScrollOffset,
    getScrollParent = domUtil_zeta$util.getScrollParent,
    getContentRect = domUtil_zeta$util.getContentRect,
    scrollBy = domUtil_zeta$util.scrollBy,
    scrollIntoView = domUtil_zeta$util.scrollIntoView,
    makeSelection = domUtil_zeta$util.makeSelection,
    getRect = domUtil_zeta$util.getRect,
    getRects = domUtil_zeta$util.getRects,
    toPlainRect = domUtil_zeta$util.toPlainRect,
    rectEquals = domUtil_zeta$util.rectEquals,
    rectCovers = domUtil_zeta$util.rectCovers,
    rectIntersects = domUtil_zeta$util.rectIntersects,
    pointInRect = domUtil_zeta$util.pointInRect,
    mergeRect = domUtil_zeta$util.mergeRect,
    elementFromPoint = domUtil_zeta$util.elementFromPoint;

// CONCATENATED MODULE: ./src/include/zeta-dom/domUtil.js

// CONCATENATED MODULE: ./src/errorCode.js
var networkError = 'brew/network-error';
var resourceError = 'brew/resource-error';
var apiError = 'brew/api-error';
var validationFailed = 'brew/validation-failed';
var navigationCancelled = 'brew/navigation-cancelled';
var navigationRejected = 'brew/navigation-rejected';
var errorCode_timeout = "brew/timeout";
// CONCATENATED MODULE: ./src/util/common.js







/** @type {Zeta.Dictionary<Promise<void>>} */

var preloadImagesCache = {};
/** @type {Zeta.Dictionary<Promise<Zeta.Dictionary>>} */

var loadScriptCache = {};
var boolAttrMap = {};
each('allowFullscreen async autofocus autoplay checked controls default defer disabled formNoValidate isMap loop multiple muted noModule noValidate open playsInline readOnly required reversed selected trueSpeed', function (i, v) {
  boolAttrMap[v.toLowerCase()] = v;
});
function getAttrValues(element) {
  var values = {};
  each(element.attributes, function (i, v) {
    values[v.name] = v.value;
  });
  return values;
}
function isBoolAttr(element, name) {
  return name === 'itemscope' || boolAttrMap[name] in Object.getPrototypeOf(element);
}
function hasAttr(element, name) {
  return !!element.attributes[name];
}
function getAttr(element, name) {
  var attr = element.attributes[name];
  return attr ? attr.value : null;
}
function setAttr(element, name, value) {
  each(isPlainObject(name) || kv(name, value), function (i, v) {
    if (v === null) {
      element.removeAttribute(i);
    } else {
      element.setAttribute(i, v);
    }
  });
}
function copyAttr(src, dst) {
  each(src.attributes, function (i, v) {
    dst.setAttribute(v.name, v.value);
  });
}
function selectorForAttr(attr) {
  if (isPlainObject(attr)) {
    attr = util_keys(attr);
  }

  return attr[0] ? '[' + attr.join('],[') + ']' : '';
}
/**
 * @param {HTMLFormElement} form
 */

function getFormValues(form) {
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

function getQueryParam(name, current) {
  return new RegExp('[?&]' + name + '=([^&]+)', 'i').test(current || location.search) && decodeURIComponent(RegExp.$1);
}
/**
 * @param {string} name
 * @param {string} value
 * @param {string=} current
 */

function setQueryParam(name, value, current) {
  var re = new RegExp('([?&])' + name + '=[^&]+|(?:\\?)?$', 'i');
  return (current || location.search).replace(re, function (v, a, i, n) {
    return (a || (n[1] ? '&' : '?')) + name + '=' + encodeURIComponent(value);
  });
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

function common_cookie(name, expiry) {
  return {
    get: function get() {
      return getCookie(name);
    },
    set: function set(value) {
      return setCookie(name, value, expiry);
    },
    delete: function _delete() {
      return deleteCookie(name);
    }
  };
}
/**
 * @param {Brew.APIMethod | Brew.APIOptions} options
 * @param {=} extra
 */

function api(options, extra) {
  var httpMethods = 'get post put delete';

  if (typeof options === 'string' && matchWord(options, httpMethods)) {
    extra = extend({}, typeof extra === 'string' ? {
      baseUrl: extra
    } : extra, {
      methods: options
    });
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

        var headers = {
          'Content-Type': 'application/json'
        };

        if (obj.token) {
          headers.Authorization = 'Bearer ' + obj.token;
        }

        return jquery.ajax({
          method: v,
          url: combinePath(obj.baseUrl, method),
          headers: headers,
          dataType: 'json',
          data: JSON.stringify(data || {}),
          success: function success(response) {
            if (isFunction(options.getTokenFromResponse)) {
              obj.token = options.getTokenFromResponse(response, obj.token);
            }
          }
        }).catch(function (e) {
          if (e.status === 0) {
            throw errorWithCode(networkError);
          }

          var response = e.responseJSON;

          if (response) {
            console.error(method + ':', response.error || response.message);
            throw errorWithCode(apiError, response.error || response.message);
          }

          throw errorWithCode(apiError, e.statusText);
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

function getJSON(path) {
  return jquery.getJSON(withBaseUrl(path));
}
/**
 * @param {string | string[]} url
 * @param {{ nomodule?: boolean; module?: boolean }=} options
 */

function loadScript(url, options) {
  if (isArray(url)) {
    return url.reduce(function (v, a) {
      return v.then(function () {
        return loadScript(a, options);
      });
    }, resolve());
  }

  if (!loadScriptCache[url]) {
    loadScriptCache[url] = new promise_polyfill(function (resolve, reject) {
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
        reject(errorWithCode(resourceError));
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

function addStyleSheet(url, media) {
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

function preloadImages(urls, ms) {
  if (!isArray(urls)) {
    var map = {};

    var testValue = function testValue(value) {
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
    urls = util_keys(map);
  }

  var promises = [];
  var preloadUrls = [];
  urls.forEach(function (url) {
    promises.push(preloadImagesCache[url] || (preloadImagesCache[url] = new promise_polyfill(function (resolve) {
      preloadUrls.push(url);
      jquery('<img>').on('load error', function () {
        preloadImagesCache[url] = true;
        resolve();
      }).attr('src', url);
    })));
  });

  if (!promises.length || promises.every(function (v) {
    return v === true;
  })) {
    return resolve();
  }

  if (preloadUrls.length) {
    console.log('Preload image', {
      urls: preloadUrls
    });
  }

  return promise_polyfill.race([delay(ms), resolveAll(values(preloadImagesCache))]);
}
// EXTERNAL MODULE: ./node_modules/lz-string/libs/lz-string.js
var lz_string = __webpack_require__(961);
// CONCATENATED MODULE: ./src/include/external/lz-string.js

var compressToUTF16 = lz_string.compressToUTF16;
var decompressFromUTF16 = lz_string.decompressFromUTF16;
// CONCATENATED MODULE: ./src/util/storage.js
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }



var UNDEFINED = 'undefined';

function isObject(value) {
  return value && _typeof(value) === 'object';
}

function shouldIgnore(obj) {
  return obj === window || is(obj, RegExp) || is(obj, Blob) || is(obj, Node);
}

function createObjectStorage(storage, key) {
  var objectCache = {};
  var objectMap = new WeakMap();
  var dirty = new Set();
  var entries = Object.create(null);
  var serialized = initFromStorage(entries) || ['{}'];
  var emptyIds = map(serialized, function (v, i) {
    return v ? null : i;
  });

  function initFromStorage(entries) {
    try {
      var serialized = decompressFromUTF16(storage.getItem(key)).split('\n');
      extend(entries, JSON.parse(serialized[0] || '{}'));
      return serialized;
    } catch (e) {}
  }

  function getNextId() {
    return emptyIds.length ? emptyIds.shift() : serialized.push('') - 1;
  }

  function cacheObject(id, obj) {
    objectCache[id] = obj;

    if (isObject(obj)) {
      objectMap.set(obj, +id);
    }
  }

  function uncacheObject(id) {
    objectMap.delete(objectCache[id]);
    delete objectCache[id];
  }

  function serialize(obj, visited) {
    var counter = 0;
    return JSON.stringify(obj, function (k, v) {
      if (!isObject(v)) {
        return typeof v === 'string' && v[0] === '#' ? '#' + v : v;
      }

      if (shouldIgnore(v)) {
        return counter ? undefined : {};
      }

      if (!counter++) {
        return v;
      }

      var id = objectMap.get(v) || getNextId();
      cacheObject(id, v);

      if (!visited[id]) {
        visited[id] = true;
        serialized[id] = serialize(v, visited);
        dirty.delete(v);
      }

      return '#' + id;
    });
  }

  function deserialize(str, refs) {
    if (!str || str === UNDEFINED) {
      return;
    }

    return JSON.parse(str, function (k, v) {
      if (typeof v === 'string' && v[0] === '#') {
        v = v.slice(1);

        if (v[0] !== '#') {
          refs.push({
            o: this,
            k: k,
            v: v
          });

          if (!(v in objectCache)) {
            objectCache[v] = null;
            cacheObject(v, deserialize(serialized[v], refs));
          }

          return null;
        }
      }

      return v;
    });
  }

  function _revive(key, callback) {
    var id = entries[key];

    if (id && serialized[id] && !(id in objectCache)) {
      try {
        var refs = [];
        var value = deserialize(serialized[id], refs);
        each(refs, function (i, v) {
          v.o[v.k] = objectCache[v.v];
        });
        cacheObject(id, (callback || pipe)(value));
      } catch (e) {
        serialized[id] = UNDEFINED;
      }
    }

    return objectCache[id];
  }

  function _persist() {
    var visited = {};
    each(dirty, function (i, v) {
      var id = objectMap.get(v);

      if (id) {
        serialized[id] = serialize(v, visited);
      }
    });
    visited = {
      0: true
    };
    each(entries, function visit(_, id) {
      if (!visited[id]) {
        visited[id] = true;
        serialized[id].replace(/[\[:,]"#(\d+)"/g, visit);
      }
    });
    each(serialized, function (i) {
      if (!visited[i] && serialized[i]) {
        serialized[i] = '';
        emptyIds.push(i);
        uncacheObject(i);
      }
    });
    dirty.clear();
    serialized[0] = JSON.stringify(entries);
    storage.setItem(key, compressToUTF16(serialized.join('\n').trim()));
  }

  return {
    keys: function keys() {
      return util_keys(entries);
    },
    has: function has(key) {
      return !!entries[key];
    },
    get: function get(key) {
      return _revive(key);
    },
    revive: function revive(key, callback) {
      uncacheObject(entries[key]);
      return _revive(key, callback);
    },
    set: function set(key, value) {
      var id = entries[key] || (entries[key] = getNextId());

      if (!isObject(value)) {
        serialized[id] = serialize(value) || UNDEFINED;
      } else {
        cacheObject(id, value);
        dirty.add(value);
      }

      setImmediateOnce(_persist);
    },
    persist: function persist(obj) {
      dirty.add(obj);
      setImmediateOnce(_persist);
    },
    delete: function _delete(key) {
      if (entries[key]) {
        delete entries[key];
        setImmediateOnce(_persist);
      }
    },
    clear: function clear() {
      serialized.splice(0, serialized.length, '{}');
      emptyIds.splice(0);
      dirty.clear();
      objectMap = new WeakMap();
      objectCache = {};
      entries = Object.create(null);
      setImmediateOnce(_persist);
    }
  };
}
// CONCATENATED MODULE: ./tmp/zeta-dom/dom.js

var _defaultExport = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom;
/* harmony default export */ const dom = (_defaultExport);
var _zeta$dom = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom,
    textInputAllowed = _zeta$dom.textInputAllowed,
    beginDrag = _zeta$dom.beginDrag,
    beginPinchZoom = _zeta$dom.beginPinchZoom,
    insertText = _zeta$dom.insertText,
    getShortcut = _zeta$dom.getShortcut,
    setShortcut = _zeta$dom.setShortcut,
    focusable = _zeta$dom.focusable,
    focused = _zeta$dom.focused,
    setTabRoot = _zeta$dom.setTabRoot,
    unsetTabRoot = _zeta$dom.unsetTabRoot,
    setModal = _zeta$dom.setModal,
    releaseModal = _zeta$dom.releaseModal,
    retainFocus = _zeta$dom.retainFocus,
    releaseFocus = _zeta$dom.releaseFocus,
    iterateFocusPath = _zeta$dom.iterateFocusPath,
    dom_focus = _zeta$dom.focus,
    dom_blur = _zeta$dom.blur;

// CONCATENATED MODULE: ./src/include/zeta-dom/dom.js


/* harmony default export */ const zeta_dom_dom = (dom);
// CONCATENATED MODULE: ./src/anim.js







var customAnimateIn = {};
var customAnimateOut = {};
var animatingElements = new Map();
var nextId = 0;

function handleAnimation(element, elements, promises, trigger) {
  if (!promises.length) {
    return resolve();
  }

  var id = ++nextId;
  var timeout, timeoutReject, timeoutResolve;
  promises = promises.map(function (v) {
    return v instanceof promise_polyfill ? catchAsync(v) : new promise_polyfill(function (resolve) {
      v.then(resolve, resolve);
    });
  });
  catchAsync(resolveAll(promises, function () {
    clearTimeout(timeout);
    timeoutResolve();
    animatingElements.delete(element);
  }));
  promises.push(new promise_polyfill(function (resolve, reject) {
    timeoutResolve = resolve;
    timeoutReject = reject;
  }));
  timeout = setTimeout(function () {
    timeoutReject(errorWithCode(errorCode_timeout, 'Animation timed out'));
    console.warn('Animation #%i might take longer than expected', id, promises);
    animatingElements.delete(element);
  }, 1500);
  var promise = catchAsync(resolveAll(promises));
  animatingElements.set(element, promise);
  return promise;
}

function animateElement(element, cssClass, eventName, customAnimation) {
  var promises = [runCSSTransition(element, cssClass), zeta_dom_dom.emit(eventName, element)];
  var delay = parseFloat(jquery(element).css('transition-delay')) || 0;
  each(customAnimation, function (i, v) {
    if (element.attributes[i]) {
      var attrValue = element.getAttribute(i);
      promises.push(new promise_polyfill(function (resolve, reject) {
        setTimeout(function () {
          resolveAll(v(element, attrValue)).then(resolve, reject);
        }, delay * 1000);
      }));
    }
  });
  return resolveAll(promises, function () {
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

  filterCallback = filterCallback || function () {
    return true;
  };

  zeta_dom_dom.emit('animationstart', element, {
    animationType: 'in',
    animationTrigger: trigger
  }, true);
  var $innerScope = scope ? jquery(scope, element) : jquery();
  var filter = trigger === 'show' ? ':not([animate-on]), [animate-on~="' + trigger + '"]' : '[animate-on~="' + trigger + '"]';
  var elements = [];
  var promises = [];
  jquery(selectIncludeSelf('[animate-in]', element)).filter(filter).each(function (i, v) {
    // @ts-ignore: filterCallback must be function
    if (!$innerScope.find(v)[0] && filterCallback(v) && isVisible(v)) {
      elements.push(v);
      promises.push(animateElement(v, 'tweening-in', 'animatein', customAnimateIn));
    }
  });
  jquery(selectIncludeSelf('[animate-sequence]', element)).filter(filter).each(function (i, v) {
    // @ts-ignore: filterCallback must be function
    if (!$innerScope.find(v)[0] && filterCallback(v) && isVisible(v)) {
      var selector = v.getAttribute('animate-sequence') || '';
      var type = v.getAttribute('animate-sequence-type') || '';
      var $elements = jquery(v).find(selector[0] === '>' ? selector : jquery(selector));

      if (jquery(v).attr('animate-sequence-reverse') !== undefined) {
        [].reverse.apply($elements);
      }

      $elements.css('transition-duration', '0s');
      $elements.attr('animate-in', type).attr('is-animate-sequence', '');
      $elements.each(function (i, v) {
        if (jquery(v).css('display') === 'inline') {
          // transform cannot apply on inline elements
          jquery(v).css('display', 'inline-block');
        }

        elements.push(v);
        promises.push(new promise_polyfill(function (resolve, reject) {
          setTimeout(function () {
            jquery(v).css('transition-duration', '');
            animateElement(v, 'tweening-in', 'animatein', customAnimateIn).then(resolve, reject);
          }, i * 50);
        }));
      });

      if (!v.attributes['animate-in']) {
        jquery(v).attr('animate-in', '').addClass('tweening-in');
      }
    }
  });
  return handleAnimation(element, elements, promises, trigger).then(function () {
    zeta_dom_dom.emit('animationcomplete', element, {
      animationType: 'in',
      animationTrigger: trigger
    }, true);
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
  filterCallback = filterCallback || function () {
    return true;
  };

  zeta_dom_dom.emit('animationstart', element, {
    animationType: 'out',
    animationTrigger: trigger
  }, true);
  var $innerScope = scope ? jquery(scope, element) : jquery();
  var filter = trigger === 'show' ? ':not([animate-on]), [animate-on~="' + trigger + '"]' : '[animate-on~="' + trigger + '"]';
  var elements = [];
  var promises = []; // @ts-ignore: type inference issue

  var $target = jquery((excludeSelf ? jquery : selectIncludeSelf)('[animate-out]', element)).filter(filter);
  $target.each(function (i, v) {
    // @ts-ignore: filterCallback must be function
    if (!$innerScope.find(v)[0] && filterCallback(v)) {
      elements.push(v);
      promises.push(animateElement(v, 'tweening-out', 'animateout', customAnimateOut));
    }
  });
  return handleAnimation(element, elements, promises, trigger).then(function () {
    // reset animation state after outro animation has finished
    // @ts-ignore: type inference issue
    var $target = jquery((excludeSelf ? jquery : selectIncludeSelf)('[animate-out], .tweening-in, .tweening-out', element));

    if (trigger !== 'show') {
      $target = $target.filter(filter);
    }

    $target = $target.filter(function (i, v) {
      // @ts-ignore: filterCallback must be function
      return filterCallback(v);
    });
    $target.removeClass('tweening-in tweening-out');
    $target.find('[is-animate-sequence]').removeAttr('animate-in').removeClass('tweening-in tweening-out');
    zeta_dom_dom.emit('animationcomplete', element, {
      animationType: 'out',
      animationTrigger: trigger
    }, true);
  });
}
/**
 * @param {string} name
 * @param {(elm: Element, attrValue: string) => Promise<any>} callback
 */

function addAnimateIn(name, callback) {
  customAnimateIn[name] = throwNotFunction(callback);
}
/**
 * @param {string} name
 * @param {(elm: Element, attrValue: string) => Promise<any>} callback
 */

function addAnimateOut(name, callback) {
  customAnimateOut[name] = throwNotFunction(callback);
}
// EXTERNAL MODULE: external "waterpipe"
var external_waterpipe_ = __webpack_require__(160);
// CONCATENATED MODULE: ./src/include/external/waterpipe.js

/* harmony default export */ const waterpipe = (external_waterpipe_); // assign to a new variable to avoid incompatble declaration issue by typescript compiler

var waterpipe_ = external_waterpipe_;

waterpipe_.pipes['{'] = function (_, varargs) {
  var globals = varargs.globals;
  var prev = globals.new;
  var o = {};
  globals.new = o;

  while (varargs.hasArgs()) {
    var key = varargs.raw();

    if (key === '}') {
      break;
    }

    o[String(key).replace(/:$/, '')] = varargs.next();
  }

  globals.new = prev;
  return o;
}; // @ts-ignore: add member to function


waterpipe_.pipes['{'].varargs = true;
// CONCATENATED MODULE: ./tmp/zeta-dom/domLock.js

var domLock_zeta$dom = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom,
    lock = domLock_zeta$dom.lock,
    locked = domLock_zeta$dom.locked,
    cancelLock = domLock_zeta$dom.cancelLock,
    subscribeAsync = domLock_zeta$dom.subscribeAsync,
    notifyAsync = domLock_zeta$dom.notifyAsync,
    preventLeave = domLock_zeta$dom.preventLeave;

// CONCATENATED MODULE: ./src/include/zeta-dom/domLock.js

// CONCATENATED MODULE: ./tmp/zeta-dom/observe.js

var observe_zeta$dom = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom,
    observe = observe_zeta$dom.observe,
    registerCleanup = observe_zeta$dom.registerCleanup,
    createAutoCleanupMap = observe_zeta$dom.createAutoCleanupMap,
    afterDetached = observe_zeta$dom.afterDetached,
    watchElements = observe_zeta$dom.watchElements,
    watchAttributes = observe_zeta$dom.watchAttributes,
    watchOwnAttributes = observe_zeta$dom.watchOwnAttributes;

// CONCATENATED MODULE: ./src/include/zeta-dom/observe.js

// CONCATENATED MODULE: ./src/libCheck.js

var BREW_KEY = '__BREW__';

if (window[BREW_KEY]) {
  throw new Error('Another copy of brew-js is instantiated. Please check your dependencies.');
}

defineHiddenProperty(window, BREW_KEY, true, true);
/* harmony default export */ const libCheck = (null);
// CONCATENATED MODULE: ./src/defaults.js
/** @deprecated @type {Zeta.Dictionary} */
var defaults = {};
/* harmony default export */ const src_defaults = (defaults);
// CONCATENATED MODULE: ./src/app.js






var root = zeta_dom_dom.root;
var featureDetections = {};
var dependencies = {};
var extensions = {};
var initList = [];
/** @type {Brew.AppInstance} */

var app;
/** @type {boolean} */

var appReady;
/** @type {boolean} */

var appInited;
/** @type {Promise<void> & Zeta.Deferrable} */

var appInit;
var setReadyState;

function exactTargetWrapper(handler) {
  return function (e) {
    if (e.target === e.context) {
      return handler.apply(this, arguments);
    }
  };
}

function wrapEventHandlers(event, handler, noChildren) {
  if (isPlainObject(event)) {
    return noChildren ? mapObject(event, exactTargetWrapper) : event;
  }

  if (noChildren) {
    handler = exactTargetWrapper(handler);
  }

  return (event.indexOf(' ') >= 0 ? fill : kv)(event, handler);
}

function initExtension(app, name, deps, options, callback) {
  deps = grep(deps, function (v) {
    return !extensions[v.replace(/^\?/, '')];
  });
  var counter = deps.length || 1;

  var wrapper = function wrapper(loaded) {
    if (!counter) {
      throw new Error('Extension' + name + 'is already initiated');
    }

    if (loaded && ! --counter) {
      extensions[name] = true;
      callback(app, options || {});

      if (dependencies[name]) {
        combineFn(dependencies[name].splice(0))(true);
      }
    }
  };

  if (deps[0]) {
    each(deps, function (i, v) {
      var key = v.replace(/^\?/, '');
      var arr = dependencies[key] || (dependencies[key] = []);
      arr.push(key === v ? wrapper : wrapper.bind(0, true));
    });
  } else {
    wrapper(true);
  }
}

function defineUseMethod(name, deps, callback) {
  var method = camel('use-' + name);
  definePrototype(App, kv(method, function (options) {
    initExtension(this, name, deps, options, callback);
  }));
}

function App() {
  var self = this;
  defineOwnProperty(self, 'element', root, true);
  defineOwnProperty(self, 'ready', new Promise(function (resolve) {
    self.on('ready', resolve.bind(0, self));
  }), true);
  setReadyState = defineObservableProperty(self, 'readyState', 'init', true);
}

definePrototype(App, {
  emit: function emit(event, element, data, bubbles) {
    if (!is(element, Node)) {
      bubbles = data;
      data = element;
      element = this.element;
    }

    return zeta_dom_dom.emit(event, element, data, bubbles);
  },
  define: function define(props) {
    util_define(this, props);
  },
  beforeInit: function beforeInit(promise) {
    if (isFunction(promise)) {
      promise = makeAsync(promise).call(this);
    }

    appInit.waitFor(promise.then(null, function (error) {
      console.error('Failed to initialize', error);
      setReadyState('error');
    }));
  },
  isElementActive: function isElementActive() {
    return true;
  },
  detect: function detect(names, callback) {
    var app = this;
    var supports = {};
    each(names, function (i, v) {
      if (featureDetections[v]) {
        supports[v] = isFunction(featureDetections[v]) ? featureDetections[v] = resolveAll(featureDetections[v]()).catch(function (e) {
          console.warn('Detection for ' + v + ' has thrown exception:', e);
          return false;
        }) : featureDetections[v];
      }
    });
    this.beforeInit(resolveAll(supports, function (supports) {
      supports = Object.freeze(extend({}, app.supports, supports));

      util_define(app, {
        supports: supports
      });

      return isFunction(callback) && callback(supports);
    }));
  },
  when: function when(value, callback) {
    this.beforeInit(resolveAll(value, function (value) {
      if (value) {
        return callback();
      }
    }));
  },
  on: function on(target, event, handler, noChildren) {
    if (isFunction(event)) {
      noChildren = handler;
      handler = event;
      event = target;
      target = root;
    }

    var handlers = wrapEventHandlers(event, handler, (noChildren || handler) === true);

    if (!is(target, Node)) {
      return combineFn(jquery(target).get().map(function (v) {
        return zeta_dom_dom.on(v, handlers);
      }));
    }

    return zeta_dom_dom.on(target, handlers);
  },
  matchElement: noop,
  beforeUpdate: noop
});
watchable(App.prototype);
var defaultApp = new App();
app = {
  on: defaultApp.on.bind(defaultApp)
};

function init(callback) {
  throwNotFunction(callback);

  if (appInit) {
    throw new Error('brew() can only be called once');
  }

  appInit = deferrable(zeta_dom_dom.ready);
  app = defaultApp;
  each(src_defaults, function (i, v) {
    var fn = v && isFunction(app[camel('use-' + i)]);

    if (fn) {
      fn.call(app, v);
    }
  });
  each(initList, function (i, v) {
    if (isPlainObject(v)) {
      util_define(app, v);
    } else {
      throwNotFunction(v)(app);
    }
  });
  app.beforeInit(makeAsync(callback)(app));
  each(dependencies, function (i, v) {
    combineFn(v)();
  });
  appInited = true;
  notifyAsync(root, appInit);
  appInit.then(function () {
    if (app.readyState === 'init') {
      appReady = true;
      setReadyState('ready');
      app.emit('ready');
    }
  });
  return app;
}

util_define(init, {
  with: function _with() {
    initList.push.apply(initList, arguments);
    return this;
  }
});

function install(name, callback) {
  defineUseMethod(name, [], throwNotFunction(callback));
}
function addExtension(autoInit, name, deps, callback) {
  callback = throwNotFunction(callback || deps || name);
  deps = isArray(deps) || isArray(name) || [];
  return function (app) {
    if (autoInit === true) {
      initExtension(app, name, deps, {}, callback);
    } else {
      defineUseMethod(autoInit, deps, callback);
    }
  };
}
function addDetect(name, callback) {
  featureDetections[name] = throwNotFunction(callback);
}
function isElementActive(element) {
  return !app || app.isElementActive(element);
}
/* harmony default export */ const src_app = (init);
// CONCATENATED MODULE: ./src/domAction.js












var SELECTOR_DISABLED = '[disabled],.disabled,:disabled';
var domAction_root = zeta_dom_dom.root;
var flyoutStates = createAutoCleanupMap(function (element, state) {
  state.resolve();
});
var executedAsyncActions = new Map();
/** @type {Zeta.Dictionary<Zeta.AnyFunction>} */

var asyncActions = {};

function disableEvent(e) {
  e.preventDefault();
  e.stopImmediatePropagation();
}

function isSameWindow(target) {
  return !target || target === '_self' || target === window.name;
}
/**
 * @param {string} attr
 * @param {(this: Element, e: JQuery.UIEventBase) => Brew.PromiseOrEmpty} callback
 */


function addAsyncAction(attr, callback) {
  asyncActions[attr] = throwNotFunction(callback);
}
function isFlyoutOpen(selector) {
  var state = flyoutStates.get(jquery(selector)[0]);
  return !!state && !state.closePromise;
}
/**
 * @param {Element | string=} flyout
 * @param {any=} value
 */

function closeFlyout(flyout, value) {
  /** @type {Element[]} */
  // @ts-ignore: type inference issue
  var elements = jquery(flyout || '[is-flyout].open').get();
  return resolveAll(elements.map(function (v) {
    var state = flyoutStates.get(v);

    if (!state) {
      return resolve();
    }

    var promise = state.closePromise;

    if (!promise) {
      releaseModal(v);
      releaseFocus(v);
      state.resolve(value);

      if (state.source) {
        setClass(state.source, 'target-opened', false);
      }

      promise = resolveAll([runCSSTransition(v, 'closing'), hasAttr(v, 'animate-out') && animateOut(v, 'open')]);
      promise = always(promise, function () {
        if (flyoutStates.get(v) === state) {
          flyoutStates.delete(v);
          setClass(v, {
            open: false,
            closing: false,
            visible: false
          });
          zeta_dom_dom.emit('flyouthide', v);
        }
      });
      state.closePromise = promise;
    }

    return promise;
  }));
}
function toggleFlyout(selector, source) {
  return openFlyout(selector, null, source, true);
}
/**
 * @param {string} selector
 * @param {any=} states
 * @param {Element=} source
 * @param {(Zeta.Dictionary | boolean)=} options
 */

function openFlyout(selector, states, source, options) {
  var element = jquery(selector)[0];

  if (!element) {
    return reject();
  }

  if (is(states, Node) || isPlainObject(source)) {
    options = source;
    source = states;
    states = null;
  }

  var prev = flyoutStates.get(element);

  if (prev && !prev.closePromise) {
    if (options === true) {
      // @ts-ignore: can accept if no such property
      closeFlyout(element, source && waterpipe.eval('`' + source.value));
    } else {
      // @ts-ignore: extended app property
      prev.path = app.path;
    }

    return prev.promise;
  }

  options = extend({
    focus: !source || !textInputAllowed(source),
    tabThrough: hasAttr(element, 'tab-through'),
    modal: hasAttr(element, 'is-modal')
  }, options);
  var focusFriend = source;

  if (!focusFriend && !focusable(element)) {
    focusFriend = zeta_dom_dom.modalElement;
  }

  var resolve;
  var promise = new promise_polyfill(function (resolve_) {
    resolve = resolve_;
  });
  flyoutStates.set(element, {
    source: source,
    promise: promise,
    resolve: resolve,
    // @ts-ignore: extended app property
    path: app.path
  });

  if (focusFriend) {
    retainFocus(focusFriend, element);
  }

  if (source) {
    setClass(source, 'target-opened', true);
  }

  if (states && app.setVar) {
    app.setVar(element, states);
  }

  setClass(element, {
    visible: true,
    closing: false
  });
  promise_polyfill.allSettled([runCSSTransition(element, 'open'), animateIn(element, 'open')]).then(function () {
    if (options.focus !== false && !focused(element)) {
      dom_focus(element);
    }
  });

  if (options.modal) {
    setModal(element);
  }

  if (options.tabThrough) {
    unsetTabRoot(element);
  } else {
    setTabRoot(element);
  }

  var closeHandler = function closeHandler(e) {
    var swipeDismiss = element.getAttribute('swipe-dismiss');

    if (e.type === 'focusout' ? !swipeDismiss && options.closeOnBlur !== false : e.data === camel('swipe-' + swipeDismiss)) {
      closeFlyout(element);

      if (zeta_dom_dom.event) {
        zeta_dom_dom.event.preventDefault();
      }

      e.handled();
    }
  };

  always(promise, combineFn(zeta_dom_dom.on(source || element, 'focusout', closeHandler), zeta_dom_dom.on(element, 'gesture', closeHandler)));
  zeta_dom_dom.emit('flyoutshow', element);
  return promise;
}
zeta_dom_dom.ready.then(function () {
  watchElements(domAction_root, '[tab-root]', function (addedNodes, removedNodes) {
    addedNodes.forEach(setTabRoot);
    removedNodes.forEach(unsetTabRoot);
  }, true);
  app.on('mounted', function (e) {
    var selector = selectorForAttr(asyncActions);

    if (selector) {
      jquery(selectIncludeSelf(selector, e.target)).attr('async-action', '');
    }
  });
  app.on('beforepageload', function () {
    flyoutStates.forEach(function (v, i) {
      if (v.path && v.path !== app.path) {
        closeFlyout(i);
      }
    });
  });
  /**
   * @param {JQuery.UIEventBase} e
   */

  function handleAsyncAction(e) {
    var element = e.currentTarget;

    if (matchSelector(element, SELECTOR_DISABLED)) {
      mapRemove(executedAsyncActions, element);
      disableEvent(e);
      return;
    }

    var executed = mapGet(executedAsyncActions, element, Array);
    var callback = null;

    var next = function next(_next) {
      if (focusable(element)) {
        _next(e);
      } else {
        mapRemove(executedAsyncActions, element);
      }
    };

    each(asyncActions, function (i, v) {
      if (element.attributes[i] && executed.indexOf(v) < 0) {
        callback = v;
        return false;
      }
    });

    if (!callback) {
      executedAsyncActions.delete(element);
    } else {
      executed.push(callback);
      var returnValue = callback.call(element, e);

      if (!e.isImmediatePropagationStopped()) {
        if (isThenable(returnValue)) {
          disableEvent(e);
          notifyAsync(element, returnValue);
          returnValue.then(function () {
            next(dispatchDOMMouseEvent);
          }, function (e) {
            executedAsyncActions.delete(element);
            console.warn('Action threw an error:', e);
          });
        } else {
          next(handleAsyncAction);
        }
      }
    }
  }

  watchElements(domAction_root, '[async-action]', function (added, removed) {
    jquery(added).on('click', handleAsyncAction);
    jquery(removed).off('click', handleAsyncAction);
  });
  jquery('body').on('submit', 'form:not([action])', function (e) {
    e.preventDefault();
  });
  jquery('body').on('click', SELECTOR_DISABLED, disableEvent);
  jquery('body').on('click', 'a[href]:not([download]), [data-href]', function (e) {
    if (e.isDefaultPrevented()) {
      return;
    }

    var self = e.currentTarget;
    var href = (self.origin === location.origin ? '' : self.origin) + self.pathname + self.search + self.hash;
    var dataHref = self.getAttribute('data-href');
    e.stopPropagation();

    if (!isSameWindow(self.target)) {
      return;
    }

    if ('navigate' in app && (dataHref || app.isAppPath(href))) {
      e.preventDefault();
      app.navigate(dataHref || app.fromHref(href));
    } else if (locked(domAction_root)) {
      e.preventDefault();
      cancelLock(domAction_root).then(function () {
        var features = grep([matchWord(self.rel, 'noreferrer'), matchWord(self.rel, 'noopener')], pipe);
        window.open(dataHref || href, '_self', features.join(','));
      });
    }
  });
});
// CONCATENATED MODULE: ./tmp/zeta-dom/events.js

var ZetaEventContainer = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.EventContainer;

// CONCATENATED MODULE: ./src/include/zeta-dom/events.js

// CONCATENATED MODULE: ./src/directive.js





var emitter = new ZetaEventContainer();

function Component(element) {
  defineOwnProperty(this, 'element', element, true);
}

function ComponentContext() {}

definePrototype(ComponentContext, {
  on: function on(event, handler) {
    return emitter.add(this, event, handler);
  }
});
function getDirectiveComponent(element) {
  return new Component(element);
}
function registerDirective(key, selector, options) {
  var map = new WeakMap();
  var collect = watchElements(zeta_dom_dom.root, selector, function (added, removed) {
    each(removed, function (i, v) {
      emitter.emit('destroy', mapRemove(map, v).context);
    });
    each(added, function (i, v) {
      var context = new ComponentContext();
      map.set(v, {
        component: options.component(v, context),
        context: context
      });
    });
  }, true);
  defineGetterProperty(Component.prototype, key, function () {
    var element = this.element;

    if (!map.has(element) && matchSelector(element, selector)) {
      collect();
    }

    return (map.get(element) || '').component || null;
  });
}
// CONCATENATED MODULE: ./src/extension/i18n.js




function toDictionary(languages) {
  if (languages) {
    var dict = {};
    each(languages, function (i, v) {
      var key = v.toLowerCase();
      dict[key] = v;

      if (key.indexOf('-') > 0) {
        dict[key.split('-')[0]] = v;
      }
    });
    return dict;
  }
}

function getCanonicalValue(languages, value) {
  if (languages && value) {
    return languages[value.toLowerCase()];
  }

  return value;
}

function detectLanguage(languages, defaultLanguage) {
  var userLanguages = navigator.languages || [navigator.language || ''];

  if (!languages) {
    return userLanguages[0];
  }

  userLanguages = toDictionary(userLanguages);

  if (isArray(languages)) {
    languages = toDictionary(languages);
  }

  return single(userLanguages, function (v, i) {
    return languages[i];
  }) || defaultLanguage || util_keys(languages)[0];
}

/* harmony default export */ const i18n = (addExtension('i18n', function (app, options) {
  var languages = toDictionary(options.languages);
  var routeParam = app.route && options.routeParam;

  var cookie = options.cookie && common_cookie(options.cookie, 86400000);

  var language = getCanonicalValue(languages, routeParam && app.route[routeParam]) || getCanonicalValue(languages, cookie && cookie.get()) || (options.detectLanguage !== false ? detectLanguage : getCanonicalValue)(languages, options.defaultLanguage);

  var setLanguage = function setLanguage(newLangauge) {
    app.language = newLangauge;
  };

  defineObservableProperty(app, 'language', language, function (newLangauge) {
    newLangauge = getCanonicalValue(languages, newLangauge) || language;

    if (cookie) {
      cookie.set(newLangauge);
    }

    if (routeParam && appReady) {
      app.route.replace(routeParam, newLangauge.toLowerCase());
    }

    if (language !== newLangauge) {
      language = newLangauge;

      if (options.reloadOnChange) {
        location.reload();
      }
    }

    return language;
  });
  app.define({
    setLanguage: setLanguage,
    detectLanguage: detectLanguage
  });

  if (routeParam) {
    app.route.watch(routeParam, setLanguage);
    app.on('ready', function () {
      app.route.replace(routeParam, language.toLowerCase());
    });
  }
}));
// CONCATENATED MODULE: ./src/extension/scrollable.js







var SELECTOR_SCROLLABLE = '[scrollable]';
var SELECTOR_TARGET = '[scrollable-target]';
/* harmony default export */ const scrollable = (addExtension('scrollable', function (app, defaultOptions) {
  defaultOptions = extend({
    bounce: false
  }, defaultOptions); // @ts-ignore: non-standard member

  var DOMMatrix = window.DOMMatrix || window.WebKitCSSMatrix || window.MSCSSMatrix;

  function initScrollable(container, context) {
    var dir = container.getAttribute('scrollable');
    var paged = container.getAttribute('scroller-snap-page') || '';
    var varname = container.getAttribute('scroller-state') || '';
    var selector = container.getAttribute('scroller-page') || '';
    var persistScroll = container.hasAttribute('persist-scroll');
    var savedOffset = {};
    var cleanup = [];
    var scrolling = false;
    var needRefresh = false;
    var isControlledScroll;
    var currentIndex = 0; // @ts-ignore: signature ignored

    var scrollable = jquery.scrollable(container, extend({}, defaultOptions, {
      handle: matchWord(dir, 'auto scrollbar content') || 'content',
      hScroll: !matchWord(dir, 'y-only'),
      vScroll: !matchWord(dir, 'x-only'),
      content: '[scrollable-target]:not(.disabled)',
      pageItem: selector,
      snapToPage: paged === 'always' || paged === app.orientation
    }));
    cleanup.push(function () {
      scrollable.destroy();
    });
    cleanup.push(zeta_dom_dom.on(container, {
      drag: function drag() {
        beginDrag();
      },
      getContentRect: function getContentRect(e) {
        if (e.target === container || containsOrEquals(container, jquery(e.target).closest(SELECTOR_TARGET)[0])) {
          var padding = scrollable.scrollPadding(e.target);
          return getRect(container).expand(-padding.left, -padding.top, padding.right, padding.bottom);
        }
      },
      scrollBy: function scrollBy(e) {
        var result = scrollable.scrollBy(e.x, e.y, 200);
        return {
          x: result.deltaX,
          y: result.deltaY
        };
      }
    }));

    function getItem(index) {
      return selector && jquery(selector, container).get()[index];
    }

    function setState(index) {
      var oldIndex = currentIndex;
      currentIndex = index;

      if (varname && app.setVar) {
        app.setVar(container, varname, index);
      }

      if (oldIndex !== index) {
        app.emit('scrollIndexChange', container, {
          oldIndex: oldIndex,
          newIndex: index
        }, true);
      }
    }

    function scrollTo(index, align) {
      var item = getItem(index);
      align = align || 'center top';

      if (!scrolling && isVisible(container) && item) {
        scrolling = true;
        isControlledScroll = true;
        setState(index);
        scrollable.scrollToElement(item, align, align, 200, function () {
          scrolling = false;
          isControlledScroll = false;
        });
      }
    }

    function refresh() {
      var isPaged = paged === 'always' || paged === app.orientation;

      if (isPaged && isVisible(container)) {
        if (scrolling) {
          needRefresh = true;
        } else {
          needRefresh = false;
          scrollTo(currentIndex);
        }
      }
    }

    if (selector) {
      if (paged !== 'always') {
        cleanup.push(app.on('orientationchange', function () {
          scrollable.setOptions({
            snapToPage: paged === app.orientation
          });
        }));
      }

      cleanup.push(app.on(container, {
        statechange: function statechange(e) {
          var newIndex = e.data[varname];

          if (!scrolling) {
            if ((getRect(getItem(newIndex)).width | 0) > (getRect().width | 0)) {
              scrollTo(newIndex, 'left center');
            } else {
              scrollTo(newIndex);
            }
          }
        },
        scrollMove: function scrollMove(e) {
          scrolling = true;

          if (!isControlledScroll) {
            setState(e.pageIndex);
          }
        },
        scrollStop: function scrollStop(e) {
          setState(e.pageIndex);
          scrolling = false;

          if (needRefresh) {
            refresh();
          }
        }
      }, true));
      var timeout;
      cleanup.push(bind(window, 'resize', function () {
        clearTimeout(timeout);
        timeout = setTimeout(refresh, 200);
      }));
    }

    if (persistScroll) {
      var hasAsync = false;

      var restoreScroll = function restoreScroll() {
        var offset = savedOffset[history.state];

        if (offset) {
          scrollable.scrollTo(offset.x, offset.y, 0);
        }
      };

      cleanup.push(zeta_dom_dom.on('asyncStart', function () {
        hasAsync = true;
      }), zeta_dom_dom.on('asyncEnd', function () {
        hasAsync = false;
        restoreScroll();
      }), app.on(container, 'scrollStart', function (e) {
        if (e.source !== 'script') {
          delete savedOffset[history.state];
        }
      }, true), app.on('navigate', function (e) {
        savedOffset[e.oldStateId] = {
          x: scrollable.scrollLeft(),
          y: scrollable.scrollTop()
        };
        setTimeout(function () {
          if (!hasAsync) {
            restoreScroll();
          }
        });
      }));
    }

    context.on('destroy', combineFn(cleanup));
    scrollable[focusable(container) ? 'enable' : 'disable']();
    return scrollable;
  }

  registerDirective('scrollable', SELECTOR_SCROLLABLE, {
    component: initScrollable
  });
  jquery.scrollable.hook({
    scrollStart: function scrollStart(e) {
      app.emit('scrollStart', this, e, true);
    },
    scrollMove: function scrollMove(e) {
      app.emit('scrollMove', this, e, true);
    },
    scrollEnd: function scrollEnd(e) {
      app.emit('scrollStop', this, e, true);
    },
    scrollProgressChange: function scrollProgressChange(e) {
      app.emit('scrollProgressChange', this, e, true);
    }
  }); // update scroller on events other than window resize

  function refresh() {
    jquery(SELECTOR_SCROLLABLE).scrollable('refresh');
  }

  app.on('statechange orientationchange animationcomplete', function () {
    setTimeoutOnce(refresh);
  });
  app.on('pageenter', function (e) {
    var $scrollables = jquery(selectIncludeSelf(SELECTOR_SCROLLABLE, e.target)).add(jquery(e.target).parents(SELECTOR_SCROLLABLE));
    jquery(selectIncludeSelf(SELECTOR_TARGET, e.target)).each(function (i, v) {
      jquery(v).toggleClass('disabled', !isElementActive(v));
    });
    $scrollables.scrollable('refresh');
    $scrollables.filter(':not([keep-scroll-offset])').scrollable('scrollTo', 0, 0);
  }); // scroll-into-view animation trigger

  function updateScrollIntoView() {
    jquery('[animate-on~="scroll-into-view"]').filter(':visible').each(function (i, v) {
      var m = new DOMMatrix(getComputedStyle(v).transform);
      var rootRect = getRect(zeta_dom_dom.root);
      var thisRect = getRect(v);
      var isInView = rectIntersects(rootRect, thisRect.translate(-m.e || 0, 0)) || rectIntersects(rootRect, thisRect.translate(0, -m.f || 0)); // @ts-ignore: boolean arithmetics

      if (isInView ^ getClass(v, 'tweening-in') && (isInView || v.attributes['animate-out'])) {
        (isInView ? animateIn : animateOut)(v, 'scroll-into-view');
      }
    });
  }

  app.on('resize pageenter statechange scrollMove orientationchange', function () {
    setTimeoutOnce(updateScrollIntoView);
  });
  zeta_dom_dom.on('modalchange', function () {
    jquery(SELECTOR_SCROLLABLE).each(function (i, v) {
      jquery(v).scrollable(focusable(v) ? 'enable' : 'disable');
    });
  });
  zeta_dom_dom.on('keystroke', function (e) {
    var originalEvent = zeta_dom_dom.event;

    if (zeta_dom_dom.modalElement && originalEvent && originalEvent.target === document.body && matchWord(e.data, 'space pageUp pageDown leftArrow rightArrow upArrow downArrow')) {
      var target = selectIncludeSelf(SELECTOR_SCROLLABLE, zeta_dom_dom.modalElement)[0];

      if (target) {
        jquery(target).triggerHandler(jquery.Event('keydown', {
          keyCode: originalEvent.keyCode
        }));
      }
    }
  });
}));
// CONCATENATED MODULE: ./tmp/zeta-dom/env.js

var IS_IOS = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.IS_IOS,
    IS_IE10 = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.IS_IE10,
    IS_IE = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.IS_IE,
    IS_MAC = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.IS_MAC,
    IS_TOUCH = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.IS_TOUCH;

// CONCATENATED MODULE: ./src/include/zeta-dom/env.js

// CONCATENATED MODULE: ./src/extension/viewport.js







/* harmony default export */ const viewport = (addExtension(true, 'viewport', function (app) {
  var setOrientation = defineObservableProperty(app, 'orientation', '', true);
  var visualViewport = window.visualViewport;
  var useAvailOrInner = IS_TOUCH && navigator.platform !== 'MacIntel';
  var aspectRatio, viewportWidth, viewportHeight;

  function checkViewportSize(triggerEvent) {
    if (visualViewport) {
      viewportWidth = visualViewport.width;
      viewportHeight = visualViewport.height;
    } else {
      var availWidth = screen.availWidth;
      var availHeight = screen.availHeight;
      viewportWidth = useAvailOrInner ? availWidth : document.body.offsetWidth;
      viewportHeight = useAvailOrInner ? availWidth === window.innerWidth ? availHeight : window.innerHeight : document.body.offsetHeight;
    }

    var previousAspectRatio = aspectRatio;
    aspectRatio = viewportWidth / viewportHeight;
    setOrientation(aspectRatio >= 1 ? 'landscape' : 'portrait');

    if (triggerEvent !== false) {
      app.emit('resize', {
        aspectRatio: aspectRatio,
        viewportWidth: viewportWidth,
        viewportHeight: viewportHeight
      });

      if (either(aspectRatio >= 1, previousAspectRatio >= 1)) {
        app.emit('orientationchange', {
          orientation: app.orientation
        });
      }
    }
  }

  util_define(app, {
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
    animateIn(zeta_dom_dom.root, 'orientationchange');
  });

  if (visualViewport) {
    bind(visualViewport, 'resize', checkViewportSize);
    checkViewportSize(false);
  } else {
    jquery(window).on('resize', function () {
      setTimeoutOnce(checkViewportSize);
    });
    jquery(function () {
      checkViewportSize(false);
    });
  }
}));
// CONCATENATED MODULE: ./src/extension/router.js
function router_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { router_typeof = function _typeof(obj) { return typeof obj; }; } else { router_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return router_typeof(obj); }











var _ = createPrivateStore();

var mapProto = Map.prototype;
var parsedRoutes = {};
var router_root = zeta_dom_dom.root;
var states = [];
var router_baseUrl;
var storage;

var constant = function constant(value) {
  return pipe.bind(0, value);
};

var isAppPath = function isAppPath(path) {
  return !!isSubPathOf(path, router_baseUrl);
};

var fromPathname = function fromPathname(path) {
  return isSubPathOf(path, router_baseUrl) || '/';
};

var toPathname = function toPathname(path) {
  return combinePath(router_baseUrl, path);
};

var fromRoutePath = pipe;
var toRoutePath = pipe;
function matchRoute(route, segments, ignoreExact) {
  if (!route || !route.test) {
    route = parseRoute(route);
  }

  if (!isArray(segments)) {
    segments = toSegments(segments);
  }

  return route.test(segments, ignoreExact);
}

function getCurrentQuery() {
  return location.search + location.hash;
}

function getCurrentPathAndQuery() {
  return location.pathname + getCurrentQuery();
}

function HistoryStorage(obj) {
  var map = new Map(obj && Object.entries(obj));
  Object.setPrototypeOf(map, HistoryStorage.prototype);
  return map;
}

function stringOrSymbol(key) {
  return router_typeof(key) === 'symbol' ? key : String(key);
}

definePrototype(HistoryStorage, Map, {
  has: function has(k) {
    return mapProto.has.call(this, stringOrSymbol(k));
  },
  get: function get(k) {
    return mapProto.get.call(this, stringOrSymbol(k));
  },
  set: function set(k, v) {
    var self = this;
    k = stringOrSymbol(k);

    if (self.get(k) !== v) {
      storage.persist(self);
    }

    return mapProto.set.call(self, k, v);
  },
  delete: function _delete(k) {
    var self = this;
    var result = mapProto.delete.call(self, stringOrSymbol(k));

    if (result) {
      storage.persist(self);
    }

    return result;
  },
  clear: function clear() {
    var self = this;
    mapProto.clear.call(self);
    storage.persist(self);
  },
  toJSON: function toJSON() {
    return Object.fromEntries(this.entries());
  }
});

function RoutePattern(props) {
  extend(this, props);
}

definePrototype(RoutePattern, Array, {
  has: function has(name) {
    return name in this.params;
  },
  match: function match(index, value) {
    if (typeof index === 'string') {
      index = this.params[index];
    }

    var part = this[index];
    return !!part && (part.name ? part.test(value) : iequal(part, value));
  },
  test: function test(segments, ignoreExact) {
    var self = this;
    return segments.length >= self.minLength && (ignoreExact || !self.exact || segments.length <= self.length) && !any(self, function (v, i) {
      return segments[i] && !(v.name ? v.test(segments[i]) : iequal(segments[i], v));
    });
  }
});

function parseRoute(path) {
  path = String(path);

  if (!parsedRoutes[path]) {
    var tokens = new RoutePattern();
    var params = {};
    var minLength;
    path.replace(/\/(\*|[^{][^\/]*|\{([a.-z_$][a-z0-9_$]*)(\?)?(?::(?![*+?])((?:(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])([*+?]|\{\d+(?:,\d+)\})?)+))?\})(?=\/|$)/gi, function (v, a, b, c, d) {
      if (c && !minLength) {
        minLength = tokens.length;
      }

      if (b) {
        var re = d ? new RegExp('^' + d + '$', 'i') : /./;
        params[b] = tokens.length;
        tokens.push({
          name: b,
          test: re.test.bind(re)
        });
      } else {
        tokens.push(a.toLowerCase());
      }
    });
    extend(tokens, {
      pattern: path,
      params: params,
      exact: !(tokens[tokens.length - 1] === '*' && tokens.splice(-1)),
      minLength: minLength || tokens.length
    });
    parsedRoutes[path] = deepFreeze(tokens);
  }

  return parsedRoutes[path];
}

function createRouteState(route, segments, params) {
  route = route || [];
  segments = segments.map(encodeURIComponent);
  return {
    route: route,
    params: exclude(params, ['remainingSegments']),
    minPath: normalizePath(segments.slice(0, route.minLength).join('/')),
    maxPath: normalizePath(segments.slice(0, route.length).join('/'))
  };
}

function matchRouteByParams(routes, params, partial) {
  var matched = single(routes, function (tokens) {
    var valid = single(tokens.params, function (v, i) {
      return params[i] !== null;
    });

    if (valid && !partial) {
      valid = !single(params, function (v, i) {
        return v && i !== 'remainingSegments' && !tokens.has(i);
      });
    }

    if (!valid) {
      return;
    }

    var segments = [];

    for (var i = 0, len = tokens.length; i < len; i++) {
      var varname = tokens[i].name;

      if (varname && !tokens[i].test(params[varname] || '')) {
        if (i < tokens.minLength || params[varname]) {
          return false;
        }

        break;
      }

      segments[i] = varname ? params[varname] : tokens[i];
    }

    return createRouteState(tokens, segments, pick(params, util_keys(tokens.params)));
  });
  return matched || !partial && matchRouteByParams(routes, params, true);
}

function Route(app, routes, initialPath) {
  var self = this;
  var params = {};

  var state = _(self, {
    routes: routes.map(parseRoute),
    params: params,
    app: app
  });

  each(state.routes, function (i, v) {
    each(v.params, function (i) {
      params[i] = null;
    });
  });
  extend(self, params, self.parse(initialPath));
  state.current = state.lastMatch;
  state.handleChanges = watch(self, true);
  Object.preventExtensions(self);
  Object.getOwnPropertyNames(self).forEach(function (prop) {
    defineObservableProperty(self, prop, null, function (v) {
      return isUndefinedOrNull(v) || v === '' ? null : String(v);
    });
  });
  watch(self, function () {
    var current = state.lastMatch;

    if (!equal(current.params, exclude(self, ['remainingSegments']))) {
      current = matchRouteByParams(state.routes, self) || state.current;
    }

    var remainingSegments = current.route.exact ? '/' : normalizePath(self.remainingSegments);
    var newPath = fromRoutePath(combinePath(current.maxPath, remainingSegments));
    state.current = current;
    self.set(extend({}, state.params, current.params, {
      remainingSegments: remainingSegments
    }));

    if (!iequal(newPath, removeQueryAndHash(app.path))) {
      app.path = newPath;
    }
  });
}

definePrototype(Route, {
  parse: function parse(path) {
    var self = this;

    var state = _(self);

    var segments = toSegments(toRoutePath(removeQueryAndHash(path)));
    var matched = any(state.routes, function (tokens) {
      return matchRoute(tokens, segments, true);
    });
    var params = {};

    if (matched) {
      for (var i in state.params) {
        params[i] = segments[matched.params[i]] || null;
      }

      params.remainingSegments = matched.exact ? '/' : normalizePath(segments.slice(matched.length).join('/'));
    }

    state.lastMatch = createRouteState(matched, segments, params);
    return params;
  },
  set: function set(params) {
    var self = this;

    if (typeof params === 'string') {
      if (iequal(params, self.toString())) {
        return;
      }

      params = self.parse(params);
    }

    _(self).handleChanges(function () {
      extend(self, params);
    });
  },
  replace: function replace(key, value) {
    var self = this;
    var result;

    _(self).handleChanges(function () {
      var path = self.getPath(extend(self, isPlainObject(key) || kv(key, value)));
      result = _(self).app.navigate(path + (path === self.toString() ? getCurrentQuery() : ''), true);
    });

    return result;
  },
  getPath: function getPath(params) {
    var matched = matchRouteByParams(_(this).routes, params);
    return fromRoutePath(matched ? combinePath(matched.maxPath || '/', matched.route.exact ? '/' : params.remainingSegments) : '/');
  },
  toJSON: function toJSON() {
    return extend({}, this);
  },
  toString: function toString() {
    // @ts-ignore: unable to infer this
    return fromRoutePath(combinePath(_(this).current.maxPath || '/', this.remainingSegments));
  }
});
watchable(Route.prototype);

function PageInfo(props) {
  for (var i in props) {
    defineOwnProperty(this, i, props[i], true);
  }
}

function pageInfoForEachState(self, callback) {
  var pageId = self.pageId;
  each(states, function (i, v) {
    if (v.pageId === pageId) {
      callback(v);
    }
  });
}

definePrototype(PageInfo, {
  clearNavigateData: function clearNavigateData() {
    pageInfoForEachState(this, function (v) {
      v.data = null;
    });
    storage.persist(states);
    defineOwnProperty(this, 'data', null, true);
  },
  clearHistoryStorage: function clearHistoryStorage() {
    pageInfoForEachState(this, function (v) {
      v.storage.clear();
    });
  }
});
/**
 * @param {Brew.AppInstance<Brew.WithRouter>} app
 * @param {Record<string, any>} options
 */

function configureRouter(app, options) {
  var sessionId = randomId();
  var resumedId = sessionId;
  var route;
  var basePath = '/';
  var currentPath = '';
  var redirectSource = {};
  var currentIndex = 0;
  var indexOffset = 0;
  var pendingState;
  var lastState = {};
  var pageInfos = {};

  function getPersistedStorage(key, ctor) {
    return storage.revive(key, ctor) || mapGet(storage, key, ctor);
  }

  function createNavigateResult(id, path, originalPath, navigated) {
    return Object.freeze({
      id: id,
      path: path,
      navigated: navigated !== false,
      redirected: !!originalPath,
      originalPath: originalPath || null
    });
  }

  function createState(id, path, index, snapshot, data, sessionId, previous, keepPreviousPath, storageMap) {
    previous = previous || states[currentIndex];

    if (storageMap) {
      storage.set(id, storageMap);
    }

    var resolvePromise = noop;
    var rejectPromise = noop;
    var pathNoQuery = removeQueryAndHash(path);
    var pageId = previous && snapshot ? previous.pageId : id;
    var resumedId = previous && (snapshot || sessionId === previous.sessionId) ? previous.resumedId : sessionId;
    var resolved, promise;
    var savedState = [id, path, index, snapshot, data, sessionId];
    var state = {
      id: id,
      path: path,
      index: index,
      pathname: pathNoQuery,
      route: freeze(route.parse(pathNoQuery)),
      data: data,
      type: 'navigate',
      previous: previous,
      previousPath: previous && (keepPreviousPath || snapshot ? previous.previousPath : previous.path),
      pageId: pageId,
      sessionId: sessionId,
      resumedId: resumedId,
      handled: previous && snapshot && !!previous.done,

      get done() {
        return resolved;
      },

      get promise() {
        return promise || (promise = resolve(resolved || new Promise(function (resolve_, reject_) {
          resolvePromise = resolve_;
          rejectPromise = reject_;
        })));
      },

      get pageInfo() {
        return pageInfos[pageId] || (pageInfos[pageId] = new PageInfo({
          path: pathNoQuery,
          pageId: pageId,
          params: state.route,
          data: data
        }));
      },

      get storage() {
        return storageMap || (storageMap = getPersistedStorage(id, HistoryStorage));
      },

      reset: function reset() {
        state.handled = false;

        if (resolved) {
          resolved = false;
          promise = null;
        }

        return state;
      },
      forward: function forward(other) {
        if (promise && !resolved) {
          other.promise.then(function (data) {
            state.resolve(createNavigateResult(data.id, data.path, state.path, data.navigated));
          }, state.reject);
        }
      },
      resolve: function resolve(result) {
        resolved = result || createNavigateResult(id, state.path);
        resolvePromise(resolved);
        state.handled = true;

        if (states[currentIndex] === state) {
          lastState = state;

          if (resolved.navigated) {
            app.emit('pageload', {
              pathname: state.path
            }, {
              handleable: false
            });
          }
        }
      },
      reject: function reject(error) {
        promise = null;
        rejectPromise(error || errorWithCode(navigationCancelled));
      },
      toJSON: function toJSON() {
        savedState[1] = state.path;
        savedState[4] = state.data;
        return savedState;
      }
    };
    return state;
  }

  function updateQueryAndHash(state, newPath, oldPath) {
    state.path = newPath;
    history.replaceState(state.id, '', toPathname(newPath));

    if (state.done) {
      var oldHash = parsePath(oldPath).hash;
      var newHash = parsePath(newPath).hash;
      currentPath = newPath;
      app.path = newPath;

      if (oldHash !== newHash) {
        app.emit('hashchange', {
          oldHash: oldHash,
          newHash: newHash
        }, {
          handleable: false
        });
      }

      return {
        promise: resolve(createNavigateResult(state.pageId, newPath, null, false))
      };
    }

    return state;
  }

  function applyState(state, replace, snapshot, callback) {
    var currentState = states[currentIndex];

    if (currentState && currentState !== state && !currentState.done) {
      if (replace) {
        currentState.forward(state);
      } else {
        currentState.reject();
      }
    }

    if (appReady && !snapshot && locked(router_root)) {
      cancelLock(router_root).then(function () {
        if (states[currentIndex] === currentState && callback() !== false) {
          setImmediateOnce(handlePathChange);
        }
      }, function () {
        state.reject(errorWithCode(navigationRejected));
      });
    } else if (callback() !== false) {
      if (snapshot && currentState.done) {
        state.resolve(createNavigateResult(state.pageId, state.path, null, false));
        updateQueryAndHash(state, state.path, currentState.path);
      } else {
        setImmediateOnce(handlePathChange);
      }
    }
  }

  function pushState(path, replace, snapshot, data, storageMap) {
    path = resolvePath(path);

    if (!isSubPathOf(path, basePath)) {
      return {
        promise: reject(errorWithCode(navigationRejected))
      };
    }

    var currentState = states[currentIndex];
    var previous = currentState;

    if (currentState) {
      var pathNoQuery = removeQueryAndHash(path);

      if (snapshot) {
        storageMap = new HistoryStorage(previous.storage.toJSON());
      } else if (pathNoQuery === currentState.pathname) {
        if (!currentState.done || replace || path === currentState.path) {
          return updateQueryAndHash(currentState, path, currentState.path);
        }

        snapshot = true;
        storageMap = currentState.storage;
      } else if (pathNoQuery === lastState.pathname && removeQueryAndHash(currentPath) === pathNoQuery) {
        snapshot = true;
        previous = lastState;
        storageMap = lastState.storage;
      }
    }

    var id = randomId();
    var replaceHistory = replace || currentState && !currentState.done;
    var index = Math.max(0, currentIndex + !replaceHistory);
    var state = createState(id, path, indexOffset + index, snapshot, snapshot ? previous.data : data, sessionId, previous, replaceHistory, storageMap);
    applyState(state, replace, snapshot, function () {
      currentIndex = index;

      if (!replace) {
        each(states.splice(currentIndex), function (i, v) {
          storage.delete(v.id);

          if (v.resumedId !== resumedId) {
            storage.delete(v.resumedId);
          }
        });
      }

      states[currentIndex] = state;
      history[replaceHistory ? 'replaceState' : 'pushState'](id, '', toPathname(path));
      storage.set('c', id);
      storage.set('s', states);
    });
    return state;
  }

  function popState(index, isNative) {
    var state = states[index].reset();
    var step = state.index - states[currentIndex].index;
    var snapshot = states[index].pageId === states[currentIndex].pageId;
    var isLocked = !snapshot && locked(router_root);

    if (isLocked && isNative) {
      history.go(-step);
    }

    applyState(state, false, snapshot, function () {
      state.type = 'back_forward';
      currentIndex = index;

      if (isLocked && isNative && history.state === state.id) {
        // lock is cancelled before popstate event take place
        // history.go has no effect until then
        var unbind = bind(window, 'popstate', function () {
          unbind();
          history.go(step);
        });
        return false;
      }

      if (!isNative || isLocked) {
        history.go(step);
      }

      storage.set('c', state.id);
    });
    return state;
  }

  function getHistoryIndex(stateId) {
    return states.findIndex(function (v, i) {
      return v.id === stateId;
    });
  }

  function resolvePath(path, currentPath, isRoutePath) {
    var parsedState;
    path = decodeURI(path) || '/';
    currentPath = currentPath || app.path;

    if (path[0] === '#' || path[0] === '?') {
      var parts = parsePath(currentPath);
      return parts.pathname + (path[0] === '#' ? parts.search + path : path);
    }

    if (path[0] === '~' || path.indexOf('{') >= 0) {
      var fullPath = (isRoutePath ? fromRoutePath : pipe)(currentPath);
      parsedState = iequal(fullPath, route.toString()) ? _(route).current : route.parse(fullPath) && _(route).lastMatch;
      path = path.replace(/\{([^}?]+)(\??)\}/g, function (v, a, b, i) {
        return parsedState.params[a] || (b && i + v.length === path.length ? '' : 'null');
      });
    }

    if (path[0] === '~') {
      path = (isRoutePath ? pipe : fromRoutePath)(combinePath(parsedState.minPath, path.slice(1)));
    } else if (path[0] !== '/') {
      path = combinePath(removeQueryAndHash(currentPath), path);
    }

    return normalizePath(path, true);
  }

  function processPageChange(state) {
    var path = state.path;
    var deferred = deferrable();
    currentPath = path;
    pendingState = state;
    app.path = path;
    route.set(path);
    app.emit('beforepageload', {
      navigationType: state.type,
      pathname: path,
      data: state.data,
      waitFor: deferred.waitFor
    }, {
      handleable: false
    });
    always(deferred, function () {
      if (states[currentIndex] === state) {
        pendingState = null;
        redirectSource = {};
        state.resolve();
      }
    });
  }

  function handlePathChange() {
    if (!appReady) {
      return;
    }

    var state = states[currentIndex];
    var newPath = state.path;

    if (lastState === state || state.handled) {
      state.resolve(createNavigateResult(lastState.pageId, newPath, null, false));
      return;
    }

    state.handled = true; // prevent infinite redirection loop
    // redirectSource will not be reset until processPageChange is fired

    var previous = state.previous;

    if (previous && redirectSource[newPath] && redirectSource[previous.path]) {
      processPageChange(state);
      return;
    }

    redirectSource[newPath] = true;
    console.log('Nagivate', newPath);
    var promise = resolve(app.emit('navigate', {
      navigationType: state.type,
      pathname: newPath,
      oldPathname: lastState.path,
      oldStateId: lastState.id,
      newStateId: state.id,
      route: state.route,
      data: state.data
    }));
    notifyAsync(router_root, promise);
    promise.then(function () {
      if (states[currentIndex] === state) {
        processPageChange(state);
      }
    });
  }

  defineObservableProperty(app, 'path', '', function (newValue) {
    if (!appReady) {
      return currentPath;
    }

    newValue = resolvePath(newValue);

    if (newValue !== currentPath) {
      pushState(newValue);
    }

    return currentPath;
  });
  router_baseUrl = normalizePath(options.baseUrl);

  if (options.urlMode === 'none') {
    router_baseUrl = '/';
    isAppPath = constant(false);

    fromPathname = function fromPathname(path) {
      var parts = parsePath(currentPath);
      return parts.pathname + parts.search + parsePath(path).hash;
    };

    toPathname = function toPathname(path) {
      return location.pathname + location.search + parsePath(path).hash;
    };
  } else if (options.urlMode === 'query') {
    router_baseUrl = '/';

    isAppPath = function isAppPath(path) {
      return (path || '')[0] === '?' || /^\/($|[?#])/.test(isSubPathOf(path, location.pathname) || '');
    };

    fromPathname = function fromPathname(path) {
      var parts = parsePath(path);
      var value = getQueryParam(options.queryParam, parts.search);
      var l = RegExp.leftContext;
      var r = RegExp.rightContext;
      return normalizePath(value || '') + (value === false ? parts.search : l + (l || !r ? r : '?' + r.slice(1))) + parts.hash;
    };

    toPathname = function toPathname(path) {
      path = parsePath(path);
      return location.pathname + setQueryParam(options.queryParam, path.pathname, path.search || '?') + path.hash;
    };
  } else if (router_baseUrl === '/') {
    fromPathname = pipe;
    toPathname = pipe;
  } else if (options.explicitBaseUrl) {
    fromRoutePath = toPathname;
    toRoutePath = fromPathname;
    fromPathname = pipe;
    toPathname = pipe;
    basePath = router_baseUrl;
  } else {
    setBaseUrl(router_baseUrl);
  }

  var initialPath = options.initialPath || options.queryParam && getQueryParam(options.queryParam);
  var includeQuery = !initialPath;
  initialPath = initialPath || fromPathname(getCurrentPathAndQuery());

  if (!isSubPathOf(initialPath, basePath)) {
    initialPath = basePath;
  }

  var navigationType = {
    1: 'reload',
    2: 'back_forward'
  }[performance.navigation.type];

  if (navigationType) {
    options.resume = false;
  } else if (options.resume) {
    navigationType = 'resume';
  }

  route = new Route(app, options.routes, initialPath);
  storage = createObjectStorage(sessionStorage, 'brew.router.' + (typeof options.resume === 'string' ? options.resume : parsePath(toPathname('/')).pathname));
  app.define({
    get canNavigateBack() {
      return (states[currentIndex - 1] || '').sessionId === sessionId;
    },

    get canNavigateForward() {
      return (states[currentIndex + 1] || '').sessionId === sessionId;
    },

    get previousPath() {
      return states[currentIndex].previousPath || null;
    },

    get page() {
      return (pendingState || lastState).pageInfo;
    },

    matchRoute: matchRoute,
    parseRoute: parseRoute,
    resolvePath: resolvePath,
    isAppPath: isAppPath,
    toHref: toPathname,
    fromHref: fromPathname,
    snapshot: function snapshot() {
      return states[currentIndex] === lastState && !!pushState(currentPath, false, true);
    },
    navigate: function navigate(path, replace, data) {
      return pushState(path, replace, false, data).promise;
    },
    back: function back(defaultPath) {
      if (currentIndex > 0) {
        return popState(currentIndex - 1).promise;
      } else {
        return !!defaultPath && pushState(defaultPath).promise;
      }
    },
    historyStorage: {
      get current() {
        return (pendingState || lastState).storage;
      },

      for: function _for(stateId) {
        var state = states[getHistoryIndex(stateId)];
        return state ? state.storage : null;
      }
    }
  });
  defineOwnProperty(app, 'basePath', basePath, true);
  defineOwnProperty(app, 'initialPath', initialPath.replace(/#.*$/, ''), true);
  defineOwnProperty(app, 'route', route, true);
  defineOwnProperty(app, 'routes', freeze(options.routes));
  defineOwnProperty(app, 'cache', getPersistedStorage('g', HistoryStorage), true);
  bind(window, 'popstate', function () {
    var index = getHistoryIndex(history.state);

    if (index < 0) {
      pushState(fromPathname(getCurrentPathAndQuery()));
    } else if (index !== currentIndex) {
      popState(index, true);
    }
  });

  try {
    each(storage.get('s'), function (i, v) {
      states.push(createState.apply(0, v));
      currentIndex = i;
    });
  } catch (e) {}

  var initialState;
  var index = getHistoryIndex(navigationType === 'resume' ? storage.get('c') : history.state);

  if (index >= 0) {
    resumedId = states[index].resumedId;
    currentIndex = index;

    if (navigationType === 'resume') {
      indexOffset = history.length - currentIndex - 1;
      pushState(states[index].path, false, true);
    } else {
      indexOffset = states[index].index - currentIndex;
      sessionId = states[index].sessionId || sessionId;

      if (navigationType === 'reload' && !options.resumeOnReload) {
        storage.delete(history.state);
        initialState = options.urlMode === 'none';
      }
    }

    states[currentIndex].type = navigationType;
  } else {
    currentIndex = states.length;
    indexOffset = history.length - currentIndex;
    initialState = true;
  }

  if (initialState) {
    initialState = pushState(initialPath, true);
  }

  storage.set('c', states[currentIndex].id);
  app.on('ready', function () {
    if (initialState && states[currentIndex] === initialState && includeQuery) {
      pushState(fromPathname(getCurrentPathAndQuery()), true);
    }

    handlePathChange();
  });
  defineOwnProperty(app, 'sessionId', resumedId, true);
  defineOwnProperty(app, 'sessionStorage', getPersistedStorage(resumedId, HistoryStorage), true);
}

parsedRoutes['/*'] = deepFreeze(new RoutePattern({
  value: '/*',
  exact: false,
  length: 0,
  minLength: 0,
  params: {},
  test: function test() {
    return true;
  }
}));
/* harmony default export */ const router = (addExtension('router', configureRouter));
// CONCATENATED MODULE: ./src/entry-slim.js
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }











util_define(src_app, _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({
  ErrorCode: errorCode_namespaceObject,
  defaults: src_defaults
}, common_namespaceObject), storage_namespaceObject), path_namespaceObject), anim_namespaceObject), domAction_namespaceObject), {}, {
  getDirectiveComponent: getDirectiveComponent,
  registerDirective: registerDirective,
  install: install,
  addDetect: addDetect,
  addExtension: addExtension
}));





function exportAppToGlobal(app) {
  window.app = app;
}

/* harmony default export */ const entry_slim = (src_app.with(exportAppToGlobal, i18n, scrollable, viewport, router));

/***/ }),

/***/ 961:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.5
var LZString = (function() {

// private property
var f = String.fromCharCode;
var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
var baseReverseDic = {};

function getBaseValue(alphabet, character) {
  if (!baseReverseDic[alphabet]) {
    baseReverseDic[alphabet] = {};
    for (var i=0 ; i<alphabet.length ; i++) {
      baseReverseDic[alphabet][alphabet.charAt(i)] = i;
    }
  }
  return baseReverseDic[alphabet][character];
}

var LZString = {
  compressToBase64 : function (input) {
    if (input == null) return "";
    var res = LZString._compress(input, 6, function(a){return keyStrBase64.charAt(a);});
    switch (res.length % 4) { // To produce valid Base64
    default: // When could this happen ?
    case 0 : return res;
    case 1 : return res+"===";
    case 2 : return res+"==";
    case 3 : return res+"=";
    }
  },

  decompressFromBase64 : function (input) {
    if (input == null) return "";
    if (input == "") return null;
    return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrBase64, input.charAt(index)); });
  },

  compressToUTF16 : function (input) {
    if (input == null) return "";
    return LZString._compress(input, 15, function(a){return f(a+32);}) + " ";
  },

  decompressFromUTF16: function (compressed) {
    if (compressed == null) return "";
    if (compressed == "") return null;
    return LZString._decompress(compressed.length, 16384, function(index) { return compressed.charCodeAt(index) - 32; });
  },

  //compress into uint8array (UCS-2 big endian format)
  compressToUint8Array: function (uncompressed) {
    var compressed = LZString.compress(uncompressed);
    var buf=new Uint8Array(compressed.length*2); // 2 bytes per character

    for (var i=0, TotalLen=compressed.length; i<TotalLen; i++) {
      var current_value = compressed.charCodeAt(i);
      buf[i*2] = current_value >>> 8;
      buf[i*2+1] = current_value % 256;
    }
    return buf;
  },

  //decompress from uint8array (UCS-2 big endian format)
  decompressFromUint8Array:function (compressed) {
    if (compressed===null || compressed===undefined){
        return LZString.decompress(compressed);
    } else {
        var buf=new Array(compressed.length/2); // 2 bytes per character
        for (var i=0, TotalLen=buf.length; i<TotalLen; i++) {
          buf[i]=compressed[i*2]*256+compressed[i*2+1];
        }

        var result = [];
        buf.forEach(function (c) {
          result.push(f(c));
        });
        return LZString.decompress(result.join(''));

    }

  },


  //compress into a string that is already URI encoded
  compressToEncodedURIComponent: function (input) {
    if (input == null) return "";
    return LZString._compress(input, 6, function(a){return keyStrUriSafe.charAt(a);});
  },

  //decompress from an output of compressToEncodedURIComponent
  decompressFromEncodedURIComponent:function (input) {
    if (input == null) return "";
    if (input == "") return null;
    input = input.replace(/ /g, "+");
    return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrUriSafe, input.charAt(index)); });
  },

  compress: function (uncompressed) {
    return LZString._compress(uncompressed, 16, function(a){return f(a);});
  },
  _compress: function (uncompressed, bitsPerChar, getCharFromInt) {
    if (uncompressed == null) return "";
    var i, value,
        context_dictionary= {},
        context_dictionaryToCreate= {},
        context_c="",
        context_wc="",
        context_w="",
        context_enlargeIn= 2, // Compensate for the first entry which should not count
        context_dictSize= 3,
        context_numBits= 2,
        context_data=[],
        context_data_val=0,
        context_data_position=0,
        ii;

    for (ii = 0; ii < uncompressed.length; ii += 1) {
      context_c = uncompressed.charAt(ii);
      if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
        context_dictionary[context_c] = context_dictSize++;
        context_dictionaryToCreate[context_c] = true;
      }

      context_wc = context_w + context_c;
      if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
        context_w = context_wc;
      } else {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
          if (context_w.charCodeAt(0)<256) {
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<8 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          } else {
            value = 1;
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1) | value;
              if (context_data_position ==bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = 0;
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<16 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
          delete context_dictionaryToCreate[context_w];
        } else {
          value = context_dictionary[context_w];
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }


        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        // Add wc to the dictionary.
        context_dictionary[context_wc] = context_dictSize++;
        context_w = String(context_c);
      }
    }

    // Output the code for w.
    if (context_w !== "") {
      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
        if (context_w.charCodeAt(0)<256) {
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<8 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        } else {
          value = 1;
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | value;
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = 0;
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<16 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        delete context_dictionaryToCreate[context_w];
      } else {
        value = context_dictionary[context_w];
        for (i=0 ; i<context_numBits ; i++) {
          context_data_val = (context_data_val << 1) | (value&1);
          if (context_data_position == bitsPerChar-1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }


      }
      context_enlargeIn--;
      if (context_enlargeIn == 0) {
        context_enlargeIn = Math.pow(2, context_numBits);
        context_numBits++;
      }
    }

    // Mark the end of the stream
    value = 2;
    for (i=0 ; i<context_numBits ; i++) {
      context_data_val = (context_data_val << 1) | (value&1);
      if (context_data_position == bitsPerChar-1) {
        context_data_position = 0;
        context_data.push(getCharFromInt(context_data_val));
        context_data_val = 0;
      } else {
        context_data_position++;
      }
      value = value >> 1;
    }

    // Flush the last char
    while (true) {
      context_data_val = (context_data_val << 1);
      if (context_data_position == bitsPerChar-1) {
        context_data.push(getCharFromInt(context_data_val));
        break;
      }
      else context_data_position++;
    }
    return context_data.join('');
  },

  decompress: function (compressed) {
    if (compressed == null) return "";
    if (compressed == "") return null;
    return LZString._decompress(compressed.length, 32768, function(index) { return compressed.charCodeAt(index); });
  },

  _decompress: function (length, resetValue, getNextValue) {
    var dictionary = [],
        next,
        enlargeIn = 4,
        dictSize = 4,
        numBits = 3,
        entry = "",
        result = [],
        i,
        w,
        bits, resb, maxpower, power,
        c,
        data = {val:getNextValue(0), position:resetValue, index:1};

    for (i = 0; i < 3; i += 1) {
      dictionary[i] = i;
    }

    bits = 0;
    maxpower = Math.pow(2,2);
    power=1;
    while (power!=maxpower) {
      resb = data.val & data.position;
      data.position >>= 1;
      if (data.position == 0) {
        data.position = resetValue;
        data.val = getNextValue(data.index++);
      }
      bits |= (resb>0 ? 1 : 0) * power;
      power <<= 1;
    }

    switch (next = bits) {
      case 0:
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = f(bits);
        break;
      case 1:
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = f(bits);
        break;
      case 2:
        return "";
    }
    dictionary[3] = c;
    w = c;
    result.push(c);
    while (true) {
      if (data.index > length) {
        return "";
      }

      bits = 0;
      maxpower = Math.pow(2,numBits);
      power=1;
      while (power!=maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb>0 ? 1 : 0) * power;
        power <<= 1;
      }

      switch (c = bits) {
        case 0:
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }

          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 1:
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 2:
          return result.join('');
      }

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

      if (dictionary[c]) {
        entry = dictionary[c];
      } else {
        if (c === dictSize) {
          entry = w + w.charAt(0);
        } else {
          return null;
        }
      }
      result.push(entry);

      // Add w+entry[0] to the dictionary.
      dictionary[dictSize++] = w + entry.charAt(0);
      enlargeIn--;

      w = entry;

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

    }
  }
};
  return LZString;
})();

if (true) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () { return LZString; }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {}


/***/ }),

/***/ 609:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__609__;

/***/ }),

/***/ 172:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__172__;

/***/ }),

/***/ 160:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__160__;

/***/ }),

/***/ 163:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__163__;

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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(268);
/******/ })()
.default;
});
//# sourceMappingURL=brew-slim.js.map