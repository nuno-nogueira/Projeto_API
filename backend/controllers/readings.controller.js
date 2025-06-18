const collection_guides = require("../models/collection-guides.model.js")
const { updateGuideStatusById } = require('./collection-guides.controller.js');
const db = require('../models/db.js');
const { ErrorHandler } = require("../utils/error.js"); 
const { Op } = require('sequelize'); // necessary operators for Sequelize

const Reading = db.RFIDReading;
const User = db.User;

let getReadingsByWasteType = async (req, res, next) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({ errorMessage: "No access token provided" });
        }

        if (parseInt(req.params.user_id) !== req.loggedUserId && req.loggedUserRole !== "admin") {
            return res.status(403).json({ success: false, msg: "You are not authorized to access this information!"})
        }
        
         const user = await User.findByPk(req.params.user_id, {
            attributes: ['address_point_id']
        })

         if (!user) {
            return res.status(404).json({ success: false, msg: `User ID ${req.params.user_id} not found.` });
        }        

        // Find the ID given in the URL as a PK
        let readings = await Reading.findAll({
            attributes: ['weight_collected', 'reading_date'],
            include: [
                {
                    model: db.Container,
                    attributes: ['container_id'],
                    where: {
                        collection_point_id: user.address_point_id
                    },
                    include: [
                        {
                            model: db.Waste_Type,
                            attributes: ['name'],
                        }   
                    ]
                }              
            ]
        })

        res.status(200).json({
            total: readings.length,
            data: readings
        }); 
    } catch (err) {
        next(err)
    }
}

let getReadingsByGuide = async (req, res, next) => {
    /**
     * Gets all RFID readings associated with a specific collection guide (by guide ID)
     * This is used to know which containers were collected during that guide's route
     */
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({ errorMessage: "No access token provided" });
        }

        if (req.loggedUserRole !== "motorista" && req.loggedUserRole !== "admin") {
            return res.status(403).json({ success: false,
                msg: "You must be MOTORISTA or ADMIN!"
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
        if (req.loggedUserRole !== "motorista" && req.loggedUserRole !== "admin") {
            return res.status(403).json({ success: false,
                msg: "You must be MOTORISTA or ADMIN!"
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
    if (req.loggedUserRole !== "motorista" && req.loggedUserRole !== "admin") {
        return res.status(403).json({ success: false,
            msg: "You must be MOTORISTA or ADMIN!"
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
    getReadingsByWasteType,
    getReadingsByGuide,
    addReading,
    updateReading
}