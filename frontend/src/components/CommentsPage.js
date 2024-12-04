import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CommentsPage.css";

const CommentsPage = () => {
    const [comments, setComments] = useState([]); // 当前页评论
    const [currentPage, setCurrentPage] = useState(1); // 当前页码
    const [totalPages, setTotalPages] = useState(1); // 总页数
    const [username, setUsername] = useState(""); // 当前用户
    const [error, setError] = useState("");
    const [newComment, setNewComment] = useState("");
    const [replyContent, setReplyContent] = useState(""); // 子评论内容
    const navigate = useNavigate();
    const commentsPerPage = 10; // 每页显示的评论数量
    const [replyingTo, setReplyingTo] = useState(null); // 当前显示回复框的评论 ID


    // 获取用户信息
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        axios
            .get("http://localhost:5001/api/users/me", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setUsername(response.data.user.username);
            })
            .catch((error) => {
                console.error("Error fetching user info:", error.response?.data || error.message);
                navigate("/login");
            });
    }, [navigate]);

    // 获取评论数据
    useEffect(() => {
        fetchComments(currentPage);
    }, [currentPage]);

    const fetchComments = (page) => {
        const token = localStorage.getItem("token");
        axios
            .get("http://localhost:5001/api/comments", {
                params: { page, limit: commentsPerPage },
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setComments(response.data.comments); // 更新评论状态
                setTotalPages(Math.ceil(response.data.total / commentsPerPage));
            })
            .catch((error) => {
                console.error("Error fetching comments:", error.response?.data || error.message);
            });
    };
    

    const handleAddComment = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("You must be logged in to post a comment.");
            return;
        }

        if (!newComment.trim()) {
            setError("Comment cannot be empty.");
            return;
        }

        const commentData = { content: newComment, username };

        axios
            .post(
                "http://localhost:5001/api/comments",
                commentData,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            )
            .then((response) => {
                setComments([response.data, ...comments]);
                setNewComment("");
                setError("");
            })
            .catch((error) => {
                console.error("Error posting comment:", error.response?.data || error.message);
                setError(error.response?.data?.error || "Failed to post comment.");
            });
    };

    const handleDeleteComment = (commentId) => {
        const token = localStorage.getItem("token");
        console.log("Token being sent in deleteComment:", token);
        axios
            .delete(`http://localhost:5001/api/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                setComments(comments.filter((comment) => comment._id !== commentId));
            })
            .catch((error) => {
                console.error("Error deleting comment:", error.response?.data || error.message);
            });
    };
    
    const handleDeleteReply = (replyId, rootCommentId) => {
        const token = localStorage.getItem("token");
        axios
            .delete(`http://localhost:5001/api/comments/${rootCommentId}/replies/${replyId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                fetchComments(); // 刷新评论
            })
            .catch((error) => {
                console.error("Error deleting reply:", error.response?.data || error.message);
            });
    };
    
    
    
    const renderReplies = (replies, rootCommentId) => {
        return replies.map((reply) => (
            <div key={reply._id} className="reply-card">
                <div className="reply-header">
                    <strong>{reply.username}</strong>
                    <small>{new Date(reply.createdAt).toLocaleString()}</small>
                </div>
                <p className="reply-content">{reply.content}</p>
                <div className="reply-actions">
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setReplyingTo(reply._id)} // 设置当前回复框的目标 ID
                    >
                        Reply
                    </button>
                    {reply.username === username && (
                        <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteReply(reply._id, rootCommentId)} // 传递 rootCommentId
                    >
                        Delete
                    </button>
                    
                    )}
                </div>
                {replyingTo === reply._id && (
                    <>
                        <textarea
                            rows="2"
                            placeholder="Write a reply"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                        ></textarea>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleAddReply(reply._id, rootCommentId)} // 添加子回复
                        >
                            Submit Reply
                        </button>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setReplyingTo(null)} // 取消回复框
                        >
                            Cancel
                        </button>
                    </>
                )}
                {/* 递归渲染子回复 */}
                {reply.replies && reply.replies.length > 0 && (
                    <div className="nested-replies">
                        {renderReplies(reply.replies, rootCommentId)}
                    </div>
                )}
            </div>
        ));
    };
    
    
    
    
    const handleAddReply = (parentCommentId, rootCommentId) => {
        const token = localStorage.getItem("token");
        console.log("Adding reply to:", { parentCommentId, rootCommentId });
        axios
            .post(
                `http://localhost:5001/api/comments/${rootCommentId}/replies`, // 根评论 ID
                { content: replyContent, parentCommentId }, // 当前被回复的评论 ID
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then(() => {
                setReplyContent(""); // 清空输入框
                setReplyingTo(null); // 关闭回复框
                fetchComments(); // 刷新评论
            })
            .catch((error) => {
                console.error("Error adding reply:", error.response?.data || error.message);
            });
    };
    
    
    
    
    

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="comments-page">
            <h2>All Comments</h2>
            <div className="comment-section">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment._id} className="comment-card">
                            <strong>{comment.username}</strong>
                            <p>{comment.content}</p>
                            <small>{new Date(comment.createdAt).toLocaleString()}</small>
                            {comment.username === username && (
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDeleteComment(comment._id)}
                                >
                                    Delete
                                </button>
                            )}
                            <div className="reply-section">
                                <h4>Replies</h4>
                                {/* 递归渲染子评论 */}
                                {comment.replies && renderReplies(comment.replies, comment._id)}
                                {/* 主评论回复框 */}
                                {replyingTo === comment._id ? (
                                    <>
                                        <textarea
                                            rows="2"
                                            placeholder="Write a reply"
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                        ></textarea>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleAddReply(comment._id, comment._id)} // 传递 rootCommentId 和 parentCommentId
                                        >
                                            Submit Reply
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => setReplyingTo(null)}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setReplyingTo(comment._id)}
                                    >
                                        Reply
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                                     
                ) : (
                    <p>No comments yet. Be the first to comment!</p>
                )}
            </div>
            <div className="pagination">
                <button
                    className="btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className="btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
            <div className="add-comment">
                <h3>Write a Comment</h3>
                <textarea
                    rows="3"
                    placeholder="Write your comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                {error && <div className="error-message">{error}</div>}
                <button className="btn btn-primary" onClick={handleAddComment}>
                    Submit
                </button>
            </div>
        </div>
    );
};

export default CommentsPage;
