const utilities = require("../utilities")
  const { body, validationResult } = require("express-validator")
  const validate = {}

  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }

  
  /*  **********************************
  *  Classification Rules
  * ********************************* */
  validate.classificationRules = () => {
    return [
      // firstname is required and must be string
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a classification name with no space in it."),
    ]
  }

  /* ******************************
 * Check data and return errors or continue to classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("/addclassification", {
        errors,
        title: "Add New Classification",
        nav,
        classification_name
      })
      return
    }
    next()
  }

  
  /*  **********************************
  *  New Inventory Rules
  * ********************************* */

  validate.newInventoryRules = () => {
      return [
          // classification_name is required and must be one of the specified values
          body("classification_name")
              .trim()
              .escape()
              .notEmpty()
              .withMessage("Classification is required.")
              .isIn(["Sedan", "Sport", "NewCar", "SUV", "Truck"])
              .withMessage("Invalid classification selected."),
  
          // inv_make is required, only lowercase letters, min 3 characters, no spaces
          body("inv_make")
              .trim()
              .escape()
              .notEmpty()
              .isLength({ min: 3 })
              .matches(/^[a-z]+$/)
              .withMessage("Car make should only contain lowercase letters, at least 3 characters, and no spaces."),
  
          // inv_model is required, only letters, min 3 characters, no spaces
          body("inv_model")
              .trim()
              .escape()
              .notEmpty()
              .isLength({ min: 3 })
              .matches(/^[A-Za-z]+$/)
              .withMessage("Car model should only contain letters, at least 3 characters, and no spaces."),
  
          // inv_description is required, min 3 characters
          body("inv_description")
              .trim()
              .escape()
              .notEmpty()
              .isLength({ min: 3 })
              .withMessage("Description must be at least 3 characters long."),
  
          // inv_image is required, exact path /image/vehicles/no-image.png
          body("inv_image")
              .trim()
              .escape()
              .notEmpty()
              .equals('/image/vehicles/no-image.png')
              .withMessage("Image path must be exactly '/image/vehicles/no-image.png'."),
  
          // inv_path is required, exact path /image/vehicles/no-image.png
          body("inv_path")
              .trim()
              .escape()
              .notEmpty()
              .equals('/image/vehicles/no-image.png')
              .withMessage("Thumbnail path must be exactly '/image/vehicles/no-image.png'."),
  
          // inv_price is required, must be a number, min value 0
          body("inv_price")
              .trim()
              .notEmpty()
              .isFloat({ min: 0 })
              .withMessage("Price must be a number and at least 0."),
  
          // inv_year is required, 4 digits only
          body("inv_year")
              .trim()
              .notEmpty()
              .matches(/^\d{4}$/)
              .withMessage("Year must be a 4-digit number."),
  
          // inv_miles is required, digits only
          body("inv_miles")
              .trim()
              .notEmpty()
              .isNumeric()
              .withMessage("Miles must contain only digits."),
  
          // inv_color is required, only letters, min 3 characters
          body("inv_color")
              .trim()
              .escape()
              .notEmpty()
              .isLength({ min: 3 })
              .matches(/^[A-Za-z]+$/)
              .withMessage("Color should only contain letters and be at least 3 characters long.")
      ];
  };

  
  /* ******************************
 * Check data and return errors or continue to classification
 * ***************************** */
  validate.checkNewVehicleData = async (req, res, next) => {
    const { 
      classification_name, 
      inv_make, 
      inv_model, 
      inv_description, 
      inv_image, 
      inv_path, 
      inv_price, 
      inv_year, 
      inv_miles, 
      inv_color 
    } = req.body;
  
    // Run validation checks and store any errors
    const errors = validationResult(req);
  
    // Check for validation errors
    if (!errors.isEmpty()) {
      const errorArray = errors.array();
  
      // Generate navigation and render page with error messages
      let nav = await utilities.getNav();
      res.render("classification", {
        errors: errorArray,
        title: "Add New Classification",
        nav,
        classification_name,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_path,
        inv_price,
        inv_year,
        inv_miles,
        inv_color
      });
      return;
    }
    
    // If no errors, proceed to the next middleware
    next();
  };

validate.ensureAuthenticated = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).json({ message: "You must be logged in to access this page." });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
    }
}


  
  
  
  module.exports = validate