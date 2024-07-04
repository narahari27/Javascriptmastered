const task3Element = document.getElementById('task-3');
function greet(){
    alert ('Hi There');
}
function greetPara (userName){
alert('HI ' + userName);
}
function combine(str1 , str2 , str3){
    const combineText = `${str1} ${str2} ${str3}` ;
    return combineText;
}
greetPara('Narahari Gudagudi');

task3Element.addEventListener('click' , greet);

const combineString = combine('Hi', 'I am ' ,'Don');
alert (combineString);



