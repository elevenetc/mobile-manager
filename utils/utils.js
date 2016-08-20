/**
 * Created by eugene.levenetc on 19/08/16.
 */
function duplicate(id, newId) {
	var original = document.getElementById(id);
	var clone = original.cloneNode(true);
	clone.id = newId;
	original.parentNode.appendChild(clone);
}