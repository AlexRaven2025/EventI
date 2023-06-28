import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from '../axios';
import './sign_up.css';
import './loginform';

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,15}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,15}$/;

export const SignUp = () => {
  const userRef = useRef();
  const errRef = userRef;

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [PWD, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [vaildMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');

  const navigate = useNavigate(); // Use useNavigate to get the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(PWD);
    if (!v1 || !v2) {
      setErrMsg('Invalid Entry');
      return;
    }
    try {
      const response = await axios.post('/users', {
        username: user,
        password: PWD,
      });
      // Handle the response as needed
      console.log(response.data);
      navigate('/'); // Navigate to '/home' after successful signup
    } catch (err) {
      // Handle any errors
      console.log(err);
    }
  };

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const results = USER_REGEX.test(user);
    console.log(results);
    console.log(user);
    setValidName(results);
  }, [user]);

  useEffect(() => {
    const results = PWD_REGEX.test(PWD);
    console.log(results);
    console.log(PWD);
    setValidPwd(results);
    const match = PWD === matchPwd;
    setValidMatch(match);
  }, [PWD, matchPwd]);

  useEffect(() => {
    setErrMsg('');
  }, [user, PWD, matchPwd]);

  const [isChecked, setIsChecked] = useState(false);
  const handleClick = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="sign-up-container">
      <div className="Cover">
        <form onSubmit={handleSubmit}>
          <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">
            {errMsg}
          </p>
          <h1>Register</h1>
          <label htmlFor="Username">Username:</label>
          <input
            type="text"
            id="Username"
            className="userName-box"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setUser(e.target.value)}
            value={user}
            onFocus={() => setUserFocus(true)}
            onBlur={() => setUserFocus(false)}
            aria-invalid={!validName}
            aria-describedby="username-error"
          />
          {userFocus && (
            <p id="username-error" className={!validName ? 'show' : 'offscreen'}>
              Username must be 4-15 characters long and start with a letter. Allowed characters are
              letters, numbers, hyphens, and underscores.
            </p>
          )}
          <label htmlFor="Password">Password:</label>
          <input
            type="password"
            id="Password"
            className="password-box"
            autoComplete="off"
            onChange={(e) => setPwd(e.target.value)}
            value={PWD}
            onFocus={() => setPwdFocus(true)}
            onBlur={() => setPwdFocus(false)}
            aria-invalid={!validPwd}
            aria-describedby="password-error"
          />
          {pwdFocus && (
            <p id="password-error" className={!validPwd ? 'show' : 'offscreen'}>
              Password must be 8-15 characters long and contain at least one lowercase letter, one
              uppercase letter, and one number.
            </p>
          )}
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input
            type="password"
            id="confirm-password"
            className="password-box"
            autoComplete="off"
            onChange={(e) => setMatchPwd(e.target.value)}
            value={matchPwd}
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}
            aria-invalid={!vaildMatch}
            aria-describedby="match-password-error"
          />
          {matchFocus && (
            <p id="match-password-error" className={!vaildMatch ? 'show' : 'offscreen'}>
              Passwords must match.
            </p>
          )}
          <div className="terms-container">
            <input
              type="checkbox"
              id="terms"
              className={`terms-box ${isChecked ? 'checked' : ''}`}
              onClick={handleClick}
            />
            <label htmlFor="terms">I agree to the terms and conditions.</label>
          </div>
          <button type="submit" className="signup-button" disabled={!isChecked}>
            Sign Up
          </button>
        </form>
        <p className="login">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};
