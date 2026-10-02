import { SOURCES, STATUSES, TEAM } from '../constants';
export default function SearchBar({ filters, onChange, onClear }) {
  const set = (k) => (e) => onChange({ ...filters, [k]: e.target.value });
  return (
    <div className="card filters">
      <input type="search" placeholder="Search enquiries..." value={filters.search} onChange={set('search')} aria-label="Search enquiries" />
      <select value={filters.status} onChange={set('status')} aria-label="Status"><option value="">All Statuses</option>{STATUSES.map(s => <option key={s}>{s}</option>)}</select>
      <select value={filters.source} onChange={set('source')} aria-label="Source"><option value="">All Sources</option>{SOURCES.map(s => <option key={s}>{s}</option>)}</select>
      <select value={filters.assignedPerson} onChange={set('assignedPerson')} aria-label="Assigned"><option value="">All Members</option>{TEAM.map(s => <option key={s}>{s}</option>)}</select>
      <button className="btn ghost" onClick={onClear}>Clear</button>
    </div>
  );
}
