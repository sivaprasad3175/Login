import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css'; // Import your CSS for styling
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user, setUser }) => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve the token from local storage
                const response = await axios.get('https://users-2-j0ak.onrender.com/api/user/fetch', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the request headers
                    },
                });
                setUsers(response.data); // Set the fetched users in the state
            } catch (error) {
                console.error('Error fetching users:', error);
                alert('Failed to fetch users. Please try again later.');
            }
        };

        fetchUsers(); // Call the fetch function on component mount
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear the token on logout
        setUser(null); // Clear user state
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <h2>Dashboard</h2>
            <button onClick={handleLogout} className="logout-button">Logout</button>
            <h3>User List</h3>
            {users.length > 0 ? (
                <ul className="user-list">
                    {users.map((user) => (
                        <li key={user._id}>
                            <strong>Name:</strong> {user.name} | <strong>Email:</strong> {user.email}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No users found.</p>
            )}
        </div>
    );
};

export default Dashboard;
