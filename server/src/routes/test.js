const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
    const { name, questions } = req.body;
    // Verificar que el formato de la solicitud es correcto
    if (!name || !questions || !Array.isArray(questions)) {
        return res.status(400).json({
            status: 'Error',
            message: 'Formato de prueba incorrecto. Debe incluir un nombre y un arreglo de preguntas.'
        });
    }

    // Validar las preguntas y alternativas
    try {
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            if (!question.statement || !question.explanation || !question.alternatives || !Array.isArray(question.alternatives)) {
                throw new Error(`[!] Error con la pregunta número ${i + 1}. Debe incluir enunciado, explicación y alternativas.`);
            }

            for (let j = 0; j < question.alternatives.length; j++) {
                const alternative = question.alternatives[j];
                if (!alternative.content || typeof alternative.correct !== 'boolean') {
                    throw new Error(`[!] Error en la alternativa número ${j + 1} de la pregunta número ${i + 1}. Debe incluir contenido y un valor booleano para "correct".`);
                }
            }
        }

        // Crear la prueba y las preguntas con alternativas
        const newTest = await prisma.test.create({
            data: {
                name,
                score: 0,
                questions: {
                    create: questions.map(q => ({
                        statement: q.statement,
                        explanation: q.explanation,
                        axisType: q.axisType,
                        alternatives: {
                            create: q.alternatives.map(a => ({
                                content: a.content,
                                correct: a.correct
                            }))
                        }
                    }))
                }
            },
            include: {
                questions: {
                    include: {
                        alternatives: true
                    }
                }
            }
        });

        // Responder con éxito
        res.status(201).json({
            status: 'Ok',
            id: newTest.id,
            message: ''
        });

    } catch (error) {
        console.error('Error al crear prueba:', error.message);
        res.status(400).json({
            status: 'Error',
            message: error.message
        });
    }
});

router.get('/find/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Obtener la prueba con las preguntas y alternativas
        const test = await prisma.test.findUnique({
            where: { id: parseInt(id) },
            include: {
                questions: {
                    include: {
                        alternatives: true
                    }
                }
            }
        });

        if (!test) {
            return res.status(404).json({
                status: 'Error',
                message: 'Prueba no encontrada.'
            });
        }

        // Responder con éxito y con las preguntas y alternativas
        res.status(200).json({
            status: 'Ok',
            test
        });

    } catch (error) {
        console.error('Error al obtener la prueba:', error.message);
        res.status(500).json({
            status: 'Error',
            message: 'Error al obtener la prueba.'
        });
    }
});
router.post('/:id/score', async (req, res) => {
    const { studentId, score } = req.body;

    try {
        // Verifica si ya existe una relación entre el estudiante y el test
        let testStudent = await prisma.testStudent.findUnique({
            where: {
                studentId_testId: {
                    studentId: parseInt(studentId),
                    testId: parseInt(req.params.id),
                },
            },
        });

        if (!testStudent) {
            // Si no existe, crea una nueva relación
            testStudent = await prisma.testStudent.create({
                data: {
                    studentId: parseInt(studentId),
                    testId: parseInt(req.params.id),
                    score: score,
                },
            });
        } else {
            // Si existe, actualiza el puntaje
            testStudent = await prisma.testStudent.update({
                where: { id: testStudent.id },
                data: { score: score },
            });
        }

        res.status(200).json({ status: 'Ok', testStudent });
    } catch (error) {
        console.error('Error al guardar el puntaje:', error.message);
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
router.get('/allTests', async (req, res) => {
    try {
      const tests = await prisma.test.findMany({
        include: {
          questions: true,
        },
      });
  
      res.status(200).json({
        status: 'Ok',
        tests,
      });
    } catch (error) {
      console.error('Error al obtener los tests:', error.message);
      res.status(500).json({
        status: 'Error',
        message: 'Error al obtener los tests.',
      });
    }
  });
  router.patch('/release/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Obtener el test existente
      const existingTest = await prisma.test.findUnique({
        where: { id: parseInt(id) },
        select: { releaseAnswers: true }, // Solo seleccionamos el campo releaseAnswers
      });
  
      if (!existingTest) {
        return res.status(404).json({
          status: 'Error',
          message: 'Test no encontrado.',
        });
      }
  
      // Alternar el valor de releaseAnswers
      const updatedTest = await prisma.test.update({
        where: { id: parseInt(id) },
        data: { releaseAnswers: !existingTest.releaseAnswers }, // Cambiar el valor actual
      });
  
      res.status(200).json({
        status: 'Ok',
        message: 'Las respuestas del test han sido liberadas.',
        test: updatedTest,
      });
    } catch (error) {
      console.error('Error al liberar respuestas del test:', error.message);
      res.status(500).json({
        status: 'Error',
        message: 'Error al liberar las respuestas del test.',
      });
    }
  });
  
  


module.exports = router;
