// element selector
// // platform
const platform = document.querySelector("#platform");

// // stats element
const moveStats      = document.querySelector("#moves"),
      boxesLeftStats = document.querySelector("#boxes-left"),
      levelStats     = document.querySelector("#level");

// initial move given in this game
let moves = 10;

// init'd boxes
const boxes = [
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
            let rotateProperty = boxToBeRotated.rotation;
            rotateProperty++;
            boxToBeRotated.rotation = rotateProperty;

            moves--;
	      updateStats();

	      element.style.transform = `rotate(${rotateProperty * 90}deg)`;
      }
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

      // if (boxesNeedToSolved.length == 0) {
      //       game.level++;
      // }

      levelStats.textContent = game.level;
      boxesLeftStats.textContent = boxesNeedToSolved.length;
	moveStats.textContent = moves;
}

renderBoxes(game.boxes);
updateStats();