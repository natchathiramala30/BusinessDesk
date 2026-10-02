import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', timeout: 15000 });
// Turn any failure into a readable error: { message, fieldErrors }
api.interceptors.response.use(r => r, (err) => {
  const res = err.response;
  const message = res?.data?.message || (err.request ? 'Cannot reach the server. Check your connection and try again.' : 'Something went wrong. Please try again.');
  return Promise.reject({ message, fieldErrors: res?.data?.errors || {}, status: res?.status });
});
export const getEnquiries = (params) => api.get('/enquiries', { params }).then(r => r.data.data);
export const getEnquiry = (id) => api.get(`/enquiries/${id}`).then(r => r.data.data);
export const createEnquiry = (body) => api.post('/enquiries', body).then(r => r.data.data);
export const updateEnquiry = (id, body) => api.put(`/enquiries/${id}`, body).then(r => r.data.data);
export const deleteEnquiry = (id) => api.delete(`/enquiries/${id}`).then(r => r.data);
export const getStats = () => api.get('/dashboard/stats').then(r => r.data.data);
