import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // no fallback
});


API.interceptors.request.use((config) => {
    const user = useAuthStore.getState().user;
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default API;
