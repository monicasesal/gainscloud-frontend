import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {authService} from '../services/api'
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
        <div className='login-container'>
            <div className='login-card'>
                <h2 className='login-title'>¡Bienvenido de vuelta!</h2>
                <p className='login-subtitle'>Ingresa tus datos para registrar tus entrenamientos</p>

                {error && <div className='error-message'>{error}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor="email">Correo Electrónico</label>
                        <input 
                            type="email"
                            id="email"
                            className='form-input'
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
                            className='form-input'
                            placeholder='••••••••'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} required
                        />
                    </div>

                    <button type="submit" className='login-button' disabled={loading}>
                        {loading ? 'Iniciando sesión...' : 'Entrar'}
                    </button>
                    
                </form>
            </div>
        </div>
    )
}