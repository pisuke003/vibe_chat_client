import axios from "axios";


export const URL = 'http://localhost:3000';

export const axiosInstance = axios.create({
  baseURL: URL,
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
