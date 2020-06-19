let createNewWalletBtn = document.querySelector('#create-new-wallet-btn')
let noWalletPage = document.querySelector('#no-wallet-page')
let newWalletPage = document.querySelector('#new-wallet-page')
let newWalletForm = document.querySelector('#new-wallet-form')
let walletNameInput = document.querySelector('#name-input')
let walletBalanceInput = document.querySelector('#balance-input')
let walletDescriptionInput = document.querySelector('#description-input')
let arrOfWallets = []

createNewWalletBtn.addEventListener('click', () => {
  goToNewWalletPage()
  createANewWallet()
})

function goToNewWalletPage(){
  noWalletPage.classList.add('hidden')
  newWalletPage.classList.remove('hidden')
}

function createANewWallet(){
  newWalletForm.addEventListener('submit', (e)=> {
    e.preventDefault()
    let name = walletNameInput.value
    let currency = document.querySelector('input[name="currencyOptions"]:checked').value;
    let balance = walletBalanceInput.value
    let description = walletDescriptionInput.value
    let newWallet = new Wallet(name, currency, balance, [], description)
    arrOfWallets.push(newWallet)
    storeInLocalStorage(arrOfWallets)
    newWalletForm.reset()
    newWalletPage.classList.add('hidden')
  })
}

function storeInLocalStorage(array){
  localStorage.setItem("wallets", JSON.stringify(array));
}

function getFromLocalStorage(){
  return JSON.parse(localStorage.getItem("wallets"));
}

class Wallet {
  constructor(name, currency, startingBalance, transactions, description){
    this.name = name;
    this.currency = currency;
    this.startingBalance = startingBalance;
    this.transactions = transactions;
    this.description = description;
  }
}