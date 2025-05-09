import { api } from 'src/boot/axios'
import type { Video } from '../types/video'
import type { VideoUpload, VideoComment } from '../types/video'

class VideoError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'VideoError'
  }
}

interface Tag {
  id: number;
  name: string;
}

const videoService = {

  async getTags(): Promise<Tag[]> {
    try {
      const response = await api.get('/tags');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении тегов:', error);
      throw error;
    }
  },
  
  // async getVideos(): Promise<Video[]> {
  //   try {
  //     const response = await api.get('/videos')
  //     return response.data
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       throw new VideoError(error.message)
  //     }
  //     throw new VideoError('Failed to fetch videos')
  //   }
  // },

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

  async getRelatedVideos(id: number): Promise<Video[]> {
    try {
      const response = await api.get(`/videos/related/${id}`)
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
  },

  async getLikedVideos() {
    const response = await api.get('/videos/liked');
    return response.data;
  },

  async addView(videoId: number) {
    const response = await api.post(`/video-views/${videoId}`);
    return response.data;
  },

  async getViewsCount(videoId: number) {
    const response = await api.get(`/video-views/${videoId}/count`);
    return response.data.count;
  },

  async getTrendingVideos(): Promise<Video[]> {
    const { data } = await api.get<Video[]>('/videos/trending');
    return data;
  },

  async searchVideos(page: number, limit: number, query: string, tags: string[] = [], sort: string): Promise<Video[]> {
    try {
      const params = new URLSearchParams();
      if (page) {
        params.append('page', String(page));
      }
      if (limit) {
        params.append('limit', String(limit));
      }
      if (query) {
        params.append('q', query);
      }
      if (tags.length > 0) {
        params.append('tags', tags.join(','));
      }

      if (sort) {
        params.append('sort', sort);
      }
      
      const response = await api.get(`/videos/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new VideoError(error.message);
      }
      throw new VideoError('Failed to search videos');
    }
  },

  async addVideoTags(videoId: number, tagNames: string[]): Promise<void> {
    try {
      await api.post(`/videos/tags/${videoId}`, { tags: tagNames });
    } catch (error) {
      console.error('Ошибка при добавлении тегов:', error);
      throw error;
    }
  },

  async updateThumbnail(videoId: number, file: File) {
    try {
      const formData = new FormData()
      formData.append('thumbnail', file)
      formData.append('videoId', String(videoId))
      const response = await api.post('/videos/thumbnail', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('Failed to update banner:', error);
      throw error;
    }
  }
}

export default videoService