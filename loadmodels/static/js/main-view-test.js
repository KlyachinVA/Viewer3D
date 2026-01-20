import * as THREE from 'three';
import { loadObjModel } from '/static/js/utils/objloader.js'
import { show, hide} from '/static/js/utils/windows.js'
import { ViewPort} from '/static/js/utils/viewport.js'

//import { Map} from '/static/js/utils/map.js'
let objmodels = [
							{path:'/static/models/buildings/Bani.obj',
							mtlpath:'/static/models/buildings/Bani.mtl',
							scale:[0.7,0.7,0.7],
							position:[8,0,0],
							rotation:[0,3.14,0]
							}
							]
let data = {color:"#ffffff",z_distance:70,ambient_light:false,fov:25}
let id_viewport = "viewport"
let renderer = new THREE.WebGLRenderer({antialias:true});
let element = document.getElementById(id_viewport)
let computedStyle = getComputedStyle(element)
let width = computedStyle.width.slice(0,-2)
let height = computedStyle.height.slice(0,-2)
renderer.setSize(width,height );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
let vp = new ViewPort(id_viewport,data,renderer)
renderer.setAnimationLoop( animate );
element.appendChild( renderer.domElement );


let objmodels2 = [
							{
							path:'/static/models/buildings/hotel.obj',
							mtlpath:'/static/models/buildings/hotel.mtl',	
							scale:[3.5,3.5,3.5],
							position:[-4,0,0],
							rotation:[0,3.14,0]
							},
							]
let data2 = {color:"#ffffff",z_distance:70,ambient_light:false,fov:25}
let id_viewport2 = "viewport2"
let renderer2 = new THREE.WebGLRenderer({antialias:true});
let element2 = document.getElementById(id_viewport2)
let computedStyle2 = getComputedStyle(element2)
let width2 = computedStyle2.width.slice(0,-2)
let height2= computedStyle2.height.slice(0,-2)
renderer2.setSize(width2,height2 );
renderer2.shadowMap.enabled = true;
renderer2.shadowMap.type = THREE.PCFSoftShadowMap;

let vp2= new ViewPort(id_viewport2,data2,renderer2)
renderer2.setAnimationLoop( animate2 );
element2.appendChild( renderer2.domElement );
function run(){
	
	
	let objmodels = [
							{path:'/static/models/buildings/Bani.obj',
							mtlpath:'/static/models/buildings/Bani.mtl',
							scale:[0.7,0.7,0.7],
							position:[8,0,0],
							rotation:[0,3.14,0]
							}
							]
	vp.init(objmodels,{color:"#ffffff",z_distance:70,ambient_light:false,fov:25})
	
	
	}

function run2(){
	let objmodels = [
							{
							path:'/static/models/buildings/hotel.obj',
							mtlpath:'/static/models/buildings/hotel.mtl',	
							scale:[3.5,3.5,3.5],
							position:[-4,0,0],
							rotation:[0,3.14,0]
							},
							]
	vp2.init(objmodels,{color:"#ffffff",z_distance:70,ambient_light:false,fov:25})
	
	
	}

function animate(){
	
	renderer.render(vp.scene,vp.camera)
	}
	
function animate2(){
	renderer2.render(vp2.scene,vp2.camera)
	}
	
function exec(){
	let btn = document.getElementById("run")
	btn.onclick=run
	
	let btn2 = document.getElementById("run2")
	btn2.onclick=run2
	}
exec()

//main()
//run()
