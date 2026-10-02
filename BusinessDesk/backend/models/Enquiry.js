const mongoose = require('mongoose');
const SOURCES = ['WhatsApp', 'Instagram', 'Email', 'Website', 'Referral', 'Direct', 'Other'];
const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];
const enquirySchema = new mongoose.Schema({
  clientName: { type: String, required: true, trim: true },
  contactPerson: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  source: { type: String, required: true, enum: SOURCES },
  service: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  budget: { type: Number, min: 0 },
  status: { type: String, required: true, enum: STATUSES, default: 'New' },
  assignedPerson: { type: String, trim: true },
  followUpDate: { type: Date },
  notes: { type: String, trim: true },
}, { timestamps: true });
module.exports = mongoose.model('Enquiry', enquirySchema);
module.exports.SOURCES = SOURCES;
module.exports.STATUSES = STATUSES;
