import React, {useState} from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './screens/Dashboard'
import Login from './screens/Login'
import ProtectedRoute from './components/ProtectedRoute'
import LiveWorkout from './screens/LiveWorkout'
import History from './screens/History'
import Navbar from './components/NavBar'
import Perfil from './screens/Perfil'
import Coach from './screens/Coach' 

import './App.css'

export default function App() {
  return (
      <div className='app-container'>
        <Navbar />
        <main className='main-content'>

          <Routes>
            {/* Ruta del Login */}
            <Route path="/login" element={
              localStorage.getItem('token') ? <Navigate to="/dashboard" replace /> : <Login />
            } />

            {/* Ruta PROTEGIDA del Dashboard*/}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            {/* Ruta dinámica del entrenamiento*/}
            <Route path="/workout/:id" element={
              <ProtectedRoute>
                <LiveWorkout />
              </ProtectedRoute>
            }
            />

            {/*Ruta del historial*/}
            <Route path="/history" element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
            />

            {/*Ruta por defecto*/}
            <Route path="*" element={
              localStorage.getItem('token') ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" />
            } />

            {/*Ruta del perfil*/}
            <Route path="/perfil" element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
            />

            {/*Coach*/}
            <Route path="/coach" element={
              <ProtectedRoute>
                <Coach />
              </ProtectedRoute>
            }
            
            />

          </Routes>
        </main>
      </div>
  )
}