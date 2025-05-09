import { defineStore } from 'pinia'
import type { ApiError } from '../types/error'
import authService from '../services/auth'
import type { LoginCredentials, RegisterData } from 'src/types/auth'
import type { Channel } from 'src/types/channel'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    channel: null as Channel | null,
    loading: false,
    token: localStorage.getItem('token'),
    error: null as string | null
  }),

  getters: {
    isAuthenticated: (state) => !!state.channel
  },
  

  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true
      this.error = null
      try {
        const response = await authService.login(credentials)
        this.channel = response.channel 
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
        this.channel = response.channel
      } catch (err) {
        this.error = (err as ApiError).response?.data?.message || 'Registration failed'
        throw err
      } finally {
        this.loading = false
      }
    },

    async logout() {
      await authService.logout()
      this.channel = null
    },

    async checkAuth() {
      try {
        this.channel = await authService.getCurrentChannel()
      } catch (err) {
        console.error(err)
        this.channel = null
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

