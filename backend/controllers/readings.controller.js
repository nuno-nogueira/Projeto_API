const collection_guides = require("../models/collection-guides.model.js")
const db = require('../models/db.js');
const { ErrorHandler } = require("../utils/error.js"); 

const Container = db.Container;
const Collection_Point = db.Collection_Point;
const User = db.User;
const Waste_type = db.Waste_Type;
const Reading = db.RFIDReading;

let getReadingsByWasteType = async (req, res, next) => {
    try {
        if (parseInt(req.params.user_id) !== req.loggedUserId) {
            return res.status(403).json({ success: false, msg: "You are not authorized to access this information!"})
        }

        // Find the ID given in the URL as a PK
        let readings = await Reading.findAll({
            attributes: ['weight_collected', 'reading_date'],
            include: [
                {
                    model: db.Container,
                    include: [
                        {
                            model: db.Collection_Point,
                            include: [
                                {
                                    model: db.User,
                                    where: {
                                        user_id: req.params.user_id
                                    },
                                }
                            ]
                        },
                        {
                            model: db.Waste_Type,
                            attributes: ['name'],
                        }
                    ]
                }                  
            ],
        })

        if (!readings) {
            throw new ErrorHandler(404, `Cannot find any USER with ID ${req.params.user_id}.`);
        }

        res.status(200).json(readings); 
    } catch (err) {
        next(err)
    }
}

let getReadingsByGuide = async (req, res, next) => {
    try {
        const guideID = req.params.guideID;
        const readings = await db.RFIDReading.findAll({
            where: { collection_guide_id: guideID} 
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
            return res.status(400).json({ errorMessage: 'All fields are mandatory.' });
        }

        const newReading = await db.RFIDReading.create({
            container_id, collection_guide_id, reading_date, weight_collected
        });

        res.status(201).json(newReading);

    } catch (err) {
        next(err);
    }
};

let updateReading = async (req, res, next) => {

    const { readingID } = req.params;
    const { weight_collected } = req.body;
    try {
        const updated = await db.RFIDReading.update(
        { weight_collected: weight_collected },
        { where: { rfid_reading_id: readingID } }
        );

        res.status(200).json({ message: 'Reading updated.' });
    } catch (err) {
        console.error(err)
        res.status(500).json({ errorMessage: 'Error updating reading.' });
    }
};

module.exports = {
    getReadingsByWasteType,
    getReadingsByGuide,
    addReading,
    updateReading
}