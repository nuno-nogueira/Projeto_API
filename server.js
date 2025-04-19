//import express & path modules
const express = require('express');
const path = require('path')

const app = express();
app.use(express.json());

const hostname = process.env.HOST || '127.0.0.1'; // local server​
const port = process.env.PORT || 3000; // port to listen to 

// use route middleware for all requests
app.use('/users', require('./routes/users.routes.js'));
app.use('/stats', require('./routes/stats.routes.js'));
app.use('/feedbacks', require('./routes/feedbacks.routes.js'));
app.use('/collection-points', require('./routes/collection-points.routes.js'));
app.use('/collection-guides', require('./routes/collection-guides.routes.js'));

//Index Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

// error middleware (always at the end of the file)
app.use((err, req, res, next) => {
    // console.error(err); 
   
    // error thrown by express.json() middleware when the request body is not valid JSON
    if (err.type === 'entity.parse.failed') 
        return res.status(400).json({ message: 'Invalid JSON payload! Check if your body data is a valid JSON.' });
    
    res.status(err.statusCode || 500).json({ message: err.message || 'Internal Server Error' }); 
});

app.listen(port, hostname, (error) => {
    console.log(`App listening at http://${hostname}:${port}/`)
})