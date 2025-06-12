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
    if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
        next();
    } else {
        return next(authorizationError('Not authorized'));
    }
}

function authorizeSuperAdmin(req, res, next) {
    if (req.user && req.user.role === 'superadmin') {
        next();
    } else {
        return next(authorizationError('Superadmin only'));
    }
}

function authorizeUserOrAdmin(req, res, next) {
    // Allow if superadmin
    if (req.user && req.user.role === 'superadmin') return next();
    // Allow if admin and resource belongs to him
    if (req.user && req.user.role === 'admin') {
        req._ownerOnly = true;
        return next();
    }
    // Deny for others
    return next(authorizationError('Not authorized'));
}

module.exports = { authenticate, authorizeAdmin, authorizeSuperAdmin, authorizeUserOrAdmin };
