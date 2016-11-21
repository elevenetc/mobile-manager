const restify = require('restify');
const logger  = require('morgan');
const router = require('./routes/index');
const localSettins = require('../local-settings');

const server = restify.createServer({
    name: 'device-manager',
    version: '0.0.1'
});

const pingMap = {};

server.use(logger('dev'));
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/echo/:name', function (req, res, next) {
    res.send(req.params);
    return next();
});


//TODO: should send only deviceId, token already in db
server.post('/ping/:gcmToken', function (req, res, next) {
    const deviceId = req.params['deviceId'];

    router.ping(req.params.gcmToken, function () {
        pingMap[deviceId] = res;

        setTimeout(function () {

            if (pingMap.hasOwnProperty(deviceId)) {
                pingMap[deviceId].send({online: false});
                delete pingMap[deviceId];
            }

        }, 3000);

    }, function (error) {
        res.send(error);
    });
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
    router.postDevices(req.body, function (devices) {
        res.send(devices);
    }, function (error) {
        res.send(error);
    });
    return next();
});

server.get('/devices', function (req, res, next) {
    router.getDevises(function (devices) {
        res.send(devices);
    }, function (error) {
        res.send(error);
    });
    return next();
});

server.del('/devices/:id', function (req, res, next) {
    router.deleteDevice(req.params.id, function (devices) {
        res.send({deleted: devices});
    }, function (error) {
        console.log(error.stack);
        res.send(error);
    });
    return next();
});

server.listen(localSettins.port, function () {
    console.log('%s listening at %s', server.name, server.url);
});