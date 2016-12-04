/**
 * Created by eleven on 29/08/2016.
 */

const GCM = require('node-gcm');

class GcmSender {

    constructor(config) {
        this.sender = new GCM.Sender(config.gcmApiKey);
    }

    ping(pushTokens, okHandler, failHandler) {
        this.internalPing(pushTokens, okHandler, failHandler);
    }

    internalPing(tokens, okHandler, failHandler) {

        const message = new GCM.Message({
            timeToLive: 10,
            data: {command: 'ping'}
        });

        this.sender.send(message, {registrationTokens: tokens}, function (err, response) {
            if (err) {
                failHandler({err: err, resp: response});
            } else {
                if (response.failure === 0) okHandler();
                else failHandler();
            }
        });
    }
}

module.exports = GcmSender;