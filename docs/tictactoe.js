"use strict";

(() => {
  window.addEventListener("load", () => {
    // Constants and Variables
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const restartButton = document.querySelector("#restart");
    const gameStatus = document.querySelector("#game-status");

    const CELLS_PER_AXIS = 3;
    const CELL_WIDTH = canvas.width / CELLS_PER_AXIS;
    const CELL_HEIGHT = canvas.height / CELLS_PER_AXIS;

    let grid = Array(CELLS_PER_AXIS * CELLS_PER_AXIS).fill(null);
    let currentPlayer = "X";
    let gameOver = false;

    const WINNING_COMBINATIONS = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6],            // Diagonals
    ];

    function startGame() {
      grid = Array(CELLS_PER_AXIS * CELLS_PER_AXIS).fill(null);
      currentPlayer = "X";
      gameOver = false;
      gameStatus.textContent = `Player ${currentPlayer}'s turn`;
      render();
    }

    function handleClick(x, y) {
      if (gameOver) return;

      const { column, row } = convertCartesiansToGrid(x, y);
      const index = row * CELLS_PER_AXIS + column;

      if (grid[index] !== null) {
        return;
      }

      grid[index] = currentPlayer;
      render();

      if (checkWin(currentPlayer)) {
        gameStatus.textContent = `Player ${currentPlayer} wins!`;
        gameOver = true;
      } else if (grid.every(cell => cell !== null)) {
        gameStatus.textContent = "It's a tie!";
        gameOver = true;
      } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        gameStatus.textContent = `Player ${currentPlayer}'s turn`;
      }
    }

    function checkWin(player) {
      return WINNING_COMBINATIONS.some(combination =>
        combination.every(index => grid[index] === player)
      );
    }

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();

      for (let i = 0; i < grid.length; i++) {
        const column = i % CELLS_PER_AXIS;
        const row = Math.floor(i / CELLS_PER_AXIS);
        const marker = grid[i];
        if (marker) {
          drawMarker(marker, column, row);
        }
      }
    }

    function drawGrid() {
      ctx.lineWidth = 2;
      for (let i = 1; i < CELLS_PER_AXIS; i++) {
        // Draw vertical lines
        ctx.beginPath();
        ctx.moveTo(i * CELL_WIDTH, 0);
        ctx.lineTo(i * CELL_WIDTH, canvas.height);
        ctx.stroke();

        // Draw horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_HEIGHT);
        ctx.lineTo(canvas.width, i * CELL_HEIGHT);
        ctx.stroke();
      }
    }

    function drawMarker(marker, column, row) {
      const x = column * CELL_WIDTH + CELL_WIDTH / 2;
      const y = row * CELL_HEIGHT + CELL_HEIGHT / 2;
      ctx.font = "48px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(marker, x, y);
    }

    // Event Listeners
    canvas.addEventListener("mousedown", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      handleClick(x, y);
    });

    restartButton.addEventListener("click", startGame);

    // Helper Functions
    function convertCartesiansToGrid(xPos, yPos) {
      return {
        column: Math.floor(xPos / CELL_WIDTH),
        row: Math.floor(yPos / CELL_HEIGHT),
      };
    }

    // Start the game
    startGame();
  });
})();
