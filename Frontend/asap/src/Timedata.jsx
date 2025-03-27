import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Timecard from './Components/Timecard';

function TimeData() {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]); // Store list of users
  const [selectedUser, setSelectedUser] = useState(""); // Track selected user

  // Fetch users when component mounts
  useEffect(() => {
    axios.get('http://localhost:3000/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  // Fetch data items based on selected user
  useEffect(() => {
    if (selectedUser) {
      axios.get(`http://localhost:3000/main/fetch?created_by=${selectedUser}`)
        .then(response => setData(response.data))
        .catch(err => console.error('Error fetching data:', err));
    }
  }, [selectedUser]);

  return (
    <>
      <h1>Study using the Pomodoro Technique</h1>
      <p>
        So this is a ridiculous project as specified in the question... I find
        it extremely hilarious how people use this app and grow in their life
        and career.
      </p>

      {/* User Dropdown */}
      <label>Select User: </label>
      <select onChange={(e) => setSelectedUser(e.target.value)}>
        <option value="">-- Choose a User --</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>{user.username}</option>
        ))}
      </select>

      <div>
        <br />
        <h3>Here are some ideas</h3>
        <div>
          {data.map((ele) => (
            <Timecard
              key={ele.id}
              id={ele.id}
              title={ele.title}
              duration={ele.duration}
              description={ele.description}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default TimeData;
