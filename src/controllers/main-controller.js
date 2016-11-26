const database = require('../database/database-sequelize');
const gcm = require('../gcm/gcm-sender');

module.exports = {

    getDevises: function (okHandler, errorHandler) {
        database.getDevices(okHandler, errorHandler);
    },

    updateOnlineState: function(deviceId, isOnline, okHandler, errorHandler){
        okHandler = okHandler || function(){};
        errorHandler = errorHandler || function(){};
        database.updateOnlineState({deviceId: deviceId, isOnline: isOnline}, okHandler, errorHandler);
    },

    updateLocation: function(deviceId, lat, lon, okHandler, errorHandler){
        database.updateLocation({deviceId: deviceId, lat: lat, lon: lon, isOnline: true}, okHandler, errorHandler);
    },

    postDevice: function (device, okHandler, errorHandler) {
        okHandler = okHandler || function(){};
        errorHandler = errorHandler || function(){};
        device.isOnline = true;
        database.createOrUpdate(device, okHandler, errorHandler);
    },

    deleteDevice: function (id, okHandler, errorHandler) {
        database.deleteDevice(id, okHandler, errorHandler);
    },

    ping: function (pushTokens, okHandler, errorHandler) {
        gcm.ping(pushTokens, function(){
            okHandler();
        }, errorHandler);
    }
};
