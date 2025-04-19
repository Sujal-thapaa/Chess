// Initial position for the pieces
const initialPosition = {
  'a1': 'R', 'b1': 'N', 'c1': 'B', 'd1': 'Q', 'e1': 'K', 'f1': 'B', 'g1': 'N', 'h1': 'R',
  'a2': 'P', 'b2': 'P', 'c2': 'P', 'd2': 'P', 'e2': 'P', 'f2': 'P', 'g2': 'P', 'h2': 'P',
  'a7': 'P', 'b7': 'P', 'c7': 'P', 'd7': 'P', 'e7': 'P', 'f7': 'P', 'g7': 'P', 'h7': 'P',
  'a8': 'R', 'b8': 'N', 'c8': 'B', 'd8': 'Q', 'e8': 'K', 'f8': 'B', 'g8': 'N', 'h8': 'R'
};

// Place pieces on the board
function placeInitialPieces() {
  for (const [position, piece] of Object.entries(initialPosition)) {
    const col = columns.indexOf(position[0]);
    const row = 8 - parseInt(position[1]);
    const color = position[1] <= 2 ? 'white' : 'black';
    placePiece(col, row, color, piece);
  }
}

// Place a piece on the board
function placePiece(col, row, color, type) {
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.dataset.type = type;
  piece.dataset.color = color;
  const img = document.createElement('img');
  img.src = getPieceImageUrl(color, type);
  piece.appendChild(img);
  squares[row * 8 + col].appendChild(piece);
}

// Get the image URL for a piece
function getPieceImageUrl(color, type) {
  const urls = {
    'K': {
      'white': 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
      'black': 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg'
    },
    'Q': {
      'white': 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
      'black': 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg'
    },
    'R': {
      'white': 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
      'black': 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg'
    },
    'B': {
      'white': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
      'black': 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg'
    },
    'N': {
      'white': 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
      'black': 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg'
    },
    'P': {
      'white': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',
      'black': 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg'
    }
  };
  return urls[type][color];
}
