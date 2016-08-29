/**
 * Created by eugene.levenetc on 19/08/16.
 */

/**
 * @param containerId {String}
 * @param device {Device}
 */
function duplicate(containerId, device) {
    var original = document.getElementById(containerId);
    var line = document.createElement('p');
    var button = document.createElement('button');

    button.innerHTML = 'Ping';
    addEventListener('click', function () {
        pingDevice(device);
    });

    line.innerHTML = 'Name';
    line.appendChild(button);
    //line.innerHTML = 'id:' + device.deviceId + ' name: ' + device.manufacturer + '-' + device.model + '<button onclick="pingDevice(' + device.deviceId + ')" >Ping</button>';
    original.appendChild(line);
}

function setText(id, text) {
    const element = document.getElementById(id);
    element.innerHTML = text;
}

function remove(id) {
    document.getElementById(id).remove();
}