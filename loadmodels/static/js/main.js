import * as THREE from 'three';
//let THREE = require('/static/js/node_modules/three/build/three.module.js')
//import { FBXLoader } from '/static/js/node_modules/three/examples/jsm/loaders/FBXLoader.js'
//import { OrbitControls } from '/static/js/node_modules/three/examples/jsm/controls/OrbitControls.js'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { loadModel } from '/static/js/utils/fbxloader.js'
import { loadGlTfModel } from '/static/js/utils/gltfloader.js'
import { loadObjModel } from '/static/js/utils/objloader.js'
import { show, hide} from '/static/js/utils/windows.js'

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
			
let scene
let light
let ambientLight
let camera
let renderer
let controls
let element

const manager = new THREE.LoadingManager();
const loader = new FBXLoader(manager)
const objloader = new OBJLoader()
const mtlloader = new MTLLoader()
const glloader =  new GLTFLoader()
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( 'jsm/libs/draco/gltf/' );
//dracoLoader.setDecoderPath( './node_modules/three/examples/jsm/libs/draco/gltf/')


function init(id_element,models,data){
		element = document.getElementById(id_element)
		let computedStyle = getComputedStyle(element)
		
		let width = computedStyle.width.slice(0,-2)
		let height = computedStyle.height.slice(0,-2)
		scene = new THREE.Scene();
		const color = new THREE.Color( data.color);
		scene.background = color
		
		renderer = new THREE.WebGLRenderer({antialias:true});
		console.log(width, height)
		renderer.setSize(width,height );
		renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        
		light = new THREE.PointLight(0xffffff, 5000,100)
		light.position.set(50, 40, 0.0)
		light.castShadow = true
		scene.add(light)
		light = new THREE.PointLight(0xffffff, 1000)
		light.position.set(-30, 30, 0.0)
		light.castShadow = true
		scene.add(light)
		light = new THREE.PointLight(0xffffff, 1000)
		light.position.set(0, 30, 30.0)
		light.castShadow = true
		scene.add(light)
		light = new THREE.PointLight(0xffffff, 1000)
		light.position.set(0, 30, -30.0)
		light.castShadow = true
		scene.add(light)
		
		
		
		
		light.shadow.mapSize.width = 512; // default
        light.shadow.mapSize.height = 512; // default
        light.shadow.camera.near = 0.5; // default
        light.shadow.camera.far = 1000; 
        light.shadow.radius = 10
        light.shadow.blurSamples = 100
		if(data.ambient_light){
			ambientLight = new THREE.AmbientLight()
			scene.add(ambientLight)
		}
		
		camera = new THREE.PerspectiveCamera( data.fov, window.innerWidth / window.innerHeight, 0.1, 1000 );
		camera.position.z = data.z_distance;

		
		renderer.setAnimationLoop( animate );

		
		element.appendChild( renderer.domElement );
		controls = new OrbitControls(camera, renderer.domElement)
		//controls = new TrackballControls(camera, renderer.domElement)
		//const helper = new THREE.CameraHelper( light.shadow.camera );
		//scene.add( helper );
		/*const sphereGeometry = new THREE.SphereGeometry( 3, 32, 32 );
		const sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
		const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
		sphere.castShadow = true; //default is false
		sphere.receiveShadow = false; //default
		sphere.position.set(0,1,0)
		scene.add( sphere );*/
		const planeGeometry = new THREE.PlaneGeometry( 120, 120, 32, 32 );
		const planeMaterial = new THREE.MeshStandardMaterial( { color: 0x00ff00 } )
		const plane = new THREE.Mesh( planeGeometry, planeMaterial );
		plane.receiveShadow = true;
		plane.rotation.set(-3.14/2,0,0)
		scene.add( plane );
		load_3dmodels(loader,scene,models,element,"loading")
		//load_3dobjmodels(mtlloader,objloader,scene,models,element,"loading")
		//load_3dmodels(glloader,scene,models,element,"loading")
		
	}

function load_models(models){
	//console.log("call")
	let loader = new FBXLoader()
	let N = models.length
	for(let i in models){
		let model = models[i]
		
		//console.log(model.path)
		loader.load(model.path,
		object => {
			object.castShadow = true
			object.receiveShadow = false
			object.scale.set(model.scale[0],model.scale[1],model.scale[2])
			object.position.set(model.position[0],model.position[1],model.position[2])
			object.rotation.set(model.rotation[0],model.rotation[1],model.rotation[2])
			
			scene.add(object)
			if(i == N-1){
				let load_gif = document.getElementById("loading")
				load_gif.style.display="none"
				element.style.display="block"
				}
		}
	)
	
	}
	
}

function load_3dmodels(loader,scene,models,element,id_element){
	
	let N = models.length
	for(let i in models){
		let model = models[i]
			console.log("model:",model)
			//loadModel(loader,scene,model,i,N,element,id_element)
			loadObjModel(mtlloader,objloader,scene,model,i,N,element,id_element)
			//loadGlTfModel(loader,dracoLoader,scene,model,i,N,element,id_element)
		
		}
}

function load_3dobjmodels(mtlloader,objloader,scene,models,element,id_element){
	
	let N = models.length
	for(let i in models){
		let model = models[i]
			console.log("model:",model)
			//loadModel(loader,scene,model,i,N,element,id_element)
			loadObjModel(mtlloader,objloader,scene,model,i,N,element,id_element)
			//loadGlTfModel(loader,dracoLoader,scene,model,i,N,element,id_element)
		
		}
}
	

function handle(id_element,camera){
	let x0 = camera.position.x
	let y0 = camera.position.z
	console.log(x0,y0)
	if(Math.abs(x0) + Math.abs(y0) < 24.0){
		document.getElementById(id_element).style.display="block"
		}
	else{
		document.getElementById(id_element).style.display="none"
		}
	}


let id_info = "info"
function animate() {

	renderer.render( scene, camera );
	handle(id_info,camera)

}


function main(){
	
	
	let models = [{path:'models/cubes/cube1.fbx',
		                     scale:[0.02,0.01,0.01],
		                     position:[0,0,2],
		                     rotation:[0,3.14/4,0]
		                     },
						  {path:'models/cubes/cube2.fbx',
							scale:[0.01,0.01,0.01],
							position:[-4,1,2],
							rotation:[0,0,0]
							},
							{path:'models/cubes/cube3.fbx',
							scale:[0.01,0.01,0.01],
							position:[0,1,-3],
							rotation:[0,0,0]
							},
							{path:'models/cubes/cube3.fbx',
							scale:[0.01,0.01,0.01],
							position:[4,1,-3],
							rotation:[0,0,0]
							},
							{path:'models/cubes/cube4.fbx',
							scale:[0.01,0.01,0.01],
							position:[7,1,-3],
							rotation:[0,0,0]
							}
							]
	init("viewport",models)
	
	}

function run(){
	
	let id_viewport = "viewport"
	let models = [/*{path:'/static/models/buildings/kirha.fbx',
		                     scale:[0.01,0.01,0.01],
		                     position:[0,0,16],
		                     rotation:[0,0,0]
		                     },
						  {path:'/static/models/buildings/rodina.fbx',
							scale:[0.04,0.04,0.04],
							position:[-16,0,2],
							rotation:[0,0,0]
							},
							{path:'/static/models/buildings/lavka.fbx',
							scale:[0.04,0.04,0.04],
							position:[-12,0,-7],
							rotation:[0,0,0]
							},
							{path:'/static/models/buildings/knyag.fbx',
							scale:[0.25,0.25,0.25],
							position:[4,0,-46],
							rotation:[0,3.14/4,0]
							},*/
							{path:'/static/models/buildings/voronin.fbx',
							scale:[0.1,0.1,0.1],
							position:[0,9,0],
							rotation:[0,3.14,0]
							}/*,
							{path:'/static/models/buildings/hotel_moskva.fbx',
							scale:[0.1,0.1,0.1],
							position:[6,0,-3],
							rotation:[0,3.14,0]
							}/*,
							{path:'/static/models/buildings/add-texture.fbx',
							scale:[0.05,0.05,0.05],
							position:[36,6,-3],
							rotation:[0,3.14,0]
							}*/
							
							]
							
	let glmodels = [
							{path:'/127.0.0.1:8083/static/models/buildings/hotel.glb',
							scale:[0.05,0.05,0.05],
							position:[36,6,-3],
							rotation:[0,3.14,0]
							}
							]
	let objmodels = [
							{
							path:'/static/models/buildings/hotel.obj',
							mtlpath:'/static/models/buildings/hotel.mtl',	
							scale:[3.5,3.5,3.5],
							position:[-4,0,0],
							rotation:[0,3.14,0]
							},
							{path:'/static/models/buildings/Bani.obj',
							mtlpath:'/static/models/buildings/Bani.mtl',
							scale:[0.7,0.7,0.7],
							position:[8,0,0],
							rotation:[0,3.14,0]
							}
							]
	init(id_viewport,models,{color:"#ffffff",z_distance:70,ambient_light:false,fov:25})
	
	
	}
	


//main()
run()
