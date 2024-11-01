// Needed Resources
const express = require("express")
const router = new express.Router()
const accountCont = require("../controllers/baseController")
const searchCont = require("../controllers/searchController")
const invCont = require("../controllers/invController")
const clasCont = require("../controllers/classification")
const utilities = require("../utilities/")

router.get("/", utilities.handleErrors(accountCont.buildHome))
router.get("/search", utilities.handleErrors(searchCont.buildSearch))
router.get("/inv", utilities.handleErrors(invCont.buildAddCarView))
router.get("/newclassification", clasCont.newClassification)
/*router.get("/newcar", clasCont.newCar)
router.get("/addnewclassification", clasCont.addNewClassification)
router.get("/addnewcar", clasCont.addNewCar)*/

module.exports = router