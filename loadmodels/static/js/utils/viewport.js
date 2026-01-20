import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { loadModel } from '/static/js/utils/fbxloader.js'
import { loadGlTfModel } from '/static/js/utils/gltfloader.js'
import { loadObjModel } from '/static/js/utils/objloader.js'
import { show, hide} from '/static/js/utils/windows.js'
//import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { FBXLoader } from '/static/js/node_modules/three/examples/jsm/loaders/FBXLoader.js'
export class ViewPort{

	constructor(id_element,data){
		this.scene = null
		this.light
		this.ambientLight
		this.camera
		this.renderer 
		this.controls
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
		this.camera.position.z = data.z_distance;
		
		
		
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
		
				this.renderer.render(this.scene,this.camera)
			}
		
			//this.renderer.setAnimationLoop( this.animate );

			
			this.element.appendChild( this.renderer.domElement );
			this.controls = new OrbitControls(this.camera, this.renderer.domElement)
		
			const planeGeometry = new THREE.PlaneGeometry( 120, 120, 32, 32 );
			const planeMaterial = new THREE.MeshStandardMaterial( { color: 0x00ff00 } )
			const plane = new THREE.Mesh( planeGeometry, planeMaterial );
			plane.receiveShadow = true;
			plane.rotation.set(-3.14/2,0,0)
			
			this.scene.add( plane );
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
	load_3dobjmodels(mtlloader,objloader,scene,models,element,id_element){
	
		let N = models.length
		console.log("N=",N)
		for(let i in models){
			let model = models[i]
				console.log("model:",model)
				//loadModel(loader,scene,model,i,N,element,id_element)
				loadObjModel(this.mtlloader,this.objloader,this.scene,model,i,N,this.element,this.id_element)
				//loadGlTfModel(loader,dracoLoader,scene,model,i,N,element,id_element)
		
			}
}
	
	clear(){
		this.scene.clear()
		}
	
		


}
