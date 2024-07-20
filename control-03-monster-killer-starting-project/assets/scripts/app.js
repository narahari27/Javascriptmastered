const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE=14;
const HEAL_VALUE=20;

const MODE_ATTACK = 'ATTACK'; //MODE_ATTACK = 0
const MODE_STRONG_ATTACK = 'STRONG_ATTACK'; //MODE_STRONG_ATTACK =1
const LOG_EVENT_PLAYER_ATTACK ='PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK ='PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL ='PLAYER_HEAL';
const LOG_GAME_OVER ='GAME_OVER';



const enteredValue = prompt('Maximum Life for you and the Monster','100')
let chosenMaxLife = parseInt(enteredValue);
let battleLog =[];
if(isNaN(chosenMaxLife) || chosenMaxLife <=0){
    chosenMaxLife =100;
}
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;


adjustHealthBars(chosenMaxLife);

function writeToLog(event){
if(event === LOG_EVENT_PLAYER_ATTACK){

}
}

function reset(){
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound(){
    let initialPlayerHealth = currentPlayerHealth; 
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -=playerDamage;
    if(currentPlayerHealth<=0 && hasBonusLife){
        hasBonusLife =false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert('Lucky you have a bonus life! so you are still alive fucker');
    }
    if (currentMonsterHealth<=0 && currentPlayerHealth > 0){
        alert('you won ');
    }else if (currentPlayerHealth<=0 && currentMonsterHealth > 0){
        alert('you lost');
    }else if(currentPlayerHealth<=0 && currentMonsterHealth <=0){
        alert('its a Draw!!');
    }
    if(currentMonsterHealth<=0 || currentPlayerHealth<=0){
        reset(chosenMaxLife);
    }
}

function attackMonster(mode){
    let maxDamage;
    if(mode=== MODE_ATTACK){
        maxDamage = ATTACK_VALUE;
    }else if (mode ===  MODE_STRONG_ATTACK){
        maxDamage =STRONG_ATTACK_VALUE;
    }
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    endRound();
}

function attackHandler(){
    attackMonster(MODE_ATTACK)
}

function strongAttackHandler(){
    attackMonster(MODE_STRONG_ATTACK)
}
function healPlayerHandler(){
let healValue;
if(currentPlayerHealth>= chosenMaxLife - HEAL_VALUE){
    alert("You cant add more health than initial health");
    healValue = chosenMaxLife - currentPlayerHealth;
}else{
    healValue = HEAL_VALUE;
}
increasePlayerHealth(healValue);
currentPlayerHealth +=healValue;
endRound();
}
attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);