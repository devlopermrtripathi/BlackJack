
let numberOfMatch = 0;

function refresh() {
    location.reload();

}

function getBotValue() {
    return Math.floor(Math.random() * 3);
}

function getBotSelectedValue(botNumericSelection) {
    return ["rock", "scissor", "paper"][botNumericSelection]
}

function getResult(HumanSelection, BotSelection) {

    console.log("human", HumanSelection);
    console.log("Bot", BotSelection);
    let DatabaseImage = {
        "rock": { "rock": 0.5, "paper": 1, "scissor": 0 },
        "paper": { "paper": 0.5, "rock": 0, "scissor": 1 },
        "scissor": { "scissor": 0.5, "rock": 1, "paper": 0 }
    }

    return [DatabaseImage[HumanSelection][BotSelection], DatabaseImage[BotSelection][HumanSelection]];
}

function getmessage([humanSelection1, botSelection1]) {
    if (botSelection1 === 0) {
        return { "message": "You Lost", "color": "red" }
    }
    else if (botSelection1 === 0.5) {
        return { "message": "Tie", "color": "yello" }
    }
    else {
        return { "message": "You Won", "color": "green" }
    }
}

let blackJackBoard = {
    "YOU": { "board": "#you-in-table", "player": "#bj-you-score", score: 0 },
    "DEALER": { "board": "#dealer-in-table", "player": "#bj-dealer-score", score: 0 },
    "card": [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"],
    "cardvalue": { 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, J: 10, K: 10, Q: 10, A: [1, 11] },
    "score" : { "win" :0 , "loss" :0 ,"draw" :0},
}

let You         = blackJackBoard["YOU"];
let DEALER      = blackJackBoard["DEALER"];
let finalScore  = blackJackBoard["score"];
let isStand     = false;
let ishit       = false;

let swish   = new Audio("./sounds/swish.m4a");
let cash    = new Audio("./sounds/cash.mp3");
let aww     = new Audio("./sounds/aww.mp3");


document.querySelector("#btn-hit").addEventListener("click", BackJackHit);
document.querySelector("#btn-stand").addEventListener("click", BackJackDealer);
document.querySelector("#btn-deal").addEventListener("click", ResetTable);

function randomCard() {
    return Math.floor(Math.random() * 13);
}

function generateTotalScore(value, indicator) {
    if (indicator === "YOU") {
        You.score += value;
    }
    else {
        DEALER.score += value;
    }
}


function BackJackHit() {
    if (isStand === false)
    {
        ishit = true;
        AddCard(You, "YOU");
    }

}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

async function BackJackDealer() {
    if (ishit === true) {
        isStand = true;

        while (DEALER.score <= 15) {
            AddCard(DEALER, "DEALER");
            await sleep(1000);
        }
        Winner();
    }
}


function updateScore(activePlayerScore) {
    document.querySelector(activePlayerScore.player).textContent = activePlayerScore.score;
}

function Bust(totalScore) {
    if (totalScore.score > 21) {
        document.querySelector(totalScore.player).textContent = "BUST!";
        document.querySelector(totalScore.player).style.color = "red";
    }
}


function Winner() {
            if (You.score <= 21 && DEALER.score > 21) {
                document.querySelector("#bj-play").textContent = "You Won!";
                finalScore.win++
                document.querySelector("#win").textContent = finalScore.win;
                cash.play();

            }
            else if (You.score > 21 && DEALER.score > 21) {
                document.querySelector("#bj-play").textContent = "TIE!";
                finalScore.draw++;
                document.querySelector("#draw").textContent = finalScore.draw;
            }
            else if ((You.score > DEALER.score) && You.score <=21 ) {
                document.querySelector("#bj-play").textContent = "You Won!";
                (finalScore.win)++;
                document.querySelector("#win").textContent = finalScore.win;
                cash.play();
            }
            else if (You.score === DEALER.score){
                document.querySelector("#bj-play").textContent = "TIE!";
                finalScore.draw++;
                document.querySelector("#draw").textContent = finalScore.draw;
            }
            else{
                document.querySelector("#bj-play").textContent = "You LOST!";
                finalScore.loss++;
                document.querySelector("#loss").textContent = finalScore.loss;
                aww.play();
            }
}

function AddCard(activePlayer, indicator) {
    if (activePlayer.score <= 21) {
        let cardNumber;
        let selectedCard = blackJackBoard["card"][randomCard()];
        if (selectedCard === "A") {
            if (activePlayer.score < 15) {
                cardNumber = blackJackBoard["cardvalue"][selectedCard][1];
            }
            else {
                cardNumber = blackJackBoard["cardvalue"][selectedCard][0];
            }
        }
        else {
            cardNumber = blackJackBoard["cardvalue"][selectedCard];
        }

        generateTotalScore(cardNumber, indicator);
        console.log("total Score", activePlayer.score)
        let card = document.createElement("img");
        card.setAttribute("class","card-image")
        document.querySelector(activePlayer.board).appendChild(card).src = `./image/${selectedCard}.png`;
        updateScore(activePlayer);
        Bust(activePlayer);
        swish.play();
    }
}

function ResetTable()
{

    let YouSide = document.querySelectorAll(".card-image");
    for (i=0 ; i<YouSide.length;i++){
        document.querySelector(".card-image").remove();
    }

    You.score = 0;
    DEALER.score = 0;
    document.querySelector(You.player).textContent = 0;
    document.querySelector(DEALER.player).textContent = 0;
    document.querySelector(You.player).style.color ="white";
    document.querySelector(DEALER.player).style.color ="white";
    document.querySelector("#bj-play").textContent = "Lets Play";
    isStand = false;
    ishit = false;
}
