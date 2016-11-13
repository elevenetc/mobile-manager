/**
 * Created by eugene.levenetc on 01/09/16.
 */
const utils = require('./utils/node-utils');

if (utils.resolveModule('./local-settings')) {
	module.exports = require('/local-settings');
} else {
	module.exports = {
		dbFile: '',
		dbUser: '',
		dbPass: '',
		gcmApiKey: ''
	}
}