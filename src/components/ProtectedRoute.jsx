//Componente guardián para proteger rutas privadas

export default function ProtectedRoute({children}) {
    const token = localStorage.getItem('token')
    if (!token) {
        //Si no hay token, redirigimos al login
        return <Navigate to="/login" replace />
    }
    //Si hay token, dejamos renderizar los componentes hijos 
    return children
}