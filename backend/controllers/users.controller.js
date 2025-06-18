//password encryption
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
require('dotenv').config();

//Import the users data model
const db = require('../models/db.js'); // Import the database connection
const User = db.User; // Import the User model from the database connection
const Collection_Point = db.Collection_Point;
const Feedback = db.Feedback;
const { Op } = require('sequelize'); // necessary operators for Sequelize 

const { ErrorHandler } = require("../utils/error.js"); // Import the ErrorHandler class for error handling

//list all users with filtering and ordering
let getAllUsers = async (req, res, next) => {
    /**
     * Get all users (except admins & drivers)
     */
    try {    
        // get the user_type
        const {page = 1, limit = 6, order = 'asc'} = req.query;
        
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({ errorMessage: "No access token provided" });
        }

        if (req.loggedUserRole !== "admin") {
            return res.status(403).json({ success: false,
                msg: "This request required ADMIN role!"
            })
        };

        if (order !== 'asc' && order !== 'desc')
           throw new ErrorHandler(400, `Invalid value for order: ${order}. It should be either 'asc' or 'desc'.`);

        //SELECT * FROM UTILIZADOR WHERE TIPO_UTILIZADOR = "MORADOR"
        let users = await User.findAndCountAll({
            where: { user_type: "morador"},
            attributes: ['user_id', 'name'],
            limit: +limit,
            offset: (+page - 1) * +limit,
            include: [
                {
                    model: db.Collection_Point,
                    attributes: ['collection_point_id', 'street_name']
                }
            ],
            order: [['name', order]],
            raw: false
        })

        //for each user column...
        users.rows.forEach(user => {
            users.links = [
                {rel: "delete", href: `/users/${user.user_id}`, method: "DELETE"}
            ]
        })

        return res.status(200).json({
            totalPages: Math.ceil(users.count / limit),
            currentPage: page ? page : 0,
            total: users.count,
            data: users.rows,
            links: [
                // only add the previous page link if the current page is greater than 1
                ...(page > 1 ? [{ "rel": "previous-page", "href": `/profile/${req.loggedUserId}?limit=${limit}&page=${page - 1}`, "method": "GET" }] : []),
                // only add the next page link if there are more pages to show
                ...(users.count > page * limit ? [{ "rel": "next-page", "href": `/profile/${req.loggedUserId}?limit=${limit}&page=${+page + 1}`, "method": "GET" }] : [])
            ]
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

        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({ errorMessage: "No access token provided" });
        }

        // Find the ID given in the URL as a PK
        let user = await User.findByPk(req.params.user_id, {
            attributes: ['user_id', 'name', 'tin', 'phone_number', 'email','door_to_door_service', 'user_type'],
            include: [ //include the collection_point info && feedbacks array
                {
                    model: db.Collection_Point,
                    attributes: ['collection_point_id', 'street_name', 'postal_code','door_number']
                },
                {
                    model: db.Feedback,
                    attributes: ['feedback_id', 'description', 'feedback_type', 'feedback_date'],
                    include: [
                        {
                            model: db.Collection_Point,
                            attributes: ['street_name']
                        }
                    ],
                }
            ]
        })

        // If not found, return 404
        if (!user) {
            throw new ErrorHandler(404, `Cannot find any USER with ID ${req.params.user_id}.`);
        }
        
        // Only the user can access their own profile
        if (parseInt(req.params.user_id) !== req.loggedUserId) {
            return res.status(403).json({ success: false, msg: "You are not authorized to access this profile!"})
        }

        // Convert the user to a plain object
        user = user.toJSON();
        user.links = [
            {rel: "modify", href: `/users/${user.user_id}`, method: "PUT"},
            {rel: "delete", href:`/users/${user.user_id}`, method: "DELETE"}
        ]

        res.status(200).json(user); //return the found post
    } catch (err) {
        next(err);
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

        let missingFields = [];
        if (name === undefined) missingFields.push('Name'); 
        if (tin === undefined) missingFields.push('TIN') 
        if (password === undefined) missingFields.push('Password'); 
        if (phone_number === undefined) missingFields.push('Phone Number');
        if (email === undefined) missingFields.push('Email'); 
        if (door_to_door_service === undefined) missingFields.push('Door to Door Service'); 
        if (street_name === undefined) missingFields.push('Street Name'); 
        if (postal_code === undefined) missingFields.push('Postal Code'); 
        if (door_number === undefined) missingFields.push("Door Number");

        if (missingFields.length > 0) 
           throw new ErrorHandler(400, `Missing required fields: ${missingFields.join(', ')}`);

        if (name.length < 6 || name.length > 50) {
            throw new ErrorHandler(400,`Name should have between 6 to 50 characters`);
        }
                
        if (tin < 100000000 || tin > 999999999) {
            throw new ErrorHandler(400,`TIN should have 9 characters`);
        }

        if (phone_number < 100000000 || phone_number > 999999999) {
            throw new ErrorHandler(400,`Phone Number should have 9 characters`);
        }

        if (password.length < 8 || password.length > 60) {
            throw new ErrorHandler(400,`Password should have between 8 to 60 characters`);
        }

        if (email.length < 10 || email.length > 50) {
            throw new ErrorHandler(400,`Email should have between 8 to 60 characters`);
        }

        if (door_to_door_service !== false && door_to_door_service !== true) {
            throw new ErrorHandler(400,`Option must be yes or no`);
        }
        
        if (street_name.length < 10 || street_name.length > 100) {
            throw new ErrorHandler(400,`Street Name should have between 10 and 100 characters`);
        }

        if (postal_code.length !== 8) {
            throw new ErrorHandler(400,`Postal Code should be 8 characters long`);
        }

        if (door_number <= 1 || door_number > 80) {
            throw new ErrorHandler(400,`Door Number should be between 1 and 50`);
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

        const count_all_users = await User.count({}) 
        
        await User.create({
            user_id: count_all_users + 1,
            name, tin, 
            user_number: 3000 + count_user_number + 1,
            password: bcrypt.hashSync(password, 10), 
            email, phone_number, 
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
        let {tin, password} = req.body;        

        //Check if any of these parameters are missing
        if (!tin || !password) {
            return res.status(400).json({ success: false, msg: "Must provide TIN and password."});
        }

        //Try to find a user with the credentials given
        let user = await User.findOne({
            where: { tin },
            raw: true
        })        

        //If the user wasnt found
        if (!user) return res.status(404).json({ sucess: false, msg: "User not found."});
        
        //tests a string (password in body) against a hash (password in db)
        const check = bcrypt.compareSync(password, user.password);
        if (!check) return res.status(401).json({sucess: false, acessToken: null, msg: "Invalid credentials!"})

            

        // sign the given payload (user ID and role) into a JWT payload -> builds JWT token, using secret key
        const token = jwt.sign({ id: user.user_id, role: user.user_type},
            process.env.SECRET, {expiresIn: '24h' //lasts 24 hours!
            });

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
            ],
            accessToken: token
        })
    } catch (err) {        
        next(err)
    }
}


let updateUserInfo = async (req, res, next) => {
    /**
     * Handles the changes an user can do in their profile
     */
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({ errorMessage: "No access token provided" });
        }

        // Find an user by their ID
        const user = await User.findByPk(req.params.user_id);
        if (!user) {
            throw new ErrorHandler(404, `User with ID ${req.params.user_id} wasn't found!`)
        }

        // Only the user can access their own profile
        if (parseInt(req.params.user_id) !== req.loggedUserId) {
            return res.status(403).json({ success: false, msg: "You are not authorized to change this profile!"})
        }

        let {id, name, tin, password, email, phone_number, street_name, postal_code, door_number, door_to_door_service, collection_point_id} = req.body;

        // sequelize update method allows PARTIAL updates, so we NEED to check for missing fields    
        let missingFields = [];
        if (name === undefined) missingFields.push('Name');
        if (tin === undefined) missingFields.push('TIN');
        if (password === undefined) missingFields.push('Password');
        if (email === undefined) missingFields.push('Email');
        if (phone_number === undefined) missingFields.push('Phone Number');
        if (door_to_door_service === undefined) missingFields.push('Door to Door Service');
        if (door_number === undefined) missingFields.push("Door Number");
        if(street_name === undefined) missingFields.push('Street Name');
        if (postal_code === undefined) missingFields.push('Postal Code');
        if (collection_point_id === undefined) missingFields.push('Collection Point ID');

        if (missingFields.length > 0) 
           throw new ErrorHandler(400, `Missing required fields: ${missingFields.join(', ')}`);

        // search for the collection_point id, if there is one
        if (collection_point_id === undefined) {
            throw new ErrorHandler(400, 'Collection Point ID is required');
        }

        if (name.length < 6 || name.length > 50) {
            throw new ErrorHandler(400,`Name should have between 6 to 50 characters`);
        }
                
        if (tin < 100000000 || tin > 999999999) {
            throw new ErrorHandler(400,`TIN should have 9 characters`);
        }

        if (phone_number < 100000000 || phone_number > 999999999) {
            throw new ErrorHandler(400,`Phone Number should have 9 characters`);
        }

        if (password.length < 8 || password.length > 60) {
            throw new ErrorHandler(400,`Name should have between 8 to 60 characters`);
        }

        if (email.length < 10 || email.length > 50) {
            throw new ErrorHandler(400,`Name should have between 8 to 60 characters`);
        }

        if (door_to_door_service !== "sim" && door_to_door_service !== "não") {
            throw new ErrorHandler(400,`Option must be yes or no`);
        }
        
        if (street_name.length < 10 || street_name.length > 100) {
            throw new ErrorHandler(400,`Street Name should have between 10 and 100 characters`);
        }

        if (postal_code.length !== 8) {
            throw new ErrorHandler(400,`Postal Code should have 8 characters`);
        }

        if (door_number <= 1 || door_number > 50) {
            throw new ErrorHandler(400,`Door Number should be between 1 and 50`);
        }

        //Try to find the Collection Point
        const collection_point = await Collection_Point.findByPk(collection_point_id);

        if (!collection_point) {
            throw new ErrorHandler(404, "Collection Point not found")
        }

        //Update all parameters for the user
        const userUpdate = {
            name, 
            tin,
            password: bcrypt.hashSync(password, 10),
            email,
            phone_number, 
            door_to_door_service
        };

        //Update all parameters for the collection point
        const cpUpdate = {street_name, postal_code, door_number}

        //UPDATE QUERIES
        await user.update(userUpdate);
        await collection_point.update(cpUpdate);

        res.status(201).json({
            msg: "User sucessfully updated."
        });

    } catch (err) {
        next(err)
    }
}


let deleteUser = async (req, res, next) => {
    /**
     * Delete an user either if its an admin
     * or the user itself deletes their own profile
     */
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({ errorMessage: "No access token provided" });
        }

        if (req.loggedUserRole !== "admin") {
            return res.status(403).json({ 
                success: false,
                msg: "This request requires ADMIN role!"
            })
        };

        //delete an user in DB given its id
        let result = await User.destroy({where: {user_id: req.params.user_id}});
        // the promise returns the number of deleted rows
        if (result === 0) {
           throw new ErrorHandler(404,`Cannot find any USER with ID ${req.params.user_id}.`);
        }

        // send 204 No Content response
        res.status(200).json({
            msg: `User with id ${req.params.user_id}  sucessfully deleted.`
        });
;
    } catch (err) {
        next(err)
    }
}

module.exports = {
    addUser,
    getAllUsers, getUserById,
    loginUser,
    updateUserInfo,
    deleteUser
}
