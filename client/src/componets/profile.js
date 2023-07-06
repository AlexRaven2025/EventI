import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profile.css';
import Button from 'react-bootstrap/Button';
import { getUserID } from './localStorage.js';

export const Profile = () => {
  const [user, setUser] = useState(null);
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
        setUser(response.data.user);
        setCreatedEvents(response.data.createdEvents);
        setRsvpedEvents(response.data.rsvpedEvents);
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error);
      });
  }, [userID]);

  return (
    <div className="profile-container">
      <div className="dash-links">
        <Button variant="secondary" size="lg" active>
          Add A Event
        </Button>
      </div>
      <div className="Card-Container">
        <div className="table-container">
          <h2>Events Created</h2>
          <table>
            <thead>
              <tr>
                <th scope="col">Color</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Turtle</th>
              </tr>
            </thead>
            <tbody>
              {/* Render rows for createdEvents */}
              {createdEvents.map((event) => (
                <tr key={event.id}>
                  <td>{event.color}</td>
                  <td>{event.first}</td>
                  <td>{event.last}</td>
                  <td>{event.turtle}</td>
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
                <th scope="col">Color</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Turtle</th>
              </tr>
            </thead>
            <tbody>
              {/* Render rows for rsvpedEvents */}
              {rsvpedEvents.map((event) => (
                <tr key={event.id}>
                  <td>{event.color}</td>
                  <td>{event.first}</td>
                  <td>{event.last}</td>
                  <td>{event.turtle}</td>
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
