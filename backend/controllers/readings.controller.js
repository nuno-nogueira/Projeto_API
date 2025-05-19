const collection_guides = require("../models/collection-guides.model.js")
const db = require('../models/db.js');
const { ErrorHandler } = require("../utils/error.js"); 

let getReadingsByGuide = async (req, res, next) => {
    try {
        const guideID = req.params.guideID;
        const readings = await db.RFIDReading.findAll({
            where: 
            { 
                collection_guide_id: guideID
            } 
        });
        res.status(200).json(readings);
    } catch (err) {
        next(err);
    }
};

let addReading = async (req, res, next) => {
    try {
        const { container_id, collection_guide_id, reading_date, weight_collected } = req.body;

        if (!collection_guide_id || !reading_date || weight_collected === undefined) {
            return res.status(400).json({ errorMessage: 'Campos obrigatórios em falta.' });
        }

        const newReading = await db.RFIDReading.create({
            container_id, collection_guide_id, reading_date, weight_collected
        });

        res.status(201).json(newReading);

    } catch (err) {
        next(err);
    }
};

module.exports = {
    getReadingsByGuide,
    addReading
}