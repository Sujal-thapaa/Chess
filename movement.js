// Handle square click event
function onSquareClick(event) {
  const square = event.currentTarget;
  const row = parseInt(square.dataset.row);
  const col = parseInt(square.dataset.col);
  const piece = square.querySelector('.piece');

  if (selectedPiece) {
    if (possibleMoves.some(move => move.row === row && move.col === col)) {
      movePiece(selectedPiece, row, col);
      saveMoveHistory();
      switchPlayer();
    }
    clearSelection();
  } else if (piece && piece.dataset.color === currentPlayer) {
    selectPiece(piece);
  }
}

// Select a piece
function selectPiece(piece) {
  selectedPiece = piece;
  piece.classList.add('selected');
  const row = parseInt(piece.parentElement.dataset.row);
  const col = parseInt(piece.parentElement.dataset.col);
  const type = piece.dataset.type;
  const color = piece.dataset.color;
  possibleMoves = getPossibleMoves(type, color, row, col);
  highlightPossibleMoves();
}

// Clear selection
function clearSelection() {
  if (selectedPiece) {
    selectedPiece.classList.remove('selected');
    selectedPiece = null;
  }
  clearHighlightedMoves();
  possibleMoves = [];
}

// Move a piece
function movePiece(piece, row, col) {
  const targetSquare = squares[row * 8 + col];
  const capturedPiece = targetSquare.querySelector('.piece');
  if (capturedPiece) {
    targetSquare.removeChild(capturedPiece); // Capture the piece
  }
  targetSquare.appendChild(piece);
}

// Switch player
function switchPlayer() {
  currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
}
