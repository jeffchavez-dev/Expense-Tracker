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
    let expenses = JSON.parse(local
