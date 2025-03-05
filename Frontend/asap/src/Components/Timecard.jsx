import React from 'react'
import TimeData from '../Timedata'

 const Timecard = ({id, title, duration, description}) => {
    return (
        <div>
          <h2>Time Management </h2>
          
            <div key={id} style={{ border: "1px solid black", padding: "10px", margin: "10px" }}>
              <h3>{title}</h3>
              <p><strong>Duration:</strong> {duration}</p>
              <p><strong>Description:</strong> {description}</p>
            </div>
          
        </div>
    
      );
}
export default Timecard;