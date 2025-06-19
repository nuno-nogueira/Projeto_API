const collection_guides = require("../models/collection-guides.model.js")
const db = require('../models/db.js');
const { ErrorHandler } = require("../utils/error.js"); 

let getAllGuides = async (req, res, next) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({ errorMessage: "No access token provided" });
        }

        if (req.loggedUserRole !== "motorista" && req.loggedUserRole !== "admin") {
            return res.status(403).json({ success: false,
                msg: "Must be MOTORISTA or ADMIN role!"
            })
        };

        const limit = req.query.limit !== undefined ? parseInt(req.query.limit) : 10;
        const page = req.query.page !== undefined ? parseInt(req.query.page) : 0;
        if (isNaN(limit) || limit <= 0) {
            throw new ErrorHandler(400, "Limit of guides must be a positive number");
        }
        if (page < 0) {
            throw new ErrorHandler(400, "Page must be 0 or a positive number");
        }

        const guides = await db.Collection_Guide.findAll({
            attributes: ['collection_guide_id', 'issue_date', 'collection_status'],
            include: [
                {
                    model: db.Route,
                    attributes: ['route_id', 'driver_id'],
                    include: [
                        {
                            model: db.User,
                            attributes: ['user_id', 'name', 'user_type'],
                        },
                        
                    ]
                },
                {
                    model: db.Waste_Type,
                    attributes: ['name'],
                    include: [
                        {
                            model: db.Vehicle,
                            attributes: ['plate']
                        },
                    ]
                },
                {                                             
                    model: db.RFIDReading,
                    attributes: ['weight_collected', 'collection_status'],
                    include: [ 
                        {
                            model: db.Container,
                            attributes: ['container_id'],
                            include: [
                                {
                                    model: db.Collection_Point,
                                    attributes: ['collection_point_id', 'street_name', 'collection_point_type'],
                                    include: [
                                        {
                                            model: db.Container,
                                            attributes: ['container_id'],
                                            include: [
                                               
                                                {
                                                    model: db.Waste_Type, 
                                                    attributes: ['name']
                                                }
                                            ]
                                        },
                                        {
                                            model: db.Feedback,
                                            attributes: ['feedback_id', 'user_id'],
                                        }
                                    ]
                                },
                               
                                
                            ]
                        }
                    ]
                }
            ] 
        })
        

        
        /** 
         * Get all unique driver IDs from the guides associated routes
         * The IDs will be used to get the corresponding driver details from the database
         */
        const driverIDs = guides //list of unique IDs from the drivers
        .map(g => g.Route?.driver_id) //gwt driver_id from each guide's route (if it exists)
        .filter((id, i, arr) => id && arr.indexOf(id) === i); // remove duplicados and nulls to keep only the first id from the list
        
        const drivers = await db.User.findAll({
        where: {
            user_id: driverIDs, //only get drivers that were used
            user_type: 'motorista' 
        },
        attributes: ['user_id', 'name', 'user_type'] 
        });


        /** 
         * Count the total number of feedbacks associated with a guide, 
         * with each collection point being counted only once
         * 
         * Feedbacks are retrieved from RFIDreadings -> containers -> collection points
         */
        const guidesWithDrivers = guides.map(guide => {
            let feedbackCount = 0;
            const points = new Set(); // to keep count of feedbacks from collection points without repeating them

            guide.rfid_readings?.forEach(reading => {
                const collectionPoint = reading.container?.collection_point;                
                
                if (collectionPoint && !points.has(collectionPoint.collection_point_id)) {
                    points.add(collectionPoint.collection_point_id);
                    
                    if (collectionPoint.feedbacks?.length) {
                        feedbackCount += collectionPoint.feedbacks.length;
                    }
                }
            });

            return {
                ...guide.toJSON(),
                feedback_count: feedbackCount
            };
        });
        
        res.status(200).json(guidesWithDrivers);
       
    } catch (error) {
        next(error);
    }
} 

let getGuideById = async (req, res, next) => {
    try { 
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({ errorMessage: "No access token provided" });
        }

        if (req.loggedUserRole !== "motorista" && req.loggedUserRole !== "admin") {
            return res.status(403).json({ success: false,
                msg: "Your access token has expired! Please login again!"
            })
        };
        
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            throw new ErrorHandler(400, "Guide ID must be a number");
        }
    
        let guide = await db.Collection_Guide.findByPk(req.params.id, {
            include: [
                {
                model: db.Route,
                attributes: ['route_id'],
                include: [
                    {
                        model: db.Collection_Point,
                        attributes: ['street_name', 'collection_point_type'],
                        include: [
                            {
                                model: db.Container,
                                foreignKey: 'collection_point_id',
                                attributes: ['container_id'],
                                include: [
                                    {
                                        model: db.Waste_Type,  
                                        attributes: ['name'],
                                    },
                                    {
                                        model: db.RFIDReading,
                                        attributes: ['weight_collected', 'collection_status']
                                    }
                                ]
                            }
                        ]
                    }
                ]
                }
            ]
        })
        if(!guide) {
            throw new ErrorHandler(404, `Cannot find any collection guides with ID ${id}.`);
        }
        guide = guide.toJSON();
        res.status(200).json(guide); 
    } catch (err) {
        next(err);
    }
}

let addCollectionGuide = async (req, res, next) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({ errorMessage: "No access token provided" });
        }

        if (req.loggedUserRole !== "motorista" && req.loggedUserRole !== "admin") {
            return res.status(403).json({ success: false,
                msg: "You must be MOTORISTA or ADMIN!"
            })
        };
        const { issue_date, waste_id, collection_status, route_id } = req.body;
        
        if (!issue_date || !waste_id || collection_status === undefined || !route_id) {
            return res.status(400).json({ errorMessage: 'All fields are mandatory.' });
        }
        
        const newGuide = await db.Collection_Guide.create({
            issue_date, waste_id, collection_status, route_id
        })

        res.status(201).json({
            msg: "Guide successfully created.",
            links: [
                {rel: "self", href: `/collection-guides/${newGuide.id}`, method: "GET" },
            ]
        });

    } catch(err) {
        next(err)
    }
}

let patchGuideStatus = async (req, res, next) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({ errorMessage: "No access token provided" });
        }

        if (req.loggedUserRole !== "motorista" && req.loggedUserRole !== "admin") {
            return res.status(401).json({ success: false,
                msg: "Your access token has expired! Please login again!"
            })
        };

        const guideID = req.params.id;
        const forceUpdate = req.query.force === 'true'; 

        if (isNaN(guideID)) {
            return res.status(404).json({ errorMessage: "Guide ID must be a number" });
        }

        const result = await updateGuideStatusById(guideID, forceUpdate);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

async function updateGuideStatusById(guideID, force = false) {
    /**
     * This function updates the status of a collection guide 
     * when all the collection points are collected.
     * 
     * ("não iniciada", "em execução", "concluída")
     */
    const guide = await db.Collection_Guide.findByPk(guideID, {
        attributes: [
            'collection_guide_id', 
            'collection_status', 
            'waste_id'
        ]
    });

    if (!guide) {
        throw new ErrorHandler(404, `Oops. Guide ${guideID} not found`);
    }

    const readings = await db.RFIDReading.findAll({
        where: { collection_guide_id: guideID },
        include: [{
            model: db.Container,
            required: true,
            attributes: []
        }],
        attributes: [
            'rfid_reading_id', 
            'collection_status'
        ]
    });

    const completed = readings.filter(r =>
        [true, 1, '1', 'true'].includes(r.collection_status)
    ).length;

    const total = readings.length;

    let newStatus = 'não iniciada';
    if (completed > 0 && completed < total) newStatus = 'em execução';
    if (completed === total && total > 0) newStatus = 'concluída';

    const previousStatus = guide.collection_status; 
    const statusChanged = previousStatus !== newStatus; 
    const shouldUpdate = force || statusChanged; 

    if (shouldUpdate) {
        await guide.update({ collection_status: newStatus });
    }

    return {
        updated: statusChanged,  // true if status actually changed
        previous_status: previousStatus,
        new_status: newStatus
    };
}

module.exports = {
    getAllGuides, 
    getGuideById,
    addCollectionGuide,
    updateGuideStatusById,
    patchGuideStatus
}