const CLS = { 'New': 'neutral', 'Contacted': 'info', 'Qualified': 'accent', 'Proposal Sent': 'accent', 'Negotiation': 'accent', 'Won': 'success', 'Lost': 'muted' };
export default function StatusBadge({ status }) { return <span className={`badge ${CLS[status] || 'neutral'}`}>{status}</span>; }
