const pool = require('../db');

// Add a new liked movie
const addLikedMovie = async (req, res) => {
    const { user_id, movie_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO "LikedMovies" (user_id, movie_id) VALUES ($1, $2) RETURNING *',
            [user_id, movie_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error adding liked movie' });
    }
};

// Retrieve all liked movies by a specific user
const getLikedMoviesByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM "LikedMovies" WHERE user_id = $1',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving liked movies for user' });
    }
};

// Remove a liked movie
const removeLikedMovie = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM "LikedMovies" WHERE id_like = $1 RETURNING *',
            [id]
        );
        if (result.rows.length > 0) {
            res.json({ message: 'Liked movie removed successfully' });
        } else {
            res.status(404).json({ error: 'Liked movie not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error removing liked movie' });
    }
};

// Remove a specific liked movie by user and movie ID
const removeLikedMovieByUserAndMovie = async (req, res) => {
    const { userId, movieId } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM "LikedMovies" WHERE user_id = $1 AND movie_id = $2 RETURNING *',
            [userId, movieId]
        );
        if (result.rows.length > 0) {
            res.json({ message: 'Liked movie removed successfully', data: result.rows[0] });
        } else {
            res.status(404).json({ error: 'Liked movie not found for this user and movie' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error removing liked movie' });
    }
};

module.exports = {
    addLikedMovie,
    getLikedMoviesByUser,
    removeLikedMovie,
    removeLikedMovieByUserAndMovie
};