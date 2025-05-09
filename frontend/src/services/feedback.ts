import { api } from 'src/boot/axios'

interface OrderForm {
  subject: string,
  type: null | string,
  contact: string,
  message: string,
}

const feedbackService = {
  async submitFeedback(orderData: OrderForm) {
    const response = await api.post('/feedbacks/submit', orderData)
    return response.data
  }
}

export default feedbackService