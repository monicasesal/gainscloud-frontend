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
    logSet: async (setDetails) => {
        const response = await fetch(`${API_URL}/workouts/set`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(setDetails)
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
    }
}


