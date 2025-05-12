import Tile from "./tile.js";

const status = document.getElementById("status");
const main = document.querySelector("main");

export default class Game {
	/**@type {Tile[]} */
	flags = [];
	alive = true;
	/**
	 * @param {number} height
	 * @param {number} width
	 * @param {number} mineCount
	 */
	constructor(height, width, mineCount) {
		main.firstChild?.remove();
		this.height = height;
		this.width = width;
		this.tileCount = height * width;
		this.mineCount = mineCount;
		this.tilesLeft = this.tileCount - mineCount;
		this.tiles = this.makeTiles();
		this.mines = this.makeMines();
		this.makeElements();
	}

	makeTiles() {
		const grid = [];
		for (let y = 0; y < this.height; y++) {
			const tileRow = [];
			for (let x = 0; x < this.width; x++) {
				tileRow.push(new Tile(x, y));
			}
			grid.push(tileRow);
		}
		return grid;
	}

	makeMines() {
		//assigns mines to random tiles
		const mineInts = [];
		const mines = [];

		for (let i = 0; i < this.mineCount; i++) {
			let randInt;
			do {
				randInt = Math.floor(Math.random() * this.tileCount);
			} while (mineInts.includes(randInt)); //duplicate check
			mineInts.push(randInt);

			const y = Math.floor(randInt / this.width);
			const x = randInt % this.width;
			const tile = this.tiles[y][x];
			tile.isMine = true;
			this.incNeighbors(tile);
			mines.push(tile);
		}
		return mines;
	}

	makeElements() {
		const table = document.createElement("table");
		for (let y = 0; y < this.height; y++) {
			const tr = table.insertRow();
			for (let x = 0; x < this.width; x++) {
				const tile = this.tiles[y][x];
				const td = tr.insertCell();
				td.className = "closed";
				tile.element = td;

				td.addEventListener("click", (event) => {
					if (!tile.isOpened && !tile.hasFlag && this.alive) {
						const found = this.open(tile);
						this.update(found);
					}
				});

				td.addEventListener("contextmenu", (event) => {
					event.preventDefault();
					if (this.alive && !tile.isOpened) {
						tile.hasFlag = !tile.hasFlag;
						if (tile.hasFlag) {
							this.flags.push(tile);
							this.mineCount--;
						} else {
							const index = this.flags.indexOf(tile);
							this.flags.splice(index, 1);
							this.mineCount++;
						}
						tile.update(true);
						status.innerText = `${this.mineCount} mines left`;
					}
				});
			}
		}
		main.append(table);
		status.innerText = `${this.mineCount} mines left`;
	}

	open(tile) {
		if (tile.isMine) {
			this.alive = false;
			this.loss();
			return [];
		}

		const found = [tile];
		tile.isOpened = true;
		this.tilesLeft--;
		if (tile.neighbors === 0) {
			const { x, y } = tile;
			for (let offY = -1; offY <= 1; offY++) {
				for (let offX = -1; offX <= 1; offX++) {
					try {
						const nextTile = this.tiles[y + offY][x + offX];
						if (!nextTile.isOpened && !nextTile.hasFlag)
							found.push(...this.open(nextTile));
					} catch (error) {
						// ignore out of bounds elements
					}
				}
			}
		}
		return found;
	}

	/**
	 * @param {Tile[]} targets
	 */
	update(targets) {
		for (const tile of targets) {
			tile.update(true);
		}
		if (this.tilesLeft == 0) {
			status.textContent = "You win!";
			this.alive = false;
		}
	}

	loss() {
		for (const tile of [...this.mines, ...this.flags]) {
			tile.update(this.alive);
			status.textContent = `${this.mineCount} mines left - You died!`;
		}
	}

	incNeighbors(tile) {
		const { x, y } = tile;
		for (let offY = -1; offY <= 1; offY++) {
			for (let offX = -1; offX <= 1; offX++) {
				try {
					this.tiles[y + offY][x + offX].neighbors++;
				} catch (error) {}
			}
		}
	}
}
