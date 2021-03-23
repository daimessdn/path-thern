// element selector
// // platform
const platform = document.querySelector("#platform");

// // stats element
const moveStats = document.querySelector("#moves");

// initial move given in this game
let moves = 10;

// init'd boxes
const boxes = [
				{ rotation: 0, orientation: "left-bottom-line" },
             	{ rotation: 0, orientation: "right-top-line" },
             	{ rotation: 0, orientation: "none-line" },
             	{ rotation: 0, orientation: "none-line" },
             	{ rotation: 0, orientation: "left-top-line" },
             	{ rotation: 0, orientation: "left-bottom-line" },
             	{ rotation: 0, orientation: "none-line" },
             	{ rotation: 0, orientation: "left-bottom-line" },
             	{ rotation: 0, orientation: "vertical-line" },
             	{ rotation: 0, orientation: "horizontal-line" },
             	{ rotation: 0, orientation: "vertical-line" },
             	{ rotation: 0, orientation: "left-bottom-line" }
              ];

// render load the boxes into platform
boxes.forEach(box => {
	platform.innerHTML += `<div class="box ${box.orientation}" onclick="rotate(this);"><div></div><div></div></div>`;
});

// function to rotate the box
function rotate(element) {
	const boxToBeRotated = Array.prototype.indexOf.call(platform.children, element);

	boxes[boxToBeRotated].rotation++;
	const finalRotate = boxes[boxToBeRotated].rotation;
	
	moves--;
	updateStats();

	element.style.transform = `rotate(${finalRotate * 90}deg)`;
}

function updateStats() {
	moveStats.textContent = moves;
}