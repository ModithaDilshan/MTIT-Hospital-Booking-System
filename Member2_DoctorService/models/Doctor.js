const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  experienceYears: { type: Number, required: true },
  consultationFee: { type: Number, required: true },
  availability: { type: String, enum: ['Available', 'On Leave', 'In Surgery'], default: 'Available' },
  imageUrl: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png' }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
