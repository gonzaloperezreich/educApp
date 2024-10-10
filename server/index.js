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

const allowedOrigins = [
  'http://localhost:3000',
  'https://educ-app-cl-ient-1syj0gvjz-gonzaloperezreichs-projects.vercel.app',
  'https://educ-app-cl-ient-bfylkxt0t-gonzaloperezreichs-projects.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    console.log('Request origin:', origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', ''); // Empty value to avoid trial-controlled features
  next();
});
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