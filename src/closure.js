/*
 * lektorium course: Java Script
 * homework #4.1: task 2 -- closure: constructor with 2 private methods & props
 * made by Vitaliy Dovgan
 */

/* An implementation of a secured credit account.
 * To access the account one must provide a valid password.
 * The password can be changed at any time. */
var SecureAccount = function (initPwd, initCash) {
  const defaultPassword = 'P@ssw0rd'
  var password = defaultPassword // 1st private prop
  var balance = 0 // 2nd private prop

  /* 1st private method.
   * Checks the password; changes it if newPwd was passed.
   * newPwd is subject to trimming, currPwd is checked as-is.
   * Returns true if everything went fine, and false otherwise.
   *
   * To be "strictly secure", the method's code features some paranoid stuff
   * (for the sake of avoiding some imaginary future miscoding etc.) */
  var processPwd = function (currPwd, newPwd) {
    if (currPwd !== password) return false // if currPwd isn't a valid current password -- decline immediately

    if ((currPwd === password) && (arguments.length > 1)) { // newPwd supplied, trying to set new password
      if ((typeof newPwd === 'string') && (newPwd.trim().length >= 8)) { // if newPwd passed is a string min. 8 chars in length
        password = newPwd.trim() // set the new password
        return true // password changed
      } else {
        return false // newPwd passed is incorrect
      }
    } else { // no need to set new password, just checking currPwd
      return currPwd === password // one more extra check, just for being cautious (currPwd have to be the valid current password here anyway)
    }
    return false // being paranoid again (actually, the execution flow isn't supposed to get here at all)
    // speaking about passwords, it's better to return a false denial than a false approval
  }

  /* 2nd private method.
   * If newMoney was passed:
   * - if newMoney = 0 -- zeroes the account balance
   * - if newMoney > 0 -- adds newMoney to the account balance
   * - if newMoney < 0 -- subtracts newMoney from the account balance
   * Anyway, returns the current account balance */
  var processMoney = function (pwd, newMoney) {
    if (!processPwd(pwd)) return false // checking the password

    if (arguments.length > 1) { // changing the balance only if 2nd argument was passed
      if (!Number.isFinite(newMoney)) return NaN // if newMoney passed is incorrect
      // zero the account balance if 0 was passed
      // deposit to (or withdraw from) the account if a non-zero number was passed
      balance = newMoney === 0 ? 0 : (balance + newMoney)
    }
    return balance // acting as a getter anyway
  }

  /* Initiates depositing to (or withdrawal from) the account if newCash was passed.
   * Anyway, returns current account balance. */
  this.flowTheCash = function (pwd, newCash) {
    if (arguments.length > 1) {
      if (newCash === 0) return processMoney(pwd) // filtering 0 out to prevent balance zeroing, and just checking the account balance
      return processMoney(pwd, newCash)
    } else { // avoiding passing of void newCash to processMoney()
      return processMoney(pwd) // passing void (undefined) newCash here would return NaN instead of the account balance
    }
  }

  /* Sets the account:
   * - to 0 -- if newCash wasn't passed
   * - to newCash -- ONLY if a number was passed for newCash */
  this.resetAccount = function (pwd, newCash) {
    if (arguments.length > 1) {
      if (!Number.isFinite(newCash)) return NaN // don't do anything if newCash passed is incorrect
      // newCash passed is correct, so resetting the account to 0, then adding newCash to it
      if (processMoney(pwd, 0) === false) { // strict equality is needed here
        return false // password is incorrect
      }
      return processMoney(pwd, newCash) // adding newCash to the zeroed account
    } else { // if newCash wasn't passed
      return processMoney(pwd, 0) // resetting the account to 0
    }
  }

  /* Initiates a password change action */
  this.setPassword = function (pwd, newPwd) {
    return processPwd(pwd, newPwd)
  }

  if (!this.setPassword(defaultPassword, initPwd)) return {} // if initPwd is incorrect
  this.resetAccount(initPwd.trim(), initCash)
}

/* Interprets the output of public methods */
var getResponce = function (accountResponce) {
  // since NaN !== NaN, than we can't use "case NaN:" (see below),
  // so turning NaN into string to make comparison possible
  accountResponce = Number.isNaN(accountResponce) ? 'NaN' : accountResponce

  switch (accountResponce) {
    case true:
      return 'The password was changed successfully'
      break
    case false:
      return 'The password is incorrect'
      break
    case 'NaN': // no way for "case NaN:"
      return 'The cash is incorrect'
      break
    default:
      return 'Account balance: ' + accountResponce
      break
  }
}

var myAccount, myAnotherAccount

console.clear()

// demoing things
myAccount = new SecureAccount('999999999', 0)
myAnotherAccount = new SecureAccount('  11111111 ', 70)
// both accounts are independent from each other
console.log('myAccount >>', getResponce(myAccount.flowTheCash('999999999')))
console.log('myAnotherAccount >>', getResponce(myAnotherAccount.flowTheCash('11111111')))
console.log('--------------------------------------------')

console.log('myAccount - reset to 10 >>', getResponce(myAccount.resetAccount('999999999', 10)))
console.log('myAccount - change pwd >>', getResponce(myAccount.setPassword('999999999', ' 888888888  ')))
console.log('myAccount - withdraw 30 >>', getResponce(myAccount.flowTheCash('888888888', -30)))

console.log('--------------------------------------------')

console.log('myAnotherAccount - deposit 40 >>', getResponce(myAnotherAccount.flowTheCash('11111111', 40)))
console.log('myAnotherAccount - wrong pwd >>', getResponce(myAnotherAccount.setPassword('11111111', '2222'))) // too short pwd
console.log('myAnotherAccount - reset to 0 >>', getResponce(myAnotherAccount.resetAccount('11111111')))

console.log('--------------------------------------------')
console.log('myAccount >>', getResponce(myAccount.flowTheCash('888888888')))
console.log('myAnotherAccount >>', getResponce(myAnotherAccount.flowTheCash('11111111')))
