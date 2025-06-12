const mongoose = require('mongoose');

// Database connection
function connectToDatabase() {
mongoose.connect(process.env.MONGODB_URI) 
.then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
}


// Export the mongoose connection
module.exports = {
    connectToDatabase
};