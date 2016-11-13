/**
 * Created by eugene.levenetc on 19/08/16.
 */
function onCreate() {
	ajax.get('/devices', null, function (status, response) {
		console.log('response on client: ' + status + ':' + response);
		if (status == 200) {
			try {
				fillItems(JSON.parse(response));
			} catch (e) {
				fillItems(null, e);
			}
		} else {
			fillItems(null, {status: status, error: response});
		}

	})
}

/**
 * @param device {Device}
 */
function pingDevice(device) {
	ajax.post('/ping', device, function (status, response) {
		try {
			var result = JSON.parse(response);
		} catch (e) {

		}
	})
}

onCreate();