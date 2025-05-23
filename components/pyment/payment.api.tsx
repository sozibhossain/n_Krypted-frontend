import axios from 'axios'

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

export const getClientToken = async () => {
  const res = await API.get('/api/payments/client-token')
  return res.data.clientToken
}

export const makePayment = async (data: {
  amount: string
  paymentMethodNonce: string
  userId: string
  bookingId: string
  seasonId?: string
}) => {
  const res = await API.post('api/payments/checkout', data)
  return res.data
}
