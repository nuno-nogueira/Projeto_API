const collection_guides = require("../models/collection-guides.model.js")
const db = require('../models/db.js');
const { ErrorHandler } = require("../utils/error.js"); 

let getAllGuides = async (req, res, next) => {
    try {
        // if (req.loggedUserRole !== "motorista") {
        //     return res.status(403).json({ success: false,
        //         msg: "This request required MOTORISTA role!"
        //     })
        // };
        const guides = await db.Collection_Guide.findAll({
            include: [
                {
                    model: db.Waste_Type,
                    attributes: ['waste_type_id', 'name'],
                    include: [
                        {
                            model: db.Vehicle, 
                            attributes: ['vehicle_id','plate'],
                        }
                    ]
                },
                {
                    model:db.Route,
                    attributes: ['route_id'],
                    include: [
                        {
                            model: db.User, 
                            attributes: ['user_id', 'name'],
                            include: [
                                {
                                    model: db.Feedback,
                                    attributes: [],
                                    where: { feedback_type: 'recolha' },
                                    required: false
                                }
                            ]   
                        },
                        {
                            model: db.Collection_Point,
                            attributes: ['street_name', 'collection_point_type'],
                            include: [
                                {
                                    model: db.Container,
                                    attributes: ['container_id'],
                                    include: [
                                        {
                                            model: db.Waste_Type,
                                            attributes: ['name'],
                                        },
                                        {
                                            model: db.RFIDReading,
                                            attributes: ['weight_collected'],
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        })
        res.json(guides);
       
    } catch (error) {
        next(error);
    }
} 


let getGuideById = async (req, res, next) => {
    try { 
        // if (req.loggedUserRole !== "motorista") {
        //     return res.status(403).json({ success: false,
        //         msg: "This request required MOTORISTA role!"
        //     })
        // };
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({errorMessage: "Invalid ID"});
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
                                attributes: ['container_id'],
                                include: [
                                    {
                                        model: db.Waste_Type,  
                                        attributes: ['name'],
                                    },
                                    {
                                        model: db.RFIDReading,
                                        attributes: ['weight_collected']
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

        // if (req.loggedUserRole !== "motorista") {
        //     return res.status(403).json({ success: false,
        //         msg: "This request required MOTORISTA role!"
        //     })
        // };
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

let updateGuideInfo = async (req, res, next) => {

    try {
        // if (req.loggedUserRole !== "motorista") {
        //     return res.status(403).json({ success: false,
        //         msg: "This request required MOTORISTA role!"
        //     })
        // };
        // sequelize update method allows  partial updates, so we need to check for missing fields:
        let missingFields = [];
        const { issue_date, waste_id, collection_status, route_id } = req.body;

        //check for missing fields
        if (issue_date === undefined) missingFields.push('Issue Date');
        if (waste_id === undefined) missingFields.push('Waste ID');
        if (collection_status === undefined) missingFields.push('Collection Status');
        if (route_id === undefined) missingFields.push('Route ID');

        //if any of the fields are missing, just throw an error
        if (missingFields.length > 0) 
           throw new ErrorHandler(400, `Missing required fields: ${missingFields.join(', ')}`);

        //update the guide
        const guide = await db.Collection_Guide.findByPk(req.params.id)
        if (!guide) {
            throw new ErrorHandler(404, `Cannot find any colection guide with id ${req.params.id}.`);
        }
        
        await guide.update(req.body);
        res.status(204).json();

    } catch (err) {
        next(err);    
    }
}

let updateCollectionStatus = async (req, res, next) => {
    try {
        // if (req.loggedUserRole !== "motorista") {
        //     return res.status(403).json({ success: false,
        //         msg: "This request required MOTORISTA role!"
        //     })
        // };
        const guide = await db.Collection_Guide.findByPk(req.params.id);
        if (!guide) return res.status(404).json({ error: 'Guide is missing!' });

        await guide.update({ collection_status: req.body.collection_status });
        res.json(guide);
    } catch (error) {
        next(error);
  }
}

module.exports = {
    getAllGuides, 
    getGuideById,
    addCollectionGuide,
    updateGuideInfo,
    updateCollectionStatus
}