<!-- components/Navbar.vue -->
<template>
    <nav class="navbar bg-gray-800 text-white p-4 mb-8">
      <div class="flex justify-between items-center w-full">
        <!-- Enlaces de navegación a la izquierda -->
        <ul class="flex space-x-4">
          <li>
            <NuxtLink to="/landing" class="nav-link">Página Principal</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin" class="nav-link">Panel de administración</NuxtLink>
          </li>
        </ul>
  
        <!-- Botón de Logout a la derecha -->
        <button @click="handleLogout" class="logout-button text-white bg-red-500 px-4 py-2 rounded">
          Logout
        </button>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { useStudentsStore } from '@/stores/students';
  import { useTestStore } from '@/stores/tests';
  import { useTestStudentsStore } from '@/stores/testStudents';
  const router = useRouter();
  const studentsStore = useStudentsStore();
  const testStore = useTestStore();
  const testStudentsStore = useTestStudentsStore();
  
  const handleLogout = () => {
    testStore.logout();
    testStudentsStore.logout();
    studentsStore.logout();
    router.push('/login');
  };
  </script>
  
  <style scoped>
  .navbar {
    background-color: #1f2937;
    color: #ffffff;
  }
  
  .nav-link {
    color: #ffffff;
    text-decoration: none;
    transition: color 0.3s ease, transform 0.3s ease;
  }
  
  .nav-link:hover {
    color: #38bdf8;
    transform: scale(1.05);
  }
  
  .logout-button {
    transition: background-color 0.3s ease;
  }
  
  .logout-button:hover {
    background-color: #ef4444; /* Un tono más fuerte de rojo al hacer hover */
  }
  </style>
  