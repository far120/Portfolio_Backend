const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerSchema, loginSchema } = require('../Middlewares/joiSchemas');
const { validateBody } = require('../Middlewares/validate');
const { validationError, authenticationError } = require('../Middlewares/Erorr');
const {authorizeSuperAdmin , authenticate} = require('../Middlewares/auth');

router.post('/register', validateBody(registerSchema), async (req, res, next) => {
    try {
        console.log('Register request received:', req.body);
        const { email, password } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return next(validationError('Email already registered'));
        const hash = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hash, role: 'superadmin' });
        await user.save();
        res.status(201).json({ message: 'User registered' });
    } catch (err) {
        next(err);
    }
});

router.post('/login', validateBody(loginSchema), async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return next(authenticationError('Invalid email or password'));
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return next(authenticationError('Invalid email or password'));
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    } catch (err) {
        next(err);
    }
});

router.get('/', authenticate , authorizeSuperAdmin , async (req, res, next) => {
    try {
        const users = await User.find({}, '-password');
        res.json(users);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
