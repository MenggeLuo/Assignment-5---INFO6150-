const Movie = require('../models/Movie');
const tmdbService = require('../services/tmdbService');

exports.getAllMovies = async (req, res) => {
    try {
        // 从TMDB获取电影列表
        const movies = await tmdbService.getMovies();
        res.status(200).json({ results: movies });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.searchMovies = async (req, res) => {
    const { query, type } = req.query;
    try {
        let movies;
        
        switch (type) {
            case 'rank':
                movies = await tmdbService.getRankedMovies();
                break;
            case 'duration':
                movies = await tmdbService.getMoviesByDuration();
                break;
            case 'category':
                movies = await tmdbService.getMoviesByCategory(query);
                break;
            default:
                movies = query 
                    ? await tmdbService.searchMovies(query)
                    : await tmdbService.getMovies();
        }
        res.status(200).json({ results: movies });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getMovieById = async (req, res) => {
    try {
        const movieId = req.params.id;
        console.log("movieId", movieId);
        const movie = await tmdbService.getMovieDetails(movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createMovie = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: 'Please provide movie data' });
    }
    try {
        const movie = new Movie(req.body);
        await movie.save();
        res.status(201).json({ message: 'Movie added successfully', movie });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.getRandomMovie = async (req, res) => {
    try {
        const movies = await tmdbService.getMovies();
        const randomIndex = Math.floor(Math.random() * movies.length);
        const randomMovie = movies[randomIndex];
        const movieDetails = await tmdbService.getMovieDetails(randomMovie.id);
        res.status(200).json(movieDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};