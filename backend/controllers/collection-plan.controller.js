const { where } = require('sequelize');
const db = require('../models/db.js'); // Import the database connection
const Collection_Plan = db.Collection_Plan;
const { ErrorHandler } = require("../utils/error.js");

let getPlan = async (req, res, next) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({ errorMessage: "No access token provided" });
        }
        if (req.loggedUserRole !== "admin" && req.loggedUserRole !== "morador") {
            return res.status(403).json({
                success: false,
                msg: "This request required ADMIN or CITIZEN role!"
            })
        };

        let plan = await Collection_Plan.findAll({
            include: [
                {
                    model:db.Waste_Type,
                    atributes: ['waste_type_id','identifying_color','name'],
                }]
        });

        //If not found
        if (!plan) return res.status(404).json({ error: 'collection plan not found' });
        res.json(plan);

        return res.status(200).json({
            total: plan.count,
            data: plan.rows
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getPlan
}