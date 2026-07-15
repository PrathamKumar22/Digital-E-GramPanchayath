const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); 
const path = require('path');
const fs = require('fs'); // Added fs to check for folders
require('dotenv').config();

// Import necessary logic
const { updateProfile } = require('./controllers/authController');
const { protect } = require('./middleware/authMiddleware');

const app = express();

// 1. Connect to Database
connectDB();

// 2. Middleware Configuration
const cors = require("cors");

app.use(cors({
  origin: "https://digital-e-grampanchayath.vercel.app"
}));

/**
 * IMPORTANT: These body-parser limits MUST be defined BEFORE your routes.
 * This allows the server to accept the large Base64 strings from your attachments.
 */
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// NEW: Create the uploads/certificates directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads', 'certificates');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("📁 Uploads directory created");
}

// Serve the uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. API Routes
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notices', require('./routes/notice')); 

app.put('/api/users/profile/update', protect, updateProfile);

app.get('/', (req, res) => {
    res.send('Digital Gram Panchayat API is live...');
});

/**
 * 4. Error Handling Middleware
 */
app.use((err, req, res, next) => {
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ 
            message: "The uploaded files are too large. Please reduce image size." 
        });
    }
    next(err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Ready to receive large file uploads (50MB limit)`);
});