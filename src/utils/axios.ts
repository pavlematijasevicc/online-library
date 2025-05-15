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

//Interceptor

api.interceptors.request.use(
  (config)=>{
    //uzmi token iz localStorage-a
    const token=localStorage.getItem('access_token');
      //Ako token postoji, dodaj ga u Authorization header
    if(token){
      config.headers.Authorization=`Bearer ${token}`;
    }
    

    return config;
  },
  async (error)=>{
    if(error.response?.status===401){
      await logout();
    }
    return Promise.reject(error);
  }
  
)

export default api;