/**
 * Created by eugene.levenetc on 19/08/16.
 */
class DeviceLoader {
	constructor() {

	}

	load(handler) {
		setTimeout(function () {
			handler([
				{id: 334, name: 'Note 5'},
				{id: 445, name: 'Nexus 4'}
			])
		}, 1000);
	}
}

module.exports = DeviceLoader;