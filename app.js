let gameBoard = ["", "", "", "", "", "", "", "", ""]
let mySymbol = ""
let computerSymbol = ""
let myTurn = true
let gameOver = false
let movesMade = 0

const symbolPicker = document.querySelector("#select-symbol")
const pickXButton = document.querySelector("#pick-x")
const pickOButton = document.querySelector("#pick-o")
const gameBoardArea = document.querySelector("#game-board")
const cells = document.querySelectorAll(".cell")
const gameMessage = document.querySelector("#game-message")
const endButton = document.querySelector("#end-game")
const finalMessage = document.querySelector("#final-message")
const startButton = document.querySelector("#start-again")

function startGameWithSymbol(symbol) {
  mySymbol = symbol
  computerSymbol = symbol === "X" ? "O" : "X"
  myTurn = mySymbol === "X"
  symbolPicker.classList.add("hidden")
  gameBoardArea.classList.remove("hidden")
  gameMessage.classList.remove("hidden")
  gameMessage.textContent = myTurn ? "Your turn" : "Computer's turn"
  if (!myTurn) setTimeout(computerTurn, 500)
}

function checkForWinner(symbol) {
  const winningLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ]
  for (let [a, b, c] of winningLines) {
    if (gameBoard[a] === symbol && gameBoard[b] === symbol && gameBoard[c] === symbol) {
      return true
    }
  }
  return false
}

function checkForTie() {
  return !gameBoard.includes("")
}

function findSmartMove(symbol) {
  const winningLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ]
  for (let [a, b, c] of winningLines) {
    if (gameBoard[a] === symbol && gameBoard[b] === symbol && gameBoard[c] === "") return c
    if (gameBoard[a] === symbol && gameBoard[c] === symbol && gameBoard[b] === "") return b
    if (gameBoard[b] === symbol && gameBoard[c] === symbol && gameBoard[a] === "") return a
  }
  return null
}

function computerTurn() {
  if (gameOver) return

  let spot = findSmartMove(computerSymbol)
  if (spot !== null) {
    gameBoard[spot] = computerSymbol
    cells[spot].textContent = computerSymbol
    movesMade++
  } else {
    spot = findSmartMove(mySymbol)
    if (spot !== null) {
      gameBoard[spot] = computerSymbol
      cells[spot].textContent = computerSymbol
      movesMade++
    } else {
      let bestSpots = [4, 0, 2, 6, 8, 1, 3, 5, 7]
      for (let bestSpot of bestSpots) {
        if (gameBoard[bestSpot] === "") {
          gameBoard[bestSpot] = computerSymbol
          cells[bestSpot].textContent = computerSymbol
          movesMade++
          break
        }
      }
    }
  }

  endButton.classList.toggle("hidden", movesMade === 0)

  if (checkForWinner(computerSymbol)) {
    gameOver = true
    gameMessage.textContent = "Computer wins!"
    gameMessage.style.background = "red"
    return
  }
  if (checkForTie()) {
    gameOver = true
    gameMessage.textContent = "It's a tie!"
    gameMessage.style.background = "green"
    return
  }

  myTurn = true
  gameMessage.textContent = "Your turn"
}

function playMyTurn(cellIndex) {
  if (gameOver || gameBoard[cellIndex] !== "" || !myTurn) return

  gameBoard[cellIndex] = mySymbol
  cells[cellIndex].textContent = mySymbol
  movesMade++
  endButton.classList.toggle("hidden", movesMade === 0)

  if (checkForWinner(mySymbol)) {
    gameOver = true
    gameMessage.textContent = "You win!"
    gameMessage.style.background = "green"
    return
  }
  if (checkForTie()) {
    gameOver = true
    gameMessage.textContent = "It's a tie!"
    gameMessage.style.background = "green"
    return
  }

  myTurn = false
  gameMessage.textContent = "Computer's turn"
  setTimeout(computerTurn, 500)
}

function finishGame() {
  gameOver = true
  cells.forEach(cell => cell.classList.add("hidden"))
  gameMessage.classList.add("hidden")
  endButton.classList.add("hidden")
  let winnerMessage = "It's a tie! No winner this time."
  if (checkForWinner(mySymbol)) winnerMessage = "Congratulations, you win!"
  if (checkForWinner(computerSymbol)) winnerMessage = "Computer wins!"
  finalMessage.textContent = winnerMessage
  finalMessage.classList.remove("hidden")
  startButton.classList.remove("hidden")
}

function startNewGame() {
  gameBoard = ["", "", "", "", "", "", "", "", ""]
  mySymbol = ""
  computerSymbol = ""
  myTurn = true
  gameOver = false
  movesMade = 0
  cells.forEach(cell => {
    cell.textContent = ""
    cell.classList.remove("hidden")
  })
  gameMessage.classList.add("hidden")
  finalMessage.classList.add("hidden")
  startButton.classList.add("hidden")
  endButton.classList.add("hidden")
  symbolPicker.classList.remove("hidden")
}

pickXButton.addEventListener("click", () => startGameWithSymbol("X"))
pickOButton.addEventListener("click", () => startGameWithSymbol("O"))
cells.forEach((cell, index) => cell.addEventListener("click", () => playMyTurn(index)))
endButton.addEventListener("click", finishGame)
startButton.addEventListener("click", startNewGame)