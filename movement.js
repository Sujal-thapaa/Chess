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
      highlightKingInCheck();
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
    targetSquare.removeChild(capturedPiece);
  }
  piece.dataset.hasMoved = true;
  targetSquare.appendChild(piece);
}

// Switch player
function switchPlayer() {
  currentPlayer = currentPlayer === 'white' ? 'black' : 'white';

  if (currentPlayer === 'black') {
    const fen = generateFEN();
    stockfishMove(fen);
  }
}

function highlightKingInCheck() {
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
      kingSquare.classList.add('checkmate');
      alert(`${color.charAt(0).toUpperCase() + color.slice(1)} is checkmated!`);
    }
  }
}

function getPossibleMoves(type, color, row, col) {
  const pseudoMoves = getPseudoLegalMoves(type, color, row, col);  // ✅ USE GAMEPLAY LOGIC
  const legalMoves = [];
  const fromSquare = squares[row * 8 + col];
  const piece = fromSquare.querySelector('.piece');

  for (const move of pseudoMoves) {
    const targetSquare = squares[move.row * 8 + move.col];
    const captured = targetSquare.querySelector('.piece');

    targetSquare.appendChild(piece); // Simulate move
    const inCheck = isKingInCheck(color);

    fromSquare.appendChild(piece); // Undo move
    if (captured) targetSquare.appendChild(captured);

    if (!inCheck) legalMoves.push(move);
  }

  return legalMoves;
}


function makeMoveFromUCI(from, to) {
  const fromCol = from.charCodeAt(0) - 97;
  const fromRow = 8 - parseInt(from[1]);
  const toCol = to.charCodeAt(0) - 97;
  const toRow = 8 - parseInt(to[1]);

  const fromSquare = squares[fromRow * 8 + fromCol];
  const toSquare = squares[toRow * 8 + toCol];
  const piece = fromSquare.querySelector('.piece');

  if (!piece) return;
  const captured = toSquare.querySelector('.piece');
  if (captured) toSquare.removeChild(captured);

  toSquare.appendChild(piece);
  piece.dataset.hasMoved = true;
  saveMoveHistory();
  highlightKingInCheck();
  currentPlayer = 'white';
  clearSelection();
}
