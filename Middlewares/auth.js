const jwt = require('jsonwebtoken');
const { authenticationError, authorizationError } = require('./Erorr');

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(authenticationError('No token provided'));
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return next(authenticationError('Invalid token'));
    }
}

function authorizeAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return next(authorizationError('Not authorized'));
    }
}

module.exports = { authenticate, authorizeAdmin };
