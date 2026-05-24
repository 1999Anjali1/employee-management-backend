# 🏢 EMS Suite — Employee Management System (Backend)

![Node.js](https://img.shields.io/badge/Node.js-22.x-green?style=flat&logo=nodedotjs)
![Express](https://img.shields.io/badge/Express-4.x-black?style=flat&logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue?style=flat&logo=postgresql)
![Render](https://img.shields.io/badge/Deployed-Render-purple?style=flat&logo=render)

A RESTful backend API for the EMS Suite Employee Management System, built with **Node.js + Express** and **PostgreSQL (Neon)**, featuring **JWT authentication**, **email-based password reset**, and **AI-powered HR endpoints** using Groq AI.

🌐 **Live API:** [https://employee-management-backend-lms2.onrender.com](https://employee-management-backend-lms2.onrender.com)  
🎨 **Frontend Repo:** [employee-management-frontend](https://github.com/1999Anjali1/employee-management-frontend)

---

## ✨ Features

### Core API
- 🔐 **JWT Authentication** — Register, login, token-based auth
- 📧 **Email Password Reset** — Real email via Gmail SMTP + secure token
- 👥 **Employee CRUD** — Full Create, Read, Update, Delete operations
- 🏢 **Department API** — Dynamic department listing from database
- ❤️ **Health Check** — Uptime monitoring endpoint

### AI-Powered Endpoints 🤖
- **AI HR Chatbot** — Natural language Q&A about workforce data
- **AI Salary Suggestion** — Intelligent salary recommendations
- **AI Employee Insights** — Comprehensive employee analysis
- **AI Resume Parser** — PDF resume parsing and data extraction

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Runtime | Node.js | 22.x |
| Framework | Express.js | 4.x |
| Database | PostgreSQL (Neon Cloud) | Latest |
| Authentication | JWT + bcryptjs | 9.x / 2.x |
| Email | Nodemailer + Gmail SMTP | 6.x |
| AI | Groq API (LLaMA 3.3 70B) | Latest |
| PDF Parsing | pdf-parse | 1.1.1 |
| File Upload | multer | 1.x |
| Deployment | Render | - |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL database (local or Neon)

### Installation

```bash
# Clone the repository
git clone https://github.com/1999Anjali1/employee-management-backend.git
cd employee-management-backend
npm install
npm run dev
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Database
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
```

> ⚠️ Never commit `.env` to GitHub — it's in `.gitignore`

---

## 📁 Project Structure
backend/
├── config/
│   └── db.js                    # PostgreSQL connection pool (Neon)
├── controllers/
│   ├── employee.controller.js   # Employee CRUD logic
│   └── auth.controller.js       # Register, login, forgot/reset password
├── middleware/
│   ├── auth.middleware.js        # JWT token verification
│   └── upload.middleware.js      # Multer PDF upload config
├── routes/
│   ├── employee.routes.js        # /api/employees
│   ├── auth.routes.js            # /api/auth
│   └── ai.routes.js              # /api/ai (all AI endpoints)
└── index.js                      # Express app + CORS + route registration

---

## 📡 API Endpoints

### Auth Routes `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register new user (bcrypt hashed password) |
| POST | `/login` | Login → returns JWT token |
| POST | `/forgot-password` | Send reset email with secure token |
| POST | `/reset-password` | Reset password using email token |
| POST | `/change-password` | Change password from profile page |

### Employee Routes `/api/employees` 🔒

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get all employees (ordered by created_at DESC) |
| GET | `/:id` | Get single employee by ID |
| POST | `/` | Create new employee |
| PUT | `/:id` | Update employee details |
| DELETE | `/:id` | Delete employee |
| GET | `/departments` | Get distinct department names from DB |

### AI Routes `/api/ai` 🔒 🤖

| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/chat` | `{message, employeeData}` | HR chatbot Q&A |
| POST | `/salary-suggestion` | `{department, position, employeeData}` | AI salary range |
| POST | `/employee-insights` | `{employee, allEmployees}` | Full AI analysis |
| POST | `/parse-resume` | `FormData (PDF)` | Parse resume → JSON |

### Utility

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check → `{status: "ok", timestamp}` |

> 🔒 = Requires `Authorization: Bearer <token>` header

---

## 🗄️ Database Schema

### employees
```sql
CREATE TABLE employees (
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
```

### users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  reset_token VARCHAR(255),
  reset_token_expiry TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🤖 AI Integration

All AI features use **Groq API** with **LLaMA 3.3 70B** model for fast, free inference.

### Chatbot Privacy Rules
- Individual salaries are **never revealed**
- Personal contact details are **protected**
- Only aggregate/department-level salary data is shared

### Resume Parser Flow
1. Multer stores uploaded PDF in memory buffer
2. pdf-parse extracts plain text from buffer
3. First 3000 chars sent to Groq AI with extraction prompt
4. AI returns structured JSON
5. Frontend auto-fills employee form

---

## 📦 Key Dependencies

```json
{
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
```

---

## 👩‍💻 Author

**Anjali P**
- GitHub: [@1999Anjali1](https://github.com/1999Anjali1)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
