function loop() {
  display();
  window.requestAnimationFrame(loop);
}

function display() {
  document.getElementById('sidesout').innerText = document.getElementById("sides").value;
  document.getElementById('countout').innerText = document.getElementById("count").value;
  document.getElementById('timesout').innerText = document.getElementById("times").value;
}

loop();
