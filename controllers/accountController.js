require("dotenv").config()
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET
const utilities = require("../utilities")
const acctModel = require("../models/account-model")
const bcrypt = require('bcrypt');

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLoginView(req, res, next) {
    let nav = await utilities.getNav()
    //const loginForm = await utilities.buildLoginForm()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
      //loginForm
    })
  }
  

/* ****************************************
*  Deliver Register view
* *************************************** */
async function buildRegisterView(req, res, next) {
  let nav = await utilities.getNav()
  //let RegisterForm = await utilities.buildRegisterForm()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  //const loginForm = await utilities.buildLoginForm();
  //const RegisterForm = await utilities.buildRegisterForm();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);

    const regResult = await acctModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword 
    );

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      );
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null
      });
    }
  } catch (error) {
    console.error('Error during registration:', error);
    req.flash("notice", "An error occurred during registration.");
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: error.message,
    });
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await acctModel.getAccountByEmail(account_email)
  const loginForm = await utilities.buildLoginForm()
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      loginForm,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    console.log('Login error:', error);
    throw new Error('Access Forbidden')
  }
}

async function buildLoggedinView(req, res) {
  try {
      const nav = await utilities.getNav();
      req.flash("notice"); 
      const loggedInUser = 'Your Logged In'
      res.render("account/loggedin", {
          title: "User Account",
          nav,
          loggedInUser
      });
  } catch (error) {
      console.error("Error building user view:", error);
      req.flash("notice", "An error occurred while trying to access your account.");
      res.redirect("/account/login");
  }
}





module.exports = { buildLoginView, buildRegisterView, registerAccount, accountLogin, buildLoggedinView}