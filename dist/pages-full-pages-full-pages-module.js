(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-full-pages-full-pages-module"],{

/***/ "./node_modules/chartist/dist/chartist.js":
/*!************************************************!*\
  !*** ./node_modules/chartist/dist/chartist.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
  if (true) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
      return (root['Chartist'] = factory());
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(this, function () {

/* Chartist.js 0.11.1
 * Copyright © 2019 Gion Kunz
 * Free to use under either the WTFPL license or the MIT license.
 * https://raw.githubusercontent.com/gionkunz/chartist-js/master/LICENSE-WTFPL
 * https://raw.githubusercontent.com/gionkunz/chartist-js/master/LICENSE-MIT
 */
/**
 * The core module of Chartist that is mainly providing static functions and higher level functions for chart modules.
 *
 * @module Chartist.Core
 */
var Chartist = {
  version: '0.11.1'
};

(function (globalRoot, Chartist) {
  'use strict';

  var window = globalRoot.window;
  var document = globalRoot.document;

  /**
   * This object contains all namespaces used within Chartist.
   *
   * @memberof Chartist.Core
   * @type {{svg: string, xmlns: string, xhtml: string, xlink: string, ct: string}}
   */
  Chartist.namespaces = {
    svg: 'http://www.w3.org/2000/svg',
    xmlns: 'http://www.w3.org/2000/xmlns/',
    xhtml: 'http://www.w3.org/1999/xhtml',
    xlink: 'http://www.w3.org/1999/xlink',
    ct: 'http://gionkunz.github.com/chartist-js/ct'
  };

  /**
   * Helps to simplify functional style code
   *
   * @memberof Chartist.Core
   * @param {*} n This exact value will be returned by the noop function
   * @return {*} The same value that was provided to the n parameter
   */
  Chartist.noop = function (n) {
    return n;
  };

  /**
   * Generates a-z from a number 0 to 26
   *
   * @memberof Chartist.Core
   * @param {Number} n A number from 0 to 26 that will result in a letter a-z
   * @return {String} A character from a-z based on the input number n
   */
  Chartist.alphaNumerate = function (n) {
    // Limit to a-z
    return String.fromCharCode(97 + n % 26);
  };

  /**
   * Simple recursive object extend
   *
   * @memberof Chartist.Core
   * @param {Object} target Target object where the source will be merged into
   * @param {Object...} sources This object (objects) will be merged into target and then target is returned
   * @return {Object} An object that has the same reference as target but is extended and merged with the properties of source
   */
  Chartist.extend = function (target) {
    var i, source, sourceProp;
    target = target || {};

    for (i = 1; i < arguments.length; i++) {
      source = arguments[i];
      for (var prop in source) {
        sourceProp = source[prop];
        if (typeof sourceProp === 'object' && sourceProp !== null && !(sourceProp instanceof Array)) {
          target[prop] = Chartist.extend(target[prop], sourceProp);
        } else {
          target[prop] = sourceProp;
        }
      }
    }

    return target;
  };

  /**
   * Replaces all occurrences of subStr in str with newSubStr and returns a new string.
   *
   * @memberof Chartist.Core
   * @param {String} str
   * @param {String} subStr
   * @param {String} newSubStr
   * @return {String}
   */
  Chartist.replaceAll = function(str, subStr, newSubStr) {
    return str.replace(new RegExp(subStr, 'g'), newSubStr);
  };

  /**
   * Converts a number to a string with a unit. If a string is passed then this will be returned unmodified.
   *
   * @memberof Chartist.Core
   * @param {Number} value
   * @param {String} unit
   * @return {String} Returns the passed number value with unit.
   */
  Chartist.ensureUnit = function(value, unit) {
    if(typeof value === 'number') {
      value = value + unit;
    }

    return value;
  };

  /**
   * Converts a number or string to a quantity object.
   *
   * @memberof Chartist.Core
   * @param {String|Number} input
   * @return {Object} Returns an object containing the value as number and the unit as string.
   */
  Chartist.quantity = function(input) {
    if (typeof input === 'string') {
      var match = (/^(\d+)\s*(.*)$/g).exec(input);
      return {
        value : +match[1],
        unit: match[2] || undefined
      };
    }
    return { value: input };
  };

  /**
   * This is a wrapper around document.querySelector that will return the query if it's already of type Node
   *
   * @memberof Chartist.Core
   * @param {String|Node} query The query to use for selecting a Node or a DOM node that will be returned directly
   * @return {Node}
   */
  Chartist.querySelector = function(query) {
    return query instanceof Node ? query : document.querySelector(query);
  };

  /**
   * Functional style helper to produce array with given length initialized with undefined values
   *
   * @memberof Chartist.Core
   * @param length
   * @return {Array}
   */
  Chartist.times = function(length) {
    return Array.apply(null, new Array(length));
  };

  /**
   * Sum helper to be used in reduce functions
   *
   * @memberof Chartist.Core
   * @param previous
   * @param current
   * @return {*}
   */
  Chartist.sum = function(previous, current) {
    return previous + (current ? current : 0);
  };

  /**
   * Multiply helper to be used in `Array.map` for multiplying each value of an array with a factor.
   *
   * @memberof Chartist.Core
   * @param {Number} factor
   * @returns {Function} Function that can be used in `Array.map` to multiply each value in an array
   */
  Chartist.mapMultiply = function(factor) {
    return function(num) {
      return num * factor;
    };
  };

  /**
   * Add helper to be used in `Array.map` for adding a addend to each value of an array.
   *
   * @memberof Chartist.Core
   * @param {Number} addend
   * @returns {Function} Function that can be used in `Array.map` to add a addend to each value in an array
   */
  Chartist.mapAdd = function(addend) {
    return function(num) {
      return num + addend;
    };
  };

  /**
   * Map for multi dimensional arrays where their nested arrays will be mapped in serial. The output array will have the length of the largest nested array. The callback function is called with variable arguments where each argument is the nested array value (or undefined if there are no more values).
   *
   * @memberof Chartist.Core
   * @param arr
   * @param cb
   * @return {Array}
   */
  Chartist.serialMap = function(arr, cb) {
    var result = [],
        length = Math.max.apply(null, arr.map(function(e) {
          return e.length;
        }));

    Chartist.times(length).forEach(function(e, index) {
      var args = arr.map(function(e) {
        return e[index];
      });

      result[index] = cb.apply(null, args);
    });

    return result;
  };

  /**
   * This helper function can be used to round values with certain precision level after decimal. This is used to prevent rounding errors near float point precision limit.
   *
   * @memberof Chartist.Core
   * @param {Number} value The value that should be rounded with precision
   * @param {Number} [digits] The number of digits after decimal used to do the rounding
   * @returns {number} Rounded value
   */
  Chartist.roundWithPrecision = function(value, digits) {
    var precision = Math.pow(10, digits || Chartist.precision);
    return Math.round(value * precision) / precision;
  };

  /**
   * Precision level used internally in Chartist for rounding. If you require more decimal places you can increase this number.
   *
   * @memberof Chartist.Core
   * @type {number}
   */
  Chartist.precision = 8;

  /**
   * A map with characters to escape for strings to be safely used as attribute values.
   *
   * @memberof Chartist.Core
   * @type {Object}
   */
  Chartist.escapingMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#039;'
  };

  /**
   * This function serializes arbitrary data to a string. In case of data that can't be easily converted to a string, this function will create a wrapper object and serialize the data using JSON.stringify. The outcoming string will always be escaped using Chartist.escapingMap.
   * If called with null or undefined the function will return immediately with null or undefined.
   *
   * @memberof Chartist.Core
   * @param {Number|String|Object} data
   * @return {String}
   */
  Chartist.serialize = function(data) {
    if(data === null || data === undefined) {
      return data;
    } else if(typeof data === 'number') {
      data = ''+data;
    } else if(typeof data === 'object') {
      data = JSON.stringify({data: data});
    }

    return Object.keys(Chartist.escapingMap).reduce(function(result, key) {
      return Chartist.replaceAll(result, key, Chartist.escapingMap[key]);
    }, data);
  };

  /**
   * This function de-serializes a string previously serialized with Chartist.serialize. The string will always be unescaped using Chartist.escapingMap before it's returned. Based on the input value the return type can be Number, String or Object. JSON.parse is used with try / catch to see if the unescaped string can be parsed into an Object and this Object will be returned on success.
   *
   * @memberof Chartist.Core
   * @param {String} data
   * @return {String|Number|Object}
   */
  Chartist.deserialize = function(data) {
    if(typeof data !== 'string') {
      return data;
    }

    data = Object.keys(Chartist.escapingMap).reduce(function(result, key) {
      return Chartist.replaceAll(result, Chartist.escapingMap[key], key);
    }, data);

    try {
      data = JSON.parse(data);
      data = data.data !== undefined ? data.data : data;
    } catch(e) {}

    return data;
  };

  /**
   * Create or reinitialize the SVG element for the chart
   *
   * @memberof Chartist.Core
   * @param {Node} container The containing DOM Node object that will be used to plant the SVG element
   * @param {String} width Set the width of the SVG element. Default is 100%
   * @param {String} height Set the height of the SVG element. Default is 100%
   * @param {String} className Specify a class to be added to the SVG element
   * @return {Object} The created/reinitialized SVG element
   */
  Chartist.createSvg = function (container, width, height, className) {
    var svg;

    width = width || '100%';
    height = height || '100%';

    // Check if there is a previous SVG element in the container that contains the Chartist XML namespace and remove it
    // Since the DOM API does not support namespaces we need to manually search the returned list http://www.w3.org/TR/selectors-api/
    Array.prototype.slice.call(container.querySelectorAll('svg')).filter(function filterChartistSvgObjects(svg) {
      return svg.getAttributeNS(Chartist.namespaces.xmlns, 'ct');
    }).forEach(function removePreviousElement(svg) {
      container.removeChild(svg);
    });

    // Create svg object with width and height or use 100% as default
    svg = new Chartist.Svg('svg').attr({
      width: width,
      height: height
    }).addClass(className);

    svg._node.style.width = width;
    svg._node.style.height = height;

    // Add the DOM node to our container
    container.appendChild(svg._node);

    return svg;
  };

  /**
   * Ensures that the data object passed as second argument to the charts is present and correctly initialized.
   *
   * @param  {Object} data The data object that is passed as second argument to the charts
   * @return {Object} The normalized data object
   */
  Chartist.normalizeData = function(data, reverse, multi) {
    var labelCount;
    var output = {
      raw: data,
      normalized: {}
    };

    // Check if we should generate some labels based on existing series data
    output.normalized.series = Chartist.getDataArray({
      series: data.series || []
    }, reverse, multi);

    // If all elements of the normalized data array are arrays we're dealing with
    // multi series data and we need to find the largest series if they are un-even
    if (output.normalized.series.every(function(value) {
        return value instanceof Array;
      })) {
      // Getting the series with the the most elements
      labelCount = Math.max.apply(null, output.normalized.series.map(function(series) {
        return series.length;
      }));
    } else {
      // We're dealing with Pie data so we just take the normalized array length
      labelCount = output.normalized.series.length;
    }

    output.normalized.labels = (data.labels || []).slice();
    // Padding the labels to labelCount with empty strings
    Array.prototype.push.apply(
      output.normalized.labels,
      Chartist.times(Math.max(0, labelCount - output.normalized.labels.length)).map(function() {
        return '';
      })
    );

    if(reverse) {
      Chartist.reverseData(output.normalized);
    }

    return output;
  };

  /**
   * This function safely checks if an objects has an owned property.
   *
   * @param {Object} object The object where to check for a property
   * @param {string} property The property name
   * @returns {boolean} Returns true if the object owns the specified property
   */
  Chartist.safeHasProperty = function(object, property) {
    return object !== null &&
      typeof object === 'object' &&
      object.hasOwnProperty(property);
  };

  /**
   * Checks if a value is considered a hole in the data series.
   *
   * @param {*} value
   * @returns {boolean} True if the value is considered a data hole
   */
  Chartist.isDataHoleValue = function(value) {
    return value === null ||
      value === undefined ||
      (typeof value === 'number' && isNaN(value));
  };

  /**
   * Reverses the series, labels and series data arrays.
   *
   * @memberof Chartist.Core
   * @param data
   */
  Chartist.reverseData = function(data) {
    data.labels.reverse();
    data.series.reverse();
    for (var i = 0; i < data.series.length; i++) {
      if(typeof(data.series[i]) === 'object' && data.series[i].data !== undefined) {
        data.series[i].data.reverse();
      } else if(data.series[i] instanceof Array) {
        data.series[i].reverse();
      }
    }
  };

  /**
   * Convert data series into plain array
   *
   * @memberof Chartist.Core
   * @param {Object} data The series object that contains the data to be visualized in the chart
   * @param {Boolean} [reverse] If true the whole data is reversed by the getDataArray call. This will modify the data object passed as first parameter. The labels as well as the series order is reversed. The whole series data arrays are reversed too.
   * @param {Boolean} [multi] Create a multi dimensional array from a series data array where a value object with `x` and `y` values will be created.
   * @return {Array} A plain array that contains the data to be visualized in the chart
   */
  Chartist.getDataArray = function(data, reverse, multi) {
    // Recursively walks through nested arrays and convert string values to numbers and objects with value properties
    // to values. Check the tests in data core -> data normalization for a detailed specification of expected values
    function recursiveConvert(value) {
      if(Chartist.safeHasProperty(value, 'value')) {
        // We are dealing with value object notation so we need to recurse on value property
        return recursiveConvert(value.value);
      } else if(Chartist.safeHasProperty(value, 'data')) {
        // We are dealing with series object notation so we need to recurse on data property
        return recursiveConvert(value.data);
      } else if(value instanceof Array) {
        // Data is of type array so we need to recurse on the series
        return value.map(recursiveConvert);
      } else if(Chartist.isDataHoleValue(value)) {
        // We're dealing with a hole in the data and therefore need to return undefined
        // We're also returning undefined for multi value output
        return undefined;
      } else {
        // We need to prepare multi value output (x and y data)
        if(multi) {
          var multiValue = {};

          // Single series value arrays are assumed to specify the Y-Axis value
          // For example: [1, 2] => [{x: undefined, y: 1}, {x: undefined, y: 2}]
          // If multi is a string then it's assumed that it specified which dimension should be filled as default
          if(typeof multi === 'string') {
            multiValue[multi] = Chartist.getNumberOrUndefined(value);
          } else {
            multiValue.y = Chartist.getNumberOrUndefined(value);
          }

          multiValue.x = value.hasOwnProperty('x') ? Chartist.getNumberOrUndefined(value.x) : multiValue.x;
          multiValue.y = value.hasOwnProperty('y') ? Chartist.getNumberOrUndefined(value.y) : multiValue.y;

          return multiValue;

        } else {
          // We can return simple data
          return Chartist.getNumberOrUndefined(value);
        }
      }
    }

    return data.series.map(recursiveConvert);
  };

  /**
   * Converts a number into a padding object.
   *
   * @memberof Chartist.Core
   * @param {Object|Number} padding
   * @param {Number} [fallback] This value is used to fill missing values if a incomplete padding object was passed
   * @returns {Object} Returns a padding object containing top, right, bottom, left properties filled with the padding number passed in as argument. If the argument is something else than a number (presumably already a correct padding object) then this argument is directly returned.
   */
  Chartist.normalizePadding = function(padding, fallback) {
    fallback = fallback || 0;

    return typeof padding === 'number' ? {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding
    } : {
      top: typeof padding.top === 'number' ? padding.top : fallback,
      right: typeof padding.right === 'number' ? padding.right : fallback,
      bottom: typeof padding.bottom === 'number' ? padding.bottom : fallback,
      left: typeof padding.left === 'number' ? padding.left : fallback
    };
  };

  Chartist.getMetaData = function(series, index) {
    var value = series.data ? series.data[index] : series[index];
    return value ? value.meta : undefined;
  };

  /**
   * Calculate the order of magnitude for the chart scale
   *
   * @memberof Chartist.Core
   * @param {Number} value The value Range of the chart
   * @return {Number} The order of magnitude
   */
  Chartist.orderOfMagnitude = function (value) {
    return Math.floor(Math.log(Math.abs(value)) / Math.LN10);
  };

  /**
   * Project a data length into screen coordinates (pixels)
   *
   * @memberof Chartist.Core
   * @param {Object} axisLength The svg element for the chart
   * @param {Number} length Single data value from a series array
   * @param {Object} bounds All the values to set the bounds of the chart
   * @return {Number} The projected data length in pixels
   */
  Chartist.projectLength = function (axisLength, length, bounds) {
    return length / bounds.range * axisLength;
  };

  /**
   * Get the height of the area in the chart for the data series
   *
   * @memberof Chartist.Core
   * @param {Object} svg The svg element for the chart
   * @param {Object} options The Object that contains all the optional values for the chart
   * @return {Number} The height of the area in the chart for the data series
   */
  Chartist.getAvailableHeight = function (svg, options) {
    return Math.max((Chartist.quantity(options.height).value || svg.height()) - (options.chartPadding.top +  options.chartPadding.bottom) - options.axisX.offset, 0);
  };

  /**
   * Get highest and lowest value of data array. This Array contains the data that will be visualized in the chart.
   *
   * @memberof Chartist.Core
   * @param {Array} data The array that contains the data to be visualized in the chart
   * @param {Object} options The Object that contains the chart options
   * @param {String} dimension Axis dimension 'x' or 'y' used to access the correct value and high / low configuration
   * @return {Object} An object that contains the highest and lowest value that will be visualized on the chart.
   */
  Chartist.getHighLow = function (data, options, dimension) {
    // TODO: Remove workaround for deprecated global high / low config. Axis high / low configuration is preferred
    options = Chartist.extend({}, options, dimension ? options['axis' + dimension.toUpperCase()] : {});

    var highLow = {
        high: options.high === undefined ? -Number.MAX_VALUE : +options.high,
        low: options.low === undefined ? Number.MAX_VALUE : +options.low
      };
    var findHigh = options.high === undefined;
    var findLow = options.low === undefined;

    // Function to recursively walk through arrays and find highest and lowest number
    function recursiveHighLow(data) {
      if(data === undefined) {
        return undefined;
      } else if(data instanceof Array) {
        for (var i = 0; i < data.length; i++) {
          recursiveHighLow(data[i]);
        }
      } else {
        var value = dimension ? +data[dimension] : +data;

        if (findHigh && value > highLow.high) {
          highLow.high = value;
        }

        if (findLow && value < highLow.low) {
          highLow.low = value;
        }
      }
    }

    // Start to find highest and lowest number recursively
    if(findHigh || findLow) {
      recursiveHighLow(data);
    }

    // Overrides of high / low based on reference value, it will make sure that the invisible reference value is
    // used to generate the chart. This is useful when the chart always needs to contain the position of the
    // invisible reference value in the view i.e. for bipolar scales.
    if (options.referenceValue || options.referenceValue === 0) {
      highLow.high = Math.max(options.referenceValue, highLow.high);
      highLow.low = Math.min(options.referenceValue, highLow.low);
    }

    // If high and low are the same because of misconfiguration or flat data (only the same value) we need
    // to set the high or low to 0 depending on the polarity
    if (highLow.high <= highLow.low) {
      // If both values are 0 we set high to 1
      if (highLow.low === 0) {
        highLow.high = 1;
      } else if (highLow.low < 0) {
        // If we have the same negative value for the bounds we set bounds.high to 0
        highLow.high = 0;
      } else if (highLow.high > 0) {
        // If we have the same positive value for the bounds we set bounds.low to 0
        highLow.low = 0;
      } else {
        // If data array was empty, values are Number.MAX_VALUE and -Number.MAX_VALUE. Set bounds to prevent errors
        highLow.high = 1;
        highLow.low = 0;
      }
    }

    return highLow;
  };

  /**
   * Checks if a value can be safely coerced to a number. This includes all values except null which result in finite numbers when coerced. This excludes NaN, since it's not finite.
   *
   * @memberof Chartist.Core
   * @param value
   * @returns {Boolean}
   */
  Chartist.isNumeric = function(value) {
    return value === null ? false : isFinite(value);
  };

  /**
   * Returns true on all falsey values except the numeric value 0.
   *
   * @memberof Chartist.Core
   * @param value
   * @returns {boolean}
   */
  Chartist.isFalseyButZero = function(value) {
    return !value && value !== 0;
  };

  /**
   * Returns a number if the passed parameter is a valid number or the function will return undefined. On all other values than a valid number, this function will return undefined.
   *
   * @memberof Chartist.Core
   * @param value
   * @returns {*}
   */
  Chartist.getNumberOrUndefined = function(value) {
    return Chartist.isNumeric(value) ? +value : undefined;
  };

  /**
   * Checks if provided value object is multi value (contains x or y properties)
   *
   * @memberof Chartist.Core
   * @param value
   */
  Chartist.isMultiValue = function(value) {
    return typeof value === 'object' && ('x' in value || 'y' in value);
  };

  /**
   * Gets a value from a dimension `value.x` or `value.y` while returning value directly if it's a valid numeric value. If the value is not numeric and it's falsey this function will return `defaultValue`.
   *
   * @memberof Chartist.Core
   * @param value
   * @param dimension
   * @param defaultValue
   * @returns {*}
   */
  Chartist.getMultiValue = function(value, dimension) {
    if(Chartist.isMultiValue(value)) {
      return Chartist.getNumberOrUndefined(value[dimension || 'y']);
    } else {
      return Chartist.getNumberOrUndefined(value);
    }
  };

  /**
   * Pollard Rho Algorithm to find smallest factor of an integer value. There are more efficient algorithms for factorization, but this one is quite efficient and not so complex.
   *
   * @memberof Chartist.Core
   * @param {Number} num An integer number where the smallest factor should be searched for
   * @returns {Number} The smallest integer factor of the parameter num.
   */
  Chartist.rho = function(num) {
    if(num === 1) {
      return num;
    }

    function gcd(p, q) {
      if (p % q === 0) {
        return q;
      } else {
        return gcd(q, p % q);
      }
    }

    function f(x) {
      return x * x + 1;
    }

    var x1 = 2, x2 = 2, divisor;
    if (num % 2 === 0) {
      return 2;
    }

    do {
      x1 = f(x1) % num;
      x2 = f(f(x2)) % num;
      divisor = gcd(Math.abs(x1 - x2), num);
    } while (divisor === 1);

    return divisor;
  };

  /**
   * Calculate and retrieve all the bounds for the chart and return them in one array
   *
   * @memberof Chartist.Core
   * @param {Number} axisLength The length of the Axis used for
   * @param {Object} highLow An object containing a high and low property indicating the value range of the chart.
   * @param {Number} scaleMinSpace The minimum projected length a step should result in
   * @param {Boolean} onlyInteger
   * @return {Object} All the values to set the bounds of the chart
   */
  Chartist.getBounds = function (axisLength, highLow, scaleMinSpace, onlyInteger) {
    var i,
      optimizationCounter = 0,
      newMin,
      newMax,
      bounds = {
        high: highLow.high,
        low: highLow.low
      };

    bounds.valueRange = bounds.high - bounds.low;
    bounds.oom = Chartist.orderOfMagnitude(bounds.valueRange);
    bounds.step = Math.pow(10, bounds.oom);
    bounds.min = Math.floor(bounds.low / bounds.step) * bounds.step;
    bounds.max = Math.ceil(bounds.high / bounds.step) * bounds.step;
    bounds.range = bounds.max - bounds.min;
    bounds.numberOfSteps = Math.round(bounds.range / bounds.step);

    // Optimize scale step by checking if subdivision is possible based on horizontalGridMinSpace
    // If we are already below the scaleMinSpace value we will scale up
    var length = Chartist.projectLength(axisLength, bounds.step, bounds);
    var scaleUp = length < scaleMinSpace;
    var smallestFactor = onlyInteger ? Chartist.rho(bounds.range) : 0;

    // First check if we should only use integer steps and if step 1 is still larger than scaleMinSpace so we can use 1
    if(onlyInteger && Chartist.projectLength(axisLength, 1, bounds) >= scaleMinSpace) {
      bounds.step = 1;
    } else if(onlyInteger && smallestFactor < bounds.step && Chartist.projectLength(axisLength, smallestFactor, bounds) >= scaleMinSpace) {
      // If step 1 was too small, we can try the smallest factor of range
      // If the smallest factor is smaller than the current bounds.step and the projected length of smallest factor
      // is larger than the scaleMinSpace we should go for it.
      bounds.step = smallestFactor;
    } else {
      // Trying to divide or multiply by 2 and find the best step value
      while (true) {
        if (scaleUp && Chartist.projectLength(axisLength, bounds.step, bounds) <= scaleMinSpace) {
          bounds.step *= 2;
        } else if (!scaleUp && Chartist.projectLength(axisLength, bounds.step / 2, bounds) >= scaleMinSpace) {
          bounds.step /= 2;
          if(onlyInteger && bounds.step % 1 !== 0) {
            bounds.step *= 2;
            break;
          }
        } else {
          break;
        }

        if(optimizationCounter++ > 1000) {
          throw new Error('Exceeded maximum number of iterations while optimizing scale step!');
        }
      }
    }

    var EPSILON = 2.221E-16;
    bounds.step = Math.max(bounds.step, EPSILON);
    function safeIncrement(value, increment) {
      // If increment is too small use *= (1+EPSILON) as a simple nextafter
      if (value === (value += increment)) {
      	value *= (1 + (increment > 0 ? EPSILON : -EPSILON));
      }
      return value;
    }

    // Narrow min and max based on new step
    newMin = bounds.min;
    newMax = bounds.max;
    while (newMin + bounds.step <= bounds.low) {
    	newMin = safeIncrement(newMin, bounds.step);
    }
    while (newMax - bounds.step >= bounds.high) {
    	newMax = safeIncrement(newMax, -bounds.step);
    }
    bounds.min = newMin;
    bounds.max = newMax;
    bounds.range = bounds.max - bounds.min;

    var values = [];
    for (i = bounds.min; i <= bounds.max; i = safeIncrement(i, bounds.step)) {
      var value = Chartist.roundWithPrecision(i);
      if (value !== values[values.length - 1]) {
        values.push(value);
      }
    }
    bounds.values = values;
    return bounds;
  };

  /**
   * Calculate cartesian coordinates of polar coordinates
   *
   * @memberof Chartist.Core
   * @param {Number} centerX X-axis coordinates of center point of circle segment
   * @param {Number} centerY X-axis coordinates of center point of circle segment
   * @param {Number} radius Radius of circle segment
   * @param {Number} angleInDegrees Angle of circle segment in degrees
   * @return {{x:Number, y:Number}} Coordinates of point on circumference
   */
  Chartist.polarToCartesian = function (centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  /**
   * Initialize chart drawing rectangle (area where chart is drawn) x1,y1 = bottom left / x2,y2 = top right
   *
   * @memberof Chartist.Core
   * @param {Object} svg The svg element for the chart
   * @param {Object} options The Object that contains all the optional values for the chart
   * @param {Number} [fallbackPadding] The fallback padding if partial padding objects are used
   * @return {Object} The chart rectangles coordinates inside the svg element plus the rectangles measurements
   */
  Chartist.createChartRect = function (svg, options, fallbackPadding) {
    var hasAxis = !!(options.axisX || options.axisY);
    var yAxisOffset = hasAxis ? options.axisY.offset : 0;
    var xAxisOffset = hasAxis ? options.axisX.offset : 0;
    // If width or height results in invalid value (including 0) we fallback to the unitless settings or even 0
    var width = svg.width() || Chartist.quantity(options.width).value || 0;
    var height = svg.height() || Chartist.quantity(options.height).value || 0;
    var normalizedPadding = Chartist.normalizePadding(options.chartPadding, fallbackPadding);

    // If settings were to small to cope with offset (legacy) and padding, we'll adjust
    width = Math.max(width, yAxisOffset + normalizedPadding.left + normalizedPadding.right);
    height = Math.max(height, xAxisOffset + normalizedPadding.top + normalizedPadding.bottom);

    var chartRect = {
      padding: normalizedPadding,
      width: function () {
        return this.x2 - this.x1;
      },
      height: function () {
        return this.y1 - this.y2;
      }
    };

    if(hasAxis) {
      if (options.axisX.position === 'start') {
        chartRect.y2 = normalizedPadding.top + xAxisOffset;
        chartRect.y1 = Math.max(height - normalizedPadding.bottom, chartRect.y2 + 1);
      } else {
        chartRect.y2 = normalizedPadding.top;
        chartRect.y1 = Math.max(height - normalizedPadding.bottom - xAxisOffset, chartRect.y2 + 1);
      }

      if (options.axisY.position === 'start') {
        chartRect.x1 = normalizedPadding.left + yAxisOffset;
        chartRect.x2 = Math.max(width - normalizedPadding.right, chartRect.x1 + 1);
      } else {
        chartRect.x1 = normalizedPadding.left;
        chartRect.x2 = Math.max(width - normalizedPadding.right - yAxisOffset, chartRect.x1 + 1);
      }
    } else {
      chartRect.x1 = normalizedPadding.left;
      chartRect.x2 = Math.max(width - normalizedPadding.right, chartRect.x1 + 1);
      chartRect.y2 = normalizedPadding.top;
      chartRect.y1 = Math.max(height - normalizedPadding.bottom, chartRect.y2 + 1);
    }

    return chartRect;
  };

  /**
   * Creates a grid line based on a projected value.
   *
   * @memberof Chartist.Core
   * @param position
   * @param index
   * @param axis
   * @param offset
   * @param length
   * @param group
   * @param classes
   * @param eventEmitter
   */
  Chartist.createGrid = function(position, index, axis, offset, length, group, classes, eventEmitter) {
    var positionalData = {};
    positionalData[axis.units.pos + '1'] = position;
    positionalData[axis.units.pos + '2'] = position;
    positionalData[axis.counterUnits.pos + '1'] = offset;
    positionalData[axis.counterUnits.pos + '2'] = offset + length;

    var gridElement = group.elem('line', positionalData, classes.join(' '));

    // Event for grid draw
    eventEmitter.emit('draw',
      Chartist.extend({
        type: 'grid',
        axis: axis,
        index: index,
        group: group,
        element: gridElement
      }, positionalData)
    );
  };

  /**
   * Creates a grid background rect and emits the draw event.
   *
   * @memberof Chartist.Core
   * @param gridGroup
   * @param chartRect
   * @param className
   * @param eventEmitter
   */
  Chartist.createGridBackground = function (gridGroup, chartRect, className, eventEmitter) {
    var gridBackground = gridGroup.elem('rect', {
        x: chartRect.x1,
        y: chartRect.y2,
        width: chartRect.width(),
        height: chartRect.height(),
      }, className, true);

      // Event for grid background draw
      eventEmitter.emit('draw', {
        type: 'gridBackground',
        group: gridGroup,
        element: gridBackground
      });
  };

  /**
   * Creates a label based on a projected value and an axis.
   *
   * @memberof Chartist.Core
   * @param position
   * @param length
   * @param index
   * @param labels
   * @param axis
   * @param axisOffset
   * @param labelOffset
   * @param group
   * @param classes
   * @param useForeignObject
   * @param eventEmitter
   */
  Chartist.createLabel = function(position, length, index, labels, axis, axisOffset, labelOffset, group, classes, useForeignObject, eventEmitter) {
    var labelElement;
    var positionalData = {};

    positionalData[axis.units.pos] = position + labelOffset[axis.units.pos];
    positionalData[axis.counterUnits.pos] = labelOffset[axis.counterUnits.pos];
    positionalData[axis.units.len] = length;
    positionalData[axis.counterUnits.len] = Math.max(0, axisOffset - 10);

    if(useForeignObject) {
      // We need to set width and height explicitly to px as span will not expand with width and height being
      // 100% in all browsers
      var content = document.createElement('span');
      content.className = classes.join(' ');
      content.setAttribute('xmlns', Chartist.namespaces.xhtml);
      content.innerText = labels[index];
      content.style[axis.units.len] = Math.round(positionalData[axis.units.len]) + 'px';
      content.style[axis.counterUnits.len] = Math.round(positionalData[axis.counterUnits.len]) + 'px';

      labelElement = group.foreignObject(content, Chartist.extend({
        style: 'overflow: visible;'
      }, positionalData));
    } else {
      labelElement = group.elem('text', positionalData, classes.join(' ')).text(labels[index]);
    }

    eventEmitter.emit('draw', Chartist.extend({
      type: 'label',
      axis: axis,
      index: index,
      group: group,
      element: labelElement,
      text: labels[index]
    }, positionalData));
  };

  /**
   * Helper to read series specific options from options object. It automatically falls back to the global option if
   * there is no option in the series options.
   *
   * @param {Object} series Series object
   * @param {Object} options Chartist options object
   * @param {string} key The options key that should be used to obtain the options
   * @returns {*}
   */
  Chartist.getSeriesOption = function(series, options, key) {
    if(series.name && options.series && options.series[series.name]) {
      var seriesOptions = options.series[series.name];
      return seriesOptions.hasOwnProperty(key) ? seriesOptions[key] : options[key];
    } else {
      return options[key];
    }
  };

  /**
   * Provides options handling functionality with callback for options changes triggered by responsive options and media query matches
   *
   * @memberof Chartist.Core
   * @param {Object} options Options set by user
   * @param {Array} responsiveOptions Optional functions to add responsive behavior to chart
   * @param {Object} eventEmitter The event emitter that will be used to emit the options changed events
   * @return {Object} The consolidated options object from the defaults, base and matching responsive options
   */
  Chartist.optionsProvider = function (options, responsiveOptions, eventEmitter) {
    var baseOptions = Chartist.extend({}, options),
      currentOptions,
      mediaQueryListeners = [],
      i;

    function updateCurrentOptions(mediaEvent) {
      var previousOptions = currentOptions;
      currentOptions = Chartist.extend({}, baseOptions);

      if (responsiveOptions) {
        for (i = 0; i < responsiveOptions.length; i++) {
          var mql = window.matchMedia(responsiveOptions[i][0]);
          if (mql.matches) {
            currentOptions = Chartist.extend(currentOptions, responsiveOptions[i][1]);
          }
        }
      }

      if(eventEmitter && mediaEvent) {
        eventEmitter.emit('optionsChanged', {
          previousOptions: previousOptions,
          currentOptions: currentOptions
        });
      }
    }

    function removeMediaQueryListeners() {
      mediaQueryListeners.forEach(function(mql) {
        mql.removeListener(updateCurrentOptions);
      });
    }

    if (!window.matchMedia) {
      throw 'window.matchMedia not found! Make sure you\'re using a polyfill.';
    } else if (responsiveOptions) {

      for (i = 0; i < responsiveOptions.length; i++) {
        var mql = window.matchMedia(responsiveOptions[i][0]);
        mql.addListener(updateCurrentOptions);
        mediaQueryListeners.push(mql);
      }
    }
    // Execute initially without an event argument so we get the correct options
    updateCurrentOptions();

    return {
      removeMediaQueryListeners: removeMediaQueryListeners,
      getCurrentOptions: function getCurrentOptions() {
        return Chartist.extend({}, currentOptions);
      }
    };
  };


  /**
   * Splits a list of coordinates and associated values into segments. Each returned segment contains a pathCoordinates
   * valueData property describing the segment.
   *
   * With the default options, segments consist of contiguous sets of points that do not have an undefined value. Any
   * points with undefined values are discarded.
   *
   * **Options**
   * The following options are used to determine how segments are formed
   * ```javascript
   * var options = {
   *   // If fillHoles is true, undefined values are simply discarded without creating a new segment. Assuming other options are default, this returns single segment.
   *   fillHoles: false,
   *   // If increasingX is true, the coordinates in all segments have strictly increasing x-values.
   *   increasingX: false
   * };
   * ```
   *
   * @memberof Chartist.Core
   * @param {Array} pathCoordinates List of point coordinates to be split in the form [x1, y1, x2, y2 ... xn, yn]
   * @param {Array} values List of associated point values in the form [v1, v2 .. vn]
   * @param {Object} options Options set by user
   * @return {Array} List of segments, each containing a pathCoordinates and valueData property.
   */
  Chartist.splitIntoSegments = function(pathCoordinates, valueData, options) {
    var defaultOptions = {
      increasingX: false,
      fillHoles: false
    };

    options = Chartist.extend({}, defaultOptions, options);

    var segments = [];
    var hole = true;

    for(var i = 0; i < pathCoordinates.length; i += 2) {
      // If this value is a "hole" we set the hole flag
      if(Chartist.getMultiValue(valueData[i / 2].value) === undefined) {
      // if(valueData[i / 2].value === undefined) {
        if(!options.fillHoles) {
          hole = true;
        }
      } else {
        if(options.increasingX && i >= 2 && pathCoordinates[i] <= pathCoordinates[i-2]) {
          // X is not increasing, so we need to make sure we start a new segment
          hole = true;
        }


        // If it's a valid value we need to check if we're coming out of a hole and create a new empty segment
        if(hole) {
          segments.push({
            pathCoordinates: [],
            valueData: []
          });
          // As we have a valid value now, we are not in a "hole" anymore
          hole = false;
        }

        // Add to the segment pathCoordinates and valueData
        segments[segments.length - 1].pathCoordinates.push(pathCoordinates[i], pathCoordinates[i + 1]);
        segments[segments.length - 1].valueData.push(valueData[i / 2]);
      }
    }

    return segments;
  };
}(this, Chartist));
;/**
 * Chartist path interpolation functions.
 *
 * @module Chartist.Interpolation
 */
/* global Chartist */
(function(globalRoot, Chartist) {
  'use strict';

  Chartist.Interpolation = {};

  /**
   * This interpolation function does not smooth the path and the result is only containing lines and no curves.
   *
   * @example
   * var chart = new Chartist.Line('.ct-chart', {
   *   labels: [1, 2, 3, 4, 5],
   *   series: [[1, 2, 8, 1, 7]]
   * }, {
   *   lineSmooth: Chartist.Interpolation.none({
   *     fillHoles: false
   *   })
   * });
   *
   *
   * @memberof Chartist.Interpolation
   * @return {Function}
   */
  Chartist.Interpolation.none = function(options) {
    var defaultOptions = {
      fillHoles: false
    };
    options = Chartist.extend({}, defaultOptions, options);
    return function none(pathCoordinates, valueData) {
      var path = new Chartist.Svg.Path();
      var hole = true;

      for(var i = 0; i < pathCoordinates.length; i += 2) {
        var currX = pathCoordinates[i];
        var currY = pathCoordinates[i + 1];
        var currData = valueData[i / 2];

        if(Chartist.getMultiValue(currData.value) !== undefined) {

          if(hole) {
            path.move(currX, currY, false, currData);
          } else {
            path.line(currX, currY, false, currData);
          }

          hole = false;
        } else if(!options.fillHoles) {
          hole = true;
        }
      }

      return path;
    };
  };

  /**
   * Simple smoothing creates horizontal handles that are positioned with a fraction of the length between two data points. You can use the divisor option to specify the amount of smoothing.
   *
   * Simple smoothing can be used instead of `Chartist.Smoothing.cardinal` if you'd like to get rid of the artifacts it produces sometimes. Simple smoothing produces less flowing lines but is accurate by hitting the points and it also doesn't swing below or above the given data point.
   *
   * All smoothing functions within Chartist are factory functions that accept an options parameter. The simple interpolation function accepts one configuration parameter `divisor`, between 1 and ∞, which controls the smoothing characteristics.
   *
   * @example
   * var chart = new Chartist.Line('.ct-chart', {
   *   labels: [1, 2, 3, 4, 5],
   *   series: [[1, 2, 8, 1, 7]]
   * }, {
   *   lineSmooth: Chartist.Interpolation.simple({
   *     divisor: 2,
   *     fillHoles: false
   *   })
   * });
   *
   *
   * @memberof Chartist.Interpolation
   * @param {Object} options The options of the simple interpolation factory function.
   * @return {Function}
   */
  Chartist.Interpolation.simple = function(options) {
    var defaultOptions = {
      divisor: 2,
      fillHoles: false
    };
    options = Chartist.extend({}, defaultOptions, options);

    var d = 1 / Math.max(1, options.divisor);

    return function simple(pathCoordinates, valueData) {
      var path = new Chartist.Svg.Path();
      var prevX, prevY, prevData;

      for(var i = 0; i < pathCoordinates.length; i += 2) {
        var currX = pathCoordinates[i];
        var currY = pathCoordinates[i + 1];
        var length = (currX - prevX) * d;
        var currData = valueData[i / 2];

        if(currData.value !== undefined) {

          if(prevData === undefined) {
            path.move(currX, currY, false, currData);
          } else {
            path.curve(
              prevX + length,
              prevY,
              currX - length,
              currY,
              currX,
              currY,
              false,
              currData
            );
          }

          prevX = currX;
          prevY = currY;
          prevData = currData;
        } else if(!options.fillHoles) {
          prevX = currX = prevData = undefined;
        }
      }

      return path;
    };
  };

  /**
   * Cardinal / Catmull-Rome spline interpolation is the default smoothing function in Chartist. It produces nice results where the splines will always meet the points. It produces some artifacts though when data values are increased or decreased rapidly. The line may not follow a very accurate path and if the line should be accurate this smoothing function does not produce the best results.
   *
   * Cardinal splines can only be created if there are more than two data points. If this is not the case this smoothing will fallback to `Chartist.Smoothing.none`.
   *
   * All smoothing functions within Chartist are factory functions that accept an options parameter. The cardinal interpolation function accepts one configuration parameter `tension`, between 0 and 1, which controls the smoothing intensity.
   *
   * @example
   * var chart = new Chartist.Line('.ct-chart', {
   *   labels: [1, 2, 3, 4, 5],
   *   series: [[1, 2, 8, 1, 7]]
   * }, {
   *   lineSmooth: Chartist.Interpolation.cardinal({
   *     tension: 1,
   *     fillHoles: false
   *   })
   * });
   *
   * @memberof Chartist.Interpolation
   * @param {Object} options The options of the cardinal factory function.
   * @return {Function}
   */
  Chartist.Interpolation.cardinal = function(options) {
    var defaultOptions = {
      tension: 1,
      fillHoles: false
    };

    options = Chartist.extend({}, defaultOptions, options);

    var t = Math.min(1, Math.max(0, options.tension)),
      c = 1 - t;

    return function cardinal(pathCoordinates, valueData) {
      // First we try to split the coordinates into segments
      // This is necessary to treat "holes" in line charts
      var segments = Chartist.splitIntoSegments(pathCoordinates, valueData, {
        fillHoles: options.fillHoles
      });

      if(!segments.length) {
        // If there were no segments return 'Chartist.Interpolation.none'
        return Chartist.Interpolation.none()([]);
      } else if(segments.length > 1) {
        // If the split resulted in more that one segment we need to interpolate each segment individually and join them
        // afterwards together into a single path.
          var paths = [];
        // For each segment we will recurse the cardinal function
        segments.forEach(function(segment) {
          paths.push(cardinal(segment.pathCoordinates, segment.valueData));
        });
        // Join the segment path data into a single path and return
        return Chartist.Svg.Path.join(paths);
      } else {
        // If there was only one segment we can proceed regularly by using pathCoordinates and valueData from the first
        // segment
        pathCoordinates = segments[0].pathCoordinates;
        valueData = segments[0].valueData;

        // If less than two points we need to fallback to no smoothing
        if(pathCoordinates.length <= 4) {
          return Chartist.Interpolation.none()(pathCoordinates, valueData);
        }

        var path = new Chartist.Svg.Path().move(pathCoordinates[0], pathCoordinates[1], false, valueData[0]),
          z;

        for (var i = 0, iLen = pathCoordinates.length; iLen - 2 * !z > i; i += 2) {
          var p = [
            {x: +pathCoordinates[i - 2], y: +pathCoordinates[i - 1]},
            {x: +pathCoordinates[i], y: +pathCoordinates[i + 1]},
            {x: +pathCoordinates[i + 2], y: +pathCoordinates[i + 3]},
            {x: +pathCoordinates[i + 4], y: +pathCoordinates[i + 5]}
          ];
          if (z) {
            if (!i) {
              p[0] = {x: +pathCoordinates[iLen - 2], y: +pathCoordinates[iLen - 1]};
            } else if (iLen - 4 === i) {
              p[3] = {x: +pathCoordinates[0], y: +pathCoordinates[1]};
            } else if (iLen - 2 === i) {
              p[2] = {x: +pathCoordinates[0], y: +pathCoordinates[1]};
              p[3] = {x: +pathCoordinates[2], y: +pathCoordinates[3]};
            }
          } else {
            if (iLen - 4 === i) {
              p[3] = p[2];
            } else if (!i) {
              p[0] = {x: +pathCoordinates[i], y: +pathCoordinates[i + 1]};
            }
          }

          path.curve(
            (t * (-p[0].x + 6 * p[1].x + p[2].x) / 6) + (c * p[2].x),
            (t * (-p[0].y + 6 * p[1].y + p[2].y) / 6) + (c * p[2].y),
            (t * (p[1].x + 6 * p[2].x - p[3].x) / 6) + (c * p[2].x),
            (t * (p[1].y + 6 * p[2].y - p[3].y) / 6) + (c * p[2].y),
            p[2].x,
            p[2].y,
            false,
            valueData[(i + 2) / 2]
          );
        }

        return path;
      }
    };
  };

  /**
   * Monotone Cubic spline interpolation produces a smooth curve which preserves monotonicity. Unlike cardinal splines, the curve will not extend beyond the range of y-values of the original data points.
   *
   * Monotone Cubic splines can only be created if there are more than two data points. If this is not the case this smoothing will fallback to `Chartist.Smoothing.none`.
   *
   * The x-values of subsequent points must be increasing to fit a Monotone Cubic spline. If this condition is not met for a pair of adjacent points, then there will be a break in the curve between those data points.
   *
   * All smoothing functions within Chartist are factory functions that accept an options parameter.
   *
   * @example
   * var chart = new Chartist.Line('.ct-chart', {
   *   labels: [1, 2, 3, 4, 5],
   *   series: [[1, 2, 8, 1, 7]]
   * }, {
   *   lineSmooth: Chartist.Interpolation.monotoneCubic({
   *     fillHoles: false
   *   })
   * });
   *
   * @memberof Chartist.Interpolation
   * @param {Object} options The options of the monotoneCubic factory function.
   * @return {Function}
   */
  Chartist.Interpolation.monotoneCubic = function(options) {
    var defaultOptions = {
      fillHoles: false
    };

    options = Chartist.extend({}, defaultOptions, options);

    return function monotoneCubic(pathCoordinates, valueData) {
      // First we try to split the coordinates into segments
      // This is necessary to treat "holes" in line charts
      var segments = Chartist.splitIntoSegments(pathCoordinates, valueData, {
        fillHoles: options.fillHoles,
        increasingX: true
      });

      if(!segments.length) {
        // If there were no segments return 'Chartist.Interpolation.none'
        return Chartist.Interpolation.none()([]);
      } else if(segments.length > 1) {
        // If the split resulted in more that one segment we need to interpolate each segment individually and join them
        // afterwards together into a single path.
          var paths = [];
        // For each segment we will recurse the monotoneCubic fn function
        segments.forEach(function(segment) {
          paths.push(monotoneCubic(segment.pathCoordinates, segment.valueData));
        });
        // Join the segment path data into a single path and return
        return Chartist.Svg.Path.join(paths);
      } else {
        // If there was only one segment we can proceed regularly by using pathCoordinates and valueData from the first
        // segment
        pathCoordinates = segments[0].pathCoordinates;
        valueData = segments[0].valueData;

        // If less than three points we need to fallback to no smoothing
        if(pathCoordinates.length <= 4) {
          return Chartist.Interpolation.none()(pathCoordinates, valueData);
        }

        var xs = [],
          ys = [],
          i,
          n = pathCoordinates.length / 2,
          ms = [],
          ds = [], dys = [], dxs = [],
          path;

        // Populate x and y coordinates into separate arrays, for readability

        for(i = 0; i < n; i++) {
          xs[i] = pathCoordinates[i * 2];
          ys[i] = pathCoordinates[i * 2 + 1];
        }

        // Calculate deltas and derivative

        for(i = 0; i < n - 1; i++) {
          dys[i] = ys[i + 1] - ys[i];
          dxs[i] = xs[i + 1] - xs[i];
          ds[i] = dys[i] / dxs[i];
        }

        // Determine desired slope (m) at each point using Fritsch-Carlson method
        // See: http://math.stackexchange.com/questions/45218/implementation-of-monotone-cubic-interpolation

        ms[0] = ds[0];
        ms[n - 1] = ds[n - 2];

        for(i = 1; i < n - 1; i++) {
          if(ds[i] === 0 || ds[i - 1] === 0 || (ds[i - 1] > 0) !== (ds[i] > 0)) {
            ms[i] = 0;
          } else {
            ms[i] = 3 * (dxs[i - 1] + dxs[i]) / (
              (2 * dxs[i] + dxs[i - 1]) / ds[i - 1] +
              (dxs[i] + 2 * dxs[i - 1]) / ds[i]);

            if(!isFinite(ms[i])) {
              ms[i] = 0;
            }
          }
        }

        // Now build a path from the slopes

        path = new Chartist.Svg.Path().move(xs[0], ys[0], false, valueData[0]);

        for(i = 0; i < n - 1; i++) {
          path.curve(
            // First control point
            xs[i] + dxs[i] / 3,
            ys[i] + ms[i] * dxs[i] / 3,
            // Second control point
            xs[i + 1] - dxs[i] / 3,
            ys[i + 1] - ms[i + 1] * dxs[i] / 3,
            // End point
            xs[i + 1],
            ys[i + 1],

            false,
            valueData[i + 1]
          );
        }

        return path;
      }
    };
  };

  /**
   * Step interpolation will cause the line chart to move in steps rather than diagonal or smoothed lines. This interpolation will create additional points that will also be drawn when the `showPoint` option is enabled.
   *
   * All smoothing functions within Chartist are factory functions that accept an options parameter. The step interpolation function accepts one configuration parameter `postpone`, that can be `true` or `false`. The default value is `true` and will cause the step to occur where the value actually changes. If a different behaviour is needed where the step is shifted to the left and happens before the actual value, this option can be set to `false`.
   *
   * @example
   * var chart = new Chartist.Line('.ct-chart', {
   *   labels: [1, 2, 3, 4, 5],
   *   series: [[1, 2, 8, 1, 7]]
   * }, {
   *   lineSmooth: Chartist.Interpolation.step({
   *     postpone: true,
   *     fillHoles: false
   *   })
   * });
   *
   * @memberof Chartist.Interpolation
   * @param options
   * @returns {Function}
   */
  Chartist.Interpolation.step = function(options) {
    var defaultOptions = {
      postpone: true,
      fillHoles: false
    };

    options = Chartist.extend({}, defaultOptions, options);

    return function step(pathCoordinates, valueData) {
      var path = new Chartist.Svg.Path();

      var prevX, prevY, prevData;

      for (var i = 0; i < pathCoordinates.length; i += 2) {
        var currX = pathCoordinates[i];
        var currY = pathCoordinates[i + 1];
        var currData = valueData[i / 2];

        // If the current point is also not a hole we can draw the step lines
        if(currData.value !== undefined) {
          if(prevData === undefined) {
            path.move(currX, currY, false, currData);
          } else {
            if(options.postpone) {
              // If postponed we should draw the step line with the value of the previous value
              path.line(currX, prevY, false, prevData);
            } else {
              // If not postponed we should draw the step line with the value of the current value
              path.line(prevX, currY, false, currData);
            }
            // Line to the actual point (this should only be a Y-Axis movement
            path.line(currX, currY, false, currData);
          }

          prevX = currX;
          prevY = currY;
          prevData = currData;
        } else if(!options.fillHoles) {
          prevX = prevY = prevData = undefined;
        }
      }

      return path;
    };
  };

}(this, Chartist));
;/**
 * A very basic event module that helps to generate and catch events.
 *
 * @module Chartist.Event
 */
/* global Chartist */
(function (globalRoot, Chartist) {
  'use strict';

  Chartist.EventEmitter = function () {
    var handlers = [];

    /**
     * Add an event handler for a specific event
     *
     * @memberof Chartist.Event
     * @param {String} event The event name
     * @param {Function} handler A event handler function
     */
    function addEventHandler(event, handler) {
      handlers[event] = handlers[event] || [];
      handlers[event].push(handler);
    }

    /**
     * Remove an event handler of a specific event name or remove all event handlers for a specific event.
     *
     * @memberof Chartist.Event
     * @param {String} event The event name where a specific or all handlers should be removed
     * @param {Function} [handler] An optional event handler function. If specified only this specific handler will be removed and otherwise all handlers are removed.
     */
    function removeEventHandler(event, handler) {
      // Only do something if there are event handlers with this name existing
      if(handlers[event]) {
        // If handler is set we will look for a specific handler and only remove this
        if(handler) {
          handlers[event].splice(handlers[event].indexOf(handler), 1);
          if(handlers[event].length === 0) {
            delete handlers[event];
          }
        } else {
          // If no handler is specified we remove all handlers for this event
          delete handlers[event];
        }
      }
    }

    /**
     * Use this function to emit an event. All handlers that are listening for this event will be triggered with the data parameter.
     *
     * @memberof Chartist.Event
     * @param {String} event The event name that should be triggered
     * @param {*} data Arbitrary data that will be passed to the event handler callback functions
     */
    function emit(event, data) {
      // Only do something if there are event handlers with this name existing
      if(handlers[event]) {
        handlers[event].forEach(function(handler) {
          handler(data);
        });
      }

      // Emit event to star event handlers
      if(handlers['*']) {
        handlers['*'].forEach(function(starHandler) {
          starHandler(event, data);
        });
      }
    }

    return {
      addEventHandler: addEventHandler,
      removeEventHandler: removeEventHandler,
      emit: emit
    };
  };

}(this, Chartist));
;/**
 * This module provides some basic prototype inheritance utilities.
 *
 * @module Chartist.Class
 */
/* global Chartist */
(function(globalRoot, Chartist) {
  'use strict';

  function listToArray(list) {
    var arr = [];
    if (list.length) {
      for (var i = 0; i < list.length; i++) {
        arr.push(list[i]);
      }
    }
    return arr;
  }

  /**
   * Method to extend from current prototype.
   *
   * @memberof Chartist.Class
   * @param {Object} properties The object that serves as definition for the prototype that gets created for the new class. This object should always contain a constructor property that is the desired constructor for the newly created class.
   * @param {Object} [superProtoOverride] By default extens will use the current class prototype or Chartist.class. With this parameter you can specify any super prototype that will be used.
   * @return {Function} Constructor function of the new class
   *
   * @example
   * var Fruit = Class.extend({
     * color: undefined,
     *   sugar: undefined,
     *
     *   constructor: function(color, sugar) {
     *     this.color = color;
     *     this.sugar = sugar;
     *   },
     *
     *   eat: function() {
     *     this.sugar = 0;
     *     return this;
     *   }
     * });
   *
   * var Banana = Fruit.extend({
     *   length: undefined,
     *
     *   constructor: function(length, sugar) {
     *     Banana.super.constructor.call(this, 'Yellow', sugar);
     *     this.length = length;
     *   }
     * });
   *
   * var banana = new Banana(20, 40);
   * console.log('banana instanceof Fruit', banana instanceof Fruit);
   * console.log('Fruit is prototype of banana', Fruit.prototype.isPrototypeOf(banana));
   * console.log('bananas prototype is Fruit', Object.getPrototypeOf(banana) === Fruit.prototype);
   * console.log(banana.sugar);
   * console.log(banana.eat().sugar);
   * console.log(banana.color);
   */
  function extend(properties, superProtoOverride) {
    var superProto = superProtoOverride || this.prototype || Chartist.Class;
    var proto = Object.create(superProto);

    Chartist.Class.cloneDefinitions(proto, properties);

    var constr = function() {
      var fn = proto.constructor || function () {},
        instance;

      // If this is linked to the Chartist namespace the constructor was not called with new
      // To provide a fallback we will instantiate here and return the instance
      instance = this === Chartist ? Object.create(proto) : this;
      fn.apply(instance, Array.prototype.slice.call(arguments, 0));

      // If this constructor was not called with new we need to return the instance
      // This will not harm when the constructor has been called with new as the returned value is ignored
      return instance;
    };

    constr.prototype = proto;
    constr.super = superProto;
    constr.extend = this.extend;

    return constr;
  }

  // Variable argument list clones args > 0 into args[0] and retruns modified args[0]
  function cloneDefinitions() {
    var args = listToArray(arguments);
    var target = args[0];

    args.splice(1, args.length - 1).forEach(function (source) {
      Object.getOwnPropertyNames(source).forEach(function (propName) {
        // If this property already exist in target we delete it first
        delete target[propName];
        // Define the property with the descriptor from source
        Object.defineProperty(target, propName,
          Object.getOwnPropertyDescriptor(source, propName));
      });
    });

    return target;
  }

  Chartist.Class = {
    extend: extend,
    cloneDefinitions: cloneDefinitions
  };

}(this, Chartist));
;/**
 * Base for all chart types. The methods in Chartist.Base are inherited to all chart types.
 *
 * @module Chartist.Base
 */
/* global Chartist */
(function(globalRoot, Chartist) {
  'use strict';

  var window = globalRoot.window;

  // TODO: Currently we need to re-draw the chart on window resize. This is usually very bad and will affect performance.
  // This is done because we can't work with relative coordinates when drawing the chart because SVG Path does not
  // work with relative positions yet. We need to check if we can do a viewBox hack to switch to percentage.
  // See http://mozilla.6506.n7.nabble.com/Specyfing-paths-with-percentages-unit-td247474.html
  // Update: can be done using the above method tested here: http://codepen.io/gionkunz/pen/KDvLj
  // The problem is with the label offsets that can't be converted into percentage and affecting the chart container
  /**
   * Updates the chart which currently does a full reconstruction of the SVG DOM
   *
   * @param {Object} [data] Optional data you'd like to set for the chart before it will update. If not specified the update method will use the data that is already configured with the chart.
   * @param {Object} [options] Optional options you'd like to add to the previous options for the chart before it will update. If not specified the update method will use the options that have been already configured with the chart.
   * @param {Boolean} [override] If set to true, the passed options will be used to extend the options that have been configured already. Otherwise the chart default options will be used as the base
   * @memberof Chartist.Base
   */
  function update(data, options, override) {
    if(data) {
      this.data = data || {};
      this.data.labels = this.data.labels || [];
      this.data.series = this.data.series || [];
      // Event for data transformation that allows to manipulate the data before it gets rendered in the charts
      this.eventEmitter.emit('data', {
        type: 'update',
        data: this.data
      });
    }

    if(options) {
      this.options = Chartist.extend({}, override ? this.options : this.defaultOptions, options);

      // If chartist was not initialized yet, we just set the options and leave the rest to the initialization
      // Otherwise we re-create the optionsProvider at this point
      if(!this.initializeTimeoutId) {
        this.optionsProvider.removeMediaQueryListeners();
        this.optionsProvider = Chartist.optionsProvider(this.options, this.responsiveOptions, this.eventEmitter);
      }
    }

    // Only re-created the chart if it has been initialized yet
    if(!this.initializeTimeoutId) {
      this.createChart(this.optionsProvider.getCurrentOptions());
    }

    // Return a reference to the chart object to chain up calls
    return this;
  }

  /**
   * This method can be called on the API object of each chart and will un-register all event listeners that were added to other components. This currently includes a window.resize listener as well as media query listeners if any responsive options have been provided. Use this function if you need to destroy and recreate Chartist charts dynamically.
   *
   * @memberof Chartist.Base
   */
  function detach() {
    // Only detach if initialization already occurred on this chart. If this chart still hasn't initialized (therefore
    // the initializationTimeoutId is still a valid timeout reference, we will clear the timeout
    if(!this.initializeTimeoutId) {
      window.removeEventListener('resize', this.resizeListener);
      this.optionsProvider.removeMediaQueryListeners();
    } else {
      window.clearTimeout(this.initializeTimeoutId);
    }

    return this;
  }

  /**
   * Use this function to register event handlers. The handler callbacks are synchronous and will run in the main thread rather than the event loop.
   *
   * @memberof Chartist.Base
   * @param {String} event Name of the event. Check the examples for supported events.
   * @param {Function} handler The handler function that will be called when an event with the given name was emitted. This function will receive a data argument which contains event data. See the example for more details.
   */
  function on(event, handler) {
    this.eventEmitter.addEventHandler(event, handler);
    return this;
  }

  /**
   * Use this function to un-register event handlers. If the handler function parameter is omitted all handlers for the given event will be un-registered.
   *
   * @memberof Chartist.Base
   * @param {String} event Name of the event for which a handler should be removed
   * @param {Function} [handler] The handler function that that was previously used to register a new event handler. This handler will be removed from the event handler list. If this parameter is omitted then all event handlers for the given event are removed from the list.
   */
  function off(event, handler) {
    this.eventEmitter.removeEventHandler(event, handler);
    return this;
  }

  function initialize() {
    // Add window resize listener that re-creates the chart
    window.addEventListener('resize', this.resizeListener);

    // Obtain current options based on matching media queries (if responsive options are given)
    // This will also register a listener that is re-creating the chart based on media changes
    this.optionsProvider = Chartist.optionsProvider(this.options, this.responsiveOptions, this.eventEmitter);
    // Register options change listener that will trigger a chart update
    this.eventEmitter.addEventHandler('optionsChanged', function() {
      this.update();
    }.bind(this));

    // Before the first chart creation we need to register us with all plugins that are configured
    // Initialize all relevant plugins with our chart object and the plugin options specified in the config
    if(this.options.plugins) {
      this.options.plugins.forEach(function(plugin) {
        if(plugin instanceof Array) {
          plugin[0](this, plugin[1]);
        } else {
          plugin(this);
        }
      }.bind(this));
    }

    // Event for data transformation that allows to manipulate the data before it gets rendered in the charts
    this.eventEmitter.emit('data', {
      type: 'initial',
      data: this.data
    });

    // Create the first chart
    this.createChart(this.optionsProvider.getCurrentOptions());

    // As chart is initialized from the event loop now we can reset our timeout reference
    // This is important if the chart gets initialized on the same element twice
    this.initializeTimeoutId = undefined;
  }

  /**
   * Constructor of chart base class.
   *
   * @param query
   * @param data
   * @param defaultOptions
   * @param options
   * @param responsiveOptions
   * @constructor
   */
  function Base(query, data, defaultOptions, options, responsiveOptions) {
    this.container = Chartist.querySelector(query);
    this.data = data || {};
    this.data.labels = this.data.labels || [];
    this.data.series = this.data.series || [];
    this.defaultOptions = defaultOptions;
    this.options = options;
    this.responsiveOptions = responsiveOptions;
    this.eventEmitter = Chartist.EventEmitter();
    this.supportsForeignObject = Chartist.Svg.isSupported('Extensibility');
    this.supportsAnimations = Chartist.Svg.isSupported('AnimationEventsAttribute');
    this.resizeListener = function resizeListener(){
      this.update();
    }.bind(this);

    if(this.container) {
      // If chartist was already initialized in this container we are detaching all event listeners first
      if(this.container.__chartist__) {
        this.container.__chartist__.detach();
      }

      this.container.__chartist__ = this;
    }

    // Using event loop for first draw to make it possible to register event listeners in the same call stack where
    // the chart was created.
    this.initializeTimeoutId = setTimeout(initialize.bind(this), 0);
  }

  // Creating the chart base class
  Chartist.Base = Chartist.Class.extend({
    constructor: Base,
    optionsProvider: undefined,
    container: undefined,
    svg: undefined,
    eventEmitter: undefined,
    createChart: function() {
      throw new Error('Base chart type can\'t be instantiated!');
    },
    update: update,
    detach: detach,
    on: on,
    off: off,
    version: Chartist.version,
    supportsForeignObject: false
  });

}(this, Chartist));
;/**
 * Chartist SVG module for simple SVG DOM abstraction
 *
 * @module Chartist.Svg
 */
/* global Chartist */
(function(globalRoot, Chartist) {
  'use strict';

  var document = globalRoot.document;

  /**
   * Chartist.Svg creates a new SVG object wrapper with a starting element. You can use the wrapper to fluently create sub-elements and modify them.
   *
   * @memberof Chartist.Svg
   * @constructor
   * @param {String|Element} name The name of the SVG element to create or an SVG dom element which should be wrapped into Chartist.Svg
   * @param {Object} attributes An object with properties that will be added as attributes to the SVG element that is created. Attributes with undefined values will not be added.
   * @param {String} className This class or class list will be added to the SVG element
   * @param {Object} parent The parent SVG wrapper object where this newly created wrapper and it's element will be attached to as child
   * @param {Boolean} insertFirst If this param is set to true in conjunction with a parent element the newly created element will be added as first child element in the parent element
   */
  function Svg(name, attributes, className, parent, insertFirst) {
    // If Svg is getting called with an SVG element we just return the wrapper
    if(name instanceof Element) {
      this._node = name;
    } else {
      this._node = document.createElementNS(Chartist.namespaces.svg, name);

      // If this is an SVG element created then custom namespace
      if(name === 'svg') {
        this.attr({
          'xmlns:ct': Chartist.namespaces.ct
        });
      }
    }

    if(attributes) {
      this.attr(attributes);
    }

    if(className) {
      this.addClass(className);
    }

    if(parent) {
      if (insertFirst && parent._node.firstChild) {
        parent._node.insertBefore(this._node, parent._node.firstChild);
      } else {
        parent._node.appendChild(this._node);
      }
    }
  }

  /**
   * Set attributes on the current SVG element of the wrapper you're currently working on.
   *
   * @memberof Chartist.Svg
   * @param {Object|String} attributes An object with properties that will be added as attributes to the SVG element that is created. Attributes with undefined values will not be added. If this parameter is a String then the function is used as a getter and will return the attribute value.
   * @param {String} [ns] If specified, the attribute will be obtained using getAttributeNs. In order to write namepsaced attributes you can use the namespace:attribute notation within the attributes object.
   * @return {Object|String} The current wrapper object will be returned so it can be used for chaining or the attribute value if used as getter function.
   */
  function attr(attributes, ns) {
    if(typeof attributes === 'string') {
      if(ns) {
        return this._node.getAttributeNS(ns, attributes);
      } else {
        return this._node.getAttribute(attributes);
      }
    }

    Object.keys(attributes).forEach(function(key) {
      // If the attribute value is undefined we can skip this one
      if(attributes[key] === undefined) {
        return;
      }

      if (key.indexOf(':') !== -1) {
        var namespacedAttribute = key.split(':');
        this._node.setAttributeNS(Chartist.namespaces[namespacedAttribute[0]], key, attributes[key]);
      } else {
        this._node.setAttribute(key, attributes[key]);
      }
    }.bind(this));

    return this;
  }

  /**
   * Create a new SVG element whose wrapper object will be selected for further operations. This way you can also create nested groups easily.
   *
   * @memberof Chartist.Svg
   * @param {String} name The name of the SVG element that should be created as child element of the currently selected element wrapper
   * @param {Object} [attributes] An object with properties that will be added as attributes to the SVG element that is created. Attributes with undefined values will not be added.
   * @param {String} [className] This class or class list will be added to the SVG element
   * @param {Boolean} [insertFirst] If this param is set to true in conjunction with a parent element the newly created element will be added as first child element in the parent element
   * @return {Chartist.Svg} Returns a Chartist.Svg wrapper object that can be used to modify the containing SVG data
   */
  function elem(name, attributes, className, insertFirst) {
    return new Chartist.Svg(name, attributes, className, this, insertFirst);
  }

  /**
   * Returns the parent Chartist.SVG wrapper object
   *
   * @memberof Chartist.Svg
   * @return {Chartist.Svg} Returns a Chartist.Svg wrapper around the parent node of the current node. If the parent node is not existing or it's not an SVG node then this function will return null.
   */
  function parent() {
    return this._node.parentNode instanceof SVGElement ? new Chartist.Svg(this._node.parentNode) : null;
  }

  /**
   * This method returns a Chartist.Svg wrapper around the root SVG element of the current tree.
   *
   * @memberof Chartist.Svg
   * @return {Chartist.Svg} The root SVG element wrapped in a Chartist.Svg element
   */
  function root() {
    var node = this._node;
    while(node.nodeName !== 'svg') {
      node = node.parentNode;
    }
    return new Chartist.Svg(node);
  }

  /**
   * Find the first child SVG element of the current element that matches a CSS selector. The returned object is a Chartist.Svg wrapper.
   *
   * @memberof Chartist.Svg
   * @param {String} selector A CSS selector that is used to query for child SVG elements
   * @return {Chartist.Svg} The SVG wrapper for the element found or null if no element was found
   */
  function querySelector(selector) {
    var foundNode = this._node.querySelector(selector);
    return foundNode ? new Chartist.Svg(foundNode) : null;
  }

  /**
   * Find the all child SVG elements of the current element that match a CSS selector. The returned object is a Chartist.Svg.List wrapper.
   *
   * @memberof Chartist.Svg
   * @param {String} selector A CSS selector that is used to query for child SVG elements
   * @return {Chartist.Svg.List} The SVG wrapper list for the element found or null if no element was found
   */
  function querySelectorAll(selector) {
    var foundNodes = this._node.querySelectorAll(selector);
    return foundNodes.length ? new Chartist.Svg.List(foundNodes) : null;
  }

  /**
   * Returns the underlying SVG node for the current element.
   *
   * @memberof Chartist.Svg
   * @returns {Node}
   */
  function getNode() {
    return this._node;
  }

  /**
   * This method creates a foreignObject (see https://developer.mozilla.org/en-US/docs/Web/SVG/Element/foreignObject) that allows to embed HTML content into a SVG graphic. With the help of foreignObjects you can enable the usage of regular HTML elements inside of SVG where they are subject for SVG positioning and transformation but the Browser will use the HTML rendering capabilities for the containing DOM.
   *
   * @memberof Chartist.Svg
   * @param {Node|String} content The DOM Node, or HTML string that will be converted to a DOM Node, that is then placed into and wrapped by the foreignObject
   * @param {String} [attributes] An object with properties that will be added as attributes to the foreignObject element that is created. Attributes with undefined values will not be added.
   * @param {String} [className] This class or class list will be added to the SVG element
   * @param {Boolean} [insertFirst] Specifies if the foreignObject should be inserted as first child
   * @return {Chartist.Svg} New wrapper object that wraps the foreignObject element
   */
  function foreignObject(content, attributes, className, insertFirst) {
    // If content is string then we convert it to DOM
    // TODO: Handle case where content is not a string nor a DOM Node
    if(typeof content === 'string') {
      var container = document.createElement('div');
      container.innerHTML = content;
      content = container.firstChild;
    }

    // Adding namespace to content element
    content.setAttribute('xmlns', Chartist.namespaces.xmlns);

    // Creating the foreignObject without required extension attribute (as described here
    // http://www.w3.org/TR/SVG/extend.html#ForeignObjectElement)
    var fnObj = this.elem('foreignObject', attributes, className, insertFirst);

    // Add content to foreignObjectElement
    fnObj._node.appendChild(content);

    return fnObj;
  }

  /**
   * This method adds a new text element to the current Chartist.Svg wrapper.
   *
   * @memberof Chartist.Svg
   * @param {String} t The text that should be added to the text element that is created
   * @return {Chartist.Svg} The same wrapper object that was used to add the newly created element
   */
  function text(t) {
    this._node.appendChild(document.createTextNode(t));
    return this;
  }

  /**
   * This method will clear all child nodes of the current wrapper object.
   *
   * @memberof Chartist.Svg
   * @return {Chartist.Svg} The same wrapper object that got emptied
   */
  function empty() {
    while (this._node.firstChild) {
      this._node.removeChild(this._node.firstChild);
    }

    return this;
  }

  /**
   * This method will cause the current wrapper to remove itself from its parent wrapper. Use this method if you'd like to get rid of an element in a given DOM structure.
   *
   * @memberof Chartist.Svg
   * @return {Chartist.Svg} The parent wrapper object of the element that got removed
   */
  function remove() {
    this._node.parentNode.removeChild(this._node);
    return this.parent();
  }

  /**
   * This method will replace the element with a new element that can be created outside of the current DOM.
   *
   * @memberof Chartist.Svg
   * @param {Chartist.Svg} newElement The new Chartist.Svg object that will be used to replace the current wrapper object
   * @return {Chartist.Svg} The wrapper of the new element
   */
  function replace(newElement) {
    this._node.parentNode.replaceChild(newElement._node, this._node);
    return newElement;
  }

  /**
   * This method will append an element to the current element as a child.
   *
   * @memberof Chartist.Svg
   * @param {Chartist.Svg} element The Chartist.Svg element that should be added as a child
   * @param {Boolean} [insertFirst] Specifies if the element should be inserted as first child
   * @return {Chartist.Svg} The wrapper of the appended object
   */
  function append(element, insertFirst) {
    if(insertFirst && this._node.firstChild) {
      this._node.insertBefore(element._node, this._node.firstChild);
    } else {
      this._node.appendChild(element._node);
    }

    return this;
  }

  /**
   * Returns an array of class names that are attached to the current wrapper element. This method can not be chained further.
   *
   * @memberof Chartist.Svg
   * @return {Array} A list of classes or an empty array if there are no classes on the current element
   */
  function classes() {
    return this._node.getAttribute('class') ? this._node.getAttribute('class').trim().split(/\s+/) : [];
  }

  /**
   * Adds one or a space separated list of classes to the current element and ensures the classes are only existing once.
   *
   * @memberof Chartist.Svg
   * @param {String} names A white space separated list of class names
   * @return {Chartist.Svg} The wrapper of the current element
   */
  function addClass(names) {
    this._node.setAttribute('class',
      this.classes(this._node)
        .concat(names.trim().split(/\s+/))
        .filter(function(elem, pos, self) {
          return self.indexOf(elem) === pos;
        }).join(' ')
    );

    return this;
  }

  /**
   * Removes one or a space separated list of classes from the current element.
   *
   * @memberof Chartist.Svg
   * @param {String} names A white space separated list of class names
   * @return {Chartist.Svg} The wrapper of the current element
   */
  function removeClass(names) {
    var removedClasses = names.trim().split(/\s+/);

    this._node.setAttribute('class', this.classes(this._node).filter(function(name) {
      return removedClasses.indexOf(name) === -1;
    }).join(' '));

    return this;
  }

  /**
   * Removes all classes from the current element.
   *
   * @memberof Chartist.Svg
   * @return {Chartist.Svg} The wrapper of the current element
   */
  function removeAllClasses() {
    this._node.setAttribute('class', '');

    return this;
  }

  /**
   * Get element height using `getBoundingClientRect`
   *
   * @memberof Chartist.Svg
   * @return {Number} The elements height in pixels
   */
  function height() {
    return this._node.getBoundingClientRect().height;
  }

  /**
   * Get element width using `getBoundingClientRect`
   *
   * @memberof Chartist.Core
   * @return {Number} The elements width in pixels
   */
  function width() {
    return this._node.getBoundingClientRect().width;
  }

  /**
   * The animate function lets you animate the current element with SMIL animations. You can add animations for multiple attributes at the same time by using an animation definition object. This object should contain SMIL animation attributes. Please refer to http://www.w3.org/TR/SVG/animate.html for a detailed specification about the available animation attributes. Additionally an easing property can be passed in the animation definition object. This can be a string with a name of an easing function in `Chartist.Svg.Easing` or an array with four numbers specifying a cubic Bézier curve.
   * **An animations object could look like this:**
   * ```javascript
   * element.animate({
   *   opacity: {
   *     dur: 1000,
   *     from: 0,
   *     to: 1
   *   },
   *   x1: {
   *     dur: '1000ms',
   *     from: 100,
   *     to: 200,
   *     easing: 'easeOutQuart'
   *   },
   *   y1: {
   *     dur: '2s',
   *     from: 0,
   *     to: 100
   *   }
   * });
   * ```
   * **Automatic unit conversion**
   * For the `dur` and the `begin` animate attribute you can also omit a unit by passing a number. The number will automatically be converted to milli seconds.
   * **Guided mode**
   * The default behavior of SMIL animations with offset using the `begin` attribute is that the attribute will keep it's original value until the animation starts. Mostly this behavior is not desired as you'd like to have your element attributes already initialized with the animation `from` value even before the animation starts. Also if you don't specify `fill="freeze"` on an animate element or if you delete the animation after it's done (which is done in guided mode) the attribute will switch back to the initial value. This behavior is also not desired when performing simple one-time animations. For one-time animations you'd want to trigger animations immediately instead of relative to the document begin time. That's why in guided mode Chartist.Svg will also use the `begin` property to schedule a timeout and manually start the animation after the timeout. If you're using multiple SMIL definition objects for an attribute (in an array), guided mode will be disabled for this attribute, even if you explicitly enabled it.
   * If guided mode is enabled the following behavior is added:
   * - Before the animation starts (even when delayed with `begin`) the animated attribute will be set already to the `from` value of the animation
   * - `begin` is explicitly set to `indefinite` so it can be started manually without relying on document begin time (creation)
   * - The animate element will be forced to use `fill="freeze"`
   * - The animation will be triggered with `beginElement()` in a timeout where `begin` of the definition object is interpreted in milli seconds. If no `begin` was specified the timeout is triggered immediately.
   * - After the animation the element attribute value will be set to the `to` value of the animation
   * - The animate element is deleted from the DOM
   *
   * @memberof Chartist.Svg
   * @param {Object} animations An animations object where the property keys are the attributes you'd like to animate. The properties should be objects again that contain the SMIL animation attributes (usually begin, dur, from, and to). The property begin and dur is auto converted (see Automatic unit conversion). You can also schedule multiple animations for the same attribute by passing an Array of SMIL definition objects. Attributes that contain an array of SMIL definition objects will not be executed in guided mode.
   * @param {Boolean} guided Specify if guided mode should be activated for this animation (see Guided mode). If not otherwise specified, guided mode will be activated.
   * @param {Object} eventEmitter If specified, this event emitter will be notified when an animation starts or ends.
   * @return {Chartist.Svg} The current element where the animation was added
   */
  function animate(animations, guided, eventEmitter) {
    if(guided === undefined) {
      guided = true;
    }

    Object.keys(animations).forEach(function createAnimateForAttributes(attribute) {

      function createAnimate(animationDefinition, guided) {
        var attributeProperties = {},
          animate,
          timeout,
          easing;

        // Check if an easing is specified in the definition object and delete it from the object as it will not
        // be part of the animate element attributes.
        if(animationDefinition.easing) {
          // If already an easing Bézier curve array we take it or we lookup a easing array in the Easing object
          easing = animationDefinition.easing instanceof Array ?
            animationDefinition.easing :
            Chartist.Svg.Easing[animationDefinition.easing];
          delete animationDefinition.easing;
        }

        // If numeric dur or begin was provided we assume milli seconds
        animationDefinition.begin = Chartist.ensureUnit(animationDefinition.begin, 'ms');
        animationDefinition.dur = Chartist.ensureUnit(animationDefinition.dur, 'ms');

        if(easing) {
          animationDefinition.calcMode = 'spline';
          animationDefinition.keySplines = easing.join(' ');
          animationDefinition.keyTimes = '0;1';
        }

        // Adding "fill: freeze" if we are in guided mode and set initial attribute values
        if(guided) {
          animationDefinition.fill = 'freeze';
          // Animated property on our element should already be set to the animation from value in guided mode
          attributeProperties[attribute] = animationDefinition.from;
          this.attr(attributeProperties);

          // In guided mode we also set begin to indefinite so we can trigger the start manually and put the begin
          // which needs to be in ms aside
          timeout = Chartist.quantity(animationDefinition.begin || 0).value;
          animationDefinition.begin = 'indefinite';
        }

        animate = this.elem('animate', Chartist.extend({
          attributeName: attribute
        }, animationDefinition));

        if(guided) {
          // If guided we take the value that was put aside in timeout and trigger the animation manually with a timeout
          setTimeout(function() {
            // If beginElement fails we set the animated attribute to the end position and remove the animate element
            // This happens if the SMIL ElementTimeControl interface is not supported or any other problems occured in
            // the browser. (Currently FF 34 does not support animate elements in foreignObjects)
            try {
              animate._node.beginElement();
            } catch(err) {
              // Set animated attribute to current animated value
              attributeProperties[attribute] = animationDefinition.to;
              this.attr(attributeProperties);
              // Remove the animate element as it's no longer required
              animate.remove();
            }
          }.bind(this), timeout);
        }

        if(eventEmitter) {
          animate._node.addEventListener('beginEvent', function handleBeginEvent() {
            eventEmitter.emit('animationBegin', {
              element: this,
              animate: animate._node,
              params: animationDefinition
            });
          }.bind(this));
        }

        animate._node.addEventListener('endEvent', function handleEndEvent() {
          if(eventEmitter) {
            eventEmitter.emit('animationEnd', {
              element: this,
              animate: animate._node,
              params: animationDefinition
            });
          }

          if(guided) {
            // Set animated attribute to current animated value
            attributeProperties[attribute] = animationDefinition.to;
            this.attr(attributeProperties);
            // Remove the animate element as it's no longer required
            animate.remove();
          }
        }.bind(this));
      }

      // If current attribute is an array of definition objects we create an animate for each and disable guided mode
      if(animations[attribute] instanceof Array) {
        animations[attribute].forEach(function(animationDefinition) {
          createAnimate.bind(this)(animationDefinition, false);
        }.bind(this));
      } else {
        createAnimate.bind(this)(animations[attribute], guided);
      }

    }.bind(this));

    return this;
  }

  Chartist.Svg = Chartist.Class.extend({
    constructor: Svg,
    attr: attr,
    elem: elem,
    parent: parent,
    root: root,
    querySelector: querySelector,
    querySelectorAll: querySelectorAll,
    getNode: getNode,
    foreignObject: foreignObject,
    text: text,
    empty: empty,
    remove: remove,
    replace: replace,
    append: append,
    classes: classes,
    addClass: addClass,
    removeClass: removeClass,
    removeAllClasses: removeAllClasses,
    height: height,
    width: width,
    animate: animate
  });

  /**
   * This method checks for support of a given SVG feature like Extensibility, SVG-animation or the like. Check http://www.w3.org/TR/SVG11/feature for a detailed list.
   *
   * @memberof Chartist.Svg
   * @param {String} feature The SVG 1.1 feature that should be checked for support.
   * @return {Boolean} True of false if the feature is supported or not
   */
  Chartist.Svg.isSupported = function(feature) {
    return document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#' + feature, '1.1');
  };

  /**
   * This Object contains some standard easing cubic bezier curves. Then can be used with their name in the `Chartist.Svg.animate`. You can also extend the list and use your own name in the `animate` function. Click the show code button to see the available bezier functions.
   *
   * @memberof Chartist.Svg
   */
  var easingCubicBeziers = {
    easeInSine: [0.47, 0, 0.745, 0.715],
    easeOutSine: [0.39, 0.575, 0.565, 1],
    easeInOutSine: [0.445, 0.05, 0.55, 0.95],
    easeInQuad: [0.55, 0.085, 0.68, 0.53],
    easeOutQuad: [0.25, 0.46, 0.45, 0.94],
    easeInOutQuad: [0.455, 0.03, 0.515, 0.955],
    easeInCubic: [0.55, 0.055, 0.675, 0.19],
    easeOutCubic: [0.215, 0.61, 0.355, 1],
    easeInOutCubic: [0.645, 0.045, 0.355, 1],
    easeInQuart: [0.895, 0.03, 0.685, 0.22],
    easeOutQuart: [0.165, 0.84, 0.44, 1],
    easeInOutQuart: [0.77, 0, 0.175, 1],
    easeInQuint: [0.755, 0.05, 0.855, 0.06],
    easeOutQuint: [0.23, 1, 0.32, 1],
    easeInOutQuint: [0.86, 0, 0.07, 1],
    easeInExpo: [0.95, 0.05, 0.795, 0.035],
    easeOutExpo: [0.19, 1, 0.22, 1],
    easeInOutExpo: [1, 0, 0, 1],
    easeInCirc: [0.6, 0.04, 0.98, 0.335],
    easeOutCirc: [0.075, 0.82, 0.165, 1],
    easeInOutCirc: [0.785, 0.135, 0.15, 0.86],
    easeInBack: [0.6, -0.28, 0.735, 0.045],
    easeOutBack: [0.175, 0.885, 0.32, 1.275],
    easeInOutBack: [0.68, -0.55, 0.265, 1.55]
  };

  Chartist.Svg.Easing = easingCubicBeziers;

  /**
   * This helper class is to wrap multiple `Chartist.Svg` elements into a list where you can call the `Chartist.Svg` functions on all elements in the list with one call. This is helpful when you'd like to perform calls with `Chartist.Svg` on multiple elements.
   * An instance of this class is also returned by `Chartist.Svg.querySelectorAll`.
   *
   * @memberof Chartist.Svg
   * @param {Array<Node>|NodeList} nodeList An Array of SVG DOM nodes or a SVG DOM NodeList (as returned by document.querySelectorAll)
   * @constructor
   */
  function SvgList(nodeList) {
    var list = this;

    this.svgElements = [];
    for(var i = 0; i < nodeList.length; i++) {
      this.svgElements.push(new Chartist.Svg(nodeList[i]));
    }

    // Add delegation methods for Chartist.Svg
    Object.keys(Chartist.Svg.prototype).filter(function(prototypeProperty) {
      return ['constructor',
          'parent',
          'querySelector',
          'querySelectorAll',
          'replace',
          'append',
          'classes',
          'height',
          'width'].indexOf(prototypeProperty) === -1;
    }).forEach(function(prototypeProperty) {
      list[prototypeProperty] = function() {
        var args = Array.prototype.slice.call(arguments, 0);
        list.svgElements.forEach(function(element) {
          Chartist.Svg.prototype[prototypeProperty].apply(element, args);
        });
        return list;
      };
    });
  }

  Chartist.Svg.List = Chartist.Class.extend({
    constructor: SvgList
  });
}(this, Chartist));
;/**
 * Chartist SVG path module for SVG path description creation and modification.
 *
 * @module Chartist.Svg.Path
 */
/* global Chartist */
(function(globalRoot, Chartist) {
  'use strict';

  /**
   * Contains the descriptors of supported element types in a SVG path. Currently only move, line and curve are supported.
   *
   * @memberof Chartist.Svg.Path
   * @type {Object}
   */
  var elementDescriptions = {
    m: ['x', 'y'],
    l: ['x', 'y'],
    c: ['x1', 'y1', 'x2', 'y2', 'x', 'y'],
    a: ['rx', 'ry', 'xAr', 'lAf', 'sf', 'x', 'y']
  };

  /**
   * Default options for newly created SVG path objects.
   *
   * @memberof Chartist.Svg.Path
   * @type {Object}
   */
  var defaultOptions = {
    // The accuracy in digit count after the decimal point. This will be used to round numbers in the SVG path. If this option is set to false then no rounding will be performed.
    accuracy: 3
  };

  function element(command, params, pathElements, pos, relative, data) {
    var pathElement = Chartist.extend({
      command: relative ? command.toLowerCase() : command.toUpperCase()
    }, params, data ? { data: data } : {} );

    pathElements.splice(pos, 0, pathElement);
  }

  function forEachParam(pathElements, cb) {
    pathElements.forEach(function(pathElement, pathElementIndex) {
      elementDescriptions[pathElement.command.toLowerCase()].forEach(function(paramName, paramIndex) {
        cb(pathElement, paramName, pathElementIndex, paramIndex, pathElements);
      });
    });
  }

  /**
   * Used to construct a new path object.
   *
   * @memberof Chartist.Svg.Path
   * @param {Boolean} close If set to true then this path will be closed when stringified (with a Z at the end)
   * @param {Object} options Options object that overrides the default objects. See default options for more details.
   * @constructor
   */
  function SvgPath(close, options) {
    this.pathElements = [];
    this.pos = 0;
    this.close = close;
    this.options = Chartist.extend({}, defaultOptions, options);
  }

  /**
   * Gets or sets the current position (cursor) inside of the path. You can move around the cursor freely but limited to 0 or the count of existing elements. All modifications with element functions will insert new elements at the position of this cursor.
   *
   * @memberof Chartist.Svg.Path
   * @param {Number} [pos] If a number is passed then the cursor is set to this position in the path element array.
   * @return {Chartist.Svg.Path|Number} If the position parameter was passed then the return value will be the path object for easy call chaining. If no position parameter was passed then the current position is returned.
   */
  function position(pos) {
    if(pos !== undefined) {
      this.pos = Math.max(0, Math.min(this.pathElements.length, pos));
      return this;
    } else {
      return this.pos;
    }
  }

  /**
   * Removes elements from the path starting at the current position.
   *
   * @memberof Chartist.Svg.Path
   * @param {Number} count Number of path elements that should be removed from the current position.
   * @return {Chartist.Svg.Path} The current path object for easy call chaining.
   */
  function remove(count) {
    this.pathElements.splice(this.pos, count);
    return this;
  }

  /**
   * Use this function to add a new move SVG path element.
   *
   * @memberof Chartist.Svg.Path
   * @param {Number} x The x coordinate for the move element.
   * @param {Number} y The y coordinate for the move element.
   * @param {Boolean} [relative] If set to true the move element will be created with relative coordinates (lowercase letter)
   * @param {*} [data] Any data that should be stored with the element object that will be accessible in pathElement
   * @return {Chartist.Svg.Path} The current path object for easy call chaining.
   */
  function move(x, y, relative, data) {
    element('M', {
      x: +x,
      y: +y
    }, this.pathElements, this.pos++, relative, data);
    return this;
  }

  /**
   * Use this function to add a new line SVG path element.
   *
   * @memberof Chartist.Svg.Path
   * @param {Number} x The x coordinate for the line element.
   * @param {Number} y The y coordinate for the line element.
   * @param {Boolean} [relative] If set to true the line element will be created with relative coordinates (lowercase letter)
   * @param {*} [data] Any data that should be stored with the element object that will be accessible in pathElement
   * @return {Chartist.Svg.Path} The current path object for easy call chaining.
   */
  function line(x, y, relative, data) {
    element('L', {
      x: +x,
      y: +y
    }, this.pathElements, this.pos++, relative, data);
    return this;
  }

  /**
   * Use this function to add a new curve SVG path element.
   *
   * @memberof Chartist.Svg.Path
   * @param {Number} x1 The x coordinate for the first control point of the bezier curve.
   * @param {Number} y1 The y coordinate for the first control point of the bezier curve.
   * @param {Number} x2 The x coordinate for the second control point of the bezier curve.
   * @param {Number} y2 The y coordinate for the second control point of the bezier curve.
   * @param {Number} x The x coordinate for the target point of the curve element.
   * @param {Number} y The y coordinate for the target point of the curve element.
   * @param {Boolean} [relative] If set to true the curve element will be created with relative coordinates (lowercase letter)
   * @param {*} [data] Any data that should be stored with the element object that will be accessible in pathElement
   * @return {Chartist.Svg.Path} The current path object for easy call chaining.
   */
  function curve(x1, y1, x2, y2, x, y, relative, data) {
    element('C', {
      x1: +x1,
      y1: +y1,
      x2: +x2,
      y2: +y2,
      x: +x,
      y: +y
    }, this.pathElements, this.pos++, relative, data);
    return this;
  }

  /**
   * Use this function to add a new non-bezier curve SVG path element.
   *
   * @memberof Chartist.Svg.Path
   * @param {Number} rx The radius to be used for the x-axis of the arc.
   * @param {Number} ry The radius to be used for the y-axis of the arc.
   * @param {Number} xAr Defines the orientation of the arc
   * @param {Number} lAf Large arc flag
   * @param {Number} sf Sweep flag
   * @param {Number} x The x coordinate for the target point of the curve element.
   * @param {Number} y The y coordinate for the target point of the curve element.
   * @param {Boolean} [relative] If set to true the curve element will be created with relative coordinates (lowercase letter)
   * @param {*} [data] Any data that should be stored with the element object that will be accessible in pathElement
   * @return {Chartist.Svg.Path} The current path object for easy call chaining.
   */
  function arc(rx, ry, xAr, lAf, sf, x, y, relative, data) {
    element('A', {
      rx: +rx,
      ry: +ry,
      xAr: +xAr,
      lAf: +lAf,
      sf: +sf,
      x: +x,
      y: +y
    }, this.pathElements, this.pos++, relative, data);
    return this;
  }

  /**
   * Parses an SVG path seen in the d attribute of path elements, and inserts the parsed elements into the existing path object at the current cursor position. Any closing path indicators (Z at the end of the path) will be ignored by the parser as this is provided by the close option in the options of the path object.
   *
   * @memberof Chartist.Svg.Path
   * @param {String} path Any SVG path that contains move (m), line (l) or curve (c) components.
   * @return {Chartist.Svg.Path} The current path object for easy call chaining.
   */
  function parse(path) {
    // Parsing the SVG path string into an array of arrays [['M', '10', '10'], ['L', '100', '100']]
    var chunks = path.replace(/([A-Za-z])([0-9])/g, '$1 $2')
      .replace(/([0-9])([A-Za-z])/g, '$1 $2')
      .split(/[\s,]+/)
      .reduce(function(result, element) {
        if(element.match(/[A-Za-z]/)) {
          result.push([]);
        }

        result[result.length - 1].push(element);
        return result;
      }, []);

    // If this is a closed path we remove the Z at the end because this is determined by the close option
    if(chunks[chunks.length - 1][0].toUpperCase() === 'Z') {
      chunks.pop();
    }

    // Using svgPathElementDescriptions to map raw path arrays into objects that contain the command and the parameters
    // For example {command: 'M', x: '10', y: '10'}
    var elements = chunks.map(function(chunk) {
        var command = chunk.shift(),
          description = elementDescriptions[command.toLowerCase()];

        return Chartist.extend({
          command: command
        }, description.reduce(function(result, paramName, index) {
          result[paramName] = +chunk[index];
          return result;
        }, {}));
      });

    // Preparing a splice call with the elements array as var arg params and insert the parsed elements at the current position
    var spliceArgs = [this.pos, 0];
    Array.prototype.push.apply(spliceArgs, elements);
    Array.prototype.splice.apply(this.pathElements, spliceArgs);
    // Increase the internal position by the element count
    this.pos += elements.length;

    return this;
  }

  /**
   * This function renders to current SVG path object into a final SVG string that can be used in the d attribute of SVG path elements. It uses the accuracy option to round big decimals. If the close parameter was set in the constructor of this path object then a path closing Z will be appended to the output string.
   *
   * @memberof Chartist.Svg.Path
   * @return {String}
   */
  function stringify() {
    var accuracyMultiplier = Math.pow(10, this.options.accuracy);

    return this.pathElements.reduce(function(path, pathElement) {
        var params = elementDescriptions[pathElement.command.toLowerCase()].map(function(paramName) {
          return this.options.accuracy ?
            (Math.round(pathElement[paramName] * accuracyMultiplier) / accuracyMultiplier) :
            pathElement[paramName];
        }.bind(this));

        return path + pathElement.command + params.join(',');
      }.bind(this), '') + (this.close ? 'Z' : '');
  }

  /**
   * Scales all elements in the current SVG path object. There is an individual parameter for each coordinate. Scaling will also be done for control points of curves, affecting the given coordinate.
   *
   * @memberof Chartist.Svg.Path
   * @param {Number} x The number which will be used to scale the x, x1 and x2 of all path elements.
   * @param {Number} y The number which will be used to scale the y, y1 and y2 of all path elements.
   * @return {Chartist.Svg.Path} The current path object for easy call chaining.
   */
  function scale(x, y) {
    forEachParam(this.pathElements, function(pathElement, paramName) {
      pathElement[paramName] *= paramName[0] === 'x' ? x : y;
    });
    return this;
  }

  /**
   * Translates all elements in the current SVG path object. The translation is relative and there is an individual parameter for each coordinate. Translation will also be done for control points of curves, affecting the given coordinate.
   *
   * @memberof Chartist.Svg.Path
   * @param {Number} x The number which will be used to translate the x, x1 and x2 of all path elements.
   * @param {Number} y The number which will be used to translate the y, y1 and y2 of all path elements.
   * @return {Chartist.Svg.Path} The current path object for easy call chaining.
   */
  function translate(x, y) {
    forEachParam(this.pathElements, function(pathElement, paramName) {
      pathElement[paramName] += paramName[0] === 'x' ? x : y;
    });
    return this;
  }

  /**
   * This function will run over all existing path elements and then loop over their attributes. The callback function will be called for every path element attribute that exists in the current path.
   * The method signature of the callback function looks like this:
   * ```javascript
   * function(pathElement, paramName, pathElementIndex, paramIndex, pathElements)
   * ```
   * If something else than undefined is returned by the callback function, this value will be used to replace the old value. This allows you to build custom transformations of path objects that can't be achieved using the basic transformation functions scale and translate.
   *
   * @memberof Chartist.Svg.Path
   * @param {Function} transformFnc The callback function for the transformation. Check the signature in the function description.
   * @return {Chartist.Svg.Path} The current path object for easy call chaining.
   */
  function transform(transformFnc) {
    forEachParam(this.pathElements, function(pathElement, paramName, pathElementIndex, paramIndex, pathElements) {
      var transformed = transformFnc(pathElement, paramName, pathElementIndex, paramIndex, pathElements);
      if(transformed || transformed === 0) {
        pathElement[paramName] = transformed;
      }
    });
    return this;
  }

  /**
   * This function clones a whole path object with all its properties. This is a deep clone and path element objects will also be cloned.
   *
   * @memberof Chartist.Svg.Path
   * @param {Boolean} [close] Optional option to set the new cloned path to closed. If not specified or false, the original path close option will be used.
   * @return {Chartist.Svg.Path}
   */
  function clone(close) {
    var c = new Chartist.Svg.Path(close || this.close);
    c.pos = this.pos;
    c.pathElements = this.pathElements.slice().map(function cloneElements(pathElement) {
      return Chartist.extend({}, pathElement);
    });
    c.options = Chartist.extend({}, this.options);
    return c;
  }

  /**
   * Split a Svg.Path object by a specific command in the path chain. The path chain will be split and an array of newly created paths objects will be returned. This is useful if you'd like to split an SVG path by it's move commands, for example, in order to isolate chunks of drawings.
   *
   * @memberof Chartist.Svg.Path
   * @param {String} command The command you'd like to use to split the path
   * @return {Array<Chartist.Svg.Path>}
   */
  function splitByCommand(command) {
    var split = [
      new Chartist.Svg.Path()
    ];

    this.pathElements.forEach(function(pathElement) {
      if(pathElement.command === command.toUpperCase() && split[split.length - 1].pathElements.length !== 0) {
        split.push(new Chartist.Svg.Path());
      }

      split[split.length - 1].pathElements.push(pathElement);
    });

    return split;
  }

  /**
   * This static function on `Chartist.Svg.Path` is joining multiple paths together into one paths.
   *
   * @memberof Chartist.Svg.Path
   * @param {Array<Chartist.Svg.Path>} paths A list of paths to be joined together. The order is important.
   * @param {boolean} close If the newly created path should be a closed path
   * @param {Object} options Path options for the newly created path.
   * @return {Chartist.Svg.Path}
   */

  function join(paths, close, options) {
    var joinedPath = new Chartist.Svg.Path(close, options);
    for(var i = 0; i < paths.length; i++) {
      var path = paths[i];
      for(var j = 0; j < path.pathElements.length; j++) {
        joinedPath.pathElements.push(path.pathElements[j]);
      }
    }
    return joinedPath;
  }

  Chartist.Svg.Path = Chartist.Class.extend({
    constructor: SvgPath,
    position: position,
    remove: remove,
    move: move,
    line: line,
    curve: curve,
    arc: arc,
    scale: scale,
    translate: translate,
    transform: transform,
    parse: parse,
    stringify: stringify,
    clone: clone,
    splitByCommand: splitByCommand
  });

  Chartist.Svg.Path.elementDescriptions = elementDescriptions;
  Chartist.Svg.Path.join = join;
}(this, Chartist));
;/* global Chartist */
(function (globalRoot, Chartist) {
  'use strict';

  var window = globalRoot.window;
  var document = globalRoot.document;

  var axisUnits = {
    x: {
      pos: 'x',
      len: 'width',
      dir: 'horizontal',
      rectStart: 'x1',
      rectEnd: 'x2',
      rectOffset: 'y2'
    },
    y: {
      pos: 'y',
      len: 'height',
      dir: 'vertical',
      rectStart: 'y2',
      rectEnd: 'y1',
      rectOffset: 'x1'
    }
  };

  function Axis(units, chartRect, ticks, options) {
    this.units = units;
    this.counterUnits = units === axisUnits.x ? axisUnits.y : axisUnits.x;
    this.chartRect = chartRect;
    this.axisLength = chartRect[units.rectEnd] - chartRect[units.rectStart];
    this.gridOffset = chartRect[units.rectOffset];
    this.ticks = ticks;
    this.options = options;
  }

  function createGridAndLabels(gridGroup, labelGroup, useForeignObject, chartOptions, eventEmitter) {
    var axisOptions = chartOptions['axis' + this.units.pos.toUpperCase()];
    var projectedValues = this.ticks.map(this.projectValue.bind(this));
    var labelValues = this.ticks.map(axisOptions.labelInterpolationFnc);

    projectedValues.forEach(function(projectedValue, index) {
      var labelOffset = {
        x: 0,
        y: 0
      };

      // TODO: Find better solution for solving this problem
      // Calculate how much space we have available for the label
      var labelLength;
      if(projectedValues[index + 1]) {
        // If we still have one label ahead, we can calculate the distance to the next tick / label
        labelLength = projectedValues[index + 1] - projectedValue;
      } else {
        // If we don't have a label ahead and we have only two labels in total, we just take the remaining distance to
        // on the whole axis length. We limit that to a minimum of 30 pixel, so that labels close to the border will
        // still be visible inside of the chart padding.
        labelLength = Math.max(this.axisLength - projectedValue, 30);
      }

      // Skip grid lines and labels where interpolated label values are falsey (execpt for 0)
      if(Chartist.isFalseyButZero(labelValues[index]) && labelValues[index] !== '') {
        return;
      }

      // Transform to global coordinates using the chartRect
      // We also need to set the label offset for the createLabel function
      if(this.units.pos === 'x') {
        projectedValue = this.chartRect.x1 + projectedValue;
        labelOffset.x = chartOptions.axisX.labelOffset.x;

        // If the labels should be positioned in start position (top side for vertical axis) we need to set a
        // different offset as for positioned with end (bottom)
        if(chartOptions.axisX.position === 'start') {
          labelOffset.y = this.chartRect.padding.top + chartOptions.axisX.labelOffset.y + (useForeignObject ? 5 : 20);
        } else {
          labelOffset.y = this.chartRect.y1 + chartOptions.axisX.labelOffset.y + (useForeignObject ? 5 : 20);
        }
      } else {
        projectedValue = this.chartRect.y1 - projectedValue;
        labelOffset.y = chartOptions.axisY.labelOffset.y - (useForeignObject ? labelLength : 0);

        // If the labels should be positioned in start position (left side for horizontal axis) we need to set a
        // different offset as for positioned with end (right side)
        if(chartOptions.axisY.position === 'start') {
          labelOffset.x = useForeignObject ? this.chartRect.padding.left + chartOptions.axisY.labelOffset.x : this.chartRect.x1 - 10;
        } else {
          labelOffset.x = this.chartRect.x2 + chartOptions.axisY.labelOffset.x + 10;
        }
      }

      if(axisOptions.showGrid) {
        Chartist.createGrid(projectedValue, index, this, this.gridOffset, this.chartRect[this.counterUnits.len](), gridGroup, [
          chartOptions.classNames.grid,
          chartOptions.classNames[this.units.dir]
        ], eventEmitter);
      }

      if(axisOptions.showLabel) {
        Chartist.createLabel(projectedValue, labelLength, index, labelValues, this, axisOptions.offset, labelOffset, labelGroup, [
          chartOptions.classNames.label,
          chartOptions.classNames[this.units.dir],
          (axisOptions.position === 'start' ? chartOptions.classNames[axisOptions.position] : chartOptions.classNames['end'])
        ], useForeignObject, eventEmitter);
      }
    }.bind(this));
  }

  Chartist.Axis = Chartist.Class.extend({
    constructor: Axis,
    createGridAndLabels: createGridAndLabels,
    projectValue: function(value, index, data) {
      throw new Error('Base axis can\'t be instantiated!');
    }
  });

  Chartist.Axis.units = axisUnits;

}(this, Chartist));
;/**
 * The auto scale axis uses standard linear scale projection of values along an axis. It uses order of magnitude to find a scale automatically and evaluates the available space in order to find the perfect amount of ticks for your chart.
 * **Options**
 * The following options are used by this axis in addition to the default axis options outlined in the axis configuration of the chart default settings.
 * ```javascript
 * var options = {
 *   // If high is specified then the axis will display values explicitly up to this value and the computed maximum from the data is ignored
 *   high: 100,
 *   // If low is specified then the axis will display values explicitly down to this value and the computed minimum from the data is ignored
 *   low: 0,
 *   // This option will be used when finding the right scale division settings. The amount of ticks on the scale will be determined so that as many ticks as possible will be displayed, while not violating this minimum required space (in pixel).
 *   scaleMinSpace: 20,
 *   // Can be set to true or false. If set to true, the scale will be generated with whole numbers only.
 *   onlyInteger: true,
 *   // The reference value can be used to make sure that this value will always be on the chart. This is especially useful on bipolar charts where the bipolar center always needs to be part of the chart.
 *   referenceValue: 5
 * };
 * ```
 *
 * @module Chartist.AutoScaleAxis
 */
/* global Chartist */
(function (globalRoot, Chartist) {
  'use strict';

  var window = globalRoot.window;
  var document = globalRoot.document;

  function AutoScaleAxis(axisUnit, data, chartRect, options) {
    // Usually we calculate highLow based on the data but this can be overriden by a highLow object in the options
    var highLow = options.highLow || Chartist.getHighLow(data, options, axisUnit.pos);
    this.bounds = Chartist.getBounds(chartRect[axisUnit.rectEnd] - chartRect[axisUnit.rectStart], highLow, options.scaleMinSpace || 20, options.onlyInteger);
    this.range = {
      min: this.bounds.min,
      max: this.bounds.max
    };

    Chartist.AutoScaleAxis.super.constructor.call(this,
      axisUnit,
      chartRect,
      this.bounds.values,
      options);
  }

  function projectValue(value) {
    return this.axisLength * (+Chartist.getMultiValue(value, this.units.pos) - this.bounds.min) / this.bounds.range;
  }

  Chartist.AutoScaleAxis = Chartist.Axis.extend({
    constructor: AutoScaleAxis,
    projectValue: projectValue
  });

}(this, Chartist));
;/**
 * The fixed scale axis uses standard linear projection of values along an axis. It makes use of a divisor option to divide the range provided from the minimum and maximum value or the options high and low that will override the computed minimum and maximum.
 * **Options**
 * The following options are used by this axis in addition to the default axis options outlined in the axis configuration of the chart default settings.
 * ```javascript
 * var options = {
 *   // If high is specified then the axis will display values explicitly up to this value and the computed maximum from the data is ignored
 *   high: 100,
 *   // If low is specified then the axis will display values explicitly down to this value and the computed minimum from the data is ignored
 *   low: 0,
 *   // If specified then the value range determined from minimum to maximum (or low and high) will be divided by this number and ticks will be generated at those division points. The default divisor is 1.
 *   divisor: 4,
 *   // If ticks is explicitly set, then the axis will not compute the ticks with the divisor, but directly use the data in ticks to determine at what points on the axis a tick need to be generated.
 *   ticks: [1, 10, 20, 30]
 * };
 * ```
 *
 * @module Chartist.FixedScaleAxis
 */
/* global Chartist */
(function (globalRoot, Chartist) {
  'use strict';

  var window = globalRoot.window;
  var document = globalRoot.document;

  function FixedScaleAxis(axisUnit, data, chartRect, options) {
    var highLow = options.highLow || Chartist.getHighLow(data, options, axisUnit.pos);
    this.divisor = options.divisor || 1;
    this.ticks = options.ticks || Chartist.times(this.divisor).map(function(value, index) {
      return highLow.low + (highLow.high - highLow.low) / this.divisor * index;
    }.bind(this));
    this.ticks.sort(function(a, b) {
      return a - b;
    });
    this.range = {
      min: highLow.low,
      max: highLow.high
    };

    Chartist.FixedScaleAxis.super.constructor.call(this,
      axisUnit,
      chartRect,
      this.ticks,
      options);

    this.stepLength = this.axisLength / this.divisor;
  }

  function projectValue(value) {
    return this.axisLength * (+Chartist.getMultiValue(value, this.units.pos) - this.range.min) / (this.range.max - this.range.min);
  }

  Chartist.FixedScaleAxis = Chartist.Axis.extend({
    constructor: FixedScaleAxis,
    projectValue: projectValue
  });

}(this, Chartist));
;/**
 * The step axis for step based charts like bar chart or step based line charts. It uses a fixed amount of ticks that will be equally distributed across the whole axis length. The projection is done using the index of the data value rather than the value itself and therefore it's only useful for distribution purpose.
 * **Options**
 * The following options are used by this axis in addition to the default axis options outlined in the axis configuration of the chart default settings.
 * ```javascript
 * var options = {
 *   // Ticks to be used to distribute across the axis length. As this axis type relies on the index of the value rather than the value, arbitrary data that can be converted to a string can be used as ticks.
 *   ticks: ['One', 'Two', 'Three'],
 *   // If set to true the full width will be used to distribute the values where the last value will be at the maximum of the axis length. If false the spaces between the ticks will be evenly distributed instead.
 *   stretch: true
 * };
 * ```
 *
 * @module Chartist.StepAxis
 */
/* global Chartist */
(function (globalRoot, Chartist) {
  'use strict';

  var window = globalRoot.window;
  var document = globalRoot.document;

  function StepAxis(axisUnit, data, chartRect, options) {
    Chartist.StepAxis.super.constructor.call(this,
      axisUnit,
      chartRect,
      options.ticks,
      options);

    var calc = Math.max(1, options.ticks.length - (options.stretch ? 1 : 0));
    this.stepLength = this.axisLength / calc;
  }

  function projectValue(value, index) {
    return this.stepLength * index;
  }

  Chartist.StepAxis = Chartist.Axis.extend({
    constructor: StepAxis,
    projectValue: projectValue
  });

}(this, Chartist));
;/**
 * The Chartist line chart can be used to draw Line or Scatter charts. If used in the browser you can access the global `Chartist` namespace where you find the `Line` function as a main entry point.
 *
 * For examples on how to use the line chart please check the examples of the `Chartist.Line` method.
 *
 * @module Chartist.Line
 */
/* global Chartist */
(function(globalRoot, Chartist){
  'use strict';

  var window = globalRoot.window;
  var document = globalRoot.document;

  /**
   * Default options in line charts. Expand the code view to see a detailed list of options with comments.
   *
   * @memberof Chartist.Line
   */
  var defaultOptions = {
    // Options for X-Axis
    axisX: {
      // The offset of the labels to the chart area
      offset: 30,
      // Position where labels are placed. Can be set to `start` or `end` where `start` is equivalent to left or top on vertical axis and `end` is equivalent to right or bottom on horizontal axis.
      position: 'end',
      // Allows you to correct label positioning on this axis by positive or negative x and y offset.
      labelOffset: {
        x: 0,
        y: 0
      },
      // If labels should be shown or not
      showLabel: true,
      // If the axis grid should be drawn or not
      showGrid: true,
      // Interpolation function that allows you to intercept the value from the axis label
      labelInterpolationFnc: Chartist.noop,
      // Set the axis type to be used to project values on this axis. If not defined, Chartist.StepAxis will be used for the X-Axis, where the ticks option will be set to the labels in the data and the stretch option will be set to the global fullWidth option. This type can be changed to any axis constructor available (e.g. Chartist.FixedScaleAxis), where all axis options should be present here.
      type: undefined
    },
    // Options for Y-Axis
    axisY: {
      // The offset of the labels to the chart area
      offset: 40,
      // Position where labels are placed. Can be set to `start` or `end` where `start` is equivalent to left or top on vertical axis and `end` is equivalent to right or bottom on horizontal axis.
      position: 'start',
      // Allows you to correct label positioning on this axis by positive or negative x and y offset.
      labelOffset: {
        x: 0,
        y: 0
      },
      // If labels should be shown or not
      showLabel: true,
      // If the axis grid should be drawn or not
      showGrid: true,
      // Interpolation function that allows you to intercept the value from the axis label
      labelInterpolationFnc: Chartist.noop,
      // Set the axis type to be used to project values on this axis. If not defined, Chartist.AutoScaleAxis will be used for the Y-Axis, where the high and low options will be set to the global high and low options. This type can be changed to any axis constructor available (e.g. Chartist.FixedScaleAxis), where all axis options should be present here.
      type: undefined,
      // This value specifies the minimum height in pixel of the scale steps
      scaleMinSpace: 20,
      // Use only integer values (whole numbers) for the scale steps
      onlyInteger: false
    },
    // Specify a fixed width for the chart as a string (i.e. '100px' or '50%')
    width: undefined,
    // Specify a fixed height for the chart as a string (i.e. '100px' or '50%')
    height: undefined,
    // If the line should be drawn or not
    showLine: true,
    // If dots should be drawn or not
    showPoint: true,
    // If the line chart should draw an area
    showArea: false,
    // The base for the area chart that will be used to close the area shape (is normally 0)
    areaBase: 0,
    // Specify if the lines should be smoothed. This value can be true or false where true will result in smoothing using the default smoothing interpolation function Chartist.Interpolation.cardinal and false results in Chartist.Interpolation.none. You can also choose other smoothing / interpolation functions available in the Chartist.Interpolation module, or write your own interpolation function. Check the examples for a brief description.
    lineSmooth: true,
    // If the line chart should add a background fill to the .ct-grids group.
    showGridBackground: false,
    // Overriding the natural low of the chart allows you to zoom in or limit the charts lowest displayed value
    low: undefined,
    // Overriding the natural high of the chart allows you to zoom in or limit the charts highest displayed value
    high: undefined,
    // Padding of the chart drawing area to the container element and labels as a number or padding object {top: 5, right: 5, bottom: 5, left: 5}
    chartPadding: {
      top: 15,
      right: 15,
      bottom: 5,
      left: 10
    },
    // When set to true, the last grid line on the x-axis is not drawn and the chart elements will expand to the full available width of the chart. For the last label to be drawn correctly you might need to add chart padding or offset the last label with a draw event handler.
    fullWidth: false,
    // If true the whole data is reversed including labels, the series order as well as the whole series data arrays.
    reverseData: false,
    // Override the class names that get used to generate the SVG structure of the chart
    classNames: {
      chart: 'ct-chart-line',
      label: 'ct-label',
      labelGroup: 'ct-labels',
      series: 'ct-series',
      line: 'ct-line',
      point: 'ct-point',
      area: 'ct-area',
      grid: 'ct-grid',
      gridGroup: 'ct-grids',
      gridBackground: 'ct-grid-background',
      vertical: 'ct-vertical',
      horizontal: 'ct-horizontal',
      start: 'ct-start',
      end: 'ct-end'
    }
  };

  /**
   * Creates a new chart
   *
   */
  function createChart(options) {
    var data = Chartist.normalizeData(this.data, options.reverseData, true);

    // Create new svg object
    this.svg = Chartist.createSvg(this.container, options.width, options.height, options.classNames.chart);
    // Create groups for labels, grid and series
    var gridGroup = this.svg.elem('g').addClass(options.classNames.gridGroup);
    var seriesGroup = this.svg.elem('g');
    var labelGroup = this.svg.elem('g').addClass(options.classNames.labelGroup);

    var chartRect = Chartist.createChartRect(this.svg, options, defaultOptions.padding);
    var axisX, axisY;

    if(options.axisX.type === undefined) {
      axisX = new Chartist.StepAxis(Chartist.Axis.units.x, data.normalized.series, chartRect, Chartist.extend({}, options.axisX, {
        ticks: data.normalized.labels,
        stretch: options.fullWidth
      }));
    } else {
      axisX = options.axisX.type.call(Chartist, Chartist.Axis.units.x, data.normalized.series, chartRect, options.axisX);
    }

    if(options.axisY.type === undefined) {
      axisY = new Chartist.AutoScaleAxis(Chartist.Axis.units.y, data.normalized.series, chartRect, Chartist.extend({}, options.axisY, {
        high: Chartist.isNumeric(options.high) ? options.high : options.axisY.high,
        low: Chartist.isNumeric(options.low) ? options.low : options.axisY.low
      }));
    } else {
      axisY = options.axisY.type.call(Chartist, Chartist.Axis.units.y, data.normalized.series, chartRect, options.axisY);
    }

    axisX.createGridAndLabels(gridGroup, labelGroup, this.supportsForeignObject, options, this.eventEmitter);
    axisY.createGridAndLabels(gridGroup, labelGroup, this.supportsForeignObject, options, this.eventEmitter);

    if (options.showGridBackground) {
      Chartist.createGridBackground(gridGroup, chartRect, options.classNames.gridBackground, this.eventEmitter);
    }

    // Draw the series
    data.raw.series.forEach(function(series, seriesIndex) {
      var seriesElement = seriesGroup.elem('g');

      // Write attributes to series group element. If series name or meta is undefined the attributes will not be written
      seriesElement.attr({
        'ct:series-name': series.name,
        'ct:meta': Chartist.serialize(series.meta)
      });

      // Use series class from series data or if not set generate one
      seriesElement.addClass([
        options.classNames.series,
        (series.className || options.classNames.series + '-' + Chartist.alphaNumerate(seriesIndex))
      ].join(' '));

      var pathCoordinates = [],
        pathData = [];

      data.normalized.series[seriesIndex].forEach(function(value, valueIndex) {
        var p = {
          x: chartRect.x1 + axisX.projectValue(value, valueIndex, data.normalized.series[seriesIndex]),
          y: chartRect.y1 - axisY.projectValue(value, valueIndex, data.normalized.series[seriesIndex])
        };
        pathCoordinates.push(p.x, p.y);
        pathData.push({
          value: value,
          valueIndex: valueIndex,
          meta: Chartist.getMetaData(series, valueIndex)
        });
      }.bind(this));

      var seriesOptions = {
        lineSmooth: Chartist.getSeriesOption(series, options, 'lineSmooth'),
        showPoint: Chartist.getSeriesOption(series, options, 'showPoint'),
        showLine: Chartist.getSeriesOption(series, options, 'showLine'),
        showArea: Chartist.getSeriesOption(series, options, 'showArea'),
        areaBase: Chartist.getSeriesOption(series, options, 'areaBase')
      };

      var smoothing = typeof seriesOptions.lineSmooth === 'function' ?
        seriesOptions.lineSmooth : (seriesOptions.lineSmooth ? Chartist.Interpolation.monotoneCubic() : Chartist.Interpolation.none());
      // Interpolating path where pathData will be used to annotate each path element so we can trace back the original
      // index, value and meta data
      var path = smoothing(pathCoordinates, pathData);

      // If we should show points we need to create them now to avoid secondary loop
      // Points are drawn from the pathElements returned by the interpolation function
      // Small offset for Firefox to render squares correctly
      if (seriesOptions.showPoint) {

        path.pathElements.forEach(function(pathElement) {
          var point = seriesElement.elem('line', {
            x1: pathElement.x,
            y1: pathElement.y,
            x2: pathElement.x + 0.01,
            y2: pathElement.y
          }, options.classNames.point).attr({
            'ct:value': [pathElement.data.value.x, pathElement.data.value.y].filter(Chartist.isNumeric).join(','),
            'ct:meta': Chartist.serialize(pathElement.data.meta)
          });

          this.eventEmitter.emit('draw', {
            type: 'point',
            value: pathElement.data.value,
            index: pathElement.data.valueIndex,
            meta: pathElement.data.meta,
            series: series,
            seriesIndex: seriesIndex,
            axisX: axisX,
            axisY: axisY,
            group: seriesElement,
            element: point,
            x: pathElement.x,
            y: pathElement.y
          });
        }.bind(this));
      }

      if(seriesOptions.showLine) {
        var line = seriesElement.elem('path', {
          d: path.stringify()
        }, options.classNames.line, true);

        this.eventEmitter.emit('draw', {
          type: 'line',
          values: data.normalized.series[seriesIndex],
          path: path.clone(),
          chartRect: chartRect,
          index: seriesIndex,
          series: series,
          seriesIndex: seriesIndex,
          seriesMeta: series.meta,
          axisX: axisX,
          axisY: axisY,
          group: seriesElement,
          element: line
        });
      }

      // Area currently only works with axes that support a range!
      if(seriesOptions.showArea && axisY.range) {
        // If areaBase is outside the chart area (< min or > max) we need to set it respectively so that
        // the area is not drawn outside the chart area.
        var areaBase = Math.max(Math.min(seriesOptions.areaBase, axisY.range.max), axisY.range.min);

        // We project the areaBase value into screen coordinates
        var areaBaseProjected = chartRect.y1 - axisY.projectValue(areaBase);

        // In order to form the area we'll first split the path by move commands so we can chunk it up into segments
        path.splitByCommand('M').filter(function onlySolidSegments(pathSegment) {
          // We filter only "solid" segments that contain more than one point. Otherwise there's no need for an area
          return pathSegment.pathElements.length > 1;
        }).map(function convertToArea(solidPathSegments) {
          // Receiving the filtered solid path segments we can now convert those segments into fill areas
          var firstElement = solidPathSegments.pathElements[0];
          var lastElement = solidPathSegments.pathElements[solidPathSegments.pathElements.length - 1];

          // Cloning the solid path segment with closing option and removing the first move command from the clone
          // We then insert a new move that should start at the area base and draw a straight line up or down
          // at the end of the path we add an additional straight line to the projected area base value
          // As the closing option is set our path will be automatically closed
          return solidPathSegments.clone(true)
            .position(0)
            .remove(1)
            .move(firstElement.x, areaBaseProjected)
            .line(firstElement.x, firstElement.y)
            .position(solidPathSegments.pathElements.length + 1)
            .line(lastElement.x, areaBaseProjected);

        }).forEach(function createArea(areaPath) {
          // For each of our newly created area paths, we'll now create path elements by stringifying our path objects
          // and adding the created DOM elements to the correct series group
          var area = seriesElement.elem('path', {
            d: areaPath.stringify()
          }, options.classNames.area, true);

          // Emit an event for each area that was drawn
          this.eventEmitter.emit('draw', {
            type: 'area',
            values: data.normalized.series[seriesIndex],
            path: areaPath.clone(),
            series: series,
            seriesIndex: seriesIndex,
            axisX: axisX,
            axisY: axisY,
            chartRect: chartRect,
            index: seriesIndex,
            group: seriesElement,
            element: area
          });
        }.bind(this));
      }
    }.bind(this));

    this.eventEmitter.emit('created', {
      bounds: axisY.bounds,
      chartRect: chartRect,
      axisX: axisX,
      axisY: axisY,
      svg: this.svg,
      options: options
    });
  }

  /**
   * This method creates a new line chart.
   *
   * @memberof Chartist.Line
   * @param {String|Node} query A selector query string or directly a DOM element
   * @param {Object} data The data object that needs to consist of a labels and a series array
   * @param {Object} [options] The options object with options that override the default options. Check the examples for a detailed list.
   * @param {Array} [responsiveOptions] Specify an array of responsive option arrays which are a media query and options object pair => [[mediaQueryString, optionsObject],[more...]]
   * @return {Object} An object which exposes the API for the created chart
   *
   * @example
   * // Create a simple line chart
   * var data = {
   *   // A labels array that can contain any sort of values
   *   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
   *   // Our series array that contains series objects or in this case series data arrays
   *   series: [
   *     [5, 2, 4, 2, 0]
   *   ]
   * };
   *
   * // As options we currently only set a static size of 300x200 px
   * var options = {
   *   width: '300px',
   *   height: '200px'
   * };
   *
   * // In the global name space Chartist we call the Line function to initialize a line chart. As a first parameter we pass in a selector where we would like to get our chart created. Second parameter is the actual data object and as a third parameter we pass in our options
   * new Chartist.Line('.ct-chart', data, options);
   *
   * @example
   * // Use specific interpolation function with configuration from the Chartist.Interpolation module
   *
   * var chart = new Chartist.Line('.ct-chart', {
   *   labels: [1, 2, 3, 4, 5],
   *   series: [
   *     [1, 1, 8, 1, 7]
   *   ]
   * }, {
   *   lineSmooth: Chartist.Interpolation.cardinal({
   *     tension: 0.2
   *   })
   * });
   *
   * @example
   * // Create a line chart with responsive options
   *
   * var data = {
   *   // A labels array that can contain any sort of values
   *   labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
   *   // Our series array that contains series objects or in this case series data arrays
   *   series: [
   *     [5, 2, 4, 2, 0]
   *   ]
   * };
   *
   * // In addition to the regular options we specify responsive option overrides that will override the default configutation based on the matching media queries.
   * var responsiveOptions = [
   *   ['screen and (min-width: 641px) and (max-width: 1024px)', {
   *     showPoint: false,
   *     axisX: {
   *       labelInterpolationFnc: function(value) {
   *         // Will return Mon, Tue, Wed etc. on medium screens
   *         return value.slice(0, 3);
   *       }
   *     }
   *   }],
   *   ['screen and (max-width: 640px)', {
   *     showLine: false,
   *     axisX: {
   *       labelInterpolationFnc: function(value) {
   *         // Will return M, T, W etc. on small screens
   *         return value[0];
   *       }
   *     }
   *   }]
   * ];
   *
   * new Chartist.Line('.ct-chart', data, null, responsiveOptions);
   *
   */
  function Line(query, data, options, responsiveOptions) {
    Chartist.Line.super.constructor.call(this,
      query,
      data,
      defaultOptions,
      Chartist.extend({}, defaultOptions, options),
      responsiveOptions);
  }

  // Creating line chart type in Chartist namespace
  Chartist.Line = Chartist.Base.extend({
    constructor: Line,
    createChart: createChart
  });

}(this, Chartist));
;/**
 * The bar chart module of Chartist that can be used to draw unipolar or bipolar bar and grouped bar charts.
 *
 * @module Chartist.Bar
 */
/* global Chartist */
(function(globalRoot, Chartist){
  'use strict';

  var window = globalRoot.window;
  var document = globalRoot.document;

  /**
   * Default options in bar charts. Expand the code view to see a detailed list of options with comments.
   *
   * @memberof Chartist.Bar
   */
  var defaultOptions = {
    // Options for X-Axis
    axisX: {
      // The offset of the chart drawing area to the border of the container
      offset: 30,
      // Position where labels are placed. Can be set to `start` or `end` where `start` is equivalent to left or top on vertical axis and `end` is equivalent to right or bottom on horizontal axis.
      position: 'end',
      // Allows you to correct label positioning on this axis by positive or negative x and y offset.
      labelOffset: {
        x: 0,
        y: 0
      },
      // If labels should be shown or not
      showLabel: true,
      // If the axis grid should be drawn or not
      showGrid: true,
      // Interpolation function that allows you to intercept the value from the axis label
      labelInterpolationFnc: Chartist.noop,
      // This value specifies the minimum width in pixel of the scale steps
      scaleMinSpace: 30,
      // Use only integer values (whole numbers) for the scale steps
      onlyInteger: false
    },
    // Options for Y-Axis
    axisY: {
      // The offset of the chart drawing area to the border of the container
      offset: 40,
      // Position where labels are placed. Can be set to `start` or `end` where `start` is equivalent to left or top on vertical axis and `end` is equivalent to right or bottom on horizontal axis.
      position: 'start',
      // Allows you to correct label positioning on this axis by positive or negative x and y offset.
      labelOffset: {
        x: 0,
        y: 0
      },
      // If labels should be shown or not
      showLabel: true,
      // If the axis grid should be drawn or not
      showGrid: true,
      // Interpolation function that allows you to intercept the value from the axis label
      labelInterpolationFnc: Chartist.noop,
      // This value specifies the minimum height in pixel of the scale steps
      scaleMinSpace: 20,
      // Use only integer values (whole numbers) for the scale steps
      onlyInteger: false
    },
    // Specify a fixed width for the chart as a string (i.e. '100px' or '50%')
    width: undefined,
    // Specify a fixed height for the chart as a string (i.e. '100px' or '50%')
    height: undefined,
    // Overriding the natural high of the chart allows you to zoom in or limit the charts highest displayed value
    high: undefined,
    // Overriding the natural low of the chart allows you to zoom in or limit the charts lowest displayed value
    low: undefined,
    // Unless low/high are explicitly set, bar chart will be centered at zero by default. Set referenceValue to null to auto scale.
    referenceValue: 0,
    // Padding of the chart drawing area to the container element and labels as a number or padding object {top: 5, right: 5, bottom: 5, left: 5}
    chartPadding: {
      top: 15,
      right: 15,
      bottom: 5,
      left: 10
    },
    // Specify the distance in pixel of bars in a group
    seriesBarDistance: 15,
    // If set to true this property will cause the series bars to be stacked. Check the `stackMode` option for further stacking options.
    stackBars: false,
    // If set to 'overlap' this property will force the stacked bars to draw from the zero line.
    // If set to 'accumulate' this property will form a total for each series point. This will also influence the y-axis and the overall bounds of the chart. In stacked mode the seriesBarDistance property will have no effect.
    stackMode: 'accumulate',
    // Inverts the axes of the bar chart in order to draw a horizontal bar chart. Be aware that you also need to invert your axis settings as the Y Axis will now display the labels and the X Axis the values.
    horizontalBars: false,
    // If set to true then each bar will represent a series and the data array is expected to be a one dimensional array of data values rather than a series array of series. This is useful if the bar chart should represent a profile rather than some data over time.
    distributeSeries: false,
    // If true the whole data is reversed including labels, the series order as well as the whole series data arrays.
    reverseData: false,
    // If the bar chart should add a background fill to the .ct-grids group.
    showGridBackground: false,
    // Override the class names that get used to generate the SVG structure of the chart
    classNames: {
      chart: 'ct-chart-bar',
      horizontalBars: 'ct-horizontal-bars',
      label: 'ct-label',
      labelGroup: 'ct-labels',
      series: 'ct-series',
      bar: 'ct-bar',
      grid: 'ct-grid',
      gridGroup: 'ct-grids',
      gridBackground: 'ct-grid-background',
      vertical: 'ct-vertical',
      horizontal: 'ct-horizontal',
      start: 'ct-start',
      end: 'ct-end'
    }
  };

  /**
   * Creates a new chart
   *
   */
  function createChart(options) {
    var data;
    var highLow;

    if(options.distributeSeries) {
      data = Chartist.normalizeData(this.data, options.reverseData, options.horizontalBars ? 'x' : 'y');
      data.normalized.series = data.normalized.series.map(function(value) {
        return [value];
      });
    } else {
      data = Chartist.normalizeData(this.data, options.reverseData, options.horizontalBars ? 'x' : 'y');
    }

    // Create new svg element
    this.svg = Chartist.createSvg(
      this.container,
      options.width,
      options.height,
      options.classNames.chart + (options.horizontalBars ? ' ' + options.classNames.horizontalBars : '')
    );

    // Drawing groups in correct order
    var gridGroup = this.svg.elem('g').addClass(options.classNames.gridGroup);
    var seriesGroup = this.svg.elem('g');
    var labelGroup = this.svg.elem('g').addClass(options.classNames.labelGroup);

    if(options.stackBars && data.normalized.series.length !== 0) {

      // If stacked bars we need to calculate the high low from stacked values from each series
      var serialSums = Chartist.serialMap(data.normalized.series, function serialSums() {
        return Array.prototype.slice.call(arguments).map(function(value) {
          return value;
        }).reduce(function(prev, curr) {
          return {
            x: prev.x + (curr && curr.x) || 0,
            y: prev.y + (curr && curr.y) || 0
          };
        }, {x: 0, y: 0});
      });

      highLow = Chartist.getHighLow([serialSums], options, options.horizontalBars ? 'x' : 'y');

    } else {

      highLow = Chartist.getHighLow(data.normalized.series, options, options.horizontalBars ? 'x' : 'y');
    }

    // Overrides of high / low from settings
    highLow.high = +options.high || (options.high === 0 ? 0 : highLow.high);
    highLow.low = +options.low || (options.low === 0 ? 0 : highLow.low);

    var chartRect = Chartist.createChartRect(this.svg, options, defaultOptions.padding);

    var valueAxis,
      labelAxisTicks,
      labelAxis,
      axisX,
      axisY;

    // We need to set step count based on some options combinations
    if(options.distributeSeries && options.stackBars) {
      // If distributed series are enabled and bars need to be stacked, we'll only have one bar and therefore should
      // use only the first label for the step axis
      labelAxisTicks = data.normalized.labels.slice(0, 1);
    } else {
      // If distributed series are enabled but stacked bars aren't, we should use the series labels
      // If we are drawing a regular bar chart with two dimensional series data, we just use the labels array
      // as the bars are normalized
      labelAxisTicks = data.normalized.labels;
    }

    // Set labelAxis and valueAxis based on the horizontalBars setting. This setting will flip the axes if necessary.
    if(options.horizontalBars) {
      if(options.axisX.type === undefined) {
        valueAxis = axisX = new Chartist.AutoScaleAxis(Chartist.Axis.units.x, data.normalized.series, chartRect, Chartist.extend({}, options.axisX, {
          highLow: highLow,
          referenceValue: 0
        }));
      } else {
        valueAxis = axisX = options.axisX.type.call(Chartist, Chartist.Axis.units.x, data.normalized.series, chartRect, Chartist.extend({}, options.axisX, {
          highLow: highLow,
          referenceValue: 0
        }));
      }

      if(options.axisY.type === undefined) {
        labelAxis = axisY = new Chartist.StepAxis(Chartist.Axis.units.y, data.normalized.series, chartRect, {
          ticks: labelAxisTicks
        });
      } else {
        labelAxis = axisY = options.axisY.type.call(Chartist, Chartist.Axis.units.y, data.normalized.series, chartRect, options.axisY);
      }
    } else {
      if(options.axisX.type === undefined) {
        labelAxis = axisX = new Chartist.StepAxis(Chartist.Axis.units.x, data.normalized.series, chartRect, {
          ticks: labelAxisTicks
        });
      } else {
        labelAxis = axisX = options.axisX.type.call(Chartist, Chartist.Axis.units.x, data.normalized.series, chartRect, options.axisX);
      }

      if(options.axisY.type === undefined) {
        valueAxis = axisY = new Chartist.AutoScaleAxis(Chartist.Axis.units.y, data.normalized.series, chartRect, Chartist.extend({}, options.axisY, {
          highLow: highLow,
          referenceValue: 0
        }));
      } else {
        valueAxis = axisY = options.axisY.type.call(Chartist, Chartist.Axis.units.y, data.normalized.series, chartRect, Chartist.extend({}, options.axisY, {
          highLow: highLow,
          referenceValue: 0
        }));
      }
    }

    // Projected 0 point
    var zeroPoint = options.horizontalBars ? (chartRect.x1 + valueAxis.projectValue(0)) : (chartRect.y1 - valueAxis.projectValue(0));
    // Used to track the screen coordinates of stacked bars
    var stackedBarValues = [];

    labelAxis.createGridAndLabels(gridGroup, labelGroup, this.supportsForeignObject, options, this.eventEmitter);
    valueAxis.createGridAndLabels(gridGroup, labelGroup, this.supportsForeignObject, options, this.eventEmitter);

    if (options.showGridBackground) {
      Chartist.createGridBackground(gridGroup, chartRect, options.classNames.gridBackground, this.eventEmitter);
    }

    // Draw the series
    data.raw.series.forEach(function(series, seriesIndex) {
      // Calculating bi-polar value of index for seriesOffset. For i = 0..4 biPol will be -1.5, -0.5, 0.5, 1.5 etc.
      var biPol = seriesIndex - (data.raw.series.length - 1) / 2;
      // Half of the period width between vertical grid lines used to position bars
      var periodHalfLength;
      // Current series SVG element
      var seriesElement;

      // We need to set periodHalfLength based on some options combinations
      if(options.distributeSeries && !options.stackBars) {
        // If distributed series are enabled but stacked bars aren't, we need to use the length of the normaizedData array
        // which is the series count and divide by 2
        periodHalfLength = labelAxis.axisLength / data.normalized.series.length / 2;
      } else if(options.distributeSeries && options.stackBars) {
        // If distributed series and stacked bars are enabled we'll only get one bar so we should just divide the axis
        // length by 2
        periodHalfLength = labelAxis.axisLength / 2;
      } else {
        // On regular bar charts we should just use the series length
        periodHalfLength = labelAxis.axisLength / data.normalized.series[seriesIndex].length / 2;
      }

      // Adding the series group to the series element
      seriesElement = seriesGroup.elem('g');

      // Write attributes to series group element. If series name or meta is undefined the attributes will not be written
      seriesElement.attr({
        'ct:series-name': series.name,
        'ct:meta': Chartist.serialize(series.meta)
      });

      // Use series class from series data or if not set generate one
      seriesElement.addClass([
        options.classNames.series,
        (series.className || options.classNames.series + '-' + Chartist.alphaNumerate(seriesIndex))
      ].join(' '));

      data.normalized.series[seriesIndex].forEach(function(value, valueIndex) {
        var projected,
          bar,
          previousStack,
          labelAxisValueIndex;

        // We need to set labelAxisValueIndex based on some options combinations
        if(options.distributeSeries && !options.stackBars) {
          // If distributed series are enabled but stacked bars aren't, we can use the seriesIndex for later projection
          // on the step axis for label positioning
          labelAxisValueIndex = seriesIndex;
        } else if(options.distributeSeries && options.stackBars) {
          // If distributed series and stacked bars are enabled, we will only get one bar and therefore always use
          // 0 for projection on the label step axis
          labelAxisValueIndex = 0;
        } else {
          // On regular bar charts we just use the value index to project on the label step axis
          labelAxisValueIndex = valueIndex;
        }

        // We need to transform coordinates differently based on the chart layout
        if(options.horizontalBars) {
          projected = {
            x: chartRect.x1 + valueAxis.projectValue(value && value.x ? value.x : 0, valueIndex, data.normalized.series[seriesIndex]),
            y: chartRect.y1 - labelAxis.projectValue(value && value.y ? value.y : 0, labelAxisValueIndex, data.normalized.series[seriesIndex])
          };
        } else {
          projected = {
            x: chartRect.x1 + labelAxis.projectValue(value && value.x ? value.x : 0, labelAxisValueIndex, data.normalized.series[seriesIndex]),
            y: chartRect.y1 - valueAxis.projectValue(value && value.y ? value.y : 0, valueIndex, data.normalized.series[seriesIndex])
          }
        }

        // If the label axis is a step based axis we will offset the bar into the middle of between two steps using
        // the periodHalfLength value. Also we do arrange the different series so that they align up to each other using
        // the seriesBarDistance. If we don't have a step axis, the bar positions can be chosen freely so we should not
        // add any automated positioning.
        if(labelAxis instanceof Chartist.StepAxis) {
          // Offset to center bar between grid lines, but only if the step axis is not stretched
          if(!labelAxis.options.stretch) {
            projected[labelAxis.units.pos] += periodHalfLength * (options.horizontalBars ? -1 : 1);
          }
          // Using bi-polar offset for multiple series if no stacked bars or series distribution is used
          projected[labelAxis.units.pos] += (options.stackBars || options.distributeSeries) ? 0 : biPol * options.seriesBarDistance * (options.horizontalBars ? -1 : 1);
        }

        // Enter value in stacked bar values used to remember previous screen value for stacking up bars
        previousStack = stackedBarValues[valueIndex] || zeroPoint;
        stackedBarValues[valueIndex] = previousStack - (zeroPoint - projected[labelAxis.counterUnits.pos]);

        // Skip if value is undefined
        if(value === undefined) {
          return;
        }

        var positions = {};
        positions[labelAxis.units.pos + '1'] = projected[labelAxis.units.pos];
        positions[labelAxis.units.pos + '2'] = projected[labelAxis.units.pos];

        if(options.stackBars && (options.stackMode === 'accumulate' || !options.stackMode)) {
          // Stack mode: accumulate (default)
          // If bars are stacked we use the stackedBarValues reference and otherwise base all bars off the zero line
          // We want backwards compatibility, so the expected fallback without the 'stackMode' option
          // to be the original behaviour (accumulate)
          positions[labelAxis.counterUnits.pos + '1'] = previousStack;
          positions[labelAxis.counterUnits.pos + '2'] = stackedBarValues[valueIndex];
        } else {
          // Draw from the zero line normally
          // This is also the same code for Stack mode: overlap
          positions[labelAxis.counterUnits.pos + '1'] = zeroPoint;
          positions[labelAxis.counterUnits.pos + '2'] = projected[labelAxis.counterUnits.pos];
        }

        // Limit x and y so that they are within the chart rect
        positions.x1 = Math.min(Math.max(positions.x1, chartRect.x1), chartRect.x2);
        positions.x2 = Math.min(Math.max(positions.x2, chartRect.x1), chartRect.x2);
        positions.y1 = Math.min(Math.max(positions.y1, chartRect.y2), chartRect.y1);
        positions.y2 = Math.min(Math.max(positions.y2, chartRect.y2), chartRect.y1);

        var metaData = Chartist.getMetaData(series, valueIndex);

        // Create bar element
        bar = seriesElement.elem('line', positions, options.classNames.bar).attr({
          'ct:value': [value.x, value.y].filter(Chartist.isNumeric).join(','),
          'ct:meta': Chartist.serialize(metaData)
        });

        this.eventEmitter.emit('draw', Chartist.extend({
          type: 'bar',
          value: value,
          index: valueIndex,
          meta: metaData,
          series: series,
          seriesIndex: seriesIndex,
          axisX: axisX,
          axisY: axisY,
          chartRect: chartRect,
          group: seriesElement,
          element: bar
        }, positions));
      }.bind(this));
    }.bind(this));

    this.eventEmitter.emit('created', {
      bounds: valueAxis.bounds,
      chartRect: chartRect,
      axisX: axisX,
      axisY: axisY,
      svg: this.svg,
      options: options
    });
  }

  /**
   * This method creates a new bar chart and returns API object that you can use for later changes.
   *
   * @memberof Chartist.Bar
   * @param {String|Node} query A selector query string or directly a DOM element
   * @param {Object} data The data object that needs to consist of a labels and a series array
   * @param {Object} [options] The options object with options that override the default options. Check the examples for a detailed list.
   * @param {Array} [responsiveOptions] Specify an array of responsive option arrays which are a media query and options object pair => [[mediaQueryString, optionsObject],[more...]]
   * @return {Object} An object which exposes the API for the created chart
   *
   * @example
   * // Create a simple bar chart
   * var data = {
   *   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
   *   series: [
   *     [5, 2, 4, 2, 0]
   *   ]
   * };
   *
   * // In the global name space Chartist we call the Bar function to initialize a bar chart. As a first parameter we pass in a selector where we would like to get our chart created and as a second parameter we pass our data object.
   * new Chartist.Bar('.ct-chart', data);
   *
   * @example
   * // This example creates a bipolar grouped bar chart where the boundaries are limitted to -10 and 10
   * new Chartist.Bar('.ct-chart', {
   *   labels: [1, 2, 3, 4, 5, 6, 7],
   *   series: [
   *     [1, 3, 2, -5, -3, 1, -6],
   *     [-5, -2, -4, -1, 2, -3, 1]
   *   ]
   * }, {
   *   seriesBarDistance: 12,
   *   low: -10,
   *   high: 10
   * });
   *
   */
  function Bar(query, data, options, responsiveOptions) {
    Chartist.Bar.super.constructor.call(this,
      query,
      data,
      defaultOptions,
      Chartist.extend({}, defaultOptions, options),
      responsiveOptions);
  }

  // Creating bar chart type in Chartist namespace
  Chartist.Bar = Chartist.Base.extend({
    constructor: Bar,
    createChart: createChart
  });

}(this, Chartist));
;/**
 * The pie chart module of Chartist that can be used to draw pie, donut or gauge charts
 *
 * @module Chartist.Pie
 */
/* global Chartist */
(function(globalRoot, Chartist) {
  'use strict';

  var window = globalRoot.window;
  var document = globalRoot.document;

  /**
   * Default options in line charts. Expand the code view to see a detailed list of options with comments.
   *
   * @memberof Chartist.Pie
   */
  var defaultOptions = {
    // Specify a fixed width for the chart as a string (i.e. '100px' or '50%')
    width: undefined,
    // Specify a fixed height for the chart as a string (i.e. '100px' or '50%')
    height: undefined,
    // Padding of the chart drawing area to the container element and labels as a number or padding object {top: 5, right: 5, bottom: 5, left: 5}
    chartPadding: 5,
    // Override the class names that are used to generate the SVG structure of the chart
    classNames: {
      chartPie: 'ct-chart-pie',
      chartDonut: 'ct-chart-donut',
      series: 'ct-series',
      slicePie: 'ct-slice-pie',
      sliceDonut: 'ct-slice-donut',
      sliceDonutSolid: 'ct-slice-donut-solid',
      label: 'ct-label'
    },
    // The start angle of the pie chart in degrees where 0 points north. A higher value offsets the start angle clockwise.
    startAngle: 0,
    // An optional total you can specify. By specifying a total value, the sum of the values in the series must be this total in order to draw a full pie. You can use this parameter to draw only parts of a pie or gauge charts.
    total: undefined,
    // If specified the donut CSS classes will be used and strokes will be drawn instead of pie slices.
    donut: false,
    // If specified the donut segments will be drawn as shapes instead of strokes.
    donutSolid: false,
    // Specify the donut stroke width, currently done in javascript for convenience. May move to CSS styles in the future.
    // This option can be set as number or string to specify a relative width (i.e. 100 or '30%').
    donutWidth: 60,
    // If a label should be shown or not
    showLabel: true,
    // Label position offset from the standard position which is half distance of the radius. This value can be either positive or negative. Positive values will position the label away from the center.
    labelOffset: 0,
    // This option can be set to 'inside', 'outside' or 'center'. Positioned with 'inside' the labels will be placed on half the distance of the radius to the border of the Pie by respecting the 'labelOffset'. The 'outside' option will place the labels at the border of the pie and 'center' will place the labels in the absolute center point of the chart. The 'center' option only makes sense in conjunction with the 'labelOffset' option.
    labelPosition: 'inside',
    // An interpolation function for the label value
    labelInterpolationFnc: Chartist.noop,
    // Label direction can be 'neutral', 'explode' or 'implode'. The labels anchor will be positioned based on those settings as well as the fact if the labels are on the right or left side of the center of the chart. Usually explode is useful when labels are positioned far away from the center.
    labelDirection: 'neutral',
    // If true the whole data is reversed including labels, the series order as well as the whole series data arrays.
    reverseData: false,
    // If true empty values will be ignored to avoid drawing unncessary slices and labels
    ignoreEmptyValues: false
  };

  /**
   * Determines SVG anchor position based on direction and center parameter
   *
   * @param center
   * @param label
   * @param direction
   * @return {string}
   */
  function determineAnchorPosition(center, label, direction) {
    var toTheRight = label.x > center.x;

    if(toTheRight && direction === 'explode' ||
      !toTheRight && direction === 'implode') {
      return 'start';
    } else if(toTheRight && direction === 'implode' ||
      !toTheRight && direction === 'explode') {
      return 'end';
    } else {
      return 'middle';
    }
  }

  /**
   * Creates the pie chart
   *
   * @param options
   */
  function createChart(options) {
    var data = Chartist.normalizeData(this.data);
    var seriesGroups = [],
      labelsGroup,
      chartRect,
      radius,
      labelRadius,
      totalDataSum,
      startAngle = options.startAngle;

    // Create SVG.js draw
    this.svg = Chartist.createSvg(this.container, options.width, options.height,options.donut ? options.classNames.chartDonut : options.classNames.chartPie);
    // Calculate charting rect
    chartRect = Chartist.createChartRect(this.svg, options, defaultOptions.padding);
    // Get biggest circle radius possible within chartRect
    radius = Math.min(chartRect.width() / 2, chartRect.height() / 2);
    // Calculate total of all series to get reference value or use total reference from optional options
    totalDataSum = options.total || data.normalized.series.reduce(function(previousValue, currentValue) {
      return previousValue + currentValue;
    }, 0);

    var donutWidth = Chartist.quantity(options.donutWidth);
    if (donutWidth.unit === '%') {
      donutWidth.value *= radius / 100;
    }

    // If this is a donut chart we need to adjust our radius to enable strokes to be drawn inside
    // Unfortunately this is not possible with the current SVG Spec
    // See this proposal for more details: http://lists.w3.org/Archives/Public/www-svg/2003Oct/0000.html
    radius -= options.donut && !options.donutSolid ? donutWidth.value / 2  : 0;

    // If labelPosition is set to `outside` or a donut chart is drawn then the label position is at the radius,
    // if regular pie chart it's half of the radius
    if(options.labelPosition === 'outside' || options.donut && !options.donutSolid) {
      labelRadius = radius;
    } else if(options.labelPosition === 'center') {
      // If labelPosition is center we start with 0 and will later wait for the labelOffset
      labelRadius = 0;
    } else if(options.donutSolid) {
      labelRadius = radius - donutWidth.value / 2;
    } else {
      // Default option is 'inside' where we use half the radius so the label will be placed in the center of the pie
      // slice
      labelRadius = radius / 2;
    }
    // Add the offset to the labelRadius where a negative offset means closed to the center of the chart
    labelRadius += options.labelOffset;

    // Calculate end angle based on total sum and current data value and offset with padding
    var center = {
      x: chartRect.x1 + chartRect.width() / 2,
      y: chartRect.y2 + chartRect.height() / 2
    };

    // Check if there is only one non-zero value in the series array.
    var hasSingleValInSeries = data.raw.series.filter(function(val) {
      return val.hasOwnProperty('value') ? val.value !== 0 : val !== 0;
    }).length === 1;

    // Creating the series groups
    data.raw.series.forEach(function(series, index) {
      seriesGroups[index] = this.svg.elem('g', null, null);
    }.bind(this));
    //if we need to show labels we create the label group now
    if(options.showLabel) {
      labelsGroup = this.svg.elem('g', null, null);
    }

    // Draw the series
    // initialize series groups
    data.raw.series.forEach(function(series, index) {
      // If current value is zero and we are ignoring empty values then skip to next value
      if (data.normalized.series[index] === 0 && options.ignoreEmptyValues) return;

      // If the series is an object and contains a name or meta data we add a custom attribute
      seriesGroups[index].attr({
        'ct:series-name': series.name
      });

      // Use series class from series data or if not set generate one
      seriesGroups[index].addClass([
        options.classNames.series,
        (series.className || options.classNames.series + '-' + Chartist.alphaNumerate(index))
      ].join(' '));

      // If the whole dataset is 0 endAngle should be zero. Can't divide by 0.
      var endAngle = (totalDataSum > 0 ? startAngle + data.normalized.series[index] / totalDataSum * 360 : 0);

      // Use slight offset so there are no transparent hairline issues
      var overlappigStartAngle = Math.max(0, startAngle - (index === 0 || hasSingleValInSeries ? 0 : 0.2));

      // If we need to draw the arc for all 360 degrees we need to add a hack where we close the circle
      // with Z and use 359.99 degrees
      if(endAngle - overlappigStartAngle >= 359.99) {
        endAngle = overlappigStartAngle + 359.99;
      }

      var start = Chartist.polarToCartesian(center.x, center.y, radius, overlappigStartAngle),
        end = Chartist.polarToCartesian(center.x, center.y, radius, endAngle);

      var innerStart,
        innerEnd,
        donutSolidRadius;

      // Create a new path element for the pie chart. If this isn't a donut chart we should close the path for a correct stroke
      var path = new Chartist.Svg.Path(!options.donut || options.donutSolid)
        .move(end.x, end.y)
        .arc(radius, radius, 0, endAngle - startAngle > 180, 0, start.x, start.y);

      // If regular pie chart (no donut) we add a line to the center of the circle for completing the pie
      if(!options.donut) {
        path.line(center.x, center.y);
      } else if (options.donutSolid) {
        donutSolidRadius = radius - donutWidth.value;
        innerStart = Chartist.polarToCartesian(center.x, center.y, donutSolidRadius, startAngle - (index === 0 || hasSingleValInSeries ? 0 : 0.2));
        innerEnd = Chartist.polarToCartesian(center.x, center.y, donutSolidRadius, endAngle);
        path.line(innerStart.x, innerStart.y);
        path.arc(donutSolidRadius, donutSolidRadius, 0, endAngle - startAngle  > 180, 1, innerEnd.x, innerEnd.y);
      }

      // Create the SVG path
      // If this is a donut chart we add the donut class, otherwise just a regular slice
      var pathClassName = options.classNames.slicePie;
      if (options.donut) {
        pathClassName = options.classNames.sliceDonut;
        if (options.donutSolid) {
          pathClassName = options.classNames.sliceDonutSolid;
        }
      }
      var pathElement = seriesGroups[index].elem('path', {
        d: path.stringify()
      }, pathClassName);

      // Adding the pie series value to the path
      pathElement.attr({
        'ct:value': data.normalized.series[index],
        'ct:meta': Chartist.serialize(series.meta)
      });

      // If this is a donut, we add the stroke-width as style attribute
      if(options.donut && !options.donutSolid) {
        pathElement._node.style.strokeWidth = donutWidth.value + 'px';
      }

      // Fire off draw event
      this.eventEmitter.emit('draw', {
        type: 'slice',
        value: data.normalized.series[index],
        totalDataSum: totalDataSum,
        index: index,
        meta: series.meta,
        series: series,
        group: seriesGroups[index],
        element: pathElement,
        path: path.clone(),
        center: center,
        radius: radius,
        startAngle: startAngle,
        endAngle: endAngle
      });

      // If we need to show labels we need to add the label for this slice now
      if(options.showLabel) {
        var labelPosition;
        if(data.raw.series.length === 1) {
          // If we have only 1 series, we can position the label in the center of the pie
          labelPosition = {
            x: center.x,
            y: center.y
          };
        } else {
          // Position at the labelRadius distance from center and between start and end angle
          labelPosition = Chartist.polarToCartesian(
            center.x,
            center.y,
            labelRadius,
            startAngle + (endAngle - startAngle) / 2
          );
        }

        var rawValue;
        if(data.normalized.labels && !Chartist.isFalseyButZero(data.normalized.labels[index])) {
          rawValue = data.normalized.labels[index];
        } else {
          rawValue = data.normalized.series[index];
        }

        var interpolatedValue = options.labelInterpolationFnc(rawValue, index);

        if(interpolatedValue || interpolatedValue === 0) {
          var labelElement = labelsGroup.elem('text', {
            dx: labelPosition.x,
            dy: labelPosition.y,
            'text-anchor': determineAnchorPosition(center, labelPosition, options.labelDirection)
          }, options.classNames.label).text('' + interpolatedValue);

          // Fire off draw event
          this.eventEmitter.emit('draw', {
            type: 'label',
            index: index,
            group: labelsGroup,
            element: labelElement,
            text: '' + interpolatedValue,
            x: labelPosition.x,
            y: labelPosition.y
          });
        }
      }

      // Set next startAngle to current endAngle.
      // (except for last slice)
      startAngle = endAngle;
    }.bind(this));

    this.eventEmitter.emit('created', {
      chartRect: chartRect,
      svg: this.svg,
      options: options
    });
  }

  /**
   * This method creates a new pie chart and returns an object that can be used to redraw the chart.
   *
   * @memberof Chartist.Pie
   * @param {String|Node} query A selector query string or directly a DOM element
   * @param {Object} data The data object in the pie chart needs to have a series property with a one dimensional data array. The values will be normalized against each other and don't necessarily need to be in percentage. The series property can also be an array of value objects that contain a value property and a className property to override the CSS class name for the series group.
   * @param {Object} [options] The options object with options that override the default options. Check the examples for a detailed list.
   * @param {Array} [responsiveOptions] Specify an array of responsive option arrays which are a media query and options object pair => [[mediaQueryString, optionsObject],[more...]]
   * @return {Object} An object with a version and an update method to manually redraw the chart
   *
   * @example
   * // Simple pie chart example with four series
   * new Chartist.Pie('.ct-chart', {
   *   series: [10, 2, 4, 3]
   * });
   *
   * @example
   * // Drawing a donut chart
   * new Chartist.Pie('.ct-chart', {
   *   series: [10, 2, 4, 3]
   * }, {
   *   donut: true
   * });
   *
   * @example
   * // Using donut, startAngle and total to draw a gauge chart
   * new Chartist.Pie('.ct-chart', {
   *   series: [20, 10, 30, 40]
   * }, {
   *   donut: true,
   *   donutWidth: 20,
   *   startAngle: 270,
   *   total: 200
   * });
   *
   * @example
   * // Drawing a pie chart with padding and labels that are outside the pie
   * new Chartist.Pie('.ct-chart', {
   *   series: [20, 10, 30, 40]
   * }, {
   *   chartPadding: 30,
   *   labelOffset: 50,
   *   labelDirection: 'explode'
   * });
   *
   * @example
   * // Overriding the class names for individual series as well as a name and meta data.
   * // The name will be written as ct:series-name attribute and the meta data will be serialized and written
   * // to a ct:meta attribute.
   * new Chartist.Pie('.ct-chart', {
   *   series: [{
   *     value: 20,
   *     name: 'Series 1',
   *     className: 'my-custom-class-one',
   *     meta: 'Meta One'
   *   }, {
   *     value: 10,
   *     name: 'Series 2',
   *     className: 'my-custom-class-two',
   *     meta: 'Meta Two'
   *   }, {
   *     value: 70,
   *     name: 'Series 3',
   *     className: 'my-custom-class-three',
   *     meta: 'Meta Three'
   *   }]
   * });
   */
  function Pie(query, data, options, responsiveOptions) {
    Chartist.Pie.super.constructor.call(this,
      query,
      data,
      defaultOptions,
      Chartist.extend({}, defaultOptions, options),
      responsiveOptions);
  }

  // Creating pie chart type in Chartist namespace
  Chartist.Pie = Chartist.Base.extend({
    constructor: Pie,
    createChart: createChart,
    determineAnchorPosition: determineAnchorPosition
  });

}(this, Chartist));

return Chartist;

}));


/***/ }),

/***/ "./node_modules/ng-chartist/fesm5/ng-chartist.js":
/*!*******************************************************!*\
  !*** ./node_modules/ng-chartist/fesm5/ng-chartist.js ***!
  \*******************************************************/
/*! exports provided: ChartistComponent, ChartistModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChartistComponent", function() { return ChartistComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChartistModule", function() { return ChartistModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var chartist__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! chartist */ "./node_modules/chartist/dist/chartist.js");
/* harmony import */ var chartist__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(chartist__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");




/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var ChartistComponent = /** @class */ (function () {
    function ChartistComponent(element) {
        this.element = element.nativeElement;
    }
    /**
     * @return {?}
     */
    ChartistComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.type || !this.data) {
            Promise.reject('Expected at least type and data.');
        }
        return this.renderChart().then(function (chart) {
            if (_this.events !== undefined) {
                _this.bindEvents(chart);
            }
            return chart;
        });
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    ChartistComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        this.update(changes);
    };
    /**
     * @return {?}
     */
    ChartistComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.chart) {
            this.chart.detach();
        }
    };
    /**
     * @return {?}
     */
    ChartistComponent.prototype.renderChart = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var promises = [
            this.type,
            this.element,
            this.data,
            this.options,
            this.responsiveOptions
        ];
        return Promise.all(promises).then(function (values) {
            var _a = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__read"])(values), type = _a[0], args = _a.slice(1);
            if (!(type in chartist__WEBPACK_IMPORTED_MODULE_1__)) {
                throw new Error(type + " is not a valid chart type");
            }
            _this.chart = ((/** @type {?} */ (chartist__WEBPACK_IMPORTED_MODULE_1__)))[type].apply(((/** @type {?} */ (chartist__WEBPACK_IMPORTED_MODULE_1__))), Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])(args));
            return _this.chart;
        });
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    ChartistComponent.prototype.update = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (!this.chart || 'type' in changes) {
            this.renderChart();
        }
        else {
            if (changes.data) {
                this.data = changes.data.currentValue;
            }
            if (changes.options) {
                this.options = changes.options.currentValue;
            }
            ((/** @type {?} */ (this.chart))).update(this.data, this.options);
        }
    };
    /**
     * @param {?} chart
     * @return {?}
     */
    ChartistComponent.prototype.bindEvents = /**
     * @param {?} chart
     * @return {?}
     */
    function (chart) {
        var e_1, _a;
        try {
            for (var _b = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(Object.keys(this.events)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var event_1 = _c.value;
                chart.on(event_1, this.events[event_1]);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    ChartistComponent.decorators = [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"], args: [{
                    selector: 'x-chartist',
                    template: '<ng-content></ng-content>'
                }] }
    ];
    /** @nocollapse */
    ChartistComponent.ctorParameters = function () { return [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["ElementRef"] }
    ]; };
    ChartistComponent.propDecorators = {
        data: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"] }],
        type: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"] }],
        options: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"] }],
        responsiveOptions: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"] }],
        events: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"] }]
    };
    return ChartistComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var ChartistModule = /** @class */ (function () {
    function ChartistModule() {
    }
    ChartistModule.decorators = [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"], args: [{
                    declarations: [ChartistComponent],
                    imports: [],
                    exports: [ChartistComponent]
                },] }
    ];
    return ChartistModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */



//# sourceMappingURL=ng-chartist.js.map

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/pages/full-pages/faq/faq.component.html":
/*!***********************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/pages/full-pages/faq/faq.component.html ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\n  <div class=\"col-sm-12\">\n    <div class=\"content-header\">سوالات متداول</div>\n    <p class=\"content-sub-header\">ما برای کمک اینجا هستیم</p>\n  </div>\n</div>\n<!-- faq starts -->\n<section id=\"faq\">\n  <div class=\"row\">\n    <div class=\"col-12\">\n      <div class=\"card gradient-purple-bliss white text-center p-4\">\n        <div class=\"card-header\">\n          <h1>ما برای کمک اینجا هستیم</h1>\n          <p><em>اگر شما هر گونه سوال شما می توانید از زیر درخواست کنید و یا آنچه را که دنبال آن هستید وارد کنید!</em></p>\n        </div>\n        <div class=\"card-body\">\n          <fieldset class=\"form-group col-xl-12 col-lg-10 col-10\">\n            <input type=\"text\" class=\"form-control\" placeholder=\"جستجو در سوالات متداول...\" (input)=\"filter($event.target.value)\"\n              #messageInput>\n          </fieldset>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-12\">\n      <div class=\"card text-truncate\">\n        <div class=\"card-body\">\n          <ngb-accordion [closeOthers]=\"true\">\n            <ngb-panel [id]=\"faq.faqId\" *ngFor=\"let faq of faqs\">\n              <ng-template ngbPanelTitle>\n                <h5 class=\"mb-0\"><i class=\"icon-question mr-2\"></i> <span> {{faq.title}}</span></h5>\n              </ng-template>\n              <ng-template ngbPanelContent>\n                <div >\n                  {{faq.content}}\n                </div>\n              </ng-template>\n            </ngb-panel>\n          </ngb-accordion>\n        </div>\n      </div>\n    </div>\n  </div>\n</section>\n<!-- faq Ends -->\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/pages/full-pages/gallery/gallery-page.component.html":
/*!************************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/pages/full-pages/gallery/gallery-page.component.html ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--Gallery Hover Effect Starts-->\n<div class=\"row\">\n    <div class=\"col-sm-12\">\n        <div class=\"content-header\">افکت شناور</div>\n        <p class=\"content-sub-header\">\n            گالری گالری تصویر با 30 اثر ظریف شناور. برای نشان دادن هر اثر شناور سعی کنید به زیر تصاویر نمایشی بتابانید. \n        </p>\n    </div>\n</div>\n<section id=\"hover-effects\" class=\"card\">\n  <div class=\"card-content\">\n    <div class=\"card-body my-gallery\" itemscope itemtype=\"http://schema.org/ImageGallery\">\n      <div class=\"grid-hover\">\n        <h5 class=\"text-bold-400 text-uppercase\">Lily</h5>\n        <div class=\"row\">\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-lily\">\n              <img src=\"assets/img/gallery/12.jpg\" alt=\"img12\" />\n              <figcaption>\n                <div>\n                  <h2>رضا\n                    <span>حسینی</span>\n                  </h2>\n                  <p>لورم ایپسوم متن ساختگی با تولید سادگی</p>\n                </div>\n                <a>دیدن بیشتر</a>\n              </figcaption>\n            </figure>\n          </div>\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-lily\">\n              <img src=\"assets/img/gallery/1.jpg\" alt=\"img1\" />\n              <figcaption>\n                <div>\n                  <h2>رضا\n                    <span>حسینی</span>\n                  </h2>\n                  <p>لورم ایپسوم متن ساختگی با تولید سادگی</p>\n                </div>\n                <a>دیدن بیشتر</a>\n              </figcaption>\n            </figure>\n          </div>\n        </div>\n      </div>\n      <div class=\"grid-hover\">\n        <h5 class=\"text-bold-400 text-uppercase\">زیبا</h5>\n        <div class=\"row\">\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-sadie\">\n              <img src=\"assets/img/gallery/2.jpg\" alt=\"img02\" />\n              <figcaption>\n                <h2>مقدس\n                  <span>زیبا</span>\n                </h2>\n                <p>لورم ایپسوم متن ساختگی\n                  <br>تولید سادگی نامفهوم</p>\n                <a>دیدن بیشتر</a>\n              </figcaption>\n            </figure>\n          </div>\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-sadie\">\n              <img src=\"assets/img/gallery/14.jpg\" alt=\"img14\" />\n              <figcaption>\n                <h2>مقدس\n                  <span>Sadie</span>\n                </h2>\n                <p>لورم ایپسوم متن ساختگی\n                  <br>تولید سادگی نامفهوم</p>\n                <a>دیدن بیشتر</a>\n              </figcaption>\n            </figure>\n          </div>\n        </div>\n      </div>\n      <div class=\"grid-hover\">\n        <h5 class=\"text-bold-400 text-uppercase\">عسل</h5>\n        <div class=\"row\">\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-honey\">\n              <img src=\"assets/img/gallery/4.jpg\" alt=\"img04\" />\n              <figcaption>\n                <h2>رویایی\n                  <span>عسل</span> <i>جدید</i></h2>\n                <a>دیدن بیشتر</a>\n              </figcaption>\n            </figure>\n          </div>\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-honey\">\n              <img src=\"assets/img/gallery/5.jpg\" alt=\"img05\" />\n              <figcaption>\n                <h2>رویایی\n                  <span>عسل</span> <i>جدید</i></h2>\n                <a>دیدن بیشتر</a>\n              </figcaption>\n            </figure>\n          </div>\n        </div>\n      </div>\n      <div class=\"grid-hover\">\n        <h5 class=\"text-bold-400 text-uppercase\">لیلا</h5>\n        <div class=\"row\">\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-layla\">\n              <img src=\"assets/img/gallery/6.jpg\" alt=\"img06\" />\n              <figcaption>\n                <h2>باهوش\n                  <span>لیلا</span>\n                </h2>\n                <p>شرایط فعلی تکنولوژی مورد نیاز </p>\n                <a>دیدن بیشتر</a>\n              </figcaption>\n            </figure>\n          </div>\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-layla\">\n              <img src=\"assets/img/gallery/3.jpg\" alt=\"img03\" />\n              <figcaption>\n                <h2>باهوش\n                  <span>لیلا</span>\n                </h2>\n                <p>شرایط فعلی تکنولوژی مورد نیاز </p>\n                <a>دیدن بیشتر</a>\n              </figcaption>\n            </figure>\n          </div>\n        </div>\n      </div>\n      <div class=\"grid-hover\">\n        <h5 class=\"text-bold-400 text-uppercase\">کوه</h5>\n        <div class=\"row\">\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-zoe\">\n              <img src=\"assets/img/gallery/25.jpg\" alt=\"img25\" />\n              <figcaption>\n                <h2>ساختن\n                  <span>کوه</span>\n                </h2>\n                <p class=\"icon-links\">\n                  <a class=\"mr-1\"><i class=\"ft-heart\"></i></a>\n                  <a class=\"mr-1\"><i class=\"ft-eye\"></i></a>\n                  <a class=\"mr-1\"><i class=\"ft-edit\"></i></a>\n                </p>\n                <p class=\"description\">لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است</p>\n              </figcaption>\n            </figure>\n          </div>\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-zoe\">\n              <img src=\"assets/img/gallery/26.jpg\" alt=\"img26\" />\n              <figcaption>\n                <h2>ساختن\n                  <span>کوه</span>\n                </h2>\n                <p class=\"icon-links\">\n                  <a class=\"mr-1\"><i class=\"ft-heart\"></i></a>\n                  <a class=\"mr-1\"><i class=\"ft-eye\"></i></a>\n                  <a class=\"mr-1\"><i class=\"ft-edit\"></i></a>\n                </p>\n                <p class=\"description\">لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است</p>\n              </figcaption>\n            </figure>\n          </div>\n        </div>\n      </div>\n      <div class=\"grid-hover\">\n        <h5 class=\"text-bold-400 text-uppercase\">زیبا شناسی</h5>\n        <div class=\"row\">\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-oscar\">\n              <img src=\"assets/img/gallery/9.jpg\" alt=\"img09\" />\n              <figcaption>\n                <h2>عمیق\n                  <span>زیبا شناسی</span>\n                </h2>\n                <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است</p>\n                <a>دیدن بیشتر</a>\n              </figcaption>\n            </figure>\n          </div>\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-oscar\">\n              <img src=\"assets/img/gallery/10.jpg\" alt=\"img10\" />\n              <figcaption>\n                <h2>عمیق\n                  <span>زیبا شناسی</span>\n                </h2>\n                <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است</p>\n                <a>دیدن بیشتر</a>\n              </figcaption>\n            </figure>\n          </div>\n        </div>\n      </div>\n      <div class=\"grid-hover\">\n        <h5 class=\"text-bold-400 text-uppercase\">کتاب</h5>\n        <div class=\"row\">\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-marley\">\n              <img src=\"assets/img/gallery/11.jpg\" alt=\"img11\" />\n              <figcaption>\n                <h2>زیبا\n                  <span>کتاب</span>\n                </h2>\n                <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم</p>\n                <a>دیدن بیشتر</a>\n              </figcaption>\n            </figure>\n          </div>\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-marley\">\n              <img src=\"assets/img/gallery/12.jpg\" alt=\"img12\" />\n              <figcaption>\n                <h2>زیبا\n                  <span>کتاب</span>\n                </h2>\n                <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم</p>\n                <a>دیدن بیشتر</a>\n              </figcaption>\n            </figure>\n          </div>\n        </div>\n      </div>\n      <div class=\"grid-hover\">\n        <h5 class=\"text-bold-400 text-uppercase\">ذهن</h5>\n        <div class=\"row\">\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-ruby\">\n              <img src=\"assets/img/gallery/13.jpg\" alt=\"img13\" />\n              <figcaption>\n                <h2>آرام\n                  <span>ذهن</span>\n                </h2>\n                <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم</p>\n                <a>دیدن بیشتر</a>\n              </figcaption>\n            </figure>\n          </div>\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-ruby\">\n              <img src=\"assets/img/gallery/14.jpg\" alt=\"img14\" />\n              <figcaption>\n                <h2>آرام\n                  <span>ذهن</span>\n                </h2>\n                <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم</p>\n                <a>دیدن بیشتر</a>\n              </figcaption>\n            </figure>\n          </div>\n        </div>\n      </div>\n      <div class=\"grid-hover\">\n        <h5 class=\"text-bold-400 text-uppercase\">آرامش</h5>\n        <div class=\"row\">\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-roxy\">\n              <img src=\"assets/img/gallery/15.jpg\" alt=\"img15\" />\n              <figcaption>\n                <h2>سکوت\n                  <span>آرامش</span>\n                </h2>\n                <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم</p>\n                <a>دیدن بیشتر</a>\n              </figcaption>\n            </figure>\n          </div>\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-roxy\">\n              <img src=\"assets/img/gallery/1.jpg\" alt=\"img01\" />\n              <figcaption>\n                <h2>سکوت\n                  <span>آرامش</span>\n                </h2>\n                <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم</p>\n                <a>دیدن بیشتر</a>\n              </figcaption>\n            </figure>\n          </div>\n        </div>\n      </div>\n      <div class=\"grid-hover\">\n        <h5 class=\"text-bold-400 text-uppercase\">طبیعت</h5>\n        <div class=\"row\">\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-bubba\">\n              <img src=\"assets/img/gallery/2.jpg\" alt=\"img02\" />\n              <figcaption>\n                <h2>بکر\n                  <span>طبیعت</span>\n                </h2>\n                <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم</p>\n                <a>دیدن بیشتر</a>\n              </figcaption>\n            </figure>\n          </div>\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-bubba\">\n              <img src=\"assets/img/gallery/16.jpg\" alt=\"img16\" />\n              <figcaption>\n                <h2>بکر\n                  <span>طبیعت</span>\n                </h2>\n                <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم</p>\n                <a>دیدن بیشتر</a>\n              </figcaption>\n            </figure>\n          </div>\n        </div>\n      </div>\n      <div class=\"grid-hover\">\n        <h5 class=\"text-bold-400 text-uppercase\">ابزار</h5>\n        <div class=\"row\">\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-romeo\">\n              <img src=\"assets/img/gallery/17.jpg\" alt=\"img17\" />\n              <figcaption>\n                <h2>کاربردی\n                  <span>ابزار</span>\n                </h2>\n                <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم</p>\n                <a>دیدن بیشتر</a>\n              </figcaption>\n            </figure>\n          </div>\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-romeo\">\n              <img src=\"assets/img/gallery/18.jpg\" alt=\"img18\" />\n              <figcaption>\n                <h2>کاربردی\n                  <span>ابزار</span>\n                </h2>\n                <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم</p>\n                <a>دیدن بیشتر</a>\n              </figcaption>\n            </figure>\n          </div>\n        </div>\n      </div>\n      <div class=\"grid-hover\">\n        <h5 class=\"text-bold-400 text-uppercase\">دکور</h5>\n        <div class=\"row\">\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-dexter\">\n              <img src=\"assets/img/gallery/19.jpg\" alt=\"img19\" />\n              <figcaption>\n                <h2>عالی\n                  <span>دکور</span>\n                </h2>\n                <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم\n                </p>\n                <a>دیدن بیشتر</a>\n              </figcaption>\n            </figure>\n          </div>\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-dexter\">\n              <img src=\"assets/img/gallery/12.jpg\" alt=\"img12\" />\n              <figcaption>\n                <h2>عالی\n                  <span>دکور</span>\n                </h2>\n                <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم\n                </p>\n                <a>دیدن بیشتر</a>\n              </figcaption>\n            </figure>\n          </div>\n        </div>\n      </div>\n      <div class=\"grid-hover\">\n        <h5 class=\"text-bold-400 text-uppercase\">زمان</h5>\n        <div class=\"row\">\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-sarah\">\n              <img src=\"assets/img/gallery/13.jpg\" alt=\"img13\" />\n              <figcaption>\n                <h2>عالی\n                  <span>زمان</span>\n                </h2>\n                <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم</p>\n                <a>دیدن بیشتر</a>\n              </figcaption>\n            </figure>\n          </div>\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-sarah\">\n              <img src=\"assets/img/gallery/20.jpg\" alt=\"img20\" />\n              <figcaption>\n                <h2>عالی\n                  <span>زمان</span>\n                </h2>\n                <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم</p>\n                <a>دیدن بیشتر</a>\n              </figcaption>\n            </figure>\n          </div>\n        </div>\n      </div>\n      <div class=\"grid-hover\">\n        <h5 class=\"text-bold-400 text-uppercase\">متن</h5>\n        <div class=\"row\">\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-chico\">\n              <img src=\"assets/img/gallery/15.jpg\" alt=\"img15\" />\n              <figcaption>\n                <h2>کلاسیک\n                  <span>متن</span>\n                </h2>\n                <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم</p>\n                <a>دیدن بیشتر</a>\n              </figcaption>\n            </figure>\n          </div>\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-chico\">\n              <img src=\"assets/img/gallery/4.jpg\" alt=\"img04\" />\n              <figcaption>\n                <h2>کلاسیک\n                  <span>متن</span>\n                </h2>\n                <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم</p>\n                <a>دیدن بیشتر</a>\n              </figcaption>\n            </figure>\n          </div>\n        </div>\n      </div>\n      <div class=\"grid-hover\">\n        <h5 class=\"text-bold-400 text-uppercase\">روزنامه</h5>\n        <div class=\"row\">\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-milo\">\n              <img src=\"assets/img/gallery/11.jpg\" alt=\"img11\" />\n              <figcaption>\n                <h2>به روز\n                  <span>روزنامه</span>\n                </h2>\n                <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم\n                </p>\n                <a>دیدن بیشتر</a>\n              </figcaption>\n            </figure>\n          </div>\n          <div class=\"col-md-6 col-12\">\n            <figure class=\"effect-milo\">\n              <img src=\"assets/img/gallery/3.jpg\" alt=\"img03\" />\n              <figcaption>\n                <h2>به روز\n                  <span>روزنامه</span>\n                </h2>\n                <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم\n                </p>\n                <a>دیدن بیشتر</a>\n              </figcaption>\n            </figure>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</section>\n<!--Gallery Hover Effect Starts-->\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/pages/full-pages/invoice/invoice-page.component.html":
/*!************************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/pages/full-pages/invoice/invoice-page.component.html ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--Invoice template starts-->\n<div class=\"row\">\n  <div class=\"col-md-12\">\n    <h4>صورتحساب</h4>\n  </div>\n</div>\n<section class=\"invoice-template\">\n  <div class=\"card\">\n    <div class=\"card-body p-3\">\n      <div id=\"invoice-template\" class=\"card-block\">\n        <!-- Invoice Company Details -->\n        <div id=\"invoice-company-details\" class=\"row\">\n          <div class=\"col-md-6 col-sm-12 text-center text-md-left\">\n            <img src=\"assets/img/logos/logo-big-black.png\" alt=\"company logo\" class=\"mb-2\" width=\"80\" height=\"80\">\n            <ul class=\"px-0 list-unstyled\">\n              <li class=\"text-bold-800\">استدیو ضبط صدا</li>\n              <li>خیابان 57</li>\n              <li>میدان ولیعصر،</li>\n              <li>تهران،</li>\n              <li>ایران</li>\n            </ul>\n          </div>\n          <div class=\"col-md-6 col-sm-12 text-center text-md-right\">\n            <h2>صورتحساب</h2>\n            <p class=\"pb-3\"># INV-001001</p>\n            <ul class=\"px-0 list-unstyled\">\n              <li>تعادل</li>\n              <li class=\"lead text-bold-800\">1200000 ریال</li>\n            </ul>\n          </div>\n        </div>\n        <!--/ Invoice Company Details -->\n        <!-- Invoice Customer Details -->\n        <div id=\"invoice-customer-details\" class=\"row pt-2\">\n          <div class=\"col-sm-12 text-left\">\n            <p class=\"text-muted\">به</p>\n          </div>\n          <div class=\"col-md-6 col-sm-12  text-center text-md-left\">\n            <ul class=\"px-0 list-unstyled\">\n              <li class=\"text-bold-800\">آقای احمد رضایی</li>\n              <li>کوچه 45،</li>\n              <li>خیابان اقاقیا،</li>\n              <li>تهران،</li>\n            </ul>\n          </div>\n          <div class=\"col-md-6 col-sm-12 text-center text-md-right\">\n            <p><span class=\"text-muted\">تاریخ صورتحساب :</span> 08/12/97</p>\n            <p><span class=\"text-muted\">مقررات :</span> بر اساس رسید</p>\n            <p><span class=\"text-muted\">تاریخ تحویل :</span> 10/12/97</p>\n          </div>\n        </div>\n        <!--/ Invoice Customer Details -->\n        <!-- Invoice Items Details -->\n        <div id=\"invoice-items-details\" class=\"pt-2\">\n          <div class=\"row\">\n            <div class=\"table-responsive col-sm-12\">\n              <table class=\"table\">\n                <thead>\n                  <tr>\n                    <th>#</th>\n                    <th>مورد و شرح</th>\n                    <th class=\"text-right\">نرخ</th>\n                    <th class=\"text-right\">ساعت ها</th>\n                    <th class=\"text-right\">میزان</th>\n                  </tr>\n                </thead>\n                <tbody>\n                  <tr>\n                    <th scope=\"row\">1</th>\n                    <td>\n                      <p>ایجاد فایل فتوشاپ برای نرم افزار اندروید</p>\n                      <p class=\"text-muted\">لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم</p>\n                    </td>\n                    <td class=\"text-right\">20000 ریال/ ساعت</td>\n                    <td class=\"text-right\">120</td>\n                    <td class=\"text-right\">20000 ریال</td>\n                  </tr>\n                  <tr>\n                    <th scope=\"row\">2</th>\n                    <td>\n                      <p>برنامه توسعه iOS</p>\n                      <p class=\"text-muted\">لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم </p>\n                    </td>\n                    <td class=\"text-right\">20000 ریال/ ساعت</td>\n                    <td class=\"text-right\">120</td>\n                    <td class=\"text-right\">20000 ریال</td>\n                  </tr>\n                  <tr>\n                    <th scope=\"row\">3</th>\n                    <td>\n                      <p>توسعه قالب وردپرس</p>\n                      <p class=\"text-muted\">لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم </p>\n                    </td>\n                    <td class=\"text-right\">20000 ریال/ ساعت</td>\n                    <td class=\"text-right\">120</td>\n                    <td class=\"text-right\">20000 ریال</td>\n                  </tr>\n                </tbody>\n              </table>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-md-6 col-sm-12 text-left\">\n              <p class=\"lead\">روش های پرداخت:</p>\n              <div class=\"row\">\n                <div class=\"col-12\">\n                  <table class=\"table table-borderless table-sm\">\n                    <tbody>\n                      <tr>\n                        <td>نام بانک:</td>\n                        <td class=\"text-right\">ایران، بانک ملت</td>\n                      </tr>\n                      <tr>\n                        <td>نام اصلی:</td>\n                        <td class=\"text-right\">علی زمانی</td>\n                      </tr>\n                      <tr>\n                        <td>شماره کارت:</td>\n                        <td class=\"text-right\">FGS165461646546AA</td>\n                      </tr>\n                      <tr>\n                        <td>شماره حساب:</td>\n                        <td class=\"text-right\">BTNPP34</td>\n                      </tr>\n                    </tbody>\n                  </table>\n                </div>\n              </div>\n            </div>\n            <div class=\"col-md-6 col-sm-12\">\n              <p class=\"lead\">مجموع به دلیل</p>\n              <div class=\"table-responsive\">\n                <table class=\"table\">\n                  <tbody>\n                    <tr>\n                      <td>زیر مجموع</td>\n                      <td class=\"text-right\">120000 ریال</td>\n                    </tr>\n                    <tr>\n                      <td>مالیات بر ارزش افزوده (12٪)</td>\n                      <td class=\"text-right\">70000 ریال</td>\n                    </tr>\n                    <tr>\n                      <td class=\"text-bold-800\">جمع کل</td>\n                      <td class=\"text-bold-800 text-right\"> 10000000 ریال</td>\n                    </tr>\n                    <tr>\n                      <td>پرداخت انجام شده</td>\n                      <td class=\"pink text-right\">(-) 1000 ریال</td>\n                    </tr>\n                    <tr class=\"bg-grey bg-lighten-4\">\n                      <td class=\"text-bold-800\">تخفیف</td>\n                      <td class=\"text-bold-800 text-right\">120000 ریال</td>\n                    </tr>\n                  </tbody>\n                </table>\n              </div>\n              <div class=\"text-center\">\n                <p>فرد مجاز</p>\n                <img src=\"assets/img/pages/signature-scan.png\" alt=\"signature\" class=\"width-250\">\n                <h6>علی زمانی</h6>\n                <p class=\"text-muted\">مدیر عامل</p>\n              </div>\n            </div>\n          </div>\n        </div>\n        <!-- Invoice Footer -->\n        <div id=\"invoice-footer\">\n          <div class=\"row\">\n            <div class=\"col-md-9 col-sm-12\">\n              <h6>شرایط و وضعیت</h6>\n              <p>\n                  لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. \n              </p>\n            </div>\n            <div class=\"col-md-3 col-sm-12 text-center\">\n              <button type=\"button\" class=\"btn btn-primary btn-raised my-1\"><i class=\"fa fa-paper-plane-o\"></i> \n              ارسال صورت حساب\n              </button>\n            </div>\n          </div>\n        </div>\n        <!--/ Invoice Footer -->\n      </div>\n    </div>\n  </div>\n</section>\n<!--Invoice template ends-->\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/pages/full-pages/knowledge-base/knowledge-base.component.html":
/*!*********************************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/pages/full-pages/knowledge-base/knowledge-base.component.html ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\n  <div class=\"col-sm-12\">\n    <div class=\"content-header\">دانش محور </div>\n    <p class=\"content-sub-header\"></p>\n  </div>\n</div>\n<!-- Apex template Knowledge Base starts -->\n<section id=\"kb\">\n  <div class=\"row\">\n    <div class=\"col-xl-4 col-lg-12\">\n      <div class=\"card\">\n        <div class=\"card-header\">\n          <i class=\"ft-bell font-large-1 float-left mr-2\"></i>\n          <h4 class=\"card-title mb-0\">شروع شدن</h4>\n          <p class=\"card-text\">لورم ایپسوم</p>\n        </div>\n        <div class=\"card-content\">\n          <div class=\"card-body\">\n            <ul class=\"list-group\">\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'Activating an Account and Logging in')\">\n                <span class=\"badge bg-primary float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span> فعال کردن یک حساب کاربری\n              </li>\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'User Profile')\">\n                <span class=\"badge bg-primary float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span>مشخصات کاربر\n              </li>\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'Using the Dashboard')\">\n                <span class=\"badge bg-primary float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span> با استفاده از داشبورد\n              </li>\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'Subscribing to Email Alerts')\">\n                <span class=\"badge bg-primary float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span> اشتراک در هشدارهای ایمیل\n              </li>\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'Changing a Password')\">\n                <span class=\"badge bg-primary float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span>تغییر رمز عبور\n              </li>\n            </ul>\n          </div>\n        </div>\n        <div class=\"card-footer\">\n          <a class=\"card-link primary\">مشاهده تمام مقالات (20) </a>\n        </div>\n      </div>\n    </div>\n    <div class=\"col-xl-4 col-lg-12\">\n      <div class=\"card\">\n        <div class=\"card-header\">\n          <i class=\"ft-book font-large-1 float-left mr-2\"></i>\n          <h4 class=\"card-title\">راهنمای استفاده</h4>\n          <p class=\"card-text\">لورم ایپسوم</p>\n        </div>\n        <div class=\"card-content\">\n          <div class=\"card-body\">\n            <ul class=\"list-group\">\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'Files Overview')\">\n                <span class=\"badge bg-warning float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span> مرور فایلها\n\n              </li>\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'Search Overview')\">\n                <span class=\"badge bg-warning float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span> مرور اجمالی\n              </li>\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'Using Tasks')\">\n                <span class=\"badge bg-warning float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span> با استفاده از وظایف\n              </li>\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'Events')\">\n                <span class=\"badge bg-warning float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span> رویداد\n              </li>\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'Blogs')\">\n                <span class=\"badge bg-warning float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span> وبلاگ\n              </li>\n            </ul>\n          </div>\n        </div>\n        <div class=\"card-footer\">\n          <a class=\"card-link primary\">مشاهده تمام مقالات (13)            </a>\n        </div>\n      </div>\n    </div>\n    <div class=\"col-xl-4 col-lg-12\">\n      <div class=\"card\">\n        <div class=\"card-header\">\n          <i class=\"ft-file-text text-white font-large-1 float-left mr-2\"></i>\n          <h4 class=\"card-title\">فایل ها</h4>\n          <p class=\"card-text\">لورم ایپسوم</p>\n        </div>\n        <div class=\"card-content\">\n          <div class=\"card-body\">\n            <ul class=\"list-group\">\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'Basic Files Module Features')\">\n                <span class=\"badge bg-info float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span> ویژگی های اصلی ماژول\n              </li>\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'How to Add a Single File')\">\n                <span class=\"badge bg-info float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span>نحوه اضافه کردن یک فایل تک\n              </li>\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'Drag-and-Drop upload files and folders')\">\n                <span class=\"badge bg-info float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span> کشیدن و انداختن\n              </li>\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'Searching Files')\">\n                <span class=\"badge bg-info float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span>جستجو فایل ها\n              </li>\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'Digital Rights Management')\">\n                <span class=\"badge bg-info float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span> مدیریت حقوق دیجیتال\n              </li>\n            </ul>\n          </div>\n        </div>\n        <div class=\"card-footer\">\n          <a class=\"card-link primary\">مشاهده تمام مقالات (7)            </a>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-xl-4 col-lg-12\">\n      <div class=\"card\">\n        <div class=\"card-header\">\n          <i class=\"ft-user font-large-1 float-left mr-2\"></i>\n          <h4 class=\"card-title\">مدیریت کاربران</h4>\n          <p class=\"card-text\">لورم ایپسوم</p>\n        </div>\n        <div class=\"card-content\">\n          <div class=\"card-body\">\n            <ul class=\"list-group\">\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'Inviting and Managing Users')\">\n                <span class=\"badge bg-success float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span> دعوت و مدیریت کاربران\n              </li>\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'Creating and Managing Groups')\">\n                <span class=\"badge bg-success float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span> ایجاد و مدیریت گروه ها\n              </li>\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'Granting Roles')\">\n                <span class=\"badge bg-success float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span> اعطای نقش\n              </li>\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'Quick Guide: Organizing Security Groups')\">\n                <span class=\"badge bg-success float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span>راهنمای سریع: گروه ها\n              </li>\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'What to Do if a User is Unable to Login')\">\n                <span class=\"badge bg-success float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span> برای \"ورد\" وارد شوید\n              </li>\n            </ul>\n          </div>\n        </div>\n        <div class=\"card-footer\">\n          <a class=\"card-link primary\">مشاهده تمام مقالات (11)</a>\n        </div>\n      </div>\n    </div>\n    <div class=\"col-xl-4 col-lg-12\">\n      <div class=\"card\">\n        <div class=\"card-header\">\n          <i class=\"ft-unlock font-large-1 float-left mr-2\"></i>\n          <h4 class=\"card-title\">مدیریت سایت</h4>\n          <p class=\"card-text\">لورم ایپسوم</p>\n        </div>\n        <div class=\"card-content\">\n          <div class=\"card-body\">\n            <ul class=\"list-group\">\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'Introduction to the Site Admin Module')\">\n                <span class=\"badge bg-danger float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span> معرفی ماژول\n              </li>\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'How to Create a Virtual Deal Room')\">\n                <span class=\"badge bg-danger float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span> چگونه یک اتاق مجازی ایجاد کنیم\n              </li>\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'Best Practices for Setting up a New Site')\">\n                <span class=\"badge bg-danger float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span> بهترین روش برای سایت جدید\n              </li>\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'General Settings')\">\n                <span class=\"badge bg-danger float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span> تنظیمات عمومی\n              </li>\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'Advanced Settings')\">\n                <span class=\"badge bg-danger float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span> تنظیمات پیشرفته\n              </li>\n            </ul>\n          </div>\n        </div>\n        <div class=\"card-footer\">\n          <a class=\"card-link primary\">مشاهده تمام مقالات (21) </a>\n        </div>\n      </div>\n    </div>\n    <div class=\"col-xl-4 col-lg-12\">\n      <div class=\"card\">\n        <div class=\"card-header\">\n          <i class=\"ft-airplay font-large-1 float-left mr-2\"></i>\n          <h4 class=\"card-title\">مدیریت سیستم            </h4>\n          <p class=\"card-text\">لورم ایپسوم</p>\n        </div>\n        <div class=\"card-content\">\n          <div class=\"card-body\">\n            <ul class=\"list-group\">\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'System Administration Overview')\">\n                <span class=\"badge bg-primary float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span>بررسی اجمالی\n              </li>\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'Creating Sites')\">\n                <span class=\"badge bg-primary float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span> ایجاد سایت ها\n              </li>\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'User Administration')\">\n                <span class=\"badge bg-primary float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span>مدیریت کاربر\n              </li>\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'Org Administration')\">\n                <span class=\"badge bg-primary float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span> اداره سازمان\n              </li>\n              <li class=\"list-group-item cursor-pointer\" (click)=\"GetDetails(content, 'Site Category System Settings')\">\n                <span class=\"badge bg-primary float-left mr-2\">\n                  <i class=\"ft-file-text text-white\"></i>\n                </span> تنظیمات سیستم رده سایت\n              </li>\n            </ul>\n          </div>\n        </div>\n        <div class=\"card-footer\">\n          <a class=\"card-link primary\">مشاهده تمام مقالات (17)            </a>\n        </div>\n      </div>\n    </div>\n  </div>\n  <!-- Apex template Knowledge Base Ends -->\n\n  <ng-template #content let-c=\"close\" let-d=\"dismiss\">\n    <div class=\"modal-header bg-info\">\n      <h4 class=\"modal-title white\">{{title}}</h4>\n      <button type=\"button\" class=\"close white\" aria-label=\"Close\" (click)=\"d('Cross click')\">\n        <span aria-hidden=\"true\">&times;</span>\n      </button>\n    </div>\n    <div class=\"modal-body\" id=\"kbModal-body\">\n      <p class=\"text-bold-500\">لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم </p>\n      <p>از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.</p>\n      \n      <p class=\"text-bold-500\">لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم </p>\n      <p>از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.</p>\n      \n      <p class=\"text-bold-500\">لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم </p>\n      <p>از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.</p>\n      \n    </div>\n    <div class=\"modal-footer\">\n      <button type=\"button\" class=\"btn btn-info btn-raised\" (click)=\"c('Close click')\">بستن</button>\n    </div>\n  </ng-template>\n\n</section>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/pages/full-pages/search/search.component.html":
/*!*****************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/pages/full-pages/search/search.component.html ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- Search form-->\n<section id=\"search-website\" class=\"card overflow-hidden\">\n\t<div class=\"card-header\">\n\t\t<h4 class=\"card-title\">نتایج جستجوی وب سایت</h4>\n\n\t</div>\n\t<div class=\"card-content\">\n\t\t<div class=\"card-body pb-0\">\n\t\t\t<form action=\"#\">\n\t\t\t\t<fieldset class=\"form-group position-relative has-icon-right mb-0\">\n\t\t\t\t\t<input type=\"text\" class=\"form-control form-control-lg \" id=\"iconLeft\" placeholder=\"قالب ادمین\">\n\t\t\t\t\t<div class=\"form-control-position\">\n\t\t\t\t\t\t<i class=\"ft-mic font-medium-4\"></i>\n\t\t\t\t\t</div>\n\t\t\t\t</fieldset>\n\t\t\t</form>\n\t\t</div>\n\t\t<!--Search Navbar-->\n\t\t<div id=\"search-nav\" class=\"card-body\">\n\t\t\t<ul class=\"nav nav-inline\">\n\t\t\t\t<li class=\"nav-item\">\n\t\t\t\t\t<a class=\"nav-link active\"><i class=\"fa fa-link\"></i> سایت</a>\n\t\t\t\t</li>\n\t\t\t\t<li class=\"nav-item\">\n\t\t\t\t\t<a class=\"nav-link\"><i class=\"fa fa-file-image-o\"></i> عکس</a>\n\t\t\t\t</li>\n\t\t\t\t<li class=\"nav-item\">\n\t\t\t\t\t<a class=\"nav-link\"><i class=\"fa fa-file-video-o\"></i> فیلم</a>\n\t\t\t\t</li>\n\t\t\t\t<li class=\"nav-item\">\n\t\t\t\t\t<a class=\"nav-link\"><i class=\"fa fa-map-o\"></i> نقشه</a>\n\t\t\t\t</li>\n\t\t\t\t<li class=\"dropdown nav-item float-right mt-1\">\n\t\t\t\t\t<a class=\"btn dropdown-toggle\" data-toggle=\"dropdown\">\n\t\t\t\t\t\t<i class=\"fa fa-cog\"></i> <span class=\"caret\"></span>\n\t\t\t\t\t</a>\n\t\t\t\t\t<ul class=\"dropdown-menu dropdown-menu-right\">\n\t\t\t\t\t\t<li class=\"dropdown-item\"><a class=\"dropdown-link\">زبان</a></li>\n\t\t\t\t\t\t<li class=\"dropdown-item\"><a class=\"dropdown-link\">تنظیمات جستجو</a></li>\n\t\t\t\t\t\t<li class=\"dropdown-item\"><a class=\"dropdown-link\">تاریخچه</a></li>\n\t\t\t\t\t\t<li class=\"dropdown-item\"><a class=\"dropdown-link\">راهنما جستجو</a></li>\n\t\t\t\t\t</ul>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t</div>\n\t\t<!--/ Search Navbar-->\n\t\t<!--Search Result-->\n\t\t<div id=\"search-results\" class=\"card-body\">\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-lg-8\">\n\t\t\t\t\t<p class=\"text-muted font-small-3\">حدود 2000000 نتیجه (در 0.2 ثانیه) </p>\n\t\t\t\t\t<ul class=\"media-list row\">\n\t\t\t\t\t\t<!--search with list-->\n\t\t\t\t\t\t<li class=\"media\">\n\t\t\t\t\t\t\t<div class=\"media-body\">\n\t\t\t\t\t\t\t\t<p class=\"lead mb-0\"><a><span class=\"text-bold-600\">Apex</span> - ریسپانسیو قالب </a></p>\n\t\t\t\t\t\t\t\t<p class=\"mb-0\"><a class=\"teal darken-1\">https://pixinvent.com/<span class=\"text-bold-600\">Apex</span>/\n\t\t\t\t\t\t\t\t\t\t<i class=\"fa fa-angle-down\" aria-hidden=\"true\"></i></a></p>\n\t\t\t\t\t\t\t\t<ul class=\"list-inline list-inline-pipe text-muted\">\n\t\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\t<i class=\"fa fa-star yellow darken-2\"></i>\n\t\t\t\t\t\t\t\t\t\t<i class=\"fa fa-star yellow darken-2\"></i>\n\t\t\t\t\t\t\t\t\t\t<i class=\"fa fa-star yellow darken-2\"></i>\n\t\t\t\t\t\t\t\t\t\t<i class=\"fa fa-star yellow darken-2\"></i>\n\t\t\t\t\t\t\t\t\t\t<i class=\"fa fa-star yellow darken-2\"></i> &nbsp;5 ستاره\n\t\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t\t<li>590 نظر</li>\n\t\t\t\t\t\t\t\t\t<li>2000 ریال</li>\n\t\t\t\t\t\t\t\t\t<li>در انبار</li>\n\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t<p><span class=\"text-muted\">24 آبان 1397 - </span><span class=\"text-bold-600\">Apex</span> لورم ایپسوم\n\t\t\t\t\t\t\t\t\tمتن ساختگی با تولید سادگی نامفهوم<span class=\"text-bold-600\">لورم ایپسوم</span> چاپگرها و متون بلکه\n\t\t\t\t\t\t\t\t\tروزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع\n\t\t\t\t\t\t\t\t\tبا هدف بهبود ابزارهای کاربردی می باشد. </p>\n\t\t\t\t\t\t\t\t<div class=\"website-detailed-list mx-1 my-1\">\n\t\t\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-6\">\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"content-group\">\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"media-body\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<p class=\"mb-0\"><a class=\"teal darken-1\">داشبور</a></p>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم</p>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"content-group\">\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"media-body\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<p class=\"mb-0\"><a class=\"teal darken-1\">جزء فرم</a></p>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<p>زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی </p>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"content-group\">\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"media-body\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<p class=\"mb-0\"><a class=\"teal darken-1\">نمودار</a></p>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<p>دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد</p>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-6\">\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"content-group\">\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"media-body\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<p class=\"mb-0\"><a class=\"teal darken-1\">قطعات طراحی</a></p>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم</p>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"content-group\">\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"media-body\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<p class=\"mb-0\"><a class=\"teal darken-1\">پشتیبانی</a></p>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<p>چاپگرها و متون روزنامه و مجله در ستون و سطرآنچنان که لازم است</p>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"content-group\">\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"media-body\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<p class=\"mb-0\"><a class=\"teal darken-1\">مستندات</a></p>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم</p>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<!--search with image-->\n\t\t\t\t\t\t<li class=\"media flex-column\">\n\t\t\t\t\t\t\t<div class=\"media-left\">\n\t\t\t\t\t\t\t\t<a>\n\t\t\t\t\t\t\t\t\t<img class=\"media-object width-150\" src=\"assets/img/width-600/portfolio-14.jpg\"\n\t\t\t\t\t\t\t\t\t\talt=\"Generic placeholder image\">\n\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"media-body media-search\">\n\t\t\t\t\t\t\t\t<p class=\"lead mb-0\"><a class=\"teal darken-1\"><span class=\"text-bold-600\">سارا محمدی</span> - سریع به من\n\t\t\t\t\t\t\t\t\t\tایمیل بزن</a></p>\n\t\t\t\t\t\t\t\t<p class=\"mb-0\"><a class=\"teal darken-1\">https://pixinvent.com/<span class=\"text-bold-600\">Apex</span>/\n\t\t\t\t\t\t\t\t\t\t<i class=\"fa fa-angle-down\" aria-hidden=\"true\"></i></a></p>\n\t\t\t\t\t\t\t\t<ul class=\"list-inline list-inline-pipe text-muted\">\n\t\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\t<i class=\"fa fa-star yellow darken-2\"></i>\n\t\t\t\t\t\t\t\t\t\t<i class=\"fa fa-star yellow darken-2\"></i>\n\t\t\t\t\t\t\t\t\t\t<i class=\"fa fa-star yellow darken-2\"></i>\n\t\t\t\t\t\t\t\t\t\t<i class=\"fa fa-star yellow darken-2\"></i>\n\t\t\t\t\t\t\t\t\t\t<i class=\"fa fa-star-half yellow darken-2\"></i> &nbsp;4.5 ستاره\n\t\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t\t<li>50 نظر</li>\n\t\t\t\t\t\t\t\t\t<li>40000 ریال</li>\n\t\t\t\t\t\t\t\t\t<li>در انبار</li>\n\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t<p><span class=\"text-muted\">25 مرداد 1396 - </span> ما باید گفتگو کنیم <span class=\"text-bold-600\">Apex\n\t\t\t\t\t\t\t\t\t\tادمین</span> لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک\n\t\t\t\t\t\t\t\t\tاست. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی\n\t\t\t\t\t\t\t\t\tمورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد\n\t\t\t\t\t\t\t\t\tگذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای\n\t\t\t\t\t\t\t\t\tطراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.</p>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<!--search with video-->\n\t\t\t\t\t\t<li class=\"media flex-column\">\n\t\t\t\t\t\t\t<div class=\"media-left media-search\">\n\t\t\t\t\t\t\t\t<iframe width=\"150\" height=\"110\"\n\t\t\t\t\t\t\t\t\tsrc=\"https://www.youtube.com/embed/SsE5U7ta9Lw?rel=0&amp;controls=0&amp;showinfo=0\"></iframe>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"media-body\">\n\t\t\t\t\t\t\t\t<p class=\"lead mb-0\"><a class=\"teal darken-1\"><span class=\"text-bold-600\">جدول</span> - اطلاعات شما و\n\t\t\t\t\t\t\t\t\t\tکارهای شما</a></p>\n\t\t\t\t\t\t\t\t<p class=\"mb-0\"><a class=\"teal darken-1\">http://youtube.com/<span class=\"text-bold-600\">Apex</span>/ <i\n\t\t\t\t\t\t\t\t\t\t\tclass=\"fa fa-angle-down\" aria-hidden=\"true\"></i></a></p>\n\t\t\t\t\t\t\t\t<ul class=\"list-inline list-inline-pipe text-muted\">\n\t\t\t\t\t\t\t\t\t<li>23 تیر 1308</li>\n\t\t\t\t\t\t\t\t\t<li>1 میلیون بازدید</li>\n\t\t\t\t\t\t\t\t\t<li>آپلود شده توسط سارا عزیزی</li>\n\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t<p><span class=\"text-bold-600\">لورم ایپسوم</span> متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با\n\t\t\t\t\t\t\t\t\tاستفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و\n\t\t\t\t\t\t\t\t\tبرای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.\n\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li class=\"media\">\n\t\t\t\t\t\t\t<div class=\"media-body\">\n\t\t\t\t\t\t\t\t<p class=\"lead mb-0\"><a class=\"teal darken-1\"><span class=\"text-bold-600\">کتاب</span> - زیادی در شصت و\n\t\t\t\t\t\t\t\t\t\tسه درصد</a></p>\n\t\t\t\t\t\t\t\t<p class=\"mb-0\"><a class=\"teal darken-1\">http://themeforest.net/<span\n\t\t\t\t\t\t\t\t\t\t\tclass=\"text-bold-600\">Apex</span>/کتاب\n\t\t\t\t\t\t\t\t\t\t<i class=\"fa fa-angle-down\" aria-hidden=\"true\"></i></a></p>\n\t\t\t\t\t\t\t\t<p> <span class=\"text-bold-600\">گذشته، حال و آینده</span>\n\t\t\t\t\t\t\t\t\t\tشناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی\n\t\t\t\t\t\t\t\t\t\tالخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و\n\t\t\t\t\t\t\t\t\t\tدشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی\n\t\t\t\t\t\t\t\t\t\tدستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.\n\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li class=\"media\">\n\t\t\t\t\t\t\t<div class=\"media-body\">\n\t\t\t\t\t\t\t\t<p class=\"lead mb-0\"><a class=\"teal darken-1\">لورم ایپسوم متن<span class=\"text-bold-600\">ساختگی </span>,\n\t\t\t\t\t\t\t\t\t\tتولید سادگی</a>\n\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t<p class=\"mb-0\"><a class=\"teal darken-1\">http://envato.com/literally/<span\n\t\t\t\t\t\t\t\t\t\t\tclass=\"text-bold-600\">Apex</span>/\n\t\t\t\t\t\t\t\t\t\t<i class=\"fa fa-angle-down\" aria-hidden=\"true\"></i></a></p>\n\t\t\t\t\t\t\t\t<p><span class=\"text-muted\">30 مهر 1398 - </span><span class=\"text-bold-600\">تهران</span> لورم ایپسوم\n\t\t\t\t\t\t\t\t\tمتن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه\n\t\t\t\t\t\t\t\t\tروزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع\n\t\t\t\t\t\t\t\t\tبا هدف بهبود ابزارهای کاربردی می باشد.\n\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li class=\"media\">\n\t\t\t\t\t\t\t<div class=\"media-body\">\n\t\t\t\t\t\t\t\t<p class=\"lead mb-0\"><a class=\"teal darken-1\"><span class=\"text-bold-600\">کلمه</span> - با جزئیات\n\t\t\t\t\t\t\t\t\t\tدقیق</a></p>\n\t\t\t\t\t\t\t\t<p class=\"mb-0\"><a class=\"teal darken-1\">http://google.com/<span class=\"text-bold-600\">کلمه</span>/ <i\n\t\t\t\t\t\t\t\t\t\t\tclass=\"fa fa-angle-down\" aria-hidden=\"true\"></i></a></p>\n\t\t\t\t\t\t\t\t<ul class=\"list-inline list-inline-pipe text-muted\">\n\t\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\t<i class=\"fa fa-star yellow darken-2\"></i>\n\t\t\t\t\t\t\t\t\t\t<i class=\"fa fa-star yellow darken-2\"></i>\n\t\t\t\t\t\t\t\t\t\t<i class=\"fa fa-star-half yellow darken-2\"></i>\n\t\t\t\t\t\t\t\t\t\t<i class=\"fa fa-star-outline yellow darken-2\"></i>\n\t\t\t\t\t\t\t\t\t\t<i class=\"fa fa-star-outline yellow darken-2\"></i> &nbsp;2.5 ستاره\n\t\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t\t<li>590 نظر</li>\n\t\t\t\t\t\t\t\t\t<li>390000 ریال</li>\n\t\t\t\t\t\t\t\t\t<li>در انبار</li>\n\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t<p><span class=\"text-muted\">12 مهر 1398 - </span>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم\n\t\t\t\t\t\t\t\t\t<span class=\"text-bold-600\">از صنعت چاپ و با استفاده از طراحان</span> گرافیک است. چاپگرها و متون بلکه\n\t\t\t\t\t\t\t\t\tروزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع\n\t\t\t\t\t\t\t\t\tبا هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان\n\t\t\t\t\t\t\t\t\tجامعه و متخصصان را می طلبد\n\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li class=\"media\">\n\t\t\t\t\t\t\t<div class=\"media-body\">\n\t\t\t\t\t\t\t\t<p class=\"lead mb-0\"><a class=\"teal darken-1\"><span class=\"text-bold-600\">آن را اجرا کنید </span> - لورم\n\t\t\t\t\t\t\t\t\t\tایپسوم متن ساختگی</a></p>\n\t\t\t\t\t\t\t\t<p class=\"mb-0\"><a class=\"teal darken-1\">http://mail.example.com/<span\n\t\t\t\t\t\t\t\t\t\t\tclass=\"text-bold-600\">اجرا</span>/\n\t\t\t\t\t\t\t\t\t\t<i class=\"fa fa-angle-down\" aria-hidden=\"true\"></i></a></p>\n\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\tبا نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان\n\t\t\t\t\t\t\t\t\tفارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت\n\t\t\t\t\t\t\t\t\tتایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای\n\t\t\t\t\t\t\t\t\tموجود طراحی اساسا مورد استفاده قرار گیرد.\n\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ul>\n\t\t\t\t\t<div class=\"text-center\">\n\t\t\t\t\t\t<nav aria-label=\"Page navigation\">\n\t\t\t\t\t\t\t<ul class=\"pagination pagination-separate pagination-round pagination-flat\">\n\t\t\t\t\t\t\t\t<li class=\"page-item\">\n\t\t\t\t\t\t\t\t\t<a class=\"page-link\" aria-label=\"Previous\">\n\t\t\t\t\t\t\t\t\t\t<span aria-hidden=\"true\">« قبل</span>\n\t\t\t\t\t\t\t\t\t\t<span class=\"sr-only\">قبلی</span>\n\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li class=\"page-item\"><a class=\"page-link\">1</a></li>\n\t\t\t\t\t\t\t\t<li class=\"page-item\"><a class=\"page-link\">2</a></li>\n\t\t\t\t\t\t\t\t<li class=\"page-item active\"><a class=\"page-link\">3</a></li>\n\t\t\t\t\t\t\t\t<li class=\"page-item\"><a class=\"page-link\">4</a></li>\n\t\t\t\t\t\t\t\t<li class=\"page-item\"><a class=\"page-link\">5</a></li>\n\t\t\t\t\t\t\t\t<li class=\"page-item\">\n\t\t\t\t\t\t\t\t\t<a class=\"page-link\" aria-label=\"Next\">\n\t\t\t\t\t\t\t\t\t\t<span aria-hidden=\"true\">بعد »</span>\n\t\t\t\t\t\t\t\t\t\t<span class=\"sr-only\">بعدی</span>\n\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t</nav>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-lg-4\">\n\t\t\t\t\t<div class=\"card\">\n\t\t\t\t\t\t<div class=\"card-body\">\n\t\t\t\t\t\t\t<h4 class=\"card-title\">Apex</h4>\n\t\t\t\t\t\t\t<h6 class=\"card-subtitle text-muted\">Angular 5 قالب پروژه ی مدیریت با </h6>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<img class=\"img-fluid\" src=\"assets/img/width-600/portfolio-3.jpg\" alt=\"logo\">\n\t\t\t\t\t\t<div class=\"card-body\">\n\t\t\t\t\t\t\t<p class=\"card-text\">بعضی از نمونه های سریع نمونه ای که بر روی عنوان کارت ساخته می شوند و بخش عمده ای از\n\t\t\t\t\t\t\t\tمحتوای کارت را تشکیل می دهند.<a>ویکی پدیا</a></p>\n\t\t\t\t\t\t\t<ul class=\"list-group mb-2\">\n\t\t\t\t\t\t\t\t<li class=\"list-group-item\"><strong>سایت :</strong> <a class=\"card-link\">https://pixinvent.com/</a></li>\n\t\t\t\t\t\t\t\t<li class=\"list-group-item\"><strong>خدمات مشتری:</strong> 022 8888 9999</li>\n\t\t\t\t\t\t\t\t<li class=\"list-group-item\"><strong>پایه گذار:</strong> خانم کاظمی</li>\n\t\t\t\t\t\t\t\t<li class=\"list-group-item\"><strong>تأسیس شد:</strong> 1398</li>\n\t\t\t\t\t\t\t\t<li class=\"list-group-item\"><strong>پشتیبانی:</strong> <a>fKazemi5236@gmail.com</a></li>\n\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t<div class=\"py-1 text-center\">\n\t\t\t\t\t\t\t\t<a class=\"btn btn-social-icon mr-1 mb-1 btn-outline-facebook\"><span class=\"fa fa-facebook\"></span></a>\n\t\t\t\t\t\t\t\t<a class=\"btn btn-social-icon mr-1 mb-1 btn-outline-twitter\"><span class=\"fa fa-twitter\"></span></a>\n\t\t\t\t\t\t\t\t<a class=\"btn btn-social-icon mr-1 mb-1 btn-outline-linkedin\"><span\n\t\t\t\t\t\t\t\t\t\tclass=\"fa fa-linkedin font-medium-4\"></span></a>\n\t\t\t\t\t\t\t\t<a class=\"btn btn-social-icon mr-1 mb-1 btn-outline-github\"><span\n\t\t\t\t\t\t\t\t\t\tclass=\"fa fa-github font-medium-4\"></span></a>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"card-body\">\n\t\t\t\t\t\t\t<p class=\"text-bold-600\">موارد جستجوی دیگران</p>\n\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t<div class=\"col-md-4\">\n\t\t\t\t\t\t\t\t\t<img class=\"img-fluid rounded\" src=\"assets/img/gallery/11.jpg\" alt=\"Image description\">\n\t\t\t\t\t\t\t\t\t<a class=\"font-small-2\">شکلات</a>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"col-md-4\">\n\t\t\t\t\t\t\t\t\t<img class=\"img-fluid rounded\" src=\"assets/img/gallery/12.jpg\" alt=\"Image description\">\n\t\t\t\t\t\t\t\t\t<a class=\"font-small-2\">متریالز</a>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"col-md-4\">\n\t\t\t\t\t\t\t\t\t<img class=\"img-fluid rounded\" src=\"assets/img/gallery/13.jpg\" alt=\"Image description\">\n\t\t\t\t\t\t\t\t\t<a class=\"font-small-2\">HTML </a>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"col-md-4\">\n\t\t\t\t\t\t\t\t\t<img class=\"img-fluid rounded\" src=\"assets/img/gallery/14.jpg\" alt=\"Image description\">\n\t\t\t\t\t\t\t\t\t<a class=\"font-small-2\">شکلات</a>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"col-md-4\">\n\t\t\t\t\t\t\t\t\t<img class=\"img-fluid rounded\" src=\"assets/img/gallery/25.jpg\" alt=\"Image description\">\n\t\t\t\t\t\t\t\t\t<a class=\"font-small-2\">متریالز</a>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"col-md-4\">\n\t\t\t\t\t\t\t\t\t<img class=\"img-fluid rounded\" src=\"assets/img/gallery/23.jpg\" alt=\"Image description\">\n\t\t\t\t\t\t\t\t\t<a class=\"font-small-2\">HTML </a>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</section>\n<!--/ Search form -->"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/pages/full-pages/timeline/horizontal/component/horizontal-timeline.component.html":
/*!*****************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/pages/full-pages/timeline/horizontal/component/horizontal-timeline.component.html ***!
  \*****************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section class=\"cd-horizontal-timeline\" [ngClass]=\"{'loaded': loaded}\">\n  <div class=\"timeline\">\n    <div class=\"events-wrapper\">\n      <div class=\"events\" #eventsWrapper [style.width.px]=\"eventsWrapperWidth\">\n        <ol>\n          <li *ngFor=\"let item of timelineElements; let index = index\">\n            <a #timelineEvents href=\"#\" [ngClass]=\"{'selected': item.selected, 'older-event': index < selectedIndex}\"\n              (click)=\"onEventClick($event, item)\">{{item.date | date:dateFormatTop}}</a>\n            <span></span>\n          </li>\n        </ol>\n        <span class=\"filling-line\" aria-hidden=\"true\" #fillingLine></span>\n      </div>\n    </div>\n\n    <ul class=\"cd-timeline-navigation\">\n      <li>\n        <a href=\"#\" (click)=\"onScrollClick($event, false)\" class=\"prev\" [ngClass]=\"{'inactive':prevLinkInactive}\">قبلی</a>\n      </li>\n      <li>\n        <a href=\"#\" (click)=\"onScrollClick($event, true)\" class=\"next\" [ngClass]=\"{'inactive':nextLinkInactive}\">بعدی</a>\n      </li>\n    </ul>\n  </div>\n\n  <div class=\"events-content\" *ngIf=\"showContent\">\n    <ol>\n      <li *ngFor=\"let item of timelineElements; let index = index\" [@contentState]=\"item.selected ? 'active' : (index < selectedIndex ? 'left' : 'right')\">\n        <h2 class=\"text-bold-500\">{{item.title}}</h2>\n        <em>{{item.date | date:dateFormat}}</em>\n        <p>{{item.content}}</p>\n      </li>\n    </ol>\n  </div>\n</section>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/pages/full-pages/timeline/horizontal/horizontal-timeline-page.component.html":
/*!************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/pages/full-pages/timeline/horizontal/horizontal-timeline-page.component.html ***!
  \************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--Horizontal Timeline Starts-->\n<div class=\"row\">\n    <div class=\"col-sm-12\">\n        <div class=\"content-header\">گاهشمار افقی\t\t\t</div>\n        <p class=\"content-sub-header\">این جدول زمانی افقی حاوی جدول زمان بندی پست تاریخ است</p>\n    </div>\n</div>\n<div class=\"card\">\n\t<div class=\"card-content\">\n\t\t<div class=\"card-body\">\n\t\t\t<horizontal-timeline [timelineElements]=\"timeline\" [showContent]=\"true\"></horizontal-timeline>\n\t\t</div>\n\t</div>\n</div>\n<!--Horizontal Timeline Starts-->"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/pages/full-pages/timeline/vertical/vertical-timeline-page.component.html":
/*!********************************************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/pages/full-pages/timeline/vertical/vertical-timeline-page.component.html ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--Vertical Timeline Starts-->\n<section id=\"timeline\" class=\"timeline-center timeline-wrapper\">\n  <div class=\"row\">\n    <div class=\"col-sm-12\">\n      <div class=\"content-header\">گاهشمار عمودی</div>\n      <p class=\"content-sub-header\">این جدول زمانی عمودی حاوی پست با عکس ها، فیلم ها، نمودار ها و نقشه ها برای ایجاد جدول زمانی موثرتر است.</p>\n    </div>\n  </div>\n  <h3 class=\"page-title text-center\">گاهشمار</h3>\n  <ul class=\"timeline\">\n    <li class=\"timeline-line\"></li>\n    <li class=\"timeline-group\">\n      <a class=\"btn btn-raised btn-primary\"><i class=\"fa fa-calendar-o\"></i> امروز</a>\n    </li>\n  </ul>\n  <ul class=\"timeline\">\n    <li class=\"timeline-line\"></li>\n    <li class=\"timeline-item\">\n      <div class=\"timeline-badge\">\n        <span class=\"bg-red bg-lighten-1\" data-toggle=\"tooltip\" data-placement=\"right\" title=\"Portfolio project work\"><i class=\"fa fa-plane\"></i></span>\n      </div>\n      <div class=\"timeline-card card border-grey border-lighten-2\">\n        <div class=\"card-header\">\n          <h4 class=\"card-title mb-0\"><a>کار پروژه نمونه کارها</a></h4>\n          <div class=\"card-subtitle text-muted mt-0\">\n            <span class=\"font-small-3\">5 ساعت قبل</span>\n          </div>\n        </div>\n        <div class=\"card-content\">\n          <img class=\"img-fluid\" src=\"assets/img/photos/01.jpg\" alt=\"Timeline Image 1\">\n          <div class=\"card-content\">\n            <div class=\"card-body\">\n              <p class=\"card-text\">\n                لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. \n              </p>\n              <div class=\"list-inline mb-1\">\n                <span class=\"pr-1\"><a class=\"primary\"><span class=\"fa fa-thumbs-o-up\"></span> پسندیدن</a>\n                </span>\n                <span class=\"pr-1\"><a class=\"primary\"><span class=\"fa fa-commenting-o\"></span> نظرات</a>\n                </span>\n                <span><a class=\"primary\"><span class=\"fa fa-share-alt\"></span> اشتراک گذاری</a>\n                </span>\n              </div>\n            </div>\n          </div>\n          <div class=\"card-footer px-0 py-0\">\n            <div class=\"card-body \">\n              <div class=\"media\">\n                <div class=\"media-left\">\n                  <a>\n                      <span class=\"avatar avatar-online\"><img src=\"assets/img/portrait/small/avatar-s-1.png\" alt=\"avatar\" width=\"50\"></span>\n                    </a>\n                </div>\n                <div class=\"media-body\">\n                  <p class=\"text-bold-600 mb-0\"><a>علی رضایی</a></p>\n                  <p class=\"m-0\">لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. </p>\n                  <div class=\"list-inline mb-1\">\n                    <span class=\"pr-1\"><a class=\"primary\"><span class=\"fa fa-thumbs-o-up\"></span> پسندیدن</a>\n                    </span>\n                    <span class=\"pr-1\"><a class=\"primary\"><span class=\"fa fa-commenting-o\"></span> پاسخ</a>\n                    </span>\n                  </div>\n                  <div class=\"media\">\n                    <div class=\"media-left\">\n                      <a>\n                          <span class=\"avatar avatar-online\"><img src=\"assets/img/portrait/small/avatar-s-18.png\" alt=\"avatar\" width=\"50\"></span>\n                        </a>\n                    </div>\n                    <div class=\"media-body\">\n                      <p class=\"text-bold-600 mb-0\"><a>احمد محمدی</a></p>\n                      <p>زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود</p>\n                      <div class=\"list-inline mb-1\">\n                        <span class=\"pr-1\"><a class=\"primary\"><span class=\"fa fa-thumbs-o-up\"></span> پسندیدن</a>\n                        </span>\n                        <span class=\"pr-1\"><a class=\"primary\"><span class=\"fa fa-commenting-o\"></span> پاسخ</a>\n                        </span>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              </div>\n            </div>\n            <div class=\"card-body\">\n              <form>\n                <fieldset class=\"form-group position-relative has-icon-left mb-0\">\n                  <input type=\"text\" class=\"form-control\" placeholder=\"نوشتن نظر ...\">\n                  <div class=\"form-control-position\">\n                    <i class=\"fa fa-dashcube\"></i>\n                  </div>\n                </fieldset>\n              </form>\n            </div>\n          </div>\n        </div>\n      </div>\n    </li>\n    <li class=\"timeline-item mt-5\">\n      <div class=\"timeline-badge\">\n        <span class=\"avatar avatar-online\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"Eu pid nunc urna integer\"><img src=\"assets/img/portrait/small/avatar-s-14.png\" alt=\"avatar\" width=\"40\"></span>\n      </div>\n      <div class=\"timeline-card card border-grey border-lighten-2\">\n        <div class=\"card-header\">\n          <h4 class=\"card-title mb-0\"><a>سوفیا محمدی</a></h4>\n          <div class=\"card-subtitle text-muted mt-0\">\n            <span class=\"font-small-3\">8 ساعت پیش</span>\n          </div>\n        </div>\n        <div class=\"card-content\">\n          <div class=\"embed-responsive embed-responsive-4by3\">\n            <iframe src=\"https://player.vimeo.com/video/118589137?title=0&byline=0\"></iframe>\n          </div>\n          <div class=\"card-content\">\n            <div class=\"card-body\">\n              <p class=\"card-text\">\n                  لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. \n              </p>\n              <p class=\"card-text\">\n                  کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.\n              </p>\n              <div class=\"list-inline mb-1\">\n                <span class=\"pr-1\"><a class=\"primary\"><span class=\"fa fa-thumbs-o-up\"></span> پسندیدن</a>\n                </span>\n                <span class=\"pr-1\"><a class=\"primary\"><span class=\"fa fa-commenting-o\"></span> نظرات</a>\n                </span>\n                <span><a class=\"primary\"><span class=\"fa fa-share-alt\"></span> اشتراک گذاری</a>\n                </span>\n              </div>\n            </div>\n          </div>\n          <div class=\"card-footer px-0 py-0\">\n            <div class=\"card-body \">\n              <form>\n                <fieldset class=\"form-group position-relative has-icon-left mb-0\">\n                  <input type=\"text\" class=\"form-control\" placeholder=\"نوشتن نظر ...\">\n                  <div class=\"form-control-position\">\n                    <i class=\"fa fa-dashcube\"></i>\n                  </div>\n                </fieldset>\n              </form>\n            </div>\n          </div>\n        </div>\n      </div>\n    </li>\n\n    <li class=\"timeline-item block\">\n      <div class=\"timeline-badge\"><a title=\"\" data-context=\"inverse\" data-container=\"body\" class=\"border-silc\" data-original-title=\"block highlight\"></a></div>\n      <div class=\"timeline-card card border-grey border-lighten-2\">\n        <div class=\"card-header\">\n          <div class=\"text-center\">\n            <p><i class=\"fa fa-bar-chart font-medium-4\"></i></p>\n            <h4>گزارش کمپین</h4>\n            <p class=\"timeline-date\">18 ساعت پیش</p>\n            <p>\n                مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.\n            </p>\n          </div>\n        </div>\n        <div class=\"card-content\">\n          <div class=\"card-body\">\n            <div class=\"chart-container\">\n              <div id=\"stacked-column\" class=\"height-400 echart-container overflow-hidden lineArea1\">\n                <x-chartist class=\"\" [data]=\"lineArea1.data\" [type]=\"lineArea1.type\" [options]=\"lineArea1.options\" [responsiveOptions]=\"lineArea1.responsiveOptions\"\n                  [events]=\"lineArea1.events\">\n                </x-chartist>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </li>\n  </ul>\n  <!-- 2016 -->\n  <ul class=\"timeline\">\n    <li class=\"timeline-line\"></li>\n    <li class=\"timeline-group\">\n      <a class=\"btn btn-raised btn-primary\"><i class=\"fa fa-calendar-o\"></i> 1395</a>\n    </li>\n  </ul>\n  <ul class=\"timeline\">\n\n    <li class=\"timeline-line\"></li>\n    <!-- /.timeline-line -->\n\n    <li class=\"timeline-item\">\n      <div class=\"timeline-badge\">\n        <span class=\"avatar avatar-online\" data-toggle=\"tooltip\" data-placement=\"right\" title=\"Eu pid nunc urna integer\"><img src=\"assets/img/portrait/small/avatar-s-5.png\" alt=\"avatar\" width=\"40\"></span>\n      </div>\n      <div class=\"timeline-card card card-inverse\">\n        <img class=\"card-img img-fluid\" src=\"assets/img/photos/02.jpg\" alt=\"Card image\">\n        <div class=\"card-img-overlay bg-overlay\">\n          <h4 class=\"card-title\">صبح بخیر</h4>\n          <p class=\"card-text\"><small>26 تیر 1396 ساعت 9:00 صبح</small></p>\n        </div>\n      </div>\n    </li>\n\n    <li class=\"timeline-item mt-5\">\n      <div class=\"timeline-badge\">\n        <span class=\"bg-teal bg-lighten-1\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"Nullam facilisis fermentum\"><i class=\"fa fa-check-square-o\"></i></span>\n      </div>\n      <div class=\"timeline-card card border-grey border-lighten-2\">\n        <div class=\"card-header\">\n          <h4 class=\"mb-0 card-title\"><a>نیما نیازی</a></h4>\n          <div class=\"card-subtitle text-muted mt-0\">\n            <span class=\"font-small-3\">18 دی 1396 ساعت 10:00 صبح</span>\n          </div>\n        </div>\n        <div class=\"card-content\">\n          <div class=\"card-content\">\n            <div class=\"card-body\">\n              <p class=\"card-text\">\n                  لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. \n\n              </p>\n              <ul class=\"list-group icheck-task\">\n                <li class=\"list-group-item\">\n                  <div class=\"custom-control custom-checkbox mb-2 mr-sm-2 mb-sm-0\">\n                    <input type=\"checkbox\" class=\"custom-control-input\" checked id=\"1st-item\">\n                    <label class=\"custom-control-label\" for=\"1st-item\">لورم ایپسوم </label>\n                  </div>\n                </li>\n                <li class=\"list-group-item\">\n                  <div class=\"custom-control custom-checkbox mb-2 mr-sm-2 mb-sm-0\">\n                    <input type=\"checkbox\" class=\"custom-control-input\" checked id=\"2nd-item\">\n                    <label class=\"custom-control-label\" for=\"2nd-item\">سادگی نامفهوم</label>\n                  </div>\n                </li>\n                <li class=\"list-group-item\">\n                  <div class=\"custom-control custom-checkbox mb-2 mr-sm-2 mb-sm-0\">\n                    <input type=\"checkbox\" class=\"custom-control-input\" checked id=\"3rd-item\">\n                    <label class=\"custom-control-label\" for=\"3rd-item\">شرایط فعلی تکنولوژی </label>\n                  </div>\n                </li>\n                <li class=\"list-group-item\">\n                  <div class=\"custom-control custom-checkbox mb-2 mr-sm-2 mb-sm-0\">\n                    <input type=\"checkbox\" class=\"custom-control-input\" checked id=\"4th-item\">\n                    <label class=\"custom-control-label\" for=\"4th-item\">شناخت فراوان جامعه</label>\n                  </div>\n                </li>\n                <li class=\"list-group-item\">\n                  <div class=\"custom-control custom-checkbox mb-2 mr-sm-2 mb-sm-0\">\n                    <input type=\"checkbox\" class=\"custom-control-input\" checked id=\"5th-item\">\n                    <label class=\"custom-control-label\" for=\"5th-item\">نرم افزار</label>\n                  </div>\n                </li>\n              </ul>\n            </div>\n          </div>\n          <div class=\"card-footer px-0 py-0\">\n            <div class=\"card-body \">\n              <form>\n                <fieldset class=\"form-group position-relative has-icon-left mb-0\">\n                  <input type=\"text\" class=\"form-control\" placeholder=\"نوشتن نظر ...\">\n                  <div class=\"form-control-position\">\n                    <i class=\"fa fa-dashcube\"></i>\n                  </div>\n                </fieldset>\n              </form>\n            </div>\n          </div>\n        </div>\n      </div>\n    </li>\n  </ul>\n\n  <!-- 2015 -->\n  <ul class=\"timeline\">\n    <li class=\"timeline-line\"></li>\n    <li class=\"timeline-group\">\n      <a class=\"btn btn-raised btn-primary\"><i class=\"fa fa-calendar-o\"></i> 1396</a>\n    </li>\n  </ul>\n  <ul class=\"timeline\">\n    <li class=\"timeline-line\"></li>\n    <!-- /.timeline-line -->\n    <li class=\"timeline-item block\">\n      <div class=\"timeline-badge\"><a title=\"\" data-context=\"inverse\" data-container=\"body\" class=\"border-silc\" data-original-title=\"block highlight\"></a></div>\n      <div class=\"timeline-card card border-grey border-lighten-2\">\n        <div class=\"card-header\">\n          <div class=\"text-center\">\n            <p class=\"mt-1\"><i class=\"fa fa-file-image-o font-medium-4\"></i></p>\n            <h4>گالری رسانه</h4>\n            <p class=\"timeline-date\">1 آبان 1398</p>\n            <p>\n                لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. \n            </p>\n          </div>\n        </div>\n        <!-- Image grid -->\n        <div class=\"card-content\">\n          <div class=\"card-body my-gallery\" itemscope itemtype=\"http://schema.org/ImageGallery\">\n            <div class=\"row\">\n              <figure class=\"col-md-3 col-sm-6 col-12\" itemprop=\"associatedMedia\" itemscope itemtype=\"http://schema.org/ImageObject\">\n                <a itemprop=\"contentUrl\" data-size=\"480x360\">\n                      <img class=\"img-thumbnail img-fluid\" src=\"assets/img/gallery/1.jpg\" itemprop=\"thumbnail\" alt=\"Image description\" />\n                  </a>\n              </figure>\n              <figure class=\"col-md-3 col-sm-6 col-12\" itemprop=\"associatedMedia\" itemscope itemtype=\"http://schema.org/ImageObject\">\n                <a itemprop=\"contentUrl\" data-size=\"480x360\">\n                      <img class=\"img-thumbnail img-fluid\" src=\"assets/img/gallery/2.jpg\" itemprop=\"thumbnail\" alt=\"Image description\" />\n                  </a>\n              </figure>\n              <figure class=\"col-md-3 col-sm-6 col-12\" itemprop=\"associatedMedia\" itemscope itemtype=\"http://schema.org/ImageObject\">\n                <a itemprop=\"contentUrl\" data-size=\"480x360\">\n                      <img class=\"img-thumbnail img-fluid\" src=\"assets/img/gallery/3.jpg\" itemprop=\"thumbnail\" alt=\"Image description\" />\n                  </a>\n              </figure>\n              <figure class=\"col-md-3 col-sm-6 col-12\" itemprop=\"associatedMedia\" itemscope itemtype=\"http://schema.org/ImageObject\">\n                <a itemprop=\"contentUrl\" data-size=\"480x360\">\n                      <img class=\"img-thumbnail img-fluid\" src=\"assets/img/gallery/4.jpg\" itemprop=\"thumbnail\" alt=\"Image description\" />\n                  </a>\n              </figure>\n            </div>\n            <div class=\"row\">\n              <figure class=\"col-md-3 col-sm-6 col-12\" itemprop=\"associatedMedia\" itemscope itemtype=\"http://schema.org/ImageObject\">\n                <a itemprop=\"contentUrl\" data-size=\"480x360\">\n                      <img class=\"img-thumbnail img-fluid\" src=\"assets/img/gallery/5.jpg\" itemprop=\"thumbnail\" alt=\"Image description\" />\n                  </a>\n              </figure>\n              <figure class=\"col-md-3 col-sm-6 col-12\" itemprop=\"associatedMedia\" itemscope itemtype=\"http://schema.org/ImageObject\">\n                <a itemprop=\"contentUrl\" data-size=\"480x360\">\n                      <img class=\"img-thumbnail img-fluid\" src=\"assets/img/gallery/6.jpg\" itemprop=\"thumbnail\" alt=\"Image description\" />\n                  </a>\n              </figure>\n              <figure class=\"col-md-3 col-sm-6 col-12\" itemprop=\"associatedMedia\" itemscope itemtype=\"http://schema.org/ImageObject\">\n                <a itemprop=\"contentUrl\" data-size=\"480x360\">\n                      <img class=\"img-thumbnail img-fluid\" src=\"assets/img/gallery/7.jpg\" itemprop=\"thumbnail\" alt=\"Image description\" />\n                  </a>\n              </figure>\n              <figure class=\"col-md-3 col-sm-6 col-12\" itemprop=\"associatedMedia\" itemscope itemtype=\"http://schema.org/ImageObject\">\n                <a itemprop=\"contentUrl\" data-size=\"480x360\">\n                      <img class=\"img-thumbnail img-fluid\" src=\"assets/img/gallery/8.jpg\" itemprop=\"thumbnail\" alt=\"Image description\" />\n                  </a>\n              </figure>\n            </div>\n            <div class=\"row\">\n              <figure class=\"col-md-3 col-sm-6 col-12\" itemprop=\"associatedMedia\" itemscope itemtype=\"http://schema.org/ImageObject\">\n                <a itemprop=\"contentUrl\" data-size=\"480x360\">\n                      <img class=\"img-thumbnail img-fluid\" src=\"assets/img/gallery/9.jpg\" itemprop=\"thumbnail\" alt=\"Image description\" />\n                  </a>\n              </figure>\n              <figure class=\"col-md-3 col-sm-6 col-12\" itemprop=\"associatedMedia\" itemscope itemtype=\"http://schema.org/ImageObject\">\n                <a itemprop=\"contentUrl\" data-size=\"480x360\">\n                      <img class=\"img-thumbnail img-fluid\" src=\"assets/img/gallery/10.jpg\" itemprop=\"thumbnail\" alt=\"Image description\" />\n                  </a>\n              </figure>\n              <figure class=\"col-md-3 col-sm-6 col-12\" itemprop=\"associatedMedia\" itemscope itemtype=\"http://schema.org/ImageObject\">\n                <a itemprop=\"contentUrl\" data-size=\"480x360\">\n                      <img class=\"img-thumbnail img-fluid\" src=\"assets/img/gallery/11.jpg\" itemprop=\"thumbnail\" alt=\"Image description\" />\n                  </a>\n              </figure>\n              <figure class=\"col-md-3 col-sm-6 col-12\" itemprop=\"associatedMedia\" itemscope itemtype=\"http://schema.org/ImageObject\">\n                <a itemprop=\"contentUrl\" data-size=\"480x360\">\n                      <img class=\"img-thumbnail img-fluid\" src=\"assets/img/gallery/12.jpg\" itemprop=\"thumbnail\" alt=\"Image description\" />\n                  </a>\n              </figure>\n            </div>\n          </div>\n          <!--/ Image grid -->\n        </div>\n        <!--/ PhotoSwipe -->\n      </div>\n    </li>\n    <li class=\"timeline-item\">\n      <div class=\"timeline-badge\">\n        <span class=\"bg-warning bg-darken-1\" data-toggle=\"tooltip\" data-placement=\"right\" title=\"Application API Support\"><i class=\"fa fa-life-ring\"></i></span>\n      </div>\n      <div class=\"timeline-card card border-grey border-lighten-2\">\n        <div class=\"card-header\">\n          <div class=\"media\">\n            <div class=\"media-left\">\n              <a>\n                  <span class=\"avatar avatar-md avatar-busy\"><img src=\"assets/img/portrait/small/avatar-s-18.png\" alt=\"avatar\" width=\"50\"></span>\n                  <i></i>\n                </a>\n            </div>\n            <div class=\"media-body\">\n              <h4 class=\"card-title mb-0\"><a>پشتیبانی برنامه کاربردی</a></h4>\n              <div class=\"card-subtitle text-muted mt-0\">\n                <span class=\"font-small-3\">15 آذر 1397 ساعت 10:00 صبح</span>\n                <span class=\"tag tag-pill tag-default tag-warning float-right\">بالا</span>\n              </div>\n            </div>\n          </div>\n        </div>\n        <div class=\"card-content\">\n          <img class=\"img-fluid\" src=\"assets/img/photos/03.jpg\" alt=\"Timeline Image 1\">\n          <div class=\"card-content\">\n            <div class=\"card-body\">\n              <p class=\"card-text\">\n                  کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد\n              </p>\n              <div class=\"list-inline mb-1\">\n                <span class=\"pr-1\"><a class=\"primary\"><span class=\"fa fa-commenting-o\"></span> نظرات</a>\n                </span>\n              </div>\n            </div>\n          </div>\n          <div class=\"card-footer px-0 py-0\">\n            <div class=\"card-body\">\n              <div class=\"media\">\n                <div class=\"media-left\">\n                  <a>\n                      <span class=\"avatar avatar-online\"><img src=\"assets/img/portrait/small/avatar-s-4.png\" alt=\"avatar\" width=\"50\"></span>\n                    </a>\n                </div>\n                <div class=\"media-body\">\n                  <p class=\"text-bold-600 mb-0\"><a>زیبا حسنی</a></p>\n                  <p class=\"m-0\">لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. </p>\n                  <div class=\"media\">\n                    <div class=\"media-left\">\n                      <a>\n                          <span class=\"avatar avatar-online\"><img src=\"assets/img/portrait/small/avatar-s-6.png\" alt=\"avatar\" width=\"50\"></span>\n                        </a>\n                    </div>\n                    <div class=\"media-body\">\n                      <p class=\"text-bold-600 mb-0\"><a>نسرین امامی</a></p>\n                      <p>زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود</p>\n                    </div>\n                  </div>\n                </div>\n              </div>\n              <form>\n                <fieldset class=\"form-group position-relative has-icon-left mb-0\">\n                  <input type=\"text\" class=\"form-control\" placeholder=\"نوشتن نظر ...\">\n                  <div class=\"form-control-position\">\n                    <i class=\"fa fa-dashcube\"></i>\n                  </div>\n                </fieldset>\n              </form>\n            </div>\n          </div>\n        </div>\n      </div>\n    </li>\n    <li class=\"timeline-item mt-5\">\n      <div class=\"timeline-badge\">\n        <span class=\"bg-amber bg-darken-1\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"Quote of the day\"><i class=\"fa fa-smile-o\"></i></span>\n      </div>\n      <div class=\"timeline-card card border-grey border-lighten-2\">\n        <div class=\"card-header\">\n          <h4 class=\"card-title mb-0\"><a>نقل قول روز</a></h4>\n          <div class=\"card-subtitle text-muted mt-0\">\n            <span class=\"font-small-3\">3 آبان 1397 ساعت 8:00 بعد از ظهر</span>\n          </div>\n        </div>\n        <div class=\"card-content\">\n          <img class=\"img-fluid\" src=\"assets/img/photos/04.jpg\" alt=\"Timeline Image 1\">\n          <div class=\"card-body\">\n            <blockquote class=\"card-bodyquote\">\n              <p class=\"card-text\">\n                  لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. \n              </p>\n              <div>کسی که معروف است<cite title=\"Source Title\"> - عنوان منبع</cite></div>\n            </blockquote>\n          </div>\n        </div>\n      </div>\n    </li>\n  </ul>\n\n  <!-- 2014 -->\n  <ul class=\"timeline\">\n    <li class=\"timeline-line\"></li>\n    <li class=\"timeline-group\">\n      <a class=\"btn btn-raised btn-primary\"><i class=\"fa fa-calendar-o\"></i> 1397</a>\n    </li>\n  </ul>\n  <ul class=\"timeline\">\n    <li class=\"timeline-line\"></li>\n    <!-- /.timeline-line -->\n    <li class=\"timeline-item block\">\n      <div class=\"timeline-badge\"><a title=\"\" data-context=\"inverse\" data-container=\"body\" class=\"border-silc\" data-original-title=\"block highlight\"></a></div>\n      <div class=\"timeline-card card border-grey border-lighten-2\">\n        <div class=\"card-header\">\n          <div class=\"text-center\">\n            <p><i class=\"fa fa-map-marker font-medium-4\"></i></p>\n            <h4>به تهران منتقل شد</h4>\n            <p class=\"timeline-date\">1 مهر 1397</p>\n            <p>\n                لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.\n            </p>\n          </div>\n        </div>\n        <div class=\"card-content\">\n          <div class=\"card-body\">\n            <div id=\"moved-brooklyn\" class=\"height-450\">\n              <agm-map [latitude]=\"lat\" [longitude]=\"lng\">\n                <agm-marker [latitude]=\"lat\" [longitude]=\"lng\"></agm-marker>\n              </agm-map>\n\n            </div>\n          </div>\n        </div>\n      </div>\n    </li>\n  </ul>\n  <!-- 2014 -->\n  <ul class=\"timeline\">\n    <li class=\"timeline-line\"></li>\n    <li class=\"timeline-group\">\n      <a class=\"btn btn-raised btn-primary\"><i class=\"fa fa-calendar-o\"></i> در سال 1397 تاسیس شد</a>\n    </li>\n  </ul>\n</section>\n<!--Vertical Timeline Ends-->"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/pages/full-pages/user-profile/user-profile-page.component.html":
/*!**********************************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/pages/full-pages/user-profile/user-profile-page.component.html ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--User Profile Starts-->\n<!--Basic User Details Starts-->\n<section id=\"user-profile\">\n    <div class=\"row\">\n        <div class=\"col-12\">\n            <div class=\"card profile-with-cover\">\n                <div class=\"card-img-top img-fluid bg-cover height-300\" style=\"background: url('assets/img/photos/14.jpg') 50%;\"></div>\n                <div class=\"media profil-cover-details row\">\n                    <div class=\"col-5\">\n                        <div class=\"align-self-start halfway-fab pl-3 pt-2\">\n                            <div class=\"text-left\">\n                                <h3 class=\"card-title white\">رضا رضایی</h3>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"col-2\">\n                        <div class=\"align-self-center halfway-fab text-center\">\n                            <a class=\"profile-image\">\n                                <img src=\"assets/img/portrait/avatars/avatar-08.png\" class=\"rounded-circle img-border gradient-summer width-100\" alt=\"Card image\">\n                            </a>\n                        </div>\n                    </div>\n                    <div class=\"col-5\">                        \n                    </div>                    \n                </div>\n                <div class=\"profile-cover-buttons\">\n                    <div class=\"media-body halfway-fab align-self-end\">\n                        <div class=\"text-right d-none d-sm-none d-md-none d-lg-block\">\n                            <button type=\"button\" class=\"btn btn-primary btn-raised mr-2\"><i class=\"fa fa-plus\"></i> دنبال کنید</button>\n                            <button type=\"button\" class=\"btn btn-success btn-raised mr-3\"><i class=\"fa fa-dashcube\"></i> پیام</button>\n                        </div>\n                        <div class=\"text-right d-block d-sm-block d-md-block d-lg-none\">\n                            <button type=\"button\" class=\"btn btn-primary btn-raised mr-2\"><i class=\"fa fa-plus\"></i></button>\n                            <button type=\"button\" class=\"btn btn-success btn-raised mr-3\"><i class=\"fa fa-dashcube\"></i></button>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"profile-section\">\n                    <div class=\"row\">\n                        <div class=\"col-lg-5 col-md-5 \">\n                            <ul class=\"profile-menu no-list-style\">\n                                <li>\n                                    <a (click)=\"showPage('About')\" [ngClass]=\"currentPage === 'About' ? 'primary font-medium-2 font-weight-600 active' : 'primary font-medium-2 font-weight-600'\">درباه</a>\n                                </li>\n                                <li>\n                                    <a (click)=\"showPage('TimeLine')\" [ngClass]=\"currentPage === 'TimeLine' ? 'primary font-medium-2 font-weight-600 active' : 'primary font-medium-2 font-weight-600'\">گاهشمار</a>\n                                </li>\n                            </ul>\n                        </div>\n                        <div class=\"col-lg-2 col-md-2 text-center\">\n                            <span class=\"font-medium-2 text-uppercase\">رضا رضایی</span>\n                            <p class=\"grey font-small-2\">توسعه دهنده</p>\n                        </div>\n                        <div class=\"col-lg-5 col-md-5\">\n                            <ul class=\"profile-menu no-list-style\">\n                                <li>\n                                    <a (click)=\"showPage('Friends')\" [ngClass]=\"currentPage === 'Friends' ? 'primary font-medium-2 font-weight-600 active' : 'primary font-medium-2 font-weight-600'\">دوستان</a>\n                                </li>\n                                <li>\n                                    <a (click)=\"showPage('Photos')\" [ngClass]=\"currentPage === 'Photos' ? 'primary font-medium-2 font-weight-600 active' : 'primary font-medium-2 font-weight-600'\">عکس ها</a>\n                                </li>\n                            </ul>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</section>\n<!--Basic User Details Ends-->\n\n<!--About section starts-->\n<section id=\"about\" *ngIf=\"currentPage === 'About'\">\n    <div class=\"row\">\n        <div class=\"col-12\">\n            <div class=\"content-header\">درباره</div>\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"col-sm-12\">\n            <div class=\"card\">\n                <div class=\"card-header\">\n                    <h5>اطلاعات شخصی</h5>\n                </div>\n                <div class=\"card-content\">\n                    <div class=\"card-body\">\n                        <div class=\"mb-3\">\n                            <span class=\"text-bold-500 primary\">درباره ی من </span>\n                            <span class=\"d-block overflow-hidden\">\n                                    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.\n\n                            </span>\n                        </div>\n                        <hr>\n                        <div class=\"row\">\n                            <div class=\"col-12 col-md-6 col-lg-4\">\n                                <ul class=\"no-list-style\">\n                                    <li class=\"mb-2\">\n                                        <span class=\"text-bold-500 primary\"><a><i class=\"icon-present font-small-3\"></i> تولد:</a></span>\n                                        <span class=\"d-block overflow-hidden\">10 دی 1377</span>\n                                    </li>\n                                    <li class=\"mb-2\">\n                                        <span class=\"text-bold-500 primary\"><a><i class=\"ft-map-pin font-small-3\"></i> محل تولد:</a></span>\n                                        <span class=\"d-block overflow-hidden\">ایران ، تهران</span>\n                                    </li>\n                                    <li class=\"mb-2\">\n                                        <span class=\"text-bold-500 primary\"><a><i class=\"ft-globe font-small-3\"></i> زندگی می کنم در:</a></span>\n                                        <span class=\"d-block overflow-hidden\">اصفهان ، ایران</span>\n                                    </li>\n                                </ul>\n                            </div>\n                            <div class=\"col-12 col-md-6 col-lg-4\">\n                                <ul class=\"no-list-style\">\n                                    <li class=\"mb-2\">\n                                        <span class=\"text-bold-500 primary\"><a><i class=\"ft-user font-small-3\"></i> جنسیت:</a></span>\n                                        <span class=\"d-block overflow-hidden\">مرد</span>\n                                    </li>\n                                    <li class=\"mb-2\">\n                                        <span class=\"text-bold-500 primary\"><a><i class=\"ft-mail font-small-3\"></i> ایمیل:</a></span>\n                                        <a class=\"d-block overflow-hidden\">jose@yourmail.com</a>\n                                    </li>\n                                    <li class=\"mb-2\">\n                                        <span class=\"text-bold-500 primary\"><a><i class=\"ft-monitor font-small-3\"></i> سایت:</a></span>\n                                        <a class=\"d-block overflow-hidden\">pixinvent.com</a>\n                                    </li>\n                                </ul>\n                            </div>\n                            <div class=\"col-12 col-md-6 col-lg-4\">\n                                <ul class=\"no-list-style\">\n                                    <li class=\"mb-2\">\n                                        <span class=\"text-bold-500 primary\"><a><i class=\"ft-smartphone font-small-3\"></i> شماره تماس:</a></span>\n                                        <span class=\"d-block overflow-hidden\">(012) 345 - 678 - 9910</span>\n                                    </li>\n                                    <li class=\"mb-2\">\n                                        <span class=\"text-bold-500 primary\"><a><i class=\"ft-briefcase font-small-3\"></i> شغل:</a></span>\n                                        <span class=\"d-block overflow-hidden\">طراح</span>\n                                    </li>\n                                    <li class=\"mb-2\">\n                                        <span class=\"text-bold-500 primary\"><a><i class=\"ft-book font-small-3\"></i> عضویت:</a></span>\n                                        <span class=\"d-block overflow-hidden\">1 اسفند 1390</span>\n                                    </li>\n                                </ul>\n                            </div>\n                        </div>\n                        <hr>\n                        <div class=\"mt-3\">\n                            <span class=\"text-bold-500 primary\">سرگرمی:</span>\n                            <span class=\"d-block overflow-hidden\">\n                                    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.\n\n                            </span>\n                        </div>\n                        <div class=\"mt-2 overflow-hidden\">\n                            <span class=\"mr-3 mt-2 text-center float-left width-100\"> <i class=\"icon-plane danger font-large-2\"></i> <div class=\"mt-2\">مسافرت</div></span>\n                            <span class=\"mr-3 mt-2 text-center float-left width-100\"> <i class=\"icon-speedometer danger font-large-2\"></i> <div class=\"mt-2\">رانندگی</div></span>\n                            <span class=\"mr-3 mt-2 text-center float-left width-100\"> <i class=\"icon-camera danger font-large-2\"></i> <div class=\"mt-2\">عکاسی</div></span>\n                            <span class=\"mr-3 mt-2 text-center float-left width-100\"> <i class=\"icon-game-controller danger font-large-2\"></i> <div class=\"mt-2\">بازی</div></span>\n                            <span class=\"mr-3 mt-2 text-center float-left width-100\"> <i class=\"icon-music-tone-alt danger font-large-2\"></i> <div class=\"mt-2\">موزیک</div></span>\n                            <span class=\"mr-3 mt-2 text-center float-left width-100\"> <i class=\"ft-monitor danger font-large-2\"></i> <div class=\"mt-2\">موج سواری</div></span>\n                            <span class=\"mr-3 mt-2 text-center float-left width-100\"> <i class=\"ft-pie-chart danger font-large-2\"></i> <div class=\"mt-2\">غذا</div></span>\n                            <span class=\"mr-3 mt-2 text-center float-left width-100\"> <i class=\"ft-tv danger font-large-2\"></i> <div class=\"mt-2\">تلویزیون</div></span>\n                            <span class=\"mr-3 mt-2 text-center float-left width-100\"> <i class=\"icon-basket-loaded danger font-large-2\"></i> <div class=\"mt-2\">خرید</div></span>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-sm-12\">\n            <div class=\"card\">\n                <div class=\"card-header\">\n                    <h5>اطلاعات آموزشی</h5>\n                </div>\n                <div class=\"card-content\">\n                    <div class=\"card-body\">\n                        <div class=\"row\">\n                            <div class=\"col-lg-6 col-md-6 col-sm-12 col-12\">\n                                <ul class=\"no-list-style\">\n                                    <li class=\"mb-2\">\n                                        <span class=\"primary text-bold-500\"><a><i class=\"ft-home font-small-3\"></i> موسسه طراحی افق</a></span>\n                                        <span class=\"grey line-height-0 d-block mb-2 font-small-2\">1390 - 1391</span>\n                                        <span class=\"line-height-2 d-block overflow-hidden\">استاد: محمد صالحی. شش ماه بهترین ابزار توسعه ابزار.</span>\n                                    </li>\n                                    <li class=\"mb-2\">\n                                        <span class=\"primary text-bold-500\"><a><i class=\"ft-home font-small-3\"></i> دانشگاه تهران </a></span>\n                                        <span class=\"grey line-height-0 d-block mb-2 font-small-2\">1391 - 1392</span>\n                                        <span class=\"line-height-2 d-block overflow-hidden\">استاد: علی ناصری. بهترین اطلاعات آموزشی را به من داد.</span>\n                                    </li>\n                                </ul>\n                            </div>\n                            <div class=\"col-lg-6 col-md-6 col-sm-12 col-12\">\n                                <ul class=\"no-list-style\">\n                                    <li class=\"mb-2\">\n                                        <span class=\"primary text-bold-500\"><a><i class=\"ft-home font-small-3\"></i> توسعه دهنده</a></span>\n                                        <span class=\"grey line-height-0 d-block mb-2 font-small-2\">1392 - 1393</span>\n                                        <span class=\"line-height-2 d-block overflow-hidden\">توسعه دهنده ی زبان های وب</span>\n                                    </li>\n                                    <li class=\"mb-2\">\n                                        <span class=\"primary text-bold-500\"><a><i class=\"ft-home font-small-3\"></i> ارشد توسعه دهنده</a></span>\n                                        <span class=\"grey line-height-0 d-block mb-2 font-small-2\">1395- تاکنون</span>\n                                        <span class=\"line-height-2 d-block overflow-hidden\">ارشد توسعه دهنده ی زبان های وب</span>\n                                    </li>\n                                </ul>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</section>\n<!--About section ends-->\n\n<!--User Timeline section starts-->\n<section *ngIf=\"currentPage === 'TimeLine'\">   \n    <div class=\"row\">\n        <div class=\"col-12\">\n            <div class=\"content-header\">گاهشمار کاربر</div>\n        </div>\n    </div>\n    <div id=\"timeline\" class=\"timeline-center timeline-wrapper\">\n        <ul class=\"timeline\">\n            <li class=\"timeline-line\"></li>\n            <li class=\"timeline-group\">\n                <a class=\"btn btn-raised btn-primary\"><i class=\"fa fa-calendar-o\"></i> امروز</a>\n            </li>\n        </ul>\n        <ul class=\"timeline\">\n            <li class=\"timeline-line\"></li>\n            <li class=\"timeline-item\">\n                <div class=\"timeline-badge\">\n                <span class=\"bg-red bg-lighten-1\" data-toggle=\"tooltip\" data-placement=\"right\" title=\"کار پروژه نمونه کارها\"><i class=\"fa fa-plane\"></i></span>\n                </div>\n                <div class=\"timeline-card card border-grey border-lighten-2\">\n                <div class=\"card-header\">\n                    <h4 class=\"mb-0 card-title\"><a>کار پروژه نمونه کارها</a></h4>\n                    <div class=\"card-subtitle text-muted mt-0\">\n                        <span class=\"font-small-3\">5 ساعت پیش</span>\n                    </div>\n                </div>\n                <div class=\"card-content\">\n                    <img class=\"img-fluid\" src=\"assets/img/photos/06.jpg\" alt=\"Timeline Image 1\">\n                    <div class=\"card-content\">\n                    <div class=\"card-body\">\n                        <p class=\"card-text\">\n                                لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. \n                        </p>\n                        <div class=\"list-inline mb-1\">\n                        <span class=\"pr-1\"><a class=\"primary\"><span class=\"fa fa-thumbs-o-up\"></span> پسندیدن</a></span>\n                        <span class=\"pr-1\"><a class=\"primary\"><span class=\"fa fa-commenting-o\"></span> نظر</a></span>\n                        <span><a class=\"primary\"><span class=\"fa fa-share-alt\"></span> اشتراک</a></span>\n                        </div>\n                    </div>\n                    </div>\n                    <div class=\"card-footer px-0 py-0\">\n                    <div class=\"card-body\">\n                        <form>\n                            <fieldset class=\"form-group position-relative has-icon-left mb-0\">\n                                <input type=\"text\" class=\"form-control\" placeholder=\"نوشتن نظر ...\">\n                                <div class=\"form-control-position\">\n                                    <i class=\"fa fa-dashcube\"></i>\n                                </div>\n                            </fieldset>\n                        </form>\n                    </div>\n                    </div>\n                </div>\n                </div>\n            </li>            \n            <li class=\"timeline-item mt-5\">\n                <div class=\"timeline-badge\">\n                <span class=\"avatar avatar-online\" data-toggle=\"tooltip\" data-placement=\"right\" title=\"Eu pid nunc urna integer\"><img src=\"assets/img/portrait/small/avatar-s-5.png\" alt=\"avatar\" width=\"40\"></span>\n                </div>\n                <div class=\"timeline-card card card-inverse\">\n                <img class=\"card-img img-fluid\" src=\"assets/img/photos/07.jpg\" alt=\"Card image\">\n                <div class=\"card-img-overlay bg-overlay\">\n                    <h4 class=\"card-title\">صبح بخیر</h4>\n                    <p class=\"card-text\"><small>15 ساعت پیش</small></p>\n                </div>\n                </div>\n            </li>\n        </ul>\n\n        <!-- 2016 -->\n        <ul class=\"timeline\">\n            <li class=\"timeline-line\"></li>\n            <li class=\"timeline-group\">\n                <a class=\"btn btn-raised btn-primary\"><i class=\"fa fa-calendar-o\"></i> 1396</a>\n            </li>\n        </ul>\n        <ul class=\"timeline\">\n            <li class=\"timeline-line\"></li><!-- /.timeline-line -->\n            <li class=\"timeline-item\">\n                <div class=\"timeline-badge\">\n                <span class=\"bg-warning bg-darken-1\" data-toggle=\"tooltip\" data-placement=\"right\" title=\"پشتیبانی برنامه کاربردی\"><i class=\"fa fa-life-ring\"></i></span>\n                </div>\n                <div class=\"timeline-card card border-grey border-lighten-2\">\n                <div class=\"card-header\">\n                    <div class=\"media\">\n                    <div class=\"media-left\">\n                        <a>\n                        <span class=\"avatar avatar-md avatar-busy\"><img src=\"assets/img/portrait/small/avatar-s-11.png\" alt=\"avatar\" width=\"50\"></span>\n                        <i></i>\n                        </a>\n                    </div>\n                    <div class=\"media-body\">\n                        <h4 class=\"mb-0 card-title\"><a>پشتیبانی برنامه کاربردی</a></h4>\n                        <div class=\"card-subtitle text-muted mt-0\">\n                            <span class=\"font-small-3\">15 بهمن 1396 ساعت 17:00</span>\n                            <span class=\"tag tag-pill tag-default tag-warning float-right\">بالا</span>\n                        </div>  \n                    </div>\n                    </div>\n                </div>\n                <div class=\"card-content\">\n                    <img class=\"img-fluid\" src=\"assets/img/photos/08.jpg\" alt=\"Timeline Image 1\">\n                    <div class=\"card-content\">\n                    <div class=\"card-body\">\n                        <p class=\"card-text\">لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. </p>\n                        <div class=\"list-inline mb-1\">\n                        <span class=\"pr-1\"><a class=\"primary\"><span class=\"fa fa-commenting-o\"></span> نظر</a></span>\n                        </div>\n                    </div>\n                    </div>\n                    <div class=\"card-footer px-0 py-0\">\n                    <div class=\"card-body\">\n                        <div class=\"media\">\n                        <div class=\"media-left\">\n                            <a>\n                            <span class=\"avatar avatar-online\"><img src=\"assets/img/portrait/small/avatar-s-14.png\" alt=\"avatar\" width=\"50\"></span>\n                            </a>\n                        </div>\n                        <div class=\"media-body\">\n                            <p class=\"text-bold-600 mb-0\"><a>زیبا حسنی کیا</a></p>\n                            <p class=\"m-0\">لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است</p>\n                            <div class=\"media\">\n                            <div class=\"media-left\">\n                                <a>\n                                <span class=\"avatar avatar-online\"><img src=\"assets/img/portrait/small/avatar-s-16.png\" alt=\"avatar\" width=\"50\"></span>\n                                </a>\n                            </div>\n                            <div class=\"media-body\">\n                                <p class=\"text-bold-600 mb-0\"><a>زهرا اسدی</a></p>\n                                <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است</p>\n                            </div>\n                            </div>\n                        </div>\n                        </div>\n                        <form>\n                            <fieldset class=\"form-group position-relative has-icon-left mb-0\">\n                                <input type=\"text\" class=\"form-control\" placeholder=\"نوشتن نظر ...\">\n                                <div class=\"form-control-position\">\n                                    <i class=\"fa fa-dashcube\"></i>\n                                </div>\n                            </fieldset>\n                        </form>\n                    </div>\n                    </div>\n                </div>\n                </div>\n            </li>\n            <li class=\"timeline-item mt-5\">\n                <div class=\"timeline-badge\">\n                <span class=\"bg-amber bg-darken-1\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"Quote of the day\"><i class=\"fa fa-smile-o\"></i></span>\n                </div>\n                <div class=\"timeline-card card border-grey border-lighten-2\">\n                <div class=\"card-header\">\n                    <h4 class=\"mb-0 card-title\"><a>نقل قول روز</a></h4>\n                    <div class=\"card-subtitle text-muted mt-0\">\n                        <span class=\"font-small-3\">3 دی 1396 ساعت 120:00 ظهر</span>\n                    </div>\n                </div>\n                <div class=\"card-content\">\n                    <img class=\"img-fluid\" src=\"assets/img/photos/09.jpg\" alt=\"Timeline Image 1\">\n                    <div class=\"card-body\">\n                    <blockquote class=\"card-bodyquote\">\n                        <p class=\"card-text\">\n                                چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. \n                        </p>\n                        <footer>کسی که معروف است <cite title=\"Source Title\"> - عنوان منبع</cite></footer>\n                    </blockquote>\n                    </div>\n                </div>\n                </div>\n            </li>\n        </ul>\n        <!-- 2015 -->\n        <ul class=\"timeline\">\n            <li class=\"timeline-line\"></li>\n            <li class=\"timeline-group\">\n                <a class=\"btn btn-raised btn-primary\"><i class=\"fa fa-calendar-o\"></i> در سال 1396 تاسیس شد</a>\n            </li>\n        </ul>\n    </div>\n</section>\n<!--User Timeline section ends-->\n\n<!--User's friend section starts-->\n<section id=\"friends\" *ngIf=\"currentPage === 'Friends'\">\n    <div class=\"row\">\n        <div class=\"col-12\">\n            <div class=\"content-header\">دوستان</div>\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"col-12 col-md-6 col-lg-4\">\n            <div class=\"card\">\n                <div class=\"card-header text-center\">\n                    <img src=\"./assets/img/portrait/small/avatar-s-3.png\" alt=\"Brek\" width=\"150\" class=\"rounded-circle gradient-mint\">\n                </div>\n                <div class=\"card-content\">\n                    <div class=\"card-body text-center\">\n                        <h4 class=\"card-title\">رضا مرادی</h4>\n                        <p class=\"category text-gray font-small-4\">مدیر عامل شرکت / موسس</p>\n                        <a class=\"btn btn-lg gradient-mint font-small-2 white p-2 mr-2\">افزودن به عنوان دوست</a>\n                        <a class=\"btn btn-lg btn-outline-grey font-small-2 p-2\">پیام</a>\n                        <hr class=\"grey\">\n                        <div class=\"row grey\">\n                            <div class=\"col-4\">\n                                <a><i class=\"ft-star mr-1\"></i> <span>4.9</span></a>\n                            </div>\n                            <div class=\"col-4\">\n                                <a><i class=\"ft-globe mr-1\"></i> <span>ایران</span></a>\n                            </div>\n                            <div class=\"col-4\">\n                                <a><i class=\"ft-book mr-1\"></i> <span>21</span></a>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-12 col-md-6 col-lg-4\">\n            <div class=\"card\">\n                <div class=\"card-header text-center\">\n                    <img src=\"./assets/img/portrait/small/avatar-s-18.png\" alt=\"Jassi\" width=\"150\" class=\"rounded-circle gradient-pomegranate\">\n                </div>\n                <div class=\"card-content\">\n                    <div class=\"card-body text-center\">\n                        <h4 class=\"card-title\">زهرا اسعدی</h4>\n                        <p class=\"category text-gray font-small-4\">توسعه دهنده</p>\n                        <a class=\"btn btn-lg gradient-pomegranate font-small-2 white p-2 mr-2\">افزودن به عنوان دوست</a>\n                        <a class=\"btn btn-lg btn-outline-grey font-small-2 p-2\">پیام</a>\n                        <hr class=\"grey\">\n                        <div class=\"row grey\">\n                            <div class=\"col-4\">\n                                <a><i class=\"ft-star mr-1\">ستاره</i> <span>4.7</span></a>\n                            </div>\n                            <div class=\"col-4\">\n                                <a><i class=\"ft-globe mr-1\"></i> <span>ایران</span></a>\n                            </div>\n                            <div class=\"col-4\">\n                                <a><i class=\"ft-book mr-1\"></i> <span>14</span></a>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-12 col-md-6 col-lg-4\">\n            <div class=\"card\">\n                <div class=\"card-header text-center\">\n                    <img src=\"./assets/img/portrait/small/avatar-s-11.png\" alt=\"Brek\" width=\"150\" class=\"rounded-circle gradient-orange-amber\">\n                </div>\n                <div class=\"card-content\">\n                    <div class=\"card-body text-center\">\n                        <h4 class=\"card-title\">سارا حسینی</h4>\n                        <p class=\"category text-gray font-small-4\">توسعه دهنده اندروید</p>\n                        <a class=\"btn btn-lg gradient-orange-amber font-small-2 white p-2 mr-2\">افزودن به عنوان دوست</a>\n                        <a class=\"btn btn-lg btn-outline-grey font-small-2 p-2\">پیام</a>\n                        <hr class=\"grey\">\n                        <div class=\"row grey\">\n                            <div class=\"col-4\">\n                                <a><i class=\"ft-star mr-1\">ستاره</i> <span>5.0</span></a>\n                            </div>\n                            <div class=\"col-4\">\n                                <a><i class=\"ft-globe mr-1\"></i> <span>ایران</span></a>\n                            </div>\n                            <div class=\"col-4\">\n                                <a><i class=\"ft-book mr-1\"></i> <span>18</span></a>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-12 col-md-6 col-lg-4\">\n            <div class=\"card\">\n                <div class=\"card-header text-center\">\n                    <img src=\"./assets/img/portrait/small/avatar-s-6.png\" alt=\"Maitri\" width=\"150\" class=\"rounded-circle gradient-red-pink\">\n                </div>\n                <div class=\"card-content\">\n                    <div class=\"card-body text-center\">\n                        <h4 class=\"card-title\">ثنا شاملی</h4>\n                        <p class=\"category text-gray font-small-4\">طراح</p>\n                        <a class=\"btn btn-lg gradient-red-pink font-small-2 white p-2 mr-2\">افزودن به عنوان دوست</a>\n                        <a class=\"btn btn-lg btn-outline-grey font-small-2 p-2\">پیام</a>\n                        <hr class=\"grey\">\n                        <div class=\"row grey\">\n                            <div class=\"col-4\">\n                                <a><i class=\"ft-star mr-1\">ستاره</i> <span>4.5</span></a>\n                            </div>\n                            <div class=\"col-4\">\n                                <a><i class=\"ft-globe mr-1\"></i> <span>ایران</span></a>\n                            </div>\n                            <div class=\"col-4\">\n                                <a><i class=\"ft-book mr-1\"></i> <span>19</span></a>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-12 col-md-6 col-lg-4\">\n            <div class=\"card\">\n                <div class=\"card-header text-center\">\n                    <img src=\"./assets/img/portrait/small/avatar-s-9.png\" alt=\"Anibal\" width=\"150\" class=\"rounded-circle gradient-blackberry\">\n                </div>\n                <div class=\"card-content\">\n                    <div class=\"card-body text-center\">\n                        <h4 class=\"card-title\">آرزو محمدی</h4>\n                        <p class=\"category text-gray font-small-4\">توسعه دهنده پروژه</p>\n                        <a class=\"btn btn-lg gradient-blackberry font-small-2 white p-2 mr-2\">افزودن به عنوان دوست</a>\n                        <a class=\"btn btn-lg btn-outline-grey font-small-2 p-2\">پیام</a>\n                        <hr class=\"grey\">\n                        <div class=\"row grey\">\n                            <div class=\"col-4\">\n                                <a><i class=\"ft-star mr-1\">ستاره</i> <span>4.8</span></a>\n                            </div>\n                            <div class=\"col-4\">\n                                <a><i class=\"ft-globe mr-1\"></i> <span>لندن</span></a>\n                            </div>\n                            <div class=\"col-4\">\n                                <a><i class=\"ft-book mr-1\"></i> <span>20</span></a>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-12 col-md-6 col-lg-4\">\n            <div class=\"card\">\n                <div class=\"card-header text-center\">\n                    <img src=\"./assets/img/portrait/small/avatar-s-12.png\" alt=\"Gini\" width=\"150\" class=\"rounded-circle gradient-back-to-earth\">\n                </div>\n                <div class=\"card-content\">\n                    <div class=\"card-body text-center\">\n                        <h4 class=\"card-title\">علیرضا زمانی</h4>\n                        <p class=\"category text-gray font-small-4\">منابع انسانی</p>\n                        <a class=\"btn btn-lg gradient-back-to-earth font-small-2 white p-2 mr-2\">افزودن به عنوان دوست</a>\n                        <a class=\"btn btn-lg btn-outline-grey font-small-2 p-2\">پیام</a>\n                        <hr class=\"grey\">\n                        <div class=\"row grey\">\n                            <div class=\"col-4\">\n                                <a><i class=\"ft-star mr-1\">ستاره</i> <span>4.4</span></a>\n                            </div>\n                            <div class=\"col-4\">\n                                <a><i class=\"ft-globe mr-1\"></i> <span>ایران</span></a>\n                            </div>\n                            <div class=\"col-4\">\n                                <a><i class=\"ft-book mr-1\"></i> <span>15</span></a>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</section>\n<!--User's friend section starts-->\n\n<!--User's uploaded photos section starts-->\n<section id=\"photos\" *ngIf=\"currentPage === 'Photos'\">\n    <div class=\"row\">\n        <div class=\"col-12\">\n            <div class=\"content-header\">عکس ها</div>\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"col-12\">\n            <div class=\"card\">\n                <div class=\"card-header\">\n                    <h5>عکس آپلود شده</h5>\n                </div>\n                <div class=\"card-content\">\n                    <div class=\"card-body\">\n                        <div class=\"row\">\n                            <figure class=\"col-lg-3 col-md-6 col-12\">\n                                <img class=\"img-thumbnail img-fluid\" src=\"./assets/img/gallery/1.jpg\" itemprop=\"thumbnail\" alt=\"Image description\" />\n                            </figure>\n                            <figure class=\"col-lg-3 col-md-6 col-12\">\n                                <img class=\"img-thumbnail img-fluid\" src=\"./assets/img/gallery/2.jpg\" itemprop=\"thumbnail\" alt=\"Image description\" />\n                            </figure>\n                            <figure class=\"col-lg-3 col-md-6 col-12\">\n                                <img class=\"img-thumbnail img-fluid\" src=\"./assets/img/gallery/3.jpg\" itemprop=\"thumbnail\" alt=\"Image description\" />\n                            </figure>\n                            <figure class=\"col-lg-3 col-md-6 col-12\">\n                                <img class=\"img-thumbnail img-fluid\" src=\"./assets/img/gallery/4.jpg\" itemprop=\"thumbnail\" alt=\"Image description\" />\n                            </figure>\n                        </div>\n                        <div class=\"row\">\n                            <figure class=\"col-lg-3 col-md-6 col-12\">\n                                <img class=\"img-thumbnail img-fluid\" src=\"./assets/img/gallery/5.jpg\" itemprop=\"thumbnail\" alt=\"Image description\" />\n                            </figure>\n                            <figure class=\"col-lg-3 col-md-6 col-12\">\n                                <img class=\"img-thumbnail img-fluid\" src=\"./assets/img/gallery/6.jpg\" itemprop=\"thumbnail\" alt=\"Image description\" />\n                            </figure>\n                            <figure class=\"col-lg-3 col-md-6 col-12\">\n                                <img class=\"img-thumbnail img-fluid\" src=\"./assets/img/gallery/7.jpg\" itemprop=\"thumbnail\" alt=\"Image description\" />\n                            </figure>\n                            <figure class=\"col-lg-3 col-md-6 col-12\">\n                                <img class=\"img-thumbnail img-fluid\" src=\"./assets/img/gallery/8.jpg\" itemprop=\"thumbnail\" alt=\"Image description\" />\n                            </figure>\n                        </div>\n                        <div class=\"row\">\n                            <figure class=\"col-lg-3 col-md-6 col-12\">\n                                <img class=\"img-thumbnail img-fluid\" src=\"./assets/img/gallery/9.jpg\" itemprop=\"thumbnail\" alt=\"Image description\" />\n                            </figure>\n                            <figure class=\"col-lg-3 col-md-6 col-12\">\n                                <img class=\"img-thumbnail img-fluid\" src=\"./assets/img/gallery/10.jpg\" itemprop=\"thumbnail\" alt=\"Image description\" />\n                            </figure>\n                            <figure class=\"col-lg-3 col-md-6 col-12\">\n                                <img class=\"img-thumbnail img-fluid\" src=\"./assets/img/gallery/11.jpg\" itemprop=\"thumbnail\" alt=\"Image description\" />\n                            </figure>\n                            <figure class=\"col-lg-3 col-md-6 col-12\">\n                                <img class=\"img-thumbnail img-fluid\" src=\"./assets/img/gallery/12.jpg\" itemprop=\"thumbnail\" alt=\"Image description\" />\n                            </figure>\n                        </div>\n                        <div class=\"row\">\n                            <figure class=\"col-lg-3 col-md-6 col-12\">\n                                <img class=\"img-thumbnail img-fluid\" src=\"./assets/img/gallery/13.jpg\" itemprop=\"thumbnail\" alt=\"Image description\" />\n                            </figure>\n                            <figure class=\"col-lg-3 col-md-6 col-12\">\n                                <img class=\"img-thumbnail img-fluid\" src=\"./assets/img/gallery/14.jpg\" itemprop=\"thumbnail\" alt=\"Image description\" />\n                            </figure>\n                            <figure class=\"col-lg-3 col-md-6 col-12\">\n                                <img class=\"img-thumbnail img-fluid\" src=\"./assets/img/gallery/15.jpg\" itemprop=\"thumbnail\" alt=\"Image description\" />\n                            </figure>\n                            <figure class=\"col-lg-3 col-md-6 col-12\">\n                                <img class=\"img-thumbnail img-fluid\" src=\"./assets/img/gallery/16.jpg\" itemprop=\"thumbnail\" alt=\"Image description\" />\n                            </figure>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</section>\n<!--User's uploaded photos section starts-->\n<!--User Profile Starts-->"

/***/ }),

/***/ "./src/app/pages/full-pages/faq/faq.component.scss":
/*!*********************************************************!*\
  !*** ./src/app/pages/full-pages/faq/faq.component.scss ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL2Z1bGwtcGFnZXMvZmFxL2ZhcS5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/pages/full-pages/faq/faq.component.ts":
/*!*******************************************************!*\
  !*** ./src/app/pages/full-pages/faq/faq.component.ts ***!
  \*******************************************************/
/*! exports provided: FaqComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FaqComponent", function() { return FaqComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _faq_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./faq.service */ "./src/app/pages/full-pages/faq/faq.service.ts");



// import { Object } from 'core-js/library/web/timers';
var FaqComponent = /** @class */ (function () {
    function FaqComponent(faqService) {
        this.faqService = faqService;
        this.faqs = faqService.faqs;
    }
    FaqComponent.prototype.filter = function (searchValue) {
        if (searchValue === '') {
            this.faqs = this.faqService.faqs;
        }
        else {
            this.faqs = this.faqService.faqs.filter(function (faqs) { return faqs.title.toUpperCase().indexOf(searchValue.toUpperCase()) != -1 || faqs.content.toUpperCase().indexOf(searchValue.toUpperCase()) != -1; });
        }
    };
    FaqComponent.ctorParameters = function () { return [
        { type: _faq_service__WEBPACK_IMPORTED_MODULE_2__["FaqService"] }
    ]; };
    FaqComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-faq',
            template: __webpack_require__(/*! raw-loader!./faq.component.html */ "./node_modules/raw-loader/index.js!./src/app/pages/full-pages/faq/faq.component.html"),
            providers: [_faq_service__WEBPACK_IMPORTED_MODULE_2__["FaqService"]],
            styles: [__webpack_require__(/*! ./faq.component.scss */ "./src/app/pages/full-pages/faq/faq.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_faq_service__WEBPACK_IMPORTED_MODULE_2__["FaqService"]])
    ], FaqComponent);
    return FaqComponent;
}());



/***/ }),

/***/ "./src/app/pages/full-pages/faq/faq.model.ts":
/*!***************************************************!*\
  !*** ./src/app/pages/full-pages/faq/faq.model.ts ***!
  \***************************************************/
/*! exports provided: FAQ */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FAQ", function() { return FAQ; });
var FAQ = /** @class */ (function () {
    function FAQ(faqId, title, content) {
        this.faqId = faqId;
        this.title = title;
        this.content = content;
    }
    FAQ.ctorParameters = function () { return [
        { type: Number },
        { type: String },
        { type: String }
    ]; };
    return FAQ;
}());



/***/ }),

/***/ "./src/app/pages/full-pages/faq/faq.service.ts":
/*!*****************************************************!*\
  !*** ./src/app/pages/full-pages/faq/faq.service.ts ***!
  \*****************************************************/
/*! exports provided: FaqService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FaqService", function() { return FaqService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _faq_model__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./faq.model */ "./src/app/pages/full-pages/faq/faq.model.ts");



var FaqService = /** @class */ (function () {
    function FaqService() {
        this.faqs = [
            new _faq_model__WEBPACK_IMPORTED_MODULE_2__["FAQ"](1, 'چگونه سرویس دیتای سیم کارت خود را فعال کنیم؟', "Aenean eget leo vel lorem tincidunt tempor sit amet non ex.\n             Aenean porta, velit ut efficitur fringilla, enim est suscipit augue."),
            new _faq_model__WEBPACK_IMPORTED_MODULE_2__["FAQ"](2, 'چگونه تنظیمات اینترنت نوترینو را بر روی گوشی دریافت نماییم؟', "Nam tincidunt rhoncus dolor nec imperdiet. Ut ut mauris tortor. Nulla cursus mattis elit, sed egestas augue laoreet id."),
            new _faq_model__WEBPACK_IMPORTED_MODULE_2__["FAQ"](3, 'چگونه می توانم از فعال بودن سرویس اینترنت گوشی خود مطمئن شوم؟', "Aenean eget leo vel lorem tincidunt tempor sit amet non ex.\n            Aenean porta, velit ut efficitur fringilla, enim est suscipit augue."),
            new _faq_model__WEBPACK_IMPORTED_MODULE_2__["FAQ"](4, 'کدام مناطق تحت پوشش اینترنت نوترینوی همراه اول می باشد؟', "Nam tincidunt rhoncus dolor nec imperdiet. Ut ut mauris tortor. Nulla cursus mattis elit."),
            new _faq_model__WEBPACK_IMPORTED_MODULE_2__["FAQ"](5, 'برای کاهش هزینه سرویس دیتا چه راهکاری وجود دارد؟', "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. "),
            new _faq_model__WEBPACK_IMPORTED_MODULE_2__["FAQ"](6, 'چگونه می توان تمدید خودکار بسته های نوترینو را لغو نمود؟', "Sed sit amet feugiat mi. Morbi dui dui, ultrices id commodo in, commodo ut erat."),
            new _faq_model__WEBPACK_IMPORTED_MODULE_2__["FAQ"](7, 'آیا همراه اول بسته های اینترنت شبانه ارائه می دهد؟', "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et ."),
            new _faq_model__WEBPACK_IMPORTED_MODULE_2__["FAQ"](8, 'در زمان اتصال به سرویس اینترنت نوترینو، هزینه اتصال بر چه مبنایی محاسبه می شود؟', "Sed sit amet feugiat mi. Morbi dui dui, ultrices id commodo in, commodo ut erat. Ut vitae condimentum lorem."),
            new _faq_model__WEBPACK_IMPORTED_MODULE_2__["FAQ"](9, 'آیا با تغییر نام سیم کارت، سرویس اینترنت نوترینو قطع می گردد؟', "Vivamus eu consectetur dui. Pellentesque eu mi et lacus mollis tempor. Etiam sed lobortis sapien. Mauris ultrices."),
            new _faq_model__WEBPACK_IMPORTED_MODULE_2__["FAQ"](10, 'چه شرایطی برای فعال سازی و استفاده از اینترنت نسل ۴ (4G) بر روی سیم کارت لازم است؟', "Integer ornare elementum augue, in scelerisque magna efficitur non. Suspendisse laoreet purus nec augue malesuada auctor. Donec mollis eleifend auctor."),
            new _faq_model__WEBPACK_IMPORTED_MODULE_2__["FAQ"](11, 'چگونه می توان از سرعت اینترنت نوترینوی سیم کارت خود مطلع شوم؟', "Vivamus eu consectetur dui. Pellentesque eu mi et lacus mollis tempor. Etiam sed lobortis sapien. Mauris ultrices bibendum elit, at egestas felis elementum vitae. Mauris viverra nulla vitae pulvinar sollicitudin.\n             "),
            new _faq_model__WEBPACK_IMPORTED_MODULE_2__["FAQ"](12, 'چگونه تنظیمات اینترنت نوترینو را بر روی گوشی دریافت نماییم؟', "Integer ornare elementum augue, in scelerisque magna efficitur non. Suspendisse laoreet purus nec augue malesuada auctor. Donec mollis eleifend auctor. Aliquam arcu erat "),
            new _faq_model__WEBPACK_IMPORTED_MODULE_2__["FAQ"](13, 'تعرفه عادی اینترنت نوترینو چه میزان می باشد؟', "Aenean eget leo vel lorem tincidunt tempor sit amet non ex.\n            Phasellus ut odio in dolor eleifend tincidunt eget id tellus."),
            new _faq_model__WEBPACK_IMPORTED_MODULE_2__["FAQ"](14, 'چگونه نوع پوشش شبکه در مناطق مختلف را می توان تشخیص داد؟', "Integer ornare elementum augue, in scelerisque magna efficitur non. Suspendisse laoreet purus nec augue malesuada auctor.\n             Ut sed viverra neque, nec hendrerit tortor. "),
            new _faq_model__WEBPACK_IMPORTED_MODULE_2__["FAQ"](15, 'آیا پس از اتمام بسته های نوترینو، مصرف بعدی اینترنت با هزینه بیشتری محاسبه می گردد؟', "Enim est suscipit augue, in porta ex nisi quis est.\n            Phasellus ut odio in dolor eleifend tincidunt eget id tellus."),
        ];
    }
    FaqService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], FaqService);
    return FaqService;
}());



/***/ }),

/***/ "./src/app/pages/full-pages/full-pages-routing.module.ts":
/*!***************************************************************!*\
  !*** ./src/app/pages/full-pages/full-pages-routing.module.ts ***!
  \***************************************************************/
/*! exports provided: FullPagesRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FullPagesRoutingModule", function() { return FullPagesRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _gallery_gallery_page_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./gallery/gallery-page.component */ "./src/app/pages/full-pages/gallery/gallery-page.component.ts");
/* harmony import */ var _invoice_invoice_page_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./invoice/invoice-page.component */ "./src/app/pages/full-pages/invoice/invoice-page.component.ts");
/* harmony import */ var _timeline_horizontal_horizontal_timeline_page_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./timeline/horizontal/horizontal-timeline-page.component */ "./src/app/pages/full-pages/timeline/horizontal/horizontal-timeline-page.component.ts");
/* harmony import */ var _timeline_vertical_vertical_timeline_page_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./timeline/vertical/vertical-timeline-page.component */ "./src/app/pages/full-pages/timeline/vertical/vertical-timeline-page.component.ts");
/* harmony import */ var _user_profile_user_profile_page_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./user-profile/user-profile-page.component */ "./src/app/pages/full-pages/user-profile/user-profile-page.component.ts");
/* harmony import */ var _search_search_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./search/search.component */ "./src/app/pages/full-pages/search/search.component.ts");
/* harmony import */ var _faq_faq_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./faq/faq.component */ "./src/app/pages/full-pages/faq/faq.component.ts");
/* harmony import */ var _knowledge_base_knowledge_base_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./knowledge-base/knowledge-base.component */ "./src/app/pages/full-pages/knowledge-base/knowledge-base.component.ts");











var routes = [
    {
        path: '',
        children: [
            {
                path: 'gallery',
                component: _gallery_gallery_page_component__WEBPACK_IMPORTED_MODULE_3__["GalleryPageComponent"],
                data: {
                    title: 'Gallery Page'
                }
            },
            {
                path: 'invoice',
                component: _invoice_invoice_page_component__WEBPACK_IMPORTED_MODULE_4__["InvoicePageComponent"],
                data: {
                    title: 'Invoice Page'
                }
            },
            {
                path: 'horizontaltimeline',
                component: _timeline_horizontal_horizontal_timeline_page_component__WEBPACK_IMPORTED_MODULE_5__["HorizontalTimelinePageComponent"],
                data: {
                    title: 'Horizontal Timeline Page'
                }
            },
            {
                path: 'verticaltimeline',
                component: _timeline_vertical_vertical_timeline_page_component__WEBPACK_IMPORTED_MODULE_6__["VerticalTimelinePageComponent"],
                data: {
                    title: 'Vertical Timeline Page'
                }
            },
            {
                path: 'profile',
                component: _user_profile_user_profile_page_component__WEBPACK_IMPORTED_MODULE_7__["UserProfilePageComponent"],
                data: {
                    title: 'User Profile Page'
                }
            },
            {
                path: 'search',
                component: _search_search_component__WEBPACK_IMPORTED_MODULE_8__["SearchComponent"],
                data: {
                    title: 'Search'
                }
            },
            {
                path: 'faq',
                component: _faq_faq_component__WEBPACK_IMPORTED_MODULE_9__["FaqComponent"],
                data: {
                    title: 'FAQ'
                }
            },
            {
                path: 'kb',
                component: _knowledge_base_knowledge_base_component__WEBPACK_IMPORTED_MODULE_10__["KnowledgeBaseComponent"],
                data: {
                    title: 'Knowledge Base'
                }
            }
        ]
    }
];
var FullPagesRoutingModule = /** @class */ (function () {
    function FullPagesRoutingModule() {
    }
    FullPagesRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]],
        })
    ], FullPagesRoutingModule);
    return FullPagesRoutingModule;
}());



/***/ }),

/***/ "./src/app/pages/full-pages/full-pages.module.ts":
/*!*******************************************************!*\
  !*** ./src/app/pages/full-pages/full-pages.module.ts ***!
  \*******************************************************/
/*! exports provided: FullPagesModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FullPagesModule", function() { return FullPagesModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _full_pages_routing_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./full-pages-routing.module */ "./src/app/pages/full-pages/full-pages-routing.module.ts");
/* harmony import */ var ng_chartist__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ng-chartist */ "./node_modules/ng-chartist/fesm5/ng-chartist.js");
/* harmony import */ var _agm_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @agm/core */ "./node_modules/@agm/core/index.js");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/fesm5/ng-bootstrap.js");
/* harmony import */ var _gallery_gallery_page_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./gallery/gallery-page.component */ "./src/app/pages/full-pages/gallery/gallery-page.component.ts");
/* harmony import */ var _invoice_invoice_page_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./invoice/invoice-page.component */ "./src/app/pages/full-pages/invoice/invoice-page.component.ts");
/* harmony import */ var _timeline_horizontal_horizontal_timeline_page_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./timeline/horizontal/horizontal-timeline-page.component */ "./src/app/pages/full-pages/timeline/horizontal/horizontal-timeline-page.component.ts");
/* harmony import */ var _timeline_horizontal_component_horizontal_timeline_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./timeline/horizontal/component/horizontal-timeline.component */ "./src/app/pages/full-pages/timeline/horizontal/component/horizontal-timeline.component.ts");
/* harmony import */ var _timeline_vertical_vertical_timeline_page_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./timeline/vertical/vertical-timeline-page.component */ "./src/app/pages/full-pages/timeline/vertical/vertical-timeline-page.component.ts");
/* harmony import */ var _user_profile_user_profile_page_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./user-profile/user-profile-page.component */ "./src/app/pages/full-pages/user-profile/user-profile-page.component.ts");
/* harmony import */ var _search_search_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./search/search.component */ "./src/app/pages/full-pages/search/search.component.ts");
/* harmony import */ var _faq_faq_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./faq/faq.component */ "./src/app/pages/full-pages/faq/faq.component.ts");
/* harmony import */ var _knowledge_base_knowledge_base_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./knowledge-base/knowledge-base.component */ "./src/app/pages/full-pages/knowledge-base/knowledge-base.component.ts");

















var FullPagesModule = /** @class */ (function () {
    function FullPagesModule() {
    }
    FullPagesModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _full_pages_routing_module__WEBPACK_IMPORTED_MODULE_4__["FullPagesRoutingModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                ng_chartist__WEBPACK_IMPORTED_MODULE_5__["ChartistModule"],
                _agm_core__WEBPACK_IMPORTED_MODULE_6__["AgmCoreModule"],
                _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_7__["NgbModule"]
            ],
            declarations: [
                _gallery_gallery_page_component__WEBPACK_IMPORTED_MODULE_8__["GalleryPageComponent"],
                _invoice_invoice_page_component__WEBPACK_IMPORTED_MODULE_9__["InvoicePageComponent"],
                _timeline_horizontal_horizontal_timeline_page_component__WEBPACK_IMPORTED_MODULE_10__["HorizontalTimelinePageComponent"],
                _timeline_horizontal_component_horizontal_timeline_component__WEBPACK_IMPORTED_MODULE_11__["HorizontalTimelineComponent"],
                _timeline_vertical_vertical_timeline_page_component__WEBPACK_IMPORTED_MODULE_12__["VerticalTimelinePageComponent"],
                _user_profile_user_profile_page_component__WEBPACK_IMPORTED_MODULE_13__["UserProfilePageComponent"],
                _search_search_component__WEBPACK_IMPORTED_MODULE_14__["SearchComponent"],
                _faq_faq_component__WEBPACK_IMPORTED_MODULE_15__["FaqComponent"],
                _knowledge_base_knowledge_base_component__WEBPACK_IMPORTED_MODULE_16__["KnowledgeBaseComponent"]
            ]
        })
    ], FullPagesModule);
    return FullPagesModule;
}());



/***/ }),

/***/ "./src/app/pages/full-pages/gallery/gallery-page.component.scss":
/*!**********************************************************************!*\
  !*** ./src/app/pages/full-pages/gallery/gallery-page.component.scss ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL2Z1bGwtcGFnZXMvZ2FsbGVyeS9nYWxsZXJ5LXBhZ2UuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/pages/full-pages/gallery/gallery-page.component.ts":
/*!********************************************************************!*\
  !*** ./src/app/pages/full-pages/gallery/gallery-page.component.ts ***!
  \********************************************************************/
/*! exports provided: GalleryPageComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GalleryPageComponent", function() { return GalleryPageComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var GalleryPageComponent = /** @class */ (function () {
    function GalleryPageComponent() {
    }
    GalleryPageComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-gallery-page',
            template: __webpack_require__(/*! raw-loader!./gallery-page.component.html */ "./node_modules/raw-loader/index.js!./src/app/pages/full-pages/gallery/gallery-page.component.html"),
            styles: [__webpack_require__(/*! ./gallery-page.component.scss */ "./src/app/pages/full-pages/gallery/gallery-page.component.scss")]
        })
    ], GalleryPageComponent);
    return GalleryPageComponent;
}());



/***/ }),

/***/ "./src/app/pages/full-pages/invoice/invoice-page.component.scss":
/*!**********************************************************************!*\
  !*** ./src/app/pages/full-pages/invoice/invoice-page.component.scss ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL2Z1bGwtcGFnZXMvaW52b2ljZS9pbnZvaWNlLXBhZ2UuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/pages/full-pages/invoice/invoice-page.component.ts":
/*!********************************************************************!*\
  !*** ./src/app/pages/full-pages/invoice/invoice-page.component.ts ***!
  \********************************************************************/
/*! exports provided: InvoicePageComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InvoicePageComponent", function() { return InvoicePageComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var InvoicePageComponent = /** @class */ (function () {
    function InvoicePageComponent() {
    }
    InvoicePageComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-invoice-page',
            template: __webpack_require__(/*! raw-loader!./invoice-page.component.html */ "./node_modules/raw-loader/index.js!./src/app/pages/full-pages/invoice/invoice-page.component.html"),
            styles: [__webpack_require__(/*! ./invoice-page.component.scss */ "./src/app/pages/full-pages/invoice/invoice-page.component.scss")]
        })
    ], InvoicePageComponent);
    return InvoicePageComponent;
}());



/***/ }),

/***/ "./src/app/pages/full-pages/knowledge-base/knowledge-base.component.scss":
/*!*******************************************************************************!*\
  !*** ./src/app/pages/full-pages/knowledge-base/knowledge-base.component.scss ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL2Z1bGwtcGFnZXMva25vd2xlZGdlLWJhc2Uva25vd2xlZGdlLWJhc2UuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/pages/full-pages/knowledge-base/knowledge-base.component.ts":
/*!*****************************************************************************!*\
  !*** ./src/app/pages/full-pages/knowledge-base/knowledge-base.component.ts ***!
  \*****************************************************************************/
/*! exports provided: KnowledgeBaseComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KnowledgeBaseComponent", function() { return KnowledgeBaseComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/fesm5/ng-bootstrap.js");



var KnowledgeBaseComponent = /** @class */ (function () {
    function KnowledgeBaseComponent(modalService) {
        this.modalService = modalService;
    }
    KnowledgeBaseComponent.prototype.GetDetails = function (content, titleText) {
        this.title = titleText;
        this.modalService.open(content, { size: 'lg' }).result.then(function (result) {
        }, function (reason) {
        });
    };
    KnowledgeBaseComponent.ctorParameters = function () { return [
        { type: _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_2__["NgbModal"] }
    ]; };
    KnowledgeBaseComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-knowledge-base',
            template: __webpack_require__(/*! raw-loader!./knowledge-base.component.html */ "./node_modules/raw-loader/index.js!./src/app/pages/full-pages/knowledge-base/knowledge-base.component.html"),
            styles: [__webpack_require__(/*! ./knowledge-base.component.scss */ "./src/app/pages/full-pages/knowledge-base/knowledge-base.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_2__["NgbModal"]])
    ], KnowledgeBaseComponent);
    return KnowledgeBaseComponent;
}());



/***/ }),

/***/ "./src/app/pages/full-pages/search/search.component.scss":
/*!***************************************************************!*\
  !*** ./src/app/pages/full-pages/search/search.component.scss ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL2Z1bGwtcGFnZXMvc2VhcmNoL3NlYXJjaC5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/pages/full-pages/search/search.component.ts":
/*!*************************************************************!*\
  !*** ./src/app/pages/full-pages/search/search.component.ts ***!
  \*************************************************************/
/*! exports provided: SearchComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SearchComponent", function() { return SearchComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var SearchComponent = /** @class */ (function () {
    function SearchComponent() {
    }
    SearchComponent.prototype.ngOnInit = function () {
    };
    SearchComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-search',
            template: __webpack_require__(/*! raw-loader!./search.component.html */ "./node_modules/raw-loader/index.js!./src/app/pages/full-pages/search/search.component.html"),
            styles: [__webpack_require__(/*! ./search.component.scss */ "./src/app/pages/full-pages/search/search.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], SearchComponent);
    return SearchComponent;
}());



/***/ }),

/***/ "./src/app/pages/full-pages/timeline/horizontal/component/horizontal-timeline.component.scss":
/*!***************************************************************************************************!*\
  !*** ./src/app/pages/full-pages/timeline/horizontal/component/horizontal-timeline.component.scss ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".cd-horizontal-timeline .events-content {\n  margin: 1rem 0; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcGFnZXMvZnVsbC1wYWdlcy90aW1lbGluZS9ob3Jpem9udGFsL2NvbXBvbmVudC9DOlxcVXNlcnNcXFNfTWFub3VjaGVocmlcXERlc2t0b3BcXHRlcmlhemggcmF5YXZhcmFuIDggcGFnZXMvc3JjXFxhcHBcXHBhZ2VzXFxmdWxsLXBhZ2VzXFx0aW1lbGluZVxcaG9yaXpvbnRhbFxcY29tcG9uZW50XFxob3Jpem9udGFsLXRpbWVsaW5lLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBRUksY0FBYyxFQUFBIiwiZmlsZSI6InNyYy9hcHAvcGFnZXMvZnVsbC1wYWdlcy90aW1lbGluZS9ob3Jpem9udGFsL2NvbXBvbmVudC9ob3Jpem9udGFsLXRpbWVsaW5lLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmNkLWhvcml6b250YWwtdGltZWxpbmUge1xuICAuZXZlbnRzLWNvbnRlbnQge1xuICAgIG1hcmdpbjogMXJlbSAwO1xuICB9XG59XG4iXX0= */"

/***/ }),

/***/ "./src/app/pages/full-pages/timeline/horizontal/component/horizontal-timeline.component.ts":
/*!*************************************************************************************************!*\
  !*** ./src/app/pages/full-pages/timeline/horizontal/component/horizontal-timeline.component.ts ***!
  \*************************************************************************************************/
/*! exports provided: HorizontalTimelineComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HorizontalTimelineComponent", function() { return HorizontalTimelineComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/animations */ "./node_modules/@angular/animations/fesm5/animations.js");



var HorizontalTimelineComponent = /** @class */ (function () {
    function HorizontalTimelineComponent(_cdr) {
        this._cdr = _cdr;
        this.prevLinkInactive = true;
        this.nextLinkInactive = false;
        this.loaded = false;
        this.selectedIndex = 0;
        this.eventsWrapperWidth = 0;
        this._viewInitialized = false;
        this._timelineWrapperWidth = 720;
        this._eventsMinDistance = 80;
        this._dateFormat = 'dd.MM.yyyy';
        this._dateFormatTop = 'dd MMM';
        this._disabled = false;
        this._showContent = false;
    }
    HorizontalTimelineComponent_1 = HorizontalTimelineComponent;
    Object.defineProperty(HorizontalTimelineComponent.prototype, "timelineWrapperWidth", {
        set: function (value) {
            this._timelineWrapperWidth = value;
            this._cdr.detectChanges();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HorizontalTimelineComponent.prototype, "eventsMinDistance", {
        set: function (value) {
            this._eventsMinDistance = value;
            this.initView();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HorizontalTimelineComponent.prototype, "timelineElements", {
        get: function () {
            return this._timelineElements;
        },
        set: function (value) {
            this._timelineElements = value;
            this.initView();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HorizontalTimelineComponent.prototype, "dateFormat", {
        get: function () {
            return this._dateFormat;
        },
        set: function (value) {
            this._dateFormat = value;
            this.initView();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HorizontalTimelineComponent.prototype, "dateFormatTop", {
        get: function () {
            return this._dateFormatTop;
        },
        set: function (value) {
            this._dateFormatTop = value;
            this.initView();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HorizontalTimelineComponent.prototype, "disabled", {
        set: function (value) {
            this._disabled = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HorizontalTimelineComponent.prototype, "showContent", {
        get: function () {
            return this._showContent;
        },
        set: function (value) {
            this._showContent = value;
            this._cdr.detectChanges();
        },
        enumerable: true,
        configurable: true
    });
    HorizontalTimelineComponent.pxToNumber = function (val) {
        return Number(val.replace('px', ''));
    };
    HorizontalTimelineComponent.getElementWidth = function (element) {
        var computedStyle = window.getComputedStyle(element);
        if (!computedStyle.width) {
            return 0;
        }
        return HorizontalTimelineComponent_1.pxToNumber(computedStyle.width);
    };
    HorizontalTimelineComponent.parentElement = function (element, tagName) {
        if (!element || !element.parentNode) {
            return null;
        }
        var parent = element.parentNode;
        while (true) {
            if (parent.tagName.toLowerCase() == tagName) {
                return parent;
            }
            parent = parent.parentNode;
            if (!parent) {
                return null;
            }
        }
    };
    HorizontalTimelineComponent.getTranslateValue = function (timeline) {
        var timelineStyle = window.getComputedStyle(timeline);
        var timelineTranslate = timelineStyle.getPropertyValue('-webkit-transform') ||
            timelineStyle.getPropertyValue('-moz-transform') ||
            timelineStyle.getPropertyValue('-ms-transform') ||
            timelineStyle.getPropertyValue('-o-transform') ||
            timelineStyle.getPropertyValue('transform');
        var translateValue = 0;
        if (timelineTranslate.indexOf('(') >= 0) {
            var timelineTranslateStr = timelineTranslate
                .split('(')[1]
                .split(')')[0]
                .split(',')[4];
            translateValue = Number(timelineTranslateStr);
        }
        return translateValue;
    };
    HorizontalTimelineComponent.setTransformValue = function (element, property, value) {
        element.style['-webkit-transform'] = property + '(' + value + ')';
        element.style['-moz-transform'] = property + '(' + value + ')';
        element.style['-ms-transform'] = property + '(' + value + ')';
        element.style['-o-transform'] = property + '(' + value + ')';
        element.style['transform'] = property + '(' + value + ')';
    };
    HorizontalTimelineComponent.dayDiff = function (first, second) {
        return Math.round(second.getTime() - first.getTime());
    };
    HorizontalTimelineComponent.minLapse = function (elements) {
        if (elements && elements.length && elements.length === 1) {
            return 0;
        }
        var result = 0;
        for (var i = 1; i < elements.length; i++) {
            var distance = HorizontalTimelineComponent_1.dayDiff(elements[i - 1].date, elements[i].date);
            result = result ? Math.min(result, distance) : distance;
        }
        return result;
    };
    HorizontalTimelineComponent.prototype.ngAfterViewInit = function () {
        this._cdr.detach();
        this._viewInitialized = true;
        this.initView();
    };
    HorizontalTimelineComponent.prototype.onScrollClick = function (event, forward) {
        event.preventDefault();
        this.updateSlide(this.eventsWrapperWidth, forward);
        this._cdr.detectChanges();
    };
    HorizontalTimelineComponent.prototype.onEventClick = function (event, selectedItem) {
        event.preventDefault();
        if (this._disabled) {
            return;
        }
        var element = event.target;
        // detect click on the a single event - show new event content
        var visibleItem = this._timelineElements[0];
        this._timelineElements.forEach(function (item) {
            if (item.selected && item != selectedItem) {
                visibleItem = item;
                item.selected = false;
            }
        });
        this.selectedIndex = this._timelineElements.indexOf(selectedItem);
        selectedItem.selected = true;
        this.updateFilling(element);
        this._cdr.detectChanges();
    };
    HorizontalTimelineComponent.prototype.initTimeline = function (timeLines) {
        var eventsMinLapse = HorizontalTimelineComponent_1.minLapse(timeLines);
        // assign a left position to the single events along the timeline
        this.setDatePosition(timeLines, this._eventsMinDistance, eventsMinLapse);
        // assign a width to the timeline
        this.setTimelineWidth(timeLines, this._eventsMinDistance, eventsMinLapse);
        // the timeline has been initialize - show it
        this.loaded = true;
    };
    HorizontalTimelineComponent.prototype.updateSlide = function (timelineTotWidth, forward) {
        var translateValue = HorizontalTimelineComponent_1.getTranslateValue(this.eventsWrapper.nativeElement);
        if (forward) {
            this.translateTimeline(translateValue - this._timelineWrapperWidth + this._eventsMinDistance, this._timelineWrapperWidth - timelineTotWidth);
        }
        else {
            this.translateTimeline(translateValue + this._timelineWrapperWidth - this._eventsMinDistance, null);
        }
    };
    HorizontalTimelineComponent.prototype.updateTimelinePosition = function (element) {
        var eventStyle = window.getComputedStyle(element);
        var eventLeft = HorizontalTimelineComponent_1.pxToNumber(eventStyle.getPropertyValue('left'));
        var translateValue = HorizontalTimelineComponent_1.getTranslateValue(this.eventsWrapper.nativeElement);
        if (eventLeft > this._timelineWrapperWidth - translateValue) {
            this.translateTimeline(-eventLeft + this._timelineWrapperWidth / 2, this._timelineWrapperWidth - this.eventsWrapperWidth);
        }
    };
    HorizontalTimelineComponent.prototype.translateTimeline = function (value, totWidth) {
        // only negative translate value
        value = (value > 0) ? 0 : value;
        // do not translate more than timeline width
        value = (!(totWidth === null) && value < totWidth) ? totWidth : value;
        HorizontalTimelineComponent_1.setTransformValue(this.eventsWrapper.nativeElement, 'translateX', value + 'px');
        // update navigation arrows visibility
        this.prevLinkInactive = value === 0;
        this.nextLinkInactive = value === totWidth;
    };
    HorizontalTimelineComponent.prototype.setTimelineWidth = function (elements, width, eventsMinLapse) {
        var timeSpan = 100;
        if (elements.length > 1) {
            timeSpan = HorizontalTimelineComponent_1.dayDiff(elements[0].date, elements[elements.length - 1].date);
        }
        var timeSpanNorm = timeSpan / eventsMinLapse;
        timeSpanNorm = Math.round(timeSpanNorm) + 4;
        this.eventsWrapperWidth = timeSpanNorm * width;
        var aHref = this.eventsWrapper.nativeElement.querySelectorAll('a.selected')[0];
        this.updateFilling(aHref);
        this.updateTimelinePosition(aHref);
        return this.eventsWrapperWidth;
    };
    HorizontalTimelineComponent.prototype.updateFilling = function (element) {
        // change .filling-line length according to the selected event
        var eventStyle = window.getComputedStyle(element);
        var eventLeft = eventStyle.getPropertyValue('left');
        var eventWidth = eventStyle.getPropertyValue('width');
        var eventLeftNum = HorizontalTimelineComponent_1.pxToNumber(eventLeft) + HorizontalTimelineComponent_1.pxToNumber(eventWidth) / 2;
        var scaleValue = eventLeftNum / this.eventsWrapperWidth;
        HorizontalTimelineComponent_1.setTransformValue(this.fillingLine.nativeElement, 'scaleX', scaleValue);
    };
    HorizontalTimelineComponent.prototype.initView = function () {
        if (!this._viewInitialized) {
            return;
        }
        if (this._timelineElements && this._timelineElements.length) {
            for (var i = 0; i < this._timelineElements.length; i++) {
                if (this._timelineElements[i].selected) {
                    this.selectedIndex = i;
                    break;
                }
            }
            this.initTimeline(this._timelineElements);
        }
        this._cdr.detectChanges();
    };
    HorizontalTimelineComponent.prototype.setDatePosition = function (elements, min, eventsMinLapse) {
        var timelineEventsArray = this.timelineEvents.toArray();
        var i = 0;
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var component = elements_1[_i];
            var distance = HorizontalTimelineComponent_1.dayDiff(elements[0].date, component.date);
            var distanceNorm = Math.round(distance / eventsMinLapse);
            timelineEventsArray[i].nativeElement.style.left = distanceNorm * min + 'px';
            // span
            var span = timelineEventsArray[i].nativeElement.parentElement.children[1];
            var spanWidth = HorizontalTimelineComponent_1.getElementWidth(span);
            span.style.left = distanceNorm * min + spanWidth / 2 + 'px';
            i++;
        }
    };
    var HorizontalTimelineComponent_1;
    HorizontalTimelineComponent.ctorParameters = function () { return [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('eventsWrapper', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], HorizontalTimelineComponent.prototype, "eventsWrapper", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('fillingLine', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], HorizontalTimelineComponent.prototype, "fillingLine", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChildren"])('timelineEvents'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["QueryList"])
    ], HorizontalTimelineComponent.prototype, "timelineEvents", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [Number])
    ], HorizontalTimelineComponent.prototype, "timelineWrapperWidth", null);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [Number])
    ], HorizontalTimelineComponent.prototype, "eventsMinDistance", null);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [Array])
    ], HorizontalTimelineComponent.prototype, "timelineElements", null);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [String])
    ], HorizontalTimelineComponent.prototype, "dateFormat", null);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [String])
    ], HorizontalTimelineComponent.prototype, "dateFormatTop", null);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [Boolean])
    ], HorizontalTimelineComponent.prototype, "disabled", null);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [Boolean])
    ], HorizontalTimelineComponent.prototype, "showContent", null);
    HorizontalTimelineComponent = HorizontalTimelineComponent_1 = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'horizontal-timeline',
            template: __webpack_require__(/*! raw-loader!./horizontal-timeline.component.html */ "./node_modules/raw-loader/index.js!./src/app/pages/full-pages/timeline/horizontal/component/horizontal-timeline.component.html"),
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectionStrategy"].OnPush,
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["trigger"])('contentState', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["state"])('active', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["style"])({
                        position: 'relative', 'z-index': 2, opacity: 1,
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["transition"])('right => active', [
                        Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["style"])({
                            transform: 'translateX(100%)'
                        }),
                        Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["animate"])('400ms ease-in-out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["keyframes"])([
                            Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["style"])({ opacity: 0, transform: 'translateX(100%)', offset: 0 }),
                            Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["style"])({ opacity: 1, transform: 'translateX(0%)', offset: 1.0 })
                        ]))
                    ]),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["transition"])('active => right', [
                        Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["style"])({
                            transform: 'translateX(-100%)'
                        }),
                        Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["animate"])('400ms ease-in-out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["keyframes"])([
                            Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["style"])({ opacity: 1, transform: 'translateX(0%)', offset: 0 }),
                            Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["style"])({ opacity: 0, transform: 'translateX(100%)', offset: 1.0 })
                        ]))
                    ]),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["transition"])('active => left', [
                        Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["style"])({
                            transform: 'translateX(-100%)'
                        }),
                        Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["animate"])('400ms ease-in-out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["keyframes"])([
                            Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["style"])({ opacity: 1, transform: 'translateX(0%)', offset: 0 }),
                            Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["style"])({ opacity: 0, transform: 'translateX(-100%)', offset: 1.0 })
                        ]))
                    ]),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["transition"])('left => active', [
                        Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["style"])({
                            transform: 'translateX(100%)'
                        }),
                        Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["animate"])('400ms ease-in-out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["keyframes"])([
                            Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["style"])({ opacity: 0, transform: 'translateX(-100%)', offset: 0 }),
                            Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["style"])({ opacity: 1, transform: 'translateX(0%)', offset: 1.0 })
                        ]))
                    ]),
                ])
            ],
            styles: [__webpack_require__(/*! ./horizontal-timeline.component.scss */ "./src/app/pages/full-pages/timeline/horizontal/component/horizontal-timeline.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"]])
    ], HorizontalTimelineComponent);
    return HorizontalTimelineComponent;
}());



/***/ }),

/***/ "./src/app/pages/full-pages/timeline/horizontal/horizontal-timeline-page.component.scss":
/*!**********************************************************************************************!*\
  !*** ./src/app/pages/full-pages/timeline/horizontal/horizontal-timeline-page.component.scss ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL2Z1bGwtcGFnZXMvdGltZWxpbmUvaG9yaXpvbnRhbC9ob3Jpem9udGFsLXRpbWVsaW5lLXBhZ2UuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/pages/full-pages/timeline/horizontal/horizontal-timeline-page.component.ts":
/*!********************************************************************************************!*\
  !*** ./src/app/pages/full-pages/timeline/horizontal/horizontal-timeline-page.component.ts ***!
  \********************************************************************************************/
/*! exports provided: HorizontalTimelinePageComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HorizontalTimelinePageComponent", function() { return HorizontalTimelinePageComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var HorizontalTimelinePageComponent = /** @class */ (function () {
    function HorizontalTimelinePageComponent() {
        this.content = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum praesentium officia, fugit recusandae \n    ipsa, quia velit nulla adipisci? Consequuntur aspernatur at, eaque hic repellendus sit dicta consequatur quae, \n    ut harum ipsam molestias maxime non nisi reiciendis eligendi! Doloremque quia pariatur harum ea amet quibusdam \n    quisquam, quae, temporibus dolores porro doloribus.";
        this.timeline = [
            { date: new Date(2014, 1, 16), selected: true, title: 'Horizontal Timeline', content: this.content },
            { date: new Date(2014, 2, 28), title: 'Event title here', content: this.content },
            { date: new Date(2014, 3, 20), title: 'Event title here', content: this.content },
            { date: new Date(2014, 5, 20), title: 'Event title here', content: this.content },
            { date: new Date(2014, 7, 9), title: 'Event title here', content: this.content },
            { date: new Date(2014, 8, 30), title: 'Event title here', content: this.content },
            { date: new Date(2014, 9, 15), title: 'Event title here', content: this.content },
            { date: new Date(2014, 11, 1), title: 'Event title here', content: this.content },
            { date: new Date(2014, 12, 10), title: 'Event title here', content: this.content },
            { date: new Date(2015, 1, 19), title: 'Event title here', content: this.content },
            { date: new Date(2015, 3, 3), title: 'Event title here', content: this.content },
        ];
    }
    HorizontalTimelinePageComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-horizontal-timeline-page',
            template: __webpack_require__(/*! raw-loader!./horizontal-timeline-page.component.html */ "./node_modules/raw-loader/index.js!./src/app/pages/full-pages/timeline/horizontal/horizontal-timeline-page.component.html"),
            styles: [__webpack_require__(/*! ./horizontal-timeline-page.component.scss */ "./src/app/pages/full-pages/timeline/horizontal/horizontal-timeline-page.component.scss")]
        })
    ], HorizontalTimelinePageComponent);
    return HorizontalTimelinePageComponent;
}());



/***/ }),

/***/ "./src/app/pages/full-pages/timeline/vertical/vertical-timeline-page.component.scss":
/*!******************************************************************************************!*\
  !*** ./src/app/pages/full-pages/timeline/vertical/vertical-timeline-page.component.scss ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host /deep/ .ct-area {\n  stroke: none;\n  fill-opacity: 0.1; }\n\n:host /deep/ .ct-grid {\n  stroke-dasharray: 0px;\n  stroke: rgba(0, 0, 0, 0.1); }\n\n:host /deep/ .ct-label {\n  font-size: 0.9rem; }\n\n:host /deep/ .lineArea1 .ct-series-a .ct-area {\n  fill-opacity: 0.3;\n  fill: #FF586B; }\n\n:host /deep/ .lineArea1 .ct-series-b .ct-area {\n  fill: #FF586B;\n  fill-opacity: 0.6; }\n\n:host /deep/ .lineArea1 .ct-line {\n  stroke: #FF586B;\n  stroke-width: 0px; }\n\n:host /deep/ .lineArea1 .ct-point {\n  stroke-width: 0px; }\n\nagm-map {\n  height: 450px; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcGFnZXMvZnVsbC1wYWdlcy90aW1lbGluZS92ZXJ0aWNhbC9DOlxcVXNlcnNcXFNfTWFub3VjaGVocmlcXERlc2t0b3BcXHRlcmlhemggcmF5YXZhcmFuIDggcGFnZXMvc3JjXFxhcHBcXHBhZ2VzXFxmdWxsLXBhZ2VzXFx0aW1lbGluZVxcdmVydGljYWxcXHZlcnRpY2FsLXRpbWVsaW5lLXBhZ2UuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxZQUFZO0VBQ1osaUJBQWlCLEVBQUE7O0FBR3JCO0VBQ0kscUJBQXFCO0VBQ3JCLDBCQUEwQixFQUFBOztBQUc5QjtFQUNJLGlCQUFpQixFQUFBOztBQUtyQjtFQUNJLGlCQUFpQjtFQUNqQixhQUFhLEVBQUE7O0FBR2pCO0VBQ0ksYUFBYTtFQUNiLGlCQUFpQixFQUFBOztBQUVyQjtFQUNJLGVBQWU7RUFDZixpQkFBaUIsRUFBQTs7QUFFckI7RUFDSSxpQkFBaUIsRUFBQTs7QUFLckI7RUFDSSxhQUFhLEVBQUEiLCJmaWxlIjoic3JjL2FwcC9wYWdlcy9mdWxsLXBhZ2VzL3RpbWVsaW5lL3ZlcnRpY2FsL3ZlcnRpY2FsLXRpbWVsaW5lLXBhZ2UuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyI6aG9zdCAvZGVlcC8gLmN0LWFyZWEge1xuICAgIHN0cm9rZTogbm9uZTtcbiAgICBmaWxsLW9wYWNpdHk6IDAuMTtcbn1cblxuOmhvc3QgL2RlZXAvIC5jdC1ncmlke1xuICAgIHN0cm9rZS1kYXNoYXJyYXk6IDBweDtcbiAgICBzdHJva2U6IHJnYmEoMCwgMCwgMCwgMC4xKTtcbn1cblxuOmhvc3QgL2RlZXAvIC5jdC1sYWJlbHtcbiAgICBmb250LXNpemU6IDAuOXJlbTtcbn1cblxuLy8gTGluZSB3aXRoIEFyZWEgQ2hhcnQgMSBDU1MgU3RhcnRzXG5cbjpob3N0IC9kZWVwLyAubGluZUFyZWExIC5jdC1zZXJpZXMtYSAuY3QtYXJlYSB7XG4gICAgZmlsbC1vcGFjaXR5OiAwLjM7XG4gICAgZmlsbDogI0ZGNTg2Qjtcbn1cblxuOmhvc3QgL2RlZXAvIC5saW5lQXJlYTEgLmN0LXNlcmllcy1iIC5jdC1hcmVhIHtcbiAgICBmaWxsOiAjRkY1ODZCO1xuICAgIGZpbGwtb3BhY2l0eTogMC42O1xufVxuOmhvc3QgL2RlZXAvIC5saW5lQXJlYTEgLmN0LWxpbmV7XG4gICAgc3Ryb2tlOiAjRkY1ODZCO1xuICAgIHN0cm9rZS13aWR0aDogMHB4O1xufVxuOmhvc3QgL2RlZXAvIC5saW5lQXJlYTEgLmN0LXBvaW50IHtcbiAgICBzdHJva2Utd2lkdGg6IDBweDtcbn1cblxuLy8gTGluZSB3aXRoIEFyZWEgQ2hhcnQgMSBDU1MgRW5kc1xuXG5hZ20tbWFwIHtcbiAgICBoZWlnaHQ6IDQ1MHB4O1xuICB9Il19 */"

/***/ }),

/***/ "./src/app/pages/full-pages/timeline/vertical/vertical-timeline-page.component.ts":
/*!****************************************************************************************!*\
  !*** ./src/app/pages/full-pages/timeline/vertical/vertical-timeline-page.component.ts ***!
  \****************************************************************************************/
/*! exports provided: VerticalTimelinePageComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VerticalTimelinePageComponent", function() { return VerticalTimelinePageComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var data = __webpack_require__(/*! ../../../../shared/data/chartist.json */ "./src/app/shared/data/chartist.json");
var VerticalTimelinePageComponent = /** @class */ (function () {
    function VerticalTimelinePageComponent() {
        // Google map lat-long
        this.lat = 40.650002;
        this.lng = -73.949997;
        // Line with Area Chart 1 Starts
        this.lineArea1 = {
            type: 'Line',
            data: data['lineArea1'],
            options: {
                low: 0,
                showArea: true,
                fullWidth: true,
                onlyInteger: true,
                axisY: {
                    low: 0,
                    scaleMinSpace: 50,
                },
                axisX: {
                    showGrid: false
                }
            },
            events: {
                created: function (data) {
                    var defs = data.svg.elem('defs');
                    defs.elem('linearGradient', {
                        id: 'gradient',
                        x1: 0,
                        y1: 1,
                        x2: 0,
                        y2: 0
                    }).elem('stop', {
                        offset: 0,
                        'stop-color': 'rgba(255, 255, 255, 1)'
                    }).parent().elem('stop', {
                        offset: 1,
                        'stop-color': 'rgba(38, 198, 218, 1)'
                    });
                },
            },
        };
        // Line with Area Chart 1 Ends
    }
    VerticalTimelinePageComponent.prototype.ngOnInit = function () {
    };
    VerticalTimelinePageComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-vertical-timeline-page',
            template: __webpack_require__(/*! raw-loader!./vertical-timeline-page.component.html */ "./node_modules/raw-loader/index.js!./src/app/pages/full-pages/timeline/vertical/vertical-timeline-page.component.html"),
            styles: [__webpack_require__(/*! ./vertical-timeline-page.component.scss */ "./src/app/pages/full-pages/timeline/vertical/vertical-timeline-page.component.scss")]
        })
    ], VerticalTimelinePageComponent);
    return VerticalTimelinePageComponent;
}());



/***/ }),

/***/ "./src/app/pages/full-pages/user-profile/user-profile-page.component.scss":
/*!********************************************************************************!*\
  !*** ./src/app/pages/full-pages/user-profile/user-profile-page.component.scss ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".profile-menu .active {\n  border-bottom: 2px solid;\n  margin-bottom: -2px; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcGFnZXMvZnVsbC1wYWdlcy91c2VyLXByb2ZpbGUvQzpcXFVzZXJzXFxTX01hbm91Y2hlaHJpXFxEZXNrdG9wXFx0ZXJpYXpoIHJheWF2YXJhbiA4IHBhZ2VzL3NyY1xcYXBwXFxwYWdlc1xcZnVsbC1wYWdlc1xcdXNlci1wcm9maWxlXFx1c2VyLXByb2ZpbGUtcGFnZS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUVRLHdCQUF3QjtFQUN4QixtQkFBbUIsRUFBQSIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL2Z1bGwtcGFnZXMvdXNlci1wcm9maWxlL3VzZXItcHJvZmlsZS1wYWdlLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnByb2ZpbGUtbWVudXtcbiAgICAuYWN0aXZle1xuICAgICAgICBib3JkZXItYm90dG9tOiAycHggc29saWQ7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IC0ycHg7XG4gICAgfVxufSJdfQ== */"

/***/ }),

/***/ "./src/app/pages/full-pages/user-profile/user-profile-page.component.ts":
/*!******************************************************************************!*\
  !*** ./src/app/pages/full-pages/user-profile/user-profile-page.component.ts ***!
  \******************************************************************************/
/*! exports provided: UserProfilePageComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserProfilePageComponent", function() { return UserProfilePageComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var UserProfilePageComponent = /** @class */ (function () {
    function UserProfilePageComponent() {
        //Variable Declaration
        this.currentPage = "About";
    }
    UserProfilePageComponent.prototype.ngOnInit = function () {
    };
    UserProfilePageComponent.prototype.showPage = function (page) {
        this.currentPage = page;
    };
    UserProfilePageComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-user-profile-page',
            template: __webpack_require__(/*! raw-loader!./user-profile-page.component.html */ "./node_modules/raw-loader/index.js!./src/app/pages/full-pages/user-profile/user-profile-page.component.html"),
            styles: [__webpack_require__(/*! ./user-profile-page.component.scss */ "./src/app/pages/full-pages/user-profile/user-profile-page.component.scss")]
        })
    ], UserProfilePageComponent);
    return UserProfilePageComponent;
}());



/***/ }),

/***/ "./src/app/shared/data/chartist.json":
/*!*******************************************!*\
  !*** ./src/app/shared/data/chartist.json ***!
  \*******************************************/
/*! exports provided: Bar, Line3, ScatterLine, Scatter, lineArea4, lineArea3, lineArea2, lineAreaDashboard, lineArea1, Bi-PolarLine, DistributedSeries, donut, donutDashboard, DashboardDonut, LineDashboard, line2, line1, WidgetlineChart, WidgetlineChart2, WidgetlineChart3, DashboardBar, Stackbarchart, default */
/***/ (function(module) {

module.exports = {"Bar":{"labels":["فروردین","اردیبهشت","خرداد","تیر"],"series":[[5,4,3,7],[3,2,9,5]]},"Line3":{"labels":["2شن","3شن","4شن","5شن","جمعه","شنبه","شن"],"series":[[12,9,7,4,5,6,6],[2,1,10,7,3,7,2],[1,10,2,10,6,2,8]]},"ScatterLine":{"labels":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],"series":[[5,5,10,8,7,5,4,null,null,null,10,10,7,8,6,9],[10,15,null,12,null,10,12,15,null,null,12,null,14,null,null,null],[null,null,null,null,3,4,1,3,4,6,7,9,5,null,null,null]]},"Scatter":{"labels":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52],"series":[[53.761530227932376,55.06077543488965,90.15619763154757,37.945743703232026,90.15064659594809,72.37213982905773,29.242023161826005,10.613377393892765,41.13272180459888,66.89170357483623,85.47173517613665,80.61313435041848,33.86466777842112,6.993834151672074,58.93321826442517,84.4944785171936,66.47863439014286,26.61792342884319,64.7715312645164,66.7721238997995,24.81459377695263,82.09485043326285,94.28939258245515,81.16315118589196,26.285515136087987,94.25034710171474,82.86738500874603,42.275860431799764,7.252221593822195,12.509815755028853,57.592396396889086,16.98227807583916,82.13296667627357,20.7798608815297,1.4886093931434141,27.717128889831557,83.02006467579533,46.825802760236044,4.449951322677559,63.949111152579285,76.2705142938321,92.84217568625859,33.34033701723147,83.32421059421287,30.95015406095809,99.26555827017742,64.73104862164556,58.3205528852039,98.07205383638176,34.217237701943006,76.84029415694194,77.51086205882534],[68.01743447487219,33.569040390627556,55.83518094287856,6.424873491809824,40.24108430485855,12.867529962712322,33.9171424717146,66.13486382709537,75.36042883674916,37.18758127466557,46.080488500245266,40.98286341759507,25.372664387026923,40.063178151024424,73.6495194240123,48.56310577188692,22.903651846539972,91.5635618730181,84.08459591966795,49.153284675642595,34.82239557500657,38.7753190443602,77.57931404198679,78.24594487949813,42.96149738863182,68.87344162290039,73.35891706187205,79.20638493178991,39.862955442611494,67.72254472880542,32.5667298714178,67.8951691474951,68.22845079029227,24.013142038835245,84.77387385278308,81.96540495436318,21.938120212431865,20.591735159801374,44.392082366517926,99.42917256114683,75.80197000496361,44.95928290576234,56.30251437622547,81.39575345403685,46.6480941362678,60.30444929651577,63.904344644822956,96.31525902388087,80.79036620032171,67.94970208668927,81.84914397158013,64.34930133297705],[94.83796449464408,0.05012881656139001,78.03842883107683,86.85066315022306,63.09834842166116,23.82558487142836,95.04013234951407,91.84355248378253,12.28927042529946,91.59027939302398,44.15426456286402,38.40309269293461,3.0323072732378,51.442756807992104,51.067878308530304,68.87925798432126,9.786004373688861,93.42472024399827,7.196590706996409,90.61672585107475,82.64800742042794,29.33983554466535,27.575295787547738,63.76900610636933,44.31691167371892,35.02049600051234,77.91406665575869,9.594366007019817,33.17507518940415,45.94854823450043,6.028395302814493,97.3630390093578,20.735238575670635,11.577295085428618,49.377810037702986,7.984978938697163,81.52380171386066,86.62152122764415,46.81516933597669,72.70055546352265,39.482785893198404,2.1729768023229346,32.730007414228865,11.8384494034782,97.04367174876609,37.87839695714026,96.1605067491887,24.340714355822968,90.92986653306863,1.9182109464024322,36.43773292877359,51.562138311337314],[90.93023971442824,91.24607758668748,83.11135627737995,38.89630350329263,47.48702934796674,83.10718371512166,93.40725921590878,62.65211828434698,76.93458061916239,94.13663459332706,15.47636651231441,93.70144628274673,80.7911280644665,32.06886936152644,6.458421962605865,14.668285135928372,10.700783089925082,46.997088144127886,53.02589740808132,15.662154340561152,94.70275097718405,59.27632659816442,53.88591373783527,21.602789791233846,29.326094253488066,8.159091366607441,52.57892041859127,71.68439221439431,61.773032787481455,43.02319475997418,97.7745443722398,41.77024219267196,32.79576671635134,26.614574588124352,96.60428591791621,68.90454201273897,33.39711159158707,94.56531035270376,83.77269890317353,72.91107164394433,50.31188574983041,54.67801129631369,69.65510719649639,59.96153020907791,50.66882388014429,97.73196339743835,12.936677564924759,30.197501751145396,7.071721221094629,60.85688790258899,51.276925828485446,30.951614223635193]]},"lineArea4":{"labels":[1,2,3,4,5,6,7,8],"series":[[5,9,7,8,5,3,5,4]]},"lineArea3":{"labels":[1,2,3,4,5,6,7,8],"series":[[0,5,15,8,15,9,30,0],[0,3,5,2,8,1,5,0]]},"lineArea2":{"labels":["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"],"series":[[5,30,25,55,45,65,60,105,80,110,120,150],[80,95,87,155,140,147,130,180,160,175,165,200]]},"lineAreaDashboard":{"labels":[1,2,3,4,5,6,7,8],"series":[[0,20,10,45,20,36,21,0],[0,5,22,14,32,12,28,0]]},"lineArea1":{"labels":[1,2,3,4,5,6,7,8,9,10],"series":[[10,30,10,35,15,45,15,35,20,30],[0,10,30,10,30,15,30,15,30,0]]},"Bi-PolarLine":{"labels":[1,2,3,4,5,6,7,8],"series":[[1,2,3,1,-2,0,1,0],[-2,-1,-2,-1,-2.5,-1,-2,-1],[0,0,0,1,2,2.5,2,1],[2.5,2,1,0.5,1,0.5,-1,-2.5]]},"DistributedSeries":{"labels":["XS","S","M","L","XL","XXL","XXXL"],"series":[50,70,120,200,180,120,150]},"donut":{"series":[20,10,30,40]},"donutDashboard":{"series":[{"name":"done","className":"ct-done","value":23},{"name":"progress","className":"ct-progress","value":14},{"name":"outstanding","className":"ct-outstanding","value":35},{"name":"started","className":"ct-started","value":28}]},"DashboardDonut":{"series":[{"name":"done","className":"ct-done","value":10},{"name":"outstanding","className":"ct-outstanding","value":3}]},"LineDashboard":{"labels":["2شن","3شن","4شن","5شن","جمعه","شنبه","1شن"],"series":[[80,85,75,65,63,70,82]]},"line2":{"labels":["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"],"series":[[160,150,140,120,75,35,45,65,100,145,160,180],[100,95,90,100,110,120,130,140,130,95,75,80]]},"line1":{"labels":["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور"],"series":[[65,105,145,105,145,185],[125,80,30,70,110,150],[175,190,160,190,140,100]]},"WidgetlineChart":{"labels":["1","2","3","4","5","6","7","8","9","10","11","12","13"],"series":[[50,45,60,55,70,55,60,55,65,57,60,53,53]]},"WidgetlineChart2":{"labels":["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریورe","مهر","آبان"],"series":[[55,60,50,55,50,60,55,57]]},"WidgetlineChart3":{"labels":["فروردین","اردیبهشت","خرداد","تیر","مرداد"],"series":[[50,70,45,75,85]]},"DashboardBar":{"labels":["ورزش","موزیک","گردشگری","اخبار"],"series":[[53,23,40,30]]},"Stackbarchart":{"labels":["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور"],"series":[[8,9,5,6,7,4],[2,1,5,4,3,6]]}};

/***/ })

}]);
//# sourceMappingURL=pages-full-pages-full-pages-module.js.map