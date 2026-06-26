//La fila de cada serie: peso, repes, check de completado

import React from 'react'
import './WorkoutSetRow.css'

export default function WorkoutSetRow({set, index, onUpdateSet, onDeleteSet}) {
    const handleChange = (field, value) => {
        if (field === 'weight' && value < 0) value = 0
        if (field === 'reps' && value < 0) value = 0

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
                    min="0"
                    placeholder='0'
                    value={set.weight || ''}
                    onChange={(e) => {
                        const val = parseFloat(e.target.value)
                        handleChange('weight', isNaN(val) ? 0 : val)
                    }}
                    className='set-input'
                />
                <span className='set-unit'>kg</span>
            </div>

            {/*Input de repeticiones*/}
            <div className='set-input-group'>
                <input 
                    type="number" 
                    min="1"
                    placeholder='0'
                    value={set.reps || ''}
                    onChange={(e) => {
                        const val = parseInt(e.target.value, 10)
                        handleChange('reps', isNaN(val) ? 0 : val)
                    }}
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