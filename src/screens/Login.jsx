import React, {useState} from 'react'
import {authService} from '../services/api'
import {useNavigate, Link} from 'react-router-dom'
import './Login.css'

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            //Llamar al servicio de login del backend
            await authService.login(email, password)

            //Redirección - te lleva al dashboard instantáneamente
            navigate('/dashboard', {replace:true})

        } catch (error) {
            setError(error.message || 'Ocurrió un error inesperado')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='auth-container'>
            <div className='auth-form'>
                <h2>¡Bienvenido de vuelta!</h2>
                <p className='login-subtitle'>Ingresa tus datos para registrar tus entrenamientos</p>

                {error && <div className='error-msg'>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor="email">Correo Electrónico</label>
                        <input 
                            type="email"
                            id="email"
                            placeholder='tu@correo.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} required
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor="password">Contraseña</label>
                        <input 
                            type="password" 
                            id="password"
                            placeholder='••••••••'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} required
                        />
                    </div>

                    <button type="submit" className='btn-auth' disabled={loading}>
                        {loading ? 'Iniciando sesión...' : 'Entrar'}
                    </button>

                    <p className="auth-switch">
                        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}