import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';

export const useTestStudentsStore = defineStore('testStudents', {
  state: () => ({
    tests: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchTests(id) {
      const { $axios } = useNuxtApp();
            const apiUrl = useRuntimeConfig().public.apiUrl; 
 // Usa la variable de entorno
      this.loading = true;
      this.error = null;

      try {
        const response = await $axios.get(`${apiUrl}testStudents/${id}/tests`); // Cambia la URL aquí
        this.tests = response.data.tests; 
        return response.data;
      } catch (err) {
        this.error = err.message;
        return { status: 'Error', message: this.error }; 
      } finally {
        this.loading = false;
      }
    },
    async stats(id) {
      const { $axios } = useNuxtApp();
            const apiUrl = useRuntimeConfig().public.apiUrl; 
 // Usa la variable de entorno
      this.loading = true;
      this.error = null;

      try {
        const response = await $axios.get(`${apiUrl}testStudents/${id}/stats`); // Cambia la URL aquí
        return response.data;
      } catch (err) {
        this.error = err.message;
        return { status: 'Error', message: this.error }; 
      } finally {
        this.loading = false;
      }
    },
    async assignTest(testId, data) {
      const { $axios } = useNuxtApp();
            const apiUrl = useRuntimeConfig().public.apiUrl; 
 // Usa la variable de entorno
      this.loading = true;
      this.error = null;

      try {
        const response = await $axios.post(`${apiUrl}testStudents/${testId}/assign`, data); // Cambia la URL aquí
        return response.data;
      } catch (err) {
        this.error = err.message;
        throw err; // Puedes lanzar el error para manejarlo en el componente
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.tests = [];
      this.loading = false;
      this.error = null;
    }
  },
});
