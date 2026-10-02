import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import EnquiryForm, { toFormValues } from '../components/EnquiryForm';
import StatusBadge from '../components/StatusBadge';
import { getEnquiry, updateEnquiry, deleteEnquiry } from '../services/api';
import { useToast } from '../components/Toast';
import { money, fmtDate } from '../constants';
const Row = ({ label, children }) => <div className="detail-row"><dt>{label}</dt><dd>{children || '—'}</dd></div>;
const fmtDateTime = (d) => new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
export default function EnquiryDetails() {
  const { id } = useParams(); const nav = useNavigate(); const notify = useToast();
  const [params, setParams] = useSearchParams();
  const editing = params.get('edit') === '1';
  const [enq, setEnq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    setLoading(true);
    getEnquiry(id).then(setEnq).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [id]);
  const save = async (body) => { setEnq(await updateEnquiry(id, body)); notify('Enquiry updated successfully'); setParams({}); };
  const remove = async () => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    try { await deleteEnquiry(id); notify('Enquiry deleted successfully'); nav('/enquiries'); } catch (e) { notify(e.message, 'error'); }
  };
  if (loading) return <div className="state"><div className="spinner" />Loading enquiry...</div>;
  if (error) return <div className="state"><p>{error}</p><Link to="/enquiries" className="btn">Back to enquiries</Link></div>;
  return (
    <>
      <div className="page-head">
        <div><Link to="/enquiries" className="muted">← Enquiries</Link><h1>{enq.clientName}</h1></div>
        {!editing && <div className="head-actions"><button className="btn" onClick={() => setParams({ edit: '1' })}>Edit</button><button className="btn danger-outline" onClick={remove}>Delete</button></div>}
      </div>
      {editing
        ? <EnquiryForm initial={toFormValues(enq)} submitLabel="Save Changes" savingLabel="Saving changes..." onSubmit={save} onCancel={() => setParams({})} />
        : (
          <div className="card detail">
            <div className="detail-top"><StatusBadge status={enq.status} /><span className="muted">Assigned to {enq.assignedPerson || 'nobody yet'}</span></div>
            <dl className="grid-2">
              <Row label="Contact person">{enq.contactPerson}</Row>
              <Row label="Email">{enq.email}</Row>
              <Row label="Phone">{enq.phone}</Row>
              <Row label="Source">{enq.source}</Row>
              <Row label="Service / requirement">{enq.service}</Row>
              <Row label="Estimated budget">{enq.budget != null ? money(enq.budget) : ''}</Row>
              <Row label="Next follow-up">{enq.followUpDate ? fmtDate(enq.followUpDate) : ''}</Row>
              <Row label="Created">{fmtDateTime(enq.createdAt)}</Row>
              <Row label="Last updated">{fmtDateTime(enq.updatedAt)}</Row>
            </dl>
            <h3>Requirement description</h3><p className="prewrap">{enq.description || '—'}</p>
            <h3>Notes</h3><p className="prewrap">{enq.notes || '—'}</p>
          </div>
        )}
    </>
  );
}
