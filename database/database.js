/**
 * Created by eleven on 21/08/2016.
 */
class Database {
    constructor() {

    }

    isDeviceValid(device) {
        return device !== null && device !== undefined && device.deviceId !== null && device.deviceId !== undefined;
    }

    resultUpdated() {
        return Database.UPDATED;
    }

    resultCreated() {
        return Database.CREATED;
    }
}

Database.CREATED = "created";
Database.UPDATED = "updated";
module.exports = Database;