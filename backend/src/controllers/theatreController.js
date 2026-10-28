const Theatre = require('../models/Theatre');
const Show = require('../models/Show');

// @desc    Get all theatres with city filter
// @route   GET /api/theatres
// @access  Public
exports.getTheatres = async (req, res, next) => {
  try {
    const { city, chain } = req.query;
    let query = {};

    if (city && city !== 'All') {
      query.city = city;
    }

    if (chain && chain !== 'All') {
      query.chain = chain;
    }

    const theatres = await Theatre.find(query).sort({ name: 1 });

    res.json({
      success: true,
      count: theatres.length,
      data: theatres
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single theatre
// @route   GET /api/theatres/:id
// @access  Public
exports.getTheatreById = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found'
      });
    }

    res.json({
      success: true,
      data: theatre
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new theatre
// @route   POST /api/theatres
// @access  Private / Admin
exports.createTheatre = async (req, res, next) => {
  try {
    const { name, chain, city, address, landmark, amenities, screens } = req.body;

    if (!name || !city || !address) {
      return res.status(400).json({
        success: false,
        message: 'Name, city, and address are required.'
      });
    }

    const theatre = await Theatre.create({
      name,
      chain: chain || 'PVR INOX',
      city,
      address,
      landmark: landmark || '',
      amenities: amenities || ["Dolby Atmos", "Recliners", "Food Court"],
      screens: screens && screens.length > 0 ? screens : [
        { screenNumber: 1, name: "Audi 1", format: "2D", seatCapacity: 96 }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Theatre created successfully!',
      data: theatre
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update theatre
// @route   PUT /api/theatres/:id
// @access  Private / Admin
exports.updateTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found'
      });
    }

    res.json({
      success: true,
      message: 'Theatre updated successfully!',
      data: theatre
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete theatre
// @route   DELETE /api/theatres/:id
// @access  Private / Admin
exports.deleteTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found'
      });
    }

    await Show.deleteMany({ theatreId: theatre._id });
    await theatre.deleteOne();

    res.json({
      success: true,
      message: 'Theatre removed successfully'
    });
  } catch (error) {
    next(error);
  }
};
