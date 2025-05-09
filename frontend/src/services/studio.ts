import { api } from 'src/boot/axios'

const studioService = {
  async uploadPassport(file: File) {
    const formData = new FormData()
    formData.append('passport', file)
    
    const response = await api.post('/studio/upload/passport', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response.data
  }
}

export default studioService