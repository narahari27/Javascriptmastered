const defaultResult = 0;
let currentResult = defaultResult;
let logEntries = [];

function getUserInput() {
    return parseInt(usrInput.value);
}
function createAndWriteOutput(operator, resultBeforeCalc, CalcNumber) {
    const calcDescription = `${resultBeforeCalc} ${operator} ${CalcNumber}`;
    outputResult(currentResult, calcDescription);
}
function writeToLog(opertaionIdentifier, prevResult, operationNumber, newresult) {
    const logEntry = {
        operation: opertaionIdentifier,
        prevResult: prevResult,
        operand: operationNumber,
        result: newresult
    };
    logEntries.push(logEntry);
    console.log(logEntry.operation);
    console.log(logEntries);
}

function calculateResult(calculationType){
    if(
        calculationType !== 'ADD' &&
        calculationType !== 'SUBTRACT' &&
        calculationType !== 'MULTIPLY' &&
        calculationType !== 'DIVIDE' 
        !enteredNumber
        
    ){
        return;
    }
    const enteredNumber = getUserInput();
    const initalResult = currentResult;
    let mathOperator;
    if(calculationType === 'ADD'){
        currentResult += enteredNumber;
        mathOperator = '+'
    } else if (calculationType === 'SUBTRACT') { 
        currentResult -= enteredNumber;
        mathOperator ='-'
    } else if (calculationType === 'MULTIPLY'){
        currentResult *= enteredNumber;
        mathOperator = '*';
    } else if (calculationType === 'DIVIDE'){ 
        currentResult /= enteredNumber;
        mathOperator = '/';
    }
    
    // console.log('input',enteredNumber , currentResult)
    // currentResult += enteredNumber;
    createAndWriteOutput(mathOperator, initalResult, enteredNumber);
    writeToLog(calculationType,initalResult,enteredNumber,currentResult); 
}
function add() {
    calculateResult('ADD');

}
function subtract() {
    calculateResult('SUBTRACT');
}
function multiply() {
    calculateResult('MULTIPLY');
}
function divide() {
    calculateResult('DIVIDE');
}
addBtn.addEventListener('click', add);
subtractBtn.addEventListener('click', subtract);
multiplyBtn.addEventListener('click ', multiply);
divideBtn.addEventListener('click', divide);