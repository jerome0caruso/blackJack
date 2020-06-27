const hitButton = document.getElementById('btn-hit');
const dealButton = document.getElementById('btn-deal');
const standButton = document.getElementById('btn-stand');
const hitSound = new Audio('sounds/swish.m4a');
const bustSound = new Audio('sounds/aww.mp3');
const winSound = new Audio('sounds/cash.mp3');


const blackjackGame = {
    person: {scoreSpan: '#person-result', div: '#person-box', score: 0},
    dealer: {scoreSpan: '#dealer-result', div: '#dealer-box', score: 0},
    cards: [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"],
    cardsMap : {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': [1, 11 ]},
    wins: 0,
    losses: 0,
    draws: 0,
    isStand: false,
    turnsOver: false,
    hasStarted: false
};

const YOU = blackjackGame.person;
const DEALER = blackjackGame.dealer;

function hit() {
    if(blackjackGame.isStand === false) {
        blackjackGame.hasStarted = true;
        blackjackGame.turnsOver = false;
        let card = randomCard();
        showCard(YOU, card);
        updateScore(card, YOU);
        showScore(YOU);
    } 
}

function showCard(activePlayer, card) {
    if(activePlayer.score <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `images/${card}.png`;
        document.querySelector(activePlayer.div).appendChild(cardImage);
        hitSound.play();
    } 
}
function randomCard() {
   let randomIndex = Math.floor(Math.random() * 13);
   return blackjackGame.cards[randomIndex];
}

function deal() {
    if(blackjackGame.turnsOver === true) {
        blackjackGame.isStand = false;
         //removes the all the cards with loop
        let personImages = document.querySelector(YOU.div).querySelectorAll('img');
        personImages.forEach(pic => pic.remove()); // personImages[0].remove(); Good idea for 1 image at a time
        let dealerImages = document.querySelector(DEALER.div).querySelectorAll('img');
        dealerImages.forEach(pic => pic.remove());
        resetScores();
        document.getElementById('bj-result').style.color = 'white';
        document.getElementById('bj-result').textContent = 'Let\'s Play';
        
        //blackjackGame.turnsOver = true;
    }
   
}

function resetScores() {
    YOU.score = 0;
    DEALER.score = 0;
    document.querySelector(YOU.scoreSpan).textContent = 0;
    document.querySelector(DEALER.scoreSpan).textContent = 0;
    document.querySelector(YOU.scoreSpan).style.color = 'white';
    document.querySelector(DEALER.scoreSpan).style.color = 'white';
}

function updateScore(card, activePlayer) {
    if(card === 'A'){
        if (activePlayer.score + blackjackGame.cardsMap.A[1] <= 21) {
            activePlayer.score += blackjackGame.cardsMap.A[1];
        } else {
            activePlayer.score += blackjackGame.cardsMap.A[0];
        }
    } else {
        activePlayer.score += blackjackGame.cardsMap[card];
    }
    
}
function showScore(activePlayer) {
    
    if(activePlayer.score > 21) {
            document.querySelector(activePlayer.scoreSpan).textContent = "Bust!";
            document.querySelector(activePlayer.scoreSpan).style.color = 'red';
            bustSound.play();
            let winner = computeWinner();
            showResult(winner);
            

    } else {
        document.querySelector(activePlayer.scoreSpan).textContent = activePlayer.score;
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function dealDealer() {
    if (blackjackGame.hasStarted === true){
        blackjackGame.isStand = true;
        while (DEALER.score < 17 && blackjackGame.isStand === true){
        let card = randomCard();
        showCard(DEALER, card);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);
        }
        
        if(DEALER.score > 16) {
            blackjackGame.turnsOver = true;
            let winner = computeWinner();
            showResult(winner);
        }
        
    }
    
}
function computeWinner() {
    let winner;
    blackjackGame.hasStarted = false;
    if(YOU.score <=21) {
        if(YOU.score > DEALER.score || DEALER.score > 21) {
            blackjackGame.wins++;
            winner = YOU;
        } else if(YOU.score < DEALER.score) {   
            blackjackGame.losses++;
            winner = DEALER;
        } else if (YOU.score === DEALER.score) {
            blackjackGame.draws++;
        }
    } else if (YOU.score > 21){
        blackjackGame.losses++;
        winner = DEALER;
    } else if (YOU.score > 21 && DEALER.score <= 21) {
        blackjackGame.losses++;
        winner = DEALER;
    } else if(YOU.score > 21 && DEALER.score > 21) {
        blackjackGame.draws++;
    }
    console.log(winner);
    blackjackGame.turnsOver = true;
    return winner;
}
function showResult(winner){
    let message, messageColor;
    if(blackjackGame.turnsOver === true) {
        if (winner === YOU) {
            document.getElementById("wins").textContent = blackjackGame.wins;
            winSound.play();
            message = 'You Won!!';
            messageColor = 'green';
        } else if (winner === DEALER) {
            document.getElementById("losses").textContent = blackjackGame.losses;
            winSound.play();
            message = 'Dealer Won!!!';
            messageColor = 'green';
        } else {
            document.getElementById("draw").textContent = blackjackGame.draws;
            bustSound.play();
            message = 'You drew!';
            messageColor = 'black';
        }
        document.getElementById('bj-result').textContent = message;
        document.getElementById('bj-result').style.color = messageColor;
    }

}
dealButton.addEventListener("click", deal);
hitButton.addEventListener("click", hit);
standButton.addEventListener("click", dealDealer)



// fix Ace logic
// fix stand button becoming dealers hit button

