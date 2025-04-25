import { api } from 'src/boot/axios'

class FileError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FileError'
  }
}

const fileService = {
  async uploadFile(fileName: string) {
    try {
      // const response = await api.post('/files/upload', {fileName})
      const response = await api.get(`/files/upload/${fileName}`)

      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw new FileError(error.message)
      }
      throw new FileError('Failed to upload video')
    }
  }
}

export default fileService