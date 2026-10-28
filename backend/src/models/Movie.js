const mongoose = require('mongoose');

const castSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: 'Actor' },
  image: { type: String, default: '' }
}, { _id: false });

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    required: true
  },
  banner: {
    type: String,
    required: true
  },
  trailerUrl: {
    type: String,
    default: ''
  },
  genres: [{
    type: String,
    trim: true
  }],
  languages: [{
    type: String,
    trim: true
  }],
  duration: {
    type: Number, // in minutes
    required: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  rating: {
    type: Number,
    default: 8.5
  },
  votesCount: {
    type: Number,
    default: 12500
  },
  formats: [{
    type: String,
    enum: ['2D', '3D', 'IMAX 2D', 'IMAX 3D', '4DX', 'ICE'],
    default: '2D'
  }],
  certificate: {
    type: String,
    enum: ['U', 'U/A', 'A', 'R'],
    default: 'U/A'
  },
  cast: [castSchema],
  director: {
    type: String,
    default: ''
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Indexing for search optimization
movieSchema.index({ title: 'text', description: 'text' });
movieSchema.index({ genres: 1 });
movieSchema.index({ languages: 1 });
movieSchema.index({ releaseDate: -1 });

module.exports = mongoose.model('Movie', movieSchema);
