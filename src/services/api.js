// frontend_figueroa_coach/src/services/api.js

import axios from 'axios'

// Usa /api por defecto (Vite proxy) o lo que pongas en .env
const baseURL = import.meta.env.VITE_API_BASE || '/api'

// ÚNICA instancia de axios
const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
})

// Interceptor para adjuntar token si existe
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

/* ======================= AUTH ======================= */
export const auth = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    // guarda token/rol/usuario
    localStorage.setItem('token', data.token)
    localStorage.setItem('role', data.user.rol)
    localStorage.setItem('user', JSON.stringify(data.user))
    return data.user
  },
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('user')
    delete api.defaults.headers.common.Authorization
  },
  initFromStorage() {
    const token = localStorage.getItem('token')
    if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`
  }
}

/* ======================= USUARIO ======================= */
export const usuario = {
  async me() {
    const { data } = await api.get('/auth/me')
    return data
  }
}

/* ========================= ALUMNOS ========================= */
export const alumnos = {
  async crear(payload) { const { data } = await api.post('/auth/alumnos', payload); return data },
  async listar(search='') { const { data } = await api.get('/auth/alumnos', { params: { search } }); return data },
  async detalle(id) { const { data } = await api.get(`/auth/alumnos/${id}`); return data },
  async actualizar(id, payload) { const { data } = await api.put(`/auth/alumnos/${id}`, payload); return data },
  async eliminar(id) { const { data } = await api.delete(`/auth/alumnos/${id}`); return data },
  async resetPassword(id, password) { const { data } = await api.put(`/auth/alumnos/${id}/password`, { password }); return data } // <-- NUEVO
}


/* =================== PLANIFICACIONES =================== */
export const planificaciones = {
  async crear(payload) { const { data } = await api.post('/planificaciones', payload); return data },
  async listar(params={}) { const { data } = await api.get('/planificaciones', { params }); return data },
  async detalle(id) { const { data } = await api.get(`/planificaciones/${id}`); return data },
  async actualizar(id, payload) { const { data } = await api.put(`/planificaciones/${id}`, payload); return data },
  async eliminar(id) { const { data } = await api.delete(`/planificaciones/${id}`); return data },

  // Rutinas
  async addRutina(payload) { const { data } = await api.post('/planificaciones/rutinas', payload); return data },
  async updRutina(id, payload) { const { data } = await api.put(`/planificaciones/rutinas/${id}`, payload); return data },
  async delRutina(id) { const { data } = await api.delete(`/planificaciones/rutinas/${id}`); return data },

  // Alimentación
  async addAlimentacion(payload) { const { data } = await api.post('/planificaciones/alimentaciones', payload); return data },
  async updAlimentacion(id, payload) { const { data } = await api.put(`/planificaciones/alimentaciones/${id}`, payload); return data },
  async delAlimentacion(id) { const { data } = await api.delete(`/planificaciones/alimentaciones/${id}`); return data },

  // Suplementación
  async addSuplementacion(payload) { const { data } = await api.post('/planificaciones/suplementaciones', payload); return data },
  async updSuplementacion(id, payload) { const { data } = await api.put(`/planificaciones/suplementaciones/${id}`, payload); return data },
  async delSuplementacion(id) { const { data } = await api.delete(`/planificaciones/suplementaciones/${id}`); return data }
}

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)



export { api }          // export named (por si lo necesitás)
export default api      // export default (si lo importás como default)

