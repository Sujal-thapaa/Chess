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
      highlightKingInCheck(); // ✅ call after move
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

// 🔴 Check and Checkmate Highlighting
function highlightKingInCheck() {
  // Clear previous highlights
  squares.forEach(sq => {
    sq.classList.remove('in-check');
    sq.classList.remove('checkmate');
  });

  let kingSquare = null;

  squares.forEach(square => {
    const piece = square.querySelector('.piece');
    if (piece && piece.dataset.type === 'K' && piece.dataset.color === currentPlayer) {
      kingSquare = square;
    }
  });

  if (!kingSquare) return;

  const color = currentPlayer;

  if (isKingInCheck(color)) {
    kingSquare.classList.add('in-check');

    if (isCheckmate(color)) {
      kingSquare.classList.add('checkmate'); // 🔥 constant glow + animation
      alert(`${color.charAt(0).toUpperCase() + color.slice(1)} is checkmated!`);
    }
  }
}


// ✅ Modified getPossibleMoves with illegal move filtering
function getPossibleMoves(type, color, row, col) {
  const moves = [];

  switch (type) {
    case 'K':
      addMoveIfValid(moves, row + 1, col);
      addMoveIfValid(moves, row - 1, col);
      addMoveIfValid(moves, row, col + 1);
      addMoveIfValid(moves, row, col - 1);
      addMoveIfValid(moves, row + 1, col + 1);
      addMoveIfValid(moves, row + 1, col - 1);
      addMoveIfValid(moves, row - 1, col + 1);
      addMoveIfValid(moves, row - 1, col - 1);
      break;
    case 'Q':
      addLineMoves(moves, row, col, 1, 0);
      addLineMoves(moves, row, col, -1, 0);
      addLineMoves(moves, row, col, 0, 1);
      addLineMoves(moves, row, col, 0, -1);
      addLineMoves(moves, row, col, 1, 1);
      addLineMoves(moves, row, col, -1, 1);
      addLineMoves(moves, row, col, 1, -1);
      addLineMoves(moves, row, col, -1, -1);
      break;
    case 'R':
      addLineMoves(moves, row, col, 1, 0);
      addLineMoves(moves, row, col, -1, 0);
      addLineMoves(moves, row, col, 0, 1);
      addLineMoves(moves, row, col, 0, -1);
      break;
    case 'B':
      addLineMoves(moves, row, col, 1, 1);
      addLineMoves(moves, row, col, -1, 1);
      addLineMoves(moves, row, col, 1, -1);
      addLineMoves(moves, row, col, -1, -1);
      break;
    case 'N':
      addMoveIfValid(moves, row + 2, col + 1, true);
      addMoveIfValid(moves, row + 2, col - 1, true);
      addMoveIfValid(moves, row - 2, col + 1, true);
      addMoveIfValid(moves, row - 2, col - 1, true);
      addMoveIfValid(moves, row + 1, col + 2, true);
      addMoveIfValid(moves, row + 1, col - 2, true);
      addMoveIfValid(moves, row - 1, col + 2, true);
      addMoveIfValid(moves, row - 1, col - 2, true);
      break;
    case 'P':
      const direction = color === 'white' ? -1 : 1;
      if (addMoveIfValid(moves, row + direction, col) && !squares[(row + direction) * 8 + col].querySelector('.piece')) {
        if ((color === 'white' && row === 6) || (color === 'black' && row === 1)) {
          addMoveIfValid(moves, row + 2 * direction, col);
        }
      }
      addCaptureMoveIfValid(moves, row + direction, col + 1, color);
      addCaptureMoveIfValid(moves, row + direction, col - 1, color);
      break;
  }

  // ✅ Filter illegal moves that leave king in check
  const legalMoves = [];
  const fromSquare = squares[row * 8 + col];
  const piece = fromSquare.querySelector('.piece');

  for (const move of moves) {
    const targetSquare = squares[move.row * 8 + move.col];
    const captured = targetSquare.querySelector('.piece');

    // Simulate the move
    targetSquare.appendChild(piece);
    const originalParent = fromSquare;

    if (!isKingInCheck(color)) {
      legalMoves.push(move);
    }

    // Undo the move
    originalParent.appendChild(piece);
    if (captured) targetSquare.appendChild(captured);
  }

  return legalMoves;
}
