// Needed Resources
const express = require("express")
const router = new express.Router()
const accountCont = require("../controllers/baseController")
const searchCont = require("../controllers/searchController")
const invCont = require("../controllers/invController")
const clasCont = require("../controllers/classification")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

router.get("/", utilities.handleErrors(accountCont.buildHome))
router.get("/search", utilities.handleErrors(searchCont.buildSearch))
router.get("/inv", utilities.handleErrors(invCont.buildAddCarView))
router.get("/newclassification", utilities.handleErrors(clasCont.newClassification))
/*router.get("/newcar", clasCont.newCar)
router.post("/addnewclassification", clasCont.addNewClassification)c
router.get("/addnewcar", clasCont.addNewCar)*/
//regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountCont.registerAccount))
router.post("/addnewclassification", regValidate.classificationRules(), regValidate.checkClassificationData, utilities.handleErrors(clasCont.addNewClassification))
router.post("/addnewcar", regValidate.newCarRules(), regValidate.checknewCarData, utilities.handleErrors(invCont.addNewCar))
router.get("/newcar", utilities.handleErrors(invCont.newCar))


module.exports = router