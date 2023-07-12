import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import { getUserID } from './localStorage.js';

export const NavBar = () => {
  const userID = getUserID();
  console.log({user: userID});

  return (
    <nav>
      <Link to='/'>home</Link>
      {!userID && <Link to='/Login'>login</Link>}
      {userID ? <Link to='/profile'>profile</Link> : null}
      <div className='Logo'><h1>EI</h1></div>
    </nav>
  );
};
