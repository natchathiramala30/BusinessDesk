const mongoose = require('mongoose');
const Enquiry = require('../models/Enquiry');
const { SOURCES, STATUSES } = Enquiry;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s\-()]{7,16}$/;
const FIELDS = ['clientName','contactPerson','email','phone','source','service','description','budget','status','assignedPerson','followUpDate','notes'];

// Returns { errors, data } – data contains only whitelisted, cleaned fields
function validate(body) {
  const errors = {}; const data = {};
  FIELDS.forEach(f => { if (body[f] !== undefined) data[f] = typeof body[f] === 'string' ? body[f].trim() : body[f]; });
  if (!data.clientName) errors.clientName = 'Client name is required.';
  if (!data.contactPerson) errors.contactPerson = 'Contact person is required.';
  if (!data.service) errors.service = 'Service / requirement is required.';
  if (!data.source) errors.source = 'Enquiry source is required.';
  else if (!SOURCES.includes(data.source)) errors.source = 'Please choose a valid source.';
  if (!data.status) errors.status = 'Status is required.';
  else if (!STATUSES.includes(data.status)) errors.status = 'Please choose a valid status.';
  if (data.email && !EMAIL_RE.test(data.email)) errors.email = 'Please enter a valid email address.';
  if (data.phone && !PHONE_RE.test(data.phone)) errors.phone = 'Please enter a valid phone number.';
  if (data.budget === '' || data.budget === null) data.budget = undefined;
  if (data.budget !== undefined) {
    const n = Number(data.budget);
    if (Number.isNaN(n)) errors.budget = 'Budget must be a number.';
    else if (n < 0) errors.budget = 'Budget cannot be negative.';
    else data.budget = n;
  }
  if (data.followUpDate === '' || data.followUpDate === null) data.followUpDate = null;
  else if (data.followUpDate !== undefined && Number.isNaN(new Date(data.followUpDate).getTime()))
    errors.followUpDate = 'Please enter a valid follow-up date.';
  return { errors, data };
}
const badId = (id) => !mongoose.Types.ObjectId.isValid(id);
const fail = (res, code, message, errors) => res.status(code).json({ success: false, message, ...(errors && { errors }) });
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

exports.validate = validate;
exports.createEnquiry = async (req, res, next) => {
  try {
    const { errors, data } = validate(req.body);
    if (Object.keys(errors).length) return fail(res, 400, Object.values(errors)[0], errors);
    const enquiry = await Enquiry.create(data);
    res.status(201).json({ success: true, message: 'Enquiry created successfully', data: enquiry });
  } catch (e) { next(e); }
};
exports.getEnquiries = async (req, res, next) => {
  try {
    const { search, status, source, assignedPerson } = req.query;
    const q = {};
    if (status) q.status = status;
    if (source) q.source = source;
    if (assignedPerson) q.assignedPerson = assignedPerson;
    if (search && search.trim()) {
      const rx = new RegExp(escapeRegex(search.trim()), 'i');
      q.$or = [{ clientName: rx }, { contactPerson: rx }, { email: rx }, { service: rx }];
    }
    const data = await Enquiry.find(q).sort({ createdAt: -1 });
    res.json({ success: true, message: 'Enquiries fetched successfully', count: data.length, data });
  } catch (e) { next(e); }
};
exports.getEnquiry = async (req, res, next) => {
  try {
    if (badId(req.params.id)) return fail(res, 400, 'Invalid enquiry ID.');
    const data = await Enquiry.findById(req.params.id);
    if (!data) return fail(res, 404, 'Enquiry not found');
    res.json({ success: true, message: 'Enquiry fetched successfully', data });
  } catch (e) { next(e); }
};
exports.updateEnquiry = async (req, res, next) => {
  try {
    if (badId(req.params.id)) return fail(res, 400, 'Invalid enquiry ID.');
    const { errors, data } = validate(req.body);
    if (Object.keys(errors).length) return fail(res, 400, Object.values(errors)[0], errors);
    const updated = await Enquiry.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!updated) return fail(res, 404, 'Enquiry not found');
    res.json({ success: true, message: 'Enquiry updated successfully', data: updated });
  } catch (e) { next(e); }
};
exports.deleteEnquiry = async (req, res, next) => {
  try {
    if (badId(req.params.id)) return fail(res, 400, 'Invalid enquiry ID.');
    const deleted = await Enquiry.findByIdAndDelete(req.params.id);
    if (!deleted) return fail(res, 404, 'Enquiry not found');
    res.json({ success: true, message: 'Enquiry deleted successfully', data: {} });
  } catch (e) { next(e); }
};
