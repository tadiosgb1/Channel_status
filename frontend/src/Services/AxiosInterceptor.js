import axios from 'axios'
import { BASE_URL } from '@/config'
import router from '@/router'

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear()
      if (router.currentRoute.value.name !== 'login') {
        router.replace({ name: 'login' })
      }
    }

    return Promise.reject(error)
  }
)

export default api
