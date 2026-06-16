# GainsCloud - Frontend (React Application)

GainsCloud es una aplicación web SPA (Single Page Application) moderna, intuitiva y completamente responsiva diseñada para la gestión, seguimiento y optimización de entrenamientos físicos. Este repositorio contiene todo el código de la interfaz de usuario, desarrollada con React y empaquetada con Vite para lograr un rendimiento y velocidad óptimos en producción.

**Despliegue en producción:** [https://gainscloud-frontend.vercel.app]



## Stack Tecnológico

*   **React.js (v18+)**: Biblioteca principal basada en componentes para la construcción de interfaces dinámicas.
*   **Vite**: Herramienta de construcción (*bundler*) de última generación que optimiza la velocidad de desarrollo y el empaquetado final.
*   **React Router DOM**: Gestión de enrutamiento dinámico en el lado del cliente (SPA) sin recargas de página.
*   **Context API**: Manejo del estado global de la aplicación (control de sesión, almacenamiento de tokens y datos del usuario logueado).
*   **CSS**: Diseño limpio, moderno, minimalista y adaptado al 100% a dispositivos móviles (Responsive Design).

## Funcionalidades del Frontend

*   **Formularios de Autenticación Avanzados:** Pantallas optimizadas de Registro e Inicio de sesión con validaciones de datos en tiempo real antes del envío.
*   **Protección de Rutas (Route Guards):** Bloqueo de seguridad perimetral que impide el acceso al panel interno o al CRUD si el usuario no tiene una sesión activa con un token válido.
*   **Persistencia de Sesión:** Gestión interna del almacenamiento del Token JWT para que el usuario no pierda su sesión al recargar el navegador.
*   **Dashboard de Usuario interactivo:** Interfaz gráfica optimizada para el consumo de la API, permitiendo visualizar, añadir, editar y eliminar ejercicios o rutinas de manera asíncrona.

## Estructura de carpetas

El proyecto está organizado siguiendo los estándares de modularidad y componentes reutilizables en React:

``` text
gainscloud-back/
├── src/
│   ├── components/
│   │   ├── ExerciseCard.jsx
│   │   ├── ExerciseCard.css
│   │   ├── NavBar.jsx
│   │   ├── NavBar.css
│   │   ├── PlanCard.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── WorkoutSetRow.jsx
│   │   ├── WorkoutSetRow.css
│   ├── screens/
│   │   ├── Coach.jsx
│   │   ├── Coach.css           
│   │   ├── Dashboard.jsx           
│   │   ├── Dashboard.css           
│   │   ├── History.jsx           
│   │   ├── History.css           
│   │   ├── Login.jsx           
│   │   ├── Login.css          
│   │   ├── Perfil.jsx           
│   │   ├── Perfil.css          
│   │   ├── Register.jsx         
│   │   ├── Register.css           
│   │   ├── Suscripcion.jsx 
│   │   ├── Suscripcion.css
│   │   ├── LiveWorkout/
│   │   │    ├── index.jsx
│   │   │    ├── LiveWorkout.css
│   ├── services/
│   │   ├── api.js
│   ├── assets/
│   │   ├── logo.png
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
├── .env
├── index.html
├── package.json
└── README.md
```

## Flujo de vistas principales

* `/register`: Registro de usuario - Formulario interactivo para la creación de nuevas cuentas de atleta.
* `/login`: Inicio de sesión - Formulario de acceso protegido.
* `/dashboard`: Panel de control - Vista protegida donde se muestra el panel interactivo con el CRUD para gestionar los entrenamientos personalizados del usuario conectado.
* `/workout/:id`: Entrenamiento en vivo - Vista donde puedes añadir ejercicios, crear nuevos personalizados, añadir tus series, repeticiones y kg. Puedes borrar, cancelar la sesión o dejarla abierta y luego reanudarla.
* `/history`: Historial - Historial de entrenamientos donde puedes verlos en detalle y además una gráfica con tus progresos.
* `/coah`: CiberCoach - Entrenador personal con IA que analiza tus últimos 40 entrenamientos para darte consejos.
* `/register`: Home - Presentación de la app
* `/suscripcion`: Suscripción - Panel donde puedes gestionar tu plan haciendo una compra simulada para obtener el plan PREMIUM (el que te da acceso al CiberCoach)
* `/perfil`: Perfil - Nombre, peso corporal, datos personales
* `/register`: Home - Presentación de la app

## Configuración de entorno local

1. Clonar el repositorio
- git clone https://github.com/monicasesal/gainscloud-frontend.git

2. Instalar las dependencias de Node
- npm install

3. Configurar variables de entorno
VITE_API_URL=http://localhost:3000/api

4. Lanzar la aplicación
- npm run dev

## Infraestructura y despliegue

La interfaz de usuario está alojada de forma permanente en Vercel, aprovechando su red de distribución de contenido (CDN) a nivel global para garantizar tiempos de carga instantáneos. El flujo incorpora Integración Continua (CI/CD): cada actualización o parche de código que se sube a la rama principal de GitHub compila y despliega la nueva versión en producción de forma automática en cuestión de segundos.

## Autor

Mónica Serrano Salazar
Junior Full-Stack Developer
GitHub: https://github.com/monicasesal