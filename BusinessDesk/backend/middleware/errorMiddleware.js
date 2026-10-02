const notFound = (req, res) => res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
// Never leaks stack traces to the client
const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.type === 'entity.parse.failed') return res.status(400).json({ success: false, message: 'Invalid JSON in request body.' });
  if (err.name === 'ValidationError') return res.status(400).json({ success: false, message: 'Validation failed.' });
  res.status(500).json({ success: false, message: 'Something went wrong on the server. Please try again.' });
};
module.exports = { notFound, errorHandler };
