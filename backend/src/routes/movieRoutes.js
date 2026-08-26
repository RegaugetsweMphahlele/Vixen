const express = require('express');

const {

    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
    getMoviesByCategory,
    searchMovies

} = require('../controllers/movieController');


const authenticateAdmin = require('../middleware/adminMiddleware');


const router = express.Router();

// ==========================================
// GET ALL MOVIES
// ==========================================

// GET /api/movies

router.get(

    '/',

    getAllMovies

);


// ==========================================
// SEARCH MOVIES
// ==========================================

// GET /api/movies/search?search=...

router.get(

    '/search',

    searchMovies

);


// ==========================================
// GET MOVIES BY CATEGORY
// ==========================================

// GET /api/movies/category/:categoryId

router.get(

    '/category/:categoryId',

    getMoviesByCategory

);


// ==========================================
// GET MOVIE BY ID
// ==========================================

// GET /api/movies/:id

router.get(

    '/:id',

    getMovieById

);


// ==========================================
// CREATE MOVIE
// ==========================================

// POST /api/movies

router.post(

    '/',
    authenticateAdmin,
    createMovie

);


// ==========================================
// UPDATE MOVIE
// ==========================================

// PUT /api/movies/:id

router.put(

    '/:id',
    authenticateAdmin,
    updateMovie

);


// ==========================================
// DELETE MOVIE
// ==========================================

// DELETE /api/movies/:id

router.delete(

    '/:id',
    authenticateAdmin,
    deleteMovie

);


module.exports = router;