const express = require('express');
const router = express.Router();
const {
  getTheatres,
  getTheatreById,
  createTheatre,
  updateTheatre,
  deleteTheatre
} = require('../controllers/theatreController');
const { protect } = require('../middleware/auth');
const { authorizeAdmin } = require('../middleware/admin');

router.route('/')
  .get(getTheatres)
  .post(protect, authorizeAdmin, createTheatre);

router.route('/:id')
  .get(getTheatreById)
  .put(protect, authorizeAdmin, updateTheatre)
  .delete(protect, authorizeAdmin, deleteTheatre);

module.exports = router;
