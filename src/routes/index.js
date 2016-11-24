const database = require('../database/database-sequelize');
const gcm = require('../gcm/gcm-sender');

module.exports = {

    getDevises: function (okHandler, errorHandler) {
        database.getDevices(okHandler, errorHandler);
    },

    /**
     * @param device {Device}
     */
    postDevices: function (device, okHandler, errorHandler) {
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
