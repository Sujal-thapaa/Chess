function generateFEN() {
  let fen = "";
  for (let row = 0; row < 8; row++) {
    let empty = 0;
    for (let col = 0; col < 8; col++) {
      const square = squares[row * 8 + col];
      const piece = square.querySelector('.piece');
      if (!piece) {
        empty++;
        continue;
      }
      if (empty > 0) {
        fen += empty;
        empty = 0;
      }
      let symbol = piece.dataset.type;
      if (piece.dataset.color === "white") {
        fen += symbol.toUpperCase();
      } else {
        fen += symbol.toLowerCase();
      }
    }
    if (empty > 0) fen += empty;
    if (row < 7) fen += "/";
  }
  fen += ` ${currentPlayer === "white" ? "w" : "b"} - - 0 1`;

  return fen;
}
