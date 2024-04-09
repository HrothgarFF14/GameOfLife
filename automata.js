class Automata {
    /**
     * Initiates the Automata object
     * @constructor
     */
    constructor(gameEngine) {
        Object.assign(this, { gameEngine });

        this.automata = [];
        this.width = 200;
        this.height = 100;
        this.cellSize = 8;
        this.intervalId = null;

        this.speed = parseInt(document.getElementById("speed").value, 10);

        this.ticks = 0;
        this.tickCount = 0;
        this.boardCleared = false;
        this.forceUpdate = false;
        this.generation = 0;
        this.liveCells = 0;
        this.alreadyRunning = false;

        this.automata = this.createGrid();

        this.loadRandomGrid();

        this.intializeGUIComponents();
    }

    /**
     * Create and initialize an empty grid
     * @returns The grid object
     */
    createGrid() {
        const grid = [];
        for (let col = 0; col < this.width; col++) {
            grid[col] = [];
            for (let row = 0; row < this.height; row++) {
                grid[col][row] = 0;
            }
        }
        return grid;
    }

    loadRandomGrid() {
        for (let col = 0; col < this.width; col++) {
            for (let row = 0; row < this.height; row++) {
                this.automata[col][row] = Math.random() > 0.5 ? 1 : 0;
                if (this.automata[col][row] === 1) {
                    this.liveCells++;
                }
            }
        }
        gameEngine.draw();
    }

    clearBoard() {
        this.boardCleared = true;
        this.ticks = 0;
        this.tickCount = 0;
        for (let col = 0; col < this.width; col++) {
            for (let row = 0; row < this.height; row++) {
                this.automata[col][row] = 0;
            }
        }
        gameEngine.stop();
        gameEngine.draw();
        gameEngine.update();
        document.getElementById("ticks").innerHTML = "Ticks: " + this.ticks;
        document.getElementById("live-cells").innerHTML = this.liveCells;
    }

    intializeGUIComponents() {
        const clearBtn = document.getElementById("buttonClear");
        clearBtn.addEventListener("click", () => this.clearBoard());

        const toggleBtn = document.getElementById("buttonToggle");
        toggleBtn.addEventListener("click", () => this.toggle());

        const stepBtn = document.getElementById("buttonStep");
        stepBtn.addEventListener("click", () => this.step());

        const stillLifeBtn = document.getElementById("buttonStillLife");
        stillLifeBtn.addEventListener("click", () => this.loadStillLife());

        const oscillatorBtn = document.getElementById("buttonOscillators");
        oscillatorBtn.addEventListener("click", () => this.loadOscillator());

        const spaceshipBtn = document.getElementById("buttonSpaceships");
        spaceshipBtn.addEventListener("click", () => this.loadSpaceship());
    }
    /**
     * Function to count live neighbors of a cell at position (x, y)
     * @param {number} col at position x
     * @param {number} row at position y
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
    update(forceUpdate) {
        this.liveCells = 0;
        this.speed = parseInt(document.getElementById("speed").value, 10);

        if (
            forceUpdate ||
            (this.tickCount++ >= this.speed && this.speed != 12)
        ) {
            if (forceUpdate) {
                this.tickCount = 0;
            }
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
                        this.liveCells++;
                    } else {
                        nextAutomata[col][row] = this.automata[col][row];
                        if (this.automata[col][row] === 1) {
                            this.liveCells++;
                        }
                    }
                }
            }
            for (let col = 0; col < this.width; col++) {
                for (let row = 0; row < this.height; row++) {
                    this.automata[col][row] = nextAutomata[col][row];
                }
            }
            this.generation++;
            document.getElementById("live-cells").innerHTML = this.liveCells;
            document.getElementById("generation").innerHTML = this.generation;
        }
    }

    loadStillLife() {
        this.clearBoard();
        // Block
        this.automata[100][50] = 1;
        this.automata[101][50] = 1;
        this.automata[100][51] = 1;
        this.automata[101][51] = 1;

        gameEngine.draw();
    }

    loadOscillator() {
        this.clearBoard();
        // Blinker
        this.automata[100][50] = 1;
        this.automata[100][51] = 1;
        this.automata[100][52] = 1;
        gameEngine.draw();
    }

    loadSpaceship() {
        this.clearBoard();
        //
        this.automata[100][51] = 1;
        this.automata[101][50] = 1;
        this.automata[102][50] = 1;
        this.automata[103][50] = 1;
        this.automata[104][50] = 1;
        this.automata[104][51] = 1;
        this.automata[104][52] = 1;
        this.automata[103][53] = 1;
        this.automata[100][53] = 1;
        gameEngine.draw();
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
    toggle() {
        if (gameEngine.running) {
            gameEngine.stop();
        } else {
            if (this.boardCleared) {
                this.boardCleared = false;
                gameEngine.start();
            } else if (this.alreadyRunning) {
                gameEngine.start();
                this.alreadyRunning = false;
            }
            gameEngine.start();
            this.alreadyRunning = true;
        }
    }

    step() {
        this.update(true);
        gameEngine.draw();
    }
}
