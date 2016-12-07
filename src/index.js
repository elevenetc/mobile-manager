const restify = require('restify');
const logger = require('morgan');
const DeviceManager = require('./managers/device-manager');
const PingManager = require('./managers/ping-manager');
const view = require('./view/view');
const utils = require('./utils/utils');

class DM {

    constructor(config) {
        this.config = config;
        utils.checkNull(config, 'dbFile');
        utils.checkNull(config, 'dbUser');
        utils.checkNull(config, 'dbPass');
        utils.checkNull(config.keys, 'googleCloud');
        utils.checkNull(config.keys, 'slack');
        utils.checkNull(config, 'port');
        utils.checkNull(config, 'pingTimeout');
    }

    start() {

        //TODO: remove console.log
        //TODO: add sort
        //TODO: add header before devices(filter, amount of devices)
        const config = this.config;

        const server = restify.createServer({
            name: 'device-manager',
            version: '0.0.1'
        });

        const deviceManager = new DeviceManager(config);
        const pingManager = new PingManager(deviceManager, config);

        server.use(logger('dev'));
        server.use(restify.acceptParser(server.acceptable));
        server.use(restify.queryParser());
        server.use(restify.bodyParser());

        server.post('/ping', function (req, res, next) {

            pingManager.pingDevices(function () {
                res.send({});
            }, function (error) {
                res.send(error);
            });
            return next();
        });

        server.post('/online/:deviceId', function (req, res, next) {
            const deviceId = req.params.deviceId;
            const isOnline = req.query.isOnline;

            deviceManager.updateOnlineState(deviceId, isOnline, function () {
                console.log('isOnline:ok');
            }, function () {
                console.log('isOnline:error');
            });

            res.send({});
            return next();
        });

        server.post('/location/:deviceId', function (req, res, next) {
            const deviceId = req.params.deviceId;
            const lat = req.query.lat;
            const lon = req.query.lon;

            deviceManager.updateLocation(deviceId, lat, lon, function () {
                console.log('loc:ok');
            }, function () {
                console.log('loc:error');
            });

            res.send({});
            return next();
        });

        server.post('/devices', function (req, res, next) {

            console.log('post device', req.body.deviceId);

            deviceManager.createOrUpdateDevice(req.body, function (devices) {
                res.send(devices);
            }, function (error) {
                res.send(error);
            });
            return next();
        });

        server.get('/devices/slack', function (req, res, next) {

            let verbose = req.query.verbose;
            let token = req.query.token;
            let filters = req.query.text;

            if (token !== config.keys.slack) {
                res.status(400);
                res.send({error: 'Auth failed'});
            } else {
                deviceManager.getDevices(function (devices) {
                    res.end(view.renderDevices('slack', devices, verbose, filters));
                }, function (error) {
                    res.send(error);
                });
            }

            return next();
        });

        server.del('/devices/:id', function (req, res, next) {
            deviceManager.deleteDevice(req.params.id, function (devices) {
                res.send({deleted: devices});
            }, function (error) {
                console.log(error.stack);
                res.send(error);
            });
            return next();
        });

        server.on('uncaughtException', (req, res, route, err) => {
            console.log(err);
        });

        server.listen(config.port, function () {
            console.log('%s listening at %s. Ping interval:%s', server.name, server.url, config.pingTimeout);
            pingManager.start();
        });


    }

}

module.exports = DM;