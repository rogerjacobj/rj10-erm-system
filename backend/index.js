const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());

// Simple health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Mock login endpoint for local development and frontend testing
app.post('/api/login', (req, res) => {
    const { email, password, role } = req.body || {}
    if (!email || !password || !role) {
        return res.status(400).json({ message: 'email, password and role are required' })
    }

    // NOTE: This is a mock. Replace with real auth logic.
    if (password !== 'password123') {
        return res.status(401).json({ message: 'Invalid credentials. For local tests use password: password123' })
    }

    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')
    return res.json({ token, user: { email, role } })
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})