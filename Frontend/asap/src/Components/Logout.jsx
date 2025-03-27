import React from "react";
import axios from "axios";

const Logout = ({ setUser }) => {
    const handleLogout = async () => {
        await axios.post("http://localhost:5000/main/auth/logout", {}, { withCredentials: true });
        setUser(null);
    };

    return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
