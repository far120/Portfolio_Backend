const express = require('express');
const WorkExperience = require('../models/Work_Experinse');
const { workSchema } = require('../Middlewares/joiSchemas');
const { authenticate, authorizeAdmin, authorizeUserOrAdmin, authorizeSuperAdmin } = require('../Middlewares/auth');
const { validateBody } = require('../Middlewares/validate');

const router = express.Router();

// Create a new work experience (admin only)
router.post('/', authenticate, authorizeAdmin, validateBody(workSchema), async (req, res, next) => {
    try {
        const workExperience = new WorkExperience({ ...req.body, userId: req.user.id });
        const saved = await workExperience.save();
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }
});

// Superadmin: Get all work experiences
router.get('/', authenticate, authorizeSuperAdmin, async (req, res) => {
    try {
        const experiences = await WorkExperience.find().sort({ createdAt: -1 });
        res.json(experiences);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Public: Get work experiences for a specific admin
router.get('/:adminId', async (req, res) => {
    try {
        const experiences = await WorkExperience.find({ userId: req.params.adminId }).sort({ createdAt: -1 });
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

// Update a work experience by ID (PUT - replace, owner admin or superadmin only)
router.put('/:id', authenticate, authorizeUserOrAdmin, validateBody(workSchema), async (req, res, next) => {
    try {
        let filter = { _id: req.params.id };
        if (req.user.role !== 'superadmin') {
            filter.userId = req.user.id;
        }
        const updated = await WorkExperience.findOneAndUpdate(filter, req.body, { new: true, runValidators: true, overwrite: true });
        if (!updated) return res.status(404).json({ error: 'Not found' });
        res.json(updated);
    } catch (err) {
        next(err);
    }
});


// Delete a work experience by ID (owner admin or superadmin only)
router.delete('/:id', authenticate, authorizeUserOrAdmin, async (req, res, next) => {
    try {
        let filter = { _id: req.params.id };
        if (req.user.role !== 'superadmin') {
            filter.userId = req.user.id;
        }
        const deleted = await WorkExperience.findOneAndDelete(filter);
        if (!deleted) return res.status(404).json({ error: 'Not found' });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;