const express = require('express');
const Education = require('../models/Education');
const { educationSchema } = require('../Middlewares/joiSchemas');
const { authenticate, authorizeAdmin } = require('../Middlewares/auth');
const { validateBody } = require('../Middlewares/validate');

const router = express.Router();

router.post('/', authenticate, authorizeAdmin, validateBody(educationSchema), async (req, res, next) => {
    try {
        const education = new Education(req.body);
        await education.save();
        res.status(201).json(education);
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const educations = await Education.find();
        res.json(educations);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const education = await Education.findById(req.params.id);
        if (!education) return res.status(404).json({ error: 'Education not found' });
        res.json(education);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', authenticate, authorizeAdmin, validateBody(educationSchema), async (req, res, next) => {
    try {
        const education = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!education) return res.status(404).json({ error: 'Education not found' });
        res.json(education);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
        const education = await Education.findByIdAndDelete(req.params.id);
        if (!education) return res.status(404).json({ error: 'Education not found' });
        res.json({ message: 'Education deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
