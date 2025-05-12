import Vector from "./vector.js";
import generate from "./generator.js";
import solver from "./solver.js";

const params = new URLSearchParams(location.search);
const width = params.has("width") ? parseInt(params.get("width")) : Math.floor(window.innerWidth / 2);
const height = params.has("height") ? parseInt(params.get("height")) : Math.floor(window.innerHeight / 2);

const canvas = document.createElement("canvas");
canvas.width = width * 2 + 1;
canvas.height = height * 2 + 1;

const context = canvas.getContext("2d");
context.fillRect(0, 0, canvas.width, canvas.height);

const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
const data = imageData.data;

document.body.append(canvas);

const maze = {
	cells: new Array(canvas.width * canvas.height).fill(false),
	width: canvas.width,
	height: canvas.height,
};

const start = new Vector(1, 1);
const goal = new Vector(canvas.width - 2, canvas.height - 2);

const white = new Array(3).fill(255);
const blue = [0, 0, 255];

generate(width, height).then((path) => {
	for (const index of path) maze.cells[index] = true;
	Promise.all([draw(path, white), solver(start, goal, maze)]).then(([_, solution]) => draw(solution, blue));
});

function draw(indexes, color) {
	indexes = indexes.map((i) => i * 4);
	let i = 0;
	return new Promise((resolve) => {
		const interval = setInterval(() => {
			data.set(color, indexes[i++]);
			context.putImageData(imageData, 0, 0);
			if (indexes.length == 0 || i == indexes.length) canvas.click();
		}, 1);

		canvas.addEventListener(
			"click",
			(event) => {
				clearInterval(interval);
				while (i < indexes.length) data.set(color, indexes[i++]);
				context.putImageData(imageData, 0, 0);
				resolve();
			},
			{ once: true }
		);
	});
}
