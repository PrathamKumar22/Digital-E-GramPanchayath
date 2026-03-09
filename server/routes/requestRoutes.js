const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { 
    createRequest, 
    getUserRequests, 
    getAllRequests,
    updateRequestStatus,
    getRequestById,
    downloadCertificate
} = require('../controllers/requestController');
const { protect, admin } = require('../middleware/authMiddleware');

// Multer Configuration for Certificates
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/certificates/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const safeFileName = file.originalname.replace(/\s+/g, '_');
        cb(null, `cert-${Date.now()}-${safeFileName}`);
    }
});

// UPDATED: Added limits here to prevent PayloadTooLargeError
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// --- User Routes ---
router.post('/apply', protect, createRequest);
router.get('/my-requests', protect, getUserRequests);
router.get('/download/:id', protect, downloadCertificate); 

// --- Admin Routes ---
router.get('/all', protect, admin, getAllRequests);
router.get('/:id', protect, admin, getRequestById); 

// Handles the file upload and status update
router.put('/:id/status', protect, admin, upload.single('certificate'), updateRequestStatus);

module.exports = router;