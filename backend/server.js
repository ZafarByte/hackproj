const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const User = require('./models/User');
const Alumni = require('./models/Alumni'); // Import the Alumni model

const app = express();
const secret = 'yellow_taxi';
const saltRounds = 10;

app.use(cors({
    origin: 'http://127.0.0.1:5500', // Ensure this matches your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Connect to MongoDB
mongoose.connect('mongodb+srv://zafargayas3101:zafar3101@cluster0.6sigmjk.mongodb.net/Alumni', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up multer storage for profile picture uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    }
});

const upload = multer({ storage });

// Register route for users
app.post('/api/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Alumni registration route
app.post('/api/alumni/register',  async (req, res) => {
    const { firstName, lastName, email, phone, dob, gender, password, gradYear, degree, department, rollNumber, jobTitle, company, industry, experience, linkedin, city, state, country, interests, activities, bio } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newAlumni = new Alumni({
            firstName,
            lastName,
            email,
            phone,
            dob,
            gender,
            password: hashedPassword,
            gradYear,
            degree,
            department,
            rollNumber,
            jobTitle,
            company,
            industry,
            experience,
            linkedin,
            city,
            state,
            country,
            interests,
            activities,
            bio,
        });

        await newAlumni.save();
        res.status(201).json({ message: 'Alumni registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
//alumni login route
app.post('/api/alumni/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const alumni = await Alumni.findOne({ email });  // Change to use the Alumni model

        if (!alumni || !(await bcrypt.compare(password, alumni.password))) {  // Use the alumni object
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: alumni._id, role: 'alumni' }, secret, { expiresIn: '1h' });  // Adjust the token payload
        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
//adminlogin route
app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;

    // Check if the credentials match the hardcoded admin credentials
    if (email === 'admin@mail' && password === 'admin') {
        res.json({ message: 'Login successful', redirectUrl: 'adminView.html' });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
