var express = require('express');
var router = express.Router();
const DeviceLoader = require('../controllers/device-loader');

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

router.get('/devices', function (req, res, next) {
	const result = [
		{id: 334, name: 'Note 5'},
		{id: 445, name: 'Nexus 4'}
	];

	setTimeout(function () {
		res.send(JSON.stringify(result));
	}, 1000);
});

module.exports = router;
