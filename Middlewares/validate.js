// Joi validation middleware
const { validationError } = require('./Erorr');

function validateBody(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) return next(validationError(error.details[0].message));
        next();
    };
}

module.exports = { validateBody };
