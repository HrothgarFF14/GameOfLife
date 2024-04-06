class Automata {
    /**
     * Initiates the Automata object
     * @constructor
     */
    constructor() {
        this.width = 100;
        this.height = 50;
        this.cellSize = 8;
        this.automata = this.createGrid();
        this.ctx = document.getElementById("canvas").getContext("2d");
        this.speed = 100;
        this.ticks = 0;
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

    /**
     * Function to count live neighbors of a cell at position (x, y)
     * @param {number} cell at position x
     * @param {number} cell at position y
     * @returns {number} The number of neighbors
     */
    countNeighbors(x, y) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const nextX = x + i;
                const nextY = y + i;
                if (!(i === 0 && j === 0) && this.automata?.[nextX]?.[nextY]) {
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
                const neighbors = this.countNeighbors(col, row);
                if (this.automata?.[col]?.[row] === 1) {
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
