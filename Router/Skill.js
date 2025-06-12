const express = require('express');
const Skill = require('../models/Skill');
const { skillSchema } = require('../Middlewares/joiSchemas');
const { authenticate, authorizeAdmin } = require('../Middlewares/auth');
const { validateBody } = require('../Middlewares/validate');

const router = express.Router();

router.post('/', authenticate, authorizeAdmin, validateBody(skillSchema), async (req, res, next) => {
    try {
        const skill = new Skill(req.body);
        await skill.save();
        res.status(201).json(skill);
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const skills = await Skill.find();
        res.json(skills);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
        const skill = await Skill.findByIdAndDelete(req.params.id);
        if (!skill) return res.status(404).json({ error: 'Skill not found' });
        res.json({ message: 'Skill deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
