const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });

const app = express();

// JSON Middleware
app.use(express.json());

// Logger Middleware
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

// Routes
app.use('/books', require('./routes/books'));

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.message);

    if (err.name === 'ValidationError' ||
        err.name === 'CastError' ||
        err.name === 'SyntaxError') {
        return res.status(400).json({
            message: err.message
        });
    }

    res.status(500).json({
        message: 'Internal Server Error'
    });
});

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');

        app.listen(process.env.PORT, () => {
            console.log('Server running on port 3000');
        });
    })
    .catch(err => {
        console.log('MongoDB connection error:', err.message);
    });