import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

interface User {
  id: number
  email: string
  username: string
  avatar: string | null
  createdAt: string
  url: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    currentUser: null as User | null,
  }),

  actions: {
    async fetchUserById(userId: string) {
      try {
        const response = await api.get(`/users/${userId}`)
        return response.data
      } catch (error) {
        console.error('Ошибка получения пользователя:', error)
        throw error
      }
    },
    deleteVideo(id: number) {
      console.log(id)
    },
    async searchUsers(query: string): Promise<User[]> {
      try {
        const response = await api.get<User[]>('/users/search', {
          params: {
            query: query.trim()
          }
        })
        return response.data
      } catch (error) {
        console.error('Ошибка при поиске пользователей:', error)
        throw error
      }
    }
  }
})