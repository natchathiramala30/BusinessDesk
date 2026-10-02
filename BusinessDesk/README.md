# BusinessDesk

## 1. Project Name
BusinessDesk – Business Enquiry & Client Management System

## 2. Candidate Name
[Candidate Name]

## 3. Selected Track
Track A – Full Stack

## 4. Project Overview
BusinessDesk is an internal tool for capturing business enquiries, assigning them to team members, scheduling follow-ups, tracking each enquiry through a sales pipeline and monitoring it on a dashboard.

## 5. Problem Understanding
Enquiries arrive via WhatsApp, Instagram, email, the website and referrals. When they live in chats and spreadsheets, leads are forgotten and follow-ups missed. BusinessDesk keeps them in one place with a status, an owner and a follow-up date, and surfaces due follow-ups on the dashboard.

## 6. Features Implemented
- Enquiry CRUD (create, list, view, edit, delete) via a REST API backed by MongoDB
- Frontend and backend validation (required fields, email, phone, non-negative budget, valid date)
- Server-side search (client, contact, email, service) and combinable filters (status, source, assigned person)
- Status lifecycle with colour-coded badges
- Dashboard with totals, follow-ups due, "needs attention" list and bar summaries by status and source (all from MongoDB)
- Loading, empty, error and toast states; delete confirmation modal
- Responsive layout (sidebar on desktop, top nav on tablet/mobile, cards instead of a table on small phones)
- Seed script with 10 sample enquiries

## 7. Technology Stack
- Frontend: React 18, Vite, React Router, Axios, CSS
- Backend: Node.js, Express
- Database: MongoDB, Mongoose
- Deployment (planned): Vercel, Render, MongoDB Atlas

## 8. Architecture / Project Structure
React pages/components → `services/api.js` (Axios) → Express routes → controllers (validation + logic) → Mongoose model → MongoDB.
```
backend/  config/ controllers/ middleware/ models/ routes/ seed.js server.js
frontend/ src/components  src/pages  src/services  src/constants.js
```

## 9. Setup Instructions
```bash
git clone <repo-url> && cd BusinessDesk
npm run install:all
cp backend/.env.example backend/.env      # edit MONGODB_URI
cp frontend/.env.example frontend/.env
npm run seed                              # optional sample data
npm run dev:backend                       # http://localhost:5000
npm run dev:frontend                      # http://localhost:5173 (second terminal)
```
MongoDB: create a free Atlas cluster, add a database user, allow your IP under Network Access, and paste the connection string into `MONGODB_URI` (or use local `mongodb://127.0.0.1:27017/businessdesk`).

## 10. Environment Variables
| File | Variable | Purpose |
|---|---|---|
| backend/.env | PORT | API port (default 5000) |
| backend/.env | MONGODB_URI | MongoDB connection string |
| backend/.env | CLIENT_URL | Allowed frontend origin(s) for CORS, comma-separated |
| frontend/.env | VITE_API_URL | API base URL, e.g. http://localhost:5000/api |

## 11. Demo / Hosted URL
Not deployed yet. Frontend: _TBD_ · Backend: _TBD_

## 12. Test Credentials
Not applicable – authentication is not implemented.

## 13. AI Usage Declaration
AI tools were used during development for code assistance, debugging, UI suggestions and documentation. All AI-assisted output was reviewed, tested and modified by the candidate.

## 14. Known Limitations
- No authentication or roles
- Team list is fixed in `frontend/src/constants.js`
- No pagination
- No automated tests

## 15. Future Improvements
Authentication and roles, pagination, CSV export, activity timeline, automated tests, managed team members.

## API
| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/enquiries | Create |
| GET | /api/enquiries?search=&status=&source=&assignedPerson= | List / search / filter |
| GET | /api/enquiries/:id | Get one |
| PUT | /api/enquiries/:id | Update |
| DELETE | /api/enquiries/:id | Delete |
| GET | /api/dashboard/stats | Dashboard statistics |

## Deployment
**Backend (Render):** root `backend`, build `npm install`, start `npm start`; set `MONGODB_URI` and `CLIENT_URL` (your Vercel URL).
**Frontend (Vercel):** root `frontend`, Vite preset; set `VITE_API_URL=https://<render-app>.onrender.com/api`.
