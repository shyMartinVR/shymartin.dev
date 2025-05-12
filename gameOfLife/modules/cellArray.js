import Cell from "./cell.js";

export default class CellArray {
    array = [];

    constructor(_width, _height, _context, _cellSize) {
        this.cellSize = _cellSize;
        this.width = _width;
        this.height = _height;
        this.cellSize = _cellSize;
        this.context = _context;

        for (let x = 0; x < _width; x++) {
            let tempArray = new Array();
            for (let y = 0; y < _height; y++) {
                let alive = false;
                tempArray.push(new Cell(x, y, alive));
            }
            this.array.push(tempArray);
        }

        this.array.forEach(innerArray => {
            innerArray.forEach(cell => cell.draw(this.context, this.cellSize));
        });
    }

    cicle() {
        //reset neighbour count
        this.array.forEach(innerArray => {
            innerArray.forEach(cell => cell.neigbours = 0);
        });
        //set neighbour count
        this.array.forEach(innerArray => {
            innerArray.forEach(cell => {
                if (cell.alive)
                    cell.addNeighbour(this.array, this.width, this.height);
            });
        });
        //set alive
        this.array.forEach(innerArray => {
            innerArray.forEach(cell => {
                cell.calcAlive();
                cell.draw(this.context, this.cellSize);
            });
        });
    }

    toggle(_x, _y) {
        this.array[_x][_y].alive = !this.array[_x][_y].alive;
        this.array[_x][_y].draw(this.context, this.cellSize);
    }

}