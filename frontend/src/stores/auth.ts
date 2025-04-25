import { defineStore } from 'pinia'
import type { ApiError } from '../types/error'
import authService from '../services/auth'
import type { LoginCredentials, RegisterData, User } from 'src/types/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: false,
    token: localStorage.getItem('token'),
    error: null as string | null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userFullName: (state) => state.user ? `${state.user.firstName} ${state.user.lastName}` : '',
  },
  

  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true
      this.error = null
      try {
        const response = await authService.login(credentials)
        this.user = response.user 
      } catch (err) {
        this.error = (err as ApiError).response?.data?.message || 'Login failed'
        throw err
      } finally {
        this.loading = false
      }
    },

    async register(data: RegisterData) {
      this.loading = true
      this.error = null
      try {
        const response = await authService.register(data)
        this.user = response.user
      } catch (err) {
        this.error = (err as ApiError).response?.data?.message || 'Registration failed'
        throw err
      } finally {
        this.loading = false
      }
    },

    async logout() {
      await authService.logout()
      this.user = null
    },

    async checkAuth() {
      try {
        this.user = await authService.getCurrentUser()
      } catch (err) {
        console.error(err)
        this.user = null
      }
    },

    fileToBase64(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('File reading failed'))
      })
    },

    async init() {
      if (this.token) {
        await this.checkAuth()
      }
    },
  },
  
})

if (import.meta.env.CLIENT) {
  const authStore = useAuthStore()
  void authStore.init()
}

