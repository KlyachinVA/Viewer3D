
	
export function handleKeyDown(event) {                             // клавиша нажата
        var phi = 1;
		var zoom = 0.5;
		var ugol = 0.04;
		var shag_up = 0.3;
		
		if(event.keyCode == 37){
		view.phi_y += ugol;
        }
		
		if(event.keyCode == 39){
		view.phi_y -= ugol;
        }
		/*
		if(event.keyCode == 38){
		view.phi_x -= ugol;
        }
		
		if(event.keyCode == 40){
		view.phi_x += ugol;
        }
		*/
		if(event.keyCode == 38){
		
		view.positionZ -= zoom*Math.cos(view.phi_y)*Math.cos(view.phi_x);
		view.positionX -= zoom*Math.sin(view.phi_y)*Math.cos(view.phi_x);
		view.positionY -= zoom*Math.sin(view.phi_x);
        }
		if(event.keyCode == 40){
		
		view.positionZ += zoom*Math.cos(view.phi_y)*Math.cos(view.phi_x);
		view.positionX += zoom*Math.sin(view.phi_y)*Math.cos(view.phi_x);
		view.positionY += zoom*Math.sin(view.phi_x);
        }
		
		if(event.keyCode == 189){
		
		//view.positionZ -= zoom*Math.cos(view.phi_y)*Math.cos(view.phi_x);
		//view.positionX -= zoom*Math.sin(view.phi_y)*Math.cos(view.phi_x);
		view.positionY -= shag_up; //zoom*Math.sin(view.phi_x);
        }
		if(event.keyCode == 187){
		
		//view.positionZ += zoom*Math.cos(view.phi_y)*Math.cos(view.phi_x);
		//view.positionX += zoom*Math.sin(view.phi_y)*Math.cos(view.phi_x);
		view.positionY += shag_up; //zoom*Math.sin(view.phi_x);
        }
    
    }

document.onkeydown=function(event){handleKeyDown(event);};




