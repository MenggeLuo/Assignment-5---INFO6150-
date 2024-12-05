const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    genres: [{ type: String }],
    cast: [{ type: String }],
    releaseDate: { type: Date },
    duration: { type: Number }, // in minutes
    rating: { type: Number }, // e.g., IMDb rating
    posterPath: { type: String }, // URL or file path to poster image
});

module.exports = mongoose.model('Movie', movieSchema);
