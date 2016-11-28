const DatabaseSequelize = require('../database/database-sequelize');

class DeviceManager {

    constructor(config) {
        this.database = new DatabaseSequelize(config);
    }

    getDevices(okHandler, errorHandler) {
        this.database.getDevices(okHandler, errorHandler);
    }

    updateOnlineState (deviceId, isOnline, okHandler, errorHandler) {
        okHandler = okHandler || function(){};
        errorHandler = errorHandler || function(){};
        this.database.updateOnlineState({deviceId: deviceId, isOnline: isOnline}, okHandler, errorHandler);
    }

    updateLocation (deviceId, lat, lon, okHandler, errorHandler) {
        this.database.updateLocation({deviceId: deviceId, lat: lat, lon: lon, isOnline: true}, okHandler, errorHandler);
    }

    createOrUpdateDevice (device, okHandler, errorHandler) {
        okHandler = okHandler || function(){};
        errorHandler = errorHandler || function(){};
        device.isOnline = true;
        this.database.createOrUpdate(device, okHandler, errorHandler);
    }

    deleteDevice (id, okHandler, errorHandler) {
        this.database.deleteDevice(id, okHandler, errorHandler);
    }


}

module.exports = DeviceManager;