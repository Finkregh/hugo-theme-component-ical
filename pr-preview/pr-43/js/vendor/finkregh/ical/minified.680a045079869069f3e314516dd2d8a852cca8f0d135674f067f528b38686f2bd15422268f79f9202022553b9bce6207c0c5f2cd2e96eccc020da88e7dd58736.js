(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/ical.js/build/ical.js
  var require_ical = __commonJS({
    "node_modules/ical.js/build/ical.js"(exports, module) {
      var ICAL2;
      (function() {
        if (typeof module === "object") {
          ICAL2 = module.exports;
        } else if (typeof HTMLScriptElement !== "undefined" && "noModule" in HTMLScriptElement.prototype) {
          window.ICAL = ICAL2 = {};
        } else if (typeof ICAL2 !== "object") {
          ICAL2 = {};
        }
      })();
      ICAL2.foldLength = 75;
      ICAL2.newLineChar = "\r\n";
      ICAL2.helpers = {
        /**
         * Compiles a list of all referenced TZIDs in all subcomponents and
         * removes any extra VTIMEZONE subcomponents. In addition, if any TZIDs
         * are referenced by a component, but a VTIMEZONE does not exist,
         * an attempt will be made to generate a VTIMEZONE using ICAL.TimezoneService.
         *
         * @param {ICAL.Component} vcal     The top-level VCALENDAR component.
         * @return {ICAL.Component}         The ICAL.Component that was passed in.
         */
        updateTimezones: function(vcal) {
          var allsubs, properties, vtimezones, reqTzid, i3, tzid;
          if (!vcal || vcal.name !== "vcalendar") {
            return vcal;
          }
          allsubs = vcal.getAllSubcomponents();
          properties = [];
          vtimezones = {};
          for (i3 = 0; i3 < allsubs.length; i3++) {
            if (allsubs[i3].name === "vtimezone") {
              tzid = allsubs[i3].getFirstProperty("tzid").getFirstValue();
              vtimezones[tzid] = allsubs[i3];
            } else {
              properties = properties.concat(allsubs[i3].getAllProperties());
            }
          }
          reqTzid = {};
          for (i3 = 0; i3 < properties.length; i3++) {
            if (tzid = properties[i3].getParameter("tzid")) {
              reqTzid[tzid] = true;
            }
          }
          for (i3 in vtimezones) {
            if (vtimezones.hasOwnProperty(i3) && !reqTzid[i3]) {
              vcal.removeSubcomponent(vtimezones[i3]);
            }
          }
          for (i3 in reqTzid) {
            if (reqTzid.hasOwnProperty(i3) && !vtimezones[i3] && ICAL2.TimezoneService.has(i3)) {
              vcal.addSubcomponent(ICAL2.TimezoneService.get(i3).component);
            }
          }
          return vcal;
        },
        /**
         * Checks if the given type is of the number type and also NaN.
         *
         * @param {Number} number     The number to check
         * @return {Boolean}          True, if the number is strictly NaN
         */
        isStrictlyNaN: function(number) {
          return typeof number === "number" && isNaN(number);
        },
        /**
         * Parses a string value that is expected to be an integer, when the valid is
         * not an integer throws a decoration error.
         *
         * @param {String} string     Raw string input
         * @return {Number}           Parsed integer
         */
        strictParseInt: function(string) {
          var result = parseInt(string, 10);
          if (ICAL2.helpers.isStrictlyNaN(result)) {
            throw new Error(
              'Could not extract integer from "' + string + '"'
            );
          }
          return result;
        },
        /**
         * Creates or returns a class instance of a given type with the initialization
         * data if the data is not already an instance of the given type.
         *
         * @example
         * var time = new ICAL.Time(...);
         * var result = ICAL.helpers.formatClassType(time, ICAL.Time);
         *
         * (result instanceof ICAL.Time)
         * // => true
         *
         * result = ICAL.helpers.formatClassType({}, ICAL.Time);
         * (result isntanceof ICAL.Time)
         * // => true
         *
         *
         * @param {Object} data       object initialization data
         * @param {Object} type       object type (like ICAL.Time)
         * @return {?}                An instance of the found type.
         */
        formatClassType: function formatClassType(data, type) {
          if (typeof data === "undefined") {
            return void 0;
          }
          if (data instanceof type) {
            return data;
          }
          return new type(data);
        },
        /**
         * Identical to indexOf but will only match values when they are not preceded
         * by a backslash character.
         *
         * @param {String} buffer         String to search
         * @param {String} search         Value to look for
         * @param {Number} pos            Start position
         * @return {Number}               The position, or -1 if not found
         */
        unescapedIndexOf: function(buffer, search, pos) {
          while ((pos = buffer.indexOf(search, pos)) !== -1) {
            if (pos > 0 && buffer[pos - 1] === "\\") {
              pos += 1;
            } else {
              return pos;
            }
          }
          return -1;
        },
        /**
         * Find the index for insertion using binary search.
         *
         * @param {Array} list            The list to search
         * @param {?} seekVal             The value to insert
         * @param {function(?,?)} cmpfunc The comparison func, that can
         *                                  compare two seekVals
         * @return {Number}               The insert position
         */
        binsearchInsert: function(list, seekVal, cmpfunc) {
          if (!list.length)
            return 0;
          var low = 0, high = list.length - 1, mid, cmpval;
          while (low <= high) {
            mid = low + Math.floor((high - low) / 2);
            cmpval = cmpfunc(seekVal, list[mid]);
            if (cmpval < 0)
              high = mid - 1;
            else if (cmpval > 0)
              low = mid + 1;
            else
              break;
          }
          if (cmpval < 0)
            return mid;
          else if (cmpval > 0)
            return mid + 1;
          else
            return mid;
        },
        /**
         * Convenience function for debug output
         * @private
         */
        dumpn: (
          /* istanbul ignore next */
          function() {
            if (!ICAL2.debug) {
              return;
            }
            if (typeof console !== "undefined" && "log" in console) {
              ICAL2.helpers.dumpn = function consoleDumpn(input) {
                console.log(input);
              };
            } else {
              ICAL2.helpers.dumpn = function geckoDumpn(input) {
                dump(input + "\n");
              };
            }
            ICAL2.helpers.dumpn(arguments[0]);
          }
        ),
        /**
         * Clone the passed object or primitive. By default a shallow clone will be
         * executed.
         *
         * @param {*} aSrc            The thing to clone
         * @param {Boolean=} aDeep    If true, a deep clone will be performed
         * @return {*}                The copy of the thing
         */
        clone: function(aSrc, aDeep) {
          if (!aSrc || typeof aSrc != "object") {
            return aSrc;
          } else if (aSrc instanceof Date) {
            return new Date(aSrc.getTime());
          } else if ("clone" in aSrc) {
            return aSrc.clone();
          } else if (Array.isArray(aSrc)) {
            var arr = [];
            for (var i3 = 0; i3 < aSrc.length; i3++) {
              arr.push(aDeep ? ICAL2.helpers.clone(aSrc[i3], true) : aSrc[i3]);
            }
            return arr;
          } else {
            var obj = {};
            for (var name in aSrc) {
              if (Object.prototype.hasOwnProperty.call(aSrc, name)) {
                if (aDeep) {
                  obj[name] = ICAL2.helpers.clone(aSrc[name], true);
                } else {
                  obj[name] = aSrc[name];
                }
              }
            }
            return obj;
          }
        },
        /**
         * Performs iCalendar line folding. A line ending character is inserted and
         * the next line begins with a whitespace.
         *
         * @example
         * SUMMARY:This line will be fold
         *  ed right in the middle of a word.
         *
         * @param {String} aLine      The line to fold
         * @return {String}           The folded line
         */
        foldline: function foldline(aLine) {
          var result = "";
          var line = aLine || "", pos = 0, line_length = 0;
          while (line.length) {
            var cp = line.codePointAt(pos);
            if (cp < 128) ++line_length;
            else if (cp < 2048) line_length += 2;
            else if (cp < 65536) line_length += 3;
            else line_length += 4;
            if (line_length < ICAL2.foldLength + 1)
              pos += cp > 65535 ? 2 : 1;
            else {
              result += ICAL2.newLineChar + " " + line.substring(0, pos);
              line = line.substring(pos);
              pos = line_length = 0;
            }
          }
          return result.substr(ICAL2.newLineChar.length + 1);
        },
        /**
         * Pads the given string or number with zeros so it will have at least two
         * characters.
         *
         * @param {String|Number} data    The string or number to pad
         * @return {String}               The number padded as a string
         */
        pad2: function pad(data) {
          if (typeof data !== "string") {
            if (typeof data === "number") {
              data = parseInt(data);
            }
            data = String(data);
          }
          var len = data.length;
          switch (len) {
            case 0:
              return "00";
            case 1:
              return "0" + data;
            default:
              return data;
          }
        },
        /**
         * Truncates the given number, correctly handling negative numbers.
         *
         * @param {Number} number     The number to truncate
         * @return {Number}           The truncated number
         */
        trunc: function trunc(number) {
          return number < 0 ? Math.ceil(number) : Math.floor(number);
        },
        /**
         * Poor-man's cross-browser inheritance for JavaScript. Doesn't support all
         * the features, but enough for our usage.
         *
         * @param {Function} base     The base class constructor function.
         * @param {Function} child    The child class constructor function.
         * @param {Object} extra      Extends the prototype with extra properties
         *                              and methods
         */
        inherits: function(base, child, extra) {
          function F4() {
          }
          F4.prototype = base.prototype;
          child.prototype = new F4();
          if (extra) {
            ICAL2.helpers.extend(extra, child.prototype);
          }
        },
        /**
         * Poor-man's cross-browser object extension. Doesn't support all the
         * features, but enough for our usage. Note that the target's properties are
         * not overwritten with the source properties.
         *
         * @example
         * var child = ICAL.helpers.extend(parent, {
         *   "bar": 123
         * });
         *
         * @param {Object} source     The object to extend
         * @param {Object} target     The object to extend with
         * @return {Object}           Returns the target.
         */
        extend: function(source, target) {
          for (var key in source) {
            var descr = Object.getOwnPropertyDescriptor(source, key);
            if (descr && !Object.getOwnPropertyDescriptor(target, key)) {
              Object.defineProperty(target, key, descr);
            }
          }
          return target;
        }
      };
      ICAL2.design = (function() {
        "use strict";
        var FROM_ICAL_NEWLINE = /\\\\|\\;|\\,|\\[Nn]/g;
        var TO_ICAL_NEWLINE = /\\|;|,|\n/g;
        var FROM_VCARD_NEWLINE = /\\\\|\\,|\\[Nn]/g;
        var TO_VCARD_NEWLINE = /\\|,|\n/g;
        function createTextType(fromNewline, toNewline) {
          var result = {
            matches: /.*/,
            fromICAL: function(aValue, structuredEscape) {
              return replaceNewline(aValue, fromNewline, structuredEscape);
            },
            toICAL: function(aValue, structuredEscape) {
              var regEx = toNewline;
              if (structuredEscape)
                regEx = new RegExp(regEx.source + "|" + structuredEscape);
              return aValue.replace(regEx, function(str) {
                switch (str) {
                  case "\\":
                    return "\\\\";
                  case ";":
                    return "\\;";
                  case ",":
                    return "\\,";
                  case "\n":
                    return "\\n";
                  /* istanbul ignore next */
                  default:
                    return str;
                }
              });
            }
          };
          return result;
        }
        var DEFAULT_TYPE_TEXT = { defaultType: "text" };
        var DEFAULT_TYPE_TEXT_MULTI = { defaultType: "text", multiValue: "," };
        var DEFAULT_TYPE_TEXT_STRUCTURED = { defaultType: "text", structuredValue: ";" };
        var DEFAULT_TYPE_INTEGER = { defaultType: "integer" };
        var DEFAULT_TYPE_DATETIME_DATE = { defaultType: "date-time", allowedTypes: ["date-time", "date"] };
        var DEFAULT_TYPE_DATETIME = { defaultType: "date-time" };
        var DEFAULT_TYPE_URI = { defaultType: "uri" };
        var DEFAULT_TYPE_UTCOFFSET = { defaultType: "utc-offset" };
        var DEFAULT_TYPE_RECUR = { defaultType: "recur" };
        var DEFAULT_TYPE_DATE_ANDOR_TIME = { defaultType: "date-and-or-time", allowedTypes: ["date-time", "date", "text"] };
        function replaceNewlineReplace(string) {
          switch (string) {
            case "\\\\":
              return "\\";
            case "\\;":
              return ";";
            case "\\,":
              return ",";
            case "\\n":
            case "\\N":
              return "\n";
            /* istanbul ignore next */
            default:
              return string;
          }
        }
        function replaceNewline(value, newline, structuredEscape) {
          if (value.indexOf("\\") === -1) {
            return value;
          }
          if (structuredEscape)
            newline = new RegExp(newline.source + "|\\\\" + structuredEscape);
          return value.replace(newline, replaceNewlineReplace);
        }
        var commonProperties = {
          "categories": DEFAULT_TYPE_TEXT_MULTI,
          "url": DEFAULT_TYPE_URI,
          "version": DEFAULT_TYPE_TEXT,
          "uid": DEFAULT_TYPE_TEXT
        };
        var commonValues = {
          "boolean": {
            values: ["TRUE", "FALSE"],
            fromICAL: function(aValue) {
              switch (aValue) {
                case "TRUE":
                  return true;
                case "FALSE":
                  return false;
                default:
                  return false;
              }
            },
            toICAL: function(aValue) {
              if (aValue) {
                return "TRUE";
              }
              return "FALSE";
            }
          },
          float: {
            matches: /^[+-]?\d+\.\d+$/,
            fromICAL: function(aValue) {
              var parsed = parseFloat(aValue);
              if (ICAL2.helpers.isStrictlyNaN(parsed)) {
                return 0;
              }
              return parsed;
            },
            toICAL: function(aValue) {
              return String(aValue);
            }
          },
          integer: {
            fromICAL: function(aValue) {
              var parsed = parseInt(aValue);
              if (ICAL2.helpers.isStrictlyNaN(parsed)) {
                return 0;
              }
              return parsed;
            },
            toICAL: function(aValue) {
              return String(aValue);
            }
          },
          "utc-offset": {
            toICAL: function(aValue) {
              if (aValue.length < 7) {
                return aValue.substr(0, 3) + aValue.substr(4, 2);
              } else {
                return aValue.substr(0, 3) + aValue.substr(4, 2) + aValue.substr(7, 2);
              }
            },
            fromICAL: function(aValue) {
              if (aValue.length < 6) {
                return aValue.substr(0, 3) + ":" + aValue.substr(3, 2);
              } else {
                return aValue.substr(0, 3) + ":" + aValue.substr(3, 2) + ":" + aValue.substr(5, 2);
              }
            },
            decorate: function(aValue) {
              return ICAL2.UtcOffset.fromString(aValue);
            },
            undecorate: function(aValue) {
              return aValue.toString();
            }
          }
        };
        var icalParams = {
          // Although the syntax is DQUOTE uri DQUOTE, I don't think we should
          // enfoce anything aside from it being a valid content line.
          //
          // At least some params require - if multi values are used - DQUOTEs
          // for each of its values - e.g. delegated-from="uri1","uri2"
          // To indicate this, I introduced the new k/v pair
          // multiValueSeparateDQuote: true
          //
          // "ALTREP": { ... },
          // CN just wants a param-value
          // "CN": { ... }
          "cutype": {
            values: ["INDIVIDUAL", "GROUP", "RESOURCE", "ROOM", "UNKNOWN"],
            allowXName: true,
            allowIanaToken: true
          },
          "delegated-from": {
            valueType: "cal-address",
            multiValue: ",",
            multiValueSeparateDQuote: true
          },
          "delegated-to": {
            valueType: "cal-address",
            multiValue: ",",
            multiValueSeparateDQuote: true
          },
          // "DIR": { ... }, // See ALTREP
          "encoding": {
            values: ["8BIT", "BASE64"]
          },
          // "FMTTYPE": { ... }, // See ALTREP
          "fbtype": {
            values: ["FREE", "BUSY", "BUSY-UNAVAILABLE", "BUSY-TENTATIVE"],
            allowXName: true,
            allowIanaToken: true
          },
          // "LANGUAGE": { ... }, // See ALTREP
          "member": {
            valueType: "cal-address",
            multiValue: ",",
            multiValueSeparateDQuote: true
          },
          "partstat": {
            // TODO These values are actually different per-component
            values: [
              "NEEDS-ACTION",
              "ACCEPTED",
              "DECLINED",
              "TENTATIVE",
              "DELEGATED",
              "COMPLETED",
              "IN-PROCESS"
            ],
            allowXName: true,
            allowIanaToken: true
          },
          "range": {
            values: ["THISANDFUTURE"]
          },
          "related": {
            values: ["START", "END"]
          },
          "reltype": {
            values: ["PARENT", "CHILD", "SIBLING"],
            allowXName: true,
            allowIanaToken: true
          },
          "role": {
            values: [
              "REQ-PARTICIPANT",
              "CHAIR",
              "OPT-PARTICIPANT",
              "NON-PARTICIPANT"
            ],
            allowXName: true,
            allowIanaToken: true
          },
          "rsvp": {
            values: ["TRUE", "FALSE"]
          },
          "sent-by": {
            valueType: "cal-address"
          },
          "tzid": {
            matches: /^\//
          },
          "value": {
            // since the value here is a 'type' lowercase is used.
            values: [
              "binary",
              "boolean",
              "cal-address",
              "date",
              "date-time",
              "duration",
              "float",
              "integer",
              "period",
              "recur",
              "text",
              "time",
              "uri",
              "utc-offset"
            ],
            allowXName: true,
            allowIanaToken: true
          }
        };
        var icalValues = ICAL2.helpers.extend(commonValues, {
          text: createTextType(FROM_ICAL_NEWLINE, TO_ICAL_NEWLINE),
          uri: {
            // TODO
            /* ... */
          },
          "binary": {
            decorate: function(aString) {
              return ICAL2.Binary.fromString(aString);
            },
            undecorate: function(aBinary) {
              return aBinary.toString();
            }
          },
          "cal-address": {
            // needs to be an uri
          },
          "date": {
            decorate: function(aValue, aProp) {
              if (design.strict) {
                return ICAL2.Time.fromDateString(aValue, aProp);
              } else {
                return ICAL2.Time.fromString(aValue, aProp);
              }
            },
            /**
             * undecorates a time object.
             */
            undecorate: function(aValue) {
              return aValue.toString();
            },
            fromICAL: function(aValue) {
              if (!design.strict && aValue.length >= 15) {
                return icalValues["date-time"].fromICAL(aValue);
              } else {
                return aValue.substr(0, 4) + "-" + aValue.substr(4, 2) + "-" + aValue.substr(6, 2);
              }
            },
            toICAL: function(aValue) {
              var len = aValue.length;
              if (len == 10) {
                return aValue.substr(0, 4) + aValue.substr(5, 2) + aValue.substr(8, 2);
              } else if (len >= 19) {
                return icalValues["date-time"].toICAL(aValue);
              } else {
                return aValue;
              }
            }
          },
          "date-time": {
            fromICAL: function(aValue) {
              if (!design.strict && aValue.length == 8) {
                return icalValues.date.fromICAL(aValue);
              } else {
                var result = aValue.substr(0, 4) + "-" + aValue.substr(4, 2) + "-" + aValue.substr(6, 2) + "T" + aValue.substr(9, 2) + ":" + aValue.substr(11, 2) + ":" + aValue.substr(13, 2);
                if (aValue[15] && aValue[15] === "Z") {
                  result += "Z";
                }
                return result;
              }
            },
            toICAL: function(aValue) {
              var len = aValue.length;
              if (len == 10 && !design.strict) {
                return icalValues.date.toICAL(aValue);
              } else if (len >= 19) {
                var result = aValue.substr(0, 4) + aValue.substr(5, 2) + // grab the (DDTHH) segment
                aValue.substr(8, 5) + // MM
                aValue.substr(14, 2) + // SS
                aValue.substr(17, 2);
                if (aValue[19] && aValue[19] === "Z") {
                  result += "Z";
                }
                return result;
              } else {
                return aValue;
              }
            },
            decorate: function(aValue, aProp) {
              if (design.strict) {
                return ICAL2.Time.fromDateTimeString(aValue, aProp);
              } else {
                return ICAL2.Time.fromString(aValue, aProp);
              }
            },
            undecorate: function(aValue) {
              return aValue.toString();
            }
          },
          duration: {
            decorate: function(aValue) {
              return ICAL2.Duration.fromString(aValue);
            },
            undecorate: function(aValue) {
              return aValue.toString();
            }
          },
          period: {
            fromICAL: function(string) {
              var parts = string.split("/");
              parts[0] = icalValues["date-time"].fromICAL(parts[0]);
              if (!ICAL2.Duration.isValueString(parts[1])) {
                parts[1] = icalValues["date-time"].fromICAL(parts[1]);
              }
              return parts;
            },
            toICAL: function(parts) {
              if (!design.strict && parts[0].length == 10) {
                parts[0] = icalValues.date.toICAL(parts[0]);
              } else {
                parts[0] = icalValues["date-time"].toICAL(parts[0]);
              }
              if (!ICAL2.Duration.isValueString(parts[1])) {
                if (!design.strict && parts[1].length == 10) {
                  parts[1] = icalValues.date.toICAL(parts[1]);
                } else {
                  parts[1] = icalValues["date-time"].toICAL(parts[1]);
                }
              }
              return parts.join("/");
            },
            decorate: function(aValue, aProp) {
              return ICAL2.Period.fromJSON(aValue, aProp, !design.strict);
            },
            undecorate: function(aValue) {
              return aValue.toJSON();
            }
          },
          recur: {
            fromICAL: function(string) {
              return ICAL2.Recur._stringToData(string, true);
            },
            toICAL: function(data) {
              var str = "";
              for (var k3 in data) {
                if (!Object.prototype.hasOwnProperty.call(data, k3)) {
                  continue;
                }
                var val = data[k3];
                if (k3 == "until") {
                  if (val.length > 10) {
                    val = icalValues["date-time"].toICAL(val);
                  } else {
                    val = icalValues.date.toICAL(val);
                  }
                } else if (k3 == "wkst") {
                  if (typeof val === "number") {
                    val = ICAL2.Recur.numericDayToIcalDay(val);
                  }
                } else if (Array.isArray(val)) {
                  val = val.join(",");
                }
                str += k3.toUpperCase() + "=" + val + ";";
              }
              return str.substr(0, str.length - 1);
            },
            decorate: function decorate(aValue) {
              return ICAL2.Recur.fromData(aValue);
            },
            undecorate: function(aRecur) {
              return aRecur.toJSON();
            }
          },
          time: {
            fromICAL: function(aValue) {
              if (aValue.length < 6) {
                return aValue;
              }
              var result = aValue.substr(0, 2) + ":" + aValue.substr(2, 2) + ":" + aValue.substr(4, 2);
              if (aValue[6] === "Z") {
                result += "Z";
              }
              return result;
            },
            toICAL: function(aValue) {
              if (aValue.length < 8) {
                return aValue;
              }
              var result = aValue.substr(0, 2) + aValue.substr(3, 2) + aValue.substr(6, 2);
              if (aValue[8] === "Z") {
                result += "Z";
              }
              return result;
            }
          }
        });
        var icalProperties = ICAL2.helpers.extend(commonProperties, {
          "action": DEFAULT_TYPE_TEXT,
          "attach": { defaultType: "uri" },
          "attendee": { defaultType: "cal-address" },
          "calscale": DEFAULT_TYPE_TEXT,
          "class": DEFAULT_TYPE_TEXT,
          "comment": DEFAULT_TYPE_TEXT,
          "completed": DEFAULT_TYPE_DATETIME,
          "contact": DEFAULT_TYPE_TEXT,
          "created": DEFAULT_TYPE_DATETIME,
          "description": DEFAULT_TYPE_TEXT,
          "dtend": DEFAULT_TYPE_DATETIME_DATE,
          "dtstamp": DEFAULT_TYPE_DATETIME,
          "dtstart": DEFAULT_TYPE_DATETIME_DATE,
          "due": DEFAULT_TYPE_DATETIME_DATE,
          "duration": { defaultType: "duration" },
          "exdate": {
            defaultType: "date-time",
            allowedTypes: ["date-time", "date"],
            multiValue: ","
          },
          "exrule": DEFAULT_TYPE_RECUR,
          "freebusy": { defaultType: "period", multiValue: "," },
          "geo": { defaultType: "float", structuredValue: ";" },
          "last-modified": DEFAULT_TYPE_DATETIME,
          "location": DEFAULT_TYPE_TEXT,
          "method": DEFAULT_TYPE_TEXT,
          "organizer": { defaultType: "cal-address" },
          "percent-complete": DEFAULT_TYPE_INTEGER,
          "priority": DEFAULT_TYPE_INTEGER,
          "prodid": DEFAULT_TYPE_TEXT,
          "related-to": DEFAULT_TYPE_TEXT,
          "repeat": DEFAULT_TYPE_INTEGER,
          "rdate": {
            defaultType: "date-time",
            allowedTypes: ["date-time", "date", "period"],
            multiValue: ",",
            detectType: function(string) {
              if (string.indexOf("/") !== -1) {
                return "period";
              }
              return string.indexOf("T") === -1 ? "date" : "date-time";
            }
          },
          "recurrence-id": DEFAULT_TYPE_DATETIME_DATE,
          "resources": DEFAULT_TYPE_TEXT_MULTI,
          "request-status": DEFAULT_TYPE_TEXT_STRUCTURED,
          "rrule": DEFAULT_TYPE_RECUR,
          "sequence": DEFAULT_TYPE_INTEGER,
          "status": DEFAULT_TYPE_TEXT,
          "summary": DEFAULT_TYPE_TEXT,
          "transp": DEFAULT_TYPE_TEXT,
          "trigger": { defaultType: "duration", allowedTypes: ["duration", "date-time"] },
          "tzoffsetfrom": DEFAULT_TYPE_UTCOFFSET,
          "tzoffsetto": DEFAULT_TYPE_UTCOFFSET,
          "tzurl": DEFAULT_TYPE_URI,
          "tzid": DEFAULT_TYPE_TEXT,
          "tzname": DEFAULT_TYPE_TEXT
        });
        var vcardValues = ICAL2.helpers.extend(commonValues, {
          text: createTextType(FROM_VCARD_NEWLINE, TO_VCARD_NEWLINE),
          uri: createTextType(FROM_VCARD_NEWLINE, TO_VCARD_NEWLINE),
          date: {
            decorate: function(aValue) {
              return ICAL2.VCardTime.fromDateAndOrTimeString(aValue, "date");
            },
            undecorate: function(aValue) {
              return aValue.toString();
            },
            fromICAL: function(aValue) {
              if (aValue.length == 8) {
                return icalValues.date.fromICAL(aValue);
              } else if (aValue[0] == "-" && aValue.length == 6) {
                return aValue.substr(0, 4) + "-" + aValue.substr(4);
              } else {
                return aValue;
              }
            },
            toICAL: function(aValue) {
              if (aValue.length == 10) {
                return icalValues.date.toICAL(aValue);
              } else if (aValue[0] == "-" && aValue.length == 7) {
                return aValue.substr(0, 4) + aValue.substr(5);
              } else {
                return aValue;
              }
            }
          },
          time: {
            decorate: function(aValue) {
              return ICAL2.VCardTime.fromDateAndOrTimeString("T" + aValue, "time");
            },
            undecorate: function(aValue) {
              return aValue.toString();
            },
            fromICAL: function(aValue) {
              var splitzone = vcardValues.time._splitZone(aValue, true);
              var zone = splitzone[0], value = splitzone[1];
              if (value.length == 6) {
                value = value.substr(0, 2) + ":" + value.substr(2, 2) + ":" + value.substr(4, 2);
              } else if (value.length == 4 && value[0] != "-") {
                value = value.substr(0, 2) + ":" + value.substr(2, 2);
              } else if (value.length == 5) {
                value = value.substr(0, 3) + ":" + value.substr(3, 2);
              }
              if (zone.length == 5 && (zone[0] == "-" || zone[0] == "+")) {
                zone = zone.substr(0, 3) + ":" + zone.substr(3);
              }
              return value + zone;
            },
            toICAL: function(aValue) {
              var splitzone = vcardValues.time._splitZone(aValue);
              var zone = splitzone[0], value = splitzone[1];
              if (value.length == 8) {
                value = value.substr(0, 2) + value.substr(3, 2) + value.substr(6, 2);
              } else if (value.length == 5 && value[0] != "-") {
                value = value.substr(0, 2) + value.substr(3, 2);
              } else if (value.length == 6) {
                value = value.substr(0, 3) + value.substr(4, 2);
              }
              if (zone.length == 6 && (zone[0] == "-" || zone[0] == "+")) {
                zone = zone.substr(0, 3) + zone.substr(4);
              }
              return value + zone;
            },
            _splitZone: function(aValue, isFromIcal) {
              var lastChar = aValue.length - 1;
              var signChar = aValue.length - (isFromIcal ? 5 : 6);
              var sign = aValue[signChar];
              var zone, value;
              if (aValue[lastChar] == "Z") {
                zone = aValue[lastChar];
                value = aValue.substr(0, lastChar);
              } else if (aValue.length > 6 && (sign == "-" || sign == "+")) {
                zone = aValue.substr(signChar);
                value = aValue.substr(0, signChar);
              } else {
                zone = "";
                value = aValue;
              }
              return [zone, value];
            }
          },
          "date-time": {
            decorate: function(aValue) {
              return ICAL2.VCardTime.fromDateAndOrTimeString(aValue, "date-time");
            },
            undecorate: function(aValue) {
              return aValue.toString();
            },
            fromICAL: function(aValue) {
              return vcardValues["date-and-or-time"].fromICAL(aValue);
            },
            toICAL: function(aValue) {
              return vcardValues["date-and-or-time"].toICAL(aValue);
            }
          },
          "date-and-or-time": {
            decorate: function(aValue) {
              return ICAL2.VCardTime.fromDateAndOrTimeString(aValue, "date-and-or-time");
            },
            undecorate: function(aValue) {
              return aValue.toString();
            },
            fromICAL: function(aValue) {
              var parts = aValue.split("T");
              return (parts[0] ? vcardValues.date.fromICAL(parts[0]) : "") + (parts[1] ? "T" + vcardValues.time.fromICAL(parts[1]) : "");
            },
            toICAL: function(aValue) {
              var parts = aValue.split("T");
              return vcardValues.date.toICAL(parts[0]) + (parts[1] ? "T" + vcardValues.time.toICAL(parts[1]) : "");
            }
          },
          timestamp: icalValues["date-time"],
          "language-tag": {
            matches: /^[a-zA-Z0-9-]+$/
            // Could go with a more strict regex here
          }
        });
        var vcardParams = {
          "type": {
            valueType: "text",
            multiValue: ","
          },
          "value": {
            // since the value here is a 'type' lowercase is used.
            values: [
              "text",
              "uri",
              "date",
              "time",
              "date-time",
              "date-and-or-time",
              "timestamp",
              "boolean",
              "integer",
              "float",
              "utc-offset",
              "language-tag"
            ],
            allowXName: true,
            allowIanaToken: true
          }
        };
        var vcardProperties = ICAL2.helpers.extend(commonProperties, {
          "adr": { defaultType: "text", structuredValue: ";", multiValue: "," },
          "anniversary": DEFAULT_TYPE_DATE_ANDOR_TIME,
          "bday": DEFAULT_TYPE_DATE_ANDOR_TIME,
          "caladruri": DEFAULT_TYPE_URI,
          "caluri": DEFAULT_TYPE_URI,
          "clientpidmap": DEFAULT_TYPE_TEXT_STRUCTURED,
          "email": DEFAULT_TYPE_TEXT,
          "fburl": DEFAULT_TYPE_URI,
          "fn": DEFAULT_TYPE_TEXT,
          "gender": DEFAULT_TYPE_TEXT_STRUCTURED,
          "geo": DEFAULT_TYPE_URI,
          "impp": DEFAULT_TYPE_URI,
          "key": DEFAULT_TYPE_URI,
          "kind": DEFAULT_TYPE_TEXT,
          "lang": { defaultType: "language-tag" },
          "logo": DEFAULT_TYPE_URI,
          "member": DEFAULT_TYPE_URI,
          "n": { defaultType: "text", structuredValue: ";", multiValue: "," },
          "nickname": DEFAULT_TYPE_TEXT_MULTI,
          "note": DEFAULT_TYPE_TEXT,
          "org": { defaultType: "text", structuredValue: ";" },
          "photo": DEFAULT_TYPE_URI,
          "related": DEFAULT_TYPE_URI,
          "rev": { defaultType: "timestamp" },
          "role": DEFAULT_TYPE_TEXT,
          "sound": DEFAULT_TYPE_URI,
          "source": DEFAULT_TYPE_URI,
          "tel": { defaultType: "uri", allowedTypes: ["uri", "text"] },
          "title": DEFAULT_TYPE_TEXT,
          "tz": { defaultType: "text", allowedTypes: ["text", "utc-offset", "uri"] },
          "xml": DEFAULT_TYPE_TEXT
        });
        var vcard3Values = ICAL2.helpers.extend(commonValues, {
          binary: icalValues.binary,
          date: vcardValues.date,
          "date-time": vcardValues["date-time"],
          "phone-number": {
            // TODO
            /* ... */
          },
          uri: icalValues.uri,
          text: icalValues.text,
          time: icalValues.time,
          vcard: icalValues.text,
          "utc-offset": {
            toICAL: function(aValue) {
              return aValue.substr(0, 7);
            },
            fromICAL: function(aValue) {
              return aValue.substr(0, 7);
            },
            decorate: function(aValue) {
              return ICAL2.UtcOffset.fromString(aValue);
            },
            undecorate: function(aValue) {
              return aValue.toString();
            }
          }
        });
        var vcard3Params = {
          "type": {
            valueType: "text",
            multiValue: ","
          },
          "value": {
            // since the value here is a 'type' lowercase is used.
            values: [
              "text",
              "uri",
              "date",
              "date-time",
              "phone-number",
              "time",
              "boolean",
              "integer",
              "float",
              "utc-offset",
              "vcard",
              "binary"
            ],
            allowXName: true,
            allowIanaToken: true
          }
        };
        var vcard3Properties = ICAL2.helpers.extend(commonProperties, {
          fn: DEFAULT_TYPE_TEXT,
          n: { defaultType: "text", structuredValue: ";", multiValue: "," },
          nickname: DEFAULT_TYPE_TEXT_MULTI,
          photo: { defaultType: "binary", allowedTypes: ["binary", "uri"] },
          bday: {
            defaultType: "date-time",
            allowedTypes: ["date-time", "date"],
            detectType: function(string) {
              return string.indexOf("T") === -1 ? "date" : "date-time";
            }
          },
          adr: { defaultType: "text", structuredValue: ";", multiValue: "," },
          label: DEFAULT_TYPE_TEXT,
          tel: { defaultType: "phone-number" },
          email: DEFAULT_TYPE_TEXT,
          mailer: DEFAULT_TYPE_TEXT,
          tz: { defaultType: "utc-offset", allowedTypes: ["utc-offset", "text"] },
          geo: { defaultType: "float", structuredValue: ";" },
          title: DEFAULT_TYPE_TEXT,
          role: DEFAULT_TYPE_TEXT,
          logo: { defaultType: "binary", allowedTypes: ["binary", "uri"] },
          agent: { defaultType: "vcard", allowedTypes: ["vcard", "text", "uri"] },
          org: DEFAULT_TYPE_TEXT_STRUCTURED,
          note: DEFAULT_TYPE_TEXT_MULTI,
          prodid: DEFAULT_TYPE_TEXT,
          rev: {
            defaultType: "date-time",
            allowedTypes: ["date-time", "date"],
            detectType: function(string) {
              return string.indexOf("T") === -1 ? "date" : "date-time";
            }
          },
          "sort-string": DEFAULT_TYPE_TEXT,
          sound: { defaultType: "binary", allowedTypes: ["binary", "uri"] },
          class: DEFAULT_TYPE_TEXT,
          key: { defaultType: "binary", allowedTypes: ["binary", "text"] }
        });
        var icalSet = {
          value: icalValues,
          param: icalParams,
          property: icalProperties
        };
        var vcardSet = {
          value: vcardValues,
          param: vcardParams,
          property: vcardProperties
        };
        var vcard3Set = {
          value: vcard3Values,
          param: vcard3Params,
          property: vcard3Properties
        };
        var design = {
          /**
           * A designSet describes value, parameter and property data. It is used by
           * ther parser and stringifier in components and properties to determine they
           * should be represented.
           *
           * @typedef {Object} designSet
           * @memberOf ICAL.design
           * @property {Object} value       Definitions for value types, keys are type names
           * @property {Object} param       Definitions for params, keys are param names
           * @property {Object} property    Defintions for properties, keys are property names
           */
          /**
           * Can be set to false to make the parser more lenient.
           */
          strict: true,
          /**
           * The default set for new properties and components if none is specified.
           * @type {ICAL.design.designSet}
           */
          defaultSet: icalSet,
          /**
           * The default type for unknown properties
           * @type {String}
           */
          defaultType: "unknown",
          /**
           * Holds the design set for known top-level components
           *
           * @type {Object}
           * @property {ICAL.design.designSet} vcard       vCard VCARD
           * @property {ICAL.design.designSet} vevent      iCalendar VEVENT
           * @property {ICAL.design.designSet} vtodo       iCalendar VTODO
           * @property {ICAL.design.designSet} vjournal    iCalendar VJOURNAL
           * @property {ICAL.design.designSet} valarm      iCalendar VALARM
           * @property {ICAL.design.designSet} vtimezone   iCalendar VTIMEZONE
           * @property {ICAL.design.designSet} daylight    iCalendar DAYLIGHT
           * @property {ICAL.design.designSet} standard    iCalendar STANDARD
           *
           * @example
           * var propertyName = 'fn';
           * var componentDesign = ICAL.design.components.vcard;
           * var propertyDetails = componentDesign.property[propertyName];
           * if (propertyDetails.defaultType == 'text') {
           *   // Yep, sure is...
           * }
           */
          components: {
            vcard: vcardSet,
            vcard3: vcard3Set,
            vevent: icalSet,
            vtodo: icalSet,
            vjournal: icalSet,
            valarm: icalSet,
            vtimezone: icalSet,
            daylight: icalSet,
            standard: icalSet
          },
          /**
           * The design set for iCalendar (rfc5545/rfc7265) components.
           * @type {ICAL.design.designSet}
           */
          icalendar: icalSet,
          /**
           * The design set for vCard (rfc6350/rfc7095) components.
           * @type {ICAL.design.designSet}
           */
          vcard: vcardSet,
          /**
           * The design set for vCard (rfc2425/rfc2426/rfc7095) components.
           * @type {ICAL.design.designSet}
           */
          vcard3: vcard3Set,
          /**
           * Gets the design set for the given component name.
           *
           * @param {String} componentName        The name of the component
           * @return {ICAL.design.designSet}      The design set for the component
           */
          getDesignSet: function(componentName) {
            var isInDesign = componentName && componentName in design.components;
            return isInDesign ? design.components[componentName] : design.defaultSet;
          }
        };
        return design;
      })();
      ICAL2.stringify = (function() {
        "use strict";
        var LINE_ENDING = "\r\n";
        var DEFAULT_VALUE_TYPE = "unknown";
        var design = ICAL2.design;
        var helpers = ICAL2.helpers;
        function stringify(jCal) {
          if (typeof jCal[0] == "string") {
            jCal = [jCal];
          }
          var i3 = 0;
          var len = jCal.length;
          var result = "";
          for (; i3 < len; i3++) {
            result += stringify.component(jCal[i3]) + LINE_ENDING;
          }
          return result;
        }
        stringify.component = function(component, designSet) {
          var name = component[0].toUpperCase();
          var result = "BEGIN:" + name + LINE_ENDING;
          var props = component[1];
          var propIdx = 0;
          var propLen = props.length;
          var designSetName = component[0];
          if (designSetName === "vcard" && component[1].length > 0 && !(component[1][0][0] === "version" && component[1][0][3] === "4.0")) {
            designSetName = "vcard3";
          }
          designSet = designSet || design.getDesignSet(designSetName);
          for (; propIdx < propLen; propIdx++) {
            result += stringify.property(props[propIdx], designSet) + LINE_ENDING;
          }
          var comps = component[2] || [];
          var compIdx = 0;
          var compLen = comps.length;
          for (; compIdx < compLen; compIdx++) {
            result += stringify.component(comps[compIdx], designSet) + LINE_ENDING;
          }
          result += "END:" + name;
          return result;
        };
        stringify.property = function(property, designSet, noFold) {
          var name = property[0].toUpperCase();
          var jsName = property[0];
          var params = property[1];
          var line = name;
          var paramName;
          for (paramName in params) {
            var value = params[paramName];
            if (params.hasOwnProperty(paramName)) {
              var multiValue = paramName in designSet.param && designSet.param[paramName].multiValue;
              if (multiValue && Array.isArray(value)) {
                if (designSet.param[paramName].multiValueSeparateDQuote) {
                  multiValue = '"' + multiValue + '"';
                }
                value = value.map(stringify._rfc6868Unescape);
                value = stringify.multiValue(value, multiValue, "unknown", null, designSet);
              } else {
                value = stringify._rfc6868Unescape(value);
              }
              line += ";" + paramName.toUpperCase();
              line += "=" + stringify.propertyValue(value);
            }
          }
          if (property.length === 3) {
            return line + ":";
          }
          var valueType = property[2];
          if (!designSet) {
            designSet = design.defaultSet;
          }
          var propDetails;
          var multiValue = false;
          var structuredValue = false;
          var isDefault = false;
          if (jsName in designSet.property) {
            propDetails = designSet.property[jsName];
            if ("multiValue" in propDetails) {
              multiValue = propDetails.multiValue;
            }
            if ("structuredValue" in propDetails && Array.isArray(property[3])) {
              structuredValue = propDetails.structuredValue;
            }
            if ("defaultType" in propDetails) {
              if (valueType === propDetails.defaultType) {
                isDefault = true;
              }
            } else {
              if (valueType === DEFAULT_VALUE_TYPE) {
                isDefault = true;
              }
            }
          } else {
            if (valueType === DEFAULT_VALUE_TYPE) {
              isDefault = true;
            }
          }
          if (!isDefault) {
            line += ";VALUE=" + valueType.toUpperCase();
          }
          line += ":";
          if (multiValue && structuredValue) {
            line += stringify.multiValue(
              property[3],
              structuredValue,
              valueType,
              multiValue,
              designSet,
              structuredValue
            );
          } else if (multiValue) {
            line += stringify.multiValue(
              property.slice(3),
              multiValue,
              valueType,
              null,
              designSet,
              false
            );
          } else if (structuredValue) {
            line += stringify.multiValue(
              property[3],
              structuredValue,
              valueType,
              null,
              designSet,
              structuredValue
            );
          } else {
            line += stringify.value(property[3], valueType, designSet, false);
          }
          return noFold ? line : ICAL2.helpers.foldline(line);
        };
        stringify.propertyValue = function(value) {
          if (helpers.unescapedIndexOf(value, ",") === -1 && helpers.unescapedIndexOf(value, ":") === -1 && helpers.unescapedIndexOf(value, ";") === -1) {
            return value;
          }
          return '"' + value + '"';
        };
        stringify.multiValue = function(values, delim, type, innerMulti, designSet, structuredValue) {
          var result = "";
          var len = values.length;
          var i3 = 0;
          for (; i3 < len; i3++) {
            if (innerMulti && Array.isArray(values[i3])) {
              result += stringify.multiValue(values[i3], innerMulti, type, null, designSet, structuredValue);
            } else {
              result += stringify.value(values[i3], type, designSet, structuredValue);
            }
            if (i3 !== len - 1) {
              result += delim;
            }
          }
          return result;
        };
        stringify.value = function(value, type, designSet, structuredValue) {
          if (type in designSet.value && "toICAL" in designSet.value[type]) {
            return designSet.value[type].toICAL(value, structuredValue);
          }
          return value;
        };
        stringify._rfc6868Unescape = function(val) {
          return val.replace(/[\n^"]/g, function(x4) {
            return RFC6868_REPLACE_MAP[x4];
          });
        };
        var RFC6868_REPLACE_MAP = { '"': "^'", "\n": "^n", "^": "^^" };
        return stringify;
      })();
      ICAL2.parse = (function() {
        "use strict";
        var CHAR = /[^ \t]/;
        var MULTIVALUE_DELIMITER = ",";
        var VALUE_DELIMITER = ":";
        var PARAM_DELIMITER = ";";
        var PARAM_NAME_DELIMITER = "=";
        var DEFAULT_VALUE_TYPE = "unknown";
        var DEFAULT_PARAM_TYPE = "text";
        var design = ICAL2.design;
        var helpers = ICAL2.helpers;
        function ParserError(message) {
          this.message = message;
          this.name = "ParserError";
          try {
            throw new Error();
          } catch (e3) {
            if (e3.stack) {
              var split2 = e3.stack.split("\n");
              split2.shift();
              this.stack = split2.join("\n");
            }
          }
        }
        ParserError.prototype = Error.prototype;
        function parser(input) {
          var state = {};
          var root = state.component = [];
          state.stack = [root];
          parser._eachLine(input, function(err, line) {
            parser._handleContentLine(line, state);
          });
          if (state.stack.length > 1) {
            throw new ParserError(
              "invalid ical body. component began but did not end"
            );
          }
          state = null;
          return root.length == 1 ? root[0] : root;
        }
        parser.property = function(str, designSet) {
          var state = {
            component: [[], []],
            designSet: designSet || design.defaultSet
          };
          parser._handleContentLine(str, state);
          return state.component[1][0];
        };
        parser.component = function(str) {
          return parser(str);
        };
        parser.ParserError = ParserError;
        parser._handleContentLine = function(line, state) {
          var valuePos = line.indexOf(VALUE_DELIMITER);
          var paramPos = line.indexOf(PARAM_DELIMITER);
          var lastParamIndex;
          var lastValuePos;
          var name;
          var value;
          var params = {};
          if (paramPos !== -1 && valuePos !== -1) {
            if (paramPos > valuePos) {
              paramPos = -1;
            }
          }
          var parsedParams;
          if (paramPos !== -1) {
            name = line.substring(0, paramPos).toLowerCase();
            parsedParams = parser._parseParameters(line.substring(paramPos), 0, state.designSet);
            if (parsedParams[2] == -1) {
              throw new ParserError("Invalid parameters in '" + line + "'");
            }
            params = parsedParams[0];
            lastParamIndex = parsedParams[1].length + parsedParams[2] + paramPos;
            if ((lastValuePos = line.substring(lastParamIndex).indexOf(VALUE_DELIMITER)) !== -1) {
              value = line.substring(lastParamIndex + lastValuePos + 1);
            } else {
              throw new ParserError("Missing parameter value in '" + line + "'");
            }
          } else if (valuePos !== -1) {
            name = line.substring(0, valuePos).toLowerCase();
            value = line.substring(valuePos + 1);
            if (name === "begin") {
              var newComponent = [value.toLowerCase(), [], []];
              if (state.stack.length === 1) {
                state.component.push(newComponent);
              } else {
                state.component[2].push(newComponent);
              }
              state.stack.push(state.component);
              state.component = newComponent;
              if (!state.designSet) {
                state.designSet = design.getDesignSet(state.component[0]);
              }
              return;
            } else if (name === "end") {
              state.component = state.stack.pop();
              return;
            }
          } else {
            throw new ParserError(
              'invalid line (no token ";" or ":") "' + line + '"'
            );
          }
          var valueType;
          var multiValue = false;
          var structuredValue = false;
          var propertyDetails;
          if (name in state.designSet.property) {
            propertyDetails = state.designSet.property[name];
            if ("multiValue" in propertyDetails) {
              multiValue = propertyDetails.multiValue;
            }
            if ("structuredValue" in propertyDetails) {
              structuredValue = propertyDetails.structuredValue;
            }
            if (value && "detectType" in propertyDetails) {
              valueType = propertyDetails.detectType(value);
            }
          }
          if (!valueType) {
            if (!("value" in params)) {
              if (propertyDetails) {
                valueType = propertyDetails.defaultType;
              } else {
                valueType = DEFAULT_VALUE_TYPE;
              }
            } else {
              valueType = params.value.toLowerCase();
            }
          }
          delete params.value;
          var result;
          if (multiValue && structuredValue) {
            value = parser._parseMultiValue(value, structuredValue, valueType, [], multiValue, state.designSet, structuredValue);
            result = [name, params, valueType, value];
          } else if (multiValue) {
            result = [name, params, valueType];
            parser._parseMultiValue(value, multiValue, valueType, result, null, state.designSet, false);
          } else if (structuredValue) {
            value = parser._parseMultiValue(value, structuredValue, valueType, [], null, state.designSet, structuredValue);
            result = [name, params, valueType, value];
          } else {
            value = parser._parseValue(value, valueType, state.designSet, false);
            result = [name, params, valueType, value];
          }
          if (state.component[0] === "vcard" && state.component[1].length === 0 && !(name === "version" && value === "4.0")) {
            state.designSet = design.getDesignSet("vcard3");
          }
          state.component[1].push(result);
        };
        parser._parseValue = function(value, type, designSet, structuredValue) {
          if (type in designSet.value && "fromICAL" in designSet.value[type]) {
            return designSet.value[type].fromICAL(value, structuredValue);
          }
          return value;
        };
        parser._parseParameters = function(line, start, designSet) {
          var lastParam = start;
          var pos = 0;
          var delim = PARAM_NAME_DELIMITER;
          var result = {};
          var name, lcname;
          var value, valuePos = -1;
          var type, multiValue, mvdelim;
          while (pos !== false && (pos = helpers.unescapedIndexOf(line, delim, pos + 1)) !== -1) {
            name = line.substr(lastParam + 1, pos - lastParam - 1);
            if (name.length == 0) {
              throw new ParserError("Empty parameter name in '" + line + "'");
            }
            lcname = name.toLowerCase();
            mvdelim = false;
            multiValue = false;
            if (lcname in designSet.param && designSet.param[lcname].valueType) {
              type = designSet.param[lcname].valueType;
            } else {
              type = DEFAULT_PARAM_TYPE;
            }
            if (lcname in designSet.param) {
              multiValue = designSet.param[lcname].multiValue;
              if (designSet.param[lcname].multiValueSeparateDQuote) {
                mvdelim = parser._rfc6868Escape('"' + multiValue + '"');
              }
            }
            var nextChar = line[pos + 1];
            if (nextChar === '"') {
              valuePos = pos + 2;
              pos = helpers.unescapedIndexOf(line, '"', valuePos);
              if (multiValue && pos != -1) {
                var extendedValue = true;
                while (extendedValue) {
                  if (line[pos + 1] == multiValue && line[pos + 2] == '"') {
                    pos = helpers.unescapedIndexOf(line, '"', pos + 3);
                  } else {
                    extendedValue = false;
                  }
                }
              }
              if (pos === -1) {
                throw new ParserError(
                  'invalid line (no matching double quote) "' + line + '"'
                );
              }
              value = line.substr(valuePos, pos - valuePos);
              lastParam = helpers.unescapedIndexOf(line, PARAM_DELIMITER, pos);
              if (lastParam === -1) {
                pos = false;
              }
            } else {
              valuePos = pos + 1;
              var nextPos = helpers.unescapedIndexOf(line, PARAM_DELIMITER, valuePos);
              var propValuePos = helpers.unescapedIndexOf(line, VALUE_DELIMITER, valuePos);
              if (propValuePos !== -1 && nextPos > propValuePos) {
                nextPos = propValuePos;
                pos = false;
              } else if (nextPos === -1) {
                if (propValuePos === -1) {
                  nextPos = line.length;
                } else {
                  nextPos = propValuePos;
                }
                pos = false;
              } else {
                lastParam = nextPos;
                pos = nextPos;
              }
              value = line.substr(valuePos, nextPos - valuePos);
            }
            value = parser._rfc6868Escape(value);
            if (multiValue) {
              var delimiter = mvdelim || multiValue;
              value = parser._parseMultiValue(value, delimiter, type, [], null, designSet);
            } else {
              value = parser._parseValue(value, type, designSet);
            }
            if (multiValue && lcname in result) {
              if (Array.isArray(result[lcname])) {
                result[lcname].push(value);
              } else {
                result[lcname] = [
                  result[lcname],
                  value
                ];
              }
            } else {
              result[lcname] = value;
            }
          }
          return [result, value, valuePos];
        };
        parser._rfc6868Escape = function(val) {
          return val.replace(/\^['n^]/g, function(x4) {
            return RFC6868_REPLACE_MAP[x4];
          });
        };
        var RFC6868_REPLACE_MAP = { "^'": '"', "^n": "\n", "^^": "^" };
        parser._parseMultiValue = function(buffer, delim, type, result, innerMulti, designSet, structuredValue) {
          var pos = 0;
          var lastPos = 0;
          var value;
          if (delim.length === 0) {
            return buffer;
          }
          while ((pos = helpers.unescapedIndexOf(buffer, delim, lastPos)) !== -1) {
            value = buffer.substr(lastPos, pos - lastPos);
            if (innerMulti) {
              value = parser._parseMultiValue(value, innerMulti, type, [], null, designSet, structuredValue);
            } else {
              value = parser._parseValue(value, type, designSet, structuredValue);
            }
            result.push(value);
            lastPos = pos + delim.length;
          }
          value = buffer.substr(lastPos);
          if (innerMulti) {
            value = parser._parseMultiValue(value, innerMulti, type, [], null, designSet, structuredValue);
          } else {
            value = parser._parseValue(value, type, designSet, structuredValue);
          }
          result.push(value);
          return result.length == 1 ? result[0] : result;
        };
        parser._eachLine = function(buffer, callback) {
          var len = buffer.length;
          var lastPos = buffer.search(CHAR);
          var pos = lastPos;
          var line;
          var firstChar;
          var newlineOffset;
          do {
            pos = buffer.indexOf("\n", lastPos) + 1;
            if (pos > 1 && buffer[pos - 2] === "\r") {
              newlineOffset = 2;
            } else {
              newlineOffset = 1;
            }
            if (pos === 0) {
              pos = len;
              newlineOffset = 0;
            }
            firstChar = buffer[lastPos];
            if (firstChar === " " || firstChar === "	") {
              line += buffer.substr(
                lastPos + 1,
                pos - lastPos - (newlineOffset + 1)
              );
            } else {
              if (line)
                callback(null, line);
              line = buffer.substr(
                lastPos,
                pos - lastPos - newlineOffset
              );
            }
            lastPos = pos;
          } while (pos !== len);
          line = line.trim();
          if (line.length)
            callback(null, line);
        };
        return parser;
      })();
      ICAL2.Component = (function() {
        "use strict";
        var PROPERTY_INDEX = 1;
        var COMPONENT_INDEX = 2;
        var NAME_INDEX = 0;
        function Component2(jCal, parent) {
          if (typeof jCal === "string") {
            jCal = [jCal, [], []];
          }
          this.jCal = jCal;
          this.parent = parent || null;
        }
        Component2.prototype = {
          /**
           * Hydrated properties are inserted into the _properties array at the same
           * position as in the jCal array, so it is possible that the array contains
           * undefined values for unhydrdated properties. To avoid iterating the
           * array when checking if all properties have been hydrated, we save the
           * count here.
           *
           * @type {Number}
           * @private
           */
          _hydratedPropertyCount: 0,
          /**
           * The same count as for _hydratedPropertyCount, but for subcomponents
           *
           * @type {Number}
           * @private
           */
          _hydratedComponentCount: 0,
          /**
           * The name of this component
           * @readonly
           */
          get name() {
            return this.jCal[NAME_INDEX];
          },
          /**
           * The design set for this component, e.g. icalendar vs vcard
           *
           * @type {ICAL.design.designSet}
           * @private
           */
          get _designSet() {
            var parentDesign = this.parent && this.parent._designSet;
            return parentDesign || ICAL2.design.getDesignSet(this.name);
          },
          _hydrateComponent: function(index6) {
            if (!this._components) {
              this._components = [];
              this._hydratedComponentCount = 0;
            }
            if (this._components[index6]) {
              return this._components[index6];
            }
            var comp = new Component2(
              this.jCal[COMPONENT_INDEX][index6],
              this
            );
            this._hydratedComponentCount++;
            return this._components[index6] = comp;
          },
          _hydrateProperty: function(index6) {
            if (!this._properties) {
              this._properties = [];
              this._hydratedPropertyCount = 0;
            }
            if (this._properties[index6]) {
              return this._properties[index6];
            }
            var prop = new ICAL2.Property(
              this.jCal[PROPERTY_INDEX][index6],
              this
            );
            this._hydratedPropertyCount++;
            return this._properties[index6] = prop;
          },
          /**
           * Finds first sub component, optionally filtered by name.
           *
           * @param {String=} name        Optional name to filter by
           * @return {?ICAL.Component}     The found subcomponent
           */
          getFirstSubcomponent: function(name) {
            if (name) {
              var i3 = 0;
              var comps = this.jCal[COMPONENT_INDEX];
              var len = comps.length;
              for (; i3 < len; i3++) {
                if (comps[i3][NAME_INDEX] === name) {
                  var result = this._hydrateComponent(i3);
                  return result;
                }
              }
            } else {
              if (this.jCal[COMPONENT_INDEX].length) {
                return this._hydrateComponent(0);
              }
            }
            return null;
          },
          /**
           * Finds all sub components, optionally filtering by name.
           *
           * @param {String=} name            Optional name to filter by
           * @return {ICAL.Component[]}       The found sub components
           */
          getAllSubcomponents: function(name) {
            var jCalLen = this.jCal[COMPONENT_INDEX].length;
            var i3 = 0;
            if (name) {
              var comps = this.jCal[COMPONENT_INDEX];
              var result = [];
              for (; i3 < jCalLen; i3++) {
                if (name === comps[i3][NAME_INDEX]) {
                  result.push(
                    this._hydrateComponent(i3)
                  );
                }
              }
              return result;
            } else {
              if (!this._components || this._hydratedComponentCount !== jCalLen) {
                for (; i3 < jCalLen; i3++) {
                  this._hydrateComponent(i3);
                }
              }
              return this._components || [];
            }
          },
          /**
           * Returns true when a named property exists.
           *
           * @param {String} name     The property name
           * @return {Boolean}        True, when property is found
           */
          hasProperty: function(name) {
            var props = this.jCal[PROPERTY_INDEX];
            var len = props.length;
            var i3 = 0;
            for (; i3 < len; i3++) {
              if (props[i3][NAME_INDEX] === name) {
                return true;
              }
            }
            return false;
          },
          /**
           * Finds the first property, optionally with the given name.
           *
           * @param {String=} name        Lowercase property name
           * @return {?ICAL.Property}     The found property
           */
          getFirstProperty: function(name) {
            if (name) {
              var i3 = 0;
              var props = this.jCal[PROPERTY_INDEX];
              var len = props.length;
              for (; i3 < len; i3++) {
                if (props[i3][NAME_INDEX] === name) {
                  var result = this._hydrateProperty(i3);
                  return result;
                }
              }
            } else {
              if (this.jCal[PROPERTY_INDEX].length) {
                return this._hydrateProperty(0);
              }
            }
            return null;
          },
          /**
           * Returns first property's value, if available.
           *
           * @param {String=} name    Lowercase property name
           * @return {?String}        The found property value.
           */
          getFirstPropertyValue: function(name) {
            var prop = this.getFirstProperty(name);
            if (prop) {
              return prop.getFirstValue();
            }
            return null;
          },
          /**
           * Get all properties in the component, optionally filtered by name.
           *
           * @param {String=} name        Lowercase property name
           * @return {ICAL.Property[]}    List of properties
           */
          getAllProperties: function(name) {
            var jCalLen = this.jCal[PROPERTY_INDEX].length;
            var i3 = 0;
            if (name) {
              var props = this.jCal[PROPERTY_INDEX];
              var result = [];
              for (; i3 < jCalLen; i3++) {
                if (name === props[i3][NAME_INDEX]) {
                  result.push(
                    this._hydrateProperty(i3)
                  );
                }
              }
              return result;
            } else {
              if (!this._properties || this._hydratedPropertyCount !== jCalLen) {
                for (; i3 < jCalLen; i3++) {
                  this._hydrateProperty(i3);
                }
              }
              return this._properties || [];
            }
          },
          _removeObjectByIndex: function(jCalIndex, cache, index6) {
            cache = cache || [];
            if (cache[index6]) {
              var obj = cache[index6];
              if ("parent" in obj) {
                obj.parent = null;
              }
            }
            cache.splice(index6, 1);
            this.jCal[jCalIndex].splice(index6, 1);
          },
          _removeObject: function(jCalIndex, cache, nameOrObject) {
            var i3 = 0;
            var objects = this.jCal[jCalIndex];
            var len = objects.length;
            var cached = this[cache];
            if (typeof nameOrObject === "string") {
              for (; i3 < len; i3++) {
                if (objects[i3][NAME_INDEX] === nameOrObject) {
                  this._removeObjectByIndex(jCalIndex, cached, i3);
                  return true;
                }
              }
            } else if (cached) {
              for (; i3 < len; i3++) {
                if (cached[i3] && cached[i3] === nameOrObject) {
                  this._removeObjectByIndex(jCalIndex, cached, i3);
                  return true;
                }
              }
            }
            return false;
          },
          _removeAllObjects: function(jCalIndex, cache, name) {
            var cached = this[cache];
            var objects = this.jCal[jCalIndex];
            var i3 = objects.length - 1;
            for (; i3 >= 0; i3--) {
              if (!name || objects[i3][NAME_INDEX] === name) {
                this._removeObjectByIndex(jCalIndex, cached, i3);
              }
            }
          },
          /**
           * Adds a single sub component.
           *
           * @param {ICAL.Component} component        The component to add
           * @return {ICAL.Component}                 The passed in component
           */
          addSubcomponent: function(component) {
            if (!this._components) {
              this._components = [];
              this._hydratedComponentCount = 0;
            }
            if (component.parent) {
              component.parent.removeSubcomponent(component);
            }
            var idx = this.jCal[COMPONENT_INDEX].push(component.jCal);
            this._components[idx - 1] = component;
            this._hydratedComponentCount++;
            component.parent = this;
            return component;
          },
          /**
           * Removes a single component by name or the instance of a specific
           * component.
           *
           * @param {ICAL.Component|String} nameOrComp    Name of component, or component
           * @return {Boolean}                            True when comp is removed
           */
          removeSubcomponent: function(nameOrComp) {
            var removed = this._removeObject(COMPONENT_INDEX, "_components", nameOrComp);
            if (removed) {
              this._hydratedComponentCount--;
            }
            return removed;
          },
          /**
           * Removes all components or (if given) all components by a particular
           * name.
           *
           * @param {String=} name            Lowercase component name
           */
          removeAllSubcomponents: function(name) {
            var removed = this._removeAllObjects(COMPONENT_INDEX, "_components", name);
            this._hydratedComponentCount = 0;
            return removed;
          },
          /**
           * Adds an {@link ICAL.Property} to the component.
           *
           * @param {ICAL.Property} property      The property to add
           * @return {ICAL.Property}              The passed in property
           */
          addProperty: function(property) {
            if (!(property instanceof ICAL2.Property)) {
              throw new TypeError("must instance of ICAL.Property");
            }
            if (!this._properties) {
              this._properties = [];
              this._hydratedPropertyCount = 0;
            }
            if (property.parent) {
              property.parent.removeProperty(property);
            }
            var idx = this.jCal[PROPERTY_INDEX].push(property.jCal);
            this._properties[idx - 1] = property;
            this._hydratedPropertyCount++;
            property.parent = this;
            return property;
          },
          /**
           * Helper method to add a property with a value to the component.
           *
           * @param {String}               name         Property name to add
           * @param {String|Number|Object} value        Property value
           * @return {ICAL.Property}                    The created property
           */
          addPropertyWithValue: function(name, value) {
            var prop = new ICAL2.Property(name);
            prop.setValue(value);
            this.addProperty(prop);
            return prop;
          },
          /**
           * Helper method that will update or create a property of the given name
           * and sets its value. If multiple properties with the given name exist,
           * only the first is updated.
           *
           * @param {String}               name         Property name to update
           * @param {String|Number|Object} value        Property value
           * @return {ICAL.Property}                    The created property
           */
          updatePropertyWithValue: function(name, value) {
            var prop = this.getFirstProperty(name);
            if (prop) {
              prop.setValue(value);
            } else {
              prop = this.addPropertyWithValue(name, value);
            }
            return prop;
          },
          /**
           * Removes a single property by name or the instance of the specific
           * property.
           *
           * @param {String|ICAL.Property} nameOrProp     Property name or instance to remove
           * @return {Boolean}                            True, when deleted
           */
          removeProperty: function(nameOrProp) {
            var removed = this._removeObject(PROPERTY_INDEX, "_properties", nameOrProp);
            if (removed) {
              this._hydratedPropertyCount--;
            }
            return removed;
          },
          /**
           * Removes all properties associated with this component, optionally
           * filtered by name.
           *
           * @param {String=} name        Lowercase property name
           * @return {Boolean}            True, when deleted
           */
          removeAllProperties: function(name) {
            var removed = this._removeAllObjects(PROPERTY_INDEX, "_properties", name);
            this._hydratedPropertyCount = 0;
            return removed;
          },
          /**
           * Returns the Object representation of this component. The returned object
           * is a live jCal object and should be cloned if modified.
           * @return {Object}
           */
          toJSON: function() {
            return this.jCal;
          },
          /**
           * The string representation of this component.
           * @return {String}
           */
          toString: function() {
            return ICAL2.stringify.component(
              this.jCal,
              this._designSet
            );
          }
        };
        Component2.fromString = function(str) {
          return new Component2(ICAL2.parse.component(str));
        };
        return Component2;
      })();
      ICAL2.Property = (function() {
        "use strict";
        var NAME_INDEX = 0;
        var PROP_INDEX = 1;
        var TYPE_INDEX = 2;
        var VALUE_INDEX = 3;
        var design = ICAL2.design;
        function Property(jCal, parent) {
          this._parent = parent || null;
          if (typeof jCal === "string") {
            this.jCal = [jCal, {}, design.defaultType];
            this.jCal[TYPE_INDEX] = this.getDefaultType();
          } else {
            this.jCal = jCal;
          }
          this._updateType();
        }
        Property.prototype = {
          /**
           * The value type for this property
           * @readonly
           * @type {String}
           */
          get type() {
            return this.jCal[TYPE_INDEX];
          },
          /**
           * The name of this property, in lowercase.
           * @readonly
           * @type {String}
           */
          get name() {
            return this.jCal[NAME_INDEX];
          },
          /**
           * The parent component for this property.
           * @type {ICAL.Component}
           */
          get parent() {
            return this._parent;
          },
          set parent(p3) {
            var designSetChanged = !this._parent || p3 && p3._designSet != this._parent._designSet;
            this._parent = p3;
            if (this.type == design.defaultType && designSetChanged) {
              this.jCal[TYPE_INDEX] = this.getDefaultType();
              this._updateType();
            }
            return p3;
          },
          /**
           * The design set for this property, e.g. icalendar vs vcard
           *
           * @type {ICAL.design.designSet}
           * @private
           */
          get _designSet() {
            return this.parent ? this.parent._designSet : design.defaultSet;
          },
          /**
           * Updates the type metadata from the current jCal type and design set.
           *
           * @private
           */
          _updateType: function() {
            var designSet = this._designSet;
            if (this.type in designSet.value) {
              var designType = designSet.value[this.type];
              if ("decorate" in designSet.value[this.type]) {
                this.isDecorated = true;
              } else {
                this.isDecorated = false;
              }
              if (this.name in designSet.property) {
                this.isMultiValue = "multiValue" in designSet.property[this.name];
                this.isStructuredValue = "structuredValue" in designSet.property[this.name];
              }
            }
          },
          /**
           * Hydrate a single value. The act of hydrating means turning the raw jCal
           * value into a potentially wrapped object, for example {@link ICAL.Time}.
           *
           * @private
           * @param {Number} index        The index of the value to hydrate
           * @return {Object}             The decorated value.
           */
          _hydrateValue: function(index6) {
            if (this._values && this._values[index6]) {
              return this._values[index6];
            }
            if (this.jCal.length <= VALUE_INDEX + index6) {
              return null;
            }
            if (this.isDecorated) {
              if (!this._values) {
                this._values = [];
              }
              return this._values[index6] = this._decorate(
                this.jCal[VALUE_INDEX + index6]
              );
            } else {
              return this.jCal[VALUE_INDEX + index6];
            }
          },
          /**
           * Decorate a single value, returning its wrapped object. This is used by
           * the hydrate function to actually wrap the value.
           *
           * @private
           * @param {?} value         The value to decorate
           * @return {Object}         The decorated value
           */
          _decorate: function(value) {
            return this._designSet.value[this.type].decorate(value, this);
          },
          /**
           * Undecorate a single value, returning its raw jCal data.
           *
           * @private
           * @param {Object} value         The value to undecorate
           * @return {?}                   The undecorated value
           */
          _undecorate: function(value) {
            return this._designSet.value[this.type].undecorate(value, this);
          },
          /**
           * Sets the value at the given index while also hydrating it. The passed
           * value can either be a decorated or undecorated value.
           *
           * @private
           * @param {?} value             The value to set
           * @param {Number} index        The index to set it at
           */
          _setDecoratedValue: function(value, index6) {
            if (!this._values) {
              this._values = [];
            }
            if (typeof value === "object" && "icaltype" in value) {
              this.jCal[VALUE_INDEX + index6] = this._undecorate(value);
              this._values[index6] = value;
            } else {
              this.jCal[VALUE_INDEX + index6] = value;
              this._values[index6] = this._decorate(value);
            }
          },
          /**
           * Gets a parameter on the property.
           *
           * @param {String}        name   Parameter name (lowercase)
           * @return {Array|String}        Parameter value
           */
          getParameter: function(name) {
            if (name in this.jCal[PROP_INDEX]) {
              return this.jCal[PROP_INDEX][name];
            } else {
              return void 0;
            }
          },
          /**
           * Gets first parameter on the property.
           *
           * @param {String}        name   Parameter name (lowercase)
           * @return {String}        Parameter value
           */
          getFirstParameter: function(name) {
            var parameters = this.getParameter(name);
            if (Array.isArray(parameters)) {
              return parameters[0];
            }
            return parameters;
          },
          /**
           * Sets a parameter on the property.
           *
           * @param {String}       name     The parameter name
           * @param {Array|String} value    The parameter value
           */
          setParameter: function(name, value) {
            var lcname = name.toLowerCase();
            if (typeof value === "string" && lcname in this._designSet.param && "multiValue" in this._designSet.param[lcname]) {
              value = [value];
            }
            this.jCal[PROP_INDEX][name] = value;
          },
          /**
           * Removes a parameter
           *
           * @param {String} name     The parameter name
           */
          removeParameter: function(name) {
            delete this.jCal[PROP_INDEX][name];
          },
          /**
           * Get the default type based on this property's name.
           *
           * @return {String}     The default type for this property
           */
          getDefaultType: function() {
            var name = this.jCal[NAME_INDEX];
            var designSet = this._designSet;
            if (name in designSet.property) {
              var details = designSet.property[name];
              if ("defaultType" in details) {
                return details.defaultType;
              }
            }
            return design.defaultType;
          },
          /**
           * Sets type of property and clears out any existing values of the current
           * type.
           *
           * @param {String} type     New iCAL type (see design.*.values)
           */
          resetType: function(type) {
            this.removeAllValues();
            this.jCal[TYPE_INDEX] = type;
            this._updateType();
          },
          /**
           * Finds the first property value.
           *
           * @return {String}         First property value
           */
          getFirstValue: function() {
            return this._hydrateValue(0);
          },
          /**
           * Gets all values on the property.
           *
           * NOTE: this creates an array during each call.
           *
           * @return {Array}          List of values
           */
          getValues: function() {
            var len = this.jCal.length - VALUE_INDEX;
            if (len < 1) {
              return [];
            }
            var i3 = 0;
            var result = [];
            for (; i3 < len; i3++) {
              result[i3] = this._hydrateValue(i3);
            }
            return result;
          },
          /**
           * Removes all values from this property
           */
          removeAllValues: function() {
            if (this._values) {
              this._values.length = 0;
            }
            this.jCal.length = 3;
          },
          /**
           * Sets the values of the property.  Will overwrite the existing values.
           * This can only be used for multi-value properties.
           *
           * @param {Array} values    An array of values
           */
          setValues: function(values) {
            if (!this.isMultiValue) {
              throw new Error(
                this.name + ": does not not support mulitValue.\noverride isMultiValue"
              );
            }
            var len = values.length;
            var i3 = 0;
            this.removeAllValues();
            if (len > 0 && typeof values[0] === "object" && "icaltype" in values[0]) {
              this.resetType(values[0].icaltype);
            }
            if (this.isDecorated) {
              for (; i3 < len; i3++) {
                this._setDecoratedValue(values[i3], i3);
              }
            } else {
              for (; i3 < len; i3++) {
                this.jCal[VALUE_INDEX + i3] = values[i3];
              }
            }
          },
          /**
           * Sets the current value of the property. If this is a multi-value
           * property, all other values will be removed.
           *
           * @param {String|Object} value     New property value.
           */
          setValue: function(value) {
            this.removeAllValues();
            if (typeof value === "object" && "icaltype" in value) {
              this.resetType(value.icaltype);
            }
            if (this.isDecorated) {
              this._setDecoratedValue(value, 0);
            } else {
              this.jCal[VALUE_INDEX] = value;
            }
          },
          /**
           * Returns the Object representation of this component. The returned object
           * is a live jCal object and should be cloned if modified.
           * @return {Object}
           */
          toJSON: function() {
            return this.jCal;
          },
          /**
           * The string representation of this component.
           * @return {String}
           */
          toICALString: function() {
            return ICAL2.stringify.property(
              this.jCal,
              this._designSet,
              true
            );
          }
        };
        Property.fromString = function(str, designSet) {
          return new Property(ICAL2.parse.property(str, designSet));
        };
        return Property;
      })();
      ICAL2.UtcOffset = (function() {
        function UtcOffset(aData) {
          this.fromData(aData);
        }
        UtcOffset.prototype = {
          /**
           * The hours in the utc-offset
           * @type {Number}
           */
          hours: 0,
          /**
           * The minutes in the utc-offset
           * @type {Number}
           */
          minutes: 0,
          /**
           * The sign of the utc offset, 1 for positive offset, -1 for negative
           * offsets.
           * @type {Number}
           */
          factor: 1,
          /**
           * The type name, to be used in the jCal object.
           * @constant
           * @type {String}
           * @default "utc-offset"
           */
          icaltype: "utc-offset",
          /**
           * Returns a clone of the utc offset object.
           *
           * @return {ICAL.UtcOffset}     The cloned object
           */
          clone: function() {
            return ICAL2.UtcOffset.fromSeconds(this.toSeconds());
          },
          /**
           * Sets up the current instance using members from the passed data object.
           *
           * @param {Object} aData          An object with members of the utc offset
           * @param {Number=} aData.hours   The hours for the utc offset
           * @param {Number=} aData.minutes The minutes in the utc offset
           * @param {Number=} aData.factor  The factor for the utc-offset, either -1 or 1
           */
          fromData: function(aData) {
            if (aData) {
              for (var key in aData) {
                if (aData.hasOwnProperty(key)) {
                  this[key] = aData[key];
                }
              }
            }
            this._normalize();
          },
          /**
           * Sets up the current instance from the given seconds value. The seconds
           * value is truncated to the minute. Offsets are wrapped when the world
           * ends, the hour after UTC+14:00 is UTC-12:00.
           *
           * @param {Number} aSeconds         The seconds to convert into an offset
           */
          fromSeconds: function(aSeconds) {
            var secs = Math.abs(aSeconds);
            this.factor = aSeconds < 0 ? -1 : 1;
            this.hours = ICAL2.helpers.trunc(secs / 3600);
            secs -= this.hours * 3600;
            this.minutes = ICAL2.helpers.trunc(secs / 60);
            return this;
          },
          /**
           * Convert the current offset to a value in seconds
           *
           * @return {Number}                 The offset in seconds
           */
          toSeconds: function() {
            return this.factor * (60 * this.minutes + 3600 * this.hours);
          },
          /**
           * Compare this utc offset with another one.
           *
           * @param {ICAL.UtcOffset} other        The other offset to compare with
           * @return {Number}                     -1, 0 or 1 for less/equal/greater
           */
          compare: function icaltime_compare(other) {
            var a3 = this.toSeconds();
            var b3 = other.toSeconds();
            return (a3 > b3) - (b3 > a3);
          },
          _normalize: function() {
            var secs = this.toSeconds();
            var factor = this.factor;
            while (secs < -43200) {
              secs += 97200;
            }
            while (secs > 50400) {
              secs -= 97200;
            }
            this.fromSeconds(secs);
            if (secs == 0) {
              this.factor = factor;
            }
          },
          /**
           * The iCalendar string representation of this utc-offset.
           * @return {String}
           */
          toICALString: function() {
            return ICAL2.design.icalendar.value["utc-offset"].toICAL(this.toString());
          },
          /**
           * The string representation of this utc-offset.
           * @return {String}
           */
          toString: function toString() {
            return (this.factor == 1 ? "+" : "-") + ICAL2.helpers.pad2(this.hours) + ":" + ICAL2.helpers.pad2(this.minutes);
          }
        };
        UtcOffset.fromString = function(aString) {
          var options = {};
          options.factor = aString[0] === "+" ? 1 : -1;
          options.hours = ICAL2.helpers.strictParseInt(aString.substr(1, 2));
          options.minutes = ICAL2.helpers.strictParseInt(aString.substr(4, 2));
          return new ICAL2.UtcOffset(options);
        };
        UtcOffset.fromSeconds = function(aSeconds) {
          var instance = new UtcOffset();
          instance.fromSeconds(aSeconds);
          return instance;
        };
        return UtcOffset;
      })();
      ICAL2.Binary = (function() {
        function Binary(aValue) {
          this.value = aValue;
        }
        Binary.prototype = {
          /**
           * The type name, to be used in the jCal object.
           * @default "binary"
           * @constant
           */
          icaltype: "binary",
          /**
           * Base64 decode the current value
           *
           * @return {String}         The base64-decoded value
           */
          decodeValue: function decodeValue() {
            return this._b64_decode(this.value);
          },
          /**
           * Encodes the passed parameter with base64 and sets the internal
           * value to the result.
           *
           * @param {String} aValue      The raw binary value to encode
           */
          setEncodedValue: function setEncodedValue(aValue) {
            this.value = this._b64_encode(aValue);
          },
          _b64_encode: function base64_encode(data) {
            var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var o1, o2, o3, h1, h22, h3, h4, bits, i3 = 0, ac = 0, enc = "", tmp_arr = [];
            if (!data) {
              return data;
            }
            do {
              o1 = data.charCodeAt(i3++);
              o2 = data.charCodeAt(i3++);
              o3 = data.charCodeAt(i3++);
              bits = o1 << 16 | o2 << 8 | o3;
              h1 = bits >> 18 & 63;
              h22 = bits >> 12 & 63;
              h3 = bits >> 6 & 63;
              h4 = bits & 63;
              tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h22) + b64.charAt(h3) + b64.charAt(h4);
            } while (i3 < data.length);
            enc = tmp_arr.join("");
            var r3 = data.length % 3;
            return (r3 ? enc.slice(0, r3 - 3) : enc) + "===".slice(r3 || 3);
          },
          _b64_decode: function base64_decode(data) {
            var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var o1, o2, o3, h1, h22, h3, h4, bits, i3 = 0, ac = 0, dec = "", tmp_arr = [];
            if (!data) {
              return data;
            }
            data += "";
            do {
              h1 = b64.indexOf(data.charAt(i3++));
              h22 = b64.indexOf(data.charAt(i3++));
              h3 = b64.indexOf(data.charAt(i3++));
              h4 = b64.indexOf(data.charAt(i3++));
              bits = h1 << 18 | h22 << 12 | h3 << 6 | h4;
              o1 = bits >> 16 & 255;
              o2 = bits >> 8 & 255;
              o3 = bits & 255;
              if (h3 == 64) {
                tmp_arr[ac++] = String.fromCharCode(o1);
              } else if (h4 == 64) {
                tmp_arr[ac++] = String.fromCharCode(o1, o2);
              } else {
                tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
              }
            } while (i3 < data.length);
            dec = tmp_arr.join("");
            return dec;
          },
          /**
           * The string representation of this value
           * @return {String}
           */
          toString: function() {
            return this.value;
          }
        };
        Binary.fromString = function(aString) {
          return new Binary(aString);
        };
        return Binary;
      })();
      (function() {
        ICAL2.Period = function icalperiod(aData) {
          this.wrappedJSObject = this;
          if (aData && "start" in aData) {
            if (aData.start && !(aData.start instanceof ICAL2.Time)) {
              throw new TypeError(".start must be an instance of ICAL.Time");
            }
            this.start = aData.start;
          }
          if (aData && aData.end && aData.duration) {
            throw new Error("cannot accept both end and duration");
          }
          if (aData && "end" in aData) {
            if (aData.end && !(aData.end instanceof ICAL2.Time)) {
              throw new TypeError(".end must be an instance of ICAL.Time");
            }
            this.end = aData.end;
          }
          if (aData && "duration" in aData) {
            if (aData.duration && !(aData.duration instanceof ICAL2.Duration)) {
              throw new TypeError(".duration must be an instance of ICAL.Duration");
            }
            this.duration = aData.duration;
          }
        };
        ICAL2.Period.prototype = {
          /**
           * The start of the period
           * @type {ICAL.Time}
           */
          start: null,
          /**
           * The end of the period
           * @type {ICAL.Time}
           */
          end: null,
          /**
           * The duration of the period
           * @type {ICAL.Duration}
           */
          duration: null,
          /**
           * The class identifier.
           * @constant
           * @type {String}
           * @default "icalperiod"
           */
          icalclass: "icalperiod",
          /**
           * The type name, to be used in the jCal object.
           * @constant
           * @type {String}
           * @default "period"
           */
          icaltype: "period",
          /**
           * Returns a clone of the duration object.
           *
           * @return {ICAL.Period}      The cloned object
           */
          clone: function() {
            return ICAL2.Period.fromData({
              start: this.start ? this.start.clone() : null,
              end: this.end ? this.end.clone() : null,
              duration: this.duration ? this.duration.clone() : null
            });
          },
          /**
           * Calculates the duration of the period, either directly or by subtracting
           * start from end date.
           *
           * @return {ICAL.Duration}      The calculated duration
           */
          getDuration: function duration() {
            if (this.duration) {
              return this.duration;
            } else {
              return this.end.subtractDate(this.start);
            }
          },
          /**
           * Calculates the end date of the period, either directly or by adding
           * duration to start date.
           *
           * @return {ICAL.Time}          The calculated end date
           */
          getEnd: function() {
            if (this.end) {
              return this.end;
            } else {
              var end = this.start.clone();
              end.addDuration(this.duration);
              return end;
            }
          },
          /**
           * The string representation of this period.
           * @return {String}
           */
          toString: function toString() {
            return this.start + "/" + (this.end || this.duration);
          },
          /**
           * The jCal representation of this period type.
           * @return {Object}
           */
          toJSON: function() {
            return [this.start.toString(), (this.end || this.duration).toString()];
          },
          /**
           * The iCalendar string representation of this period.
           * @return {String}
           */
          toICALString: function() {
            return this.start.toICALString() + "/" + (this.end || this.duration).toICALString();
          }
        };
        ICAL2.Period.fromString = function fromString(str, prop) {
          var parts = str.split("/");
          if (parts.length !== 2) {
            throw new Error(
              'Invalid string value: "' + str + '" must contain a "/" char.'
            );
          }
          var options = {
            start: ICAL2.Time.fromDateTimeString(parts[0], prop)
          };
          var end = parts[1];
          if (ICAL2.Duration.isValueString(end)) {
            options.duration = ICAL2.Duration.fromString(end);
          } else {
            options.end = ICAL2.Time.fromDateTimeString(end, prop);
          }
          return new ICAL2.Period(options);
        };
        ICAL2.Period.fromData = function fromData(aData) {
          return new ICAL2.Period(aData);
        };
        ICAL2.Period.fromJSON = function(aData, aProp, aLenient) {
          function fromDateOrDateTimeString(aValue, aProp2) {
            if (aLenient) {
              return ICAL2.Time.fromString(aValue, aProp2);
            } else {
              return ICAL2.Time.fromDateTimeString(aValue, aProp2);
            }
          }
          if (ICAL2.Duration.isValueString(aData[1])) {
            return ICAL2.Period.fromData({
              start: fromDateOrDateTimeString(aData[0], aProp),
              duration: ICAL2.Duration.fromString(aData[1])
            });
          } else {
            return ICAL2.Period.fromData({
              start: fromDateOrDateTimeString(aData[0], aProp),
              end: fromDateOrDateTimeString(aData[1], aProp)
            });
          }
        };
      })();
      (function() {
        var DURATION_LETTERS = /([PDWHMTS]{1,1})/;
        ICAL2.Duration = function icalduration(data) {
          this.wrappedJSObject = this;
          this.fromData(data);
        };
        ICAL2.Duration.prototype = {
          /**
           * The weeks in this duration
           * @type {Number}
           * @default 0
           */
          weeks: 0,
          /**
           * The days in this duration
           * @type {Number}
           * @default 0
           */
          days: 0,
          /**
           * The days in this duration
           * @type {Number}
           * @default 0
           */
          hours: 0,
          /**
           * The minutes in this duration
           * @type {Number}
           * @default 0
           */
          minutes: 0,
          /**
           * The seconds in this duration
           * @type {Number}
           * @default 0
           */
          seconds: 0,
          /**
           * The seconds in this duration
           * @type {Boolean}
           * @default false
           */
          isNegative: false,
          /**
           * The class identifier.
           * @constant
           * @type {String}
           * @default "icalduration"
           */
          icalclass: "icalduration",
          /**
           * The type name, to be used in the jCal object.
           * @constant
           * @type {String}
           * @default "duration"
           */
          icaltype: "duration",
          /**
           * Returns a clone of the duration object.
           *
           * @return {ICAL.Duration}      The cloned object
           */
          clone: function clone2() {
            return ICAL2.Duration.fromData(this);
          },
          /**
           * The duration value expressed as a number of seconds.
           *
           * @return {Number}             The duration value in seconds
           */
          toSeconds: function toSeconds() {
            var seconds = this.seconds + 60 * this.minutes + 3600 * this.hours + 86400 * this.days + 7 * 86400 * this.weeks;
            return this.isNegative ? -seconds : seconds;
          },
          /**
           * Reads the passed seconds value into this duration object. Afterwards,
           * members like {@link ICAL.Duration#days days} and {@link ICAL.Duration#weeks weeks} will be set up
           * accordingly.
           *
           * @param {Number} aSeconds     The duration value in seconds
           * @return {ICAL.Duration}      Returns this instance
           */
          fromSeconds: function fromSeconds(aSeconds) {
            var secs = Math.abs(aSeconds);
            this.isNegative = aSeconds < 0;
            this.days = ICAL2.helpers.trunc(secs / 86400);
            if (this.days % 7 == 0) {
              this.weeks = this.days / 7;
              this.days = 0;
            } else {
              this.weeks = 0;
            }
            secs -= (this.days + 7 * this.weeks) * 86400;
            this.hours = ICAL2.helpers.trunc(secs / 3600);
            secs -= this.hours * 3600;
            this.minutes = ICAL2.helpers.trunc(secs / 60);
            secs -= this.minutes * 60;
            this.seconds = secs;
            return this;
          },
          /**
           * Sets up the current instance using members from the passed data object.
           *
           * @param {Object} aData               An object with members of the duration
           * @param {Number} aData.weeks         Duration in weeks
           * @param {Number} aData.days          Duration in days
           * @param {Number} aData.hours         Duration in hours
           * @param {Number} aData.minutes       Duration in minutes
           * @param {Number} aData.seconds       Duration in seconds
           * @param {Boolean} aData.isNegative   If true, the duration is negative
           */
          fromData: function fromData(aData) {
            var propsToCopy = [
              "weeks",
              "days",
              "hours",
              "minutes",
              "seconds",
              "isNegative"
            ];
            for (var key in propsToCopy) {
              if (!propsToCopy.hasOwnProperty(key)) {
                continue;
              }
              var prop = propsToCopy[key];
              if (aData && prop in aData) {
                this[prop] = aData[prop];
              } else {
                this[prop] = 0;
              }
            }
          },
          /**
           * Resets the duration instance to the default values, i.e. PT0S
           */
          reset: function reset() {
            this.isNegative = false;
            this.weeks = 0;
            this.days = 0;
            this.hours = 0;
            this.minutes = 0;
            this.seconds = 0;
          },
          /**
           * Compares the duration instance with another one.
           *
           * @param {ICAL.Duration} aOther        The instance to compare with
           * @return {Number}                     -1, 0 or 1 for less/equal/greater
           */
          compare: function compare(aOther) {
            var thisSeconds = this.toSeconds();
            var otherSeconds = aOther.toSeconds();
            return (thisSeconds > otherSeconds) - (thisSeconds < otherSeconds);
          },
          /**
           * Normalizes the duration instance. For example, a duration with a value
           * of 61 seconds will be normalized to 1 minute and 1 second.
           */
          normalize: function normalize() {
            this.fromSeconds(this.toSeconds());
          },
          /**
           * The string representation of this duration.
           * @return {String}
           */
          toString: function toString() {
            if (this.toSeconds() == 0) {
              return "PT0S";
            } else {
              var str = "";
              if (this.isNegative) str += "-";
              str += "P";
              if (this.weeks) str += this.weeks + "W";
              if (this.days) str += this.days + "D";
              if (this.hours || this.minutes || this.seconds) {
                str += "T";
                if (this.hours) str += this.hours + "H";
                if (this.minutes) str += this.minutes + "M";
                if (this.seconds) str += this.seconds + "S";
              }
              return str;
            }
          },
          /**
           * The iCalendar string representation of this duration.
           * @return {String}
           */
          toICALString: function() {
            return this.toString();
          }
        };
        ICAL2.Duration.fromSeconds = function icalduration_from_seconds(aSeconds) {
          return new ICAL2.Duration().fromSeconds(aSeconds);
        };
        function parseDurationChunk(letter, number, object) {
          var type;
          switch (letter) {
            case "P":
              if (number && number === "-") {
                object.isNegative = true;
              } else {
                object.isNegative = false;
              }
              break;
            case "D":
              type = "days";
              break;
            case "W":
              type = "weeks";
              break;
            case "H":
              type = "hours";
              break;
            case "M":
              type = "minutes";
              break;
            case "S":
              type = "seconds";
              break;
            default:
              return 0;
          }
          if (type) {
            if (!number && number !== 0) {
              throw new Error(
                'invalid duration value: Missing number before "' + letter + '"'
              );
            }
            var num = parseInt(number, 10);
            if (ICAL2.helpers.isStrictlyNaN(num)) {
              throw new Error(
                'invalid duration value: Invalid number "' + number + '" before "' + letter + '"'
              );
            }
            object[type] = num;
          }
          return 1;
        }
        ICAL2.Duration.isValueString = function(string) {
          return string[0] === "P" || string[1] === "P";
        };
        ICAL2.Duration.fromString = function icalduration_from_string(aStr) {
          var pos = 0;
          var dict = /* @__PURE__ */ Object.create(null);
          var chunks = 0;
          while ((pos = aStr.search(DURATION_LETTERS)) !== -1) {
            var type = aStr[pos];
            var numeric = aStr.substr(0, pos);
            aStr = aStr.substr(pos + 1);
            chunks += parseDurationChunk(type, numeric, dict);
          }
          if (chunks < 2) {
            throw new Error(
              'invalid duration value: Not enough duration components in "' + aStr + '"'
            );
          }
          return new ICAL2.Duration(dict);
        };
        ICAL2.Duration.fromData = function icalduration_from_data(aData) {
          return new ICAL2.Duration(aData);
        };
      })();
      (function() {
        var OPTIONS = [
          "tzid",
          "location",
          "tznames",
          "latitude",
          "longitude"
        ];
        ICAL2.Timezone = function icaltimezone(data) {
          this.wrappedJSObject = this;
          this.fromData(data);
        };
        ICAL2.Timezone.prototype = {
          /**
           * Timezone identifier
           * @type {String}
           */
          tzid: "",
          /**
           * Timezone location
           * @type {String}
           */
          location: "",
          /**
           * Alternative timezone name, for the string representation
           * @type {String}
           */
          tznames: "",
          /**
           * The primary latitude for the timezone.
           * @type {Number}
           */
          latitude: 0,
          /**
           * The primary longitude for the timezone.
           * @type {Number}
           */
          longitude: 0,
          /**
           * The vtimezone component for this timezone.
           * @type {ICAL.Component}
           */
          component: null,
          /**
           * The year this timezone has been expanded to. All timezone transition
           * dates until this year are known and can be used for calculation
           *
           * @private
           * @type {Number}
           */
          expandedUntilYear: 0,
          /**
           * The class identifier.
           * @constant
           * @type {String}
           * @default "icaltimezone"
           */
          icalclass: "icaltimezone",
          /**
           * Sets up the current instance using members from the passed data object.
           *
           * @param {ICAL.Component|Object} aData options for class
           * @param {String|ICAL.Component} aData.component
           *        If aData is a simple object, then this member can be set to either a
           *        string containing the component data, or an already parsed
           *        ICAL.Component
           * @param {String} aData.tzid      The timezone identifier
           * @param {String} aData.location  The timezone locationw
           * @param {String} aData.tznames   An alternative string representation of the
           *                                  timezone
           * @param {Number} aData.latitude  The latitude of the timezone
           * @param {Number} aData.longitude The longitude of the timezone
           */
          fromData: function fromData(aData) {
            this.expandedUntilYear = 0;
            this.changes = [];
            if (aData instanceof ICAL2.Component) {
              this.component = aData;
            } else {
              if (aData && "component" in aData) {
                if (typeof aData.component == "string") {
                  var jCal = ICAL2.parse(aData.component);
                  this.component = new ICAL2.Component(jCal);
                } else if (aData.component instanceof ICAL2.Component) {
                  this.component = aData.component;
                } else {
                  this.component = null;
                }
              }
              for (var key in OPTIONS) {
                if (OPTIONS.hasOwnProperty(key)) {
                  var prop = OPTIONS[key];
                  if (aData && prop in aData) {
                    this[prop] = aData[prop];
                  }
                }
              }
            }
            if (this.component instanceof ICAL2.Component && !this.tzid) {
              this.tzid = this.component.getFirstPropertyValue("tzid");
            }
            return this;
          },
          /**
           * Finds the utcOffset the given time would occur in this timezone.
           *
           * @param {ICAL.Time} tt        The time to check for
           * @return {Number} utc offset in seconds
           */
          utcOffset: function utcOffset(tt) {
            if (this == ICAL2.Timezone.utcTimezone || this == ICAL2.Timezone.localTimezone) {
              return 0;
            }
            this._ensureCoverage(tt.year);
            if (!this.changes.length) {
              return 0;
            }
            var tt_change = {
              year: tt.year,
              month: tt.month,
              day: tt.day,
              hour: tt.hour,
              minute: tt.minute,
              second: tt.second
            };
            var change_num = this._findNearbyChange(tt_change);
            var change_num_to_use = -1;
            var step = 1;
            for (; ; ) {
              var change = ICAL2.helpers.clone(this.changes[change_num], true);
              if (change.utcOffset < change.prevUtcOffset) {
                ICAL2.Timezone.adjust_change(change, 0, 0, 0, change.utcOffset);
              } else {
                ICAL2.Timezone.adjust_change(
                  change,
                  0,
                  0,
                  0,
                  change.prevUtcOffset
                );
              }
              var cmp = ICAL2.Timezone._compare_change_fn(tt_change, change);
              if (cmp >= 0) {
                change_num_to_use = change_num;
              } else {
                step = -1;
              }
              if (step == -1 && change_num_to_use != -1) {
                break;
              }
              change_num += step;
              if (change_num < 0) {
                return 0;
              }
              if (change_num >= this.changes.length) {
                break;
              }
            }
            var zone_change = this.changes[change_num_to_use];
            var utcOffset_change = zone_change.utcOffset - zone_change.prevUtcOffset;
            if (utcOffset_change < 0 && change_num_to_use > 0) {
              var tmp_change = ICAL2.helpers.clone(zone_change, true);
              ICAL2.Timezone.adjust_change(
                tmp_change,
                0,
                0,
                0,
                tmp_change.prevUtcOffset
              );
              if (ICAL2.Timezone._compare_change_fn(tt_change, tmp_change) < 0) {
                var prev_zone_change = this.changes[change_num_to_use - 1];
                var want_daylight = false;
                if (zone_change.is_daylight != want_daylight && prev_zone_change.is_daylight == want_daylight) {
                  zone_change = prev_zone_change;
                }
              }
            }
            return zone_change.utcOffset;
          },
          _findNearbyChange: function icaltimezone_find_nearby_change(change) {
            var idx = ICAL2.helpers.binsearchInsert(
              this.changes,
              change,
              ICAL2.Timezone._compare_change_fn
            );
            if (idx >= this.changes.length) {
              return this.changes.length - 1;
            }
            return idx;
          },
          _ensureCoverage: function(aYear) {
            if (ICAL2.Timezone._minimumExpansionYear == -1) {
              var today = ICAL2.Time.now();
              ICAL2.Timezone._minimumExpansionYear = today.year;
            }
            var changesEndYear = aYear;
            if (changesEndYear < ICAL2.Timezone._minimumExpansionYear) {
              changesEndYear = ICAL2.Timezone._minimumExpansionYear;
            }
            changesEndYear += ICAL2.Timezone.EXTRA_COVERAGE;
            if (changesEndYear > ICAL2.Timezone.MAX_YEAR) {
              changesEndYear = ICAL2.Timezone.MAX_YEAR;
            }
            if (!this.changes.length || this.expandedUntilYear < aYear) {
              var subcomps = this.component.getAllSubcomponents();
              var compLen = subcomps.length;
              var compIdx = 0;
              for (; compIdx < compLen; compIdx++) {
                this._expandComponent(
                  subcomps[compIdx],
                  changesEndYear,
                  this.changes
                );
              }
              this.changes.sort(ICAL2.Timezone._compare_change_fn);
              this.expandedUntilYear = changesEndYear;
            }
          },
          _expandComponent: function(aComponent, aYear, changes) {
            if (!aComponent.hasProperty("dtstart") || !aComponent.hasProperty("tzoffsetto") || !aComponent.hasProperty("tzoffsetfrom")) {
              return null;
            }
            var dtstart = aComponent.getFirstProperty("dtstart").getFirstValue();
            var change;
            function convert_tzoffset(offset) {
              return offset.factor * (offset.hours * 3600 + offset.minutes * 60);
            }
            function init_changes() {
              var changebase = {};
              changebase.is_daylight = aComponent.name == "daylight";
              changebase.utcOffset = convert_tzoffset(
                aComponent.getFirstProperty("tzoffsetto").getFirstValue()
              );
              changebase.prevUtcOffset = convert_tzoffset(
                aComponent.getFirstProperty("tzoffsetfrom").getFirstValue()
              );
              return changebase;
            }
            if (!aComponent.hasProperty("rrule") && !aComponent.hasProperty("rdate")) {
              change = init_changes();
              change.year = dtstart.year;
              change.month = dtstart.month;
              change.day = dtstart.day;
              change.hour = dtstart.hour;
              change.minute = dtstart.minute;
              change.second = dtstart.second;
              ICAL2.Timezone.adjust_change(
                change,
                0,
                0,
                0,
                -change.prevUtcOffset
              );
              changes.push(change);
            } else {
              var props = aComponent.getAllProperties("rdate");
              for (var rdatekey in props) {
                if (!props.hasOwnProperty(rdatekey)) {
                  continue;
                }
                var rdate = props[rdatekey];
                var time = rdate.getFirstValue();
                change = init_changes();
                change.year = time.year;
                change.month = time.month;
                change.day = time.day;
                if (time.isDate) {
                  change.hour = dtstart.hour;
                  change.minute = dtstart.minute;
                  change.second = dtstart.second;
                  if (dtstart.zone != ICAL2.Timezone.utcTimezone) {
                    ICAL2.Timezone.adjust_change(
                      change,
                      0,
                      0,
                      0,
                      -change.prevUtcOffset
                    );
                  }
                } else {
                  change.hour = time.hour;
                  change.minute = time.minute;
                  change.second = time.second;
                  if (time.zone != ICAL2.Timezone.utcTimezone) {
                    ICAL2.Timezone.adjust_change(
                      change,
                      0,
                      0,
                      0,
                      -change.prevUtcOffset
                    );
                  }
                }
                changes.push(change);
              }
              var rrule = aComponent.getFirstProperty("rrule");
              if (rrule) {
                rrule = rrule.getFirstValue();
                change = init_changes();
                if (rrule.until && rrule.until.zone == ICAL2.Timezone.utcTimezone) {
                  rrule.until.adjust(0, 0, 0, change.prevUtcOffset);
                  rrule.until.zone = ICAL2.Timezone.localTimezone;
                }
                var iterator = rrule.iterator(dtstart);
                var occ;
                while (occ = iterator.next()) {
                  change = init_changes();
                  if (occ.year > aYear || !occ) {
                    break;
                  }
                  change.year = occ.year;
                  change.month = occ.month;
                  change.day = occ.day;
                  change.hour = occ.hour;
                  change.minute = occ.minute;
                  change.second = occ.second;
                  change.isDate = occ.isDate;
                  ICAL2.Timezone.adjust_change(
                    change,
                    0,
                    0,
                    0,
                    -change.prevUtcOffset
                  );
                  changes.push(change);
                }
              }
            }
            return changes;
          },
          /**
           * The string representation of this timezone.
           * @return {String}
           */
          toString: function toString() {
            return this.tznames ? this.tznames : this.tzid;
          }
        };
        ICAL2.Timezone._compare_change_fn = function icaltimezone_compare_change_fn(a3, b3) {
          if (a3.year < b3.year) return -1;
          else if (a3.year > b3.year) return 1;
          if (a3.month < b3.month) return -1;
          else if (a3.month > b3.month) return 1;
          if (a3.day < b3.day) return -1;
          else if (a3.day > b3.day) return 1;
          if (a3.hour < b3.hour) return -1;
          else if (a3.hour > b3.hour) return 1;
          if (a3.minute < b3.minute) return -1;
          else if (a3.minute > b3.minute) return 1;
          if (a3.second < b3.second) return -1;
          else if (a3.second > b3.second) return 1;
          return 0;
        };
        ICAL2.Timezone.convert_time = function icaltimezone_convert_time(tt, from_zone, to_zone) {
          if (tt.isDate || from_zone.tzid == to_zone.tzid || from_zone == ICAL2.Timezone.localTimezone || to_zone == ICAL2.Timezone.localTimezone) {
            tt.zone = to_zone;
            return tt;
          }
          var utcOffset = from_zone.utcOffset(tt);
          tt.adjust(0, 0, 0, -utcOffset);
          utcOffset = to_zone.utcOffset(tt);
          tt.adjust(0, 0, 0, utcOffset);
          return null;
        };
        ICAL2.Timezone.fromData = function icaltimezone_fromData(aData) {
          var tt = new ICAL2.Timezone();
          return tt.fromData(aData);
        };
        ICAL2.Timezone.utcTimezone = ICAL2.Timezone.fromData({
          tzid: "UTC"
        });
        ICAL2.Timezone.localTimezone = ICAL2.Timezone.fromData({
          tzid: "floating"
        });
        ICAL2.Timezone.adjust_change = function icaltimezone_adjust_change(change, days, hours, minutes, seconds) {
          return ICAL2.Time.prototype.adjust.call(
            change,
            days,
            hours,
            minutes,
            seconds,
            change
          );
        };
        ICAL2.Timezone._minimumExpansionYear = -1;
        ICAL2.Timezone.MAX_YEAR = 2035;
        ICAL2.Timezone.EXTRA_COVERAGE = 5;
      })();
      ICAL2.TimezoneService = (function() {
        var zones;
        var TimezoneService = {
          get count() {
            return Object.keys(zones).length;
          },
          reset: function() {
            zones = /* @__PURE__ */ Object.create(null);
            var utc = ICAL2.Timezone.utcTimezone;
            zones.Z = utc;
            zones.UTC = utc;
            zones.GMT = utc;
          },
          /**
           * Checks if timezone id has been registered.
           *
           * @param {String} tzid     Timezone identifier (e.g. America/Los_Angeles)
           * @return {Boolean}        False, when not present
           */
          has: function(tzid) {
            return !!zones[tzid];
          },
          /**
           * Returns a timezone by its tzid if present.
           *
           * @param {String} tzid     Timezone identifier (e.g. America/Los_Angeles)
           * @return {?ICAL.Timezone} The timezone, or null if not found
           */
          get: function(tzid) {
            return zones[tzid];
          },
          /**
           * Registers a timezone object or component.
           *
           * @param {String=} name
           *        The name of the timezone. Defaults to the component's TZID if not
           *        passed.
           * @param {ICAL.Component|ICAL.Timezone} zone
           *        The initialized zone or vtimezone.
           */
          register: function(name, timezone) {
            if (name instanceof ICAL2.Component) {
              if (name.name === "vtimezone") {
                timezone = new ICAL2.Timezone(name);
                name = timezone.tzid;
              }
            }
            if (timezone instanceof ICAL2.Timezone) {
              zones[name] = timezone;
            } else {
              throw new TypeError("timezone must be ICAL.Timezone or ICAL.Component");
            }
          },
          /**
           * Removes a timezone by its tzid from the list.
           *
           * @param {String} tzid     Timezone identifier (e.g. America/Los_Angeles)
           * @return {?ICAL.Timezone} The removed timezone, or null if not registered
           */
          remove: function(tzid) {
            return delete zones[tzid];
          }
        };
        TimezoneService.reset();
        return TimezoneService;
      })();
      (function() {
        ICAL2.Time = function icaltime(data, zone) {
          this.wrappedJSObject = this;
          var time = this._time = /* @__PURE__ */ Object.create(null);
          time.year = 0;
          time.month = 1;
          time.day = 1;
          time.hour = 0;
          time.minute = 0;
          time.second = 0;
          time.isDate = false;
          this.fromData(data, zone);
        };
        ICAL2.Time._dowCache = {};
        ICAL2.Time._wnCache = {};
        ICAL2.Time.prototype = {
          /**
           * The class identifier.
           * @constant
           * @type {String}
           * @default "icaltime"
           */
          icalclass: "icaltime",
          _cachedUnixTime: null,
          /**
           * The type name, to be used in the jCal object. This value may change and
           * is strictly defined by the {@link ICAL.Time#isDate isDate} member.
           * @readonly
           * @type {String}
           * @default "date-time"
           */
          get icaltype() {
            return this.isDate ? "date" : "date-time";
          },
          /**
           * The timezone for this time.
           * @type {ICAL.Timezone}
           */
          zone: null,
          /**
           * Internal uses to indicate that a change has been made and the next read
           * operation must attempt to normalize the value (for example changing the
           * day to 33).
           *
           * @type {Boolean}
           * @private
           */
          _pendingNormalization: false,
          /**
           * Returns a clone of the time object.
           *
           * @return {ICAL.Time}              The cloned object
           */
          clone: function() {
            return new ICAL2.Time(this._time, this.zone);
          },
          /**
           * Reset the time instance to epoch time
           */
          reset: function icaltime_reset() {
            this.fromData(ICAL2.Time.epochTime);
            this.zone = ICAL2.Timezone.utcTimezone;
          },
          /**
           * Reset the time instance to the given date/time values.
           *
           * @param {Number} year             The year to set
           * @param {Number} month            The month to set
           * @param {Number} day              The day to set
           * @param {Number} hour             The hour to set
           * @param {Number} minute           The minute to set
           * @param {Number} second           The second to set
           * @param {ICAL.Timezone} timezone  The timezone to set
           */
          resetTo: function icaltime_resetTo(year, month, day, hour, minute, second, timezone) {
            this.fromData({
              year,
              month,
              day,
              hour,
              minute,
              second,
              zone: timezone
            });
          },
          /**
           * Set up the current instance from the Javascript date value.
           *
           * @param {?Date} aDate     The Javascript Date to read, or null to reset
           * @param {Boolean} useUTC  If true, the UTC values of the date will be used
           */
          fromJSDate: function icaltime_fromJSDate(aDate, useUTC) {
            if (!aDate) {
              this.reset();
            } else {
              if (useUTC) {
                this.zone = ICAL2.Timezone.utcTimezone;
                this.year = aDate.getUTCFullYear();
                this.month = aDate.getUTCMonth() + 1;
                this.day = aDate.getUTCDate();
                this.hour = aDate.getUTCHours();
                this.minute = aDate.getUTCMinutes();
                this.second = aDate.getUTCSeconds();
              } else {
                this.zone = ICAL2.Timezone.localTimezone;
                this.year = aDate.getFullYear();
                this.month = aDate.getMonth() + 1;
                this.day = aDate.getDate();
                this.hour = aDate.getHours();
                this.minute = aDate.getMinutes();
                this.second = aDate.getSeconds();
              }
            }
            this._cachedUnixTime = null;
            return this;
          },
          /**
           * Sets up the current instance using members from the passed data object.
           *
           * @param {Object} aData            Time initialization
           * @param {Number=} aData.year      The year for this date
           * @param {Number=} aData.month     The month for this date
           * @param {Number=} aData.day       The day for this date
           * @param {Number=} aData.hour      The hour for this date
           * @param {Number=} aData.minute    The minute for this date
           * @param {Number=} aData.second    The second for this date
           * @param {Boolean=} aData.isDate   If true, the instance represents a date
           *                                    (as opposed to a date-time)
           * @param {ICAL.Timezone=} aZone    Timezone this position occurs in
           */
          fromData: function fromData(aData, aZone) {
            if (aData) {
              for (var key in aData) {
                if (Object.prototype.hasOwnProperty.call(aData, key)) {
                  if (key === "icaltype") continue;
                  this[key] = aData[key];
                }
              }
            }
            if (aZone) {
              this.zone = aZone;
            }
            if (aData && !("isDate" in aData)) {
              this.isDate = !("hour" in aData);
            } else if (aData && "isDate" in aData) {
              this.isDate = aData.isDate;
            }
            if (aData && "timezone" in aData) {
              var zone = ICAL2.TimezoneService.get(
                aData.timezone
              );
              this.zone = zone || ICAL2.Timezone.localTimezone;
            }
            if (aData && "zone" in aData) {
              this.zone = aData.zone;
            }
            if (!this.zone) {
              this.zone = ICAL2.Timezone.localTimezone;
            }
            this._cachedUnixTime = null;
            return this;
          },
          /**
           * Calculate the day of week.
           * @param {ICAL.Time.weekDay=} aWeekStart
           *        The week start weekday, defaults to SUNDAY
           * @return {ICAL.Time.weekDay}
           */
          dayOfWeek: function icaltime_dayOfWeek(aWeekStart) {
            var firstDow = aWeekStart || ICAL2.Time.SUNDAY;
            var dowCacheKey = (this.year << 12) + (this.month << 8) + (this.day << 3) + firstDow;
            if (dowCacheKey in ICAL2.Time._dowCache) {
              return ICAL2.Time._dowCache[dowCacheKey];
            }
            var q3 = this.day;
            var m3 = this.month + (this.month < 3 ? 12 : 0);
            var Y = this.year - (this.month < 3 ? 1 : 0);
            var h3 = q3 + Y + ICAL2.helpers.trunc((m3 + 1) * 26 / 10) + ICAL2.helpers.trunc(Y / 4);
            if (true) {
              h3 += ICAL2.helpers.trunc(Y / 100) * 6 + ICAL2.helpers.trunc(Y / 400);
            } else {
              h3 += 5;
            }
            h3 = (h3 + 7 - firstDow) % 7 + 1;
            ICAL2.Time._dowCache[dowCacheKey] = h3;
            return h3;
          },
          /**
           * Calculate the day of year.
           * @return {Number}
           */
          dayOfYear: function dayOfYear() {
            var is_leap = ICAL2.Time.isLeapYear(this.year) ? 1 : 0;
            var diypm = ICAL2.Time.daysInYearPassedMonth;
            return diypm[is_leap][this.month - 1] + this.day;
          },
          /**
           * Returns a copy of the current date/time, rewound to the start of the
           * week. The resulting ICAL.Time instance is of icaltype date, even if this
           * is a date-time.
           *
           * @param {ICAL.Time.weekDay=} aWeekStart
           *        The week start weekday, defaults to SUNDAY
           * @return {ICAL.Time}      The start of the week (cloned)
           */
          startOfWeek: function startOfWeek(aWeekStart) {
            var firstDow = aWeekStart || ICAL2.Time.SUNDAY;
            var result = this.clone();
            result.day -= (this.dayOfWeek() + 7 - firstDow) % 7;
            result.isDate = true;
            result.hour = 0;
            result.minute = 0;
            result.second = 0;
            return result;
          },
          /**
           * Returns a copy of the current date/time, shifted to the end of the week.
           * The resulting ICAL.Time instance is of icaltype date, even if this is a
           * date-time.
           *
           * @param {ICAL.Time.weekDay=} aWeekStart
           *        The week start weekday, defaults to SUNDAY
           * @return {ICAL.Time}      The end of the week (cloned)
           */
          endOfWeek: function endOfWeek(aWeekStart) {
            var firstDow = aWeekStart || ICAL2.Time.SUNDAY;
            var result = this.clone();
            result.day += (7 - this.dayOfWeek() + firstDow - ICAL2.Time.SUNDAY) % 7;
            result.isDate = true;
            result.hour = 0;
            result.minute = 0;
            result.second = 0;
            return result;
          },
          /**
           * Returns a copy of the current date/time, rewound to the start of the
           * month. The resulting ICAL.Time instance is of icaltype date, even if
           * this is a date-time.
           *
           * @return {ICAL.Time}      The start of the month (cloned)
           */
          startOfMonth: function startOfMonth() {
            var result = this.clone();
            result.day = 1;
            result.isDate = true;
            result.hour = 0;
            result.minute = 0;
            result.second = 0;
            return result;
          },
          /**
           * Returns a copy of the current date/time, shifted to the end of the
           * month.  The resulting ICAL.Time instance is of icaltype date, even if
           * this is a date-time.
           *
           * @return {ICAL.Time}      The end of the month (cloned)
           */
          endOfMonth: function endOfMonth() {
            var result = this.clone();
            result.day = ICAL2.Time.daysInMonth(result.month, result.year);
            result.isDate = true;
            result.hour = 0;
            result.minute = 0;
            result.second = 0;
            return result;
          },
          /**
           * Returns a copy of the current date/time, rewound to the start of the
           * year. The resulting ICAL.Time instance is of icaltype date, even if
           * this is a date-time.
           *
           * @return {ICAL.Time}      The start of the year (cloned)
           */
          startOfYear: function startOfYear() {
            var result = this.clone();
            result.day = 1;
            result.month = 1;
            result.isDate = true;
            result.hour = 0;
            result.minute = 0;
            result.second = 0;
            return result;
          },
          /**
           * Returns a copy of the current date/time, shifted to the end of the
           * year.  The resulting ICAL.Time instance is of icaltype date, even if
           * this is a date-time.
           *
           * @return {ICAL.Time}      The end of the year (cloned)
           */
          endOfYear: function endOfYear() {
            var result = this.clone();
            result.day = 31;
            result.month = 12;
            result.isDate = true;
            result.hour = 0;
            result.minute = 0;
            result.second = 0;
            return result;
          },
          /**
           * First calculates the start of the week, then returns the day of year for
           * this date. If the day falls into the previous year, the day is zero or negative.
           *
           * @param {ICAL.Time.weekDay=} aFirstDayOfWeek
           *        The week start weekday, defaults to SUNDAY
           * @return {Number}     The calculated day of year
           */
          startDoyWeek: function startDoyWeek(aFirstDayOfWeek) {
            var firstDow = aFirstDayOfWeek || ICAL2.Time.SUNDAY;
            var delta = this.dayOfWeek() - firstDow;
            if (delta < 0) delta += 7;
            return this.dayOfYear() - delta;
          },
          /**
           * Get the dominical letter for the current year. Letters range from A - G
           * for common years, and AG to GF for leap years.
           *
           * @param {Number} yr           The year to retrieve the letter for
           * @return {String}             The dominical letter.
           */
          getDominicalLetter: function() {
            return ICAL2.Time.getDominicalLetter(this.year);
          },
          /**
           * Finds the nthWeekDay relative to the current month (not day).  The
           * returned value is a day relative the month that this month belongs to so
           * 1 would indicate the first of the month and 40 would indicate a day in
           * the following month.
           *
           * @param {Number} aDayOfWeek   Day of the week see the day name constants
           * @param {Number} aPos         Nth occurrence of a given week day values
           *        of 1 and 0 both indicate the first weekday of that type. aPos may
           *        be either positive or negative
           *
           * @return {Number} numeric value indicating a day relative
           *                   to the current month of this time object
           */
          nthWeekDay: function icaltime_nthWeekDay(aDayOfWeek, aPos) {
            var daysInMonth = ICAL2.Time.daysInMonth(this.month, this.year);
            var weekday;
            var pos = aPos;
            var start = 0;
            var otherDay = this.clone();
            if (pos >= 0) {
              otherDay.day = 1;
              if (pos != 0) {
                pos--;
              }
              start = otherDay.day;
              var startDow = otherDay.dayOfWeek();
              var offset = aDayOfWeek - startDow;
              if (offset < 0)
                offset += 7;
              start += offset;
              start -= aDayOfWeek;
              weekday = aDayOfWeek;
            } else {
              otherDay.day = daysInMonth;
              var endDow = otherDay.dayOfWeek();
              pos++;
              weekday = endDow - aDayOfWeek;
              if (weekday < 0) {
                weekday += 7;
              }
              weekday = daysInMonth - weekday;
            }
            weekday += pos * 7;
            return start + weekday;
          },
          /**
           * Checks if current time is the nth weekday, relative to the current
           * month.  Will always return false when rule resolves outside of current
           * month.
           *
           * @param {ICAL.Time.weekDay} aDayOfWeek       Day of week to check
           * @param {Number} aPos                        Relative position
           * @return {Boolean}                           True, if it is the nth weekday
           */
          isNthWeekDay: function(aDayOfWeek, aPos) {
            var dow = this.dayOfWeek();
            if (aPos === 0 && dow === aDayOfWeek) {
              return true;
            }
            var day = this.nthWeekDay(aDayOfWeek, aPos);
            if (day === this.day) {
              return true;
            }
            return false;
          },
          /**
           * Calculates the ISO 8601 week number. The first week of a year is the
           * week that contains the first Thursday. The year can have 53 weeks, if
           * January 1st is a Friday.
           *
           * Note there are regions where the first week of the year is the one that
           * starts on January 1st, which may offset the week number. Also, if a
           * different week start is specified, this will also affect the week
           * number.
           *
           * @see ICAL.Time.weekOneStarts
           * @param {ICAL.Time.weekDay} aWeekStart        The weekday the week starts with
           * @return {Number}                             The ISO week number
           */
          weekNumber: function weekNumber(aWeekStart) {
            var wnCacheKey = (this.year << 12) + (this.month << 8) + (this.day << 3) + aWeekStart;
            if (wnCacheKey in ICAL2.Time._wnCache) {
              return ICAL2.Time._wnCache[wnCacheKey];
            }
            var week1;
            var dt = this.clone();
            dt.isDate = true;
            var isoyear = this.year;
            if (dt.month == 12 && dt.day > 25) {
              week1 = ICAL2.Time.weekOneStarts(isoyear + 1, aWeekStart);
              if (dt.compare(week1) < 0) {
                week1 = ICAL2.Time.weekOneStarts(isoyear, aWeekStart);
              } else {
                isoyear++;
              }
            } else {
              week1 = ICAL2.Time.weekOneStarts(isoyear, aWeekStart);
              if (dt.compare(week1) < 0) {
                week1 = ICAL2.Time.weekOneStarts(--isoyear, aWeekStart);
              }
            }
            var daysBetween2 = dt.subtractDate(week1).toSeconds() / 86400;
            var answer = ICAL2.helpers.trunc(daysBetween2 / 7) + 1;
            ICAL2.Time._wnCache[wnCacheKey] = answer;
            return answer;
          },
          /**
           * Adds the duration to the current time. The instance is modified in
           * place.
           *
           * @param {ICAL.Duration} aDuration         The duration to add
           */
          addDuration: function icaltime_add(aDuration) {
            var mult = aDuration.isNegative ? -1 : 1;
            var second = this.second;
            var minute = this.minute;
            var hour = this.hour;
            var day = this.day;
            second += mult * aDuration.seconds;
            minute += mult * aDuration.minutes;
            hour += mult * aDuration.hours;
            day += mult * aDuration.days;
            day += mult * 7 * aDuration.weeks;
            this.second = second;
            this.minute = minute;
            this.hour = hour;
            this.day = day;
            this._cachedUnixTime = null;
          },
          /**
           * Subtract the date details (_excluding_ timezone).  Useful for finding
           * the relative difference between two time objects excluding their
           * timezone differences.
           *
           * @param {ICAL.Time} aDate     The date to substract
           * @return {ICAL.Duration}      The difference as a duration
           */
          subtractDate: function icaltime_subtract(aDate) {
            var unixTime = this.toUnixTime() + this.utcOffset();
            var other = aDate.toUnixTime() + aDate.utcOffset();
            return ICAL2.Duration.fromSeconds(unixTime - other);
          },
          /**
           * Subtract the date details, taking timezones into account.
           *
           * @param {ICAL.Time} aDate  The date to subtract
           * @return {ICAL.Duration}  The difference in duration
           */
          subtractDateTz: function icaltime_subtract_abs(aDate) {
            var unixTime = this.toUnixTime();
            var other = aDate.toUnixTime();
            return ICAL2.Duration.fromSeconds(unixTime - other);
          },
          /**
           * Compares the ICAL.Time instance with another one.
           *
           * @param {ICAL.Duration} aOther        The instance to compare with
           * @return {Number}                     -1, 0 or 1 for less/equal/greater
           */
          compare: function icaltime_compare(other) {
            var a3 = this.toUnixTime();
            var b3 = other.toUnixTime();
            if (a3 > b3) return 1;
            if (b3 > a3) return -1;
            return 0;
          },
          /**
           * Compares only the date part of this instance with another one.
           *
           * @param {ICAL.Duration} other         The instance to compare with
           * @param {ICAL.Timezone} tz            The timezone to compare in
           * @return {Number}                     -1, 0 or 1 for less/equal/greater
           */
          compareDateOnlyTz: function icaltime_compareDateOnlyTz(other, tz) {
            function cmp(attr) {
              return ICAL2.Time._cmp_attr(a3, b3, attr);
            }
            var a3 = this.convertToZone(tz);
            var b3 = other.convertToZone(tz);
            var rc = 0;
            if ((rc = cmp("year")) != 0) return rc;
            if ((rc = cmp("month")) != 0) return rc;
            if ((rc = cmp("day")) != 0) return rc;
            return rc;
          },
          /**
           * Convert the instance into another timezone. The returned ICAL.Time
           * instance is always a copy.
           *
           * @param {ICAL.Timezone} zone      The zone to convert to
           * @return {ICAL.Time}              The copy, converted to the zone
           */
          convertToZone: function convertToZone(zone) {
            var copy = this.clone();
            var zone_equals = this.zone.tzid == zone.tzid;
            if (!this.isDate && !zone_equals) {
              ICAL2.Timezone.convert_time(copy, this.zone, zone);
            }
            copy.zone = zone;
            return copy;
          },
          /**
           * Calculates the UTC offset of the current date/time in the timezone it is
           * in.
           *
           * @return {Number}     UTC offset in seconds
           */
          utcOffset: function utc_offset() {
            if (this.zone == ICAL2.Timezone.localTimezone || this.zone == ICAL2.Timezone.utcTimezone) {
              return 0;
            } else {
              return this.zone.utcOffset(this);
            }
          },
          /**
           * Returns an RFC 5545 compliant ical representation of this object.
           *
           * @return {String} ical date/date-time
           */
          toICALString: function() {
            var string = this.toString();
            if (string.length > 10) {
              return ICAL2.design.icalendar.value["date-time"].toICAL(string);
            } else {
              return ICAL2.design.icalendar.value.date.toICAL(string);
            }
          },
          /**
           * The string representation of this date/time, in jCal form
           * (including : and - separators).
           * @return {String}
           */
          toString: function toString() {
            var result = this.year + "-" + ICAL2.helpers.pad2(this.month) + "-" + ICAL2.helpers.pad2(this.day);
            if (!this.isDate) {
              result += "T" + ICAL2.helpers.pad2(this.hour) + ":" + ICAL2.helpers.pad2(this.minute) + ":" + ICAL2.helpers.pad2(this.second);
              if (this.zone === ICAL2.Timezone.utcTimezone) {
                result += "Z";
              }
            }
            return result;
          },
          /**
           * Converts the current instance to a Javascript date
           * @return {Date}
           */
          toJSDate: function toJSDate() {
            if (this.zone == ICAL2.Timezone.localTimezone) {
              if (this.isDate) {
                return new Date(this.year, this.month - 1, this.day);
              } else {
                return new Date(
                  this.year,
                  this.month - 1,
                  this.day,
                  this.hour,
                  this.minute,
                  this.second,
                  0
                );
              }
            } else {
              return new Date(this.toUnixTime() * 1e3);
            }
          },
          _normalize: function icaltime_normalize() {
            var isDate2 = this._time.isDate;
            if (this._time.isDate) {
              this._time.hour = 0;
              this._time.minute = 0;
              this._time.second = 0;
            }
            this.adjust(0, 0, 0, 0);
            return this;
          },
          /**
           * Adjust the date/time by the given offset
           *
           * @param {Number} aExtraDays       The extra amount of days
           * @param {Number} aExtraHours      The extra amount of hours
           * @param {Number} aExtraMinutes    The extra amount of minutes
           * @param {Number} aExtraSeconds    The extra amount of seconds
           * @param {Number=} aTime           The time to adjust, defaults to the
           *                                    current instance.
           */
          adjust: function icaltime_adjust(aExtraDays, aExtraHours, aExtraMinutes, aExtraSeconds, aTime) {
            var minutesOverflow, hoursOverflow, daysOverflow = 0, yearsOverflow = 0;
            var second, minute, hour, day;
            var daysInMonth;
            var time = aTime || this._time;
            if (!time.isDate) {
              second = time.second + aExtraSeconds;
              time.second = second % 60;
              minutesOverflow = ICAL2.helpers.trunc(second / 60);
              if (time.second < 0) {
                time.second += 60;
                minutesOverflow--;
              }
              minute = time.minute + aExtraMinutes + minutesOverflow;
              time.minute = minute % 60;
              hoursOverflow = ICAL2.helpers.trunc(minute / 60);
              if (time.minute < 0) {
                time.minute += 60;
                hoursOverflow--;
              }
              hour = time.hour + aExtraHours + hoursOverflow;
              time.hour = hour % 24;
              daysOverflow = ICAL2.helpers.trunc(hour / 24);
              if (time.hour < 0) {
                time.hour += 24;
                daysOverflow--;
              }
            }
            if (time.month > 12) {
              yearsOverflow = ICAL2.helpers.trunc((time.month - 1) / 12);
            } else if (time.month < 1) {
              yearsOverflow = ICAL2.helpers.trunc(time.month / 12) - 1;
            }
            time.year += yearsOverflow;
            time.month -= 12 * yearsOverflow;
            day = time.day + aExtraDays + daysOverflow;
            if (day > 0) {
              for (; ; ) {
                daysInMonth = ICAL2.Time.daysInMonth(time.month, time.year);
                if (day <= daysInMonth) {
                  break;
                }
                time.month++;
                if (time.month > 12) {
                  time.year++;
                  time.month = 1;
                }
                day -= daysInMonth;
              }
            } else {
              while (day <= 0) {
                if (time.month == 1) {
                  time.year--;
                  time.month = 12;
                } else {
                  time.month--;
                }
                day += ICAL2.Time.daysInMonth(time.month, time.year);
              }
            }
            time.day = day;
            this._cachedUnixTime = null;
            return this;
          },
          /**
           * Sets up the current instance from unix time, the number of seconds since
           * January 1st, 1970.
           *
           * @param {Number} seconds      The seconds to set up with
           */
          fromUnixTime: function fromUnixTime(seconds) {
            this.zone = ICAL2.Timezone.utcTimezone;
            var epoch = ICAL2.Time.epochTime.clone();
            epoch.adjust(0, 0, 0, seconds);
            this.year = epoch.year;
            this.month = epoch.month;
            this.day = epoch.day;
            this.hour = epoch.hour;
            this.minute = epoch.minute;
            this.second = Math.floor(epoch.second);
            this._cachedUnixTime = null;
          },
          /**
           * Converts the current instance to seconds since January 1st 1970.
           *
           * @return {Number}         Seconds since 1970
           */
          toUnixTime: function toUnixTime() {
            if (this._cachedUnixTime !== null) {
              return this._cachedUnixTime;
            }
            var offset = this.utcOffset();
            var ms = Date.UTC(
              this.year,
              this.month - 1,
              this.day,
              this.hour,
              this.minute,
              this.second - offset
            );
            this._cachedUnixTime = ms / 1e3;
            return this._cachedUnixTime;
          },
          /**
           * Converts time to into Object which can be serialized then re-created
           * using the constructor.
           *
           * @example
           * // toJSON will automatically be called
           * var json = JSON.stringify(mytime);
           *
           * var deserialized = JSON.parse(json);
           *
           * var time = new ICAL.Time(deserialized);
           *
           * @return {Object}
           */
          toJSON: function() {
            var copy = [
              "year",
              "month",
              "day",
              "hour",
              "minute",
              "second",
              "isDate"
            ];
            var result = /* @__PURE__ */ Object.create(null);
            var i3 = 0;
            var len = copy.length;
            var prop;
            for (; i3 < len; i3++) {
              prop = copy[i3];
              result[prop] = this[prop];
            }
            if (this.zone) {
              result.timezone = this.zone.tzid;
            }
            return result;
          }
        };
        (function setupNormalizeAttributes() {
          function defineAttr(attr) {
            Object.defineProperty(ICAL2.Time.prototype, attr, {
              get: function getTimeAttr() {
                if (this._pendingNormalization) {
                  this._normalize();
                  this._pendingNormalization = false;
                }
                return this._time[attr];
              },
              set: function setTimeAttr(val) {
                if (attr === "isDate" && val && !this._time.isDate) {
                  this.adjust(0, 0, 0, 0);
                }
                this._cachedUnixTime = null;
                this._pendingNormalization = true;
                this._time[attr] = val;
                return val;
              }
            });
          }
          if ("defineProperty" in Object) {
            defineAttr("year");
            defineAttr("month");
            defineAttr("day");
            defineAttr("hour");
            defineAttr("minute");
            defineAttr("second");
            defineAttr("isDate");
          }
        })();
        ICAL2.Time.daysInMonth = function icaltime_daysInMonth(month, year) {
          var _daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
          var days = 30;
          if (month < 1 || month > 12) return days;
          days = _daysInMonth[month];
          if (month == 2) {
            days += ICAL2.Time.isLeapYear(year);
          }
          return days;
        };
        ICAL2.Time.isLeapYear = function isLeapYear2(year) {
          if (year <= 1752) {
            return year % 4 == 0;
          } else {
            return year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
          }
        };
        ICAL2.Time.fromDayOfYear = function icaltime_fromDayOfYear(aDayOfYear, aYear) {
          var year = aYear;
          var doy = aDayOfYear;
          var tt = new ICAL2.Time();
          tt.auto_normalize = false;
          var is_leap = ICAL2.Time.isLeapYear(year) ? 1 : 0;
          if (doy < 1) {
            year--;
            is_leap = ICAL2.Time.isLeapYear(year) ? 1 : 0;
            doy += ICAL2.Time.daysInYearPassedMonth[is_leap][12];
            return ICAL2.Time.fromDayOfYear(doy, year);
          } else if (doy > ICAL2.Time.daysInYearPassedMonth[is_leap][12]) {
            is_leap = ICAL2.Time.isLeapYear(year) ? 1 : 0;
            doy -= ICAL2.Time.daysInYearPassedMonth[is_leap][12];
            year++;
            return ICAL2.Time.fromDayOfYear(doy, year);
          }
          tt.year = year;
          tt.isDate = true;
          for (var month = 11; month >= 0; month--) {
            if (doy > ICAL2.Time.daysInYearPassedMonth[is_leap][month]) {
              tt.month = month + 1;
              tt.day = doy - ICAL2.Time.daysInYearPassedMonth[is_leap][month];
              break;
            }
          }
          tt.auto_normalize = true;
          return tt;
        };
        ICAL2.Time.fromStringv2 = function fromString(str) {
          return new ICAL2.Time({
            year: parseInt(str.substr(0, 4), 10),
            month: parseInt(str.substr(5, 2), 10),
            day: parseInt(str.substr(8, 2), 10),
            isDate: true
          });
        };
        ICAL2.Time.fromDateString = function(aValue) {
          return new ICAL2.Time({
            year: ICAL2.helpers.strictParseInt(aValue.substr(0, 4)),
            month: ICAL2.helpers.strictParseInt(aValue.substr(5, 2)),
            day: ICAL2.helpers.strictParseInt(aValue.substr(8, 2)),
            isDate: true
          });
        };
        ICAL2.Time.fromDateTimeString = function(aValue, prop) {
          if (aValue.length < 19) {
            throw new Error(
              'invalid date-time value: "' + aValue + '"'
            );
          }
          var zone;
          if (aValue[19] && aValue[19] === "Z") {
            zone = "Z";
          } else if (prop) {
            zone = prop.getParameter("tzid");
          }
          var time = new ICAL2.Time({
            year: ICAL2.helpers.strictParseInt(aValue.substr(0, 4)),
            month: ICAL2.helpers.strictParseInt(aValue.substr(5, 2)),
            day: ICAL2.helpers.strictParseInt(aValue.substr(8, 2)),
            hour: ICAL2.helpers.strictParseInt(aValue.substr(11, 2)),
            minute: ICAL2.helpers.strictParseInt(aValue.substr(14, 2)),
            second: ICAL2.helpers.strictParseInt(aValue.substr(17, 2)),
            timezone: zone
          });
          return time;
        };
        ICAL2.Time.fromString = function fromString(aValue, aProperty) {
          if (aValue.length > 10) {
            return ICAL2.Time.fromDateTimeString(aValue, aProperty);
          } else {
            return ICAL2.Time.fromDateString(aValue);
          }
        };
        ICAL2.Time.fromJSDate = function fromJSDate(aDate, useUTC) {
          var tt = new ICAL2.Time();
          return tt.fromJSDate(aDate, useUTC);
        };
        ICAL2.Time.fromData = function fromData(aData, aZone) {
          var t3 = new ICAL2.Time();
          return t3.fromData(aData, aZone);
        };
        ICAL2.Time.now = function icaltime_now() {
          return ICAL2.Time.fromJSDate(/* @__PURE__ */ new Date(), false);
        };
        ICAL2.Time.weekOneStarts = function weekOneStarts(aYear, aWeekStart) {
          var t3 = ICAL2.Time.fromData({
            year: aYear,
            month: 1,
            day: 1,
            isDate: true
          });
          var dow = t3.dayOfWeek();
          var wkst = aWeekStart || ICAL2.Time.DEFAULT_WEEK_START;
          if (dow > ICAL2.Time.THURSDAY) {
            t3.day += 7;
          }
          if (wkst > ICAL2.Time.THURSDAY) {
            t3.day -= 7;
          }
          t3.day -= dow - wkst;
          return t3;
        };
        ICAL2.Time.getDominicalLetter = function(yr) {
          var LTRS = "GFEDCBA";
          var dom = (yr + (yr / 4 | 0) + (yr / 400 | 0) - (yr / 100 | 0) - 1) % 7;
          var isLeap = ICAL2.Time.isLeapYear(yr);
          if (isLeap) {
            return LTRS[(dom + 6) % 7] + LTRS[dom];
          } else {
            return LTRS[dom];
          }
        };
        ICAL2.Time.epochTime = ICAL2.Time.fromData({
          year: 1970,
          month: 1,
          day: 1,
          hour: 0,
          minute: 0,
          second: 0,
          isDate: false,
          timezone: "Z"
        });
        ICAL2.Time._cmp_attr = function _cmp_attr(a3, b3, attr) {
          if (a3[attr] > b3[attr]) return 1;
          if (a3[attr] < b3[attr]) return -1;
          return 0;
        };
        ICAL2.Time.daysInYearPassedMonth = [
          [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365],
          [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366]
        ];
        ICAL2.Time.SUNDAY = 1;
        ICAL2.Time.MONDAY = 2;
        ICAL2.Time.TUESDAY = 3;
        ICAL2.Time.WEDNESDAY = 4;
        ICAL2.Time.THURSDAY = 5;
        ICAL2.Time.FRIDAY = 6;
        ICAL2.Time.SATURDAY = 7;
        ICAL2.Time.DEFAULT_WEEK_START = ICAL2.Time.MONDAY;
      })();
      (function() {
        ICAL2.VCardTime = function(data, zone, icaltype) {
          this.wrappedJSObject = this;
          var time = this._time = /* @__PURE__ */ Object.create(null);
          time.year = null;
          time.month = null;
          time.day = null;
          time.hour = null;
          time.minute = null;
          time.second = null;
          this.icaltype = icaltype || "date-and-or-time";
          this.fromData(data, zone);
        };
        ICAL2.helpers.inherits(
          ICAL2.Time,
          ICAL2.VCardTime,
          /** @lends ICAL.VCardTime */
          {
            /**
             * The class identifier.
             * @constant
             * @type {String}
             * @default "vcardtime"
             */
            icalclass: "vcardtime",
            /**
             * The type name, to be used in the jCal object.
             * @type {String}
             * @default "date-and-or-time"
             */
            icaltype: "date-and-or-time",
            /**
             * The timezone. This can either be floating, UTC, or an instance of
             * ICAL.UtcOffset.
             * @type {ICAL.Timezone|ICAL.UtcOFfset}
             */
            zone: null,
            /**
             * Returns a clone of the vcard date/time object.
             *
             * @return {ICAL.VCardTime}     The cloned object
             */
            clone: function() {
              return new ICAL2.VCardTime(this._time, this.zone, this.icaltype);
            },
            _normalize: function() {
              return this;
            },
            /**
             * @inheritdoc
             */
            utcOffset: function() {
              if (this.zone instanceof ICAL2.UtcOffset) {
                return this.zone.toSeconds();
              } else {
                return ICAL2.Time.prototype.utcOffset.apply(this, arguments);
              }
            },
            /**
             * Returns an RFC 6350 compliant representation of this object.
             *
             * @return {String}         vcard date/time string
             */
            toICALString: function() {
              return ICAL2.design.vcard.value[this.icaltype].toICAL(this.toString());
            },
            /**
             * The string representation of this date/time, in jCard form
             * (including : and - separators).
             * @return {String}
             */
            toString: function toString() {
              var p22 = ICAL2.helpers.pad2;
              var y3 = this.year, m3 = this.month, d2 = this.day;
              var h3 = this.hour, mm = this.minute, s3 = this.second;
              var hasYear = y3 !== null, hasMonth = m3 !== null, hasDay = d2 !== null;
              var hasHour = h3 !== null, hasMinute = mm !== null, hasSecond = s3 !== null;
              var datepart = (hasYear ? p22(y3) + (hasMonth || hasDay ? "-" : "") : hasMonth || hasDay ? "--" : "") + (hasMonth ? p22(m3) : "") + (hasDay ? "-" + p22(d2) : "");
              var timepart = (hasHour ? p22(h3) : "-") + (hasHour && hasMinute ? ":" : "") + (hasMinute ? p22(mm) : "") + (!hasHour && !hasMinute ? "-" : "") + (hasMinute && hasSecond ? ":" : "") + (hasSecond ? p22(s3) : "");
              var zone;
              if (this.zone === ICAL2.Timezone.utcTimezone) {
                zone = "Z";
              } else if (this.zone instanceof ICAL2.UtcOffset) {
                zone = this.zone.toString();
              } else if (this.zone === ICAL2.Timezone.localTimezone) {
                zone = "";
              } else if (this.zone instanceof ICAL2.Timezone) {
                var offset = ICAL2.UtcOffset.fromSeconds(this.zone.utcOffset(this));
                zone = offset.toString();
              } else {
                zone = "";
              }
              switch (this.icaltype) {
                case "time":
                  return timepart + zone;
                case "date-and-or-time":
                case "date-time":
                  return datepart + (timepart == "--" ? "" : "T" + timepart + zone);
                case "date":
                  return datepart;
              }
              return null;
            }
          }
        );
        ICAL2.VCardTime.fromDateAndOrTimeString = function(aValue, aIcalType) {
          function part(v3, s3, e3) {
            return v3 ? ICAL2.helpers.strictParseInt(v3.substr(s3, e3)) : null;
          }
          var parts = aValue.split("T");
          var dt = parts[0], tmz = parts[1];
          var splitzone = tmz ? ICAL2.design.vcard.value.time._splitZone(tmz) : [];
          var zone = splitzone[0], tm = splitzone[1];
          var stoi = ICAL2.helpers.strictParseInt;
          var dtlen = dt ? dt.length : 0;
          var tmlen = tm ? tm.length : 0;
          var hasDashDate = dt && dt[0] == "-" && dt[1] == "-";
          var hasDashTime = tm && tm[0] == "-";
          var o2 = {
            year: hasDashDate ? null : part(dt, 0, 4),
            month: hasDashDate && (dtlen == 4 || dtlen == 7) ? part(dt, 2, 2) : dtlen == 7 ? part(dt, 5, 2) : dtlen == 10 ? part(dt, 5, 2) : null,
            day: dtlen == 5 ? part(dt, 3, 2) : dtlen == 7 && hasDashDate ? part(dt, 5, 2) : dtlen == 10 ? part(dt, 8, 2) : null,
            hour: hasDashTime ? null : part(tm, 0, 2),
            minute: hasDashTime && tmlen == 3 ? part(tm, 1, 2) : tmlen > 4 ? hasDashTime ? part(tm, 1, 2) : part(tm, 3, 2) : null,
            second: tmlen == 4 ? part(tm, 2, 2) : tmlen == 6 ? part(tm, 4, 2) : tmlen == 8 ? part(tm, 6, 2) : null
          };
          if (zone == "Z") {
            zone = ICAL2.Timezone.utcTimezone;
          } else if (zone && zone[3] == ":") {
            zone = ICAL2.UtcOffset.fromString(zone);
          } else {
            zone = null;
          }
          return new ICAL2.VCardTime(o2, zone, aIcalType);
        };
      })();
      (function() {
        var DOW_MAP = {
          SU: ICAL2.Time.SUNDAY,
          MO: ICAL2.Time.MONDAY,
          TU: ICAL2.Time.TUESDAY,
          WE: ICAL2.Time.WEDNESDAY,
          TH: ICAL2.Time.THURSDAY,
          FR: ICAL2.Time.FRIDAY,
          SA: ICAL2.Time.SATURDAY
        };
        var REVERSE_DOW_MAP = {};
        for (var key in DOW_MAP) {
          if (DOW_MAP.hasOwnProperty(key)) {
            REVERSE_DOW_MAP[DOW_MAP[key]] = key;
          }
        }
        var COPY_PARTS = [
          "BYSECOND",
          "BYMINUTE",
          "BYHOUR",
          "BYDAY",
          "BYMONTHDAY",
          "BYYEARDAY",
          "BYWEEKNO",
          "BYMONTH",
          "BYSETPOS"
        ];
        ICAL2.Recur = function icalrecur(data) {
          this.wrappedJSObject = this;
          this.parts = {};
          if (data && typeof data === "object") {
            this.fromData(data);
          }
        };
        ICAL2.Recur.prototype = {
          /**
           * An object holding the BY-parts of the recurrence rule
           * @type {Object}
           */
          parts: null,
          /**
           * The interval value for the recurrence rule.
           * @type {Number}
           */
          interval: 1,
          /**
           * The week start day
           *
           * @type {ICAL.Time.weekDay}
           * @default ICAL.Time.MONDAY
           */
          wkst: ICAL2.Time.MONDAY,
          /**
           * The end of the recurrence
           * @type {?ICAL.Time}
           */
          until: null,
          /**
           * The maximum number of occurrences
           * @type {?Number}
           */
          count: null,
          /**
           * The frequency value.
           * @type {ICAL.Recur.frequencyValues}
           */
          freq: null,
          /**
           * The class identifier.
           * @constant
           * @type {String}
           * @default "icalrecur"
           */
          icalclass: "icalrecur",
          /**
           * The type name, to be used in the jCal object.
           * @constant
           * @type {String}
           * @default "recur"
           */
          icaltype: "recur",
          /**
           * Create a new iterator for this recurrence rule. The passed start date
           * must be the start date of the event, not the start of the range to
           * search in.
           *
           * @example
           * var recur = comp.getFirstPropertyValue('rrule');
           * var dtstart = comp.getFirstPropertyValue('dtstart');
           * var iter = recur.iterator(dtstart);
           * for (var next = iter.next(); next; next = iter.next()) {
           *   if (next.compare(rangeStart) < 0) {
           *     continue;
           *   }
           *   console.log(next.toString());
           * }
           *
           * @param {ICAL.Time} aStart        The item's start date
           * @return {ICAL.RecurIterator}     The recurrence iterator
           */
          iterator: function(aStart) {
            return new ICAL2.RecurIterator({
              rule: this,
              dtstart: aStart
            });
          },
          /**
           * Returns a clone of the recurrence object.
           *
           * @return {ICAL.Recur}      The cloned object
           */
          clone: function clone2() {
            return new ICAL2.Recur(this.toJSON());
          },
          /**
           * Checks if the current rule is finite, i.e. has a count or until part.
           *
           * @return {Boolean}        True, if the rule is finite
           */
          isFinite: function isfinite() {
            return !!(this.count || this.until);
          },
          /**
           * Checks if the current rule has a count part, and not limited by an until
           * part.
           *
           * @return {Boolean}        True, if the rule is by count
           */
          isByCount: function isbycount() {
            return !!(this.count && !this.until);
          },
          /**
           * Adds a component (part) to the recurrence rule. This is not a component
           * in the sense of {@link ICAL.Component}, but a part of the recurrence
           * rule, i.e. BYMONTH.
           *
           * @param {String} aType            The name of the component part
           * @param {Array|String} aValue     The component value
           */
          addComponent: function addPart(aType, aValue) {
            var ucname = aType.toUpperCase();
            if (ucname in this.parts) {
              this.parts[ucname].push(aValue);
            } else {
              this.parts[ucname] = [aValue];
            }
          },
          /**
           * Sets the component value for the given by-part.
           *
           * @param {String} aType        The component part name
           * @param {Array} aValues       The component values
           */
          setComponent: function setComponent(aType, aValues) {
            this.parts[aType.toUpperCase()] = aValues.slice();
          },
          /**
           * Gets (a copy) of the requested component value.
           *
           * @param {String} aType        The component part name
           * @return {Array}              The component part value
           */
          getComponent: function getComponent(aType) {
            var ucname = aType.toUpperCase();
            return ucname in this.parts ? this.parts[ucname].slice() : [];
          },
          /**
           * Retrieves the next occurrence after the given recurrence id. See the
           * guide on {@tutorial terminology} for more details.
           *
           * NOTE: Currently, this method iterates all occurrences from the start
           * date. It should not be called in a loop for performance reasons. If you
           * would like to get more than one occurrence, you can iterate the
           * occurrences manually, see the example on the
           * {@link ICAL.Recur#iterator iterator} method.
           *
           * @param {ICAL.Time} aStartTime        The start of the event series
           * @param {ICAL.Time} aRecurrenceId     The date of the last occurrence
           * @return {ICAL.Time}                  The next occurrence after
           */
          getNextOccurrence: function getNextOccurrence(aStartTime, aRecurrenceId) {
            var iter2 = this.iterator(aStartTime);
            var next, cdt;
            do {
              next = iter2.next();
            } while (next && next.compare(aRecurrenceId) <= 0);
            if (next && aRecurrenceId.zone) {
              next.zone = aRecurrenceId.zone;
            }
            return next;
          },
          /**
           * Sets up the current instance using members from the passed data object.
           *
           * @param {Object} data                               An object with members of the recurrence
           * @param {ICAL.Recur.frequencyValues=} data.freq     The frequency value
           * @param {Number=} data.interval                     The INTERVAL value
           * @param {ICAL.Time.weekDay=} data.wkst              The week start value
           * @param {ICAL.Time=} data.until                     The end of the recurrence set
           * @param {Number=} data.count                        The number of occurrences
           * @param {Array.<Number>=} data.bysecond             The seconds for the BYSECOND part
           * @param {Array.<Number>=} data.byminute             The minutes for the BYMINUTE part
           * @param {Array.<Number>=} data.byhour               The hours for the BYHOUR part
           * @param {Array.<String>=} data.byday                The BYDAY values
           * @param {Array.<Number>=} data.bymonthday           The days for the BYMONTHDAY part
           * @param {Array.<Number>=} data.byyearday            The days for the BYYEARDAY part
           * @param {Array.<Number>=} data.byweekno             The weeks for the BYWEEKNO part
           * @param {Array.<Number>=} data.bymonth              The month for the BYMONTH part
           * @param {Array.<Number>=} data.bysetpos             The positionals for the BYSETPOS part
           */
          fromData: function(data) {
            for (var key2 in data) {
              var uckey = key2.toUpperCase();
              if (uckey in partDesign) {
                if (Array.isArray(data[key2])) {
                  this.parts[uckey] = data[key2];
                } else {
                  this.parts[uckey] = [data[key2]];
                }
              } else {
                this[key2] = data[key2];
              }
            }
            if (this.interval && typeof this.interval != "number") {
              optionDesign.INTERVAL(this.interval, this);
            }
            if (this.wkst && typeof this.wkst != "number") {
              this.wkst = ICAL2.Recur.icalDayToNumericDay(this.wkst);
            }
            if (this.until && !(this.until instanceof ICAL2.Time)) {
              this.until = ICAL2.Time.fromString(this.until);
            }
          },
          /**
           * The jCal representation of this recurrence type.
           * @return {Object}
           */
          toJSON: function() {
            var res = /* @__PURE__ */ Object.create(null);
            res.freq = this.freq;
            if (this.count) {
              res.count = this.count;
            }
            if (this.interval > 1) {
              res.interval = this.interval;
            }
            for (var k3 in this.parts) {
              if (!this.parts.hasOwnProperty(k3)) {
                continue;
              }
              var kparts = this.parts[k3];
              if (Array.isArray(kparts) && kparts.length == 1) {
                res[k3.toLowerCase()] = kparts[0];
              } else {
                res[k3.toLowerCase()] = ICAL2.helpers.clone(this.parts[k3]);
              }
            }
            if (this.until) {
              res.until = this.until.toString();
            }
            if ("wkst" in this && this.wkst !== ICAL2.Time.DEFAULT_WEEK_START) {
              res.wkst = ICAL2.Recur.numericDayToIcalDay(this.wkst);
            }
            return res;
          },
          /**
           * The string representation of this recurrence rule.
           * @return {String}
           */
          toString: function icalrecur_toString() {
            var str = "FREQ=" + this.freq;
            if (this.count) {
              str += ";COUNT=" + this.count;
            }
            if (this.interval > 1) {
              str += ";INTERVAL=" + this.interval;
            }
            for (var k3 in this.parts) {
              if (this.parts.hasOwnProperty(k3)) {
                str += ";" + k3 + "=" + this.parts[k3];
              }
            }
            if (this.until) {
              str += ";UNTIL=" + this.until.toICALString();
            }
            if ("wkst" in this && this.wkst !== ICAL2.Time.DEFAULT_WEEK_START) {
              str += ";WKST=" + ICAL2.Recur.numericDayToIcalDay(this.wkst);
            }
            return str;
          }
        };
        function parseNumericValue(type, min, max, value) {
          var result = value;
          if (value[0] === "+") {
            result = value.substr(1);
          }
          result = ICAL2.helpers.strictParseInt(result);
          if (min !== void 0 && value < min) {
            throw new Error(
              type + ': invalid value "' + value + '" must be > ' + min
            );
          }
          if (max !== void 0 && value > max) {
            throw new Error(
              type + ': invalid value "' + value + '" must be < ' + min
            );
          }
          return result;
        }
        ICAL2.Recur.icalDayToNumericDay = function toNumericDay(string, aWeekStart) {
          var firstDow = aWeekStart || ICAL2.Time.SUNDAY;
          return (DOW_MAP[string] - firstDow + 7) % 7 + 1;
        };
        ICAL2.Recur.numericDayToIcalDay = function toIcalDay(num, aWeekStart) {
          var firstDow = aWeekStart || ICAL2.Time.SUNDAY;
          var dow = num + firstDow - ICAL2.Time.SUNDAY;
          if (dow > 7) {
            dow -= 7;
          }
          return REVERSE_DOW_MAP[dow];
        };
        var VALID_DAY_NAMES = /^(SU|MO|TU|WE|TH|FR|SA)$/;
        var VALID_BYDAY_PART = /^([+-])?(5[0-3]|[1-4][0-9]|[1-9])?(SU|MO|TU|WE|TH|FR|SA)$/;
        var ALLOWED_FREQ = [
          "SECONDLY",
          "MINUTELY",
          "HOURLY",
          "DAILY",
          "WEEKLY",
          "MONTHLY",
          "YEARLY"
        ];
        var optionDesign = {
          FREQ: function(value, dict, fmtIcal) {
            if (ALLOWED_FREQ.indexOf(value) !== -1) {
              dict.freq = value;
            } else {
              throw new Error(
                'invalid frequency "' + value + '" expected: "' + ALLOWED_FREQ.join(", ") + '"'
              );
            }
          },
          COUNT: function(value, dict, fmtIcal) {
            dict.count = ICAL2.helpers.strictParseInt(value);
          },
          INTERVAL: function(value, dict, fmtIcal) {
            dict.interval = ICAL2.helpers.strictParseInt(value);
            if (dict.interval < 1) {
              dict.interval = 1;
            }
          },
          UNTIL: function(value, dict, fmtIcal) {
            if (value.length > 10) {
              dict.until = ICAL2.design.icalendar.value["date-time"].fromICAL(value);
            } else {
              dict.until = ICAL2.design.icalendar.value.date.fromICAL(value);
            }
            if (!fmtIcal) {
              dict.until = ICAL2.Time.fromString(dict.until);
            }
          },
          WKST: function(value, dict, fmtIcal) {
            if (VALID_DAY_NAMES.test(value)) {
              dict.wkst = ICAL2.Recur.icalDayToNumericDay(value);
            } else {
              throw new Error('invalid WKST value "' + value + '"');
            }
          }
        };
        var partDesign = {
          BYSECOND: parseNumericValue.bind(this, "BYSECOND", 0, 60),
          BYMINUTE: parseNumericValue.bind(this, "BYMINUTE", 0, 59),
          BYHOUR: parseNumericValue.bind(this, "BYHOUR", 0, 23),
          BYDAY: function(value) {
            if (VALID_BYDAY_PART.test(value)) {
              return value;
            } else {
              throw new Error('invalid BYDAY value "' + value + '"');
            }
          },
          BYMONTHDAY: parseNumericValue.bind(this, "BYMONTHDAY", -31, 31),
          BYYEARDAY: parseNumericValue.bind(this, "BYYEARDAY", -366, 366),
          BYWEEKNO: parseNumericValue.bind(this, "BYWEEKNO", -53, 53),
          BYMONTH: parseNumericValue.bind(this, "BYMONTH", 1, 12),
          BYSETPOS: parseNumericValue.bind(this, "BYSETPOS", -366, 366)
        };
        ICAL2.Recur.fromString = function(string) {
          var data = ICAL2.Recur._stringToData(string, false);
          return new ICAL2.Recur(data);
        };
        ICAL2.Recur.fromData = function(aData) {
          return new ICAL2.Recur(aData);
        };
        ICAL2.Recur._stringToData = function(string, fmtIcal) {
          var dict = /* @__PURE__ */ Object.create(null);
          var values = string.split(";");
          var len = values.length;
          for (var i3 = 0; i3 < len; i3++) {
            var parts = values[i3].split("=");
            var ucname = parts[0].toUpperCase();
            var lcname = parts[0].toLowerCase();
            var name = fmtIcal ? lcname : ucname;
            var value = parts[1];
            if (ucname in partDesign) {
              var partArr = value.split(",");
              var partArrIdx = 0;
              var partArrLen = partArr.length;
              for (; partArrIdx < partArrLen; partArrIdx++) {
                partArr[partArrIdx] = partDesign[ucname](partArr[partArrIdx]);
              }
              dict[name] = partArr.length == 1 ? partArr[0] : partArr;
            } else if (ucname in optionDesign) {
              optionDesign[ucname](value, dict, fmtIcal);
            } else {
              dict[lcname] = value;
            }
          }
          return dict;
        };
      })();
      ICAL2.RecurIterator = (function() {
        function icalrecur_iterator(options) {
          this.fromData(options);
        }
        icalrecur_iterator.prototype = {
          /**
           * True when iteration is finished.
           * @type {Boolean}
           */
          completed: false,
          /**
           * The rule that is being iterated
           * @type {ICAL.Recur}
           */
          rule: null,
          /**
           * The start date of the event being iterated.
           * @type {ICAL.Time}
           */
          dtstart: null,
          /**
           * The last occurrence that was returned from the
           * {@link ICAL.RecurIterator#next} method.
           * @type {ICAL.Time}
           */
          last: null,
          /**
           * The sequence number from the occurrence
           * @type {Number}
           */
          occurrence_number: 0,
          /**
           * The indices used for the {@link ICAL.RecurIterator#by_data} object.
           * @type {Object}
           * @private
           */
          by_indices: null,
          /**
           * If true, the iterator has already been initialized
           * @type {Boolean}
           * @private
           */
          initialized: false,
          /**
           * The initializd by-data.
           * @type {Object}
           * @private
           */
          by_data: null,
          /**
           * The expanded yeardays
           * @type {Array}
           * @private
           */
          days: null,
          /**
           * The index in the {@link ICAL.RecurIterator#days} array.
           * @type {Number}
           * @private
           */
          days_index: 0,
          /**
           * Initialize the recurrence iterator from the passed data object. This
           * method is usually not called directly, you can initialize the iterator
           * through the constructor.
           *
           * @param {Object} options                The iterator options
           * @param {ICAL.Recur} options.rule       The rule to iterate.
           * @param {ICAL.Time} options.dtstart     The start date of the event.
           * @param {Boolean=} options.initialized  When true, assume that options are
           *        from a previously constructed iterator. Initialization will not be
           *        repeated.
           */
          fromData: function(options) {
            this.rule = ICAL2.helpers.formatClassType(options.rule, ICAL2.Recur);
            if (!this.rule) {
              throw new Error("iterator requires a (ICAL.Recur) rule");
            }
            this.dtstart = ICAL2.helpers.formatClassType(options.dtstart, ICAL2.Time);
            if (!this.dtstart) {
              throw new Error("iterator requires a (ICAL.Time) dtstart");
            }
            if (options.by_data) {
              this.by_data = options.by_data;
            } else {
              this.by_data = ICAL2.helpers.clone(this.rule.parts, true);
            }
            if (options.occurrence_number)
              this.occurrence_number = options.occurrence_number;
            this.days = options.days || [];
            if (options.last) {
              this.last = ICAL2.helpers.formatClassType(options.last, ICAL2.Time);
            }
            this.by_indices = options.by_indices;
            if (!this.by_indices) {
              this.by_indices = {
                "BYSECOND": 0,
                "BYMINUTE": 0,
                "BYHOUR": 0,
                "BYDAY": 0,
                "BYMONTH": 0,
                "BYWEEKNO": 0,
                "BYMONTHDAY": 0
              };
            }
            this.initialized = options.initialized || false;
            if (!this.initialized) {
              this.init();
            }
          },
          /**
           * Intialize the iterator
           * @private
           */
          init: function icalrecur_iterator_init() {
            this.initialized = true;
            this.last = this.dtstart.clone();
            var parts = this.by_data;
            if ("BYDAY" in parts) {
              this.sort_byday_rules(parts.BYDAY);
            }
            if ("BYYEARDAY" in parts) {
              if ("BYMONTH" in parts || "BYWEEKNO" in parts || "BYMONTHDAY" in parts || "BYDAY" in parts) {
                throw new Error("Invalid BYYEARDAY rule");
              }
            }
            if ("BYWEEKNO" in parts && "BYMONTHDAY" in parts) {
              throw new Error("BYWEEKNO does not fit to BYMONTHDAY");
            }
            if (this.rule.freq == "MONTHLY" && ("BYYEARDAY" in parts || "BYWEEKNO" in parts)) {
              throw new Error("For MONTHLY recurrences neither BYYEARDAY nor BYWEEKNO may appear");
            }
            if (this.rule.freq == "WEEKLY" && ("BYYEARDAY" in parts || "BYMONTHDAY" in parts)) {
              throw new Error("For WEEKLY recurrences neither BYMONTHDAY nor BYYEARDAY may appear");
            }
            if (this.rule.freq != "YEARLY" && "BYYEARDAY" in parts) {
              throw new Error("BYYEARDAY may only appear in YEARLY rules");
            }
            this.last.second = this.setup_defaults("BYSECOND", "SECONDLY", this.dtstart.second);
            this.last.minute = this.setup_defaults("BYMINUTE", "MINUTELY", this.dtstart.minute);
            this.last.hour = this.setup_defaults("BYHOUR", "HOURLY", this.dtstart.hour);
            this.last.day = this.setup_defaults("BYMONTHDAY", "DAILY", this.dtstart.day);
            this.last.month = this.setup_defaults("BYMONTH", "MONTHLY", this.dtstart.month);
            if (this.rule.freq == "WEEKLY") {
              if ("BYDAY" in parts) {
                var bydayParts = this.ruleDayOfWeek(parts.BYDAY[0], this.rule.wkst);
                var pos = bydayParts[0];
                var dow = bydayParts[1];
                var wkdy = dow - this.last.dayOfWeek(this.rule.wkst);
                if (this.last.dayOfWeek(this.rule.wkst) < dow && wkdy >= 0 || wkdy < 0) {
                  this.last.day += wkdy;
                }
              } else {
                var dayName = ICAL2.Recur.numericDayToIcalDay(this.dtstart.dayOfWeek());
                parts.BYDAY = [dayName];
              }
            }
            if (this.rule.freq == "YEARLY") {
              for (; ; ) {
                this.expand_year_days(this.last.year);
                if (this.days.length > 0) {
                  break;
                }
                this.increment_year(this.rule.interval);
              }
              this._nextByYearDay();
            }
            if (this.rule.freq == "MONTHLY" && this.has_by_data("BYDAY")) {
              var tempLast = null;
              var initLast = this.last.clone();
              var daysInMonth = ICAL2.Time.daysInMonth(this.last.month, this.last.year);
              for (var i3 in this.by_data.BYDAY) {
                if (!this.by_data.BYDAY.hasOwnProperty(i3)) {
                  continue;
                }
                this.last = initLast.clone();
                var bydayParts = this.ruleDayOfWeek(this.by_data.BYDAY[i3]);
                var pos = bydayParts[0];
                var dow = bydayParts[1];
                var dayOfMonth = this.last.nthWeekDay(dow, pos);
                if (pos >= 6 || pos <= -6) {
                  throw new Error("Malformed values in BYDAY part");
                }
                if (dayOfMonth > daysInMonth || dayOfMonth <= 0) {
                  if (tempLast && tempLast.month == initLast.month) {
                    continue;
                  }
                  while (dayOfMonth > daysInMonth || dayOfMonth <= 0) {
                    this.increment_month();
                    daysInMonth = ICAL2.Time.daysInMonth(this.last.month, this.last.year);
                    dayOfMonth = this.last.nthWeekDay(dow, pos);
                  }
                }
                this.last.day = dayOfMonth;
                if (!tempLast || this.last.compare(tempLast) < 0) {
                  tempLast = this.last.clone();
                }
              }
              this.last = tempLast.clone();
              if (this.has_by_data("BYMONTHDAY")) {
                this._byDayAndMonthDay(true);
              }
              if (this.last.day > daysInMonth || this.last.day == 0) {
                throw new Error("Malformed values in BYDAY part");
              }
            } else if (this.has_by_data("BYMONTHDAY")) {
              if (this.last.day < 0) {
                var daysInMonth = ICAL2.Time.daysInMonth(this.last.month, this.last.year);
                this.last.day = daysInMonth + this.last.day + 1;
              }
            }
          },
          /**
           * Retrieve the next occurrence from the iterator.
           * @return {ICAL.Time}
           */
          next: function icalrecur_iterator_next() {
            var before = this.last ? this.last.clone() : null;
            if (this.rule.count && this.occurrence_number >= this.rule.count || this.rule.until && this.last.compare(this.rule.until) > 0) {
              this.completed = true;
              return null;
            }
            if (this.occurrence_number == 0 && this.last.compare(this.dtstart) >= 0) {
              this.occurrence_number++;
              return this.last;
            }
            var valid;
            do {
              valid = 1;
              switch (this.rule.freq) {
                case "SECONDLY":
                  this.next_second();
                  break;
                case "MINUTELY":
                  this.next_minute();
                  break;
                case "HOURLY":
                  this.next_hour();
                  break;
                case "DAILY":
                  this.next_day();
                  break;
                case "WEEKLY":
                  this.next_week();
                  break;
                case "MONTHLY":
                  valid = this.next_month();
                  break;
                case "YEARLY":
                  this.next_year();
                  break;
                default:
                  return null;
              }
            } while (!this.check_contracting_rules() || this.last.compare(this.dtstart) < 0 || !valid);
            if (this.last.compare(before) == 0) {
              throw new Error("Same occurrence found twice, protecting you from death by recursion");
            }
            if (this.rule.until && this.last.compare(this.rule.until) > 0) {
              this.completed = true;
              return null;
            } else {
              this.occurrence_number++;
              return this.last;
            }
          },
          next_second: function next_second() {
            return this.next_generic("BYSECOND", "SECONDLY", "second", "minute");
          },
          increment_second: function increment_second(inc) {
            return this.increment_generic(inc, "second", 60, "minute");
          },
          next_minute: function next_minute() {
            return this.next_generic(
              "BYMINUTE",
              "MINUTELY",
              "minute",
              "hour",
              "next_second"
            );
          },
          increment_minute: function increment_minute(inc) {
            return this.increment_generic(inc, "minute", 60, "hour");
          },
          next_hour: function next_hour() {
            return this.next_generic(
              "BYHOUR",
              "HOURLY",
              "hour",
              "monthday",
              "next_minute"
            );
          },
          increment_hour: function increment_hour(inc) {
            this.increment_generic(inc, "hour", 24, "monthday");
          },
          next_day: function next_day() {
            var has_by_day = "BYDAY" in this.by_data;
            var this_freq = this.rule.freq == "DAILY";
            if (this.next_hour() == 0) {
              return 0;
            }
            if (this_freq) {
              this.increment_monthday(this.rule.interval);
            } else {
              this.increment_monthday(1);
            }
            return 0;
          },
          next_week: function next_week() {
            var end_of_data = 0;
            if (this.next_weekday_by_week() == 0) {
              return end_of_data;
            }
            if (this.has_by_data("BYWEEKNO")) {
              var idx = ++this.by_indices.BYWEEKNO;
              if (this.by_indices.BYWEEKNO == this.by_data.BYWEEKNO.length) {
                this.by_indices.BYWEEKNO = 0;
                end_of_data = 1;
              }
              this.last.month = 1;
              this.last.day = 1;
              var week_no = this.by_data.BYWEEKNO[this.by_indices.BYWEEKNO];
              this.last.day += 7 * week_no;
              if (end_of_data) {
                this.increment_year(1);
              }
            } else {
              this.increment_monthday(7 * this.rule.interval);
            }
            return end_of_data;
          },
          /**
           * Normalize each by day rule for a given year/month.
           * Takes into account ordering and negative rules
           *
           * @private
           * @param {Number} year         Current year.
           * @param {Number} month        Current month.
           * @param {Array}  rules        Array of rules.
           *
           * @return {Array} sorted and normalized rules.
           *                 Negative rules will be expanded to their
           *                 correct positive values for easier processing.
           */
          normalizeByMonthDayRules: function(year, month, rules) {
            var daysInMonth = ICAL2.Time.daysInMonth(month, year);
            var newRules = [];
            var ruleIdx = 0;
            var len = rules.length;
            var rule;
            for (; ruleIdx < len; ruleIdx++) {
              rule = rules[ruleIdx];
              if (Math.abs(rule) > daysInMonth) {
                continue;
              }
              if (rule < 0) {
                rule = daysInMonth + (rule + 1);
              } else if (rule === 0) {
                continue;
              }
              if (newRules.indexOf(rule) === -1) {
                newRules.push(rule);
              }
            }
            return newRules.sort(function(a3, b3) {
              return a3 - b3;
            });
          },
          /**
           * NOTES:
           * We are given a list of dates in the month (BYMONTHDAY) (23, etc..)
           * Also we are given a list of days (BYDAY) (MO, 2SU, etc..) when
           * both conditions match a given date (this.last.day) iteration stops.
           *
           * @private
           * @param {Boolean=} isInit     When given true will not increment the
           *                                current day (this.last).
           */
          _byDayAndMonthDay: function(isInit) {
            var byMonthDay;
            var byDay = this.by_data.BYDAY;
            var date;
            var dateIdx = 0;
            var dateLen;
            var dayLen = byDay.length;
            var dataIsValid = 0;
            var daysInMonth;
            var self = this;
            var lastDay = this.last.day;
            function initMonth() {
              daysInMonth = ICAL2.Time.daysInMonth(
                self.last.month,
                self.last.year
              );
              byMonthDay = self.normalizeByMonthDayRules(
                self.last.year,
                self.last.month,
                self.by_data.BYMONTHDAY
              );
              dateLen = byMonthDay.length;
              while (byMonthDay[dateIdx] <= lastDay && !(isInit && byMonthDay[dateIdx] == lastDay) && dateIdx < dateLen - 1) {
                dateIdx++;
              }
            }
            function nextMonth() {
              lastDay = 0;
              self.increment_month();
              dateIdx = 0;
              initMonth();
            }
            initMonth();
            if (isInit) {
              lastDay -= 1;
            }
            var monthsCounter = 48;
            while (!dataIsValid && monthsCounter) {
              monthsCounter--;
              date = lastDay + 1;
              if (date > daysInMonth) {
                nextMonth();
                continue;
              }
              var next = byMonthDay[dateIdx++];
              if (next >= date) {
                lastDay = next;
              } else {
                nextMonth();
                continue;
              }
              for (var dayIdx = 0; dayIdx < dayLen; dayIdx++) {
                var parts = this.ruleDayOfWeek(byDay[dayIdx]);
                var pos = parts[0];
                var dow = parts[1];
                this.last.day = lastDay;
                if (this.last.isNthWeekDay(dow, pos)) {
                  dataIsValid = 1;
                  break;
                }
              }
              if (!dataIsValid && dateIdx === dateLen) {
                nextMonth();
                continue;
              }
            }
            if (monthsCounter <= 0) {
              throw new Error("Malformed values in BYDAY combined with BYMONTHDAY parts");
            }
            return dataIsValid;
          },
          next_month: function next_month() {
            var this_freq = this.rule.freq == "MONTHLY";
            var data_valid = 1;
            if (this.next_hour() == 0) {
              return data_valid;
            }
            if (this.has_by_data("BYDAY") && this.has_by_data("BYMONTHDAY")) {
              data_valid = this._byDayAndMonthDay();
            } else if (this.has_by_data("BYDAY")) {
              var daysInMonth = ICAL2.Time.daysInMonth(this.last.month, this.last.year);
              var setpos = 0;
              var setpos_total = 0;
              if (this.has_by_data("BYSETPOS")) {
                var last_day = this.last.day;
                for (var day = 1; day <= daysInMonth; day++) {
                  this.last.day = day;
                  if (this.is_day_in_byday(this.last)) {
                    setpos_total++;
                    if (day <= last_day) {
                      setpos++;
                    }
                  }
                }
                this.last.day = last_day;
              }
              data_valid = 0;
              for (var day = this.last.day + 1; day <= daysInMonth; day++) {
                this.last.day = day;
                if (this.is_day_in_byday(this.last)) {
                  if (!this.has_by_data("BYSETPOS") || this.check_set_position(++setpos) || this.check_set_position(setpos - setpos_total - 1)) {
                    data_valid = 1;
                    break;
                  }
                }
              }
              if (day > daysInMonth) {
                this.last.day = 1;
                this.increment_month();
                if (this.is_day_in_byday(this.last)) {
                  if (!this.has_by_data("BYSETPOS") || this.check_set_position(1)) {
                    data_valid = 1;
                  }
                } else {
                  data_valid = 0;
                }
              }
            } else if (this.has_by_data("BYMONTHDAY")) {
              this.by_indices.BYMONTHDAY++;
              if (this.by_indices.BYMONTHDAY >= this.by_data.BYMONTHDAY.length) {
                this.by_indices.BYMONTHDAY = 0;
                this.increment_month();
              }
              var daysInMonth = ICAL2.Time.daysInMonth(this.last.month, this.last.year);
              var day = this.by_data.BYMONTHDAY[this.by_indices.BYMONTHDAY];
              if (day < 0) {
                day = daysInMonth + day + 1;
              }
              if (day > daysInMonth) {
                this.last.day = 1;
                data_valid = this.is_day_in_byday(this.last);
              } else {
                this.last.day = day;
              }
            } else {
              this.increment_month();
              var daysInMonth = ICAL2.Time.daysInMonth(this.last.month, this.last.year);
              if (this.by_data.BYMONTHDAY[0] > daysInMonth) {
                data_valid = 0;
              } else {
                this.last.day = this.by_data.BYMONTHDAY[0];
              }
            }
            return data_valid;
          },
          next_weekday_by_week: function next_weekday_by_week() {
            var end_of_data = 0;
            if (this.next_hour() == 0) {
              return end_of_data;
            }
            if (!this.has_by_data("BYDAY")) {
              return 1;
            }
            for (; ; ) {
              var tt = new ICAL2.Time();
              this.by_indices.BYDAY++;
              if (this.by_indices.BYDAY == Object.keys(this.by_data.BYDAY).length) {
                this.by_indices.BYDAY = 0;
                end_of_data = 1;
              }
              var coded_day = this.by_data.BYDAY[this.by_indices.BYDAY];
              var parts = this.ruleDayOfWeek(coded_day);
              var dow = parts[1];
              dow -= this.rule.wkst;
              if (dow < 0) {
                dow += 7;
              }
              tt.year = this.last.year;
              tt.month = this.last.month;
              tt.day = this.last.day;
              var startOfWeek = tt.startDoyWeek(this.rule.wkst);
              if (dow + startOfWeek < 1) {
                if (!end_of_data) {
                  continue;
                }
              }
              var next = ICAL2.Time.fromDayOfYear(
                startOfWeek + dow,
                this.last.year
              );
              this.last.year = next.year;
              this.last.month = next.month;
              this.last.day = next.day;
              return end_of_data;
            }
          },
          next_year: function next_year() {
            if (this.next_hour() == 0) {
              return 0;
            }
            if (++this.days_index == this.days.length) {
              this.days_index = 0;
              do {
                this.increment_year(this.rule.interval);
                this.expand_year_days(this.last.year);
              } while (this.days.length == 0);
            }
            this._nextByYearDay();
            return 1;
          },
          _nextByYearDay: function _nextByYearDay() {
            var doy = this.days[this.days_index];
            var year = this.last.year;
            if (doy < 1) {
              doy += 1;
              year += 1;
            }
            var next = ICAL2.Time.fromDayOfYear(doy, year);
            this.last.day = next.day;
            this.last.month = next.month;
          },
          /**
           * @param dow (eg: '1TU', '-1MO')
           * @param {ICAL.Time.weekDay=} aWeekStart The week start weekday
           * @return [pos, numericDow] (eg: [1, 3]) numericDow is relative to aWeekStart
           */
          ruleDayOfWeek: function ruleDayOfWeek(dow, aWeekStart) {
            var matches = dow.match(/([+-]?[0-9])?(MO|TU|WE|TH|FR|SA|SU)/);
            if (matches) {
              var pos = parseInt(matches[1] || 0, 10);
              dow = ICAL2.Recur.icalDayToNumericDay(matches[2], aWeekStart);
              return [pos, dow];
            } else {
              return [0, 0];
            }
          },
          next_generic: function next_generic(aRuleType, aInterval, aDateAttr, aFollowingAttr, aPreviousIncr) {
            var has_by_rule = aRuleType in this.by_data;
            var this_freq = this.rule.freq == aInterval;
            var end_of_data = 0;
            if (aPreviousIncr && this[aPreviousIncr]() == 0) {
              return end_of_data;
            }
            if (has_by_rule) {
              this.by_indices[aRuleType]++;
              var idx = this.by_indices[aRuleType];
              var dta = this.by_data[aRuleType];
              if (this.by_indices[aRuleType] == dta.length) {
                this.by_indices[aRuleType] = 0;
                end_of_data = 1;
              }
              this.last[aDateAttr] = dta[this.by_indices[aRuleType]];
            } else if (this_freq) {
              this["increment_" + aDateAttr](this.rule.interval);
            }
            if (has_by_rule && end_of_data && this_freq) {
              this["increment_" + aFollowingAttr](1);
            }
            return end_of_data;
          },
          increment_monthday: function increment_monthday(inc) {
            for (var i3 = 0; i3 < inc; i3++) {
              var daysInMonth = ICAL2.Time.daysInMonth(this.last.month, this.last.year);
              this.last.day++;
              if (this.last.day > daysInMonth) {
                this.last.day -= daysInMonth;
                this.increment_month();
              }
            }
          },
          increment_month: function increment_month() {
            this.last.day = 1;
            if (this.has_by_data("BYMONTH")) {
              this.by_indices.BYMONTH++;
              if (this.by_indices.BYMONTH == this.by_data.BYMONTH.length) {
                this.by_indices.BYMONTH = 0;
                this.increment_year(1);
              }
              this.last.month = this.by_data.BYMONTH[this.by_indices.BYMONTH];
            } else {
              if (this.rule.freq == "MONTHLY") {
                this.last.month += this.rule.interval;
              } else {
                this.last.month++;
              }
              this.last.month--;
              var years = ICAL2.helpers.trunc(this.last.month / 12);
              this.last.month %= 12;
              this.last.month++;
              if (years != 0) {
                this.increment_year(years);
              }
            }
          },
          increment_year: function increment_year(inc) {
            this.last.year += inc;
          },
          increment_generic: function increment_generic(inc, aDateAttr, aFactor, aNextIncrement) {
            this.last[aDateAttr] += inc;
            var nextunit = ICAL2.helpers.trunc(this.last[aDateAttr] / aFactor);
            this.last[aDateAttr] %= aFactor;
            if (nextunit != 0) {
              this["increment_" + aNextIncrement](nextunit);
            }
          },
          has_by_data: function has_by_data(aRuleType) {
            return aRuleType in this.rule.parts;
          },
          expand_year_days: function expand_year_days(aYear) {
            var t3 = new ICAL2.Time();
            this.days = [];
            var parts = {};
            var rules = ["BYDAY", "BYWEEKNO", "BYMONTHDAY", "BYMONTH", "BYYEARDAY"];
            for (var p3 in rules) {
              if (rules.hasOwnProperty(p3)) {
                var part = rules[p3];
                if (part in this.rule.parts) {
                  parts[part] = this.rule.parts[part];
                }
              }
            }
            if ("BYMONTH" in parts && "BYWEEKNO" in parts) {
              var valid = 1;
              var validWeeks = {};
              t3.year = aYear;
              t3.isDate = true;
              for (var monthIdx = 0; monthIdx < this.by_data.BYMONTH.length; monthIdx++) {
                var month = this.by_data.BYMONTH[monthIdx];
                t3.month = month;
                t3.day = 1;
                var first_week = t3.weekNumber(this.rule.wkst);
                t3.day = ICAL2.Time.daysInMonth(month, aYear);
                var last_week = t3.weekNumber(this.rule.wkst);
                for (monthIdx = first_week; monthIdx < last_week; monthIdx++) {
                  validWeeks[monthIdx] = 1;
                }
              }
              for (var weekIdx = 0; weekIdx < this.by_data.BYWEEKNO.length && valid; weekIdx++) {
                var weekno = this.by_data.BYWEEKNO[weekIdx];
                if (weekno < 52) {
                  valid &= validWeeks[weekIdx];
                } else {
                  valid = 0;
                }
              }
              if (valid) {
                delete parts.BYMONTH;
              } else {
                delete parts.BYWEEKNO;
              }
            }
            var partCount = Object.keys(parts).length;
            if (partCount == 0) {
              var t1 = this.dtstart.clone();
              t1.year = this.last.year;
              this.days.push(t1.dayOfYear());
            } else if (partCount == 1 && "BYMONTH" in parts) {
              for (var monthkey in this.by_data.BYMONTH) {
                if (!this.by_data.BYMONTH.hasOwnProperty(monthkey)) {
                  continue;
                }
                var t22 = this.dtstart.clone();
                t22.year = aYear;
                t22.month = this.by_data.BYMONTH[monthkey];
                t22.isDate = true;
                this.days.push(t22.dayOfYear());
              }
            } else if (partCount == 1 && "BYMONTHDAY" in parts) {
              for (var monthdaykey in this.by_data.BYMONTHDAY) {
                if (!this.by_data.BYMONTHDAY.hasOwnProperty(monthdaykey)) {
                  continue;
                }
                var t32 = this.dtstart.clone();
                var day_ = this.by_data.BYMONTHDAY[monthdaykey];
                if (day_ < 0) {
                  var daysInMonth = ICAL2.Time.daysInMonth(t32.month, aYear);
                  day_ = day_ + daysInMonth + 1;
                }
                t32.day = day_;
                t32.year = aYear;
                t32.isDate = true;
                this.days.push(t32.dayOfYear());
              }
            } else if (partCount == 2 && "BYMONTHDAY" in parts && "BYMONTH" in parts) {
              for (var monthkey in this.by_data.BYMONTH) {
                if (!this.by_data.BYMONTH.hasOwnProperty(monthkey)) {
                  continue;
                }
                var month_ = this.by_data.BYMONTH[monthkey];
                var daysInMonth = ICAL2.Time.daysInMonth(month_, aYear);
                for (var monthdaykey in this.by_data.BYMONTHDAY) {
                  if (!this.by_data.BYMONTHDAY.hasOwnProperty(monthdaykey)) {
                    continue;
                  }
                  var day_ = this.by_data.BYMONTHDAY[monthdaykey];
                  if (day_ < 0) {
                    day_ = day_ + daysInMonth + 1;
                  }
                  t3.day = day_;
                  t3.month = month_;
                  t3.year = aYear;
                  t3.isDate = true;
                  this.days.push(t3.dayOfYear());
                }
              }
            } else if (partCount == 1 && "BYWEEKNO" in parts) {
            } else if (partCount == 2 && "BYWEEKNO" in parts && "BYMONTHDAY" in parts) {
            } else if (partCount == 1 && "BYDAY" in parts) {
              this.days = this.days.concat(this.expand_by_day(aYear));
            } else if (partCount == 2 && "BYDAY" in parts && "BYMONTH" in parts) {
              for (var monthkey in this.by_data.BYMONTH) {
                if (!this.by_data.BYMONTH.hasOwnProperty(monthkey)) {
                  continue;
                }
                var month = this.by_data.BYMONTH[monthkey];
                var daysInMonth = ICAL2.Time.daysInMonth(month, aYear);
                t3.year = aYear;
                t3.month = this.by_data.BYMONTH[monthkey];
                t3.day = 1;
                t3.isDate = true;
                var first_dow = t3.dayOfWeek();
                var doy_offset = t3.dayOfYear() - 1;
                t3.day = daysInMonth;
                var last_dow = t3.dayOfWeek();
                if (this.has_by_data("BYSETPOS")) {
                  var set_pos_counter = 0;
                  var by_month_day = [];
                  for (var day = 1; day <= daysInMonth; day++) {
                    t3.day = day;
                    if (this.is_day_in_byday(t3)) {
                      by_month_day.push(day);
                    }
                  }
                  for (var spIndex = 0; spIndex < by_month_day.length; spIndex++) {
                    if (this.check_set_position(spIndex + 1) || this.check_set_position(spIndex - by_month_day.length)) {
                      this.days.push(doy_offset + by_month_day[spIndex]);
                    }
                  }
                } else {
                  for (var daycodedkey in this.by_data.BYDAY) {
                    if (!this.by_data.BYDAY.hasOwnProperty(daycodedkey)) {
                      continue;
                    }
                    var coded_day = this.by_data.BYDAY[daycodedkey];
                    var bydayParts = this.ruleDayOfWeek(coded_day);
                    var pos = bydayParts[0];
                    var dow = bydayParts[1];
                    var month_day;
                    var first_matching_day = (dow + 7 - first_dow) % 7 + 1;
                    var last_matching_day = daysInMonth - (last_dow + 7 - dow) % 7;
                    if (pos == 0) {
                      for (var day = first_matching_day; day <= daysInMonth; day += 7) {
                        this.days.push(doy_offset + day);
                      }
                    } else if (pos > 0) {
                      month_day = first_matching_day + (pos - 1) * 7;
                      if (month_day <= daysInMonth) {
                        this.days.push(doy_offset + month_day);
                      }
                    } else {
                      month_day = last_matching_day + (pos + 1) * 7;
                      if (month_day > 0) {
                        this.days.push(doy_offset + month_day);
                      }
                    }
                  }
                }
              }
              this.days.sort(function(a3, b3) {
                return a3 - b3;
              });
            } else if (partCount == 2 && "BYDAY" in parts && "BYMONTHDAY" in parts) {
              var expandedDays = this.expand_by_day(aYear);
              for (var daykey in expandedDays) {
                if (!expandedDays.hasOwnProperty(daykey)) {
                  continue;
                }
                var day = expandedDays[daykey];
                var tt = ICAL2.Time.fromDayOfYear(day, aYear);
                if (this.by_data.BYMONTHDAY.indexOf(tt.day) >= 0) {
                  this.days.push(day);
                }
              }
            } else if (partCount == 3 && "BYDAY" in parts && "BYMONTHDAY" in parts && "BYMONTH" in parts) {
              var expandedDays = this.expand_by_day(aYear);
              for (var daykey in expandedDays) {
                if (!expandedDays.hasOwnProperty(daykey)) {
                  continue;
                }
                var day = expandedDays[daykey];
                var tt = ICAL2.Time.fromDayOfYear(day, aYear);
                if (this.by_data.BYMONTH.indexOf(tt.month) >= 0 && this.by_data.BYMONTHDAY.indexOf(tt.day) >= 0) {
                  this.days.push(day);
                }
              }
            } else if (partCount == 2 && "BYDAY" in parts && "BYWEEKNO" in parts) {
              var expandedDays = this.expand_by_day(aYear);
              for (var daykey in expandedDays) {
                if (!expandedDays.hasOwnProperty(daykey)) {
                  continue;
                }
                var day = expandedDays[daykey];
                var tt = ICAL2.Time.fromDayOfYear(day, aYear);
                var weekno = tt.weekNumber(this.rule.wkst);
                if (this.by_data.BYWEEKNO.indexOf(weekno)) {
                  this.days.push(day);
                }
              }
            } else if (partCount == 3 && "BYDAY" in parts && "BYWEEKNO" in parts && "BYMONTHDAY" in parts) {
            } else if (partCount == 1 && "BYYEARDAY" in parts) {
              this.days = this.days.concat(this.by_data.BYYEARDAY);
            } else {
              this.days = [];
            }
            return 0;
          },
          expand_by_day: function expand_by_day(aYear) {
            var days_list = [];
            var tmp = this.last.clone();
            tmp.year = aYear;
            tmp.month = 1;
            tmp.day = 1;
            tmp.isDate = true;
            var start_dow = tmp.dayOfWeek();
            tmp.month = 12;
            tmp.day = 31;
            tmp.isDate = true;
            var end_dow = tmp.dayOfWeek();
            var end_year_day = tmp.dayOfYear();
            for (var daykey in this.by_data.BYDAY) {
              if (!this.by_data.BYDAY.hasOwnProperty(daykey)) {
                continue;
              }
              var day = this.by_data.BYDAY[daykey];
              var parts = this.ruleDayOfWeek(day);
              var pos = parts[0];
              var dow = parts[1];
              if (pos == 0) {
                var tmp_start_doy = (dow + 7 - start_dow) % 7 + 1;
                for (var doy = tmp_start_doy; doy <= end_year_day; doy += 7) {
                  days_list.push(doy);
                }
              } else if (pos > 0) {
                var first;
                if (dow >= start_dow) {
                  first = dow - start_dow + 1;
                } else {
                  first = dow - start_dow + 8;
                }
                days_list.push(first + (pos - 1) * 7);
              } else {
                var last;
                pos = -pos;
                if (dow <= end_dow) {
                  last = end_year_day - end_dow + dow;
                } else {
                  last = end_year_day - end_dow + dow - 7;
                }
                days_list.push(last - (pos - 1) * 7);
              }
            }
            return days_list;
          },
          is_day_in_byday: function is_day_in_byday(tt) {
            for (var daykey in this.by_data.BYDAY) {
              if (!this.by_data.BYDAY.hasOwnProperty(daykey)) {
                continue;
              }
              var day = this.by_data.BYDAY[daykey];
              var parts = this.ruleDayOfWeek(day);
              var pos = parts[0];
              var dow = parts[1];
              var this_dow = tt.dayOfWeek();
              if (pos == 0 && dow == this_dow || tt.nthWeekDay(dow, pos) == tt.day) {
                return 1;
              }
            }
            return 0;
          },
          /**
           * Checks if given value is in BYSETPOS.
           *
           * @private
           * @param {Numeric} aPos position to check for.
           * @return {Boolean} false unless BYSETPOS rules exist
           *                   and the given value is present in rules.
           */
          check_set_position: function check_set_position(aPos) {
            if (this.has_by_data("BYSETPOS")) {
              var idx = this.by_data.BYSETPOS.indexOf(aPos);
              return idx !== -1;
            }
            return false;
          },
          sort_byday_rules: function icalrecur_sort_byday_rules(aRules) {
            for (var i3 = 0; i3 < aRules.length; i3++) {
              for (var j4 = 0; j4 < i3; j4++) {
                var one = this.ruleDayOfWeek(aRules[j4], this.rule.wkst)[1];
                var two = this.ruleDayOfWeek(aRules[i3], this.rule.wkst)[1];
                if (one > two) {
                  var tmp = aRules[i3];
                  aRules[i3] = aRules[j4];
                  aRules[j4] = tmp;
                }
              }
            }
          },
          check_contract_restriction: function check_contract_restriction(aRuleType, v3) {
            var indexMapValue = icalrecur_iterator._indexMap[aRuleType];
            var ruleMapValue = icalrecur_iterator._expandMap[this.rule.freq][indexMapValue];
            var pass = false;
            if (aRuleType in this.by_data && ruleMapValue == icalrecur_iterator.CONTRACT) {
              var ruleType = this.by_data[aRuleType];
              for (var bydatakey in ruleType) {
                if (ruleType.hasOwnProperty(bydatakey)) {
                  if (ruleType[bydatakey] == v3) {
                    pass = true;
                    break;
                  }
                }
              }
            } else {
              pass = true;
            }
            return pass;
          },
          check_contracting_rules: function check_contracting_rules() {
            var dow = this.last.dayOfWeek();
            var weekNo = this.last.weekNumber(this.rule.wkst);
            var doy = this.last.dayOfYear();
            return this.check_contract_restriction("BYSECOND", this.last.second) && this.check_contract_restriction("BYMINUTE", this.last.minute) && this.check_contract_restriction("BYHOUR", this.last.hour) && this.check_contract_restriction("BYDAY", ICAL2.Recur.numericDayToIcalDay(dow)) && this.check_contract_restriction("BYWEEKNO", weekNo) && this.check_contract_restriction("BYMONTHDAY", this.last.day) && this.check_contract_restriction("BYMONTH", this.last.month) && this.check_contract_restriction("BYYEARDAY", doy);
          },
          setup_defaults: function setup_defaults(aRuleType, req, deftime) {
            var indexMapValue = icalrecur_iterator._indexMap[aRuleType];
            var ruleMapValue = icalrecur_iterator._expandMap[this.rule.freq][indexMapValue];
            if (ruleMapValue != icalrecur_iterator.CONTRACT) {
              if (!(aRuleType in this.by_data)) {
                this.by_data[aRuleType] = [deftime];
              }
              if (this.rule.freq != req) {
                return this.by_data[aRuleType][0];
              }
            }
            return deftime;
          },
          /**
           * Convert iterator into a serialize-able object.  Will preserve current
           * iteration sequence to ensure the seamless continuation of the recurrence
           * rule.
           * @return {Object}
           */
          toJSON: function() {
            var result = /* @__PURE__ */ Object.create(null);
            result.initialized = this.initialized;
            result.rule = this.rule.toJSON();
            result.dtstart = this.dtstart.toJSON();
            result.by_data = this.by_data;
            result.days = this.days;
            result.last = this.last.toJSON();
            result.by_indices = this.by_indices;
            result.occurrence_number = this.occurrence_number;
            return result;
          }
        };
        icalrecur_iterator._indexMap = {
          "BYSECOND": 0,
          "BYMINUTE": 1,
          "BYHOUR": 2,
          "BYDAY": 3,
          "BYMONTHDAY": 4,
          "BYYEARDAY": 5,
          "BYWEEKNO": 6,
          "BYMONTH": 7,
          "BYSETPOS": 8
        };
        icalrecur_iterator._expandMap = {
          "SECONDLY": [1, 1, 1, 1, 1, 1, 1, 1],
          "MINUTELY": [2, 1, 1, 1, 1, 1, 1, 1],
          "HOURLY": [2, 2, 1, 1, 1, 1, 1, 1],
          "DAILY": [2, 2, 2, 1, 1, 1, 1, 1],
          "WEEKLY": [2, 2, 2, 2, 3, 3, 1, 1],
          "MONTHLY": [2, 2, 2, 2, 2, 3, 3, 1],
          "YEARLY": [2, 2, 2, 2, 2, 2, 2, 2]
        };
        icalrecur_iterator.UNKNOWN = 0;
        icalrecur_iterator.CONTRACT = 1;
        icalrecur_iterator.EXPAND = 2;
        icalrecur_iterator.ILLEGAL = 3;
        return icalrecur_iterator;
      })();
      ICAL2.RecurExpansion = (function() {
        function formatTime(item) {
          return ICAL2.helpers.formatClassType(item, ICAL2.Time);
        }
        function compareTime(a3, b3) {
          return a3.compare(b3);
        }
        function isRecurringComponent(comp) {
          return comp.hasProperty("rdate") || comp.hasProperty("rrule") || comp.hasProperty("recurrence-id");
        }
        function RecurExpansion(options) {
          this.ruleDates = [];
          this.exDates = [];
          this.fromData(options);
        }
        RecurExpansion.prototype = {
          /**
           * True when iteration is fully completed.
           * @type {Boolean}
           */
          complete: false,
          /**
           * Array of rrule iterators.
           *
           * @type {ICAL.RecurIterator[]}
           * @private
           */
          ruleIterators: null,
          /**
           * Array of rdate instances.
           *
           * @type {ICAL.Time[]}
           * @private
           */
          ruleDates: null,
          /**
           * Array of exdate instances.
           *
           * @type {ICAL.Time[]}
           * @private
           */
          exDates: null,
          /**
           * Current position in ruleDates array.
           * @type {Number}
           * @private
           */
          ruleDateInc: 0,
          /**
           * Current position in exDates array
           * @type {Number}
           * @private
           */
          exDateInc: 0,
          /**
           * Current negative date.
           *
           * @type {ICAL.Time}
           * @private
           */
          exDate: null,
          /**
           * Current additional date.
           *
           * @type {ICAL.Time}
           * @private
           */
          ruleDate: null,
          /**
           * Start date of recurring rules.
           *
           * @type {ICAL.Time}
           */
          dtstart: null,
          /**
           * Last expanded time
           *
           * @type {ICAL.Time}
           */
          last: null,
          /**
           * Initialize the recurrence expansion from the data object. The options
           * object may also contain additional members, see the
           * {@link ICAL.RecurExpansion constructor} for more details.
           *
           * @param {Object} options
           *        Recurrence expansion options
           * @param {ICAL.Time} options.dtstart
           *        Start time of the event
           * @param {ICAL.Component=} options.component
           *        Component for expansion, required if not resuming.
           */
          fromData: function(options) {
            var start = ICAL2.helpers.formatClassType(options.dtstart, ICAL2.Time);
            if (!start) {
              throw new Error(".dtstart (ICAL.Time) must be given");
            } else {
              this.dtstart = start;
            }
            if (options.component) {
              this._init(options.component);
            } else {
              this.last = formatTime(options.last) || start.clone();
              if (!options.ruleIterators) {
                throw new Error(".ruleIterators or .component must be given");
              }
              this.ruleIterators = options.ruleIterators.map(function(item) {
                return ICAL2.helpers.formatClassType(item, ICAL2.RecurIterator);
              });
              this.ruleDateInc = options.ruleDateInc;
              this.exDateInc = options.exDateInc;
              if (options.ruleDates) {
                this.ruleDates = options.ruleDates.map(formatTime);
                this.ruleDate = this.ruleDates[this.ruleDateInc];
              }
              if (options.exDates) {
                this.exDates = options.exDates.map(formatTime);
                this.exDate = this.exDates[this.exDateInc];
              }
              if (typeof options.complete !== "undefined") {
                this.complete = options.complete;
              }
            }
          },
          /**
           * Retrieve the next occurrence in the series.
           * @return {ICAL.Time}
           */
          next: function() {
            var iter2;
            var ruleOfDay;
            var next;
            var compare;
            var maxTries = 500;
            var currentTry = 0;
            while (true) {
              if (currentTry++ > maxTries) {
                throw new Error(
                  "max tries have occured, rule may be impossible to forfill."
                );
              }
              next = this.ruleDate;
              iter2 = this._nextRecurrenceIter(this.last);
              if (!next && !iter2) {
                this.complete = true;
                break;
              }
              if (!next || iter2 && next.compare(iter2.last) > 0) {
                next = iter2.last.clone();
                iter2.next();
              }
              if (this.ruleDate === next) {
                this._nextRuleDay();
              }
              this.last = next;
              if (this.exDate) {
                compare = this.exDate.compare(this.last);
                if (compare < 0) {
                  this._nextExDay();
                }
                if (compare === 0) {
                  this._nextExDay();
                  continue;
                }
              }
              return this.last;
            }
          },
          /**
           * Converts object into a serialize-able format. This format can be passed
           * back into the expansion to resume iteration.
           * @return {Object}
           */
          toJSON: function() {
            function toJSON(item) {
              return item.toJSON();
            }
            var result = /* @__PURE__ */ Object.create(null);
            result.ruleIterators = this.ruleIterators.map(toJSON);
            if (this.ruleDates) {
              result.ruleDates = this.ruleDates.map(toJSON);
            }
            if (this.exDates) {
              result.exDates = this.exDates.map(toJSON);
            }
            result.ruleDateInc = this.ruleDateInc;
            result.exDateInc = this.exDateInc;
            result.last = this.last.toJSON();
            result.dtstart = this.dtstart.toJSON();
            result.complete = this.complete;
            return result;
          },
          /**
           * Extract all dates from the properties in the given component. The
           * properties will be filtered by the property name.
           *
           * @private
           * @param {ICAL.Component} component        The component to search in
           * @param {String} propertyName             The property name to search for
           * @return {ICAL.Time[]}                    The extracted dates.
           */
          _extractDates: function(component, propertyName) {
            function handleProp(prop2) {
              idx = ICAL2.helpers.binsearchInsert(
                result,
                prop2,
                compareTime
              );
              result.splice(idx, 0, prop2);
            }
            var result = [];
            var props = component.getAllProperties(propertyName);
            var len = props.length;
            var i3 = 0;
            var prop;
            var idx;
            for (; i3 < len; i3++) {
              props[i3].getValues().forEach(handleProp);
            }
            return result;
          },
          /**
           * Initialize the recurrence expansion.
           *
           * @private
           * @param {ICAL.Component} component    The component to initialize from.
           */
          _init: function(component) {
            this.ruleIterators = [];
            this.last = this.dtstart.clone();
            if (!isRecurringComponent(component)) {
              this.ruleDate = this.last.clone();
              this.complete = true;
              return;
            }
            if (component.hasProperty("rdate")) {
              this.ruleDates = this._extractDates(component, "rdate");
              if (this.ruleDates[0] && this.ruleDates[0].compare(this.dtstart) < 0) {
                this.ruleDateInc = 0;
                this.last = this.ruleDates[0].clone();
              } else {
                this.ruleDateInc = ICAL2.helpers.binsearchInsert(
                  this.ruleDates,
                  this.last,
                  compareTime
                );
              }
              this.ruleDate = this.ruleDates[this.ruleDateInc];
            }
            if (component.hasProperty("rrule")) {
              var rules = component.getAllProperties("rrule");
              var i3 = 0;
              var len = rules.length;
              var rule;
              var iter2;
              for (; i3 < len; i3++) {
                rule = rules[i3].getFirstValue();
                iter2 = rule.iterator(this.dtstart);
                this.ruleIterators.push(iter2);
                iter2.next();
              }
            }
            if (component.hasProperty("exdate")) {
              this.exDates = this._extractDates(component, "exdate");
              this.exDateInc = ICAL2.helpers.binsearchInsert(
                this.exDates,
                this.last,
                compareTime
              );
              this.exDate = this.exDates[this.exDateInc];
            }
          },
          /**
           * Advance to the next exdate
           * @private
           */
          _nextExDay: function() {
            this.exDate = this.exDates[++this.exDateInc];
          },
          /**
           * Advance to the next rule date
           * @private
           */
          _nextRuleDay: function() {
            this.ruleDate = this.ruleDates[++this.ruleDateInc];
          },
          /**
           * Find and return the recurrence rule with the most recent event and
           * return it.
           *
           * @private
           * @return {?ICAL.RecurIterator}    Found iterator.
           */
          _nextRecurrenceIter: function() {
            var iters = this.ruleIterators;
            if (iters.length === 0) {
              return null;
            }
            var len = iters.length;
            var iter2;
            var iterTime;
            var iterIdx = 0;
            var chosenIter;
            for (; iterIdx < len; iterIdx++) {
              iter2 = iters[iterIdx];
              iterTime = iter2.last;
              if (iter2.completed) {
                len--;
                if (iterIdx !== 0) {
                  iterIdx--;
                }
                iters.splice(iterIdx, 1);
                continue;
              }
              if (!chosenIter || chosenIter.last.compare(iterTime) > 0) {
                chosenIter = iter2;
              }
            }
            return chosenIter;
          }
        };
        return RecurExpansion;
      })();
      ICAL2.Event = (function() {
        function Event2(component, options) {
          if (!(component instanceof ICAL2.Component)) {
            options = component;
            component = null;
          }
          if (component) {
            this.component = component;
          } else {
            this.component = new ICAL2.Component("vevent");
          }
          this._rangeExceptionCache = /* @__PURE__ */ Object.create(null);
          this.exceptions = /* @__PURE__ */ Object.create(null);
          this.rangeExceptions = [];
          if (options && options.strictExceptions) {
            this.strictExceptions = options.strictExceptions;
          }
          if (options && options.exceptions) {
            options.exceptions.forEach(this.relateException, this);
          } else if (this.component.parent && !this.isRecurrenceException()) {
            this.component.parent.getAllSubcomponents("vevent").forEach(function(event) {
              if (event.hasProperty("recurrence-id")) {
                this.relateException(event);
              }
            }, this);
          }
        }
        Event2.prototype = {
          THISANDFUTURE: "THISANDFUTURE",
          /**
           * List of related event exceptions.
           *
           * @type {ICAL.Event[]}
           */
          exceptions: null,
          /**
           * When true, will verify exceptions are related by their UUID.
           *
           * @type {Boolean}
           */
          strictExceptions: false,
          /**
           * Relates a given event exception to this object.  If the given component
           * does not share the UID of this event it cannot be related and will throw
           * an exception.
           *
           * If this component is an exception it cannot have other exceptions
           * related to it.
           *
           * @param {ICAL.Component|ICAL.Event} obj       Component or event
           */
          relateException: function(obj) {
            if (this.isRecurrenceException()) {
              throw new Error("cannot relate exception to exceptions");
            }
            if (obj instanceof ICAL2.Component) {
              obj = new ICAL2.Event(obj);
            }
            if (this.strictExceptions && obj.uid !== this.uid) {
              throw new Error("attempted to relate unrelated exception");
            }
            var id = obj.recurrenceId.toString();
            this.exceptions[id] = obj;
            if (obj.modifiesFuture()) {
              var item = [
                obj.recurrenceId.toUnixTime(),
                id
              ];
              var idx = ICAL2.helpers.binsearchInsert(
                this.rangeExceptions,
                item,
                compareRangeException
              );
              this.rangeExceptions.splice(idx, 0, item);
            }
          },
          /**
           * Checks if this record is an exception and has the RANGE=THISANDFUTURE
           * value.
           *
           * @return {Boolean}        True, when exception is within range
           */
          modifiesFuture: function() {
            if (!this.component.hasProperty("recurrence-id")) {
              return false;
            }
            var range2 = this.component.getFirstProperty("recurrence-id").getParameter("range");
            return range2 === this.THISANDFUTURE;
          },
          /**
           * Finds the range exception nearest to the given date.
           *
           * @param {ICAL.Time} time usually an occurrence time of an event
           * @return {?ICAL.Event} the related event/exception or null
           */
          findRangeException: function(time) {
            if (!this.rangeExceptions.length) {
              return null;
            }
            var utc = time.toUnixTime();
            var idx = ICAL2.helpers.binsearchInsert(
              this.rangeExceptions,
              [utc],
              compareRangeException
            );
            idx -= 1;
            if (idx < 0) {
              return null;
            }
            var rangeItem = this.rangeExceptions[idx];
            if (utc < rangeItem[0]) {
              return null;
            }
            return rangeItem[1];
          },
          /**
           * This object is returned by {@link ICAL.Event#getOccurrenceDetails getOccurrenceDetails}
           *
           * @typedef {Object} occurrenceDetails
           * @memberof ICAL.Event
           * @property {ICAL.Time} recurrenceId       The passed in recurrence id
           * @property {ICAL.Event} item              The occurrence
           * @property {ICAL.Time} startDate          The start of the occurrence
           * @property {ICAL.Time} endDate            The end of the occurrence
           */
          /**
           * Returns the occurrence details based on its start time.  If the
           * occurrence has an exception will return the details for that exception.
           *
           * NOTE: this method is intend to be used in conjunction
           *       with the {@link ICAL.Event#iterator iterator} method.
           *
           * @param {ICAL.Time} occurrence time occurrence
           * @return {ICAL.Event.occurrenceDetails} Information about the occurrence
           */
          getOccurrenceDetails: function(occurrence) {
            var id = occurrence.toString();
            var utcId = occurrence.convertToZone(ICAL2.Timezone.utcTimezone).toString();
            var item;
            var result = {
              //XXX: Clone?
              recurrenceId: occurrence
            };
            if (id in this.exceptions) {
              item = result.item = this.exceptions[id];
              result.startDate = item.startDate;
              result.endDate = item.endDate;
              result.item = item;
            } else if (utcId in this.exceptions) {
              item = this.exceptions[utcId];
              result.startDate = item.startDate;
              result.endDate = item.endDate;
              result.item = item;
            } else {
              var rangeExceptionId = this.findRangeException(
                occurrence
              );
              var end;
              if (rangeExceptionId) {
                var exception = this.exceptions[rangeExceptionId];
                result.item = exception;
                var startDiff = this._rangeExceptionCache[rangeExceptionId];
                if (!startDiff) {
                  var original = exception.recurrenceId.clone();
                  var newStart = exception.startDate.clone();
                  original.zone = newStart.zone;
                  startDiff = newStart.subtractDate(original);
                  this._rangeExceptionCache[rangeExceptionId] = startDiff;
                }
                var start = occurrence.clone();
                start.zone = exception.startDate.zone;
                start.addDuration(startDiff);
                end = start.clone();
                end.addDuration(exception.duration);
                result.startDate = start;
                result.endDate = end;
              } else {
                end = occurrence.clone();
                end.addDuration(this.duration);
                result.endDate = end;
                result.startDate = occurrence;
                result.item = this;
              }
            }
            return result;
          },
          /**
           * Builds a recur expansion instance for a specific point in time (defaults
           * to startDate).
           *
           * @param {ICAL.Time} startTime     Starting point for expansion
           * @return {ICAL.RecurExpansion}    Expansion object
           */
          iterator: function(startTime) {
            return new ICAL2.RecurExpansion({
              component: this.component,
              dtstart: startTime || this.startDate
            });
          },
          /**
           * Checks if the event is recurring
           *
           * @return {Boolean}        True, if event is recurring
           */
          isRecurring: function() {
            var comp = this.component;
            return comp.hasProperty("rrule") || comp.hasProperty("rdate");
          },
          /**
           * Checks if the event describes a recurrence exception. See
           * {@tutorial terminology} for details.
           *
           * @return {Boolean}    True, if the event describes a recurrence exception
           */
          isRecurrenceException: function() {
            return this.component.hasProperty("recurrence-id");
          },
          /**
           * Returns the types of recurrences this event may have.
           *
           * Returned as an object with the following possible keys:
           *
           *    - YEARLY
           *    - MONTHLY
           *    - WEEKLY
           *    - DAILY
           *    - MINUTELY
           *    - SECONDLY
           *
           * @return {Object.<ICAL.Recur.frequencyValues, Boolean>}
           *          Object of recurrence flags
           */
          getRecurrenceTypes: function() {
            var rules = this.component.getAllProperties("rrule");
            var i3 = 0;
            var len = rules.length;
            var result = /* @__PURE__ */ Object.create(null);
            for (; i3 < len; i3++) {
              var value = rules[i3].getFirstValue();
              result[value.freq] = true;
            }
            return result;
          },
          /**
           * The uid of this event
           * @type {String}
           */
          get uid() {
            return this._firstProp("uid");
          },
          set uid(value) {
            this._setProp("uid", value);
          },
          /**
           * The start date
           * @type {ICAL.Time}
           */
          get startDate() {
            return this._firstProp("dtstart");
          },
          set startDate(value) {
            this._setTime("dtstart", value);
          },
          /**
           * The end date. This can be the result directly from the property, or the
           * end date calculated from start date and duration. Setting the property
           * will remove any duration properties.
           * @type {ICAL.Time}
           */
          get endDate() {
            var endDate = this._firstProp("dtend");
            if (!endDate) {
              var duration = this._firstProp("duration");
              endDate = this.startDate.clone();
              if (duration) {
                endDate.addDuration(duration);
              } else if (endDate.isDate) {
                endDate.day += 1;
              }
            }
            return endDate;
          },
          set endDate(value) {
            if (this.component.hasProperty("duration")) {
              this.component.removeProperty("duration");
            }
            this._setTime("dtend", value);
          },
          /**
           * The duration. This can be the result directly from the property, or the
           * duration calculated from start date and end date. Setting the property
           * will remove any `dtend` properties.
           * @type {ICAL.Duration}
           */
          get duration() {
            var duration = this._firstProp("duration");
            if (!duration) {
              return this.endDate.subtractDateTz(this.startDate);
            }
            return duration;
          },
          set duration(value) {
            if (this.component.hasProperty("dtend")) {
              this.component.removeProperty("dtend");
            }
            this._setProp("duration", value);
          },
          /**
           * The location of the event.
           * @type {String}
           */
          get location() {
            return this._firstProp("location");
          },
          set location(value) {
            return this._setProp("location", value);
          },
          /**
           * The attendees in the event
           * @type {ICAL.Property[]}
           * @readonly
           */
          get attendees() {
            return this.component.getAllProperties("attendee");
          },
          /**
           * The event summary
           * @type {String}
           */
          get summary() {
            return this._firstProp("summary");
          },
          set summary(value) {
            this._setProp("summary", value);
          },
          /**
           * The event description.
           * @type {String}
           */
          get description() {
            return this._firstProp("description");
          },
          set description(value) {
            this._setProp("description", value);
          },
          /**
           * The event color from [rfc7986](https://datatracker.ietf.org/doc/html/rfc7986)
           * @type {String}
           */
          get color() {
            return this._firstProp("color");
          },
          set color(value) {
            this._setProp("color", value);
          },
          /**
           * The organizer value as an uri. In most cases this is a mailto: uri, but
           * it can also be something else, like urn:uuid:...
           * @type {String}
           */
          get organizer() {
            return this._firstProp("organizer");
          },
          set organizer(value) {
            this._setProp("organizer", value);
          },
          /**
           * The sequence value for this event. Used for scheduling
           * see {@tutorial terminology}.
           * @type {Number}
           */
          get sequence() {
            return this._firstProp("sequence");
          },
          set sequence(value) {
            this._setProp("sequence", value);
          },
          /**
           * The recurrence id for this event. See {@tutorial terminology} for details.
           * @type {ICAL.Time}
           */
          get recurrenceId() {
            return this._firstProp("recurrence-id");
          },
          set recurrenceId(value) {
            this._setTime("recurrence-id", value);
          },
          /**
           * Set/update a time property's value.
           * This will also update the TZID of the property.
           *
           * TODO: this method handles the case where we are switching
           * from a known timezone to an implied timezone (one without TZID).
           * This does _not_ handle the case of moving between a known
           *  (by TimezoneService) timezone to an unknown timezone...
           *
           * We will not add/remove/update the VTIMEZONE subcomponents
           *  leading to invalid ICAL data...
           * @private
           * @param {String} propName     The property name
           * @param {ICAL.Time} time      The time to set
           */
          _setTime: function(propName, time) {
            var prop = this.component.getFirstProperty(propName);
            if (!prop) {
              prop = new ICAL2.Property(propName);
              this.component.addProperty(prop);
            }
            if (time.zone === ICAL2.Timezone.localTimezone || time.zone === ICAL2.Timezone.utcTimezone) {
              prop.removeParameter("tzid");
            } else {
              prop.setParameter("tzid", time.zone.tzid);
            }
            prop.setValue(time);
          },
          _setProp: function(name, value) {
            this.component.updatePropertyWithValue(name, value);
          },
          _firstProp: function(name) {
            return this.component.getFirstPropertyValue(name);
          },
          /**
           * The string representation of this event.
           * @return {String}
           */
          toString: function() {
            return this.component.toString();
          }
        };
        function compareRangeException(a3, b3) {
          if (a3[0] > b3[0]) return 1;
          if (b3[0] > a3[0]) return -1;
          return 0;
        }
        return Event2;
      })();
      ICAL2.ComponentParser = (function() {
        function ComponentParser(options) {
          if (typeof options === "undefined") {
            options = {};
          }
          var key;
          for (key in options) {
            if (options.hasOwnProperty(key)) {
              this[key] = options[key];
            }
          }
        }
        ComponentParser.prototype = {
          /**
           * When true, parse events
           *
           * @type {Boolean}
           */
          parseEvent: true,
          /**
           * When true, parse timezones
           *
           * @type {Boolean}
           */
          parseTimezone: true,
          /* SAX like events here for reference */
          /**
           * Fired when parsing is complete
           * @callback
           */
          oncomplete: (
            /* istanbul ignore next */
            function() {
            }
          ),
          /**
           * Fired if an error occurs during parsing.
           *
           * @callback
           * @param {Error} err details of error
           */
          onerror: (
            /* istanbul ignore next */
            function(err) {
            }
          ),
          /**
           * Fired when a top level component (VTIMEZONE) is found
           *
           * @callback
           * @param {ICAL.Timezone} component     Timezone object
           */
          ontimezone: (
            /* istanbul ignore next */
            function(component) {
            }
          ),
          /**
           * Fired when a top level component (VEVENT) is found.
           *
           * @callback
           * @param {ICAL.Event} component    Top level component
           */
          onevent: (
            /* istanbul ignore next */
            function(component) {
            }
          ),
          /**
           * Process a string or parse ical object.  This function itself will return
           * nothing but will start the parsing process.
           *
           * Events must be registered prior to calling this method.
           *
           * @param {ICAL.Component|String|Object} ical      The component to process,
           *        either in its final form, as a jCal Object, or string representation
           */
          process: function(ical) {
            if (typeof ical === "string") {
              ical = ICAL2.parse(ical);
            }
            if (!(ical instanceof ICAL2.Component)) {
              ical = new ICAL2.Component(ical);
            }
            var components = ical.getAllSubcomponents();
            var i3 = 0;
            var len = components.length;
            var component;
            for (; i3 < len; i3++) {
              component = components[i3];
              switch (component.name) {
                case "vtimezone":
                  if (this.parseTimezone) {
                    var tzid = component.getFirstPropertyValue("tzid");
                    if (tzid) {
                      this.ontimezone(new ICAL2.Timezone({
                        tzid,
                        component
                      }));
                    }
                  }
                  break;
                case "vevent":
                  if (this.parseEvent) {
                    this.onevent(new ICAL2.Event(component));
                  }
                  break;
                default:
                  continue;
              }
            }
            this.oncomplete();
          }
        };
        return ComponentParser;
      })();
    }
  });

  // node_modules/preact/dist/preact.module.js
  var n;
  var l;
  var u;
  var i;
  var t;
  var r;
  var o;
  var f;
  var e;
  var c = {};
  var s = [];
  var a = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
  function h(n2, l79) {
    for (var u3 in l79) n2[u3] = l79[u3];
    return n2;
  }
  function v(n2) {
    var l79 = n2.parentNode;
    l79 && l79.removeChild(n2);
  }
  function y(l79, u3, i3) {
    var t3, r3, o2, f3 = {};
    for (o2 in u3) "key" == o2 ? t3 = u3[o2] : "ref" == o2 ? r3 = u3[o2] : f3[o2] = u3[o2];
    if (arguments.length > 2 && (f3.children = arguments.length > 3 ? n.call(arguments, 2) : i3), "function" == typeof l79 && null != l79.defaultProps) for (o2 in l79.defaultProps) void 0 === f3[o2] && (f3[o2] = l79.defaultProps[o2]);
    return p(l79, f3, t3, r3, null);
  }
  function p(n2, i3, t3, r3, o2) {
    var f3 = { type: n2, props: i3, key: t3, ref: r3, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, __h: null, constructor: void 0, __v: null == o2 ? ++u : o2 };
    return null == o2 && null != l.vnode && l.vnode(f3), f3;
  }
  function d() {
    return { current: null };
  }
  function _(n2) {
    return n2.children;
  }
  function k(n2, l79, u3, i3, t3) {
    var r3;
    for (r3 in u3) "children" === r3 || "key" === r3 || r3 in l79 || g(n2, r3, null, u3[r3], i3);
    for (r3 in l79) t3 && "function" != typeof l79[r3] || "children" === r3 || "key" === r3 || "value" === r3 || "checked" === r3 || u3[r3] === l79[r3] || g(n2, r3, l79[r3], u3[r3], i3);
  }
  function b(n2, l79, u3) {
    "-" === l79[0] ? n2.setProperty(l79, null == u3 ? "" : u3) : n2[l79] = null == u3 ? "" : "number" != typeof u3 || a.test(l79) ? u3 : u3 + "px";
  }
  function g(n2, l79, u3, i3, t3) {
    var r3;
    n: if ("style" === l79) if ("string" == typeof u3) n2.style.cssText = u3;
    else {
      if ("string" == typeof i3 && (n2.style.cssText = i3 = ""), i3) for (l79 in i3) u3 && l79 in u3 || b(n2.style, l79, "");
      if (u3) for (l79 in u3) i3 && u3[l79] === i3[l79] || b(n2.style, l79, u3[l79]);
    }
    else if ("o" === l79[0] && "n" === l79[1]) r3 = l79 !== (l79 = l79.replace(/Capture$/, "")), l79 = l79.toLowerCase() in n2 ? l79.toLowerCase().slice(2) : l79.slice(2), n2.l || (n2.l = {}), n2.l[l79 + r3] = u3, u3 ? i3 || n2.addEventListener(l79, r3 ? w : m, r3) : n2.removeEventListener(l79, r3 ? w : m, r3);
    else if ("dangerouslySetInnerHTML" !== l79) {
      if (t3) l79 = l79.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if ("width" !== l79 && "height" !== l79 && "href" !== l79 && "list" !== l79 && "form" !== l79 && "tabIndex" !== l79 && "download" !== l79 && l79 in n2) try {
        n2[l79] = null == u3 ? "" : u3;
        break n;
      } catch (n3) {
      }
      "function" == typeof u3 || (null == u3 || false === u3 && -1 == l79.indexOf("-") ? n2.removeAttribute(l79) : n2.setAttribute(l79, u3));
    }
  }
  function m(n2) {
    t = true;
    try {
      return this.l[n2.type + false](l.event ? l.event(n2) : n2);
    } finally {
      t = false;
    }
  }
  function w(n2) {
    t = true;
    try {
      return this.l[n2.type + true](l.event ? l.event(n2) : n2);
    } finally {
      t = false;
    }
  }
  function x(n2, l79) {
    this.props = n2, this.context = l79;
  }
  function A(n2, l79) {
    if (null == l79) return n2.__ ? A(n2.__, n2.__.__k.indexOf(n2) + 1) : null;
    for (var u3; l79 < n2.__k.length; l79++) if (null != (u3 = n2.__k[l79]) && null != u3.__e) return u3.__e;
    return "function" == typeof n2.type ? A(n2) : null;
  }
  function P(n2) {
    var l79, u3;
    if (null != (n2 = n2.__) && null != n2.__c) {
      for (n2.__e = n2.__c.base = null, l79 = 0; l79 < n2.__k.length; l79++) if (null != (u3 = n2.__k[l79]) && null != u3.__e) {
        n2.__e = n2.__c.base = u3.__e;
        break;
      }
      return P(n2);
    }
  }
  function C(n2) {
    t ? setTimeout(n2) : f(n2);
  }
  function T(n2) {
    (!n2.__d && (n2.__d = true) && r.push(n2) && !$.__r++ || o !== l.debounceRendering) && ((o = l.debounceRendering) || C)($);
  }
  function $() {
    var n2, l79, u3, i3, t3, o2, f3, e3;
    for (r.sort(function(n3, l80) {
      return n3.__v.__b - l80.__v.__b;
    }); n2 = r.shift(); ) n2.__d && (l79 = r.length, i3 = void 0, t3 = void 0, f3 = (o2 = (u3 = n2).__v).__e, (e3 = u3.__P) && (i3 = [], (t3 = h({}, o2)).__v = o2.__v + 1, M(e3, o2, t3, u3.__n, void 0 !== e3.ownerSVGElement, null != o2.__h ? [f3] : null, i3, null == f3 ? A(o2) : f3, o2.__h), N(i3, o2), o2.__e != f3 && P(o2)), r.length > l79 && r.sort(function(n3, l80) {
      return n3.__v.__b - l80.__v.__b;
    }));
    $.__r = 0;
  }
  function H(n2, l79, u3, i3, t3, r3, o2, f3, e3, a3) {
    var h3, v3, y3, d2, k3, b3, g4, m3 = i3 && i3.__k || s, w4 = m3.length;
    for (u3.__k = [], h3 = 0; h3 < l79.length; h3++) if (null != (d2 = u3.__k[h3] = null == (d2 = l79[h3]) || "boolean" == typeof d2 ? null : "string" == typeof d2 || "number" == typeof d2 || "bigint" == typeof d2 ? p(null, d2, null, null, d2) : Array.isArray(d2) ? p(_, { children: d2 }, null, null, null) : d2.__b > 0 ? p(d2.type, d2.props, d2.key, d2.ref ? d2.ref : null, d2.__v) : d2)) {
      if (d2.__ = u3, d2.__b = u3.__b + 1, null === (y3 = m3[h3]) || y3 && d2.key == y3.key && d2.type === y3.type) m3[h3] = void 0;
      else for (v3 = 0; v3 < w4; v3++) {
        if ((y3 = m3[v3]) && d2.key == y3.key && d2.type === y3.type) {
          m3[v3] = void 0;
          break;
        }
        y3 = null;
      }
      M(n2, d2, y3 = y3 || c, t3, r3, o2, f3, e3, a3), k3 = d2.__e, (v3 = d2.ref) && y3.ref != v3 && (g4 || (g4 = []), y3.ref && g4.push(y3.ref, null, d2), g4.push(v3, d2.__c || k3, d2)), null != k3 ? (null == b3 && (b3 = k3), "function" == typeof d2.type && d2.__k === y3.__k ? d2.__d = e3 = I(d2, e3, n2) : e3 = z(n2, d2, y3, m3, k3, e3), "function" == typeof u3.type && (u3.__d = e3)) : e3 && y3.__e == e3 && e3.parentNode != n2 && (e3 = A(y3));
    }
    for (u3.__e = b3, h3 = w4; h3--; ) null != m3[h3] && ("function" == typeof u3.type && null != m3[h3].__e && m3[h3].__e == u3.__d && (u3.__d = L(i3).nextSibling), q(m3[h3], m3[h3]));
    if (g4) for (h3 = 0; h3 < g4.length; h3++) S(g4[h3], g4[++h3], g4[++h3]);
  }
  function I(n2, l79, u3) {
    for (var i3, t3 = n2.__k, r3 = 0; t3 && r3 < t3.length; r3++) (i3 = t3[r3]) && (i3.__ = n2, l79 = "function" == typeof i3.type ? I(i3, l79, u3) : z(u3, i3, i3, t3, i3.__e, l79));
    return l79;
  }
  function j(n2, l79) {
    return l79 = l79 || [], null == n2 || "boolean" == typeof n2 || (Array.isArray(n2) ? n2.some(function(n3) {
      j(n3, l79);
    }) : l79.push(n2)), l79;
  }
  function z(n2, l79, u3, i3, t3, r3) {
    var o2, f3, e3;
    if (void 0 !== l79.__d) o2 = l79.__d, l79.__d = void 0;
    else if (null == u3 || t3 != r3 || null == t3.parentNode) n: if (null == r3 || r3.parentNode !== n2) n2.appendChild(t3), o2 = null;
    else {
      for (f3 = r3, e3 = 0; (f3 = f3.nextSibling) && e3 < i3.length; e3 += 1) if (f3 == t3) break n;
      n2.insertBefore(t3, r3), o2 = r3;
    }
    return void 0 !== o2 ? o2 : t3.nextSibling;
  }
  function L(n2) {
    var l79, u3, i3;
    if (null == n2.type || "string" == typeof n2.type) return n2.__e;
    if (n2.__k) {
      for (l79 = n2.__k.length - 1; l79 >= 0; l79--) if ((u3 = n2.__k[l79]) && (i3 = L(u3))) return i3;
    }
    return null;
  }
  function M(n2, u3, i3, t3, r3, o2, f3, e3, c3) {
    var s3, a3, v3, y3, p3, d2, k3, b3, g4, m3, w4, A3, P3, C3, T4, $3 = u3.type;
    if (void 0 !== u3.constructor) return null;
    null != i3.__h && (c3 = i3.__h, e3 = u3.__e = i3.__e, u3.__h = null, o2 = [e3]), (s3 = l.__b) && s3(u3);
    try {
      n: if ("function" == typeof $3) {
        if (b3 = u3.props, g4 = (s3 = $3.contextType) && t3[s3.__c], m3 = s3 ? g4 ? g4.props.value : s3.__ : t3, i3.__c ? k3 = (a3 = u3.__c = i3.__c).__ = a3.__E : ("prototype" in $3 && $3.prototype.render ? u3.__c = a3 = new $3(b3, m3) : (u3.__c = a3 = new x(b3, m3), a3.constructor = $3, a3.render = B), g4 && g4.sub(a3), a3.props = b3, a3.state || (a3.state = {}), a3.context = m3, a3.__n = t3, v3 = a3.__d = true, a3.__h = [], a3._sb = []), null == a3.__s && (a3.__s = a3.state), null != $3.getDerivedStateFromProps && (a3.__s == a3.state && (a3.__s = h({}, a3.__s)), h(a3.__s, $3.getDerivedStateFromProps(b3, a3.__s))), y3 = a3.props, p3 = a3.state, a3.__v = u3, v3) null == $3.getDerivedStateFromProps && null != a3.componentWillMount && a3.componentWillMount(), null != a3.componentDidMount && a3.__h.push(a3.componentDidMount);
        else {
          if (null == $3.getDerivedStateFromProps && b3 !== y3 && null != a3.componentWillReceiveProps && a3.componentWillReceiveProps(b3, m3), !a3.__e && null != a3.shouldComponentUpdate && false === a3.shouldComponentUpdate(b3, a3.__s, m3) || u3.__v === i3.__v) {
            for (u3.__v !== i3.__v && (a3.props = b3, a3.state = a3.__s, a3.__d = false), u3.__e = i3.__e, u3.__k = i3.__k, u3.__k.forEach(function(n3) {
              n3 && (n3.__ = u3);
            }), w4 = 0; w4 < a3._sb.length; w4++) a3.__h.push(a3._sb[w4]);
            a3._sb = [], a3.__h.length && f3.push(a3);
            break n;
          }
          null != a3.componentWillUpdate && a3.componentWillUpdate(b3, a3.__s, m3), null != a3.componentDidUpdate && a3.__h.push(function() {
            a3.componentDidUpdate(y3, p3, d2);
          });
        }
        if (a3.context = m3, a3.props = b3, a3.__P = n2, A3 = l.__r, P3 = 0, "prototype" in $3 && $3.prototype.render) {
          for (a3.state = a3.__s, a3.__d = false, A3 && A3(u3), s3 = a3.render(a3.props, a3.state, a3.context), C3 = 0; C3 < a3._sb.length; C3++) a3.__h.push(a3._sb[C3]);
          a3._sb = [];
        } else do {
          a3.__d = false, A3 && A3(u3), s3 = a3.render(a3.props, a3.state, a3.context), a3.state = a3.__s;
        } while (a3.__d && ++P3 < 25);
        a3.state = a3.__s, null != a3.getChildContext && (t3 = h(h({}, t3), a3.getChildContext())), v3 || null == a3.getSnapshotBeforeUpdate || (d2 = a3.getSnapshotBeforeUpdate(y3, p3)), T4 = null != s3 && s3.type === _ && null == s3.key ? s3.props.children : s3, H(n2, Array.isArray(T4) ? T4 : [T4], u3, i3, t3, r3, o2, f3, e3, c3), a3.base = u3.__e, u3.__h = null, a3.__h.length && f3.push(a3), k3 && (a3.__E = a3.__ = null), a3.__e = false;
      } else null == o2 && u3.__v === i3.__v ? (u3.__k = i3.__k, u3.__e = i3.__e) : u3.__e = O(i3.__e, u3, i3, t3, r3, o2, f3, c3);
      (s3 = l.diffed) && s3(u3);
    } catch (n3) {
      u3.__v = null, (c3 || null != o2) && (u3.__e = e3, u3.__h = !!c3, o2[o2.indexOf(e3)] = null), l.__e(n3, u3, i3);
    }
  }
  function N(n2, u3) {
    l.__c && l.__c(u3, n2), n2.some(function(u4) {
      try {
        n2 = u4.__h, u4.__h = [], n2.some(function(n3) {
          n3.call(u4);
        });
      } catch (n3) {
        l.__e(n3, u4.__v);
      }
    });
  }
  function O(l79, u3, i3, t3, r3, o2, f3, e3) {
    var s3, a3, h3, y3 = i3.props, p3 = u3.props, d2 = u3.type, _3 = 0;
    if ("svg" === d2 && (r3 = true), null != o2) {
      for (; _3 < o2.length; _3++) if ((s3 = o2[_3]) && "setAttribute" in s3 == !!d2 && (d2 ? s3.localName === d2 : 3 === s3.nodeType)) {
        l79 = s3, o2[_3] = null;
        break;
      }
    }
    if (null == l79) {
      if (null === d2) return document.createTextNode(p3);
      l79 = r3 ? document.createElementNS("http://www.w3.org/2000/svg", d2) : document.createElement(d2, p3.is && p3), o2 = null, e3 = false;
    }
    if (null === d2) y3 === p3 || e3 && l79.data === p3 || (l79.data = p3);
    else {
      if (o2 = o2 && n.call(l79.childNodes), a3 = (y3 = i3.props || c).dangerouslySetInnerHTML, h3 = p3.dangerouslySetInnerHTML, !e3) {
        if (null != o2) for (y3 = {}, _3 = 0; _3 < l79.attributes.length; _3++) y3[l79.attributes[_3].name] = l79.attributes[_3].value;
        (h3 || a3) && (h3 && (a3 && h3.__html == a3.__html || h3.__html === l79.innerHTML) || (l79.innerHTML = h3 && h3.__html || ""));
      }
      if (k(l79, p3, y3, r3, e3), h3) u3.__k = [];
      else if (_3 = u3.props.children, H(l79, Array.isArray(_3) ? _3 : [_3], u3, i3, t3, r3 && "foreignObject" !== d2, o2, f3, o2 ? o2[0] : i3.__k && A(i3, 0), e3), null != o2) for (_3 = o2.length; _3--; ) null != o2[_3] && v(o2[_3]);
      e3 || ("value" in p3 && void 0 !== (_3 = p3.value) && (_3 !== l79.value || "progress" === d2 && !_3 || "option" === d2 && _3 !== y3.value) && g(l79, "value", _3, y3.value, false), "checked" in p3 && void 0 !== (_3 = p3.checked) && _3 !== l79.checked && g(l79, "checked", _3, y3.checked, false));
    }
    return l79;
  }
  function S(n2, u3, i3) {
    try {
      "function" == typeof n2 ? n2(u3) : n2.current = u3;
    } catch (n3) {
      l.__e(n3, i3);
    }
  }
  function q(n2, u3, i3) {
    var t3, r3;
    if (l.unmount && l.unmount(n2), (t3 = n2.ref) && (t3.current && t3.current !== n2.__e || S(t3, null, u3)), null != (t3 = n2.__c)) {
      if (t3.componentWillUnmount) try {
        t3.componentWillUnmount();
      } catch (n3) {
        l.__e(n3, u3);
      }
      t3.base = t3.__P = null, n2.__c = void 0;
    }
    if (t3 = n2.__k) for (r3 = 0; r3 < t3.length; r3++) t3[r3] && q(t3[r3], u3, i3 || "function" != typeof n2.type);
    i3 || null == n2.__e || v(n2.__e), n2.__ = n2.__e = n2.__d = void 0;
  }
  function B(n2, l79, u3) {
    return this.constructor(n2, u3);
  }
  function D(u3, i3, t3) {
    var r3, o2, f3;
    l.__ && l.__(u3, i3), o2 = (r3 = "function" == typeof t3) ? null : t3 && t3.__k || i3.__k, f3 = [], M(i3, u3 = (!r3 && t3 || i3).__k = y(_, null, [u3]), o2 || c, c, void 0 !== i3.ownerSVGElement, !r3 && t3 ? [t3] : o2 ? null : i3.firstChild ? n.call(i3.childNodes) : null, f3, !r3 && t3 ? t3 : o2 ? o2.__e : i3.firstChild, r3), N(f3, u3);
  }
  function G(n2, l79) {
    var u3 = { __c: l79 = "__cC" + e++, __: n2, Consumer: function(n3, l80) {
      return n3.children(l80);
    }, Provider: function(n3) {
      var u4, i3;
      return this.getChildContext || (u4 = [], (i3 = {})[l79] = this, this.getChildContext = function() {
        return i3;
      }, this.shouldComponentUpdate = function(n4) {
        this.props.value !== n4.value && u4.some(function(n5) {
          n5.__e = true, T(n5);
        });
      }, this.sub = function(n4) {
        u4.push(n4);
        var l80 = n4.componentWillUnmount;
        n4.componentWillUnmount = function() {
          u4.splice(u4.indexOf(n4), 1), l80 && l80.call(n4);
        };
      }), n3.children;
    } };
    return u3.Provider.__ = u3.Consumer.contextType = u3;
  }
  n = s.slice, l = { __e: function(n2, l79, u3, i3) {
    for (var t3, r3, o2; l79 = l79.__; ) if ((t3 = l79.__c) && !t3.__) try {
      if ((r3 = t3.constructor) && null != r3.getDerivedStateFromError && (t3.setState(r3.getDerivedStateFromError(n2)), o2 = t3.__d), null != t3.componentDidCatch && (t3.componentDidCatch(n2, i3 || {}), o2 = t3.__d), o2) return t3.__E = t3;
    } catch (l80) {
      n2 = l80;
    }
    throw n2;
  } }, u = 0, i = function(n2) {
    return null != n2 && void 0 === n2.constructor;
  }, t = false, x.prototype.setState = function(n2, l79) {
    var u3;
    u3 = null != this.__s && this.__s !== this.state ? this.__s : this.__s = h({}, this.state), "function" == typeof n2 && (n2 = n2(h({}, u3), this.props)), n2 && h(u3, n2), null != n2 && this.__v && (l79 && this._sb.push(l79), T(this));
  }, x.prototype.forceUpdate = function(n2) {
    this.__v && (this.__e = true, n2 && this.__h.push(n2), T(this));
  }, x.prototype.render = _, r = [], f = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, $.__r = 0, e = 0;

  // node_modules/preact/hooks/dist/hooks.module.js
  var t2;
  var r2;
  var u2;
  var i2;
  var f2 = [];
  var c2 = [];
  var e2 = l.__b;
  var a2 = l.__r;
  var v2 = l.diffed;
  var l2 = l.__c;
  var m2 = l.unmount;
  function b2() {
    for (var t3; t3 = f2.shift(); ) if (t3.__P && t3.__H) try {
      t3.__H.__h.forEach(k2), t3.__H.__h.forEach(w2), t3.__H.__h = [];
    } catch (r3) {
      t3.__H.__h = [], l.__e(r3, t3.__v);
    }
  }
  l.__b = function(n2) {
    r2 = null, e2 && e2(n2);
  }, l.__r = function(n2) {
    a2 && a2(n2), t2 = 0;
    var i3 = (r2 = n2.__c).__H;
    i3 && (u2 === r2 ? (i3.__h = [], r2.__h = [], i3.__.forEach(function(n3) {
      n3.__N && (n3.__ = n3.__N), n3.__V = c2, n3.__N = n3.i = void 0;
    })) : (i3.__h.forEach(k2), i3.__h.forEach(w2), i3.__h = [])), u2 = r2;
  }, l.diffed = function(t3) {
    v2 && v2(t3);
    var o2 = t3.__c;
    o2 && o2.__H && (o2.__H.__h.length && (1 !== f2.push(o2) && i2 === l.requestAnimationFrame || ((i2 = l.requestAnimationFrame) || j2)(b2)), o2.__H.__.forEach(function(n2) {
      n2.i && (n2.__H = n2.i), n2.__V !== c2 && (n2.__ = n2.__V), n2.i = void 0, n2.__V = c2;
    })), u2 = r2 = null;
  }, l.__c = function(t3, r3) {
    r3.some(function(t4) {
      try {
        t4.__h.forEach(k2), t4.__h = t4.__h.filter(function(n2) {
          return !n2.__ || w2(n2);
        });
      } catch (u3) {
        r3.some(function(n2) {
          n2.__h && (n2.__h = []);
        }), r3 = [], l.__e(u3, t4.__v);
      }
    }), l2 && l2(t3, r3);
  }, l.unmount = function(t3) {
    m2 && m2(t3);
    var r3, u3 = t3.__c;
    u3 && u3.__H && (u3.__H.__.forEach(function(n2) {
      try {
        k2(n2);
      } catch (n3) {
        r3 = n3;
      }
    }), u3.__H = void 0, r3 && l.__e(r3, u3.__v));
  };
  var g2 = "function" == typeof requestAnimationFrame;
  function j2(n2) {
    var t3, r3 = function() {
      clearTimeout(u3), g2 && cancelAnimationFrame(t3), setTimeout(n2);
    }, u3 = setTimeout(r3, 100);
    g2 && (t3 = requestAnimationFrame(r3));
  }
  function k2(n2) {
    var t3 = r2, u3 = n2.__c;
    "function" == typeof u3 && (n2.__c = void 0, u3()), r2 = t3;
  }
  function w2(n2) {
    var t3 = r2;
    n2.__c = n2.__(), r2 = t3;
  }

  // node_modules/preact/compat/dist/compat.module.js
  function g3(n2, t3) {
    for (var e3 in t3) n2[e3] = t3[e3];
    return n2;
  }
  function C2(n2, t3) {
    for (var e3 in n2) if ("__source" !== e3 && !(e3 in t3)) return true;
    for (var r3 in t3) if ("__source" !== r3 && n2[r3] !== t3[r3]) return true;
    return false;
  }
  function w3(n2) {
    this.props = n2;
  }
  (w3.prototype = new x()).isPureReactComponent = true, w3.prototype.shouldComponentUpdate = function(n2, t3) {
    return C2(this.props, n2) || C2(this.state, t3);
  };
  var x3 = l.__b;
  l.__b = function(n2) {
    n2.type && n2.type.__f && n2.ref && (n2.props.ref = n2.ref, n2.ref = null), x3 && x3(n2);
  };
  var N2 = "undefined" != typeof Symbol && Symbol.for && /* @__PURE__ */ Symbol.for("react.forward_ref") || 3911;
  var T3 = l.__e;
  l.__e = function(n2, t3, e3, r3) {
    if (n2.then) {
      for (var u3, o2 = t3; o2 = o2.__; ) if ((u3 = o2.__c) && u3.__c) return null == t3.__e && (t3.__e = e3.__e, t3.__k = e3.__k), u3.__c(n2, t3);
    }
    T3(n2, t3, e3, r3);
  };
  var I2 = l.unmount;
  function L2(n2, t3, e3) {
    return n2 && (n2.__c && n2.__c.__H && (n2.__c.__H.__.forEach(function(n3) {
      "function" == typeof n3.__c && n3.__c();
    }), n2.__c.__H = null), null != (n2 = g3({}, n2)).__c && (n2.__c.__P === e3 && (n2.__c.__P = t3), n2.__c = null), n2.__k = n2.__k && n2.__k.map(function(n3) {
      return L2(n3, t3, e3);
    })), n2;
  }
  function U(n2, t3, e3) {
    return n2 && (n2.__v = null, n2.__k = n2.__k && n2.__k.map(function(n3) {
      return U(n3, t3, e3);
    }), n2.__c && n2.__c.__P === t3 && (n2.__e && e3.insertBefore(n2.__e, n2.__d), n2.__c.__e = true, n2.__c.__P = e3)), n2;
  }
  function D2() {
    this.__u = 0, this.t = null, this.__b = null;
  }
  function F3(n2) {
    var t3 = n2.__.__c;
    return t3 && t3.__a && t3.__a(n2);
  }
  function V2() {
    this.u = null, this.o = null;
  }
  l.unmount = function(n2) {
    var t3 = n2.__c;
    t3 && t3.__R && t3.__R(), t3 && true === n2.__h && (n2.type = null), I2 && I2(n2);
  }, (D2.prototype = new x()).__c = function(n2, t3) {
    var e3 = t3.__c, r3 = this;
    null == r3.t && (r3.t = []), r3.t.push(e3);
    var u3 = F3(r3.__v), o2 = false, i3 = function() {
      o2 || (o2 = true, e3.__R = null, u3 ? u3(l79) : l79());
    };
    e3.__R = i3;
    var l79 = function() {
      if (!--r3.__u) {
        if (r3.state.__a) {
          var n3 = r3.state.__a;
          r3.__v.__k[0] = U(n3, n3.__c.__P, n3.__c.__O);
        }
        var t4;
        for (r3.setState({ __a: r3.__b = null }); t4 = r3.t.pop(); ) t4.forceUpdate();
      }
    }, c3 = true === t3.__h;
    r3.__u++ || c3 || r3.setState({ __a: r3.__b = r3.__v.__k[0] }), n2.then(i3, i3);
  }, D2.prototype.componentWillUnmount = function() {
    this.t = [];
  }, D2.prototype.render = function(n2, e3) {
    if (this.__b) {
      if (this.__v.__k) {
        var r3 = document.createElement("div"), o2 = this.__v.__k[0].__c;
        this.__v.__k[0] = L2(this.__b, r3, o2.__O = o2.__P);
      }
      this.__b = null;
    }
    var i3 = e3.__a && y(_, null, n2.fallback);
    return i3 && (i3.__h = null), [y(_, null, e3.__a ? null : n2.children), i3];
  };
  var W = function(n2, t3, e3) {
    if (++e3[1] === e3[0] && n2.o.delete(t3), n2.props.revealOrder && ("t" !== n2.props.revealOrder[0] || !n2.o.size)) for (e3 = n2.u; e3; ) {
      for (; e3.length > 3; ) e3.pop()();
      if (e3[1] < e3[0]) break;
      n2.u = e3 = e3[2];
    }
  };
  function P2(n2) {
    return this.getChildContext = function() {
      return n2.context;
    }, n2.children;
  }
  function $2(n2) {
    var e3 = this, r3 = n2.i;
    e3.componentWillUnmount = function() {
      D(null, e3.l), e3.l = null, e3.i = null;
    }, e3.i && e3.i !== r3 && e3.componentWillUnmount(), n2.__v ? (e3.l || (e3.i = r3, e3.l = { nodeType: 1, parentNode: r3, childNodes: [], appendChild: function(n3) {
      this.childNodes.push(n3), e3.i.appendChild(n3);
    }, insertBefore: function(n3, t3) {
      this.childNodes.push(n3), e3.i.appendChild(n3);
    }, removeChild: function(n3) {
      this.childNodes.splice(this.childNodes.indexOf(n3) >>> 1, 1), e3.i.removeChild(n3);
    } }), D(y(P2, { context: e3.context }, n2.__v), e3.l)) : e3.l && e3.componentWillUnmount();
  }
  function j3(n2, e3) {
    var r3 = y($2, { __v: n2, i: e3 });
    return r3.containerInfo = e3, r3;
  }
  (V2.prototype = new x()).__a = function(n2) {
    var t3 = this, e3 = F3(t3.__v), r3 = t3.o.get(n2);
    return r3[0]++, function(u3) {
      var o2 = function() {
        t3.props.revealOrder ? (r3.push(u3), W(t3, n2, r3)) : u3();
      };
      e3 ? e3(o2) : o2();
    };
  }, V2.prototype.render = function(n2) {
    this.u = null, this.o = /* @__PURE__ */ new Map();
    var t3 = j(n2.children);
    n2.revealOrder && "b" === n2.revealOrder[0] && t3.reverse();
    for (var e3 = t3.length; e3--; ) this.o.set(t3[e3], this.u = [1, 0, this.u]);
    return n2.children;
  }, V2.prototype.componentDidUpdate = V2.prototype.componentDidMount = function() {
    var n2 = this;
    this.o.forEach(function(t3, e3) {
      W(n2, e3, t3);
    });
  };
  var z2 = "undefined" != typeof Symbol && Symbol.for && /* @__PURE__ */ Symbol.for("react.element") || 60103;
  var B2 = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;
  var H2 = "undefined" != typeof document;
  var Z = function(n2) {
    return ("undefined" != typeof Symbol && "symbol" == typeof /* @__PURE__ */ Symbol() ? /fil|che|rad/i : /fil|che|ra/i).test(n2);
  };
  x.prototype.isReactComponent = {}, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(t3) {
    Object.defineProperty(x.prototype, t3, { configurable: true, get: function() {
      return this["UNSAFE_" + t3];
    }, set: function(n2) {
      Object.defineProperty(this, t3, { configurable: true, writable: true, value: n2 });
    } });
  });
  var G2 = l.event;
  function J() {
  }
  function K() {
    return this.cancelBubble;
  }
  function Q() {
    return this.defaultPrevented;
  }
  l.event = function(n2) {
    return G2 && (n2 = G2(n2)), n2.persist = J, n2.isPropagationStopped = K, n2.isDefaultPrevented = Q, n2.nativeEvent = n2;
  };
  var X;
  var nn = { configurable: true, get: function() {
    return this.class;
  } };
  var tn = l.vnode;
  l.vnode = function(n2) {
    var t3 = n2.type, e3 = n2.props, u3 = e3;
    if ("string" == typeof t3) {
      var o2 = -1 === t3.indexOf("-");
      for (var i3 in u3 = {}, e3) {
        var l79 = e3[i3];
        H2 && "children" === i3 && "noscript" === t3 || "value" === i3 && "defaultValue" in e3 && null == l79 || ("defaultValue" === i3 && "value" in e3 && null == e3.value ? i3 = "value" : "download" === i3 && true === l79 ? l79 = "" : /ondoubleclick/i.test(i3) ? i3 = "ondblclick" : /^onchange(textarea|input)/i.test(i3 + t3) && !Z(e3.type) ? i3 = "oninput" : /^onfocus$/i.test(i3) ? i3 = "onfocusin" : /^onblur$/i.test(i3) ? i3 = "onfocusout" : /^on(Ani|Tra|Tou|BeforeInp|Compo)/.test(i3) ? i3 = i3.toLowerCase() : o2 && B2.test(i3) ? i3 = i3.replace(/[A-Z0-9]/g, "-$&").toLowerCase() : null === l79 && (l79 = void 0), /^oninput$/i.test(i3) && (i3 = i3.toLowerCase(), u3[i3] && (i3 = "oninputCapture")), u3[i3] = l79);
      }
      "select" == t3 && u3.multiple && Array.isArray(u3.value) && (u3.value = j(e3.children).forEach(function(n3) {
        n3.props.selected = -1 != u3.value.indexOf(n3.props.value);
      })), "select" == t3 && null != u3.defaultValue && (u3.value = j(e3.children).forEach(function(n3) {
        n3.props.selected = u3.multiple ? -1 != u3.defaultValue.indexOf(n3.props.value) : u3.defaultValue == n3.props.value;
      })), n2.props = u3, e3.class != e3.className && (nn.enumerable = "className" in e3, null != e3.className && (u3.class = e3.className), Object.defineProperty(u3, "className", nn));
    }
    n2.$$typeof = z2, tn && tn(n2);
  };
  var en = l.__r;
  l.__r = function(n2) {
    en && en(n2), X = n2.__c;
  };

  // node_modules/@fullcalendar/core/internal-common.js
  var styleTexts = [];
  var styleEls = /* @__PURE__ */ new Map();
  function injectStyles(styleText) {
    styleTexts.push(styleText);
    styleEls.forEach((styleEl) => {
      appendStylesTo(styleEl, styleText);
    });
  }
  function ensureElHasStyles(el) {
    if (el.isConnected && // sometimes true if SSR system simulates DOM
    el.getRootNode) {
      registerStylesRoot(el.getRootNode());
    }
  }
  function registerStylesRoot(rootNode) {
    let styleEl = styleEls.get(rootNode);
    if (!styleEl || !styleEl.isConnected) {
      styleEl = rootNode.querySelector("style[data-fullcalendar]");
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.setAttribute("data-fullcalendar", "");
        const nonce = getNonceValue();
        if (nonce) {
          styleEl.nonce = nonce;
        }
        const parentEl = rootNode === document ? document.head : rootNode;
        const insertBefore = rootNode === document ? parentEl.querySelector("script,link[rel=stylesheet],link[as=style],style") : parentEl.firstChild;
        parentEl.insertBefore(styleEl, insertBefore);
      }
      styleEls.set(rootNode, styleEl);
      hydrateStylesRoot(styleEl);
    }
  }
  function hydrateStylesRoot(styleEl) {
    for (const styleText of styleTexts) {
      appendStylesTo(styleEl, styleText);
    }
  }
  function appendStylesTo(styleEl, styleText) {
    const { sheet } = styleEl;
    const ruleCnt = sheet.cssRules.length;
    styleText.split("}").forEach((styleStr, i3) => {
      styleStr = styleStr.trim();
      if (styleStr) {
        sheet.insertRule(styleStr + "}", ruleCnt + i3);
      }
    });
  }
  var queriedNonceValue;
  function getNonceValue() {
    if (queriedNonceValue === void 0) {
      queriedNonceValue = queryNonceValue();
    }
    return queriedNonceValue;
  }
  function queryNonceValue() {
    const metaWithNonce = document.querySelector('meta[name="csp-nonce"]');
    if (metaWithNonce && metaWithNonce.hasAttribute("content")) {
      return metaWithNonce.getAttribute("content");
    }
    const elWithNonce = document.querySelector("script[nonce]");
    if (elWithNonce) {
      return elWithNonce.nonce || "";
    }
    return "";
  }
  if (typeof document !== "undefined") {
    registerStylesRoot(document);
  }
  var css_248z = ':root{--fc-small-font-size:.85em;--fc-page-bg-color:#fff;--fc-neutral-bg-color:hsla(0,0%,82%,.3);--fc-neutral-text-color:grey;--fc-border-color:#ddd;--fc-button-text-color:#fff;--fc-button-bg-color:#2c3e50;--fc-button-border-color:#2c3e50;--fc-button-hover-bg-color:#1e2b37;--fc-button-hover-border-color:#1a252f;--fc-button-active-bg-color:#1a252f;--fc-button-active-border-color:#151e27;--fc-event-bg-color:#3788d8;--fc-event-border-color:#3788d8;--fc-event-text-color:#fff;--fc-event-selected-overlay-color:rgba(0,0,0,.25);--fc-more-link-bg-color:#d0d0d0;--fc-more-link-text-color:inherit;--fc-event-resizer-thickness:8px;--fc-event-resizer-dot-total-width:8px;--fc-event-resizer-dot-border-width:1px;--fc-non-business-color:hsla(0,0%,84%,.3);--fc-bg-event-color:#8fdf82;--fc-bg-event-opacity:0.3;--fc-highlight-color:rgba(188,232,241,.3);--fc-today-bg-color:rgba(255,220,40,.15);--fc-now-indicator-color:red}.fc-not-allowed,.fc-not-allowed .fc-event{cursor:not-allowed}.fc{display:flex;flex-direction:column;font-size:1em}.fc,.fc *,.fc :after,.fc :before{box-sizing:border-box}.fc table{border-collapse:collapse;border-spacing:0;font-size:1em}.fc th{text-align:center}.fc td,.fc th{padding:0;vertical-align:top}.fc a[data-navlink]{cursor:pointer}.fc a[data-navlink]:hover{text-decoration:underline}.fc-direction-ltr{direction:ltr;text-align:left}.fc-direction-rtl{direction:rtl;text-align:right}.fc-theme-standard td,.fc-theme-standard th{border:1px solid var(--fc-border-color)}.fc-liquid-hack td,.fc-liquid-hack th{position:relative}@font-face{font-family:fcicons;font-style:normal;font-weight:400;src:url("data:application/x-font-ttf;charset=utf-8;base64,AAEAAAALAIAAAwAwT1MvMg8SBfAAAAC8AAAAYGNtYXAXVtKNAAABHAAAAFRnYXNwAAAAEAAAAXAAAAAIZ2x5ZgYydxIAAAF4AAAFNGhlYWQUJ7cIAAAGrAAAADZoaGVhB20DzAAABuQAAAAkaG10eCIABhQAAAcIAAAALGxvY2ED4AU6AAAHNAAAABhtYXhwAA8AjAAAB0wAAAAgbmFtZXsr690AAAdsAAABhnBvc3QAAwAAAAAI9AAAACAAAwPAAZAABQAAApkCzAAAAI8CmQLMAAAB6wAzAQkAAAAAAAAAAAAAAAAAAAABEAAAAAAAAAAAAAAAAAAAAABAAADpBgPA/8AAQAPAAEAAAAABAAAAAAAAAAAAAAAgAAAAAAADAAAAAwAAABwAAQADAAAAHAADAAEAAAAcAAQAOAAAAAoACAACAAIAAQAg6Qb//f//AAAAAAAg6QD//f//AAH/4xcEAAMAAQAAAAAAAAAAAAAAAQAB//8ADwABAAAAAAAAAAAAAgAANzkBAAAAAAEAAAAAAAAAAAACAAA3OQEAAAAAAQAAAAAAAAAAAAIAADc5AQAAAAABAWIAjQKeAskAEwAAJSc3NjQnJiIHAQYUFwEWMjc2NCcCnuLiDQ0MJAz/AA0NAQAMJAwNDcni4gwjDQwM/wANIwz/AA0NDCMNAAAAAQFiAI0CngLJABMAACUBNjQnASYiBwYUHwEHBhQXFjI3AZ4BAA0N/wAMJAwNDeLiDQ0MJAyNAQAMIw0BAAwMDSMM4uINIwwNDQAAAAIA4gC3Ax4CngATACcAACUnNzY0JyYiDwEGFB8BFjI3NjQnISc3NjQnJiIPAQYUHwEWMjc2NCcB87e3DQ0MIw3VDQ3VDSMMDQ0BK7e3DQ0MJAzVDQ3VDCQMDQ3zuLcMJAwNDdUNIwzWDAwNIwy4twwkDA0N1Q0jDNYMDA0jDAAAAgDiALcDHgKeABMAJwAAJTc2NC8BJiIHBhQfAQcGFBcWMjchNzY0LwEmIgcGFB8BBwYUFxYyNwJJ1Q0N1Q0jDA0Nt7cNDQwjDf7V1Q0N1QwkDA0Nt7cNDQwkDLfWDCMN1Q0NDCQMt7gMIw0MDNYMIw3VDQ0MJAy3uAwjDQwMAAADAFUAAAOrA1UAMwBoAHcAABMiBgcOAQcOAQcOARURFBYXHgEXHgEXHgEzITI2Nz4BNz4BNz4BNRE0JicuAScuAScuASMFITIWFx4BFx4BFx4BFREUBgcOAQcOAQcOASMhIiYnLgEnLgEnLgE1ETQ2Nz4BNz4BNz4BMxMhMjY1NCYjISIGFRQWM9UNGAwLFQkJDgUFBQUFBQ4JCRULDBgNAlYNGAwLFQkJDgUFBQUFBQ4JCRULDBgN/aoCVgQIBAQHAwMFAQIBAQIBBQMDBwQECAT9qgQIBAQHAwMFAQIBAQIBBQMDBwQECASAAVYRGRkR/qoRGRkRA1UFBAUOCQkVDAsZDf2rDRkLDBUJCA4FBQUFBQUOCQgVDAsZDQJVDRkLDBUJCQ4FBAVVAgECBQMCBwQECAX9qwQJAwQHAwMFAQICAgIBBQMDBwQDCQQCVQUIBAQHAgMFAgEC/oAZEhEZGRESGQAAAAADAFUAAAOrA1UAMwBoAIkAABMiBgcOAQcOAQcOARURFBYXHgEXHgEXHgEzITI2Nz4BNz4BNz4BNRE0JicuAScuAScuASMFITIWFx4BFx4BFx4BFREUBgcOAQcOAQcOASMhIiYnLgEnLgEnLgE1ETQ2Nz4BNz4BNz4BMxMzFRQWMzI2PQEzMjY1NCYrATU0JiMiBh0BIyIGFRQWM9UNGAwLFQkJDgUFBQUFBQ4JCRULDBgNAlYNGAwLFQkJDgUFBQUFBQ4JCRULDBgN/aoCVgQIBAQHAwMFAQIBAQIBBQMDBwQECAT9qgQIBAQHAwMFAQIBAQIBBQMDBwQECASAgBkSEhmAERkZEYAZEhIZgBEZGREDVQUEBQ4JCRUMCxkN/asNGQsMFQkIDgUFBQUFBQ4JCBUMCxkNAlUNGQsMFQkJDgUEBVUCAQIFAwIHBAQIBf2rBAkDBAcDAwUBAgICAgEFAwMHBAMJBAJVBQgEBAcCAwUCAQL+gIASGRkSgBkSERmAEhkZEoAZERIZAAABAOIAjQMeAskAIAAAExcHBhQXFjI/ARcWMjc2NC8BNzY0JyYiDwEnJiIHBhQX4uLiDQ0MJAzi4gwkDA0N4uINDQwkDOLiDCQMDQ0CjeLiDSMMDQ3h4Q0NDCMN4uIMIw0MDOLiDAwNIwwAAAABAAAAAQAAa5n0y18PPPUACwQAAAAAANivOVsAAAAA2K85WwAAAAADqwNVAAAACAACAAAAAAAAAAEAAAPA/8AAAAQAAAAAAAOrAAEAAAAAAAAAAAAAAAAAAAALBAAAAAAAAAAAAAAAAgAAAAQAAWIEAAFiBAAA4gQAAOIEAABVBAAAVQQAAOIAAAAAAAoAFAAeAEQAagCqAOoBngJkApoAAQAAAAsAigADAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAA4ArgABAAAAAAABAAcAAAABAAAAAAACAAcAYAABAAAAAAADAAcANgABAAAAAAAEAAcAdQABAAAAAAAFAAsAFQABAAAAAAAGAAcASwABAAAAAAAKABoAigADAAEECQABAA4ABwADAAEECQACAA4AZwADAAEECQADAA4APQADAAEECQAEAA4AfAADAAEECQAFABYAIAADAAEECQAGAA4AUgADAAEECQAKADQApGZjaWNvbnMAZgBjAGkAYwBvAG4Ac1ZlcnNpb24gMS4wAFYAZQByAHMAaQBvAG4AIAAxAC4AMGZjaWNvbnMAZgBjAGkAYwBvAG4Ac2ZjaWNvbnMAZgBjAGkAYwBvAG4Ac1JlZ3VsYXIAUgBlAGcAdQBsAGEAcmZjaWNvbnMAZgBjAGkAYwBvAG4Ac0ZvbnQgZ2VuZXJhdGVkIGJ5IEljb01vb24uAEYAbwBuAHQAIABnAGUAbgBlAHIAYQB0AGUAZAAgAGIAeQAgAEkAYwBvAE0AbwBvAG4ALgAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=") format("truetype")}.fc-icon{speak:none;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;display:inline-block;font-family:fcicons!important;font-style:normal;font-variant:normal;font-weight:400;height:1em;line-height:1;text-align:center;text-transform:none;-webkit-user-select:none;-moz-user-select:none;user-select:none;width:1em}.fc-icon-chevron-left:before{content:"\\e900"}.fc-icon-chevron-right:before{content:"\\e901"}.fc-icon-chevrons-left:before{content:"\\e902"}.fc-icon-chevrons-right:before{content:"\\e903"}.fc-icon-minus-square:before{content:"\\e904"}.fc-icon-plus-square:before{content:"\\e905"}.fc-icon-x:before{content:"\\e906"}.fc .fc-button{border-radius:0;font-family:inherit;font-size:inherit;line-height:inherit;margin:0;overflow:visible;text-transform:none}.fc .fc-button:focus{outline:1px dotted;outline:5px auto -webkit-focus-ring-color}.fc .fc-button{-webkit-appearance:button}.fc .fc-button:not(:disabled){cursor:pointer}.fc .fc-button{background-color:transparent;border:1px solid transparent;border-radius:.25em;display:inline-block;font-size:1em;font-weight:400;line-height:1.5;padding:.4em .65em;text-align:center;-webkit-user-select:none;-moz-user-select:none;user-select:none;vertical-align:middle}.fc .fc-button:hover{text-decoration:none}.fc .fc-button:focus{box-shadow:0 0 0 .2rem rgba(44,62,80,.25);outline:0}.fc .fc-button:disabled{opacity:.65}.fc .fc-button-primary{background-color:var(--fc-button-bg-color);border-color:var(--fc-button-border-color);color:var(--fc-button-text-color)}.fc .fc-button-primary:hover{background-color:var(--fc-button-hover-bg-color);border-color:var(--fc-button-hover-border-color);color:var(--fc-button-text-color)}.fc .fc-button-primary:disabled{background-color:var(--fc-button-bg-color);border-color:var(--fc-button-border-color);color:var(--fc-button-text-color)}.fc .fc-button-primary:focus{box-shadow:0 0 0 .2rem rgba(76,91,106,.5)}.fc .fc-button-primary:not(:disabled).fc-button-active,.fc .fc-button-primary:not(:disabled):active{background-color:var(--fc-button-active-bg-color);border-color:var(--fc-button-active-border-color);color:var(--fc-button-text-color)}.fc .fc-button-primary:not(:disabled).fc-button-active:focus,.fc .fc-button-primary:not(:disabled):active:focus{box-shadow:0 0 0 .2rem rgba(76,91,106,.5)}.fc .fc-button .fc-icon{font-size:1.5em;vertical-align:middle}.fc .fc-button-group{display:inline-flex;position:relative;vertical-align:middle}.fc .fc-button-group>.fc-button{flex:1 1 auto;position:relative}.fc .fc-button-group>.fc-button.fc-button-active,.fc .fc-button-group>.fc-button:active,.fc .fc-button-group>.fc-button:focus,.fc .fc-button-group>.fc-button:hover{z-index:1}.fc-direction-ltr .fc-button-group>.fc-button:not(:first-child){border-bottom-left-radius:0;border-top-left-radius:0;margin-left:-1px}.fc-direction-ltr .fc-button-group>.fc-button:not(:last-child){border-bottom-right-radius:0;border-top-right-radius:0}.fc-direction-rtl .fc-button-group>.fc-button:not(:first-child){border-bottom-right-radius:0;border-top-right-radius:0;margin-right:-1px}.fc-direction-rtl .fc-button-group>.fc-button:not(:last-child){border-bottom-left-radius:0;border-top-left-radius:0}.fc .fc-toolbar{align-items:center;display:flex;justify-content:space-between}.fc .fc-toolbar.fc-header-toolbar{margin-bottom:1.5em}.fc .fc-toolbar.fc-footer-toolbar{margin-top:1.5em}.fc .fc-toolbar-title{font-size:1.75em;margin:0}.fc-direction-ltr .fc-toolbar>*>:not(:first-child){margin-left:.75em}.fc-direction-rtl .fc-toolbar>*>:not(:first-child){margin-right:.75em}.fc-direction-rtl .fc-toolbar-ltr{flex-direction:row-reverse}.fc .fc-scroller{-webkit-overflow-scrolling:touch;position:relative}.fc .fc-scroller-liquid{height:100%}.fc .fc-scroller-liquid-absolute{bottom:0;left:0;position:absolute;right:0;top:0}.fc .fc-scroller-harness{direction:ltr;overflow:hidden;position:relative}.fc .fc-scroller-harness-liquid{height:100%}.fc-direction-rtl .fc-scroller-harness>.fc-scroller{direction:rtl}.fc-theme-standard .fc-scrollgrid{border:1px solid var(--fc-border-color)}.fc .fc-scrollgrid,.fc .fc-scrollgrid table{table-layout:fixed;width:100%}.fc .fc-scrollgrid table{border-left-style:hidden;border-right-style:hidden;border-top-style:hidden}.fc .fc-scrollgrid{border-bottom-width:0;border-collapse:separate;border-right-width:0}.fc .fc-scrollgrid-liquid{height:100%}.fc .fc-scrollgrid-section,.fc .fc-scrollgrid-section table,.fc .fc-scrollgrid-section>td{height:1px}.fc .fc-scrollgrid-section-liquid>td{height:100%}.fc .fc-scrollgrid-section>*{border-left-width:0;border-top-width:0}.fc .fc-scrollgrid-section-footer>*,.fc .fc-scrollgrid-section-header>*{border-bottom-width:0}.fc .fc-scrollgrid-section-body table,.fc .fc-scrollgrid-section-footer table{border-bottom-style:hidden}.fc .fc-scrollgrid-section-sticky>*{background:var(--fc-page-bg-color);position:sticky;z-index:3}.fc .fc-scrollgrid-section-header.fc-scrollgrid-section-sticky>*{top:0}.fc .fc-scrollgrid-section-footer.fc-scrollgrid-section-sticky>*{bottom:0}.fc .fc-scrollgrid-sticky-shim{height:1px;margin-bottom:-1px}.fc-sticky{position:sticky}.fc .fc-view-harness{flex-grow:1;position:relative}.fc .fc-view-harness-active>.fc-view{bottom:0;left:0;position:absolute;right:0;top:0}.fc .fc-col-header-cell-cushion{display:inline-block;padding:2px 4px}.fc .fc-bg-event,.fc .fc-highlight,.fc .fc-non-business{bottom:0;left:0;position:absolute;right:0;top:0}.fc .fc-non-business{background:var(--fc-non-business-color)}.fc .fc-bg-event{background:var(--fc-bg-event-color);opacity:var(--fc-bg-event-opacity)}.fc .fc-bg-event .fc-event-title{font-size:var(--fc-small-font-size);font-style:italic;margin:.5em}.fc .fc-highlight{background:var(--fc-highlight-color)}.fc .fc-cell-shaded,.fc .fc-day-disabled{background:var(--fc-neutral-bg-color)}a.fc-event,a.fc-event:hover{text-decoration:none}.fc-event.fc-event-draggable,.fc-event[href]{cursor:pointer}.fc-event .fc-event-main{position:relative;z-index:2}.fc-event-dragging:not(.fc-event-selected){opacity:.75}.fc-event-dragging.fc-event-selected{box-shadow:0 2px 7px rgba(0,0,0,.3)}.fc-event .fc-event-resizer{display:none;position:absolute;z-index:4}.fc-event-selected .fc-event-resizer,.fc-event:hover .fc-event-resizer{display:block}.fc-event-selected .fc-event-resizer{background:var(--fc-page-bg-color);border-color:inherit;border-radius:calc(var(--fc-event-resizer-dot-total-width)/2);border-style:solid;border-width:var(--fc-event-resizer-dot-border-width);height:var(--fc-event-resizer-dot-total-width);width:var(--fc-event-resizer-dot-total-width)}.fc-event-selected .fc-event-resizer:before{bottom:-20px;content:"";left:-20px;position:absolute;right:-20px;top:-20px}.fc-event-selected,.fc-event:focus{box-shadow:0 2px 5px rgba(0,0,0,.2)}.fc-event-selected:before,.fc-event:focus:before{bottom:0;content:"";left:0;position:absolute;right:0;top:0;z-index:3}.fc-event-selected:after,.fc-event:focus:after{background:var(--fc-event-selected-overlay-color);bottom:-1px;content:"";left:-1px;position:absolute;right:-1px;top:-1px;z-index:1}.fc-h-event{background-color:var(--fc-event-bg-color);border:1px solid var(--fc-event-border-color);display:block}.fc-h-event .fc-event-main{color:var(--fc-event-text-color)}.fc-h-event .fc-event-main-frame{display:flex}.fc-h-event .fc-event-time{max-width:100%;overflow:hidden}.fc-h-event .fc-event-title-container{flex-grow:1;flex-shrink:1;min-width:0}.fc-h-event .fc-event-title{display:inline-block;left:0;max-width:100%;overflow:hidden;right:0;vertical-align:top}.fc-h-event.fc-event-selected:before{bottom:-10px;top:-10px}.fc-direction-ltr .fc-daygrid-block-event:not(.fc-event-start),.fc-direction-rtl .fc-daygrid-block-event:not(.fc-event-end){border-bottom-left-radius:0;border-left-width:0;border-top-left-radius:0}.fc-direction-ltr .fc-daygrid-block-event:not(.fc-event-end),.fc-direction-rtl .fc-daygrid-block-event:not(.fc-event-start){border-bottom-right-radius:0;border-right-width:0;border-top-right-radius:0}.fc-h-event:not(.fc-event-selected) .fc-event-resizer{bottom:0;top:0;width:var(--fc-event-resizer-thickness)}.fc-direction-ltr .fc-h-event:not(.fc-event-selected) .fc-event-resizer-start,.fc-direction-rtl .fc-h-event:not(.fc-event-selected) .fc-event-resizer-end{cursor:w-resize;left:calc(var(--fc-event-resizer-thickness)*-.5)}.fc-direction-ltr .fc-h-event:not(.fc-event-selected) .fc-event-resizer-end,.fc-direction-rtl .fc-h-event:not(.fc-event-selected) .fc-event-resizer-start{cursor:e-resize;right:calc(var(--fc-event-resizer-thickness)*-.5)}.fc-h-event.fc-event-selected .fc-event-resizer{margin-top:calc(var(--fc-event-resizer-dot-total-width)*-.5);top:50%}.fc-direction-ltr .fc-h-event.fc-event-selected .fc-event-resizer-start,.fc-direction-rtl .fc-h-event.fc-event-selected .fc-event-resizer-end{left:calc(var(--fc-event-resizer-dot-total-width)*-.5)}.fc-direction-ltr .fc-h-event.fc-event-selected .fc-event-resizer-end,.fc-direction-rtl .fc-h-event.fc-event-selected .fc-event-resizer-start{right:calc(var(--fc-event-resizer-dot-total-width)*-.5)}.fc .fc-popover{box-shadow:0 2px 6px rgba(0,0,0,.15);position:absolute;z-index:9999}.fc .fc-popover-header{align-items:center;display:flex;flex-direction:row;justify-content:space-between;padding:3px 4px}.fc .fc-popover-title{margin:0 2px}.fc .fc-popover-close{cursor:pointer;font-size:1.1em;opacity:.65}.fc-theme-standard .fc-popover{background:var(--fc-page-bg-color);border:1px solid var(--fc-border-color)}.fc-theme-standard .fc-popover-header{background:var(--fc-neutral-bg-color)}';
  injectStyles(css_248z);
  var DelayedRunner = class {
    constructor(drainedOption) {
      this.drainedOption = drainedOption;
      this.isRunning = false;
      this.isDirty = false;
      this.pauseDepths = {};
      this.timeoutId = 0;
    }
    request(delay) {
      this.isDirty = true;
      if (!this.isPaused()) {
        this.clearTimeout();
        if (delay == null) {
          this.tryDrain();
        } else {
          this.timeoutId = setTimeout(
            // NOT OPTIMAL! TODO: look at debounce
            this.tryDrain.bind(this),
            delay
          );
        }
      }
    }
    pause(scope = "") {
      let { pauseDepths } = this;
      pauseDepths[scope] = (pauseDepths[scope] || 0) + 1;
      this.clearTimeout();
    }
    resume(scope = "", force) {
      let { pauseDepths } = this;
      if (scope in pauseDepths) {
        if (force) {
          delete pauseDepths[scope];
        } else {
          pauseDepths[scope] -= 1;
          let depth = pauseDepths[scope];
          if (depth <= 0) {
            delete pauseDepths[scope];
          }
        }
        this.tryDrain();
      }
    }
    isPaused() {
      return Object.keys(this.pauseDepths).length;
    }
    tryDrain() {
      if (!this.isRunning && !this.isPaused()) {
        this.isRunning = true;
        while (this.isDirty) {
          this.isDirty = false;
          this.drained();
        }
        this.isRunning = false;
      }
    }
    clear() {
      this.clearTimeout();
      this.isDirty = false;
      this.pauseDepths = {};
    }
    clearTimeout() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = 0;
      }
    }
    drained() {
      if (this.drainedOption) {
        this.drainedOption();
      }
    }
  };
  function removeElement(el) {
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }
  function elementClosest(el, selector) {
    if (el.closest) {
      return el.closest(selector);
    }
    if (!document.documentElement.contains(el)) {
      return null;
    }
    do {
      if (elementMatches(el, selector)) {
        return el;
      }
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  }
  function elementMatches(el, selector) {
    let method = el.matches || el.matchesSelector || el.msMatchesSelector;
    return method.call(el, selector);
  }
  function findElements(container, selector) {
    let containers = container instanceof HTMLElement ? [container] : container;
    let allMatches = [];
    for (let i3 = 0; i3 < containers.length; i3 += 1) {
      let matches = containers[i3].querySelectorAll(selector);
      for (let j4 = 0; j4 < matches.length; j4 += 1) {
        allMatches.push(matches[j4]);
      }
    }
    return allMatches;
  }
  var PIXEL_PROP_RE = /(top|left|right|bottom|width|height)$/i;
  function applyStyle(el, props) {
    for (let propName in props) {
      applyStyleProp(el, propName, props[propName]);
    }
  }
  function applyStyleProp(el, name, val) {
    if (val == null) {
      el.style[name] = "";
    } else if (typeof val === "number" && PIXEL_PROP_RE.test(name)) {
      el.style[name] = `${val}px`;
    } else {
      el.style[name] = val;
    }
  }
  function getEventTargetViaRoot(ev) {
    var _a, _b;
    return (_b = (_a = ev.composedPath) === null || _a === void 0 ? void 0 : _a.call(ev)[0]) !== null && _b !== void 0 ? _b : ev.target;
  }
  var guid$1 = 0;
  function getUniqueDomId() {
    guid$1 += 1;
    return "fc-dom-" + guid$1;
  }
  function buildDelegationHandler(selector, handler) {
    return (ev) => {
      let matchedChild = elementClosest(ev.target, selector);
      if (matchedChild) {
        handler.call(matchedChild, ev, matchedChild);
      }
    };
  }
  function listenBySelector(container, eventType, selector, handler) {
    let attachedHandler = buildDelegationHandler(selector, handler);
    container.addEventListener(eventType, attachedHandler);
    return () => {
      container.removeEventListener(eventType, attachedHandler);
    };
  }
  function listenToHoverBySelector(container, selector, onMouseEnter, onMouseLeave) {
    let currentMatchedChild;
    return listenBySelector(container, "mouseover", selector, (mouseOverEv, matchedChild) => {
      if (matchedChild !== currentMatchedChild) {
        currentMatchedChild = matchedChild;
        onMouseEnter(mouseOverEv, matchedChild);
        let realOnMouseLeave = (mouseLeaveEv) => {
          currentMatchedChild = null;
          onMouseLeave(mouseLeaveEv, matchedChild);
          matchedChild.removeEventListener("mouseleave", realOnMouseLeave);
        };
        matchedChild.addEventListener("mouseleave", realOnMouseLeave);
      }
    });
  }
  function createAriaClickAttrs(handler) {
    return Object.assign({ onClick: handler }, createAriaKeyboardAttrs(handler));
  }
  function createAriaKeyboardAttrs(handler) {
    return {
      tabIndex: 0,
      onKeyDown(ev) {
        if (ev.key === "Enter" || ev.key === " ") {
          handler(ev);
          ev.preventDefault();
        }
      }
    };
  }
  var guidNumber = 0;
  function guid() {
    guidNumber += 1;
    return String(guidNumber);
  }
  function parseFieldSpecs(input) {
    let specs = [];
    let tokens = [];
    let i3;
    let token;
    if (typeof input === "string") {
      tokens = input.split(/\s*,\s*/);
    } else if (typeof input === "function") {
      tokens = [input];
    } else if (Array.isArray(input)) {
      tokens = input;
    }
    for (i3 = 0; i3 < tokens.length; i3 += 1) {
      token = tokens[i3];
      if (typeof token === "string") {
        specs.push(token.charAt(0) === "-" ? { field: token.substring(1), order: -1 } : { field: token, order: 1 });
      } else if (typeof token === "function") {
        specs.push({ func: token });
      }
    }
    return specs;
  }
  function compareByFieldSpecs(obj0, obj1, fieldSpecs) {
    let i3;
    let cmp;
    for (i3 = 0; i3 < fieldSpecs.length; i3 += 1) {
      cmp = compareByFieldSpec(obj0, obj1, fieldSpecs[i3]);
      if (cmp) {
        return cmp;
      }
    }
    return 0;
  }
  function compareByFieldSpec(obj0, obj1, fieldSpec) {
    if (fieldSpec.func) {
      return fieldSpec.func(obj0, obj1);
    }
    return flexibleCompare(obj0[fieldSpec.field], obj1[fieldSpec.field]) * (fieldSpec.order || 1);
  }
  function flexibleCompare(a3, b3) {
    if (!a3 && !b3) {
      return 0;
    }
    if (b3 == null) {
      return -1;
    }
    if (a3 == null) {
      return 1;
    }
    if (typeof a3 === "string" || typeof b3 === "string") {
      return String(a3).localeCompare(String(b3));
    }
    return a3 - b3;
  }
  function padStart(val, len) {
    let s3 = String(val);
    return "000".substr(0, len - s3.length) + s3;
  }
  function formatWithOrdinals(formatter, args, fallbackText) {
    if (typeof formatter === "function") {
      return formatter(...args);
    }
    if (typeof formatter === "string") {
      return args.reduce((str, arg, index6) => str.replace("$" + index6, arg || ""), formatter);
    }
    return fallbackText;
  }
  function isInt(n2) {
    return n2 % 1 === 0;
  }
  function computeSmallestCellWidth(cellEl) {
    let allWidthEl = cellEl.querySelector(".fc-scrollgrid-shrink-frame");
    let contentWidthEl = cellEl.querySelector(".fc-scrollgrid-shrink-cushion");
    if (!allWidthEl) {
      throw new Error("needs fc-scrollgrid-shrink-frame className");
    }
    if (!contentWidthEl) {
      throw new Error("needs fc-scrollgrid-shrink-cushion className");
    }
    return cellEl.getBoundingClientRect().width - allWidthEl.getBoundingClientRect().width + // the cell padding+border
    contentWidthEl.getBoundingClientRect().width;
  }
  var INTERNAL_UNITS = ["years", "months", "days", "milliseconds"];
  var PARSE_RE = /^(-?)(?:(\d+)\.)?(\d+):(\d\d)(?::(\d\d)(?:\.(\d\d\d))?)?/;
  function createDuration(input, unit) {
    if (typeof input === "string") {
      return parseString(input);
    }
    if (typeof input === "object" && input) {
      return parseObject(input);
    }
    if (typeof input === "number") {
      return parseObject({ [unit || "milliseconds"]: input });
    }
    return null;
  }
  function parseString(s3) {
    let m3 = PARSE_RE.exec(s3);
    if (m3) {
      let sign = m3[1] ? -1 : 1;
      return {
        years: 0,
        months: 0,
        days: sign * (m3[2] ? parseInt(m3[2], 10) : 0),
        milliseconds: sign * ((m3[3] ? parseInt(m3[3], 10) : 0) * 60 * 60 * 1e3 + // hours
        (m3[4] ? parseInt(m3[4], 10) : 0) * 60 * 1e3 + // minutes
        (m3[5] ? parseInt(m3[5], 10) : 0) * 1e3 + // seconds
        (m3[6] ? parseInt(m3[6], 10) : 0))
      };
    }
    return null;
  }
  function parseObject(obj) {
    let duration = {
      years: obj.years || obj.year || 0,
      months: obj.months || obj.month || 0,
      days: obj.days || obj.day || 0,
      milliseconds: (obj.hours || obj.hour || 0) * 60 * 60 * 1e3 + // hours
      (obj.minutes || obj.minute || 0) * 60 * 1e3 + // minutes
      (obj.seconds || obj.second || 0) * 1e3 + // seconds
      (obj.milliseconds || obj.millisecond || obj.ms || 0)
      // ms
    };
    let weeks = obj.weeks || obj.week;
    if (weeks) {
      duration.days += weeks * 7;
      duration.specifiedWeeks = true;
    }
    return duration;
  }
  function durationsEqual(d0, d1) {
    return d0.years === d1.years && d0.months === d1.months && d0.days === d1.days && d0.milliseconds === d1.milliseconds;
  }
  function addDurations(d0, d1) {
    return {
      years: d0.years + d1.years,
      months: d0.months + d1.months,
      days: d0.days + d1.days,
      milliseconds: d0.milliseconds + d1.milliseconds
    };
  }
  function subtractDurations(d1, d0) {
    return {
      years: d1.years - d0.years,
      months: d1.months - d0.months,
      days: d1.days - d0.days,
      milliseconds: d1.milliseconds - d0.milliseconds
    };
  }
  function multiplyDuration(d2, n2) {
    return {
      years: d2.years * n2,
      months: d2.months * n2,
      days: d2.days * n2,
      milliseconds: d2.milliseconds * n2
    };
  }
  function asRoughYears(dur) {
    return asRoughDays(dur) / 365;
  }
  function asRoughMonths(dur) {
    return asRoughDays(dur) / 30;
  }
  function asRoughDays(dur) {
    return asRoughMs(dur) / 864e5;
  }
  function asRoughMs(dur) {
    return dur.years * (365 * 864e5) + dur.months * (30 * 864e5) + dur.days * 864e5 + dur.milliseconds;
  }
  function wholeDivideDurations(numerator, denominator) {
    let res = null;
    for (let i3 = 0; i3 < INTERNAL_UNITS.length; i3 += 1) {
      let unit = INTERNAL_UNITS[i3];
      if (denominator[unit]) {
        let localRes = numerator[unit] / denominator[unit];
        if (!isInt(localRes) || res !== null && res !== localRes) {
          return null;
        }
        res = localRes;
      } else if (numerator[unit]) {
        return null;
      }
    }
    return res;
  }
  function greatestDurationDenominator(dur) {
    let ms = dur.milliseconds;
    if (ms) {
      if (ms % 1e3 !== 0) {
        return { unit: "millisecond", value: ms };
      }
      if (ms % (1e3 * 60) !== 0) {
        return { unit: "second", value: ms / 1e3 };
      }
      if (ms % (1e3 * 60 * 60) !== 0) {
        return { unit: "minute", value: ms / (1e3 * 60) };
      }
      if (ms) {
        return { unit: "hour", value: ms / (1e3 * 60 * 60) };
      }
    }
    if (dur.days) {
      if (dur.specifiedWeeks && dur.days % 7 === 0) {
        return { unit: "week", value: dur.days / 7 };
      }
      return { unit: "day", value: dur.days };
    }
    if (dur.months) {
      return { unit: "month", value: dur.months };
    }
    if (dur.years) {
      return { unit: "year", value: dur.years };
    }
    return { unit: "millisecond", value: 0 };
  }
  function isArraysEqual(a0, a1, equalityFunc) {
    if (a0 === a1) {
      return true;
    }
    let len = a0.length;
    let i3;
    if (len !== a1.length) {
      return false;
    }
    for (i3 = 0; i3 < len; i3 += 1) {
      if (!(equalityFunc ? equalityFunc(a0[i3], a1[i3]) : a0[i3] === a1[i3])) {
        return false;
      }
    }
    return true;
  }
  var DAY_IDS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  function addWeeks(m3, n2) {
    let a3 = dateToUtcArray(m3);
    a3[2] += n2 * 7;
    return arrayToUtcDate(a3);
  }
  function addDays(m3, n2) {
    let a3 = dateToUtcArray(m3);
    a3[2] += n2;
    return arrayToUtcDate(a3);
  }
  function addMs(m3, n2) {
    let a3 = dateToUtcArray(m3);
    a3[6] += n2;
    return arrayToUtcDate(a3);
  }
  function diffWeeks(m0, m1) {
    return diffDays(m0, m1) / 7;
  }
  function diffDays(m0, m1) {
    return (m1.valueOf() - m0.valueOf()) / (1e3 * 60 * 60 * 24);
  }
  function diffHours(m0, m1) {
    return (m1.valueOf() - m0.valueOf()) / (1e3 * 60 * 60);
  }
  function diffMinutes(m0, m1) {
    return (m1.valueOf() - m0.valueOf()) / (1e3 * 60);
  }
  function diffSeconds(m0, m1) {
    return (m1.valueOf() - m0.valueOf()) / 1e3;
  }
  function diffDayAndTime(m0, m1) {
    let m0day = startOfDay(m0);
    let m1day = startOfDay(m1);
    return {
      years: 0,
      months: 0,
      days: Math.round(diffDays(m0day, m1day)),
      milliseconds: m1.valueOf() - m1day.valueOf() - (m0.valueOf() - m0day.valueOf())
    };
  }
  function diffWholeWeeks(m0, m1) {
    let d2 = diffWholeDays(m0, m1);
    if (d2 !== null && d2 % 7 === 0) {
      return d2 / 7;
    }
    return null;
  }
  function diffWholeDays(m0, m1) {
    if (timeAsMs(m0) === timeAsMs(m1)) {
      return Math.round(diffDays(m0, m1));
    }
    return null;
  }
  function startOfDay(m3) {
    return arrayToUtcDate([
      m3.getUTCFullYear(),
      m3.getUTCMonth(),
      m3.getUTCDate()
    ]);
  }
  function startOfHour(m3) {
    return arrayToUtcDate([
      m3.getUTCFullYear(),
      m3.getUTCMonth(),
      m3.getUTCDate(),
      m3.getUTCHours()
    ]);
  }
  function startOfMinute(m3) {
    return arrayToUtcDate([
      m3.getUTCFullYear(),
      m3.getUTCMonth(),
      m3.getUTCDate(),
      m3.getUTCHours(),
      m3.getUTCMinutes()
    ]);
  }
  function startOfSecond(m3) {
    return arrayToUtcDate([
      m3.getUTCFullYear(),
      m3.getUTCMonth(),
      m3.getUTCDate(),
      m3.getUTCHours(),
      m3.getUTCMinutes(),
      m3.getUTCSeconds()
    ]);
  }
  function weekOfYear(marker, dow, doy) {
    let y3 = marker.getUTCFullYear();
    let w4 = weekOfGivenYear(marker, y3, dow, doy);
    if (w4 < 1) {
      return weekOfGivenYear(marker, y3 - 1, dow, doy);
    }
    let nextW = weekOfGivenYear(marker, y3 + 1, dow, doy);
    if (nextW >= 1) {
      return Math.min(w4, nextW);
    }
    return w4;
  }
  function weekOfGivenYear(marker, year, dow, doy) {
    let firstWeekStart = arrayToUtcDate([year, 0, 1 + firstWeekOffset(year, dow, doy)]);
    let dayStart = startOfDay(marker);
    let days = Math.round(diffDays(firstWeekStart, dayStart));
    return Math.floor(days / 7) + 1;
  }
  function firstWeekOffset(year, dow, doy) {
    let fwd = 7 + dow - doy;
    let fwdlw = (7 + arrayToUtcDate([year, 0, fwd]).getUTCDay() - dow) % 7;
    return -fwdlw + fwd - 1;
  }
  function dateToLocalArray(date) {
    return [
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    ];
  }
  function arrayToLocalDate(a3) {
    return new Date(
      a3[0],
      a3[1] || 0,
      a3[2] == null ? 1 : a3[2],
      // day of month
      a3[3] || 0,
      a3[4] || 0,
      a3[5] || 0
    );
  }
  function dateToUtcArray(date) {
    return [
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds()
    ];
  }
  function arrayToUtcDate(a3) {
    if (a3.length === 1) {
      a3 = a3.concat([0]);
    }
    return new Date(Date.UTC(...a3));
  }
  function isValidDate(m3) {
    return !isNaN(m3.valueOf());
  }
  function timeAsMs(m3) {
    return m3.getUTCHours() * 1e3 * 60 * 60 + m3.getUTCMinutes() * 1e3 * 60 + m3.getUTCSeconds() * 1e3 + m3.getUTCMilliseconds();
  }
  function buildIsoString(marker, timeZoneOffset, stripZeroTime = false) {
    let s3 = marker.toISOString();
    s3 = s3.replace(".000", "");
    if (stripZeroTime) {
      s3 = s3.replace("T00:00:00Z", "");
    }
    if (s3.length > 10) {
      if (timeZoneOffset == null) {
        s3 = s3.replace("Z", "");
      } else if (timeZoneOffset !== 0) {
        s3 = s3.replace("Z", formatTimeZoneOffset(timeZoneOffset, true));
      }
    }
    return s3;
  }
  function formatDayString(marker) {
    return marker.toISOString().replace(/T.*$/, "");
  }
  function formatIsoMonthStr(marker) {
    return marker.toISOString().match(/^\d{4}-\d{2}/)[0];
  }
  function formatIsoTimeString(marker) {
    return padStart(marker.getUTCHours(), 2) + ":" + padStart(marker.getUTCMinutes(), 2) + ":" + padStart(marker.getUTCSeconds(), 2);
  }
  function formatTimeZoneOffset(minutes, doIso = false) {
    let sign = minutes < 0 ? "-" : "+";
    let abs = Math.abs(minutes);
    let hours = Math.floor(abs / 60);
    let mins = Math.round(abs % 60);
    if (doIso) {
      return `${sign + padStart(hours, 2)}:${padStart(mins, 2)}`;
    }
    return `GMT${sign}${hours}${mins ? `:${padStart(mins, 2)}` : ""}`;
  }
  function memoize(workerFunc, resEquality, teardownFunc) {
    let currentArgs;
    let currentRes;
    return function(...newArgs) {
      if (!currentArgs) {
        currentRes = workerFunc.apply(this, newArgs);
      } else if (!isArraysEqual(currentArgs, newArgs)) {
        if (teardownFunc) {
          teardownFunc(currentRes);
        }
        let res = workerFunc.apply(this, newArgs);
        if (!resEquality || !resEquality(res, currentRes)) {
          currentRes = res;
        }
      }
      currentArgs = newArgs;
      return currentRes;
    };
  }
  function memoizeObjArg(workerFunc, resEquality, teardownFunc) {
    let currentArg;
    let currentRes;
    return (newArg) => {
      if (!currentArg) {
        currentRes = workerFunc.call(this, newArg);
      } else if (!isPropsEqual(currentArg, newArg)) {
        if (teardownFunc) {
          teardownFunc(currentRes);
        }
        let res = workerFunc.call(this, newArg);
        if (!resEquality || !resEquality(res, currentRes)) {
          currentRes = res;
        }
      }
      currentArg = newArg;
      return currentRes;
    };
  }
  var EXTENDED_SETTINGS_AND_SEVERITIES = {
    week: 3,
    separator: 9,
    omitZeroMinute: 9,
    meridiem: 9,
    omitCommas: 9
  };
  var STANDARD_DATE_PROP_SEVERITIES = {
    timeZoneName: 7,
    era: 6,
    year: 5,
    month: 4,
    day: 2,
    weekday: 2,
    hour: 1,
    minute: 1,
    second: 1
  };
  var MERIDIEM_RE = /\s*([ap])\.?m\.?/i;
  var COMMA_RE = /,/g;
  var MULTI_SPACE_RE = /\s+/g;
  var LTR_RE = /\u200e/g;
  var UTC_RE = /UTC|GMT/;
  var NativeFormatter = class {
    constructor(formatSettings) {
      let standardDateProps = {};
      let extendedSettings = {};
      let smallestUnitNum = 9;
      for (let name in formatSettings) {
        if (name in EXTENDED_SETTINGS_AND_SEVERITIES) {
          extendedSettings[name] = formatSettings[name];
          const severity = EXTENDED_SETTINGS_AND_SEVERITIES[name];
          if (severity < 9) {
            smallestUnitNum = Math.min(EXTENDED_SETTINGS_AND_SEVERITIES[name], smallestUnitNum);
          }
        } else {
          standardDateProps[name] = formatSettings[name];
          if (name in STANDARD_DATE_PROP_SEVERITIES) {
            smallestUnitNum = Math.min(STANDARD_DATE_PROP_SEVERITIES[name], smallestUnitNum);
          }
        }
      }
      this.standardDateProps = standardDateProps;
      this.extendedSettings = extendedSettings;
      this.smallestUnitNum = smallestUnitNum;
      this.buildFormattingFunc = memoize(buildFormattingFunc);
    }
    format(date, context) {
      return this.buildFormattingFunc(this.standardDateProps, this.extendedSettings, context)(date);
    }
    formatRange(start, end, context, betterDefaultSeparator) {
      let { standardDateProps, extendedSettings } = this;
      let diffSeverity = computeMarkerDiffSeverity(start.marker, end.marker, context.calendarSystem);
      if (!diffSeverity) {
        return this.format(start, context);
      }
      let biggestUnitForPartial = diffSeverity;
      if (biggestUnitForPartial > 1 && // the two dates are different in a way that's larger scale than time
      (standardDateProps.year === "numeric" || standardDateProps.year === "2-digit") && (standardDateProps.month === "numeric" || standardDateProps.month === "2-digit") && (standardDateProps.day === "numeric" || standardDateProps.day === "2-digit")) {
        biggestUnitForPartial = 1;
      }
      let full0 = this.format(start, context);
      let full1 = this.format(end, context);
      if (full0 === full1) {
        return full0;
      }
      let partialDateProps = computePartialFormattingOptions(standardDateProps, biggestUnitForPartial);
      let partialFormattingFunc = buildFormattingFunc(partialDateProps, extendedSettings, context);
      let partial0 = partialFormattingFunc(start);
      let partial1 = partialFormattingFunc(end);
      let insertion = findCommonInsertion(full0, partial0, full1, partial1);
      let separator = extendedSettings.separator || betterDefaultSeparator || context.defaultSeparator || "";
      if (insertion) {
        return insertion.before + partial0 + separator + partial1 + insertion.after;
      }
      return full0 + separator + full1;
    }
    getSmallestUnit() {
      switch (this.smallestUnitNum) {
        case 7:
        case 6:
        case 5:
          return "year";
        case 4:
          return "month";
        case 3:
          return "week";
        case 2:
          return "day";
        default:
          return "time";
      }
    }
  };
  function buildFormattingFunc(standardDateProps, extendedSettings, context) {
    let standardDatePropCnt = Object.keys(standardDateProps).length;
    if (standardDatePropCnt === 1 && standardDateProps.timeZoneName === "short") {
      return (date) => formatTimeZoneOffset(date.timeZoneOffset);
    }
    if (standardDatePropCnt === 0 && extendedSettings.week) {
      return (date) => formatWeekNumber(context.computeWeekNumber(date.marker), context.weekText, context.weekTextLong, context.locale, extendedSettings.week);
    }
    return buildNativeFormattingFunc(standardDateProps, extendedSettings, context);
  }
  function buildNativeFormattingFunc(standardDateProps, extendedSettings, context) {
    standardDateProps = Object.assign({}, standardDateProps);
    extendedSettings = Object.assign({}, extendedSettings);
    sanitizeSettings(standardDateProps, extendedSettings);
    standardDateProps.timeZone = "UTC";
    let normalFormat = new Intl.DateTimeFormat(context.locale.codes, standardDateProps);
    let zeroFormat;
    if (extendedSettings.omitZeroMinute) {
      let zeroProps = Object.assign({}, standardDateProps);
      delete zeroProps.minute;
      zeroFormat = new Intl.DateTimeFormat(context.locale.codes, zeroProps);
    }
    return (date) => {
      let { marker } = date;
      let format;
      if (zeroFormat && !marker.getUTCMinutes()) {
        format = zeroFormat;
      } else {
        format = normalFormat;
      }
      let s3 = format.format(marker);
      return postProcess(s3, date, standardDateProps, extendedSettings, context);
    };
  }
  function sanitizeSettings(standardDateProps, extendedSettings) {
    if (standardDateProps.timeZoneName) {
      if (!standardDateProps.hour) {
        standardDateProps.hour = "2-digit";
      }
      if (!standardDateProps.minute) {
        standardDateProps.minute = "2-digit";
      }
    }
    if (standardDateProps.timeZoneName === "long") {
      standardDateProps.timeZoneName = "short";
    }
    if (extendedSettings.omitZeroMinute && (standardDateProps.second || standardDateProps.millisecond)) {
      delete extendedSettings.omitZeroMinute;
    }
  }
  function postProcess(s3, date, standardDateProps, extendedSettings, context) {
    s3 = s3.replace(LTR_RE, "");
    if (standardDateProps.timeZoneName === "short") {
      s3 = injectTzoStr(s3, context.timeZone === "UTC" || date.timeZoneOffset == null ? "UTC" : (
        // important to normalize for IE, which does "GMT"
        formatTimeZoneOffset(date.timeZoneOffset)
      ));
    }
    if (extendedSettings.omitCommas) {
      s3 = s3.replace(COMMA_RE, "").trim();
    }
    if (extendedSettings.omitZeroMinute) {
      s3 = s3.replace(":00", "");
    }
    if (extendedSettings.meridiem === false) {
      s3 = s3.replace(MERIDIEM_RE, "").trim();
    } else if (extendedSettings.meridiem === "narrow") {
      s3 = s3.replace(MERIDIEM_RE, (m0, m1) => m1.toLocaleLowerCase());
    } else if (extendedSettings.meridiem === "short") {
      s3 = s3.replace(MERIDIEM_RE, (m0, m1) => `${m1.toLocaleLowerCase()}m`);
    } else if (extendedSettings.meridiem === "lowercase") {
      s3 = s3.replace(MERIDIEM_RE, (m0) => m0.toLocaleLowerCase());
    }
    s3 = s3.replace(MULTI_SPACE_RE, " ");
    s3 = s3.trim();
    return s3;
  }
  function injectTzoStr(s3, tzoStr) {
    let replaced = false;
    s3 = s3.replace(UTC_RE, () => {
      replaced = true;
      return tzoStr;
    });
    if (!replaced) {
      s3 += ` ${tzoStr}`;
    }
    return s3;
  }
  function formatWeekNumber(num, weekText, weekTextLong, locale, display) {
    let parts = [];
    if (display === "long") {
      parts.push(weekTextLong);
    } else if (display === "short" || display === "narrow") {
      parts.push(weekText);
    }
    if (display === "long" || display === "short") {
      parts.push(" ");
    }
    parts.push(locale.simpleNumberFormat.format(num));
    if (locale.options.direction === "rtl") {
      parts.reverse();
    }
    return parts.join("");
  }
  function computeMarkerDiffSeverity(d0, d1, ca) {
    if (ca.getMarkerYear(d0) !== ca.getMarkerYear(d1)) {
      return 5;
    }
    if (ca.getMarkerMonth(d0) !== ca.getMarkerMonth(d1)) {
      return 4;
    }
    if (ca.getMarkerDay(d0) !== ca.getMarkerDay(d1)) {
      return 2;
    }
    if (timeAsMs(d0) !== timeAsMs(d1)) {
      return 1;
    }
    return 0;
  }
  function computePartialFormattingOptions(options, biggestUnit) {
    let partialOptions = {};
    for (let name in options) {
      if (!(name in STANDARD_DATE_PROP_SEVERITIES) || // not a date part prop (like timeZone)
      STANDARD_DATE_PROP_SEVERITIES[name] <= biggestUnit) {
        partialOptions[name] = options[name];
      }
    }
    return partialOptions;
  }
  function findCommonInsertion(full0, partial0, full1, partial1) {
    let i0 = 0;
    while (i0 < full0.length) {
      let found0 = full0.indexOf(partial0, i0);
      if (found0 === -1) {
        break;
      }
      let before0 = full0.substr(0, found0);
      i0 = found0 + partial0.length;
      let after0 = full0.substr(i0);
      let i1 = 0;
      while (i1 < full1.length) {
        let found1 = full1.indexOf(partial1, i1);
        if (found1 === -1) {
          break;
        }
        let before1 = full1.substr(0, found1);
        i1 = found1 + partial1.length;
        let after1 = full1.substr(i1);
        if (before0 === before1 && after0 === after1) {
          return {
            before: before0,
            after: after0
          };
        }
      }
    }
    return null;
  }
  function expandZonedMarker(dateInfo, calendarSystem) {
    let a3 = calendarSystem.markerToArray(dateInfo.marker);
    return {
      marker: dateInfo.marker,
      timeZoneOffset: dateInfo.timeZoneOffset,
      array: a3,
      year: a3[0],
      month: a3[1],
      day: a3[2],
      hour: a3[3],
      minute: a3[4],
      second: a3[5],
      millisecond: a3[6]
    };
  }
  function createVerboseFormattingArg(start, end, context, betterDefaultSeparator) {
    let startInfo = expandZonedMarker(start, context.calendarSystem);
    let endInfo = end ? expandZonedMarker(end, context.calendarSystem) : null;
    return {
      date: startInfo,
      start: startInfo,
      end: endInfo,
      timeZone: context.timeZone,
      localeCodes: context.locale.codes,
      defaultSeparator: betterDefaultSeparator || context.defaultSeparator
    };
  }
  var CmdFormatter = class {
    constructor(cmdStr) {
      this.cmdStr = cmdStr;
    }
    format(date, context, betterDefaultSeparator) {
      return context.cmdFormatter(this.cmdStr, createVerboseFormattingArg(date, null, context, betterDefaultSeparator));
    }
    formatRange(start, end, context, betterDefaultSeparator) {
      return context.cmdFormatter(this.cmdStr, createVerboseFormattingArg(start, end, context, betterDefaultSeparator));
    }
  };
  var FuncFormatter = class {
    constructor(func) {
      this.func = func;
    }
    format(date, context, betterDefaultSeparator) {
      return this.func(createVerboseFormattingArg(date, null, context, betterDefaultSeparator));
    }
    formatRange(start, end, context, betterDefaultSeparator) {
      return this.func(createVerboseFormattingArg(start, end, context, betterDefaultSeparator));
    }
  };
  function createFormatter(input) {
    if (typeof input === "object" && input) {
      return new NativeFormatter(input);
    }
    if (typeof input === "string") {
      return new CmdFormatter(input);
    }
    if (typeof input === "function") {
      return new FuncFormatter(input);
    }
    return null;
  }
  var BASE_OPTION_REFINERS = {
    navLinkDayClick: identity,
    navLinkWeekClick: identity,
    duration: createDuration,
    bootstrapFontAwesome: identity,
    buttonIcons: identity,
    customButtons: identity,
    defaultAllDayEventDuration: createDuration,
    defaultTimedEventDuration: createDuration,
    nextDayThreshold: createDuration,
    scrollTime: createDuration,
    scrollTimeReset: Boolean,
    slotMinTime: createDuration,
    slotMaxTime: createDuration,
    dayPopoverFormat: createFormatter,
    slotDuration: createDuration,
    snapDuration: createDuration,
    headerToolbar: identity,
    footerToolbar: identity,
    defaultRangeSeparator: String,
    titleRangeSeparator: String,
    forceEventDuration: Boolean,
    dayHeaders: Boolean,
    dayHeaderFormat: createFormatter,
    dayHeaderClassNames: identity,
    dayHeaderContent: identity,
    dayHeaderDidMount: identity,
    dayHeaderWillUnmount: identity,
    dayCellClassNames: identity,
    dayCellContent: identity,
    dayCellDidMount: identity,
    dayCellWillUnmount: identity,
    initialView: String,
    aspectRatio: Number,
    weekends: Boolean,
    weekNumberCalculation: identity,
    weekNumbers: Boolean,
    weekNumberClassNames: identity,
    weekNumberContent: identity,
    weekNumberDidMount: identity,
    weekNumberWillUnmount: identity,
    editable: Boolean,
    viewClassNames: identity,
    viewDidMount: identity,
    viewWillUnmount: identity,
    nowIndicator: Boolean,
    nowIndicatorSnap: identity,
    nowIndicatorClassNames: identity,
    nowIndicatorContent: identity,
    nowIndicatorDidMount: identity,
    nowIndicatorWillUnmount: identity,
    showNonCurrentDates: Boolean,
    lazyFetching: Boolean,
    startParam: String,
    endParam: String,
    timeZoneParam: String,
    timeZone: String,
    locales: identity,
    locale: identity,
    themeSystem: String,
    dragRevertDuration: Number,
    dragScroll: Boolean,
    allDayMaintainDuration: Boolean,
    unselectAuto: Boolean,
    dropAccept: identity,
    eventOrder: parseFieldSpecs,
    eventOrderStrict: Boolean,
    handleWindowResize: Boolean,
    windowResizeDelay: Number,
    longPressDelay: Number,
    eventDragMinDistance: Number,
    expandRows: Boolean,
    height: identity,
    contentHeight: identity,
    direction: String,
    weekNumberFormat: createFormatter,
    eventResizableFromStart: Boolean,
    displayEventTime: Boolean,
    displayEventEnd: Boolean,
    weekText: String,
    weekTextLong: String,
    progressiveEventRendering: Boolean,
    businessHours: identity,
    initialDate: identity,
    now: identity,
    eventDataTransform: identity,
    stickyHeaderDates: identity,
    stickyFooterScrollbar: identity,
    viewHeight: identity,
    defaultAllDay: Boolean,
    eventSourceFailure: identity,
    eventSourceSuccess: identity,
    eventDisplay: String,
    eventStartEditable: Boolean,
    eventDurationEditable: Boolean,
    eventOverlap: identity,
    eventConstraint: identity,
    eventAllow: identity,
    eventBackgroundColor: String,
    eventBorderColor: String,
    eventTextColor: String,
    eventColor: String,
    eventClassNames: identity,
    eventContent: identity,
    eventDidMount: identity,
    eventWillUnmount: identity,
    selectConstraint: identity,
    selectOverlap: identity,
    selectAllow: identity,
    droppable: Boolean,
    unselectCancel: String,
    slotLabelFormat: identity,
    slotLaneClassNames: identity,
    slotLaneContent: identity,
    slotLaneDidMount: identity,
    slotLaneWillUnmount: identity,
    slotLabelClassNames: identity,
    slotLabelContent: identity,
    slotLabelDidMount: identity,
    slotLabelWillUnmount: identity,
    dayMaxEvents: identity,
    dayMaxEventRows: identity,
    dayMinWidth: Number,
    slotLabelInterval: createDuration,
    allDayText: String,
    allDayClassNames: identity,
    allDayContent: identity,
    allDayDidMount: identity,
    allDayWillUnmount: identity,
    slotMinWidth: Number,
    navLinks: Boolean,
    eventTimeFormat: createFormatter,
    rerenderDelay: Number,
    moreLinkText: identity,
    moreLinkHint: identity,
    selectMinDistance: Number,
    selectable: Boolean,
    selectLongPressDelay: Number,
    eventLongPressDelay: Number,
    selectMirror: Boolean,
    eventMaxStack: Number,
    eventMinHeight: Number,
    eventMinWidth: Number,
    eventShortHeight: Number,
    slotEventOverlap: Boolean,
    plugins: identity,
    firstDay: Number,
    dayCount: Number,
    dateAlignment: String,
    dateIncrement: createDuration,
    hiddenDays: identity,
    fixedWeekCount: Boolean,
    validRange: identity,
    visibleRange: identity,
    titleFormat: identity,
    eventInteractive: Boolean,
    // only used by list-view, but languages define the value, so we need it in base options
    noEventsText: String,
    viewHint: identity,
    navLinkHint: identity,
    closeHint: String,
    timeHint: String,
    eventHint: String,
    moreLinkClick: identity,
    moreLinkClassNames: identity,
    moreLinkContent: identity,
    moreLinkDidMount: identity,
    moreLinkWillUnmount: identity,
    monthStartFormat: createFormatter,
    // for connectors
    // (can't be part of plugin system b/c must be provided at runtime)
    handleCustomRendering: identity,
    customRenderingMetaMap: identity,
    customRenderingReplaces: Boolean
  };
  var BASE_OPTION_DEFAULTS = {
    eventDisplay: "auto",
    defaultRangeSeparator: " - ",
    titleRangeSeparator: " \u2013 ",
    defaultTimedEventDuration: "01:00:00",
    defaultAllDayEventDuration: { day: 1 },
    forceEventDuration: false,
    nextDayThreshold: "00:00:00",
    dayHeaders: true,
    initialView: "",
    aspectRatio: 1.35,
    headerToolbar: {
      start: "title",
      center: "",
      end: "today prev,next"
    },
    weekends: true,
    weekNumbers: false,
    weekNumberCalculation: "local",
    editable: false,
    nowIndicator: false,
    scrollTime: "06:00:00",
    scrollTimeReset: true,
    slotMinTime: "00:00:00",
    slotMaxTime: "24:00:00",
    showNonCurrentDates: true,
    lazyFetching: true,
    startParam: "start",
    endParam: "end",
    timeZoneParam: "timeZone",
    timeZone: "local",
    locales: [],
    locale: "",
    themeSystem: "standard",
    dragRevertDuration: 500,
    dragScroll: true,
    allDayMaintainDuration: false,
    unselectAuto: true,
    dropAccept: "*",
    eventOrder: "start,-duration,allDay,title",
    dayPopoverFormat: { month: "long", day: "numeric", year: "numeric" },
    handleWindowResize: true,
    windowResizeDelay: 100,
    longPressDelay: 1e3,
    eventDragMinDistance: 5,
    expandRows: false,
    navLinks: false,
    selectable: false,
    eventMinHeight: 15,
    eventMinWidth: 30,
    eventShortHeight: 30,
    monthStartFormat: { month: "long", day: "numeric" },
    nowIndicatorSnap: "auto"
  };
  var CALENDAR_LISTENER_REFINERS = {
    datesSet: identity,
    eventsSet: identity,
    eventAdd: identity,
    eventChange: identity,
    eventRemove: identity,
    windowResize: identity,
    eventClick: identity,
    eventMouseEnter: identity,
    eventMouseLeave: identity,
    select: identity,
    unselect: identity,
    loading: identity,
    // internal
    _unmount: identity,
    _beforeprint: identity,
    _afterprint: identity,
    _noEventDrop: identity,
    _noEventResize: identity,
    _resize: identity,
    _scrollRequest: identity
  };
  var CALENDAR_OPTION_REFINERS = {
    buttonText: identity,
    buttonHints: identity,
    views: identity,
    plugins: identity,
    initialEvents: identity,
    events: identity,
    eventSources: identity
  };
  var COMPLEX_OPTION_COMPARATORS = {
    headerToolbar: isMaybeObjectsEqual,
    footerToolbar: isMaybeObjectsEqual,
    buttonText: isMaybeObjectsEqual,
    buttonHints: isMaybeObjectsEqual,
    buttonIcons: isMaybeObjectsEqual,
    dateIncrement: isMaybeObjectsEqual,
    plugins: isMaybeArraysEqual,
    events: isMaybeArraysEqual,
    eventSources: isMaybeArraysEqual,
    ["resources"]: isMaybeArraysEqual
  };
  function isMaybeObjectsEqual(a3, b3) {
    if (typeof a3 === "object" && typeof b3 === "object" && a3 && b3) {
      return isPropsEqual(a3, b3);
    }
    return a3 === b3;
  }
  function isMaybeArraysEqual(a3, b3) {
    if (Array.isArray(a3) && Array.isArray(b3)) {
      return isArraysEqual(a3, b3);
    }
    return a3 === b3;
  }
  var VIEW_OPTION_REFINERS = {
    type: String,
    component: identity,
    buttonText: String,
    buttonTextKey: String,
    dateProfileGeneratorClass: identity,
    usesMinMaxTime: Boolean,
    classNames: identity,
    content: identity,
    didMount: identity,
    willUnmount: identity
  };
  function mergeRawOptions(optionSets) {
    return mergeProps(optionSets, COMPLEX_OPTION_COMPARATORS);
  }
  function refineProps(input, refiners) {
    let refined = {};
    let extra = {};
    for (let propName in refiners) {
      if (propName in input) {
        refined[propName] = refiners[propName](input[propName]);
      }
    }
    for (let propName in input) {
      if (!(propName in refiners)) {
        extra[propName] = input[propName];
      }
    }
    return { refined, extra };
  }
  function identity(raw) {
    return raw;
  }
  var { hasOwnProperty } = Object.prototype;
  function mergeProps(propObjs, complexPropsMap) {
    let dest = {};
    if (complexPropsMap) {
      for (let name in complexPropsMap) {
        if (complexPropsMap[name] === isMaybeObjectsEqual) {
          let complexObjs = [];
          for (let i3 = propObjs.length - 1; i3 >= 0; i3 -= 1) {
            let val = propObjs[i3][name];
            if (typeof val === "object" && val) {
              complexObjs.unshift(val);
            } else if (val !== void 0) {
              dest[name] = val;
              break;
            }
          }
          if (complexObjs.length) {
            dest[name] = mergeProps(complexObjs);
          }
        }
      }
    }
    for (let i3 = propObjs.length - 1; i3 >= 0; i3 -= 1) {
      let props = propObjs[i3];
      for (let name in props) {
        if (!(name in dest)) {
          dest[name] = props[name];
        }
      }
    }
    return dest;
  }
  function filterHash(hash, func) {
    let filtered = {};
    for (let key in hash) {
      if (func(hash[key], key)) {
        filtered[key] = hash[key];
      }
    }
    return filtered;
  }
  function mapHash(hash, func) {
    let newHash = {};
    for (let key in hash) {
      newHash[key] = func(hash[key], key);
    }
    return newHash;
  }
  function arrayToHash(a3) {
    let hash = {};
    for (let item of a3) {
      hash[item] = true;
    }
    return hash;
  }
  function hashValuesToArray(obj) {
    let a3 = [];
    for (let key in obj) {
      a3.push(obj[key]);
    }
    return a3;
  }
  function isPropsEqual(obj0, obj1) {
    if (obj0 === obj1) {
      return true;
    }
    for (let key in obj0) {
      if (hasOwnProperty.call(obj0, key)) {
        if (!(key in obj1)) {
          return false;
        }
      }
    }
    for (let key in obj1) {
      if (hasOwnProperty.call(obj1, key)) {
        if (obj0[key] !== obj1[key]) {
          return false;
        }
      }
    }
    return true;
  }
  var HANDLER_RE = /^on[A-Z]/;
  function isNonHandlerPropsEqual(obj0, obj1) {
    const keys = getUnequalProps(obj0, obj1);
    for (let key of keys) {
      if (!HANDLER_RE.test(key)) {
        return false;
      }
    }
    return true;
  }
  function getUnequalProps(obj0, obj1) {
    let keys = [];
    for (let key in obj0) {
      if (hasOwnProperty.call(obj0, key)) {
        if (!(key in obj1)) {
          keys.push(key);
        }
      }
    }
    for (let key in obj1) {
      if (hasOwnProperty.call(obj1, key)) {
        if (obj0[key] !== obj1[key]) {
          keys.push(key);
        }
      }
    }
    return keys;
  }
  function compareObjs(oldProps, newProps, equalityFuncs = {}) {
    if (oldProps === newProps) {
      return true;
    }
    for (let key in newProps) {
      if (key in oldProps && isObjValsEqual(oldProps[key], newProps[key], equalityFuncs[key])) ;
      else {
        return false;
      }
    }
    for (let key in oldProps) {
      if (!(key in newProps)) {
        return false;
      }
    }
    return true;
  }
  function isObjValsEqual(val0, val1, comparator) {
    if (val0 === val1 || comparator === true) {
      return true;
    }
    if (comparator) {
      return comparator(val0, val1);
    }
    return false;
  }
  function collectFromHash(hash, startIndex = 0, endIndex, step = 1) {
    let res = [];
    if (endIndex == null) {
      endIndex = Object.keys(hash).length;
    }
    for (let i3 = startIndex; i3 < endIndex; i3 += step) {
      let val = hash[i3];
      if (val !== void 0) {
        res.push(val);
      }
    }
    return res;
  }
  var calendarSystemClassMap = {};
  function registerCalendarSystem(name, theClass) {
    calendarSystemClassMap[name] = theClass;
  }
  function createCalendarSystem(name) {
    return new calendarSystemClassMap[name]();
  }
  var GregorianCalendarSystem = class {
    getMarkerYear(d2) {
      return d2.getUTCFullYear();
    }
    getMarkerMonth(d2) {
      return d2.getUTCMonth();
    }
    getMarkerDay(d2) {
      return d2.getUTCDate();
    }
    arrayToMarker(arr) {
      return arrayToUtcDate(arr);
    }
    markerToArray(marker) {
      return dateToUtcArray(marker);
    }
  };
  registerCalendarSystem("gregory", GregorianCalendarSystem);
  var ISO_RE = /^\s*(\d{4})(-?(\d{2})(-?(\d{2})([T ](\d{2}):?(\d{2})(:?(\d{2})(\.(\d+))?)?(Z|(([-+])(\d{2})(:?(\d{2}))?))?)?)?)?$/;
  function parse(str) {
    let m3 = ISO_RE.exec(str);
    if (m3) {
      let marker = new Date(Date.UTC(Number(m3[1]), m3[3] ? Number(m3[3]) - 1 : 0, Number(m3[5] || 1), Number(m3[7] || 0), Number(m3[8] || 0), Number(m3[10] || 0), m3[12] ? Number(`0.${m3[12]}`) * 1e3 : 0));
      if (isValidDate(marker)) {
        let timeZoneOffset = null;
        if (m3[13]) {
          timeZoneOffset = (m3[15] === "-" ? -1 : 1) * (Number(m3[16] || 0) * 60 + Number(m3[18] || 0));
        }
        return {
          marker,
          isTimeUnspecified: !m3[6],
          timeZoneOffset
        };
      }
    }
    return null;
  }
  var DateEnv = class {
    constructor(settings) {
      let timeZone = this.timeZone = settings.timeZone;
      let isNamedTimeZone = timeZone !== "local" && timeZone !== "UTC";
      if (settings.namedTimeZoneImpl && isNamedTimeZone) {
        this.namedTimeZoneImpl = new settings.namedTimeZoneImpl(timeZone);
      }
      this.canComputeOffset = Boolean(!isNamedTimeZone || this.namedTimeZoneImpl);
      this.calendarSystem = createCalendarSystem(settings.calendarSystem);
      this.locale = settings.locale;
      this.weekDow = settings.locale.week.dow;
      this.weekDoy = settings.locale.week.doy;
      if (settings.weekNumberCalculation === "ISO") {
        this.weekDow = 1;
        this.weekDoy = 4;
      }
      if (typeof settings.firstDay === "number") {
        this.weekDow = settings.firstDay;
      }
      if (typeof settings.weekNumberCalculation === "function") {
        this.weekNumberFunc = settings.weekNumberCalculation;
      }
      this.weekText = settings.weekText != null ? settings.weekText : settings.locale.options.weekText;
      this.weekTextLong = (settings.weekTextLong != null ? settings.weekTextLong : settings.locale.options.weekTextLong) || this.weekText;
      this.cmdFormatter = settings.cmdFormatter;
      this.defaultSeparator = settings.defaultSeparator;
    }
    // Creating / Parsing
    createMarker(input) {
      let meta = this.createMarkerMeta(input);
      if (meta === null) {
        return null;
      }
      return meta.marker;
    }
    createNowMarker() {
      if (this.canComputeOffset) {
        return this.timestampToMarker((/* @__PURE__ */ new Date()).valueOf());
      }
      return arrayToUtcDate(dateToLocalArray(/* @__PURE__ */ new Date()));
    }
    createMarkerMeta(input) {
      if (typeof input === "string") {
        return this.parse(input);
      }
      let marker = null;
      if (typeof input === "number") {
        marker = this.timestampToMarker(input);
      } else if (input instanceof Date) {
        input = input.valueOf();
        if (!isNaN(input)) {
          marker = this.timestampToMarker(input);
        }
      } else if (Array.isArray(input)) {
        marker = arrayToUtcDate(input);
      }
      if (marker === null || !isValidDate(marker)) {
        return null;
      }
      return { marker, isTimeUnspecified: false, forcedTzo: null };
    }
    parse(s3) {
      let parts = parse(s3);
      if (parts === null) {
        return null;
      }
      let { marker } = parts;
      let forcedTzo = null;
      if (parts.timeZoneOffset !== null) {
        if (this.canComputeOffset) {
          marker = this.timestampToMarker(marker.valueOf() - parts.timeZoneOffset * 60 * 1e3);
        } else {
          forcedTzo = parts.timeZoneOffset;
        }
      }
      return { marker, isTimeUnspecified: parts.isTimeUnspecified, forcedTzo };
    }
    // Accessors
    getYear(marker) {
      return this.calendarSystem.getMarkerYear(marker);
    }
    getMonth(marker) {
      return this.calendarSystem.getMarkerMonth(marker);
    }
    getDay(marker) {
      return this.calendarSystem.getMarkerDay(marker);
    }
    // Adding / Subtracting
    add(marker, dur) {
      let a3 = this.calendarSystem.markerToArray(marker);
      a3[0] += dur.years;
      a3[1] += dur.months;
      a3[2] += dur.days;
      a3[6] += dur.milliseconds;
      return this.calendarSystem.arrayToMarker(a3);
    }
    subtract(marker, dur) {
      let a3 = this.calendarSystem.markerToArray(marker);
      a3[0] -= dur.years;
      a3[1] -= dur.months;
      a3[2] -= dur.days;
      a3[6] -= dur.milliseconds;
      return this.calendarSystem.arrayToMarker(a3);
    }
    addYears(marker, n2) {
      let a3 = this.calendarSystem.markerToArray(marker);
      a3[0] += n2;
      return this.calendarSystem.arrayToMarker(a3);
    }
    addMonths(marker, n2) {
      let a3 = this.calendarSystem.markerToArray(marker);
      a3[1] += n2;
      return this.calendarSystem.arrayToMarker(a3);
    }
    // Diffing Whole Units
    diffWholeYears(m0, m1) {
      let { calendarSystem } = this;
      if (timeAsMs(m0) === timeAsMs(m1) && calendarSystem.getMarkerDay(m0) === calendarSystem.getMarkerDay(m1) && calendarSystem.getMarkerMonth(m0) === calendarSystem.getMarkerMonth(m1)) {
        return calendarSystem.getMarkerYear(m1) - calendarSystem.getMarkerYear(m0);
      }
      return null;
    }
    diffWholeMonths(m0, m1) {
      let { calendarSystem } = this;
      if (timeAsMs(m0) === timeAsMs(m1) && calendarSystem.getMarkerDay(m0) === calendarSystem.getMarkerDay(m1)) {
        return calendarSystem.getMarkerMonth(m1) - calendarSystem.getMarkerMonth(m0) + (calendarSystem.getMarkerYear(m1) - calendarSystem.getMarkerYear(m0)) * 12;
      }
      return null;
    }
    // Range / Duration
    greatestWholeUnit(m0, m1) {
      let n2 = this.diffWholeYears(m0, m1);
      if (n2 !== null) {
        return { unit: "year", value: n2 };
      }
      n2 = this.diffWholeMonths(m0, m1);
      if (n2 !== null) {
        return { unit: "month", value: n2 };
      }
      n2 = diffWholeWeeks(m0, m1);
      if (n2 !== null) {
        return { unit: "week", value: n2 };
      }
      n2 = diffWholeDays(m0, m1);
      if (n2 !== null) {
        return { unit: "day", value: n2 };
      }
      n2 = diffHours(m0, m1);
      if (isInt(n2)) {
        return { unit: "hour", value: n2 };
      }
      n2 = diffMinutes(m0, m1);
      if (isInt(n2)) {
        return { unit: "minute", value: n2 };
      }
      n2 = diffSeconds(m0, m1);
      if (isInt(n2)) {
        return { unit: "second", value: n2 };
      }
      return { unit: "millisecond", value: m1.valueOf() - m0.valueOf() };
    }
    countDurationsBetween(m0, m1, d2) {
      let diff;
      if (d2.years) {
        diff = this.diffWholeYears(m0, m1);
        if (diff !== null) {
          return diff / asRoughYears(d2);
        }
      }
      if (d2.months) {
        diff = this.diffWholeMonths(m0, m1);
        if (diff !== null) {
          return diff / asRoughMonths(d2);
        }
      }
      if (d2.days) {
        diff = diffWholeDays(m0, m1);
        if (diff !== null) {
          return diff / asRoughDays(d2);
        }
      }
      return (m1.valueOf() - m0.valueOf()) / asRoughMs(d2);
    }
    // Start-Of
    // these DON'T return zoned-dates. only UTC start-of dates
    startOf(m3, unit) {
      if (unit === "year") {
        return this.startOfYear(m3);
      }
      if (unit === "month") {
        return this.startOfMonth(m3);
      }
      if (unit === "week") {
        return this.startOfWeek(m3);
      }
      if (unit === "day") {
        return startOfDay(m3);
      }
      if (unit === "hour") {
        return startOfHour(m3);
      }
      if (unit === "minute") {
        return startOfMinute(m3);
      }
      if (unit === "second") {
        return startOfSecond(m3);
      }
      return null;
    }
    startOfYear(m3) {
      return this.calendarSystem.arrayToMarker([
        this.calendarSystem.getMarkerYear(m3)
      ]);
    }
    startOfMonth(m3) {
      return this.calendarSystem.arrayToMarker([
        this.calendarSystem.getMarkerYear(m3),
        this.calendarSystem.getMarkerMonth(m3)
      ]);
    }
    startOfWeek(m3) {
      return this.calendarSystem.arrayToMarker([
        this.calendarSystem.getMarkerYear(m3),
        this.calendarSystem.getMarkerMonth(m3),
        m3.getUTCDate() - (m3.getUTCDay() - this.weekDow + 7) % 7
      ]);
    }
    // Week Number
    computeWeekNumber(marker) {
      if (this.weekNumberFunc) {
        return this.weekNumberFunc(this.toDate(marker));
      }
      return weekOfYear(marker, this.weekDow, this.weekDoy);
    }
    // TODO: choke on timeZoneName: long
    format(marker, formatter, dateOptions = {}) {
      return formatter.format({
        marker,
        timeZoneOffset: dateOptions.forcedTzo != null ? dateOptions.forcedTzo : this.offsetForMarker(marker)
      }, this);
    }
    formatRange(start, end, formatter, dateOptions = {}) {
      if (dateOptions.isEndExclusive) {
        end = addMs(end, -1);
      }
      return formatter.formatRange({
        marker: start,
        timeZoneOffset: dateOptions.forcedStartTzo != null ? dateOptions.forcedStartTzo : this.offsetForMarker(start)
      }, {
        marker: end,
        timeZoneOffset: dateOptions.forcedEndTzo != null ? dateOptions.forcedEndTzo : this.offsetForMarker(end)
      }, this, dateOptions.defaultSeparator);
    }
    /*
    DUMB: the omitTime arg is dumb. if we omit the time, we want to omit the timezone offset. and if we do that,
    might as well use buildIsoString or some other util directly
    */
    formatIso(marker, extraOptions = {}) {
      let timeZoneOffset = null;
      if (!extraOptions.omitTimeZoneOffset) {
        if (extraOptions.forcedTzo != null) {
          timeZoneOffset = extraOptions.forcedTzo;
        } else {
          timeZoneOffset = this.offsetForMarker(marker);
        }
      }
      return buildIsoString(marker, timeZoneOffset, extraOptions.omitTime);
    }
    // TimeZone
    timestampToMarker(ms) {
      if (this.timeZone === "local") {
        return arrayToUtcDate(dateToLocalArray(new Date(ms)));
      }
      if (this.timeZone === "UTC" || !this.namedTimeZoneImpl) {
        return new Date(ms);
      }
      return arrayToUtcDate(this.namedTimeZoneImpl.timestampToArray(ms));
    }
    offsetForMarker(m3) {
      if (this.timeZone === "local") {
        return -arrayToLocalDate(dateToUtcArray(m3)).getTimezoneOffset();
      }
      if (this.timeZone === "UTC") {
        return 0;
      }
      if (this.namedTimeZoneImpl) {
        return this.namedTimeZoneImpl.offsetForArray(dateToUtcArray(m3));
      }
      return null;
    }
    // Conversion
    toDate(m3, forcedTzo) {
      if (this.timeZone === "local") {
        return arrayToLocalDate(dateToUtcArray(m3));
      }
      if (this.timeZone === "UTC") {
        return new Date(m3.valueOf());
      }
      if (!this.namedTimeZoneImpl) {
        return new Date(m3.valueOf() - (forcedTzo || 0));
      }
      return new Date(m3.valueOf() - this.namedTimeZoneImpl.offsetForArray(dateToUtcArray(m3)) * 1e3 * 60);
    }
  };
  var Theme = class {
    constructor(calendarOptions) {
      if (this.iconOverrideOption) {
        this.setIconOverride(calendarOptions[this.iconOverrideOption]);
      }
    }
    setIconOverride(iconOverrideHash) {
      let iconClassesCopy;
      let buttonName;
      if (typeof iconOverrideHash === "object" && iconOverrideHash) {
        iconClassesCopy = Object.assign({}, this.iconClasses);
        for (buttonName in iconOverrideHash) {
          iconClassesCopy[buttonName] = this.applyIconOverridePrefix(iconOverrideHash[buttonName]);
        }
        this.iconClasses = iconClassesCopy;
      } else if (iconOverrideHash === false) {
        this.iconClasses = {};
      }
    }
    applyIconOverridePrefix(className) {
      let prefix = this.iconOverridePrefix;
      if (prefix && className.indexOf(prefix) !== 0) {
        className = prefix + className;
      }
      return className;
    }
    getClass(key) {
      return this.classes[key] || "";
    }
    getIconClass(buttonName, isRtl) {
      let className;
      if (isRtl && this.rtlIconClasses) {
        className = this.rtlIconClasses[buttonName] || this.iconClasses[buttonName];
      } else {
        className = this.iconClasses[buttonName];
      }
      if (className) {
        return `${this.baseIconClass} ${className}`;
      }
      return "";
    }
    getCustomButtonIconClass(customButtonProps) {
      let className;
      if (this.iconOverrideCustomButtonOption) {
        className = customButtonProps[this.iconOverrideCustomButtonOption];
        if (className) {
          return `${this.baseIconClass} ${this.applyIconOverridePrefix(className)}`;
        }
      }
      return "";
    }
  };
  Theme.prototype.classes = {};
  Theme.prototype.iconClasses = {};
  Theme.prototype.baseIconClass = "";
  Theme.prototype.iconOverridePrefix = "";
  function flushSync(runBeforeFlush) {
    runBeforeFlush();
    let oldDebounceRendering = l.debounceRendering;
    let callbackQ = [];
    function execCallbackSync(callback) {
      callbackQ.push(callback);
    }
    l.debounceRendering = execCallbackSync;
    D(y(FakeComponent, {}), document.createElement("div"));
    while (callbackQ.length) {
      callbackQ.shift()();
    }
    l.debounceRendering = oldDebounceRendering;
  }
  var FakeComponent = class extends x {
    render() {
      return y("div", {});
    }
    componentDidMount() {
      this.setState({});
    }
  };
  function createContext(defaultValue) {
    let ContextType = G(defaultValue);
    let origProvider = ContextType.Provider;
    ContextType.Provider = function() {
      let isNew = !this.getChildContext;
      let children = origProvider.apply(this, arguments);
      if (isNew) {
        let subs = [];
        this.shouldComponentUpdate = (_props) => {
          if (this.props.value !== _props.value) {
            subs.forEach((c3) => {
              c3.context = _props.value;
              c3.forceUpdate();
            });
          }
        };
        this.sub = (c3) => {
          subs.push(c3);
          let old = c3.componentWillUnmount;
          c3.componentWillUnmount = () => {
            subs.splice(subs.indexOf(c3), 1);
            old && old.call(c3);
          };
        };
      }
      return children;
    };
    return ContextType;
  }
  var ScrollResponder = class {
    constructor(execFunc, emitter, scrollTime, scrollTimeReset) {
      this.execFunc = execFunc;
      this.emitter = emitter;
      this.scrollTime = scrollTime;
      this.scrollTimeReset = scrollTimeReset;
      this.handleScrollRequest = (request) => {
        this.queuedRequest = Object.assign({}, this.queuedRequest || {}, request);
        this.drain();
      };
      emitter.on("_scrollRequest", this.handleScrollRequest);
      this.fireInitialScroll();
    }
    detach() {
      this.emitter.off("_scrollRequest", this.handleScrollRequest);
    }
    update(isDatesNew) {
      if (isDatesNew && this.scrollTimeReset) {
        this.fireInitialScroll();
      } else {
        this.drain();
      }
    }
    fireInitialScroll() {
      this.handleScrollRequest({
        time: this.scrollTime
      });
    }
    drain() {
      if (this.queuedRequest && this.execFunc(this.queuedRequest)) {
        this.queuedRequest = null;
      }
    }
  };
  var ViewContextType = createContext({});
  function buildViewContext(viewSpec, viewApi, viewOptions, dateProfileGenerator, dateEnv, nowManager, theme, pluginHooks, dispatch, getCurrentData, emitter, calendarApi, registerInteractiveComponent, unregisterInteractiveComponent) {
    return {
      dateEnv,
      nowManager,
      options: viewOptions,
      pluginHooks,
      emitter,
      dispatch,
      getCurrentData,
      calendarApi,
      viewSpec,
      viewApi,
      dateProfileGenerator,
      theme,
      isRtl: viewOptions.direction === "rtl",
      addResizeHandler(handler) {
        emitter.on("_resize", handler);
      },
      removeResizeHandler(handler) {
        emitter.off("_resize", handler);
      },
      createScrollResponder(execFunc) {
        return new ScrollResponder(execFunc, emitter, createDuration(viewOptions.scrollTime), viewOptions.scrollTimeReset);
      },
      registerInteractiveComponent,
      unregisterInteractiveComponent
    };
  }
  var PureComponent = class extends x {
    // debug: boolean
    shouldComponentUpdate(nextProps, nextState) {
      const shouldUpdate = !compareObjs(
        this.props,
        nextProps,
        this.propEquality
        /*, this.debug */
      ) || !compareObjs(
        this.state,
        nextState,
        this.stateEquality
        /*, this.debug */
      );
      return shouldUpdate;
    }
    // HACK for freakin' React StrictMode
    safeSetState(newState) {
      if (!compareObjs(this.state, Object.assign(Object.assign({}, this.state), newState), this.stateEquality)) {
        this.setState(newState);
      }
    }
  };
  PureComponent.addPropsEquality = addPropsEquality;
  PureComponent.addStateEquality = addStateEquality;
  PureComponent.contextType = ViewContextType;
  PureComponent.prototype.propEquality = {};
  PureComponent.prototype.stateEquality = {};
  var BaseComponent = class extends PureComponent {
  };
  BaseComponent.contextType = ViewContextType;
  function addPropsEquality(propEquality) {
    let hash = Object.create(this.prototype.propEquality);
    Object.assign(hash, propEquality);
    this.prototype.propEquality = hash;
  }
  function addStateEquality(stateEquality) {
    let hash = Object.create(this.prototype.stateEquality);
    Object.assign(hash, stateEquality);
    this.prototype.stateEquality = hash;
  }
  function setRef(ref, current) {
    if (typeof ref === "function") {
      ref(current);
    } else if (ref) {
      ref.current = current;
    }
  }
  var ContentInjector = class extends BaseComponent {
    constructor() {
      super(...arguments);
      this.id = guid();
      this.queuedDomNodes = [];
      this.currentDomNodes = [];
      this.handleEl = (el) => {
        const { options } = this.context;
        const { generatorName } = this.props;
        if (!options.customRenderingReplaces || !hasCustomRenderingHandler(generatorName, options)) {
          this.updateElRef(el);
        }
      };
      this.updateElRef = (el) => {
        if (this.props.elRef) {
          setRef(this.props.elRef, el);
        }
      };
    }
    render() {
      const { props, context } = this;
      const { options } = context;
      const { customGenerator, defaultGenerator, renderProps } = props;
      const attrs = buildElAttrs(props, [], this.handleEl);
      let useDefault = false;
      let innerContent;
      let queuedDomNodes = [];
      let currentGeneratorMeta;
      if (customGenerator != null) {
        const customGeneratorRes = typeof customGenerator === "function" ? customGenerator(renderProps, y) : customGenerator;
        if (customGeneratorRes === true) {
          useDefault = true;
        } else {
          const isObject = customGeneratorRes && typeof customGeneratorRes === "object";
          if (isObject && "html" in customGeneratorRes) {
            attrs.dangerouslySetInnerHTML = { __html: customGeneratorRes.html };
          } else if (isObject && "domNodes" in customGeneratorRes) {
            queuedDomNodes = Array.prototype.slice.call(customGeneratorRes.domNodes);
          } else if (isObject ? i(customGeneratorRes) : typeof customGeneratorRes !== "function") {
            innerContent = customGeneratorRes;
          } else {
            currentGeneratorMeta = customGeneratorRes;
          }
        }
      } else {
        useDefault = !hasCustomRenderingHandler(props.generatorName, options);
      }
      if (useDefault && defaultGenerator) {
        innerContent = defaultGenerator(renderProps);
      }
      this.queuedDomNodes = queuedDomNodes;
      this.currentGeneratorMeta = currentGeneratorMeta;
      return y(props.elTag, attrs, innerContent);
    }
    componentDidMount() {
      this.applyQueueudDomNodes();
      this.triggerCustomRendering(true);
    }
    componentDidUpdate() {
      this.applyQueueudDomNodes();
      this.triggerCustomRendering(true);
    }
    componentWillUnmount() {
      this.triggerCustomRendering(false);
    }
    triggerCustomRendering(isActive) {
      var _a;
      const { props, context } = this;
      const { handleCustomRendering, customRenderingMetaMap } = context.options;
      if (handleCustomRendering) {
        const generatorMeta = (_a = this.currentGeneratorMeta) !== null && _a !== void 0 ? _a : customRenderingMetaMap === null || customRenderingMetaMap === void 0 ? void 0 : customRenderingMetaMap[props.generatorName];
        if (generatorMeta) {
          handleCustomRendering(Object.assign(Object.assign({
            id: this.id,
            isActive,
            containerEl: this.base,
            reportNewContainerEl: this.updateElRef,
            // front-end framework tells us about new container els
            generatorMeta
          }, props), { elClasses: (props.elClasses || []).filter(isTruthy) }));
        }
      }
    }
    applyQueueudDomNodes() {
      const { queuedDomNodes, currentDomNodes } = this;
      const el = this.base;
      if (!isArraysEqual(queuedDomNodes, currentDomNodes)) {
        currentDomNodes.forEach(removeElement);
        for (let newNode of queuedDomNodes) {
          el.appendChild(newNode);
        }
        this.currentDomNodes = queuedDomNodes;
      }
    }
  };
  ContentInjector.addPropsEquality({
    elClasses: isArraysEqual,
    elStyle: isPropsEqual,
    elAttrs: isNonHandlerPropsEqual,
    renderProps: isPropsEqual
  });
  function hasCustomRenderingHandler(generatorName, options) {
    var _a;
    return Boolean(options.handleCustomRendering && generatorName && ((_a = options.customRenderingMetaMap) === null || _a === void 0 ? void 0 : _a[generatorName]));
  }
  function buildElAttrs(props, extraClassNames, elRef) {
    const attrs = Object.assign(Object.assign({}, props.elAttrs), { ref: elRef });
    if (props.elClasses || extraClassNames) {
      attrs.className = (props.elClasses || []).concat(extraClassNames || []).concat(attrs.className || []).filter(Boolean).join(" ");
    }
    if (props.elStyle) {
      attrs.style = props.elStyle;
    }
    return attrs;
  }
  function isTruthy(val) {
    return Boolean(val);
  }
  var RenderId = createContext(0);
  var ContentContainer = class extends x {
    constructor() {
      super(...arguments);
      this.InnerContent = InnerContentInjector.bind(void 0, this);
      this.handleEl = (el) => {
        this.el = el;
        if (this.props.elRef) {
          setRef(this.props.elRef, el);
          if (el && this.didMountMisfire) {
            this.componentDidMount();
          }
        }
      };
    }
    render() {
      const { props } = this;
      const generatedClassNames = generateClassNames(props.classNameGenerator, props.renderProps);
      if (props.children) {
        const elAttrs = buildElAttrs(props, generatedClassNames, this.handleEl);
        const children = props.children(this.InnerContent, props.renderProps, elAttrs);
        if (props.elTag) {
          return y(props.elTag, elAttrs, children);
        } else {
          return children;
        }
      } else {
        return y(ContentInjector, Object.assign(Object.assign({}, props), { elRef: this.handleEl, elTag: props.elTag || "div", elClasses: (props.elClasses || []).concat(generatedClassNames), renderId: this.context }));
      }
    }
    componentDidMount() {
      var _a, _b;
      if (this.el) {
        (_b = (_a = this.props).didMount) === null || _b === void 0 ? void 0 : _b.call(_a, Object.assign(Object.assign({}, this.props.renderProps), { el: this.el }));
      } else {
        this.didMountMisfire = true;
      }
    }
    componentWillUnmount() {
      var _a, _b;
      (_b = (_a = this.props).willUnmount) === null || _b === void 0 ? void 0 : _b.call(_a, Object.assign(Object.assign({}, this.props.renderProps), { el: this.el }));
    }
  };
  ContentContainer.contextType = RenderId;
  function InnerContentInjector(containerComponent, props) {
    const parentProps = containerComponent.props;
    return y(ContentInjector, Object.assign({ renderProps: parentProps.renderProps, generatorName: parentProps.generatorName, customGenerator: parentProps.customGenerator, defaultGenerator: parentProps.defaultGenerator, renderId: containerComponent.context }, props));
  }
  function generateClassNames(classNameGenerator, renderProps) {
    const classNames = typeof classNameGenerator === "function" ? classNameGenerator(renderProps) : classNameGenerator || [];
    return typeof classNames === "string" ? [classNames] : classNames;
  }
  var ViewContainer = class extends BaseComponent {
    render() {
      let { props, context } = this;
      let { options } = context;
      let renderProps = { view: context.viewApi };
      return y(ContentContainer, { elRef: props.elRef, elTag: props.elTag || "div", elAttrs: props.elAttrs, elClasses: [
        ...buildViewClassNames(props.viewSpec),
        ...props.elClasses || []
      ], elStyle: props.elStyle, renderProps, classNameGenerator: options.viewClassNames, generatorName: void 0, didMount: options.viewDidMount, willUnmount: options.viewWillUnmount }, () => props.children);
    }
  };
  function buildViewClassNames(viewSpec) {
    return [
      `fc-${viewSpec.type}-view`,
      "fc-view"
    ];
  }
  function parseRange(input, dateEnv) {
    let start = null;
    let end = null;
    if (input.start) {
      start = dateEnv.createMarker(input.start);
    }
    if (input.end) {
      end = dateEnv.createMarker(input.end);
    }
    if (!start && !end) {
      return null;
    }
    if (start && end && end < start) {
      return null;
    }
    return { start, end };
  }
  function invertRanges(ranges, constraintRange) {
    let invertedRanges = [];
    let { start } = constraintRange;
    let i3;
    let dateRange;
    ranges.sort(compareRanges);
    for (i3 = 0; i3 < ranges.length; i3 += 1) {
      dateRange = ranges[i3];
      if (dateRange.start > start) {
        invertedRanges.push({ start, end: dateRange.start });
      }
      if (dateRange.end > start) {
        start = dateRange.end;
      }
    }
    if (start < constraintRange.end) {
      invertedRanges.push({ start, end: constraintRange.end });
    }
    return invertedRanges;
  }
  function compareRanges(range0, range1) {
    return range0.start.valueOf() - range1.start.valueOf();
  }
  function intersectRanges(range0, range1) {
    let { start, end } = range0;
    let newRange = null;
    if (range1.start !== null) {
      if (start === null) {
        start = range1.start;
      } else {
        start = new Date(Math.max(start.valueOf(), range1.start.valueOf()));
      }
    }
    if (range1.end != null) {
      if (end === null) {
        end = range1.end;
      } else {
        end = new Date(Math.min(end.valueOf(), range1.end.valueOf()));
      }
    }
    if (start === null || end === null || start < end) {
      newRange = { start, end };
    }
    return newRange;
  }
  function rangesIntersect(range0, range1) {
    return (range0.end === null || range1.start === null || range0.end > range1.start) && (range0.start === null || range1.end === null || range0.start < range1.end);
  }
  function rangeContainsMarker(range2, date) {
    return (range2.start === null || date >= range2.start) && (range2.end === null || date < range2.end);
  }
  function constrainMarkerToRange(date, range2) {
    if (range2.start != null && date < range2.start) {
      return range2.start;
    }
    if (range2.end != null && date >= range2.end) {
      return new Date(range2.end.valueOf() - 1);
    }
    return date;
  }
  function computeAlignedDayRange(timedRange) {
    let dayCnt = Math.floor(diffDays(timedRange.start, timedRange.end)) || 1;
    let start = startOfDay(timedRange.start);
    let end = addDays(start, dayCnt);
    return { start, end };
  }
  function computeVisibleDayRange(timedRange, nextDayThreshold = createDuration(0)) {
    let startDay = null;
    let endDay = null;
    if (timedRange.end) {
      endDay = startOfDay(timedRange.end);
      let endTimeMS = timedRange.end.valueOf() - endDay.valueOf();
      if (endTimeMS && endTimeMS >= asRoughMs(nextDayThreshold)) {
        endDay = addDays(endDay, 1);
      }
    }
    if (timedRange.start) {
      startDay = startOfDay(timedRange.start);
      if (endDay && endDay <= startDay) {
        endDay = addDays(startDay, 1);
      }
    }
    return { start: startDay, end: endDay };
  }
  function isMultiDayRange(range2) {
    let visibleRange = computeVisibleDayRange(range2);
    return diffDays(visibleRange.start, visibleRange.end) > 1;
  }
  function diffDates(date0, date1, dateEnv, largeUnit) {
    if (largeUnit === "year") {
      return createDuration(dateEnv.diffWholeYears(date0, date1), "year");
    }
    if (largeUnit === "month") {
      return createDuration(dateEnv.diffWholeMonths(date0, date1), "month");
    }
    return diffDayAndTime(date0, date1);
  }
  var DateProfileGenerator = class {
    constructor(props) {
      this.props = props;
      this.initHiddenDays();
    }
    /* Date Range Computation
    ------------------------------------------------------------------------------------------------------------------*/
    // Builds a structure with info about what the dates/ranges will be for the "prev" view.
    buildPrev(currentDateProfile, currentDate, forceToValid) {
      let { dateEnv } = this.props;
      let prevDate = dateEnv.subtract(
        dateEnv.startOf(currentDate, currentDateProfile.currentRangeUnit),
        // important for start-of-month
        currentDateProfile.dateIncrement
      );
      return this.build(prevDate, -1, forceToValid);
    }
    // Builds a structure with info about what the dates/ranges will be for the "next" view.
    buildNext(currentDateProfile, currentDate, forceToValid) {
      let { dateEnv } = this.props;
      let nextDate = dateEnv.add(
        dateEnv.startOf(currentDate, currentDateProfile.currentRangeUnit),
        // important for start-of-month
        currentDateProfile.dateIncrement
      );
      return this.build(nextDate, 1, forceToValid);
    }
    // Builds a structure holding dates/ranges for rendering around the given date.
    // Optional direction param indicates whether the date is being incremented/decremented
    // from its previous value. decremented = -1, incremented = 1 (default).
    build(currentDate, direction, forceToValid = true) {
      let { props } = this;
      let validRange;
      let currentInfo;
      let isRangeAllDay;
      let renderRange;
      let activeRange;
      let isValid;
      validRange = this.buildValidRange();
      validRange = this.trimHiddenDays(validRange);
      if (forceToValid) {
        currentDate = constrainMarkerToRange(currentDate, validRange);
      }
      currentInfo = this.buildCurrentRangeInfo(currentDate, direction);
      isRangeAllDay = /^(year|month|week|day)$/.test(currentInfo.unit);
      renderRange = this.buildRenderRange(this.trimHiddenDays(currentInfo.range), currentInfo.unit, isRangeAllDay);
      renderRange = this.trimHiddenDays(renderRange);
      activeRange = renderRange;
      if (!props.showNonCurrentDates) {
        activeRange = intersectRanges(activeRange, currentInfo.range);
      }
      activeRange = this.adjustActiveRange(activeRange);
      activeRange = intersectRanges(activeRange, validRange);
      isValid = rangesIntersect(currentInfo.range, validRange);
      if (!rangeContainsMarker(renderRange, currentDate)) {
        currentDate = renderRange.start;
      }
      return {
        currentDate,
        // constraint for where prev/next operations can go and where events can be dragged/resized to.
        // an object with optional start and end properties.
        validRange,
        // range the view is formally responsible for.
        // for example, a month view might have 1st-31st, excluding padded dates
        currentRange: currentInfo.range,
        // name of largest unit being displayed, like "month" or "week"
        currentRangeUnit: currentInfo.unit,
        isRangeAllDay,
        // dates that display events and accept drag-n-drop
        // will be `null` if no dates accept events
        activeRange,
        // date range with a rendered skeleton
        // includes not-active days that need some sort of DOM
        renderRange,
        // Duration object that denotes the first visible time of any given day
        slotMinTime: props.slotMinTime,
        // Duration object that denotes the exclusive visible end time of any given day
        slotMaxTime: props.slotMaxTime,
        isValid,
        // how far the current date will move for a prev/next operation
        dateIncrement: this.buildDateIncrement(currentInfo.duration)
        // pass a fallback (might be null) ^
      };
    }
    // Builds an object with optional start/end properties.
    // Indicates the minimum/maximum dates to display.
    // not responsible for trimming hidden days.
    buildValidRange() {
      let input = this.props.validRangeInput;
      let simpleInput = typeof input === "function" ? input.call(this.props.calendarApi, this.props.dateEnv.toDate(this.props.nowManager.getDateMarker())) : input;
      return this.refineRange(simpleInput) || { start: null, end: null };
    }
    // Builds a structure with info about the "current" range, the range that is
    // highlighted as being the current month for example.
    // See build() for a description of `direction`.
    // Guaranteed to have `range` and `unit` properties. `duration` is optional.
    buildCurrentRangeInfo(date, direction) {
      let { props } = this;
      let duration = null;
      let unit = null;
      let range2 = null;
      let dayCount;
      if (props.duration) {
        duration = props.duration;
        unit = props.durationUnit;
        range2 = this.buildRangeFromDuration(date, direction, duration, unit);
      } else if (dayCount = this.props.dayCount) {
        unit = "day";
        range2 = this.buildRangeFromDayCount(date, direction, dayCount);
      } else if (range2 = this.buildCustomVisibleRange(date)) {
        unit = props.dateEnv.greatestWholeUnit(range2.start, range2.end).unit;
      } else {
        duration = this.getFallbackDuration();
        unit = greatestDurationDenominator(duration).unit;
        range2 = this.buildRangeFromDuration(date, direction, duration, unit);
      }
      return { duration, unit, range: range2 };
    }
    getFallbackDuration() {
      return createDuration({ day: 1 });
    }
    // Returns a new activeRange to have time values (un-ambiguate)
    // slotMinTime or slotMaxTime causes the range to expand.
    adjustActiveRange(range2) {
      let { dateEnv, usesMinMaxTime, slotMinTime, slotMaxTime } = this.props;
      let { start, end } = range2;
      if (usesMinMaxTime) {
        if (asRoughDays(slotMinTime) < 0) {
          start = startOfDay(start);
          start = dateEnv.add(start, slotMinTime);
        }
        if (asRoughDays(slotMaxTime) > 1) {
          end = startOfDay(end);
          end = addDays(end, -1);
          end = dateEnv.add(end, slotMaxTime);
        }
      }
      return { start, end };
    }
    // Builds the "current" range when it is specified as an explicit duration.
    // `unit` is the already-computed greatestDurationDenominator unit of duration.
    buildRangeFromDuration(date, direction, duration, unit) {
      let { dateEnv, dateAlignment } = this.props;
      let start;
      let end;
      let res;
      if (!dateAlignment) {
        let { dateIncrement } = this.props;
        if (dateIncrement) {
          if (asRoughMs(dateIncrement) < asRoughMs(duration)) {
            dateAlignment = greatestDurationDenominator(dateIncrement).unit;
          } else {
            dateAlignment = unit;
          }
        } else {
          dateAlignment = unit;
        }
      }
      if (asRoughDays(duration) <= 1) {
        if (this.isHiddenDay(start)) {
          start = this.skipHiddenDays(start, direction);
          start = startOfDay(start);
        }
      }
      function computeRes() {
        start = dateEnv.startOf(date, dateAlignment);
        end = dateEnv.add(start, duration);
        res = { start, end };
      }
      computeRes();
      if (!this.trimHiddenDays(res)) {
        date = this.skipHiddenDays(date, direction);
        computeRes();
      }
      return res;
    }
    // Builds the "current" range when a dayCount is specified.
    buildRangeFromDayCount(date, direction, dayCount) {
      let { dateEnv, dateAlignment } = this.props;
      let runningCount = 0;
      let start = date;
      let end;
      if (dateAlignment) {
        start = dateEnv.startOf(start, dateAlignment);
      }
      start = startOfDay(start);
      start = this.skipHiddenDays(start, direction);
      end = start;
      do {
        end = addDays(end, 1);
        if (!this.isHiddenDay(end)) {
          runningCount += 1;
        }
      } while (runningCount < dayCount);
      return { start, end };
    }
    // Builds a normalized range object for the "visible" range,
    // which is a way to define the currentRange and activeRange at the same time.
    buildCustomVisibleRange(date) {
      let { props } = this;
      let input = props.visibleRangeInput;
      let simpleInput = typeof input === "function" ? input.call(props.calendarApi, props.dateEnv.toDate(date)) : input;
      let range2 = this.refineRange(simpleInput);
      if (range2 && (range2.start == null || range2.end == null)) {
        return null;
      }
      return range2;
    }
    // Computes the range that will represent the element/cells for *rendering*,
    // but which may have voided days/times.
    // not responsible for trimming hidden days.
    buildRenderRange(currentRange, currentRangeUnit, isRangeAllDay) {
      return currentRange;
    }
    // Compute the duration value that should be added/substracted to the current date
    // when a prev/next operation happens.
    buildDateIncrement(fallback) {
      let { dateIncrement } = this.props;
      let customAlignment;
      if (dateIncrement) {
        return dateIncrement;
      }
      if (customAlignment = this.props.dateAlignment) {
        return createDuration(1, customAlignment);
      }
      if (fallback) {
        return fallback;
      }
      return createDuration({ days: 1 });
    }
    refineRange(rangeInput) {
      if (rangeInput) {
        let range2 = parseRange(rangeInput, this.props.dateEnv);
        if (range2) {
          range2 = computeVisibleDayRange(range2);
        }
        return range2;
      }
      return null;
    }
    /* Hidden Days
    ------------------------------------------------------------------------------------------------------------------*/
    // Initializes internal variables related to calculating hidden days-of-week
    initHiddenDays() {
      let hiddenDays = this.props.hiddenDays || [];
      let isHiddenDayHash = [];
      let dayCnt = 0;
      let i3;
      if (this.props.weekends === false) {
        hiddenDays.push(0, 6);
      }
      for (i3 = 0; i3 < 7; i3 += 1) {
        if (!(isHiddenDayHash[i3] = hiddenDays.indexOf(i3) !== -1)) {
          dayCnt += 1;
        }
      }
      if (!dayCnt) {
        throw new Error("invalid hiddenDays");
      }
      this.isHiddenDayHash = isHiddenDayHash;
    }
    // Remove days from the beginning and end of the range that are computed as hidden.
    // If the whole range is trimmed off, returns null
    trimHiddenDays(range2) {
      let { start, end } = range2;
      if (start) {
        start = this.skipHiddenDays(start);
      }
      if (end) {
        end = this.skipHiddenDays(end, -1, true);
      }
      if (start == null || end == null || start < end) {
        return { start, end };
      }
      return null;
    }
    // Is the current day hidden?
    // `day` is a day-of-week index (0-6), or a Date (used for UTC)
    isHiddenDay(day) {
      if (day instanceof Date) {
        day = day.getUTCDay();
      }
      return this.isHiddenDayHash[day];
    }
    // Incrementing the current day until it is no longer a hidden day, returning a copy.
    // DOES NOT CONSIDER validRange!
    // If the initial value of `date` is not a hidden day, don't do anything.
    // Pass `isExclusive` as `true` if you are dealing with an end date.
    // `inc` defaults to `1` (increment one day forward each time)
    skipHiddenDays(date, inc = 1, isExclusive = false) {
      while (this.isHiddenDayHash[(date.getUTCDay() + (isExclusive ? inc : 0) + 7) % 7]) {
        date = addDays(date, inc);
      }
      return date;
    }
  };
  function createEventInstance(defId, range2, forcedStartTzo, forcedEndTzo) {
    return {
      instanceId: guid(),
      defId,
      range: range2,
      forcedStartTzo: forcedStartTzo == null ? null : forcedStartTzo,
      forcedEndTzo: forcedEndTzo == null ? null : forcedEndTzo
    };
  }
  function parseRecurring(refined, defaultAllDay, dateEnv, recurringTypes) {
    for (let i3 = 0; i3 < recurringTypes.length; i3 += 1) {
      let parsed = recurringTypes[i3].parse(refined, dateEnv);
      if (parsed) {
        let { allDay } = refined;
        if (allDay == null) {
          allDay = defaultAllDay;
          if (allDay == null) {
            allDay = parsed.allDayGuess;
            if (allDay == null) {
              allDay = false;
            }
          }
        }
        return {
          allDay,
          duration: parsed.duration,
          typeData: parsed.typeData,
          typeId: i3
        };
      }
    }
    return null;
  }
  function expandRecurring(eventStore, framingRange, context) {
    let { dateEnv, pluginHooks, options } = context;
    let { defs, instances } = eventStore;
    instances = filterHash(instances, (instance) => !defs[instance.defId].recurringDef);
    for (let defId in defs) {
      let def = defs[defId];
      if (def.recurringDef) {
        let { duration } = def.recurringDef;
        if (!duration) {
          duration = def.allDay ? options.defaultAllDayEventDuration : options.defaultTimedEventDuration;
        }
        let starts = expandRecurringRanges(def, duration, framingRange, dateEnv, pluginHooks.recurringTypes);
        for (let start of starts) {
          let instance = createEventInstance(defId, {
            start,
            end: dateEnv.add(start, duration)
          });
          instances[instance.instanceId] = instance;
        }
      }
    }
    return { defs, instances };
  }
  function expandRecurringRanges(eventDef, duration, framingRange, dateEnv, recurringTypes) {
    let typeDef = recurringTypes[eventDef.recurringDef.typeId];
    let markers = typeDef.expand(eventDef.recurringDef.typeData, {
      start: dateEnv.subtract(framingRange.start, duration),
      end: framingRange.end
    }, dateEnv);
    if (eventDef.allDay) {
      markers = markers.map(startOfDay);
    }
    return markers;
  }
  var EVENT_NON_DATE_REFINERS = {
    id: String,
    groupId: String,
    title: String,
    url: String,
    interactive: Boolean
  };
  var EVENT_DATE_REFINERS = {
    start: identity,
    end: identity,
    date: identity,
    allDay: Boolean
  };
  var EVENT_REFINERS = Object.assign(Object.assign(Object.assign({}, EVENT_NON_DATE_REFINERS), EVENT_DATE_REFINERS), { extendedProps: identity });
  function parseEvent(raw, eventSource, context, allowOpenRange, refiners = buildEventRefiners(context), defIdMap, instanceIdMap) {
    let { refined, extra } = refineEventDef(raw, context, refiners);
    let defaultAllDay = computeIsDefaultAllDay(eventSource, context);
    let recurringRes = parseRecurring(refined, defaultAllDay, context.dateEnv, context.pluginHooks.recurringTypes);
    if (recurringRes) {
      let def = parseEventDef(refined, extra, eventSource ? eventSource.sourceId : "", recurringRes.allDay, Boolean(recurringRes.duration), context, defIdMap);
      def.recurringDef = {
        typeId: recurringRes.typeId,
        typeData: recurringRes.typeData,
        duration: recurringRes.duration
      };
      return { def, instance: null };
    }
    let singleRes = parseSingle(refined, defaultAllDay, context, allowOpenRange);
    if (singleRes) {
      let def = parseEventDef(refined, extra, eventSource ? eventSource.sourceId : "", singleRes.allDay, singleRes.hasEnd, context, defIdMap);
      let instance = createEventInstance(def.defId, singleRes.range, singleRes.forcedStartTzo, singleRes.forcedEndTzo);
      if (instanceIdMap && def.publicId && instanceIdMap[def.publicId]) {
        instance.instanceId = instanceIdMap[def.publicId];
      }
      return { def, instance };
    }
    return null;
  }
  function refineEventDef(raw, context, refiners = buildEventRefiners(context)) {
    return refineProps(raw, refiners);
  }
  function buildEventRefiners(context) {
    return Object.assign(Object.assign(Object.assign({}, EVENT_UI_REFINERS), EVENT_REFINERS), context.pluginHooks.eventRefiners);
  }
  function parseEventDef(refined, extra, sourceId, allDay, hasEnd, context, defIdMap) {
    let def = {
      title: refined.title || "",
      groupId: refined.groupId || "",
      publicId: refined.id || "",
      url: refined.url || "",
      recurringDef: null,
      defId: (defIdMap && refined.id ? defIdMap[refined.id] : "") || guid(),
      sourceId,
      allDay,
      hasEnd,
      interactive: refined.interactive,
      ui: createEventUi(refined, context),
      extendedProps: Object.assign(Object.assign({}, refined.extendedProps || {}), extra)
    };
    for (let memberAdder of context.pluginHooks.eventDefMemberAdders) {
      Object.assign(def, memberAdder(refined));
    }
    Object.freeze(def.ui.classNames);
    Object.freeze(def.extendedProps);
    return def;
  }
  function parseSingle(refined, defaultAllDay, context, allowOpenRange) {
    let { allDay } = refined;
    let startMeta;
    let startMarker = null;
    let hasEnd = false;
    let endMeta;
    let endMarker = null;
    let startInput = refined.start != null ? refined.start : refined.date;
    startMeta = context.dateEnv.createMarkerMeta(startInput);
    if (startMeta) {
      startMarker = startMeta.marker;
    } else if (!allowOpenRange) {
      return null;
    }
    if (refined.end != null) {
      endMeta = context.dateEnv.createMarkerMeta(refined.end);
    }
    if (allDay == null) {
      if (defaultAllDay != null) {
        allDay = defaultAllDay;
      } else {
        allDay = (!startMeta || startMeta.isTimeUnspecified) && (!endMeta || endMeta.isTimeUnspecified);
      }
    }
    if (allDay && startMarker) {
      startMarker = startOfDay(startMarker);
    }
    if (endMeta) {
      endMarker = endMeta.marker;
      if (allDay) {
        endMarker = startOfDay(endMarker);
      }
      if (startMarker && endMarker <= startMarker) {
        endMarker = null;
      }
    }
    if (endMarker) {
      hasEnd = true;
    } else if (!allowOpenRange) {
      hasEnd = context.options.forceEventDuration || false;
      endMarker = context.dateEnv.add(startMarker, allDay ? context.options.defaultAllDayEventDuration : context.options.defaultTimedEventDuration);
    }
    return {
      allDay,
      hasEnd,
      range: { start: startMarker, end: endMarker },
      forcedStartTzo: startMeta ? startMeta.forcedTzo : null,
      forcedEndTzo: endMeta ? endMeta.forcedTzo : null
    };
  }
  function computeIsDefaultAllDay(eventSource, context) {
    let res = null;
    if (eventSource) {
      res = eventSource.defaultAllDay;
    }
    if (res == null) {
      res = context.options.defaultAllDay;
    }
    return res;
  }
  function parseEvents(rawEvents, eventSource, context, allowOpenRange, defIdMap, instanceIdMap) {
    let eventStore = createEmptyEventStore();
    let eventRefiners = buildEventRefiners(context);
    for (let rawEvent of rawEvents) {
      let tuple = parseEvent(rawEvent, eventSource, context, allowOpenRange, eventRefiners, defIdMap, instanceIdMap);
      if (tuple) {
        eventTupleToStore(tuple, eventStore);
      }
    }
    return eventStore;
  }
  function eventTupleToStore(tuple, eventStore = createEmptyEventStore()) {
    eventStore.defs[tuple.def.defId] = tuple.def;
    if (tuple.instance) {
      eventStore.instances[tuple.instance.instanceId] = tuple.instance;
    }
    return eventStore;
  }
  function getRelevantEvents(eventStore, instanceId) {
    let instance = eventStore.instances[instanceId];
    if (instance) {
      let def = eventStore.defs[instance.defId];
      let newStore = filterEventStoreDefs(eventStore, (lookDef) => isEventDefsGrouped(def, lookDef));
      newStore.defs[def.defId] = def;
      newStore.instances[instance.instanceId] = instance;
      return newStore;
    }
    return createEmptyEventStore();
  }
  function isEventDefsGrouped(def0, def1) {
    return Boolean(def0.groupId && def0.groupId === def1.groupId);
  }
  function createEmptyEventStore() {
    return { defs: {}, instances: {} };
  }
  function mergeEventStores(store0, store1) {
    return {
      defs: Object.assign(Object.assign({}, store0.defs), store1.defs),
      instances: Object.assign(Object.assign({}, store0.instances), store1.instances)
    };
  }
  function filterEventStoreDefs(eventStore, filterFunc) {
    let defs = filterHash(eventStore.defs, filterFunc);
    let instances = filterHash(eventStore.instances, (instance) => defs[instance.defId]);
    return { defs, instances };
  }
  function excludeSubEventStore(master, sub) {
    let { defs, instances } = master;
    let filteredDefs = {};
    let filteredInstances = {};
    for (let defId in defs) {
      if (!sub.defs[defId]) {
        filteredDefs[defId] = defs[defId];
      }
    }
    for (let instanceId in instances) {
      if (!sub.instances[instanceId] && // not explicitly excluded
      filteredDefs[instances[instanceId].defId]) {
        filteredInstances[instanceId] = instances[instanceId];
      }
    }
    return {
      defs: filteredDefs,
      instances: filteredInstances
    };
  }
  function normalizeConstraint(input, context) {
    if (Array.isArray(input)) {
      return parseEvents(input, null, context, true);
    }
    if (typeof input === "object" && input) {
      return parseEvents([input], null, context, true);
    }
    if (input != null) {
      return String(input);
    }
    return null;
  }
  function parseClassNames(raw) {
    if (Array.isArray(raw)) {
      return raw;
    }
    if (typeof raw === "string") {
      return raw.split(/\s+/);
    }
    return [];
  }
  var EVENT_UI_REFINERS = {
    display: String,
    editable: Boolean,
    startEditable: Boolean,
    durationEditable: Boolean,
    constraint: identity,
    overlap: identity,
    allow: identity,
    className: parseClassNames,
    classNames: parseClassNames,
    color: String,
    backgroundColor: String,
    borderColor: String,
    textColor: String
  };
  var EMPTY_EVENT_UI = {
    display: null,
    startEditable: null,
    durationEditable: null,
    constraints: [],
    overlap: null,
    allows: [],
    backgroundColor: "",
    borderColor: "",
    textColor: "",
    classNames: []
  };
  function createEventUi(refined, context) {
    let constraint = normalizeConstraint(refined.constraint, context);
    return {
      display: refined.display || null,
      startEditable: refined.startEditable != null ? refined.startEditable : refined.editable,
      durationEditable: refined.durationEditable != null ? refined.durationEditable : refined.editable,
      constraints: constraint != null ? [constraint] : [],
      overlap: refined.overlap != null ? refined.overlap : null,
      allows: refined.allow != null ? [refined.allow] : [],
      backgroundColor: refined.backgroundColor || refined.color || "",
      borderColor: refined.borderColor || refined.color || "",
      textColor: refined.textColor || "",
      classNames: (refined.className || []).concat(refined.classNames || [])
      // join singular and plural
    };
  }
  function combineEventUis(uis) {
    return uis.reduce(combineTwoEventUis, EMPTY_EVENT_UI);
  }
  function combineTwoEventUis(item0, item1) {
    return {
      display: item1.display != null ? item1.display : item0.display,
      startEditable: item1.startEditable != null ? item1.startEditable : item0.startEditable,
      durationEditable: item1.durationEditable != null ? item1.durationEditable : item0.durationEditable,
      constraints: item0.constraints.concat(item1.constraints),
      overlap: typeof item1.overlap === "boolean" ? item1.overlap : item0.overlap,
      allows: item0.allows.concat(item1.allows),
      backgroundColor: item1.backgroundColor || item0.backgroundColor,
      borderColor: item1.borderColor || item0.borderColor,
      textColor: item1.textColor || item0.textColor,
      classNames: item0.classNames.concat(item1.classNames)
    };
  }
  var EVENT_SOURCE_REFINERS = {
    id: String,
    defaultAllDay: Boolean,
    url: String,
    format: String,
    events: identity,
    eventDataTransform: identity,
    // for any network-related sources
    success: identity,
    failure: identity
  };
  function parseEventSource(raw, context, refiners = buildEventSourceRefiners(context)) {
    let rawObj;
    if (typeof raw === "string") {
      rawObj = { url: raw };
    } else if (typeof raw === "function" || Array.isArray(raw)) {
      rawObj = { events: raw };
    } else if (typeof raw === "object" && raw) {
      rawObj = raw;
    }
    if (rawObj) {
      let { refined, extra } = refineProps(rawObj, refiners);
      let metaRes = buildEventSourceMeta(refined, context);
      if (metaRes) {
        return {
          _raw: raw,
          isFetching: false,
          latestFetchId: "",
          fetchRange: null,
          defaultAllDay: refined.defaultAllDay,
          eventDataTransform: refined.eventDataTransform,
          success: refined.success,
          failure: refined.failure,
          publicId: refined.id || "",
          sourceId: guid(),
          sourceDefId: metaRes.sourceDefId,
          meta: metaRes.meta,
          ui: createEventUi(refined, context),
          extendedProps: extra
        };
      }
    }
    return null;
  }
  function buildEventSourceRefiners(context) {
    return Object.assign(Object.assign(Object.assign({}, EVENT_UI_REFINERS), EVENT_SOURCE_REFINERS), context.pluginHooks.eventSourceRefiners);
  }
  function buildEventSourceMeta(raw, context) {
    let defs = context.pluginHooks.eventSourceDefs;
    for (let i3 = defs.length - 1; i3 >= 0; i3 -= 1) {
      let def = defs[i3];
      let meta = def.parseMeta(raw);
      if (meta) {
        return { sourceDefId: i3, meta };
      }
    }
    return null;
  }
  function reduceEventStore(eventStore, action, eventSources, dateProfile, context) {
    switch (action.type) {
      case "RECEIVE_EVENTS":
        return receiveRawEvents(eventStore, eventSources[action.sourceId], action.fetchId, action.fetchRange, action.rawEvents, context);
      case "RESET_RAW_EVENTS":
        return resetRawEvents(eventStore, eventSources[action.sourceId], action.rawEvents, dateProfile.activeRange, context);
      case "ADD_EVENTS":
        return addEvent(
          eventStore,
          action.eventStore,
          // new ones
          dateProfile ? dateProfile.activeRange : null,
          context
        );
      case "RESET_EVENTS":
        return action.eventStore;
      case "MERGE_EVENTS":
        return mergeEventStores(eventStore, action.eventStore);
      case "PREV":
      // TODO: how do we track all actions that affect dateProfile :(
      case "NEXT":
      case "CHANGE_DATE":
      case "CHANGE_VIEW_TYPE":
        if (dateProfile) {
          return expandRecurring(eventStore, dateProfile.activeRange, context);
        }
        return eventStore;
      case "REMOVE_EVENTS":
        return excludeSubEventStore(eventStore, action.eventStore);
      case "REMOVE_EVENT_SOURCE":
        return excludeEventsBySourceId(eventStore, action.sourceId);
      case "REMOVE_ALL_EVENT_SOURCES":
        return filterEventStoreDefs(eventStore, (eventDef) => !eventDef.sourceId);
      case "REMOVE_ALL_EVENTS":
        return createEmptyEventStore();
      default:
        return eventStore;
    }
  }
  function receiveRawEvents(eventStore, eventSource, fetchId, fetchRange, rawEvents, context) {
    if (eventSource && // not already removed
    fetchId === eventSource.latestFetchId) {
      let subset = parseEvents(transformRawEvents(rawEvents, eventSource, context), eventSource, context);
      if (fetchRange) {
        subset = expandRecurring(subset, fetchRange, context);
      }
      return mergeEventStores(excludeEventsBySourceId(eventStore, eventSource.sourceId), subset);
    }
    return eventStore;
  }
  function resetRawEvents(existingEventStore, eventSource, rawEvents, activeRange, context) {
    const { defIdMap, instanceIdMap } = buildPublicIdMaps(existingEventStore);
    let newEventStore = parseEvents(transformRawEvents(rawEvents, eventSource, context), eventSource, context, false, defIdMap, instanceIdMap);
    return expandRecurring(newEventStore, activeRange, context);
  }
  function transformRawEvents(rawEvents, eventSource, context) {
    let calEachTransform = context.options.eventDataTransform;
    let sourceEachTransform = eventSource ? eventSource.eventDataTransform : null;
    if (sourceEachTransform) {
      rawEvents = transformEachRawEvent(rawEvents, sourceEachTransform);
    }
    if (calEachTransform) {
      rawEvents = transformEachRawEvent(rawEvents, calEachTransform);
    }
    return rawEvents;
  }
  function transformEachRawEvent(rawEvents, func) {
    let refinedEvents;
    if (!func) {
      refinedEvents = rawEvents;
    } else {
      refinedEvents = [];
      for (let rawEvent of rawEvents) {
        let refinedEvent = func(rawEvent);
        if (refinedEvent) {
          refinedEvents.push(refinedEvent);
        } else if (refinedEvent == null) {
          refinedEvents.push(rawEvent);
        }
      }
    }
    return refinedEvents;
  }
  function addEvent(eventStore, subset, expandRange, context) {
    if (expandRange) {
      subset = expandRecurring(subset, expandRange, context);
    }
    return mergeEventStores(eventStore, subset);
  }
  function rezoneEventStoreDates(eventStore, oldDateEnv, newDateEnv) {
    let { defs } = eventStore;
    let instances = mapHash(eventStore.instances, (instance) => {
      let def = defs[instance.defId];
      if (def.allDay) {
        return instance;
      }
      return Object.assign(Object.assign({}, instance), { range: {
        start: newDateEnv.createMarker(oldDateEnv.toDate(instance.range.start, instance.forcedStartTzo)),
        end: newDateEnv.createMarker(oldDateEnv.toDate(instance.range.end, instance.forcedEndTzo))
      }, forcedStartTzo: newDateEnv.canComputeOffset ? null : instance.forcedStartTzo, forcedEndTzo: newDateEnv.canComputeOffset ? null : instance.forcedEndTzo });
    });
    return { defs, instances };
  }
  function excludeEventsBySourceId(eventStore, sourceId) {
    return filterEventStoreDefs(eventStore, (eventDef) => eventDef.sourceId !== sourceId);
  }
  function buildPublicIdMaps(eventStore) {
    const { defs, instances } = eventStore;
    const defIdMap = {};
    const instanceIdMap = {};
    for (let defId in defs) {
      const def = defs[defId];
      const { publicId } = def;
      if (publicId) {
        defIdMap[publicId] = defId;
      }
    }
    for (let instanceId in instances) {
      const instance = instances[instanceId];
      const def = defs[instance.defId];
      const { publicId } = def;
      if (publicId) {
        instanceIdMap[publicId] = instanceId;
      }
    }
    return { defIdMap, instanceIdMap };
  }
  var Emitter = class {
    constructor() {
      this.handlers = {};
      this.thisContext = null;
    }
    setThisContext(thisContext) {
      this.thisContext = thisContext;
    }
    setOptions(options) {
      this.options = options;
    }
    on(type, handler) {
      addToHash(this.handlers, type, handler);
    }
    off(type, handler) {
      removeFromHash(this.handlers, type, handler);
    }
    trigger(type, ...args) {
      let attachedHandlers = this.handlers[type] || [];
      let optionHandler = this.options && this.options[type];
      let handlers = [].concat(optionHandler || [], attachedHandlers);
      for (let handler of handlers) {
        handler.apply(this.thisContext, args);
      }
    }
    hasHandlers(type) {
      return Boolean(this.handlers[type] && this.handlers[type].length || this.options && this.options[type]);
    }
  };
  function addToHash(hash, type, handler) {
    (hash[type] || (hash[type] = [])).push(handler);
  }
  function removeFromHash(hash, type, handler) {
    if (handler) {
      if (hash[type]) {
        hash[type] = hash[type].filter((func) => func !== handler);
      }
    } else {
      delete hash[type];
    }
  }
  var DEF_DEFAULTS = {
    startTime: "09:00",
    endTime: "17:00",
    daysOfWeek: [1, 2, 3, 4, 5],
    display: "inverse-background",
    classNames: "fc-non-business",
    groupId: "_businessHours"
    // so multiple defs get grouped
  };
  function parseBusinessHours(input, context) {
    return parseEvents(refineInputs(input), null, context);
  }
  function refineInputs(input) {
    let rawDefs;
    if (input === true) {
      rawDefs = [{}];
    } else if (Array.isArray(input)) {
      rawDefs = input.filter((rawDef) => rawDef.daysOfWeek);
    } else if (typeof input === "object" && input) {
      rawDefs = [input];
    } else {
      rawDefs = [];
    }
    rawDefs = rawDefs.map((rawDef) => Object.assign(Object.assign({}, DEF_DEFAULTS), rawDef));
    return rawDefs;
  }
  function triggerDateSelect(selection, pev, context) {
    context.emitter.trigger("select", Object.assign(Object.assign({}, buildDateSpanApiWithContext(selection, context)), { jsEvent: pev ? pev.origEvent : null, view: context.viewApi || context.calendarApi.view }));
  }
  function triggerDateUnselect(pev, context) {
    context.emitter.trigger("unselect", {
      jsEvent: pev ? pev.origEvent : null,
      view: context.viewApi || context.calendarApi.view
    });
  }
  function buildDateSpanApiWithContext(dateSpan, context) {
    let props = {};
    for (let transform of context.pluginHooks.dateSpanTransforms) {
      Object.assign(props, transform(dateSpan, context));
    }
    Object.assign(props, buildDateSpanApi(dateSpan, context.dateEnv));
    return props;
  }
  function getDefaultEventEnd(allDay, marker, context) {
    let { dateEnv, options } = context;
    let end = marker;
    if (allDay) {
      end = startOfDay(end);
      end = dateEnv.add(end, options.defaultAllDayEventDuration);
    } else {
      end = dateEnv.add(end, options.defaultTimedEventDuration);
    }
    return end;
  }
  function applyMutationToEventStore(eventStore, eventConfigBase, mutation, context) {
    let eventConfigs = compileEventUis(eventStore.defs, eventConfigBase);
    let dest = createEmptyEventStore();
    for (let defId in eventStore.defs) {
      let def = eventStore.defs[defId];
      dest.defs[defId] = applyMutationToEventDef(def, eventConfigs[defId], mutation, context);
    }
    for (let instanceId in eventStore.instances) {
      let instance = eventStore.instances[instanceId];
      let def = dest.defs[instance.defId];
      dest.instances[instanceId] = applyMutationToEventInstance(instance, def, eventConfigs[instance.defId], mutation, context);
    }
    return dest;
  }
  function applyMutationToEventDef(eventDef, eventConfig, mutation, context) {
    let standardProps = mutation.standardProps || {};
    if (standardProps.hasEnd == null && eventConfig.durationEditable && (mutation.startDelta || mutation.endDelta)) {
      standardProps.hasEnd = true;
    }
    let copy = Object.assign(Object.assign(Object.assign({}, eventDef), standardProps), { ui: Object.assign(Object.assign({}, eventDef.ui), standardProps.ui) });
    if (mutation.extendedProps) {
      copy.extendedProps = Object.assign(Object.assign({}, copy.extendedProps), mutation.extendedProps);
    }
    for (let applier of context.pluginHooks.eventDefMutationAppliers) {
      applier(copy, mutation, context);
    }
    if (!copy.hasEnd && context.options.forceEventDuration) {
      copy.hasEnd = true;
    }
    return copy;
  }
  function applyMutationToEventInstance(eventInstance, eventDef, eventConfig, mutation, context) {
    let { dateEnv } = context;
    let forceAllDay = mutation.standardProps && mutation.standardProps.allDay === true;
    let clearEnd = mutation.standardProps && mutation.standardProps.hasEnd === false;
    let copy = Object.assign({}, eventInstance);
    if (forceAllDay) {
      copy.range = computeAlignedDayRange(copy.range);
    }
    if (mutation.datesDelta && eventConfig.startEditable) {
      copy.range = {
        start: dateEnv.add(copy.range.start, mutation.datesDelta),
        end: dateEnv.add(copy.range.end, mutation.datesDelta)
      };
    }
    if (mutation.startDelta && eventConfig.durationEditable) {
      copy.range = {
        start: dateEnv.add(copy.range.start, mutation.startDelta),
        end: copy.range.end
      };
    }
    if (mutation.endDelta && eventConfig.durationEditable) {
      copy.range = {
        start: copy.range.start,
        end: dateEnv.add(copy.range.end, mutation.endDelta)
      };
    }
    if (clearEnd) {
      copy.range = {
        start: copy.range.start,
        end: getDefaultEventEnd(eventDef.allDay, copy.range.start, context)
      };
    }
    if (eventDef.allDay) {
      copy.range = {
        start: startOfDay(copy.range.start),
        end: startOfDay(copy.range.end)
      };
    }
    if (copy.range.end < copy.range.start) {
      copy.range.end = getDefaultEventEnd(eventDef.allDay, copy.range.start, context);
    }
    return copy;
  }
  var EventSourceImpl = class {
    constructor(context, internalEventSource) {
      this.context = context;
      this.internalEventSource = internalEventSource;
    }
    remove() {
      this.context.dispatch({
        type: "REMOVE_EVENT_SOURCE",
        sourceId: this.internalEventSource.sourceId
      });
    }
    refetch() {
      this.context.dispatch({
        type: "FETCH_EVENT_SOURCES",
        sourceIds: [this.internalEventSource.sourceId],
        isRefetch: true
      });
    }
    get id() {
      return this.internalEventSource.publicId;
    }
    get url() {
      return this.internalEventSource.meta.url;
    }
    get format() {
      return this.internalEventSource.meta.format;
    }
  };
  var EventImpl = class _EventImpl {
    // instance will be null if expressing a recurring event that has no current instances,
    // OR if trying to validate an incoming external event that has no dates assigned
    constructor(context, def, instance) {
      this._context = context;
      this._def = def;
      this._instance = instance || null;
    }
    /*
    TODO: make event struct more responsible for this
    */
    setProp(name, val) {
      if (name in EVENT_DATE_REFINERS) {
        console.warn("Could not set date-related prop 'name'. Use one of the date-related methods instead.");
      } else if (name === "id") {
        val = EVENT_NON_DATE_REFINERS[name](val);
        this.mutate({
          standardProps: { publicId: val }
          // hardcoded internal name
        });
      } else if (name in EVENT_NON_DATE_REFINERS) {
        val = EVENT_NON_DATE_REFINERS[name](val);
        this.mutate({
          standardProps: { [name]: val }
        });
      } else if (name in EVENT_UI_REFINERS) {
        let ui = EVENT_UI_REFINERS[name](val);
        if (name === "color") {
          ui = { backgroundColor: val, borderColor: val };
        } else if (name === "editable") {
          ui = { startEditable: val, durationEditable: val };
        } else {
          ui = { [name]: val };
        }
        this.mutate({
          standardProps: { ui }
        });
      } else {
        console.warn(`Could not set prop '${name}'. Use setExtendedProp instead.`);
      }
    }
    setExtendedProp(name, val) {
      this.mutate({
        extendedProps: { [name]: val }
      });
    }
    setStart(startInput, options = {}) {
      let { dateEnv } = this._context;
      let start = dateEnv.createMarker(startInput);
      if (start && this._instance) {
        let instanceRange = this._instance.range;
        let startDelta = diffDates(instanceRange.start, start, dateEnv, options.granularity);
        if (options.maintainDuration) {
          this.mutate({ datesDelta: startDelta });
        } else {
          this.mutate({ startDelta });
        }
      }
    }
    setEnd(endInput, options = {}) {
      let { dateEnv } = this._context;
      let end;
      if (endInput != null) {
        end = dateEnv.createMarker(endInput);
        if (!end) {
          return;
        }
      }
      if (this._instance) {
        if (end) {
          let endDelta = diffDates(this._instance.range.end, end, dateEnv, options.granularity);
          this.mutate({ endDelta });
        } else {
          this.mutate({ standardProps: { hasEnd: false } });
        }
      }
    }
    setDates(startInput, endInput, options = {}) {
      let { dateEnv } = this._context;
      let standardProps = { allDay: options.allDay };
      let start = dateEnv.createMarker(startInput);
      let end;
      if (!start) {
        return;
      }
      if (endInput != null) {
        end = dateEnv.createMarker(endInput);
        if (!end) {
          return;
        }
      }
      if (this._instance) {
        let instanceRange = this._instance.range;
        if (options.allDay === true) {
          instanceRange = computeAlignedDayRange(instanceRange);
        }
        let startDelta = diffDates(instanceRange.start, start, dateEnv, options.granularity);
        if (end) {
          let endDelta = diffDates(instanceRange.end, end, dateEnv, options.granularity);
          if (durationsEqual(startDelta, endDelta)) {
            this.mutate({ datesDelta: startDelta, standardProps });
          } else {
            this.mutate({ startDelta, endDelta, standardProps });
          }
        } else {
          standardProps.hasEnd = false;
          this.mutate({ datesDelta: startDelta, standardProps });
        }
      }
    }
    moveStart(deltaInput) {
      let delta = createDuration(deltaInput);
      if (delta) {
        this.mutate({ startDelta: delta });
      }
    }
    moveEnd(deltaInput) {
      let delta = createDuration(deltaInput);
      if (delta) {
        this.mutate({ endDelta: delta });
      }
    }
    moveDates(deltaInput) {
      let delta = createDuration(deltaInput);
      if (delta) {
        this.mutate({ datesDelta: delta });
      }
    }
    setAllDay(allDay, options = {}) {
      let standardProps = { allDay };
      let { maintainDuration } = options;
      if (maintainDuration == null) {
        maintainDuration = this._context.options.allDayMaintainDuration;
      }
      if (this._def.allDay !== allDay) {
        standardProps.hasEnd = maintainDuration;
      }
      this.mutate({ standardProps });
    }
    formatRange(formatInput) {
      let { dateEnv } = this._context;
      let instance = this._instance;
      let formatter = createFormatter(formatInput);
      if (this._def.hasEnd) {
        return dateEnv.formatRange(instance.range.start, instance.range.end, formatter, {
          forcedStartTzo: instance.forcedStartTzo,
          forcedEndTzo: instance.forcedEndTzo
        });
      }
      return dateEnv.format(instance.range.start, formatter, {
        forcedTzo: instance.forcedStartTzo
      });
    }
    mutate(mutation) {
      let instance = this._instance;
      if (instance) {
        let def = this._def;
        let context = this._context;
        let { eventStore } = context.getCurrentData();
        let relevantEvents = getRelevantEvents(eventStore, instance.instanceId);
        let eventConfigBase = {
          "": {
            display: "",
            startEditable: true,
            durationEditable: true,
            constraints: [],
            overlap: null,
            allows: [],
            backgroundColor: "",
            borderColor: "",
            textColor: "",
            classNames: []
          }
        };
        relevantEvents = applyMutationToEventStore(relevantEvents, eventConfigBase, mutation, context);
        let oldEvent = new _EventImpl(context, def, instance);
        this._def = relevantEvents.defs[def.defId];
        this._instance = relevantEvents.instances[instance.instanceId];
        context.dispatch({
          type: "MERGE_EVENTS",
          eventStore: relevantEvents
        });
        context.emitter.trigger("eventChange", {
          oldEvent,
          event: this,
          relatedEvents: buildEventApis(relevantEvents, context, instance),
          revert() {
            context.dispatch({
              type: "RESET_EVENTS",
              eventStore
              // the ORIGINAL store
            });
          }
        });
      }
    }
    remove() {
      let context = this._context;
      let asStore = eventApiToStore(this);
      context.dispatch({
        type: "REMOVE_EVENTS",
        eventStore: asStore
      });
      context.emitter.trigger("eventRemove", {
        event: this,
        relatedEvents: [],
        revert() {
          context.dispatch({
            type: "MERGE_EVENTS",
            eventStore: asStore
          });
        }
      });
    }
    get source() {
      let { sourceId } = this._def;
      if (sourceId) {
        return new EventSourceImpl(this._context, this._context.getCurrentData().eventSources[sourceId]);
      }
      return null;
    }
    get start() {
      return this._instance ? this._context.dateEnv.toDate(this._instance.range.start) : null;
    }
    get end() {
      return this._instance && this._def.hasEnd ? this._context.dateEnv.toDate(this._instance.range.end) : null;
    }
    get startStr() {
      let instance = this._instance;
      if (instance) {
        return this._context.dateEnv.formatIso(instance.range.start, {
          omitTime: this._def.allDay,
          forcedTzo: instance.forcedStartTzo
        });
      }
      return "";
    }
    get endStr() {
      let instance = this._instance;
      if (instance && this._def.hasEnd) {
        return this._context.dateEnv.formatIso(instance.range.end, {
          omitTime: this._def.allDay,
          forcedTzo: instance.forcedEndTzo
        });
      }
      return "";
    }
    // computable props that all access the def
    // TODO: find a TypeScript-compatible way to do this at scale
    get id() {
      return this._def.publicId;
    }
    get groupId() {
      return this._def.groupId;
    }
    get allDay() {
      return this._def.allDay;
    }
    get title() {
      return this._def.title;
    }
    get url() {
      return this._def.url;
    }
    get display() {
      return this._def.ui.display || "auto";
    }
    // bad. just normalize the type earlier
    get startEditable() {
      return this._def.ui.startEditable;
    }
    get durationEditable() {
      return this._def.ui.durationEditable;
    }
    get constraint() {
      return this._def.ui.constraints[0] || null;
    }
    get overlap() {
      return this._def.ui.overlap;
    }
    get allow() {
      return this._def.ui.allows[0] || null;
    }
    get backgroundColor() {
      return this._def.ui.backgroundColor;
    }
    get borderColor() {
      return this._def.ui.borderColor;
    }
    get textColor() {
      return this._def.ui.textColor;
    }
    // NOTE: user can't modify these because Object.freeze was called in event-def parsing
    get classNames() {
      return this._def.ui.classNames;
    }
    get extendedProps() {
      return this._def.extendedProps;
    }
    toPlainObject(settings = {}) {
      let def = this._def;
      let { ui } = def;
      let { startStr, endStr } = this;
      let res = {
        allDay: def.allDay
      };
      if (def.title) {
        res.title = def.title;
      }
      if (startStr) {
        res.start = startStr;
      }
      if (endStr) {
        res.end = endStr;
      }
      if (def.publicId) {
        res.id = def.publicId;
      }
      if (def.groupId) {
        res.groupId = def.groupId;
      }
      if (def.url) {
        res.url = def.url;
      }
      if (ui.display && ui.display !== "auto") {
        res.display = ui.display;
      }
      if (settings.collapseColor && ui.backgroundColor && ui.backgroundColor === ui.borderColor) {
        res.color = ui.backgroundColor;
      } else {
        if (ui.backgroundColor) {
          res.backgroundColor = ui.backgroundColor;
        }
        if (ui.borderColor) {
          res.borderColor = ui.borderColor;
        }
      }
      if (ui.textColor) {
        res.textColor = ui.textColor;
      }
      if (ui.classNames.length) {
        res.classNames = ui.classNames;
      }
      if (Object.keys(def.extendedProps).length) {
        if (settings.collapseExtendedProps) {
          Object.assign(res, def.extendedProps);
        } else {
          res.extendedProps = def.extendedProps;
        }
      }
      return res;
    }
    toJSON() {
      return this.toPlainObject();
    }
  };
  function eventApiToStore(eventApi) {
    let def = eventApi._def;
    let instance = eventApi._instance;
    return {
      defs: { [def.defId]: def },
      instances: instance ? { [instance.instanceId]: instance } : {}
    };
  }
  function buildEventApis(eventStore, context, excludeInstance) {
    let { defs, instances } = eventStore;
    let eventApis = [];
    let excludeInstanceId = excludeInstance ? excludeInstance.instanceId : "";
    for (let id in instances) {
      let instance = instances[id];
      let def = defs[instance.defId];
      if (instance.instanceId !== excludeInstanceId) {
        eventApis.push(new EventImpl(context, def, instance));
      }
    }
    return eventApis;
  }
  function sliceEventStore(eventStore, eventUiBases, framingRange, nextDayThreshold) {
    let inverseBgByGroupId = {};
    let inverseBgByDefId = {};
    let defByGroupId = {};
    let bgRanges = [];
    let fgRanges = [];
    let eventUis = compileEventUis(eventStore.defs, eventUiBases);
    for (let defId in eventStore.defs) {
      let def = eventStore.defs[defId];
      let ui = eventUis[def.defId];
      if (ui.display === "inverse-background") {
        if (def.groupId) {
          inverseBgByGroupId[def.groupId] = [];
          if (!defByGroupId[def.groupId]) {
            defByGroupId[def.groupId] = def;
          }
        } else {
          inverseBgByDefId[defId] = [];
        }
      }
    }
    for (let instanceId in eventStore.instances) {
      let instance = eventStore.instances[instanceId];
      let def = eventStore.defs[instance.defId];
      let ui = eventUis[def.defId];
      let origRange = instance.range;
      let normalRange = !def.allDay && nextDayThreshold ? computeVisibleDayRange(origRange, nextDayThreshold) : origRange;
      let slicedRange = intersectRanges(normalRange, framingRange);
      if (slicedRange) {
        if (ui.display === "inverse-background") {
          if (def.groupId) {
            inverseBgByGroupId[def.groupId].push(slicedRange);
          } else {
            inverseBgByDefId[instance.defId].push(slicedRange);
          }
        } else if (ui.display !== "none") {
          (ui.display === "background" ? bgRanges : fgRanges).push({
            def,
            ui,
            instance,
            range: slicedRange,
            isStart: normalRange.start && normalRange.start.valueOf() === slicedRange.start.valueOf(),
            isEnd: normalRange.end && normalRange.end.valueOf() === slicedRange.end.valueOf()
          });
        }
      }
    }
    for (let groupId in inverseBgByGroupId) {
      let ranges = inverseBgByGroupId[groupId];
      let invertedRanges = invertRanges(ranges, framingRange);
      for (let invertedRange of invertedRanges) {
        let def = defByGroupId[groupId];
        let ui = eventUis[def.defId];
        bgRanges.push({
          def,
          ui,
          instance: null,
          range: invertedRange,
          isStart: false,
          isEnd: false
        });
      }
    }
    for (let defId in inverseBgByDefId) {
      let ranges = inverseBgByDefId[defId];
      let invertedRanges = invertRanges(ranges, framingRange);
      for (let invertedRange of invertedRanges) {
        bgRanges.push({
          def: eventStore.defs[defId],
          ui: eventUis[defId],
          instance: null,
          range: invertedRange,
          isStart: false,
          isEnd: false
        });
      }
    }
    return { bg: bgRanges, fg: fgRanges };
  }
  function hasBgRendering(def) {
    return def.ui.display === "background" || def.ui.display === "inverse-background";
  }
  function setElSeg(el, seg) {
    el.fcSeg = seg;
  }
  function getElSeg(el) {
    return el.fcSeg || el.parentNode.fcSeg || // for the harness
    null;
  }
  function compileEventUis(eventDefs, eventUiBases) {
    return mapHash(eventDefs, (eventDef) => compileEventUi(eventDef, eventUiBases));
  }
  function compileEventUi(eventDef, eventUiBases) {
    let uis = [];
    if (eventUiBases[""]) {
      uis.push(eventUiBases[""]);
    }
    if (eventUiBases[eventDef.defId]) {
      uis.push(eventUiBases[eventDef.defId]);
    }
    uis.push(eventDef.ui);
    return combineEventUis(uis);
  }
  function sortEventSegs(segs, eventOrderSpecs) {
    let objs = segs.map(buildSegCompareObj);
    objs.sort((obj0, obj1) => compareByFieldSpecs(obj0, obj1, eventOrderSpecs));
    return objs.map((c3) => c3._seg);
  }
  function buildSegCompareObj(seg) {
    let { eventRange } = seg;
    let eventDef = eventRange.def;
    let range2 = eventRange.instance ? eventRange.instance.range : eventRange.range;
    let start = range2.start ? range2.start.valueOf() : 0;
    let end = range2.end ? range2.end.valueOf() : 0;
    return Object.assign(Object.assign(Object.assign({}, eventDef.extendedProps), eventDef), {
      id: eventDef.publicId,
      start,
      end,
      duration: end - start,
      allDay: Number(eventDef.allDay),
      _seg: seg
    });
  }
  function computeSegDraggable(seg, context) {
    let { pluginHooks } = context;
    let transformers = pluginHooks.isDraggableTransformers;
    let { def, ui } = seg.eventRange;
    let val = ui.startEditable;
    for (let transformer of transformers) {
      val = transformer(val, def, ui, context);
    }
    return val;
  }
  function computeSegStartResizable(seg, context) {
    return seg.isStart && seg.eventRange.ui.durationEditable && context.options.eventResizableFromStart;
  }
  function computeSegEndResizable(seg, context) {
    return seg.isEnd && seg.eventRange.ui.durationEditable;
  }
  function buildSegTimeText(seg, timeFormat, context, defaultDisplayEventTime, defaultDisplayEventEnd, startOverride, endOverride) {
    let { dateEnv, options } = context;
    let { displayEventTime, displayEventEnd } = options;
    let eventDef = seg.eventRange.def;
    let eventInstance = seg.eventRange.instance;
    if (displayEventTime == null) {
      displayEventTime = defaultDisplayEventTime !== false;
    }
    if (displayEventEnd == null) {
      displayEventEnd = defaultDisplayEventEnd !== false;
    }
    let wholeEventStart = eventInstance.range.start;
    let wholeEventEnd = eventInstance.range.end;
    let segStart = startOverride || seg.start || seg.eventRange.range.start;
    let segEnd = endOverride || seg.end || seg.eventRange.range.end;
    let isStartDay = startOfDay(wholeEventStart).valueOf() === startOfDay(segStart).valueOf();
    let isEndDay = startOfDay(addMs(wholeEventEnd, -1)).valueOf() === startOfDay(addMs(segEnd, -1)).valueOf();
    if (displayEventTime && !eventDef.allDay && (isStartDay || isEndDay)) {
      segStart = isStartDay ? wholeEventStart : segStart;
      segEnd = isEndDay ? wholeEventEnd : segEnd;
      if (displayEventEnd && eventDef.hasEnd) {
        return dateEnv.formatRange(segStart, segEnd, timeFormat, {
          forcedStartTzo: startOverride ? null : eventInstance.forcedStartTzo,
          forcedEndTzo: endOverride ? null : eventInstance.forcedEndTzo
        });
      }
      return dateEnv.format(segStart, timeFormat, {
        forcedTzo: startOverride ? null : eventInstance.forcedStartTzo
        // nooooo, same
      });
    }
    return "";
  }
  function getSegMeta(seg, todayRange, nowDate) {
    let segRange = seg.eventRange.range;
    return {
      isPast: segRange.end <= (nowDate || todayRange.start),
      isFuture: segRange.start >= (nowDate || todayRange.end),
      isToday: todayRange && rangeContainsMarker(todayRange, segRange.start)
    };
  }
  function getEventClassNames(props) {
    let classNames = ["fc-event"];
    if (props.isMirror) {
      classNames.push("fc-event-mirror");
    }
    if (props.isDraggable) {
      classNames.push("fc-event-draggable");
    }
    if (props.isStartResizable || props.isEndResizable) {
      classNames.push("fc-event-resizable");
    }
    if (props.isDragging) {
      classNames.push("fc-event-dragging");
    }
    if (props.isResizing) {
      classNames.push("fc-event-resizing");
    }
    if (props.isSelected) {
      classNames.push("fc-event-selected");
    }
    if (props.isStart) {
      classNames.push("fc-event-start");
    }
    if (props.isEnd) {
      classNames.push("fc-event-end");
    }
    if (props.isPast) {
      classNames.push("fc-event-past");
    }
    if (props.isToday) {
      classNames.push("fc-event-today");
    }
    if (props.isFuture) {
      classNames.push("fc-event-future");
    }
    return classNames;
  }
  function buildEventRangeKey(eventRange) {
    return eventRange.instance ? eventRange.instance.instanceId : `${eventRange.def.defId}:${eventRange.range.start.toISOString()}`;
  }
  function getSegAnchorAttrs(seg, context) {
    let { def, instance } = seg.eventRange;
    let { url } = def;
    if (url) {
      return { href: url };
    }
    let { emitter, options } = context;
    let { eventInteractive } = options;
    if (eventInteractive == null) {
      eventInteractive = def.interactive;
      if (eventInteractive == null) {
        eventInteractive = Boolean(emitter.hasHandlers("eventClick"));
      }
    }
    if (eventInteractive) {
      return createAriaKeyboardAttrs((ev) => {
        emitter.trigger("eventClick", {
          el: ev.target,
          event: new EventImpl(context, def, instance),
          jsEvent: ev,
          view: context.viewApi
        });
      });
    }
    return {};
  }
  var STANDARD_PROPS = {
    start: identity,
    end: identity,
    allDay: Boolean
  };
  function parseDateSpan(raw, dateEnv, defaultDuration) {
    let span = parseOpenDateSpan(raw, dateEnv);
    let { range: range2 } = span;
    if (!range2.start) {
      return null;
    }
    if (!range2.end) {
      if (defaultDuration == null) {
        return null;
      }
      range2.end = dateEnv.add(range2.start, defaultDuration);
    }
    return span;
  }
  function parseOpenDateSpan(raw, dateEnv) {
    let { refined: standardProps, extra } = refineProps(raw, STANDARD_PROPS);
    let startMeta = standardProps.start ? dateEnv.createMarkerMeta(standardProps.start) : null;
    let endMeta = standardProps.end ? dateEnv.createMarkerMeta(standardProps.end) : null;
    let { allDay } = standardProps;
    if (allDay == null) {
      allDay = startMeta && startMeta.isTimeUnspecified && (!endMeta || endMeta.isTimeUnspecified);
    }
    return Object.assign({ range: {
      start: startMeta ? startMeta.marker : null,
      end: endMeta ? endMeta.marker : null
    }, allDay }, extra);
  }
  function buildDateSpanApi(span, dateEnv) {
    return Object.assign(Object.assign({}, buildRangeApi(span.range, dateEnv, span.allDay)), { allDay: span.allDay });
  }
  function buildRangeApiWithTimeZone(range2, dateEnv, omitTime) {
    return Object.assign(Object.assign({}, buildRangeApi(range2, dateEnv, omitTime)), { timeZone: dateEnv.timeZone });
  }
  function buildRangeApi(range2, dateEnv, omitTime) {
    return {
      start: dateEnv.toDate(range2.start),
      end: dateEnv.toDate(range2.end),
      startStr: dateEnv.formatIso(range2.start, { omitTime }),
      endStr: dateEnv.formatIso(range2.end, { omitTime })
    };
  }
  function fabricateEventRange(dateSpan, eventUiBases, context) {
    let res = refineEventDef({ editable: false }, context);
    let def = parseEventDef(
      res.refined,
      res.extra,
      "",
      // sourceId
      dateSpan.allDay,
      true,
      // hasEnd
      context
    );
    return {
      def,
      ui: compileEventUi(def, eventUiBases),
      instance: createEventInstance(def.defId, dateSpan.range),
      range: dateSpan.range,
      isStart: true,
      isEnd: true
    };
  }
  function unpromisify(func, normalizedSuccessCallback, normalizedFailureCallback) {
    let isResolved = false;
    let wrappedSuccess = function(res2) {
      if (!isResolved) {
        isResolved = true;
        normalizedSuccessCallback(res2);
      }
    };
    let wrappedFailure = function(error) {
      if (!isResolved) {
        isResolved = true;
        normalizedFailureCallback(error);
      }
    };
    let res = func(wrappedSuccess, wrappedFailure);
    if (res && typeof res.then === "function") {
      res.then(wrappedSuccess, wrappedFailure);
    }
  }
  var JsonRequestError = class extends Error {
    constructor(message, response) {
      super(message);
      this.response = response;
    }
  };
  function requestJson(method, url, params) {
    method = method.toUpperCase();
    const fetchOptions = {
      method
    };
    if (method === "GET") {
      url += (url.indexOf("?") === -1 ? "?" : "&") + new URLSearchParams(params);
    } else {
      fetchOptions.body = new URLSearchParams(params);
      fetchOptions.headers = {
        "Content-Type": "application/x-www-form-urlencoded"
      };
    }
    return fetch(url, fetchOptions).then((fetchRes) => {
      if (fetchRes.ok) {
        return fetchRes.json().then((parsedResponse) => {
          return [parsedResponse, fetchRes];
        }, () => {
          throw new JsonRequestError("Failure parsing JSON", fetchRes);
        });
      } else {
        throw new JsonRequestError("Request failed", fetchRes);
      }
    });
  }
  var canVGrowWithinCell;
  function getCanVGrowWithinCell() {
    if (canVGrowWithinCell == null) {
      canVGrowWithinCell = computeCanVGrowWithinCell();
    }
    return canVGrowWithinCell;
  }
  function computeCanVGrowWithinCell() {
    if (typeof document === "undefined") {
      return true;
    }
    let el = document.createElement("div");
    el.style.position = "absolute";
    el.style.top = "0px";
    el.style.left = "0px";
    el.innerHTML = "<table><tr><td><div></div></td></tr></table>";
    el.querySelector("table").style.height = "100px";
    el.querySelector("div").style.height = "100%";
    document.body.appendChild(el);
    let div = el.querySelector("div");
    let possible = div.offsetHeight > 0;
    document.body.removeChild(el);
    return possible;
  }
  var CalendarRoot = class extends BaseComponent {
    constructor() {
      super(...arguments);
      this.state = {
        forPrint: false
      };
      this.handleBeforePrint = () => {
        flushSync(() => {
          this.setState({ forPrint: true });
        });
      };
      this.handleAfterPrint = () => {
        flushSync(() => {
          this.setState({ forPrint: false });
        });
      };
    }
    render() {
      let { props } = this;
      let { options } = props;
      let { forPrint } = this.state;
      let isHeightAuto = forPrint || options.height === "auto" || options.contentHeight === "auto";
      let height = !isHeightAuto && options.height != null ? options.height : "";
      let classNames = [
        "fc",
        forPrint ? "fc-media-print" : "fc-media-screen",
        `fc-direction-${options.direction}`,
        props.theme.getClass("root")
      ];
      if (!getCanVGrowWithinCell()) {
        classNames.push("fc-liquid-hack");
      }
      return props.children(classNames, height, isHeightAuto, forPrint);
    }
    componentDidMount() {
      let { emitter } = this.props;
      emitter.on("_beforeprint", this.handleBeforePrint);
      emitter.on("_afterprint", this.handleAfterPrint);
    }
    componentWillUnmount() {
      let { emitter } = this.props;
      emitter.off("_beforeprint", this.handleBeforePrint);
      emitter.off("_afterprint", this.handleAfterPrint);
    }
  };
  var Interaction = class {
    constructor(settings) {
      this.component = settings.component;
      this.isHitComboAllowed = settings.isHitComboAllowed || null;
    }
    destroy() {
    }
  };
  function parseInteractionSettings(component, input) {
    return {
      component,
      el: input.el,
      useEventCenter: input.useEventCenter != null ? input.useEventCenter : true,
      isHitComboAllowed: input.isHitComboAllowed || null
    };
  }
  var interactionSettingsStore = {};
  var NowTimer = class extends x {
    constructor(props, context) {
      super(props, context);
      this.handleRefresh = () => {
        let timing = this.computeTiming();
        if (timing.state.nowDate.valueOf() !== this.state.nowDate.valueOf()) {
          this.setState(timing.state);
        }
        this.clearTimeout();
        this.setTimeout(timing.waitMs);
      };
      this.handleVisibilityChange = () => {
        if (!document.hidden) {
          this.handleRefresh();
        }
      };
      this.state = this.computeTiming().state;
    }
    render() {
      let { props, state } = this;
      return props.children(state.nowDate, state.todayRange);
    }
    componentDidMount() {
      this.setTimeout();
      this.context.nowManager.addResetListener(this.handleRefresh);
      document.addEventListener("visibilitychange", this.handleVisibilityChange);
    }
    componentDidUpdate(prevProps) {
      if (prevProps.unit !== this.props.unit) {
        this.clearTimeout();
        this.setTimeout();
      }
    }
    componentWillUnmount() {
      this.clearTimeout();
      this.context.nowManager.removeResetListener(this.handleRefresh);
      document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    }
    computeTiming() {
      let { props, context } = this;
      let unroundedNow = context.nowManager.getDateMarker();
      let { nowIndicatorSnap } = context.options;
      if (nowIndicatorSnap === "auto") {
        nowIndicatorSnap = // large unit?
        /year|month|week|day/.test(props.unit) || // if slotDuration 30 mins for example, would NOT appear to snap (legacy behavior)
        (props.unitValue || 1) === 1;
      }
      let nowDate;
      let waitMs;
      if (nowIndicatorSnap) {
        nowDate = context.dateEnv.startOf(unroundedNow, props.unit);
        let nextUnitStart = context.dateEnv.add(nowDate, createDuration(1, props.unit));
        waitMs = nextUnitStart.valueOf() - unroundedNow.valueOf();
      } else {
        nowDate = unroundedNow;
        waitMs = 1e3 * 60;
      }
      waitMs = Math.min(1e3 * 60 * 60 * 24, waitMs);
      return {
        state: { nowDate, todayRange: buildDayRange(nowDate) },
        waitMs
      };
    }
    setTimeout(waitMs = this.computeTiming().waitMs) {
      this.timeoutId = setTimeout(() => {
        const timing = this.computeTiming();
        this.setState(timing.state, () => {
          this.setTimeout(timing.waitMs);
        });
      }, waitMs);
    }
    clearTimeout() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
    }
  };
  NowTimer.contextType = ViewContextType;
  function buildDayRange(date) {
    let start = startOfDay(date);
    let end = addDays(start, 1);
    return { start, end };
  }
  var CalendarImpl = class {
    getCurrentData() {
      return this.currentDataManager.getCurrentData();
    }
    dispatch(action) {
      this.currentDataManager.dispatch(action);
    }
    get view() {
      return this.getCurrentData().viewApi;
    }
    batchRendering(callback) {
      callback();
    }
    updateSize() {
      this.trigger("_resize", true);
    }
    // Options
    // -----------------------------------------------------------------------------------------------------------------
    setOption(name, val) {
      this.dispatch({
        type: "SET_OPTION",
        optionName: name,
        rawOptionValue: val
      });
    }
    getOption(name) {
      return this.currentDataManager.currentCalendarOptionsInput[name];
    }
    getAvailableLocaleCodes() {
      return Object.keys(this.getCurrentData().availableRawLocales);
    }
    // Trigger
    // -----------------------------------------------------------------------------------------------------------------
    on(handlerName, handler) {
      let { currentDataManager } = this;
      if (currentDataManager.currentCalendarOptionsRefiners[handlerName]) {
        currentDataManager.emitter.on(handlerName, handler);
      } else {
        console.warn(`Unknown listener name '${handlerName}'`);
      }
    }
    off(handlerName, handler) {
      this.currentDataManager.emitter.off(handlerName, handler);
    }
    // not meant for public use
    trigger(handlerName, ...args) {
      this.currentDataManager.emitter.trigger(handlerName, ...args);
    }
    // View
    // -----------------------------------------------------------------------------------------------------------------
    changeView(viewType, dateOrRange) {
      this.batchRendering(() => {
        this.unselect();
        if (dateOrRange) {
          if (dateOrRange.start && dateOrRange.end) {
            this.dispatch({
              type: "CHANGE_VIEW_TYPE",
              viewType
            });
            this.dispatch({
              type: "SET_OPTION",
              optionName: "visibleRange",
              rawOptionValue: dateOrRange
            });
          } else {
            let { dateEnv } = this.getCurrentData();
            this.dispatch({
              type: "CHANGE_VIEW_TYPE",
              viewType,
              dateMarker: dateEnv.createMarker(dateOrRange)
            });
          }
        } else {
          this.dispatch({
            type: "CHANGE_VIEW_TYPE",
            viewType
          });
        }
      });
    }
    // Forces navigation to a view for the given date.
    // `viewType` can be a specific view name or a generic one like "week" or "day".
    // needs to change
    zoomTo(dateMarker, viewType) {
      let state = this.getCurrentData();
      let spec;
      viewType = viewType || "day";
      spec = state.viewSpecs[viewType] || this.getUnitViewSpec(viewType);
      this.unselect();
      if (spec) {
        this.dispatch({
          type: "CHANGE_VIEW_TYPE",
          viewType: spec.type,
          dateMarker
        });
      } else {
        this.dispatch({
          type: "CHANGE_DATE",
          dateMarker
        });
      }
    }
    // Given a duration singular unit, like "week" or "day", finds a matching view spec.
    // Preference is given to views that have corresponding buttons.
    getUnitViewSpec(unit) {
      let { viewSpecs, toolbarConfig } = this.getCurrentData();
      let viewTypes = [].concat(toolbarConfig.header ? toolbarConfig.header.viewsWithButtons : [], toolbarConfig.footer ? toolbarConfig.footer.viewsWithButtons : []);
      let i3;
      let spec;
      for (let viewType in viewSpecs) {
        viewTypes.push(viewType);
      }
      for (i3 = 0; i3 < viewTypes.length; i3 += 1) {
        spec = viewSpecs[viewTypes[i3]];
        if (spec) {
          if (spec.singleUnit === unit) {
            return spec;
          }
        }
      }
      return null;
    }
    // Current Date
    // -----------------------------------------------------------------------------------------------------------------
    prev() {
      this.unselect();
      this.dispatch({ type: "PREV" });
    }
    next() {
      this.unselect();
      this.dispatch({ type: "NEXT" });
    }
    prevYear() {
      let state = this.getCurrentData();
      this.unselect();
      this.dispatch({
        type: "CHANGE_DATE",
        dateMarker: state.dateEnv.addYears(state.currentDate, -1)
      });
    }
    nextYear() {
      let state = this.getCurrentData();
      this.unselect();
      this.dispatch({
        type: "CHANGE_DATE",
        dateMarker: state.dateEnv.addYears(state.currentDate, 1)
      });
    }
    today() {
      let state = this.getCurrentData();
      this.unselect();
      this.dispatch({
        type: "CHANGE_DATE",
        dateMarker: state.nowManager.getDateMarker()
      });
    }
    gotoDate(zonedDateInput) {
      let state = this.getCurrentData();
      this.unselect();
      this.dispatch({
        type: "CHANGE_DATE",
        dateMarker: state.dateEnv.createMarker(zonedDateInput)
      });
    }
    incrementDate(deltaInput) {
      let state = this.getCurrentData();
      let delta = createDuration(deltaInput);
      if (delta) {
        this.unselect();
        this.dispatch({
          type: "CHANGE_DATE",
          dateMarker: state.dateEnv.add(state.currentDate, delta)
        });
      }
    }
    getDate() {
      let state = this.getCurrentData();
      return state.dateEnv.toDate(state.currentDate);
    }
    // Date Formatting Utils
    // -----------------------------------------------------------------------------------------------------------------
    formatDate(d2, formatter) {
      let { dateEnv } = this.getCurrentData();
      return dateEnv.format(dateEnv.createMarker(d2), createFormatter(formatter));
    }
    // `settings` is for formatter AND isEndExclusive
    formatRange(d0, d1, settings) {
      let { dateEnv } = this.getCurrentData();
      return dateEnv.formatRange(dateEnv.createMarker(d0), dateEnv.createMarker(d1), createFormatter(settings), settings);
    }
    formatIso(d2, omitTime) {
      let { dateEnv } = this.getCurrentData();
      return dateEnv.formatIso(dateEnv.createMarker(d2), { omitTime });
    }
    // Date Selection / Event Selection / DayClick
    // -----------------------------------------------------------------------------------------------------------------
    select(dateOrObj, endDate) {
      let selectionInput;
      if (endDate == null) {
        if (dateOrObj.start != null) {
          selectionInput = dateOrObj;
        } else {
          selectionInput = {
            start: dateOrObj,
            end: null
          };
        }
      } else {
        selectionInput = {
          start: dateOrObj,
          end: endDate
        };
      }
      let state = this.getCurrentData();
      let selection = parseDateSpan(selectionInput, state.dateEnv, createDuration({ days: 1 }));
      if (selection) {
        this.dispatch({ type: "SELECT_DATES", selection });
        triggerDateSelect(selection, null, state);
      }
    }
    unselect(pev) {
      let state = this.getCurrentData();
      if (state.dateSelection) {
        this.dispatch({ type: "UNSELECT_DATES" });
        triggerDateUnselect(pev, state);
      }
    }
    // Public Events API
    // -----------------------------------------------------------------------------------------------------------------
    addEvent(eventInput, sourceInput) {
      if (eventInput instanceof EventImpl) {
        let def = eventInput._def;
        let instance = eventInput._instance;
        let currentData = this.getCurrentData();
        if (!currentData.eventStore.defs[def.defId]) {
          this.dispatch({
            type: "ADD_EVENTS",
            eventStore: eventTupleToStore({ def, instance })
            // TODO: better util for two args?
          });
          this.triggerEventAdd(eventInput);
        }
        return eventInput;
      }
      let state = this.getCurrentData();
      let eventSource;
      if (sourceInput instanceof EventSourceImpl) {
        eventSource = sourceInput.internalEventSource;
      } else if (typeof sourceInput === "boolean") {
        if (sourceInput) {
          [eventSource] = hashValuesToArray(state.eventSources);
        }
      } else if (sourceInput != null) {
        let sourceApi = this.getEventSourceById(sourceInput);
        if (!sourceApi) {
          console.warn(`Could not find an event source with ID "${sourceInput}"`);
          return null;
        }
        eventSource = sourceApi.internalEventSource;
      }
      let tuple = parseEvent(eventInput, eventSource, state, false);
      if (tuple) {
        let newEventApi = new EventImpl(state, tuple.def, tuple.def.recurringDef ? null : tuple.instance);
        this.dispatch({
          type: "ADD_EVENTS",
          eventStore: eventTupleToStore(tuple)
        });
        this.triggerEventAdd(newEventApi);
        return newEventApi;
      }
      return null;
    }
    triggerEventAdd(eventApi) {
      let { emitter } = this.getCurrentData();
      emitter.trigger("eventAdd", {
        event: eventApi,
        relatedEvents: [],
        revert: () => {
          this.dispatch({
            type: "REMOVE_EVENTS",
            eventStore: eventApiToStore(eventApi)
          });
        }
      });
    }
    // TODO: optimize
    getEventById(id) {
      let state = this.getCurrentData();
      let { defs, instances } = state.eventStore;
      id = String(id);
      for (let defId in defs) {
        let def = defs[defId];
        if (def.publicId === id) {
          if (def.recurringDef) {
            return new EventImpl(state, def, null);
          }
          for (let instanceId in instances) {
            let instance = instances[instanceId];
            if (instance.defId === def.defId) {
              return new EventImpl(state, def, instance);
            }
          }
        }
      }
      return null;
    }
    getEvents() {
      let currentData = this.getCurrentData();
      return buildEventApis(currentData.eventStore, currentData);
    }
    removeAllEvents() {
      this.dispatch({ type: "REMOVE_ALL_EVENTS" });
    }
    // Public Event Sources API
    // -----------------------------------------------------------------------------------------------------------------
    getEventSources() {
      let state = this.getCurrentData();
      let sourceHash = state.eventSources;
      let sourceApis = [];
      for (let internalId in sourceHash) {
        sourceApis.push(new EventSourceImpl(state, sourceHash[internalId]));
      }
      return sourceApis;
    }
    getEventSourceById(id) {
      let state = this.getCurrentData();
      let sourceHash = state.eventSources;
      id = String(id);
      for (let sourceId in sourceHash) {
        if (sourceHash[sourceId].publicId === id) {
          return new EventSourceImpl(state, sourceHash[sourceId]);
        }
      }
      return null;
    }
    addEventSource(sourceInput) {
      let state = this.getCurrentData();
      if (sourceInput instanceof EventSourceImpl) {
        if (!state.eventSources[sourceInput.internalEventSource.sourceId]) {
          this.dispatch({
            type: "ADD_EVENT_SOURCES",
            sources: [sourceInput.internalEventSource]
          });
        }
        return sourceInput;
      }
      let eventSource = parseEventSource(sourceInput, state);
      if (eventSource) {
        this.dispatch({ type: "ADD_EVENT_SOURCES", sources: [eventSource] });
        return new EventSourceImpl(state, eventSource);
      }
      return null;
    }
    removeAllEventSources() {
      this.dispatch({ type: "REMOVE_ALL_EVENT_SOURCES" });
    }
    refetchEvents() {
      this.dispatch({ type: "FETCH_EVENT_SOURCES", isRefetch: true });
    }
    // Scroll
    // -----------------------------------------------------------------------------------------------------------------
    scrollToTime(timeInput) {
      let time = createDuration(timeInput);
      if (time) {
        this.trigger("_scrollRequest", { time });
      }
    }
  };
  function intersectRects(rect1, rect2) {
    let res = {
      left: Math.max(rect1.left, rect2.left),
      right: Math.min(rect1.right, rect2.right),
      top: Math.max(rect1.top, rect2.top),
      bottom: Math.min(rect1.bottom, rect2.bottom)
    };
    if (res.left < res.right && res.top < res.bottom) {
      return res;
    }
    return false;
  }
  var EMPTY_EVENT_STORE = createEmptyEventStore();
  var Splitter = class {
    constructor() {
      this.getKeysForEventDefs = memoize(this._getKeysForEventDefs);
      this.splitDateSelection = memoize(this._splitDateSpan);
      this.splitEventStore = memoize(this._splitEventStore);
      this.splitIndividualUi = memoize(this._splitIndividualUi);
      this.splitEventDrag = memoize(this._splitInteraction);
      this.splitEventResize = memoize(this._splitInteraction);
      this.eventUiBuilders = {};
    }
    splitProps(props) {
      let keyInfos = this.getKeyInfo(props);
      let defKeys = this.getKeysForEventDefs(props.eventStore);
      let dateSelections = this.splitDateSelection(props.dateSelection);
      let individualUi = this.splitIndividualUi(props.eventUiBases, defKeys);
      let eventStores = this.splitEventStore(props.eventStore, defKeys);
      let eventDrags = this.splitEventDrag(props.eventDrag);
      let eventResizes = this.splitEventResize(props.eventResize);
      let splitProps = {};
      this.eventUiBuilders = mapHash(keyInfos, (info, key) => this.eventUiBuilders[key] || memoize(buildEventUiForKey));
      for (let key in keyInfos) {
        let keyInfo = keyInfos[key];
        let eventStore = eventStores[key] || EMPTY_EVENT_STORE;
        let buildEventUi = this.eventUiBuilders[key];
        splitProps[key] = {
          businessHours: keyInfo.businessHours || props.businessHours,
          dateSelection: dateSelections[key] || null,
          eventStore,
          eventUiBases: buildEventUi(props.eventUiBases[""], keyInfo.ui, individualUi[key]),
          eventSelection: eventStore.instances[props.eventSelection] ? props.eventSelection : "",
          eventDrag: eventDrags[key] || null,
          eventResize: eventResizes[key] || null
        };
      }
      return splitProps;
    }
    _splitDateSpan(dateSpan) {
      let dateSpans = {};
      if (dateSpan) {
        let keys = this.getKeysForDateSpan(dateSpan);
        for (let key of keys) {
          dateSpans[key] = dateSpan;
        }
      }
      return dateSpans;
    }
    _getKeysForEventDefs(eventStore) {
      return mapHash(eventStore.defs, (eventDef) => this.getKeysForEventDef(eventDef));
    }
    _splitEventStore(eventStore, defKeys) {
      let { defs, instances } = eventStore;
      let splitStores = {};
      for (let defId in defs) {
        for (let key of defKeys[defId]) {
          if (!splitStores[key]) {
            splitStores[key] = createEmptyEventStore();
          }
          splitStores[key].defs[defId] = defs[defId];
        }
      }
      for (let instanceId in instances) {
        let instance = instances[instanceId];
        for (let key of defKeys[instance.defId]) {
          if (splitStores[key]) {
            splitStores[key].instances[instanceId] = instance;
          }
        }
      }
      return splitStores;
    }
    _splitIndividualUi(eventUiBases, defKeys) {
      let splitHashes = {};
      for (let defId in eventUiBases) {
        if (defId) {
          for (let key of defKeys[defId]) {
            if (!splitHashes[key]) {
              splitHashes[key] = {};
            }
            splitHashes[key][defId] = eventUiBases[defId];
          }
        }
      }
      return splitHashes;
    }
    _splitInteraction(interaction) {
      let splitStates = {};
      if (interaction) {
        let affectedStores = this._splitEventStore(interaction.affectedEvents, this._getKeysForEventDefs(interaction.affectedEvents));
        let mutatedKeysByDefId = this._getKeysForEventDefs(interaction.mutatedEvents);
        let mutatedStores = this._splitEventStore(interaction.mutatedEvents, mutatedKeysByDefId);
        let populate = (key) => {
          if (!splitStates[key]) {
            splitStates[key] = {
              affectedEvents: affectedStores[key] || EMPTY_EVENT_STORE,
              mutatedEvents: mutatedStores[key] || EMPTY_EVENT_STORE,
              isEvent: interaction.isEvent
            };
          }
        };
        for (let key in affectedStores) {
          populate(key);
        }
        for (let key in mutatedStores) {
          populate(key);
        }
      }
      return splitStates;
    }
  };
  function buildEventUiForKey(allUi, eventUiForKey, individualUi) {
    let baseParts = [];
    if (allUi) {
      baseParts.push(allUi);
    }
    if (eventUiForKey) {
      baseParts.push(eventUiForKey);
    }
    let stuff = {
      "": combineEventUis(baseParts)
    };
    if (individualUi) {
      Object.assign(stuff, individualUi);
    }
    return stuff;
  }
  function getDateMeta(date, todayRange, nowDate, dateProfile) {
    return {
      dow: date.getUTCDay(),
      isDisabled: Boolean(dateProfile && (!dateProfile.activeRange || !rangeContainsMarker(dateProfile.activeRange, date))),
      isOther: Boolean(dateProfile && !rangeContainsMarker(dateProfile.currentRange, date)),
      isToday: Boolean(todayRange && rangeContainsMarker(todayRange, date)),
      isPast: Boolean(nowDate ? date < nowDate : todayRange ? date < todayRange.start : false),
      isFuture: Boolean(nowDate ? date > nowDate : todayRange ? date >= todayRange.end : false)
    };
  }
  function getDayClassNames(meta, theme) {
    let classNames = [
      "fc-day",
      `fc-day-${DAY_IDS[meta.dow]}`
    ];
    if (meta.isDisabled) {
      classNames.push("fc-day-disabled");
    } else {
      if (meta.isToday) {
        classNames.push("fc-day-today");
        classNames.push(theme.getClass("today"));
      }
      if (meta.isPast) {
        classNames.push("fc-day-past");
      }
      if (meta.isFuture) {
        classNames.push("fc-day-future");
      }
      if (meta.isOther) {
        classNames.push("fc-day-other");
      }
    }
    return classNames;
  }
  var DAY_FORMAT = createFormatter({ year: "numeric", month: "long", day: "numeric" });
  var WEEK_FORMAT = createFormatter({ week: "long" });
  function buildNavLinkAttrs(context, dateMarker, viewType = "day", isTabbable = true) {
    const { dateEnv, options, calendarApi } = context;
    let dateStr = dateEnv.format(dateMarker, viewType === "week" ? WEEK_FORMAT : DAY_FORMAT);
    if (options.navLinks) {
      let zonedDate = dateEnv.toDate(dateMarker);
      const handleInteraction = (ev) => {
        let customAction = viewType === "day" ? options.navLinkDayClick : viewType === "week" ? options.navLinkWeekClick : null;
        if (typeof customAction === "function") {
          customAction.call(calendarApi, dateEnv.toDate(dateMarker), ev);
        } else {
          if (typeof customAction === "string") {
            viewType = customAction;
          }
          calendarApi.zoomTo(dateMarker, viewType);
        }
      };
      return Object.assign({ title: formatWithOrdinals(options.navLinkHint, [dateStr, zonedDate], dateStr), "data-navlink": "" }, isTabbable ? createAriaClickAttrs(handleInteraction) : { onClick: handleInteraction });
    }
    return { "aria-label": dateStr };
  }
  var _scrollbarWidths;
  function getScrollbarWidths() {
    if (!_scrollbarWidths) {
      _scrollbarWidths = computeScrollbarWidths();
    }
    return _scrollbarWidths;
  }
  function computeScrollbarWidths() {
    let el = document.createElement("div");
    el.style.overflow = "scroll";
    el.style.position = "absolute";
    el.style.top = "-9999px";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    let res = computeScrollbarWidthsForEl(el);
    document.body.removeChild(el);
    return res;
  }
  function computeScrollbarWidthsForEl(el) {
    return {
      x: el.offsetHeight - el.clientHeight,
      y: el.offsetWidth - el.clientWidth
    };
  }
  function computeClippedClientRect(el) {
    let clippingParents = getClippingParents(el);
    let rect = el.getBoundingClientRect();
    for (let clippingParent of clippingParents) {
      let intersection = intersectRects(rect, clippingParent.getBoundingClientRect());
      if (intersection) {
        rect = intersection;
      } else {
        return null;
      }
    }
    return rect;
  }
  function getClippingParents(el) {
    let parents = [];
    while (el instanceof HTMLElement) {
      let computedStyle = window.getComputedStyle(el);
      if (computedStyle.position === "fixed") {
        break;
      }
      if (/(auto|scroll)/.test(computedStyle.overflow + computedStyle.overflowY + computedStyle.overflowX)) {
        parents.push(el);
      }
      el = el.parentNode;
    }
    return parents;
  }
  var PositionCache = class {
    constructor(originEl, els, isHorizontal, isVertical) {
      this.els = els;
      let originClientRect = this.originClientRect = originEl.getBoundingClientRect();
      if (isHorizontal) {
        this.buildElHorizontals(originClientRect.left);
      }
      if (isVertical) {
        this.buildElVerticals(originClientRect.top);
      }
    }
    // Populates the left/right internal coordinate arrays
    buildElHorizontals(originClientLeft) {
      let lefts = [];
      let rights = [];
      for (let el of this.els) {
        let rect = el.getBoundingClientRect();
        lefts.push(rect.left - originClientLeft);
        rights.push(rect.right - originClientLeft);
      }
      this.lefts = lefts;
      this.rights = rights;
    }
    // Populates the top/bottom internal coordinate arrays
    buildElVerticals(originClientTop) {
      let tops = [];
      let bottoms = [];
      for (let el of this.els) {
        let rect = el.getBoundingClientRect();
        tops.push(rect.top - originClientTop);
        bottoms.push(rect.bottom - originClientTop);
      }
      this.tops = tops;
      this.bottoms = bottoms;
    }
    // Given a left offset (from document left), returns the index of the el that it horizontally intersects.
    // If no intersection is made, returns undefined.
    leftToIndex(leftPosition) {
      let { lefts, rights } = this;
      let len = lefts.length;
      let i3;
      for (i3 = 0; i3 < len; i3 += 1) {
        if (leftPosition >= lefts[i3] && leftPosition < rights[i3]) {
          return i3;
        }
      }
      return void 0;
    }
    // Given a top offset (from document top), returns the index of the el that it vertically intersects.
    // If no intersection is made, returns undefined.
    topToIndex(topPosition) {
      let { tops, bottoms } = this;
      let len = tops.length;
      let i3;
      for (i3 = 0; i3 < len; i3 += 1) {
        if (topPosition >= tops[i3] && topPosition < bottoms[i3]) {
          return i3;
        }
      }
      return void 0;
    }
    // Gets the width of the element at the given index
    getWidth(leftIndex) {
      return this.rights[leftIndex] - this.lefts[leftIndex];
    }
    // Gets the height of the element at the given index
    getHeight(topIndex) {
      return this.bottoms[topIndex] - this.tops[topIndex];
    }
    similarTo(otherCache) {
      return similarNumArrays(this.tops || [], otherCache.tops || []) && similarNumArrays(this.bottoms || [], otherCache.bottoms || []) && similarNumArrays(this.lefts || [], otherCache.lefts || []) && similarNumArrays(this.rights || [], otherCache.rights || []);
    }
  };
  function similarNumArrays(a3, b3) {
    const len = a3.length;
    if (len !== b3.length) {
      return false;
    }
    for (let i3 = 0; i3 < len; i3++) {
      if (Math.round(a3[i3]) !== Math.round(b3[i3])) {
        return false;
      }
    }
    return true;
  }
  var DateComponent = class extends BaseComponent {
    constructor() {
      super(...arguments);
      this.uid = guid();
    }
    // Hit System
    // -----------------------------------------------------------------------------------------------------------------
    prepareHits() {
    }
    queryHit(positionLeft, positionTop, elWidth, elHeight) {
      return null;
    }
    // Pointer Interaction Utils
    // -----------------------------------------------------------------------------------------------------------------
    isValidSegDownEl(el) {
      return !this.props.eventDrag && // HACK
      !this.props.eventResize && // HACK
      !elementClosest(el, ".fc-event-mirror");
    }
    isValidDateDownEl(el) {
      return !elementClosest(el, ".fc-event:not(.fc-bg-event)") && !elementClosest(el, ".fc-more-link") && // a "more.." link
      !elementClosest(el, "a[data-navlink]") && // a clickable nav link
      !elementClosest(el, ".fc-popover");
    }
  };
  var SegHierarchy = class {
    constructor(getEntryThickness = (entry) => {
      return entry.thickness || 1;
    }) {
      this.getEntryThickness = getEntryThickness;
      this.strictOrder = false;
      this.allowReslicing = false;
      this.maxCoord = -1;
      this.maxStackCnt = -1;
      this.levelCoords = [];
      this.entriesByLevel = [];
      this.stackCnts = {};
    }
    addSegs(inputs) {
      let hiddenEntries = [];
      for (let input of inputs) {
        this.insertEntry(input, hiddenEntries);
      }
      return hiddenEntries;
    }
    insertEntry(entry, hiddenEntries) {
      let insertion = this.findInsertion(entry);
      if (this.isInsertionValid(insertion, entry)) {
        this.insertEntryAt(entry, insertion);
      } else {
        this.handleInvalidInsertion(insertion, entry, hiddenEntries);
      }
    }
    isInsertionValid(insertion, entry) {
      return (this.maxCoord === -1 || insertion.levelCoord + this.getEntryThickness(entry) <= this.maxCoord) && (this.maxStackCnt === -1 || insertion.stackCnt < this.maxStackCnt);
    }
    handleInvalidInsertion(insertion, entry, hiddenEntries) {
      if (this.allowReslicing && insertion.touchingEntry) {
        const hiddenEntry = Object.assign(Object.assign({}, entry), { span: intersectSpans(entry.span, insertion.touchingEntry.span) });
        hiddenEntries.push(hiddenEntry);
        this.splitEntry(entry, insertion.touchingEntry, hiddenEntries);
      } else {
        hiddenEntries.push(entry);
      }
    }
    /*
    Does NOT add what hit the `barrier` into hiddenEntries. Should already be done.
    */
    splitEntry(entry, barrier, hiddenEntries) {
      let entrySpan = entry.span;
      let barrierSpan = barrier.span;
      if (entrySpan.start < barrierSpan.start) {
        this.insertEntry({
          index: entry.index,
          thickness: entry.thickness,
          span: { start: entrySpan.start, end: barrierSpan.start }
        }, hiddenEntries);
      }
      if (entrySpan.end > barrierSpan.end) {
        this.insertEntry({
          index: entry.index,
          thickness: entry.thickness,
          span: { start: barrierSpan.end, end: entrySpan.end }
        }, hiddenEntries);
      }
    }
    insertEntryAt(entry, insertion) {
      let { entriesByLevel, levelCoords } = this;
      if (insertion.lateral === -1) {
        insertAt(levelCoords, insertion.level, insertion.levelCoord);
        insertAt(entriesByLevel, insertion.level, [entry]);
      } else {
        insertAt(entriesByLevel[insertion.level], insertion.lateral, entry);
      }
      this.stackCnts[buildEntryKey(entry)] = insertion.stackCnt;
    }
    /*
    does not care about limits
    */
    findInsertion(newEntry) {
      let { levelCoords, entriesByLevel, strictOrder, stackCnts } = this;
      let levelCnt = levelCoords.length;
      let candidateCoord = 0;
      let touchingLevel = -1;
      let touchingLateral = -1;
      let touchingEntry = null;
      let stackCnt = 0;
      for (let trackingLevel = 0; trackingLevel < levelCnt; trackingLevel += 1) {
        const trackingCoord = levelCoords[trackingLevel];
        if (!strictOrder && trackingCoord >= candidateCoord + this.getEntryThickness(newEntry)) {
          break;
        }
        let trackingEntries = entriesByLevel[trackingLevel];
        let trackingEntry;
        let searchRes = binarySearch(trackingEntries, newEntry.span.start, getEntrySpanEnd);
        let lateralIndex = searchRes[0] + searchRes[1];
        while (
          // loop through entries that horizontally intersect
          (trackingEntry = trackingEntries[lateralIndex]) && // but not past the whole entry list
          trackingEntry.span.start < newEntry.span.end
        ) {
          let trackingEntryBottom = trackingCoord + this.getEntryThickness(trackingEntry);
          if (trackingEntryBottom > candidateCoord) {
            candidateCoord = trackingEntryBottom;
            touchingEntry = trackingEntry;
            touchingLevel = trackingLevel;
            touchingLateral = lateralIndex;
          }
          if (trackingEntryBottom === candidateCoord) {
            stackCnt = Math.max(stackCnt, stackCnts[buildEntryKey(trackingEntry)] + 1);
          }
          lateralIndex += 1;
        }
      }
      let destLevel = 0;
      if (touchingEntry) {
        destLevel = touchingLevel + 1;
        while (destLevel < levelCnt && levelCoords[destLevel] < candidateCoord) {
          destLevel += 1;
        }
      }
      let destLateral = -1;
      if (destLevel < levelCnt && levelCoords[destLevel] === candidateCoord) {
        destLateral = binarySearch(entriesByLevel[destLevel], newEntry.span.end, getEntrySpanEnd)[0];
      }
      return {
        touchingLevel,
        touchingLateral,
        touchingEntry,
        stackCnt,
        levelCoord: candidateCoord,
        level: destLevel,
        lateral: destLateral
      };
    }
    // sorted by levelCoord (lowest to highest)
    toRects() {
      let { entriesByLevel, levelCoords } = this;
      let levelCnt = entriesByLevel.length;
      let rects = [];
      for (let level = 0; level < levelCnt; level += 1) {
        let entries = entriesByLevel[level];
        let levelCoord = levelCoords[level];
        for (let entry of entries) {
          rects.push(Object.assign(Object.assign({}, entry), { thickness: this.getEntryThickness(entry), levelCoord }));
        }
      }
      return rects;
    }
  };
  function getEntrySpanEnd(entry) {
    return entry.span.end;
  }
  function buildEntryKey(entry) {
    return entry.index + ":" + entry.span.start;
  }
  function groupIntersectingEntries(entries) {
    let merges = [];
    for (let entry of entries) {
      let filteredMerges = [];
      let hungryMerge = {
        span: entry.span,
        entries: [entry]
      };
      for (let merge of merges) {
        if (intersectSpans(merge.span, hungryMerge.span)) {
          hungryMerge = {
            entries: merge.entries.concat(hungryMerge.entries),
            span: joinSpans(merge.span, hungryMerge.span)
          };
        } else {
          filteredMerges.push(merge);
        }
      }
      filteredMerges.push(hungryMerge);
      merges = filteredMerges;
    }
    return merges;
  }
  function joinSpans(span0, span1) {
    return {
      start: Math.min(span0.start, span1.start),
      end: Math.max(span0.end, span1.end)
    };
  }
  function intersectSpans(span0, span1) {
    let start = Math.max(span0.start, span1.start);
    let end = Math.min(span0.end, span1.end);
    if (start < end) {
      return { start, end };
    }
    return null;
  }
  function insertAt(arr, index6, item) {
    arr.splice(index6, 0, item);
  }
  function binarySearch(a3, searchVal, getItemVal) {
    let startIndex = 0;
    let endIndex = a3.length;
    if (!endIndex || searchVal < getItemVal(a3[startIndex])) {
      return [0, 0];
    }
    if (searchVal > getItemVal(a3[endIndex - 1])) {
      return [endIndex, 0];
    }
    while (startIndex < endIndex) {
      let middleIndex = Math.floor(startIndex + (endIndex - startIndex) / 2);
      let middleVal = getItemVal(a3[middleIndex]);
      if (searchVal < middleVal) {
        endIndex = middleIndex;
      } else if (searchVal > middleVal) {
        startIndex = middleIndex + 1;
      } else {
        return [middleIndex, 1];
      }
    }
    return [startIndex, 0];
  }
  function computeFallbackHeaderFormat(datesRepDistinctDays, dayCnt) {
    if (!datesRepDistinctDays || dayCnt > 10) {
      return createFormatter({ weekday: "short" });
    }
    if (dayCnt > 1) {
      return createFormatter({ weekday: "short", month: "numeric", day: "numeric", omitCommas: true });
    }
    return createFormatter({ weekday: "long" });
  }
  var CLASS_NAME = "fc-col-header-cell";
  function renderInner$1(renderProps) {
    return renderProps.text;
  }
  var TableDateCell = class extends BaseComponent {
    render() {
      let { dateEnv, options, theme, viewApi } = this.context;
      let { props } = this;
      let { date, dateProfile } = props;
      let dayMeta = getDateMeta(date, props.todayRange, null, dateProfile);
      let classNames = [CLASS_NAME].concat(getDayClassNames(dayMeta, theme));
      let text = dateEnv.format(date, props.dayHeaderFormat);
      let navLinkAttrs = !dayMeta.isDisabled && props.colCnt > 1 ? buildNavLinkAttrs(this.context, date) : {};
      let publicDate = dateEnv.toDate(date);
      if (dateEnv.namedTimeZoneImpl) {
        publicDate = addMs(publicDate, 36e5);
      }
      let renderProps = Object.assign(Object.assign(Object.assign({ date: publicDate, view: viewApi }, props.extraRenderProps), { text }), dayMeta);
      return y(ContentContainer, { elTag: "th", elClasses: classNames, elAttrs: Object.assign({ role: "columnheader", colSpan: props.colSpan, "data-date": !dayMeta.isDisabled ? formatDayString(date) : void 0 }, props.extraDataAttrs), renderProps, generatorName: "dayHeaderContent", customGenerator: options.dayHeaderContent, defaultGenerator: renderInner$1, classNameGenerator: options.dayHeaderClassNames, didMount: options.dayHeaderDidMount, willUnmount: options.dayHeaderWillUnmount }, (InnerContainer) => y("div", { className: "fc-scrollgrid-sync-inner" }, !dayMeta.isDisabled && y(InnerContainer, { elTag: "a", elAttrs: navLinkAttrs, elClasses: [
        "fc-col-header-cell-cushion",
        props.isSticky && "fc-sticky"
      ] })));
    }
  };
  var WEEKDAY_FORMAT = createFormatter({ weekday: "long" });
  var TableDowCell = class extends BaseComponent {
    render() {
      let { props } = this;
      let { dateEnv, theme, viewApi, options } = this.context;
      let date = addDays(/* @__PURE__ */ new Date(2592e5), props.dow);
      let dateMeta = {
        dow: props.dow,
        isDisabled: false,
        isFuture: false,
        isPast: false,
        isToday: false,
        isOther: false
      };
      let text = dateEnv.format(date, props.dayHeaderFormat);
      let renderProps = Object.assign(Object.assign(Object.assign(Object.assign({
        // TODO: make this public?
        date
      }, dateMeta), { view: viewApi }), props.extraRenderProps), { text });
      return y(ContentContainer, { elTag: "th", elClasses: [
        CLASS_NAME,
        ...getDayClassNames(dateMeta, theme),
        ...props.extraClassNames || []
      ], elAttrs: Object.assign({ role: "columnheader", colSpan: props.colSpan }, props.extraDataAttrs), renderProps, generatorName: "dayHeaderContent", customGenerator: options.dayHeaderContent, defaultGenerator: renderInner$1, classNameGenerator: options.dayHeaderClassNames, didMount: options.dayHeaderDidMount, willUnmount: options.dayHeaderWillUnmount }, (InnerContent) => y(
        "div",
        { className: "fc-scrollgrid-sync-inner" },
        y(InnerContent, { elTag: "a", elClasses: [
          "fc-col-header-cell-cushion",
          props.isSticky && "fc-sticky"
        ], elAttrs: {
          "aria-label": dateEnv.format(date, WEEKDAY_FORMAT)
        } })
      ));
    }
  };
  var DayHeader = class extends BaseComponent {
    constructor() {
      super(...arguments);
      this.createDayHeaderFormatter = memoize(createDayHeaderFormatter);
    }
    render() {
      let { context } = this;
      let { dates, dateProfile, datesRepDistinctDays, renderIntro } = this.props;
      let dayHeaderFormat = this.createDayHeaderFormatter(context.options.dayHeaderFormat, datesRepDistinctDays, dates.length);
      return y(NowTimer, { unit: "day" }, (nowDate, todayRange) => y(
        "tr",
        { role: "row" },
        renderIntro && renderIntro("day"),
        dates.map((date) => datesRepDistinctDays ? y(TableDateCell, { key: date.toISOString(), date, dateProfile, todayRange, colCnt: dates.length, dayHeaderFormat }) : y(TableDowCell, { key: date.getUTCDay(), dow: date.getUTCDay(), dayHeaderFormat }))
      ));
    }
  };
  function createDayHeaderFormatter(explicitFormat, datesRepDistinctDays, dateCnt) {
    return explicitFormat || computeFallbackHeaderFormat(datesRepDistinctDays, dateCnt);
  }
  var DaySeriesModel = class {
    constructor(range2, dateProfileGenerator) {
      let date = range2.start;
      let { end } = range2;
      let indices = [];
      let dates = [];
      let dayIndex = -1;
      while (date < end) {
        if (dateProfileGenerator.isHiddenDay(date)) {
          indices.push(dayIndex + 0.5);
        } else {
          dayIndex += 1;
          indices.push(dayIndex);
          dates.push(date);
        }
        date = addDays(date, 1);
      }
      this.dates = dates;
      this.indices = indices;
      this.cnt = dates.length;
    }
    sliceRange(range2) {
      let firstIndex = this.getDateDayIndex(range2.start);
      let lastIndex = this.getDateDayIndex(addDays(range2.end, -1));
      let clippedFirstIndex = Math.max(0, firstIndex);
      let clippedLastIndex = Math.min(this.cnt - 1, lastIndex);
      clippedFirstIndex = Math.ceil(clippedFirstIndex);
      clippedLastIndex = Math.floor(clippedLastIndex);
      if (clippedFirstIndex <= clippedLastIndex) {
        return {
          firstIndex: clippedFirstIndex,
          lastIndex: clippedLastIndex,
          isStart: firstIndex === clippedFirstIndex,
          isEnd: lastIndex === clippedLastIndex
        };
      }
      return null;
    }
    // Given a date, returns its chronolocial cell-index from the first cell of the grid.
    // If the date lies between cells (because of hiddenDays), returns a floating-point value between offsets.
    // If before the first offset, returns a negative number.
    // If after the last offset, returns an offset past the last cell offset.
    // Only works for *start* dates of cells. Will not work for exclusive end dates for cells.
    getDateDayIndex(date) {
      let { indices } = this;
      let dayOffset = Math.floor(diffDays(this.dates[0], date));
      if (dayOffset < 0) {
        return indices[0] - 1;
      }
      if (dayOffset >= indices.length) {
        return indices[indices.length - 1] + 1;
      }
      return indices[dayOffset];
    }
  };
  var DayTableModel = class {
    constructor(daySeries, breakOnWeeks) {
      let { dates } = daySeries;
      let daysPerRow;
      let firstDay;
      let rowCnt;
      if (breakOnWeeks) {
        firstDay = dates[0].getUTCDay();
        for (daysPerRow = 1; daysPerRow < dates.length; daysPerRow += 1) {
          if (dates[daysPerRow].getUTCDay() === firstDay) {
            break;
          }
        }
        rowCnt = Math.ceil(dates.length / daysPerRow);
      } else {
        rowCnt = 1;
        daysPerRow = dates.length;
      }
      this.rowCnt = rowCnt;
      this.colCnt = daysPerRow;
      this.daySeries = daySeries;
      this.cells = this.buildCells();
      this.headerDates = this.buildHeaderDates();
    }
    buildCells() {
      let rows = [];
      for (let row = 0; row < this.rowCnt; row += 1) {
        let cells = [];
        for (let col = 0; col < this.colCnt; col += 1) {
          cells.push(this.buildCell(row, col));
        }
        rows.push(cells);
      }
      return rows;
    }
    buildCell(row, col) {
      let date = this.daySeries.dates[row * this.colCnt + col];
      return {
        key: date.toISOString(),
        date
      };
    }
    buildHeaderDates() {
      let dates = [];
      for (let col = 0; col < this.colCnt; col += 1) {
        dates.push(this.cells[0][col].date);
      }
      return dates;
    }
    sliceRange(range2) {
      let { colCnt } = this;
      let seriesSeg = this.daySeries.sliceRange(range2);
      let segs = [];
      if (seriesSeg) {
        let { firstIndex, lastIndex } = seriesSeg;
        let index6 = firstIndex;
        while (index6 <= lastIndex) {
          let row = Math.floor(index6 / colCnt);
          let nextIndex = Math.min((row + 1) * colCnt, lastIndex + 1);
          segs.push({
            row,
            firstCol: index6 % colCnt,
            lastCol: (nextIndex - 1) % colCnt,
            isStart: seriesSeg.isStart && index6 === firstIndex,
            isEnd: seriesSeg.isEnd && nextIndex - 1 === lastIndex
          });
          index6 = nextIndex;
        }
      }
      return segs;
    }
  };
  var Slicer = class {
    constructor() {
      this.sliceBusinessHours = memoize(this._sliceBusinessHours);
      this.sliceDateSelection = memoize(this._sliceDateSpan);
      this.sliceEventStore = memoize(this._sliceEventStore);
      this.sliceEventDrag = memoize(this._sliceInteraction);
      this.sliceEventResize = memoize(this._sliceInteraction);
      this.forceDayIfListItem = false;
    }
    sliceProps(props, dateProfile, nextDayThreshold, context, ...extraArgs) {
      let { eventUiBases } = props;
      let eventSegs = this.sliceEventStore(props.eventStore, eventUiBases, dateProfile, nextDayThreshold, ...extraArgs);
      return {
        dateSelectionSegs: this.sliceDateSelection(props.dateSelection, dateProfile, nextDayThreshold, eventUiBases, context, ...extraArgs),
        businessHourSegs: this.sliceBusinessHours(props.businessHours, dateProfile, nextDayThreshold, context, ...extraArgs),
        fgEventSegs: eventSegs.fg,
        bgEventSegs: eventSegs.bg,
        eventDrag: this.sliceEventDrag(props.eventDrag, eventUiBases, dateProfile, nextDayThreshold, ...extraArgs),
        eventResize: this.sliceEventResize(props.eventResize, eventUiBases, dateProfile, nextDayThreshold, ...extraArgs),
        eventSelection: props.eventSelection
      };
    }
    sliceNowDate(date, dateProfile, nextDayThreshold, context, ...extraArgs) {
      return this._sliceDateSpan(
        { range: { start: date, end: addMs(date, 1) }, allDay: false },
        // add 1 ms, protect against null range
        dateProfile,
        nextDayThreshold,
        {},
        context,
        ...extraArgs
      );
    }
    _sliceBusinessHours(businessHours, dateProfile, nextDayThreshold, context, ...extraArgs) {
      if (!businessHours) {
        return [];
      }
      return this._sliceEventStore(expandRecurring(businessHours, computeActiveRange(dateProfile, Boolean(nextDayThreshold)), context), {}, dateProfile, nextDayThreshold, ...extraArgs).bg;
    }
    _sliceEventStore(eventStore, eventUiBases, dateProfile, nextDayThreshold, ...extraArgs) {
      if (eventStore) {
        let rangeRes = sliceEventStore(eventStore, eventUiBases, computeActiveRange(dateProfile, Boolean(nextDayThreshold)), nextDayThreshold);
        return {
          bg: this.sliceEventRanges(rangeRes.bg, extraArgs),
          fg: this.sliceEventRanges(rangeRes.fg, extraArgs)
        };
      }
      return { bg: [], fg: [] };
    }
    _sliceInteraction(interaction, eventUiBases, dateProfile, nextDayThreshold, ...extraArgs) {
      if (!interaction) {
        return null;
      }
      let rangeRes = sliceEventStore(interaction.mutatedEvents, eventUiBases, computeActiveRange(dateProfile, Boolean(nextDayThreshold)), nextDayThreshold);
      return {
        segs: this.sliceEventRanges(rangeRes.fg, extraArgs),
        affectedInstances: interaction.affectedEvents.instances,
        isEvent: interaction.isEvent
      };
    }
    _sliceDateSpan(dateSpan, dateProfile, nextDayThreshold, eventUiBases, context, ...extraArgs) {
      if (!dateSpan) {
        return [];
      }
      let activeRange = computeActiveRange(dateProfile, Boolean(nextDayThreshold));
      let activeDateSpanRange = intersectRanges(dateSpan.range, activeRange);
      if (activeDateSpanRange) {
        dateSpan = Object.assign(Object.assign({}, dateSpan), { range: activeDateSpanRange });
        let eventRange = fabricateEventRange(dateSpan, eventUiBases, context);
        let segs = this.sliceRange(dateSpan.range, ...extraArgs);
        for (let seg of segs) {
          seg.eventRange = eventRange;
        }
        return segs;
      }
      return [];
    }
    /*
    "complete" seg means it has component and eventRange
    */
    sliceEventRanges(eventRanges, extraArgs) {
      let segs = [];
      for (let eventRange of eventRanges) {
        segs.push(...this.sliceEventRange(eventRange, extraArgs));
      }
      return segs;
    }
    /*
    "complete" seg means it has component and eventRange
    */
    sliceEventRange(eventRange, extraArgs) {
      let dateRange = eventRange.range;
      if (this.forceDayIfListItem && eventRange.ui.display === "list-item") {
        dateRange = {
          start: dateRange.start,
          end: addDays(dateRange.start, 1)
        };
      }
      let segs = this.sliceRange(dateRange, ...extraArgs);
      for (let seg of segs) {
        seg.eventRange = eventRange;
        seg.isStart = eventRange.isStart && seg.isStart;
        seg.isEnd = eventRange.isEnd && seg.isEnd;
      }
      return segs;
    }
  };
  function computeActiveRange(dateProfile, isComponentAllDay) {
    let range2 = dateProfile.activeRange;
    if (isComponentAllDay) {
      return range2;
    }
    return {
      start: addMs(range2.start, dateProfile.slotMinTime.milliseconds),
      end: addMs(range2.end, dateProfile.slotMaxTime.milliseconds - 864e5)
      // 864e5 = ms in a day
    };
  }
  var VISIBLE_HIDDEN_RE = /^(visible|hidden)$/;
  var Scroller = class extends BaseComponent {
    constructor() {
      super(...arguments);
      this.handleEl = (el) => {
        this.el = el;
        setRef(this.props.elRef, el);
      };
    }
    render() {
      let { props } = this;
      let { liquid, liquidIsAbsolute } = props;
      let isAbsolute = liquid && liquidIsAbsolute;
      let className = ["fc-scroller"];
      if (liquid) {
        if (liquidIsAbsolute) {
          className.push("fc-scroller-liquid-absolute");
        } else {
          className.push("fc-scroller-liquid");
        }
      }
      return y("div", { ref: this.handleEl, className: className.join(" "), style: {
        overflowX: props.overflowX,
        overflowY: props.overflowY,
        left: isAbsolute && -(props.overcomeLeft || 0) || "",
        right: isAbsolute && -(props.overcomeRight || 0) || "",
        bottom: isAbsolute && -(props.overcomeBottom || 0) || "",
        marginLeft: !isAbsolute && -(props.overcomeLeft || 0) || "",
        marginRight: !isAbsolute && -(props.overcomeRight || 0) || "",
        marginBottom: !isAbsolute && -(props.overcomeBottom || 0) || "",
        maxHeight: props.maxHeight || ""
      } }, props.children);
    }
    needsXScrolling() {
      if (VISIBLE_HIDDEN_RE.test(this.props.overflowX)) {
        return false;
      }
      let { el } = this;
      let realClientWidth = this.el.getBoundingClientRect().width - this.getYScrollbarWidth();
      let { children } = el;
      for (let i3 = 0; i3 < children.length; i3 += 1) {
        let childEl = children[i3];
        if (childEl.getBoundingClientRect().width > realClientWidth) {
          return true;
        }
      }
      return false;
    }
    needsYScrolling() {
      if (VISIBLE_HIDDEN_RE.test(this.props.overflowY)) {
        return false;
      }
      let { el } = this;
      let realClientHeight = this.el.getBoundingClientRect().height - this.getXScrollbarWidth();
      let { children } = el;
      for (let i3 = 0; i3 < children.length; i3 += 1) {
        let childEl = children[i3];
        if (childEl.getBoundingClientRect().height > realClientHeight) {
          return true;
        }
      }
      return false;
    }
    getXScrollbarWidth() {
      if (VISIBLE_HIDDEN_RE.test(this.props.overflowX)) {
        return 0;
      }
      return this.el.offsetHeight - this.el.clientHeight;
    }
    getYScrollbarWidth() {
      if (VISIBLE_HIDDEN_RE.test(this.props.overflowY)) {
        return 0;
      }
      return this.el.offsetWidth - this.el.clientWidth;
    }
  };
  var RefMap = class {
    constructor(masterCallback) {
      this.masterCallback = masterCallback;
      this.currentMap = {};
      this.depths = {};
      this.callbackMap = {};
      this.handleValue = (val, key) => {
        let { depths, currentMap } = this;
        let removed = false;
        let added = false;
        if (val !== null) {
          removed = key in currentMap;
          currentMap[key] = val;
          depths[key] = (depths[key] || 0) + 1;
          added = true;
        } else {
          depths[key] -= 1;
          if (!depths[key]) {
            delete currentMap[key];
            delete this.callbackMap[key];
            removed = true;
          }
        }
        if (this.masterCallback) {
          if (removed) {
            this.masterCallback(null, String(key));
          }
          if (added) {
            this.masterCallback(val, String(key));
          }
        }
      };
    }
    createRef(key) {
      let refCallback = this.callbackMap[key];
      if (!refCallback) {
        refCallback = this.callbackMap[key] = (val) => {
          this.handleValue(val, String(key));
        };
      }
      return refCallback;
    }
    // TODO: check callers that don't care about order. should use getAll instead
    // NOTE: this method has become less valuable now that we are encouraged to map order by some other index
    // TODO: provide ONE array-export function, buildArray, which fails on non-numeric indexes. caller can manipulate and "collect"
    collect(startIndex, endIndex, step) {
      return collectFromHash(this.currentMap, startIndex, endIndex, step);
    }
    getAll() {
      return hashValuesToArray(this.currentMap);
    }
  };
  function computeShrinkWidth(chunkEls) {
    let shrinkCells = findElements(chunkEls, ".fc-scrollgrid-shrink");
    let largestWidth = 0;
    for (let shrinkCell of shrinkCells) {
      largestWidth = Math.max(largestWidth, computeSmallestCellWidth(shrinkCell));
    }
    return Math.ceil(largestWidth);
  }
  function getSectionHasLiquidHeight(props, sectionConfig) {
    return props.liquid && sectionConfig.liquid;
  }
  function getAllowYScrolling(props, sectionConfig) {
    return sectionConfig.maxHeight != null || // if its possible for the height to max out, we might need scrollbars
    getSectionHasLiquidHeight(props, sectionConfig);
  }
  function renderChunkContent(sectionConfig, chunkConfig, arg, isHeader) {
    let { expandRows } = arg;
    let content = typeof chunkConfig.content === "function" ? chunkConfig.content(arg) : y("table", {
      role: "presentation",
      className: [
        chunkConfig.tableClassName,
        sectionConfig.syncRowHeights ? "fc-scrollgrid-sync-table" : ""
      ].join(" "),
      style: {
        minWidth: arg.tableMinWidth,
        width: arg.clientWidth,
        height: expandRows ? arg.clientHeight : ""
        // css `height` on a <table> serves as a min-height
      }
    }, arg.tableColGroupNode, y(isHeader ? "thead" : "tbody", {
      role: "presentation"
    }, typeof chunkConfig.rowContent === "function" ? chunkConfig.rowContent(arg) : chunkConfig.rowContent));
    return content;
  }
  function isColPropsEqual(cols0, cols1) {
    return isArraysEqual(cols0, cols1, isPropsEqual);
  }
  function renderMicroColGroup(cols, shrinkWidth) {
    let colNodes = [];
    for (let colProps of cols) {
      let span = colProps.span || 1;
      for (let i3 = 0; i3 < span; i3 += 1) {
        colNodes.push(y("col", { style: {
          width: colProps.width === "shrink" ? sanitizeShrinkWidth(shrinkWidth) : colProps.width || "",
          minWidth: colProps.minWidth || ""
        } }));
      }
    }
    return y("colgroup", {}, ...colNodes);
  }
  function sanitizeShrinkWidth(shrinkWidth) {
    return shrinkWidth == null ? 4 : shrinkWidth;
  }
  function hasShrinkWidth(cols) {
    for (let col of cols) {
      if (col.width === "shrink") {
        return true;
      }
    }
    return false;
  }
  function getScrollGridClassNames(liquid, context) {
    let classNames = [
      "fc-scrollgrid",
      context.theme.getClass("table")
    ];
    if (liquid) {
      classNames.push("fc-scrollgrid-liquid");
    }
    return classNames;
  }
  function getSectionClassNames(sectionConfig, wholeTableVGrow) {
    let classNames = [
      "fc-scrollgrid-section",
      `fc-scrollgrid-section-${sectionConfig.type}`,
      sectionConfig.className
      // used?
    ];
    if (wholeTableVGrow && sectionConfig.liquid && sectionConfig.maxHeight == null) {
      classNames.push("fc-scrollgrid-section-liquid");
    }
    if (sectionConfig.isSticky) {
      classNames.push("fc-scrollgrid-section-sticky");
    }
    return classNames;
  }
  function renderScrollShim(arg) {
    return y("div", { className: "fc-scrollgrid-sticky-shim", style: {
      width: arg.clientWidth,
      minWidth: arg.tableMinWidth
    } });
  }
  function getStickyHeaderDates(options) {
    let { stickyHeaderDates } = options;
    if (stickyHeaderDates == null || stickyHeaderDates === "auto") {
      stickyHeaderDates = options.height === "auto" || options.viewHeight === "auto";
    }
    return stickyHeaderDates;
  }
  function getStickyFooterScrollbar(options) {
    let { stickyFooterScrollbar } = options;
    if (stickyFooterScrollbar == null || stickyFooterScrollbar === "auto") {
      stickyFooterScrollbar = options.height === "auto" || options.viewHeight === "auto";
    }
    return stickyFooterScrollbar;
  }
  var SimpleScrollGrid = class extends BaseComponent {
    constructor() {
      super(...arguments);
      this.processCols = memoize((a3) => a3, isColPropsEqual);
      this.renderMicroColGroup = memoize(renderMicroColGroup);
      this.scrollerRefs = new RefMap();
      this.scrollerElRefs = new RefMap(this._handleScrollerEl.bind(this));
      this.state = {
        shrinkWidth: null,
        forceYScrollbars: false,
        scrollerClientWidths: {},
        scrollerClientHeights: {}
      };
      this.handleSizing = () => {
        this.safeSetState(Object.assign({ shrinkWidth: this.computeShrinkWidth() }, this.computeScrollerDims()));
      };
    }
    render() {
      let { props, state, context } = this;
      let sectionConfigs = props.sections || [];
      let cols = this.processCols(props.cols);
      let microColGroupNode = this.renderMicroColGroup(cols, state.shrinkWidth);
      let classNames = getScrollGridClassNames(props.liquid, context);
      if (props.collapsibleWidth) {
        classNames.push("fc-scrollgrid-collapsible");
      }
      let configCnt = sectionConfigs.length;
      let configI = 0;
      let currentConfig;
      let headSectionNodes = [];
      let bodySectionNodes = [];
      let footSectionNodes = [];
      while (configI < configCnt && (currentConfig = sectionConfigs[configI]).type === "header") {
        headSectionNodes.push(this.renderSection(currentConfig, microColGroupNode, true));
        configI += 1;
      }
      while (configI < configCnt && (currentConfig = sectionConfigs[configI]).type === "body") {
        bodySectionNodes.push(this.renderSection(currentConfig, microColGroupNode, false));
        configI += 1;
      }
      while (configI < configCnt && (currentConfig = sectionConfigs[configI]).type === "footer") {
        footSectionNodes.push(this.renderSection(currentConfig, microColGroupNode, true));
        configI += 1;
      }
      let isBuggy = !getCanVGrowWithinCell();
      const roleAttrs = { role: "rowgroup" };
      return y("table", {
        role: "grid",
        className: classNames.join(" "),
        style: { height: props.height }
      }, Boolean(!isBuggy && headSectionNodes.length) && y("thead", roleAttrs, ...headSectionNodes), Boolean(!isBuggy && bodySectionNodes.length) && y("tbody", roleAttrs, ...bodySectionNodes), Boolean(!isBuggy && footSectionNodes.length) && y("tfoot", roleAttrs, ...footSectionNodes), isBuggy && y("tbody", roleAttrs, ...headSectionNodes, ...bodySectionNodes, ...footSectionNodes));
    }
    renderSection(sectionConfig, microColGroupNode, isHeader) {
      if ("outerContent" in sectionConfig) {
        return y(_, { key: sectionConfig.key }, sectionConfig.outerContent);
      }
      return y("tr", { key: sectionConfig.key, role: "presentation", className: getSectionClassNames(sectionConfig, this.props.liquid).join(" ") }, this.renderChunkTd(sectionConfig, microColGroupNode, sectionConfig.chunk, isHeader));
    }
    renderChunkTd(sectionConfig, microColGroupNode, chunkConfig, isHeader) {
      if ("outerContent" in chunkConfig) {
        return chunkConfig.outerContent;
      }
      let { props } = this;
      let { forceYScrollbars, scrollerClientWidths, scrollerClientHeights } = this.state;
      let needsYScrolling = getAllowYScrolling(props, sectionConfig);
      let isLiquid = getSectionHasLiquidHeight(props, sectionConfig);
      let overflowY = !props.liquid ? "visible" : forceYScrollbars ? "scroll" : !needsYScrolling ? "hidden" : "auto";
      let sectionKey = sectionConfig.key;
      let content = renderChunkContent(sectionConfig, chunkConfig, {
        tableColGroupNode: microColGroupNode,
        tableMinWidth: "",
        clientWidth: !props.collapsibleWidth && scrollerClientWidths[sectionKey] !== void 0 ? scrollerClientWidths[sectionKey] : null,
        clientHeight: scrollerClientHeights[sectionKey] !== void 0 ? scrollerClientHeights[sectionKey] : null,
        expandRows: sectionConfig.expandRows,
        syncRowHeights: false,
        rowSyncHeights: [],
        reportRowHeightChange: () => {
        }
      }, isHeader);
      return y(isHeader ? "th" : "td", {
        ref: chunkConfig.elRef,
        role: "presentation"
      }, y(
        "div",
        { className: `fc-scroller-harness${isLiquid ? " fc-scroller-harness-liquid" : ""}` },
        y(Scroller, { ref: this.scrollerRefs.createRef(sectionKey), elRef: this.scrollerElRefs.createRef(sectionKey), overflowY, overflowX: !props.liquid ? "visible" : "hidden", maxHeight: sectionConfig.maxHeight, liquid: isLiquid, liquidIsAbsolute: true }, content)
      ));
    }
    _handleScrollerEl(scrollerEl, key) {
      let section = getSectionByKey(this.props.sections, key);
      if (section) {
        setRef(section.chunk.scrollerElRef, scrollerEl);
      }
    }
    componentDidMount() {
      this.handleSizing();
      this.context.addResizeHandler(this.handleSizing);
    }
    componentDidUpdate() {
      this.handleSizing();
    }
    componentWillUnmount() {
      this.context.removeResizeHandler(this.handleSizing);
    }
    computeShrinkWidth() {
      return hasShrinkWidth(this.props.cols) ? computeShrinkWidth(this.scrollerElRefs.getAll()) : 0;
    }
    computeScrollerDims() {
      let scrollbarWidth = getScrollbarWidths();
      let { scrollerRefs, scrollerElRefs } = this;
      let forceYScrollbars = false;
      let scrollerClientWidths = {};
      let scrollerClientHeights = {};
      for (let sectionKey in scrollerRefs.currentMap) {
        let scroller = scrollerRefs.currentMap[sectionKey];
        if (scroller && scroller.needsYScrolling()) {
          forceYScrollbars = true;
          break;
        }
      }
      for (let section of this.props.sections) {
        let sectionKey = section.key;
        let scrollerEl = scrollerElRefs.currentMap[sectionKey];
        if (scrollerEl) {
          let harnessEl = scrollerEl.parentNode;
          scrollerClientWidths[sectionKey] = Math.floor(harnessEl.getBoundingClientRect().width - (forceYScrollbars ? scrollbarWidth.y : 0));
          scrollerClientHeights[sectionKey] = Math.floor(harnessEl.getBoundingClientRect().height);
        }
      }
      return { forceYScrollbars, scrollerClientWidths, scrollerClientHeights };
    }
  };
  SimpleScrollGrid.addStateEquality({
    scrollerClientWidths: isPropsEqual,
    scrollerClientHeights: isPropsEqual
  });
  function getSectionByKey(sections, key) {
    for (let section of sections) {
      if (section.key === key) {
        return section;
      }
    }
    return null;
  }
  var EventContainer = class extends BaseComponent {
    constructor() {
      super(...arguments);
      this.buildPublicEvent = memoize((context, eventDef, eventInstance) => new EventImpl(context, eventDef, eventInstance));
      this.handleEl = (el) => {
        this.el = el;
        setRef(this.props.elRef, el);
        if (el) {
          setElSeg(el, this.props.seg);
        }
      };
    }
    render() {
      const { props, context } = this;
      const { options } = context;
      const { seg } = props;
      const { eventRange } = seg;
      const { ui } = eventRange;
      const renderProps = {
        event: this.buildPublicEvent(context, eventRange.def, eventRange.instance),
        view: context.viewApi,
        timeText: props.timeText,
        textColor: ui.textColor,
        backgroundColor: ui.backgroundColor,
        borderColor: ui.borderColor,
        isDraggable: !props.disableDragging && computeSegDraggable(seg, context),
        isStartResizable: !props.disableResizing && computeSegStartResizable(seg, context),
        isEndResizable: !props.disableResizing && computeSegEndResizable(seg),
        isMirror: Boolean(props.isDragging || props.isResizing || props.isDateSelecting),
        isStart: Boolean(seg.isStart),
        isEnd: Boolean(seg.isEnd),
        isPast: Boolean(props.isPast),
        isFuture: Boolean(props.isFuture),
        isToday: Boolean(props.isToday),
        isSelected: Boolean(props.isSelected),
        isDragging: Boolean(props.isDragging),
        isResizing: Boolean(props.isResizing)
      };
      return y(ContentContainer, { elRef: this.handleEl, elTag: props.elTag, elAttrs: props.elAttrs, elClasses: [
        ...getEventClassNames(renderProps),
        ...seg.eventRange.ui.classNames,
        ...props.elClasses || []
      ], elStyle: props.elStyle, renderProps, generatorName: "eventContent", customGenerator: options.eventContent, defaultGenerator: props.defaultGenerator, classNameGenerator: options.eventClassNames, didMount: options.eventDidMount, willUnmount: options.eventWillUnmount }, props.children);
    }
    componentDidUpdate(prevProps) {
      if (this.el && this.props.seg !== prevProps.seg) {
        setElSeg(this.el, this.props.seg);
      }
    }
  };
  var StandardEvent = class extends BaseComponent {
    render() {
      let { props, context } = this;
      let { options } = context;
      let { seg } = props;
      let { ui } = seg.eventRange;
      let timeFormat = options.eventTimeFormat || props.defaultTimeFormat;
      let timeText = buildSegTimeText(seg, timeFormat, context, props.defaultDisplayEventTime, props.defaultDisplayEventEnd);
      return y(EventContainer, Object.assign({}, props, { elTag: "a", elStyle: {
        borderColor: ui.borderColor,
        backgroundColor: ui.backgroundColor
      }, elAttrs: getSegAnchorAttrs(seg, context), defaultGenerator: renderInnerContent$1, timeText }), (InnerContent, eventContentArg) => y(
        _,
        null,
        y(InnerContent, { elTag: "div", elClasses: ["fc-event-main"], elStyle: { color: eventContentArg.textColor } }),
        Boolean(eventContentArg.isStartResizable) && y("div", { className: "fc-event-resizer fc-event-resizer-start" }),
        Boolean(eventContentArg.isEndResizable) && y("div", { className: "fc-event-resizer fc-event-resizer-end" })
      ));
    }
  };
  StandardEvent.addPropsEquality({
    seg: isPropsEqual
  });
  function renderInnerContent$1(innerProps) {
    return y(
      "div",
      { className: "fc-event-main-frame" },
      innerProps.timeText && y("div", { className: "fc-event-time" }, innerProps.timeText),
      y(
        "div",
        { className: "fc-event-title-container" },
        y("div", { className: "fc-event-title fc-sticky" }, innerProps.event.title || y(_, null, "\xA0"))
      )
    );
  }
  var NowIndicatorContainer = (props) => y(ViewContextType.Consumer, null, (context) => {
    let { options } = context;
    let renderProps = {
      isAxis: props.isAxis,
      date: context.dateEnv.toDate(props.date),
      view: context.viewApi
    };
    return y(ContentContainer, { elRef: props.elRef, elTag: props.elTag || "div", elAttrs: props.elAttrs, elClasses: props.elClasses, elStyle: props.elStyle, renderProps, generatorName: "nowIndicatorContent", customGenerator: options.nowIndicatorContent, classNameGenerator: options.nowIndicatorClassNames, didMount: options.nowIndicatorDidMount, willUnmount: options.nowIndicatorWillUnmount }, props.children);
  });
  var DAY_NUM_FORMAT = createFormatter({ day: "numeric" });
  var DayCellContainer = class extends BaseComponent {
    constructor() {
      super(...arguments);
      this.refineRenderProps = memoizeObjArg(refineRenderProps);
    }
    render() {
      let { props, context } = this;
      let { options } = context;
      let renderProps = this.refineRenderProps({
        date: props.date,
        dateProfile: props.dateProfile,
        todayRange: props.todayRange,
        isMonthStart: props.isMonthStart || false,
        showDayNumber: props.showDayNumber,
        extraRenderProps: props.extraRenderProps,
        viewApi: context.viewApi,
        dateEnv: context.dateEnv,
        monthStartFormat: options.monthStartFormat
      });
      return y(ContentContainer, { elRef: props.elRef, elTag: props.elTag, elAttrs: Object.assign(Object.assign({}, props.elAttrs), renderProps.isDisabled ? {} : { "data-date": formatDayString(props.date) }), elClasses: [
        ...getDayClassNames(renderProps, context.theme),
        ...props.elClasses || []
      ], elStyle: props.elStyle, renderProps, generatorName: "dayCellContent", customGenerator: options.dayCellContent, defaultGenerator: props.defaultGenerator, classNameGenerator: (
        // don't use custom classNames if disabled
        renderProps.isDisabled ? void 0 : options.dayCellClassNames
      ), didMount: options.dayCellDidMount, willUnmount: options.dayCellWillUnmount }, props.children);
    }
  };
  function hasCustomDayCellContent(options) {
    return Boolean(options.dayCellContent || hasCustomRenderingHandler("dayCellContent", options));
  }
  function refineRenderProps(raw) {
    let { date, dateEnv, dateProfile, isMonthStart } = raw;
    let dayMeta = getDateMeta(date, raw.todayRange, null, dateProfile);
    let dayNumberText = raw.showDayNumber ? dateEnv.format(date, isMonthStart ? raw.monthStartFormat : DAY_NUM_FORMAT) : "";
    return Object.assign(Object.assign(Object.assign({ date: dateEnv.toDate(date), view: raw.viewApi }, dayMeta), {
      isMonthStart,
      dayNumberText
    }), raw.extraRenderProps);
  }
  var BgEvent = class extends BaseComponent {
    render() {
      let { props } = this;
      let { seg } = props;
      return y(EventContainer, { elTag: "div", elClasses: ["fc-bg-event"], elStyle: { backgroundColor: seg.eventRange.ui.backgroundColor }, defaultGenerator: renderInnerContent, seg, timeText: "", isDragging: false, isResizing: false, isDateSelecting: false, isSelected: false, isPast: props.isPast, isFuture: props.isFuture, isToday: props.isToday, disableDragging: true, disableResizing: true });
    }
  };
  function renderInnerContent(props) {
    let { title } = props.event;
    return title && y("div", { className: "fc-event-title" }, props.event.title);
  }
  function renderFill(fillType) {
    return y("div", { className: `fc-${fillType}` });
  }
  var WeekNumberContainer = (props) => y(ViewContextType.Consumer, null, (context) => {
    let { dateEnv, options } = context;
    let { date } = props;
    let format = options.weekNumberFormat || props.defaultFormat;
    let num = dateEnv.computeWeekNumber(date);
    let text = dateEnv.format(date, format);
    let renderProps = { num, text, date };
    return y(
      ContentContainer,
      { elRef: props.elRef, elTag: props.elTag, elAttrs: props.elAttrs, elClasses: props.elClasses, elStyle: props.elStyle, renderProps, generatorName: "weekNumberContent", customGenerator: options.weekNumberContent, defaultGenerator: renderInner, classNameGenerator: options.weekNumberClassNames, didMount: options.weekNumberDidMount, willUnmount: options.weekNumberWillUnmount },
      props.children
    );
  });
  function renderInner(innerProps) {
    return innerProps.text;
  }
  var PADDING_FROM_VIEWPORT = 10;
  var Popover = class extends BaseComponent {
    constructor() {
      super(...arguments);
      this.state = {
        titleId: getUniqueDomId()
      };
      this.handleRootEl = (el) => {
        this.rootEl = el;
        if (this.props.elRef) {
          setRef(this.props.elRef, el);
        }
      };
      this.handleDocumentMouseDown = (ev) => {
        const target = getEventTargetViaRoot(ev);
        if (!this.rootEl.contains(target)) {
          this.handleCloseClick();
        }
      };
      this.handleDocumentKeyDown = (ev) => {
        if (ev.key === "Escape") {
          this.handleCloseClick();
        }
      };
      this.handleCloseClick = () => {
        let { onClose } = this.props;
        if (onClose) {
          onClose();
        }
      };
    }
    render() {
      let { theme, options } = this.context;
      let { props, state } = this;
      let classNames = [
        "fc-popover",
        theme.getClass("popover")
      ].concat(props.extraClassNames || []);
      return j3(y(
        "div",
        Object.assign({}, props.extraAttrs, { id: props.id, className: classNames.join(" "), "aria-labelledby": state.titleId, ref: this.handleRootEl }),
        y(
          "div",
          { className: "fc-popover-header " + theme.getClass("popoverHeader") },
          y("span", { className: "fc-popover-title", id: state.titleId }, props.title),
          y("span", { className: "fc-popover-close " + theme.getIconClass("close"), title: options.closeHint, onClick: this.handleCloseClick })
        ),
        y("div", { className: "fc-popover-body " + theme.getClass("popoverContent") }, props.children)
      ), props.parentEl);
    }
    componentDidMount() {
      document.addEventListener("mousedown", this.handleDocumentMouseDown);
      document.addEventListener("keydown", this.handleDocumentKeyDown);
      this.updateSize();
    }
    componentWillUnmount() {
      document.removeEventListener("mousedown", this.handleDocumentMouseDown);
      document.removeEventListener("keydown", this.handleDocumentKeyDown);
    }
    updateSize() {
      let { isRtl } = this.context;
      let { alignmentEl, alignGridTop } = this.props;
      let { rootEl } = this;
      let alignmentRect = computeClippedClientRect(alignmentEl);
      if (alignmentRect) {
        let popoverDims = rootEl.getBoundingClientRect();
        let popoverTop = alignGridTop ? elementClosest(alignmentEl, ".fc-scrollgrid").getBoundingClientRect().top : alignmentRect.top;
        let popoverLeft = isRtl ? alignmentRect.right - popoverDims.width : alignmentRect.left;
        popoverTop = Math.max(popoverTop, PADDING_FROM_VIEWPORT);
        popoverLeft = Math.min(popoverLeft, document.documentElement.clientWidth - PADDING_FROM_VIEWPORT - popoverDims.width);
        popoverLeft = Math.max(popoverLeft, PADDING_FROM_VIEWPORT);
        let origin = rootEl.offsetParent.getBoundingClientRect();
        applyStyle(rootEl, {
          top: popoverTop - origin.top,
          left: popoverLeft - origin.left
        });
      }
    }
  };
  var MorePopover = class extends DateComponent {
    constructor() {
      super(...arguments);
      this.handleRootEl = (rootEl) => {
        this.rootEl = rootEl;
        if (rootEl) {
          this.context.registerInteractiveComponent(this, {
            el: rootEl,
            useEventCenter: false
          });
        } else {
          this.context.unregisterInteractiveComponent(this);
        }
      };
    }
    render() {
      let { options, dateEnv } = this.context;
      let { props } = this;
      let { startDate, todayRange, dateProfile } = props;
      let title = dateEnv.format(startDate, options.dayPopoverFormat);
      return y(DayCellContainer, { elRef: this.handleRootEl, date: startDate, dateProfile, todayRange }, (InnerContent, renderProps, elAttrs) => y(
        Popover,
        { elRef: elAttrs.ref, id: props.id, title, extraClassNames: ["fc-more-popover"].concat(elAttrs.className || []), extraAttrs: elAttrs, parentEl: props.parentEl, alignmentEl: props.alignmentEl, alignGridTop: props.alignGridTop, onClose: props.onClose },
        hasCustomDayCellContent(options) && y(InnerContent, { elTag: "div", elClasses: ["fc-more-popover-misc"] }),
        props.children
      ));
    }
    queryHit(positionLeft, positionTop, elWidth, elHeight) {
      let { rootEl, props } = this;
      if (positionLeft >= 0 && positionLeft < elWidth && positionTop >= 0 && positionTop < elHeight) {
        return {
          dateProfile: props.dateProfile,
          dateSpan: Object.assign({ allDay: !props.forceTimed, range: {
            start: props.startDate,
            end: props.endDate
          } }, props.extraDateSpan),
          dayEl: rootEl,
          rect: {
            left: 0,
            top: 0,
            right: elWidth,
            bottom: elHeight
          },
          layer: 1
          // important when comparing with hits from other components
        };
      }
      return null;
    }
  };
  var MoreLinkContainer = class extends BaseComponent {
    constructor() {
      super(...arguments);
      this.state = {
        isPopoverOpen: false,
        popoverId: getUniqueDomId()
      };
      this.handleLinkEl = (linkEl) => {
        this.linkEl = linkEl;
        if (this.props.elRef) {
          setRef(this.props.elRef, linkEl);
        }
      };
      this.handleClick = (ev) => {
        let { props, context } = this;
        let { moreLinkClick } = context.options;
        let date = computeRange(props).start;
        function buildPublicSeg(seg) {
          let { def, instance, range: range2 } = seg.eventRange;
          return {
            event: new EventImpl(context, def, instance),
            start: context.dateEnv.toDate(range2.start),
            end: context.dateEnv.toDate(range2.end),
            isStart: seg.isStart,
            isEnd: seg.isEnd
          };
        }
        if (typeof moreLinkClick === "function") {
          moreLinkClick = moreLinkClick({
            date,
            allDay: Boolean(props.allDayDate),
            allSegs: props.allSegs.map(buildPublicSeg),
            hiddenSegs: props.hiddenSegs.map(buildPublicSeg),
            jsEvent: ev,
            view: context.viewApi
          });
        }
        if (!moreLinkClick || moreLinkClick === "popover") {
          this.setState({ isPopoverOpen: true });
        } else if (typeof moreLinkClick === "string") {
          context.calendarApi.zoomTo(date, moreLinkClick);
        }
      };
      this.handlePopoverClose = () => {
        this.setState({ isPopoverOpen: false });
      };
    }
    render() {
      let { props, state } = this;
      return y(ViewContextType.Consumer, null, (context) => {
        let { viewApi, options, calendarApi } = context;
        let { moreLinkText } = options;
        let { moreCnt } = props;
        let range2 = computeRange(props);
        let text = typeof moreLinkText === "function" ? moreLinkText.call(calendarApi, moreCnt) : `+${moreCnt} ${moreLinkText}`;
        let hint = formatWithOrdinals(options.moreLinkHint, [moreCnt], text);
        let renderProps = {
          num: moreCnt,
          shortText: `+${moreCnt}`,
          text,
          view: viewApi
        };
        return y(
          _,
          null,
          Boolean(props.moreCnt) && y(ContentContainer, { elTag: props.elTag || "a", elRef: this.handleLinkEl, elClasses: [
            ...props.elClasses || [],
            "fc-more-link"
          ], elStyle: props.elStyle, elAttrs: Object.assign(Object.assign(Object.assign({}, props.elAttrs), createAriaClickAttrs(this.handleClick)), { title: hint, "aria-expanded": state.isPopoverOpen, "aria-controls": state.isPopoverOpen ? state.popoverId : "" }), renderProps, generatorName: "moreLinkContent", customGenerator: options.moreLinkContent, defaultGenerator: props.defaultGenerator || renderMoreLinkInner, classNameGenerator: options.moreLinkClassNames, didMount: options.moreLinkDidMount, willUnmount: options.moreLinkWillUnmount }, props.children),
          state.isPopoverOpen && y(MorePopover, { id: state.popoverId, startDate: range2.start, endDate: range2.end, dateProfile: props.dateProfile, todayRange: props.todayRange, extraDateSpan: props.extraDateSpan, parentEl: this.parentEl, alignmentEl: props.alignmentElRef ? props.alignmentElRef.current : this.linkEl, alignGridTop: props.alignGridTop, forceTimed: props.forceTimed, onClose: this.handlePopoverClose }, props.popoverContent())
        );
      });
    }
    componentDidMount() {
      this.updateParentEl();
    }
    componentDidUpdate() {
      this.updateParentEl();
    }
    updateParentEl() {
      if (this.linkEl) {
        this.parentEl = elementClosest(this.linkEl, ".fc-view-harness");
      }
    }
  };
  function renderMoreLinkInner(props) {
    return props.text;
  }
  function computeRange(props) {
    if (props.allDayDate) {
      return {
        start: props.allDayDate,
        end: addDays(props.allDayDate, 1)
      };
    }
    let { hiddenSegs } = props;
    return {
      start: computeEarliestSegStart(hiddenSegs),
      end: computeLatestSegEnd(hiddenSegs)
    };
  }
  function computeEarliestSegStart(segs) {
    return segs.reduce(pickEarliestStart).eventRange.range.start;
  }
  function pickEarliestStart(seg0, seg1) {
    return seg0.eventRange.range.start < seg1.eventRange.range.start ? seg0 : seg1;
  }
  function computeLatestSegEnd(segs) {
    return segs.reduce(pickLatestEnd).eventRange.range.end;
  }
  function pickLatestEnd(seg0, seg1) {
    return seg0.eventRange.range.end > seg1.eventRange.range.end ? seg0 : seg1;
  }

  // node_modules/@fullcalendar/core/index.js
  var globalLocales = [];
  var MINIMAL_RAW_EN_LOCALE = {
    code: "en",
    week: {
      dow: 0,
      doy: 4
      // 4 days need to be within the year to be considered the first week
    },
    direction: "ltr",
    buttonText: {
      prev: "prev",
      next: "next",
      prevYear: "prev year",
      nextYear: "next year",
      year: "year",
      today: "today",
      month: "month",
      week: "week",
      day: "day",
      list: "list"
    },
    weekText: "W",
    weekTextLong: "Week",
    closeHint: "Close",
    timeHint: "Time",
    eventHint: "Event",
    allDayText: "all-day",
    moreLinkText: "more",
    noEventsText: "No events to display"
  };
  var RAW_EN_LOCALE = Object.assign(Object.assign({}, MINIMAL_RAW_EN_LOCALE), {
    // Includes things we don't want other locales to inherit,
    // things that derive from other translatable strings.
    buttonHints: {
      prev: "Previous $0",
      next: "Next $0",
      today(buttonText, unit) {
        return unit === "day" ? "Today" : `This ${buttonText}`;
      }
    },
    viewHint: "$0 view",
    navLinkHint: "Go to $0",
    moreLinkHint(eventCnt) {
      return `Show ${eventCnt} more event${eventCnt === 1 ? "" : "s"}`;
    }
  });
  function organizeRawLocales(explicitRawLocales) {
    let defaultCode = explicitRawLocales.length > 0 ? explicitRawLocales[0].code : "en";
    let allRawLocales = globalLocales.concat(explicitRawLocales);
    let rawLocaleMap = {
      en: RAW_EN_LOCALE
    };
    for (let rawLocale of allRawLocales) {
      rawLocaleMap[rawLocale.code] = rawLocale;
    }
    return {
      map: rawLocaleMap,
      defaultCode
    };
  }
  function buildLocale(inputSingular, available) {
    if (typeof inputSingular === "object" && !Array.isArray(inputSingular)) {
      return parseLocale(inputSingular.code, [inputSingular.code], inputSingular);
    }
    return queryLocale(inputSingular, available);
  }
  function queryLocale(codeArg, available) {
    let codes = [].concat(codeArg || []);
    let raw = queryRawLocale(codes, available) || RAW_EN_LOCALE;
    return parseLocale(codeArg, codes, raw);
  }
  function queryRawLocale(codes, available) {
    for (let i3 = 0; i3 < codes.length; i3 += 1) {
      let parts = codes[i3].toLocaleLowerCase().split("-");
      for (let j4 = parts.length; j4 > 0; j4 -= 1) {
        let simpleId = parts.slice(0, j4).join("-");
        if (available[simpleId]) {
          return available[simpleId];
        }
      }
    }
    return null;
  }
  function parseLocale(codeArg, codes, raw) {
    let merged = mergeProps([MINIMAL_RAW_EN_LOCALE, raw], ["buttonText"]);
    delete merged.code;
    let { week } = merged;
    delete merged.week;
    return {
      codeArg,
      codes,
      week,
      simpleNumberFormat: new Intl.NumberFormat(codeArg),
      options: merged
    };
  }
  function createPlugin(input) {
    return {
      id: guid(),
      name: input.name,
      premiumReleaseDate: input.premiumReleaseDate ? new Date(input.premiumReleaseDate) : void 0,
      deps: input.deps || [],
      reducers: input.reducers || [],
      isLoadingFuncs: input.isLoadingFuncs || [],
      contextInit: [].concat(input.contextInit || []),
      eventRefiners: input.eventRefiners || {},
      eventDefMemberAdders: input.eventDefMemberAdders || [],
      eventSourceRefiners: input.eventSourceRefiners || {},
      isDraggableTransformers: input.isDraggableTransformers || [],
      eventDragMutationMassagers: input.eventDragMutationMassagers || [],
      eventDefMutationAppliers: input.eventDefMutationAppliers || [],
      dateSelectionTransformers: input.dateSelectionTransformers || [],
      datePointTransforms: input.datePointTransforms || [],
      dateSpanTransforms: input.dateSpanTransforms || [],
      views: input.views || {},
      viewPropsTransformers: input.viewPropsTransformers || [],
      isPropsValid: input.isPropsValid || null,
      externalDefTransforms: input.externalDefTransforms || [],
      viewContainerAppends: input.viewContainerAppends || [],
      eventDropTransformers: input.eventDropTransformers || [],
      componentInteractions: input.componentInteractions || [],
      calendarInteractions: input.calendarInteractions || [],
      themeClasses: input.themeClasses || {},
      eventSourceDefs: input.eventSourceDefs || [],
      cmdFormatter: input.cmdFormatter,
      recurringTypes: input.recurringTypes || [],
      namedTimeZonedImpl: input.namedTimeZonedImpl,
      initialView: input.initialView || "",
      elementDraggingImpl: input.elementDraggingImpl,
      optionChangeHandlers: input.optionChangeHandlers || {},
      scrollGridImpl: input.scrollGridImpl || null,
      listenerRefiners: input.listenerRefiners || {},
      optionRefiners: input.optionRefiners || {},
      propSetHandlers: input.propSetHandlers || {}
    };
  }
  function buildPluginHooks(pluginDefs, globalDefs) {
    let currentPluginIds = {};
    let hooks = {
      premiumReleaseDate: void 0,
      reducers: [],
      isLoadingFuncs: [],
      contextInit: [],
      eventRefiners: {},
      eventDefMemberAdders: [],
      eventSourceRefiners: {},
      isDraggableTransformers: [],
      eventDragMutationMassagers: [],
      eventDefMutationAppliers: [],
      dateSelectionTransformers: [],
      datePointTransforms: [],
      dateSpanTransforms: [],
      views: {},
      viewPropsTransformers: [],
      isPropsValid: null,
      externalDefTransforms: [],
      viewContainerAppends: [],
      eventDropTransformers: [],
      componentInteractions: [],
      calendarInteractions: [],
      themeClasses: {},
      eventSourceDefs: [],
      cmdFormatter: null,
      recurringTypes: [],
      namedTimeZonedImpl: null,
      initialView: "",
      elementDraggingImpl: null,
      optionChangeHandlers: {},
      scrollGridImpl: null,
      listenerRefiners: {},
      optionRefiners: {},
      propSetHandlers: {}
    };
    function addDefs(defs) {
      for (let def of defs) {
        const pluginName = def.name;
        const currentId = currentPluginIds[pluginName];
        if (currentId === void 0) {
          currentPluginIds[pluginName] = def.id;
          addDefs(def.deps);
          hooks = combineHooks(hooks, def);
        } else if (currentId !== def.id) {
          console.warn(`Duplicate plugin '${pluginName}'`);
        }
      }
    }
    if (pluginDefs) {
      addDefs(pluginDefs);
    }
    addDefs(globalDefs);
    return hooks;
  }
  function buildBuildPluginHooks() {
    let currentOverrideDefs = [];
    let currentGlobalDefs = [];
    let currentHooks;
    return (overrideDefs, globalDefs) => {
      if (!currentHooks || !isArraysEqual(overrideDefs, currentOverrideDefs) || !isArraysEqual(globalDefs, currentGlobalDefs)) {
        currentHooks = buildPluginHooks(overrideDefs, globalDefs);
      }
      currentOverrideDefs = overrideDefs;
      currentGlobalDefs = globalDefs;
      return currentHooks;
    };
  }
  function combineHooks(hooks0, hooks1) {
    return {
      premiumReleaseDate: compareOptionalDates(hooks0.premiumReleaseDate, hooks1.premiumReleaseDate),
      reducers: hooks0.reducers.concat(hooks1.reducers),
      isLoadingFuncs: hooks0.isLoadingFuncs.concat(hooks1.isLoadingFuncs),
      contextInit: hooks0.contextInit.concat(hooks1.contextInit),
      eventRefiners: Object.assign(Object.assign({}, hooks0.eventRefiners), hooks1.eventRefiners),
      eventDefMemberAdders: hooks0.eventDefMemberAdders.concat(hooks1.eventDefMemberAdders),
      eventSourceRefiners: Object.assign(Object.assign({}, hooks0.eventSourceRefiners), hooks1.eventSourceRefiners),
      isDraggableTransformers: hooks0.isDraggableTransformers.concat(hooks1.isDraggableTransformers),
      eventDragMutationMassagers: hooks0.eventDragMutationMassagers.concat(hooks1.eventDragMutationMassagers),
      eventDefMutationAppliers: hooks0.eventDefMutationAppliers.concat(hooks1.eventDefMutationAppliers),
      dateSelectionTransformers: hooks0.dateSelectionTransformers.concat(hooks1.dateSelectionTransformers),
      datePointTransforms: hooks0.datePointTransforms.concat(hooks1.datePointTransforms),
      dateSpanTransforms: hooks0.dateSpanTransforms.concat(hooks1.dateSpanTransforms),
      views: Object.assign(Object.assign({}, hooks0.views), hooks1.views),
      viewPropsTransformers: hooks0.viewPropsTransformers.concat(hooks1.viewPropsTransformers),
      isPropsValid: hooks1.isPropsValid || hooks0.isPropsValid,
      externalDefTransforms: hooks0.externalDefTransforms.concat(hooks1.externalDefTransforms),
      viewContainerAppends: hooks0.viewContainerAppends.concat(hooks1.viewContainerAppends),
      eventDropTransformers: hooks0.eventDropTransformers.concat(hooks1.eventDropTransformers),
      calendarInteractions: hooks0.calendarInteractions.concat(hooks1.calendarInteractions),
      componentInteractions: hooks0.componentInteractions.concat(hooks1.componentInteractions),
      themeClasses: Object.assign(Object.assign({}, hooks0.themeClasses), hooks1.themeClasses),
      eventSourceDefs: hooks0.eventSourceDefs.concat(hooks1.eventSourceDefs),
      cmdFormatter: hooks1.cmdFormatter || hooks0.cmdFormatter,
      recurringTypes: hooks0.recurringTypes.concat(hooks1.recurringTypes),
      namedTimeZonedImpl: hooks1.namedTimeZonedImpl || hooks0.namedTimeZonedImpl,
      initialView: hooks0.initialView || hooks1.initialView,
      elementDraggingImpl: hooks0.elementDraggingImpl || hooks1.elementDraggingImpl,
      optionChangeHandlers: Object.assign(Object.assign({}, hooks0.optionChangeHandlers), hooks1.optionChangeHandlers),
      scrollGridImpl: hooks1.scrollGridImpl || hooks0.scrollGridImpl,
      listenerRefiners: Object.assign(Object.assign({}, hooks0.listenerRefiners), hooks1.listenerRefiners),
      optionRefiners: Object.assign(Object.assign({}, hooks0.optionRefiners), hooks1.optionRefiners),
      propSetHandlers: Object.assign(Object.assign({}, hooks0.propSetHandlers), hooks1.propSetHandlers)
    };
  }
  function compareOptionalDates(date0, date1) {
    if (date0 === void 0) {
      return date1;
    }
    if (date1 === void 0) {
      return date0;
    }
    return new Date(Math.max(date0.valueOf(), date1.valueOf()));
  }
  var StandardTheme = class extends Theme {
  };
  StandardTheme.prototype.classes = {
    root: "fc-theme-standard",
    tableCellShaded: "fc-cell-shaded",
    buttonGroup: "fc-button-group",
    button: "fc-button fc-button-primary",
    buttonActive: "fc-button-active"
  };
  StandardTheme.prototype.baseIconClass = "fc-icon";
  StandardTheme.prototype.iconClasses = {
    close: "fc-icon-x",
    prev: "fc-icon-chevron-left",
    next: "fc-icon-chevron-right",
    prevYear: "fc-icon-chevrons-left",
    nextYear: "fc-icon-chevrons-right"
  };
  StandardTheme.prototype.rtlIconClasses = {
    prev: "fc-icon-chevron-right",
    next: "fc-icon-chevron-left",
    prevYear: "fc-icon-chevrons-right",
    nextYear: "fc-icon-chevrons-left"
  };
  StandardTheme.prototype.iconOverrideOption = "buttonIcons";
  StandardTheme.prototype.iconOverrideCustomButtonOption = "icon";
  StandardTheme.prototype.iconOverridePrefix = "fc-icon-";
  function compileViewDefs(defaultConfigs, overrideConfigs) {
    let hash = {};
    let viewType;
    for (viewType in defaultConfigs) {
      ensureViewDef(viewType, hash, defaultConfigs, overrideConfigs);
    }
    for (viewType in overrideConfigs) {
      ensureViewDef(viewType, hash, defaultConfigs, overrideConfigs);
    }
    return hash;
  }
  function ensureViewDef(viewType, hash, defaultConfigs, overrideConfigs) {
    if (hash[viewType]) {
      return hash[viewType];
    }
    let viewDef = buildViewDef(viewType, hash, defaultConfigs, overrideConfigs);
    if (viewDef) {
      hash[viewType] = viewDef;
    }
    return viewDef;
  }
  function buildViewDef(viewType, hash, defaultConfigs, overrideConfigs) {
    let defaultConfig = defaultConfigs[viewType];
    let overrideConfig = overrideConfigs[viewType];
    let queryProp = (name) => defaultConfig && defaultConfig[name] !== null ? defaultConfig[name] : overrideConfig && overrideConfig[name] !== null ? overrideConfig[name] : null;
    let theComponent = queryProp("component");
    let superType = queryProp("superType");
    let superDef = null;
    if (superType) {
      if (superType === viewType) {
        throw new Error("Can't have a custom view type that references itself");
      }
      superDef = ensureViewDef(superType, hash, defaultConfigs, overrideConfigs);
    }
    if (!theComponent && superDef) {
      theComponent = superDef.component;
    }
    if (!theComponent) {
      return null;
    }
    return {
      type: viewType,
      component: theComponent,
      defaults: Object.assign(Object.assign({}, superDef ? superDef.defaults : {}), defaultConfig ? defaultConfig.rawOptions : {}),
      overrides: Object.assign(Object.assign({}, superDef ? superDef.overrides : {}), overrideConfig ? overrideConfig.rawOptions : {})
    };
  }
  function parseViewConfigs(inputs) {
    return mapHash(inputs, parseViewConfig);
  }
  function parseViewConfig(input) {
    let rawOptions = typeof input === "function" ? { component: input } : input;
    let { component } = rawOptions;
    if (rawOptions.content) {
      component = createViewHookComponent(rawOptions);
    } else if (component && !(component.prototype instanceof BaseComponent)) {
      component = createViewHookComponent(Object.assign(Object.assign({}, rawOptions), { content: component }));
    }
    return {
      superType: rawOptions.type,
      component,
      rawOptions
      // includes type and component too :(
    };
  }
  function createViewHookComponent(options) {
    return (viewProps) => y(ViewContextType.Consumer, null, (context) => y(ContentContainer, { elTag: "div", elClasses: buildViewClassNames(context.viewSpec), renderProps: Object.assign(Object.assign({}, viewProps), { nextDayThreshold: context.options.nextDayThreshold }), generatorName: void 0, customGenerator: options.content, classNameGenerator: options.classNames, didMount: options.didMount, willUnmount: options.willUnmount }));
  }
  function buildViewSpecs(defaultInputs, optionOverrides, dynamicOptionOverrides, localeDefaults) {
    let defaultConfigs = parseViewConfigs(defaultInputs);
    let overrideConfigs = parseViewConfigs(optionOverrides.views);
    let viewDefs = compileViewDefs(defaultConfigs, overrideConfigs);
    return mapHash(viewDefs, (viewDef) => buildViewSpec(viewDef, overrideConfigs, optionOverrides, dynamicOptionOverrides, localeDefaults));
  }
  function buildViewSpec(viewDef, overrideConfigs, optionOverrides, dynamicOptionOverrides, localeDefaults) {
    let durationInput = viewDef.overrides.duration || viewDef.defaults.duration || dynamicOptionOverrides.duration || optionOverrides.duration;
    let duration = null;
    let durationUnit = "";
    let singleUnit = "";
    let singleUnitOverrides = {};
    if (durationInput) {
      duration = createDurationCached(durationInput);
      if (duration) {
        let denom = greatestDurationDenominator(duration);
        durationUnit = denom.unit;
        if (denom.value === 1) {
          singleUnit = durationUnit;
          singleUnitOverrides = overrideConfigs[durationUnit] ? overrideConfigs[durationUnit].rawOptions : {};
        }
      }
    }
    let queryButtonText = (optionsSubset) => {
      let buttonTextMap = optionsSubset.buttonText || {};
      let buttonTextKey = viewDef.defaults.buttonTextKey;
      if (buttonTextKey != null && buttonTextMap[buttonTextKey] != null) {
        return buttonTextMap[buttonTextKey];
      }
      if (buttonTextMap[viewDef.type] != null) {
        return buttonTextMap[viewDef.type];
      }
      if (buttonTextMap[singleUnit] != null) {
        return buttonTextMap[singleUnit];
      }
      return null;
    };
    let queryButtonTitle = (optionsSubset) => {
      let buttonHints = optionsSubset.buttonHints || {};
      let buttonKey = viewDef.defaults.buttonTextKey;
      if (buttonKey != null && buttonHints[buttonKey] != null) {
        return buttonHints[buttonKey];
      }
      if (buttonHints[viewDef.type] != null) {
        return buttonHints[viewDef.type];
      }
      if (buttonHints[singleUnit] != null) {
        return buttonHints[singleUnit];
      }
      return null;
    };
    return {
      type: viewDef.type,
      component: viewDef.component,
      duration,
      durationUnit,
      singleUnit,
      optionDefaults: viewDef.defaults,
      optionOverrides: Object.assign(Object.assign({}, singleUnitOverrides), viewDef.overrides),
      buttonTextOverride: queryButtonText(dynamicOptionOverrides) || queryButtonText(optionOverrides) || // constructor-specified buttonText lookup hash takes precedence
      viewDef.overrides.buttonText,
      buttonTextDefault: queryButtonText(localeDefaults) || viewDef.defaults.buttonText || queryButtonText(BASE_OPTION_DEFAULTS) || viewDef.type,
      // not DRY
      buttonTitleOverride: queryButtonTitle(dynamicOptionOverrides) || queryButtonTitle(optionOverrides) || viewDef.overrides.buttonHint,
      buttonTitleDefault: queryButtonTitle(localeDefaults) || viewDef.defaults.buttonHint || queryButtonTitle(BASE_OPTION_DEFAULTS)
      // will eventually fall back to buttonText
    };
  }
  var durationInputMap = {};
  function createDurationCached(durationInput) {
    let json = JSON.stringify(durationInput);
    let res = durationInputMap[json];
    if (res === void 0) {
      res = createDuration(durationInput);
      durationInputMap[json] = res;
    }
    return res;
  }
  function reduceViewType(viewType, action) {
    switch (action.type) {
      case "CHANGE_VIEW_TYPE":
        viewType = action.viewType;
    }
    return viewType;
  }
  function reduceCurrentDate(currentDate, action) {
    switch (action.type) {
      case "CHANGE_DATE":
        return action.dateMarker;
      default:
        return currentDate;
    }
  }
  function getInitialDate(options, dateEnv, nowManager) {
    let initialDateInput = options.initialDate;
    if (initialDateInput != null) {
      return dateEnv.createMarker(initialDateInput);
    }
    return nowManager.getDateMarker();
  }
  function reduceDynamicOptionOverrides(dynamicOptionOverrides, action) {
    switch (action.type) {
      case "SET_OPTION":
        return Object.assign(Object.assign({}, dynamicOptionOverrides), { [action.optionName]: action.rawOptionValue });
      default:
        return dynamicOptionOverrides;
    }
  }
  function reduceDateProfile(currentDateProfile, action, currentDate, dateProfileGenerator) {
    let dp;
    switch (action.type) {
      case "CHANGE_VIEW_TYPE":
        return dateProfileGenerator.build(action.dateMarker || currentDate);
      case "CHANGE_DATE":
        return dateProfileGenerator.build(action.dateMarker);
      case "PREV":
        dp = dateProfileGenerator.buildPrev(currentDateProfile, currentDate);
        if (dp.isValid) {
          return dp;
        }
        break;
      case "NEXT":
        dp = dateProfileGenerator.buildNext(currentDateProfile, currentDate);
        if (dp.isValid) {
          return dp;
        }
        break;
    }
    return currentDateProfile;
  }
  function initEventSources(calendarOptions, dateProfile, context) {
    let activeRange = dateProfile ? dateProfile.activeRange : null;
    return addSources({}, parseInitialSources(calendarOptions, context), activeRange, context);
  }
  function reduceEventSources(eventSources, action, dateProfile, context) {
    let activeRange = dateProfile ? dateProfile.activeRange : null;
    switch (action.type) {
      case "ADD_EVENT_SOURCES":
        return addSources(eventSources, action.sources, activeRange, context);
      case "REMOVE_EVENT_SOURCE":
        return removeSource(eventSources, action.sourceId);
      case "PREV":
      // TODO: how do we track all actions that affect dateProfile :(
      case "NEXT":
      case "CHANGE_DATE":
      case "CHANGE_VIEW_TYPE":
        if (dateProfile) {
          return fetchDirtySources(eventSources, activeRange, context);
        }
        return eventSources;
      case "FETCH_EVENT_SOURCES":
        return fetchSourcesByIds(eventSources, action.sourceIds ? (
          // why no type?
          arrayToHash(action.sourceIds)
        ) : excludeStaticSources(eventSources, context), activeRange, action.isRefetch || false, context);
      case "RECEIVE_EVENTS":
      case "RECEIVE_EVENT_ERROR":
        return receiveResponse(eventSources, action.sourceId, action.fetchId, action.fetchRange);
      case "REMOVE_ALL_EVENT_SOURCES":
        return {};
      default:
        return eventSources;
    }
  }
  function reduceEventSourcesNewTimeZone(eventSources, dateProfile, context) {
    let activeRange = dateProfile ? dateProfile.activeRange : null;
    return fetchSourcesByIds(eventSources, excludeStaticSources(eventSources, context), activeRange, true, context);
  }
  function computeEventSourcesLoading(eventSources) {
    for (let sourceId in eventSources) {
      if (eventSources[sourceId].isFetching) {
        return true;
      }
    }
    return false;
  }
  function addSources(eventSourceHash, sources, fetchRange, context) {
    let hash = {};
    for (let source of sources) {
      hash[source.sourceId] = source;
    }
    if (fetchRange) {
      hash = fetchDirtySources(hash, fetchRange, context);
    }
    return Object.assign(Object.assign({}, eventSourceHash), hash);
  }
  function removeSource(eventSourceHash, sourceId) {
    return filterHash(eventSourceHash, (eventSource) => eventSource.sourceId !== sourceId);
  }
  function fetchDirtySources(sourceHash, fetchRange, context) {
    return fetchSourcesByIds(sourceHash, filterHash(sourceHash, (eventSource) => isSourceDirty(eventSource, fetchRange, context)), fetchRange, false, context);
  }
  function isSourceDirty(eventSource, fetchRange, context) {
    if (!doesSourceNeedRange(eventSource, context)) {
      return !eventSource.latestFetchId;
    }
    return !context.options.lazyFetching || !eventSource.fetchRange || eventSource.isFetching || // always cancel outdated in-progress fetches
    fetchRange.start < eventSource.fetchRange.start || fetchRange.end > eventSource.fetchRange.end;
  }
  function fetchSourcesByIds(prevSources, sourceIdHash, fetchRange, isRefetch, context) {
    let nextSources = {};
    for (let sourceId in prevSources) {
      let source = prevSources[sourceId];
      if (sourceIdHash[sourceId]) {
        nextSources[sourceId] = fetchSource(source, fetchRange, isRefetch, context);
      } else {
        nextSources[sourceId] = source;
      }
    }
    return nextSources;
  }
  function fetchSource(eventSource, fetchRange, isRefetch, context) {
    let { options, calendarApi } = context;
    let sourceDef = context.pluginHooks.eventSourceDefs[eventSource.sourceDefId];
    let fetchId = guid();
    sourceDef.fetch({
      eventSource,
      range: fetchRange,
      isRefetch,
      context
    }, (res) => {
      let { rawEvents } = res;
      if (options.eventSourceSuccess) {
        rawEvents = options.eventSourceSuccess.call(calendarApi, rawEvents, res.response) || rawEvents;
      }
      if (eventSource.success) {
        rawEvents = eventSource.success.call(calendarApi, rawEvents, res.response) || rawEvents;
      }
      context.dispatch({
        type: "RECEIVE_EVENTS",
        sourceId: eventSource.sourceId,
        fetchId,
        fetchRange,
        rawEvents
      });
    }, (error) => {
      let errorHandled = false;
      if (options.eventSourceFailure) {
        options.eventSourceFailure.call(calendarApi, error);
        errorHandled = true;
      }
      if (eventSource.failure) {
        eventSource.failure(error);
        errorHandled = true;
      }
      if (!errorHandled) {
        console.warn(error.message, error);
      }
      context.dispatch({
        type: "RECEIVE_EVENT_ERROR",
        sourceId: eventSource.sourceId,
        fetchId,
        fetchRange,
        error
      });
    });
    return Object.assign(Object.assign({}, eventSource), { isFetching: true, latestFetchId: fetchId });
  }
  function receiveResponse(sourceHash, sourceId, fetchId, fetchRange) {
    let eventSource = sourceHash[sourceId];
    if (eventSource && // not already removed
    fetchId === eventSource.latestFetchId) {
      return Object.assign(Object.assign({}, sourceHash), { [sourceId]: Object.assign(Object.assign({}, eventSource), { isFetching: false, fetchRange }) });
    }
    return sourceHash;
  }
  function excludeStaticSources(eventSources, context) {
    return filterHash(eventSources, (eventSource) => doesSourceNeedRange(eventSource, context));
  }
  function parseInitialSources(rawOptions, context) {
    let refiners = buildEventSourceRefiners(context);
    let rawSources = [].concat(rawOptions.eventSources || []);
    let sources = [];
    if (rawOptions.initialEvents) {
      rawSources.unshift(rawOptions.initialEvents);
    }
    if (rawOptions.events) {
      rawSources.unshift(rawOptions.events);
    }
    for (let rawSource of rawSources) {
      let source = parseEventSource(rawSource, context, refiners);
      if (source) {
        sources.push(source);
      }
    }
    return sources;
  }
  function doesSourceNeedRange(eventSource, context) {
    let defs = context.pluginHooks.eventSourceDefs;
    return !defs[eventSource.sourceDefId].ignoreRange;
  }
  function reduceDateSelection(currentSelection, action) {
    switch (action.type) {
      case "UNSELECT_DATES":
        return null;
      case "SELECT_DATES":
        return action.selection;
      default:
        return currentSelection;
    }
  }
  function reduceSelectedEvent(currentInstanceId, action) {
    switch (action.type) {
      case "UNSELECT_EVENT":
        return "";
      case "SELECT_EVENT":
        return action.eventInstanceId;
      default:
        return currentInstanceId;
    }
  }
  function reduceEventDrag(currentDrag, action) {
    let newDrag;
    switch (action.type) {
      case "UNSET_EVENT_DRAG":
        return null;
      case "SET_EVENT_DRAG":
        newDrag = action.state;
        return {
          affectedEvents: newDrag.affectedEvents,
          mutatedEvents: newDrag.mutatedEvents,
          isEvent: newDrag.isEvent
        };
      default:
        return currentDrag;
    }
  }
  function reduceEventResize(currentResize, action) {
    let newResize;
    switch (action.type) {
      case "UNSET_EVENT_RESIZE":
        return null;
      case "SET_EVENT_RESIZE":
        newResize = action.state;
        return {
          affectedEvents: newResize.affectedEvents,
          mutatedEvents: newResize.mutatedEvents,
          isEvent: newResize.isEvent
        };
      default:
        return currentResize;
    }
  }
  function parseToolbars(calendarOptions, calendarOptionOverrides, theme, viewSpecs, calendarApi) {
    let header = calendarOptions.headerToolbar ? parseToolbar(calendarOptions.headerToolbar, calendarOptions, calendarOptionOverrides, theme, viewSpecs, calendarApi) : null;
    let footer = calendarOptions.footerToolbar ? parseToolbar(calendarOptions.footerToolbar, calendarOptions, calendarOptionOverrides, theme, viewSpecs, calendarApi) : null;
    return { header, footer };
  }
  function parseToolbar(sectionStrHash, calendarOptions, calendarOptionOverrides, theme, viewSpecs, calendarApi) {
    let sectionWidgets = {};
    let viewsWithButtons = [];
    let hasTitle = false;
    for (let sectionName in sectionStrHash) {
      let sectionStr = sectionStrHash[sectionName];
      let sectionRes = parseSection(sectionStr, calendarOptions, calendarOptionOverrides, theme, viewSpecs, calendarApi);
      sectionWidgets[sectionName] = sectionRes.widgets;
      viewsWithButtons.push(...sectionRes.viewsWithButtons);
      hasTitle = hasTitle || sectionRes.hasTitle;
    }
    return { sectionWidgets, viewsWithButtons, hasTitle };
  }
  function parseSection(sectionStr, calendarOptions, calendarOptionOverrides, theme, viewSpecs, calendarApi) {
    let isRtl = calendarOptions.direction === "rtl";
    let calendarCustomButtons = calendarOptions.customButtons || {};
    let calendarButtonTextOverrides = calendarOptionOverrides.buttonText || {};
    let calendarButtonText = calendarOptions.buttonText || {};
    let calendarButtonHintOverrides = calendarOptionOverrides.buttonHints || {};
    let calendarButtonHints = calendarOptions.buttonHints || {};
    let sectionSubstrs = sectionStr ? sectionStr.split(" ") : [];
    let viewsWithButtons = [];
    let hasTitle = false;
    let widgets = sectionSubstrs.map((buttonGroupStr) => buttonGroupStr.split(",").map((buttonName) => {
      if (buttonName === "title") {
        hasTitle = true;
        return { buttonName };
      }
      let customButtonProps;
      let viewSpec;
      let buttonClick;
      let buttonIcon;
      let buttonText;
      let buttonHint;
      if (customButtonProps = calendarCustomButtons[buttonName]) {
        buttonClick = (ev) => {
          if (customButtonProps.click) {
            customButtonProps.click.call(ev.target, ev, ev.target);
          }
        };
        (buttonIcon = theme.getCustomButtonIconClass(customButtonProps)) || (buttonIcon = theme.getIconClass(buttonName, isRtl)) || (buttonText = customButtonProps.text);
        buttonHint = customButtonProps.hint || customButtonProps.text;
      } else if (viewSpec = viewSpecs[buttonName]) {
        viewsWithButtons.push(buttonName);
        buttonClick = () => {
          calendarApi.changeView(buttonName);
        };
        (buttonText = viewSpec.buttonTextOverride) || (buttonIcon = theme.getIconClass(buttonName, isRtl)) || (buttonText = viewSpec.buttonTextDefault);
        let textFallback = viewSpec.buttonTextOverride || viewSpec.buttonTextDefault;
        buttonHint = formatWithOrdinals(
          viewSpec.buttonTitleOverride || viewSpec.buttonTitleDefault || calendarOptions.viewHint,
          [textFallback, buttonName],
          // view-name = buttonName
          textFallback
        );
      } else if (calendarApi[buttonName]) {
        buttonClick = () => {
          calendarApi[buttonName]();
        };
        (buttonText = calendarButtonTextOverrides[buttonName]) || (buttonIcon = theme.getIconClass(buttonName, isRtl)) || (buttonText = calendarButtonText[buttonName]);
        if (buttonName === "prevYear" || buttonName === "nextYear") {
          let prevOrNext = buttonName === "prevYear" ? "prev" : "next";
          buttonHint = formatWithOrdinals(calendarButtonHintOverrides[prevOrNext] || calendarButtonHints[prevOrNext], [
            calendarButtonText.year || "year",
            "year"
          ], calendarButtonText[buttonName]);
        } else {
          buttonHint = (navUnit) => formatWithOrdinals(calendarButtonHintOverrides[buttonName] || calendarButtonHints[buttonName], [
            calendarButtonText[navUnit] || navUnit,
            navUnit
          ], calendarButtonText[buttonName]);
        }
      }
      return { buttonName, buttonClick, buttonIcon, buttonText, buttonHint };
    }));
    return { widgets, viewsWithButtons, hasTitle };
  }
  var ViewImpl = class {
    constructor(type, getCurrentData, dateEnv) {
      this.type = type;
      this.getCurrentData = getCurrentData;
      this.dateEnv = dateEnv;
    }
    get calendar() {
      return this.getCurrentData().calendarApi;
    }
    get title() {
      return this.getCurrentData().viewTitle;
    }
    get activeStart() {
      return this.dateEnv.toDate(this.getCurrentData().dateProfile.activeRange.start);
    }
    get activeEnd() {
      return this.dateEnv.toDate(this.getCurrentData().dateProfile.activeRange.end);
    }
    get currentStart() {
      return this.dateEnv.toDate(this.getCurrentData().dateProfile.currentRange.start);
    }
    get currentEnd() {
      return this.dateEnv.toDate(this.getCurrentData().dateProfile.currentRange.end);
    }
    getOption(name) {
      return this.getCurrentData().options[name];
    }
  };
  var eventSourceDef$2 = {
    ignoreRange: true,
    parseMeta(refined) {
      if (Array.isArray(refined.events)) {
        return refined.events;
      }
      return null;
    },
    fetch(arg, successCallback) {
      successCallback({
        rawEvents: arg.eventSource.meta
      });
    }
  };
  var arrayEventSourcePlugin = createPlugin({
    name: "array-event-source",
    eventSourceDefs: [eventSourceDef$2]
  });
  var eventSourceDef$1 = {
    parseMeta(refined) {
      if (typeof refined.events === "function") {
        return refined.events;
      }
      return null;
    },
    fetch(arg, successCallback, errorCallback) {
      const { dateEnv } = arg.context;
      const func = arg.eventSource.meta;
      unpromisify(func.bind(null, buildRangeApiWithTimeZone(arg.range, dateEnv)), (rawEvents) => successCallback({ rawEvents }), errorCallback);
    }
  };
  var funcEventSourcePlugin = createPlugin({
    name: "func-event-source",
    eventSourceDefs: [eventSourceDef$1]
  });
  var JSON_FEED_EVENT_SOURCE_REFINERS = {
    method: String,
    extraParams: identity,
    startParam: String,
    endParam: String,
    timeZoneParam: String
  };
  var eventSourceDef = {
    parseMeta(refined) {
      if (refined.url && (refined.format === "json" || !refined.format)) {
        return {
          url: refined.url,
          format: "json",
          method: (refined.method || "GET").toUpperCase(),
          extraParams: refined.extraParams,
          startParam: refined.startParam,
          endParam: refined.endParam,
          timeZoneParam: refined.timeZoneParam
        };
      }
      return null;
    },
    fetch(arg, successCallback, errorCallback) {
      const { meta } = arg.eventSource;
      const requestParams = buildRequestParams(meta, arg.range, arg.context);
      requestJson(meta.method, meta.url, requestParams).then(([rawEvents, response]) => {
        successCallback({ rawEvents, response });
      }, errorCallback);
    }
  };
  var jsonFeedEventSourcePlugin = createPlugin({
    name: "json-event-source",
    eventSourceRefiners: JSON_FEED_EVENT_SOURCE_REFINERS,
    eventSourceDefs: [eventSourceDef]
  });
  function buildRequestParams(meta, range2, context) {
    let { dateEnv, options } = context;
    let startParam;
    let endParam;
    let timeZoneParam;
    let customRequestParams;
    let params = {};
    startParam = meta.startParam;
    if (startParam == null) {
      startParam = options.startParam;
    }
    endParam = meta.endParam;
    if (endParam == null) {
      endParam = options.endParam;
    }
    timeZoneParam = meta.timeZoneParam;
    if (timeZoneParam == null) {
      timeZoneParam = options.timeZoneParam;
    }
    if (typeof meta.extraParams === "function") {
      customRequestParams = meta.extraParams();
    } else {
      customRequestParams = meta.extraParams || {};
    }
    Object.assign(params, customRequestParams);
    params[startParam] = dateEnv.formatIso(range2.start);
    params[endParam] = dateEnv.formatIso(range2.end);
    if (dateEnv.timeZone !== "local") {
      params[timeZoneParam] = dateEnv.timeZone;
    }
    return params;
  }
  var SIMPLE_RECURRING_REFINERS = {
    daysOfWeek: identity,
    startTime: createDuration,
    endTime: createDuration,
    duration: createDuration,
    startRecur: identity,
    endRecur: identity
  };
  var recurring = {
    parse(refined, dateEnv) {
      if (refined.daysOfWeek || refined.startTime || refined.endTime || refined.startRecur || refined.endRecur) {
        let recurringData = {
          daysOfWeek: refined.daysOfWeek || null,
          startTime: refined.startTime || null,
          endTime: refined.endTime || null,
          startRecur: refined.startRecur ? dateEnv.createMarker(refined.startRecur) : null,
          endRecur: refined.endRecur ? dateEnv.createMarker(refined.endRecur) : null,
          dateEnv
        };
        let duration;
        if (refined.duration) {
          duration = refined.duration;
        }
        if (!duration && refined.startTime && refined.endTime) {
          duration = subtractDurations(refined.endTime, refined.startTime);
        }
        return {
          allDayGuess: Boolean(!refined.startTime && !refined.endTime),
          duration,
          typeData: recurringData
          // doesn't need endTime anymore but oh well
        };
      }
      return null;
    },
    expand(typeData, framingRange, dateEnv) {
      let clippedFramingRange = intersectRanges(framingRange, { start: typeData.startRecur, end: typeData.endRecur });
      if (clippedFramingRange) {
        return expandRanges(typeData.daysOfWeek, typeData.startTime, typeData.dateEnv, dateEnv, clippedFramingRange);
      }
      return [];
    }
  };
  var simpleRecurringEventsPlugin = createPlugin({
    name: "simple-recurring-event",
    recurringTypes: [recurring],
    eventRefiners: SIMPLE_RECURRING_REFINERS
  });
  function expandRanges(daysOfWeek, startTime, eventDateEnv, calendarDateEnv, framingRange) {
    let dowHash = daysOfWeek ? arrayToHash(daysOfWeek) : null;
    let dayMarker = startOfDay(framingRange.start);
    let endMarker = framingRange.end;
    let instanceStarts = [];
    if (startTime) {
      if (startTime.milliseconds < 0) {
        endMarker = addDays(endMarker, 1);
      } else if (startTime.milliseconds >= 1e3 * 60 * 60 * 24) {
        dayMarker = addDays(dayMarker, -1);
      }
    }
    while (dayMarker < endMarker) {
      let instanceStart;
      if (!dowHash || dowHash[dayMarker.getUTCDay()]) {
        if (startTime) {
          instanceStart = calendarDateEnv.add(dayMarker, startTime);
        } else {
          instanceStart = dayMarker;
        }
        instanceStarts.push(calendarDateEnv.createMarker(eventDateEnv.toDate(instanceStart)));
      }
      dayMarker = addDays(dayMarker, 1);
    }
    return instanceStarts;
  }
  var changeHandlerPlugin = createPlugin({
    name: "change-handler",
    optionChangeHandlers: {
      events(events, context) {
        handleEventSources([events], context);
      },
      eventSources: handleEventSources
    }
  });
  function handleEventSources(inputs, context) {
    let unfoundSources = hashValuesToArray(context.getCurrentData().eventSources);
    if (unfoundSources.length === 1 && inputs.length === 1 && Array.isArray(unfoundSources[0]._raw) && Array.isArray(inputs[0])) {
      context.dispatch({
        type: "RESET_RAW_EVENTS",
        sourceId: unfoundSources[0].sourceId,
        rawEvents: inputs[0]
      });
      return;
    }
    let newInputs = [];
    for (let input of inputs) {
      let inputFound = false;
      for (let i3 = 0; i3 < unfoundSources.length; i3 += 1) {
        if (unfoundSources[i3]._raw === input) {
          unfoundSources.splice(i3, 1);
          inputFound = true;
          break;
        }
      }
      if (!inputFound) {
        newInputs.push(input);
      }
    }
    for (let unfoundSource of unfoundSources) {
      context.dispatch({
        type: "REMOVE_EVENT_SOURCE",
        sourceId: unfoundSource.sourceId
      });
    }
    for (let newInput of newInputs) {
      context.calendarApi.addEventSource(newInput);
    }
  }
  function handleDateProfile(dateProfile, context) {
    context.emitter.trigger("datesSet", Object.assign(Object.assign({}, buildRangeApiWithTimeZone(dateProfile.activeRange, context.dateEnv)), { view: context.viewApi }));
  }
  function handleEventStore(eventStore, context) {
    let { emitter } = context;
    if (emitter.hasHandlers("eventsSet")) {
      emitter.trigger("eventsSet", buildEventApis(eventStore, context));
    }
  }
  var globalPlugins = [
    arrayEventSourcePlugin,
    funcEventSourcePlugin,
    jsonFeedEventSourcePlugin,
    simpleRecurringEventsPlugin,
    changeHandlerPlugin,
    createPlugin({
      name: "misc",
      isLoadingFuncs: [
        (state) => computeEventSourcesLoading(state.eventSources)
      ],
      propSetHandlers: {
        dateProfile: handleDateProfile,
        eventStore: handleEventStore
      }
    })
  ];
  var TaskRunner = class {
    constructor(runTaskOption, drainedOption) {
      this.runTaskOption = runTaskOption;
      this.drainedOption = drainedOption;
      this.queue = [];
      this.delayedRunner = new DelayedRunner(this.drain.bind(this));
    }
    request(task, delay) {
      this.queue.push(task);
      this.delayedRunner.request(delay);
    }
    pause(scope) {
      this.delayedRunner.pause(scope);
    }
    resume(scope, force) {
      this.delayedRunner.resume(scope, force);
    }
    drain() {
      let { queue } = this;
      while (queue.length) {
        let completedTasks = [];
        let task;
        while (task = queue.shift()) {
          this.runTask(task);
          completedTasks.push(task);
        }
        this.drained(completedTasks);
      }
    }
    runTask(task) {
      if (this.runTaskOption) {
        this.runTaskOption(task);
      }
    }
    drained(completedTasks) {
      if (this.drainedOption) {
        this.drainedOption(completedTasks);
      }
    }
  };
  function buildTitle(dateProfile, viewOptions, dateEnv) {
    let range2;
    if (/^(year|month)$/.test(dateProfile.currentRangeUnit)) {
      range2 = dateProfile.currentRange;
    } else {
      range2 = dateProfile.activeRange;
    }
    return dateEnv.formatRange(range2.start, range2.end, createFormatter(viewOptions.titleFormat || buildTitleFormat(dateProfile)), {
      isEndExclusive: dateProfile.isRangeAllDay,
      defaultSeparator: viewOptions.titleRangeSeparator
    });
  }
  function buildTitleFormat(dateProfile) {
    let { currentRangeUnit } = dateProfile;
    if (currentRangeUnit === "year") {
      return { year: "numeric" };
    }
    if (currentRangeUnit === "month") {
      return { year: "numeric", month: "long" };
    }
    let days = diffWholeDays(dateProfile.currentRange.start, dateProfile.currentRange.end);
    if (days !== null && days > 1) {
      return { year: "numeric", month: "short", day: "numeric" };
    }
    return { year: "numeric", month: "long", day: "numeric" };
  }
  var CalendarNowManager = class {
    constructor() {
      this.resetListeners = /* @__PURE__ */ new Set();
    }
    handleInput(dateEnv, nowInput) {
      const oldDateEnv = this.dateEnv;
      if (dateEnv !== oldDateEnv) {
        if (typeof nowInput === "function") {
          this.nowFn = nowInput;
        } else if (!oldDateEnv) {
          this.nowAnchorDate = dateEnv.toDate(nowInput ? dateEnv.createMarker(nowInput) : dateEnv.createNowMarker());
          this.nowAnchorQueried = Date.now();
        }
        this.dateEnv = dateEnv;
        if (oldDateEnv) {
          for (const resetListener of this.resetListeners.values()) {
            resetListener();
          }
        }
      }
    }
    getDateMarker() {
      return this.nowAnchorDate ? this.dateEnv.timestampToMarker(this.nowAnchorDate.valueOf() + (Date.now() - this.nowAnchorQueried)) : this.dateEnv.createMarker(this.nowFn());
    }
    addResetListener(handler) {
      this.resetListeners.add(handler);
    }
    removeResetListener(handler) {
      this.resetListeners.delete(handler);
    }
  };
  var CalendarDataManager = class {
    constructor(props) {
      this.computeCurrentViewData = memoize(this._computeCurrentViewData);
      this.organizeRawLocales = memoize(organizeRawLocales);
      this.buildLocale = memoize(buildLocale);
      this.buildPluginHooks = buildBuildPluginHooks();
      this.buildDateEnv = memoize(buildDateEnv$1);
      this.buildTheme = memoize(buildTheme);
      this.parseToolbars = memoize(parseToolbars);
      this.buildViewSpecs = memoize(buildViewSpecs);
      this.buildDateProfileGenerator = memoizeObjArg(buildDateProfileGenerator);
      this.buildViewApi = memoize(buildViewApi);
      this.buildViewUiProps = memoizeObjArg(buildViewUiProps);
      this.buildEventUiBySource = memoize(buildEventUiBySource, isPropsEqual);
      this.buildEventUiBases = memoize(buildEventUiBases);
      this.parseContextBusinessHours = memoizeObjArg(parseContextBusinessHours);
      this.buildTitle = memoize(buildTitle);
      this.nowManager = new CalendarNowManager();
      this.emitter = new Emitter();
      this.actionRunner = new TaskRunner(this._handleAction.bind(this), this.updateData.bind(this));
      this.currentCalendarOptionsInput = {};
      this.currentCalendarOptionsRefined = {};
      this.currentViewOptionsInput = {};
      this.currentViewOptionsRefined = {};
      this.currentCalendarOptionsRefiners = {};
      this.optionsForRefining = [];
      this.optionsForHandling = [];
      this.getCurrentData = () => this.data;
      this.dispatch = (action) => {
        this.actionRunner.request(action);
      };
      this.props = props;
      this.actionRunner.pause();
      this.nowManager = new CalendarNowManager();
      let dynamicOptionOverrides = {};
      let optionsData = this.computeOptionsData(props.optionOverrides, dynamicOptionOverrides, props.calendarApi);
      let currentViewType = optionsData.calendarOptions.initialView || optionsData.pluginHooks.initialView;
      let currentViewData = this.computeCurrentViewData(currentViewType, optionsData, props.optionOverrides, dynamicOptionOverrides);
      props.calendarApi.currentDataManager = this;
      this.emitter.setThisContext(props.calendarApi);
      this.emitter.setOptions(currentViewData.options);
      let calendarContext = {
        nowManager: this.nowManager,
        dateEnv: optionsData.dateEnv,
        options: optionsData.calendarOptions,
        pluginHooks: optionsData.pluginHooks,
        calendarApi: props.calendarApi,
        dispatch: this.dispatch,
        emitter: this.emitter,
        getCurrentData: this.getCurrentData
      };
      let currentDate = getInitialDate(optionsData.calendarOptions, optionsData.dateEnv, this.nowManager);
      let dateProfile = currentViewData.dateProfileGenerator.build(currentDate);
      if (!rangeContainsMarker(dateProfile.activeRange, currentDate)) {
        currentDate = dateProfile.currentRange.start;
      }
      for (let callback of optionsData.pluginHooks.contextInit) {
        callback(calendarContext);
      }
      let eventSources = initEventSources(optionsData.calendarOptions, dateProfile, calendarContext);
      let initialState = {
        dynamicOptionOverrides,
        currentViewType,
        currentDate,
        dateProfile,
        businessHours: this.parseContextBusinessHours(calendarContext),
        eventSources,
        eventUiBases: {},
        eventStore: createEmptyEventStore(),
        renderableEventStore: createEmptyEventStore(),
        dateSelection: null,
        eventSelection: "",
        eventDrag: null,
        eventResize: null,
        selectionConfig: this.buildViewUiProps(calendarContext).selectionConfig
      };
      let contextAndState = Object.assign(Object.assign({}, calendarContext), initialState);
      for (let reducer of optionsData.pluginHooks.reducers) {
        Object.assign(initialState, reducer(null, null, contextAndState));
      }
      if (computeIsLoading(initialState, calendarContext)) {
        this.emitter.trigger("loading", true);
      }
      this.state = initialState;
      this.updateData();
      this.actionRunner.resume();
    }
    resetOptions(optionOverrides, changedOptionNames) {
      let { props } = this;
      if (changedOptionNames === void 0) {
        props.optionOverrides = optionOverrides;
      } else {
        props.optionOverrides = Object.assign(Object.assign({}, props.optionOverrides || {}), optionOverrides);
        this.optionsForRefining.push(...changedOptionNames);
      }
      if (changedOptionNames === void 0 || changedOptionNames.length) {
        this.actionRunner.request({
          type: "NOTHING"
        });
      }
    }
    _handleAction(action) {
      let { props, state, emitter } = this;
      let dynamicOptionOverrides = reduceDynamicOptionOverrides(state.dynamicOptionOverrides, action);
      let optionsData = this.computeOptionsData(props.optionOverrides, dynamicOptionOverrides, props.calendarApi);
      let currentViewType = reduceViewType(state.currentViewType, action);
      let currentViewData = this.computeCurrentViewData(currentViewType, optionsData, props.optionOverrides, dynamicOptionOverrides);
      props.calendarApi.currentDataManager = this;
      emitter.setThisContext(props.calendarApi);
      emitter.setOptions(currentViewData.options);
      let calendarContext = {
        nowManager: this.nowManager,
        dateEnv: optionsData.dateEnv,
        options: optionsData.calendarOptions,
        pluginHooks: optionsData.pluginHooks,
        calendarApi: props.calendarApi,
        dispatch: this.dispatch,
        emitter,
        getCurrentData: this.getCurrentData
      };
      let { currentDate, dateProfile } = state;
      if (this.data && this.data.dateProfileGenerator !== currentViewData.dateProfileGenerator) {
        dateProfile = currentViewData.dateProfileGenerator.build(currentDate);
      }
      currentDate = reduceCurrentDate(currentDate, action);
      dateProfile = reduceDateProfile(dateProfile, action, currentDate, currentViewData.dateProfileGenerator);
      if (action.type === "PREV" || // TODO: move this logic into DateProfileGenerator
      action.type === "NEXT" || // "
      !rangeContainsMarker(dateProfile.currentRange, currentDate)) {
        currentDate = dateProfile.currentRange.start;
      }
      let eventSources = reduceEventSources(state.eventSources, action, dateProfile, calendarContext);
      let eventStore = reduceEventStore(state.eventStore, action, eventSources, dateProfile, calendarContext);
      let isEventsLoading = computeEventSourcesLoading(eventSources);
      let renderableEventStore = isEventsLoading && !currentViewData.options.progressiveEventRendering ? state.renderableEventStore || eventStore : (
        // try from previous state
        eventStore
      );
      let { eventUiSingleBase, selectionConfig } = this.buildViewUiProps(calendarContext);
      let eventUiBySource = this.buildEventUiBySource(eventSources);
      let eventUiBases = this.buildEventUiBases(renderableEventStore.defs, eventUiSingleBase, eventUiBySource);
      let newState = {
        dynamicOptionOverrides,
        currentViewType,
        currentDate,
        dateProfile,
        eventSources,
        eventStore,
        renderableEventStore,
        selectionConfig,
        eventUiBases,
        businessHours: this.parseContextBusinessHours(calendarContext),
        dateSelection: reduceDateSelection(state.dateSelection, action),
        eventSelection: reduceSelectedEvent(state.eventSelection, action),
        eventDrag: reduceEventDrag(state.eventDrag, action),
        eventResize: reduceEventResize(state.eventResize, action)
      };
      let contextAndState = Object.assign(Object.assign({}, calendarContext), newState);
      for (let reducer of optionsData.pluginHooks.reducers) {
        Object.assign(newState, reducer(state, action, contextAndState));
      }
      let wasLoading = computeIsLoading(state, calendarContext);
      let isLoading = computeIsLoading(newState, calendarContext);
      if (!wasLoading && isLoading) {
        emitter.trigger("loading", true);
      } else if (wasLoading && !isLoading) {
        emitter.trigger("loading", false);
      }
      this.state = newState;
      if (props.onAction) {
        props.onAction(action);
      }
    }
    updateData() {
      let { props, state } = this;
      let oldData = this.data;
      let optionsData = this.computeOptionsData(props.optionOverrides, state.dynamicOptionOverrides, props.calendarApi);
      let currentViewData = this.computeCurrentViewData(state.currentViewType, optionsData, props.optionOverrides, state.dynamicOptionOverrides);
      let data = this.data = Object.assign(Object.assign(Object.assign({ nowManager: this.nowManager, viewTitle: this.buildTitle(state.dateProfile, currentViewData.options, optionsData.dateEnv), calendarApi: props.calendarApi, dispatch: this.dispatch, emitter: this.emitter, getCurrentData: this.getCurrentData }, optionsData), currentViewData), state);
      let changeHandlers = optionsData.pluginHooks.optionChangeHandlers;
      let oldCalendarOptions = oldData && oldData.calendarOptions;
      let newCalendarOptions = optionsData.calendarOptions;
      if (oldCalendarOptions && oldCalendarOptions !== newCalendarOptions) {
        if (oldCalendarOptions.timeZone !== newCalendarOptions.timeZone) {
          state.eventSources = data.eventSources = reduceEventSourcesNewTimeZone(data.eventSources, state.dateProfile, data);
          state.eventStore = data.eventStore = rezoneEventStoreDates(data.eventStore, oldData.dateEnv, data.dateEnv);
          state.renderableEventStore = data.renderableEventStore = rezoneEventStoreDates(data.renderableEventStore, oldData.dateEnv, data.dateEnv);
        }
        for (let optionName in changeHandlers) {
          if (this.optionsForHandling.indexOf(optionName) !== -1 || oldCalendarOptions[optionName] !== newCalendarOptions[optionName]) {
            changeHandlers[optionName](newCalendarOptions[optionName], data);
          }
        }
      }
      this.optionsForHandling = [];
      if (props.onData) {
        props.onData(data);
      }
    }
    computeOptionsData(optionOverrides, dynamicOptionOverrides, calendarApi) {
      if (!this.optionsForRefining.length && optionOverrides === this.stableOptionOverrides && dynamicOptionOverrides === this.stableDynamicOptionOverrides) {
        return this.stableCalendarOptionsData;
      }
      let { refinedOptions, pluginHooks, localeDefaults, availableLocaleData, extra } = this.processRawCalendarOptions(optionOverrides, dynamicOptionOverrides);
      warnUnknownOptions(extra);
      let dateEnv = this.buildDateEnv(refinedOptions.timeZone, refinedOptions.locale, refinedOptions.weekNumberCalculation, refinedOptions.firstDay, refinedOptions.weekText, pluginHooks, availableLocaleData, refinedOptions.defaultRangeSeparator);
      let viewSpecs = this.buildViewSpecs(pluginHooks.views, this.stableOptionOverrides, this.stableDynamicOptionOverrides, localeDefaults);
      let theme = this.buildTheme(refinedOptions, pluginHooks);
      let toolbarConfig = this.parseToolbars(refinedOptions, this.stableOptionOverrides, theme, viewSpecs, calendarApi);
      return this.stableCalendarOptionsData = {
        calendarOptions: refinedOptions,
        pluginHooks,
        dateEnv,
        viewSpecs,
        theme,
        toolbarConfig,
        localeDefaults,
        availableRawLocales: availableLocaleData.map
      };
    }
    // always called from behind a memoizer
    processRawCalendarOptions(optionOverrides, dynamicOptionOverrides) {
      let { locales, locale } = mergeRawOptions([
        BASE_OPTION_DEFAULTS,
        optionOverrides,
        dynamicOptionOverrides
      ]);
      let availableLocaleData = this.organizeRawLocales(locales);
      let availableRawLocales = availableLocaleData.map;
      let localeDefaults = this.buildLocale(locale || availableLocaleData.defaultCode, availableRawLocales).options;
      let pluginHooks = this.buildPluginHooks(optionOverrides.plugins || [], globalPlugins);
      let refiners = this.currentCalendarOptionsRefiners = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, BASE_OPTION_REFINERS), CALENDAR_LISTENER_REFINERS), CALENDAR_OPTION_REFINERS), pluginHooks.listenerRefiners), pluginHooks.optionRefiners);
      let extra = {};
      let raw = mergeRawOptions([
        BASE_OPTION_DEFAULTS,
        localeDefaults,
        optionOverrides,
        dynamicOptionOverrides
      ]);
      let refined = {};
      let currentRaw = this.currentCalendarOptionsInput;
      let currentRefined = this.currentCalendarOptionsRefined;
      let anyChanges = false;
      for (let optionName in raw) {
        if (this.optionsForRefining.indexOf(optionName) === -1 && (raw[optionName] === currentRaw[optionName] || COMPLEX_OPTION_COMPARATORS[optionName] && optionName in currentRaw && COMPLEX_OPTION_COMPARATORS[optionName](currentRaw[optionName], raw[optionName]))) {
          refined[optionName] = currentRefined[optionName];
        } else if (refiners[optionName]) {
          refined[optionName] = refiners[optionName](raw[optionName]);
          anyChanges = true;
        } else {
          extra[optionName] = currentRaw[optionName];
        }
      }
      if (anyChanges) {
        this.currentCalendarOptionsInput = raw;
        this.currentCalendarOptionsRefined = refined;
        this.stableOptionOverrides = optionOverrides;
        this.stableDynamicOptionOverrides = dynamicOptionOverrides;
      }
      this.optionsForHandling.push(...this.optionsForRefining);
      this.optionsForRefining = [];
      return {
        rawOptions: this.currentCalendarOptionsInput,
        refinedOptions: this.currentCalendarOptionsRefined,
        pluginHooks,
        availableLocaleData,
        localeDefaults,
        extra
      };
    }
    _computeCurrentViewData(viewType, optionsData, optionOverrides, dynamicOptionOverrides) {
      let viewSpec = optionsData.viewSpecs[viewType];
      if (!viewSpec) {
        throw new Error(`viewType "${viewType}" is not available. Please make sure you've loaded all neccessary plugins`);
      }
      let { refinedOptions, extra } = this.processRawViewOptions(viewSpec, optionsData.pluginHooks, optionsData.localeDefaults, optionOverrides, dynamicOptionOverrides);
      warnUnknownOptions(extra);
      this.nowManager.handleInput(optionsData.dateEnv, refinedOptions.now);
      let dateProfileGenerator = this.buildDateProfileGenerator({
        dateProfileGeneratorClass: viewSpec.optionDefaults.dateProfileGeneratorClass,
        nowManager: this.nowManager,
        duration: viewSpec.duration,
        durationUnit: viewSpec.durationUnit,
        usesMinMaxTime: viewSpec.optionDefaults.usesMinMaxTime,
        dateEnv: optionsData.dateEnv,
        calendarApi: this.props.calendarApi,
        slotMinTime: refinedOptions.slotMinTime,
        slotMaxTime: refinedOptions.slotMaxTime,
        showNonCurrentDates: refinedOptions.showNonCurrentDates,
        dayCount: refinedOptions.dayCount,
        dateAlignment: refinedOptions.dateAlignment,
        dateIncrement: refinedOptions.dateIncrement,
        hiddenDays: refinedOptions.hiddenDays,
        weekends: refinedOptions.weekends,
        validRangeInput: refinedOptions.validRange,
        visibleRangeInput: refinedOptions.visibleRange,
        fixedWeekCount: refinedOptions.fixedWeekCount
      });
      let viewApi = this.buildViewApi(viewType, this.getCurrentData, optionsData.dateEnv);
      return { viewSpec, options: refinedOptions, dateProfileGenerator, viewApi };
    }
    processRawViewOptions(viewSpec, pluginHooks, localeDefaults, optionOverrides, dynamicOptionOverrides) {
      let raw = mergeRawOptions([
        BASE_OPTION_DEFAULTS,
        viewSpec.optionDefaults,
        localeDefaults,
        optionOverrides,
        viewSpec.optionOverrides,
        dynamicOptionOverrides
      ]);
      let refiners = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, BASE_OPTION_REFINERS), CALENDAR_LISTENER_REFINERS), CALENDAR_OPTION_REFINERS), VIEW_OPTION_REFINERS), pluginHooks.listenerRefiners), pluginHooks.optionRefiners);
      let refined = {};
      let currentRaw = this.currentViewOptionsInput;
      let currentRefined = this.currentViewOptionsRefined;
      let anyChanges = false;
      let extra = {};
      for (let optionName in raw) {
        if (raw[optionName] === currentRaw[optionName] || COMPLEX_OPTION_COMPARATORS[optionName] && COMPLEX_OPTION_COMPARATORS[optionName](raw[optionName], currentRaw[optionName])) {
          refined[optionName] = currentRefined[optionName];
        } else {
          if (raw[optionName] === this.currentCalendarOptionsInput[optionName] || COMPLEX_OPTION_COMPARATORS[optionName] && COMPLEX_OPTION_COMPARATORS[optionName](raw[optionName], this.currentCalendarOptionsInput[optionName])) {
            if (optionName in this.currentCalendarOptionsRefined) {
              refined[optionName] = this.currentCalendarOptionsRefined[optionName];
            }
          } else if (refiners[optionName]) {
            refined[optionName] = refiners[optionName](raw[optionName]);
          } else {
            extra[optionName] = raw[optionName];
          }
          anyChanges = true;
        }
      }
      if (anyChanges) {
        this.currentViewOptionsInput = raw;
        this.currentViewOptionsRefined = refined;
      }
      return {
        rawOptions: this.currentViewOptionsInput,
        refinedOptions: this.currentViewOptionsRefined,
        extra
      };
    }
  };
  function buildDateEnv$1(timeZone, explicitLocale, weekNumberCalculation, firstDay, weekText, pluginHooks, availableLocaleData, defaultSeparator) {
    let locale = buildLocale(explicitLocale || availableLocaleData.defaultCode, availableLocaleData.map);
    return new DateEnv({
      calendarSystem: "gregory",
      timeZone,
      namedTimeZoneImpl: pluginHooks.namedTimeZonedImpl,
      locale,
      weekNumberCalculation,
      firstDay,
      weekText,
      cmdFormatter: pluginHooks.cmdFormatter,
      defaultSeparator
    });
  }
  function buildTheme(options, pluginHooks) {
    let ThemeClass = pluginHooks.themeClasses[options.themeSystem] || StandardTheme;
    return new ThemeClass(options);
  }
  function buildDateProfileGenerator(props) {
    let DateProfileGeneratorClass = props.dateProfileGeneratorClass || DateProfileGenerator;
    return new DateProfileGeneratorClass(props);
  }
  function buildViewApi(type, getCurrentData, dateEnv) {
    return new ViewImpl(type, getCurrentData, dateEnv);
  }
  function buildEventUiBySource(eventSources) {
    return mapHash(eventSources, (eventSource) => eventSource.ui);
  }
  function buildEventUiBases(eventDefs, eventUiSingleBase, eventUiBySource) {
    let eventUiBases = { "": eventUiSingleBase };
    for (let defId in eventDefs) {
      let def = eventDefs[defId];
      if (def.sourceId && eventUiBySource[def.sourceId]) {
        eventUiBases[defId] = eventUiBySource[def.sourceId];
      }
    }
    return eventUiBases;
  }
  function buildViewUiProps(calendarContext) {
    let { options } = calendarContext;
    return {
      eventUiSingleBase: createEventUi({
        display: options.eventDisplay,
        editable: options.editable,
        startEditable: options.eventStartEditable,
        durationEditable: options.eventDurationEditable,
        constraint: options.eventConstraint,
        overlap: typeof options.eventOverlap === "boolean" ? options.eventOverlap : void 0,
        allow: options.eventAllow,
        backgroundColor: options.eventBackgroundColor,
        borderColor: options.eventBorderColor,
        textColor: options.eventTextColor,
        color: options.eventColor
        // classNames: options.eventClassNames // render hook will handle this
      }, calendarContext),
      selectionConfig: createEventUi({
        constraint: options.selectConstraint,
        overlap: typeof options.selectOverlap === "boolean" ? options.selectOverlap : void 0,
        allow: options.selectAllow
      }, calendarContext)
    };
  }
  function computeIsLoading(state, context) {
    for (let isLoadingFunc of context.pluginHooks.isLoadingFuncs) {
      if (isLoadingFunc(state)) {
        return true;
      }
    }
    return false;
  }
  function parseContextBusinessHours(calendarContext) {
    return parseBusinessHours(calendarContext.options.businessHours, calendarContext);
  }
  function warnUnknownOptions(options, viewName) {
    for (let optionName in options) {
      console.warn(`Unknown option '${optionName}'` + (viewName ? ` for view '${viewName}'` : ""));
    }
  }
  var ToolbarSection = class extends BaseComponent {
    render() {
      let children = this.props.widgetGroups.map((widgetGroup) => this.renderWidgetGroup(widgetGroup));
      return y("div", { className: "fc-toolbar-chunk" }, ...children);
    }
    renderWidgetGroup(widgetGroup) {
      let { props } = this;
      let { theme } = this.context;
      let children = [];
      let isOnlyButtons = true;
      for (let widget of widgetGroup) {
        let { buttonName, buttonClick, buttonText, buttonIcon, buttonHint } = widget;
        if (buttonName === "title") {
          isOnlyButtons = false;
          children.push(y("h2", { className: "fc-toolbar-title", id: props.titleId }, props.title));
        } else {
          let isPressed = buttonName === props.activeButton;
          let isDisabled = !props.isTodayEnabled && buttonName === "today" || !props.isPrevEnabled && buttonName === "prev" || !props.isNextEnabled && buttonName === "next";
          let buttonClasses = [`fc-${buttonName}-button`, theme.getClass("button")];
          if (isPressed) {
            buttonClasses.push(theme.getClass("buttonActive"));
          }
          children.push(y("button", { type: "button", title: typeof buttonHint === "function" ? buttonHint(props.navUnit) : buttonHint, disabled: isDisabled, "aria-pressed": isPressed, className: buttonClasses.join(" "), onClick: buttonClick }, buttonText || (buttonIcon ? y("span", { className: buttonIcon, role: "img" }) : "")));
        }
      }
      if (children.length > 1) {
        let groupClassName = isOnlyButtons && theme.getClass("buttonGroup") || "";
        return y("div", { className: groupClassName }, ...children);
      }
      return children[0];
    }
  };
  var Toolbar = class extends BaseComponent {
    render() {
      let { model, extraClassName } = this.props;
      let forceLtr = false;
      let startContent;
      let endContent;
      let sectionWidgets = model.sectionWidgets;
      let centerContent = sectionWidgets.center;
      if (sectionWidgets.left) {
        forceLtr = true;
        startContent = sectionWidgets.left;
      } else {
        startContent = sectionWidgets.start;
      }
      if (sectionWidgets.right) {
        forceLtr = true;
        endContent = sectionWidgets.right;
      } else {
        endContent = sectionWidgets.end;
      }
      let classNames = [
        extraClassName || "",
        "fc-toolbar",
        forceLtr ? "fc-toolbar-ltr" : ""
      ];
      return y(
        "div",
        { className: classNames.join(" ") },
        this.renderSection("start", startContent || []),
        this.renderSection("center", centerContent || []),
        this.renderSection("end", endContent || [])
      );
    }
    renderSection(key, widgetGroups) {
      let { props } = this;
      return y(ToolbarSection, { key, widgetGroups, title: props.title, navUnit: props.navUnit, activeButton: props.activeButton, isTodayEnabled: props.isTodayEnabled, isPrevEnabled: props.isPrevEnabled, isNextEnabled: props.isNextEnabled, titleId: props.titleId });
    }
  };
  var ViewHarness = class extends BaseComponent {
    constructor() {
      super(...arguments);
      this.state = {
        availableWidth: null
      };
      this.handleEl = (el) => {
        this.el = el;
        setRef(this.props.elRef, el);
        this.updateAvailableWidth();
      };
      this.handleResize = () => {
        this.updateAvailableWidth();
      };
    }
    render() {
      let { props, state } = this;
      let { aspectRatio } = props;
      let classNames = [
        "fc-view-harness",
        aspectRatio || props.liquid || props.height ? "fc-view-harness-active" : "fc-view-harness-passive"
        // let the view do the height
      ];
      let height = "";
      let paddingBottom = "";
      if (aspectRatio) {
        if (state.availableWidth !== null) {
          height = state.availableWidth / aspectRatio;
        } else {
          paddingBottom = `${1 / aspectRatio * 100}%`;
        }
      } else {
        height = props.height || "";
      }
      return y("div", { "aria-labelledby": props.labeledById, ref: this.handleEl, className: classNames.join(" "), style: { height, paddingBottom } }, props.children);
    }
    componentDidMount() {
      this.context.addResizeHandler(this.handleResize);
    }
    componentWillUnmount() {
      this.context.removeResizeHandler(this.handleResize);
    }
    updateAvailableWidth() {
      if (this.el && // needed. but why?
      this.props.aspectRatio) {
        this.setState({ availableWidth: this.el.offsetWidth });
      }
    }
  };
  var EventClicking = class extends Interaction {
    constructor(settings) {
      super(settings);
      this.handleSegClick = (ev, segEl) => {
        let { component } = this;
        let { context } = component;
        let seg = getElSeg(segEl);
        if (seg && // might be the <div> surrounding the more link
        component.isValidSegDownEl(ev.target)) {
          let hasUrlContainer = elementClosest(ev.target, ".fc-event-forced-url");
          let url = hasUrlContainer ? hasUrlContainer.querySelector("a[href]").href : "";
          context.emitter.trigger("eventClick", {
            el: segEl,
            event: new EventImpl(component.context, seg.eventRange.def, seg.eventRange.instance),
            jsEvent: ev,
            view: context.viewApi
          });
          if (url && !ev.defaultPrevented) {
            window.location.href = url;
          }
        }
      };
      this.destroy = listenBySelector(
        settings.el,
        "click",
        ".fc-event",
        // on both fg and bg events
        this.handleSegClick
      );
    }
  };
  var EventHovering = class extends Interaction {
    constructor(settings) {
      super(settings);
      this.handleEventElRemove = (el) => {
        if (el === this.currentSegEl) {
          this.handleSegLeave(null, this.currentSegEl);
        }
      };
      this.handleSegEnter = (ev, segEl) => {
        if (getElSeg(segEl)) {
          this.currentSegEl = segEl;
          this.triggerEvent("eventMouseEnter", ev, segEl);
        }
      };
      this.handleSegLeave = (ev, segEl) => {
        if (this.currentSegEl) {
          this.currentSegEl = null;
          this.triggerEvent("eventMouseLeave", ev, segEl);
        }
      };
      this.removeHoverListeners = listenToHoverBySelector(
        settings.el,
        ".fc-event",
        // on both fg and bg events
        this.handleSegEnter,
        this.handleSegLeave
      );
    }
    destroy() {
      this.removeHoverListeners();
    }
    triggerEvent(publicEvName, ev, segEl) {
      let { component } = this;
      let { context } = component;
      let seg = getElSeg(segEl);
      if (!ev || component.isValidSegDownEl(ev.target)) {
        context.emitter.trigger(publicEvName, {
          el: segEl,
          event: new EventImpl(context, seg.eventRange.def, seg.eventRange.instance),
          jsEvent: ev,
          view: context.viewApi
        });
      }
    }
  };
  var CalendarContent = class extends PureComponent {
    constructor() {
      super(...arguments);
      this.buildViewContext = memoize(buildViewContext);
      this.buildViewPropTransformers = memoize(buildViewPropTransformers);
      this.buildToolbarProps = memoize(buildToolbarProps);
      this.headerRef = d();
      this.footerRef = d();
      this.interactionsStore = {};
      this.state = {
        viewLabelId: getUniqueDomId()
      };
      this.registerInteractiveComponent = (component, settingsInput) => {
        let settings = parseInteractionSettings(component, settingsInput);
        let DEFAULT_INTERACTIONS = [
          EventClicking,
          EventHovering
        ];
        let interactionClasses = DEFAULT_INTERACTIONS.concat(this.props.pluginHooks.componentInteractions);
        let interactions = interactionClasses.map((TheInteractionClass) => new TheInteractionClass(settings));
        this.interactionsStore[component.uid] = interactions;
        interactionSettingsStore[component.uid] = settings;
      };
      this.unregisterInteractiveComponent = (component) => {
        let listeners = this.interactionsStore[component.uid];
        if (listeners) {
          for (let listener of listeners) {
            listener.destroy();
          }
          delete this.interactionsStore[component.uid];
        }
        delete interactionSettingsStore[component.uid];
      };
      this.resizeRunner = new DelayedRunner(() => {
        this.props.emitter.trigger("_resize", true);
        this.props.emitter.trigger("windowResize", { view: this.props.viewApi });
      });
      this.handleWindowResize = (ev) => {
        let { options } = this.props;
        if (options.handleWindowResize && ev.target === window) {
          this.resizeRunner.request(options.windowResizeDelay);
        }
      };
    }
    /*
    renders INSIDE of an outer div
    */
    render() {
      let { props } = this;
      let { toolbarConfig, options } = props;
      let viewVGrow = false;
      let viewHeight = "";
      let viewAspectRatio;
      if (props.isHeightAuto || props.forPrint) {
        viewHeight = "";
      } else if (options.height != null) {
        viewVGrow = true;
      } else if (options.contentHeight != null) {
        viewHeight = options.contentHeight;
      } else {
        viewAspectRatio = Math.max(options.aspectRatio, 0.5);
      }
      let viewContext = this.buildViewContext(props.viewSpec, props.viewApi, props.options, props.dateProfileGenerator, props.dateEnv, props.nowManager, props.theme, props.pluginHooks, props.dispatch, props.getCurrentData, props.emitter, props.calendarApi, this.registerInteractiveComponent, this.unregisterInteractiveComponent);
      let viewLabelId = toolbarConfig.header && toolbarConfig.header.hasTitle ? this.state.viewLabelId : void 0;
      return y(
        ViewContextType.Provider,
        { value: viewContext },
        y(NowTimer, { unit: "day" }, (nowDate) => {
          let toolbarProps = this.buildToolbarProps(props.viewSpec, props.dateProfile, props.dateProfileGenerator, props.currentDate, nowDate, props.viewTitle);
          return y(
            _,
            null,
            toolbarConfig.header && y(Toolbar, Object.assign({ ref: this.headerRef, extraClassName: "fc-header-toolbar", model: toolbarConfig.header, titleId: viewLabelId }, toolbarProps)),
            y(
              ViewHarness,
              { liquid: viewVGrow, height: viewHeight, aspectRatio: viewAspectRatio, labeledById: viewLabelId },
              this.renderView(props),
              this.buildAppendContent()
            ),
            toolbarConfig.footer && y(Toolbar, Object.assign({ ref: this.footerRef, extraClassName: "fc-footer-toolbar", model: toolbarConfig.footer, titleId: "" }, toolbarProps))
          );
        })
      );
    }
    componentDidMount() {
      let { props } = this;
      this.calendarInteractions = props.pluginHooks.calendarInteractions.map((CalendarInteractionClass) => new CalendarInteractionClass(props));
      window.addEventListener("resize", this.handleWindowResize);
      let { propSetHandlers } = props.pluginHooks;
      for (let propName in propSetHandlers) {
        propSetHandlers[propName](props[propName], props);
      }
    }
    componentDidUpdate(prevProps) {
      let { props } = this;
      let { propSetHandlers } = props.pluginHooks;
      for (let propName in propSetHandlers) {
        if (props[propName] !== prevProps[propName]) {
          propSetHandlers[propName](props[propName], props);
        }
      }
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.handleWindowResize);
      this.resizeRunner.clear();
      for (let interaction of this.calendarInteractions) {
        interaction.destroy();
      }
      this.props.emitter.trigger("_unmount");
    }
    buildAppendContent() {
      let { props } = this;
      let children = props.pluginHooks.viewContainerAppends.map((buildAppendContent) => buildAppendContent(props));
      return y(_, {}, ...children);
    }
    renderView(props) {
      let { pluginHooks } = props;
      let { viewSpec } = props;
      let viewProps = {
        dateProfile: props.dateProfile,
        businessHours: props.businessHours,
        eventStore: props.renderableEventStore,
        eventUiBases: props.eventUiBases,
        dateSelection: props.dateSelection,
        eventSelection: props.eventSelection,
        eventDrag: props.eventDrag,
        eventResize: props.eventResize,
        isHeightAuto: props.isHeightAuto,
        forPrint: props.forPrint
      };
      let transformers = this.buildViewPropTransformers(pluginHooks.viewPropsTransformers);
      for (let transformer of transformers) {
        Object.assign(viewProps, transformer.transform(viewProps, props));
      }
      let ViewComponent = viewSpec.component;
      return y(ViewComponent, Object.assign({}, viewProps));
    }
  };
  function buildToolbarProps(viewSpec, dateProfile, dateProfileGenerator, currentDate, now, title) {
    let todayInfo = dateProfileGenerator.build(now, void 0, false);
    let prevInfo = dateProfileGenerator.buildPrev(dateProfile, currentDate, false);
    let nextInfo = dateProfileGenerator.buildNext(dateProfile, currentDate, false);
    return {
      title,
      activeButton: viewSpec.type,
      navUnit: viewSpec.singleUnit,
      isTodayEnabled: todayInfo.isValid && !rangeContainsMarker(dateProfile.currentRange, now),
      isPrevEnabled: prevInfo.isValid,
      isNextEnabled: nextInfo.isValid
    };
  }
  function buildViewPropTransformers(theClasses) {
    return theClasses.map((TheClass) => new TheClass());
  }
  var Calendar = class extends CalendarImpl {
    constructor(el, optionOverrides = {}) {
      super();
      this.isRendering = false;
      this.isRendered = false;
      this.currentClassNames = [];
      this.customContentRenderId = 0;
      this.handleAction = (action) => {
        switch (action.type) {
          case "SET_EVENT_DRAG":
          case "SET_EVENT_RESIZE":
            this.renderRunner.tryDrain();
        }
      };
      this.handleData = (data) => {
        this.currentData = data;
        this.renderRunner.request(data.calendarOptions.rerenderDelay);
      };
      this.handleRenderRequest = () => {
        if (this.isRendering) {
          this.isRendered = true;
          let { currentData } = this;
          flushSync(() => {
            D(y(CalendarRoot, { options: currentData.calendarOptions, theme: currentData.theme, emitter: currentData.emitter }, (classNames, height, isHeightAuto, forPrint) => {
              this.setClassNames(classNames);
              this.setHeight(height);
              return y(
                RenderId.Provider,
                { value: this.customContentRenderId },
                y(CalendarContent, Object.assign({ isHeightAuto, forPrint }, currentData))
              );
            }), this.el);
          });
        } else if (this.isRendered) {
          this.isRendered = false;
          D(null, this.el);
          this.setClassNames([]);
          this.setHeight("");
        }
      };
      ensureElHasStyles(el);
      this.el = el;
      this.renderRunner = new DelayedRunner(this.handleRenderRequest);
      new CalendarDataManager({
        optionOverrides,
        calendarApi: this,
        onAction: this.handleAction,
        onData: this.handleData
      });
    }
    render() {
      let wasRendering = this.isRendering;
      if (!wasRendering) {
        this.isRendering = true;
      } else {
        this.customContentRenderId += 1;
      }
      this.renderRunner.request();
      if (wasRendering) {
        this.updateSize();
      }
    }
    destroy() {
      if (this.isRendering) {
        this.isRendering = false;
        this.renderRunner.request();
      }
    }
    updateSize() {
      flushSync(() => {
        super.updateSize();
      });
    }
    batchRendering(func) {
      this.renderRunner.pause("batchRendering");
      func();
      this.renderRunner.resume("batchRendering");
    }
    pauseRendering() {
      this.renderRunner.pause("pauseRendering");
    }
    resumeRendering() {
      this.renderRunner.resume("pauseRendering", true);
    }
    resetOptions(optionOverrides, changedOptionNames) {
      this.currentDataManager.resetOptions(optionOverrides, changedOptionNames);
    }
    setClassNames(classNames) {
      if (!isArraysEqual(classNames, this.currentClassNames)) {
        let { classList } = this.el;
        for (let className of this.currentClassNames) {
          classList.remove(className);
        }
        for (let className of classNames) {
          classList.add(className);
        }
        this.currentClassNames = classNames;
      }
    }
    setHeight(height) {
      applyStyleProp(this.el, "height", height);
    }
  };

  // node_modules/@fullcalendar/daygrid/internal.js
  var TableView = class extends DateComponent {
    constructor() {
      super(...arguments);
      this.headerElRef = d();
    }
    renderSimpleLayout(headerRowContent, bodyContent) {
      let { props, context } = this;
      let sections = [];
      let stickyHeaderDates = getStickyHeaderDates(context.options);
      if (headerRowContent) {
        sections.push({
          type: "header",
          key: "header",
          isSticky: stickyHeaderDates,
          chunk: {
            elRef: this.headerElRef,
            tableClassName: "fc-col-header",
            rowContent: headerRowContent
          }
        });
      }
      sections.push({
        type: "body",
        key: "body",
        liquid: true,
        chunk: { content: bodyContent }
      });
      return y(
        ViewContainer,
        { elClasses: ["fc-daygrid"], viewSpec: context.viewSpec },
        y(SimpleScrollGrid, { liquid: !props.isHeightAuto && !props.forPrint, collapsibleWidth: props.forPrint, cols: [], sections })
      );
    }
    renderHScrollLayout(headerRowContent, bodyContent, colCnt, dayMinWidth) {
      let ScrollGrid = this.context.pluginHooks.scrollGridImpl;
      if (!ScrollGrid) {
        throw new Error("No ScrollGrid implementation");
      }
      let { props, context } = this;
      let stickyHeaderDates = !props.forPrint && getStickyHeaderDates(context.options);
      let stickyFooterScrollbar = !props.forPrint && getStickyFooterScrollbar(context.options);
      let sections = [];
      if (headerRowContent) {
        sections.push({
          type: "header",
          key: "header",
          isSticky: stickyHeaderDates,
          chunks: [{
            key: "main",
            elRef: this.headerElRef,
            tableClassName: "fc-col-header",
            rowContent: headerRowContent
          }]
        });
      }
      sections.push({
        type: "body",
        key: "body",
        liquid: true,
        chunks: [{
          key: "main",
          content: bodyContent
        }]
      });
      if (stickyFooterScrollbar) {
        sections.push({
          type: "footer",
          key: "footer",
          isSticky: true,
          chunks: [{
            key: "main",
            content: renderScrollShim
          }]
        });
      }
      return y(
        ViewContainer,
        { elClasses: ["fc-daygrid"], viewSpec: context.viewSpec },
        y(ScrollGrid, { liquid: !props.isHeightAuto && !props.forPrint, forPrint: props.forPrint, collapsibleWidth: props.forPrint, colGroups: [{ cols: [{ span: colCnt, minWidth: dayMinWidth }] }], sections })
      );
    }
  };
  function splitSegsByRow(segs, rowCnt) {
    let byRow = [];
    for (let i3 = 0; i3 < rowCnt; i3 += 1) {
      byRow[i3] = [];
    }
    for (let seg of segs) {
      byRow[seg.row].push(seg);
    }
    return byRow;
  }
  function splitSegsByFirstCol(segs, colCnt) {
    let byCol = [];
    for (let i3 = 0; i3 < colCnt; i3 += 1) {
      byCol[i3] = [];
    }
    for (let seg of segs) {
      byCol[seg.firstCol].push(seg);
    }
    return byCol;
  }
  function splitInteractionByRow(ui, rowCnt) {
    let byRow = [];
    if (!ui) {
      for (let i3 = 0; i3 < rowCnt; i3 += 1) {
        byRow[i3] = null;
      }
    } else {
      for (let i3 = 0; i3 < rowCnt; i3 += 1) {
        byRow[i3] = {
          affectedInstances: ui.affectedInstances,
          isEvent: ui.isEvent,
          segs: []
        };
      }
      for (let seg of ui.segs) {
        byRow[seg.row].segs.push(seg);
      }
    }
    return byRow;
  }
  var DEFAULT_TABLE_EVENT_TIME_FORMAT = createFormatter({
    hour: "numeric",
    minute: "2-digit",
    omitZeroMinute: true,
    meridiem: "narrow"
  });
  function hasListItemDisplay(seg) {
    let { display } = seg.eventRange.ui;
    return display === "list-item" || display === "auto" && !seg.eventRange.def.allDay && seg.firstCol === seg.lastCol && // can't be multi-day
    seg.isStart && // "
    seg.isEnd;
  }
  var TableBlockEvent = class extends BaseComponent {
    render() {
      let { props } = this;
      return y(StandardEvent, Object.assign({}, props, { elClasses: ["fc-daygrid-event", "fc-daygrid-block-event", "fc-h-event"], defaultTimeFormat: DEFAULT_TABLE_EVENT_TIME_FORMAT, defaultDisplayEventEnd: props.defaultDisplayEventEnd, disableResizing: !props.seg.eventRange.def.allDay }));
    }
  };
  var TableListItemEvent = class extends BaseComponent {
    render() {
      let { props, context } = this;
      let { options } = context;
      let { seg } = props;
      let timeFormat = options.eventTimeFormat || DEFAULT_TABLE_EVENT_TIME_FORMAT;
      let timeText = buildSegTimeText(seg, timeFormat, context, true, props.defaultDisplayEventEnd);
      return y(EventContainer, Object.assign({}, props, { elTag: "a", elClasses: ["fc-daygrid-event", "fc-daygrid-dot-event"], elAttrs: getSegAnchorAttrs(props.seg, context), defaultGenerator: renderInnerContent2, timeText, isResizing: false, isDateSelecting: false }));
    }
  };
  function renderInnerContent2(renderProps) {
    return y(
      _,
      null,
      y("div", { className: "fc-daygrid-event-dot", style: { borderColor: renderProps.borderColor || renderProps.backgroundColor } }),
      renderProps.timeText && y("div", { className: "fc-event-time" }, renderProps.timeText),
      y("div", { className: "fc-event-title" }, renderProps.event.title || y(_, null, "\xA0"))
    );
  }
  var TableCellMoreLink = class extends BaseComponent {
    constructor() {
      super(...arguments);
      this.compileSegs = memoize(compileSegs);
    }
    render() {
      let { props } = this;
      let { allSegs, invisibleSegs } = this.compileSegs(props.singlePlacements);
      return y(MoreLinkContainer, { elClasses: ["fc-daygrid-more-link"], dateProfile: props.dateProfile, todayRange: props.todayRange, allDayDate: props.allDayDate, moreCnt: props.moreCnt, allSegs, hiddenSegs: invisibleSegs, alignmentElRef: props.alignmentElRef, alignGridTop: props.alignGridTop, extraDateSpan: props.extraDateSpan, popoverContent: () => {
        let isForcedInvisible = (props.eventDrag ? props.eventDrag.affectedInstances : null) || (props.eventResize ? props.eventResize.affectedInstances : null) || {};
        return y(_, null, allSegs.map((seg) => {
          let instanceId = seg.eventRange.instance.instanceId;
          return y("div", { className: "fc-daygrid-event-harness", key: instanceId, style: {
            visibility: isForcedInvisible[instanceId] ? "hidden" : ""
          } }, hasListItemDisplay(seg) ? y(TableListItemEvent, Object.assign({ seg, isDragging: false, isSelected: instanceId === props.eventSelection, defaultDisplayEventEnd: false }, getSegMeta(seg, props.todayRange))) : y(TableBlockEvent, Object.assign({ seg, isDragging: false, isResizing: false, isDateSelecting: false, isSelected: instanceId === props.eventSelection, defaultDisplayEventEnd: false }, getSegMeta(seg, props.todayRange))));
        }));
      } });
    }
  };
  function compileSegs(singlePlacements) {
    let allSegs = [];
    let invisibleSegs = [];
    for (let placement of singlePlacements) {
      allSegs.push(placement.seg);
      if (!placement.isVisible) {
        invisibleSegs.push(placement.seg);
      }
    }
    return { allSegs, invisibleSegs };
  }
  var DEFAULT_WEEK_NUM_FORMAT = createFormatter({ week: "narrow" });
  var TableCell = class extends DateComponent {
    constructor() {
      super(...arguments);
      this.rootElRef = d();
      this.state = {
        dayNumberId: getUniqueDomId()
      };
      this.handleRootEl = (el) => {
        setRef(this.rootElRef, el);
        setRef(this.props.elRef, el);
      };
    }
    render() {
      let { context, props, state, rootElRef } = this;
      let { options, dateEnv } = context;
      let { date, dateProfile } = props;
      const isMonthStart = props.showDayNumber && shouldDisplayMonthStart(date, dateProfile.currentRange, dateEnv);
      return y(DayCellContainer, { elTag: "td", elRef: this.handleRootEl, elClasses: [
        "fc-daygrid-day",
        ...props.extraClassNames || []
      ], elAttrs: Object.assign(Object.assign(Object.assign({}, props.extraDataAttrs), props.showDayNumber ? { "aria-labelledby": state.dayNumberId } : {}), { role: "gridcell" }), defaultGenerator: renderTopInner, date, dateProfile, todayRange: props.todayRange, showDayNumber: props.showDayNumber, isMonthStart, extraRenderProps: props.extraRenderProps }, (InnerContent, renderProps) => y(
        "div",
        { ref: props.innerElRef, className: "fc-daygrid-day-frame fc-scrollgrid-sync-inner", style: { minHeight: props.minHeight } },
        props.showWeekNumber && y(WeekNumberContainer, { elTag: "a", elClasses: ["fc-daygrid-week-number"], elAttrs: buildNavLinkAttrs(context, date, "week"), date, defaultFormat: DEFAULT_WEEK_NUM_FORMAT }),
        !renderProps.isDisabled && (props.showDayNumber || hasCustomDayCellContent(options) || props.forceDayTop) ? y(
          "div",
          { className: "fc-daygrid-day-top" },
          y(InnerContent, { elTag: "a", elClasses: [
            "fc-daygrid-day-number",
            isMonthStart && "fc-daygrid-month-start"
          ], elAttrs: Object.assign(Object.assign({}, buildNavLinkAttrs(context, date)), { id: state.dayNumberId }) })
        ) : props.showDayNumber ? (
          // for creating correct amount of space (see issue #7162)
          y(
            "div",
            { className: "fc-daygrid-day-top", style: { visibility: "hidden" } },
            y("a", { className: "fc-daygrid-day-number" }, "\xA0")
          )
        ) : void 0,
        y(
          "div",
          { className: "fc-daygrid-day-events", ref: props.fgContentElRef },
          props.fgContent,
          y(
            "div",
            { className: "fc-daygrid-day-bottom", style: { marginTop: props.moreMarginTop } },
            y(TableCellMoreLink, { allDayDate: date, singlePlacements: props.singlePlacements, moreCnt: props.moreCnt, alignmentElRef: rootElRef, alignGridTop: !props.showDayNumber, extraDateSpan: props.extraDateSpan, dateProfile: props.dateProfile, eventSelection: props.eventSelection, eventDrag: props.eventDrag, eventResize: props.eventResize, todayRange: props.todayRange })
          )
        ),
        y("div", { className: "fc-daygrid-day-bg" }, props.bgContent)
      ));
    }
  };
  function renderTopInner(props) {
    return props.dayNumberText || y(_, null, "\xA0");
  }
  function shouldDisplayMonthStart(date, currentRange, dateEnv) {
    const { start: currentStart, end: currentEnd } = currentRange;
    const currentEndIncl = addMs(currentEnd, -1);
    const currentFirstYear = dateEnv.getYear(currentStart);
    const currentFirstMonth = dateEnv.getMonth(currentStart);
    const currentLastYear = dateEnv.getYear(currentEndIncl);
    const currentLastMonth = dateEnv.getMonth(currentEndIncl);
    return !(currentFirstYear === currentLastYear && currentFirstMonth === currentLastMonth) && Boolean(
      // first date in current view?
      date.valueOf() === currentStart.valueOf() || // a month-start that's within the current range?
      dateEnv.getDay(date) === 1 && date.valueOf() < currentEnd.valueOf()
    );
  }
  function generateSegKey(seg) {
    return seg.eventRange.instance.instanceId + ":" + seg.firstCol;
  }
  function generateSegUid(seg) {
    return generateSegKey(seg) + ":" + seg.lastCol;
  }
  function computeFgSegPlacement(segs, dayMaxEvents, dayMaxEventRows, strictOrder, segHeights, maxContentHeight, cells) {
    let hierarchy = new DayGridSegHierarchy((segEntry) => {
      let segUid = segs[segEntry.index].eventRange.instance.instanceId + ":" + segEntry.span.start + ":" + (segEntry.span.end - 1);
      return segHeights[segUid] || 1;
    });
    hierarchy.allowReslicing = true;
    hierarchy.strictOrder = strictOrder;
    if (dayMaxEvents === true || dayMaxEventRows === true) {
      hierarchy.maxCoord = maxContentHeight;
      hierarchy.hiddenConsumes = true;
    } else if (typeof dayMaxEvents === "number") {
      hierarchy.maxStackCnt = dayMaxEvents;
    } else if (typeof dayMaxEventRows === "number") {
      hierarchy.maxStackCnt = dayMaxEventRows;
      hierarchy.hiddenConsumes = true;
    }
    let segInputs = [];
    let unknownHeightSegs = [];
    for (let i3 = 0; i3 < segs.length; i3 += 1) {
      let seg = segs[i3];
      let segUid = generateSegUid(seg);
      let eventHeight = segHeights[segUid];
      if (eventHeight != null) {
        segInputs.push({
          index: i3,
          span: {
            start: seg.firstCol,
            end: seg.lastCol + 1
          }
        });
      } else {
        unknownHeightSegs.push(seg);
      }
    }
    let hiddenEntries = hierarchy.addSegs(segInputs);
    let segRects = hierarchy.toRects();
    let { singleColPlacements, multiColPlacements, leftoverMargins } = placeRects(segRects, segs, cells);
    let moreCnts = [];
    let moreMarginTops = [];
    for (let seg of unknownHeightSegs) {
      multiColPlacements[seg.firstCol].push({
        seg,
        isVisible: false,
        isAbsolute: true,
        absoluteTop: 0,
        marginTop: 0
      });
      for (let col = seg.firstCol; col <= seg.lastCol; col += 1) {
        singleColPlacements[col].push({
          seg: resliceSeg(seg, col, col + 1, cells),
          isVisible: false,
          isAbsolute: false,
          absoluteTop: 0,
          marginTop: 0
        });
      }
    }
    for (let col = 0; col < cells.length; col += 1) {
      moreCnts.push(0);
    }
    for (let hiddenEntry of hiddenEntries) {
      let seg = segs[hiddenEntry.index];
      let hiddenSpan = hiddenEntry.span;
      multiColPlacements[hiddenSpan.start].push({
        seg: resliceSeg(seg, hiddenSpan.start, hiddenSpan.end, cells),
        isVisible: false,
        isAbsolute: true,
        absoluteTop: 0,
        marginTop: 0
      });
      for (let col = hiddenSpan.start; col < hiddenSpan.end; col += 1) {
        moreCnts[col] += 1;
        singleColPlacements[col].push({
          seg: resliceSeg(seg, col, col + 1, cells),
          isVisible: false,
          isAbsolute: false,
          absoluteTop: 0,
          marginTop: 0
        });
      }
    }
    for (let col = 0; col < cells.length; col += 1) {
      moreMarginTops.push(leftoverMargins[col]);
    }
    return { singleColPlacements, multiColPlacements, moreCnts, moreMarginTops };
  }
  function placeRects(allRects, segs, cells) {
    let rectsByEachCol = groupRectsByEachCol(allRects, cells.length);
    let singleColPlacements = [];
    let multiColPlacements = [];
    let leftoverMargins = [];
    for (let col = 0; col < cells.length; col += 1) {
      let rects = rectsByEachCol[col];
      let singlePlacements = [];
      let currentHeight = 0;
      let currentMarginTop = 0;
      for (let rect of rects) {
        let seg = segs[rect.index];
        singlePlacements.push({
          seg: resliceSeg(seg, col, col + 1, cells),
          isVisible: true,
          isAbsolute: false,
          absoluteTop: rect.levelCoord,
          marginTop: rect.levelCoord - currentHeight
        });
        currentHeight = rect.levelCoord + rect.thickness;
      }
      let multiPlacements = [];
      currentHeight = 0;
      currentMarginTop = 0;
      for (let rect of rects) {
        let seg = segs[rect.index];
        let isAbsolute = rect.span.end - rect.span.start > 1;
        let isFirstCol = rect.span.start === col;
        currentMarginTop += rect.levelCoord - currentHeight;
        currentHeight = rect.levelCoord + rect.thickness;
        if (isAbsolute) {
          currentMarginTop += rect.thickness;
          if (isFirstCol) {
            multiPlacements.push({
              seg: resliceSeg(seg, rect.span.start, rect.span.end, cells),
              isVisible: true,
              isAbsolute: true,
              absoluteTop: rect.levelCoord,
              marginTop: 0
            });
          }
        } else if (isFirstCol) {
          multiPlacements.push({
            seg: resliceSeg(seg, rect.span.start, rect.span.end, cells),
            isVisible: true,
            isAbsolute: false,
            absoluteTop: rect.levelCoord,
            marginTop: currentMarginTop
            // claim the margin
          });
          currentMarginTop = 0;
        }
      }
      singleColPlacements.push(singlePlacements);
      multiColPlacements.push(multiPlacements);
      leftoverMargins.push(currentMarginTop);
    }
    return { singleColPlacements, multiColPlacements, leftoverMargins };
  }
  function groupRectsByEachCol(rects, colCnt) {
    let rectsByEachCol = [];
    for (let col = 0; col < colCnt; col += 1) {
      rectsByEachCol.push([]);
    }
    for (let rect of rects) {
      for (let col = rect.span.start; col < rect.span.end; col += 1) {
        rectsByEachCol[col].push(rect);
      }
    }
    return rectsByEachCol;
  }
  function resliceSeg(seg, spanStart, spanEnd, cells) {
    if (seg.firstCol === spanStart && seg.lastCol === spanEnd - 1) {
      return seg;
    }
    let eventRange = seg.eventRange;
    let origRange = eventRange.range;
    let slicedRange = intersectRanges(origRange, {
      start: cells[spanStart].date,
      end: addDays(cells[spanEnd - 1].date, 1)
    });
    return Object.assign(Object.assign({}, seg), { firstCol: spanStart, lastCol: spanEnd - 1, eventRange: {
      def: eventRange.def,
      ui: Object.assign(Object.assign({}, eventRange.ui), { durationEditable: false }),
      instance: eventRange.instance,
      range: slicedRange
    }, isStart: seg.isStart && slicedRange.start.valueOf() === origRange.start.valueOf(), isEnd: seg.isEnd && slicedRange.end.valueOf() === origRange.end.valueOf() });
  }
  var DayGridSegHierarchy = class extends SegHierarchy {
    constructor() {
      super(...arguments);
      this.hiddenConsumes = false;
      this.forceHidden = {};
    }
    addSegs(segInputs) {
      const hiddenSegs = super.addSegs(segInputs);
      const { entriesByLevel } = this;
      const excludeHidden = (entry) => !this.forceHidden[buildEntryKey(entry)];
      for (let level = 0; level < entriesByLevel.length; level += 1) {
        entriesByLevel[level] = entriesByLevel[level].filter(excludeHidden);
      }
      return hiddenSegs;
    }
    handleInvalidInsertion(insertion, entry, hiddenEntries) {
      const { entriesByLevel, forceHidden } = this;
      const { touchingEntry, touchingLevel, touchingLateral } = insertion;
      if (this.hiddenConsumes && touchingEntry) {
        const touchingEntryId = buildEntryKey(touchingEntry);
        if (!forceHidden[touchingEntryId]) {
          if (this.allowReslicing) {
            const hiddenEntry = Object.assign(Object.assign({}, touchingEntry), { span: intersectSpans(touchingEntry.span, entry.span) });
            const hiddenEntryId = buildEntryKey(hiddenEntry);
            forceHidden[hiddenEntryId] = true;
            entriesByLevel[touchingLevel][touchingLateral] = hiddenEntry;
            hiddenEntries.push(hiddenEntry);
            this.splitEntry(touchingEntry, entry, hiddenEntries);
          } else {
            forceHidden[touchingEntryId] = true;
            hiddenEntries.push(touchingEntry);
          }
        }
      }
      super.handleInvalidInsertion(insertion, entry, hiddenEntries);
    }
  };
  var TableRow = class extends DateComponent {
    constructor() {
      super(...arguments);
      this.cellElRefs = new RefMap();
      this.frameElRefs = new RefMap();
      this.fgElRefs = new RefMap();
      this.segHarnessRefs = new RefMap();
      this.rootElRef = d();
      this.state = {
        framePositions: null,
        maxContentHeight: null,
        segHeights: {}
      };
      this.handleResize = (isForced) => {
        if (isForced) {
          this.updateSizing(true);
        }
      };
    }
    render() {
      let { props, state, context } = this;
      let { options } = context;
      let colCnt = props.cells.length;
      let businessHoursByCol = splitSegsByFirstCol(props.businessHourSegs, colCnt);
      let bgEventSegsByCol = splitSegsByFirstCol(props.bgEventSegs, colCnt);
      let highlightSegsByCol = splitSegsByFirstCol(this.getHighlightSegs(), colCnt);
      let mirrorSegsByCol = splitSegsByFirstCol(this.getMirrorSegs(), colCnt);
      let { singleColPlacements, multiColPlacements, moreCnts, moreMarginTops } = computeFgSegPlacement(sortEventSegs(props.fgEventSegs, options.eventOrder), props.dayMaxEvents, props.dayMaxEventRows, options.eventOrderStrict, state.segHeights, state.maxContentHeight, props.cells);
      let isForcedInvisible = (
        // TODO: messy way to compute this
        props.eventDrag && props.eventDrag.affectedInstances || props.eventResize && props.eventResize.affectedInstances || {}
      );
      return y(
        "tr",
        { ref: this.rootElRef, role: "row" },
        props.renderIntro && props.renderIntro(),
        props.cells.map((cell, col) => {
          let normalFgNodes = this.renderFgSegs(col, props.forPrint ? singleColPlacements[col] : multiColPlacements[col], props.todayRange, isForcedInvisible);
          let mirrorFgNodes = this.renderFgSegs(col, buildMirrorPlacements(mirrorSegsByCol[col], multiColPlacements), props.todayRange, {}, Boolean(props.eventDrag), Boolean(props.eventResize), false);
          return y(TableCell, { key: cell.key, elRef: this.cellElRefs.createRef(cell.key), innerElRef: this.frameElRefs.createRef(cell.key), dateProfile: props.dateProfile, date: cell.date, showDayNumber: props.showDayNumbers, showWeekNumber: props.showWeekNumbers && col === 0, forceDayTop: props.showWeekNumbers, todayRange: props.todayRange, eventSelection: props.eventSelection, eventDrag: props.eventDrag, eventResize: props.eventResize, extraRenderProps: cell.extraRenderProps, extraDataAttrs: cell.extraDataAttrs, extraClassNames: cell.extraClassNames, extraDateSpan: cell.extraDateSpan, moreCnt: moreCnts[col], moreMarginTop: moreMarginTops[col], singlePlacements: singleColPlacements[col], fgContentElRef: this.fgElRefs.createRef(cell.key), fgContent: (
            // Fragment scopes the keys
            y(
              _,
              null,
              y(_, null, normalFgNodes),
              y(_, null, mirrorFgNodes)
            )
          ), bgContent: (
            // Fragment scopes the keys
            y(
              _,
              null,
              this.renderFillSegs(highlightSegsByCol[col], "highlight"),
              this.renderFillSegs(businessHoursByCol[col], "non-business"),
              this.renderFillSegs(bgEventSegsByCol[col], "bg-event")
            )
          ), minHeight: props.cellMinHeight });
        })
      );
    }
    componentDidMount() {
      this.updateSizing(true);
      this.context.addResizeHandler(this.handleResize);
    }
    componentDidUpdate(prevProps, prevState) {
      let currentProps = this.props;
      this.updateSizing(!isPropsEqual(prevProps, currentProps));
    }
    componentWillUnmount() {
      this.context.removeResizeHandler(this.handleResize);
    }
    getHighlightSegs() {
      let { props } = this;
      if (props.eventDrag && props.eventDrag.segs.length) {
        return props.eventDrag.segs;
      }
      if (props.eventResize && props.eventResize.segs.length) {
        return props.eventResize.segs;
      }
      return props.dateSelectionSegs;
    }
    getMirrorSegs() {
      let { props } = this;
      if (props.eventResize && props.eventResize.segs.length) {
        return props.eventResize.segs;
      }
      return [];
    }
    renderFgSegs(col, segPlacements, todayRange, isForcedInvisible, isDragging, isResizing, isDateSelecting) {
      let { context } = this;
      let { eventSelection } = this.props;
      let { framePositions } = this.state;
      let defaultDisplayEventEnd = this.props.cells.length === 1;
      let isMirror = isDragging || isResizing || isDateSelecting;
      let nodes = [];
      if (framePositions) {
        for (let placement of segPlacements) {
          let { seg } = placement;
          let { instanceId } = seg.eventRange.instance;
          let isVisible = placement.isVisible && !isForcedInvisible[instanceId];
          let isAbsolute = placement.isAbsolute;
          let left = "";
          let right = "";
          if (isAbsolute) {
            if (context.isRtl) {
              right = 0;
              left = framePositions.lefts[seg.lastCol] - framePositions.lefts[seg.firstCol];
            } else {
              left = 0;
              right = framePositions.rights[seg.firstCol] - framePositions.rights[seg.lastCol];
            }
          }
          nodes.push(y("div", { className: "fc-daygrid-event-harness" + (isAbsolute ? " fc-daygrid-event-harness-abs" : ""), key: generateSegKey(seg), ref: isMirror ? null : this.segHarnessRefs.createRef(generateSegUid(seg)), style: {
            visibility: isVisible ? "" : "hidden",
            marginTop: isAbsolute ? "" : placement.marginTop,
            top: isAbsolute ? placement.absoluteTop : "",
            left,
            right
          } }, hasListItemDisplay(seg) ? y(TableListItemEvent, Object.assign({ seg, isDragging, isSelected: instanceId === eventSelection, defaultDisplayEventEnd }, getSegMeta(seg, todayRange))) : y(TableBlockEvent, Object.assign({ seg, isDragging, isResizing, isDateSelecting, isSelected: instanceId === eventSelection, defaultDisplayEventEnd }, getSegMeta(seg, todayRange)))));
        }
      }
      return nodes;
    }
    renderFillSegs(segs, fillType) {
      let { isRtl } = this.context;
      let { todayRange } = this.props;
      let { framePositions } = this.state;
      let nodes = [];
      if (framePositions) {
        for (let seg of segs) {
          let leftRightCss = isRtl ? {
            right: 0,
            left: framePositions.lefts[seg.lastCol] - framePositions.lefts[seg.firstCol]
          } : {
            left: 0,
            right: framePositions.rights[seg.firstCol] - framePositions.rights[seg.lastCol]
          };
          nodes.push(y("div", { key: buildEventRangeKey(seg.eventRange), className: "fc-daygrid-bg-harness", style: leftRightCss }, fillType === "bg-event" ? y(BgEvent, Object.assign({ seg }, getSegMeta(seg, todayRange))) : renderFill(fillType)));
        }
      }
      return y(_, {}, ...nodes);
    }
    updateSizing(isExternalSizingChange) {
      let { props, state, frameElRefs } = this;
      if (!props.forPrint && props.clientWidth !== null) {
        if (isExternalSizingChange) {
          let frameEls = props.cells.map((cell) => frameElRefs.currentMap[cell.key]);
          if (frameEls.length) {
            let originEl = this.rootElRef.current;
            let newPositionCache = new PositionCache(
              originEl,
              frameEls,
              true,
              // isHorizontal
              false
            );
            if (!state.framePositions || !state.framePositions.similarTo(newPositionCache)) {
              this.setState({
                framePositions: new PositionCache(
                  originEl,
                  frameEls,
                  true,
                  // isHorizontal
                  false
                )
              });
            }
          }
        }
        const oldSegHeights = this.state.segHeights;
        const newSegHeights = this.querySegHeights();
        const limitByContentHeight = props.dayMaxEvents === true || props.dayMaxEventRows === true;
        this.safeSetState({
          // HACK to prevent oscillations of events being shown/hidden from max-event-rows
          // Essentially, once you compute an element's height, never null-out.
          // TODO: always display all events, as visibility:hidden?
          segHeights: Object.assign(Object.assign({}, oldSegHeights), newSegHeights),
          maxContentHeight: limitByContentHeight ? this.computeMaxContentHeight() : null
        });
      }
    }
    querySegHeights() {
      let segElMap = this.segHarnessRefs.currentMap;
      let segHeights = {};
      for (let segUid in segElMap) {
        let height = Math.round(segElMap[segUid].getBoundingClientRect().height);
        segHeights[segUid] = Math.max(segHeights[segUid] || 0, height);
      }
      return segHeights;
    }
    computeMaxContentHeight() {
      let firstKey = this.props.cells[0].key;
      let cellEl = this.cellElRefs.currentMap[firstKey];
      let fcContainerEl = this.fgElRefs.currentMap[firstKey];
      return cellEl.getBoundingClientRect().bottom - fcContainerEl.getBoundingClientRect().top;
    }
    getCellEls() {
      let elMap = this.cellElRefs.currentMap;
      return this.props.cells.map((cell) => elMap[cell.key]);
    }
  };
  TableRow.addStateEquality({
    segHeights: isPropsEqual
  });
  function buildMirrorPlacements(mirrorSegs, colPlacements) {
    if (!mirrorSegs.length) {
      return [];
    }
    let topsByInstanceId = buildAbsoluteTopHash(colPlacements);
    return mirrorSegs.map((seg) => ({
      seg,
      isVisible: true,
      isAbsolute: true,
      absoluteTop: topsByInstanceId[seg.eventRange.instance.instanceId],
      marginTop: 0
    }));
  }
  function buildAbsoluteTopHash(colPlacements) {
    let topsByInstanceId = {};
    for (let placements of colPlacements) {
      for (let placement of placements) {
        topsByInstanceId[placement.seg.eventRange.instance.instanceId] = placement.absoluteTop;
      }
    }
    return topsByInstanceId;
  }
  var TableRows = class extends DateComponent {
    constructor() {
      super(...arguments);
      this.splitBusinessHourSegs = memoize(splitSegsByRow);
      this.splitBgEventSegs = memoize(splitAllDaySegsByRow);
      this.splitFgEventSegs = memoize(splitSegsByRow);
      this.splitDateSelectionSegs = memoize(splitSegsByRow);
      this.splitEventDrag = memoize(splitInteractionByRow);
      this.splitEventResize = memoize(splitInteractionByRow);
      this.rowRefs = new RefMap();
    }
    render() {
      let { props, context } = this;
      let rowCnt = props.cells.length;
      let businessHourSegsByRow = this.splitBusinessHourSegs(props.businessHourSegs, rowCnt);
      let bgEventSegsByRow = this.splitBgEventSegs(props.bgEventSegs, rowCnt);
      let fgEventSegsByRow = this.splitFgEventSegs(props.fgEventSegs, rowCnt);
      let dateSelectionSegsByRow = this.splitDateSelectionSegs(props.dateSelectionSegs, rowCnt);
      let eventDragByRow = this.splitEventDrag(props.eventDrag, rowCnt);
      let eventResizeByRow = this.splitEventResize(props.eventResize, rowCnt);
      let cellMinHeight = rowCnt >= 7 && props.clientWidth ? props.clientWidth / context.options.aspectRatio / 6 : null;
      return y(NowTimer, { unit: "day" }, (nowDate, todayRange) => y(_, null, props.cells.map((cells, row) => y(TableRow, {
        ref: this.rowRefs.createRef(row),
        key: cells.length ? cells[0].date.toISOString() : row,
        showDayNumbers: rowCnt > 1,
        showWeekNumbers: props.showWeekNumbers,
        todayRange,
        dateProfile: props.dateProfile,
        cells,
        renderIntro: props.renderRowIntro,
        businessHourSegs: businessHourSegsByRow[row],
        eventSelection: props.eventSelection,
        bgEventSegs: bgEventSegsByRow[row],
        fgEventSegs: fgEventSegsByRow[row],
        dateSelectionSegs: dateSelectionSegsByRow[row],
        eventDrag: eventDragByRow[row],
        eventResize: eventResizeByRow[row],
        dayMaxEvents: props.dayMaxEvents,
        dayMaxEventRows: props.dayMaxEventRows,
        clientWidth: props.clientWidth,
        clientHeight: props.clientHeight,
        cellMinHeight,
        forPrint: props.forPrint
      }))));
    }
    componentDidMount() {
      this.registerInteractiveComponent();
    }
    componentDidUpdate() {
      this.registerInteractiveComponent();
    }
    registerInteractiveComponent() {
      if (!this.rootEl) {
        const firstCellEl = this.rowRefs.currentMap[0].getCellEls()[0];
        const rootEl = firstCellEl ? firstCellEl.closest(".fc-daygrid-body") : null;
        if (rootEl) {
          this.rootEl = rootEl;
          this.context.registerInteractiveComponent(this, {
            el: rootEl,
            isHitComboAllowed: this.props.isHitComboAllowed
          });
        }
      }
    }
    componentWillUnmount() {
      if (this.rootEl) {
        this.context.unregisterInteractiveComponent(this);
        this.rootEl = null;
      }
    }
    // Hit System
    // ----------------------------------------------------------------------------------------------------
    prepareHits() {
      this.rowPositions = new PositionCache(
        this.rootEl,
        this.rowRefs.collect().map((rowObj) => rowObj.getCellEls()[0]),
        // first cell el in each row. TODO: not optimal
        false,
        true
      );
      this.colPositions = new PositionCache(
        this.rootEl,
        this.rowRefs.currentMap[0].getCellEls(),
        // cell els in first row
        true,
        // horizontal
        false
      );
    }
    queryHit(positionLeft, positionTop) {
      let { colPositions, rowPositions } = this;
      let col = colPositions.leftToIndex(positionLeft);
      let row = rowPositions.topToIndex(positionTop);
      if (row != null && col != null) {
        let cell = this.props.cells[row][col];
        return {
          dateProfile: this.props.dateProfile,
          dateSpan: Object.assign({ range: this.getCellRange(row, col), allDay: true }, cell.extraDateSpan),
          dayEl: this.getCellEl(row, col),
          rect: {
            left: colPositions.lefts[col],
            right: colPositions.rights[col],
            top: rowPositions.tops[row],
            bottom: rowPositions.bottoms[row]
          },
          layer: 0
        };
      }
      return null;
    }
    getCellEl(row, col) {
      return this.rowRefs.currentMap[row].getCellEls()[col];
    }
    getCellRange(row, col) {
      let start = this.props.cells[row][col].date;
      let end = addDays(start, 1);
      return { start, end };
    }
  };
  function splitAllDaySegsByRow(segs, rowCnt) {
    return splitSegsByRow(segs.filter(isSegAllDay), rowCnt);
  }
  function isSegAllDay(seg) {
    return seg.eventRange.def.allDay;
  }
  var Table = class extends DateComponent {
    constructor() {
      super(...arguments);
      this.elRef = d();
      this.needsScrollReset = false;
    }
    render() {
      let { props } = this;
      let { dayMaxEventRows, dayMaxEvents, expandRows } = props;
      let limitViaBalanced = dayMaxEvents === true || dayMaxEventRows === true;
      if (limitViaBalanced && !expandRows) {
        limitViaBalanced = false;
        dayMaxEventRows = null;
        dayMaxEvents = null;
      }
      let classNames = [
        "fc-daygrid-body",
        limitViaBalanced ? "fc-daygrid-body-balanced" : "fc-daygrid-body-unbalanced",
        expandRows ? "" : "fc-daygrid-body-natural"
        // will height of one row depend on the others?
      ];
      return y(
        "div",
        { ref: this.elRef, className: classNames.join(" "), style: {
          // these props are important to give this wrapper correct dimensions for interactions
          // TODO: if we set it here, can we avoid giving to inner tables?
          width: props.clientWidth,
          minWidth: props.tableMinWidth
        } },
        y(
          "table",
          { role: "presentation", className: "fc-scrollgrid-sync-table", style: {
            width: props.clientWidth,
            minWidth: props.tableMinWidth,
            height: expandRows ? props.clientHeight : ""
          } },
          props.colGroupNode,
          y(
            "tbody",
            { role: "presentation" },
            y(TableRows, { dateProfile: props.dateProfile, cells: props.cells, renderRowIntro: props.renderRowIntro, showWeekNumbers: props.showWeekNumbers, clientWidth: props.clientWidth, clientHeight: props.clientHeight, businessHourSegs: props.businessHourSegs, bgEventSegs: props.bgEventSegs, fgEventSegs: props.fgEventSegs, dateSelectionSegs: props.dateSelectionSegs, eventSelection: props.eventSelection, eventDrag: props.eventDrag, eventResize: props.eventResize, dayMaxEvents, dayMaxEventRows, forPrint: props.forPrint, isHitComboAllowed: props.isHitComboAllowed })
          )
        )
      );
    }
    componentDidMount() {
      this.requestScrollReset();
    }
    componentDidUpdate(prevProps) {
      if (prevProps.dateProfile !== this.props.dateProfile) {
        this.requestScrollReset();
      } else {
        this.flushScrollReset();
      }
    }
    requestScrollReset() {
      this.needsScrollReset = true;
      this.flushScrollReset();
    }
    flushScrollReset() {
      if (this.needsScrollReset && this.props.clientWidth) {
        const subjectEl = getScrollSubjectEl(this.elRef.current, this.props.dateProfile);
        if (subjectEl) {
          const originEl = subjectEl.closest(".fc-daygrid-body");
          const scrollEl = originEl.closest(".fc-scroller");
          const scrollTop = subjectEl.getBoundingClientRect().top - originEl.getBoundingClientRect().top;
          scrollEl.scrollTop = scrollTop ? scrollTop + 1 : 0;
        }
        this.needsScrollReset = false;
      }
    }
  };
  function getScrollSubjectEl(containerEl, dateProfile) {
    let el;
    if (dateProfile.currentRangeUnit.match(/year|month/)) {
      el = containerEl.querySelector(`[data-date="${formatIsoMonthStr(dateProfile.currentDate)}-01"]`);
    }
    if (!el) {
      el = containerEl.querySelector(`[data-date="${formatDayString(dateProfile.currentDate)}"]`);
    }
    return el;
  }
  var DayTableSlicer = class extends Slicer {
    constructor() {
      super(...arguments);
      this.forceDayIfListItem = true;
    }
    sliceRange(dateRange, dayTableModel) {
      return dayTableModel.sliceRange(dateRange);
    }
  };
  var DayTable = class extends DateComponent {
    constructor() {
      super(...arguments);
      this.slicer = new DayTableSlicer();
      this.tableRef = d();
    }
    render() {
      let { props, context } = this;
      return y(Table, Object.assign({ ref: this.tableRef }, this.slicer.sliceProps(props, props.dateProfile, props.nextDayThreshold, context, props.dayTableModel), { dateProfile: props.dateProfile, cells: props.dayTableModel.cells, colGroupNode: props.colGroupNode, tableMinWidth: props.tableMinWidth, renderRowIntro: props.renderRowIntro, dayMaxEvents: props.dayMaxEvents, dayMaxEventRows: props.dayMaxEventRows, showWeekNumbers: props.showWeekNumbers, expandRows: props.expandRows, headerAlignElRef: props.headerAlignElRef, clientWidth: props.clientWidth, clientHeight: props.clientHeight, forPrint: props.forPrint }));
    }
  };
  var DayTableView = class extends TableView {
    constructor() {
      super(...arguments);
      this.buildDayTableModel = memoize(buildDayTableModel);
      this.headerRef = d();
      this.tableRef = d();
    }
    render() {
      let { options, dateProfileGenerator } = this.context;
      let { props } = this;
      let dayTableModel = this.buildDayTableModel(props.dateProfile, dateProfileGenerator);
      let headerContent = options.dayHeaders && y(DayHeader, { ref: this.headerRef, dateProfile: props.dateProfile, dates: dayTableModel.headerDates, datesRepDistinctDays: dayTableModel.rowCnt === 1 });
      let bodyContent = (contentArg) => y(DayTable, { ref: this.tableRef, dateProfile: props.dateProfile, dayTableModel, businessHours: props.businessHours, dateSelection: props.dateSelection, eventStore: props.eventStore, eventUiBases: props.eventUiBases, eventSelection: props.eventSelection, eventDrag: props.eventDrag, eventResize: props.eventResize, nextDayThreshold: options.nextDayThreshold, colGroupNode: contentArg.tableColGroupNode, tableMinWidth: contentArg.tableMinWidth, dayMaxEvents: options.dayMaxEvents, dayMaxEventRows: options.dayMaxEventRows, showWeekNumbers: options.weekNumbers, expandRows: !props.isHeightAuto, headerAlignElRef: this.headerElRef, clientWidth: contentArg.clientWidth, clientHeight: contentArg.clientHeight, forPrint: props.forPrint });
      return options.dayMinWidth ? this.renderHScrollLayout(headerContent, bodyContent, dayTableModel.colCnt, options.dayMinWidth) : this.renderSimpleLayout(headerContent, bodyContent);
    }
  };
  function buildDayTableModel(dateProfile, dateProfileGenerator) {
    let daySeries = new DaySeriesModel(dateProfile.renderRange, dateProfileGenerator);
    return new DayTableModel(daySeries, /year|month|week/.test(dateProfile.currentRangeUnit));
  }
  var TableDateProfileGenerator = class extends DateProfileGenerator {
    // Computes the date range that will be rendered
    buildRenderRange(currentRange, currentRangeUnit, isRangeAllDay) {
      let renderRange = super.buildRenderRange(currentRange, currentRangeUnit, isRangeAllDay);
      let { props } = this;
      return buildDayTableRenderRange({
        currentRange: renderRange,
        snapToWeek: /^(year|month)$/.test(currentRangeUnit),
        fixedWeekCount: props.fixedWeekCount,
        dateEnv: props.dateEnv
      });
    }
  };
  function buildDayTableRenderRange(props) {
    let { dateEnv, currentRange } = props;
    let { start, end } = currentRange;
    let endOfWeek;
    if (props.snapToWeek) {
      start = dateEnv.startOfWeek(start);
      endOfWeek = dateEnv.startOfWeek(end);
      if (endOfWeek.valueOf() !== end.valueOf()) {
        end = addWeeks(endOfWeek, 1);
      }
    }
    if (props.fixedWeekCount) {
      let lastMonthRenderStart = dateEnv.startOfWeek(dateEnv.startOfMonth(addDays(currentRange.end, -1)));
      let rowCnt = Math.ceil(
        // could be partial weeks due to hiddenDays
        diffWeeks(lastMonthRenderStart, end)
      );
      end = addWeeks(end, 6 - rowCnt);
    }
    return { start, end };
  }
  var css_248z2 = ':root{--fc-daygrid-event-dot-width:8px}.fc-daygrid-day-events:after,.fc-daygrid-day-events:before,.fc-daygrid-day-frame:after,.fc-daygrid-day-frame:before,.fc-daygrid-event-harness:after,.fc-daygrid-event-harness:before{clear:both;content:"";display:table}.fc .fc-daygrid-body{position:relative;z-index:1}.fc .fc-daygrid-day.fc-day-today{background-color:var(--fc-today-bg-color)}.fc .fc-daygrid-day-frame{min-height:100%;position:relative}.fc .fc-daygrid-day-top{display:flex;flex-direction:row-reverse}.fc .fc-day-other .fc-daygrid-day-top{opacity:.3}.fc .fc-daygrid-day-number{padding:4px;position:relative;z-index:4}.fc .fc-daygrid-month-start{font-size:1.1em;font-weight:700}.fc .fc-daygrid-day-events{margin-top:1px}.fc .fc-daygrid-body-balanced .fc-daygrid-day-events{left:0;position:absolute;right:0}.fc .fc-daygrid-body-unbalanced .fc-daygrid-day-events{min-height:2em;position:relative}.fc .fc-daygrid-body-natural .fc-daygrid-day-events{margin-bottom:1em}.fc .fc-daygrid-event-harness{position:relative}.fc .fc-daygrid-event-harness-abs{left:0;position:absolute;right:0;top:0}.fc .fc-daygrid-bg-harness{bottom:0;position:absolute;top:0}.fc .fc-daygrid-day-bg .fc-non-business{z-index:1}.fc .fc-daygrid-day-bg .fc-bg-event{z-index:2}.fc .fc-daygrid-day-bg .fc-highlight{z-index:3}.fc .fc-daygrid-event{margin-top:1px;z-index:6}.fc .fc-daygrid-event.fc-event-mirror{z-index:7}.fc .fc-daygrid-day-bottom{font-size:.85em;margin:0 2px}.fc .fc-daygrid-day-bottom:after,.fc .fc-daygrid-day-bottom:before{clear:both;content:"";display:table}.fc .fc-daygrid-more-link{border-radius:3px;cursor:pointer;line-height:1;margin-top:1px;max-width:100%;overflow:hidden;padding:2px;position:relative;white-space:nowrap;z-index:4}.fc .fc-daygrid-more-link:hover{background-color:rgba(0,0,0,.1)}.fc .fc-daygrid-week-number{background-color:var(--fc-neutral-bg-color);color:var(--fc-neutral-text-color);min-width:1.5em;padding:2px;position:absolute;text-align:center;top:0;z-index:5}.fc .fc-more-popover .fc-popover-body{min-width:220px;padding:10px}.fc-direction-ltr .fc-daygrid-event.fc-event-start,.fc-direction-rtl .fc-daygrid-event.fc-event-end{margin-left:2px}.fc-direction-ltr .fc-daygrid-event.fc-event-end,.fc-direction-rtl .fc-daygrid-event.fc-event-start{margin-right:2px}.fc-direction-ltr .fc-daygrid-more-link{float:left}.fc-direction-ltr .fc-daygrid-week-number{border-radius:0 0 3px 0;left:0}.fc-direction-rtl .fc-daygrid-more-link{float:right}.fc-direction-rtl .fc-daygrid-week-number{border-radius:0 0 0 3px;right:0}.fc-liquid-hack .fc-daygrid-day-frame{position:static}.fc-daygrid-event{border-radius:3px;font-size:var(--fc-small-font-size);position:relative;white-space:nowrap}.fc-daygrid-block-event .fc-event-time{font-weight:700}.fc-daygrid-block-event .fc-event-time,.fc-daygrid-block-event .fc-event-title{padding:1px}.fc-daygrid-dot-event{align-items:center;display:flex;padding:2px 0}.fc-daygrid-dot-event .fc-event-title{flex-grow:1;flex-shrink:1;font-weight:700;min-width:0;overflow:hidden}.fc-daygrid-dot-event.fc-event-mirror,.fc-daygrid-dot-event:hover{background:rgba(0,0,0,.1)}.fc-daygrid-dot-event.fc-event-selected:before{bottom:-10px;top:-10px}.fc-daygrid-event-dot{border:calc(var(--fc-daygrid-event-dot-width)/2) solid var(--fc-event-border-color);border-radius:calc(var(--fc-daygrid-event-dot-width)/2);box-sizing:content-box;height:0;margin:0 4px;width:0}.fc-direction-ltr .fc-daygrid-event .fc-event-time{margin-right:3px}.fc-direction-rtl .fc-daygrid-event .fc-event-time{margin-left:3px}';
  injectStyles(css_248z2);

  // node_modules/@fullcalendar/daygrid/index.js
  var index = createPlugin({
    name: "@fullcalendar/daygrid",
    initialView: "dayGridMonth",
    views: {
      dayGrid: {
        component: DayTableView,
        dateProfileGeneratorClass: TableDateProfileGenerator
      },
      dayGridDay: {
        type: "dayGrid",
        duration: { days: 1 }
      },
      dayGridWeek: {
        type: "dayGrid",
        duration: { weeks: 1 }
      },
      dayGridMonth: {
        type: "dayGrid",
        duration: { months: 1 },
        fixedWeekCount: true
      },
      dayGridYear: {
        type: "dayGrid",
        duration: { years: 1 }
      }
    }
  });

  // node_modules/@fullcalendar/timegrid/internal.js
  var AllDaySplitter = class extends Splitter {
    getKeyInfo() {
      return {
        allDay: {},
        timed: {}
      };
    }
    getKeysForDateSpan(dateSpan) {
      if (dateSpan.allDay) {
        return ["allDay"];
      }
      return ["timed"];
    }
    getKeysForEventDef(eventDef) {
      if (!eventDef.allDay) {
        return ["timed"];
      }
      if (hasBgRendering(eventDef)) {
        return ["timed", "allDay"];
      }
      return ["allDay"];
    }
  };
  var DEFAULT_SLAT_LABEL_FORMAT = createFormatter({
    hour: "numeric",
    minute: "2-digit",
    omitZeroMinute: true,
    meridiem: "short"
  });
  function TimeColsAxisCell(props) {
    let classNames = [
      "fc-timegrid-slot",
      "fc-timegrid-slot-label",
      props.isLabeled ? "fc-scrollgrid-shrink" : "fc-timegrid-slot-minor"
    ];
    return y(ViewContextType.Consumer, null, (context) => {
      if (!props.isLabeled) {
        return y("td", { className: classNames.join(" "), "data-time": props.isoTimeStr });
      }
      let { dateEnv, options, viewApi } = context;
      let labelFormat = (
        // TODO: fully pre-parse
        options.slotLabelFormat == null ? DEFAULT_SLAT_LABEL_FORMAT : Array.isArray(options.slotLabelFormat) ? createFormatter(options.slotLabelFormat[0]) : createFormatter(options.slotLabelFormat)
      );
      let renderProps = {
        level: 0,
        time: props.time,
        date: dateEnv.toDate(props.date),
        view: viewApi,
        text: dateEnv.format(props.date, labelFormat)
      };
      return y(ContentContainer, { elTag: "td", elClasses: classNames, elAttrs: {
        "data-time": props.isoTimeStr
      }, renderProps, generatorName: "slotLabelContent", customGenerator: options.slotLabelContent, defaultGenerator: renderInnerContent3, classNameGenerator: options.slotLabelClassNames, didMount: options.slotLabelDidMount, willUnmount: options.slotLabelWillUnmount }, (InnerContent) => y(
        "div",
        { className: "fc-timegrid-slot-label-frame fc-scrollgrid-shrink-frame" },
        y(InnerContent, { elTag: "div", elClasses: [
          "fc-timegrid-slot-label-cushion",
          "fc-scrollgrid-shrink-cushion"
        ] })
      ));
    });
  }
  function renderInnerContent3(props) {
    return props.text;
  }
  var TimeBodyAxis = class extends BaseComponent {
    render() {
      return this.props.slatMetas.map((slatMeta) => y(
        "tr",
        { key: slatMeta.key },
        y(TimeColsAxisCell, Object.assign({}, slatMeta))
      ));
    }
  };
  var DEFAULT_WEEK_NUM_FORMAT2 = createFormatter({ week: "short" });
  var AUTO_ALL_DAY_MAX_EVENT_ROWS = 5;
  var TimeColsView = class extends DateComponent {
    constructor() {
      super(...arguments);
      this.allDaySplitter = new AllDaySplitter();
      this.headerElRef = d();
      this.rootElRef = d();
      this.scrollerElRef = d();
      this.state = {
        slatCoords: null
      };
      this.handleScrollTopRequest = (scrollTop) => {
        let scrollerEl = this.scrollerElRef.current;
        if (scrollerEl) {
          scrollerEl.scrollTop = scrollTop;
        }
      };
      this.renderHeadAxis = (rowKey, frameHeight = "") => {
        let { options } = this.context;
        let { dateProfile } = this.props;
        let range2 = dateProfile.renderRange;
        let dayCnt = diffDays(range2.start, range2.end);
        let navLinkAttrs = dayCnt === 1 ? buildNavLinkAttrs(this.context, range2.start, "week") : {};
        if (options.weekNumbers && rowKey === "day") {
          return y(WeekNumberContainer, { elTag: "th", elClasses: [
            "fc-timegrid-axis",
            "fc-scrollgrid-shrink"
          ], elAttrs: {
            "aria-hidden": true
          }, date: range2.start, defaultFormat: DEFAULT_WEEK_NUM_FORMAT2 }, (InnerContent) => y(
            "div",
            { className: [
              "fc-timegrid-axis-frame",
              "fc-scrollgrid-shrink-frame",
              "fc-timegrid-axis-frame-liquid"
            ].join(" "), style: { height: frameHeight } },
            y(InnerContent, { elTag: "a", elClasses: [
              "fc-timegrid-axis-cushion",
              "fc-scrollgrid-shrink-cushion",
              "fc-scrollgrid-sync-inner"
            ], elAttrs: navLinkAttrs })
          ));
        }
        return y(
          "th",
          { "aria-hidden": true, className: "fc-timegrid-axis" },
          y("div", { className: "fc-timegrid-axis-frame", style: { height: frameHeight } })
        );
      };
      this.renderTableRowAxis = (rowHeight) => {
        let { options, viewApi } = this.context;
        let renderProps = {
          text: options.allDayText,
          view: viewApi
        };
        return (
          // TODO: make reusable hook. used in list view too
          y(ContentContainer, { elTag: "td", elClasses: [
            "fc-timegrid-axis",
            "fc-scrollgrid-shrink"
          ], elAttrs: {
            "aria-hidden": true
          }, renderProps, generatorName: "allDayContent", customGenerator: options.allDayContent, defaultGenerator: renderAllDayInner, classNameGenerator: options.allDayClassNames, didMount: options.allDayDidMount, willUnmount: options.allDayWillUnmount }, (InnerContent) => y(
            "div",
            { className: [
              "fc-timegrid-axis-frame",
              "fc-scrollgrid-shrink-frame",
              rowHeight == null ? " fc-timegrid-axis-frame-liquid" : ""
            ].join(" "), style: { height: rowHeight } },
            y(InnerContent, { elTag: "span", elClasses: [
              "fc-timegrid-axis-cushion",
              "fc-scrollgrid-shrink-cushion",
              "fc-scrollgrid-sync-inner"
            ] })
          ))
        );
      };
      this.handleSlatCoords = (slatCoords) => {
        this.setState({ slatCoords });
      };
    }
    // rendering
    // ----------------------------------------------------------------------------------------------------
    renderSimpleLayout(headerRowContent, allDayContent, timeContent) {
      let { context, props } = this;
      let sections = [];
      let stickyHeaderDates = getStickyHeaderDates(context.options);
      if (headerRowContent) {
        sections.push({
          type: "header",
          key: "header",
          isSticky: stickyHeaderDates,
          chunk: {
            elRef: this.headerElRef,
            tableClassName: "fc-col-header",
            rowContent: headerRowContent
          }
        });
      }
      if (allDayContent) {
        sections.push({
          type: "body",
          key: "all-day",
          chunk: { content: allDayContent }
        });
        sections.push({
          type: "body",
          key: "all-day-divider",
          outerContent: (
            // TODO: rename to cellContent so don't need to define <tr>?
            y(
              "tr",
              { role: "presentation", className: "fc-scrollgrid-section" },
              y("td", { className: "fc-timegrid-divider " + context.theme.getClass("tableCellShaded") })
            )
          )
        });
      }
      sections.push({
        type: "body",
        key: "body",
        liquid: true,
        expandRows: Boolean(context.options.expandRows),
        chunk: {
          scrollerElRef: this.scrollerElRef,
          content: timeContent
        }
      });
      return y(
        ViewContainer,
        { elRef: this.rootElRef, elClasses: ["fc-timegrid"], viewSpec: context.viewSpec },
        y(SimpleScrollGrid, { liquid: !props.isHeightAuto && !props.forPrint, collapsibleWidth: props.forPrint, cols: [{ width: "shrink" }], sections })
      );
    }
    renderHScrollLayout(headerRowContent, allDayContent, timeContent, colCnt, dayMinWidth, slatMetas, slatCoords) {
      let ScrollGrid = this.context.pluginHooks.scrollGridImpl;
      if (!ScrollGrid) {
        throw new Error("No ScrollGrid implementation");
      }
      let { context, props } = this;
      let stickyHeaderDates = !props.forPrint && getStickyHeaderDates(context.options);
      let stickyFooterScrollbar = !props.forPrint && getStickyFooterScrollbar(context.options);
      let sections = [];
      if (headerRowContent) {
        sections.push({
          type: "header",
          key: "header",
          isSticky: stickyHeaderDates,
          syncRowHeights: true,
          chunks: [
            {
              key: "axis",
              rowContent: (arg) => y("tr", { role: "presentation" }, this.renderHeadAxis("day", arg.rowSyncHeights[0]))
            },
            {
              key: "cols",
              elRef: this.headerElRef,
              tableClassName: "fc-col-header",
              rowContent: headerRowContent
            }
          ]
        });
      }
      if (allDayContent) {
        sections.push({
          type: "body",
          key: "all-day",
          syncRowHeights: true,
          chunks: [
            {
              key: "axis",
              rowContent: (contentArg) => y("tr", { role: "presentation" }, this.renderTableRowAxis(contentArg.rowSyncHeights[0]))
            },
            {
              key: "cols",
              content: allDayContent
            }
          ]
        });
        sections.push({
          key: "all-day-divider",
          type: "body",
          outerContent: (
            // TODO: rename to cellContent so don't need to define <tr>?
            y(
              "tr",
              { role: "presentation", className: "fc-scrollgrid-section" },
              y("td", { colSpan: 2, className: "fc-timegrid-divider " + context.theme.getClass("tableCellShaded") })
            )
          )
        });
      }
      let isNowIndicator = context.options.nowIndicator;
      sections.push({
        type: "body",
        key: "body",
        liquid: true,
        expandRows: Boolean(context.options.expandRows),
        chunks: [
          {
            key: "axis",
            content: (arg) => (
              // TODO: make this now-indicator arrow more DRY with TimeColsContent
              y(
                "div",
                { className: "fc-timegrid-axis-chunk" },
                y(
                  "table",
                  { "aria-hidden": true, style: { height: arg.expandRows ? arg.clientHeight : "" } },
                  arg.tableColGroupNode,
                  y(
                    "tbody",
                    null,
                    y(TimeBodyAxis, { slatMetas })
                  )
                ),
                y(
                  "div",
                  { className: "fc-timegrid-now-indicator-container" },
                  y(NowTimer, {
                    unit: isNowIndicator ? "minute" : "day"
                    /* hacky */
                  }, (nowDate) => {
                    let nowIndicatorTop = isNowIndicator && slatCoords && slatCoords.safeComputeTop(nowDate);
                    if (typeof nowIndicatorTop === "number") {
                      return y(NowIndicatorContainer, { elClasses: ["fc-timegrid-now-indicator-arrow"], elStyle: { top: nowIndicatorTop }, isAxis: true, date: nowDate });
                    }
                    return null;
                  })
                )
              )
            )
          },
          {
            key: "cols",
            scrollerElRef: this.scrollerElRef,
            content: timeContent
          }
        ]
      });
      if (stickyFooterScrollbar) {
        sections.push({
          key: "footer",
          type: "footer",
          isSticky: true,
          chunks: [
            {
              key: "axis",
              content: renderScrollShim
            },
            {
              key: "cols",
              content: renderScrollShim
            }
          ]
        });
      }
      return y(
        ViewContainer,
        { elRef: this.rootElRef, elClasses: ["fc-timegrid"], viewSpec: context.viewSpec },
        y(ScrollGrid, { liquid: !props.isHeightAuto && !props.forPrint, forPrint: props.forPrint, collapsibleWidth: false, colGroups: [
          { width: "shrink", cols: [{ width: "shrink" }] },
          { cols: [{ span: colCnt, minWidth: dayMinWidth }] }
        ], sections })
      );
    }
    /* Dimensions
    ------------------------------------------------------------------------------------------------------------------*/
    getAllDayMaxEventProps() {
      let { dayMaxEvents, dayMaxEventRows } = this.context.options;
      if (dayMaxEvents === true || dayMaxEventRows === true) {
        dayMaxEvents = void 0;
        dayMaxEventRows = AUTO_ALL_DAY_MAX_EVENT_ROWS;
      }
      return { dayMaxEvents, dayMaxEventRows };
    }
  };
  function renderAllDayInner(renderProps) {
    return renderProps.text;
  }
  var TimeColsSlatsCoords = class {
    constructor(positions, dateProfile, slotDuration) {
      this.positions = positions;
      this.dateProfile = dateProfile;
      this.slotDuration = slotDuration;
    }
    safeComputeTop(date) {
      let { dateProfile } = this;
      if (rangeContainsMarker(dateProfile.currentRange, date)) {
        let startOfDayDate = startOfDay(date);
        let timeMs = date.valueOf() - startOfDayDate.valueOf();
        if (timeMs >= asRoughMs(dateProfile.slotMinTime) && timeMs < asRoughMs(dateProfile.slotMaxTime)) {
          return this.computeTimeTop(createDuration(timeMs));
        }
      }
      return null;
    }
    // Computes the top coordinate, relative to the bounds of the grid, of the given date.
    // A `startOfDayDate` must be given for avoiding ambiguity over how to treat midnight.
    computeDateTop(when, startOfDayDate) {
      if (!startOfDayDate) {
        startOfDayDate = startOfDay(when);
      }
      return this.computeTimeTop(createDuration(when.valueOf() - startOfDayDate.valueOf()));
    }
    // Computes the top coordinate, relative to the bounds of the grid, of the given time (a Duration).
    // This is a makeshify way to compute the time-top. Assumes all slatMetas dates are uniform.
    // Eventually allow computation with arbirary slat dates.
    computeTimeTop(duration) {
      let { positions, dateProfile } = this;
      let len = positions.els.length;
      let slatCoverage = (duration.milliseconds - asRoughMs(dateProfile.slotMinTime)) / asRoughMs(this.slotDuration);
      let slatIndex;
      let slatRemainder;
      slatCoverage = Math.max(0, slatCoverage);
      slatCoverage = Math.min(len, slatCoverage);
      slatIndex = Math.floor(slatCoverage);
      slatIndex = Math.min(slatIndex, len - 1);
      slatRemainder = slatCoverage - slatIndex;
      return positions.tops[slatIndex] + positions.getHeight(slatIndex) * slatRemainder;
    }
  };
  var TimeColsSlatsBody = class extends BaseComponent {
    render() {
      let { props, context } = this;
      let { options } = context;
      let { slatElRefs } = props;
      return y("tbody", null, props.slatMetas.map((slatMeta, i3) => {
        let renderProps = {
          time: slatMeta.time,
          date: context.dateEnv.toDate(slatMeta.date),
          view: context.viewApi
        };
        return y(
          "tr",
          { key: slatMeta.key, ref: slatElRefs.createRef(slatMeta.key) },
          props.axis && y(TimeColsAxisCell, Object.assign({}, slatMeta)),
          y(ContentContainer, { elTag: "td", elClasses: [
            "fc-timegrid-slot",
            "fc-timegrid-slot-lane",
            !slatMeta.isLabeled && "fc-timegrid-slot-minor"
          ], elAttrs: {
            "data-time": slatMeta.isoTimeStr
          }, renderProps, generatorName: "slotLaneContent", customGenerator: options.slotLaneContent, classNameGenerator: options.slotLaneClassNames, didMount: options.slotLaneDidMount, willUnmount: options.slotLaneWillUnmount })
        );
      }));
    }
  };
  var TimeColsSlats = class extends BaseComponent {
    constructor() {
      super(...arguments);
      this.rootElRef = d();
      this.slatElRefs = new RefMap();
    }
    render() {
      let { props, context } = this;
      return y(
        "div",
        { ref: this.rootElRef, className: "fc-timegrid-slots" },
        y(
          "table",
          { "aria-hidden": true, className: context.theme.getClass("table"), style: {
            minWidth: props.tableMinWidth,
            width: props.clientWidth,
            height: props.minHeight
          } },
          props.tableColGroupNode,
          y(TimeColsSlatsBody, { slatElRefs: this.slatElRefs, axis: props.axis, slatMetas: props.slatMetas })
        )
      );
    }
    componentDidMount() {
      this.updateSizing();
    }
    componentDidUpdate() {
      this.updateSizing();
    }
    componentWillUnmount() {
      if (this.props.onCoords) {
        this.props.onCoords(null);
      }
    }
    updateSizing() {
      let { context, props } = this;
      if (props.onCoords && props.clientWidth !== null) {
        let rootEl = this.rootElRef.current;
        if (rootEl.offsetHeight) {
          props.onCoords(new TimeColsSlatsCoords(new PositionCache(this.rootElRef.current, collectSlatEls(this.slatElRefs.currentMap, props.slatMetas), false, true), this.props.dateProfile, context.options.slotDuration));
        }
      }
    }
  };
  function collectSlatEls(elMap, slatMetas) {
    return slatMetas.map((slatMeta) => elMap[slatMeta.key]);
  }
  function splitSegsByCol(segs, colCnt) {
    let segsByCol = [];
    let i3;
    for (i3 = 0; i3 < colCnt; i3 += 1) {
      segsByCol.push([]);
    }
    if (segs) {
      for (i3 = 0; i3 < segs.length; i3 += 1) {
        segsByCol[segs[i3].col].push(segs[i3]);
      }
    }
    return segsByCol;
  }
  function splitInteractionByCol(ui, colCnt) {
    let byRow = [];
    if (!ui) {
      for (let i3 = 0; i3 < colCnt; i3 += 1) {
        byRow[i3] = null;
      }
    } else {
      for (let i3 = 0; i3 < colCnt; i3 += 1) {
        byRow[i3] = {
          affectedInstances: ui.affectedInstances,
          isEvent: ui.isEvent,
          segs: []
        };
      }
      for (let seg of ui.segs) {
        byRow[seg.col].segs.push(seg);
      }
    }
    return byRow;
  }
  var TimeColMoreLink = class extends BaseComponent {
    render() {
      let { props } = this;
      return y(MoreLinkContainer, { elClasses: ["fc-timegrid-more-link"], elStyle: {
        top: props.top,
        bottom: props.bottom
      }, allDayDate: null, moreCnt: props.hiddenSegs.length, allSegs: props.hiddenSegs, hiddenSegs: props.hiddenSegs, extraDateSpan: props.extraDateSpan, dateProfile: props.dateProfile, todayRange: props.todayRange, popoverContent: () => renderPlainFgSegs(props.hiddenSegs, props), defaultGenerator: renderMoreLinkInner2, forceTimed: true }, (InnerContent) => y(InnerContent, { elTag: "div", elClasses: ["fc-timegrid-more-link-inner", "fc-sticky"] }));
    }
  };
  function renderMoreLinkInner2(props) {
    return props.shortText;
  }
  function buildPositioning(segInputs, strictOrder, maxStackCnt) {
    let hierarchy = new SegHierarchy();
    if (strictOrder != null) {
      hierarchy.strictOrder = strictOrder;
    }
    if (maxStackCnt != null) {
      hierarchy.maxStackCnt = maxStackCnt;
    }
    let hiddenEntries = hierarchy.addSegs(segInputs);
    let hiddenGroups = groupIntersectingEntries(hiddenEntries);
    let web = buildWeb(hierarchy);
    web = stretchWeb(web, 1);
    let segRects = webToRects(web);
    return { segRects, hiddenGroups };
  }
  function buildWeb(hierarchy) {
    const { entriesByLevel } = hierarchy;
    const buildNode = cacheable((level, lateral) => level + ":" + lateral, (level, lateral) => {
      let siblingRange = findNextLevelSegs(hierarchy, level, lateral);
      let nextLevelRes = buildNodes(siblingRange, buildNode);
      let entry = entriesByLevel[level][lateral];
      return [
        Object.assign(Object.assign({}, entry), { nextLevelNodes: nextLevelRes[0] }),
        entry.thickness + nextLevelRes[1]
        // the pressure builds
      ];
    });
    return buildNodes(entriesByLevel.length ? { level: 0, lateralStart: 0, lateralEnd: entriesByLevel[0].length } : null, buildNode)[0];
  }
  function buildNodes(siblingRange, buildNode) {
    if (!siblingRange) {
      return [[], 0];
    }
    let { level, lateralStart, lateralEnd } = siblingRange;
    let lateral = lateralStart;
    let pairs = [];
    while (lateral < lateralEnd) {
      pairs.push(buildNode(level, lateral));
      lateral += 1;
    }
    pairs.sort(cmpDescPressures);
    return [
      pairs.map(extractNode),
      pairs[0][1]
      // first item's pressure
    ];
  }
  function cmpDescPressures(a3, b3) {
    return b3[1] - a3[1];
  }
  function extractNode(a3) {
    return a3[0];
  }
  function findNextLevelSegs(hierarchy, subjectLevel, subjectLateral) {
    let { levelCoords, entriesByLevel } = hierarchy;
    let subjectEntry = entriesByLevel[subjectLevel][subjectLateral];
    let afterSubject = levelCoords[subjectLevel] + subjectEntry.thickness;
    let levelCnt = levelCoords.length;
    let level = subjectLevel;
    for (; level < levelCnt && levelCoords[level] < afterSubject; level += 1)
      ;
    for (; level < levelCnt; level += 1) {
      let entries = entriesByLevel[level];
      let entry;
      let searchIndex = binarySearch(entries, subjectEntry.span.start, getEntrySpanEnd);
      let lateralStart = searchIndex[0] + searchIndex[1];
      let lateralEnd = lateralStart;
      while (
        // loop through entries that horizontally intersect
        (entry = entries[lateralEnd]) && // but not past the whole seg list
        entry.span.start < subjectEntry.span.end
      ) {
        lateralEnd += 1;
      }
      if (lateralStart < lateralEnd) {
        return { level, lateralStart, lateralEnd };
      }
    }
    return null;
  }
  function stretchWeb(topLevelNodes, totalThickness) {
    const stretchNode = cacheable((node, startCoord, prevThickness) => buildEntryKey(node), (node, startCoord, prevThickness) => {
      let { nextLevelNodes, thickness } = node;
      let allThickness = thickness + prevThickness;
      let thicknessFraction = thickness / allThickness;
      let endCoord;
      let newChildren = [];
      if (!nextLevelNodes.length) {
        endCoord = totalThickness;
      } else {
        for (let childNode of nextLevelNodes) {
          if (endCoord === void 0) {
            let res = stretchNode(childNode, startCoord, allThickness);
            endCoord = res[0];
            newChildren.push(res[1]);
          } else {
            let res = stretchNode(childNode, endCoord, 0);
            newChildren.push(res[1]);
          }
        }
      }
      let newThickness = (endCoord - startCoord) * thicknessFraction;
      return [endCoord - newThickness, Object.assign(Object.assign({}, node), { thickness: newThickness, nextLevelNodes: newChildren })];
    });
    return topLevelNodes.map((node) => stretchNode(node, 0, 0)[1]);
  }
  function webToRects(topLevelNodes) {
    let rects = [];
    const processNode = cacheable((node, levelCoord, stackDepth) => buildEntryKey(node), (node, levelCoord, stackDepth) => {
      let rect = Object.assign(Object.assign({}, node), {
        levelCoord,
        stackDepth,
        stackForward: 0
      });
      rects.push(rect);
      return rect.stackForward = processNodes(node.nextLevelNodes, levelCoord + node.thickness, stackDepth + 1) + 1;
    });
    function processNodes(nodes, levelCoord, stackDepth) {
      let stackForward = 0;
      for (let node of nodes) {
        stackForward = Math.max(processNode(node, levelCoord, stackDepth), stackForward);
      }
      return stackForward;
    }
    processNodes(topLevelNodes, 0, 0);
    return rects;
  }
  function cacheable(keyFunc, workFunc) {
    const cache = {};
    return (...args) => {
      let key = keyFunc(...args);
      return key in cache ? cache[key] : cache[key] = workFunc(...args);
    };
  }
  function computeSegVCoords(segs, colDate, slatCoords = null, eventMinHeight = 0) {
    let vcoords = [];
    if (slatCoords) {
      for (let i3 = 0; i3 < segs.length; i3 += 1) {
        let seg = segs[i3];
        let spanStart = slatCoords.computeDateTop(seg.start, colDate);
        let spanEnd = Math.max(
          spanStart + (eventMinHeight || 0),
          // :(
          slatCoords.computeDateTop(seg.end, colDate)
        );
        vcoords.push({
          start: Math.round(spanStart),
          end: Math.round(spanEnd)
          //
        });
      }
    }
    return vcoords;
  }
  function computeFgSegPlacements(segs, segVCoords, eventOrderStrict, eventMaxStack) {
    let segInputs = [];
    let dumbSegs = [];
    for (let i3 = 0; i3 < segs.length; i3 += 1) {
      let vcoords = segVCoords[i3];
      if (vcoords) {
        segInputs.push({
          index: i3,
          thickness: 1,
          span: vcoords
        });
      } else {
        dumbSegs.push(segs[i3]);
      }
    }
    let { segRects, hiddenGroups } = buildPositioning(segInputs, eventOrderStrict, eventMaxStack);
    let segPlacements = [];
    for (let segRect of segRects) {
      segPlacements.push({
        seg: segs[segRect.index],
        rect: segRect
      });
    }
    for (let dumbSeg of dumbSegs) {
      segPlacements.push({ seg: dumbSeg, rect: null });
    }
    return { segPlacements, hiddenGroups };
  }
  var DEFAULT_TIME_FORMAT = createFormatter({
    hour: "numeric",
    minute: "2-digit",
    meridiem: false
  });
  var TimeColEvent = class extends BaseComponent {
    render() {
      return y(StandardEvent, Object.assign({}, this.props, { elClasses: [
        "fc-timegrid-event",
        "fc-v-event",
        this.props.isShort && "fc-timegrid-event-short"
      ], defaultTimeFormat: DEFAULT_TIME_FORMAT }));
    }
  };
  var TimeCol = class extends BaseComponent {
    constructor() {
      super(...arguments);
      this.sortEventSegs = memoize(sortEventSegs);
    }
    // TODO: memoize event-placement?
    render() {
      let { props, context } = this;
      let { options } = context;
      let isSelectMirror = options.selectMirror;
      let mirrorSegs = (
        // yuck
        props.eventDrag && props.eventDrag.segs || props.eventResize && props.eventResize.segs || isSelectMirror && props.dateSelectionSegs || []
      );
      let interactionAffectedInstances = (
        // TODO: messy way to compute this
        props.eventDrag && props.eventDrag.affectedInstances || props.eventResize && props.eventResize.affectedInstances || {}
      );
      let sortedFgSegs = this.sortEventSegs(props.fgEventSegs, options.eventOrder);
      return y(DayCellContainer, { elTag: "td", elRef: props.elRef, elClasses: [
        "fc-timegrid-col",
        ...props.extraClassNames || []
      ], elAttrs: Object.assign({ role: "gridcell" }, props.extraDataAttrs), date: props.date, dateProfile: props.dateProfile, todayRange: props.todayRange, extraRenderProps: props.extraRenderProps }, (InnerContent) => y(
        "div",
        { className: "fc-timegrid-col-frame" },
        y(
          "div",
          { className: "fc-timegrid-col-bg" },
          this.renderFillSegs(props.businessHourSegs, "non-business"),
          this.renderFillSegs(props.bgEventSegs, "bg-event"),
          this.renderFillSegs(props.dateSelectionSegs, "highlight")
        ),
        y("div", { className: "fc-timegrid-col-events" }, this.renderFgSegs(sortedFgSegs, interactionAffectedInstances, false, false, false)),
        y("div", { className: "fc-timegrid-col-events" }, this.renderFgSegs(mirrorSegs, {}, Boolean(props.eventDrag), Boolean(props.eventResize), Boolean(isSelectMirror), "mirror")),
        y("div", { className: "fc-timegrid-now-indicator-container" }, this.renderNowIndicator(props.nowIndicatorSegs)),
        hasCustomDayCellContent(options) && y(InnerContent, { elTag: "div", elClasses: ["fc-timegrid-col-misc"] })
      ));
    }
    renderFgSegs(sortedFgSegs, segIsInvisible, isDragging, isResizing, isDateSelecting, forcedKey) {
      let { props } = this;
      if (props.forPrint) {
        return renderPlainFgSegs(sortedFgSegs, props);
      }
      return this.renderPositionedFgSegs(sortedFgSegs, segIsInvisible, isDragging, isResizing, isDateSelecting, forcedKey);
    }
    renderPositionedFgSegs(segs, segIsInvisible, isDragging, isResizing, isDateSelecting, forcedKey) {
      let { eventMaxStack, eventShortHeight, eventOrderStrict, eventMinHeight } = this.context.options;
      let { date, slatCoords, eventSelection, todayRange, nowDate } = this.props;
      let isMirror = isDragging || isResizing || isDateSelecting;
      let segVCoords = computeSegVCoords(segs, date, slatCoords, eventMinHeight);
      let { segPlacements, hiddenGroups } = computeFgSegPlacements(segs, segVCoords, eventOrderStrict, eventMaxStack);
      return y(
        _,
        null,
        this.renderHiddenGroups(hiddenGroups, segs),
        segPlacements.map((segPlacement) => {
          let { seg, rect } = segPlacement;
          let instanceId = seg.eventRange.instance.instanceId;
          let isVisible = isMirror || Boolean(!segIsInvisible[instanceId] && rect);
          let vStyle = computeSegVStyle(rect && rect.span);
          let hStyle = !isMirror && rect ? this.computeSegHStyle(rect) : { left: 0, right: 0 };
          let isInset = Boolean(rect) && rect.stackForward > 0;
          let isShort = Boolean(rect) && rect.span.end - rect.span.start < eventShortHeight;
          return y(
            "div",
            { className: "fc-timegrid-event-harness" + (isInset ? " fc-timegrid-event-harness-inset" : ""), key: forcedKey || instanceId, style: Object.assign(Object.assign({ visibility: isVisible ? "" : "hidden" }, vStyle), hStyle) },
            y(TimeColEvent, Object.assign({ seg, isDragging, isResizing, isDateSelecting, isSelected: instanceId === eventSelection, isShort }, getSegMeta(seg, todayRange, nowDate)))
          );
        })
      );
    }
    // will already have eventMinHeight applied because segInputs already had it
    renderHiddenGroups(hiddenGroups, segs) {
      let { extraDateSpan, dateProfile, todayRange, nowDate, eventSelection, eventDrag, eventResize } = this.props;
      return y(_, null, hiddenGroups.map((hiddenGroup) => {
        let positionCss = computeSegVStyle(hiddenGroup.span);
        let hiddenSegs = compileSegsFromEntries(hiddenGroup.entries, segs);
        return y(TimeColMoreLink, { key: buildIsoString(computeEarliestSegStart(hiddenSegs)), hiddenSegs, top: positionCss.top, bottom: positionCss.bottom, extraDateSpan, dateProfile, todayRange, nowDate, eventSelection, eventDrag, eventResize });
      }));
    }
    renderFillSegs(segs, fillType) {
      let { props, context } = this;
      let segVCoords = computeSegVCoords(segs, props.date, props.slatCoords, context.options.eventMinHeight);
      let children = segVCoords.map((vcoords, i3) => {
        let seg = segs[i3];
        return y("div", { key: buildEventRangeKey(seg.eventRange), className: "fc-timegrid-bg-harness", style: computeSegVStyle(vcoords) }, fillType === "bg-event" ? y(BgEvent, Object.assign({ seg }, getSegMeta(seg, props.todayRange, props.nowDate))) : renderFill(fillType));
      });
      return y(_, null, children);
    }
    renderNowIndicator(segs) {
      let { slatCoords, date } = this.props;
      if (!slatCoords) {
        return null;
      }
      return segs.map((seg, i3) => y(
        NowIndicatorContainer,
        {
          // key doesn't matter. will only ever be one
          key: i3,
          elClasses: ["fc-timegrid-now-indicator-line"],
          elStyle: {
            top: slatCoords.computeDateTop(seg.start, date)
          },
          isAxis: false,
          date
        }
      ));
    }
    computeSegHStyle(segHCoords) {
      let { isRtl, options } = this.context;
      let shouldOverlap = options.slotEventOverlap;
      let nearCoord = segHCoords.levelCoord;
      let farCoord = segHCoords.levelCoord + segHCoords.thickness;
      let left;
      let right;
      if (shouldOverlap) {
        farCoord = Math.min(1, nearCoord + (farCoord - nearCoord) * 2);
      }
      if (isRtl) {
        left = 1 - farCoord;
        right = nearCoord;
      } else {
        left = nearCoord;
        right = 1 - farCoord;
      }
      let props = {
        zIndex: segHCoords.stackDepth + 1,
        left: left * 100 + "%",
        right: right * 100 + "%"
      };
      if (shouldOverlap && !segHCoords.stackForward) {
        props[isRtl ? "marginLeft" : "marginRight"] = 10 * 2;
      }
      return props;
    }
  };
  function renderPlainFgSegs(sortedFgSegs, { todayRange, nowDate, eventSelection, eventDrag, eventResize }) {
    let hiddenInstances = (eventDrag ? eventDrag.affectedInstances : null) || (eventResize ? eventResize.affectedInstances : null) || {};
    return y(_, null, sortedFgSegs.map((seg) => {
      let instanceId = seg.eventRange.instance.instanceId;
      return y(
        "div",
        { key: instanceId, style: { visibility: hiddenInstances[instanceId] ? "hidden" : "" } },
        y(TimeColEvent, Object.assign({ seg, isDragging: false, isResizing: false, isDateSelecting: false, isSelected: instanceId === eventSelection, isShort: false }, getSegMeta(seg, todayRange, nowDate)))
      );
    }));
  }
  function computeSegVStyle(segVCoords) {
    if (!segVCoords) {
      return { top: "", bottom: "" };
    }
    return {
      top: segVCoords.start,
      bottom: -segVCoords.end
    };
  }
  function compileSegsFromEntries(segEntries, allSegs) {
    return segEntries.map((segEntry) => allSegs[segEntry.index]);
  }
  var TimeColsContent = class extends BaseComponent {
    constructor() {
      super(...arguments);
      this.splitFgEventSegs = memoize(splitSegsByCol);
      this.splitBgEventSegs = memoize(splitSegsByCol);
      this.splitBusinessHourSegs = memoize(splitSegsByCol);
      this.splitNowIndicatorSegs = memoize(splitSegsByCol);
      this.splitDateSelectionSegs = memoize(splitSegsByCol);
      this.splitEventDrag = memoize(splitInteractionByCol);
      this.splitEventResize = memoize(splitInteractionByCol);
      this.rootElRef = d();
      this.cellElRefs = new RefMap();
    }
    render() {
      let { props, context } = this;
      let nowIndicatorTop = context.options.nowIndicator && props.slatCoords && props.slatCoords.safeComputeTop(props.nowDate);
      let colCnt = props.cells.length;
      let fgEventSegsByRow = this.splitFgEventSegs(props.fgEventSegs, colCnt);
      let bgEventSegsByRow = this.splitBgEventSegs(props.bgEventSegs, colCnt);
      let businessHourSegsByRow = this.splitBusinessHourSegs(props.businessHourSegs, colCnt);
      let nowIndicatorSegsByRow = this.splitNowIndicatorSegs(props.nowIndicatorSegs, colCnt);
      let dateSelectionSegsByRow = this.splitDateSelectionSegs(props.dateSelectionSegs, colCnt);
      let eventDragByRow = this.splitEventDrag(props.eventDrag, colCnt);
      let eventResizeByRow = this.splitEventResize(props.eventResize, colCnt);
      return y(
        "div",
        { className: "fc-timegrid-cols", ref: this.rootElRef },
        y(
          "table",
          { role: "presentation", style: {
            minWidth: props.tableMinWidth,
            width: props.clientWidth
          } },
          props.tableColGroupNode,
          y(
            "tbody",
            { role: "presentation" },
            y(
              "tr",
              { role: "row" },
              props.axis && y(
                "td",
                { "aria-hidden": true, className: "fc-timegrid-col fc-timegrid-axis" },
                y(
                  "div",
                  { className: "fc-timegrid-col-frame" },
                  y("div", { className: "fc-timegrid-now-indicator-container" }, typeof nowIndicatorTop === "number" && y(NowIndicatorContainer, { elClasses: ["fc-timegrid-now-indicator-arrow"], elStyle: { top: nowIndicatorTop }, isAxis: true, date: props.nowDate }))
                )
              ),
              props.cells.map((cell, i3) => y(TimeCol, { key: cell.key, elRef: this.cellElRefs.createRef(cell.key), dateProfile: props.dateProfile, date: cell.date, nowDate: props.nowDate, todayRange: props.todayRange, extraRenderProps: cell.extraRenderProps, extraDataAttrs: cell.extraDataAttrs, extraClassNames: cell.extraClassNames, extraDateSpan: cell.extraDateSpan, fgEventSegs: fgEventSegsByRow[i3], bgEventSegs: bgEventSegsByRow[i3], businessHourSegs: businessHourSegsByRow[i3], nowIndicatorSegs: nowIndicatorSegsByRow[i3], dateSelectionSegs: dateSelectionSegsByRow[i3], eventDrag: eventDragByRow[i3], eventResize: eventResizeByRow[i3], slatCoords: props.slatCoords, eventSelection: props.eventSelection, forPrint: props.forPrint }))
            )
          )
        )
      );
    }
    componentDidMount() {
      this.updateCoords();
    }
    componentDidUpdate() {
      this.updateCoords();
    }
    updateCoords() {
      let { props } = this;
      if (props.onColCoords && props.clientWidth !== null) {
        props.onColCoords(new PositionCache(
          this.rootElRef.current,
          collectCellEls(this.cellElRefs.currentMap, props.cells),
          true,
          // horizontal
          false
        ));
      }
    }
  };
  function collectCellEls(elMap, cells) {
    return cells.map((cell) => elMap[cell.key]);
  }
  var TimeCols = class extends DateComponent {
    constructor() {
      super(...arguments);
      this.processSlotOptions = memoize(processSlotOptions);
      this.state = {
        slatCoords: null
      };
      this.handleRootEl = (el) => {
        if (el) {
          this.context.registerInteractiveComponent(this, {
            el,
            isHitComboAllowed: this.props.isHitComboAllowed
          });
        } else {
          this.context.unregisterInteractiveComponent(this);
        }
      };
      this.handleScrollRequest = (request) => {
        let { onScrollTopRequest } = this.props;
        let { slatCoords } = this.state;
        if (onScrollTopRequest && slatCoords) {
          if (request.time) {
            let top = slatCoords.computeTimeTop(request.time);
            top = Math.ceil(top);
            if (top) {
              top += 1;
            }
            onScrollTopRequest(top);
          }
          return true;
        }
        return false;
      };
      this.handleColCoords = (colCoords) => {
        this.colCoords = colCoords;
      };
      this.handleSlatCoords = (slatCoords) => {
        this.setState({ slatCoords });
        if (this.props.onSlatCoords) {
          this.props.onSlatCoords(slatCoords);
        }
      };
    }
    render() {
      let { props, state } = this;
      return y(
        "div",
        { className: "fc-timegrid-body", ref: this.handleRootEl, style: {
          // these props are important to give this wrapper correct dimensions for interactions
          // TODO: if we set it here, can we avoid giving to inner tables?
          width: props.clientWidth,
          minWidth: props.tableMinWidth
        } },
        y(TimeColsSlats, { axis: props.axis, dateProfile: props.dateProfile, slatMetas: props.slatMetas, clientWidth: props.clientWidth, minHeight: props.expandRows ? props.clientHeight : "", tableMinWidth: props.tableMinWidth, tableColGroupNode: props.axis ? props.tableColGroupNode : null, onCoords: this.handleSlatCoords }),
        y(TimeColsContent, { cells: props.cells, axis: props.axis, dateProfile: props.dateProfile, businessHourSegs: props.businessHourSegs, bgEventSegs: props.bgEventSegs, fgEventSegs: props.fgEventSegs, dateSelectionSegs: props.dateSelectionSegs, eventSelection: props.eventSelection, eventDrag: props.eventDrag, eventResize: props.eventResize, todayRange: props.todayRange, nowDate: props.nowDate, nowIndicatorSegs: props.nowIndicatorSegs, clientWidth: props.clientWidth, tableMinWidth: props.tableMinWidth, tableColGroupNode: props.tableColGroupNode, slatCoords: state.slatCoords, onColCoords: this.handleColCoords, forPrint: props.forPrint })
      );
    }
    componentDidMount() {
      this.scrollResponder = this.context.createScrollResponder(this.handleScrollRequest);
    }
    componentDidUpdate(prevProps) {
      this.scrollResponder.update(prevProps.dateProfile !== this.props.dateProfile);
    }
    componentWillUnmount() {
      this.scrollResponder.detach();
    }
    queryHit(positionLeft, positionTop) {
      let { dateEnv, options } = this.context;
      let { colCoords } = this;
      let { dateProfile } = this.props;
      let { slatCoords } = this.state;
      let { snapDuration, snapsPerSlot } = this.processSlotOptions(this.props.slotDuration, options.snapDuration);
      let colIndex = colCoords.leftToIndex(positionLeft);
      let slatIndex = slatCoords.positions.topToIndex(positionTop);
      if (colIndex != null && slatIndex != null) {
        let cell = this.props.cells[colIndex];
        let slatTop = slatCoords.positions.tops[slatIndex];
        let slatHeight = slatCoords.positions.getHeight(slatIndex);
        let partial = (positionTop - slatTop) / slatHeight;
        let localSnapIndex = Math.floor(partial * snapsPerSlot);
        let snapIndex = slatIndex * snapsPerSlot + localSnapIndex;
        let dayDate = this.props.cells[colIndex].date;
        let time = addDurations(dateProfile.slotMinTime, multiplyDuration(snapDuration, snapIndex));
        let start = dateEnv.add(dayDate, time);
        let end = dateEnv.add(start, snapDuration);
        return {
          dateProfile,
          dateSpan: Object.assign({ range: { start, end }, allDay: false }, cell.extraDateSpan),
          dayEl: colCoords.els[colIndex],
          rect: {
            left: colCoords.lefts[colIndex],
            right: colCoords.rights[colIndex],
            top: slatTop,
            bottom: slatTop + slatHeight
          },
          layer: 0
        };
      }
      return null;
    }
  };
  function processSlotOptions(slotDuration, snapDurationOverride) {
    let snapDuration = snapDurationOverride || slotDuration;
    let snapsPerSlot = wholeDivideDurations(slotDuration, snapDuration);
    if (snapsPerSlot === null) {
      snapDuration = slotDuration;
      snapsPerSlot = 1;
    }
    return { snapDuration, snapsPerSlot };
  }
  var DayTimeColsSlicer = class extends Slicer {
    sliceRange(range2, dayRanges) {
      let segs = [];
      for (let col = 0; col < dayRanges.length; col += 1) {
        let segRange = intersectRanges(range2, dayRanges[col]);
        if (segRange) {
          segs.push({
            start: segRange.start,
            end: segRange.end,
            isStart: segRange.start.valueOf() === range2.start.valueOf(),
            isEnd: segRange.end.valueOf() === range2.end.valueOf(),
            col
          });
        }
      }
      return segs;
    }
  };
  var DayTimeCols = class extends DateComponent {
    constructor() {
      super(...arguments);
      this.buildDayRanges = memoize(buildDayRanges);
      this.slicer = new DayTimeColsSlicer();
      this.timeColsRef = d();
    }
    render() {
      let { props, context } = this;
      let { dateProfile, dayTableModel } = props;
      let { nowIndicator, nextDayThreshold } = context.options;
      let dayRanges = this.buildDayRanges(dayTableModel, dateProfile, context.dateEnv);
      return y(NowTimer, { unit: nowIndicator ? "minute" : "day" }, (nowDate, todayRange) => y(TimeCols, Object.assign({ ref: this.timeColsRef }, this.slicer.sliceProps(props, dateProfile, null, context, dayRanges), { forPrint: props.forPrint, axis: props.axis, dateProfile, slatMetas: props.slatMetas, slotDuration: props.slotDuration, cells: dayTableModel.cells[0], tableColGroupNode: props.tableColGroupNode, tableMinWidth: props.tableMinWidth, clientWidth: props.clientWidth, clientHeight: props.clientHeight, expandRows: props.expandRows, nowDate, nowIndicatorSegs: nowIndicator && this.slicer.sliceNowDate(nowDate, dateProfile, nextDayThreshold, context, dayRanges), todayRange, onScrollTopRequest: props.onScrollTopRequest, onSlatCoords: props.onSlatCoords })));
    }
  };
  function buildDayRanges(dayTableModel, dateProfile, dateEnv) {
    let ranges = [];
    for (let date of dayTableModel.headerDates) {
      ranges.push({
        start: dateEnv.add(date, dateProfile.slotMinTime),
        end: dateEnv.add(date, dateProfile.slotMaxTime)
      });
    }
    return ranges;
  }
  var STOCK_SUB_DURATIONS = [
    { hours: 1 },
    { minutes: 30 },
    { minutes: 15 },
    { seconds: 30 },
    { seconds: 15 }
  ];
  function buildSlatMetas(slotMinTime, slotMaxTime, explicitLabelInterval, slotDuration, dateEnv) {
    let dayStart = /* @__PURE__ */ new Date(0);
    let slatTime = slotMinTime;
    let slatIterator = createDuration(0);
    let labelInterval = explicitLabelInterval || computeLabelInterval(slotDuration);
    let metas = [];
    while (asRoughMs(slatTime) < asRoughMs(slotMaxTime)) {
      let date = dateEnv.add(dayStart, slatTime);
      let isLabeled = wholeDivideDurations(slatIterator, labelInterval) !== null;
      metas.push({
        date,
        time: slatTime,
        key: date.toISOString(),
        isoTimeStr: formatIsoTimeString(date),
        isLabeled
      });
      slatTime = addDurations(slatTime, slotDuration);
      slatIterator = addDurations(slatIterator, slotDuration);
    }
    return metas;
  }
  function computeLabelInterval(slotDuration) {
    let i3;
    let labelInterval;
    let slotsPerLabel;
    for (i3 = STOCK_SUB_DURATIONS.length - 1; i3 >= 0; i3 -= 1) {
      labelInterval = createDuration(STOCK_SUB_DURATIONS[i3]);
      slotsPerLabel = wholeDivideDurations(labelInterval, slotDuration);
      if (slotsPerLabel !== null && slotsPerLabel > 1) {
        return labelInterval;
      }
    }
    return slotDuration;
  }
  var DayTimeColsView = class extends TimeColsView {
    constructor() {
      super(...arguments);
      this.buildTimeColsModel = memoize(buildTimeColsModel);
      this.buildSlatMetas = memoize(buildSlatMetas);
    }
    render() {
      let { options, dateEnv, dateProfileGenerator } = this.context;
      let { props } = this;
      let { dateProfile } = props;
      let dayTableModel = this.buildTimeColsModel(dateProfile, dateProfileGenerator);
      let splitProps = this.allDaySplitter.splitProps(props);
      let slatMetas = this.buildSlatMetas(dateProfile.slotMinTime, dateProfile.slotMaxTime, options.slotLabelInterval, options.slotDuration, dateEnv);
      let { dayMinWidth } = options;
      let hasAttachedAxis = !dayMinWidth;
      let hasDetachedAxis = dayMinWidth;
      let headerContent = options.dayHeaders && y(DayHeader, { dates: dayTableModel.headerDates, dateProfile, datesRepDistinctDays: true, renderIntro: hasAttachedAxis ? this.renderHeadAxis : null });
      let allDayContent = options.allDaySlot !== false && ((contentArg) => y(DayTable, Object.assign({}, splitProps.allDay, { dateProfile, dayTableModel, nextDayThreshold: options.nextDayThreshold, tableMinWidth: contentArg.tableMinWidth, colGroupNode: contentArg.tableColGroupNode, renderRowIntro: hasAttachedAxis ? this.renderTableRowAxis : null, showWeekNumbers: false, expandRows: false, headerAlignElRef: this.headerElRef, clientWidth: contentArg.clientWidth, clientHeight: contentArg.clientHeight, forPrint: props.forPrint }, this.getAllDayMaxEventProps())));
      let timeGridContent = (contentArg) => y(DayTimeCols, Object.assign({}, splitProps.timed, { dayTableModel, dateProfile, axis: hasAttachedAxis, slotDuration: options.slotDuration, slatMetas, forPrint: props.forPrint, tableColGroupNode: contentArg.tableColGroupNode, tableMinWidth: contentArg.tableMinWidth, clientWidth: contentArg.clientWidth, clientHeight: contentArg.clientHeight, onSlatCoords: this.handleSlatCoords, expandRows: contentArg.expandRows, onScrollTopRequest: this.handleScrollTopRequest }));
      return hasDetachedAxis ? this.renderHScrollLayout(headerContent, allDayContent, timeGridContent, dayTableModel.colCnt, dayMinWidth, slatMetas, this.state.slatCoords) : this.renderSimpleLayout(headerContent, allDayContent, timeGridContent);
    }
  };
  function buildTimeColsModel(dateProfile, dateProfileGenerator) {
    let daySeries = new DaySeriesModel(dateProfile.renderRange, dateProfileGenerator);
    return new DayTableModel(daySeries, false);
  }
  var css_248z3 = '.fc-v-event{background-color:var(--fc-event-bg-color);border:1px solid var(--fc-event-border-color);display:block}.fc-v-event .fc-event-main{color:var(--fc-event-text-color);height:100%}.fc-v-event .fc-event-main-frame{display:flex;flex-direction:column;height:100%}.fc-v-event .fc-event-time{flex-grow:0;flex-shrink:0;max-height:100%;overflow:hidden}.fc-v-event .fc-event-title-container{flex-grow:1;flex-shrink:1;min-height:0}.fc-v-event .fc-event-title{bottom:0;max-height:100%;overflow:hidden;top:0}.fc-v-event:not(.fc-event-start){border-top-left-radius:0;border-top-right-radius:0;border-top-width:0}.fc-v-event:not(.fc-event-end){border-bottom-left-radius:0;border-bottom-right-radius:0;border-bottom-width:0}.fc-v-event.fc-event-selected:before{left:-10px;right:-10px}.fc-v-event .fc-event-resizer-start{cursor:n-resize}.fc-v-event .fc-event-resizer-end{cursor:s-resize}.fc-v-event:not(.fc-event-selected) .fc-event-resizer{height:var(--fc-event-resizer-thickness);left:0;right:0}.fc-v-event:not(.fc-event-selected) .fc-event-resizer-start{top:calc(var(--fc-event-resizer-thickness)/-2)}.fc-v-event:not(.fc-event-selected) .fc-event-resizer-end{bottom:calc(var(--fc-event-resizer-thickness)/-2)}.fc-v-event.fc-event-selected .fc-event-resizer{left:50%;margin-left:calc(var(--fc-event-resizer-dot-total-width)/-2)}.fc-v-event.fc-event-selected .fc-event-resizer-start{top:calc(var(--fc-event-resizer-dot-total-width)/-2)}.fc-v-event.fc-event-selected .fc-event-resizer-end{bottom:calc(var(--fc-event-resizer-dot-total-width)/-2)}.fc .fc-timegrid .fc-daygrid-body{z-index:2}.fc .fc-timegrid-divider{padding:0 0 2px}.fc .fc-timegrid-body{min-height:100%;position:relative;z-index:1}.fc .fc-timegrid-axis-chunk{position:relative}.fc .fc-timegrid-axis-chunk>table,.fc .fc-timegrid-slots{position:relative;z-index:1}.fc .fc-timegrid-slot{border-bottom:0;height:1.5em}.fc .fc-timegrid-slot:empty:before{content:"\\00a0"}.fc .fc-timegrid-slot-minor{border-top-style:dotted}.fc .fc-timegrid-slot-label-cushion{display:inline-block;white-space:nowrap}.fc .fc-timegrid-slot-label{vertical-align:middle}.fc .fc-timegrid-axis-cushion,.fc .fc-timegrid-slot-label-cushion{padding:0 4px}.fc .fc-timegrid-axis-frame-liquid{height:100%}.fc .fc-timegrid-axis-frame{align-items:center;display:flex;justify-content:flex-end;overflow:hidden}.fc .fc-timegrid-axis-cushion{flex-shrink:0;max-width:60px}.fc-direction-ltr .fc-timegrid-slot-label-frame{text-align:right}.fc-direction-rtl .fc-timegrid-slot-label-frame{text-align:left}.fc-liquid-hack .fc-timegrid-axis-frame-liquid{bottom:0;height:auto;left:0;position:absolute;right:0;top:0}.fc .fc-timegrid-col.fc-day-today{background-color:var(--fc-today-bg-color)}.fc .fc-timegrid-col-frame{min-height:100%;position:relative}.fc-media-screen.fc-liquid-hack .fc-timegrid-col-frame{bottom:0;height:auto;left:0;position:absolute;right:0;top:0}.fc-media-screen .fc-timegrid-cols{bottom:0;left:0;position:absolute;right:0;top:0}.fc-media-screen .fc-timegrid-cols>table{height:100%}.fc-media-screen .fc-timegrid-col-bg,.fc-media-screen .fc-timegrid-col-events,.fc-media-screen .fc-timegrid-now-indicator-container{left:0;position:absolute;right:0;top:0}.fc .fc-timegrid-col-bg{z-index:2}.fc .fc-timegrid-col-bg .fc-non-business{z-index:1}.fc .fc-timegrid-col-bg .fc-bg-event{z-index:2}.fc .fc-timegrid-col-bg .fc-highlight{z-index:3}.fc .fc-timegrid-bg-harness{left:0;position:absolute;right:0}.fc .fc-timegrid-col-events{z-index:3}.fc .fc-timegrid-now-indicator-container{bottom:0;overflow:hidden}.fc-direction-ltr .fc-timegrid-col-events{margin:0 2.5% 0 2px}.fc-direction-rtl .fc-timegrid-col-events{margin:0 2px 0 2.5%}.fc-timegrid-event-harness{position:absolute}.fc-timegrid-event-harness>.fc-timegrid-event{bottom:0;left:0;position:absolute;right:0;top:0}.fc-timegrid-event-harness-inset .fc-timegrid-event,.fc-timegrid-event.fc-event-mirror,.fc-timegrid-more-link{box-shadow:0 0 0 1px var(--fc-page-bg-color)}.fc-timegrid-event,.fc-timegrid-more-link{border-radius:3px;font-size:var(--fc-small-font-size)}.fc-timegrid-event{margin-bottom:1px}.fc-timegrid-event .fc-event-main{padding:1px 1px 0}.fc-timegrid-event .fc-event-time{font-size:var(--fc-small-font-size);margin-bottom:1px;white-space:nowrap}.fc-timegrid-event-short .fc-event-main-frame{flex-direction:row;overflow:hidden}.fc-timegrid-event-short .fc-event-time:after{content:"\\00a0-\\00a0"}.fc-timegrid-event-short .fc-event-title{font-size:var(--fc-small-font-size)}.fc-timegrid-more-link{background:var(--fc-more-link-bg-color);color:var(--fc-more-link-text-color);cursor:pointer;margin-bottom:1px;position:absolute;z-index:9999}.fc-timegrid-more-link-inner{padding:3px 2px;top:0}.fc-direction-ltr .fc-timegrid-more-link{right:0}.fc-direction-rtl .fc-timegrid-more-link{left:0}.fc .fc-timegrid-now-indicator-arrow,.fc .fc-timegrid-now-indicator-line{pointer-events:none}.fc .fc-timegrid-now-indicator-line{border-color:var(--fc-now-indicator-color);border-style:solid;border-width:1px 0 0;left:0;position:absolute;right:0;z-index:4}.fc .fc-timegrid-now-indicator-arrow{border-color:var(--fc-now-indicator-color);border-style:solid;margin-top:-5px;position:absolute;z-index:4}.fc-direction-ltr .fc-timegrid-now-indicator-arrow{border-bottom-color:transparent;border-top-color:transparent;border-width:5px 0 5px 6px;left:0}.fc-direction-rtl .fc-timegrid-now-indicator-arrow{border-bottom-color:transparent;border-top-color:transparent;border-width:5px 6px 5px 0;right:0}';
  injectStyles(css_248z3);

  // node_modules/@fullcalendar/timegrid/index.js
  var OPTION_REFINERS = {
    allDaySlot: Boolean
  };
  var index2 = createPlugin({
    name: "@fullcalendar/timegrid",
    initialView: "timeGridWeek",
    optionRefiners: OPTION_REFINERS,
    views: {
      timeGrid: {
        component: DayTimeColsView,
        usesMinMaxTime: true,
        allDaySlot: true,
        slotDuration: "00:30:00",
        slotEventOverlap: true
        // a bad name. confused with overlap/constraint system
      },
      timeGridDay: {
        type: "timeGrid",
        duration: { days: 1 }
      },
      timeGridWeek: {
        type: "timeGrid",
        duration: { weeks: 1 }
      }
    }
  });

  // node_modules/@fullcalendar/list/internal.js
  var ListViewHeaderRow = class extends BaseComponent {
    constructor() {
      super(...arguments);
      this.state = {
        textId: getUniqueDomId()
      };
    }
    render() {
      let { theme, dateEnv, options, viewApi } = this.context;
      let { cellId, dayDate, todayRange } = this.props;
      let { textId } = this.state;
      let dayMeta = getDateMeta(dayDate, todayRange);
      let text = options.listDayFormat ? dateEnv.format(dayDate, options.listDayFormat) : "";
      let sideText = options.listDaySideFormat ? dateEnv.format(dayDate, options.listDaySideFormat) : "";
      let renderProps = Object.assign({
        date: dateEnv.toDate(dayDate),
        view: viewApi,
        textId,
        text,
        sideText,
        navLinkAttrs: buildNavLinkAttrs(this.context, dayDate),
        sideNavLinkAttrs: buildNavLinkAttrs(this.context, dayDate, "day", false)
      }, dayMeta);
      return y(ContentContainer, { elTag: "tr", elClasses: [
        "fc-list-day",
        ...getDayClassNames(dayMeta, theme)
      ], elAttrs: {
        "data-date": formatDayString(dayDate)
      }, renderProps, generatorName: "dayHeaderContent", customGenerator: options.dayHeaderContent, defaultGenerator: renderInnerContent4, classNameGenerator: options.dayHeaderClassNames, didMount: options.dayHeaderDidMount, willUnmount: options.dayHeaderWillUnmount }, (InnerContent) => (
        // TODO: force-hide top border based on :first-child
        y(
          "th",
          { scope: "colgroup", colSpan: 3, id: cellId, "aria-labelledby": textId },
          y(InnerContent, { elTag: "div", elClasses: [
            "fc-list-day-cushion",
            theme.getClass("tableCellShaded")
          ] })
        )
      ));
    }
  };
  function renderInnerContent4(props) {
    return y(
      _,
      null,
      props.text && y("a", Object.assign({ id: props.textId, className: "fc-list-day-text" }, props.navLinkAttrs), props.text),
      props.sideText && /* not keyboard tabbable */
      y("a", Object.assign({ "aria-hidden": true, className: "fc-list-day-side-text" }, props.sideNavLinkAttrs), props.sideText)
    );
  }
  var DEFAULT_TIME_FORMAT2 = createFormatter({
    hour: "numeric",
    minute: "2-digit",
    meridiem: "short"
  });
  var ListViewEventRow = class extends BaseComponent {
    render() {
      let { props, context } = this;
      let { options } = context;
      let { seg, timeHeaderId, eventHeaderId, dateHeaderId } = props;
      let timeFormat = options.eventTimeFormat || DEFAULT_TIME_FORMAT2;
      return y(EventContainer, Object.assign({}, props, { elTag: "tr", elClasses: [
        "fc-list-event",
        seg.eventRange.def.url && "fc-event-forced-url"
      ], defaultGenerator: () => renderEventInnerContent(seg, context), seg, timeText: "", disableDragging: true, disableResizing: true }), (InnerContent, eventContentArg) => y(
        _,
        null,
        buildTimeContent(seg, timeFormat, context, timeHeaderId, dateHeaderId),
        y(
          "td",
          { "aria-hidden": true, className: "fc-list-event-graphic" },
          y("span", { className: "fc-list-event-dot", style: {
            borderColor: eventContentArg.borderColor || eventContentArg.backgroundColor
          } })
        ),
        y(InnerContent, { elTag: "td", elClasses: ["fc-list-event-title"], elAttrs: { headers: `${eventHeaderId} ${dateHeaderId}` } })
      ));
    }
  };
  function renderEventInnerContent(seg, context) {
    let interactiveAttrs = getSegAnchorAttrs(seg, context);
    return y("a", Object.assign({}, interactiveAttrs), seg.eventRange.def.title);
  }
  function buildTimeContent(seg, timeFormat, context, timeHeaderId, dateHeaderId) {
    let { options } = context;
    if (options.displayEventTime !== false) {
      let eventDef = seg.eventRange.def;
      let eventInstance = seg.eventRange.instance;
      let doAllDay = false;
      let timeText;
      if (eventDef.allDay) {
        doAllDay = true;
      } else if (isMultiDayRange(seg.eventRange.range)) {
        if (seg.isStart) {
          timeText = buildSegTimeText(seg, timeFormat, context, null, null, eventInstance.range.start, seg.end);
        } else if (seg.isEnd) {
          timeText = buildSegTimeText(seg, timeFormat, context, null, null, seg.start, eventInstance.range.end);
        } else {
          doAllDay = true;
        }
      } else {
        timeText = buildSegTimeText(seg, timeFormat, context);
      }
      if (doAllDay) {
        let renderProps = {
          text: context.options.allDayText,
          view: context.viewApi
        };
        return y(ContentContainer, { elTag: "td", elClasses: ["fc-list-event-time"], elAttrs: {
          headers: `${timeHeaderId} ${dateHeaderId}`
        }, renderProps, generatorName: "allDayContent", customGenerator: options.allDayContent, defaultGenerator: renderAllDayInner2, classNameGenerator: options.allDayClassNames, didMount: options.allDayDidMount, willUnmount: options.allDayWillUnmount });
      }
      return y("td", { className: "fc-list-event-time" }, timeText);
    }
    return null;
  }
  function renderAllDayInner2(renderProps) {
    return renderProps.text;
  }
  var ListView = class extends DateComponent {
    constructor() {
      super(...arguments);
      this.computeDateVars = memoize(computeDateVars);
      this.eventStoreToSegs = memoize(this._eventStoreToSegs);
      this.state = {
        timeHeaderId: getUniqueDomId(),
        eventHeaderId: getUniqueDomId(),
        dateHeaderIdRoot: getUniqueDomId()
      };
      this.setRootEl = (rootEl) => {
        if (rootEl) {
          this.context.registerInteractiveComponent(this, {
            el: rootEl
          });
        } else {
          this.context.unregisterInteractiveComponent(this);
        }
      };
    }
    render() {
      let { props, context } = this;
      let { dayDates, dayRanges } = this.computeDateVars(props.dateProfile);
      let eventSegs = this.eventStoreToSegs(props.eventStore, props.eventUiBases, dayRanges);
      return y(
        ViewContainer,
        { elRef: this.setRootEl, elClasses: [
          "fc-list",
          context.theme.getClass("table"),
          context.options.stickyHeaderDates !== false ? "fc-list-sticky" : ""
        ], viewSpec: context.viewSpec },
        y(Scroller, { liquid: !props.isHeightAuto, overflowX: props.isHeightAuto ? "visible" : "hidden", overflowY: props.isHeightAuto ? "visible" : "auto" }, eventSegs.length > 0 ? this.renderSegList(eventSegs, dayDates) : this.renderEmptyMessage())
      );
    }
    renderEmptyMessage() {
      let { options, viewApi } = this.context;
      let renderProps = {
        text: options.noEventsText,
        view: viewApi
      };
      return y(ContentContainer, { elTag: "div", elClasses: ["fc-list-empty"], renderProps, generatorName: "noEventsContent", customGenerator: options.noEventsContent, defaultGenerator: renderNoEventsInner, classNameGenerator: options.noEventsClassNames, didMount: options.noEventsDidMount, willUnmount: options.noEventsWillUnmount }, (InnerContent) => y(InnerContent, { elTag: "div", elClasses: ["fc-list-empty-cushion"] }));
    }
    renderSegList(allSegs, dayDates) {
      let { theme, options } = this.context;
      let { timeHeaderId, eventHeaderId, dateHeaderIdRoot } = this.state;
      let segsByDay = groupSegsByDay(allSegs);
      return y(NowTimer, { unit: "day" }, (nowDate, todayRange) => {
        let innerNodes = [];
        for (let dayIndex = 0; dayIndex < segsByDay.length; dayIndex += 1) {
          let daySegs = segsByDay[dayIndex];
          if (daySegs) {
            let dayStr = formatDayString(dayDates[dayIndex]);
            let dateHeaderId = dateHeaderIdRoot + "-" + dayStr;
            innerNodes.push(y(ListViewHeaderRow, { key: dayStr, cellId: dateHeaderId, dayDate: dayDates[dayIndex], todayRange }));
            daySegs = sortEventSegs(daySegs, options.eventOrder);
            for (let seg of daySegs) {
              innerNodes.push(y(ListViewEventRow, Object.assign({ key: dayStr + ":" + seg.eventRange.instance.instanceId, seg, isDragging: false, isResizing: false, isDateSelecting: false, isSelected: false, timeHeaderId, eventHeaderId, dateHeaderId }, getSegMeta(seg, todayRange, nowDate))));
            }
          }
        }
        return y(
          "table",
          { className: "fc-list-table " + theme.getClass("table") },
          y(
            "thead",
            null,
            y(
              "tr",
              null,
              y("th", { scope: "col", id: timeHeaderId }, options.timeHint),
              y("th", { scope: "col", "aria-hidden": true }),
              y("th", { scope: "col", id: eventHeaderId }, options.eventHint)
            )
          ),
          y("tbody", null, innerNodes)
        );
      });
    }
    _eventStoreToSegs(eventStore, eventUiBases, dayRanges) {
      return this.eventRangesToSegs(sliceEventStore(eventStore, eventUiBases, this.props.dateProfile.activeRange, this.context.options.nextDayThreshold).fg, dayRanges);
    }
    eventRangesToSegs(eventRanges, dayRanges) {
      let segs = [];
      for (let eventRange of eventRanges) {
        segs.push(...this.eventRangeToSegs(eventRange, dayRanges));
      }
      return segs;
    }
    eventRangeToSegs(eventRange, dayRanges) {
      let { dateEnv } = this.context;
      let { nextDayThreshold } = this.context.options;
      let range2 = eventRange.range;
      let allDay = eventRange.def.allDay;
      let dayIndex;
      let segRange;
      let seg;
      let segs = [];
      for (dayIndex = 0; dayIndex < dayRanges.length; dayIndex += 1) {
        segRange = intersectRanges(range2, dayRanges[dayIndex]);
        if (segRange) {
          seg = {
            component: this,
            eventRange,
            start: segRange.start,
            end: segRange.end,
            isStart: eventRange.isStart && segRange.start.valueOf() === range2.start.valueOf(),
            isEnd: eventRange.isEnd && segRange.end.valueOf() === range2.end.valueOf(),
            dayIndex
          };
          segs.push(seg);
          if (!seg.isEnd && !allDay && dayIndex + 1 < dayRanges.length && range2.end < dateEnv.add(dayRanges[dayIndex + 1].start, nextDayThreshold)) {
            seg.end = range2.end;
            seg.isEnd = true;
            break;
          }
        }
      }
      return segs;
    }
  };
  function renderNoEventsInner(renderProps) {
    return renderProps.text;
  }
  function computeDateVars(dateProfile) {
    let dayStart = startOfDay(dateProfile.renderRange.start);
    let viewEnd = dateProfile.renderRange.end;
    let dayDates = [];
    let dayRanges = [];
    while (dayStart < viewEnd) {
      dayDates.push(dayStart);
      dayRanges.push({
        start: dayStart,
        end: addDays(dayStart, 1)
      });
      dayStart = addDays(dayStart, 1);
    }
    return { dayDates, dayRanges };
  }
  function groupSegsByDay(segs) {
    let segsByDay = [];
    let i3;
    let seg;
    for (i3 = 0; i3 < segs.length; i3 += 1) {
      seg = segs[i3];
      (segsByDay[seg.dayIndex] || (segsByDay[seg.dayIndex] = [])).push(seg);
    }
    return segsByDay;
  }
  var css_248z4 = ':root{--fc-list-event-dot-width:10px;--fc-list-event-hover-bg-color:#f5f5f5}.fc-theme-standard .fc-list{border:1px solid var(--fc-border-color)}.fc .fc-list-empty{align-items:center;background-color:var(--fc-neutral-bg-color);display:flex;height:100%;justify-content:center}.fc .fc-list-empty-cushion{margin:5em 0}.fc .fc-list-table{border-style:hidden;width:100%}.fc .fc-list-table tr>*{border-left:0;border-right:0}.fc .fc-list-sticky .fc-list-day>*{background:var(--fc-page-bg-color);position:sticky;top:0}.fc .fc-list-table thead{left:-10000px;position:absolute}.fc .fc-list-table tbody>tr:first-child th{border-top:0}.fc .fc-list-table th{padding:0}.fc .fc-list-day-cushion,.fc .fc-list-table td{padding:8px 14px}.fc .fc-list-day-cushion:after{clear:both;content:"";display:table}.fc-theme-standard .fc-list-day-cushion{background-color:var(--fc-neutral-bg-color)}.fc-direction-ltr .fc-list-day-text,.fc-direction-rtl .fc-list-day-side-text{float:left}.fc-direction-ltr .fc-list-day-side-text,.fc-direction-rtl .fc-list-day-text{float:right}.fc-direction-ltr .fc-list-table .fc-list-event-graphic{padding-right:0}.fc-direction-rtl .fc-list-table .fc-list-event-graphic{padding-left:0}.fc .fc-list-event.fc-event-forced-url{cursor:pointer}.fc .fc-list-event:hover td{background-color:var(--fc-list-event-hover-bg-color)}.fc .fc-list-event-graphic,.fc .fc-list-event-time{white-space:nowrap;width:1px}.fc .fc-list-event-dot{border:calc(var(--fc-list-event-dot-width)/2) solid var(--fc-event-border-color);border-radius:calc(var(--fc-list-event-dot-width)/2);box-sizing:content-box;display:inline-block;height:0;width:0}.fc .fc-list-event-title a{color:inherit;text-decoration:none}.fc .fc-list-event.fc-event-forced-url:hover a{text-decoration:underline}';
  injectStyles(css_248z4);

  // node_modules/@fullcalendar/list/index.js
  var OPTION_REFINERS2 = {
    listDayFormat: createFalsableFormatter,
    listDaySideFormat: createFalsableFormatter,
    noEventsClassNames: identity,
    noEventsContent: identity,
    noEventsDidMount: identity,
    noEventsWillUnmount: identity
    // noEventsText is defined in base options
  };
  function createFalsableFormatter(input) {
    return input === false ? null : createFormatter(input);
  }
  var index3 = createPlugin({
    name: "@fullcalendar/list",
    optionRefiners: OPTION_REFINERS2,
    views: {
      list: {
        component: ListView,
        buttonTextKey: "list",
        listDayFormat: { month: "long", day: "numeric", year: "numeric" }
        // like "January 1, 2016"
      },
      listDay: {
        type: "list",
        duration: { days: 1 },
        listDayFormat: { weekday: "long" }
        // day-of-week is all we need. full date is probably in headerToolbar
      },
      listWeek: {
        type: "list",
        duration: { weeks: 1 },
        listDayFormat: { weekday: "long" },
        listDaySideFormat: { month: "long", day: "numeric", year: "numeric" }
      },
      listMonth: {
        type: "list",
        duration: { month: 1 },
        listDaySideFormat: { weekday: "long" }
        // day-of-week is nice-to-have
      },
      listYear: {
        type: "list",
        duration: { year: 1 },
        listDaySideFormat: { weekday: "long" }
        // day-of-week is nice-to-have
      }
    }
  });

  // node_modules/@fullcalendar/icalendar/index.js
  var ICAL = __toESM(require_ical(), 1);
  var IcalExpander = class {
    constructor(opts) {
      this.maxIterations = opts.maxIterations != null ? opts.maxIterations : 1e3;
      this.skipInvalidDates = opts.skipInvalidDates != null ? opts.skipInvalidDates : false;
      this.jCalData = ICAL.parse(opts.ics);
      this.component = new ICAL.Component(this.jCalData);
      this.events = this.component.getAllSubcomponents("vevent").map((vevent) => new ICAL.Event(vevent));
      if (this.skipInvalidDates) {
        this.events = this.events.filter((evt) => {
          try {
            evt.startDate.toJSDate();
            evt.endDate.toJSDate();
            return true;
          } catch (err) {
            return false;
          }
        });
      }
    }
    between(after, before) {
      function isEventWithinRange(startTime, endTime) {
        return (!after || endTime >= after.getTime()) && (!before || startTime <= before.getTime());
      }
      function getTimes(eventOrOccurrence) {
        const startTime = eventOrOccurrence.startDate.toJSDate().getTime();
        let endTime = eventOrOccurrence.endDate.toJSDate().getTime();
        if (eventOrOccurrence.endDate.isDate && endTime > startTime) {
          endTime -= 1;
        }
        return { startTime, endTime };
      }
      const exceptions = [];
      this.events.forEach((event) => {
        if (event.isRecurrenceException())
          exceptions.push(event);
      });
      const ret = {
        events: [],
        occurrences: []
      };
      this.events.filter((e3) => !e3.isRecurrenceException()).forEach((event) => {
        const exdates = [];
        event.component.getAllProperties("exdate").forEach((exdateProp) => {
          const exdate = exdateProp.getFirstValue();
          exdates.push(exdate.toJSDate().getTime());
        });
        if (event.isRecurring()) {
          const iterator = event.iterator();
          let next;
          let i3 = 0;
          do {
            i3 += 1;
            next = iterator.next();
            if (next) {
              const occurrence = event.getOccurrenceDetails(next);
              const { startTime: startTime2, endTime: endTime2 } = getTimes(occurrence);
              const isOccurrenceExcluded = exdates.indexOf(startTime2) !== -1;
              const exception = exceptions.find((ex) => ex.uid === event.uid && ex.recurrenceId.toJSDate().getTime() === occurrence.startDate.toJSDate().getTime());
              if (before && startTime2 > before.getTime())
                break;
              if (isEventWithinRange(startTime2, endTime2)) {
                if (exception) {
                  ret.events.push(exception);
                } else if (!isOccurrenceExcluded) {
                  ret.occurrences.push(occurrence);
                }
              }
            }
          } while (next && (!this.maxIterations || i3 < this.maxIterations));
          return;
        }
        const { startTime, endTime } = getTimes(event);
        if (isEventWithinRange(startTime, endTime))
          ret.events.push(event);
      });
      return ret;
    }
    before(before) {
      return this.between(void 0, before);
    }
    after(after) {
      return this.between(after);
    }
    all() {
      return this.between();
    }
  };
  var eventSourceDef2 = {
    parseMeta(refined) {
      if (refined.url && refined.format === "ics") {
        return {
          url: refined.url,
          format: "ics"
        };
      }
      return null;
    },
    fetch(arg, successCallback, errorCallback) {
      let meta = arg.eventSource.meta;
      let { internalState } = meta;
      if (!internalState || arg.isRefetch) {
        internalState = meta.internalState = {
          response: null,
          iCalExpanderPromise: fetch(meta.url, { method: "GET" }).then((response) => {
            return response.text().then((icsText) => {
              internalState.response = response;
              return new IcalExpander({
                ics: icsText,
                skipInvalidDates: true
              });
            });
          })
        };
      }
      internalState.iCalExpanderPromise.then((iCalExpander) => {
        successCallback({
          rawEvents: expandICalEvents(iCalExpander, arg.range),
          response: internalState.response
        });
      }, errorCallback);
    }
  };
  function expandICalEvents(iCalExpander, range2) {
    let rangeStart = addDays(range2.start, -1);
    let rangeEnd = addDays(range2.end, 1);
    let iCalRes = iCalExpander.between(rangeStart, rangeEnd);
    let expanded = [];
    for (let iCalEvent of iCalRes.events) {
      expanded.push(Object.assign(Object.assign({}, buildNonDateProps(iCalEvent)), { start: iCalEvent.startDate.toString(), end: specifiesEnd(iCalEvent) && iCalEvent.endDate ? iCalEvent.endDate.toString() : null }));
    }
    for (let iCalOccurence of iCalRes.occurrences) {
      let iCalEvent = iCalOccurence.item;
      expanded.push(Object.assign(Object.assign({}, buildNonDateProps(iCalEvent)), { start: iCalOccurence.startDate.toString(), end: specifiesEnd(iCalEvent) && iCalOccurence.endDate ? iCalOccurence.endDate.toString() : null }));
    }
    return expanded;
  }
  function buildNonDateProps(iCalEvent) {
    return {
      title: iCalEvent.summary,
      url: extractEventUrl(iCalEvent),
      extendedProps: {
        location: iCalEvent.location,
        organizer: iCalEvent.organizer,
        description: iCalEvent.description
      }
    };
  }
  function extractEventUrl(iCalEvent) {
    let urlProp = iCalEvent.component.getFirstProperty("url");
    return urlProp ? urlProp.getFirstValue() : "";
  }
  function specifiesEnd(iCalEvent) {
    return Boolean(iCalEvent.component.getFirstProperty("dtend")) || Boolean(iCalEvent.component.getFirstProperty("duration"));
  }
  var index4 = createPlugin({
    name: "@fullcalendar/icalendar",
    eventSourceDefs: [eventSourceDef2]
  });

  // node_modules/@fullcalendar/core/locales/af.js
  var l0 = {
    code: "af",
    week: {
      dow: 1,
      doy: 4
      // Die week wat die 4de Januarie bevat is die eerste week van die jaar.
    },
    buttonText: {
      prev: "Vorige",
      next: "Volgende",
      today: "Vandag",
      year: "Jaar",
      month: "Maand",
      week: "Week",
      day: "Dag",
      list: "Agenda"
    },
    allDayText: "Heeldag",
    moreLinkText: "Addisionele",
    noEventsText: "Daar is geen gebeurtenisse nie"
  };

  // node_modules/@fullcalendar/core/locales/ar-dz.js
  var l1 = {
    code: "ar-dz",
    week: {
      dow: 0,
      doy: 4
      // The week that contains Jan 1st is the first week of the year.
    },
    direction: "rtl",
    buttonText: {
      prev: "\u0627\u0644\u0633\u0627\u0628\u0642",
      next: "\u0627\u0644\u062A\u0627\u0644\u064A",
      today: "\u0627\u0644\u064A\u0648\u0645",
      year: "\u0633\u0646\u0629",
      month: "\u0634\u0647\u0631",
      week: "\u0623\u0633\u0628\u0648\u0639",
      day: "\u064A\u0648\u0645",
      list: "\u0623\u062C\u0646\u062F\u0629"
    },
    weekText: "\u0623\u0633\u0628\u0648\u0639",
    allDayText: "\u0627\u0644\u064A\u0648\u0645 \u0643\u0644\u0647",
    moreLinkText: "\u0623\u062E\u0631\u0649",
    noEventsText: "\u0623\u064A \u0623\u062D\u062F\u0627\u062B \u0644\u0639\u0631\u0636"
  };

  // node_modules/@fullcalendar/core/locales/ar-kw.js
  var l22 = {
    code: "ar-kw",
    week: {
      dow: 0,
      doy: 12
      // The week that contains Jan 1st is the first week of the year.
    },
    direction: "rtl",
    buttonText: {
      prev: "\u0627\u0644\u0633\u0627\u0628\u0642",
      next: "\u0627\u0644\u062A\u0627\u0644\u064A",
      today: "\u0627\u0644\u064A\u0648\u0645",
      year: "\u0633\u0646\u0629",
      month: "\u0634\u0647\u0631",
      week: "\u0623\u0633\u0628\u0648\u0639",
      day: "\u064A\u0648\u0645",
      list: "\u0623\u062C\u0646\u062F\u0629"
    },
    weekText: "\u0623\u0633\u0628\u0648\u0639",
    allDayText: "\u0627\u0644\u064A\u0648\u0645 \u0643\u0644\u0647",
    moreLinkText: "\u0623\u062E\u0631\u0649",
    noEventsText: "\u0623\u064A \u0623\u062D\u062F\u0627\u062B \u0644\u0639\u0631\u0636"
  };

  // node_modules/@fullcalendar/core/locales/ar-ly.js
  var l3 = {
    code: "ar-ly",
    week: {
      dow: 6,
      doy: 12
      // The week that contains Jan 1st is the first week of the year.
    },
    direction: "rtl",
    buttonText: {
      prev: "\u0627\u0644\u0633\u0627\u0628\u0642",
      next: "\u0627\u0644\u062A\u0627\u0644\u064A",
      today: "\u0627\u0644\u064A\u0648\u0645",
      year: "\u0633\u0646\u0629",
      month: "\u0634\u0647\u0631",
      week: "\u0623\u0633\u0628\u0648\u0639",
      day: "\u064A\u0648\u0645",
      list: "\u0623\u062C\u0646\u062F\u0629"
    },
    weekText: "\u0623\u0633\u0628\u0648\u0639",
    allDayText: "\u0627\u0644\u064A\u0648\u0645 \u0643\u0644\u0647",
    moreLinkText: "\u0623\u062E\u0631\u0649",
    noEventsText: "\u0623\u064A \u0623\u062D\u062F\u0627\u062B \u0644\u0639\u0631\u0636"
  };

  // node_modules/@fullcalendar/core/locales/ar-ma.js
  var l4 = {
    code: "ar-ma",
    week: {
      dow: 6,
      doy: 12
      // The week that contains Jan 1st is the first week of the year.
    },
    direction: "rtl",
    buttonText: {
      prev: "\u0627\u0644\u0633\u0627\u0628\u0642",
      next: "\u0627\u0644\u062A\u0627\u0644\u064A",
      today: "\u0627\u0644\u064A\u0648\u0645",
      year: "\u0633\u0646\u0629",
      month: "\u0634\u0647\u0631",
      week: "\u0623\u0633\u0628\u0648\u0639",
      day: "\u064A\u0648\u0645",
      list: "\u0623\u062C\u0646\u062F\u0629"
    },
    weekText: "\u0623\u0633\u0628\u0648\u0639",
    allDayText: "\u0627\u0644\u064A\u0648\u0645 \u0643\u0644\u0647",
    moreLinkText: "\u0623\u062E\u0631\u0649",
    noEventsText: "\u0623\u064A \u0623\u062D\u062F\u0627\u062B \u0644\u0639\u0631\u0636"
  };

  // node_modules/@fullcalendar/core/locales/ar-sa.js
  var l5 = {
    code: "ar-sa",
    week: {
      dow: 0,
      doy: 6
      // The week that contains Jan 1st is the first week of the year.
    },
    direction: "rtl",
    buttonText: {
      prev: "\u0627\u0644\u0633\u0627\u0628\u0642",
      next: "\u0627\u0644\u062A\u0627\u0644\u064A",
      today: "\u0627\u0644\u064A\u0648\u0645",
      year: "\u0633\u0646\u0629",
      month: "\u0634\u0647\u0631",
      week: "\u0623\u0633\u0628\u0648\u0639",
      day: "\u064A\u0648\u0645",
      list: "\u0623\u062C\u0646\u062F\u0629"
    },
    weekText: "\u0623\u0633\u0628\u0648\u0639",
    allDayText: "\u0627\u0644\u064A\u0648\u0645 \u0643\u0644\u0647",
    moreLinkText: "\u0623\u062E\u0631\u0649",
    noEventsText: "\u0623\u064A \u0623\u062D\u062F\u0627\u062B \u0644\u0639\u0631\u0636"
  };

  // node_modules/@fullcalendar/core/locales/ar-tn.js
  var l6 = {
    code: "ar-tn",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    direction: "rtl",
    buttonText: {
      prev: "\u0627\u0644\u0633\u0627\u0628\u0642",
      next: "\u0627\u0644\u062A\u0627\u0644\u064A",
      today: "\u0627\u0644\u064A\u0648\u0645",
      year: "\u0633\u0646\u0629",
      month: "\u0634\u0647\u0631",
      week: "\u0623\u0633\u0628\u0648\u0639",
      day: "\u064A\u0648\u0645",
      list: "\u0623\u062C\u0646\u062F\u0629"
    },
    weekText: "\u0623\u0633\u0628\u0648\u0639",
    allDayText: "\u0627\u0644\u064A\u0648\u0645 \u0643\u0644\u0647",
    moreLinkText: "\u0623\u062E\u0631\u0649",
    noEventsText: "\u0623\u064A \u0623\u062D\u062F\u0627\u062B \u0644\u0639\u0631\u0636"
  };

  // node_modules/@fullcalendar/core/locales/ar.js
  var l7 = {
    code: "ar",
    week: {
      dow: 6,
      doy: 12
      // The week that contains Jan 1st is the first week of the year.
    },
    direction: "rtl",
    buttonText: {
      prev: "\u0627\u0644\u0633\u0627\u0628\u0642",
      next: "\u0627\u0644\u062A\u0627\u0644\u064A",
      today: "\u0627\u0644\u064A\u0648\u0645",
      year: "\u0633\u0646\u0629",
      month: "\u0634\u0647\u0631",
      week: "\u0623\u0633\u0628\u0648\u0639",
      day: "\u064A\u0648\u0645",
      list: "\u0623\u062C\u0646\u062F\u0629"
    },
    weekText: "\u0623\u0633\u0628\u0648\u0639",
    allDayText: "\u0627\u0644\u064A\u0648\u0645 \u0643\u0644\u0647",
    moreLinkText: "\u0623\u062E\u0631\u0649",
    noEventsText: "\u0623\u064A \u0623\u062D\u062F\u0627\u062B \u0644\u0639\u0631\u0636"
  };

  // node_modules/@fullcalendar/core/locales/az.js
  var l8 = {
    code: "az",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "\u018Fvv\u0259l",
      next: "Sonra",
      today: "Bu G\xFCn",
      year: "Il",
      month: "Ay",
      week: "H\u0259ft\u0259",
      day: "G\xFCn",
      list: "G\xFCnd\u0259m"
    },
    weekText: "H\u0259ft\u0259",
    allDayText: "B\xFCt\xFCn G\xFCn",
    moreLinkText(n2) {
      return "+ daha \xE7ox " + n2;
    },
    noEventsText: "G\xF6st\u0259rm\u0259k \xFC\xE7\xFCn hadis\u0259 yoxdur"
  };

  // node_modules/@fullcalendar/core/locales/bg.js
  var l9 = {
    code: "bg",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "\u043D\u0430\u0437\u0430\u0434",
      next: "\u043D\u0430\u043F\u0440\u0435\u0434",
      today: "\u0434\u043D\u0435\u0441",
      year: "\u0433\u043E\u0434\u0438\u043D\u0430",
      month: "\u041C\u0435\u0441\u0435\u0446",
      week: "\u0421\u0435\u0434\u043C\u0438\u0446\u0430",
      day: "\u0414\u0435\u043D",
      list: "\u0413\u0440\u0430\u0444\u0438\u043A"
    },
    allDayText: "\u0426\u044F\u043B \u0434\u0435\u043D",
    moreLinkText(n2) {
      return "+\u043E\u0449\u0435 " + n2;
    },
    noEventsText: "\u041D\u044F\u043C\u0430 \u0441\u044A\u0431\u0438\u0442\u0438\u044F \u0437\u0430 \u043F\u043E\u043A\u0430\u0437\u0432\u0430\u043D\u0435"
  };

  // node_modules/@fullcalendar/core/locales/bn.js
  var l10 = {
    code: "bn",
    week: {
      dow: 0,
      doy: 6
      // The week that contains Jan 1st is the first week of the year.
    },
    buttonText: {
      prev: "\u09AA\u09C7\u099B\u09A8\u09C7",
      next: "\u09B8\u09BE\u09AE\u09A8\u09C7",
      today: "\u0986\u099C",
      year: "\u09AC\u099B\u09B0",
      month: "\u09AE\u09BE\u09B8",
      week: "\u09B8\u09AA\u09CD\u09A4\u09BE\u09B9",
      day: "\u09A6\u09BF\u09A8",
      list: "\u09A4\u09BE\u09B2\u09BF\u0995\u09BE"
    },
    weekText: "\u09B8\u09AA\u09CD\u09A4\u09BE\u09B9",
    allDayText: "\u09B8\u09BE\u09B0\u09BE\u09A6\u09BF\u09A8",
    moreLinkText(n2) {
      return "+\u0985\u09A8\u09CD\u09AF\u09BE\u09A8\u09CD\u09AF " + n2;
    },
    noEventsText: "\u0995\u09CB\u09A8\u09CB \u0987\u09AD\u09C7\u09A8\u09CD\u099F \u09A8\u09C7\u0987"
  };

  // node_modules/@fullcalendar/core/locales/bs.js
  var l11 = {
    code: "bs",
    week: {
      dow: 1,
      doy: 7
      // The week that contains Jan 1st is the first week of the year.
    },
    buttonText: {
      prev: "Pro\u0161li",
      next: "Sljede\u0107i",
      today: "Danas",
      year: "Godina",
      month: "Mjesec",
      week: "Sedmica",
      day: "Dan",
      list: "Raspored"
    },
    weekText: "Sed",
    allDayText: "Cijeli dan",
    moreLinkText(n2) {
      return "+ jo\u0161 " + n2;
    },
    noEventsText: "Nema doga\u0111aja za prikazivanje"
  };

  // node_modules/@fullcalendar/core/locales/ca.js
  var l12 = {
    code: "ca",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "Anterior",
      next: "Seg\xFCent",
      today: "Avui",
      year: "Any",
      month: "Mes",
      week: "Setmana",
      day: "Dia",
      list: "Agenda"
    },
    weekText: "Set",
    allDayText: "Tot el dia",
    moreLinkText: "m\xE9s",
    noEventsText: "No hi ha esdeveniments per mostrar"
  };

  // node_modules/@fullcalendar/core/locales/cs.js
  var l13 = {
    code: "cs",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "D\u0159\xEDve",
      next: "Pozd\u011Bji",
      today: "Nyn\xED",
      year: "Rok",
      month: "M\u011Bs\xEDc",
      week: "T\xFDden",
      day: "Den",
      list: "Agenda"
    },
    weekText: "T\xFDd",
    allDayText: "Cel\xFD den",
    moreLinkText(n2) {
      return "+dal\u0161\xED: " + n2;
    },
    noEventsText: "\u017D\xE1dn\xE9 akce k zobrazen\xED"
  };

  // node_modules/@fullcalendar/core/locales/cy.js
  var l14 = {
    code: "cy",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "Blaenorol",
      next: "Nesaf",
      today: "Heddiw",
      year: "Blwyddyn",
      month: "Mis",
      week: "Wythnos",
      day: "Dydd",
      list: "Rhestr"
    },
    weekText: "Wythnos",
    allDayText: "Trwy'r dydd",
    moreLinkText: "Mwy",
    noEventsText: "Dim digwyddiadau"
  };

  // node_modules/@fullcalendar/core/locales/da.js
  var l15 = {
    code: "da",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "Forrige",
      next: "N\xE6ste",
      today: "I dag",
      year: "\xC5r",
      month: "M\xE5ned",
      week: "Uge",
      day: "Dag",
      list: "Agenda"
    },
    weekText: "Uge",
    allDayText: "Hele dagen",
    moreLinkText: "flere",
    noEventsText: "Ingen arrangementer at vise"
  };

  // node_modules/@fullcalendar/core/locales/de-at.js
  function affix(buttonText) {
    return buttonText === "Tag" || buttonText === "Monat" ? "r" : buttonText === "Jahr" ? "s" : "";
  }
  var l16 = {
    code: "de-at",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "Zur\xFCck",
      next: "Vor",
      today: "Heute",
      year: "Jahr",
      month: "Monat",
      week: "Woche",
      day: "Tag",
      list: "Termin\xFCbersicht"
    },
    weekText: "KW",
    weekTextLong: "Woche",
    allDayText: "Ganzt\xE4gig",
    moreLinkText(n2) {
      return "+ weitere " + n2;
    },
    noEventsText: "Keine Ereignisse anzuzeigen",
    buttonHints: {
      prev(buttonText) {
        return `Vorherige${affix(buttonText)} ${buttonText}`;
      },
      next(buttonText) {
        return `N\xE4chste${affix(buttonText)} ${buttonText}`;
      },
      today(buttonText) {
        if (buttonText === "Tag") {
          return "Heute";
        }
        return `Diese${affix(buttonText)} ${buttonText}`;
      }
    },
    viewHint(buttonText) {
      const glue = buttonText === "Woche" ? "n" : buttonText === "Monat" ? "s" : "es";
      return buttonText + glue + "ansicht";
    },
    navLinkHint: "Gehe zu $0",
    moreLinkHint(eventCnt) {
      return "Zeige " + (eventCnt === 1 ? "ein weiteres Ereignis" : eventCnt + " weitere Ereignisse");
    },
    closeHint: "Schlie\xDFen",
    timeHint: "Uhrzeit",
    eventHint: "Ereignis"
  };

  // node_modules/@fullcalendar/core/locales/de.js
  function affix2(buttonText) {
    return buttonText === "Tag" || buttonText === "Monat" ? "r" : buttonText === "Jahr" ? "s" : "";
  }
  var l17 = {
    code: "de",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "Zur\xFCck",
      next: "Vor",
      today: "Heute",
      year: "Jahr",
      month: "Monat",
      week: "Woche",
      day: "Tag",
      list: "Termin\xFCbersicht"
    },
    weekText: "KW",
    weekTextLong: "Woche",
    allDayText: "Ganzt\xE4gig",
    moreLinkText(n2) {
      return "+ weitere " + n2;
    },
    noEventsText: "Keine Ereignisse anzuzeigen",
    buttonHints: {
      prev(buttonText) {
        return `Vorherige${affix2(buttonText)} ${buttonText}`;
      },
      next(buttonText) {
        return `N\xE4chste${affix2(buttonText)} ${buttonText}`;
      },
      today(buttonText) {
        if (buttonText === "Tag") {
          return "Heute";
        }
        return `Diese${affix2(buttonText)} ${buttonText}`;
      }
    },
    viewHint(buttonText) {
      const glue = buttonText === "Woche" ? "n" : buttonText === "Monat" ? "s" : "es";
      return buttonText + glue + "ansicht";
    },
    navLinkHint: "Gehe zu $0",
    moreLinkHint(eventCnt) {
      return "Zeige " + (eventCnt === 1 ? "ein weiteres Ereignis" : eventCnt + " weitere Ereignisse");
    },
    closeHint: "Schlie\xDFen",
    timeHint: "Uhrzeit",
    eventHint: "Ereignis"
  };

  // node_modules/@fullcalendar/core/locales/el.js
  var l18 = {
    code: "el",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4st is the first week of the year.
    },
    buttonText: {
      prev: "\u03A0\u03C1\u03BF\u03B7\u03B3\u03BF\u03CD\u03BC\u03B5\u03BD\u03BF\u03C2",
      next: "\u0395\u03C0\u03CC\u03BC\u03B5\u03BD\u03BF\u03C2",
      today: "\u03A3\u03AE\u03BC\u03B5\u03C1\u03B1",
      year: "\u0395\u03C4\u03BF\u03C2",
      month: "\u039C\u03AE\u03BD\u03B1\u03C2",
      week: "\u0395\u03B2\u03B4\u03BF\u03BC\u03AC\u03B4\u03B1",
      day: "\u0397\u03BC\u03AD\u03C1\u03B1",
      list: "\u0391\u03C4\u03B6\u03AD\u03BD\u03C4\u03B1"
    },
    weekText: "\u0395\u03B2\u03B4",
    allDayText: "\u039F\u03BB\u03BF\u03AE\u03BC\u03B5\u03C1\u03BF",
    moreLinkText: "\u03C0\u03B5\u03C1\u03B9\u03C3\u03C3\u03CC\u03C4\u03B5\u03C1\u03B1",
    noEventsText: "\u0394\u03B5\u03BD \u03C5\u03C0\u03AC\u03C1\u03C7\u03BF\u03C5\u03BD \u03B3\u03B5\u03B3\u03BF\u03BD\u03CC\u03C4\u03B1 \u03C0\u03C1\u03BF\u03C2 \u03B5\u03BC\u03C6\u03AC\u03BD\u03B9\u03C3\u03B7"
  };

  // node_modules/@fullcalendar/core/locales/en-au.js
  var l19 = {
    code: "en-au",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonHints: {
      prev: "Previous $0",
      next: "Next $0",
      today: "This $0"
    },
    viewHint: "$0 view",
    navLinkHint: "Go to $0",
    moreLinkHint(eventCnt) {
      return `Show ${eventCnt} more event${eventCnt === 1 ? "" : "s"}`;
    }
  };

  // node_modules/@fullcalendar/core/locales/en-gb.js
  var l20 = {
    code: "en-gb",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonHints: {
      prev: "Previous $0",
      next: "Next $0",
      today: "This $0"
    },
    viewHint: "$0 view",
    navLinkHint: "Go to $0",
    moreLinkHint(eventCnt) {
      return `Show ${eventCnt} more event${eventCnt === 1 ? "" : "s"}`;
    }
  };

  // node_modules/@fullcalendar/core/locales/en-nz.js
  var l21 = {
    code: "en-nz",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonHints: {
      prev: "Previous $0",
      next: "Next $0",
      today: "This $0"
    },
    viewHint: "$0 view",
    navLinkHint: "Go to $0",
    moreLinkHint(eventCnt) {
      return `Show ${eventCnt} more event${eventCnt === 1 ? "" : "s"}`;
    }
  };

  // node_modules/@fullcalendar/core/locales/eo.js
  var l222 = {
    code: "eo",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "Anta\u016Da",
      next: "Sekva",
      today: "Hodia\u016D",
      year: "Jaro",
      month: "Monato",
      week: "Semajno",
      day: "Tago",
      list: "Tagordo"
    },
    weekText: "Sm",
    allDayText: "Tuta tago",
    moreLinkText: "pli",
    noEventsText: "Neniuj eventoj por montri"
  };

  // node_modules/@fullcalendar/core/locales/es-us.js
  var l23 = {
    code: "es",
    week: {
      dow: 0,
      doy: 6
      // The week that contains Jan 1st is the first week of the year.
    },
    buttonText: {
      prev: "Ant",
      next: "Sig",
      today: "Hoy",
      year: "A\xF1o",
      month: "Mes",
      week: "Semana",
      day: "D\xEDa",
      list: "Agenda"
    },
    weekText: "Sm",
    allDayText: "Todo el d\xEDa",
    moreLinkText: "m\xE1s",
    noEventsText: "No hay eventos para mostrar"
  };

  // node_modules/@fullcalendar/core/locales/es.js
  var l24 = {
    code: "es",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "Ant",
      next: "Sig",
      today: "Hoy",
      year: "A\xF1o",
      month: "Mes",
      week: "Semana",
      day: "D\xEDa",
      list: "Agenda"
    },
    buttonHints: {
      prev: "$0 antes",
      next: "$0 siguiente",
      today(buttonText) {
        return buttonText === "D\xEDa" ? "Hoy" : (buttonText === "Semana" ? "Esta" : "Este") + " " + buttonText.toLocaleLowerCase();
      }
    },
    viewHint(buttonText) {
      return "Vista " + (buttonText === "Semana" ? "de la" : "del") + " " + buttonText.toLocaleLowerCase();
    },
    weekText: "Sm",
    weekTextLong: "Semana",
    allDayText: "Todo el d\xEDa",
    moreLinkText: "m\xE1s",
    moreLinkHint(eventCnt) {
      return `Mostrar ${eventCnt} eventos m\xE1s`;
    },
    noEventsText: "No hay eventos para mostrar",
    navLinkHint: "Ir al $0",
    closeHint: "Cerrar",
    timeHint: "La hora",
    eventHint: "Evento"
  };

  // node_modules/@fullcalendar/core/locales/et.js
  var l25 = {
    code: "et",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "Eelnev",
      next: "J\xE4rgnev",
      today: "T\xE4na",
      year: "Aasta",
      month: "Kuu",
      week: "N\xE4dal",
      day: "P\xE4ev",
      list: "P\xE4evakord"
    },
    weekText: "n\xE4d",
    allDayText: "Kogu p\xE4ev",
    moreLinkText(n2) {
      return "+ veel " + n2;
    },
    noEventsText: "Kuvamiseks puuduvad s\xFCndmused"
  };

  // node_modules/@fullcalendar/core/locales/eu.js
  var l26 = {
    code: "eu",
    week: {
      dow: 1,
      doy: 7
      // The week that contains Jan 1st is the first week of the year.
    },
    buttonText: {
      prev: "Aur",
      next: "Hur",
      today: "Gaur",
      year: "Urtea",
      month: "Hilabetea",
      week: "Astea",
      day: "Eguna",
      list: "Agenda"
    },
    weekText: "As",
    allDayText: "Egun osoa",
    moreLinkText: "gehiago",
    noEventsText: "Ez dago ekitaldirik erakusteko"
  };

  // node_modules/@fullcalendar/core/locales/fa.js
  var l27 = {
    code: "fa",
    week: {
      dow: 6,
      doy: 12
      // The week that contains Jan 1st is the first week of the year.
    },
    direction: "rtl",
    buttonText: {
      prev: "\u0642\u0628\u0644\u06CC",
      next: "\u0628\u0639\u062F\u06CC",
      today: "\u0627\u0645\u0631\u0648\u0632",
      year: "\u0633\u0627\u0644",
      month: "\u0645\u0627\u0647",
      week: "\u0647\u0641\u062A\u0647",
      day: "\u0631\u0648\u0632",
      list: "\u0628\u0631\u0646\u0627\u0645\u0647"
    },
    weekText: "\u0647\u0641",
    allDayText: "\u062A\u0645\u0627\u0645 \u0631\u0648\u0632",
    moreLinkText(n2) {
      return "\u0628\u06CC\u0634 \u0627\u0632 " + n2;
    },
    noEventsText: "\u0647\u06CC\u0686 \u0631\u0648\u06CC\u062F\u0627\u062F\u06CC \u0628\u0647 \u0646\u0645\u0627\u06CC\u0634"
  };

  // node_modules/@fullcalendar/core/locales/fi.js
  var l28 = {
    code: "fi",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "Edellinen",
      next: "Seuraava",
      today: "T\xE4n\xE4\xE4n",
      year: "Vuosi",
      month: "Kuukausi",
      week: "Viikko",
      day: "P\xE4iv\xE4",
      list: "Tapahtumat"
    },
    weekText: "Vk",
    allDayText: "Koko p\xE4iv\xE4",
    moreLinkText: "lis\xE4\xE4",
    noEventsText: "Ei n\xE4ytett\xE4vi\xE4 tapahtumia"
  };

  // node_modules/@fullcalendar/core/locales/fr-ca.js
  var l29 = {
    code: "fr",
    buttonText: {
      prev: "Pr\xE9c\xE9dent",
      next: "Suivant",
      today: "Aujourd'hui",
      year: "Ann\xE9e",
      month: "Mois",
      week: "Semaine",
      day: "Jour",
      list: "Mon planning"
    },
    weekText: "Sem.",
    allDayText: "Toute la journ\xE9e",
    moreLinkText: "en plus",
    noEventsText: "Aucun \xE9v\xE8nement \xE0 afficher"
  };

  // node_modules/@fullcalendar/core/locales/fr-ch.js
  var l30 = {
    code: "fr-ch",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "Pr\xE9c\xE9dent",
      next: "Suivant",
      today: "Courant",
      year: "Ann\xE9e",
      month: "Mois",
      week: "Semaine",
      day: "Jour",
      list: "Mon planning"
    },
    weekText: "Sm",
    allDayText: "Toute la journ\xE9e",
    moreLinkText: "en plus",
    noEventsText: "Aucun \xE9v\xE8nement \xE0 afficher"
  };

  // node_modules/@fullcalendar/core/locales/fr.js
  var l31 = {
    code: "fr",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "Pr\xE9c\xE9dent",
      next: "Suivant",
      today: "Aujourd'hui",
      year: "Ann\xE9e",
      month: "Mois",
      week: "Semaine",
      day: "Jour",
      list: "Planning"
    },
    weekText: "Sem.",
    weekTextLong: "Semaine",
    allDayText: "Toute la journ\xE9e",
    moreLinkText: "en plus",
    noEventsText: "Aucun \xE9v\xE8nement \xE0 afficher"
  };

  // node_modules/@fullcalendar/core/locales/gl.js
  var l32 = {
    code: "gl",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "Ant",
      next: "Seg",
      today: "Hoxe",
      year: "Ano",
      month: "Mes",
      week: "Semana",
      day: "D\xEDa",
      list: "Axenda"
    },
    buttonHints: {
      prev: "$0 antes",
      next: "$0 seguinte",
      today(buttonText) {
        return buttonText === "D\xEDa" ? "Hoxe" : (buttonText === "Semana" ? "Esta" : "Este") + " " + buttonText.toLocaleLowerCase();
      }
    },
    viewHint(buttonText) {
      return "Vista " + (buttonText === "Semana" ? "da" : "do") + " " + buttonText.toLocaleLowerCase();
    },
    weekText: "Sm",
    weekTextLong: "Semana",
    allDayText: "Todo o d\xEDa",
    moreLinkText: "m\xE1is",
    moreLinkHint(eventCnt) {
      return `Amosar ${eventCnt} eventos m\xE1is`;
    },
    noEventsText: "Non hai eventos para amosar",
    navLinkHint: "Ir ao $0",
    closeHint: "Pechar",
    timeHint: "A hora",
    eventHint: "Evento"
  };

  // node_modules/@fullcalendar/core/locales/he.js
  var l33 = {
    code: "he",
    direction: "rtl",
    buttonText: {
      prev: "\u05D4\u05E7\u05D5\u05D3\u05DD",
      next: "\u05D4\u05D1\u05D0",
      today: "\u05D4\u05D9\u05D5\u05DD",
      year: "\u05E9\u05E0\u05D4",
      month: "\u05D7\u05D5\u05D3\u05E9",
      week: "\u05E9\u05D1\u05D5\u05E2",
      day: "\u05D9\u05D5\u05DD",
      list: "\u05E1\u05D3\u05E8 \u05D9\u05D5\u05DD"
    },
    allDayText: "\u05DB\u05DC \u05D4\u05D9\u05D5\u05DD",
    moreLinkText: "\u05E0\u05D5\u05E1\u05E4\u05D9\u05DD",
    noEventsText: "\u05D0\u05D9\u05DF \u05D0\u05D9\u05E8\u05D5\u05E2\u05D9\u05DD \u05DC\u05D4\u05E6\u05D2\u05D4",
    weekText: "\u05E9\u05D1\u05D5\u05E2"
  };

  // node_modules/@fullcalendar/core/locales/hi.js
  var l34 = {
    code: "hi",
    week: {
      dow: 0,
      doy: 6
      // The week that contains Jan 1st is the first week of the year.
    },
    buttonText: {
      prev: "\u092A\u093F\u091B\u0932\u093E",
      next: "\u0905\u0917\u0932\u093E",
      today: "\u0906\u091C",
      year: "\u0935\u0930\u094D\u0937",
      month: "\u092E\u0939\u0940\u0928\u093E",
      week: "\u0938\u092A\u094D\u0924\u093E\u0939",
      day: "\u0926\u093F\u0928",
      list: "\u0915\u093E\u0930\u094D\u092F\u0938\u0942\u091A\u0940"
    },
    weekText: "\u0939\u092B\u094D\u0924\u093E",
    allDayText: "\u0938\u092D\u0940 \u0926\u093F\u0928",
    moreLinkText(n2) {
      return "+\u0905\u0927\u093F\u0915 " + n2;
    },
    noEventsText: "\u0915\u094B\u0908 \u0918\u091F\u0928\u093E\u0913\u0902 \u0915\u094B \u092A\u094D\u0930\u0926\u0930\u094D\u0936\u093F\u0924 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F"
  };

  // node_modules/@fullcalendar/core/locales/hr.js
  var l35 = {
    code: "hr",
    week: {
      dow: 1,
      doy: 7
      // The week that contains Jan 1st is the first week of the year.
    },
    buttonText: {
      prev: "Prija\u0161nji",
      next: "Sljede\u0107i",
      today: "Danas",
      year: "Godina",
      month: "Mjesec",
      week: "Tjedan",
      day: "Dan",
      list: "Raspored"
    },
    weekText: "Tje",
    allDayText: "Cijeli dan",
    moreLinkText(n2) {
      return "+ jo\u0161 " + n2;
    },
    noEventsText: "Nema doga\u0111aja za prikaz"
  };

  // node_modules/@fullcalendar/core/locales/hu.js
  var l36 = {
    code: "hu",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "vissza",
      next: "el\u0151re",
      today: "ma",
      year: "\xC9v",
      month: "H\xF3nap",
      week: "H\xE9t",
      day: "Nap",
      list: "Lista"
    },
    weekText: "H\xE9t",
    allDayText: "Eg\xE9sz nap",
    moreLinkText: "tov\xE1bbi",
    noEventsText: "Nincs megjelen\xEDthet\u0151 esem\xE9ny"
  };

  // node_modules/@fullcalendar/core/locales/hy-am.js
  var l37 = {
    code: "hy-am",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "\u0546\u0561\u056D\u0578\u0580\u0564",
      next: "\u0540\u0561\u057B\u0578\u0580\u0564",
      today: "\u0531\u0575\u057D\u0585\u0580",
      year: "\u054F\u0561\u0580\u056B",
      month: "\u0531\u0574\u056B\u057D",
      week: "\u0547\u0561\u0562\u0561\u0569",
      day: "\u0555\u0580",
      list: "\u0555\u0580\u057E\u0561 \u0581\u0578\u0582\u0581\u0561\u056F"
    },
    weekText: "\u0547\u0561\u0562",
    allDayText: "\u0531\u0574\u0562\u0578\u0572\u057B \u0585\u0580",
    moreLinkText(n2) {
      return "+ \u0587\u057D " + n2;
    },
    noEventsText: "\u0532\u0561\u0581\u0561\u056F\u0561\u0575\u0578\u0582\u0574 \u0567 \u056B\u0580\u0561\u0564\u0561\u0580\u0571\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0568 \u0581\u0578\u0582\u0581\u0561\u0564\u0580\u0565\u056C\u0578\u0582"
  };

  // node_modules/@fullcalendar/core/locales/id.js
  var l38 = {
    code: "id",
    week: {
      dow: 1,
      doy: 7
      // The week that contains Jan 1st is the first week of the year.
    },
    buttonText: {
      prev: "mundur",
      next: "maju",
      today: "hari ini",
      year: "Tahun",
      month: "Bulan",
      week: "Minggu",
      day: "Hari",
      list: "Agenda"
    },
    weekText: "Mg",
    allDayText: "Sehari penuh",
    moreLinkText: "lebih",
    noEventsText: "Tidak ada acara untuk ditampilkan"
  };

  // node_modules/@fullcalendar/core/locales/is.js
  var l39 = {
    code: "is",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "Fyrri",
      next: "N\xE6sti",
      today: "\xCD dag",
      year: "\xC1r",
      month: "M\xE1nu\xF0ur",
      week: "Vika",
      day: "Dagur",
      list: "Dagskr\xE1"
    },
    weekText: "Vika",
    allDayText: "Allan daginn",
    moreLinkText: "meira",
    noEventsText: "Engir vi\xF0bur\xF0ir til a\xF0 s\xFDna"
  };

  // node_modules/@fullcalendar/core/locales/it.js
  var l40 = {
    code: "it",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "Prec",
      next: "Succ",
      today: "Oggi",
      year: "Anno",
      month: "Mese",
      week: "Settimana",
      day: "Giorno",
      list: "Agenda"
    },
    weekText: "Sm",
    allDayText: "Tutto il giorno",
    moreLinkText(n2) {
      return "+altri " + n2;
    },
    noEventsText: "Non ci sono eventi da visualizzare"
  };

  // node_modules/@fullcalendar/core/locales/ja.js
  var l41 = {
    code: "ja",
    buttonText: {
      prev: "\u524D",
      next: "\u6B21",
      today: "\u4ECA\u65E5",
      year: "\u5E74",
      month: "\u6708",
      week: "\u9031",
      day: "\u65E5",
      list: "\u4E88\u5B9A\u30EA\u30B9\u30C8"
    },
    weekText: "\u9031",
    allDayText: "\u7D42\u65E5",
    moreLinkText(n2) {
      return "\u4ED6 " + n2 + " \u4EF6";
    },
    noEventsText: "\u8868\u793A\u3059\u308B\u4E88\u5B9A\u306F\u3042\u308A\u307E\u305B\u3093"
  };

  // node_modules/@fullcalendar/core/locales/ka.js
  var l42 = {
    code: "ka",
    week: {
      dow: 1,
      doy: 7
    },
    buttonText: {
      prev: "\u10EC\u10D8\u10DC\u10D0",
      next: "\u10E8\u10D4\u10DB\u10D3\u10D4\u10D2\u10D8",
      today: "\u10D3\u10E6\u10D4\u10E1",
      year: "\u10EC\u10D4\u10DA\u10D8\u10EC\u10D0\u10D3\u10D8",
      month: "\u10D7\u10D5\u10D4",
      week: "\u10D9\u10D5\u10D8\u10E0\u10D0",
      day: "\u10D3\u10E6\u10D4",
      list: "\u10D3\u10E6\u10D8\u10E1 \u10EC\u10D4\u10E1\u10E0\u10D8\u10D2\u10D8"
    },
    weekText: "\u10D9\u10D5",
    allDayText: "\u10DB\u10D7\u10D4\u10DA\u10D8 \u10D3\u10E6\u10D4",
    moreLinkText(n2) {
      return "+ \u10D9\u10D8\u10D3\u10D4\u10D5 " + n2;
    },
    noEventsText: "\u10E6\u10DD\u10DC\u10D8\u10E1\u10EB\u10D8\u10D4\u10D1\u10D4\u10D1\u10D8 \u10D0\u10E0 \u10D0\u10E0\u10D8\u10E1"
  };

  // node_modules/@fullcalendar/core/locales/kk.js
  var l43 = {
    code: "kk",
    week: {
      dow: 1,
      doy: 7
      // The week that contains Jan 1st is the first week of the year.
    },
    buttonText: {
      prev: "\u0410\u043B\u0434\u044B\u04A3\u0493\u044B",
      next: "\u041A\u0435\u043B\u0435\u0441\u0456",
      today: "\u0411\u04AF\u0433\u0456\u043D",
      year: "\u0416\u044B\u043B",
      month: "\u0410\u0439",
      week: "\u0410\u043F\u0442\u0430",
      day: "\u041A\u04AF\u043D",
      list: "\u041A\u04AF\u043D \u0442\u04D9\u0440\u0442\u0456\u0431\u0456"
    },
    weekText: "\u041D\u0435",
    allDayText: "\u041A\u04AF\u043D\u0456 \u0431\u043E\u0439\u044B",
    moreLinkText(n2) {
      return "+ \u0442\u0430\u0493\u044B " + n2;
    },
    noEventsText: "\u041A\u04E9\u0440\u0441\u0435\u0442\u0443 \u04AF\u0448\u0456\u043D \u043E\u049B\u0438\u0493\u0430\u043B\u0430\u0440 \u0436\u043E\u049B"
  };

  // node_modules/@fullcalendar/core/locales/km.js
  var l44 = {
    code: "km",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "\u1798\u17BB\u1793",
      next: "\u1794\u1793\u17D2\u1791\u17B6\u1794\u17CB",
      today: "\u1790\u17D2\u1784\u17C3\u1793\u17C1\u17C7",
      year: "\u1786\u17D2\u1793\u17B6\u17C6",
      month: "\u1781\u17C2",
      week: "\u179F\u1794\u17D2\u178F\u17B6\u17A0\u17CD",
      day: "\u1790\u17D2\u1784\u17C3",
      list: "\u1794\u1789\u17D2\u1787\u17B8"
    },
    weekText: "\u179F\u1794\u17D2\u178F\u17B6\u17A0\u17CD",
    allDayText: "\u1796\u17C1\u1789\u1798\u17BD\u1799\u1790\u17D2\u1784\u17C3",
    moreLinkText: "\u1785\u17D2\u179A\u17BE\u1793\u1791\u17C0\u178F",
    noEventsText: "\u1782\u17D2\u1798\u17B6\u1793\u1796\u17D2\u179A\u17B9\u178F\u17D2\u178F\u17B7\u1780\u17B6\u179A\u178E\u17CD\u178F\u17D2\u179A\u17BC\u179C\u1794\u1784\u17D2\u17A0\u17B6\u1789"
  };

  // node_modules/@fullcalendar/core/locales/ko.js
  var l45 = {
    code: "ko",
    buttonText: {
      prev: "\uC774\uC804\uB2EC",
      next: "\uB2E4\uC74C\uB2EC",
      today: "\uC624\uB298",
      year: "\uB144\uB3C4",
      month: "\uC6D4",
      week: "\uC8FC",
      day: "\uC77C",
      list: "\uC77C\uC815\uBAA9\uB85D"
    },
    weekText: "\uC8FC",
    allDayText: "\uC885\uC77C",
    moreLinkText: "\uAC1C",
    noEventsText: "\uC77C\uC815\uC774 \uC5C6\uC2B5\uB2C8\uB2E4"
  };

  // node_modules/@fullcalendar/core/locales/ku.js
  var l46 = {
    code: "ku",
    week: {
      dow: 6,
      doy: 12
      // The week that contains Jan 1st is the first week of the year.
    },
    direction: "rtl",
    buttonText: {
      prev: "\u067E\u06CE\u0634\u062A\u0631",
      next: "\u062F\u0648\u0627\u062A\u0631",
      today: "\u0626\u06D5\u0645\u0695\u0648",
      year: "\u0633\u0627\u06B5",
      month: "\u0645\u0627\u0646\u06AF",
      week: "\u0647\u06D5\u0641\u062A\u06D5",
      day: "\u0695\u06C6\u0698",
      list: "\u0628\u06D5\u0631\u0646\u0627\u0645\u06D5"
    },
    weekText: "\u0647\u06D5\u0641\u062A\u06D5",
    allDayText: "\u0647\u06D5\u0645\u0648\u0648 \u0695\u06C6\u0698\u06D5\u06A9\u06D5",
    moreLinkText: "\u0632\u06CC\u0627\u062A\u0631",
    noEventsText: "\u0647\u06CC\u0686 \u0695\u0648\u0648\u062F\u0627\u0648\u06CE\u0643 \u0646\u06CC\u06D5"
  };

  // node_modules/@fullcalendar/core/locales/lb.js
  var l47 = {
    code: "lb",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "Zr\xE9ck",
      next: "Weider",
      today: "Haut",
      year: "Joer",
      month: "Mount",
      week: "Woch",
      day: "Dag",
      list: "Terminiwwersiicht"
    },
    weekText: "W",
    allDayText: "Ganzen Dag",
    moreLinkText: "m\xE9i",
    noEventsText: "Nee Evenementer ze affich\xE9ieren"
  };

  // node_modules/@fullcalendar/core/locales/lt.js
  var l48 = {
    code: "lt",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "Atgal",
      next: "Pirmyn",
      today: "\u0160iandien",
      year: "Metai",
      month: "M\u0117nuo",
      week: "Savait\u0117",
      day: "Diena",
      list: "Darbotvark\u0117"
    },
    weekText: "SAV",
    allDayText: "Vis\u0105 dien\u0105",
    moreLinkText: "daugiau",
    noEventsText: "N\u0117ra \u012Fvyki\u0173 rodyti"
  };

  // node_modules/@fullcalendar/core/locales/lv.js
  var l49 = {
    code: "lv",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "Iepr.",
      next: "N\u0101k.",
      today: "\u0160odien",
      year: "Gads",
      month: "M\u0113nesis",
      week: "Ned\u0113\u013Ca",
      day: "Diena",
      list: "Dienas k\u0101rt\u012Bba"
    },
    weekText: "Ned.",
    allDayText: "Visu dienu",
    moreLinkText(n2) {
      return "+v\u0113l " + n2;
    },
    noEventsText: "Nav notikumu"
  };

  // node_modules/@fullcalendar/core/locales/mk.js
  var l50 = {
    code: "mk",
    buttonText: {
      prev: "\u043F\u0440\u0435\u0442\u0445\u043E\u0434\u043D\u043E",
      next: "\u0441\u043B\u0435\u0434\u043D\u043E",
      today: "\u0414\u0435\u043D\u0435\u0441",
      year: "\u0433\u043E\u0434\u0438\u043D\u0430",
      month: "\u041C\u0435\u0441\u0435\u0446",
      week: "\u041D\u0435\u0434\u0435\u043B\u0430",
      day: "\u0414\u0435\u043D",
      list: "\u0413\u0440\u0430\u0444\u0438\u043A"
    },
    weekText: "\u0421\u0435\u0434",
    allDayText: "\u0426\u0435\u043B \u0434\u0435\u043D",
    moreLinkText(n2) {
      return "+\u043F\u043E\u0432\u0435\u045C\u0435 " + n2;
    },
    noEventsText: "\u041D\u0435\u043C\u0430 \u043D\u0430\u0441\u0442\u0430\u043D\u0438 \u0437\u0430 \u043F\u0440\u0438\u043A\u0430\u0436\u0443\u0432\u0430\u045A\u0435"
  };

  // node_modules/@fullcalendar/core/locales/ms.js
  var l51 = {
    code: "ms",
    week: {
      dow: 1,
      doy: 7
      // The week that contains Jan 1st is the first week of the year.
    },
    buttonText: {
      prev: "Sebelum",
      next: "Selepas",
      today: "hari ini",
      year: "Tahun",
      month: "Bulan",
      week: "Minggu",
      day: "Hari",
      list: "Agenda"
    },
    weekText: "Mg",
    allDayText: "Sepanjang hari",
    moreLinkText(n2) {
      return "masih ada " + n2 + " acara";
    },
    noEventsText: "Tiada peristiwa untuk dipaparkan"
  };

  // node_modules/@fullcalendar/core/locales/nb.js
  var l52 = {
    code: "nb",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "Forrige",
      next: "Neste",
      today: "I dag",
      year: "\xC5r",
      month: "M\xE5ned",
      week: "Uke",
      day: "Dag",
      list: "Agenda"
    },
    weekText: "Uke",
    weekTextLong: "Uke",
    allDayText: "Hele dagen",
    moreLinkText: "til",
    noEventsText: "Ingen hendelser \xE5 vise",
    buttonHints: {
      prev: "Forrige $0",
      next: "Neste $0",
      today: "N\xE5v\xE6rende $0"
    },
    viewHint: "$0 visning",
    navLinkHint: "G\xE5 til $0",
    moreLinkHint(eventCnt) {
      return `Vis ${eventCnt} flere hendelse${eventCnt === 1 ? "" : "r"}`;
    }
  };

  // node_modules/@fullcalendar/core/locales/ne.js
  var l53 = {
    code: "ne",
    week: {
      dow: 7,
      doy: 1
      // The week that contains Jan 1st is the first week of the year.
    },
    buttonText: {
      prev: "\u0905\u0918\u093F\u0932\u094D\u0932\u094B",
      next: "\u0905\u0930\u094D\u0915\u094B",
      today: "\u0906\u091C",
      year: "\u0935\u0930\u094D\u0937",
      month: "\u092E\u0939\u093F\u0928\u093E",
      week: "\u0939\u092A\u094D\u0924\u093E",
      day: "\u0926\u093F\u0928",
      list: "\u0938\u0942\u091A\u0940"
    },
    weekText: "\u0939\u092A\u094D\u0924\u093E",
    allDayText: "\u0926\u093F\u0928\u092D\u0930\u093F",
    moreLinkText: "\u0925\u092A \u0932\u093F\u0902\u0915",
    noEventsText: "\u0926\u0947\u0916\u093E\u0909\u0928\u0915\u094B \u0932\u093E\u0917\u093F \u0915\u0941\u0928\u0948 \u0918\u091F\u0928\u093E\u0939\u0930\u0942 \u091B\u0948\u0928\u0928\u094D"
  };

  // node_modules/@fullcalendar/core/locales/nl.js
  var l54 = {
    code: "nl",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "Vorige",
      next: "Volgende",
      today: "Vandaag",
      year: "Jaar",
      month: "Maand",
      week: "Week",
      day: "Dag",
      list: "Lijst"
    },
    allDayText: "Hele dag",
    moreLinkText: "extra",
    noEventsText: "Geen evenementen om te laten zien"
  };

  // node_modules/@fullcalendar/core/locales/nn.js
  var l55 = {
    code: "nn",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "F\xF8rre",
      next: "Neste",
      today: "I dag",
      year: "\xC5r",
      month: "M\xE5nad",
      week: "Veke",
      day: "Dag",
      list: "Agenda"
    },
    weekText: "Veke",
    allDayText: "Heile dagen",
    moreLinkText: "til",
    noEventsText: "Ingen hendelser \xE5 vise"
  };

  // node_modules/@fullcalendar/core/locales/pl.js
  var l56 = {
    code: "pl",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "Poprzedni",
      next: "Nast\u0119pny",
      today: "Dzi\u015B",
      year: "Rok",
      month: "Miesi\u0105c",
      week: "Tydzie\u0144",
      day: "Dzie\u0144",
      list: "Plan dnia"
    },
    weekText: "Tydz",
    allDayText: "Ca\u0142y dzie\u0144",
    moreLinkText: "wi\u0119cej",
    noEventsText: "Brak wydarze\u0144 do wy\u015Bwietlenia"
  };

  // node_modules/@fullcalendar/core/locales/pt-br.js
  var l57 = {
    code: "pt-br",
    buttonText: {
      prev: "Anterior",
      next: "Pr\xF3ximo",
      prevYear: "Ano anterior",
      nextYear: "Pr\xF3ximo ano",
      year: "Ano",
      today: "Hoje",
      month: "M\xEAs",
      week: "Semana",
      day: "Dia",
      list: "Lista"
    },
    buttonHints: {
      prev: "$0 Anterior",
      next: "Pr\xF3ximo $0",
      today(buttonText) {
        return buttonText === "Dia" ? "Hoje" : (buttonText === "Semana" ? "Esta" : "Este") + " " + buttonText.toLocaleLowerCase();
      }
    },
    viewHint(buttonText) {
      return "Visualizar " + (buttonText === "Semana" ? "a" : "o") + " " + buttonText.toLocaleLowerCase();
    },
    weekText: "Sm",
    weekTextLong: "Semana",
    allDayText: "dia inteiro",
    moreLinkText(n2) {
      return "mais +" + n2;
    },
    moreLinkHint(eventCnt) {
      return `Mostrar mais ${eventCnt} eventos`;
    },
    noEventsText: "N\xE3o h\xE1 eventos para mostrar",
    navLinkHint: "Ir para $0",
    closeHint: "Fechar",
    timeHint: "A hora",
    eventHint: "Evento"
  };

  // node_modules/@fullcalendar/core/locales/pt.js
  var l58 = {
    code: "pt",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "Anterior",
      next: "Seguinte",
      today: "Hoje",
      year: "Ano",
      month: "M\xEAs",
      week: "Semana",
      day: "Dia",
      list: "Agenda"
    },
    weekText: "Sem",
    allDayText: "Todo o dia",
    moreLinkText: "mais",
    noEventsText: "N\xE3o h\xE1 eventos para mostrar"
  };

  // node_modules/@fullcalendar/core/locales/ro.js
  var l59 = {
    code: "ro",
    week: {
      dow: 1,
      doy: 7
      // The week that contains Jan 1st is the first week of the year.
    },
    buttonText: {
      prev: "precedent\u0103",
      next: "urm\u0103toare",
      today: "Azi",
      year: "An",
      month: "Lun\u0103",
      week: "S\u0103pt\u0103m\xE2n\u0103",
      day: "Zi",
      list: "Agend\u0103"
    },
    weekText: "S\u0103pt",
    allDayText: "Toat\u0103 ziua",
    moreLinkText(n2) {
      return "+alte " + n2;
    },
    noEventsText: "Nu exist\u0103 evenimente de afi\u0219at"
  };

  // node_modules/@fullcalendar/core/locales/ru.js
  var l60 = {
    code: "ru",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "\u041F\u0440\u0435\u0434",
      next: "\u0421\u043B\u0435\u0434",
      today: "\u0421\u0435\u0433\u043E\u0434\u043D\u044F",
      year: "\u0413\u043E\u0434",
      month: "\u041C\u0435\u0441\u044F\u0446",
      week: "\u041D\u0435\u0434\u0435\u043B\u044F",
      day: "\u0414\u0435\u043D\u044C",
      list: "\u041F\u043E\u0432\u0435\u0441\u0442\u043A\u0430 \u0434\u043D\u044F"
    },
    weekText: "\u041D\u0435\u0434",
    allDayText: "\u0412\u0435\u0441\u044C \u0434\u0435\u043D\u044C",
    moreLinkText(n2) {
      return "+ \u0435\u0449\u0451 " + n2;
    },
    noEventsText: "\u041D\u0435\u0442 \u0441\u043E\u0431\u044B\u0442\u0438\u0439 \u0434\u043B\u044F \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F"
  };

  // node_modules/@fullcalendar/core/locales/si-lk.js
  var l61 = {
    code: "si-lk",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "\u0DB4\u0DD9\u0DBB",
      next: "\u0DB4\u0DC3\u0DD4",
      today: "\u0D85\u0DAF",
      year: "\u0D85\u0DC0\u0DD4\u0DBB\u0DD4\u0DAF\u0DD4",
      month: "\u0DB8\u0DCF\u0DC3\u0DBA",
      week: "\u0DC3\u0DAD\u0DD2\u0DBA",
      day: "\u0DAF\u0DC0\u0DC3",
      list: "\u0DBD\u0DD0\u0DBA\u0DD2\u0DC3\u0DCA\u0DAD\u0DD4\u0DC0"
    },
    weekText: "\u0DC3\u0DAD\u0DD2",
    allDayText: "\u0DC3\u0DD2\u0DBA\u0DBD\u0DD4",
    moreLinkText: "\u0DAD\u0DC0\u0DAD\u0DCA",
    noEventsText: "\u0DB8\u0DD4\u0D9A\u0DD4\u0DAD\u0DCA \u0DB1\u0DD0\u0DAD"
  };

  // node_modules/@fullcalendar/core/locales/sk.js
  var l62 = {
    code: "sk",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "Predch\xE1dzaj\xFAci",
      next: "Nasleduj\xFAci",
      today: "Dnes",
      year: "Rok",
      month: "Mesiac",
      week: "T\xFD\u017Ede\u0148",
      day: "De\u0148",
      list: "Rozvrh"
    },
    weekText: "Ty",
    allDayText: "Cel\xFD de\u0148",
    moreLinkText(n2) {
      return "+\u010Fal\u0161ie: " + n2;
    },
    noEventsText: "\u017Diadne akcie na zobrazenie"
  };

  // node_modules/@fullcalendar/core/locales/sl.js
  var l63 = {
    code: "sl",
    week: {
      dow: 1,
      doy: 7
      // The week that contains Jan 1st is the first week of the year.
    },
    buttonText: {
      prev: "Prej\u0161nji",
      next: "Naslednji",
      today: "Trenutni",
      year: "Leto",
      month: "Mesec",
      week: "Teden",
      day: "Dan",
      list: "Dnevni red"
    },
    weekText: "Teden",
    allDayText: "Ves dan",
    moreLinkText: "ve\u010D",
    noEventsText: "Ni dogodkov za prikaz"
  };

  // node_modules/@fullcalendar/core/locales/sm.js
  var l64 = {
    code: "sm",
    buttonText: {
      prev: "Talu ai",
      next: "Mulimuli atu",
      today: "Aso nei",
      year: "Tausaga",
      month: "Masina",
      week: "Vaiaso",
      day: "Aso",
      list: "Faasologa"
    },
    weekText: "Vaiaso",
    allDayText: "Aso atoa",
    moreLinkText: "sili atu",
    noEventsText: "Leai ni mea na tutupu"
  };

  // node_modules/@fullcalendar/core/locales/sq.js
  var l65 = {
    code: "sq",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "mbrapa",
      next: "P\xEBrpara",
      today: "Sot",
      year: "Viti",
      month: "Muaj",
      week: "Jav\xEB",
      day: "Dit\xEB",
      list: "List\xEB"
    },
    weekText: "Ja",
    allDayText: "Gjith\xEB dit\xEBn",
    moreLinkText(n2) {
      return "+m\xEB tep\xEBr " + n2;
    },
    noEventsText: "Nuk ka evente p\xEBr t\xEB shfaqur"
  };

  // node_modules/@fullcalendar/core/locales/sr-cyrl.js
  var l66 = {
    code: "sr-cyrl",
    week: {
      dow: 1,
      doy: 7
      // The week that contains Jan 1st is the first week of the year.
    },
    buttonText: {
      prev: "\u041F\u0440\u0435\u0442\u0445\u043E\u0434\u043D\u0430",
      next: "\u0441\u043B\u0435\u0434\u0435\u045B\u0438",
      today: "\u0414\u0430\u043D\u0430\u0441",
      year: "\u0413\u043E\u0434\u0438\u043D\u0430",
      month: "\u041C\u0435\u0441\u0435\u0446",
      week: "\u041D\u0435\u0434\u0435\u0459\u0430",
      day: "\u0414\u0430\u043D",
      list: "\u041F\u043B\u0430\u043D\u0435\u0440"
    },
    weekText: "\u0421\u0435\u0434",
    allDayText: "\u0426\u0435\u043E \u0434\u0430\u043D",
    moreLinkText(n2) {
      return "+ \u0458\u043E\u0448 " + n2;
    },
    noEventsText: "\u041D\u0435\u043C\u0430 \u0434\u043E\u0433\u0430\u0452\u0430\u0458\u0430 \u0437\u0430 \u043F\u0440\u0438\u043A\u0430\u0437"
  };

  // node_modules/@fullcalendar/core/locales/sr.js
  var l67 = {
    code: "sr",
    week: {
      dow: 1,
      doy: 7
      // The week that contains Jan 1st is the first week of the year.
    },
    buttonText: {
      prev: "Prethodna",
      next: "Sledec\u0301i",
      today: "Danas",
      year: "Godina",
      month: "M\u0435s\u0435c",
      week: "N\u0435d\u0435lja",
      day: "Dan",
      list: "Plan\u0435r"
    },
    weekText: "Sed",
    allDayText: "C\u0435o dan",
    moreLinkText(n2) {
      return "+ jo\u0161 " + n2;
    },
    noEventsText: "N\u0435ma doga\u0111aja za prikaz"
  };

  // node_modules/@fullcalendar/core/locales/sv.js
  var l68 = {
    code: "sv",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "F\xF6rra",
      next: "N\xE4sta",
      today: "Idag",
      year: "\xC5r",
      month: "M\xE5nad",
      week: "Vecka",
      day: "Dag",
      list: "Program"
    },
    buttonHints: {
      prev(buttonText) {
        return `F\xF6reg\xE5ende ${buttonText.toLocaleLowerCase()}`;
      },
      next(buttonText) {
        return `N\xE4sta ${buttonText.toLocaleLowerCase()}`;
      },
      today(buttonText) {
        return (buttonText === "Program" ? "Detta" : "Denna") + " " + buttonText.toLocaleLowerCase();
      }
    },
    viewHint: "$0 vy",
    navLinkHint: "G\xE5 till $0",
    moreLinkHint(eventCnt) {
      return `Visa ytterligare ${eventCnt} h\xE4ndelse${eventCnt === 1 ? "" : "r"}`;
    },
    weekText: "v.",
    weekTextLong: "Vecka",
    allDayText: "Heldag",
    moreLinkText: "till",
    noEventsText: "Inga h\xE4ndelser att visa",
    closeHint: "St\xE4ng",
    timeHint: "Klockan",
    eventHint: "H\xE4ndelse"
  };

  // node_modules/@fullcalendar/core/locales/ta-in.js
  var l69 = {
    code: "ta-in",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "\u0BAE\u0BC1\u0BA8\u0BCD\u0BA4\u0BC8\u0BAF",
      next: "\u0B85\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BA4\u0BC1",
      today: "\u0B87\u0BA9\u0BCD\u0BB1\u0BC1",
      year: "\u0B86\u0BA3\u0BCD\u0B9F\u0BC1",
      month: "\u0BAE\u0BBE\u0BA4\u0BAE\u0BCD",
      week: "\u0BB5\u0BBE\u0BB0\u0BAE\u0BCD",
      day: "\u0BA8\u0BBE\u0BB3\u0BCD",
      list: "\u0BA4\u0BBF\u0BA9\u0B9A\u0BB0\u0BBF \u0B85\u0B9F\u0BCD\u0B9F\u0BB5\u0BA3\u0BC8"
    },
    weekText: "\u0BB5\u0BBE\u0BB0\u0BAE\u0BCD",
    allDayText: "\u0BA8\u0BBE\u0BB3\u0BCD \u0BAE\u0BC1\u0BB4\u0BC1\u0BB5\u0BA4\u0BC1\u0BAE\u0BCD",
    moreLinkText(n2) {
      return "+ \u0BAE\u0BC7\u0BB2\u0BC1\u0BAE\u0BCD " + n2;
    },
    noEventsText: "\u0B95\u0BBE\u0BA3\u0BCD\u0BAA\u0BBF\u0B95\u0BCD\u0B95 \u0BA8\u0BBF\u0B95\u0BB4\u0BCD\u0BB5\u0BC1\u0B95\u0BB3\u0BCD \u0B87\u0BB2\u0BCD\u0BB2\u0BC8"
  };

  // node_modules/@fullcalendar/core/locales/th.js
  var l70 = {
    code: "th",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "\u0E01\u0E48\u0E2D\u0E19\u0E2B\u0E19\u0E49\u0E32",
      next: "\u0E16\u0E31\u0E14\u0E44\u0E1B",
      prevYear: "\u0E1B\u0E35\u0E01\u0E48\u0E2D\u0E19\u0E2B\u0E19\u0E49\u0E32",
      nextYear: "\u0E1B\u0E35\u0E16\u0E31\u0E14\u0E44\u0E1B",
      year: "\u0E1B\u0E35",
      today: "\u0E27\u0E31\u0E19\u0E19\u0E35\u0E49",
      month: "\u0E40\u0E14\u0E37\u0E2D\u0E19",
      week: "\u0E2A\u0E31\u0E1B\u0E14\u0E32\u0E2B\u0E4C",
      day: "\u0E27\u0E31\u0E19",
      list: "\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E01\u0E32\u0E23"
    },
    weekText: "\u0E2A\u0E31\u0E1B\u0E14\u0E32\u0E2B\u0E4C",
    allDayText: "\u0E15\u0E25\u0E2D\u0E14\u0E27\u0E31\u0E19",
    moreLinkText: "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E15\u0E34\u0E21",
    noEventsText: "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E01\u0E34\u0E08\u0E01\u0E23\u0E23\u0E21\u0E17\u0E35\u0E48\u0E08\u0E30\u0E41\u0E2A\u0E14\u0E07"
  };

  // node_modules/@fullcalendar/core/locales/tr.js
  var l71 = {
    code: "tr",
    week: {
      dow: 1,
      doy: 7
      // The week that contains Jan 1st is the first week of the year.
    },
    buttonText: {
      prev: "geri",
      next: "ileri",
      today: "bug\xFCn",
      year: "Y\u0131l",
      month: "Ay",
      week: "Hafta",
      day: "G\xFCn",
      list: "Ajanda"
    },
    weekText: "Hf",
    allDayText: "T\xFCm g\xFCn",
    moreLinkText: "daha fazla",
    noEventsText: "G\xF6sterilecek etkinlik yok"
  };

  // node_modules/@fullcalendar/core/locales/ug.js
  var l72 = {
    code: "ug",
    buttonText: {
      prev: "\u0626\u0627\u0644\u062F\u0649\u0646\u0642\u0649",
      next: "\u0643\u06D0\u064A\u0649\u0646\u0643\u0649",
      today: "\u0628\u06C8\u06AF\u06C8\u0646",
      year: "\u064A\u0649\u0644",
      month: "\u0626\u0627\u064A",
      week: "\u06BE\u06D5\u067E\u062A\u06D5",
      day: "\u0643\u06C8\u0646",
      list: "\u0643\u06C8\u0646\u062A\u06D5\u0631\u062A\u0649\u067E"
    },
    allDayText: "\u067E\u06C8\u062A\u06C8\u0646 \u0643\u06C8\u0646"
  };

  // node_modules/@fullcalendar/core/locales/uk.js
  var l73 = {
    code: "uk",
    week: {
      dow: 1,
      doy: 7
      // The week that contains Jan 1st is the first week of the year.
    },
    buttonText: {
      prev: "\u041F\u043E\u043F\u0435\u0440\u0435\u0434\u043D\u0456\u0439",
      next: "\u0434\u0430\u043B\u0456",
      today: "\u0421\u044C\u043E\u0433\u043E\u0434\u043D\u0456",
      year: "\u0440\u0456\u043A",
      month: "\u041C\u0456\u0441\u044F\u0446\u044C",
      week: "\u0422\u0438\u0436\u0434\u0435\u043D\u044C",
      day: "\u0414\u0435\u043D\u044C",
      list: "\u041F\u043E\u0440\u044F\u0434\u043E\u043A \u0434\u0435\u043D\u043D\u0438\u0439"
    },
    weekText: "\u0422\u0438\u0436",
    allDayText: "\u0423\u0432\u0435\u0441\u044C \u0434\u0435\u043D\u044C",
    moreLinkText(n2) {
      return "+\u0449\u0435 " + n2 + "...";
    },
    noEventsText: "\u041D\u0435\u043C\u0430\u0454 \u043F\u043E\u0434\u0456\u0439 \u0434\u043B\u044F \u0432\u0456\u0434\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F"
  };

  // node_modules/@fullcalendar/core/locales/uz-cy.js
  var l74 = {
    code: "uz-cy",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "\u041E\u043B\u0438\u043D",
      next: "\u041A\u0435\u0439\u0438\u043D",
      today: "\u0411\u0443\u0433\u0443\u043D",
      month: "\u041E\u0439",
      week: "\u04B2\u0430\u0444\u0442\u0430",
      day: "\u041A\u0443\u043D",
      list: "\u041A\u0443\u043D \u0442\u0430\u0440\u0442\u0438\u0431\u0438"
    },
    weekText: "\u04B2\u0430\u0444\u0442\u0430",
    allDayText: "\u041A\u0443\u043D \u0431\u045E\u0439\u0438\u0447\u0430",
    moreLinkText(n2) {
      return "+ \u044F\u043D\u0430 " + n2;
    },
    noEventsText: "\u041A\u045E\u0440\u0441\u0430\u0442\u0438\u0448 \u0443\u0447\u0443\u043D \u0432\u043E\u049B\u0435\u0430\u043B\u0430\u0440 \u0439\u045E\u049B"
  };

  // node_modules/@fullcalendar/core/locales/uz.js
  var l75 = {
    code: "uz",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "Oldingi",
      next: "Keyingi",
      today: "Bugun",
      year: "Yil",
      month: "Oy",
      week: "Xafta",
      day: "Kun",
      list: "Kun tartibi"
    },
    allDayText: "Kun bo'yi",
    moreLinkText(n2) {
      return "+ yana " + n2;
    },
    noEventsText: "Ko'rsatish uchun voqealar yo'q"
  };

  // node_modules/@fullcalendar/core/locales/vi.js
  var l76 = {
    code: "vi",
    week: {
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "Tr\u01B0\u1EDBc",
      next: "Ti\u1EBFp",
      today: "H\xF4m nay",
      year: "N\u0103m",
      month: "Th\xE1ng",
      week: "Tu\xE2\u0300n",
      day: "Ng\xE0y",
      list: "L\u1ECBch bi\u1EC3u"
    },
    weekText: "Tu",
    allDayText: "C\u1EA3 ng\xE0y",
    moreLinkText(n2) {
      return "+ th\xEAm " + n2;
    },
    noEventsText: "Kh\xF4ng c\xF3 s\u1EF1 ki\u1EC7n \u0111\u1EC3 hi\u1EC3n th\u1ECB"
  };

  // node_modules/@fullcalendar/core/locales/zh-cn.js
  var l77 = {
    code: "zh-cn",
    week: {
      // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
      dow: 1,
      doy: 4
      // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: "\u4E0A\u6708",
      next: "\u4E0B\u6708",
      today: "\u4ECA\u5929",
      year: "\u5E74",
      month: "\u6708",
      week: "\u5468",
      day: "\u65E5",
      list: "\u65E5\u7A0B"
    },
    weekText: "\u5468",
    allDayText: "\u5168\u5929",
    moreLinkText(n2) {
      return "\u53E6\u5916 " + n2 + " \u4E2A";
    },
    noEventsText: "\u6CA1\u6709\u4E8B\u4EF6\u663E\u793A"
  };

  // node_modules/@fullcalendar/core/locales/zh-tw.js
  var l78 = {
    code: "zh-tw",
    buttonText: {
      prev: "\u4E0A\u500B",
      next: "\u4E0B\u500B",
      today: "\u4ECA\u5929",
      year: "\u5E74",
      month: "\u6708",
      week: "\u9031",
      day: "\u5929",
      list: "\u6D3B\u52D5\u5217\u8868"
    },
    weekText: "\u9031",
    allDayText: "\u6574\u5929",
    moreLinkText: "\u986F\u793A\u66F4\u591A",
    noEventsText: "\u6C92\u6709\u4EFB\u4F55\u6D3B\u52D5"
  };

  // node_modules/@fullcalendar/core/locales-all.js
  var localesAll = [
    l0,
    l1,
    l22,
    l3,
    l4,
    l5,
    l6,
    l7,
    l8,
    l9,
    l10,
    l11,
    l12,
    l13,
    l14,
    l15,
    l16,
    l17,
    l18,
    l19,
    l20,
    l21,
    l222,
    l23,
    l24,
    l25,
    l26,
    l27,
    l28,
    l29,
    l30,
    l31,
    l32,
    l33,
    l34,
    l35,
    l36,
    l37,
    l38,
    l39,
    l40,
    l41,
    l42,
    l43,
    l44,
    l45,
    l46,
    l47,
    l48,
    l49,
    l50,
    l51,
    l52,
    l53,
    l54,
    l55,
    l56,
    l57,
    l58,
    l59,
    l60,
    l61,
    l62,
    l63,
    l64,
    l65,
    l66,
    l67,
    l68,
    l69,
    l70,
    l71,
    l72,
    l73,
    l74,
    l75,
    l76,
    l77,
    l78
  ];

  // node_modules/rrule/dist/esm/weekday.js
  var ALL_WEEKDAYS = [
    "MO",
    "TU",
    "WE",
    "TH",
    "FR",
    "SA",
    "SU"
  ];
  var Weekday = (
    /** @class */
    (function() {
      function Weekday2(weekday, n2) {
        if (n2 === 0)
          throw new Error("Can't create weekday with n == 0");
        this.weekday = weekday;
        this.n = n2;
      }
      Weekday2.fromStr = function(str) {
        return new Weekday2(ALL_WEEKDAYS.indexOf(str));
      };
      Weekday2.prototype.nth = function(n2) {
        return this.n === n2 ? this : new Weekday2(this.weekday, n2);
      };
      Weekday2.prototype.equals = function(other) {
        return this.weekday === other.weekday && this.n === other.n;
      };
      Weekday2.prototype.toString = function() {
        var s3 = ALL_WEEKDAYS[this.weekday];
        if (this.n)
          s3 = (this.n > 0 ? "+" : "") + String(this.n) + s3;
        return s3;
      };
      Weekday2.prototype.getJsWeekday = function() {
        return this.weekday === 6 ? 0 : this.weekday + 1;
      };
      return Weekday2;
    })()
  );

  // node_modules/rrule/dist/esm/helpers.js
  var isPresent = function(value) {
    return value !== null && value !== void 0;
  };
  var isNumber = function(value) {
    return typeof value === "number";
  };
  var isWeekdayStr = function(value) {
    return typeof value === "string" && ALL_WEEKDAYS.includes(value);
  };
  var isArray = Array.isArray;
  var range = function(start, end) {
    if (end === void 0) {
      end = start;
    }
    if (arguments.length === 1) {
      end = start;
      start = 0;
    }
    var rang = [];
    for (var i3 = start; i3 < end; i3++)
      rang.push(i3);
    return rang;
  };
  var repeat = function(value, times) {
    var i3 = 0;
    var array = [];
    if (isArray(value)) {
      for (; i3 < times; i3++)
        array[i3] = [].concat(value);
    } else {
      for (; i3 < times; i3++)
        array[i3] = value;
    }
    return array;
  };
  var toArray = function(item) {
    if (isArray(item)) {
      return item;
    }
    return [item];
  };
  function padStart2(item, targetLength, padString) {
    if (padString === void 0) {
      padString = " ";
    }
    var str = String(item);
    targetLength = targetLength >> 0;
    if (str.length > targetLength) {
      return String(str);
    }
    targetLength = targetLength - str.length;
    if (targetLength > padString.length) {
      padString += repeat(padString, targetLength / padString.length);
    }
    return padString.slice(0, targetLength) + String(str);
  }
  var split = function(str, sep, num) {
    var splits = str.split(sep);
    return num ? splits.slice(0, num).concat([splits.slice(num).join(sep)]) : splits;
  };
  var pymod = function(a3, b3) {
    var r3 = a3 % b3;
    return r3 * b3 < 0 ? r3 + b3 : r3;
  };
  var divmod = function(a3, b3) {
    return { div: Math.floor(a3 / b3), mod: pymod(a3, b3) };
  };
  var empty = function(obj) {
    return !isPresent(obj) || obj.length === 0;
  };
  var notEmpty = function(obj) {
    return !empty(obj);
  };
  var includes = function(arr, val) {
    return notEmpty(arr) && arr.indexOf(val) !== -1;
  };

  // node_modules/rrule/dist/esm/dateutil.js
  var datetime = function(y3, m3, d2, h3, i3, s3) {
    if (h3 === void 0) {
      h3 = 0;
    }
    if (i3 === void 0) {
      i3 = 0;
    }
    if (s3 === void 0) {
      s3 = 0;
    }
    return new Date(Date.UTC(y3, m3 - 1, d2, h3, i3, s3));
  };
  var MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var ONE_DAY = 1e3 * 60 * 60 * 24;
  var MAXYEAR = 9999;
  var ORDINAL_BASE = datetime(1970, 1, 1);
  var PY_WEEKDAYS = [6, 0, 1, 2, 3, 4, 5];
  var isLeapYear = function(year) {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  };
  var isDate = function(value) {
    return value instanceof Date;
  };
  var isValidDate2 = function(value) {
    return isDate(value) && !isNaN(value.getTime());
  };
  var daysBetween = function(date1, date2) {
    var date1ms = date1.getTime();
    var date2ms = date2.getTime();
    var differencems = date1ms - date2ms;
    return Math.round(differencems / ONE_DAY);
  };
  var toOrdinal = function(date) {
    return daysBetween(date, ORDINAL_BASE);
  };
  var fromOrdinal = function(ordinal) {
    return new Date(ORDINAL_BASE.getTime() + ordinal * ONE_DAY);
  };
  var getMonthDays = function(date) {
    var month = date.getUTCMonth();
    return month === 1 && isLeapYear(date.getUTCFullYear()) ? 29 : MONTH_DAYS[month];
  };
  var getWeekday = function(date) {
    return PY_WEEKDAYS[date.getUTCDay()];
  };
  var monthRange = function(year, month) {
    var date = datetime(year, month + 1, 1);
    return [getWeekday(date), getMonthDays(date)];
  };
  var combine = function(date, time) {
    time = time || date;
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds()));
  };
  var clone = function(date) {
    var dolly = new Date(date.getTime());
    return dolly;
  };
  var cloneDates = function(dates) {
    var clones = [];
    for (var i3 = 0; i3 < dates.length; i3++) {
      clones.push(clone(dates[i3]));
    }
    return clones;
  };
  var sort = function(dates) {
    dates.sort(function(a3, b3) {
      return a3.getTime() - b3.getTime();
    });
  };
  var timeToUntilString = function(time, utc) {
    if (utc === void 0) {
      utc = true;
    }
    var date = new Date(time);
    return [
      padStart2(date.getUTCFullYear().toString(), 4, "0"),
      padStart2(date.getUTCMonth() + 1, 2, "0"),
      padStart2(date.getUTCDate(), 2, "0"),
      "T",
      padStart2(date.getUTCHours(), 2, "0"),
      padStart2(date.getUTCMinutes(), 2, "0"),
      padStart2(date.getUTCSeconds(), 2, "0"),
      utc ? "Z" : ""
    ].join("");
  };
  var untilStringToDate = function(until) {
    var re = /^(\d{4})(\d{2})(\d{2})(T(\d{2})(\d{2})(\d{2})Z?)?$/;
    var bits = re.exec(until);
    if (!bits)
      throw new Error("Invalid UNTIL value: ".concat(until));
    return new Date(Date.UTC(parseInt(bits[1], 10), parseInt(bits[2], 10) - 1, parseInt(bits[3], 10), parseInt(bits[5], 10) || 0, parseInt(bits[6], 10) || 0, parseInt(bits[7], 10) || 0));
  };
  var dateTZtoISO8601 = function(date, timeZone) {
    var dateStr = date.toLocaleString("sv-SE", { timeZone });
    return dateStr.replace(" ", "T") + "Z";
  };
  var dateInTimeZone = function(date, timeZone) {
    var localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    var dateInLocalTZ = new Date(dateTZtoISO8601(date, localTimeZone));
    var dateInTargetTZ = new Date(dateTZtoISO8601(date, timeZone !== null && timeZone !== void 0 ? timeZone : "UTC"));
    var tzOffset = dateInTargetTZ.getTime() - dateInLocalTZ.getTime();
    return new Date(date.getTime() - tzOffset);
  };

  // node_modules/rrule/dist/esm/iterresult.js
  var IterResult = (
    /** @class */
    (function() {
      function IterResult2(method, args) {
        this.minDate = null;
        this.maxDate = null;
        this._result = [];
        this.total = 0;
        this.method = method;
        this.args = args;
        if (method === "between") {
          this.maxDate = args.inc ? args.before : new Date(args.before.getTime() - 1);
          this.minDate = args.inc ? args.after : new Date(args.after.getTime() + 1);
        } else if (method === "before") {
          this.maxDate = args.inc ? args.dt : new Date(args.dt.getTime() - 1);
        } else if (method === "after") {
          this.minDate = args.inc ? args.dt : new Date(args.dt.getTime() + 1);
        }
      }
      IterResult2.prototype.accept = function(date) {
        ++this.total;
        var tooEarly = this.minDate && date < this.minDate;
        var tooLate = this.maxDate && date > this.maxDate;
        if (this.method === "between") {
          if (tooEarly)
            return true;
          if (tooLate)
            return false;
        } else if (this.method === "before") {
          if (tooLate)
            return false;
        } else if (this.method === "after") {
          if (tooEarly)
            return true;
          this.add(date);
          return false;
        }
        return this.add(date);
      };
      IterResult2.prototype.add = function(date) {
        this._result.push(date);
        return true;
      };
      IterResult2.prototype.getValue = function() {
        var res = this._result;
        switch (this.method) {
          case "all":
          case "between":
            return res;
          case "before":
          case "after":
          default:
            return res.length ? res[res.length - 1] : null;
        }
      };
      IterResult2.prototype.clone = function() {
        return new IterResult2(this.method, this.args);
      };
      return IterResult2;
    })()
  );
  var iterresult_default = IterResult;

  // node_modules/tslib/tslib.es6.mjs
  var extendStatics = function(d2, b3) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b4) {
      d3.__proto__ = b4;
    } || function(d3, b4) {
      for (var p3 in b4) if (Object.prototype.hasOwnProperty.call(b4, p3)) d3[p3] = b4[p3];
    };
    return extendStatics(d2, b3);
  };
  function __extends(d2, b3) {
    if (typeof b3 !== "function" && b3 !== null)
      throw new TypeError("Class extends value " + String(b3) + " is not a constructor or null");
    extendStatics(d2, b3);
    function __() {
      this.constructor = d2;
    }
    d2.prototype = b3 === null ? Object.create(b3) : (__.prototype = b3.prototype, new __());
  }
  var __assign = function() {
    __assign = Object.assign || function __assign2(t3) {
      for (var s3, i3 = 1, n2 = arguments.length; i3 < n2; i3++) {
        s3 = arguments[i3];
        for (var p3 in s3) if (Object.prototype.hasOwnProperty.call(s3, p3)) t3[p3] = s3[p3];
      }
      return t3;
    };
    return __assign.apply(this, arguments);
  };
  function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i3 = 0, l79 = from.length, ar; i3 < l79; i3++) {
      if (ar || !(i3 in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i3);
        ar[i3] = from[i3];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  }

  // node_modules/rrule/dist/esm/callbackiterresult.js
  var CallbackIterResult = (
    /** @class */
    (function(_super) {
      __extends(CallbackIterResult2, _super);
      function CallbackIterResult2(method, args, iterator) {
        var _this = _super.call(this, method, args) || this;
        _this.iterator = iterator;
        return _this;
      }
      CallbackIterResult2.prototype.add = function(date) {
        if (this.iterator(date, this._result.length)) {
          this._result.push(date);
          return true;
        }
        return false;
      };
      return CallbackIterResult2;
    })(iterresult_default)
  );
  var callbackiterresult_default = CallbackIterResult;

  // node_modules/rrule/dist/esm/nlp/i18n.js
  var ENGLISH = {
    dayNames: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    monthNames: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ],
    tokens: {
      SKIP: /^[ \r\n\t]+|^\.$/,
      number: /^[1-9][0-9]*/,
      numberAsText: /^(one|two|three)/i,
      every: /^every/i,
      "day(s)": /^days?/i,
      "weekday(s)": /^weekdays?/i,
      "week(s)": /^weeks?/i,
      "hour(s)": /^hours?/i,
      "minute(s)": /^minutes?/i,
      "month(s)": /^months?/i,
      "year(s)": /^years?/i,
      on: /^(on|in)/i,
      at: /^(at)/i,
      the: /^the/i,
      first: /^first/i,
      second: /^second/i,
      third: /^third/i,
      nth: /^([1-9][0-9]*)(\.|th|nd|rd|st)/i,
      last: /^last/i,
      for: /^for/i,
      "time(s)": /^times?/i,
      until: /^(un)?til/i,
      monday: /^mo(n(day)?)?/i,
      tuesday: /^tu(e(s(day)?)?)?/i,
      wednesday: /^we(d(n(esday)?)?)?/i,
      thursday: /^th(u(r(sday)?)?)?/i,
      friday: /^fr(i(day)?)?/i,
      saturday: /^sa(t(urday)?)?/i,
      sunday: /^su(n(day)?)?/i,
      january: /^jan(uary)?/i,
      february: /^feb(ruary)?/i,
      march: /^mar(ch)?/i,
      april: /^apr(il)?/i,
      may: /^may/i,
      june: /^june?/i,
      july: /^july?/i,
      august: /^aug(ust)?/i,
      september: /^sep(t(ember)?)?/i,
      october: /^oct(ober)?/i,
      november: /^nov(ember)?/i,
      december: /^dec(ember)?/i,
      comma: /^(,\s*|(and|or)\s*)+/i
    }
  };
  var i18n_default = ENGLISH;

  // node_modules/rrule/dist/esm/nlp/totext.js
  var contains = function(arr, val) {
    return arr.indexOf(val) !== -1;
  };
  var defaultGetText = function(id) {
    return id.toString();
  };
  var defaultDateFormatter = function(year, month, day) {
    return "".concat(month, " ").concat(day, ", ").concat(year);
  };
  var ToText = (
    /** @class */
    (function() {
      function ToText2(rrule, gettext, language, dateFormatter) {
        if (gettext === void 0) {
          gettext = defaultGetText;
        }
        if (language === void 0) {
          language = i18n_default;
        }
        if (dateFormatter === void 0) {
          dateFormatter = defaultDateFormatter;
        }
        this.text = [];
        this.language = language || i18n_default;
        this.gettext = gettext;
        this.dateFormatter = dateFormatter;
        this.rrule = rrule;
        this.options = rrule.options;
        this.origOptions = rrule.origOptions;
        if (this.origOptions.bymonthday) {
          var bymonthday = [].concat(this.options.bymonthday);
          var bynmonthday = [].concat(this.options.bynmonthday);
          bymonthday.sort(function(a3, b3) {
            return a3 - b3;
          });
          bynmonthday.sort(function(a3, b3) {
            return b3 - a3;
          });
          this.bymonthday = bymonthday.concat(bynmonthday);
          if (!this.bymonthday.length)
            this.bymonthday = null;
        }
        if (isPresent(this.origOptions.byweekday)) {
          var byweekday = !isArray(this.origOptions.byweekday) ? [this.origOptions.byweekday] : this.origOptions.byweekday;
          var days = String(byweekday);
          this.byweekday = {
            allWeeks: byweekday.filter(function(weekday) {
              return !weekday.n;
            }),
            someWeeks: byweekday.filter(function(weekday) {
              return Boolean(weekday.n);
            }),
            isWeekdays: days.indexOf("MO") !== -1 && days.indexOf("TU") !== -1 && days.indexOf("WE") !== -1 && days.indexOf("TH") !== -1 && days.indexOf("FR") !== -1 && days.indexOf("SA") === -1 && days.indexOf("SU") === -1,
            isEveryDay: days.indexOf("MO") !== -1 && days.indexOf("TU") !== -1 && days.indexOf("WE") !== -1 && days.indexOf("TH") !== -1 && days.indexOf("FR") !== -1 && days.indexOf("SA") !== -1 && days.indexOf("SU") !== -1
          };
          var sortWeekDays = function(a3, b3) {
            return a3.weekday - b3.weekday;
          };
          this.byweekday.allWeeks.sort(sortWeekDays);
          this.byweekday.someWeeks.sort(sortWeekDays);
          if (!this.byweekday.allWeeks.length)
            this.byweekday.allWeeks = null;
          if (!this.byweekday.someWeeks.length)
            this.byweekday.someWeeks = null;
        } else {
          this.byweekday = null;
        }
      }
      ToText2.isFullyConvertible = function(rrule) {
        var canConvert = true;
        if (!(rrule.options.freq in ToText2.IMPLEMENTED))
          return false;
        if (rrule.origOptions.until && rrule.origOptions.count)
          return false;
        for (var key in rrule.origOptions) {
          if (contains(["dtstart", "tzid", "wkst", "freq"], key))
            return true;
          if (!contains(ToText2.IMPLEMENTED[rrule.options.freq], key))
            return false;
        }
        return canConvert;
      };
      ToText2.prototype.isFullyConvertible = function() {
        return ToText2.isFullyConvertible(this.rrule);
      };
      ToText2.prototype.toString = function() {
        var gettext = this.gettext;
        if (!(this.options.freq in ToText2.IMPLEMENTED)) {
          return gettext("RRule error: Unable to fully convert this rrule to text");
        }
        this.text = [gettext("every")];
        this[RRule.FREQUENCIES[this.options.freq]]();
        if (this.options.until) {
          this.add(gettext("until"));
          var until = this.options.until;
          this.add(this.dateFormatter(until.getUTCFullYear(), this.language.monthNames[until.getUTCMonth()], until.getUTCDate()));
        } else if (this.options.count) {
          this.add(gettext("for")).add(this.options.count.toString()).add(this.plural(this.options.count) ? gettext("times") : gettext("time"));
        }
        if (!this.isFullyConvertible())
          this.add(gettext("(~ approximate)"));
        return this.text.join("");
      };
      ToText2.prototype.HOURLY = function() {
        var gettext = this.gettext;
        if (this.options.interval !== 1)
          this.add(this.options.interval.toString());
        this.add(this.plural(this.options.interval) ? gettext("hours") : gettext("hour"));
      };
      ToText2.prototype.MINUTELY = function() {
        var gettext = this.gettext;
        if (this.options.interval !== 1)
          this.add(this.options.interval.toString());
        this.add(this.plural(this.options.interval) ? gettext("minutes") : gettext("minute"));
      };
      ToText2.prototype.DAILY = function() {
        var gettext = this.gettext;
        if (this.options.interval !== 1)
          this.add(this.options.interval.toString());
        if (this.byweekday && this.byweekday.isWeekdays) {
          this.add(this.plural(this.options.interval) ? gettext("weekdays") : gettext("weekday"));
        } else {
          this.add(this.plural(this.options.interval) ? gettext("days") : gettext("day"));
        }
        if (this.origOptions.bymonth) {
          this.add(gettext("in"));
          this._bymonth();
        }
        if (this.bymonthday) {
          this._bymonthday();
        } else if (this.byweekday) {
          this._byweekday();
        } else if (this.origOptions.byhour) {
          this._byhour();
        }
      };
      ToText2.prototype.WEEKLY = function() {
        var gettext = this.gettext;
        if (this.options.interval !== 1) {
          this.add(this.options.interval.toString()).add(this.plural(this.options.interval) ? gettext("weeks") : gettext("week"));
        }
        if (this.byweekday && this.byweekday.isWeekdays) {
          if (this.options.interval === 1) {
            this.add(this.plural(this.options.interval) ? gettext("weekdays") : gettext("weekday"));
          } else {
            this.add(gettext("on")).add(gettext("weekdays"));
          }
        } else if (this.byweekday && this.byweekday.isEveryDay) {
          this.add(this.plural(this.options.interval) ? gettext("days") : gettext("day"));
        } else {
          if (this.options.interval === 1)
            this.add(gettext("week"));
          if (this.origOptions.bymonth) {
            this.add(gettext("in"));
            this._bymonth();
          }
          if (this.bymonthday) {
            this._bymonthday();
          } else if (this.byweekday) {
            this._byweekday();
          }
          if (this.origOptions.byhour) {
            this._byhour();
          }
        }
      };
      ToText2.prototype.MONTHLY = function() {
        var gettext = this.gettext;
        if (this.origOptions.bymonth) {
          if (this.options.interval !== 1) {
            this.add(this.options.interval.toString()).add(gettext("months"));
            if (this.plural(this.options.interval))
              this.add(gettext("in"));
          } else {
          }
          this._bymonth();
        } else {
          if (this.options.interval !== 1) {
            this.add(this.options.interval.toString());
          }
          this.add(this.plural(this.options.interval) ? gettext("months") : gettext("month"));
        }
        if (this.bymonthday) {
          this._bymonthday();
        } else if (this.byweekday && this.byweekday.isWeekdays) {
          this.add(gettext("on")).add(gettext("weekdays"));
        } else if (this.byweekday) {
          this._byweekday();
        }
      };
      ToText2.prototype.YEARLY = function() {
        var gettext = this.gettext;
        if (this.origOptions.bymonth) {
          if (this.options.interval !== 1) {
            this.add(this.options.interval.toString());
            this.add(gettext("years"));
          } else {
          }
          this._bymonth();
        } else {
          if (this.options.interval !== 1) {
            this.add(this.options.interval.toString());
          }
          this.add(this.plural(this.options.interval) ? gettext("years") : gettext("year"));
        }
        if (this.bymonthday) {
          this._bymonthday();
        } else if (this.byweekday) {
          this._byweekday();
        }
        if (this.options.byyearday) {
          this.add(gettext("on the")).add(this.list(this.options.byyearday, this.nth, gettext("and"))).add(gettext("day"));
        }
        if (this.options.byweekno) {
          this.add(gettext("in")).add(this.plural(this.options.byweekno.length) ? gettext("weeks") : gettext("week")).add(this.list(this.options.byweekno, void 0, gettext("and")));
        }
      };
      ToText2.prototype._bymonthday = function() {
        var gettext = this.gettext;
        if (this.byweekday && this.byweekday.allWeeks) {
          this.add(gettext("on")).add(this.list(this.byweekday.allWeeks, this.weekdaytext, gettext("or"))).add(gettext("the")).add(this.list(this.bymonthday, this.nth, gettext("or")));
        } else {
          this.add(gettext("on the")).add(this.list(this.bymonthday, this.nth, gettext("and")));
        }
      };
      ToText2.prototype._byweekday = function() {
        var gettext = this.gettext;
        if (this.byweekday.allWeeks && !this.byweekday.isWeekdays) {
          this.add(gettext("on")).add(this.list(this.byweekday.allWeeks, this.weekdaytext));
        }
        if (this.byweekday.someWeeks) {
          if (this.byweekday.allWeeks)
            this.add(gettext("and"));
          this.add(gettext("on the")).add(this.list(this.byweekday.someWeeks, this.weekdaytext, gettext("and")));
        }
      };
      ToText2.prototype._byhour = function() {
        var gettext = this.gettext;
        this.add(gettext("at")).add(this.list(this.origOptions.byhour, void 0, gettext("and")));
      };
      ToText2.prototype._bymonth = function() {
        this.add(this.list(this.options.bymonth, this.monthtext, this.gettext("and")));
      };
      ToText2.prototype.nth = function(n2) {
        n2 = parseInt(n2.toString(), 10);
        var nth;
        var gettext = this.gettext;
        if (n2 === -1)
          return gettext("last");
        var npos = Math.abs(n2);
        switch (npos) {
          case 1:
          case 21:
          case 31:
            nth = npos + gettext("st");
            break;
          case 2:
          case 22:
            nth = npos + gettext("nd");
            break;
          case 3:
          case 23:
            nth = npos + gettext("rd");
            break;
          default:
            nth = npos + gettext("th");
        }
        return n2 < 0 ? nth + " " + gettext("last") : nth;
      };
      ToText2.prototype.monthtext = function(m3) {
        return this.language.monthNames[m3 - 1];
      };
      ToText2.prototype.weekdaytext = function(wday) {
        var weekday = isNumber(wday) ? (wday + 1) % 7 : wday.getJsWeekday();
        return (wday.n ? this.nth(wday.n) + " " : "") + this.language.dayNames[weekday];
      };
      ToText2.prototype.plural = function(n2) {
        return n2 % 100 !== 1;
      };
      ToText2.prototype.add = function(s3) {
        this.text.push(" ");
        this.text.push(s3);
        return this;
      };
      ToText2.prototype.list = function(arr, callback, finalDelim, delim) {
        var _this = this;
        if (delim === void 0) {
          delim = ",";
        }
        if (!isArray(arr)) {
          arr = [arr];
        }
        var delimJoin = function(array, delimiter, finalDelimiter) {
          var list = "";
          for (var i3 = 0; i3 < array.length; i3++) {
            if (i3 !== 0) {
              if (i3 === array.length - 1) {
                list += " " + finalDelimiter + " ";
              } else {
                list += delimiter + " ";
              }
            }
            list += array[i3];
          }
          return list;
        };
        callback = callback || function(o2) {
          return o2.toString();
        };
        var realCallback = function(arg) {
          return callback && callback.call(_this, arg);
        };
        if (finalDelim) {
          return delimJoin(arr.map(realCallback), delim, finalDelim);
        } else {
          return arr.map(realCallback).join(delim + " ");
        }
      };
      return ToText2;
    })()
  );
  var totext_default = ToText;

  // node_modules/rrule/dist/esm/nlp/parsetext.js
  var Parser = (
    /** @class */
    (function() {
      function Parser2(rules) {
        this.done = true;
        this.rules = rules;
      }
      Parser2.prototype.start = function(text) {
        this.text = text;
        this.done = false;
        return this.nextSymbol();
      };
      Parser2.prototype.isDone = function() {
        return this.done && this.symbol === null;
      };
      Parser2.prototype.nextSymbol = function() {
        var best;
        var bestSymbol;
        this.symbol = null;
        this.value = null;
        do {
          if (this.done)
            return false;
          var rule = void 0;
          best = null;
          for (var name_1 in this.rules) {
            rule = this.rules[name_1];
            var match = rule.exec(this.text);
            if (match) {
              if (best === null || match[0].length > best[0].length) {
                best = match;
                bestSymbol = name_1;
              }
            }
          }
          if (best != null) {
            this.text = this.text.substr(best[0].length);
            if (this.text === "")
              this.done = true;
          }
          if (best == null) {
            this.done = true;
            this.symbol = null;
            this.value = null;
            return;
          }
        } while (bestSymbol === "SKIP");
        this.symbol = bestSymbol;
        this.value = best;
        return true;
      };
      Parser2.prototype.accept = function(name) {
        if (this.symbol === name) {
          if (this.value) {
            var v3 = this.value;
            this.nextSymbol();
            return v3;
          }
          this.nextSymbol();
          return true;
        }
        return false;
      };
      Parser2.prototype.acceptNumber = function() {
        return this.accept("number");
      };
      Parser2.prototype.expect = function(name) {
        if (this.accept(name))
          return true;
        throw new Error("expected " + name + " but found " + this.symbol);
      };
      return Parser2;
    })()
  );
  function parseText(text, language) {
    if (language === void 0) {
      language = i18n_default;
    }
    var options = {};
    var ttr = new Parser(language.tokens);
    if (!ttr.start(text))
      return null;
    S2();
    return options;
    function S2() {
      ttr.expect("every");
      var n2 = ttr.acceptNumber();
      if (n2)
        options.interval = parseInt(n2[0], 10);
      if (ttr.isDone())
        throw new Error("Unexpected end");
      switch (ttr.symbol) {
        case "day(s)":
          options.freq = RRule.DAILY;
          if (ttr.nextSymbol()) {
            AT();
            F4();
          }
          break;
        // FIXME Note: every 2 weekdays != every two weeks on weekdays.
        // DAILY on weekdays is not a valid rule
        case "weekday(s)":
          options.freq = RRule.WEEKLY;
          options.byweekday = [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR];
          ttr.nextSymbol();
          AT();
          F4();
          break;
        case "week(s)":
          options.freq = RRule.WEEKLY;
          if (ttr.nextSymbol()) {
            ON();
            AT();
            F4();
          }
          break;
        case "hour(s)":
          options.freq = RRule.HOURLY;
          if (ttr.nextSymbol()) {
            ON();
            F4();
          }
          break;
        case "minute(s)":
          options.freq = RRule.MINUTELY;
          if (ttr.nextSymbol()) {
            ON();
            F4();
          }
          break;
        case "month(s)":
          options.freq = RRule.MONTHLY;
          if (ttr.nextSymbol()) {
            ON();
            F4();
          }
          break;
        case "year(s)":
          options.freq = RRule.YEARLY;
          if (ttr.nextSymbol()) {
            ON();
            F4();
          }
          break;
        case "monday":
        case "tuesday":
        case "wednesday":
        case "thursday":
        case "friday":
        case "saturday":
        case "sunday":
          options.freq = RRule.WEEKLY;
          var key = ttr.symbol.substr(0, 2).toUpperCase();
          options.byweekday = [RRule[key]];
          if (!ttr.nextSymbol())
            return;
          while (ttr.accept("comma")) {
            if (ttr.isDone())
              throw new Error("Unexpected end");
            var wkd = decodeWKD();
            if (!wkd) {
              throw new Error("Unexpected symbol " + ttr.symbol + ", expected weekday");
            }
            options.byweekday.push(RRule[wkd]);
            ttr.nextSymbol();
          }
          AT();
          MDAYs();
          F4();
          break;
        case "january":
        case "february":
        case "march":
        case "april":
        case "may":
        case "june":
        case "july":
        case "august":
        case "september":
        case "october":
        case "november":
        case "december":
          options.freq = RRule.YEARLY;
          options.bymonth = [decodeM()];
          if (!ttr.nextSymbol())
            return;
          while (ttr.accept("comma")) {
            if (ttr.isDone())
              throw new Error("Unexpected end");
            var m3 = decodeM();
            if (!m3) {
              throw new Error("Unexpected symbol " + ttr.symbol + ", expected month");
            }
            options.bymonth.push(m3);
            ttr.nextSymbol();
          }
          ON();
          F4();
          break;
        default:
          throw new Error("Unknown symbol");
      }
    }
    function ON() {
      var on = ttr.accept("on");
      var the = ttr.accept("the");
      if (!(on || the))
        return;
      do {
        var nth = decodeNTH();
        var wkd = decodeWKD();
        var m3 = decodeM();
        if (nth) {
          if (wkd) {
            ttr.nextSymbol();
            if (!options.byweekday)
              options.byweekday = [];
            options.byweekday.push(RRule[wkd].nth(nth));
          } else {
            if (!options.bymonthday)
              options.bymonthday = [];
            options.bymonthday.push(nth);
            ttr.accept("day(s)");
          }
        } else if (wkd) {
          ttr.nextSymbol();
          if (!options.byweekday)
            options.byweekday = [];
          options.byweekday.push(RRule[wkd]);
        } else if (ttr.symbol === "weekday(s)") {
          ttr.nextSymbol();
          if (!options.byweekday) {
            options.byweekday = [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR];
          }
        } else if (ttr.symbol === "week(s)") {
          ttr.nextSymbol();
          var n2 = ttr.acceptNumber();
          if (!n2) {
            throw new Error("Unexpected symbol " + ttr.symbol + ", expected week number");
          }
          options.byweekno = [parseInt(n2[0], 10)];
          while (ttr.accept("comma")) {
            n2 = ttr.acceptNumber();
            if (!n2) {
              throw new Error("Unexpected symbol " + ttr.symbol + "; expected monthday");
            }
            options.byweekno.push(parseInt(n2[0], 10));
          }
        } else if (m3) {
          ttr.nextSymbol();
          if (!options.bymonth)
            options.bymonth = [];
          options.bymonth.push(m3);
        } else {
          return;
        }
      } while (ttr.accept("comma") || ttr.accept("the") || ttr.accept("on"));
    }
    function AT() {
      var at = ttr.accept("at");
      if (!at)
        return;
      do {
        var n2 = ttr.acceptNumber();
        if (!n2) {
          throw new Error("Unexpected symbol " + ttr.symbol + ", expected hour");
        }
        options.byhour = [parseInt(n2[0], 10)];
        while (ttr.accept("comma")) {
          n2 = ttr.acceptNumber();
          if (!n2) {
            throw new Error("Unexpected symbol " + ttr.symbol + "; expected hour");
          }
          options.byhour.push(parseInt(n2[0], 10));
        }
      } while (ttr.accept("comma") || ttr.accept("at"));
    }
    function decodeM() {
      switch (ttr.symbol) {
        case "january":
          return 1;
        case "february":
          return 2;
        case "march":
          return 3;
        case "april":
          return 4;
        case "may":
          return 5;
        case "june":
          return 6;
        case "july":
          return 7;
        case "august":
          return 8;
        case "september":
          return 9;
        case "october":
          return 10;
        case "november":
          return 11;
        case "december":
          return 12;
        default:
          return false;
      }
    }
    function decodeWKD() {
      switch (ttr.symbol) {
        case "monday":
        case "tuesday":
        case "wednesday":
        case "thursday":
        case "friday":
        case "saturday":
        case "sunday":
          return ttr.symbol.substr(0, 2).toUpperCase();
        default:
          return false;
      }
    }
    function decodeNTH() {
      switch (ttr.symbol) {
        case "last":
          ttr.nextSymbol();
          return -1;
        case "first":
          ttr.nextSymbol();
          return 1;
        case "second":
          ttr.nextSymbol();
          return ttr.accept("last") ? -2 : 2;
        case "third":
          ttr.nextSymbol();
          return ttr.accept("last") ? -3 : 3;
        case "nth":
          var v3 = parseInt(ttr.value[1], 10);
          if (v3 < -366 || v3 > 366)
            throw new Error("Nth out of range: " + v3);
          ttr.nextSymbol();
          return ttr.accept("last") ? -v3 : v3;
        default:
          return false;
      }
    }
    function MDAYs() {
      ttr.accept("on");
      ttr.accept("the");
      var nth = decodeNTH();
      if (!nth)
        return;
      options.bymonthday = [nth];
      ttr.nextSymbol();
      while (ttr.accept("comma")) {
        nth = decodeNTH();
        if (!nth) {
          throw new Error("Unexpected symbol " + ttr.symbol + "; expected monthday");
        }
        options.bymonthday.push(nth);
        ttr.nextSymbol();
      }
    }
    function F4() {
      if (ttr.symbol === "until") {
        var date = Date.parse(ttr.text);
        if (!date)
          throw new Error("Cannot parse until date:" + ttr.text);
        options.until = new Date(date);
      } else if (ttr.accept("for")) {
        options.count = parseInt(ttr.value[0], 10);
        ttr.expect("number");
      }
    }
  }

  // node_modules/rrule/dist/esm/types.js
  var Frequency;
  (function(Frequency2) {
    Frequency2[Frequency2["YEARLY"] = 0] = "YEARLY";
    Frequency2[Frequency2["MONTHLY"] = 1] = "MONTHLY";
    Frequency2[Frequency2["WEEKLY"] = 2] = "WEEKLY";
    Frequency2[Frequency2["DAILY"] = 3] = "DAILY";
    Frequency2[Frequency2["HOURLY"] = 4] = "HOURLY";
    Frequency2[Frequency2["MINUTELY"] = 5] = "MINUTELY";
    Frequency2[Frequency2["SECONDLY"] = 6] = "SECONDLY";
  })(Frequency || (Frequency = {}));
  function freqIsDailyOrGreater(freq) {
    return freq < Frequency.HOURLY;
  }

  // node_modules/rrule/dist/esm/nlp/index.js
  var fromText = function(text, language) {
    if (language === void 0) {
      language = i18n_default;
    }
    return new RRule(parseText(text, language) || void 0);
  };
  var common = [
    "count",
    "until",
    "interval",
    "byweekday",
    "bymonthday",
    "bymonth"
  ];
  totext_default.IMPLEMENTED = [];
  totext_default.IMPLEMENTED[Frequency.HOURLY] = common;
  totext_default.IMPLEMENTED[Frequency.MINUTELY] = common;
  totext_default.IMPLEMENTED[Frequency.DAILY] = ["byhour"].concat(common);
  totext_default.IMPLEMENTED[Frequency.WEEKLY] = common;
  totext_default.IMPLEMENTED[Frequency.MONTHLY] = common;
  totext_default.IMPLEMENTED[Frequency.YEARLY] = ["byweekno", "byyearday"].concat(common);
  var toText = function(rrule, gettext, language, dateFormatter) {
    return new totext_default(rrule, gettext, language, dateFormatter).toString();
  };
  var isFullyConvertible = totext_default.isFullyConvertible;

  // node_modules/rrule/dist/esm/datetime.js
  var Time = (
    /** @class */
    (function() {
      function Time2(hour, minute, second, millisecond) {
        this.hour = hour;
        this.minute = minute;
        this.second = second;
        this.millisecond = millisecond || 0;
      }
      Time2.prototype.getHours = function() {
        return this.hour;
      };
      Time2.prototype.getMinutes = function() {
        return this.minute;
      };
      Time2.prototype.getSeconds = function() {
        return this.second;
      };
      Time2.prototype.getMilliseconds = function() {
        return this.millisecond;
      };
      Time2.prototype.getTime = function() {
        return (this.hour * 60 * 60 + this.minute * 60 + this.second) * 1e3 + this.millisecond;
      };
      return Time2;
    })()
  );
  var DateTime = (
    /** @class */
    (function(_super) {
      __extends(DateTime2, _super);
      function DateTime2(year, month, day, hour, minute, second, millisecond) {
        var _this = _super.call(this, hour, minute, second, millisecond) || this;
        _this.year = year;
        _this.month = month;
        _this.day = day;
        return _this;
      }
      DateTime2.fromDate = function(date) {
        return new this(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.valueOf() % 1e3);
      };
      DateTime2.prototype.getWeekday = function() {
        return getWeekday(new Date(this.getTime()));
      };
      DateTime2.prototype.getTime = function() {
        return new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second, this.millisecond)).getTime();
      };
      DateTime2.prototype.getDay = function() {
        return this.day;
      };
      DateTime2.prototype.getMonth = function() {
        return this.month;
      };
      DateTime2.prototype.getYear = function() {
        return this.year;
      };
      DateTime2.prototype.addYears = function(years) {
        this.year += years;
      };
      DateTime2.prototype.addMonths = function(months) {
        this.month += months;
        if (this.month > 12) {
          var yearDiv = Math.floor(this.month / 12);
          var monthMod = pymod(this.month, 12);
          this.month = monthMod;
          this.year += yearDiv;
          if (this.month === 0) {
            this.month = 12;
            --this.year;
          }
        }
      };
      DateTime2.prototype.addWeekly = function(days, wkst) {
        if (wkst > this.getWeekday()) {
          this.day += -(this.getWeekday() + 1 + (6 - wkst)) + days * 7;
        } else {
          this.day += -(this.getWeekday() - wkst) + days * 7;
        }
        this.fixDay();
      };
      DateTime2.prototype.addDaily = function(days) {
        this.day += days;
        this.fixDay();
      };
      DateTime2.prototype.addHours = function(hours, filtered, byhour) {
        if (filtered) {
          this.hour += Math.floor((23 - this.hour) / hours) * hours;
        }
        for (; ; ) {
          this.hour += hours;
          var _a = divmod(this.hour, 24), dayDiv = _a.div, hourMod = _a.mod;
          if (dayDiv) {
            this.hour = hourMod;
            this.addDaily(dayDiv);
          }
          if (empty(byhour) || includes(byhour, this.hour))
            break;
        }
      };
      DateTime2.prototype.addMinutes = function(minutes, filtered, byhour, byminute) {
        if (filtered) {
          this.minute += Math.floor((1439 - (this.hour * 60 + this.minute)) / minutes) * minutes;
        }
        for (; ; ) {
          this.minute += minutes;
          var _a = divmod(this.minute, 60), hourDiv = _a.div, minuteMod = _a.mod;
          if (hourDiv) {
            this.minute = minuteMod;
            this.addHours(hourDiv, false, byhour);
          }
          if ((empty(byhour) || includes(byhour, this.hour)) && (empty(byminute) || includes(byminute, this.minute))) {
            break;
          }
        }
      };
      DateTime2.prototype.addSeconds = function(seconds, filtered, byhour, byminute, bysecond) {
        if (filtered) {
          this.second += Math.floor((86399 - (this.hour * 3600 + this.minute * 60 + this.second)) / seconds) * seconds;
        }
        for (; ; ) {
          this.second += seconds;
          var _a = divmod(this.second, 60), minuteDiv = _a.div, secondMod = _a.mod;
          if (minuteDiv) {
            this.second = secondMod;
            this.addMinutes(minuteDiv, false, byhour, byminute);
          }
          if ((empty(byhour) || includes(byhour, this.hour)) && (empty(byminute) || includes(byminute, this.minute)) && (empty(bysecond) || includes(bysecond, this.second))) {
            break;
          }
        }
      };
      DateTime2.prototype.fixDay = function() {
        if (this.day <= 28) {
          return;
        }
        var daysinmonth = monthRange(this.year, this.month - 1)[1];
        if (this.day <= daysinmonth) {
          return;
        }
        while (this.day > daysinmonth) {
          this.day -= daysinmonth;
          ++this.month;
          if (this.month === 13) {
            this.month = 1;
            ++this.year;
            if (this.year > MAXYEAR) {
              return;
            }
          }
          daysinmonth = monthRange(this.year, this.month - 1)[1];
        }
      };
      DateTime2.prototype.add = function(options, filtered) {
        var freq = options.freq, interval = options.interval, wkst = options.wkst, byhour = options.byhour, byminute = options.byminute, bysecond = options.bysecond;
        switch (freq) {
          case Frequency.YEARLY:
            return this.addYears(interval);
          case Frequency.MONTHLY:
            return this.addMonths(interval);
          case Frequency.WEEKLY:
            return this.addWeekly(interval, wkst);
          case Frequency.DAILY:
            return this.addDaily(interval);
          case Frequency.HOURLY:
            return this.addHours(interval, filtered, byhour);
          case Frequency.MINUTELY:
            return this.addMinutes(interval, filtered, byhour, byminute);
          case Frequency.SECONDLY:
            return this.addSeconds(interval, filtered, byhour, byminute, bysecond);
        }
      };
      return DateTime2;
    })(Time)
  );

  // node_modules/rrule/dist/esm/parseoptions.js
  function initializeOptions(options) {
    var invalid = [];
    var keys = Object.keys(options);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
      var key = keys_1[_i];
      if (!includes(defaultKeys, key))
        invalid.push(key);
      if (isDate(options[key]) && !isValidDate2(options[key])) {
        invalid.push(key);
      }
    }
    if (invalid.length) {
      throw new Error("Invalid options: " + invalid.join(", "));
    }
    return __assign({}, options);
  }
  function parseOptions(options) {
    var opts = __assign(__assign({}, DEFAULT_OPTIONS), initializeOptions(options));
    if (isPresent(opts.byeaster))
      opts.freq = RRule.YEARLY;
    if (!(isPresent(opts.freq) && RRule.FREQUENCIES[opts.freq])) {
      throw new Error("Invalid frequency: ".concat(opts.freq, " ").concat(options.freq));
    }
    if (!opts.dtstart)
      opts.dtstart = new Date((/* @__PURE__ */ new Date()).setMilliseconds(0));
    if (!isPresent(opts.wkst)) {
      opts.wkst = RRule.MO.weekday;
    } else if (isNumber(opts.wkst)) {
    } else {
      opts.wkst = opts.wkst.weekday;
    }
    if (isPresent(opts.bysetpos)) {
      if (isNumber(opts.bysetpos))
        opts.bysetpos = [opts.bysetpos];
      for (var i3 = 0; i3 < opts.bysetpos.length; i3++) {
        var v3 = opts.bysetpos[i3];
        if (v3 === 0 || !(v3 >= -366 && v3 <= 366)) {
          throw new Error("bysetpos must be between 1 and 366, or between -366 and -1");
        }
      }
    }
    if (!(Boolean(opts.byweekno) || notEmpty(opts.byweekno) || notEmpty(opts.byyearday) || Boolean(opts.bymonthday) || notEmpty(opts.bymonthday) || isPresent(opts.byweekday) || isPresent(opts.byeaster))) {
      switch (opts.freq) {
        case RRule.YEARLY:
          if (!opts.bymonth)
            opts.bymonth = opts.dtstart.getUTCMonth() + 1;
          opts.bymonthday = opts.dtstart.getUTCDate();
          break;
        case RRule.MONTHLY:
          opts.bymonthday = opts.dtstart.getUTCDate();
          break;
        case RRule.WEEKLY:
          opts.byweekday = [getWeekday(opts.dtstart)];
          break;
      }
    }
    if (isPresent(opts.bymonth) && !isArray(opts.bymonth)) {
      opts.bymonth = [opts.bymonth];
    }
    if (isPresent(opts.byyearday) && !isArray(opts.byyearday) && isNumber(opts.byyearday)) {
      opts.byyearday = [opts.byyearday];
    }
    if (!isPresent(opts.bymonthday)) {
      opts.bymonthday = [];
      opts.bynmonthday = [];
    } else if (isArray(opts.bymonthday)) {
      var bymonthday = [];
      var bynmonthday = [];
      for (var i3 = 0; i3 < opts.bymonthday.length; i3++) {
        var v3 = opts.bymonthday[i3];
        if (v3 > 0) {
          bymonthday.push(v3);
        } else if (v3 < 0) {
          bynmonthday.push(v3);
        }
      }
      opts.bymonthday = bymonthday;
      opts.bynmonthday = bynmonthday;
    } else if (opts.bymonthday < 0) {
      opts.bynmonthday = [opts.bymonthday];
      opts.bymonthday = [];
    } else {
      opts.bynmonthday = [];
      opts.bymonthday = [opts.bymonthday];
    }
    if (isPresent(opts.byweekno) && !isArray(opts.byweekno)) {
      opts.byweekno = [opts.byweekno];
    }
    if (!isPresent(opts.byweekday)) {
      opts.bynweekday = null;
    } else if (isNumber(opts.byweekday)) {
      opts.byweekday = [opts.byweekday];
      opts.bynweekday = null;
    } else if (isWeekdayStr(opts.byweekday)) {
      opts.byweekday = [Weekday.fromStr(opts.byweekday).weekday];
      opts.bynweekday = null;
    } else if (opts.byweekday instanceof Weekday) {
      if (!opts.byweekday.n || opts.freq > RRule.MONTHLY) {
        opts.byweekday = [opts.byweekday.weekday];
        opts.bynweekday = null;
      } else {
        opts.bynweekday = [[opts.byweekday.weekday, opts.byweekday.n]];
        opts.byweekday = null;
      }
    } else {
      var byweekday = [];
      var bynweekday = [];
      for (var i3 = 0; i3 < opts.byweekday.length; i3++) {
        var wday = opts.byweekday[i3];
        if (isNumber(wday)) {
          byweekday.push(wday);
          continue;
        } else if (isWeekdayStr(wday)) {
          byweekday.push(Weekday.fromStr(wday).weekday);
          continue;
        }
        if (!wday.n || opts.freq > RRule.MONTHLY) {
          byweekday.push(wday.weekday);
        } else {
          bynweekday.push([wday.weekday, wday.n]);
        }
      }
      opts.byweekday = notEmpty(byweekday) ? byweekday : null;
      opts.bynweekday = notEmpty(bynweekday) ? bynweekday : null;
    }
    if (!isPresent(opts.byhour)) {
      opts.byhour = opts.freq < RRule.HOURLY ? [opts.dtstart.getUTCHours()] : null;
    } else if (isNumber(opts.byhour)) {
      opts.byhour = [opts.byhour];
    }
    if (!isPresent(opts.byminute)) {
      opts.byminute = opts.freq < RRule.MINUTELY ? [opts.dtstart.getUTCMinutes()] : null;
    } else if (isNumber(opts.byminute)) {
      opts.byminute = [opts.byminute];
    }
    if (!isPresent(opts.bysecond)) {
      opts.bysecond = opts.freq < RRule.SECONDLY ? [opts.dtstart.getUTCSeconds()] : null;
    } else if (isNumber(opts.bysecond)) {
      opts.bysecond = [opts.bysecond];
    }
    return { parsedOptions: opts };
  }
  function buildTimeset(opts) {
    var millisecondModulo = opts.dtstart.getTime() % 1e3;
    if (!freqIsDailyOrGreater(opts.freq)) {
      return [];
    }
    var timeset = [];
    opts.byhour.forEach(function(hour) {
      opts.byminute.forEach(function(minute) {
        opts.bysecond.forEach(function(second) {
          timeset.push(new Time(hour, minute, second, millisecondModulo));
        });
      });
    });
    return timeset;
  }

  // node_modules/rrule/dist/esm/parsestring.js
  function parseString2(rfcString) {
    var options = rfcString.split("\n").map(parseLine).filter(function(x4) {
      return x4 !== null;
    });
    return __assign(__assign({}, options[0]), options[1]);
  }
  function parseDtstart(line) {
    var options = {};
    var dtstartWithZone = /DTSTART(?:;TZID=([^:=]+?))?(?::|=)([^;\s]+)/i.exec(line);
    if (!dtstartWithZone) {
      return options;
    }
    var tzid = dtstartWithZone[1], dtstart = dtstartWithZone[2];
    if (tzid) {
      options.tzid = tzid;
    }
    options.dtstart = untilStringToDate(dtstart);
    return options;
  }
  function parseLine(rfcString) {
    rfcString = rfcString.replace(/^\s+|\s+$/, "");
    if (!rfcString.length)
      return null;
    var header = /^([A-Z]+?)[:;]/.exec(rfcString.toUpperCase());
    if (!header) {
      return parseRrule(rfcString);
    }
    var key = header[1];
    switch (key.toUpperCase()) {
      case "RRULE":
      case "EXRULE":
        return parseRrule(rfcString);
      case "DTSTART":
        return parseDtstart(rfcString);
      default:
        throw new Error("Unsupported RFC prop ".concat(key, " in ").concat(rfcString));
    }
  }
  function parseRrule(line) {
    var strippedLine = line.replace(/^RRULE:/i, "");
    var options = parseDtstart(strippedLine);
    var attrs = line.replace(/^(?:RRULE|EXRULE):/i, "").split(";");
    attrs.forEach(function(attr) {
      var _a = attr.split("="), key = _a[0], value = _a[1];
      switch (key.toUpperCase()) {
        case "FREQ":
          options.freq = Frequency[value.toUpperCase()];
          break;
        case "WKST":
          options.wkst = Days[value.toUpperCase()];
          break;
        case "COUNT":
        case "INTERVAL":
        case "BYSETPOS":
        case "BYMONTH":
        case "BYMONTHDAY":
        case "BYYEARDAY":
        case "BYWEEKNO":
        case "BYHOUR":
        case "BYMINUTE":
        case "BYSECOND":
          var num = parseNumber(value);
          var optionKey = key.toLowerCase();
          options[optionKey] = num;
          break;
        case "BYWEEKDAY":
        case "BYDAY":
          options.byweekday = parseWeekday(value);
          break;
        case "DTSTART":
        case "TZID":
          var dtstart = parseDtstart(line);
          options.tzid = dtstart.tzid;
          options.dtstart = dtstart.dtstart;
          break;
        case "UNTIL":
          options.until = untilStringToDate(value);
          break;
        case "BYEASTER":
          options.byeaster = Number(value);
          break;
        default:
          throw new Error("Unknown RRULE property '" + key + "'");
      }
    });
    return options;
  }
  function parseNumber(value) {
    if (value.indexOf(",") !== -1) {
      var values = value.split(",");
      return values.map(parseIndividualNumber);
    }
    return parseIndividualNumber(value);
  }
  function parseIndividualNumber(value) {
    if (/^[+-]?\d+$/.test(value)) {
      return Number(value);
    }
    return value;
  }
  function parseWeekday(value) {
    var days = value.split(",");
    return days.map(function(day) {
      if (day.length === 2) {
        return Days[day];
      }
      var parts = day.match(/^([+-]?\d{1,2})([A-Z]{2})$/);
      if (!parts || parts.length < 3) {
        throw new SyntaxError("Invalid weekday string: ".concat(day));
      }
      var n2 = Number(parts[1]);
      var wdaypart = parts[2];
      var wday = Days[wdaypart].weekday;
      return new Weekday(wday, n2);
    });
  }

  // node_modules/rrule/dist/esm/datewithzone.js
  var DateWithZone = (
    /** @class */
    (function() {
      function DateWithZone2(date, tzid) {
        if (isNaN(date.getTime())) {
          throw new RangeError("Invalid date passed to DateWithZone");
        }
        this.date = date;
        this.tzid = tzid;
      }
      Object.defineProperty(DateWithZone2.prototype, "isUTC", {
        get: function() {
          return !this.tzid || this.tzid.toUpperCase() === "UTC";
        },
        enumerable: false,
        configurable: true
      });
      DateWithZone2.prototype.toString = function() {
        var datestr = timeToUntilString(this.date.getTime(), this.isUTC);
        if (!this.isUTC) {
          return ";TZID=".concat(this.tzid, ":").concat(datestr);
        }
        return ":".concat(datestr);
      };
      DateWithZone2.prototype.getTime = function() {
        return this.date.getTime();
      };
      DateWithZone2.prototype.rezonedDate = function() {
        if (this.isUTC) {
          return this.date;
        }
        return dateInTimeZone(this.date, this.tzid);
      };
      return DateWithZone2;
    })()
  );

  // node_modules/rrule/dist/esm/optionstostring.js
  function optionsToString(options) {
    var rrule = [];
    var dtstart = "";
    var keys = Object.keys(options);
    var defaultKeys2 = Object.keys(DEFAULT_OPTIONS);
    for (var i3 = 0; i3 < keys.length; i3++) {
      if (keys[i3] === "tzid")
        continue;
      if (!includes(defaultKeys2, keys[i3]))
        continue;
      var key = keys[i3].toUpperCase();
      var value = options[keys[i3]];
      var outValue = "";
      if (!isPresent(value) || isArray(value) && !value.length)
        continue;
      switch (key) {
        case "FREQ":
          outValue = RRule.FREQUENCIES[options.freq];
          break;
        case "WKST":
          if (isNumber(value)) {
            outValue = new Weekday(value).toString();
          } else {
            outValue = value.toString();
          }
          break;
        case "BYWEEKDAY":
          key = "BYDAY";
          outValue = toArray(value).map(function(wday) {
            if (wday instanceof Weekday) {
              return wday;
            }
            if (isArray(wday)) {
              return new Weekday(wday[0], wday[1]);
            }
            return new Weekday(wday);
          }).toString();
          break;
        case "DTSTART":
          dtstart = buildDtstart(value, options.tzid);
          break;
        case "UNTIL":
          outValue = timeToUntilString(value, !options.tzid);
          break;
        default:
          if (isArray(value)) {
            var strValues = [];
            for (var j4 = 0; j4 < value.length; j4++) {
              strValues[j4] = String(value[j4]);
            }
            outValue = strValues.toString();
          } else {
            outValue = String(value);
          }
      }
      if (outValue) {
        rrule.push([key, outValue]);
      }
    }
    var rules = rrule.map(function(_a) {
      var key2 = _a[0], value2 = _a[1];
      return "".concat(key2, "=").concat(value2.toString());
    }).join(";");
    var ruleString = "";
    if (rules !== "") {
      ruleString = "RRULE:".concat(rules);
    }
    return [dtstart, ruleString].filter(function(x4) {
      return !!x4;
    }).join("\n");
  }
  function buildDtstart(dtstart, tzid) {
    if (!dtstart) {
      return "";
    }
    return "DTSTART" + new DateWithZone(new Date(dtstart), tzid).toString();
  }

  // node_modules/rrule/dist/esm/cache.js
  function argsMatch(left, right) {
    if (Array.isArray(left)) {
      if (!Array.isArray(right))
        return false;
      if (left.length !== right.length)
        return false;
      return left.every(function(date, i3) {
        return date.getTime() === right[i3].getTime();
      });
    }
    if (left instanceof Date) {
      return right instanceof Date && left.getTime() === right.getTime();
    }
    return left === right;
  }
  var Cache = (
    /** @class */
    (function() {
      function Cache2() {
        this.all = false;
        this.before = [];
        this.after = [];
        this.between = [];
      }
      Cache2.prototype._cacheAdd = function(what, value, args) {
        if (value) {
          value = value instanceof Date ? clone(value) : cloneDates(value);
        }
        if (what === "all") {
          this.all = value;
        } else {
          args._value = value;
          this[what].push(args);
        }
      };
      Cache2.prototype._cacheGet = function(what, args) {
        var cached = false;
        var argsKeys = args ? Object.keys(args) : [];
        var findCacheDiff = function(item2) {
          for (var i4 = 0; i4 < argsKeys.length; i4++) {
            var key = argsKeys[i4];
            if (!argsMatch(args[key], item2[key])) {
              return true;
            }
          }
          return false;
        };
        var cachedObject = this[what];
        if (what === "all") {
          cached = this.all;
        } else if (isArray(cachedObject)) {
          for (var i3 = 0; i3 < cachedObject.length; i3++) {
            var item = cachedObject[i3];
            if (argsKeys.length && findCacheDiff(item))
              continue;
            cached = item._value;
            break;
          }
        }
        if (!cached && this.all) {
          var iterResult = new iterresult_default(what, args);
          for (var i3 = 0; i3 < this.all.length; i3++) {
            if (!iterResult.accept(this.all[i3]))
              break;
          }
          cached = iterResult.getValue();
          this._cacheAdd(what, cached, args);
        }
        return isArray(cached) ? cloneDates(cached) : cached instanceof Date ? clone(cached) : cached;
      };
      return Cache2;
    })()
  );

  // node_modules/rrule/dist/esm/masks.js
  var M365MASK = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], repeat(1, 31), true), repeat(2, 28), true), repeat(3, 31), true), repeat(4, 30), true), repeat(5, 31), true), repeat(6, 30), true), repeat(7, 31), true), repeat(8, 31), true), repeat(9, 30), true), repeat(10, 31), true), repeat(11, 30), true), repeat(12, 31), true), repeat(1, 7), true);
  var M366MASK = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], repeat(1, 31), true), repeat(2, 29), true), repeat(3, 31), true), repeat(4, 30), true), repeat(5, 31), true), repeat(6, 30), true), repeat(7, 31), true), repeat(8, 31), true), repeat(9, 30), true), repeat(10, 31), true), repeat(11, 30), true), repeat(12, 31), true), repeat(1, 7), true);
  var M28 = range(1, 29);
  var M29 = range(1, 30);
  var M30 = range(1, 31);
  var M31 = range(1, 32);
  var MDAY366MASK = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], M31, true), M29, true), M31, true), M30, true), M31, true), M30, true), M31, true), M31, true), M30, true), M31, true), M30, true), M31, true), M31.slice(0, 7), true);
  var MDAY365MASK = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], M31, true), M28, true), M31, true), M30, true), M31, true), M30, true), M31, true), M31, true), M30, true), M31, true), M30, true), M31, true), M31.slice(0, 7), true);
  var NM28 = range(-28, 0);
  var NM29 = range(-29, 0);
  var NM30 = range(-30, 0);
  var NM31 = range(-31, 0);
  var NMDAY366MASK = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], NM31, true), NM29, true), NM31, true), NM30, true), NM31, true), NM30, true), NM31, true), NM31, true), NM30, true), NM31, true), NM30, true), NM31, true), NM31.slice(0, 7), true);
  var NMDAY365MASK = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], NM31, true), NM28, true), NM31, true), NM30, true), NM31, true), NM30, true), NM31, true), NM31, true), NM30, true), NM31, true), NM30, true), NM31, true), NM31.slice(0, 7), true);
  var M366RANGE = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];
  var M365RANGE = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
  var WDAYMASK = (function() {
    var wdaymask = [];
    for (var i3 = 0; i3 < 55; i3++)
      wdaymask = wdaymask.concat(range(7));
    return wdaymask;
  })();

  // node_modules/rrule/dist/esm/iterinfo/yearinfo.js
  function rebuildYear(year, options) {
    var firstyday = datetime(year, 1, 1);
    var yearlen = isLeapYear(year) ? 366 : 365;
    var nextyearlen = isLeapYear(year + 1) ? 366 : 365;
    var yearordinal = toOrdinal(firstyday);
    var yearweekday = getWeekday(firstyday);
    var result = __assign(__assign({ yearlen, nextyearlen, yearordinal, yearweekday }, baseYearMasks(year)), { wnomask: null });
    if (empty(options.byweekno)) {
      return result;
    }
    result.wnomask = repeat(0, yearlen + 7);
    var firstwkst;
    var wyearlen;
    var no1wkst = firstwkst = pymod(7 - yearweekday + options.wkst, 7);
    if (no1wkst >= 4) {
      no1wkst = 0;
      wyearlen = result.yearlen + pymod(yearweekday - options.wkst, 7);
    } else {
      wyearlen = yearlen - no1wkst;
    }
    var div = Math.floor(wyearlen / 7);
    var mod = pymod(wyearlen, 7);
    var numweeks = Math.floor(div + mod / 4);
    for (var j4 = 0; j4 < options.byweekno.length; j4++) {
      var n2 = options.byweekno[j4];
      if (n2 < 0) {
        n2 += numweeks + 1;
      }
      if (!(n2 > 0 && n2 <= numweeks)) {
        continue;
      }
      var i3 = void 0;
      if (n2 > 1) {
        i3 = no1wkst + (n2 - 1) * 7;
        if (no1wkst !== firstwkst) {
          i3 -= 7 - firstwkst;
        }
      } else {
        i3 = no1wkst;
      }
      for (var k3 = 0; k3 < 7; k3++) {
        result.wnomask[i3] = 1;
        i3++;
        if (result.wdaymask[i3] === options.wkst)
          break;
      }
    }
    if (includes(options.byweekno, 1)) {
      var i3 = no1wkst + numweeks * 7;
      if (no1wkst !== firstwkst)
        i3 -= 7 - firstwkst;
      if (i3 < yearlen) {
        for (var j4 = 0; j4 < 7; j4++) {
          result.wnomask[i3] = 1;
          i3 += 1;
          if (result.wdaymask[i3] === options.wkst)
            break;
        }
      }
    }
    if (no1wkst) {
      var lnumweeks = void 0;
      if (!includes(options.byweekno, -1)) {
        var lyearweekday = getWeekday(datetime(year - 1, 1, 1));
        var lno1wkst = pymod(7 - lyearweekday.valueOf() + options.wkst, 7);
        var lyearlen = isLeapYear(year - 1) ? 366 : 365;
        var weekst = void 0;
        if (lno1wkst >= 4) {
          lno1wkst = 0;
          weekst = lyearlen + pymod(lyearweekday - options.wkst, 7);
        } else {
          weekst = yearlen - no1wkst;
        }
        lnumweeks = Math.floor(52 + pymod(weekst, 7) / 4);
      } else {
        lnumweeks = -1;
      }
      if (includes(options.byweekno, lnumweeks)) {
        for (var i3 = 0; i3 < no1wkst; i3++)
          result.wnomask[i3] = 1;
      }
    }
    return result;
  }
  function baseYearMasks(year) {
    var yearlen = isLeapYear(year) ? 366 : 365;
    var firstyday = datetime(year, 1, 1);
    var wday = getWeekday(firstyday);
    if (yearlen === 365) {
      return {
        mmask: M365MASK,
        mdaymask: MDAY365MASK,
        nmdaymask: NMDAY365MASK,
        wdaymask: WDAYMASK.slice(wday),
        mrange: M365RANGE
      };
    }
    return {
      mmask: M366MASK,
      mdaymask: MDAY366MASK,
      nmdaymask: NMDAY366MASK,
      wdaymask: WDAYMASK.slice(wday),
      mrange: M366RANGE
    };
  }

  // node_modules/rrule/dist/esm/iterinfo/monthinfo.js
  function rebuildMonth(year, month, yearlen, mrange, wdaymask, options) {
    var result = {
      lastyear: year,
      lastmonth: month,
      nwdaymask: []
    };
    var ranges = [];
    if (options.freq === RRule.YEARLY) {
      if (empty(options.bymonth)) {
        ranges = [[0, yearlen]];
      } else {
        for (var j4 = 0; j4 < options.bymonth.length; j4++) {
          month = options.bymonth[j4];
          ranges.push(mrange.slice(month - 1, month + 1));
        }
      }
    } else if (options.freq === RRule.MONTHLY) {
      ranges = [mrange.slice(month - 1, month + 1)];
    }
    if (empty(ranges)) {
      return result;
    }
    result.nwdaymask = repeat(0, yearlen);
    for (var j4 = 0; j4 < ranges.length; j4++) {
      var rang = ranges[j4];
      var first = rang[0];
      var last = rang[1] - 1;
      for (var k3 = 0; k3 < options.bynweekday.length; k3++) {
        var i3 = void 0;
        var _a = options.bynweekday[k3], wday = _a[0], n2 = _a[1];
        if (n2 < 0) {
          i3 = last + (n2 + 1) * 7;
          i3 -= pymod(wdaymask[i3] - wday, 7);
        } else {
          i3 = first + (n2 - 1) * 7;
          i3 += pymod(7 - wdaymask[i3] + wday, 7);
        }
        if (first <= i3 && i3 <= last)
          result.nwdaymask[i3] = 1;
      }
    }
    return result;
  }

  // node_modules/rrule/dist/esm/iterinfo/easter.js
  function easter(y3, offset) {
    if (offset === void 0) {
      offset = 0;
    }
    var a3 = y3 % 19;
    var b3 = Math.floor(y3 / 100);
    var c3 = y3 % 100;
    var d2 = Math.floor(b3 / 4);
    var e3 = b3 % 4;
    var f3 = Math.floor((b3 + 8) / 25);
    var g4 = Math.floor((b3 - f3 + 1) / 3);
    var h3 = Math.floor(19 * a3 + b3 - d2 - g4 + 15) % 30;
    var i3 = Math.floor(c3 / 4);
    var k3 = c3 % 4;
    var l79 = Math.floor(32 + 2 * e3 + 2 * i3 - h3 - k3) % 7;
    var m3 = Math.floor((a3 + 11 * h3 + 22 * l79) / 451);
    var month = Math.floor((h3 + l79 - 7 * m3 + 114) / 31);
    var day = (h3 + l79 - 7 * m3 + 114) % 31 + 1;
    var date = Date.UTC(y3, month - 1, day + offset);
    var yearStart = Date.UTC(y3, 0, 1);
    return [Math.ceil((date - yearStart) / (1e3 * 60 * 60 * 24))];
  }

  // node_modules/rrule/dist/esm/iterinfo/index.js
  var Iterinfo = (
    /** @class */
    (function() {
      function Iterinfo2(options) {
        this.options = options;
      }
      Iterinfo2.prototype.rebuild = function(year, month) {
        var options = this.options;
        if (year !== this.lastyear) {
          this.yearinfo = rebuildYear(year, options);
        }
        if (notEmpty(options.bynweekday) && (month !== this.lastmonth || year !== this.lastyear)) {
          var _a = this.yearinfo, yearlen = _a.yearlen, mrange = _a.mrange, wdaymask = _a.wdaymask;
          this.monthinfo = rebuildMonth(year, month, yearlen, mrange, wdaymask, options);
        }
        if (isPresent(options.byeaster)) {
          this.eastermask = easter(year, options.byeaster);
        }
      };
      Object.defineProperty(Iterinfo2.prototype, "lastyear", {
        get: function() {
          return this.monthinfo ? this.monthinfo.lastyear : null;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Iterinfo2.prototype, "lastmonth", {
        get: function() {
          return this.monthinfo ? this.monthinfo.lastmonth : null;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Iterinfo2.prototype, "yearlen", {
        get: function() {
          return this.yearinfo.yearlen;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Iterinfo2.prototype, "yearordinal", {
        get: function() {
          return this.yearinfo.yearordinal;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Iterinfo2.prototype, "mrange", {
        get: function() {
          return this.yearinfo.mrange;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Iterinfo2.prototype, "wdaymask", {
        get: function() {
          return this.yearinfo.wdaymask;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Iterinfo2.prototype, "mmask", {
        get: function() {
          return this.yearinfo.mmask;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Iterinfo2.prototype, "wnomask", {
        get: function() {
          return this.yearinfo.wnomask;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Iterinfo2.prototype, "nwdaymask", {
        get: function() {
          return this.monthinfo ? this.monthinfo.nwdaymask : [];
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Iterinfo2.prototype, "nextyearlen", {
        get: function() {
          return this.yearinfo.nextyearlen;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Iterinfo2.prototype, "mdaymask", {
        get: function() {
          return this.yearinfo.mdaymask;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Iterinfo2.prototype, "nmdaymask", {
        get: function() {
          return this.yearinfo.nmdaymask;
        },
        enumerable: false,
        configurable: true
      });
      Iterinfo2.prototype.ydayset = function() {
        return [range(this.yearlen), 0, this.yearlen];
      };
      Iterinfo2.prototype.mdayset = function(_3, month) {
        var start = this.mrange[month - 1];
        var end = this.mrange[month];
        var set = repeat(null, this.yearlen);
        for (var i3 = start; i3 < end; i3++)
          set[i3] = i3;
        return [set, start, end];
      };
      Iterinfo2.prototype.wdayset = function(year, month, day) {
        var set = repeat(null, this.yearlen + 7);
        var i3 = toOrdinal(datetime(year, month, day)) - this.yearordinal;
        var start = i3;
        for (var j4 = 0; j4 < 7; j4++) {
          set[i3] = i3;
          ++i3;
          if (this.wdaymask[i3] === this.options.wkst)
            break;
        }
        return [set, start, i3];
      };
      Iterinfo2.prototype.ddayset = function(year, month, day) {
        var set = repeat(null, this.yearlen);
        var i3 = toOrdinal(datetime(year, month, day)) - this.yearordinal;
        set[i3] = i3;
        return [set, i3, i3 + 1];
      };
      Iterinfo2.prototype.htimeset = function(hour, _3, second, millisecond) {
        var _this = this;
        var set = [];
        this.options.byminute.forEach(function(minute) {
          set = set.concat(_this.mtimeset(hour, minute, second, millisecond));
        });
        sort(set);
        return set;
      };
      Iterinfo2.prototype.mtimeset = function(hour, minute, _3, millisecond) {
        var set = this.options.bysecond.map(function(second) {
          return new Time(hour, minute, second, millisecond);
        });
        sort(set);
        return set;
      };
      Iterinfo2.prototype.stimeset = function(hour, minute, second, millisecond) {
        return [new Time(hour, minute, second, millisecond)];
      };
      Iterinfo2.prototype.getdayset = function(freq) {
        switch (freq) {
          case Frequency.YEARLY:
            return this.ydayset.bind(this);
          case Frequency.MONTHLY:
            return this.mdayset.bind(this);
          case Frequency.WEEKLY:
            return this.wdayset.bind(this);
          case Frequency.DAILY:
            return this.ddayset.bind(this);
          default:
            return this.ddayset.bind(this);
        }
      };
      Iterinfo2.prototype.gettimeset = function(freq) {
        switch (freq) {
          case Frequency.HOURLY:
            return this.htimeset.bind(this);
          case Frequency.MINUTELY:
            return this.mtimeset.bind(this);
          case Frequency.SECONDLY:
            return this.stimeset.bind(this);
        }
      };
      return Iterinfo2;
    })()
  );
  var iterinfo_default = Iterinfo;

  // node_modules/rrule/dist/esm/iter/poslist.js
  function buildPoslist(bysetpos, timeset, start, end, ii, dayset) {
    var poslist = [];
    for (var j4 = 0; j4 < bysetpos.length; j4++) {
      var daypos = void 0;
      var timepos = void 0;
      var pos = bysetpos[j4];
      if (pos < 0) {
        daypos = Math.floor(pos / timeset.length);
        timepos = pymod(pos, timeset.length);
      } else {
        daypos = Math.floor((pos - 1) / timeset.length);
        timepos = pymod(pos - 1, timeset.length);
      }
      var tmp = [];
      for (var k3 = start; k3 < end; k3++) {
        var val = dayset[k3];
        if (!isPresent(val))
          continue;
        tmp.push(val);
      }
      var i3 = void 0;
      if (daypos < 0) {
        i3 = tmp.slice(daypos)[0];
      } else {
        i3 = tmp[daypos];
      }
      var time = timeset[timepos];
      var date = fromOrdinal(ii.yearordinal + i3);
      var res = combine(date, time);
      if (!includes(poslist, res))
        poslist.push(res);
    }
    sort(poslist);
    return poslist;
  }

  // node_modules/rrule/dist/esm/iter/index.js
  function iter(iterResult, options) {
    var dtstart = options.dtstart, freq = options.freq, interval = options.interval, until = options.until, bysetpos = options.bysetpos;
    var count = options.count;
    if (count === 0 || interval === 0) {
      return emitResult(iterResult);
    }
    var counterDate = DateTime.fromDate(dtstart);
    var ii = new iterinfo_default(options);
    ii.rebuild(counterDate.year, counterDate.month);
    var timeset = makeTimeset(ii, counterDate, options);
    for (; ; ) {
      var _a = ii.getdayset(freq)(counterDate.year, counterDate.month, counterDate.day), dayset = _a[0], start = _a[1], end = _a[2];
      var filtered = removeFilteredDays(dayset, start, end, ii, options);
      if (notEmpty(bysetpos)) {
        var poslist = buildPoslist(bysetpos, timeset, start, end, ii, dayset);
        for (var j4 = 0; j4 < poslist.length; j4++) {
          var res = poslist[j4];
          if (until && res > until) {
            return emitResult(iterResult);
          }
          if (res >= dtstart) {
            var rezonedDate = rezoneIfNeeded(res, options);
            if (!iterResult.accept(rezonedDate)) {
              return emitResult(iterResult);
            }
            if (count) {
              --count;
              if (!count) {
                return emitResult(iterResult);
              }
            }
          }
        }
      } else {
        for (var j4 = start; j4 < end; j4++) {
          var currentDay = dayset[j4];
          if (!isPresent(currentDay)) {
            continue;
          }
          var date = fromOrdinal(ii.yearordinal + currentDay);
          for (var k3 = 0; k3 < timeset.length; k3++) {
            var time = timeset[k3];
            var res = combine(date, time);
            if (until && res > until) {
              return emitResult(iterResult);
            }
            if (res >= dtstart) {
              var rezonedDate = rezoneIfNeeded(res, options);
              if (!iterResult.accept(rezonedDate)) {
                return emitResult(iterResult);
              }
              if (count) {
                --count;
                if (!count) {
                  return emitResult(iterResult);
                }
              }
            }
          }
        }
      }
      if (options.interval === 0) {
        return emitResult(iterResult);
      }
      counterDate.add(options, filtered);
      if (counterDate.year > MAXYEAR) {
        return emitResult(iterResult);
      }
      if (!freqIsDailyOrGreater(freq)) {
        timeset = ii.gettimeset(freq)(counterDate.hour, counterDate.minute, counterDate.second, 0);
      }
      ii.rebuild(counterDate.year, counterDate.month);
    }
  }
  function isFiltered(ii, currentDay, options) {
    var bymonth = options.bymonth, byweekno = options.byweekno, byweekday = options.byweekday, byeaster = options.byeaster, bymonthday = options.bymonthday, bynmonthday = options.bynmonthday, byyearday = options.byyearday;
    return notEmpty(bymonth) && !includes(bymonth, ii.mmask[currentDay]) || notEmpty(byweekno) && !ii.wnomask[currentDay] || notEmpty(byweekday) && !includes(byweekday, ii.wdaymask[currentDay]) || notEmpty(ii.nwdaymask) && !ii.nwdaymask[currentDay] || byeaster !== null && !includes(ii.eastermask, currentDay) || (notEmpty(bymonthday) || notEmpty(bynmonthday)) && !includes(bymonthday, ii.mdaymask[currentDay]) && !includes(bynmonthday, ii.nmdaymask[currentDay]) || notEmpty(byyearday) && (currentDay < ii.yearlen && !includes(byyearday, currentDay + 1) && !includes(byyearday, -ii.yearlen + currentDay) || currentDay >= ii.yearlen && !includes(byyearday, currentDay + 1 - ii.yearlen) && !includes(byyearday, -ii.nextyearlen + currentDay - ii.yearlen));
  }
  function rezoneIfNeeded(date, options) {
    return new DateWithZone(date, options.tzid).rezonedDate();
  }
  function emitResult(iterResult) {
    return iterResult.getValue();
  }
  function removeFilteredDays(dayset, start, end, ii, options) {
    var filtered = false;
    for (var dayCounter = start; dayCounter < end; dayCounter++) {
      var currentDay = dayset[dayCounter];
      filtered = isFiltered(ii, currentDay, options);
      if (filtered)
        dayset[currentDay] = null;
    }
    return filtered;
  }
  function makeTimeset(ii, counterDate, options) {
    var freq = options.freq, byhour = options.byhour, byminute = options.byminute, bysecond = options.bysecond;
    if (freqIsDailyOrGreater(freq)) {
      return buildTimeset(options);
    }
    if (freq >= RRule.HOURLY && notEmpty(byhour) && !includes(byhour, counterDate.hour) || freq >= RRule.MINUTELY && notEmpty(byminute) && !includes(byminute, counterDate.minute) || freq >= RRule.SECONDLY && notEmpty(bysecond) && !includes(bysecond, counterDate.second)) {
      return [];
    }
    return ii.gettimeset(freq)(counterDate.hour, counterDate.minute, counterDate.second, counterDate.millisecond);
  }

  // node_modules/rrule/dist/esm/rrule.js
  var Days = {
    MO: new Weekday(0),
    TU: new Weekday(1),
    WE: new Weekday(2),
    TH: new Weekday(3),
    FR: new Weekday(4),
    SA: new Weekday(5),
    SU: new Weekday(6)
  };
  var DEFAULT_OPTIONS = {
    freq: Frequency.YEARLY,
    dtstart: null,
    interval: 1,
    wkst: Days.MO,
    count: null,
    until: null,
    tzid: null,
    bysetpos: null,
    bymonth: null,
    bymonthday: null,
    bynmonthday: null,
    byyearday: null,
    byweekno: null,
    byweekday: null,
    bynweekday: null,
    byhour: null,
    byminute: null,
    bysecond: null,
    byeaster: null
  };
  var defaultKeys = Object.keys(DEFAULT_OPTIONS);
  var RRule = (
    /** @class */
    (function() {
      function RRule2(options, noCache) {
        if (options === void 0) {
          options = {};
        }
        if (noCache === void 0) {
          noCache = false;
        }
        this._cache = noCache ? null : new Cache();
        this.origOptions = initializeOptions(options);
        var parsedOptions = parseOptions(options).parsedOptions;
        this.options = parsedOptions;
      }
      RRule2.parseText = function(text, language) {
        return parseText(text, language);
      };
      RRule2.fromText = function(text, language) {
        return fromText(text, language);
      };
      RRule2.fromString = function(str) {
        return new RRule2(RRule2.parseString(str) || void 0);
      };
      RRule2.prototype._iter = function(iterResult) {
        return iter(iterResult, this.options);
      };
      RRule2.prototype._cacheGet = function(what, args) {
        if (!this._cache)
          return false;
        return this._cache._cacheGet(what, args);
      };
      RRule2.prototype._cacheAdd = function(what, value, args) {
        if (!this._cache)
          return;
        return this._cache._cacheAdd(what, value, args);
      };
      RRule2.prototype.all = function(iterator) {
        if (iterator) {
          return this._iter(new callbackiterresult_default("all", {}, iterator));
        }
        var result = this._cacheGet("all");
        if (result === false) {
          result = this._iter(new iterresult_default("all", {}));
          this._cacheAdd("all", result);
        }
        return result;
      };
      RRule2.prototype.between = function(after, before, inc, iterator) {
        if (inc === void 0) {
          inc = false;
        }
        if (!isValidDate2(after) || !isValidDate2(before)) {
          throw new Error("Invalid date passed in to RRule.between");
        }
        var args = {
          before,
          after,
          inc
        };
        if (iterator) {
          return this._iter(new callbackiterresult_default("between", args, iterator));
        }
        var result = this._cacheGet("between", args);
        if (result === false) {
          result = this._iter(new iterresult_default("between", args));
          this._cacheAdd("between", result, args);
        }
        return result;
      };
      RRule2.prototype.before = function(dt, inc) {
        if (inc === void 0) {
          inc = false;
        }
        if (!isValidDate2(dt)) {
          throw new Error("Invalid date passed in to RRule.before");
        }
        var args = { dt, inc };
        var result = this._cacheGet("before", args);
        if (result === false) {
          result = this._iter(new iterresult_default("before", args));
          this._cacheAdd("before", result, args);
        }
        return result;
      };
      RRule2.prototype.after = function(dt, inc) {
        if (inc === void 0) {
          inc = false;
        }
        if (!isValidDate2(dt)) {
          throw new Error("Invalid date passed in to RRule.after");
        }
        var args = { dt, inc };
        var result = this._cacheGet("after", args);
        if (result === false) {
          result = this._iter(new iterresult_default("after", args));
          this._cacheAdd("after", result, args);
        }
        return result;
      };
      RRule2.prototype.count = function() {
        return this.all().length;
      };
      RRule2.prototype.toString = function() {
        return optionsToString(this.origOptions);
      };
      RRule2.prototype.toText = function(gettext, language, dateFormatter) {
        return toText(this, gettext, language, dateFormatter);
      };
      RRule2.prototype.isFullyConvertibleToText = function() {
        return isFullyConvertible(this);
      };
      RRule2.prototype.clone = function() {
        return new RRule2(this.origOptions);
      };
      RRule2.FREQUENCIES = [
        "YEARLY",
        "MONTHLY",
        "WEEKLY",
        "DAILY",
        "HOURLY",
        "MINUTELY",
        "SECONDLY"
      ];
      RRule2.YEARLY = Frequency.YEARLY;
      RRule2.MONTHLY = Frequency.MONTHLY;
      RRule2.WEEKLY = Frequency.WEEKLY;
      RRule2.DAILY = Frequency.DAILY;
      RRule2.HOURLY = Frequency.HOURLY;
      RRule2.MINUTELY = Frequency.MINUTELY;
      RRule2.SECONDLY = Frequency.SECONDLY;
      RRule2.MO = Days.MO;
      RRule2.TU = Days.TU;
      RRule2.WE = Days.WE;
      RRule2.TH = Days.TH;
      RRule2.FR = Days.FR;
      RRule2.SA = Days.SA;
      RRule2.SU = Days.SU;
      RRule2.parseString = parseString2;
      RRule2.optionsToString = optionsToString;
      return RRule2;
    })()
  );

  // node_modules/rrule/dist/esm/iterset.js
  function iterSet(iterResult, _rrule, _exrule, _rdate, _exdate, tzid) {
    var _exdateHash = {};
    var _accept = iterResult.accept;
    function evalExdate(after, before) {
      _exrule.forEach(function(rrule) {
        rrule.between(after, before, true).forEach(function(date) {
          _exdateHash[Number(date)] = true;
        });
      });
    }
    _exdate.forEach(function(date) {
      var zonedDate2 = new DateWithZone(date, tzid).rezonedDate();
      _exdateHash[Number(zonedDate2)] = true;
    });
    iterResult.accept = function(date) {
      var dt = Number(date);
      if (isNaN(dt))
        return _accept.call(this, date);
      if (!_exdateHash[dt]) {
        evalExdate(new Date(dt - 1), new Date(dt + 1));
        if (!_exdateHash[dt]) {
          _exdateHash[dt] = true;
          return _accept.call(this, date);
        }
      }
      return true;
    };
    if (iterResult.method === "between") {
      evalExdate(iterResult.args.after, iterResult.args.before);
      iterResult.accept = function(date) {
        var dt = Number(date);
        if (!_exdateHash[dt]) {
          _exdateHash[dt] = true;
          return _accept.call(this, date);
        }
        return true;
      };
    }
    for (var i3 = 0; i3 < _rdate.length; i3++) {
      var zonedDate = new DateWithZone(_rdate[i3], tzid).rezonedDate();
      if (!iterResult.accept(new Date(zonedDate.getTime())))
        break;
    }
    _rrule.forEach(function(rrule) {
      iter(iterResult, rrule.options);
    });
    var res = iterResult._result;
    sort(res);
    switch (iterResult.method) {
      case "all":
      case "between":
        return res;
      case "before":
        return res.length && res[res.length - 1] || null;
      case "after":
      default:
        return res.length && res[0] || null;
    }
  }

  // node_modules/rrule/dist/esm/rrulestr.js
  var DEFAULT_OPTIONS2 = {
    dtstart: null,
    cache: false,
    unfold: false,
    forceset: false,
    compatible: false,
    tzid: null
  };
  function parseInput(s3, options) {
    var rrulevals = [];
    var rdatevals = [];
    var exrulevals = [];
    var exdatevals = [];
    var parsedDtstart = parseDtstart(s3);
    var dtstart = parsedDtstart.dtstart;
    var tzid = parsedDtstart.tzid;
    var lines = splitIntoLines(s3, options.unfold);
    lines.forEach(function(line) {
      var _a;
      if (!line)
        return;
      var _b = breakDownLine(line), name = _b.name, parms = _b.parms, value = _b.value;
      switch (name.toUpperCase()) {
        case "RRULE":
          if (parms.length) {
            throw new Error("unsupported RRULE parm: ".concat(parms.join(",")));
          }
          rrulevals.push(parseString2(line));
          break;
        case "RDATE":
          var _c = (_a = /RDATE(?:;TZID=([^:=]+))?/i.exec(line)) !== null && _a !== void 0 ? _a : [], rdateTzid = _c[1];
          if (rdateTzid && !tzid) {
            tzid = rdateTzid;
          }
          rdatevals = rdatevals.concat(parseRDate(value, parms));
          break;
        case "EXRULE":
          if (parms.length) {
            throw new Error("unsupported EXRULE parm: ".concat(parms.join(",")));
          }
          exrulevals.push(parseString2(value));
          break;
        case "EXDATE":
          exdatevals = exdatevals.concat(parseRDate(value, parms));
          break;
        case "DTSTART":
          break;
        default:
          throw new Error("unsupported property: " + name);
      }
    });
    return {
      dtstart,
      tzid,
      rrulevals,
      rdatevals,
      exrulevals,
      exdatevals
    };
  }
  function buildRule(s3, options) {
    var _a = parseInput(s3, options), rrulevals = _a.rrulevals, rdatevals = _a.rdatevals, exrulevals = _a.exrulevals, exdatevals = _a.exdatevals, dtstart = _a.dtstart, tzid = _a.tzid;
    var noCache = options.cache === false;
    if (options.compatible) {
      options.forceset = true;
      options.unfold = true;
    }
    if (options.forceset || rrulevals.length > 1 || rdatevals.length || exrulevals.length || exdatevals.length) {
      var rset_1 = new RRuleSet(noCache);
      rset_1.dtstart(dtstart);
      rset_1.tzid(tzid || void 0);
      rrulevals.forEach(function(val2) {
        rset_1.rrule(new RRule(groomRruleOptions(val2, dtstart, tzid), noCache));
      });
      rdatevals.forEach(function(date) {
        rset_1.rdate(date);
      });
      exrulevals.forEach(function(val2) {
        rset_1.exrule(new RRule(groomRruleOptions(val2, dtstart, tzid), noCache));
      });
      exdatevals.forEach(function(date) {
        rset_1.exdate(date);
      });
      if (options.compatible && options.dtstart)
        rset_1.rdate(dtstart);
      return rset_1;
    }
    var val = rrulevals[0] || {};
    return new RRule(groomRruleOptions(val, val.dtstart || options.dtstart || dtstart, val.tzid || options.tzid || tzid), noCache);
  }
  function rrulestr(s3, options) {
    if (options === void 0) {
      options = {};
    }
    return buildRule(s3, initializeOptions2(options));
  }
  function groomRruleOptions(val, dtstart, tzid) {
    return __assign(__assign({}, val), { dtstart, tzid });
  }
  function initializeOptions2(options) {
    var invalid = [];
    var keys = Object.keys(options);
    var defaultKeys2 = Object.keys(DEFAULT_OPTIONS2);
    keys.forEach(function(key) {
      if (!includes(defaultKeys2, key))
        invalid.push(key);
    });
    if (invalid.length) {
      throw new Error("Invalid options: " + invalid.join(", "));
    }
    return __assign(__assign({}, DEFAULT_OPTIONS2), options);
  }
  function extractName(line) {
    if (line.indexOf(":") === -1) {
      return {
        name: "RRULE",
        value: line
      };
    }
    var _a = split(line, ":", 1), name = _a[0], value = _a[1];
    return {
      name,
      value
    };
  }
  function breakDownLine(line) {
    var _a = extractName(line), name = _a.name, value = _a.value;
    var parms = name.split(";");
    if (!parms)
      throw new Error("empty property name");
    return {
      name: parms[0].toUpperCase(),
      parms: parms.slice(1),
      value
    };
  }
  function splitIntoLines(s3, unfold) {
    if (unfold === void 0) {
      unfold = false;
    }
    s3 = s3 && s3.trim();
    if (!s3)
      throw new Error("Invalid empty string");
    if (!unfold) {
      return s3.split(/\s/);
    }
    var lines = s3.split("\n");
    var i3 = 0;
    while (i3 < lines.length) {
      var line = lines[i3] = lines[i3].replace(/\s+$/g, "");
      if (!line) {
        lines.splice(i3, 1);
      } else if (i3 > 0 && line[0] === " ") {
        lines[i3 - 1] += line.slice(1);
        lines.splice(i3, 1);
      } else {
        i3 += 1;
      }
    }
    return lines;
  }
  function validateDateParm(parms) {
    parms.forEach(function(parm) {
      if (!/(VALUE=DATE(-TIME)?)|(TZID=)/.test(parm)) {
        throw new Error("unsupported RDATE/EXDATE parm: " + parm);
      }
    });
  }
  function parseRDate(rdateval, parms) {
    validateDateParm(parms);
    return rdateval.split(",").map(function(datestr) {
      return untilStringToDate(datestr);
    });
  }

  // node_modules/rrule/dist/esm/rruleset.js
  function createGetterSetter(fieldName) {
    var _this = this;
    return function(field) {
      if (field !== void 0) {
        _this["_".concat(fieldName)] = field;
      }
      if (_this["_".concat(fieldName)] !== void 0) {
        return _this["_".concat(fieldName)];
      }
      for (var i3 = 0; i3 < _this._rrule.length; i3++) {
        var field_1 = _this._rrule[i3].origOptions[fieldName];
        if (field_1) {
          return field_1;
        }
      }
    };
  }
  var RRuleSet = (
    /** @class */
    (function(_super) {
      __extends(RRuleSet2, _super);
      function RRuleSet2(noCache) {
        if (noCache === void 0) {
          noCache = false;
        }
        var _this = _super.call(this, {}, noCache) || this;
        _this.dtstart = createGetterSetter.apply(_this, ["dtstart"]);
        _this.tzid = createGetterSetter.apply(_this, ["tzid"]);
        _this._rrule = [];
        _this._rdate = [];
        _this._exrule = [];
        _this._exdate = [];
        return _this;
      }
      RRuleSet2.prototype._iter = function(iterResult) {
        return iterSet(iterResult, this._rrule, this._exrule, this._rdate, this._exdate, this.tzid());
      };
      RRuleSet2.prototype.rrule = function(rrule) {
        _addRule(rrule, this._rrule);
      };
      RRuleSet2.prototype.exrule = function(rrule) {
        _addRule(rrule, this._exrule);
      };
      RRuleSet2.prototype.rdate = function(date) {
        _addDate(date, this._rdate);
      };
      RRuleSet2.prototype.exdate = function(date) {
        _addDate(date, this._exdate);
      };
      RRuleSet2.prototype.rrules = function() {
        return this._rrule.map(function(e3) {
          return rrulestr(e3.toString());
        });
      };
      RRuleSet2.prototype.exrules = function() {
        return this._exrule.map(function(e3) {
          return rrulestr(e3.toString());
        });
      };
      RRuleSet2.prototype.rdates = function() {
        return this._rdate.map(function(e3) {
          return new Date(e3.getTime());
        });
      };
      RRuleSet2.prototype.exdates = function() {
        return this._exdate.map(function(e3) {
          return new Date(e3.getTime());
        });
      };
      RRuleSet2.prototype.valueOf = function() {
        var result = [];
        if (!this._rrule.length && this._dtstart) {
          result = result.concat(optionsToString({ dtstart: this._dtstart }));
        }
        this._rrule.forEach(function(rrule) {
          result = result.concat(rrule.toString().split("\n"));
        });
        this._exrule.forEach(function(exrule) {
          result = result.concat(exrule.toString().split("\n").map(function(line) {
            return line.replace(/^RRULE:/, "EXRULE:");
          }).filter(function(line) {
            return !/^DTSTART/.test(line);
          }));
        });
        if (this._rdate.length) {
          result.push(rdatesToString("RDATE", this._rdate, this.tzid()));
        }
        if (this._exdate.length) {
          result.push(rdatesToString("EXDATE", this._exdate, this.tzid()));
        }
        return result;
      };
      RRuleSet2.prototype.toString = function() {
        return this.valueOf().join("\n");
      };
      RRuleSet2.prototype.clone = function() {
        var rrs = new RRuleSet2(!!this._cache);
        this._rrule.forEach(function(rule) {
          return rrs.rrule(rule.clone());
        });
        this._exrule.forEach(function(rule) {
          return rrs.exrule(rule.clone());
        });
        this._rdate.forEach(function(date) {
          return rrs.rdate(new Date(date.getTime()));
        });
        this._exdate.forEach(function(date) {
          return rrs.exdate(new Date(date.getTime()));
        });
        return rrs;
      };
      return RRuleSet2;
    })(RRule)
  );
  function _addRule(rrule, collection) {
    if (!(rrule instanceof RRule)) {
      throw new TypeError(String(rrule) + " is not RRule instance");
    }
    if (!includes(collection.map(String), String(rrule))) {
      collection.push(rrule);
    }
  }
  function _addDate(date, collection) {
    if (!(date instanceof Date)) {
      throw new TypeError(String(date) + " is not Date instance");
    }
    if (!includes(collection.map(Number), Number(date))) {
      collection.push(date);
      sort(collection);
    }
  }
  function rdatesToString(param, rdates, tzid) {
    var isUTC = !tzid || tzid.toUpperCase() === "UTC";
    var header = isUTC ? "".concat(param, ":") : "".concat(param, ";TZID=").concat(tzid, ":");
    var dateString = rdates.map(function(rdate) {
      return timeToUntilString(rdate.valueOf(), isUTC);
    }).join(",");
    return "".concat(header).concat(dateString);
  }

  // node_modules/@fullcalendar/rrule/index.js
  var recurringType = {
    parse(eventProps, dateEnv) {
      if (eventProps.rrule != null) {
        let eventRRuleData = parseEventRRule(eventProps, dateEnv);
        if (eventRRuleData) {
          return {
            typeData: {
              rruleSet: eventRRuleData.rruleSet,
              dateEnv: eventRRuleData.isTimeZoneSpecified ? void 0 : dateEnv
            },
            allDayGuess: !eventRRuleData.isTimeSpecified,
            duration: eventProps.duration
          };
        }
      }
      return null;
    },
    expand(eventRRuleData, framingRange, calendarDateEnv) {
      return eventRRuleData.rruleSet.between(
        // Add one-day leeway since rrule lib only operates in UTC,
        // but the zoned variant of framingRange is not.
        // Also overcomes this rrule bug:
        // https://github.com/jakubroztocil/rrule/issues/84)
        addDays(framingRange.start, -1),
        addDays(framingRange.end, 1)
      ).map((date) => {
        return calendarDateEnv.createMarker(
          // convert to epoch-milliseconds in original timezone
          eventRRuleData.dateEnv ? eventRRuleData.dateEnv.toDate(date) : date
        );
      });
    }
  };
  function parseEventRRule(eventProps, dateEnv) {
    let rruleSet;
    let isTimeSpecified = false;
    let isTimeZoneSpecified = false;
    if (typeof eventProps.rrule === "string") {
      let res = parseRRuleString(eventProps.rrule);
      rruleSet = res.rruleSet;
      isTimeSpecified = res.isTimeSpecified;
      isTimeZoneSpecified = res.isTimeZoneSpecified;
    }
    if (typeof eventProps.rrule === "object" && eventProps.rrule) {
      let res = parseRRuleObject(eventProps.rrule, dateEnv);
      rruleSet = new RRuleSet();
      rruleSet.rrule(res.rrule);
      isTimeSpecified = res.isTimeSpecified;
      isTimeZoneSpecified = res.isTimeZoneSpecified;
    }
    let exdateInputs = [].concat(eventProps.exdate || []);
    let exruleInputs = [].concat(eventProps.exrule || []);
    for (let exdateInput of exdateInputs) {
      let res = parse(exdateInput);
      isTimeSpecified = isTimeSpecified || !res.isTimeUnspecified;
      isTimeZoneSpecified = isTimeZoneSpecified || res.timeZoneOffset !== null;
      rruleSet.exdate(new Date(res.marker.valueOf() - (res.timeZoneOffset || 0) * 60 * 1e3));
    }
    for (let exruleInput of exruleInputs) {
      let res = parseRRuleObject(exruleInput, dateEnv);
      isTimeSpecified = isTimeSpecified || res.isTimeSpecified;
      isTimeZoneSpecified = isTimeZoneSpecified || res.isTimeZoneSpecified;
      rruleSet.exrule(res.rrule);
    }
    return { rruleSet, isTimeSpecified, isTimeZoneSpecified };
  }
  function parseRRuleObject(rruleInput, dateEnv) {
    let isTimeSpecified = false;
    let isTimeZoneSpecified = false;
    function processDateInput(dateInput) {
      if (typeof dateInput === "string") {
        let markerData = parse(dateInput);
        if (markerData) {
          isTimeSpecified = isTimeSpecified || !markerData.isTimeUnspecified;
          isTimeZoneSpecified = isTimeZoneSpecified || markerData.timeZoneOffset !== null;
          return new Date(markerData.marker.valueOf() - (markerData.timeZoneOffset || 0) * 60 * 1e3);
        }
        return null;
      }
      return dateInput;
    }
    let rruleOptions = Object.assign(Object.assign({}, rruleInput), { dtstart: processDateInput(rruleInput.dtstart), until: processDateInput(rruleInput.until), freq: convertConstant(rruleInput.freq), wkst: rruleInput.wkst == null ? (dateEnv.weekDow - 1 + 7) % 7 : convertConstant(rruleInput.wkst), byweekday: convertConstants(rruleInput.byweekday) });
    return { rrule: new RRule(rruleOptions), isTimeSpecified, isTimeZoneSpecified };
  }
  function parseRRuleString(str) {
    let rruleSet = rrulestr(str, { forceset: true });
    let analysis = analyzeRRuleString(str);
    return Object.assign({ rruleSet }, analysis);
  }
  function analyzeRRuleString(str) {
    let isTimeSpecified = false;
    let isTimeZoneSpecified = false;
    function processMatch(whole, introPart, datePart) {
      let result = parse(datePart);
      isTimeSpecified = isTimeSpecified || !result.isTimeUnspecified;
      isTimeZoneSpecified = isTimeZoneSpecified || result.timeZoneOffset !== null;
    }
    str.replace(/\b(DTSTART:)([^\n]*)/, processMatch);
    str.replace(/\b(EXDATE:)([^\n]*)/, processMatch);
    str.replace(/\b(UNTIL=)([^;\n]*)/, processMatch);
    return { isTimeSpecified, isTimeZoneSpecified };
  }
  function convertConstants(input) {
    if (Array.isArray(input)) {
      return input.map(convertConstant);
    }
    return convertConstant(input);
  }
  function convertConstant(input) {
    if (typeof input === "string") {
      return RRule[input.toUpperCase()];
    }
    return input;
  }
  var RRULE_EVENT_REFINERS = {
    rrule: identity,
    exrule: identity,
    exdate: identity,
    duration: createDuration
  };
  var index5 = createPlugin({
    name: "@fullcalendar/rrule",
    recurringTypes: [recurringType],
    eventRefiners: RRULE_EVENT_REFINERS
  });

  // <stdin>
  document.addEventListener("DOMContentLoaded", function() {
    var calendarEl = document.getElementById("calendar");
    if (!calendarEl) {
      return;
    }
    var isSingleEvent = calendarEl.classList.contains("single-event-calendar");
    var browserLocale = navigator.language || navigator.userLanguage || "en";
    var initialLocaleCode = browserLocale.toLowerCase();
    var localeSelectorEl = document.getElementById("locale-selector");
    var calendarConfig = {
      plugins: [
        index5,
        index,
        index2,
        index3,
        index4
      ],
      locales: localesAll,
      locale: initialLocaleCode,
      buttonIcons: true,
      dayMaxEvents: true,
      contentHeight: "auto",
      // let view rows size to content instead of using aspectRatio
      editable: false,
      navLinks: true,
      weekNumbers: true,
      events: {
        url: window.location.pathname + "/calendar.ics",
        format: "ics"
      }
    };
    if (isSingleEvent) {
      var initialDate = calendarEl.dataset.initialDate;
      Object.assign(calendarConfig, {
        initialDate: initialDate || void 0,
        initialView: "listMonth",
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth"
        }
        //eventDisplay: "block",
        //eventDidMount: function (info) {
        //  // Highlight the current event with theme colors
        //  info.el.style.backgroundColor = "var(--calendar-accent-color-light)";
        //  info.el.style.borderColor = "var(--calendar-accent-color)";
        //},
      });
    } else {
      Object.assign(calendarConfig, {
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth"
        },
        weekNumbers: true,
        navLinks: true,
        editable: true,
        dayMaxEvents: true
      });
    }
    var calendar = new Calendar(calendarEl, calendarConfig);
    calendar.render();
    if (localeSelectorEl) {
      calendar.getAvailableLocaleCodes().forEach(function(localeCode) {
        var optionEl = document.createElement("option");
        optionEl.value = localeCode;
        optionEl.selected = localeCode == initialLocaleCode;
        optionEl.innerText = localeCode;
        localeSelectorEl.appendChild(optionEl);
      });
      localeSelectorEl.addEventListener("change", function() {
        if (this.value) {
          calendar.setOption("locale", this.value);
        }
      });
    }
  });
})();
