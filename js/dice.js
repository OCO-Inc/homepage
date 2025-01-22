if (window.innerWidth < window.innerHeight) {
  document.getElementById("sides").style.width = window.innerWidth;
  document.getElementById("count").style.width = window.innerWidth;
  document.getElementById("sides").style.height = window.innerHeight/8;
  document.getElementById("count").style.height = window.innerHeight/8;
} else {
  document.getElementById("sides").style.width = window.innerWidth/3;
  document.getElementById("count").style.width = window.innerWidth/3;
  document.getElementById("sides").style.height = window.innerHeight/8;
  document.getElementById("count").style.height = window.innerHeight/8;
}
  
var sides = new Slider("slider", {
			orientation: "horizontal",
			autoReturnToCenter: true,
			minimum: 0,
			maximum: 20,
			initial: 6
		});
    
var count = new Slider("slider", {
			orientation: "horizontal",
			autoReturnToCenter: true,
			minimum: 0,
			maximum: 20,
			initial: 6
		});

var sides = sides.getValue();
var count = count.getValue();

sides.on("change", (e)=>{
    render()
});

count.on("change", (e)=>{
    render()
});

function Render() {
  document.getElementById("test").style.visibility = "visible";
}