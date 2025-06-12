const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
    degree: { type: String, required: true, trim: true },
    institution: { type: String, required: true, trim: true },
    field: { type: String, required: true, trim: true },
    startYear: { type: Number, required: true },
    endYear: { type: Number },
    grade: { type: String },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Education', EducationSchema);
