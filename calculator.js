const numbers = document.querySelectorAll(".btn");
const dot = document.getElementById("dot");
const operations = document.querySelectorAll(".operation");
const topScreenArea = document.querySelector(".top span");
const bottomScreenArea = document.querySelector(".bottom span"); 

let shouldAddOperator = true;
let currentNumber = "0";

function roundNumber(num) {
    return num.toExponential(8);
} 

function clearAll() {
    if(bottomScreenArea !== "0") {
        shouldAddOperator = true; 
        currentNumber = "0";
        bottomScreenArea.textContent = "0";
        topScreenArea.textContent = "";
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
        topScreenArea.textContent = `${n1} ${op} ${n2} =`
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
        case "÷":
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

function numberClicked(e) {
    let number = e.target.textContent;
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

dot.addEventListener("click", dotClicked);

operations.forEach(op => {
    op.addEventListener("click", operationClicked);
});

numbers.forEach(n => {
    n.addEventListener("click", numberClicked);
});