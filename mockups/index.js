


const form = document.getElementById("form")
const transaction = document.getElementById('make-transaction')
const transactionNote = document.getElementById('transaction-note')
const transactionTag = document.getElementById('transaction-tag')
const currentMoney = document.getElementById('current-money')
const currentSymbol = document.getElementById('current-symbol')
const currentNumber = document.getElementById('current-number')
const income = document.getElementById('income')
const expense = document.getElementById('expense')
const day = new Date().toJSON();
const currentDay=new Date(day).toUTCString();
const list = document.getElementById('transaction-list')


function addNewTransaction(type, amount, date, note, tags) {
    let transaction;
    if (type === 'expense') {
        transaction = new Expense(amount, date, note, tags);

    } else {
        transaction = new Income(amount, date, note, tags);

    }
   
    this._updateBalance(transaction);

}







class Currency {
    constructor(id, name, symbol) {
        this.id = id;
        this.name = name;
        this.symbol = symbol;

    }
}
class Transaction {
    constructor(amount, date, note="" , tags ="") {
        this.amount = amount;
        this.date = date;
        this.note = note;
        this.tags = Array.isArray(tags) ? tags : tags.split(',');
    }
    amountColor;
    
     renderTransactions(list) {
        list.innerHTML = '';
        const badges = this.tags.reduce((acc, tag) => acc + `<span class="badge badge-pill badge-dark">${tag}</span>`, '');
        list.insertAdjacentHTML("beforeend", `<li><p id="amount">${this.amount}</p><p id="date">${this.date}</p><p id="note">${this.note}</p><p id="tag">${this.tags}</p><hr></li>`);
    }



}
class Expense extends Transaction {
    amountColor = 'danger';
    type = 'expense';
    currentAmountMoney(money) {

        return  money - this.amount;
    }
}

class Income extends Transaction {
    type = 'income';
    amountColor = 'success';
    currentAmountMoney(money) {
        return money + this.amount;
    }
}


form.addEventListener('submit', addNewTransaction)

function addNewTransaction(e) {
    e.preventDefault()


    const amount = parseInt(transaction.value);
    const note = transactionNote.value;
    const tags = transactionTag.value;
    
  let newTransaction = new Transaction(amount, new Date(), note, tags)
 newTransaction.renderTransactions(list);

    form.reset()




}






