class Automata {
    /**
     * Initiates the Automata object
     * @constructor
     */
    constructor(gameEngine) {
        Object.assign(this, { gameEngine });

        this.automata = [];
        this.width = 800;
        this.height = 400;
        this.cellSize = 8;
        this.automata = this.createGrid();

        this.speed = parseInt(document.getElementById("speed").value, 10);

        this.ticks = 0;
        this.tickCount = 0;

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
                grid[col][row] = randomInt(2);
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
    countNeighbors(col, row) {
        let count = 0;
        for (let offsetRow = -1; offsetRow <= 1; offsetRow++) {
            for (let offsetCol = -1; offsetCol <= 1; offsetCol++) {
                const neighborRow = row + offsetRow;
                const neighborCol = col + offsetCol;

                if (
                    neighborRow >= 0 &&
                    neighborRow < this.height &&
                    neighborCol >= 0 &&
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
        if (this.tickCount++ >= this.speed && this.speed != 120) {
            this.tickCount = 0;
            this.ticks++;
            document.getElementById("ticks").innerHTML = "Ticks: " + this.ticks;

            const nextAutomata = this.createGrid();
            for (let col = 0; col < this.width; col++) {
                for (let row = 0; row < this.height; row++) {
                    const neighbors = this.countNeighbors(col, row);
                    const isAlive = this.automata[col][row] === 1;

                    if (isAlive && (neighbors < 2 || neighbors > 3)) {
                        nextAutomata[col][row] = 0;
                    } else if (!isAlive && neighbors === 3) {
                        nextAutomata[col][row] = 1;
                    } else {
                        nextAutomata[col][row] = this.automata[col][row];
                    }
                }
            }
            for (let col = 0; col < this.width; col++) {
                for (let row = 0; row < this.height; row++) {
                    this.automata[col][row] = nextAutomata[col][row];
                }
            }
        }
    }

    /**
     * Function to draw current state of the grid on the canvas
     */
    draw(ctx) {
        for (let col = 0; col < this.width; col++) {
            for (let row = 0; row < this.height; row++) {
                if (this.automata?.[col]?.[row] === 1) {
                    ctx.fillStyle = "black";
                    ctx.fillRect(
                        col * this.cellSize + 1,
                        row * this.cellSize + 1,
                        this.cellSize - 2 * 1,
                        this.cellSize - 2 * 1
                    );
                }
            }
        }
    }
}
