let Map = require("./map.js")

let objects = [{center:[0,0]},
					  {center:[1,0]},
					  {center:[1,1]},
					  {center:[0,1]},
					  {center:[0.5,0.5]}]
let map = new Map("map3d",objects)

let p = [0.9,0.9]

let nrst = map.nearest(p)

console.log(nrst)

let ob = map.find_object(p,0.15)
console.log(ob)
