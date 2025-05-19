//import express & path modules
const express = require('express');
const path = require('path')


// read environment variables from .env file
require('dotenv').config();

const app = express();
const port = process.env.PORT;	// use environment variables
const host = process.env.HOST;

app.use(express.json());

// use route middleware for all requests
app.use('/users', require('./routes/users.routes.js'));
app.use('/stats', require('./routes/stats.routes.js'));
app.use('/feedbacks', require('./routes/feedbacks.routes.js'));
app.use('/collection-points', require('./routes/collection-points.routes.js'));
app.use('/collection-guides', require('./routes/collection-guides.routes.js'));

// //Index Page
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// })

// error middleware (always at the end of the file)
app.use((err, req, res, next) => {
    // !Uncomment this line to log the error details to the server console!
    console.error(err);

    // error thrown by express.json() middleware when the request body is not valid JSON
    if (err.type === 'entity.parse.failed')
        return res.status(400).json({ error: 'Invalid JSON payload! Check if your body data is a valid JSON.' });

    // Sequelize validation errors (ALL models)
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            error: 'Validation error',
            details: err.errors.map(e => ({
                field: e.path,
                message: e.message
            }))
        });
    }

    // SequelizeDatabaseError related to an invalid ENUM value (USERS table -> role field)
    if (err.name === 'SequelizeDatabaseError') {
        if (err.original.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
            return res.status(400).json({
                error: 'Invalid value for enumerated field',
                message: err.message
            });
        }
        if (err.original.code === 'ER_BAD_NULL_ERROR') {
            return res.status(400).json({
                error: 'Missing mandatory field',
                message: err.message
            });
        }
        if (err.original.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                error: 'Duplicate entry',
                message: err.message
            });
        }
    }
    // other errors
    res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(port, host, () => {
    console.log(`App listening at http://${host}:${port}/`)
})