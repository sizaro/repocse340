// Needed Resources
const express = require("express")
const router = new express.Router()
const invCont = require("../controllers/invController")

//Route to build inventory by classification view
router.get("/type/:classificationId", invCont.buildByClassificationId);
router.get("/detail/:inventoryId", invCont.buildByInventoryId)

module.exports = router
