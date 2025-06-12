const express = require('express');
const Certification = require('../models/Certafication');
const { certSchema } = require('../Middlewares/joiSchemas');
const { authenticate, authorizeAdmin } = require('../Middlewares/auth');
const { validateBody } = require('../Middlewares/validate');

const router = express.Router();

// Create a new certification (admin only)
router.post('/', authenticate, authorizeAdmin, validateBody(certSchema), async (req, res, next) => {
    try {
        const certification = new Certification(req.body);
        await certification.save();
        res.status(201).json(certification);
    } catch (err) {
        next(err);
    }
});

// Get all certifications
router.get('/', async (req, res, next) => {
    try {
        const certifications = await Certification.find();
        res.json(certifications);
    } catch (err) {
        next(err);
    }
});

// Get a single certification by ID
router.get('/:id', async (req, res, next) => {
    try {
        const certification = await Certification.findById(req.params.id);
        if (!certification) return res.status(404).json({ error: 'Certification not found' });
        res.json(certification);
    } catch (err) {
        next(err);
    }
});

// Update a certification by ID (admin only)
router.put('/:id', authenticate, authorizeAdmin, validateBody(certSchema), async (req, res, next) => {
    try {
        const certification = await Certification.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!certification) return res.status(404).json({ error: 'Certification not found' });
        res.json(certification);
    } catch (err) {
        next(err);
    }
});

// Delete a certification by ID (admin only)
router.delete('/:id', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
        const certification = await Certification.findByIdAndDelete(req.params.id);
        if (!certification) return res.status(404).json({ error: 'Certification not found' });
        res.json({ message: 'Certification deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;