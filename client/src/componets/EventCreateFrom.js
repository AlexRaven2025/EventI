import React, { useEffect, useState } from 'react';
import './EventCreateForm.css';
import { getUserID } from "./localStorage.js";
const userID = getUserID();
export const EventCreateFrom = () => {
  const [eventList, setEventList] = useState([]);

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
      <div className='CreateEventForm'>
        <form>
          <div className="mb-3">
            <label htmlFor="event_name" className="form-label">Enter Event Name</label>
            <textarea className="form-control" name="event_name" id="event_name" rows="3"></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Create Event</button>
        </form>
      </div>

      <div className="EventList">
        <h2>My Events</h2>
        {eventList.map((event) => (
          <div key={event.event_id} className="EventCard">
            <h3>{event.event_name}</h3>
            {/* Display other event details as needed */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventCreateFrom;
