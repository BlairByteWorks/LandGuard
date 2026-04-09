const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Buyer', 'Seller', 'Registrar'], required: true },
    
    searchHistory: { type: [String], default: [] },
    
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
}, { timestamps: true });

UserSchema.post('init', function(doc) {
    if (!doc.searchHistory) {
        doc.searchHistory = [];
    }
})

module.exports = mongoose.model('User', UserSchema);