const express = require('express');
const router = express.Router();
const {
  getShows,
  getShowById,
  createShow,
  deleteShow
} = require('../controllers/showController');
const { protect } = require('../middleware/auth');
const { authorizeAdmin } = require('../middleware/admin');

router.route('/')
  .get(getShows)
  .post(protect, authorizeAdmin, createShow);

router.route('/:id')
  .get(getShowById)
  .delete(protect, authorizeAdmin, deleteShow);

module.exports = router;
