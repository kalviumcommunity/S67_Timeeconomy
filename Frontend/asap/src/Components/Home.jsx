import React from 'react'
import './Home.css'
import Timecard from './Timecard'

export const Home = () => {
  return (
<>
    <div>
        <h1>Welcome to my ASAP Project</h1><br/>

        <p>My project is based on the time managment and money saveing thing. We spend money in UPI and screen time in system/phone.<br/>. In my project, this helps in saving money in UPI and reducing screen time and focus on studying for the people who are lazy even though there is lot of things.
This will be intreactive type of things such that even the lazy people do not hate in this.<br/>
Project Overview: This project will make the lazy people to save the money and scrolling phone in social media. This helps them to manage the money and also manage their work their work easier.

Key Features: It has a timer, if the user starts the timer, the timer will start and as soon as the time reaches nearest to the time that the user has set, it will send a notification to the user.<br/> As soon as the timer stops the mobile will stop the screen time and the user will get a notification that the time is over. And also the user can set the focus mode for this much hour so that he can focus on work.<br/> There will be a emergency call so that he can select the contact so that if there is any emergency only the seletced contact can call him.</p>
    <Timecard />
    </div>
</>

)

}

