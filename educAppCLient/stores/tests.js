import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';

export const useTestStore = defineStore('test', {
  state: () => ({
    tests: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAllTests() {
      const { $axios } = useNuxtApp();
      const apiUrl = useRuntimeConfig().public.apiUrl; 
      this.loading = true;
      this.error = null;

      try {
        const response = await $axios.get(`${apiUrl}test/allTests`);
        this.tests = response.data.tests; 
        return this.tests;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async fetchTest(id) {
      const { $axios } = useNuxtApp();
      const apiUrl = useRuntimeConfig().public.apiUrl; 
      this.loading = true;
      this.error = null;

      try {
        const response = await $axios.get(`${apiUrl}test/find/${id}`); 
        return response.data.test;
      } catch (err) {
        this.error = err.message;
        return null;
      } finally {
        this.loading = false;
      }
    },
    async saveTestScore({ studentId, testId, score }) {
      const { $axios } = useNuxtApp();
      const apiUrl = useRuntimeConfig().public.apiUrl; 
      try {
        const response = await $axios.post(`${apiUrl}test/${testId}/score`, {
          studentId,
          score,
        });
        return response.data;
      } catch (error) {
        console.error('Error al guardar el puntaje:', error);
        throw error;
      }
    },
    async createTest(testData) {
      const { $axios } = useNuxtApp();
      const apiUrl = useRuntimeConfig().public.apiUrl; 
      this.loading = true;
      this.error = null;

      try {
        const response = await $axios.post(`${apiUrl}test`, testData); 
        this.tests.push(response.data);
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateReleaseAnswers(testId) {
      const { $axios } = useNuxtApp();
      const apiUrl = useRuntimeConfig().public.apiUrl; 
      this.loading = true;
      this.error = null;

      try {
        const response = await $axios.patch(`${apiUrl}test/release/${testId}`); 
        return response.data; 
      } catch (err) {
        this.error = err.message;
        throw err; 
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
