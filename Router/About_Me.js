const express = require('express');
const AboutMe = require('../models/About_Me');
const { aboutMeSchema } = require('../Middlewares/joiSchemas');
const { authenticate, authorizeAdmin, authorizeSuperAdmin, authorizeUserOrAdmin } = require('../Middlewares/auth');
const { validateBody } = require('../Middlewares/validate');

const router = express.Router();

// Superadmin: Get all about-me
router.get('/', authenticate, authorizeSuperAdmin, async (req, res) => {
    try {
        const aboutMe = await AboutMe.find().sort({ createdAt: -1 });
        res.json(aboutMe);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Public: Get about-me for a specific admin
router.get('/:adminId', async (req, res) => {
    try {
        const aboutMe = await AboutMe.find({ userId: req.params.adminId }).sort({ createdAt: -1 });
        res.json(aboutMe);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Public: Get a single about-me by about-me ID
// router.get('/single/:id', async (req, res) => {
//     try {
//         const aboutMe = await AboutMe.findById(req.params.id);
//         if (!aboutMe) return res.status(404).json({ error: 'About Me not found' });
//         res.json(aboutMe);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// POST /about-me (admin only, each admin can add his own data)
router.post('/', authenticate, authorizeAdmin, validateBody(aboutMeSchema), async (req, res, next) => {
    try {
        const aboutMe = new AboutMe({ ...req.body, userId: req.user.id });
        await aboutMe.save();
        res.status(201).json(aboutMe);
    } catch (err) {
        next(err);
    }
});

// PUT /about-me/:id (owner admin or superadmin only)
router.put('/:id', authenticate, authorizeUserOrAdmin, validateBody(aboutMeSchema), async (req, res, next) => {
    try {
        let filter = { _id: req.params.id };
        if (req.user.role !== 'superadmin') {
            filter.userId = req.user.id;
        }
        const aboutMe = await AboutMe.findOneAndUpdate(filter, req.body, { new: true });
        if (!aboutMe) {
            return res.status(404).json({ message: 'About Me not found' });
        }
        res.json(aboutMe);
       
    } catch (err) {
        next(err);
    }
});

// DELETE /about-me/:id (owner admin or superadmin only)
router.delete('/:id', authenticate, authorizeUserOrAdmin, async (req, res, next) => {
    try {
        let filter = { _id: req.params.id };
        if (req.user.role !== 'superadmin') {
            filter.userId = req.user.id;
        }
        const aboutMe = await AboutMe.findOneAndDelete(filter);
        if (!aboutMe) {
            return res.status(404).json({ message: 'About Me not found' });
        }
        res.json({ message: 'About Me deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;