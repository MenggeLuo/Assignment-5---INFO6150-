const express = require('express');
const bookingsRoutes = require('./bookingsRoutes');
const moviesRoutes = require('./moviesRoutes');
const showTimeRoutes = require('./showTimeRoutes');


const router = express.Router();

// Import routes

// Use routes
router.use('/bookings', bookingsRoutes);
router.use('/movies', moviesRoutes);
router.use('/showtimes', showTimeRoutes);

module.exports = router;