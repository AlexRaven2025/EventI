import {useRef, useEffect,useState } from 'react';
import './/sign_up.css'
import { Link } from 'react-router-dom';
import  './loginform.js';
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

    const handlSubmit = async(e) => {
        e.preventDefault();
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(PWD);
        if (!v1 || !v2){
            setErrMsg("Invalid Entry");
            return;
        }
        console.log(user, PWD);
        
    }

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        const results = USER_REGEX.test(user);
        console.log(results);
        console.log(user);
        setValidName(results);
    }, [user])

        useEffect(() => {
        const results = PWD_REGEX.test(PWD);
        console.log(results);
        console.log(PWD);
        setValidPwd(results);
        const match = PWD === matchPwd;
        setValidMatch(match);
    }, [PWD, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, PWD, matchPwd])

    const [isChecked, setIsChecked] = useState(false);
    const handleClick =() =>{
        setIsChecked(!isChecked);
    }
    return (
        <div className="sign-up-container">
            <div className='Cover'>
                <form onSubmit={handlSubmit}>
                <p ref={errRef}className={errMsg ? "errmsg":"offscreen"} aria-live='assertive'>{errMsg}</p>
                    <h1>Register</h1>
                    <label htmlFor='Username'>Userame:</label>
                    <input 
                        type='text' 
                        id='Username'
                        className='userName-box' 
                        ref={userRef} 
                        autoComplete='off' 
                        onChange={(e) => setUser(e.target.value)} 
                        aria-invalid= {validName ? "false" : "true"}
                        aria-describedby='unidote'
                        onFocus={()=> setUserFocus(true)} 
                        onBlur={()=> setUserFocus(false)} 
                        required
                    />
                    <p id='uidnote' className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                        4 to 15 charcters.<br/>
                        Must begin with a letter.<br/>
                        Letters,numbers,underscores, hyphens allowed.
                    </p>
                    <label htmlFor='Password'>Password:</label>
                    <input 
                        type="password" 
                        className='password-box' 
                        id='password'
                        onChange={(e) => setPwd(e.target.value)} 
                        required
                        araia-invalid={validPwd ? "false" : "true"}
                        araia-describedby='pwdnote'
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}
                    />
                    <p id='pwdnote' className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                        8 to 5 charcters<br/>
                        Must include uppercase and lowercase letters, numbers and a special charcters<br/>
                        <span aria-label="exclamation mark">!</span>
                        <span aria-label='at symbol'>@</span>
                        <span aria-label='hastag'>#</span>
                        <span aria-label='dollar sign'>$</span>
                        <span aria-label='percent'>%</span>
                    </p>
                    <label htmlFor='confirm_pwd'>Confirm Password:</label>
                    <input 
                    type='password' 
                    className='email-box' 
                    id='confirm_pwd'
                    required 
                    autoComplete='off' 
                    onChange={(e) => setMatchPwd(e.target.value)}
                    aria-invalid={vaildMatch ? "false" : "true"}
                    aria-describedby='conformnote' 
                    onFocus={() => setMatchFocus(true)}
                    onBlur={() => setMatchFocus(false)}
                     />
                    <p id='confirmnote' className={matchFocus && !vaildMatch ? "instructions" : "offscreen"}> 
                        Must match the first password input field.
                    </p>

                    <div className="terms-container">
                      <button 
                      type="check" 
                      className={`terms-box ${isChecked ? 'checked' : ''}`}
                        onClick={handleClick}
                      />
                      <p>I agree to the terms of services</p>
                      
                    </div>
                    <button disabled={!validName || !validPwd || !vaildMatch ? true : false}>Sign Up</button>
                    <p>
                        Already registered?<br/>
                        <span className='line'><Link to='./loginform'>Login</Link></span>
                    </p>
                </form>
            </div>
        </div>
          
    )
}
export default SignUp;