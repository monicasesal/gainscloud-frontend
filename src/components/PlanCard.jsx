import React from 'react'

export default function PlanCard({type, title, price, features, isCurrent, loading, onPlanSelect}) {
    //texto del botón según el estado del plan
    const getButtonText = () => {
        if (loading) {
            return type === 'premium' ? 'Conectando con banco...' : 'Procesando...'
        }
        if (isCurrent) {
            return type === 'premium' ? 'Disfrutando Premium' : 'Activo'
        }
        return type === 'premium' ? 'Hacerme Premium' : 'Volver a Free'
    }

    return (
        <div className={`pricing-card ${type === 'premium' ? 'premium-card' : ''} ${isCurrent ? 'active' : ''}`}>
            {isCurrent && (
                <span className={`badge-current ${type === 'premium' ? 'gold' : ''}`}>
                    Tu Plan Actual
                </span>
            )}
            
            <h3>{title}</h3>
            <p className="price">{price}</p>
            
            <ul>
                {features.map((feature) => (
                    <li key={feature.id}>{feature.text}</li>
                ))}
            </ul>
            
            <button 
                disabled={loading || isCurrent}
                onClick={() => onPlanSelect(type)}
                className={`btn-plan ${type === 'free' ? 'free-btn' : 'premium-btn'}`}
            >
                {getButtonText()}
            </button>
        </div>
    )
}