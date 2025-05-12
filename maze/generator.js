import Vector from "./vector.js";

let width, height, visited;

function generate(w, h) {
	return new Promise((resolve) => {
		width = w;
		height = h;
		visited = new Array(width * height).fill(false);
		const lw = w * 2 + 1;

		const indexes = [];
		let current = new Vector(random(width), random(height));
		visited[current] = true;
		const stack = [current];

		while (stack.length > 0) {
			current = stack.pop();
			const neighbor = getNeighbor(current);
			if (neighbor !== null) {
				stack.push(current, neighbor);
				indexes.push(current.add(neighbor).add(Vector.one).getIndex(lw), neighbor.scale(2).add(Vector.one).getIndex(lw));
				visited[neighbor.getIndex(width)] = true;
			}
		}
		resolve(indexes);
	});
}

function getNeighbor(node) {
	const index = node.getIndex(width);
	const { x, y } = node;
	const neighbors = [];
	if (x > 0) tryAdd(index - 1);
	if (y > 0) tryAdd(index - width);
	if (x < width - 1) tryAdd(index + 1);
	if (y < height - 1) tryAdd(index + width);

	return neighbors.length > 0 ? Vector.fromIndex(neighbors[random(neighbors.length)], width) : null;

	function tryAdd(neighbor) {
		if (!visited[neighbor]) neighbors.push(neighbor);
	}
}

const random = (max) => Math.floor(Math.random() * max);

export default generate;
