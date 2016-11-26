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

let devicesWaitingList = [];

server.post('/ping', function (req, res, next) {
    //const deviceId = req.params['deviceId'];


    controller.getDevises(function (devices) {

        console.log('ping devices', devices);

        //set offline devices
        for (let i = 0; i < devicesWaitingList.length; i++) {
            console.log('not online', devicesWaitingList[i].deviceId);
            controller.updateOnlineState(devicesWaitingList[i].deviceId, false);
        }

        let pushTokens = [];
        devicesWaitingList = devices;

        for (let i = 0; i < devices.length; i++) {
            let pushToken = devices[i].pushToken;
            pushTokens.push(pushToken);
        }

        controller.ping(pushTokens, function () {
            res.send({});
        }, function (error) {
            res.send(error);
        });

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

    for (let i = devicesWaitingList.length - 1; i >= 0; i--) {
        let deleteValue = false;
        if (devicesWaitingList[i].deviceId === req.body.deviceId) deleteValue = true;
        if (deleteValue) devicesWaitingList.splice(i, 1);
    }

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
    console.log('%s listening at %s', server.name, server.url);

    // setInterval(function () {
    //     console.log('!');
    // }, 1000);
});