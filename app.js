const express = require('express');
const { connectToDatabase } = require('./config/config'); 
require('dotenv').config(); 

// api init
const app = express();

// Database connection
connectToDatabase();

// API endpoint to start the server
app.get('/', (req, res) => {
    res.send('Hello World!'); 
});


// Middleware
app.use(express.json()); // Parse JSON bodies

// Route
app.use('/api/work-experience', require('./Router/Work_Experinse')); // Work Experience routes
app.use('/api/projects', require('./Router/Projects')); // Projects routes
app.use('/api/certifications', require('./Router/Certafication')); // Certifications routes
app.use('/api/about-me', require('./Router/About_Me')); // About Me routes
app.use('/api/skills', require('./Router/Skill')); // Skills routes
app.use('/api/contact', require('./Router/Contact')); // Contact routes
app.use('/api/auth', require('./Router/auth')); // Authentication routes
app.use('/api/Education', require('./Router/Education')); // Education routes


// Error Handling Middleware
const { notFoundHandler, errorHandler } = require('./Middlewares/Erorr'); // Importing error handling middleware
app.use(notFoundHandler); // Handle 404 Not Found errors
app.use(errorHandler); // Handle all other errors


// Run server
const port = process.env.PORT || 2008;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    });
