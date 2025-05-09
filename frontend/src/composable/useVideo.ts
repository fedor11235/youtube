import { ref } from 'vue'
import type { Video } from '../types/video'
import type { Comment } from '../types/comment'

export function useVideo() {
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchVideo = async (id: number): Promise<Video | null> => {
    loading.value = true
    error.value = null
    
    try {
      // Replace with actual API call
      const response = await fetch(`/api/videos/${id}`)
      const data = await response.json()
      return data
    } catch (err) {
      console.error(err)
      error.value = 'Failed to fetch video'
      return null
    } finally {
      loading.value = false
    }
  }

  const fetchVideos = async (): Promise<Video[]> => {
    loading.value = true
    error.value = null
    
    try {
      // Replace with actual API call
      const response = await fetch('/api/videos')
      const data = await response.json()
      return data
    } catch (err) {
      console.error(err)
      error.value = 'Failed to fetch videos'
      return []
    } finally {
      loading.value = false
    }
  }

  const addComment = async (videoId: number, content: string): Promise<Comment | null> => {
    loading.value = true
    error.value = null
    
    try {
      // Replace with actual API call
      const response = await fetch(`/api/videos/${videoId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      })
      const data = await response.json()
      return data
    } catch (err) {
      console.error(err)
      error.value = 'Failed to add comment'
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    fetchVideo,
    fetchVideos,
    addComment
  }
}