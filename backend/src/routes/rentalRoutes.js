const express = require('express');

const {

    // USER
    getRentals,
    getRentalById,
    createRental,
    updateRental,
    deleteRental,

    // ADMIN
    getAllRentals,
    getAdminRentalById,
    updateAdminRental,
    deleteAdminRental

} = require('../controllers/rentalController');

const authenticateToken =
    require('../middleware/authMiddleware');

const authenticateAdmin =
    require('../middleware/adminMiddleware');

const router =
    express.Router();


// ==================================================
// ADMIN ROUTES
// ==================================================


// GET /api/rentals/admin/all

router.get(
    '/admin/all',
    authenticateAdmin,
    getAllRentals
);


// GET /api/rentals/admin/:id

router.get(
    '/admin/:id',
    authenticateAdmin,
    getAdminRentalById
);


// PUT /api/rentals/admin/:id

router.put(
    '/admin/:id',
    authenticateAdmin,
    updateAdminRental
);


// DELETE /api/rentals/admin/:id

router.delete(
    '/admin/:id',
    authenticateAdmin,
    deleteAdminRental
);


// ==================================================
// USER ROUTES
// ==================================================


// GET /api/rentals

router.get(
    '/',
    authenticateToken,
    getRentals
);


// GET /api/rentals/:id

router.get(
    '/:id',
    authenticateToken,
    getRentalById
);


// POST /api/rentals

router.post(
    '/',
    authenticateToken,
    createRental
);


// PUT /api/rentals/:id

router.put(
    '/:id',
    authenticateToken,
    updateRental
);


// DELETE /api/rentals/:id

router.delete(
    '/:id',
    authenticateToken,
    deleteRental
);


module.exports = router;
