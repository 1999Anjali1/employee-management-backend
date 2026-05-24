🏢 EMS Suite — Employee Management System (Backend)

A RESTful backend API for the EMS Suite Employee Management System, built with Node.js + Express and PostgreSQL (Neon), featuring JWT authentication, email-based password reset, and AI-powered HR endpoints using Groq AI.
🌐 Live API: https://employee-management-backend-lms2.onrender.com

✨ Features
Core API

🔐 JWT Authentication — Register, login, token-based auth
📧 Email Password Reset — Real email via Gmail SMTP + secure token
👥 Employee CRUD — Full Create, Read, Update, Delete operations
🏢 Department API — Dynamic department listing from database
❤️ Health Check — Uptime monitoring endpoint

AI-Powered Endpoints 🤖

AI HR Chatbot — Natural language Q&A about workforce data
AI Salary Suggestion — Intelligent salary recommendations
AI Employee Insights — Comprehensive employee analysis
AI Resume Parser — PDF resume parsing and data extraction


🛠️ Tech Stack
LayerTechnologyRuntimeNode.js v22FrameworkExpress.jsDatabasePostgreSQL (Neon Cloud)AuthenticationJWT + bcryptjsEmailNodemailer + Gmail SMTPAIGroq API (LLaMA 3.3 70B)PDF Parsingpdf-parseFile UploadmulterDeploymentRender

🚀 Getting Started
Prerequisites

Node.js v18+
PostgreSQL database (local or Neon)

Installation
bash# Clone the repository
git clone https://github.com/1999Anjali1/employee-management-backend.git

# Navigate to backend
cd employee-management-backend

# Install dependencies
npm install

# Start development server
npm run dev

⚙️ Environment Variables
Create a .env file in the root directory:
env# Database
DATABASE_URL=your_postgresql_connection_string

# Server
PORT=3000

# JWT
JWT_SECRET=your_jwt_secret_key

# Email (Gmail SMTP)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

# Frontend URL (for password reset links)
CLIENT_URL=http://localhost:4200

# AI
GROQ_API_KEY=your_groq_api_key

📁 Project Structure
backend/
├── config/
│   └── db.js                    # PostgreSQL connection pool
├── controllers/
│   ├── employee.controller.js   # Employee CRUD logic
│   └── auth.controller.js       # Auth logic (register/login/reset)
├── middleware/
│   ├── auth.middleware.js        # JWT verification
│   └── upload.middleware.js      # Multer file upload config
├── routes/
│   ├── employee.routes.js        # /api/employees
│   ├── auth.routes.js            # /api/auth
│   └── ai.routes.js              # /api/ai
└── index.js                      # Express app entry point

📡 API Endpoints
Auth Routes /api/auth
MethodEndpointDescriptionPOST/registerRegister new userPOST/loginLogin and get JWT tokenPOST/forgot-passwordSend password reset emailPOST/reset-passwordReset password with tokenPOST/change-passwordChange password from profile
Employee Routes /api/employees 🔒
MethodEndpointDescriptionGET/Get all employeesGET/:idGet employee by IDPOST/Create new employeePUT/:idUpdate employeeDELETE/:idDelete employeeGET/departmentsGet unique departments
AI Routes /api/ai 🔒 🤖
MethodEndpointDescriptionPOST/chatHR chatbot Q&APOST/salary-suggestionAI salary recommendationPOST/employee-insightsAI employee analysisPOST/parse-resumeAI PDF resume parser
Health Check
MethodEndpointDescriptionGET/api/healthServer health status

🔒 = Requires JWT Authorization header


🗄️ Database Schema
employees table
sqlCREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(15),
  department VARCHAR(100),
  position VARCHAR(100),
  salary NUMERIC(10, 2),
  hire_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
users table
sqlCREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  reset_token VARCHAR(255),
  reset_token_expiry TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

🤖 AI Integration
All AI features use Groq API with LLaMA 3.3 70B model:
Chatbot Privacy Rules

Individual salaries are never revealed
Personal contact details are protected
Only aggregate/department-level data is shared

Resume Parser

Extracts: name, email, phone, position, department
Uses PDF text extraction + AI parsing
Returns structured JSON for form auto-fill


📦 Key Dependencies
json{
  "express": "^4.x",
  "pg": "^8.x",
  "bcryptjs": "^2.x",
  "jsonwebtoken": "^9.x",
  "nodemailer": "^6.x",
  "multer": "^1.x",
  "pdf-parse": "^1.1.1",
  "cors": "^2.x",
  "dotenv": "^16.x"
}

🔗 Related Repositories

🎨 Frontend: employee-management-frontend


👩‍💻 Author
Anjali P

GitHub: @1999Anjali1


📄 License
This project is open source and available under the MIT License.
