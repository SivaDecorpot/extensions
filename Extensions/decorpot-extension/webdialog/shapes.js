function cancel() {
  window.location.href = 'skp:cancel_settings@';
}

function checkshape() {
	document.getElementById('shapes').style.display = "block";
	document.getElementById('2dimglist').style.display = "none";
	
	document.getElementById('cube').style.display = 'none';
	document.getElementById('cylinder').style.display = 'none';
	document.getElementById('cone').style.display = 'none';
	document.getElementById('pyramid').style.display = 'none';
}

function check2() {
	document.getElementById('shapes').style.display = "none";
	document.getElementById('2dimglist').style.display = "block";
	
	document.getElementById('square').style.display = 'none';
	document.getElementById('rectangle').style.display = 'none';
	document.getElementById('circle').style.display = 'none';
}

function changeshape() {
	var sid = document.getElementById('slist').value;
	if (sid == 1) {
		document.getElementById('square').style.display = 'block';
		document.getElementById('rectangle').style.display = 'none';
		document.getElementById('circle').style.display = 'none';
	} else if (sid == 2) {
		document.getElementById('square').style.display = 'none';
		document.getElementById('rectangle').style.display = 'block';
		document.getElementById('circle').style.display = 'none';
	} else if (sid == 3) {
		document.getElementById('square').style.display = 'none';
		document.getElementById('rectangle').style.display = 'none';
		document.getElementById('circle').style.display = 'block';
	}
}

function shapedraw() {
 var sid = document.getElementById('slist').value;
 if (sid == 1) {
 	var ids = document.getElementById('square_area').value;
 	window.location = 'skp:create_square@' + ids;
 } else if (sid == 2) {
 	var len = document.getElementById('rectlength').value;
 	var wid = document.getElementById('rectwidth').value;
 	var arg = len +","+wid
 	window.location = 'skp:create_rectangle@' + arg;
 } else if (sid == 3) {
 	var ids = document.getElementById('cir_radius').value;
 	window.location = 'skp:create_circle@' + ids;
 }
}


function change2d() {
	var shapeid = document.getElementById('2list').value;
	if (shapeid == 1) {
		document.getElementById('cube').style.display = 'block';
		document.getElementById('cylinder').style.display = 'none';
		document.getElementById('cone').style.display = 'none';
		document.getElementById('pyramid').style.display = 'none';
	} else if (shapeid == 2) {
		document.getElementById('cube').style.display = 'none';
		document.getElementById('cylinder').style.display = 'block';
		document.getElementById('cone').style.display = 'none';
		document.getElementById('pyramid').style.display = 'none';
	} else if (shapeid == 3) {
		document.getElementById('cube').style.display = 'none';
		document.getElementById('cylinder').style.display = 'none';
		document.getElementById('cone').style.display = 'block';
		document.getElementById('pyramid').style.display = 'none';
	} else if (shapeid == 4) {
		document.getElementById('cube').style.display = 'none';
		document.getElementById('cylinder').style.display = 'none';
		document.getElementById('cone').style.display = 'none';
		document.getElementById('pyramid').style.display = 'block';
	}
}

function drawshape() {
	var shape = document.getElementById('2list').value;
	if (shape == 0){
		alert("Please select a shape")
	} else if (shape == 1) {
		var ids = document.getElementById('cube_length').value;
		window.location = 'skp:create_cube@' + ids;
	} else if (shape == 2) {
		var len = document.getElementById('cyl_length').value;
		var rad = document.getElementById('cyl_radius').value;
		var arg = len +","+rad
		window.location = 'skp:create_cylinder@' + arg;
	} else if (shape == 3) {
		var len = document.getElementById('con_length').value;
		var rad = document.getElementById('con_radius').value;
		var arg = len +","+rad
		window.location = 'skp:create_cone@' + arg;
	} else if (shape == 4) {
		var len = document.getElementById('pyd_length').value;
		var wid = document.getElementById('pyd_width').value;
		var hgt = document.getElementById('pyd_height').value;
		var arg = len +","+ wid +","+ hgt
		window.location = 'skp:create_pyramid@' + arg;
	}
}