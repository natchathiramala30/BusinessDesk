import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import EnquiryTable from '../components/EnquiryTable';
import { deleteEnquiry, getEnquiries } from '../services/api';
import { useToast } from '../components/Toast';
const NO_FILTERS = { search: '', status: '', source: '', assignedPerson: '' };
export default function Enquiries() {
  const notify = useToast();
  const [filters, setFilters] = useState(NO_FILTERS);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const hasFilters = Object.values(filters).some(Boolean);
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setRows(await getEnquiries(Object.fromEntries(Object.entries(filters).filter(([, v]) => v)))); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [filters]);
  // debounce so we don't hit the API on every keystroke
  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [load]);
  const confirmDelete = async () => {
    setDeleting(true);
    try { await deleteEnquiry(toDelete._id); setRows(r => r.filter(x => x._id !== toDelete._id)); notify('Enquiry deleted successfully'); setToDelete(null); }
    catch (e) { notify(e.message, 'error'); }
    finally { setDeleting(false); }
  };
  return (
    <>
      <div className="page-head"><h1>Enquiries</h1><Link to="/enquiries/new" className="btn primary">+ New Enquiry</Link></div>
      <SearchBar filters={filters} onChange={setFilters} onClear={() => setFilters(NO_FILTERS)} />
      {loading ? <div className="state"><div className="spinner" />Loading enquiries...</div>
        : error ? <div className="state"><p>{error}</p><button className="btn" onClick={load}>Try again</button></div>
        : rows.length === 0 ? (hasFilters
            ? <div className="state"><h3>No enquiries match your current search or filters.</h3><button className="btn" onClick={() => setFilters(NO_FILTERS)}>Clear Filters</button></div>
            : <div className="state"><h3>No enquiries found.</h3><p>Create your first enquiry to get started.</p><Link to="/enquiries/new" className="btn primary">+ Add Enquiry</Link></div>)
        : <EnquiryTable rows={rows} onDelete={setToDelete} />}
      {toDelete && (
        <div className="modal-bg" onClick={() => !deleting && setToDelete(null)}>
          <div className="modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
            <h3>Delete enquiry</h3>
            <p>Are you sure you want to delete this enquiry?</p>
            <p className="muted">{toDelete.clientName} – {toDelete.service}</p>
            <div className="form-actions">
              <button className="btn ghost" onClick={() => setToDelete(null)} disabled={deleting}>Cancel</button>
              <button className="btn danger-solid" onClick={confirmDelete} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
