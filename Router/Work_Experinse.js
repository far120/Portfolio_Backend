const express = require('express');
const WorkExperience = require('../models/Work_Experinse');
const { workSchema } = require('../Middlewares/joiSchemas');
const { authenticate, authorizeAdmin } = require('../Middlewares/auth');
const { validateBody } = require('../Middlewares/validate');

const router = express.Router();

// Create a new work experience (admin only)
router.post('/', authenticate, authorizeAdmin, validateBody(workSchema), async (req, res, next) => {
    try {
        const workExperience = new WorkExperience(req.body);
        const saved = await workExperience.save();
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }
});

// Get all work experiences
router.get('/', async (req, res) => {
    try {
        const experiences = await WorkExperience.find();
        res.json(experiences);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single work experience by ID
router.get('/:id', async (req, res) => {
    try {
        const experience = await WorkExperience.findById(req.params.id);
        if (!experience) return res.status(404).json({ error: 'Not found' });
        res.json(experience);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a work experience by ID (PUT - replace, admin only)
router.put('/:id', authenticate, authorizeAdmin, validateBody(workSchema), async (req, res, next) => {
    try {
        const updated = await WorkExperience.findByIdAndUpdate( req.params.id, req.body, { new: true, runValidators: true, overwrite: true } );
        if (!updated) return res.status(404).json({ error: 'Not found' });
        res.json(updated);
    } catch (err) {
        next(err);
    }
});



// Delete a work experience by ID (admin only)
router.delete('/:id', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
        const deleted = await WorkExperience.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Not found' });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;