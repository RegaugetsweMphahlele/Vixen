require('dotenv').config();

const express = require('express');
const cors = require('cors');

const db = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const movieRoutes = require('./routes/movieRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const rentalItemRoutes = require('./routes/rentalItemRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

const PORT = process.env.PORT || 3000;


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

app.use('/api/categories', categoryRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/rental-items', rentalItemRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/admin', adminRoutes);

// ==========================================
// TEST ROUTE
// ==========================================

app.get('/', (req, res) => {

    res.status(200).json({
        message: 'Vixen API is running'
    });

});


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {

    console.log(
        `Vixen server running on http://localhost:${PORT}`
    );

});