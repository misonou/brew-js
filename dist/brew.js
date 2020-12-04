(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("zeta-dom")["util"], require("jQuery"), require("promise-polyfill"), require("zeta-dom")["css"], require("zeta-dom")["dom"], require("waterpipe"), require("historyjs"), require("zeta-dom"), require("zeta-dom"));
	else if(typeof define === 'function' && define.amd)
		define("brew", [["zeta-dom","util"], "jQuery", "promise-polyfill", ["zeta-dom","css"], ["zeta-dom","dom"], "waterpipe", "historyjs", ["zeta-dom"], "zeta-dom"], factory);
	else if(typeof exports === 'object')
		exports["brew"] = factory(require("zeta-dom")["util"], require("jQuery"), require("promise-polyfill"), require("zeta-dom")["css"], require("zeta-dom")["dom"], require("waterpipe"), require("historyjs"), require("zeta-dom"), require("zeta-dom"));
	else
		root["brew"] = factory(root["zeta"]["util"], root["jQuery"], root["promise-polyfill"], root["zeta"]["css"], root["zeta"]["dom"], root["waterpipe"], root["History"], root["zeta"], root["zeta"]);
})(self, function(__WEBPACK_EXTERNAL_MODULE__990__, __WEBPACK_EXTERNAL_MODULE__609__, __WEBPACK_EXTERNAL_MODULE__804__, __WEBPACK_EXTERNAL_MODULE__260__, __WEBPACK_EXTERNAL_MODULE__50__, __WEBPACK_EXTERNAL_MODULE__160__, __WEBPACK_EXTERNAL_MODULE__229__, __WEBPACK_EXTERNAL_MODULE__668__, __WEBPACK_EXTERNAL_MODULE__163__) {
return /******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 304:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ src; }
});

// NAMESPACE OBJECT: ./src/util/path.js
var path_namespaceObject = {};
__webpack_require__.r(path_namespaceObject);
__webpack_require__.d(path_namespaceObject, {
  "baseUrl": function() { return baseUrl; },
  "combinePath": function() { return combinePath; },
  "isSubPathOf": function() { return isSubPathOf; },
  "normalizePath": function() { return normalizePath; },
  "setBaseUrl": function() { return setBaseUrl; },
  "toAbsoluteUrl": function() { return toAbsoluteUrl; },
  "toRelativeUrl": function() { return toRelativeUrl; },
  "withBaseUrl": function() { return withBaseUrl; }
});

// NAMESPACE OBJECT: ./src/util/common.js
var common_namespaceObject = {};
__webpack_require__.r(common_namespaceObject);
__webpack_require__.d(common_namespaceObject, {
  "addStyleSheet": function() { return addStyleSheet; },
  "api": function() { return api; },
  "cookie": function() { return cookie; },
  "copyAttr": function() { return copyAttr; },
  "deleteCookie": function() { return deleteCookie; },
  "getAttrValues": function() { return getAttrValues; },
  "getCookie": function() { return getCookie; },
  "getFormValues": function() { return getFormValues; },
  "getJSON": function() { return getJSON; },
  "getQueryParam": function() { return getQueryParam; },
  "loadScript": function() { return loadScript; },
  "preloadImages": function() { return preloadImages; },
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
 * @param {boolean=} resolveDotDir
 */

function normalizePath(path, resolveDotDir) {
  if (path === undefined || path === null) {
    return '/';
  }

  if (/:\/\/|\?|#/.test(path)) {
    var a = document.createElement('a');
    a.href = path;
    return a.origin + normalizePath(a.pathname, resolveDotDir) + a.search + a.hash;
  }

  path = String(path).replace(/\/+(\/|$)/, '$1');

  if (resolveDotDir && path.indexOf('./') >= 0) {
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

    path = segments.join('/');
  }

  return path[0] === '/' ? path : '/' + path;
}
/**
 * @param {string} url
 */

function withBaseUrl(url) {
  url = normalizePath(url);
  return baseUrl && url[0] === '/' && !isSubPathOf(url, baseUrl) ? normalizePath(baseUrl + url) : url;
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
  return a.substr(0, b.length) === b && (a.length === b.length || a[b.length] === '/');
}
// EXTERNAL MODULE: ./src/include/jquery.cjs
var jquery = __webpack_require__(889);
// EXTERNAL MODULE: ./src/include/promise-polyfill.cjs
var promise_polyfill = __webpack_require__(511);
// EXTERNAL MODULE: external {"commonjs":["zeta-dom","css"],"commonjs2":["zeta-dom","css"],"amd":["zeta-dom","css"],"root":["zeta","css"]}
var external_commonjs_zeta_dom_css_commonjs2_zeta_dom_css_amd_zeta_dom_css_root_zeta_css_ = __webpack_require__(260);
// CONCATENATED MODULE: ./src/include/zeta/cssUtil.js

// CONCATENATED MODULE: ./src/include/zeta/domUtil.js

// CONCATENATED MODULE: ./src/util/common.js
// @ts-nocheck






/** @type {Zeta.Dictionary<Promise<void>>} */

var preloadImagesCache = {};
/** @type {Zeta.Dictionary<Promise<Zeta.Dictionary>>} */

var loadScriptCache = {};
function getAttrValues(element) {
  var values = {};
  /* non-default import from default-exporting module */undefined(element.attributes, function (i, v) {
    values[v.name] = v.value;
  });
  return values;
}
function setAttr(element, name, value) {
  /* non-default import from default-exporting module */undefined(/* non-default import from default-exporting module */undefined(name) || /* non-default import from default-exporting module */undefined(name, value), function (i, v) {
    element.setAttribute(i, v);
  });
}
function copyAttr(src, dst) {
  /* non-default import from default-exporting module */undefined(src.attributes, function (i, v) {
    dst.setAttribute(v.name, v.value);
  });
}
/**
 * @param {HTMLFormElement} form
 */

function getFormValues(form) {
  var values = {};
  /* non-default import from default-exporting module */undefined(form.elements, function (i, v) {
    if (v.name && !(v.name in values)) {
      var item = form.elements[v.name];
      /* non-default import from default-exporting module */undefined(values, v.name, function () {
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

  if (typeof options === 'string' && /* non-default import from default-exporting module */undefined(options, httpMethods)) {
    extra = /* non-default import from default-exporting module */undefined({}, typeof extra === 'string' ? {
      baseUrl: extra
    } : extra, {
      methods: options
    });
    return api(extra)[options];
  }

  options = /* non-default import from default-exporting module */undefined({}, options);
  var obj = {
    baseUrl: options.baseUrl,
    token: options.token
  };
  /* non-default import from default-exporting module */undefined(options.methods || httpMethods, function (i, v) {
    if (/* non-default import from default-exporting module */undefined(v, httpMethods)) {
      /* non-default import from default-exporting module */undefined(obj, v, function request(method, data) {
        if (!obj.baseUrl) {
          return /* non-default import from default-exporting module */undefined(obj, 'baseUrl', function () {
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
            if (/* non-default import from default-exporting module */undefined(options.getTokenFromResponse)) {
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
      /* non-default import from default-exporting module */undefined(obj[v], 'baseUrl', obj);
      /* non-default import from default-exporting module */undefined(obj[v], 'token', obj);
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
  if (/* non-default import from default-exporting module */undefined(url)) {
    return url.reduce(function (v, a) {
      return v.then(function () {
        return loadScript(a, options);
      });
    }, /* non-default import from default-exporting module */undefined());
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
        reject();
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
  if (!/* non-default import from default-exporting module */undefined(urls)) {
    var map = {};

    var testValue = function testValue(value) {
      if (/* non-default import from default-exporting module */undefined(value)) {
        map[RegExp.$1 || RegExp.$2 || RegExp.$3] = true;
      }
    };

    /* non-default import from default-exporting module */undefined(/* non-default import from default-exporting module */undefined(urls, 1), function (node) {
      if (/* non-default import from default-exporting module */undefined(node, 'img') && node.src) {
        map[node.src] = true;
      }

      testValue(getComputedStyle(node).backgroundImage);
      testValue(getComputedStyle(node, '::before').backgroundImage);
      testValue(getComputedStyle(node, '::after').backgroundImage);
    });
    urls = /* non-default import from default-exporting module */undefined(map);
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
    return /* non-default import from default-exporting module */undefined();
  }

  if (preloadUrls.length) {
    console.log('Preload image', {
      urls: preloadUrls
    });
  }

  return /* non-default import from default-exporting module */undefined(/* non-default import from default-exporting module */undefined(/* non-default import from default-exporting module */undefined(preloadImagesCache)), ms, true);
}
// EXTERNAL MODULE: external {"commonjs":["zeta-dom","dom"],"commonjs2":["zeta-dom","dom"],"amd":["zeta-dom","dom"],"root":["zeta","dom"]}
var external_commonjs_zeta_dom_dom_commonjs2_zeta_dom_dom_amd_zeta_dom_dom_root_zeta_dom_ = __webpack_require__(50);
// CONCATENATED MODULE: ./src/include/zeta/dom.js

/* harmony default export */ const dom = (external_commonjs_zeta_dom_dom_commonjs2_zeta_dom_dom_amd_zeta_dom_dom_root_zeta_dom_);
// CONCATENATED MODULE: ./src/anim.js






var customAnimateIn = {};
var customAnimateOut = {};
var animatingElements = new Map();
var nextId = 0;

function handleAnimation(element, elements, promises, trigger) {
  if (!promises.length) {
    return /* non-default import from default-exporting module */undefined();
  }

  var id = ++nextId;
  var timeout, timeoutReject, timeoutResolve;
  promises = promises.map(function (v) {
    return v instanceof promise_polyfill ? /* non-default import from default-exporting module */undefined(v) : new promise_polyfill(function (resolve) {
      v.then(resolve, resolve);
    });
  });
  /* non-default import from default-exporting module */undefined(/* non-default import from default-exporting module */undefined(promises, function () {
    clearTimeout(timeout);
    timeoutResolve();
    animatingElements.delete(element);
    console.log('Animation #%i completed', id);
  }));
  promises.push(new promise_polyfill(function (resolve, reject) {
    timeoutResolve = resolve;
    timeoutReject = reject;
  }));
  timeout = setTimeout(function () {
    timeoutReject('Animation #' + id + ' timed out');
    console.log('Animation #%i might take longer than expected', id, promises);
    animatingElements.delete(element);
  }, 1500);
  var promise = /* non-default import from default-exporting module */undefined(/* non-default import from default-exporting module */undefined(promises));
  console.log('Animation #%i triggered on %s', id, trigger, {
    elements: elements
  });
  animatingElements.set(element, promise);
  return promise;
}

function animateElement(element, cssClass, eventName, customAnimation) {
  var promises = [/* non-default import from default-exporting module */undefined(element, cssClass), dom.emit(eventName, element)];
  var delay = parseFloat(jquery(element).css('transition-delay'));
  /* non-default import from default-exporting module */undefined(customAnimation, function (i, v) {
    if (element.attributes[i]) {
      var attrValue = element.getAttribute(i);
      promises.push(new promise_polyfill(function (resolve, reject) {
        setTimeout(function () {
          /* non-default import from default-exporting module */undefined(v(element, attrValue)).then(resolve, reject);
        }, delay * 1000);
      }));
    }
  });
  return /* non-default import from default-exporting module */undefined(promises, function () {
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

  dom.emit('animationstart', element, {
    animationType: 'in',
    animationTrigger: trigger
  }, true);
  var $innerScope = scope ? jquery(scope, element) : jquery();
  var filter = trigger === 'show' ? ':not([animate-on]), [animate-on~="' + trigger + '"]' : '[animate-on~="' + trigger + '"]';
  var elements = [];
  var promises = [];
  jquery(/* non-default import from default-exporting module */undefined('[animate-in]', element)).filter(filter).each(function (i, v) {
    // @ts-ignore: filterCallback must be function
    if (!$innerScope.find(v)[0] && filterCallback(v) && /* non-default import from default-exporting module */undefined(v)) {
      elements.push(v);
      promises.push(animateElement(v, 'tweening-in', 'animatein', customAnimateIn));
    }
  });
  jquery(/* non-default import from default-exporting module */undefined('[animate-sequence]', element)).filter(filter).each(function (i, v) {
    // @ts-ignore: filterCallback must be function
    if (!$innerScope.find(v)[0] && filterCallback(v) && /* non-default import from default-exporting module */undefined(v)) {
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
    dom.emit('animationcomplete', element, {
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

  dom.emit('animationstart', element, {
    animationType: 'out',
    animationTrigger: trigger
  }, true);
  var $innerScope = scope ? jquery(scope, element) : jquery();
  var filter = trigger === 'show' ? ':not([animate-on]), [animate-on~="' + trigger + '"]' : '[animate-on~="' + trigger + '"]';
  var elements = [];
  var promises = []; // @ts-ignore: type inference issue

  var $target = jquery((excludeSelf ? jquery : /* non-default import from default-exporting module */undefined)('[animate-out]', element)).filter(filter);
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
    var $target = jquery((excludeSelf ? jquery : /* non-default import from default-exporting module */undefined)('[animate-out], .tweening-in, .tweening-out', element));

    if (trigger !== 'show') {
      $target = $target.filter(filter);
    }

    $target = $target.filter(function (i, v) {
      // @ts-ignore: filterCallback must be function
      return filterCallback(v);
    });
    $target.removeClass('tweening-in tweening-out');
    $target.find('[is-animate-sequence]').removeAttr('animate-in').removeClass('tweening-in tweening-out');
    dom.emit('animationcomplete', element, {
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
  customAnimateIn[name] = /* non-default import from default-exporting module */undefined(callback);
}
/**
 * @param {string} name
 * @param {(elm: Element, attrValue: string) => Promise<any>} callback
 */

function addAnimateOut(name, callback) {
  customAnimateOut[name] = /* non-default import from default-exporting module */undefined(callback);
}
// EXTERNAL MODULE: ./src/include/waterpipe.cjs
var waterpipe = __webpack_require__(203);
// CONCATENATED MODULE: ./src/defaults.js
/** @type {Zeta.Dictionary} */
var defaults = {};
/* harmony default export */ const src_defaults = (defaults);
// EXTERNAL MODULE: ./src/include/history.cjs
var include_history = __webpack_require__(715);
// CONCATENATED MODULE: ./src/util/console.js
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }




function toElementTag(element) {
  return element.tagName.toLowerCase() + (element.id ? '#' + element.id : element.className.trim() && element.className.replace(/^\s*|\s+(?=\S)/g, '.'));
}

function truncateJSON(json) {
  return '[{"]'.indexOf(json[0]) >= 0 && json.length > 200 ? json[0] + json.substr(1, 199) + "\u2026" + json[json.length - 1] : json;
}

function formatMessage(eventSource, message) {
  message = /* non-default import from default-exporting module */undefined(message).map(function (v) {
    return /* non-default import from default-exporting module */undefined(v, Element) ? toElementTag(v) + ':' : v && _typeof(v) === 'object' ? truncateJSON(JSON.stringify(v)) : v;
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
// CONCATENATED MODULE: ./src/extension/router.js













var _ = /* non-default import from default-exporting module */undefined();

var matchByPathElements = new Map();
var preloadHandlers = [];
/** @type {Element[]} */

var activeElements = [dom.root];
var pageTitleElement;
/**
 * @param {Element} v
 * @param {Element[]=} arr
 */

function isElementActive(v, arr) {
  var parent = jquery(v).closest('[match-path]')[0];
  return !parent || (arr || activeElements).indexOf(parent) >= 0;
}
/**
 * @param {Zeta.AnyFunction} callback
 */

function hookBeforePageEnter(callback) {
  preloadHandlers.push(/* non-default import from default-exporting module */undefined(callback));
}

function createRouteState(route, segments, params) {
  route = route || [];
  params = /* non-default import from default-exporting module */undefined({}, params);
  delete params.remainingSegments;
  return {
    minPath: normalizePath(segments.slice(0, route.minLength).join('/')),
    maxPath: normalizePath(segments.slice(0, route.length).join('/')),
    route: route,
    params: params
  };
}

function Route(app, routes, initialPath) {
  var self = this;

  var state = _(self, {});

  state.routes = routes.map(function (path) {
    var tokens = [];
    var minLength; // @ts-ignore: no side effect to not return

    String(path).replace(/\/(\*|[^{][^\/]*|\{([a.-z_$][a-z0-9_$]*)(\?)?(?::(?![*+?])((?:(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])([*+?]|\{\d+(?:,\d+)\})?)+))?\})(?=\/|$)/gi, function (v, a, b, c, d) {
      if (c && !minLength) {
        minLength = tokens.length;
      }

      tokens.push(b ? {
        name: b,
        pattern: d ? new RegExp('^' + d + '$', 'i') : /./
      } : a.toLowerCase());
      self[b || 'remainingSegments'] = null;
    });
    /* non-default import from default-exporting module */undefined(tokens, 'value', path);
    /* non-default import from default-exporting module */undefined(tokens, 'exact', !(tokens[tokens.length - 1] === '*' && tokens.splice(-1)));
    /* non-default import from default-exporting module */undefined(tokens, 'minLength', minLength || tokens.length);
    /* non-default import from default-exporting module */undefined(tokens, 'names', /* non-default import from default-exporting module */undefined(tokens, function (v) {
      return v.name;
    }));
    return tokens;
  });
  Object.preventExtensions(self);
  /* non-default import from default-exporting module */undefined(self, self.parse(initialPath));
  state.current = state.lastMatch;
  state.handleChanges = /* non-default import from default-exporting module */undefined(self, true);
  Object.getOwnPropertyNames(self).forEach(function (prop) {
    /* non-default import from default-exporting module */undefined(self, prop);
  });
  /* non-default import from default-exporting module */undefined(self, function () {
    var current = /* non-default import from default-exporting module */undefined(self, ['remainingSegments']);
    var paramChanged = false;
    var routeChanged = !/* non-default import from default-exporting module */undefined(current, state.current.params);

    if (routeChanged && state.lastMatch) {
      state.current = state.lastMatch;
      routeChanged = !/* non-default import from default-exporting module */undefined(current, state.current.params);
    }

    if (routeChanged) {
      var segments = [],
          i,
          len;
      var matched = /* non-default import from default-exporting module */undefined(state.routes, function (tokens) {
        segments.length = 0;

        for (i = 0, len = tokens.length; i < len; i++) {
          var varname = tokens[i].name;

          if (varname && i < tokens.minLength && !tokens[i].pattern.test(self[varname] || '')) {
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

/* non-default import from default-exporting module */undefined(Route, {
  parse: function parse(path) {
    var self = this;

    var state = _(self);

    var segments = normalizePath(path).slice(1).split('/');
    var params = {};
    var matched = /* non-default import from default-exporting module */undefined(state.routes, function (tokens) {
      params = {};

      if (segments.length < tokens.minLength) {
        return false;
      }

      for (var i = 0, len = tokens.length; i < len; i++) {
        var varname = tokens[i].name;

        if (segments[i] && !(varname ? tokens[i].pattern.test(segments[i]) : /* non-default import from default-exporting module */undefined(segments[i], tokens[i]))) {
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
  set: function set(params) {
    var self = this;

    if (typeof params === 'string') {
      if (/* non-default import from default-exporting module */undefined(params, self.toString())) {
        return;
      }

      params = self.parse(params);
    }

    _(self).handleChanges(function () {
      /* non-default import from default-exporting module */undefined(self, params);
    });
  },
  toString: function toString() {
    // @ts-ignore: unable to infer this
    return combinePath(_(this).current.maxPath || '/', this.remainingSegments);
  }
});
/* non-default import from default-exporting module */undefined(Route.prototype);
/**
 * @param {Brew.AppInstance<Brew.WithRouter>} app
 * @param {Record<string, any>} options
 */

function configureRouter(app, options) {
  var initialPath = app.path || options.initialPath || options.queryParam && getQueryParam(options.queryParam) || location.pathname.substr(options.baseUrl.length) || '/';
  var route = new Route(app, options.routes, initialPath);
  var currentPath = '';
  var observable = {};
  var redirectSource = {};
  var lockedPath;
  var newPath;
  var navigated = 0;

  function resolvePath(path, currentPath) {
    path = decodeURI(path);
    currentPath = currentPath || app.path;

    if (path[0] === '~') {
      var parsedState = /* non-default import from default-exporting module */undefined(currentPath, route.toString()) ? _(route).current : route.parse(currentPath) && _(route).lastMatch;
      path = combinePath(parsedState.minPath, path.slice(1));
    } else if (path[0] !== '/') {
      path = combinePath(currentPath, path);
    }

    path = normalizePath(path, true);

    if (path.indexOf('{') < 0) {
      return path;
    }

    return path.replace(/\{([^}]+)\}/g, function (v, a) {
      return route[a] || v;
    });
  }

  function navigate(path, replace) {
    path = withBaseUrl(resolvePath(path));
    include_history[replace ? 'replaceState' : 'pushState']({}, document.title, path);
    app.path = path.substr(baseUrl.length) || '/';
  }

  function processPageChange(path, oldPath, newActiveElements) {
    if (currentPath !== path) {
      return;
    }

    var preload = new Map();
    var eventSource = dom.eventSource;
    var previousActiveElements = activeElements.slice(0);
    activeElements = newActiveElements;
    pageTitleElement = jquery(newActiveElements).filter('[page-title]')[0];
    redirectSource = {}; // assign document title from matched active elements and
    // synchronize path in address bar if navigation is triggered by script

    var pageTitle = evalAttr(pageTitleElement, 'page-title', true);

    if (location.pathname.substr(baseUrl.length) !== path) {
      include_history[navigated ? 'pushState' : 'replaceState']({}, pageTitle, withBaseUrl(path));
    }

    navigated++;
    document.title = pageTitle;
    batch(true, function () {
      groupLog(eventSource, ['pageenter', path], function () {
        matchByPathElements.forEach(function (element) {
          var matched = activeElements.indexOf(element) >= 0;

          if (matched === previousActiveElements.indexOf(element) < 0) {
            if (matched) {
              resetVar(element, false);
              setVar(element);
              setTimeout(function () {
                // animation and pageenter event of inner scope
                // must be after those of parent scope
                var dependencies = preload.get(jquery(element).parents('[match-path]')[0]);
                var promises = preloadHandlers.map(function (v) {
                  return v(element, path);
                });
                promises.push(dependencies);
                preload.set(element, /* non-default import from default-exporting module */undefined(promises, function () {
                  if (activeElements.indexOf(element) >= 0) {
                    /* non-default import from default-exporting module */undefined(element, 'hidden', false);
                    animateIn(element, 'show', '[match-path]');
                    app.emit('pageenter', element, {
                      pathname: path
                    }, true);
                  }
                }));
              });
            } else {
              app.emit('pageleave', element, {
                pathname: oldPath
              }, true);
              animateOut(element, 'show', '[match-path]').then(function () {
                if (activeElements.indexOf(element) < 0) {
                  groupLog(eventSource, ['pageleave', oldPath], function () {
                    /* non-default import from default-exporting module */undefined(element, 'hidden', true);
                    resetVar(element, true);
                  });
                }
              });
            }
          }
        });
      });
      /* non-default import from default-exporting module */undefined(preload, function (element, promise) {
        handleAsync(promise, element);
      });
    });
  }

  function handlePathChange() {
    if (newPath === currentPath) {
      return;
    } // forbid navigation when DOM is locked (i.e. [is-modal] from openFlyout) or leaving is prevented


    if (dom.locked(dom.activeElement, true)) {
      lockedPath = newPath === lockedPath ? null : currentPath;
      navigate(lockedPath || newPath, true);
      return;
    }

    var promise = preventLeave();

    if (promise) {
      lockedPath = currentPath;
      navigate(currentPath, true);
      /* non-default import from default-exporting module */undefined(promise).then(function () {
        navigate(newPath, true);
      });
      return;
    }

    lockedPath = null; // find active elements i.e. with match-path that is equal to or is parent of the new path

    /** @type {HTMLElement[]} */

    var newActiveElements = [dom.root];
    var oldPath = currentPath;
    var redirectPath;
    batch(true, function () {
      matchByPathElements.forEach(function (v, placeholder) {
        var targetPath = resolvePath(v.getAttribute('match-path'), newPath);
        var matched = jquery('[switch=""]', v)[0] ? isSubPathOf(newPath, targetPath) : newPath === targetPath;

        if (matched) {
          newActiveElements.unshift(v);

          if (!v.parentNode) {
            jquery(placeholder).replaceWith(v);
            markUpdated(v);
            mountElement(v);
          }
        }
      });
    }); // prevent infinite redirection loop
    // redirectSource will not be reset until processPageChange is fired

    if (redirectSource[newPath] && redirectSource[oldPath]) {
      processPageChange(newPath, oldPath, newActiveElements);
      return;
    }

    redirectSource[newPath] = true; // redirect to the default view if there is no match because every switch must have a match

    jquery('[switch=""]').each(function (i, v) {
      if (isElementActive(v, newActiveElements)) {
        var $children = jquery(v).children('[match-path]');
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

    console.log('Nagivate', newPath);
    currentPath = newPath;
    app.path = newPath;
    route.set(newPath);
    promise = app.emit('navigate', {
      pathname: newPath,
      oldPathname: oldPath,
      route: Object.freeze(/* non-default import from default-exporting module */undefined({}, route))
    });
    handleAsync(promise, dom.root, function () {
      processPageChange(newPath, oldPath, newActiveElements);
    });
  }

  /* non-default import from default-exporting module */undefined(observable, true);
  /* non-default import from default-exporting module */undefined(observable, 'path', '', function (newValue) {
    if (!appReady) {
      return currentPath;
    }

    newPath = resolvePath(newValue, currentPath);

    if (newPath !== currentPath) {
      /* non-default import from default-exporting module */undefined(handlePathChange);
    }

    return currentPath;
  });
  setBaseUrl(options.baseUrl || '');
  app.define({
    resolvePath: resolvePath,
    navigate: navigate,
    back: function back() {
      if (navigated > 1) {
        // @ts-ignore: History.js
        include_history.back();
      } else if (app.path !== '/') {
        navigate('/');
      }
    }
  });
  /* non-default import from default-exporting module */undefined(app, 'initialPath', initialPath, true);
  /* non-default import from default-exporting module */undefined(app, 'route', route, true);
  /* non-default import from default-exporting module */undefined(app, 'path', observable);
  app.beforeInit(function () {
    dom.ready.then(function () {
      // detach elements which its visibility is controlled by current path
      jquery('[match-path]').addClass('hidden').each(function (i, v) {
        var placeholder = document.createElement('div');
        placeholder.setAttribute('style', 'display: none !important');
        placeholder.setAttribute('match-path', v.getAttribute('match-path') || '');

        if (v.attributes.default) {
          placeholder.setAttribute('default', '');
        }

        jquery(v).before(placeholder);
        jquery(v).detach();
        matchByPathElements.set(placeholder, v);
      }); // @ts-ignore: History.js

      include_history.Adapter.bind(window, 'statechange', function () {
        app.path = location.pathname.substr(baseUrl.length) || '/';
      });
    });
  });
  app.on('ready', function () {
    app.path = initialPath;
  });
  app.on('mounted', function (e) {
    var $autoplay = jquery(/* non-default import from default-exporting module */undefined('video[autoplay], audio[autoplay]', e.target));

    if ($autoplay[0]) {
      $autoplay.removeAttr('autoplay');
      app.on(e.target, {
        pageenter: function pageenter() {
          $autoplay.each(function (i, v) {
            // @ts-ignore: known element type
            if (v.readyState !== 0) {
              // @ts-ignore: known element type
              v.currentTime = 0;
            } // @ts-ignore: known element type


            v.play();
          });
        },
        pageleave: function pageleave() {
          $autoplay.each(function (i, v) {
            // @ts-ignore: known element type
            v.pause();
          });
        }
      }, true);
    }
  });
  app.on('pageleave', function (e) {
    jquery(/* non-default import from default-exporting module */undefined('form', e.target)).each(function (i, v) {
      if (!app.emit('reset', v, null, false)) {
        // @ts-ignore: known element type
        v.reset();
      }
    });
  });
  app.on('statechange', function (e) {
    if (/* non-default import from default-exporting module */undefined(e.target, pageTitleElement)) {
      document.title = evalAttr(pageTitleElement, 'page-title', true);
    }
  });
}

install('router', function (app, options) {
  // @ts-ignore
  configureRouter(app, options || {});
});
// CONCATENATED MODULE: ./src/dom.js













var IMAGE_STYLE_PROPS = 'background-image'.split(' ');
var BOOL_ATTRS = 'checked selected disabled readonly multiple ismap';

var dom_ = /* non-default import from default-exporting module */undefined();

var root = dom.root;
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
  var obj = dom_(element) || dom_(element, {});

  return obj[ns] || (obj[ns] = {});
}

function diffObject(currentValues, oldValues) {
  var newValues = {};
  /* non-default import from default-exporting module */undefined(currentValues, function (i, v) {
    if (v !== oldValues[i]) {
      newValues[i] = v;
    }
  });
  return newValues;
}

function updateDOM(element, props, suppressEvent) {
  /* non-default import from default-exporting module */undefined(props, function (j, v) {
    if (j === '$$class') {
      /* non-default import from default-exporting module */undefined(element, v);
    } else if (j === '$$text') {
      element.textContent = v;
    } else if (j === 'style') {
      jquery(element).css(v);
    } else if (/* non-default import from default-exporting module */undefined(j, BOOL_ATTRS)) {
      element[j] = !!v;
    } else {
      element.setAttribute(j, v);
    }
  });

  if (!suppressEvent) {
    dom.emit('domchange', element);
  }
}

function mergeDOMUpdates(dict, props) {
  /* non-default import from default-exporting module */undefined(props, function (j, v) {
    if (j === '$$class' || j === 'style') {
      dict[j] = /* non-default import from default-exporting module */undefined({}, dict[j], v);
    } else {
      dict[j] = v;
    }
  });
}

function processTransform(elements, applyDOMUpdates) {
  var transformed = new Set();
  var exclude;

  do {
    elements = /* non-default import from default-exporting module */undefined(elements);
    exclude = /* non-default import from default-exporting module */undefined(transformed);
    /* non-default import from default-exporting module */undefined(transformationHandlers, function (i, v) {
      jquery(/* non-default import from default-exporting module */undefined('[' + i + ']', elements)).not(exclude).each(function (j, element) {
        v(element, getComponentState.bind(0, i), applyDOMUpdates);
        transformed.add(element);
      });
    });
  } while (exclude.length !== transformed.size);
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
  matchElementHandlers.push({
    selector: selector,
    handler: handler
  });
}
/**
 * @param {(domChanges: Map<Element, Brew.DOMUpdateState>) => Brew.PromiseOrEmpty} callback
 */

function hookBeforeUpdate(callback) {
  preupdateHandlers.push(/* non-default import from default-exporting module */undefined(callback));
}
/**
 * @param {Promise<any>} promise
 * @param {Element=} element
 * @param {() => any=} callback
 */

function handleAsync(promise, element, callback) {
  if (!/* non-default import from default-exporting module */undefined(promise)) {
    return /* non-default import from default-exporting module */undefined((callback || /* non-default import from default-exporting module */undefined)());
  }

  if (element || dom.eventSource !== 'script') {
    element = element || dom.activeElement;
    var elm1 = getVarScope('loading', element || root);
    var elm2 = getVarScope('error', element || root);
    var counter = getComponentState('handleAsync', elm1);
    setVar(elm1, {
      loading: getVar(elm1, 'loading') || true
    });
    setVar(elm2, {
      error: null
    });
    counter.value = (counter.value || 0) + 1;
    promise.then(function () {
      setVar(elm1, {
        loading: !! --counter.value
      });
    }, function (e) {
      setVar(elm1, {
        loading: !! --counter.value
      });
      setVar(elm2, {
        error: '' + (e.message || e)
      });
    });
  }

  return promise.then(callback || null);
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
  if (batchCounter || stateChangeLock) {
    return;
  }

  var updatedProps = new Map();
  var domUpdates = new Map();

  var applyDOMUpdates = function applyDOMUpdates(element, props) {
    var dict = /* non-default import from default-exporting module */undefined(domUpdates, element, Object);
    mergeDOMUpdates(dict, props);
  };

  stateChangeLock = true;

  try {
    groupLog(dom.eventSource, 'statechange', function () {
      // recursively perform transformation until there is no new element produced
      processTransform(updatedElements, applyDOMUpdates); // trigger statechange events and perform DOM updates only on attached elements
      // leave detached elements in future rounds

      var arr = jquery.uniqueSort(/* non-default import from default-exporting module */undefined(updatedElements, function (v) {
        return /* non-default import from default-exporting module */undefined(root, v) && updatedElements.delete(v);
      }));
      /* non-default import from default-exporting module */undefined(arr, function (i, v) {
        var currentValues = getVar(v);
        var oldValues = getComponentState('oldValues', v);
        updatedProps.set(v, {
          oldValues: /* non-default import from default-exporting module */undefined({}, oldValues),
          newValues: diffObject(currentValues, oldValues)
        });
        /* non-default import from default-exporting module */undefined(oldValues, currentValues);
      });
      var visited = [];
      /* non-default import from default-exporting module */undefined(arr.reverse(), function (i, v) {
        groupLog('statechange', [v, updatedProps.get(v).newValues], function (console) {
          console.log(v === root ? document : v);
          jquery(/* non-default import from default-exporting module */undefined('[' + /* non-default import from default-exporting module */undefined(renderHandlers).join('],[') + ']', v)).not(visited).each(function (i, element) {
            /* non-default import from default-exporting module */undefined(renderHandlers, function (i, v) {
              if (element.attributes[i]) {
                v(element, getComponentState.bind(0, i), applyDOMUpdates);
              }
            });
            visited.push(element);
          });
        });
      });
    }); // perform any async task that is related or required by the DOM changes

    var preupdatePromise = /* non-default import from default-exporting module */undefined(preupdateHandlers.map(function (v) {
      return v(domUpdates);
    })); // perform DOM updates, or add to pending updates if previous update is not completed
    // also wait for animation completed if suppressAnim is off

    preupdatePromise.then(function () {
      var animScopes = new Map();
      /* non-default import from default-exporting module */undefined(domUpdates, function (element, props) {
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

              return cur && /* non-default import from default-exporting module */undefined(haystack, function (v) {
                return v in cur.newValues;
              });
            };

            groupElements = [];
            /* non-default import from default-exporting module */undefined(function () {
              animateOut(animParent, 'statechange', '[match-path]', filter, true).then(function () {
                /* non-default import from default-exporting module */undefined(groupElements, function (i, v) {
                  updateDOM(v, /* non-default import from default-exporting module */undefined(pendingDOMUpdates, v));
                });
                animateIn(animParent, 'statechange', '[match-path]', filter);
              });
            });
            animScopes.set(animParent, groupElements);
          }

          var dict = /* non-default import from default-exporting module */undefined(pendingDOMUpdates, element, Object);
          mergeDOMUpdates(dict, props);
          groupElements.push(element);
        } else if (pendingDOMUpdates.has(element)) {
          mergeDOMUpdates(pendingDOMUpdates.get(element), props);
        } else {
          updateDOM(element, props);
        }
      });
      /* non-default import from default-exporting module */undefined(updatedProps, function (i, v) {
        dom.emit('statechange', i, {
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
    /* non-default import from default-exporting module */undefined(callback || suppressAnim)();
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
    /* non-default import from default-exporting module */undefined(selectorHandlers.slice(index < 0 ? 0 : index), function (i, v) {
      jquery(/* non-default import from default-exporting module */undefined(v.target, element)).each(function (i, w) {
        app.on(w, v.handlers);

        if (v.handlers.mounted && mountedElements.indexOf(w) < 0) {
          mountedElements.push(w);
        }
      });
    });
    index = selectorHandlers.length;
    /* non-default import from default-exporting module */undefined(jquery.uniqueSort(mountedElements.slice(index2)), function (i, v) {
      dom.emit('mounted', v);
    });

    if (!firedOnRoot) {
      firedOnRoot = true;
      dom.emit('mounted', root, {
        target: element
      });
    }

    index2 = mountedElements.length;
  }

  /* non-default import from default-exporting module */undefined(matchElementHandlers, function (i, v) {
    jquery(/* non-default import from default-exporting module */undefined(v.selector, element)).each(function (i, w) {
      v.handler.call(w, w);
    });
  });
}
/**
 * @param {boolean=} suppressPrompt
 */

function preventLeave(suppressPrompt) {
  var element = /* non-default import from default-exporting module */undefined(jquery('[prevent-leave]').get(), function (v) {
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
    return /* non-default import from default-exporting module */undefined(dom.emit('preventLeave', element, null, true), function (result) {
      if (result) {
        var state = getComponentState('preventLeave', element);
        state.allowLeave = true;
      } else {
        throw 'user_rejected';
      }
    });
  }

  return !!element;
}
function addTemplate(name, template) {
  templates[name] = jquery(template)[0];
}
function addTransformer(name, callback) {
  transformationHandlers[name] = /* non-default import from default-exporting module */undefined(callback);
}
function addRenderer(name, callback) {
  renderHandlers[name] = /* non-default import from default-exporting module */undefined(callback);
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
    /* non-default import from default-exporting module */undefined(state, {
      attributes: getAttrValues(element),
      childNodes: /* non-default import from default-exporting module */undefined(element.childNodes)
    });
  }

  if (template && template !== currentTemplate) {
    state.template = template;
    template = template.cloneNode(true); // reset attributes on the apply-template element
    // before applying new attributes

    if (currentTemplate) {
      /* non-default import from default-exporting module */undefined(currentTemplate.attributes, function (i, v) {
        element.removeAttribute(v.name);
      });
    }

    setAttr(element, state.attributes);
    copyAttr(template, element);
    var $contents = jquery(state.childNodes).detach();
    jquery(/* non-default import from default-exporting module */undefined('content:not([for])', template)).replaceWith($contents);
    jquery(/* non-default import from default-exporting module */undefined('content[for]', template)).each(function (i, v) {
      jquery(v).replaceWith($contents.filter(v.getAttribute('for') || ''));
    });
    jquery(element).empty().append(template.childNodes);
  }
});
addTransformer('foreach', function (element, getState) {
  var state = getState(element);
  var templateNodes = state.template || (state.template = jquery(element).contents().detach().filter(function (i, v) {
    return v.nodeType === 1 || /\S/.test(v.data || '');
  }).get());
  var currentNodes = state.nodes || [];
  var oldItems = state.data || [];
  var newItems = /* non-default import from default-exporting module */undefined(evalAttr(element, 'foreach'));

  if (newItems.length !== oldItems.length || newItems.some(function (v, i) {
    return oldItems[i] !== v;
  })) {
    var newChildren = /* non-default import from default-exporting module */undefined(newItems, function (v) {
      var currentIndex = oldItems.indexOf(v);

      if (currentIndex >= 0) {
        oldItems.splice(currentIndex, 1);
        return currentNodes.splice(currentIndex * templateNodes.length, (currentIndex + 1) * templateNodes.length);
      }

      var parts = jquery(templateNodes).clone().get();
      /* non-default import from default-exporting module */undefined(parts, function (i, w) {
        if (w.nodeType === 1) {
          var myState = getState(w);
          myState.template = getState(templateNodes[i]).template;
          jquery(element).append(w);
          declareVar(w, {
            foreach: v
          });
          mountElement(w);
        }
      });
      return parts;
    });
    /* non-default import from default-exporting module */undefined(state, {
      nodes: newChildren,
      data: newItems.slice()
    });
    jquery(currentNodes).detach();
    jquery(element).append(newChildren);
  }
});
addTransformer('auto-var', function (element) {
  setVar(element, evalAttr(element, 'auto-var'));
});
addTransformer('switch', function (element, getState, applyDOMUpdates) {
  var varname = element.getAttribute('switch') || '';

  if (!isElementActive(element) || !varname) {
    return;
  }

  var context = getVar(element);
  var matchValue = waterpipe.eval(varname, context);
  var $target = jquery('[match-' + varname + ']', element).filter(function (i, w) {
    return jquery(w).parents('[switch]')[0] === element;
  });
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

  if (!context.matched || context.matched.element !== matched) {
    groupLog('switch', [element, varname, '→', matchValue], function (console) {
      console.log('Matched: ', matched || '(none)');

      if (matched) {
        setVar(matched);
      }

      setVar(element, {
        matched: matched && getVar(matched)
      });
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
});
addRenderer('template', function (element, getState, applyDOMUpdates) {
  var state = getState(element);
  var templates = state.templates;

  if (!templates) {
    templates = {};
    /* non-default import from default-exporting module */undefined(element.attributes, function (i, w) {
      if (w.value.indexOf('{{') >= 0) {
        templates[w.name] = /* non-default import from default-exporting module */undefined(w.name, BOOL_ATTRS) ? w.value.replace(/^{{|}}$/g, '') : w.value;
      }
    });

    if (!element.childElementCount && (element.textContent || '').indexOf('{{') >= 0) {
      templates.$$text = element.textContent;
    }

    state.templates = templates;
  }

  var context = getVar(element);
  var props = {};
  /* non-default import from default-exporting module */undefined(templates, function (i, w) {
    var value = evaluate(w, context, element, i, !/* non-default import from default-exporting module */undefined(i, BOOL_ATTRS));

    if ((i === '$$text' ? element.textContent : (element.getAttribute(i) || '').replace(/["']/g, '')) !== value) {
      props[i] = value;
    }
  });
  applyDOMUpdates(element, props);
});
addRenderer('set-style', function (element, getState, applyDOMUpdates) {
  var style = /* non-default import from default-exporting module */undefined(evalAttr(element, 'set-style', true));
  /* non-default import from default-exporting module */undefined(IMAGE_STYLE_PROPS, function (i, v) {
    var imageUrl = /* non-default import from default-exporting module */undefined(style[v]);

    if (imageUrl) {
      style[v] = 'url("' + withBaseUrl(imageUrl) + '")';
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










var app_ = /* non-default import from default-exporting module */undefined();

var app_root = dom.root;
var featureDetections = {};
/** @type {Brew.AppInstance} */

var app;
/** @type {boolean} */

var appReady;
/** @type {boolean} */

var appInited;

function processUntilEmpty(arr) {
  return /* non-default import from default-exporting module */undefined(arr.splice(0), function () {
    return arr.length && processUntilEmpty(arr);
  });
}

function exactTargetWrapper(handler) {
  return function (e) {
    if (e.target === e.context) {
      return handler.apply(this, arguments);
    }
  };
}
/**
 * @param {Zeta.ZetaEvent} e
 */


function onElementMounted(e) {
  var element = e.target;
  jquery(/* non-default import from default-exporting module */undefined('img[src^="/"], video[src^="/"]', element)).each(function (i, v) {
    // @ts-ignore: known element type
    v.src = withBaseUrl(v.getAttribute('src'));
  });
  jquery(/* non-default import from default-exporting module */undefined('a[href^="/"]', element)).each(function (i, v) {
    // @ts-ignore: known element type
    v.href = withBaseUrl(v.getAttribute('href'));
  });
  jquery(/* non-default import from default-exporting module */undefined('[data-src]', element)).each(function (i, v) {
    // @ts-ignore: known element type
    v.src = withBaseUrl(v.dataset.src);
    v.removeAttribute('data-src');
  });
  jquery(/* non-default import from default-exporting module */undefined('[data-bg-src]', element)).each(function (i, v) {
    // @ts-ignore: known element type
    v.style.backgroundImage = 'url("' + withBaseUrl(v.dataset.bgSrc) + '")';
    v.removeAttribute('data-bg-src');
  });
  jquery(/* non-default import from default-exporting module */undefined('form', element)).on('submit', function (e) {
    e.preventDefault();
  });
}

function App() {
  var self = this;

  app_(self, {
    init: [],
    options: {}
  });

  /* non-default import from default-exporting module */undefined(self, 'element', app_root, true);
  self.on('mounted', onElementMounted);
}

/* non-default import from default-exporting module */undefined(App, {
  emit: function emit(event, element, data, bubbles) {
    if (!/* non-default import from default-exporting module */undefined(element, Node)) {
      bubbles = data;
      data = element;
      element = this.element;
    }

    return dom.emit(event, element, data, bubbles);
  },
  define: function define(props) {
    /* non-default import from default-exporting module */undefined(this, props);
  },
  beforeInit: function beforeInit(promise) {
    if (/* non-default import from default-exporting module */undefined(promise)) {
      promise = promise.call(this);
    }

    app_(this).init.push(promise);
  },
  detect: function detect(names, callback) {
    var app = this;
    var supports = {};
    /* non-default import from default-exporting module */undefined(names, function (i, v) {
      if (featureDetections[v]) {
        supports[v] = /* non-default import from default-exporting module */undefined(featureDetections[v]) ? featureDetections[v] = /* non-default import from default-exporting module */undefined(featureDetections[v]()).catch(function (e) {
          console.warn('Detection for ' + v + ' has thrown exception:', e);
          return false;
        }) : featureDetections[v];
      }
    });
    this.beforeInit(/* non-default import from default-exporting module */undefined(supports, function (supports) {
      supports = Object.freeze(/* non-default import from default-exporting module */undefined(app.supports || {}, supports));

      /* non-default import from default-exporting module */undefined(app, {
        supports: supports
      });

      return /* non-default import from default-exporting module */undefined(callback) && callback(supports);
    }));
  },
  when: function when(value, callback) {
    this.beforeInit(/* non-default import from default-exporting module */undefined(value, function (value) {
      if (value) {
        return callback();
      }
    }));
  },
  on: function on(target, event, handler, noChildren) {
    noChildren = (noChildren || handler) === true;

    if (/* non-default import from default-exporting module */undefined(event)) {
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
        /* non-default import from default-exporting module */undefined(event, function (i, v) {
          handlers[v] = handler;
        });
      } else {
        handlers = /* non-default import from default-exporting module */undefined(event, handler);
      }
    } else if (noChildren) {
      for (var i in event) {
        event[i] = exactTargetWrapper(event[i]);
      }
    }

    if (typeof target === 'string') {
      addSelectHandlers(target, handlers);

      if (!appReady) {
        return;
      }

      target = jquery(target).get();
    } else if (target instanceof Node) {
      target = [target];
    }

    /* non-default import from default-exporting module */undefined(target, function (i, v) {
      dom.on(v, handlers);
    });
  },
  matchPath: function matchPath(path, selector, handler) {
    if (/* non-default import from default-exporting module */undefined(selector)) {
      handler = selector;
      selector = null;
    }

    this.on('mounted', function (e) {
      if (e.target.getAttribute('match-path') === path && (!selector || jquery(e.target).is(selector))) {
        handler.call(e.target, e.target);
      }
    });
  },
  matchElement: matchElement,
  beforeUpdate: hookBeforeUpdate,
  beforePageEnter: hookBeforePageEnter
});
/* non-default import from default-exporting module */undefined(App.prototype);
/* harmony default export */ function src_app(callback) {
  if (appInited) {
    throw new Error('brew() can only be called once');
  }

  app = new App();
  /* non-default import from default-exporting module */undefined(src_defaults, function (i, v) {
    var fn = v && /* non-default import from default-exporting module */undefined(app[/* non-default import from default-exporting module */undefined('use-' + i)]);

    if (fn) {
      fn.call(app, v);
    }
  });
  /* non-default import from default-exporting module */undefined(callback)(app);
  /* non-default import from default-exporting module */undefined(window, {
    app: app
  });
  appInited = true;
  setVar(app_root, {
    loading: 'initial'
  });
  handleAsync(/* non-default import from default-exporting module */undefined([dom.ready, processUntilEmpty(app_(app).init)], function () {
    appReady = true;
    mountElement(app_root);
    app.emit('ready');
  }), app_root);
}
function install(name, callback) {
  /* non-default import from default-exporting module */undefined(callback);
  /* non-default import from default-exporting module */undefined(App, /* non-default import from default-exporting module */undefined(/* non-default import from default-exporting module */undefined('use-' + name), function (options) {
    var state = app_(this);

    state.options[name] = /* non-default import from default-exporting module */undefined(state.options[name] || {}, options);
    callback(this, state.options[name]);
  }));
}
function addDetect(name, callback) {
  featureDetections[name] = /* non-default import from default-exporting module */undefined(callback);
}
// EXTERNAL MODULE: external {"commonjs":["zeta-dom"],"commonjs2":["zeta-dom"],"amd":["zeta-dom"],"root":["zeta"]}
var external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_ = __webpack_require__(668);
// CONCATENATED MODULE: ./src/include/zeta/tree.js

// CONCATENATED MODULE: ./src/var.js








var DEBUG_EVAL = /localhost:?/i.test(location.host);
var var_root = dom.root;
var varAttrs = {
  'var': true,
  'auto-var': true,
  'switch': {
    matched: null
  },
  'error-scope': {
    error: null
  }
};
var tree = new /* non-default import from default-exporting module */undefined(var_root, VarContext);
/**
 * @class
 * @this {Brew.VarContext}
 */

function VarContext() {
  var self = this;
  var element = self.element; // @ts-ignore: does not throw error when property dataset does not exist

  /* non-default import from default-exporting module */undefined(element.dataset, function (i, v) {
    /* non-default import from default-exporting module */undefined(self, i, waterpipe.eval('`' + v));
  });
  /* non-default import from default-exporting module */undefined(getDeclaredVar(element, true, self), function (i, v) {
    /* non-default import from default-exporting module */undefined(self, i, v);
  });

  if (element === var_root) {
    self.loading = null;
    self.error = null;
  }
}

function getDeclaredVar(element, resetToNull, state) {
  var initValues = {};
  /* non-default import from default-exporting module */undefined(varAttrs, function (i, v) {
    if (v === true) {
      /* non-default import from default-exporting module */undefined(initValues, evalAttr(element, i, false, state));
    } else if (/* non-default import from default-exporting module */undefined(v) && element.attributes[i]) {
      /* non-default import from default-exporting module */undefined(initValues, v);
    }
  });

  if (resetToNull) {
    for (var i in initValues) {
      initValues[i] = null;
    }
  }

  return initValues;
}

function findVarContext(varname, element) {
  element = element || var_root;

  for (var s = tree.getNode(element); s !== null; s = Object.getPrototypeOf(s)) {
    if (/* non-default import from default-exporting module */undefined(s, varname)) {
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
  var values = name && (/* non-default import from default-exporting module */undefined(name) || /* non-default import from default-exporting module */undefined(name, value));
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
    /* non-default import from default-exporting module */undefined(values || evalAttr(element, 'set-var'), function (i, v) {
      if (state[i] !== v) {
        var node = findVarContext(i, element);
        node[i] = v;
        hasUpdated = true;
        markUpdated(node.element);
      }
    });

    if (hasUpdated && appReady) {
      /* non-default import from default-exporting module */undefined(processStateChange);
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
  var values = /* non-default import from default-exporting module */undefined(name) || /* non-default import from default-exporting module */undefined(name, value);
  var context = tree.setNode(element);

  for (var i in values) {
    if (!/* non-default import from default-exporting module */undefined(context, i)) {
      /* non-default import from default-exporting module */undefined(context, i, null);
    }
  }

  return setVar(element, values);
}
/**
 * @param {Element} element
 * @param {boolean=} resetToNull
 */

function resetVar(element, resetToNull) {
  batch(function () {
    /* non-default import from default-exporting module */undefined(tree.descendants(element), function (i, v) {
      setVar(v.element, getDeclaredVar(v.element, resetToNull));
    });
  });
}
/**
 * @param {Element} element
 * @param {string=} name
 */

function getVar(element, name) {
  var values = tree.getNode(element) || {};
  return name ? values[name] : /* non-default import from default-exporting module */undefined({}, values);
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
  var result = templateMode ? /* non-default import from default-exporting module */undefined(waterpipe(template, /* non-default import from default-exporting module */undefined({}, context), options)) : waterpipe.eval(template, /* non-default import from default-exporting module */undefined({}, context), options);

  if (DEBUG_EVAL) {
    groupLog('eval', [element, attrName, '→', result], function (console) {
      console.log('%c%s%c', 'background-color:azure;color:darkblue;font-weight:bold', template, '', '→', result);
      console.log('Context:', /* non-default import from default-exporting module */undefined({}, context));
      console.log('Element:', element === var_root ? document : element);
    });
  }

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
dom.watchAttributes(var_root, /* non-default import from default-exporting module */undefined(varAttrs), function (elements) {
  /* non-default import from default-exporting module */undefined(elements, function (i, v) {
    tree.setNode(v);
  });
}, true);
tree.on('update', function (e) {
  /* non-default import from default-exporting module */undefined(e.updatedNodes, function (i, v) {
    markUpdated(v.element);
  });
});
// CONCATENATED MODULE: ./src/domAction.js












var flyoutStates = new Map();
var executedAsyncActions = new Map();
/** @type {Zeta.Dictionary<Zeta.AnyFunction>} */

var asyncActions = {};
/**
 * @param {string} attr
 * @param {(this: Element, e: JQuery.UIEventBase) => Brew.PromiseOrEmpty} callback
 */

function addAsyncAction(attr, callback) {
  asyncActions[attr] = /* non-default import from default-exporting module */undefined(callback);
}
/**
 * @param {Element | string=} flyout
 * @param {any=} value
 */

function closeFlyout(flyout, value) {
  // @ts-ignore: type inference issue
  jquery(flyout || '[is-flyout].open').each(function (i, v) {
    var state = flyoutStates.get(v);

    if (state) {
      flyoutStates.delete(v);
      state.resolve(value);

      if (state.source) {
        /* non-default import from default-exporting module */undefined(state.source, 'target-opened', false);
      }
    }

    animateOut(v, 'show').then(function () {
      /* non-default import from default-exporting module */undefined(v, 'open', false);
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
  var element = selector ? /* non-default import from default-exporting module */undefined(selector, container) : jquery(container).closest('[is-flyout]')[0];

  if (!element) {
    return /* non-default import from default-exporting module */undefined();
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
    /* non-default import from default-exporting module */undefined(source, 'target-opened', true);
  }

  if (states) {
    setVar(element, states);
  }

  /* non-default import from default-exporting module */undefined(element, 'open', function () {
    dom.focus(element);
  });
  animateIn(element, 'open');

  if (element.attributes['is-modal']) {
    dom.lock(element, promise);
  }

  return promise;
}
addAsyncAction('validate', function (e) {
  var target = /* non-default import from default-exporting module */undefined(this.getAttribute('validate') || '', e.target);

  if (target) {
    // @ts-ignore: type inference issue
    var valid = dom.emit('validate', target) || !target.checkValidity || target.checkValidity();

    if (!valid) {
      e.stopImmediatePropagation();
      e.preventDefault();
    } else if (/* non-default import from default-exporting module */undefined(valid)) {
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
  var method = /* non-default import from default-exporting module */undefined(self.getAttribute('context-method') || '');

  if (/* non-default import from default-exporting module */undefined(app[method])) {
    var formSelector = self.getAttribute('context-form'); // @ts-ignore: acceptable if self.form is undefined

    var form = formSelector ? /* non-default import from default-exporting module */undefined(formSelector, self) : self.form;
    var params = {};
    var valid = true;

    if (form) {
      valid = dom.emit('validate', form) || form.checkValidity();
      /* non-default import from default-exporting module */undefined(params, getFormValues(form));
    } else {
      /* non-default import from default-exporting module */undefined(params, self.dataset);
    }

    return /* non-default import from default-exporting module */undefined(valid, function (valid) {
      if (!valid) {
        throw 'validation-failed';
      }

      return app[method](params);
    });
  }
});
dom.ready.then(function () {
  app.on('mounted', function (e) {
    jquery(/* non-default import from default-exporting module */undefined('[' + /* non-default import from default-exporting module */undefined(asyncActions).join('],[') + ']', e.target)).attr('async-action', '');
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
  jquery('body').on('click', '[disabled], .disabled, :disabled', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
  });
  jquery('body').on('click', '[async-action]', function (e) {
    var element = e.currentTarget;
    var executed = /* non-default import from default-exporting module */undefined(executedAsyncActions, element, Array);
    var callback = null;
    /* non-default import from default-exporting module */undefined(asyncActions, function (i, v) {
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

      if (/* non-default import from default-exporting module */undefined(returnValue) && !e.isImmediatePropagationStopped()) {
        e.stopImmediatePropagation();
        e.preventDefault();
        handleAsync(returnValue).then(function () {
          /* non-default import from default-exporting module */undefined(e);
        }, function (e) {
          executedAsyncActions.delete(element);
          console.warn('Action threw an error:', e);
        });
      }
    }
  });
  jquery('body').on('click', 'a[href]:not([rel]), [data-href]', function (e) {
    var self = e.currentTarget;

    if (self.target !== '_blank' && 'navigate' in app) {
      e.preventDefault();
      e.stopPropagation();
      var modalParent = jquery(self).closest('[is-modal]')[0];

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
    openFlyout(self.getAttribute('toggle'), null, self, true);
  });
  jquery('body').on('click', '[toggle-class]', function (e) {
    e.stopPropagation();
    var self = e.currentTarget;
    var selector = self.getAttribute('toggle-class-for');
    var target = selector ? /* non-default import from default-exporting module */undefined(selector, self) : e.currentTarget;
    /* non-default import from default-exporting module */undefined(self.getAttribute('toggle-class'), function (i, v) {
      /* non-default import from default-exporting module */undefined(target, v.slice(1), v[0] === '+');
    });
  });
  jquery('body').on('click', function () {
    closeFlyout();
  });
});
// CONCATENATED MODULE: ./src/domReady.js






dom.ready.then(function () {
  jquery('[brew-template]').each(function (i, v) {
    addTemplate(v.getAttribute('brew-template') || '', v.cloneNode(true));
  });
  jquery('apply-attributes').each(function (i, v) {
    var $target = jquery(v.getAttribute('elements') || '', v.parentNode || dom.root);
    /* non-default import from default-exporting module */undefined(v.attributes, function (i, v) {
      if (v.name !== 'elements') {
        $target.attr(v.name, v.value);
      }
    });
  }).remove(); // replace inline background-image to prevent browser to load unneccessary images

  jquery('[style]').each(function (i, v) {
    var backgroundImage = /* non-default import from default-exporting module */undefined(v.style.backgroundImage);

    if (backgroundImage) {
      v.setAttribute('data-bg-src', decodeURIComponent(withBaseUrl(backgroundImage)));
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
// CONCATENATED MODULE: ./src/core.js
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }












/* non-default import from default-exporting module */undefined(src_app, _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({
  defaults: src_defaults
}, common_namespaceObject), path_namespaceObject), anim_namespaceObject), domAction_namespaceObject), {}, {
  getVar: getVar,
  setVar: setVar,
  declareVar: declareVar,
  evalAttr: evalAttr,
  isElementActive: isElementActive,
  handleAsync: handleAsync,
  preventLeave: preventLeave,
  install: install,
  addDetect: addDetect,
  addTemplate: addTemplate
}));
/* harmony default export */ const core = (src_app);
// CONCATENATED MODULE: ./src/extension/config.js



install('config', function (app, options) {
  var config = /* non-default import from default-exporting module */undefined();
  /* non-default import from default-exporting module */undefined(app, {
    config: config
  });
  app.beforeInit(getJSON(options.path).catch(/* non-default import from default-exporting module */undefined(options.fallback) || null).then(function (d) {
    /* non-default import from default-exporting module */undefined(config, d);

    if (options.freeze) {
      /* non-default import from default-exporting module */undefined(config);
    }
  }));
});
/* harmony default export */ const config = (null);
// CONCATENATED MODULE: ./src/extension/formVar.js









src_defaults.formVar = true;
install('formVar', function (app) {
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

        if (!/* non-default import from default-exporting module */undefined(values, /* non-default import from default-exporting module */undefined(currentValues, /* non-default import from default-exporting module */undefined(values)))) {
          setVar(form, varname, /* non-default import from default-exporting module */undefined({}, currentValues, values));
        }
      }
    };

    dom.watchAttributes(form, 'value', function () {
      /* non-default import from default-exporting module */undefined(update);
    });
    dom.watchElements(form, ':input', function (addedInputs) {
      /* non-default import from default-exporting module */undefined(addedInputs, function (i, v) {
        var afterDetached = dom.afterDetached(v, form);
        /* non-default import from default-exporting module */undefined(afterDetached, v, 'change', function () {
          /* non-default import from default-exporting module */undefined(update);
        });
        afterDetached.then(update.bind(null, true));
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
        /* non-default import from default-exporting module */undefined(form.elements, function (i, v) {
          if (!isElementActive(getVarScope(v.name, form))) {
            v.value = null;
          }
        });
      }

      return true;
    });
  });
  app.on('pageenter', function (e) {
    jquery(/* non-default import from default-exporting module */undefined('form[form-var]', e.target)).each(function (i, v) {
      jquery(':input:eq(0)', v).trigger('change');
    });
  });
});
/* harmony default export */ const formVar = (null);
// CONCATENATED MODULE: ./src/extension/i18n.js



function detectLanguage(languages, defaultLanguage) {
  var userLanguages = navigator.languages ? [].slice.apply(navigator.languages) : [navigator.language || ''];
  /* non-default import from default-exporting module */undefined(userLanguages, function (i, v) {
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
  return /* non-default import from default-exporting module */undefined(userLanguages, function (v) {
    return languages.indexOf(v) >= 0;
  }) || defaultLanguage || languages[0];
}

install('i18n', function (app, options) {
  var routeParam = app.route && options.routeParam;
  var cookie = options.cookie && cookie(options.cookie, 86400000);
  var language = routeParam && app.route[routeParam] || cookie && cookie.get() || detectLanguage(options.languages, options.defaultLanguage);

  var setLanguage = function setLanguage(newLangauge) {
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
    language: language,
    setLanguage: setLanguage,
    detectLanguage: detectLanguage
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
  options = /* non-default import from default-exporting module */undefined({
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
  var setLoggedIn = /* non-default import from default-exporting module */undefined(app, 'loggedIn', false, true);

  function handleLogin(response) {
    setLoggedIn(true);

    if (/* non-default import from default-exporting module */undefined(options.getTokenFromResponse)) {
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

  if (previousToken && /* non-default import from default-exporting module */undefined(options.tokenLogin)) {
    app.beforeInit(/* non-default import from default-exporting module */undefined(/* non-default import from default-exporting module */undefined(options.tokenLogin(previousToken), handleLogin)));
  }

  app.define({
    login: function login(params, nextPath, callback) {
      callback = /* non-default import from default-exporting module */undefined(callback || nextPath);
      nextPath = typeof nextPath === 'string' && nextPath;
      return /* non-default import from default-exporting module */undefined(options.login(params)).then(function (d) {
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
        return /* non-default import from default-exporting module */undefined();
      }

      callback = /* non-default import from default-exporting module */undefined(callback || nextPath);
      nextPath = typeof nextPath === 'string' && nextPath;
      return /* non-default import from default-exporting module */undefined(preventLeave()).then(function () {
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

    if (/* non-default import from default-exporting module */undefined(app.loggedIn, e.pathname !== loginPagePath)) {
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







var preloadImage_IMAGE_STYLE_PROPS = 'background-image'.split(' ');
src_defaults.preloadImage = true;
install('preloadImage', function (app) {
  app.beforeUpdate(function (domUpdates) {
    var urls = {};
    /* non-default import from default-exporting module */undefined(domUpdates, function (element, props) {
      if ((props.src || props.style) && isElementActive(element)) {
        if (props.src) {
          urls[toAbsoluteUrl(props.src)] = true;
        }

        if (props.style) {
          /* non-default import from default-exporting module */undefined(preloadImage_IMAGE_STYLE_PROPS, function (i, v) {
            // @ts-ignore: props.style checked for truthiness
            var imageUrl = /* non-default import from default-exporting module */undefined(props.style[v]);

            if (imageUrl) {
              urls[toAbsoluteUrl(imageUrl)] = true;
            }
          });
        }
      }
    });
    return preloadImages(/* non-default import from default-exporting module */undefined(urls), 200);
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
  var store = /* non-default import from default-exporting module */undefined();
  var id = 0;

  function getState(container) {
    return store(container) || store(container, {
      childClass: 'scrollable-target-' + ++id
    });
  }

  function initScrollable(container) {
    var dir = container.getAttribute('scrollable');
    var paged = container.getAttribute('scroller-snap-page') || '';
    var varname = container.getAttribute('scroller-state') || '';
    var selector = container.getAttribute('scroller-page') || '';
    var items = selector && jquery(selector, container).get();
    var scrolling = false;
    var needRefresh = false;
    var isControlledScroll; // @ts-ignore: signature ignored

    jquery(container).scrollable({
      bounce: false,
      handle: /* non-default import from default-exporting module */undefined(dir, 'auto scrollbar content') || 'content',
      hScroll: !/* non-default import from default-exporting module */undefined(dir, 'y-only'),
      vScroll: !/* non-default import from default-exporting module */undefined(dir, 'x-only'),
      content: '.' + getState(container).childClass + ':visible:not(.disabled)',
      pageItem: selector,
      snapToPage: paged === 'always' || paged === app.orientation,
      scrollbar: false,
      scrollStart: function scrollStart(e) {
        app.emit('scrollStart', container, e, true);
      },
      scrollMove: function scrollMove(e) {
        app.emit('scrollMove', container, e, true);
      },
      scrollEnd: function scrollEnd(e) {
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

      if (!scrolling && /* non-default import from default-exporting module */undefined(container)) {
        scrolling = true;
        isControlledScroll = true;
        setState(index);
        jquery(container).scrollable('scrollToElement', items[index], align, align, 200, function () {
          scrolling = false;
          isControlledScroll = false;
        });
      }
    }

    function refresh() {
      var isPaged = paged === 'always' || paged === app.orientation;

      if (isPaged && /* non-default import from default-exporting module */undefined(container)) {
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
        app.on('orientationchange', function () {
          jquery(container).scrollable('setOptions', {
            snapToPage: paged === app.orientation
          });
        });
      }

      if (varname) {
        app.on(container, {
          statechange: function statechange(e) {
            var newIndex = e.data[varname];

            if (!scrolling) {
              if ((/* non-default import from default-exporting module */undefined(items[newIndex]).width | 0) > (/* non-default import from default-exporting module */undefined().width | 0)) {
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
        }, true);
        var timeout;
        jquery(window).on('resize', function () {
          clearTimeout(timeout);
          timeout = setTimeout(refresh, 200);
        });
      }
    }
  }

  app.on('mounted', function (e) {
    jquery(/* non-default import from default-exporting module */undefined('[scrollable-target]', e.target)).each(function (i, v) {
      var scrollable = jquery(v).closest('[scrollable]')[0];
      jquery(v).addClass(getState(scrollable).childClass);
    });
    jquery(/* non-default import from default-exporting module */undefined('[scrollable]', e.target)).each(function (i, v) {
      initScrollable(v);
    });
  }); // update scroller on events other than window resize

  function refresh() {
    jquery('[scrollable]:visible').scrollable('refresh');
  }

  app.on('statechange orientationchange animationcomplete', function () {
    /* non-default import from default-exporting module */undefined(refresh);
  });
  app.on('pageenter', function (e) {
    var $scrollables = jquery(/* non-default import from default-exporting module */undefined('[scrollable]', e.target)).add(jquery(e.target).parents('[scrollable]'));
    jquery(/* non-default import from default-exporting module */undefined('[scrollable-target]', e.target)).each(function (i, v) {
      jquery(v).toggleClass('disabled', !isElementActive(v));
    });
    $scrollables.scrollable('refresh');
    $scrollables.filter(':not([keep-scroll-offset])').scrollable('scrollTo', 0, 0);
  }); // scroll-into-view animation trigger

  function updateScrollIntoView() {
    jquery('[animate-on~="scroll-into-view"]:not(.tweening-in):visible').each(function (i, v) {
      var m = new DOMMatrix(getComputedStyle(v).transform);
      var rootRect = /* non-default import from default-exporting module */undefined(dom.root);
      var thisRect = /* non-default import from default-exporting module */undefined(v);

      if (/* non-default import from default-exporting module */undefined(rootRect, thisRect.translate(-m.e || 0, 0)) || /* non-default import from default-exporting module */undefined(rootRect, thisRect.translate(0, -m.f || 0))) {
        animateIn(v, 'scroll-into-view');
      }
    });
  }

  app.on('resize pageenter statechange scrollMove orientationchange', function () {
    /* non-default import from default-exporting module */undefined(updateScrollIntoView);
  });
});
/* harmony default export */ const scrollable = (null);
// EXTERNAL MODULE: external {"commonjs":"zeta-dom","commonjs2":"zeta-dom","amd":"zeta-dom","root":"zeta"}
var external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_0 = __webpack_require__(163);
// CONCATENATED MODULE: ./src/include/zeta/index.js

/* harmony default export */ const zeta = ((/* unused pure expression or super */ null && (index)));

// CONCATENATED MODULE: ./src/extension/viewport.js








src_defaults.viewport = true;
install('viewport', function (app) {
  var setOrientation = /* non-default import from default-exporting module */undefined(app, 'orientation', '', true);
  var useAvailOrInner = /* non-default import from default-exporting module */undefined && navigator.platform !== 'MacIntel';
  var availWidth = screen.availWidth;
  var availHeight = screen.availHeight;
  var aspectRatio, viewportWidth, viewportHeight;

  function checkViewportSize(triggerEvent) {
    if (/* non-default import from default-exporting module */undefined && screen.availWidth === availWidth && screen.availHeight === availHeight && screen.availWidth === window.innerWidth) {
      // set min-height on body container so that page size is correct when virtual keyboard pops out
      jquery('body').css('min-height', jquery('body').height() + 'px');
    } else {
      jquery('body').css('min-height', '0');
    }

    availWidth = screen.availWidth;
    availHeight = screen.availHeight; // scroll properly by CSS transform when height of body is larger than root

    var bodyHeight = jquery('body').height() || 0;
    var htmlHeight = jquery('html').height() || 0;

    if (htmlHeight < bodyHeight && jquery(dom.activeElement).is(':text')) {
      /* non-default import from default-exporting module */undefined(dom.activeElement);
    }

    var previousAspectRatio = aspectRatio;
    viewportWidth = useAvailOrInner ? availWidth : document.body.offsetWidth;
    viewportHeight = useAvailOrInner ? availWidth === window.innerWidth ? availHeight : window.innerHeight : document.body.offsetHeight;
    aspectRatio = viewportWidth / viewportHeight;
    setOrientation(aspectRatio >= 1 ? 'landscape' : 'portrait');

    if (triggerEvent !== false) {
      app.emit('resize', {
        aspectRatio: aspectRatio,
        viewportWidth: viewportWidth,
        viewportHeight: viewportHeight
      });

      if (/* non-default import from default-exporting module */undefined(aspectRatio >= 1, previousAspectRatio >= 1)) {
        app.emit('orientationchange', {
          orientation: app.orientation
        });
      }
    }
  }

  /* non-default import from default-exporting module */undefined(app, {
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
  jquery(window).on('resize', function () {
    /* non-default import from default-exporting module */undefined(checkViewportSize);
  });
  jquery(function () {
    checkViewportSize(false);
  });
});
/* harmony default export */ const viewport = (null);
// CONCATENATED MODULE: ./src/index.js








/* harmony default export */ const src = (core);

/***/ }),

/***/ 715:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// @ts-nocheck

var History = window.History;
if (!History || !History.Adapter) {
    window.jQuery = __webpack_require__(609);
    __webpack_require__(229);
    History = window.History;
}
module.exports = History;


/***/ }),

/***/ 889:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// @ts-nocheck

/** @type {JQueryStatic} */
const jQuery = window.jQuery || __webpack_require__(609);
module.exports = jQuery;


/***/ }),

/***/ 511:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// @ts-nocheck

/** @type {PromiseConstructor} */
const Promise = window.Promise || __webpack_require__(804).default;
module.exports = Promise;


/***/ }),

/***/ 203:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// @ts-nocheck

/** @type {Waterpipe} */
const waterpipe = window.waterpipe || __webpack_require__(160);
module.exports = waterpipe;

// assign to a new variable to avoid incompatble declaration issue by typescript compiler
const waterpipe_ = waterpipe;
waterpipe_.pipes['{'] = function (_, varargs) {
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


/***/ }),

/***/ 609:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__609__;

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

/***/ 229:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__229__;

/***/ }),

/***/ 163:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__163__;

/***/ }),

/***/ 260:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__260__;

/***/ }),

/***/ 50:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__50__;

/***/ }),

/***/ 990:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__990__;

/***/ }),

/***/ 668:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__668__;

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
/******/ 	return __webpack_require__(304);
/******/ })()
.default;
});
//# sourceMappingURL=brew.js.map