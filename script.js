document.addEventListener('DOMContentLoaded', loadExpenses);

function addExpense() {
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const amount = document.getElementById('amount').value;
    const date = new Date().toLocaleString();

    if (!category || !description || !amount) {
        alert('Please fill in all fields.');
        return;
    }

    const expense = { date, category, description, amount };
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    document.getElementById('category').value = '';
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';

    loadExpenses();
}

function loadExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const expensesTable = document.getElementById('expensesTable').getElementsByTagName('tbody')[0];
    expensesTable.innerHTML = '';

    expenses.forEach((expense, index) => {
        const row = expensesTable.insertRow();
        row.insertCell(0).textContent = expense.date;
        row.insertCell(1).textContent = expense.category;
        row.insertCell(2).textContent = expense.description;
        row.insertCell(3).textContent = expense.amount;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteExpense(index);
        row.insertCell(4).appendChild(deleteButton);
    });
}

function deleteExpense(index) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    loadExpenses();
}
