init_f1()
function init_f1(){
	const VS=['S','1','2','E'];
	const CCX=['x','y','z'];
	
	var renderer,scene,camera;
	var controls;
	var canvas=document.querySelector('#f1');
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
	$("#surface .pos").each(function(){
		var key=$("#surface .pos").index(this);
		var cx=key % 3;
		var idx=(key-cx)/3;
		var yid = idx % 4;
		var xid = (idx -yid)/4;
		var lbl=VS[xid]+VS[yid]; 		
		if(cx==0) position[lbl] = new THREE.Vector3();
		position[lbl][CCX[cx]] = Number($(this).val())
		if(cx==2) makePoint(lbl);
	})
	var matrix;
	var xnum,ynum;	
	makeMatrix();
	var pos;
	
	const numX=20,numY=20;
	calcPosLoop()
	var geometry= new THREE.Geometry();
	var lseg= new THREE.LineSegments( geometry, new THREE.LineBasicMaterial({color:0xFF0000}) );
	scene.add(lseg)		
	setLineSegmentPos();
	tick();

	function setLineSegmentPos(){
		lseg.geometry.vertices=[];
		var ci=0;
		var cj=0;
		for(ci=0;ci<=numX;ci++){
			for(cj=0;cj<=numY-1;cj++){
				lseg.geometry.vertices.push(pos[ci][cj]);
				lseg.geometry.vertices.push(pos[ci][cj+1]);
			}
		}
		for(ci=0;ci<=numX-1;ci++){
			for(cj=0;cj<=numY;cj++){
				lseg.geometry.vertices.push(pos[ci][cj]);
				lseg.geometry.vertices.push(pos[ci+1][cj]);
			}
		}
	}

	function makeMatrix(){
		matrix=null;
		xnum = $('.x2o').prop("checked") ? ($('.x3o').prop("checked") ? 4:3):2
		ynum = $('.y2o').prop("checked") ? ($('.y3o').prop("checked") ? 4:3):2
		matrix = new Array(xnum);
		for(var i=0;i<xnum;i++) matrix[i]= new Array(ynum);
		for(var id in position){
			var ix=id.charAt(0);
			var iy=id.charAt(1);
			var xn= ix=='S' ? 0:(ix=='E'?(xnum-1):(ix=='1')?(xnum>2?1:-1):(xnum==4?2:-1))
			var yn= iy=='S' ? 0:(iy=='E'?(ynum-1):(iy=='1')?(ynum>2?1:-1):(ynum==4?2:-1))
			if(xn>=0 && yn>=0) matrix[xn][yn]=position[id]
		}
	}
	function calcPosLoop(){
		pos=new Array(numX+1);
		for(var i=0;i<=numX;i++){
			pos[i]=new Array(numY+1);
			for(var j=0;j<=numY;j++){
				pos[i][j]=posCalc(i/numX,j/numY)
			}
		}
	}
	function Bern(n,t){
		var ar = new Array(n+1);
		if(n==1){
			ar=[1-t,t];
		}else if(n==2){
			ar=[(1-t)*(1-t),2*t*(1-t),t*t];
		}else if(n==3){
			ar=[(1-t)*(1-t)*(1-t),3*t*(1-t)*(1-t),3*t*t*(1-t),t*t*t];
		}
		return ar;
	}
	function aMb(a,m,b){
		var s=new THREE.Vector3(0,0,0);
		for(var ka in a) for(var kb in b){
			s.x=s.x+a[ka]*m[ka][kb].x*b[kb]
			s.y=s.y+a[ka]*m[ka][kb].y*b[kb]
			s.z=s.z+a[ka]*m[ka][kb].z*b[kb]
		}
		return s;
	}
	function posCalc(u,v){return aMb(Bern(xnum-1,u),matrix,Bern(ynum-1,v))}


	$(document).on("click","#surface .x3o",drawLine);
	$(document).on("click","#surface .x2o",drawLine);
	$(document).on("click","#surface .y3o",drawLine);
	$(document).on("click","#surface .y2o",drawLine);
	
	function drawLine(){
		makeMatrix();
		calcPosLoop();
		setLineSegmentPos();
		lseg.geometry.verticesNeedUpdate = true;
	}
	
	$(document).on("change","#surface .pos",function(){
		var key=$("#surface .pos").index(this);
		var cx=key % 3;
		var idx=(key-cx)/3;
		var yid = idx % 4;
		var xid = (idx -yid)/4;
		var lbl=VS[xid]+VS[yid];
		position[lbl][CCX[cx]] =Number($(this).val());
		point[lbl].position.copy(position[lbl]);
		cp[lbl].position.addVectors(position[lbl],new THREE.Vector3(0.2,0.2,0));
		drawLine();
	})

	function makePoint(s){
		point[s]=setPoint(position[s],s,scene);
		cp[s]=text3D(s);
		scene.add(cp[s]);
		cp[s].position.addVectors(position[s],new THREE.Vector3(0.2,0.2,0));
	}
	
	$(document).on("click","#f1Stop",function(){
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