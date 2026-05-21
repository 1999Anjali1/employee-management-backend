const express = require('express');
const cors = require('cors');
require('dotenv').config();

const employeeRoutes = require('./routes/employee.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:4200',
    process.env.CLIENT_URL
  ],
  credentials: true
}));
app.use(express.json());

app.use('/api/employees', employeeRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});