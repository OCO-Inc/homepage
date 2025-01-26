function loop() {
  display();
  window.requestAnimationFrame(loop);
}

function display() {
  sidesout.innerHTML = sides;
  countout.innerHTML = countout;
}

var sides = document.getElementById("sides");
var count = document.getElementById("count");
var countout = document.getElementById("countout");
var sidesout = document.getElementById("sidesout");

function render() {
  document.getElementById("test").style.visibility = "visible";
}

loop();
