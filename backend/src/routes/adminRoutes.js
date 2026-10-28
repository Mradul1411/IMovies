const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllBookings } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorizeAdmin } = require('../middleware/admin');

router.use(protect);
router.use(authorizeAdmin);

router.get('/stats', getDashboardStats);
router.get('/bookings', getAllBookings);

module.exports = router;
