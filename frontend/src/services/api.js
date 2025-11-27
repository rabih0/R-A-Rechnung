import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
  logout: () => api.post('/logout'),
  getCurrentUser: () => api.get('/me'),
}

export const customerAPI = {
  getAll: (params) => api.get('/customers', { params }),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
  getStats: () => api.get('/customers-stats'),
}

export const contractAPI = {
  getAll: (params) => api.get('/contracts', { params }),
  getById: (id) => api.get(`/contracts/${id}`),
  create: (data) => api.post('/contracts', data),
  update: (id, data) => api.put(`/contracts/${id}`, data),
  delete: (id) => api.delete(`/contracts/${id}`),
  calculatePrice: (data) => api.post('/contracts/calculate-price', data),
  addItem: (contractId, data) => api.post(`/contracts/${contractId}/items`, data),
}

export const invoiceAPI = {
  getAll: (params) => api.get('/invoices', { params }),
  getById: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post('/invoices', data),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  delete: (id) => api.delete(`/invoices/${id}`),
  addItem: (invoiceId, data) => api.post(`/invoices/${invoiceId}/items`, data),
  removeItem: (invoiceId, itemId) => api.delete(`/invoices/${invoiceId}/items/${itemId}`),
  generatePdf: (id) => api.get(`/invoices/${id}/pdf`),
}

export const appointmentAPI = {
  getAll: (params) => api.get('/appointments', { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  delete: (id) => api.delete(`/appointments/${id}`),
  getCalendarEvents: (params) => api.get('/appointments/calendar-events', { params }),
}

export const settingsAPI = {
  getPricingSettings: () => api.get('/settings/pricing'),
  updatePricingSettings: (data) => api.post('/settings/pricing', data),
  getFurnitureList: () => api.get('/settings/furniture-list'),
  getFurnitureDetails: (name) => api.get('/settings/furniture-details', { params: { furniture_name: name } }),
  getCompanySettings: () => api.get('/settings/company'),
  updateCompanySettings: (data) => api.post('/settings/company', data),
  getDashboardStats: () => api.get('/settings/dashboard-stats'),
}

export default api
