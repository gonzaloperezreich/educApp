<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
      <h1 class="text-3xl font-semibold text-center text-gray-800 mb-6">Bienvenido</h1>
      <form @submit.prevent="handleLogin" v-if="!loading">
        <div class="mb-4">
          <label for="rut" class="block text-gray-700 mb-2">RUT</label>
          <input
            v-model="rut"
            type="text"
            id="rut"
            placeholder="Ingrese su RUT"
            class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-gray-700 mb-2">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            placeholder="Ingrese su contraseña" 
            class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500" 
            autocomplete="current-password"
          />
        </div>
        <button type="submit" class="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600">
          Iniciar sesión
        </button>
        <p v-if="error" class="mt-4 text-red-500 text-center">{{ error }}</p>
        <p class="mt-4 text-center text-gray-600">
          ¿No tienes una cuenta?
          <router-link to="/register" class="text-blue-500 hover:underline">Regístrate aquí</router-link>.
        </p>
      </form>
      <div v-if="loading" class="text-center">
        <p class="text-gray-500">Cargando...</p>
        <svg class="animate-spin h-5 w-5 text-blue-500 mx-auto" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStudentsStore } from '@/stores/students';

const rut = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false); // Variable para el estado de carga
const studentsStore = useStudentsStore();
const router = useRouter();

const handleLogin = async () => {
  error.value = '';
  loading.value = true; // Activa el loading

  try {
    const response = await studentsStore.loginStudent({ rut: rut.value, password: password.value });
    if (response.pass) {
      await router.push('/landing');
    } else {
      error.value = 'Usuario o contraseña incorrectos.';
    }
  } catch (err) {
    error.value = 'Error al iniciar sesión. Por favor, intente nuevamente.';
  } finally {
    loading.value = false; // Desactiva el loading
  }
};

onMounted(async () => {
  loading.value = true; // Activa el loading al iniciar la verificación
  await studentsStore.checkAuth();
  if (studentsStore.isAuthenticated) {
    router.push('/landing');
  }
  loading.value = false; // Desactiva el loading al terminar la verificación
});
</script>

<script>
export default {
  middleware: 'guest',
  layout: 'empty'
}
</script>

<style scoped>
/* Estilo para el spinner */
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
