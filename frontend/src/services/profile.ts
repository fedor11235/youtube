import { api } from 'src/boot/axios'
import type { Profile } from '../types/profile'

class ProfileError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ProfileError'
  }
}

const profileService = {
  async getProfile() {
    try {
      const response = await api.get('/auth/me')
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw new ProfileError(error.message)
      }
      throw new ProfileError('Failed to get profile')
    }
  },

  async updateProfile(data: Partial<Profile>) {
    try {
      const response = await api.patch('/auth/profile', data)
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw new ProfileError(error.message)
      }
      throw new ProfileError('Failed to update profile')
    }
  },

  async updateAvatar(file: File) {
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const response = await api.post('/auth/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw new ProfileError(error.message)
      }
      throw new ProfileError('Failed to update avatar')
    }
  }
}

export default profileService