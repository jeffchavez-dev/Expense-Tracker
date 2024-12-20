document.addEventListener('DOMContentLoaded', () => {
    loadExpenses();
    loadBudgets();
});



const dateInput = document.getElementById('date-input');
const startDateInput = document.getElementById('date-range-input start-date');
const endDateInput = document.getElementById('date-range-input end-date');


function formatDate(dateInput) {
    const selectedDate = new Date(dateInput.value);
    const formattedString = selectedDate.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
    return formattedString;
  }


function addExpense() {
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    // const date = new Date().toLocaleString();

    const date = formatDate(dateInput)
    if (!category || !description || !amount ) {
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

const clearFiltersButton = document.querySelector('.clearFiltersButton')

clearFiltersButton.addEventListener('click', () => {
    document.getElementById('monthFilter').value = 'all';
    document.getElementById('itemFilter').value = 'all';
    document.getElementById('search-input').value = '';
    document.getElementById('date-range-input').value = '';
    loadExpenses(); // Call loadExpenses to re-render with no filters
})


const searchBtn = document.getElementById('search-btn')
const searchInput = document.getElementById('search-input');
searchBtn.addEventListener('click', () => {
    const searchTerm = searchInput.value.toLowerCase(); // Get the search term from the input
    // Call loadExpenses to refresh the table with search results
    loadExpenses(searchTerm); // Pass the search term to loadExpenses
})


function sortByDate(expenses) {
    return expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
}

const sortByDateBtn   = document.getElementById('sort-by-date-btn')
const sortByAmountBtn   = document.getElementById('sort-by-amount-btn')

sortByAmountBtn.addEventListener('click', () => {

})

let sortByCriteria = 'date';
sortByDateBtn.addEventListener('click', () => {
    if (sortByCriteria === 'date') {
        loadExpenses()
    } else {
        sortByCriteria = '';
        loadExpenses()
    }
})

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
let currentDate = new Date
const currentMonth  = monthNames[currentDate.getMonth()]
console.log(currentMonth)
const setCurrentMonth = document.getElementById('monthFilter')

setCurrentMonth.selectedIndex.innerText = currentMonth




function loadExpenses(searchTerm = '') {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const expensesTable = document.getElementById('expensesTable').getElementsByTagName('tbody')[0];
    expensesTable.innerHTML = '';
    
    const itemFilter = document.getElementById('itemFilter').value
    const monthFilter = document.getElementById('monthFilter').value;
    const dateRangeFilter = document.getElementById('date-range-filter').checked;
    
    
    function getFilteredExpenses(monthFilter, itemFilter, dateRangeFilter) {
        // const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        let filteredExpenses = expenses;

        if (dateRangeFilter) {
            const startDate = new Date(startDateInput.value);
            const endDate = new Date(endDateInput.value);
            alert(`${startDate} to ${endDate}`)
            filteredExpenses = expenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate >= startDate && expenseDate <= endDate;
            });
        }
        if (monthFilter === 'all') {
            return itemFilter === 'all'? expenses : expenses.filter(expense => expense.category === itemFilter);
        } else {
            return expenses.filter(expense => {
                const expenseMonth = new Date(expense.date).getMonth() + 1;
                return expenseMonth == monthFilter && (itemFilter === 'all' || expense.category === itemFilter) ;
            });
        }
        return filteredExpenses;
      }

    const filteredExpenses = getFilteredExpenses(monthFilter, itemFilter, dateRangeFilter);    
    const filteredSearch = searchTerm === '' ?
        filteredExpenses :
        filteredExpenses.filter(expense => {
        return expense.category.toLowerCase().includes(searchTerm) || expense.description.toLowerCase().includes(searchTerm)
    })

    const sortedExpenses = sortByCriteria === 'date' ? sortByDate(filteredSearch) : filteredSearch

    let total = 0;
    sortedExpenses.forEach((expense, index) => {
        const row = expensesTable.insertRow();
        // Format the date
        const dateObject = new Date(expense.date);
        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];  
        
        row.insertCell(0).textContent = expense.date;
        row.insertCell(1).textContent = expense.category;
        row.insertCell(2).textContent = expense.description;
        row.insertCell(3).textContent = expense.amount;
        total += expense.amount;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => {
            let answer = confirm(`Are you sure you want to delete ${expense.description}?`)
            if (answer) {
                deleteExpense(index);
            }
        }
        row.insertCell(4).appendChild(deleteButton);
    });

    document.getElementById('totalExpenses').textContent = total.toFixed(2);
    updateBudgetStatus(filteredExpenses);
}



const dateRangeFilter = document.getElementById('date-range-filter');

dateRangeFilter.addEventListener('change', () => {
    startDateInput.disabled = !dateRangeFilter.checked;
    endDateInput.disabled = !dateRangeFilter.checked;
    loadExpenses();
});

startDateInput.addEventListener('change', () => {
    if (dateRangeFilter.checked) {
      loadExpenses();
    }
  });
  
  endDateInput.addEventListener('change', () => {
    if (dateRangeFilter.checked) {
      loadExpenses();
    }
  });




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
        House: parseFloat(document.getElementById('houseBudget').value) || 0,
        Entertainment: parseFloat(document.getElementById('entertainmentBudget').value) || 0,
        Card: parseFloat(document.getElementById('cardBudget').value) || 0,
        Other: parseFloat(document.getElementById('otherBudget').value) || 0,
    };
    localStorage.setItem('budgets', JSON.stringify(budgets));
    loadExpenses();
}

function loadBudgets() {
    const budgets = JSON.parse(localStorage.getItem('budgets')) || {};
    document.getElementById('foodBudget').value = budgets.Food || 0;
    document.getElementById('carBudget').value = budgets.Car || 0;
    document.getElementById('houseBudget').value = budgets.House || 0;
    document.getElementById('entertainmentBudget').value = budgets.Entertainment || 0;
    document.getElementById('cardBudget').value = budgets.Card || 0;
    document.getElementById('otherBudget').value = budgets.Other || 0;
}

function updateBudgetStatus(filteredExpenses) {

    
    const expenses = filteredExpenses || JSON.parse(localStorage.getItem('expenses')) || [];
    const budgets = JSON.parse(localStorage.getItem('budgets')) || {};

    const budgetStatus = {
        Food: 0,
        Car: 0,
        House: 0,
        Entertainment: 0,
        Card: 0,
        Other: 0,
    };

    expenses.forEach(expense => {
        budgetStatus[expense.category] += expense.amount;
    });

    const monthFilter = document.getElementById('monthFilter').value;
    const budgetMonth = document.getElementById('budget-month');
    budgetMonth.innerHTML = monthFilter;
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


function downloadExpenses() {
    // Get the table data
    const table = document.getElementById('expensesTable');
    const rows = table.querySelectorAll('tr');
  
    // Prepare the CSV data
    let csvContent = "Date,Category,Description,Amount\n";
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      const cellValues = [];
      cells.forEach(cell => {
        cellValues.push(cell.textContent.trim());
      });
      csvContent += cellValues.join(',') + '\n';
    });
  
    // Create a temporary link to download the CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download   
   = 'expenses.csv';
    link.click();
    URL.revokeObjectURL(url);   
  
  }