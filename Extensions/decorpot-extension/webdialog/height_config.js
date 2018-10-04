function getvalue(){
	var height = document.getElementById('heightval').value;
	if (height != ""){
		if(isNaN(height)) {
			alert("Please enter valid value")
			return false;
		} else {
			window.location = 'skp:height_value@' + height;
		}
	} else {
		alert("Please enter a height value")
		//document.getElementById("heightval").value = "";
		//document.getElementById('heightval').focus();
		return false;
	}
}