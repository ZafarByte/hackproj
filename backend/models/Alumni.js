const mongoose = require('mongoose');


const AlumniSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    phone: String,
    dob: Date,
    gender: String,
    password: String,
    gradYear: Number,
    degree: String,
    department: String,
    rollNumber: String,
    jobTitle: String,
    company: String,
    industry: String,
    experience: Number,
    linkedin: String,
    city: String,
    state: String,
    country: String,
    interests: String,
    activities: String,
    bio: String,
    //profilePicture: String, // Store file path or URL
});

module.exports = mongoose.model('Alumni', AlumniSchema);
