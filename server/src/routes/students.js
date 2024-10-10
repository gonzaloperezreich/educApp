const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt'); // Asegúrate de haber instalado bcrypt
const authMiddleware = require('../../middlewares/authMiddleware');

router.get('/testing', (req, res) => {
    res.send('¡Hola, mundo!');
  });
// Ruta para obtener los datos del estudiante autenticado
router.get('/me', authMiddleware, async (req, res) => {
    try {
        // Usamos el studentId que guardamos en req cuando verificamos el token
        const student = await prisma.student.findUnique({
            where: { id: req.studentId },
        });

        if (!student) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }

        res.json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los datos del estudiante' });
    }
});
// Ruta para obtener todos los estudiantes
router.get('/', async (req, res) => {
    try {
        const students = await prisma.student.findMany();
        res.json(students);
    } catch (error) {
        console.error(error); // Para depuración
        res.status(500).json({ error: 'Error al obtener estudiantes' });
    }
});

// Ruta para crear un nuevo estudiante (registro)
router.post('/', async (req, res) => {
    const { name, rut, password } = req.body; // Asegúrate de recibir la contraseña
    try {
        // Verifica si el RUT ya está registrado
        const existingStudent = await prisma.student.findUnique({
            where: { rut },
        });

        if (existingStudent) {
            return res.status(400).json({ error: 'El RUT ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hashea la contraseña
        const newStudent = await prisma.student.create({
            data: { name, rut, password: hashedPassword },
        });
        res.status(201).json({newStudent, pass:true});
    } catch (error) {
        console.error(error); // Para depuración
        res.status(500).json({ error: 'Error al crear estudiante' });
    }
});

const jwt = require('jsonwebtoken');

// Ruta para el login de un estudiante
router.post('/login', async (req, res) => {
    const { rut, password } = req.body;
    try {
        const student = await prisma.student.findUnique({
            where: { rut },
        });

        if (!student) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(password, student.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Genera el token JWT
        const token = jwt.sign({ id: student.id }, 'tu_secreto', { expiresIn: '1h' });

        res.json({ message: 'Login exitoso', student, token, pass: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});


module.exports = router;
