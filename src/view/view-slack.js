/**
 * Created by eugene.levenetc on 28/11/2016.
 */

const utils = require('../utils/utils');
const OrderedMap = require('../utils/ordered-map');

/**
 *
 * @param type
 * @param devices
 * @param {String} [filters]
 * @return {*}
 */
exports.renderDevices = function (type, devices, filters) {
    devices = utils.filterDevices(devices, filters);
    let verbose = utils.contains(filters, 'v:true');
    if (type === 'slack') {
        return render(devices, verbose, filters);
    } else if (type === 'json') {
        return devices;
    } else {
        throw new Error(`Invalid view type param: ${type}`);
    }
};

function render(devices, verbose, filters) {

    let result = 'Filters: `' + filters + '`\n';
    let map = new OrderedMap();
    result += 'Result: ' + devices.length + ' devices\n';

    for (let i = 0; i < devices.length; i++) {

        result += (i + 1) + '. ';

        let device = devices[i];

        if (utils.isDeviceValid(device)) {
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

            map.put('fingerprint', hasFingerprintScanner);
            map.put('ble', hasBluetoothLowEnergy);
            map.put('bt', hasBluetooth);
            map.put('nfc', hasNfc);
            map.put('screenSize', screenSize);
            map.put('screenWidth', screenWidth);
            map.put('screenHeight', screenHeight);
            map.put('wifi', wifiSSID);

            result += locAndDeviceName + isOnline + `\`os: ${osVersion}\` \`battery: ${batteryLevel}%\` `;

            map.iterate(function (key, value) {

                if (verbose) {
                    result += `\`${key}: ${value}\` `;
                } else {
                    if (filters.indexOf(key) >= 0) result += `\`${key}: ${value}\` `;
                }

            });
        } else {
            result += 'Error: Not valid device';
        }

        result += '\n';
    }

    return result;
}