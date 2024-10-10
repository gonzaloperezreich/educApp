<template>
  <div class="admin-panel bg-gray-100 min-h-screen p-4">
    <h1 class="text-3xl font-bold mb-6">Panel de Administración</h1>
    
    <h2 class="text-2xl mb-4">Crear Test</h2>
    <form @submit.prevent="createTest">
      <div class="mb-4">
        <label for="testName" class="block text-gray-700">Nombre del Test</label>
        <input v-model="testName" type="text" id="testName" class="w-full p-2 border border-gray-300 rounded" required />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700">Preguntas:</label>
        <div v-for="(question, index) in questions" :key="index" class="border p-2 mb-4 rounded">
          <input v-model="question.statement" placeholder="Enunciado de la pregunta" class="w-full p-2 border border-gray-300 rounded mb-2" required />
          <input v-model="question.explanation" placeholder="Explicación" class="w-full p-2 border border-gray-300 rounded mb-2" required />

          <!-- Selector de axisType -->
          <label class="block text-gray-700">Tipo de Eje:</label>
          <select v-model="question.axisType" class="w-full p-2 border border-gray-300 rounded mb-2" required>
            <option value="">Selecciona un tipo de eje</option>
            <option value="Numeros">Números</option>
            <option value="Geometria">Geometría</option>
            <option value="AlgebraYFunciones">Álgebra y Funciones</option>
            <option value="ProbabilidadYEstadisticas">Probabilidad y Estadísticas</option>
          </select>

          <h3 class="font-semibold">Alternativas:</h3>
          <div v-for="(alternative, altIndex) in question.alternatives" :key="altIndex" class="mb-2">
            <input v-model="alternative.content" placeholder="Contenido de la alternativa" class="w-full p-2 border border-gray-300 rounded mb-1" required />
            <label>
              <input 
                type="radio" 
                :name="`correct-${index}`" 
                v-model="question.correctAlternative" 
                :value="altIndex" 
                class="mr-1"
              />
              Correcta
            </label>
          </div>
          <button type="button" @click="addAlternative(index)" class="bg-blue-500 text-white px-2 py-1 rounded">Agregar Alternativa</button>
          <button type="button" @click="removeQuestion(index)" class="bg-red-500 text-white px-2 py-1 rounded">Eliminar Pregunta</button>
        </div>
        <button type="button" @click="addQuestion" class="bg-blue-500 text-white px-2 py-1 rounded">Agregar Pregunta</button>
      </div>
      
      <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Crear Test</button>
    </form>

    <div v-if="successMessage" class="mt-4 text-green-600">{{ successMessage }}</div>
    <div v-if="errorMessage" class="mt-4 text-red-600">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useTestStore } from '@/stores/tests';
import { useRouter } from "vue-router";

const testStore = useTestStore();
const testName = ref('');
const questions = ref([{ statement: '', explanation: '', axisType: '', alternatives: [{ content: '', correct: false }], correctAlternative: null }]);
const successMessage = ref('');
const errorMessage = ref('');
const router = useRouter();
const addQuestion = () => {
  questions.value.push({ statement: '', explanation: '', axisType: '', alternatives: [{ content: '', correct: false }], correctAlternative: null });
};

const removeQuestion = (index) => {
  questions.value.splice(index, 1);
};

const addAlternative = (questionIndex) => {
  questions.value[questionIndex].alternatives.push({ content: '', correct: false });
};

const createTest = async () => {
  const newTest = {
    name: testName.value,
    questions: questions.value.map(question => ({
      statement: question.statement,
      explanation: question.explanation,
      axisType: question.axisType, 
      alternatives: question.alternatives.map((alt, index) => ({
        content: alt.content,
        correct: index === question.correctAlternative
      }))
    })),
  };

  try {
    await testStore.createTest(newTest);
    successMessage.value = 'Test creado exitosamente!';
    errorMessage.value = '';

    // Limpiar el formulario
    testName.value = '';
    questions.value = [{ statement: '', explanation: '', axisType: '', alternatives: [{ content: '', correct: false }], correctAlternative: null }];
    router.push('/admin');
  } catch (error) {
    errorMessage.value = 'Error al crear el test. Intenta nuevamente.';
    successMessage.value = '';
  }
};
</script>

<style scoped>
.admin-panel {
  max-width: 800px;
  margin: auto;
}
</style>
<script>
export default {
  middleware: 'auth',
    layout: 'default'
}
</script>