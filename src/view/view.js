/**
 * Created by eugene.levenetc on 28/11/2016.
 */
exports.renderDevices = function(type, devices, modeFull){
    if(type === 'slack'){
        return slack(devices, modeFull);
    } else if(type === 'json'){
        return devices;
    } else {
        return 'Invalid view type: ' + type;
    }
};

function slack(devices, modeFull) {
    let result = '';
    if (devices.length == 0) {
        result = 'No devices'
    } else {
        for (let i = 0; i < devices.length; i++) {

            let device = devices[i];

            let deviceId = device.deviceId;
            let deviceName = device.manufacturer + ' ' + device.model;
            let osVersion = device.osVersion;
            let lat = device.lat;
            let lon = device.lon;
            let location = '<https://www.google.com/maps/@' + lat + ',' + lon + ',18z|maps>';

            if (modeFull) {
                result += `name: ${deviceName} os: ${osVersion} location: ${location}\n`;
            } else {
                result += `name: ${deviceName} os: ${osVersion} location: ${location}\n`;
            }


        }
    }

    return result;
}