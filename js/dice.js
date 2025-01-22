  function width() {
  if (window.innerWidth < window.innerHeight) {
    document.getElementById("slidecontainer").style.width = window.innerWidth;
    document.getElementById("slidecontainer").style.height = window.innerHeight/8;
  } else {
    document.getElementById("slidecontainer").style.width = window.innerWidth;
    document.getElementById("slidecontainer").style.height = window.innerHeight/8;
  }
}

var sides = document.getElementById("sides");
var count = document.getElementById("count");
var coutput = document.getElementById("cvalue");
var soutput = document.getElementById("svalue");

coutput.oninput = function() {
  coutput.innerHTML = this.value;
}
soutput.oninput = function() {
  soutput.innerHTML = this.value;
}

width();
  
function render() {
  width();
  document.getElementById("test").style.visibility = "visible";
}