const defaultValue = 0;
let currentResult = defaultValue;

function add(num1,num2) {
    const result = num1 + num2;
    alert('The result is ' + result);
}
add( 2,2);
add( 1,5);

currentResult = (currentResult + 10)*2;
let calculationDescription = `(' ${defaultValue}  + 10)*2`;

outputResult(currentResult, calculationDescription)