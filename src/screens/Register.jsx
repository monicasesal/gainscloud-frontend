import React, {useState} from 'react'
import {authService} from '../services/api'
import {useNavigate, Link} from 'react-router-dom'
import './Login.css'

export default function Registro() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            await authService.register(username, email, password)
            setSuccess(true)
            setTimeout(() => {
                navigate('/login')
            }, 2000);
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Crear Cuenta en GainsCloud</h2>
                
                {error && <p className="error-msg">{error}</p>}
                {success && <p className="success-msg">¡Cuenta creada con éxito! Redirigiendo...</p>}

                <div className="form-group">
                    <label>Nombre de usuario</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>Contraseña</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>

                <button type="submit" className="btn-auth">Registrarme</button>
                
                <p className="auth-switch">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
                </p>
            </form>
        </div>
    )
}