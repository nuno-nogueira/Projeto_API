//Import the users data model
const db = require('../models/db.js'); // Import the database connection
const User = db.User; // Import the User model from the database connection
const Collection_Point = db.Collection_Point;
const Feedback = db.Feedback;
const { Op } = require('sequelize'); // necessary operators for Sequelize

const { ErrorHandler } = require("../utils/error.js"); // Import the ErrorHandler class for error handling
const { access } = require('fs');

let getFeedbackById = async (req, res, next) => {
    /**Get feedback by ID */
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({ errorMessage: "No access token provided" });
        }
        if (req.loggedUserRole !== "admin") {
            return res.status(401).json({ success: false,
                msg: "This request required ADMIN role!"
            })
        };
        //Gather the feedback's info, as well as who posted it, and from what collection point its from
        let feedback = await Feedback.findByPk(req.params.id, {
            attributes: ['description', 'feedback_type', 'feedback_date', 'collection_point_id'],
            include: [
                {
                    model: User,
                    attributes: ["name"]
                },
                {
                    model: Collection_Point,
                    attributes: ["street_name", "postal_code"]
                }
            ]
        });

        if (!feedback) {
            throw new ErrorHandler(404, `Feedback with ID ${id} not found`);
        }

        const result = feedback.toJSON();

        return res.status(200).json(result);
    } catch (error) {
        next(error)
    }
}

let addFeedback = async (req, res, next) => {
    /**
     * Add a new feedback
     */
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({ errorMessage: "No access token provided" });
        }
        
        const {description, feedback_type, collection_point_id, user_id, feedback_date} = req.body;

        // sequelize update method allows PARTIAL updates, so we NEED to check for missing fields    
        let missingFields = [];
        if (description === undefined) missingFields.push('Description');
        if (feedback_type === undefined) missingFields.push('Feedback type');
        if (collection_point_id === undefined) missingFields.push('Collection Point ID');
        if (user_id === undefined) missingFields.push('User ID');
        if (feedback_date === undefined) missingFields.push('Time');

        if (missingFields.length > 0) {
            throw new ErrorHandler(400, `Missing required fields: ${missingFields.join(', ')}`)
        }

        if (description.length < 10 || description.length > 100) {
            throw new ErrorHandler(400,`Description should have between 10 and 100 characters`);
        }

        const count_all_feedbacks = await Feedback.count({}) 
        let feedback_id = count_all_feedbacks + 1

        await Feedback.create({
            feedback_id,
            description,
            feedback_type,
            collection_point_id,
            user_id,
            feedback_date
        });

        res.status(201).json({
            msg: "Feedback was sucessfully created!",
        })

    } catch (error) {        
        next(error);
    }
}

module.exports = {
    getFeedbackById,
    addFeedback
}