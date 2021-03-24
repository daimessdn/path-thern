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

const gameLevels = getGameLevels();
console.log(gameLevels);

if (!currentSave) {
  localStorage.setItem(CURRENTSAVE_LOCAL_KEY, JSON.stringify({
    level: 1,
    moves: 5,
    dimension: {
      x: 2,
      y: 2
    },
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
let currentGame = JSON.parse(localStorage.getItem(CURRENTSAVE_LOCAL_KEY));


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
  const boxToBeRotated = currentGame.boxes[index];

  if (boxToBeRotated.orientation !== "none-line" &&
      boxToBeRotated.orientation.includes("start") === false &&
      boxToBeRotated.orientation.includes("finish") === false) {
    boxToBeRotated.rotation++;

    currentGame.moves--;
    updateStats();

    element.style.transform = `rotate(${boxToBeRotated.rotation * 90}deg)`;
  }
}

// update game stats
function updateStats() {
  const boxesNeedToSolved = currentGame.boxes.filter(box => {
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

    actions.innerHTML = `<button class="action-btn" onclick="nextLevel(currentGame)">Next Level</button>
                         <button class="action-btn" onclick="restartGame(currentGame)">Restart Level</button>
                         <button class="action-btn">Back to Main Menu</button>`;
  }

  levelStats.textContent = currentGame.level;
  boxesLeftStats.textContent = boxesNeedToSolved.length;
  moveStats.textContent = currentGame.moves;
}

function restartGame(game) {
  currentGame.moves = currentSave.moves;
  
  game.boxes.forEach((box, index) => {
    box.rotation = 0;
    platform.children[index].style.transform = `rotate(${box.rotation * 90}deg)`;
  });

  prepareGame(currentGame);
}

function getGameLevels() {
  const xhr = new XMLHttpRequest();

  xhr.open("GET", "./src/levels/levels.json", false);
  xhr.send()

  return JSON.parse(xhr.responseText);
}

function prepareGame(game) {
  platform.style.width = `calc(${game.dimension.x * 5}em +
                               ${game.dimension.x * 6}px + 16px)`;
  platform.style.height = `calc(${game.dimension.y * 5}em +
                               ${game.dimension.y * 6}px + 16px)`;
  
  setTimeout(() => {renderBoxes(game.boxes)}, 300);

  if (game.level > 1) {
    game.boxes.forEach((box, index) => {
      box.rotation = 0;
      platform.children[index].style.transform = `rotate(${box.rotation * 90}deg)`;
    });   
  }

  notification.textContent = "";
  actions.innerHTML = "";

  updateStats();
}

function nextLevel(game) {
  const nextGame = gameLevels.filter(gameLevel => {
    return gameLevel.level === (game.level + 1);
  })[0];

  currentGame = nextGame;

  prepareGame(nextGame);
}

function skipLevel(n) {
  for (let i = 1; i <= n; i++) {
    nextLevel(currentGame);
  }
}

prepareGame(currentGame);