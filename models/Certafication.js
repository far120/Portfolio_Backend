const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    issuingOrganization: {
        type: String,
        required: true,
        trim: true
    },
    discription: {
        type: String,
        trim: true
    },
    credentialUrl: {
        type: String,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Certification', CertificationSchema);