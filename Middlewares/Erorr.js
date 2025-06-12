// Middleware to handle 404 Not Found errors
// This middleware creates a 404 error and passes it to the next error handler if no route matches.
function notFoundHandler(req, res, next) {
    const error = new Error('Not Found');
    error.status = 404;
    next(error); // Pass the error to the next middleware
}

// Factory function to create a validation error (HTTP 400)
function validationError(message) {
    const err = new Error(message);
    err.name = 'ValidationError';
    err.status = 400;
    return err;
}

// Factory function to create an authentication error (HTTP 401)
function authenticationError(message) {
    const err = new Error(message);
    err.name = 'AuthenticationError';
    err.status = 401;
    return err;
}

// Factory function to create an authorization error (HTTP 403)
function authorizationError(message) {
    const err = new Error(message);
    err.name = 'AuthorizationError';
    err.status = 403;
    return err;
}

// Factory function to create a database error (HTTP 500)
function databaseError(message) {
    const err = new Error(message);
    err.name = 'DatabaseError';
    err.status = 500;
    return err;
}

// General error handling middleware
// This middleware sends a formatted error response based on error type or status.
function errorHandler(err, req, res, next) {
    console.error(err.stack);
    if (err.name === 'ValidationError') {
        return res.status(err.status).json({ message: err.message, status: err.status });
    }
    if (err.name === 'AuthenticationError') {
        return res.status(err.status).json({ message: err.message, status: err.status });
    }
    if (err.name === 'AuthorizationError') {
        return res.status(err.status).json({ message: err.message, status: err.status });
    }
    if (err.name === 'DatabaseError') {
        return res.status(err.status).json({ message: err.message, status: err.status });
    }
    if (err.status === 404) {
        return res.status(404).json({ message: err.message || 'Not Found', status: 404 });
    }
    res.status(500).json({ message: 'Internal Server Error', status: 500 });
}

module.exports = {
    notFoundHandler,
    errorHandler,
    validationError,
    authenticationError,
    authorizationError,
    databaseError
};


