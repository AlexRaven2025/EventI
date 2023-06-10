import React from 'react'
import { Link } from 'react-router-dom'
import './navbar.css'
export const NavBar = () => {
  return (
    <nav>
        <Link to='/'>home</Link>
        <Link to='/Login'>login</Link>
        <div className='Logo'><h1>EI</h1></div>
    </nav>
  )
}

