//Import the users data model
const db = require('../models/db.js'); // Import the database connection
const User = db.User; // Import the User model from the database connection
const Collection_Point = db.Collection_Point;
const { Op } = require('sequelize'); // necessary operators for Sequelize 

const { ErrorHandler } = require("../utils/error.js"); // Import the ErrorHandler class for error handling

//list all users with filtering and ordering
let getAllUsers = async (req, res, next) => {
    /**
     * Get all users (citizens only)
     */
    try {
        //get the user_type
        const {user_type, sort, order} = req.query;

        //filter by only citizens
        const where = {};
        if (user_type !== undefined) {
            //validate the door to door value
            if (user_type !== 'morador' && user_type !== 'motorista' && user_type !== 'admin')
                throw new ErrorHandler(400, `Invalid value for door to door: ${user_type}. It should be either 'sim' or 'não'.`);

            where.user_type = user_type === 'morador'; //convert to boolean   
        }

        //validate sort and order values
        if (sort && sort !== 'door_to_door') 
           throw new ErrorHandler(400, `Invalid value for sort: ${sort}. It should be 'door_to_door'.`);

        if (order && order !== 'asc' && order !== 'desc')
           throw new ErrorHandler(400, `Invalid value for order: ${order}. It should be either 'asc' or 'desc'.`);

        //sort and order options must be passed together
        if ((sort && !order) || (!sort && order)) 
            throw new ErrorHandler(400, `Both sort and order must be provided together.`);

        //ordering by if the user has activated the door-to-door service or not
        const sortField = sort === 'door_to_door' ? 'door_to_door' : 'user_id'; //by default sort by id
        const sortOrder = order === 'desc' ? 'DESC' : 'ASC';

        //SELECT * FROM UTILIZADOR WHERE TIPO_UTILIZADOR = "MORADOR"
        let users = await User.findAndCountAll({
            where,
            attributes: ['user_id', 'name', 'user_number'],
            where: {
                user_type: "morador"
            },
            include: [
                {
                    model: db.Collection_Point,
                    attributes: ['street_name', 'postal_code', 'door_number']
                }
            ],
            order: [[sortField, sortOrder]],
            raw: false
        })

        //for each user column...
        users.rows.forEach(user => {
            users.links = [
                {rel: "delete", href: `/users/${user.user_id}`, method: "DELETE"}
            ]
        })

        return res.status(200).json({
            total: users.count,
            data: users.rows
        });
    } catch (err) {
        next(err); // pass the error to the next middleware
    }
}


let getUserById = async(req, res, next) => {
    /**
     * Get each user's profile
     */
    try {
        //Find the ID given in the URL as a PK
        let user = await User.findByPk(req.params.user_id, {
            attributes: ['user_id', 'name', 'email', 'phone_number', 'door_to_door_service'],
            include: [ //include the collection_point info
                {
                    model: db.Collection_Point,
                    attributes: ['collection_point_id', 'street_name', 'postal_code','door_number']
                }
            ]
        })

        //If not found, return 404
        if (!user) {
            throw new ErrorHandler(404, `Cannot find any USER with ID ${req.params.user_id}.`);
        }
        
        //convert the user to a plain object
        user = user.toJSON();
        user.links = [
            {rel: "modify", href: `/users/${user.user_id}`, method: "PUT"},
            {rel: "delete", href:`/users/${user.user_id}`, method: "DELETE"}
        ]

        res.status(200).json(user); //return the found post

        /**COLOCAR ERRO 401 (UNAUTHORIZED) */
    } catch (error) {
        next(error);
    }
}


let addUser = async (req, res, next) => {
    /**
     * To register a new user
     */
    try {
        const {name, tin, password, phone_number, email, door_to_door_service, street_name, postal_code, door_number} = req.body;

        let error, collection_point_id;
        // Check if the body has the mandatory fields
        if (name === undefined) {
            error = new Error(`Missing required field: name`)
        } else if (tin === undefined) {
            error = new Error(`Missing required field: TIN`)
        } else if (password === undefined) {
            error = new Error(`Missing required field: password`)
        } else if (phone_number === undefined) {
            error = new Error(`Missing required field: phone number`)
        } else if (email === undefined) {
            error = new Error(`Missing required field: email`)
        } else if (door_to_door_service === undefined) {
            error = new Error(`Missing required field: door to door service`)
        } else if (street_name === undefined) {
            error = new Error(`Missing required field: street name`)
        } else if (postal_code === undefined) {
            error = new Error(`Missing required field: postal code`)
        } else if (door_number === undefined) {
            error = new Error(`Missing required field: door number`)
        } 
        
        if (error) {
            error.statusCode = 400;
            return next(error); // Pass the error to the next middleware
        }
        
        const count_all_points = await Collection_Point.count({}) 
        collection_point_id = count_all_points + 1

        await Collection_Point.create({
            collection_point_id,
            collection_point_type: "moradia",
            geographical_coordinates: null,
            opening_hours: null,
            street_name,
            postal_code,
            door_number,
            route_id: 1
        })

        const count_user_number = await User.count({
            where: {
                user_number: {[Op.gt]: 3000}
            }
        }) 
        console.log(count_user_number);
        

        const count_all_users = await User.count({}) 
        console.log(count_user_number);
        
        await User.create({
            user_id: count_all_users + 1,
            name, tin, 
            user_number: 3000 + count_user_number + 1,
            password, email, phone_number, 
            user_type: "morador", 
            door_to_door_service: door_to_door_service ? "sim" : "não", 
            address_point_id: collection_point_id
        });
        res.status(201).json({
            msg: "User sucessfully created."
        });
    } catch (err) {
        next (err);
    }
}


let loginUser = async (req, res, next) => {
    /**
     * Handle logging in
     */
    try {
        //Parameters to login
        const {tin, password} = req.body;
        
        //Check if any of these parameters are missing
        if (!tin || !password) {
            throw new ErrorHandler(400, "Fields required: TIN and password");
        }

        //Try to find a user with the credentials given
        const user = await User.findOne({
            where: {tin},
            raw: true
        })

        //If the user wasnt found
        if (!user) {
            throw new ErrorHandler(401, "Invalid credentials")
        }

        //If the password is incorrect
        if (user.password !== password) {
            throw new ErrorHandler(401, "Invalid credentials")
        }

        return res.status(200).json({
            msg: "Logged in sucessfully",
            data: {
                user_id: user.user_id,
                name: user.name,
                user_type: user.user_type,
                door_to_door: user.door_to_door_service,
                address_point_id: user.address_point_id
            },
            links: [
                {rel: "self", href: `/users/${user.user_id}, method: "GET`}
            ]
        })
    } catch (error) {        
        next(error)
    }
}


let updateUserInfo = async (req, res, next) => {
    /**
     * Handles the changes an user can do in their profile
     */
    try {
        // if (!req.user || req.user.id_utilizador !== req.params.id) {
        //     throw new ErrorHandler(403, "You aren't allowed to modify another user's data")
        // }
        // Each user can only edit their own profile ^^^

        const {name, tin, password, email, phone_number, door_to_door_service, address_point_id} = req.body;

        //Find an user by their ID
        const user = await User.findByPk(req.params.user_id);
        if (!user) {
            throw new ErrorHandler(404, `User with ID ${req.params.user_id} wasn't found!`)
        }

        // sequelize update method allows PARTIAL updates, so we NEED to check for missing fields    
        let missingFields = [];
        if (name === undefined) missingFields.push('Name');
        if (tin === undefined) missingFields.push('TIN');
        if (password === undefined) missingFields.push('Password');
        if (email === undefined) missingFields.push('Email');
        if (phone_number === undefined) missingFields.push('Phone Number');
        if (door_to_door_service === undefined) missingFields.push('Door to Door Service');

        if (missingFields.length > 0) 
           throw new ErrorHandler(400, `Missing required fields: ${missingFields.join(', ')}`);

        // search for the collection_point id, if there is one
        if (req.body.door_to_door_service === 'sim') {
            if (address_point_id === undefined) {
                throw new ErrorHandler(400, 'Collection Point ID is required');
            }

            //Try to find the Collection Point
            const collection_point = await Collection_Point.findByPk(req.body.door_to_door_service)

            if (!collection_point) {
                throw new ErrorHandler(401, "Invalid credentials")
            }
        }

        //Update all parameters
        const updates = {
            name, 
            tin,
            password,
            email,
            phone_number, 
            door_to_door_service,
            address_point_id: door_to_door_service === 'sim' ? address_point_id : null
        };

        //UPDATE QUERY
        await user.update(updates);

        const result = user.toJSON();
        return res.status(200).json({
            msg: "User updated sucessfully",
            data: result
        })

    } catch (error) {
        next(error)
    }
}


let deleteUser = async (req, res, next) => {
    /**
     * Delete an user either if its an admin
     * or the user itself deletes their own profile
     */
    try {
        //403 Forbidden Error later

        //delete an user in DB given its id
        let result = await User.destroy({where: {user_id: req.params.user_id}});
        // the promise returns the number of deleted rows
        if (result === 0) {
           throw new ErrorHandler(404,`Cannot find any USER with ID ${req.params.user_id}.`);
        }

        // send 204 No Content response
        res.status(204).json();
    } catch (error) {
        next(error)
    }
}

module.exports = {
    addUser,
    getAllUsers, getUserById,
    loginUser,
    updateUserInfo,
    deleteUser
}
