const startGameBtn = document.getElementById('start-game-btn'); 

const ROCK = 'ROCK';
const PAPER = 'PAPER';
const SCISSORS = 'SCISSORS';
const DEFAULT_USER_CHOICE = ROCK;
const RESULT_DRAW = 'DRAW';
const RESULT_PLAYER_WINS = 'PLAYER_WINS';
const RESULT_COMPUTER_WINS = 'COMPUTER_WINS';

const getPlayerChoice = function() {
  const selection = prompt(`${ROCK}, ${PAPER} or ${SCISSORS}?`, '').toUpperCase();
  if (
    selection !== ROCK &&
    selection !== PAPER &&
    selection !== SCISSORS
  ) {
    alert(`Invalid choice! We chose ${DEFAULT_USER_CHOICE} for you!`);
    return DEFAULT_USER_CHOICE;
  }
  return selection;
};
const getComputerChoice = function(){
  const randomValue = Math.random();
  if (randomValue <0.34){
    return ROCK;
  }else if(randomValue < 0.67){
    return PAPER;
  }else{
    return SCISSORS;
  }
  };
  
  const getWinner = function(cChoice, pChoice){
  if(cChoice === pChoice){
    return RESULT_DRAW;
  }else if (cChoice === ROCK && pChoice === PAPER || 
    cChoice === PAPER && pChoice === SCISSORS|| 
    cChoice === SCISSORS && pChoice === ROCK)
  {
    return RESULT_PLAYER_WINS;
  }else{
   return RESULT_COMPUTER_WINS;
  
  }
}
startGameBtn.addEventListener('click', function() {
  console.log('Game is starting...');
  const playerSelection = getPlayerChoice();
  console.log(playerSelection);
  const computerChoice = getComputerChoice();
  const winner = getWinner(computerChoice, playerSelection);
  console.log(winner);
});


// const sumUp = (numbers) => {
//   let sum = 0;
//   for (const num of numbers){
//     sum += num;
//   } 
//   return sum;
// };
// console.log(sumup(1 , 3, 10, -6 , 8));