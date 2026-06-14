import React, {useEffect, useState} from 'react'
import ReactMarkdown from 'react-markdown'
import {getCoachFeedback} from '../services/api'
import {useNavigate} from 'react-router-dom'

import './Coach.css'

const Coach = () => {
    const [feedback, setFeedback] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [userPlan, setUserPlan] = useState('free')

    const navigate = useNavigate()

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            const userObj = JSON.parse(storedUser)
            setUserPlan(userObj.plan_type || 'free')
        }
    }, [])

    const consultarCoach = async () => {
        setLoading(true)
        setError('')
        setFeedback('')

        try {
            const data = await getCoachFeedback()
            setFeedback(data.feedback)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="coach-container">
            <div className="coach-card">
                <div className="coach-header">
                    <span className="coach-icon">🤖</span>
                    <h2 className="coach-title">GainsCloud Ciber-Coach</h2>
                </div>

                <button onClick={() => navigate('/suscripcion')} className='btn-go-to-subscription'>
                    ⚙️ Gestionar Mi Plan
                </button>
                
                <p className="coach-subtitle">
                    Tu entrenador personal con IA. Analizaré tus últimas series y entrenamientos guardados en la base de datos para darte un informe de rendimiento y consejos.
                </p>

                {userPlan === 'free' ? (
                    <div className='premium-lock-container'>
                        <div className='lock-icon'>🔒</div>
                        <h3>Función exclusiva Premium</h3>
                        <p>Desbloquea el Ciber-Coach de Inteligencia Artificial para recibir análisis avanzados y consejos personalizados según tus entrenamientos.</p>
                        <button onClick={() => navigate('/suscripcion')} className="unlock-premium-btn">
                            Hacerse Premium para desbloquear la IA
                        </button>
                    </div>
                ) : (
                    <>
                        <button 
                            onClick={consultarCoach} 
                            disabled={loading} 
                            className={`coach-button ${loading ? 'coach-button-disabled' : ''}`}
                        >
                            {loading ? 'Analizando tus series... ' : 'Generar Informe de Rendimiento'}
                        </button>
        
                        {error && (
                            <div className="coach-error-container">
                                <p className="coach-error-text">⚠️ {error}</p>
                            </div>
                        )}
        
                        {feedback && (
                            <div className='coach-feedback-container'>
                                <h3 className='coach-feedback-title'>Informe del Coach:</h3>
                                <div className='coach-feedback-text'>
                                <ReactMarkdown>{feedback}</ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Coach