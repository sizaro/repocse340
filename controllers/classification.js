
const utilities = require("../utilities")

const clasCont = {}

clasCont.newClassification = async function(req,res) {
    const nav = await utilities.getNav()
    const addClassification = await utilities.buildAddClassification()
    res.render("./inventory/newclassification",
        {
            title:"Add New Classification",
            nav,
            addClassification
        }
    )
}
clasCont.addNewCar = async function(req,res) {
    const nav = await utilities.getNav()
    const addNewCar = await utilities.buildAddNewCar()
    res.render("./inventory/newcar",{
            title:"Add New Vehicle",
            nav,
            addNewCar
        }
    )
}


clasCont.addNewClassification = async function(req,res) {
    const nav = await utilities.getNav()
    const addClassification = await utilities.buildAddClassification()
    res.render("./inventory/newclassification",
        {
            title:"Add New Classification",
            nav,
            addClassification
        }
    )
}
clasCont.addNewCar = async function(req,res) {
    const nav = await utilities.getNav()
    const addNewCar = await utilities.buildAddNewCar()
    res.render("./inventory/newcar",{
            title:"Add New Vehicle",
            nav,
            addNewCar
        }
    )
}

module.exports = clasCont