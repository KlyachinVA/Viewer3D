import * as THREE from 'three';
import { loadObjModel } from '/static/js/utils/objloader.js'
import { show, hide} from '/static/js/utils/windows.js'
import { ViewPort} from '/static/js/utils/viewport.js'
import { loadModel } from '/static/js/utils/fbxloader.js'
import { Map} from '/static/js/utils/map.js'

let data = {color:"#ffffff",z_distance:70,ambient_light:false,fov:25}
let id_viewport = "viewport"
let cur = 0

let vp = new ViewPort(id_viewport,data)


function run(){
	
	
	let objmodels = [[
							{path:'/static/models/buildings/kirha.obj',
							mtlpath:'/static/models/buildings/kirha.mtl',
							scale:[2.7,2.7,2.7],
							position:[8,4,0],
							rotation:[0,3.14,0]
							}
							],
							[
							{
							path:'/static/models/buildings/hotel.obj',
							mtlpath:'/static/models/buildings/hotel.mtl',	
							scale:[3.5,3.5,3.5],
							position:[-4,0,0],
							rotation:[0,3.14,0]
							},
							],
							[
							{
							path:'/static/models/buildings/music.obj',
							mtlpath:'/static/models/buildings/music.mtl',
							scale:[3.5,3.5,3.5],
							position:[-4,4,0],
							rotation:[0,3.14,0]
							},
							]]
	let fbxmodels = [/*{path:'/static/models/buildings/kirha.fbx',
		                     scale:[0.007,0.007,0.007],
		                     position:[0,0,8],
		                     rotation:[0,0,0]
		                     },
						  {path:'/static/models/buildings/music2.fbx',
							scale:[0.04,0.04,0.04],
							position:[-16,0,2],
							rotation:[0,0,0]
							},
							*/
							{path:'/static/models/buildings/lavka.fbx',
							scale:[0.02,0.02,0.02],
							position:[-7,0,-3],
							rotation:[0,0,0]
							},
							{path:'/static/models/buildings/knyag.fbx',
							scale:[0.1,0.1,0.1],
							position:[4,0,-16],
							rotation:[0,3.14/4,0]
							},
							/*{path:'/static/models/buildings/hotel.fbx',
							scale:[0.02,0.02,0.02],
							position:[7,0,-3],
							rotation:[0,3.14,0]
							},
							{path:'/static/models/buildings/theatre.fbx',
							scale:[0.1,0.1,0.1],
							position:[16,3,-3],
							rotation:[0,3.14,0]
							}
							*/

							]
	cur = cur % objmodels.length
	//vp.init(objmodels[cur],{color:"#ffffff",z_distance:70,ambient_light:false,fov:25})
	vp.init(fbxmodels,{color:"#ffffff",z_distance:70,ambient_light:false,fov:25})
	
	vp.renderer.setAnimationLoop( vp.animate );

	
	}


function clr(){
	vp.clear()
	vp.first = true
	cur += 1
	}

function exec(){
	
	
	
	let btn = document.getElementById("run")
	btn.onclick=run
	
	let btn_clr = document.getElementById("clear")
	btn_clr.onclick=clr

	}
exec()

//main()
//run()
