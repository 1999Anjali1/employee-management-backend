const express = require('express');
const cors = require('cors');
require('dotenv').config();

const employeeRoutes = require('./routes/employee.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:4200',
    'https://employee-management-frontend-ivory-ten.vercel.app'
  ],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const aiRoutes = require('./routes/ai.routes');
app.use('/api/ai', aiRoutes);

app.use('/api/employees', employeeRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});