const express = require('express');
const Skill = require('../models/Skill');
const { skillSchema } = require('../Middlewares/joiSchemas');
const { authenticate, authorizeAdmin, authorizeUserOrAdmin, authorizeSuperAdmin } = require('../Middlewares/auth');
const { validateBody } = require('../Middlewares/validate');

const router = express.Router();

router.post('/', authenticate, authorizeAdmin, validateBody(skillSchema), async (req, res, next) => {
    try {
        const skill = new Skill({ ...req.body, userId: req.user.id });
        await skill.save();
        res.status(201).json(skill);
    } catch (err) {
        next(err);
    }
});

// Superadmin: Get all skills
router.get('/', authenticate, authorizeSuperAdmin, async (req, res) => {
    try {
        const skills = await Skill.find().sort({ createdAt: -1 });
        res.json(skills);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Public: Get skills for a specific admin
router.get('/:adminId', async (req, res) => {
    try {
        const skills = await Skill.find({ userId: req.params.adminId }).sort({ createdAt: -1 });
        res.json(skills);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Public: Get a single skill by skill ID
// router.get('/single/:id', async (req, res) => {
//     try {
//         const skill = await Skill.findById(req.params.id);
//         if (!skill) return res.status(404).json({ error: 'Skill not found' });
//         res.json(skill);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

router.delete('/:id', authenticate, authorizeUserOrAdmin, async (req, res, next) => {
    try {
        let filter = { _id: req.params.id };
        if (req.user.role !== 'superadmin') {
            filter.userId = req.user.id;
        }
        const skill = await Skill.findOneAndDelete(filter);
        if (!skill) return res.status(404).json({ error: 'Skill not found' });
        res.json({ message: 'Skill deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
