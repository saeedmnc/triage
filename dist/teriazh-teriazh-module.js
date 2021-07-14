(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["teriazh-teriazh-module"],{

/***/ "./node_modules/jsbarcode/bin/JsBarcode.js":
/*!*************************************************!*\
  !*** ./node_modules/jsbarcode/bin/JsBarcode.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _barcodes = __webpack_require__(/*! ./barcodes/ */ "./node_modules/jsbarcode/bin/barcodes/index.js");

var _barcodes2 = _interopRequireDefault(_barcodes);

var _merge = __webpack_require__(/*! ./help/merge.js */ "./node_modules/jsbarcode/bin/help/merge.js");

var _merge2 = _interopRequireDefault(_merge);

var _linearizeEncodings = __webpack_require__(/*! ./help/linearizeEncodings.js */ "./node_modules/jsbarcode/bin/help/linearizeEncodings.js");

var _linearizeEncodings2 = _interopRequireDefault(_linearizeEncodings);

var _fixOptions = __webpack_require__(/*! ./help/fixOptions.js */ "./node_modules/jsbarcode/bin/help/fixOptions.js");

var _fixOptions2 = _interopRequireDefault(_fixOptions);

var _getRenderProperties = __webpack_require__(/*! ./help/getRenderProperties.js */ "./node_modules/jsbarcode/bin/help/getRenderProperties.js");

var _getRenderProperties2 = _interopRequireDefault(_getRenderProperties);

var _optionsFromStrings = __webpack_require__(/*! ./help/optionsFromStrings.js */ "./node_modules/jsbarcode/bin/help/optionsFromStrings.js");

var _optionsFromStrings2 = _interopRequireDefault(_optionsFromStrings);

var _ErrorHandler = __webpack_require__(/*! ./exceptions/ErrorHandler.js */ "./node_modules/jsbarcode/bin/exceptions/ErrorHandler.js");

var _ErrorHandler2 = _interopRequireDefault(_ErrorHandler);

var _exceptions = __webpack_require__(/*! ./exceptions/exceptions.js */ "./node_modules/jsbarcode/bin/exceptions/exceptions.js");

var _defaults = __webpack_require__(/*! ./options/defaults.js */ "./node_modules/jsbarcode/bin/options/defaults.js");

var _defaults2 = _interopRequireDefault(_defaults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The protype of the object returned from the JsBarcode() call


// Help functions
var API = function API() {};

// The first call of the library API
// Will return an object with all barcodes calls and the data that is used
// by the renderers


// Default values


// Exceptions
// Import all the barcodes
var JsBarcode = function JsBarcode(element, text, options) {
	var api = new API();

	if (typeof element === "undefined") {
		throw Error("No element to render on was provided.");
	}

	// Variables that will be pased through the API calls
	api._renderProperties = (0, _getRenderProperties2.default)(element);
	api._encodings = [];
	api._options = _defaults2.default;
	api._errorHandler = new _ErrorHandler2.default(api);

	// If text is set, use the simple syntax (render the barcode directly)
	if (typeof text !== "undefined") {
		options = options || {};

		if (!options.format) {
			options.format = autoSelectBarcode();
		}

		api.options(options)[options.format](text, options).render();
	}

	return api;
};

// To make tests work TODO: remove
JsBarcode.getModule = function (name) {
	return _barcodes2.default[name];
};

// Register all barcodes
for (var name in _barcodes2.default) {
	if (_barcodes2.default.hasOwnProperty(name)) {
		// Security check if the propery is a prototype property
		registerBarcode(_barcodes2.default, name);
	}
}
function registerBarcode(barcodes, name) {
	API.prototype[name] = API.prototype[name.toUpperCase()] = API.prototype[name.toLowerCase()] = function (text, options) {
		var api = this;
		return api._errorHandler.wrapBarcodeCall(function () {
			// Ensure text is options.text
			options.text = typeof options.text === 'undefined' ? undefined : '' + options.text;

			var newOptions = (0, _merge2.default)(api._options, options);
			newOptions = (0, _optionsFromStrings2.default)(newOptions);
			var Encoder = barcodes[name];
			var encoded = encode(text, Encoder, newOptions);
			api._encodings.push(encoded);

			return api;
		});
	};
}

// encode() handles the Encoder call and builds the binary string to be rendered
function encode(text, Encoder, options) {
	// Ensure that text is a string
	text = "" + text;

	var encoder = new Encoder(text, options);

	// If the input is not valid for the encoder, throw error.
	// If the valid callback option is set, call it instead of throwing error
	if (!encoder.valid()) {
		throw new _exceptions.InvalidInputException(encoder.constructor.name, text);
	}

	// Make a request for the binary data (and other infromation) that should be rendered
	var encoded = encoder.encode();

	// Encodings can be nestled like [[1-1, 1-2], 2, [3-1, 3-2]
	// Convert to [1-1, 1-2, 2, 3-1, 3-2]
	encoded = (0, _linearizeEncodings2.default)(encoded);

	// Merge
	for (var i = 0; i < encoded.length; i++) {
		encoded[i].options = (0, _merge2.default)(options, encoded[i].options);
	}

	return encoded;
}

function autoSelectBarcode() {
	// If CODE128 exists. Use it
	if (_barcodes2.default["CODE128"]) {
		return "CODE128";
	}

	// Else, take the first (probably only) barcode
	return Object.keys(_barcodes2.default)[0];
}

// Sets global encoder options
// Added to the api by the JsBarcode function
API.prototype.options = function (options) {
	this._options = (0, _merge2.default)(this._options, options);
	return this;
};

// Will create a blank space (usually in between barcodes)
API.prototype.blank = function (size) {
	var zeroes = new Array(size + 1).join("0");
	this._encodings.push({ data: zeroes });
	return this;
};

// Initialize JsBarcode on all HTML elements defined.
API.prototype.init = function () {
	// Should do nothing if no elements where found
	if (!this._renderProperties) {
		return;
	}

	// Make sure renderProperies is an array
	if (!Array.isArray(this._renderProperties)) {
		this._renderProperties = [this._renderProperties];
	}

	var renderProperty;
	for (var i in this._renderProperties) {
		renderProperty = this._renderProperties[i];
		var options = (0, _merge2.default)(this._options, renderProperty.options);

		if (options.format == "auto") {
			options.format = autoSelectBarcode();
		}

		this._errorHandler.wrapBarcodeCall(function () {
			var text = options.value;
			var Encoder = _barcodes2.default[options.format.toUpperCase()];
			var encoded = encode(text, Encoder, options);

			render(renderProperty, encoded, options);
		});
	}
};

// The render API call. Calls the real render function.
API.prototype.render = function () {
	if (!this._renderProperties) {
		throw new _exceptions.NoElementException();
	}

	if (Array.isArray(this._renderProperties)) {
		for (var i = 0; i < this._renderProperties.length; i++) {
			render(this._renderProperties[i], this._encodings, this._options);
		}
	} else {
		render(this._renderProperties, this._encodings, this._options);
	}

	return this;
};

API.prototype._defaults = _defaults2.default;

// Prepares the encodings and calls the renderer
function render(renderProperties, encodings, options) {
	encodings = (0, _linearizeEncodings2.default)(encodings);

	for (var i = 0; i < encodings.length; i++) {
		encodings[i].options = (0, _merge2.default)(options, encodings[i].options);
		(0, _fixOptions2.default)(encodings[i].options);
	}

	(0, _fixOptions2.default)(options);

	var Renderer = renderProperties.renderer;
	var renderer = new Renderer(renderProperties.element, encodings, options);
	renderer.render();

	if (renderProperties.afterRender) {
		renderProperties.afterRender();
	}
}

// Export to browser
if (typeof window !== "undefined") {
	window.JsBarcode = JsBarcode;
}

// Export to jQuery
/*global jQuery */
if (typeof jQuery !== 'undefined') {
	jQuery.fn.JsBarcode = function (content, options) {
		var elementArray = [];
		jQuery(this).each(function () {
			elementArray.push(this);
		});
		return JsBarcode(elementArray, content, options);
	};
}

// Export to commonJS
module.exports = JsBarcode;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/Barcode.js":
/*!********************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/Barcode.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Barcode = function Barcode(data, options) {
	_classCallCheck(this, Barcode);

	this.data = data;
	this.text = options.text || data;
	this.options = options;
};

exports.default = Barcode;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/CODE128/CODE128.js":
/*!****************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/CODE128/CODE128.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Barcode2 = __webpack_require__(/*! ../Barcode.js */ "./node_modules/jsbarcode/bin/barcodes/Barcode.js");

var _Barcode3 = _interopRequireDefault(_Barcode2);

var _constants = __webpack_require__(/*! ./constants */ "./node_modules/jsbarcode/bin/barcodes/CODE128/constants.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// This is the master class,
// it does require the start code to be included in the string
var CODE128 = function (_Barcode) {
	_inherits(CODE128, _Barcode);

	function CODE128(data, options) {
		_classCallCheck(this, CODE128);

		// Get array of ascii codes from data
		var _this = _possibleConstructorReturn(this, (CODE128.__proto__ || Object.getPrototypeOf(CODE128)).call(this, data.substring(1), options));

		_this.bytes = data.split('').map(function (char) {
			return char.charCodeAt(0);
		});
		return _this;
	}

	_createClass(CODE128, [{
		key: 'valid',
		value: function valid() {
			// ASCII value ranges 0-127, 200-211
			return (/^[\x00-\x7F\xC8-\xD3]+$/.test(this.data)
			);
		}

		// The public encoding function

	}, {
		key: 'encode',
		value: function encode() {
			var bytes = this.bytes;
			// Remove the start code from the bytes and set its index
			var startIndex = bytes.shift() - 105;
			// Get start set by index
			var startSet = _constants.SET_BY_CODE[startIndex];

			if (startSet === undefined) {
				throw new RangeError('The encoding does not start with a start character.');
			}

			if (this.shouldEncodeAsEan128() === true) {
				bytes.unshift(_constants.FNC1);
			}

			// Start encode with the right type
			var encodingResult = CODE128.next(bytes, 1, startSet);

			return {
				text: this.text === this.data ? this.text.replace(/[^\x20-\x7E]/g, '') : this.text,
				data:
				// Add the start bits
				CODE128.getBar(startIndex) +
				// Add the encoded bits
				encodingResult.result +
				// Add the checksum
				CODE128.getBar((encodingResult.checksum + startIndex) % _constants.MODULO) +
				// Add the end bits
				CODE128.getBar(_constants.STOP)
			};
		}

		// GS1-128/EAN-128

	}, {
		key: 'shouldEncodeAsEan128',
		value: function shouldEncodeAsEan128() {
			var isEAN128 = this.options.ean128 || false;
			if (typeof isEAN128 === 'string') {
				isEAN128 = isEAN128.toLowerCase() === 'true';
			}
			return isEAN128;
		}

		// Get a bar symbol by index

	}], [{
		key: 'getBar',
		value: function getBar(index) {
			return _constants.BARS[index] ? _constants.BARS[index].toString() : '';
		}

		// Correct an index by a set and shift it from the bytes array

	}, {
		key: 'correctIndex',
		value: function correctIndex(bytes, set) {
			if (set === _constants.SET_A) {
				var charCode = bytes.shift();
				return charCode < 32 ? charCode + 64 : charCode - 32;
			} else if (set === _constants.SET_B) {
				return bytes.shift() - 32;
			} else {
				return (bytes.shift() - 48) * 10 + bytes.shift() - 48;
			}
		}
	}, {
		key: 'next',
		value: function next(bytes, pos, set) {
			if (!bytes.length) {
				return { result: '', checksum: 0 };
			}

			var nextCode = void 0,
			    index = void 0;

			// Special characters
			if (bytes[0] >= 200) {
				index = bytes.shift() - 105;
				var nextSet = _constants.SWAP[index];

				// Swap to other set
				if (nextSet !== undefined) {
					nextCode = CODE128.next(bytes, pos + 1, nextSet);
				}
				// Continue on current set but encode a special character
				else {
						// Shift
						if ((set === _constants.SET_A || set === _constants.SET_B) && index === _constants.SHIFT) {
							// Convert the next character so that is encoded correctly
							bytes[0] = set === _constants.SET_A ? bytes[0] > 95 ? bytes[0] - 96 : bytes[0] : bytes[0] < 32 ? bytes[0] + 96 : bytes[0];
						}
						nextCode = CODE128.next(bytes, pos + 1, set);
					}
			}
			// Continue encoding
			else {
					index = CODE128.correctIndex(bytes, set);
					nextCode = CODE128.next(bytes, pos + 1, set);
				}

			// Get the correct binary encoding and calculate the weight
			var enc = CODE128.getBar(index);
			var weight = index * pos;

			return {
				result: enc + nextCode.result,
				checksum: weight + nextCode.checksum
			};
		}
	}]);

	return CODE128;
}(_Barcode3.default);

exports.default = CODE128;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/CODE128/CODE128A.js":
/*!*****************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/CODE128/CODE128A.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CODE2 = __webpack_require__(/*! ./CODE128.js */ "./node_modules/jsbarcode/bin/barcodes/CODE128/CODE128.js");

var _CODE3 = _interopRequireDefault(_CODE2);

var _constants = __webpack_require__(/*! ./constants */ "./node_modules/jsbarcode/bin/barcodes/CODE128/constants.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CODE128A = function (_CODE) {
	_inherits(CODE128A, _CODE);

	function CODE128A(string, options) {
		_classCallCheck(this, CODE128A);

		return _possibleConstructorReturn(this, (CODE128A.__proto__ || Object.getPrototypeOf(CODE128A)).call(this, _constants.A_START_CHAR + string, options));
	}

	_createClass(CODE128A, [{
		key: 'valid',
		value: function valid() {
			return new RegExp('^' + _constants.A_CHARS + '+$').test(this.data);
		}
	}]);

	return CODE128A;
}(_CODE3.default);

exports.default = CODE128A;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/CODE128/CODE128B.js":
/*!*****************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/CODE128/CODE128B.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CODE2 = __webpack_require__(/*! ./CODE128.js */ "./node_modules/jsbarcode/bin/barcodes/CODE128/CODE128.js");

var _CODE3 = _interopRequireDefault(_CODE2);

var _constants = __webpack_require__(/*! ./constants */ "./node_modules/jsbarcode/bin/barcodes/CODE128/constants.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CODE128B = function (_CODE) {
	_inherits(CODE128B, _CODE);

	function CODE128B(string, options) {
		_classCallCheck(this, CODE128B);

		return _possibleConstructorReturn(this, (CODE128B.__proto__ || Object.getPrototypeOf(CODE128B)).call(this, _constants.B_START_CHAR + string, options));
	}

	_createClass(CODE128B, [{
		key: 'valid',
		value: function valid() {
			return new RegExp('^' + _constants.B_CHARS + '+$').test(this.data);
		}
	}]);

	return CODE128B;
}(_CODE3.default);

exports.default = CODE128B;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/CODE128/CODE128C.js":
/*!*****************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/CODE128/CODE128C.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CODE2 = __webpack_require__(/*! ./CODE128.js */ "./node_modules/jsbarcode/bin/barcodes/CODE128/CODE128.js");

var _CODE3 = _interopRequireDefault(_CODE2);

var _constants = __webpack_require__(/*! ./constants */ "./node_modules/jsbarcode/bin/barcodes/CODE128/constants.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CODE128C = function (_CODE) {
	_inherits(CODE128C, _CODE);

	function CODE128C(string, options) {
		_classCallCheck(this, CODE128C);

		return _possibleConstructorReturn(this, (CODE128C.__proto__ || Object.getPrototypeOf(CODE128C)).call(this, _constants.C_START_CHAR + string, options));
	}

	_createClass(CODE128C, [{
		key: 'valid',
		value: function valid() {
			return new RegExp('^' + _constants.C_CHARS + '+$').test(this.data);
		}
	}]);

	return CODE128C;
}(_CODE3.default);

exports.default = CODE128C;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/CODE128/CODE128_AUTO.js":
/*!*********************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/CODE128/CODE128_AUTO.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _CODE2 = __webpack_require__(/*! ./CODE128 */ "./node_modules/jsbarcode/bin/barcodes/CODE128/CODE128.js");

var _CODE3 = _interopRequireDefault(_CODE2);

var _auto = __webpack_require__(/*! ./auto */ "./node_modules/jsbarcode/bin/barcodes/CODE128/auto.js");

var _auto2 = _interopRequireDefault(_auto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CODE128AUTO = function (_CODE) {
	_inherits(CODE128AUTO, _CODE);

	function CODE128AUTO(data, options) {
		_classCallCheck(this, CODE128AUTO);

		// ASCII value ranges 0-127, 200-211
		if (/^[\x00-\x7F\xC8-\xD3]+$/.test(data)) {
			var _this = _possibleConstructorReturn(this, (CODE128AUTO.__proto__ || Object.getPrototypeOf(CODE128AUTO)).call(this, (0, _auto2.default)(data), options));
		} else {
			var _this = _possibleConstructorReturn(this, (CODE128AUTO.__proto__ || Object.getPrototypeOf(CODE128AUTO)).call(this, data, options));
		}
		return _possibleConstructorReturn(_this);
	}

	return CODE128AUTO;
}(_CODE3.default);

exports.default = CODE128AUTO;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/CODE128/auto.js":
/*!*************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/CODE128/auto.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _constants = __webpack_require__(/*! ./constants */ "./node_modules/jsbarcode/bin/barcodes/CODE128/constants.js");

// Match Set functions
var matchSetALength = function matchSetALength(string) {
	return string.match(new RegExp('^' + _constants.A_CHARS + '*'))[0].length;
};
var matchSetBLength = function matchSetBLength(string) {
	return string.match(new RegExp('^' + _constants.B_CHARS + '*'))[0].length;
};
var matchSetC = function matchSetC(string) {
	return string.match(new RegExp('^' + _constants.C_CHARS + '*'))[0];
};

// CODE128A or CODE128B
function autoSelectFromAB(string, isA) {
	var ranges = isA ? _constants.A_CHARS : _constants.B_CHARS;
	var untilC = string.match(new RegExp('^(' + ranges + '+?)(([0-9]{2}){2,})([^0-9]|$)'));

	if (untilC) {
		return untilC[1] + String.fromCharCode(204) + autoSelectFromC(string.substring(untilC[1].length));
	}

	var chars = string.match(new RegExp('^' + ranges + '+'))[0];

	if (chars.length === string.length) {
		return string;
	}

	return chars + String.fromCharCode(isA ? 205 : 206) + autoSelectFromAB(string.substring(chars.length), !isA);
}

// CODE128C
function autoSelectFromC(string) {
	var cMatch = matchSetC(string);
	var length = cMatch.length;

	if (length === string.length) {
		return string;
	}

	string = string.substring(length);

	// Select A/B depending on the longest match
	var isA = matchSetALength(string) >= matchSetBLength(string);
	return cMatch + String.fromCharCode(isA ? 206 : 205) + autoSelectFromAB(string, isA);
}

// Detect Code Set (A, B or C) and format the string

exports.default = function (string) {
	var newString = void 0;
	var cLength = matchSetC(string).length;

	// Select 128C if the string start with enough digits
	if (cLength >= 2) {
		newString = _constants.C_START_CHAR + autoSelectFromC(string);
	} else {
		// Select A/B depending on the longest match
		var isA = matchSetALength(string) > matchSetBLength(string);
		newString = (isA ? _constants.A_START_CHAR : _constants.B_START_CHAR) + autoSelectFromAB(string, isA);
	}

	return newString.replace(/[\xCD\xCE]([^])[\xCD\xCE]/, // Any sequence between 205 and 206 characters
	function (match, char) {
		return String.fromCharCode(203) + char;
	});
};

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/CODE128/constants.js":
/*!******************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/CODE128/constants.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _SET_BY_CODE;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// constants for internal usage
var SET_A = exports.SET_A = 0;
var SET_B = exports.SET_B = 1;
var SET_C = exports.SET_C = 2;

// Special characters
var SHIFT = exports.SHIFT = 98;
var START_A = exports.START_A = 103;
var START_B = exports.START_B = 104;
var START_C = exports.START_C = 105;
var MODULO = exports.MODULO = 103;
var STOP = exports.STOP = 106;
var FNC1 = exports.FNC1 = 207;

// Get set by start code
var SET_BY_CODE = exports.SET_BY_CODE = (_SET_BY_CODE = {}, _defineProperty(_SET_BY_CODE, START_A, SET_A), _defineProperty(_SET_BY_CODE, START_B, SET_B), _defineProperty(_SET_BY_CODE, START_C, SET_C), _SET_BY_CODE);

// Get next set by code
var SWAP = exports.SWAP = {
	101: SET_A,
	100: SET_B,
	99: SET_C
};

var A_START_CHAR = exports.A_START_CHAR = String.fromCharCode(208); // START_A + 105
var B_START_CHAR = exports.B_START_CHAR = String.fromCharCode(209); // START_B + 105
var C_START_CHAR = exports.C_START_CHAR = String.fromCharCode(210); // START_C + 105

// 128A (Code Set A)
// ASCII characters 00 to 95 (0–9, A–Z and control codes), special characters, and FNC 1–4
var A_CHARS = exports.A_CHARS = "[\x00-\x5F\xC8-\xCF]";

// 128B (Code Set B)
// ASCII characters 32 to 127 (0–9, A–Z, a–z), special characters, and FNC 1–4
var B_CHARS = exports.B_CHARS = "[\x20-\x7F\xC8-\xCF]";

// 128C (Code Set C)
// 00–99 (encodes two digits with a single code point) and FNC1
var C_CHARS = exports.C_CHARS = "(\xCF*[0-9]{2}\xCF*)";

// CODE128 includes 107 symbols:
// 103 data symbols, 3 start symbols (A, B and C), and 1 stop symbol (the last one)
// Each symbol consist of three black bars (1) and three white spaces (0).
var BARS = exports.BARS = [11011001100, 11001101100, 11001100110, 10010011000, 10010001100, 10001001100, 10011001000, 10011000100, 10001100100, 11001001000, 11001000100, 11000100100, 10110011100, 10011011100, 10011001110, 10111001100, 10011101100, 10011100110, 11001110010, 11001011100, 11001001110, 11011100100, 11001110100, 11101101110, 11101001100, 11100101100, 11100100110, 11101100100, 11100110100, 11100110010, 11011011000, 11011000110, 11000110110, 10100011000, 10001011000, 10001000110, 10110001000, 10001101000, 10001100010, 11010001000, 11000101000, 11000100010, 10110111000, 10110001110, 10001101110, 10111011000, 10111000110, 10001110110, 11101110110, 11010001110, 11000101110, 11011101000, 11011100010, 11011101110, 11101011000, 11101000110, 11100010110, 11101101000, 11101100010, 11100011010, 11101111010, 11001000010, 11110001010, 10100110000, 10100001100, 10010110000, 10010000110, 10000101100, 10000100110, 10110010000, 10110000100, 10011010000, 10011000010, 10000110100, 10000110010, 11000010010, 11001010000, 11110111010, 11000010100, 10001111010, 10100111100, 10010111100, 10010011110, 10111100100, 10011110100, 10011110010, 11110100100, 11110010100, 11110010010, 11011011110, 11011110110, 11110110110, 10101111000, 10100011110, 10001011110, 10111101000, 10111100010, 11110101000, 11110100010, 10111011110, 10111101110, 11101011110, 11110101110, 11010000100, 11010010000, 11010011100, 1100011101011];

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/CODE128/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/CODE128/index.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CODE128C = exports.CODE128B = exports.CODE128A = exports.CODE128 = undefined;

var _CODE128_AUTO = __webpack_require__(/*! ./CODE128_AUTO.js */ "./node_modules/jsbarcode/bin/barcodes/CODE128/CODE128_AUTO.js");

var _CODE128_AUTO2 = _interopRequireDefault(_CODE128_AUTO);

var _CODE128A = __webpack_require__(/*! ./CODE128A.js */ "./node_modules/jsbarcode/bin/barcodes/CODE128/CODE128A.js");

var _CODE128A2 = _interopRequireDefault(_CODE128A);

var _CODE128B = __webpack_require__(/*! ./CODE128B.js */ "./node_modules/jsbarcode/bin/barcodes/CODE128/CODE128B.js");

var _CODE128B2 = _interopRequireDefault(_CODE128B);

var _CODE128C = __webpack_require__(/*! ./CODE128C.js */ "./node_modules/jsbarcode/bin/barcodes/CODE128/CODE128C.js");

var _CODE128C2 = _interopRequireDefault(_CODE128C);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.CODE128 = _CODE128_AUTO2.default;
exports.CODE128A = _CODE128A2.default;
exports.CODE128B = _CODE128B2.default;
exports.CODE128C = _CODE128C2.default;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/CODE39/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/CODE39/index.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.CODE39 = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Barcode2 = __webpack_require__(/*! ../Barcode.js */ "./node_modules/jsbarcode/bin/barcodes/Barcode.js");

var _Barcode3 = _interopRequireDefault(_Barcode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Encoding documentation:
// https://en.wikipedia.org/wiki/Code_39#Encoding

var CODE39 = function (_Barcode) {
	_inherits(CODE39, _Barcode);

	function CODE39(data, options) {
		_classCallCheck(this, CODE39);

		data = data.toUpperCase();

		// Calculate mod43 checksum if enabled
		if (options.mod43) {
			data += getCharacter(mod43checksum(data));
		}

		return _possibleConstructorReturn(this, (CODE39.__proto__ || Object.getPrototypeOf(CODE39)).call(this, data, options));
	}

	_createClass(CODE39, [{
		key: "encode",
		value: function encode() {
			// First character is always a *
			var result = getEncoding("*");

			// Take every character and add the binary representation to the result
			for (var i = 0; i < this.data.length; i++) {
				result += getEncoding(this.data[i]) + "0";
			}

			// Last character is always a *
			result += getEncoding("*");

			return {
				data: result,
				text: this.text
			};
		}
	}, {
		key: "valid",
		value: function valid() {
			return this.data.search(/^[0-9A-Z\-\.\ \$\/\+\%]+$/) !== -1;
		}
	}]);

	return CODE39;
}(_Barcode3.default);

// All characters. The position in the array is the (checksum) value


var characters = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "-", ".", " ", "$", "/", "+", "%", "*"];

// The decimal representation of the characters, is converted to the
// corresponding binary with the getEncoding function
var encodings = [20957, 29783, 23639, 30485, 20951, 29813, 23669, 20855, 29789, 23645, 29975, 23831, 30533, 22295, 30149, 24005, 21623, 29981, 23837, 22301, 30023, 23879, 30545, 22343, 30161, 24017, 21959, 30065, 23921, 22385, 29015, 18263, 29141, 17879, 29045, 18293, 17783, 29021, 18269, 17477, 17489, 17681, 20753, 35770];

// Get the binary representation of a character by converting the encodings
// from decimal to binary
function getEncoding(character) {
	return getBinary(characterValue(character));
}

function getBinary(characterValue) {
	return encodings[characterValue].toString(2);
}

function getCharacter(characterValue) {
	return characters[characterValue];
}

function characterValue(character) {
	return characters.indexOf(character);
}

function mod43checksum(data) {
	var checksum = 0;
	for (var i = 0; i < data.length; i++) {
		checksum += characterValue(data[i]);
	}

	checksum = checksum % 43;
	return checksum;
}

exports.CODE39 = CODE39;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/EAN.js":
/*!************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/EAN_UPC/EAN.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = __webpack_require__(/*! ./constants */ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/constants.js");

var _encoder = __webpack_require__(/*! ./encoder */ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/encoder.js");

var _encoder2 = _interopRequireDefault(_encoder);

var _Barcode2 = __webpack_require__(/*! ../Barcode */ "./node_modules/jsbarcode/bin/barcodes/Barcode.js");

var _Barcode3 = _interopRequireDefault(_Barcode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Base class for EAN8 & EAN13
var EAN = function (_Barcode) {
	_inherits(EAN, _Barcode);

	function EAN(data, options) {
		_classCallCheck(this, EAN);

		// Make sure the font is not bigger than the space between the guard bars
		var _this = _possibleConstructorReturn(this, (EAN.__proto__ || Object.getPrototypeOf(EAN)).call(this, data, options));

		_this.fontSize = !options.flat && options.fontSize > options.width * 10 ? options.width * 10 : options.fontSize;

		// Make the guard bars go down half the way of the text
		_this.guardHeight = options.height + _this.fontSize / 2 + options.textMargin;
		return _this;
	}

	_createClass(EAN, [{
		key: 'encode',
		value: function encode() {
			return this.options.flat ? this.encodeFlat() : this.encodeGuarded();
		}
	}, {
		key: 'leftText',
		value: function leftText(from, to) {
			return this.text.substr(from, to);
		}
	}, {
		key: 'leftEncode',
		value: function leftEncode(data, structure) {
			return (0, _encoder2.default)(data, structure);
		}
	}, {
		key: 'rightText',
		value: function rightText(from, to) {
			return this.text.substr(from, to);
		}
	}, {
		key: 'rightEncode',
		value: function rightEncode(data, structure) {
			return (0, _encoder2.default)(data, structure);
		}
	}, {
		key: 'encodeGuarded',
		value: function encodeGuarded() {
			var textOptions = { fontSize: this.fontSize };
			var guardOptions = { height: this.guardHeight };

			return [{ data: _constants.SIDE_BIN, options: guardOptions }, { data: this.leftEncode(), text: this.leftText(), options: textOptions }, { data: _constants.MIDDLE_BIN, options: guardOptions }, { data: this.rightEncode(), text: this.rightText(), options: textOptions }, { data: _constants.SIDE_BIN, options: guardOptions }];
		}
	}, {
		key: 'encodeFlat',
		value: function encodeFlat() {
			var data = [_constants.SIDE_BIN, this.leftEncode(), _constants.MIDDLE_BIN, this.rightEncode(), _constants.SIDE_BIN];

			return {
				data: data.join(''),
				text: this.text
			};
		}
	}]);

	return EAN;
}(_Barcode3.default);

exports.default = EAN;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/EAN13.js":
/*!**************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/EAN_UPC/EAN13.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _constants = __webpack_require__(/*! ./constants */ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/constants.js");

var _EAN2 = __webpack_require__(/*! ./EAN */ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/EAN.js");

var _EAN3 = _interopRequireDefault(_EAN2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Encoding documentation:
// https://en.wikipedia.org/wiki/International_Article_Number_(EAN)#Binary_encoding_of_data_digits_into_EAN-13_barcode

// Calculate the checksum digit
// https://en.wikipedia.org/wiki/International_Article_Number_(EAN)#Calculation_of_checksum_digit
var checksum = function checksum(number) {
	var res = number.substr(0, 12).split('').map(function (n) {
		return +n;
	}).reduce(function (sum, a, idx) {
		return idx % 2 ? sum + a * 3 : sum + a;
	}, 0);

	return (10 - res % 10) % 10;
};

var EAN13 = function (_EAN) {
	_inherits(EAN13, _EAN);

	function EAN13(data, options) {
		_classCallCheck(this, EAN13);

		// Add checksum if it does not exist
		if (data.search(/^[0-9]{12}$/) !== -1) {
			data += checksum(data);
		}

		// Adds a last character to the end of the barcode
		var _this = _possibleConstructorReturn(this, (EAN13.__proto__ || Object.getPrototypeOf(EAN13)).call(this, data, options));

		_this.lastChar = options.lastChar;
		return _this;
	}

	_createClass(EAN13, [{
		key: 'valid',
		value: function valid() {
			return this.data.search(/^[0-9]{13}$/) !== -1 && +this.data[12] === checksum(this.data);
		}
	}, {
		key: 'leftText',
		value: function leftText() {
			return _get(EAN13.prototype.__proto__ || Object.getPrototypeOf(EAN13.prototype), 'leftText', this).call(this, 1, 6);
		}
	}, {
		key: 'leftEncode',
		value: function leftEncode() {
			var data = this.data.substr(1, 6);
			var structure = _constants.EAN13_STRUCTURE[this.data[0]];
			return _get(EAN13.prototype.__proto__ || Object.getPrototypeOf(EAN13.prototype), 'leftEncode', this).call(this, data, structure);
		}
	}, {
		key: 'rightText',
		value: function rightText() {
			return _get(EAN13.prototype.__proto__ || Object.getPrototypeOf(EAN13.prototype), 'rightText', this).call(this, 7, 6);
		}
	}, {
		key: 'rightEncode',
		value: function rightEncode() {
			var data = this.data.substr(7, 6);
			return _get(EAN13.prototype.__proto__ || Object.getPrototypeOf(EAN13.prototype), 'rightEncode', this).call(this, data, 'RRRRRR');
		}

		// The "standard" way of printing EAN13 barcodes with guard bars

	}, {
		key: 'encodeGuarded',
		value: function encodeGuarded() {
			var data = _get(EAN13.prototype.__proto__ || Object.getPrototypeOf(EAN13.prototype), 'encodeGuarded', this).call(this);

			// Extend data with left digit & last character
			if (this.options.displayValue) {
				data.unshift({
					data: '000000000000',
					text: this.text.substr(0, 1),
					options: { textAlign: 'left', fontSize: this.fontSize }
				});

				if (this.options.lastChar) {
					data.push({
						data: '00'
					});
					data.push({
						data: '00000',
						text: this.options.lastChar,
						options: { fontSize: this.fontSize }
					});
				}
			}

			return data;
		}
	}]);

	return EAN13;
}(_EAN3.default);

exports.default = EAN13;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/EAN2.js":
/*!*************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/EAN_UPC/EAN2.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = __webpack_require__(/*! ./constants */ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/constants.js");

var _encoder = __webpack_require__(/*! ./encoder */ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/encoder.js");

var _encoder2 = _interopRequireDefault(_encoder);

var _Barcode2 = __webpack_require__(/*! ../Barcode */ "./node_modules/jsbarcode/bin/barcodes/Barcode.js");

var _Barcode3 = _interopRequireDefault(_Barcode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Encoding documentation:
// https://en.wikipedia.org/wiki/EAN_2#Encoding

var EAN2 = function (_Barcode) {
	_inherits(EAN2, _Barcode);

	function EAN2(data, options) {
		_classCallCheck(this, EAN2);

		return _possibleConstructorReturn(this, (EAN2.__proto__ || Object.getPrototypeOf(EAN2)).call(this, data, options));
	}

	_createClass(EAN2, [{
		key: 'valid',
		value: function valid() {
			return this.data.search(/^[0-9]{2}$/) !== -1;
		}
	}, {
		key: 'encode',
		value: function encode() {
			// Choose the structure based on the number mod 4
			var structure = _constants.EAN2_STRUCTURE[parseInt(this.data) % 4];
			return {
				// Start bits + Encode the two digits with 01 in between
				data: '1011' + (0, _encoder2.default)(this.data, structure, '01'),
				text: this.text
			};
		}
	}]);

	return EAN2;
}(_Barcode3.default);

exports.default = EAN2;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/EAN5.js":
/*!*************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/EAN_UPC/EAN5.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = __webpack_require__(/*! ./constants */ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/constants.js");

var _encoder = __webpack_require__(/*! ./encoder */ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/encoder.js");

var _encoder2 = _interopRequireDefault(_encoder);

var _Barcode2 = __webpack_require__(/*! ../Barcode */ "./node_modules/jsbarcode/bin/barcodes/Barcode.js");

var _Barcode3 = _interopRequireDefault(_Barcode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Encoding documentation:
// https://en.wikipedia.org/wiki/EAN_5#Encoding

var checksum = function checksum(data) {
	var result = data.split('').map(function (n) {
		return +n;
	}).reduce(function (sum, a, idx) {
		return idx % 2 ? sum + a * 9 : sum + a * 3;
	}, 0);
	return result % 10;
};

var EAN5 = function (_Barcode) {
	_inherits(EAN5, _Barcode);

	function EAN5(data, options) {
		_classCallCheck(this, EAN5);

		return _possibleConstructorReturn(this, (EAN5.__proto__ || Object.getPrototypeOf(EAN5)).call(this, data, options));
	}

	_createClass(EAN5, [{
		key: 'valid',
		value: function valid() {
			return this.data.search(/^[0-9]{5}$/) !== -1;
		}
	}, {
		key: 'encode',
		value: function encode() {
			var structure = _constants.EAN5_STRUCTURE[checksum(this.data)];
			return {
				data: '1011' + (0, _encoder2.default)(this.data, structure, '01'),
				text: this.text
			};
		}
	}]);

	return EAN5;
}(_Barcode3.default);

exports.default = EAN5;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/EAN8.js":
/*!*************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/EAN_UPC/EAN8.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _EAN2 = __webpack_require__(/*! ./EAN */ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/EAN.js");

var _EAN3 = _interopRequireDefault(_EAN2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Encoding documentation:
// http://www.barcodeisland.com/ean8.phtml

// Calculate the checksum digit
var checksum = function checksum(number) {
	var res = number.substr(0, 7).split('').map(function (n) {
		return +n;
	}).reduce(function (sum, a, idx) {
		return idx % 2 ? sum + a : sum + a * 3;
	}, 0);

	return (10 - res % 10) % 10;
};

var EAN8 = function (_EAN) {
	_inherits(EAN8, _EAN);

	function EAN8(data, options) {
		_classCallCheck(this, EAN8);

		// Add checksum if it does not exist
		if (data.search(/^[0-9]{7}$/) !== -1) {
			data += checksum(data);
		}

		return _possibleConstructorReturn(this, (EAN8.__proto__ || Object.getPrototypeOf(EAN8)).call(this, data, options));
	}

	_createClass(EAN8, [{
		key: 'valid',
		value: function valid() {
			return this.data.search(/^[0-9]{8}$/) !== -1 && +this.data[7] === checksum(this.data);
		}
	}, {
		key: 'leftText',
		value: function leftText() {
			return _get(EAN8.prototype.__proto__ || Object.getPrototypeOf(EAN8.prototype), 'leftText', this).call(this, 0, 4);
		}
	}, {
		key: 'leftEncode',
		value: function leftEncode() {
			var data = this.data.substr(0, 4);
			return _get(EAN8.prototype.__proto__ || Object.getPrototypeOf(EAN8.prototype), 'leftEncode', this).call(this, data, 'LLLL');
		}
	}, {
		key: 'rightText',
		value: function rightText() {
			return _get(EAN8.prototype.__proto__ || Object.getPrototypeOf(EAN8.prototype), 'rightText', this).call(this, 4, 4);
		}
	}, {
		key: 'rightEncode',
		value: function rightEncode() {
			var data = this.data.substr(4, 4);
			return _get(EAN8.prototype.__proto__ || Object.getPrototypeOf(EAN8.prototype), 'rightEncode', this).call(this, data, 'RRRR');
		}
	}]);

	return EAN8;
}(_EAN3.default);

exports.default = EAN8;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/UPC.js":
/*!************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/EAN_UPC/UPC.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.checksum = checksum;

var _encoder = __webpack_require__(/*! ./encoder */ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/encoder.js");

var _encoder2 = _interopRequireDefault(_encoder);

var _Barcode2 = __webpack_require__(/*! ../Barcode.js */ "./node_modules/jsbarcode/bin/barcodes/Barcode.js");

var _Barcode3 = _interopRequireDefault(_Barcode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Encoding documentation:
// https://en.wikipedia.org/wiki/Universal_Product_Code#Encoding

var UPC = function (_Barcode) {
	_inherits(UPC, _Barcode);

	function UPC(data, options) {
		_classCallCheck(this, UPC);

		// Add checksum if it does not exist
		if (data.search(/^[0-9]{11}$/) !== -1) {
			data += checksum(data);
		}

		var _this = _possibleConstructorReturn(this, (UPC.__proto__ || Object.getPrototypeOf(UPC)).call(this, data, options));

		_this.displayValue = options.displayValue;

		// Make sure the font is not bigger than the space between the guard bars
		if (options.fontSize > options.width * 10) {
			_this.fontSize = options.width * 10;
		} else {
			_this.fontSize = options.fontSize;
		}

		// Make the guard bars go down half the way of the text
		_this.guardHeight = options.height + _this.fontSize / 2 + options.textMargin;
		return _this;
	}

	_createClass(UPC, [{
		key: "valid",
		value: function valid() {
			return this.data.search(/^[0-9]{12}$/) !== -1 && this.data[11] == checksum(this.data);
		}
	}, {
		key: "encode",
		value: function encode() {
			if (this.options.flat) {
				return this.flatEncoding();
			} else {
				return this.guardedEncoding();
			}
		}
	}, {
		key: "flatEncoding",
		value: function flatEncoding() {
			var result = "";

			result += "101";
			result += (0, _encoder2.default)(this.data.substr(0, 6), "LLLLLL");
			result += "01010";
			result += (0, _encoder2.default)(this.data.substr(6, 6), "RRRRRR");
			result += "101";

			return {
				data: result,
				text: this.text
			};
		}
	}, {
		key: "guardedEncoding",
		value: function guardedEncoding() {
			var result = [];

			// Add the first digit
			if (this.displayValue) {
				result.push({
					data: "00000000",
					text: this.text.substr(0, 1),
					options: { textAlign: "left", fontSize: this.fontSize }
				});
			}

			// Add the guard bars
			result.push({
				data: "101" + (0, _encoder2.default)(this.data[0], "L"),
				options: { height: this.guardHeight }
			});

			// Add the left side
			result.push({
				data: (0, _encoder2.default)(this.data.substr(1, 5), "LLLLL"),
				text: this.text.substr(1, 5),
				options: { fontSize: this.fontSize }
			});

			// Add the middle bits
			result.push({
				data: "01010",
				options: { height: this.guardHeight }
			});

			// Add the right side
			result.push({
				data: (0, _encoder2.default)(this.data.substr(6, 5), "RRRRR"),
				text: this.text.substr(6, 5),
				options: { fontSize: this.fontSize }
			});

			// Add the end bits
			result.push({
				data: (0, _encoder2.default)(this.data[11], "R") + "101",
				options: { height: this.guardHeight }
			});

			// Add the last digit
			if (this.displayValue) {
				result.push({
					data: "00000000",
					text: this.text.substr(11, 1),
					options: { textAlign: "right", fontSize: this.fontSize }
				});
			}

			return result;
		}
	}]);

	return UPC;
}(_Barcode3.default);

// Calulate the checksum digit
// https://en.wikipedia.org/wiki/International_Article_Number_(EAN)#Calculation_of_checksum_digit


function checksum(number) {
	var result = 0;

	var i;
	for (i = 1; i < 11; i += 2) {
		result += parseInt(number[i]);
	}
	for (i = 0; i < 11; i += 2) {
		result += parseInt(number[i]) * 3;
	}

	return (10 - result % 10) % 10;
}

exports.default = UPC;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/UPCE.js":
/*!*************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/EAN_UPC/UPCE.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _encoder = __webpack_require__(/*! ./encoder */ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/encoder.js");

var _encoder2 = _interopRequireDefault(_encoder);

var _Barcode2 = __webpack_require__(/*! ../Barcode.js */ "./node_modules/jsbarcode/bin/barcodes/Barcode.js");

var _Barcode3 = _interopRequireDefault(_Barcode2);

var _UPC = __webpack_require__(/*! ./UPC.js */ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/UPC.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Encoding documentation:
// https://en.wikipedia.org/wiki/Universal_Product_Code#Encoding
//
// UPC-E documentation:
// https://en.wikipedia.org/wiki/Universal_Product_Code#UPC-E

var EXPANSIONS = ["XX00000XXX", "XX10000XXX", "XX20000XXX", "XXX00000XX", "XXXX00000X", "XXXXX00005", "XXXXX00006", "XXXXX00007", "XXXXX00008", "XXXXX00009"];

var PARITIES = [["EEEOOO", "OOOEEE"], ["EEOEOO", "OOEOEE"], ["EEOOEO", "OOEEOE"], ["EEOOOE", "OOEEEO"], ["EOEEOO", "OEOOEE"], ["EOOEEO", "OEEOOE"], ["EOOOEE", "OEEEOO"], ["EOEOEO", "OEOEOE"], ["EOEOOE", "OEOEEO"], ["EOOEOE", "OEEOEO"]];

var UPCE = function (_Barcode) {
	_inherits(UPCE, _Barcode);

	function UPCE(data, options) {
		_classCallCheck(this, UPCE);

		var _this = _possibleConstructorReturn(this, (UPCE.__proto__ || Object.getPrototypeOf(UPCE)).call(this, data, options));
		// Code may be 6 or 8 digits;
		// A 7 digit code is ambiguous as to whether the extra digit
		// is a UPC-A check or number system digit.


		_this.isValid = false;
		if (data.search(/^[0-9]{6}$/) !== -1) {
			_this.middleDigits = data;
			_this.upcA = expandToUPCA(data, "0");
			_this.text = options.text || '' + _this.upcA[0] + data + _this.upcA[_this.upcA.length - 1];
			_this.isValid = true;
		} else if (data.search(/^[01][0-9]{7}$/) !== -1) {
			_this.middleDigits = data.substring(1, data.length - 1);
			_this.upcA = expandToUPCA(_this.middleDigits, data[0]);

			if (_this.upcA[_this.upcA.length - 1] === data[data.length - 1]) {
				_this.isValid = true;
			} else {
				// checksum mismatch
				return _possibleConstructorReturn(_this);
			}
		} else {
			return _possibleConstructorReturn(_this);
		}

		_this.displayValue = options.displayValue;

		// Make sure the font is not bigger than the space between the guard bars
		if (options.fontSize > options.width * 10) {
			_this.fontSize = options.width * 10;
		} else {
			_this.fontSize = options.fontSize;
		}

		// Make the guard bars go down half the way of the text
		_this.guardHeight = options.height + _this.fontSize / 2 + options.textMargin;
		return _this;
	}

	_createClass(UPCE, [{
		key: 'valid',
		value: function valid() {
			return this.isValid;
		}
	}, {
		key: 'encode',
		value: function encode() {
			if (this.options.flat) {
				return this.flatEncoding();
			} else {
				return this.guardedEncoding();
			}
		}
	}, {
		key: 'flatEncoding',
		value: function flatEncoding() {
			var result = "";

			result += "101";
			result += this.encodeMiddleDigits();
			result += "010101";

			return {
				data: result,
				text: this.text
			};
		}
	}, {
		key: 'guardedEncoding',
		value: function guardedEncoding() {
			var result = [];

			// Add the UPC-A number system digit beneath the quiet zone
			if (this.displayValue) {
				result.push({
					data: "00000000",
					text: this.text[0],
					options: { textAlign: "left", fontSize: this.fontSize }
				});
			}

			// Add the guard bars
			result.push({
				data: "101",
				options: { height: this.guardHeight }
			});

			// Add the 6 UPC-E digits
			result.push({
				data: this.encodeMiddleDigits(),
				text: this.text.substring(1, 7),
				options: { fontSize: this.fontSize }
			});

			// Add the end bits
			result.push({
				data: "010101",
				options: { height: this.guardHeight }
			});

			// Add the UPC-A check digit beneath the quiet zone
			if (this.displayValue) {
				result.push({
					data: "00000000",
					text: this.text[7],
					options: { textAlign: "right", fontSize: this.fontSize }
				});
			}

			return result;
		}
	}, {
		key: 'encodeMiddleDigits',
		value: function encodeMiddleDigits() {
			var numberSystem = this.upcA[0];
			var checkDigit = this.upcA[this.upcA.length - 1];
			var parity = PARITIES[parseInt(checkDigit)][parseInt(numberSystem)];
			return (0, _encoder2.default)(this.middleDigits, parity);
		}
	}]);

	return UPCE;
}(_Barcode3.default);

function expandToUPCA(middleDigits, numberSystem) {
	var lastUpcE = parseInt(middleDigits[middleDigits.length - 1]);
	var expansion = EXPANSIONS[lastUpcE];

	var result = "";
	var digitIndex = 0;
	for (var i = 0; i < expansion.length; i++) {
		var c = expansion[i];
		if (c === 'X') {
			result += middleDigits[digitIndex++];
		} else {
			result += c;
		}
	}

	result = '' + numberSystem + result;
	return '' + result + (0, _UPC.checksum)(result);
}

exports.default = UPCE;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/constants.js":
/*!******************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/EAN_UPC/constants.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
// Standard start end and middle bits
var SIDE_BIN = exports.SIDE_BIN = '101';
var MIDDLE_BIN = exports.MIDDLE_BIN = '01010';

var BINARIES = exports.BINARIES = {
	'L': [// The L (left) type of encoding
	'0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'],
	'G': [// The G type of encoding
	'0100111', '0110011', '0011011', '0100001', '0011101', '0111001', '0000101', '0010001', '0001001', '0010111'],
	'R': [// The R (right) type of encoding
	'1110010', '1100110', '1101100', '1000010', '1011100', '1001110', '1010000', '1000100', '1001000', '1110100'],
	'O': [// The O (odd) encoding for UPC-E
	'0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'],
	'E': [// The E (even) encoding for UPC-E
	'0100111', '0110011', '0011011', '0100001', '0011101', '0111001', '0000101', '0010001', '0001001', '0010111']
};

// Define the EAN-2 structure
var EAN2_STRUCTURE = exports.EAN2_STRUCTURE = ['LL', 'LG', 'GL', 'GG'];

// Define the EAN-5 structure
var EAN5_STRUCTURE = exports.EAN5_STRUCTURE = ['GGLLL', 'GLGLL', 'GLLGL', 'GLLLG', 'LGGLL', 'LLGGL', 'LLLGG', 'LGLGL', 'LGLLG', 'LLGLG'];

// Define the EAN-13 structure
var EAN13_STRUCTURE = exports.EAN13_STRUCTURE = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'];

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/encoder.js":
/*!****************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/EAN_UPC/encoder.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _constants = __webpack_require__(/*! ./constants */ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/constants.js");

// Encode data string
var encode = function encode(data, structure, separator) {
	var encoded = data.split('').map(function (val, idx) {
		return _constants.BINARIES[structure[idx]];
	}).map(function (val, idx) {
		return val ? val[data[idx]] : '';
	});

	if (separator) {
		var last = data.length - 1;
		encoded = encoded.map(function (val, idx) {
			return idx < last ? val + separator : val;
		});
	}

	return encoded.join('');
};

exports.default = encode;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/EAN_UPC/index.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UPCE = exports.UPC = exports.EAN2 = exports.EAN5 = exports.EAN8 = exports.EAN13 = undefined;

var _EAN = __webpack_require__(/*! ./EAN13.js */ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/EAN13.js");

var _EAN2 = _interopRequireDefault(_EAN);

var _EAN3 = __webpack_require__(/*! ./EAN8.js */ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/EAN8.js");

var _EAN4 = _interopRequireDefault(_EAN3);

var _EAN5 = __webpack_require__(/*! ./EAN5.js */ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/EAN5.js");

var _EAN6 = _interopRequireDefault(_EAN5);

var _EAN7 = __webpack_require__(/*! ./EAN2.js */ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/EAN2.js");

var _EAN8 = _interopRequireDefault(_EAN7);

var _UPC = __webpack_require__(/*! ./UPC.js */ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/UPC.js");

var _UPC2 = _interopRequireDefault(_UPC);

var _UPCE = __webpack_require__(/*! ./UPCE.js */ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/UPCE.js");

var _UPCE2 = _interopRequireDefault(_UPCE);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.EAN13 = _EAN2.default;
exports.EAN8 = _EAN4.default;
exports.EAN5 = _EAN6.default;
exports.EAN2 = _EAN8.default;
exports.UPC = _UPC2.default;
exports.UPCE = _UPCE2.default;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/GenericBarcode/index.js":
/*!*********************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/GenericBarcode/index.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.GenericBarcode = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Barcode2 = __webpack_require__(/*! ../Barcode.js */ "./node_modules/jsbarcode/bin/barcodes/Barcode.js");

var _Barcode3 = _interopRequireDefault(_Barcode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GenericBarcode = function (_Barcode) {
	_inherits(GenericBarcode, _Barcode);

	function GenericBarcode(data, options) {
		_classCallCheck(this, GenericBarcode);

		return _possibleConstructorReturn(this, (GenericBarcode.__proto__ || Object.getPrototypeOf(GenericBarcode)).call(this, data, options)); // Sets this.data and this.text
	}

	// Return the corresponding binary numbers for the data provided


	_createClass(GenericBarcode, [{
		key: "encode",
		value: function encode() {
			return {
				data: "10101010101010101010101010101010101010101",
				text: this.text
			};
		}

		// Resturn true/false if the string provided is valid for this encoder

	}, {
		key: "valid",
		value: function valid() {
			return true;
		}
	}]);

	return GenericBarcode;
}(_Barcode3.default);

exports.GenericBarcode = GenericBarcode;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/ITF/ITF.js":
/*!********************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/ITF/ITF.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = __webpack_require__(/*! ./constants */ "./node_modules/jsbarcode/bin/barcodes/ITF/constants.js");

var _Barcode2 = __webpack_require__(/*! ../Barcode */ "./node_modules/jsbarcode/bin/barcodes/Barcode.js");

var _Barcode3 = _interopRequireDefault(_Barcode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ITF = function (_Barcode) {
	_inherits(ITF, _Barcode);

	function ITF() {
		_classCallCheck(this, ITF);

		return _possibleConstructorReturn(this, (ITF.__proto__ || Object.getPrototypeOf(ITF)).apply(this, arguments));
	}

	_createClass(ITF, [{
		key: 'valid',
		value: function valid() {
			return this.data.search(/^([0-9]{2})+$/) !== -1;
		}
	}, {
		key: 'encode',
		value: function encode() {
			var _this2 = this;

			// Calculate all the digit pairs
			var encoded = this.data.match(/.{2}/g).map(function (pair) {
				return _this2.encodePair(pair);
			}).join('');

			return {
				data: _constants.START_BIN + encoded + _constants.END_BIN,
				text: this.text
			};
		}

		// Calculate the data of a number pair

	}, {
		key: 'encodePair',
		value: function encodePair(pair) {
			var second = _constants.BINARIES[pair[1]];

			return _constants.BINARIES[pair[0]].split('').map(function (first, idx) {
				return (first === '1' ? '111' : '1') + (second[idx] === '1' ? '000' : '0');
			}).join('');
		}
	}]);

	return ITF;
}(_Barcode3.default);

exports.default = ITF;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/ITF/ITF14.js":
/*!**********************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/ITF/ITF14.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ITF2 = __webpack_require__(/*! ./ITF */ "./node_modules/jsbarcode/bin/barcodes/ITF/ITF.js");

var _ITF3 = _interopRequireDefault(_ITF2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Calculate the checksum digit
var checksum = function checksum(data) {
	var res = data.substr(0, 13).split('').map(function (num) {
		return parseInt(num, 10);
	}).reduce(function (sum, n, idx) {
		return sum + n * (3 - idx % 2 * 2);
	}, 0);

	return Math.ceil(res / 10) * 10 - res;
};

var ITF14 = function (_ITF) {
	_inherits(ITF14, _ITF);

	function ITF14(data, options) {
		_classCallCheck(this, ITF14);

		// Add checksum if it does not exist
		if (data.search(/^[0-9]{13}$/) !== -1) {
			data += checksum(data);
		}
		return _possibleConstructorReturn(this, (ITF14.__proto__ || Object.getPrototypeOf(ITF14)).call(this, data, options));
	}

	_createClass(ITF14, [{
		key: 'valid',
		value: function valid() {
			return this.data.search(/^[0-9]{14}$/) !== -1 && +this.data[13] === checksum(this.data);
		}
	}]);

	return ITF14;
}(_ITF3.default);

exports.default = ITF14;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/ITF/constants.js":
/*!**************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/ITF/constants.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var START_BIN = exports.START_BIN = '1010';
var END_BIN = exports.END_BIN = '11101';

var BINARIES = exports.BINARIES = ['00110', '10001', '01001', '11000', '00101', '10100', '01100', '00011', '10010', '01010'];

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/ITF/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/ITF/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ITF14 = exports.ITF = undefined;

var _ITF = __webpack_require__(/*! ./ITF */ "./node_modules/jsbarcode/bin/barcodes/ITF/ITF.js");

var _ITF2 = _interopRequireDefault(_ITF);

var _ITF3 = __webpack_require__(/*! ./ITF14 */ "./node_modules/jsbarcode/bin/barcodes/ITF/ITF14.js");

var _ITF4 = _interopRequireDefault(_ITF3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.ITF = _ITF2.default;
exports.ITF14 = _ITF4.default;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/MSI/MSI.js":
/*!********************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/MSI/MSI.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Barcode2 = __webpack_require__(/*! ../Barcode.js */ "./node_modules/jsbarcode/bin/barcodes/Barcode.js");

var _Barcode3 = _interopRequireDefault(_Barcode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Encoding documentation
// https://en.wikipedia.org/wiki/MSI_Barcode#Character_set_and_binary_lookup

var MSI = function (_Barcode) {
	_inherits(MSI, _Barcode);

	function MSI(data, options) {
		_classCallCheck(this, MSI);

		return _possibleConstructorReturn(this, (MSI.__proto__ || Object.getPrototypeOf(MSI)).call(this, data, options));
	}

	_createClass(MSI, [{
		key: "encode",
		value: function encode() {
			// Start bits
			var ret = "110";

			for (var i = 0; i < this.data.length; i++) {
				// Convert the character to binary (always 4 binary digits)
				var digit = parseInt(this.data[i]);
				var bin = digit.toString(2);
				bin = addZeroes(bin, 4 - bin.length);

				// Add 100 for every zero and 110 for every 1
				for (var b = 0; b < bin.length; b++) {
					ret += bin[b] == "0" ? "100" : "110";
				}
			}

			// End bits
			ret += "1001";

			return {
				data: ret,
				text: this.text
			};
		}
	}, {
		key: "valid",
		value: function valid() {
			return this.data.search(/^[0-9]+$/) !== -1;
		}
	}]);

	return MSI;
}(_Barcode3.default);

function addZeroes(number, n) {
	for (var i = 0; i < n; i++) {
		number = "0" + number;
	}
	return number;
}

exports.default = MSI;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/MSI/MSI10.js":
/*!**********************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/MSI/MSI10.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _MSI2 = __webpack_require__(/*! ./MSI.js */ "./node_modules/jsbarcode/bin/barcodes/MSI/MSI.js");

var _MSI3 = _interopRequireDefault(_MSI2);

var _checksums = __webpack_require__(/*! ./checksums.js */ "./node_modules/jsbarcode/bin/barcodes/MSI/checksums.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MSI10 = function (_MSI) {
	_inherits(MSI10, _MSI);

	function MSI10(data, options) {
		_classCallCheck(this, MSI10);

		return _possibleConstructorReturn(this, (MSI10.__proto__ || Object.getPrototypeOf(MSI10)).call(this, data + (0, _checksums.mod10)(data), options));
	}

	return MSI10;
}(_MSI3.default);

exports.default = MSI10;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/MSI/MSI1010.js":
/*!************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/MSI/MSI1010.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _MSI2 = __webpack_require__(/*! ./MSI.js */ "./node_modules/jsbarcode/bin/barcodes/MSI/MSI.js");

var _MSI3 = _interopRequireDefault(_MSI2);

var _checksums = __webpack_require__(/*! ./checksums.js */ "./node_modules/jsbarcode/bin/barcodes/MSI/checksums.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MSI1010 = function (_MSI) {
	_inherits(MSI1010, _MSI);

	function MSI1010(data, options) {
		_classCallCheck(this, MSI1010);

		data += (0, _checksums.mod10)(data);
		data += (0, _checksums.mod10)(data);
		return _possibleConstructorReturn(this, (MSI1010.__proto__ || Object.getPrototypeOf(MSI1010)).call(this, data, options));
	}

	return MSI1010;
}(_MSI3.default);

exports.default = MSI1010;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/MSI/MSI11.js":
/*!**********************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/MSI/MSI11.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _MSI2 = __webpack_require__(/*! ./MSI.js */ "./node_modules/jsbarcode/bin/barcodes/MSI/MSI.js");

var _MSI3 = _interopRequireDefault(_MSI2);

var _checksums = __webpack_require__(/*! ./checksums.js */ "./node_modules/jsbarcode/bin/barcodes/MSI/checksums.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MSI11 = function (_MSI) {
	_inherits(MSI11, _MSI);

	function MSI11(data, options) {
		_classCallCheck(this, MSI11);

		return _possibleConstructorReturn(this, (MSI11.__proto__ || Object.getPrototypeOf(MSI11)).call(this, data + (0, _checksums.mod11)(data), options));
	}

	return MSI11;
}(_MSI3.default);

exports.default = MSI11;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/MSI/MSI1110.js":
/*!************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/MSI/MSI1110.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _MSI2 = __webpack_require__(/*! ./MSI.js */ "./node_modules/jsbarcode/bin/barcodes/MSI/MSI.js");

var _MSI3 = _interopRequireDefault(_MSI2);

var _checksums = __webpack_require__(/*! ./checksums.js */ "./node_modules/jsbarcode/bin/barcodes/MSI/checksums.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MSI1110 = function (_MSI) {
	_inherits(MSI1110, _MSI);

	function MSI1110(data, options) {
		_classCallCheck(this, MSI1110);

		data += (0, _checksums.mod11)(data);
		data += (0, _checksums.mod10)(data);
		return _possibleConstructorReturn(this, (MSI1110.__proto__ || Object.getPrototypeOf(MSI1110)).call(this, data, options));
	}

	return MSI1110;
}(_MSI3.default);

exports.default = MSI1110;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/MSI/checksums.js":
/*!**************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/MSI/checksums.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.mod10 = mod10;
exports.mod11 = mod11;
function mod10(number) {
	var sum = 0;
	for (var i = 0; i < number.length; i++) {
		var n = parseInt(number[i]);
		if ((i + number.length) % 2 === 0) {
			sum += n;
		} else {
			sum += n * 2 % 10 + Math.floor(n * 2 / 10);
		}
	}
	return (10 - sum % 10) % 10;
}

function mod11(number) {
	var sum = 0;
	var weights = [2, 3, 4, 5, 6, 7];
	for (var i = 0; i < number.length; i++) {
		var n = parseInt(number[number.length - 1 - i]);
		sum += weights[i % weights.length] * n;
	}
	return (11 - sum % 11) % 11;
}

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/MSI/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/MSI/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MSI1110 = exports.MSI1010 = exports.MSI11 = exports.MSI10 = exports.MSI = undefined;

var _MSI = __webpack_require__(/*! ./MSI.js */ "./node_modules/jsbarcode/bin/barcodes/MSI/MSI.js");

var _MSI2 = _interopRequireDefault(_MSI);

var _MSI3 = __webpack_require__(/*! ./MSI10.js */ "./node_modules/jsbarcode/bin/barcodes/MSI/MSI10.js");

var _MSI4 = _interopRequireDefault(_MSI3);

var _MSI5 = __webpack_require__(/*! ./MSI11.js */ "./node_modules/jsbarcode/bin/barcodes/MSI/MSI11.js");

var _MSI6 = _interopRequireDefault(_MSI5);

var _MSI7 = __webpack_require__(/*! ./MSI1010.js */ "./node_modules/jsbarcode/bin/barcodes/MSI/MSI1010.js");

var _MSI8 = _interopRequireDefault(_MSI7);

var _MSI9 = __webpack_require__(/*! ./MSI1110.js */ "./node_modules/jsbarcode/bin/barcodes/MSI/MSI1110.js");

var _MSI10 = _interopRequireDefault(_MSI9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.MSI = _MSI2.default;
exports.MSI10 = _MSI4.default;
exports.MSI11 = _MSI6.default;
exports.MSI1010 = _MSI8.default;
exports.MSI1110 = _MSI10.default;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/codabar/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/codabar/index.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.codabar = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Barcode2 = __webpack_require__(/*! ../Barcode.js */ "./node_modules/jsbarcode/bin/barcodes/Barcode.js");

var _Barcode3 = _interopRequireDefault(_Barcode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Encoding specification:
// http://www.barcodeisland.com/codabar.phtml

var codabar = function (_Barcode) {
	_inherits(codabar, _Barcode);

	function codabar(data, options) {
		_classCallCheck(this, codabar);

		if (data.search(/^[0-9\-\$\:\.\+\/]+$/) === 0) {
			data = "A" + data + "A";
		}

		var _this = _possibleConstructorReturn(this, (codabar.__proto__ || Object.getPrototypeOf(codabar)).call(this, data.toUpperCase(), options));

		_this.text = _this.options.text || _this.text.replace(/[A-D]/g, '');
		return _this;
	}

	_createClass(codabar, [{
		key: "valid",
		value: function valid() {
			return this.data.search(/^[A-D][0-9\-\$\:\.\+\/]+[A-D]$/) !== -1;
		}
	}, {
		key: "encode",
		value: function encode() {
			var result = [];
			var encodings = this.getEncodings();
			for (var i = 0; i < this.data.length; i++) {
				result.push(encodings[this.data.charAt(i)]);
				// for all characters except the last, append a narrow-space ("0")
				if (i !== this.data.length - 1) {
					result.push("0");
				}
			}
			return {
				text: this.text,
				data: result.join('')
			};
		}
	}, {
		key: "getEncodings",
		value: function getEncodings() {
			return {
				"0": "101010011",
				"1": "101011001",
				"2": "101001011",
				"3": "110010101",
				"4": "101101001",
				"5": "110101001",
				"6": "100101011",
				"7": "100101101",
				"8": "100110101",
				"9": "110100101",
				"-": "101001101",
				"$": "101100101",
				":": "1101011011",
				"/": "1101101011",
				".": "1101101101",
				"+": "101100110011",
				"A": "1011001001",
				"B": "1001001011",
				"C": "1010010011",
				"D": "1010011001"
			};
		}
	}]);

	return codabar;
}(_Barcode3.default);

exports.codabar = codabar;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/index.js":
/*!******************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _CODE = __webpack_require__(/*! ./CODE39/ */ "./node_modules/jsbarcode/bin/barcodes/CODE39/index.js");

var _CODE2 = __webpack_require__(/*! ./CODE128/ */ "./node_modules/jsbarcode/bin/barcodes/CODE128/index.js");

var _EAN_UPC = __webpack_require__(/*! ./EAN_UPC/ */ "./node_modules/jsbarcode/bin/barcodes/EAN_UPC/index.js");

var _ITF = __webpack_require__(/*! ./ITF/ */ "./node_modules/jsbarcode/bin/barcodes/ITF/index.js");

var _MSI = __webpack_require__(/*! ./MSI/ */ "./node_modules/jsbarcode/bin/barcodes/MSI/index.js");

var _pharmacode = __webpack_require__(/*! ./pharmacode/ */ "./node_modules/jsbarcode/bin/barcodes/pharmacode/index.js");

var _codabar = __webpack_require__(/*! ./codabar */ "./node_modules/jsbarcode/bin/barcodes/codabar/index.js");

var _GenericBarcode = __webpack_require__(/*! ./GenericBarcode/ */ "./node_modules/jsbarcode/bin/barcodes/GenericBarcode/index.js");

exports.default = {
	CODE39: _CODE.CODE39,
	CODE128: _CODE2.CODE128, CODE128A: _CODE2.CODE128A, CODE128B: _CODE2.CODE128B, CODE128C: _CODE2.CODE128C,
	EAN13: _EAN_UPC.EAN13, EAN8: _EAN_UPC.EAN8, EAN5: _EAN_UPC.EAN5, EAN2: _EAN_UPC.EAN2, UPC: _EAN_UPC.UPC, UPCE: _EAN_UPC.UPCE,
	ITF14: _ITF.ITF14,
	ITF: _ITF.ITF,
	MSI: _MSI.MSI, MSI10: _MSI.MSI10, MSI11: _MSI.MSI11, MSI1010: _MSI.MSI1010, MSI1110: _MSI.MSI1110,
	pharmacode: _pharmacode.pharmacode,
	codabar: _codabar.codabar,
	GenericBarcode: _GenericBarcode.GenericBarcode
};

/***/ }),

/***/ "./node_modules/jsbarcode/bin/barcodes/pharmacode/index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/barcodes/pharmacode/index.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.pharmacode = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Barcode2 = __webpack_require__(/*! ../Barcode.js */ "./node_modules/jsbarcode/bin/barcodes/Barcode.js");

var _Barcode3 = _interopRequireDefault(_Barcode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Encoding documentation
// http://www.gomaro.ch/ftproot/Laetus_PHARMA-CODE.pdf

var pharmacode = function (_Barcode) {
	_inherits(pharmacode, _Barcode);

	function pharmacode(data, options) {
		_classCallCheck(this, pharmacode);

		var _this = _possibleConstructorReturn(this, (pharmacode.__proto__ || Object.getPrototypeOf(pharmacode)).call(this, data, options));

		_this.number = parseInt(data, 10);
		return _this;
	}

	_createClass(pharmacode, [{
		key: "encode",
		value: function encode() {
			var z = this.number;
			var result = "";

			// http://i.imgur.com/RMm4UDJ.png
			// (source: http://www.gomaro.ch/ftproot/Laetus_PHARMA-CODE.pdf, page: 34)
			while (!isNaN(z) && z != 0) {
				if (z % 2 === 0) {
					// Even
					result = "11100" + result;
					z = (z - 2) / 2;
				} else {
					// Odd
					result = "100" + result;
					z = (z - 1) / 2;
				}
			}

			// Remove the two last zeroes
			result = result.slice(0, -2);

			return {
				data: result,
				text: this.text
			};
		}
	}, {
		key: "valid",
		value: function valid() {
			return this.number >= 3 && this.number <= 131070;
		}
	}]);

	return pharmacode;
}(_Barcode3.default);

exports.pharmacode = pharmacode;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/exceptions/ErrorHandler.js":
/*!***************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/exceptions/ErrorHandler.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*eslint no-console: 0 */

var ErrorHandler = function () {
	function ErrorHandler(api) {
		_classCallCheck(this, ErrorHandler);

		this.api = api;
	}

	_createClass(ErrorHandler, [{
		key: "handleCatch",
		value: function handleCatch(e) {
			// If babel supported extending of Error in a correct way instanceof would be used here
			if (e.name === "InvalidInputException") {
				if (this.api._options.valid !== this.api._defaults.valid) {
					this.api._options.valid(false);
				} else {
					throw e.message;
				}
			} else {
				throw e;
			}

			this.api.render = function () {};
		}
	}, {
		key: "wrapBarcodeCall",
		value: function wrapBarcodeCall(func) {
			try {
				var result = func.apply(undefined, arguments);
				this.api._options.valid(true);
				return result;
			} catch (e) {
				this.handleCatch(e);

				return this.api;
			}
		}
	}]);

	return ErrorHandler;
}();

exports.default = ErrorHandler;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/exceptions/exceptions.js":
/*!*************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/exceptions/exceptions.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InvalidInputException = function (_Error) {
	_inherits(InvalidInputException, _Error);

	function InvalidInputException(symbology, input) {
		_classCallCheck(this, InvalidInputException);

		var _this = _possibleConstructorReturn(this, (InvalidInputException.__proto__ || Object.getPrototypeOf(InvalidInputException)).call(this));

		_this.name = "InvalidInputException";

		_this.symbology = symbology;
		_this.input = input;

		_this.message = '"' + _this.input + '" is not a valid input for ' + _this.symbology;
		return _this;
	}

	return InvalidInputException;
}(Error);

var InvalidElementException = function (_Error2) {
	_inherits(InvalidElementException, _Error2);

	function InvalidElementException() {
		_classCallCheck(this, InvalidElementException);

		var _this2 = _possibleConstructorReturn(this, (InvalidElementException.__proto__ || Object.getPrototypeOf(InvalidElementException)).call(this));

		_this2.name = "InvalidElementException";
		_this2.message = "Not supported type to render on";
		return _this2;
	}

	return InvalidElementException;
}(Error);

var NoElementException = function (_Error3) {
	_inherits(NoElementException, _Error3);

	function NoElementException() {
		_classCallCheck(this, NoElementException);

		var _this3 = _possibleConstructorReturn(this, (NoElementException.__proto__ || Object.getPrototypeOf(NoElementException)).call(this));

		_this3.name = "NoElementException";
		_this3.message = "No element to render on.";
		return _this3;
	}

	return NoElementException;
}(Error);

exports.InvalidInputException = InvalidInputException;
exports.InvalidElementException = InvalidElementException;
exports.NoElementException = NoElementException;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/help/fixOptions.js":
/*!*******************************************************!*\
  !*** ./node_modules/jsbarcode/bin/help/fixOptions.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = fixOptions;


function fixOptions(options) {
	// Fix the margins
	options.marginTop = options.marginTop || options.margin;
	options.marginBottom = options.marginBottom || options.margin;
	options.marginRight = options.marginRight || options.margin;
	options.marginLeft = options.marginLeft || options.margin;

	return options;
}

/***/ }),

/***/ "./node_modules/jsbarcode/bin/help/getOptionsFromElement.js":
/*!******************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/help/getOptionsFromElement.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _optionsFromStrings = __webpack_require__(/*! ./optionsFromStrings.js */ "./node_modules/jsbarcode/bin/help/optionsFromStrings.js");

var _optionsFromStrings2 = _interopRequireDefault(_optionsFromStrings);

var _defaults = __webpack_require__(/*! ../options/defaults.js */ "./node_modules/jsbarcode/bin/options/defaults.js");

var _defaults2 = _interopRequireDefault(_defaults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getOptionsFromElement(element) {
	var options = {};
	for (var property in _defaults2.default) {
		if (_defaults2.default.hasOwnProperty(property)) {
			// jsbarcode-*
			if (element.hasAttribute("jsbarcode-" + property.toLowerCase())) {
				options[property] = element.getAttribute("jsbarcode-" + property.toLowerCase());
			}

			// data-*
			if (element.hasAttribute("data-" + property.toLowerCase())) {
				options[property] = element.getAttribute("data-" + property.toLowerCase());
			}
		}
	}

	options["value"] = element.getAttribute("jsbarcode-value") || element.getAttribute("data-value");

	// Since all atributes are string they need to be converted to integers
	options = (0, _optionsFromStrings2.default)(options);

	return options;
}

exports.default = getOptionsFromElement;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/help/getRenderProperties.js":
/*!****************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/help/getRenderProperties.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /* global HTMLImageElement */
/* global HTMLCanvasElement */
/* global SVGElement */

var _getOptionsFromElement = __webpack_require__(/*! ./getOptionsFromElement.js */ "./node_modules/jsbarcode/bin/help/getOptionsFromElement.js");

var _getOptionsFromElement2 = _interopRequireDefault(_getOptionsFromElement);

var _renderers = __webpack_require__(/*! ../renderers */ "./node_modules/jsbarcode/bin/renderers/index.js");

var _renderers2 = _interopRequireDefault(_renderers);

var _exceptions = __webpack_require__(/*! ../exceptions/exceptions.js */ "./node_modules/jsbarcode/bin/exceptions/exceptions.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Takes an element and returns an object with information about how
// it should be rendered
// This could also return an array with these objects
// {
//   element: The element that the renderer should draw on
//   renderer: The name of the renderer
//   afterRender (optional): If something has to done after the renderer
//     completed, calls afterRender (function)
//   options (optional): Options that can be defined in the element
// }

function getRenderProperties(element) {
	// If the element is a string, query select call again
	if (typeof element === "string") {
		return querySelectedRenderProperties(element);
	}
	// If element is array. Recursivly call with every object in the array
	else if (Array.isArray(element)) {
			var returnArray = [];
			for (var i = 0; i < element.length; i++) {
				returnArray.push(getRenderProperties(element[i]));
			}
			return returnArray;
		}
		// If element, render on canvas and set the uri as src
		else if (typeof HTMLCanvasElement !== 'undefined' && element instanceof HTMLImageElement) {
				return newCanvasRenderProperties(element);
			}
			// If SVG
			else if (element && element.nodeName && element.nodeName.toLowerCase() === 'svg' || typeof SVGElement !== 'undefined' && element instanceof SVGElement) {
					return {
						element: element,
						options: (0, _getOptionsFromElement2.default)(element),
						renderer: _renderers2.default.SVGRenderer
					};
				}
				// If canvas (in browser)
				else if (typeof HTMLCanvasElement !== 'undefined' && element instanceof HTMLCanvasElement) {
						return {
							element: element,
							options: (0, _getOptionsFromElement2.default)(element),
							renderer: _renderers2.default.CanvasRenderer
						};
					}
					// If canvas (in node)
					else if (element && element.getContext) {
							return {
								element: element,
								renderer: _renderers2.default.CanvasRenderer
							};
						} else if (element && (typeof element === "undefined" ? "undefined" : _typeof(element)) === 'object' && !element.nodeName) {
							return {
								element: element,
								renderer: _renderers2.default.ObjectRenderer
							};
						} else {
							throw new _exceptions.InvalidElementException();
						}
}

function querySelectedRenderProperties(string) {
	var selector = document.querySelectorAll(string);
	if (selector.length === 0) {
		return undefined;
	} else {
		var returnArray = [];
		for (var i = 0; i < selector.length; i++) {
			returnArray.push(getRenderProperties(selector[i]));
		}
		return returnArray;
	}
}

function newCanvasRenderProperties(imgElement) {
	var canvas = document.createElement('canvas');
	return {
		element: canvas,
		options: (0, _getOptionsFromElement2.default)(imgElement),
		renderer: _renderers2.default.CanvasRenderer,
		afterRender: function afterRender() {
			imgElement.setAttribute("src", canvas.toDataURL());
		}
	};
}

exports.default = getRenderProperties;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/help/linearizeEncodings.js":
/*!***************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/help/linearizeEncodings.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = linearizeEncodings;

// Encodings can be nestled like [[1-1, 1-2], 2, [3-1, 3-2]
// Convert to [1-1, 1-2, 2, 3-1, 3-2]

function linearizeEncodings(encodings) {
	var linearEncodings = [];
	function nextLevel(encoded) {
		if (Array.isArray(encoded)) {
			for (var i = 0; i < encoded.length; i++) {
				nextLevel(encoded[i]);
			}
		} else {
			encoded.text = encoded.text || "";
			encoded.data = encoded.data || "";
			linearEncodings.push(encoded);
		}
	}
	nextLevel(encodings);

	return linearEncodings;
}

/***/ }),

/***/ "./node_modules/jsbarcode/bin/help/merge.js":
/*!**************************************************!*\
  !*** ./node_modules/jsbarcode/bin/help/merge.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (old, replaceObj) {
  return _extends({}, old, replaceObj);
};

/***/ }),

/***/ "./node_modules/jsbarcode/bin/help/optionsFromStrings.js":
/*!***************************************************************!*\
  !*** ./node_modules/jsbarcode/bin/help/optionsFromStrings.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = optionsFromStrings;

// Convert string to integers/booleans where it should be

function optionsFromStrings(options) {
	var intOptions = ["width", "height", "textMargin", "fontSize", "margin", "marginTop", "marginBottom", "marginLeft", "marginRight"];

	for (var intOption in intOptions) {
		if (intOptions.hasOwnProperty(intOption)) {
			intOption = intOptions[intOption];
			if (typeof options[intOption] === "string") {
				options[intOption] = parseInt(options[intOption], 10);
			}
		}
	}

	if (typeof options["displayValue"] === "string") {
		options["displayValue"] = options["displayValue"] != "false";
	}

	return options;
}

/***/ }),

/***/ "./node_modules/jsbarcode/bin/options/defaults.js":
/*!********************************************************!*\
  !*** ./node_modules/jsbarcode/bin/options/defaults.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var defaults = {
	width: 2,
	height: 100,
	format: "auto",
	displayValue: true,
	fontOptions: "",
	font: "monospace",
	text: undefined,
	textAlign: "center",
	textPosition: "bottom",
	textMargin: 2,
	fontSize: 20,
	background: "#ffffff",
	lineColor: "#000000",
	margin: 10,
	marginTop: undefined,
	marginBottom: undefined,
	marginLeft: undefined,
	marginRight: undefined,
	valid: function valid() {}
};

exports.default = defaults;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/renderers/canvas.js":
/*!********************************************************!*\
  !*** ./node_modules/jsbarcode/bin/renderers/canvas.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _merge = __webpack_require__(/*! ../help/merge.js */ "./node_modules/jsbarcode/bin/help/merge.js");

var _merge2 = _interopRequireDefault(_merge);

var _shared = __webpack_require__(/*! ./shared.js */ "./node_modules/jsbarcode/bin/renderers/shared.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CanvasRenderer = function () {
	function CanvasRenderer(canvas, encodings, options) {
		_classCallCheck(this, CanvasRenderer);

		this.canvas = canvas;
		this.encodings = encodings;
		this.options = options;
	}

	_createClass(CanvasRenderer, [{
		key: "render",
		value: function render() {
			// Abort if the browser does not support HTML5 canvas
			if (!this.canvas.getContext) {
				throw new Error('The browser does not support canvas.');
			}

			this.prepareCanvas();
			for (var i = 0; i < this.encodings.length; i++) {
				var encodingOptions = (0, _merge2.default)(this.options, this.encodings[i].options);

				this.drawCanvasBarcode(encodingOptions, this.encodings[i]);
				this.drawCanvasText(encodingOptions, this.encodings[i]);

				this.moveCanvasDrawing(this.encodings[i]);
			}

			this.restoreCanvas();
		}
	}, {
		key: "prepareCanvas",
		value: function prepareCanvas() {
			// Get the canvas context
			var ctx = this.canvas.getContext("2d");

			ctx.save();

			(0, _shared.calculateEncodingAttributes)(this.encodings, this.options, ctx);
			var totalWidth = (0, _shared.getTotalWidthOfEncodings)(this.encodings);
			var maxHeight = (0, _shared.getMaximumHeightOfEncodings)(this.encodings);

			this.canvas.width = totalWidth + this.options.marginLeft + this.options.marginRight;

			this.canvas.height = maxHeight;

			// Paint the canvas
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			if (this.options.background) {
				ctx.fillStyle = this.options.background;
				ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			}

			ctx.translate(this.options.marginLeft, 0);
		}
	}, {
		key: "drawCanvasBarcode",
		value: function drawCanvasBarcode(options, encoding) {
			// Get the canvas context
			var ctx = this.canvas.getContext("2d");

			var binary = encoding.data;

			// Creates the barcode out of the encoded binary
			var yFrom;
			if (options.textPosition == "top") {
				yFrom = options.marginTop + options.fontSize + options.textMargin;
			} else {
				yFrom = options.marginTop;
			}

			ctx.fillStyle = options.lineColor;

			for (var b = 0; b < binary.length; b++) {
				var x = b * options.width + encoding.barcodePadding;

				if (binary[b] === "1") {
					ctx.fillRect(x, yFrom, options.width, options.height);
				} else if (binary[b]) {
					ctx.fillRect(x, yFrom, options.width, options.height * binary[b]);
				}
			}
		}
	}, {
		key: "drawCanvasText",
		value: function drawCanvasText(options, encoding) {
			// Get the canvas context
			var ctx = this.canvas.getContext("2d");

			var font = options.fontOptions + " " + options.fontSize + "px " + options.font;

			// Draw the text if displayValue is set
			if (options.displayValue) {
				var x, y;

				if (options.textPosition == "top") {
					y = options.marginTop + options.fontSize - options.textMargin;
				} else {
					y = options.height + options.textMargin + options.marginTop + options.fontSize;
				}

				ctx.font = font;

				// Draw the text in the correct X depending on the textAlign option
				if (options.textAlign == "left" || encoding.barcodePadding > 0) {
					x = 0;
					ctx.textAlign = 'left';
				} else if (options.textAlign == "right") {
					x = encoding.width - 1;
					ctx.textAlign = 'right';
				}
				// In all other cases, center the text
				else {
						x = encoding.width / 2;
						ctx.textAlign = 'center';
					}

				ctx.fillText(encoding.text, x, y);
			}
		}
	}, {
		key: "moveCanvasDrawing",
		value: function moveCanvasDrawing(encoding) {
			var ctx = this.canvas.getContext("2d");

			ctx.translate(encoding.width, 0);
		}
	}, {
		key: "restoreCanvas",
		value: function restoreCanvas() {
			// Get the canvas context
			var ctx = this.canvas.getContext("2d");

			ctx.restore();
		}
	}]);

	return CanvasRenderer;
}();

exports.default = CanvasRenderer;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/renderers/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/jsbarcode/bin/renderers/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _canvas = __webpack_require__(/*! ./canvas.js */ "./node_modules/jsbarcode/bin/renderers/canvas.js");

var _canvas2 = _interopRequireDefault(_canvas);

var _svg = __webpack_require__(/*! ./svg.js */ "./node_modules/jsbarcode/bin/renderers/svg.js");

var _svg2 = _interopRequireDefault(_svg);

var _object = __webpack_require__(/*! ./object.js */ "./node_modules/jsbarcode/bin/renderers/object.js");

var _object2 = _interopRequireDefault(_object);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = { CanvasRenderer: _canvas2.default, SVGRenderer: _svg2.default, ObjectRenderer: _object2.default };

/***/ }),

/***/ "./node_modules/jsbarcode/bin/renderers/object.js":
/*!********************************************************!*\
  !*** ./node_modules/jsbarcode/bin/renderers/object.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ObjectRenderer = function () {
	function ObjectRenderer(object, encodings, options) {
		_classCallCheck(this, ObjectRenderer);

		this.object = object;
		this.encodings = encodings;
		this.options = options;
	}

	_createClass(ObjectRenderer, [{
		key: "render",
		value: function render() {
			this.object.encodings = this.encodings;
		}
	}]);

	return ObjectRenderer;
}();

exports.default = ObjectRenderer;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/renderers/shared.js":
/*!********************************************************!*\
  !*** ./node_modules/jsbarcode/bin/renderers/shared.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getTotalWidthOfEncodings = exports.calculateEncodingAttributes = exports.getBarcodePadding = exports.getEncodingHeight = exports.getMaximumHeightOfEncodings = undefined;

var _merge = __webpack_require__(/*! ../help/merge.js */ "./node_modules/jsbarcode/bin/help/merge.js");

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getEncodingHeight(encoding, options) {
	return options.height + (options.displayValue && encoding.text.length > 0 ? options.fontSize + options.textMargin : 0) + options.marginTop + options.marginBottom;
}

function getBarcodePadding(textWidth, barcodeWidth, options) {
	if (options.displayValue && barcodeWidth < textWidth) {
		if (options.textAlign == "center") {
			return Math.floor((textWidth - barcodeWidth) / 2);
		} else if (options.textAlign == "left") {
			return 0;
		} else if (options.textAlign == "right") {
			return Math.floor(textWidth - barcodeWidth);
		}
	}
	return 0;
}

function calculateEncodingAttributes(encodings, barcodeOptions, context) {
	for (var i = 0; i < encodings.length; i++) {
		var encoding = encodings[i];
		var options = (0, _merge2.default)(barcodeOptions, encoding.options);

		// Calculate the width of the encoding
		var textWidth;
		if (options.displayValue) {
			textWidth = messureText(encoding.text, options, context);
		} else {
			textWidth = 0;
		}

		var barcodeWidth = encoding.data.length * options.width;
		encoding.width = Math.ceil(Math.max(textWidth, barcodeWidth));

		encoding.height = getEncodingHeight(encoding, options);

		encoding.barcodePadding = getBarcodePadding(textWidth, barcodeWidth, options);
	}
}

function getTotalWidthOfEncodings(encodings) {
	var totalWidth = 0;
	for (var i = 0; i < encodings.length; i++) {
		totalWidth += encodings[i].width;
	}
	return totalWidth;
}

function getMaximumHeightOfEncodings(encodings) {
	var maxHeight = 0;
	for (var i = 0; i < encodings.length; i++) {
		if (encodings[i].height > maxHeight) {
			maxHeight = encodings[i].height;
		}
	}
	return maxHeight;
}

function messureText(string, options, context) {
	var ctx;

	if (context) {
		ctx = context;
	} else if (typeof document !== "undefined") {
		ctx = document.createElement("canvas").getContext("2d");
	} else {
		// If the text cannot be messured we will return 0.
		// This will make some barcode with big text render incorrectly
		return 0;
	}
	ctx.font = options.fontOptions + " " + options.fontSize + "px " + options.font;

	// Calculate the width of the encoding
	var size = ctx.measureText(string).width;

	return size;
}

exports.getMaximumHeightOfEncodings = getMaximumHeightOfEncodings;
exports.getEncodingHeight = getEncodingHeight;
exports.getBarcodePadding = getBarcodePadding;
exports.calculateEncodingAttributes = calculateEncodingAttributes;
exports.getTotalWidthOfEncodings = getTotalWidthOfEncodings;

/***/ }),

/***/ "./node_modules/jsbarcode/bin/renderers/svg.js":
/*!*****************************************************!*\
  !*** ./node_modules/jsbarcode/bin/renderers/svg.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _merge = __webpack_require__(/*! ../help/merge.js */ "./node_modules/jsbarcode/bin/help/merge.js");

var _merge2 = _interopRequireDefault(_merge);

var _shared = __webpack_require__(/*! ./shared.js */ "./node_modules/jsbarcode/bin/renderers/shared.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var svgns = "http://www.w3.org/2000/svg";

var SVGRenderer = function () {
	function SVGRenderer(svg, encodings, options) {
		_classCallCheck(this, SVGRenderer);

		this.svg = svg;
		this.encodings = encodings;
		this.options = options;
		this.document = options.xmlDocument || document;
	}

	_createClass(SVGRenderer, [{
		key: "render",
		value: function render() {
			var currentX = this.options.marginLeft;

			this.prepareSVG();
			for (var i = 0; i < this.encodings.length; i++) {
				var encoding = this.encodings[i];
				var encodingOptions = (0, _merge2.default)(this.options, encoding.options);

				var group = this.createGroup(currentX, encodingOptions.marginTop, this.svg);

				this.setGroupOptions(group, encodingOptions);

				this.drawSvgBarcode(group, encodingOptions, encoding);
				this.drawSVGText(group, encodingOptions, encoding);

				currentX += encoding.width;
			}
		}
	}, {
		key: "prepareSVG",
		value: function prepareSVG() {
			// Clear the SVG
			while (this.svg.firstChild) {
				this.svg.removeChild(this.svg.firstChild);
			}

			(0, _shared.calculateEncodingAttributes)(this.encodings, this.options);
			var totalWidth = (0, _shared.getTotalWidthOfEncodings)(this.encodings);
			var maxHeight = (0, _shared.getMaximumHeightOfEncodings)(this.encodings);

			var width = totalWidth + this.options.marginLeft + this.options.marginRight;
			this.setSvgAttributes(width, maxHeight);

			if (this.options.background) {
				this.drawRect(0, 0, width, maxHeight, this.svg).setAttribute("style", "fill:" + this.options.background + ";");
			}
		}
	}, {
		key: "drawSvgBarcode",
		value: function drawSvgBarcode(parent, options, encoding) {
			var binary = encoding.data;

			// Creates the barcode out of the encoded binary
			var yFrom;
			if (options.textPosition == "top") {
				yFrom = options.fontSize + options.textMargin;
			} else {
				yFrom = 0;
			}

			var barWidth = 0;
			var x = 0;
			for (var b = 0; b < binary.length; b++) {
				x = b * options.width + encoding.barcodePadding;

				if (binary[b] === "1") {
					barWidth++;
				} else if (barWidth > 0) {
					this.drawRect(x - options.width * barWidth, yFrom, options.width * barWidth, options.height, parent);
					barWidth = 0;
				}
			}

			// Last draw is needed since the barcode ends with 1
			if (barWidth > 0) {
				this.drawRect(x - options.width * (barWidth - 1), yFrom, options.width * barWidth, options.height, parent);
			}
		}
	}, {
		key: "drawSVGText",
		value: function drawSVGText(parent, options, encoding) {
			var textElem = this.document.createElementNS(svgns, 'text');

			// Draw the text if displayValue is set
			if (options.displayValue) {
				var x, y;

				textElem.setAttribute("style", "font:" + options.fontOptions + " " + options.fontSize + "px " + options.font);

				if (options.textPosition == "top") {
					y = options.fontSize - options.textMargin;
				} else {
					y = options.height + options.textMargin + options.fontSize;
				}

				// Draw the text in the correct X depending on the textAlign option
				if (options.textAlign == "left" || encoding.barcodePadding > 0) {
					x = 0;
					textElem.setAttribute("text-anchor", "start");
				} else if (options.textAlign == "right") {
					x = encoding.width - 1;
					textElem.setAttribute("text-anchor", "end");
				}
				// In all other cases, center the text
				else {
						x = encoding.width / 2;
						textElem.setAttribute("text-anchor", "middle");
					}

				textElem.setAttribute("x", x);
				textElem.setAttribute("y", y);

				textElem.appendChild(this.document.createTextNode(encoding.text));

				parent.appendChild(textElem);
			}
		}
	}, {
		key: "setSvgAttributes",
		value: function setSvgAttributes(width, height) {
			var svg = this.svg;
			svg.setAttribute("width", width + "px");
			svg.setAttribute("height", height + "px");
			svg.setAttribute("x", "0px");
			svg.setAttribute("y", "0px");
			svg.setAttribute("viewBox", "0 0 " + width + " " + height);

			svg.setAttribute("xmlns", svgns);
			svg.setAttribute("version", "1.1");

			svg.setAttribute("style", "transform: translate(0,0)");
		}
	}, {
		key: "createGroup",
		value: function createGroup(x, y, parent) {
			var group = this.document.createElementNS(svgns, 'g');
			group.setAttribute("transform", "translate(" + x + ", " + y + ")");

			parent.appendChild(group);

			return group;
		}
	}, {
		key: "setGroupOptions",
		value: function setGroupOptions(group, options) {
			group.setAttribute("style", "fill:" + options.lineColor + ";");
		}
	}, {
		key: "drawRect",
		value: function drawRect(x, y, width, height, parent) {
			var rect = this.document.createElementNS(svgns, 'rect');

			rect.setAttribute("x", x);
			rect.setAttribute("y", y);
			rect.setAttribute("width", width);
			rect.setAttribute("height", height);

			parent.appendChild(rect);

			return rect;
		}
	}]);

	return SVGRenderer;
}();

exports.default = SVGRenderer;

/***/ }),

/***/ "./node_modules/ngx-barcode/index.js":
/*!*******************************************!*\
  !*** ./node_modules/ngx-barcode/index.js ***!
  \*******************************************/
/*! exports provided: NgxBarcodeModule, NgxBarcodeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NgxBarcodeModule", function() { return NgxBarcodeModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NgxBarcodeComponent", function() { return NgxBarcodeComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var /** @type {?} */ jsbarcode = __webpack_require__(/*! jsbarcode */ "./node_modules/jsbarcode/bin/JsBarcode.js");
var NgxBarcodeComponent = /** @class */ (function () {
    /**
     * @param {?} renderer
     */
    function NgxBarcodeComponent(renderer) {
        this.renderer = renderer;
        this.elementType = 'svg';
        this.cssClass = 'barcode'; // this should be done more elegantly
        this.format = 'CODE128';
        this.lineColor = '#000000';
        this.width = 2;
        this.height = 100;
        this.displayValue = false;
        this.fontOptions = '';
        this.font = 'monospace';
        this.textAlign = 'center';
        this.textPosition = 'bottom';
        this.textMargin = 2;
        this.fontSize = 20;
        this.background = '#ffffff';
        this.margin = 10;
        this.marginTop = 10;
        this.marginBottom = 10;
        this.marginLeft = 10;
        this.marginRight = 10;
        this.value = '';
        this.valid = function () { return true; };
    }
    Object.defineProperty(NgxBarcodeComponent.prototype, "options", {
        /**
         * @return {?}
         */
        get: function () {
            return {
                format: this.format,
                lineColor: this.lineColor,
                width: this.width,
                height: this.height,
                displayValue: this.displayValue,
                fontOptions: this.fontOptions,
                font: this.font,
                textAlign: this.textAlign,
                textPosition: this.textPosition,
                textMargin: this.textMargin,
                fontSize: this.fontSize,
                background: this.background,
                margin: this.margin,
                marginTop: this.marginTop,
                marginBottom: this.marginBottom,
                marginLeft: this.marginLeft,
                marginRight: this.marginRight,
                valid: this.valid,
            };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    NgxBarcodeComponent.prototype.ngOnChanges = function () {
        this.createBarcode();
    };
    /**
     * @return {?}
     */
    NgxBarcodeComponent.prototype.createBarcode = function () {
        if (!this.value) {
            return;
        }
        var /** @type {?} */ element;
        switch (this.elementType) {
            case 'img':
                element = this.renderer.createElement('img');
                break;
            case 'canvas':
                element = this.renderer.createElement('canvas');
                break;
            case 'svg':
            default:
                element = this.renderer.createElement('svg', 'svg');
        }
        jsbarcode(element, this.value, this.options);
        for (var _i = 0, _a = this.bcElement.nativeElement.childNodes; _i < _a.length; _i++) {
            var node = _a[_i];
            this.renderer.removeChild(this.bcElement.nativeElement, node);
        }
        this.renderer.appendChild(this.bcElement.nativeElement, element);
    };
    NgxBarcodeComponent.decorators = [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"], args: [{
                    selector: 'ngx-barcode',
                    template: "<div #bcElement [class]=\"cssClass\"></div>",
                    styles: []
                },] },
    ];
    /**
     * @nocollapse
     */
    NgxBarcodeComponent.ctorParameters = function () { return [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Renderer2"], },
    ]; };
    NgxBarcodeComponent.propDecorators = {
        'elementType': [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"], args: ['bc-element-type',] },],
        'cssClass': [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"], args: ['bc-class',] },],
        'format': [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"], args: ['bc-format',] },],
        'lineColor': [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"], args: ['bc-line-color',] },],
        'width': [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"], args: ['bc-width',] },],
        'height': [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"], args: ['bc-height',] },],
        'displayValue': [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"], args: ['bc-display-value',] },],
        'fontOptions': [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"], args: ['bc-font-options',] },],
        'font': [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"], args: ['bc-font',] },],
        'textAlign': [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"], args: ['bc-text-align',] },],
        'textPosition': [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"], args: ['bc-text-position',] },],
        'textMargin': [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"], args: ['bc-text-margin',] },],
        'fontSize': [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"], args: ['bc-font-size',] },],
        'background': [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"], args: ['bc-background',] },],
        'margin': [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"], args: ['bc-margin',] },],
        'marginTop': [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"], args: ['bc-margin-top',] },],
        'marginBottom': [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"], args: ['bc-margin-bottom',] },],
        'marginLeft': [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"], args: ['bc-margin-left',] },],
        'marginRight': [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"], args: ['bc-margin-right',] },],
        'value': [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"], args: ['bc-value',] },],
        'bcElement': [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"], args: ['bcElement', /** @type {?} */ ({ static: true }),] },],
        'valid': [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"], args: ['bc-valid',] },],
    };
    return NgxBarcodeComponent;
}());

var NgxBarcodeModule = /** @class */ (function () {
    function NgxBarcodeModule() {
    }
    /**
     * @return {?}
     */
    NgxBarcodeModule.forRoot = function () {
        return {
            ngModule: NgxBarcodeModule,
            providers: []
        };
    };
    NgxBarcodeModule.decorators = [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"], args: [{
                    imports: [],
                    declarations: [
                        NgxBarcodeComponent,
                    ],
                    exports: [
                        NgxBarcodeComponent,
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    NgxBarcodeModule.ctorParameters = function () { return []; };
    return NgxBarcodeModule;
}());




/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/teriazh/page1/page1.component.html":
/*!******************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/teriazh/page1/page1.component.html ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<style>\n      .line{\n    height: 1px;\n        background-color: #fcb103\n    }\n    .btnCustome{\n        padding-right:8px !important;\n        padding-left: 8px !important;\n        padding-top: 3px!important;\n        padding-bottom: 3px!important;\n        border: 1px solid;\n        font-size:14px;\n        background-color:#fcb103 ;\n        color: white;\n    }\n    .btnW{\n        padding-right:20px !important;\n        padding-left: 20px !important;\n        padding-top: 3px!important;\n        padding-bottom: 3px!important;\n        border: 1px solid;\n        font-size:14px;\n        background-color:#fcb103 ;\n        color: white;\n\n    }\n    .pos{\n        top: 0;\n        left: 0;\n        transform: translateY(-50%);\n        background-color: #F5F7FA;\n\n    }\n    .Customborder{\n        border: 2px solid #009da0 ;\n    }\n    .form-group{\n        margin-bottom: 1px !important;\n    } \n    .marT{\n        margin-top: 15px;\n    }\n    .header{\n        background-color: #063d78;\n        color: white;\n        padding-top: 5px;\n        padding-bottom: 5px;\n    }\n    .hide{ \n        display: none;\n    }\n    .checkSize{\n        width: 20px;\n        height: 20px;\n    }\n    /*table th {*/\n        /*background-color: #48d9fa;*/\n\n    /*}*/\n      thead{\n          background-color: #63a4ff;\n          background-image: linear-gradient(315deg, #63a4ff 0%, #83eaf1 74%);\n      }\n\n    table{\n        text-align: center;\n    }\n    .inValidBorder{\n        border:1px solid red;\n    }\n      .red{\n          color: white;!important;\n          background-color: #990000;\n          background-image: linear-gradient(147deg, #990000 0%, #ff0000 74%);\n      }\n      .Orange{\n          background-color: #f5d020;\n          background-image: linear-gradient(315deg, #f5d020 0%, #f53803 74%);\n          color: white;!important;\n      }\n      .Yellow{\n          background-color: #fbb034;\n          background-image: linear-gradient(315deg, #fbb034 0%, #ffdd00 74%);\n      }\n      .green{\n          background-color: #d3d3d3;\n          background-image: linear-gradient(315deg, #d3d3d3 0%, #2bc96d 74%);\n\n          color: white;!important;\n      }\n      .blue{\n          background-color: #06bcfb;\n          background-image: linear-gradient(315deg, #06bcfb 0%, #4884ee 74%);\n          color: white;!important;\n      }\n</style>\n\n    <div class=\"container-fluid\">\n        <div class=\"row mt-2\">\n\n                <table class=\"table table-bordered table-hover\" style=\"font-size: 15px;font-family: iransans\">\n                    <thead >\n                    <tr>\n                        <th scope=\"col\">ردیف</th>\n                        <th scope=\"col\">کد تریاژ</th>\n                        <th scope=\"col\">نام  </th>\n                        <th scope=\"col\">  نام خانوادگی  </th>\n                        <th scope=\"col\">تاریخ تراژ </th>\n                        <th scope=\"col\">وضعیت تریاژ </th>\n                        <th scope=\"col\">تاریخ تولد </th>\n                        <th scope=\"col\">سطح تریاژ </th>\n                        <th scope=\"col\">نحوه مراجعه</th>\n                        <th scope=\"col\">تریاژ کننده</th>\n                        <th scope=\"col\">نحوه خروج</th>\n                        <th scope=\"col\">تاریخ پایان تریاژ </th>\n                        <th scope=\"col\"> شتاسه مراجعه متصل </th>\n                    </tr>\n\n                    </thead>\n                    <tbody  *ngFor=\"let item of result;let i =index\">\n                    <tr (dblclick)=getDatail(item.id)>\n                        <td scope=\"row\">{{i+1}}</td>\n                        <td>{{item.id}}</td>\n                        <td>{{item.firstName}}   </td>\n                        <td> {{item.lastName}} </td>\n                        <td>{{item.entranceTime}}</td>\n                        <td><span *ngIf=\"item.exitTime==null\">باز</span>\n                            <span *ngIf=\"item.exitTime!=null\">بسته</span>\n                        </td>\n                        <td>{{item.birthDate}}</td>\n                        <td [ngClass]=\"{'red':item.triageLevelIS==='1','Orange':item.triageLevelIS==='2','Yellow':item.triageLevelIS==='3','blue':item.triageLevelIS==='4','green':item.triageLevelIS==='5'}\">{{item.triageLevelIS}}</td>\n                        <td><span *ngFor=\"let x of transportList\">\n                        <span *ngIf=\"x.Key==item.arrival_Transport\">{{x.Value}}</span>\n                    </span></td>\n                        <td>{{item.triagePracName}}</td>\n                        <td>  <span *ngFor=\"let x of DepartureList\"><span *ngIf=\"x.Key==item.departure\">{{x.Value}}</span></span></td>\n                        <td>{{item.resultTime}}</td>\n                        <td>{{item.encounterID}}</td>\n                    </tr>\n                    </tbody>\n                </table>\n        </div>\n    </div>\n        <ng-template #content let-c=\"close\" let-d=\"dismiss\" style=\"direction: rtl !important;font-family: iransans\">\n            <form action=\"\" [formGroup]=\"signupForm\" (ngSubmit)=\"onSubmit()\">\n                <div class=\"modal-header \" style=\"direction: rtl; background-color: #63a4ff;\nbackground-image: linear-gradient(315deg, #63a4ff 0%, #83eaf1 74%);\" >\n                    <h4 class=\"modal-title white\" >جستجو </h4>\n                  </div>\n                  <div class=\"modal-body\" id=\"kbModal-body\" style=\"font-family: iransans\">\n                      <div class=\"row mt-1\">\n                              <div class=\"col-12 form-inline mb-2\"style=\"direction: rtl;font-size: 20px;font-family: iransans\"  >\n                                  <label for=\"\" class=\"ml-2 mt-1 text-bold-700\" style=\"font-family: iransans\" >کد تریاژ</label>\n                                  <input type=\"text\" class=\"form-control \" formControlName=\"teriazhID\">\n                              </div>\n                          <div class=\"col-12  \" style=\"padding: 0!important;margin: 0!important;\">\n                              <div class=\"header\">\n                                  <h5 style=\"text-align: center;\">\n                                    مشخصات فردی بیمار\n                                </h5>\n                          </div>\n                          </div>\n                      </div>\n                      <div class=\"row mt-1\">\n                          <div class=\"col-12\" style=\"text-align: right;direction: rtl;\">\n                                  <div class=\"form-inline\">\n                                      <div class=\"form-inline col-6\">\n                                          <label for=\"name\"   style=\"font-size: 15px;\" class=\"ml-1 font-weight-bold\"> نام بیمار</label>\n                                          <input type=\"text\" id=\"name\" class=\"form-control\" name=\"name\" formControlName=\"firstName\">\n                                      </div>\n                                      <div class=\" form-inline col-6\">\n                                          <label for=\"name\" class=\"ml-1 font-weight-bold\" style=\"font-size: 15px;\"> نام خانوادگی</label>\n                                          <input type=\"text\" id=\"name\" class=\"form-control\"  formControlName=\"LastName\" >                             \n                                      </div>\n                                  </div>\n                          </div>\n                      </div>\n                      <div class=\"row mt-1\">\n                          <div class=\"col-12 \" style=\"direction:rtl\">\n                              <div class=\"form-inline  \">\n                                  <div class=\" form-inline col-6 \">\n                                      <label for=\"\" class=\"font-weight-bold\" style=\"font-size: 15px;\">از سن بیمار </label>\n                                      <input type=\"text\" class=\"ml-1\" style=\"width: 60px\"  formControlName=\"fromAge\">\n                                      <select name=\"\" id=\"\">\n                                          <option value=\"\" *ngFor=\"let i of ageTypeLst\">{{i.Value}}</option>\n                                      </select>\n                                  </div>\n                                  <div class=\"form-inline col-6   \">\n                                      <label for=\"\" class=\"font-weight-bold\"  style=\"font-size: 15px;\">تا سن بیمار </label>\n                                      <input type=\"text\" class=\"ml-1\" style=\"width: 60px\" formControlName=\"toAge\">\n                                      <select name=\"\" id=\"\">\n                                          <option value=\"\"*ngFor=\"let i of ageTypeLst\">{{i.Value}}</option>\n                                      </select>\n                                 \n                                     \n                                  </div>\n                                  </div>\n                          </div>\n                      </div>\n                      <div class=\"row mt-1\">\n                          <div class=\"col-12 \" style=\"padding: 0!important;margin: 0!important;\">\n                              <div class=\"header\">\n                                  <h5 style=\"text-align: center;\">\n                                    مشخصات مراجعه به تریاژ \n                                </h5>\n                          </div>\n                          </div>\n                      </div>\n                      <div class=\"row mt-1\">\n                          <div class=\"col-12 d-flex\" style=\"direction: rtl;\">\n                              <div class=\"col-6\">\n                                  <div class=\"col-12\" style=\"display:block;\">\n                                      <label for=\"\" class=\"ml-1 font-weight-bold\" style=\"font-size: 15px;text-align: right;display: block;\">از تاریخ تریاژ</label>\n          \n                                  </div>\n                                  <div class=\"col-10 \"  >\n                                      <div [ngClass]=\"{'inValidBorder': dateObject1===''}\">\n                                        <dp-date-picker\n                                       \n                                        dir=\"rtl\"\n                                        formControlName=\"fromDate\"\n                                        mode=\"day\"\n                                        placeholder=\"تاریخ\"\n                                        [(ngModel)]=\"dateObject1\"\n                                        theme=\"dp-material\">\n                                </dp-date-picker>\n                                      </div>\n                                 \n                                  </div>\n                               \n                              </div>\n                              <div class=\"col-6\">\n                                  <div class=\"col-12\">\n                                      <label for=\"\" class=\"ml-1 font-weight-bold\" style=\"font-size: 15px;display: block;text-align: right;\">تا تاریخ تریاژ</label>\n          \n                                  </div>\n                                  <div class=\"col-10\">\n                                      <div [ngClass]=\"{'inValidBorder': dateObject===''}\" >\n                                        <dp-date-picker\n                                        dir=\"rtl\"\n                                        formControlName=\"toDate\"\n                                        [(ngModel)]=\"dateObject\"\n                                        mode=\"day\"\n                                        placeholder=\"تاریخ\"\n                                        theme=\"dp-material\">\n                                </dp-date-picker>\n                                      </div>\n                                 \n                                  </div>\n                                \n                              </div>\n                          </div>  \n                      </div>\n                  \n                      <div class=\"row mt-1\">\n                          <div class=\"col-12 d-flex\" style=\"direction: rtl;\">\n                              <div class=\"col-6 \" >\n                                  <div class=\"col-12\" style=\"direction: rtl;text-align: right;\"> \n                                      <label for=\"\" class=\"ml-1 font-weight-bold\" style=\"font-size: 15px;\">نحوه ورود   </label>\n                                  </div>\n                                 \n                                  <div class=\"col-10\">\n                                      <select name=\"\" id=\"\" class=\"form-control\"  formControlName=\"entrnaceType\">\n                                          \n                                          <option [value]=\"i.Key\" *ngFor=\"let i of EntranceTypeList\"  >{{i.Value}}</option>\n                                          \n                                     </select>\n                                  </div>\n                           \n                              </div>\n                              <div class=\"col-6 \" >\n                                  <div class=\"col-12\" style=\"direction: rtl; text-align: right;\"> \n                                      <label for=\"\" class=\"ml-1 font-weight-bold \" style=\"font-size: 15px;\">نحوه خروج   </label>\n                                  </div>\n                                  <div class=\"col-10\">\n                                      <select name=\"\" id=\"\" class=\"form-control\" formControlName=\"departure\">\n                                          <option *ngFor='let i of DepartureList' [value]=\"i.Key\">   \n                                            {{i.Value}}\n                                          </option>\n                             \n                                     </select>\n                                  </div>\n                           \n                              </div>\n                          </div>  \n                      </div>\n                      <div class=\"row mt-1\">\n                          <div class=\"col-12 d-flex\" style=\"direction: rtl;\">\n                              <div class=\"col-6 \" >\n                                  <div class=\"col-12\" style=\"direction: rtl;text-align: right;\"> \n                                      <label for=\"\" class=\"ml-1 font-weight-bold \" style=\"font-size: 15px; \">دلیل مراجعه    </label>\n                                  </div>\n                                  <div class=\"col-10\"  >\n                                      <select name=\"\" id=\"\" class=\"form-control\" formControlName=\"admissionKind\">\n                                          <option   [value]=\"i.id\" *ngFor=\"let i of AdmissionKindList\" >{{i.admissionKindValue}}   </option>\n                                     </select>\n                                  </div>\n                              </div>\n                              <div class=\"col-6 \" >\n                                  <div class=\"col-12\" style=\"direction: rtl;text-align: right;\"> \n                                      <label for=\"\" class=\"ml-1 font-weight-bold \" style=\"font-size: 15px;\">  شکایت اصلی    </label>\n                                  </div>\n                                  <div class=\"col-10\">\n                                      <select name=\"\" id=\"\" class=\"form-control\"   >\n                                          <option  *ngFor=\"let i of MainDiseaseList\" >\n                                              {{i.mainDiseaseValue}}  \n                                          </option>\n                                         \n                                     </select>\n                                  </div>\n                              </div>\n                          </div>  \n                      </div>\n                      <div class=\"row mt-1\">\n                          <div class=\"col-12 d-flex\" style=\"direction: rtl;\">\n                              <div class=\"col-6 \" >\n                                  <div class=\"col-12\" style=\"direction: rtl;text-align: right;\"> \n                                      <label for=\"\" class=\"ml-1 font-weight-bold \" style=\"font-size: 15px;\">تریاژکننده     </label>\n                                  </div>\n                                  <div class=\"col-10\">\n                                      <select name=\"\" id=\"\" class=\"form-control\" formControlName=\"prac\">\n                                          <option value=\"\">                     یک    \n                                          </option>\n                                          <option value=\"\">                          دو \n                                          </option>\n                                     </select>    \n                              </div>\n                            </div>\n\n                            <div class=\"col-6\">\n                                <div class=\"col-12\" style=\"direction: rtl;text-align: right;\"> \n                                    <label for=\"\" class=\"ml-1 font-weight-bold \" style=\"font-size: 15px;\">سطح تریاژ     </label>\n                                </div>\n                                <div class=\"col-10\">\n                                    <select name=\"\" id=\"\" class=\"form-control\" formControlName=\"triageLevel\"> \n                            <option [value]=\"i.Key\" *ngFor=\"let i of TriageLevelList\">{{i.Value}} </option>\n                                   </select>    \n                            </div>\n                            </div>\n                              </div>\n                          </div>  \n                      </div>\n                  \n                  <div class=\"modal-footer\">\n                    <button type=\"button\" class=\"btn btn-info btn-raised\" (click)=\"c('Close click')\">بستن</button>\n                    <button type=\"button\" class=\"btn btn-outline-primary border ml-1\" (click)=\"onSubmit()\" [disabled]=\"signupForm.status==='INVALID'\"  >  جستجو</button>\n                    <button type=\"button\" class=\"btn btn-outline-primary border ml-1\" (click)=\"resetList($event)\" (click)=\"resetList()\" >پیش فرض  </button>\n                  </div>\n                 \n            </form>\n     \n          </ng-template>\n    \n    \n\n\n\n\n\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/teriazh/page2/page2.component.html":
/*!******************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/teriazh/page2/page2.component.html ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<style>\n    .line{\n    height: 1px;\n        background-color: #fcb103\n    }\n    .btnCustome{\n        padding-right:8px !important;\n        padding-left: 8px !important;\n        padding-top: 3px!important;\n        padding-bottom: 3px!important;\n        border: 1px solid;\n        font-size:14px;\n        background-color:#fcb103 ;\n        color: white;\n    }\n    .btnW{\n        padding-right:20px !important;\n        padding-left: 20px !important;\n        padding-top: 3px!important;\n        padding-bottom: 3px!important;\n        border: 1px solid;\n        font-size:14px;\n        background-color:#fcb103 ;\n        color: white;\n\n    }\n    .pos{\n        top: 0;\n        left: 0;\n        transform: translateY(-50%);\n        background-color: #F5F7FA;\n\n    }\n    .Customborder{\n        border: 2px solid #009da0 ;\n    }\n    .form-group{\n        margin-bottom: 1px !important;\n    } \n    .marT{\n        margin-top: 15px;\n    }\n    .header{\n        background-color: #063d78;\n        color: white;\n        padding-top: 5px;\n        padding-bottom: 5px;\n        display: flex;\n        justify-content: space-between;\n    }\n    .header h5{\n        margin-top: 5px;\n        margin-left: 10px;\n        margin-right: 10px;\n    }\n    .hide{ \n        display: none;\n    }\n    .checkSize{\n        width: 20px;\n        height: 20px;\n    }\n    ul li{\n        list-style: none;\n    }\n    .CircleBtn{\n        border-radius: 50%;\n    }\n    .green {\n        color: white !important;\n        background-color: #44b5b7!important;\n    }\n.red {\n    background-color: transparent;\n}\n    .boxShadowSuccess{\n        -webkit-transition: all 0.30s ease-in-out;\n        -moz-transition: all 0.30s ease-in-out;\n        -ms-transition: all 0.30s ease-in-out;\n        -o-transition: all 0.30s ease-in-out;\n        outline: none;\n        padding: 3px 0px 3px 3px;\n        margin: 5px 1px 3px 0px;\n        border: 2px solid #0ABC76;\n    }\n    .active{\n        background-color: #10E8F3;\n    }\n\n\n.btn{\n    border: 1px solid;\n    background-color: white;\n}\n</style>\n<form action=\"\"  [formGroup]=\"triageForm\"  (ngSubmit)=\"onSubmit()\">\n\n    <div class=\"container-fluid\"  style=\"font-family: iransans, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;padding: 5px\">\n            <div style=\"border: 1px solid #b3b0af;background-color: #f2f2f2;\" class=\"mt-1\">\n                <div class=\"header\">\n                        <h5 >مشخصات بیمار</h5>\n                    <h5>Patient Information</h5>\n                </div>\n                <div action=\"\" style=\"padding:10px\" >\n                    <div class=\"row mt-2\" >\n                        <div class=\" col-12 \" style=\"text-align: right;\">\n                            <input type=\"checkbox\" class=\"checkSize\" id=\"\" value=\"\"   (click)=\"disable()\" formControlName=\"patientIsNotIdentity\">\n                            <label for=\"\" style=\"font-size: 20px;\" class=\"font-weight-bold\"   >مجهول الهویه</label>\n                        </div>\n                    </div>\n                </div>\n            <div class=\"row form-group mt-1\">\n                <div class=\"col-12  \"  >\n                    <div action=\"\" class=\"d-flex justify-content-between  \"  >\n                        <div class=\"form-group col-2   \" style=\"text-align: right\"   >\n                            <label for=\"\" style=\"font-size: 15px; text-align: right\"   class=\"font-weight-bold\">\n                                <span style=\"font-size: 1.2rem;color: red\" *ngIf=\"firstnameValid===false\"> *</span>\n\n                                نام\n                            </label>\n                        <div class=\"form-group \">\n                            <input type=\"text\" [readonly]='isDisable' [(ngModel)]=\"firstname\" [value]=\"firstname\"   (input)=\"setfirst($event)\" class=\"form-control \" autocomplete=\"off\" id=\"\" formControlName=\"name\" >\n                        </div>\n                    </div>\n                        <div class=\"form-group col-2 \" style=\"text-align: right\" >\n                            <label for=\"\" style=\"font-size: 15px;\" class=\"font-weight-bold\">\n                                <span style=\"font-size: 1.2rem;color: red\" *ngIf=\"lastNameValid===false\"> *</span>\n                                نام خانوادگی</label>\n                        <div class=\"form-group \">\n                            <input type=\"text\" [readonly]=\"isDisable\" [(ngModel)]=\"Lastname\" [value]=\"Lastname\" class=\"form-control \" (input)=\"setLastName($event)\" autocomplete=\"off\" value=\"\" formControlName=\"lastName\">\n                        </div>\n                    </div>\n                        <div class=\"form-group col-2 \" style=\"text-align: right\">\n                            <label for=\"\" style=\"font-size: 15px;\" class=\"font-weight-bold\">\n                                <span style=\"font-size: 1.2rem;color: red\" *ngIf=\"DateValid===false\"> *</span>\n                                تاریخ تولد</label>\n                      \n                        <div class=\" col-12 \">\n                            <dp-date-picker\n                            dir=\"rtl\"\n                            formControlName=\"birthDate\"\n                            [(ngModel)]=\"birthDatepatient\"\n                            mode=\"day\"\n                            class=\"form-control\"\n                            placeholder=\"تاریخ\"\n                            theme=\"dp-material\" [disabled]='isDisable' (onChange)=\"getbirthDate($event)\">\n                    </dp-date-picker>\n\n                        </div>\n                    </div>\n                        <div class=\"form-group col-2 \" style=\"text-align: right\">\n                            <label for=\"\" style=\"font-size: 15px;\" class=\"font-weight-bold\" >   کد ملی</label>\n                        \n                        <div class=\"form-group \">\n                            <input type=\"text\" [readonly]='isDisable' (input)=\"setNationalCOde($event)\" [(ngModel)]=\"nationalCode\" autocomplete=\"off\" MAXLENGTH=\"10\" class=\"form-control \" id=\"\" value=\"\" formControlName=\"nationalCode\" >\n                        </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <div class=\"row form-group mt-3\">\n                <div class=\"col-12\">\n                <div class=\"col-12\">\n                    <div action=\"\" class=\"form-inline\">\n                        <div class=\"form-group\">\n                            <label for=\"\" style=\"font-size: 15px;\" class=\"font-weight-bold\" > جنسیت<span style=\"color: red;font-size: 1.2rem\"  *ngIf=\"validGender===false\">*</span></label>\n                        </div>\n                        <div class=\"form-group col-2\" ngDefaultControl formControlName=\"gender\">\n\n                                <button type=\"button\"   *ngFor=\"let i of genderList;let y = index\" [style.background-color]=\"i.BackgroundColour\" [style.color]=\"i.color\"   (click)=\"getGenderType(i.Key,i)\" class=\"btn \" >{{i.Value}}\n                                </button>\n\n\n\n\n                          \n                        </div>\n                                <div style=\"display: flex;\" *ngIf=\"isShown\">\n                                    <div class=\"form-group\" >\n                                        <label for=\"\" style=\"font-size: 15px;\" class=\"font-weight-bold\" ngDefaultControl formControlName=\"pregmentType\" >وضعیت بارداری</label>\n                                    </div>\n                                   \n                                        <button type=\"button\" class=\"btn \" [style.background-color]=\"i.BackgroundColour\" [style.color]=\"i.color\" *ngFor=\"let i of pragnentList\" (click)=\"getPregmentType(i.Key,i)\">{{i.Value}}</button>\n                                </div>\n                        <div class=\"form-group  \" style=\"margin-right: 10px;\">\n                            <label for=\"\" style=\"font-size: 15px;\" class=\"font-weight-bold\" >سن   <span style=\"color: red;font-size: 1.2rem\"  *ngIf=\"validAge===false\">*</span></label>\n                            <input type=\"number\" style=\"width: 100px;text-align: center \" [(ngModel)]=\"age\" (input)=\"setage($event)\" name=\"age\"  formControlName=\"age\"  autocomplete=\"off\" min=\"0\">\n                        </div>\n                        <div class=\"form-group col-3\"  >\n                            <button type=\"button\" class=\"btn \"   ngDefaultControl formControlName=\"ageType\" *ngFor=\"let i of ageTypeLst\"  [style.background-color]=\"i.BackgroundColour\" [style.color]=\"i.color\" (click)=\"sendData(i.Key,i)\">{{i.Value}}  </button>\n                            <span style=\"color: red;font-size: 1.2rem\" *ngIf=\"ageTypeValid===false\">\n                                *\n                            </span>\n                        </div>\n\n                    </div>\n                </div>\n            </div>\n            </div>\n            <div style=\"border: 1px solid #b3b0af; background-color: #f2f2f2;\">\n                <div class=\"header\">\n                        <h5 style=\"text-align: center;\"> مراجعه</h5>\n                    <h5 style=\"text-align: center;\"> Arrival Information</h5>\n                </div>\n            <div class=\"row form-group mt-1\">\n                <div class=\"col-12 \" >\n                    <div action=\"\" class=\"form-inline\">\n                        <div class=\"form-group\">\n                            <label for=\"\" style=\"font-size: 15px;\" class=\"font-weight-bold\" >نحوه مراجعه  <span style=\"color: red;font-size: 1.2rem\" *ngIf=\"validTranspoerter===false\">\n                                *\n                            </span></label>\n                        </div>\n                            <div class=\"form-group col-10\" ngDefaultControl  formControlName=\"TransportList\" >\n                                <button  *ngFor=\"let i of transportList\" [style.background-color]=\"i.BackgroundColour\" [style.color]=\"i.color\" type=\"button\" class=\"btn \" (click)=\"getTransportType(i.Key,i)\"> {{i.Value}}</button>\n                            </div>\n                        </div>\n                </div>\n            </div>\n            <div class=\"row form-group mt-3\">\n                <div class=\"col-12\">\n                    <div action=\"\" class=\"form-inline\">\n                        <div class=\"form-group \">\n                            <label for=\"\" style=\"font-size: 15px;\" class=\"font-weight-bold\" >\n                                 <span style=\"color: red;font-size: 1.2rem\" *ngIf=\"validEnterance===false\">\n                                *\n                            </span>\n                                نحوه ورود\n\n                            </label>\n                        </div>\n                        <div class=\"form-group col-4\" ngDefaultControl formControlName=\"entrnaceType\">\n                            <button type=\"button\"  [style.background-color]=\"i.BackgroundColour\" [style.color]=\"i.color\"  class=\"btn \" *ngFor=\"let i of EntranceList; let y = index\" (click)=\"getEntrnaceType(i.Key,i)\"  >\n                                 {{i.Value}}\n                            </button>            \n                        </div>\n                        <div class=\"form-group \">\n                            <label for=\"\" style=\"font-size: 15px;\" class=\"font-weight-bold\" >\n\n                                مراجعه در 24 ساعت گذشته</label>\n                        </div>\n                        <div class=\"form-group col-4\" ngDefaultControl formControlName=\"lastDay\">\n                            <button [style.background-color]=\"i.BackgroundColour\" [style.color]=\"i.color\" type=\"button\" class=\"btn \" *ngFor=\"let i of Encounter24HoursAgoList\" (click)=\"getLastDayType(i.Key,i)\"  value=\"\" > {{i.Value}}</button>\n                          \n                        </div>\n                    </div>\n\n                \n                    <div class=\"row form-group\">\n                        <div class=\"col-12 mt-3 d-flex \">\n                            <div class=\"col-6\">\n                                <div action=\"\" class=\"form-inline \">\n                                    <div class=\"form-group \">\n                                        <label for=\"\" style=\"font-size: 15px;\" class=\"font-weight-bold mt-1\" ngDefaultControl formControlName=\"admissionKind\" >\n                                            <span style=\"color: red;font-size: 1.2rem\" *ngIf=\"AdmisionValid===false\">*</span>\n                                            دلیل مراجعه\n                                        </label>\n                                    </div>\n\n                                        <div class=\"form-group  \" style=\"display: block;\"  >\n                                            <input type=\"text\"  id=\"AdmissionInput\" class=\"form-control mt-1\" placeholder=\"جستجو کنید ...\"  autocomplete=\"off\" [(ngModel)]=\"searchText\" (click)=\"showList()\" (keydown)=\"save($event)\"   (input)=\"onSearch($event)\"    [ngModelOptions]=\"{standalone: true}\" >\n                                            <ul id=\"ul\" class=\"list-group position-absolute \" style=\"max-height: 200px;overflow-y: scroll;text-align: right;background-color: white;z-index: 1000;width: 300px\"  >\n\n                                                <li  [class.active]=\"y==arrowkeyLocation\" (click)=\"set(i.id,i.admissionKindValue)\" class=\"list-item-group\" style=\"cursor: pointer;border-bottom: 1px solid lightgray\" *ngFor=\" let i of serchlist; let y = index\"   >\n                                                    {{i.admissionKindValue}}\n                                                </li>\n                                            </ul>\n\n                                            <!--<mat-nav-list  class=\"list-group position-absolute \"  role=\"list\" style=\"max-height: 200px;overflow-y: scroll;text-align: right;background-color: white;z-index: 1000;width: 300px\"> -->\n                                            <!--<a mat-list-item role=\"listitem\"  *ngFor=\" let i of serchlist;let y=index \"  tabindex=\"0\">  {{i.admissionKindValue}}</a>-->\n                                            <!---->\n                                            <!--</mat-nav-list>-->\n                                            <ul id=\"ul2\"     class=\"list-group position-absolute \"  style=\"max-height: 200px;text-align: right;background-color: white;z-index: 1001;overflow-y:scroll;width: 300px\" *ngIf=\"showListAdd\">\n                                                <li   (click)=\"set(i.id,i.admissionKindValue)\" [class.active]=\"x==arrowkeyLocation\"  style=\"cursor: pointer;border-bottom: 1px solid lightgray;\" *ngFor=\"let i of AdmissionKindList;let x = index\"  >\n                                                    <!--{{i.admissionKindValue}}-->\n                                                 <!--<input [(ngModel)]=\"i.admissionKindValue\" formControlName=\"qqq\" required>-->\n                                                        {{i.admissionKindValue}}\n                                                </li>\n                                            </ul>\n\n\n\n\n\n                                            <!-- <input  type=\"text\"  class=\"form-control\" style=\"display: block;\"   matInput (input)=\"onSearchChange($event)\" value=\"{{inputValue1}}\" />\n                                        <div>\n                                            <ul style=\"text-align: left;height: 150px;overflow-x:hidden;overflow-y: scroll ;list-style: none\" *ngIf=\"serchlist.length >0\" >\n                                                <li  *ngFor=\"let i of AdmissionKindList\">\n                                                    <button style=\"border: none;background-color: #f5f7fa;font-size: 14px;text-align: left;\" class=\"w-100\"  >{{i.admissionKindValue}}</button>\n                                                </li>\n                                         <!-- </div>    -->\n                                        </div>\n\n\n\n                                    <div class=\"col-1\" style=\"text-align: right;margin-top: 10px;margin-bottom: 4px;padding: 0\">\n                                        <button class=\"btn \" (click)=\"addToResone()\" type=\"button\" type=\"button\">\n                                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-plus\" viewBox=\"0 0 16 16\">\n                                                <path d=\"M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z\"/>\n                                            </svg>\n                                        </button>\n                                    </div>\n                                    <div class=\"form-group  \" style=\"margin-top: 5px\">\n                                        <span style=\"color: red;font-size: 1.2rem\" *ngIf=\"otherAdmissionKindCaseValid===false\">*</span>\n\n                                        <input type=\"text\" class=\"form-control\" (input)=\"getOtherAdmissionKind($event)\"  placeholder=\"دلیل مراجعه را وارد کنید \" formControlName=\"admissionKindText\" [(ngModel)]=\"AdmissionFrom\" autocomplete=\"off\">\n\n                                        <button class=\"btn\" (click)=\"addToOtherCaseAdmissionKind()\" type=\"button\">ثبت </button>\n\n                                        <!--<button type=\"button\" (click)=\"addAdmissionFromInput()\" class=\"btn \" style=\"margin:0;\" >ثبت</button>-->\n                                    </div>\n                                    <!--<div class=\"col-4\" >-->\n                                        <!--<ul class=\"list-group d-flex\">-->\n                                            <!--<li class=\"list-group-item \" *ngFor=\"let i of list\" class=\"mx-2\" style=\"font-size: 20px;\">{{i}}</li>-->\n                                        <!--</ul>-->\n\n                                        <!--&lt;!&ndash;<ul   style=\"display: flex;\">&ndash;&gt;-->\n                                        <!--&lt;!&ndash;<li *ngFor=\"let i of list\" class=\"mx-2\" style=\"font-size: 20px;\">{{i}} |</li>&ndash;&gt;-->\n                                        <!--&lt;!&ndash;</ul>&ndash;&gt;-->\n                                    <!--</div>-->\n                                </div>\n                            </div>\n                            <div class=\"col-6\">\n                                <div action=\"\" class=\"form-inline\">\n                                    <div class=\"form-group  \">\n                                        <label for=\"\" style=\"font-size: 15px;\" class=\"font-weight-bold mt-1 \" ngDefaultControl   formControlName=\"MainDisease\">\n                                            <span style=\"color: red;font-size: 1.2rem\" *ngIf=\"mainDeseaseValid===false\">*</span>\n\n                                            شکایت اصلی </label>\n                                    </div>\n                                    <div class=\"form-group \" style=\"display: block;\">\n                                        <input  type=\"text\"  autocomplete=\"off\" (click)=\"showListMain()\" (keydown)=\"saveMainDesease($event)\" class=\"form-control mt-1\" placeholder=\"جستجو کنید ..\" style=\"display: block;\"   matInput (input)=\"onSearchMainDesease($event)\"  [(ngModel)]=\"mainDiseaseSearch\" [ngModelOptions]=\"{standalone: true}\" id=\"myInput\" />\n                                        <div>\n                                            <ul id=\"ul3\" class=\"list-group position-absolute \" style=\"max-height: 200px;overflow-y: scroll;text-align: right;background-color: white;z-index: 1000;width: 300px;font-family: iransans\"  >\n                                                <li [class.active]=\"y==arrowkeyLocation2\" (click)=\"setMainDesease(i.id,i.mainDiseaseValue)\" *ngFor=\"let i of MainDeseaseSearchList;let y=index\" style=\"cursor: pointer;border-bottom: 1px solid lightgray;\">\n                                                    {{i.mainDiseaseValue}}\n                                                </li>\n                                            </ul>\n                                            <ul id=\"ul4\"  class=\"list-group position-absolute \"  style=\"max-height: 200px;overflow-y: scroll;text-align: right;background-color: white;z-index: 1001;width: 300px\" *ngIf=\"showListMainDesease\">\n                                                <li [class.active]=\"a==arrowkeyLocation2\" style=\"cursor: pointer;border-bottom: 1px solid lightgray;\" (click)=\"setMainDesease(i.id,i.mainDiseaseValue)\" *ngFor=\"let i of MainDiseaseList;let a=index\">{{i.mainDiseaseValue}}</li>\n                                            </ul>\n                                        </div>\n                                    </div>\n                                    <div class=\"col-1\" style=\"text-align: right;margin-top: 10px;margin-bottom: 4px;margin-left: 5px;padding: 0\">\n                                        <button class=\"btn \" (click)=\"addToMainDiseaseList()\" type=\"button\">\n                                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-plus\" viewBox=\"0 0 16 16\">\n                                                <path d=\"M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z\"/>\n                                            </svg>\n                                        </button>\n\n\n                                    </div>\n                                    <div class=\"form-group \" style=\"margin-top: 5px\">\n                                        <span style=\"color: red;font-size: 1.2rem\" *ngIf=\"otherMaindeseaseCaseValid===false\">*</span>\n                                        <input type=\"text\" (input)=\"getOtherMainDesease($event)\" class=\"form-control\" autocomplete=\"off\" placeholder=\"شکایت اصلی را وارد کنید\"  ngDefaultControl formControlName=\"MainDiseaseText\">\n                                        <button class=\"btn\" type=\"button\" (click)=\"addToOtherCaseMainDesease()\">ثبت </button>\n                                        <!--<button type=\"button\" (click)=\"addMainDiseaseInput()\" class=\"btn \" style=\"margin:0;\" >ثبت</button>-->\n                                        <!--<div class=\"\">-->\n                                            <!--<ul   style=\"display: flex;\">-->\n                                                <!--<li *ngFor=\"let i of MainDeseaseList\" class=\"mx-2\" style=\"font-size: 20px;\" >{{i}} |</li>-->\n                                            <!--</ul>-->\n                                        <!--</div>-->\n                                    </div>\n\n                                </div>\n                            </div>\n\n                        </div>\n                    </div>\n            <div class=\"row form-group\">\n                <div class=\"col-12 mt-3 d-flex text-right\">\n                    <div class=\"col-6  d-flex \" style=\"text-align: right;height: 80px;border: 1px solid black; overflow-x: scroll;overflow-y:hidden;background-color: white\">\n                        <ul class=\" d-flex\" style=\"display: flex!important;\">\n                        <li class=\" \" *ngFor=\"let i of list\" class=\"mx-2 mt-1\" style=\"font-size: 20px;\">{{i}} </li>\n                        </ul>\n                        <ul class=\"d-flex mt-1\"  style=\"font-size: 20px;\">\n\n                            <li *ngFor=\"let i of admissionKindTextList\">\n                                {{i.description}}\n\n                            </li>\n                            <li *ngIf=\"liststring!=null\">\n                                {{liststring}}\n                            </li>\n                        </ul>\n                    </div>\n\n                    <div class=\"col-6 d-flex\" style=\"text-align: right;height: 80px;border: 1px solid black;background-color: white;overflow-x: scroll;overflow-y: hidden\">\n                        <ul class=\"mt-1\"   style=\"display: flex;\">\n                        <li *ngFor=\"let i of MainDeseaseList\" class=\"mx-2 mt-1\" style=\"font-size:20px;\" >{{i}} <span style=\"width: 1px;height: 60px;background-color: black\"></span> </li>\n                            <li class=\"mx-2 mt-1\" style=\"font-size:20px; \" *ngIf=\"MainDeseaseListliststring!=null\">\n                                {{MainDeseaseListliststring}}\n                            </li>\n                        </ul>\n                        <ul style=\"display: flex;\">\n                            <li *ngFor=\"let i of othermainDeseasePush\" class=\"mx-2\" style=\"font-size: 20px\">{{i.description}}</li>\n                        </ul>\n                    </div>\n\n                </div>\n            </div>\n            <div class=\"row form-group\">\n                <div class=\"col-12 mt-3\">\n                    <div action=\"\" class=\"form-inline\">\n                        <div class=\"form-group \">\n                            <label for=\"\" style=\"font-size: 15px;color: red;\" class=\"font-weight-bold\">\n                                <span style=\"color: red;font-size: 1.2rem\" *ngIf=\"foodSenseValid===false\">*</span>\n\n                                حساسیت غذایی</label>\n                        </div>\n                        <div class=\"form-group col-3\" ngDefaultControl   formControlName=\"sensetiveFoodType\">\n                            <button type=\"button\" class=\"btn \" [ngClass]=\"{'green' : toggle}\"   (click)=\"GetDetails(content)\">بله</button>\n                            <button type=\"button\" class=\"btn \" [ngClass]=\"{'green' : toggle1}\" (click)=\"seseFood()\">خیر</button>\n\n                        </div>\n                        <div action=\"\" class=\"form-inline d-flex\">\n                            <div class=\"form-group \">\n                                <label for=\"\" style=\"font-size: 15px;color: red;\" class=\"font-weight-bold\">\n                                    <span style=\"color: red;font-size: 1.2rem\" *ngIf=\"drugAllerguValid===false\">*</span>\n\n                                    حساسیت دارویی</label>\n                            </div>\n                            <div ngDefaultControl   formControlName=\"DrugAllergy\">\n\n                                <button type=\"button\" class=\"btn \" [ngClass]=\"{'green' : toggle2}\" (click)=\"GetDrugAllergyDetails(content2)\">بله</button>\n                                <button type=\"button\" class=\"btn \" [ngClass]=\"{'green' : toggle3}\" (click)=\"getDrugAllergy()\">خیر</button>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                \n            </div>\n                    <div class=\"row\" *ngIf=\"showFood\">\n                        <div class=\"col-12\">\n                            <div class=\"col-4\" style=\"background-color: white;border: 1px solid black\">\n                <ul class=\"d-flex\">\n                    <li class=\"mx-1 mt-1\" *ngFor=\"let i of foodPAtientValueList \">\n                        {{i}}\n\n                    </li>\n                    </ul>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            </div>\n            <div style=\"border: 1px solid #b3b0af;background-color: #f2f2f2;font-family: Tahoma;\">\n                <div class=\"header\">\n                    <h5 >الگوریتم تریاژ</h5>\n\n                    <h5 >Emergancy severity Index(ESI) Algorithim</h5>\n                </div>\n\n                <div class=\"row form-group\" style=\"text-align: left!important;direction: ltr;\">\n                    <div class=\"col-12 \" >\n                        <div action=\"\" class=\"form-group\">\n                            <div class=\"mt-3\" style=\"font-size: 20px;\">\n                                <button type=\"button\" (click)=\"onSubmit()\" [disabled]=\"triageForm.status==='INVALID' || validGender==false || validTranspoerter==false || validEnterance==false || AdmisionValid==false && otherAdmissionKindCaseValid==false || mainDeseaseValid==false && otherMaindeseaseCaseValid==false  ||foodSenseValid==false || drugAllerguValid==false || ageTypeValid==false \" class=\"checkSize mr-1 CircleBtn \"   [routerLink]=\"['/teriazh/Triage-level-1']\" ></button>\n\n                                <span class=\"font-weight-bold\" >A:Patient require immediate life-saving intervention(Level1)</span>\n                            </div>\n                            <div class=\"mt-2\"  style=\"font-size: 20px;\">\n                                <button type=\"submit\" (click)=\"onSubmit()\" [disabled]=\"triageForm.status==='INVALID' || validGender==false || validTranspoerter==false || validEnterance==false || AdmisionValid==false && otherAdmissionKindCaseValid==false  || mainDeseaseValid==false &&  otherMaindeseaseCaseValid==false ||foodSenseValid==false || drugAllerguValid==false || ageTypeValid==false \" class=\"checkSize mr-1 CircleBtn \"   [routerLink]=\"['/teriazh/Triage-level-2']\" ></button>\n                                <span class=\"font-weight-bold\">B: Patient should not wait to be seen (Level2)</span>\n                            </div>\n                            <div class=\"mt-2\"  style=\"font-size: 20px;\">\n                                <span style=\"margin-right: 70px;\" class=\"mr-1 font-weight-bold\">C: Resource Needs (Level 3, 4, 5)</span>\n                                <button type=\"submit\" [disabled]=\"triageForm.status==='INVALID' || validGender==false || validTranspoerter==false || validEnterance==false || AdmisionValid==false && otherAdmissionKindCaseValid==false || mainDeseaseValid==false && otherMaindeseaseCaseValid==false  ||foodSenseValid==false || drugAllerguValid==false || ageTypeValid==false \" (click)=\"onSubmit()\" class=\"checkSize mr-1 CircleBtn \"   [routerLink]=\"['/teriazh/Triage-level-3']\" ></button>\n                                <span for=\"\"  style=\"margin-right: 20px;font-size: 13px\" class=\"mr-1 font-weight-bold\"  >Many</span>\n                                <button type=\"submit\" [disabled]=\"triageForm.status==='INVALID' || validGender==false || validTranspoerter==false || validEnterance==false || AdmisionValid==false && otherAdmissionKindCaseValid==false || mainDeseaseValid==false && otherMaindeseaseCaseValid==false  ||foodSenseValid==false || drugAllerguValid==false || ageTypeValid==false \"  (click)=\"onSubmit()\" class=\"checkSize mr-1 CircleBtn \"   [routerLink]=\"['/teriazh/Triage-level-4']\" ></button>\n                                <span for=\"\" style=\"margin-right: 20px;font-size: 13px;\"  class=\"mr-1 font-weight-bold\">One</span>\n                                <button type=\"submit\"  (click)=\"onSubmit()\" [disabled]=\"triageForm.status==='INVALID' || validGender==false || validTranspoerter==false || validEnterance==false || AdmisionValid==false && otherAdmissionKindCaseValid==false || mainDeseaseValid==false && otherMaindeseaseCaseValid==false  ||foodSenseValid==false || drugAllerguValid==false || ageTypeValid==false \" class=\"checkSize mr-1 CircleBtn \"   [routerLink]=\"['/teriazh/Triage-level-5']\" ></button>\n                                <span for=\"\" style=\"margin-right: 20px;font-size: 13px;font-weight: bold\" class=\"mr-1 font-weight-bold\">None</span>\n                            </div>\n                  \n                        </div>\n                    </div>\n                </div>\n            </div>\n\n        \n\n    </div>\n    </div>\n\n    <ng-template #content let-c=\"close\" let-d=\"dismiss\"  style=\"font-family: iransans, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif\" >\n        <div class=\"modal-header \" style=\"background-color: #63a4ff;\nbackground-image: linear-gradient(315deg, #63a4ff 0%, #83eaf1 74%);direction: rtl\" >\n          <h4 class=\"modal-title white\" >حساسیت غذایی</h4>\n        </div>\n        <div class=\"modal-body\" id=\"kbModal-body\">\n\n            <div class=\"col-12\"  style=\"text-align: right;\">\n            </div>\n            <div class=\"col-12\" style=\"text-align: right;\"  formControlName=\"FoodSensitivity\">\n                <button class=\"btn col-3\" *ngFor=\"let i of FoodSensitivityList\" [style.background-color]=\"i.BackgroundColour\" [style.color]=\"i.color\" (click)=\"getFoodSensitivity(i.Key,i,i.Value)\"> {{i.Value}}</button>\n                <!--<select name=\"\" id=\"\" style=\"text-align: right;direction: rtl\" class=\"form-control\" formControlName=\"FoodSensitivity\">-->\n                    <!--<option [value]=\"i.Key\" style=\"text-align: right;font-family: iransans, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;border-bottom: 1px solid lightgray\" *ngFor=\"let i of FoodSensitivityList\" (click)=\"getFoodSensitivity()\">{{i.Value}}</option>-->\n                <!--</select>-->\n            </div>\n        </div>\n        <div class=\"modal-footer\">\n          <button type=\"button\" class=\"btn btn-info btn-raised\" (click)=\"c('Close click')\">بستن</button>\n          <button type=\"button\" class=\"btn btn-info btn-raised\" (click)=\"showFoodPAtient()\">تایید</button>\n        </div>\n      </ng-template>\n      <ng-template #content2 let-c=\"close\" let-d=\"dismiss\">\n        <div class=\"modal-header\" style=\"background-color: #63a4ff;\nbackground-image: linear-gradient(315deg, #63a4ff 0%, #83eaf1 74%);text-align: right;direction: rtl\" >\n          <h4 class=\"modal-title white\" >حساسیت دارویی</h4>\n        </div>\n        <div class=\"modal-body\" id=\"kbModal-body\">\n            <div class=\"col-12\" ngDefaultControl formControlName=\"drugList\">\n                <input class=\"form-control boxShadowSuccess\" (input)=\"onSearchDrugSensitivy($event)\" type=\"text\" autocomplete=\"off\" (input)=\"onSearchDrug($event)\" [(ngModel)]=\"drugSearch\"  [ngModelOptions]=\"{standalone: true}\" placeholder=\"...جستجو\" >\n            </div>\n\n\n            <div class=\"col-12 \"  style=\"overflow-y: scroll;border: 1px solid lightgray;height: 50%\" *ngIf=\"drugSensitivy && drugSensitivy.length>0\">\n              <ul class=\"list-group\" >\n                  <li class=\"list-group-item list-group-item-action list-group-item-success w-100\" *ngFor=\"let i of drugSensitivy\" >\n                      <span style=\"width: 300px\">{{i.value}}</span>\n                      <span  >\n                          <svg xmlns=\"http://www.w3.org/2000/svg\"  width=\"25\" height=\"25\" fill=\"currentColor\" class=\"bi bi-plus-square\" style=\"color: #1ab7ea; cursor: pointer;margin-left: 97%\" viewBox=\"0 0 16 16\" (click)=\"addToDrugArray(i.value,i.code)\">\n                          <path d=\"M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z\"/>\n                          <path d=\"M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z\"/>\n                      </svg>\n                      </span>\n\n                  </li>\n              </ul>\n            </div>\n            <div class=\"col-12\">\n                <table class=\"table table-striped table-bordered\">\n                    <thead>\n                    <tr >\n                        <th scope=\"col\">ردیف</th>\n                        <th scope=\"col\">نام دارو </th>\n\n                    </tr>\n                    </thead>\n                    <tbody>\n                    <tr *ngFor=\"let i of drugArray\">\n                        <th scope=\"row\">{{i.code}}</th>\n                        <td>{{i.name}}</td>\n\n                    </tr>\n\n                    </tbody>\n                </table>\n            </div>\n\n        </div>\n        <div class=\"modal-footer\">\n          <button type=\"button\" class=\"btn btn-info btn-raised\" (click)=\"c('Close click')\">بستن</button>\n            <button type=\"button\" class=\"btn btn-info btn-raised\" (click)=\"sendDrug()\">تایید</button>\n\n        </div>\n      </ng-template>\n</form>\n            \n           \n  \n      \n    \n        \n        \n       \n      \n        \n        \n       \n        \n\n\n\n\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/teriazh/page3/page3.component.html":
/*!******************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/teriazh/page3/page3.component.html ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<style>\n    .btnW{\n        padding-right:20px !important;\n        padding-left: 20px !important;\n        padding-top: 3px!important;\n        padding-bottom: 3px!important;\n        border: 1px solid;\n        font-size:14px;\n        background-color:#fcb103 ;\n        color: white;\n\n    }\n\n\n</style>\n<form action=\"\">\n\n    <div class=\"container-fluid\">\n       <div class=\"row mt-1\">\n           <div class=\"col-12\" style=\"text-align: right\">\n               <label for=\"\" >کد:</label>\n               <input type=\"text\"style=\"margin-right: 19px\" >\n               <label for=\"\" style=\"margin-right: 100px\">توضیح</label>\n               <input type=\"text\">\n               <button class=\"btn btnW\"  style=\"margin-right: 100px\">جستجو</button>\n           </div>\n           <div class=\"col-12\" style=\"text-align: right\">\n               <label for=\"\" >عنوان</label>\n               <input type=\"text\" >\n           </div>\n       </div>\n        <div class=\"row mt-1\">\n            <div class=\"col-12 d-flex\">\n                <div class=\"col-9\">\n                    <table class=\"table table-bordered\" style=\"text-align: right\">\n                        <thead style=\"padding: 0!important;\">\n                        <tr>\n                            <th scope=\"col\">انتخاب</th>\n                            <th scope=\"col\">کد</th>\n                            <th scope=\"col\">مقدار</th>\n                            <th scope=\"col\">توضیح</th>\n                        </tr>\n                        </thead>\n                        <tbody>\n                        <tr>\n                            <th scope=\"row\"><input type=\"checkbox\"></th>\n                            <td>1</td>\n                            <td></td>\n                            <td></td>\n                        </tr>\n                        <tr>\n                            <th scope=\"row\"><input type=\"checkbox\"></th>\n                            <td>2</td>\n                            <td></td>\n                            <td></td>\n                        </tr>\n                        <tr>\n                            <th scope=\"row\"><input type=\"checkbox\"></th>\n                            <td>3</td>\n                            <td> </td>\n                            <td></td>\n                        </tr>\n                        <tr>\n                            <th scope=\"row\"><input type=\"checkbox\"></th>\n                            <td>3</td>\n                            <td> </td>\n                            <td></td>\n                        </tr>\n                        <tr>\n                            <th scope=\"row\"><input type=\"checkbox\"></th>\n                            <td>4</td>\n                            <td> </td>\n                            <td></td>\n                        </tr>\n                        <tr>\n                            <th scope=\"row\"><input type=\"checkbox\"></th>\n                            <td>5</td>\n                            <td> </td>\n                            <td></td>\n                        </tr>\n                        <tr>\n                            <th scope=\"row\"><input type=\"checkbox\"></th>\n                            <td>6</td>\n                            <td> </td>\n                            <td></td>\n                        </tr>\n                        <tr>\n                            <th scope=\"row\"><input type=\"checkbox\"></th>\n                            <td>7</td>\n                            <td> </td>\n                            <td></td>\n                        </tr>\n                        <tr>\n                            <th scope=\"row\"><input type=\"checkbox\"></th>\n                            <td>8</td>\n                            <td> </td>\n                            <td></td>\n                        </tr>\n                        <tr>\n                            <th scope=\"row\"><input type=\"checkbox\"></th>\n                            <td>9</td>\n                            <td> </td>\n                            <td></td>\n                        </tr>\n\n\n                        </tbody>\n                    </table>\n                </div>\n                <div class=\"col-3\">\n                    <table class=\"table table-bordered\" style=\"text-align: right\">\n                        <thead>\n                        <tr>\n                            <th scope=\"col\">انتخاب شده</th>\n                            <th scope=\"col\">کد</th>\n                        </tr>\n                        </thead>\n                        <tbody>\n                        </tbody>\n                    </table>\n                </div>\n            </div>\n        </div>\n        <div class=\"row mt-1\" >\n            <button class=\"btn btnW\" style=\"text-align: left\" disabled> تایید</button>\n            <button class=\"btn btnW\" style=\"text-align: left\" >انصراف</button>\n\n        </div>\n\n\n    </div>\n\n    <input type=\"text\" class=\"form-control\"  [(ngModel)]=\"searchText\"  [ngModelOptions]=\"{standalone: true}\" >\n    <div  *ngFor=\" let i of options | search:searchText  \">\n        {{i.admissionKindValue}}\n    </div>\n</form>\n\n{{options | json}}\n\n<!-- <form class=\"example-form\">\n    <mat-form-field class=\"example-full-width\">\n      <mat-label>Number</mat-label>\n      <input type=\"text\"\n             placeholder=\"Pick one\"\n             aria-label=\"Number\"\n             matInput\n             [formControl]=\"myControl\"\n             [matAutocomplete]=\"auto\">\n      <mat-autocomplete #auto=\"matAutocomplete\">\n        <mat-option *ngFor=\"let option of filteredOptions | async\" [value]=\"option\">\n          {{option}}\n        </mat-option>\n      </mat-autocomplete>\n    </mat-form-field>\n  </form> -->\n \n\n{{options| json}}"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/teriazh/page4/page4.component.html":
/*!******************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/teriazh/page4/page4.component.html ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<style>\n    .pos{\n        top: 0;\n        left: 0;\n        transform: translateY(-50%);\n        background-color: #F5F7FA;\n\n    }\n    .Customborder{\n        border: 2px solid #fcb103 ;\n\n\n    }\n\n    .line{\n        height: 1px;\n        background-color: #fcb103\n    }\n    .posLft{\n        top: 0;\n        right: 0;\n        transform: translateY(-50%);\n        background-color: #F5F7FA;\n    }\n    .header{\n        background-color: #063d78;\n        color: white;\n        padding-top: 5px;\n        padding-bottom: 5px;\n    }\n    .header h5{\n        margin-top: 10px;\n    }\n    .btn{\n        border: 1px solid;\n        background-color: white;\n    }\n    .btnFinish{\n        border: 1px solid;\n\n    }\n    .green{\n        color: white !important;\n        background-color: #44b5b7;\n\n    }\n    .border{\n        border: 1px solid black;\n    }\n    .line{\n        height: 1px;\n        background-color: #fcb103\n    }\n    .btnCustome{\n        padding-right:8px !important;\n        padding-left: 8px !important;\n        padding-top: 3px!important;\n        padding-bottom: 3px!important;\n        border: 1px solid;\n        font-size:13px;\n        background-color:#fcb103 ;\n        color: white;\n    }\n    .btnW{\n        padding-right:20px !important;\n        padding-left: 20px !important;\n        padding-top: 3px!important;\n        padding-bottom: 3px!important;\n        border: 1px solid;\n        font-size:13px;\n        background-color:#fcb103 ;\n        color: white;\n\n    }\n\n\n\n\n    .header{\n        background-color: #063d78;\n        color: white;\n        padding-top: 5px;\n        padding-bottom: 5px;\n        display: flex;\n        justify-content: space-between;\n    }\n    .header h5{\n        margin-left: 10px;\n        margin-right: 10px;\n    }\n    .hide{\n        display: none;\n    }\n    .checkSize{\n        width: 20px;\n        height: 20px;\n    }\n    ul li{\n        list-style: none;\n    }\n    .CircleBtn{\n        border-radius: 50%;\n    }\n    table th {\n        background-color: #48d9fa;\n\n    }\n    table{\n        text-align: center;\n    }\n    .br{\n        border:  2px solid black;\n    }\n    .p0{\n        padding: 0 !important\n    }\n    .br div{\n        padding: 0;\n    }\n    p,span,label,h4,h3,h5{\n        font-weight: bold;\n    }\n    .roundBorder{\n        border: 2px solid gray;\n        border-radius: 10px;\n    }\n    .myDIv{\n        animation: mymove 2s infinite;\n        color: white;\n        padding-top: 5px;\n        padding-bottom: 5px;\n        display: flex;\n        justify-content: space-between;\n    }\n    @keyframes mymove {\n        from {background-color: #063d78;}\n        to {background-color: #2a93d4;}\n    }\n    input{\n        width: 18px;\n        height: 18px;\n        margin-right: 3px;\n        margin-left:3px;\n    }\n   \n</style>\n\n<form action=\"\"  [formGroup]=\"level1Form\"  (ngSubmit)=\"onSubmit()\"  >\n    <div class=\"d-flex justify-content-center\"  style=\"direction: rtl;text-align: right;transition: 500ms\"  style=\"font-family: iransans\" *ngIf=\"showResult===true\" >\n        <div class=\"alert alert-light col-4 position-absolute   \" style=\"z-index: 1000;font-size: 1.2em;text-align: right;top: 50%;left: 50%;transform: translate(-50%,-50%)\"  role=\"alert\" *ngIf=\"ISsubmitOK===true\">\n        <div class=\"d-flex justify-content-center\" >\n             <span class=\"mt-3\"> ثبت تریاژ با موفقیت انجام شد..</span>\n  <svg xmlns=\"http://www.w3.org/2000/svg\" style=\"color: limegreen;\" width=\"50\" height=\"50\" fill=\"currentColor\" class=\"bi bi-check2-circle\" viewBox=\"0 0 16 16\">\n                <path d=\"M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z\"/>\n                <path d=\"M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z\"/>\n            </svg>\n\n        </div>\n            <div class=\"d-flex\" *ngIf=\"ISsubmitOK===true\">\n                <p>کد رهگیری :</p>\n                <P>{{triageID}}</P>\n            </div>\n            <div style=\"text-align: left\">\n                <button class=\"btn\" type=\"button\" (click)=\"close()\"  style=\"font-family: iransans\"> بستن </button>\n            </div>\n\n        </div>\n        <div class=\"alert alert-light col-4 position-absolute   \" style=\"z-index: 1000;font-size: 1.2em;text-align: right;top: 50%;left: 50%;transform: translate(-50%,-50%)\"  role=\"alert\" *ngIf=\"isSubmitError===true\">\n            <div class=\"d-flex justify-content-center\" >\n                <span class=\"mt-3\">{{result}}</span>\n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"50\" style=\"color: yellow\" height=\"50\" fill=\"currentColor\" class=\"bi bi-exclamation-octagon\" viewBox=\"0 0 16 16\">\n                    <path d=\"M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z\"/>\n                    <path d=\"M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z\"/>\n                </svg>\n\n            </div>\n            <div style=\"text-align: left\">\n                <button class=\"btn\" type=\"button\" (click)=\"close()\"  style=\"font-family: iransans\"> بستن </button>\n            </div>\n        </div>\n        </div>\n\n\n\n\n    <div class=\"container-fluid mt-2\" >\n        <div class=\"row mb-1\">\n            <div class=\"col-12 \">\n                <div class=\"header\" style=\"  background-color: #990000;\n        background-image: linear-gradient(147deg, #990000 0%, #ff0000 74%);\">\n                    <h5>سطح تریاژ بیمار 1</h5>\n                    <h5 style=\"font-family: Tahoma\">   Patient Triage Level 1</h5>\n\n                </div>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col-12 \">\n                <div [ngClass]=\"{'header':AvpuValid===true,'myDIv':AvpuValid===false}\" >\n                    <h5 >\n                                        سطح هوشیاری بیمار\n                    </h5>\n                    <h5>\n                    APUV\n                    </h5>\n            </div>\n                <div class=\"col-12 d-flex justify-content-center  \" style=\"text-align: left;border: 1px solid black;direction: ltr;background-color: #f2f2f2;\" ngDefaultControl formControlName=\"APUV\">\n\n                        <button type=\"button\" [style.background-color]=\"i.BackgroundColour\" [style.color]=\"i.color\" class=\"btn col-1 mt-2 mb-2 my-2 mx-1 \" *ngFor=\"let i of AVPUlist\" (click)=\"getAPUV(i.Key,i)\">\n                            {{i.Value}}\n                        </button>\n                    </div>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col-12 \">\n                <div [ngClass]=\"{'header':LifeValid===true,'myDIv':LifeValid===false}\">\n                    <h5 style=\"text-align: center;\">        \n                        شرایط تهدید کننده حیات\n                    </h5>\n                    <h5 >\n                        :Life Threatening Conditions\n                    </h5>\n            </div>\n                <div class=\"col-12 d-flex justify-content-between  position-relative\" style=\"text-align: left;border: 1px solid black;direction: ltr; background-color: #f2f2f2;\">\n                    <div class=\"mt-2 col-2\">\n                        <button type=\"button\" class=\"btn btn-block  ml-2\" (click)=\"getAirway()\" [ngClass]=\"{'green' : toggle4}\">\n                            Patient Airway Hazard                 </button>\n\n                    </div >\n                    <div class=\"mt-2 col-2\" >\n                        <button type=\"button\" class=\"btn  btn-block ml-2\" (click)=\"getDistress()\" [ngClass]=\"{'green' : toggle3}\">\n                            Severe Respiratory Distress\n                           \n                            </button>\n                    </div>\n                    <div class=\"mt-2 col-2\">\n                        <button type=\"button\"  class=\"btn  btn-block ml-2\" (click)=\"getCyanosis()\" [ngClass]=\"{'green' : toggle2}\">\n                            Cyanosis                  \n                                  </button>\n                    </div>\n                    <div class=\"mt-2 col-3\">\n                        <button type=\"button\" class=\"btn  btn-block ml-2\" (click)=\"getMental()\" [ngClass]=\"{'green' : toggle1}\">\n                            Acute Mental Status Changes                            \n                        </button>\n                    </div>\n                    <div class=\"mt-2 col-2\" style=\"font-family: Tahoma;\">\n                        <button type=\"button\" class=\"btn  btn-block ml-2\" [ngClass]=\"{'green' : toggle}\" (click)=\"getSpo()\" >\n                            Spo2>90%                          \n                        </button>\n                    </div>\n                </div>\n                \n            </div>\n        </div>\n       \n    </div>\n    <div class=\"container-fluid\">\n        <div class=\"row\">\n            <div class=\"col-12\">\n                <div class=\"header\">\n                    <h5 >جداسازی  بیمار و کنترل عفونت</h5>\n                    <h5>:Patient Isolation and Higher of  Precaution</h5>\n            </div>\n            <div class=\"col-12 justify-content-center d-flex  border \" style=\"text-align: right;background-color: #f2f2f2;border: 1px solid black !important;\" ngDefaultControl formControlName=\"Separation\">\n                <button type=\"button\" [style.background-color]=\"i.BackgroundColour\" [style.color]=\"i.color\" class=\"btn  mt-2 mb-2 ml-2\" *ngFor='let i of SeparationByInfectionList' (click)=\"getSeparationByInfectionList(i.Key,i)\">\n                        {{i.Value}}\n                </button>\n             \n                    \n             \n               \n            </div>\n            </div>\n            </div>\n            <div class=\"row mt-2\">\n                <div class=\"col-12 \">\n                    <div  [ngClass]=\"{'header':refeValid===true,'myDIv':refeValid===false}\">\n                        <h5 style=\"text-align: center;\">\n                            ارجاع به\n                        </h5>\n                        <h5 style=\"text-align: center;\">\n                        :Refer To\n                        </h5>\n                </div>\n                <div class=\"col-12 d-flex border  \"  style=\"text-align: right;background-color: #f2f2f2;flex-wrap: wrap;border: 1px solid black !important;\" ngDefaultControl formControlName=\"Departure\" >\n                    <button type=\"button\"  [style.background-color]=\"i.BackgroundColour\" [style.color]=\"i.color\" class=\"btn col-2 mt-2 mb-1 ml-2\"*ngFor=\"let i of departureList\" (click)=\"getDeparture(i.Key,i)\">\n                {{i.Value}}                   \n       \n                </button>\n                       \n                </div>\n                </div>\n                </div>\n        <div class=\"col-12 mt-2\" style=\"direction: rtl;text-align: right\">\n\n            <button [disabled]=\"AvpuValid===false || LifeValid===false || refeValid===false\"  type=\"button\" class=\"btn btn-outline-primary col-1\" (click)=\"onSubmit()\">\n                ثبت\n            </button>\n            <button type=\"button\" [disabled]=\"printOK===false\" class=\"btn btn-primary col-1\" (click)=\"send()\">\n                ثبت و پایان\n            </button>\n        </div>\n                \n        <div >\n            <button type=\"button\" class=\"btn btn-outline-primary border ml-1\" [disabled]=\"printOK===false\"   printSectionId=\"print-section\" [printStyle]= \"{div: {'direction' : 'rtl'}}\" [useExistingCss]=\"true\" ngxPrint >پرینت تریاژ</button>\n            <button type=\"button\" class=\"btn mb-2 btnHover\" style=\"background-color: #3898C5;color: white\" [routerLink]=\"['/teriazh/Patient-Triage']\">\n                صفحه قبلی\n                <svg  xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-arrow-return-left\" viewBox=\"0 0 16 16\">\n                    <path fill-rule=\"evenodd\" d=\"M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z\"/>\n                </svg>\n\n            </button>\n        </div>\n\n    </div>\n\n    <div class=\"container\" style=\"float: right;visibility: hidden;display: none\" id=\"print-section\" *ngIf=\"triazhInfo\">\n\n\n\n\n        <div class=\"col-12 text-center\">\n            <h4>وزارت بهداشت درمان و آموزش پزشکی</h4>\n            <h5>Ministry of Health & Medical Education</h5>\n        </div>\n        <div class=\"row \">\n            <div class=\"col-12 d-flex justify-content-around\">\n\n                <h5>دانشگاه علوم پزشکی   </h5>\n                <h5>\n                    <span *ngIf=\"hospital\">\n            {{hospital['universityName']}}\n        </span>\n                </h5>\n                <h5>:University of Medical Science </h5>\n            </div>\n\n        </div>\n        <div class=\"row \">\n            <div class=\"col-12  d-flex justify-content-around\">\n                <!--<div>-->\n                <!--<span>کد تریاژ</span>-->\n                <!--<span>{{triazhInfo['item']['id']}}</span>-->\n                <!--</div>-->\n                <h5>\n                    <span *ngIf=\"hospital\">\n            {{hospital['hospitalName']}}\n        </span>\n                </h5>\n                <h5>:Medical Center</h5>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row \">\n                <div class=\"col-12  d-flex justify-content-around\">\n                    <div class=\"col-3 \">\n                        <div class=\"br\" style=\"width:220px;height:50px; \">\n                            شماره پرونده\n                            <span>\n                            Record No:\n                        </span>\n                        </div>\n\n                    </div>\n                    <div class=\" col-6 text-center\">\n                        <h5>   فرم تریاژ بخش اورژانس بیمارستان </h5>\n                        <h6 class=\"text-bold-700\">HOSPITAL EMERGENCY DEPARTMENT TRIAGE FORM </h6>\n                    </div>\n                    <div class=\"col-3 text-left\" style=\"direction: ltr;\">\n                        <div style=\"width:220px;height:50px\" class=\"br text-right\">\n                <span class=\"text-right\">\n                    سطح تریاژ بیمار\n               </span>\n                            <span class=\"font-weight-bold\">\n                  {{triazhInfo['item']['triageLevelIS']}}\n               </span></div>\n                    </div>\n                </div>\n            </div>\n    </div>\n\n        <div class=\"container\" >\n            <div class=\"row  col-12 br d-flex justify-content-around\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12 d-flex \">\n                    <div class=\"col-3 d-flex justify-content-between \" style=\"border-left: 1px solid black;\" >\n                        <p>نام خانوادگی</p>\n                        <p class=\"mt-4\">{{triazhInfo['item']['lastName']}}</p>\n                        <p>Family Name</p>\n                    </div>\n                    <div class=\"col-3 d-flex justify-content-between\" style=\"border-left: 1px solid black;\">\n                        <p>نام </p>\n                        <p class=\"mt-4\">\n                            {{triazhInfo['item']['firstName']}}\n                        </p>\n                        <p> Name</p>\n                    </div>\n                    <div class=\"col-3 d-flex justify-content-between \" style=\"border-left: 1px solid black;\">\n                        <div style=\"text-align: right;\">\n                            <p>جنس</p>\n                            <div>\n                                <label for=\"\">مذکر</label>\n                                <input  *ngIf=\"triazhInfo['item']['gender']==0\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                                <input *ngIf=\"triazhInfo['item']['gender'] !=0\" type=\"checkbox\" ng-disabled=\"true\"  />\n                                <span>F</span>\n                                <input type=\"checkbox\" >\n                                <label for=\"\" style=\"margin-right: 30px;\">مونث</label>\n                                <input *ngIf=\"triazhInfo['item']['gender']==1\" type=\"checkbox\"  checked />\n\n                                <input *ngIf=\"triazhInfo['item']['gender'] !=1\" type=\"checkbox\"   />\n                                <span>M</span>\n                            </div>\n                        </div>\n\n                        <div>\n                            <p>Sex</p>\n                        </div>\n                    </div>\n                    <div class=\"col-3 \">\n                        <div class=\"d-flex justify-content-between\">\n                            <p>تاریخ مراجعه</p>\n                            <!--<p>-->\n                            <!--{{triazhInfo['item']['entranceTime']}}-->\n                            <!--</p>-->\n                            <p>Date of Arrival</p>\n                        </div>\n                        <div class=\"d-flex justify-content-between\">\n                            <p>ساعت مراجعه</p>\n                            <p>{{triazhInfo['item']['entranceTime']}}</p>\n                            <p>Time of Arrival</p>\n                        </div>\n                    </div>\n\n                </div>\n                <div class=\"col-12 d-flex justify-content-between \" style=\"border-top: 1px solid black;\">\n                    <div class=\"col-6 d-flex justify-content-between\">\n                        <div class=\"col-6 d-flex justify-content-between \" style=\"border-left: 1px solid black;\">\n                            <p>کد ملی </p>\n                            <p>\n                                {{triazhInfo['item']['nationalCode']}}\n                            </p>\n                            <p>National Code</p>\n                        </div>\n                        <div class=\"col-6 d-flex justify-content-between\" style=\"border-left: 1px solid black;\">\n                            <p>تاریخ تولد  </p>\n                            <p>\n                                {{triazhInfo['item']['birthDate']}}\n                            </p>\n                            <p>Date of Birth </p>\n                        </div>\n                    </div>\n                    <div class=\"col-6 d-flex justify-content-between\">\n                        <div>\n                            <p>باردار</p>\n                        </div>\n                        <div>\n                            <label for=\"\">بلی </label>\n                            <input *ngIf=\"triazhInfo['item']['pregnant']==1\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                            <input *ngIf=\"triazhInfo['item']['pregnant'] !=1\" type=\"checkbox\" ng-disabled=\"true\"  />                  <span>yes</span>\n                        </div>\n                        <div>\n                            <label for=\"\">خیر </label>\n                            <input *ngIf=\"triazhInfo['item']['pregnant']==0\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                            <input *ngIf=\"triazhInfo['item']['pregnant'] !=0\" type=\"checkbox\" ng-disabled=\"true\"  />                    <span>No</span>\n                        </div>\n                        <div>\n                            <label for=\"\">نامعلوم </label>\n                            <input *ngIf=\"triazhInfo['item']['pregnant']==2\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                            <input *ngIf=\"triazhInfo['item']['pregnant'] !=2\" type=\"checkbox\" ng-disabled=\"true\"  /><small>unknown</small>\n                        </div>\n                        <div>\n                            <p>Pregnant</p>\n                        </div>\n\n\n                    </div>\n\n                </div>\n\n\n\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-around\" style=\"direction: rtl;padding: 0;border-top: none\">\n                <div class=\"col-12 mt-1 d-flex justify-content-between\" style=\"text-align: right;\">\n                    <h6>نحوه مراجعه</h6>\n                    <h6>:Arrival Mode </h6>\n                </div>\n                <div class=\"col-12 mt-1 \" style=\"text-align: right;\">\n                    <span>آمبولانس 115</span>\n                    <input  *ngIf=\"triazhInfo['item']['arrival_Transport']==2\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=2\" type=\"checkbox\" ng-disabled=\"true\"  />              <span>EMS </span>\n                    <span style=\"margin-right: 30px;\">آمبولانس خصوصی</span>\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport']==5\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=5\" type=\"checkbox\" ng-disabled=\"true\"  />              <span>Private Ambulance  </span>\n                    <span style=\"margin-right: 30px;\"> شخصی</span>\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport']==4\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=4\" type=\"checkbox\" ng-disabled=\"true\"  />               <span>By Her Own </span>\n                    <span style=\"margin-right: 30px;\">امداد هوایی </span>\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport']==6\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=6\" type=\"checkbox\" ng-disabled=\"true\"  />             <span>Air Ambulance   </span>\n                    <span style=\"margin-right: 30px;\"> سایر</span>\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport']==8\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=8\" type=\"checkbox\" ng-disabled=\"true\"  />             <span>Other   </span>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between \" style=\"text-align: right;border-top: 1px solid black;\">\n                    <div class=\"col-4 mt-1\">\n                        <p>مراجعه بیمار در 24 ساعت گذشته</p>\n                    </div>\n                    <div class=\"col-4 d-flex mt-1\" style=\"text-align: right;direction: rtl;padding: 0\">\n                        <div class=\"col-4\" >\n                            <span>همین بیمارستان</span>\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems']==0\" type=\"checkbox\"  checked />\n\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems'] !=0\" type=\"checkbox\"   />\n                        </div>\n                        <div class=\"col-4\" style=\"padding: 0\">\n                            <span>بیمارستان دیگر </span>\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems']==1\" type=\"checkbox\"  checked />\n\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems'] !=1\" type=\"checkbox\"   />\n                        </div>\n                        <div class=\"col-4\" style=\"padding: 0\">\n                            <span>خیر</span>\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems']==2\" type=\"checkbox\"  checked />\n\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems'] !=2\" type=\"checkbox\"   />                </div>\n                    </div>\n                    <div class=\"col-4 mt-1\" style=\"text-align: left \">\n                        <p>  :Patient Presence in ED in 24 Past Hours   </p>\n                    </div>\n\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\"  style=\"text-align: right\">\n                    <div class=\"col-4\" style=\"padding: 0\"></div>\n                    <div class=\"col-4 d-flex mt-1\">\n                        <div class=\"col-4\" style=\"padding: 0\">\n                            <span> This Hospital</span>\n                        </div>\n                        <div class=\"col-4\" style=\"padding: 0\">\n                    <span>\n                        Other Hospital\n                    </span>\n                        </div>\n                        <div class=\"col-4\" style=\"padding: 0\">\n                            <span>No</span>\n                        </div>\n\n                    </div>\n                    <div class=\"col-4\" style=\"padding: 0\"></div>\n                </div>\n\n            </div>\n        </div>\n        <div class=\"container\">\n\n            <div class=\"row col-12 br d-flex justify-content-around\" style=\"direction: rtl;\">\n\n                <div class=\"col-12  d-flex justify-content-between \" style=\"text-align: right;\">\n                    <div class=\"d-flex\">\n                        <h5 class=\"font-weight-bold\"> شکایت  اصلی بیمار :</h5>\n                        <span *ngIf=\"triazhInfo['item']['triage_MainDisease']\">\n                    <span *ngFor=\"let i of triazhInfo['item']['triage_MainDisease'] \">\n                        <span *ngFor=\"let a of mainDiseaseArray\">\n                            <span class=\"font-weight-bold\" *ngIf=\"i.mainDiseaseID==a.id\">{{a.mainDiseaseValue}}</span>\n                        </span>\n                </span>\n\n                    <span *ngIf=\"triazhInfo['item']['triageOtherCasesMainDisease']\">\n                        <span class=\"font-weight-bold\"  *ngFor=\"let i of triazhInfo['item']['triageOtherCasesMainDisease'] \">\n                            {{i.description}}\n                        </span>\n                    </span>\n                </span>\n\n                    </div>\n                    <div>\n                <span>Chief Complaint\n                </span>\n                    </div>\n                </div>\n                <div class=\"col-12  \" style=\"text-align: right;flex-wrap: nowrap;\">\n                    <div class=\"d-flex justify-content-between\" style=\"padding: 0\" >\n                        <div class=\"col-2\" style=\"padding: 0;\" >\n                            <p class=\"font-weight-bold\" > <span>سابقه حساسیت دارویی و غذایی: </span>     </p>\n                        </div>\n                        <div class=\"col-6 \" style=\"padding: 0\" *ngIf=\"triazhInfo['item']['triageAllergyDrugs'][0]!=null || triazhInfo['item']['triageFoodSensitivity'][0]!=null\">\n\n                            <div class=\"d-flex\">\n                                <div class=\"\" style=\"padding: 0\" *ngFor=\"let i of aleryDrugFinaly\">\n                                    <span>{{i}},</span>\n\n                                </div>\n                            </div>\n                            <div class=\"col-12 \" style=\"padding: 0\">\n                                <div class=\"d-flex\" style=\"padding: 0\" *ngIf=\"triazhInfo['item']['triageFoodSensitivity']\">\n                                    <div class=\"d-flex\" *ngFor=\"let a of triazhInfo['item']['triageFoodSensitivity'] \">\n                                        <div  class=\"\" *ngFor=\"let i of foodLIst\"  style=\"text-align: right;margin-right: 5px;\">\n                                            <span  *ngIf=\"a.foodSensitivityValue==i.Key\">{{i.Value}}</span>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"col-2 \"  style=\"padding:0;text-align: left;direction: ltr \">\n                            <p style=\"font-size: 12px\" >History of Drug and Food Allergy</p>\n                        </div>\n                    </div>\n\n                </div>\n            </div>\n        </div>\n\n\n\n        <div class=\"container\">\n            <div class=\"col-12 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">\n                <div >\n                    <p> بیماران سطح 1 (شرایط تهدید کننده حیات )</p>\n                </div>\n                <div class=\"\" >\n                    <span>..............................................</span>\n                </div>\n                <div >\n\n                    <p>\n                        Triage level 1 (Life threatening situation)\n                    </p>\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12 d-flex justify-content-between\">\n                    <div>\n                <span>\n                    سطح هوشیاری بیمار:\n\n                </span>\n                    </div>\n                    <div  style=\"text-align: right;direction: rtl;\">\n                <span >\n                    بدون پاسخ\n                </span>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS']==4\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS'] !=4\" type=\"checkbox\"   />              </div>\n                    <div>\n                <span>\n                    پاسخ به محرک دردناک\n               </span>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS']==3\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS'] !=3\" type=\"checkbox\"   />               </div>\n                    <div>\n                <span>\n                    پاسخ به محرک کلامی\n                </span>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS']==2\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS'] !=2\" type=\"checkbox\"   />               </div>\n                    <div>\n                <span>\n                    هوشیار\n               </span>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS']==1\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS'] !=1\" type=\"checkbox\"   />\n                    </div>\n\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\">\n                    <div>\n                <span>\n                    سیستم:(AVPU)\n                </span>\n\n                    </div>\n                    <div>\n                <span>\n                   ( Unresponsive (U\n                 </span>\n                    </div>\n                    <div>\n                <span>\n                  (  Response to Pain Stimulus(P\n                 </span>\n                    </div>\n                    <div>\n                <span>\n                 (   Response to Verbal Stimulus(V\n                 </span>\n                    </div>\n                    <div>\n                <span>\n                  (  Alert (A\n\n                 </span>\n                    </div>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\" style=\"border-top: 1px solid black;\">\n                    <div style=\"border-left: 1px solid black;text-align: right;\">\n                        <label for=\"\">مخاطره راه هوایی</label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['dangerousRespire']==='True'\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['dangerousRespire'] !='Flase'\" type=\"checkbox\"   />\n                        <p>\n                            Airway compromise\n                        </p>\n                    </div>\n                    <div style=\"border-left: 1px solid black;text-align: right;\">\n                        <label for=\"\"> دیسترس شدید تنفسی </label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['respireDistress']==='True'\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['respireDistress'] !='Flase'\" type=\"checkbox\"   />                <p>\n                        Sever Respiratory Distress\n                    </p>\n                    </div>\n                    <div style=\"border-left: 1px solid black;text-align: right;\">\n                        <label for=\"\">  سیانوز</label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['sianosis']==='True'\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['sianosis'] !='Flase'\" type=\"checkbox\"   />                   <p>\n                        Cyanosis\n                    </p>\n                    </div>\n                    <div style=\"border-left: 1px solid black;text-align: right;\">\n                        <label for=\"\">  علایم شوک</label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['shock']==='True'\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\"  *ngIf=\"triazhInfo['item']['shock'] !='Flase'\" type=\"checkbox\"   />\n                        <p>\n                            Signs of Shock\n                        </p>\n                    </div>\n                    <div>\n                        <label for=\"\"> اشباع اکسیژن کمتر از 90 درصد </label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['spo2LowerThan90']==='True'\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['spo2LowerThan90'] !='Flase'\" type=\"checkbox\"   />\n                        <p>\n                            SpO2 < 90\n                        </p>\n                    </div>\n\n                </div>\n\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"col-12 mt-1 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">\n                <div class=\"\">\n                    <p> بیماران سطح 2 </p>\n                </div>\n                <div class=\"p0\" ><span>..............................................................................................................................</span></div>\n                <div class=\"p0\">\n                    <p>\n                        Triage level 2\n                    </p>\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n\n                <div class=\"col-12 d-flex justify-content-between\" >\n                    <div class=\"col-3 text-center\" style=\"border-left: 1px solid black;\">\n                        <label for=\"\">شرایط پر خطر   </label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['highDanger']==='True'\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['highDanger'] =='False'\" type=\"checkbox\"   />\n                               <p>\n                        High Risk Conditions\n                    </p>\n                    </div>\n                    <div class=\"col-4 text-center\" style=\"border-left: 1px solid black;\">\n                        <label for=\"\">\n                            لتارژی خواب آلودگی اختلال جهت یابی\n\n                        </label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['lethargy']==='True'\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['lethargy'] =='False'\" type=\"checkbox\"   />\n                        <p>\n\n                            lethargy/ confusion/ disorientation\n                        </p>\n                    </div>\n                    <div class=\"col-3 text-center\" style=\"border-left: 1px solid black;\">\n                        <label for=\"\">  دیسترس شدید روان </label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['highDistress']==='True'\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['highDistress'] =='False'\" type=\"checkbox\"   />\n                        <p>\n                            Sever psychiatric Distress\n                        </p>\n                    </div>\n                    <div class=\"d-flex col-2 justify-content-between\">\n                        <div style=\"margin-top: 10px\">\n                            <span for=\"\">   درد شدید</span>\n                            <p>\n                                Sever Pain\n\n                            </p>\n                        </div>\n                        <div  style=\"margin-top: 10px;position: relative;margin-left: 10px\" >\n                            <div style=\"padding: 0\">   {{painPrint}}</div>\n                            <div class=\"text-bold-700\" style=\"border-bottom: 1px solid;position: static \"></div>\n                            <div style=\"position: static\" >10</div>\n                        </div>\n\n\n\n\n\n                    </div>\n                </div>\n                <div class=\"col-12 d-flex \" style=\"border-top: 1px solid;\">\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p>سابقه پزشکی </p>\n                        <span>\n                    {{triazhInfo['item']['medicalHistory']}}\n\n                </span>\n                        <p>\n                            Medical history\n                        </p>\n                    </div>\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p>سابقه دارویی </p>\n                        <span>\n                    {{triazhInfo['item']['drugHistory']}}\n\n                </span>\n                        <p>\n                            Drug history\n                        </p>\n                    </div>\n                </div>\n                <div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid;\">\n                    <p class=\"font-weight-bold\">علایم حیاتی  </p>\n                    <p class=\"font-weight-bold\">:sign Vital </p>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\" style=\"flex-wrap: nowrap;\">\n                    <div class=\"\">\n                        <span> فشارخون  :</span>\n                        <span>\n                         {{bp}}\n                </span>\n                        <span>BP <small>mmHg</small></span>\n                    </div>\n                    <div  class=\"\">\n                        <span> تعداد ضربان </span>\n                        <span>   {{pr}} </span>\n                        <span>PR/min</span>\n                    </div>\n                    <div  class=\"\">\n                        <span>تنفس </span>\n                        <span>   {{rr}}    </span>\n                        <span>RR/min</span>\n                    </div>\n                    <div class=\"\">\n                        <span>دمای بدن </span>\n                        <span>  {{t}}   </span>\n                        <span>T</span>\n                    </div>\n                    <div  class=\"\">\n                        <span>درصد اشباع اکسیژن  </span>\n                        <span>  {{spo2}}   </span>\n                        <span>Spo2%</span>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"col-12\" style=\"padding-top: 0;padding-bottom: 0;direction: rtl;text-align: right;\">\n                <p style=\"padding: 0\"> *ثبت عاليم حیاتي برای بیماران سطح 2 با تشخیص پرستار ترياژ و به شرط عدم تاخیر در رسیدگي به بیماران با شرايط پر خطر</p>\n            </div>\n            <div class=\"col-12 mt-1 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">\n                <div class=\"\">\n                    <p> بیماران سطح 3 </p>\n                </div>\n                <div class=\"p0\" ><span>..............................................................................................................................</span></div>\n                <div class=\"p0\">\n                    <p>\n                        Triage level 3\n                    </p>\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12 d-flex \">\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p> تعداد تسهیلات مورد نظر در بخش اورژانس </p>\n                        <p>\n                            دو مورد بیشتر\n                            <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['serviceCountIS']==3\" type=\"checkbox\"  checked />\n\n                            <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['serviceCountIS'] !=3\" type=\"checkbox\"   />\n                        </p>\n                    </div>\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p> TWO & More </p>\n                        <p>\n                            :Number of Required Resources in ED\n                        </p>\n                    </div>\n                </div>\n                <div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid;\">\n                    <p class=\"font-weight-bold\">علایم حیاتی  </p>\n                    <p class=\"font-weight-bold\">:sign Vital </p>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\" style=\"flex-wrap: nowrap;\">\n                    <div class=\"\">\n                        <span>:فشارخون</span>\n                        <span>  {{bp}}  </span>\n                        <span>BP <small>mmHg</small></span>\n                    </div>\n                    <div  class=\"\">\n                        <span>تعداد ضربان</span>\n                        <span>  {{pr}}    </span>\n                        <span>PR/min</span>\n                    </div>\n                    <div  class=\"\">\n                        <span>:تنفس</span>\n                        <span>  {{rr}}   </span>\n                        <span>RR/min</span>\n                    </div>\n                    <div class=\"\">\n                        <span>:دمای بدن</span>\n                        <span>  {{t}}   </span>\n                        <span>T</span>\n                    </div>\n                    <div  class=\"\">\n                        <span>:درصد اشباع اکسیژن </span>\n                        <span>  {{spo2}}   </span>\n                        <span>Spo2%</span>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"col-12 mt-1 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">\n                <div class=\"\">\n                    <p> بیماران سطح 4 و 5 </p>\n                </div>\n                <div class=\"p0\" ><span>..............................................................................................................................</span></div>\n                <div class=\"p0\">\n                    <p>\n                        Triage level 4&5\n                    </p>\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;\">\n                <div class=\"col-12 d-flex \">\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p> تعداد تسهیلات مورد نظر در بخش اورژانس </p>\n                        <p>\n                            یک مورد\n                            <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['serviceCountIS']==2\" type=\"checkbox\"  checked />\n\n                            <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['serviceCountIS'] !=2\" type=\"checkbox\"   />                     </p>\n                        <p>One item</p>\n                    </div>\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p> هیچ</p>\n                        <p>\n                            None\n                            <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['serviceCountIS']==1\" type=\"checkbox\"  checked />\n\n                            <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['serviceCountIS'] !=1\" type=\"checkbox\"   />\n                        </p>\n                        <p>: ED in Resources Required of Number</p>\n                    </div>\n                </div>\n\n            </div>\n        </div>\n        <div class=\"container\" >\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12 d-flex justify-content-between \">\n                    <p> سطح تریاژ بیمار        </p>\n                    <p>\n                        5\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['triageLevelIS']==5\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['triageLevelIS'] !=5\" type=\"checkbox\"   />                     </p>\n                    <p>\n                        4\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['triageLevelIS']==4\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['triageLevelIS'] !=4\" type=\"checkbox\"   />\n                    </p>\n                    <p>\n                        3\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['triageLevelIS']==3\" type=\"checkbox\"  checked />\n\n                        <input  style=\"margin-top: 3px\"*ngIf=\"triazhInfo['item']['triageLevelIS'] !=3\" type=\"checkbox\"   />\n                    </p>\n                    <p>\n                        2\n                        <input *ngIf=\"triazhInfo['item']['triageLevelIS']==2\" type=\"checkbox\"  checked />\n\n                        <input *ngIf=\"triazhInfo['item']['triageLevelIS'] !=2\" type=\"checkbox\"   />\n                    </p>\n                    <p>\n                        1\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['triageLevelIS']==1\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['triageLevelIS'] !=1\" type=\"checkbox\"   />\n                    </p>\n                    <p>\n                        Patient Triage level:\n                    </p>\n\n\n                </div>\n                <div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid;\">\n                    <p class=\"font-weight-bold\">جداسازی بیمار و احتیاطات بیشتر کنترل عفونت   </p>\n                    <p class=\"font-weight-bold\">تماسی\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['separationByInfection']==0\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['separationByInfection'] !=0\" type=\"checkbox\"   />                </p>\n                    <p class=\"font-weight-bold\">قطره ای\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['separationByInfection']==1\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['separationByInfection'] !=1\" type=\"checkbox\"   />\n                    </p>\n                    <p class=\"font-weight-bold\">تنفسی\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['separationByInfection']==2\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['separationByInfection'] !=2\" type=\"checkbox\"   />\n                    </p>\n                    <p class=\"font-weight-bold\">نیاز ندارد\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['separationByInfection']==3\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['separationByInfection'] !=3\" type=\"checkbox\"   />\n                    </p>\n                </div>\n\n                <div class=\"col-12 d-flex d-flex justify-content-between \">\n                    <p class=\"font-weight-bold\">Patient Isolation and More Infection Control Precautions       </p>\n                    <p class=\"font-weight-bold\">Contact\n                    </p>\n                    <p class=\"font-weight-bold\">Droplet\n                    </p>\n                    <p class=\"font-weight-bold\">Airborne\n                    </p>\n                    <p class=\"font-weight-bold\">No Need to Isolation\n                    </p>\n                </div>\n                <div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid black;\">\n                    <div>\n                        <p class=\"font-weight-bold\">ارجاع به</p>\n                    </div>\n                    <div>\n                        <label for=\"\">سرپایی</label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['departure']==3\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['departure'] !=3\" type=\"checkbox\"   />\n                        <span>Fast track</span>\n                    </div>\n                    <div>\n                        <label for=\"\">احیا</label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['departure']==4\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['departure'] !=4\" type=\"checkbox\"   />\n                        <span> CPR</span>\n                    </div>\n                    <div>\n                        <label for=\"\">فضای بستری</label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['departure']==1\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['departure'] !=1\" type=\"checkbox\"   />\n                        <span>Inpatient Area </span>\n                    </div>\n                    <div>\n                        <label for=\"\">سایر...</label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['departure']==8\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['departure'] !=8\" type=\"checkbox\"   />\n                        <span>Other </span>\n                    </div>\n\n                    <div>\n                        <p class=\"font-weight-bold\">  :Refer to </p>\n                    </div>\n\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\" style=\"border-top: 1px solid black;\">\n                    <div class=\"col-6 d-flex\">\n                        <p>ساعت و تاریخ ارجاع</p>\n                        <span>\n                {{triazhInfo['item']['exitTime']}}\n            </span>\n                    </div>\n                    <div class=\"col-6 d-flex\">\n                        <p> نام و نام خانوادگی مهر و امضای پرستار تریاژ  </p>\n                        <span *ngIf=\"pracInfo['item']\">{{pracInfo['item']['firstName']}}</span> <span class=\"mx-1\" *ngIf=\"pracInfo['item']\">{{pracInfo['item']['lastName']}}</span>\n                    </div>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\" >\n                    <div class=\"col-6 d-flex\">\n                        <p> Date & Time of Referral:  </p>\n                        <span></span>\n                    </div>\n                    <div class=\"col-6 d-flex\">\n                        <p>  Triage Nurse’s Name/Signature/Stamp     </p>\n                        <span>.........</span>\n                    </div>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\" style=\"border-top: 1px solid black;\">\n                    <p>توضیحات\n                        <span>......</span>\n                    </p>\n                    <p>\n        <span>\n            .......\n        </span>\n                        Description\n\n                    </p>\n                </div>\n            </div>\n            <div class=\"col-12 d-flex justify-content-between\" >\n                <p>این صفحه فرم صرفا توسط پرستار ترياژ تكمیل مي گردد</p>\n\n                <p>IR.MOHHIM-E01-2.0-9910</p>\n\n\n\n            </div>\n        </div>\n        <br>\n        <!-- page2 -->\n        <div class=\"container\" style=\"margin-top: 50px;\">\n            <div class=\"row col-12 br mt-2 d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12 d-flex justify-content-between\">\n                    <p>\n                        شرح حال و دستورات پزشک\n                    </p>\n                    <p>\n                        :Medical history & Physician Orders\n                    </p>\n                </div>\n                <div class=\"col-12\">\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <p style=\"text-align: right;\">{{triazhInfo['item']['practitionerComment']}}</p>\n                </div>\n\n                <div class=\"col-12\">\n                    <div class=\"d-flex justify-content-between roundBorder   \">\n                        <p>تشخیص...</p>\n                        <p>\n                            Diagnosis....\n                        </p>\n                    </div>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\">\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p>تاریخ و ساعت ویزیت </p>\n                        <p> ........   </p>\n                        <p>Date & Time Of Visit</p>\n\n                    </div>\n                    <div class=\"col-6 d-flex justify-content-between \" style=\"flex-wrap: nowrap;\">\n                        <p style=\"font-size: 10px;\"> نام و نام خانوادگی مهر و امضای پزشک   </p>\n                        <p> ...   </p>\n                        <p style=\"font-size: 10px;\">Physician's Name/Signature/Stamp</p>\n                    </div>\n\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12 d-flex justify-content-between\">\n                    <p>\n                        گزارش پرستاری:\n                    </p>\n                    <p>\n                        :  Nursing Report\n                    </p>\n                </div>\n\n                <div class=\"col-12\" style=\"text-align: right; direction: rtl;\">\n                    <p>\n                        بیمار با نام {{name}}  و نام خانوادگی {{lastName}} با سطح تریاژیک    و با وسیله    {{transporterValue}}وبا شکایت اصلی    <span *ngFor=\"let i of mainVAlueArray\">{{i}},</span>,<span *ngFor=\"let a of eOtherCasesMainDisease\">{{a.description}}</span>             <span *ngIf=\"aleryDrugFinaly.length>0\" > و حساسیت دارویی</span> <span *ngFor=\"let i of aleryDrugFinaly\">{{i}}</span><span *ngIf=\"foodAllerguValue.length>0\">و حساسیت غذایی</span>     <span *ngFor=\"let i of foodAllerguValue\">{{i}},</span>  و در ساعت {{Time}}\n                           به اوراژانس منتقل شد.\n                    </p>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <!-- <p style=\"text-align: right;\">{{triazhInfo['item']['nurseComment']}} </p> -->\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\">\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p>تاریخ و ساعت گزارش </p>\n                        <p> ........   </p>\n                        <p> Report Date & Time:</p>\n\n                    </div>\n                    <div class=\"col-6 d-flex justify-content-between \" style=\"flex-wrap: nowrap;\">\n                        <p style=\"font-size: 10px;\"> نام و نام خانوادگی مهر و امضای پرستار   </p>\n                        <p *ngIf=\"pracInfo['item']\">{{pracInfo['item']['firstName']}}  {{pracInfo['item']['lastName']}}    </p>\n                        <p style=\"font-size: 10px;\">Nurse's Name/Signature/Stamp</p>\n                    </div>\n\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12  \" style=\"text-align: right;\">\n                    <p>\n                        وضعیت نهایی بیمار :\n                    </p>\n\n                </div>\n                <div class=\"col-12 d-flex\" style=\"direction: rtl;text-align: right;\">\n                    <div class=\"col-6\">\n                        <p>بیمار در تاریخ<span>........</span> و ساعت <span>.......</span></p>\n                    </div>\n                    <div class=\"col-6\">\n                        <div>\n                            <input type=\"checkbox\" name=\"\" id=\"\">\n                            <label for=\"\">مرخص گردید</label>\n\n                        </div>\n\n                        <div>\n                            <input type=\"checkbox\" name=\"\" id=\"\">\n                            <label for=\"\">در بخش .......... بستری گردید </label>\n                        </div>\n                        <div>\n                            <input type=\"checkbox\" name=\"\" id=\"\">\n                            <label for=\"\">به درمانگاه  .......... ارجاع شد </label>\n                        </div>\n                        <div>\n                            <input type=\"checkbox\" name=\"\" id=\"\">\n                            <label for=\"\">به بیمارستان  .......... اعزام گردید </label>\n                        </div>\n\n                    </div>\n                </div>\n\n\n\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12  \" style=\"text-align: center;\">\n                    <p>\n                        اجازه معالجه و عمل جراحی (بجز ویزیت)\n                    </p>\n\n                </div>\n                <div class=\"col-12 \" style=\"direction: rtl;text-align: right;\">\n                    <p>\n                        اینجانب ............. بیمار/ساکن......... اجازه میدهم کزشک یا شزشان بیمارستان ...............\n                        هرنوع معالجه و در صورت لزوم عمل جراحی یا انتقال خون که صلاح بداند در مورد اینجانب/بیمار اینجانب به مورد اجرا گذراند و بدینوسیله برایت پزشکان و\n                        کارکنان این بیمارستان را از کلیه عوارض احتمالی اقدامات فوق که در مورد اینجانب/بیمار اینجانب انجام دهند اعلام میدارم.\n                    </p>\n                </div>\n                <div class=\"col-12\" style=\"direction: rtl; text-align: right;\">\n                    <p>\n                        نام و امضای بیمار/همراه بیمار..........\n                    </p>\n                </div>\n                <div class=\"col-12\" style=\"direction: rtl; text-align: right;\">\n                    <p>\n                        نام شاهد1............  تاریخ........ امضا.........\n                    </p>\n                    <p>\n                        نام شاهد2............  تاریخ........ امضا.........\n                    </p>\n\n                </div>\n            </div>\n\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12  \" style=\"text-align: center;\">\n                    <p>\n                        ترخیص با میل شخصی\n                    </p>\n\n                </div>\n                <div class=\"col-12 \" style=\"direction: rtl;text-align: right;\">\n                    <p>\n                        اینجانب ............. با میل شخصی خود بر خلاف صلاحدید و توصیه پزشکان مسئول بیمارستان ............؛این مرکز را با در نظر داشتن عواقب\n                        و خطرات احتمالی ترک می نمایم و اعلام میدارم که هیچ مسئولیتی متوجه مسئولان پزشکان و کارکنان این مرکز نخواهد بود.\n                    </p>\n                </div>\n                <div class=\"col-12  d-flex justify-content-between \" style=\"direction: rtl; text-align: right;\">\n                    <p>\n                        نام و امضای بیمار/همراه بیمار..........\n                    </p>\n                    <p>\n                        نام و امضای یکی از بستگان درجه اول بیمار...........\n                    </p>\n                </div>\n                <div class=\"col-12\" style=\"direction: rtl; text-align: right;\">\n                    <p>\n                        نام شاهد1............  تاریخ........ امضا.........\n                    </p>\n                    <p>\n                        نام شاهد2............  تاریخ........ امضا.........\n                    </p>\n\n                </div>\n            </div>\n\n        </div>\n    </div>\n\n\n\n\n</form>\n\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/teriazh/page5/page5.component.html":
/*!******************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/teriazh/page5/page5.component.html ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<style>\r\n    .pos{\r\n        top: 0;\r\n        right: 0;\r\n        transform: translateY(-50%);\r\n        background-color: #F5F7FA;\r\n\r\n    }\r\n    .Customborder{\r\n        border: 2px solid #fcb103 ;\r\n    }\r\n    .posLft{\r\n        top: 0;\r\n        left: 0;\r\n        transform: translateY(-50%);\r\n        background-color: #F5F7FA;\r\n    }\r\n    .line{\r\n        height: 1px;\r\n        background-color: #fcb103\r\n    }\r\n    .btnW{\r\n        padding-right:20px !important;\r\n        padding-left: 20px !important;\r\n        padding-top: 3px!important;\r\n        padding-bottom: 3px!important;\r\n        border: 1px solid;\r\n        font-size:14px;\r\n        background-color:#fcb103 ;\r\n        color: white;\r\n\r\n    }\r\n    .positive{\r\n\r\n        background: linear-gradient(to right,#8bd424,  #64db1f,#6cc736);\r\n\r\n    }\r\n    .negative{\r\n        background: linear-gradient(to right,#99220f,  #b46919   ,#c78351);\r\n    }\r\n    .middleSpo{\r\n        background: linear-gradient(to right,#df9502,  #f2cb01, #ebe702);\r\n\r\n    }\r\n    .middlePro{\r\n        background: linear-gradient(to right,#fc7f03,  #c46506, #8a4601);\r\n\r\n    }\r\n    .btn{\r\n          border: 1px solid;\r\n          background-color: white;\r\n      }\r\n    .shadow{\r\n                border: 1px solid #eb7c7c ;    \r\n              padding-top: 10px;\r\n              padding-bottom: 10px;\r\n                 box-shadow:  5px 10px 10px #eb7c7c !important;\r\n                 cursor: pointer;\r\n                 border-radius: 10px;\r\n    }\r\n    .header{\r\n        background-color: #063d78;\r\n        color: white;\r\n        padding-top: 5px;\r\n        padding-bottom: 5px;\r\n        display: flex;\r\n        justify-content: space-between;\r\n    }\r\n    .header h5{\r\n        margin-top: 10px;\r\n        margin-left: 10px;\r\n        margin-right: 10px;\r\n    }\r\n\r\n    /*span{*/\r\n        /*font-size: 20px;*/\r\n    /*}*/\r\n    .checkSize{\r\n        width: 15px;\r\n        height: 15px;\r\n    }\r\n    p{\r\n        color: black;\r\n    }\r\n    .white {\r\n    background-color: white;\r\n    }\r\n    table th {\r\n        background-color: #48d9fa;\r\n\r\n    }\r\n    table{\r\n        text-align: center;\r\n    }\r\n    .br{\r\n        border:  2px solid black;\r\n    }\r\n    .p0{\r\n        padding: 0 !important\r\n    }\r\n    .br div{\r\n        padding: 0;\r\n    }\r\n    p,label,h4,h3,h5{\r\n        font-weight: bold;\r\n    }\r\n    .roundBorder{\r\n        border: 2px solid gray;\r\n        border-radius: 10px;\r\n    }\r\n    .myDIv{\r\n        animation: mymove 2s infinite;\r\n        color: white;\r\n        padding-top: 5px;\r\n        padding-bottom: 5px;\r\n        display: flex;\r\n        justify-content: space-between;\r\n    }\r\n    @keyframes mymove {\r\n        from {background-color: #063d78;}\r\n        to {background-color: #2a93d4;}\r\n    }\r\n    input[type=checkbox]{\r\n        width: 15px;\r\n        height: 15px;\r\n        margin-right: 2px;\r\n        margin-left: 2px;\r\n        display: inline;\r\nmargin-top: 3px    }\r\n\r\n\r\n\r\n</style>\r\n\r\n<form action=\"\" [formGroup]=\"level2Form\"  (ngSubmit)=\"onSubmit()\" >\r\n    <div class=\"d-flex justify-content-center\"  style=\"direction: rkhltl;text-align: right;transition: 500ms\"  style=\"font-family: iransans\" *ngIf=\"showResult===true\" >\r\n        <div class=\"alert alert-light col-4 position-absolute   \" style=\"z-index: 1000;font-size: 1.2em;text-align: right;top: 50%;left: 50%;transform: translate(-50%,-50%)\"  role=\"alert\" *ngIf=\"ISsubmitOK===true\">\r\n            <div class=\"d-flex justify-content-center\" >\r\n                <span class=\"mt-3\"> ثبت تریاژ با موفقیت انجام شد..</span>\r\n                <svg xmlns=\"http://www.w3.org/2000/svg\" style=\"color: limegreen;\" width=\"50\" height=\"50\" fill=\"currentColor\" class=\"bi bi-check2-circle\" viewBox=\"0 0 16 16\">\r\n                    <path d=\"M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z\"/>\r\n                    <path d=\"M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z\"/>\r\n                </svg>\r\n\r\n            </div>\r\n            <div class=\"d-flex\" *ngIf=\"ISsubmitOK===true\">\r\n                <p>کد رهگیری :</p>\r\n                <P>{{triageID}}</P>\r\n            </div>\r\n            <div style=\"text-align: left\">\r\n                <button class=\"btn\" type=\"button\" (click)=\"close()\"  style=\"font-family: iransans\"> بستن </button>\r\n            </div>\r\n        </div>\r\n        <div class=\"alert alert-light col-4 position-absolute   \" style=\"z-index: 1000;font-size: 1.2em;text-align: right;top: 50%;left: 50%;transform: translate(-50%,-50%)\"  role=\"alert\" *ngIf=\"isSubmitError===true\">\r\n            <div class=\"d-flex justify-content-center\" >\r\n                <span class=\"mt-3\">{{result}}</span>\r\n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"50\" style=\"color: yellow\" height=\"50\" fill=\"currentColor\" class=\"bi bi-exclamation-octagon\" viewBox=\"0 0 16 16\">\r\n                    <path d=\"M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z\"/>\r\n                    <path d=\"M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z\"/>\r\n                </svg>\r\n\r\n            </div>\r\n            <div style=\"text-align: left\">\r\n                <button class=\"btn\" type=\"button\" (click)=\"close()\"  style=\"font-family: iransans\"> بستن </button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"container-fluid mt-2\" style=\"font-family: Tahoma;\" >\r\n        <div class=\"row mb-1\">\r\n            <div class=\"col-12 \">\r\n                <div class=\"header\" style=\"background: background-color:#f5d020;\r\n        background-image: linear-gradient(315deg, #f5d020 0%, #f53803 74%);\">\r\n                    <h5>سطح تریاژ بیمار 2</h5>\r\n                    <h5 style=\"font-family: Tahoma\">   Patient Triage Level 2</h5>\r\n\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-12 mt-\">\r\n                <div class=\"header\">\r\n                    <h5 style=\"text-align: center;\"> علاِیم حیاتی</h5>\r\n                    <h5 >  :Vital Signs</h5>\r\n\r\n                </div>\r\n            </div>\r\n            <div class=\"col-12 mb-2\">\r\n                <div class=\" d-flex Customborder\"  style=\"background-color:white;height: 120px;\">\r\n\r\n                    <div class=\"col-2\"   style=\"text-align: center\" [ngClass]=\"{'positive':T<38.0 && T>34.0,'negative':T>39 || T<33,'middleSpo':T>38.0 && T<41 || T>31 && T<35,'white':T==0}\" >\r\n                        <div style=\"color: white;\" class=\"shadow mt-3\">\r\n                            <p style=\"font-size: 15px; color: black\">Temperature(C)</p>\r\n                     <input type=\"text\"  [(ngModel)]=\"T\" style=\"background-color: transparent;border:1px solid black;border-radius: 5px;text-align: center;color: black;font-size: 15px; width: 40px;\" value=\"\" formControlName=\"Temperature\">\r\n                        </div>\r\n                    </div>\r\n                    <div class=\" col-2\" style=\"text-align: center\" [ngClass]=\"{'positive':RRInput<26 && RRInput>7,'negative':RRInput>35 || RRInput<8,'middleSpo':RRInput>25 && RRInput<31,'middlePro':RRInput>30 && RRInput<35,'white':RRInput==0}\">\r\n                        <div style=\"color: white;\" class=\"shadow mt-3\">\r\n                            <p>RR(BPM)</p>\r\n                        <input type=\"text\" [(ngModel)]=\"RRInput\" style=\"background-color: transparent;border:1px solid black;border-radius: 5px;text-align: center;color: black;font-size: 15px ;width: 40px;\" value=\"\" formControlName=\"RR\">\r\n                        </div>\r\n                    </div>\r\n\r\n\r\n                    <div class=\" col-2\" style=\"text-align: center\"  [ngClass]=\"{'positive':PRInput<111 && PRInput>49,'negative':PRInput>129,'middleSpo':PRInput>110 && PRInput<121 || PRInput>39 && PRInput<50,'middlePro':PRInput>120 && PRInput<131 || PRInput<41,'white':PRInput==0}\">\r\n                        <div style=\"color: white;\" class=\"shadow mt-3\">\r\n                            <p>PR(BPM)</p>\r\n                          <input type=\"text\" [(ngModel)]=\"PRInput\" style=\"background-color: transparent;border:1px solid black;border-radius: 5px;text-align: center;color: black;font-size: 15px; width: 40px;\" value=\"\"  formControlName=\"PR\">\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\" col-2\" style=\"text-align: center\" [ngClass]=\"{'positive':BPmin<121,'negative':BPmin>139,'middleSpo':BPmin>119 && BPmin<130,'middlePro':BPmin>129 && BPmin<140,'white':BPmin==0}\">\r\n                        <div style=\"color: white;\" class=\"shadow mt-3\">\r\n                            <p> BP(mHg)</p>\r\n                          <input type=\"text\" [(ngModel)]=\"BPmin\" style=\"background-color: transparent;border:1px solid black;border-radius: 5px;text-align: center;color: black;font-size: 15px; width: 40px;\" placeholder=\"min\" formControlName=\"bPMin\">\r\n                        </div>\r\n                    </div>\r\n                    <div class=\" col-2\" style=\"text-align: center\" [ngClass]=\"{'positive':BPmax<81,'negative':BPmax>119,'middleSpo':BPmax>79 && BPmax<91,'middlePro':BPmax>89 && BPmax<121,'white':BPmax==0}\"   >\r\n                        <div style=\"color: white;\" class=\"shadow mt-3\">\r\n                            <p>BP(mHg)</p>\r\n                           <input type=\"text\" [(ngModel)]=\"BPmax\"  style=\"background-color: transparent;border:1px solid black;border-radius: 5px;text-align: center;color: black;font-size: 15px; width: 40px;\"  placeholder=\"max\" formControlName=\"bPMax\">\r\n                        </div>\r\n                    </div>\r\n                    <div class=\" col-2\" style=\"text-align: center\" [ngClass]=\"{\r\n                        'negative':Spo2Input<91,\r\n                        'positive':Spo2Input>95,\r\n                         'middleSpo':Spo2Input>90 && id1<95}\">\r\n                        <div style=\"color: white;\" class=\"shadow mt-3\" >\r\n                            <p> (%)SpO2</p>\r\n                            <input type=\"text\"  style=\"background-color: transparent;border:1px solid black;border-radius: 5px;text-align: center;color: black;font-size: 15px; width: 40px;\" value=\"\" [(ngModel)]=\"Spo2Input\"    formControlName=\"spO2\">\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n\r\n            </div>\r\n            <div class=\"col-12 d-flex\">\r\n                <div class=\"col-6\" style=\"padding-left: 0 !important;height: 300px;overflow:hidden;margin-left: 4px\">\r\n                    <div class=\"header\">\r\n                        <h5 style=\"text-align: center;\">سابقه مصرف دارو </h5>\r\n                        <h5 style=\"text-align: center;\">  Drug History </h5>\r\n                    </div>\r\n                    <div  style=\"border: 1px solid black;background-color: #f2f2f2;height: 193px\" >\r\n                        <div class=\"row mt-2 \" >\r\n                            <div class=\"col-12\" style=\"text-align: right!important;\">\r\n\r\n                                <div class=\"col-12 mt-2\">\r\n                                    <input type=\"text\" class=\"form-control text-left\" placeholder=\"جستجو کنید\"  (input)=\" onSearchChange($event)\"  [(ngModel)]=\"searchText\"  [ngModelOptions]=\"{standalone: true} \" value=\"{{val}}\">\r\n                                </div>\r\n                                <div class=\"col-12\" style=\"height:100px;overflow-y: scroll\" >\r\n                                    <ul class=\"list-group\"  *ngFor=\"let i of ShowDrugList\" >\r\n                                        <li class=\"list-group-item\" >{{i}}</li>\r\n                                    </ul>\r\n                                </div>\r\n\r\n                            </div>\r\n                        </div>\r\n\r\n                        <div class=\"row mt-2\" *ngIf=\"serchlist && serchlist.length>0\">\r\n\r\n\r\n\r\n                            <ul  style=\"position:fixed ;list-style: none;background-color: white;overflow-y: scroll;overflow-x: hidden;height: 300px;z-index: 300;margin-top: -11px;width: 40%\"  >\r\n                                <li (click)=\"set(i)\" class=\"form-control\" *ngFor=\"let i of serchlist;let p=index \" >\r\n                                    <button type=\"button\" style=\"border: none;padding: 0\"  class=\"btn\" > {{i['value'].substring(0,i['value'].length/2) }}</button>\r\n                                </li>\r\n\r\n                            </ul>\r\n\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n\r\n\r\n                <div class=\"col-6\" style=\"padding: 0 !important;\">\r\n                    <div [ngClass]=\"{'header':dangerConditionValid===true,'myDIv':dangerConditionValid===false}\">\r\n                        <h5 style=\"text-align: center;\">   شرایط پرخطر </h5>\r\n\r\n                        <h5 style=\"text-align: center;\"> Threatening Condition </h5>\r\n                        <h5 style=\"text-align: center;\"> Threatening Condition </h5>\r\n                </div>\r\n                   <div style=\"background-color: #f2f2f2;border: 1px solid black;\">\r\n                        <div style=\"margin-top: 20px\">\r\n                        <span  ngDefaultControl formControlName=\"HighRiskSituation\"  >\r\n                           ?\r\n                            Is This a High-Risk Situation\r\n                        </span>\r\n                            <input type=\"checkbox\" class=\"checkSize ml-2\" (click)='getHighRiskSituationValue()'>\r\n                        </div>\r\n                        <div style=\"margin-top: 20px\">\r\n                        <span  >\r\n                           ?\r\n                            Is the  patient Confused,Lethargic,or Disoriented\r\n                        </span>\r\n                            <input type=\"checkbox\" class=\"checkSize ml-2\" (click)=\"getConfused()\">\r\n                        </div>\r\n                        <div style=\"margin-top: 20px\">\r\n                        <span >\r\n                           ?\r\n                            Is the patient in Severe pain or Distress\r\n                        </span>\r\n                            <input type=\"checkbox\" class=\"checkSize ml-2\" (click)=\"getDistress()\" >\r\n                        </div>\r\n                        <div style=\"margin-top: 20px;margin-bottom: 10px;\">\r\n                            <input type=\"number\" style=\"width:50px\" formControlName=\"PainScale\">\r\n                           <span class=\" ml-2\">\r\n\r\n                        Pain Scale\r\n                    </span>   \r\n                        </div>\r\n                    </div>\r\n                </div>\r\n\r\n            </div>\r\n\r\n            \r\n        </div>\r\n    </div>\r\n    <div class=\"container-fluid\">\r\n        <div class=\"row\">\r\n            <div class=\"col-12\">\r\n                <div class=\"header\">\r\n                    <h5 >جداسازی  بیمار و کنترل عفونت</h5>\r\n                    <h5>:Patient Isolation and Higher of  Precaution</h5>\r\n            </div>\r\n            <div class=\"col-12  border justify-content-center d-flex  \" style=\"text-align: right;background-color: #f2f2f2;border: 1px solid black !important;\" ngDefaultControl formControlName=\"Separation;\"  >\r\n                <button type=\"button\" class=\"btn  mt-2 mb-2 ml-2\" [style.background-color]=\"i.BackgroundColour\" [style.color]=\"i.color\" *ngFor='let i of SeparationByInfectionList' (click)=\"getSeparationByInfectionList(i.Key,i)\">\r\n                        {{i.Value}}\r\n                </button>\r\n \r\n            </div>\r\n            </div>\r\n            </div>\r\n            <div class=\"row mt-2\">\r\n                <div class=\"col-12\">\r\n                    <div  [ngClass]=\"{'header':refeValid===true,'myDIv':refeValid===false}\">\r\n                        <h5 style=\"text-align: center;\">\r\n                            ارجاع به\r\n                        </h5>\r\n\r\n                        <h5 >\r\n                            :Refer To\r\n                        </h5>\r\n                </div>\r\n                <div class=\"col-12  border \" style=\"text-align: right;background-color: #f2f2f2;border: 1px solid black !important;\" ngDefaultControl formControlName=\"Departure\"  >\r\n                    <button type=\"button\" [style.background-color]=\"i.BackgroundColour\" [style.color]=\"i.color\" class=\"btn  mt-2 ml-2\"*ngFor=\"let i of departureList\" (click)=\"getDeparture(i.Key,i)\">\r\n                {{i.Value}}                   \r\n                </button>\r\n                       \r\n                </div>\r\n                </div>\r\n                </div>\r\n                \r\n    <button type=\"button\" class=\"btn btn-outline-primary\" [disabled]=\"dangerConditionValid===false || refeValid===false\" (click)=\"onSubmit()\">\r\n        ثبت\r\n    </button>\r\n        <button type=\"button\"  [disabled]=\"printOK===false\" class=\"btn btn-outline-primary col-1\" (click)=\"send()\">\r\n            ثبت و پایان\r\n        </button>\r\n        <button type=\"button\" class=\"btn btn-outline-primary border ml-1\" [disabled]=\"printOK===false\"  printSectionId=\"print-section\" [printStyle]= \"{div: {'direction' : 'rtl'}}\" [useExistingCss]=\"true\" ngxPrint >پرینت تریاژ</button>\r\n        <button type=\"button\" class=\"btn mb-2 btnHover\" style=\"background-color: #3898C5;color: white\" [routerLink]=\"['/teriazh/Patient-Triage']\">\r\n            صفحه قبلی\r\n            <svg  xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-arrow-return-left\" viewBox=\"0 0 16 16\">\r\n                <path fill-rule=\"evenodd\" d=\"M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z\"/>\r\n            </svg>\r\n\r\n        </button>\r\n    </div>\r\n\r\n    <div class=\"container\" style=\"float: right;visibility: hidden;display: none\" id=\"print-section\" *ngIf=\"triazhInfo\">\r\n        <div class=\"col-12 text-center\">\r\n            <h4>وزارت بهداشت درمان و آموزش پزشکی</h4>\r\n            <h5>Ministry of Health & Medical Education</h5>\r\n        </div>\r\n        <div class=\"row \">\r\n            <div class=\"col-12 d-flex justify-content-around\">\r\n\r\n                <h5>دانشگاه علوم پزشکی  </h5>\r\n                <h5><span *ngIf=\"hospital\">\r\n            {{hospital['universityName']}}\r\n        </span></h5>\r\n                <h5>:University of Medical Science </h5>\r\n            </div>\r\n\r\n        </div>\r\n        <div class=\"row \">\r\n            <div class=\"col-12  d-flex justify-content-around\">\r\n\r\n                <h5><span *ngIf=\"hospital\">\r\n            {{hospital['hospitalName']}}\r\n        </span></h5>\r\n                <h5>:Medical Center</h5>\r\n            </div>\r\n        </div>\r\n        <div class=\"row \">\r\n            <div class=\"col-12  d-flex justify-content-around\">\r\n                <div class=\"col-3 \">\r\n                    <div class=\"br\" style=\"width:220px;height:50px; \">\r\n                        شماره پرونده\r\n                        <span>\r\n                            Record No:\r\n                        </span>\r\n                    </div>\r\n\r\n                </div>\r\n                <div class=\" col-6 text-center\">\r\n                    <h5>   فرم تریاژ بخش اورژانس بیمارستان </h5>\r\n                    <h6 class=\"text-bold-700\">HOSPITAL EMERGENCY DEPARTMENT TRIAGE FORM </h6>\r\n                </div>\r\n                <div class=\"col-3 text-left\" style=\"direction: ltr;\">\r\n                    <div style=\"width:220px;height:50px\" class=\"br text-right\">\r\n                <span class=\"text-right\">\r\n                    سطح تریاژ بیمار\r\n               </span>\r\n                        <span class=\"font-weight-bold\">\r\n                  {{triazhInfo['item']['triageLevelIS']}}\r\n               </span></div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"container\" >\r\n            <div class=\"row mt-1 col-12 br d-flex justify-content-around\" style=\"direction: rtl;padding: 0;\">\r\n                <div class=\"col-12 d-flex \">\r\n                    <div class=\"col-3 d-flex justify-content-between \" style=\"border-left: 1px solid black;\" >\r\n                        <p>نام خانوادگی</p>\r\n                        <p class=\"mt-4\">{{triazhInfo['item']['lastName']}}</p>\r\n                        <p>Family Name</p>\r\n                    </div>\r\n                    <div class=\"col-3 d-flex justify-content-between\" style=\"border-left: 1px solid black;\">\r\n                        <p>نام </p>\r\n                        <p class=\"mt-4\">\r\n                            {{triazhInfo['item']['firstName']}}\r\n                        </p>\r\n                        <p> Name</p>\r\n                    </div>\r\n                    <div class=\"col-3 d-flex justify-content-between \" style=\"border-left: 1px solid black;\">\r\n                        <div style=\"text-align: right;\">\r\n                            <p>جنس</p>\r\n                            <div>\r\n                                <label for=\"\">مذکر</label>\r\n                                <input *ngIf=\"triazhInfo['item']['gender']==0\" type=\"checkbox\" ng-disabled=\"true\" checked />\r\n\r\n                                <input *ngIf=\"triazhInfo['item']['gender'] !=0\" type=\"checkbox\" ng-disabled=\"true\"  />\r\n                                <span>F</span>\r\n                                <input type=\"checkbox\" >\r\n                                <label for=\"\" style=\"margin-right: 30px;\">مونث</label>\r\n                                <input *ngIf=\"triazhInfo['item']['gender']==1\" type=\"checkbox\"  checked />\r\n\r\n                                <input *ngIf=\"triazhInfo['item']['gender'] !=1\" type=\"checkbox\"   />\r\n                                <span>M</span>\r\n                            </div>\r\n                        </div>\r\n\r\n                        <div>\r\n                            <p>Sex</p>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"col-3 \">\r\n                        <div class=\"d-flex justify-content-between\">\r\n                            <p>تاریخ مراجعه</p>\r\n                            <!--<p>-->\r\n                            <!--{{triazhInfo['item']['entranceTime']}}-->\r\n                            <!--</p>-->\r\n                            <p>Date of Arrival</p>\r\n                        </div>\r\n                        <div class=\"d-flex justify-content-between\">\r\n                            <p>ساعت مراجعه</p>\r\n                            <p>{{triazhInfo['item']['entranceTime']}}</p>\r\n                            <p>Time of Arrival</p>\r\n                        </div>\r\n                    </div>\r\n\r\n                </div>\r\n                <div class=\"col-12 d-flex justify-content-between \" style=\"border-top: 1px solid black;\">\r\n                    <div class=\"col-6 d-flex justify-content-between\">\r\n                        <div class=\"col-6 d-flex justify-content-between \" style=\"border-left: 1px solid black;\">\r\n                            <p>کد ملی </p>\r\n                            <p>\r\n                                {{triazhInfo['item']['nationalCode']}}\r\n                            </p>\r\n                            <p>National Code</p>\r\n                        </div>\r\n                        <div class=\"col-6 d-flex justify-content-between\" style=\"border-left: 1px solid black;\">\r\n                            <p>تاریخ تولد  </p>\r\n                            <p>\r\n                                {{triazhInfo['item']['birthDate']}}\r\n                            </p>\r\n                            <p>Date of Birth </p>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"col-6 d-flex justify-content-between\">\r\n                        <div>\r\n                            <p>باردار</p>\r\n                        </div>\r\n                        <div>\r\n                            <label for=\"\">بلی </label>\r\n                            <input *ngIf=\"triazhInfo['item']['pregnant']==1\" type=\"checkbox\" ng-disabled=\"true\" checked />\r\n\r\n                            <input *ngIf=\"triazhInfo['item']['pregnant'] !=1\" type=\"checkbox\" ng-disabled=\"true\"  />                  <span>yes</span>\r\n                        </div>\r\n                        <div>\r\n                            <label for=\"\">خیر </label>\r\n                            <input *ngIf=\"triazhInfo['item']['pregnant']==0\" type=\"checkbox\" ng-disabled=\"true\" checked />\r\n\r\n                            <input *ngIf=\"triazhInfo['item']['pregnant'] !=0\" type=\"checkbox\" ng-disabled=\"true\"  />                    <span>No</span>\r\n                        </div>\r\n                        <div>\r\n                            <label for=\"\">نامعلوم </label>\r\n                            <input *ngIf=\"triazhInfo['item']['pregnant']==2\" type=\"checkbox\" ng-disabled=\"true\" checked />\r\n\r\n                            <input *ngIf=\"triazhInfo['item']['pregnant'] !=2\" type=\"checkbox\" ng-disabled=\"true\"  /><small>unknown</small>\r\n                        </div>\r\n                        <div>\r\n                            <p>Pregnant</p>\r\n                        </div>\r\n\r\n\r\n                    </div>\r\n\r\n                </div>\r\n\r\n\r\n\r\n            </div>\r\n        </div>\r\n        <div class=\"container\">\r\n            <div class=\"row col-12 br d-flex justify-content-around\" style=\"direction: rtl;padding: 0;border-top: none\">\r\n                <div class=\"col-12 mt-1 d-flex justify-content-between\" style=\"text-align: right;\">\r\n                    <h6>نحوه مراجعه</h6>\r\n                    <h6>:Arrival Mode </h6>\r\n                </div>\r\n                <div class=\"col-12 mt-1 \" style=\"text-align: right;\">\r\n                    <span>آمبولانس 115</span>\r\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport']==2\" type=\"checkbox\" ng-disabled=\"true\" checked />\r\n\r\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=2\" type=\"checkbox\" ng-disabled=\"true\"  />              <span>EMS </span>\r\n                    <span style=\"margin-right: 30px;\">آمبولانس خصوصی</span>\r\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport']==5\" type=\"checkbox\" ng-disabled=\"true\" checked />\r\n\r\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=5\" type=\"checkbox\" ng-disabled=\"true\"  />              <span>Private Ambulance  </span>\r\n                    <span style=\"margin-right: 30px;\"> شخصی</span>\r\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport']==4\" type=\"checkbox\" ng-disabled=\"true\" checked />\r\n\r\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=4\" type=\"checkbox\" ng-disabled=\"true\"  />               <span>By Her Own </span>\r\n                    <span style=\"margin-right: 30px;\">امداد هوایی </span>\r\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport']==6\" type=\"checkbox\" ng-disabled=\"true\" checked />\r\n\r\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=6\" type=\"checkbox\" ng-disabled=\"true\"  />             <span>Air Ambulance   </span>\r\n                    <span style=\"margin-right: 30px;\"> سایر</span>\r\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport']==8\" type=\"checkbox\" ng-disabled=\"true\" checked />\r\n\r\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=8\" type=\"checkbox\" ng-disabled=\"true\"  />             <span>Other   </span>\r\n                </div>\r\n                <div class=\"col-12 d-flex justify-content-between \" style=\"text-align: right;border-top: 1px solid black;\">\r\n                    <div class=\"col-4 mt-1\">\r\n                        <p>مراجعه بیمار در 24 ساعت گذشته</p>\r\n                    </div>\r\n                    <div class=\"col-4 d-flex mt-1\" style=\"text-align: right;direction: rtl;padding: 0\">\r\n                        <div class=\"col-4\" >\r\n                            <span>همین بیمارستان</span>\r\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems']==0\" type=\"checkbox\"  checked />\r\n\r\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems'] !=0\" type=\"checkbox\"   />\r\n                        </div>\r\n                        <div class=\"col-4\" style=\"padding: 0\">\r\n                            <span>بیمارستان دیگر </span>\r\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems']==1\" type=\"checkbox\"  checked />\r\n\r\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems'] !=1\" type=\"checkbox\"   />\r\n                        </div>\r\n                        <div class=\"col-4\" style=\"padding: 0\">\r\n                            <span>خیر</span>\r\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems']==2\" type=\"checkbox\"  checked />\r\n\r\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems'] !=2\" type=\"checkbox\"   />                </div>\r\n                    </div>\r\n                    <div class=\"col-4 mt-1\" style=\"text-align: left \">\r\n                        <p>  :Patient Presence in ED in 24 Past Hours   </p>\r\n                    </div>\r\n\r\n                </div>\r\n                <div class=\"col-12 d-flex justify-content-between\"  style=\"text-align: right\">\r\n                    <div class=\"col-4\" style=\"padding: 0\"></div>\r\n                    <div class=\"col-4 d-flex mt-1\">\r\n                        <div class=\"col-4\" style=\"padding: 0\">\r\n                            <span> This Hospital</span>\r\n                        </div>\r\n                        <div class=\"col-4\" style=\"padding: 0\">\r\n                    <span>\r\n                        Other Hospital\r\n                    </span>\r\n                        </div>\r\n                        <div class=\"col-4\" style=\"padding: 0\">\r\n                            <span>No</span>\r\n                        </div>\r\n\r\n                    </div>\r\n                    <div class=\"col-4\" style=\"padding: 0\"></div>\r\n                </div>\r\n\r\n            </div>\r\n        </div>\r\n        <div class=\"container\">\r\n\r\n            <div class=\"row col-12 br d-flex justify-content-around\" style=\"direction: rtl;\">\r\n\r\n                <div class=\"col-12  d-flex justify-content-between \" style=\"text-align: right;\">\r\n                    <div class=\"d-flex\">\r\n                        <h5 class=\"font-weight-bold\"> شکایت  اصلی بیمار :</h5>\r\n                        <span *ngIf=\"triazhInfo['item']['triage_MainDisease']\">\r\n                    <span *ngFor=\"let i of triazhInfo['item']['triage_MainDisease'] \">\r\n                        <span *ngFor=\"let a of mainDiseaseArray\">\r\n                            <span class=\"font-weight-bold\" *ngIf=\"i.mainDiseaseID==a.id\">{{a.mainDiseaseValue}}</span>\r\n                        </span>\r\n                </span>\r\n\r\n                    <span *ngIf=\"triazhInfo['item']['triageOtherCasesMainDisease']\">\r\n                        <span class=\"font-weight-bold\"  *ngFor=\"let i of triazhInfo['item']['triageOtherCasesMainDisease'] \">\r\n                            {{i.description}}\r\n                        </span>\r\n                    </span>\r\n                </span>\r\n\r\n                    </div>\r\n                    <div>\r\n                <span>Chief Complaint\r\n                </span>\r\n                    </div>\r\n                </div>\r\n                <div class=\"col-12  \" style=\"text-align: right;flex-wrap: nowrap;\">\r\n                    <div class=\"d-flex justify-content-between\" style=\"padding: 0\" >\r\n                        <div class=\"col-2\" style=\"padding: 0;\" >\r\n                            <p class=\"font-weight-bold\" > <span>سابقه حساسیت دارویی و غذایی: </span>     </p>\r\n                        </div>\r\n                        <div class=\"col-6 \" style=\"padding: 0\" *ngIf=\"triazhInfo['item']['triageAllergyDrugs'][0]!=null || triazhInfo['item']['triageFoodSensitivity'][0]!=null\">\r\n\r\n                            <div class=\"d-flex\">\r\n                                <div class=\"\" style=\"padding: 0\" *ngFor=\"let i of aleryDrugFinaly\">\r\n                                    <span>{{i}},</span>\r\n\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"col-12 \" style=\"padding: 0\">\r\n                                <div class=\"d-flex\" style=\"padding: 0\" *ngIf=\"triazhInfo['item']['triageFoodSensitivity']\">\r\n                                    <div class=\"d-flex\" *ngFor=\"let a of triazhInfo['item']['triageFoodSensitivity'] \">\r\n                                        <div  class=\"\" *ngFor=\"let i of foodLIst\"  style=\"text-align: right;margin-right: 5px;\">\r\n                                            <span  *ngIf=\"a.foodSensitivityValue==i.Key\">{{i.Value}}</span>\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n\r\n                        <div class=\"col-2 \"  style=\"padding:0;text-align: left;direction: ltr \">\r\n                            <p style=\"font-size: 12px\" >History of Drug and Food Allergy</p>\r\n                        </div>\r\n                    </div>\r\n\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n\r\n\r\n        <div class=\"container\">\r\n            <div class=\"col-12 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">\r\n                <div >\r\n                    <p> بیماران سطح 1 (شرایط تهدید کننده حیات )</p>\r\n                </div>\r\n                <div class=\"\" >\r\n                    <span>..............................................</span>\r\n                </div>\r\n                <div >\r\n\r\n                    <p>\r\n                        Triage level 1 (Life threatening situation)\r\n                    </p>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"container\">\r\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\r\n                <div class=\"col-12 d-flex justify-content-between\">\r\n                    <div>\r\n                <span>\r\n                    سطح هوشیاری بیمار:\r\n\r\n                </span>\r\n                    </div>\r\n                    <div  style=\"text-align: right;direction: rtl;\">\r\n                <span >\r\n                    بدون پاسخ\r\n                </span>\r\n                        <input *ngIf=\"triazhInfo['item']['stateOfAlertIS']==4\" type=\"checkbox\"  checked />\r\n\r\n                        <input *ngIf=\"triazhInfo['item']['stateOfAlertIS'] !=4\" type=\"checkbox\"   />              </div>\r\n                    <div>\r\n                <span>\r\n                    پاسخ به محرک دردناک\r\n               </span>\r\n                        <input *ngIf=\"triazhInfo['item']['stateOfAlertIS']==3\" type=\"checkbox\"  checked />\r\n\r\n                        <input *ngIf=\"triazhInfo['item']['stateOfAlertIS'] !=3\" type=\"checkbox\"   />               </div>\r\n                    <div>\r\n                <span>\r\n                    پاسخ به محرک کلامی\r\n                </span>\r\n                        <input *ngIf=\"triazhInfo['item']['stateOfAlertIS']==2\" type=\"checkbox\"  checked />\r\n\r\n                        <input *ngIf=\"triazhInfo['item']['stateOfAlertIS'] !=2\" type=\"checkbox\"   />               </div>\r\n                    <div>\r\n                <span>\r\n                    هوشیار\r\n               </span>\r\n                        <input *ngIf=\"triazhInfo['item']['stateOfAlertIS']==1\" type=\"checkbox\"  checked />\r\n\r\n                        <input *ngIf=\"triazhInfo['item']['stateOfAlertIS'] !=1\" type=\"checkbox\"   />\r\n                    </div>\r\n\r\n                </div>\r\n                <div class=\"col-12 d-flex justify-content-between\">\r\n                    <div>\r\n                <span>\r\n                    سیستم:(AVPU)\r\n                </span>\r\n\r\n                    </div>\r\n                    <div>\r\n                <span>\r\n                    Unresponsive (U)\r\n                 </span>\r\n                    </div>\r\n                    <div>\r\n                <span>\r\n                    Response to Pain Stimulus(P)\r\n                 </span>\r\n                    </div>\r\n                    <div>\r\n                <span>\r\n                    Response to Verbal Stimulus(V)\r\n                 </span>\r\n                    </div>\r\n                    <div>\r\n                <span>\r\n                    Alert (A)\r\n\r\n                 </span>\r\n                    </div>\r\n                </div>\r\n                <div class=\"col-12 d-flex justify-content-between\" style=\"border-top: 1px solid black;\">\r\n                    <div style=\"border-left: 1px solid black;text-align: right;\">\r\n                        <label for=\"\">مخاطره راه هوایی</label>\r\n                        <input *ngIf=\"triazhInfo['item']['dangerousRespire']==='True'\" type=\"checkbox\"  checked />\r\n\r\n                        <input *ngIf=\"triazhInfo['item']['dangerousRespire'] !='Flase'\" type=\"checkbox\"   />\r\n                        <p>\r\n                            Airway compromise\r\n                        </p>\r\n                    </div>\r\n                    <div style=\"border-left: 1px solid black;text-align: right;\">\r\n                        <label for=\"\"> دیسترس شدید تنفسی </label>\r\n                        <input *ngIf=\"triazhInfo['item']['respireDistress']==='True'\" type=\"checkbox\"  checked />\r\n\r\n                        <input *ngIf=\"triazhInfo['item']['respireDistress'] !='Flase'\" type=\"checkbox\"   />                <p>\r\n                        Sever Respiratory Distress\r\n                    </p>\r\n                    </div>\r\n                    <div style=\"border-left: 1px solid black;text-align: right;\">\r\n                        <label for=\"\">  سیانوز</label>\r\n                        <input *ngIf=\"triazhInfo['item']['sianosis']==='True'\" type=\"checkbox\"  checked />\r\n\r\n                        <input *ngIf=\"triazhInfo['item']['sianosis'] !='Flase'\" type=\"checkbox\"   />                   <p>\r\n                        Cyanosis\r\n                    </p>\r\n                    </div>\r\n                    <div style=\"border-left: 1px solid black;text-align: right;\">\r\n                        <label for=\"\">  علایم شوک</label>\r\n                        <input *ngIf=\"triazhInfo['item']['shock']==='True'\" type=\"checkbox\"  checked />\r\n\r\n                        <input *ngIf=\"triazhInfo['item']['shock'] !='Flase'\" type=\"checkbox\"   />\r\n                        <p>\r\n                            Signs of Shock\r\n                        </p>\r\n                    </div>\r\n                    <div>\r\n                        <label for=\"\"> اشباع اکسیژن کمتر از 90 درصد </label>\r\n                        <input *ngIf=\"triazhInfo['item']['spo2LowerThan90']==='True'\" type=\"checkbox\"  checked />\r\n\r\n                        <input *ngIf=\"triazhInfo['item']['spo2LowerThan90'] !='Flase'\" type=\"checkbox\"   />\r\n                        <p>\r\n                            SpO2 < 90\r\n                        </p>\r\n                    </div>\r\n\r\n                </div>\r\n\r\n            </div>\r\n        </div>\r\n        <div class=\"container\">\r\n            <div class=\"col-12 mt-1 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">\r\n                <div class=\"\">\r\n                    <p> بیماران سطح 2 </p>\r\n                </div>\r\n                <div class=\"p0\" ><span>..............................................................................................................................</span></div>\r\n                <div class=\"p0\">\r\n                    <p>\r\n                        Triage level 2\r\n                    </p>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"container\">\r\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\r\n\r\n                <div class=\"col-12 d-flex justify-content-between\" >\r\n                    <div class=\"col-3 text-center\" style=\"border-left: 1px solid black;\">\r\n                        <label for=\"\">شرایط پر خطر   </label>\r\n                        <input *ngIf=\"triazhInfo['item']['highDanger']==='True'\" type=\"checkbox\"  checked />\r\n\r\n                        <input *ngIf=\"triazhInfo['item']['highDanger'] =='False'\" type=\"checkbox\"   />                <p>\r\n                        High Risk Conditions\r\n                    </p>\r\n                    </div>\r\n                    <div class=\"col-4 text-center\" style=\"border-left: 1px solid black;\">\r\n                        <label for=\"\">\r\n                            لتارژی خواب آلودگی اختلال جهت یابی\r\n\r\n                        </label>\r\n                        <input *ngIf=\"triazhInfo['item']['lethargy']==='True'\" type=\"checkbox\"  checked />\r\n\r\n                        <input *ngIf=\"triazhInfo['item']['lethargy'] =='False'\" type=\"checkbox\"   />\r\n                        <p>\r\n\r\n                            lethargy/ confusion/ disorientation\r\n                        </p>\r\n                    </div>\r\n                    <div class=\"col-3 text-center\" style=\"border-left: 1px solid black;\">\r\n                        <label for=\"\">  دیسترس شدید روان </label>\r\n                        <input *ngIf=\"triazhInfo['item']['highDistress']==='True'\" type=\"checkbox\"  checked />\r\n\r\n                        <input *ngIf=\"triazhInfo['item']['highDistress'] =='False'\" type=\"checkbox\"   />\r\n                        <p>\r\n                            Sever psychiatric Distress\r\n                        </p>\r\n                    </div>\r\n                    <div class=\"d-flex col-2 justify-content-between\">\r\n                        <div style=\"margin-top: 10px\">\r\n                            <span for=\"\">   درد شدید</span>\r\n                            <p>\r\n                                Sever Pain\r\n\r\n                            </p>\r\n                        </div>\r\n                        <div  style=\"margin-top: 10px;position: relative;margin-left: 10px\" >\r\n                            <div style=\"padding: 0\">   {{painPrint}}</div>\r\n                            <div class=\"text-bold-700\" style=\"border-bottom: 1px solid;position: static \"></div>\r\n                            <div style=\"position: static\" >10</div>\r\n                        </div>\r\n\r\n\r\n\r\n\r\n\r\n                    </div>\r\n                </div>\r\n                <div class=\"col-12 d-flex \" style=\"border-top: 1px solid;\">\r\n                    <div class=\"col-6 d-flex justify-content-between \">\r\n                        <p>سابقه پزشکی </p>\r\n                        <span>\r\n                    {{triazhInfo['item']['medicalHistory']}}\r\n\r\n                </span>\r\n                        <p>\r\n                            Medical history\r\n                        </p>\r\n                    </div>\r\n                    <div class=\"col-6 d-flex justify-content-between \">\r\n                        <p>سابقه دارویی </p>\r\n                        <!--<span>-->\r\n                            <!--<div *ngIf=\"triazhInfo['item']['drugHistory']\">-->\r\n                                <!--<div *ngFor=\"let a of triazhInfo['item']['drugHistory'] \">-->\r\n                                    <!--&lt;!&ndash; <div *ngIf=\"AllergyDrugListSepas\">-->\r\n                                       <!--<div *ngFor=\"let i of AllergyDrugListSepas['items']\">-->\r\n                                           <!--<span  *ngIf=\"a.sepas_ERXCode==i.code\">{{i.value}}</span>-->\r\n                                       <!--</div>-->\r\n                                    <!--</div> &ndash;&gt;-->\r\n                                    <!--{{a.strDrugCode}}-->\r\n                               <!--</div>-->\r\n                            <!--</div>-->\r\n                    <!--&lt;!&ndash; {{triazhInfo['item']['drugHistory']}} &ndash;&gt;-->\r\n\r\n                <!--</span>-->\r\n                        <div *ngFor=\"let i of drugListFinalArray\">\r\n\r\n                            <span>{{i}}</span>\r\n                        </div>\r\n                        <p>\r\n                            Drug history\r\n                        </p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid;\">\r\n                    <p class=\"font-weight-bold\">علایم حیاتی  </p>\r\n                    <p class=\"font-weight-bold\">:sign Vital </p>\r\n                </div>\r\n                <div class=\"col-12 d-flex justify-content-between\" style=\"flex-wrap: nowrap;\">\r\n                    <div class=\"\">\r\n                        <span> فشارخون  :</span>\r\n                        <span>\r\n                         {{bpPrint}}\r\n                </span>\r\n                        <span>BP <small>mmHg</small></span>\r\n                    </div>\r\n                    <div  class=\"\">\r\n                        <span> تعداد ضربان </span>\r\n                        <span>   {{prPrint}} </span>\r\n                        <span>PR/min</span>\r\n                    </div>\r\n                    <div  class=\"\">\r\n                        <span>تنفس </span>\r\n                        <span>   {{rrPrint}}    </span>\r\n                        <span>RR/min</span>\r\n                    </div>\r\n                    <div class=\"\">\r\n                        <span>دمای بدن </span>\r\n                        <span>  {{tPrint}}   </span>\r\n                        <span>T</span>\r\n                    </div>\r\n                    <div  class=\"\">\r\n                        <span>درصد اشباع اکسیژن  </span>\r\n                        <span>  {{spo2Print}}   </span>\r\n                        <span>Spo2%</span>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"container\">\r\n            <div class=\"col-12\" style=\"padding-top: 0;padding-bottom: 0;direction: rtl;text-align: right;\">\r\n                <p style=\"padding: 0\"> *ثبت عاليم حیاتي برای بیماران سطح 2 با تشخیص پرستار ترياژ و به شرط عدم تاخیر در رسیدگي به بیماران با شرايط پر خطر</p>\r\n            </div>\r\n            <div class=\"col-12 mt-1 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">\r\n                <div class=\"\">\r\n                    <p> بیماران سطح 3 </p>\r\n                </div>\r\n                <div class=\"p0\" ><span>..............................................................................................................................</span></div>\r\n                <div class=\"p0\">\r\n                    <p>\r\n                        Triage level 3\r\n                    </p>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"container\">\r\n\r\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\r\n                <div class=\"col-12 d-flex \">\r\n                    <div class=\"col-6 d-flex justify-content-between \">\r\n                        <p> تعداد تسهیلات مورد نظر در بخش اورژانس </p>\r\n                        <p>\r\n                            دو مورد بیشتر\r\n                            <input *ngIf=\"triazhInfo['item']['serviceCountIS']==3\" type=\"checkbox\"  checked />\r\n\r\n                            <input *ngIf=\"triazhInfo['item']['serviceCountIS'] !=3\" type=\"checkbox\"   />\r\n                        </p>\r\n                    </div>\r\n                    <div class=\"col-6 d-flex justify-content-between \">\r\n                        <p> TWO & More </p>\r\n                        <p>\r\n                            :Number of Required Resources in ED\r\n                        </p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid;\">\r\n                    <p class=\"font-weight-bold\">علایم حیاتی  </p>\r\n                    <p class=\"font-weight-bold\">:sign Vital </p>\r\n                </div>\r\n                <div class=\"col-12 d-flex justify-content-between\" style=\"flex-wrap: nowrap;\">\r\n                    <div class=\"\">\r\n                        <span>:فشارخون</span>\r\n                        <span>  {{bpPrint}}   </span>\r\n                        <span>BP <small>mmHg</small></span>\r\n                    </div>\r\n                    <div  class=\"\">\r\n                        <span>تعداد ضربان</span>\r\n                        <span>  {{prPrint}}    </span>\r\n                        <span>PR/min</span>\r\n                    </div>\r\n                    <div  class=\"\">\r\n                        <span>:تنفس</span>\r\n                        <span>  {{rrPrint}}   </span>\r\n                        <span>RR/min</span>\r\n                    </div>\r\n                    <div class=\"\">\r\n                        <span>:دمای بدن</span>\r\n                        <span>  {{tPrint}}   </span>\r\n                        <span>T</span>\r\n                    </div>\r\n                    <div  class=\"\">\r\n                        <span>:درصد اشباع اکسیژن </span>\r\n                        <span>  {{spo2Print}}   </span>\r\n                        <span>Spo2%</span>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"container\">\r\n            <div class=\"col-12 mt-1 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">\r\n                <div class=\"\">\r\n                    <p> بیماران سطح 4 و 5 </p>\r\n                </div>\r\n                <div class=\"p0\" ><span>..............................................................................................................................</span></div>\r\n                <div class=\"p0\">\r\n                    <p>\r\n                        Triage level 4&5\r\n                    </p>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"container\">\r\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;\">\r\n                <div class=\"col-12 d-flex \">\r\n                    <div class=\"col-6 d-flex justify-content-between \">\r\n                        <p> تعداد تسهیلات مورد نظر در بخش اورژانس </p>\r\n                        <p>\r\n                            یک مورد\r\n                            <input *ngIf=\"triazhInfo['item']['serviceCountIS']==2\" type=\"checkbox\"  checked />\r\n\r\n                            <input *ngIf=\"triazhInfo['item']['serviceCountIS'] !=2\" type=\"checkbox\"   />                     </p>\r\n                        <p>One item</p>\r\n                    </div>\r\n                    <div class=\"col-6 d-flex justify-content-between \">\r\n                        <p> هیچ</p>\r\n                        <p>\r\n                            None\r\n                            <input *ngIf=\"triazhInfo['item']['serviceCountIS']==1\" type=\"checkbox\"  checked />\r\n\r\n                            <input *ngIf=\"triazhInfo['item']['serviceCountIS'] !=1\" type=\"checkbox\"   />\r\n                        </p>\r\n                        <p>: ED in Resources Required of Number</p>\r\n                    </div>\r\n                </div>\r\n\r\n            </div>\r\n        </div>\r\n        <div class=\"container\" >\r\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\r\n                <div class=\"col-12 d-flex justify-content-between \">\r\n                    <p> سطح تریاژ بیمار        </p>\r\n                    <p>\r\n                        5\r\n                        <input *ngIf=\"triazhInfo['item']['triageLevelIS']==5\" type=\"checkbox\"  checked />\r\n\r\n                        <input *ngIf=\"triazhInfo['item']['triageLevelIS'] !=5\" type=\"checkbox\"   />                     </p>\r\n                    <p>\r\n                        4\r\n                        <input *ngIf=\"triazhInfo['item']['triageLevelIS']==4\" type=\"checkbox\"  checked />\r\n\r\n                        <input *ngIf=\"triazhInfo['item']['triageLevelIS'] !=4\" type=\"checkbox\"   />\r\n                    </p>\r\n                    <p>\r\n                        3\r\n                        <input *ngIf=\"triazhInfo['item']['triageLevelIS']==3\" type=\"checkbox\"  checked />\r\n\r\n                        <input *ngIf=\"triazhInfo['item']['triageLevelIS'] !=3\" type=\"checkbox\"   />\r\n                    </p>\r\n                    <p>\r\n                        2\r\n                        <input *ngIf=\"triazhInfo['item']['triageLevelIS']==2\" type=\"checkbox\"  checked />\r\n\r\n                        <input *ngIf=\"triazhInfo['item']['triageLevelIS'] !=2\" type=\"checkbox\"   />\r\n                    </p>\r\n                    <p>\r\n                        1\r\n                        <input *ngIf=\"triazhInfo['item']['triageLevelIS']==1\" type=\"checkbox\"  checked />\r\n\r\n                        <input *ngIf=\"triazhInfo['item']['triageLevelIS'] !=1\" type=\"checkbox\"   />\r\n                    </p>\r\n                    <p>\r\n                        Patient Triage level:\r\n                    </p>\r\n\r\n\r\n                </div>\r\n                <div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid;\">\r\n                    <p class=\"font-weight-bold\">جداسازی بیمار و احتیاطات بیشتر کنترل عفونت   </p>\r\n                    <p class=\"font-weight-bold\">تماسی\r\n                        <input *ngIf=\"triazhInfo['item']['separationByInfection']==0\" type=\"checkbox\"  checked />\r\n\r\n                        <input *ngIf=\"triazhInfo['item']['separationByInfection'] !=0\" type=\"checkbox\"   />                </p>\r\n                    <p class=\"font-weight-bold\">قطره ای\r\n                        <input *ngIf=\"triazhInfo['item']['separationByInfection']==1\" type=\"checkbox\"  checked />\r\n\r\n                        <input *ngIf=\"triazhInfo['item']['separationByInfection'] !=1\" type=\"checkbox\"   />\r\n                    </p>\r\n                    <p class=\"font-weight-bold\">تنفسی\r\n                        <input *ngIf=\"triazhInfo['item']['separationByInfection']==2\" type=\"checkbox\"  checked />\r\n\r\n                        <input *ngIf=\"triazhInfo['item']['separationByInfection'] !=2\" type=\"checkbox\"   />\r\n                    </p>\r\n                    <p class=\"font-weight-bold\">نیاز ندارد\r\n                        <input *ngIf=\"triazhInfo['item']['separationByInfection']==3\" type=\"checkbox\"  checked />\r\n\r\n                        <input *ngIf=\"triazhInfo['item']['separationByInfection'] !=3\" type=\"checkbox\"   />\r\n                    </p>\r\n                </div>\r\n\r\n                <div class=\"col-12 d-flex d-flex justify-content-between \">\r\n                    <p class=\"font-weight-bold\">Patient Isolation and More Infection Control Precautions       </p>\r\n                    <p class=\"font-weight-bold\">Contact\r\n                    </p>\r\n                    <p class=\"font-weight-bold\">Droplet\r\n                    </p>\r\n                    <p class=\"font-weight-bold\">Airborne\r\n                    </p>\r\n                    <p class=\"font-weight-bold\">No Need to Isolation\r\n                    </p>\r\n                </div>\r\n                <div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid black;\">\r\n                    <div>\r\n                        <p class=\"font-weight-bold\">ارجاع به</p>\r\n                    </div>\r\n                    <div>\r\n                        <label for=\"\">سرپایی</label>\r\n                        <input *ngIf=\"triazhInfo['item']['departure']==3\" type=\"checkbox\"  checked />\r\n\r\n                        <input *ngIf=\"triazhInfo['item']['departure'] !=3\" type=\"checkbox\"   />\r\n                        <span>Fast track</span>\r\n                    </div>\r\n                    <div>\r\n                        <label for=\"\">احیا</label>\r\n                        <input *ngIf=\"triazhInfo['item']['departure']==4\" type=\"checkbox\"  checked />\r\n\r\n                        <input *ngIf=\"triazhInfo['item']['departure'] !=4\" type=\"checkbox\"   />\r\n                        <span> CPR</span>\r\n                    </div>\r\n                    <div>\r\n                        <label for=\"\">فضای بستری</label>\r\n                        <input *ngIf=\"triazhInfo['item']['departure']==1\" type=\"checkbox\"  checked />\r\n\r\n                        <input *ngIf=\"triazhInfo['item']['departure'] !=1\" type=\"checkbox\"   />\r\n                        <span>Inpatient Area </span>\r\n                    </div>\r\n                    <div>\r\n                        <label for=\"\">سایر...</label>\r\n                        <input *ngIf=\"triazhInfo['item']['departure']==8\" type=\"checkbox\"  checked />\r\n\r\n                        <input *ngIf=\"triazhInfo['item']['departure'] !=8\" type=\"checkbox\"   />\r\n                        <span>Other </span>\r\n                    </div>\r\n\r\n                    <div>\r\n                        <p class=\"font-weight-bold\">  :Refer to </p>\r\n                    </div>\r\n\r\n                </div>\r\n                <div class=\"col-12 d-flex justify-content-between\" style=\"border-top: 1px solid black;\">\r\n                    <div class=\"col-6 d-flex\">\r\n                        <p>ساعت و تاریخ ارجاع</p>\r\n                        <span>\r\n                {{triazhInfo['item']['exitTime']}}\r\n            </span>\r\n                    </div>\r\n                    <div class=\"col-6 d-flex\">\r\n                        <p> نام و نام خانوتدگی مهر و امضای پرستار تریاژ  </p>\r\n                        <span *ngIf=\"pracInfo['item']\">{{pracInfo['item']['firstName']}}</span> <span class=\"mx-1\" *ngIf=\"pracInfo['item']\">{{pracInfo['item']['lastName']}}</span>\r\n                    </div>\r\n                </div>\r\n                <div class=\"col-12 d-flex justify-content-between\" >\r\n                    <div class=\"col-6 d-flex\">\r\n                        <p> Date & Time of Referral:  </p>\r\n                        <span></span>\r\n                    </div>\r\n                    <div class=\"col-6 d-flex\">\r\n                        <p>  Triage Nurse’s Name/Signature/Stamp     </p>\r\n                        <span>.........</span>\r\n                    </div>\r\n                </div>\r\n                <div class=\"col-12 d-flex justify-content-between\" style=\"border-top: 1px solid black;\">\r\n                    <p>توضیحات\r\n                        <span>......</span>\r\n                    </p>\r\n                    <p>\r\n        <span>\r\n            .......\r\n        </span>\r\n                        Description\r\n\r\n                    </p>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-12 d-flex justify-content-between\" >\r\n                <p>این صفحه فرم صرفا توسط پرستار ترياژ تكمیل مي گردد</p>\r\n\r\n                <p>IR.MOHHIM-E01-2.0-9910</p>\r\n\r\n\r\n\r\n            </div>\r\n        </div>\r\n        <br>\r\n        <!-- page2 -->\r\n        <div class=\"container\" style=\"margin-top: 50px;\">\r\n            <div class=\"row col-12 br mt-2 d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\r\n                <div class=\"col-12 d-flex justify-content-between\">\r\n                    <p>\r\n                        شرح حال و دستورات پزشک\r\n                    </p>\r\n                    <p>\r\n                        :Medical history & Physician Orders\r\n                    </p>\r\n                </div>\r\n                <div class=\"col-12\">\r\n                    <br>\r\n                    <br>\r\n                    <br>\r\n                    <br>\r\n                    <br>\r\n                    <p style=\"text-align: right;\">{{triazhInfo['item']['practitionerComment']}}</p>\r\n                </div>\r\n\r\n                <div class=\"col-12\">\r\n                    <div class=\"d-flex justify-content-between roundBorder   \">\r\n                        <p>تشخیص...</p>\r\n                        <p>\r\n                            Diagnosis....\r\n                        </p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"col-12 d-flex justify-content-between\">\r\n                    <div class=\"col-6 d-flex justify-content-between \">\r\n                        <p>تاریخ و ساعت ویزیت </p>\r\n                        <p> ........   </p>\r\n                        <p>Date & Time Of Visit</p>\r\n\r\n                    </div>\r\n                    <div class=\"col-6 d-flex justify-content-between \" style=\"flex-wrap: nowrap;\">\r\n                        <p style=\"font-size: 10px;\"> نام و نام خانوادگی مهر و امضای پزشک   </p>\r\n                        <p> ...   </p>\r\n                        <p style=\"font-size: 10px;\">Physician's Name/Signature/Stamp</p>\r\n                    </div>\r\n\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"container\">\r\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\r\n                <div class=\"col-12 d-flex justify-content-between\">\r\n                    <p>\r\n                        گزارش پرستاری:\r\n                    </p>\r\n                    <p>\r\n                        :  Nursing Report\r\n                    </p>\r\n                </div>\r\n\r\n                <div class=\"col-12\" style=\"text-align: right; direction: rtl;\">\r\n                    <p>\r\n                        بیمار با نام {{name}}  و نام خانوادگی {{lastName}} با سطح تریاژدو   و با وسیله    {{transporterValue}}وبا شکایت اصلی    <span *ngFor=\"let i of mainVAlueArray\">{{i}},</span>,<span *ngFor=\"let a of eOtherCasesMainDisease\">{{a.description}}</span>          <span *ngIf=\"aleryDrugFinaly.length>0\" > و حساسیت دارویی</span> <span *ngFor=\"let i of aleryDrugFinaly\">{{i}}</span> <span *ngIf=\"foodAllerguValue.length>0\">و حساسیت غذایی</span><span *ngFor=\"let i of foodAllerguValue\">{{i}},</span>   و در ساعت   <span>{{Time}}</span>\r\n                        به اوراژانس منتقل شد.\r\n                    </p>\r\n                    <br>\r\n                    <br>\r\n                    <br>\r\n                    <br>\r\n                    <br>\r\n                    <br>\r\n                    <br>\r\n                    <br>\r\n                    <br>\r\n                    <br>\r\n                    <br>\r\n                    <br>\r\n                </div>\r\n                <div class=\"col-12 d-flex justify-content-between\">\r\n                    <div class=\"col-6 d-flex justify-content-between \">\r\n                        <p>تاریخ و ساعت گزارش </p>\r\n                        <p> ........   </p>\r\n                        <p> Report Date & Time:</p>\r\n\r\n                    </div>\r\n                    <div class=\"col-6 d-flex justify-content-between \" style=\"flex-wrap: nowrap;\">\r\n                        <p style=\"font-size: 10px;\"> نام و نام خانوادگی مهر و امضای پرستار   </p>\r\n                        <p *ngIf=\"pracInfo['item']\">{{pracInfo['item']['firstName']}}  {{pracInfo['item']['lastName']}}    </p>\r\n                        <p style=\"font-size: 10px;\">Nurse's Name/Signature/Stamp</p>\r\n                    </div>\r\n\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"container\">\r\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\r\n                <div class=\"col-12  \" style=\"text-align: right;\">\r\n                    <p>\r\n                        وضعیت نهایی بیمار :\r\n                    </p>\r\n\r\n                </div>\r\n                <div class=\"col-12 d-flex\" style=\"direction: rtl;text-align: right;\">\r\n                    <div class=\"col-6\">\r\n                        <p>بیمار در تاریخ<span>........</span> و ساعت <span>.......</span></p>\r\n                    </div>\r\n                    <div class=\"col-6\">\r\n                        <div>\r\n                            <input type=\"checkbox\" name=\"\" id=\"\">\r\n                            <label for=\"\">مرخص گردید</label>\r\n\r\n                        </div>\r\n\r\n                        <div>\r\n                            <input type=\"checkbox\" name=\"\" id=\"\">\r\n                            <label for=\"\">در بخش .......... بستری گردید </label>\r\n                        </div>\r\n                        <div>\r\n                            <input type=\"checkbox\" name=\"\" id=\"\">\r\n                            <label for=\"\">به درمانگاه  .......... ارجاع شد </label>\r\n                        </div>\r\n                        <div>\r\n                            <input type=\"checkbox\" name=\"\" id=\"\">\r\n                            <label for=\"\">به بیمارستان  .......... اعزام گردید </label>\r\n                        </div>\r\n\r\n                    </div>\r\n                </div>\r\n\r\n\r\n\r\n            </div>\r\n        </div>\r\n        <div class=\"container\">\r\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\r\n                <div class=\"col-12  \" style=\"text-align: center;\">\r\n                    <p>\r\n                        اجازه معالجه و عمل جراحی (بجز ویزیت)\r\n                    </p>\r\n\r\n                </div>\r\n                <div class=\"col-12 \" style=\"direction: rtl;text-align: right;font-size: 16px;\">\r\n                    <p>\r\n                        اینجانب ............. بیمار/ساکن...................... اجازه میدهم پزشک یاپزشکان بیمارستان ...................\r\n                        هرنوع معالجه و در صورت لزوم عمل جراحی یا انتقال خون که صلاح بداند در مورد اینجانب/بیمار اینجانب به مورد اجرا گذراند و بدینوسیله برایت پزشکان و\r\n                        کارکنان این بیمارستان را از کلیه عوارض احتمالی اقدامات فوق که در مورد اینجانب/بیمار اینجانب انجام دهند اعلام میدارم.\r\n                    </p>\r\n                </div>\r\n                <div class=\"col-12\" style=\"direction: rtl; text-align: right;\">\r\n                    <p>\r\n                        نام و امضای بیمار/همراه بیمار..........\r\n                    </p>\r\n                </div>\r\n                <div class=\"col-12\" style=\"direction: rtl; text-align: right;\">\r\n                    <p>\r\n                        نام شاهد1............  تاریخ........ امضا.........\r\n                    </p>\r\n                    <p>\r\n                        نام شاهد2............  تاریخ........ امضا.........\r\n                    </p>\r\n\r\n                </div>\r\n            </div>\r\n\r\n        </div>\r\n        <div class=\"container\">\r\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\r\n                <div class=\"col-12  \" style=\"text-align: center;\">\r\n                    <p>\r\n                        ترخیص با میل شخصی\r\n                    </p>\r\n\r\n                </div>\r\n                <div class=\"col-12 \" style=\"direction: rtl;text-align: right;\">\r\n                    <p>\r\n                        اینجانب ................... با میل شخصی خود بر خلاف صلاحدید و توصیه پزشکان مسئول بیمارستان .......................؛این مرکز را با در نظر داشتن عواقب\r\n                        و خطرات احتمالی ترک می نمایم و اعلام میدارم که هیچ مسئولیتی متوجه مسئولان پزشکان و کارکنان این مرکز نخواهد بود.\r\n                    </p>\r\n                </div>\r\n                <div class=\"col-12  d-flex justify-content-between \" style=\"direction: rtl; text-align: right;\">\r\n                    <p>\r\n                        نام و امضای بیمار/همراه بیمار..........\r\n                    </p>\r\n                    <p>\r\n                        نام و امضای یکی از بستگان درجه اول بیمار...........\r\n                    </p>\r\n                </div>\r\n                <div class=\"col-12\" style=\"direction: rtl; text-align: right;\">\r\n                    <p>\r\n                        نام شاهد1............  تاریخ........ امضا.........\r\n                    </p>\r\n                    <p>\r\n                        نام شاهد2............  تاریخ........ امضا.........\r\n                    </p>\r\n\r\n                </div>\r\n            </div>\r\n\r\n        </div>\r\n    </div>\r\n\r\n\r\n\r\n\r\n\r\n</form>\r\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/teriazh/page6/page6.component.html":
/*!******************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/teriazh/page6/page6.component.html ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<style>\n\n\n\n    .header{\n        background-color: #063d78;\n        color: white;\n        padding-top: 5px;\n        padding-bottom: 5px;\n        display: flex;\n        justify-content: space-between;\n\n    }\n    .header h5{\n        margin-top: 10px;\n        margin-left: 10px;\n        margin-right: 10px;\n    }\n    .btn{\n        border: 1px solid;\n        background-color: white;\n    }\n    table th {\n        background-color: #48d9fa;\n\n    }\n    table{\n        text-align: center;\n    }\n    .br{\n        border:  2px solid black;\n    }\n    .p0{\n        padding: 0 !important\n    }\n    .br div{\n        padding: 0;\n    }\n    p,span,label,h4,h3,h5{\n        font-weight: bold;\n    }\n    .roundBorder{\n        border: 2px solid gray;\n        border-radius: 10px;\n    }\n    input[type=checkbox]{\n        width:18px;\n        height:18px;\n        margin-right: 3px;\n        margin-left: 3px;\n    }\n    .myDIv{\n        animation: mymove 2s infinite;\n        color: white;\n        padding-top: 5px;\n        padding-bottom: 5px;\n        display: flex;\n        justify-content: space-between;\n    }\n    @keyframes mymove {\n        from {background-color: #063d78;}\n        to {background-color: #2a93d4;}\n    }\n\n\n</style>\n\n<form action=\"\" [formGroup]=\"level4Form\"  (ngSubmit)=\"onSubmit()\">\n    <div class=\"d-flex justify-content-center\"  style=\"direction: rtl;text-align: right;transition: 500ms\"  style=\"font-family: iransans\" *ngIf=\"showResult===true\" >\n        <div class=\"alert alert-light col-4 position-absolute   \" style=\"z-index: 1000;font-size: 1.2em;text-align: right;top: 50%;left: 50%;transform: translate(-50%,-50%)\"  role=\"alert\" *ngIf=\"ISsubmitOK===true\">\n            <div class=\"d-flex justify-content-center\" >\n                <span class=\"mt-3\"> ثبت تریاژ با موفقیت انجام شد..</span>\n                <svg xmlns=\"http://www.w3.org/2000/svg\" style=\"color: limegreen;\" width=\"50\" height=\"50\" fill=\"currentColor\" class=\"bi bi-check2-circle\" viewBox=\"0 0 16 16\">\n                    <path d=\"M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z\"/>\n                    <path d=\"M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z\"/>\n                </svg>\n\n            </div>\n            <div class=\"d-flex\" *ngIf=\"ISsubmitOK===true\">\n                <p>کد رهگیری :</p>\n                <P>{{triageID}}</P>\n            </div>\n            <div style=\"text-align: left\">\n                <button class=\"btn\" type=\"button\" (click)=\"close()\"  style=\"font-family: iransans\"> بستن </button>\n            </div>\n\n        </div>\n        <div class=\"alert alert-light col-4 position-absolute   \" style=\"z-index: 1000;font-size: 1.2em;text-align: right;top: 50%;left: 50%;transform: translate(-50%,-50%)\"  role=\"alert\" *ngIf=\"isSubmitError===true\">\n            <div class=\"d-flex justify-content-center\" >\n                <span class=\"mt-3\">{{result}}</span>\n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"50\" style=\"color: yellow\" height=\"50\" fill=\"currentColor\" class=\"bi bi-exclamation-octagon\" viewBox=\"0 0 16 16\">\n                    <path d=\"M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z\"/>\n                    <path d=\"M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z\"/>\n                </svg>\n\n            </div>\n            <div style=\"text-align: left\">\n                <button class=\"btn\" type=\"button\" (click)=\"close()\"  style=\"font-family: iransans\"> بستن </button>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"container-fluid\">\n        <div class=\"row mb-1\">\n            <div class=\"col-12 \">\n                <div class=\"header\" style=\"background:   background-color: #d3d3d3;\n        background-image: linear-gradient(315deg, #d3d3d3 0%, #2bc96d 74%);\">\n                    <h5>سطح تریاژ بیمار 5</h5>\n                    <h5 style=\"font-family: Tahoma\">   Patient Triage Level 5</h5>\n\n                </div>\n            </div>\n        </div>\n        <div class=\"container-fluid mt-2\">\n            <div class=\"row\">\n                <div class=\"col-12\">\n                    <div class=\"header\">\n                        <h5 style=\"text-align: center;\">جداسازی  بیمار و کنترل عفونت</h5>\n                        <h5>:Patient Isolation and Higher of  Precaution</h5>\n\n                    </div>\n                    <div class=\"col-12  border justify-content-center d-flex  \" style=\"text-align: right;background-color: #f2f2f2;border: 1px solid black !important;\" ngDefaultControl formControlName=\"Separation;\"  >\n                        <button type=\"button\" class=\"btn  mt-2 mb-2 ml-2\" [style.background-color]=\"i.BackgroundColour\" [style.color]=\"i.color\" *ngFor='let i of SeparationByInfectionList' (click)=\"getSeparationByInfectionList(i.Key,i)\">\n                            {{i.Value}}\n                        </button>\n\n                    </div>\n                </div>\n            </div>\n            <div class=\"row mt-2\">\n                <div class=\"col-12\">\n                    <div  [ngClass]=\"{'header':refeValid===true,'myDIv':refeValid===false}\">\n                        <h5 style=\"text-align: center;\">\n                            ارجاع به\n                        </h5>\n                        <h5 style=\"text-align: center;\">\n                             :Refer To\n                        </h5>\n\n\n                    </div>\n                    <div class=\"col-12  border \" style=\"text-align: right;background-color: #f2f2f2;border: 1px solid black !important;\" ngDefaultControl formControlName=\"Departure\"  >\n                        <button type=\"button\" [style.background-color]=\"i.BackgroundColour\" [style.color]=\"i.color\" class=\"btn  mt-2 ml-2\"*ngFor=\"let i of departureList\" (click)=\"getDeparture(i.Key,i)\">\n                            {{i.Value}}\n                        </button>\n\n                    </div>\n                </div>\n            </div>\n\n            <button type=\"button\" class=\"btn btn-outline-primary\" [disabled]=\"refeValid===false\" (click)=\"onSubmit()\">\n                ثبت\n            </button>\n            <button type=\"button\" [disabled]=\"printOK===false\" class=\"btn btn-outline-primary col-1\" (click)=\"send()\">\n                ثبت و پایان\n            </button>\n            <button type=\"button\" class=\"btn btn-outline-primary border ml-1\" [disabled]=\"printOK===false\"  printSectionId=\"print-section\" [printStyle]= \"{div: {'direction' : 'rtl'}}\" [useExistingCss]=\"true\" ngxPrint >پرینت تریاژ</button>\n            <button type=\"button\" class=\"btn mb-2 btnHover\" style=\"background-color: #3898C5;color: white\" [routerLink]=\"['/teriazh/Patient-Triage']\">\n                صفحه قبلی\n                <svg  xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-arrow-return-left\" viewBox=\"0 0 16 16\">\n                    <path fill-rule=\"evenodd\" d=\"M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z\"/>\n                </svg>\n\n            </button>\n        </div>\n    </div>\n    <!--print-section-->\n    <div class=\"container\" style=\"float: right;visibility: hidden;display: none\" id=\"print-section\" *ngIf=\"triazhInfo\">\n\n\n\n\n        <div class=\"col-12 text-center\">\n            <h4>وزارت بهداشت درمان و آموزش پزشکی</h4>\n            <h5>Ministry of Health & Medical Education</h5>\n        </div>\n        <div class=\"row \">\n            <div class=\"col-12 d-flex justify-content-around\">\n\n                <h5>دانشگاه علوم پزشکی   </h5>\n                <h5><span *ngIf=\"hospital\">\n            {{hospital['universityName']}}\n        </span></h5>\n                <h5>:University of Medical Science </h5>\n            </div>\n\n        </div>\n        <div class=\"row \">\n            <div class=\"col-12  d-flex justify-content-around\">\n                <!--<div>-->\n                <!--<span>کد تریاژ</span>-->\n                <!--<span>{{triazhInfo['item']['id']}}</span>-->\n                <!--</div>-->\n                <h5><span *ngIf=\"hospital\">\n            {{hospital['hospitalName']}}\n        </span></h5>\n                <h5>:Medical Center</h5>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row \">\n                <div class=\"col-12  d-flex justify-content-around\">\n                    <div class=\"col-3 \">\n                        <div class=\"br\" style=\"width:220px;height:50px; \">\n                            شماره پرونده\n                            <span>\n                            Record No:\n                        </span>\n                        </div>\n\n                    </div>\n                    <div class=\" col-6 text-center\">\n                        <h5>   فرم تریاژ بخش اورژانس بیمارستان </h5>\n                        <h6 class=\"text-bold-700\">HOSPITAL EMERGENCY DEPARTMENT TRIAGE FORM </h6>\n                    </div>\n                    <div class=\"col-3 text-left\" style=\"direction: ltr;\">\n                        <div style=\"width:220px;height:50px\" class=\"br text-right\">\n                <span class=\"text-right\">\n                    سطح تریاژ بیمار\n               </span>\n                            <span class=\"font-weight-bold\">\n                  {{triazhInfo['item']['triageLevelIS']}}\n               </span></div>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"container\" >\n            <div class=\"row  col-12 br d-flex justify-content-around\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12 d-flex \">\n                    <div class=\"col-3 d-flex justify-content-between \" style=\"border-left: 1px solid black;\" >\n                        <p>نام خانوادگی</p>\n                        <p class=\"mt-4\">{{triazhInfo['item']['lastName']}}</p>\n                        <p>Family Name</p>\n                    </div>\n                    <div class=\"col-3 d-flex justify-content-between\" style=\"border-left: 1px solid black;\">\n                        <p>نام </p>\n                        <p class=\"mt-4\">\n                            {{triazhInfo['item']['firstName']}}\n                        </p>\n                        <p> Name</p>\n                    </div>\n                    <div class=\"col-3 d-flex justify-content-between \" style=\"border-left: 1px solid black;\">\n                        <div style=\"text-align: right;\">\n                            <p>جنس</p>\n                            <div>\n                                <label for=\"\">مذکر</label>\n                                <input  *ngIf=\"triazhInfo['item']['gender']==0\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                                <input *ngIf=\"triazhInfo['item']['gender'] !=0\" type=\"checkbox\" ng-disabled=\"true\"  />\n                                <span>F</span>\n                                <input type=\"checkbox\" >\n                                <label for=\"\" style=\"margin-right: 30px;\">مونث</label>\n                                <input *ngIf=\"triazhInfo['item']['gender']==1\" type=\"checkbox\"  checked />\n\n                                <input *ngIf=\"triazhInfo['item']['gender'] !=1\" type=\"checkbox\"   />\n                                <span>M</span>\n                            </div>\n                        </div>\n\n                        <div>\n                            <p>Sex</p>\n                        </div>\n                    </div>\n                    <div class=\"col-3 \">\n                        <div class=\"d-flex justify-content-between\">\n                            <p>تاریخ مراجعه</p>\n                            <!--<p>-->\n                            <!--{{triazhInfo['item']['entranceTime']}}-->\n                            <!--</p>-->\n                            <p>Date of Arrival</p>\n                        </div>\n                        <div class=\"d-flex justify-content-between\">\n                            <p>ساعت مراجعه</p>\n                            <p>{{triazhInfo['item']['entranceTime']}}</p>\n                            <p>Time of Arrival</p>\n                        </div>\n                    </div>\n\n                </div>\n                <div class=\"col-12 d-flex justify-content-between \" style=\"border-top: 1px solid black;\">\n                    <div class=\"col-6 d-flex justify-content-between\">\n                        <div class=\"col-6 d-flex justify-content-between \" style=\"border-left: 1px solid black;\">\n                            <p>کد ملی </p>\n                            <p>\n                                {{triazhInfo['item']['nationalCode']}}\n                            </p>\n                            <p>National Code</p>\n                        </div>\n                        <div class=\"col-6 d-flex justify-content-between\" style=\"border-left: 1px solid black;\">\n                            <p>تاریخ تولد  </p>\n                            <p>\n                                {{triazhInfo['item']['birthDate']}}\n                            </p>\n                            <p>Date of Birth </p>\n                        </div>\n                    </div>\n                    <div class=\"col-6 d-flex justify-content-between\">\n                        <div>\n                            <p>باردار</p>\n                        </div>\n                        <div>\n                            <label for=\"\">بلی </label>\n                            <input *ngIf=\"triazhInfo['item']['pregnant']==1\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                            <input *ngIf=\"triazhInfo['item']['pregnant'] !=1\" type=\"checkbox\" ng-disabled=\"true\"  />                  <span>yes</span>\n                        </div>\n                        <div>\n                            <label for=\"\">خیر </label>\n                            <input *ngIf=\"triazhInfo['item']['pregnant']==0\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                            <input *ngIf=\"triazhInfo['item']['pregnant'] !=0\" type=\"checkbox\" ng-disabled=\"true\"  />                    <span>No</span>\n                        </div>\n                        <div>\n                            <label for=\"\">نامعلوم </label>\n                            <input *ngIf=\"triazhInfo['item']['pregnant']==2\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                            <input *ngIf=\"triazhInfo['item']['pregnant'] !=2\" type=\"checkbox\" ng-disabled=\"true\"  /><small>unknown</small>\n                        </div>\n                        <div>\n                            <p>Pregnant</p>\n                        </div>\n\n\n                    </div>\n\n                </div>\n\n\n\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-around\" style=\"direction: rtl;padding: 0;border-top: none\">\n                <div class=\"col-12 mt-1 d-flex justify-content-between\" style=\"text-align: right;\">\n                    <h6>نحوه مراجعه</h6>\n                    <h6>:Arrival Mode </h6>\n                </div>\n                <div class=\"col-12 mt-1 \" style=\"text-align: right;\">\n                    <span>آمبولانس 115</span>\n                    <input  *ngIf=\"triazhInfo['item']['arrival_Transport']==2\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=2\" type=\"checkbox\" ng-disabled=\"true\"  />              <span>EMS </span>\n                    <span style=\"margin-right: 30px;\">آمبولانس خصوصی</span>\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport']==5\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=5\" type=\"checkbox\" ng-disabled=\"true\"  />              <span>Private Ambulance  </span>\n                    <span style=\"margin-right: 30px;\"> شخصی</span>\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport']==4\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=4\" type=\"checkbox\" ng-disabled=\"true\"  />               <span>By Her Own </span>\n                    <span style=\"margin-right: 30px;\">امداد هوایی </span>\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport']==6\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=6\" type=\"checkbox\" ng-disabled=\"true\"  />             <span>Air Ambulance   </span>\n                    <span style=\"margin-right: 30px;\"> سایر</span>\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport']==8\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=8\" type=\"checkbox\" ng-disabled=\"true\"  />             <span>Other   </span>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between \" style=\"text-align: right;border-top: 1px solid black;\">\n                    <div class=\"col-4 mt-1\">\n                        <p>مراجعه بیمار در 24 ساعت گذشته</p>\n                    </div>\n                    <div class=\"col-4 d-flex mt-1\" style=\"text-align: right;direction: rtl;padding: 0\">\n                        <div class=\"col-4\" >\n                            <span>همین بیمارستان</span>\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems']==0\" type=\"checkbox\"  checked />\n\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems'] !=0\" type=\"checkbox\"   />\n                        </div>\n                        <div class=\"col-4\" style=\"padding: 0\">\n                            <span>بیمارستان دیگر </span>\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems']==1\" type=\"checkbox\"  checked />\n\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems'] !=1\" type=\"checkbox\"   />\n                        </div>\n                        <div class=\"col-4\" style=\"padding: 0\">\n                            <span>خیر</span>\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems']==2\" type=\"checkbox\"  checked />\n\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems'] !=2\" type=\"checkbox\"   />                </div>\n                    </div>\n                    <div class=\"col-4 mt-1\" style=\"text-align: left \">\n                        <p>  :Patient Presence in ED in 24 Past Hours   </p>\n                    </div>\n\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\"  style=\"text-align: right\">\n                    <div class=\"col-4\" style=\"padding: 0\"></div>\n                    <div class=\"col-4 d-flex mt-1\">\n                        <div class=\"col-4\" style=\"padding: 0\">\n                            <span> This Hospital</span>\n                        </div>\n                        <div class=\"col-4\" style=\"padding: 0\">\n                    <span>\n                        Other Hospital\n                    </span>\n                        </div>\n                        <div class=\"col-4\" style=\"padding: 0\">\n                            <span>No</span>\n                        </div>\n\n                    </div>\n                    <div class=\"col-4\" style=\"padding: 0\"></div>\n                </div>\n\n            </div>\n        </div>\n        <div class=\"container\">\n\n            <div class=\"row col-12 br d-flex justify-content-around\" style=\"direction: rtl;\">\n\n                <div class=\"col-12  d-flex justify-content-between \" style=\"text-align: right;\">\n                    <div class=\"d-flex\">\n                        <h5 class=\"font-weight-bold\"> شکایت  اصلی بیمار :</h5>\n                        <span *ngIf=\"triazhInfo['item']['triage_MainDisease']\">\n                    <span *ngFor=\"let i of triazhInfo['item']['triage_MainDisease'] \">\n                        <span *ngFor=\"let a of mainDiseaseArray\">\n                            <span class=\"font-weight-bold\" *ngIf=\"i.mainDiseaseID==a.id\">{{a.mainDiseaseValue}}</span>\n                        </span>\n                </span>\n\n                    <span *ngIf=\"triazhInfo['item']['triageOtherCasesMainDisease']\">\n                        <span class=\"font-weight-bold\"  *ngFor=\"let i of triazhInfo['item']['triageOtherCasesMainDisease'] \">\n                            {{i.description}}\n                        </span>\n                    </span>\n                </span>\n\n                    </div>\n                    <div>\n                <span>Chief Complaint\n                </span>\n                    </div>\n                </div>\n                <div class=\"col-12  \" style=\"text-align: right;flex-wrap: nowrap;\">\n                    <div class=\"d-flex justify-content-between\" style=\"padding: 0\" >\n                        <div class=\"col-2\" style=\"padding: 0;\" >\n                            <p class=\"font-weight-bold\" > <span>سابقه حساسیت دارویی و غذایی: </span>     </p>\n                        </div>\n                        <div class=\"col-6 \" style=\"padding: 0\" *ngIf=\"triazhInfo['item']['triageAllergyDrugs'][0]!=null || triazhInfo['item']['triageFoodSensitivity'][0]!=null\">\n\n                            <div class=\"d-flex\">\n                                <div class=\"\" style=\"padding: 0\" *ngFor=\"let i of aleryDrugFinaly\">\n                                    <span>{{i}},</span>\n\n                                </div>\n                            </div>\n                            <div class=\"col-12 \" style=\"padding: 0\">\n                                <div class=\"d-flex\" style=\"padding: 0\" *ngIf=\"triazhInfo['item']['triageFoodSensitivity']\">\n                                    <div class=\"d-flex\" *ngFor=\"let a of triazhInfo['item']['triageFoodSensitivity'] \">\n                                        <div  class=\"\" *ngFor=\"let i of foodLIst\"  style=\"text-align: right;margin-right: 5px;\">\n                                            <span  *ngIf=\"a.foodSensitivityValue==i.Key\">{{i.Value}}</span>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"col-2 \"  style=\"padding:0;text-align: left;direction: ltr \">\n                            <p style=\"font-size: 12px\" >History of Drug and Food Allergy</p>\n                        </div>\n                    </div>\n\n                </div>\n            </div>\n        </div>\n\n\n\n        <div class=\"container\">\n            <div class=\"col-12 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">\n                <div >\n                    <p> بیماران سطح 1 (شرایط تهدید کننده حیات )</p>\n                </div>\n                <div class=\"\" >\n                    <span>..............................................</span>\n                </div>\n                <div >\n\n                    <p>\n                        Triage level 1 (Life threatening situation)\n                    </p>\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12 d-flex justify-content-between\">\n                    <div>\n                <span>\n                    سطح هوشیاری بیمار:\n\n                </span>\n                    </div>\n                    <div  style=\"text-align: right;direction: rtl;\">\n                <span >\n                    بدون پاسخ\n                </span>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS']==4\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS'] !=4\" type=\"checkbox\"   />              </div>\n                    <div>\n                <span>\n                    پاسخ به محرک دردناک\n               </span>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS']==3\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS'] !=3\" type=\"checkbox\"   />               </div>\n                    <div>\n                <span>\n                    پاسخ به محرک کلامی\n                </span>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS']==2\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS'] !=2\" type=\"checkbox\"   />               </div>\n                    <div>\n                <span>\n                    هوشیار\n               </span>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS']==1\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS'] !=1\" type=\"checkbox\"   />\n                    </div>\n\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\">\n                    <div>\n                <span>\n                    سیستم:(AVPU)\n                </span>\n\n                    </div>\n                    <div>\n                <span>\n                   ( Unresponsive (U\n                 </span>\n                    </div>\n                    <div>\n                <span>\n                  (  Response to Pain Stimulus(P\n                 </span>\n                    </div>\n                    <div>\n                <span>\n                 (   Response to Verbal Stimulus(V\n                 </span>\n                    </div>\n                    <div>\n                <span>\n                  (  Alert (A\n\n                 </span>\n                    </div>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\" style=\"border-top: 1px solid black;\">\n                    <div style=\"border-left: 1px solid black;text-align: right;\">\n                        <label for=\"\">مخاطره راه هوایی</label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['dangerousRespire']==='True'\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['dangerousRespire'] !='Flase'\" type=\"checkbox\"   />\n                        <p>\n                            Airway compromise\n                        </p>\n                    </div>\n                    <div style=\"border-left: 1px solid black;text-align: right;\">\n                        <label for=\"\"> دیسترس شدید تنفسی </label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['respireDistress']==='True'\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['respireDistress'] !='Flase'\" type=\"checkbox\"   />                <p>\n                        Sever Respiratory Distress\n                    </p>\n                    </div>\n                    <div style=\"border-left: 1px solid black;text-align: right;\">\n                        <label for=\"\">  سیانوز</label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['sianosis']==='True'\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['sianosis'] !='Flase'\" type=\"checkbox\"   />                   <p>\n                        Cyanosis\n                    </p>\n                    </div>\n                    <div style=\"border-left: 1px solid black;text-align: right;\">\n                        <label for=\"\">  علایم شوک</label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['shock']==='True'\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\"  *ngIf=\"triazhInfo['item']['shock'] !='Flase'\" type=\"checkbox\"   />\n                        <p>\n                            Signs of Shock\n                        </p>\n                    </div>\n                    <div>\n                        <label for=\"\"> اشباع اکسیژن کمتر از 90 درصد </label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['spo2LowerThan90']==='True'\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['spo2LowerThan90'] !='Flase'\" type=\"checkbox\"   />\n                        <p>\n                            SpO2 < 90\n                        </p>\n                    </div>\n\n                </div>\n\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"col-12 mt-1 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">\n                <div class=\"\">\n                    <p> بیماران سطح 2 </p>\n                </div>\n                <div class=\"p0\" ><span>..............................................................................................................................</span></div>\n                <div class=\"p0\">\n                    <p>\n                        Triage level 2\n                    </p>\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n\n                <div class=\"col-12 d-flex justify-content-between\" >\n                    <div class=\"col-3 text-center\" style=\"border-left: 1px solid black;\">\n                        <label for=\"\">شرایط پر خطر   </label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['highDanger']==='True'\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['highDanger'] =='False'\" type=\"checkbox\"   />\n                        <p>\n                            High Risk Conditions\n                        </p>\n                    </div>\n                    <div class=\"col-4 text-center\" style=\"border-left: 1px solid black;\">\n                        <label for=\"\">\n                            لتارژی خواب آلودگی اختلال جهت یابی\n\n                        </label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['lethargy']==='True'\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['lethargy'] =='False'\" type=\"checkbox\"   />\n                        <p>\n\n                            lethargy/ confusion/ disorientation\n                        </p>\n                    </div>\n                    <div class=\"col-3 text-center\" style=\"border-left: 1px solid black;\">\n                        <label for=\"\">  دیسترس شدید روان </label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['highDistress']==='True'\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['highDistress'] =='False'\" type=\"checkbox\"   />\n                        <p>\n                            Sever psychiatric Distress\n                        </p>\n                    </div>\n                    <div class=\"d-flex col-2 justify-content-between\">\n                        <div style=\"margin-top: 10px\">\n                            <span for=\"\">   درد شدید</span>\n                            <p>\n                                Sever Pain\n\n                            </p>\n                        </div>\n                        <div  style=\"margin-top: 10px;position: relative;margin-left: 10px\" >\n                            <div style=\"padding: 0\">\n                                <!--{{painPrint}}-->\n                            </div>\n                            <div class=\"text-bold-700\" style=\"border-bottom: 1px solid;position: static \"></div>\n                            <div style=\"position: static\" >10</div>\n                        </div>\n\n\n\n\n\n                    </div>\n                </div>\n                <div class=\"col-12 d-flex \" style=\"border-top: 1px solid;\">\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p>سابقه پزشکی </p>\n                        <span>\n                    {{triazhInfo['item']['medicalHistory']}}\n\n                </span>\n                        <p>\n                            Medical history\n                        </p>\n                    </div>\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p>سابقه دارویی </p>\n                        <span>\n                    {{triazhInfo['item']['drugHistory']}}\n\n                </span>\n                        <p>\n                            Drug history\n                        </p>\n                    </div>\n                </div>\n                <div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid;\">\n                    <p class=\"font-weight-bold\">علایم حیاتی  </p>\n                    <p class=\"font-weight-bold\">:sign Vital </p>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\" style=\"flex-wrap: nowrap;\">\n                    <div class=\"\">\n                        <span> فشارخون  :</span>\n                        <span>\n                         {{bp}}\n                </span>\n                        <span>BP <small>mmHg</small></span>\n                    </div>\n                    <div  class=\"\">\n                        <span> تعداد ضربان </span>\n                        <span>   {{pr}} </span>\n                        <span>PR/min</span>\n                    </div>\n                    <div  class=\"\">\n                        <span>تنفس </span>\n                        <span>   {{rr}}    </span>\n                        <span>RR/min</span>\n                    </div>\n                    <div class=\"\">\n                        <span>دمای بدن </span>\n                        <span>  {{t}}   </span>\n                        <span>T</span>\n                    </div>\n                    <div  class=\"\">\n                        <span>درصد اشباع اکسیژن  </span>\n                        <span>  {{spo2}}   </span>\n                        <span>Spo2%</span>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"col-12\" style=\"padding-top: 0;padding-bottom: 0;direction: rtl;text-align: right;\">\n                <p style=\"padding: 0\"> *ثبت عاليم حیاتي برای بیماران سطح 2 با تشخیص پرستار ترياژ و به شرط عدم تاخیر در رسیدگي به بیماران با شرايط پر خطر</p>\n            </div>\n            <div class=\"col-12 mt-1 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">\n                <div class=\"\">\n                    <p> بیماران سطح 3 </p>\n                </div>\n                <div class=\"p0\" ><span>..............................................................................................................................</span></div>\n                <div class=\"p0\">\n                    <p>\n                        Triage level 3\n                    </p>\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12 d-flex \">\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p> تعداد تسهیلات مورد نظر در بخش اورژانس </p>\n                        <p>\n                            دو مورد بیشتر\n                            <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['serviceCountIS']==3\" type=\"checkbox\"  checked />\n\n                            <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['serviceCountIS'] !=3\" type=\"checkbox\"   />\n                        </p>\n                    </div>\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p> TWO & More </p>\n                        <p>\n                            :Number of Required Resources in ED\n                        </p>\n                    </div>\n                </div>\n                <div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid;\">\n                    <p class=\"font-weight-bold\">علایم حیاتی  </p>\n                    <p class=\"font-weight-bold\">:sign Vital </p>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\" style=\"flex-wrap: nowrap;\">\n                    <div class=\"\">\n                        <span>:فشارخون</span>\n                        <span>  {{bp}}  </span>\n                        <span>BP <small>mmHg</small></span>\n                    </div>\n                    <div  class=\"\">\n                        <span>تعداد ضربان</span>\n                        <span>  {{pr}}    </span>\n                        <span>PR/min</span>\n                    </div>\n                    <div  class=\"\">\n                        <span>:تنفس</span>\n                        <span>  {{rr}}   </span>\n                        <span>RR/min</span>\n                    </div>\n                    <div class=\"\">\n                        <span>:دمای بدن</span>\n                        <span>  {{t}}   </span>\n                        <span>T</span>\n                    </div>\n                    <div  class=\"\">\n                        <span>:درصد اشباع اکسیژن </span>\n                        <span>  {{spo2}}   </span>\n                        <span>Spo2%</span>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"col-12 mt-1 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">\n                <div class=\"\">\n                    <p> بیماران سطح 4 و 5 </p>\n                </div>\n                <div class=\"p0\" ><span>..............................................................................................................................</span></div>\n                <div class=\"p0\">\n                    <p>\n                        Triage level 4&5\n                    </p>\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;\">\n                <div class=\"col-12 d-flex \">\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p> تعداد تسهیلات مورد نظر در بخش اورژانس </p>\n                        <p>\n                            یک مورد\n                            <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['serviceCountIS']==2\" type=\"checkbox\"  checked />\n\n                            <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['serviceCountIS'] !=2\" type=\"checkbox\"   />                     </p>\n                        <p>One item</p>\n                    </div>\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p> هیچ</p>\n                        <p>\n                            None\n                            <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['serviceCountIS']==1\" type=\"checkbox\"  checked />\n\n                            <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['serviceCountIS'] !=1\" type=\"checkbox\"   />\n                        </p>\n                        <p>: ED in Resources Required of Number</p>\n                    </div>\n                </div>\n\n            </div>\n        </div>\n        <div class=\"container\" >\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12 d-flex justify-content-between \">\n                    <p> سطح تریاژ بیمار        </p>\n                    <p>\n                        5\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['triageLevelIS']==5\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['triageLevelIS'] !=5\" type=\"checkbox\"   />                     </p>\n                    <p>\n                        4\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['triageLevelIS']==4\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['triageLevelIS'] !=4\" type=\"checkbox\"   />\n                    </p>\n                    <p>\n                        3\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['triageLevelIS']==3\" type=\"checkbox\"  checked />\n\n                        <input  style=\"margin-top: 3px\"*ngIf=\"triazhInfo['item']['triageLevelIS'] !=3\" type=\"checkbox\"   />\n                    </p>\n                    <p>\n                        2\n                        <input *ngIf=\"triazhInfo['item']['triageLevelIS']==2\" type=\"checkbox\"  checked />\n\n                        <input *ngIf=\"triazhInfo['item']['triageLevelIS'] !=2\" type=\"checkbox\"   />\n                    </p>\n                    <p>\n                        1\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['triageLevelIS']==1\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['triageLevelIS'] !=1\" type=\"checkbox\"   />\n                    </p>\n                    <p>\n                        Patient Triage level:\n                    </p>\n\n\n                </div>\n                <div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid;\">\n                    <p class=\"font-weight-bold\">جداسازی بیمار و احتیاطات بیشتر کنترل عفونت   </p>\n                    <p class=\"font-weight-bold\">تماسی\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['separationByInfection']==0\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['separationByInfection'] !=0\" type=\"checkbox\"   />                </p>\n                    <p class=\"font-weight-bold\">قطره ای\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['separationByInfection']==1\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['separationByInfection'] !=1\" type=\"checkbox\"   />\n                    </p>\n                    <p class=\"font-weight-bold\">تنفسی\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['separationByInfection']==2\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['separationByInfection'] !=2\" type=\"checkbox\"   />\n                    </p>\n                    <p class=\"font-weight-bold\">نیاز ندارد\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['separationByInfection']==3\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['separationByInfection'] !=3\" type=\"checkbox\"   />\n                    </p>\n                </div>\n\n                <div class=\"col-12 d-flex d-flex justify-content-between \">\n                    <p class=\"font-weight-bold\">Patient Isolation and More Infection Control Precautions       </p>\n                    <p class=\"font-weight-bold\">Contact\n                    </p>\n                    <p class=\"font-weight-bold\">Droplet\n                    </p>\n                    <p class=\"font-weight-bold\">Airborne\n                    </p>\n                    <p class=\"font-weight-bold\">No Need to Isolation\n                    </p>\n                </div>\n                <div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid black;\">\n                    <div>\n                        <p class=\"font-weight-bold\">ارجاع به</p>\n                    </div>\n                    <div>\n                        <label for=\"\">سرپایی</label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['departure']==3\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['departure'] !=3\" type=\"checkbox\"   />\n                        <span>Fast track</span>\n                    </div>\n                    <div>\n                        <label for=\"\">احیا</label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['departure']==4\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['departure'] !=4\" type=\"checkbox\"   />\n                        <span> CPR</span>\n                    </div>\n                    <div>\n                        <label for=\"\">فضای بستری</label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['departure']==1\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['departure'] !=1\" type=\"checkbox\"   />\n                        <span>Inpatient Area </span>\n                    </div>\n                    <div>\n                        <label for=\"\">سایر...</label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['departure']==8\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['departure'] !=8\" type=\"checkbox\"   />\n                        <span>Other </span>\n                    </div>\n\n                    <div>\n                        <p class=\"font-weight-bold\">  :Refer to </p>\n                    </div>\n\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\" style=\"border-top: 1px solid black;\">\n                    <div class=\"col-6 d-flex\">\n                        <p>ساعت و تاریخ ارجاع</p>\n                        <span>\n                {{triazhInfo['item']['exitTime']}}\n            </span>\n                    </div>\n                    <div class=\"col-6 d-flex\" *ngIf=\"pracInfo\">\n                        <p> نام و نام خانوادگی مهر و امضای پرستار تریاژ  </p>\n                        <span *ngIf=\"pracInfo['item']\">{{pracInfo['item']['firstName']}}</span> <span class=\"mx-1\" *ngIf=\"pracInfo['item']\">{{pracInfo['item']['lastName']}}</span>\n                    </div>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\" >\n                    <div class=\"col-6 d-flex\">\n                        <p> Date & Time of Referral:  </p>\n                        <span></span>\n                    </div>\n                    <div class=\"col-6 d-flex\">\n                        <p>  Triage Nurse’s Name/Signature/Stamp     </p>\n                        <span>.........</span>\n                    </div>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\" style=\"border-top: 1px solid black;\">\n                    <p>توضیحات\n                        <span>......</span>\n                    </p>\n                    <p>\n        <span>\n            .......\n        </span>\n                        Description\n\n                    </p>\n                </div>\n            </div>\n            <div class=\"col-12 d-flex justify-content-between\" >\n                <p>این صفحه فرم صرفا توسط پرستار ترياژ تكمیل مي گردد</p>\n\n                <p>IR.MOHHIM-E01-2.0-9910</p>\n\n\n\n            </div>\n        </div>\n        <br>\n        <!-- page2 -->\n        <div class=\"container\" style=\"margin-top: 50px;\">\n            <div class=\"row col-12 br mt-2 d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12 d-flex justify-content-between\">\n                    <p>\n                        شرح حال و دستورات پزشک\n                    </p>\n                    <p>\n                        :Medical history & Physician Orders\n                    </p>\n                </div>\n                <div class=\"col-12\">\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <p style=\"text-align: right;\">{{triazhInfo['item']['practitionerComment']}}</p>\n                </div>\n\n                <div class=\"col-12\">\n                    <div class=\"d-flex justify-content-between roundBorder   \">\n                        <p>تشخیص...</p>\n                        <p>\n                            Diagnosis....\n                        </p>\n                    </div>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\">\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p>تاریخ و ساعت ویزیت </p>\n                        <p> ........   </p>\n                        <p>Date & Time Of Visit</p>\n\n                    </div>\n                    <div class=\"col-6 d-flex justify-content-between \" style=\"flex-wrap: nowrap;\">\n                        <p style=\"font-size: 10px;\"> نام و نام خانوادگی مهر و امضای پزشک   </p>\n                        <p> ...   </p>\n                        <p style=\"font-size: 10px;\">Physician's Name/Signature/Stamp</p>\n                    </div>\n\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12 d-flex justify-content-between\">\n                    <p>\n                        گزارش پرستاری:\n                    </p>\n                    <p>\n                        :  Nursing Report\n                    </p>\n                </div>\n\n                <div class=\"col-12\" style=\"text-align: right; direction: rtl;\">\n                    <p>\n                        بیمار با نام {{name}}  و نام خانوادگی {{lastName}} با سطح تریاژپنج   و با وسیله    {{transporterValue}}وبا شکایت اصلی    <span *ngFor=\"let i of mainVAlueArray\">{{i}},</span>,<span *ngFor=\"let a of eOtherCasesMainDisease\">{{a.description}}</span>          <span *ngIf=\"aleryDrugFinaly.length>0\" > و حساسیت دارویی</span><span *ngFor=\"let i of aleryDrugFinaly\">{{i}}</span> <span *ngIf=\"foodAllerguValue.length>0\">و حساسیت غذایی</span>    <span *ngFor=\"let i of foodAllerguValue\">{{i}},</span>  و در ساعت {{Time}}\n                        به اوراژانس منتقل شد.\n                    </p>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <!-- <p style=\"text-align: right;\">{{triazhInfo['item']['nurseComment']}} </p> -->\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\">\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p>تاریخ و ساعت گزارش </p>\n                        <p> ........   </p>\n                        <p> Report Date & Time:</p>\n\n                    </div>\n                    <div class=\"col-6 d-flex justify-content-between \" style=\"flex-wrap: nowrap;\" *ngIf=\"pracInfo\">\n                        <p style=\"font-size: 10px;\"> نام و نام خانوادگی مهر و امضای پرستار   </p>\n                        <p *ngIf=\"pracInfo['item']\">{{pracInfo['item']['firstName']}}  {{pracInfo['item']['lastName']}}    </p>\n                        <p style=\"font-size: 10px;\">Nurse's Name/Signature/Stamp</p>\n                    </div>\n\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12  \" style=\"text-align: right;\">\n                    <p>\n                        وضعیت نهایی بیمار :\n                    </p>\n\n                </div>\n                <div class=\"col-12 d-flex\" style=\"direction: rtl;text-align: right;\">\n                    <div class=\"col-6\">\n                        <p>بیمار در تاریخ<span>........</span> و ساعت <span>.......</span></p>\n                    </div>\n                    <div class=\"col-6\">\n                        <div>\n                            <input type=\"checkbox\" name=\"\" id=\"\">\n                            <label for=\"\">مرخص گردید</label>\n\n                        </div>\n\n                        <div>\n                            <input type=\"checkbox\" name=\"\" id=\"\">\n                            <label for=\"\">در بخش .......... بستری گردید </label>\n                        </div>\n                        <div>\n                            <input type=\"checkbox\" name=\"\" id=\"\">\n                            <label for=\"\">به درمانگاه  .......... ارجاع شد </label>\n                        </div>\n                        <div>\n                            <input type=\"checkbox\" name=\"\" id=\"\">\n                            <label for=\"\">به بیمارستان  .......... اعزام گردید </label>\n                        </div>\n\n                    </div>\n                </div>\n\n\n\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12  \" style=\"text-align: center;\">\n                    <p>\n                        اجازه معالجه و عمل جراحی (بجز ویزیت)\n                    </p>\n\n                </div>\n                <div class=\"col-12 \" style=\"direction: rtl;text-align: right;\">\n                    <p>\n                        اینجانب ............. بیمار/ساکن......... اجازه میدهم کزشک یا شزشان بیمارستان ...............\n                        هرنوع معالجه و در صورت لزوم عمل جراحی یا انتقال خون که صلاح بداند در مورد اینجانب/بیمار اینجانب به مورد اجرا گذراند و بدینوسیله برایت پزشکان و\n                        کارکنان این بیمارستان را از کلیه عوارض احتمالی اقدامات فوق که در مورد اینجانب/بیمار اینجانب انجام دهند اعلام میدارم.\n                    </p>\n                </div>\n                <div class=\"col-12\" style=\"direction: rtl; text-align: right;\">\n                    <p>\n                        نام و امضای بیمار/همراه بیمار..........\n                    </p>\n                </div>\n                <div class=\"col-12\" style=\"direction: rtl; text-align: right;\">\n                    <p>\n                        نام شاهد1............  تاریخ........ امضا.........\n                    </p>\n                    <p>\n                        نام شاهد2............  تاریخ........ امضا.........\n                    </p>\n\n                </div>\n            </div>\n\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12  \" style=\"text-align: center;\">\n                    <p>\n                        ترخیص با میل شخصی\n                    </p>\n\n                </div>\n                <div class=\"col-12 \" style=\"direction: rtl;text-align: right;\">\n                    <p>\n                        اینجانب ............. با میل شخصی خود بر خلاف صلاحدید و توصیه پزشکان مسئول بیمارستان ............؛این مرکز را با در نظر داشتن عواقب\n                        و خطرات احتمالی ترک می نمایم و اعلام میدارم که هیچ مسئولیتی متوجه مسئولان پزشکان و کارکنان این مرکز نخواهد بود.\n                    </p>\n                </div>\n                <div class=\"col-12  d-flex justify-content-between \" style=\"direction: rtl; text-align: right;\">\n                    <p>\n                        نام و امضای بیمار/همراه بیمار..........\n                    </p>\n                    <p>\n                        نام و امضای یکی از بستگان درجه اول بیمار...........\n                    </p>\n                </div>\n                <div class=\"col-12\" style=\"direction: rtl; text-align: right;\">\n                    <p>\n                        نام شاهد1............  تاریخ........ امضا.........\n                    </p>\n                    <p>\n                        نام شاهد2............  تاریخ........ امضا.........\n                    </p>\n\n                </div>\n            </div>\n\n        </div>\n    </div>\n\n</form>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/teriazh/page7/page7.component.html":
/*!******************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/teriazh/page7/page7.component.html ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<style>\n\n\n\n    .header{\n        background-color: #063d78;\n        color: white;\n        padding-top: 5px;\n        padding-bottom: 5px;\n        display: flex;\n        justify-content: space-between;\n    }\n    .header h5{\n        margin-top: 10px;\n        margin-left: 10px;\n        margin-right: 10px;\n    }\n    .btn{\n        border: 1px solid;\n        background-color: white;\n    }\n    table th {\n        background-color: #48d9fa;\n\n    }\n    table{\n        text-align: center;\n    }\n    .br{\n        border:  2px solid black;\n    }\n    .p0{\n        padding: 0 !important\n    }\n    .br div{\n        padding: 0;\n    }\n    p,span,label,h4,h3,h5{\n        font-weight: bold;\n    }\n    .roundBorder{\n        border: 2px solid gray;\n        border-radius: 10px;\n    }\n    input[type=checkbox]{\n        width: 18px;\n        height: 18px;\n        margin-right: 3px;\n        margin-left: 3px;\n    }\n    .myDIv{\n        animation: mymove 2s infinite;\n        color: white;\n        padding-top: 5px;\n        padding-bottom: 5px;\n        display: flex;\n        justify-content: space-between;\n    }\n    @keyframes mymove {\n        from {background-color: #063d78;}\n        to {background-color: #2a93d4;}\n    }\n\n</style>\n\n<form action=\"\">\n    <div class=\"d-flex justify-content-center\"  style=\"direction: rtl;text-align: right;transition: 500ms\"  style=\"font-family: iransans\" *ngIf=\"showResult===true\" >\n        <div class=\"alert alert-light col-4 position-absolute   \" style=\"z-index: 1000;font-size: 1.2em;text-align: right;top: 50%;left: 50%;transform: translate(-50%,-50%)\"  role=\"alert\" *ngIf=\"ISsubmitOK===true\">\n            <div class=\"d-flex justify-content-center\" >\n                <span class=\"mt-3\"> ثبت تریاژ با موفقیت انجام شد..</span>\n                <svg xmlns=\"http://www.w3.org/2000/svg\" style=\"color: limegreen;\" width=\"50\" height=\"50\" fill=\"currentColor\" class=\"bi bi-check2-circle\" viewBox=\"0 0 16 16\">\n                    <path d=\"M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z\"/>\n                    <path d=\"M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z\"/>\n                </svg>\n\n            </div>\n            <div class=\"d-flex\" *ngIf=\"ISsubmitOK===true\">\n                <p>کد رهگیری :</p>\n                <P>{{triageID}}</P>\n            </div>\n            <div style=\"text-align: left\">\n                <button class=\"btn\" type=\"button\" (click)=\"close()\"  style=\"font-family: iransans\"> بستن </button>\n            </div>\n\n        </div>\n        <div class=\"alert alert-light col-4 position-absolute   \" style=\"z-index: 1000;font-size: 1.2em;text-align: right;top: 50%;left: 50%;transform: translate(-50%,-50%)\"  role=\"alert\" *ngIf=\"isSubmitError===true\">\n            <div class=\"d-flex justify-content-center\" >\n                <span class=\"mt-3\">{{result}}</span>\n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"50\" style=\"color: yellow\" height=\"50\" fill=\"currentColor\" class=\"bi bi-exclamation-octagon\" viewBox=\"0 0 16 16\">\n                    <path d=\"M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z\"/>\n                    <path d=\"M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z\"/>\n                </svg>\n\n            </div>\n            <div style=\"text-align: left\">\n                <button class=\"btn\" type=\"button\" (click)=\"close()\"  style=\"font-family: iransans\"> بستن </button>\n            </div>\n        </div>\n    </div>\n    <div class=\"container-fluid\">\n        <div class=\"row mb-1\">\n            <div class=\"col-12 \">\n                <div class=\"header\" style=\" background-color: #06bcfb;\n        background-image: linear-gradient(315deg, #06bcfb 0%, #4884ee 74%); \">\n                    <h5>سطح تریاژ بیمار 4</h5>\n                    <h5 style=\"font-family: Tahoma\">   Patient Triage Level 5</h5>\n\n                </div>\n            </div>\n        </div>\n        <div class=\"container-fluid mt-2\">\n            <div class=\"row\">\n                <div class=\"col-12\">\n                    <div class=\"header\">\n                        <h5 style=\"text-align: center;\">جداسازی  بیمار و کنترل عفونت</h5>\n                        <h5>:Patient Isolation and Higher of  Precaution</h5>\n                    </div>\n                    <div class=\"col-12  border justify-content-center d-flex  \" style=\"text-align: right;background-color: #f2f2f2;border: 1px solid black !important;\" ngDefaultControl formControlName=\"Separation;\"  >\n                        <button type=\"button\" class=\"btn  mt-2 mb-2 ml-2\" [style.background-color]=\"i.BackgroundColour\" [style.color]=\"i.color\" *ngFor='let i of SeparationByInfectionList' (click)=\"getSeparationByInfectionList(i.Key,i)\">\n                            {{i.Value}}\n                        </button>\n\n                    </div>\n                </div>\n            </div>\n            <div class=\"row mt-2\">\n                <div class=\"col-12\">\n                    <div  [ngClass]=\"{'header':refeValid===true,'myDIv':refeValid===false}\">\n                        <h5 style=\"text-align: center;\">\n                            ارجاع به\n                        </h5>\n                        <h5 style=\"text-align: center;\">\n                            :Refer To\n                        </h5>\n                    </div>\n                    <div class=\"col-12  border \" style=\"text-align: right;background-color: #f2f2f2;border: 1px solid black !important;\" ngDefaultControl formControlName=\"Departure\"  >\n                        <button type=\"button\" [style.background-color]=\"i.BackgroundColour\" [style.color]=\"i.color\" class=\"btn  mt-2 ml-2\"*ngFor=\"let i of departureList\" (click)=\"getDeparture(i.Key,i)\">\n                            {{i.Value}}\n                        </button>\n\n                    </div>\n                </div>\n            </div>\n\n            <button type=\"button\" class=\"btn btn-outline-primary\" (click)=\"onSubmit()\" [disabled]=\"refeValid===false\">\n                ثبت\n            </button>\n\n            <button type=\"button\" [disabled]=\"printOK===false\" class=\"btn btn-outline-primary col-1\" (click)=\"send()\">\n                ثبت و پایان\n            </button>\n            <button type=\"button\" class=\"btn btn-outline-primary border ml-1\" [disabled]=\"printOK===false\"   printSectionId=\"print-section\" [printStyle]= \"{div: {'direction' : 'rtl'}}\" [useExistingCss]=\"true\" ngxPrint >پرینت تریاژ</button>\n            <button type=\"button\" class=\"btn mb-2 btnHover\" style=\"background-color: #3898C5;color: white\" [routerLink]=\"['/teriazh/Patient-Triage']\">\n                صفحه قبلی\n                <svg  xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-arrow-return-left\" viewBox=\"0 0 16 16\">\n                    <path fill-rule=\"evenodd\" d=\"M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z\"/>\n                </svg>\n\n            </button>\n        </div>\n    </div>\n    <!--print-section-->\n    <div class=\"container\" style=\"float: right;visibility: hidden;display: none\" id=\"print-section\" *ngIf=\"triazhInfo\">\n\n\n\n\n        <div class=\"col-12 text-center\">\n            <h4>وزارت بهداشت درمان و آموزش پزشکی</h4>\n            <h5>Ministry of Health & Medical Education</h5>\n        </div>\n        <div class=\"row \">\n            <div class=\"col-12 d-flex justify-content-around\">\n\n                <h5>دانشگاه علوم پزشکی   </h5>\n                <h5><span *ngIf=\"hospital\">\n            {{hospital['universityName']}}\n        </span></h5>\n                <h5>:University of Medical Science </h5>\n            </div>\n\n        </div>\n        <div class=\"row \">\n            <div class=\"col-12  d-flex justify-content-around\">\n                <!--<div>-->\n                <!--<span>کد تریاژ</span>-->\n                <!--<span>{{triazhInfo['item']['id']}}</span>-->\n                <!--</div>-->\n                <h5><span *ngIf=\"hospital\">\n            {{hospital['hospitalName']}}\n        </span></h5>\n                <h5>:Medical Center</h5>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row \">\n                <div class=\"col-12  d-flex justify-content-around\">\n                    <div class=\"col-3 \">\n                        <div class=\"br\" style=\"width:220px;height:50px; \">\n                            شماره پرونده\n                            <span>\n                            Record No:\n                        </span>\n                        </div>\n\n                    </div>\n                    <div class=\" col-6 text-center\">\n                        <h5>   فرم تریاژ بخش اورژانس بیمارستان </h5>\n                        <h6 class=\"text-bold-700\">HOSPITAL EMERGENCY DEPARTMENT TRIAGE FORM </h6>\n                    </div>\n                    <div class=\"col-3 text-left\" style=\"direction: ltr;\">\n                        <div style=\"width:220px;height:50px\" class=\"br text-right\">\n                <span class=\"text-right\">\n                    سطح تریاژ بیمار\n               </span>\n                            <span class=\"font-weight-bold\">\n                  {{triazhInfo['item']['triageLevelIS']}}\n               </span></div>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"container\" >\n            <div class=\"row  col-12 br d-flex justify-content-around\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12 d-flex \">\n                    <div class=\"col-3 d-flex justify-content-between \" style=\"border-left: 1px solid black;\" >\n                        <p>نام خانوادگی</p>\n                        <p class=\"mt-4\">{{triazhInfo['item']['lastName']}}</p>\n                        <p>Family Name</p>\n                    </div>\n                    <div class=\"col-3 d-flex justify-content-between\" style=\"border-left: 1px solid black;\">\n                        <p>نام </p>\n                        <p class=\"mt-4\">\n                            {{triazhInfo['item']['firstName']}}\n                        </p>\n                        <p> Name</p>\n                    </div>\n                    <div class=\"col-3 d-flex justify-content-between \" style=\"border-left: 1px solid black;\">\n                        <div style=\"text-align: right;\">\n                            <p>جنس</p>\n                            <div>\n                                <label for=\"\">مذکر</label>\n                                <input  *ngIf=\"triazhInfo['item']['gender']==0\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                                <input *ngIf=\"triazhInfo['item']['gender'] !=0\" type=\"checkbox\" ng-disabled=\"true\"  />\n                                <span>F</span>\n                                <input type=\"checkbox\" >\n                                <label for=\"\" style=\"margin-right: 30px;\">مونث</label>\n                                <input *ngIf=\"triazhInfo['item']['gender']==1\" type=\"checkbox\"  checked />\n\n                                <input *ngIf=\"triazhInfo['item']['gender'] !=1\" type=\"checkbox\"   />\n                                <span>M</span>\n                            </div>\n                        </div>\n\n                        <div>\n                            <p>Sex</p>\n                        </div>\n                    </div>\n                    <div class=\"col-3 \">\n                        <div class=\"d-flex justify-content-between\">\n                            <p>تاریخ مراجعه</p>\n                            <!--<p>-->\n                            <!--{{triazhInfo['item']['entranceTime']}}-->\n                            <!--</p>-->\n                            <p>Date of Arrival</p>\n                        </div>\n                        <div class=\"d-flex justify-content-between\">\n                            <p>ساعت مراجعه</p>\n                            <p>{{triazhInfo['item']['entranceTime']}}</p>\n                            <p>Time of Arrival</p>\n                        </div>\n                    </div>\n\n                </div>\n                <div class=\"col-12 d-flex justify-content-between \" style=\"border-top: 1px solid black;\">\n                    <div class=\"col-6 d-flex justify-content-between\">\n                        <div class=\"col-6 d-flex justify-content-between \" style=\"border-left: 1px solid black;\">\n                            <p>کد ملی </p>\n                            <p>\n                                {{triazhInfo['item']['nationalCode']}}\n                            </p>\n                            <p>National Code</p>\n                        </div>\n                        <div class=\"col-6 d-flex justify-content-between\" style=\"border-left: 1px solid black;\">\n                            <p>تاریخ تولد  </p>\n                            <p>\n                                {{triazhInfo['item']['birthDate']}}\n                            </p>\n                            <p>Date of Birth </p>\n                        </div>\n                    </div>\n                    <div class=\"col-6 d-flex justify-content-between\">\n                        <div>\n                            <p>باردار</p>\n                        </div>\n                        <div>\n                            <label for=\"\">بلی </label>\n                            <input *ngIf=\"triazhInfo['item']['pregnant']==1\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                            <input *ngIf=\"triazhInfo['item']['pregnant'] !=1\" type=\"checkbox\" ng-disabled=\"true\"  />                  <span>yes</span>\n                        </div>\n                        <div>\n                            <label for=\"\">خیر </label>\n                            <input *ngIf=\"triazhInfo['item']['pregnant']==0\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                            <input *ngIf=\"triazhInfo['item']['pregnant'] !=0\" type=\"checkbox\" ng-disabled=\"true\"  />                    <span>No</span>\n                        </div>\n                        <div>\n                            <label for=\"\">نامعلوم </label>\n                            <input *ngIf=\"triazhInfo['item']['pregnant']==2\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                            <input *ngIf=\"triazhInfo['item']['pregnant'] !=2\" type=\"checkbox\" ng-disabled=\"true\"  /><small>unknown</small>\n                        </div>\n                        <div>\n                            <p>Pregnant</p>\n                        </div>\n\n\n                    </div>\n\n                </div>\n\n\n\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-around\" style=\"direction: rtl;padding: 0;border-top: none\">\n                <div class=\"col-12 mt-1 d-flex justify-content-between\" style=\"text-align: right;\">\n                    <h6>نحوه مراجعه</h6>\n                    <h6>:Arrival Mode </h6>\n                </div>\n                <div class=\"col-12 mt-1 \" style=\"text-align: right;\">\n                    <span>آمبولانس 115</span>\n                    <input  *ngIf=\"triazhInfo['item']['arrival_Transport']==2\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=2\" type=\"checkbox\" ng-disabled=\"true\"  />              <span>EMS </span>\n                    <span style=\"margin-right: 30px;\">آمبولانس خصوصی</span>\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport']==5\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=5\" type=\"checkbox\" ng-disabled=\"true\"  />              <span>Private Ambulance  </span>\n                    <span style=\"margin-right: 30px;\"> شخصی</span>\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport']==4\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=4\" type=\"checkbox\" ng-disabled=\"true\"  />               <span>By Her Own </span>\n                    <span style=\"margin-right: 30px;\">امداد هوایی </span>\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport']==6\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=6\" type=\"checkbox\" ng-disabled=\"true\"  />             <span>Air Ambulance   </span>\n                    <span style=\"margin-right: 30px;\"> سایر</span>\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport']==8\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=8\" type=\"checkbox\" ng-disabled=\"true\"  />             <span>Other   </span>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between \" style=\"text-align: right;border-top: 1px solid black;\">\n                    <div class=\"col-4 mt-1\">\n                        <p>مراجعه بیمار در 24 ساعت گذشته</p>\n                    </div>\n                    <div class=\"col-4 d-flex mt-1\" style=\"text-align: right;direction: rtl;padding: 0\">\n                        <div class=\"col-4\" >\n                            <span>همین بیمارستان</span>\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems']==0\" type=\"checkbox\"  checked />\n\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems'] !=0\" type=\"checkbox\"   />\n                        </div>\n                        <div class=\"col-4\" style=\"padding: 0\">\n                            <span>بیمارستان دیگر </span>\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems']==1\" type=\"checkbox\"  checked />\n\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems'] !=1\" type=\"checkbox\"   />\n                        </div>\n                        <div class=\"col-4\" style=\"padding: 0\">\n                            <span>خیر</span>\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems']==2\" type=\"checkbox\"  checked />\n\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems'] !=2\" type=\"checkbox\"   />                </div>\n                    </div>\n                    <div class=\"col-4 mt-1\" style=\"text-align: left \">\n                        <p>  :Patient Presence in ED in 24 Past Hours   </p>\n                    </div>\n\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\"  style=\"text-align: right\">\n                    <div class=\"col-4\" style=\"padding: 0\"></div>\n                    <div class=\"col-4 d-flex mt-1\">\n                        <div class=\"col-4\" style=\"padding: 0\">\n                            <span> This Hospital</span>\n                        </div>\n                        <div class=\"col-4\" style=\"padding: 0\">\n                    <span>\n                        Other Hospital\n                    </span>\n                        </div>\n                        <div class=\"col-4\" style=\"padding: 0\">\n                            <span>No</span>\n                        </div>\n\n                    </div>\n                    <div class=\"col-4\" style=\"padding: 0\"></div>\n                </div>\n\n            </div>\n        </div>\n        <div class=\"container\">\n\n            <div class=\"row col-12 br d-flex justify-content-around\" style=\"direction: rtl;\">\n\n                <div class=\"col-12  d-flex justify-content-between \" style=\"text-align: right;\">\n                    <div class=\"d-flex\">\n                        <h5 class=\"font-weight-bold\"> شکایت  اصلی بیمار :</h5>\n                        <span *ngIf=\"triazhInfo['item']['triage_MainDisease']\">\n                    <span *ngFor=\"let i of triazhInfo['item']['triage_MainDisease'] \">\n                        <span *ngFor=\"let a of mainDiseaseArray\">\n                            <span class=\"font-weight-bold\" *ngIf=\"i.mainDiseaseID==a.id\">{{a.mainDiseaseValue}}</span>\n                        </span>\n                </span>\n\n                    <span *ngIf=\"triazhInfo['item']['triageOtherCasesMainDisease']\">\n                        <span class=\"font-weight-bold\"  *ngFor=\"let i of triazhInfo['item']['triageOtherCasesMainDisease'] \">\n                            {{i.description}}\n                        </span>\n                    </span>\n                </span>\n\n                    </div>\n                    <div>\n                <span>Chief Complaint\n                </span>\n                    </div>\n                </div>\n                <div class=\"col-12  \" style=\"text-align: right;flex-wrap: nowrap;\">\n                    <div class=\"d-flex justify-content-between\" style=\"padding: 0\" >\n                        <div class=\"col-2\" style=\"padding: 0;\" >\n                            <p class=\"font-weight-bold\" > <span>سابقه حساسیت دارویی و غذایی: </span>     </p>\n                        </div>\n                        <div class=\"col-6 \" style=\"padding: 0\" *ngIf=\"triazhInfo['item']['triageAllergyDrugs'][0]!=null || triazhInfo['item']['triageFoodSensitivity'][0]!=null\">\n\n                            <div class=\"d-flex\">\n                                <div class=\"\" style=\"padding: 0\" *ngFor=\"let i of aleryDrugFinaly\">\n                                    <span>{{i}},</span>\n\n                                </div>\n                            </div>\n                            <div class=\"col-12 \" style=\"padding: 0\">\n                                <div class=\"d-flex\" style=\"padding: 0\" *ngIf=\"triazhInfo['item']['triageFoodSensitivity']\">\n                                    <div class=\"d-flex\" *ngFor=\"let a of triazhInfo['item']['triageFoodSensitivity'] \">\n                                        <div  class=\"\" *ngFor=\"let i of foodLIst\"  style=\"text-align: right;margin-right: 5px;\">\n                                            <span  *ngIf=\"a.foodSensitivityValue==i.Key\">{{i.Value}}</span>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"col-2 \"  style=\"padding:0;text-align: left;direction: ltr \">\n                            <p style=\"font-size: 12px\" >History of Drug and Food Allergy</p>\n                        </div>\n                    </div>\n\n                </div>\n            </div>\n        </div>\n\n\n\n        <div class=\"container\">\n            <div class=\"col-12 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">\n                <div >\n                    <p> بیماران سطح 1 (شرایط تهدید کننده حیات )</p>\n                </div>\n                <div class=\"\" >\n                    <span>..............................................</span>\n                </div>\n                <div >\n\n                    <p>\n                        Triage level 1 (Life threatening situation)\n                    </p>\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12 d-flex justify-content-between\">\n                    <div>\n                <span>\n                    سطح هوشیاری بیمار:\n\n                </span>\n                    </div>\n                    <div  style=\"text-align: right;direction: rtl;\">\n                <span >\n                    بدون پاسخ\n                </span>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS']==4\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS'] !=4\" type=\"checkbox\"   />              </div>\n                    <div>\n                <span>\n                    پاسخ به محرک دردناک\n               </span>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS']==3\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS'] !=3\" type=\"checkbox\"   />               </div>\n                    <div>\n                <span>\n                    پاسخ به محرک کلامی\n                </span>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS']==2\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS'] !=2\" type=\"checkbox\"   />               </div>\n                    <div>\n                <span>\n                    هوشیار\n               </span>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS']==1\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS'] !=1\" type=\"checkbox\"   />\n                    </div>\n\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\">\n                    <div>\n                <span>\n                    سیستم:(AVPU)\n                </span>\n\n                    </div>\n                    <div>\n                <span>\n                   ( Unresponsive (U\n                 </span>\n                    </div>\n                    <div>\n                <span>\n                  (  Response to Pain Stimulus(P\n                 </span>\n                    </div>\n                    <div>\n                <span>\n                 (   Response to Verbal Stimulus(V\n                 </span>\n                    </div>\n                    <div>\n                <span>\n                  (  Alert (A\n\n                 </span>\n                    </div>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\" style=\"border-top: 1px solid black;\">\n                    <div style=\"border-left: 1px solid black;text-align: right;\">\n                        <label for=\"\">مخاطره راه هوایی</label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['dangerousRespire']==='True'\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['dangerousRespire'] !='Flase'\" type=\"checkbox\"   />\n                        <p>\n                            Airway compromise\n                        </p>\n                    </div>\n                    <div style=\"border-left: 1px solid black;text-align: right;\">\n                        <label for=\"\"> دیسترس شدید تنفسی </label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['respireDistress']==='True'\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['respireDistress'] !='Flase'\" type=\"checkbox\"   />                <p>\n                        Sever Respiratory Distress\n                    </p>\n                    </div>\n                    <div style=\"border-left: 1px solid black;text-align: right;\">\n                        <label for=\"\">  سیانوز</label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['sianosis']==='True'\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['sianosis'] !='Flase'\" type=\"checkbox\"   />                   <p>\n                        Cyanosis\n                    </p>\n                    </div>\n                    <div style=\"border-left: 1px solid black;text-align: right;\">\n                        <label for=\"\">  علایم شوک</label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['shock']==='True'\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\"  *ngIf=\"triazhInfo['item']['shock'] !='Flase'\" type=\"checkbox\"   />\n                        <p>\n                            Signs of Shock\n                        </p>\n                    </div>\n                    <div>\n                        <label for=\"\"> اشباع اکسیژن کمتر از 90 درصد </label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['spo2LowerThan90']==='True'\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['spo2LowerThan90'] !='Flase'\" type=\"checkbox\"   />\n                        <p>\n                            SpO2 < 90\n                        </p>\n                    </div>\n\n                </div>\n\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"col-12 mt-1 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">\n                <div class=\"\">\n                    <p> بیماران سطح 2 </p>\n                </div>\n                <div class=\"p0\" ><span>..............................................................................................................................</span></div>\n                <div class=\"p0\">\n                    <p>\n                        Triage level 2\n                    </p>\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n\n                <div class=\"col-12 d-flex justify-content-between\" >\n                    <div class=\"col-3 text-center\" style=\"border-left: 1px solid black;\">\n                        <label for=\"\">شرایط پر خطر   </label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['highDanger']==='True'\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['highDanger'] =='False'\" type=\"checkbox\"   />\n                        <p>\n                            High Risk Conditions\n                        </p>\n                    </div>\n                    <div class=\"col-4 text-center\" style=\"border-left: 1px solid black;\">\n                        <label for=\"\">\n                            لتارژی خواب آلودگی اختلال جهت یابی\n\n                        </label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['lethargy']==='True'\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['lethargy'] =='False'\" type=\"checkbox\"   />\n                        <p>\n\n                            lethargy/ confusion/ disorientation\n                        </p>\n                    </div>\n                    <div class=\"col-3 text-center\" style=\"border-left: 1px solid black;\">\n                        <label for=\"\">  دیسترس شدید روان </label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['highDistress']==='True'\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['highDistress'] =='False'\" type=\"checkbox\"   />\n                        <p>\n                            Sever psychiatric Distress\n                        </p>\n                    </div>\n                    <div class=\"d-flex col-2 justify-content-between\">\n                        <div style=\"margin-top: 10px\">\n                            <span for=\"\">   درد شدید</span>\n                            <p>\n                                Sever Pain\n\n                            </p>\n                        </div>\n                        <div  style=\"margin-top: 10px;position: relative;margin-left: 10px\" >\n                            <div style=\"padding: 0\">\n                                <!--{{painPrint}}-->\n                            </div>\n                            <div class=\"text-bold-700\" style=\"border-bottom: 1px solid;position: static \"></div>\n                            <div style=\"position: static\" >10</div>\n                        </div>\n\n\n\n\n\n                    </div>\n                </div>\n                <div class=\"col-12 d-flex \" style=\"border-top: 1px solid;\">\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p>سابقه پزشکی </p>\n                        <span>\n                    {{triazhInfo['item']['medicalHistory']}}\n\n                </span>\n                        <p>\n                            Medical history\n                        </p>\n                    </div>\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p>سابقه دارویی </p>\n                        <span>\n                    {{triazhInfo['item']['drugHistory']}}\n\n                </span>\n                        <p>\n                            Drug history\n                        </p>\n                    </div>\n                </div>\n                <div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid;\">\n                    <p class=\"font-weight-bold\">علایم حیاتی  </p>\n                    <p class=\"font-weight-bold\">:sign Vital </p>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\" style=\"flex-wrap: nowrap;\">\n                    <div class=\"\">\n                        <span> فشارخون  :</span>\n                        <span>\n                         {{bp}}\n                </span>\n                        <span>BP <small>mmHg</small></span>\n                    </div>\n                    <div  class=\"\">\n                        <span> تعداد ضربان </span>\n                        <span>   {{pr}} </span>\n                        <span>PR/min</span>\n                    </div>\n                    <div  class=\"\">\n                        <span>تنفس </span>\n                        <span>   {{rr}}    </span>\n                        <span>RR/min</span>\n                    </div>\n                    <div class=\"\">\n                        <span>دمای بدن </span>\n                        <span>  {{t}}   </span>\n                        <span>T</span>\n                    </div>\n                    <div  class=\"\">\n                        <span>درصد اشباع اکسیژن  </span>\n                        <span>  {{spo2}}   </span>\n                        <span>Spo2%</span>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"col-12\" style=\"padding-top: 0;padding-bottom: 0;direction: rtl;text-align: right;\">\n                <p style=\"padding: 0\"> *ثبت عاليم حیاتي برای بیماران سطح 2 با تشخیص پرستار ترياژ و به شرط عدم تاخیر در رسیدگي به بیماران با شرايط پر خطر</p>\n            </div>\n            <div class=\"col-12 mt-1 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">\n                <div class=\"\">\n                    <p> بیماران سطح 3 </p>\n                </div>\n                <div class=\"p0\" ><span>..............................................................................................................................</span></div>\n                <div class=\"p0\">\n                    <p>\n                        Triage level 3\n                    </p>\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12 d-flex \">\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p> تعداد تسهیلات مورد نظر در بخش اورژانس </p>\n                        <p>\n                            دو مورد بیشتر\n                            <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['serviceCountIS']==3\" type=\"checkbox\"  checked />\n\n                            <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['serviceCountIS'] !=3\" type=\"checkbox\"   />\n                        </p>\n                    </div>\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p> TWO & More </p>\n                        <p>\n                            :Number of Required Resources in ED\n                        </p>\n                    </div>\n                </div>\n                <div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid;\">\n                    <p class=\"font-weight-bold\">علایم حیاتی  </p>\n                    <p class=\"font-weight-bold\">:sign Vital </p>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\" style=\"flex-wrap: nowrap;\">\n                    <div class=\"\">\n                        <span>:فشارخون</span>\n                        <span>  {{bp}}  </span>\n                        <span>BP <small>mmHg</small></span>\n                    </div>\n                    <div  class=\"\">\n                        <span>تعداد ضربان</span>\n                        <span>  {{pr}}    </span>\n                        <span>PR/min</span>\n                    </div>\n                    <div  class=\"\">\n                        <span>:تنفس</span>\n                        <span>  {{rr}}   </span>\n                        <span>RR/min</span>\n                    </div>\n                    <div class=\"\">\n                        <span>:دمای بدن</span>\n                        <span>  {{t}}   </span>\n                        <span>T</span>\n                    </div>\n                    <div  class=\"\">\n                        <span>:درصد اشباع اکسیژن </span>\n                        <span>  {{spo2}}   </span>\n                        <span>Spo2%</span>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"col-12 mt-1 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">\n                <div class=\"\">\n                    <p> بیماران سطح 4 و 5 </p>\n                </div>\n                <div class=\"p0\" ><span>..............................................................................................................................</span></div>\n                <div class=\"p0\">\n                    <p>\n                        Triage level 4&5\n                    </p>\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;\">\n                <div class=\"col-12 d-flex \">\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p> تعداد تسهیلات مورد نظر در بخش اورژانس </p>\n                        <p>\n                            یک مورد\n                            <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['serviceCountIS']==2\" type=\"checkbox\"  checked />\n\n                            <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['serviceCountIS'] !=2\" type=\"checkbox\"   />                     </p>\n                        <p>One item</p>\n                    </div>\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p> هیچ</p>\n                        <p>\n                            None\n                            <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['serviceCountIS']==1\" type=\"checkbox\"  checked />\n\n                            <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['serviceCountIS'] !=1\" type=\"checkbox\"   />\n                        </p>\n                        <p>: ED in Resources Required of Number</p>\n                    </div>\n                </div>\n\n            </div>\n        </div>\n        <div class=\"container\" >\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12 d-flex justify-content-between \">\n                    <p> سطح تریاژ بیمار        </p>\n                    <p>\n                        5\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['triageLevelIS']==5\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['triageLevelIS'] !=5\" type=\"checkbox\"   />                     </p>\n                    <p>\n                        4\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['triageLevelIS']==4\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['triageLevelIS'] !=4\" type=\"checkbox\"   />\n                    </p>\n                    <p>\n                        3\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['triageLevelIS']==3\" type=\"checkbox\"  checked />\n\n                        <input  style=\"margin-top: 3px\"*ngIf=\"triazhInfo['item']['triageLevelIS'] !=3\" type=\"checkbox\"   />\n                    </p>\n                    <p>\n                        2\n                        <input *ngIf=\"triazhInfo['item']['triageLevelIS']==2\" type=\"checkbox\"  checked />\n\n                        <input *ngIf=\"triazhInfo['item']['triageLevelIS'] !=2\" type=\"checkbox\"   />\n                    </p>\n                    <p>\n                        1\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['triageLevelIS']==1\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['triageLevelIS'] !=1\" type=\"checkbox\"   />\n                    </p>\n                    <p>\n                        Patient Triage level:\n                    </p>\n\n\n                </div>\n                <div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid;\">\n                    <p class=\"font-weight-bold\">جداسازی بیمار و احتیاطات بیشتر کنترل عفونت   </p>\n                    <p class=\"font-weight-bold\">تماسی\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['separationByInfection']==0\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['separationByInfection'] !=0\" type=\"checkbox\"   />                </p>\n                    <p class=\"font-weight-bold\">قطره ای\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['separationByInfection']==1\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['separationByInfection'] !=1\" type=\"checkbox\"   />\n                    </p>\n                    <p class=\"font-weight-bold\">تنفسی\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['separationByInfection']==2\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['separationByInfection'] !=2\" type=\"checkbox\"   />\n                    </p>\n                    <p class=\"font-weight-bold\">نیاز ندارد\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['separationByInfection']==3\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['separationByInfection'] !=3\" type=\"checkbox\"   />\n                    </p>\n                </div>\n\n                <div class=\"col-12 d-flex d-flex justify-content-between \">\n                    <p class=\"font-weight-bold\">Patient Isolation and More Infection Control Precautions       </p>\n                    <p class=\"font-weight-bold\">Contact\n                    </p>\n                    <p class=\"font-weight-bold\">Droplet\n                    </p>\n                    <p class=\"font-weight-bold\">Airborne\n                    </p>\n                    <p class=\"font-weight-bold\">No Need to Isolation\n                    </p>\n                </div>\n                <div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid black;\">\n                    <div>\n                        <p class=\"font-weight-bold\">ارجاع به</p>\n                    </div>\n                    <div>\n                        <label for=\"\">سرپایی</label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['departure']==3\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['departure'] !=3\" type=\"checkbox\"   />\n                        <span>Fast track</span>\n                    </div>\n                    <div>\n                        <label for=\"\">احیا</label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['departure']==4\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['departure'] !=4\" type=\"checkbox\"   />\n                        <span> CPR</span>\n                    </div>\n                    <div>\n                        <label for=\"\">فضای بستری</label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['departure']==1\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['departure'] !=1\" type=\"checkbox\"   />\n                        <span>Inpatient Area </span>\n                    </div>\n                    <div>\n                        <label for=\"\">سایر...</label>\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['departure']==8\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 3px\" *ngIf=\"triazhInfo['item']['departure'] !=8\" type=\"checkbox\"   />\n                        <span>Other </span>\n                    </div>\n\n                    <div>\n                        <p class=\"font-weight-bold\">  :Refer to </p>\n                    </div>\n\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\" style=\"border-top: 1px solid black;\">\n                    <div class=\"col-6 d-flex\">\n                        <p>ساعت و تاریخ ارجاع</p>\n                        <span>\n                {{triazhInfo['item']['exitTime']}}\n            </span>\n                    </div>\n                    <div class=\"col-6 d-flex\" *ngIf=\"pracInfo\">\n                        <p> نام و نام خانوادگی مهر و امضای پرستار تریاژ  </p>\n                        <span *ngIf=\"pracInfo['item']\">{{pracInfo['item']['firstName']}}</span> <span class=\"mx-1\" *ngIf=\"pracInfo['item']\">{{pracInfo['item']['lastName']}}</span>\n                    </div>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\" >\n                    <div class=\"col-6 d-flex\">\n                        <p> Date & Time of Referral:  </p>\n                        <span></span>\n                    </div>\n                    <div class=\"col-6 d-flex\">\n                        <p>  Triage Nurse’s Name/Signature/Stamp     </p>\n                        <span>.........</span>\n                    </div>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\" style=\"border-top: 1px solid black;\">\n                    <p>توضیحات\n                        <span>......</span>\n                    </p>\n                    <p>\n        <span>\n            .......\n        </span>\n                        Description\n\n                    </p>\n                </div>\n            </div>\n            <div class=\"col-12 d-flex justify-content-between\" >\n                <p>این صفحه فرم صرفا توسط پرستار ترياژ تكمیل مي گردد</p>\n\n                <p>IR.MOHHIM-E01-2.0-9910</p>\n\n\n\n            </div>\n        </div>\n        <br>\n        <!-- page2 -->\n        <div class=\"container\" style=\"margin-top: 50px;\">\n            <div class=\"row col-12 br mt-2 d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12 d-flex justify-content-between\">\n                    <p>\n                        شرح حال و دستورات پزشک\n                    </p>\n                    <p>\n                        :Medical history & Physician Orders\n                    </p>\n                </div>\n                <div class=\"col-12\">\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <p style=\"text-align: right;\">{{triazhInfo['item']['practitionerComment']}}</p>\n                </div>\n\n                <div class=\"col-12\">\n                    <div class=\"d-flex justify-content-between roundBorder   \">\n                        <p>تشخیص...</p>\n                        <p>\n                            Diagnosis....\n                        </p>\n                    </div>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\">\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p>تاریخ و ساعت ویزیت </p>\n                        <p> ........   </p>\n                        <p>Date & Time Of Visit</p>\n\n                    </div>\n                    <div class=\"col-6 d-flex justify-content-between \" style=\"flex-wrap: nowrap;\">\n                        <p style=\"font-size: 10px;\"> نام و نام خانوادگی مهر و امضای پزشک   </p>\n                        <p> ...   </p>\n                        <p style=\"font-size: 10px;\">Physician's Name/Signature/Stamp</p>\n                    </div>\n\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12 d-flex justify-content-between\">\n                    <p>\n                        گزارش پرستاری:\n                    </p>\n                    <p>\n                        :  Nursing Report\n                    </p>\n                </div>\n\n                <div class=\"col-12\" style=\"text-align: right; direction: rtl;\">\n                    <p>\n                        بیمار با نام {{name}}  و نام خانوادگی {{lastName}} با سطح تریاژچهار   و با وسیله    {{transporterValue}}وبا شکایت اصلی    <span *ngFor=\"let i of mainVAlueArray\">{{i}},</span>,<span *ngFor=\"let a of eOtherCasesMainDisease\">{{a.description}}</span>           و حساسیت دارویی <span *ngFor=\"let i of aleryDrugFinaly\">{{i}}</span> و حساسیت غذایی    <span *ngFor=\"let i of foodAllerguValue\">{{i}},</span>  و در ساعت {{Time}}\n                        به اوراژانس منتقل شد.\n                    </p>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <!-- <p style=\"text-align: right;\">{{triazhInfo['item']['nurseComment']}} </p> -->\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\">\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p>تاریخ و ساعت گزارش </p>\n                        <p> ........   </p>\n                        <p> Report Date & Time:</p>\n\n                    </div>\n                    <div class=\"col-6 d-flex justify-content-between \" style=\"flex-wrap: nowrap;\" *ngIf=\"pracInfo\">\n                        <p style=\"font-size: 10px;\"> نام و نام خانوادگی مهر و امضای پرستار   </p>\n                        <p *ngIf=\"pracInfo['item']\">{{pracInfo['item']['firstName']}}  {{pracInfo['item']['lastName']}}    </p>\n                        <p style=\"font-size: 10px;\">Nurse's Name/Signature/Stamp</p>\n                    </div>\n\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12  \" style=\"text-align: right;\">\n                    <p>\n                        وضعیت نهایی بیمار :\n                    </p>\n\n                </div>\n                <div class=\"col-12 d-flex\" style=\"direction: rtl;text-align: right;\">\n                    <div class=\"col-6\">\n                        <p>بیمار در تاریخ<span>........</span> و ساعت <span>.......</span></p>\n                    </div>\n                    <div class=\"col-6\">\n                        <div>\n                            <input type=\"checkbox\" name=\"\" id=\"\">\n                            <label for=\"\">مرخص گردید</label>\n\n                        </div>\n\n                        <div>\n                            <input type=\"checkbox\" name=\"\" id=\"\">\n                            <label for=\"\">در بخش .......... بستری گردید </label>\n                        </div>\n                        <div>\n                            <input type=\"checkbox\" name=\"\" id=\"\">\n                            <label for=\"\">به درمانگاه  .......... ارجاع شد </label>\n                        </div>\n                        <div>\n                            <input type=\"checkbox\" name=\"\" id=\"\">\n                            <label for=\"\">به بیمارستان  .......... اعزام گردید </label>\n                        </div>\n\n                    </div>\n                </div>\n\n\n\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12  \" style=\"text-align: center;\">\n                    <p>\n                        اجازه معالجه و عمل جراحی (بجز ویزیت)\n                    </p>\n\n                </div>\n                <div class=\"col-12 \" style=\"direction: rtl;text-align: right;\">\n                    <p>\n                        اینجانب ............. بیمار/ساکن......... اجازه میدهم کزشک یا شزشان بیمارستان ...............\n                        هرنوع معالجه و در صورت لزوم عمل جراحی یا انتقال خون که صلاح بداند در مورد اینجانب/بیمار اینجانب به مورد اجرا گذراند و بدینوسیله برایت پزشکان و\n                        کارکنان این بیمارستان را از کلیه عوارض احتمالی اقدامات فوق که در مورد اینجانب/بیمار اینجانب انجام دهند اعلام میدارم.\n                    </p>\n                </div>\n                <div class=\"col-12\" style=\"direction: rtl; text-align: right;\">\n                    <p>\n                        نام و امضای بیمار/همراه بیمار..........\n                    </p>\n                </div>\n                <div class=\"col-12\" style=\"direction: rtl; text-align: right;\">\n                    <p>\n                        نام شاهد1............  تاریخ........ امضا.........\n                    </p>\n                    <p>\n                        نام شاهد2............  تاریخ........ امضا.........\n                    </p>\n\n                </div>\n            </div>\n\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12  \" style=\"text-align: center;\">\n                    <p>\n                        ترخیص با میل شخصی\n                    </p>\n\n                </div>\n                <div class=\"col-12 \" style=\"direction: rtl;text-align: right;\">\n                    <p>\n                        اینجانب ............. با میل شخصی خود بر خلاف صلاحدید و توصیه پزشکان مسئول بیمارستان ............؛این مرکز را با در نظر داشتن عواقب\n                        و خطرات احتمالی ترک می نمایم و اعلام میدارم که هیچ مسئولیتی متوجه مسئولان پزشکان و کارکنان این مرکز نخواهد بود.\n                    </p>\n                </div>\n                <div class=\"col-12  d-flex justify-content-between \" style=\"direction: rtl; text-align: right;\">\n                    <p>\n                        نام و امضای بیمار/همراه بیمار..........\n                    </p>\n                    <p>\n                        نام و امضای یکی از بستگان درجه اول بیمار...........\n                    </p>\n                </div>\n                <div class=\"col-12\" style=\"direction: rtl; text-align: right;\">\n                    <p>\n                        نام شاهد1............  تاریخ........ امضا.........\n                    </p>\n                    <p>\n                        نام شاهد2............  تاریخ........ امضا.........\n                    </p>\n\n                </div>\n            </div>\n\n        </div>\n    </div>\n\n</form>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/teriazh/page8/page8.component.html":
/*!******************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/teriazh/page8/page8.component.html ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<style>\n\n    .pos{\n        top: 0;\n        right: 0;\n        transform: translateY(-50%);\n        background-color: #F5F7FA;\n\n    }\n    .Customborder{\n        border: 2px solid #fcb103 ;\n    }\n    .myDIv{\n        animation: mymove 2s infinite;\n        color: white;\n        padding-top: 5px;\n        padding-bottom: 5px;\n        display: flex;\n        justify-content: space-between;\n    }\n    @keyframes mymove {\n        from {background-color: #063d78;}\n        to {background-color: #2a93d4;}\n    }\n    .posLft{\n        top: 0;\n        left: 0;\n        transform: translateY(-50%);\n        background-color: #F5F7FA;\n    }\n    .line{\n        height: 1px;\n        background-color: #fcb103\n    }\n    .btnW{\n        padding-right:20px !important;\n        padding-left: 20px !important;\n        padding-top: 3px!important;\n        padding-bottom: 3px!important;\n        border: 1px solid;\n        font-size:14px;\n        background-color:#fcb103 ;\n        color: white;\n\n    }\n    .btn{\n        border: 1px solid;\n        background-color: white;\n    }\n     .header{\n        background-color: #063d78;\n        color: white;\n        padding-top: 5px;\n        padding-bottom: 5px;\n         display: flex;\n         justify-content: space-between;\n    }\n    .header h5{\n        margin-top: 10px;\n        margin-left: 10px;\n        margin-right: 10px;\n    }\n    thead tr{\n        background-color:#a8f1f7;\n    }\n    input{\n        border-radius: 4px;\n        margin-bottom: 2px;\n        border: 1px solid black!important;\n    }\n    p{\n        color: black;\n    }\n    .positive{\n\n        background: linear-gradient(to right,#8bd424,  #64db1f,#6cc736);\n\n    }\n    .negative{\n        background: linear-gradient(to right,#99220f,  #b46919   ,#c78351);\n    }\n    .middleSpo{\n        background: linear-gradient(to right,#df9502,  #f2cb01, #ebe702);\n\n    }\n    .middlePro{\n        background: linear-gradient(to right,#fc7f03,  #c46506, #8a4601);\n\n    }\n\n    table{\n        text-align: center;\n    }\n    .br{\n        border:  2px solid black;\n    }\n    .p0{\n        padding: 0 !important\n    }\n    .br div{\n        padding: 0;\n    }\n    p,span,label,h4,h3,h5{\n        font-weight: bold;\n    }\n    .roundBorder{\n        border: 2px solid gray;\n        border-radius: 10px;\n    }\n    input[type=checkbox]{\n        width: 18px;\n        height: 18px;\n        margin-right: 3px;\n        margin-left: 3px;\n        margin-top:3px;\n    }\n\n</style>\n<form action=\"\" [formGroup]=\"level3Form\"  (ngSubmit)=\"onSubmit()\" >\n    <div class=\"d-flex justify-content-center\"  style=\"direction: rtl;text-align: right;transition: 500ms\"  style=\"font-family: iransans\" *ngIf=\"showResult===true\" >\n        <div class=\"alert alert-light col-4 position-absolute   \" style=\"z-index: 1000;font-size: 1.2em;text-align: right;top: 50%;left: 50%;transform: translate(-50%,-50%)\"  role=\"alert\" *ngIf=\"ISsubmitOK===true\">\n            <div class=\"d-flex justify-content-center\" >\n                <span class=\"mt-3\"> ثبت تریاژ با موفقیت انجام شد..</span>\n                <svg xmlns=\"http://www.w3.org/2000/svg\" style=\"color: limegreen;\" width=\"50\" height=\"50\" fill=\"currentColor\" class=\"bi bi-check2-circle\" viewBox=\"0 0 16 16\">\n                    <path d=\"M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z\"/>\n                    <path d=\"M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z\"/>\n                </svg>\n\n            </div>\n            <div class=\"d-flex\" *ngIf=\"ISsubmitOK===true\">\n                <p>کد رهگیری :</p>\n                <P>{{triageID}}</P>\n            </div>\n            <div style=\"text-align: left\">\n                <button class=\"btn\" type=\"button\" (click)=\"close()\"  style=\"font-family: iransans\"> بستن </button>\n            </div>\n\n        </div>\n        <div class=\"alert alert-light col-4 position-absolute   \" style=\"z-index: 1000;font-size: 1.2em;text-align: right;top: 50%;left: 50%;transform: translate(-50%,-50%)\"  role=\"alert\" *ngIf=\"isSubmitError===true\">\n            <div class=\"d-flex justify-content-center\" >\n                <span class=\"mt-3\">{{result}}</span>\n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"50\" style=\"color: yellow\" height=\"50\" fill=\"currentColor\" class=\"bi bi-exclamation-octagon\" viewBox=\"0 0 16 16\">\n                    <path d=\"M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z\"/>\n                    <path d=\"M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z\"/>\n                </svg>\n\n            </div>\n            <div style=\"text-align: left\">\n                <button class=\"btn\" type=\"button\" (click)=\"close()\"  style=\"font-family: iransans\"> بستن </button>\n            </div>\n        </div>\n    </div>\n    <div class=\"container-fluid\">\n        <div class=\"row mb-1\">\n            <div class=\"col-12 \">\n                <div class=\"header\" style=\"background:  background-color:#fbb034;\n        background-image: linear-gradient(315deg, #fbb034 0%, #ffdd00 74%);\">\n                    <h5 style=\"color: black\">سطح تریاژ بیمار 3</h5>\n                    <h5  style=\"font-family: Tahoma;color: black\">   Patient Triage Level 3</h5>\n\n                </div>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col-12\">\n                <div  class=\"header\">\n                    <h5 > علاِیم حیاتی</h5>\n                    <h5 >  :Vital Signs</h5>\n            </div>\n            </div>\n            <div class=\"col-12\">\n                <div class=\" d-flex Customborder\"  style=\"background-color: white;height: 120px;\">\n\n                    <div class=\" col-2\"  style=\"text-align: center\" [ngClass]=\"{'positive':T<38.0 && T>34.0,'negative':T>39 || T<33,'middleSpo':T>38.0 && T<41 || T>31 && T<35,'white':T==0}\" >\n                        <div style=\"color: black;\" class=\"shadow mt-3\">\n                              <p style=\"font-size: 15px;\">Temperature(C)</p>\n                              <input  type=\"text\"  [(ngModel)]=\"T\" formControlName=\"Temperature\" style=\"background-color: transparent;border: 1px solid black;text-align: center;color: white;font-size: 15px; width: 40px;\" >\n                        </div>\n                    </div>\n                    <div class=\" col-2\" style=\"text-align: center\" [ngClass]=\"{'positive':RRInput<26 && RRInput>7,'negative':RRInput>35 || RRInput<8,'middleSpo':RRInput>25 && RRInput<31,'middlePro':RRInput>30 && RRInput<35,'white':RRInput==0}\">\n                        <div style=\"color: white;\" class=\"shadow mt-3\">\n                            <p>RR(BPM)</p>\n                            <input type=\"text\"  [(ngModel)]=\"RRInput\"  formControlName=\"RR\"  style=\"background-color: transparent;border: none;text-align: center;color: white;font-size: 15px ;width: 40px;\" >\n                      </div>\n                    </div>\n\n\n                    <div class=\" col-2\" style=\"text-align: center\" [ngClass]=\"{'positive':PRInput<111 && PRInput>49,'negative':PRInput>129,'middleSpo':PRInput>110 && PRInput<121 || PRInput>39 && PRInput<50,'middlePro':PRInput>120 && PRInput<131 || PRInput<41,'white':PRInput==0}\">\n                        <div style=\"color: white;\" class=\"shadow mt-3\">\n                            <p>PR(BPM)</p>\n                            <input type=\"text\" [(ngModel)]=\"PRInput\"  formControlName=\"PR\" style=\"background-color: transparent;border: none;text-align: center;color: white;font-size: 15px; width: 40px;\" >\n                      </div>\n                    </div>\n\n                    <div class=\" col-2\" style=\"text-align: center\" [ngClass]=\"{'positive':BPmin<121,'negative':BPmin>139,'middleSpo':BPmin>119 && BPmin<130,'middlePro':BPmin>129 && BPmin<140,'white':BPmin==0}\">\n                        <div style=\"color: white;\" class=\"shadow mt-3\">\n                            <p> BP(mHg)</p>\n                            <input type=\"text\" [(ngModel)]=\"BPmin\"  formControlName=\"bpMin\" style=\"background-color: transparent;border: none;text-align: center;color: white;font-size: 15px; width: 40px;\" placeholder=\"min\">\n                      </div>\n                    </div>\n                    <div class=\" col-2\" style=\"text-align: center\" [ngClass]=\"{'positive':BPmax<81,'negative':BPmax>119,'middleSpo':BPmax>79 && BPmax<91,'middlePro':BPmax>89 && BPmax<121,'white':BPmax==0}\" >\n                        <div style=\"color: white;\" class=\"shadow mt-3\">\n                            <p>BP(mHg)</p>\n                            <input type=\"text\" [(ngModel)]=\"BPmax\" formControlName=\"BPmax\"  style=\"background-color: transparent;border: none;text-align: center;color: white;font-size: 15px; width: 40px;\"  placeholder=\"max\">\n                      </div>\n                    </div>\n                    <div class=\" col-2\" style=\"text-align: center\" [ngClass]=\"{\n                        'negative':Spo2Input<91,\n                        'positive':Spo2Input>95,\n                         'middleSpo':Spo2Input>90 && Spo2Input<95}\"   >\n                        <div style=\"color: white;\" class=\"shadow mt-3\" >\n                            <p> (%)SpO2</p>\n                            <input type=\"text\" [(ngModel)]=\"Spo2Input\"   formControlName=\"Spo2\" style=\"background-color: transparent;border: none;text-align: center;color: white;font-size: 15px; width: 40px;\" >\n                      </div>\n                    </div>\n                </div>\n\n            </div>\n    \n                    <div class=\"col-12 mt-2\">\n                        <div class=\"header\">\n                            <h5 >  محدوده پر خطر علایم حیاتی  </h5>\n\n                            <h5 >   Vital Signs Danger zone Vital</h5>\n\n\n\n\n                    </div>\n                    </div>\n            \n                    <div class=\"col-12\" style=\"font-family: Tahoma;\">\n                        <table class=\"table table-bordered \" style=\"text-align: center;\" >\n                        <thead>\n                        <tr  >\n                            <th scope=\"col\">SPO2</th>\n                            <th scope=\"col\">RR</th>\n                            <th scope=\"col\">HR</th>\n                            <th scope=\"col\">Age</th>\n                        </tr>\n                        </thead>\n                        <tbody>\n                        <tr>\n                            <th scope=\"row\">SPO2<92%</th>\n                            <td style=\"text-align: center;\"> 50<  </td>\n                            <td> < 180 </td>\n                            <td> < 3 m </td>\n                        </tr>\n    \n                        <tr>\n                            <th scope=\"row\">SPO2<92%</th>\n                            <td>\n                                40<\n                            </td>\n                            <td>\n                                < 160\n                            </td>\n                            <td> 3m - 3Y</td>\n                        </tr>\n                        <tr>\n                            <th scope=\"row\">SPO2<92%</th>\n                            <td>\n                                30<\n                            </td>\n                            <td>\n                                < 140\n                            </td>\n                            <td> 3 - 8Y</td>\n                        </tr>\n                        <tr>\n                            <th scope=\"row\">SPO2<92%</th>\n                            <td>\n                                20<\n                            </td>\n                            <td>\n                                < 100\n                            </td>\n                            <td> \n                               8Y<\n                                \n                            </td>\n                        </tr>\n                        </tbody>\n                    </table>\n                    </div>\n                 \n                     \n                  \n        </div>\n        \n           \n       \n         \n     \n    </div>\n    <div class=\"container-fluid\">\n\n        <div class=\"row\">\n            <div class=\"col-12\">\n                <div class=\"header\">\n                    <h5 style=\"text-align: center;\">جداسازی  بیمار و کنترل عفونت</h5>\n                    <h5>:Patient Isolation and Higher of  Precaution</h5>\n            </div>\n            <div class=\"col-12  border \" style=\"text-align: right;background-color: #f2f2f2\" ngDefaultControl formControlName=\"Separation\"  >\n                <button type=\"button\" [style.background-color]=\"i.BackgroundColour\" [style.color]=\"i.color\" class=\"btn  mt-2 ml-2\" *ngFor='let i of SeparationByInfectionList' (click)=\"getSeparationByInfectionList(i.Key,i)\">\n                        {{i.Value}}\n                </button>\n\n            </div>\n            </div>\n            </div>\n            <div class=\"row mt-2\">\n                <div class=\"col-12\">\n                    <div [ngClass]=\"{'header':refeValid===true,'myDIv':refeValid===false}\">\n                        <h5 >\n                            ارجاع به\n                        </h5>\n                        <h5 >\n                            :Refer To\n                        </h5>\n                </div>\n                <div class=\"col-12  border \" style=\"text-align: right;background-color: #f2f2f2\" ngDefaultControl formControlName=\"Departure\"  >\n                    <button type=\"button\" [style.background-color]=\"i.BackgroundColour\" [style.color]=\"i.color\" class=\"btn  mt-2 ml-2\"*ngFor=\"let i of departureList\" (click)=\"getDeparture(i.Key,i)\">\n                {{i.Value}}\n                </button>\n\n                </div>\n                </div>\n                </div>\n\n    <button type=\"button\" [disabled]=\"refeValid===false\" class=\"btn btn-outline-primary\" (click)=\"onSubmit()\">\n        ثبت\n    </button>\n        <button type=\"button\" [disabled]=\"printOK===false\" class=\"btn btn-outline-primary col-1\" (click)=\"send()\">\n            ثبت و پایان\n        </button>\n\n        <button type=\"button\" [disabled]=\"printOK===false\" class=\"btn btn-outline-primary border ml-1\"  printSectionId=\"print-section\" [printStyle]= \"{div: {'direction' : 'rtl'}}\" [useExistingCss]=\"true\" ngxPrint >پرینت تریاژ</button>\n        <button type=\"button\" class=\"btn mb-2 btnHover\" style=\"background-color: #3898C5;color: white\" [routerLink]=\"['/teriazh/Patient-Triage']\">\n            صفحه قبلی\n            <svg  xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-arrow-return-left\" viewBox=\"0 0 16 16\">\n                <path fill-rule=\"evenodd\" d=\"M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z\"/>\n            </svg>\n\n        </button>\n\n    </div>\n\n\n     <!--print-section-->\n\n\n    <!--<div class=\"container\"  id=\"print-section\" style=\"visibility: hidden;display: none\">-->\n        <!--<div *ngIf=\"triazhInfo\" >-->\n            <!--<div class=\"col-12 text-center\">-->\n                <!--<h3>وزارت بهداشت درمان و آموزش پزشکی</h3>-->\n                <!--<h4>Ministry of Health & Medical Education</h4>-->\n            <!--</div>-->\n            <!--<div class=\"row mt-1\">-->\n                <!--<div class=\"col-12 d-flex justify-content-around\">-->\n                    <!--<div>-->\n                        <!--&lt;!&ndash;<img style=\"width: 100px;height: auto;\" src=\"../../../assets/img/gallery/barcode.png\" alt=\"\">&ndash;&gt;-->\n                        <!--<ngx-barcode [bc-value]=\"triazhInfo['item']['id']\" [bc-display-value]=\"true\"></ngx-barcode>-->\n                    <!--</div>-->\n                    <!--<h4>دانشگاه علوم پزشکی داشگاه علوم پزشکی ایران </h4>-->\n                    <!--<h4>:University of Medical Science </h4>-->\n                <!--</div>-->\n\n            <!--</div>-->\n            <!--<div class=\"row mt-1\">-->\n                <!--<div class=\"col-12  d-flex justify-content-around\">-->\n                    <!--<div>-->\n                        <!--<span>کد تریاژ</span>-->\n                        <!--<span>{{triazhInfo['item']['id']}}</span>-->\n                    <!--</div>-->\n                    <!--<h4> مرکز پزشکی آموزشی درمانی  بیمارستان رایاوران توسعه </h4>-->\n                    <!--<h4>:Medical Center</h4>-->\n                <!--</div>-->\n            <!--</div>-->\n            <!--<div class=\"row mt-1\">-->\n                <!--<div class=\"col-12  d-flex justify-content-around\">-->\n                    <!--<div class=\"col-3 \">-->\n                        <!--<div class=\"br\" style=\"width:220px;height:50px; \">-->\n                            <!--شماره پرونده-->\n                            <!--<span>-->\n                            <!--Record No:-->\n                        <!--</span>-->\n                        <!--</div>-->\n\n                    <!--</div>-->\n                    <!--<div class=\" col-6 text-center\">-->\n                        <!--<h4>   فرم تریاژ بخش اورژانس بیمارستان </h4>-->\n                        <!--<h5>HOSPITAL EMERGENCY DEPARTMENT trIAGE FORM </h5>-->\n                    <!--</div>-->\n                    <!--<div class=\"col-3 text-left\" style=\"direction: ltr;\">-->\n                        <!--<div style=\"width:220px;height:50px\" class=\"br text-right\">-->\n                <!--<span class=\"text-right\">-->\n                    <!--سطح تریاژ بیمار-->\n               <!--</span>-->\n                            <!--<span class=\"font-weight-bold\">-->\n                  <!--{{triazhInfo['item']['triageLevelIS']}}-->\n               <!--</span></div>-->\n                    <!--</div>-->\n                <!--</div>-->\n            <!--</div>-->\n            <!--<div class=\"container\" >-->\n                <!--<div class=\"row mt-1 col-12 br d-flex justify-content-around\" style=\"direction: rtl;padding: 0;\">-->\n                    <!--<div class=\"col-12 d-flex \">-->\n                        <!--<div class=\"col-3 d-flex justify-content-between \" style=\"border-left: 1px solid black;\" >-->\n                            <!--<p>نام خانوادگی</p>-->\n                            <!--<p class=\"mt-4\">{{triazhInfo['item']['lastName']}}</p>-->\n                            <!--<p>Family Name</p>-->\n                        <!--</div>-->\n                        <!--<div class=\"col-3 d-flex justify-content-between\" style=\"border-left: 1px solid black;\">-->\n                            <!--<p>نام </p>-->\n                            <!--<p class=\"mt-4\">-->\n                                <!--{{triazhInfo['item']['firstName']}}-->\n                            <!--</p>-->\n                            <!--<p> Name</p>-->\n                        <!--</div>-->\n                        <!--<div class=\"col-3 d-flex justify-content-between \" style=\"border-left: 1px solid black;\">-->\n                            <!--<div style=\"text-align: right;\">-->\n                                <!--<p>جنس</p>-->\n                                <!--<div>-->\n                                    <!--<label for=\"\">مذکر</label>-->\n                                    <!--<input *ngIf=\"triazhInfo['item']['gender']==0\" type=\"checkbox\" ng-disabled=\"true\" checked />-->\n\n                                    <!--<input *ngIf=\"triazhInfo['item']['gender'] !=0\" type=\"checkbox\" ng-disabled=\"true\"  />-->\n                                    <!--<span>F</span>-->\n                                    <!--<input type=\"checkbox\" >-->\n                                    <!--<label for=\"\" style=\"margin-right: 30px;\">مونث</label>-->\n                                    <!--<input *ngIf=\"triazhInfo['item']['gender']==1\" type=\"checkbox\"  checked />-->\n\n                                    <!--<input *ngIf=\"triazhInfo['item']['gender'] !=1\" type=\"checkbox\"   />-->\n                                    <!--<span>M</span>-->\n                                <!--</div>-->\n                            <!--</div>-->\n\n                            <!--<div>-->\n                                <!--<p>Sex</p>-->\n                            <!--</div>-->\n                        <!--</div>-->\n                        <!--<div class=\"col-3 \">-->\n                            <!--<div class=\"d-flex justify-content-between\">-->\n                                <!--<p>تاریخ مراجعه</p>-->\n                                <!--&lt;!&ndash;<p>&ndash;&gt;-->\n                                    <!--&lt;!&ndash;{{triazhInfo['item']['entranceTime']}}&ndash;&gt;-->\n                                <!--&lt;!&ndash;</p>&ndash;&gt;-->\n                                <!--<p>Date of Arrival</p>-->\n                            <!--</div>-->\n                            <!--<div class=\"d-flex justify-content-between\">-->\n                                <!--<p>ساعت مراجعه</p>-->\n                                <!--<p>{{triazhInfo['item']['entranceTime']}}</p>-->\n                                <!--<p>Time of Arrival</p>-->\n                            <!--</div>-->\n                        <!--</div>-->\n\n                    <!--</div>-->\n                    <!--<div class=\"col-12 d-flex justify-content-between \" style=\"border-top: 1px solid black;\">-->\n                        <!--<div class=\"col-6 d-flex justify-content-between\">-->\n                            <!--<div class=\"col-6 d-flex justify-content-between \" style=\"border-left: 1px solid black;\">-->\n                                <!--<p>کد ملی </p>-->\n                                <!--<p>-->\n                                    <!--{{triazhInfo['item']['nationalCode']}}-->\n                                <!--</p>-->\n                                <!--<p>National Code</p>-->\n                            <!--</div>-->\n                            <!--<div class=\"col-6 d-flex justify-content-between\" style=\"border-left: 1px solid black;\">-->\n                                <!--<p>تاریخ تولد  </p>-->\n                                <!--<p>-->\n                                    <!--{{triazhInfo['item']['birthDate']}}-->\n                                <!--</p>-->\n                                <!--<p>Date of Birth </p>-->\n                            <!--</div>-->\n                        <!--</div>-->\n                        <!--<div class=\"col-6 d-flex justify-content-between\">-->\n                            <!--<div>-->\n                                <!--<p>باردار</p>-->\n                            <!--</div>-->\n                            <!--<div>-->\n                                <!--<label for=\"\">بلی </label>-->\n                                <!--<input *ngIf=\"triazhInfo['item']['pregnant']==1\" type=\"checkbox\" ng-disabled=\"true\" checked />-->\n\n                                <!--<input *ngIf=\"triazhInfo['item']['pregnant'] !=1\" type=\"checkbox\" ng-disabled=\"true\"  />                  <span>yes</span>-->\n                            <!--</div>-->\n                            <!--<div>-->\n                                <!--<label for=\"\">خیر </label>-->\n                                <!--<input *ngIf=\"triazhInfo['item']['pregnant']==0\" type=\"checkbox\" ng-disabled=\"true\" checked />-->\n\n                                <!--<input *ngIf=\"triazhInfo['item']['pregnant'] !=0\" type=\"checkbox\" ng-disabled=\"true\"  />                    <span>No</span>-->\n                            <!--</div>-->\n                            <!--<div>-->\n                                <!--<label for=\"\">نامعلوم </label>-->\n                                <!--<input *ngIf=\"triazhInfo['item']['pregnant']==2\" type=\"checkbox\" ng-disabled=\"true\" checked />-->\n\n                                <!--<input *ngIf=\"triazhInfo['item']['pregnant'] !=2\" type=\"checkbox\" ng-disabled=\"true\"  />                    <span>unknown</span>-->\n                            <!--</div>-->\n                            <!--<div>-->\n                                <!--<p>Pregnant</p>-->\n                            <!--</div>-->\n\n\n                        <!--</div>-->\n\n                    <!--</div>-->\n\n\n\n                <!--</div>-->\n            <!--</div>-->\n            <!--<div class=\"container\">-->\n                <!--<div class=\"row col-12 br d-flex justify-content-around\" style=\"direction: rtl;padding: 0;\">-->\n                    <!--<div class=\"col-12 mt-1 d-flex justify-content-between\" style=\"text-align: right;\">-->\n                        <!--<h4>نحوه مراجعه</h4>-->\n                        <!--<h4>:Arrival Mode </h4>-->\n                    <!--</div>-->\n                    <!--<div class=\"col-12 mt-1 \" style=\"text-align: right;\">-->\n                        <!--<span>آمبولانس 115</span>-->\n                        <!--<input *ngIf=\"triazhInfo['item']['arrival_Transport']==2\" type=\"checkbox\" ng-disabled=\"true\" checked />-->\n\n                        <!--<input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=2\" type=\"checkbox\" ng-disabled=\"true\"  />              <span>EMS </span>-->\n                        <!--<span style=\"margin-right: 60px;\">آمبولانس خصوصی</span>-->\n                        <!--<input *ngIf=\"triazhInfo['item']['arrival_Transport']==5\" type=\"checkbox\" ng-disabled=\"true\" checked />-->\n\n                        <!--<input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=5\" type=\"checkbox\" ng-disabled=\"true\"  />              <span>Private Ambulance  </span>-->\n                        <!--<span style=\"margin-right: 60px;\"> شخصی</span>-->\n                        <!--<input *ngIf=\"triazhInfo['item']['arrival_Transport']==4\" type=\"checkbox\" ng-disabled=\"true\" checked />-->\n\n                        <!--<input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=4\" type=\"checkbox\" ng-disabled=\"true\"  />               <span>By Her Own </span>-->\n                        <!--<span style=\"margin-right: 60px;\">امداد هوایی </span>-->\n                        <!--<input *ngIf=\"triazhInfo['item']['arrival_Transport']==6\" type=\"checkbox\" ng-disabled=\"true\" checked />-->\n\n                        <!--<input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=6\" type=\"checkbox\" ng-disabled=\"true\"  />             <span>Air Ambulance   </span>-->\n                        <!--<span style=\"margin-right: 60px;\"> سایر</span>-->\n                        <!--<input *ngIf=\"triazhInfo['item']['arrival_Transport']==8\" type=\"checkbox\" ng-disabled=\"true\" checked />-->\n\n                        <!--<input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=8\" type=\"checkbox\" ng-disabled=\"true\"  />             <span>Other   </span>-->\n                    <!--</div>-->\n                    <!--<div class=\"col-12 d-flex justify-content-between \" style=\"text-align: right;border-top: 1px solid black;\">-->\n                        <!--<div class=\"col-4 mt-1\">-->\n                            <!--<p>مراجعه بیمار در 24 ساعت گذشته</p>-->\n                        <!--</div>-->\n                        <!--<div class=\"col-4 d-flex mt-1\" style=\"text-align: right;direction: rtl;\">-->\n                            <!--<div class=\"col-4\">-->\n                                <!--<span>همین بیمارستان</span>-->\n                                <!--<input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems']==0\" type=\"checkbox\"  checked />-->\n\n                                <!--<input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems'] !=0\" type=\"checkbox\"   />-->\n                            <!--</div>-->\n                            <!--<div class=\"col-4\">-->\n                                <!--<span>بیمارستان دیگر </span>-->\n                                <!--<input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems']==1\" type=\"checkbox\"  checked />-->\n\n                                <!--<input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems'] !=1\" type=\"checkbox\"   />-->\n                            <!--</div>-->\n                            <!--<div class=\"col-4\">-->\n                                <!--<span>خیر</span>-->\n                                <!--<input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems']==2\" type=\"checkbox\"  checked />-->\n\n                                <!--<input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems'] !=2\" type=\"checkbox\"   />                </div>-->\n                        <!--</div>-->\n                        <!--<div class=\"col-4 mt-1\" style=\"text-align: left;\">-->\n                            <!--<p>  :Patient Presence in ED in 24 Past Hours   </p>-->\n                        <!--</div>-->\n\n                    <!--</div>-->\n                    <!--<div class=\"col-12 d-flex justify-content-between\"  style=\"text-align: right\">-->\n                        <!--<div class=\"col-4\"></div>-->\n                        <!--<div class=\"col-4 d-flex mt-1\">-->\n                            <!--<div class=\"col-4\">-->\n                                <!--<span> This Hospital</span>-->\n                            <!--</div>-->\n                            <!--<div class=\"col-4\">-->\n                    <!--<span>Other Hospital-->\n\n                    <!--</span>-->\n                            <!--</div>-->\n                            <!--<div class=\"col-4\">-->\n                                <!--<span>No</span>-->\n                            <!--</div>-->\n\n                        <!--</div>-->\n                        <!--<div class=\"col-4\"></div>-->\n                    <!--</div>-->\n\n                <!--</div>-->\n            <!--</div>-->\n            <!--<div class=\"container\">-->\n\n                <!--<div class=\"row col-12 br d-flex justify-content-around\" style=\"direction: rtl;\">-->\n                    <!--<div class=\"col-12 mt-1 \" style=\"text-align: right;\">-->\n                        <!--<h5 class=\"font-weight-bold\">شکایت اصلی</h5>-->\n                    <!--</div>-->\n                    <!--<div class=\"col-12  d-flex justify-content-between \" style=\"text-align: right;\">-->\n                        <!--<div class=\"d-flex\">-->\n                            <!--<h5 class=\"font-weight-bold\">شرح شکایت بیمار :</h5>-->\n                            <!--<span>-->\n<!--{{triazhInfo['item']['mainDisease']}}-->\n                <!--</span>-->\n                        <!--</div>-->\n                        <!--<div>-->\n                <!--<span>Chief Complaint-->\n                <!--</span>-->\n                        <!--</div>-->\n                    <!--</div>-->\n                    <!--<div class=\"col-12 mt-2  d-flex justify-content-between \" style=\"text-align: right;\">-->\n                        <!--<div >-->\n                            <!--<p class=\"font-weight-bold\">سابقه حساسیت دارویی:   </p>-->\n                            <!--<span>-->\n                    <!--{{triazhInfo['item']['drugHistory']}}-->\n\n                <!--</span>-->\n\n                        <!--</div>-->\n                        <!--<div>-->\n                            <!--<p>History of Drug and Food Allergy</p>-->\n                        <!--</div>-->\n                    <!--</div>-->\n                <!--</div>-->\n            <!--</div>-->\n\n\n\n            <!--<div class=\"container\">-->\n                <!--<div class=\"col-12 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">-->\n                    <!--<div >-->\n                        <!--<p> بیماران سطح 1 (شرایط تهدید کننده حیات )</p>-->\n                    <!--</div>-->\n                    <!--<div class=\"\" >-->\n                        <!--<span>..............................................</span>-->\n                    <!--</div>-->\n                    <!--<div >-->\n\n                        <!--<p>-->\n                            <!--Triage level 1 (Life threatening situation)-->\n                        <!--</p>-->\n                    <!--</div>-->\n                <!--</div>-->\n            <!--</div>-->\n            <!--<div class=\"container\">-->\n                <!--<div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">-->\n                    <!--<div class=\"col-12 d-flex justify-content-between\">-->\n                        <!--<div>-->\n                <!--<span>-->\n                    <!--سطح هوشیاری بیمار:-->\n\n                <!--</span>-->\n                        <!--</div>-->\n                        <!--<div  style=\"text-align: right;direction: rtl;\">-->\n                <!--<span >-->\n                    <!--بدون پاسخ-->\n                <!--</span>-->\n                            <!--<input *ngIf=\"triazhInfo['item']['stateOfAlertIS']==4\" type=\"checkbox\"  checked />-->\n\n                            <!--<input *ngIf=\"triazhInfo['item']['stateOfAlertIS'] !=4\" type=\"checkbox\"   />              </div>-->\n                        <!--<div>-->\n                <!--<span>-->\n                    <!--پاسخ به محرک دردناک-->\n               <!--</span>-->\n                            <!--<input *ngIf=\"triazhInfo['item']['stateOfAlertIS']==3\" type=\"checkbox\"  checked />-->\n\n                            <!--<input *ngIf=\"triazhInfo['item']['stateOfAlertIS'] !=3\" type=\"checkbox\"   />               </div>-->\n                        <!--<div>-->\n                <!--<span>-->\n                    <!--پاسخ به محرک کلامی-->\n                <!--</span>-->\n                            <!--<input *ngIf=\"triazhInfo['item']['stateOfAlertIS']==2\" type=\"checkbox\"  checked />-->\n\n                            <!--<input *ngIf=\"triazhInfo['item']['stateOfAlertIS'] !=2\" type=\"checkbox\"   />               </div>-->\n                        <!--<div>-->\n                <!--<span>-->\n                    <!--هوشیار-->\n               <!--</span>-->\n                            <!--<input *ngIf=\"triazhInfo['item']['stateOfAlertIS']==1\" type=\"checkbox\"  checked />-->\n\n                            <!--<input *ngIf=\"triazhInfo['item']['stateOfAlertIS'] !=1\" type=\"checkbox\"   />-->\n                        <!--</div>-->\n\n                    <!--</div>-->\n                    <!--<div class=\"col-12 d-flex justify-content-between\">-->\n                        <!--<div>-->\n                <!--<span>-->\n                    <!--سیستم:(AVPU)-->\n                <!--</span>-->\n\n                        <!--</div>-->\n                        <!--<div>-->\n                <!--<span>-->\n                    <!--Unresponsive (U)-->\n                 <!--</span>-->\n                        <!--</div>-->\n                        <!--<div>-->\n                <!--<span>-->\n                    <!--Response to Pain Stimulus(P)-->\n                 <!--</span>-->\n                        <!--</div>-->\n                        <!--<div>-->\n                <!--<span>-->\n                    <!--Response to Verbal Stimulus(V)-->\n                 <!--</span>-->\n                        <!--</div>-->\n                        <!--<div>-->\n                <!--<span>-->\n                    <!--Alert (A)-->\n\n                 <!--</span>-->\n                        <!--</div>-->\n                    <!--</div>-->\n                    <!--<div class=\"col-12 d-flex justify-content-between\" style=\"border-top: 1px solid black;\">-->\n                        <!--<div style=\"border-left: 1px solid black;text-align: right;\">-->\n                            <!--<label for=\"\">مخاطره راه هوایی</label>-->\n                            <!--<input *ngIf=\"triazhInfo['item']['dangerousRespire']==='True'\" type=\"checkbox\"  checked />-->\n\n                            <!--<input *ngIf=\"triazhInfo['item']['dangerousRespire'] !='False'\" type=\"checkbox\"   />-->\n                            <!--<p>-->\n                                <!--Airway compromise-->\n                            <!--</p>-->\n                        <!--</div>-->\n                        <!--<div style=\"border-left: 1px solid black;text-align: right;\">-->\n                            <!--<label for=\"\"> دیسترس شدید تنفسی </label>-->\n                            <!--<input *ngIf=\"triazhInfo['item']['respireDistress']==='True'\" type=\"checkbox\"  checked />-->\n\n                            <!--<input *ngIf=\"triazhInfo['item']['respireDistress'] !='False'\" type=\"checkbox\"   />                <p>-->\n                            <!--Sever Respiratory Distress-->\n                        <!--</p>-->\n                        <!--</div>-->\n                        <!--<div style=\"border-left: 1px solid black;text-align: right;\">-->\n                            <!--<label for=\"\">  سیانوز</label>-->\n                            <!--<input *ngIf=\"triazhInfo['item']['sianosis']==='True'\" type=\"checkbox\"  checked />-->\n\n                            <!--<input *ngIf=\"triazhInfo['item']['sianosis'] !='False'\" type=\"checkbox\"   />                   <p>-->\n                            <!--Cyanosis-->\n                        <!--</p>-->\n                        <!--</div>-->\n                        <!--<div style=\"border-left: 1px solid black;text-align: right;\">-->\n                            <!--<label for=\"\">  علایم شوک</label>-->\n                            <!--<input *ngIf=\"triazhInfo['item']['shock']==='True'\" type=\"checkbox\"  checked />-->\n\n                            <!--<input *ngIf=\"triazhInfo['item']['shock'] !='False'\" type=\"checkbox\"   />-->\n                            <!--<p>-->\n                                <!--Signs of Shock-->\n                            <!--</p>-->\n                        <!--</div>-->\n                        <!--<div>-->\n                            <!--<label for=\"\"> اشباع اکسیژن کمتر از 90 درصد </label>-->\n                            <!--<input *ngIf=\"triazhInfo['item']['spo2LowerThan90']==='True'\" type=\"checkbox\"  checked />-->\n\n                            <!--<input *ngIf=\"triazhInfo['item']['spo2LowerThan90'] !='False'\" type=\"checkbox\"   />-->\n                            <!--<p>-->\n                                <!--SpO2 < 90-->\n                            <!--</p>-->\n                        <!--</div>-->\n\n                    <!--</div>-->\n\n                <!--</div>-->\n            <!--</div>-->\n            <!--<div class=\"container\">-->\n                <!--<div class=\"col-12 mt-1 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">-->\n                    <!--<div class=\"\">-->\n                        <!--<p> بیماران سطح 2 </p>-->\n                    <!--</div>-->\n                    <!--<div class=\"p0\" ><span>..............................................................................................................................</span></div>-->\n                    <!--<div class=\"p0\">-->\n                        <!--<p>-->\n                            <!--Triage level 2-->\n                        <!--</p>-->\n                    <!--</div>-->\n                <!--</div>-->\n            <!--</div>-->\n            <!--<div class=\"container\">-->\n                <!--<div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">-->\n\n                    <!--<div class=\"col-12 d-flex justify-content-between\" >-->\n                        <!--<div class=\"col-3 text-center\" style=\"border-left: 1px solid black;\">-->\n                            <!--<label for=\"\">شرایط پر خطر   </label>-->\n                            <!--<input *ngIf=\"triazhInfo['item']['highDanger']==='True'\" type=\"checkbox\"  checked />-->\n\n                            <!--<input *ngIf=\"triazhInfo['item']['highDanger'] !='False'\" type=\"checkbox\"   />                <p>-->\n                            <!--High Risk Conditions-->\n                        <!--</p>-->\n                        <!--</div>-->\n                        <!--<div class=\"col-3 text-center\" style=\"border-left: 1px solid black;\">-->\n                            <!--<label for=\"\">-->\n                                <!--لتارژی خواب آلودگی اختلال جهت یابی-->\n\n                            <!--</label>-->\n                            <!--<input *ngIf=\"triazhInfo['item']['lethargy']==='True'\" type=\"checkbox\"  checked />-->\n\n                            <!--<input *ngIf=\"triazhInfo['item']['lethargy'] !='False'\" type=\"checkbox\"   />-->\n                            <!--<p>-->\n\n                                <!--lethargy/ confusion/ disorientation-->\n                            <!--</p>-->\n                        <!--</div>-->\n                        <!--<div class=\"col-3 text-center\" style=\"border-left: 1px solid black;\">-->\n                            <!--<label for=\"\">  دیترس شدید روان </label>-->\n                            <!--<input *ngIf=\"triazhInfo['item']['highDistress']==='True'\" type=\"checkbox\"  checked />-->\n\n                            <!--<input *ngIf=\"triazhInfo['item']['highDistress'] !='False'\" type=\"checkbox\"   />-->\n                            <!--<p>-->\n                                <!--Sever psychiatric Distress-->\n                            <!--</p>-->\n                        <!--</div>-->\n                        <!--<div  class=\"d-flex col-3 justify-content-between\">-->\n                            <!--<div style=\"margin-top: 10px\">-->\n                                <!--<span for=\"\">   درد شدید</span>-->\n                                <!--<p>-->\n                                    <!--Sever Pain-->\n                                <!--</p>-->\n                            <!--</div>-->\n                                  <!--<div  style=\"margin-top: 10px;position: relative;margin-left: 10px\" >-->\n                                    <!--<div style=\"padding: 0\">   {{painPrint}}</div>-->\n                                     <!--<div class=\"text-bold-700\" style=\"border-bottom: 1px solid;position: static \"></div>-->\n                                      <!--<div style=\"position: static\" >10</div>-->\n                                    <!--</div>-->\n                        <!--</div>-->\n                    <!--</div>-->\n                    <!--<div class=\"col-12 d-flex \" style=\"border-top: 1px solid;\">-->\n                        <!--<div class=\"col-6 d-flex justify-content-between \">-->\n                            <!--<p>سابقه پزشکی </p>-->\n                            <!--<span>-->\n                    <!--{{triazhInfo['item']['medicalHistory']}}-->\n\n                <!--</span>-->\n                            <!--<p>-->\n                                <!--Medical history-->\n                            <!--</p>-->\n                        <!--</div>-->\n                        <!--<div class=\"col-6 d-flex justify-content-between \">-->\n                            <!--<p>سابقه دارویی </p>-->\n                            <!--<span>-->\n                    <!--{{triazhInfo['item']['drugHistory']}}-->\n\n                <!--</span>-->\n                            <!--<p>-->\n                                <!--Drug history-->\n                            <!--</p>-->\n                        <!--</div>-->\n                    <!--</div>-->\n                    <!--<div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid;\">-->\n                        <!--<p class=\"font-weight-bold\">علایم حیاتی  </p>-->\n                        <!--<p class=\"font-weight-bold\">:sign Vital </p>-->\n                    <!--</div>-->\n                    <!--<div class=\"col-12 d-flex justify-content-between\" style=\"flex-wrap: nowrap;\">-->\n                        <!--<div class=\"\">-->\n                            <!--<span>فشارخون</span>-->\n                            <!--<span>-->\n                         <!--{{bpPrint}}-->\n                <!--</span>-->\n                            <!--<span>BP <small>mmHg</small></span>-->\n                        <!--</div>-->\n                        <!--<div  class=\"\">-->\n                            <!--<span>تعداد ضربان</span>-->\n                            <!--<span>   {{prPrint}} </span>-->\n                            <!--<span>PR/min</span>-->\n                        <!--</div>-->\n                        <!--<div  class=\"\">-->\n                            <!--<span>:تنفس</span>-->\n                            <!--<span>   {{rrPrint}}    </span>-->\n                            <!--<span>RR/min</span>-->\n                        <!--</div>-->\n                        <!--<div class=\"\">-->\n                            <!--<span>:دمای بدن</span>-->\n                            <!--<span>  {{tPrint}}   </span>-->\n                            <!--<span>T</span>-->\n                        <!--</div>-->\n                        <!--<div  class=\"\">-->\n                            <!--<span>:درصد اشباع اکسیژن </span>-->\n                            <!--<span>  {{spo2Print}}   </span>-->\n                            <!--<span>Spo2%</span>-->\n                        <!--</div>-->\n                    <!--</div>-->\n                <!--</div>-->\n            <!--</div>-->\n            <!--<div class=\"container\">-->\n                <!--<div class=\"col-12 mt-1 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">-->\n                    <!--<div class=\"\">-->\n                        <!--<p> بیماران سطح 3 </p>-->\n                    <!--</div>-->\n                    <!--<div class=\"p0\" ><span>..............................................................................................................................</span></div>-->\n                    <!--<div class=\"p0\">-->\n                        <!--<p>-->\n                            <!--Triage level 3-->\n                        <!--</p>-->\n                    <!--</div>-->\n                <!--</div>-->\n            <!--</div>-->\n            <!--<div class=\"container\">-->\n\n                <!--<div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">-->\n                    <!--<div class=\"col-12 d-flex \">-->\n                        <!--<div class=\"col-6 d-flex justify-content-between \">-->\n                            <!--<p> تعداد تسهیلات مورد نظر در بخش اورژانس </p>-->\n                            <!--<p>-->\n                                <!--دو مورد بیشتر-->\n                                <!--<input *ngIf=\"triazhInfo['item']['serviceCountIS']==3\" type=\"checkbox\"  checked />-->\n\n                                <!--<input *ngIf=\"triazhInfo['item']['serviceCountIS'] !=3\" type=\"checkbox\"   />-->\n                            <!--</p>-->\n                        <!--</div>-->\n                        <!--<div class=\"col-6 d-flex justify-content-between \">-->\n                            <!--<p> TWO & More </p>-->\n                            <!--<p>-->\n                                <!--:Number of Required Resources in ED-->\n                            <!--</p>-->\n                        <!--</div>-->\n                    <!--</div>-->\n                    <!--<div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid;\">-->\n                        <!--<p class=\"font-weight-bold\">علایم حیاتی  </p>-->\n                        <!--<p class=\"font-weight-bold\">:sign Vital </p>-->\n                    <!--</div>-->\n                    <!--<div class=\"col-12 d-flex justify-content-between\" style=\"flex-wrap: nowrap;\">-->\n                        <!--<div class=\"\">-->\n                            <!--<span>:فشارخون</span>-->\n                            <!--<span>  {{triazhInfo['item']['bp']}}   </span>-->\n                            <!--<span>BP <small>mmHg</small></span>-->\n                        <!--</div>-->\n                        <!--<div  class=\"\">-->\n                            <!--<span>تعداد ضربان</span>-->\n                            <!--<span>  {{triazhInfo['item']['pr']}}    </span>-->\n                            <!--<span>PR/min</span>-->\n                        <!--</div>-->\n                        <!--<div  class=\"\">-->\n                            <!--<span>:تنفس</span>-->\n                            <!--<span>  {{triazhInfo['item']['rr']}}   </span>-->\n                            <!--<span>RR/min</span>-->\n                        <!--</div>-->\n                        <!--<div class=\"\">-->\n                            <!--<span>:دمای بدن</span>-->\n                            <!--<span>  {{triazhInfo['item']['t']}}   </span>-->\n                            <!--<span>T</span>-->\n                        <!--</div>-->\n                        <!--<div  class=\"\">-->\n                            <!--<span>:درصد اشباع اکسیژن </span>-->\n                            <!--<span>  {{triazhInfo['item']['spo2']}}   </span>-->\n                            <!--<span>Spo2%</span>-->\n                        <!--</div>-->\n                    <!--</div>-->\n                <!--</div>-->\n            <!--</div>-->\n            <!--<div class=\"container\">-->\n                <!--<div class=\"col-12 mt-1 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">-->\n                    <!--<div class=\"\">-->\n                        <!--<p> بیماران سطح 4 و 5 </p>-->\n                    <!--</div>-->\n                    <!--<div class=\"p0\" ><span>..............................................................................................................................</span></div>-->\n                    <!--<div class=\"p0\">-->\n                        <!--<p>-->\n                            <!--Triage level 4&5-->\n                        <!--</p>-->\n                    <!--</div>-->\n                <!--</div>-->\n            <!--</div>-->\n            <!--<div class=\"container\">-->\n                <!--<div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;\">-->\n                    <!--<div class=\"col-12 d-flex \">-->\n                        <!--<div class=\"col-6 d-flex justify-content-between \">-->\n                            <!--<p> تعداد تسهیلات مورد نظر در بخش اورژانس </p>-->\n                            <!--<p>-->\n                                <!--یک مورد-->\n                                <!--<input *ngIf=\"triazhInfo['item']['serviceCountIS']==2\" type=\"checkbox\"  checked />-->\n\n                                <!--<input *ngIf=\"triazhInfo['item']['serviceCountIS'] !=2\" type=\"checkbox\"   />                     </p>-->\n                            <!--<p>One item</p>-->\n                        <!--</div>-->\n                        <!--<div class=\"col-6 d-flex justify-content-between \">-->\n                            <!--<p> هیچ</p>-->\n                            <!--<p>-->\n                                <!--None-->\n                                <!--<input *ngIf=\"triazhInfo['item']['serviceCountIS']==1\" type=\"checkbox\"  checked />-->\n\n                                <!--<input *ngIf=\"triazhInfo['item']['serviceCountIS'] !=1\" type=\"checkbox\"   />-->\n                            <!--</p>-->\n                            <!--<p>: ED in Resources Required of Number</p>-->\n                        <!--</div>-->\n                    <!--</div>-->\n\n                <!--</div>-->\n            <!--</div>-->\n            <!--<div class=\"container\" >-->\n                <!--<div class=\"row col-12 br mt-2 d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">-->\n                    <!--<div class=\"col-12 d-flex justify-content-between \">-->\n                        <!--<p> سطح تریاژ بیمار        </p>-->\n                        <!--<p>-->\n                            <!--5-->\n                            <!--<input *ngIf=\"triazhInfo['item']['triageLevelIS']==5\" type=\"checkbox\"  checked />-->\n\n                            <!--<input *ngIf=\"triazhInfo['item']['triageLevelIS'] !=5\" type=\"checkbox\"   />                     </p>-->\n                        <!--<p>-->\n                            <!--4-->\n                            <!--<input *ngIf=\"triazhInfo['item']['triageLevelIS']==4\" type=\"checkbox\"  checked />-->\n\n                            <!--<input *ngIf=\"triazhInfo['item']['triageLevelIS'] !=4\" type=\"checkbox\"   />-->\n                        <!--</p>-->\n                        <!--<p>-->\n                            <!--3-->\n                            <!--<input *ngIf=\"triazhInfo['item']['triageLevelIS']==3\" type=\"checkbox\"  checked />-->\n\n                            <!--<input *ngIf=\"triazhInfo['item']['triageLevelIS'] !=3\" type=\"checkbox\"   />-->\n                        <!--</p>-->\n                        <!--<p>-->\n                            <!--2-->\n                            <!--<input *ngIf=\"triazhInfo['item']['triageLevelIS']==2\" type=\"checkbox\"  checked />-->\n\n                            <!--<input *ngIf=\"triazhInfo['item']['triageLevelIS'] !=2\" type=\"checkbox\"   />-->\n                        <!--</p>-->\n                        <!--<p>-->\n                            <!--1-->\n                            <!--<input *ngIf=\"triazhInfo['item']['triageLevelIS']==1\" type=\"checkbox\"  checked />-->\n\n                            <!--<input *ngIf=\"triazhInfo['item']['triageLevelIS'] !=1\" type=\"checkbox\"   />-->\n                        <!--</p>-->\n                        <!--<p>-->\n                            <!--Patient Triage level:-->\n                        <!--</p>-->\n\n\n                    <!--</div>-->\n                    <!--<div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid;\">-->\n                        <!--<p class=\"font-weight-bold\">جداسازی بیمار و احتیاطات بیشتر کنترل عفونت   </p>-->\n                        <!--<p class=\"font-weight-bold\">تماسی-->\n                            <!--<input *ngIf=\"triazhInfo['item']['separationByInfection']==0\" type=\"checkbox\"  checked />-->\n\n                            <!--<input *ngIf=\"triazhInfo['item']['separationByInfection'] !=0\" type=\"checkbox\"   />                </p>-->\n                        <!--<p class=\"font-weight-bold\">قطره ای-->\n                            <!--<input *ngIf=\"triazhInfo['item']['separationByInfection']==1\" type=\"checkbox\"  checked />-->\n\n                            <!--<input *ngIf=\"triazhInfo['item']['separationByInfection'] !=1\" type=\"checkbox\"   />-->\n                        <!--</p>-->\n                        <!--<p class=\"font-weight-bold\">تنفسی-->\n                            <!--<input *ngIf=\"triazhInfo['item']['separationByInfection']==2\" type=\"checkbox\"  checked />-->\n\n                            <!--<input *ngIf=\"triazhInfo['item']['separationByInfection'] !=2\" type=\"checkbox\"   />-->\n                        <!--</p>-->\n                        <!--<p class=\"font-weight-bold\">نیاز ندارد-->\n                            <!--<input *ngIf=\"triazhInfo['item']['separationByInfection']==3\" type=\"checkbox\"  checked />-->\n\n                            <!--<input *ngIf=\"triazhInfo['item']['separationByInfection'] !=3\" type=\"checkbox\"   />-->\n                        <!--</p>-->\n                    <!--</div>-->\n\n                    <!--<div class=\"col-12 d-flex d-flex justify-content-between \">-->\n                        <!--<p class=\"font-weight-bold\">Patient Isolation and More Infection Control Precautions       </p>-->\n                        <!--<p class=\"font-weight-bold\">Contact-->\n                        <!--</p>-->\n                        <!--<p class=\"font-weight-bold\">Droplet-->\n                        <!--</p>-->\n                        <!--<p class=\"font-weight-bold\">Airborne-->\n                        <!--</p>-->\n                        <!--<p class=\"font-weight-bold\">No Need to Isolation-->\n                        <!--</p>-->\n                    <!--</div>-->\n                    <!--<div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid black;\">-->\n                        <!--<div>-->\n                            <!--<p class=\"font-weight-bold\">ارجاع به</p>-->\n                        <!--</div>-->\n                        <!--<div>-->\n                            <!--<label for=\"\">سرپایی</label>-->\n                            <!--<input *ngIf=\"triazhInfo['item']['departure']==3\" type=\"checkbox\"  checked />-->\n\n                            <!--<input *ngIf=\"triazhInfo['item']['departure'] !=3\" type=\"checkbox\"   />-->\n                            <!--<span>Fast track</span>-->\n                        <!--</div>-->\n                        <!--<div>-->\n                            <!--<label for=\"\">احیا</label>-->\n                            <!--<input *ngIf=\"triazhInfo['item']['departure']==4\" type=\"checkbox\"  checked />-->\n\n                            <!--<input *ngIf=\"triazhInfo['item']['departure'] !=4\" type=\"checkbox\"   />-->\n                            <!--<span> CPR</span>-->\n                        <!--</div>-->\n                        <!--<div>-->\n                            <!--<label for=\"\">فضای بستری</label>-->\n                            <!--<input *ngIf=\"triazhInfo['item']['departure']==1\" type=\"checkbox\"  checked />-->\n\n                            <!--<input *ngIf=\"triazhInfo['item']['departure'] !=1\" type=\"checkbox\"   />-->\n                            <!--<span>Inpatient Area </span>-->\n                        <!--</div>-->\n                        <!--<div>-->\n                            <!--<label for=\"\">سایر...</label>-->\n                            <!--<input *ngIf=\"triazhInfo['item']['departure']==8\" type=\"checkbox\"  checked />-->\n\n                            <!--<input *ngIf=\"triazhInfo['item']['departure'] !=8\" type=\"checkbox\"   />-->\n                            <!--<span>Other </span>-->\n                        <!--</div>-->\n\n                        <!--<div>-->\n                            <!--<p class=\"font-weight-bold\">  :Refer to </p>-->\n                        <!--</div>-->\n\n                    <!--</div>-->\n                    <!--<div class=\"col-12 d-flex justify-content-between\" style=\"border-top: 1px solid black;\">-->\n                        <!--<div class=\"col-6 d-flex\">-->\n                            <!--<p>ساعت و تاریخ ارجاع</p>-->\n                            <!--<span>-->\n                <!--{{triazhInfo['item']['referDate']}}-->\n            <!--</span>-->\n                        <!--</div>-->\n                        <!--<div class=\"col-6 d-flex\">-->\n                            <!--<p> نام و نام خانوتدگی مهر و امضای پرستار تریاژ  </p>-->\n                            <!--<span>.........</span>-->\n                        <!--</div>-->\n                    <!--</div>-->\n                    <!--<div class=\"col-12 d-flex justify-content-between\" >-->\n                        <!--<div class=\"col-6 d-flex\">-->\n                            <!--<p> Date & Time of Referral:  </p>-->\n                            <!--<span>{{triazhInfo['item']['referDate']}}</span>-->\n                        <!--</div>-->\n                        <!--<div class=\"col-6 d-flex\">-->\n                            <!--<p>  Triage Nurse’s Name/Signature/Stamp     </p>-->\n                            <!--<span>.........</span>-->\n                        <!--</div>-->\n                    <!--</div>-->\n                    <!--<div class=\"col-12 d-flex justify-content-between\" style=\"border-top: 1px solid black;\">-->\n                        <!--<p>توضیحات-->\n                            <!--<span>......</span>-->\n                        <!--</p>-->\n                        <!--<p>-->\n        <!--<span>-->\n            <!--.......-->\n        <!--</span>-->\n                            <!--Description-->\n\n                        <!--</p>-->\n                    <!--</div>-->\n                <!--</div>-->\n            <!--</div>-->\n            <!--<br>-->\n            <!--&lt;!&ndash; page2 &ndash;&gt;-->\n            <!--<div class=\"container\" style=\"margin-top: 50px;\">-->\n                <!--<div class=\"row col-12 br mt-2 d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">-->\n                    <!--<div class=\"col-12 d-flex justify-content-between\">-->\n                        <!--<p>-->\n                            <!--شرح حال و دستورات پزشک-->\n                        <!--</p>-->\n                        <!--<p>-->\n                            <!--:Medical history & Physician Orders-->\n                        <!--</p>-->\n                    <!--</div>-->\n                    <!--<div class=\"col-12\">-->\n                        <!--<br>-->\n                        <!--<br>-->\n                        <!--<br>-->\n                        <!--<br>-->\n                        <!--<br>-->\n                        <!--<p style=\"text-align: right;\">{{triazhInfo['item']['practitionerComment']}}</p>-->\n                    <!--</div>-->\n\n                    <!--<div class=\"col-12\">-->\n                        <!--<div class=\"d-flex justify-content-between roundBorder   \">-->\n                            <!--<p>تشخیص...</p>-->\n                            <!--<p>-->\n                                <!--Diagnosis....-->\n                            <!--</p>-->\n                        <!--</div>-->\n                    <!--</div>-->\n                    <!--<div class=\"col-12 d-flex justify-content-between\">-->\n                        <!--<div class=\"col-6 d-flex justify-content-between \">-->\n                            <!--<p>تاریخ و ساعت ویزیت </p>-->\n                            <!--<p> ........   </p>-->\n                            <!--<p>Date & Time Of Visit</p>-->\n\n                        <!--</div>-->\n                        <!--<div class=\"col-6 d-flex justify-content-between \" style=\"flex-wrap: nowrap;\">-->\n                            <!--<p style=\"font-size: 10px;\"> نام و نام خانوادگی مهر و امضای پزشک   </p>-->\n                            <!--<p> ...   </p>-->\n                            <!--<p style=\"font-size: 10px;\">Physician's Name/Signature/Stamp</p>-->\n                        <!--</div>-->\n\n                    <!--</div>-->\n                <!--</div>-->\n            <!--</div>-->\n            <!--<div class=\"container\">-->\n                <!--<div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">-->\n                    <!--<div class=\"col-12 d-flex justify-content-between\">-->\n                        <!--<p>-->\n                            <!--گزارش پرستاری:-->\n                        <!--</p>-->\n                        <!--<p>-->\n                            <!--:  Nursing Report-->\n                        <!--</p>-->\n                    <!--</div>-->\n\n                    <!--<div class=\"col-12\">-->\n                        <!--<br>-->\n                        <!--<br>-->\n                        <!--<br>-->\n                        <!--<br>-->\n                        <!--<br>-->\n                        <!--<p style=\"text-align: right;\">{{triazhInfo['item']['nurseComment']}} </p>-->\n                    <!--</div>-->\n                    <!--<div class=\"col-12 d-flex justify-content-between\">-->\n                        <!--<div class=\"col-6 d-flex justify-content-between \">-->\n                            <!--<p>تاریخ و ساعت گزارش </p>-->\n                            <!--<p> ........   </p>-->\n                            <!--<p> Report Date & Time:</p>-->\n\n                        <!--</div>-->\n                        <!--<div class=\"col-6 d-flex justify-content-between \" style=\"flex-wrap: nowrap;\">-->\n                            <!--<p style=\"font-size: 10px;\"> نام و نام خانوادگی مهر و امضای پرستار   </p>-->\n                            <!--<p> ...   </p>-->\n                            <!--<p style=\"font-size: 10px;\">Nurse's Name/Signature/Stamp</p>-->\n                        <!--</div>-->\n\n                    <!--</div>-->\n                <!--</div>-->\n            <!--</div>-->\n            <!--<div class=\"container\">-->\n                <!--<div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">-->\n                    <!--<div class=\"col-12  \" style=\"text-align: right;\">-->\n                        <!--<p>-->\n                            <!--وضعیت نهایی بیمار :-->\n                        <!--</p>-->\n\n                    <!--</div>-->\n                    <!--<div class=\"col-12 d-flex\" style=\"direction: rtl;text-align: right;\">-->\n                        <!--<div class=\"col-6\">-->\n                            <!--<p>بیمار در تاریخ<span>........</span> و ساعت <span>.......</span></p>-->\n                        <!--</div>-->\n                        <!--<div class=\"col-6\">-->\n                            <!--<div>-->\n                                <!--<input type=\"checkbox\" name=\"\" id=\"\">-->\n                                <!--<label for=\"\">مرخص گردید</label>-->\n\n                            <!--</div>-->\n\n                            <!--<div>-->\n                                <!--<input type=\"checkbox\" name=\"\" id=\"\">-->\n                                <!--<label for=\"\">در بخش .......... بستری گردید </label>-->\n                            <!--</div>-->\n                            <!--<div>-->\n                                <!--<input type=\"checkbox\" name=\"\" id=\"\">-->\n                                <!--<label for=\"\">به درمانگاه  .......... ارجاع شد </label>-->\n                            <!--</div>-->\n                            <!--<div>-->\n                                <!--<input type=\"checkbox\" name=\"\" id=\"\">-->\n                                <!--<label for=\"\">به بیمارستان  .......... اعزام گردید </label>-->\n                            <!--</div>-->\n\n                        <!--</div>-->\n                    <!--</div>-->\n\n\n\n                <!--</div>-->\n            <!--</div>-->\n            <!--<div class=\"container\">-->\n                <!--<div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">-->\n                    <!--<div class=\"col-12  \" style=\"text-align: center;\">-->\n                        <!--<p>-->\n                            <!--اجازه معالجه و عمل جراحی (بجز ویزیت)-->\n                        <!--</p>-->\n\n                    <!--</div>-->\n                    <!--<div class=\"col-12 \" style=\"direction: rtl;text-align: right;\">-->\n                        <!--<p>-->\n                            <!--اینجانب ............. بیمار/ساکن......... اجازه میدهم کزشک یا شزشان بیمارستان ...............-->\n                            <!--هرنوع معالجه و در صورت لزوم عمل جراحی یا انتقال خون که صلاح بداند در مورد اینجانب/بیمار اینجانب به مورد اجرا گذراند و بدینوسیله برایت پزشکان و-->\n                            <!--کارکنان این بیمارستان را از کلیه عوارض احتمالی اقدامات فوق که در مورد اینجانب/بیمار اینجانب انجام دهند اعلام میدارم.-->\n                        <!--</p>-->\n                    <!--</div>-->\n                    <!--<div class=\"col-12\" style=\"direction: rtl; text-align: right;\">-->\n                        <!--<p>-->\n                            <!--نام و امضای بیمار/همراه بیمار..........-->\n                        <!--</p>-->\n                    <!--</div>-->\n                    <!--<div class=\"col-12\" style=\"direction: rtl; text-align: right;\">-->\n                        <!--<p>-->\n                            <!--نام شاهد1............  تاریخ........ امضا.........-->\n                        <!--</p>-->\n                        <!--<p>-->\n                            <!--نام شاهد2............  تاریخ........ امضا.........-->\n                        <!--</p>-->\n\n                    <!--</div>-->\n                <!--</div>-->\n\n            <!--</div>-->\n            <!--<div class=\"container\">-->\n                <!--<div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">-->\n                    <!--<div class=\"col-12  \" style=\"text-align: center;\">-->\n                        <!--<p>-->\n                            <!--ترخیص با میل شخصی-->\n\n                        <!--</p>-->\n\n                    <!--</div>-->\n                    <!--<div class=\"col-12 \" style=\"direction: rtl;text-align: right;\">-->\n                        <!--<p>-->\n                            <!--اینجانب ............. با میل شخصی خود بر خلاف صلاحدید و توصیه پزشکان مسئول بیمارستان ............؛این مرکز را با در نظر داشتن عواقب-->\n                            <!--و خطرات احتمالی ترک می نمایم و اعلام میدارم که هیچ مسئولیتی متوجه مسئولان پزشکان و کارکنان این مرکز نخواهد بود.-->\n                        <!--</p>-->\n                    <!--</div>-->\n                    <!--<div class=\"col-12  d-flex justify-content-between \" style=\"direction: rtl; text-align: right;\">-->\n                        <!--<p>-->\n                            <!--نام و امضای بیمار/همراه بیمار..........-->\n                        <!--</p>-->\n                        <!--<p>-->\n                            <!--نام و امضای یکی از بستگان درجه اول بیمار...........-->\n                        <!--</p>-->\n                    <!--</div>-->\n                    <!--<div class=\"col-12\" style=\"direction: rtl; text-align: right;\">-->\n                        <!--<p>-->\n                            <!--نام شاهد1............  تاریخ........ امضا.........-->\n                        <!--</p>-->\n                        <!--<p>-->\n                            <!--نام شاهد2............  تاریخ........ امضا.........-->\n                        <!--</p>-->\n\n                    <!--</div>-->\n                <!--</div>-->\n\n            <!--</div>-->\n        <!--</div>-->\n\n\n    <!--</div>-->\n    <div class=\"container\" style=\"float: right;visibility: hidden;display: none\" id=\"print-section\" *ngIf=\"triazhInfo\">\n\n\n\n\n        <div class=\"col-12 text-center\">\n            <h4>وزارت بهداشت درمان و آموزش پزشکی</h4>\n            <h5>Ministry of Health & Medical Education</h5>\n        </div>\n        <div class=\"row \">\n            <div class=\"col-12 d-flex justify-content-around\">\n                <!--<div>-->\n                <!--&lt;!&ndash;<img style=\"width: 100px;height: auto;\" src=\"../../../assets/img/gallery/barcode.png\" alt=\"\">&ndash;&gt;-->\n                <!--&lt;!&ndash;<ngx-barcode [bc-value]=\"triazhInfo['item']['id']\" [bc-display-value]=\"true\"></ngx-barcode>&ndash;&gt;-->\n                <!--</div>-->\n                <h5>دانشگاه علوم پزشکی  </h5>\n                <h5><span *ngIf=\"hospital\">\n            {{hospital['universityName']}}\n        </span></h5>\n                <h5>:University of Medical Science </h5>\n            </div>\n\n        </div>\n        <div class=\"row \">\n            <div class=\"col-12  d-flex justify-content-around\">\n                <!--<div>-->\n                <!--<span>کد تریاژ</span>-->\n                <!--<span>{{triazhInfo['item']['id']}}</span>-->\n                <!--</div>-->\n                <h5><span *ngIf=\"hospital\">\n            {{hospital['hospitalName']}}\n        </span></h5>\n                <h5>:Medical Center</h5>\n            </div>\n        </div>\n        <div class=\"row \">\n            <div class=\"col-12  d-flex justify-content-around\">\n                <div class=\"col-3 \">\n                    <div class=\"br\" style=\"width:220px;height:50px; \">\n                        شماره پرونده\n                        <span>\n                            Record No:\n                        </span>\n                    </div>\n\n                </div>\n                <div class=\" col-6 text-center\">\n                    <h5>   فرم تریاژ بخش اورژانس بیمارستان </h5>\n                    <h6 class=\"text-bold-700\">HOSPITAL EMERGENCY DEPARTMENT TRIAGE FORM </h6>\n                </div>\n                <div class=\"col-3 text-left\" style=\"direction: ltr;\">\n                    <div style=\"width:220px;height:50px\" class=\"br text-right\">\n                <span class=\"text-right\">\n                    سطح تریاژ بیمار\n               </span>\n                        <span class=\"font-weight-bold\">\n                  {{triazhInfo['item']['triageLevelIS']}}\n               </span></div>\n                </div>\n            </div>\n        </div>\n        <div class=\"container\" >\n            <div class=\"row mt-1 col-12 br d-flex justify-content-around\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12 d-flex \">\n                    <div class=\"col-3 d-flex justify-content-between \" style=\"border-left: 1px solid black;\" >\n                        <p>نام خانوادگی</p>\n                        <p class=\"mt-4\">{{triazhInfo['item']['lastName']}}</p>\n                        <p>Family Name</p>\n                    </div>\n                    <div class=\"col-3 d-flex justify-content-between\" style=\"border-left: 1px solid black;\">\n                        <p>نام </p>\n                        <p class=\"mt-4\">\n                            {{triazhInfo['item']['firstName']}}\n                        </p>\n                        <p> Name</p>\n                    </div>\n                    <div class=\"col-3 d-flex justify-content-between \" style=\"border-left: 1px solid black;\">\n                        <div style=\"text-align: right;\">\n                            <p>جنس</p>\n                            <div>\n                                <label for=\"\">مذکر</label>\n                                <input *ngIf=\"triazhInfo['item']['gender']==0\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                                <input *ngIf=\"triazhInfo['item']['gender'] !=0\" type=\"checkbox\" ng-disabled=\"true\"  />\n                                <span>F</span>\n                                <input type=\"checkbox\" >\n                                <label for=\"\" style=\"margin-right: 30px;\">مونث</label>\n                                <input *ngIf=\"triazhInfo['item']['gender']==1\" type=\"checkbox\"  checked />\n\n                                <input *ngIf=\"triazhInfo['item']['gender'] !=1\" type=\"checkbox\"   />\n                                <span>M</span>\n                            </div>\n                        </div>\n\n                        <div>\n                            <p>Sex</p>\n                        </div>\n                    </div>\n                    <div class=\"col-3 \">\n                        <div class=\"d-flex justify-content-between\">\n                            <p>تاریخ مراجعه</p>\n                            <!--<p>-->\n                            <!--{{triazhInfo['item']['entranceTime']}}-->\n                            <!--</p>-->\n                            <p>Date of Arrival</p>\n                        </div>\n                        <div class=\"d-flex justify-content-between\">\n                            <p>ساعت مراجعه</p>\n                            <p>{{triazhInfo['item']['entranceTime']}}</p>\n                            <p>Time of Arrival</p>\n                        </div>\n                    </div>\n\n                </div>\n                <div class=\"col-12 d-flex justify-content-between \" style=\"border-top: 1px solid black;\">\n                    <div class=\"col-6 d-flex justify-content-between\">\n                        <div class=\"col-6 d-flex justify-content-between \" style=\"border-left: 1px solid black;\">\n                            <p>کد ملی </p>\n                            <p>\n                                {{triazhInfo['item']['nationalCode']}}\n                            </p>\n                            <p>National Code</p>\n                        </div>\n                        <div class=\"col-6 d-flex justify-content-between\" style=\"border-left: 1px solid black;\">\n                            <p>تاریخ تولد  </p>\n                            <p>\n                                {{triazhInfo['item']['birthDate']}}\n                            </p>\n                            <p>Date of Birth </p>\n                        </div>\n                    </div>\n                    <div class=\"col-6 d-flex justify-content-between\">\n                        <div>\n                            <p>باردار</p>\n                        </div>\n                        <div>\n                            <label for=\"\">بلی </label>\n                            <input *ngIf=\"triazhInfo['item']['pregnant']==1\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                            <input *ngIf=\"triazhInfo['item']['pregnant'] !=1\" type=\"checkbox\" ng-disabled=\"true\"  />                  <span>yes</span>\n                        </div>\n                        <div>\n                            <label for=\"\">خیر </label>\n                            <input *ngIf=\"triazhInfo['item']['pregnant']==0\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                            <input *ngIf=\"triazhInfo['item']['pregnant'] !=0\" type=\"checkbox\" ng-disabled=\"true\"  />                    <span>No</span>\n                        </div>\n                        <div>\n                            <label for=\"\">نامعلوم </label>\n                            <input *ngIf=\"triazhInfo['item']['pregnant']==2\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                            <input *ngIf=\"triazhInfo['item']['pregnant'] !=2\" type=\"checkbox\" ng-disabled=\"true\"  /><small>unknown</small>\n                        </div>\n                        <div>\n                            <p>Pregnant</p>\n                        </div>\n\n\n                    </div>\n\n                </div>\n\n\n\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-around\" style=\"direction: rtl;padding: 0;border-top: none\">\n                <div class=\"col-12 mt-1 d-flex justify-content-between\" style=\"text-align: right;\">\n                    <h6>نحوه مراجعه</h6>\n                    <h6>:Arrival Mode </h6>\n                </div>\n                <div class=\"col-12 mt-1 \" style=\"text-align: right;\">\n                    <span>آمبولانس 115</span>\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport']==2\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=2\" type=\"checkbox\" ng-disabled=\"true\"  />              <span>EMS </span>\n                    <span style=\"margin-right: 30px;\">آمبولانس خصوصی</span>\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport']==5\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=5\" type=\"checkbox\" ng-disabled=\"true\"  />              <span>Private Ambulance  </span>\n                    <span style=\"margin-right: 30px;\"> شخصی</span>\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport']==4\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=4\" type=\"checkbox\" ng-disabled=\"true\"  />               <span>By Her Own </span>\n                    <span style=\"margin-right: 30px;\">امداد هوایی </span>\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport']==6\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=6\" type=\"checkbox\" ng-disabled=\"true\"  />             <span>Air Ambulance   </span>\n                    <span style=\"margin-right: 30px;\"> سایر</span>\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport']==8\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                    <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=8\" type=\"checkbox\" ng-disabled=\"true\"  />             <span>Other   </span>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between \" style=\"text-align: right;border-top: 1px solid black;\">\n                    <div class=\"col-4 mt-1\">\n                        <p>مراجعه بیمار در 24 ساعت گذشته</p>\n                    </div>\n                    <div class=\"col-4 d-flex mt-1\" style=\"text-align: right;direction: rtl;padding: 0\">\n                        <div class=\"col-4\" >\n                            <span>همین بیمارستان</span>\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems']==0\" type=\"checkbox\"  checked />\n\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems'] !=0\" type=\"checkbox\"   />\n                        </div>\n                        <div class=\"col-4\" style=\"padding: 0\">\n                            <span>بیمارستان دیگر </span>\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems']==1\" type=\"checkbox\"  checked />\n\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems'] !=1\" type=\"checkbox\"   />\n                        </div>\n                        <div class=\"col-4\" style=\"padding: 0\">\n                            <span>خیر</span>\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems']==2\" type=\"checkbox\"  checked />\n\n                            <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems'] !=2\" type=\"checkbox\"   />                </div>\n                    </div>\n                    <div class=\"col-4 mt-1\" style=\"text-align: left \">\n                        <p>  :Patient Presence in ED in 24 Past Hours   </p>\n                    </div>\n\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\"  style=\"text-align: right\">\n                    <div class=\"col-4\" style=\"padding: 0\"></div>\n                    <div class=\"col-4 d-flex mt-1\">\n                        <div class=\"col-4\" style=\"padding: 0\">\n                            <span> This Hospital</span>\n                        </div>\n                        <div class=\"col-4\" style=\"padding: 0\">\n                    <span>\n                        Other Hospital\n                    </span>\n                        </div>\n                        <div class=\"col-4\" style=\"padding: 0\">\n                            <span>No</span>\n                        </div>\n\n                    </div>\n                    <div class=\"col-4\" style=\"padding: 0\"></div>\n                </div>\n\n            </div>\n        </div>\n        <div class=\"container\">\n\n            <div class=\"row col-12 br d-flex justify-content-around\" style=\"direction: rtl;\">\n\n                <div class=\"col-12  d-flex justify-content-between \" style=\"text-align: right;\">\n                    <div class=\"d-flex\">\n                        <h5 class=\"font-weight-bold\"> شکایت  اصلی بیمار :</h5>\n                        <span *ngIf=\"triazhInfo['item']['triage_MainDisease']\">\n                    <span *ngFor=\"let i of triazhInfo['item']['triage_MainDisease'] \">\n                        <span *ngFor=\"let a of mainDiseaseArray\">\n                            <span class=\"font-weight-bold\" *ngIf=\"i.mainDiseaseID==a.id\">{{a.mainDiseaseValue}}</span>\n                        </span>\n                </span>\n\n                    <span *ngIf=\"triazhInfo['item']['triageOtherCasesMainDisease']\">\n                        <span class=\"font-weight-bold\"  *ngFor=\"let i of triazhInfo['item']['triageOtherCasesMainDisease'] \">\n                            {{i.description}}\n                        </span>\n                    </span>\n                </span>\n\n                    </div>\n                    <div>\n                <span>Chief Complaint\n                </span>\n                    </div>\n                </div>\n                <div class=\"col-12  \" style=\"text-align: right;flex-wrap: nowrap;\">\n                    <div class=\"d-flex justify-content-between\" style=\"padding: 0\" >\n                        <div class=\"col-2\" style=\"padding: 0;\" >\n                            <p class=\"font-weight-bold\" > <span>سابقه حساسیت دارویی و غذایی: </span>     </p>\n                        </div>\n                        <div class=\"col-6 \" style=\"padding: 0\" *ngIf=\"triazhInfo['item']['triageAllergyDrugs'][0]!=null || triazhInfo['item']['triageFoodSensitivity'][0]!=null\">\n\n                            <div class=\"d-flex\">\n                                <div class=\"\" style=\"padding: 0\" *ngFor=\"let i of aleryDrugFinaly\">\n                                    <span>{{i}},</span>\n\n                                </div>\n                            </div>\n                            <div class=\"col-12 \" style=\"padding: 0\">\n                                <div class=\"d-flex\" style=\"padding: 0\" *ngIf=\"triazhInfo['item']['triageFoodSensitivity']\">\n                                    <div class=\"d-flex\" *ngFor=\"let a of triazhInfo['item']['triageFoodSensitivity'] \">\n                                        <div  class=\"\" *ngFor=\"let i of foodLIst\"  style=\"text-align: right;margin-right: 5px;\">\n                                            <span  *ngIf=\"a.foodSensitivityValue==i.Key\">{{i.Value}}</span>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"col-2 \"  style=\"padding:0;text-align: left;direction: ltr \">\n                            <p style=\"font-size: 12px\" >History of Drug and Food Allergy</p>\n                        </div>\n                    </div>\n\n                </div>\n            </div>\n        </div>\n\n\n\n        <div class=\"container\">\n            <div class=\"col-12 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">\n                <div >\n                    <p> بیماران سطح 1 (شرایط تهدید کننده حیات )</p>\n                </div>\n                <div class=\"\" >\n                    <span>..............................................</span>\n                </div>\n                <div >\n\n                    <p>\n                        Triage level 1 (Life threatening situation)\n                    </p>\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12 d-flex justify-content-between\">\n                    <div>\n                <span>\n                    سطح هوشیاری بیمار:\n\n                </span>\n                    </div>\n                    <div  style=\"text-align: right;direction: rtl;\">\n                <span >\n                    بدون پاسخ\n                </span>\n                        <input *ngIf=\"triazhInfo['item']['stateOfAlertIS']==4\" type=\"checkbox\"  checked />\n\n                        <input *ngIf=\"triazhInfo['item']['stateOfAlertIS'] !=4\" type=\"checkbox\"   />              </div>\n                    <div>\n                <span>\n                    پاسخ به محرک دردناک\n               </span>\n                        <input *ngIf=\"triazhInfo['item']['stateOfAlertIS']==3\" type=\"checkbox\"  checked />\n\n                        <input *ngIf=\"triazhInfo['item']['stateOfAlertIS'] !=3\" type=\"checkbox\"   />               </div>\n                    <div>\n                <span>\n                    پاسخ به محرک کلامی\n                </span>\n                        <input *ngIf=\"triazhInfo['item']['stateOfAlertIS']==2\" type=\"checkbox\"  checked />\n\n                        <input *ngIf=\"triazhInfo['item']['stateOfAlertIS'] !=2\" type=\"checkbox\"   />               </div>\n                    <div>\n                <span>\n                    هوشیار\n               </span>\n                        <input *ngIf=\"triazhInfo['item']['stateOfAlertIS']==1\" type=\"checkbox\"  checked />\n\n                        <input *ngIf=\"triazhInfo['item']['stateOfAlertIS'] !=1\" type=\"checkbox\"   />\n                    </div>\n\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\">\n                    <div>\n                <span>\n                    سیستم:(AVPU)\n                </span>\n\n                    </div>\n                    <div>\n                <span>\n                    Unresponsive (U)\n                 </span>\n                    </div>\n                    <div>\n                <span>\n                    Response to Pain Stimulus(P)\n                 </span>\n                    </div>\n                    <div>\n                <span>\n                    Response to Verbal Stimulus(V)\n                 </span>\n                    </div>\n                    <div>\n                <span>\n                    Alert (A)\n\n                 </span>\n                    </div>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\" style=\"border-top: 1px solid black;\">\n                    <div style=\"border-left: 1px solid black;text-align: right;\">\n                        <label for=\"\">مخاطره راه هوایی</label>\n                        <input *ngIf=\"triazhInfo['item']['dangerousRespire']==='True'\" type=\"checkbox\"  checked />\n\n                        <input *ngIf=\"triazhInfo['item']['dangerousRespire'] !='False'\" type=\"checkbox\"   />\n                        <p>\n                            Airway compromise\n                        </p>\n                    </div>\n                    <div style=\"border-left: 1px solid black;text-align: right;\">\n                        <label for=\"\"> دیسترس شدید تنفسی </label>\n                        <input *ngIf=\"triazhInfo['item']['respireDistress']==='True'\" type=\"checkbox\"  checked />\n\n                        <input *ngIf=\"triazhInfo['item']['respireDistress'] !='False'\" type=\"checkbox\"   />                <p>\n                        Sever Respiratory Distress\n                    </p>\n                    </div>\n                    <div style=\"border-left: 1px solid black;text-align: right;\">\n                        <label for=\"\">  سیانوز</label>\n                        <input *ngIf=\"triazhInfo['item']['sianosis']==='True'\" type=\"checkbox\"  checked />\n\n                        <input *ngIf=\"triazhInfo['item']['sianosis'] !='False'\" type=\"checkbox\"   />                   <p>\n                        Cyanosis\n                    </p>\n                    </div>\n                    <div style=\"border-left: 1px solid black;text-align: right;\">\n                        <label for=\"\">  علایم شوک</label>\n                        <input *ngIf=\"triazhInfo['item']['shock']==='True'\" type=\"checkbox\"  checked />\n\n                        <input *ngIf=\"triazhInfo['item']['shock'] !='False'\" type=\"checkbox\"   />\n                        <p>\n                            Signs of Shock\n                        </p>\n                    </div>\n                    <div>\n                        <label for=\"\"> اشباع اکسیژن کمتر از 90 درصد </label>\n                        <input *ngIf=\"triazhInfo['item']['spo2LowerThan90']==='True'\" type=\"checkbox\"  checked />\n\n                        <input *ngIf=\"triazhInfo['item']['spo2LowerThan90'] !='False'\" type=\"checkbox\"   />\n                        <p>\n                            SpO2 < 90\n                        </p>\n                    </div>\n\n                </div>\n\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"col-12 mt-1 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">\n                <div class=\"\">\n                    <p> بیماران سطح 2 </p>\n                </div>\n                <div class=\"p0\" ><span>..............................................................................................................................</span></div>\n                <div class=\"p0\">\n                    <p>\n                        Triage level 2\n                    </p>\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n\n                <div class=\"col-12 d-flex justify-content-between\" >\n                    <div class=\"col-3 text-center\" style=\"border-left: 1px solid black;\">\n                        <label for=\"\">شرایط پر خطر   </label>\n                        <input *ngIf=\"triazhInfo['item']['highDanger']==='True'\" type=\"checkbox\"  checked />\n\n                        <input *ngIf=\"triazhInfo['item']['highDanger'] =='False'\" type=\"checkbox\"   />                <p>\n                        High Risk Conditions\n                    </p>\n                    </div>\n                    <div class=\"col-4 text-center\" style=\"border-left: 1px solid black;\">\n                        <label for=\"\">\n                            لتارژی خواب آلودگی اختلال جهت یابی\n\n                        </label>\n                        <input *ngIf=\"triazhInfo['item']['lethargy']==='True'\" type=\"checkbox\"  checked />\n\n                        <input *ngIf=\"triazhInfo['item']['lethargy'] =='False'\" type=\"checkbox\"   />\n                        <p>\n\n                            lethargy/ confusion/ disorientation\n                        </p>\n                    </div>\n                    <div class=\"col-3 text-center\" style=\"border-left: 1px solid black;\">\n                        <label for=\"\">  دیسترس شدید روان </label>\n                        <input *ngIf=\"triazhInfo['item']['highDistress']==='True'\" type=\"checkbox\"  checked />\n\n                        <input *ngIf=\"triazhInfo['item']['highDistress'] =='False'\" type=\"checkbox\"   />\n                        <p>\n                            Sever psychiatric Distress\n                        </p>\n                    </div>\n                    <div class=\"d-flex col-2 justify-content-between\">\n                        <div style=\"margin-top: 10px\">\n                            <span for=\"\">   درد شدید</span>\n                            <p>\n                                Sever Pain\n\n                            </p>\n                        </div>\n                        <div  style=\"margin-top: 10px;position: relative;margin-left: 10px\" >\n                            <div style=\"padding: 0\">   {{painPrint}}</div>\n                            <div class=\"text-bold-700\" style=\"border-bottom: 1px solid;position: static \"></div>\n                            <div style=\"position: static\" >10</div>\n                        </div>\n\n\n\n\n\n                    </div>\n                </div>\n                <div class=\"col-12 d-flex \" style=\"border-top: 1px solid;\">\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p>سابقه پزشکی </p>\n                        <span>\n                    {{triazhInfo['item']['medicalHistory']}}\n\n                </span>\n                        <p>\n                            Medical history\n                        </p>\n                    </div>\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p>سابقه دارویی </p>\n                        <span>\n                    {{triazhInfo['item']['drugHistory']}}\n\n                </span>\n                        <p>\n                            Drug history\n                        </p>\n                    </div>\n                </div>\n                <div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid;\" >\n                    <p class=\"font-weight-bold\">علایم حیاتی  </p>\n                    <p class=\"font-weight-bold\">:sign Vital </p>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\" style=\"flex-wrap: nowrap;\">\n                    <div class=\"\">\n                        <span> فشارخون  :</span>\n                        <span>\n                         {{bpPrint}}\n                </span>\n                        <span>BP <small>mmHg</small></span>\n                    </div>\n                    <div  class=\"\">\n                        <span> تعداد ضربان </span>\n                        <span>   {{prPrint}} </span>\n                        <span>PR/min</span>\n                    </div>\n                    <div  class=\"\">\n                        <span>تنفس </span>\n                        <span>   {{rrPrint}}    </span>\n                        <span>RR/min</span>\n                    </div>\n                    <div class=\"\">\n                        <span>دمای بدن </span>\n                        <span>  {{tPrint}}   </span>\n                        <span>T</span>\n                    </div>\n                    <div  class=\"\">\n                        <span>درصد اشباع اکسیژن  </span>\n                        <span>  {{spo2Print}}   </span>\n                        <span>Spo2%</span>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"col-12\" style=\"padding-top: 0;padding-bottom: 0;direction: rtl;text-align: right;\">\n                <p style=\"padding: 0\"> *ثبت عاليم حیاتي برای بیماران سطح 2 با تشخیص پرستار ترياژ و به شرط عدم تاخیر در رسیدگي به بیماران با شرايط پر خطر</p>\n            </div>\n            <div class=\"col-12 mt-1 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">\n                <div class=\"\">\n                    <p> بیماران سطح 3 </p>\n                </div>\n                <div class=\"p0\" ><span>..............................................................................................................................</span></div>\n                <div class=\"p0\">\n                    <p>\n                        Triage level 3\n                    </p>\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12 d-flex \">\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p> تعداد تسهیلات مورد نظر در بخش اورژانس </p>\n                        <p>\n                            دو مورد بیشتر\n                            <input *ngIf=\"triazhInfo['item']['serviceCountIS']==3\" type=\"checkbox\"  checked />\n\n                            <input *ngIf=\"triazhInfo['item']['serviceCountIS'] !=3\" type=\"checkbox\"   />\n                        </p>\n                    </div>\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p> TWO & More </p>\n                        <p>\n                            :Number of Required Resources in ED\n                        </p>\n                    </div>\n                </div>\n                <div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid;\">\n                    <p class=\"font-weight-bold\">علایم حیاتی  </p>\n                    <p class=\"font-weight-bold\">:sign Vital </p>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\" style=\"flex-wrap: nowrap;\">\n                    <div class=\"\">\n                        <span>:فشارخون</span>\n                        <span>  {{bpPrint}}   </span>\n                        <span>BP <small>mmHg</small></span>\n                    </div>\n                    <div  class=\"\">\n                        <span>تعداد ضربان</span>\n                        <span>  {{prPrint}}    </span>\n                        <span>PR/min</span>\n                    </div>\n                    <div  class=\"\">\n                        <span>:تنفس</span>\n                        <span>  {{rrPrint}}   </span>\n                        <span>RR/min</span>\n                    </div>\n                    <div class=\"\">\n                        <span>:دمای بدن</span>\n                        <span>  {{tPrint}}   </span>\n                        <span>T</span>\n                    </div>\n                    <div  class=\"\">\n                        <span>:درصد اشباع اکسیژن </span>\n                        <span>  {{spo2Print}}   </span>\n                        <span>Spo2%</span>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"col-12 mt-1 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">\n                <div class=\"\">\n                    <p> بیماران سطح 4 و 5 </p>\n                </div>\n                <div class=\"p0\" ><span>..............................................................................................................................</span></div>\n                <div class=\"p0\">\n                    <p>\n                        Triage level 4&5\n                    </p>\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;\">\n                <div class=\"col-12 d-flex \">\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p> تعداد تسهیلات مورد نظر در بخش اورژانس </p>\n                        <p>\n                            یک مورد\n                            <input *ngIf=\"triazhInfo['item']['serviceCountIS']==2\" type=\"checkbox\"  checked />\n\n                            <input *ngIf=\"triazhInfo['item']['serviceCountIS'] !=2\" type=\"checkbox\"   />                     </p>\n                        <p>One item</p>\n                    </div>\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p> هیچ</p>\n                        <p>\n                            None\n                            <input *ngIf=\"triazhInfo['item']['serviceCountIS']==1\" type=\"checkbox\"  checked />\n\n                            <input *ngIf=\"triazhInfo['item']['serviceCountIS'] !=1\" type=\"checkbox\"   />\n                        </p>\n                        <p>: ED in Resources Required of Number</p>\n                    </div>\n                </div>\n\n            </div>\n        </div>\n        <div class=\"container\" >\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12 d-flex justify-content-between \">\n                    <p> سطح تریاژ بیمار        </p>\n                    <p>\n                        5\n                        <input *ngIf=\"triazhInfo['item']['triageLevelIS']==5\" type=\"checkbox\"  checked />\n\n                        <input *ngIf=\"triazhInfo['item']['triageLevelIS'] !=5\" type=\"checkbox\"   />                     </p>\n                    <p>\n                        4\n                        <input *ngIf=\"triazhInfo['item']['triageLevelIS']==4\" type=\"checkbox\"  checked />\n\n                        <input *ngIf=\"triazhInfo['item']['triageLevelIS'] !=4\" type=\"checkbox\"   />\n                    </p>\n                    <p>\n                        3\n                        <input *ngIf=\"triazhInfo['item']['triageLevelIS']==3\" type=\"checkbox\"  checked />\n\n                        <input *ngIf=\"triazhInfo['item']['triageLevelIS'] !=3\" type=\"checkbox\"   />\n                    </p>\n                    <p>\n                        2\n                        <input *ngIf=\"triazhInfo['item']['triageLevelIS']==2\" type=\"checkbox\"  checked />\n\n                        <input *ngIf=\"triazhInfo['item']['triageLevelIS'] !=2\" type=\"checkbox\"   />\n                    </p>\n                    <p>\n                        1\n                        <input *ngIf=\"triazhInfo['item']['triageLevelIS']==1\" type=\"checkbox\"  checked />\n\n                        <input *ngIf=\"triazhInfo['item']['triageLevelIS'] !=1\" type=\"checkbox\"   />\n                    </p>\n                    <p>\n                        Patient Triage level:\n                    </p>\n\n\n                </div>\n                <div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid;\">\n                    <p class=\"font-weight-bold\">جداسازی بیمار و احتیاطات بیشتر کنترل عفونت   </p>\n                    <p class=\"font-weight-bold\">تماسی\n                        <input *ngIf=\"triazhInfo['item']['separationByInfection']==0\" type=\"checkbox\"  checked />\n\n                        <input *ngIf=\"triazhInfo['item']['separationByInfection'] !=0\" type=\"checkbox\"   />                </p>\n                    <p class=\"font-weight-bold\">قطره ای\n                        <input *ngIf=\"triazhInfo['item']['separationByInfection']==1\" type=\"checkbox\"  checked />\n\n                        <input *ngIf=\"triazhInfo['item']['separationByInfection'] !=1\" type=\"checkbox\"   />\n                    </p>\n                    <p class=\"font-weight-bold\">تنفسی\n                        <input *ngIf=\"triazhInfo['item']['separationByInfection']==2\" type=\"checkbox\"  checked />\n\n                        <input *ngIf=\"triazhInfo['item']['separationByInfection'] !=2\" type=\"checkbox\"   />\n                    </p>\n                    <p class=\"font-weight-bold\">نیاز ندارد\n                        <input *ngIf=\"triazhInfo['item']['separationByInfection']==3\" type=\"checkbox\"  checked />\n\n                        <input *ngIf=\"triazhInfo['item']['separationByInfection'] !=3\" type=\"checkbox\"   />\n                    </p>\n                </div>\n\n                <div class=\"col-12 d-flex d-flex justify-content-between \">\n                    <p class=\"font-weight-bold\">Patient Isolation and More Infection Control Precautions       </p>\n                    <p class=\"font-weight-bold\">Contact\n                    </p>\n                    <p class=\"font-weight-bold\">Droplet\n                    </p>\n                    <p class=\"font-weight-bold\">Airborne\n                    </p>\n                    <p class=\"font-weight-bold\">No Need to Isolation\n                    </p>\n                </div>\n                <div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid black;\">\n                    <div>\n                        <p class=\"font-weight-bold\">ارجاع به</p>\n                    </div>\n                    <div>\n                        <label for=\"\">سرپایی</label>\n                        <input *ngIf=\"triazhInfo['item']['departure']==3\" type=\"checkbox\"  checked />\n\n                        <input *ngIf=\"triazhInfo['item']['departure'] !=3\" type=\"checkbox\"   />\n                        <span>Fast track</span>\n                    </div>\n                    <div>\n                        <label for=\"\">احیا</label>\n                        <input *ngIf=\"triazhInfo['item']['departure']==4\" type=\"checkbox\"  checked />\n\n                        <input *ngIf=\"triazhInfo['item']['departure'] !=4\" type=\"checkbox\"   />\n                        <span> CPR</span>\n                    </div>\n                    <div>\n                        <label for=\"\">فضای بستری</label>\n                        <input *ngIf=\"triazhInfo['item']['departure']==1\" type=\"checkbox\"  checked />\n\n                        <input *ngIf=\"triazhInfo['item']['departure'] !=1\" type=\"checkbox\"   />\n                        <span>Inpatient Area </span>\n                    </div>\n                    <div>\n                        <label for=\"\">سایر...</label>\n                        <input *ngIf=\"triazhInfo['item']['departure']==8\" type=\"checkbox\"  checked />\n\n                        <input *ngIf=\"triazhInfo['item']['departure'] !=8\" type=\"checkbox\"   />\n                        <span>Other </span>\n                    </div>\n\n                    <div>\n                        <p class=\"font-weight-bold\">  :Refer to </p>\n                    </div>\n\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\" style=\"border-top: 1px solid black;\">\n                    <div class=\"col-6 d-flex\">\n                        <p>ساعت و تاریخ ارجاع</p>\n                        <span>\n                {{triazhInfo['item']['exitTime']}}\n            </span>\n                    </div>\n                    <div class=\"col-6 d-flex\">\n                        <p> نام و نام خانوادگی مهر و امضای پرستار تریاژ  </p>\n                        <span *ngIf=\"pracInfo['item']\">{{pracInfo['item']['firstName']}}</span> <span class=\"mx-1\" *ngIf=\"pracInfo['item']\">{{pracInfo['item']['lastName']}}</span>\n                    </div>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\" >\n                    <div class=\"col-6 d-flex\">\n                        <p> Date & Time of Referral:  </p>\n                        <span></span>\n                    </div>\n                    <div class=\"col-6 d-flex\">\n                        <p>  Triage Nurse’s Name/Signature/Stamp     </p>\n                        <span>.........</span>\n                    </div>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\" style=\"border-top: 1px solid black;\">\n                    <p>توضیحات\n                        <span>......</span>\n                    </p>\n                    <p>\n        <span>\n            .......\n        </span>\n                        Description\n\n                    </p>\n                </div>\n            </div>\n            <div class=\"col-12 d-flex justify-content-between\" >\n                <p>این صفحه فرم صرفا توسط پرستار ترياژ تكمیل مي گردد</p>\n\n                <p>IR.MOHHIM-E01-2.0-9910</p>\n\n\n\n            </div>\n        </div>\n        <br>\n        <!-- page2 -->\n        <div class=\"container\" style=\"margin-top: 50px;\">\n            <div class=\"row col-12 br mt-2 d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12 d-flex justify-content-between\">\n                    <p>\n                        شرح حال و دستورات پزشک\n                    </p>\n                    <p>\n                        :Medical history & Physician Orders\n                    </p>\n                </div>\n                <div class=\"col-12\">\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <p style=\"text-align: right;\">{{triazhInfo['item']['practitionerComment']}}</p>\n                </div>\n\n                <div class=\"col-12\">\n                    <div class=\"d-flex justify-content-between roundBorder   \">\n                        <p>تشخیص...</p>\n                        <p>\n                            ....Diagnosis\n                        </p>\n                    </div>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\">\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p>تاریخ و ساعت ویزیت </p>\n                        <p> ........   </p>\n                        <p>Date & Time Of Visit</p>\n\n                    </div>\n                    <div class=\"col-6 d-flex justify-content-between \" style=\"flex-wrap: nowrap;\">\n                        <p style=\"font-size: 10px;\"> نام و نام خانوادگی مهر و امضای پزشک   </p>\n                        <p> ...   </p>\n                        <p style=\"font-size: 10px;\">Physician's Name/Signature/Stamp</p>\n                    </div>\n\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12 d-flex justify-content-between\">\n                    <p>\n                        گزارش پرستاری:\n                    </p>\n                    <p>\n                        :  Nursing Report\n                    </p>\n                </div>\n\n                <div class=\"col-12\" style=\"text-align: right; direction: rtl;\">\n                    <p>\n                        بیمار با نام {{name}}  و نام خانوادگی {{lastName}} با سطح تریاژیک    و با وسیله    {{transporterValue}}وبا شکایت اصلی    <span *ngFor=\"let i of mainVAlueArray\">{{i}},</span>,<span *ngFor=\"let a of eOtherCasesMainDisease\">{{a.description}}</span>           <span *ngIf=\"aleryDrugFinaly.length>0\" > و حساسیت دارویی</span> <span *ngFor=\"let i of aleryDrugFinaly\">{{i}}</span> <span *ngIf=\"foodAllerguValue.length>0\">و حساسیت غذایی</span>   <span *ngFor=\"let i of foodAllerguValue\">{{i}},</span>  و در ساعت {{Time}}\n                        به اوراژانس منتقل شد.\n                    </p>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                    <br>\n                </div>\n                <div class=\"col-12 d-flex justify-content-between\">\n                    <div class=\"col-6 d-flex justify-content-between \">\n                        <p>تاریخ و ساعت گزارش </p>\n                        <p> ........   </p>\n                        <p> Report Date & Time:</p>\n\n                    </div>\n                    <div class=\"col-6 d-flex justify-content-between \" style=\"flex-wrap: nowrap;\">\n                        <p style=\"font-size: 10px;\"> نام و نام خانوادگی مهر و امضای پرستار   </p>\n                        <p *ngIf=\"pracInfo['item']\">{{pracInfo['item']['firstName']}}  {{pracInfo['item']['lastName']}}    </p>\n\n                        <p style=\"font-size: 10px;\">Nurse's Name/Signature/Stamp</p>\n                    </div>\n\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12  \" style=\"text-align: right;\">\n                    <p>\n                        وضعیت نهایی بیمار :\n                    </p>\n\n                </div>\n                <div class=\"col-12 d-flex\" style=\"direction: rtl;text-align: right;\">\n                    <div class=\"col-6\">\n                        <p>بیمار در تاریخ<span>........</span> و ساعت <span>.......</span></p>\n                    </div>\n                    <div class=\"col-6\">\n                        <div>\n                            <input type=\"checkbox\" name=\"\" id=\"\">\n                            <label for=\"\">مرخص گردید</label>\n\n                        </div>\n\n                        <div>\n                            <input type=\"checkbox\" name=\"\" id=\"\">\n                            <label for=\"\">در بخش .......... بستری گردید </label>\n                        </div>\n                        <div>\n                            <input type=\"checkbox\" name=\"\" id=\"\">\n                            <label for=\"\">به درمانگاه  .......... ارجاع شد </label>\n                        </div>\n                        <div>\n                            <input type=\"checkbox\" name=\"\" id=\"\">\n                            <label for=\"\">به بیمارستان  .......... اعزام گردید </label>\n                        </div>\n\n                    </div>\n                </div>\n\n\n\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12  \" style=\"text-align: center;\">\n                    <p>\n                        اجازه معالجه و عمل جراحی (بجز ویزیت)\n                    </p>\n\n                </div>\n                <div class=\"col-12 \" style=\"direction: rtl;text-align: right;\">\n                    <p>\n                        اینجانب ................... بیمار/ساکن.................. اجازه میدهم پزشک یا پزشکان بیمارستان .....................\n                        هرنوع معالجه و در صورت لزوم عمل جراحی یا انتقال خون که صلاح بداند در مورد اینجانب/بیمار اینجانب به مورد اجرا گذراند و بدینوسیله برایت پزشکان و\n                        کارکنان این بیمارستان را از کلیه عوارض احتمالی اقدامات فوق که در مورد اینجانب/بیمار اینجانب انجام دهند اعلام میدارم.\n                    </p>\n                </div>\n                <div class=\"col-12\" style=\"direction: rtl; text-align: right;\">\n                    <p>\n                        نام و امضای بیمار/همراه بیمار..........\n                    </p>\n                </div>\n                <div class=\"col-12\" style=\"direction: rtl; text-align: right;\">\n                    <p>\n                        نام شاهد1............  تاریخ........ امضا.........\n                    </p>\n                    <p>\n                        نام شاهد2............  تاریخ........ امضا.........\n                    </p>\n\n                </div>\n            </div>\n\n        </div>\n        <div class=\"container\">\n            <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n                <div class=\"col-12  \" style=\"text-align: center;\">\n                    <p>\n                        ترخیص با میل شخصی\n                    </p>\n\n                </div>\n                <div class=\"col-12 \" style=\"direction: rtl;text-align: right;\">\n                    <p>\n                        اینجانب ............. با میل شخصی خود بر خلاف صلاحدید و توصیه پزشکان مسئول بیمارستان ............؛این مرکز را با در نظر داشتن عواقب\n                        و خطرات احتمالی ترک می نمایم و اعلام میدارم که هیچ مسئولیتی متوجه مسئولان پزشکان و کارکنان این مرکز نخواهد بود.\n                    </p>\n                </div>\n                <div class=\"col-12  d-flex justify-content-between \" style=\"direction: rtl; text-align: right;\">\n                    <p>\n                        نام و امضای بیمار/همراه بیمار..........\n                    </p>\n                    <p>\n                        نام و امضای یکی از بستگان درجه اول بیمار...........\n                    </p>\n                </div>\n                <div class=\"col-12\" style=\"direction: rtl; text-align: right;\">\n                    <p>\n                        نام شاهد1............  تاریخ........ امضا.........\n                    </p>\n                    <p>\n                        نام شاهد2............  تاریخ........ امضا.........\n                    </p>\n\n                </div>\n            </div>\n\n        </div>\n    </div>\n\n\n\n</form>\n\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/teriazh/patient-list/patient-list.component.html":
/*!********************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/teriazh/patient-list/patient-list.component.html ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<style>\n    /*table th {*/\n        /*background-color: #48d9fa;*/\n\n    /*}*/\n    table{\n        text-align: center;\n    }\n    .br{\n       border:  2px solid black;\n    }\n    .p0{\n        padding: 0 !important\n    }\n    .br div{\n        padding: 0;\n    }\n    p,span,label,h4,h3,h5{\n        font-weight: bold;\n    }\n    .roundBorder{\n        border: 2px solid gray;\n        border-radius: 10px;\n    }\n\n    .red{\n        color: white;!important;\n        background-color: #990000;\n        background-image: linear-gradient(147deg, #990000 0%, #ff0000 74%);\n    }\n    .Orange{\n        background-color: #f5d020;\n        background-image: linear-gradient(315deg, #f5d020 0%, #f53803 74%);\n        color: white;!important;\n    }\n    .Yellow{\n        background-color: #fbb034;\n        background-image: linear-gradient(315deg, #fbb034 0%, #ffdd00 74%);\n    }\n    .green{\n        background-color: #d3d3d3;\n        background-image: linear-gradient(315deg, #d3d3d3 0%, #2bc96d 74%);\n\n        color: white;!important;\n    }\n    .blue{\n        background-color: #06bcfb;\n        background-image: linear-gradient(315deg, #06bcfb 0%, #4884ee 74%);\n        color: white;!important;\n    }\n\n</style>\n<div class=\"container-fluid\">\n   \n    <div *ngIf=\"List\">\n        <table *ngIf=\"List.length>0\"  class=\"table table-bordered table-hover\" style=\"font-size: 15px\">\n            <thead style=\"background-color: #63a4ff;\nbackground-image: linear-gradient(315deg, #63a4ff 0%, #83eaf1 74%);\" >\n            <tr>\n                <th scope=\"col\" >ردیف</th>\n                <th scope=\"col\">کد تریاژ</th>\n                <th scope=\"col\">نام و نام خانوادگی بیمار </th>\n                <th scope=\"col\">تاریخ تراژ </th>\n                <th scope=\"col\">وضعیت تریاژ </th>\n                <th scope=\"col\">تاریخ تولد </th>\n                <th scope=\"col\">سطح تریاژ </th>\n                <th scope=\"col\">نحوه مراجعه</th>\n                <th scope=\"col\">تریاژ کننده</th>\n                <th scope=\"col\">نحوه خروج</th>\n                <th scope=\"col\">تاریخ پایان تریاژ </th>\n                <th scope=\"col\"> شتاسه مراجعه متصل </th>\n            </tr>\n            </thead>\n            <tbody style=\"font-family: iransans\" *ngFor=\"let i of List;let y=index \" >\n            <tr (dblclick)=\"selectPatient(i.id)\" style=\"cursor: pointer\">\n                <td scope=\"row\">{{y+1}}</td>\n                <td>{{i.id}}</td>\n                <td> {{i.firstName}} {{i.lastName}} </td>\n                <td>{{i.entranceTime}}</td>\n                <td><span *ngIf=\"i.exitTime==null\">باز</span>\n                    <span *ngIf=\"i.exitTime!=null\">بسته</span>\n                </td>\n                <td  style=\"font-family: iransans\">{{i.birthDate}}</td>\n                <td class=\"mt-2\" [ngClass]=\"{'red':i.triageLevelIS==='1','Orange':i.triageLevelIS==='2','Yellow':i.triageLevelIS==='3','blue':i.triageLevelIS==='4','green':i.triageLevelIS==='5'}\" >{{i.triageLevelIS}}</td>\n                <td><span *ngFor=\"let x of transporterList\">\n                <span *ngIf=\"x.Key==i.arrival_Transport\">{{x.Value}}</span>\n            </span></td>\n                <td>{{i.triagePracName}}</td>\n                <td><span *ngFor=\"let x of depratureList\">\n                <span  *ngIf=\"x.Key==i.departure\">{{x.Value}}</span>\n            </span></td>\n                <td>{{i.resultTime}}</td>\n                <td>{{i.encounterID}}</td>\n            </tr>\n            </tbody>\n        </table>\n    </div>\n\n    <div *ngIf=\"List\">\n        <div class=\"col-4 p-3\" *ngIf=\"List.length == 0\" style=\"border: 1px solid;position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);-webkit-box-shadow: 1px -3px 13px -2px rgba(0,0,0,0.75);\nbox-shadow: 1px -3px 13px -2px rgba(0,0,0,0.75);color: white;background-color: #2234ae;\nbackground-image: linear-gradient(315deg, #2234ae 0%, #191714 74%);\">\n            <h4 style=\"font-family: iransans;text-align: center\" >هیچ بیماری امروز تریاژ نشده است </h4>\n            <div class=\"d-flex justify-content-center\">\n                <button [routerLink]=\"['/teriazh/Patient-Triage']\" style=\"font-family: iransans;color: white!important;\" class=\"btn btn-lg btn-primary mt-2\">تریاژ جدید</button>\n            </div>\n\n        </div>\n    </div>\n\n\n\n    <div class=\"row mt-1\" *ngIf=\"List\" >\n        <div class=\"col-12\" style=\"text-align: right\" *ngIf=\"List.length>0\">\n            <button type=\"button\" class=\"btn btn-outline-primary border ml-1\"  [routerLink]=\"['/teriazh/Patient-Triage']\" >تریاژ جدید </button>\n            <!--<button type=\"button\" class=\"btn btn-outline-primary border ml-1\" >ویرایش تریاژ </button>-->\n            <!-- <button type=\"button\" class=\"btn btn-outline-primary border ml-1\"   printSectionId=\"print-section\" [printStyle]= \"{div: {'direction' : 'rtl'}}\" [useExistingCss]=\"true\" ngxPrint >پرینت تریاژ</button> -->\n            <button type=\"button\" class=\"btn btn-outline-primary border ml-1\"   (click)=\"reload()\" >  جستجو</button>\n        </div>\n    </div>\n    <div>\n    </div>\n</div>\n\n\n\n\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/teriazh/print-all/print-all.component.html":
/*!**************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/teriazh/print-all/print-all.component.html ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n\r\n    <style>\r\n    .br{\r\n       border:  2px solid black;\r\n    }\r\n    .p0{\r\n        padding: 0 !important\r\n    }\r\n    .br div{\r\n        padding: 0;\r\n    }\r\n    p,span,label,h4,h3,h5{\r\n        font-weight: bold;\r\n    }\r\n\r\n\r\n</style>\r\n\r\n<div class=\"container\" id=\"print-section\"> \r\n    <div class=\"col-12 text-center\">\r\n        <h3>وزارت بهداشت درمان و آموزش پزشکی</h3>\r\n        <h4>Ministry of Health & Medical Education</h4>\r\n    </div>\r\n    <div class=\"row mt-1\">\r\n        <div class=\"col-12 d-flex justify-content-around\">\r\n            <div>\r\n                <img style=\"width: 100px;height: auto;\" src=\"../../../assets/img/gallery/barcode.png\" alt=\"\">\r\n            </div>\r\n            <h4>دانشگاه علوم پزشکی داشگاه علوم پزشکی ایران </h4>\r\n            <h4>:University of Medical Science </h4>\r\n        </div>\r\n\r\n</div>\r\n<div class=\"row mt-1\">\r\n    <div class=\"col-12  d-flex justify-content-around\">\r\n        <div>\r\n                <span>کد تریاژ</span>\r\n                <span>123456789</span>\r\n        </div>\r\n        <h4> مرکز پزشکی آموزشی درمانی  بیمارستان رایاوران توسعه </h4>\r\n        <h4>:Medical Center</h4>\r\n    </div>\r\n</div>\r\n<div class=\"row mt-1\">\r\n    <div class=\"col-12  d-flex justify-content-around\">\r\n        <div class=\"col-3 \">\r\n            <div class=\"br\" style=\"width:220px;height:50px; \">   \r\n                         شماره پرونده\r\n                         <span>\r\n                            Record No:\r\n                        </span>\r\n            </div>\r\n          \r\n        </div>\r\n        <div class=\" col-6 text-center\">\r\n            <h4>   فرم تریاژ بخش اورژانس بیمارستان </h4>\r\n            <h5>HOSPITAL EMERGENCY DEPARTMENT trIAGE FORM </h5>\r\n        </div>\r\n        <div class=\"col-3 text-left\" style=\"direction: ltr;\">\r\n            <div style=\"width:220px;height:50px\" class=\"br text-left\">\r\n                <span class=\"text-right\">\r\n                    سطح تریاژ بیمار\r\n               </span>\r\n               <span>\r\n                   سطح 3\r\n               </span></div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<div class=\"row mt-1 col-12 br d-flex justify-content-around\" style=\"direction: rtl;\">\r\n        <div class=\"col-6 d-flex\" style=\"text-align: right;border-left: 2px solid black;\" >\r\n          <div class=\"col-6 d-flex justify-content-between \" style=\"border-left: 1px solid black;\">\r\n                <div class=\"col-4\"> نام خانوادگی  </div>\r\n                <div class=\"col-2\">...</div>\r\n                <div class=\"col-6 \">Family Name</div>\r\n          </div>\r\n          <div class=\"col-6 d-flex justify-content-between \">\r\n            <div class=\"col-4\"> نام   </div>\r\n            <div class=\"col-2\">...</div>\r\n            <div class=\"col-6\" > Name</div>\r\n      </div>\r\n           \r\n        </div>\r\n        <div class=\"col-6\" style=\"text-align: right;\">\r\n            <div class=\"col-12 d-flex\">\r\n                <div class=\"col-4\" style=\"border-left: 1px solid black;\">\r\n                    <div>\r\n                        <span style=\"margin-left: 20px;\"> جنس </span>\r\n                        <span class=\"font-weight-bold \" > </span>\r\n                        <span style=\"margin-right: 20px;\">: Sex</span>\r\n                    </div>\r\n                    <div>\r\n                        <span style=\"margin-left: 20px;\"> مذکر </span>\r\n                        <input type=\"checkbox\">\r\n                        <span style=\"margin-right: 20px;\"> M</span>\r\n                        <span style=\"margin-left: 20px;\"> مونث </span>\r\n                        <input type=\"checkbox\">\r\n                        <span style=\"margin-right: 20px;\"> F</span>\r\n                    </div>\r\n                </div>\r\n                <div class=\"col-8\">\r\n                    <div>\r\n                        <span style=\"margin-left: 20px;\"> تاریخ مراجعه </span>\r\n                        <span class=\"font-weight-bold mx-5\" > 1399/08/10</span>\r\n                        <span style=\"margin-right: 20px;\">: Date of Arrival</span>\r\n                    </div>\r\n                    <div>\r\n                        <span style=\"margin-left: 20px;\"> ساعت مراجعه </span>\r\n                        <span class=\"font-weight-bold mx-5\" > 12:25</span>\r\n                        <span style=\"margin-right: 20px;\">: Time of Arrival</span>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-12 mt-2 \" style=\"border-top: 1px solid black;\">\r\n                <span style=\"margin-left: 20px;\"> باردار  </span>\r\n                <span class=\"font-weight-bold mx-5\" > بلی</span>\r\n                <input type=\"checkbox\">\r\n                <span class=\"font-weight-bold mx-5\" > Yes</span>\r\n                <span class=\"font-weight-bold mx-5\" > خیر</span>\r\n                <input type=\"checkbox\">\r\n                <span style=\"margin-left: 20px;\"> Pregnant  </span>\r\n                <span class=\"font-weight-bold mx-5\" > No</span>\r\n                \r\n            </div>\r\n        </div>\r\n</div>\r\n<div class=\"row col-12 br d-flex justify-content-around\" style=\"direction: rtl;padding: 0;\">\r\n    <div class=\"col-12 mt-1 d-flex justify-content-between\" style=\"text-align: right;\">\r\n    <h4>نحوه مراجعه</h4>\r\n    <h4>:Arrival Mode </h4>\r\n    </div>\r\n    <div class=\"col-12 mt-1 \" style=\"text-align: right;\">\r\n        <span>آمبولانس 115</span>\r\n        <input type=\"checkbox\" class=\"mx-3\">\r\n        <span>EMS </span>\r\n        <span style=\"margin-right: 60px;\">آمبولانس خصوصی</span>\r\n        <input type=\"checkbox\" class=\"mx-3\">\r\n        <span>Private Ambulance  </span>\r\n        <span style=\"margin-right: 60px;\"> شخصی</span>\r\n        <input type=\"checkbox\" class=\"mx-3\">\r\n        <span>By Her Own </span>\r\n        <span style=\"margin-right: 60px;\">امداد هوایی </span>\r\n        <input type=\"checkbox\" class=\"mx-3\">\r\n        <span>Air Ambulance   </span>\r\n        <span style=\"margin-right: 60px;\"> سایر</span>\r\n        <input type=\"checkbox\" class=\"mx-3\">\r\n        <span>Other   </span>\r\n    </div>\r\n    <div class=\"col-12 d-flex justify-content-between \" style=\"text-align: right;border-top: 1px solid black;\">\r\n        <div class=\"col-4 mt-1\">\r\n            <p>مراجعه بیمار در 24 ساعت گذشته</p>\r\n        </div>\r\n        <div class=\"col-4 d-flex mt-1\" style=\"text-align: right;direction: rtl;\">\r\n            <div class=\"col-4\">\r\n                <span>همین بیمارستان</span>\r\n                <input type=\"checkbox\">\r\n            </div>\r\n            <div class=\"col-4\">\r\n                <span>بیمارستان دیگر </span>\r\n                <input type=\"checkbox\">\r\n            </div>\r\n            <div class=\"col-4\">\r\n                <span>خیر</span>\r\n                <input type=\"checkbox\">\r\n            </div>\r\n        </div>\r\n        <div class=\"col-4 mt-1\" style=\"text-align: left;\">\r\n            <p>  :Patient Presence in ED in 24 Past Hours   </p>\r\n        </div>\r\n        \r\n    </div>\r\n    <div class=\"col-12 d-flex justify-content-between\"  style=\"text-align: right\">\r\n        <div class=\"col-4\"></div>\r\n        <div class=\"col-4 d-flex mt-1\">\r\n            <div class=\"col-4\">\r\n                <span> This Hospital</span>\r\n            </div>\r\n            <div class=\"col-4\">\r\n                <span>Other Hospital\r\n\r\n                </span>\r\n            </div>\r\n            <div class=\"col-4\">\r\n                <span>No</span>\r\n            </div>\r\n\r\n        </div>\r\n        <div class=\"col-4\"></div>\r\n    </div>\r\n    \r\n</div>\r\n<div class=\"row col-12 br d-flex justify-content-around\" style=\"direction: rtl;\">\r\n    <div class=\"col-12 mt-1 \" style=\"text-align: right;\">\r\n        <h5 class=\"font-weight-bold\">شکایت اصلی</h5>\r\n    </div>\r\n    <div class=\"col-12  d-flex justify-content-between \" style=\"text-align: right;\">\r\n        <div class=\"d-flex\">\r\n            <h5 class=\"font-weight-bold\">شرح شکایت بیمار :</h5>\r\n            <span>afhdf</span>\r\n        </div>\r\n        <div>\r\n            <span>Chief Complaint\r\n            </span>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-12 mt-2  d-flex justify-content-between \" style=\"text-align: right;\">\r\n        <div >\r\n            <p class=\"font-weight-bold\">سابقه حساسیت دارویی:   </p>\r\n           \r\n        </div>\r\n        <div>\r\n                <p>History of Drug and Food Allergy</p>\r\n        </div>\r\n    </div>\r\n</div>\r\n<div class=\"col-12 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">\r\n    <div class=\"\">  \r\n          <p> بیماران سطح 1 (شرایط تهدید کننده حیات )</p>\r\n    </div>\r\n    <div  ><span>...................................................</span></div>\r\n    <div >  \r\n        <p>\r\n            Triage level 1 (Life threatening situation)\r\n        </p>\r\n  </div>\r\n</div>\r\n<div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\r\n            <div class=\"col-12 d-flex justify-content-between\">\r\n                <div>\r\n                    <span>\r\n                        سطح هوشیاری بیمار:\r\n\r\n                    </span>\r\n                </div>\r\n                <div  style=\"text-align: right;direction: rtl;\">\r\n                    <span >\r\n                        بدون پاسخ\r\n                    </span>\r\n                    <input type=\"checkbox\">\r\n                </div>\r\n                <div>\r\n                    <span>\r\n                        پاسخ به محرک دردناک\r\n                   </span>\r\n                   <input type=\"checkbox\">\r\n                </div>\r\n                <div>\r\n                    <span>\r\n                        پاسخ به محرک کلامی\r\n                    </span>\r\n                    <input type=\"checkbox\">\r\n                </div>\r\n                <div>\r\n                    <span>\r\n                        هوشیار\r\n                   </span>\r\n                   <input type=\"checkbox\">\r\n                </div>\r\n                \r\n            </div>\r\n            <div class=\"col-12 d-flex justify-content-between\">\r\n                <div>\r\n                    <span>\r\n                        سیستم:(AVPU)\r\n                    </span>\r\n                    \r\n                </div>\r\n                <div>\r\n                    <span>\r\n                        Unresponsive (U)             \r\n                     </span>\r\n                </div>\r\n                <div>\r\n                    <span>\r\n                        Response to Pain Stimulus(P)          \r\n                     </span>\r\n                </div>\r\n                <div>\r\n                    <span>\r\n                        Response to Verbal Stimulus(V)             \r\n                     </span>\r\n                </div>\r\n                <div>\r\n                    <span>\r\n                        Alert (A)\r\n             \r\n                     </span>\r\n                </div>\r\n             \r\n            \r\n            \r\n            \r\n            \r\n            \r\n            \r\n            </div>\r\n            <div class=\"col-12 d-flex justify-content-between\" style=\"border-top: 1px solid black;\">\r\n                <div style=\"border-left: 1px solid black;text-align: right;\">\r\n                    <label for=\"\">مخاطره راه هوایی</label>\r\n                    <input type=\"checkbox\" name=\"\" id=\"\">\r\n                    <p>\r\n                        Airway compromise\r\n                    </p>\r\n                </div>\r\n                <div style=\"border-left: 1px solid black;text-align: right;\">\r\n                    <label for=\"\"> دیسترس شدید تنفسی </label>\r\n                    <input type=\"checkbox\" name=\"\" id=\"\">\r\n                    <p>\r\n                        Sever Respiratory Distress          \r\n                              </p>\r\n                </div>\r\n                <div style=\"border-left: 1px solid black;text-align: right;\">\r\n                    <label for=\"\">  سیانوز</label>\r\n                    <input type=\"checkbox\" name=\"\" id=\"\">\r\n                    <p>\r\n                        Cyanosis\r\n                    </p>\r\n                </div>\r\n                <div style=\"border-left: 1px solid black;text-align: right;\">\r\n                    <label for=\"\">  علایم شوک</label>\r\n                    <input type=\"checkbox\" name=\"\" id=\"\">\r\n                    <p>\r\n                        Signs of Shock\r\n                    </p>\r\n                </div>\r\n                <div>\r\n                    <label for=\"\"> اشباع اکسیژن کمتر از 90 درصد </label>\r\n                    <input type=\"checkbox\" name=\"\" id=\"\">\r\n                    <p>\r\n                        SpO2 < 90\r\n                    </p>\r\n                </div>\r\n                \r\n            </div>\r\n           \r\n         \r\n       \r\n       \r\n        \r\n        \r\n     \r\n    </div>\r\n    <div class=\"col-12 mt-1 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">\r\n        <div class=\"\">  \r\n              <p> بیماران سطح 2 </p>\r\n        </div>\r\n        <div class=\"p0\" ><span>..............................................................................................................................</span></div>\r\n        <div class=\"p0\">  \r\n            <p>\r\n                Triage level 2 \r\n            </p>\r\n      </div>\r\n    </div>\r\n    <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\r\n  \r\n        <div class=\"col-12 d-flex \" >\r\n            <div class=\"col-3\" style=\"border-left: 1px solid black;text-align: center\">\r\n                <label for=\"\">شرایط پر خطر   </label>\r\n                <input type=\"checkbox\" name=\"\" id=\"\">\r\n                <p>\r\n                    High Risk Conditions           \r\n                     </p>\r\n            </div>\r\n            <div class=\"col-3\" style=\"border-left: 1px solid black;\">\r\n                <label for=\"\"> \r\n                    لتارژی خواب آلودگی اختلال جهت یابی \r\n                \r\n                </label>\r\n                <input type=\"checkbox\" name=\"\" id=\"\">\r\n                <p>\r\n                    \r\n                    lethargy/ confusion/ disorientation\r\n                          </p>\r\n            </div>\r\n            <div class=\"col-3 text-center\" style=\"border-left: 1px solid black;\">\r\n                <label for=\"\">  دیترس شدید روان </label>\r\n                <input type=\"checkbox\" name=\"\" id=\"\">\r\n                <p>\r\n                    Sever psychiatric Distress\r\n                                </p>\r\n            </div>\r\n            <div  class=\"d-flex col-3 justify-content-around\">\r\n                <div style=\"margin-top: 10px\">\r\n                    <span for=\"\">   درد شدید</span>\r\n                    <p>\r\n                        Sever Pain\r\n\r\n                    </p>\r\n                </div>\r\n                <div style=\"margin-top: 10px\">\r\n                    <div style=\"padding: 0\">10</div>\r\n                    <div style=\"width: 20px;height: 1px;background-color: black\"></div>\r\n                    <div>10</div>\r\n                </div>\r\n\r\n\r\n\r\n            </div>\r\n        </div>\r\n        <div class=\"col-12 d-flex \" style=\"border-top: 1px solid;\">\r\n            <div class=\"col-6 d-flex justify-content-between \">\r\n                <p>سابقه پزشکی </p>\r\n                <p>\r\n                     Medical history \r\n                     </p>\r\n            </div>\r\n            <div class=\"col-6 d-flex justify-content-between \">\r\n                <p>سابقه دارویی </p>\r\n                <p>\r\n                    Drug history \r\n                     </p>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid;\">\r\n                <p class=\"font-weight-bold\">علایم حیاتی  </p>\r\n                <p class=\"font-weight-bold\">:sign Vital </p>\r\n        </div>\r\n        <div class=\"col-12 d-flex justify-content-between\" style=\"flex-wrap: nowrap;\">\r\n            <div class=\"\">\r\n                <span>:فشارخون</span>\r\n                 <span>  ___   </span>  \r\n                 <span>BP <small>mmHg</small></span> \r\n            </div>\r\n            <div  class=\"\">\r\n                <span>تعداد ضربان</span>\r\n                 <span>  ___   </span>  \r\n                 <span>PR/min</span> \r\n            </div>\r\n            <div  class=\"\">\r\n                <span>:تنفس</span>\r\n                 <span>  __   </span>  \r\n                 <span>RR/min</span> \r\n            </div>\r\n            <div class=\"\">\r\n                <span>:دمای بدن</span>\r\n                 <span>  ___   </span>  \r\n                 <span>T</span> \r\n            </div>\r\n            <div  class=\"\">\r\n                <span>:درصد اشباع اکسیژن </span>\r\n                 <span>  __   </span>  \r\n                 <span>Spo2%</span> \r\n            </div>\r\n        </div>\r\n</div>\r\n<div class=\"col-12 mt-1 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">\r\n    <div class=\"\">  \r\n          <p> بیماران سطح 3 </p>\r\n    </div>\r\n    <div class=\"p0\" ><span>..............................................................................................................................</span></div>\r\n    <div class=\"p0\">  \r\n        <p>\r\n            Triage level 3\r\n        </p>\r\n  </div>\r\n</div>\r\n<div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\r\n  \r\n   \r\n    <div class=\"col-12 d-flex \">\r\n        <div class=\"col-6 d-flex justify-content-between \">\r\n            <p> تعداد تسهیلات مورد نظر در بخش اورژانس </p>\r\n            <p>\r\n                  دو مورد بیشتر \r\n                  <input type=\"checkbox\">\r\n                 </p>\r\n        </div>\r\n        <div class=\"col-6 d-flex justify-content-between \">\r\n            <p> TWO & More </p>\r\n            <p>\r\n                :Number of Required Resources in ED \r\n                 </p>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid;\">\r\n            <p class=\"font-weight-bold\">علایم حیاتی  </p>\r\n            <p class=\"font-weight-bold\">:sign Vital </p>\r\n    </div>\r\n    <div class=\"col-12 d-flex justify-content-between\" style=\"flex-wrap: nowrap;\">\r\n        <div class=\"\">\r\n            <span>:فشارخون</span>\r\n             <span>  ___   </span>  \r\n             <span>BP <small>mmHg</small></span> \r\n        </div>\r\n        <div  class=\"\">\r\n            <span>تعداد ضربان</span>\r\n             <span>  ___   </span>  \r\n             <span>PR/min</span> \r\n        </div>\r\n        <div  class=\"\">\r\n            <span>:تنفس</span>\r\n             <span>  __   </span>  \r\n             <span>RR/min</span> \r\n        </div>\r\n        <div class=\"\">\r\n            <span>:دمای بدن</span>\r\n             <span>  ___   </span>  \r\n             <span>T</span> \r\n        </div>\r\n        <div  class=\"\">\r\n            <span>:درصد اشباع اکسیژن </span>\r\n             <span>  __   </span>  \r\n             <span>Spo2%</span> \r\n        </div>\r\n    </div>\r\n</div>\r\n<div class=\"col-12 mt-1 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">\r\n    <div class=\"\">  \r\n          <p> بیماران سطح 4 و 5 </p>\r\n    </div>\r\n    <div class=\"p0\" ><span>..............................................................................................................................</span></div>\r\n    <div class=\"p0\">  \r\n        <p>\r\n            Triage level 4&5\r\n        </p>\r\n  </div>\r\n</div>\r\n<div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;\">\r\n  \r\n   \r\n    <div class=\"col-12 d-flex \">\r\n        <div class=\"col-6 d-flex justify-content-between \">\r\n            <p> تعداد تسهیلات مورد نظر در بخش اورژانس </p>\r\n            <p>\r\n                   یک مورد \r\n                  <input type=\"checkbox\">\r\n                 </p>\r\n                 <p>One item</p>\r\n        </div>\r\n        <div class=\"col-6 d-flex justify-content-between \">\r\n            <p> هیچ</p>\r\n            <p>\r\n                   None  \r\n                  <input type=\"checkbox\">\r\n                 </p>\r\n                 <p>: ED in Resources Required of Number</p>\r\n        </div>\r\n    </div>\r\n   \r\n</div>\r\n<div class=\"row col-12 br mt-2 d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\r\n    <div class=\"col-12 d-flex justify-content-between \">\r\n            <p> سطح تریاژ بیمار        </p>\r\n            <p>\r\n                  5   \r\n                  <input type=\"checkbox\">\r\n                 </p>\r\n                 <p>\r\n                    4  \r\n                    <input type=\"checkbox\">\r\n                   </p>\r\n                   <p>\r\n                    3   \r\n                    <input type=\"checkbox\">\r\n                   </p>\r\n                   <p>\r\n                    2   \r\n                    <input type=\"checkbox\">\r\n                   </p>\r\n                   <p>\r\n                    1  \r\n                    <input type=\"checkbox\">\r\n                   </p>\r\n                   <p>\r\n                    Patient Triage level: \r\n                   </p>\r\n        \r\n     \r\n    </div>\r\n    <div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid;\">\r\n            <p class=\"font-weight-bold\">جداسازی بیمار و احتیاطات بیشتر کنترل عفونت   </p>\r\n            <p class=\"font-weight-bold\">تماسی \r\n            <input type=\"checkbox\">    \r\n            </p>\r\n            <p class=\"font-weight-bold\">قطره ای  \r\n                <input type=\"checkbox\">    \r\n                </p>\r\n                <p class=\"font-weight-bold\">تنفسی \r\n                    <input type=\"checkbox\">    \r\n                    </p>\r\n                    <p class=\"font-weight-bold\">نیاز ندارد \r\n                        <input type=\"checkbox\">    \r\n                        </p>\r\n    </div>\r\n\r\n    <div class=\"col-12 d-flex d-flex justify-content-between \">\r\n            <p class=\"font-weight-bold\">Patient Isolation and More Infection Control Precautions       </p>\r\n            <p class=\"font-weight-bold\">Contact \r\n            </p>\r\n            <p class=\"font-weight-bold\">Droplet \r\n                </p>\r\n                <p class=\"font-weight-bold\">Airborne \r\n                    </p>\r\n                    <p class=\"font-weight-bold\">No Need to Isolation  \r\n                        </p>\r\n    </div>\r\n    <div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid black;\">\r\n        <div>  \r\n                  <p class=\"font-weight-bold\">ارجاع به</p>\r\n        </div>\r\n        <div>\r\n                <label for=\"\">سرپایی</label>\r\n                <input type=\"checkbox\" name=\"\" id=\"\">\r\n                <span>Fast track</span>\r\n        </div>\r\n        <div>\r\n            <label for=\"\">احیا</label>\r\n            <input type=\"checkbox\" name=\"\" id=\"\">\r\n            <span> CPR</span>\r\n        </div>\r\n        <div>\r\n            <label for=\"\">فضای بستری</label>\r\n            <input type=\"checkbox\" name=\"\" id=\"\">\r\n            <span>Inpatient Area </span>\r\n        </div>\r\n        <div>\r\n            <label for=\"\">سایر...</label>\r\n            <input type=\"checkbox\" name=\"\" id=\"\">\r\n            <span>Other </span>\r\n        </div>\r\n\r\n        <div>  \r\n            <p class=\"font-weight-bold\">  :Refer to </p>\r\n  </div>\r\n        \r\n</div>\r\n<div class=\"col-12 d-flex justify-content-between\" style=\"border-top: 1px solid black;\">\r\n    <div class=\"col-6 d-flex\">\r\n        <p>ساعت و تاریخ ارجاع</p>\r\n        <span>.........</span>\r\n    </div>\r\n    <div class=\"col-6 d-flex\">\r\n        <p> نام و نام خانوتدگی مهر و امضای پرستار تریاژ  </p>\r\n        <span>.........</span>\r\n    </div>\r\n</div>\r\n<div class=\"col-12 d-flex justify-content-between\" >\r\n    <div class=\"col-6 d-flex\">\r\n        <p> Date & Time of Referral:  </p>\r\n        <span>.........</span>\r\n    </div>\r\n    <div class=\"col-6 d-flex\">\r\n        <p>  Triage Nurse’s Name/Signature/Stamp     </p>\r\n        <span>.........</span>\r\n    </div>\r\n</div>\r\n<div class=\"col-12 d-flex justify-content-between\" style=\"border-top: 1px solid black;\">\r\n<p>توضیحات\r\n    <span>......</span>\r\n</p>\r\n<p>\r\n    <span>\r\n        .......\r\n    </span>\r\n    Description\r\n    \r\n</p>\r\n\r\n</div>\r\n</div>\r\n  \r\n</div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/teriazh/show-info/show-info.component.html":
/*!**************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/teriazh/show-info/show-info.component.html ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<style>\n    .line{\n    height: 1px;\n        background-color: #fcb103\n    }\n    .btnCustome{\n        padding-right:8px !important;\n        padding-left: 8px !important;\n        padding-top: 3px!important;\n        padding-bottom: 3px!important;\n        border: 1px solid;\n        font-size:14px;\n        background-color:#fcb103 ;\n        color: white;\n    }\n    .btnW{\n        padding-right:20px !important;\n        padding-left: 20px !important;\n        padding-top: 3px!important;\n        padding-bottom: 3px!important;\n        border: 1px solid;\n        font-size:14px;\n        background-color:#fcb103 ;\n        color: white;\n\n    }\n    .pos{\n        top: 0;\n        left: 0;\n        transform: translateY(-50%);\n        background-color: #F5F7FA;\n\n    }\n    .Customborder{\n        border: 2px solid #009da0 ;\n    }\n    .form-group{\n        margin-bottom: 1px !important;\n    } \n    .marT{\n        margin-top: 15px;\n    }\n    .header{\n        background-color: #063d78;\n        color: white;\n        padding-top: 5px;\n        padding-bottom: 5px;\n    }\n    .hide{ \n        display: none;\n    }\n    .checkSize{\n        width: 20px;\n        height: 20px;\n    }\n    ul li{\n        list-style: none;\n    }\n    .CircleBtn{\n        border-radius: 50%;\n    }\n    table th {\n        background-color: #48d9fa;\n\n    }\n    table{\n        text-align: center;\n    }\n    .br{\n       border:  2px solid black;\n    }\n    .p0{\n        padding: 0 !important\n    }\n    .br div{\n        padding: 0;\n    }\n    p,label,h4,h3,h5{\n        font-weight: bold;\n    }\n    .roundBorder{\n        border: 2px solid gray;\n        border-radius: 10px;\n    }\n    input[type=checkbox]{\n        width: 18px;\n        height: 18px;\n        margin-right: 3px;\n        margin-left: 3px;\n    }\n\n\n</style>\n\n<div class=\"container-fluid\" style=\"font-family: iransans!important;\" *ngIf=\"triazhInfo\">\n\n    <div class=\"\" style=\"border: 1px solid #b3b0af;background-color: #f2f2f2;\">\n        <div class=\"header\">\n            <h5 style=\"text-align: center;\">مشخصات بیمار</h5>\n    </div>\n    <div action=\"\" >\n        <div class=\"row mt-2\">\n            <div class=\" col-12 d-flex justify-content-between  \" style=\"text-align: right;\">\n                <p>\n                    <span class=\"font-weight-bold\">\n                        نام:\n                    </span>\n                    {{triazhInfo['item']['firstName']}}\n                    </p>\n               \n                    <p>\n                        <span class=\"font-weight-bold\">\n                            نام خانوادگی :\n                        </span>\n                        {{triazhInfo['item']['lastName']}}\n                        </p>\n                        <p>\n                            <span class=\"font-weight-bold\">تاریخ تولد :</span>\n                            {{triazhInfo['item']['birthDate']}}\n                            </p>\n                            <p>\n                                <span class=\"font-weight-bold\">کد ملی:</span>\n\n                                {{triazhInfo['item']['nationalCode']}}\n                                </p>\n                                <p>\n\n                                    <span class=\"font-weight-bold\"> سن:</span>\n                                    {{triazhInfo['item']['age']}}\n\n                                </p>\n            </div>\n        </div>\n    </div>\n    </div>\n    <div >\n\n    </div>\n    <div style=\"border: 1px solid #b3b0af;background-color: #f2f2f2;\">\n        <div class=\"header\" >\n            <h5 style=\"text-align: center;\">مشخصات مراجعه</h5>\n    </div>\n    <div class=\"row\">\n        <div  class=\"col-12  d-flex justify-content-between\">\n            <div class=\"d-flex\">\n                <span class=\"font-weight-bold\">نحوه مراجعه:</span>\n                <p *ngFor=\"let i of trasporter\">\n                        <span *ngIf=\"i.Key==triazhInfo['item']['arrival_Transport']\">{{i.Value}}</span>\n            </p>\n                \n            </div>\n            <div>\n                <span class=\"font-weight-bold\"> مراجعه در 24 ساعت گذشته:</span>\n                <p *ngFor=\"let i of Encounter24HoursAgoList\">\n                    <span *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems']==i.Key\">{{i.Value}}</span>\n                    <span  *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems']=null\">خیر</span>\n                </p>\n            </div>\n            <div  class=\"d-flex\"  >\n                <span class=\"font-weight-bold\"> دلیل مراجعه:</span>\n                <div  *ngIf=\"triazhInfo['item']['triage_AdmissionKind']!=null\" >\n                    <div *ngFor=\"let a of triazhInfo['item']['triage_AdmissionKind']\">\n                        <div *ngFor=\"let i of AdmissionKindList\">\n                            <span  *ngIf=\"a.admissionKindID==i.id\">{{i.admissionKindValue}}</span>\n                        </div>\n                    </div>\n                        <!-- <div *ngIf=\"triazhInfo['item']['triage_AdmissionKind'][0]\">\n                            <div *ngFor=\"let i of AdmissionKindList\">\n                                <span  *ngIf=\"triazhInfo['item']['triage_AdmissionKind'][0]['admissionKindID']==i.id\">{{i.admissionKindValue}}</span>\n                            </div>\n                        </div> -->\n\n\n                </div>\n                <div *ngIf=\"triazhInfo['item']['triageOtherCasesAdmissionKind']!=null\">\n\n                            <div *ngIf=\"triazhInfo['item']['triageOtherCasesAdmissionKind'][0]\">\n                                   <span class=\"ml-2\">{{triazhInfo['item']['triageOtherCasesAdmissionKind'][0]['description']}}</span>     \n                        </div>\n                </div>\n                <div *ngIf=\"triazhInfo['item']['triage_AdmissionKind']==null\">\n                    <span>خیر</span>\n                </div>\n\n\n\n            </div>\n            <div class=\"d-flex\" >\n                <span class=\"font-weight-bold\"> شکایت اصلی:</span>\n                <div  *ngIf=\"triazhInfo['item']['triage_MainDisease']!=null\" >\n                    <div *ngFor=\"let a of triazhInfo['item']['triage_MainDisease']  \">\n                      \n                        <div *ngFor=\"let i of MainDiseaseList\">\n                            <span  *ngIf=\"a.mainDiseaseID==i.id\">{{i.mainDiseaseValue}}</span>\n                        </div>\n                    </div>\n                    <!-- <div *ngIf=\"triazhInfo['item']['triage_MainDisease'][0]\">\n                        <div *ngFor=\"let i of MainDiseaseList\">\n                            <span  *ngIf=\"triazhInfo['item']['triage_MainDisease'][0]['mainDiseaseID']==i.id\">{{i.mainDiseaseValue}}</span>\n                        </div>\n                    </div> -->\n                </div>\n                <div *ngIf=\"triazhInfo['item']['triageOtherCasesMainDisease']!=null\">\n\n                    <div *ngIf=\"triazhInfo['item']['triageOtherCasesMainDisease'][0]\">\n                           <span class=\"ml-2\">{{triazhInfo['item']['triageOtherCasesMainDisease'][0]['description']}}</span>     \n                </div>\n        </div>\n        <!-- <div *ngIf=\"triazhInfo['item']['triage_AdmissionKind']==null\">\n            <span>خیر</span>\n        </div> -->\n\n\n                <div *ngIf=\"triazhInfo['item']['triage_MainDisease']==null\">\n                    <span>خیر</span>\n                </div>\n            </div>\n            <div class=\"d-flex\" >\n                <span class=\"font-weight-bold\">حساسیت دارویی:</span>\n                 <div>\n                  \n                 </div>\n                 <div *ngIf=\"triazhInfo['item']['triageAllergyDrugs']\">\n                     <div *ngFor=\"let a of triazhInfo['item']['triageAllergyDrugs'] \">\n                         <div *ngIf=\"AllergyDrugListSepas\">\n                            <div *ngFor=\"let i of AllergyDrugListSepas['items']\">\n                                <span  *ngIf=\"a.sepas_ERXCode==i.code\">{{i.value}}</span>\n                            </div>\n                         </div>\n                     \n                    </div>\n                 </div>\n           \n                <div *ngIf=\"triazhInfo['item']['triageAllergyDrugs'][0]\">\n                  \n                    \n\n                    <!-- <div *ngIf=\"AllergyDrugListSepas\">\n                        <div *ngFor=\"let i of AllergyDrugListSepas['items']\">\n                            <span  *ngIf=\"triazhInfo['item']['triageAllergyDrugs'][0]['sepas_ERXCode']==i.code\">{{i.value}}</span>\n                        </div>\n                    </div> -->\n                </div>\n\n                <div *ngIf=\"triazhInfo['item']['triageAllergyDrugs']==null\">\n                    <span>خیر</span>\n                </div>\n\n\n\n\n            </div>\n        </div>\n    </div>\n        <!--<span>-->\n                    <!--{{AllergyDrugListSepas | json}}-->\n                <!--</span>-->\n    \n    </div>\n    <div  style=\"border: 1px solid #b3b0af;background-color: #f2f2f2;\"  >\n        <div class=\"header\">\n            <h5 style=\"text-align: center;\">مشخصات سطح تریاژ</h5>\n    </div>\n    <div class=\"row\" >\n        <div class=\"col-12 d-flex justify-content-between\" *ngIf=\"triazhInfo['item']['triageLevelIS']==1\">\n            <p>\n                <span class=\"font-weight-bold\">سطح تریاژ:</span>\n                <span>{{triazhInfo['item']['triageLevelIS']}}</span>\n            </p>\n            <div class=\"d-flex\">\n                <p *ngFor=\"let i of AVPUlist\">\n                    <span *ngIf=\"i.Key==triazhInfo['item']['stateOfAlertIS']\"> {{i.Value}}</span>\n\n                </p>\n                <span class=\"font-weight-bold\"> :Assess the patients Level of Responsiveness</span>\n\n\n            </div>\n           \n            <div class=\"d-flex\">\n                <p>\n                    <span *ngIf=\"triazhInfo['item']['dangerousRespire']==true\">\n                        Patient Airway Hazard\n                    </span>\n\n                </p>\n\n                <span class=\"font-weight-bold\">Life Threatening Condition:</span>\n\n                \n            </div> \n        </div>\n        <div class=\"col-12 d-flex justify-content-between\" style=\"flex-wrap: wrap;\" *ngIf=\"triazhInfo['item']['triageLevelIS']==2\">\n            <p>\n                <span class=\"font-weight-bold mt-1\">سطح تریاژ:</span>\n                <span class=\"mt-1\">{{triazhInfo['item']['triageLevelIS']}}</span>\n            </p>\n            <div class=\"d-flex\">\n                <p>\n                    <input type=\"checkbox\" style=\"padding: 10px;border: 1px solid;width: 20px;height: 20px\" class=\"mt-1 ml-2\" disabled  [checked]=\"triazhInfo['item']['highDanger']==='True'\">\n                </p>\n                <span class=\"font-weight-bold mt-1\">? Is This a High-Risk Situation\n                </span>\n\n\n            </div>\n           \n            <div class=\"d-flex\">\n                <p>\n                    <input type=\"checkbox\" disabled  style=\"padding: 10px;border: 1px solid;width: 20px;height: 20px\" class=\"mt-1 ml-2\" [checked]=\"triazhInfo['item']['lethargy']==='True'\">\n\n                </p>\n                <span class=\"font-weight-bold mt-1\"> Is the patient Confused,Lethargic,or Disoriented </span>\n            </div> \n            <div class=\"d-flex\">\n                <p>\n                    <input style=\"padding: 10px;border: 1px solid;width: 20px;height: 20px\" disabled class=\"ml-2 mt-1\" type=\"checkbox\" [checked]=\"triazhInfo['item']['highDistress']==='True'\">\n\n                </p>\n                <span class=\"font-weight-bold mt-1\"> Is the patient in Severe pain or Distress </span>\n            </div> \n     \n        </div>\n        <div class=\"col-12 d-flex justify-content-between\" *ngIf=\"triazhInfo['item']['triageLevelIS']==2\">\n            <div class=\"d-flex\">\n                <span class=\"font-weight-bold\">    فشارخون  :</span>\n\n                <p >\n                    <span >\n                        {{bp}}\n                    </span>\n                </p>\n\n\n            </div> \n\n            <div class=\"d-flex\">\n                  <span class=\"font-weight-bold\">\n                    تعداد ضربان:   PR/min\n                </span>\n                <p >\n                    <span style=\"margin-right: 3px\" >\n                        {{pr}}\n                    </span>\n                </p>\n\n                \n            </div>\n            <div class=\"d-flex\">\n                   <span class=\"font-weight-bold\">\n                     تنفس: RR/min\n                </span>\n                <p >\n                    <span style=\"margin-right: 3px\" >\n                        {{rr}}\n\n                    </span>\n                </p>\n\n                \n            </div>\n            <div class=\"d-flex\">\n                 <span class=\"font-weight-bold\">\n                     دمای بدن: T\n                </span>\n                <p >\n                    <span style=\"margin-right: 3px\" >\n                        {{t}}\n\n                    </span>\n                </p>\n\n                \n            </div>\n            <div class=\"d-flex\">\n                 <span class=\"font-weight-bold \" >\n                        درصد اشباع اکسیژن: SPO2 %\n                </span>\n                <p >\n                    <span style=\"margin-right: 3px\" >\n                        {{spo2}}\n\n                    </span>\n                </p>\n\n                \n            </div>\n        </div>\n        <div class=\"col-12 d-flex justify-content-between\" *ngIf=\"triazhInfo['item']['triageLevelIS']==3\">\n            <p>\n                <span class=\"font-weight-bold\">سطح تریاژ:</span>\n                <span>{{triazhInfo['item']['triageLevelIS']}}</span>\n            </p>\n            <div class=\"d-flex\">\n                <span class=\"font-weight-bold\">: فشارخون</span>\n\n                <p >\n                    <span >\n                       {{bp}}\n                    </span>\n                </p>\n\n\n            </div> \n\n            <div class=\"d-flex\">\n                <span class=\"font-weight-bold\">  \n                       تعداد ضربان    :<small>(PR/min)</small>\n                </span>\n                <p >\n                    <span >\n                        {{pr}}\n\n                    </span>\n                </p>\n              \n                \n            </div>\n            <div class=\"d-flex\">\n                <span class=\"font-weight-bold\">  \n                    تنفس   : <small>(RR/min)</small>\n               </span>\n                <p >\n                    <span >\n                        {{rr}}\n\n                    </span>\n                </p>\n               \n                \n            </div>\n            <div class=\"d-flex\">\n                <span class=\"font-weight-bold\">  \n                    دمای بدن :    <small>(T)</small>\n               </span>\n                <p >\n                    <span >\n                        {{t}}\n\n                    </span>\n                </p>\n              \n                \n            </div>\n            <div class=\"d-flex\">\n                <span class=\"font-weight-bold\">  \n                    درصد اشباع اکسیژن   <small>(SPO2 %)</small>\n            </span>\n                <p >\n                    <span >\n                        {{spo2}}\n\n                    </span>\n                </p>\n                \n                \n            </div>\n        </div>\n    </div>\n    </div>\n    <div style=\"border: 1px solid #b3b0af;background-color: #f2f2f2;\">\n        <div class=\"header\">\n            <h5 style=\"text-align: center;\">مشخصات ارجاع  </h5>\n\n    </div>\n    <div class=\"row\">\n        <div class=\"col-12 d-flex justify-content-around\">\n            <div class=\"d-flex\">\n                <span class=\"font-weight-bold\">\n                    ارجاع به:\n                   </span>\n                <p *ngFor=\"let i of departure\">\n                    <span *ngIf=\"triazhInfo['item']['departure']==i.Key\">\n                        {{i.Value}}\n                    </span>\n                </p>\n              \n            </div>\n            <div class=\"d-flex\">\n\n                <span class=\"font-weight-bold\">      \n                           جداسازی بیمار و کنترل عفونت:\n                </span>\n                <p *ngFor=\"let i of SeparationByInfectionList\">\n                    <span *ngIf=\"triazhInfo['item']['separationByInfection']==i.Key\">\n                    {{i.Value}}\n                    </span>\n                </p>\n                \n            </div>\n\n        </div>\n    </div>\n    </div>\n    <div style=\"direction: rtl;text-align: right;\" class=\"mt-2\">\n        <button type=\"button\" class=\"btn btn-outline-primary border ml-1\"   printSectionId=\"print-section\" [printStyle]= \"{div: {'direction' : 'rtl'}}\" [useExistingCss]=\"true\" ngxPrint >پرینت تریاژ</button>\n         <button type=\"button\" class=\"btn btn-outline-primary border ml-1\" (click)=\"edit()\"  >ویرایش</button>\n    </div>\n \n\n<div>\n    <!-- {{triazhInfo['item']['triage_MainDisease'][0]['mainDiseaseID']}} -->\n\n</div>\n</div>\n\n<!-- print section -->\n<div class=\"container\" style=\"float: right;\" id=\"print-section\"[hidden]=\"hide\" *ngIf=\"triazhInfo\">\n\n\n\n\n    <div class=\"col-12 text-center\">\n        <h4>وزارت بهداشت درمان و آموزش پزشکی</h4>\n        <h5>Ministry of Health & Medical Education</h5>\n    </div>\n    <div class=\"row mt-1\">\n        <div class=\"col-12 d-flex justify-content-around\">\n            <div>\n                <!--<img style=\"width: 100px;height: auto;\" src=\"../../../assets/img/gallery/barcode.png\" alt=\"\">-->\n                <!--<ngx-barcode [bc-value]=\"triazhInfo['item']['id']\" [bc-display-value]=\"true\"></ngx-barcode>-->\n            </div>\n            <h5>دانشگاه علوم پزشکی : </h5>\n            <h5><span *ngIf=\"hospital\">\n            {{hospital['universityName']}}\n        </span></h5>\n            <h5>:University of Medical Science </h5>\n        </div>\n\n</div>\n<div class=\"row \">\n    <div class=\"col-12  d-flex justify-content-around\">\n        <h5>        مرکزآموزشی درمانی    :\n        </h5>\n        <!--<div>-->\n                <!--<span>کد تریاژ</span>-->\n                <!--<span>{{triazhInfo['item']['id']}}</span>-->\n        <!--</div>-->\n        <h5><span *ngIf=\"hospital\">\n            {{hospital['hospitalName']}}\n        </span></h5>\n        <h5>:Medical Center</h5>\n    </div>\n</div>\n    <div class=\"container\">\n        <div class=\"row \">\n            <div class=\"col-12  d-flex justify-content-between\">\n                <div class=\"col-3 \"style=\"direction: rtl;padding: 0\" >\n                    <div class=\"br\" style=\"width:220px;height:50px; \">\n                        شماره پرونده\n                        <span>\n                            Record No:\n                        </span>\n                    </div>\n\n                </div>\n                <div class=\" col-6 text-center\">\n                    <h5>   فرم تریاژ بخش اورژانس بیمارستان </h5>\n                    <h6 class=\"text-bold-700\">HOSPITAL EMERGENCY DEPARTMENT trIAGE FORM </h6>\n                </div>\n                <div class=\"col-3 text-left\" style=\"direction: ltr;\">\n                    <div style=\"width:220px;height:50px\" class=\"br text-right\">\n                <span class=\"text-right\">\n                    سطح تریاژ بیمار\n               </span>\n                        <span class=\"font-weight-bold\">\n                  {{triazhInfo['item']['triageLevelIS']}}\n               </span></div>\n                </div>\n            </div>\n        </div>\n    </div>\n\n<div class=\"container\" >\n    <div class=\"row  col-12 br d-flex justify-content-around\" style=\"direction: rtl;padding: 0;\">\n        <div class=\"col-12 d-flex \">\n            <div class=\"col-3 d-flex justify-content-between \" style=\"border-left: 1px solid black;\" >\n          <p>نام خانوادگی</p>\n          <p class=\"mt-4 text-bold-700\" style=\"font-size: 16px\" >{{triazhInfo['item']['lastName']}}</p>\n          <p  style=\"font-size: 14px;\">Family Name</p>\n          </div>\n            <div class=\"col-3 d-flex justify-content-between\" style=\"border-left: 1px solid black;\">\n              <p>نام </p>\n              <p class=\"mt-4 text-bold-700\" style=\"font-size: 16px;\">\n                {{triazhInfo['item']['firstName']}}\n            </p>\n              <p> Name</p>\n            </div>\n            <div class=\"col-3 d-flex justify-content-between \" style=\"border-left: 1px solid black;\">\n                <div style=\"text-align: right;\">\n                  <p>جنس</p>\n                  <div>\n                      <label for=\"\"  style=\"font-size: 14px;\">مذکر</label>\n                      <input  *ngIf=\"triazhInfo['item']['gender']==0\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                      <input *ngIf=\"triazhInfo['item']['gender'] !=0\" type=\"checkbox\" ng-disabled=\"true\"  />\n                      <span>F</span>\n                      <input type=\"checkbox\" >\n                      <label for=\"\" style=\"margin-right: 30px;font-size: 14px;\">مونث</label>\n                      <input *ngIf=\"triazhInfo['item']['gender']==1\" type=\"checkbox\"  checked />\n\n                      <input *ngIf=\"triazhInfo['item']['gender'] !=1\" type=\"checkbox\"   />\n                      <span>M</span>\n                  </div>\n                </div>\n              \n              <div>\n                  <p>Sex</p>\n              </div>\n            </div>\n            <div class=\"col-3 \">\n              <div class=\"d-flex justify-content-between\">\n                  <p>تاریخ مراجعه</p>\n\n                  <p>Date of Arrival</p>\n              </div>\n              <div class=\"d-flex justify-content-between\">\n                  <p>ساعت مراجعه</p>\n                  <p style=\"font-size: 14px;\">{{triazhInfo['item']['entranceTime']}}</p>\n                  <p>Time of Arrival</p>\n              </div>\n            </div>\n  \n        </div>\n        <div class=\"col-12 d-flex justify-content-between \" style=\"border-top: 1px solid black;\">\n          <div class=\"col-6 d-flex justify-content-between\">\n              <div class=\"col-6 \" style=\"border-left: 1px solid black;\">\n                  <div class=\"d-flex justify-content-between\">\n                      <p>کد ملی </p>\n                      <p class=\"text-center text-bold-700\" style=\"font-size: 14px;padding: 0;\">\n                          {{triazhInfo['item']['nationalCode']}}\n                      </p>\n                      <p>National Code</p>\n                  </div>\n\n\n\n              </div>\n              <div class=\"col-6 d-flex justify-content-between\" style=\"border-left: 1px solid black;\">\n                  <p>تاریخ تولد  </p>\n          <p style=\"font-size: 14px;\">\n            {{triazhInfo['item']['birthDate']}}\n          </p>\n          <p>Date of Birth </p>\n              </div>\n          </div>\n          <div class=\"col-6 d-flex justify-content-between\">\n              <div>\n                  <p>باردار</p>   \n              </div>\n              <div>\n                  <label for=\"\">بلی </label>\n                  <input *ngIf=\"triazhInfo['item']['pregnant']==1\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                  <input *ngIf=\"triazhInfo['item']['pregnant'] !=1\" type=\"checkbox\" ng-disabled=\"true\"  />                  <span>yes</span>\n              </div>\n              <div>\n                  <label for=\"\">خیر </label>\n                  <input *ngIf=\"triazhInfo['item']['pregnant']==0\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                  <input *ngIf=\"triazhInfo['item']['pregnant'] !=0\" type=\"checkbox\" ng-disabled=\"true\"  />                    <span>No</span>\n              </div>\n              <div>\n                  <label for=\"\">نامعلوم </label>\n                  <input *ngIf=\"triazhInfo['item']['pregnant']==2\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n                  <input *ngIf=\"triazhInfo['item']['pregnant'] !=2\" type=\"checkbox\" ng-disabled=\"true\"  /><small>unknown</small>\n              </div>\n              <div>\n  <p>Pregnant</p>               \n              </div>\n  \n  \n          </div>\n  \n        </div>\n  \n  \n             \n          </div>\n</div>\n<div class=\"container\">\n    <div class=\"row col-12 br d-flex justify-content-around\" style=\"direction: rtl;padding: 0;border-top: none\">\n        <div class=\"col-12 mt-1 d-flex justify-content-between\" style=\"text-align: right;\">\n        <h6>نحوه مراجعه</h6>\n        <h6>:Arrival Mode </h6>\n        </div>\n        <div class=\"col-12 mt-1 \" style=\"text-align: right;\">\n            <span>آمبولانس 115</span>\n            <input *ngIf=\"triazhInfo['item']['arrival_Transport']==2\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n            <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=2\" type=\"checkbox\" ng-disabled=\"true\"  />              <span>EMS </span>\n            <span style=\"margin-right: 30px;\">آمبولانس خصوصی</span>\n            <input *ngIf=\"triazhInfo['item']['arrival_Transport']==5\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n            <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=5\" type=\"checkbox\" ng-disabled=\"true\"  />              <span>Private Ambulance  </span>\n            <span style=\"margin-right: 30px;\"> شخصی</span>\n            <input *ngIf=\"triazhInfo['item']['arrival_Transport']==4\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n            <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=4\" type=\"checkbox\" ng-disabled=\"true\"  />               <span>By Her Own </span>\n            <span style=\"margin-right: 30px;\">امداد هوایی </span>\n            <input *ngIf=\"triazhInfo['item']['arrival_Transport']==6\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n            <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=6\" type=\"checkbox\" ng-disabled=\"true\"  />             <span>Air Ambulance   </span>\n            <span style=\"margin-right: 30px;\"> سایر</span>\n            <input *ngIf=\"triazhInfo['item']['arrival_Transport']==8\" type=\"checkbox\" ng-disabled=\"true\" checked />\n\n            <input *ngIf=\"triazhInfo['item']['arrival_Transport'] !=8\" type=\"checkbox\" ng-disabled=\"true\"  />             <span>Other   </span>\n        </div>\n        <div class=\"col-12 d-flex justify-content-between \" style=\"text-align: right;border-top: 1px solid black;padding: 0\">\n            <div class=\"col-4 mt-1\" style=\"padding: 0\">\n                <p>مراجعه بیمار در 24 ساعت گذشته</p>\n            </div>\n            <div class=\"col-4 d-flex mt-1\" style=\"text-align: right;direction: rtl;padding: 0\">\n                <div class=\"col-4\" style=\"padding: 0\" >\n                    <span>همین بیمارستان</span>\n                    <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems']==0\" type=\"checkbox\"  checked />\n\n                    <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems'] !=0\" type=\"checkbox\"   />\n                </div>\n                <div class=\"col-4\" style=\"padding: 0\">\n                    <span>بیمارستان دیگر </span>\n                    <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems']==1\" type=\"checkbox\"  checked />\n\n                    <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems'] !=1\" type=\"checkbox\"   />\n                </div>\n                <div class=\"col-4\" style=\"padding: 0\">\n                    <span>خیر</span>\n                    <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems']==2\" type=\"checkbox\"  checked />\n\n                    <input *ngIf=\"triazhInfo['item']['encounter24HoursAgoItems'] !=2\" type=\"checkbox\"   />                </div>\n            </div>\n            <div class=\"col-4 \" style=\"text-align: left \"style=\"padding: 0\">\n                <p>  :Patient Presence in ED in 24 Past Hours   </p>\n            </div>\n            \n        </div>\n        <div class=\"col-12 d-flex justify-content-between\"  style=\"text-align: right;padding: 0\">\n            <div class=\"col-4\" style=\"padding: 0\"></div>\n            <div class=\"col-4 d-flex \">\n                <div class=\"col-4\" style=\"padding: 0\">\n                    <span> This Hospital</span>\n                </div>\n                <div class=\"col-4\" style=\"padding: 0\">\n                    <span>\n                        Other Hospital\n                    </span>\n                </div>\n                <div class=\"col-4\" style=\"padding: 0\">\n                    <span>No</span>\n                </div>\n    \n            </div>\n            <div class=\"col-4\" style=\"padding: 0\"></div>\n        </div>\n        \n    </div>\n</div>\n<div class=\"container\">\n\n    <div class=\"row col-12 br d-flex justify-content-around\" style=\"direction: rtl;border-top: none\">\n\n        <div class=\"col-12  d-flex justify-content-between \" style=\"text-align: right;\">\n            <div class=\"d-flex\">\n                <h5 class=\"font-weight-bold\"> شکایت  اصلی بیمار :</h5>\n                <span *ngIf=\"triazhInfo['item']['triage_MainDisease']\">\n                    <span *ngFor=\"let i of triazhInfo['item']['triage_MainDisease'] \">\n                        <span *ngFor=\"let a of MainDiseaseList\">\n                            <span class=\"font-weight-bold\" *ngIf=\"i.mainDiseaseID==a.id\">{{a.mainDiseaseValue}}</span>\n                        </span>\n                         <span *ngIf=\"triazhInfo['item']['triageOtherCasesMainDisease']\">\n\n\n                </span>\n\n                    </span>\n                        <span class=\"font-weight-bold\"  *ngFor=\"let i of triazhInfo['item']['triageOtherCasesMainDisease'] \">\n                            {{i.description}}\n                        </span>\n                </span>\n\n\n\n            </div>\n            <div>\n                <span>Chief Complaint\n                </span>\n            </div>\n        </div>\n        <div class=\"col-12  \" style=\"text-align: right;flex-wrap: nowrap;\">\n            <div class=\"d-flex justify-content-between\" style=\"padding: 0\" >\n                <div class=\"col-2\" style=\"padding: 0;\" >\n                    <p class=\"font-weight-bold\" > <span>سابقه حساسیت دارویی و غذایی: </span>     </p>\n                </div>\n                <div class=\"col-6 \" style=\"padding: 0\" *ngIf=\"triazhInfo['item']['triageAllergyDrugs'][0]!=null || triazhInfo['item']['triageFoodSensitivity'][0]!=null\">\n\n                    <div class=\"d-flex\">\n                        <div class=\"\" style=\"padding: 0\" *ngFor=\"let i of aleryDrugFinaly\">\n                            <span>{{i}},</span>\n\n                        </div>\n                    </div>\n                    <div class=\"col-12 \" style=\"padding: 0\">\n                        <div class=\"d-flex\" style=\"padding: 0\" *ngIf=\"triazhInfo['item']['triageFoodSensitivity']\">\n                            <div class=\"d-flex\" *ngFor=\"let a of triazhInfo['item']['triageFoodSensitivity'] \">\n                                <div  class=\"\" *ngFor=\"let i of foodLIst\"  style=\"text-align: right;margin-right: 5px;\">\n                                    <span  *ngIf=\"a.foodSensitivityValue==i.Key\">{{i.Value}}</span>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n            </div>\n\n            <div class=\" \"  style=\"padding:0;text-align: left;direction: ltr \">\n                    <p style=\"font-size: 12px\" >History of Drug and Food Allergy</p>\n            </div>\n        </div>\n\n    </div>\n</div>\n</div>\n\n   \n\n<div class=\"container\">\n    <div class=\"col-12 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">\n        <div >\n              <p> بیماران سطح 1 (شرایط تهدید کننده حیات )</p>\n        </div>\n        <div class=\"\" >\n            <span>..............................................</span>\n        </div>\n        <div >\n\n            <p>\n                Triage level 1 (Life threatening situation)\n            </p>\n      </div>\n    </div>\n</div>\n<div class=\"container\">\n    <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n        <div class=\"col-12 d-flex justify-content-between\">\n            <div>\n                <span>\n                    سطح هوشیاری بیمار:\n\n                </span>\n            </div>\n            <div  style=\"text-align: right;direction: rtl;\">\n                <span >\n                    بدون پاسخ\n                </span>\n                <input style=\"margin-top: 5px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS']==4\" type=\"checkbox\"  checked />\n\n                <input style=\"margin-top: 5px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS'] !=4\" type=\"checkbox\"   />              </div>\n            <div>\n                <span>\n                    پاسخ به محرک دردناک\n               </span>\n                <input style=\"margin-top: 5px\"  *ngIf=\"triazhInfo['item']['stateOfAlertIS']==3\" type=\"checkbox\"  checked />\n\n                <input style=\"margin-top: 5px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS'] !=3\" type=\"checkbox\"   />               </div>\n            <div>\n                <span>\n                    پاسخ به محرک کلامی\n                </span>\n                <input style=\"margin-top: 5px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS']==2\" type=\"checkbox\"  checked />\n\n                <input style=\"margin-top: 5px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS'] !=2\" type=\"checkbox\"   />               </div>\n            <div>\n                <span>\n                    هوشیار\n               </span>\n                <input style=\"margin-top: 5px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS']==1\" type=\"checkbox\"  checked />\n\n                <input style=\"margin-top: 5px\" *ngIf=\"triazhInfo['item']['stateOfAlertIS'] !=1\" type=\"checkbox\"   />\n            </div>\n            \n        </div>\n        <div class=\"col-12 d-flex justify-content-between\">\n            <div>\n                <span>\n                    سیستم:(AVPU)\n                </span>\n                \n            </div>\n            <div>\n                <span>\n                  (  Unresponsive (U\n                 </span>\n            </div>\n            <div>\n                <span>\n                  (  Response to Pain Stimulus(P\n                 </span>\n            </div>\n            <div>\n                <span>\n                 (   Response to Verbal Stimulus(V\n                 </span>\n            </div>\n            <div>\n                <span>\n                 (   Alert (A\n         \n                 </span>\n            </div>\n        </div>\n        <div class=\"col-12 d-flex justify-content-between\" style=\"border-top: 1px solid black;\">\n            <div style=\"border-left: 1px solid black;text-align: right;\">\n                <label for=\"\">مخاطره راه هوایی</label>\n                <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['dangerousRespire']==='True'\" type=\"checkbox\"  checked />\n\n                <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['dangerousRespire'] !='False'\" type=\"checkbox\"   />\n                <p>\n                    Airway compromise\n                </p>\n            </div>\n            <div style=\"border-left: 1px solid black;text-align: right;\">\n                <label for=\"\"> دیسترس شدید تنفسی </label>\n                <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['respireDistress']==='True'\" type=\"checkbox\"  checked />\n\n                <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['respireDistress'] !='False'\" type=\"checkbox\"   />                <p>\n                    Sever Respiratory Distress          \n                          </p>\n            </div>\n            <div style=\"border-left: 1px solid black;text-align: right;\">\n                <label for=\"\">  سیانوز</label>\n                <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['sianosis']==='True'\" type=\"checkbox\"  checked />\n\n                <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['sianosis'] !='False'\" type=\"checkbox\"   />                   <p>\n                    Cyanosis\n                </p>\n            </div>\n            <div style=\"border-left: 1px solid black;text-align: right;\">\n                <label for=\"\">  علایم شوک</label>\n                <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['shock']==='True'\" type=\"checkbox\"  checked />\n\n                <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['shock'] !='False'\" type=\"checkbox\"   />\n                <p>\n                    Signs of Shock\n                </p>\n            </div>\n            <div>\n                <label for=\"\"> اشباع اکسیژن کمتر از 90 درصد </label>\n                <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['spo2LowerThan90']==='True'\" type=\"checkbox\"  checked />\n\n                <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['spo2LowerThan90'] !='False'\" type=\"checkbox\"   />\n                <p>\n                    SpO2 < 90\n                </p>\n            </div>\n            \n        </div>\n\n</div>\n</div>\n<div class=\"container\">\n    <div class=\"col-12 mt-1 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">\n        <div class=\"\">  \n              <p> بیماران سطح 2 </p>\n        </div>\n        <div class=\"p0\" ><span>..............................................................................................................................</span></div>\n        <div class=\"p0\">  \n            <p>\n                Triage level 2 \n            </p>\n      </div>\n    </div>\n</div>\n<div class=\"container\">\n    <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n  \n        <div class=\"col-12 d-flex justify-content-between\" >\n            <div class=\"col-3 text-center\" style=\"border-left: 1px solid black;\">\n                <label for=\"\">شرایط پر خطر   </label>\n                <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['highDanger']==='True'\" type=\"checkbox\"  checked />\n\n                <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['highDanger'] ==='False'\" type=\"checkbox\"   />                <p>\n                    High Risk Conditions           \n                     </p>\n            </div>\n            <div class=\"col-4 text-center\" style=\"border-left: 1px solid black;padding: 0\">\n                <label for=\"\"> \n                    لتارژی خواب آلودگی اختلال جهت یابی \n                \n                </label>\n                <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['lethargy']==='True'\" type=\"checkbox\"  checked />\n\n                <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['lethargy'] =='False'\" type=\"checkbox\"   />\n                <p style=\"\">\n                    \n                    lethargy/ confusion/ disorientation\n                          </p>\n            </div>\n            <div class=\"col-3 text-center\" style=\"border-left: 1px solid black;\">\n                <label for=\"\">  دیسترس  شدید روان </label>\n                <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['highDistress']==='True'\" type=\"checkbox\"  checked />\n\n                <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['highDistress'] ==='False'\" type=\"checkbox\"   />\n                <p>\n                    Sever psychiatric Distress\n                                </p>\n            </div>\n            <div class=\"d-flex col-2 justify-content-between\">\n                <div style=\"margin-top: 10px\">\n                    <span for=\"\">   درد شدید</span>\n                    <p>\n                        Sever Pain\n\n                    </p>\n                </div>\n                <div  style=\"margin-top: 10px;position: relative;margin-left: 10px\" >\n                    <div style=\"padding: 0\">   {{painPrint}}</div>\n                    <div class=\"text-bold-700\" style=\"border-bottom: 1px solid;position: static \"></div>\n                    <div style=\"position: static\" >10</div>\n                </div>\n\n\n\n\n\n            </div>\n        </div>\n        <div class=\"col-12 d-flex \" style=\"border-top: 1px solid;\">\n            <div class=\"col-6 d-flex justify-content-between \">\n                <p>سابقه پزشکی </p>\n                <span>\n                    {{triazhInfo['item']['medicalHistory']}}\n\n                </span>\n                <p>\n                     Medical history \n                     </p>\n            </div>\n            <div class=\"col-6 d-flex justify-content-between \">\n                <p>سابقه دارویی </p>\n                <!--<div *ngIf=\"triazhInfo['item']['triageDrugHistory']\">-->\n                    <!--<div *ngFor=\"let a of drugCodeArray \">-->\n                        <!--<div *ngIf=\"AllergyDrugListSepas\">-->\n                           <!--<div *ngFor=\"let i of AllergyDrugListSepas['items']\">-->\n                               <!--<span *ngIf=\"i.code==a\">{{i.value}}</span>-->\n                           <!--</div>-->\n                        <!--</div>-->\n                   <!--</div>-->\n                <!--</div>-->\n                <div *ngFor=\"let i of drugListFinalArray\">\n\n                    <span>{{i}}</span>\n                </div>\n            \n                <!-- <span>\n                    {{triazhInfo['item']['drugHistory']}}\n\n                </span> -->\n                <p>\n                    Drug history \n                     </p>\n            </div>\n        </div>\n        <div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid;\">\n                <p class=\"font-weight-bold\">علایم حیاتی  </p>\n                <p class=\"font-weight-bold\">:sign Vital </p>\n        </div>\n        <div class=\"col-12 d-flex justify-content-between\" style=\"flex-wrap: nowrap;\">\n            <div class=\"\">\n                <span> فشارخون  :</span>\n                 <span>                  \n                         {{bp}}\n                </span>  \n                 <span>BP <small>mmHg</small></span> \n            </div>\n            <div  class=\"\">\n                <span> تعداد ضربان </span>\n                 <span>   {{pr}} </span>\n                 <span>PR/min</span> \n            </div>\n            <div  class=\"\">\n                <span>تنفس </span>\n                 <span>   {{rr}}    </span>\n                 <span>RR/min</span> \n            </div>\n            <div class=\"\">\n                <span>دمای بدن </span>\n                 <span>  {{t}}   </span>\n                 <span>T</span> \n            </div>\n            <div  class=\"\">\n                <span>درصد اشباع اکسیژن  </span>\n                 <span>  {{spo2}}   </span>\n                 <span>Spo2%</span> \n            </div>\n        </div>\n</div>\n</div>\n<div class=\"container\">\n    <div class=\"col-12\" style=\"padding-top: 0;padding-bottom: 0;direction: rtl;text-align: right;\">\n        <p style=\"padding: 0\"> *ثبت عاليم حیاتي برای بیماران سطح 2 با تشخیص پرستار ترياژ و به شرط عدم تاخیر در رسیدگي به بیماران با شرايط پر خطر</p>\n    </div>\n    <div class=\"col-12 d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;padding-top: 0;padding-bottom: 0\">\n        <div class=\"\">  \n              <p> بیماران سطح 3 </p>\n        </div>\n        <div class=\"p0\" ><span>..............................................................................................................................</span></div>\n        <div class=\"p0\">  \n            <p>\n                Triage level 3\n            </p>\n      </div>\n    </div>\n</div>\n<div class=\"container\">\n\n    <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n        <div class=\"col-12 d-flex \">\n            <div class=\"col-6 d-flex justify-content-between \">\n                <p> تعداد تسهیلات مورد نظر در بخش اورژانس </p>\n                <p>\n                      دو مورد بیشتر\n                    <input style=\"margin-top: 7px\" style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['serviceCountIS']==3\" type=\"checkbox\"  checked />\n\n                    <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['serviceCountIS'] !=3\" type=\"checkbox\"   />\n                     </p>\n            </div>\n            <div class=\"col-6 d-flex justify-content-between \">\n                <p> TWO & More </p>\n                <p>\n                    :Number of Required Resources in ED \n                     </p>\n            </div>\n        </div>\n        <div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid;\">\n                <p class=\"font-weight-bold\">علایم حیاتی  </p>\n                <p class=\"font-weight-bold\">:sign Vital </p>\n        </div>\n        <div class=\"col-12 d-flex justify-content-between\" style=\"flex-wrap: nowrap;\">\n            <div class=\"\">\n                <span>:فشارخون</span>\n                 <span>  {{bp}}   </span>\n                 <span>BP <small>mmHg</small></span> \n            </div>\n            <div  class=\"\">\n                <span>تعداد ضربان</span>\n                 <span>  {{pr}}    </span>\n                 <span>PR/min</span> \n            </div>\n            <div  class=\"\">\n                <span>:تنفس</span>\n                 <span>  {{rr}}   </span>\n                 <span>RR/min</span> \n            </div>\n            <div class=\"\">\n                <span>:دمای بدن</span>\n                 <span>  {{t}}   </span>\n                 <span>T</span> \n            </div>\n            <div  class=\"\">\n                <span>:درصد اشباع اکسیژن </span>\n                 <span>  {{spo2}}   </span>\n                 <span>Spo2%</span> \n            </div>\n        </div>\n    </div>\n</div>\n<div class=\"container\">\n    <div class=\"col-12  d-flex  justify-content-between\" style=\"direction: rtl;text-align: right;\">\n        <div class=\"\">  \n              <p> بیماران سطح 4 و 5 </p>\n        </div>\n        <div class=\"p0\" ><span>..............................................................................................................................</span></div>\n        <div class=\"p0\">  \n            <p>\n                Triage level 4&5\n            </p>\n      </div>\n    </div>\n</div>\n<div class=\"container\">\n    <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;\">\n        <div class=\"col-12 d-flex \">\n            <div class=\"col-6 d-flex justify-content-between \">\n                <p> تعداد تسهیلات مورد نظر در بخش اورژانس </p>\n                <p>\n                       یک مورد\n                    <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['serviceCountIS']==2\" type=\"checkbox\"  checked />\n\n                    <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['serviceCountIS'] !=2\" type=\"checkbox\"   />                     </p>\n                     <p>One item</p>\n            </div>\n            <div class=\"col-6 d-flex justify-content-between \">\n                <p> هیچ</p>\n                <p>\n                       None\n                    <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['serviceCountIS']==1\" type=\"checkbox\"  checked />\n\n                    <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['serviceCountIS'] !=1\" type=\"checkbox\"   />\n                     </p>\n                     <p>: ED in Resources Required of Number</p>\n            </div>\n        </div>\n       \n    </div>\n</div>\n<div class=\"container\" >\n    <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n        <div class=\"col-12 d-flex justify-content-between \">\n                <p> سطح تریاژ بیمار        </p>\n                <p>\n                      5\n                    <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['triageLevelIS']==5\" type=\"checkbox\"  checked />\n\n                    <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['triageLevelIS'] !=5\" type=\"checkbox\"   />                     </p>\n                     <p>\n                        4\n                         <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['triageLevelIS']==4\" type=\"checkbox\"  checked />\n\n                         <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['triageLevelIS'] !=4\" type=\"checkbox\"   />\n                     </p>\n                       <p>\n                        3\n                           <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['triageLevelIS']==3\" type=\"checkbox\"  checked />\n\n                           <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['triageLevelIS'] !=3\" type=\"checkbox\"   />\n                       </p>\n                       <p>\n                        2\n                           <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['triageLevelIS']==2\" type=\"checkbox\"  checked />\n\n                           <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['triageLevelIS'] !=2\" type=\"checkbox\"   />\n                       </p>\n                       <p>\n                        1\n                           <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['triageLevelIS']==1\" type=\"checkbox\"  checked />\n\n                           <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['triageLevelIS'] !=1\" type=\"checkbox\"   />\n                       </p>\n                       <p>\n                        Patient Triage level: \n                       </p>\n            \n         \n        </div>\n        <div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid;\">\n                <p class=\"font-weight-bold\">جداسازی بیمار و احتیاطات بیشتر کنترل عفونت   </p>\n                <p class=\"font-weight-bold\">تماسی\n                    <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['separationByInfection']==0\" type=\"checkbox\"  checked />\n\n                    <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['separationByInfection'] !=0\" type=\"checkbox\"   />                </p>\n                <p class=\"font-weight-bold\">قطره ای\n                    <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['separationByInfection']==1\" type=\"checkbox\"  checked />\n\n                    <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['separationByInfection'] !=1\" type=\"checkbox\"   />\n                </p>\n                    <p class=\"font-weight-bold\">تنفسی\n                        <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['separationByInfection']==2\" type=\"checkbox\"  checked />\n\n                        <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['separationByInfection'] !=2\" type=\"checkbox\"   />\n                    </p>\n                        <p class=\"font-weight-bold\">نیاز ندارد\n                            <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['separationByInfection']==3\" type=\"checkbox\"  checked />\n\n                            <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['separationByInfection'] !=3\" type=\"checkbox\"   />\n                            </p>\n        </div>\n    \n        <div class=\"col-12 d-flex d-flex justify-content-between \">\n                <p class=\"font-weight-bold\">Patient Isolation and More Infection Control Precautions       </p>\n                <p class=\"font-weight-bold\">Contact \n                </p>\n                <p class=\"font-weight-bold\">Droplet \n                    </p>\n                    <p class=\"font-weight-bold\">Airborne \n                        </p>\n                        <p class=\"font-weight-bold\">No Need to Isolation  \n                            </p>\n        </div>\n        <div class=\"col-12 d-flex d-flex justify-content-between \" style=\"border-top: 1px solid black;\">\n            <div>  \n                      <p class=\"font-weight-bold\">ارجاع به</p>\n            </div>\n            <div>\n                    <label for=\"\">سرپایی</label>\n                <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['departure']==3\" type=\"checkbox\"  checked />\n\n                <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['departure'] !=3\" type=\"checkbox\"   />\n                    <span>Fast track</span>\n            </div>\n            <div>\n                <label for=\"\">احیا</label>\n                <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['departure']==4\" type=\"checkbox\"  checked />\n\n                <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['departure'] !=4\" type=\"checkbox\"   />\n                <span> CPR</span>\n            </div>\n            <div>\n                <label for=\"\">فضای بستری</label>\n                <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['departure']==1\" type=\"checkbox\"  checked />\n\n                <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['departure'] !=1\" type=\"checkbox\"   />\n                <span>Inpatient Area </span>\n            </div>\n            <div>\n                <label for=\"\">سایر...</label>\n                <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['departure']==8\" type=\"checkbox\"  checked />\n\n                <input style=\"margin-top: 7px\" *ngIf=\"triazhInfo['item']['departure'] !=8\" type=\"checkbox\"   />\n                <span>Other </span>\n            </div>\n    \n            <div>  \n                <p class=\"font-weight-bold\">  :Refer to </p>\n      </div>\n            \n    </div>\n    <div class=\"col-12 d-flex justify-content-between\" style=\"border-top: 1px solid black;\">\n        <div class=\"col-6 d-flex\">\n            <p>ساعت و تاریخ ارجاع</p>\n            <span>\n                {{triazhInfo['item']['exitTime']}}\n            </span>\n        </div>\n        <div class=\"col-6 d-flex\">\n            <p > نام و نام خانوادگی مهر و امضای پرستار تریاژ:  </p>\n            <span *ngIf=\"pracInfo['item']\">{{pracInfo['item']['firstName']}}</span> <span class=\"mx-1\" *ngIf=\"pracInfo['item']\">{{pracInfo['item']['lastName']}}</span>\n        </div>\n    </div>\n    <div class=\"col-12 d-flex justify-content-between\" >\n        <div class=\"col-6 d-flex\">\n            <p> Date & Time of Referral:  </p>\n            <span></span>\n        </div>\n        <div class=\"col-6 d-flex\">\n            <p>  Triage Nurse’s Name/Signature/Stamp     </p>\n            <span>.........</span>\n        </div>\n    </div>\n    <div class=\"col-12 d-flex justify-content-between\" style=\"border-top: 1px solid black;\">\n    <p>توضیحات\n        <span>......</span>\n    </p>\n    <p>\n        <span>\n            .......\n        </span>\n        Description\n        \n    </p>\n    </div>\n    </div>\n    <div class=\"col-12 d-flex justify-content-between\" >\n        <p>این صفحه فرم صرفا توسط پرستار ترياژ تكمیل مي گردد</p>\n\n               <p>IR.MOHHIM-E01-2.0-9910</p>\n\n\n\n    </div>\n</div>\n<br>\n<!-- page2 -->\n<div class=\"container\" style=\"margin-top: 20px;\">\n    <div class=\"row col-12 br mt-2 d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n        <div class=\"col-12 d-flex justify-content-between\">\n            <p>\n                    شرح حال و دستورات پزشک \n            </p>\n            <p>\n            :Medical history & Physician Orders\n        </p>\n        </div>\n        <div class=\"col-12\">\n            <br>\n            <br>\n            <br>\n            <br>\n            <br>\n            <br>\n            <br>\n            <br>\n            <p style=\"text-align: right;\">{{triazhInfo['item']['practitionerComment']}}</p>\n        </div>\n        \n            <div class=\"col-12\">\n                <div class=\"d-flex justify-content-between roundBorder   \">\n                    <p>تشخیص...</p>\n                    <p>\n                        ....  Diagnosis\n                    </p>\n                </div>\n            </div>\n            <div class=\"col-12 d-flex justify-content-between\">\n                <div class=\"col-6 d-flex justify-content-between \">\n                    <p>تاریخ و ساعت ویزیت </p>\n                    <p> ........   </p>\n                    <p>Date & Time Of Visit</p>\n\n                </div>\n                <div class=\"col-6 d-flex justify-content-between \" style=\"flex-wrap: nowrap;\">\n                    <p style=\"font-size: 10px;\"> نام و نام خانوادگی مهر و امضای پزشک   </p>\n                    <p> ...   </p>\n                    <p style=\"font-size: 10px;\">Physician's Name/Signature/Stamp</p>\n                </div>\n\n            </div>\n    </div>\n</div>\n<div class=\"container\">\n    <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n        <div class=\"col-12 d-flex justify-content-between\">\n            <p>\n                      گزارش پرستاری:   \n            </p>\n            <p>\n            :  Nursing Report\n        </p>\n        </div>\n\n        <div class=\"col-12\" style=\"direction: rtl;text-align: right\">\n            <P style=\"direction: rtl\">\n\n\n                بیمار با نام     <span>{{triazhInfo['item']['firstName']}}</span> و نام خانوادگی<span>{{triazhInfo['item']['lastName']}}</span>  با سطح تریاژ<span>{{triazhInfo['item']['triageLevelIS']}}</span> و با شکایت اصلی              <span>{{mainDesaseValue}}</span><span *ngFor=\"let i of otherMAin\">{{i}},</span>        با وسیله     <span>{{transporterValue}}</span><span *ngIf=\"aleryDrugFinaly.length>0\" > و حساسیت دارویی</span>  <span *ngFor=\"let i of aleryDrugFinaly \">{{i}},</span> <span *ngIf=\"foodAllerguValue.length>0\" >و حساسیت غذایی</span>   <span *ngFor=\"let i of foodAllerguValue\">{{i}}</span> در ساعت <span>{{Time}}</span>\n\n\n\n\n\n                             به اورژانس منتقل شد.\n            </P>\n            <br>\n            <br>\n            <br>\n            <br>\n            <br>\n            <br>  \n            <br>\n            <br>\n            <br>\n            <br>\n            <br>\n            <br>\n\n        </div>\n            <div class=\"col-12 d-flex justify-content-between\">\n                <div class=\"col-6 d-flex justify-content-between \">\n                    <p>تاریخ و ساعت گزارش </p>\n                    <p> ........   </p>\n                    <p> Report Date & Time:</p>\n\n                </div>\n                <div class=\"col-6 d-flex justify-content-between \" style=\"flex-wrap: nowrap;\">\n                    <p style=\"font-size: 10px;\"> نام و نام خانوادگی مهر و امضای پرستار   </p>\n                    <p *ngIf=\"pracInfo['item']\">{{pracInfo['item']['firstName']}}  {{pracInfo['item']['lastName']}}    </p>\n                    <p style=\"font-size: 10px;\">Nurse's Name/Signature/Stamp</p>\n                </div>\n\n            </div>\n    </div>\n</div>\n<div class=\"container\">\n    <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n        <div class=\"col-12  \" style=\"text-align: right;\">\n            <p>\n                      وضعیت نهایی بیمار :   \n            </p>\n       \n        </div>\n        <div class=\"col-12 d-flex\" style=\"direction: rtl;text-align: right;\">\n            <div class=\"col-6\">\n                <p>بیمار در تاریخ<span>........</span> و ساعت <span>.......</span></p>\n            </div>\n            <div class=\"col-6\">\n                <div>\n                    <input type=\"checkbox\" name=\"\" id=\"\">\n                    <label for=\"\">مرخص گردید</label>\n                  \n                </div>\n           \n                <div>\n                    <input type=\"checkbox\" name=\"\" id=\"\">\n                    <label for=\"\">در بخش .......... بستری گردید </label>\n                </div>\n                <div>\n                    <input type=\"checkbox\" name=\"\" id=\"\">\n                    <label for=\"\">به درمانگاه  .......... ارجاع شد </label>\n                </div>\n                <div>\n                    <input type=\"checkbox\" name=\"\" id=\"\">\n                    <label for=\"\">به بیمارستان  .......... اعزام گردید </label>\n                </div>\n\n            </div>\n        </div>\n  \n        \n    \n    </div>\n</div>\n<div class=\"container\">\n    <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n        <div class=\"col-12  \" style=\"text-align: center;\">\n            <p>\n                      اجازه معالجه و عمل جراحی (بجز ویزیت)      \n            </p>\n       \n        </div>\n        <div class=\"col-12 \" style=\"direction: rtl;text-align: right; font-size: 14px;\">\n        <p>\n            اینجانب ............. بیمار/ساکن........................... اجازه میدهم پزشک یا پزشکان بیمارستان ........................................\n            هرنوع معالجه و در صورت لزوم عمل جراحی یا انتقال خون که صلاح بداند در مورد اینجانب/بیمار اینجانب به مورد اجرا گذراند و بدینوسیله برایت پزشکان و \n            کارکنان این بیمارستان را از کلیه عوارض احتمالی اقدامات فوق که در مورد اینجانب/بیمار اینجانب انجام دهند اعلام میدارم.\n        </p>\n        </div>\n        <div class=\"col-12\" style=\"direction: rtl; text-align: right;\">\n            <p>\n                نام و امضای بیمار/همراه بیمار..........\n            </p>\n        </div>\n        <div class=\"col-12\" style=\"direction: rtl; text-align: right;\">\n            <p>\n                نام شاهد1............  تاریخ........ امضا.........\n            </p>\n            <p>\n                نام شاهد2............  تاریخ........ امضا.........\n            </p>\n\n        </div>\n    </div>\n    \n</div>\n<div class=\"container\">\n    <div class=\"row col-12 br d-flex justify-content-between\" style=\"direction: rtl;padding: 0;\">\n        <div class=\"col-12  \" style=\"text-align: center;\">\n            <p>\n                ترخیص با میل شخصی\n            </p>\n       \n        </div>\n        <div class=\"col-12 \" style=\"direction: rtl;text-align: right;font-size: 14px;\">\n     <p>\n         اینجانب .................. با میل شخصی خود بر خلاف صلاحدید و توصیه پزشکان مسئول بیمارستان .........................؛این مرکز را با در نظر داشتن عواقب \n         و خطرات احتمالی ترک می نمایم و اعلام میدارم که هیچ مسئولیتی متوجه مسئولان پزشکان و کارکنان این مرکز نخواهد بود.\n     </p>\n        </div>\n        <div class=\"col-12  d-flex justify-content-between \" style=\"direction: rtl; text-align: right;\">\n            <p>\n                نام و امضای بیمار/همراه بیمار..........\n            </p>\n            <p>\nنام و امضای یکی از بستگان درجه اول بیمار...........\n            </p>\n        </div>\n        <div class=\"col-12\" style=\"direction: rtl; text-align: right;\">\n            <p>\n                نام شاهد1............  تاریخ........ امضا.........\n            </p>\n            <p>\n                نام شاهد2............  تاریخ........ امضا.........\n            </p>\n\n        </div>\n    </div>\n\n</div>\n</div>\n\n"

/***/ }),

/***/ "./src/app/Imaindesease.ts":
/*!*********************************!*\
  !*** ./src/app/Imaindesease.ts ***!
  \*********************************/
/*! exports provided: Imaindesease */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Imaindesease", function() { return Imaindesease; });
var Imaindesease = /** @class */ (function () {
    function Imaindesease() {
    }
    return Imaindesease;
}());



/***/ }),

/***/ "./src/app/anyfile.ts":
/*!****************************!*\
  !*** ./src/app/anyfile.ts ***!
  \****************************/
/*! exports provided: custom */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "custom", function() { return custom; });
var custom = /** @class */ (function () {
    function custom() {
    }
    return custom;
}());



/***/ }),

/***/ "./src/app/drugHistory.ts":
/*!********************************!*\
  !*** ./src/app/drugHistory.ts ***!
  \********************************/
/*! exports provided: drugHistroy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "drugHistroy", function() { return drugHistroy; });
var drugHistroy = /** @class */ (function () {
    function drugHistroy() {
    }
    return drugHistroy;
}());



/***/ }),

/***/ "./src/app/drugTable.ts":
/*!******************************!*\
  !*** ./src/app/drugTable.ts ***!
  \******************************/
/*! exports provided: drugTable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "drugTable", function() { return drugTable; });
var drugTable = /** @class */ (function () {
    function drugTable() {
    }
    return drugTable;
}());



/***/ }),

/***/ "./src/app/dugAllergy.ts":
/*!*******************************!*\
  !*** ./src/app/dugAllergy.ts ***!
  \*******************************/
/*! exports provided: drugAllergy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "drugAllergy", function() { return drugAllergy; });
var drugAllergy = /** @class */ (function () {
    function drugAllergy() {
    }
    return drugAllergy;
}());



/***/ }),

/***/ "./src/app/eOtherCasesMainDisease.ts":
/*!*******************************************!*\
  !*** ./src/app/eOtherCasesMainDisease.ts ***!
  \*******************************************/
/*! exports provided: eOtherCasesMainDisease */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "eOtherCasesMainDisease", function() { return eOtherCasesMainDisease; });
var eOtherCasesMainDisease = /** @class */ (function () {
    function eOtherCasesMainDisease() {
    }
    return eOtherCasesMainDisease;
}());



/***/ }),

/***/ "./src/app/search-filter.pipe.ts":
/*!***************************************!*\
  !*** ./src/app/search-filter.pipe.ts ***!
  \***************************************/
/*! exports provided: SearchPipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SearchPipe", function() { return SearchPipe; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var SearchPipe = /** @class */ (function () {
    function SearchPipe() {
    }
    SearchPipe.prototype.transform = function (value, args) {
        if (!value)
            return null;
        if (!args)
            return value;
        args = args.toLowerCase();
        return value.filter(function (item) {
            return JSON.stringify(item).toLowerCase().includes(args);
        });
    };
    SearchPipe = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Pipe"])({
            name: 'search'
        })
    ], SearchPipe);
    return SearchPipe;
}());



/***/ }),

/***/ "./src/app/services/AVPU/avpu.service.ts":
/*!***********************************************!*\
  !*** ./src/app/services/AVPU/avpu.service.ts ***!
  \***********************************************/
/*! exports provided: AVPUService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AVPUService", function() { return AVPUService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");



var AVPUService = /** @class */ (function () {
    function AVPUService(http) {
        this.http = http;
        this.AVPUlistUrl = "/api/Triage/Get_AVPUList";
    }
    AVPUService.prototype.seturl = function (url) {
        this.baseurl = url;
    };
    AVPUService.prototype.getAVPU = function () {
        var headerDict = {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        };
        var requestOptions = {
            headers: new Headers(headerDict),
        };
        return this.http.get(this.baseurl + this.AVPUlistUrl, {
            headers: headerDict
        });
    };
    AVPUService.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }
    ]; };
    AVPUService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], AVPUService);
    return AVPUService;
}());



/***/ }),

/***/ "./src/app/services/CreatTeriage/creat-level2.service.ts":
/*!***************************************************************!*\
  !*** ./src/app/services/CreatTeriage/creat-level2.service.ts ***!
  \***************************************************************/
/*! exports provided: CreatLevel2Service */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreatLevel2Service", function() { return CreatLevel2Service; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");



var CreatLevel2Service = /** @class */ (function () {
    function CreatLevel2Service(http) {
        this.http = http;
        this.CreateLvl2Triage = "/api/Triage/Create_New_Triage";
    }
    CreatLevel2Service.prototype.seturl = function (url) {
        this.baseurl = url;
    };
    CreatLevel2Service.prototype.createTriage = function (sensetiveFoodType, departure, Separation, gender, age, ageType, name, lastName, nationalCode, TransportList, birthDate, lastDay, admissionKind, MainDisease, patientIsNotIdentity, HighRiskSituation, Confused, Distress, PainScale, spO2, bPMax, bPMin, PR, RR, Temperature, drugHistoryList, hasDrugAllery, drugList, FoodSensitivityObjList, eOtherCasesMainDisease, admissionKindTextList) {
        var data = {
            "referTypeIS": '',
            "encounter24HoursAgo": lastDay,
            "allergy": hasDrugAllery,
            "stateOfAlertIS": '',
            "dangerousRespire": '',
            "respireDistress": '',
            "sianosis": '',
            "shock": '',
            "highDanger": HighRiskSituation,
            "lethargy": Confused,
            "highDistress": Distress,
            "medicalHistory": '',
            "drugHistory": '',
            "spo2": spO2,
            "t": Temperature,
            "rr": RR,
            "pr": PR,
            "bp": bPMax,
            "bs": '',
            "serviceCountIS": '',
            "triageLevelIS": "2",
            "referDate": '',
            "entranceTime": '',
            "bP2": bPMin,
            "pregnant": '',
            "triageTimeByNurse": '',
            "nurseComment": '',
            "gender": gender,
            "patientIsNotIdentity": patientIsNotIdentity,
            "age": age,
            "ageType": ageType,
            "firstName": name,
            "lastName": lastName,
            "nationalCode": nationalCode,
            "telNo": '',
            "arrival_AdmissionKind": '',
            "arrival_Transport": TransportList,
            "departure": departure,
            "resourceNeeds_Labs": '',
            "resourceNeeds_ECG_XRay_CT_MRI_UltraSound_Angiography": '',
            "resourceNeeds_IVFluids": '',
            "resourceNeeds_IVIM_Nebulized_Medications": '',
            "resourceNeeds_Specialty_Consultation": '',
            "resourceNeeds_SimpleProcedure": '',
            "resourceNeeds_ComplexProcedure": '',
            "decisionPoint": '',
            "locationID": localStorage.getItem("locationID"),
            "spo2LowerThan90": '',
            "birthDate": birthDate,
            "intensityOfPain": PainScale,
            "hasFoodSensitivity": sensetiveFoodType,
            "referCause": '',
            "foodSensitivity": '',
            "separationByInfection": Separation,
            "encounter24HoursAgoItems": '',
            "isOutCenter": '',
            "triage_AdmissionKind": admissionKind,
            "triage_MainDisease": MainDisease,
            "triage_MedicalHistory": [
                {
                    "triageID": "",
                    "medicalHistoryID": ""
                }
            ],
            "triageDrugHistory": drugHistoryList,
            "triageAllergyDrugs": drugList,
            "triageOtherCasesAdmissionKind": admissionKindTextList,
            "triageOtherCasesMainDisease": eOtherCasesMainDisease,
            "triageFoodSensitivity": FoodSensitivityObjList,
        };
        var body = JSON.stringify(data);
        console.log(body);
        var headerDict = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer  ' + localStorage.getItem('token')
        };
        console.log(body);
        return this.http.post(this.baseurl + this.CreateLvl2Triage, body, {
            headers: headerDict
        });
    };
    CreatLevel2Service.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"] }
    ]; };
    CreatLevel2Service = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], CreatLevel2Service);
    return CreatLevel2Service;
}());



/***/ }),

/***/ "./src/app/services/CreatTeriage/creat-new-teriage.service.ts":
/*!********************************************************************!*\
  !*** ./src/app/services/CreatTeriage/creat-new-teriage.service.ts ***!
  \********************************************************************/
/*! exports provided: CreatNewTeriageService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreatNewTeriageService", function() { return CreatNewTeriageService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");




var CreatNewTeriageService = /** @class */ (function () {
    function CreatNewTeriageService(http) {
        this.http = http;
        this.creatNewTriageUrl = "/api/Triage/Create_New_Triage";
        this._todos = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"]([]);
        this.todos$ = this._todos.asObservable();
        this.comments = new Array;
    }
    CreatNewTeriageService.prototype.seturl = function (url) {
        this.baseurl = url;
    };
    CreatNewTeriageService.prototype.gettodos = function () {
        return this._todos.getValue();
    };
    CreatNewTeriageService.prototype.settodos = function (val) {
        this._todos.next(this._todos.getValue().concat([val]));
    };
    CreatNewTeriageService.prototype.createTriage = function (sensetiveFoodType, AVPU, airWay, Distress, Cyanosis, Spo, departure, Separation, gender, age, ageType, name, lastName, nationalCode, TransportList, birthDate, lastDay, admissionKind, MainDisease, patientIsNotIdentity, hasDrugAllery, drugList, FoodSensitivity, eOtherCasesMainDisease, admissionKindTextList) {
        var data = {
            "referTypeIS": '',
            "encounter24HoursAgo": '',
            "allergy": hasDrugAllery,
            "stateOfAlertIS": AVPU,
            "dangerousRespire": airWay,
            "respireDistress": Distress,
            "sianosis": Cyanosis,
            "shock": '',
            "highDanger": '',
            "lethargy": '',
            "highDistress": '',
            "medicalHistory": '',
            "drugHistory": '',
            "spo2": '',
            "t": '',
            "rr": '',
            "pr": '',
            "bp": '',
            "bs": '',
            "serviceCountIS": '',
            "triageLevelIS": '1',
            "referDate": '',
            "entranceTime": '',
            "bP2": '',
            "pregnant": '',
            "triageTimeByNurse": '',
            "nurseComment": '',
            "gender": gender,
            "patientIsNotIdentity": patientIsNotIdentity,
            "age": age,
            "ageType": ageType,
            "firstName": name,
            "lastName": lastName,
            "nationalCode": nationalCode,
            "telNo": '',
            "arrival_AdmissionKind": '',
            "arrival_Transport": TransportList,
            "departure": departure,
            "resourceNeeds_Labs": '',
            "resourceNeeds_ECG_XRay_CT_MRI_UltraSound_Angiography": '',
            "resourceNeeds_IVFluids": '',
            "resourceNeeds_IVIM_Nebulized_Medications": '',
            "resourceNeeds_Specialty_Consultation": '',
            "resourceNeeds_SimpleProcedure": '',
            "resourceNeeds_ComplexProcedure": '',
            "decisionPoint": '',
            "locationID": localStorage.getItem("locationID"),
            "spo2LowerThan90": Spo,
            "birthDate": birthDate,
            "intensityOfPain": '',
            "hasFoodSensitivity": sensetiveFoodType,
            "referCause": '',
            "foodSensitivity": '',
            "separationByInfection": Separation,
            "encounter24HoursAgoItems": lastDay,
            "isOutCenter": '',
            "triage_AdmissionKind": admissionKind,
            "triage_MainDisease": MainDisease,
            "triage_MedicalHistory": [
                {
                    "triageID": "",
                    "medicalHistoryID": ""
                }
            ],
            "triageDrugHistory": [
                {
                    "triageID": "",
                    "strDrugCode": "",
                    "strRouteCode": ""
                }
            ],
            "triageAllergyDrugs": drugList,
            "triageOtherCasesAdmissionKind": admissionKindTextList,
            "triageOtherCasesMainDisease": eOtherCasesMainDisease,
            "triageFoodSensitivity": FoodSensitivity
        };
        var body = JSON.stringify(data);
        console.log(body);
        var headerDict = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer  ' + localStorage.getItem('token')
        };
        console.log(body);
        return this.http.post(this.baseurl + this.creatNewTriageUrl, body, {
            headers: headerDict
        });
    };
    CreatNewTeriageService.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"] }
    ]; };
    CreatNewTeriageService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], CreatNewTeriageService);
    return CreatNewTeriageService;
}());



/***/ }),

/***/ "./src/app/services/CreatTeriage/creatlevel5/creatlevel4/creatlvl4-triage.service.ts":
/*!*******************************************************************************************!*\
  !*** ./src/app/services/CreatTeriage/creatlevel5/creatlevel4/creatlvl4-triage.service.ts ***!
  \*******************************************************************************************/
/*! exports provided: Creatlvl4TriageService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Creatlvl4TriageService", function() { return Creatlvl4TriageService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");



var Creatlvl4TriageService = /** @class */ (function () {
    function Creatlvl4TriageService(http) {
        this.http = http;
        this.creatlvlUrl = "/api/Triage/Create_New_Triage";
    }
    Creatlvl4TriageService.prototype.seturl = function (url) {
        this.baseurl = url;
    };
    Creatlvl4TriageService.prototype.creatTriageLvl4 = function (sensetiveFoodType, departure, Separation, gender, age, ageType, name, lastName, nationalCode, TransportList, birthDate, lastDay, admissionKind, MainDisease, patientIsNotIdentity, hasDrugAllery, drugList, FoodSensitivityObjList, eOtherCasesMainDisease, admissionKindTextList) {
        var data = {
            "referTypeIS": "",
            "encounter24HoursAgo": lastDay,
            "allergy": hasDrugAllery,
            "stateOfAlertIS": "",
            "dangerousRespire": "",
            "respireDistress": "",
            "sianosis": "",
            "shock": "",
            "highDanger": "",
            "lethargy": "",
            "highDistress": "",
            "medicalHistory": "",
            "drugHistory": "",
            "spo2": "",
            "t": "",
            "rr": "",
            "pr": "",
            "bp": "",
            "bs": "",
            "serviceCountIS": "",
            "triageLevelIS": "4",
            "referDate": "",
            "entranceTime": "",
            "bP2": "",
            "pregnant": "",
            "triageTimeByNurse": "",
            "nurseComment": "",
            "gender": gender,
            "patientIsNotIdentity": patientIsNotIdentity,
            "age": age,
            "ageType": ageType,
            "firstName": name,
            "lastName": lastName,
            "nationalCode": nationalCode,
            "telNo": "",
            "arrival_AdmissionKind": "",
            "arrival_Transport": TransportList,
            "departure": departure,
            "resourceNeeds_Labs": "",
            "resourceNeeds_ECG_XRay_CT_MRI_UltraSound_Angiography": "",
            "resourceNeeds_IVFluids": "",
            "resourceNeeds_IVIM_Nebulized_Medications": "",
            "resourceNeeds_Specialty_Consultation": "",
            "resourceNeeds_SimpleProcedure": "",
            "resourceNeeds_ComplexProcedure": "",
            "decisionPoint": "",
            "locationID": localStorage.getItem("locationID"),
            "spo2LowerThan90": "",
            "birthDate": birthDate,
            "intensityOfPain": "",
            "hasFoodSensitivity": "0",
            "referCause": "",
            "foodSensitivity": "",
            "separationByInfection": Separation,
            "encounter24HoursAgoItems": "",
            "isOutCenter": "",
            "triage_AdmissionKind": admissionKind,
            "triage_MainDisease": MainDisease,
            "triage_MedicalHistory": [
                {
                    "triageID": "",
                    "medicalHistoryID": ""
                }
            ],
            "triageDrugHistory": [
                {
                    "triageID": "",
                    "strDrugCode": "",
                    "strRouteCode": ""
                }
            ],
            "triageAllergyDrugs": drugList,
            "triageOtherCasesAdmissionKind": admissionKindTextList,
            "triageOtherCasesMainDisease": eOtherCasesMainDisease,
            "triageFoodSensitivity": FoodSensitivityObjList
        };
        var body = JSON.stringify(data);
        console.log(body);
        var headerDict = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer  ' + localStorage.getItem('token')
        };
        console.log(body);
        return this.http.post(this.baseurl + this.creatlvlUrl, body, {
            headers: headerDict
        });
    };
    Creatlvl4TriageService.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }
    ]; };
    Creatlvl4TriageService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], Creatlvl4TriageService);
    return Creatlvl4TriageService;
}());



/***/ }),

/***/ "./src/app/services/CreatTeriage/creatlevel5/creatlevel5.service.ts":
/*!**************************************************************************!*\
  !*** ./src/app/services/CreatTeriage/creatlevel5/creatlevel5.service.ts ***!
  \**************************************************************************/
/*! exports provided: Creatlevel5Service */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Creatlevel5Service", function() { return Creatlevel5Service; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");



var Creatlevel5Service = /** @class */ (function () {
    function Creatlevel5Service(http) {
        this.http = http;
        this.creatlvlUrl = "/api/Triage/Create_New_Triage";
    }
    Creatlevel5Service.prototype.seturl = function (url) {
        this.baseurl = url;
    };
    Creatlevel5Service.prototype.creatTriageLvl4And5 = function (sensetiveFoodType, departure, Separation, gender, age, ageType, name, lastName, nationalCode, TransportList, birthDate, lastDay, admissionKind, MainDisease, patientIsNotIdentity, hasDrugAllery, drugList, FoodSensitivityObjList, eOtherCasesMainDisease, admissionKindTextList) {
        var data = {
            "referTypeIS": "",
            "encounter24HoursAgo": lastDay,
            "allergy": hasDrugAllery,
            "stateOfAlertIS": "",
            "dangerousRespire": "",
            "respireDistress": "",
            "sianosis": "",
            "shock": "",
            "highDanger": "",
            "lethargy": "",
            "highDistress": "",
            "medicalHistory": "",
            "drugHistory": "",
            "spo2": "",
            "t": "",
            "rr": "",
            "pr": "",
            "bp": "",
            "bs": "",
            "serviceCountIS": "",
            "triageLevelIS": "5",
            "referDate": "",
            "entranceTime": "",
            "bP2": "",
            "pregnant": "",
            "triageTimeByNurse": "",
            "nurseComment": "",
            "gender": gender,
            "patientIsNotIdentity": patientIsNotIdentity,
            "age": age,
            "ageType": ageType,
            "firstName": name,
            "lastName": lastName,
            "nationalCode": nationalCode,
            "telNo": "",
            "arrival_AdmissionKind": "",
            "arrival_Transport": TransportList,
            "departure": departure,
            "resourceNeeds_Labs": "",
            "resourceNeeds_ECG_XRay_CT_MRI_UltraSound_Angiography": "",
            "resourceNeeds_IVFluids": "",
            "resourceNeeds_IVIM_Nebulized_Medications": "",
            "resourceNeeds_Specialty_Consultation": "",
            "resourceNeeds_SimpleProcedure": "",
            "resourceNeeds_ComplexProcedure": "",
            "decisionPoint": "",
            "locationID": localStorage.getItem("locationID"),
            "spo2LowerThan90": "",
            "birthDate": birthDate,
            "intensityOfPain": "",
            "hasFoodSensitivity": "0",
            "referCause": "",
            "foodSensitivity": "",
            "separationByInfection": Separation,
            "encounter24HoursAgoItems": "",
            "isOutCenter": "",
            "triage_AdmissionKind": admissionKind,
            "triage_MainDisease": MainDisease,
            "triage_MedicalHistory": [
                {
                    "triageID": "",
                    "medicalHistoryID": ""
                }
            ],
            "triageDrugHistory": [
                {
                    "triageID": "",
                    "strDrugCode": "",
                    "strRouteCode": ""
                }
            ],
            "triageAllergyDrugs": drugList,
            "triageOtherCasesAdmissionKind": admissionKindTextList,
            "triageOtherCasesMainDisease": eOtherCasesMainDisease,
            "triageFoodSensitivity": FoodSensitivityObjList
        };
        var body = JSON.stringify(data);
        console.log(body);
        var headerDict = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer  ' + localStorage.getItem('token')
        };
        console.log(body);
        return this.http.post(this.baseurl + this.creatlvlUrl, body, {
            headers: headerDict
        });
    };
    Creatlevel5Service.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }
    ]; };
    Creatlevel5Service = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], Creatlevel5Service);
    return Creatlevel5Service;
}());



/***/ }),

/***/ "./src/app/services/CreatTeriage/creatlvl3.service.ts":
/*!************************************************************!*\
  !*** ./src/app/services/CreatTeriage/creatlvl3.service.ts ***!
  \************************************************************/
/*! exports provided: Creatlvl3Service */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Creatlvl3Service", function() { return Creatlvl3Service; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");



var Creatlvl3Service = /** @class */ (function () {
    function Creatlvl3Service(http) {
        this.http = http;
        this.CreateLvl3Triage = "/api/Triage/Create_New_Triage";
    }
    Creatlvl3Service.prototype.seturl = function (url) {
        this.baseurl = url;
    };
    Creatlvl3Service.prototype.creattriage = function (sensetiveFoodType, departure, Separation, gender, age, ageType, name, lastName, nationalCode, TransportList, birthDate, lastDay, admissionKind, MainDisease, patientIsNotIdentity, spO2, bPMax, bPMin, PR, RR, Temperature, hasDrugAllery, drugList, FoodSensitivity, eOtherCasesMainDisease, admissionKindTextList) {
        var data = {
            "referTypeIS": '',
            "encounter24HoursAgo": lastDay,
            "allergy": hasDrugAllery,
            "stateOfAlertIS": '',
            "dangerousRespire": '',
            "respireDistress": '',
            "sianosis": '',
            "shock": '',
            "highDanger": '',
            "lethargy": '',
            "highDistress": '',
            "medicalHistory": '',
            "drugHistory": '',
            "spo2": spO2,
            "t": Temperature,
            "rr": RR,
            "pr": PR,
            "bp": bPMax,
            "bs": '',
            "serviceCountIS": '',
            "triageLevelIS": "3",
            "referDate": '',
            "entranceTime": '',
            "bP2": bPMin,
            "pregnant": '',
            "triageTimeByNurse": '',
            "nurseComment": '',
            "gender": gender,
            "patientIsNotIdentity": patientIsNotIdentity,
            "age": age,
            "ageType": ageType,
            "firstName": name,
            "lastName": lastName,
            "nationalCode": nationalCode,
            "telNo": '',
            "arrival_AdmissionKind": '',
            "arrival_Transport": TransportList,
            "departure": departure,
            "resourceNeeds_Labs": '',
            "resourceNeeds_ECG_XRay_CT_MRI_UltraSound_Angiography": '',
            "resourceNeeds_IVFluids": '',
            "resourceNeeds_IVIM_Nebulized_Medications": '',
            "resourceNeeds_Specialty_Consultation": '',
            "resourceNeeds_SimpleProcedure": '',
            "resourceNeeds_ComplexProcedure": '',
            "decisionPoint": '',
            "locationID": localStorage.getItem("locationID"),
            "spo2LowerThan90": '',
            "birthDate": birthDate,
            "intensityOfPain": '',
            "hasFoodSensitivity": sensetiveFoodType,
            "referCause": '',
            "foodSensitivity": "",
            "separationByInfection": Separation,
            "encounter24HoursAgoItems": '',
            "isOutCenter": '',
            "triage_AdmissionKind": admissionKind,
            "triage_MainDisease": MainDisease,
            "triage_MedicalHistory": [
                {
                    "triageID": "",
                    "medicalHistoryID": ""
                }
            ],
            "triageDrugHistory": [
                {
                    "triageID": "",
                    "strDrugCode": "",
                    "strRouteCode": ""
                }
            ],
            "triageAllergyDrugs": drugList,
            "triageOtherCasesAdmissionKind": admissionKindTextList,
            "triageOtherCasesMainDisease": eOtherCasesMainDisease,
            "triageFoodSensitivity": FoodSensitivity
        };
        var body = JSON.stringify(data);
        console.log(body);
        var headerDict = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer  ' + localStorage.getItem('token')
        };
        console.log(body);
        return this.http.post(this.baseurl + this.CreateLvl3Triage, body, {
            headers: headerDict
        });
    };
    Creatlvl3Service.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"] }
    ]; };
    Creatlvl3Service = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], Creatlvl3Service);
    return Creatlvl3Service;
}());



/***/ }),

/***/ "./src/app/services/Provider/provider-service.service.ts":
/*!***************************************************************!*\
  !*** ./src/app/services/Provider/provider-service.service.ts ***!
  \***************************************************************/
/*! exports provided: ProviderServiceService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProviderServiceService", function() { return ProviderServiceService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var ProviderServiceService = /** @class */ (function () {
    function ProviderServiceService() {
        this.weekDayNames = ["شنبه", "یکشنبه", "دوشنبه",
            "سه شنبه", "چهارشنبه",
            "پنج شنبه", "جمعه"];
        this.monthNames = [
            "فروردین",
            "اردیبهشت",
            "خرداد",
            "تیر",
            "مرداد",
            "شهریور",
            "مهر",
            "آبان",
            "آذر",
            "دی",
            "بهمن",
            "اسفند"
        ];
        this.strWeekDay = null;
        this.strMonth = null;
        this.day = null;
        this.month = null;
        this.year = null;
        this.ld = null;
        this.farsiDate = null;
        this.today = new Date();
        this.gregorianYear = null;
        this.gregorianMonth = null;
        this.gregorianDate = null;
        this.WeekDay = null;
        this.buf1 = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        this.buf2 = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
    }
    ProviderServiceService.prototype.PersianCalendar = function (gregorianDate) {
        this.today = gregorianDate;
        this.gregorianYear = this.today.getFullYear();
        this.gregorianMonth = this.today.getMonth() + 1;
        this.gregorianDate = this.today.getDate();
        this.WeekDay = this.today.getDay();
        this.toPersian(gregorianDate);
        return this.strWeekDay + " " + this.day + " " + this.strMonth + " " + this.year;
    };
    ProviderServiceService.prototype.toPersian = function (gregorianDate) {
        if ((this.gregorianYear % 4) != 0)
            this.farsiDate = this.func1();
        else
            this.farsiDate = this.func2();
        this.strMonth = this.monthNames[Math.floor(this.month - 1)];
        this.strWeekDay = this.weekDayNames[this.WeekDay + 1];
    };
    ProviderServiceService.prototype.func1 = function () {
        this.day = this.buf1[this.gregorianMonth - 1] + this.gregorianDate;
        if (this.day > 79) {
            this.day = this.day - 79;
            if (this.day <= 186) {
                var day2 = this.day;
                this.month = (day2 / 31) + 1;
                this.day = (day2 % 31);
                if (day2 % 31 == 0) {
                    this.month--;
                    this.day = 31;
                }
                this.year = this.gregorianYear - 621;
            }
            else {
                var day2 = this.day - 186;
                this.month = (day2 / 30) + 7;
                this.day = (day2 % 30);
                if (day2 % 30 == 0) {
                    this.month = (day2 / 30) + 6;
                    this.day = 30;
                }
                this.year = this.gregorianYear - 621;
            }
        }
        else {
            this.ld = this.gregorianYear > 1996 && this.gregorianYear % 4 == 1 ? 11 : 10;
            var day2 = this.day + this.ld;
            this.month = (day2 / 30) + 10;
            this.day = (day2 % 30);
            if (day2 % 30 == 0) {
                this.month--;
                this.day = 30;
            }
            this.year = this.gregorianYear - 622;
        }
        var fullDate = this.day + "/" + Math.floor(this.month) + "/" + this.year;
        return fullDate;
    };
    ProviderServiceService.prototype.func2 = function () {
        //console.log("entered func2");
        this.day = this.buf2[this.gregorianMonth - 1] + this.gregorianDate;
        this.ld = this.gregorianYear >= 1996 ? 79 : 80;
        if (this.day > this.ld) {
            this.day = this.day - this.ld;
            if (this.day <= 186) {
                var day2 = this.day;
                this.month = (day2 / 31) + 1;
                this.day = (day2 % 31);
                if (day2 % 31 == 0) {
                    this.month--;
                    this.day = 31;
                }
                this.year = this.gregorianYear - 621;
            }
            else {
                var day2 = this.day - 186;
                this.month = (day2 / 30) + 7;
                this.day = (day2 % 30);
                if (day2 % 30 == 0) {
                    this.month--;
                    this.day = 30;
                }
                this.year = this.gregorianYear - 621;
            }
            var fullDate = this.day + "/" + Math.floor(this.month) + "/" + this.year;
            return fullDate;
        }
        else {
            var day2 = this.day + 10;
            this.month = (day2 / 30) + 10;
            this.day = (day2 % 30);
            if (day2 % 30 == 0) {
                this.month--;
                this.day = 30;
            }
            this.year = this.gregorianYear - 622;
        }
    };
    ProviderServiceService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], ProviderServiceService);
    return ProviderServiceService;
}());



/***/ }),

/***/ "./src/app/services/admission-kind-list.service.ts":
/*!*********************************************************!*\
  !*** ./src/app/services/admission-kind-list.service.ts ***!
  \*********************************************************/
/*! exports provided: AdmissionKindListService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdmissionKindListService", function() { return AdmissionKindListService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");



var AdmissionKindListService = /** @class */ (function () {
    function AdmissionKindListService(http) {
        this.http = http;
        this.postAdmissionKindUrl = "/api/Triage/New_AdmissionKind";
        this.AdmissionKindListUrl = "/api/Triage/Get_AdmissionKindList";
    }
    AdmissionKindListService.prototype.seturl = function (url) {
        this.baseurl = url;
    };
    AdmissionKindListService.prototype.getAdmissionKindList = function () {
        var headerDict = {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        };
        var requestOptions = {
            headers: new Headers(headerDict),
        };
        return this.http.get(this.baseurl + this.AdmissionKindListUrl, {
            headers: headerDict
        });
    };
    AdmissionKindListService.prototype.postAdmissionKind = function (value) {
        var data = {
            "id": "",
            "admissionKindValue": value
        };
        var body = JSON.stringify(data);
        console.log(body);
        var headerDict = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer  ' + localStorage.getItem('token')
        };
        console.log(body);
        return this.http.post(this.baseurl + this.postAdmissionKindUrl, body, {
            headers: headerDict
        });
    };
    AdmissionKindListService.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }
    ]; };
    AdmissionKindListService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], AdmissionKindListService);
    return AdmissionKindListService;
}());



/***/ }),

/***/ "./src/app/services/end-of-triage.service.ts":
/*!***************************************************!*\
  !*** ./src/app/services/end-of-triage.service.ts ***!
  \***************************************************/
/*! exports provided: EndOfTriageService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EndOfTriageService", function() { return EndOfTriageService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");



var EndOfTriageService = /** @class */ (function () {
    function EndOfTriageService(http) {
        this.http = http;
        this.endTriageUrl = "/api/Triage/FinalizeTriage_ByID\n";
    }
    EndOfTriageService.prototype.seturl = function (url) {
        this.baseurl = url;
    };
    EndOfTriageService.prototype.endTtiazh = function (id) {
        var data = {
            triageID: id
        };
        var body = JSON.stringify(data);
        console.log(body);
        var headers = { 'Content-Type': 'application/json' };
        var headerDict = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer  ' + localStorage.getItem('token')
        };
        var requestOptions = {
            headers: new Headers(headerDict),
        };
        return this.http.post(this.baseurl + this.endTriageUrl, body, {
            headers: headerDict
        });
    };
    EndOfTriageService.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }
    ]; };
    EndOfTriageService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], EndOfTriageService);
    return EndOfTriageService;
}());



/***/ }),

/***/ "./src/app/services/getById/get-by-triage-id.service.ts":
/*!**************************************************************!*\
  !*** ./src/app/services/getById/get-by-triage-id.service.ts ***!
  \**************************************************************/
/*! exports provided: GetByTriageIdService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetByTriageIdService", function() { return GetByTriageIdService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");



var GetByTriageIdService = /** @class */ (function () {
    function GetByTriageIdService(http) {
        this.http = http;
        this.URl = "/api/Triage/Get_TriageInfoByID";
    }
    GetByTriageIdService.prototype.seturl = function (url) {
        this.baseurl = url;
    };
    GetByTriageIdService.prototype.ByID = function (id) {
        var data = {
            'triageID': id,
        };
        var body = JSON.stringify(data);
        console.log(body);
        var headers = { 'Content-Type': 'application/json' };
        var headerDict = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer  ' + localStorage.getItem('token')
        };
        var requestOptions = {
            headers: new Headers(headerDict),
        };
        return this.http.post(this.baseurl + this.URl, body, {
            headers: headerDict
        });
    };
    GetByTriageIdService.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }
    ]; };
    GetByTriageIdService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], GetByTriageIdService);
    return GetByTriageIdService;
}());



/***/ }),

/***/ "./src/app/services/mainDisease/main-disease.service.ts":
/*!**************************************************************!*\
  !*** ./src/app/services/mainDisease/main-disease.service.ts ***!
  \**************************************************************/
/*! exports provided: MainDiseaseService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MainDiseaseService", function() { return MainDiseaseService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");



var MainDiseaseService = /** @class */ (function () {
    function MainDiseaseService(http) {
        this.http = http;
        this.MainDiseaseListURL = "/api/Triage/Get_MainDiseaseList";
        this.newMainDiseaseListURL = "/api/Triage/New_MainDisease";
    }
    MainDiseaseService.prototype.seturl = function (url) {
        this.baseurl = url;
    };
    MainDiseaseService.prototype.getMainDiseaseList = function () {
        var headerDict = {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        };
        var requestOptions = {
            headers: new Headers(headerDict),
        };
        return this.http.get(this.baseurl + this.MainDiseaseListURL, {
            headers: headerDict
        });
    };
    MainDiseaseService.prototype.postPractitioner = function (name, spo) {
        var data = {
            'id': spo,
            'mainDiseaseValue': name,
        };
        var body = JSON.stringify(data);
        console.log(body);
        var headers = { 'Content-Type': 'application/json' };
        var headerDict = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer  ' + localStorage.getItem('token')
        };
        var requestOptions = {
            headers: new Headers(headerDict),
        };
        return this.http.post(this.baseurl + this.newMainDiseaseListURL, body, {
            headers: headerDict
        });
    };
    MainDiseaseService.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }
    ]; };
    MainDiseaseService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], MainDiseaseService);
    return MainDiseaseService;
}());



/***/ }),

/***/ "./src/app/services/teriajFilter/teriaj-filter.service.ts":
/*!****************************************************************!*\
  !*** ./src/app/services/teriajFilter/teriaj-filter.service.ts ***!
  \****************************************************************/
/*! exports provided: TeriajFilterService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeriajFilterService", function() { return TeriajFilterService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");



var TeriajFilterService = /** @class */ (function () {
    function TeriajFilterService(http) {
        this.http = http;
        this.PostUrl = '/api/Triage/Get_TriageList';
    }
    TeriajFilterService.prototype.seturl = function (url) {
        this.baseurl = url;
    };
    TeriajFilterService.prototype.postPractitioner = function (triageID, patientFirstName, patientLastName, fromAge, toAge, fromDate, toDate, entrnaceType, triageLevel, departure, triageStatus, admissionKind, prac, locationID, sTriage_AdmissionKind, sTriage_MainDisease) {
        var data = {
            'triageID': triageID,
            'patientFirstName': patientFirstName,
            'patientLastName': patientLastName,
            'fromAge': fromAge,
            'toAge': toAge,
            'fromDate': fromDate,
            'toDate': toDate,
            'entrnaceType': entrnaceType,
            'triageLevel': triageLevel,
            'departure': departure,
            'triageStatus': triageStatus,
            'admissionKind': admissionKind,
            'prac': prac,
            'locationID': locationID,
            'sTriage_AdmissionKind': sTriage_AdmissionKind,
            'sTriage_MainDisease': sTriage_MainDisease
        };
        var body = JSON.stringify(data);
        console.log(body);
        var headers = { 'Content-Type': 'application/json' };
        var headerDict = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer  ' + localStorage.getItem('token')
        };
        var requestOptions = {
            headers: new Headers(headerDict),
        };
        return this.http.post(this.baseurl + this.PostUrl, body, {
            headers: headerDict
        });
    };
    TeriajFilterService.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"] }
    ]; };
    TeriajFilterService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], TeriajFilterService);
    return TeriajFilterService;
}());



/***/ }),

/***/ "./src/app/teriazh/page1/page1.component.scss":
/*!****************************************************!*\
  !*** ./src/app/teriazh/page1/page1.component.scss ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3RlcmlhemgvcGFnZTEvcGFnZTEuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/teriazh/page1/page1.component.ts":
/*!**************************************************!*\
  !*** ./src/app/teriazh/page1/page1.component.ts ***!
  \**************************************************/
/*! exports provided: Page1Component */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Page1Component", function() { return Page1Component; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/fesm5/ng-bootstrap.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _services_admission_kind_list_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../services/admission-kind-list.service */ "./src/app/services/admission-kind-list.service.ts");
/* harmony import */ var _services_mainDisease_main_disease_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../../services/mainDisease/main-disease.service */ "./src/app/services/mainDisease/main-disease.service.ts");
/* harmony import */ var _services_teriajFilter_teriaj_filter_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./../../services/teriajFilter/teriaj-filter.service */ "./src/app/services/teriajFilter/teriaj-filter.service.ts");
/* harmony import */ var _services_teriajItems_teriaj_items_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../services/teriajItems/teriaj-items.service */ "./src/app/services/teriajItems/teriaj-items.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_apiConfig_api_config_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../services/apiConfig/api-config.service */ "./src/app/services/apiConfig/api-config.service.ts");












var Page1Component = /** @class */ (function () {
    function Page1Component(modalService, _admissionList, _MainDisease, _TeriajFilter, _item, router, i) {
        this.modalService = modalService;
        this._admissionList = _admissionList;
        this._MainDisease = _MainDisease;
        this._TeriajFilter = _TeriajFilter;
        this._item = _item;
        this.router = router;
        this.i = i;
        this.dateObject = '';
        this.dateObject1 = '';
        this.triageLocationID = "";
        this.sTriageAdmissionKind = "";
        this.sTriage_MainDisease = "";
        this.id = "";
        this._item.seturl(this.i.config.API_URL);
        this._admissionList.seturl(this.i.config.API_URL);
        this._MainDisease.seturl(this.i.config.API_URL);
        this._TeriajFilter.seturl(this.i.config.API_URL);
    }
    Page1Component.prototype.resetList = function (event) {
        this.signupForm.reset();
    };
    Page1Component.prototype.onSubmit = function () {
        var _this = this;
        console.log(this.signupForm);
        console.log(this.signupForm.value.toDate);
        this._TeriajFilter.postPractitioner(this.signupForm.value.teriazhID, this.signupForm.value.firstName, this.signupForm.value.LastName, this.signupForm.value.fromAge, this.signupForm.value.toAge, this.signupForm.value.fromDate, this.signupForm.value.toDate, this.signupForm.value.entrnaceType, this.signupForm.value.triageLevel, this.signupForm.value.departure, this.signupForm.value.triageStatus, this.signupForm.value.admissionKind, this.signupForm.value.prac, this.triageLocationID = localStorage.getItem('locationID'), this.sTriageAdmissionKind = this.sTriageAdmissionKind, this.sTriage_MainDisease = this.sTriage_MainDisease).subscribe(function (res) {
            _this.result = res;
            console.log(res);
        });
        this.modalService.dismissAll();
    };
    Page1Component.prototype.getDatail = function (id) {
        this.id = id;
        localStorage.setItem('teriazhid', this.id);
        this.router.navigate(['/teriazh/showInfo', this.id]);
    };
    Page1Component.prototype.ngOnInit = function () {
        var _this = this;
        this.modalService.open(this.content, { size: 'lg', backdrop: 'static', keyboard: false });
        this.signupForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormGroup"]({
            'teriazhID': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](''),
            'firstName': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](''),
            'LastName': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](''),
            'fromAge': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](''),
            'toAge': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](''),
            'fromDate': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required]),
            'toDate': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required]),
            'entrnaceType': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](''),
            'triageLevel': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](''),
            'departure': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](''),
            'triageStatus': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](''),
            'admissionKind': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](''),
            'prac': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](''),
        });
        this._admissionList.getAdmissionKindList().subscribe(function (res) {
            _this.AdmissionKindList = res;
            console.log(_this.AdmissionKindList);
        });
        this._MainDisease.getMainDiseaseList().subscribe(function (res) {
            _this.MainDiseaseList = res;
            console.log(_this.MainDiseaseList);
        });
        this._item.getDepartureList().subscribe(function (res) {
            _this.DepartureList = res;
            console.log(_this.DepartureList);
        });
        this._item.getEntranceTypeList().subscribe(function (res) {
            _this.EntranceTypeList = res;
        });
        this._item.getTriageLevelList().subscribe(function (res) {
            _this.TriageLevelList = res;
        });
        this._item.getAgeTypeList().subscribe(function (res) {
            _this.ageTypeLst = res;
        });
        this._item.getTransportList().subscribe(function (res) {
            _this.transportList = res;
            console.log(_this.transportList);
        });
    };
    Page1Component.ctorParameters = function () { return [
        { type: _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_2__["NgbModal"] },
        { type: _services_admission_kind_list_service__WEBPACK_IMPORTED_MODULE_4__["AdmissionKindListService"] },
        { type: _services_mainDisease_main_disease_service__WEBPACK_IMPORTED_MODULE_5__["MainDiseaseService"] },
        { type: _services_teriajFilter_teriaj_filter_service__WEBPACK_IMPORTED_MODULE_6__["TeriajFilterService"] },
        { type: _services_teriajItems_teriaj_items_service__WEBPACK_IMPORTED_MODULE_7__["TeriajItemsService"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_8__["Router"] },
        { type: _services_apiConfig_api_config_service__WEBPACK_IMPORTED_MODULE_9__["ApiConfigService"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('content', { static: true }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"])
    ], Page1Component.prototype, "content", void 0);
    Page1Component = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-page1',
            template: __webpack_require__(/*! raw-loader!./page1.component.html */ "./node_modules/raw-loader/index.js!./src/app/teriazh/page1/page1.component.html"),
            styles: [__webpack_require__(/*! ./page1.component.scss */ "./src/app/teriazh/page1/page1.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_2__["NgbModal"],
            _services_admission_kind_list_service__WEBPACK_IMPORTED_MODULE_4__["AdmissionKindListService"],
            _services_mainDisease_main_disease_service__WEBPACK_IMPORTED_MODULE_5__["MainDiseaseService"],
            _services_teriajFilter_teriaj_filter_service__WEBPACK_IMPORTED_MODULE_6__["TeriajFilterService"],
            _services_teriajItems_teriaj_items_service__WEBPACK_IMPORTED_MODULE_7__["TeriajItemsService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_8__["Router"],
            _services_apiConfig_api_config_service__WEBPACK_IMPORTED_MODULE_9__["ApiConfigService"]])
    ], Page1Component);
    return Page1Component;
}());



/***/ }),

/***/ "./src/app/teriazh/page2/page2.component.scss":
/*!****************************************************!*\
  !*** ./src/app/teriazh/page2/page2.component.scss ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".not-active {\n  border: 1px solid black;\n  padding: 1rem;\n  cursor: pointer; }\n\n.active {\n  border: 1px solid black;\n  padding: 1rem;\n  background-color: aqua;\n  cursor: pointer; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdGVyaWF6aC9wYWdlMi9DOlxcVXNlcnNcXFNfTWFub3VjaGVocmlcXERlc2t0b3BcXHRlcmlhemggcmF5YXZhcmFuIDggcGFnZXMvc3JjXFxhcHBcXHRlcmlhemhcXHBhZ2UyXFxwYWdlMi5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLHVCQUF3QjtFQUN4QixhQUFjO0VBQ2QsZUFBZSxFQUFBOztBQUVqQjtFQUNFLHVCQUF3QjtFQUN4QixhQUFjO0VBQ2Qsc0JBQXNCO0VBQ3RCLGVBQWUsRUFBQSIsImZpbGUiOiJzcmMvYXBwL3RlcmlhemgvcGFnZTIvcGFnZTIuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIubm90LWFjdGl2ZXtcclxuICAgIGJvcmRlciA6IDFweCBzb2xpZCBibGFjaztcclxuICAgIHBhZGRpbmcgOiAxcmVtO1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gIH1cclxuICAuYWN0aXZle1xyXG4gICAgYm9yZGVyIDogMXB4IHNvbGlkIGJsYWNrO1xyXG4gICAgcGFkZGluZyA6IDFyZW07XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBhcXVhO1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gIH0iXX0= */"

/***/ }),

/***/ "./src/app/teriazh/page2/page2.component.ts":
/*!**************************************************!*\
  !*** ./src/app/teriazh/page2/page2.component.ts ***!
  \**************************************************/
/*! exports provided: Page2Component */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Page2Component", function() { return Page2Component; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/fesm5/ng-bootstrap.js");
/* harmony import */ var _services_CreatTeriage_creat_new_teriage_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/CreatTeriage/creat-new-teriage.service */ "./src/app/services/CreatTeriage/creat-new-teriage.service.ts");
/* harmony import */ var _services_admission_kind_list_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../services/admission-kind-list.service */ "./src/app/services/admission-kind-list.service.ts");
/* harmony import */ var _services_teriajItems_teriaj_items_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/teriajItems/teriaj-items.service */ "./src/app/services/teriajItems/teriaj-items.service.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _anyfile__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./../../anyfile */ "./src/app/anyfile.ts");
/* harmony import */ var _Imaindesease__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./../../Imaindesease */ "./src/app/Imaindesease.ts");
/* harmony import */ var _dugAllergy__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./../../dugAllergy */ "./src/app/dugAllergy.ts");
/* harmony import */ var _drugTable__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./../../drugTable */ "./src/app/drugTable.ts");
/* harmony import */ var _eOtherCasesMainDisease__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./../../eOtherCasesMainDisease */ "./src/app/eOtherCasesMainDisease.ts");
/* harmony import */ var _triageFoodSensitivity__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../triageFoodSensitivity */ "./src/app/triageFoodSensitivity.ts");
/* harmony import */ var _services_getById_get_by_triage_id_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../services/getById/get-by-triage-id.service */ "./src/app/services/getById/get-by-triage-id.service.ts");
/* harmony import */ var _services_Provider_provider_service_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../services/Provider/provider-service.service */ "./src/app/services/Provider/provider-service.service.ts");
/* harmony import */ var _services_apiConfig_api_config_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./../../services/apiConfig/api-config.service */ "./src/app/services/apiConfig/api-config.service.ts");


















var Page2Component = /** @class */ (function () {
    // @ViewChild('search') searchElement: ElementRef;
    function Page2Component(modalService, _service, _admissionList, _item, renderer, _edit, persianCalendarService, cdRef, i) {
        this.modalService = modalService;
        this._service = _service;
        this._admissionList = _admissionList;
        this._item = _item;
        this.renderer = renderer;
        this._edit = _edit;
        this.persianCalendarService = persianCalendarService;
        this.cdRef = cdRef;
        this.i = i;
        this.myControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]();
        this.dateObject = '';
        this.options = ['One', 'Two', 'Three'];
        this.isDisable = false;
        this.isShown = false;
        this.name = '';
        this.serchlist = new Array();
        this.MainDeseaseSearchList = new Array();
        this.serchlist1 = new Array();
        this.familyName = '';
        this.birthDate = '';
        this.nationalCode = '';
        this.age = '';
        this.transport = '';
        this.Enter = '';
        this.lastDayHours = '';
        this.reson = new Array();
        this.shekayat1 = '';
        this.SensetiveDrug = '';
        this.listItem = new Array;
        this.resoneList = [];
        this.mainDeseasePush = [];
        this.selectAddmisionList = new Array;
        this.saeed = "";
        this.birthDatepatient = '';
        this.ageType = "";
        this.ENteranceType = "";
        this.lastDayType = "";
        this.genderType = "";
        this.transportType = "";
        this.pregmentType = "";
        this.AllList = [];
        this.inputValueMainDesease = "";
        this.inputValue1 = "";
        this.FoodSensitivity = "";
        this.FoodSensitivityPush = [];
        this.value = "";
        this.MainDeseaseID = "";
        this.list = new Array();
        this.text = "";
        this.toggle = false;
        this.searchText = "";
        this.show = false;
        this.AdmissionFrom = "";
        this.mainDiseaseSearch = "";
        this.showMainDeseaseList = false;
        this.MainDeseaseList = new Array();
        this.patientIsNotIdentity = "0";
        this.Allergy = "";
        this.drugCode = "";
        this.drugList = new Array();
        this.drugSearch = "";
        this.showDrug = false;
        this.drugname = "";
        this.sepasCode = "";
        this.drugArray = new Array();
        this.toggle1 = false;
        this.toggle2 = false;
        this.toggle3 = false;
        this.othermainDeseasePush = new Array();
        this.admissionKindTextList = new Array();
        this.FoodSensitivityObjList = new Array();
        this.drugSensitivy = new Array();
        this.firstname = "";
        this.validGender = false;
        this.validTranspoerter = false;
        this.validEnterance = false;
        this.AdmisionValid = false;
        this.mainDeseaseValid = false;
        this.foodSenseValid = false;
        this.drugAllerguValid = false;
        this.patientIsNotIdentityValid = false;
        this.Lastname = "";
        this.date1 = new Date();
        this.otherMaindeseaseCaseValid = false;
        this.otherAdmissionKindCaseValid = false;
        this.validAge = false;
        this.ageTypeValid = false;
        this.lastDayeTypeValid = false;
        this.lastNameValid = false;
        this.firstnameValid = false;
        this.DateValid = false;
        this.showListAdd = false;
        this.showListMainDesease = false;
        this.arrowkeyLocation = 0;
        this.arrowkeyLocation2 = 0;
        this.foodPAtientValueList = new Array();
        this.showFood = false;
        this.idAddmision = "";
        this.idMain = "";
        this.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        this._item.seturl(this.i.config.API_URL);
        this._admissionList.seturl(this.i.config.API_URL);
    }
    Page2Component.prototype.setKey = function (event) {
        alert("sf");
    };
    Page2Component.prototype.showFoodPAtient = function () {
        this.showFood = true;
        this.modalService.dismissAll();
    };
    Page2Component.prototype.disable = function () {
        this.isDisable = !this.isDisable;
        console.log(this.isDisable);
        if (this.isDisable == false) {
            this.patientIsNotIdentity = "0";
            this.triageForm.get('name').setValue(" ");
            this.triageForm.get('name').updateValueAndValidity();
            this.triageForm.get('lastName').setValue("");
            this.triageForm.get('lastName').updateValueAndValidity();
        }
        if (this.isDisable == true) {
            this.patientIsNotIdentity = "1";
            console.log(this.patientIsNotIdentity);
            this.triageForm.get('name').clearValidators();
            this.triageForm.get('name').setValue("بیمار ");
            this.triageForm.get('name').updateValueAndValidity();
            this.triageForm.get('birthDate').clearValidators();
            this.triageForm.get('birthDate').setValue("");
            this.triageForm.get('birthDate').updateValueAndValidity();
            this.triageForm.get('nationalCode').clearValidators();
            this.triageForm.get('nationalCode').setValue("");
            this.triageForm.get('nationalCode').updateValueAndValidity();
            this.triageForm.get('lastName').clearValidators();
            this.triageForm.get('lastName').setValue("مجهول الهویه");
            this.triageForm.get('lastName').updateValueAndValidity();
            // this.triageForm.get('nationalCode').updateValueAndValidity()
            // this.triageForm.get('birthDate').updateValueAndValidity()
            this.firstnameValid = true;
            this.lastNameValid = true;
            this.DateValid = true;
        }
    };
    Page2Component.prototype.GetDetails = function (content) {
        this.foodSenseValid = true;
        this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false }).result.then(function (result) {
        }, function (reason) {
        });
        this.FoodSensitivity = "1";
        this.toggle = !this.toggle;
        this.toggle1 = false;
    };
    Page2Component.prototype.GetDrugAllergyDetails = function (content2) {
        var _this = this;
        this.drugAllerguValid = true;
        this.modalService.open(content2, { size: 'lg', backdrop: 'static', keyboard: false }).result.then(function (result) {
        }, function (reason) {
        });
        this.Allergy = "1";
        this._item.GetSepasList().subscribe(function (res) {
            _this.DrugHistrotyList = res;
        });
        this.toggle2 = !this.toggle2;
        this.toggle3 = false;
    };
    Page2Component.prototype.getbirthDate = function (event) {
        this.birthDate = event;
        if (this.birthDate.length > 0) {
            this.DateValid = true;
            this.validAge = true;
        }
        else {
            this.DateValid = false;
        }
        var date = new Date(event);
        this.birthDate2 = date.getFullYear();
        var date1 = this.persianCalendarService.PersianCalendar(this.date);
        this.farsiDate = date1;
        this.res = this.farsiDate.split(' ');
        var d = new Date();
        var dayName = this.days[d.getDay()];
        console.log(dayName);
        if (dayName === "Tuesday") {
            this.result = this.res[4] - this.birthDate2;
        }
        else {
            this.result = (this.res[3] - this.birthDate2);
        }
        this.age = this.result.toString();
        // this.DateValid=true
    };
    Page2Component.prototype.getbirthDate1 = function () {
    };
    Page2Component.prototype.onSubmit = function () {
        console.log(this.patientIsNotIdentity);
        this.triageForm.value.name;
        this.triageForm.value.lastName;
        this.triageForm.value.birthDate;
        this.triageForm.value.nationalCode;
        this.triageForm.value.FoodSensitivity;
        this.triageForm.value.gender;
        this.triageForm.value.gender.toString();
        this.triageForm.value.age.toString();
        this.triageForm.value.age;
        this.triageForm.value.ageType = this.ageType.toString();
        this.triageForm.value.pregmentType = this.pregmentType.toString();
        this.triageForm.value.TransportList = this.transportType.toString();
        this.triageForm.value.entrnaceType = this.ENteranceType.toString();
        this.triageForm.value.lastDay = this.lastDayType.toString();
        this.triageForm.value.lastDay;
        this.triageForm.value.admissionKind;
        this.triageForm.value.MainDisease;
        this.triageForm.value.sensetiveFoodType;
        this.AllList = this.triageForm.value;
        this.AllList["name"] = this.triageForm.value.name;
        this.AllList["lastName"] = this.triageForm.value.lastName;
        this.AllList["birthDate"] = this.triageForm.value.birthDate;
        this.AllList["nationalCode"] = this.triageForm.value.nationalCode;
        this.AllList["gender"] = this.triageForm.value.gender;
        this.AllList["pregmentType"] = this.triageForm.value.pregmentType;
        this.AllList["age"] = this.triageForm.value.age.toString();
        this.AllList["ageType"] = this.triageForm.value.ageType;
        this.AllList["TransportList"] = this.triageForm.value.TransportList;
        this.AllList["entrnaceType"] = this.triageForm.value.entrnaceType;
        this.AllList["24Hourses"] = this.triageForm.value.lastDay;
        // this.AllList["FoodSensitivity"]=this.triageForm.value.FoodSensitivity;
        if (this.resoneList.length > 0) {
            this.AllList["admissionKind"] = this.resoneList;
        }
        else {
            this.AllList["admissionKind"] = new Array();
        }
        if (this.mainDeseasePush.length > 0) {
            this.AllList["MainDisease"] = this.mainDeseasePush;
        }
        else {
            this.AllList["MainDisease"] = new Array();
        }
        if (this.drugList.length > 0) {
            this.AllList["DrugSensitive"] = this.drugList;
            console.log("دارووو حساس ", this.AllList["DrugSensitive"]);
        }
        else {
            this.AllList["DrugSensitive"] = new Array();
        }
        if (this.othermainDeseasePush.length > 0) {
            this.AllList["othermainDeseasePush"] = this.othermainDeseasePush;
        }
        else {
            this.AllList["othermainDeseasePush"] = new Array();
        }
        if (this.admissionKindTextList.length > 0) {
            this.AllList["admissionKindTextList"] = this.admissionKindTextList;
        }
        else {
            this.AllList["admissionKindTextList"] = new Array();
        }
        if (this.FoodSensitivityObjList.length > 0) {
            this.AllList['FoodSensitivity'] = this.FoodSensitivityObjList;
        }
        else {
            this.AllList['FoodSensitivity'] = new Array();
        }
        // this.AllList["admissionKindText"]=this.triageForm.value.admissionKindText;
        // this.AllList["MainDiseaseText"]=this.triageForm.value.MainDiseaseText;
        this.AllList["sensetiveFoodType"] = this.FoodSensitivity.toString();
        this.AllList["Allergy"] = this.Allergy;
        this.AllList["patientIsNotIdentity"] = this.patientIsNotIdentity;
        this._service.settodos(this.AllList);
        this.triageForm.setValue(this.triageForm.value);
    };
    Page2Component.prototype.onSearch = function (event) {
        var _this = this;
        this.showListAdd = false;
        var key = event.target.value;
        this.serchlist = [];
        this.AdmissionKindList.forEach(function (item) {
            if (key == "") {
                _this.serchlist = [];
            }
            if (key != '') {
                var f = item.admissionKindValue.toLowerCase().substring(0, key.length);
                if (key === f) {
                    _this.serchlist.push({ 'id': item.id, 'admissionKindValue': item.admissionKindValue });
                }
            }
        });
    };
    Page2Component.prototype.showList = function () {
        this.showListAdd = true;
    };
    Page2Component.prototype.showListMain = function () {
        this.showListMainDesease = true;
    };
    Page2Component.prototype.onSearchMainDesease = function (event) {
        var _this = this;
        this.showListMainDesease = false;
        var key = event.target.value;
        this.MainDeseaseSearchList = [];
        this.MainDiseaseList.forEach(function (item) {
            if (key == "") {
                _this.MainDeseaseSearchList = [];
            }
            if (key != '') {
                var f = item.mainDiseaseValue.toLowerCase().substring(0, key.length);
                if (key === f) {
                    _this.MainDeseaseSearchList.push({ 'id': item.id, 'mainDiseaseValue': item.mainDiseaseValue });
                }
            }
        });
    };
    Page2Component.prototype.onSearchDrugSensitivy = function (event) {
        var _this = this;
        var key = event.target.value;
        this.drugSensitivy = [];
        this.DrugHistrotyList['items'].forEach(function (item) {
            if (key == "") {
                _this.drugSensitivy = [];
            }
            if (key != '') {
                var f = item.value.toLowerCase().substring(0, key.length);
                if (key === f) {
                    _this.drugSensitivy.push({ 'value': item.value, 'code': item.code });
                }
            }
        });
    };
    Page2Component.prototype.onSearchDrug = function (event) {
        this.showDrug = true;
    };
    Page2Component.prototype.seseFood = function () {
        this.foodSenseValid = true;
        this.FoodSensitivity = "0";
        this.toggle1 = !this.toggle1;
        this.toggle = false;
    };
    Page2Component.prototype.getDrugAllergy = function () {
        this.drugAllerguValid = true;
        this.Allergy = "0";
        this.toggle3 = !this.toggle3;
        this.toggle2 = false;
    };
    Page2Component.prototype.addToDrugArray = function (name, sepasCode) {
        var selectDrug = new _drugTable__WEBPACK_IMPORTED_MODULE_10__["drugTable"];
        this.drugCode = sepasCode;
        selectDrug.code = this.drugCode;
        selectDrug.name = name;
        this.drugArray.push(selectDrug);
        var drugObj = new _dugAllergy__WEBPACK_IMPORTED_MODULE_9__["drugAllergy"];
        drugObj.triageID = "";
        drugObj.sepas_ERXCode = this.drugCode;
        this.drugList.push(drugObj);
    };
    Page2Component.prototype.sendDrug = function () {
        this.modalService.dismissAll();
    };
    Page2Component.prototype.onMainDeseaseSearchChange = function (event) {
        this.showMainDeseaseList = true;
    };
    Page2Component.prototype.setMainDesease = function (id, value) {
        this.showListMainDesease = false;
        this.MainDeseaseID = id;
        this.inputValueMainDesease = value;
        this.mainDiseaseSearch = this.inputValueMainDesease;
        this.MainDeseaseSearchList = [];
    };
    Page2Component.prototype.set = function (f, d) {
        this.showListAdd = false;
        this.inputValue1 = f;
        this.value = d;
        this.searchText = this.value;
        this.serchlist = [];
    };
    Page2Component.prototype.addToOtherCaseAdmissionKind = function () {
        var admissionKindTextObj = new _eOtherCasesMainDisease__WEBPACK_IMPORTED_MODULE_11__["eOtherCasesMainDisease"]();
        admissionKindTextObj.triageID = "";
        admissionKindTextObj.description = this.triageForm.value.admissionKindText;
        admissionKindTextObj.typeIS = "";
        this.searchText = null;
        // customObj.admissionKindID=""
        this.admissionKindTextList.push(admissionKindTextObj);
        this.triageForm.value.admissionKindText = "";
    };
    Page2Component.prototype.addToOtherCaseMainDesease = function () {
        var customObj2 = new _eOtherCasesMainDisease__WEBPACK_IMPORTED_MODULE_11__["eOtherCasesMainDisease"]();
        customObj2.triageID = '';
        customObj2.description = this.triageForm.value.MainDiseaseText;
        customObj2.typeIS = '';
        this.mainDiseaseSearch = "";
        // customObj.mainDiseaseID="";
        this.othermainDeseasePush.push(customObj2);
        this.triageForm.value.MainDiseaseText = "";
    };
    Page2Component.prototype.addToResone = function () {
        this.AdmisionValid = true;
        this.otherAdmissionKindCaseValid = true;
        var customObj = new _anyfile__WEBPACK_IMPORTED_MODULE_7__["custom"]();
        customObj.triageID = "";
        customObj.admissionKindID = this.inputValue1;
        this.resoneList.push(customObj);
        this.searchText = null;
        this.list.push(this.value);
        this.value = '';
        this.liststring = localStorage.setItem('AdmissionKind', this.list.toString());
    };
    Page2Component.prototype.getinput = function (event) {
        alert(event.target.value);
    };
    Page2Component.prototype.yyyyes = function (event) {
        alert(event);
    };
    Page2Component.prototype.set_ch = function (g) {
        alert(g);
    };
    Page2Component.prototype.get = function (event) {
    };
    Page2Component.prototype.save = function (event) {
        switch (event.keyCode) {
            case 13:
                this.showListAdd = false;
                this.serchlist = [];
                // this.searchText=event.target.value;
                this.searchText = this.AdmissionKindList[this.index + 1]['admissionKindValue'];
                this.idAddmision = this.AdmissionKindList[this.index + 1]['id'];
                this.AdmisionValid = true;
                this.otherAdmissionKindCaseValid = true;
                var customObj = new _anyfile__WEBPACK_IMPORTED_MODULE_7__["custom"]();
                customObj.triageID = "";
                customObj.admissionKindID = this.idAddmision;
                this.resoneList.push(customObj);
                this.list.push(this.searchText);
                break;
            case 38:
                if (this.arrowkeyLocation < 1) {
                    this.arrowkeyLocation = 1;
                }
                this.index = this.arrowkeyLocation-- - 2;
                document.getElementById('ul').scrollBy(-25, -25);
                document.getElementById('ul2').scrollBy(-30, -30);
                break;
            case 40:
                this.index = this.arrowkeyLocation++;
                document.getElementById('ul').scrollBy(25, 25);
                document.getElementById('ul2').scrollBy(30, 30);
                break;
        }
    };
    Page2Component.prototype.saveMainDesease = function (event) {
        switch (event.keyCode) {
            case 13:
                this.showListMainDesease = false;
                this.MainDeseaseSearchList = [];
                this.mainDiseaseSearch = this.MainDiseaseList[this.indexMAin + 1]['mainDiseaseValue'];
                this.idMain = this.MainDiseaseList[this.indexMAin + 1]['id'];
                this.mainDeseaseValid = true;
                this.otherMaindeseaseCaseValid = true;
                var customObj = new _Imaindesease__WEBPACK_IMPORTED_MODULE_8__["Imaindesease"]();
                customObj.triageID = '';
                customObj.mainDiseaseID = this.idMain;
                this.mainDeseasePush.push(customObj);
                this.MainDeseaseList.push(this.mainDiseaseSearch);
                this.mainDiseaseSearch = "";
                this.mainDiseaseSearch = "";
            // this.searchText=event.target.value;
            // this.inputsaeed=document.getElementById('el').getAttribute('data-name');
            case 38:
                if (this.arrowkeyLocation2 < 1) {
                    this.arrowkeyLocation2 = 1;
                }
                this.indexMAin = this.arrowkeyLocation2-- - 2;
                document.getElementById('ul4').scrollBy(-30, -30);
                document.getElementById('ul3').scrollBy(-20, -20);
                break;
            case 40:
                this.indexMAin = this.arrowkeyLocation2++;
                document.getElementById('ul4').scrollBy(30, 30);
                document.getElementById('ul3').scrollBy(20, 20);
                break;
        }
    };
    Page2Component.prototype.addToMainDiseaseList = function () {
        this.mainDeseaseValid = true;
        this.otherMaindeseaseCaseValid = true;
        var customObj = new _Imaindesease__WEBPACK_IMPORTED_MODULE_8__["Imaindesease"]();
        customObj.triageID = '';
        customObj.mainDiseaseID = this.MainDeseaseID;
        this.mainDeseasePush.push(customObj);
        this.mainDiseaseSearch = "";
        this.MainDeseaseList.push(this.inputValueMainDesease);
        this.inputValueMainDesease = "";
        this.MainDeseaseListliststring = localStorage.setItem('MainDisease', this.MainDeseaseList.toString());
    };
    Page2Component.prototype.addAdmissionFromInput = function () {
        var _this = this;
        //   let customObj = new custom();
        //   customObj.triageID= "";
        //   customObj.admissionKindID=this.triageForm.value.admissionKindText;
        // this.list.push(this.AdmissionFrom);
        this._admissionList.postAdmissionKind(this.triageForm.value.admissionKindText).subscribe(function (res) {
        });
        this._admissionList.getAdmissionKindList().subscribe(function (res) {
            _this.AdmissionKindList = res;
        });
    };
    Page2Component.prototype.addMainDiseaseInput = function () {
        //   let customObj = new Imaindesease();
        //   customObj.triageID= "";
        //   customObj.mainDiseaseID=this.triageForm.value.MainDiseaseText;
        // this.mainDeseasePush.push(customObj);
        var _this = this;
        this._item.getMainDiseaseList().subscribe(function (res) {
            _this.MainDiseaseList = res;
        });
        this.MainDeseaseList.push(this.triageForm.value.MainDiseaseText);
    };
    Page2Component.prototype.getpatientIsNotIdentity = function () {
        // this.patientIsNotIdentity="true"
    };
    Page2Component.prototype.ngOnInit = function () {
        var _this = this;
        this.patientIsNotIdentity = "0";
        window.onload = function () {
            localStorage.removeItem('firstname');
            localStorage.removeItem('AdmissionKind');
            localStorage.removeItem('age');
            localStorage.removeItem('nationalCode');
            localStorage.removeItem('birthDatepatient');
            localStorage.removeItem('genderType');
            localStorage.removeItem('item');
            localStorage.removeItem('LastName');
            localStorage.removeItem('MainDisease');
            localStorage.removeItem('reload');
            localStorage.removeItem('gender');
        };
        this.date = new Date();
        if (localStorage.getItem('reload') === '1') {
            localStorage.removeItem('reload');
            window.location.reload();
        }
        this.MainDeseaseListliststring = localStorage.getItem('MainDisease');
        this.liststring = localStorage.getItem('AdmissionKind');
        // this.genderType=localStorage.getItem('genderType');
        this.age = localStorage.getItem('age');
        this.nationalCode = localStorage.getItem(('nationalCode'));
        this.firstname = localStorage.getItem('firstname');
        this.Lastname = localStorage.getItem('LastName');
        this._admissionList.getAdmissionKindList().subscribe(function (res) {
            _this.AdmissionKindList = res;
        });
        this._item.getTransportList().subscribe(function (res) {
            _this.transportList = res;
        });
        this._item.getGenderList().subscribe(function (res) {
            _this.genderList = res;
        });
        this._item.getPragnentList().subscribe(function (res) {
            _this.pragnentList = res;
        });
        this._item.getEntranceTypeList().subscribe(function (res) {
            _this.EntranceList = res;
        });
        this._item.getEncounter24HoursAgoList().subscribe(function (res) {
            _this.Encounter24HoursAgoList = res;
        });
        this._item.getFoodSensitivityList().subscribe(function (res) {
            _this.FoodSensitivityList = res;
        });
        this._item.getAgeTypeList().subscribe(function (res) {
            _this.ageTypeLst = res;
        });
        // this.testFrom=new FormGroup({
        //     'qqq':new FormControl('',[ Validators.required])
        // })
        this.triageForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormGroup"]({
            'name': new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_6__["Validators"].required]),
            'lastName': new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_6__["Validators"].required]),
            'birthDate': new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"](null, [_angular_forms__WEBPACK_IMPORTED_MODULE_6__["Validators"].required]),
            'nationalCode': new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"](''),
            'gender': new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"](''),
            'age': new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_6__["Validators"].required]),
            'ageType': new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"](''),
            'pregmentType': new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"](''),
            'TransportList': new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"](''),
            'entrnaceType': new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"](''),
            'lastDay': new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"](''),
            'admissionKind': new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"](''),
            'admissionKindText': new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"](''),
            'MainDisease': new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"](''),
            'MainDiseaseText': new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"](''),
            'sensetiveFoodType': new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"](''),
            'patientIsNotIdentity': new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"](''),
            'FoodSensitivity': new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"](''),
        });
        // this.triageForm.controls['name'].updateValueAndValidity();
        this._item.getMainDiseaseList().subscribe(function (res) {
            _this.MainDiseaseList = res;
        });
        if (localStorage.getItem('edit') === "1") {
            this._edit.ByID(localStorage.getItem('teriazhid')).subscribe(function (res) {
                _this.triageInfo = res;
                _this.firstname = _this.triageInfo['item']['firstName'];
                _this.Lastname = _this.triageInfo['item']['lastName'];
                _this.nationalCode = _this.triageInfo['item']['nationalCode'];
                _this.age = _this.triageInfo['item']['age'];
            });
            // this.firstname=
        }
    };
    Page2Component.prototype.sendData = function (id, i) {
        this.ageType = id;
        for (var _i = 0, _a = this.ageTypeLst; _i < _a.length; _i++) {
            var myChild = _a[_i];
            myChild.BackgroundColour = "white";
            i.BackgroundColour = "#44b5b7";
            myChild.color = "black";
            i.color = 'white';
        }
        this.ageTypeValid = true;
    };
    Page2Component.prototype.getEntrnaceType = function (id, i) {
        this.validEnterance = true;
        this.ENteranceType = id;
        for (var _i = 0, _a = this.EntranceList; _i < _a.length; _i++) {
            var myChild = _a[_i];
            myChild.BackgroundColour = "white";
            i.BackgroundColour = "#44b5b7";
            myChild.color = "black";
            i.color = 'white';
        }
    };
    Page2Component.prototype.getLastDayType = function (id, i) {
        this.lastDayType = id;
        for (var _i = 0, _a = this.Encounter24HoursAgoList; _i < _a.length; _i++) {
            var myChild = _a[_i];
            myChild.BackgroundColour = "white";
            i.BackgroundColour = "#44b5b7";
            myChild.color = "black";
            i.color = 'white';
        }
    };
    Page2Component.prototype.getGenderType = function (id, i) {
        this.validGender = true;
        this.genderType = id;
        this.triageForm.value.gender = this.genderType.toString();
        // localStorage.setItem('genderType', this.triageForm.value.gender);
        if (id == 1) {
            this.isShown = true;
        }
        else {
            this.isShown = false;
        }
        // this._service.settodos(this.genderList);
        for (var _i = 0, _a = this.genderList; _i < _a.length; _i++) {
            var myChild = _a[_i];
            localStorage.setItem('gender', myChild);
            myChild.BackgroundColour = "white";
            i.BackgroundColour = "#44b5b7";
            myChild.color = "black";
            i.color = 'white';
        }
    };
    Page2Component.prototype.getOtherMainDesease = function (event) {
        this.otherMaindeseaseCaseValid = true;
        this.mainDeseaseValid = true;
    };
    Page2Component.prototype.getOtherAdmissionKind = function (event) {
        this.otherAdmissionKindCaseValid = true;
        this.AdmisionValid = true;
    };
    Page2Component.prototype.getTransportType = function (id, i) {
        this.validTranspoerter = true;
        this.transportType = id;
        for (var _i = 0, _a = this.transportList; _i < _a.length; _i++) {
            var myChild = _a[_i];
            myChild.BackgroundColour = "white";
            i.BackgroundColour = "#44b5b7";
            myChild.color = "black";
            i.color = 'white';
        }
    };
    Page2Component.prototype.getPregmentType = function (id, i) {
        this.pregmentType = id;
        for (var _i = 0, _a = this.pragnentList; _i < _a.length; _i++) {
            var myChild = _a[_i];
            myChild.BackgroundColour = "white";
            i.BackgroundColour = "#44b5b7";
            myChild.color = "black";
            i.color = 'white';
        }
    };
    Page2Component.prototype.getFoodSensitivity = function (id, i, value) {
        this.foodPAtientValueList.push(value);
        // this.FoodSensitivity=id;
        this.inputsaeed = id;
        for (var _i = 0, _a = this.FoodSensitivityList; _i < _a.length; _i++) {
            var myChild = _a[_i];
            // myChild.BackgroundColour = "white"
            i.BackgroundColour = "#44b5b7";
            // myChild.color = "black";
            i.color = 'white';
        }
        var FoodSensitivityObj = new _triageFoodSensitivity__WEBPACK_IMPORTED_MODULE_12__["triageFoodSensitivity"];
        FoodSensitivityObj.triageID = "";
        FoodSensitivityObj.foodSensitivityValue = this.inputsaeed.toString();
        this.FoodSensitivityObjList.push(FoodSensitivityObj);
    };
    Page2Component.prototype.setfirst = function (event) {
        this.firstname = event.target.value;
        if (this.firstname.length > 0) {
            this.firstnameValid = true;
        }
        else {
            this.firstnameValid = false;
        }
        localStorage.setItem('firstname', this.firstname);
    };
    Page2Component.prototype.setLastName = function (event) {
        this.Lastname = event.target.value;
        if (this.Lastname.length > 0) {
            this.lastNameValid = true;
        }
        else {
            this.lastNameValid = false;
        }
        localStorage.setItem('LastName', this.Lastname);
    };
    Page2Component.prototype.setNationalCOde = function (event) {
        this.nationalCode = event.target.value;
        localStorage.setItem('nationalCode', this.nationalCode);
    };
    Page2Component.prototype.setage = function (event) {
        this.age = event.target.value;
        if (this.age.length > 0) {
            this.validAge = true;
        }
        else {
            this.validAge = false;
        }
        localStorage.setItem('age', this.age);
    };
    Page2Component.ctorParameters = function () { return [
        { type: _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_2__["NgbModal"] },
        { type: _services_CreatTeriage_creat_new_teriage_service__WEBPACK_IMPORTED_MODULE_3__["CreatNewTeriageService"] },
        { type: _services_admission_kind_list_service__WEBPACK_IMPORTED_MODULE_4__["AdmissionKindListService"] },
        { type: _services_teriajItems_teriaj_items_service__WEBPACK_IMPORTED_MODULE_5__["TeriajItemsService"] },
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"] },
        { type: _services_getById_get_by_triage_id_service__WEBPACK_IMPORTED_MODULE_13__["GetByTriageIdService"] },
        { type: _services_Provider_provider_service_service__WEBPACK_IMPORTED_MODULE_14__["ProviderServiceService"] },
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"] },
        { type: _services_apiConfig_api_config_service__WEBPACK_IMPORTED_MODULE_15__["ApiConfigService"] }
    ]; };
    Page2Component = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-page2',
            template: __webpack_require__(/*! raw-loader!./page2.component.html */ "./node_modules/raw-loader/index.js!./src/app/teriazh/page2/page2.component.html"),
            providers: [_services_Provider_provider_service_service__WEBPACK_IMPORTED_MODULE_14__["ProviderServiceService"]],
            styles: [__webpack_require__(/*! ./page2.component.scss */ "./src/app/teriazh/page2/page2.component.scss")]
        })
        // @HostListener('document:keydown', ['$event'])
        ,
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_2__["NgbModal"],
            _services_CreatTeriage_creat_new_teriage_service__WEBPACK_IMPORTED_MODULE_3__["CreatNewTeriageService"],
            _services_admission_kind_list_service__WEBPACK_IMPORTED_MODULE_4__["AdmissionKindListService"],
            _services_teriajItems_teriaj_items_service__WEBPACK_IMPORTED_MODULE_5__["TeriajItemsService"],
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"],
            _services_getById_get_by_triage_id_service__WEBPACK_IMPORTED_MODULE_13__["GetByTriageIdService"],
            _services_Provider_provider_service_service__WEBPACK_IMPORTED_MODULE_14__["ProviderServiceService"],
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"],
            _services_apiConfig_api_config_service__WEBPACK_IMPORTED_MODULE_15__["ApiConfigService"]])
    ], Page2Component);
    return Page2Component;
}());



/***/ }),

/***/ "./src/app/teriazh/page3/page3.component.scss":
/*!****************************************************!*\
  !*** ./src/app/teriazh/page3/page3.component.scss ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3RlcmlhemgvcGFnZTMvcGFnZTMuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/teriazh/page3/page3.component.ts":
/*!**************************************************!*\
  !*** ./src/app/teriazh/page3/page3.component.ts ***!
  \**************************************************/
/*! exports provided: Page3Component */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Page3Component", function() { return Page3Component; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_admission_kind_list_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/admission-kind-list.service */ "./src/app/services/admission-kind-list.service.ts");



var Page3Component = /** @class */ (function () {
    function Page3Component(_service) {
        this._service = _service;
        this.searchText = "";
    }
    Page3Component.prototype.ngOnInit = function () {
        var _this = this;
        this._service.getAdmissionKindList().subscribe(function (res) {
            _this.options = res;
        });
    };
    Page3Component.ctorParameters = function () { return [
        { type: _services_admission_kind_list_service__WEBPACK_IMPORTED_MODULE_2__["AdmissionKindListService"] }
    ]; };
    Page3Component = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-page3',
            template: __webpack_require__(/*! raw-loader!./page3.component.html */ "./node_modules/raw-loader/index.js!./src/app/teriazh/page3/page3.component.html"),
            styles: [__webpack_require__(/*! ./page3.component.scss */ "./src/app/teriazh/page3/page3.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_admission_kind_list_service__WEBPACK_IMPORTED_MODULE_2__["AdmissionKindListService"]])
    ], Page3Component);
    return Page3Component;
}());



/***/ }),

/***/ "./src/app/teriazh/page4/page4.component.scss":
/*!****************************************************!*\
  !*** ./src/app/teriazh/page4/page4.component.scss ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3RlcmlhemgvcGFnZTQvcGFnZTQuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/teriazh/page4/page4.component.ts":
/*!**************************************************!*\
  !*** ./src/app/teriazh/page4/page4.component.ts ***!
  \**************************************************/
/*! exports provided: Page4Component */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Page4Component", function() { return Page4Component; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _services_teriajItems_teriaj_items_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/teriajItems/teriaj-items.service */ "./src/app/services/teriajItems/teriaj-items.service.ts");
/* harmony import */ var _services_CreatTeriage_creat_new_teriage_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/CreatTeriage/creat-new-teriage.service */ "./src/app/services/CreatTeriage/creat-new-teriage.service.ts");
/* harmony import */ var _services_mainDisease_main_disease_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/mainDisease/main-disease.service */ "./src/app/services/mainDisease/main-disease.service.ts");
/* harmony import */ var _services_AVPU_avpu_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../services/AVPU/avpu.service */ "./src/app/services/AVPU/avpu.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_getById_get_by_triage_id_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../services/getById/get-by-triage-id.service */ "./src/app/services/getById/get-by-triage-id.service.ts");
/* harmony import */ var _services_end_of_triage_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../services/end-of-triage.service */ "./src/app/services/end-of-triage.service.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _services_apiConfig_api_config_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../services/apiConfig/api-config.service */ "./src/app/services/apiConfig/api-config.service.ts");












var Page4Component = /** @class */ (function () {
    function Page4Component(_item, _service, _example, _AVPU, route, _Save, _End, router, i, _location) {
        this._item = _item;
        this._service = _service;
        this._example = _example;
        this._AVPU = _AVPU;
        this.route = route;
        this._Save = _Save;
        this._End = _End;
        this.router = router;
        this.i = i;
        this._location = _location;
        this.pracID = "";
        this.Time = "";
        this.FoodcodeArray = new Array();
        this.foodAllerguValue = new Array();
        this.AlleryDrug = new Array();
        this.mainVAlueArray = new Array();
        this.MainIDArray = new Array();
        this.drugListArray = new Array();
        this.allergyDrugVAlue = new Array();
        this.aleryDrugFinaly = new Array();
        this.transporterValue = "";
        this.mainDeaseValue = "";
        this.nurseFirstName = "";
        this.nurstLastName = "";
        this.ISsubmitOK = false;
        this.printTransport = "";
        this.mainDiseaseArray = new Array();
        this.Alert = "";
        this.verbal = "";
        this.painful = "";
        this.Unresponsive = "";
        this.defaultValue = "";
        this.airWay = "";
        this.Distress = "";
        this.Cyanosis = "";
        this.Mental = "";
        this.Spo = "";
        this.Separation = "";
        this.departure = "";
        this.sss = "1";
        this.name = "";
        this.lastName = "";
        this.birthDate = "";
        this.nationalCode = "";
        this.gender = "";
        this.age = "";
        this.ageType = "";
        this.TransportList = "";
        this.entrnaceType = "";
        this.lastDay = "";
        this.admissionKind = new Array();
        this.admissionKindText = "";
        this.MainDisease = new Array();
        this.eOtherCasesMainDisease = new Array();
        this.drugList = new Array();
        this.admissionKindTextList = new Array();
        this.MainDiseaseText = "";
        this.sensetiveFoodType = "";
        this.AVPU = "";
        this.teriazhLevel = "1";
        this.t = "";
        this.rr = "";
        this.pr = '';
        this.bs = '';
        this.bp = '';
        this.pregnant = "";
        this.telNo = "";
        this.referDAte = "1400-01-01";
        this.entranceTime = "";
        this.bP2 = "";
        this.pracId = "1125";
        this.locid = "";
        this.pregmentType = "";
        this.patientIsNotIdentity = "";
        this.hasDrugAllery = "";
        this.FoodSensitivity = "";
        this.triageID = "";
        this.idterTXT = "";
        this.hide = false;
        this.toggle = false;
        this.toggle1 = false;
        this.toggle2 = false;
        this.toggle3 = false;
        this.toggle4 = false;
        this.FoodSensitivityObjList = new Array();
        this.printOK = false;
        this.result = "";
        this.showResult = false;
        this.isSubmitError = false;
        this.AvpuValid = false;
        this.LifeValid = false;
        this.nurseReport = "";
        this.transportArray = new Array();
        this.refeValid = false;
        this._item.seturl(this.i.config.API_URL);
        this._service.seturl(this.i.config.API_URL);
        this._AVPU.seturl(this.i.config.API_URL);
        this._Save.seturl(this.i.config.API_URL);
        this._End.seturl(this.i.config.API_URL);
    }
    Page4Component.prototype.getSeparationByInfectionList = function (id, i) {
        this.Separation = id.toString();
        for (var _i = 0, _a = this.SeparationByInfectionList; _i < _a.length; _i++) {
            var myChild = _a[_i];
            myChild.BackgroundColour = "white";
            i.BackgroundColour = "#44b5b7";
            myChild.color = "black";
            i.color = 'white';
        }
    };
    Page4Component.prototype.getDeparture = function (id, i) {
        this.refeValid = true;
        this.departure = id.toString();
        for (var _i = 0, _a = this.departureList; _i < _a.length; _i++) {
            var myChild = _a[_i];
            myChild.BackgroundColour = "white";
            i.BackgroundColour = "#44b5b7";
            myChild.color = "black";
            i.color = 'white';
        }
    };
    Page4Component.prototype.getAirway = function () {
        this.LifeValid = true;
        this.airWay = "1";
        this.toggle4 = !this.toggle4;
    };
    Page4Component.prototype.getDistress = function () {
        this.LifeValid = true;
        this.Distress = "1";
        this.toggle3 = !this.toggle3;
    };
    Page4Component.prototype.getCyanosis = function () {
        this.LifeValid = true;
        this.Cyanosis = "1";
        this.toggle2 = !this.toggle2;
        // this.toggle=false;
        // this.toggle1=false;
        // this.toggle3=false;
        // this.toggle4=false
    };
    Page4Component.prototype.getMental = function () {
        this.LifeValid = true;
        this.Mental = "1";
        this.toggle1 = !this.toggle1;
    };
    Page4Component.prototype.send = function () {
        var _this = this;
        this._Save.ByID(this.triageID).subscribe(function (res) {
            _this.triazhInfo = res;
        });
        this._End.endTtiazh(this.triageID).subscribe(function (res) {
        });
        localStorage.removeItem('firstname');
        localStorage.removeItem('AdmissionKind');
        localStorage.removeItem('age');
        localStorage.removeItem('nationalCode');
        localStorage.removeItem('birthDatepatient');
        localStorage.removeItem('genderType');
        localStorage.removeItem('item');
        localStorage.removeItem('LastName');
        localStorage.removeItem('MainDisease');
        localStorage.setItem('reload', '1');
        this.router.navigate(['/teriazh/Patient-Triage']);
    };
    Page4Component.prototype.print = function () {
    };
    Page4Component.prototype.getSpo = function () {
        this.Spo = "1";
        this.toggle = !this.toggle;
    };
    Page4Component.prototype.getAPUV = function (id, i) {
        this.AvpuValid = true;
        this.AVPU = id.toString();
        for (var _i = 0, _a = this.AVPUlist; _i < _a.length; _i++) {
            var myChild = _a[_i];
            myChild.BackgroundColour = "white";
            i.BackgroundColour = "#44b5b7";
            myChild.color = "black";
            i.color = 'white';
        }
    };
    Page4Component.prototype.onSubmit = function () {
        var _this = this;
        this.list[0]["AVPU"] = this.AVPU;
        this.list[0]["Separation"] = this.Separation;
        this.list[0]["Separation"] = this.Separation;
        this.list[0]["Departure"] = this.departure.toString();
        if (this.airWay.length > 0) {
            this.list[0]["airWay"] = this.airWay;
            this.list[0]["Distress"] = "0";
            this.list[0]["Cyanosis"] = "0";
            this.list[0]["Mental"] = "0";
            this.list[0]["spo2"] = "0";
        }
        if (this.Distress.length > 0) {
            this.list[0]["Distress"] = this.Distress;
            this.list[0]["airWay"] = "0";
            this.list[0]["Cyanosis"] = "0";
            this.list[0]["Mental"] = "0";
            this.list[0]["spo2"] = "0";
        }
        if (this.Cyanosis.length > 0) {
            this.list[0]["Cyanosis"] = this.Cyanosis;
            this.list[0]["airWay"] = "0";
            this.list[0]["Distress"] = "0";
            this.list[0]["Mental"] = "0";
            this.list[0]["spo2"] = "0";
        }
        if (this.Mental.length > 0) {
            this.list[0]["Mental"] = this.Mental;
            this.list[0]["airWay"] = "0";
            this.list[0]["Distress"] = "0";
            this.list[0]["Cyanosis"] = "0";
            this.list[0]["spo2"] = "0";
        }
        if (this.Spo.length > 0) {
            this.list[0]["spo2"] = this.Spo;
            this.list[0]["airWay"] = "0";
            this.list[0]["Distress"] = "0";
            this.list[0]["Cyanosis"] = "0";
            this.list[0]["Mental"] = "0";
        }
        // this.nurseReport=  "بیمار با  نام و نام خانوادگی " +this.name+" "+this.lastName+" "+"با کد ملی"+" " +this.nationalCode + "  به وسیله " + this.printTransport+"در سطح تریاژ یک به اورژانس منتقل شد"
        this._service.createTriage(this.sensetiveFoodType, this.AVPU, this.airWay, this.Distress, this.Cyanosis, this.Spo, this.departure, this.Separation, this.gender, this.age, this.ageType, this.name, this.lastName, this.nationalCode, this.TransportList, this.birthDate, this.lastDay, this.admissionKind, this.MainDisease, this.patientIsNotIdentity, this.hasDrugAllery, this.drugList, this.FoodSensitivityObjList, this.eOtherCasesMainDisease, this.admissionKindTextList).subscribe(function (res) {
            console.log(res);
            _this.showResult = true;
            if (res.success === true) {
                _this.succsess = res.success;
                _this.ISsubmitOK = true;
                _this.triageID = res.trackingNumber;
                // this.result=res.errorMessage
            }
            if (res.success === false) {
                _this.isSubmitError = true;
                _this.result = res.errorMessage;
            }
            _this._Save.ByID(_this.triageID).subscribe(function (res) {
                _this.triazhInfo = res;
                console.log(_this.triazhInfo);
                _this.pracID = _this.triazhInfo['item']['triage_PracID'];
                _this.Time = _this.triazhInfo['item']['entranceTime'];
                _this.Time = _this.Time.substr(_this.Time.length - 5);
                _this.bpprint = parseInt(_this.triazhInfo['item']['bp']);
                _this.bpprint = Math.round(_this.bpprint);
                _this.prprint = parseInt(_this.triazhInfo['item']['pr']);
                _this.prprint = Math.round(_this.prprint);
                _this.rrprint = parseInt(_this.triazhInfo['item']['rr']);
                _this.rrprint = Math.round(_this.rrprint);
                _this.tprint = parseInt(_this.triazhInfo['item']['t']);
                _this.tprint = Math.round(_this.tprint);
                _this.spo2print = parseInt(_this.triazhInfo['item']['spo2']);
                _this.spo2print = Math.round(_this.spo2print);
                _this.painPrint = parseInt(_this.triazhInfo['item']['intensityOfPain']);
                _this.painPrint = Math.round(_this.painPrint);
                for (var _i = 0, _a = _this.triazhInfo['item']['triageAllergyDrugs']; _i < _a.length; _i++) {
                    var a = _a[_i];
                    _this.AlleryDrug.push(a.sepas_ERXCode);
                }
                for (var _b = 0, _c = _this.AllergyDrugListSepas['items']; _b < _c.length; _b++) {
                    var i = _c[_b];
                    for (var _d = 0, _e = _this.AlleryDrug; _d < _e.length; _d++) {
                        var x = _e[_d];
                        if (i.code == x) {
                            _this.allergyDrugVAlue.push(i.value);
                        }
                    }
                }
                _this.allergyDrugVAlue.forEach(function (item) {
                    _this.aleryDrugFinaly.push(item.substr(0, item.indexOf(' ')));
                });
                _this._item.postPracID(_this.pracID).subscribe(function (res) {
                    _this.pracInfo = res;
                    console.log("نام پرستار", res);
                });
            });
        });
        localStorage.setItem('triageID', this.idterTXT);
        localStorage.setItem('item', JSON.stringify(this.list));
        // this.router.navigate(['/teriazh/Patient-Triage']);
    };
    Page4Component.prototype.close = function () {
        this.showResult = false;
        this.printOK = true;
    };
    Page4Component.prototype.ngOnInit = function () {
        var _this = this;
        this.nurseFirstName = localStorage.getItem('nurseFirstName');
        this.nurstLastName = localStorage.getItem('nurseLastName');
        this._item.getHospitalName().subscribe(function (res) {
            _this.hospital = res;
        });
        this._AVPU.getAVPU().subscribe(function (res) {
            _this.AVPUlist = res;
        });
        this._item.getFoodSensitivityList().subscribe(function (res) {
            _this.foodLIst = res;
            for (var _i = 0, _a = _this.foodLIst; _i < _a.length; _i++) {
                var a = _a[_i];
                for (var _b = 0, _c = _this.FoodcodeArray; _b < _c.length; _b++) {
                    var q = _c[_b];
                    if (q == a.Key) {
                        _this.foodAllerguValue.push(a.Value);
                    }
                }
            }
        });
        this._item.GetSepasList().subscribe(function (res) {
            _this.AllergyDrugListSepas = res;
        });
        this._item.getTransportList().subscribe(function (res) {
            _this.transportArray = res;
            _this.transportArray.forEach(function (i) {
                if (i.Key == _this.TransportList) {
                    _this.transporterValue = i.Value;
                }
            });
        });
        this._item.getMainDiseaseList().subscribe(function (res) {
            _this.mainDiseaseArray = res;
            for (var _i = 0, _a = _this.mainDiseaseArray; _i < _a.length; _i++) {
                var i = _a[_i];
                for (var _b = 0, _c = _this.MainIDArray; _b < _c.length; _b++) {
                    var q = _c[_b];
                    if (q == i.id) {
                        _this.mainVAlueArray.push(i.mainDiseaseValue);
                    }
                }
            }
        });
        this.level1Form = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormGroup"]({
            'AVPU': new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](''),
            'airWay': new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](''),
            'Distress': new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](''),
            'Cyanosis': new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](''),
            'Mental': new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](''),
            'Spo': new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](''),
            'Departure': new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](''),
            'Separation': new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](''),
        });
        this._item.GetSeparationByInfectionList().subscribe(function (res) {
            _this.SeparationByInfectionList = res;
        });
        this._item.getDepartureList().subscribe(function (res) {
            _this.departureList = res;
        });
        this.list = this._service.gettodos();
        this.lastDay = this.list[0]["24Hourses"];
        this.MainDisease = this.list[0]["MainDisease"];
        for (var _i = 0, _a = this.MainDisease; _i < _a.length; _i++) {
            var i = _a[_i];
            this.MainIDArray.push(i.mainDiseaseID);
        }
        this.TransportList = this.list[0]["TransportList"];
        this.admissionKind = this.list[0]["admissionKind"];
        this.drugList = this.list[0]["DrugSensitive"];
        console.log("دارررررررررررررر", this.drugList);
        this.age = this.list[0]["age"];
        this.ageType = this.list[0]["ageType"];
        this.birthDate = this.list[0]["birthDate"];
        this.entrnaceType = this.list[0]["entrnaceType"];
        this.gender = this.list[0]["gender"];
        this.lastName = this.list[0]["lastName"];
        this.name = this.list[0]["name"];
        this.FoodSensitivityObjList = this.list[0]["FoodSensitivity"];
        for (var _b = 0, _c = this.FoodSensitivityObjList; _b < _c.length; _b++) {
            var i = _c[_b];
            this.FoodcodeArray.push(i.foodSensitivityValue);
        }
        this.nationalCode = this.list[0]["nationalCode"];
        this.pregmentType = this.list[0]["pregmentType"];
        this.sensetiveFoodType = this.list[0]["sensetiveFoodType"];
        this.hasDrugAllery = this.list[0]["Allergy"];
        this.admissionKindText = this.list[0]["admissionKindText"];
        this.MainDiseaseText = this.list[0]["MainDiseaseText"];
        this.patientIsNotIdentity = this.list[0]["patientIsNotIdentity"];
        console.log("l[i,g4", this.patientIsNotIdentity);
        this.eOtherCasesMainDisease = this.list[0]['othermainDeseasePush'];
        this.admissionKindTextList = this.list[0]['admissionKindTextList'];
        if (this.patientIsNotIdentity === "1") {
            this.birthDate = "";
        }
        // $('#initialdataloadForm').submit(function(e:any) {
        //   e.preventDefault()})
        //   this.level1Form.controls.proof.setValue(this.defaultValue);
        this.locid = localStorage.getItem("locationID");
    };
    ;
    Page4Component.ctorParameters = function () { return [
        { type: _services_teriajItems_teriaj_items_service__WEBPACK_IMPORTED_MODULE_3__["TeriajItemsService"] },
        { type: _services_CreatTeriage_creat_new_teriage_service__WEBPACK_IMPORTED_MODULE_4__["CreatNewTeriageService"] },
        { type: _services_mainDisease_main_disease_service__WEBPACK_IMPORTED_MODULE_5__["MainDiseaseService"] },
        { type: _services_AVPU_avpu_service__WEBPACK_IMPORTED_MODULE_6__["AVPUService"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_7__["ActivatedRoute"] },
        { type: _services_getById_get_by_triage_id_service__WEBPACK_IMPORTED_MODULE_8__["GetByTriageIdService"] },
        { type: _services_end_of_triage_service__WEBPACK_IMPORTED_MODULE_9__["EndOfTriageService"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_7__["Router"] },
        { type: _services_apiConfig_api_config_service__WEBPACK_IMPORTED_MODULE_11__["ApiConfigService"] },
        { type: _angular_common__WEBPACK_IMPORTED_MODULE_10__["Location"] }
    ]; };
    Page4Component = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-page4',
            template: __webpack_require__(/*! raw-loader!./page4.component.html */ "./node_modules/raw-loader/index.js!./src/app/teriazh/page4/page4.component.html"),
            styles: [__webpack_require__(/*! ./page4.component.scss */ "./src/app/teriazh/page4/page4.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_teriajItems_teriaj_items_service__WEBPACK_IMPORTED_MODULE_3__["TeriajItemsService"],
            _services_CreatTeriage_creat_new_teriage_service__WEBPACK_IMPORTED_MODULE_4__["CreatNewTeriageService"],
            _services_mainDisease_main_disease_service__WEBPACK_IMPORTED_MODULE_5__["MainDiseaseService"],
            _services_AVPU_avpu_service__WEBPACK_IMPORTED_MODULE_6__["AVPUService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_7__["ActivatedRoute"],
            _services_getById_get_by_triage_id_service__WEBPACK_IMPORTED_MODULE_8__["GetByTriageIdService"],
            _services_end_of_triage_service__WEBPACK_IMPORTED_MODULE_9__["EndOfTriageService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_7__["Router"],
            _services_apiConfig_api_config_service__WEBPACK_IMPORTED_MODULE_11__["ApiConfigService"],
            _angular_common__WEBPACK_IMPORTED_MODULE_10__["Location"]])
    ], Page4Component);
    return Page4Component;
}());



/***/ }),

/***/ "./src/app/teriazh/page5/page5.component.scss":
/*!****************************************************!*\
  !*** ./src/app/teriazh/page5/page5.component.scss ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3RlcmlhemgvcGFnZTUvcGFnZTUuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/teriazh/page5/page5.component.ts":
/*!**************************************************!*\
  !*** ./src/app/teriazh/page5/page5.component.ts ***!
  \**************************************************/
/*! exports provided: Page5Component */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Page5Component", function() { return Page5Component; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_CreatTeriage_creat_new_teriage_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/CreatTeriage/creat-new-teriage.service */ "./src/app/services/CreatTeriage/creat-new-teriage.service.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _services_teriajItems_teriaj_items_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/teriajItems/teriaj-items.service */ "./src/app/services/teriajItems/teriaj-items.service.ts");
/* harmony import */ var _services_CreatTeriage_creat_level2_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/CreatTeriage/creat-level2.service */ "./src/app/services/CreatTeriage/creat-level2.service.ts");
/* harmony import */ var _drugHistory__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./../../drugHistory */ "./src/app/drugHistory.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_getById_get_by_triage_id_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../services/getById/get-by-triage-id.service */ "./src/app/services/getById/get-by-triage-id.service.ts");
/* harmony import */ var _services_end_of_triage_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../services/end-of-triage.service */ "./src/app/services/end-of-triage.service.ts");
/* harmony import */ var _services_apiConfig_api_config_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../services/apiConfig/api-config.service */ "./src/app/services/apiConfig/api-config.service.ts");











var Page5Component = /** @class */ (function () {
    function Page5Component(_service, _lvl2, _item, route, router, _Save, _End, i) {
        this._service = _service;
        this._lvl2 = _lvl2;
        this._item = _item;
        this.route = route;
        this.router = router;
        this._Save = _Save;
        this._End = _End;
        this.i = i;
        this.pracID = "";
        this.mainVAlueArray = new Array();
        this.foodAllerguValue = new Array();
        this.FoodcodeArray = new Array();
        this.MainIDArray = new Array();
        this.mainDiseaseArray = new Array();
        this.Time = "";
        this.AlleryDrug = new Array();
        this.drugListFinalArray = new Array();
        this.drugListArray = new Array();
        this.drugCodeArray = new Array();
        this.allergyDrugVAlue = new Array();
        this.aleryDrugFinaly = new Array();
        this.TransportArray = new Array();
        this.transporterValue = "";
        this.nurseFirstName = "";
        this.nurstLastName = "";
        this.id1 = "";
        this.lastDay = "";
        this.MainDisease = new Array();
        this.TransportList = "";
        this.admissionKind = new Array();
        this.age = "";
        this.ageType = "";
        this.birthDate = "";
        this.entrnaceType = '';
        this.gender = "";
        this.lastName = "";
        this.name = "";
        this.nationalCode = '';
        this.pregmentType = '';
        this.sensetiveFoodType = '';
        this.Separation = "";
        this.departure = "";
        this.HighRiskSituation = "";
        this.Confused = "";
        this.Distress = "";
        this.PainScale = "";
        this.spO2 = "";
        this.bPMax = "";
        this.bPMin = "";
        this.PR = "";
        this.RR = "";
        this.Temperature = '';
        this.patientIsNotIdentity = "";
        this.searchText = "";
        this.show = false;
        this.drugName = '';
        this.drugCode = "";
        this.drugHistoryList = new Array();
        this.hasDrugAllery = "";
        this.drugList = new Array();
        this.FoodSensitivity = "";
        this.serchlist = new Array();
        this.ShowDrugList = new Array();
        this.FoodSensitivityObjList = new Array();
        this.eOtherCasesMainDisease = new Array();
        this.admissionKindTextList = new Array();
        this.triageID = "";
        this.idter = "";
        this.idterTXT = "";
        this.printOK = false;
        this.ISsubmit = false;
        this.succsess = "";
        this.showResult = false;
        this.ISsubmitOK = false;
        this.isSubmitError = false;
        this.result = "";
        this.dangerConditionValid = false;
        this.refeValid = false;
        this._item.seturl(this.i.config.API_URL);
        this._lvl2.seturl(this.i.config.API_URL);
        this._Save.seturl(this.i.config.API_URL);
        this._End.seturl(this.i.config.API_URL);
    }
    Page5Component.prototype.getSeparationByInfectionList = function (id, i) {
        this.Separation = id.toString();
        for (var _i = 0, _a = this.SeparationByInfectionList; _i < _a.length; _i++) {
            var myChild = _a[_i];
            myChild.BackgroundColour = "white";
            i.BackgroundColour = "#44b5b7";
            myChild.color = "black";
            i.color = 'white';
        }
    };
    Page5Component.prototype.getDeparture = function (id, i) {
        this.refeValid = true;
        this.departure = id.toString();
        for (var _i = 0, _a = this.departureList; _i < _a.length; _i++) {
            var myChild = _a[_i];
            myChild.BackgroundColour = "white";
            i.BackgroundColour = "#44b5b7";
            myChild.color = "black";
            i.color = 'white';
        }
    };
    Page5Component.prototype.getHighRiskSituationValue = function () {
        this.dangerConditionValid = true;
        this.HighRiskSituation = "true";
    };
    Page5Component.prototype.getConfused = function () {
        this.dangerConditionValid = true;
        this.Confused = "true";
    };
    Page5Component.prototype.getDistress = function () {
        this.dangerConditionValid = true;
        this.Distress = "true";
    };
    Page5Component.prototype.onSearch = function (event) {
        this.show = true;
    };
    Page5Component.prototype.onSearchChange = function (event) {
        var _this = this;
        var key = event.target.value;
        this.serchlist = [];
        this.DrugHistrotyList['items'].forEach(function (item) {
            if (key == "") {
                _this.serchlist = [];
            }
            if (key != '') {
                var f = item.value.toLowerCase().substring(0, key.length);
                if (key === f) {
                    _this.serchlist.push({ 'value': item.value, 'code': item.code });
                }
            }
        });
    };
    Page5Component.prototype.set = function (i) {
        this.drugCode = i['code'];
        this.val = i['value'];
        this.ShowDrugList.push(this.val);
        var customObj = new _drugHistory__WEBPACK_IMPORTED_MODULE_6__["drugHistroy"]();
        customObj.triageID = '';
        customObj.strDrugCode = this.drugCode;
        customObj.strRouteCode = "";
        this.drugHistoryList.push(customObj);
        this.serchlist = [];
        this.searchText = "";
    };
    // getDrug(id:any,name:any){
    //   this.drugName=name;
    //   this.drugCode=id;
    //   alert(this.drugCode);
    //   let customObj = new drugHistroy();
    //   customObj.triageID= localStorage.getItem('locationID');
    //   customObj.strDrugCode=this.drugCode;
    //   customObj.strRouteCode="";
    //   this.drugHistoryList.push(customObj)
    //
    //   this.show=false;
    //   this.searchText=this.drugName
    // }
    Page5Component.prototype.onSubmit = function () {
        var _this = this;
        this.PainScale = this.level2Form.value['PainScale'].toString();
        this.spO2 = this.level2Form.value['spO2'];
        this.bPMax = this.level2Form.value['bPMax'];
        this.bPMin = this.level2Form.value['bPMin'];
        this.PR = this.level2Form.value['PR'];
        this.RR = this.level2Form.value['RR'];
        this.Temperature = this.level2Form.value['Temperature'];
        this._lvl2.createTriage(this.sensetiveFoodType, this.departure, this.Separation, this.gender, this.age, this.ageType, this.name, this.lastName, this.nationalCode, this.TransportList, this.birthDate, this.lastDay, this.admissionKind, this.MainDisease, this.patientIsNotIdentity, this.HighRiskSituation, this.Confused, this.Distress, this.PainScale, this.spO2, this.bPMax, this.bPMin, this.PR, this.RR, this.Temperature, this.drugHistoryList, this.hasDrugAllery, this.drugList, this.FoodSensitivityObjList, this.eOtherCasesMainDisease, this.admissionKindTextList).subscribe(function (res) {
            console.log(res);
            _this.showResult = true;
            if (res.success === true) {
                _this.succsess = res.success;
                _this.ISsubmitOK = true;
                _this.triageID = res.trackingNumber;
                // this.result=res.errorMessage
            }
            if (res.success === false) {
                _this.isSubmitError = true;
                _this.result = res.errorMessage;
            }
            _this._item.getMainDiseaseList().subscribe(function (res) {
                _this.mainDiseaseArray = res;
                for (var _i = 0, _a = _this.mainDiseaseArray; _i < _a.length; _i++) {
                    var i = _a[_i];
                    for (var _b = 0, _c = _this.MainIDArray; _b < _c.length; _b++) {
                        var q = _c[_b];
                        if (q == i.id) {
                            _this.mainVAlueArray.push(i.mainDiseaseValue);
                        }
                    }
                }
            });
            _this._Save.ByID(_this.triageID).subscribe(function (res) {
                _this.triazhInfo = res;
                _this.pracID = _this.triazhInfo['item']['triage_PracID'];
                _this.bpPrint = parseInt(_this.triazhInfo['item']['bp']);
                _this.bpPrint = Math.round(_this.bpPrint);
                _this.prPrint = parseInt(_this.triazhInfo['item']['pr']);
                _this.prPrint = Math.round(_this.prPrint);
                _this.rrPrint = parseInt(_this.triazhInfo['item']['rr']);
                _this.rrPrint = Math.round(_this.rrPrint);
                _this.tPrint = parseInt(_this.triazhInfo['item']['t']);
                _this.tPrint = Math.round(_this.tPrint);
                _this.spo2Print = parseInt(_this.triazhInfo['item']['spo2']);
                _this.spo2Print = Math.round(_this.spo2Print);
                _this.painPrint = parseInt(_this.triazhInfo['item']['intensityOfPain']);
                _this.painPrint = Math.round(_this.painPrint);
                _this.Time = _this.triazhInfo['item']['entranceTime'];
                _this.Time = _this.Time.substr(_this.Time.length - 5);
                for (var _i = 0, _a = _this.triazhInfo['item']['triageAllergyDrugs']; _i < _a.length; _i++) {
                    var a = _a[_i];
                    _this.AlleryDrug.push(a.sepas_ERXCode);
                }
                for (var _b = 0, _c = _this.triazhInfo['item']['triageDrugHistory']; _b < _c.length; _b++) {
                    var i = _c[_b];
                    _this.drugCode = i.strDrugCode;
                    _this.drugCode = _this.drugCode.trim();
                    _this.drugCodeArray.push(_this.drugCode);
                }
                for (var _d = 0, _e = _this.AllergyDrugListSepas['items']; _d < _e.length; _d++) {
                    var i = _e[_d];
                    for (var _f = 0, _g = _this.AlleryDrug; _f < _g.length; _f++) {
                        var x = _g[_f];
                        if (i.code == x) {
                            _this.allergyDrugVAlue.push(i.value);
                        }
                    }
                    for (var _h = 0, _j = _this.drugCodeArray; _h < _j.length; _h++) {
                        var q = _j[_h];
                        if (i.code == q) {
                            _this.drugListArray.push(i.value);
                        }
                    }
                }
                _this.allergyDrugVAlue.forEach(function (item) {
                    _this.aleryDrugFinaly.push(item.substr(0, item.indexOf(' ')));
                });
                _this.drugListArray.forEach(function (item) {
                    _this.drugListFinalArray.push(item.substr(0, item.indexOf(' ')));
                });
                _this._item.postPracID(_this.pracID).subscribe(function (res) {
                    _this.pracInfo = res;
                    console.log("نام پرستار", res);
                });
            });
        });
        // this.router.navigate(['/teriazh/page2']);
    };
    Page5Component.prototype.send = function () {
        this._End.endTtiazh(this.triageID).subscribe(function (res) {
        });
        localStorage.removeItem('firstname');
        localStorage.removeItem('AdmissionKind');
        localStorage.removeItem('age');
        localStorage.removeItem('nationalCode');
        localStorage.removeItem('birthDatepatient');
        localStorage.removeItem('genderType');
        localStorage.removeItem('item');
        localStorage.removeItem('LastName');
        localStorage.removeItem('MainDisease');
        localStorage.setItem('reload', '1');
        this.router.navigate(['/teriazh/Patient-Triage']);
    };
    Page5Component.prototype.close = function () {
        this.showResult = false;
        this.printOK = true;
    };
    Page5Component.prototype.ngOnInit = function () {
        var _this = this;
        // this.PRInput=0;
        this._item.getHospitalName().subscribe(function (res) {
            _this.hospital = res;
        });
        this.nurseFirstName = localStorage.getItem('nurseFirstName');
        this.nurstLastName = localStorage.getItem('nurseLastName');
        this._item.GetSepasList().subscribe(function (res) {
            _this.AllergyDrugListSepas = res;
        });
        this._item.getFoodSensitivityList().subscribe(function (res) {
            _this.foodLIst = res;
        });
        this._item.GetSepasList().subscribe(function (res) {
            _this.DrugHistrotyList = res;
        });
        this.list = this._service.gettodos();
        this._item.getFoodSensitivityList().subscribe(function (res) {
            _this.foodLIst = res;
            for (var _i = 0, _a = _this.foodLIst; _i < _a.length; _i++) {
                var a = _a[_i];
                for (var _b = 0, _c = _this.FoodcodeArray; _b < _c.length; _b++) {
                    var q = _c[_b];
                    if (q == a.Key) {
                        _this.foodAllerguValue.push(a.Value);
                    }
                }
            }
        });
        this._item.GetSeparationByInfectionList().subscribe(function (res) {
            _this.SeparationByInfectionList = res;
        });
        this._item.getDepartureList().subscribe(function (res) {
            _this.departureList = res;
        });
        this._item.getTransportList().subscribe(function (res) {
            _this.TransportArray = res;
            _this.TransportArray.forEach(function (i) {
                if (i.Key == _this.TransportList) {
                    _this.transporterValue = i.Value;
                }
            });
        });
        this.level2Form = new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormGroup"]({
            'Separation': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](''),
            'Departure': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](''),
            'HighRiskSituation': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](''),
            'Confused': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](''),
            'Distress': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](''),
            'PainScale': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](''),
            'spO2': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](''),
            'bPMax': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](''),
            'bPMin': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](''),
            'PR': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](''),
            'RR': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](''),
            'Temperature': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](''),
        });
        this.lastDay = this.list[0]["24Hourses"];
        this.MainDisease = this.list[0]["MainDisease"];
        for (var _i = 0, _a = this.MainDisease; _i < _a.length; _i++) {
            var i = _a[_i];
            this.MainIDArray.push(i.mainDiseaseID);
        }
        this.TransportList = this.list[0]["TransportList"];
        this.admissionKind = this.list[0]["admissionKind"];
        this.age = this.list[0]["age"];
        this.ageType = this.list[0]["ageType"];
        this.birthDate = this.list[0]["birthDate"];
        this.entrnaceType = this.list[0]["entrnaceType"];
        this.gender = this.list[0]["gender"];
        this.lastName = this.list[0]["lastName"];
        this.name = this.list[0]["name"];
        this.nationalCode = this.list[0]["nationalCode"];
        this.pregmentType = this.list[0]["pregmentType"];
        this.FoodSensitivity = this.list[0]["FoodSensitivity"];
        this.sensetiveFoodType = this.list[0]["sensetiveFoodType"];
        this.FoodSensitivityObjList = this.list[0]["FoodSensitivity"];
        for (var _b = 0, _c = this.FoodSensitivityObjList; _b < _c.length; _b++) {
            var i = _c[_b];
            this.FoodcodeArray.push(i.foodSensitivityValue);
        }
        this.hasDrugAllery = this.list[0]["Allergy"];
        this.drugList = this.list[0]["DrugSensitive"];
        this.eOtherCasesMainDisease = this.list[0]['othermainDeseasePush'];
        this.admissionKindTextList = this.list[0]['admissionKindTextList'];
        this.patientIsNotIdentity = this.list[0]["patientIsNotIdentity"];
        if (this.patientIsNotIdentity === "1") {
            this.birthDate = "";
        }
    };
    Page5Component.ctorParameters = function () { return [
        { type: _services_CreatTeriage_creat_new_teriage_service__WEBPACK_IMPORTED_MODULE_2__["CreatNewTeriageService"] },
        { type: _services_CreatTeriage_creat_level2_service__WEBPACK_IMPORTED_MODULE_5__["CreatLevel2Service"] },
        { type: _services_teriajItems_teriaj_items_service__WEBPACK_IMPORTED_MODULE_4__["TeriajItemsService"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_7__["ActivatedRoute"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_7__["Router"] },
        { type: _services_getById_get_by_triage_id_service__WEBPACK_IMPORTED_MODULE_8__["GetByTriageIdService"] },
        { type: _services_end_of_triage_service__WEBPACK_IMPORTED_MODULE_9__["EndOfTriageService"] },
        { type: _services_apiConfig_api_config_service__WEBPACK_IMPORTED_MODULE_10__["ApiConfigService"] }
    ]; };
    Page5Component = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-page5',
            template: __webpack_require__(/*! raw-loader!./page5.component.html */ "./node_modules/raw-loader/index.js!./src/app/teriazh/page5/page5.component.html"),
            styles: [__webpack_require__(/*! ./page5.component.scss */ "./src/app/teriazh/page5/page5.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_CreatTeriage_creat_new_teriage_service__WEBPACK_IMPORTED_MODULE_2__["CreatNewTeriageService"],
            _services_CreatTeriage_creat_level2_service__WEBPACK_IMPORTED_MODULE_5__["CreatLevel2Service"],
            _services_teriajItems_teriaj_items_service__WEBPACK_IMPORTED_MODULE_4__["TeriajItemsService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_7__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_7__["Router"],
            _services_getById_get_by_triage_id_service__WEBPACK_IMPORTED_MODULE_8__["GetByTriageIdService"],
            _services_end_of_triage_service__WEBPACK_IMPORTED_MODULE_9__["EndOfTriageService"],
            _services_apiConfig_api_config_service__WEBPACK_IMPORTED_MODULE_10__["ApiConfigService"]])
    ], Page5Component);
    return Page5Component;
}());



/***/ }),

/***/ "./src/app/teriazh/page6/page6.component.scss":
/*!****************************************************!*\
  !*** ./src/app/teriazh/page6/page6.component.scss ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3RlcmlhemgvcGFnZTYvcGFnZTYuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/teriazh/page6/page6.component.ts":
/*!**************************************************!*\
  !*** ./src/app/teriazh/page6/page6.component.ts ***!
  \**************************************************/
/*! exports provided: Page6Component */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Page6Component", function() { return Page6Component; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_CreatTeriage_creat_new_teriage_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/CreatTeriage/creat-new-teriage.service */ "./src/app/services/CreatTeriage/creat-new-teriage.service.ts");
/* harmony import */ var _services_teriajItems_teriaj_items_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/teriajItems/teriaj-items.service */ "./src/app/services/teriajItems/teriaj-items.service.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _services_CreatTeriage_creatlevel5_creatlevel5_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/CreatTeriage/creatlevel5/creatlevel5.service */ "./src/app/services/CreatTeriage/creatlevel5/creatlevel5.service.ts");
/* harmony import */ var _services_getById_get_by_triage_id_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../services/getById/get-by-triage-id.service */ "./src/app/services/getById/get-by-triage-id.service.ts");
/* harmony import */ var _services_end_of_triage_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../services/end-of-triage.service */ "./src/app/services/end-of-triage.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_apiConfig_api_config_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../services/apiConfig/api-config.service */ "./src/app/services/apiConfig/api-config.service.ts");










var Page6Component = /** @class */ (function () {
    function Page6Component(_service, _item, _lvl4, _Save, _End, router, i) {
        this._service = _service;
        this._item = _item;
        this._lvl4 = _lvl4;
        this._Save = _Save;
        this._End = _End;
        this.router = router;
        this.i = i;
        this.pracID = "";
        this.MainIDArray = new Array();
        this.mainVAlueArray = new Array();
        this.Time = "";
        this.transporterValue = "";
        this.FoodcodeArray = new Array();
        this.foodAllerguValue = new Array();
        this.aleryDrugFinaly = new Array();
        this.AlleryDrug = new Array();
        this.allergyDrugVAlue = new Array();
        this.mainDiseaseArray = new Array();
        this.Separation = '';
        this.departure = "";
        this.lastDay = "";
        this.MainDisease = new Array();
        this.TransportList = "";
        this.admissionKind = new Array();
        this.drugList = new Array();
        this.age = "";
        this.ageType = "";
        this.birthDate = "";
        this.entrnaceType = "";
        this.gender = "";
        this.lastName = "";
        this.name = "";
        this.FoodSensitivityObjList = new Array();
        this.nationalCode = "";
        this.pregmentType = "";
        this.sensetiveFoodType = "";
        this.hasDrugAllery = "";
        this.patientIsNotIdentity = "";
        this.eOtherCasesMainDisease = new Array();
        this.admissionKindTextList = new Array();
        this.triageID = "";
        this.idter = "";
        this.idterTXT = "";
        this.printOK = false;
        this.ISsubmitOK = false;
        this.succsess = "";
        this.showResult = false;
        this.isSubmitError = false;
        this.result = "";
        this.refeValid = false;
        this._item.seturl(this.i.config.API_URL);
        this._lvl4.seturl(this.i.config.API_URL);
        this._Save.seturl(this.i.config.API_URL);
        this._End.seturl(this.i.config.API_URL);
    }
    Page6Component.prototype.onSubmit = function () {
        var _this = this;
        this.level4Form.value.Departure = this.departure;
        this.level4Form.value.Separation = this.Separation;
        this._lvl4.creatTriageLvl4And5(this.sensetiveFoodType, this.departure, this.Separation, this.gender, this.age, this.ageType, this.name, this.lastName, this.nationalCode, this.TransportList, this.birthDate, this.lastDay, this.admissionKind, this.MainDisease, this.patientIsNotIdentity, this.hasDrugAllery, this.drugList, this.FoodSensitivityObjList, this.eOtherCasesMainDisease, this.admissionKindTextList).subscribe(function (res) {
            console.log(res);
            _this.showResult = true;
            if (res.success === true) {
                _this.succsess = res.success;
                _this.ISsubmitOK = true;
                _this.triageID = res.trackingNumber;
                console.log(_this.triageID);
                // this.result=res.errorMessage
            }
            if (res.success === false) {
                _this.isSubmitError = true;
                _this.result = res.errorMessage;
            }
            _this._Save.ByID(_this.triageID).subscribe(function (res) {
                _this.triazhInfo = res;
                console.log(_this.triazhInfo);
                _this.pracID = _this.triazhInfo['item']['triage_PracID'];
                _this.Time = _this.triazhInfo['item']['entranceTime'];
                _this.Time = _this.Time.substr(_this.Time.length - 5);
                _this._item.postPracID(_this.pracID).subscribe(function (res) {
                    _this.pracInfo = res;
                    console.log("نام پرستار", res);
                });
                for (var _i = 0, _a = _this.triazhInfo['item']['triageAllergyDrugs']; _i < _a.length; _i++) {
                    var a = _a[_i];
                    _this.AlleryDrug.push(a.sepas_ERXCode);
                    console.log(_this.AlleryDrug);
                }
                for (var _b = 0, _c = _this.AllergyDrugListSepas['items']; _b < _c.length; _b++) {
                    var i = _c[_b];
                    for (var _d = 0, _e = _this.AlleryDrug; _d < _e.length; _d++) {
                        var x = _e[_d];
                        if (i.code == x) {
                            _this.allergyDrugVAlue.push(i.value);
                        }
                    }
                }
                _this.allergyDrugVAlue.forEach(function (item) {
                    _this.aleryDrugFinaly.push(item.substr(0, item.indexOf(' ')));
                    console.log(_this.aleryDrugFinaly);
                });
            });
        });
    };
    Page6Component.prototype.getSeparationByInfectionList = function (id, i) {
        this.Separation = id.toString();
        for (var _i = 0, _a = this.SeparationByInfectionList; _i < _a.length; _i++) {
            var myChild = _a[_i];
            myChild.BackgroundColour = "white";
            i.BackgroundColour = "#44b5b7";
            myChild.color = "black";
            i.color = 'white';
        }
    };
    Page6Component.prototype.close = function () {
        this.ISsubmitOK = false;
        this.printOK = true;
    };
    Page6Component.prototype.getDeparture = function (id, i) {
        this.refeValid = true;
        this.departure = id.toString();
        for (var _i = 0, _a = this.departureList; _i < _a.length; _i++) {
            var myChild = _a[_i];
            myChild.BackgroundColour = "white";
            i.BackgroundColour = "#44b5b7";
            myChild.color = "black";
            i.color = 'white';
        }
    };
    Page6Component.prototype.send = function () {
        var _this = this;
        this._Save.ByID(this.triageID).subscribe(function (res) {
            _this.triazhInfo = res;
            localStorage.removeItem('firstname');
            localStorage.removeItem('AdmissionKind');
            localStorage.removeItem('age');
            localStorage.removeItem('nationalCode');
            localStorage.removeItem('birthDatepatient');
            localStorage.removeItem('genderType');
            localStorage.removeItem('item');
            localStorage.removeItem('LastName');
            localStorage.removeItem('MainDisease');
            localStorage.setItem('reload', '1');
            _this.router.navigate(['/teriazh/Patient-Triage']);
        });
        this._End.endTtiazh(this.triageID).subscribe(function (res) {
            console.log(res);
        });
    };
    Page6Component.prototype.ngOnInit = function () {
        var _this = this;
        this._item.GetSepasList().subscribe(function (res) {
            _this.AllergyDrugListSepas = res;
        });
        this._item.getFoodSensitivityList().subscribe(function (res) {
            _this.foodLIst = res;
            for (var _i = 0, _a = _this.foodLIst; _i < _a.length; _i++) {
                var a = _a[_i];
                for (var _b = 0, _c = _this.FoodcodeArray; _b < _c.length; _b++) {
                    var q = _c[_b];
                    if (q == a.Key) {
                        _this.foodAllerguValue.push(a.Value);
                    }
                }
            }
        });
        this._item.getMainDiseaseList().subscribe(function (res) {
            _this.mainDiseaseArray = res;
            for (var _i = 0, _a = _this.mainDiseaseArray; _i < _a.length; _i++) {
                var i = _a[_i];
                for (var _b = 0, _c = _this.MainIDArray; _b < _c.length; _b++) {
                    var q = _c[_b];
                    if (q == i.id) {
                        _this.mainVAlueArray.push(i.mainDiseaseValue);
                    }
                }
            }
        });
        this._item.getTransportList().subscribe(function (res) {
            _this.transportArray = res;
            _this.transportArray.forEach(function (i) {
                if (i.Key == _this.TransportList) {
                    _this.transporterValue = i.Value;
                }
            });
        });
        this._item.getHospitalName().subscribe(function (res) {
            _this.hospital = res;
        });
        this.level4Form = new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormGroup"]({
            'Departure': new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControl"](''),
            'Separation': new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControl"](''),
        });
        this._item.GetSeparationByInfectionList().subscribe(function (res) {
            _this.SeparationByInfectionList = res;
        });
        this._item.getDepartureList().subscribe(function (res) {
            _this.departureList = res;
        });
        this.list = this._service.gettodos();
        this.lastDay = this.list[0]["24Hourses"];
        this.MainDisease = this.list[0]["MainDisease"];
        for (var _i = 0, _a = this.MainDisease; _i < _a.length; _i++) {
            var i = _a[_i];
            this.MainIDArray.push(i.mainDiseaseID);
        }
        this.TransportList = this.list[0]["TransportList"];
        this.admissionKind = this.list[0]["admissionKind"];
        this.drugList = this.list[0]["DrugSensitive"];
        console.log(this.drugList);
        this.age = this.list[0]["age"];
        this.ageType = this.list[0]["ageType"];
        this.birthDate = this.list[0]["birthDate"];
        this.entrnaceType = this.list[0]["entrnaceType"];
        this.gender = this.list[0]["gender"];
        this.lastName = this.list[0]["lastName"];
        this.name = this.list[0]["name"];
        this.FoodSensitivityObjList = this.list[0]["FoodSensitivity"];
        for (var _b = 0, _c = this.FoodSensitivityObjList; _b < _c.length; _b++) {
            var i = _c[_b];
            this.FoodcodeArray.push(i.foodSensitivityValue);
        }
        this.nationalCode = this.list[0]["nationalCode"];
        this.pregmentType = this.list[0]["pregmentType"];
        this.sensetiveFoodType = this.list[0]["sensetiveFoodType"];
        this.hasDrugAllery = this.list[0]["Allergy"];
        // this.admissionKindText=this.list[0]["admissionKindText"];
        // this.MainDiseaseText=this.list[0]["MainDiseaseText"];
        this.patientIsNotIdentity = this.list[0]["patientIsNotIdentity"];
        this.eOtherCasesMainDisease = this.list[0]['othermainDeseasePush'];
        this.admissionKindTextList = this.list[0]['admissionKindTextList'];
        if (this.patientIsNotIdentity === "1") {
            this.birthDate = "";
        }
    };
    Page6Component.ctorParameters = function () { return [
        { type: _services_CreatTeriage_creat_new_teriage_service__WEBPACK_IMPORTED_MODULE_2__["CreatNewTeriageService"] },
        { type: _services_teriajItems_teriaj_items_service__WEBPACK_IMPORTED_MODULE_3__["TeriajItemsService"] },
        { type: _services_CreatTeriage_creatlevel5_creatlevel5_service__WEBPACK_IMPORTED_MODULE_5__["Creatlevel5Service"] },
        { type: _services_getById_get_by_triage_id_service__WEBPACK_IMPORTED_MODULE_6__["GetByTriageIdService"] },
        { type: _services_end_of_triage_service__WEBPACK_IMPORTED_MODULE_7__["EndOfTriageService"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_8__["Router"] },
        { type: _services_apiConfig_api_config_service__WEBPACK_IMPORTED_MODULE_9__["ApiConfigService"] }
    ]; };
    Page6Component = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-page6',
            template: __webpack_require__(/*! raw-loader!./page6.component.html */ "./node_modules/raw-loader/index.js!./src/app/teriazh/page6/page6.component.html"),
            styles: [__webpack_require__(/*! ./page6.component.scss */ "./src/app/teriazh/page6/page6.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_CreatTeriage_creat_new_teriage_service__WEBPACK_IMPORTED_MODULE_2__["CreatNewTeriageService"],
            _services_teriajItems_teriaj_items_service__WEBPACK_IMPORTED_MODULE_3__["TeriajItemsService"],
            _services_CreatTeriage_creatlevel5_creatlevel5_service__WEBPACK_IMPORTED_MODULE_5__["Creatlevel5Service"],
            _services_getById_get_by_triage_id_service__WEBPACK_IMPORTED_MODULE_6__["GetByTriageIdService"],
            _services_end_of_triage_service__WEBPACK_IMPORTED_MODULE_7__["EndOfTriageService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_8__["Router"],
            _services_apiConfig_api_config_service__WEBPACK_IMPORTED_MODULE_9__["ApiConfigService"]])
    ], Page6Component);
    return Page6Component;
}());



/***/ }),

/***/ "./src/app/teriazh/page7/page7.component.scss":
/*!****************************************************!*\
  !*** ./src/app/teriazh/page7/page7.component.scss ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3RlcmlhemgvcGFnZTcvcGFnZTcuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/teriazh/page7/page7.component.ts":
/*!**************************************************!*\
  !*** ./src/app/teriazh/page7/page7.component.ts ***!
  \**************************************************/
/*! exports provided: Page7Component */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Page7Component", function() { return Page7Component; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_getById_get_by_triage_id_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/getById/get-by-triage-id.service */ "./src/app/services/getById/get-by-triage-id.service.ts");
/* harmony import */ var _services_teriajItems_teriaj_items_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/teriajItems/teriaj-items.service */ "./src/app/services/teriajItems/teriaj-items.service.ts");
/* harmony import */ var _services_end_of_triage_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/end-of-triage.service */ "./src/app/services/end-of-triage.service.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _services_CreatTeriage_creatlevel5_creatlevel4_creatlvl4_triage_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../services/CreatTeriage/creatlevel5/creatlevel4/creatlvl4-triage.service */ "./src/app/services/CreatTeriage/creatlevel5/creatlevel4/creatlvl4-triage.service.ts");
/* harmony import */ var _services_CreatTeriage_creat_new_teriage_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../services/CreatTeriage/creat-new-teriage.service */ "./src/app/services/CreatTeriage/creat-new-teriage.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_apiConfig_api_config_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../services/apiConfig/api-config.service */ "./src/app/services/apiConfig/api-config.service.ts");










var Page7Component = /** @class */ (function () {
    function Page7Component(_service, _item, _Save, _End, _lvl4, router, i) {
        this._service = _service;
        this._item = _item;
        this._Save = _Save;
        this._End = _End;
        this._lvl4 = _lvl4;
        this.router = router;
        this.i = i;
        this.pracID = "";
        this.MainIDArray = new Array();
        this.mainVAlueArray = new Array();
        this.Time = "";
        this.transporterValue = "";
        this.FoodcodeArray = new Array();
        this.foodAllerguValue = new Array();
        this.aleryDrugFinaly = new Array();
        this.AlleryDrug = new Array();
        this.allergyDrugVAlue = new Array();
        this.mainDiseaseArray = new Array();
        this.Separation = '';
        this.departure = "";
        this.lastDay = "";
        this.MainDisease = new Array();
        this.TransportList = "";
        this.admissionKind = new Array();
        this.drugList = new Array();
        this.age = "";
        this.ageType = "";
        this.birthDate = "";
        this.entrnaceType = "";
        this.gender = "";
        this.lastName = "";
        this.name = "";
        this.FoodSensitivityObjList = new Array();
        this.nationalCode = "";
        this.pregmentType = "";
        this.sensetiveFoodType = "";
        this.hasDrugAllery = "";
        this.patientIsNotIdentity = "";
        this.eOtherCasesMainDisease = new Array();
        this.admissionKindTextList = new Array();
        this.idterTXT = "";
        this.triageID = "";
        this.idter = "";
        this.printOK = false;
        this.ISsubmit = false;
        this.succsess = "";
        this.showResult = false;
        this.ISsubmitOK = false;
        this.isSubmitError = false;
        this.result = "";
        this.refeValid = false;
        this._item.seturl(this.i.config.API_URL);
        this._lvl4.seturl(this.i.config.API_URL);
        this._Save.seturl(this.i.config.API_URL);
        this._End.seturl(this.i.config.API_URL);
    }
    Page7Component.prototype.send = function () {
        // this._Save.ByID(this.idterTXT).subscribe(res=>{
        //     this.triazhInfo=res;
        //     console.log(res)
        //
        //
        // });
        this._End.endTtiazh(this.triageID).subscribe(function (res) {
            console.log(res);
        });
        localStorage.removeItem('firstname');
        localStorage.removeItem('AdmissionKind');
        localStorage.removeItem('age');
        localStorage.removeItem('nationalCode');
        localStorage.removeItem('birthDatepatient');
        localStorage.removeItem('genderType');
        localStorage.removeItem('item');
        localStorage.removeItem('LastName');
        localStorage.removeItem('MainDisease');
        localStorage.setItem('reload', '1');
        this.router.navigate(['/teriazh/Patient-Triage']);
    };
    Page7Component.prototype.close = function () {
        this.ISsubmitOK = false;
        this.printOK = true;
    };
    Page7Component.prototype.getSeparationByInfectionList = function (id, i) {
        this.Separation = id.toString();
        for (var _i = 0, _a = this.SeparationByInfectionList; _i < _a.length; _i++) {
            var myChild = _a[_i];
            myChild.BackgroundColour = "white";
            i.BackgroundColour = "#44b5b7";
            myChild.color = "black";
            i.color = 'white';
        }
    };
    Page7Component.prototype.getDeparture = function (id, i) {
        this.refeValid = true;
        this.departure = id.toString();
        for (var _i = 0, _a = this.departureList; _i < _a.length; _i++) {
            var myChild = _a[_i];
            myChild.BackgroundColour = "white";
            i.BackgroundColour = "#44b5b7";
            myChild.color = "black";
            i.color = 'white';
        }
    };
    Page7Component.prototype.onSubmit = function () {
        var _this = this;
        this.level5Form.value.Departure = this.departure;
        this.level5Form.value.Separation = this.Separation;
        console.log(this.level5Form.value.Separation);
        this._lvl4.creatTriageLvl4(this.sensetiveFoodType, this.departure, this.Separation, this.gender, this.age, this.ageType, this.name, this.lastName, this.nationalCode, this.TransportList, this.birthDate, this.lastDay, this.admissionKind, this.MainDisease, this.patientIsNotIdentity, this.hasDrugAllery, this.drugList, this.FoodSensitivityObjList, this.eOtherCasesMainDisease, this.admissionKindTextList).subscribe(function (res) {
            console.log(res);
            _this.showResult = true;
            if (res.success === true) {
                _this.succsess = res.success;
                _this.ISsubmitOK = true;
                _this.triageID = res.trackingNumber;
                // this.result=res.errorMessage
            }
            if (res.success === false) {
                _this.isSubmitError = true;
                _this.result = res.errorMessage;
            }
            _this._Save.ByID(_this.triageID).subscribe(function (res) {
                _this.triazhInfo = res;
                console.log(_this.triazhInfo);
                _this.pracID = _this.triazhInfo['item']['triage_PracID'];
                _this.Time = _this.triazhInfo['item']['entranceTime'];
                _this.Time = _this.Time.substr(_this.Time.length - 5);
                _this._item.postPracID(_this.pracID).subscribe(function (res) {
                    _this.pracInfo = res;
                    console.log("نام پرستار", res);
                });
                for (var _i = 0, _a = _this.triazhInfo['item']['triageAllergyDrugs']; _i < _a.length; _i++) {
                    var a = _a[_i];
                    _this.AlleryDrug.push(a.sepas_ERXCode);
                    console.log(_this.AlleryDrug);
                }
                for (var _b = 0, _c = _this.AllergyDrugListSepas['items']; _b < _c.length; _b++) {
                    var i = _c[_b];
                    for (var _d = 0, _e = _this.AlleryDrug; _d < _e.length; _d++) {
                        var x = _e[_d];
                        if (i.code == x) {
                            _this.allergyDrugVAlue.push(i.value);
                        }
                    }
                }
                _this.allergyDrugVAlue.forEach(function (item) {
                    _this.aleryDrugFinaly.push(item.substr(0, item.indexOf(' ')));
                    console.log(_this.aleryDrugFinaly);
                });
            });
        });
    };
    Page7Component.prototype.ngOnInit = function () {
        var _this = this;
        this._item.GetSepasList().subscribe(function (res) {
            _this.AllergyDrugListSepas = res;
        });
        this._item.getFoodSensitivityList().subscribe(function (res) {
            _this.foodLIst = res;
            for (var _i = 0, _a = _this.foodLIst; _i < _a.length; _i++) {
                var a = _a[_i];
                for (var _b = 0, _c = _this.FoodcodeArray; _b < _c.length; _b++) {
                    var q = _c[_b];
                    if (q == a.Key) {
                        _this.foodAllerguValue.push(a.Value);
                    }
                }
            }
        });
        this._item.getHospitalName().subscribe(function (res) {
            _this.hospital = res;
        });
        this._item.getMainDiseaseList().subscribe(function (res) {
            _this.mainDiseaseArray = res;
            for (var _i = 0, _a = _this.mainDiseaseArray; _i < _a.length; _i++) {
                var i = _a[_i];
                for (var _b = 0, _c = _this.MainIDArray; _b < _c.length; _b++) {
                    var q = _c[_b];
                    if (q == i.id) {
                        _this.mainVAlueArray.push(i.mainDiseaseValue);
                        console.log('sdpfohspoi', _this.mainVAlueArray);
                    }
                }
            }
        });
        this._item.getTransportList().subscribe(function (res) {
            _this.transportArray = res;
            _this.transportArray.forEach(function (i) {
                if (i.Key == _this.TransportList) {
                    _this.transporterValue = i.Value;
                }
            });
        });
        this.level5Form = new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormGroup"]({
            'Departure': new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](''),
            'Separation': new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](''),
        });
        this.list = this._service.gettodos();
        console.log(this.list);
        this.lastDay = this.list[0]["24Hourses"];
        this.MainDisease = this.list[0]["MainDisease"];
        for (var _i = 0, _a = this.MainDisease; _i < _a.length; _i++) {
            var i = _a[_i];
            this.MainIDArray.push(i.mainDiseaseID);
        }
        console.log(this.MainDisease);
        this.TransportList = this.list[0]["TransportList"];
        this.admissionKind = this.list[0]["admissionKind"];
        this.drugList = this.list[0]["DrugSensitive"];
        console.log(this.drugList);
        console.log(this.admissionKind);
        this.age = this.list[0]["age"];
        this.ageType = this.list[0]["ageType"];
        this.birthDate = this.list[0]["birthDate"];
        this.entrnaceType = this.list[0]["entrnaceType"];
        this.gender = this.list[0]["gender"];
        this.lastName = this.list[0]["lastName"];
        this.name = this.list[0]["name"];
        this.FoodSensitivityObjList = this.list[0]["FoodSensitivity"];
        for (var _b = 0, _c = this.FoodSensitivityObjList; _b < _c.length; _b++) {
            var i = _c[_b];
            this.FoodcodeArray.push(i.foodSensitivityValue);
        }
        this.nationalCode = this.list[0]["nationalCode"];
        console.log(this.admissionKind);
        this.pregmentType = this.list[0]["pregmentType"];
        this.sensetiveFoodType = this.list[0]["sensetiveFoodType"];
        console.log(this.sensetiveFoodType);
        this.hasDrugAllery = this.list[0]["Allergy"];
        // this.admissionKindText=this.list[0]["admissionKindText"];
        // this.MainDiseaseText=this.list[0]["MainDiseaseText"];
        this.patientIsNotIdentity = this.list[0]["patientIsNotIdentity"];
        this.eOtherCasesMainDisease = this.list[0]['othermainDeseasePush'];
        this.admissionKindTextList = this.list[0]['admissionKindTextList'];
        console.log(this.list);
        console.log(typeof (this.age));
        this._item.GetSeparationByInfectionList().subscribe(function (res) {
            _this.SeparationByInfectionList = res;
        });
        this._item.getDepartureList().subscribe(function (res) {
            _this.departureList = res;
        });
        if (this.patientIsNotIdentity === "1") {
            this.birthDate = "";
        }
    };
    Page7Component.ctorParameters = function () { return [
        { type: _services_CreatTeriage_creat_new_teriage_service__WEBPACK_IMPORTED_MODULE_7__["CreatNewTeriageService"] },
        { type: _services_teriajItems_teriaj_items_service__WEBPACK_IMPORTED_MODULE_3__["TeriajItemsService"] },
        { type: _services_getById_get_by_triage_id_service__WEBPACK_IMPORTED_MODULE_2__["GetByTriageIdService"] },
        { type: _services_end_of_triage_service__WEBPACK_IMPORTED_MODULE_4__["EndOfTriageService"] },
        { type: _services_CreatTeriage_creatlevel5_creatlevel4_creatlvl4_triage_service__WEBPACK_IMPORTED_MODULE_6__["Creatlvl4TriageService"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_8__["Router"] },
        { type: _services_apiConfig_api_config_service__WEBPACK_IMPORTED_MODULE_9__["ApiConfigService"] }
    ]; };
    Page7Component = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-page7',
            template: __webpack_require__(/*! raw-loader!./page7.component.html */ "./node_modules/raw-loader/index.js!./src/app/teriazh/page7/page7.component.html"),
            styles: [__webpack_require__(/*! ./page7.component.scss */ "./src/app/teriazh/page7/page7.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_CreatTeriage_creat_new_teriage_service__WEBPACK_IMPORTED_MODULE_7__["CreatNewTeriageService"],
            _services_teriajItems_teriaj_items_service__WEBPACK_IMPORTED_MODULE_3__["TeriajItemsService"],
            _services_getById_get_by_triage_id_service__WEBPACK_IMPORTED_MODULE_2__["GetByTriageIdService"],
            _services_end_of_triage_service__WEBPACK_IMPORTED_MODULE_4__["EndOfTriageService"],
            _services_CreatTeriage_creatlevel5_creatlevel4_creatlvl4_triage_service__WEBPACK_IMPORTED_MODULE_6__["Creatlvl4TriageService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_8__["Router"],
            _services_apiConfig_api_config_service__WEBPACK_IMPORTED_MODULE_9__["ApiConfigService"]])
    ], Page7Component);
    return Page7Component;
}());



/***/ }),

/***/ "./src/app/teriazh/page8/page8.component.scss":
/*!****************************************************!*\
  !*** ./src/app/teriazh/page8/page8.component.scss ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3RlcmlhemgvcGFnZTgvcGFnZTguY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/teriazh/page8/page8.component.ts":
/*!**************************************************!*\
  !*** ./src/app/teriazh/page8/page8.component.ts ***!
  \**************************************************/
/*! exports provided: Page8Component */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Page8Component", function() { return Page8Component; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _services_teriajItems_teriaj_items_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/teriajItems/teriaj-items.service */ "./src/app/services/teriajItems/teriaj-items.service.ts");
/* harmony import */ var _services_CreatTeriage_creat_new_teriage_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/CreatTeriage/creat-new-teriage.service */ "./src/app/services/CreatTeriage/creat-new-teriage.service.ts");
/* harmony import */ var _services_CreatTeriage_creatlvl3_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/CreatTeriage/creatlvl3.service */ "./src/app/services/CreatTeriage/creatlvl3.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_getById_get_by_triage_id_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../services/getById/get-by-triage-id.service */ "./src/app/services/getById/get-by-triage-id.service.ts");
/* harmony import */ var _services_end_of_triage_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../services/end-of-triage.service */ "./src/app/services/end-of-triage.service.ts");
/* harmony import */ var _services_apiConfig_api_config_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../services/apiConfig/api-config.service */ "./src/app/services/apiConfig/api-config.service.ts");










var Page8Component = /** @class */ (function () {
    function Page8Component(_item, _service, _lvl3, route, router, _Save, _End, i) {
        this._item = _item;
        this._service = _service;
        this._lvl3 = _lvl3;
        this.route = route;
        this.router = router;
        this._Save = _Save;
        this._End = _End;
        this.i = i;
        this.Time = "";
        this.pracID = "";
        this.AlleryDrug = new Array();
        this.foodAllerguValue = new Array();
        this.FoodcodeArray = new Array();
        this.mainVAlueArray = new Array();
        this.MainIDArray = new Array();
        this.drugListArray = new Array();
        this.allergyDrugVAlue = new Array();
        this.aleryDrugFinaly = new Array();
        this.TransporterArray = new Array();
        this.transporterValue = "";
        this.nurseFirstName = "";
        this.nurstLastName = "";
        this.lastDay = "";
        this.MainDisease = new Array();
        this.TransportList = "";
        this.admissionKind = new Array();
        this.age = "";
        this.ageType = "";
        this.birthDate = "";
        this.entrnaceType = "";
        this.gender = "";
        this.lastName = "";
        this.name = "";
        this.nationalCode = "";
        this.pregmentType = "";
        this.sensetiveFoodType = "";
        this.patientIsNotIdentity = "";
        this.spO2 = "";
        this.bPMax = '';
        this.bPMin = "";
        this.PR = "";
        this.RR = "";
        this.Temperature = "";
        this.departure = "";
        this.Separation = "";
        this.hasDrugAllery = "";
        this.drugList = new Array();
        this.FoodSensitivity = "";
        this.eOtherCasesMainDisease = new Array();
        this.admissionKindTextList = new Array();
        this.FoodSensitivityObjList = new Array();
        this.triageID = "";
        this.idter = "";
        this.idterTXT = "";
        this.printOK = false;
        this.ISsubmit = false;
        this.succsess = "";
        this.showResult = false;
        this.isSubmitError = false;
        this.ISsubmitOK = false;
        this.result = "";
        this.refeValid = false;
        this._item.seturl(this.i.config.API_URL);
        this._lvl3.seturl(this.i.config.API_URL);
        this._Save.seturl(this.i.config.API_URL);
        this._End.seturl(this.i.config.API_URL);
    }
    Page8Component.prototype.onSubmit = function () {
        var _this = this;
        this.spO2 = this.level3Form.value.Spo2;
        this.bPMax = this.level3Form.value.BPmax;
        this.bPMin = this.level3Form.value.bPMin;
        this.PR = this.level3Form.value.PR;
        this.RR = this.level3Form.value.RR;
        this.Temperature = this.level3Form.value.Temperature;
        this._lvl3.creattriage(this.sensetiveFoodType, this.departure, this.Separation, this.gender, this.age, this.ageType, this.name, this.lastName, this.nationalCode, this.TransportList, this.birthDate, this.lastDay, this.admissionKind, this.MainDisease, this.patientIsNotIdentity, this.spO2, this.bPMax, this.bPMin, this.PR, this.RR, this.Temperature, this.hasDrugAllery, this.drugList, this.FoodSensitivityObjList, this.eOtherCasesMainDisease, this.admissionKindTextList).subscribe(function (res) {
            console.log(res);
            _this.showResult = true;
            if (res.success === true) {
                _this.succsess = res.success;
                _this.ISsubmitOK = true;
                _this.triageID = res.trackingNumber;
                // this.result=res.errorMessage
            }
            if (res.success === false) {
                _this.isSubmitError = true;
                _this.result = res.errorMessage;
            }
            _this._Save.ByID(_this.triageID).subscribe(function (res) {
                _this.triazhInfo = res;
                _this.pracID = _this.triazhInfo['item']['triage_PracID'];
                _this.Time = _this.triazhInfo['item']['entranceTime'];
                _this.Time = _this.Time.substr(_this.Time.length - 5);
                _this.bpPrint = parseInt(_this.triazhInfo['item']['bp']);
                _this.bpPrint = Math.round(_this.bpPrint);
                _this.prPrint = parseInt(_this.triazhInfo['item']['pr']);
                _this.prPrint = Math.round(_this.prPrint);
                _this.rrPrint = parseInt(_this.triazhInfo['item']['rr']);
                _this.rrPrint = Math.round(_this.rrPrint);
                _this.tPrint = parseInt(_this.triazhInfo['item']['t']);
                _this.tPrint = Math.round(_this.tPrint);
                _this.spo2Print = parseInt(_this.triazhInfo['item']['spo2']);
                _this.spo2Print = Math.round(_this.spo2Print);
                _this.painPrint = parseInt(_this.triazhInfo['item']['intensityOfPain']);
                _this.painPrint = Math.round(_this.painPrint);
                for (var _i = 0, _a = _this.triazhInfo['item']['triageAllergyDrugs']; _i < _a.length; _i++) {
                    var a = _a[_i];
                    _this.AlleryDrug.push(a.sepas_ERXCode);
                }
                for (var _b = 0, _c = _this.AllergyDrugListSepas['items']; _b < _c.length; _b++) {
                    var i = _c[_b];
                    for (var _d = 0, _e = _this.AlleryDrug; _d < _e.length; _d++) {
                        var x = _e[_d];
                        if (i.code == x) {
                            _this.allergyDrugVAlue.push(i.value);
                        }
                    }
                }
                _this.allergyDrugVAlue.forEach(function (item) {
                    _this.aleryDrugFinaly.push(item.substr(0, item.indexOf(' ')));
                });
                _this._item.postPracID(_this.pracID).subscribe(function (res) {
                    _this.pracInfo = res;
                    console.log("نام پرستار", res);
                });
            });
        });
        // this.router.navigate(['/teriazh/page2']);
    };
    Page8Component.prototype.send = function () {
        // this._Save.ByID(this.idterTXT).subscribe(res=>{
        //     this.triazhInfo=res;
        //     console.log(res)
        //
        //
        // });
        this._End.endTtiazh(this.triageID).subscribe(function (res) {
            console.log(res);
        });
        localStorage.removeItem('firstname');
        localStorage.removeItem('AdmissionKind');
        localStorage.removeItem('age');
        localStorage.removeItem('nationalCode');
        localStorage.removeItem('birthDatepatient');
        localStorage.removeItem('genderType');
        localStorage.removeItem('item');
        localStorage.removeItem('LastName');
        localStorage.removeItem('MainDisease');
        localStorage.setItem('reload', '1');
        this.router.navigate(['/teriazh/Patient-Triage']);
    };
    Page8Component.prototype.getDeparture = function (id, i) {
        this.departure = id.toString();
        this.refeValid = true;
        for (var _i = 0, _a = this.SeparationByInfectionList; _i < _a.length; _i++) {
            var myChild = _a[_i];
            myChild.BackgroundColour = "white";
            i.BackgroundColour = "#44b5b7";
            myChild.color = "black";
            i.color = 'white';
        }
    };
    Page8Component.prototype.getSeparationByInfectionList = function (id, i) {
        this.Separation = id.toString();
        for (var _i = 0, _a = this.SeparationByInfectionList; _i < _a.length; _i++) {
            var myChild = _a[_i];
            myChild.BackgroundColour = "white";
            i.BackgroundColour = "#44b5b7";
            myChild.color = "black";
            i.color = 'white';
        }
    };
    Page8Component.prototype.close = function () {
        this.ISsubmitOK = false;
        this.printOK = true;
    };
    Page8Component.prototype.ngOnInit = function () {
        var _this = this;
        this._item.getHospitalName().subscribe(function (res) {
            _this.hospital = res;
        });
        this.nurseFirstName = localStorage.getItem('nurseFirstName');
        this.nurstLastName = localStorage.getItem('nurseLastName');
        this._item.GetSepasList().subscribe(function (res) {
            _this.AllergyDrugListSepas = res;
        });
        this._item.getMainDiseaseList().subscribe(function (res) {
            _this.mainDiseaseArray = res;
            for (var _i = 0, _a = _this.mainDiseaseArray; _i < _a.length; _i++) {
                var i = _a[_i];
                for (var _b = 0, _c = _this.MainIDArray; _b < _c.length; _b++) {
                    var q = _c[_b];
                    if (q == i.id) {
                        _this.mainVAlueArray.push(i.mainDiseaseValue);
                    }
                }
            }
        });
        this._item.getFoodSensitivityList().subscribe(function (res) {
            _this.foodLIst = res;
            for (var _i = 0, _a = _this.foodLIst; _i < _a.length; _i++) {
                var a = _a[_i];
                for (var _b = 0, _c = _this.FoodcodeArray; _b < _c.length; _b++) {
                    var q = _c[_b];
                    if (q == a.Key) {
                        _this.foodAllerguValue.push(a.Value);
                    }
                }
            }
        });
        this.list = this._service.gettodos();
        this._item.getDepartureList().subscribe(function (res) {
            _this.departureList = res;
        });
        this._item.GetSeparationByInfectionList().subscribe(function (res) {
            _this.SeparationByInfectionList = res;
        });
        this._item.getTransportList().subscribe(function (res) {
            _this.TransporterArray = res;
            _this.TransporterArray.forEach(function (i) {
                if (i.Key == _this.TransportList) {
                    _this.transporterValue = i.Value;
                }
            });
        });
        this.level3Form = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormGroup"]({
            'Separation': new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](''),
            'Departure': new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](''),
            'Spo2': new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](''),
            'BPmax': new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](''),
            'bpMin': new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](''),
            'PR': new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](''),
            'RR': new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](''),
            'Temperature': new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](''),
        });
        this.lastDay = this.list[0]["24Hourses"];
        this.MainDisease = this.list[0]["MainDisease"];
        this.TransportList = this.list[0]["TransportList"];
        this.admissionKind = this.list[0]["admissionKind"];
        this.age = this.list[0]["age"];
        this.ageType = this.list[0]["ageType"];
        this.birthDate = this.list[0]["birthDate"];
        this.entrnaceType = this.list[0]["entrnaceType"];
        this.gender = this.list[0]["gender"];
        this.lastName = this.list[0]["lastName"];
        this.name = this.list[0]["name"];
        this.nationalCode = this.list[0]["nationalCode"];
        this.pregmentType = this.list[0]["pregmentType"];
        this.sensetiveFoodType = this.list[0]["sensetiveFoodType"];
        this.hasDrugAllery = this.list[0]["Allergy"];
        this.FoodSensitivityObjList = this.list[0]["FoodSensitivity"];
        for (var _i = 0, _a = this.FoodSensitivityObjList; _i < _a.length; _i++) {
            var i = _a[_i];
            this.FoodcodeArray.push(i.foodSensitivityValue);
        }
        this.eOtherCasesMainDisease = this.list[0]['othermainDeseasePush'];
        this.admissionKindTextList = this.list[0]['admissionKindTextList'];
        this.drugList = this.list[0]["DrugSensitive"];
        this.patientIsNotIdentity = this.list[0]["patientIsNotIdentity"];
        if (this.patientIsNotIdentity === "1") {
            this.birthDate = "";
        }
    };
    Page8Component.ctorParameters = function () { return [
        { type: _services_teriajItems_teriaj_items_service__WEBPACK_IMPORTED_MODULE_3__["TeriajItemsService"] },
        { type: _services_CreatTeriage_creat_new_teriage_service__WEBPACK_IMPORTED_MODULE_4__["CreatNewTeriageService"] },
        { type: _services_CreatTeriage_creatlvl3_service__WEBPACK_IMPORTED_MODULE_5__["Creatlvl3Service"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_6__["ActivatedRoute"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_6__["Router"] },
        { type: _services_getById_get_by_triage_id_service__WEBPACK_IMPORTED_MODULE_7__["GetByTriageIdService"] },
        { type: _services_end_of_triage_service__WEBPACK_IMPORTED_MODULE_8__["EndOfTriageService"] },
        { type: _services_apiConfig_api_config_service__WEBPACK_IMPORTED_MODULE_9__["ApiConfigService"] }
    ]; };
    Page8Component = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-page8',
            template: __webpack_require__(/*! raw-loader!./page8.component.html */ "./node_modules/raw-loader/index.js!./src/app/teriazh/page8/page8.component.html"),
            styles: [__webpack_require__(/*! ./page8.component.scss */ "./src/app/teriazh/page8/page8.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_teriajItems_teriaj_items_service__WEBPACK_IMPORTED_MODULE_3__["TeriajItemsService"],
            _services_CreatTeriage_creat_new_teriage_service__WEBPACK_IMPORTED_MODULE_4__["CreatNewTeriageService"],
            _services_CreatTeriage_creatlvl3_service__WEBPACK_IMPORTED_MODULE_5__["Creatlvl3Service"],
            _angular_router__WEBPACK_IMPORTED_MODULE_6__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_6__["Router"],
            _services_getById_get_by_triage_id_service__WEBPACK_IMPORTED_MODULE_7__["GetByTriageIdService"],
            _services_end_of_triage_service__WEBPACK_IMPORTED_MODULE_8__["EndOfTriageService"],
            _services_apiConfig_api_config_service__WEBPACK_IMPORTED_MODULE_9__["ApiConfigService"]])
    ], Page8Component);
    return Page8Component;
}());



/***/ }),

/***/ "./src/app/teriazh/patient-list/patient-list.component.scss":
/*!******************************************************************!*\
  !*** ./src/app/teriazh/patient-list/patient-list.component.scss ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3RlcmlhemgvcGF0aWVudC1saXN0L3BhdGllbnQtbGlzdC5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/teriazh/patient-list/patient-list.component.ts":
/*!****************************************************************!*\
  !*** ./src/app/teriazh/patient-list/patient-list.component.ts ***!
  \****************************************************************/
/*! exports provided: PatientListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PatientListComponent", function() { return PatientListComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_teriajFilter_teriaj_filter_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/teriajFilter/teriaj-filter.service */ "./src/app/services/teriajFilter/teriaj-filter.service.ts");
/* harmony import */ var _services_getById_get_by_triage_id_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../services/getById/get-by-triage-id.service */ "./src/app/services/getById/get-by-triage-id.service.ts");
/* harmony import */ var _services_teriajItems_teriaj_items_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../services/teriajItems/teriaj-items.service */ "./src/app/services/teriajItems/teriaj-items.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_apiConfig_api_config_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../services/apiConfig/api-config.service */ "./src/app/services/apiConfig/api-config.service.ts");
/* harmony import */ var _services_admission_kind_list_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../services/admission-kind-list.service */ "./src/app/services/admission-kind-list.service.ts");








var PatientListComponent = /** @class */ (function () {
    //sorting
    function PatientListComponent(_TeriajFilter, _service, _item, router, _AdmissionKind, i) {
        this._TeriajFilter = _TeriajFilter;
        this._service = _service;
        this._item = _item;
        this.router = router;
        this._AdmissionKind = _AdmissionKind;
        this.i = i;
        this.hide = true;
        this.persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
        this.arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
        this.today = new Date().toLocaleDateString('fa-IR');
        this.teriazhID = '';
        this.firstName = '';
        this.LastName = '';
        this.fromAge = '';
        this.toAge = '';
        this.fromDate = this.today.toString();
        this.toDate = this.today;
        this.entrnaceType = '';
        this.triageLevel = '';
        this.departure = '';
        this.triageStatus = '';
        this.admissionKind = '';
        this.prac = '';
        this.triageLocationID = "";
        this.sTriageAdmissionKind = "";
        this.sTriage_MainDisease = "";
        this.id = "";
        this.transporterList = [];
        this.fixNumbers = function (str) {
            if (typeof str === 'string') {
                for (var i = 0; i < 10; i++) {
                    str = str.replace(this.persianNumbers[i], i).replace(this.arabicNumbers[i], i);
                }
            }
            return str;
        };
        this._item.seturl(this.i.config.API_URL);
        this._service.seturl(this.i.config.API_URL);
        this._TeriajFilter.seturl(this.i.config.API_URL);
        this._AdmissionKind.seturl(this.i.config.API_URL);
    }
    PatientListComponent.prototype.reload = function () {
        window.location.reload();
    };
    PatientListComponent.prototype.selectPatient = function (id) {
        var _this = this;
        this.id = id;
        console.log(this.teriazhID);
        localStorage.setItem('teriazhid', id);
        this._service.ByID(id).subscribe(function (res) {
            _this.info = res;
            console.log(_this.info);
        });
        this.router.navigate(['/teriazh/showInfo', this.id]);
    };
    PatientListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._item.GetTriageStatusList().subscribe(function (res) {
            _this.TriageStatusList = res;
            console.log(_this.TriageStatusList);
        });
        this._item.getDepartureList().subscribe(function (res) {
            _this.depratureList = res;
            console.log(_this.depratureList);
        });
        this._item.getTransportList().subscribe(function (res) {
            _this.transporterList = res;
            console.log(_this.transporterList);
        });
        this._AdmissionKind.getAdmissionKindList().subscribe(function (res) {
            console.log(res);
        });
        this.date = new Date();
        this.date.setDate(this.date.getDate() + 1);
        this.tomarrow = this.date.toLocaleDateString('fa-IR');
        this.today = this.fixNumbers(this.today);
        this.tomarrow = this.fixNumbers(this.tomarrow);
        this.triageLocationID = localStorage.getItem('locationID');
        console.log(this.triageLocationID);
        this._TeriajFilter.postPractitioner(this.teriazhID, this.firstName, this.LastName, this.fromAge, this.toAge, this.fromDate = this.today.toString(), this.toDate = this.tomarrow, this.entrnaceType, this.triageLevel, this.departure, this.triageStatus, this.admissionKind, this.prac, this.triageLocationID, this.sTriageAdmissionKind = this.sTriageAdmissionKind, this.sTriage_MainDisease = this.sTriage_MainDisease).subscribe(function (res) {
            _this.List = res;
            console.log(_this.List);
        });
        console.log(this.today);
    };
    PatientListComponent.ctorParameters = function () { return [
        { type: _services_teriajFilter_teriaj_filter_service__WEBPACK_IMPORTED_MODULE_2__["TeriajFilterService"] },
        { type: _services_getById_get_by_triage_id_service__WEBPACK_IMPORTED_MODULE_3__["GetByTriageIdService"] },
        { type: _services_teriajItems_teriaj_items_service__WEBPACK_IMPORTED_MODULE_4__["TeriajItemsService"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"] },
        { type: _services_admission_kind_list_service__WEBPACK_IMPORTED_MODULE_7__["AdmissionKindListService"] },
        { type: _services_apiConfig_api_config_service__WEBPACK_IMPORTED_MODULE_6__["ApiConfigService"] }
    ]; };
    PatientListComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-patient-list',
            template: __webpack_require__(/*! raw-loader!./patient-list.component.html */ "./node_modules/raw-loader/index.js!./src/app/teriazh/patient-list/patient-list.component.html"),
            styles: [__webpack_require__(/*! ./patient-list.component.scss */ "./src/app/teriazh/patient-list/patient-list.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_teriajFilter_teriaj_filter_service__WEBPACK_IMPORTED_MODULE_2__["TeriajFilterService"],
            _services_getById_get_by_triage_id_service__WEBPACK_IMPORTED_MODULE_3__["GetByTriageIdService"],
            _services_teriajItems_teriaj_items_service__WEBPACK_IMPORTED_MODULE_4__["TeriajItemsService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"],
            _services_admission_kind_list_service__WEBPACK_IMPORTED_MODULE_7__["AdmissionKindListService"],
            _services_apiConfig_api_config_service__WEBPACK_IMPORTED_MODULE_6__["ApiConfigService"]])
    ], PatientListComponent);
    return PatientListComponent;
}());



/***/ }),

/***/ "./src/app/teriazh/print-all/print-all.component.scss":
/*!************************************************************!*\
  !*** ./src/app/teriazh/print-all/print-all.component.scss ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3RlcmlhemgvcHJpbnQtYWxsL3ByaW50LWFsbC5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/teriazh/print-all/print-all.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/teriazh/print-all/print-all.component.ts ***!
  \**********************************************************/
/*! exports provided: PrintAllComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PrintAllComponent", function() { return PrintAllComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var PrintAllComponent = /** @class */ (function () {
    function PrintAllComponent() {
    }
    PrintAllComponent.prototype.ngOnInit = function () {
    };
    PrintAllComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-print-all',
            template: __webpack_require__(/*! raw-loader!./print-all.component.html */ "./node_modules/raw-loader/index.js!./src/app/teriazh/print-all/print-all.component.html"),
            styles: [__webpack_require__(/*! ./print-all.component.scss */ "./src/app/teriazh/print-all/print-all.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], PrintAllComponent);
    return PrintAllComponent;
}());



/***/ }),

/***/ "./src/app/teriazh/show-info/show-info.component.scss":
/*!************************************************************!*\
  !*** ./src/app/teriazh/show-info/show-info.component.scss ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3Rlcmlhemgvc2hvdy1pbmZvL3Nob3ctaW5mby5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/teriazh/show-info/show-info.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/teriazh/show-info/show-info.component.ts ***!
  \**********************************************************/
/*! exports provided: ShowInfoComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShowInfoComponent", function() { return ShowInfoComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_getById_get_by_triage_id_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../services/getById/get-by-triage-id.service */ "./src/app/services/getById/get-by-triage-id.service.ts");
/* harmony import */ var _services_teriajItems_teriaj_items_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../services/teriajItems/teriaj-items.service */ "./src/app/services/teriajItems/teriaj-items.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_admission_kind_list_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/admission-kind-list.service */ "./src/app/services/admission-kind-list.service.ts");
/* harmony import */ var _services_AVPU_avpu_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../services/AVPU/avpu.service */ "./src/app/services/AVPU/avpu.service.ts");
/* harmony import */ var _services_apiConfig_api_config_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../services/apiConfig/api-config.service */ "./src/app/services/apiConfig/api-config.service.ts");








var ShowInfoComponent = /** @class */ (function () {
    function ShowInfoComponent(_service, route, _item, _admissionList, _AVPU, router, i) {
        this._service = _service;
        this.route = route;
        this._item = _item;
        this._admissionList = _admissionList;
        this._AVPU = _AVPU;
        this.router = router;
        this.i = i;
        this.hide = true;
        this.pracInfo = [];
        this.Time = "";
        this.pracID = "";
        this.foodAllergy = new Array();
        this.otherMAin = new Array();
        this.foodAllerguValue = new Array();
        this.AlleryDrug = new Array();
        this.drugListFinalArray = new Array();
        this.drugListArray = new Array();
        this.aleryDrugFinaly = [];
        this.allergyDrugVAlue = new Array();
        this.drugCode = "";
        this.drugCodeArray = new Array();
        this.mainDesaseValue = "";
        this.transporterValue = "";
        this.nurseFirstName = "";
        this.nurstLastName = "";
        this.ddd = "2";
        this.triageID = "";
        this.trasporter = new Array();
        this.saeed = "";
        this._item.seturl(this.i.config.API_URL);
        this._service.seturl(this.i.config.API_URL);
        this._AVPU.seturl(this.i.config.API_URL);
        this._admissionList.seturl(this.i.config.API_URL);
    }
    ShowInfoComponent.prototype.edit = function () {
        localStorage.setItem('edit', '1');
        this.router.navigate(['/teriazh/Patient-Triage']);
    };
    ShowInfoComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log(this.aleryDrugFinaly);
        this._item.getHospitalName().subscribe(function (res) {
            _this.hospital = res;
        });
        this.nurseFirstName = localStorage.getItem('nurseFirstName');
        this.nurstLastName = localStorage.getItem('nurseLastName');
        this.triageID = localStorage.getItem('teriazhid');
        // this._item.GetSepasList().subscribe(res=>{
        //   this.AllergyDrugListSepas=res;
        //   console.log(this.AllergyDrugListSepas);
        // })
        this._item.getDepartureList().subscribe(function (res) {
            _this.departure = res;
        });
        this._service.ByID(this.triageID).subscribe(function (res) {
            _this.triazhInfo = res;
            _this.pracID = _this.triazhInfo['item']['triage_PracID'];
            console.log("attatatatatata", _this.pracID);
            console.log(_this.triazhInfo);
            console.log('mainId', _this.triazhInfo['item']['triage_MainDisease'][0]['mainDiseaseID']);
            for (var _i = 0, _a = _this.triazhInfo['item']['triageAllergyDrugs']; _i < _a.length; _i++) {
                var a = _a[_i];
                console.log("dugHistory", a.sepas_ERXCode);
                _this.AlleryDrug.push(a.sepas_ERXCode);
                console.log(_this.AlleryDrug);
            }
            for (var _b = 0, _c = _this.triazhInfo['item']['triageFoodSensitivity']; _b < _c.length; _b++) {
                var i = _c[_b];
                _this.foodAllergy.push(i.foodSensitivityValue);
            }
            for (var _d = 0, _e = _this.triazhInfo['item']['triageOtherCasesMainDisease']; _d < _e.length; _d++) {
                var i = _e[_d];
                _this.otherMAin.push(i.description);
            }
            for (var _f = 0, _g = _this.triazhInfo['item']['triageDrugHistory']; _f < _g.length; _f++) {
                var i = _g[_f];
                console.log("saeed mnc", i.strDrugCode);
                _this.drugCode = i.strDrugCode;
                _this.drugCode = _this.drugCode.trim();
                _this.drugCodeArray.push(_this.drugCode);
                console.log(_this.drugCodeArray);
            }
            _this.bp = parseInt(_this.triazhInfo['item']['bp']);
            _this.bp = Math.round(_this.bp);
            _this.pr = parseInt(_this.triazhInfo['item']['pr']);
            _this.pr = Math.round(_this.pr);
            _this.rr = parseInt(_this.triazhInfo['item']['rr']);
            _this.rr = Math.round(_this.rr);
            _this.t = parseInt(_this.triazhInfo['item']['t']);
            _this.t = Math.round(_this.t);
            _this.spo2 = parseInt(_this.triazhInfo['item']['spo2']);
            _this.spo2 = Math.round(_this.spo2);
            _this.painPrint = parseInt(_this.triazhInfo['item']['intensityOfPain']);
            _this.painPrint = Math.round(_this.painPrint);
            _this.Time = _this.triazhInfo['item']['entranceTime'];
            _this.Time = _this.Time.substr(_this.Time.length - 5);
            _this._item.postPracID(_this.pracID).subscribe(function (res) {
                _this.pracInfo = res;
                console.log("نام پرستار", res);
            });
        });
        this._item.getFoodSensitivityList().subscribe(function (res) {
            _this.foodLIst = res;
            for (var _i = 0, _a = _this.foodLIst; _i < _a.length; _i++) {
                var a = _a[_i];
                for (var _b = 0, _c = _this.foodAllergy; _b < _c.length; _b++) {
                    var q = _c[_b];
                    if (q == a.Key) {
                        _this.foodAllerguValue.push(a.Value);
                    }
                }
            }
        });
        this._item.getTransportList().subscribe(function (res) {
            _this.trasporter = res;
            _this.trasporter.forEach(function (i) {
                if (i.Key.toString() == _this.triazhInfo['item']['arrival_Transport']) {
                    console.log("sopdfij", i.Value);
                    _this.transporterValue = i.Value;
                }
            });
        });
        this._item.getEncounter24HoursAgoList().subscribe(function (res) {
            _this.Encounter24HoursAgoList = res;
        });
        this._item.getEncounter24HoursAgoList().subscribe(function (res) {
            _this.lastDay = res;
        });
        this._admissionList.getAdmissionKindList().subscribe(function (res) {
            _this.AdmissionKindList = res;
            console.log(_this.AdmissionKindList);
        });
        this._item.getMainDiseaseList().subscribe(function (res) {
            _this.MainDiseaseList = res;
            console.log(_this.MainDiseaseList);
            _this.MainDiseaseList.forEach(function (i) {
                if (i.id.toString() == _this.triazhInfo['item']['triage_MainDisease'][0]['mainDiseaseID']) {
                    console.log("sopdfij", i.mainDiseaseValue);
                    _this.mainDesaseValue = i.mainDiseaseValue;
                }
            });
        });
        this._item.getTriageAllergyDrugs().subscribe(function (res) {
            _this.AllergyDrugList = res;
            console.log(_this.AllergyDrugList);
        });
        this._AVPU.getAVPU().subscribe(function (res) {
            _this.AVPUlist = res;
        });
        this._item.GetSeparationByInfectionList().subscribe(function (res) {
            _this.SeparationByInfectionList = res;
        });
        this._item.GetSepasList().subscribe(function (res) {
            _this.AllergyDrugListSepas = res;
            for (var _i = 0, _a = _this.AllergyDrugListSepas['items']; _i < _a.length; _i++) {
                var i = _a[_i];
                for (var _b = 0, _c = _this.AlleryDrug; _b < _c.length; _b++) {
                    var x = _c[_b];
                    if (i.code == x) {
                        _this.allergyDrugVAlue.push(i.value);
                    }
                }
                for (var _d = 0, _e = _this.drugCodeArray; _d < _e.length; _d++) {
                    var q = _e[_d];
                    if (i.code == q) {
                        _this.drugListArray.push(i.value);
                    }
                }
            }
            console.log(_this.allergyDrugVAlue);
            _this.allergyDrugVAlue.forEach(function (item) {
                _this.aleryDrugFinaly.push(item.substr(0, item.indexOf(' ')));
                console.log(_this.aleryDrugFinaly);
            });
            _this.drugListArray.forEach(function (item) {
                _this.drugListFinalArray.push(item.substr(0, item.indexOf(' ')));
            });
        });
    };
    ShowInfoComponent.ctorParameters = function () { return [
        { type: _services_getById_get_by_triage_id_service__WEBPACK_IMPORTED_MODULE_2__["GetByTriageIdService"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["ActivatedRoute"] },
        { type: _services_teriajItems_teriaj_items_service__WEBPACK_IMPORTED_MODULE_3__["TeriajItemsService"] },
        { type: _services_admission_kind_list_service__WEBPACK_IMPORTED_MODULE_5__["AdmissionKindListService"] },
        { type: _services_AVPU_avpu_service__WEBPACK_IMPORTED_MODULE_6__["AVPUService"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"] },
        { type: _services_apiConfig_api_config_service__WEBPACK_IMPORTED_MODULE_7__["ApiConfigService"] }
    ]; };
    ShowInfoComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-show-info',
            template: __webpack_require__(/*! raw-loader!./show-info.component.html */ "./node_modules/raw-loader/index.js!./src/app/teriazh/show-info/show-info.component.html"),
            styles: [__webpack_require__(/*! ./show-info.component.scss */ "./src/app/teriazh/show-info/show-info.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_getById_get_by_triage_id_service__WEBPACK_IMPORTED_MODULE_2__["GetByTriageIdService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_4__["ActivatedRoute"],
            _services_teriajItems_teriaj_items_service__WEBPACK_IMPORTED_MODULE_3__["TeriajItemsService"],
            _services_admission_kind_list_service__WEBPACK_IMPORTED_MODULE_5__["AdmissionKindListService"],
            _services_AVPU_avpu_service__WEBPACK_IMPORTED_MODULE_6__["AVPUService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"],
            _services_apiConfig_api_config_service__WEBPACK_IMPORTED_MODULE_7__["ApiConfigService"]])
    ], ShowInfoComponent);
    return ShowInfoComponent;
}());



/***/ }),

/***/ "./src/app/teriazh/teriazh-routing.module.ts":
/*!***************************************************!*\
  !*** ./src/app/teriazh/teriazh-routing.module.ts ***!
  \***************************************************/
/*! exports provided: TeriazhRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeriazhRoutingModule", function() { return TeriazhRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _page1_page1_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./page1/page1.component */ "./src/app/teriazh/page1/page1.component.ts");
/* harmony import */ var _page2_page2_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./page2/page2.component */ "./src/app/teriazh/page2/page2.component.ts");
/* harmony import */ var _page3_page3_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./page3/page3.component */ "./src/app/teriazh/page3/page3.component.ts");
/* harmony import */ var _page4_page4_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./page4/page4.component */ "./src/app/teriazh/page4/page4.component.ts");
/* harmony import */ var _page5_page5_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./page5/page5.component */ "./src/app/teriazh/page5/page5.component.ts");
/* harmony import */ var _page6_page6_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./page6/page6.component */ "./src/app/teriazh/page6/page6.component.ts");
/* harmony import */ var _page7_page7_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./page7/page7.component */ "./src/app/teriazh/page7/page7.component.ts");
/* harmony import */ var _page8_page8_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./page8/page8.component */ "./src/app/teriazh/page8/page8.component.ts");
/* harmony import */ var _patient_list_patient_list_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./patient-list/patient-list.component */ "./src/app/teriazh/patient-list/patient-list.component.ts");
/* harmony import */ var _print_all_print_all_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./print-all/print-all.component */ "./src/app/teriazh/print-all/print-all.component.ts");
/* harmony import */ var _show_info_show_info_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./show-info/show-info.component */ "./src/app/teriazh/show-info/show-info.component.ts");














var routes = [
    {
        path: '',
        children: [
            {
                path: 'Search',
                component: _page1_page1_component__WEBPACK_IMPORTED_MODULE_3__["Page1Component"],
                data: {
                    title: 'Page First'
                }
            },
            {
                path: 'Patient-Triage',
                component: _page2_page2_component__WEBPACK_IMPORTED_MODULE_4__["Page2Component"],
                data: {
                    title: 'Page Second'
                }
            },
            {
                path: 'page3',
                component: _page3_page3_component__WEBPACK_IMPORTED_MODULE_5__["Page3Component"],
                data: {
                    title: 'Page Third'
                }
            },
            {
                path: 'Triage-level-1',
                component: _page4_page4_component__WEBPACK_IMPORTED_MODULE_6__["Page4Component"],
                data: {
                    title: 'Page Fourth'
                }
            },
            {
                path: 'Triage-level-2',
                component: _page5_page5_component__WEBPACK_IMPORTED_MODULE_7__["Page5Component"],
                data: {
                    title: 'Page Fifth'
                }
            },
            {
                path: 'Triage-level-5',
                component: _page6_page6_component__WEBPACK_IMPORTED_MODULE_8__["Page6Component"],
                data: {
                    title: 'Page Sixth'
                }
            },
            {
                path: 'Triage-level-4',
                component: _page7_page7_component__WEBPACK_IMPORTED_MODULE_9__["Page7Component"],
                data: {
                    title: 'Page Seventh'
                }
            },
            {
                path: 'Triage-level-3',
                component: _page8_page8_component__WEBPACK_IMPORTED_MODULE_10__["Page8Component"],
                data: {
                    title: 'Page Eighth'
                }
            },
            {
                path: 'patientList',
                component: _patient_list_patient_list_component__WEBPACK_IMPORTED_MODULE_11__["PatientListComponent"],
                data: {
                    title: 'Patient List '
                }
            },
            {
                path: 'triagePrint',
                component: _print_all_print_all_component__WEBPACK_IMPORTED_MODULE_12__["PrintAllComponent"],
                data: {
                    title: 'triage Print '
                }
            },
            {
                path: 'showInfo/:id',
                component: _show_info_show_info_component__WEBPACK_IMPORTED_MODULE_13__["ShowInfoComponent"],
                data: {
                    title: 'Show Info '
                }
            },
        ]
    }
];
var TeriazhRoutingModule = /** @class */ (function () {
    function TeriazhRoutingModule() {
    }
    TeriazhRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]],
        })
    ], TeriazhRoutingModule);
    return TeriazhRoutingModule;
}());



/***/ }),

/***/ "./src/app/teriazh/teriazh.module.ts":
/*!*******************************************!*\
  !*** ./src/app/teriazh/teriazh.module.ts ***!
  \*******************************************/
/*! exports provided: TeriazhModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeriazhModule", function() { return TeriazhModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _page1_page1_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./page1/page1.component */ "./src/app/teriazh/page1/page1.component.ts");
/* harmony import */ var _teriazh_routing_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./teriazh-routing.module */ "./src/app/teriazh/teriazh-routing.module.ts");
/* harmony import */ var _page2_page2_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./page2/page2.component */ "./src/app/teriazh/page2/page2.component.ts");
/* harmony import */ var ng2_jalali_date_picker__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ng2-jalali-date-picker */ "./node_modules/ng2-jalali-date-picker/ng2-jalali-date-picker.es5.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _page3_page3_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./page3/page3.component */ "./src/app/teriazh/page3/page3.component.ts");
/* harmony import */ var _page4_page4_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./page4/page4.component */ "./src/app/teriazh/page4/page4.component.ts");
/* harmony import */ var _page5_page5_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./page5/page5.component */ "./src/app/teriazh/page5/page5.component.ts");
/* harmony import */ var _page6_page6_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./page6/page6.component */ "./src/app/teriazh/page6/page6.component.ts");
/* harmony import */ var _page7_page7_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./page7/page7.component */ "./src/app/teriazh/page7/page7.component.ts");
/* harmony import */ var _page8_page8_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./page8/page8.component */ "./src/app/teriazh/page8/page8.component.ts");
/* harmony import */ var _patient_list_patient_list_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./patient-list/patient-list.component */ "./src/app/teriazh/patient-list/patient-list.component.ts");
/* harmony import */ var _print_all_print_all_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./print-all/print-all.component */ "./src/app/teriazh/print-all/print-all.component.ts");
/* harmony import */ var ngx_print__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ngx-print */ "./node_modules/ngx-print/fesm5/ngx-print.js");
/* harmony import */ var _show_info_show_info_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./show-info/show-info.component */ "./src/app/teriazh/show-info/show-info.component.ts");
/* harmony import */ var ngx_barcode__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ngx-barcode */ "./node_modules/ngx-barcode/index.js");
/* harmony import */ var ngx_perfect_scrollbar__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ngx-perfect-scrollbar */ "./node_modules/ngx-perfect-scrollbar/dist/ngx-perfect-scrollbar.es5.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _search_filter_pipe__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../search-filter.pipe */ "./src/app/search-filter.pipe.ts");





// import { NgPersianDatepickerModule } from 'ng-persian-datepicker';


















var DEFAULT_PERFECT_SCROLLBAR_CONFIG = {
    suppressScrollX: true
};
var TeriazhModule = /** @class */ (function () {
    function TeriazhModule() {
    }
    TeriazhModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [_page1_page1_component__WEBPACK_IMPORTED_MODULE_3__["Page1Component"], _page2_page2_component__WEBPACK_IMPORTED_MODULE_5__["Page2Component"], _page3_page3_component__WEBPACK_IMPORTED_MODULE_8__["Page3Component"], _page4_page4_component__WEBPACK_IMPORTED_MODULE_9__["Page4Component"], _page5_page5_component__WEBPACK_IMPORTED_MODULE_10__["Page5Component"], _page6_page6_component__WEBPACK_IMPORTED_MODULE_11__["Page6Component"], _page7_page7_component__WEBPACK_IMPORTED_MODULE_12__["Page7Component"], _page8_page8_component__WEBPACK_IMPORTED_MODULE_13__["Page8Component"], _patient_list_patient_list_component__WEBPACK_IMPORTED_MODULE_14__["PatientListComponent"], _print_all_print_all_component__WEBPACK_IMPORTED_MODULE_15__["PrintAllComponent"], _show_info_show_info_component__WEBPACK_IMPORTED_MODULE_17__["ShowInfoComponent"], _search_filter_pipe__WEBPACK_IMPORTED_MODULE_21__["SearchPipe"]],
            imports: [
                ngx_perfect_scrollbar__WEBPACK_IMPORTED_MODULE_19__["PerfectScrollbarModule"],
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _teriazh_routing_module__WEBPACK_IMPORTED_MODULE_4__["TeriazhRoutingModule"],
                ngx_print__WEBPACK_IMPORTED_MODULE_16__["NgxPrintModule"],
                // MatAutocompleteModule,
                // MatSelectModule,
                // MatFormFieldModule,
                // NgPersianDatepickerModule
                ng2_jalali_date_picker__WEBPACK_IMPORTED_MODULE_6__["DpDatePickerModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_7__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_7__["ReactiveFormsModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatAutocompleteModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatBadgeModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatBottomSheetModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatButtonModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatButtonToggleModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatCardModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatCheckboxModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatChipsModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatStepperModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatDatepickerModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatDialogModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatDividerModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatExpansionModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatGridListModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatIconModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatInputModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatListModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatMenuModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatNativeDateModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatPaginatorModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatProgressBarModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatProgressSpinnerModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatRadioModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatRippleModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatSelectModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatSidenavModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatSliderModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatSlideToggleModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatSnackBarModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatSortModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatTableModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatTabsModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatToolbarModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatTooltipModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatTreeModule"],
                ngx_barcode__WEBPACK_IMPORTED_MODULE_18__["NgxBarcodeModule"]
            ],
            providers: [
                {
                    provide: ngx_perfect_scrollbar__WEBPACK_IMPORTED_MODULE_19__["PERFECT_SCROLLBAR_CONFIG"],
                    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
                }
            ]
        })
    ], TeriazhModule);
    return TeriazhModule;
}());



/***/ }),

/***/ "./src/app/triageFoodSensitivity.ts":
/*!******************************************!*\
  !*** ./src/app/triageFoodSensitivity.ts ***!
  \******************************************/
/*! exports provided: triageFoodSensitivity */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "triageFoodSensitivity", function() { return triageFoodSensitivity; });
var triageFoodSensitivity = /** @class */ (function () {
    function triageFoodSensitivity() {
    }
    return triageFoodSensitivity;
}());



/***/ })

}]);
//# sourceMappingURL=teriazh-teriazh-module.js.map