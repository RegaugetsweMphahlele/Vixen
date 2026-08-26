const express = require('express');

const {

    getWatchlist,

    addToWatchlist,

    checkWatchlist,

    removeFromWatchlist

} = require('../controllers/watchlistController');

const authenticateToken =
    require('../middleware/authMiddleware');

const router = express.Router();


// ==========================================
// GET WATCHLIST
// ==========================================

// GET /api/watchlist

router.get(

    '/',

    authenticateToken,

    getWatchlist

);


// ==========================================
// ADD TO WATCHLIST
// ==========================================

// POST /api/watchlist

router.post(

    '/',

    authenticateToken,

    addToWatchlist

);


// ==========================================
// CHECK WATCHLIST
// ==========================================

// GET /api/watchlist/:movie_id

router.get(

    '/:movie_id',

    authenticateToken,

    checkWatchlist

);


// ==========================================
// REMOVE FROM WATCHLIST
// ==========================================

// DELETE /api/watchlist/:movie_id

router.delete(

    '/:movie_id',

    authenticateToken,

    removeFromWatchlist

);


module.exports = router;