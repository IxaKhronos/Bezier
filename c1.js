init_c1()
function init_c1(){
	const VS=['S','1','2','E'];
	const CCX=['x','y','z'];
	var renderer,scene,camera;
	var controls;
	var canvas=document.querySelector('#c1');
	renderer = new THREE.WebGLRenderer({canvas:canvas});
	renderer.setPixelRatio(window.devicePixelRatio);
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(45, 400 / 400);
	camera.position.set(0,0,10);
	controls = new THREE.OrbitControls(camera,canvas);
	controls.enableKeys=false;
	var axesHelper = new THREE.AxesHelper( 5 );
	scene.add( axesHelper );

	var point={};
	var position={};
	var cp={};
	$("#curve .pos").each(function(){
		var key=$("#curve .pos").index(this);
		var cx=key % 3;
		var idx=(key-cx)/3;
		var lbl=VS[idx]; 		
		if(cx==0) position[lbl] = new THREE.Vector3();
		position[lbl][CCX[cx]] = Number($(this).val())
		if(cx==2) makePoint(lbl);
	})
	
	var linematerial  = new THREE.LineBasicMaterial({color: 0x808080});
	var qlinematerial = new THREE.LineBasicMaterial({color: 0xd0d0d0});
	var clinematerial = new THREE.LineBasicMaterial({color: 0xffffff});
	
	var lineGeometry=[];
	lineGeometry[0]=new THREE.Geometry();
	lineGeometry[1]=new THREE.Geometry();
	lineGeometry[2]=new THREE.Geometry();
	lineGeometry[3]=new THREE.Geometry();
	lineGeometry[4]=new THREE.Geometry();
	
	lineGeometry[0].vertices.push(position['S'],position['1']);
	lineGeometry[1].vertices.push(position['1'],position['E']);
	lineGeometry[2].vertices.push(position['1'],position['2']);
	lineGeometry[3].vertices.push(position['2'],position['E']);	
	lineGeometry[4].vertices.push(position['S'],position['E']);	
	
	var line=[];
	line[0] = new THREE.Line( lineGeometry[0], linematerial);
	line[1] = new THREE.Line( lineGeometry[1], linematerial);
	line[2] = new THREE.Line( lineGeometry[2], linematerial);
	line[3] = new THREE.Line( lineGeometry[3], linematerial);
	line[4] = new THREE.Line( lineGeometry[4], linematerial);
	scene.add( line[0] );
	scene.add( line[1] );
	scene.add( line[2] );
	scene.add( line[3] );
	scene.add( line[4] );

	var qgeometry=[];
	qgeometry[0] = new THREE.BufferGeometry().setFromPoints( (new THREE.QuadraticBezierCurve3(position['S'],position['1'],position['2'])).getPoints( 50 ) );
	qgeometry[1] = new THREE.BufferGeometry().setFromPoints( (new THREE.QuadraticBezierCurve3(position['1'],position['2'],position['E'])).getPoints( 50 ) );
	qgeometry[2] = new THREE.BufferGeometry().setFromPoints( (new THREE.QuadraticBezierCurve3(position['S'],position['1'],position['E'])).getPoints( 50 ) );
	var qcurveObject=[];
	qcurveObject[0] = new THREE.Line( qgeometry[0], qlinematerial );
	qcurveObject[1] = new THREE.Line( qgeometry[1], qlinematerial );
	qcurveObject[2] = new THREE.Line( qgeometry[2], qlinematerial );
	scene.add(qcurveObject[0]);
	scene.add(qcurveObject[1]);
	scene.add(qcurveObject[2]);

	var cgeometry = new THREE.BufferGeometry().setFromPoints( (new THREE.CubicBezierCurve3(position['S'],position['1'],position['2'],position['E'])).getPoints( 50 ) );
	var ccurveObject = new THREE.Line( cgeometry, clinematerial );	
	scene.add(ccurveObject );
	
	drawLine()
	tick();

	$(document).on("click","#curve .3o",function(){
		drawLine();
	})
	$(document).on("click","#curve .2o",function(){
		drawLine();
	})
	
	function drawLine(){
		if($("#curve .2o").prop("checked")){
			if($("#curve .3o").prop("checked")){
				drawCubic();
			}else{
				drawQuadratic();
			}
		}else{
			drawLinear();
		}
	}
	function drawLinear(){
		point["1"].visible=false;
		point["2"].visible=false;
		cp["1"].visible=false;
		cp["2"].visible=false;
		
		line[4].geometry.vertices[0].copy(position['S'])
		line[4].geometry.vertices[1].copy(position['E'])
		line[4].geometry.verticesNeedUpdate = true;
		
		line[0].visible=false;
		line[1].visible=false;
		line[2].visible=false;
		line[3].visible=false;
		line[4].visible=true;
		qcurveObject[0].visible=false;
		qcurveObject[1].visible=false;
		qcurveObject[2].visible=false;
		ccurveObject.visible=false;
	}
	function drawQuadratic(){
		point["1"].visible=true;
		point["2"].visible=false;
		cp["1"].visible=true;
		cp["2"].visible=false;
		
		line[0].geometry.vertices[0].copy(position['S'])
		line[0].geometry.vertices[1].copy(position['1'])
		line[0].geometry.verticesNeedUpdate = true;
		line[1].geometry.vertices[0].copy(position['1'])
		line[1].geometry.vertices[1].copy(position['E'])
		line[1].geometry.verticesNeedUpdate = true;
		line[0].visible=true;
		line[1].visible=true;
		line[2].visible=false;
		line[3].visible=false;
		line[4].visible=false;
		
		qcurveObject[2].geometry.setFromPoints( (new THREE.QuadraticBezierCurve3(position['S'],position['1'],position['E'])).getPoints( 50 ) );
		qcurveObject[0].visible=false;
		qcurveObject[1].visible=false;
		qcurveObject[2].visible=true;
		
		ccurveObject.visible=false;
	}
	function drawCubic(){
		point["1"].visible=true;
		point["2"].visible=true;
		cp["1"].visible=true;
		cp["2"].visible=true;
		
		line[0].geometry.vertices[0].copy(position['S'])
		line[0].geometry.vertices[1].copy(position['1'])
		line[0].geometry.verticesNeedUpdate = true;
		line[2].geometry.vertices[0].copy(position['1'])
		line[2].geometry.vertices[1].copy(position['2'])
		line[2].geometry.verticesNeedUpdate = true;
		line[3].geometry.vertices[0].copy(position['2'])
		line[3].geometry.vertices[1].copy(position['E'])
		line[3].geometry.verticesNeedUpdate = true;
		line[0].visible=true;
		line[1].visible=false;
		line[2].visible=true;
		line[3].visible=true;
		line[4].visible=false;
		
		qcurveObject[0].geometry.setFromPoints( (new THREE.QuadraticBezierCurve3(position['S'],position['1'],position['2'])).getPoints( 50 ) );
		qcurveObject[1].geometry.setFromPoints( (new THREE.QuadraticBezierCurve3(position['1'],position['2'],position['E'])).getPoints( 50 ) );
		qcurveObject[0].visible=true;
		qcurveObject[1].visible=true;
		qcurveObject[2].visible=false;
		
		ccurveObject.geometry.setFromPoints( (new THREE.CubicBezierCurve3(position['S'],position['1'],position['2'],position['E'])).getPoints( 50 ) );
		ccurveObject.visible=true;
	}

	
	$(document).on("change","#curve .pos",function(){
		var key=$("#curve .pos").index(this);
		var cx=key % 3;
		var id=(key-cx)/3;
		var s=VS[id]
		position[s][CCX[cx]] =Number($(this).val());
		point[s].position.copy(position[s]);
		cp[s].position.addVectors(position[s],new THREE.Vector3(0.2,0.2,0));
		drawLine();
	})

	function makePoint(s){
		point[s]=setPoint(position[s],s,scene);
		cp[s]=text3D(s);
		scene.add(cp[s]);
		cp[s].position.addVectors(position[s],new THREE.Vector3(0.2,0.4,0));
	}
	$(document).on("click","#c1Stop",function(){
		if($(this).text()=="stop"){
			$(this).text("start")
			cancelAnimationFrame(tick)
		}else{
			$(this).text("stop")
			requestAnimationFrame(tick);
		}
	})
	function tick(){
		requestAnimationFrame(tick);	
		renderer.render(scene, camera);
	}	
}