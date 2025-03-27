import React, { useState, useEffect } from "react";
import axios from "../services/api"; // Adjust based on your API file

const UserDropdown = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("/users") // Fetch users from backend
      .then(response => setUsers(response.data))
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  return (
    <select onChange={(e) => onSelectUser(e.target.value)}>
      <option value="">Select a User</option>
      {users.map(user => (
        <option key={user.id} value={user.id}>{user.username}</option>
      ))}
    </select>
  );
};

export default UserDropdown;
