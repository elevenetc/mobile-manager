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

    ping(pushTokens, okHandler, failHandler) {
        this.internalPing(pushTokens, okHandler, failHandler);
    }

    internalPing(tokens, okHandler, failHandler) {

        var message = new GCM.Message({
            timeToLive: 10,
            data: {command: 'ping'}
        });

        sender.send(message, {registrationTokens: tokens}, function (err, response) {
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