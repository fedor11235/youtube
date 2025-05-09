import { api } from 'src/boot/axios'

interface OrderForm {
  title: string
  description: string
  budget: number
  deadline: string
}

const orderService = {
  async submitOrder(orderData: OrderForm) {
    const response = await api.post('/orders/submit', orderData)
    return response.data
  }
}

export default orderService