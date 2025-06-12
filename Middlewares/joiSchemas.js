// Central Joi schemas for all portfolio API sections
const Joi = require('joi');

const aboutMeSchema = Joi.object({
    name: Joi.string().required(),
    tracks: Joi.string().required(),
    phone: Joi.string().required(),
    bio: Joi.string().required(),
    profession: Joi.string().required(),
    yearsOfExperience: Joi.number().min(0).required(),
    skills: Joi.array().items(Joi.string()),
    contactEmail: Joi.string().email().required(),
    location: Joi.string().required(),
    dateOfBirth: Joi.date().required(),
    socialLinks: Joi.object({
        github: Joi.string().uri().optional().allow(''),
        linkedin: Joi.string().uri().optional().allow(''),
        twitter: Joi.string().uri().optional().allow('')
    }),
    profileImage: Joi.string().uri().optional().allow('')
});

const projectSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    technologies: Joi.array().items(Joi.string()).required(),
    liveUrl: Joi.string().uri().optional().allow(''),
    githubUrl: Joi.string().uri().optional().allow(''),
});

const workSchema = Joi.object({
    position: Joi.string().required(),
    company: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().optional().allow(''),
    startDate: Joi.date().required(),
    endDate: Joi.date().optional().allow(null)
});

const educationSchema = Joi.object({
    degree: Joi.string().required(),
    institution: Joi.string().required(),
    field: Joi.string().required(),
    startYear: Joi.number().required(),
    endYear: Joi.number().optional().allow(null),
    grade: Joi.string().optional().allow(''),
    description: Joi.string().optional().allow('')
});

const certSchema = Joi.object({
    name: Joi.string().required(),
    issuingOrganization: Joi.string().required(),
    discription: Joi.string().optional().allow(''),
    credentialUrl: Joi.string().uri().optional().allow('')
});

const skillSchema = Joi.object({
    name: Joi.string().required(),
    level: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert').optional()
});

const contactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    message: Joi.string().required()
});

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports = {
    aboutMeSchema,
    projectSchema,
    workSchema,
    educationSchema,
    certSchema,
    skillSchema,
    contactSchema,
    registerSchema,
    loginSchema
};
