/**
 * Created by eugene.levenetc on 30/11/2016.
 */
exports.capitalize = function (str) {
    return str && str[0].toUpperCase() + str.slice(1);
};

exports.checkNull = function (obj, key) {
    if (obj === null || obj === undefined)
        throw new Error(`obj is undefined or null:${obj}`);
    if (!obj.hasOwnProperty(key) || obj[key] === null || obj[key] === undefined)
        throw new Error(`${key} is undefined`);
};

exports.isPropDefined = function (obj, prop) {
    if (!obj.hasOwnProperty(prop)) {
        return false;
    } else {
        return obj[prop] !== null && obj[prop] !== undefined;
    }
};

exports.isDefined = function (obj) {
    return obj !== null && obj !== undefined;
};

exports.cloneArray = function (arr) {
    return arr.slice();
};

exports.isNumber = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

exports.isString = function (value) {
    return typeof value === 'string' || value instanceof String;
};

exports.contains = function (str, value) {
    if (!this.isString(str) || !this.isString(value)) return false;
    return str.indexOf(value) >= 0;
};

exports.isDeviceValid = function (device) {
    if (!this.isDefined(device)) {
        return false;
    } else {
        return this.isPropDefined(device, 'deviceId') &&
            this.isPropDefined(device, 'pushToken') &&
            this.isPropDefined(device, 'manufacturer') &&
            this.isPropDefined(device, 'model') &&
            this.isPropDefined(device, 'osVersion') &&
            this.isPropDefined(device, 'platform') &&
            this.isPropDefined(device, 'screenSize');
    }
};