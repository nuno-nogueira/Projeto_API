//Import the users data model
const db = require('../models/db.js'); // Import the database connection
const Collection_Point = db.Collection_Point; // Import the User model from the database connection
const { Op } = require('sequelize'); // necessary operators for Sequelize 

const { ErrorHandler } = require("../utils/error.js"); // Import the ErrorHandler class for error handling

let getAllPoints = async (req, res, next) => {
    /**
     * Get all collection points in the DB
     */
    try {
        //Pagination - 6 Collection Points per page
        let {page = 1, limit = 6} = req.query;

        // validate page and limit values
        if (isNaN(page) || page < 1) 
            throw new ErrorHandler(400, `Invalid value for page: ${page}. It should be a positive integer.`);
        
        if (isNaN(limit) || limit < 1) 
            throw new ErrorHandler(400, `Invalid value for limit: ${limit}. It should be a positive integer.`);

        //Find all collection points
        let collection_points = await Collection_Point.findAndCountAll({
            limit: +limit
        })
        
        //Iterate through all collection points to put all links
        if (req.loggedUserRole !== "admin") {
            collection_points.rows.forEach(collection_point => {
                collection_point.links = [
                    {rel: "delete", href: `/collection_points/${collection_point.collection_point_id}, method: "DELETE`},
                    {rel: "modify", href: `/collection_points/${collection_point.collection_point_id}, method: "PUT`}
                ]
            });
        } 
        
        return res.status(200).json({
            totalPages: Math.ceil(collection_points.count / limit),
            currentPage: page ? page : 0,
            total: collection_points.count,
            data: collection_points.rows,
            links: [
                { "rel": "add-collection-point", "href": `/collection-points`, "method": "POST" },
                // only add the previous page link if the current page is greater than 1
                ...(page > 1 ? [{ "rel": "previous-page", "href": `/collection-points?limit=${limit}&page=${page - 1}`, "method": "GET" }] : []),
                // only add the next page link if there are more pages to show
                ...(collection_points.count > page * limit ? [{ "rel": "next-page", "href": `/collection-points?limit=${limit}&page=${+page + 1}`, "method": "GET" }] : [])
            ]
        });
    } catch (err) {        
        next(err);
    }
}

let getPointById = async (req, res, next) => {
    /**
     * Get a collection point by its ID (Interactive Map)
     */
    try {
        //Find by its PK
        let collection_point = await Collection_Point.findByPk(req.params.id, {
            attributes: ['collection_point_type', 'street_name', 'postal_code', 'opening_hours']
        });

        //If not found
        if (!collection_point) {
            throw new ErrorHandler(404, `Cannot find any COLLECTION POINT with ID ${req.params.id}.`);
        }

        //convert the user to a plain object
        collection_point = collection_point.toJSON();
        res.status(200).json(collection_point);
    } catch (err) {
        next(err);
    }
}

let addPoint = async (req, res, next) => {
    /**
     * Add a new Collection Point
     */
    try {
        if (req.loggedUserRole !== "admin") {
            return res.status(403).json({ 
                success: false,
                msg: "This request require ADMIN role!"
            })
        };

        //Gather all parameters
        const {collection_point_type, postal_code, opening_hours, geographical_coordinates, street_name, door_number} = req.body;

        // sequelize update method allows PARTIAL updates, so we NEED to check for missing fields    
        let missingFields = [];
        let collection_point_id;
        if (collection_point_type === undefined) missingFields.push('Collection Point type');
        if (geographical_coordinates === undefined) missingFields.push('Geographical coordinates');
        if (opening_hours === undefined) missingFields.push('Schedule');
        if (street_name === undefined) missingFields.push('Address');
        if (postal_code === undefined) missingFields.push('Postal Code');
        if (door_number === undefined) missingFields.push('Door Number');

        if (missingFields.length > 0) {
            throw new ErrorHandler(400, `Missing required fields: ${missingFields.join(', ')}`);
        }

        if (opening_hours.length < 5 || opening_hours.length > 45) {
            throw new ErrorHandler(400,`Opening hours should be between 5 and 45 characters`);
        }

        if (street_name.length < 10 || street_name.length > 100) {
            throw new ErrorHandler(400,`Street Name should be between 10 and 100 characters`);
        }

        if (postal_code.length !== 8) {
            throw new ErrorHandler(400,`Postal Code should be 8 characters long`);
        }

        if (door_number <= 1 || door_number > 80) {
            throw new ErrorHandler(400,`Door Number should be between 1 and 50`);
        }

        //INSERT QUERY
        const count_all_points = await Collection_Point.count({}) 
        collection_point_id = count_all_points + 1

        const collection_point = await Collection_Point.create({
            collection_point_id,
            collection_point_type,
            geographical_coordinates,
            opening_hours,
            street_name,
            postal_code,
            door_number,
            route_id: 1
        })

        res.status(201).json({
            msg: "Collection Point sucessfully created.",
            links: [
                {rel: "self", href: `/collection-points/${collection_point.collection_point_id}}`, method: "GET"}
            ]
        })
    } catch (err) {
        next (err);
    }
}

let updateCollectionPoint = async (req, res, next) => {
    /**
     * Update a Collection Point
     */
    try {
        if (parseInt(req.params.user_id) !== req.loggedUserId && req.loggedUserRole !== "admin") {
            return res.status(403).json({ success: false, msg: "You are not authorized to change this collection point!"})
        }

        const {collection_point_type, postal_code, opening_hours, geographical_coordinates, street_name, door_number} = req.body;

        const collection_point = await Collection_Point.findByPk(req.params.id);
        if (!collection_point) {
            throw new ErrorHandler(404, `Collection Point with ID ${req.params.id} wasn't found!`)
        }

        // sequelize update method allows PARTIAL updates, so we NEED to check for missing fields    
        let missingFields = [];
        if (collection_point_type === undefined) missingFields.push('Collection Point type');
        if (geographical_coordinates === undefined) missingFields.push('Geographical coordinates');
        if (opening_hours === undefined) missingFields.push('Schedule');
        if (street_name === undefined) missingFields.push('Address');
        if (postal_code === undefined) missingFields.push('Postal Code');
        if (door_number === undefined) missingFields.push('Door Number');

        if (missingFields.length > 0) 
            throw new ErrorHandler(400, `Missing required fields: ${missingFields.join(', ')}`);

        if (opening_hours.length < 5 || opening_hours.length > 45) {
            throw new ErrorHandler(400,`Opening hours should be between 5 and 45 characters`);
        }

        if (street_name.length < 10 || street_name.length > 100) {
            throw new ErrorHandler(400,`Street Name should be between 10 and 100 characters`);
        }

        if (postal_code.length !== 8) {
            throw new ErrorHandler(400,`Postal Code should be 8 characters long`);
        }

        if (door_number <= 1 || door_number > 80) {
            throw new ErrorHandler(400,`Door Number should be between 1 and 50`);
        }

        const updates = {
            collection_point_type, geographical_coordinates, opening_hours, street_name,
            postal_code, door_number
        }

        await collection_point.update(updates);

        const result = collection_point.toJSON();
        return res.status(200).json({
            msg: "Collection Point updated sucessfully",
            data: result
        })
    } catch (error) {        
        next(error);
    }
}


let deletePoint = async (req, res, next) => {
    /**
     * Delete a Collection Point
     */
    try {
        // only admins can delete collection points
        if (parseInt(req.params.user_id) !== req.loggedUserId) {
            return res.status(403).json({ 
                success: false, 
                msg: "You are not authorized to change this profile!"})
        }

        //delete an user in DB given its id
        let result = await Collection_Point.destroy({where: {collection_point_id: req.params.id}});
        // the promise returns the number of deleted rows
        if (result === 0) {
            throw new ErrorHandler(404,`Cannot find any COLLECTION POINT with ID ${req.params.id}.`);
        }

        // send 204 No Content response
        res.status(204).json();
    } catch (err) {
        next(err)
    }
}

module.exports = {
    getAllPoints, getPointById,
    addPoint,
    updateCollectionPoint,
    deletePoint
}