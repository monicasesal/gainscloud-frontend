import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { workoutService } from '../services/api'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js'
import {Line} from 'react-chartjs-2'
import './History.css'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
)

export default function History() {
    const navigate = useNavigate()
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [chartData, setChartData] = useState([]) //almacena datos del gráfico

    //Efecto para cargar el Historial de entrenamientos
    useEffect(() => {
        const fetchHistory = async () => {
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

    // Cargar los datos para la gráfica de progresión
    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const data = await workoutService.getVolumeProgression()
                setChartData(data)
            } catch (error) {
                console.error("Error al cargar datos del gráfico:", error)
            }
        }
        fetchChartData()
    }, [])

    //Función auxiliar para formatear la fecha
    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
        return new Date(dateString).toLocaleDateString('es-ES', options)
    }

    // Calcular la duración del entrenamiento en mins
    const getDuration = (start, end) => {
        if (!end) return null 
        const diff = new Date(end) - new Date(start)
        return Math.round(diff / 60000)
    }

    const handleDeleteWorkout = async (workoutId) => {
        const confirmDelete = window.confirm('¿Seguro que quieres eliminar este entrenamiento por completo? No se puede deshacer')
        if (!confirmDelete) return

        try {
            await workoutService.deleteWorkout(workoutId)
            setHistory(prevHistory => prevHistory.filter(w => w.id !== workoutId))
            alert('Entrenamiento eliminado correctamente')
        } catch (error) {
            console.error('Error al borrar entrenamiento', error)
            alert('No se pudo eliminar: ' + error.message)
        }
    }

    if (loading) return <div className="history-center"><div className="spinner"></div></div>
    if (error) return <div className="history-center error-msg">Error: {error}</div>

    // Configuración de Datos para Chart.js
    const dataGrafico = {
        labels: chartData.map(d => d.fecha),
        datasets: [
            {
                fill: true,
                label: 'Volumen Total (kg)',
                data: chartData.map(d => d.volumenTotal),
                borderColor: '#4edf7e',
                backgroundColor: (context) => {
                    const chart = context.chart
                    const { ctx, chartArea } = chart
                    if (!chartArea) return null
                    
                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
                    gradient.addColorStop(0, 'rgba(78, 223, 126, 0.4)')
                    gradient.addColorStop(1, 'rgba(78, 223, 126, 0.0)')
                    return gradient
                },
                tension: 0.3,
                pointBackgroundColor: '#4edf7e',
                pointBorderColor: '#1e1e24',
                pointHoverRadius: 6,
            },
        ],
    }

    const opcionesGrafico = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#25252d',
                titleColor: '#fff',
                bodyColor: '#4edf7e',
                borderColor: '#2d2d35',
                borderWidth: 1,
                padding: 10,
                displayColors: false
            }
        },
        scales: {
            x: {
                grid: {display: false},
                ticks: {color: '#a0a0ab', font: {size: 12}}
            },
            y: {
                grid: {color: '#2d2d35'},
                ticks: {color: '#a0a0ab', font: {size: 12}}
            }
        }
    }

    return (
        <div className='history-container'>
            <h2 className='history-title'>Mi historial de Progresos</h2>

            {/* Gráfico de evolución */}
            {chartData.length > 0 && (
                <div className="analytics-card">
                    <h3 className="analytics-card-title">📈 Evolución del Volumen Total (kg)</h3>
                    <p className="analytics-card-subtitle">Suma total de carga levantada por sesión (Peso x Reps x Series)</p>
                    
                    <div style={{width: '100%', height: 220}}>
                        <Line data={dataGrafico} options={opcionesGrafico} />
                    </div>
                </div>
            )}

            {history.length === 0 ? (
                <div className='no-history'>
                    <p>Aún no has guardado ningún entrenamiento. ¡Hora de romper los límites en el gimnasio!</p>
                </div>
            ) : (
                <div className='history-list'>
                    {history.map((workout) => {
                        const isInProgress = workout.status === 'in progress'

                        return (
                            <div key={workout.id} className={`history-card ${isInProgress ? 'card-in-progress' : ''}`}>
                                <div className='history-card-header'>
                                    <div>
                                        <h3 className="history-date">{formatDate(isInProgress ? workout.start_time : workout.end_time)}</h3>
                                        {isInProgress ? (
                                            <span className="history-duration live-pulse">🔴 Sesión activa en segundo plano</span>
                                        ) : (
                                            <span className="history-duration">⏱️ Duración: {getDuration(workout.start_time, workout.end_time)} min</span>
                                        )}
                                    </div>

                                    <div className='history-header-actions'>
                                        {isInProgress ? (
                                            <>
                                                <span className="history-badge badge-progress">En Proceso</span>
                                                <button 
                                                    onClick={() => navigate(`/workout/${workout.id}`)}
                                                    className="btn-resume-workout"
                                                >
                                                    Reanudar
                                                </button>
                                            </>
                                        ) : (
                                            <span className="history-badge">Completado</span>
                                        )}    

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
                                    {workout.exercises.length === 0 ? (
                                        <p style={{ color: 'var(--texto-gris)', fontSize: '14px', margin: 0 }}>
                                            No hay ejercicios apuntados en esta sesión todavía.
                                        </p>
                                    ) : (
                                        workout.exercises.map((ex, i) => (
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
                                        ))
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}