import React, {useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {workoutService} from '../../services/api'
import ExerciseCard from '../../components/ExerciseCard'
import './LiveWorkout.css'

export default function LiveWorkout() {
    const {id: workoutLogId} = useParams()
    const navigate = useNavigate()

    const [seconds, setSeconds] = useState(0)
    
    //Inicializar el estado leyendo directamente de LocalStorage si ya había datos guardados
    const [exercises, setExercises] = useState(() => {
        const savedExercises = localStorage.getItem(`workout_exercises_${workoutLogId}`)
        return savedExercises ? JSON.parse(savedExercises) : []
    })
    
    const [newExerciseName, setNewExerciseName] = useState('')
    const [catalog, setCatalog] = useState([])

    //Effect para guardar AUTOMÁTICAMENTE los ejercicios en LocalStorage cada vez que cambien
    useEffect(() => {
        localStorage.setItem(`workout_exercises_${workoutLogId}`, JSON.stringify(exercises));
    }, [exercises, workoutLogId])

    // Cronómetro persistente con LocalStorage
    useEffect(() => { 
        const storageKey = `workout_start_time_${workoutLogId}`
        let startTime = localStorage.getItem(storageKey)

        if (!startTime) {
            startTime = Date.now().toString()
            localStorage.setItem(storageKey, startTime)
        }

        const calculateElapsed = () => {
            const start = parseInt(startTime, 10)
            const now = Date.now()
            const elapsedSeconds = Math.floor((now - start) / 1000)
            setSeconds(elapsedSeconds > 0 ? elapsedSeconds : 0)
        }

        calculateElapsed()

        const interval = setInterval(() => {
            calculateElapsed()
        }, 1000)

        return () => clearInterval(interval)
    }, [workoutLogId])

    // Cargar el catálogo de ejercicios al entrar en la pantalla
    useEffect(() => {
        const loadCatalog = async () => {
            try {
                const data = await workoutService.getExerciseCatalog()
                setCatalog(Array.isArray(data) ? data : [])
            } catch (error) {
                setCatalog([]) 
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

    // Operaciones lógicas del estado (Guardado local automático gracias al useEffect superior)
    const handleAddExercise = async (e) => {
        e.preventDefault()
        if (!newExerciseName.trim()) return

        const nameTrimmed = newExerciseName.trim()
        const existsInCatalog = catalog.some(item => item.name.toLowerCase() === nameTrimmed.toLowerCase())

        try {
            if (!existsInCatalog) {
                await workoutService.createExercise(nameTrimmed)
                setCatalog(prev => [...prev, { id: Date.now(), name: nameTrimmed }])
                console.log('¡Ejercicio personalizado guardado en la BD con su user_id real!')
            }

            const newExercise = {
                id: Date.now().toString(),
                name: nameTrimmed,
                sets: [{ id: Date.now().toString() + '-0', weight: 0, reps: 0, isCompleted: false }]
            }

            setExercises([...exercises, newExercise])
            setNewExerciseName('')

        } catch (error) {
            console.error("Error al gestionar el ejercicio nuevo:", error)
            alert("No se pudo crear el ejercicio personalizado: " + error.message)
        }
    }

    const handleUpdateSet = async (exerciseId, setId, updatedFields) => {
        const currentExercise = exercises.find(ex => ex.id === exerciseId)
        if (!currentExercise) return
        
        const currentSet = currentExercise.sets.find(s => s.id === setId)
        if (!currentSet) return

        const finalWeight = updatedFields.weight !== undefined ? updatedFields.weight : currentSet.weight
        const finalReps = updatedFields.reps !== undefined ? updatedFields.reps : currentSet.reps
        const finalIsCompleted = updatedFields.isCompleted !== undefined ? updatedFields.isCompleted : currentSet.isCompleted

        // Actualizar primero el estado visual
        setExercises(prev => prev.map(ex => {
            if (ex.id !== exerciseId) return ex
            return {
                ...ex,
                sets: ex.sets.map(s => s.id === setId ? { ...s, ...updatedFields } : s)
            }
        }))

        // Sincronizar con el Backend si se marca como completado
        if (finalIsCompleted === true) {
            try {            
                const data = await workoutService.logSet({
                    workout_log_id: Number(workoutLogId),
                    exercise_name: currentExercise.name,
                    weight: finalWeight,
                    reps: finalReps,
                    is_completed: 1
                })
                

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
                alert('Error al guardar la serie en el servidor: ' + error.message)
                
                setExercises(prev => prev.map(ex => {
                    if (ex.id !== exerciseId) return ex
                    return {
                        ...ex,
                        sets: ex.sets.map(s => s.id === setId ? { ...s, isCompleted: false } : s)
                    }
                }))
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
        const isTemporalId = typeof setId === 'string' && setId.length > 10;

        if (!isTemporalId) {
            try {
                console.log(`Eliminando serie ${setId} del servidor...`)
                await workoutService.deleteSet(setId)
            } catch (error) {
                console.error("Error al borrar del back:", error)
                alert("No se pudo borrar la serie de la base de datos: " + error.message)
                return 
            }
        } else {
            console.log('Visual: Eliminando serie temporal que nunca se guardó en la BD')
        }

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

    // Limpieza TOTAL de la sesión al terminar o cancelar
    const cleanWorkoutStorage = () => {
        localStorage.removeItem(`workout_start_time_${workoutLogId}`);
        localStorage.removeItem(`workout_exercises_${workoutLogId}`);
    }

    // Finalizar y sincronizar con el Backend
    const handleFinishWorkout = async () => {
        try {
            await workoutService.finishWorkout(workoutLogId)
            cleanWorkoutStorage()
            alert('Entrenamiento guardado con éxito')
            navigate('/dashboard')
        } catch (error) {
            alert('Error al guardar el entrenamiento: ' + error.message)
        }
    }

    // Cancelar entrenamiento
    const handleCancelWorkout = async () => {
        try {
            await workoutService.deleteWorkout(workoutLogId)
            cleanWorkoutStorage(); 
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

            {/* Buscador de ejercicios */}
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

                <datalist id="exercise-catalog">
                    {catalog.map(item => (
                        <option key={item.id} value={item.name} />
                    ))}
                </datalist>

                <button type='submit' className='btn-add'>+ Añadir</button>
            </form>

            {/* Listado de tarjetas de ejercicios */}
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

            {/* Botón de cierre definitivo */}
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