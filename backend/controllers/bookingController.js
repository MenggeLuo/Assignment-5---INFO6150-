const Booking = require('../models/Booking');
const Theater = require('../models/Theater');
const Movie = require('../models/Movie');

exports.getShowtimes = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { date } = req.query;

        // Find all theaters showing this movie
        const theaters = await Theater.find({
            'screens.showTimes.movieId': movieId
        }).select('name location screens.showTimes');

        // Format the response
        const showtimes = theaters.map(theater => ({
            theaterId: theater._id,
            name: theater.name,
            location: theater.location,
            availableShowtimes: theater.screens
                .flatMap(screen => screen.showTimes)
                .filter(showtime => 
                    showtime.movieId.toString() === movieId &&
                    (!date || new Date(showtime.time).toDateString() === new Date(date).toDateString())
                )
                .map(showtime => ({
                    time: showtime.time,
                    availableSeats: showtime.availableSeats,
                    price: showtime.price
                }))
        }));

        res.json(showtimes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createBooking = async (req, res) => {
    try {
        const { movieId, theaterId, showTime, seats } = req.body;
        const userId = req.user.id;

        // Find the theater and showtime
        const theater = await Theater.findById(theaterId);
        if (!theater) {
            return res.status(404).json({ error: 'Theater not found' });
        }

        // Find the specific showtime
        const screen = theater.screens.find(screen => 
            screen.showTimes.some(show => 
                show.movieId.toString() === movieId && 
                new Date(show.time).toISOString() === new Date(showTime).toISOString()
            )
        );

        if (!screen) {
            return res.status(404).json({ error: 'Showtime not found' });
        }

        const showtime = screen.showTimes.find(show => 
            show.movieId.toString() === movieId && 
            new Date(show.time).toISOString() === new Date(showTime).toISOString()
        );

        // Check seat availability
        if (showtime.availableSeats < seats) {
            return res.status(400).json({ error: 'Not enough seats available' });
        }

        // Create booking
        const booking = new Booking({
            userId,
            movieId,
            theaterId,
            screenNumber: screen.number,
            showTime,
            seats,
            totalPrice: seats * showtime.price
        });

        // Update available seats
        showtime.availableSeats -= seats;
        await theater.save();
        await booking.save();

        res.status(201).json({
            message: 'Booking successful',
            booking: {
                ...booking.toObject(),
                theaterName: theater.name,
                theaterLocation: theater.location
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBookingDetails = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId)
            .populate('movieId', 'title posterPath')
            .populate('theaterId', 'name location');

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        const bookings = await Booking.find({ userId })
            .populate('movieId', 'title posterPath')
            .populate('theaterId', 'name location')
            .sort({ showTime: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};