const mongoose = require('mongoose');
const theaterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    screens: { type: Number, required: true }, // Number of screens
});

module.exports = mongoose.model('Theater', theaterSchema);
