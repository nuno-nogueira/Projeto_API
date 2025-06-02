const db = require('../models/db.js'); // Import the database connection
const Collection_Plan = db.Collection_Plan;
const { ErrorHandler } = require("../utils/error.js");

let getPlan = async (req, res, next) => {
    try {
        if (req.loggedUserRole !== "admin" && req.loggedUserRole !== "morador") {
            return res.status(403).json({
                success: false,
                msg: "This request required ADMIN or CITIZEN role!"
            })
        };
        const plan = await Collection_Plan.findAll();
        res.json(plan);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getPlan
}