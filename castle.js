(function() {
  const originalOnSquareClick = onSquareClick;
  let firstClick = null;

  function castleOnClick(event) {
    const square = event.currentTarget;
    const clickedPiece = square.querySelector('.piece');

    // 1st click: maybe start a castle
    if (!firstClick) {
      if (
        clickedPiece &&
        (clickedPiece.dataset.type === 'K' || clickedPiece.dataset.type === 'R') &&
        clickedPiece.dataset.color === currentPlayer
      ) {
        firstClick = clickedPiece;
        selectPiece(firstClick); // ✅ show possible moves
        return;
      }
      // not castle start → default behavior
      return originalOnSquareClick(event);
    }

    // 2nd click: check for a valid castle pair
    if (
      clickedPiece &&
      clickedPiece.dataset.color === currentPlayer &&
      ((firstClick.dataset.type === 'K' && clickedPiece.dataset.type === 'R') ||
       (firstClick.dataset.type === 'R' && clickedPiece.dataset.type === 'K'))
    ) {
      const king = firstClick.dataset.type === 'K' ? firstClick : clickedPiece;
      const rook = firstClick.dataset.type === 'R' ? firstClick : clickedPiece;
      const kRow = parseInt(king.parentElement.dataset.row);
      const kCol = parseInt(king.parentElement.dataset.col);
      const rCol = parseInt(rook.parentElement.dataset.col);

      if (
        parseInt(rook.parentElement.dataset.row) === kRow &&
        !king.dataset.hasMoved &&
        !rook.dataset.hasMoved
      ) {
        const dir = rCol > kCol ? 1 : -1;
        let clear = true;
        for (let c = Math.min(kCol, rCol) + 1; c < Math.max(kCol, rCol); c++) {
          if (squares[kRow * 8 + c].querySelector('.piece')) { clear = false; break; }
        }
        if (clear) {
          movePiece(king, kRow, kCol + 2 * dir);
          movePiece(rook, kRow, kCol + dir);
          saveMoveHistory();
          switchPlayer();
          highlightKingInCheck(); // ✅ Add this line here
        }
        
      }

      firstClick.classList.remove('selected');
      firstClick = null;
      clearSelection();
      return;
    }

    // not a castle sequence → restore normal behavior
    firstClick.classList.remove('selected');
    const temp = firstClick;
    firstClick = null;
    clearSelection();
    originalOnSquareClick({ currentTarget: temp.parentElement });
    return originalOnSquareClick(event);
  }

  squares.forEach(sq => {
    sq.removeEventListener('click', onSquareClick);
    sq.addEventListener('click', castleOnClick);
  });
  onSquareClick = castleOnClick;
})();
