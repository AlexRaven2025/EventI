import { useState } from 'react';
import './/sign_up.css'
export const SignUp = () => {
    const [isChecked, setIsChecked] = useState(false);
    const handleClick =() =>{
        setIsChecked(!isChecked);
    }
    return (
        <div className="sign-up-container">
            <div className='Cover'>
                    <h1>Sign Up</h1>
                    
                    <input type='text' className='userName-box' placeholder='Enter a UserName' />
                    <input type="password" className='password-box' placeholder='Enter a Password' />
                    <input type='text' className='email-box' placeholder='Enter you Email' />
                    <div className="terms-container">
                      <button 
                      type="check" 
                      className={`terms-box ${isChecked ? 'checked' : ''}`}
                        onClick={handleClick}
                      />
                      <p>I agree to the terms of services</p>
                      
                    </div>
                    <div className="login-Btn">Login</div>

                    <div className="Alt-login">
                        <div className="facebook"></div>
                        <div className="gmail"></div>
                    </div>
            </div>
        </div>
          
    )
}
export default SignUp;