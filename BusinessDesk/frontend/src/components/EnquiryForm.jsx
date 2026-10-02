import { useState } from 'react';
import { SOURCES, STATUSES, TEAM, toInputDate } from '../constants';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s\-()]{7,16}$/;
export const EMPTY = { clientName: '', contactPerson: '', email: '', phone: '', source: '', service: '', description: '', budget: '', status: 'New', assignedPerson: '', followUpDate: '', notes: '' };

function validate(v) {
  const e = {};
  if (!v.clientName.trim()) e.clientName = 'Client name is required.';
  if (!v.contactPerson.trim()) e.contactPerson = 'Contact person is required.';
  if (!v.source) e.source = 'Please choose an enquiry source.';
  if (!v.service.trim()) e.service = 'Service / requirement is required.';
  if (!v.status) e.status = 'Status is required.';
  if (v.email.trim() && !EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid email address.';
  if (v.phone.trim() && !PHONE_RE.test(v.phone.trim())) e.phone = 'Please enter a valid phone number.';
  if (v.budget !== '' && Number(v.budget) < 0) e.budget = 'Budget cannot be negative.';
  if (v.followUpDate && Number.isNaN(new Date(v.followUpDate).getTime())) e.followUpDate = 'Please enter a valid date.';
  return e;
}
export const toFormValues = (enq) => ({ ...Object.fromEntries(Object.keys(EMPTY).map(k => [k, enq[k] ?? ''])), followUpDate: toInputDate(enq.followUpDate) });

function Field({ k, label, wide, error, children }) {
  return (
    <div className={'field' + (wide ? ' wide' : '')}>
      <label htmlFor={k}>{label}</label>{children}
      {error && <div className="field-error">{error}</div>}
    </div>
  );
}

export default function EnquiryForm({ initial = EMPTY, submitLabel, savingLabel = 'Saving...', onSubmit, onCancel }) {
  const [v, setV] = useState(initial);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  const submit = async (ev) => {
    ev.preventDefault();
    const errs = validate(v);
    setErrors(errs); setFormError('');
    if (Object.keys(errs).length) return;
    setSaving(true);
    try { await onSubmit({ ...v, budget: v.budget === '' ? null : Number(v.budget), followUpDate: v.followUpDate || null }); }
    catch (err) { setErrors(err.fieldErrors || {}); setFormError(err.message); setSaving(false); }
  };
  const input = (k, props = {}) => <input id={k} value={v[k]} onChange={set(k)} className={errors[k] ? 'invalid' : ''} {...props} />;
  const select = (k, opts, blank) => (
    <select id={k} value={v[k]} onChange={set(k)} className={errors[k] ? 'invalid' : ''}>
      {blank && <option value="">{blank}</option>}{opts.map(o => <option key={o}>{o}</option>)}
    </select>
  );
  const F = (k, label, control, wide) => <Field k={k} label={label} wide={wide} error={errors[k]}>{control}</Field>;

  return (
    <form className="card form" onSubmit={submit} noValidate>
      {formError && <div className="alert error">{formError}</div>}
      <div className="grid-2">
        {F('clientName', 'Client / Company Name *', input('clientName'))}
        {F('contactPerson', 'Contact Person *', input('contactPerson'))}
        {F('email', 'Email', input('email', { type: 'email' }))}
        {F('phone', 'Phone', input('phone', { type: 'tel', placeholder: '+91 98765 43210' }))}
        {F('source', 'Enquiry Source *', select('source', SOURCES, 'Select source'))}
        {F('service', 'Service / Requirement *', input('service'))}
        {F('budget', 'Estimated Budget (₹)', input('budget', { type: 'number', min: 0 }))}
        {F('status', 'Status *', select('status', STATUSES))}
        {F('assignedPerson', 'Assigned Person', select('assignedPerson', TEAM, 'Unassigned'))}
        {F('followUpDate', 'Next Follow-up Date', input('followUpDate', { type: 'date' }))}
        {F('description', 'Requirement Description', <textarea id="description" rows="3" value={v.description} onChange={set('description')} />, true)}
        {F('notes', 'Additional Notes', <textarea id="notes" rows="3" value={v.notes} onChange={set('notes')} />, true)}
      </div>
      <div className="form-actions">
        {onCancel && <button type="button" className="btn ghost" onClick={onCancel} disabled={saving}>Cancel</button>}
        <button type="submit" className="btn primary" disabled={saving}>{saving ? savingLabel : submitLabel}</button>
      </div>
    </form>
  );
}
