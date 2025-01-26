//definitions
const rollList = [];

function loop() { // updates display and graph every frame @ 60fps
  display();
  window.requestAnimationFrame(loop);
}

function display() { // update the labels of each slider
  document.getElementById('sidesout').innerText = document.getElementById("sides").value;
  document.getElementById('countout').innerText = document.getElementById("count").value;
  document.getElementById('timesout').innerText = document.getElementById("times").value;
}

function random (min, max) { // simple random function, returns between min and max inclusive
  return Math.round(Math.random() * (max - min) + min);
}

function roll() { // actually roll the dice. called when the "roll" button is clicked
  rollList.length = 0 // ensure the list of dice rolls already completed is 0
  for (let i = 0; i < (document.getElementById("times").value * document.getElementById("count").value); i++) { // repeat the folowing (number of dice * times to roll) times
    rollList.push(random(1, document.getElementById("sides").value)) // roll once for each time it is told and add it to the list of rolls
  }
  document.getElementById("rolls").innerText = rollList
}

loop(); //start here
