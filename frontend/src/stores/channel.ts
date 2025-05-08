import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import type { Channel } from 'src/types'

export const useChannelStore = defineStore('channel', {
  state: () => ({
    channels: [] as Channel[],
    currentChannel: null as Channel | null,
  }),

  actions: {
    async fetchChannelById(channelId: string) {
      try {
        const response = await api.get(`/channels/${channelId}`)
        return response.data
      } catch (error) {
        console.error('Ошибка получения пользователя:', error)
        throw error
      }
    },
    deleteVideo(id: number) {
      console.log(id)
    },
    async searchChannels(query: string): Promise<Channel[]> {
      try {
        const response = await api.get<Channel[]>('/channels/search', {
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