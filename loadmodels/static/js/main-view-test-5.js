import * as THREE from 'three';
import { loadObjModel } from '/static/js/utils/objloader.js'
import { show, hide} from '/static/js/utils/windows.js'
import { ViewPort} from '/static/js/utils/viewport.js'
import { loadModel } from '/static/js/utils/fbxloader.js'
import { Map} from '/static/js/utils/map.js'

let data = {color:"#ffffff",z_distance:170,ambient_light:false,fov:25}
let id_viewport = "viewport"

let vp = new ViewPort(id_viewport,data,fname_json)

function run(){
	
	show_start('start');
	

	vp.init(vp.obj_models,{color:"#ffffff",z_distance:70,ambient_light:false,fov:25})
	
	document.onkeydown=function(event){vp.handleKeyDown(event);};
	let wprt = document.getElementById(id_viewport)
	wprt.onmousemove=function(event){vp.handleMouseMove(event);};
	wprt.onmousedown=function(event){vp.handleMouseDown(event);};
	wprt.onmouseup=function(event){vp.handleMouseUp(event);};
	wprt.addEventListener('wheel', function(event){vp.handleMouseWheel(event);});
	
	let strt = document.getElementById("btn_start");
	
	strt.onclick=function(){
		vp.start_show();
		};
	console.log('obj_models-new:', vp.obj_models);
	vp.renderer.setAnimationLoop( vp.animate );	
	}

function check_btn(){
	console.log('enter button:', 12);
	
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

