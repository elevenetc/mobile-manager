/**
 * Created by eugene.levenetc on 01/09/16.
 */

const gcmSender = require('./gcm-sender');

module.exports = {
	ping: function (req, res) {
		const device = req.body;
		res.status(200);
		res.send('');

		gcmSender.ping(
			device,
			() => console.log('ping: ok'),
			() => console.log('ping: fail')
		);
	}
};