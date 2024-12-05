import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavigationBar from '../home/NavigationBar';


const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchMovieDetails = async () => {
            try {
                // 获取电影详情和评论
                const [authCheck, movieRes] = await Promise.all([
                    // 验证用户token
                    axios.get("http://localhost:5001/api/users/validate", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    // 获取TMDB电影详情
                    axios.get(`http://localhost:5001/api/movies/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                const movieData = movieRes.data;
                
                // 转换电影数据格式
                const formattedMovie = {
                    id: movieData.id,
                    title: movieData.title,
                    description: movieData.overview,
                    poster: movieData.poster_path 
                        ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
                        : null,
                    rating: movieData.vote_average.toFixed(1),
                    duration: movieData.runtime,
                    releaseDate: new Date(movieData.release_date).toLocaleDateString(),
                    language: movieData.original_language.toUpperCase(),
                    category: movieData.genres?.map(genre => genre.name).join(', ')
                };

                setMovie(formattedMovie);

                // 获取评论 (暂时使用模拟数据，后续可以接入真实评论系统)
                const mockComments = [
                    {
                        username: "User1",
                        content: "Great movie!",
                        date: new Date()
                    },
                    {
                        username: "User2",
                        content: "Highly recommended!",
                        date: new Date()
                    }
                ];
                setComments(mockComments);
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching movie details:", error);
                if (error.response?.status === 401) {
                    navigate("/login");
                }
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id, navigate]);

    if (loading) {
        return (
            <div>
                <NavigationBar />
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <NavigationBar />
            <div className="movie-container">
                {/* Post  */}
                <div className="movie-poster-section">
                    <div className="poster-wrapper">
                        <img 
                            src={movie?.poster || `/api/placeholder/400/600`}
                            alt={movie?.title}
                            className="movie-poster"
                        />
                        <div className="movie-badges">
                            <span className="badge bg-primary">{movie?.category}</span>
                            <span className="badge bg-warning">
                                <i className="bi bi-star-fill"></i> {movie?.rating}/10
                            </span>
                        </div>
                    </div>
                </div>

                {/* Movie Detail */}
                <div className="movie-content">
                    <div className="movie-header">
                        <h1 className="movie-title">{movie?.title}</h1>
                        <div className="movie-meta">
                            <span><i className="bi bi-clock"></i> {movie?.duration} mins</span>
                            <span><i className="bi bi-calendar"></i> {movie?.releaseDate}</span>
                            <span><i className="bi bi-translate"></i> {movie?.language}</span>
                        </div>
                    </div>

                    <div className="movie-section">
                        <h5 className="section-title">Synopsis</h5>
                        <p className="movie-description">{movie?.description}</p>
                    </div>

                    <div className="movie-section">
                        <h5 className="section-title">Recent Comments</h5>
                        <div className="comments-list">
                            {comments.length > 0 ? (
                                comments.map((comment, index) => (
                                    <div key={index} className="comment-card">
                                        <div className="comment-header">
                                            <i className="bi bi-person-circle"></i>
                                            <div className="comment-info">
                                                <div className="comment-author">{comment.username}</div>
                                                <div className="comment-date">
                                                    {new Date(comment.date).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="comment-content">{comment.content}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="no-comments">No comments yet</p>
                            )}
                        </div>
                    </div>

                    {/* buy ticket */}
                    <div className="booking-bar">
                        <button 
                            className="btn btn-primary book-button"
                            onClick={() => navigate(`/booking/${movie?.id}`)}
                        >
                            Book Tickets
                        </button>
                    </div>
                </div>
            </div>

            {/* Custom CSS */}
            <style jsx="true">{`
                .movie-container {
                    padding-bottom: 70px;
                }

                .movie-poster-section {
                    position: relative;
                    width: 100%;
                    background: #000;
                    margin-bottom: 1rem;
                }

                .poster-wrapper {
                    position: relative;
                    padding-top: 56.25%; 
                }

                .movie-poster {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .movie-badges {
                    position: absolute;
                    bottom: 1rem;
                    left: 1rem;
                    display: flex;
                    gap: 0.5rem;
                }

                .movie-content {
                    padding: 1rem;
                }

                .movie-title {
                    font-size: 1.5rem;
                    margin-bottom: 0.5rem;
                }

                .movie-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                    font-size: 0.9rem;
                    color: #666;
                    margin-bottom: 1.5rem;
                }

                .movie-meta span {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .section-title {
                    color: #333;
                    margin-bottom: 1rem;
                }

                .movie-section {
                    margin-bottom: 2rem;
                }

                .comment-card {
                    background: #f8f9fa;
                    padding: 1rem;
                    border-radius: 10px;
                    margin-bottom: 1rem;
                }

                .comment-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 0.75rem;
                }

                .comment-info {
                    flex: 1;
                }

                .comment-author {
                    font-weight: 500;
                }

                .comment-date {
                    font-size: 0.8rem;
                    color: #666;
                }

                .comment-content {
                    margin: 0;
                    font-size: 0.95rem;
                }

                .booking-bar {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 1rem;
                    background: #fff;
                    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
                    z-index: 1000;
                }

                .book-button {
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: 25px;
                    background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
                    border: none;
                    font-weight: 500;
                }

                @media (min-width: 768px) {
                    .movie-container {
                        display: flex;
                        max-width: 1200px;
                        margin: 2rem auto;
                        padding: 0 1rem;
                    }

                    .movie-poster-section {
                        flex: 0 0 300px;
                        margin-bottom: 0;
                    }

                    .poster-wrapper {
                        padding-top: 150%;
                    }

                    .movie-content {
                        flex: 1;
                        padding: 0 2rem;
                    }

                    .movie-title {
                        font-size: 2rem;
                    }

                    .booking-bar {
                        position: static;
                        padding: 0;
                        box-shadow: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default MovieDetail;