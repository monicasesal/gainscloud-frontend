import React, {useState} from 'react'
import {getCoachFeedback} from '../services/api'
import './Coach.css'

const Coach = () => {
    const [feedback, setFeedback] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

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
                
                <p className="coach-subtitle">
                    Tu entrenador personal con IA. Analizaré tus últimas series y entrenamientos guardados en la base de datos para darte un informe de rendimiento y consejos.
                </p>

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
                    <div className="coach-feedback-container">
                        <h3 className="coach-feedback-title">Informe del Coach:</h3>
                        {feedback.split('\n').map((parrafo, index) => (
                            <p key={index} className="coach-feedback-paragraph">
                                {parrafo}
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Coach