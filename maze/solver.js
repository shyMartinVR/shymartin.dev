import Vector from "./vector.js";

let cells, width, height;

function reconstructPath(cameFrom, current) {
	const path = [current];
	while (cameFrom.has(current)) {
		current = cameFrom.get(current);
		path.unshift(current);
	}
	return path;
}

function A_Star(start, goal, maze) {
	return new Promise((resolve, reject) => {
		cells = maze.cells;
		width = maze.width;
		height = maze.height;

		const gIndex = goal.getIndex(width);
		const sIndex = start.getIndex(width);

		const distanceToGoal = (node) => goal.x - node.x + goal.y - node.y;

		const openSet = [];
		openSet.push(sIndex);

		const cameFrom = new Map();

		const gScore = new Map();
		gScore.set(sIndex, 0);

		const fScore = new Map();
		fScore.set(sIndex, distanceToGoal(start));

		while (openSet.length > 0) {
			let min = fScore.get(openSet[0]);
			let index = 0;
			for (let i = 1; i < openSet.length; i++) {
				const f = fScore.get(openSet[i]);
				if (f < min) {
					min = f;
					index = i;
				}
			}

			const current = openSet.splice(index, 1)[0];

			if (current === gIndex) {
				resolve(reconstructPath(cameFrom, current));
				return;
			}

			for (const neighbor of getNeighbor(current)) {
				const tent = gScore.get(current) + 1;
				if (!gScore.has(neighbor) || tent < gScore.get(neighbor)) {
					cameFrom.set(neighbor, current);
					gScore.set(neighbor, tent);
					fScore.set(neighbor, tent + distanceToGoal(Vector.fromIndex(neighbor, width)));
					if (!openSet.includes(neighbor)) openSet.push(neighbor);
				}
			}
		}
		reject("No path found");
	});
}

function getNeighbor(index) {
	const neighbors = [];
	if (cells[index - 1]) neighbors.push(index - 1);

	if (cells[index + 1]) neighbors.push(index + 1);

	if (cells[index - width]) neighbors.push(index - width);

	if (cells[index + width]) neighbors.push(index + width);
	return neighbors;
}

export default A_Star;
