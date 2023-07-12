import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profile.css';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { getUserID } from './localStorage.js';

export const Profile = () => {
  const [createdEvents, setCreatedEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);

  const handleEventSelection = (eventId) => {
    setSelectedEvents((prevSelectedEvents) => {
      const updatedSelectedEvents = prevSelectedEvents.includes(eventId)
        ? prevSelectedEvents.filter((id) => id !== eventId)
        : [...prevSelectedEvents, eventId];
      return updatedSelectedEvents;
    });
  };

  const handleRemoveEvents = () => {
    if (selectedEvents.length === 0) {
      console.log('No events selected');
      return;
    }

    axios
      .delete('http://localhost:3000/users/profile/remove', {
        headers: { user_id: userID },
        data: { eventIDs: selectedEvents },
      })
      .then((response) => {
        if (response.status === 200) {
          // Handle successful removal
          console.log('Events removed successfully');
          // Refresh the page
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error('Error removing events:', error);
      });
  };

  const userID = getUserID();
  console.log(userID);

  const signOut = () => {
    axios
      .post(
        'http://localhost:3000/users/profile/signout',
        { eventIDs: selectedEvents },
        {
          headers: {
            user_id: userID,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          // Event created successfully, perform necessary actions
          localStorage.clear();
          window.location.href = 'http://localhost:3001/';
        } else {
          console.error('Failed to create event');
        }
      })
      .catch((error) => {
        console.error('Error creating event:', error);
      });
  };

  useEffect(() => {
    // Fetch user profile data
    axios
      .get('http://localhost:3000/users/profile', {
        headers: { user_id: userID },
      })
      .then((response) => {
        setCreatedEvents(response.data.events);
        console.log(response.data.events);
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error);
      });
  }, [userID]);

  return (
    <div className="profile-container">
      <div className="sideBar-containers">
        <div className="button-container1">
          <Link to="/EventCreateForm/">
            <Button id="addEvent" variant="secondary" size="lg" active="true">
              Add Event
            </Button>
          </Link>
        </div>
        <div className="button-container2">
          <Button id="remove-button" size="lg" active="true" onClick={handleRemoveEvents}>
            Remove
          </Button>
        </div>
        <div className="button-container3">
          <button id="signout-button" size="lg" active="true" onClick={signOut}>
            signout
          </button>
        </div>
      </div>
      <div className="Card-Containers">
        <div className="table-containers">
          <h2>Events Created</h2>
          <table>
            <thead>
              <tr>
                <th scope="col">Select</th>
                <th scope="col">Event Name</th>
                <th scope="col">Description</th>
                <th scope="col">Location</th>
                <th scope="col">Time</th>
              </tr>
            </thead>
            <tbody>
              {/* Check if createdEvents is defined and not null before mapping */}
              {createdEvents &&
                createdEvents.map((event, index) => (
                  <tr key={`createdEvents_${index}`}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(event.event_id)}
                        onChange={() => handleEventSelection(event.event_id)}
                      />
                    </td>
                    <td>{event.event_name}</td>
                    <td>{event.event_description}</td>
                    <td>{event.event_location}</td>
                    <td>{event.event_time}</td>
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
