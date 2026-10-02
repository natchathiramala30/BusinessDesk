const Enquiry = require('../models/Enquiry');
const { SOURCES, STATUSES } = Enquiry;
const ACTIVE = ['Contacted', 'Qualified', 'Proposal Sent', 'Negotiation'];
exports.getStats = async (req, res, next) => {
  try {
    const endOfToday = new Date(); endOfToday.setHours(23, 59, 59, 999);
    const [byStatus, bySource, dueList] = await Promise.all([
      Enquiry.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Enquiry.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }]),
      Enquiry.find({ followUpDate: { $lte: endOfToday }, status: { $nin: ['Won', 'Lost'] } }).sort({ followUpDate: 1 }),
    ]);
    const statusCounts = Object.fromEntries(STATUSES.map(s => [s, 0]));
    byStatus.forEach(r => { if (r._id in statusCounts) statusCounts[r._id] = r.count; });
    const sourceCounts = Object.fromEntries(SOURCES.map(s => [s, 0]));
    bySource.forEach(r => { if (r._id in sourceCounts) sourceCounts[r._id] = r.count; });
    const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);
    res.json({ success: true, message: 'Dashboard stats fetched successfully', data: {
      totals: { total, new: statusCounts['New'], won: statusCounts['Won'], lost: statusCounts['Lost'],
        active: ACTIVE.reduce((sum, s) => sum + statusCounts[s], 0), followUpsDue: dueList.length },
      byStatus: statusCounts, bySource: sourceCounts, followUps: dueList.slice(0, 5),
    } });
  } catch (e) { next(e); }
};
