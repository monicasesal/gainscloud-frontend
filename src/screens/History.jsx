import React, {useEffect, useState} from 'react'
import {workoutService} from '../services/api'
import './History.css'

export default function History() {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchHistory = async() => {
            try {
                const data = await workoutService.getHistory()
                setHistory(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchHistory()
    }, [])

    //función auxiliar para formatear la fecha
    const formatDate = (dateString) => {
        const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
        return new Date(dateString).toLocaleDateString('es-ES', options)
    }

    //calcular la duración del entrenamiento en mins
    const getDuration = (start, end) => {
        const diff = new Date(end) - new Date(start)
        return Math.round(diff / 60000) // Milisegundos a minutos
  }

    const handleDeleteWorkout = async (workoutId) => {
        const confirmDelete = window.confirm('¿Seguro que quieres eliminar este entrenamiento por completo? No se puede deshacer')
        if (!confirmDelete) return

        try {
            await workoutService.deleteWorkout(workoutId)

            setHistory(prevHistory => prevHistory.filter(w=> w.id !== workoutId))
            alert('Entrenamiento eliminado correctamente')

        } catch (error) {
            console.error('Error al borrar entrenamiento', error)
            alert('No se pudo eliminar' + error.message)
        }
    }

    if (loading) return <div className="history-center"><div className="spinner"></div></div>
    if (error) return <div className="history-center error-msg">Error: {error}</div>

    return (
        <div className='history-container'>
            <h2 className='history-title'>Mi historial de Progresos</h2>

            {history.length === 0 ? (
                <div className='no-history'>
                    <p>Aún no has guardado ningún entrenamiento. ¡Hora de romper los límites en el gimnasio!</p>
                </div>
            ) : (
                <div className='history-list'>
                    {history.map((workout) => (
                        <div key={workout.id} className='history-card'>
                            <div className='history-card-header'>
                                <div>
                                    <h3 className="history-date">{formatDate(workout.end_time)}</h3>
                                    <span className="history-duration">⏱️ Duración: {getDuration(workout.start_time, workout.end_time)} min</span>
                                </div>
                                <div className='history-header-actions'>
                                    <span className="history-badge">Completado</span>
                                    <button
                                        onClick={() => handleDeleteWorkout(workout.id)}
                                        className='btn-delete-workout'
                                        title='Eliminar este entrenamiento'
                                    >
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            </div>

                            <div className='history-card-body'>
                                {workout.exercises.map((ex, i) => (
                                    <div key={i} className='history-exercise-row'>
                                        <h4>{ex.name}</h4>
                                        <div className='history-sets-chips'>
                                            {ex.sets.map((set, si) => (
                                                <span key={si} className={`set-chip ${set.is_completed ? 'success' : ''}`}>
                                                S{si + 1}: <strong>{set.weight}kg</strong> x {set.reps} 
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}