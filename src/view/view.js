/**
 * Created by eugene.levenetc on 28/11/2016.
 */

const utils = require('../utils/utils');
const OrderedMap = require('../utils/ordered-map');

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

/**
 *
 * @param type
 * @param devices
 * @param [verbose]
 * @param {String} [filters]
 * @return {*}
 */
exports.renderDevices = function (type, devices, filters) {
    devices = filterDevices(devices, filters);
    let verbose = utils.contains(filters, 'v:true');
    if (type === 'slack') {
        return slack(devices, verbose, filters);
    } else if (type === 'json') {
        return devices;
    } else {
        throw new Error(`Invalid view type param: ${type}`);
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

    if (checkA !== null) {
        return true;
    } else if (checkAB !== null) {
        return true;
    } else if (checkABC !== null) {
        return true;
    } else {
        return false;
    }
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
    if (filter.length == 0) return '';

    //TODO: add negative values support
    const validPattern = /^(>|<|=)(\d+\.\d+|\d+)$/;
    const isValid = filter.match(validPattern);
    if (isValid) {
        return filter;
    } else {
        const sign = filter.charAt(0);
        const hasSign = sign === '>' && sign === '<' && sign === '=';

        if (hasSign && filter.length == 1) {
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

function slack(devices, verbose, filters) {

    let result = 'Filters: `' + filters + '`\n';
    result += 'Result: ' + devices.length + ' devices\n';

    for (let i = 0; i < devices.length; i++) {

        result += (i + 1) + '. ';

        let device = devices[i];

        let deviceId = device.deviceId;
        let deviceName = utils.capitalize(device.manufacturer + ' ' + device.model);
        let osVersion = device.osVersion;
        let lat = device.lat;
        let lon = device.lon;
        let locAndDeviceName = '<https://www.google.com/maps/@' + lat + ',' + lon + ',18z|' + deviceName + '>';
        let wifiSSID = device.wifiSSID;
        let screenWidth = device.screenWidth;
        let screenHeight = device.screenHeight;
        let screenSize = device.screenSize;
        let hasNfc = device.hasNfc;
        let hasBluetooth = device.hasBluetooth;
        let hasBluetoothLowEnergy = device.hasBluetoothLowEnergy;
        let hasFingerprintScanner = device.hasFingerprintScanner;
        let batteryLevel = device.batteryLevel;
        let isOnline = device.isOnline ? ' `on` ' : ' `off` ';

        let map = new OrderedMap();

        map.put('fingerprint', hasFingerprintScanner);
        map.put('ble', hasBluetoothLowEnergy);
        map.put('bt', hasBluetooth);
        map.put('nfc', hasNfc);
        map.put('screenSize', screenSize);
        map.put('screenWidth', screenWidth);
        map.put('screenHeight', screenHeight);
        map.put('wifi', wifiSSID);

        result += locAndDeviceName + isOnline + `\`os: ${osVersion}\` battery: ${batteryLevel}% `;

        map.iterate(function (key, value) {

            if (verbose) {
                result += `\`${key}: ${value}\` `;
            } else {
                if (filters.indexOf(key) >= 0) result += `\`${key}: ${value}\` `;
            }

        });

        result += '\n';
    }

    return result;
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

            let device = devices[d];

            if (boolFieldsMap.hasOwnProperty(fKey)) {
                const devKey = boolFieldsMap[fKey];
                const filterValue = fValue === 'true';

                if (device[devKey] !== filterValue) {
                    devices.splice(d, 1);
                }
            } else if (stringFieldsMap.hasOwnProperty(fKey)) {
                const devKey = stringFieldsMap[fKey];

                if (device[devKey].toLowerCase() !== fValue.toLowerCase()) {
                    devices.splice(d, 1);
                }
            } else if (numericFieldsMap.hasOwnProperty(fKey)) {
                const devKey = numericFieldsMap[fKey];

                if (!isNumericFilterMatch(device[devKey], fValue)) {
                    devices.splice(d, 1);
                }

            } else if (fKey === 'os' && isValidOsFilter(fValue)) {
                if (!isOsMatch(device.osVersion, fValue)) {
                    devices.splice(d, 1);
                }
            }
        }
    }

    return devices;
}