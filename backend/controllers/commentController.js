const Comment = require("../models/Comment");
const mongoose = require('mongoose');


const getComments = async (req, res) => {
    try {    
        const { movieId } = req.query; 
        if (!movieId) {
            return res.status(400).json({ error: "Movie ID is required." });
        }

        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 
        const skip = (page - 1) * limit; 

        const total = await Comment.countDocuments();

        const comments = await Comment.find({ movieId })
            .sort({ createdAt: -1 })
            .skip(skip) 
            .limit(limit);

        res.status(200).json({
            comments,
            total,
            page,
            limit,
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ error: "Failed to fetch comments." });
    }
};


// Add a new comment
const addComment = async (req, res) => {
    console.log("Received body:", req.body);
    try {
        const { content, username, movieId } = req.body;

        if (!content || !username || !movieId) {
            return res.status(400).json({ error: "Content, username and movie ID are required." });
        }

        const comment = new Comment({ content, username, movieId });
        await comment.save();

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: "Failed to add comment." });     
    }
};

const findNestedComment = (comments, targetId) => {
    for (let comment of comments) {
        if (comment._id.toString() === targetId) {
            return comment; 
        }
        if (comment.replies && comment.replies.length > 0) {
            const found = findNestedComment(comment.replies, targetId);
            if (found) return found;
        }
    }
    return null;
};

const deleteNestedComment = (comments, targetId) => {
    for (let i = 0; i < comments.length; i++) {
        if (comments[i]._id.toString() === targetId) {
            comments.splice(i, 1);
            return true;
        }
        if (comments[i].replies && comments[i].replies.length > 0) {
            const found = deleteNestedComment(comments[i].replies, targetId);
            if (found) return true;
        }
    }
    return false; 
};



const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const rootComment = await Comment.findOne({
            $or: [{ _id: commentId }, { "replies._id": commentId }],
        });

        if (!rootComment) {
            return res.status(404).json({ error: "Comment not found." });
        }

        if (rootComment._id.toString() === commentId) {
            await rootComment.deleteOne();
            return res.status(200).json({ message: "Comment deleted successfully." });
        }

        const success = deleteNestedComment(rootComment.replies, commentId);
        if (!success) {
            return res.status(404).json({ error: "Comment not found in nested replies." });
        }

        await rootComment.save();
        res.status(200).json({ message: "Reply deleted successfully." });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ error: "Failed to delete comment." });
    }
};

const deleteReply = async (req, res) => {
    const { rootCommentId, replyId } = req.params;

    try {
        const rootComment = await Comment.findOne({ _id: rootCommentId });
        if (!rootComment) {
            return res.status(404).json({ error: "Root comment not found." });
        }

        const deleteNestedReply = (comments, targetId) => {
            for (let i = 0; i < comments.length; i++) {
                if (comments[i]._id.toString() === targetId) {
                    comments.splice(i, 1); 
                    return true;
                }
                if (comments[i].replies && comments[i].replies.length > 0) {
                    const deleted = deleteNestedReply(comments[i].replies, targetId);
                    if (deleted) return true;
                }
            }
            return false;
        };

        const success = deleteNestedReply(rootComment.replies, replyId);
        if (!success) {
            return res.status(404).json({ error: "Reply not found." });
        }

        await rootComment.save();
        res.status(200).json({ message: "Reply deleted successfully." });
    } catch (error) {
        console.error("Error deleting reply:", error);
        res.status(500).json({ error: "Failed to delete reply." });
    }
};

const addNestedReply = (comments, targetId, newReply) => {
    for (let comment of comments) {
        if (comment._id.toString() === targetId) {
            comment.replies.push(newReply);
            return true;
        }
        if (comment.replies && comment.replies.length > 0) {
            const added = addNestedReply(comment.replies, targetId, newReply);
            if (added) return true;
        }
    }
    return false;
};


const addReply = async (req, res) => {
    const { rootCommentId } = req.params;
    const { parentCommentId, content, movieId, username } = req.body; 

    try {
        const rootComment = await Comment.findOne({ _id: rootCommentId });
        if (!rootComment) {
            return res.status(404).json({ error: "Root comment not found." });
        }

        const newReply = {
            _id: new mongoose.Types.ObjectId(),
            content,
            username,
            movieId,
            createdAt: new Date(),
            replies: [],
        };

        if (rootCommentId === parentCommentId) {
            rootComment.replies.push(newReply);
        } else {
            const addReplyToTarget = (comments, targetId) => {
                for (const comment of comments) {
                    if (comment._id.toString() === targetId) {
                        comment.replies.push(newReply);
                        return true;
                    }
                    if (comment.replies && comment.replies.length > 0) {
                        const added = addReplyToTarget(comment.replies, targetId);
                        if (added) return true;
                    }
                }
                return false;
            };

            const added = addReplyToTarget(rootComment.replies, parentCommentId);
            if (!added) {
                return res.status(404).json({ error: "Target comment not found." });
            }
        }

        await rootComment.save();

        res.status(200).json({ message: "Reply added successfully.", newReply });
    } catch (error) {
        console.error("Error adding reply:", error);
        res.status(500).json({ error: "Failed to add reply." });
    }
};

const testFindNestedComment = async () => {
    const rootComment = await Comment.findOne({ _id: "674e7a9ac1ee21805b0f8938" });
    if (!rootComment) {
        console.log("Root comment not found.");
        return;
    }

    const targetComment = findNestedComment(rootComment.replies, "674f7efb74906ef2e3667cb0");
    console.log("Found comment:", targetComment);
};

testFindNestedComment();










module.exports = { getComments, addComment, deleteComment, addReply, addNestedReply, deleteReply };
