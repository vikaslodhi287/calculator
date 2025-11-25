
(function() {
    const historyEl = document.getElementById('history');
    const currentEl = document.getElementById('current');
    const keys = document.getElementById('keys');

    let current = '0';
    let previous = '';
    let operator = null;
    let overwrite = false;

    function updateDisplay() {
        currentEl.textContent = current;
        historyEl.textContent = previous + (operator ? ' ' + operator : '');
    }

    function inputDigit(d) {
        if (overwrite || current === '0') {
        current = d;
        overwrite = false;
        } else {
        current = current + d;
        }
    }

    function inputDot() {
        if (overwrite) {
        current = '0.';
        overwrite = false;
        return;
        }
        if (!current.includes('.')) {
        current += '.';
        }
    }

    function clearAll() {
        current = '0';
        previous = '';
        operator = null;
        overwrite = false;
    }

    function backspace() {
        if (overwrite || current.length === 1) {
        current = '0';
        overwrite = false;
        } else {
        current = current.slice(0, -1);
        }
    }

    function chooseOperator(op) {
        if (operator && !overwrite) {
        // calculate first
        compute();
        }
        previous = current;
        operator = op;
        overwrite = true;
    }

    function percent() {
        current = String(parseFloat(current) / 100);
        overwrite = true;
    }

    function compute() {
        if (!operator || !previous) return;
        const a = parseFloat(previous);
        const b = parseFloat(current);
        let result = 0;
        switch (operator) {
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '*': result = a * b; break;
        case '/': result = b === 0 ? 'Error' : a / b; break;
        case '%': result = a % b; break;
        }
        current = String(result);
        previous = '';
        operator = null;
        overwrite = true;
    }

    keys.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const action = btn.dataset.action;
        const value = btn.dataset.value;

        if (!action && value) {
        // number
        inputDigit(value);
        updateDisplay();
        return;
        }

    switch (action) {
        case 'dot': inputDot(); break;
        case 'clear': clearAll(); break;
        case 'back': backspace(); break;
        case 'op':
            if (value === '%') {
            percent();
            } else {
            chooseOperator(value);
            }
            break;
        case 'equal':
            compute();
            break;
        }
        updateDisplay();
    });

  // Keyboard support (nice to have)
window.addEventListener('keydown', (e) => {
        if ((e.key >= '0' && e.key <= '9')) {
        inputDigit(e.key);
        } else if (e.key === '.') {
        inputDot();
        } else if (e.key === 'Enter' || e.key === '=') {
        compute();
        } else if (e.key === 'Backspace') {
        backspace();
        } else if (e.key === 'Escape') {
        clearAll();
        } else if (['+','-','*','/'].includes(e.key)) {
        chooseOperator(e.key);
        }
    updateDisplay();
});

updateDisplay();
})();
