import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profile.css';
import Button from 'react-bootstrap/Button';
import { ProfileCard } from './Profile_event_card';
import { getUserID } from "./localStorage.js";
export const Profile = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const userID = getUserID();
  console.log(userID);

  useEffect(() => {
    // Fetch user profile data
    axios.get('http://localhost:3000/users/profile', {
      headers: { 'user_id': userID }
    })
      .then(response => {
        setUser(response.data.user);
        setEvents(response.data.events);
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
      });
  }, [userID]);

  const handleImageUpload = () => {
    const formData = new FormData();
    formData.append('image', selectedImage);

    // Make a POST request to the server to upload the image
    axios.post('http://localhost:3000/users/profile/image', formData, {
      headers: { 'user_id': userID} 
    })
      .then(response => {
        // Handle the response, e.g., update the user profile with the image URL
        console.log('Image uploaded successfully');
      })
      .catch(error => {
        console.error('Error uploading image:', error);
      });
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  return (
    <div className="profile-container">
      {user && (
        <div className="profile-image">
          <picture>
            <source srcSet={user.profileImage} type="image/svg+xml" />
            <img src={user.profileImage} className="img-fluid" alt="Profile" />
          </picture>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <Button variant="primary" onClick={handleImageUpload}>
            Upload Image
          </Button>
        </div>
      )}
      <div className="dash-links">
        <Button variant="primary" size="lg" active>
          Your Events
        </Button>{' '}
        <Button variant="secondary" size="lg" active>
          Add Events
        </Button>
      </div>
      <div className="profilCard-Container">
        <div className='profileCard'>
          <ProfileCard/>
        </div>
      </div>
    </div>
  );
};

export default Profile;
