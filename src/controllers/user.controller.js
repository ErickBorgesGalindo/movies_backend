const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Login a user
const loginUser = async (req, res) => {
  const { user_accesName, user_pass } = req.body;

  // Log the request body
  console.log("Request received:", req.body);

  try {
    // Check if the user exists
    const result = await pool.query(
      'SELECT * FROM "User" WHERE user_accesName = $1',
      [user_accesName]
    );

    if (result.rows.length === 0) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

    // Verify the password
    const isPasswordValid = await bcrypt.compare(user_pass, user.user_pass);
    if (!isPasswordValid) {
      console.log("Invalid credentials");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id_user: user.id_user, user_accesName: user.user_accesName },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Log the response
    console.log("Login successful:", { message: "Login successful", token });

    res.json({ message: "Login successful", token, id_user: user.id_user });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Error logging in" });
  }
};

// Create a new user
const createUser = async (req, res) => {
  const {
    user_name,
    user_lastname,
    user_accesName,
    user_mail,
    user_description,
    user_location,
    user_pass,
    liked_movies,
    commentaries,
  } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(user_pass, 10);

    const result = await pool.query(
      `INSERT INTO public."User" 
            (user_name, user_lastname, user_accesName, user_mail, user_description, user_location, user_pass, liked_movies, commentaries) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        user_name,
        user_lastname,
        user_accesName,
        user_mail,
        user_description,
        user_location,
        hashedPassword,
        liked_movies,
        commentaries,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
};

// Retrieve a user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM "User" WHERE id_user = $1', [
      id,
    ]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error retrieving user" });
  }
};

// Retrieve all users
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "User"');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving user" });
  }
};

// Update a user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    user_name,
    user_lastname,
    user_accesName,
    user_mail,
    user_description,
    user_location,
    user_pass,
    liked_movies,
    commentaries,
  } = req.body;
  try {
    const result = await pool.query(
      `UPDATE "User" 
            SET user_name = $1, user_lastname = $2, user_accesName = $3, user_mail = $4, 
                user_description = $5, user_location = $6, user_pass = $7, 
                liked_movies = $8, commentaries = $9 
            WHERE id_user = $10 RETURNING *`,
      [
        user_name,
        user_lastname,
        user_accesName,
        user_mail,
        user_description,
        user_location,
        user_pass,
        liked_movies,
        commentaries,
        id,
      ]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
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
                u.user_accesName,
                u.user_mail,
                u.user_description,
                u.user_location,
                u.user_pass,
                u.liked_movies,
                u.commentaries,
                COUNT(c.id_comment) AS commentaries
            FROM "User" u
            LEFT JOIN "Commentaries" c ON u.id_user = c."user"
            GROUP BY u.id_user
        `);
    res.json(result.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving users with comment count" });
  }
};

// Retrieve a user by ID with their comment count
const getUserWithCommentCountById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
            SELECT 
                u.id_user,
                u.user_name,
                u.user_lastname,
                u.user_accesName,
                u.user_mail,
                u.user_description,
                u.user_location,
                u.user_pass,
                u.liked_movies,
                u.commentaries,
                COUNT(c.id_comment) AS commentaries
            FROM "User" u
            LEFT JOIN "Commentaries" c ON u.id_user = c."user"
            WHERE u.id_user = $1
            GROUP BY u.id_user
        `,
      [id]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error retrieving user with comment count" });
  }
};

// Check if a username is available
const checkUsernameAvailability = async (req, res) => {
  const { user_accesName } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM public."User" WHERE user_accesName = $1',
      [user_accesName]
    );

    if (result.rows.length > 0) {
      res.json({ available: false, message: "Username is already taken" });
    } else {
      res.json({ available: true, message: "Username is available" });
    }
  } catch (error) {
    console.error("Error checking username availability:", error);
    res.status(500).json({ error: "Error checking username availability" });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM "User" WHERE id_user = $1 RETURNING *',
      [id]
    );
    if (result.rows.length > 0) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUsersWithCommentCount,
  getUserWithCommentCountById,
  loginUser,
  checkUsernameAvailability
};
