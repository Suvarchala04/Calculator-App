// script.js
document.addEventListener('DOMContentLoaded', function () {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.btn');
    
    let currentInput = '';
    let calculationString = '';

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const value = this.getAttribute('data-value');

            if (value === 'C') {
                currentInput = '';
                calculationString = '';
                display.textContent = '';
                return;
            }

            if (value === '=') {
                try {
                    // Evaluate the calculation string
                    currentInput = evaluateCalculation(calculationString).toString();
                    display.textContent = currentInput;
                    calculationString = currentInput;
                } catch (error) {
                    display.textContent = 'Error';
                    calculationString = '';
                    currentInput = '';
                }
                return;
            }

            if (['+', '-', '*', '/'].includes(value)) {
                if (currentInput) {
                    currentInput = '';
                }
                calculationString += ` ${value} `;
            } else {
                calculationString += value;
            }

            display.textContent = calculationString;
        });
    });

    function evaluateCalculation(calcString) {
        const tokens = calcString.split(' ').filter(Boolean);
        const stack = [];
        let currentOperator = null;

        tokens.forEach(token => {
            if (!isNaN(token)) {
                // Token is a number
                if (currentOperator) {
                    const a = stack.pop();
                    const b = parseFloat(token);
                    let result;

                    switch (currentOperator) {
                        case '+':
                            result = a + b;
                            break;
                        case '-':
                            result = a - b;
                            break;
                        case '*':
                            result = a * b;
                            break;
                        case '/':
                            if (b === 0) throw new Error('Cannot divide by zero');
                            result = a / b;
                            break;
                        default:
                            throw new Error('Unknown operator');
                    }

                    stack.push(result);
                    currentOperator = null;
                } else {
                    stack.push(parseFloat(token));
                }
            } else {
                // Token is an operator
                currentOperator = token;
            }
        });

        if (stack.length !== 1) {
            throw new Error('Invalid calculation');
        }

        return stack[0];
    }
});
