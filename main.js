// element selector
// // platform
const platform = document.querySelector("#platform");

const notification = document.querySelector("#notification");
const actions = document.querySelector("#actions");

// // stats element
const moveStats      = document.querySelector("#moves"),
  boxesLeftStats = document.querySelector("#boxes-left"),
  levelStats     = document.querySelector("#level");

// storage cache
const CURRENTSAVE_LOCAL_KEY = "paththern.currentSave";
let currentSave = JSON.parse(localStorage.getItem(CURRENTSAVE_LOCAL_KEY));

if (!currentSave) {
  localStorage.setItem(CURRENTSAVE_LOCAL_KEY, JSON.stringify({
    level: 1,
    moves: 10,
    boxes: [
    {
      "rotation": 0,
      "orientation": "start-left",
      "correctRotation": 0
    },
    {
      "rotation": 0,
      "orientation": "right-top-line",
      "correctRotation": 1
    },
    {
      "rotation": 0,
      "orientation": "none-line",
      "correctRotation": 0
    },
    {
      "rotation": 0,
      "orientation": "finish-bottom",
      "correctRotation": 0
    }
      ]
  }));
}

// initial move given in this game
let moves = 10;

// init'd boxes
let boxes = [
  {
    "rotation": 0,
    "orientation": "start-top",
    "correctRotation": 0
  },
  {
    "rotation": 0,
    "orientation": "finish-left",
    "correctRotation": 0
  },
  {
    "rotation": 0,
    "orientation": "left-top-line",
    "correctRotation": 0
  },
  {
    "rotation": 0,
    "orientation": "right-top-line",
    "correctRotation": 3
  },
  {
    "rotation": 0,
    "orientation": "horizontal-line",
    "correctRotation": 0
  },
  {
    "rotation": 0,
    "orientation": "right-bottom-line",
    "correctRotation": 3
  }
    ]

const game = {
  level: 1,
  dimension: {
    x: 2,
    y: 2
  },
  boxes: boxes
}

// render load the boxes into platform
function renderBoxes(boxes) {
  platform.innerHTML = "";

  boxes.forEach(box => {
    platform.innerHTML += `<div class="box ${box.orientation}" onclick="rotate(this);">
                             <div></div>
                             <div></div>
                           </div>`;
  });
}

// function to rotate the box
function rotate(element) {
  const index = Array.prototype.indexOf.call(platform.children, element);
  const boxToBeRotated = boxes[index];

  if (boxToBeRotated.orientation !== "none-line" &&
      boxToBeRotated.orientation.includes("start") === false &&
      boxToBeRotated.orientation.includes("finish") === false) {
    boxToBeRotated.rotation++;

    moves--;
    updateStats();

    element.style.transform = `rotate(${boxToBeRotated.rotation * 90}deg)`;
  }
  console.log(game.boxes);
  console.log(boxes);
}

// update game stats
function updateStats() {
  const boxesNeedToSolved = boxes.filter(box => {
    if (box.orientation !== "none-line") {
      if (box.orientation == "horizontal-line" ||
          box.orientation == "vertical-line"
      ) {
        return box.rotation % 2 !== box.correctRotation;
      } else {
        return box.rotation % 4 !== box.correctRotation;
      }
    }
  });

  if (boxesNeedToSolved.length == 0) {

    notification.textContent = "Level completed!";

    actions.innerHTML = `<button class="action-btn">Next Level</button>
                         <button class="action-btn" onclick="restartGame()">Restart Level</button>
                         <button class="action-btn">Back to Main Menu</button>`;
  }

  levelStats.textContent = game.level;
  boxesLeftStats.textContent = boxesNeedToSolved.length;
  moveStats.textContent = moves;
}

function restartGame() {
  console.log(game);
  moves = currentSave.moves;
  boxes = game.boxes;
  console.log(boxes);
  renderBoxes(boxes);
  
  updateStats();

  notification.textContent = "";
  actions.innerHTML = "";
}

renderBoxes(game.boxes);
updateStats();