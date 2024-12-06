import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavigationBar from '../home/NavigationBar';

const BookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [theaters, setTheaters] = useState([]);
    const [selectedTheater, setSelectedTheater] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedSeats, setSelectedSeats] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Available dates (next 7 days)
    const availableDates = Array.from({length: 7}, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return date.toISOString().split('T')[0];
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchBookingData = async () => {
            try {
                const [movieResponse, theatersResponse] = await Promise.all([
                    axios.get(`http://localhost:5000/api/movies/${id}`),
                    axios.get(`http://localhost:5000/api/theaters/movie/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setMovie(movieResponse.data);
                setTheaters(theatersResponse.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchBookingData();
    }, [id, navigate]);

    const handleBooking = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/bookings', {
                movieId: id,
                theaterId: selectedTheater,
                showTime: `${selectedDate}T${selectedTime}`,
                seats: selectedSeats
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data) {
                navigate('/booking/confirmation', { 
                    state: { bookingDetails: response.data.booking }
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        }
    };

    if (loading) {
        return (
            <div>
                <NavigationBar />
                <div className="d-flex justify-content-center mt-5">
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
            <div className="container py-4">
                {/* Movie Information Card */}
                <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-3">
                                <img 
                                    src={movie?.posterPath || '/api/placeholder/200/300'} 
                                    alt={movie?.title}
                                    className="img-fluid rounded"
                                />
                            </div>
                            <div className="col-md-9">
                                <h2 className="mb-3">{movie?.title}</h2>
                                <div className="d-flex mb-3">
                                    <span className="badge bg-primary me-2">{movie?.rating} ★</span>
                                    <span className="badge bg-secondary me-2">{movie?.duration} mins</span>
                                </div>
                                <p className="text-muted">{movie?.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Form */}
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h3 className="card-title mb-4">Book Tickets</h3>
                        
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        <div className="row g-3">
                            {/* Theater Selection */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Select Theater</label>
                                <select 
                                    className="form-select"
                                    value={selectedTheater}
                                    onChange={(e) => setSelectedTheater(e.target.value)}
                                >
                                    <option value="">Choose a theater...</option>
                                    {theaters.map((theater) => (
                                        <option key={theater._id} value={theater._id}>
                                            {theater.name} - {theater.location}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date Selection */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Select Date</label>
                                <select 
                                    className="form-select"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                >
                                    <option value="">Choose a date...</option>
                                    {availableDates.map((date) => (
                                        <option key={date} value={date}>
                                            {new Date(date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Show Time Selection */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Select Show Time</label>
                                <select 
                                    className="form-select"
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                >
                                    <option value="">Choose a time...</option>
                                    {['10:00', '13:00', '16:00', '19:00', '22:00'].map((time) => (
                                        <option key={time} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Number of Seats */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Number of Seats</label>
                                <div className="input-group">
                                    <button 
                                        className="btn btn-outline-secondary" 
                                        type="button"
                                        onClick={() => setSelectedSeats(prev => Math.max(1, prev - 1))}
                                    >
                                        -
                                    </button>
                                    <input 
                                        type="number" 
                                        className="form-control text-center"
                                        value={selectedSeats}
                                        onChange={(e) => setSelectedSeats(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                                        min="1"
                                        max="10"
                                    />
                                    <button 
                                        className="btn btn-outline-secondary" 
                                        type="button"
                                        onClick={() => setSelectedSeats(prev => Math.min(10, prev + 1))}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Price Summary */}
                        <div className="card bg-light mt-4 mb-4">
                            <div className="card-body">
                                <h5 className="card-title">Price Summary</h5>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Tickets ({selectedSeats} × $12.00)</span>
                                    <span>${(selectedSeats * 12).toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between border-top pt-2">
                                    <strong>Total Amount</strong>
                                    <strong>${(selectedSeats * 12).toFixed(2)}</strong>
                                </div>
                            </div>
                        </div>

                        {/* Book Button */}
                        <button
                            className="btn btn-primary w-100 py-2"
                            onClick={handleBooking}
                            disabled={!selectedTheater || !selectedDate || !selectedTime || !selectedSeats}
                        >
                            Confirm Booking
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;