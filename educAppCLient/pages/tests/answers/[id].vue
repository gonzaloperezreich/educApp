<template>
  <div class="answers bg-gray-100 min-h-screen p-4">
    <h1 class="text-3xl font-bold mb-6">Respuestas del Test: {{ test.name }}</h1>
    <div v-if="loading" class="text-center text-gray-500">Cargando respuestas...</div>
    <div v-else-if="test.questions.length > 0">
      <ul class="space-y-6">
        <li v-for="question in test.questions" :key="question.id" class="p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
          <strong class="text-lg">{{ question.statement }}</strong>
          <p class="text-sm text-gray-600 mt-1">{{ question.explanation }}</p>
          <h3 class="font-semibold mt-2">Alternativas:</h3>
          <ul class="list-disc pl-5 mt-2 space-y-2">
            <li v-for="alternative in question.alternatives" :key="alternative.id">
              <span :class="{ 'font-bold': alternative.correct }">{{ alternative.content }}</span>
              <span v-if="alternative.correct" class="text-green-600"> (Correcta)</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div v-else class="text-center text-gray-500">No hay preguntas para este test.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTestStore } from '@/stores/tests';

const router = useRouter();
const testStore = useTestStore();
const loading = ref(true);
const test = ref({ name: '', questions: [] });

const fetchTest = async (testId) => {
    try {
        const response = await testStore.fetchTest(testId);
        if (response) {
            test.value = response;
        }
    } catch (err) {
        console.error(err);
    } finally {
        loading.value = false;
    }
};

// Obtener el ID del test de la ruta
onMounted(() => {
    const { id } = router.currentRoute.value.params; 
    fetchTest(id);
});
</script>

<style scoped>
.answers {
    max-width: 800px;
    margin: auto;
}
</style>

<script>
export default {
    middleware: 'auth'
}
</script>
