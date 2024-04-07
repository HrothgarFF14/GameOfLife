class Automata {
    /**
     * Initiates the Automata object
     * @constructor
     */
    constructor() {
        this.automata = [];
        this.width = 100;
        this.height = 200;
        this.cellSize = 8;
        this.automata = this.createGrid();
        this.speed = 100;
        this.ticks = 0;

        this.fillRandom();
    }

    /**
     * Create and initialize a grid with random cells
     * @returns The grid object
     */
    createGrid() {
        const grid = [];
        for (let col = 0; col < this.width; col++) {
            grid[col] = [];
            for (let row = 0; row < this.height; row++) {
                grid[col][row] = Math.random() > 0.5 ? 1 : 0;
            }
        }
        return grid;
    }

    fillRandom() {
        for (let col = 0; col < this.width; col++) {
            for (let row = 0; row < this.height; row++) {
                this.automata[col][row] = randomInt(2);
            }
        }
    }

    /**
     * Function to count live neighbors of a cell at position (x, y)
     * @param {number} row at position x
     * @param {number} col at position y
     * @returns {number} The number of neighbors
     */
    countNeighbors(row, col) {
        let count = 0;
        for (let offsetRow = -1; offsetRow <= 1; offsetRow++) {
            for (let offsetCol = -1; offsetCol <= 1; offsetCol++) {
                const neighborRow = row + offsetRow;
                const neighborCol = col + offsetCol;

                if (
                    neighborRow >= 0 &&
                    neighborRow < this.height &&
                    neightborCol >= 0 &&
                    neighborCol < this.width &&
                    !(offsetRow === 0 && offsetCol === 0) &&
                    this.automata[neighborCol][neighborRow]
                ) {
                    count++;
                }
            }
        }
        return count;
    }

    /**
     * Function to update the grid based on rules of Conway's Way of Life
     */
    update() {
        const nextAutomata = this.createGrid();
        for (let col = 0; col < this.width; col++) {
            for (let row = 0; row < this.height; row++) {
                const neighbors = this.countNeighbors(row, col);
                if (this.automata[col][row] === 1) {
                    if (neighbors < 2 || neighbors > 3) {
                        nextAutomata[col][row] = 0;
                    } else {
                        nextAutomata[col][row] = 1;
                    }
                } else {
                    if (neighbors === 3) {
                        nextAutomata[col][row] = 1;
                    }
                }
            }
        }
        this.automata = nextAutomata; //Update grid with next state
        this.ticks++; // Increment tick count
    }

    /**
     * Function to draw current state of the grid on the canvas
     */
    draw() {
        this.ctx?.clearRect(
            0,
            0,
            this.width * this.cellSize,
            this.height * this.cellSize
        );
        for (let col = 0; col < this.width; col++) {
            for (let row = 0; row < this.height; row++) {
                if (this.automata?.[col]?.[row] === 1) {
                    this.ctx.fillStyle = "black";
                    this.ctx.fillRect(
                        col * this.cellSize,
                        row * this.cellSize,
                        this.cellSize,
                        this.cellSize
                    );
                }
            }
        }
    }

    /**
     * Function to start the simulation loop
     */
    start() {
        setInterval(() => {
            this.update();
            this.draw();
        }, this.speed);
    }
}
