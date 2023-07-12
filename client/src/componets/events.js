import './events.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUserID } from './localStorage.js';
export const Events = () => {
    const [createdEvents, setCreatedEvents] = useState([]);
    const userID = getUserID();
    console.log(userID);
    useEffect(() => {
    // Fetch user profile data
    axios
      .get('http://localhost:3000/users/explore')
      .then((response) => {
        setCreatedEvents(response.data.events);
        console.log(response.data.events);
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error);
      });
  }, [userID]);
    return (
        <div className='main-container'>
            <div className='table-events-container'>
                <div className='top-cover'>
                    <div className='local-Events-top-cover'>
                        <h1>Events</h1>
                    </div>
                        <div className='local-Event-decription'>
                         <div className="table-container">
          <h2>Events Created</h2>
          <table>
            <thead>
              <tr>
                <th scope="col">Event Name</th>
                <th scope="col">Description</th>
                <th scope="col">Location</th>
                <th scope="col">Time</th>
              </tr>
            </thead>
            <tbody>
              {/* Check if createdEvents is defined and not null before mapping */}
              {createdEvents &&
                createdEvents.map((event) => (
                  <tr key={`createdEvents_${event.id}`}>
                    <td>{event.event_name}</td>
                    <td>{event.event_description}</td>
                    <td>{event.event_location}</td>
                    <td>{event.event_time}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="table-container">
                        </div>
                        
                        </div>
                    </div>
            </div>


            <footer className="footer">
            <p>&copy; {new Date().getFullYear()} Eventi. All rights reserved.</p>
            </footer>
        </div>
    );
}
export default Events;