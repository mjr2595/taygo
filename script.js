let currentBoard = [];
let markedCells = new Set();

function generateNewBoard() {
  const board = document.getElementById("bingoBoard");
  board.innerHTML = "";
  currentBoard = [];
  markedCells.clear();

  const letters = ["T", "A", "Y", "G", "O"];
  const globalUsedPhrases = new Set();

  // Create headers
  letters.forEach((letter) => {
    const headerCell = document.createElement("div");
    headerCell.className = "bingo-header";
    headerCell.textContent = letter;
    board.appendChild(headerCell);
  });

  // Generate columns using phrases
  const columns = [];

  for (let i = 0; i < 5; i++) {
    columns.push(generatePhraseColumn(globalUsedPhrases));
  }

  // Create board rows
  for (let row = 0; row < 5; row++) {
    currentBoard[row] = [];
    for (let col = 0; col < 5; col++) {
      const cell = document.createElement("div");
      cell.className = "bingo-cell";

      // Center cell is free space
      if (row === 2 && col === 2) {
        cell.textContent = "FREE";
        cell.classList.add("free-space", "marked");
        cell.setAttribute("data-row", row);
        cell.setAttribute("data-col", col);
        markedCells.add(`${row}-${col}`);
        currentBoard[row][col] = "FREE";
      } else {
        const phrase = columns[col][row];
        cell.textContent = phrase;
        cell.setAttribute("data-row", row);
        cell.setAttribute("data-col", col);
        cell.onclick = () => toggleCell(row, col);
        currentBoard[row][col] = phrase;
      }

      board.appendChild(cell);
    }
  }
}

function toggleCell(row, col) {
  const cellKey = `${row}-${col}`;
  const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);

  if (markedCells.has(cellKey)) {
    markedCells.delete(cellKey);
    cell.classList.remove("marked");
  } else {
    markedCells.add(cellKey);
    cell.classList.add("marked");

    // Check for win after marking
    setTimeout(checkForWin, 300);
  }
}

function checkForWin() {
  // Check rows
  for (let row = 0; row < 5; row++) {
    let rowComplete = true;
    for (let col = 0; col < 5; col++) {
      if (!markedCells.has(`${row}-${col}`)) {
        rowComplete = false;
        break;
      }
    }
    if (rowComplete) {
      showWinMessage();
      return;
    }
  }

  // Check columns
  for (let col = 0; col < 5; col++) {
    let colComplete = true;
    for (let row = 0; row < 5; row++) {
      if (!markedCells.has(`${row}-${col}`)) {
        colComplete = false;
        break;
      }
    }
    if (colComplete) {
      showWinMessage();
      return;
    }
  }

  // Check diagonal (top-left to bottom-right)
  let diagonal1Complete = true;
  for (let i = 0; i < 5; i++) {
    if (!markedCells.has(`${i}-${i}`)) {
      diagonal1Complete = false;
      break;
    }
  }
  if (diagonal1Complete) {
    showWinMessage();
    return;
  }

  // Check diagonal (top-right to bottom-left)
  let diagonal2Complete = true;
  for (let i = 0; i < 5; i++) {
    if (!markedCells.has(`${i}-${4 - i}`)) {
      diagonal2Complete = false;
      break;
    }
  }
  if (diagonal2Complete) {
    showWinMessage();
    return;
  }
}

function showWinMessage() {
  const winDiv = document.getElementById("winMessage");
  winDiv.style.display = "block";

  // Create confetti effect
  createConfetti();
}

function closeWinMessage() {
  document.getElementById("winMessage").style.display = "none";
} function createConfetti() {
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.animationDelay = Math.random() * 3 + "s";
      document.body.appendChild(confetti);

      setTimeout(() => {
        document.body.removeChild(confetti);
      }, 6000);
    }, i * 100);
  }
}

function shareBoard() {
  let shareText = "I got TAYGO! 🎉\n\n";

  // Find winning squares
  const winningSquares = getWinningSquares();

  // Add the board grid using emoji squares
  for (let row = 0; row < 5; row++) {
    let rowText = "";
    for (let col = 0; col < 5; col++) {
      const cellKey = `${row}-${col}`;
      if (markedCells.has(cellKey)) {
        if (winningSquares.has(cellKey)) {
          // Winning squares get potato emoji
          rowText += "🥔";
        } else {
          // Other marked cells get dog square
          rowText += "🐶";
        }
      } else {
        // Unmarked cells get white square
        rowText += "⬜";
      }
    }
    shareText += rowText + "\n";
  }
  copyToClipboard(shareText);
}

function getWinningSquares() {
  const winningSquares = new Set();

  // Check rows
  for (let row = 0; row < 5; row++) {
    let rowComplete = true;
    for (let col = 0; col < 5; col++) {
      if (!markedCells.has(`${row}-${col}`)) {
        rowComplete = false;
        break;
      }
    }
    if (rowComplete) {
      for (let col = 0; col < 5; col++) {
        winningSquares.add(`${row}-${col}`);
      }
      return winningSquares;
    }
  }

  // Check columns
  for (let col = 0; col < 5; col++) {
    let colComplete = true;
    for (let row = 0; row < 5; row++) {
      if (!markedCells.has(`${row}-${col}`)) {
        colComplete = false;
        break;
      }
    }
    if (colComplete) {
      for (let row = 0; row < 5; row++) {
        winningSquares.add(`${row}-${col}`);
      }
      return winningSquares;
    }
  }

  // Check diagonal (top-left to bottom-right)
  let diagonal1Complete = true;
  for (let i = 0; i < 5; i++) {
    if (!markedCells.has(`${i}-${i}`)) {
      diagonal1Complete = false;
      break;
    }
  }
  if (diagonal1Complete) {
    for (let i = 0; i < 5; i++) {
      winningSquares.add(`${i}-${i}`);
    }
    return winningSquares;
  }

  // Check diagonal (top-right to bottom-left)
  let diagonal2Complete = true;
  for (let i = 0; i < 5; i++) {
    if (!markedCells.has(`${i}-${4 - i}`)) {
      diagonal2Complete = false;
      break;
    }
  }
  if (diagonal2Complete) {
    for (let i = 0; i < 5; i++) {
      winningSquares.add(`${i}-${4 - i}`);
    }
    return winningSquares;
  }

  return winningSquares;
}

function copyToClipboard(text) {
  // Create a temporary textarea element
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);

  // Select and copy the text
  textarea.select();
  textarea.setSelectionRange(0, 99999); // For mobile devices

  try {
    document.execCommand('copy');
    // Show success feedback
    showCopyFeedback();
  } catch (err) {
    console.error('Failed to copy text: ', err);
    // Fallback: show the text for manual copying
    alert('Copy this text to share:\n\n' + text);
  }

  // Clean up
  document.body.removeChild(textarea);
}

function showCopyFeedback() {
  const shareBtn = document.querySelector('.share-btn');
  const originalText = shareBtn.textContent;
  shareBtn.textContent = '✅ Copied!';
  shareBtn.style.background = 'linear-gradient(45deg, #27ae60, #2ecc71)';

  setTimeout(() => {
    shareBtn.textContent = originalText;
    shareBtn.style.background = 'linear-gradient(45deg, #00d2d3, #01a3a4)';
  }, 2000);
}

function openHelpModal() {
  document.getElementById("helpModal").style.display = "block";
}

function closeHelpModal() {
  document.getElementById("helpModal").style.display = "none";
}

// Close modal when clicking outside of it
window.onclick = function (event) {
  const helpModal = document.getElementById("helpModal");

  if (event.target === helpModal) {
    closeHelpModal();
  }
};// Initialize the game
generateNewBoard();
