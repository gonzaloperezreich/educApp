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

        this.loading = true;
        this.error = null;
        try {
            const response = await $axios.get(`http://localhost:4000/api/testStudents/${id}/tests`);
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
        this.loading = true;
        this.error = null;
        try {
            const response = await $axios.get(`http://localhost:4000/api/testStudents/${id}/stats`);
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
        this.loading = true;
        this.error = null;
        try {
          const response = await $axios.post(`http://localhost:4000/api/testStudents/${testId}/assign`, data);
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
