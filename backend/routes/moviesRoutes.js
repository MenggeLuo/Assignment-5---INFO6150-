const express = require('express');
const movieController = require('../controllers/movieController');

const router = express.Router();

router.get('/', movieController.getAllMovies);
router.get('/search', movieController.searchMovies);
router.post('/', movieController.createMovie);
router.get('/random', movieController.getRandomMovie);
router.get('/:id', movieController.getMovieById);

module.exports = router;

