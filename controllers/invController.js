const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */

invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  }

  /* ***************************
 *  Build car Details by inventory id view
 * ************************** */

invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getInventoryByInventoryId(inventory_id)
  console.log(data)
  const vehicleTemplate = await utilities.buildCarDetailsDisplay(data[0])
  let nav = await utilities.getNav()
  console.log("Vehicle Make:", data[0].inv_make);
  console.log("Vehicle Model:", data[0].inv_model);
  const vehicleMake = data[0].inv_make;
  const vehicleModel = data[0].inv_model
  res.render("./inventory/type", {
    title:`${vehicleMake} ${vehicleModel}`,
    nav,
    vehicleTemplate,
  })
}

module.exports = invCont