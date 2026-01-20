import { show, hide} from '/static/js/utils/windows.js'

export function loadObjModel( mtlloader,objloader, scene,data ,i,N,element,id_element) {
				console.log(data.mtlpath)
				mtlloader.load(data.mtlpath, (mtl) => {
						mtl.preload();
						objloader.setMaterials(mtl);
						objloader.load(data.path, (object) => {
		  
							object.traverse( function ( child ) {

								if ( child.isMesh ) {

									child.castShadow = true;
									//child.receiveShadow = true;

								}

							} );
							
					object.position.set(data.position[0],data.position[1],data.position[2])
					object.rotation.set(data.rotation[0],data.rotation[1],data.rotation[2])
					object.scale.set(data.scale[0],data.scale[1],data.scale[2])
					scene.add( object );
					if(i == N-1){
					/*
					let load_gif = document.getElementById(id_element)
					load_gif.style.display="none"
					*/
					/*hide(id_element)
					element.style.display="block"
					
					
					
					let info_element = document.getElementById("info")
					show("info")
					info_element.style.top = 100 + "px"
					info_element.style.left= 200 + "px"*/
					
				}

				} );
				
				
			})
			
		}
