// frontend_figueroa_coach/src/router/index.js


import { createRouter, createWebHistory } from '@ionic/vue-router'
import LoginPage from '@/views/LoginPage.vue'
import DashboardEntrenador from '@/views/DashboardEntrenador.vue'
import DashboardAlumno from '@/views/DashboardAlumno.vue'
import PlanificacionDetalle from '@/views/PlanificacionDetalle.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginPage },
  { path: '/coach', component: DashboardEntrenador, meta: { role: 'ENTRENADOR' } },
  { path: '/alumno', component: DashboardAlumno, meta: { role: 'ALUMNO' } },
  { path: '/planificacion/:id', component: PlanificacionDetalle }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  if (to.path === '/login') return next()

  if (!token) return next('/login')
  if (to.meta?.role && to.meta.role !== role) {
    return next(role === 'ENTRENADOR' ? '/coach' : '/alumno')
  }
  next()
})

export default router
