const Movie = require('../models/Movie');
const Show = require('../models/Show');
const Theatre = require('../models/Theatre');

// @desc    Get all movies with filters & search
// @route   GET /api/movies
// @access  Public
exports.getMovies = async (req, res, next) => {
  try {
    const { search, genre, language, format, isFeatured, city } = req.query;
    let query = { isActive: true };

    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { 'cast.name': { $regex: search.trim(), $options: 'i' } },
        { director: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    if (genre && genre !== 'All') {
      query.genres = { $in: [genre] };
    }

    if (language && language !== 'All') {
      query.languages = { $in: [language] };
    }

    if (format && format !== 'All') {
      query.formats = { $in: [format] };
    }

    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }

    // Filter by city: find movies that have shows scheduled in theatres located in that city
    if (city && city !== 'All') {
      const theatresInCity = await Theatre.find({ city }).select('_id');
      if (theatresInCity.length > 0) {
        const theatreIds = theatresInCity.map(t => t._id);
        const showsInCity = await Show.find({ theatreId: { $in: theatreIds } }).distinct('movieId');
        if (showsInCity.length > 0) {
          query._id = { $in: showsInCity };
        }
      }
    }

    const movies = await Movie.find(query).sort({ releaseDate: -1, rating: -1 });

    res.json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie by ID
// @route   GET /api/movies/:id
// @access  Public
exports.getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.json({
      success: true,
      data: movie
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new movie
// @route   POST /api/movies
// @access  Private / Admin
exports.createMovie = async (req, res, next) => {
  try {
    const {
      title,
      description,
      poster,
      banner,
      trailerUrl,
      genres,
      languages,
      duration,
      releaseDate,
      rating,
      formats,
      certificate,
      cast,
      director,
      isFeatured
    } = req.body;

    if (!title || !description || !poster || !banner || !duration || !releaseDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory movie fields (title, description, poster, banner, duration, releaseDate).'
      });
    }

    const movie = await Movie.create({
      title,
      description,
      poster,
      banner,
      trailerUrl: trailerUrl || '',
      genres: Array.isArray(genres) ? genres : (genres ? genres.split(',').map(s => s.trim()) : ['Action']),
      languages: Array.isArray(languages) ? languages : (languages ? languages.split(',').map(s => s.trim()) : ['English']),
      duration: Number(duration),
      releaseDate: new Date(releaseDate),
      rating: rating ? Number(rating) : 8.5,
      formats: Array.isArray(formats) ? formats : ['2D'],
      certificate: certificate || 'U/A',
      cast: cast || [],
      director: director || '',
      isFeatured: !!isFeatured,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Movie created successfully!',
      data: movie
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private / Admin
exports.updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.json({
      success: true,
      message: 'Movie updated successfully!',
      data: movie
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private / Admin
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Also remove associated shows
    await Show.deleteMany({ movieId: movie._id });
    await movie.deleteOne();

    res.json({
      success: true,
      message: 'Movie and associated shows removed successfully'
    });
  } catch (error) {
    next(error);
  }
};
