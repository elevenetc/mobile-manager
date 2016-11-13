/**
 * Created by eleven on 29/08/2016.
 */

const GCM = require('node-gcm');
const config = require('../../local-settings');
const sender = new GCM.Sender(config.gcmApiKey);

class GcmSender {

    constructor() {
        console.log('GCM Created')
    }

    /**
     * @param gcmToken {String}
     * @param okHandler {Function}
     * @param failHandler {Function}
     */
    ping(gcmToken, okHandler, failHandler) {
        this.internalPing(gcmToken, okHandler, failHandler);
    }

    internalPing(token, okHandler, failHandler) {
        console.log('internal ping');

        var message = new GCM.Message({
            data: {command: 'ping'}
        });

        sender.send(message, {registrationTokens: [token]}, function (err, response) {
            if (err) {
                failHandler({err: err, resp: response});
            } else {
                if (response.failure == 0) okHandler();
                else failHandler();
            }
        });
    }
}

module.exports = new GcmSender();