export class Map{

	constructor(id_element,objects){
		this.id_element = id_element
		this.objects = objects
		}
		
	distance(p,q){
		return Math.sqrt((p[0] - q[0])*(p[0] - q[0]) + (p[1] - q[1])*(p[1] - q[1]))
		}
		
	nearest(p){
		let inear = 0
		let dist = this.distance(p,this.objects[0].center)
		
		for(let i = 1; i < this.objects.length; i++){
			let d = this.distance(p,this.objects[i].center)
			if(d < dist){
				inear = i
				dist = d
				}
			
			}
		return [inear,dist]
		}

	find_object(p,min_dist){
		let nrst = this.nearest(p)
		let res = {found:false,index:-1}
		if(nrst[1] < min_dist){
			res.found = true
			res.index = nrst[0]
		}
		return res
}
}


