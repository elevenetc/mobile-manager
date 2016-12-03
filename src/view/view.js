/**
 * Created by eugene.levenetc on 28/11/2016.
 */

const utils = require('../utils/utils');

const boolFieldsMap = {
    ble: 'hasBluetoothLowEnergy',
    bt: 'hasBluetooth',
    nfc: 'hasNfc',
    online: 'isOnline'
};

exports.renderDevices = function (type, devices, verbose) {
    if (type === 'slack') {
        return slack(devices, verbose);
    } else if (type === 'json') {
        return devices;
    } else {
        return `Invalid view type param: ${type}`;
    }
};

/**
 *
 * @param devices
 * @param {string} [rawFilters]
 * @return {*}
 */
exports.filterDevices = function (devices, rawFilters) {

    if (!utils.isDefined(rawFilters)) return devices;

    const filters = rawFilters.split(',');

    if (filters.length == 0) return devices;

    for (let i = 0; i < filters.length; i++) {
        let d = devices.length;
        const fKey = filters[i].split(':')[0];
        const fValue = filters[i].split(':')[1];
        while (d--) {

            if (boolFieldsMap.hasOwnProperty(fKey)) {
                const devKey = boolFieldsMap[fKey];
                const filterValue = Boolean(fValue);
                let device = devices[d];
                if (device.hasOwnProperty(devKey) && device[devKey] !== filterValue) {
                    devices.splice(d, 1);
                    continue;
                }
            }

            if (fKey === 'os') {

            }
        }
    }

    return devices;
};

exports.isMatch = function (dbVersion, filterPattern) {
    dbVersion = fixDbVersion(dbVersion);
    if (!utils.isDefined(filterPattern)) return false;
    if (filterPattern === '') return false;
    if (dbVersion === filterPattern) return true;
    const regex = new RegExp(filterPattern.replace(/\./g, 'V').replace(`\*`, '.{1,}'));
    dbVersion = dbVersion.replace(/\./g, 'V');
    let result = dbVersion.match(regex);
    return result != null;
};

exports.isValidOsFilter = function (filterPattern) {

    const aPattern = /^(\d|\*)$/;
    const abPattern = /^(\d|\*)\.(\d|\*)$/;
    const abcPattern = /^(\d|\*)\.(\d|\*)\.(\d|\*)$/;

    const checkA = filterPattern.match(aPattern);
    const checkAB = filterPattern.match(abPattern);
    const checkABC = filterPattern.match(abcPattern);

    if (checkA != null) {
        return true;
    } else if (checkAB != null) {
        return true;
    } else if (checkABC != null) {
        return true;
    } else {
        return false;
    }
};

exports.fixDbVersion = fixDbVersion;

function fixDbVersion(ver) {
    if (ver.length == 1) {
        return `${ver}.0.0`;
    } else if (ver.length == 3) {
        return `${ver}.0`;
    } else {
        return ver;
    }
}

function slack(devices, verbose) {
    let result = '';
    if (devices.length == 0) {
        result = 'No devices'
    } else {
        for (let i = 0; i < devices.length; i++) {

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
            let isOnline = device.isOnline ? ':new_moon:' : ':full_moon:';

            if (verbose) {
                result +=
                    locAndDeviceName +
                    isOnline +
                    `\`os: ${osVersion}\` ` +
                    `\`battery: ${batteryLevel}\` ` +
                    `\`fingerprint: ${hasFingerprintScanner}\` ` +
                    `\`ble: ${hasBluetoothLowEnergy}\` ` +
                    `\`bt: ${hasBluetooth}\` ` +
                    `\`nfc: ${hasNfc}\` ` +
                    `\`screenSize: ${screenSize}\` ` +
                    `\`wifiSSID: ${wifiSSID}\` ` +
                    `\`screenWidth: ${screenWidth}\` ` +
                    `\`screenHeight: ${screenHeight}\` `;
            } else {
                result +=
                    locAndDeviceName +
                    isOnline +
                    `\`os: ${osVersion}\` ` +
                    `\`battery: ${batteryLevel}\` `;
            }

            result += '\n';


        }
    }

    return result;
}