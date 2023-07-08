import React, { useEffect, useState } from 'react';
import './EventCreateForm.css';
import { getUserID } from "./localStorage.js";
const userID = getUserID();
export const EventCreateForm = () => {
  const [setEventList] = useState([]);

  useEffect(() => {
    fetchEventData();
  }, []);

  const fetchEventData = async () => {
    try {
      const response = await fetch('http://localhost:3000/users/profile', {
        headers: { user_id:  userID }
      });
      if (response.ok) {
        const data = await response.json();
        setEventList(data.events);
      } else {
        console.error('Failed to fetch event data');
      }
    } catch (error) {
      console.error('Error fetching event data:', error);
    }
  };

  return (
    <div className='EventCreateForm-container'>
      <label>Create A Event</label>
      <div className='input-container'>
        <input type='text' placeholder= 'Event Name' />
        <input type='text' placeholder= 'Event Description'/>
        <input type='text' placeholder= 'Event Location'/>
      </div>
        
      </div>
  );
}

export default EventCreateForm;
