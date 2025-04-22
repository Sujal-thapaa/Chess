// Get possible moves for a piece
function getPseudoLegalMoves(type, color, row, col) {
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
        const direction = color === 'white' ? -1 : 1;
        const startRow = color === 'white' ? 6 : 1; // Starting rows for white and black

        // 1. Forward move (one step)
        const oneStepRow = row + direction;
        // Check bounds
        if (oneStepRow >= 0 && oneStepRow < 8) {
            const oneStepSquare = squares[oneStepRow * 8 + col];
            // Check if the square exists and is empty
            if (oneStepSquare && !oneStepSquare.querySelector('.piece')) {
                moves.push({ row: oneStepRow, col: col }); // Add valid forward move

                // 2. Double move (only from start row and if one step forward is also empty)
                if (row === startRow) {
                    const twoStepsRow = row + 2 * direction;
                    const twoStepsSquare = squares[twoStepsRow * 8 + col];
                    // Check if the square exists and is empty
                    if (twoStepsSquare && !twoStepsSquare.querySelector('.piece')) {
                        moves.push({ row: twoStepsRow, col: col }); // Add valid double step move
                    }
                }
            }
        }

        // 3. Diagonal captures
        const captureCols = [col - 1, col + 1];
        captureCols.forEach(captureCol => {
            // Check bounds for row and column
            if (oneStepRow >= 0 && oneStepRow < 8 && captureCol >= 0 && captureCol < 8) {
                const targetSquare = squares[oneStepRow * 8 + captureCol];
                const targetPiece = targetSquare ? targetSquare.querySelector('.piece') : null;
                // Check if target square has an opponent's piece
                if (targetPiece && targetPiece.dataset.color !== color) {
                    moves.push({ row: oneStepRow, col: captureCol }); // Add valid capture move
                }
            }
        });
        break;
    // --- Corrected Pawn Logic End ---
  }

  return moves;
}

// Add a move to the list if it's valid
function addMoveIfValid(moves, row, col, capture = false) {
  if (row < 0 || row >= 8 || col < 0 || col >= 8) return false;

  const index = row * 8 + col;
  const targetSquare = squares[index];
  if (!targetSquare) return false; // Should not happen if board is set up correctly

  const targetPiece = targetSquare.querySelector('.piece');

  if (!targetPiece) {
    // Can always move to an empty square (relevant for King, Knight)
    moves.push({ row, col });
    return true;
  } else {
    // Can only move to an occupied square if it's an opponent's piece (capture)
    // selectedPiece might be null if just generating moves for check detection
    const movingPieceColor = selectedPiece ? selectedPiece.dataset.color : (currentPlayer === 'white' ? 'black' : 'white'); // Determine color context if needed
    if (targetPiece.dataset.color !== movingPieceColor) {
        moves.push({ row, col });
        return true; // Allows capture, but indicates the square wasn't empty
    } else {
        // Cannot move onto a square occupied by a friendly piece
        return false;
    }
  }
}


// Add a capture move to the list if it's valid
function addCaptureMoveIfValid(moves, row, col, color) {
  if (row >= 0 && row < 8 && col >= 0 && col < 8) {
    const targetSquare = squares[row * 8 + col];
    const targetPiece = targetSquare.querySelector('.piece');
    // Add move only if there is a piece AND it's the opponent's color
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
    const targetSquare = squares[r * 8 + c];
    if (!targetSquare) break; // Should not happen

    const targetPiece = targetSquare.querySelector('.piece');

    if (!targetPiece) {
      // Square is empty, add move and continue along the line
      moves.push({ row: r, col: c });
    } else {
      // Square has a piece
      // Check if it's an opponent's piece (capture)
       const movingPieceColor = selectedPiece ? selectedPiece.dataset.color : (currentPlayer === 'white' ? 'black' : 'white');
      if (targetPiece.dataset.color !== movingPieceColor) {
        moves.push({ row: r, col: c }); // Add the capture move
      }
      // Stop searching along this line whether it was a capture or a friendly piece
      break;
    }
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


window.getPseudoLegalMoves = getPseudoLegalMoves;
