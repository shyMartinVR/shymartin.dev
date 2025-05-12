export default class Tile {
	/**
	 * @type {HTMLTableCellElement}
	 */
	element;
	/**
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.hasFlag = false;
		this.isMine = false;
		this.isOpened = false;
		this.neighbors = 0;
	}

	update(alive) {
		const { element, hasFlag, isMine, neighbors, isOpened } = this;
		if (isOpened) {
			element.className = `mineLevel-${neighbors}`;
			if (neighbors > 0) element.textContent = neighbors;
		} else {
			if (alive) {
				if (hasFlag) {
					element.classList.add("flag");
				} else {
					element.classList.remove("flag");
				}
			} else {
				if (isMine && !hasFlag) {
					element.className = "mine";
				} else if (!isMine && hasFlag) {
					element.classList = "closed wrongFlag";
				}
			}
		}
	}
}
