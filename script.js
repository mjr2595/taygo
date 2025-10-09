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
  const winDiv = document.createElement("div");
  winDiv.className = "win-message";
  winDiv.innerHTML = "🎉 TAYGO! 🎉<br>You Won!";
  document.body.appendChild(winDiv);

  // Create confetti effect
  createConfetti();

  // Remove win message after animation
  setTimeout(() => {
    document.body.removeChild(winDiv);
  }, 3000);
}

function createConfetti() {
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.animationDelay = Math.random() * 3 + "s";
      document.body.appendChild(confetti);

      setTimeout(() => {
        document.body.removeChild(confetti);
      }, 3000);
    }, i * 100);
  }
}

function openHelpModal() {
  document.getElementById("helpModal").style.display = "block";
}

function closeHelpModal() {
  document.getElementById("helpModal").style.display = "none";
}

// Close modal when clicking outside of it
window.onclick = function (event) {
  const modal = document.getElementById("helpModal");
  if (event.target === modal) {
    closeHelpModal();
  }
};

// Initialize the game
generateNewBoard();
