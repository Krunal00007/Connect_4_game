//Start-game
const strat_btn = document.querySelector(".start-game")
const cover_game = document.querySelector(".cover-game")
const container = document.querySelector(".container")

strat_btn.addEventListener("click", ()=>{
    cover_game.classList.add("active")
    container.classList.remove("active")
})

//popup baner
const winning_bg = document.querySelector(".winning-bg")
const winning_box = document.querySelector(".winning-box")
const winer_name = document.querySelector(".winer-name")
const restart = document.querySelector(".restart")

restart.addEventListener("click",()=>{
    location.reload()
})

//container
const form = document.querySelector(".form")
const gbody = document.querySelector(".game-body")

const fname = document.querySelector(".fname")
const fcol = document.querySelector(".fcol")
const sname = document.querySelector(".sname")
const scol = document.querySelector(".scol")

form.addEventListener("submit",(e)=>{
    e.preventDefault()
    formcall()
    sendcol()
})
//send color to css
let r = document.querySelector(":root")

function sendcol(){
    r.style.setProperty("--fcolor",fcol.value)
    r.style.setProperty("--scolor",scol.value)
}

const formcall = ()=>{
    let fplayer = document.querySelector(".fplayer")
    let splayer = document.querySelector(".splayer")
    let col_1 = document.querySelector(".col1")
    let col_2 = document.querySelector(".col2")

    let player1 = fname.value
    let player2 = sname.value
    let col1 = fcol.value
    let col2 = scol.value

    if(player1.length>0 && player2.length>0 && col1 != "#000000" && col2 != "#000000" && col1 != col2){
        form.classList.add("active")
        gbody.classList.remove("active")
    }else{
        alert("Error")
    }

    fplayer.innerText = player1
    splayer.innerText = player2
    col_1.style.background = col1
    col_2.style.background = col2

    playerc.innerText = `${player1}'s turn`
}

//connect-4
const playerc = document.querySelector(".playerc")
const connect_4 = document.querySelector(".connect-4")
const cells = document.querySelectorAll(".cell")

let player1 = 1;
let player2 = 2;
let playerturn = player1

let hovercolum = -1

let animate = false

const coins =
[
    0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,
    0,0,0,0,0,0,0
]

cells.forEach((cell,index)=>{
    cell.onmouseenter =()=>{
        // console.log(index % 7)
        onmousehoverincell(index % 7)
    }

    cell.onclick = ()=>{
        if(!animate){
            onmouseclickincell(index % 7)
        }
    }
})

function playwon(playerturn,coins){

    for(let index = 0 ;index < cells.length ; index++){
        //horizontal
        if(index % 7 < 4 && coins[index] === playerturn && 
            coins[index + 1] === playerturn && 
            coins[index + 2] === playerturn && 
            coins[index + 3] === playerturn ){
            return true
        }
        //vertical
        if(index < 21 && coins[index + 7] === playerturn && 
            coins[index + 14] === playerturn && 
            coins[index + 21] === playerturn && 
            coins[index + 28] === playerturn ){
            return true
        }
        //diagonal
        if(index < 21 && coins[index + 6] === playerturn && 
            coins[index + 12] === playerturn && 
            coins[index + 18] === playerturn && 
            coins[index + 24] === playerturn ){
            return true
        }
        //anti-diagonal
        if(index < 18 && coins[index + 8] === playerturn && 
            coins[index + 16] === playerturn && 
            coins[index + 24] === playerturn && 
            coins[index + 32] === playerturn ){
            return true
        }
    }

    return false
}

function onmouseclickincell(column){
    const row = coins.filter((_,index)=> index % 7 === column).lastIndexOf(0)

    if(row === -1){
        return
    }

    coins[(row * 7) + column] = playerturn

    let cell = connect_4.children[(row * 7) + column]
    let coin = document.createElement("div")
    coin.className="coin"
    coin.dataset.placed = true
    coin.dataset.player = playerturn
    cell.appendChild(coin)

    let removecoins = document.querySelector("[data-placed='false']")
    let formy = removecoins.getBoundingClientRect().y
    let formx = coin.getBoundingClientRect().y
    let getxy = formy - formx

    animate = true
    removecoin()

    let animating = coin.animate(
        [
            {transform:`translateY(${getxy}px)`,offset : 0},
            {transform:`translateY(0px)`,offset : 0.6},
            {transform:`translateY(${getxy / 20}px)`,offset : 0.8},
            {transform:`translateY(0px)`,offset : 0.95}
        ],
        {
            duration : 400,
            easing: "Linear",
            iterations : 1,
        }
    )

    animating.addEventListener("finish",gameresultwinordraw)
    
}

function gameresultwinordraw(){
    if(!coins.includes(0)){
        winning_bg.classList.remove("active")
        winer_name.innerText = "Game is Draw"
    }
    
    if(playwon(playerturn,coins)){
        winning_bg.classList.remove("active")
        winer_name.innerText = `\n ${playerturn === player1 ? fname.value : sname.value } Winer`
    }

    animate = false

    if(playerturn === player1){
        playerturn = player2
        playerc.innerText = `${sname.value}'s turn`
    }else{
        playerturn = player1
        playerc.innerText = `${fname.value}'s turn`
    }
    hoverupdate()
}

function hoverupdate(){
    removecoin()

    if(coins[hovercolum] === 0){
        let cell = connect_4.children[hovercolum]
        let coin = document.createElement("div")
        coin.className="coin"
        coin.dataset.placed = false
        coin.dataset.player = playerturn
        cell.appendChild(coin)
    }
}

function onmousehoverincell(column){
    hovercolum = column
    hoverupdate()
}

function removecoin(){
    let removecoins = document.querySelector("[data-placed='false']")

    if(removecoins){
        removecoins.parentElement.removeChild(removecoins)
    }
}