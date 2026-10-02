import { useNavigate } from 'react-router-dom';
import EnquiryForm from '../components/EnquiryForm';
import { createEnquiry } from '../services/api';
import { useToast } from '../components/Toast';
export default function AddEnquiry() {
  const nav = useNavigate(); const notify = useToast();
  const submit = async (body) => { await createEnquiry(body); notify('Enquiry created successfully'); nav('/enquiries'); };
  return (
    <>
      <div className="page-head"><h1>Create New Enquiry</h1></div>
      <EnquiryForm submitLabel="Create Enquiry" savingLabel="Creating..." onSubmit={submit} onCancel={() => nav('/enquiries')} />
    </>
  );
}
