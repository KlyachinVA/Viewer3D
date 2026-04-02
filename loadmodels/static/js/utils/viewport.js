import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
//import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { loadModel } from '/static/js/utils/fbxloader.js'
import { loadGlTfModel } from '/static/js/utils/gltfloader.js'
import { loadObjModel } from '/static/js/utils/objloader.js'
import { show, hide} from '/static/js/utils/windows.js'
//import { box, view, handleKeyDown } from '/static/js/utils/observer.js'
//import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { FBXLoader } from '/static/js/node_modules/three/examples/jsm/loaders/FBXLoader.js'
export class ViewPort{

	constructor(id_element,data,fname_json){
		
		this.obj_models;
		this.map_json;
		this.path;
		fname_json = fname_json.split(".")[0]
		let json_url = "get_json_data/" + fname_json // "/static/models/scenes/" + fname_json
		fetch(json_url)
		.then(response => response.json())
		.then(jsonData3 =>  {this.obj_models = jsonData3["objmodels"]; this.map_json=jsonData3["houses"]; this.path=jsonData3["path"]});
			
		/*this.map_json;
		this.models_json;
		fetch('http://127.0.0.1:8000/static/models/scenes/models_scene.json')
		.then(response => response.json())
		.then(jsonData => this.map_json=jsonData["houses"]);*/
		
		fetch('/static/models/comments/second.html')
		.then(response => response.text())
		.then(html => document.getElementById('inf').innerHTML = html);
		
		fetch('/static/models/comments/hotel.html')
		.then(response => response.text())
		.then(html_h => document.getElementById('hotel').innerHTML = html_h);
		
		
		//this.path=[[0,-80], [-53.5,-46.9], [-49.4, 20.9], [24.7, 60.0], [49.3, -22.2], [0,-80]];
		this.full_path = [];
		
		this.view={
		rotationY:0,
		pZ: 0,
		positionX: 0,
		positionY: 10,
		positionZ: -80,
		moveX: 0,
		moveY: 0,
		moveZ: 0,
		
		phi: Math.PI/2,
		psi: -0.125,
		direct_x: 0,
		direct_y: 0,
		direct_z: 0,
		ds: 0,
		t: 0,
		go_yes: false,
		k: 0, 
		start: false,
		house: 0,
		hs_id: ["hotel", "inf"]
		};
		
		this.scene = null
		this.light
		this.ambientLight
		this.camera
		this.renderer 
		//this.controls
		this.id_element = id_element
		this.element = document.getElementById(id_element)
		this.objloader = new OBJLoader()
		this.mtlloader = new MTLLoader()
		this.fbxloader = new FBXLoader()
		this.first = true
		
		let element = this.element
		let computedStyle = getComputedStyle(element)
		
		let width = computedStyle.width.slice(0,-2)
		let height = computedStyle.height.slice(0,-2)
		
			
		
		this.renderer = new THREE.WebGLRenderer({antialias:true});
		console.log(width, height)
		this.renderer.setSize(width,height );
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		
		this.scene = new THREE.Scene();
		this.color = new THREE.Color(data.color);
		this.scene.background = this.color
		this.camera = new THREE.PerspectiveCamera( data.fov, window.innerWidth / window.innerHeight, 0.1, 1000 );
		this.camera.position.z = this.view.positionZ;// data.z_distance;
		this.camera.position.y = this.view.positionY;
		this.camera.lookAt(new THREE.Vector3(0,0,0));
		
		
		}
		
		init(models,data){
			if(!this.first){
				return
				}
			console.log("call-init")
			this.first = false
			
			this.light = new THREE.PointLight(0xffffff, 5000,100)
			this.light.position.set(50, 40, 0.0)
			this.light.castShadow = true
			this.scene.add(this.light)
			this.light = new THREE.PointLight(0xffffff, 1000)
			this.light.position.set(-30, 30, 0.0)
			this.light.castShadow = true
			this.scene.add(this.light)
			this.light = new THREE.PointLight(0xffffff, 1000)
			this.light.position.set(0, 30, 30.0)
			this.light.castShadow = true
			this.scene.add(this.light)
			this.light = new THREE.PointLight(0xffffff, 1000)
			this.light.position.set(0, 30, -30.0)
			this.light.castShadow = true
			this.scene.add(this.light)
		
		
		
		
			this.light.shadow.mapSize.width = 512; // default
			this.light.shadow.mapSize.height = 512; // default
			this.light.shadow.camera.near = 0.5; // default
			this.light.shadow.camera.far = 1000; 
			this.light.shadow.radius = 10
			this.light.shadow.blurSamples = 100
		
		
			if(data.ambient_light){
				this.ambientLight = new THREE.AmbientLight()
				this.scene.add(this.ambientLight)
			}
		
			
			this.animate = () => {
				if(this.view.start)
				{
				this.camera.position.x=this.view.positionX;
				this.camera.position.y=this.view.positionY;
				this.camera.position.z=this.view.positionZ;
				
				if(!this.view.go_yes){
					this.camera.lookAt(new THREE.Vector3(this.view.direct_x,this.view.direct_y,this.view.direct_z));
				}
				if(this.view.go_yes){
	
				this.go_this_path();
				this.camera.lookAt(new THREE.Vector3(0,0,0));
				} 
			}
				this.renderer.render(this.scene,this.camera)
			}
		
			//this.renderer.setAnimationLoop( this.animate );

			
			this.element.appendChild( this.renderer.domElement );
			//this.controls = new OrbitControls(this.camera, this.renderer.domElement)
		
			const planeGeometry = new THREE.PlaneGeometry( 120, 120, 32, 32 );
			const planeMaterial = new THREE.MeshStandardMaterial( { color: 0x00ff00 } )
			const plane = new THREE.Mesh( planeGeometry, planeMaterial );
			plane.receiveShadow = true;
			plane.rotation.set(-3.14/2,0,0)
			
			this.scene.add( plane );
			//this.handleKeyDown(event);
			//this.handleMouseMove(event);
			//this.handleMouseWheel(event);
			//this.go_this_path();
			//this.start();
			//this.load_3dmodels(this.fbxloader,this.scene,models,this.element,"loading")
			this.load_3dobjmodels(this.mtlloader,this.objloader,this.scene,models,this.element,"loading")
			//load_3dmodels(glloader,scene,models,element,"loading")
			
	
		//this.renderer.render(this.scene,this.camera)
		}

	load_3dmodels(loader,scene,models,element,id_element){

	let N = models.length
	for(let i in models){
		let model = models[i]
			console.log("model:",model)
			loadModel(loader,this.scene,model,i,N,this.element,this.id_element)
			//loadObjModel(mtlloader,objloader,scene,model,i,N,element,id_element)
			//loadGlTfModel(loader,dracoLoader,scene,model,i,N,element,id_element)

		}
}
async	load_3dobjmodels(mtlloader,objloader,scene,models,element,id_element){
	
		let N = models.length
		console.log("N=",N)
		for(let i in models){
			let model = models[i]
				console.log("model:",model)
				//loadModel(loader,scene,model,i,N,element,id_element)
				await loadObjModel(this.mtlloader,this.objloader,this.scene,model,i,N,this.element,this.id_element)
				//loadGlTfModel(loader,dracoLoader,scene,model,i,N,element,id_element)
		
			}
}
	
	clear(){
		this.scene.clear()
		}
	
handleKeyDown(event) {                             // клавиша нажата
        //var phi = 1;
		var zoom = 0.5;
		var ugol = 0.01;
		var shag_up = 0.3;
		var go_yes = true;
		var  z;
		var  x;
		var  y;
		var d12 = 0;
		var d23 = 0;
		var d34 = 0;
		var d41 = 0;
		var xx, zz;
		
		
		if(event.keyCode == 71){//g
		console.log("x:", this.view.positionX);
		console.log("y:", this.view.positionY);
		console.log("z:", this.view.positionZ);
		
		/*console.log("d12:", d12);
		console.log("d23:", d23);
		console.log("d34:", d34);
		console.log("d41:", d41);
		console.log("len map:", this.map_json.length);
		console.log("W: ", window.innerWidth);
		console.log("H: ", window.innerHeight);*/
		
		console.log("dir-x:", this.view.direct_x);
		console.log("dir-y:", this.view.direct_y);
		console.log("dir-z:", this.view.direct_z);
		
		console.log("phi:", this.view.phi);
		console.log("psi:", this.view.psi);
		console.log("start:", this.view.start);
		console.log("house:", this.view.hs_id[this.view.house], this.map_json.length);
		console.log("models:", this.obj_models);
		
        }
		
		if(event.keyCode == 83){
		go_yes = true;
		z = this.view.positionZ - zoom*Math.cos(this.view.phi)*Math.cos(this.view.psi);
		x = this.view.positionX - zoom*Math.sin(this.view.phi)*Math.cos(this.view.psi);
		y = this.view.positionY - zoom*Math.sin(this.view.psi);
		for(var hs = 0; hs < this.map_json.length; hs++)
		{
			d12 = (z-this.map_json[hs]['z1'])*(this.map_json[hs]['x2']-this.map_json[hs]['x1'])-(x-this.map_json[hs]['x1'])*(this.map_json[hs]['z2']-this.map_json[hs]['z1']);
			d23 = (z-this.map_json[hs]['z2'])*(this.map_json[hs]['x3']-this.map_json[hs]['x2'])-(x-this.map_json[hs]['x2'])*(this.map_json[hs]['z3']-this.map_json[hs]['z2']);
			d34 = (z-this.map_json[hs]['z3'])*(this.map_json[hs]['x4']-this.map_json[hs]['x3'])-(x-this.map_json[hs]['x3'])*(this.map_json[hs]['z4']-this.map_json[hs]['z3']);
			d41 = (z-this.map_json[hs]['z4'])*(this.map_json[hs]['x1']-this.map_json[hs]['x4'])-(x-this.map_json[hs]['x4'])*(this.map_json[hs]['z1']-this.map_json[hs]['z4']);
			go_yes = go_yes && (((d12>2)||(d23>2)||(d34>2)||(d41>1)||(y>this.map_json[hs]['H'] + 2)) && (this.view.positionY > 1));
			//if(!((d12>2)||(d23>2)||(d34>2)||(d41>1)||(y>this.map_json[hs]['H'] + 2))){this.view.house = hs;}
			
		}
		if(go_yes)
		{
			this.view.positionZ = z;
			this.view.positionX = x;
			this.view.positionY = y;
		}
		
		this.view.direct_x +=  zoom*Math.sin(this.view.phi)*Math.cos(this.view.psi);
		this.view.direct_y +=  zoom*Math.sin(this.view.psi);
		this.view.direct_z +=  zoom*Math.cos(this.view.phi)*Math.cos(this.view.psi);
        }
		
		
		if(event.keyCode == 87){
		go_yes = true;
		z = this.view.positionZ + zoom*Math.cos(this.view.phi)*Math.cos(this.view.psi);
		x = this.view.positionX + zoom*Math.sin(this.view.phi)*Math.cos(this.view.psi);
		y = this.view.positionY + zoom*Math.sin(this.view.psi);
		for(var hs = 0; hs < this.map_json.length; hs++)
		{
			d12 = (z-this.map_json[hs]['z1'])*(this.map_json[hs]['x2']-this.map_json[hs]['x1'])-(x-this.map_json[hs]['x1'])*(this.map_json[hs]['z2']-this.map_json[hs]['z1']);
			d23 = (z-this.map_json[hs]['z2'])*(this.map_json[hs]['x3']-this.map_json[hs]['x2'])-(x-this.map_json[hs]['x2'])*(this.map_json[hs]['z3']-this.map_json[hs]['z2']);
			d34 = (z-this.map_json[hs]['z3'])*(this.map_json[hs]['x4']-this.map_json[hs]['x3'])-(x-this.map_json[hs]['x3'])*(this.map_json[hs]['z4']-this.map_json[hs]['z3']);
			d41 = (z-this.map_json[hs]['z4'])*(this.map_json[hs]['x1']-this.map_json[hs]['x4'])-(x-this.map_json[hs]['x4'])*(this.map_json[hs]['z1']-this.map_json[hs]['z4']);
			go_yes = go_yes && (((d12>2)||(d23>2)||(d34>2)||(d41>1)||(y>this.map_json[hs]['H'] + 2)) && (this.view.positionY > 1));
			if(!((d12>2)||(d23>2)||(d34>2)||(d41>1)||(y>this.map_json[hs]['H'] + 2))){this.view.house = hs;}// определяем номер здания, 
			                                                                                                // которое оказалось на пути камеры
		}
		if(go_yes)
		{
			this.view.positionZ = z;
			this.view.positionX = x;
			this.view.positionY = y;
		}
		else{
			document.getElementById(this.view.hs_id[this.view.house]).style.display="block";
		}
		this.view.direct_x +=  zoom*Math.sin(this.view.phi)*Math.cos(this.view.psi);
		this.view.direct_y +=  zoom*Math.sin(this.view.psi);
		this.view.direct_z +=  zoom*Math.cos(this.view.phi)*Math.cos(this.view.psi);
        }
		if(event.keyCode == 189 && this.view.positionY > 1){
		
		this.view.positionY -= shag_up;
		this.view.direct_y  -= shag_up;		
        }
		if(event.keyCode == 187){
		
		this.view.direct_y  += shag_up;
		this.view.positionY += shag_up; 
        
		}
		
		
		
		if(event.keyCode == 32){//space
		
		document.getElementById(this.view.hs_id[this.view.house]).style.display="block";
		
		}
		if(event.keyCode == 27){//esc
		document.getElementById(this.view.hs_id[this.view.house]).style.display="none";
		
		}
		
		if(event.keyCode == 13){//enter
		
		this.view.start = true;
		console.log('enter', this.view.start);
		
		}
		
		
		if(event.keyCode == 38){//up
			
			
			this.view.ds = 0.01;
			this.view.go_yes = true
			for(var s = 0; s < this.path.length - 1; s++){
				for(var t = 0; t < 1; t = t + this.view.ds)
				{
					xx = this.path[s][0] + t*(this.path[s+1][0] - this.path[s][0]);
					zz = this.path[s][1] + t*(this.path[s+1][1] - this.path[s][1]);
					this.full_path.push([xx,zz]);
				}
				
			}
			this.view.k = 0;
		}
		
    }		

handleMouseMove(event){

var event = event || window.event;
  //var ypos=event.clientY;
  //var xpos=event.clientX;
  this.view.phi=-4*Math.PI*event.clientX/window.innerWidth;
  this.view.psi=Math.PI/2-Math.PI*event.clientY/window.innerHeight;
  if(this.view.start)
  {
  this.view.direct_x = this.view.positionX + Math.sin(this.view.phi)*Math.cos(this.view.psi);
  this.view.direct_y = this.view.positionY + Math.sin(this.view.psi);
  this.view.direct_z = this.view.positionZ + Math.cos(this.view.phi)*Math.cos(this.view.psi);
  } 
}

handleMouseWheel(event){
	var shag_up = 0.3;
	var delta = event.deltaY;
	
	//console.log("wheel:", delta);
	if(delta > 0)
	{
		this.view.direct_y  += shag_up;
		this.view.positionY += shag_up;
	}
	if(delta < 0 && this.view.positionY > 1)
	{
		this.view.direct_y  -= shag_up;
		this.view.positionY -= shag_up;
	}
}

go_this_path(){
	this.view.k += 1;
	if( this.view.k < this.full_path.length){
		this.view.positionX = this.full_path[this.view.k][0];
		this.view.positionZ = this.full_path[this.view.k][1];		
	}
	else{
		this.view.go_yes = false;
		this.full_path = [];
	}
	
}

start_show(){
	this.view.start = true;
	document.getElementById("start").style.display="none";
	
	
}
	
}


