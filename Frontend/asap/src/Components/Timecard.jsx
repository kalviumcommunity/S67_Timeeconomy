import React from 'react'
import { timeData } from '../sample';

 const Timecard = () => {
    return (
        <div>
          <h2>Time Management Sessions</h2>
          {timeData.map((session) => (
            <div key={session.id} style={{ border: "1px solid black", padding: "10px", margin: "10px" }}>
              <h3>{session.title}</h3>
              <p><strong>Duration:</strong> {session.duration}</p>
              <p><strong>Description:</strong> {session.description}</p>
            </div>
          ))}
        </div>
      );
}
export default Timecard;