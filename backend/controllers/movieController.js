const Movie = require('../models/Movie');
const { MOVIES } = require('../util/mockDataBase');

// Get all movies
exports.getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Search movies
exports.searchMovies = async (req, res) => {
    const { query } = req.query;
    try {
        const movies = await Movie.find({ title: new RegExp(query, 'i') });
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a new movie
//accept array of movies data in request body
exports.createMovie = async (req, res) => {
    //const moviesData = MOVIES;
    if (!req.body) {
        return res.status(400).json({ message: 'Please provide movie data' });
    }
    try {
        const movie = new Movie(req.body);
        //const newMovieData = await Movie.insertMany(moviesData);
        await movie.save();
        res.status(201).json({ message: 'Movie added successfully', movie });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
