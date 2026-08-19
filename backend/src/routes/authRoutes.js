const express = require('express');

const {
    register,
    login,
    getProfile,
    updateProfile,
    deleteProfile,
    changePassword,
    forgotPassword
} = require('../controllers/authController');

const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();


// ==========================================
// AUTHENTICATION
// ==========================================

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// ==========================================
// FORGOT PASSWORD
// ==========================================

router.post(
    '/forgot-password',
    forgotPassword
);

// ==========================================
// USER PROFILE
// ==========================================

// GET /api/auth/profile
router.get(
    '/profile',
    authenticateToken,
    getProfile
);


// PUT /api/auth/profile
router.put(
    '/profile',
    authenticateToken,
    updateProfile
);
router.put(
    '/change-password',
    authenticateToken,
    changePassword
);

// DELETE /api/auth/profile
router.delete(
    '/profile',
    authenticateToken,
    deleteProfile
);


module.exports = router;