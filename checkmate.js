function isCheckmate(color) {
    // Find the king's position
    let kingSquare = null;
    squares.forEach(square => {
      const piece = square.querySelector('.piece');
      if (piece && piece.dataset.type === 'K' && piece.dataset.color === color) {
        kingSquare = square;
      }
    });
    if (!kingSquare) return false;
  
    const kingRow = parseInt(kingSquare.dataset.row);
    const kingCol = parseInt(kingSquare.dataset.col);
  
    // Check if king is under attack
    let inCheck = false;
    for (const square of squares) {
      const piece = square.querySelector('.piece');
      if (piece && piece.dataset.color !== color) {
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        const moves = getPseudoLegalMoves(piece.dataset.type, piece.dataset.color, row, col);

        if (moves.some(m => m.row === kingRow && m.col === kingCol)) {
          inCheck = true;
          break;
        }
      }
    }
    if (!inCheck) return false;
  
    // Try all moves for all pieces of that color
    for (const square of squares) {
      const piece = square.querySelector('.piece');
      if (piece && piece.dataset.color === color) {
        const fromRow = parseInt(square.dataset.row);
        const fromCol = parseInt(square.dataset.col);
        const moves = getPseudoLegalMoves(piece.dataset.type, color, fromRow, fromCol);

  
        for (const move of moves) {
          const targetSquare = squares[move.row * 8 + move.col];
          const backup = {
            piece: targetSquare.querySelector('.piece'),
            from: square,
            to: targetSquare
          };
  
          targetSquare.appendChild(piece);
          if (!isKingInCheck(color)) {
            // Undo move
            backup.from.appendChild(piece);
            if (backup.piece) backup.to.appendChild(backup.piece);
            return false; // Not checkmate
          }
          // Undo move
          backup.from.appendChild(piece);
          if (backup.piece) backup.to.appendChild(backup.piece);
        }
      }
    }
  
    return true; // No legal move can save the king
  }
  
  function isKingInCheck(color) {
    let kingSquare = null;
    squares.forEach(square => {
      const piece = square.querySelector('.piece');
      if (piece && piece.dataset.type === 'K' && piece.dataset.color === color) {
        kingSquare = square;
      }
    });
    if (!kingSquare) return false;
  
    const kingRow = parseInt(kingSquare.dataset.row);
    const kingCol = parseInt(kingSquare.dataset.col);
  
    for (const square of squares) {
      const piece = square.querySelector('.piece');
      if (piece && piece.dataset.color !== color) {
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        const moves = getPseudoLegalMoves(piece.dataset.type, piece.dataset.color, row, col);
        if (moves.some(m => m.row === kingRow && m.col === kingCol)) {
          return true;
        }
      }
    }
  
    return false;
  }
  

  window.isKingInCheck = isKingInCheck;
window.isCheckmate = isCheckmate;
