const express = require('express');
const Certification = require('../models/Certafication');
const { certSchema } = require('../Middlewares/joiSchemas');
const { authenticate, authorizeAdmin, authorizeUserOrAdmin, authorizeSuperAdmin } = require('../Middlewares/auth');
const { validateBody } = require('../Middlewares/validate');

const router = express.Router();

// Create a new certification (admin only)
router.post('/', authenticate, authorizeAdmin, validateBody(certSchema), async (req, res, next) => {
    try {
        const certification = new Certification({ ...req.body, userId: req.user.id });
        await certification.save();
        res.status(201).json(certification);
    } catch (err) {
        next(err);
    }
});

// Superadmin: Get all certifications
router.get('/', authenticate, authorizeSuperAdmin, async (req, res) => {
    try {
        const certifications = await Certification.find().sort({ createdAt: -1 });
        res.json(certifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Public: Get certifications for a specific admin
router.get('/:adminId', async (req, res) => {
    try {
        const certifications = await Certification.find({ userId: req.params.adminId }).sort({ createdAt: -1 });
        res.json(certifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Public: Get a single certification by certification ID
// router.get('/single/:id', async (req, res, next) => {
//     try {
//         const certification = await Certification.findById(req.params.id);
//         if (!certification) return res.status(404).json({ error: 'Certification not found' });
//         res.json(certification);
//     } catch (err) {
//         next(err);
//     }
// });

// Update a certification by ID (owner admin or superadmin only)
router.put('/:id', authenticate, authorizeUserOrAdmin, validateBody(certSchema), async (req, res, next) => {
    try {
        let filter = { _id: req.params.id };
        if (req.user.role !== 'superadmin') {
            filter.userId = req.user.id;
        }
        const certification = await Certification.findOneAndUpdate(filter, req.body, { new: true, runValidators: true });
        if (!certification) return res.status(404).json({ error: 'Certification not found' });
        res.json(certification);
    } catch (err) {
        next(err);
    }
});

// Delete a certification by ID (owner admin or superadmin only)
router.delete('/:id', authenticate, authorizeUserOrAdmin, async (req, res, next) => {
    try {
        let filter = { _id: req.params.id };
        if (req.user.role !== 'superadmin') {
            filter.userId = req.user.id;
        }
        const certification = await Certification.findOneAndDelete(filter);
        if (!certification) return res.status(404).json({ error: 'Certification not found' });
        res.json({ message: 'Certification deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;