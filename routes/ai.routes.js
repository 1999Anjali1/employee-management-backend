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

module.exports = router;