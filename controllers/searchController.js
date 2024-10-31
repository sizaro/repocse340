const utilities = require("../utilities")
const models = require("../models/search-all")
const searchController = {}

searchController.buildSearch = async function (req, res) {
    const { inputValue } = req.query; 
    console.log("Input Value:", inputValue); 

    const nav = await utilities.getNav();
    try {
        const searchResults = await models.searchAll();
        console.log("Search Results:", searchResults);

        if (!Array.isArray(searchResults)) {
            console.log('searchResults is not an array:', searchResults);
            return res.render("search", { title: "Search Results", nav, searchView: "No results found." });
        }

const searchInput = inputValue ? inputValue.toString().toLowerCase() : "";

const filteredResults = searchResults.filter(res => {
    console.log("Row in searchResults:", res);

    const match = Object.values(res).some(value => {
        console.log("Checking value:", value); 

        return value.toString().toLowerCase().includes(searchInput); 
    });

    console.log("Match found:", match);
    return match;
});


    const searchView = await utilities.searchAllDisplay(filteredResults);
    console.log("Final search view:", searchView); 
    res.render("search", { title: "Search Results", nav, searchView });
    } catch (error) {
        console.error("Error fetching or filtering results:", error);
        res.render("search", { title: "Search Results",nav, searchView });
    }
}

module.exports = searchController;
