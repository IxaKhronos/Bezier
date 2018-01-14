function text3D(str){
	var canvas = document.createElement('canvas');
	canvas.height=16;
	canvas.width=32;
	var context = canvas.getContext('2d');
	context.textAlign="center";
	context.fillStyle = "white";
	context.fillText(str,16,12);
	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;
	return new THREE.Mesh(new THREE.PlaneGeometry(1,0.5),
		new THREE.MeshBasicMaterial({
			map:texture,
			side: THREE.DoubleSide,
			transparent:true})
	)
}

function setPoint(pos,name,scene){
	var mesh = new THREE.Mesh(new THREE.SphereGeometry(0.03,16,8),new THREE.MeshBasicMaterial({color:0xffffff}));
	mesh.position.copy(pos);
	mesh.name=name;
	scene.add(mesh);
	return mesh;
}
