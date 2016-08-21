/**
 * Created by eugene.levenetc on 19/08/16.
 */
function duplicate(containerId, device) {
    var original = document.getElementById(containerId);
    var line = document.createElement('p');
    line.innerHTML = 'id:' + device.id + ' name: ' + device.name + '<button disabled=true>refreshing...</button>';
    original.appendChild(line);
}

function setText(id, text) {
    const element = document.getElementById(id);
    element.innerHTML = text;
}

function remove(id){
    document.getElementById(id).remove();
}