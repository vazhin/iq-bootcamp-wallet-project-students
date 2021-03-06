let createNewWalletBtn = document.querySelector('#create-new-wallet-btn')
let createNewWalletBtnTransactionPage = document.querySelector('#create-new-wallet-btn-transaction-page')
let closeModalBtn = document.querySelector('#close-modal-btn')
let noWalletPage = document.querySelector('#no-wallet-page')
let newWalletPage = document.querySelector('#new-wallet-page')
let transactionPage = document.querySelector('#transaction-page')
let newWalletForm = document.querySelector('#new-wallet-form')
let walletNameInput = document.querySelector('#name-input')
let walletBalanceInput = document.querySelector('#balance-input')
let walletDescriptionInput = document.querySelector('#description-input')
let walletSelector = document.querySelector('#wallet-selector')
let deleteWalletBtn = document.querySelector('#delete-wallet-btn')
const addTransactionForm = document.querySelector('#addTransactionForm')
const transaction = document.getElementById('make-transaction')
const transactionNote = document.getElementById('transaction-note')
const transactionTag = document.getElementById('transaction-tag')
const list = document.getElementById('transaction-list')
const currentMoneySpan = document.getElementById('current-money')
const currentSymbolSpan = document.getElementById('current-symbol')
const WalletBalanceHeading = document.getElementById('WalletBalance')
let colorIndex = 0;
let arrOfWallets;

class Wallet {
  constructor(name, currency, startingBalance, transactions, description) {
    this.name = name;
    this.currency = currency;
    this.startingBalance = startingBalance;
    this.transactions = transactions;
    this.description = description;
  }

  static render(wallet) {
    walletSelector.insertAdjacentHTML('afterbegin', `<option value="${wallet.name}">${wallet.name}'s wallet</option>`)
  }
  static renderContentsOfWallet(wallet) {
    currentMoneySpan.innerText = wallet.startingBalance
    if (wallet.currency === 'usDollars') {
      WalletBalanceHeading.innerHTML = `Wallet Balance: <span
      id="current-symbol">${'$'}</span><span
        id="current-money">${parseFloat(wallet.startingBalance).toFixed(2)}</span>`
    } else {
      WalletBalanceHeading.innerHTML = `Wallet Balance: <span
        id="current-money">${wallet.startingBalance}</span><span
        id="current-symbol">${' IQD'}</span>`
    }
  }
}

class Transaction {
  constructor(amount, type, date, tags, note) {
    this.amount = amount
    this.type = type
    this.date = date
    this.tags = tags
    this.note = note
  }

  static renderTransaction(transaction) {
    list.insertAdjacentHTML('afterbegin', `
      <li>
        <h2 class="display-4 ${transaction.type === 'income' ? 'text-success' : 'text-danger'}" style="font-size: 3.1rem;">${transaction.amount}</h2>
        <p>${transaction.note}</p>
        <p>${loopThroughTags(transaction.tags)}</p>
        <p class="badge badge-light" style="font-size: 1rem;">${transaction.date}</p>
        <hr>
      </li>
    `);
  }

  static renderAllTransactions() {
    if (checkLocalStorage()) {
      let currentWallet = arrOfWallets.find(wallet => wallet.name === walletSelector.value)
      list.innerHTML = ''
      for (let transaction of currentWallet.transactions) {
        Transaction.renderTransaction(transaction)
      }
    }
  }
}

navigateToAnAppropriatePage()
renderWalletsIntoSelecor()
rendersAllContentOfWallet()
Transaction.renderAllTransactions()

function rendersAllContentOfWallet() {
  if (checkLocalStorage()) {
    let currentWallet = arrOfWallets.find(wallet => wallet.name === walletSelector.value)
    Wallet.renderContentsOfWallet(currentWallet)
  }
}

createNewWalletBtnTransactionPage.addEventListener('click', () => {
  goToPage(transactionPage, newWalletPage)
})

closeModalBtn.addEventListener('click', () => {
  newWalletForm.reset()
  if (checkLocalStorage()) {
    goToPage(newWalletPage, transactionPage)
  } else {
    goToPage(newWalletPage, noWalletPage)
  }
})

function navigateToAnAppropriatePage() {
  if (checkLocalStorage()) {
    transactionPage.classList.remove('hidden')
  } else {
    noWalletPage.classList.remove('hidden')
  }
}

function checkLocalStorage() {
  if (getFromLocalStorage() === null) {
    arrOfWallets = []
    return false
  } else {
    arrOfWallets = getFromLocalStorage();
    return true
  }
}

createNewWalletBtn.addEventListener('click', () => {
  goToPage(noWalletPage, newWalletPage)
})

function goToPage(pageToHide, pageToShow) {
  pageToHide.classList.add('hidden')
  pageToShow.classList.remove('hidden')
}

newWalletForm.addEventListener('submit', (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();
  let name = walletNameInput.value
  let currency;
  let currencyRadio = document.querySelector('input[name="currencyOptions"]:checked');
  if (currencyRadio === null) {
    currency = 'usDollars'
  } else {
    currency = currencyRadio.value
  }
  let balance = Number(walletBalanceInput.value)
  let description = walletDescriptionInput.value
  if (name === '' || balance === '' || description === '') { // solves a bug
    return
  }
  let newWallet = new Wallet(name, currency, balance, [], description)
  arrOfWallets.push(newWallet)
  walletSelector.innerHTML = ''
  arrOfWallets.forEach(wallet => {
    Wallet.render(wallet)
  })
  walletSelector.value = newWallet.name
  storeInLocalStorage(arrOfWallets)
  list.innerHTML = ''
  Wallet.renderContentsOfWallet(newWallet)
  closeModalBtn.click()
  goToPage(newWalletPage, transactionPage)
})

function storeInLocalStorage(array) {
  localStorage.setItem("wallets", JSON.stringify(array));
}

function getFromLocalStorage() {
  return JSON.parse(localStorage.getItem("wallets"));
}

function renderWalletsIntoSelecor() {
  if (checkLocalStorage()) {
    for (let wallet of arrOfWallets) {
      Wallet.render(wallet)
    }
  }
}

deleteWalletBtn.addEventListener('click', () => {
  deleteWallet()
  walletSelector.innerHTML = ''
  if (arrOfWallets.length !== 0) {
    UpdateLocalStorage().forEach(wallet => {
      Wallet.render(wallet)
    })
    let currentWallet = arrOfWallets.find(wallet => wallet.name === walletSelector.value)
    list.innerHTML = ''
    for (let transaction of currentWallet.transactions) {
      Transaction.renderTransaction(transaction)
    }
    Wallet.renderContentsOfWallet(currentWallet)
  } else {
    localStorage.clear()
    goToPage(transactionPage, noWalletPage)
  }
})

function deleteWallet() {
  let newArr = [...arrOfWallets]
  for (let i = 0; i < newArr.length; i++) {
    if (newArr[i].name === walletSelector.value) {
      arrOfWallets.splice(i, 1)
    }
  }
}

function seperateTags(tagsString) {
  let arrOfTags = tagsString.match(/[a-zA-Z0-9]+/g);
  return arrOfTags
}

function changeTagsColor() {
  let arrOfBadgeClasses = [
    "badge badge-primary",
    "badge badge-secondary",
    "badge badge-success",
    "badge badge-warning",
    "badge badge-info",
    "badge badge-danger"
  ]
  if (colorIndex < arrOfBadgeClasses.length) {
    return arrOfBadgeClasses[colorIndex]
  } else {
    colorIndex = 0;
    return arrOfBadgeClasses[colorIndex]
  }
}

addTransactionForm.addEventListener('submit', (e) => {
  e.preventDefault()
  let amount = Number(transaction.value);
  let note = transactionNote.value;
  let type;
  let typeRadio = document.querySelector('input[name="typeOfTransAction"]:checked');
  if (typeRadio === null) {
    type = 'income'
  } else {
    type = typeRadio.value
  }
  Date.prototype.today = function () {
    return ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + this.getFullYear();
  }
  Date.prototype.timeNow = function () {
    return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes();
  }
  let datetime = new Date().today() + " | " + new Date().timeNow();
  let tags = seperateTags(transactionTag.value)

  let newTransaction = new Transaction(amount, type, datetime, tags, note)
  Transaction.renderTransaction(newTransaction)
  let newArr = [...arrOfWallets]
  for (let i = 0; i < newArr.length; i++) {
    if (newArr[i].name === walletSelector.value) {
      arrOfWallets[i].transactions.push(newTransaction)

      if (newTransaction.type === 'income') {
        arrOfWallets[i].startingBalance = arrOfWallets[i].startingBalance + amount
      } else {
        arrOfWallets[i].startingBalance = arrOfWallets[i].startingBalance - amount
      }
    }
  }
  UpdateLocalStorage()
  Transaction.renderAllTransactions()
  let currentWallet = arrOfWallets.find(wallet => wallet.name === walletSelector.value)
  Wallet.renderContentsOfWallet(currentWallet)
  addTransactionForm.reset()
})

walletSelector.addEventListener('change', (e) => {
  let currentWallet = arrOfWallets.find(wallet => wallet.name === e.target.value)
  list.innerHTML = ''
  for (let transaction of currentWallet.transactions) {
    Transaction.renderTransaction(transaction)
  }
  Wallet.renderContentsOfWallet(currentWallet)
})

function loopThroughTags(tags) {
  let spans = ''
  for (tag of tags) {
    spans += `<span class="badge ${changeTagsColor()} mr-2">${tag}</span>`
    colorIndex++
  }
  return spans
}

function UpdateLocalStorage() {
  localStorage.clear()
  storeInLocalStorage(arrOfWallets)
  return getFromLocalStorage()
}