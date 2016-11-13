const restify = require('restify');
const router = require('./routes/index');

const server = restify.createServer({
    name: 'device-manager',
    version: '0.0.1'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/echo/:name', function (req, res, next) {
    res.send(req.params);
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

server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});