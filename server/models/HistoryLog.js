const mongoose = require('mongoose');

const HistoryLogSchema = new mongoose.Schema({
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    transferDate: { type: Date, required: true },
    previousOwner: { type: String, required: true },
    newOwner: { type: String, required: true },
    verifiedBy: { type: String, default: 'System Auto-Generated' }
});

module.exports = mongoose.model('HistoryLog', HistoryLogSchema);