// middleware/guest.js
import { useStudentsStore } from '@/stores/students';

export default function ({ redirect }) {
  const studentsStore = useStudentsStore();

  if (studentsStore.isAuthenticated) {
    return redirect('/landing'); // Redirigir a landing si ya está autenticado
  }
}
