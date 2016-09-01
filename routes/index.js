var express = require('express');
var router = express.Router();
const DeviceLoader = require('../controllers/device-loader');
const database = require('../database/database-sequelize');
const winston = require('winston');
const gcmSender = require('../gcm/gcm-sender');
const impl = require('./index-impl');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', {
		title: 'Express',
		paramA: 'param:A',
		paramC: 11,
		paramObj: {x: 10},
		paramObjX: {x: 'yo'},
		deviceLoader: new DeviceLoader(),
		devices: [
			{id: 334, name: 'Note 5'},
			{id: 445, name: 'Nexus 4'}
		]
	});
});

router.post('/ping', function (req, res) {
	impl.ping(req, res);
});

router.post('/devices', function (req, res) {
	const device = req.body;
	console.log('devices:post', device);
	database.createOrUpdate(device, function (result) {
		console.log('devices:post:ok');
		handleSuccess(res, {result: result});
	}, function (error) {
		console.log('devices:post:fail', error);
		res.status(500);
		res.send({result: error.message, device: device});
	});
});

router.get('/devices', function (req, res) {

	database.getDevices(function (devices) {
		handleSuccess(res, devices);
	}, function (error) {
		res.status(500);
		res.send({result: error});
	});
});

router.delete('/devices', function (req, res) {
	const id = req.query.deviceId
	database.deleteDevice(id, function (result) {
		handleSuccess(res, {deleted: result});
	}, function (error) {

	});
});

function handleSuccess(res, result) {
	res.status(200);
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(result));
}


module.exports = router;
