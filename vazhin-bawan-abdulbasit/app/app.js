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
    walletSelector.insertAdjacentHTML('beforeend', `<option value="${wallet.name}">${wallet.name}'s wallet</option>`)
  }
}

navigateToAnAppropriatePage()
renderWalletsIntoSelecor()

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
  createANewWallet()
})

function goToPage(pageToHide, pageToShow) {
  pageToHide.classList.add('hidden')
  pageToShow.classList.remove('hidden')
}

function createANewWallet() {
  newWalletForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let name = walletNameInput.value
    let currency = document.querySelector('input[name="currencyOptions"]:checked').value;
    let balance = walletBalanceInput.value
    let description = walletDescriptionInput.value
    let newWallet = new Wallet(name, currency, balance, [], description)
    Wallet.render(newWallet)
    arrOfWallets.push(newWallet)
    storeInLocalStorage(arrOfWallets)
    closeModalBtn.click()
    goToPage(newWalletPage, transactionPage)
  })
}

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
  } else {
    localStorage.clear()
    goToPage(transactionPage, noWalletPage)
  }
})

function deleteWallet(){
  let newArr = [...arrOfWallets]
  for (let i = 0; i < newArr.length; i++) {
    if (newArr[i].name === walletSelector.value) {
      arrOfWallets.splice(i, 1)
    }
  }
}

function UpdateLocalStorage(){
  localStorage.clear()
  storeInLocalStorage(arrOfWallets)
  return getFromLocalStorage()
}