const express = require('express');
const {
    addLikedMovie,
    getLikedMoviesByUser,
    removeLikedMovie,
    removeLikedMovieByUserAndMovie
} = require('../controllers/likedMovies.controller');

const router = express.Router();

router.post('/liked-movies', addLikedMovie);
router.get('/liked-movies/user/:userId', getLikedMoviesByUser);
router.delete('/liked-movies/:id', removeLikedMovie);
router.delete('/liked-movies/user/:userId/movie/:movieId', removeLikedMovieByUserAndMovie);

module.exports = router;