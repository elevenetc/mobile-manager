const GcmSender = require('../cloud/gcm-sender');
const logger = require('../logger/logger');

class PingManager {

    constructor(deviceManager, config) {
        this.config = config;
        this.deviceManager = deviceManager;
        this.gcm = new GcmSender(config);
    }

    start() {
        this.intervalPing(this);
        setInterval(this.intervalPing.bind(this), this.config.pingTimeout);
    }

    pingDevices(okHandler, errorHandler) {
        const dManager = this.deviceManager;
        const ref = this;
        dManager.getDevices(function (devices) {

            const pushTokens = [];

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
            logger.info('ping request: ok');
        }, function (error) {
            logger.error('ping request: error %s', error);
        });
    }

}

module.exports = PingManager;
