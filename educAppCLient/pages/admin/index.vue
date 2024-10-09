<template>
  <div class="admin-panel" v-if="studentsStore.isAdmin">
    <h3 class="text-3xl font-bold mb-6">Panel de Administración</h3>

    <button @click="router.push('/admin/testForm')" class="bg-blue-500 text-white px-4 py-2 rounded mb-4">
      Crear un nuevo Test
    </button>
    
    <div class="bg-gray-200 p-8 rounded-lg mb-8">
      <h4 class="text-xl mb-4">Asignar Test a Estudiantes</h4>
      <form @submit.prevent="assignTest">
        <div class="mb-4">
          <label for="testId" class="block text-gray-700">Seleccionar Test</label>
          <select v-model="selectedTestId" class="border border-gray-300 rounded p-2 w-full">
            <option v-for="test in tests" :key="test.id" :value="test.id">
              {{ test.name }}
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Seleccionar Estudiantes</label>
          <select 
            v-model="currentStudentId" 
            @change="addStudent"
            class="border border-gray-300 rounded p-2 w-full"
          >
            <option value="">Seleccionar estudiante</option>
            <option v-for="student in availableStudents" :key="student.id" :value="student.id">
              {{ student.name }}
            </option>
          </select>
        </div>

        <div v-if="selectedStudents.length > 0" class="mb-4">
          <p class="font-semibold">Estudiantes seleccionados:</p>
          <ul class="list-disc pl-5">
            <li v-for="student in selectedStudents" :key="student.id" class="flex justify-between items-center mb-2">
              {{ student.name }}
              <button @click.prevent="removeStudent(student.id)" class="text-red-500 hover:text-red-700">
                Eliminar
              </button>
            </li>
          </ul>
        </div>
        <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Asignar Test</button>
      </form>

      <div v-if="successMessage" class="mt-4 text-green-600">{{ successMessage }}</div>
      <div v-if="errorMessage" class="mt-4 text-red-600">{{ errorMessage }}</div>
    </div>

    <div v-if="loading" class="text-gray-500">Cargando tests...</div>

    <div v-else>
      <h4 class="text-xl font-semibold mb-4">Tests Existentes</h4>
      <ul class="list-disc pl-5">
        <li v-for="test in tests" :key="test.id" class="mb-2 flex justify-between items-center">
          <div>
            <p>{{ test.name }}</p>
            <p>{{ testStats[test.id]?.answeredCount }}/{{ testStats[test.id]?.totalCount }} Respondidos</p>
          </div>
          <button 
            @click.prevent="toggleReleaseAnswers(test.id)"
            class="bg-yellow-500 text-white px-2 py-1 rounded flex items-center"
            :disabled="loadingStates[test.id]"
          >
            <span v-if="loadingStates[test.id]" class="mr-2">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ test.releaseAnswers ? 'Desactivar Respuestas' : 'Activar Respuestas' }}
          </button>
        </li>
      </ul>
    </div>
  </div>

  <div v-else class="no-permission">
    <p class="text-red-500 text-lg">No tienes permisos para acceder a esta página.</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTestStore } from '@/stores/tests';
import { useStudentsStore } from '@/stores/students';
import { useTestStudentsStore } from '@/stores/testStudents';

const router = useRouter();
const testStore = useTestStore();
const testStudentsStore = useTestStudentsStore();
const studentsStore = useStudentsStore();
const loading = ref(true);
const errorMessage = ref('');
const successMessage = ref('');
const selectedStudents = ref([]);
const currentStudentId = ref('');
const selectedTestId = ref(null);
const tests = ref([]);
const testStats = ref({});
const loadingStates = ref({});

const availableStudents = computed(() => {
  return studentsStore.students.filter(student => !selectedStudents.value.some(s => s.id === student.id));
});

const addStudent = () => {
  if (currentStudentId.value) {
    const studentToAdd = studentsStore.students.find(s => s.id === currentStudentId.value);
    if (studentToAdd) {
      selectedStudents.value.push(studentToAdd);
      currentStudentId.value = ''; 
    }
  }
};

const removeStudent = (studentId) => {
  selectedStudents.value = selectedStudents.value.filter(s => s.id !== studentId);
};

const assignTest = async () => {
  if (!selectedTestId.value || selectedStudents.value.length === 0) {
    errorMessage.value = 'Por favor, selecciona un test y al menos un estudiante.';
    return;
  }

  try {
    await testStudentsStore.assignTest(selectedTestId.value, {
      students: selectedStudents.value.map(s => s.id),
    });
    successMessage.value = 'Test asignado exitosamente!';
    errorMessage.value = '';
    // Reset selections after successful assignment
    selectedTestId.value = null;
    selectedStudents.value = [];
  } catch (error) {
    errorMessage.value = 'Error al asignar el test. Intenta nuevamente.';
    successMessage.value = '';
  }
};

const toggleReleaseAnswers = async (testId) => {
  if (loadingStates.value[testId]) return; // Prevent multiple clicks

  loadingStates.value[testId] = true;
  try {
    const currentState = tests.value.find(test => test.id === testId)?.releaseAnswers;
    await testStore.updateReleaseAnswers(testId);
    // Update the state in tests array
    const testIndex = tests.value.findIndex(test => test.id === testId);
    if (testIndex !== -1) {
      tests.value[testIndex].releaseAnswers = !currentState;
    }
  } catch (error) {
    errorMessage.value = 'Error al cambiar el estado de respuestas. Intenta nuevamente.';
  } finally {
    loadingStates.value[testId] = false;
  }
};

onMounted(async () => {
  try {
    tests.value = await testStore.fetchAllTests();
    await studentsStore.fetchStudents();
    // Initialize loading states for each test
    tests.value.forEach(test => {
      loadingStates.value[test.id] = false;
    });
    // Fetch stats for each test and store in testStats
    for (const test of tests.value) {
      const stats = await testStudentsStore.stats(test.id);
      testStats.value[test.id] = stats;
    }
  } catch (error) {
    errorMessage.value = 'Error al cargar los datos. Intenta nuevamente.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.admin-panel {
  max-width: 800px;
  margin: auto;
}

.no-permission {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}
</style>

<script>
export default {
  middleware: 'auth',
  layout: 'default'
}
</script>