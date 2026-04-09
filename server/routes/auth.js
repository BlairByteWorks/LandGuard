const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Access Denied" });

    jwt.verify(token, process.env.JWT_SECRET || 'super_secret_landguard_key_2026', (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user;
        next();
    });
};

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!password || !passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, and a number." });
        }

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: "An account with this email already exists!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name: name || "New User",
            email: email,
            password: hashedPassword, 
            role: role
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "Account not found. Please register first." });
        }

        const dbPassword = user.password || user.passwordHash;

        if (!dbPassword) {
            return res.status(500).json({ message: "Database Error: No password field found for this user." });
        }

        let isMatch = false;
        if (dbPassword.startsWith('$2a$') || dbPassword.startsWith('$2b$')) {
            
            isMatch = await bcrypt.compare(password, dbPassword);
        } else {
            
            isMatch = (password === dbPassword);
        }

        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password!" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name }, 
            process.env.JWT_SECRET || 'super_secret_landguard_key_2026', 
            { expiresIn: '1d' }
        );

        res.json({ token, role: user.role, name: user.name, email: user.email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "No account found with that email address." });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; 
        await user.save();

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        console.log('\n======================================================');
        console.log('✉️ EMAIL SIMULATION SYSTEM (LandGuard)');
        console.log('======================================================');
        console.log(`TO: ${user.email}`);
        console.log(`SUBJECT: LandGuard Password Reset Request`);
        console.log(`MESSAGE: You are receiving this because you requested the reset of the password for your account.`);
        console.log(`\nPlease click on the following link, or paste this into your browser to complete the process:\n`);
        console.log(`👉  ${resetUrl}  👈\n`);
        console.log(`If you did not request this, please ignore this email and your password will remain unchanged.`);
        console.log('======================================================\n');

        res.status(200).json({ message: "Reset link sent to email!" });

    } catch (err) {
        console.error("❌ FORGOT PASSWORD ERROR:", err);
        res.status(500).json({ message: "Server error while processing request." });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Password reset link is invalid or has expired." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword; 
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: "Password successfully updated!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/history', authenticateToken, async (req, res) => {
    try {
        const { titleNumber } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.searchHistory = user.searchHistory.filter(title => title !== titleNumber);
        
        user.searchHistory.unshift(titleNumber);
        
        if (user.searchHistory.length > 5) user.searchHistory.pop();

        await user.save();
        res.json({ history: user.searchHistory });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/history', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ history: user.searchHistory });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;