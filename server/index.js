const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const prisma = new PrismaClient();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const cors = require('cors');

app.use(express.json());

app.use(cors());
// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

const students = require('./src/routes/students');
const test = require('./src/routes/test');
const testStudents = require('./src/routes/testStudents');

app.use('/api/test', test);
app.use('/api/students', students);
app.use('/api/testStudents', testStudents);

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});