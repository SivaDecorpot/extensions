// JavaScript File for settings.html 
function cancel() {
  window.location.href = 'skp:cancel_settings@';
}

function sendpoints() {
	var ids = new Array ("x1", "y1", "z1", "x2", "y2", "z2", "x3", "y3", "z3", "x4", "y4", "z4");
	var arg = "";
	var entry = "";
	var valid = true;

	//alert(ids)
	for (i in ids)
	{
		//alert(i)
		entry = document.getElementById(ids[i]).value;
		if ((entry.length == 0) || isNaN(entry))
		{
			valid = false;
			//alert("valid")
		}
		else
		{
			arg = arg + entry + ",";
			//alert("ar = "+arg)
		}
	}

	//alert("valid = "+ valid)
	if (!valid)
	{
		arg = "";
	}
	alert(arg)
	window.location = 'skp:create_face@' + arg;
}

function fetch_settings(arg) {
  window.location.href = 'skp:fetch_settings@' + arg;
}



