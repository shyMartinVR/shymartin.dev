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

    addNeighbour(_calcArray, _maxWidth, _maxHeight, wrap) {
        for (let index = this.x - 1; index < this.x + 2; index++) {
            for (let indey = this.y - 1; indey < this.y + 2; indey++) {
                if (!(index == this.x && indey == this.y)) {
                    let [nx, ny] = wrap ? this.normalizeCoords(index, indey, _maxWidth, _maxHeight) : [index, indey];
                    if (nx >= 0 && nx < _maxWidth && ny >= 0 && ny < _maxHeight) {
                        _calcArray[nx][ny].neigbours++;
                    }
                }
            }
        }
    }

    normalizeCoords(x, y, _maxWidth, _maxHeight) {
        if (x < 0)
            x = _maxWidth - 1;
        else if (x >= _maxWidth)
            x = 0;

        if (y < 0)
            y = _maxHeight - 1;
        else if (y >= _maxHeight)
            y = 0;

        return [x, y];
    }
}