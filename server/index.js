require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Configurar CORS para los orígenes permitidos
const allowedOrigins = [
  'https://educ-app-htkh.vercel.app',
  'http://localhost:3000',
  'https://educ-app-cl-ient-1syj0gvjz-gonzaloperezreichs-projects.vercel.app',
  'https://educ-app-cl-ient-bfylkxt0t-gonzaloperezreichs-projects.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json()); // Middleware para JSON

// Rutas
const students = require('./src/routes/students');
const test = require('./src/routes/test');
const testStudents = require('./src/routes/testStudents');

app.use('/api/test', test);
app.use('/api/students', students);
app.use('/api/testStudents', testStudents);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Iniciar el servidor
const PORT = process.env.PORT || 4000; // Solo para entorno local
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
