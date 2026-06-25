import React from 'react'
import {Routes, Route, Navigate, useLocation, useNavigate} from 'react-router-dom'
import Dashboard from './screens/Dashboard'
import Login from './screens/Login'
import Register from './screens/Register'
import ProtectedRoute from './components/ProtectedRoute'
import LiveWorkout from './screens/LiveWorkout'
import History from './screens/History'
import Navbar from './components/NavBar'
import Perfil from './screens/Perfil'
import Coach from './screens/Coach' 
import Suscripcion from './screens/Suscripcion'
import logoImg from './assets/logo.png'
import './App.css'

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()

  const authRoutes = ['/login', '/register']
  const isAuthPage = authRoutes.includes(location.pathname)

  return (
    <div className='app-container'>
      
      {isAuthPage ? (
        <div className='auth-simple-header'>
          <div className="navbar-logo" onClick={() => navigate('/login')}>
            <img src={logoImg} alt="GainsCloud Logo" />
            <span className="logo-text">GainsCloud</span>
          </div>
        </div>
      ) : (
        <Navbar />
      )}

      <main className='main-content'>
        <Routes>
          {/* Ruta del Login */}
          <Route path="/login" element={
            localStorage.getItem('token') ? <Navigate to="/dashboard" replace /> : <Login />
          } />

          {/* 🌟 Ruta del Registro */}
          <Route path="/register" element={
            localStorage.getItem('token') ? <Navigate to="/dashboard" replace /> : <Register />
          } />

          {/* Ruta del Dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Ruta dinámica del entrenamiento */}
          <Route path="/workout/:id" element={
            <ProtectedRoute>
              <LiveWorkout />
            </ProtectedRoute>
          } />

          {/* Ruta del historial */}
          <Route path="/history" element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } />

          {/* Ruta de suscripción */}
          <Route path='/suscripcion' element={
            <ProtectedRoute>
              <Suscripcion />
            </ProtectedRoute>
          } />

          {/* Ruta del perfil */}
          <Route path="/perfil" element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          } />

          {/* Coach */}
          <Route path="/coach" element={
            <ProtectedRoute>
              <Coach />
            </ProtectedRoute>
          } />

          {/* Ruta por defecto (Redirecciones) */}
          <Route path="*" element={
            localStorage.getItem('token') ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" />
          } />
        </Routes>
      </main>
    </div>
  )
}