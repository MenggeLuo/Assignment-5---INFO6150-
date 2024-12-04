const Booking = require('../models/Booking');
const Showtime = require('../models/ShowTime');

exports.bookTickets = async (req, res) => {
    const { token, showtimeId, seats } = req.body;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    try {
        const showtime = await Showtime.findById(showtimeId);

        if (!showtime) {
            return res.status(404).json({ message: 'Showtime not found' });
        }

        if (showtime.availableSeats < seats) {
            return res.status(400).json({ message: 'Not enough available seats' });
        }

        showtime.availableSeats -= seats;
        await showtime.save();

        const booking = new Booking({
            userId,
            showtimeId,
            seats,
            totalPrice: seats * showtime.price,
        });
        await booking.save();

        res.status(201).json({ message: 'Booking successful', booking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
