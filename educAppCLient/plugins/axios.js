// plugins/axios.js
import { defineNuxtPlugin } from '#app';
import axios from 'axios';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const axiosInstance = axios.create({
    baseURL: config.public.NUXT_API_URL,
    timeout: 10000, // Request timeout
    withCredentials: false,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  // Make axiosInstance available through the Nuxt app
  // This allows you to use it globally in your application through `useNuxtApp`
  nuxtApp.provide('axios', axiosInstance);
});
