const numbers = document.querySelectorAll(".btn");
const dot = document.getElementById("dot");
const operations = document.querySelectorAll(".operation");
const topScreenArea = document.querySelector(".top span");
const bottomScreenArea = document.querySelector(".bottom span"); 
const historyTxt = document.querySelector(".txt");

let shouldAddOperator = true;
let currentNumber = "0";

let operationHistory = [];

function setOperation(n1, op, n2, res) {
    let operation = {
        number1: n1,
        operator: op,
        number2: n2,
        result: res
    };
    operationHistory.push(operation);
}

function appendOperationInHistory() {
    let span = document.createElement("span");
    let currentOperation = operationHistory[operationHistory.length - 1];
    span.textContent = 
        `${currentOperation.number1} ${currentOperation.operator} ${currentOperation.number2} = ${currentOperation.result}`;
    historyTxt.appendChild(span);
}

function roundNumber(num) {
    return num.toExponential(8);
} 

function clearAll() {
    if(bottomScreenArea !== "0") {
        shouldAddOperator = true; 
        currentNumber = "0";
        bottomScreenArea.textContent = "0";
        topScreenArea.textContent = "";
        historyTxt.innerHTML = "";
        operationHistory.splice(0, operationHistory.length);
    }
}

function clearLast() {
    if(bottomScreenArea.textContent.length - 1 > 0) {
        if(bottomScreenArea.textContent.slice(-1) === " ") { // remove operator (space is op separator)
            bottomScreenArea.textContent = bottomScreenArea.textContent.slice(0, -3);
            shouldAddOperator = true;
            currentNumber = bottomScreenArea.textContent;
        }
        else {
            currentNumber = currentNumber.slice(0, -1);
            if(currentNumber === "") {
                currentNumber = "0";
            }
            bottomScreenArea.textContent = bottomScreenArea.textContent.slice(0, -1);
        }
    }
    else {
        currentNumber = "0";
        bottomScreenArea.textContent = "0";
    }
}

function percentOperation() {
    if(currentNumber !== "0" && currentNumber !== "") {
        bottomScreenArea.textContent = bottomScreenArea.textContent.slice(0, -currentNumber.length);
        currentNumber = parseFloat((+currentNumber / 100).toPrecision(12)).toString();
        bottomScreenArea.textContent += currentNumber;
    }
}

function evalOperation() {
    var [n1, op, n2] = bottomScreenArea.textContent.split(" "); // [operand, operator, operand]
    let res = operate(+n1, op, n2 === "" ? n2 = 0 : +n2);
    if(res !== "" && !isNaN(+n1)) {
        res = res.toString()
        if(res.length >= 12) {
            res = roundNumber(parseFloat(res));
        }
        topScreenArea.textContent = `${n1} ${op} ${n2} =`;
        setOperation(n1, op, n2, res);
        appendOperationInHistory()
        console.table(operationHistory);
        bottomScreenArea.textContent = res;
        shouldAddOperator = true;
        currentNumber = res;
    }
}

function operate(n1, op, n2) {
    switch(op) {
        case "+":
            return n1 + n2;
        case "-":
            return n1 - n2;
        case "x":
            return n1 * n2;
        case "??":
            return n1 / n2;
        default:
            return "";
    }
}

function addOperator(operator) {
    bottomScreenArea.textContent += ` ${operator} `;
    shouldAddOperator = false;
    currentNumber = "";
}

function operationClicked(e) {
    switch(e.target.id) {
        case "clear-all":
            clearAll();
            break;
        case "clear-last":
            clearLast();
            break;
        case "percent":
            percentOperation();
            break;
        case "equals":
            evalOperation();
            break;
        default:
            if(shouldAddOperator) {
                addOperator(e.target.textContent);
            }
            break;
    }
}

function numberClicked(number) {
    if(bottomScreenArea.textContent === "0" && number !== "0") {
        currentNumber = number;
        bottomScreenArea.textContent = currentNumber;
    }
    else if(currentNumber !== "0") {
        currentNumber += number;
        bottomScreenArea.textContent += currentNumber.slice(-1);
    }
    else if(currentNumber === "0" && bottomScreenArea.textContent.length > 1) {
        if(number !== "0") {
            currentNumber = number;
            bottomScreenArea.textContent += currentNumber.slice(-1);
        }
    }
}

function dotClicked() {
    if(!currentNumber.includes(".")) {
        if(currentNumber === "") {
            currentNumber += "0.";
            bottomScreenArea.textContent += "0.";
        }
        else {
            currentNumber += "."
            bottomScreenArea.textContent += currentNumber.slice(-1);
        } 
    }
}

function keyToOperator(key) {
    switch(key) {
        case "/":
            return "??";
        case "*":
            return "x";
        case "-":
            return "-";
        case "+":
            return "+";
    }
}

function keyToOperatorId(key) {
    switch(key) {
        case "/":
            return "divide";
        case "*":
            return "multiply";
        case "-":
            return "substract";
        case "+":
            return "add";
    }
}

function keyPressed(e) {
    e.preventDefault(); // Enter and spacebar keys causes click event to trigger on a focussed element
    let button = null;
    if(e.key >= 0 && e.key <= 9 && e.code !== "Space") {
        button = document.getElementById(`${e.key}`);
        numberClicked(e.key);
    }
    else if(e.key === ".") {
        button = dot;
        dotClicked();
    }
    else {    
        if(e.key === "Backspace") {
            button = document.getElementById("clear-last");
            clearLast();
        }
        else if(e.key === "Delete") {
            button = document.getElementById("clear-all");
            clearAll();
        }
        else if(e.key === "%") {
            button = document.getElementById("percent")
            percentOperation();
        }
        else if(e.key === "Enter") {
            button = document.getElementById("equals")
            evalOperation();
        }
        else if(e.key === "/" || e.key === "*" || e.key === "+" || e.key === "-") {
            button = document.getElementById(keyToOperatorId(e.key));
            if(shouldAddOperator) addOperator(keyToOperator(e.key));
        }
    }
    if(button !== null) button.classList.add("pressed")
}

function removeTransition(e) {
    e.target.classList.remove("pressed");
}

dot.addEventListener("click", dotClicked);
dot.addEventListener("transitionend", removeTransition);

operations.forEach(op => {
    op.addEventListener("click", operationClicked);
    op.addEventListener("transitionend", removeTransition);
});

numbers.forEach(n => {
    if(n.id !== "dot") {
        n.addEventListener("click", () => {
            numberClicked(n.textContent);
        });
        n.addEventListener("transitionend", removeTransition);
    }
});

window.addEventListener("keydown", keyPressed);