import Game from "./game.js";

const height = document.getElementById("height");
const width = document.getElementById("width");
const mineCount = document.getElementById("mineCount");
const startButton = document.getElementById("startButton");

let game;

function startGame(event) {
	//create game object
	game = new Game(
		parseInt(height.value),
		parseInt(width.value),
		parseInt(mineCount.value)
	);
}

startButton.addEventListener("click", startGame);
startGame(null);

for (const input of [height, width, mineCount]) {
	input.addEventListener("input", (event) => {
		const max = parseInt(height.value) * parseInt(width.value);
		mineCount.max = max;
		if (parseInt(mineCount.value) > max) mineCount.value = max;
	});
}
