import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie }) => {
    const navigate = useNavigate();

    return (
        <div className="card h-100">
            <img 
                src={movie.poster || '/placeholder.jpg'} 
                className="card-img-top" 
                alt={movie.title}
                style={{ height: '300px', objectFit: 'cover' }}
            />
            <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text">
                    <small className="text-muted">Rating: {movie.rating}/10</small>
                </p>
            </div>
            <div className="card-footer bg-white border-top-0">
                <button
                    className="btn btn-primary w-100"
                    onClick={() => navigate(`/movie/${movie.id}`)}
                >
                    View Details
                </button>
            </div>
        </div>
    );
};

export default MovieCard;