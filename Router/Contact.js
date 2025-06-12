const express = require('express');
const Contact = require('../models/Contact');
const { contactSchema } = require('../Middlewares/joiSchemas');
const { authenticate, authorizeAdmin } = require('../Middlewares/auth');
const { validateBody } = require('../Middlewares/validate');

const router = express.Router();

// Public: Send a message
router.post('/', validateBody(contactSchema), async (req, res, next) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(201).json({ message: 'Message sent', contact });
    } catch (err) {
        next(err);
    }
});

// Admin: Get all messages
router.get('/', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        next(err);
    }
});

// Admin: Delete a message
router.delete('/:id', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) return res.status(404).json({ error: 'Message not found' });
        res.json({ message: 'Message deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
