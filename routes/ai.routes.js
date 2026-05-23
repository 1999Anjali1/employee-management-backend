const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { message, employeeData } = req.body;

    const prompt = `You are an intelligent HR Assistant for an Employee Management System.
You have access to the following employee data:
${JSON.stringify(employeeData)}

Answer this question in a helpful, concise and professional way: ${message}

Rules:
- Use bullet points when listing employees
- Format salary with INR symbol
- Keep response short and clear
- Only answer HR/employee related questions`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: prompt }] 
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500
        }
      })
    });

    const data = await response.json();
    
    console.log('Gemini response:', JSON.stringify(data));

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    if (!data.candidates || data.candidates.length === 0) {
      return res.status(500).json({ error: 'No response from AI' });
    }

    const reply = data.candidates[0].content.parts[0].text;
    res.json({ reply });

  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;