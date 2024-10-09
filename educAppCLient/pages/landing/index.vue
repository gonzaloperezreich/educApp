<template>
  <div class="dashboard bg-gray-100 min-h-screen min-w-screen p-4">
    <h1 v-if="studentsStore.user" class="text-3xl font-bold mb-6">Bienvenido, {{ studentsStore.user.name }}!</h1>
    <p class="text-lg">Tus pruebas disponibles:</p>

    <div v-if="loading" class="text-center text-gray-500">Cargando pruebas...</div>

    <div v-else-if="testStudentsStore.tests && testStudentsStore.tests.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="test in testStudentsStore.tests" :key="test.id" class="bg-white p-4 rounded shadow">
        <h2 class="text-xl font-semibold">{{ test.name }}</h2>
        <p class="mt-2">Número de preguntas: {{ test.questions.length }}</p>
        <button v-if="test.score == null" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded" @click="startTest(test.id)">
          Empezar Prueba
        </button>
        <div v-else class="mt-2">
          <h3 class="font-semibold">Test ya respondido:</h3>
          <div v-if="test.releaseAnswers">
            <p class="bg-green-300">Resultado: {{ test.score }} de {{ test.questions.length }} correctas</p>
            <button class="mt-4 bg-blue-500 text-white px-4 py-2 rounded" @click="viewAnswers(test.id)">
              Ver respuestas  
            </button>
          </div>
          <p class="bg-yellow-300" v-else>Esperando corrección del profesor</p>
        </div>
        <div class="mt-2">
          <h3 class="font-semibold">Preguntas: {{ test.questions.length }}</h3>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500">
      No tienes pruebas disponibles en este momento.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTestStudentsStore } from '@/stores/testStudents'; 
import { useStudentsStore } from '@/stores/students';

const testStudentsStore = useTestStudentsStore(); 
const router = useRouter();
const loading = ref(true);
const studentsStore = useStudentsStore();

onMounted(() => {
  studentsStore.checkAuth().then(() => {
    if (!studentsStore.isAuthenticated) {
      router.push('/login');
    } else {
      fetchTests(studentsStore.user.id);
    }
  });
});

const fetchTests = async (studentId) => {
  try {
    await testStudentsStore.fetchTests(studentId);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false; // Detén la carga al finalizar la llamada
  }
};

const startTest = (testId) => {
  // Redirige al usuario a la página del test
  router.push(`/tests/${testId}`);
};

const viewAnswers = (testId) => {
  // Redirige al usuario a la página donde puede ver las respuestas
  router.push(`/tests/answers/${testId}`);
};
</script>
