/**
 * Created by eleven on 20/08/2016.
 */
class Device {

    /**
     *
     * @param deviceId {String}
     * @param pushToken {String}
     * @param manufacturer {String}
     * @param model {String}
     */
    constructor(deviceId, pushToken, manufacturer, model) {
        this.deviceId = deviceId;
        this.gcmToken = pushToken;
        this.manufacturer = manufacturer;
        this.model = model;
    }
}

module.exports = Device;