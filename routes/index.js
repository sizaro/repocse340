// Needed Resources
const express = require("express")
const router = new express.Router()
const accountCont = require("../controllers/baseController")
const searchCont = require("../controllers/searchController")
const invCont = require("../controllers/invController")
const clasCont = require("../controllers/classification")

router.get("/", accountCont.buildHome)
router.get("/search", searchCont.buildSearch)
router.get("/inv", invCont.buildAddCarView)
router.get("/newclassification", clasCont.newClassification)
/*router.get("/newcar", clasCont.newCar)
router.get("/addnewclassification", clasCont.addNewClassification)
router.get("/addnewcar", clasCont.addNewCar)*/

module.exports = router