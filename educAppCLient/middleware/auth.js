// middleware/auth.js
import { useStudentsStore } from '@/stores/students';

export default async function ({ redirect }) {
  const studentsStore = useStudentsStore();
  await studentsStore.checkAuth();

  if (!studentsStore.isAuthenticated) {
    return redirect('/login');
  }
}
