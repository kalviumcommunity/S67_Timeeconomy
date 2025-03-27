import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { Home } from './Components/Home'
import Timecard from './Components/Timecard'
import Login from './Components/Login'
import Navbar from './Components/Navbar'
import { useState } from 'react'


function App() {
  const [user, setUser] = useState(null)

  return (
    <>
       <Router>
       <Navbar user={user} setUser={setUser} />
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/start" element={<Timecard/>} />
          <Route path="/login" element={<Login setUser={setUser} />} />
                <Route path="/" element={<h1>Home Page</h1>} />

        </Routes>
      </Router>
    </>
  )
}

export default App
