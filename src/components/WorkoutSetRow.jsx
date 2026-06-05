//La fila de cada serie: peso, repes, check de completado

import React from 'react'
import './WorkoutSetRow.css'

export default function WorkoutSetRow({set, index, onUpdateSet, onDeleteSet}) {
    const handleChange = (field, value) => {
        onUpdateSet(set.id, {[field]: value})
    }

    return (
        <div className='set-row-container'>
            {/*Número de serie*/}
            <span className='set-number'>{index + 1}</span>

            {/*Input de peso*/}
            <div className='set-input-group'>
                <input 
                    type="number" 
                    placeholder='0'
                    value={set.weight || ''}
                    onChange={(e) => handleChange('weight', parseFloat(e.target.value) || 0)}
                    className='set-input'
                />
                <span className='set-unit'>kg</span>
            </div>

            {/*Input de repeticiones*/}
            <div className='set-input-group'>
                <input 
                    type="number" 
                    placeholder='0'
                    value={set.reps || ''}
                    onChange={(e) => handleChange('reps', parseInt(e.target.value) || 0)}
                    className='set-input'
                />
                <span className='set-unit '>reps</span>
            </div>

            {/*Botón de completado dinámico por clase*/}
            <button
                onClick={() => handleChange('isCompleted', !set.isCompleted)}
                className={`btn-check-set ${set.isCompleted ? 'completed' : 'pending'}`}
            >
                {set.isCompleted ? '✓' : '◯'}
            </button>

            {/*Botón de eliminar serie*/}
            <button onClick={() => onDeleteSet(set.id)} className='btn-delete-set'>
                🗑️
            </button>
        </div>
    )
}