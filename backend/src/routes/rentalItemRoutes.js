const express = require('express');

const {

    getRentalItems,

    getRentalItemById,

    getItemsByRental,

    deleteRentalItem

} = require('../controllers/rentalItemController');

const authenticateToken =
    require('../middleware/authMiddleware');

const router =
    express.Router();


// ==========================================
// RENTAL ITEMS
// ==========================================


// GET /api/rental-items

router.get(

    '/',

    authenticateToken,

    getRentalItems

);


// GET /api/rental-items/:id

router.get(

    '/:id',

    authenticateToken,

    getRentalItemById

);


// GET /api/rental-items/rental/:id
//
// IMPORTANT:
// This route must come BEFORE /:id
// if using this exact structure.

router.get(

    '/rental/:id',

    authenticateToken,

    getItemsByRental

);


// DELETE /api/rental-items/:id

router.delete(

    '/:id',

    authenticateToken,

    deleteRentalItem

);


module.exports = router;