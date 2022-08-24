(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("zeta-dom"), require("jQuery"), (function webpackLoadOptionalExternalModule() { try { return require("jq-scrollable"); } catch(e) {} }()), require("promise-polyfill"), require("waterpipe"));
	else if(typeof define === 'function' && define.amd)
		define("brew", ["zeta-dom", "jQuery", "jq-scrollable", "promise-polyfill", "waterpipe"], factory);
	else if(typeof exports === 'object')
		exports["brew"] = factory(require("zeta-dom"), require("jQuery"), (function webpackLoadOptionalExternalModule() { try { return require("jq-scrollable"); } catch(e) {} }()), require("promise-polyfill"), require("waterpipe"));
	else
		root["brew"] = factory(root["zeta"], root["jQuery"], root["jq-scrollable"], root["promise-polyfill"], root["waterpipe"]);
})(self, function(__WEBPACK_EXTERNAL_MODULE__163__, __WEBPACK_EXTERNAL_MODULE__609__, __WEBPACK_EXTERNAL_MODULE__172__, __WEBPACK_EXTERNAL_MODULE__804__, __WEBPACK_EXTERNAL_MODULE__160__) {
return /******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 607:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ entry; }
});

// NAMESPACE OBJECT: ./src/util/path.js
var path_namespaceObject = {};
__webpack_require__.r(path_namespaceObject);
__webpack_require__.d(path_namespaceObject, {
  "baseUrl": function() { return baseUrl; },
  "combinePath": function() { return combinePath; },
  "isSubPathOf": function() { return isSubPathOf; },
  "normalizePath": function() { return normalizePath; },
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
  "loadScript": function() { return loadScript; },
  "preloadImages": function() { return preloadImages; },
  "selectorForAttr": function() { return selectorForAttr; },
  "setAttr": function() { return setAttr; },
  "setCookie": function() { return setCookie; }
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
  "openFlyout": function() { return openFlyout; }
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
    throwNotFunction = _zeta$util.throwNotFunction,
    errorWithCode = _zeta$util.errorWithCode,
    isErrorWithCode = _zeta$util.isErrorWithCode,
    keys = _zeta$util.keys,
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
 * @param {boolean=} resolveDotDir
 * @param {boolean=} returnEmpty
 */

function normalizePath(path, resolveDotDir, returnEmpty) {
  if (!path || path === '/') {
    return returnEmpty ? '' : '/';
  }

  if (/(^(?:[a-z0-9]+:)?\/\/)|\?|#/.test(path)) {
    var a = document.createElement('a');
    a.href = path;
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
  return url.substr(0, location.origin.length) === location.origin ? url.substr(location.origin.length) : url;
}
/**
 * @param {string} a
 * @param {string} b
 */

function isSubPathOf(a, b) {
  var len = b.length;
  return a.substr(0, len) === b && (!a[len] || a[len] === '/' || b[len - 1] === '/') && normalizePath(a.slice(len));
}
/**
 * @param {string} path
 */

function toSegments(path) {
  path = normalizePath(path);
  return path === '/' ? [] : path.slice(1).split('/').map(decodeURIComponent);
}
// EXTERNAL MODULE: ./src/include/external/jquery.js
var jquery = __webpack_require__(860);
// EXTERNAL MODULE: ./src/include/external/promise-polyfill.js
var promise_polyfill = __webpack_require__(424);
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
function getAttrValues(element) {
  var values = {};
  each(element.attributes, function (i, v) {
    values[v.name] = v.value;
  });
  return values;
}
function hasAttr(element, name) {
  return !!element.attributes[name];
}
function getAttr(element, name) {
  var attr = element.attributes[name];
  return attr && attr.value;
}
function setAttr(element, name, value) {
  each(isPlainObject(name) || kv(name, value), function (i, v) {
    element.setAttribute(i, v);
  });
}
function copyAttr(src, dst) {
  each(src.attributes, function (i, v) {
    dst.setAttribute(v.name, v.value);
  });
}
function selectorForAttr(attr) {
  if (isPlainObject(attr)) {
    attr = keys(attr);
  }

  return '[' + attr.join('],[') + ']';
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
  var httpMethods = 'get post delete';

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
    urls = keys(map);
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

  return setPromiseTimeout(resolveAll(values(preloadImagesCache)), ms, true);
}
// CONCATENATED MODULE: ./tmp/zeta-dom/dom.js

var _defaultExport = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom;
/* harmony default export */ const dom = (_defaultExport);
var _zeta$dom = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom,
    textInputAllowed = _zeta$dom.textInputAllowed,
    beginDrag = _zeta$dom.beginDrag,
    beginPinchZoom = _zeta$dom.beginPinchZoom,
    getShortcut = _zeta$dom.getShortcut,
    setShortcut = _zeta$dom.setShortcut,
    focusable = _zeta$dom.focusable,
    focused = _zeta$dom.focused,
    setModal = _zeta$dom.setModal,
    releaseModal = _zeta$dom.releaseModal,
    retainFocus = _zeta$dom.retainFocus,
    releaseFocus = _zeta$dom.releaseFocus,
    iterateFocusPath = _zeta$dom.iterateFocusPath,
    dom_focus = _zeta$dom.focus;

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
  var delay = parseFloat(jquery(element).css('transition-delay'));
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
// EXTERNAL MODULE: ./src/include/external/waterpipe.js
var waterpipe = __webpack_require__(256);
// CONCATENATED MODULE: ./src/defaults.js
/** @deprecated @type {Zeta.Dictionary} */
var defaults = {};
/* harmony default export */ const src_defaults = (defaults);
// CONCATENATED MODULE: ./tmp/zeta-dom/domLock.js

var domLock_zeta$dom = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom,
    lock = domLock_zeta$dom.lock,
    locked = domLock_zeta$dom.locked,
    cancelLock = domLock_zeta$dom.cancelLock,
    notifyAsync = domLock_zeta$dom.notifyAsync,
    preventLeave = domLock_zeta$dom.preventLeave;

// CONCATENATED MODULE: ./src/include/zeta-dom/domLock.js

// CONCATENATED MODULE: ./src/util/console.js
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }



function toElementTag(element) {
  return element.tagName.toLowerCase() + (element.id ? '#' + element.id : element.className.trim() && element.className.replace(/^\s*|\s+(?=\S)/g, '.'));
}

function truncateJSON(json) {
  return '[{"]'.indexOf(json[0]) >= 0 && json.length > 200 ? json[0] + json.substr(1, 199) + "\u2026" + json[json.length - 1] : json;
}

function formatMessage(eventSource, message) {
  message = makeArray(message).map(function (v) {
    return is(v, Element) ? toElementTag(v) + ':' : v && _typeof(v) === 'object' ? truncateJSON(JSON.stringify(v)) : v;
  }).join(' ');
  return '[' + eventSource + '] ' + message;
}
/**
 * @param {string} eventSource
 * @param {string | Element | Record<any, any> | any[]} message
 */


function writeLog(eventSource, message) {
  console.log(formatMessage(eventSource, message));
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
  } catch (e) {}

  try {
    callback(console);
  } finally {
    if (close) {
      try {
        console.groupEnd();
      } catch (e) {}
    }
  }
}
// CONCATENATED MODULE: ./src/dom.js














var IMAGE_STYLE_PROPS = 'background-image'.split(' ');
var BOOL_ATTRS = 'checked selected disabled readonly multiple ismap';

var _ = createPrivateStore();

var root = zeta_dom_dom.root;
var updatedElements = new Set();
var pendingDOMUpdates = new Map();
var preupdateHandlers = [];
var matchElementHandlers = [];
var selectorHandlers = [];
/** @type {Zeta.Dictionary<Brew.DOMProcessorCallback>} */

var transformationHandlers = {};
/** @type {Zeta.Dictionary<Brew.DOMProcessorCallback>} */

var renderHandlers = {};
var templates = {};
var batchCounter = 0;
var stateChangeLock = false;

function getComponentState(ns, element) {
  var obj = _(element) || _(element, {});

  return obj[ns] || (obj[ns] = {});
}

function updateDOM(element, props, suppressEvent) {
  each(props, function (j, v) {
    if (j === '$$class') {
      setClass(element, v);
    } else if (j === '$$text') {
      element.textContent = v;
    } else if (j === 'style') {
      jquery(element).css(v);
    } else if (matchWord(j, BOOL_ATTRS)) {
      element[j] = !!v;
    } else {
      element.setAttribute(j, v);
    }
  });

  if (!suppressEvent) {
    zeta_dom_dom.emit('domchange', element);
  }
}

function mergeDOMUpdates(dict, props) {
  each(props, function (j, v) {
    if (j === '$$class' || j === 'style') {
      dict[j] = extend({}, dict[j], v);
    } else {
      dict[j] = v;
    }
  });
}

function processTransform(elements, applyDOMUpdates) {
  var transformed = new Set();
  var exclude;

  do {
    elements = grep(makeArray(elements), function (v) {
      return containsOrEquals(root, v);
    });
    exclude = makeArray(transformed);
    jquery(selectIncludeSelf(selectorForAttr(transformationHandlers), elements)).not(exclude).each(function (j, element) {
      each(transformationHandlers, function (i, v) {
        if (element.attributes[i]) {
          v(element, getComponentState.bind(0, i), applyDOMUpdates);
          transformed.add(element);
        }
      });
    });
  } while (exclude.length !== transformed.size);
}
/**
 * @param {string} target
 * @param {Zeta.Dictionary} handlers
 * @param {any[]} unbindHandlers
 */


function addSelectHandlers(target, handlers, unbindHandlers) {
  selectorHandlers.push({
    target: target,
    handlers: handlers,
    unbindHandlers: unbindHandlers
  });
}
/**
 * @param {string} selector
 * @param {(ele: Element) => void} handler
 */

function matchElement(selector, handler) {
  matchElementHandlers.push({
    selector: selector,
    handler: handler
  });
}
/**
 * @param {(domChanges: Map<Element, Brew.DOMUpdateState>) => Brew.PromiseOrEmpty} callback
 */

function hookBeforeUpdate(callback) {
  preupdateHandlers.push(throwNotFunction(callback));
}
/**
 * @param {Promise<any>} promise
 * @param {Element=} element
 * @param {() => any=} callback
 */

function handleAsync(promise, element, callback) {
  if (!isThenable(promise)) {
    return makeAsync(callback || noop)();
  }

  notifyAsync(element || root, promise);
  return promise.then(callback);
}
/**
 * @param {Element} element
 */

function markUpdated(element) {
  if (containsOrEquals(root, element)) {
    updatedElements.add(element);
  }
}
/**
 * @param {boolean=} suppressAnim
 */

function processStateChange(suppressAnim) {
  if (batchCounter || stateChangeLock) {
    return;
  }

  var updatedProps = new Map();
  var domUpdates = new Map();

  var applyDOMUpdates = function applyDOMUpdates(element, props) {
    var dict = mapGet(domUpdates, element, Object);
    mergeDOMUpdates(dict, props);
  };

  stateChangeLock = true;

  try {
    groupLog(zeta_dom_dom.eventSource, 'statechange', function () {
      // recursively perform transformation until there is no new element produced
      processTransform(updatedElements, applyDOMUpdates);
      var arr = jquery.uniqueSort(grep(updatedElements, function (v) {
        return containsOrEquals(root, v);
      }));
      updatedElements.clear();
      each(arr, function (i, v) {
        var state = getComponentState('oldValues', v);
        var oldValues = {};
        var newValues = {};
        each(getVar(v, true), function (j, v) {
          if (state[j] !== v) {
            oldValues[j] = state[j];
            newValues[j] = v;
            state[j] = v;
          }
        });
        updatedProps.set(v, {
          oldValues: oldValues,
          newValues: newValues
        });

        while (v = v.parentNode) {
          var parent = updatedProps.get(v);

          if (parent) {
            for (var j in parent.newValues) {
              if (!(j in newValues)) {
                newValues[j] = parent.newValues[j];
                oldValues[j] = parent.oldValues[j];
              }
            }
          }
        }
      });
      var visited = [];
      each(arr.reverse(), function (i, v) {
        groupLog('statechange', [v, updatedProps.get(v).newValues], function (console) {
          console.log(v === root ? document : v);
          jquery(selectIncludeSelf(selectorForAttr(renderHandlers), v)).not(visited).each(function (i, element) {
            each(renderHandlers, function (i, v) {
              if (element.attributes[i]) {
                v(element, getComponentState.bind(0, i), applyDOMUpdates);
              }
            });
            visited.push(element);
          });
        });
      });
    }); // perform any async task that is related or required by the DOM changes

    var preupdatePromise = resolveAll(preupdateHandlers.map(function (v) {
      return v(domUpdates);
    })); // perform DOM updates, or add to pending updates if previous update is not completed
    // also wait for animation completed if suppressAnim is off

    preupdatePromise.then(function () {
      var animScopes = new Map();
      each(domUpdates, function (element, props) {
        if (!suppressAnim) {
          var animParent = jquery(element).filter('[match-path]')[0] || jquery(element).parents('[match-path]')[0] || root;
          var groupElements = animScopes.get(animParent);

          if (!groupElements) {
            var filter = function filter(v) {
              var haystack = v.getAttribute('animate-on-statechange');

              if (!haystack) {
                return true;
              }

              for (var cur; v && !(cur = updatedProps.get(v)); v = v.parentNode) {
                ;
              }

              return cur && any(haystack, function (v) {
                return v in cur.newValues;
              });
            };

            groupElements = [];
            setImmediate(function () {
              animateOut(animParent, 'statechange', '[match-path]', filter, true).then(function () {
                each(groupElements, function (i, v) {
                  updateDOM(v, mapRemove(pendingDOMUpdates, v));
                });
                animateIn(animParent, 'statechange', '[match-path]', filter);
              });
            });
            animScopes.set(animParent, groupElements);
          }

          var dict = mapGet(pendingDOMUpdates, element, Object);
          mergeDOMUpdates(dict, props);
          groupElements.push(element);
        } else if (pendingDOMUpdates.has(element)) {
          mergeDOMUpdates(pendingDOMUpdates.get(element), props);
        } else {
          updateDOM(element, props);
        }
      });
      each(updatedProps, function (i, v) {
        zeta_dom_dom.emit('statechange', i, {
          data: getVar(i),
          newValues: v.newValues,
          oldValues: v.oldValues
        }, true);
      });
    });
  } finally {
    stateChangeLock = false;
  }
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
    throwNotFunction(callback || suppressAnim)();
  } catch (e) {
    doUpdate = false;
    throw e;
  } finally {
    if (! --batchCounter && doUpdate) {
      processStateChange(suppressAnim === true);
    }
  }
}
/**
 * @param {Element} element
 */

function mountElement(element) {
  // apply transforms before element mounted
  // suppress domchange event before element is mounted
  var prevStateChangeLock = stateChangeLock;
  stateChangeLock = true;

  try {
    processTransform(element, function (element, props) {
      updateDOM(element, props, true);
    });
  } finally {
    stateChangeLock = prevStateChangeLock;
  }

  var mountedElements = [element];
  var firedOnRoot = element === root;
  var index = -1,
      index2 = 0;

  while (index < selectorHandlers.length) {
    each(selectorHandlers.slice(index < 0 ? 0 : index), function (i, v) {
      jquery(selectIncludeSelf(v.target, element)).each(function (i, w) {
        v.unbindHandlers.push(app.on(w, v.handlers));

        if (v.handlers.mounted && mountedElements.indexOf(w) < 0) {
          mountedElements.push(w);
        }
      });
    });
    index = selectorHandlers.length;
    each(jquery.uniqueSort(mountedElements.slice(index2)), function (i, v) {
      zeta_dom_dom.emit('mounted', v);
    });

    if (!firedOnRoot) {
      firedOnRoot = true;
      zeta_dom_dom.emit('mounted', root, {
        target: element
      });
    }

    index2 = mountedElements.length;
  }

  each(matchElementHandlers, function (i, v) {
    jquery(selectIncludeSelf(v.selector, element)).each(function (i, w) {
      v.handler.call(w, w);
    });
  });
}
/**
 * @param {boolean=} suppressPrompt
 */

function dom_preventLeave(suppressPrompt) {
  var element = any(jquery('[prevent-leave]').get(), function (v) {
    var state = getComponentState('preventLeave', v);
    var allowLeave = state.allowLeave;

    if (isElementActive(v) || allowLeave) {
      var preventLeave = evalAttr(v, 'prevent-leave');

      if (!preventLeave && allowLeave) {
        delete state.allowLeave;
      }

      return preventLeave && !allowLeave;
    }
  });

  if (element && !suppressPrompt) {
    return resolveAll(zeta_dom_dom.emit('preventLeave', element, null, true), function (result) {
      if (result) {
        var state = getComponentState('preventLeave', element);
        state.allowLeave = true;
      } else {
        throw errorWithCode(navigationRejected);
      }
    });
  }

  return !!element;
}
function addTemplate(name, template) {
  templates[name] = jquery(template)[0];
}
function addTransformer(name, callback) {
  transformationHandlers[name] = throwNotFunction(callback);
}
function addRenderer(name, callback) {
  renderHandlers[name] = throwNotFunction(callback);
}
/* --------------------------------------
 * Built-in transformers and renderers
 * -------------------------------------- */

addTransformer('apply-template', function (element, getState) {
  var state = getState(element);
  var templateName = element.getAttribute('apply-template');
  var template = templates[templateName] || templates[evalAttr(element, 'apply-template')];
  var currentTemplate = state.template;

  if (!state.attributes) {
    extend(state, {
      attributes: getAttrValues(element),
      childNodes: makeArray(element.childNodes)
    });
  }

  if (template && template !== currentTemplate) {
    state.template = template;
    template = template.cloneNode(true); // reset attributes on the apply-template element
    // before applying new attributes

    if (currentTemplate) {
      each(currentTemplate.attributes, function (i, v) {
        element.removeAttribute(v.name);
      });
    }

    setAttr(element, state.attributes);
    copyAttr(template, element);
    var $contents = jquery(state.childNodes).detach();
    jquery(selectIncludeSelf('content:not([for])', template)).replaceWith($contents);
    jquery(selectIncludeSelf('content[for]', template)).each(function (i, v) {
      jquery(v).replaceWith($contents.filter(v.getAttribute('for') || ''));
    });
    jquery(element).empty().append(template.childNodes);
  }
});
addTransformer('auto-var', function (element) {
  setVar(element, evalAttr(element, 'auto-var'));
});
addTransformer('foreach', function (element, getState) {
  var state = getState(element);
  var templateNodes = state.template || (state.template = jquery(element).contents().detach().filter(function (i, v) {
    return v.nodeType === 1 || /\S/.test(v.data || '');
  }).get());
  var currentNodes = state.nodes || [];
  var oldItems = state.data || [];
  var newItems = makeArray(evalAttr(element, 'foreach'));

  if (newItems.length !== oldItems.length || newItems.some(function (v, i) {
    return oldItems[i] !== v;
  })) {
    var newChildren = map(newItems, function (v) {
      var currentIndex = oldItems.indexOf(v);

      if (currentIndex >= 0) {
        oldItems.splice(currentIndex, 1);
        return currentNodes.splice(currentIndex * templateNodes.length, (currentIndex + 1) * templateNodes.length);
      }

      var parts = jquery(templateNodes).clone().get();
      var nested = jquery(selectIncludeSelf('[foreach]', parts));

      if (nested[0]) {
        jquery(selectIncludeSelf('[foreach]', templateNodes)).each(function (i, v) {
          getState(nested[i]).template = getState(v).template;
        });
      }

      each(parts, function (i, w) {
        if (w.nodeType === 1) {
          jquery(element).append(w);
          declareVar(w, {
            foreach: v
          });
          mountElement(w);
        }
      });
      return parts;
    });
    extend(state, {
      nodes: newChildren,
      data: newItems.slice()
    });
    jquery(currentNodes).detach();
    jquery(element).append(newChildren);
  }
});
addTransformer('switch', function (element, getState, applyDOMUpdates) {
  var varname = element.getAttribute('switch') || '';

  if (!isElementActive(element) || !varname) {
    return;
  }

  var state = getState(element);

  if (state.matched === undefined) {
    declareVar(element, 'matched', function () {
      return state.matched && getVar(state.matched, true);
    });
  }

  var context = getVar(element);
  var matchValue = waterpipe.eval(varname, context);
  var $target = jquery('[match-' + varname + ']', element).filter(function (i, w) {
    return jquery(w).parents('[switch]')[0] === element;
  });
  var resetOnChange = !matchWord('switch', element.getAttribute('keep-child-state') || '');
  var previous = state.matched;
  var matched;
  var itemValues = new Map();
  $target.each(function (i, v) {
    var thisValue = waterpipe.eval('"null" ?? ' + v.getAttribute('match-' + varname), getVar(v));
    itemValues.set(v, thisValue);

    if (waterpipe.eval('$0 == $1', [matchValue, thisValue])) {
      matched = v;
      return false;
    }
  });
  matched = matched || $target.filter('[default]')[0] || $target[0] || null;

  if (previous !== matched) {
    groupLog('switch', [element, varname, '→', matchValue], function (console) {
      console.log('Matched: ', matched || '(none)');

      if (matched) {
        if (resetOnChange) {
          resetVar(matched);
        }

        setVar(matched);
      }

      if (previous && resetOnChange) {
        resetVar(previous, true);
      }

      $target.each(function (i, v) {
        applyDOMUpdates(v, {
          $$class: {
            active: v === matched
          }
        });
      });
    });
  } else {
    writeLog('switch', [element, varname, '→', matchValue, '(unchanged)']);

    if (varname in context && itemValues.get(matched) !== undefined) {
      setVar(element, varname, itemValues.get(matched));
    }
  }

  state.matched = matched;
});
addRenderer('template', function (element, getState, applyDOMUpdates) {
  var state = getState(element);
  var templates = state.templates;

  if (!templates) {
    templates = {};
    each(element.attributes, function (i, w) {
      if (w.value.indexOf('{{') >= 0) {
        templates[w.name] = matchWord(w.name, BOOL_ATTRS) ? w.value.replace(/^{{|}}$/g, '') : w.value;
      }
    });

    if (!element.childElementCount && (element.textContent || '').indexOf('{{') >= 0) {
      templates.$$text = element.textContent;
    }

    state.templates = templates;
  }

  var context = getVar(element);
  var props = {};
  each(templates, function (i, w) {
    var value = evaluate(w, context, element, i, !matchWord(i, BOOL_ATTRS));

    if ((i === '$$text' ? element.textContent : (element.getAttribute(i) || '').replace(/["']/g, '')) !== value) {
      props[i] = value;
    }
  });
  applyDOMUpdates(element, props);
});
addRenderer('set-style', function (element, getState, applyDOMUpdates) {
  var style = parseCSS(evalAttr(element, 'set-style', true));
  each(IMAGE_STYLE_PROPS, function (i, v) {
    var imageUrl = isCssUrlValue(style[v]);

    if (imageUrl) {
      style[v] = 'url("' + withBaseUrl(toRelativeUrl(imageUrl)) + '")';
    }
  });
  applyDOMUpdates(element, {
    style: style
  });
});
addRenderer('set-class', function (element, getState, applyDOMUpdates) {
  applyDOMUpdates(element, {
    $$class: evalAttr(element, 'set-class')
  });
});
// CONCATENATED MODULE: ./src/app.js






var app_ = createPrivateStore();

var app_root = zeta_dom_dom.root;
var featureDetections = {};
/** @type {Brew.AppInstance} */

var app;
/** @type {boolean} */

var appReady;
/** @type {boolean} */

var appInited;

function exactTargetWrapper(handler) {
  return function (e) {
    if (e.target === e.context) {
      return handler.apply(this, arguments);
    }
  };
}

function App() {
  var self = this;

  app_(self, {
    init: deferrable(zeta_dom_dom.ready),
    options: {}
  });

  defineOwnProperty(self, 'element', app_root, true);
  defineOwnProperty(self, 'ready', new Promise(function (resolve) {
    self.on('ready', resolve.bind(0, self));
  }), true);
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
      promise = promise.call(this);
    }

    app_(this).init.waitFor(promise);
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
    noChildren = (noChildren || handler) === true;

    if (isFunction(event)) {
      handler = event;
      event = target;
      target = app_root;
    }

    var handlers = event;

    if (typeof event === 'string') {
      if (noChildren) {
        handler = exactTargetWrapper(handler);
      }

      if (event.indexOf(' ') >= 0) {
        handlers = {};
        each(event, function (i, v) {
          handlers[v] = handler;
        });
      } else {
        handlers = kv(event, handler);
      }
    } else if (noChildren) {
      for (var i in event) {
        event[i] = exactTargetWrapper(event[i]);
      }
    }

    var arr = [];

    if (typeof target === 'string') {
      addSelectHandlers(target, handlers, arr);
      target = jquery(target).get();
    } else if (target instanceof Node) {
      target = [target];
    }

    each(target, function (i, v) {
      arr.push(zeta_dom_dom.on(v, handlers));
    });
    return combineFn(arr);
  },
  matchElement: matchElement,
  beforeUpdate: hookBeforeUpdate
});
watchable(App.prototype);
/* harmony default export */ function src_app() {
  if (appInited) {
    throw new Error('brew() can only be called once');
  }

  app = new App();
  each(src_defaults, function (i, v) {
    var fn = v && isFunction(app[camel('use-' + i)]);

    if (fn) {
      fn.call(app, v);
    }
  });
  each(arguments, function (i, v) {
    throwNotFunction(v)(app);
  });
  appInited = true;
  handleAsync(app_(app).init, app_root, function () {
    appReady = true;
    mountElement(app_root);
    app.emit('ready');
  });
  return app;
}
function install(name, callback) {
  name = camel('use-' + name);
  throwNotFunction(callback);
  definePrototype(App, kv(name, function (options) {
    var dict = app_(this).options;

    if (dict[name]) {
      throw new Error(name + '() can only be called once');
    }

    dict[name] = options || {};
    callback(this, dict[name]);
  }));
}
function addExtension(autoInit, name, callback) {
  if (autoInit === true) {
    return function (app) {
      callback(app, {});
    };
  }

  return install.bind(0, autoInit, name);
}
function addDetect(name, callback) {
  featureDetections[name] = throwNotFunction(callback);
}
function isElementActive(element) {
  return !app || app.isElementActive(element);
}
// CONCATENATED MODULE: ./tmp/zeta-dom/tree.js

var TraversableNode = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.TraversableNode,
    TraversableNodeTree = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.TraversableNodeTree,
    InheritedNode = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.InheritedNode,
    InheritedNodeTree = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.InheritedNodeTree,
    TreeWalker = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.TreeWalker;

// CONCATENATED MODULE: ./src/include/zeta-dom/tree.js

// CONCATENATED MODULE: ./src/var.js








var var_root = zeta_dom_dom.root;
var varAttrs = {
  'var': true,
  'auto-var': true,
  'loading-scope': {
    loading: false
  },
  'error-scope': {
    error: null
  }
};
var tree = new InheritedNodeTree(var_root, VarContext, {
  selector: selectorForAttr(varAttrs)
});
/**
 * @class
 * @this {Brew.VarContext}
 */

function VarContext() {
  var self = this;
  var element = self.element; // @ts-ignore: does not throw error when property dataset does not exist

  each(element.dataset, function (i, v) {
    defineOwnProperty(self, i, waterpipe.eval('`' + trim(v || 'null')));
  });
  each(getDeclaredVar(element, true, self), function (i, v) {
    defineOwnProperty(self, i, v);
  });

  if (element === var_root) {
    self.loading = null;
    self.error = null;
  }
}

function hasDataAttributes(element) {
  for (var i in element.dataset) {
    return true;
  }
}

function getDeclaredVar(element, resetToNull, state) {
  var initValues = {};
  each(varAttrs, function (i, v) {
    if (element.attributes[i]) {
      if (v === true) {
        v = evalAttr(element, i, false, state);

        if (!isPlainObject(v)) {
          return;
        }
      } // @ts-ignore: v should be object


      for (var j in v) {
        initValues[j] = v[j] === undefined || resetToNull ? null : v[j];
      }
    }
  });
  return initValues;
}

function findVarContext(varname, element) {
  element = element || var_root;

  for (var s = tree.getNode(element); s !== null; s = Object.getPrototypeOf(s)) {
    if (util_hasOwnProperty(s, varname)) {
      return s;
    }
  }

  console.warn('Undeclared state: %s', varname, {
    element: element
  });
  return tree.setNode(element);
}
/**
 * @param {string} varname
 * @param {Element} element
 */


function getVarScope(varname, element) {
  var context = findVarContext(varname, element);
  return context.element;
}
/**
 * @param {Element | string} element
 * @param {any} name
 * @param {any=} value
 */

function setVar(element, name, value) {
  var values = name && (isPlainObject(name) || kv(name, value));
  var hasUpdated = false;

  if (typeof element === 'string') {
    batch(function () {
      jquery(element).each(function (i, v) {
        // @ts-ignore: boolean arithmetics
        hasUpdated |= setVar(v, values);
      });
    });
  } else {
    var state = tree.setNode(element);
    each(values || evalAttr(element, 'set-var'), function (i, v) {
      if (state[i] !== v) {
        var node = findVarContext(i, element);
        node[i] = v;
        hasUpdated = true;
        markUpdated(node.element);
      }
    });

    if (hasUpdated && appReady) {
      setImmediateOnce(processStateChange);
    }
  }

  return !!hasUpdated;
}
/**
 * @param {Element} element
 * @param {any} name
 * @param {any=} value
 */

function declareVar(element, name, value) {
  var values = isPlainObject(name) || kv(name, value);
  var context = tree.setNode(element);
  var newValues = {};

  for (var i in values) {
    if (isFunction(values[i])) {
      defineGetterProperty(context, i, values[i], noop);
    } else {
      defineOwnProperty(context, i, context[i]);
      newValues[i] = values[i];
    }
  }

  return setVar(element, newValues);
}
/**
 * @param {Element} element
 * @param {boolean=} resetToNull
 */

function resetVar(element, resetToNull) {
  batch(function () {
    each(tree.descendants(element), function (i, v) {
      setVar(v.element, getDeclaredVar(v.element, resetToNull));
    });
  });
}
/**
 * @param {Element} element
 * @param {string|boolean=} name
 */

function getVar(element, name) {
  var values = hasDataAttributes(element) ? tree.setNode(element) : tree.getNode(element) || {};

  if (name !== true) {
    return name ? values[name] : extend({}, values);
  } // @ts-ignore: element property exists on tree node


  if (values.element !== element) {
    return {};
  }

  var keys = Object.getOwnPropertyNames(values);
  keys.splice(keys.indexOf('element'), 1);
  return pick(values, keys);
}
/**
 * @param {string} template
 * @param {any} context
 * @param {Element} element
 * @param {string} attrName
 * @param {boolean=} templateMode
 */

function evaluate(template, context, element, attrName, templateMode) {
  var options = {
    globals: {
      app: app
    }
  };
  var result = templateMode ? htmlDecode(waterpipe(template, extend({}, context), options)) : waterpipe.eval(template, extend({}, context), options);
  return result;
}
/**
 * @param {Element} element
 * @param {string} attrName
 * @param {boolean=} templateMode
 * @param {VarContext=} context
 */

function evalAttr(element, attrName, templateMode, context) {
  var str = element.getAttribute(attrName);

  if (!str) {
    return templateMode ? '' : null;
  }

  return evaluate(str, context || getVar(element), element, attrName, templateMode);
}
tree.on('update', function (e) {
  each(e.updatedNodes, function (i, v) {
    markUpdated(v.element);
  });
});
// CONCATENATED MODULE: ./tmp/zeta-dom/observe.js

var observe_zeta$dom = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom,
    observe = observe_zeta$dom.observe,
    registerCleanup = observe_zeta$dom.registerCleanup,
    createAutoCleanupMap = observe_zeta$dom.createAutoCleanupMap,
    afterDetached = observe_zeta$dom.afterDetached,
    watchElements = observe_zeta$dom.watchElements,
    watchAttributes = observe_zeta$dom.watchAttributes;

// CONCATENATED MODULE: ./src/include/zeta-dom/observe.js

// CONCATENATED MODULE: ./src/domAction.js
















var SELECTOR_FOCUSABLE = 'button,input,select,textarea,[contenteditable],a[href],area[href],iframe';
var SELECTOR_TABROOT = '[is-flyout]:not([tab-through]),[tab-root]';
var domAction_root = zeta_dom_dom.root;
var flyoutStates = new Map();
var executedAsyncActions = new Map();
/** @type {Zeta.Dictionary<Zeta.AnyFunction>} */

var asyncActions = {};
/**
 * @param {string} attr
 * @param {(this: Element, e: JQuery.UIEventBase) => Brew.PromiseOrEmpty} callback
 */

function addAsyncAction(attr, callback) {
  asyncActions[attr] = throwNotFunction(callback);
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

    if (state) {
      flyoutStates.delete(v);
      releaseModal(v);
      state.resolve(value);

      if (state.source) {
        setClass(state.source, 'target-opened', false);
      }
    }

    return catchAsync(v.attributes['animate-out'] ? (setClass(v, 'closing', true), animateOut(v, 'open')) : runCSSTransition(v, 'closing')).then(function () {
      setClass(v, {
        open: false,
        closing: false,
        visible: false
      });
    });
  }));
}
/**
 * @param {string} selector
 * @param {any=} states
 * @param {Element=} source
 * @param {boolean=} closeIfOpened
 */

function openFlyout(selector, states, source, closeIfOpened) {
  var container = source || domAction_root;
  var element = selector ? selectClosestRelative(selector, container) : jquery(container).closest('[is-flyout]')[0];

  if (!element) {
    return reject();
  }

  var prev = flyoutStates.get(element);

  if (prev) {
    if (closeIfOpened) {
      // @ts-ignore: can accept if no such property
      closeFlyout(element, source && waterpipe.eval('`' + source.value));
    } else {
      // @ts-ignore: extended app property
      prev.path = app.path;
    }

    return prev.promise;
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

  if (source) {
    setClass(source, 'target-opened', true);
    retainFocus(element, source);
  }

  if (states) {
    setVar(element, states);
  }

  setClass(element, 'visible', true);
  runCSSTransition(element, 'open', function () {
    dom_focus(element);
  });
  animateIn(element, 'open');

  if (element.attributes['is-modal']) {
    preventLeave(element, promise);
    setModal(element);
  }

  var closeHandler = function closeHandler(e) {
    var swipeDismiss = element.getAttribute('swipe-dismiss');

    if (e.type === 'focusout' ? !swipeDismiss : e.data === camel('swipe-' + swipeDismiss)) {
      closeFlyout(element);

      if (zeta_dom_dom.event) {
        zeta_dom_dom.event.preventDefault();
      }

      e.handled();
    }
  };

  always(promise, zeta_dom_dom.on(element, {
    focusout: closeHandler,
    gesture: closeHandler
  }));
  return promise;
}
addAsyncAction('validate', function (e) {
  var target = selectClosestRelative(this.getAttribute('validate') || '', e.target);

  if (target) {
    // @ts-ignore: type inference issue
    var valid = zeta_dom_dom.emit('validate', target) || !target.checkValidity || target.checkValidity();

    if (!valid) {
      e.stopImmediatePropagation();
      e.preventDefault();
    } else if (isThenable(valid)) {
      return valid.then(function (valid) {
        if (!valid) {
          throw errorWithCode(validationFailed);
        }
      });
    }
  }
});
addAsyncAction('context-method', function (e) {
  var self = e.currentTarget;
  var method = camel(self.getAttribute('context-method') || '');

  if (isFunction(app[method])) {
    var formSelector = self.getAttribute('context-form'); // @ts-ignore: acceptable if self.form is undefined

    var form = formSelector ? selectClosestRelative(formSelector, self) : self.form;
    var params;
    var valid = true;

    if (form) {
      valid = zeta_dom_dom.emit('validate', form) || form.checkValidity();
      params = [getFormValues(form)];
    } else {
      params = makeArray(evalAttr(self, 'method-args'));
    }

    return resolveAll(valid, function (valid) {
      if (!valid) {
        throw errorWithCode(validationFailed);
      }

      return app[method].apply(app, params);
    });
  }
});
zeta_dom_dom.ready.then(function () {
  var tabindexMap = new WeakMap();
  var tabRoot = domAction_root;

  function setTabIndex(nodes) {
    jquery(nodes || SELECTOR_FOCUSABLE).each(function (i, v) {
      var closest = jquery(v).closest(SELECTOR_TABROOT)[0] || domAction_root;

      if (closest !== tabRoot) {
        if (!tabindexMap.has(v)) {
          tabindexMap.set(v, v.tabIndex);
        }

        v.tabIndex = -1;
      } else {
        jquery(v).attr('tabindex', mapRemove(tabindexMap, v) || null);
      }
    });
  }

  zeta_dom_dom.on('focuschange', function () {
    var newRoot = any(jquery(SELECTOR_TABROOT).get().reverse(), function (v) {
      return focused(v);
    }) || domAction_root;

    if (newRoot !== tabRoot) {
      tabRoot = newRoot;
      setTabIndex();
    }
  });
  watchElements(domAction_root, SELECTOR_FOCUSABLE, setTabIndex, true);
  app.on('mounted', function (e) {
    jquery(selectIncludeSelf(selectorForAttr(asyncActions), e.target)).attr('async-action', '');
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
  jquery('body').on('submit', 'form:not([action])', function (e) {
    e.preventDefault();
  });
  jquery('body').on('click', '[disabled], .disabled, :disabled', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
  });
  jquery('body').on('click', '[async-action]', function (e) {
    var element = e.currentTarget;
    var executed = mapGet(executedAsyncActions, element, Array);
    var callback = null;
    each(asyncActions, function (i, v) {
      if (element.attributes[i] && executed.indexOf(v) < 0) {
        callback = v;
        return false;
      }
    });

    if (!callback) {
      executedAsyncActions.delete(element);
    } else {
      executed.push(callback); // @ts-ignore: type inference issue

      var returnValue = callback.call(element, e);

      if (isThenable(returnValue) && !e.isImmediatePropagationStopped()) {
        e.stopImmediatePropagation();
        e.preventDefault();
        handleAsync(returnValue).then(function () {
          dispatchDOMMouseEvent(e);
        }, function (e) {
          executedAsyncActions.delete(element);
          console.warn('Action threw an error:', e);
        });
      }
    }
  });
  jquery('body').on('click', 'a[href]:not([rel]), [data-href]', function (e) {
    if (e.isDefaultPrevented()) {
      return;
    }

    var self = e.currentTarget;
    var href = self.getAttribute('data-href') || self.getAttribute('href');
    e.preventDefault();
    e.stopPropagation();

    if (self.getAttribute('target') === '_blank') {
      window.open(href, randomId());
    } else {
      var navigate = function navigate() {
        if (!('navigate' in app) || /^([a-z0-9]+:|\/\/)/.test(href)) {
          location.href = href;
        } else {
          // @ts-ignore: app.navigate checked for truthiness
          app.navigate(href);
        }
      };

      var modalParent = jquery(self).closest('[is-modal]')[0];

      if (modalParent) {
        // handle links inside modal popup
        // this will return the promise which is resolved after modal popup is closed and release the lock
        openFlyout(modalParent).then(navigate);
        closeFlyout(modalParent);
      } else {
        // @ts-ignore: app.navigate checked for truthiness
        navigate();
        closeFlyout();
      }
    }
  });
  jquery('body').on('click', '[set-var]:not([match-path])', function (e) {
    var self = e.currentTarget;

    if (self === jquery(e.target).closest('[set-var]')[0]) {
      setVar(self);
      closeFlyout();
    }
  });
  jquery('body').on('click', '[toggle]', function (e) {
    var self = e.currentTarget;
    e.stopPropagation();

    if (!self.attributes['toggle-if'] || evalAttr(self, 'toggle-if')) {
      openFlyout(self.getAttribute('toggle'), null, self, true);
    }
  });
  jquery('body').on('click', '[toggle-class]', function (e) {
    var self = e.currentTarget;
    e.stopPropagation();

    if (!self.attributes['toggle-if'] || evalAttr(self, 'toggle-if')) {
      var selector = self.getAttribute('toggle-class-for');
      var target = selector ? selectClosestRelative(selector, self) : e.currentTarget;
      each(self.getAttribute('toggle-class'), function (i, v) {
        setClass(target, v.slice(1), v[0] === '+');
      });
    }
  });
});
// CONCATENATED MODULE: ./src/domReady.js







var ATTR_LOADING_SCOPE = 'loading-scope';
var ATTR_ERROR_SCOPE = 'error-scope';
var domReady_root = zeta_dom_dom.root;
zeta_dom_dom.ready.then(function () {
  jquery('[brew-template]').each(function (i, v) {
    addTemplate(v.getAttribute('brew-template') || '', v.cloneNode(true));
  });
  jquery('apply-attributes').each(function (i, v) {
    var $target = jquery(v.getAttribute('elements') || '', v.parentNode || domReady_root);
    each(v.attributes, function (i, v) {
      if (v.name !== 'elements') {
        $target.each(function (i, w) {
          w.setAttribute(v.name, v.value);
        });
      }
    });
  }).remove();

  window.onbeforeunload = function (e) {
    if (dom_preventLeave(true)) {
      e.returnValue = '';
      e.preventDefault();
    }
  };

  watchElements(domReady_root, selectorForAttr([ATTR_LOADING_SCOPE, ATTR_ERROR_SCOPE]), function (addedNodes) {
    each(addedNodes, function (i, v) {
      zeta_dom_dom.lock(v);
      zeta_dom_dom.on(v, {
        asyncStart: function asyncStart() {
          if (hasAttr(v, ATTR_LOADING_SCOPE)) {
            setVar(v, 'loading', true);
          }

          if (hasAttr(v, ATTR_ERROR_SCOPE)) {
            setVar(v, 'error', null);
          }
        },
        asyncEnd: function asyncEnd() {
          if (hasAttr(v, ATTR_LOADING_SCOPE)) {
            setVar(v, 'loading', false);
          }
        },
        error: function error(e) {
          if (hasAttr(v, ATTR_ERROR_SCOPE)) {
            var error = e.error || {};
            setVar(v, 'error', error.code || error.message || true);
          }
        }
      });
    });
  }, true);

  if (hasAttr(domReady_root, ATTR_LOADING_SCOPE)) {
    setVar(domReady_root, 'loading', 'initial');
  }
});
/* harmony default export */ const src_domReady = (null);
// CONCATENATED MODULE: ./src/core.js
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }













function with_() {
  var fn = this.bind.apply(src_app, [0].concat(map(arguments, function (v) {
    if (isPlainObject(v)) {
      return function (app) {
        util_define(app, v);
      };
    }

    return isFunction(v) || noop;
  })));
  util_define(fn, method);
  return fn;
}

var method = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({
  ErrorCode: errorCode_namespaceObject,
  defaults: src_defaults
}, common_namespaceObject), path_namespaceObject), anim_namespaceObject), domAction_namespaceObject), {}, {
  getVar: getVar,
  setVar: setVar,
  declareVar: declareVar,
  evalAttr: evalAttr,
  isElementActive: isElementActive,
  handleAsync: handleAsync,
  preventLeave: dom_preventLeave,
  install: install,
  addDetect: addDetect,
  addExtension: addExtension,
  addTemplate: addTemplate,
  with: with_
});

util_define(src_app, method);
/* harmony default export */ const core = (src_app);
// CONCATENATED MODULE: ./src/extension/config.js



/* harmony default export */ const config = (addExtension('config', function (app, options) {
  var config = watchable();
  util_define(app, {
    config: config
  });
  app.beforeInit(getJSON(options.path).catch(isFunction(options.fallback) || null).then(function (d) {
    extend(config, d);

    if (options.freeze) {
      deepFreeze(config);
    }
  }));
}));
// CONCATENATED MODULE: ./src/extension/formVar.js







/* harmony default export */ const formVar = (addExtension(true, 'formVar', function (app) {
  app.matchElement('form[form-var]', function (form) {
    var varname = form.getAttribute('form-var');
    var values = {};

    var update = function update(updateField) {
      if (updateField) {
        // @ts-ignore: form must be HTMLFormElement
        values = getFormValues(form);
      }

      if (!varname) {
        setVar(form, values);
      } else {
        var currentValues = getVar(form, varname) || {};

        if (!equal(values, pick(currentValues, keys(values)))) {
          setVar(form, varname, extend({}, currentValues, values));
        }
      }
    };

    watchAttributes(form, 'value', function () {
      setImmediateOnce(update);
    });
    watchElements(form, ':input', function (addedInputs) {
      each(addedInputs, function (i, v) {
        var detached = afterDetached(v, form);
        bindUntil(detached, v, 'change input', function () {
          setImmediateOnce(update);
        });
        detached.then(update.bind(null, true));
      });
      update(true);
    }, true);
    app.on(form, 'reset', function () {
      if (varname) {
        if (!isElementActive(getVarScope(varname, form))) {
          // @ts-ignore: form must be HTMLFormElement
          form.reset();
        }
      } else {
        // @ts-ignore: form must be HTMLFormElement
        each(form.elements, function (i, v) {
          if (!isElementActive(getVarScope(v.name, form))) {
            v.value = null;
          }
        });
      }

      return true;
    });
  });
  app.on('pageenter', function (e) {
    jquery(selectIncludeSelf('form[form-var]', e.target)).each(function (i, v) {
      jquery(':input:eq(0)', v).trigger('change');
    });
  });
}));
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
  }) || defaultLanguage || keys(languages)[0];
}

/* harmony default export */ const i18n = (addExtension('i18n', function (app, options) {
  var languages = toDictionary(options.languages);
  var routeParam = app.route && options.routeParam;

  var cookie = options.cookie && common_cookie(options.cookie, 86400000);

  var language = getCanonicalValue(languages, routeParam && app.route[routeParam]) || getCanonicalValue(languages, cookie && cookie.get()) || detectLanguage(languages, options.defaultLanguage);

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
// CONCATENATED MODULE: ./src/extension/login.js




/* harmony default export */ const login = (addExtension('login', function (app, options) {
  options = extend({
    loginPagePath: '',
    defaultRedirectPath: '',
    cookie: '',
    expiry: 0,
    logout: null,
    login: null,
    tokenLogin: null,
    getTokenFromResponse: null
  }, options);
  var authCookie = common_cookie(options.cookie, options.expiry);
  var setLoggedIn = defineObservableProperty(app, 'loggedIn', false, true);

  function handleLogin(response) {
    setLoggedIn(true);

    if (isFunction(options.getTokenFromResponse)) {
      authCookie.set(options.getTokenFromResponse(response));
    }

    app.emit('login', {
      data: response
    });
  }

  function handleLogout() {
    setLoggedIn(false);
    authCookie.delete();
    app.emit('logout');
  }

  var redirectPath = app.initialPath;
  var previousToken = authCookie.get();

  if (previousToken && isFunction(options.tokenLogin)) {
    app.beforeInit(catchAsync(resolveAll(options.tokenLogin(previousToken), handleLogin)));
  }

  app.define({
    login: function login(params, nextPath, callback) {
      callback = isFunction(callback || nextPath);
      nextPath = typeof nextPath === 'string' && nextPath;
      return resolveAll(options.login(params)).then(function (d) {
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
    logout: function logout(nextPath, callback) {
      if (!app.loggedIn) {
        return resolve();
      }

      callback = isFunction(callback || nextPath);
      nextPath = typeof nextPath === 'string' && nextPath;
      return resolve(dom_preventLeave()).then(function () {
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

    if (either(app.loggedIn, e.pathname !== loginPagePath)) {
      if (app.loggedIn) {
        app.navigate(options.defaultRedirectPath);
      } else {
        redirectPath = e.pathname;
        app.navigate(loginPagePath);
      }
    }
  });
}));
// CONCATENATED MODULE: ./src/extension/preloadImage.js






var preloadImage_IMAGE_STYLE_PROPS = 'background-image'.split(' ');
src_defaults.preloadImage = true;
/* harmony default export */ const preloadImage = (addExtension('preloadImage', function (app) {
  app.beforeUpdate(function (domUpdates) {
    var urls = {};
    each(domUpdates, function (element, props) {
      if ((props.src || props.style) && isElementActive(element)) {
        if (props.src) {
          urls[toAbsoluteUrl(props.src)] = true;
        }

        if (props.style) {
          each(preloadImage_IMAGE_STYLE_PROPS, function (i, v) {
            // @ts-ignore: props.style checked for truthiness
            var imageUrl = isCssUrlValue(props.style[v]);

            if (imageUrl) {
              urls[toAbsoluteUrl(imageUrl)] = true;
            }
          });
        }
      }
    });
    return preloadImages(keys(urls), 200);
  });
  app.beforePageEnter(function (element) {
    return preloadImages(element, 1000);
  });
}));
// CONCATENATED MODULE: ./src/extension/scrollable.js









/* harmony default export */ const scrollable = (addExtension('scrollable', function (app, defaultOptions) {
  defaultOptions = extend({
    bounce: false
  }, defaultOptions); // @ts-ignore: non-standard member

  var DOMMatrix = window.DOMMatrix || window.WebKitCSSMatrix || window.MSCSSMatrix;
  var store = createPrivateStore();
  var id = 0;

  function getState(container) {
    return store(container) || store(container, {
      childClass: 'scrollable-target-' + ++id
    });
  }

  function initScrollable(container) {
    var childClass = getState(container).childClass;
    var dir = container.getAttribute('scrollable');
    var paged = container.getAttribute('scroller-snap-page') || '';
    var varname = container.getAttribute('scroller-state') || '';
    var selector = container.getAttribute('scroller-page') || '';
    var persistScroll = container.hasAttribute('persist-scroll');
    var savedOffset = {};
    var scrolling = false;
    var needRefresh = false;
    var isControlledScroll; // @ts-ignore: signature ignored

    jquery(container).scrollable(extend({}, defaultOptions, {
      handle: matchWord(dir, 'auto scrollbar content') || 'content',
      hScroll: !matchWord(dir, 'y-only'),
      vScroll: !matchWord(dir, 'x-only'),
      content: '.' + getState(container).childClass + ':visible:not(.disabled)',
      pageItem: selector,
      snapToPage: paged === 'always' || paged === app.orientation,
      scrollStart: function scrollStart(e) {
        if (zeta_dom_dom.eventSource !== 'script') {
          delete savedOffset[history.state];
        }

        app.emit('scrollStart', container, e, true);
      },
      scrollMove: function scrollMove(e) {
        app.emit('scrollMove', container, e, true);
      },
      scrollEnd: function scrollEnd(e) {
        app.emit('scrollStop', container, e, true);
      }
    }));
    registerCleanup(container, function () {
      jquery(container).scrollable('destroy');
    });
    registerCleanup(container, zeta_dom_dom.on(container, {
      drag: function drag() {
        beginDrag();
      },
      getContentRect: function getContentRect(e) {
        if (e.target === container || jquery(e.target).closest('.' + childClass)[0]) {
          var rect = getRect(container);
          var padding = jquery(container).scrollable('scrollPadding');
          rect.top += padding.top;
          rect.left += padding.left;
          rect.right -= padding.right;
          rect.bottom -= padding.bottom;
          return rect;
        }
      },
      scrollBy: function scrollBy(e) {
        jquery(container).scrollable('stop');
        var origX = jquery(container).scrollable('scrollLeft');
        var origY = jquery(container).scrollable('scrollTop');
        jquery(container).scrollable('scrollBy', e.x, e.y, 200);
        return {
          x: origX - jquery(container).scrollable('scrollLeft'),
          y: origY - jquery(container).scrollable('scrollTop')
        };
      }
    }));

    function getItem(index) {
      return selector && jquery(selector, container).get()[index];
    }

    function setState(index) {
      if (varname) {
        var obj = {};
        obj[varname] = index;
        setVar(container, obj);
      }
    }

    function scrollTo(index, align) {
      var item = getItem(index);
      align = align || 'center top';

      if (!scrolling && isVisible(container) && item) {
        scrolling = true;
        isControlledScroll = true;
        setState(index);
        jquery(container).scrollable('scrollToElement', item, align, align, 200, function () {
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
          scrollTo(getVar(container, varname));
        }
      }
    }

    if (selector) {
      if (paged !== 'always') {
        registerCleanup(container, app.on('orientationchange', function () {
          jquery(container).scrollable('setOptions', {
            snapToPage: paged === app.orientation
          });
        }));
      }

      if (varname) {
        registerCleanup(container, app.on(container, {
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
        registerCleanup(container, bind(window, 'resize', function () {
          clearTimeout(timeout);
          timeout = setTimeout(refresh, 200);
        }));
      }
    }

    if (persistScroll) {
      var hasAsync = false;

      var restoreScroll = function restoreScroll() {
        var offset = savedOffset[history.state];

        if (offset) {
          jquery(container).scrollable('scrollTo', offset.x, offset.y, 0);
        }
      };

      registerCleanup(container, combineFn(zeta_dom_dom.on('asyncStart', function () {
        hasAsync = true;
      }), zeta_dom_dom.on('asyncEnd', function () {
        hasAsync = false;
        restoreScroll();
      }), app.on('navigate', function (e) {
        savedOffset[e.oldStateId] = {
          x: jquery(container).scrollable('scrollLeft'),
          y: jquery(container).scrollable('scrollTop')
        };
        setTimeout(function () {
          if (!hasAsync) {
            restoreScroll();
          }
        });
      })));
    }
  }

  app.on('ready', function () {
    watchElements(zeta_dom_dom.root, selectorForAttr(['scrollable', 'scrollable-target']), function (nodes) {
      jquery(nodes).filter('[scrollable-target]').each(function (i, v) {
        var scrollable = jquery(v).closest('[scrollable]')[0];

        if (scrollable) {
          jquery(v).addClass(getState(scrollable).childClass);
        }
      });
      jquery(nodes).filter('[scrollable]').each(function (i, v) {
        initScrollable(v);
        jquery(v).scrollable(focusable(v) ? 'enable' : 'disable');
      });
    });
  }); // update scroller on events other than window resize

  function refresh() {
    jquery('[scrollable]:visible').scrollable('refresh');
  }

  app.on('statechange orientationchange animationcomplete', function () {
    setTimeoutOnce(refresh);
  });
  app.on('pageenter', function (e) {
    var $scrollables = jquery(selectIncludeSelf('[scrollable]', e.target)).add(jquery(e.target).parents('[scrollable]'));
    jquery(selectIncludeSelf('[scrollable-target]', e.target)).each(function (i, v) {
      jquery(v).toggleClass('disabled', !isElementActive(v));
    });
    $scrollables.scrollable('refresh');
    $scrollables.filter(':not([keep-scroll-offset])').scrollable('scrollTo', 0, 0);
  }); // scroll-into-view animation trigger

  function updateScrollIntoView() {
    jquery('[animate-on~="scroll-into-view"]:visible').each(function (i, v) {
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
    jquery('[scrollable]').each(function (i, v) {
      jquery(v).scrollable(focusable(v) ? 'enable' : 'disable');
    });
  });
  zeta_dom_dom.on('keystroke', function (e) {
    var originalEvent = zeta_dom_dom.event;

    if (zeta_dom_dom.modalElement && originalEvent && originalEvent.target === document.body && matchWord(e.data, 'space pageUp pageDown leftArrow rightArrow upArrow downArrow')) {
      var target = selectIncludeSelf('[scrollable]', zeta_dom_dom.modalElement)[0];

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
// CONCATENATED MODULE: ./src/entry.js









function exportAppToGlobal(app) {
  window.app = app;
}

/* harmony default export */ const entry = (core.with(exportAppToGlobal, config, formVar, i18n, login, preloadImage, scrollable, viewport));

/***/ }),

/***/ 860:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// @ts-nocheck

/** @type {JQueryStatic} */
var jQuery = window.jQuery || __webpack_require__(609);

module.exports = jQuery;

try {
  __webpack_require__(172);
} catch (e) {}

/***/ }),

/***/ 424:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// @ts-nocheck

/** @type {PromiseConstructor} */
var Promise = window.Promise || __webpack_require__(804).default;

module.exports = Promise;

/***/ }),

/***/ 256:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// @ts-nocheck

/** @type {Waterpipe} */
var waterpipe = window.waterpipe || __webpack_require__(160);

module.exports = waterpipe; // assign to a new variable to avoid incompatble declaration issue by typescript compiler

var waterpipe_ = waterpipe;

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

/***/ }),

/***/ 609:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__609__;

/***/ }),

/***/ 172:
/***/ (function(module) {

"use strict";
if(typeof __WEBPACK_EXTERNAL_MODULE__172__ === 'undefined') { var e = new Error("Cannot find module 'jq-scrollable'"); e.code = 'MODULE_NOT_FOUND'; throw e; }

module.exports = __WEBPACK_EXTERNAL_MODULE__172__;

/***/ }),

/***/ 804:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__804__;

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
/******/ 	return __webpack_require__(607);
/******/ })()
.default;
});
//# sourceMappingURL=brew.js.map