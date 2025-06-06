document.addEventListener("DOMContentLoaded", function () {
    let playerName = localStorage.getItem("playerName");
  if (!playerName) {
    playerName = prompt("Enter your name or nickname:");
    localStorage.setItem("playerName", playerName);
  }
  fetch("data.json")
    .then(response => response.json())
    .then(puzzles => {
      const question = puzzles[Math.floor(Math.random() * puzzles.length)];

      let currentClue = 0;
      let guesses = 3;

      const categoryElement = document.getElementById("category");
      const cluesDiv = document.getElementById("clues");
      const resultElement = document.getElementById("result");
      const guessInput = document.getElementById("guessInput");
      const submitBtn = document.getElementById("submitBtn");

      categoryElement.textContent = "Category: " + question.category;
      showNextClue();

      function showNextClue() {
        if (currentClue < question.clues.length) {
          const clue = document.createElement("p");
          clue.textContent = "Clue " + (currentClue + 1) + ": " + question.clues[currentClue];
          cluesDiv.appendChild(clue);
          currentClue++;
        }
      }

      function submitGuess() {
        const guess = guessInput.value.trim().toLowerCase();

        if (guess === question.answer.toLowerCase()) {
          const score = 6 - currentClue;
          resultElement.innerHTML = `🎉 Correct! You earned ${score} points.<br>Fun fact: ${question.funFact}`;
            const score = 6 - currentClue;
resultElement.innerHTML = ...
        } else {
          guesses--;
          if (guesses > 0) {
            resultElement.textContent = `❌ Incorrect. ${guesses} guesses left.`;
            showNextClue();
          } else {
            resultElement.innerHTML = `😢 Out of guesses! The answer was "${question.answer}".<br>Fun fact: ${question.funFact}`;
          }
        }
      }

      submitBtn.addEventListener("click", submitGuess);
    })
    .catch(err => {
      document.getElementById("category").textContent = "Error loading puzzle data.";
      console.error("Failed to load data.json", err);
    });
});
function showLeaderboard() {
  const scores = JSON.parse(localStorage.getItem("playerScores") || "[]");
  if (scores.length === 0) return;

  const leaderboard = document.createElement("div");
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
