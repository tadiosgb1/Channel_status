import ApiService from './ApiService'

class AuthService extends ApiService {
  constructor() {
    super()
  }
  async logIn(data) {
    return this.post('admin/login', data)
  } catch (error) {
    console.error('Login Error:', error.response || error.message || error);
    throw error; 
  }
    async UserLogin(data) {
    return this.post('users/auth/login', data)
  } catch (error) {
    console.error('Login Error:', error.response || error.message || error);
    throw error; 
  }
}
export default new AuthService()
