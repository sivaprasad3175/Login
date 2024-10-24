import React, { useState, useEffect } from "react";
import './Form.css'; // Import your CSS file here
import logo from './logo512.png'; // Adjust the path based on where you placed your logo

const Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [users, setUsers] = useState([]);
  const [editMode, setEditMode] = useState(false); // State to track if we are editing
  const [currentUserId, setCurrentUserId] = useState(null); // State to hold current user ID for editing

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("https://users-2-j0ak.onrender.com/api/user/fetch");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    try {
      const url = editMode
        ? `https://users-2-j0ak.onrender.com/api/user/update/${currentUserId}` // URL for updating user
        : "https://users-2-j0ak.onrender.com/api/user/create"; // URL for creating user

      const response = await fetch(url, {
        method: editMode ? "PUT" : "POST", // PUT for update, POST for create
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        fetchUsers();
        setFormData({
          name: "",
          email: "",
          address: "",
        });

        // Reset edit mode after submitting
        setEditMode(false);
        setCurrentUserId(null);

        setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      } else {
        console.error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      address: user.address,
    });
    setEditMode(true); // Enable edit mode
    setCurrentUserId(user._id); // Set current user ID for updating
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`https://users-2-j0ak.onrender.com/api/user/delete/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchUsers(); // Refresh the user list after deletion
        } else {
          console.error("Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="form-container">
      <h1 className="form-title">User Registration Form</h1>
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="form-textarea"
          ></textarea>
        </div>
        <button type="submit" className="submit-button">{editMode ? "Update" : "Submit"}</button>
      </form>
      {submitted && <p className="success-message">Form submitted successfully!</p>}

      <h2 className="user-list-title">User List</h2>
      {users.length > 0 ? (
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
               
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default Form;
