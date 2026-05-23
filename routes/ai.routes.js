const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { message, employeeData } = req.body;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an intelligent HR Assistant for an Employee Management System.
You have access to the following employee data:
${JSON.stringify(employeeData)}

Answer questions about employees helpfully and concisely.
- Use bullet points when listing employees
- Format salary with INR symbol  
- Keep responses short and clear
- Only answer HR/employee related questions`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    const data = await response.json();
    console.log('Groq response status:', response.status);

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const reply = data.choices[0].message.content;
    res.json({ reply });

  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/salary-suggestion', authMiddleware, async (req, res) => {
  try {
    const { department, position, employeeData } = req.body;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an HR salary expert. Based on the existing employee data provided, suggest an appropriate salary range for a new employee.
            
Existing employee data: ${JSON.stringify(employeeData)}

Rules:
- Analyze existing salaries for the same department and position
- Consider market standards
- Return ONLY a JSON object like this: {"min": 50000, "max": 70000, "recommended": 60000, "reason": "brief reason"}
- No extra text, just the JSON`
          },
          {
            role: 'user',
            content: `Suggest salary for: Department: ${department}, Position: ${position}`
          }
        ],
        max_tokens: 200,
        temperature: 0.3
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;
    
    // Parse JSON from response
    const jsonMatch = reply.match(/\{.*\}/s);
    if (jsonMatch) {
      const suggestion = JSON.parse(jsonMatch[0]);
      res.json(suggestion);
    } else {
      res.json({ min: 40000, max: 80000, recommended: 60000, reason: 'Based on market standards' });
    }

  } catch (err) {
    console.error('Salary suggestion error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;