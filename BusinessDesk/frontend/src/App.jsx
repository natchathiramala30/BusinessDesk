import { Link, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Enquiries from './pages/Enquiries';
import AddEnquiry from './pages/AddEnquiry';
import EnquiryDetails from './pages/EnquiryDetails';
export default function App() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/enquiries" element={<Enquiries />} />
          <Route path="/enquiries/new" element={<AddEnquiry />} />
          <Route path="/enquiries/:id" element={<EnquiryDetails />} />
          <Route path="*" element={<div className="state"><h3>Page not found</h3><Link to="/" className="btn">Go to dashboard</Link></div>} />
        </Routes>
      </main>
    </div>
  );
}
