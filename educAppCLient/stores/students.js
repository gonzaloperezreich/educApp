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

      this.loading = true;
      this.error = null;

      try {
      const response = await $axios.get('http://localhost:4000/api/students'); 
        this.students = response.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async registerStudent(studentData) {
      const { $axios } = useNuxtApp();

      this.loading = true;
      this.error = null;

      try {
        const response = await $axios.post('http://localhost:4000/api/students', studentData);
        return response.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async loginStudent(credentials) {
      const { $axios } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $axios.post('http://localhost:4000/api/students/login', credentials);
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
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        try {
          const response = await $axios.get('http://localhost:4000/api/students/me', {
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