// Needed Resources
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')
const authUser = require("../utilities/account-validation")
const express = require("express")
const router = new express.Router()
const accountCont = require("../controllers/accountController")

//Route to get the login page
router.get("/login", accountCont.buildLoginView)

//Route to get the login page
router.post("/login", /*regValidate.loginRules(), regValidate.checkLoginData,*/ accountCont.accountLogin)

// Protected route example
/*router.get('/profile', authUser.ensureAuthenticated, accountCont.displayProfile);*/

//Route to get the register page
router.get("/signup", accountCont.buildRegisterView)

//Route to get the access to dashboard
router.post('/register', regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountCont.registerAccount))

router.get("/", utilities.checkLogin, accountCont.buildLoggedinView)

module.exports = router

