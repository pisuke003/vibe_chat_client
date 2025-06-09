import axios from "axios";


export const URL = 'https://vibe-chat-api.onrender.com';

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
