let clueIndex = 0;
let triviaData;
const revealBtn = document.getElementById("reveal-btn");
const checkBtn = document.getElementById("check-btn");

fetch("trivia.json")
  .then((res) => res.json())
  .then((data) => {
    // Use today's date to select entry
    const today = new Date().toISOString().split("T")[0];
    triviaData = data.find((item) => item.date === today) || data[0];
  });

revealBtn.addEventListener("click", () => {
  if (clueIndex < 5) {
    document.getElementById(`clue${clueIndex + 1}`).textContent =
      triviaData.clues[clueIndex];
    document.getElementById(`clue${clueIndex + 1}`).classList.remove("hidden");
    clueIndex++;
    if (clueIndex === 5) {
      revealBtn.disabled = true;
    }
  }
});

checkBtn.addEventListener("click", () => {
  const userGuess = document
    .getElementById("guess-input")
    .value.trim()
    .toLowerCase();
  const accepted = triviaData.acceptedAnswers.map((a) => a.toLowerCase());

  if (accepted.includes(userGuess)) {
    document.getElementById("feedback").textContent = "🎉 Correct!";
    showAnswer();
  } else {
    document.getElementById("feedback").textContent = "❌ Try again!";
  }
});

function showAnswer() {
  document.getElementById("final-answer").textContent = triviaData.answer;
  document.getElementById("fun-fact").textContent = triviaData.funFact;
  document.getElementById("answer-section").classList.remove("hidden");
}
