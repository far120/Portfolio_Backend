const express = require('express');
const mongoose = require('mongoose');
const Project = require('../models/Projects');
const { projectSchema } = require('../Middlewares/joiSchemas');
const { authenticate, authorizeAdmin } = require('../Middlewares/auth');
const { validateBody } = require('../Middlewares/validate');

const router = express.Router();

// GET all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a single project by ID
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create a new project (admin only)
router.post('/', authenticate, authorizeAdmin, validateBody(projectSchema), async (req, res, next) => {
    try {
        const project = new Project(req.body);
        const newProject = await project.save();
        res.status(201).json(newProject);
    } catch (err) {
        next(err);
    }
});

// PUT update a project (admin only)
router.put('/:id', authenticate, authorizeAdmin, validateBody(projectSchema), async (req, res, next) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id, req.body , { new: true, runValidators: true }
        );
        if (!updatedProject) return res.status(404).json({ message: 'Project not found' });
        res.json(updatedProject);
    } catch (err) {
        next(err);
    }
});

// DELETE a project (admin only)
router.delete('/:id', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        if (!deletedProject) return res.status(404).json({ message: 'Project not found' });
        res.json({ message: 'Project deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;