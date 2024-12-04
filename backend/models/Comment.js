const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
    content: { type: String, required: true },
    username: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    replies: [
        {
            content: { type: String, required: true },
            username: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
            replies: Array, // 避免直接递归引用
        },
    ],
});


const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    username: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    replies: [replySchema], 
});

module.exports = mongoose.model("Comment", commentSchema);
