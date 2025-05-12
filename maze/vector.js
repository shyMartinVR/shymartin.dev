class Vector {
	/**
	 * @param {Number} x
	 * @param {Number} y
	 */
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	/** @param {Vector} other */
	add = (other) => new Vector(this.x + other.x, this.y + other.y);

	/** @param {Number} scalar */
	scale = (scalar) => new Vector(this.x * scalar, this.y * scalar);

	/** @param {Number} width */
	getIndex = (width) => this.y * width + this.x;

	/**
	 * @param {Number} index
	 * @param {Number} width
	 * */
	static fromIndex = (index, width) => new Vector(index % width, Math.floor(index / width));

	static one = new Vector(1, 1);
}

export default Vector;
