const express = require("express");
const { getComments, addComment, deleteComment, addReply, deleteReply } = require("../controllers/commentController");
const verifyToken = require("../services/authService");
const router = express.Router();

// Fetch all comments
router.get("/", verifyToken, getComments);

// Add a new comment
router.post("/", verifyToken, addComment);

// 删除评论
router.delete("/:commentId", verifyToken, deleteComment);

router.post("/:rootCommentId/replies", verifyToken, addReply);

router.delete("/:rootCommentId/replies/:replyId", verifyToken, deleteReply);



module.exports = router;
