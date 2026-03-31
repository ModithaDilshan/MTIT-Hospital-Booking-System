const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  patientName: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentType: { type: String, enum: ['Cash', 'Card', 'Insurance'], required: true },
  status: { type: String, enum: ['Unpaid', 'Paid', 'Refunded'], default: 'Unpaid' },
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);
