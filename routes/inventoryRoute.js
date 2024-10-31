// Needed Resources
const express = require("express")
const router = new express.Router()
const invCont = require("../controllers/invController")
const utilities = require("../utilities")
const invController = require("../controllers/invController")

//Route to build inventory by classification view
router.get("/type/:classificationId", invCont.buildByClassificationId);
router.get("/detail/:inventoryId", invCont.buildByInventoryId)
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
//Route to edit the inventory item
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryItem))
//Route that posts the data to be updated
router.post("/update/", invController.updateInventory)


module.exports = router
