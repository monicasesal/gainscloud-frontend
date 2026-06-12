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
        <nav className="navbar">
                {/* logotipo a la izquierda */}
                <div className="navbar-logo" onClick={() => navigate('/')}>
                    <img src={logoImg} alt="GainsCloud Logo" />
                    <span className="logo-text">GainsCloud</span>
                </div>

                {/*Botones de navegación principales*/}
                <div className="navbar-links">
                    <button onClick={() => navigate('/')} className="nav-btn">
                        🏠 Home
                    </button>
                    <button onClick={() => navigate('/history')} className="nav-btn">
                        📜 Historial
                    </button>
                    <button onClick={() => navigate('/coach')} className='nav-btn nav-btn-coach'>
                        🤖 Coach IA
                    </button>
                </div>

                {/*Acciones del usuario*/}
                <div className="navbar-user">
                    <button onClick={() => navigate('/perfil')} className="nav-btn">
                        👤 Perfil
                    </button>
                    <button onClick={handleLogout} className="nav-btn btn-logout-nav">
                        🚪 Salir
                    </button>
                </div>
            </nav>    
    )
}