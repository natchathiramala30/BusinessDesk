const router = require('express').Router();
const c = require('../controllers/enquiryController');
router.route('/').get(c.getEnquiries).post(c.createEnquiry);
router.route('/:id').get(c.getEnquiry).put(c.updateEnquiry).delete(c.deleteEnquiry);
module.exports = router;
