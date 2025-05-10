//Import the users data model
const users = require("../models/users.model.js");

//?? 
let getAllUsers = (req, res) => {
    res.json(users)
}


let getUserById = (req, res) => {
    //Find the user with the give id
    /**COLOCAR A ACCESS TOKEN */
    const user = users.find(user => user.id == req.params.id);


    //404 Error - If user not found
    if (!user) {
        return res.status(404).json({errorMessage: "User not found"});
    }

    /**COLOCAR ERRO 401 (UNAUTHORIZED) */

    res.json(user) // Return the found user
}


let validateLoginData = (req, res) => {
    // Validate the request body
    if (!req.body) {
        return res.status(400).json({errorMessage: "Request body is required"})
    }

    let email = req.body.email
    let password = req.body.password

    // 400 Error - Field Required
    if (!email) {
        return res.status(400).json({errorMessage: "Email field is required"})
    } else if (!password) {
        return res.status(400).json({errorMessage: "Password field is required"})
    }

    // 400 Error - Can't be empty
    if (typeof email !== "string") {
        return res.status(400).json({errorMessage: "Email field cannot be empty"})
    } else if (typeof password !== "string") {
        return res.status(400).json({errorMessage: "Password field cannot be empty"})

    }

    // Used for credentials validation
    let emailFound = false;
    let passwordFound = false;
    let user;

    // Loop through the array to validate the credentials given
    users.forEach(user => {
        if (user.email_contact === email) {
            emailFound = true;
        }
        if (user.password === password) {
            passwordFound = true;
        }
    });

    // If both credentials are valid
    if (emailFound && passwordFound) {
        user = users.find(user => user.email_contact === email && user.password === password);

        // 201 Status Code - Login done sucessfully
        res.status(201).json({ location: `/users/${user.id}`})

    // 401 - Unauthorized - If only one credential was found
    } else if (emailFound || passwordFound) {
        return res.status(401).json({errorMessage: "Invalid credentials"})
    // 404 - Not Found - If no credentials were valid
    } else if (!emailFound && !passwordFound) {
        return res.status(404).json({errorMessage: "Credentials weren't found"})
    }
}


let validateSignUpData = (req, res, next) => {
    // Validate the request body
    if (!req.body) {
        return res.status(400).json({errorMessage: "Request body is required"})
    }

    // Destructure the request body 
    let { id, full_name, tin, user_number, password, email_contact, phone_contact, user_type, DtD_service, postal_code, address} = req.body;

    // 400 Error - Field required
    if (!tin) {
        return res.status(400).json({errorMessage: "TIN field is required"})
    } else if (!email_contact) {
        return res.status(400).json({errorMessage: "Email field is required"})
    } else if (!password) {
        return res.status(400).json({errorMessage: "Password field is required"})
    } else if (!postal_code) {
        return res.status(400).json({errorMessage: "Postal Code field is required"})
    } else if (!address) {
        return res.status(400).json({errorMessage: "Address field is required"})
    } else if (!full_name) {
        return res.status(400).json({errorMessage: "Full Name field is required"})
    } else if (!phone_contact) {
        return res.status(400).json({errorMessage: "Phone Number field is required"})
    }

    // 400 Error - Already being used
    users.forEach(user => {
        if (user.email_contact === email_contact) {
            return res.status(400).json({errorMessage: "Email is already being used"})
        } else if (user.tin === tin) {
            return res.status(400).json({errorMessage: "TIN is already being used"})
        }
    });

    // 400 Error - Can't be empty
    if (typeof tin !== "number") {
        return res.status(400).json({errorMessage: "TIN field cannot be empty"})
    } else if (typeof email_contact !== "string") {
        return res.status(400).json({errorMessage: "Email field cannot be empty"})
    } else if (typeof password !== "string") {
        return res.status(400).json({errorMessage: "Password field cannot be empty"})
    } else if (typeof postal_code !== "string") {
        return res.status(400).json({errorMessage: "Postal Code field cannot be empty"})
    } else if (typeof address !== "string") {
        return res.status(400).json({errorMessage: "Address field cannot be empty"})
    } else if (typeof full_name !== "string") {
        return res.status(400).json({errorMessage: "Full Name field cannot be empty"})
    } else if (typeof phone_contact !== "number") {
        return res.status(400).json({errorMessage: "Phone Number field cannot be empty"})
    } else if (typeof DtD_service !== "boolean")

    // Call the next middleware function
    next()
}


let addUser = (req, res) => {
    // Destructure the request body  
    const {full_name, tin,password, email_contact, phone_contact, DtD_service, postal_code, address} = req.body;

    // Create a new user object with the next id
    const newUser = {
        id: users.length + 1,
        full_name,
        tin,
        user_number: Math.floor(Math.random() * 99999999) + 10000000,
        password,
        email_contact,
        phone_contact,
        user_type: "user",
        DtD_service: DtD_service || false,
        postal_code,
        address
    };

    // Add a new user to the users array
    users.push(newUser);

    // 201 Status Code - Created user sucessfully
    res.status(201).json({ location: `/users/${newUser.id}`})
}


let updateUserInfo = (req, res) => {
    // Find the user with the given id
    const user = users.find(user => user.id == req.params.id);

    /**COLOCAR ERRO 403 - FORBIDDEN && ERRO 405 CONFLICT*/

    // 404 Error - If user not found
    if (!user) {
        return res.status(404).json({errorMessage: "User not found"});
    }

    // Update the user with the new data
    user.full_name = req.body.full_name;
    user.tin = req.body.tin;
    user.password = req.body.password;
    req.email_contact = req.body.email_contact;
    req.phone_contact = req.body.phone_contact;
    req.postal_code = req.body.postal_code;
    req.address = req.body.address;

    // 204 Status - No Content
    res.status(204).json();
}


let deleteUser = (req, res) => {
    //Delete user with the id given
    const userIndex = users.findIndex(user => user.id == req.params.id);

    //404 Error - not found
    if (userIndex === -1) {
        return res.status(404).json({errorMessage: "User not found"})
    }

    //Remove user from the array
    users.splice(userIndex, 1); 

    //204 Status - No content code
    res.status(204).json();
}

module.exports = {
    addUser,
    validateSignUpData, validateLoginData,
    getAllUsers, getUserById,
    updateUserInfo,
    deleteUser
}
