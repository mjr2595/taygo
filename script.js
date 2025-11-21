let currentBoard = [];
let markedCells = new Set();
let currentTheme = 'taygo'; // 'taygo' or 'jaygo'

function generateNewBoard() {
  const board = document.getElementById("bingoBoard");
  board.innerHTML = "";
  currentBoard = [];
  markedCells.clear();

  const letters = currentTheme === 'jaygo' ? ["J", "A", "Y", "G", "O"] : ["T", "A", "Y", "G", "O"];
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
  const gameText = currentTheme === 'jaygo' ? 'JAYGO' : 'TAYGO';
  let shareText = `I got ${gameText}! 🎉\n\n`;

  // Find winning squares
  const winningSquares = getWinningSquares();

  // Add the board grid using emoji squares
  for (let row = 0; row < 5; row++) {
    let rowText = "";
    for (let col = 0; col < 5; col++) {
      const cellKey = `${row}-${col}`;
      if (markedCells.has(cellKey)) {
        if (winningSquares.has(cellKey)) {
          // Winning squares get different emojis based on theme
          rowText += currentTheme === 'jaygo' ? "😈" : "🥔";
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

function openSubmissionModal() {
  document.getElementById("submissionModal").style.display = "block";

  // Set default radio button selection based on current theme
  const defaultWho = currentTheme === 'jaygo' ? 'Jason' : 'Taylor';
  const radioButton = document.querySelector(`input[name="whoSaysIt"][value="${defaultWho}"]`);
  if (radioButton) {
    radioButton.checked = true;
  }
}

function closeSubmissionModal() {
  document.getElementById("submissionModal").style.display = "none";
}

function submitPhrase() {
  const phrase = document.getElementById("phraseInput").value.trim();
  const whoSaysItRadio = document.querySelector('input[name="whoSaysIt"]:checked');
  const submitBtn = document.querySelector('#submissionForm .game-btn');
  const errorDiv = document.getElementById('phraseError');
  const radioErrorDiv = document.getElementById('radioError');

  // Clear any existing errors
  if (errorDiv) {
    errorDiv.remove();
  }
  if (radioErrorDiv) {
    radioErrorDiv.remove();
  }

  let hasError = false;

  if (!phrase) {
    // Show red error text under the phrase input label
    const formGroup = document.querySelector('.form-group');
    const errorMsg = document.createElement('div');
    errorMsg.id = 'phraseError';
    errorMsg.className = 'error-message';
    errorMsg.textContent = 'This field is required duh';
    formGroup.appendChild(errorMsg);
    hasError = true;
  }

  if (!whoSaysItRadio) {
    // Show red error text under the radio group
    const radioFormGroup = document.querySelector('.form-group:nth-of-type(2)');
    const radioErrorMsg = document.createElement('div');
    radioErrorMsg.id = 'radioError';
    radioErrorMsg.className = 'error-message';
    radioErrorMsg.textContent = 'Please select who says it';
    radioFormGroup.appendChild(radioErrorMsg);
    hasError = true;
  }

  if (hasError) {
    return;
  }

  // Update button to show submitting state
  const originalText = submitBtn.textContent;
  const originalBackground = submitBtn.style.background;
  submitBtn.textContent = 'Submitting...';
  submitBtn.disabled = true;

  const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSf9CX3v62hp0xEV3k6S4gSpATOsX0q2ETD9Fd4BsZWkw5pxqg/formResponse";
  const PHRASE_FIELD_ID = "entry.84924091";
  const WHO_SAYS_IT_FIELD_ID = "entry.1680307727";

  // Submit to Google Forms
  const formData = new FormData();
  formData.append(PHRASE_FIELD_ID, phrase);
  formData.append(WHO_SAYS_IT_FIELD_ID, whoSaysItRadio.value);

  fetch(FORM_URL, {
    method: "POST",
    body: formData,
    mode: "no-cors" // Required for Google Forms
  }).then(() => {
    // Show success state
    submitBtn.textContent = 'Submitted! ✅';
    submitBtn.style.background = 'linear-gradient(45deg, #27ae60, #2ecc71)';

    // Reset form but keep modal open for more submissions
    setTimeout(() => {
      document.getElementById("submissionForm").reset();

      // Re-set the default radio button selection based on current theme
      const defaultWho = currentTheme === 'jaygo' ? 'Jason' : 'Taylor';
      const radioButton = document.querySelector(`input[name="whoSaysIt"][value="${defaultWho}"]`);
      if (radioButton) {
        radioButton.checked = true;
      }

      // Reset button state
      submitBtn.textContent = originalText;
      submitBtn.style.background = originalBackground;
      submitBtn.disabled = false;
    }, 1500);
  }).catch((error) => {
    console.error("Error submitting form:", error);
    // Show success anyway (no-cors mode means we can't detect actual success)
    submitBtn.textContent = 'Submitted! ✅';
    submitBtn.style.background = 'linear-gradient(45deg, #27ae60, #2ecc71)';

    // Reset form but keep modal open for more submissions
    setTimeout(() => {
      document.getElementById("submissionForm").reset();

      // Re-set the default radio button selection based on current theme
      const defaultWho = currentTheme === 'jaygo' ? 'Jason' : 'Taylor';
      const radioButton = document.querySelector(`input[name="whoSaysIt"][value="${defaultWho}"]`);
      if (radioButton) {
        radioButton.checked = true;
      }

      // Reset button state
      submitBtn.textContent = originalText;
      submitBtn.style.background = originalBackground;
      submitBtn.disabled = false;
    }, 1500);
  });
}

// Close modal when clicking outside of it
window.onclick = function (event) {
  const helpModal = document.getElementById("helpModal");
  const submissionModal = document.getElementById("submissionModal");

  if (event.target === helpModal) {
    closeHelpModal();
  } else if (event.target === submissionModal) {
    closeSubmissionModal();
  }
}; function toggleTheme() {
  currentTheme = currentTheme === 'taygo' ? 'jaygo' : 'taygo';

  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const toggleEmoji = document.getElementById('toggleEmoji');
  const gameTitle = document.getElementById('gameTitle');
  const winText = document.getElementById('winText');
  const titleIcon1 = document.getElementById('titleIcon1');
  const titleIcon2 = document.getElementById('titleIcon2');
  const winIcon1 = document.getElementById('winIcon1');
  const winIcon2 = document.getElementById('winIcon2');
  const favicon = document.getElementById('favicon');
  const ogImage = document.getElementById('ogImage');
  const twitterImage = document.getElementById('twitterImage');
  const submissionBtn = document.getElementById('submissionBtn');

  if (currentTheme === 'jaygo') {
    body.classList.add('jaygo-theme');
    themeToggle.classList.add('toggled');
    toggleEmoji.textContent = '😈';

    // Update page title
    document.title = 'Jaygo!';

    // Update images to Jason versions
    titleIcon1.src = 'images/jason/json-head.png';
    titleIcon1.alt = 'Jay';
    titleIcon2.src = 'images/jason/json-head.png';
    titleIcon2.alt = 'Jay';
    winIcon1.src = 'images/jason/fellow-kids.png';
    winIcon1.alt = 'Dancing Jay';
    winIcon2.src = 'images/jason/fellow-kids.png';
    winIcon2.alt = 'Dancing Jay';
    favicon.href = 'images/jason/json-head.png';
    ogImage.content = 'https://taygo.netlify.app/images/jason/json-head.png';
    twitterImage.content = 'https://taygo.netlify.app/images/jason/json-head.png';

    // Update title text to JAYGO
    gameTitle.innerHTML = `
      <img src="images/jason/json-head.png" class="title-icon" alt="Jay" id="titleIcon1" />
      JAYGO!
      <img src="images/jason/json-head.png" class="title-icon" alt="Jay" id="titleIcon2" />
    `;

    winText.innerHTML = 'JAYGO!<br /><button class="share-btn" onclick="shareBoard()">📋 Share</button>';
    submissionBtn.innerHTML = '💡 Submit a Jason-ism or phrase';
  } else {
    body.classList.remove('jaygo-theme');
    themeToggle.classList.remove('toggled');
    toggleEmoji.textContent = '🥔';

    // Update page title
    document.title = 'Taygo!';

    // Update images to Taylor versions
    titleIcon1.src = 'images/taylor/tay.png';
    titleIcon1.alt = 'Tay';
    titleIcon2.src = 'images/taylor/tay.png';
    titleIcon2.alt = 'Tay';
    winIcon1.src = 'images/taylor/tay-rex.png';
    winIcon1.alt = 'Dancing Tay-Rex';
    winIcon2.src = 'images/taylor/tay-rex.png';
    winIcon2.alt = 'Dancing Tay-Rex';
    favicon.href = 'images/taylor/tay.png';
    ogImage.content = 'https://taygo.netlify.app/images/taylor/tay.png';
    twitterImage.content = 'https://taygo.netlify.app/images/taylor/tay.png';

    // Update title text to TAYGO
    gameTitle.innerHTML = `
      <img src="images/taylor/tay.png" class="title-icon" alt="Tay" id="titleIcon1" />
      TAYGO!
      <img src="images/taylor/tay.png" class="title-icon" alt="Tay" id="titleIcon2" />
    `;

    winText.innerHTML = 'TAYGO!<br /><button class="share-btn" onclick="shareBoard()">📋 Share</button>';
    submissionBtn.innerHTML = '💡 Submit a Taylor-ism or phrase';
  }

  // Regenerate the board with new letters
  generateNewBoard();
}

// Check URL for /jaygo and set initial theme
function initializeTheme() {
  const isJaygoUrl = window.location.search.includes('jaygo');
  if (isJaygoUrl && currentTheme === 'taygo') {
    toggleTheme();
  }
}

// Initialize the game
initializeTheme();
generateNewBoard();
