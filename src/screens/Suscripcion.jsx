import React, {useState, useEffect} from 'react'
import {authService} from '../services/api'
import PlanCard from '../components/PlanCard'
import './Suscripcion.css'

export default function Suscripcion() {
    const [currentPlan, setCurrentPlan] = useState('free')
    const [loading, setLoading] = useState(false)
    const [mensaje, setMensaje] = useState('')

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            const userObj = JSON.parse(storedUser)
            setCurrentPlan(userObj.plan_type || 'free')
        }
    }, [])

    const handlePlanChange = async (newPlan) => {
        let code = ''

        if (newPlan === 'premium') {
            code = prompt('Para testear el Plan Premium de demostración, introduce el código promocional.')

            if (code === null) return
            if (code.trim() === '') {
                setMensaje('Error: el código promocional es obligatorio para el plan Premium')
                return
            }
        } else {
            //si vuelve a free, pasar el código correcto por defecto para que el back no salte por el filtro de seguridad, ya que para bajar a free no necesito poner el código
            code = 'GAINSCLOUD2026'
        }

        setLoading(true)
        setMensaje('')

        try {
            //simular pago
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            const data = await authService.updatePlan(newPlan, code)

            setCurrentPlan(data.user.plan_type)
            setMensaje(`Ahora eres plan ${newPlan.toUpperCase()}`)
        } catch (err) {
            setMensaje(`Error: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    // características de los planes en arrays
    const freeFeatures = [
        {id: 'f1', text: '✅ Registro de entrenamientos'},
        {id: 'f2', text: '✅ Historial de series y cargas'},
        {id: 'f3', text: '✅ Gráficos avanzados de progresión'},
        {id: 'f4', text: '❌ Ciber-Coach con Inteligencia Artificial'}
    ]

    const premiumFeatures = [
        {id: 'p1', text: '✅ Todo lo del plan Básico'},
        {id: 'p2', text: '✅ GainsCloud Ciber-Coach IA ilimitado'},
        {id: 'p3', text: '✅ Consejos de sobrecarga progresiva'},
    ]

    return (
        <div className="pricing-container">
            <h2 className="pricing-title">Mejora tu rendimiento en GainsCloud</h2>
            <p className="pricing-subtitle">Gestiona tu suscripción simulada para testear la aplicación</p>

            {mensaje && (
                <div className={`pricing-alert ${mensaje.startsWith('Error') ? 'error' : ''}`}>
                    {mensaje}
                </div>
            )}

            <div className="pricing-cards">
                {/* Tarjeta Free */}
                <PlanCard 
                    type="free"
                    title="Plan Básico (FREE)"
                    price="0€"
                    features={freeFeatures}
                    isCurrent={currentPlan === 'free'}
                    loading={loading}
                    onPlanSelect={handlePlanChange}
                />

                {/* Tarjeta Premium */}
                <PlanCard 
                    type="premium"
                    title="Plan Pro (PREMIUM)"
                    price="9.99€ / mes"
                    features={premiumFeatures}
                    isCurrent={currentPlan === 'premium'}
                    loading={loading}
                    onPlanSelect={handlePlanChange}
                />
            </div>
        </div>
    )
}