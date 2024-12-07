import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            
            // Redirect to login if no token found
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/users/all-users`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setUsers(response.data.users || []);
            } catch (err) {
                setUsers([]); 
                setError('Failed to fetch users');
                if (err.response?.status === 401) {
                    navigate('/login');
                }
            }
        };

        fetchUsers();
    }, [navigate]);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">User Management</h1>
                <button 
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-3 px-4 border-b font-semibold text-left">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(users) && users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">{user.email}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="1" className="text-center py-4 text-gray-500">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Admin;