function width() {
  if (window.innerWidth < window.innerHeight) {
    document.getElementById("slidecontainer").style.width = window.innerWidth;
    document.getElementById("slidecontainer").style.height = window.innerHeight/8;
  } else {
    document.getElementById("slidecontainer").style.width = window.innerWidth;
    document.getElementById("slidecontainer").style.height = window.innerHeight/8;
  }
}

function loop() {
  width();
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

width();
loop();

function render() {
  document.getElementById("test").style.visibility = "visible";
}

