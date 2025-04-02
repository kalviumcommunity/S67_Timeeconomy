import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "./Components/Home";
import Timecard from "./Components/Timecard";
import Login from "./Components/Login";
import Navbar from "./Components/Navbar";
import { useAuth } from "./Components/AuthContext";

function App() {
  const { user, setUser } = useAuth(); 

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/start" element={<Timecard />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route
          path="/dashboard"
          element={user ? <h1>Welcome, {user.name}!</h1> : <Login />}
        />
      </Routes>
    </Router>
  );
}

export default App;
