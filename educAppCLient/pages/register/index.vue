<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 class="text-3xl font-semibold text-center text-gray-800 mb-6">Crear Cuenta</h1>
        <form @submit.prevent="handleRegister">
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
          <div class="mb-4">
            <label for="name" class="block text-gray-700 mb-2">Nombre</label>
            <input
              v-model="name"
              type="text"
              id="name"
              placeholder="Ingrese su nombre"
              class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div class="mb-6">
            <label for="password" class="block text-gray-700 mb-2">Contraseña</label>
            <input
              v-model="password"
              type="password"
              id="password"
              placeholder="Cree una contraseña"
              class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <button type="submit" class="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600">
            Crear cuenta
          </button>
          <p v-if="error" class="mt-4 text-red-500 text-center">{{ error }}</p>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { useStudentsStore } from '@/stores/students';
  
  const rut = ref('');
  const name = ref('');
  const password = ref('');
  const error = ref('');
  const studentsStore = useStudentsStore();
  const router = useRouter();
  
  const handleRegister = async () => {
    error.value = ''; // Reinicia el error
  
    try {
      // Llamada a la API de registro
      const response = await studentsStore.registerStudent({ rut: rut.value, name: name.value, password: password.value });
      if (response.pass) {
        // Redirige al usuario a la página de inicio de sesión tras el registro
        router.push('/login');
      } else {
        error.value = 'Error al crear la cuenta. Intente nuevamente.';
      }
    } catch (err) {
      error.value = 'Error al registrar. Por favor, intente nuevamente.';
    }
  };
  </script>
  