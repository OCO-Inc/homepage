//definitions
const rollList = [];
let chart;

function loop() { // updates display and graph every frame @ 60fps
  display();
  window.requestAnimationFrame(loop);
}

function display() { // update the labels of each slider
  document.getElementById('sidesout').innerText = document.getElementById("sides").value;
  document.getElementById('countout').innerText = document.getElementById("count").value;
  document.getElementById('timesout').innerText = document.getElementById("times").value;
}

// simple random function, returns between min and max inclusive
function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function roll() { // actually roll the dice. called when the "roll" button is clicked
  rollList.length = 0 // ensure the list of dice rolls already completed is 0
  for (let i = 0; i < document.getElementById("times").value; i++) { // repeat the folowing (number of dice * times to roll) times
    rollList.push(random(1, (document.getElementById("sides").value * document.getElementById("count").value))) // roll once for each time it is told and add it to the list of rolls
  }
  if (document.getElementById('sides').value = 2) {
    const rollList = rollList.map(num => (num === 1 ? 'H' : 'T'));
  render();
}

function countOccurrences(arr) { //Function to generate the data we need for the graph
  const countMap = {};

  // Count occurrences of each number
  arr.forEach(num => {
    countMap[num] = (countMap[num] || 0) + 1;
  });

  // Determine the range of numbers (from min to max)
  const max = Math.max(...arr);

  // Create an array of counts for each number from min to max
  const result = [];
  for (let i = 1; i <= max; i++) {
    result.push(countMap[i] || 0); // If the number isn't present, add 0
  }

  return result;
}

function render() { //generate information and show our graph
  if (document.getElementById("sides") != 2) {
    var xValues = Array.from({ length: document.getElementById("sides").value }, (_, i) => (i + 1).toString()); // some really weird logic that generates the X axis labels for our chart
  } else {
    var xValues = ["H", "T"] // for coins
  }
  let yValues = countOccurrences(rollList); // use the function we made earlier to generate our data
  if (chart) { chart.destroy(); } //to prevent the old graph from glitching through weirdly
  chart = new Chart("graph", {
    type: "bar",
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: '#00FFFF',
        data: yValues
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,  // Ensures Y-axis starts at 0
          min: 0, // Explicitly force minimum to be 0
          ticks: {
            callback: function(value) {
              return value; // Adjust if you want custom tick behavior
            }
          }
        }
      },
      legend: {display: false}
    }
  });
}

loop(); //start here
