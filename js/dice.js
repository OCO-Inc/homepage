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
  render();
}

function countOccurrences(arr) { //Function to generate the data we need for the graph
  const countMap = {};

  // Count occurrences of each number
  arr.forEach(num => {
    countMap[num] = (countMap[num] || 0) + 1;
  });

  // Determine the range of numbers (from min to max)
  const min = Math.min(...arr);
  const max = Math.max(...arr);

  // Create an array of counts for each number from min to max
  const result = [];
  for (let i = min; i <= max; i++) {
    result.push(countMap[i] || 0); // If the number isn't present, add 0
  }

  return result;
}

function render() { //generate information and show our graph
  var xValues = Array.from({ length: document.getElementById("sides").value }, (_, i) => (i + 1).toString()); // some really weird logic that generates the X axis labels for our chart
  let yValues = countOccurrences(rollList); // use the function we made earlier to generate our data
  const chart = null //to prevent the old graph from glitching weirdly
  const chart = new Chart("graph", { // Create the chart (this is defined in a library included in the HTML)
    type: "bar",
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: '#00FFFF',
        data: yValues
      }]
    },
    options: {
      legend: {display: false},
      title: {
        display: true,
        text: "Graph of Resulting Rolls"
      }
    }
  });
  document.getElementById("rolls").innerText = rollList
  document.getElementById("sorted").innerText = yValues
}

loop(); //start here
