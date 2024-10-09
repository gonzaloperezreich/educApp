const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Asignar test a alumnos
router.post('/:test_id/assign', async (req, res) => {
    const { test_id } = req.params;
    const { students } = req.body;

    // Verificar que la solicitud incluye estudiantes
    if (!students || !Array.isArray(students)) {
        return res.status(400).json({
            status: 'Error',
            message: 'La solicitud debe incluir una lista de estudiantes.'
        });
    }

    try {
        // Verificar que la prueba existe
        const test = await prisma.test.findUnique({
            where: { id: parseInt(test_id) },
        });

        if (!test) {
            return res.status(404).json({
                status: 'Error',
                message: 'Prueba no encontrada.'
            });
        }

        // Intentar asignar la prueba a cada estudiante
        const success = [];
        const error = [];

        for (let studentId of students) {
            try {
                // Verificar si el estudiante existe
                const student = await prisma.student.findUnique({
                    where: { id: parseInt(studentId) }
                });

                if (!student) {
                    error.push(studentId);
                    continue;
                }

                // Crear la relación entre el estudiante y la prueba en la tabla TestStudent
                await prisma.testStudent.create({
                    data: {
                        studentId: student.id,
                        testId: test.id,
                    }
                });

                success.push(studentId);
            } catch (err) {
                console.error(`Error al asignar prueba al estudiante ${studentId}:`, err.message);
                error.push(studentId);
            }
        }

        // Responder con éxito o errores
        res.status(200).json({
            status: 'Ok',
            success,
            error,
        });
    } catch (err) {
        console.error('Error al asignar prueba:', err.message);
        res.status(500).json({
            status: 'Error',
            message: 'Error al asignar la prueba.'
        });
    }
});
router.get('/:student_id/tests', async (req, res) => {
    const { student_id } = req.params;
  
    try {
        // Obtener todas las relaciones test-student para el estudiante
        const studentTests = await prisma.testStudent.findMany({
            where: { studentId: parseInt(student_id) },
            include: {
                test: {
                    include: {
                        questions: true,
                    }
                }
            }
        });
  
        if (!studentTests || studentTests.length === 0) {
            return res.status(404).json({
                status: 'Error',
                message: 'No hay pruebas asignadas a este estudiante.'
            });
        }
  
        // Extraer los datos del test y el score
        const tests = studentTests.map((testStudent) => ({
            id: testStudent.test.id,
            name: testStudent.test.name,
            questions: testStudent.test.questions,
            score: testStudent.score !== null ? testStudent.score : 'Pendiente',
            releaseAnswers: testStudent.test.releaseAnswers
        }));
  
        res.status(200).json({
            status: 'Ok',
            tests
        });
  
    } catch (err) {
        console.error('Error al obtener pruebas del estudiante:', err.message);
        res.status(500).json({
            status: 'Error',
            message: 'Error al obtener pruebas del estudiante.'
        });
    }
  });
  // Obtener cantidad total de testStudent y cuántos tienen score != null para un test específico
    router.get('/:test_id/stats', async (req, res) => {
    const { test_id } = req.params;

    try {
        // Contar el total de testStudent para el test específico
        const totalCount = await prisma.testStudent.count({
            where: { testId: parseInt(test_id) }
        });

        // Contar cuántos testStudent tienen score != null para el test específico
        const answeredCount = await prisma.testStudent.count({
            where: {
                testId: parseInt(test_id),
                score: { not: null }, // Filtrar los que tienen score distinto de null
            },
        });

        // Devolver la respuesta con ambos conteos
        res.status(200).json({
            status: 'Ok',
            totalCount,
            answeredCount,
        });

    } catch (err) {
        console.error('Error al obtener estadísticas del test:', err.message);
        res.status(500).json({
            status: 'Error',
            message: 'Error al obtener estadísticas del test.'
        });
    }
});

  
module.exports = router;
