//definitions
var rollList = [];
var chart;
var xValues;
var yValues;

function loop() { // updates display and graph every frame @ 60fps
  display();
  window.requestAnimationFrame(loop);
}

function display() { // update the labels of each slider
  document.getElementById('sidesout').innerText = document.getElementById("sides").value;
  document.getElementById('countout').innerText = document.getElementById("count").value;
  document.getElementById('timesout').innerText = document.getElementById("times").value;
  if (document.getElementById('sides').value == 2) {
    document.getElementById('count').value = 1; // If this had a higher count it would screw over our later code as heads cannot be added to heads to create ULTRA HEADS
  }
}

// simple random function, returns between min and max inclusive
function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rollDice() { // actually roll the dice. called when the "roll" button is clicked
  rollList.length = 0 // ensure the list of dice rolls already completed is 0
  for (let i = 0; i < document.getElementById("times").value; i++) { // repeat the folowing (number of dice * times to roll) times
    rollList.push(random(1, (document.getElementById("sides").value * document.getElementById("count").value))) // roll once for each time it is told and add it to the list of rolls
  }
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
    result.push(countMap[i] || 0); // If the number isn't present, add 0 in its place
  }

  return result;
}

function render() { //generate information and show our graph
  if (document.getElementById("sides").value == 2) {
    xValues = ['H', 'T']; // for coins
  } else {
    xValues = Array.from({ length: document.getElementById("sides").value }, (_, i) => (i + 1).toString()); // some really weird logic that generates the X axis labels for our chart
  }
  let yValues = countOccurrences(rollList); // use the function we made earlier to generate our data
  if (chart) { chart.destroy(); } //to prevent the old graph from glitching through weirdly
  console.log(xValues)
  console.log(yValues)
  console.log(rollList)
  console.log(sortList)
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
          beginAtZero: true,
            ticks: {
              callback: function(value) {
                // make sure it only shows integers on the Y axis label
                return Number.isInteger(value) ? value : '';
                }
              }
          }
      },
      plugins: {
          legend: { display: false }
      },
    }
  });

}

loop(); //start here
