const express = require('express');
const mongoose = require('mongoose');
const Project = require('../models/Projects');
const { projectSchema } = require('../Middlewares/joiSchemas');
const { authenticate, authorizeAdmin, authorizeUserOrAdmin, authorizeSuperAdmin } = require('../Middlewares/auth');
const { validateBody } = require('../Middlewares/validate');

const router = express.Router();

// Superadmin: Get all projects
router.get('/', authenticate, authorizeSuperAdmin, async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Public: Get projects for a specific admin
router.get('/:adminId', async (req, res) => {
    try {
        const projects = await Project.find({ userId: req.params.adminId }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Public: Get a single project by project ID
// router.get('/single/:id', async (req, res) => {
//     try {
//         const project = await Project.findById(req.params.id);
//         if (!project) return res.status(404).json({ message: 'Project not found' });
//         res.json(project);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// POST create a new project (admin only)
router.post('/', authenticate, authorizeAdmin, validateBody(projectSchema), async (req, res, next) => {
    try {
        const project = new Project({ ...req.body, userId: req.user.id });
        const newProject = await project.save();
        res.status(201).json(newProject);
    } catch (err) {
        next(err);
    }
});

// PUT update a project (owner admin or superadmin only)
router.put('/:id', authenticate, authorizeUserOrAdmin, validateBody(projectSchema), async (req, res, next) => {
    try {
        let filter = { _id: req.params.id };
        if (req.user.role !== 'superadmin') {
            filter.userId = req.user.id;
        }
        const updatedProject = await Project.findOneAndUpdate(filter, req.body, { new: true, runValidators: true });
        if (!updatedProject) return res.status(404).json({ message: 'Project not found' });
        res.json(updatedProject);
    } catch (err) {
        next(err);
    }
});

// DELETE a project (owner admin or superadmin only)
router.delete('/:id', authenticate, authorizeUserOrAdmin, async (req, res, next) => {
    try {
        let filter = { _id: req.params.id };
        if (req.user.role !== 'superadmin') {
            filter.userId = req.user.id;
        }
        const deletedProject = await Project.findOneAndDelete(filter);
        if (!deletedProject) return res.status(404).json({ message: 'Project not found' });
        res.json({ message: 'Project deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;