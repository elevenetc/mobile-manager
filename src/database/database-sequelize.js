/**
 * Created by eleven on 20/08/2016.
 */

const Sequelize = require('sequelize');

class DatabaseSequelize{

    constructor(config) {

        const sequelize = new Sequelize(
            config.dbFile,
            config.dbUser,
            config.dbPass,
            {
                host: 'localhost',
                dialect: 'mysql'
            }
        );

        sequelize.sync();

        this.deviceModel = sequelize.define('devices', {
            deviceId: {type: Sequelize.STRING},
            pushToken: {type: Sequelize.STRING},
            manufacturer: {type: Sequelize.STRING},
            model: {type: Sequelize.STRING},
            osVersion: {type: Sequelize.STRING},
            wifiSSID: {type: Sequelize.STRING},
            platform: {type: Sequelize.STRING},
            screenWidth: {type: Sequelize.INTEGER},
            screenHeight: {type: Sequelize.INTEGER},
            screenSize: {type: Sequelize.FLOAT},
            hasNfc: {type: Sequelize.BOOLEAN},
            hasBluetooth: {type: Sequelize.BOOLEAN},
            hasBluetoothLowEnergy: {type: Sequelize.BOOLEAN},
            hasFingerprintScanner: {type: Sequelize.BOOLEAN},
            lat: {type: Sequelize.FLOAT},
            lon: {type: Sequelize.FLOAT},
            batteryLevel: {type: Sequelize.FLOAT},
            lastUpdateTime: {type: Sequelize.DATE},
            isOnline: {type: Sequelize.BOOLEAN}
        }, {
            timestamps: false
        });
    }

    getPushToken(deviceId, okHandler, failHandler) {
        this.getDevice(deviceId, function (device) {
            okHandler(device.pushToken);
        }, failHandler);
    }

    updateOnlineState(device, okHandler, failHandler) {
        this.internalUpdate(device, okHandler, failHandler);
    }

    updateLocation(device, okHandler, failHandler) {
        this.internalUpdate(device, okHandler, failHandler);
    }

    createOrUpdate(device, okHandler, failHandler) {

        if (!this.isDeviceValid(device)) {
            failHandler(new Error('device is not valid'));
        } else {
            this.internalCreateOrUpdate(device, okHandler, failHandler);
        }

    }

    getDevice(deviceId, okHandler, failHandler) {
        this.deviceModel.findOne({
            where: {
                deviceId: deviceId
            }
        }).then(function (device) {
            okHandler(device);
        }).catch(failHandler);
    }

    getDevices(dataHandler, errorHandler) {
        this.deviceModel.findAll().then(dataHandler).catch(errorHandler);
    }

    deleteDevice(id, successHandler, errorHandler) {
        this.internalDelete(id, successHandler, errorHandler);
    }

    internalCreateOrUpdate(device, okHandler, failHandler) {

        const db = this;
        this.deviceModel.findOne({
            where: {deviceId: device.deviceId}
        }).then(function (found) {
            if (!found) {
                device.lastUpdateTime = new Date().getTime();
                db.internalCreate(device, okHandler, failHandler);
            } else {
                db.internalUpdate(device, okHandler, failHandler)
            }
        }).catch(failHandler);
    }

    internalCreate(device, okHandler, failHandler) {
        this.deviceModel.create(device).then(function () {
            okHandler(Database.CREATED);
        }).catch(failHandler);
    }

    internalUpdate(device, okHandler, failHandler) {
        this.deviceModel.update(device, {
            where: {
                deviceId: device.deviceId
            }
        }).then(function () {
            okHandler(Database.UPDATED);
        }).catch(failHandler);
    }

    internalDelete(id, dataHandler, errorHandler) {
        this.deviceModel.destroy({
            where: {deviceId: id}
        }).then(dataHandler).catch(errorHandler);
    }
}

module.exports = DatabaseSequelize;