/*! brew-js v0.7.1 | (c) misonou | https://misonou.github.io */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("zeta-dom"), require("jquery"), require("waterpipe"), require("jq-scrollable"));
	else if(typeof define === 'function' && define.amd)
		define("brew-js", ["zeta-dom", "jquery", "waterpipe", "jq-scrollable"], factory);
	else if(typeof exports === 'object')
		exports["brew-js"] = factory(require("zeta-dom"), require("jquery"), require("waterpipe"), require("jq-scrollable"));
	else
		root["brew"] = factory(root["zeta"], root["jQuery"], root["waterpipe"], root["jq-scrollable"]);
})(self, function(__WEBPACK_EXTERNAL_MODULE__231__, __WEBPACK_EXTERNAL_MODULE__914__, __WEBPACK_EXTERNAL_MODULE__87__, __WEBPACK_EXTERNAL_MODULE__649__) {
return /******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 992:
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

/***/ 649:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__649__;

/***/ }),

/***/ 87:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__87__;

/***/ }),

/***/ 914:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__914__;

/***/ }),

/***/ 231:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__231__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ entry; }
});

// NAMESPACE OBJECT: ./src/util/path.js
var path_namespaceObject = {};
__webpack_require__.r(path_namespaceObject);
__webpack_require__.d(path_namespaceObject, {
  baseUrl: function() { return baseUrl; },
  combinePath: function() { return combinePath; },
  getQueryAndHash: function() { return getQueryAndHash; },
  isSubPathOf: function() { return isSubPathOf; },
  normalizePath: function() { return normalizePath; },
  parsePath: function() { return parsePath; },
  removeQueryAndHash: function() { return removeQueryAndHash; },
  setBaseUrl: function() { return setBaseUrl; },
  toAbsoluteUrl: function() { return toAbsoluteUrl; },
  toRelativeUrl: function() { return toRelativeUrl; },
  toSegments: function() { return toSegments; },
  withBaseUrl: function() { return withBaseUrl; }
});

// NAMESPACE OBJECT: ./src/errorCode.js
var errorCode_namespaceObject = {};
__webpack_require__.r(errorCode_namespaceObject);
__webpack_require__.d(errorCode_namespaceObject, {
  apiError: function() { return apiError; },
  navigationCancelled: function() { return navigationCancelled; },
  navigationRejected: function() { return navigationRejected; },
  networkError: function() { return networkError; },
  resourceError: function() { return resourceError; },
  timeout: function() { return timeout; },
  validationFailed: function() { return validationFailed; }
});

// NAMESPACE OBJECT: ./src/util/fetch.js
var fetch_namespaceObject = {};
__webpack_require__.r(fetch_namespaceObject);
__webpack_require__.d(fetch_namespaceObject, {
  createApiClient: function() { return createApiClient; },
  peekBody: function() { return peekBody; }
});

// NAMESPACE OBJECT: ./src/util/common.js
var common_namespaceObject = {};
__webpack_require__.r(common_namespaceObject);
__webpack_require__.d(common_namespaceObject, {
  addStyleSheet: function() { return addStyleSheet; },
  api: function() { return api; },
  cookie: function() { return common_cookie; },
  copyAttr: function() { return copyAttr; },
  deleteCookie: function() { return deleteCookie; },
  getAttr: function() { return getAttr; },
  getAttrValues: function() { return getAttrValues; },
  getCookie: function() { return getCookie; },
  getFormValues: function() { return getFormValues; },
  getJSON: function() { return getJSON; },
  getQueryParam: function() { return getQueryParam; },
  hasAttr: function() { return hasAttr; },
  isBoolAttr: function() { return isBoolAttr; },
  loadScript: function() { return loadScript; },
  openDeferredURL: function() { return openDeferredURL; },
  preloadImages: function() { return preloadImages; },
  selectorForAttr: function() { return selectorForAttr; },
  setAttr: function() { return setAttr; },
  setCookie: function() { return setCookie; },
  setQueryParam: function() { return setQueryParam; },
  toQueryString: function() { return toQueryString; }
});

// NAMESPACE OBJECT: ./src/util/storage.js
var storage_namespaceObject = {};
__webpack_require__.r(storage_namespaceObject);
__webpack_require__.d(storage_namespaceObject, {
  createObjectStorage: function() { return createObjectStorage; }
});

// NAMESPACE OBJECT: ./src/anim.js
var anim_namespaceObject = {};
__webpack_require__.r(anim_namespaceObject);
__webpack_require__.d(anim_namespaceObject, {
  addAnimateIn: function() { return addAnimateIn; },
  addAnimateOut: function() { return addAnimateOut; },
  animateIn: function() { return animateIn; },
  animateOut: function() { return animateOut; }
});

// NAMESPACE OBJECT: ./src/domAction.js
var domAction_namespaceObject = {};
__webpack_require__.r(domAction_namespaceObject);
__webpack_require__.d(domAction_namespaceObject, {
  NavigationCancellationRequest: function() { return NavigationCancellationRequest; },
  addAsyncAction: function() { return addAsyncAction; },
  closeFlyout: function() { return closeFlyout; },
  isFlyoutOpen: function() { return isFlyoutOpen; },
  openFlyout: function() { return openFlyout; },
  toggleFlyout: function() { return toggleFlyout; }
});

// EXTERNAL MODULE: external {"commonjs":"zeta-dom","commonjs2":"zeta-dom","amd":"zeta-dom","root":"zeta"}
var external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_ = __webpack_require__(231);
;// CONCATENATED MODULE: ./|umd|/zeta-dom/util.js

var _lib$util = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.util,
  always = _lib$util.always,
  any = _lib$util.any,
  arrRemove = _lib$util.arrRemove,
  camel = _lib$util.camel,
  catchAsync = _lib$util.catchAsync,
  combineFn = _lib$util.combineFn,
  createPrivateStore = _lib$util.createPrivateStore,
  deepFreeze = _lib$util.deepFreeze,
  deferrable = _lib$util.deferrable,
  util_define = _lib$util.define,
  defineAliasProperty = _lib$util.defineAliasProperty,
  defineGetterProperty = _lib$util.defineGetterProperty,
  defineHiddenProperty = _lib$util.defineHiddenProperty,
  defineObservableProperty = _lib$util.defineObservableProperty,
  defineOwnProperty = _lib$util.defineOwnProperty,
  definePrototype = _lib$util.definePrototype,
  delay = _lib$util.delay,
  each = _lib$util.each,
  either = _lib$util.either,
  equal = _lib$util.equal,
  errorWithCode = _lib$util.errorWithCode,
  exclude = _lib$util.exclude,
  executeOnce = _lib$util.executeOnce,
  extend = _lib$util.extend,
  fill = _lib$util.fill,
  freeze = _lib$util.freeze,
  grep = _lib$util.grep,
  util_hasOwnProperty = _lib$util.hasOwnProperty,
  iequal = _lib$util.iequal,
  is = _lib$util.is,
  isArray = _lib$util.isArray,
  isError = _lib$util.isError,
  isFunction = _lib$util.isFunction,
  isPlainObject = _lib$util.isPlainObject,
  isThenable = _lib$util.isThenable,
  isUndefinedOrNull = _lib$util.isUndefinedOrNull,
  util_keys = _lib$util.keys,
  kv = _lib$util.kv,
  makeArray = _lib$util.makeArray,
  makeAsync = _lib$util.makeAsync,
  map = _lib$util.map,
  mapGet = _lib$util.mapGet,
  mapObject = _lib$util.mapObject,
  mapRemove = _lib$util.mapRemove,
  matchWord = _lib$util.matchWord,
  noop = _lib$util.noop,
  pick = _lib$util.pick,
  pipe = _lib$util.pipe,
  randomId = _lib$util.randomId,
  reject = _lib$util.reject,
  util_resolve = _lib$util.resolve,
  resolveAll = _lib$util.resolveAll,
  setImmediate = _lib$util.setImmediate,
  setImmediateOnce = _lib$util.setImmediateOnce,
  setIntervalSafe = _lib$util.setIntervalSafe,
  setPromiseTimeout = _lib$util.setPromiseTimeout,
  setTimeoutOnce = _lib$util.setTimeoutOnce,
  single = _lib$util.single,
  throwNotFunction = _lib$util.throwNotFunction,
  util_throws = _lib$util.throws,
  trim = _lib$util.trim,
  values = _lib$util.values,
  watch = _lib$util.watch,
  watchOnce = _lib$util.watchOnce,
  watchable = _lib$util.watchable;

;// CONCATENATED MODULE: ./src/util/path.js
var defaultPort = {
  http: 80,
  https: 443
};
var baseUrl = '/';
function getIndexOfQueryAndHash(path) {
  var pos1 = path.indexOf('?') + 1;
  var pos2 = path.indexOf('#') + 1;
  return pos1 && pos2 ? Math.min(pos1, pos2) - 1 : (pos1 || pos2) - 1;
}

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
  path = String(path);
  if (!returnEmpty && /(^(?:[a-z0-9]+:)?\/\/)|[^A-Za-z0-9-._~:/\[\]@!$&'()*+,;=]/.test(path)) {
    var a = parsePath(path);
    return ((RegExp.$1 && (a.origin || a.protocol + '//' + a.hostname + (a.port && +a.port !== defaultPort[a.protocol.slice(0, -1)] ? ':' + a.port : ''))) + normalizePath(a.pathname, resolveDotDir, true) || '/') + a.search + a.hash;
  }
  path = path.replace(/\/+(\/|$)|(%[0-9a-fA-F]{2})/g, function (v, a, b) {
    return b ? b.toUpperCase() : a;
  });
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
function getQueryAndHash(path) {
  var pos = getIndexOfQueryAndHash(path);
  return pos >= 0 ? path.slice(pos) : '';
}
function removeQueryAndHash(path) {
  var pos = getIndexOfQueryAndHash(path);
  return pos >= 0 ? path.slice(0, pos) : path;
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
;// CONCATENATED MODULE: ./src/errorCode.js
var networkError = 'brew/network-error';
var resourceError = 'brew/resource-error';
var apiError = 'brew/api-error';
var validationFailed = 'brew/validation-failed';
var navigationCancelled = 'brew/navigation-cancelled';
var navigationRejected = 'brew/navigation-rejected';
var timeout = "brew/timeout";
;// CONCATENATED MODULE: ./src/util/fetch.js



var HEADER_CONTENT_TYPE = 'content-type';
function fetchImpl(request) {
  return fetch(request).catch(function (e) {
    if (isError(e) && e.name === 'TypeError') {
      return Response.error();
    }
    throw e;
  });
}
function readBody(input) {
  var contentType = input.headers.get(HEADER_CONTENT_TYPE) || '';
  var pos = contentType.indexOf(';');
  if (pos > 0) {
    contentType = contentType.slice(0, pos);
  }
  if (contentType === 'application/json') {
    return input.json();
  }
  if (contentType === 'multipart/form-data' || contentType === 'application/x-www-form-urlencoded') {
    return input.formData();
  }
  if (contentType.slice(0, 5) === 'text/') {
    return input.text();
  }
  return input.blob();
}
function createRequest(baseUrl, method, path, body, init) {
  if (typeof path === 'string') {
    method = method.toUpperCase();
    init = extend({
      method: method,
      body: body
    }, init);
    init.headers = extend({}, init.headers);
    if (method !== 'GET' && method !== 'HEAD' && (isUndefinedOrNull(body) || isPlainObject(body) || isArray(body))) {
      init.body = JSON.stringify(body || {});
      init.headers[HEADER_CONTENT_TYPE] = 'application/json';
    }
  } else {
    init = path;
    path = method;
  }
  if (typeof path === 'string') {
    path = combinePath(baseUrl, path);
  }
  return new Request(path, init);
}
function executeRequest(self, fetch, request, traps) {
  return fetch(request.clone()).then(function (response) {
    var status = response.status;
    var handleError = function handleError(code, error, message, data) {
      error = errorWithCode(code, message, {
        data: data,
        error: error,
        status: status
      });
      data = (traps.error || noop)(error, response, request, self);
      if (data !== undefined) {
        return data;
      }
      throw error;
    };
    if (status === 0) {
      return handleError(networkError, null, '');
    }
    if (status !== 204) {
      return readBody(response).then(function (data) {
        return response.ok ? (traps.data || pipe)(data, response, request, self) : handleError(apiError, null, response.statusText, data);
      }, function (error) {
        return handleError(apiError, error, error.message);
      });
    }
  });
}
function createApiClient(baseUrl, traps) {
  var fetch = fetchImpl;
  var execute = function execute(request) {
    return executeRequest(client, fetch, request, traps || {});
  };
  var client = function client(method, path, body, init) {
    var request = createRequest(baseUrl, method, path, body, init);
    return traps && traps.request ? makeAsync(traps.request)(request, execute) : execute(request);
  };
  client.use = function (callback) {
    var next = fetch;
    fetch = function fetch(req) {
      return makeAsync(callback)(req, next);
    };
  };
  each('head get post put patch delete', function (i, v) {
    client[v] = function (path, body, options) {
      if (i < 2) {
        options = body;
        body = undefined;
      }
      return client(v, path, body, options);
    };
  });
  return client;
}
function peekBody(input) {
  // Request.body was added relatively recently and not yet supported in Firefox
  // therefore also need to check for Request.method
  if (input.body === null || input.method === 'GET' || input.method === 'HEAD') {
    return util_resolve();
  }
  return readBody(input.clone());
}
// EXTERNAL MODULE: external {"commonjs":"jquery","commonjs2":"jquery","amd":"jquery","root":"jQuery"}
var external_commonjs_jquery_commonjs2_jquery_amd_jquery_root_jQuery_ = __webpack_require__(914);
;// CONCATENATED MODULE: ./src/include/jquery.js

/* harmony default export */ var jquery = (external_commonjs_jquery_commonjs2_jquery_amd_jquery_root_jQuery_);
;// CONCATENATED MODULE: ./|umd|/zeta-dom/cssUtil.js

var _lib$css = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.css,
  isCssUrlValue = _lib$css.isCssUrlValue,
  parseCSS = _lib$css.parseCSS,
  runCSSTransition = _lib$css.runCSSTransition;

;// CONCATENATED MODULE: ./|umd|/zeta-dom/domUtil.js

var domUtil_lib$util = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.util,
  bind = domUtil_lib$util.bind,
  bindOnce = domUtil_lib$util.bindOnce,
  containsOrEquals = domUtil_lib$util.containsOrEquals,
  createNodeIterator = domUtil_lib$util.createNodeIterator,
  dispatchDOMMouseEvent = domUtil_lib$util.dispatchDOMMouseEvent,
  getClass = domUtil_lib$util.getClass,
  getRect = domUtil_lib$util.getRect,
  isVisible = domUtil_lib$util.isVisible,
  iterateNode = domUtil_lib$util.iterateNode,
  matchSelector = domUtil_lib$util.matchSelector,
  rectIntersects = domUtil_lib$util.rectIntersects,
  selectClosestRelative = domUtil_lib$util.selectClosestRelative,
  selectIncludeSelf = domUtil_lib$util.selectIncludeSelf,
  setClass = domUtil_lib$util.setClass;

;// CONCATENATED MODULE: ./src/util/common.js







/** @type {Zeta.Dictionary<Promise<void>>} */
var preloadImagesCache = {};
/** @type {Zeta.Dictionary<Promise<Zeta.Dictionary>>} */
var loadScriptCache = {};
var boolAttrMap = {};
each('allowFullscreen async autofocus autoplay checked controls default defer disabled formNoValidate isMap loop multiple muted noModule noValidate open playsInline readOnly required reversed selected trueSpeed', function (i, v) {
  boolAttrMap[v.toLowerCase()] = v;
});
function encodeNameValue(name, value) {
  return value || value === '' || value === 0 ? encodeURIComponent(name) + '=' + encodeURIComponent(value) : '';
}
function decodeValue(value) {
  return value && value.indexOf('%') >= 0 ? decodeURIComponent(value) : value;
}
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
  return element.getAttribute(name);
}
function setAttr(element, name, value) {
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
function copyAttr(src, dst) {
  each(src.attributes, function (i, v) {
    setAttr(dst, v.name, v.value);
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
function processQueryString(str, name, callback) {
  if (isUndefinedOrNull(str)) {
    str = location.search;
  }
  var getIndex = function getIndex(str, ch, from, until) {
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
function getQueryParam(name, current) {
  return processQueryString(current, name, decodeValue);
}

/**
 * @param {string} name
 * @param {string} value
 * @param {string=} current
 */
function setQueryParam(name, value, current) {
  return processQueryString(current, name, function (cur, input, i, j, s, e) {
    var replacement = encodeNameValue(name, isFunction(value) ? value(decodeValue(cur)) : value);
    var splice = function splice(str, from, to, replace) {
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
function toQueryString(values) {
  var result = map(values, function (v, i) {
    return encodeNameValue(i, v) || null;
  });
  return result[0] ? '?' + result.join('&') : '';
}

/**
 * @param {string} name
 */
function getCookie(name) {
  return single(document.cookie.split(/;\s?/), function (v) {
    var pos = v.indexOf('=');
    return name === decodeValue(v.slice(0, pos)) ? decodeValue(v.slice(pos + 1)) : false;
  });
}

/**
 * @param {string} name
 * @param {string} value
 * @param {*} options
 */
function setCookie(name, value, options) {
  options = options || {};
  if (typeof options === 'number') {
    options = {
      maxAge: options
    };
  }
  document.cookie = encodeNameValue(name, String(value)) + ';path=' + (options.path || '/') + (options.sameSite ? ';samesite=' + options.sameSite : '') + (options.maxAge ? ';expires=' + new Date(Date.now() + options.maxAge).toGMTString() : '') + (options.secure ? ';secure' : '');
  return value;
}

/**
 * @param {string} name
 */
function deleteCookie(name) {
  document.cookie = encodeNameValue(name, '') + ';path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT';
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
  var httpMethods = 'get post put delete patch head';
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
    }, util_resolve());
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
    promises.push(preloadImagesCache[url] || (preloadImagesCache[url] = new Promise(function (resolve) {
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
    return util_resolve();
  }
  if (preloadUrls.length) {
    console.log('Preload image', {
      urls: preloadUrls
    });
  }
  return Promise.race([delay(ms), resolveAll(values(preloadImagesCache))]);
}
function openDeferredURL(promise, loadingUrl, target, features) {
  var win = window.open(loadingUrl || 'data:text/html;base64,TG9hZGluZy4uLg==', target || '_blank', features || '');
  if (!win) {
    return util_resolve(false);
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
// EXTERNAL MODULE: ./node_modules/lz-string/libs/lz-string.js
var lz_string = __webpack_require__(992);
;// CONCATENATED MODULE: ./src/include/lz-string.js

var compressToUTF16 = lz_string.compressToUTF16;
var decompressFromUTF16 = lz_string.decompressFromUTF16;
;// CONCATENATED MODULE: ./src/util/storage.js
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }


var UNDEFINED = 'undefined';
function isObject(value) {
  return value && _typeof(value) === 'object';
}
function shouldIgnore(obj) {
  return obj === window || is(obj, RegExp) || is(obj, Blob) || is(obj, Node);
}
function createObjectStorage(storage, key) {
  var types = new Map([[Date, '#Date '], ['Date', [Date, noop]]]);
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
      extend(entries, JSON.parse(serialized[0]));
      return serialized;
    } catch (e) {}
  }
  function getNextId() {
    return emptyIds.length ? emptyIds.shift() : serialized.push('') - 1;
  }
  function getNextIdForKey(key) {
    var id = entries[key];
    if (id && !(id in objectCache ? isObject(objectCache[id]) : /^[\[\{]/.test(serialized[id]))) {
      // reuse existing index only if target is not an object as it may still be referenced
      return id;
    }
    return getNextId();
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
    var str = JSON.stringify(obj, function (k, v) {
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
    var prefix = obj && _typeof(obj) === 'object' && types.get(obj.constructor);
    return (prefix || '') + str;
  }
  function deserialize(str, refs) {
    if (!str || str === UNDEFINED) {
      return;
    }
    if (str[0] === '#') {
      var pos = str.indexOf(' ');
      var type = types.get(str.slice(1, pos));
      str = str.slice(pos + 1);
      if (type) {
        var len = refs.length;
        var data = deserialize(str, refs);
        if (refs.length === len) {
          return new type[0](data);
        } else {
          var target = new type[0]();
          refs.push({
            t: type[1].bind(undefined, target, data)
          });
          return target;
        }
      }
    }
    return JSON.parse(str, function (k, v) {
      if (typeof v === 'string' && v[0] === '#') {
        v = v.slice(1);
        if (v[0] !== '#') {
          if (!(v in objectCache)) {
            objectCache[v] = undefined;
            cacheObject(v, deserialize(serialized[v], refs));
          } else if (objectCache[v] === undefined) {
            refs.push({
              o: this,
              k: k,
              v: v
            });
          }
          return objectCache[v];
        }
      }
      return v;
    });
  }
  function _revive(id) {
    if (id && serialized[id] && !(id in objectCache)) {
      try {
        var refs = [];
        deserialize('{"": "#' + id + '"}', refs);
        each(refs, function (i, v) {
          if (v.t) {
            v.t();
          } else {
            v.o[v.k] = objectCache[v.v];
          }
        });
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
    registerType: function registerType(key, fn, setter) {
      if (types.has(key) || types.has(fn)) {
        util_throws('Key or constructor already registered');
      }
      types.set(fn, '#' + key + ' ');
      types.set(key, [fn, setter]);
    },
    keys: function keys() {
      return util_keys(entries);
    },
    has: function has(key) {
      return !!entries[key];
    },
    get: function get(key) {
      return _revive(entries[key]);
    },
    revive: function revive(key, callback) {
      var id = entries[key];
      if (id) {
        var value = _revive(id);
        var isConstructor = util_hasOwnProperty(callback, 'prototype');
        if (!isConstructor || !(value instanceof callback)) {
          uncacheObject(id);
          cacheObject(id, isConstructor ? new callback(value) : callback(value));
        }
        return objectCache[id];
      }
    },
    set: function set(key, value) {
      var id = objectMap.get(value) || getNextIdForKey(key);
      entries[key] = id;
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
    persistAll: function persistAll() {
      each(entries, function (i, v) {
        if (isObject(objectCache[v])) {
          dirty.add(objectCache[v]);
        }
      });
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
;// CONCATENATED MODULE: ./|umd|/zeta-dom/events.js

var EventContainer = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.EventContainer,
  EventSource = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.EventSource;

;// CONCATENATED MODULE: ./|umd|/zeta-dom/observe.js

var _lib$dom = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom,
  createAutoCleanupMap = _lib$dom.createAutoCleanupMap,
  registerCleanup = _lib$dom.registerCleanup,
  watchAttributes = _lib$dom.watchAttributes,
  watchElements = _lib$dom.watchElements,
  watchOwnAttributes = _lib$dom.watchOwnAttributes;

;// CONCATENATED MODULE: ./|umd|/zeta-dom/dom.js

var dom = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom;
/* harmony default export */ var zeta_dom_dom = (dom);
var beginDrag = dom.beginDrag,
  dom_blur = dom.blur,
  dom_focus = dom.focus,
  focusable = dom.focusable,
  focused = dom.focused,
  releaseFocus = dom.releaseFocus,
  releaseModal = dom.releaseModal,
  reportError = dom.reportError,
  retainFocus = dom.retainFocus,
  setModal = dom.setModal,
  setTabRoot = dom.setTabRoot,
  textInputAllowed = dom.textInputAllowed,
  unsetTabRoot = dom.unsetTabRoot;

;// CONCATENATED MODULE: ./src/anim.js








var customAnimateIn = {};
var customAnimateOut = {};
var animateScopes = createAutoCleanupMap(noop);
var collectChanges = watchElements(zeta_dom_dom.root, '[animate-in],[animate-sequence],[is-animate-sequence]', handleMutations);
function getShouldAnimate(element, trigger, scope, filterCallback) {
  var filter = trigger === 'show' ? ':not([animate-on]), [animate-on~="' + trigger + '"]' : '[animate-on~="' + trigger + '"]';
  return function (v) {
    return matchSelector(v, filter) && (!scope || containsOrEquals(jquery(v).closest(scope)[0] || zeta_dom_dom.root, element)) && (!filterCallback || filterCallback(v)) && isVisible(v);
  };
}
function handleMutations(addNodes) {
  if (addNodes[0]) {
    each(animateScopes, function (i, v) {
      each(v, function (j, v) {
        v.start();
      });
    });
  }
}
function handleAnimation(element, animationType, animationTrigger, customAnimation, callback) {
  var source = new EventSource();
  var animated = new Set();
  var sequences = new WeakMap();
  var deferred = deferrable();
  var promise = setPromiseTimeout(deferred, 1500).catch(function () {
    console.warn('Animation might take longer than expected', {
      element: element,
      animationType: animationType,
      animationTrigger: animationTrigger
    });
  });
  var fireEvent = executeOnce(function () {
    zeta_dom_dom.emit('animationstart', element, {
      animationType: animationType,
      animationTrigger: animationTrigger
    }, {
      bubbles: true,
      source: source
    });
    promise.then(function () {
      zeta_dom_dom.emit('animationcomplete', element, {
        animationType: animationType,
        animationTrigger: animationTrigger
      }, {
        bubbles: true,
        source: source
      });
    });
  });
  var animate = function animate(element) {
    animated.add(element);
    // transform cannot apply on inline elements
    if (jquery(element).css('display') === 'inline') {
      jquery(element).css('display', 'inline-block');
    }
    var effects = fill(getAttr(element, 'animate-in') || '', true);
    var ms = parseFloat(jquery(element).css('transition-delay')) * 1000 || 0;
    fireEvent();
    deferred.waitFor(runCSSTransition(element, 'tweening-' + animationType), zeta_dom_dom.emit('animate' + animationType, element, null, {
      source: source
    }));
    each(customAnimation, function (i, v) {
      if (effects[i] || element.attributes[i]) {
        var fn = v.bind(undefined, element, getAttr(element, i) || '');
        deferred.waitFor(ms ? delay(ms, fn) : fn());
      }
    });
  };
  return {
    promise: promise.then(function () {
      return callback(makeArray(animated));
    }),
    animate: animate,
    sequence: function sequence(element, filter, attr) {
      var queue = mapGet(sequences, element, Array);
      var reverse = getAttr(element, 'animate-sequence-reverse');
      var selector = getAttr(element, 'animate-sequence') || '';
      var elements = jquery(element).find(selector[0] === '>' ? selector : jquery(selector)).filter(filter).attr(attr || {}).get();
      if (reverse === '' || reverse === animationType) {
        elements.reverse();
      }
      each(elements, function (i, v) {
        if (queue.indexOf(v) < 0 && queue.push(v) === 1) {
          fireEvent();
          deferred.waitFor(delay(50, function next() {
            animate(queue.shift());
            return queue[0] && delay(50, next);
          }));
        }
      });
    }
  };
}

/**
 * @param {Element} element
 * @param {string} trigger
 * @param {string=} scope
 * @param {((elm: Element) => boolean) | boolean=} filterCallback
 */
function animateIn(element, trigger, scope, filterCallback) {
  var dict = mapGet(animateScopes, element, Object);
  var scopeObject = dict[trigger] || (dict[trigger] = {
    start: filterCallback === true ? animateIn.bind(0, element, trigger, scope) : noop
  });
  var shouldAnimate = getShouldAnimate(element, trigger, scope, isFunction(filterCallback));
  var anim = scopeObject.anim || (scopeObject.anim = handleAnimation(element, 'in', trigger, customAnimateIn, function () {
    scopeObject.anim = null;
  }));
  selectIncludeSelf('[animate-in]:not([is-animate-sequence],.tweening-in)', element).filter(shouldAnimate).forEach(function (v) {
    anim.animate(v);
  });
  selectIncludeSelf('[animate-sequence]', element).filter(shouldAnimate).forEach(function (v) {
    if (!getClass(v, 'tweening-in')) {
      setAttr(v, 'animate-in', '');
      anim.animate(v);
    }
    anim.sequence(v, ':not(.tweening-in)', {
      'animate-in': getAttr(v, 'animate-sequence-type') || '',
      'is-animate-sequence': ''
    });
  });
  collectChanges(true);
  return anim.promise;
}

/**
 * @param {Element} element
 * @param {string} trigger
 * @param {string=} scope
 * @param {((elm: Element) => boolean)=} filterCallback
 * @param {boolean=} excludeSelf
 */
function animateOut(element, trigger, scope, filterCallback, excludeSelf) {
  var shouldAnimate = getShouldAnimate(element, trigger, scope, filterCallback);
  var elements = selectIncludeSelf('.tweening-in,[animate-out]', element);
  if (excludeSelf && elements[0] === element) {
    elements.splice(0, 1);
  }
  var filtered = elements.filter(shouldAnimate);
  var anim = handleAnimation(element, 'out', trigger, customAnimateOut, function (animated) {
    jquery(trigger === 'show' ? elements : filtered).add(animated).removeClass('tweening-in tweening-out');
  });
  jquery(filtered).filter('[animate-out]:not([is-animate-sequence],.tweening-out)').each(function (i, v) {
    anim.animate(v);
  });
  jquery(filtered).filter('[animate-out][animate-sequence]').each(function (i, v) {
    anim.sequence(v, '.tweening-in');
  });
  delete mapGet(animateScopes, element, Object)[trigger];
  return anim.promise;
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
var external_waterpipe_ = __webpack_require__(87);
;// CONCATENATED MODULE: ./src/include/waterpipe.js

/* harmony default export */ var waterpipe = (external_waterpipe_);

// assign to a new variable to avoid incompatble declaration issue by typescript compiler
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
};
waterpipe_.pipes['{'].varargs = true;
;// CONCATENATED MODULE: ./|umd|/zeta-dom/domLock.js

var domLock_lib$dom = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom,
  CancellationRequest = domLock_lib$dom.CancellationRequest,
  cancelLock = domLock_lib$dom.cancelLock,
  lock = domLock_lib$dom.lock,
  locked = domLock_lib$dom.locked,
  notifyAsync = domLock_lib$dom.notifyAsync,
  preventLeave = domLock_lib$dom.preventLeave,
  subscribeAsync = domLock_lib$dom.subscribeAsync;

;// CONCATENATED MODULE: ./src/libCheck.js

var BREW_KEY = '__BREW__';
if (window[BREW_KEY]) {
  throw new Error('Another copy of brew-js is instantiated. Please check your dependencies.');
}
defineHiddenProperty(window, BREW_KEY, true, true);
/* harmony default export */ var libCheck = (null);
;// CONCATENATED MODULE: ./src/defaults.js
/** @deprecated @type {Zeta.Dictionary} */
var defaults = {};
/* harmony default export */ var src_defaults = (defaults);
;// CONCATENATED MODULE: ./src/app.js








var emitter = new EventContainer();
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
var appReadyResolve;
var appReadyReject;
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
  return fill(event, handler);
}
function initExtension(app, name, deps, options, callback) {
  if (extensions[name]) {
    throw new Error('Extension' + name + 'is already initiated');
  }
  deps = grep(deps, function (v) {
    return !extensions[v.replace(/^\?/, '')];
  });
  var counter = deps.length || 1;
  var wrapper = function wrapper(loaded) {
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
  var setReadyState = defineObservableProperty(self, 'readyState', 'init', true);
  defineOwnProperty(self, 'element', root, true);
  defineOwnProperty(self, 'ready', new Promise(function (resolve, reject) {
    appReadyResolve = resolve.bind(0, self);
    appReadyReject = reject;
  }), true);
  always(self.ready, function (resolved, error) {
    setReadyState(resolved ? 'ready' : 'error');
    if (resolved) {
      appReady = true;
      app.emit('ready');
    } else {
      reportError(error);
    }
  });
}
definePrototype(App, {
  emit: function emit(event, element, data, options) {
    if (!is(element, Node)) {
      return emitter.emit(event, this, element, data);
    }
    var result = zeta_dom_dom.emit(event, element, data, options);
    if (!result && (element === root || options === true || (options || '').bubbles)) {
      // backward compatibility where app will receive event bubbled up from dom element
      data = extend({
        target: element
      }, isPlainObject(data) || {
        data: data
      });
      result = emitter.emit(event, this, data, options);
    }
    return result;
  },
  define: function define(props) {
    util_define(this, props);
  },
  beforeInit: function beforeInit(promise) {
    if (isFunction(promise)) {
      promise = makeAsync(promise).call(this);
    }
    appInit.waitFor(promise.then(null, appReadyReject));
  },
  halt: function halt() {
    appInit.waitFor(new Promise(noop));
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
    if (isFunction(event) || event === undefined) {
      return emitter.add(this, wrapEventHandlers(target, event));
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
  appInit.then(appReadyResolve);
  bind(window, 'pagehide', function (e) {
    app.emit('unload', {
      persisted: e.persisted
    }, {
      handleable: false
    });
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
function emitAppEvent() {
  return defaultApp.emit.apply(defaultApp, arguments);
}
function isElementActive(element) {
  return !app || app.isElementActive(element);
}
/* harmony default export */ var src_app = (init);
;// CONCATENATED MODULE: ./src/util/console.js
function console_typeof(o) { "@babel/helpers - typeof"; return console_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, console_typeof(o); }

function toElementTag(element) {
  return element.tagName.toLowerCase() + (element.id ? '#' + element.id : element.className.trim() && element.className.replace(/^\s*|\s+(?=\S)/g, '.'));
}
function truncateJSON(json) {
  return '[{"]'.indexOf(json[0]) >= 0 && json.length > 200 ? json[0] + json.substr(1, 199) + "\u2026" + json[json.length - 1] : json;
}
function formatMessage(eventSource, message) {
  message = makeArray(message).map(function (v) {
    return is(v, Element) ? toElementTag(v) + ':' : v && console_typeof(v) === 'object' ? truncateJSON(JSON.stringify(v)) : v;
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
;// CONCATENATED MODULE: ./src/dom.js










var _ = createPrivateStore();
var dom_root = zeta_dom_dom.root;
var updatedElements = new Set();
var pendingDOMUpdates = new Map();
var preupdateHandlers = [];
var matchElementHandlers = [];
var selectorHandlers = [];
/** @type {Zeta.Dictionary<Brew.DOMProcessorCallback>} */
var transformationHandlers = {};
/** @type {Zeta.Dictionary<Brew.DOMProcessorCallback>} */
var renderHandlers = {};
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
    } else if (j === '$$html') {
      element.innerHTML = v;
    } else if (j === 'style') {
      jquery(element).css(v);
    } else if (isBoolAttr(element, j)) {
      setAttr(element, j, v ? '' : null);
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
  var selector = selectorForAttr(transformationHandlers);
  if (!selector) {
    return;
  }
  var transformed = new Set();
  var exclude;
  do {
    elements = grep(makeArray(elements), function (v) {
      return containsOrEquals(dom_root, v);
    });
    exclude = makeArray(transformed);
    jquery(selectIncludeSelf(selector, elements)).not(exclude).each(function (j, element) {
      each(transformationHandlers, function (i, v) {
        if (element.attributes[i] && containsOrEquals(dom_root, element)) {
          v(element, getComponentState.bind(0, i), applyDOMUpdates);
          transformed.add(element);
        }
      });
    });
  } while (exclude.length !== transformed.size);
}
function processRender(elements, updatedProps, applyDOMUpdates) {
  var selector = selectorForAttr(renderHandlers);
  if (!selector) {
    return;
  }
  var visited = [];
  each(elements.reverse(), function (i, v) {
    groupLog('statechange', [v, updatedProps ? updatedProps.get(v).newValues : {}], function (console) {
      console.log(v === dom_root ? document : v);
      jquery(selectIncludeSelf(selector, v)).not(visited).each(function (i, element) {
        each(renderHandlers, function (i, v) {
          if (element.attributes[i]) {
            v(element, getComponentState.bind(0, i), applyDOMUpdates);
          }
        });
        visited.push(element);
      });
    });
  });
}
function isDirective(name) {
  return !!(transformationHandlers[name] || renderHandlers[name]);
}
function addSelectHandlers(target, event, handler, noChildren) {
  var unbindHandlers = [];
  var obj = {
    target: target,
    doMount: event.mounted || matchWord(event, 'mounted'),
    add: function add(elements) {
      unbindHandlers.push(app.on(elements, event, handler, noChildren));
    }
  };
  selectorHandlers.push(obj);
  unbindHandlers.push(function () {
    // remove entries from array in next event loop
    // to prevent misindexing in mountElement
    obj.disposed = true;
    setImmediate(function () {
      arrRemove(selectorHandlers, obj);
    });
  });
  return combineFn(unbindHandlers);
}

/**
 * @param {string} selector
 * @param {(ele: Element) => void} handler
 */
function matchElement(selector, handler) {
  var callback = function callback(element) {
    jquery(selectIncludeSelf(selector, element)).each(function (i, v) {
      handler.call(v, v);
    });
  };
  matchElementHandlers.push(callback);
  if (appReady) {
    callback(dom_root);
  }
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
  notifyAsync(element || dom_root, promise);
  return promise.then(callback);
}

/**
 * @param {Element} element
 */
function markUpdated(element) {
  if (containsOrEquals(dom_root, element)) {
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
        return containsOrEquals(dom_root, v);
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
      processRender(arr, updatedProps, applyDOMUpdates);
    });

    // perform any async task that is related or required by the DOM changes
    var preupdatePromise = resolveAll(preupdateHandlers.map(function (v) {
      return v(domUpdates);
    }));

    // perform DOM updates, or add to pending updates if previous update is not completed
    // also wait for animation completed if suppressAnim is off
    preupdatePromise.then(function () {
      var animScopes = new Map();
      if (!suppressAnim) {
        each(updatedProps, function (element) {
          var animParent = jquery(element).filter('[match-path]')[0] || jquery(element).parents('[match-path]')[0] || dom_root;
          var groupElements = animScopes.get(animParent);
          if (!groupElements) {
            var filter = function filter(v) {
              var haystack = v.getAttribute('animate-on-statechange');
              if (!haystack) {
                return true;
              }
              for (var cur; v && !(cur = updatedProps.get(v)); v = v.parentNode);
              return cur && any(haystack, function (v) {
                return v in cur.newValues;
              });
            };
            groupElements = [];
            setImmediate(function () {
              animateOut(animParent, 'statechange', '[match-path].hidden', filter, true).then(function () {
                each(groupElements, function (i, v) {
                  updateDOM(v, mapRemove(pendingDOMUpdates, v));
                });
                animateIn(animParent, 'statechange', '[match-path].hidden', filter);
              });
            });
            animScopes.set(animParent, groupElements);
          }
          mapGet(pendingDOMUpdates, element, Object);
          groupElements.push(element);
        });
      }
      each(domUpdates, function (element, props) {
        if (pendingDOMUpdates.has(element)) {
          mergeDOMUpdates(pendingDOMUpdates.get(element), props);
        } else {
          updateDOM(element, props);
        }
      });
      each(updatedProps, function (i, v) {
        emitAppEvent('statechange', i, {
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
  resetVar(element);
  try {
    var applyDOMUpdates = function applyDOMUpdates(element, props) {
      updateDOM(element, props, true);
    };
    processTransform(element, applyDOMUpdates);
    processRender([element], null, applyDOMUpdates);
  } finally {
    stateChangeLock = prevStateChangeLock;
  }
  var mountedElements = new Set([element]);
  var firedOnRoot = element === dom_root;
  var index = -1,
    index2 = 0;
  while (index < selectorHandlers.length) {
    each(selectorHandlers.slice(index < 0 ? 0 : index), function (i, v) {
      if (!v.disposed) {
        var elements = selectIncludeSelf(v.target, element);
        if (elements[0]) {
          if (index < 0) {
            v.add(elements);
          }
          if (v.doMount) {
            each(elements, function (i, v) {
              mountedElements.add(v);
            });
          }
        }
      }
    });
    index = selectorHandlers.length;
    each(jquery.uniqueSort(makeArray(mountedElements).slice(index2)), function (i, v) {
      emitAppEvent('mounted', v);
    });
    if (!firedOnRoot) {
      firedOnRoot = true;
      emitAppEvent('mounted', dom_root, {
        target: element
      });
    }
    index2 = mountedElements.size;
  }
  combineFn(matchElementHandlers)(element);
  markUpdated(element);
  setImmediateOnce(processStateChange);
}

/**
 * @param {boolean=} suppressPrompt
 */
function dom_preventLeave(suppressPrompt) {
  return suppressPrompt ? locked(dom_root) : cancelLock(dom_root);
}
function addTemplate(name, template) {
  jquery(template).clone().attr('brew-template', name).appendTo(document.body);
}
function addTransformer(name, callback) {
  transformationHandlers[name] = throwNotFunction(callback);
}
function addRenderer(name, callback) {
  renderHandlers[name] = throwNotFunction(callback);
}
;// CONCATENATED MODULE: ./|umd|/zeta-dom/tree.js

var InheritedNodeTree = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.InheritedNodeTree;

;// CONCATENATED MODULE: ./src/var.js








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
var globals = {
  get app() {
    return app;
  }
};
var tree = new InheritedNodeTree(var_root, VarContext, {
  selector: selectorForAttr(varAttrs)
});
var inited = true;

/**
 * @class
 * @this {Brew.VarContext}
 */
function VarContext() {
  var self = this;
  var element = self.element;
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
      }
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
  var values = inited && (hasDataAttributes(element) ? tree.setNode(element) : tree.getNode(element)) || {};
  if (name !== true) {
    return name ? values[name] : extend({}, values);
  }
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
  return (templateMode ? evalTemplate : evalExpression)(template, context);
}
function evalExpression(template, context) {
  return template ? waterpipe.eval(template, extend({}, context), {
    globals: globals
  }) : null;
}
function evalTemplate(template, context, html) {
  return template ? waterpipe(template, extend({}, context), {
    globals: globals,
    html: !!html
  }) : '';
}

/**
 * @param {Element} element
 * @param {string} attrName
 * @param {boolean=} templateMode
 * @param {VarContext=} context
 */
function evalAttr(element, attrName, templateMode, context) {
  return (templateMode ? evalTemplate : evalExpression)(getAttr(element, attrName), context || getVar(element));
}
tree.on('update', function (e) {
  each(e.updatedNodes, function (i, v) {
    markUpdated(v.element);
  });
});
;// CONCATENATED MODULE: ./src/directive.js






var directive_root = zeta_dom_dom.root;
var directive_emitter = new EventContainer();
var directive_toString = function toString(v) {
  return isUndefinedOrNull(v) ? null : String(v);
};
var toNumber = function toNumber(v) {
  return isUndefinedOrNull(v) || isNaN(v) ? null : +v;
};
var converters = {
  string: [pipe, directive_toString],
  number: [toNumber, function (v) {
    return directive_toString(toNumber(v));
  }],
  boolean: [function (v) {
    return !isUndefinedOrNull(v);
  }, function (v) {
    return v ? '' : null;
  }]
};
function Component(element) {
  defineOwnProperty(this, 'element', element, true);
}
function ComponentContext() {}
definePrototype(ComponentContext, {
  on: function on(event, handler) {
    return directive_emitter.add(this, event, handler);
  }
});
watchable(ComponentContext.prototype);
function createContextClass(options) {
  var attributes = map(options.directives, function (v) {
    return v.attribute;
  });
  var directives = mapObject(options.directives, function (v) {
    var name = v.attribute;
    var converter = converters[v.type] || converters.string;
    return {
      get: function get(element) {
        return converter[0](getAttr(element, name));
      },
      set: function set(element, value) {
        value = converter[1](value);
        setAttr(element, name, value);
        return converter[0](value);
      }
    };
  });
  var Context = function Context(element) {
    var self = this;
    defineOwnProperty(self, 'element', element, true);
    if (attributes[0]) {
      var update = function update() {
        each(directives, function (i, v) {
          self[i] = v.get(element);
        });
      };
      update();
      var collectChange = watchOwnAttributes(element, attributes, update);
      self.on('destroy', collectChange.dispose);
    }
  };
  definePrototype(Context, ComponentContext);
  each(directives, function (i) {
    defineObservableProperty(Context.prototype, i, null, function (v) {
      return directives[i].set(this.element, v);
    });
  });
  return Context;
}
function getDirectiveComponent(element) {
  return new Component(element);
}
function registerSimpleDirective(key, attr, init, dispose) {
  var map = new WeakMap();
  var set = function set(enabled, element) {
    setAttr(element, attr, enabled ? '' : null);
    if (!enabled) {
      (mapRemove(map, element) || noop)();
    } else if (!map.has(element)) {
      map.set(element, isFunction(init(element)) || dispose && dispose.bind(undefined, element));
    }
  };
  watchElements(directive_root, '[' + attr + ']', function (added, removed) {
    removed.forEach(set.bind(0, false));
    added.forEach(set.bind(0, true));
  }, true);
  defineGetterProperty(Component.prototype, key, function () {
    return getAttr(this.element, attr) !== null;
  }, function (v) {
    return set(v, this.element);
  });
}
function registerDirective(key, selector, options) {
  var Context = createContextClass(options);
  var map = new WeakMap();
  var collect = watchElements(directive_root, selector, function (added, removed) {
    each(removed, function (i, v) {
      directive_emitter.emit('destroy', mapRemove(map, v).context);
    });
    each(added, function (i, v) {
      var context = new Context(v);
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
;// CONCATENATED MODULE: ./src/domAction.js













var SELECTOR_DISABLED = '[disabled],.disabled,:disabled';
var domAction_root = zeta_dom_dom.root;
var flyoutStates = createAutoCleanupMap(function (element, state) {
  state.resolve();
});
var executedAsyncActions = new Map();
/** @type {Zeta.Dictionary<Zeta.AnyFunction>} */
var asyncActions = {};
function NavigationCancellationRequest(path, external) {
  CancellationRequest.call(this, 'navigate');
  this.external = !!external;
  this[external ? 'url' : 'path'] = path;
}
definePrototype(NavigationCancellationRequest, CancellationRequest, {
  path: null,
  url: null
});
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
 * @param {Element | Element[] | string=} flyout
 * @param {any=} value
 */
function closeFlyout(flyout, value) {
  /** @type {Element[]} */
  var elements = jquery(flyout || '[is-flyout].open').get();
  var source = new EventSource();
  return resolveAll(elements.map(function (v) {
    var state = flyoutStates.get(v);
    if (!state) {
      return util_resolve();
    }
    var promise = state.closePromise;
    if (!promise) {
      promise = resolveAll([runCSSTransition(v, 'closing'), animateOut(v, 'open')].map(catchAsync), function () {
        if (flyoutStates.get(v) === state) {
          flyoutStates.delete(v);
          setClass(v, {
            open: false,
            closing: false,
            visible: false
          });
          zeta_dom_dom.emit('flyouthide', v, null, {
            source: source
          });
        }
      });
      state.closePromise = promise;
      state.resolve(value);
      releaseModal(v);
      releaseFocus(v);
      dom_blur(v);
      if (state.source) {
        setClass(state.source, 'target-opened', false);
      }
      zeta_dom_dom.emit('flyoutclose', v, null, {
        source: source
      });
    }
    return promise;
  })).then(noop);
}
function toggleFlyout(selector, source, options) {
  return openFlyout(selector, null, source, options, true);
}

/**
 * @param {string} selector
 * @param {any=} states
 * @param {Element=} source
 * @param {(Zeta.Dictionary | boolean)=} options
 * @param {boolean=} closeIfOpened
 */
function openFlyout(selector, states, source, options, closeIfOpened) {
  var element = jquery(selector)[0];
  if (!element || !containsOrEquals(domAction_root, element)) {
    return reject();
  }
  if (is(states, Node) || isPlainObject(source)) {
    options = source;
    source = states;
    states = null;
  }
  var prev = flyoutStates.get(element);
  if (prev && !prev.closePromise) {
    if ((closeIfOpened || options) === true) {
      closeFlyout(element, source && waterpipe.eval('`' + source.value));
    } else if (prev.path !== false) {
      prev.path = app.path;
    }
    return prev.promise;
  }
  options = extend({
    focus: !source || !textInputAllowed(source),
    tabThrough: hasAttr(element, 'tab-through'),
    popover: hasAttr(element, 'is-popover'),
    modal: hasAttr(element, 'is-modal')
  }, options);
  var scope = is(options.containment, Node) || jquery(element).closest(options.containment)[0] || domAction_root;
  var resolve;
  var promise = new Promise(function (resolve_) {
    resolve = resolve_;
  });
  if (!options.popover) {
    closeFlyout(map(flyoutStates, function (v, i) {
      return v.popover && !containsOrEquals(i, element) ? i : null;
    }));
  }
  flyoutStates.set(element, {
    source: source,
    promise: promise,
    resolve: resolve,
    path: options.closeOnNavigate !== false ? app.path : false,
    popover: options.popover
  });
  retainFocus(source || zeta_dom_dom.activeElement, element);
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
  resolveAll([runCSSTransition(element, 'open'), animateIn(element, 'open')].map(catchAsync), function () {
    if (options.focus && (zeta_dom_dom.activeElement === element || !focused(element))) {
      var focusTarget = options.focus === true ? element : jquery(element).find(options.focus)[0];
      if (focusTarget) {
        dom_focus(focusTarget);
      } else {
        dom_focus(element, false);
      }
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
  if (options.preventLeave) {
    preventLeave(promise);
  }
  if (options.preventNavigation) {
    catchAsync(lock(element, promise, isFunction(options.preventNavigation)));
  }
  var createHandler = function createHandler(callback) {
    return function (e) {
      if (callback(e)) {
        closeFlyout(element);
        if (zeta_dom_dom.event) {
          zeta_dom_dom.event.preventDefault();
        }
        e.handled();
      }
    };
  };
  var shouldCloseOnFocusEvent = function shouldCloseOnFocusEvent(e) {
    return options.closeOnBlur !== false && !getAttr(element, 'swipe-dismiss') && (e.type === 'focusin' ? !containsOrEquals(element, zeta_dom_dom.activeElement) : containsOrEquals(scope, zeta_dom_dom.activeElement));
  };
  always(promise, combineFn(zeta_dom_dom.on(source || element, 'focusout', createHandler(shouldCloseOnFocusEvent)), zeta_dom_dom.on(scope, 'focusin', createHandler(shouldCloseOnFocusEvent)), zeta_dom_dom.on(element, 'gesture', createHandler(function (e) {
    return e.data === camel('swipe-' + getAttr(element, 'swipe-dismiss'));
  }))));
  zeta_dom_dom.emit('flyoutshow', element, {
    data: states
  });
  return promise;
}
registerSimpleDirective('enableLoadingClass', 'loading-class', function (element) {
  return subscribeAsync(element, function (loading) {
    if (loading) {
      setClass(element, 'loading', loading);
    } else {
      catchAsync(runCSSTransition(element, 'loading-complete', function () {
        setClass(element, 'loading', false);
      }));
    }
  });
});
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
    if ("navigate" in app && (dataHref || app.isAppPath(href))) {
      e.preventDefault();
      app.navigate(dataHref || app.fromHref(href));
    } else if (locked(domAction_root)) {
      e.preventDefault();
      cancelLock(domAction_root, new NavigationCancellationRequest(href, true)).then(function () {
        var features = grep([matchWord(self.rel, 'noreferrer'), matchWord(self.rel, 'noopener')], pipe);
        window.open(dataHref || href, '_self', features.join(','));
      }, function () {
        console.warn('Navigation cancelled');
      });
    }
  });
});
;// CONCATENATED MODULE: ./src/core.js
function core_typeof(o) { "@babel/helpers - typeof"; return core_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, core_typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == core_typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != core_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != core_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }













var method = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({
  ErrorCode: errorCode_namespaceObject,
  defaults: src_defaults
}, common_namespaceObject), storage_namespaceObject), path_namespaceObject), fetch_namespaceObject), anim_namespaceObject), domAction_namespaceObject), {}, {
  getDirectiveComponent: getDirectiveComponent,
  registerDirective: registerDirective,
  getVarScope: getVarScope,
  getVar: getVar,
  setVar: setVar,
  resetVar: resetVar,
  declareVar: declareVar,
  evalAttr: evalAttr,
  isElementActive: isElementActive,
  handleAsync: handleAsync,
  preventLeave: dom_preventLeave,
  install: install,
  addDetect: addDetect,
  addExtension: addExtension,
  addRenderer: addRenderer,
  addTransformer: addTransformer,
  addTemplate: addTemplate
});
util_define(src_app, method);
/* harmony default export */ var core = (src_app);
;// CONCATENATED MODULE: ./src/extension/config.js



/* harmony default export */ var config = (addExtension('config', function (app, options) {
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
;// CONCATENATED MODULE: ./src/extension/template.js
















var IMAGE_STYLE_PROPS = 'background-image';
var templates = {};
var template_root = zeta_dom_dom.root;
/* harmony default export */ var template = (addExtension(true, 'template', function (app) {
  var addListener = app.on.bind(app);
  app.define({
    getVar: getVar,
    setVar: setVar,
    matchElement: matchElement,
    beforeUpdate: hookBeforeUpdate,
    on: function on(target, event, handler, noChildren) {
      var unbind = addListener(target, event, handler, noChildren);
      if (isFunction(event) || typeof target !== 'string') {
        return unbind;
      }
      return combineFn(unbind, addSelectHandlers(target, event, handler, noChildren));
    }
  });
  app.on('ready', function () {
    mountElement(template_root);
  });
  addTransformer('apply-template', function (element, getState) {
    var state = getState(element);
    var templateName = getAttr(element, 'apply-template');
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
      template = template.cloneNode(true);

      // reset attributes on the apply-template element
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
        jquery(v).replaceWith($contents.filter(getAttr(v, 'for') || ''));
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
    var varname = getAttr(element, 'switch') || '';
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
    var resetOnChange = !matchWord('switch', getAttr(element, 'keep-child-state') || '');
    var previous = state.matched;
    var matched;
    var itemValues = new Map();
    $target.each(function (i, v) {
      var thisValue = waterpipe.eval('"null" ?? ' + getAttr(v, 'match-' + varname), getVar(v));
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
        if (!isDirective(w.name) && w.value.indexOf('{{') >= 0) {
          templates[w.name] = isBoolAttr(element, w.name) ? w.value.replace(/^{{|}}$/g, '') : w.value;
        }
      });
      if (!element.childElementCount && (element.textContent || '').indexOf('{{') >= 0) {
        templates.$$html = element.textContent.replace(/(\{\{(?:\}(?!\})|[^}])*\}*\}\})|</g, function (v, a) {
          return a || '&lt;';
        });
      }
      state.templates = templates;
    }
    var context = getVar(element);
    var props = {};
    each(templates, function (i, w) {
      var value = evaluate(w, context, element, i, !isBoolAttr(element, i));
      if ((i === '$$html' ? element.innerHTML : (getAttr(element, i) || '').replace(/["']/g, '')) !== value) {
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
  addRenderer('data-src', function (element, getState, applyDOMUpdates) {
    applyDOMUpdates(element, {
      src: withBaseUrl(evalAttr(element, 'data-src', true))
    });
  });
  addRenderer('data-bg-src', function (element, getState, applyDOMUpdates) {
    applyDOMUpdates(element, {
      style: {
        backgroundImage: 'url("' + withBaseUrl(evalAttr(element, 'data-bg-src', true)) + '")'
      }
    });
  });
  addRenderer('prevent-leave', function (element, getState) {
    var state = getState(element);
    var value = evalAttr(element, 'prevent-leave');
    if (either(value, state.value)) {
      state.value = value;
      if (value) {
        var promise = new Promise(function (resolve) {
          state.resolve = resolve;
        });
        preventLeave(element, promise, function () {
          return util_resolve(app.emit('preventLeave', element, null, true)).then(function (result) {
            if (!result) {
              throw errorWithCode(navigationRejected);
            }
          });
        });
      } else {
        state.resolve();
      }
    }
  });
  addAsyncAction('validate', function (e) {
    var target = selectClosestRelative(getAttr(this, 'validate') || '', e.target);
    if (target) {
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
    var method = camel(getAttr(self, 'context-method') || '');
    if (isFunction(app[method])) {
      var formSelector = getAttr(self, 'context-form');
      var form = formSelector ? selectClosestRelative(formSelector, self) : self.form;
      var params;
      var valid = true;
      if (hasAttr(self, 'method-args')) {
        params = makeArray(evalAttr(self, 'method-args'));
      } else if (form) {
        valid = zeta_dom_dom.emit('validate', form) || form.checkValidity();
        params = [getFormValues(form)];
      }
      var promise = resolveAll(valid, function (valid) {
        if (!valid) {
          throw errorWithCode(validationFailed);
        }
        return app[method].apply(app, params);
      });
      var returnVar = getAttr(self, 'method-return');
      if (returnVar) {
        return promise.then(function (data) {
          setVar(self, returnVar, data);
        });
      }
      return promise;
    }
  });
  matchElement('form[form-var]', function (form) {
    var varname = getAttr(form, 'form-var');
    var values = {};
    var update = function update(updateField) {
      if (updateField) {
        values = getFormValues(form);
      }
      if (!varname) {
        setVar(form, values);
      } else {
        var currentValues = getVar(form, varname) || {};
        if (!equal(values, pick(currentValues, util_keys(values)))) {
          setVar(form, varname, extend({}, currentValues, values));
        }
      }
    };
    watchAttributes(form, 'value', function () {
      setImmediateOnce(update);
    });
    watchElements(form, ':input', function (addedInputs) {
      each(addedInputs, function (i, v) {
        registerCleanup(v, bind(v, 'change input', function () {
          setImmediateOnce(update);
        }));
      });
      update(true);
    }, true);
    zeta_dom_dom.on(form, 'reset', function () {
      if (varname) {
        if (!isElementActive(getVarScope(varname, form))) {
          form.reset();
        }
      } else {
        each(form.elements, function (i, v) {
          if (!isElementActive(getVarScope(v.name, form))) {
            v.value = null;
          }
        });
      }
      return true;
    });
  });
  matchElement('[loading-scope]', function (element) {
    zeta_dom_dom.subscribeAsync(element, function (loading) {
      setVar(element, 'loading', loading);
    });
  });
  matchElement('[error-scope]', function (element) {
    zeta_dom_dom.subscribeAsync(element);
    zeta_dom_dom.on(element, {
      asyncStart: function asyncStart() {
        setVar(element, 'error', null);
      },
      error: function error(e) {
        var error = e.error || {};
        setVar(element, 'error', error.code || error.message || true);
      }
    });
  });
  app.on('pageenter', function (e) {
    jquery(selectIncludeSelf('form[form-var]', e.target)).each(function (i, v) {
      jquery(':input:eq(0)', v).trigger('change');
    });
  });
  zeta_dom_dom.ready.then(function () {
    jquery('[brew-template]').each(function (i, v) {
      var clone = v.cloneNode(true);
      clone.removeAttribute('brew-template');
      templates[getAttr(v, 'brew-template')] = clone;
    });
    jquery('apply-attributes').each(function (i, v) {
      var $target = jquery(getAttr(v, 'elements') || '', v.parentNode || template_root);
      each(v.attributes, function (i, v) {
        if (v.name !== 'elements') {
          $target.each(function (i, w) {
            w.setAttribute(v.name, v.value);
          });
        }
      });
    }).remove();
    jquery('body').on('click', '[set-var]:not([match-path])', function (e) {
      var self = e.currentTarget;
      if (self === jquery(e.target).closest('[set-var]')[0]) {
        setVar(self);
        closeFlyout();
      }
    });
    jquery('body').on('click', '[toggle]', function (e) {
      var self = e.currentTarget;
      var selector = self.getAttribute('toggle');
      var target = selector ? selectClosestRelative(selector, self) : jquery(self).closest('[is-flyout]')[0];
      e.stopPropagation();
      if (target && (!self.attributes['toggle-if'] || evalAttr(self, 'toggle-if'))) {
        toggleFlyout(target, self);
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
    if (hasAttr(template_root, 'loading-scope')) {
      setVar(template_root, 'loading', 'initial');
    }
  });
}));
;// CONCATENATED MODULE: ./src/extension/i18n.js



function toDictionary(languages) {
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
function getBrowserLanguages() {
  return navigator.languages || [navigator.language || ''];
}
function _detectLanguage(languages) {
  return single(toDictionary(getBrowserLanguages()), function (v, i) {
    return languages[i];
  });
}
/* harmony default export */ var i18n = (addExtension('i18n', function (app, options) {
  var languages = toDictionary(options.languages);
  var routeParam = app.route && options.routeParam;
  var cookie = options.cookie && common_cookie(options.cookie, options.cookieOptions || 86400000);
  var getCanonicalValue = function getCanonicalValue(v) {
    return v && languages[v.toLowerCase()];
  };
  var language = getCanonicalValue(routeParam && app.route[routeParam]) || getCanonicalValue(cookie && cookie.get()) || options.detectLanguage !== false && _detectLanguage(languages) || getCanonicalValue(options.defaultLanguage) || single(languages, pipe) || '';
  var beforepageload = [];
  function commitLanguage(newLangauge) {
    if (cookie) {
      cookie.set(newLangauge);
    }
    if (language !== newLangauge) {
      language = newLangauge;
      app.language = language;
      if (options.reloadOnChange) {
        location.reload();
      }
    }
  }
  function _setLanguage(newLangauge, replace) {
    newLangauge = getCanonicalValue(newLangauge) || language;
    if (routeParam && appReady) {
      return new Promise(function (resolve) {
        always(app.route[replace ? 'replace' : 'set'](routeParam, newLangauge.toLowerCase(), true), resolve);
        beforepageload.push(resolve);
      });
    } else {
      commitLanguage(newLangauge);
      return util_resolve(true);
    }
  }
  defineObservableProperty(app, 'language', language, function (newLangauge) {
    if (newLangauge !== language) {
      _setLanguage(newLangauge);
    }
    return language;
  });
  app.define({
    setLanguage: function setLanguage(newLangauge) {
      return _setLanguage(newLangauge).then(function (resolved) {
        return resolved && language === getCanonicalValue(newLangauge);
      });
    },
    detectLanguage: function detectLanguage(languages, defaultLanguage) {
      return languages ? _detectLanguage(toDictionary(languages)) || defaultLanguage || languages[0] || '' : getBrowserLanguages()[0];
    }
  });
  if (routeParam) {
    app.route.watch(routeParam, function (newLangauge) {
      _setLanguage(newLangauge, true);
    });
    app.on('ready', function () {
      _setLanguage(language, true);
    });
    app.on('beforepageload', function (e) {
      commitLanguage(getCanonicalValue(e.route[routeParam]) || language);
      combineFn(beforepageload.splice(0))(true);
    });
  }
}));
;// CONCATENATED MODULE: ./src/extension/login.js




/* harmony default export */ var login = (addExtension('login', function (app, options) {
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
        return util_resolve();
      }
      callback = isFunction(callback || nextPath);
      nextPath = typeof nextPath === 'string' && nextPath;
      return cancelLock(app.element).then(function () {
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
;// CONCATENATED MODULE: ./src/extension/preloadImage.js





var preloadImage_IMAGE_STYLE_PROPS = 'background-image'.split(' ');
/* harmony default export */ var preloadImage = (addExtension(true, 'preloadImage', ['?htmlRouter'], function (app) {
  app.beforeUpdate(function (domUpdates) {
    var urls = {};
    each(domUpdates, function (element, props) {
      if ((props.src || props.style) && isElementActive(element)) {
        if (props.src) {
          urls[toAbsoluteUrl(props.src)] = true;
        }
        if (props.style) {
          each(preloadImage_IMAGE_STYLE_PROPS, function (i, v) {
            var imageUrl = isCssUrlValue(props.style[v]);
            if (imageUrl) {
              urls[toAbsoluteUrl(imageUrl)] = true;
            }
          });
        }
      }
    });
    return preloadImages(util_keys(urls), 200);
  });
  if (app.beforePageEnter) {
    app.beforePageEnter(function (element) {
      return preloadImages(element, 1000);
    });
  }
}));
// EXTERNAL MODULE: external "jq-scrollable"
var external_jq_scrollable_ = __webpack_require__(649);
;// CONCATENATED MODULE: ./src/extension/scrollable.js









var SELECTOR_SCROLLABLE = '[scrollable]';
var SELECTOR_TARGET = '[scrollable-target]';
var DATA_KEY = 'brew.scrollable';
/* harmony default export */ var scrollable = (addExtension('scrollable', function (app, defaultOptions) {
  defaultOptions = extend({
    content: '[scrollable-target]:not(.disabled)',
    bounce: false
  }, defaultOptions);
  var DOMMatrix = window.DOMMatrix || window.WebKitCSSMatrix || window.MSCSSMatrix;
  var pendingRestore = new Set();
  var currentTrack;
  var lastEventSource;
  function getOptions(context) {
    return {
      handle: matchWord(context.dir, 'auto scrollbar content') || 'auto',
      hScroll: !matchWord(context.dir, 'y-only'),
      vScroll: !matchWord(context.dir, 'x-only'),
      pageItem: context.selector,
      snapToPage: context.paged === 'always' || context.paged === app.orientation
    };
  }
  function initScrollable(container, context) {
    var scrollable = jquery.scrollable(container, extend({}, defaultOptions, getOptions(context)));
    var cleanup = [];
    var persistKey;
    cleanup.push(zeta_dom_dom.on(container, {
      drag: function drag() {
        currentTrack = beginDrag();
      },
      getContentRect: function getContentRect(e) {
        if (e.target === container || containsOrEquals(container, jquery(e.target).closest(SELECTOR_TARGET)[0])) {
          var padding = scrollable.scrollPadding(e.target);
          return getRect(container).expand(padding, -1);
        }
      },
      scrollBy: function scrollBy(e) {
        var result = scrollable.scrollBy(e.x, e.y, e.behavior === 'instant' ? 0 : 200);
        return {
          x: result.deltaX,
          y: result.deltaY
        };
      }
    }));
    function initPageIndex(enabled) {
      if (!enabled || initPageIndex.d++) {
        return;
      }
      var scrolling = false;
      var needRefresh = false;
      var isControlledScroll;
      var currentIndex = 0;
      var timeout;
      function getItem(index) {
        return context.selector && jquery(context.selector, container).get()[index];
      }
      function setState(index) {
        var oldIndex = currentIndex;
        currentIndex = index;
        if (context.varname && app.setVar) {
          app.setVar(container, context.varname, index);
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
        var isPaged = context.paged === 'always' || context.paged === app.orientation;
        if (isPaged && isVisible(container)) {
          if (scrolling) {
            needRefresh = true;
          } else {
            needRefresh = false;
            scrollTo(currentIndex);
          }
        }
      }
      cleanup.push(app.on('orientationchange', function () {
        scrollable.setOptions({
          snapToPage: context.paged === 'always' || context.paged === app.orientation
        });
      }), app.on(container, {
        statechange: function statechange(e) {
          if (context.selector && !scrolling) {
            var newIndex = e.data[context.varname];
            if ((getRect(getItem(newIndex)).width | 0) > (getRect().width | 0)) {
              scrollTo(newIndex, 'left center');
            } else {
              scrollTo(newIndex);
            }
          }
        },
        scrollMove: function scrollMove(e) {
          scrolling = true;
          if (context.selector && !isControlledScroll) {
            setState(e.pageIndex);
          }
        },
        scrollStop: function scrollStop(e) {
          scrolling = false;
          if (context.selector) {
            setState(e.pageIndex);
            if (needRefresh) {
              refresh();
            }
          }
        }
      }, true), bind(window, 'resize', function () {
        if (context.selector) {
          clearTimeout(timeout);
          timeout = setTimeout(refresh, 200);
        }
      }));
    }
    function initPersistScroll(value) {
      persistKey = value === '' ? DATA_KEY : value && DATA_KEY + '.' + value;
      if (!persistKey || !app.navigate || initPersistScroll.d++) {
        return;
      }
      var timeout;
      function getCurrentPosition() {
        return {
          x: scrollable.scrollLeft(),
          y: scrollable.scrollTop()
        };
      }
      function getPersistedPosition() {
        return (app.navigationType === 'reload' ? app.cache : app.historyStorage.current).get(persistKey);
      }
      function restoreScroll(offset) {
        setImmediate(function retry(count) {
          if (count >= 20 || scrollable.scrollMaxX >= offset.x && scrollable.scrollMaxY >= offset.y) {
            scrollable.scrollTo(offset.x, offset.y, 0);
            return;
          }
          timeout = setTimeout(retry.bind(0, (count || 0) + 1), 100);
        });
      }
      cleanup.push(app.on(container, 'scrollStart', function (e) {
        if (persistKey && e.source !== 'script') {
          app.historyStorage.current.delete(persistKey);
        }
      }, true), app.on('beforepageload popstate pushstate', function (e) {
        var previous = persistKey && e.oldStateId && app.historyStorage.for(e.oldStateId);
        if (previous) {
          previous.set(persistKey, getCurrentPosition());
        }
      }), app.on('pageload popstate', function () {
        var offset = persistKey && getPersistedPosition();
        if (offset) {
          restoreScroll(offset);
        }
        pendingRestore[offset ? 'add' : 'delete'](container);
        clearInterval(timeout);
      }), app.on('unload', function () {
        if (persistKey) {
          var offset = getCurrentPosition();
          app.historyStorage.current.set(persistKey, offset);
          app.cache.set(persistKey, offset);
        }
      }), pendingRestore.delete.bind(pendingRestore, container));
      var initialOffset = persistKey && getPersistedPosition();
      if (initialOffset) {
        restoreScroll(initialOffset);
      }
    }
    initPageIndex.d = 0;
    initPersistScroll.d = 0;
    context.watch(function () {
      scrollable.setOptions(getOptions(context));
    });
    context.watch('selector', initPageIndex, true);
    context.watch('persistScroll', initPersistScroll, true);
    context.on('destroy', function () {
      combineFn(cleanup)();
      scrollable.destroy();
    });
    scrollable[focusable(container) ? 'enable' : 'disable']();
    return scrollable;
  }
  registerDirective('scrollable', SELECTOR_SCROLLABLE, {
    component: initScrollable,
    directives: {
      dir: {
        attribute: 'scrollable'
      },
      paged: {
        attribute: 'scroller-snap-page'
      },
      varname: {
        attribute: 'scroller-state'
      },
      selector: {
        attribute: 'scroller-page'
      },
      persistScroll: {
        attribute: 'persist-scroll'
      }
    }
  });
  function emitScrollableEvent(element, event, eventName) {
    app.emit(eventName || event.type, element, event, {
      bubbles: true,
      source: lastEventSource
    });
  }
  jquery.scrollable.hook({
    scrollStart: function scrollStart(e) {
      if (currentTrack && e.trigger === 'gesture') {
        currentTrack.preventScroll();
      }
      lastEventSource = new EventSource();
      emitScrollableEvent(this, e);
    },
    scrollMove: function scrollMove(e) {
      emitScrollableEvent(this, e);
    },
    scrollEnd: function scrollEnd(e) {
      emitScrollableEvent(this, e, 'scrollStop');
      lastEventSource = null;
    },
    scrollProgressChange: function scrollProgressChange(e) {
      emitScrollableEvent(this, e);
    }
  });

  // update scroller on events other than window resize
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
    $scrollables.each(function (i, v) {
      getDirectiveComponent(v).scrollable.refresh();
    });
    $scrollables.filter(':not([keep-scroll-offset])').not(makeArray(pendingRestore)).scrollable('scrollTo', 0, 0);
  });

  // scroll-into-view animation trigger
  function updateScrollIntoView() {
    jquery('[animate-on~="scroll-into-view"]').filter(':visible').each(function (i, v) {
      var m = new DOMMatrix(getComputedStyle(v).transform);
      var rootRect = getRect(zeta_dom_dom.root);
      var thisRect = getRect(v);
      var isInView = rectIntersects(rootRect, thisRect.translate(-m.e || 0, 0)) || rectIntersects(rootRect, thisRect.translate(0, -m.f || 0));
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
;// CONCATENATED MODULE: ./src/extension/viewport.js





/* harmony default export */ var viewport = (addExtension(true, 'viewport', function (app) {
  var setOrientation = defineObservableProperty(app, 'orientation', '', true);
  var visualViewport = window.visualViewport;
  var aspectRatio, viewportWidth, viewportHeight;
  function checkViewportSize(triggerEvent) {
    var previousAspectRatio = aspectRatio;
    var rect = getRect();
    viewportWidth = rect.width;
    viewportHeight = rect.height;
    aspectRatio = viewportWidth / viewportHeight;
    setOrientation(aspectRatio >= 1 ? 'landscape' : 'portrait');
    if (triggerEvent !== false) {
      var data = {
        aspectRatio: aspectRatio,
        orientation: app.orientation,
        viewportWidth: viewportWidth,
        viewportHeight: viewportHeight
      };
      app.emit('resize', data);
      if (either(aspectRatio >= 1, previousAspectRatio >= 1)) {
        app.emit('orientationchange', data);
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
    bind(window, 'resize', function () {
      setTimeoutOnce(checkViewportSize);
    });
    app.beforeInit(function () {
      return zeta_dom_dom.ready.then(function () {
        checkViewportSize(false);
      });
    });
  }
}));
;// CONCATENATED MODULE: ./src/extension/router.js
function router_typeof(o) { "@babel/helpers - typeof"; return router_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, router_typeof(o); }










var router_ = createPrivateStore();
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
function initStorage(path) {
  storage = createObjectStorage(sessionStorage, 'brew.router.' + path);
  storage.registerType('HistoryStorage', HistoryStorage, function (target, data) {
    each(data, target.set.bind(target));
  });
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
    return mapProto.set.call(this, stringOrSymbol(k), v);
  },
  delete: function _delete(k) {
    return mapProto.delete.call(this, stringOrSymbol(k));
  },
  toJSON: function toJSON() {
    return mapObject(this, pipe);
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
    var minLength, hasParams;
    path.replace(/\/(\*|[^{][^\/]*|\{([a.-z_$][a-z0-9_$]*)(\?)?(?::(?![*+?])((?:(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])([*+?]|\{\d+(?:,\d+)\})?)+))?\})(?=\/|$)/gi, function (v, a, b, c, d) {
      if (c && !minLength) {
        minLength = tokens.length;
      }
      if (b) {
        var re = d ? new RegExp('^' + d + '$', 'i') : /./;
        params[b] = tokens.length;
        hasParams = true;
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
      hasParams: !!hasParams,
      exact: !(tokens[tokens.length - 1] === '*' && tokens.splice(-1)),
      minLength: minLength || tokens.length
    });
    parsedRoutes[path] = deepFreeze(tokens);
  }
  return parsedRoutes[path];
}
function createRouteState(state, route, segments, params, remainingSegments) {
  segments = segments.map(encodeURIComponent);
  remainingSegments = remainingSegments || '/' + segments.slice(route.length).join('/');
  return updateRouteState({
    route: route,
    params: extend({}, state.params, params),
    minPath: '/' + segments.slice(0, route.minLength).join('/'),
    maxPath: '/' + segments.slice(0, route.length).join('/')
  }, remainingSegments);
}
function updateRouteState(matched, remainingSegments) {
  remainingSegments = matched.route.exact !== false ? '/' : normalizePath(remainingSegments);
  matched.params.remainingSegments = remainingSegments;
  matched.path = fromRoutePath(combinePath(matched.maxPath, remainingSegments));
  return matched;
}
function matchRouteByParams(state, params, partial) {
  var matched = single(state.routes, function (tokens) {
    var valid = !tokens.hasParams || single(tokens.params, function (v, i) {
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
    return createRouteState(state, tokens, segments, pick(params, util_keys(tokens.params)), params.remainingSegments);
  });
  return matched || !partial && matchRouteByParams(state, params, true);
}
function matchRouteByPath(state, path) {
  var segments = toSegments(toRoutePath(removeQueryAndHash(path)));
  var matched = any(state.routes, function (tokens) {
    return matchRoute(tokens, segments, true);
  }) || [];
  return createRouteState(state, matched, segments, mapObject(matched.params, function (v) {
    return segments[v] || null;
  }));
}
function Route(app, routes, initialPath) {
  var self = this;
  var params = {};
  var state = router_(self, {
    handleChanges: watch(self, true),
    routes: routes.map(parseRoute),
    params: params,
    app: app
  });
  each(state.routes, function (i, v) {
    each(v.params, function (i) {
      params[i] = null;
    });
  });
  var initial = matchRouteByPath(state, initialPath);
  state.current = initial;
  each(initial.params, function (i, v) {
    defineObservableProperty(self, i, v, function (v) {
      return isUndefinedOrNull(v) || v === '' ? null : String(v);
    });
  });
  watch(self, function () {
    if (!equal(state.current.params, self.toJSON())) {
      routeCommitParams(self, state);
    }
  });
  Object.preventExtensions(self);
}
function routeCommitParams(self, state, matched, params, replace, keepQuery, force) {
  if (!matched) {
    params = extend({}, self, params);
    matched = matchRouteByParams(state, params) || updateRouteState(state.current, params.remainingSegments);
  }
  var result = matched.path !== removeQueryAndHash(state.app.path);
  state.current = matched;
  state.handleChanges(function () {
    extend(self, matched.params);
    if (result || force) {
      result = state.app.navigate(matched.path + (result && !keepQuery ? '' : getQueryAndHash(state.app.path)), replace);
    }
  });
  return result;
}
definePrototype(Route, {
  parse: function parse(path) {
    return extend({}, matchRouteByPath(router_(this), path).params);
  },
  set: function set(key, value, keepQuery, replace) {
    var self = this;
    var state = router_(self);
    if (typeof key === 'string' && arguments.length === 1) {
      if (key !== self.toString()) {
        routeCommitParams(self, state, matchRouteByPath(state, key));
      }
      return;
    }
    return routeCommitParams(self, state, null, isPlainObject(key) || kv(key, value), replace, (keepQuery || value) === true, true);
  },
  replace: function replace(key, value, keepQuery) {
    return this.set(key, value, keepQuery, true);
  },
  getPath: function getPath(params) {
    var matched = matchRouteByParams(router_(this), params);
    return matched ? matched.path : fromRoutePath('/');
  },
  toJSON: function toJSON() {
    return extend({}, this);
  },
  toString: function toString() {
    return router_(this).current.path;
  }
});
watchable(Route.prototype);
function PageInfo(page, path, params) {
  var self = this;
  defineOwnProperty(self, 'pageId', page.id, true);
  defineOwnProperty(self, 'path', path, true);
  defineOwnProperty(self, 'params', params, true);
  router_(self, page);
}
definePrototype(PageInfo, {
  get data() {
    return router_(this).data;
  },
  getSavedStates: function getSavedStates() {
    return router_(this).last.storage.toJSON();
  },
  clearNavigateData: function clearNavigateData() {
    router_(this).data = null;
  },
  clearHistoryStorage: function clearHistoryStorage() {
    each(router_(this).states, function (i, v) {
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
  var redirectCount = 0;
  var currentIndex = 0;
  var indexOffset = 0;
  var pendingState;
  var lastState = {};
  function getPersistedStorage(key, ctor) {
    return storage.revive(key, ctor) || mapGet(storage, key, ctor);
  }
  function commitPath(newPath) {
    currentPath = newPath;
    app.path = newPath;
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
    if (previous && previous.sessionId !== sessionId) {
      previous = null;
    }
    if (data === undefined) {
      data = null;
    }
    if (storageMap) {
      storage.set(id, storageMap);
    }
    var resolvePromise = noop;
    var rejectPromise = noop;
    var pathNoQuery = removeQueryAndHash(path);
    var page = previous && snapshot ? previous.page : {
      id: id,
      data: data,
      states: {}
    };
    var resolved, promise;
    var savedState = [id, path, index, snapshot, data, sessionId];
    var state = {
      id: id,
      path: path,
      index: index,
      pathname: pathNoQuery,
      type: 'navigate',
      previous: previous && (keepPreviousPath || snapshot ? previous.previous : previous),
      page: page,
      sessionId: sessionId,
      resumedId: previous ? previous.resumedId : sessionId,
      deleted: false,
      get done() {
        return resolved;
      },
      get promise() {
        return promise || (promise = new Promise(function (resolve_, reject_) {
          resolvePromise = resolve_;
          rejectPromise = reject_;
        }));
      },
      get pageInfo() {
        return page.info || (page.info = new PageInfo(page, pathNoQuery, freeze(route.parse(pathNoQuery))));
      },
      get storage() {
        return storageMap || (storageMap = state.deleted ? new HistoryStorage() : getPersistedStorage(id, HistoryStorage));
      },
      commit: function commit(flag) {
        pendingState = state;
        page.last = state;
        commitPath(state.path);
        route.set(pathNoQuery);
        return flag !== false && emitNavigationEvent('beforepageload', state, lastState, {
          deferrable: true
        });
      },
      reset: function reset() {
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
        var previousState = lastState;
        resolved = result || createNavigateResult(id, state.path);
        promise = util_resolve(resolved);
        resolvePromise(resolved);
        if (states[currentIndex] === state) {
          var eventName = resolved.navigated ? 'pageload' : state.type === 'back_forward' ? 'popstate' : 'pushstate';
          redirectCount = 0;
          lastState = state;
          page.last = state;
          commitPath(state.path);
          emitNavigationEvent(eventName, state, previousState, {
            handleable: false
          });
        }
      },
      reject: function reject(error) {
        catchAsync(promise);
        promise = null;
        rejectPromise(error || errorWithCode(navigationCancelled));
      },
      toJSON: function toJSON() {
        savedState[1] = state.path;
        savedState[4] = page.data;
        return savedState;
      }
    };
    page.states[id] = state;
    return state;
  }
  function updateQueryAndHash(state, newPath, oldPath) {
    state.path = newPath;
    history.replaceState(state.id, '', toPathname(newPath));
    if (state.done) {
      var oldHash = parsePath(oldPath).hash;
      var newHash = parsePath(newPath).hash;
      commitPath(newPath);
      if (oldHash !== newHash) {
        app.emit('hashchange', {
          oldHash: oldHash,
          newHash: newHash
        }, {
          handleable: false
        });
      }
      return {
        promise: util_resolve(createNavigateResult(state.page.id, newPath, null, false))
      };
    }
    return state;
  }
  function applyState(state, replace, snapshot, previous, callback) {
    var currentState = states[currentIndex];
    if (currentState && currentState !== state && !currentState.done) {
      redirectCount++;
      if (replace) {
        currentState.forward(state);
      } else {
        currentState.reject();
      }
    }
    if (appReady && !snapshot && locked(router_root)) {
      cancelLock(router_root, new NavigationCancellationRequest(state.path)).then(function () {
        if (states[currentIndex] === currentState && callback() !== false) {
          setImmediateOnce(handlePathChange);
        }
      }, function () {
        if (states[currentIndex] === currentState) {
          route.set(previous.pathname);
        }
        state.reject(errorWithCode(navigationRejected));
        console.warn('Navigation cancelled');
      });
    } else if (callback() !== false) {
      if (snapshot && previous.done) {
        state.resolve(createNavigateResult(state.page.id, state.path, null, false));
        updateQueryAndHash(state, state.path, currentState.path);
      } else {
        setImmediateOnce(handlePathChange);
      }
    }
  }
  function pushState(path, replace, snapshot, data, storageMap) {
    path = resolvePath(path);
    if (redirectCount > 30 || !isSubPathOf(path, basePath)) {
      return {
        promise: reject(errorWithCode(navigationRejected))
      };
    }
    var currentState = states[currentIndex];
    var previous = currentState;
    if (currentState) {
      if (snapshot) {
        storageMap = new HistoryStorage(previous.storage.toJSON());
      } else if (isUndefinedOrNull(data)) {
        var pathNoQuery = removeQueryAndHash(path);
        if (pathNoQuery === currentState.pathname) {
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
    }
    var id = randomId();
    var replaceHistory = replace || currentState && !currentState.done;
    var index = Math.max(0, currentIndex + !replaceHistory);
    var state = createState(id, path, indexOffset + index, snapshot, snapshot ? previous.page.data : data, sessionId, previous, replaceHistory, storageMap);
    applyState(state, replace, snapshot, previous, function () {
      currentIndex = index;
      if (!replace) {
        each(states.splice(currentIndex), function (i, v) {
          v.deleted = true;
          storage.delete(v.id);
          if (v.resumedId !== resumedId) {
            storage.delete(v.resumedId);
          }
        });
      }
      states[currentIndex] = state;
      history[replaceHistory ? 'replaceState' : 'pushState'](id, '', toPathname(path));
    });
    return state;
  }
  function popState(index, isNative) {
    var state = states[index].reset();
    var step = state.index - states[currentIndex].index;
    var snapshot = state.page === states[currentIndex].page;
    var isLocked = !snapshot && locked(router_root);
    if (isLocked && isNative) {
      history.go(-step);
    }
    applyState(state, false, snapshot, states[currentIndex], function () {
      state.type = 'back_forward';
      currentIndex = index;
      if (isLocked && isNative && history.state === state.id) {
        // lock is cancelled before popstate event take place
        // history.go has no effect until then
        bindOnce(window, 'popstate', function () {
          history.go(step);
        });
        return false;
      }
      if (!isNative || isLocked) {
        history.go(step);
      }
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
    path = path || '/';
    currentPath = currentPath || app.path;
    if (path[0] === '#' || path[0] === '?') {
      var a = parsePath(currentPath);
      var b = parsePath(path);
      return a.pathname + (path[0] === '#' ? a.search : b.search) + b.hash;
    }
    if (path[0] === '~' || path.indexOf('{') >= 0) {
      var fullPath = (isRoutePath ? fromRoutePath : pipe)(currentPath);
      parsedState = fullPath === route.toString() ? router_(route).current : matchRouteByPath(router_(route), fullPath);
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
  function emitNavigationEvent(eventName, state, lastState, options) {
    var data = {
      navigationType: state.type,
      pathname: state.path,
      oldPathname: lastState.path,
      oldStateId: lastState.id,
      newStateId: state.id,
      route: state.pageInfo.params,
      data: state.page.data
    };
    return app.emit(eventName, data, options);
  }
  function processPageChange(state) {
    var deferred = state.commit();
    notifyAsync(router_root, deferred);
    always(deferred, function () {
      if (states[currentIndex] === state) {
        pendingState = null;
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
    if (lastState === state) {
      state.resolve(createNavigateResult(lastState.page.id, newPath, null, false));
      return;
    }
    console.log('Nagivate', newPath);
    var promise = util_resolve(emitNavigationEvent('navigate', state, lastState));
    notifyAsync(router_root, promise);
    always(promise, function () {
      if (states[currentIndex] === state) {
        processPageChange(state);
      }
    });
  }
  router_baseUrl = normalizePath(options.baseUrl);
  if (options.urlMode === 'none') {
    router_baseUrl = '/';
    isAppPath = constant(false);
    fromPathname = function fromPathname(path) {
      var parts = parsePath(currentPath || '/' + getCurrentQuery());
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
      var query = setQueryParam(options.queryParam, function (oldValue) {
        path = normalizePath(oldValue || '');
      }, parts.search);
      return path + query + parts.hash;
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
  var initialPathHint = fromPathname(getCurrentPathAndQuery());
  var initialPath = options.initialPath || options.queryParam && getQueryParam(options.queryParam) || initialPathHint;
  var includeQuery = initialPath === initialPathHint || removeQueryAndHash(initialPath) === removeQueryAndHash(initialPathHint);
  if (!isSubPathOf(initialPath, basePath)) {
    initialPath = basePath;
  } else if (includeQuery && removeQueryAndHash(initialPath) === initialPath) {
    initialPath = initialPathHint;
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
  initStorage(typeof options.resume === 'string' ? options.resume : parsePath(toPathname(basePath)).pathname);
  app.define({
    get canNavigateBack() {
      return (states[currentIndex - 1] || '').sessionId === sessionId;
    },
    get canNavigateForward() {
      return (states[currentIndex + 1] || '').sessionId === sessionId;
    },
    get previousPath() {
      return (states[currentIndex].previous || '').path || null;
    },
    get navigationType() {
      return (pendingState || lastState).type;
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
      if (this.canNavigateBack) {
        return popState(currentIndex - 1).promise;
      } else {
        return !!defaultPath && pushState(defaultPath).promise;
      }
    },
    backToPreviousPath: function backToPreviousPath() {
      var previous = states[currentIndex].previous;
      return !!previous && popState(getHistoryIndex(previous.id)).promise;
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
  defineObservableProperty(app, 'path', initialPath, function (newValue) {
    newValue = resolvePath(newValue);
    if (newValue !== currentPath) {
      pushState(newValue);
    }
    return currentPath;
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
  states[currentIndex].commit(false);
  app.on('ready', function () {
    if (initialState && states[currentIndex] === initialState && includeQuery) {
      pushState(fromPathname(getCurrentPathAndQuery()), true);
    }
    handlePathChange();
  });
  app.on('unload', function () {
    storage.set('c', states[currentIndex].id);
    storage.set('s', states);
    storage.persistAll();
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
/* harmony default export */ var router = (addExtension('router', configureRouter));
;// CONCATENATED MODULE: ./src/extension/htmlRouter.js














var htmlRouter_root = zeta_dom_dom.root;
var matchByPathElements = new Map();
var preloadHandlers = [];

/** @type {Element[]} */
var activeElements = [htmlRouter_root];
var pageTitleElement;

/**
 * @param {Element} v
 * @param {Element[]=} arr
 */
function htmlRouter_isElementActive(v, arr) {
  var parent = jquery(v).closest('[match-path]')[0];
  return !parent || (arr || activeElements).indexOf(parent) >= 0;
}
function registerMatchPathElements(addedNodes) {
  jquery(addedNodes).each(function (i, v) {
    if (!matchByPathElements.has(v)) {
      var placeholder = document.createElement('div');
      placeholder.setAttribute('style', 'display: none !important');
      placeholder.setAttribute('match-path', v.getAttribute('match-path') || '');
      if (v.attributes.default) {
        placeholder.setAttribute('default', '');
      }
      jquery(v).before(placeholder);
      jquery(v).detach();
      setClass(v, 'hidden', true);
      matchByPathElements.set(placeholder, v);
      matchByPathElements.set(v, v);
    }
  });
}

/**
 * @param {Brew.AppInstance<Brew.WithRouter>} app
 * @param {Brew.RouterOptions} options
 */
function initHtmlRouter(app, options) {
  var newActiveElements;
  var ensureMatchPathElements;
  app.on('beforepageload', function (e) {
    // find active elements i.e. with match-path that is equal to or is parent of the new path
    /** @type {HTMLElement[]} */
    newActiveElements = [htmlRouter_root];
    ensureMatchPathElements();
    batch(true, function () {
      var newRoutePath = toRoutePath(removeQueryAndHash(e.pathname));
      var switchElements = jquery('[switch=""]').get();
      var current;
      while (current = switchElements.shift()) {
        if (htmlRouter_isElementActive(current, newActiveElements)) {
          var children = jquery(current).children('[match-path]').get().map(function (v) {
            var element = mapGet(matchByPathElements, v) || v;
            var children = jquery('[switch=""]', element).get();
            var path = app.resolvePath(element.getAttribute('match-path'), newRoutePath, true);
            return {
              element: element,
              path: path.replace(/\/\*$/, ''),
              exact: !children[0] && path.slice(-2) !== '/*',
              placeholder: v !== element && v,
              children: children
            };
          });
          children.sort(function (a, b) {
            return b.path.localeCompare(a.path);
          });
          var matchedPath = single(children, function (v) {
            return (v.exact ? newRoutePath === v.path : isSubPathOf(newRoutePath, v.path)) && v.path;
          });
          each(children, function (i, v) {
            if (v.path === matchedPath) {
              var element = v.element;
              newActiveElements.unshift(element);
              if (v.placeholder) {
                jquery(v.placeholder).replaceWith(element);
                mountElement(element);
                switchElements.push.apply(switchElements, v.children);
              }
            }
          });
        }
      }
    });
    // redirect to the default view if there is no match because every switch must have a match
    var bailOut = any(selectIncludeSelf('[switch=""]'), function (v) {
      if (htmlRouter_isElementActive(v, newActiveElements)) {
        var $children = jquery(v).children('[match-path]');
        var currentMatched = $children.filter(function (i, v) {
          return newActiveElements.indexOf(v) >= 0;
        })[0];
        if (!currentMatched) {
          return app.navigate(fromRoutePath(($children.filter('[default]')[0] || $children[0]).getAttribute('match-path')), true);
        }
      }
    });
    if (bailOut) {
      return;
    }
    var previousActiveElements = activeElements.slice(0);
    var oldPath = app.previousPath;
    var path = e.pathname;
    var eventSource = zeta_dom_dom.eventSource;
    activeElements = newActiveElements;
    pageTitleElement = jquery(newActiveElements).filter('[page-title]')[0];

    // assign document title from matched active elements and
    document.title = pageTitleElement ? evalAttr(pageTitleElement, 'page-title', true) : document.title;
    batch(true, function () {
      var preload = new Map();
      groupLog(eventSource, ['pageenter', path], function () {
        matchByPathElements.forEach(function (element, placeholder) {
          var matched = activeElements.indexOf(element) >= 0;
          if (element !== placeholder && matched === previousActiveElements.indexOf(element) < 0) {
            if (matched) {
              resetVar(element, false);
              setVar(element);
              markUpdated(element);
              // animation and pageenter event of inner scope
              // must be after those of parent scope
              var dependencies = preload.get(jquery(element).parents('[match-path]')[0]);
              var segments = toSegments(element.getAttribute('match-path'));
              var promises = preloadHandlers.map(function (v) {
                if (matchRoute(v.route, segments)) {
                  return v.callback(element, path);
                }
              });
              promises.push(dependencies);
              preload.set(element, resolveAll(promises, function () {
                if (activeElements.indexOf(element) >= 0) {
                  setClass(element, 'hidden', false);
                  animateIn(element, 'show', '[match-path]', true);
                  app.emit('pageenter', element, {
                    pathname: path
                  }, true);
                }
              }));
            } else {
              app.emit('pageleave', element, {
                pathname: oldPath
              }, true);
              animateOut(element, 'show', '[match-path]').then(function () {
                if (activeElements.indexOf(element) < 0) {
                  groupLog(eventSource, ['pageleave', oldPath], function () {
                    setClass(element, 'hidden', true);
                    resetVar(element, true);
                  });
                }
              });
            }
          }
        });
      });
      each(preload, function (element, promise) {
        notifyAsync(element, promise);
        e.waitFor(promise);
      });
    });
  });
  app.on('pageenter', function (e) {
    jquery(selectIncludeSelf('[x-autoplay]', e.target)).each(function (i, v) {
      if (htmlRouter_isElementActive(v)) {
        if (v.readyState !== 0) {
          v.currentTime = 0;
        }
        v.play();
      }
    });
  });
  app.on('pageleave', function (e) {
    jquery(selectIncludeSelf('form', e.target)).each(function (i, v) {
      if (!app.emit('reset', v, null, false)) {
        v.reset();
      }
    });
    jquery(selectIncludeSelf('[x-autoplay]', e.target)).each(function (i, v) {
      v.pause();
    });
  });
  app.on('statechange', function (e) {
    if (containsOrEquals(e.target, pageTitleElement)) {
      document.title = evalAttr(pageTitleElement, 'page-title', true);
    }
  });
  app.on('mounted', function (e) {
    var element = e.target;
    jquery(selectIncludeSelf('img[src^="/"], video[src^="/"]', element)).each(function (i, v) {
      v.src = withBaseUrl(v.getAttribute('src'));
    });
    if (!options.explicitBaseUrl) {
      jquery(selectIncludeSelf('a[href^="/"]', element)).each(function (i, v) {
        var href = v.getAttribute('href');
        v.dataset.href = href;
        v.href = withBaseUrl(href);
      });
    }
  });
  zeta_dom_dom.ready.then(function () {
    // replace inline background-image to prevent browser to load unneccessary images
    jquery('[style]').each(function (i, v) {
      var backgroundImage = isCssUrlValue(v.style.backgroundImage);
      if (backgroundImage) {
        v.setAttribute('data-bg-src', decodeURIComponent(withBaseUrl(toRelativeUrl(backgroundImage))));
        v.style.backgroundImage = 'none';
      }
    });
    ensureMatchPathElements = watchElements(htmlRouter_root, '[match-path]', registerMatchPathElements, true);
  });
  watchElements(htmlRouter_root, 'video[autoplay], audio[autoplay]', function (addedNodes) {
    jquery(addedNodes).attr('x-autoplay', '').removeAttr('autoplay');
  }, true);
  util_define(app, {
    isElementActive: htmlRouter_isElementActive,
    beforePageEnter: function beforePageEnter(path, callback) {
      if (isFunction(path)) {
        callback = path;
        path = '/*';
      }
      preloadHandlers.push({
        route: app.parseRoute(path),
        callback: throwNotFunction(callback)
      });
    },
    matchPath: function matchPath(path, selector, handler) {
      if (isFunction(selector)) {
        handler = selector;
        selector = null;
      }
      this.on('mounted', function (e) {
        var matchPath = e.target.getAttribute('match-path');
        if (matchPath && matchRoute(path, matchPath) && (!selector || jquery(e.target).is(selector))) {
          handler.call(e.target, e.target);
        }
      });
    }
  });
}
/* harmony default export */ var htmlRouter = (addExtension('htmlRouter', function (app, options) {
  router();
  app.useRouter(options);
  initHtmlRouter(app, options);
}));
;// CONCATENATED MODULE: ./src/extension/idleTimeout.js



/* harmony default export */ var idleTimeout = (addExtension('idleTimeout', function (app, options) {
  var key = options.key || 'app.lastInteract';
  var timestamp = Date.now();
  function setTimestamp(value) {
    timestamp = value || undefined;
    if (options.crossFrame) {
      localStorage[key] = value;
    }
  }
  bind(window, 'keydown mousedown touchstart wheel', function () {
    setTimestamp(Date.now());
  });
  setIntervalSafe(function () {
    if (options.crossFrame) {
      timestamp = +localStorage[key] || timestamp;
    }
    if (Date.now() - timestamp > options.timeout) {
      setTimestamp('');
      return app.emit('idle');
    }
  }, 10000);
}));
;// CONCATENATED MODULE: ./src/entry.js











function exportAppToGlobal(app) {
  window.app = app;
}
/* harmony default export */ var entry = (core.with(exportAppToGlobal, config, template, i18n, login, preloadImage, scrollable, viewport, router, htmlRouter, idleTimeout));
}();
__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=brew.js.map