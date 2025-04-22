function stockfishMove(fen) {
    console.log("🧠 Sending FEN to Stockfish API:", fen);
  
    const url = `https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(fen)}&depth=12`;
  
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log("📦 API Raw Response:", data); // log the whole object
      
        if (data.success && data.bestmove) {
          const move = data.bestmove.split(" ")[1];
          const from = move.substring(0, 2);
          const to = move.substring(2, 4);
          makeMoveFromUCI(from, to);
        } else {
          console.error("⚠️ Stockfish API returned error:", data); // full error
        }
      })
      .catch(error => {
        console.error("❌ Error contacting Stockfish API:", error);
      });
  }
  