export const SOURCES = ['WhatsApp', 'Instagram', 'Email', 'Website', 'Referral', 'Direct', 'Other'];
export const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];
export const TEAM = ['Admin', 'Priya', 'Rahul', 'Meena', 'Arjun'];
export const money = (n) => (n || n === 0 ? '₹' + Number(n).toLocaleString('en-IN') : '—');
export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');
export const toInputDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');
export const isOverdue = (e) => e.followUpDate && !['Won', 'Lost'].includes(e.status) && new Date(e.followUpDate) <= new Date(new Date().setHours(23, 59, 59, 999));
