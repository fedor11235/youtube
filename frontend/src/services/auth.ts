import { api } from 'src/boot/axios'
import type { LoginCredentials, RegisterData } from '../types/auth'

class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

const authService = {
  async login(credentials: LoginCredentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      const token = response.data.token
      localStorage.setItem('token', token)
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw new AuthError(error.message)
      }
      throw new AuthError('Login failed')
    }
  },

  async register(data: RegisterData) {
    try {
      const response = await api.post('/auth/register', data)
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw new AuthError(error.message)
      }
      throw new AuthError('Registration failed')
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me')
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw new AuthError(error.message)
      }
      throw new AuthError('Failed to get current user')
    }
  },

  async logout(){
    try {
      await api.post('/auth/logout')
      localStorage.removeItem("token")
    } catch (error) {
      if (error instanceof Error) {
        throw new AuthError(error.message)
      }
      throw new AuthError('Logout failed')
    }
  }
}

export default authService