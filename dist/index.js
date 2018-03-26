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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DynaTextCompress_1 = __webpack_require__(1);
var DynaObjectCompress = /** @class */ (function () {
    function DynaObjectCompress(objectPattern, commonTexts, forEncode, compressSymbol) {
        if (commonTexts === void 0) { commonTexts = []; }
        if (forEncode === void 0) { forEncode = true; }
        if (compressSymbol === void 0) { compressSymbol = "!"; }
        this.forEncode = forEncode;
        this.compressSymbol = compressSymbol;
        this.textCompressor = new DynaTextCompress_1.DynaTextCompress(this.getCommonTexts(objectPattern, commonTexts)
            .concat("true", "true,", "false", "false,", ':00:00.000Z"', forEncode ? [
            '",',
            '],',
            '"},',
            '"}',
            '"],',
            '"]',
        ] : []), forEncode, compressSymbol);
    }
    DynaObjectCompress.prototype.compress = function (obj) {
        var output = this.textCompressor.compress(JSON.stringify(obj));
        return output;
    };
    DynaObjectCompress.prototype.decompress = function (compressed) {
        var obj;
        var result = this.textCompressor.decompress(compressed);
        if (result.errors.length === 0) {
            try {
                obj = JSON.parse(result.text);
            }
            catch (err) {
                return {
                    obj: undefined,
                    errors: result.errors.concat("Cannot parse to obj"),
                };
            }
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
                    if (obj[key] instanceof Date)
                        return "\"" + key + "\":\"";
                    if (typeof obj[key] === "number")
                        return "\"" + key + "\":";
                    if (typeof obj[key] === "boolean")
                        return "\"" + key + "\":";
                    if (typeof obj[key] === "object")
                        return "\"" + key + "\":{";
                    return "\"" + key + "\":\"";
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DynaTextCompress = /** @class */ (function () {
    function DynaTextCompress(commonTexts, forEncode, compressSymbol) {
        if (forEncode === void 0) { forEncode = true; }
        if (compressSymbol === void 0) { compressSymbol = "!"; }
        this.commonTexts = commonTexts;
        this.forEncode = forEncode;
        this.compressSymbol = compressSymbol;
        this.variableChars = "";
        this.initVariableChars();
        this.initCommonTexts();
    }
    DynaTextCompress.prototype.initVariableChars = function () {
        var _this = this;
        var charsSetup = [
            [48, 57],
            [65, 90],
            [97, 122],
            [128, 254],
        ];
        charsSetup.forEach(function (set) {
            for (var i = set[0]; i <= set[1]; i++)
                _this.variableChars += String.fromCharCode(i);
        });
    };
    DynaTextCompress.prototype.initCommonTexts = function () {
        var _this = this;
        this.commonTexts = this.commonTexts.concat();
        if (this.forEncode)
            this.commonTexts = this.commonTexts.concat([
                ' ',
                '`',
                '"',
                ',',
                ';',
                '{',
                '},',
                '}',
                '[',
                ']',
                '/',
                '\\',
                '\n',
                '\r',
                '\t',
            ]);
        this.commonTexts =
            this.commonTexts
                .filter(function (text) { return text !== _this.compressSymbol; })
                .filter(function (text) { return !!text; })
                .sort(function (textA, textB) { return textA.length - textB.length; })
                .reverse();
        this.commonTexts.unshift(this.compressSymbol);
    };
    DynaTextCompress.prototype.compress = function (text) {
        var output = '';
        for (var iChar = 0; iChar < text.length; iChar++) {
            var compressedBlock = this.encode(text.substr(iChar));
            if (compressedBlock) {
                output += compressedBlock;
                iChar += (this.commonTexts[this.decodeIndex(compressedBlock)]).length - 1;
            }
            else {
                output += text[iChar];
            }
        }
        return output;
    };
    DynaTextCompress.prototype.decompress = function (compressedString) {
        var output = {
            text: '',
            errors: [],
        };
        for (var iChar = 0; iChar < compressedString.length; iChar++) {
            if (compressedString[iChar] === this.compressSymbol) {
                var compressedBlock = compressedString.substr(iChar, 2);
                var decodedText = this.commonTexts[this.decodeIndex(compressedBlock)];
                if (decodedText) {
                    output.text += decodedText;
                }
                else {
                    output.errors.push("Symbol [" + compressedBlock + "] in unknown");
                }
                iChar += 1;
            }
            else {
                output.text += compressedString[iChar];
            }
        }
        return output;
    };
    // encode a part from the partial text to compressedBlock
    DynaTextCompress.prototype.encode = function (partialText) {
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
    // convert the index of the commonTexts to compressedBlock
    DynaTextCompress.prototype.encodeIndex = function (variableIndex) {
        var variableChar;
        if (variableIndex < this.variableChars.length) {
            variableChar = this.variableChars[variableIndex];
        }
        else {
            variableChar = String.fromCharCode(256 + variableIndex);
        }
        return this.compressSymbol + variableChar;
    };
    // convert a compressedBlock to index (of the commonsTexts)
    DynaTextCompress.prototype.decodeIndex = function (compressedBlock) {
        var variableIndex = compressedBlock.charCodeAt(1);
        var indexInVariableChars = this.variableChars.indexOf(String.fromCharCode(variableIndex));
        if (indexInVariableChars > -1) {
            return indexInVariableChars;
        }
        else {
            return variableIndex - 256;
        }
    };
    return DynaTextCompress;
}());
exports.DynaTextCompress = DynaTextCompress;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DynaTextCompress_1 = __webpack_require__(1);
exports.DynaTextCompress = DynaTextCompress_1.DynaTextCompress;
var DynaObjectCompress_1 = __webpack_require__(0);
exports.DynaObjectCompress = DynaObjectCompress_1.DynaObjectCompress;
var DynaObjectCompressVersion_1 = __webpack_require__(3);
exports.DynaObjectCompressVersion = DynaObjectCompressVersion_1.DynaObjectCompressVersion;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DynaObjectCompress_1 = __webpack_require__(0);
var DynaObjectCompressVersion = /** @class */ (function () {
    function DynaObjectCompressVersion(versionCompressConfig, forEncode, compressSymbol) {
        if (forEncode === void 0) { forEncode = true; }
        if (compressSymbol === void 0) { compressSymbol = "!"; }
        var _this = this;
        this.compressSymbol = compressSymbol;
        this.compressors = {};
        Object.keys(versionCompressConfig).forEach(function (version) {
            if (version.indexOf(compressSymbol) > -1) {
                throw Error("DynaObjectVCompress: \"version\" cannot contain the \"compressSymbol\", version: \"" + version + "\"");
            }
            _this.compressors[version] = new DynaObjectCompress_1.DynaObjectCompress(versionCompressConfig[version].objectPattern, versionCompressConfig[version].commonTexts, forEncode, compressSymbol);
        });
    }
    DynaObjectCompressVersion.prototype.compress = function (version, obj) {
        if (!this.compressors[version]) {
            console.error("DynaObjectVCompress.compress: " + version + " is not supported, there is no versionCompressConfig for this version");
            return '';
        }
        return "" + version + this.compressSymbol + this.compressors[version].compress(obj);
    };
    DynaObjectCompressVersion.prototype.decompress = function (compressed) {
        var version = compressed.substr(0, compressed.indexOf(this.compressSymbol));
        if (!version) {
            return {
                obj: null,
                errors: ["Cannot get the version from this compressed content"],
            };
        }
        if (!this.compressors[version]) {
            return {
                obj: null,
                errors: ["There is versionCompressConfig for this version: \"" + version + "\""],
            };
        }
        return this.compressors[version].decompress(compressed.substr(compressed.indexOf(this.compressSymbol) + this.compressSymbol.length));
    };
    return DynaObjectCompressVersion;
}());
exports.DynaObjectCompressVersion = DynaObjectCompressVersion;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ })
/******/ ]);
});