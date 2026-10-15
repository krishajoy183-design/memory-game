// The animals in the game. Each one appears twice (a pair).
const animals = ["🐱", "🐶", "🐷", "🐰"];

const board = document.getElementById("board");
const livesText = document.getElementById("lives");
const scoreText = document.getElementById("score");
const message = document.getElementById("message");
const restartButton = document.getElementById("restart");

let lives;
let score;
let firstCup;      // the first cup you opened
let lockBoard;     // stops clicking while wrong cups are closing
let timer;         // keeps track of the running timeout

// Shuffle an array randomly
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Start or restart the game
function startGame() {
  clearTimeout(timer);
  lives = 3;
  score = 0;
  firstCup = null;
  lockBoard = false;

  livesText.textContent = lives;
  scoreText.textContent = score;
  message.textContent = "";
  board.innerHTML = "";

  // Make 2 of each animal, then shuffle
  const cards = shuffle([...animals, ...animals]);

  // Create one cup (button) for each card
  cards.forEach(function (animal) {
    const cup = document.createElement("button");
    cup.className = "cup";
    cup.textContent = "🥤";
    cup.dataset.animal = animal;
    cup.addEventListener("click", function () {
      openCup(cup);
    });
    board.appendChild(cup);
  });

  // Show all animals for 2 seconds, then hide them
  lockBoard = true;
  message.textContent = "Memorize the animals!";

  const allCups = document.querySelectorAll(".cup");
  allCups.forEach(function (cup) {
    cup.textContent = cup.dataset.animal;
    cup.classList.add("open");
  });

  timer = setTimeout(function () {
    allCups.forEach(function (cup) {
      cup.textContent = "🥤";
      cup.classList.remove("open");
    });
    message.textContent = "";
    lockBoard = false;
  }, 2000);
}

// What happens when you click a cup
function openCup(cup) {
  if (lockBoard) return;                    // wait while cups are closing
  if (cup.classList.contains("open")) return; // already open

  // Show the animal
  cup.textContent = cup.dataset.animal;
  cup.classList.add("open");

  // First cup of the turn
  if (firstCup === null) {
    firstCup = cup;
    return;
  }

  // Second cup of the turn: check for a match
  if (firstCup.dataset.animal === cup.dataset.animal) {
    // Match: +1 point, lives are not reduced
    score++;
    scoreText.textContent = score;
    firstCup = null;

    if (score === animals.length) {
      message.textContent = "You win! You found all the pairs.";
      lockBoard = true;
    }
  } else {
    // Wrong: -1 life, then close both cups after 1 second
    lives--;
    livesText.textContent = lives;
    lockBoard = true;

    const wrongCup = firstCup;
    firstCup = null;

    timer = setTimeout(function () {
      wrongCup.textContent = "🥤";
      wrongCup.classList.remove("open");
      cup.textContent = "🥤";
      cup.classList.remove("open");

      if (lives === 0) {
        message.textContent = "Game over! You ran out of lives.";
        // lockBoard stays true so the game stops
      } else {
        lockBoard = false;
      }
    }, 1000);
  }
}

restartButton.addEventListener("click", startGame);

startGame();
