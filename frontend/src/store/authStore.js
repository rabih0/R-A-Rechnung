import { create } from 'zustand'
import { authAPI } from '../services/api'

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('auth_token') || null,
  isAuthenticated: !!localStorage.getItem('auth_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authAPI.login({ email, password })
      const { user, access_token } = response.data

      localStorage.setItem('auth_token', access_token)
      localStorage.setItem('user', JSON.stringify(user))

      set({
        user,
        token: access_token,
        isAuthenticated: true,
        isLoading: false,
      })

      return true
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Anmeldevorgang fehlgeschlagen'
      set({
        error: errorMessage,
        isLoading: false,
      })
      return false
    }
  },

  register: async (name, email, password, passwordConfirmation) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authAPI.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
      const { user, access_token } = response.data

      localStorage.setItem('auth_token', access_token)
      localStorage.setItem('user', JSON.stringify(user))

      set({
        user,
        token: access_token,
        isAuthenticated: true,
        isLoading: false,
      })

      return true
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registrierung fehlgeschlagen'
      set({
        error: errorMessage,
        isLoading: false,
      })
      return false
    }
  },

  logout: async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    }

    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  },

  clearError: () => set({ error: null }),
}))
