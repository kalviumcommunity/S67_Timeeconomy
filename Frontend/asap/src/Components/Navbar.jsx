import React from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout";

const Navbar = ({ user, setUser }) => {
    return (
        <nav>
            <Link to="/">Home</Link>
            {user ? (
                <>
                    <span>Welcome, {user.username}!</span>
                    <Logout setUser={setUser} />
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link>
                </>
            )}
        </nav>
    );
};

export default Navbar;
