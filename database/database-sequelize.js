/**
 * Created by eleven on 20/08/2016.
 */
const localSettings = require('../local-settings');
const Sequelize = require('sequelize');
const ERROR = require('../errors/error');
const Database = require('./database');

const sequelize = new Sequelize(
    localSettings.dbFile,
    localSettings.dbUser,
    localSettings.dbPass,
    {
        host: 'localhost',
        dialect: 'mysql'
    }
);

class DatabaseSequelize extends Database {

    constructor() {
        super();
        this.deviceModel = sequelize.define('devices', {
            id: {type: Sequelize.INTEGER, primaryKey: true},
            name: Sequelize.STRING
        }, {
            timestamps: false
        });
    }

    /**
     * @param device {Device}
     * @param okHandler {Function}
     * @param failHandler {Function}
     */
    createOrUpdate(device, okHandler, failHandler) {


        if (!this.isDeviceValid(device)) {
            failHandler(new Error(ERROR.DeviceIsNotValid));
        } else {
            this.internalCreateOrUpdate(device, okHandler, failHandler);
        }

    }

    /**
     * @param id {String}
     * @param handler {Function}
     */
    getDevice(id, handler) {
        this.deviceModel.findOne({
            where: {
                id: id
            }
        }).then(function (device) {
            handler(device);
        });
    }

    getAllDevices(dataHandler, errorHandler) {
        this.deviceModel.findAll().then(dataHandler).catch(errorHandler);
    }

    deleteDevice(id, dataHandler, errorHandler) {
        this.deviceModel.destroy({
            where: {
                id: id
            }
        }).success(dataHandler).catch(errorHandler);
    }

    internalCreateOrUpdate(device, okHandler, failHandler) {

        const db = this;
        this.deviceModel.findOne({
            where: {id: device.id}
        }).then(function (found) {
            if (!found) {
                db.internalCreate(device, okHandler, failHandler);
            } else {
                db.internalUpdate(device, okHandler, failHandler)
            }
        }).catch(failHandler);
    }

    internalCreate(device, okHandler, failHandler) {
        this.deviceModel.create({
            id: device.id,
            name: device.name
        }).then(function () {
            okHandler(Database.CREATED);
        }).catch(failHandler);
    }

    internalUpdate(device, okHandler, failHandler) {
        this.deviceModel.update(device, {
            where: {
                id: device.id
            }
        }).then(function () {
            okHandler(Database.UPDATED);
        }).catch(failHandler);
    }
}

module.exports = new DatabaseSequelize();