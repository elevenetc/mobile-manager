const database = require('../database/database-sequelize');
const gcm = require('../gcm/gcm-sender');

module.exports = {

    getDevises: function (okHandler, errorHandler) {
        database.getDevices(okHandler, errorHandler);
    },

    updateLocation: function(deviceId, lat, lon, okHandler, errorHandler){
        database.updateLocation(deviceId, lat, lon, okHandler, errorHandler);
    },

    postDevice: function (device, okHandler, errorHandler) {
        okHandler = okHandler || function(){};
        errorHandler = errorHandler || function(){};
        database.createOrUpdate(device, okHandler, errorHandler);
    },

    /**
     * @param id {String}
     */
    deleteDevice: function (id, okHandler, errorHandler) {
        database.deleteDevice(id, okHandler, errorHandler);
    },

    ping: function (gcmToken, okHandler, errorHandler) {
        gcm.ping(gcmToken, okHandler, errorHandler);
    }
};
