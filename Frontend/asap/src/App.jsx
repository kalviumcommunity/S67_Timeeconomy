import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { Home } from './Components/Home'
import Timecard from './Components/Timecard'


function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
       <Router>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/start" element={<Timecard/>} />

        </Routes>
      </Router>
    </>
  )
}

export default App
