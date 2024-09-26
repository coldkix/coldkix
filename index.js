// index.js

const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');
require('dotenv').config();
const path = require('path');

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route handler for chat
app.post('/api/chat', async (req, res) => {
    console.log('Received request body:', req.body); // Debugging line
    const conversation = req.body.conversation;

    if (!Array.isArray(conversation) || conversation.length === 0) {
        return res.status(400).json({ error: 'Invalid conversation data.' });
    }

    try {
        const response = await axios.post(
            'https://api.mistral.ai/v1/agents/completions',
            {
                agent_id: "ag:b9e09e78:20240925:upstart:70d974db", // Ensure you have access to this model
                messages: conversation,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.API_KEY}`,
                },
            }
        );

        const botReply = response.data.choices[0].message.content.trim();

        res.json({ reply: botReply });
    } catch (error) {
        console.error(
            'Error communicating with OpenAI API:',
            error.response ? error.response.data : error.message
        );
        res.status(500).json({ error: 'Error communicating with OpenAI API' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
