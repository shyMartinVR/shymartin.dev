import CellArray from "./modules/cellArray.js";

let cellArray;
let interval;
let delay = 50;
let cellSize = 10;

main();

function main() {
	let canvas = document.querySelector(".canvas");
	canvas.width = Math.floor(innerWidth / cellSize) * cellSize;
	canvas.height = Math.floor((innerHeight - 35) / cellSize) * cellSize;
	canvas.addEventListener("click", canvasCallback);
	let ctx = canvas.getContext("2d");
	cellArray = new CellArray(canvas.width / cellSize, canvas.height / cellSize, ctx, cellSize);
	addListeners();
}

function addListeners() {
	document.querySelector(".buttonCicle").addEventListener("click", clickButton);
	document.querySelector(".intervalButton").addEventListener("click", intervalButtonCallback);
	document.querySelector(".delay").addEventListener("change", delayCallback);
	document.querySelector(".cellSize").addEventListener("change", cellsizeCallback);
}

function canvasCallback(event) {
	if (interval != undefined)
		document.querySelector(".intervalButton").click();
	cellArray.toggle(Math.floor(event.offsetX / cellSize), Math.floor(event.offsetY / cellSize));
}

function clickButton() {
	cellArray.cicle();
}

function intervalButtonCallback(event) {
	if (interval == undefined) {
		interval = setInterval(clickButton, delay);
		this.classList = "intervalButton active";
	}
	else {
		clearInterval(interval);
		interval = undefined;
		this.classList = "intervalButton";
	}
}

function delayCallback(event) {
	delay = parseInt(this.value);
}

function cellsizeCallback(event) {
	cellSize = parseInt(this.value);
	main();
}