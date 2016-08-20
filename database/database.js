/**
 * Created by eleven on 20/08/2016.
 */
const localSettings = require('../local-settings');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    localSettings.dbFile,
    localSettings.dbUser,
    localSettings.dbPass,
    {
        host: 'localhost',
        dialect: 'mysql'
    }
);

class Database {

    constructor() {
        this.deviceModel = sequelize.define('devices', {
            id: {type: Sequelize.INTEGER, primaryKey: true},
            name: Sequelize.STRING
        }, {
            timestamps: false
        });
    }

    /**
     * @param device {Device}
     */
    addDevice(device) {
        const DB = this;
        sequelize.sync().then(function () {
            return DB.deviceModel.create({
                id: device.id,
                name: device.name
            });
        })
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
}

module.exports = new Database();