/**
 * Created by eugene.levenetc on 28/11/2016.
 */

const utils = require('../utils/utils');

const boolFieldsMap = {
    'ble': 'hasBluetoothLowEnergy',
    'bt': 'hasBluetooth',
    'nfc': 'hasNfc'
};

exports.renderDevices = function (type, devices, verbose) {
    if (type === 'slack') {
        return slack(devices, verbose);
    } else if (type === 'json') {
        return devices;
    } else {
        return 'Invalid view type: ' + type;
    }
};

function slack(devices, verbose, filter) {
    let result = '';
    if (devices.length == 0) {
        result = 'No devices'
    } else {
        for (let i = 0; i < devices.length; i++) {

            let device = devices[i];
            let skippedByFiler = false;

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

            if (utils.isDefined(filter)) {
                Object.keys(filter).forEach(function (key) {
                    if (typeof filter[key] === 'boolean') {
                        if (boolFieldsMap.hasOwnProperty(key)) {
                            if (!this[boolFieldsMap[key]]) {
                                skippedByFiler = true;
                                break;
                            }
                        }
                    }
                });
            }

            if (skippedByFiler) continue;

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