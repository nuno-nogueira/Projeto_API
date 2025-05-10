// Import the collection points data model
const collection_points = require("../models/collection-points.model.js");

//??
let getAllPoints = (req, res) => {
    /**COLOCAR A ACCESS TOKEN */
    res.json(collection_points)
}

let getPointById = (req, res) => {
    // Find the collection point with the given id
    /**COLOCAR A ACCESS TOKEN */
    const collection_point = collection_points.find(point => point.id == req.params.id);

    //404 Error - If collection point is not found
    if (!collection_point) {
        return res.status(404).json({errorMessage: "Collection Point not found"})
    }

    /**COLOCAR ERRO 401 (UNAUTHORIZED) */

    res.json(collection_point) // Return the found collection point
}


let validateBodyData = (req, res, next) => {
    // Validate the request body
    if (!req.body) {
        return res.status(400).json({errorMessage: "Request body is required"})
    }

    // Destructure the request body 
    let {id, point_type, geographical_coordinates, schedule, address, postal_code, door_number, route, residual_type} = req.body;

    // 400 Error - Field Required
    if (!point_type) {
        return res.status(400).json({errorMessage: "Collection Point type field is required"})
    } else if (!geographical_coordinates) {
        return res.status(400).json({errorMessage: "Geographical coordinates field is required"})
    } else if (!schedule) {
        return res.status(400).json({errorMessage: "Schedule field is required"})
    } else if (!address) {
        return res.status(400).json({errorMessage: "Address field is required"})
    } else if (!postal_code) {
        return res.status(400).json({errorMessage: "Postal Code field is required"})
    } else if (!door_number) {
        return res.status(400).json({errorMessage: "Door Number field is required"})
    } else if (!route) {
        return res.status(400).json({errorMessage: "Route field is required"})
    } else if (!residual_type) {
        return res.status(400).json({errorMessage: "Residual type field is required"})
    }


    // 400 Error - Can't be empty
    if (typeof point_type !== "string") {
        return res.status(400).json({errorMessage: "Point Type field cannot be empty"})
    } else if (typeof geographical_coordinates !== "string") {
        return res.status(400).json({errorMessage: "Geographical Coordinates field cannot be empty"})
    } else if (typeof schedule !== "string") {
        return res.status(400).json({errorMessage: "Schedule field cannot be empty"})
    } else if (typeof address !== "string") {
        return res.status(400).json({errorMessage: "Address field cannot be empty"})
    } else if (typeof postal_code !== "string") {
        return res.status(400).json({errorMessage: "Postal Code field cannot be empty"})
    } else if (typeof door_number !== "number") {
        return res.status(400).json({errorMessage: "Door Number field cannot be empty"})
    } else if (typeof residual_type !== "object") {
        return res.status(400).json({errorMessage: "Residual Type field cannot be empty"})
    }
    

    /**COLOCAR ERRO 401 (UNAUTHORIZED) */
    
    
    // 405 Error - Two points cannot have the same address
    if (collection_points.find(point => point.address === address)) {
        return res.status(400).json({errorMessage: "You cannot put this location because it's already being used in another collection point"})
    }

    // Call the next middleware function
    next();

}


let addCollectionPoint = (req, res) => {
    // Destructure the request body
    const {point_type, geographical_coordinates, schedule, address, postal_code, door_number, route, residual_type} = req.body;

    // Create a new collection point object with the next id
    const newPoint = {
        id: collection_points.length + 1,
        point_type, 
        geographical_coordinates,
        schedule,
        address,
        postal_code,
        door_number,
        route,
        residual_type
    };
    
    // Add a new point to the collection points array
    collection_points.push(newPoint);

    // 201 Status - Created a new collection point sucessfully!
    res.status(201).json({ location: `/collection-points/${newPoint.id}`});
}


let updatePointInfo = (req, res) => {
    // Find the collection point with the given id
    const point = collection_points.find(point => point.id == req.params.id);

    /**COLOCAR ERRO 403 - FORBIDDEN && ERRO 405 CONFLICT*/
    
    // 404 Error - If collection point couldnt be found :(
    if (!point) {
        return res.status(404).json({errorMessage: "Collection Point not found"})
    }

    // Update the collection point with the new data
    point.point_type = req.body.point_type;
    point.geographical_coordinates = req.body.geographical_coordinates;
    point.schedule = req.body.schedule;
    point.address = req.body.address;
    point.postal_code = req.body.postal_code;
    point.door_number = req.body.door_number;
    point.route = req.body.route;
    point.residual_type = req.body.residual_type;

    // 204 Status - No Content 
    res.status(204).json();
}


let deletePoint = (req, res) => {
    // Delete the collection point with the id given
    const pointIndex = collection_points.findIndex (point => point.id == req.params.id);

    // 404 Error - Not Found
    if (pointIndex === -1) {
        return res.status(404).json({errorMessage: "Collection Point not found"})
    }

    // Remove collection point from the array
    collection_points.splice(pointIndex, 1);

    // 204 Status - No Content
    res.status(204).json();
}

module.exports = {
    getAllPoints, getPointById,
    validateBodyData,
    addCollectionPoint,
    updatePointInfo,
    deletePoint
}