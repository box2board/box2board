window.onload = function () {
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

  document.getElementById("category").textContent = "Category: " + question.category;
  const cluesDiv = document.getElementById("clues");

  showNextClue();

  function showNextClue() {
    if (currentClue < question.clues.length) {
      const clue = document.createElement("p");
      clue.textContent = "Clue " + (currentClue + 1) + ": " + question.clues[currentClue];
      cluesDiv.appendChild(clue);
      currentClue++;
    }
  }

  window.submitGuess = function () {
    const guess = document.getElementById("guessInput").value.trim().toLowerCase();
    const result = document.getElementById("result");

    if (guess === question.answer.toLowerCase()) {
      const score = 6 - currentClue;
      result.innerHTML = `🎉 Correct! You earned ${score} points.<br>Fun fact: ${question.funFact}`;
    } else {
      guesses--;
      if (guesses > 0) {
        result.textContent = `❌ Incorrect. ${guesses} guesses left.`;
        showNextClue();
      } else {
        result.innerHTML = `😢 Out of guesses! The answer was "${question.answer}".<br>Fun fact: ${question.funFact}`;
      }
    }
  };
};
