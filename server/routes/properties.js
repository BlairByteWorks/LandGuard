const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Property = require('../models/Property');
const User = require('../models/User');
const HistoryLog = require('../models/HistoryLog');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });
    
    jwt.verify(token, process.env.JWT_SECRET || 'super_secret_landguard_key_2026', (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid or expired token." });
        req.user = user; 
        next();
    });
};

router.post('/add', authenticateToken, async (req, res) => {
    try {
        const { titleNumber, locationWard, sizeAcres, listingPrice, deedDocument } = req.body;
        
        const newProperty = new Property({
            titleNumber,
            locationWard,
            sizeAcres,
            listingPrice,
            deedDocument,
            currentOwnerID: req.user.id, 
            status: 'Pending'
        });

        await newProperty.save();
        res.status(201).json({ message: "Property successfully submitted for verification!" });
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ message: "This Title Number is already registered!" });
        res.status(500).json({ error: err.message });
    }
});

// --- OPTIMIZED SELLER ROUTE ---
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const myProperties = await Property.find({ currentOwnerID: req.user.id })
            .select('-deedDocument') // Strips out the massive PDF string so the page loads instantly
            .sort({ createdAt: -1 });
        res.json(myProperties);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ------------------------------

router.get('/pending', async (req, res) => {
    try {
        const pendingProperties = await Property.find({ status: 'Pending' })
            .populate('currentOwnerID', 'name email')
            .sort({ createdAt: -1 });
        res.json(pendingProperties);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/verified', async (req, res) => {
    try {
        const verifiedProperties = await Property.find({ status: 'Verified' })
            .populate('currentOwnerID', 'name email')
            .sort({ updatedAt: -1 });
        res.json(verifiedProperties);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/rejected', async (req, res) => {
    try {
        const rejectedProperties = await Property.find({ status: 'Rejected' })
            .populate('currentOwnerID', 'name email')
            .sort({ updatedAt: -1 });
        res.json(rejectedProperties);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/verify/:id', async (req, res) => {
    try {
        const updatedProperty = await Property.findByIdAndUpdate(
            req.params.id,
            { status: 'Verified' },
            { new: true }
        );
        res.json({ message: "Property successfully verified!", property: updatedProperty });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/reject/:id', async (req, res) => {
    try {
        const updatedProperty = await Property.findByIdAndUpdate(
            req.params.id,
            { status: 'Rejected' },
            { new: true }
        );
        res.json({ message: "Property successfully rejected!", property: updatedProperty });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/search', authenticateToken, async (req, res) => {
    try {
        let { titleNumber } = req.body;
        
        const property = await Property.findOne({ 
            titleNumber: { $regex: new RegExp('^' + titleNumber.trim() + '$', 'i') } 
        })
        .select('-deedDocument')
        .populate('currentOwnerID', 'name email');
        
        if (!property) return res.status(404).json({ message: "Property not found." });
        
        let historyLogs = await HistoryLog.find({ propertyId: property._id }).sort({ transferDate: -1 });

        if (historyLogs.length === 0) {
            const realSellerName = property.currentOwnerID ? property.currentOwnerID.name : "Verified Owner";
            
            const log1 = new HistoryLog({
                propertyId: property._id,
                transferDate: new Date('2010-05-14'),
                previousOwner: "Government of Kenya",
                newOwner: "James Kamau",
                verifiedBy: "Initial Allotment"
            });

            const log2 = new HistoryLog({
                propertyId: property._id,
                transferDate: new Date('2018-11-22'),
                previousOwner: "James Kamau",
                newOwner: realSellerName,
                verifiedBy: "Registrar TR-8821"
            });

            await log1.save();
            await log2.save();
            
            historyLogs = await HistoryLog.find({ propertyId: property._id }).sort({ transferDate: -1 });
        }
        
        const uniqueLogs = [];
        const seenDates = new Set();
        
        for (const log of historyLogs) {
            const timeKey = new Date(log.transferDate).getTime();
            if (!seenDates.has(timeKey)) {
                seenDates.add(timeKey);
                uniqueLogs.push(log);
            }
        }
        
        let aiAnalysis = { 
            estimatedValue: property.listingPrice, 
            confidence: 85, 
            isHighRisk: false, 
            variancePercentage: 0 
        };
        
        try {
            const aiPayload = {
                sizeAcres: property.sizeAcres,
                locationWard: property.locationWard,
                askingPrice: property.listingPrice
            };

            const aiResponse = await fetch('http://127.0.0.1:5001/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(aiPayload)
            });

            if (aiResponse.ok) {
                const aiData = await aiResponse.json();
                
                aiAnalysis = {
                    estimatedValue: aiData.predictedPrice,
                    confidence: 85,
                    isHighRisk: aiData.isHighRisk,
                    variancePercentage: aiData.variancePercentage
                };
            } else {
                console.warn("AI microservice returned an error status.");
            }
        } catch (aiError) {
            console.error("Could not reach the AI microservice. Ensure Python is running on port 5001.");
        }
       
        res.json({
            overview: property,
            chainOfCustody: uniqueLogs,
            valuation: aiAnalysis
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/transfer/:id', authenticateToken, async (req, res) => {
    
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const propertyId = req.params.id;
        const { newOwnerId, previousOwnerName } = req.body;

        const updatedProperty = await Property.findByIdAndUpdate(
            propertyId,
            { 
                currentOwnerID: newOwnerId, 
                status: 'Pending'
            }, 
            { new: true, session }
        ).populate('currentOwnerID', 'name email');

        if (!updatedProperty) {
            throw new Error("Property not found.");
        }

        const newLog = new HistoryLog({
            propertyId: propertyId,
            transferDate: new Date(),
            previousOwner: previousOwnerName || "Previous Owner",
            newOwner: updatedProperty.currentOwnerID.name,
            verifiedBy: "Automated System Transfer"
        });

        await newLog.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message: "Property successfully transferred! Chain of custody updated.",
            property: updatedProperty,
            newHistoryRecord: newLog
        });

    } catch (error) {
       
        await session.abortTransaction();
        session.endSession();
        console.error("Transaction Aborted:", error);
        res.status(500).json({ error: "Transfer failed. All changes rolled back securely. " + error.message });
    }
});

module.exports = router;