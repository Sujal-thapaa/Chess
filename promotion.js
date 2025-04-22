(function() {
  const originalMovePiece = movePiece;

  movePiece = function(piece, row, col) {
    originalMovePiece(piece, row, col);
    if (piece.dataset.type === 'P') {
      const color = piece.dataset.color;
      const promotionRow = (color === 'white') ? 0 : 7;
      if (row === promotionRow) {
        showPromotionDialog(piece, ['Q', 'R', 'B', 'N']);
      }
    }
  };

  const pieceFullNames = {
    'Q': 'Queen',
    'R': 'Rook',
    'B': 'Bishop',
    'N': 'Knight'
  };

  function showPromotionDialog(piece, options) {
    const overlay = document.createElement('div');
    overlay.id = 'promotionOverlay';
    overlay.style = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;

    const dialog = document.createElement('div');
    dialog.id = 'promotionDialog';
    dialog.style = `
      background-color: white;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
    `;

    const header = document.createElement('h3');
    header.textContent = 'Promote Pawn';
    dialog.appendChild(header);

    const prompt = document.createElement('p');
    prompt.textContent = 'Choose a piece to promote to:';
    dialog.appendChild(prompt);

    const optionsContainer = document.createElement('div');
    optionsContainer.style.display = 'flex';
    optionsContainer.style.justifyContent = 'center';
    optionsContainer.style.flexWrap = 'wrap';

    options.forEach(option => {
      const button = document.createElement('button');
      button.style.margin = '10px';
      button.style.padding = '10px';
      button.style.display = 'flex';
      button.style.flexDirection = 'column';
      button.style.alignItems = 'center';
      button.style.cursor = 'pointer';

      const img = document.createElement('img');
      img.src = getPieceImageUrl(piece.dataset.color, option);
      img.alt = pieceFullNames[option];
      img.style.width = '50px';
      img.style.height = '50px';
      button.appendChild(img);

      const label = document.createElement('span');
      label.textContent = pieceFullNames[option];
      label.style.marginTop = '5px';
      button.appendChild(label);

      button.onclick = function () {
        piece.dataset.type = option;
        piece.querySelector('img').src = getPieceImageUrl(piece.dataset.color, option);
        document.body.removeChild(overlay);

        // ✅ Update state after promotion
        saveMoveHistory();
        highlightKingInCheck();
        switchPlayer();
      };

      optionsContainer.appendChild(button);
    });

    dialog.appendChild(optionsContainer);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
  }
})();
