import React from 'react'
import {useNavigate} from 'react-router-dom'
import {authService, workoutService} from '../services/api'
import './Dashboard.css'

export default function Dashboard() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user')) || {username: 'Atleta'}

    const handleLogout = () => {
        authService.logout()
        navigate('/login')
    }

    const handleStartEmptyWorkout = async () => {
        try {
            //Llamar al servicio (flujo B: entrenamiento libre con null)
            const data = await workoutService.startWorkout(null)

            //Una vez creado en el back, viajamos a la pantalla de entrenamiento en vivo
            //pasándole el ID que nos la devuelto la base de datos
            navigate(`/workout/${data.workoutLogId}`)
        } catch (error) {
            alert('Error al iniciar el entrenamiento: ' + error.message)
        }
    }

    return(
        <div className='dashboard-container'>
            <div className='dashboard-header'>
                <h2>Hola, {user.username}</h2>
                
                <div className='dashboard-actions' style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                    {/* Botón Principal: Entrenar */}
                    <button onClick={handleStartEmptyWorkout} className='btn-primary'>
                        💪 Empezar Entrenamiento Vacío
                    </button>

                    {/* BOTÓN Ir al Historial */}
                    <button onClick={() => navigate('/history')} className='btn-secondary' style={{ background: '#2d2d35', color: '#fff', border: '1px solid #4edf7e' }}>
                        📚 Ver mi Historial
                    </button>

                    {/* BOTÓN Cerrar Sesión */}
                    <button onClick={handleLogout} className='btn-logout' style={{ background: 'transparent', color: '#ff4d4d', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    )
}