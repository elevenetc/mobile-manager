const restify = require('restify');
const logger = require('morgan');
const controller = require('./controllers/main-controller');
const localSettings = require('../local-settings');

const server = restify.createServer({
    name: 'device-manager',
    version: '0.0.1'
});

server.use(logger('dev'));
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.post('/ping', function (req, res, next) {

    pingDevices(function () {
        res.send({});
    }, function (error) {
        res.send(error);
    });
    return next();
});

server.post('/online/:deviceId', function (req, res, next) {
    const deviceId = req.params.deviceId;
    const isOnline = req.query.isOnline;

    controller.updateOnlineState(deviceId, isOnline, function () {
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

    controller.updateLocation(deviceId, lat, lon, function () {
        console.log('loc:ok');
    }, function () {
        console.log('loc:error');
    });

    res.send({});
    return next();
});

server.post('/pong/:deviceId', function (req, res, next) {
    const deviceId = req.params.deviceId;

    if (pingMap.hasOwnProperty(deviceId)) {
        pingMap[deviceId].send({online: true});
        delete pingMap[deviceId];
    }

    res.send({});
    return next();
});

server.post('/devices', function (req, res, next) {

    console.log('post device', req.body.deviceId);

    controller.postDevice(req.body, function (devices) {
        res.send(devices);
    }, function (error) {
        res.send(error);
    });
    return next();
});

server.get('/devices', function (req, res, next) {
    controller.getDevises(function (devices) {
        res.send(devices);
    }, function (error) {
        res.send(error);
    });
    return next();
});

server.del('/devices/:id', function (req, res, next) {
    controller.deleteDevice(req.params.id, function (devices) {
        res.send({deleted: devices});
    }, function (error) {
        console.log(error.stack);
        res.send(error);
    });
    return next();
});

server.listen(localSettings.port, function () {
    console.log('%s listening at %s. Ping interval:%s', server.name, server.url, localSettings.pingTimeout);

    intervalPing();
    setInterval(intervalPing, localSettings.pingTimeout);
});

function intervalPing() {
    pingDevices(function () {
        console.log('ping ok');
    }, function (error) {
        console.log('ping error: %s', error);
    });
}

function pingDevices(okHandler, errorHandler) {
    controller.getDevises(function (devices) {

        let pushTokens = [];

        for (let i = 0; i < devices.length; i++) {
            pushTokens.push(devices[i].pushToken);
            controller.updateOnlineState(devices[i].deviceId, false);
        }

        controller.ping(pushTokens, function () {
            okHandler();
        }, function (error) {
            errorHandler(error);
        });

    }, function (error) {
        errorHandler(error);
    });
}