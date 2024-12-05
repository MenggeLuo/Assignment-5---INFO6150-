const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    showtimeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
    seats: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    bookingDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', bookingSchema);
