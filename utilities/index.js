const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */

/*Util.getNav = async function(req, res, next) {
    let data = await invModel.getClassification()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list += 
        '<a href="/inv/type/' + row.classification_id + '" title="See our inventory of ' + row.classification_name + ' vehicles">' + row.classification_name + '</a>'
        list+= "</li>"
    });
    list+= "</ul>"
    return list
    
}*/

Util.getNav = async function(req, res, next) {
  let data = await invModel.getClassification()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
      list += '<li>'
      list += '<a href="/inv/type/' + row.classification_id + '" title="See our inventory of ' + row.classification_name + ' vehicles">' + row.classification_name + '</a>'
      list += '</li>'
  });
    list +='<li id="form-li"><form action="/search" method="get" id="searchAll"><div id="input-container"><input type="text" id="inputValue" placeholder="Search All" name="inputValue" ><button id="searchButton">Click</button></div></form></li>'
  list += "</ul>"
  return list
}



/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_image 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

Util.buildCarDetailsDisplay = async function(data) {
    console.log(data)
    return `
      <div class="inventory-details">
        <div class="first-details">
          <img src="${data.inv_image}" alt="image of ${data.inv_make}" title="details of ${data.inv_make}" class="inventory-image">
            <p class="description">${data.inv_description}</p>
        </div>
        <div class="second-details">
          <h2 class="details-title">${data.inv_year} ${data.inv_make} ${data.inv_model}</h2>
          <div class="third-details">
            <div class="price">
              <h3>Price</h3>
              <p>$${new Intl.NumberFormat('en-US').format(Number(data.inv_price))}</p>
            </div>
            <div class="miles">
              <h3>Miles</h3>
              <p>${new Intl.NumberFormat('en-US').format(Number(data.inv_miles))}</p>
            </div>
            <div class="color">
              <h3>Color</h3>
              <p>${data.inv_color}</p>
            </div>
            <div class="contact">
              <h3>Contact us at +256758116304</h3>
              <button class="purchase">Start-Purchase</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

Util.buildLoginForm = async function() {
    return` <div class="form-container">
        <form action="/account/login" method="post" id="formElement">
            <label for="email" id="account_email" >Email:</label><br>
            <input type="email" name="account_email" id="account_email" required><br>
            <label for="password" id="account_password" >Password:</label><br>
            <input type="text" name="account_password" id="account_password" required><br>
            <button class="login-button">LOGIN</button><br>
            <p id="no-account">No account? <span id="signup-link"><a href="/account/signup">Sign-up</a></span></p>
        </form>
    </div>
    `    
  }

Util.buildRegisterForm = async function() {
    return` <div class="form-container">
        <form action="/account/register" method="post" class="formElement">
            <label for="first_name" id="first_name" >First name:</label>
            <input type="text" name="account_firstname" id="accountFirstname" required value="<%= locals.account_firstname %>"><br>
            <label for="last_name" id="last_name" >Last name:</label>
            <input type="text" name="account_lastname" id="accountLastname" required value="<%= locals.account_lastname %>"><br>
            <label for="email" id="email_address" >Email Address:</label>
            <input type="email" name="account_email" id="account_emailaddress" title="enter a valid email address" required><br>
            <label for="password" id="account_password" >Password:</label>
            <input type="text" name="account_password" id="account_password" pattern="^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s).{12,}$" required>
            <div class="password-description">
            <p id="psw-exp">Password must be minimum of 12 characters and include 1 Capital letter, 1 number and 1 special character.</p>
            </div>
            <button id="show-password" onclick="showPassword()">Show Password</button><br>
            <button id="register-button">Register</button><br>
        </form>
    </div>
    `    
  }
  Util.searchAll = async function(data) {
    console.log(data); 
    return data.map(carData => {
        return `
            <div class="allinv-details">
              <div class="allfirst-details">
                <img src="${carData.inv_image || '/images/default-image.jpg'}" alt="Image of ${carData.inv_make || 'vehicle'}" title="Details of ${carData.inv_make || 'vehicle'}" class="allinventory-image">
              </div>
              <div class="allsecond-details">
                <h2 class="alldetails-title">${carData.inv_year || ''} ${carData.inv_make || ''} ${carData.inv_model || 'Model Unknown'}</h2>
                <h3 class="allclassification">${carData.classification_name || 'Classification Unknown'}</h3>
                <div class="allprice">
                  <h3>Price</h3>
                  <p>$${carData.inv_price ? new Intl.NumberFormat('en-US').format(Number(carData.inv_price)) : 'N/A'}</p>
                </div>
                <button class="allpurchase">Start Purchase</button>
              </div>
            </div>
        `;
    }).join('');
};

Util.searchAll = async function(data) {
  console.log(data); 
  return data.map(carData => {
      return `
          <div class="allinv-details">
            <div class="allfirst-details">
              <img src="${carData.inv_image || '/images/default-image.jpg'}" alt="Image of ${carData.inv_make || 'vehicle'}" title="Details of ${carData.inv_make || 'vehicle'}" class="allinventory-image">
            </div>
            <div class="allsecond-details">
              <h2 class="alldetails-title">${carData.inv_year || ''} ${carData.inv_make || ''} ${carData.inv_model || 'Model Unknown'}</h2>
              <h3 class="allclassification">${carData.classification_name || 'Classification Unknown'}</h3>
              <div class="allprice">
                <h3>Price</h3>
                <p>$${carData.inv_price ? new Intl.NumberFormat('en-US').format(Number(carData.inv_price)) : 'N/A'}</p>
              </div>
              <button class="allpurchase">Start Purchase</button>
            </div>
          </div>
      `;
  }).join('');
};


/*
Util.searchAll = async function(data) {
    console.log(data); 
  return data.map(carData => {

 return `
        <div class="allinv-details">
          <div class="allfirst-details">
            <p class="description">${carData.inv_description || ''}</p>
            <img src="${carData.inv_image || '/images/default-image.jpg'}" alt="image of ${carData.inv_make || 'vehicle'}" title="details of ${carData.inv_make || 'vehicle'}" class="inventory-image">
          </div>
          <div class="allsecond-details">
            <h2 class="alldetails-title">${carData.inv_year || ''} ${carData.inv_make || ''} ${carData.inv_model || 'Model Unknown'}</h2>
            <h3 class="allclassification">${carData.classification_name || 'Classification Unknown'}</h3>
            <div class="allthird-details">
              <div class="price">
                <h3>Price</h3>
                <p>$${carData.inv_price ? new Intl.NumberFormat('en-US').format(Number(carData.inv_price)) : 'N/A'}</p>
              </div>
              <div class="miles">
                <h3>Miles</h3>
                <p>${carData.inv_miles || ''}</p>
              </div>
              <div class="color">
                <h3>Color</h3>
                <p>${carData.inv_color || ''}</p>
              </div>
              <div class="contact">
                <h3>Contact us at +256758116304</h3>
                <button class="purchase">Start Purchase</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  };*/
  
Util.vehicleManagement = async function() {
  return `
        <div id="vehicle-management">
            <a href="/newclassification">Add New Classification</a><br>
            <a href="/newcar">Add New Vehicle</a>
        </div>
        <h2>Manage Inventory</h2>
        <p>Select A classification from the List to see the items belonging to the classification</p>
  `  
}

Util.buildAddClassification = async function() {
  return `
  <form action="/addnewclassification" id="classificationForm" method="post">
        <p>FIELD IS REQUIRED</p>
        <div id="form-area">
            <h2>Classification Name</h2>
            <p>NAME MUST BE ALPHABETIC CHARACTERS ONLY</p>
            <label for="classificationName">Classification Name</label>
            <input type="text" id="classificationName" name="classification_name" required
                   pattern="^[A-Za-z]+" title="Only letters spaces are not allowed">
            <button type="submit">Add Classification</button>
        </div>
    </form>
  ` 
}

Util.buildAddNewCar = async function() {
  return `
     <form action="/addnewcar" id="newCarForm">

        <p>ALL FIELDS ARE REQUIRED</p>
        <div id="newCarFormArea">
                <h2>Add New Car</h2>
        
            <label for="classificationSelect">Classification</label>
            <select id="classificationSelect" name="classification_name" required>
                <option value="" disabled selected>Select Classification</option>
                <option value="Sedan">Sedan</option>
                <option value="Sport">Sport</option>
                <option value="NewCar">New Car</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
            </select>
        
            <label for="carMake">Car Make</label>
            <input type="text" id="carMake" name="inv_make" required minlength="3"
                pattern="^[a-z]+$" title="Only lowercase letters, minimum of 3 characters, no spaces">
        
            <label for="carModel">Model</label>
            <input type="text" id="carModel" name="inv_model" required minlength="3"
                pattern="^[A-Za-z]+$" title="Only letters, minimum of 3 characters, no spaces">
        
            <label for="carDescription">Description</label>
            <textarea id="carDescription" name="inv_description" required minlength="3"
                    title="Minimum of 3 characters"></textarea>
        
            <label for="imagePath">Image Path</label>
            <input type="text" id="imagePath" name="inv_image" required value="/image/vehicles/no-image.png"
                pattern="^/image/vehicles/no-image\.png$" title="Path must be '/image/vehicles/no-image.png'">
        
            <label for="thumbnailPath">Thumbnail Path</label>
            <input type="text" id="thumbnailPath" name="inv_path" required value="/image/vehicles/no-image.png"
                pattern="^/image/vehicles/no-image\.png$" title="Path must be '/image/vehicles/no-image.png'">
        
            <label for="price">Price</label>
            <input type="number" id="price" name="inv_price" required min="0" step="0.01" placeholder="decimal or integer">
        
            <label for="year">Year</label>
            <input type="text" id="year" name="inv_year" required pattern="^\d{4}$" placeholder="4-digit year">
        
            <label for="miles">Miles</label>
            <input type="text" id="miles" name="inv_miles" required pattern="^\d{4}$" placeholder="digits only">
      
            <label for="color">Color</label>
            <input type="text" id="color" name="inv_color" required minlength="3" pattern="^[A-Za-z]+$">
        
            <button type="submit">Add Vehicle</button>

        </div>    
            </form>
  ` 
}


Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassification()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }


 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

  /* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
  

module.exports = Util