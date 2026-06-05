const API_URL = import.meta.env.VITE_API_URL

//Función auxiliar para recuperar el token del almacenamiento del navegador
const getHeaders = () => {
    const token = localStorage.getItem('token')
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    }
} 

export const authService = {
    login: async (email, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email,password})
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Error en las credenciales ')
        
        //Guardar los datos para mantener la sesión activa
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        return data
    },

    logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }
}

export const workoutService = {
    //Iniciar entrenamiento en vivo (crea la fila en workout_logs)
    startWorkout: async (routineId = null) => {
        const response = await fetch(`${API_URL}/workouts/start`, {
            method: 'POST',
            headers: getHeaders(),
            body:  JSON.stringify({routine_id: routineId})
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error)
        return data //devuelve workoutLogId
    },

    //Guardar o actualizar una serie al pulsar el Check
    logSet: async (setData) => {
        const response = await fetch(`${API_URL}/workouts/set`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(setData)// Envía workout_log_id, exercise_name, weight, reps, is_completed
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error)
        return data
    },

    //Finalizar el entrenamniento (pone status como completed y clava el end_time)
    finishWorkout: async (workoutLogId) => {
        const response = await fetch (`${API_URL}/workouts/finish`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({workout_log_id: workoutLogId})
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error)
        return data
    },

    //history
    getHistory: async () => {
        const response = await fetch(`${API_URL}/workouts/history`, {
            method: 'GET',
            headers: getHeaders()
        })
        const data = await response.json()
        if (!response.ok) throw new Error (data.error || 'Error al traer el historial')
        return data
    },

    //borrar
    deleteSet: async (setId) => {
        const response = await fetch(`${API_URL}/workouts/set/${setId}`, {
            method: 'DELETE',
            headers: getHeaders()
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Error al eliminar la serie')
        return data
    },

    getExerciseCatalog: async () => {
        const response = await fetch(`${API_URL}/workouts/exercises/catalog`, {
            method: 'GET',
            headers: getHeaders()
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Error al traer el catálogo')
        return data
    },

    deleteWorkout: async (workoutId) => {
        const response = await fetch(`${API_URL}/workouts/${workoutId}`, {
            method: 'DELETE',
            headers: getHeaders()
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Error al eliminar entrenamiento')
        return data
    }
}


