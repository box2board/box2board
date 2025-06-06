document.addEventListener("DOMContentLoaded", function () {
  const question = {
    category: "Movie",
    answer: "Pulp Fiction",
    clues: [
      "This film was directed by a two-time Academy Award winner.",
      "It features a mysterious briefcase.",
      "The narrative is told out of chronological order.",
      "Stars include John Travolta and Samuel L. Jackson.",
      "Includes the iconic 'Royale with Cheese' scene."
    ],
    funFact: "The word 'fuck' is used 265 times in the film!"
  };

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
});
