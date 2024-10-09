"use strict";

(() => {
  window.addEventListener("load", () => {
    // *****************************************************************************
    // #region Constants and Variables

    // Canvas references
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    // UI references
    const restartButton = document.querySelector("#restart");
    const undoButton = document.querySelector("#undo");
    const rotateButton = document.querySelector("#rotate");
    const colorSelectButtons = document.querySelectorAll(".color-select");
    const playerScoreText = document.querySelector("#score-text");

    // Constants
    const CELL_COLORS = {
      white: [255, 255, 255],
      black: [0, 0, 0],
      red: [255, 0, 0],
      green: [0, 255, 0],
      blue: [0, 0, 255],
    };
    const CELLS_PER_AXIS = 9;
    const CELL_WIDTH = canvas.width / CELLS_PER_AXIS;
    const CELL_HEIGHT = canvas.height / CELLS_PER_AXIS;
    const MAXIMUM_SCORE = CELLS_PER_AXIS * CELLS_PER_AXIS;

    // Game objects
    let replacementColor = CELL_COLORS.white;
    let grids = [];
    let playerScore = MAXIMUM_SCORE;

    // #endregion

    // *****************************************************************************
    // #region Game Logic

    function startGame(startingGrid = []) {
      if (startingGrid.length === 0) {
        startingGrid = initializeGrid();
      }
      initializeHistory(startingGrid);
      render(grids[0]);
      updatePlayerScoreDisplay();
    }

    function initializeGrid() {
      const newGrid = [];
      for (let i = 0; i < CELLS_PER_AXIS * CELLS_PER_AXIS; i++) {
        newGrid.push(chooseRandomPropertyFrom(CELL_COLORS));
      }
      return newGrid;
    }

    function initializeHistory(startingGrid) {
      grids = [];
      grids.push(startingGrid);
    }

    function rollBackHistory() {
      if (grids.length > 1) {
        grids.pop();
        render(grids[grids.length - 1]);
      } else {
        alert("No moves to undo!");
      }
    }

    function transposeGrid() {
      const currentGrid = grids[grids.length - 1];
      const newGrid = [...currentGrid];

      for (let row = 0; row < CELLS_PER_AXIS; row++) {
        for (let col = row + 1; col < CELLS_PER_AXIS; col++) {
          const idx1 = row * CELLS_PER_AXIS + col;
          const idx2 = col * CELLS_PER_AXIS + row;
          [newGrid[idx1], newGrid[idx2]] = [newGrid[idx2], newGrid[idx1]];
        }
      }
      grids.push(newGrid);
      render(newGrid);
    }

    function render(grid) {
      for (let i = 0; i < grid.length; i++) {
        ctx.fillStyle = `rgb(${grid[i][0]}, ${grid[i][1]}, ${grid[i][2]})`;
        ctx.fillRect(
          (i % CELLS_PER_AXIS) * CELL_WIDTH,
          Math.floor(i / CELLS_PER_AXIS) * CELL_HEIGHT,
          CELL_WIDTH,
          CELL_HEIGHT
        );
      }
    }

    function updateGridAt(mousePositionX, mousePositionY) {
      const gridCoordinates = convertCartesiansToGrid(mousePositionX, mousePositionY);
      const newGrid = grids[grids.length - 1].slice();
      const index = gridCoordinates.row * CELLS_PER_AXIS + gridCoordinates.column;
      const colorToChange = newGrid[index];
      floodFill(newGrid, gridCoordinates, colorToChange);
      grids.push(newGrid);
      render(newGrid);
    }

    function updatePlayerScore() {
      playerScore = playerScore > 0 ? playerScore - 1 : 0;
      updatePlayerScoreDisplay();
    }

    function updatePlayerScoreDisplay() {
      playerScoreText.textContent = playerScore;
    }

    function floodFill(grid, gridCoordinate, colorToChange) {
      const index = gridCoordinate.row * CELLS_PER_AXIS + gridCoordinate.column;
      if (arraysAreEqual(grid[index], replacementColor)) return;
      if (!arraysAreEqual(grid[index], colorToChange)) return;

      grid[index] = replacementColor;

      if (gridCoordinate.column > 0)
        floodFill(grid, { column: gridCoordinate.column - 1, row: gridCoordinate.row }, colorToChange);
      if (gridCoordinate.column < CELLS_PER_AXIS - 1)
        floodFill(grid, { column: gridCoordinate.column + 1, row: gridCoordinate.row }, colorToChange);
      if (gridCoordinate.row > 0)
        floodFill(grid, { column: gridCoordinate.column, row: gridCoordinate.row - 1 }, colorToChange);
      if (gridCoordinate.row < CELLS_PER_AXIS - 1)
        floodFill(grid, { column: gridCoordinate.column, row: gridCoordinate.row + 1 }, colorToChange);
    }

    function restart() {
      startGame();
    }

    // #endregion

    // *****************************************************************************
    // #region Event Listeners

    canvas.addEventListener("mousedown", (event) => {
      updatePlayerScore();
      updateGridAt(event.offsetX, event.offsetY);
    });

    restartButton.addEventListener("mousedown", restart);

    undoButton.addEventListener("mousedown", rollBackHistory);

    rotateButton.addEventListener("mousedown", transposeGrid);

    colorSelectButtons.forEach((button) => {
      button.addEventListener("mousedown", () => (replacementColor = CELL_COLORS[button.name]));
    });

    // #endregion

    // *****************************************************************************
    // #region Helper Functions

    function convertCartesiansToGrid(xPos, yPos) {
      return {
        column: Math.floor(xPos / CELL_WIDTH),
        row: Math.floor(yPos / CELL_HEIGHT),
      };
    }

    function chooseRandomPropertyFrom(object) {
      const keys = Object.keys(object);
      return object[keys[Math.floor(keys.length * Math.random())]];
    }

    function arraysAreEqual(arr1, arr2) {
      return arr1.length === arr2.length && arr1.every((val, index) => val === arr2[index]);
    }

    // #endregion

    // Start the game
    startGame();
  });
})();
