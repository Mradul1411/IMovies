const Show = require('../models/Show');
const Theatre = require('../models/Theatre');
const Movie = require('../models/Movie');

// Standardized cinema seat layout generator
// Generates 8 rows (A-H), rows A-B classic, C-F prime, G-H VIP/recliners
const generateCinemaLayout = (bookedSeats = [], lockedSeats = []) => {
  const rows = [
    { row: 'H', tier: 'vip', name: 'VIP Recliner', priceKey: 'vip', seats: 8 },
    { row: 'G', tier: 'vip', name: 'VIP Recliner', priceKey: 'vip', seats: 8 },
    { row: 'F', tier: 'prime', name: 'Prime Plus', priceKey: 'prime', seats: 12 },
    { row: 'E', tier: 'prime', name: 'Prime Plus', priceKey: 'prime', seats: 12 },
    { row: 'D', tier: 'prime', name: 'Prime', priceKey: 'prime', seats: 12 },
    { row: 'C', tier: 'prime', name: 'Prime', priceKey: 'prime', seats: 12 },
    { row: 'B', tier: 'classic', name: 'Classic', priceKey: 'classic', seats: 12 },
    { row: 'A', tier: 'classic', name: 'Classic', priceKey: 'classic', seats: 12 },
  ];

  const now = new Date();
  const validLockedSet = new Set(
    lockedSeats
      .filter(l => new Date(l.expiresAt) > now)
      .map(l => l.seatId)
  );
  const bookedSet = new Set(bookedSeats);

  return rows.map(r => {
    const seats = [];
    for (let i = 1; i <= r.seats; i++) {
      const seatId = `${r.row}-${i}`;
      let status = 'available';

      if (bookedSet.has(seatId)) {
        status = 'booked';
      } else if (validLockedSet.has(seatId)) {
        status = 'locked';
      }

      seats.push({
        seatId,
        row: r.row,
        number: i,
        tier: r.tier,
        status
      });
    }

    return {
      row: r.row,
      tier: r.tier,
      tierName: r.name,
      priceKey: r.priceKey,
      seats
    };
  });
};

// @desc    Get shows with filters (movieId, theatreId, showDate, city)
// @route   GET /api/shows
// @access  Public
exports.getShows = async (req, res, next) => {
  try {
    const { movieId, theatreId, showDate, city } = req.query;
    let query = {};

    if (movieId) query.movieId = movieId;
    if (theatreId) query.theatreId = theatreId;
    if (showDate) query.showDate = showDate;

    // Filter by city if theatre isn't specified
    if (city && city !== 'All' && !theatreId) {
      let theatresInCity = await Theatre.find({ city }).select('_id');
      if (theatresInCity.length === 0) {
        // Auto-provision 2 flagship cinema theatres for this city so every Indian city has active showtimes!
        try {
          const movies = await Movie.find({ isActive: true }).limit(4);
          const t1 = await Theatre.create({
            name: `PVR INOX: Nexus Mall, ${city}`,
            chain: 'PVR INOX',
            city,
            address: `Main Boulevard, Nexus Mall, ${city}`,
            amenities: ["Dolby Atmos", "Laser Projection", "Recliner Seats", "Food Lounge", "Valet Parking"],
            screens: [{ screenNumber: 1, name: "Audi 1 - IMAX Laser", format: "IMAX 3D", seatCapacity: 96 }]
          });
          const t2 = await Theatre.create({
            name: `Cinépolis: Central Grand, ${city}`,
            chain: 'Cinepolis',
            city,
            address: `High Street Commercial Hub, ${city}`,
            amenities: ["4DX", "RealD 3D", "VIP Lounge", "Food Court"],
            screens: [{ screenNumber: 1, name: "Screen 1 - 4DX", format: "4DX", seatCapacity: 96 }]
          });

          // Generate shows for next 4 days
          const times = ["10:15 AM", "01:30 PM", "04:45 PM", "08:00 PM"];
          const newShows = [];
          for (let d = 0; d <= 3; d++) {
            const dt = new Date();
            dt.setDate(dt.getDate() + d);
            const dateStr = dt.toISOString().split('T')[0];

            for (const th of [t1, t2]) {
              for (let m = 0; m < movies.length; m++) {
                const mov = movies[m];
                const showTime = times[(m + (th === t2 ? 1 : 0)) % times.length];
                newShows.push({
                  movieId: mov._id,
                  theatreId: th._id,
                  screenName: th.screens[0]?.name || "Screen 1",
                  showDate: dateStr,
                  showTime,
                  format: mov.formats[0] || "2D",
                  language: mov.languages[0] || "Hindi",
                  pricing: { vip: 450, prime: 280, classic: 180 },
                  totalSeats: 96,
                  bookedSeats: ["D-5", "D-6", "E-4"],
                  lockedSeats: []
                });
              }
            }
          }
          await Show.insertMany(newShows);
          theatresInCity = [t1, t2];
        } catch (provErr) {
          console.error('Error auto-provisioning city shows:', provErr.message);
        }
      }
      const theatreIds = theatresInCity.map(t => t._id);
      query.theatreId = { $in: theatreIds };
    }

    let shows = await Show.find(query)
      .populate('movieId', 'title poster banner duration formats languages rating certificate')
      .populate('theatreId', 'name chain city address landmark amenities cancellationAvailable foodBeverageAvailable')
      .sort({ showTime: 1 });

    // If querying by movie & date, and no shows exist yet, auto-provision shows on-demand!
    if (movieId && shows.length === 0) {
      try {
        const movieDoc = await Movie.findById(movieId);
        if (movieDoc) {
          const theatreQuery = (city && city !== 'All') ? { city } : {};
          let candidateTheatres = await Theatre.find(theatreQuery).limit(3);
          if (candidateTheatres.length === 0) {
            candidateTheatres = await Theatre.find().limit(3);
          }

          if (candidateTheatres.length > 0) {
            const targetDate = showDate || new Date().toISOString().split('T')[0];
            const times = ["10:00 AM", "01:30 PM", "05:00 PM", "08:15 PM", "10:45 PM"];
            const onDemandShows = [];

            candidateTheatres.forEach((th, tIdx) => {
              const t1 = times[tIdx % times.length];
              const t2 = times[(tIdx + 2) % times.length];

              for (const timeStr of [t1, t2]) {
                onDemandShows.push({
                  movieId: movieDoc._id,
                  theatreId: th._id,
                  screenName: th.screens[0]?.name || "Audi 1",
                  showDate: targetDate,
                  showTime: timeStr,
                  format: movieDoc.formats[0] || "2D",
                  language: movieDoc.languages[0] || "Hindi",
                  pricing: { vip: 450, prime: 280, classic: 180 },
                  totalSeats: 96,
                  bookedSeats: ["D-5", "D-6", "E-4"],
                  lockedSeats: []
                });
              }
            });

            if (onDemandShows.length > 0) {
              await Show.insertMany(onDemandShows);
              shows = await Show.find(query)
                .populate('movieId', 'title poster banner duration formats languages rating certificate')
                .populate('theatreId', 'name chain city address landmark amenities cancellationAvailable foodBeverageAvailable')
                .sort({ showTime: 1 });
            }
          }
        }
      } catch (autoErr) {
        console.error('Error auto-generating movie shows:', autoErr.message);
      }
    }

    // If querying by movie & date, group by theatre (District & BookMyShow style layout)
    if (movieId) {
      const theatreMap = new Map();

      shows.forEach(show => {
        if (!show.theatreId) return;
        const tid = show.theatreId._id.toString();

        if (!theatreMap.has(tid)) {
          theatreMap.set(tid, {
            theatre: show.theatreId,
            shows: []
          });
        }

        theatreMap.get(tid).shows.push({
          _id: show._id,
          screenName: show.screenName,
          showTime: show.showTime,
          showDate: show.showDate,
          format: show.format,
          language: show.language,
          pricing: show.pricing,
          totalSeats: show.totalSeats,
          availableSeats: show.totalSeats - show.bookedSeats.length,
          status: (show.totalSeats - show.bookedSeats.length <= 10) ? 'almost-full' :
                  (show.totalSeats - show.bookedSeats.length <= 25) ? 'fast-filling' : 'available'
        });
      });

      return res.json({
        success: true,
        count: shows.length,
        theatresWithShows: Array.from(theatreMap.values())
      });
    }

    res.json({
      success: true,
      count: shows.length,
      data: shows
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single show with real-time seat matrix
// @route   GET /api/shows/:id
// @access  Public
exports.getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movieId')
      .populate('theatreId');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    // Generate real-time layout matrix
    const layout = generateCinemaLayout(show.bookedSeats, show.lockedSeats);

    res.json({
      success: true,
      data: {
        _id: show._id,
        movie: show.movieId,
        theatre: show.theatreId,
        screenName: show.screenName,
        showDate: show.showDate,
        showTime: show.showTime,
        format: show.format,
        language: show.language,
        pricing: show.pricing,
        totalSeats: show.totalSeats,
        bookedSeatsCount: show.bookedSeats.length,
        availableSeatsCount: show.totalSeats - show.bookedSeats.length,
        layout
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new show
// @route   POST /api/shows
// @access  Private / Admin
exports.createShow = async (req, res, next) => {
  try {
    const { movieId, theatreId, screenName, showDate, showTime, format, language, pricing } = req.body;

    if (!movieId || !theatreId || !showDate || !showTime) {
      return res.status(400).json({
        success: false,
        message: 'Movie, theatre, showDate, and showTime are required.'
      });
    }

    const show = await Show.create({
      movieId,
      theatreId,
      screenName: screenName || 'Screen 1',
      showDate,
      showTime,
      format: format || '2D',
      language: language || 'English',
      pricing: {
        vip: pricing?.vip || 450,
        prime: pricing?.prime || 280,
        classic: pricing?.classic || 180
      },
      totalSeats: 96,
      bookedSeats: [],
      lockedSeats: []
    });

    res.status(201).json({
      success: true,
      message: 'Show scheduled successfully!',
      data: show
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete show
// @route   DELETE /api/shows/:id
// @access  Private / Admin
exports.deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    await show.deleteOne();

    res.json({
      success: true,
      message: 'Show removed successfully'
    });
  } catch (error) {
    next(error);
  }
};
