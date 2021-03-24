// element selector
// // platform element
const platform = document.querySelector("#platform");

// // notification triggers elements
const notificationElement = document.querySelector("#notification"),
      messageElement      = document.querySelector("#message"),
      actionsElement      = document.querySelector("#actions");

// // stats elements
const moveStatsElement  = document.querySelector("#moves"),
  boxesLeftStatsElement = document.querySelector("#boxes-left"),
  levelStatsElement     = document.querySelector("#level");

// load entire game levels
const gameLevels = getGameLevels();

// storage cache
const CURRENTSAVE_LOCAL_KEY = "paththern.currentSave";
let currentSave = JSON.parse(localStorage.getItem(CURRENTSAVE_LOCAL_KEY));

if (!currentSave) {
  localStorage.setItem(CURRENTSAVE_LOCAL_KEY, JSON.stringify(gameLevels[0]));
}

// load the game based on current save
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
          box.orientation == "vertical-line" ||
          box.orientation == "crossed-line"
      ) {
        return box.rotation % 2 !== box.correctRotation;
      } else {
        return box.rotation % 4 !== box.correctRotation;
      }
    }
  });

  if (currentGame.moves < 1) {
    if (boxesNeedToSolved.length == 0) {
      triggerNotification("Level completed!",
                          "You can go to next level.",
                          `<button class="action-btn" onclick="nextLevel(currentGame)">Next Level</button>
                           <button class="action-btn" onclick="restartGame(currentGame)">Restart Level</button>
                           <button class="action-btn">Back to Main Menu</button>`);
    } else {
      triggerNotification("Out of moves!",
                          "You are out of moves! Please try again.",
                          `<button class="action-btn" onclick="restartGame(currentGame)">Try again</button>
                           <button class="action-btn">Back to Main Menu</button>`);
    }
  } else {
    if (boxesNeedToSolved.length == 0) {
      triggerNotification("Level completed!",
                          "You can go to next level.",
                          `<button class="action-btn" onclick="nextLevel(currentGame)">Next Level</button>
                           <button class="action-btn" onclick="restartGame(currentGame)">Restart Level</button>
                           <button class="action-btn">Back to Main Menu</button>`);
    }
  }

  levelStatsElement.textContent = currentGame.level;
  boxesLeftStatsElement.textContent = boxesNeedToSolved.length;
  moveStatsElement.textContent = currentGame.moves;
}

// function to restart current game
function restartGame(game) {
  // reset game moves
  currentGame.moves = currentSave.moves;
  
  // reset box rotation
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
  
  setTimeout(function() {
    renderBoxes(game.boxes);

    game.boxes.forEach((box, index) => {
      box.rotation = 0;
      platform.children[index].style.transform = `rotate(${box.rotation * 90}deg)`;
    });
  }, 300);

  triggerNotification();
  updateStats();
}

// function to proceed game to next level
function nextLevel(game) {
  const nextGame = gameLevels.filter(gameLevel => {
    return gameLevel.level === (game.level + 1);
  })[0];

  currentGame = nextGame;
  prepareGame(nextGame);

  localStorage.setItem(CURRENTSAVE_LOCAL_KEY, JSON.stringify(currentGame));
  currentSave = JSON.parse(localStorage.getItem(CURRENTSAVE_LOCAL_KEY));
}

// function to skip n levels forward
function skipLevel(n) {
  for (let i = 1; i <= n; i++) {
    nextLevel(currentGame);
  }
}

// functions to trigger notifications
// // by changing notification elements content
function triggerNotification(heading = "", message = "", actions = "") {
  notificationElement.textContent = heading;
  messageElement.textContent = message;
  actionsElement.innerHTML = actions;
}

// function for Twitter share button
function shareOnTwitter() {
  window.open("https://twitter.com/share?url=daimessdn.github.io/path-thern&text=I just completed a level in path-thern. Let's play! ",
              "_blank");
}

prepareGame(currentGame);

triggerNotification("Welcome to path-thern.",
                      "Guide the alien to spaceship by rotating the tiles and make the right way.");
setTimeout(function() { triggerNotification(); }, 10000);
// skipLevel(19)