const board = document.getElementById('chessboard');
const squares = [];
const columns = 'abcdefgh';
let selectedPiece = null;
let possibleMoves = [];
let currentPlayer = 'white';
let moveHistory = [];
let currentMoveIndex = -1;

// Create the chessboard squares
for (let row = 0; row < 8; row++) {
  for (let col = 0; col < 8; col++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.classList.add((row + col) % 2 === 0 ? 'cream' : 'green');
    square.dataset.row = row;
    square.dataset.col = col;
    square.addEventListener('click', onSquareClick);
    board.appendChild(square);
    squares.push(square);

    // Add column labels to the last row
    if (row === 7) {
      const colLabel = document.createElement('div');
      colLabel.classList.add('label', 'column');
      colLabel.textContent = columns[col];
      square.appendChild(colLabel);
    }

    // Add row labels to the first column
    if (col === 0) {
      const rowLabel = document.createElement('div');
      rowLabel.classList.add('label', 'row');
      rowLabel.textContent = 8 - row;
      square.appendChild(rowLabel);
    }
  }
}
