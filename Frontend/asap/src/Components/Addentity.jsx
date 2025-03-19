import React, { useState, useEffect } from "react";
import axios from "axios";

const AddEntity = () => {
    const [entities, setEntities] = useState([]);
    const [users, setUsers] = useState([]); 
    const [selectedUser, setSelectedUser] = useState("");
    const [data, setData] = useState({
        name: "",
        description: "",
        time: "",
        created_by: ""
    });
    const [edit, setEdit] = useState(null);

    useEffect(() => {
        fetchEntities();
        fetchUsers();
    }, []);

    const fetchEntities = async () => {
        try {
            const response = await axios.get("http://localhost:3000/main");
            setEntities(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:3000/users"); 
            setUsers(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (edit) {
                await axios.put(`http://localhost:3000/main/${edit}`, data);
                setEntities((prev) =>
                    prev.map((entity) => (entity._id === edit ? { ...entity, ...data } : entity))
                );
            } else {
                const response = await axios.post("http://localhost:3000/main", data);
                setEntities((prevEntities) => [...prevEntities, response.data]);
            }

            setData({ name: "", description: "", time: "", created_by: "" });
            setEdit(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/main/${id}`);
            setEntities((prev) => prev.filter((entity) => entity._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (entity) => {
        setData(entity);
        setEdit(entity._id);
    };

    const handleUserChange = (e) => {
        setSelectedUser(e.target.value);
    };

    return (
        <div>
            <h2>{edit ? "Update Entity" : "Add New Entity"}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Entity Name"
                    value={data.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={data.description}
                    onChange={handleChange}
                    required
                />
                <select name="created_by" value={data.created_by} onChange={handleChange} required>
                    <option value="">Select Creator</option>
                    {users.map((user) => (
                        <option key={user._id} value={user._id}>
                            {user.name}
                        </option>
                    ))}
                </select>
                <button type="submit">{edit ? "Update" : "Add"}</button>
            </form>

            <h3>Filter by User</h3>
            <select onChange={handleUserChange} value={selectedUser}>
                <option value="">All Users</option>
                {users.map((user) => (
                    <option key={user._id} value={user._id}>
                        {user.name}
                    </option>
                ))}
            </select>

            <h3>Entities List</h3>
            <ul>
                {entities
                    .filter((entity) => !selectedUser || entity.created_by === selectedUser)
                    .map((entity) => (
                        <li key={entity._id}>
                            <strong>{entity.name}:</strong> {entity.description} <br />
                            <small>Created by: {users.find((u) => u._id === entity.created_by)?.name || "Unknown"}</small><br />
                            <button onClick={() => handleEdit(entity)}>Edit</button>
                            <button onClick={() => handleDelete(entity._id)}>Delete</button>
                            <small>Added on: {new Date(entity.createdAt).toLocaleString()}</small>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default AddEntity;
