let canvas;
let context;
let canvas2;
let context2;
let isDrawing=false;
let r = Math.floor( 255) ;
let g = Math.floor(0) ;
let b = Math.floor( 0) ;
let X=[];
let Y=[];
let AX=new Array();
let AY=new Array();

let x0=0;
let y0=0;
let X0;
let Y0;
let scale_dx = 30
let scale_dy = 30
let curpolygon=0;
AX[0]=new Array();
AY[0]=new Array();
let W=2000;
let H=1400;
let L0= 44;
let A0= 47;
let m=30;
let lam=0.000004;
let coords='';
let geocor=[];
let img
let previousColorElement;
let data = []
let curModelIndex = 0
let previousThicknessElement;
let drawn = false

window.onload = function() {
      canvas = document.getElementById("drawingCanvas");
      context = canvas.getContext("2d");
       canvas2=document.getElementById("smallmap");
	   context2=canvas2.getContext("2d");
      // Подключаем требуемые для рисования события
      canvas.onmousedown = startDrawing;

	  img=document.getElementById("map");
	  console.log("size=",img.width,img.height);
	  W=img.width;
	  H=img.height;
	  context.drawImage(img,x0,y0,W,H);//,canvas.width,canvas.height);
	  context2.drawImage(img,x0,y0,canvas2.width,canvas2.height);
	  X0=canvas.offsetLeft;
	  Y0=canvas.offsetTop;
	  changeColor(212,21,29, document.getElementById("redPen"));

	  for(let i in geocor){
		let strcor=geocor[i].split(":");
		strcor.length-=1;

		for(let k in strcor){
			let xy=strcor[k].split(",");

				let x=xy[0];
				let y=xy[1];
				let xx=(x-L0)/m;
				let yy=(y-A0)/m;
				AX[curpolygon].push(parseInt(xx));
				AY[curpolygon].push(-1*parseInt(yy));
			}
		curpolygon+=1;
		AX[curpolygon]=new Array();
		AY[curpolygon]=new Array();
	  }
	  redraw();
	  set_keyboard_handlers()
	  init_data()
   }

function init_data(){
    let el = document.getElementById("model3d")
    let opts = el.options
    let num_opts = opts.length

    for(let i = 0; i < num_opts; i++ ){
        let model_data = {
            id : opts[i].value,
            name : opts[i].text,
            color : "red",
            drawn : false,
            coords : []
        }
        data.push(model_data)
    }
    console.log(data)
    el.addEventListener('change',event => {
        let ind = el.selectedIndex

        curModelIndex = ind
        console.log(curModelIndex)

    })
}

function set_keyboard_handlers(){
      document.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown') {
            moveIm(0,-1)
        }
        if (e.key === 'ArrowUp') {
            moveIm(0,1)
        }
        if (e.key === 'ArrowLeft') {
            moveIm(1,0)
        }
        if (e.key === 'ArrowRight') {
            moveIm(-1,0)
        }
});
}

function changeColor(rr,gg,bb, imgElement)
{
    r=rr;
	g=gg;
	b=bb;
    // 	Меняем текущий цвет рисования
	context.strokeStyle = "rgb("+rr+","+gg+","+bb+")";

	// Меняем стиль элемента <img>, по которому щелкнули
	imgElement.className = "Selected";

	// Возвращаем ранее выбранный элемент <img> в нормальное состояние
	if (previousColorElement != null)
	   previousColorElement.className = "";

	previousColorElement = imgElement;
}

function changeThickness (thickness, imgElement)
{
    // Изменяем текущую толщину линии
	context.lineWidth = thickness;

	// Меняем стиль элемента <img>, по которому щелкнули
	imgElement.className = "Selected";

	// Возвращаем ранее выбранный элемент <img> в нормальное состояние
	if (previousThicknessElement != null)
	   previousThicknessElement.className = "";

	previousThicknessElement = imgElement;
}


function closed(){

    let s = 'rgba(' + r + ',' + g + ',' + b + ', 0.3)';
    context.beginPath();

	context.moveTo(AX[curpolygon][0] +x0, AY[curpolygon][0] +y0);

	for(let i in AX[curpolygon]){
	    context.lineTo(AX[curpolygon][i]+ x0,AY[curpolygon][i]+y0);
	}
	context.closePath();
	context.fillStyle = s;
	context.fill();
	context.stroke();


	//console.log(AX[curpolygon]);
	let cor='';
	for(let i in AX[curpolygon]){
	    let x=AX[curpolygon][i]*m;
	    let y=AY[curpolygon][i]*m;
	    let L=L0+x;
	    let A=A0-y;
	    //console.log(x);
	    cor+=(L+","+A+":");

	}
	data[curModelIndex]["drawn"] = true
	coords+=" "+cor;
	let f=document.getElementById("coords_form");
	f.coords.value=coords;
	curpolygon+=1;
	AX.push(new Array());
	AY.push(new Array());
	//console.log(coords);
	console.log(data)
}


function test(){
    context.beginPath();
    context.lineTo(200 - canvas.offsetLeft,200 - canvas.offsetTop);
    context.stroke();
    isDrawing=false;
    context.fillRect(X[0] - canvas.offsetLeft,Y[0] - canvas.offsetTop,X[1] - X[0],Y[1] - Y[0]);

}

function startDrawing(e) {
    is_drawn = data[curModelIndex]["drawn"]
    if(is_drawn){
        return false
    }
    let rad = 2
    let s = 'rgba(' + r + ',' + g + ',' + b + ')';
    let x = e.pageX-X0-x0
    let y = e.pageY-Y0-y0
	AX[curpolygon].push(x);
	AY[curpolygon].push(y);
	data[curModelIndex]["coords"].push([x,y])
	context.beginPath();
    context.arc(e.pageX-X0, e.pageY-Y0, rad, 0, 2 * Math.PI);
    context.fillStyle = s;
    context.fill();
    context.closePath();
	//console.log(AX[curpolygon][0]);
}


function clearCanvas() {
	data[curModelIndex]["coords"] = []
	data[curModelIndex]["drawn"] = false
	AX[curModelIndex] = []
	AY[curModelIndex] = []
	redraw()
	//context.clearRect(0, 0, canvas.width, canvas.height);
}


function moveIm(dx,dy){
    x0+=dx*scale_dx;
    y0+=dy*scale_dy;

    clearCanvas();
    //let img=document.getElementById("map");
	context.drawImage(img,x0,y0,W,H);
	redraw();
}

function redraw(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img,x0,y0,W,H);
	let lam=canvas2.width/W;
	let mu=canvas2.height/H;
	let x= -lam*x0;
	let y=-mu*y0;
	let x1=lam*(-x0+canvas.width);
	let y1=mu*(-y0+canvas.height);
	//console.log(x,y,x1,y1,lam,mu)
    let s = 'rgba(' + r + ',' + g + ',' + b + ', 0.3)';
	for (let i in AX){
	    context.beginPath();
	    context.moveTo(AX[i][0]+x0,AY[i][0]+y0);
	    for(let k in AX[i]){
		    context.lineTo(AX[i][k]+x0,AY[i][k]+y0)
	}
	context.closePath();
	context.fillStyle = s;
	context.fill();
	context.stroke();
	}
	context2.clearRect(0, 0, canvas2.width, canvas2.height);
	//let img=document.getElementById("map");
	context2.drawImage(img,0,0, canvas2.width, canvas2.height);
    context2.beginPath();
	context2.moveTo(x,y);
	context2.lineTo(x1,y);
	context2.lineTo(x1,y1);
	context2.lineTo(x,y1);
	context2.closePath();
	context2.fillStyle = s;
	context2.fill();
	context2.stroke();

	draw_marks();


}

function draw_marks(){
	let lam=canvas2.width/W;
	let mu=canvas2.height/H;
	//console.log(lam,mu)
	let s = 'rgba(' + r + ',' + g + ',' + b + ', 0.7)';
    for(var i in AX){
	    context2.beginPath();
	    //context2.moveTo(AX[i][0]*lam,AY[i][0]*mu);
	    //for(var k in AX[i]){
	    //	context.lineTo(AX[i][k]*lam,AY[i][k]*mu)
	    //}
	    //context2.closePath();

	    context2.fillStyle = s;
	    context2.fillRect(AX[i][0]*lam,AY[i][0]*mu,5,5);

    }

}
