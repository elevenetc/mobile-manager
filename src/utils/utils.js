/**
 * Created by eugene.levenetc on 30/11/2016.
 */
exports.capitalize = function (str) {
    return str && str[0].toUpperCase() + str.slice(1);
};

exports.checkNull = function (obj, key) {
    if (!obj.hasOwnProperty(key) || obj[key] == null || obj[key] == undefined)
        throw new Error(`${key} is undefined`);
};