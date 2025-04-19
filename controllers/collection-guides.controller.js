//Import the collection guides data model
const collection_guides = require("../models/collection-guides.model.js")

//??
let getAllGuides = (req, res) => {
    /**COLOCAR A ACCESS TOKEN */
    res.json(collection_guides)
} 


let getGuideById = (req, res) => {
    // Find the guide with the given id
    /**COLOCAR A ACCESS TOKEN */
    const collection_guide = collection_guides.find(guide => guide.id == req.params.id);

    // 404 Error - if collection guide is not found
    if (!collection_guide) {
        return res.status(404).json({errorMessage: "Collection Guide not found"})
    }

    /**COLOCAR ERRO 401 (UNAUTHORIZED) */

    res.json(collection_guide) // Return the found user
}


let validateBodyData = (req, res, next) => {
    // Validate the request body
    if (!req.body) {
        return res.status(400).json({errorMessage: "Request body is required"})
    }

    // Destructure the request body
    //let {id, date, vehicle_id, residual_code, collection_status, route} = req.body;

    /* Como é o sistema a criar o guia, acho que não é necessária 
    verificação do erro 400 (Campo obrigatório, etc.)
    */

    /**COLOCAR ERRO 401 (UNAUTHORIZED) */

    next();
}


let addCollectionGuide = (req, res) => {
    // Destructure the request body
    let {id, date, vehicle_id, residual_code, collection_status, route} = req.body;

    // Create a new collection guide object with the next id
    const newGuide = {
        id: collection_guides.length + 1,
        date, // Aqui ou no SQL (???)
        vehicle_id,
        residual_code,
        collection_status: "ON HOLD",
        route
    };

    // Add a new guide to the collection guides array
    collection_guides.push(newGuide);

    // 201 Status - Created a new collection guide sucessfully!
    res.status(201).json({location: `/collection-guides/${newGuide.id}`});
}


let updateGuideInfo = (req, res) => {
    // Find the collection guide with the given id
    const guide = collection_guides.find(guide => guide.id == req.params.id);

    /**COLOCAR ERRO 403 - FORBIDDEN && ERRO 405 CONFLICT*/

    // 404 Error - If collection point couldnt be found :(
    if (!guide) {
        return res.status(404).json({errorMessage: "Collection Guide not found"})
    }

    // Update the collection guide with the new data
    guide.date = req.body.date;
    guide.vehicle_id = req.body.vehicle_id;
    guide.residual_code = req.body.residual_code;
    guide.collection_status = req.body.collection_status;
    guide.route = req.body.route;

    // 204 Status - No Content
    res.status(204).json();
}

module.exports = {
    getAllGuides, getGuideById,
    validateBodyData,
    addCollectionGuide,
    updateGuideInfo
}