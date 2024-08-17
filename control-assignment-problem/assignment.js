const randomNumber = Math.random(); // produces random number between 0 (including) and 1 (excluding)

if(randomNumber > 0.7){
    alert('This number is greater than 0.7');
}else{
    alert('No it is not greatre than 0.7');
} 

const numbers = [0, 1, 2, 3, 4, 5, 6];

for(let i=0;i<6;i++){
console.log(numbers[i]);
}
for(const num of numbers){
    console.log(num);
}
let counter  = 0;
while(counter < numbers.length){
    console.log(numbers[counter]);
    counter++
}
for(let i=numbers.length-1;i>=0;i--){
    console.log(numbers[i]);
    }

    const randomNumber2 = Math.random();
    console.log(randomNumber);
    console.log(randomNumber2);

    if((randomNumber > 0.7 && randomNumber2 > 0.7) || randomNumber < 0.2 || randomNumber2 < 0.2){
        alert('Condition one greter than 0.7 or smaller than 0.2')
    }