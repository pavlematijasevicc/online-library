import axios from 'axios';

const api = axios.create({
baseURL: 'http://0.0.0.0:80/api',
  headers: {
    accept: 'application/json',
  },
});

async function logout(){
  localStorage.removeItem('access_token');
}

// Request interceptor → dodaj token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor → presretni 401 i progutaj ga
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await logout()
      // vrati "prazan" rezultat umesto greške
      return new Promise(() => {}) // beskonačni pending → ne baca dalje error
    }
    return Promise.reject(error)
  }
)
export default api;