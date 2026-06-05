//Tarjeta de cada ejercicio individual
//PADRE de WorkoutSetRow

import React from 'react'
import WorkoutSetRow from './WorkoutSetRow'
import './ExerciseCard.css'

export default function ExerciseCard({exercise, onAddSet, onUpdateSet, onDeleteSet, onDeleteExercise}) {
    return(
        <div className='exercise-card'>
            <div className='exercise-card-header'>
                <h3 className='exercise-title'>{exercise.name}</h3>
                <button onClick={() => onDeleteExercise(exercise.id)} className='btn-remove-exxercise'>
                    Borrar ejercicio
                </button>
            </div>

            {/*Listado de series*/}
            <div className='exercise-sets-list'>
                {exercise.sets.map((set, index) => (
                    <WorkoutSetRow 
                        key={set.id}
                        set={set}
                        index={index}
                        onUpdateSet={(setId, updatedFields) => onUpdateSet(exercise.id, setId, updatedFields)}
                        onDeleteSet={(setId) => onDeleteSet(exercise.id, setId)}
                    />
                ))}
            </div>

            {/*Botón para añadir serie*/}
            <button onClick={() => onAddSet(exercise.id)} className='btn-add-set'>
                + Añadir serie
            </button>
        </div>
    )
}