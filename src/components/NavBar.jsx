import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import logoImg from '../assets/logo.png'
import './Navbar.css'

export default function NavBar() {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <nav className='app-navbar'>
            <div className='navbar-brand' onClick={() => navigate('/dashboard')}>
                <img src={logoImg} alt="GainsCloud logo" className='navbar-logo-img' />
                <p className='gainscloud-logo'>GainsCloud</p>
            </div>
            <div className='navbar-links'>
                <Link to='/dashboard' className='nav-link'>🏠 Home</Link>
                <Link to='/history' className='nav-link'>📜 Historial</Link>
                <button onClick={handleLogout} className='nav-logout'>🚪 Salir</button>
            </div>

        </nav>
    )
}