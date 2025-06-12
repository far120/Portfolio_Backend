const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'], default: 'intermediate' },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Skill', SkillSchema);
