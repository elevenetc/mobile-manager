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

exports.isDefined = function (obj) {
    return obj !== null && obj !== undefined;
};

exports.cloneArray = function (arr) {
    return arr.slice();
};

exports.isNumber = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};