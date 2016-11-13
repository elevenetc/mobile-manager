/**
 * Created by eleven on 20/08/2016.
 */
class Device {

    /**
     *
     * @param deviceId {String}
     * @param gcmToken {String}
     * @param manufacturer {String}
     * @param model {String}
     */
    constructor(deviceId, gcmToken, manufacturer, model) {
        this.deviceId = deviceId;
        this.gcmToken = gcmToken;
        this.manufacturer = manufacturer;
        this.model = model;
    }
}

module.exports = Device;