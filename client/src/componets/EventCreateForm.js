import React, { useState } from 'react';
import './EventCreateForm.css';
import axios from 'axios';
import { getUserID } from "./localStorage.js";

export const EventCreateForm = () => {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [createFailed, setCreateFailed] = useState(false);

  const createEvent = () => {
    const userID = getUserID();
    const eventData = {
      name: eventName,
      description: eventDescription,
      location: eventLocation,
      time: eventTime,
    };

    axios
      .post('http://localhost:3000/users/profile/create', eventData, {
        headers: {
          user_id: userID,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          // Event created successfully, perform necessary actions
          window.location.href = 'http://localhost:3001/profile';
        } else {
          console.error('Failed to create event');
          setCreateFailed(true);
        }
      })
      .catch((error) => {
        console.error('Error creating event:', error);
      });
  };

  return (
    <div className='EventCreateForm-container'>
      <div className='input-field-container'>
        <div className='label-container'>
          <label className='event-label'>Create An Event</label>
        </div>
        <div className='input-container'>
          <input type='text' id='eventName' placeholder='Event Name' onChange={e => setEventName(e.target.value)} />
          <input type='text' id='eventDescription' placeholder='Event Description' onChange={e => setEventDescription(e.target.value)} />
          <input type='text' id='eventLocation' placeholder='Event Location' onChange={e => setEventLocation(e.target.value)} />
          <input type='text' id='eventTime' placeholder='12:00 AM' onChange={e => setEventTime(e.target.value)} />
        </div>
        {createFailed && <div className='failedToCreate'>Failed to create event</div>}
        <button type='submit' onClick={createEvent}>Create</button>
      </div>
    </div>
  );
};

export default EventCreateForm;
