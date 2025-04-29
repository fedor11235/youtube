import { api } from 'src/boot/axios'
import type { Video, VideoUpload, VideoComment } from '../types/video'

class VideoError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'VideoError'
  }
}

const videoService = {
  
  async getVideos(): Promise<Video[]> {
    try {
      const response = await api.get('/videos')
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw new VideoError(error.message)
      }
      throw new VideoError('Failed to fetch videos')
    }
  },

  async getVideo(id: number): Promise<Video> {
    try {
      const response = await api.get(`/videos/${id}`)
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw new VideoError(error.message)
      }
      throw new VideoError('Failed to fetch video')
    }
  },

  async getChannelVideos(channelId: number) {
    try {
      const response = await api.get(`/videos/channel/${channelId}`);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new VideoError(error.message);
      }
      throw new VideoError('Не удалось получить видео канала');
    }
  },

  async uploadVideo(data: VideoUpload): Promise<Video> {
    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('video', data.videoFile)
      
      if (data.thumbnailFile) {
        formData.append('thumbnail', data.thumbnailFile)
      }

      const response = await api.post('/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!)
          console.log(percentCompleted)
          // Здесь можно добавить обработку прогресса
        }
      })
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw new VideoError(error.message)
      }
      throw new VideoError('Failed to upload video')
    }
},

  async updateVideo(id: number, data: Partial<Video>): Promise<Video> {
    try {
      const response = await api.put(`/videos/${id}`, data)
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw new VideoError(error.message)
      }
      throw new VideoError('Failed to update video')
    }
  },

  async deleteVideo(id: number): Promise<void> {
    try {
      await api.delete(`/videos/${id}`)
    } catch (error) {
      if (error instanceof Error) {
        throw new VideoError(error.message)
      }
      throw new VideoError('Failed to delete video')
    }
  },

  async likeVideo(id: number): Promise<{ likes: number }> {
    try {
      const response = await api.post(`/videos/${id}/like`)
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw new VideoError(error.message)
      }
      throw new VideoError('Failed to like video')
    }
  },

  async addComment(videoId: number, content: string): Promise<VideoComment> {
    try {
      const response = await api.post(`/videos/${videoId}/comments`, { content })
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw new VideoError(error.message)
      }
      throw new VideoError('Failed to add comment')
    }
  },

  async getComments(videoId: number): Promise<VideoComment[]> {
    try {
      const response = await api.get(`/videos/${videoId}/comments`)
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw new VideoError(error.message)
      }
      throw new VideoError('Failed to fetch comments')
    }
  }
}

export default videoService