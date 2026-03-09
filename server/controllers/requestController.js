const Request = require('../models/Request');
const path = require('path');
const fs = require('fs');

// @desc    Create a new service request
exports.createRequest = async (req, res) => {
    try {
        const { serviceType, data, attachments } = req.body;
        const newRequest = await Request.create({
            userId: req.user.id, 
            serviceType,
            data,
            attachments: attachments || []
        });
        res.status(201).json({
            success: true,
            message: "Application submitted successfully!",
            request: newRequest
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get all requests for the logged-in user
exports.getUserRequests = async (req, res) => {
    try {
        const requests = await Request.find({ userId: req.user.id })
            .select('-attachments')
            .sort({ createdAt: -1 });
        res.json({ success: true, requests }); 
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get ALL requests for Admin
exports.getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find({})
            .select('-attachments') 
            .populate('userId', 'name email') 
            .sort({ createdAt: -1 });
        res.json({ success: true, requests }); 
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Update Request Status & Upload Certificate (Admin Only)
exports.updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        let updateData = { status };

        // If admin is approving and uploaded a file
        if (req.file) {
            updateData.certificateUrl = req.file.path;
        }

        const request = await Request.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!request) return res.status(404).json({ success: false, message: "Request not found" });

        res.json({ success: true, request });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Download Issued Certificate
exports.downloadCertificate = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);

        if (!request || !request.certificateUrl) {
            return res.status(404).json({ success: false, message: "Certificate not found or not yet issued." });
        }

        const filePath = path.join(__dirname, '..', request.certificateUrl);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: "File does not exist on server." });
        }

        res.download(filePath, `${request.serviceType}_Certificate.pdf`);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get a SINGLE request by ID
exports.getRequestById = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id).populate('userId', 'name email');
        if (!request) return res.status(404).json({ success: false, error: "Request not found" });
        res.json({ success: true, request });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};