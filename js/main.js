/*---- State Variables  ----*//*
    player turns: 1/-1
    board: 2D array
        null(0) -> no player at cell / empty
        1/-1    -> player at cell
/*---- Functions        ----*//*
    Render
        board
        tokens
        turns
        available options
*/

/*---- constants        ----*/
const colours = {
    '0': 'white',
    '1': '#B8383B',
    '-1': '#5885A2'
};
const players = {
    '1': 'RED',
    '-1': 'BLU'
};
/*---- state variables  ----*/
let board; // 7x6 array
let turn; // player 1 = 1, player 2 = -1
let winner = 'T'; // null = no winner, 1 or -1 player winner, 'T' tie
/*---- cached elements  ----*/
const messageElement = document.querySelector('h1');
const playAgainButton = document.querySelector('button');
const markerElements = [... document.querySelectorAll('#markers > div')];
/*---- event listeners  ----*/
document.getElementById('markers').addEventListener('click', handleDrop);
playAgainButton.addEventListener('click', init);

/*---- functions        ----*/
init();

// Initialize state and render
function init() {
    board = [
        [0, 0, 0, 0, 0, 0], // column 0 - bottom left most start
        [0, 0, 0, 0, 0, 0], // column 1 - etc
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0] // column 6 - top right most end
    ];

    turn = goFirst();
    winner = null;
    render();
}

function goFirst(){
    let turnValue = Math.random() * 10
    let first = turnValue >= 5 ? 1 : -1;
    return first;
}

function render() {
    renderBoard();
    renderMessage();
    renderControls();
}

function renderBoard() {
    board.forEach(function(colArray, colIndex) {
        colArray.forEach(function(cellValue, rowIndex) {
            const cellId = `c${colIndex}r${rowIndex}`;
            const cellElement = document.getElementById(cellId);
            cellElement.style.backgroundColor = colours[cellValue];
            console.log(cellElement);
        })
    });
}

function renderMessage() {
    if (winner === 'T') {
        messageElement.innerHTML = `Stalemate! You're all losers`;
    } else if (winner) {
        messageElement.innerHTML = `<span class="names" style="color: ${colours[winner]}">${players[winner]}</span> Wins!`
    } else {
        messageElement.innerHTML = `<span class="names" style="color: ${colours[turn]}">${players[turn]}</span>'s Turn!`
    }
}

function renderControls() {
    // Ternary expression is when you need 1 of 2 values returned. 
    // <conditional expression> ? <truthy expression> : <falsy expression>
    playAgainButton.style.visibility = winner ? 'visible' : 'hidden';
    // Iterate over the marker elements to hide or show depending on column being filled(no 0s)
    markerElements.forEach(function(markerElement, colIndex){
        const hideMarker = !board[colIndex].includes(0) || winner;
        markerElement.style.visibility = hideMarker ? 'hidden' : 'visible';
    })
}


// --------------  Event Listening Functions

// In response to interaction, rerender everything impacted
function handleDrop(event) {
    const colIndex = markerElements.indexOf(event.target);
    // Guard against unnecessary inputs like misclick
    if (colIndex === -1) return;
    // shortcut 
    const colArray = board[colIndex];
    // find index of first 0 in column array
    const rowIndex = colArray.indexOf(0);
    // update board state with the current player's value
    colArray[rowIndex] = turn;
    // swap turns
    turn *= -1;
    winner = getWinner(colIndex, rowIndex);
    console.log(winner);
    render();
}

function getWinner(colIndex, rowIndex) {
    return checkVerticalWin(colIndex, rowIndex);
}

function checkVerticalWin(colIndex, rowIndex) {
    return countAdjacent(colIndex, rowIndex, 0, -1) === 3 ? board[colIndex][rowIndex] : null;
}

function countAdjacent(colIndex, rowIndex, colOffset, rowOffset) {
    // Shortcut variable to player value of latest token played
    const currentPlayer = board[colIndex][rowIndex];
    // Track count of adjacent cells with the same player value
    let count = 0;
    // Initialize new coordinates (index numbers)
    
    colIndex += colOffset;
    rowIndex += rowOffset;
    while (
        // Ensure indexes are within bounds of the board array
        board[colIndex] !== undefined && 
        board[colIndex][rowIndex] !== undefined &&
        board[colIndex][rowIndex] === currentPlayer
        ) {
            count ++;
            colIndex += colOffset;
            rowIndex += rowOffset;
    }
    console.log(currentPlayer);
    console.log(count);
    return count;
    
}