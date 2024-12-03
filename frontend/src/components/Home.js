import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavigationBar from "./home/NavigationBar";

const Home = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        // Token
        axios
            .get("http://localhost:5000/api/users/home", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                console.log(response.data.message);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Unauthorized:", error);
                navigate("/login");
            });
    }, [navigate]);

    const handleRandomMovie = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/movies/random");
            navigate(`/movie/${response.data.id}`);
        } catch (error) {
            console.error("Error getting random movie:", error);
        }
    };

    if (loading) {
        return (
            <div>
                <NavigationBar />
                <div className="text-center mt-5">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <NavigationBar />
            <div className="container mt-4">
                {/* Gallery Section */}
                <div className="card shadow-sm mb-5">
                    <div className="card-body">
                        <div className="gallery-section p-5 bg-light rounded">
                            <h2 className="text-center mb-4">Gallery</h2>
                            <div className="row row-cols-1 row-cols-md-3 g-4">
                                {[1, 2, 3].map((num) => (
                                    <div key={num} className="col">
                                        <div className="card h-100 border-0 shadow-sm hover-shadow">
                                            <div className="card-body text-center">
                                                <img 
                                                    src={`/api/placeholder/300/400`}
                                                    alt="Movie poster"
                                                    className="img-fluid rounded mb-3"
                                                />
                                                <h5 className="card-title">Featured Movie</h5>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Random Movie Section */}
                <div className="card shadow-sm">
                    <div className="card-body text-center p-5">
                        <h2 className="mb-4">Discover Something New</h2>
                        <p className="text-muted mb-4">Let us surprise you with a random movie selection</p>
                        <button 
                            className="btn btn-primary btn-lg px-5"
                            onClick={handleRandomMovie}
                        >
                            Get Random Movie
                        </button>
                    </div>
                </div>
            </div>

            {/* Custom CSS */}
            <style jsx="true">{`
                .hover-shadow:hover {
                    transform: translateY(-5px);
                    transition: transform 0.3s ease;
                }
                .card {
                    border-radius: 15px;
                    background: #ffffff;
                }
                .btn-primary {
                    background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
                    border: none;
                    padding: 12px 30px;
                    border-radius: 25px;
                }
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    transition: all 0.3s ease;
                }
            `}</style>
        </div>
    );
};

export default Home;