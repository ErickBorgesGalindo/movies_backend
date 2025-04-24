// filepath: /Users/erickborges/Documents/Marca_Personal/Movies-App/backend/src/controllers/user.controller.js

const pool = require('../db');

// Create a new user
const createUser = async (req, res) => {
    const { user_name, user_lastname, user_description, user_location, user_pass, liked_movies } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO "User" (user_name, user_lastname, user_description, user_location, user_pass, liked_movies) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [user_name, user_lastname, user_description, user_location, user_pass, liked_movies]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
};

// Retrieve a user by ID
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM "User" WHERE id_user = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving user' });
    }
};

// Retrieve all users
const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "User"');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving user' });
    }
};

// Update a user
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { user_name, user_lastname, user_description, user_location, user_pass, liked_movies } = req.body;
    try {
        const result = await pool.query(
            'UPDATE "User" SET User_name = $1, user_lastname = $2, user_description = $3, user_location = $4, user_pass = $5, liked_movies = $6 WHERE id_user = $7 RETURNING *',
            [user_name, user_lastname, user_description, user_location, user_pass, liked_movies, id]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
};

// Retrieve all users with their comment count
const getUsersWithCommentCount = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                u.id_user,
                u.user_name,
                u.user_lastname,
                u.user_description,
                u.user_location,
                u.user_pass,
                u.liked_movies,
                COUNT(c.id_comment) AS commentaries
            FROM "User" u
            LEFT JOIN "Commentaries" c ON u.id_user = c."user"
            GROUP BY u.id_user
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving users with comment count' });
    }
};

// Retrieve a user by ID with their comment count
const getUserWithCommentCountById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT 
                u.id_user,
                u.user_name,
                u.user_lastname,
                u.user_description,
                u.user_location,
                u.user_pass,
                u.liked_movies,
                COUNT(c.id_comment) AS commentaries
            FROM "User" u
            LEFT JOIN "Commentaries" c ON u.id_user = c."user"
            WHERE u.id_user = $1
            GROUP BY u.id_user
        `, [id]);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving user with comment count' });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM "User" WHERE id_user = $1 RETURNING *', [id]);
        if (result.rows.length > 0) {
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUsersWithCommentCount,
    getUserWithCommentCountById
};
