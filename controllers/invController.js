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



//handling displaying the car form

invCont.newCar = async function(req,res) {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  //const addNewCar = await utilities.buildAddNewCar()
  res.render("./inventory/newcar",{
          title:"Add New Vehicle",
          nav,
          errors:null,
          classificationList
      }
  )
}

//handling the adding new car to the database.

invCont.addNewCar = async function (req, res) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList()
  let classificationSelect = await utilities.buildAddClassification()
  const vehicleManagement = await utilities.vehicleManagement()
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  } = req.body;

  try {
    // Call the model function to insert a new car record
    const carResult = await invModel.addNewCar(
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    );

    if (carResult) {
      req.flash(
        "notice",
        `Successfully added the new car: ${inv_make} ${inv_model}.`
      );
      res.status(201).render("inventory/vehiclemanagement", {
        title: "Vehicle Management",
        nav,
        classificationSelect,
        vehicleManagement,
        errors: null
      });
    } else {
      req.flash("notice", "Failed to add the new car. Please try again.");
      res.status(501).render("inventory/newcar", {
        title: "Add New Car",
        nav,
        errors: null,
        classificationList
      });
    }
  } catch (error) {
    console.log("Error while adding new car:", error);
    req.flash("notice", "An error occurred while adding the car.");
    res.status(500).render("inventory/newcar", {
      title: "Add New Car",
      nav,
      errors: null,
      classificationList
      
    });
  }
}

invCont.buildAddCarView = async function (req, res) {
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    const vehicleManagement = await utilities.vehicleManagement()
    res.render("./inventory/vehiclemanagement", 
      {
        title:"Vehicle Management",
        nav,
        vehicleManagement,
        classificationSelect

      }
    )
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


  /* ***************************
 *  Build car Details by inventory id view
 * ************************** */

invCont.editInventoryItem = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    const nav = await utilities.getNav()
    const itemData = await invModel.getInventoryByInventoryId(inv_id)
    console.log("this is the data to be updated ", itemData)
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
    res.render("./inventory/editinventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id: itemData[0].inv_id,
      inv_make: itemData[0].inv_make,
      inv_model: itemData[0].inv_model,
      inv_year: itemData[0].inv_year,
      inv_description: itemData[0].inv_description,
      inv_image: itemData[0].inv_image,
      inv_thumbnail: itemData[0].inv_thumbnail,
      inv_price: itemData[0].inv_price,
      inv_miles: itemData[0].inv_miles,
      inv_color: itemData[0].inv_color,
      classification_id: itemData[0].classification_id
    })
  }


  /* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}
  



module.exports = invCont