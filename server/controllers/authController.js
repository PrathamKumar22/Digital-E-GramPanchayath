const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register user
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, village } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await User.create({
            name, email, password: hashedPassword, 
            phone: phone || "", 
            village: village || "", 
            role: 'citizen',
            profilePic: "" // Initialized empty
        });
        res.status(201).json({ success: true, msg: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        res.json({
            token,
            user: {
                id: user._id, 
                name: user.name, 
                email: user.email,
                role: user.role, 
                village: user.village || "", 
                phone: user.phone || "",
                profilePic: user.profilePic || "" // Persistence check
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Update profile
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.name = req.body.name || user.name;
        user.village = req.body.village !== undefined ? req.body.village : user.village;
        user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
        
        // --- UPDATED: Logic to save the photo string to DB ---
        if (req.body.profilePic !== undefined) {
            user.profilePic = req.body.profilePic;
        }

        const updatedUser = await user.save(); 
        res.json({
            success: true,
            user: {
                id: updatedUser._id, 
                name: updatedUser.name, 
                email: updatedUser.email,
                role: updatedUser.role, 
                village: updatedUser.village, 
                phone: updatedUser.phone,
                profilePic: updatedUser.profilePic 
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};