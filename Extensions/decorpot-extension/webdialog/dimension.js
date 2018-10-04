function cancel() {
  window.location.href = 'skp:cancel_settings@';
}

function getdimension() {
	var val = document.getElementById('selview').value;
	if (val != 0) {
		window.location = 'skp:get_dimension@' + val;
	} else {
		alert("Please select any view")
		return false;
	}
}