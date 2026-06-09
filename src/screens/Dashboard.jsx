import React, {useEffect, useEffectEvent, useState} from 'react'
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

    const [stats, setStats] = useState({totalWorkouts: 0, totalVolume: 0, activeWorkoutId: null})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const data = await workoutService.getStats()
                setStats(data)
            } catch (error) {
                console.error("Error al cargar las estadísticas del dashboard:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchDashboardStats()
    }, [])

    return(
        <div className='dashboard-container'>

            {/*BANNER DE REANUDACIÓN*/}
            {!loading && stats.activeWorkoutId && (
                <div className="resume-banner animate-pulse-border">
                    <div className="banner-content">
                        <span className="banner-icon">⚠️</span>
                        <div>
                            <h4>¡Tienes un entrenamiento a medias!</h4>
                            <p>No dejes a medias tu progreso de hoy. Reanuda la sesión donde la dejaste.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate(`/workout/${stats.activeWorkoutId}`)}
                        className='btn-banner-resume'>
                        Reanudar sesión activa
                    </button>
                </div>
            )}
            <header className='dashboard-header'>
                <div className='header-text'>
                    <h2>Hola, {user.username}</h2>
                    <p>Tu progreso habla por sí solo. ¡No faltes hoy!</p>
                </div>
                    
                <div className='dashboard-actions'>
                    {/* Botón Principal: Entrenar */}
                    <button onClick={handleStartEmptyWorkout} className='btn-start-workout'>
                        💪 Empezar Entrenamiento Vacío
                    </button>

                    {/* BOTÓN Ir al Historial y Cerrar Sesión */}
                    <button onClick={() => navigate('/history')} className='btn-history-inline'>
                        📚 Ver mi Historial
                    </button>

                    <button onClick={handleLogout} className='btn-logout-inline'>
                        Cerrar Sesión
                    </button>
                </div>
            </header>

            {/*Sección de estadísticas premium*/}
            <section className='stats-grid'>
                <div className='stat-card'>
                    <span className='stat-icon'>🏋️‍♂️</span>
                    <h3>Sesiones este mes</h3>
                    <p className='stat-number'>{loading ? '...' : stats.totalWorkouts}</p>
                </div>

                <div className='stat-card'>
                    <span className='stat-icon'>🔥</span>
                    <h3>Volumen del mes</h3>
                    <p className='stat-number'>{loading ? '...' : `${stats.totalVolume.toLocaleString()} kg`}</p>
                </div>
            </section>

        </div>
    )
}