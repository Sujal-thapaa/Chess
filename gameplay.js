// Get possible moves for a piece
function getPossibleMoves(type, color, row, col) {
  const moves = [];

  switch (type) {
    case 'K':
      // King moves
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
      // Queen moves (combination of Rook and Bishop)
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
      // Rook moves
      addLineMoves(moves, row, col, 1, 0);
      addLineMoves(moves, row, col, -1, 0);
      addLineMoves(moves, row, col, 0, 1);
      addLineMoves(moves, row, col, 0, -1);
      break;
    case 'B':
      // Bishop moves
      addLineMoves(moves, row, col, 1, 1);
      addLineMoves(moves, row, col, -1, 1);
      addLineMoves(moves, row, col, 1, -1);
      addLineMoves(moves, row, col, -1, -1);
      break;
    case 'N':
      // Knight moves
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
      // Pawn moves
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

  return moves;
}

// Add a move to the list if it's valid
function addMoveIfValid(moves, row, col, capture = false) {
  if (row >= 0 && row < 8 && col >= 0 && col < 8) {
    const targetSquare = squares[row * 8 + col];
    const targetPiece = targetSquare.querySelector('.piece');
    if (!targetPiece || (capture && targetPiece.dataset.color !== selectedPiece.dataset.color)) {
      moves.push({ row, col });
      return true;
    }
  }
  return false;
}

// Add a capture move to the list if it's valid
function addCaptureMoveIfValid(moves, row, col, color) {
  if (row >= 0 && row < 8 && col >= 0 && col < 8) {
    const targetSquare = squares[row * 8 + col];
    const targetPiece = targetSquare.querySelector('.piece');
    if (targetPiece && targetPiece.dataset.color !== color) {
      moves.push({ row, col });
    }
  }
}

// Add line moves (for Rook, Bishop, Queen)
function addLineMoves(moves, row, col, rowInc, colInc) {
  let r = row + rowInc;
  let c = col + colInc;
  while (r >= 0 && r < 8 && c >= 0 && c < 8) {
    if (!addMoveIfValid(moves, r, c, true)) break;
    const targetSquare = squares[r * 8 + c];
    const targetPiece = targetSquare.querySelector('.piece');
    if (targetPiece) break; // Stop at the first piece
    r += rowInc;
    c += colInc;
  }
}

// Highlight possible moves
function highlightPossibleMoves() {
  possibleMoves.forEach(move => {
    const square = squares[move.row * 8 + move.col];
    square.classList.add('highlight');
  });
}



// Clear highlighted moves
function clearHighlightedMoves() {
  squares.forEach(square => {
    square.classList.remove('highlight');
  });
}

// Save the current move to the history
function saveMoveHistory() {
  const boardState = squares.map(square => {
    const piece = square.querySelector('.piece');
    if (piece) {
      return {
        type: piece.dataset.type,
        color: piece.dataset.color
      };
    }
    return null;
  });

  moveHistory = moveHistory.slice(0, currentMoveIndex + 1);
  moveHistory.push(boardState);
  currentMoveIndex++;
}

// Restore the board to a specific state
function restoreBoard(state) {
  squares.forEach((square, index) => {
    while (square.firstChild) {
      square.removeChild(square.firstChild);
    }
    const pieceData = state[index];
    if (pieceData) {
      placePiece(index % 8, Math.floor(index / 8), pieceData.color, pieceData.type);
    }
  });
}

// Handle keyboard events for undo and redo
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    if (currentMoveIndex > 0) {
      currentMoveIndex--;
      restoreBoard(moveHistory[currentMoveIndex]);
      switchPlayer();
    }
  } else if (event.key === 'ArrowRight') {
    if (currentMoveIndex < moveHistory.length - 1) {
      currentMoveIndex++;
      restoreBoard(moveHistory[currentMoveIndex]);
      switchPlayer();
    }
  }
});



placeInitialPieces();
saveMoveHistory();
highlightKingInCheck();
