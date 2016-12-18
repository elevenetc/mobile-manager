/**
 * Created by eugene.levenetc on 30/11/2016.
 */

const utils = require('./utils');
const OrderedMap = require('./ordered-map');

const boolFieldsMap = {
    ble: 'hasBluetoothLowEnergy',
    bt: 'hasBluetooth',
    nfc: 'hasNfc',
    online: 'isOnline',
    fingerprint: 'hasFingerprintScanner'
};

const stringFieldsMap = {
    wifi: 'wifiSSID',
    platform: 'platform',
    model: 'model',
    manufacturer: 'manufacturer'
};

const numericFieldsMap = {
    battery: 'batteryLevel',
    screenWidth: 'screenWidth',
    screenHeight: 'screenHeight',
    screenSize: 'screenSize'
};


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
    return prop in obj && obj[prop] !== null && obj[prop] !== undefined;
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

exports.isOsMatch = function (dbVersion, filterPattern) {
    return isOsMatch(dbVersion, filterPattern);
};

exports.isValidOsFilter = function (filterPattern) {
    return isValidOsFilter(filterPattern);
};

/**
 *
 * @param devices
 * @param {string} [rawFilters]
 * @return {*}
 */
exports.filterDevices = filterDevices;
exports.fixDbVersion = fixDbVersion;
exports.isNumericFilterMatch = isNumericFilterMatch;
exports.fixNumericFilter = fixNumericFilter;

function isOsMatch(dbVersion, filterPattern) {
    dbVersion = fixDbVersion(dbVersion);
    if (!utils.isDefined(filterPattern)) return false;
    if (filterPattern === '') return false;
    if (dbVersion === filterPattern) return true;
    const regex = new RegExp(filterPattern.replace(/\./g, 'V').replace(`\*`, '.{1,}'));
    dbVersion = dbVersion.replace(/\./g, 'V');
    let result = dbVersion.match(regex);
    return result !== null;
}

function isValidOsFilter(filterPattern) {
    const aPattern = /^([0-9]+)$|^\*$/;
    const abPattern = /^(([0-9]+)|\*)\.(([0-9]+)|\*)$/;
    const abcPattern = /^(([0-9]+)|\*)\.(([0-9]+)|\*)\.(([0-9]+)|\*)$/;

    const checkA = filterPattern.match(aPattern);
    const checkAB = filterPattern.match(abPattern);
    const checkABC = filterPattern.match(abcPattern);

    return checkA !== null || checkAB !== null || checkABC !== null;
}

function isNumericFilterMatch(value, filter) {

    if (!utils.isNumber(value)) return false;

    filter = fixNumericFilter(filter);
    if (filter === '') return false;
    const sign = filter.charAt(0);
    const filterValue = parseFloat(filter.slice(1));

    //TODO: add support >= and <=
    if (sign === '=') {
        return value === filterValue;
    } else if (sign === '>') {
        return value > filterValue;
    } else if (sign === '<') {
        return value < filterValue;
    } else {
        return false;
    }
}

function fixNumericFilter(filter) {

    if (!utils.isDefined(filter)) return '';
    if (filter.length === 0) return '';

    //TODO: add negative values support
    const validPattern = /^(>|<|=)(\d+\.\d+|\d+)$/;
    const isValid = filter.match(validPattern);
    if (isValid) {
        return filter;
    } else {
        const sign = filter.charAt(0);
        const hasSign = sign === '>' && sign === '<' && sign === '=';

        if (hasSign && filter.length === 1) {
            return '';
        } else {

            if (hasSign) {
                const number = filter.slice(1);
                if (utils.isNumber(number)) {
                    return filter;
                } else {
                    return '';
                }
            } else {
                if (utils.isNumber(filter)) {
                    return '=' + filter;
                } else {
                    return '';
                }
            }

        }
    }
}

function fixDbVersion(ver) {
    if (ver.length === 1) {
        return `${ver}.0.0`;
    } else if (ver.length === 3) {
        return `${ver}.0`;
    } else {
        return ver;
    }
}



function filterDevices(devices, rawFilters) {

    if (!utils.isDefined(rawFilters)) return devices;

    rawFilters = rawFilters.replace(/ /g, '');
    const filters = rawFilters.split(',');

    if (filters.length === 0) return devices;

    devices = utils.cloneArray(devices);

    for (let i = 0; i < filters.length; i++) {
        let d = devices.length;
        const fKey = filters[i].split(':')[0];
        const fValue = filters[i].split(':')[1];
        while (d--) {

            const device = devices[d];

            if (boolFieldsMap.hasOwnProperty(fKey)) {
                const devKey = boolFieldsMap[fKey];
                const filterValue = fValue === 'true';

                if (device[devKey] !== filterValue) {
                    devices.splice(d, 1);
                }
            } else if (stringFieldsMap.hasOwnProperty(fKey)) {
                const devKey = stringFieldsMap[fKey];

                const devValue = device[devKey].toLowerCase();
                const queryValue = fValue.toLowerCase().replace(/ /g, '');

                if(devValue.indexOf(queryValue) === -1 && queryValue.indexOf(devValue) === -1){
                    devices.splice(d, 1);
                }

            } else if (numericFieldsMap.hasOwnProperty(fKey)) {
                const devKey = numericFieldsMap[fKey];

                if (!isNumericFilterMatch(device[devKey], fValue)) {
                    devices.splice(d, 1);
                }

            } else if (fKey === 'os' && isValidOsFilter(fValue) && !isOsMatch(device.osVersion, fValue)) {
                devices.splice(d, 1);
            }
        }
    }

    return devices;
}