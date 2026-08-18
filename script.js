const display = document.getElementById("display");
const history = document.getElementById("history");
const keys = document.querySelector(".keys");

let expression = "";

function updateDisplay() {
  display.value = expression || "0";
}

function appendValue(value) {
  const operators = ["+", "-", "*", "/", "%"];
  const last = expression.slice(-1);

  if (operators.includes(value) && operators.includes(last)) {
    expression = expression.slice(0, -1) + value;
  } else {
    expression += value;
  }

  updateDisplay();
}

function clearAll() {
  expression = "";
  history.textContent = "";
  updateDisplay();
}

function deleteLast() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function calculate() {
  if (!expression) return;

  try {
    const safeExpression = expression.replace(/%/g, "/100");

    if (!/^[0-9+\-*/.() ]+$/.test(safeExpression)) {
      throw new Error("Invalid input");
    }

    const result = Function(`"use strict"; return (${safeExpression})`)();

    if (!Number.isFinite(result)) {
      throw new Error("Math error");
    }

    history.textContent = `${expression} =`;
    expression = String(Number(result.toFixed(10)));
    updateDisplay();
  } catch {
    history.textContent = "Invalid calculation";
    expression = "";
    display.value = "Error";
  }
}

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.value) appendValue(button.dataset.value);
  if (button.dataset.action === "clear") clearAll();
  if (button.dataset.action === "delete") deleteLast();
  if (button.dataset.action === "calculate") calculate();
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/^[0-9.+\-*/%]$/.test(key)) {
    appendValue(key);
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculate();
  } else if (key === "Backspace") {
    deleteLast();
  } else if (key === "Escape") {
    clearAll();
  }
});

updateDisplay();
