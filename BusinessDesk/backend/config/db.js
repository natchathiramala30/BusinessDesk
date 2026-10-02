const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Enquiry = require('../models/Enquiry');

const day = (n) => { const d = new Date(); d.setDate(d.getDate() + n); d.setHours(0,0,0,0); return d; };
const sampleData = [
  { clientName: 'Nilgiri Organics', contactPerson: 'Kavitha Raman', email: 'kavitha@nilgiriorganics.in', phone: '+91 98400 11223', source: 'Website', service: 'E-commerce website', description: 'Online store for tea and spice range with COD and UPI payments.', budget: 180000, status: 'Qualified', assignedPerson: 'Priya', followUpDate: day(2), notes: 'Wants a demo of the checkout flow.' },
  { clientName: 'Coastline Logistics', contactPerson: 'Mohammed Faizal', email: 'faizal@coastlinelogistics.com', phone: '044 2345 6789', source: 'Referral', service: 'Shipment tracking portal', description: 'Customer portal with live shipment status.', budget: 450000, status: 'Proposal Sent', assignedPerson: 'Admin', followUpDate: day(-1), notes: 'Proposal sent on Monday; awaiting feedback.' },
  { clientName: 'Bloom Studio', contactPerson: 'Anjali Menon', email: 'anjali@bloomstudio.co', phone: '+91 99620 77881', source: 'Instagram', service: 'Brand website', description: 'Portfolio site for a floral design studio.', budget: 60000, status: 'New', assignedPerson: 'Meena', followUpDate: day(0) },
  { clientName: 'Sundaram Textiles', contactPerson: 'R. Sundaram', email: 'rs@sundaramtextiles.in', phone: '+91 94440 55667', source: 'WhatsApp', service: 'Inventory management system', description: 'Track stock across three showrooms.', budget: 320000, status: 'Negotiation', assignedPerson: 'Rahul', followUpDate: day(1), notes: 'Negotiating on the maintenance fee.' },
  { clientName: 'GreenLeaf Clinics', contactPerson: 'Dr. Sneha Iyer', email: 'sneha@greenleafclinics.com', phone: '+91 98410 99001', source: 'Email', service: 'Appointment booking app', description: 'Patient booking with SMS reminders.', budget: 275000, status: 'Contacted', assignedPerson: 'Priya', followUpDate: day(3), notes: 'Intro call done.' },
  { clientName: 'Orbit Fitness', contactPerson: 'Vikram Shah', email: 'vikram@orbitfit.in', phone: '+91 90030 12345', source: 'Direct', service: 'Membership management', description: 'Membership renewals and attendance.', budget: 150000, status: 'Won', assignedPerson: 'Admin', notes: 'Kick-off scheduled.' },
  { clientName: 'Tamarind Eats', contactPerson: 'Lakshmi Narayan', email: 'lakshmi@tamarindeats.com', phone: '+91 97890 44556', source: 'Instagram', service: 'Online ordering website', description: 'Menu and online ordering for a restaurant chain.', budget: 90000, status: 'Lost', assignedPerson: 'Meena', notes: 'Went with a lower-priced vendor.' },
  { clientName: 'Pinnacle Realty', contactPerson: 'Arun Kumar', email: 'arun@pinnaclerealty.in', phone: '+91 98945 33221', source: 'Website', service: 'Property listing portal', description: 'Listings with filters and lead capture.', budget: 520000, status: 'New', assignedPerson: 'Rahul', followUpDate: day(-3), notes: 'Came via contact form.' },
  { clientName: 'EduSpark Academy', contactPerson: 'Divya Prakash', email: 'divya@eduspark.org', phone: '+91 96770 88990', source: 'Referral', service: 'Student management system', description: 'Admissions, fees and attendance.', budget: 380000, status: 'Qualified', assignedPerson: 'Arjun', followUpDate: day(5) },
  { clientName: 'Harbor Cafe', contactPerson: "Joseph D'Souza", source: 'Other', service: 'Loyalty app', description: 'Stamp-card style loyalty programme.', budget: 70000, status: 'Contacted', assignedPerson: 'Arjun', followUpDate: day(4), notes: 'Met at a local business event.' },
];

async function seedIfEmpty() {
  const count = await Enquiry.countDocuments();
  if (count === 0) {
    await Enquiry.insertMany(sampleData);
    console.log(`Auto-seeded ${sampleData.length} sample enquiries into database.`);
  }
}

module.exports = async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (uri) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
      console.log(`MongoDB connected: ${uri}`);
      await seedIfEmpty();
      return;
    } catch (err) {
      console.warn(`Could not connect to configured MONGODB_URI (${err.message}). Starting in-memory MongoDB fallback...`);
    }
  }

  const mongod = await MongoMemoryServer.create();
  const mongoUri = mongod.getUri();
  await mongoose.connect(mongoUri);
  console.log(`In-memory MongoDB started and connected at ${mongoUri}`);
  await seedIfEmpty();
};

