import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login"); // No Token jumps to the login page
            return;
        }

        // Verification Token
        axios
            .get("http://localhost:5000/api/users/home", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                console.log(response.data.message);
            })
            .catch((error) => {
                console.error("Unauthorized:", error);
                navigate("/login"); // The Token is invalid. Go to the login page
            });
    }, [navigate]);

    return (
        <div className="container mt-5">
            <div className="card p-4 mx-auto" style={{ maxWidth: "600px" }}>
                <h2 className="text-center">Welcome to Home</h2>
                <p className="text-center">You have successfully logged in!</p>
            </div>
        </div>
    );
};

export default Home;
