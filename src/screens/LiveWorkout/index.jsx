//Pantalla principal que controla el estado y habla con el backend
//PADRE de ExerciseCard

import React, {useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {workoutService} from '../../services/api'
import ExerciseCard from '../../components/ExerciseCard'
import './LiveWorkout.css'

export default function LiveWorkout() {
    const {id: workoutLogId} = useParams()
    const navigate = useNavigate()

    const [seconds, setSeconds] = useState(0)
    const [exercises, setExercises] = useState([])
    const [newExerciseName, setNewExerciseName] = useState('')
    const [catalog, setCatalog] = useState([])

    //Cronómetro en vivo
    useEffect(() => { //en useEffect, return NO sifnifica "devolver un valor", significa "esto es la función de limpieza", "cuando este componente desaparezca, ejecuta estoy "
        const interval = setInterval(() => {
            setSeconds(prev => prev + 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    //Cargar el catálogo de ejs al entrar en la pantalla
    useEffect(() => {
        const loadCatalog = async () => {
            try {
                const data = await workoutService.getExerciseCatalog()
                setCatalog(data)
            } catch (error) {
                console.error("Error cargando catálogo:", error)
            }
        }
        loadCatalog()
    }, [])

    const formatTime = (totalSeconds) => {
        const hrs = Math.floor(totalSeconds / 3600).toString().padStart(2, '0')
        const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0')
        const secs = (totalSeconds % 60).toString().padStart(2, '0')
        return `${hrs}:${mins}:${secs}`
    }

    //Operaciones lógicas del estado (Cero lag, todo local en memoria)
    const handleAddExercise = (e) => {
        e.preventDefault()
        if (!newExerciseName.trim()) return

        const newExercise = {
            id: Date.now().toString(), //ID temporal local
            name: newExerciseName,
            sets: [{id: Date.now().toString() + '-0', weight: 0, reps: 0, isCompleted: false}]
        }

        setExercises([...exercises, newExercise])
        setNewExerciseName('') //el input se limpia
     }

    const handleUpdateSet = async (exerciseId, setId, updatedFields) => {
        // 1. Buscamos el ejercicio y la serie actuales ANTES de tocar el estado de React
        const currentExercise = exercises.find(ex => ex.id === exerciseId);
        if (!currentExercise) return;
        
        const currentSet = currentExercise.sets.find(s => s.id === setId);
        if (!currentSet) return;

        // 2. Calculamos cuáles van a ser los valores finales combinando los viejos con los nuevos inputs
        const finalWeight = updatedFields.weight !== undefined ? updatedFields.weight : currentSet.weight;
        const finalReps = updatedFields.reps !== undefined ? updatedFields.reps : currentSet.reps;
        const finalIsCompleted = updatedFields.isCompleted !== undefined ? updatedFields.isCompleted : currentSet.isCompleted;

        // 3. Actualizamos la interfaz visual de React de inmediato (Cero lag)
        setExercises(prev => prev.map(ex => {
            if (ex.id !== exerciseId) return ex;
            return {
            ...ex,
            sets: ex.sets.map(s => s.id === setId ? { ...s, ...updatedFields } : s)
            };
        }));

        // 4. Si el usuario acaba de activar el CHECK (isCompleted pasa a ser true), disparamos la BD
        if (finalIsCompleted === true) {
            try {
            console.log(`Enviando a set_logs: ${currentExercise.name} - ${finalWeight}kg x ${finalReps}reps`);
            
            const data = await workoutService.logSet({
                workout_log_id: Number(workoutLogId),
                exercise_name: currentExercise.name,
                weight: finalWeight,
                reps: finalReps,
                is_completed: 1
            });
            
            console.log(`¡Guardado con éxito en set_logs!`);

            //si el back nos devuelve el ID real de mysql, lo actualizamos 
            if (data && data.setId) {
                setExercises(prev => prev.map(ex=> {
                    if (ex.id !== exerciseId) return ex
                    return {
                        ...ex,
                        sets: ex.sets.map(s=>s.id === setId ? {...s, id: data.setId} : s)
                    }
                }))
            }

            } catch (error) {
            alert('Error al guardar la serie en el servidor: ' + error.message);
            
            // Si el servidor falla, desmarcamos el check para que el usuario sepa que no se guardó
            setExercises(prev => prev.map(ex => {
                if (ex.id !== exerciseId) return ex;
                return {
                ...ex,
                sets: ex.sets.map(s => s.id === setId ? { ...s, isCompleted: false } : s)
                };
            }));
            }
        }
    }

    const handleAddSet = (exerciseId) => {
        setExercises(exercises.map(ex => {
            if (ex.id !== exerciseId) return ex
            return {
                ...ex,
                sets: [...ex.sets, {id: Date.now().toString(), weight: 0, reps: 0, isCompleted: false}]
            }
        }))
    }

    const handleDeleteSet = async (exerciseId, setId) => {
        // FILTRO DE SEGURIDAD: 
        // Si el ID es un número real de MySQL, o un string corto (ID real), va al backend.
        // Si es un string largo (Date.now()), se lo salta porque es temporal y no está en la BD.
        const isTemporalId = typeof setId === 'string' && setId.length > 10;

        if (!isTemporalId) {
            try {
                console.log(`Eliminando serie ${setId} del servidor...`)
                await workoutService.deleteSet(setId)
                console.log('Serie eliminada del servidor de forma permanente')
            } catch (error) {
                console.error("Error al borrar del back:", error)
                alert("No se pudo borrar la serie de la base de datos: " + error.message)
                return // Abortamos para que no desaparezca de la pantalla si falló en la BD
            }
        } else {
            console.log('Visual: Eliminando serie temporal que nunca se guardó en la BD')
        }

        // Lo borramos del estado de React para que desaparezca de la pantalla
        setExercises(prevExercises => prevExercises.map(ex => {
            if (ex.id === exerciseId) {
                return {
                    ...ex,
                    sets: ex.sets.filter(set => set.id !== setId)
                }
            }
            return ex
        }))
    }

    const handleDeleteExercise = (exerciseId) => {
        setExercises(exercises.filter(ex=>ex.id !== exerciseId))
    }

    //3. Finalizar y sincronizar con el Backend
    const handleFinishWorkout = async () => {
        try {
            await workoutService.finishWorkout(workoutLogId)
            alert('Entrenamiento guardado con éxito')
            navigate('/dashboard')
        } catch (error) {
            alert('Error al guardar el entrenamiento: ' + error.message)
        }
    }

    //4. Cancelar entrenamient
    const handleCancelWorkout = async () => {
        try {
            await workoutService.deleteWorkout(workoutLogId)
            navigate('/dashboard')
        } catch (error) {
            alert('Error al cancelar el entrenamiento: ' + error.message)
        }
    }

    return (
        <div className="workout-container">
            <div className='workout-header'>
                <div className='workout-info'>
                    <h2 className='workout-main-title'>Entrenamiento Activo</h2>
                    <span className='workout-id-badge'>ID Registro: #{workoutLogId}</span>
                </div>
                <div className='timer'>{formatTime(seconds)}</div>
            </div>

            {/*Buscador de ejercicios con sugerencias dinámicas*/}
            <form onSubmit={handleAddExercise} className='add-exercise-section'>
                <input 
                    type="text"
                    placeholder='Ej: Press de Banca, Sentadillas...'
                    className='exercise-input'
                    value={newExerciseName}
                    onChange={(e) => setNewExerciseName(e.target.value)} 
                    list='exercise-catalog'
                    autoComplete='off'
                />

                {/*desplegable mágico!!*/}
                <datalist id="exercise-catalog">
                    {catalog.map(item => (
                        <option key={item.id} value={item.name} />
                    ))}
                </datalist>

                <button type='submit' className='btn-add'>+ Añadir</button>
            </form>

            {/*Listado de tarjetas de ejercicios*/}
            <div className='exercises-list'>
                {exercises.map(ex => (
                    <ExerciseCard 
                        key={ex.id}
                        exercise={ex}
                        onAddSet={handleAddSet}
                        onUpdateSet={handleUpdateSet}
                        onDeleteSet={handleDeleteSet}
                        onDeleteExercise={handleDeleteExercise}
                    />
                ))}
            </div>

            {/*Botón de cierre definitivo*/}
            {exercises.length >= 0 && (
                <div className='workout-actions-footer'>
                    <button type="button" onClick={handleCancelWorkout} className='btn-cancel'>
                        ❌ Cancelar Sesión
                    </button>
                    {exercises.length > 0 && (
                        <button type="button" onClick={handleFinishWorkout} className='btn-finish'>
                            Finalizar Entrenamiento
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}