//Import the users data model
const db = require('../models/db.js'); // Import the database connection
const User = db.User; // Import the User model from the database connection
const Collection_Point = db.Collection_Point;
const Feedback = db.Feedback;
const { Op } = require('sequelize'); // necessary operators for Sequelize

const { ErrorHandler } = require("../utils/error.js"); // Import the ErrorHandler class for error handling


let getAllFeedbacks = async (req, res, next) => {
    /**
     * Get all feedbacks
     */
    try {
        const {sort, order} = req.query;

        //validate sort and order values
        if (sort && sort !== "tipo_feedback") {
            throw new ErrorHandler(400, `Invalid value for sort: ${sort}. It should be 'tipo_feedback'.`);
        }

        if (order && order !== "asc" && order !== "desc") {
            throw new ErrorHandler(400, `Invalid value for order: ${order}. It should be either 'asc' or 'desc'.`);
        }

        //sort & order options must be passed together!!
        if ((sort && !order) || (!sort && order)) {
            throw new ErrorHandler(400, `Both sort and order must be provided together.`);
        }

        //ordering by feedback type and date
        const sortField = sort === "date_time" ? "date_time" : "feedback_id"
        const sortOrder = order === "desc" ? "DESC" : "ASC";

        let feedbacks = await Feedback.findAndCountAll({
            order: [[sortField, sortOrder]],
            raw: false,
        })

        feedbacks.rows.forEach(feedback => {
            feedbacks.links = [
                {rel: "self", href: `/feedbacks/${feedback.feedback_id}`, method: "GET"}
            ]
        });

        return res.status(200).json({
            total: feedbacks.count,
            data: feedbacks.rows
        });
    } catch (error) {
        console.error(error);
        
        next(error);
    }
}


let getFeedbackById = async (req, res, next) => {
    /**Get feedback by ID */
    try {
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
        const {feedback_id, description, feedback_type, collection_point_id, user_id, feedback_date} = req.body;

        // sequelize update method allows PARTIAL updates, so we NEED to check for missing fields    
        let missingFields = [];
        if (feedback_id === undefined) missingFields.push('Feedback ID');
        if (description === undefined) missingFields.push('Description');
        if (feedback_type === undefined) missingFields.push('Feedback type');
        if (collection_point_id === undefined) missingFields.push('Collection Point ID');
        if (user_id === undefined) missingFields.push('User ID');
        if (feedback_date === undefined) missingFields.push('Time');

        if (missingFields.length > 0) 
            throw new ErrorHandler(400, `Missing required fields: ${missingFields.join(', ')}`);

        await Feedback.create(req.body);

        res.status(201).json({
            msg: "Feedback was sucessfully created!",
        })

    } catch (error) {
        console.error(error);
        
        next(error);
    }
}

module.exports = {
    getAllFeedbacks, getFeedbackById,
    addFeedback
}