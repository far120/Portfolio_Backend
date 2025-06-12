const express = require('express');
const AboutMe = require('../models/About_Me');
const { aboutMeSchema } = require('../Middlewares/joiSchemas');
const { authenticate, authorizeAdmin } = require('../Middlewares/auth');
const { validateBody } = require('../Middlewares/validate');

const router = express.Router();

// GET /about-me
router.get('/', async (req, res) => {
    try {
        const aboutMe = await AboutMe.findOne().sort({ createdAt: -1 });
        if (!aboutMe) {
            return res.status(404).json({ message: 'About Me not found' });
        }
        res.json(aboutMe);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /about-me (admin only)
router.post('/', authenticate, authorizeAdmin, validateBody(aboutMeSchema), async (req, res, next) => {
    try {
        const aboutMe = new AboutMe(req.body);
        await aboutMe.save();
        res.status(201).json(aboutMe);
    } catch (err) {
        next(err);
    }
});

// PUT /about-me/:id (admin only)
router.put('/:id', authenticate, authorizeAdmin, validateBody(aboutMeSchema), async (req, res, next) => {
    try {
        const aboutMe = await AboutMe.findOneAndReplace({ _id: req.params.id }, req.body, { new: true, runValidators: true });
        if (!aboutMe) {
            return res.status(404).json({ message: 'About Me not found' });
        }
        res.json(aboutMe);
    } catch (err) {
        next(err);
    }
});

// DELETE /about-me/:id (admin only)
router.delete('/:id', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
        const aboutMe = await AboutMe.findByIdAndDelete(req.params.id);
        if (!aboutMe) {
            return res.status(404).json({ message: 'About Me not found' });
        }
        res.json({ message: 'About Me deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;