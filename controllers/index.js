/**
 * Created by eugene.levenetc on 19/08/16.
 */
function onCreate() {
	console.log('index: onCreateZ');
	ajax.get('/devices', null, function (response) {
		console.log('responze: ' + response);
		fillItems(JSON.parse(response));
	})
}

onCreate();