// score record
let score = JSON.parse(localStorage.getItem("score")) || {
  wins: 0,
  losses: 0,
  ties: 0,
};

renderScore();

document.querySelector(".js-result").innerHTML = `Start Playing!`;

// game logic
function playGame(playerMove) {
  const computerMove = pickComputerMove();
  const result = getResult(playerMove, computerMove);

  updateScore(result);
  saveScore();
  renderScore();
  renderResult(playerMove, computerMove, result);
}

function pickComputerMove() {
  const moves = ["rock", "paper", "scissors"];
  const randomSelection = Math.floor(Math.random() * moves.length);

  return moves[randomSelection];
}

function getResult(playerMove, computerMove) {
  const outcomes = {
    rock: { rock: "Tie.", paper: "You lose.", scissors: "You win." },
    paper: { rock: "You win.", paper: "Tie.", scissors: "You lose." },
    scissors: { rock: "You lose.", paper: "You win.", scissors: "Tie." },
  };

  return outcomes[playerMove][computerMove];
}

function updateScore(result) {
  if (result === "You win.") {
    score.wins += 1;
  } else if (result === "You lose.") {
    score.losses += 1;
  } else if (result === "Tie.") {
    score.ties += 1;
  }
}

function saveScore() {
  localStorage.setItem("score", JSON.stringify(score));
}

function renderScore() {
  const { wins, losses, ties } = score;
  document.querySelector(
    ".js-score"
  ).innerHTML = `Wins: ${wins}, Losses: ${losses}, Ties: ${ties}`;
}

function renderResult(playerMove, computerMove, result) {
  document.querySelector(".js-result").innerHTML = `
    ${result} <br><br>
    You picked <img src='images/${playerMove}-emoji.png' class='move-icon'> 
    Computer picked <img src='images/${computerMove}-emoji.png' class='move-icon'> `;
}

document
  .querySelector(".rock-button")
  .addEventListener("click", () => playGame("rock"));
document
  .querySelector(".paper-button")
  .addEventListener("click", () => playGame("paper"));
document
  .querySelector(".scissors-button")
  .addEventListener("click", () => playGame("scissors"));

// autoplay button logic
let isAutoPlaying = false;
let intervalId;

const handleAutoplay = () => {
  if (!isAutoPlaying) {
    intervalId = setInterval(() => {
      const playerMove = pickComputerMove();
      playGame(playerMove);
    }, 1000);
    isAutoPlaying = true;
    document.querySelector(".js-autoplay").innerHTML = "Stop Auto-Play";
  } else {
    clearInterval(intervalId);
    isAutoPlaying = false;
    document.querySelector(".js-autoplay").innerHTML = "Auto-Play";
  }
};

document
  .querySelector(".js-autoplay")
  .addEventListener("click", () => handleAutoplay());

// reset button logic & confirmation modal
const resetScore = () => {
  score.wins = 0;
  score.losses = 0;
  score.ties = 0;

  localStorage.removeItem("score");
  renderScore();
  document.querySelector(".js-result").innerHTML = `Start Playing!`;
};

const modal = document.querySelector(".modal-container");
const modalButtons = document.querySelector(".modal-buttons");
const yesButton = document.querySelector(".yes-modal-button");
const noButton = document.querySelector(".no-modal-button");
const modalMessage = document.querySelector(".modal-message");
const closeButton = document.querySelector(".close-button");

function triggerResetModal(event) {
  if (
    event.type === "click" ||
    (event.type === "keydown" && event.key === "Backspace")
  ) {
    const { wins, losses, ties } = score;

    if (wins === 0 && losses === 0 && ties === 0) {
      modalMessage.innerText = "You have no score!";
      modalButtons.style.display = "none";
    } else {
      modalMessage.innerText = "Are you sure you want to reset the score?";
      modalButtons.style.display = "flex";
    }

    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
  }
}

document
  .querySelector(".reset-button")
  .addEventListener("click", (event) => triggerResetModal(event));
document.addEventListener("keydown", (event) => triggerResetModal(event));

yesButton.addEventListener("click", () => {
  resetScore();
  modal.style.display = "none";
});

noButton.addEventListener("click", () => (modal.style.display = "none"));

closeButton.addEventListener("click", () => (modal.style.display = "none"));

// keydown events
document.addEventListener("keydown", (event) => {
  if (event.key == "a") handleAutoplay();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "r") playGame("rock");
});
document.addEventListener("keydown", (event) => {
  if (event.key === "p") playGame("paper");
});
document.addEventListener("keydown", (event) => {
  if (event.key === "s") playGame("scissors");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    modal.style.display = "none";
  }
});

document.addEventListener("keydown", (event) => {
  const isModalOpen = modal.style.display === "flex";
  if (isModalOpen) {
    if (event.key === "y") {
      yesButton.click();
    } else if (event.key === "n") {
      noButton.click();
    }
  }
});
