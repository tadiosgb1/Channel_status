import api from './AxiosInterceptor'

class ApiService {
  constructor() {
    this.setHeader(localStorage.getItem('access_token'))
  }
async get(endpoint, params = {}) {
  try {
    const response = await api.get(endpoint, { params })  // only wrap once
    return response.data
  } catch (error) {
    console.error(`GET ${endpoint} failed:`, error.response || error.message || error)
    throw error
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


}

export default ApiService
