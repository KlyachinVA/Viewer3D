import { show, hide} from '/static/js/utils/windows.js'

export function loadGlTfModel( loader,dracoLoader, scene,data ,i,N,element,id_element) {
				let paths = data.path.split('/')
				let path = "/" + paths.slice(0,-1).join("/") + "/"
				let fname = paths[paths.length - 1]
				loader.setDRACOLoader( dracoLoader );
				loader.setPath( path);
				loader.load( fname, function ( gltf ) {
					gltf.scene.traverse( function ( child ) {

						if ( child.isMesh ) {

							child.castShadow = true;
							child.position.set(data.position[0],data.position[1],data.position[2])
							child.rotation.set(data.rotation[0],data.rotation[1],data.rotation[2])
					        child.scale.set(data.scale[0],data.scale[1],data.scale[2])
					}
					
					} )
					scene.add( gltf.scene );
					if(i == N-1){
				
					hide(id_element)
					element.style.display="block"
				}
				})

	
}
