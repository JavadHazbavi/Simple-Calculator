const currentDisplay = document.querySelector("#current");
const historyDisplay = document.querySelector("#history");
const keys = document.querySelector(".keys");

let currentValue = "0";
let storedValue = null;
let pendingOperator = null;
let shouldResetDisplay = false;

const operatorSymbols = {
  "+": "+",
  "-": "-",
  "*": "x",
  "/": "÷"
};

function updateDisplay() {
  currentDisplay.textContent = currentValue;

  if (pendingOperator && storedValue !== null) {
    historyDisplay.textContent = `${storedValue} ${operatorSymbols[pendingOperator]}`;
  } else {
    historyDisplay.textContent = "";
  }
}

function inputNumber(number) {
  if (currentValue === "Error" || shouldResetDisplay) {
    currentValue = number === "." ? "0." : number;
    shouldResetDisplay = false;
    updateDisplay();
    return;
  }

  if (number === "." && currentValue.includes(".")) {
    return;
  }

  if (currentValue === "0" && number !== ".") {
    currentValue = number;
  } else {
    currentValue += number;
  }

  updateDisplay();
}

function calculate(firstValue, operator, secondValue) {
  const first = Number(firstValue);
  const second = Number(secondValue);

  if (operator === "+") return first + second;
  if (operator === "-") return first - second;
  if (operator === "*") return first * second;
  if (operator === "/") {
    if (second === 0) return "Error";
    return first / second;
  }

  return second;
}

function formatResult(result) {
  if (result === "Error") return result;

  const rounded = Number.parseFloat(result.toFixed(10));
  return String(rounded);
}

function chooseOperator(operator) {
  if (currentValue === "Error") {
    clearCalculator();
    return;
  }

  if (pendingOperator && !shouldResetDisplay) {
    const result = calculate(storedValue, pendingOperator, currentValue);
    currentValue = formatResult(result);
    storedValue = currentValue === "Error" ? null : currentValue;
  } else {
    storedValue = currentValue;
  }

  pendingOperator = operator;
  shouldResetDisplay = true;
  updateDisplay();
}

function runEquals() {
  if (!pendingOperator || storedValue === null || shouldResetDisplay) {
    return;
  }

  const result = calculate(storedValue, pendingOperator, currentValue);
  historyDisplay.textContent = `${storedValue} ${operatorSymbols[pendingOperator]} ${currentValue} =`;
  currentValue = formatResult(result);
  storedValue = null;
  pendingOperator = null;
  shouldResetDisplay = true;
  currentDisplay.textContent = currentValue;
}

function clearCalculator() {
  currentValue = "0";
  storedValue = null;
  pendingOperator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

function deleteLastDigit() {
  if (currentValue === "Error" || shouldResetDisplay) {
    currentValue = "0";
    shouldResetDisplay = false;
  } else {
    currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : "0";
  }

  updateDisplay();
}

function convertToPercent() {
  if (currentValue === "Error") return;

  currentValue = formatResult(Number(currentValue) / 100);
  updateDisplay();
}

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.number) {
    inputNumber(button.dataset.number);
  }

  if (button.dataset.operator) {
    chooseOperator(button.dataset.operator);
  }

  if (button.dataset.action === "clear") {
    clearCalculator();
  }

  if (button.dataset.action === "delete") {
    deleteLastDigit();
  }

  if (button.dataset.action === "percent") {
    convertToPercent();
  }

  if (button.dataset.action === "equals") {
    runEquals();
  }
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/^[0-9.]$/.test(key)) inputNumber(key);
  if (["+", "-", "*", "/"].includes(key)) chooseOperator(key);
  if (key === "Enter" || key === "=") runEquals();
  if (key === "Backspace") deleteLastDigit();
  if (key === "Escape") clearCalculator();
  if (key === "%") convertToPercent();
});

updateDisplay();
