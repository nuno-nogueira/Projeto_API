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
        collection_points.rows.forEach(collection_point => {
            collection_point.links = [
                {rel: "delete", href: `/collection_points/${collection_point.idponto_recolha}, method: "DELETE`},
                {rel: "modify", href: `/collection_points/${collection_point.idponto_recolha}, method: "PUT`}
            ]
        });

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
    } catch (error) {
        console.error(error);
        
        next(error);
    }
}

let getPointById = async (req, res, next) => {
    /**
     * Get a collection point by its ID (Interactive Map)
     */
    try {
        //Find by its PK
        let collection_point = await Collection_Point.findByPk(req.params.id, {
            attributes: ['tipo_ponto', 'rua', 'cod_postal', 'horario_funcionamento']
        });

        //If not found
        if (!collection_point) {
            throw new ErrorHandler(404, `Cannot find any COLLECTION POINT with ID ${req.params.id}.`);
        }

        //convert the user to a plain object
        collection_point = collection_point.toJSON();
        res.status(200).json(collection_point);
    } catch (error) {
        next(error);
    }
}

let addPoint = async (req, res, next) => {
    /**
     * Add a new Collection Point
     */
    try {
        //Gather all parameters
        const {idponto_recolha, tipo_ponto, cod_postal, horario_funcionamento, coordenadas_geograficas, rua, numero_porta, rota} = req.body;

        // sequelize update method allows PARTIAL updates, so we NEED to check for missing fields    
        let missingFields = [];
        if (idponto_recolha === undefined) missingFields.push('Collection Point ID');
        if (tipo_ponto === undefined) missingFields.push('Collection Point type');
        if (coordenadas_geograficas === undefined) missingFields.push('Geographical coordinates');
        if (horario_funcionamento === undefined) missingFields.push('Schedule');
        if (rua === undefined) missingFields.push('Address');
        if (cod_postal === undefined) missingFields.push('Postal Code');
        if (numero_porta === undefined) missingFields.push('Door Number');
        if (rota === undefined) missingFields.push('Route');

        if (missingFields.length > 0) 
            throw new ErrorHandler(400, `Missing required fields: ${missingFields.join(', ')}`);

        //INSERT QUERY
        const collection_point = await Collection_Point.create(req.body);

        res.status(201).json({
            msg: "Collection Point sucessfully created.",
            links: [
                {rel: "self", href: `/collection-points/${collection_point.idponto_recolha}}`, method: "GET"}
            ]
        })
    } catch (error) {
        next (error);
    }
}

let updateCollectionPoint = async (req, res, next) => {
    /**
     * Update a Collection Point
     */
    try {
        // if (!req.user || req.user.tipo_utilizador !== req.params.tipo_utilizador) {
        //     throw new ErrorHandler(403, "You aren't allowed to modify another user's data")
        // }
        //Only admins can update Collection Point details ^^^

        //Gather info
        const {tipo_ponto, coordenadas_geograficas, horario_funcionamento, rua, cod_postal, numero_porta, rota} = req.body;

        const collection_point = await Collection_Point.findByPk(req.params.id);
        if (!collection_point) {
            throw new ErrorHandler(404, `Collection Point with ID ${req.params.id} wasn't found!`)
        }

        // sequelize update method allows PARTIAL updates, so we NEED to check for missing fields    
        let missingFields = [];
        if (tipo_ponto === undefined) missingFields.push('Collection Point type');
        if (coordenadas_geograficas === undefined) missingFields.push('Geographical coordinates');
        if (horario_funcionamento === undefined) missingFields.push('Schedule');
        if (rua === undefined) missingFields.push('Address');
        if (cod_postal === undefined) missingFields.push('Postal Code');
        if (numero_porta === undefined) missingFields.push('Door Number');
        if (rota === undefined) missingFields.push('Route');

        if (missingFields.length > 0) 
            throw new ErrorHandler(400, `Missing required fields: ${missingFields.join(', ')}`);

        const updates = {
            tipo_ponto, coordenadas_geograficas, horario_funcionamento, rua,
            cod_postal, numero_porta, rota
        }

        await collection_point.update(updates);

        const result = collection_point.toJSON();
        return res.status(200).json({
            msg: "Collection Point updated sucessfully",
            data: result
        })
    } catch (error) {
        console.error(error);
        
        next(error);
    }
}


let deletePoint = async (req, res, next) => {
    /**
     * Delete a Collection Point
     */
    try {
        //403 Forbidden Error later

        //delete an user in DB given its id
        let result = await Collection_Point.destroy({where: {idponto_recolha: req.params.id}});
        // the promise returns the number of deleted rows
        if (result === 0) {
            throw new ErrorHandler(404,`Cannot find any COLLECTION POINT with ID ${req.params.id}.`);
        }

        // send 204 No Content response
        res.status(204).json();
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllPoints, getPointById,
    addPoint,
    updateCollectionPoint,
    deletePoint
}