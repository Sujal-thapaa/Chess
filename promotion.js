(function() {
    // Save the original movePiece function.
    const originalMovePiece = movePiece;
  
    // Override movePiece to check for pawn promotion.
    movePiece = function(piece, row, col) {
      originalMovePiece(piece, row, col);
      if (piece.dataset.type === 'P') {
        const color = piece.dataset.color;
        const promotionRow = (color === 'white') ? 0 : 7;
        if (row === promotionRow) {
          showPromotionDialog(piece, ['R', 'B', 'N', 'Q']);
        }
      }
    };
  
    // Mapping from piece type to full name.
    const pieceFullNames = {
      'Q': 'Queen',
      'R': 'Rook',
      'B': 'Bishop',
      'N': 'Knight'
    };
  
    // Display the promotion dialog.
    function showPromotionDialog(piece, options) {
      const overlay = document.createElement('div');
      overlay.id = 'promotionOverlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100vw';
      overlay.style.height = '100vh';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      overlay.style.display = 'flex';
      overlay.style.justifyContent = 'center';
      overlay.style.alignItems = 'center';
      overlay.style.zIndex = 1000;
  
      const dialog = document.createElement('div');
      dialog.id = 'promotionDialog';
      dialog.style.backgroundColor = '#fff';
      dialog.style.padding = '20px';
      dialog.style.borderRadius = '5px';
      dialog.style.textAlign = 'center';
  
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
  
      options.forEach(function(option) {
        const button = document.createElement('button');
        button.style.margin = '10px';
        button.style.padding = '10px';
        button.style.display = 'flex';
        button.style.flexDirection = 'column';
        button.style.alignItems = 'center';
        button.style.cursor = 'pointer';
  
        const img = document.createElement('img');
        // getPieceImageUrl comes from your pieces.js (using Wikipedia links) :contentReference[oaicite:4]{index=4}
        img.src = getPieceImageUrl(piece.dataset.color, option);
        img.alt = pieceFullNames[option];
        img.style.width = '50px';
        img.style.height = '50px';
        button.appendChild(img);
  
        const label = document.createElement('span');
        label.textContent = pieceFullNames[option];
        label.style.marginTop = '5px';
        button.appendChild(label);
  
        button.onclick = function() {
          piece.dataset.type = option;
          piece.querySelector('img').src = getPieceImageUrl(piece.dataset.color, option);
          document.body.removeChild(overlay);
        };
  
        optionsContainer.appendChild(button);
      });
  
      dialog.appendChild(optionsContainer);
      overlay.appendChild(dialog);
      document.body.appendChild(overlay);
    }
  })();
  