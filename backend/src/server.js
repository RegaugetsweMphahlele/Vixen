const express = require('express');
const cors = require('cors');

const db = require('./config/database');
const authRoutes = require('./routes/authRoutes');

const app = express();

const PORT = 3000;

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// ==========================================
// ROUTES
// ==========================================

app.use('/api/auth', authRoutes);


// ==========================================
// TEST ROUTE
// ==========================================

app.get('/', (req, res) => {
    res.json({
        message: 'Vixen API is running'
    });
});


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
    console.log(`Vixen server running on http://localhost:${PORT}`);
});