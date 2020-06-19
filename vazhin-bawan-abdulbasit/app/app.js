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
let arrOfWallets;
checkLocalStorage()

createNewWalletBtnTransactionPage.addEventListener('click', () => {
  goToPage(transactionPage, newWalletPage)
})

closeModalBtn.addEventListener('click', () => {
  console.log(checkIfTheresAnyWallets())
  if(checkIfTheresAnyWallets()){
    goToPage(newWalletPage, transactionPage)
  } else {
    goToPage(newWalletPage, noWalletPage)
  }
})

function checkIfTheresAnyWallets(){
  if (arrOfWallets.length === 0 && getFromLocalStorage() === null){
    return false
  } else {
    return true
  } 
}

function checkLocalStorage(){
  if(getFromLocalStorage() === null){
    arrOfWallets = []
  } else {
    arrOfWallets = getFromLocalStorage();
  }
}

createNewWalletBtn.addEventListener('click', () => {
  goToPage(noWalletPage, newWalletPage)
  createANewWallet()
})

function goToPage(pageToHide, pageToShow){
  pageToHide.classList.add('hidden')
  pageToShow.classList.remove('hidden')
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
    closeModalBtn.click()
    goToPage(newWalletPage, transactionPage)
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