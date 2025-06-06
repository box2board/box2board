document.addEventListener("DOMContentLoaded", function () {
  let playerName = localStorage.getItem("playerName");
  if (!playerName) {
    playerName = prompt("Enter your name or nickname:");
    localStorage.setItem("playerName", playerName);
  }

  fetch("data.json?" + new Date().getTime())
    .then(response => response.json())
    .then(puzzles => {
      const question = puzzles[Math.floor(Math.random() * puzzles.length)];
      let currentClue = 0;
      let guesses = 3;
      let gameEnded = false;

      const categoryElement = document.getElementById("category");
      const cluesDiv = document.getElementById("clues");
      const resultElement = document.getElementById("result");
      const guessInput = document.getElementById("guessInput");
      const submitBtn = document.getElementById("submitBtn");

      // Status display
      const status = document.createElement("p");
      status.id = "status";
      document.body.insertBefore(status, cluesDiv);

      // Reveal Clue Button
      const clueBtn = document.createElement("button");
      clueBtn.textContent = "Reveal Clue";
      clueBtn.style.marginTop = "1rem";
      document.body.insertBefore(clueBtn, guessInput);

      categoryElement.textContent = "Category: " + question.category;
      updateStatus();

      clueBtn.addEventListener("click", function () {
        if (currentClue < question.clues.length && !gameEnded) {
          const clue = document.createElement("p");
          clue.textContent = "Clue " + (currentClue + 1) + ": " + question.clues[currentClue];
          cluesDiv.appendChild(clue);
          currentClue++;
          updateStatus();
        }
      });

      function updateStatus() {
        status.textContent = `Guesses left: ${guesses} | Clues used: ${currentClue}/5`;
      }

      function submitGuess() {
        if (gameEnded) return;

        const guess = guessInput.value.trim().toLowerCase();
        if (!guess) return;

        if (guess === question.answer.toLowerCase()) {
          const score = 6 - currentClue;
          resultElement.innerHTML = `🎉 Correct! You earned ${score} points.<br>Fun fact: ${question.funFact}`;
          saveScore(score);
          endGame();
        } else {
          guesses--;
          updateStatus();
          if (guesses > 0) {
            resultElement.textContent = `❌ Incorrect. ${guesses} guesses left.`;
          } else {
            resultElement.innerHTML = `😢 Out of guesses! The answer was "${question.answer}".<br>Fun fact: ${question.funFact}`;
            endGame();
          }
        }
      }

      function saveScore(score) {
        let scores = JSON.parse(localStorage.getItem("playerScores") || "[]");
        scores.push({ name: playerName, score: score, date: new Date().toISOString() });
        localStorage.setItem("playerScores", JSON.stringify(scores));
      }

      function endGame() {
        gameEnded = true;
        clueBtn.disabled = true;
        submitBtn.disabled = true;
        guessInput.disabled = true;
      }

      submitBtn.addEventListener("click", submitGuess);
      showLeaderboard();
    });

  function showLeaderboard() {
    const scores = JSON.parse(localStorage.getItem("playerScores") || "[]");
    if (scores.length === 0) return;

    const leaderboard = document.createElement("div");
    leaderboard.id = "leaderboard";
    leaderboard.innerHTML = "<h2>🏆 Local Leaderboard</h2>";

    const sorted = scores.sort((a, b) => b.score - a.score).slice(0, 5);

    const list = document.createElement("ol");
    sorted.forEach(entry => {
      const item = document.createElement("li");
      item.textContent = `${entry.name}: ${entry.score} pts`;
      list.appendChild(item);
    });

    leaderboard.appendChild(list);
    document.body.appendChild(leaderboard);
  }
});
