const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    titleNumber: { type: String, required: true, unique: true },
    locationWard: { type: String, required: true },
    sizeAcres: { type: Number, required: true },
    listingPrice: { type: Number, required: true },
    currentOwnerID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'Pending' },
    deedDocument: { type: String } 
}, { timestamps: true });

module.exports = mongoose.model('Property', PropertySchema);