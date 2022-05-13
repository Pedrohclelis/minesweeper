const boardLength = 9
const board = []
var PuttedFlags
var firstClick
var emoji = document.querySelector('.emoji')
var table = document.querySelector('table')
minesAmount = 10

////////////////////////////////////////////////////////// BUILD BOARD //////////////////////////////////////////////////////////
function setBoard(){
    //Create the initial matrix for the board, who each field has id: 0 and visible:
    for (var i=0; i<boardLength; i++){
        board[i] = []
        for (var j=0; j<boardLength; j++){
            board[i][j] = 0
        }
    }
}

function sortNumber(){
    min = Math.ceil(0);
    max = Math.floor(boardLength);
    return Math.floor(Math.random() * (max - min)) + min;
}

function setMines(minesAmount){
    var count = 0
    while (count < minesAmount){
        var mineLine = sortNumber()
        var mineColumn = sortNumber()
        for (var i=0; i<boardLength; i++){
            for (var j=0; j<boardLength; j++){
                //for each field, if his cordinates is equal to sorted mine coords, and this field isnt a mine yet, put here a mine
                if ((i == mineLine && j == mineColumn) && (board[i][j] != -1)){
                    board[mineLine][mineColumn] = -1
                    count += 1
                    setNumbersAround(mineLine, mineColumn)
                }
            }
        }
    }
}

function setNumbersAround(mineLine, mineColumn){
    //for each 9 fields around mine...
    for (var k=mineLine-1; k<=mineLine+1; k++){
        for (var l=mineColumn-1; l<=mineColumn+1; l++){
            //if exists, and isnt the original mine field, neither other mine field, set his id to +1 to sinalize the original mine
            if ( ((k >= 0) && (k < boardLength) && (l >= 0) && (l < boardLength)) && !(k == mineLine && l == mineColumn) && (board[k][l] != -1) )
                board[k][l] += 1
        }
    }
}

function cluedBoard(){
    for (var i=0; i<boardLength; i++){
        for (var j=0; j<boardLength; j++){
            if (board[i][j] == -1){
                document.querySelector('div.test').innerHTML += `[~] `
            } else{
                document.querySelector('div.test').innerHTML += `[${board[i][j]}] `
            }
        }
        document.querySelector('div.test').innerHTML += " - "
        document.querySelector('div.test').innerHTML += `[${i}]`
        document.querySelector('div.test').innerHTML += `<br>`
    }
    document.querySelector('div.test').innerHTML += `<br>`
    document.querySelector('div.test').innerHTML += `<br>`
}

function printBoard(){
    for (var i=0; i<boardLength; i++){
        //Insert a row <tr> for each line
        var row = document.querySelector('tbody').insertRow(`${i}`)
        for (var j=0; j<boardLength; j++){
            //Insert the cells <td> in respective row <tr> for each column 
            cell = row.insertCell(`${j}`)

            //Create and imaginary element <img>, without place yet.
            var img = document.createElement("img")

            //Setting default 'undiscovered' img 
            img.src = "assets/undiscovered.png"
            img.className = "undiscovered"

            //Putting the <img> inside the <td> cell
            cell.appendChild(img)
        }
    }
}

function clearBoard(){
    for (var i=0; i<boardLength*boardLength; i++){
        var td = document.querySelectorAll('tbody td')
        td[i].innerHTML = `<img src="assets/undiscovered.png" class="undiscovered" alt="undiscovered">`
    }
}

function removeBoard(){
    for (var i=0; i<boardLength; i++){
        //Insert a row <tr> for each line
        var row = document.querySelectorAll('tbody tr')
        row[0].remove()
    }
}

function showBombs(){
    for (i=0; i<boardLength; i++){
        for(j=0; j<boardLength; j++){
            if (board[i][j] == -1){
                let cell = table.rows[i].cells[j].firstChild
                setImage(cell, i, j)
            }
        }
    }
}

function clearFields(line, col){
    if (board[line][col] == 0){
        //for each 8 fields around '0'...
        for (var k=line-1; k<=line+1; k++){
            for (var l=col-1; l<=col+1; l++){
                //if exists...
                if ((k >= 0) && (k < boardLength) && (l >= 0) && (l < boardLength)){
                    cell = table.rows[k].cells[l].firstChild
                    //If isnt the original '0' field, and isnt visible yet, reveal that cell
                    if ( !(k == line && l == col) && (cell.classList.contains("undiscovered") || cell.classList.contains("flag")) ){
                        setImage(cell, k, l)
                        //Recursive for others 0 around that remain undiscovered yet
                        clearFields(k, l)
                    }
                }
            }
        }
    }
}

function setImage(element, line, col){
    if (line != undefined && col != undefined){
        element.className = "number" + board[line][col]
        element.src = `assets/${board[line][col]}.png`
        element.alt = `number ${board[line][col]}`
    }
}

/////////////////////////////////////////////////////////// EXECUTION ///////////////////////////////////////////////////////////
const endGame = {
    win(){
        var undiscoveredCells = document.querySelectorAll('.undiscovered, .flag')
        if (undiscoveredCells.length === minesAmount){
            endGame.stopFunctions()
            window.alert('You win')
            emoji.src = "assets/win.png"
        }
    },
    lose(loserCell){
        endGame.stopFunctions()
        window.alert('You lose')
        loserCell.src = "assets/mine-red.png"
        loserCell.alt = "mine-red"
        emoji.src = "assets/dead.png"
    },
    stopFunctions(){
        showBombs()
        table.onclick = undefined
        table.oncontextmenu = (event) => {event.preventDefault()}
        table.onmouseup = undefined
        table.onmousedown = undefined
    }
}

function flagField(event){
    //Remove default menu at right click
    event.preventDefault()

    cell = event.target
    line = cell.parentNode.parentNode.rowIndex;
    col = cell.parentNode.cellIndex;
  
    if (cell.classList.contains("undiscovered")){
        cell.className = "flag"
        cell.src = "assets/flag.png"
        cell.alt = "flag"
    } else if (cell.classList.contains("flag")){
        cell.className = "undiscovered"
        cell.src = "assets/undiscovered.png"
        cell.alt = "undiscovered"
    }
}

function revealField(event){
    cell = event.target
    line = cell.parentNode.parentNode.rowIndex;
    col = cell.parentNode.cellIndex;
    if (line != undefined && col != undefined){
        console.log(`Line: ${line} - Column: ${col} - Alt: ${cell.alt} - Src: ${cell.src} - Classes: ${cell.classList}`)
    } else{
        return false
    }
    //Execute only when the field hasnt a flag in it
    if (cell.classList.contains("flag") == false){
        //Change 'undiscovered' img to his related id, based on 'board' matrix
        setImage(cell, line, col)
        
        //Special cases for id=0 or id=1
        switch (board[line][col]){
            case -1:
                endGame.lose(cell)
                break
            case 0:
                clearFields(line, col)
                break
        }
    }
    endGame.win()
}

function initGame(){
    emoji.src = "assets/happy.png"
    table.onclick = revealField
    table.oncontextmenu = flagField
    emoji.onclick = () => {removeBoard(); initGame()}
    
    //Personalized :hover and :active mechanism
    var down = false;
    table.onmousedown = function(event){
        down = true;
        var cell = event.target
        cell.classList.add("pressioned")
        emoji.src = "assets/surprise.png"
    }
    table.onmousemove = function(event){
        if(down){
            var cell = event.target
            cell.classList.add("pressioned")
            emoji.src = "assets/surprise.png"
        }
    }
    table.onmouseup = function(event){
        emoji.src = "assets/happy.png"
        down = false;
    }
    table.onmouseover = function(event){
        var cell = event.target
        cell.classList.add("hover")
    }
    table.onmouseout = function(event){
        var cell = event.target
        cell.classList.remove("hover")
        cell.classList.remove("pressioned")
    }
    
    //Start functions
    setBoard()
    setMines(minesAmount)
    printBoard()
}


initGame()