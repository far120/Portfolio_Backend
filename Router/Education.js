const express = require('express');
const Education = require('../models/Education');
const { educationSchema } = require('../Middlewares/joiSchemas');
const { authenticate, authorizeAdmin, authorizeUserOrAdmin, authorizeSuperAdmin } = require('../Middlewares/auth');
const { validateBody } = require('../Middlewares/validate');

const router = express.Router();

router.post('/', authenticate, authorizeAdmin, validateBody(educationSchema), async (req, res, next) => {
    try {
        const education = new Education({ ...req.body, userId: req.user.id });
        await education.save();
        res.status(201).json(education);
    } catch (err) {
        next(err);
    }
});

// Superadmin: Get all education
router.get('/', authenticate, authorizeSuperAdmin, async (req, res) => {
    try {
        const educations = await Education.find().sort({ createdAt: -1 });
        res.json(educations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Public: Get education for a specific admin
router.get('/:adminId', async (req, res) => {
    try {
        const educations = await Education.find({ userId: req.params.adminId }).sort({ createdAt: -1 });
        res.json(educations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Public: Get a single education by education ID
// router.get('/single/:id', async (req, res, next) => {
//     try {
//         const education = await Education.findById(req.params.id);
//         if (!education) return res.status(404).json({ error: 'Education not found' });
//         res.json(education);
//     } catch (err) {
//         next(err);
//     }
// });

router.put('/:id', authenticate, authorizeUserOrAdmin, validateBody(educationSchema), async (req, res, next) => {
    try {
        let filter = { _id: req.params.id };
        if (req.user.role !== 'superadmin') {
            filter.userId = req.user.id;
        }
        const education = await Education.findOneAndUpdate(filter, req.body, { new: true, runValidators: true });
        if (!education) return res.status(404).json({ error: 'Education not found' });
        res.json(education);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', authenticate, authorizeUserOrAdmin, async (req, res, next) => {
    try {
        let filter = { _id: req.params.id };
        if (req.user.role !== 'superadmin') {
            filter.userId = req.user.id;
        }
        const education = await Education.findOneAndDelete(filter);
        if (!education) return res.status(404).json({ error: 'Education not found' });
        res.json({ message: 'Education deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
