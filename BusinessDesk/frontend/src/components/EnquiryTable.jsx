import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { money, fmtDate, isOverdue } from '../constants';
export default function EnquiryTable({ rows, onDelete }) {
  return (
    <div className="card table-wrap">
      <table>
        <thead><tr>{['Client','Contact Person','Service','Source','Budget','Status','Assigned To','Follow-up','Actions'].map(h => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map(e => (
            <tr key={e._id}>
              <td data-label="Client"><Link to={`/enquiries/${e._id}`} className="strong">{e.clientName}</Link></td>
              <td data-label="Contact">{e.contactPerson}</td>
              <td data-label="Service">{e.service}</td>
              <td data-label="Source">{e.source}</td>
              <td data-label="Budget">{money(e.budget)}</td>
              <td data-label="Status"><StatusBadge status={e.status} /></td>
              <td data-label="Assigned">{e.assignedPerson || '—'}</td>
              <td data-label="Follow-up" className={isOverdue(e) ? 'overdue' : ''}>{fmtDate(e.followUpDate)}</td>
              <td data-label="Actions" className="actions">
                <Link to={`/enquiries/${e._id}`}>View</Link>
                <Link to={`/enquiries/${e._id}?edit=1`}>Edit</Link>
                <button className="link danger" onClick={() => onDelete(e)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
