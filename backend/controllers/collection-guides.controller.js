const collection_guides = require("../models/collection-guides.model.js")
const db = require('../models/db.js');
const { ErrorHandler } = require("../utils/error.js"); 

let getAllGuides = async (req, res, next) => {
    /**COLOCAR A ACCESS TOKEN */
    // res.json(collection_guides)
    
    try {
        const guides = await db.Collection_Guide.findAll();
        res.json(guides);
    } catch (error) {
        next(error);
    }
} 

let getGuideById = async (req, res, next) => {

    try { 
        const id = parseInt(req.params.id)
        console.log(id);
        
        if (isNaN(id)) {
            return res.status(400).json({errorMessage: "Invalid ID"})
        }
        // descomentar quando criar os models wastetype e route:
        // const guide = await db.Collection_Guide.findByPk(id, {
        //     include: [
        //         {
        //             model: db.waste_type,
        //             attributes: ['name']
        //         },
        //         {
        //             model: db.route,
        //             through: { attributes: ['route_id'] } 
        //         }
        //     ]
        // })

        // /**COLOCAR ERRO 401 (UNAUTHORIZED) por causa do tipo de utilizador*/

        let guide = await db.Collection_Guide.findByPk(id)

        if(!guide) {
            throw new ErrorHandler(404, `Cannot find any COLLECTION GUIDES with ID ${id}.`);
        }

        // convert the guide to a plain object
        guide = guide.toJSON();

        res.status(200).json(guide); 

    } catch (err) {
        next(err);
    }
}

let addCollectionGuide = async (req, res, next) => {
    // // Destructure the request body
    // let {id, date, vehicle_id, residual_code, collection_status, route} = req.body;

    // // Create a new collection guide object with the next id
    // const newGuide = {
    //     id: collection_guides.length + 1,
    //     date, // Aqui ou no SQL (???)
    //     vehicle_id,
    //     residual_code,
    //     collection_status: "ON HOLD",
    //     route
    // };

    // // Add a new guide to the collection guides array
    // collection_guides.push(newGuide);

    // // 201 Status - Created a new collection guide sucessfully!
    // res.status(201).json({location: `/collection-guides/${newGuide.id}`});
    
    try {
        //get the values of the req.body (the columns)
        const { issue_date, waste_id, collection_status, route_id } = req.body;
        
        //do they exist?
        if (!issue_date || !waste_id || collection_status === undefined || !route_id) {
            return res.status(400).json({ errorMessage: 'Todos os campos são obrigatórios.' });
        }

        //create guide
        const newGuide = await db.Collection_Guide.create({
            issue_date, waste_id, collection_status, route_id
        })

        //respond with the new guide
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
    // // Find the collection guide with the given id
    // const guide = collection_guides.find(guide => guide.id == req.params.id);

    // /**COLOCAR ERRO 403 - FORBIDDEN && ERRO 405 CONFLICT*/

    // // 404 Error - If collection point couldnt be found :(
    // if (!guide) {
    //     return res.status(404).json({errorMessage: "Collection Guide not found"})
    // }

    // // Update the collection guide with the new data
    // guide.date = req.body.date;
    // guide.vehicle_id = req.body.vehicle_id;
    // guide.residual_code = req.body.residual_code;
    // guide.collection_status = req.body.collection_status;
    // guide.route = req.body.route;

    // // 204 Status - No Content
    // res.status(204).json();

    try {
        // sequelize update method allows PARTIAL updates, so we NEED to check for missing fields    
        let missingFields = [];
        const { issue_date, waste_id, collection_status, route_id } = req.body;

        //check for missing fields
        if (issue_date === undefined) missingFields.push('Issue Date');
        if (waste_id === undefined) missingFields.push('Waste ID');
        if (collection_status === undefined) missingFields.push('Collection Status');
        if (route_id === undefined) missingFields.push('Route ID');

        //if any of the fields are missing, throw an error
        if (missingFields.length > 0) 
           throw new ErrorHandler(400, `Missing required fields: ${missingFields.join(', ')}`);

        //update the guide
        const guide = await db.Collection_Guide.findByPk(req.params.id)
        if (!guide) {
            throw new ErrorHandler(404, `Cannot find any COLLECTION GUIDES with ID ${req.params.id}.`);
        }
        
        await guide.update(req.body);
        // res.status(204).end();
        res.status(204).json();

    } catch (err) {
        next(err);    
    }
}

module.exports = {
    getAllGuides, getGuideById,
    addCollectionGuide,
    updateGuideInfo
}