const board = []
var PuttedFlags
var firstClick
var emoji = document.querySelector('.emoji')
var table = document.querySelector('table')

////////////////////////////////////////////////////////// BUILD BOARD //////////////////////////////////////////////////////////
function setBoard(){
    //Create the initial matrix for the board, who each field has id: 0 and visible:
    for (var i=0; i<boardLines; i++){
        board[i] = []
        for (var j=0; j<boardColumns; j++){
            board[i][j] = 0
        }
    }
}

function sortNumber(max){
    min = Math.ceil(0);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function setMines(minesAmount){
    var count = 0
    while (count < minesAmount){
        var mineLine = sortNumber(boardLines)
        var mineColumn = sortNumber(boardColumns)
        for (var i=0; i<boardLines; i++){
            for (var j=0; j<boardColumns; j++){
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

function setRemovedMine(removedLine, removedCol){
    while (true){
        var mineLine = sortNumber(boardLines)
        var mineColumn = sortNumber(boardColumns)
        //Just if isnt the original coords from removed mine
        if (mineLine != removedLine && mineColumn != removedCol){
            for (var i=0; i<boardLines; i++){
                for (var j=0; j<boardColumns; j++){
                    //for each field, if his cordinates is equal to sorted mine coords, and this field isnt a mine yet, put here a mine
                    if ((i == mineLine && j == mineColumn) && (board[i][j] != -1)){
                        board[mineLine][mineColumn] = -1
                        setNumbersAround(mineLine, mineColumn)
                        console.log(`mine putted in ${mineLine} ${mineColumn}`)
                        return
                    }
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
            if ( ((k >= 0) && (k < boardLines) && (l >= 0) && (l < boardColumns)) && !(k == mineLine && l == mineColumn) && (board[k][l] != -1) )
                board[k][l] += 1
        }
    }
}

function removeNumbersAround(mineLine, mineColumn){
    //for each 9 fields around removed mine...
    for (var k=mineLine-1; k<=mineLine+1; k++){
        for (var l=mineColumn-1; l<=mineColumn+1; l++){
            //if exists, and isnt the original removed mine field
            if (((k >= 0) && (k < boardLines) && (l >= 0) && (l < boardColumns)) && !(k == mineLine && l == mineColumn) ){
                //If its a number, down his id's in -1
                if (board[k][l] != -1){
                    board[k][l] -= 1
                }
                //If its a mine either, put +1 in original '0 removed mine'
                else if (board[k][l] == -1){
                    board[mineLine][mineColumn] += 1
                }
            }
        }
    }
}

function printBoard(){
    for (var i=0; i<boardLines; i++){
        //Insert a row <tr> for each line
        var row = document.querySelector('tbody').insertRow(`${i}`)
        for (var j=0; j<boardColumns; j++){
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
    for (var i=0; i<boardLines*boardColumns; i++){
        var td = document.querySelectorAll('tbody td')
        td[i].innerHTML = `<img src="assets/undiscovered.png" class="undiscovered" alt="undiscovered">`
    }
}

function removeBoard(){
    for (var i=0; i<boardLines; i++){
        //Insert a row <tr> for each line
        var row = document.querySelectorAll('tbody tr')
        row[0].remove()
    }
}

function showBombs(){
    for (i=0; i<boardLines; i++){
        for(j=0; j<boardColumns; j++){
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
                if ((k >= 0) && (k < boardLines) && (l >= 0) && (l < boardColumns)){
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
        element.className = "num" + board[line][col]
        element.src = `assets/${board[line][col]}.png`
        element.alt = `num ${board[line][col]}`
    }
}

/////////////////////////////////////////////////////////// EXECUTION ///////////////////////////////////////////////////////////
const endGame = {
    win(){
        var undiscoveredCells = document.querySelectorAll('.undiscovered, .flag')
        if (undiscoveredCells.length === minesAmount){
            endGame.stopFunctions()
            
            emoji.src = "assets/win.png"
            var audio = new Audio('sounds/win.mp3');
            audio.play();
        }
    },
    lose(loserCell){
        endGame.stopFunctions()
        
        loserCell.src = "assets/mine-red.png"
        loserCell.alt = "mine-red"
        emoji.src = "assets/dead.png"
        var audio = new Audio('sounds/lose.mp3');
        audio.play();
    },
    stopFunctions(){
        showBombs()
        clearInterval(timerInterval)
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
        PuttedFlags++
    } else if (cell.classList.contains("flag")){
        cell.className = "undiscovered"
        cell.src = "assets/undiscovered.png"
        cell.alt = "undiscovered"
        PuttedFlags--
    }

    var minecounter = document.querySelector('.mine-counter')
    if (minesAmount-PuttedFlags <= -10){
        minecounter.innerHTML = `${minesAmount-PuttedFlags}`
    } else if (minesAmount-PuttedFlags <= -1){
        minecounter.innerHTML = `0${minesAmount-PuttedFlags}`
    } else if (minesAmount-PuttedFlags <= 9){
        minecounter.innerHTML = `00${minesAmount-PuttedFlags}`
    } else if (minesAmount-PuttedFlags <= 99){
        minecounter.innerHTML = `0${minesAmount-PuttedFlags}`
    } else {
        minecounter.innerHTML = minesAmount-PuttedFlags;
    }

    var audio = new Audio('sounds/flag.mp3');
    audio.play();
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
                if (firstClick == true){
                    //Prevent to lose game in first click, move the bomb to other random location
                    moveMine(line, col)
                    setImage(cell, line, col)
                    clearFields(line, col)
                    return
                } else{
                    endGame.lose(cell)
                    break
                }
            case 0:
                clearFields(line, col)
                break
        }
        firstClick = false
    }
    var audio = new Audio('sounds/click.mp3');
    audio.play();
    endGame.win()
}

function moveMine(line, col){
    //Set new field inicial id to 0
    board[line][col] = 0
    //Downing -1 the fields around him, and +1 his id for every mine nearby
    removeNumbersAround(line, col)
    console.log(board)
    //Now, putting the removed mine in other place, diferent that the original
    setRemovedMine(line, col)
    console.log(board)
}

function initGame(){
    table.onclick = revealField
    table.oncontextmenu = flagField
    emoji.src = "assets/happy.png"
    var audio = new Audio('sounds/extra.mp3');
    emoji.onclick = () => {removeBoard(); initGame(); audio.play()}
    
    clearInterval(timerInterval)
    emoji.oncontextmenu = (event) => {event.preventDefault()}
    timerInterval = setInterval(incrementSeconds, 1000);
    firstClick = true

    diff = document.querySelector('.difficulty')
    switch (diff.value){
        case 'easy':
            boardLines = 9
            boardColumns = 9
            minesAmount = 10
            document.body.style.zoom = "115%"
            break
        case 'intermediary':
            boardLines = 16
            boardColumns = 16
            minesAmount = 40
            document.body.style.zoom = "80%"
            break
        case 'hard':
            boardLines = 16
            boardColumns = 30
            minesAmount = 99
            document.body.style.zoom = "80%"
            break
        case 'custom':
            console.log('custom')
        break
    }

    //HUD Counters
    var minecounter = document.querySelector('.mine-counter')
    PuttedFlags = 0
    minecounter.innerHTML = `0${minesAmount-PuttedFlags}`
    seconds = 0
    timer.innerHTML = '000'
    
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
    console.log(board)
    
}

//timer HUD
timerInterval = setInterval(incrementSeconds, 1000);
timer = document.querySelector('.timer')
var seconds = 0;
function incrementSeconds() {
    seconds += 1;
    if (seconds < 10){
        timer.innerHTML = '00' + seconds;
    } else if (seconds < 100){
        timer.innerHTML = '0' + seconds;
    } else {
        timer.innerHTML = seconds;
    }
}

initGame()
diff = document.querySelector('.difficulty')
diff.onchange = () => {removeBoard(); initGame()}
document.querySelector('audio').volume = 0.5