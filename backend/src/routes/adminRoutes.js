const express = require('express');

const {

    login,
    getProfile,
    updateProfile,
    changePassword

} = require('../controllers/adminController');

const authenticateAdmin =
    require('../middleware/adminMiddleware');

const router =
    express.Router();


// ==========================================
// ADMIN LOGIN
// ==========================================

// POST /api/admin/login

router.post(

    '/login',

    login

);


// ==========================================
// ADMIN PROFILE
// ==========================================

// GET /api/admin/profile

router.get(

    '/profile',

    authenticateAdmin,

    getProfile

);


// ==========================================
// UPDATE ADMIN PROFILE
// ==========================================

// PUT /api/admin/profile

router.put(

    '/profile',

    authenticateAdmin,

    updateProfile

);


// ==========================================
// CHANGE ADMIN PASSWORD
// ==========================================

// PUT /api/admin/change-password

router.put(

    '/change-password',

    authenticateAdmin,

    changePassword

);


module.exports =
    router;