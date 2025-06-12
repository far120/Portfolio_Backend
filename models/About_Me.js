const mongoose = require('mongoose');

const AboutMeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    tracks: {
        type: String,
        required: true,
        trim: true
    },
   phone: {
        type: String,
        required: true,
        trim: true
    },
    bio: {
        type: String,
        required: true,
        trim: true
    },
    profession: {
        type: String,
        required: true,
        trim: true
    },
    yearsOfExperience: {
        type: Number,
        required: true,
        min: 0
    },
    skills: [{
        type: String,
        trim: true
    }],
    contactEmail: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    socialLinks: {
        github: {
            type: String,
            trim: true
        },
        linkedin: {
            type: String,
            trim: true
        },
        twitter: {
            type: String,
            trim: true
        }
    },
    profileImage: {
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

module.exports = mongoose.model('AboutMe', AboutMeSchema);