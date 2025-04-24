const express = require('express');
const {
    createComment,
    getCommentById,
    getAllComments,
    updateComment,
    deleteComment,
    getCommentsByUser,
    getCommentsByMovieId,
    updateCommentLike
} = require('../controllers/comment.controller');

const router = express.Router();

router.post('/comments', createComment);
router.get('/comments', getAllComments);
router.get('/comments/:id', getCommentById);
router.get('/comments/user/:userId', getCommentsByUser);
router.get("/comments/movie/:movie_id", getCommentsByMovieId);
router.put('/comments/:id', updateComment);
router.post("/comments/like", updateCommentLike);
router.delete('/comments/:id', deleteComment);

module.exports = router;