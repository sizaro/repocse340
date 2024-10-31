const pool = require("../database/index")

/* *****************************
*   Retrieve all joined data
* *************************** */
async function searchAll() {
    const query = `
        SELECT 
            c.classification_name, 
            i.inv_make, 
            i.inv_model, 
            i.inv_year, 
            i.inv_description, 
            i.inv_image, 
            i.inv_thumbnail, 
            i.inv_price, 
            i.inv_miles, 
            i.inv_color
        FROM 
            public.classification c
        FULL OUTER JOIN 
            public.inventory i
        ON 
            c.classification_id = i.classification_id
        ORDER BY 
            i.inv_make;
    `;

    try {
        const result = await pool.query(query);
        return result.rows; // Return rows only to work with data directly
    } catch (error) {
        console.error("Database query error:", error);
        throw error;
    }
}

module.exports = { searchAll };
