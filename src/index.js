const restify = require('restify');
const DeviceManager = require('./managers/device-manager');
const PingManager = require('./managers/ping-manager');
const view = require('./view/view-slack');
const utils = require('./utils/utils');
const logger = require('./logger/logger');

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
        utils.checkNull(config, 'logLevel');

        logger.setLevel(config.logLevel);
    }

    start() {

        const config = this.config;

        const server = restify.createServer({
            name: 'device-manager',
            version: '0.0.1',
            log: logger.getInst()
        });

        const deviceManager = new DeviceManager(config);
        const pingManager = new PingManager(deviceManager, config);

        server.use(restify.acceptParser(server.acceptable));
        server.use(restify.queryParser());
        server.use(restify.bodyParser());

        server.post('/ping', function (req, res, next) {

            pingManager.pingDevices(function () {
                res.send({});
            }, function (error) {
                logger.error(error);
                res.send(error);
            });
            return next();
        });

        server.post('/online/:deviceId', function (req, res, next) {

            const deviceId = req.params.deviceId;
            const isOnline = req.query.isOnline;

            deviceManager.updateOnlineState(deviceId, isOnline, function () {
                logger.info('isOnline:ok');
            }, function () {
                logger.info('isOnline:error');
            });

            res.send({});
            return next();
        });

        server.post('/location/:deviceId', function (req, res, next) {
            const deviceId = req.params.deviceId;
            const lat = req.query.lat;
            const lon = req.query.lon;

            deviceManager.updateLocation(deviceId, lat, lon, function () {
                logger.info('loc:ok');
            }, function () {
                logger.info('loc:error');
            });

            res.send({});
            return next();
        });

        server.post('/devices', function (req, res, next) {

            deviceManager.createOrUpdateDevice(req.body, function () {
                res.send({});
            }, function (error) {
                res.send(error);
            });
            return next();
        });

        server.get('/devices/slack', function (req, res, next) {

            const token = req.query.token;
            const filters = req.query.text;

            if (token !== config.keys.slack) {
                res.status(400);
                res.send({error: 'Auth failed'});
            } else {
                deviceManager.getDevices(function (devices) {
                    res.end(view.renderDevices('slack', devices, filters));
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
                logger.error(error.stack);
                res.send(error);
            });
            return next();
        });

        server.on('uncaughtException', (req, res, route, err) => {
            logger.error(err);
        });

        server.pre(function (request, response, next) {
            request.log.info({req: request}, 'start');
            return next();
        });

        server.listen(config.port, function () {
            logger.info('%s listening at %s. Ping interval:%s', server.name, server.url, config.pingTimeout);
            pingManager.start();
        });


    }

}

module.exports = DM;