import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Timecard from './Components/Timecard';

function TimeData() {
  // {
    //   id: 1,
    //   title: "Study Session",
    //   duration: "2 hours",
    //   description: "Focusing on Data Structures & Algorithms",
    // },
    // {
    //   id: 2,
    //   title: "Exercise",
    //   duration: "1 hour",
    //   description: "Morning workout session",
    // },
    // {
    //   id: 3,
    //   title: "Break",
    //   duration: "30 minutes",
    //   description: "Relax and refresh",
    // },
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/main/fetch');
        if (response.data) {
          setData(response.data);
        } else {
          console.log('There was an error fetching data');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <h1>Study using the Pomodoro Technique</h1>
      <p>
        So this is a ridiculous project as specified in the question... I find
        it extremely hilarious how people use this app and grow in their life
        and career.
      </p>
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
