const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('frontend')); // Serve frontend files from /frontend directory

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/trips', require('./routes/tripRoutes'));
app.use('/cities', require('./routes/cityRoutes'));
app.use('/activities', require('./routes/activityRoutes'));
app.use('/budget', require('./routes/budgetRoutes'));

// Test Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to GlobeTrotter Backend API' });
});

// Start Server
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        // Sync models (force: false means it won't drop tables if they exist)
        // Sync models (force: false means it won't drop tables if they exist)
        await sequelize.sync({ force: false });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();
