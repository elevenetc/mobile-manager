/**
 * Created by eugene.levenetc on 19/08/16.
 */
function onCreate() {
    ajax.get('/devices', null, function (response) {
        console.log('responze: ' + response);
        try {
            var result = JSON.parse(response);
            fillItems(result);
        } catch (e) {
            console.log(e);
            fillItems([]);
        }

    })
}

/**
 * @param device {Device}
 */
function pingDevice(device) {
    ajax.post('/ping', device, function (response) {
        try {
            var result = JSON.parse(response);
        } catch (e) {

        }
    })
}

onCreate();