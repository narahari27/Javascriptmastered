// const student = {
//     fullName: 'Rahul Kumar',
//     age: 20,
//     CGPA:8.5,
//     isPass:true,
// };

// console.log(student.age);

// // ternary operator
// let age = 15;
//  let result = age > 18 ? "adult":"not an adult";
// //  console.log(result);
// let number = prompt('please enter a number of ur wish');

// if (number % 5 === 0){
//     console.log( number, ' is a multiple of 5');
// }else{
//     console.log( number, 'not a multiple');
// }

// let marks = prompt('Enter students marks');
// if(marks >= 80){
//     console.log(marks, 'You got A grade');
// }else if( marks >=70 && marks <=79){
//     console.log(marks, 'You got B grade');
// }else if( marks >=60 && marks <=69){
//     console.log(marks, 'You got c grade');
// }else if( marks >=50 && marks <=59){
//     console.log(marks, 'You got d grade');
// }else{
//     console.log(marks, 'You Failed');
// }

// for (i=1;i<=5;i++){
//     console.log('Hey There');
// };

// let sum = 0;
// let n =1000;
// for (i=1;i<=n;i++){
//     sum = sum + i;
// }
// console.log('sum =', sum);

// let numbers = 0;
// for (i =1;i<=100;i++){
//     if(i % 2 === 0){
//         console.log('This is Even', i)
//     }else{
//         console.log('odd')
//     }
// // }
// let gameNum = 6;
// let userNum = prompt("Guess the correct game Number:");
// while(userNum!= gameNum ){
//     userNum =prompt('you number is wrong!! Guess again?')
// }
// console.log('Congratulations You Won!!')

// str = "Random college";
// console.log(str.length);

// let obj ={
//     name:'Honda',
//     type:'Diesel',
//     price:50000
// }
// console.log('The car name is' ,obj.name,'And type is',obj.type);
// console.log(`The car name is ${obj.name} and type is ${obj.type}`);
// let str = "This is my kingdon"
// let newStr = str.toUpperCase();
// console.log(newStr);

// let heroes = ["ironman","superman","spiderman","krissh"];
// // for(let idx =0; idx<heroes.length; idx++){
// //     console.log(heroes[idx]);
// // }

// for(let hero of heroes){
//     console.log(hero.toUpperCase());
// }

// let marks = [85,97,44,37,76,60];
// let sum = 0;
// for(let value of marks){
//     sum += value;
// }
// let avg = sum/marks.length;
// console.log(`let avg marks of all students be ${avg}`)

// let items =[250,645,300,900,50];
// let idx=0;
// for (let val of items){
//     console.log(`Value at index ${idx} = ${val}`);
//     let offer = val/10;
//     items[idx] = items[idx] - offer;
//     console.log(`value after offer is ${items[idx]}`)
//     idx++
// }
// for(i=0;i<items.length;i++){
//     offer = items[i]/10;
//     items[i]-=offer;
// }
// console.log(items);

// items.toString();
// let companies = ["bloomerg","Microsoft" , 'google', "linkedin"];
// // console.log(companies);
// companies.shift();
// companies.splice(2,1,'ola');
// companies.push('amazon');
// function countVowels(str) {
//   let count = 0;
//   for (const char of str) {
//     if (
//       char === "a" ||
//       char === "e" ||
//       char === "i" ||
//       char === "o" ||
//       char === "u"
//     ) {
//       count++;
//     }
//   }
//   console.log(count);
// }
 
// const countVow =(str)=>{
//   let count = 0;
//   for (const char of str) {
//     if (
//       char === "a" ||
//       char === "e" ||
//       char === "i" ||
//       char === "o" ||
//       char === "u"
//     ) {
//       count++;
//     }
//   }
//   console.log(count);
// }

// let nums = [1,2,3,4,5,6,7,8,9];
 
//  let evenArr = nums.filter((val) =>{
//   return val%2 === 0;
// })

// console.log(evenArr);

// nums.map((val) =>{
//   console.log(val);
// });

// nums.forEach((num) =>{
//   console.log(num*num);
// });

// let arr = [1,2,3,4,5,6,99,102];

// const output = arr.reduce((prev,curr) =>{
//   return prev>curr ? prev : curr;
// });
// console.log(output);
// let div = document.querySelector("div");
// console.dir(div);
// let h2 = document.querySelector("h2");
// console.dir(h2.innerText);
// h2.innerText = h2.innerText + " from Apna College Students";

// let divs = document.querySelectorAll(".box");
// // divs[0].innerText = "new Unique valye"
// // divs[1].innerText = "new Unique valye"
// // divs[2].innerText = "new Unique valye"

// let idx =1;
// for(div of divs){
//   div.innerText = `new Unique value ${idx};
//   `
//   idx++;
// }


// let div = document.querySelector('div');
// console.log(div);

let modeBtn = document.querySelector("#mode");

let currMode = "light";
modeBtn.addEventListener('click', ()=>{
 if(currMode === "light"){
  currMode ="dark";
  document.querySelector("body").style.backgroundColor ="black"
 }else{

  currMode = "light";
  document.querySelector("body").style.backgroundColor ="white"
 }

 console.log(currMode);
});