const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */

Util.getNav = async function(req, res, next) {
    let data = await invModel.getClassification()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list += 
        '<a href="/inv/type/' +
         row.classification_id + 
         ' "title="See our inventory of' +
          row.classification_name + 
          'vehicles">' + row.classification_name + 
          "<a/>"
        list+= "</li>"
    });
    list+= "</ul>"
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
          <p class="description">${data.inv_description}</p>
          <img src="${data.inv_image}" alt="image of ${data.inv_make}" title="details of ${data.inv_make}" class="inventory-image">
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
              <p>${data.inv_miles}</p>
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
  

module.exports = Util