document.addEventListener('DOMContentLoaded', startGame)

// Dynamically create board
let board = {
  cells: []
} // empty object

let gameOver = false

// sounds
let eek  = AudioFX('sounds/eek',  { formats: ['ogg', 'mp3', 'm4a'], volume: 1.0, pool: 20 });
let fanfare = AudioFX('sounds/fanfare', { formats: ['ogg', 'mp3', 'm4a'], volume: 1.0 });
let meow = AudioFX('sounds/meow', { formats: ['ogg', 'mp3', 'm4a'], volume: 0.1, pool: 20 });
let purr = AudioFX('sounds/purr', { formats: ['ogg', 'mp3', 'm4a'], volume: 0.5, pool: 20 });

function createBoard(size) {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      board.cells.push({
        row: i,
        col: j,
        isMine: (Math.random() < 0.20), // 20% chance of a mine
        isMarked: false,
        hidden: true,
        surroundingMines: 0
      }) // push object
    } // for j
  } // for i
} // createBoard

function startGame () {
  createBoard(6)
  // Count mines
  let curCell = undefined
  for (curCell in board.cells) {
    board.cells[curCell].surroundingMines = countSurroundingMines(curCell)
  } // for curCell
  // Don't remove this function call: it makes the game work!
  lib.initBoard()
  document.addEventListener('click', checkForWin)
  document.addEventListener('contextmenu', checkForWin)
} // startGame

// Define this function to look for a win condition:
//
// 1. Are all of the cells that are NOT mines visible?
// 2. Are all of the mines marked?
function checkForWin () {
  if (event.type === 'contextmenu') {
    meow.play()
  }
  if (event.type === 'click' && !(gameOver)) {
    purr.play()
  }
  let curCell = undefined
  for (curCell in board.cells) {
    if (board.cells[curCell].isMine) { // it's a mine
      if (!(board.cells[curCell].isMarked)) { // but it's not marked
        return
      } // if
    } // if
    if (board.cells[curCell].hidden) { // there's a hidden cell
      if (!(board.cells[curCell].isMine)) { // which isn't a mine
        return
      } // if
    } // if
  } // for curCell
  // You can use this function call to declare a winner (once you've
  // detected that they've won, that is!)
  fanfare.play()
  lib.displayMessage('You win!')
  gameOver = true
} // checkForWin

// Define this function to count the number of mines around the cell
// (there could be as many as 8). You don't have to get the surrounding
// cells yourself! Just use `lib.getSurroundingCells`:
//
//   var surrounding = lib.getSurroundingCells(cell.row, cell.col)
//
// It will return cell objects in an array. You should loop through
// them, counting the number of times `cell.isMine` is true.
function countSurroundingMines (cell) {
  let surroundingCells = lib.getSurroundingCells(
    board.cells[cell].row,
    board.cells[cell].col
  )
  let count = 0
  let square = undefined
  for (square in surroundingCells) {
    if (surroundingCells[square].isMine) {
      count++
    } // if
  } // for
  return count
} // countSurroundingMines

// function restartGame() {
//   // remove event listeners
//   let curCell = undefined
//   for (curCell in board.cells) {
//     removeEventListener('click', checkForWin)
//     removeEventListener('contextmenu', checkForWin)
//   }
//   let reply = confirm("Play again?")
//     if (reply) {
//       board = {
//         cells: []
//       } // object
//       document.getElementsByClassName('board')[0].innerHTML = ''
//       startGame()
//     } // if
// } // restartGame
