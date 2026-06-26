import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService, userService } from '../services/api'
import './Perfil.css'

export default function Perfil() {
    const navigate = useNavigate()
    
    // Estados para los datos del usuario
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Estados para la edición del peso
    const [isEditing, setIsEditing] = useState(false)
    const [weightInput, setWeightInput] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    // Cargar los datos del perfil desde el Backend al montar el componente
    useEffect(() => {
        const loadProfileData = async () => {
            try {
                const data = await userService.getProfile()
                setProfile(data)
                setWeightInput(data.weight || '')
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        loadProfileData()
    }, [])

    const handleLogout = () => {
        authService.logout()
        navigate('/login')
    }

    const handleSaveWeight = async () => {
        if (!weightInput || isNaN(weightInput) || weightInput <= 0) {
            alert('Por favor, introduce un peso válido mayor que 0')
            return
        }

        try {
            setIsSaving(true)
            await userService.updateWeight(parseFloat(weightInput))
            
            // Actualizar el estado local para que se vea el cambio sin recargar la página
            setProfile(prev => ({ ...prev, weight: weightInput }))
            setIsEditing(false)
            alert('Peso corporal actualizado con éxito')
        } catch (err) {
            alert('Error al guardar el peso: ' + err.message)
        } finally {
            setIsSaving(false)
        }
    }

    // Formatear la fecha de registro (Miembro desde...)
    const formatMemberDate = (dateString) => {
        if (!dateString) return '2026'
        return new Date(dateString).toLocaleDateString('es-ES', {year: 'numeric', month: 'long'})
    }

    if (loading) return <div className="profile-center"><div className="spinner"></div></div>
    if (error) return <div className="profile-container"><div className="profile-card error-msg">Error: {error}</div></div>

    return (
        <div className="profile-container">
            <div className="profile-card">
                
                {/* Avatar con la inicial */}
                <div className="profile-avatar">
                    {profile?.username?.charAt(0).toUpperCase()}
                </div>
                
                <h2 className="profile-username">{profile?.username}</h2>
                <p className="profile-email">{profile?.email}</p>
                
                <hr className="profile-divider" />

                <div className="profile-stats-preview">
                    {/* Peso Corporal */}
                    <div className="preview-item-weight">
                        <span>Peso Corporal</span>
                        
                        {isEditing ? (
                            <div className="weight-edit-box">
                                <input 
                                    type="number" 
                                    min="0.1"
                                    value={weightInput}
                                    onChange={(e) => {
                                        const val = e.target.value
                                        
                                        if (parseFloat(val) < 0) {
                                            setWeightInput('0');
                                        } else {
                                            setWeightInput(val);
                                        }
                                    }}
                                    placeholder="ej: 75.5"
                                    step="0.1"
                                    className="profile-weight-input"
                                    disabled={isSaving}
                                />
                                <span className="unit-label">kg</span>
                                <button onClick={handleSaveWeight} className="btn-save-weight" disabled={isSaving}>
                                    {isSaving ? '...' : '✅'}
                                </button>
                                <button onClick={() => { setIsEditing(false); setWeightInput(profile.weight || ''); }} className="btn-cancel-weight" disabled={isSaving}>
                                    ❌
                                </button>
                            </div>
                        ) : (
                            <div className="weight-display-box">
                                <span className="preview-value">
                                    {profile?.weight ? `${profile.weight} kg` : '-- kg'}
                                </span>
                                <button onClick={() => setIsEditing(true)} className="btn-edit-weight-icon" title="Editar peso">
                                    ✏️
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="preview-item">
                        <span>Miembro desde</span>
                        <span className="preview-value-date">{formatMemberDate(profile?.created_at)}</span>
                    </div>
                </div>

                <button onClick={handleLogout} className="btn-profile-logout">
                    🚪 Cerrar Sesión
                </button>
            </div>
        </div>
    )
}