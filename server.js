// server.js

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).send('Missing user message');
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `
You are the official digital assistant of MRE Consulting & Insurance. 
You assist users with insurance, tax, accounting, and consulting services. 
Always be professional, friendly, and thorough. Capture Name, Phone, and Email if deeper help is requested.
Closing line: "At MRE, we make sure every client’s needs are viewed as a full picture, not just a piece of it."
            `
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.6
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      reply: response.data.choices[0].message.content
    });

  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send('Error getting response from OpenAI');
  }
});

app.listen(port, () => {
  console.log(`MRE Chatbot server running on port ${port}`);
});
