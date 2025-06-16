const collection_guides = require("../models/collection-guides.model.js")
const { updateGuideStatusById } = require('./collection-guides.controller.js');
const db = require('../models/db.js');
const { ErrorHandler } = require("../utils/error.js"); 

let getReadingsByGuide = async (req, res, next) => {
    /**
     * Gets all RFID readings associated with a specific collection guide (by guide ID)
     * This is used to know which containers were collected during that guide's route
     */
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({ errorMessage: "No access token provided" });
        }
        if (req.loggedUserRole !== "motorista") {

            return res.status(401).json({ success: false,
                msg: "Your access token has expired! Please login again!"
            })
        };
        
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
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({ errorMessage: "No access token provided" });
        }
        if (req.loggedUserRole !== "motorista") {
            return res.status(401).json({ success: false,
                msg: "Your access token has expired! Please login again!"
            })
        };

        const { container_id, collection_guide_id, reading_date, weight_collected, collection_status } = req.body;
        const booleanStatus = collection_status === true || collection_status === 'true';

        if (!collection_guide_id || !reading_date || weight_collected === undefined) {
            return res.status(400).json({ errorMessage: 'All fields are mandatory.' });
        }

        const newReading = await db.RFIDReading.create({
            container_id, collection_guide_id, reading_date, weight_collected, collection_status: booleanStatus
        });

        await updateGuideStatusById(collection_guide_id);

        res.status(200).json(newReading);

    } catch (err) {
        next(err);
    }
};

let updateReading = async (req, res, next) => {

    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({ errorMessage: "No access token provided" });
        }
    if (req.loggedUserRole !== "motorista") {
        return res.status(401).json({ success: false,
            msg: "Your access token has expired! Please login again!"
        })
    };

    const { readingID } = req.params;
    const { weight_collected } = req.body;
    const { collection_status } = req.body;
    
    try {        
        const status = collection_status === true || collection_status === 1 || collection_status === 'true'
        const updated = await db.RFIDReading.update(
        { 
            weight_collected: weight_collected,
            collection_status: status
         },
        { where: { rfid_reading_id: readingID } },
        );

        const reading = await db.RFIDReading.findByPk(readingID);
        if (reading) {
            await updateGuideStatusById(reading.collection_guide_id);
        }

        res.status(200).json({ message: 'Reading updated.' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getReadingsByGuide,
    addReading,
    updateReading
}