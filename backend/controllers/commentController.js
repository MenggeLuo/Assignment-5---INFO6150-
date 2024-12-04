const Comment = require("../models/Comment");
const mongoose = require('mongoose');




// Fetch comments with pagination
const getComments = async (req, res) => {
    try {
        // 获取查询参数：页码和每页评论数
        const page = parseInt(req.query.page) || 1; // 默认页码为 1
        const limit = parseInt(req.query.limit) || 10; // 默认每页 10 条评论
        const skip = (page - 1) * limit; // 计算跳过的文档数

        // 获取总评论数
        const total = await Comment.countDocuments();

        // 获取当前页的评论数据
        const comments = await Comment.find()
            .sort({ createdAt: -1 }) // 按创建时间倒序排序
            .skip(skip) // 跳过前面的文档
            .limit(limit); // 限制返回的文档数量

        // 返回分页数据
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
        const { content, username } = req.body;

        if (!content || !username) {
            return res.status(400).json({ error: "Content and username are required." });
        }

        const comment = new Comment({ content, username });
        await comment.save();

        res.status(201).json(comment);
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ error: "Failed to add comment." });     
    }
};

const findNestedComment = (comments, targetId) => {
    for (let comment of comments) {
        if (comment._id.toString() === targetId) {
            return comment; // 找到目标评论
        }
        if (comment.replies && comment.replies.length > 0) {
            const found = findNestedComment(comment.replies, targetId); // 递归查找子评论
            if (found) return found;
        }
    }
    return null; // 未找到
};

const deleteNestedComment = (comments, targetId) => {
    for (let i = 0; i < comments.length; i++) {
        if (comments[i]._id.toString() === targetId) {
            comments.splice(i, 1); // 删除目标评论
            return true;
        }
        if (comments[i].replies && comments[i].replies.length > 0) {
            const found = deleteNestedComment(comments[i].replies, targetId);
            if (found) return true;
        }
    }
    return false; // 未找到
};



const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        // 查找包含目标评论的根评论
        const rootComment = await Comment.findOne({
            $or: [{ _id: commentId }, { "replies._id": commentId }],
        });

        if (!rootComment) {
            return res.status(404).json({ error: "Comment not found." });
        }

        // 如果是根评论，直接删除
        if (rootComment._id.toString() === commentId) {
            await rootComment.deleteOne();
            return res.status(200).json({ message: "Comment deleted successfully." });
        }

        // 删除嵌套评论
        const success = deleteNestedComment(rootComment.replies, commentId);
        if (!success) {
            return res.status(404).json({ error: "Comment not found in nested replies." });
        }

        // 保存修改
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
        // 查找主评论
        const rootComment = await Comment.findOne({ _id: rootCommentId });
        if (!rootComment) {
            return res.status(404).json({ error: "Root comment not found." });
        }

        // 递归删除目标回复
        const deleteNestedReply = (comments, targetId) => {
            for (let i = 0; i < comments.length; i++) {
                if (comments[i]._id.toString() === targetId) {
                    comments.splice(i, 1); // 删除目标回复
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
    const { rootCommentId } = req.params; // 根评论 ID
    const { parentCommentId, content } = req.body; // 被回复的评论 ID 和回复内容
    const username = req.user.username;

    try {
        // 查找根评论
        const rootComment = await Comment.findOne({ _id: rootCommentId });
        if (!rootComment) {
            return res.status(404).json({ error: "Root comment not found." });
        }

        // 创建新回复对象
        const newReply = {
            _id: new mongoose.Types.ObjectId(),
            content,
            username,
            createdAt: new Date(),
            replies: [], // 嵌套回复列表
        };

        // 如果是主评论回复，直接插入 rootComment.replies
        if (rootCommentId === parentCommentId) {
            rootComment.replies.push(newReply);
        } else {
            // 否则递归查找目标子评论，并插入回复
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

        // 保存根评论
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
