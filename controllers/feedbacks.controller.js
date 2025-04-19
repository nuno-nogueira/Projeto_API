// Import the feedbacks data model
const feedbacks = require("../models/feedbacks.model.js");

//??
let getAllFeedbacks = (req, res) => {
    /**COLOCAR A ACCESS TOKEN */
    res.json(feedbacks)
}


let getFeedbackById = (req, res) => {
    // Find the feedback with the given id
    /**COLOCAR A ACCESS TOKEN */
    const feedback = feedbacks.find(feedback => feedback.id == req.params.id);

    //404 Error - If user is not found
    if (!feedback) {
        return res.status(404).json({errorMessage: "Feedback not found"})
    }

    /**COLOCAR ERRO 401 (UNAUTHORIZED) */

    /**COLOCAR ERRO 400 (BAD REQUEST) */

    res.json(feedback) // Return the found feedback
}


/**Na rota, como diferenciar entre um id e um user ID */


// let getFeedbackByUser = (req, res) => {
//     // Find the feedbacks from a user with the user's given id
//     /**COLOCAR A ACCESS TOKEN */
//     const userFeedbacks = feedbacks.find(feedback => feedback.user_id == req.params.user_id);

//     //404 Error - If user is not found
//     if (!userFeedbacks) {
//         return res.status(404).json({errorMessage: "Feedbacks from this user not found"})
//     }

//     /**COLOCAR ERRO 401 (UNAUTHORIZED) */

//     /**COLOCAR ERRO 400 (BAD REQUEST) */
//     res.json(userFeedbacks) // Return the found feedback(s)
// }



let validateBodyData = (req, res, next) => {
    // Validate the request body
    if (!req.body) {
        return res.status(400).json({errorMessage: "Request body is required"});
    }

    // Destructure the request body
    let {id, description, feedback_type, collection_point_id, user_id} = req.body;

    /// 400 Error - Field Required
    if (!description) {
        return res.status(400).json({errorMessage: "Description field is required!"})
    }
    
    // 400 Error - Can't be empty
    if (typeof description !== "string") {
        return res.status(400).json({errorMessage: "Description field cannot be empty"})
    }

    /**COLOCAR ERRO 401 (UNAUTHORIZED) */

     // Call the next middleware function
     next();
}


let addFeedback = (req, res) => {
    // Destructure the request body
    const  {id, description, feedback_type, collection_point_id, user_id} = req.body;

    // Create a new feedback object with the next id
    const newFeedback = {
        id: feedbacks.length + 1,
        description, 
        feedback_type, collection_point_id, user_id
    };

    // Add a new feedback to the feedbacks array
    feedbacks.push(newFeedback);

    // 201 Status - Created a new feedback sucessfully!
    res.status(201).json({ location: `/feedbacks/${newFeedback.id}`});
}

module.exports = {
    getAllFeedbacks, getFeedbackById,
    validateBodyData,
    addFeedback
}