const express = require('express');
const router = express.Router();
const {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
} = require('../controllers/movieController');
const { protect } = require('../middleware/auth');
const { authorizeAdmin } = require('../middleware/admin');

const { seedDatabase } = require('../config/seedData');

router.post('/sync-catalog', async (req, res, next) => {
  try {
    const result = await seedDatabase();
    res.json({ success: true, message: 'Catalog synced', ...result });
  } catch (err) {
    next(err);
  }
});

router.route('/')
  .get(getMovies)
  .post(protect, authorizeAdmin, createMovie);

router.route('/:id')
  .get(getMovieById)
  .put(protect, authorizeAdmin, updateMovie)
  .delete(protect, authorizeAdmin, deleteMovie);

module.exports = router;
