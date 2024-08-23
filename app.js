const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const indexRouter = require('./routes/index');
const cors = require('cors');
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Use the index router for handling API routes
app.use('/api', indexRouter);

// Handle 404 errors for undefined API routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'API route not found' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API server is running on http://localhost:${PORT}`);
});
