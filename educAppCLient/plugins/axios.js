// plugins/axios.js
import { defineNuxtPlugin } from '#app';
import axios from 'axios';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const axiosInstance = axios.create({
    baseURL: config.public.apiUrl, 
    timeout: 10000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  axiosInstance.interceptors.request.use(
    async (axiosConfig) => {
      // Agrega el token de autenticación aquí si está presente
      if (process.client) {
        const token = localStorage.getItem('auth_token');
        if (token) {
          axiosConfig.headers.Authorization = `Bearer ${token}`;
        }
      }
      return axiosConfig;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Hacer que axiosInstance esté disponible a través de la aplicación Nuxt
  nuxtApp.provide('axios', axiosInstance);
});
