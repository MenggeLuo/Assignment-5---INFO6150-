import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavigationBar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const searchQuery = e.target.search.value;
        navigate(`/search?q=${searchQuery}`);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/home">
                    Movie Ticket
                </Link>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarContent"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" to="/home">Home</Link>
                        </li>
                    </ul>
                    <form className="d-flex me-3" onSubmit={handleSearch}>
                        <input 
                            className="form-control me-2" 
                            type="search" 
                            placeholder="Search movies..." 
                            name="search"
                        />
                        <button className="btn btn-outline-light" type="submit">
                            Search
                        </button>
                    </form>
                    <button 
                        onClick={handleLogout} 
                        className="btn btn-outline-danger"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;