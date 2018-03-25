(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("dyna-compress-text", [], factory);
	else if(typeof exports === 'object')
		exports["dyna-compress-text"] = factory();
	else
		root["dyna-compress-text"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DynaTextCompress = /** @class */ (function () {
    function DynaTextCompress(commonTexts, forEncode, compressSymbol) {
        if (forEncode === void 0) { forEncode = true; }
        if (compressSymbol === void 0) { compressSymbol = "!"; }
        this.commonTexts = commonTexts;
        this.compressSymbol = compressSymbol;
        this.commonTexts = commonTexts.concat();
        this.commonTexts.unshift(this.compressSymbol);
        if (forEncode)
            this.commonTexts.push(" ");
        this.commonTexts =
            this.commonTexts
                .sort(function (aText, bText) { return aText.length - bText.length; })
                .reverse();
    }
    DynaTextCompress.prototype.compress = function (text) {
        var output = '';
        for (var iChar = 0; iChar < text.length; iChar++) {
            var code = this.getCode(text.substr(iChar));
            if (code) {
                output += code;
                iChar += (this.commonTexts[this.decodeIndex(code)]).length - 1;
            }
            else {
                output += text[iChar];
            }
        }
        return output;
    };
    DynaTextCompress.prototype.decompress = function (compressed) {
        var output = {
            text: '',
            errors: [],
        };
        for (var iChar = 0; iChar < compressed.length; iChar++) {
            if (compressed[iChar] === this.compressSymbol) {
                var compressedSymbol = compressed.substr(iChar, 2);
                var decodedText = this.commonTexts[this.decodeIndex(compressedSymbol)];
                if (decodedText) {
                    output.text += decodedText;
                }
                else {
                    output.errors.push("Symbol [" + compressedSymbol + "] in unknown");
                }
                iChar += 1;
            }
            else {
                output.text += compressed[iChar];
            }
        }
        return output;
    };
    DynaTextCompress.prototype.getCode = function (partialText) {
        var _this = this;
        var output = null;
        this.commonTexts.forEach(function (word, index) {
            if (output)
                return;
            if (partialText.substr(0, word.length) === word) {
                output = _this.encodeIndex(index);
            }
        });
        return output;
    };
    DynaTextCompress.prototype.encodeIndex = function (index) {
        return this.compressSymbol + String.fromCharCode(65 + index);
    };
    DynaTextCompress.prototype.decodeIndex = function (text) {
        return text.charCodeAt(1) - 65;
    };
    return DynaTextCompress;
}());
exports.DynaTextCompress = DynaTextCompress;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DynaTextCompress_1 = __webpack_require__(0);
exports.DynaTextCompress = DynaTextCompress_1.DynaTextCompress;
var DynaObjectCompress_1 = __webpack_require__(2);
exports.DynaObjectCompress = DynaObjectCompress_1.DynaObjectCompress;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DynaTextCompress_1 = __webpack_require__(0);
var DynaObjectCompress = /** @class */ (function () {
    function DynaObjectCompress(objectPattern, commonTexts, forEncode, compressSymbol) {
        if (commonTexts === void 0) { commonTexts = []; }
        if (forEncode === void 0) { forEncode = true; }
        if (compressSymbol === void 0) { compressSymbol = "!"; }
        this.compressSymbol = compressSymbol;
        this.textCompressor = new DynaTextCompress_1.DynaTextCompress(this.getCommonTexts(objectPattern, commonTexts)
            .concat(forEncode ? [
            '",',
            '{',
            '"},',
            '},',
            '}',
            '[',
            '"],',
            '],',
            '}',
        ] : []), forEncode, compressSymbol);
    }
    DynaObjectCompress.prototype.compress = function (obj) {
        return this.textCompressor.compress(JSON.stringify(obj));
    };
    DynaObjectCompress.prototype.decompress = function (compressed) {
        var obj;
        var result = this.textCompressor.decompress(compressed);
        if (result.errors.length === 0) {
            obj = JSON.parse(result.text);
        }
        return {
            obj: obj,
            errors: result.errors,
        };
    };
    DynaObjectCompress.prototype.getCommonTexts = function (obj, userCommonTexts) {
        var commonTexts = [];
        var _getProperties = function (obj) {
            if (obj == null)
                return;
            else if (obj instanceof Date)
                return;
            else if (Array.isArray(obj))
                obj.forEach(_getProperties);
            else if (typeof obj === "object") {
                commonTexts = commonTexts.concat(Object.keys(obj).map(function (key) {
                    if (Array.isArray(obj[key]))
                        return "\"" + key + "\":[";
                    if (typeof obj[key] !== "number")
                        return "\"" + key + "\":\"";
                    return "\"" + key + "\":";
                }));
                Object.keys(obj).forEach(function (key) { return _getProperties(obj[key]); });
            }
        };
        _getProperties(obj);
        return commonTexts
            .concat(userCommonTexts)
            .reduce(function (acc, text) {
            if (acc.indexOf(text) === -1)
                acc.push(text);
            return acc;
        }, [])
            .sort(function (aText, bText) { return aText.length - bText.length; })
            .reverse();
    };
    return DynaObjectCompress;
}());
exports.DynaObjectCompress = DynaObjectCompress;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ })
/******/ ]);
});