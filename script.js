document.addEventListener('DOMContentLoaded', () => {
    loadExpenses();
    loadBudgets();
});

function addExpense() {
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = new Date().toLocaleString();

    if (!category || !description || !amount) {
        alert('Please fill in all fields.');
        return;
    }

    const expense = { date, category, description, amount };
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';

    loadExpenses();
}

function loadExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const expensesTable = document.getElementById('expensesTable').getElementsByTagName('tbody')[0];
    expensesTable.innerHTML = '';

    let total = 0;
    expenses.forEach((expense, index) => {
        const row = expensesTable.insertRow();
        row.insertCell(0).textContent = expense.date;
        row.insertCell(1).textContent = expense.category;
        row.insertCell(2).textContent = expense.description;
        row.insertCell(3).textContent = expense.amount;
        total += expense.amount;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteExpense(index);
        row.insertCell(4).appendChild(deleteButton);
    });

    document.getElementById('totalExpenses').textContent = total.toFixed(2);
    updateBudgetStatus();
}

function deleteExpense(index) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    loadExpenses();
}

function saveBudgets() {
    const budgets = {
        Food: parseFloat(document.getElementById('foodBudget').value) || 0,
        Car: parseFloat(document.getElementById('carBudget').value) || 0,
        "House Expenses" : parseFloat(document.getElementById('houseBudget').value) || 0,
        Entertainment: parseFloat(document.getElementById('entertainmentBudget').value) || 0,
        Other: parseFloat(document.getElementById('otherBudget').value) || 0,
    };
    localStorage.setItem('budgets', JSON.stringify(budgets));
    updateBudgetStatus();
}

function loadBudgets() {
    const budgets = JSON.parse(localStorage.getItem('budgets')) || {};
    document.getElementById('foodBudget').value = budgets.Food || 0;
    document.getElementById('carBudget').value = budgets.Car || 0;
    document.getElementById('houseBudget').value = budgets.House || 0;
    document.getElementById('entertainmentBudget').value = budgets.Entertainment || 0;
    document.getElementById('otherBudget').value = budgets.Other || 0;
    updateBudgetStatus();
}

function updateBudgetStatus() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const budgets = JSON.parse(localStorage.getItem('budgets')) || {};

    const budgetStatus = {
        Food: 0,
        Car: 0,
        "House Expenses" : 0,
        Entertainment: 0,
        Other: 0,
    };

    expenses.forEach(expense => {
        budgetStatus[expense.category] += expense.amount;
    });

    const statusDiv = document.getElementById('budgetStatus');
    statusDiv.innerHTML = '';

    for (const [category, total] of Object.entries(budgetStatus)) {
        const budget = budgets[category] || 0;
        const status = document.createElement('div');
        status.textContent = `${category}: Spent ${total.toFixed(2)} / Budget ${budget.toFixed(2)} - ${total > budget ? 'Over Budget' : 'Within Budget'}`;
        status.style.color = total > budget ? 'red' : 'green';
        statusDiv.appendChild(status);
    }
}
