export default class Cell {
    constructor(_x, _y, _alive) {
        this.x = _x;
        this.y = _y;
        this.alive = _alive;
        this.prevAlive = _alive;
    }

    set alive(_val) {
        let argType = typeof (_val);
        if (argType != "boolean")
            throw new TypeError("Expected boolean, recieved " + argType);
        this.aliveValue = _val;
    }

    get alive() {
        return this.aliveValue;
    }

    set x(_val) {
        let argType = typeof (_val);
        if (argType != "number")
            throw new TypeError("Expected number, recieved " + argType);
        if (_val < 0)
            throw new RangeError("Expected number >= 0, recieved " + _val);
        this.xValue = _val;
    }

    get x() {
        return this.xValue;
    }

    set y(_val) {
        let argType = typeof (_val);
        if (argType != "number")
            throw new TypeError("Expected number, recieved " + argType);
        if (_val < 0)
            throw new RangeError("Expected number >= 0, recieved " + _val);
        this.yValue = _val;
    }

    get y() {
        return this.yValue;
    }

    draw(_ctx, _cellSize) {
        if (this.alive != this.prevAlive) {
            this.prevAlive = this.alive;
            if (this.alive == true)
                _ctx.fillStyle = 'black';
            else
                _ctx.fillStyle = 'white';
            _ctx.fillRect(this.x * _cellSize, this.y * _cellSize, _cellSize, _cellSize);
        }
    }


    calcAlive() {
        if (this.neigbours == 3)
            this.alive = true;
        else if (this.neigbours == 2)
            return;
        else
            this.alive = false;
    }

    addNeighbour(_calcArray, _maxWidth, _maxHeight) {
        for (let index = this.x - 1; index < this.x + 2; index++) {
            if (index >= 0 && index < _maxWidth)
                for (let indey = this.y - 1; indey < this.y + 2; indey++)
                    if (indey >= 0 && indey < _maxHeight && !(index == this.x && indey == this.y))
                        _calcArray[index][indey].neigbours++;
        }
    }
}