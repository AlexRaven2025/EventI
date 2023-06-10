import React, { useState } from "react";
import './loginform.css'

const LoginForm = () => {
    const [popupStyle, showPopup] = useState('hide')
    const popup = () => {
        showPopup('login-popup')
        setTimeout(() => showPopup("hide"), 3000)
    }
    return (
            <div className="page">
                <div className="cover">
                    <h1>Login</h1>
                    <input type='text' placeholder="Username"/>
                    <input type='password' placeholder="Password"/>

                    <div className="login-btn" onClick={popup}>Login</div>

                    <p className="text">Or login using</p>

                    <div className="alt-login">
                        <div className="facebook"></div>
                        <div className="gmail"></div>
                    </div>

                    <div className={popupStyle}>
                        <h3>Login Failed</h3>
                        <p>Username or Password Incorrect</p>
                    </div>

                </div>
            </div>
    )
}
export default LoginForm;