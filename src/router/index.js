// frontend_figueroa_coach/src/router/index.js
import { createRouter, createWebHistory } from '@ionic/vue-router'
import LoginPage from '@/views/LoginPage.vue'
import DashboardEntrenador from '@/views/DashboardEntrenador.vue'
import DashboardAlumno from '@/views/DashboardAlumno.vue'
import PlanificacionDetalle from '@/views/PlanificacionDetalle.vue'

const routes = [
  { name: 'Root', path: '/', redirect: '/login' },
  { name: 'Login', path: '/login', component: LoginPage },

  // Accesos por rol
  { name: 'Coach', path: '/coach', component: DashboardEntrenador, meta: { role: 'ENTRENADOR' } },
  { name: 'Alumno', path: '/alumno', component: DashboardAlumno, meta: { role: 'ALUMNO' } },

  // Detalle accesible por AMBOS roles (sin meta.role)
  { name: 'PlanDetalle', path: '/planificacion/:id', component: PlanificacionDetalle }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  const role  = localStorage.getItem('role')

  // Siempre permitir login
  if (to.name === 'Login') return next()

  // Requiere estar logueado para todo lo demás (incluye PlanDetalle)
  if (!token) return next({ name: 'Login' })

  // ⚠️ Whitelist: nunca redirigir PlanDetalle por rol
  if (to.name === 'PlanDetalle') return next()

  // Para rutas con rol específico, validar
  if (to.meta?.role && to.meta.role !== role) {
    return next(role === 'ENTRENADOR' ? { name: 'Coach' } : { name: 'Alumno' })
  }

  next()
})

export default router
