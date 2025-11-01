const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
   origin: "http://localhost:3000",
   methods : ["GET", "POST", "PUT", "DELETE"],
   credentials: true
}));
app.use(express.json());

// health
app.get('/', (req, res) => res.json({ status: 'ok', message: 'Resume Builder API' }));

// import routers (example)
const authRouter = require('./src/routes/authRoutes');
const resumeRouter = require('./src/routes/resumeRoutes');

app.use('/api/auth', authRouter);
app.use('/api/resume', resumeRouter);

// global error handler (simple)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

module.exports = app;
