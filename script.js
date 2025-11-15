document.addEventListener('DOMContentLoaded', function () {
            // Calculator state
            let currentOperand = '';
            let previousOperand = '';
            let operation = undefined;
            let shouldResetScreen = false;
            let calculationHistory = [];

            // DOM elements
            const currentOperandElement = document.querySelector('.current-operand');
            const previousOperandElement = document.querySelector('.previous-operand');
            const clearButton = document.querySelector('.clear');
            const deleteButton = document.querySelector('.delete');
            const equalsButton = document.querySelector('.equals');
            const decimalButton = document.querySelector('.decimal');
            const percentageButton = document.querySelector('.percentage');
            const numberButtons = document.querySelectorAll('.number');
            const operatorButtons = document.querySelectorAll('.operator');
            const historyToggle = document.querySelector('.history-toggle');
            const calculatorContainer = document.querySelector('.calculator-container');
            const historyItemsContainer = document.querySelector('.history-items');

            // Event listeners
            clearButton.addEventListener('click', clear);
            deleteButton.addEventListener('click', deleteNumber);
            equalsButton.addEventListener('click', evaluate);
            decimalButton.addEventListener('click', appendDecimal);
            percentageButton.addEventListener('click', appendPercentage);
            historyToggle.addEventListener('click', toggleHistory);

            numberButtons.forEach(button => {
                button.addEventListener('click', () => {
                    appendNumber(button.textContent);
                });
            });

            operatorButtons.forEach(button => {
                button.addEventListener('click', () => {
                    chooseOperation(button.textContent);
                });
            });

            // Keyboard support
            document.addEventListener('keydown', event => {
                if (/[0-9]/.test(event.key)) {
                    appendNumber(event.key);
                } else if (event.key === '.') {
                    appendDecimal();
                } else if (event.key === '+' || event.key === '-' || event.key === '*') {
                    chooseOperation(convertOperator(event.key));
                } else if (event.key === '/') {
                    event.preventDefault();
                    chooseOperation('÷');
                } else if (event.key === 'Enter' || event.key === '=') {
                    evaluate();
                } else if (event.key === 'Backspace') {
                    deleteNumber();
                } else if (event.key === 'Escape') {
                    clear();
                } else if (event.key === '%') {
                    appendPercentage();
                } else if (event.key === 'h' || event.key === 'H') {
                    toggleHistory();
                }
            });

            // Calculator functions
            function clear() {
                currentOperand = '';
                previousOperand = '';
                operation = undefined;
                updateDisplay();
            }

            function deleteNumber() {
                currentOperand = currentOperand.toString().slice(0, -1);
                if (currentOperand === '') currentOperand = '0';
                updateDisplay();
            }

            function appendNumber(number) {
                if (shouldResetScreen) {
                    currentOperand = '';
                    shouldResetScreen = false;
                }

                if (currentOperand === '0' && number !== '.') {
                    currentOperand = number;
                } else {
                    currentOperand = currentOperand.toString() + number;
                }
                updateDisplay();
            }

            function appendDecimal() {
                if (shouldResetScreen) {
                    currentOperand = '';
                    shouldResetScreen = false;
                }

                if (currentOperand === '') {
                    currentOperand = '0';
                }

                if (!currentOperand.includes('.')) {
                    currentOperand += '.';
                }
                updateDisplay();
            }

            function appendPercentage() {
                if (currentOperand !== '') {
                    currentOperand = (parseFloat(currentOperand) / 100).toString();
                    updateDisplay();
                }
            }

            function chooseOperation(op) {
                if (currentOperand === '') return;

                if (previousOperand !== '') {
                    evaluate();
                }

                operation = op;
                previousOperand = currentOperand;
                currentOperand = '';

                // Highlight the selected operator
                operatorButtons.forEach(button => {
                    button.classList.remove('active');
                });

                // Find and highlight the active operator button
                const activeOperator = Array.from(operatorButtons).find(
                    button => button.textContent === op
                );
                if (activeOperator) {
                    activeOperator.classList.add('active');
                }

                updateDisplay();
            }

            function evaluate() {
                if (operation === undefined || currentOperand === '' || previousOperand === '') return;

                let computation;
                const prev = parseFloat(previousOperand);
                const current = parseFloat(currentOperand);

                switch (operation) {
                    case '+':
                        computation = prev + current;
                        break;
                    case '-':
                        computation = prev - current;
                        break;
                    case '×':
                        computation = prev * current;
                        break;
                    case '÷':
                        if (current === 0) {
                            computation = 'Error';
                        } else {
                            computation = prev / current;
                        }
                        break;
                    default:
                        return;
                }

                // Reset operator highlighting
                operatorButtons.forEach(button => {
                    button.classList.remove('active');
                });

                // Add to history
                addToHistory(`${previousOperand} ${operation} ${currentOperand} = ${computation}`);

                currentOperand = computation.toString();
                operation = undefined;
                previousOperand = '';
                shouldResetScreen = true;
                updateDisplay();
            }

            function updateDisplay() {
                currentOperandElement.textContent = formatDisplayNumber(currentOperand);
                if (operation != null) {
                    previousOperandElement.textContent = `${formatDisplayNumber(previousOperand)} ${operation}`;
                } else {
                    previousOperandElement.textContent = '';
                }
            }

            function formatDisplayNumber(number) {
                if (number === 'Error') return number;

                const stringNumber = number.toString();
                const integerDigits = parseFloat(stringNumber.split('.')[0]);
                const decimalDigits = stringNumber.split('.')[1];

                let integerDisplay;
                if (isNaN(integerDigits)) {
                    integerDisplay = '0';
                } else {
                    integerDisplay = integerDigits.toLocaleString('en', {
                        maximumFractionDigits: 0
                    });
                }

                if (decimalDigits != null) {
                    return `${integerDisplay}.${decimalDigits}`;
                } else {
                    return integerDisplay;
                }
            }

            function convertOperator(keyboardOperator) {
                if (keyboardOperator === '/') return '÷';
                if (keyboardOperator === '*') return '×';
                return keyboardOperator;
            }

            function toggleHistory() {
                calculatorContainer.classList.toggle('history-open');
            }

            function addToHistory(calculation) {
                calculationHistory.unshift(calculation);
                if (calculationHistory.length > 10) {
                    calculationHistory.pop();
                }
                updateHistoryDisplay();
            }

            function updateHistoryDisplay() {
                historyItemsContainer.innerHTML = '';
                calculationHistory.forEach(item => {
                    const historyItem = document.createElement('div');
                    historyItem.classList.add('history-item');
                    historyItem.textContent = item;
                    historyItemsContainer.appendChild(historyItem);
                });
            }

            // Initialize display
            updateDisplay();

            // Add some sample history items
            addToHistory("12 × 12 = 144");
            addToHistory("45 + 67 = 112");
            addToHistory("100 ÷ 4 = 25");
        });