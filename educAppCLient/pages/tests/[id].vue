<template>
  <div class="test bg-gray-100 min-h-screen p-4">
    <h1 class="text-3xl font-bold mb-6">{{ test.name }}</h1>
    <div v-if="loading" class="text-center text-gray-500">Cargando test...</div>
    <div v-else-if="test.questions.length > 0">
      <h2 class="text-xl font-semibold mb-4">Preguntas:</h2>
      <ul class="space-y-6">
        <li v-for="question in test.questions" :key="question.id" class="p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
          <strong class="text-lg">{{ question.statement }}</strong>
          <h3 class="font-semibold mt-2">Alternativas:</h3>
          <ul class="list-disc pl-5 mt-2 space-y-2">
            <li v-for="alternative in question.alternatives" :key="alternative.id">
              <label class="inline-flex items-center">
                <input 
                  type="radio" 
                  :name="`question-${question.id}`" 
                  :value="alternative.content" 
                  @change="handleAnswerChange(question.id, alternative)" 
                />
                {{ alternative.content }}
              </label>
            </li>
          </ul>
        </li>
      </ul>
      <button @click="submitTest" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Enviar Test</button>
      <div v-if="score !== null" class="mt-4">
        <h3 class="font-semibold">Resultado: {{ score }} de {{ totalQuestions }} correctas</h3>
      </div>
    </div>
    <div v-else class="text-center text-gray-500">No hay preguntas para este test.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTestStore } from '@/stores/tests';
import { useStudentsStore } from '@/stores/students';


const router = useRouter();
const testStore = useTestStore();
const studentsStore = useStudentsStore();
const loading = ref(true);
const test = ref({ name: '', questions: [] });
const selectedAnswers = ref({}); 
const score = ref(null);
const totalQuestions = ref(0);

const fetchTest = async (testId) => {
    try {
        const response = await testStore.fetchTest(testId);
        if (response) {
            test.value = response;
            totalQuestions.value = response.questions.length;
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

// Captura la respuesta seleccionada
const handleAnswerChange = (questionId, alternative) => {
    selectedAnswers.value[questionId] = alternative; // Guarda la alternativa seleccionada
};

// Calcular el puntaje
const submitTest = async () => {
    let correctAnswers = 0;

    for (const question of test.value.questions) {
        const selected = selectedAnswers.value[question.id];
        const correctAlternative = question.alternatives.find(a => a.correct); // Encuentra la respuesta correcta

        if (selected && correctAlternative && selected.id === correctAlternative.id) {
            correctAnswers++; // Incrementa el puntaje si la respuesta es correcta
        }
    }

    score.value = correctAnswers;
    await saveScore(correctAnswers);
    router.push('/landing');
};
const saveScore = async (correctAnswers) => {
    const studentId = studentsStore.user.id;
    await testStore.saveTestScore({
        studentId,
        testId: test.value.id,
        score: correctAnswers,
    });
};
</script>

<style scoped>
.test {
    max-width: 800px;
    margin: auto;
}
</style>

<script>
export default {
    middleware: 'auth'
}
</script>
