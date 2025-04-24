const pool = require("../db");

// Create a new comment
const createComment = async (req, res) => {
  const { comment_content, movie, like_count, score, comment_date, user } =
    req.body;
  try {
    const result = await pool.query(
      'INSERT INTO public."Commentaries" (comment_content, movie, like_count, score, comment_date, "user") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [comment_content, movie, like_count, score, comment_date, user]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error creating comment" });
  }
};

// Retrieve a comment by ID
const getCommentById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM "Commentaries" WHERE id_comment = $1',
      [id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Comment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error retrieving comment" });
  }
};

// Retrieve all comments
const getAllComments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Commentaries"');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving comments" });
  }
};

// Retrieve all comments by a specific user
const getCommentsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM "Commentaries" WHERE "user" = $1',
      [userId]
    );
    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({ error: "No comments found for this user" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error retrieving comments for user" });
  }
};

// Retrieve all comments for a specific movie
const getCommentsByMovieId = async (req, res) => {
  const { movie_id } = req.params; // Obtén el movie_id de los parámetros de la URL
  try {
    const result = await pool.query(
      'SELECT * FROM "Commentaries" WHERE movie = $1',
      [movie_id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving comments" });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  const { id } = req.params;
  const { comment_content, movie, like_count, score, comment_date, user } =
    req.body;
  try {
    const result = await pool.query(
      'UPDATE "Commentaries" SET comment_content = $1, movie = $2, like_count = $3, score = $4, comment_date = $5, "user" = $6 WHERE id_comment = $7 RETURNING *',
      [comment_content, movie, like_count, score, user, comment_date, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Comment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating comment" });
  }
};

// Update the like count of a comment
const updateCommentLike = async (req, res) => {
  const { commentId, action } = req.body; // `action` puede ser "like" o "unlike"

  try {
    if (action === "like") {
      await pool.query(
        'UPDATE "Commentaries" SET like_count = like_count + 1 WHERE id_comment = $1',
        [commentId]
      );
    } else if (action === "unlike") {
      await pool.query(
        'UPDATE "Commentaries" SET like_count = like_count - 1 WHERE id_comment = $1',
        [commentId]
      );
    }
    res.status(200).json({ message: "Like updated successfully" });
  } catch (error) {
    console.error("Error updating like:", error);
    res.status(500).json({ error: "Error updating like" });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM "Commentaries" WHERE id_comment = $1 RETURNING *',
      [id]
    );
    if (result.rows.length > 0) {
      res.json({ message: "Comment deleted successfully" });
    } else {
      res.status(404).json({ error: "Comment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting comment" });
  }
};

module.exports = {
  createComment,
  getCommentById,
  getAllComments,
  getCommentsByUser,
  updateComment,
  updateCommentLike,
  deleteComment,
  getCommentsByMovieId,
};
