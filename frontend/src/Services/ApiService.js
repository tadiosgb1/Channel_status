import api from './AxiosInterceptor'

class ApiService {
  constructor() {
    this.setHeader(localStorage.getItem('access_token'))
  }

  async get(endpoint) {
    try {
      const response = await api.get(endpoint)
      return response.data
    } catch (error) {
      return error
    }
  }

  async post(endpoint, data) {
    try {
      const response = await api.post(endpoint, data)
      return response.data
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error.response || error.message || error);
      throw error; // Ensure the error propagates
    }
  }

  async patch(endpoint, data) {
    try {
      const response = await api.patch(endpoint, data)
      return response.data
    } catch (error) {
      return error
    }
  }

  async delete(endpoint) {
    try {
      const response = await api.delete(endpoint)
      return response.data
    } catch (error) {
      return error
    }
  }

  // Handle custom requests
  async request(req) {
    try {
      const response = await api.request(req)
      return response.data
    } catch (error) {
      error
    }
  }

  // Set Authorization Header
  setHeader(token) {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }

  // Remove Authorization Header
  removeHeader() {
    delete api.defaults.headers.common['Authorization']
    localStorage.removeItem('access_token')
    localStorage.removeItem('role')
    localStorage.removeItem('avatar')
    localStorage.removeItem('name')
  }

  // // Handle error for any failed requests
  // handleError(error) {
  //   console.error('API Error:', error)
  //   if (error.response) {
  //     // Server-side error
  //     if (error.response.status === 401) {
  //       // Unauthorized, maybe token expired
  //       console.log('Unauthorized request. Please log in again.')
  //       this.removeHeader()  // Clear the expired token and redirect to login
  //       window.location.href = '/login'
  //     } else {
  //       // Handle other error statuses
  //       console.log(`Error ${error.response.status}: ${error.response.data.message || error.message}`)
  //     }
  //   } else if (error.request) {
  //     // No response received
  //     console.log('No response received from server.')
  //   } else {
  //     // Other errors
  //     console.log('Error', error.message)
  //   }
  // }
}

export default ApiService
