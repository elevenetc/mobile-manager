const GcmSender = require('../cloud/gcm-sender');

class PingManager {

    constructor(deviceManager, config) {
        this.config = config;
        this.deviceManager = deviceManager;
        this.gcm = new GcmSender(config);
    }

    start() {
        this.intervalPing();
        setInterval(this.intervalPing, this.config.pingTimeout);
    }

    pingDevices(okHandler, errorHandler) {
        const dManager = this.deviceManager;
        const ref = this;
        dManager.getDevices(function (devices) {

            let pushTokens = [];

            for (let i = 0; i < devices.length; i++) {
                pushTokens.push(devices[i].pushToken);
                dManager.updateOnlineState(devices[i].deviceId, false);
            }

            ref.ping(pushTokens, function () {
                okHandler();
            }, function (error) {
                errorHandler(error);
            });

        }, function (error) {
            errorHandler(error);
        });
    }

    ping(pushTokens, okHandler, errorHandler) {
        this.gcm.ping(pushTokens, function () {
            okHandler();
        }, errorHandler);
    }

    intervalPing() {
        this.pingDevices(function () {
            console.log('ping ok');
        }, function (error) {
            console.log('ping error: %s', error);
        });
    }

}

module.exports = PingManager;
