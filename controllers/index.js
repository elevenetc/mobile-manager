/**
 * Created by eugene.levenetc on 19/08/16.
 */
function onCreate() {
    console.log('index: onCreateZ');
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

onCreate();