import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profile.css';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { getUserID } from './localStorage.js';




export const Profile = () => {
  const [createdEvents, setCreatedEvents] = useState([]);
  const [rsvpedEvents, setRsvpedEvents] = useState([]);

  const userID = getUserID();
  console.log(userID);

  useEffect(() => {
    // Fetch user profile data
    axios
      .get('http://localhost:3000/users/profile', {
        headers: { user_id: userID },
      })
      .then((response) => {
        setCreatedEvents(response.data.events);
        setRsvpedEvents(response.data.rsvped_events);
        console.log(response.data.events,response.data.rsvped_events);
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error);
      });
  }, [userID]);

  return (
    <div className="profile-container">
      <div className='sideBar-container'>
        <div className="button-container1">
            <Link to="/EventCreateForm/?userID=verified&events">
            <Button variant="secondary" size="lg" active='true'>Add Event</Button>
            </Link>
        </div>
        <div className="button-container2">
          <Button id="remove-button" size="lg" active='true'>Remove</Button>
        </div>
        <div className='button-container3'>
          <button id='signout-button' size='lg' active='true'>signout</button>  
        </div> 
      </div>
      <div className="Card-Container">
        <div className="table-container">
          <h2>Events Created</h2>
          <table>
            <thead>
              <tr>
                <th scope="col">Event Name</th>
                <th scope="col">Description</th>
                <th scope="col">Location</th>
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
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="table-container">
          <h2>Events RSVPed</h2>
          <table>
            <thead>
              <tr>
                <th scope="col">Event Name</th>
                <th scope="col">Description</th>
                <th scope="col">Location</th>
              </tr>
            </thead>
            <tbody>
              {/* Check if rsvpedEvents is defined and not null before mapping */}
              {rsvpedEvents &&
                rsvpedEvents.map((event) => (
                  <tr key={`rsvped_${event.id}`}>
                    <td>{event.event_name}</td>
                    <td>{event.event_description}</td>
                    <td>{event.event_location}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Profile;
