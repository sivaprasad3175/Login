import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user, setUser }) => {
    const [users, setUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('https://users-2-j0ak.onrender.com/api/user/fetch', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
                alert('Failed to fetch users. Please try again later.');
            }
        };

        fetchUsers();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    // Toggle edit mode for a user
    const startEditing = (user) => {
        setEditingUserId(user._id);
        setEditName(user.name);
        setEditEmail(user.email);
    };

    // Cancel editing mode
    const cancelEditing = () => {
        setEditingUserId(null);
        setEditName('');
        setEditEmail('');
    };

    // Delete User function
    const deleteUser = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://users-2-j0ak.onrender.com/api/user/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(users.filter(user => user._id !== id));
            alert('User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user. Please try again later.');
        }
    };

    // Update User function
    const updateUser = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const updatedData = {
                name: editName,
                email: editEmail,
            };
            await axios.put(`https://users-2-j0ak.onrender.com/api/user/update/${id}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(users.map(user => user._id === id ? { ...user, ...updatedData } : user));
            alert('User updated successfully');
            cancelEditing(); // Exit editing mode after update
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user. Please try again later.');
        }
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
                            {editingUserId === user._id ? (
                                <>
                                    <input 
                                        type="text" 
                                        value={editName} 
                                        onChange={(e) => setEditName(e.target.value)} 
                                        placeholder="Name"
                                    />
                                    <input 
                                        type="email" 
                                        value={editEmail} 
                                        onChange={(e) => setEditEmail(e.target.value)} 
                                        placeholder="Email"
                                    />
                                    <button onClick={() => updateUser(user._id)} className="save-button">Save</button>
                                    <button onClick={cancelEditing} className="cancel-button">Cancel</button>
                                </>
                            ) : (
                                <>
                                    <strong>Name:</strong> {user.name} | <strong>Email:</strong> {user.email}
                                    <button onClick={() => deleteUser(user._id)} className="delete-button">Delete</button>
                                    <button onClick={() => startEditing(user)} className="edit-button">Update</button>
                                </>
                            )}
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
