const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const pdfParse = require('pdf-parse');

router.post("/chat", authMiddleware, async (req, res) => {
  try {
    const { message, employeeData } = req.body;

    // Remove sensitive data before sending to AI
    const sanitizedData = employeeData.map((emp) => ({
      id: emp.id,
      first_name: emp.first_name,
      last_name: emp.last_name,
      department: emp.department,
      position: emp.position,
      hire_date: emp.hire_date,
      // salary and email intentionally excluded
    }));

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are an intelligent HR Assistant for an Employee Management System.
You have access to the following employee data:
${JSON.stringify(sanitizedData)}

Answer questions about employees helpfully and concisely.
- Use bullet points when listing employees
- Keep responses short and clear
- Only answer HR/employee related questions
- Salary and contact details are confidential — never share them
- If asked about salary or email, say these details are confidential`,
            },
            {
              role: "user",
              content: message,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      },
    );

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    const reply = data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("AI chat error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/salary-suggestion", authMiddleware, async (req, res) => {
  try {
    const { department, position, employeeData } = req.body;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are an HR salary expert. Based on the existing employee data provided, suggest an appropriate salary range for a new employee.
            
Existing employee data: ${JSON.stringify(employeeData)}

Rules:
- Analyze existing salaries for the same department and position
- Consider market standards
- Return ONLY a JSON object like this: {"min": 50000, "max": 70000, "recommended": 60000, "reason": "brief reason"}
- No extra text, just the JSON`,
            },
            {
              role: "user",
              content: `Suggest salary for: Department: ${department}, Position: ${position}`,
            },
          ],
          max_tokens: 200,
          temperature: 0.3,
        }),
      },
    );

    const data = await response.json();
    const reply = data.choices[0].message.content;

    // Parse JSON from response
    const jsonMatch = reply.match(/\{.*\}/s);
    if (jsonMatch) {
      const suggestion = JSON.parse(jsonMatch[0]);
      res.json(suggestion);
    } else {
      res.json({
        min: 40000,
        max: 80000,
        recommended: 60000,
        reason: "Based on market standards",
      });
    }
  } catch (err) {
    console.error("Salary suggestion error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/employee-insights", authMiddleware, async (req, res) => {
  try {
    const { employee, allEmployees } = req.body;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are an HR analytics expert. Generate a professional employee insight report.
            
All employees data for comparison: ${JSON.stringify(allEmployees)}

Generate insights in this EXACT JSON format:
{
  "summary": "2-3 sentence professional summary about the employee",
  "salary_analysis": "How their salary compares to team average",
  "tenure": "How long they have been with company based on hire date",
  "department_rank": "Their salary rank within their department",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "recommendation": "One actionable HR recommendation"
}

Return ONLY the JSON, no extra text.`,
            },
            {
              role: "user",
              content: `Generate insights for this employee: ${JSON.stringify(employee)}`,
            },
          ],
          max_tokens: 500,
          temperature: 0.4,
        }),
      },
    );

    const data = await response.json();
    const reply = data.choices[0].message.content;

    const jsonMatch = reply.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const insights = JSON.parse(jsonMatch[0]);
      res.json(insights);
    } else {
      res.status(500).json({ error: "Could not parse AI response" });
    }
  } catch (err) {
    console.error("Employee insights error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post(
  "/parse-resume",
  authMiddleware,
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No PDF file uploaded" });
      }

      // Extract text from PDF
      const pdfData = await pdfParse(req.file.buffer);
      const resumeText = pdfData.text;

      console.log("Extracted PDF text length:", resumeText.length);

      // Send to Groq AI for parsing
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: `You are an expert resume parser. Extract information from the resume text and return ONLY a JSON object.

Return this exact JSON format:
{
  "first_name": "extracted first name or empty string",
  "last_name": "extracted last name or empty string",
  "email": "extracted email or empty string",
  "phone": "extracted phone number or empty string",
  "position": "extracted job title/position or empty string",
  "department": "suggested department based on skills (Engineering/HR/Finance/Marketing/Operations) or empty string",
  "skills": ["skill1", "skill2", "skill3"],
  "experience_years": "number of years experience as string or empty string",
  "summary": "2 sentence professional summary"
}

Return ONLY the JSON, no markdown, no extra text.`,
              },
              {
                role: "user",
                content: `Parse this resume:\n\n${resumeText.substring(0, 3000)}`,
              },
            ],
            max_tokens: 500,
            temperature: 0.1,
          }),
        },
      );

      const data = await response.json();

      if (data.error) {
        return res.status(500).json({ error: data.error.message });
      }

      const reply = data.choices[0].message.content;
      console.log("AI resume parse reply:", reply);

      // Parse JSON response
      const jsonMatch = reply.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        res.json(parsed);
      } else {
        res.status(500).json({ error: "Could not parse resume data" });
      }
    } catch (err) {
      console.error("Resume parse error:", err);
      res.status(500).json({ error: err.message });
    }
  },
);
module.exports = router;
