const Show = require('../models/Show');

function initSeatSocket(io) {
  // Map of socket.id -> { showId, lockedSeats: Set }
  const clientLocks = new Map();

  io.on('connection', (socket) => {
    // console.log(`⚡ Client connected to seat socket: ${socket.id}`);

    // Join room for a specific show
    socket.on('join_show', async ({ showId }) => {
      socket.join(`show_${showId}`);
      // Clean up expired locks from DB for this show
      try {
        const now = new Date();
        await Show.findByIdAndUpdate(showId, {
          $pull: { lockedSeats: { expiresAt: { $lt: now } } }
        });
      } catch (err) {
        console.error('Error cleaning expired locks:', err.message);
      }
    });

    // Leave show room
    socket.on('leave_show', ({ showId }) => {
      socket.leave(`show_${showId}`);
    });

    // Temporarily lock seats during selection (10 minute hold)
    socket.on('lock_seats', async ({ showId, seatIds, userId }) => {
      try {
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
        const show = await Show.findById(showId);

        if (!show) return;

        // Verify none of the seats are already booked
        const conflictBooked = seatIds.filter(s => show.bookedSeats.includes(s));
        if (conflictBooked.length > 0) {
          socket.emit('lock_failed', { message: 'Some seats are already booked.' });
          return;
        }

        // Add locks to show
        const newLocks = seatIds.map(seatId => ({
          seatId,
          lockedBy: userId || socket.id,
          expiresAt
        }));

        await Show.findByIdAndUpdate(showId, {
          $push: { lockedSeats: { $each: newLocks } }
        });

        // Track for this socket
        if (!clientLocks.has(socket.id)) {
          clientLocks.set(socket.id, { showId, seats: new Set() });
        }
        seatIds.forEach(s => clientLocks.get(socket.id).seats.add(s));

        // Broadcast to other users in this show room
        socket.to(`show_${showId}`).emit('seats_locked', {
          seatIds,
          lockedBy: socket.id
        });
      } catch (err) {
        console.error('Error locking seats:', err.message);
      }
    });

    // Unlock seats when unselected
    socket.on('unlock_seats', async ({ showId, seatIds }) => {
      try {
        await Show.findByIdAndUpdate(showId, {
          $pull: { lockedSeats: { seatId: { $in: seatIds } } }
        });

        if (clientLocks.has(socket.id)) {
          seatIds.forEach(s => clientLocks.get(socket.id).seats.delete(s));
        }

        // Broadcast to others
        socket.to(`show_${showId}`).emit('seats_unlocked', { seatIds });
      } catch (err) {
        console.error('Error unlocking seats:', err.message);
      }
    });

    // Notify all viewers when booking is finalized
    socket.on('seats_booked_broadcast', ({ showId, seatIds }) => {
      io.to(`show_${showId}`).emit('seats_confirmed_booked', { seatIds });
    });

    // On disconnect, release seats locked by this client
    socket.on('disconnect', async () => {
      if (clientLocks.has(socket.id)) {
        const { showId, seats } = clientLocks.get(socket.id);
        const seatIds = Array.from(seats);
        if (seatIds.length > 0 && showId) {
          try {
            await Show.findByIdAndUpdate(showId, {
              $pull: { lockedSeats: { seatId: { $in: seatIds } } }
            });
            io.to(`show_${showId}`).emit('seats_unlocked', { seatIds });
          } catch (err) {
            console.error('Error auto-releasing locks on disconnect:', err.message);
          }
        }
        clientLocks.delete(socket.id);
      }
    });
  });
}

module.exports = initSeatSocket;
