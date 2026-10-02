import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { getStats } from '../services/api';
import { fmtDate } from '../constants';
function Bars({ data }) {
  const max = Math.max(1, ...Object.values(data));
  return (
    <div className="bars">
      {Object.entries(data).map(([k, n]) => (
        <div className="bar-row" key={k}>
          <span className="bar-label">{k}</span>
          <div className="bar-track"><div className="bar-fill" style={{ width: `${(n / max) * 100}%` }} /></div>
          <span className="bar-n">{n}</span>
        </div>
      ))}
    </div>
  );
}
export default function Dashboard() {
  const [s, setS] = useState(null);
  const [error, setError] = useState('');
  const load = () => { setError(''); setS(null); getStats().then(setS).catch(e => setError(e.message)); };
  useEffect(() => { load(); }, []);
  if (error) return <div className="state"><p>{error}</p><button className="btn" onClick={load}>Try again</button></div>;
  if (!s) return <div className="state"><div className="spinner" />Loading dashboard...</div>;
  const t = s.totals;
  return (
    <>
      <div className="page-head"><h1>Dashboard</h1><Link to="/enquiries/new" className="btn primary">+ New Enquiry</Link></div>
      <div className="stat-grid">
        <StatCard label="Total Enquiries" value={t.total} />
        <StatCard label="New Enquiries" value={t.new} />
        <StatCard label="Active Enquiries" value={t.active} />
        <StatCard label="Won Enquiries" value={t.won} tone="good" />
        <StatCard label="Lost Enquiries" value={t.lost} />
        <StatCard label="Follow-ups Due" value={t.followUpsDue} tone={t.followUpsDue ? 'warn' : ''} />
      </div>
      <div className="card"><h2>Needs attention</h2>
        {s.followUps.length === 0 ? <p className="muted">No follow-ups are due. You're up to date.</p> : (
          <ul className="due-list">
            {s.followUps.map(e => (
              <li key={e._id}><Link to={`/enquiries/${e._id}`} className="strong">{e.clientName}</Link>
                <span className="muted">{e.service}</span><StatusBadge status={e.status} /><span className="overdue">Due {fmtDate(e.followUpDate)}</span></li>
            ))}
          </ul>)}
      </div>
      <div className="grid-2 charts">
        <div className="card"><h2>Enquiries by status</h2><Bars data={s.byStatus} /></div>
        <div className="card"><h2>Enquiries by source</h2><Bars data={s.bySource} /></div>
      </div>
    </>
  );
}
