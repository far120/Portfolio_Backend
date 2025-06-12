const express = require('express');
const Contact = require('../models/Contact');
const { contactSchema } = require('../Middlewares/joiSchemas');
const { authenticate, authorizeSuperAdmin } = require('../Middlewares/auth');
const { validateBody } = require('../Middlewares/validate');

const router = express.Router();

// Public: Send a message
router.post('/:adminID', validateBody(contactSchema), async (req, res, next) => {
    try {
        const { adminID } = req.params;
        const contact = new Contact({ ...req.body, userId: adminID });
        await contact.save();
        res.status(201).json({ message: 'Message sent', contact });
    } catch (err) {
        next(err);
    }
});

// Superadmin: Get all messages
router.get('/', authenticate, authorizeSuperAdmin, async (req, res, next) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        next(err);
    }
});

// Public: Get messages for a specific admin
router.get('/:adminId', async (req, res, next) => {
    try {
        const messages = await Contact.find({ userId: req.params.adminId }).sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        next(err);
    }
});

// Admin: Delete a message
router.delete('/:id', authenticate, authorizeSuperAdmin, async (req, res, next) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) return res.status(404).json({ error: 'Message not found' });
        res.json({ message: 'Message deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
