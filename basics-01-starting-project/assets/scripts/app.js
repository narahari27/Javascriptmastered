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
function add() {
    const enteredNumber = getUserInput();
    const initalResult = currentResult;
    console.log('input',enteredNumber , currentResult)
    currentResult += enteredNumber;
    createAndWriteOutput('+', initalResult, enteredNumber);
    writeToLog('Add',initalResult,enteredNumber,currentResult);

}
function subtract() {
    const enteredNumber = getUserInput();
    const initalResult = currentResult;
    currentResult -= enteredNumber;
    createAndWriteOutput('-', initalResult, enteredNumber);
    writeToLog('subtract',initalResult,enteredNumber,currentResult);
}
function multiply() {
    const enteredNumber = getUserInput();
    const initalResult = currentResult;
    currentResult *= enteredNumber;
    createAndWriteOutput('*', initalResult, enteredNumber);
    writeToLog('multiply',initalResult,enteredNumber,currentResult);
}
function divide() {
    const enteredNumber = getUserInput();
    const initalResult = currentResult;
    currentResult /= enteredNumber;
    createAndWriteOutput('/', initalResult, enteredNumber);
    writeToLog('divide',initalResult,enteredNumber,currentResult);
}
addBtn.addEventListener('click', add);
subtractBtn.addEventListener('click', subtract);
multiplyBtn.addEventListener('click ', multiply);
divideBtn.addEventListener('click', divide);