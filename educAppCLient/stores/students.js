import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';

export const useStudentsStore = defineStore('students', {
  state: () => ({
    students: [],
    loading: false,
    error: null,
    user: null,
    isAuthenticated: false,
    isAdmin: false,
  }),
  actions: {
    async fetchStudents() {
      const { $axios } = useNuxtApp();
            const apiUrl = useRuntimeConfig().public.apiUrl; 
 // Usa la variable de entorno

      this.loading = true;
      this.error = null;

      try {
        const response = await $axios.get(`${apiUrl}students`); // Cambia la URL aquí
        this.students = response.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async registerStudent(studentData) {
      const { $axios } = useNuxtApp();
            const apiUrl = useRuntimeConfig().public.apiUrl; 
 // Usa la variable de entorno

      this.loading = true;
      this.error = null;

      try {
        const response = await $axios.post(`${apiUrl}students`, studentData); // Cambia la URL aquí
        return response.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async loginStudent(credentials) {
      const { $axios } = useNuxtApp();
      const apiUrl = useRuntimeConfig().public.apiUrl; 
      console.log(apiUrl);
      this.loading = true;
      this.error = null;

      try {
        const response = await $axios.post(`${apiUrl}students/login`, credentials); // Cambia la URL aquí
        if (response.data.pass) {
          this.user = response.data.student;
          this.isAuthenticated = true;
          localStorage.setItem('auth_token', response.data.token);
        }
        return response.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async checkAuth() {
      const { $axios } = useNuxtApp();
      const apiUrl = useRuntimeConfig().public.apiUrl; 
 // Usa la variable de entorno
      const token = localStorage.getItem('auth_token');

      if (token) {
        try {
          const response = await $axios.get(`${apiUrl}students/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.user = response.data;
          if (this.user.name === 'admin') {
            this.isAdmin = true;
          }
          this.isAuthenticated = true;
        } catch (error) {
          this.logout();
        }
      }
    },
    
    logout() {
      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem('auth_token');
      this.isAdmin = false;
    }  
  },
});
