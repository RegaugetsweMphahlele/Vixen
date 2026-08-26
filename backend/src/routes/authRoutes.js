const express = require('express');

const {
    register,
    login,
    getProfile,
    updateProfile,
    deleteProfile,
    changePassword,
    forgotPassword,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/authController');


const authenticateToken =
    require('../middleware/authMiddleware');
const authenticateAdmin =
    require('../middleware/adminMiddleware');


const router = express.Router();


// ==========================================
// AUTHENTICATION
// ==========================================

// POST /api/auth/register

router.post(
    '/register',
    register
);


// POST /api/auth/login

router.post(
    '/login',
    login
);


// ==========================================
// FORGOT PASSWORD
// ==========================================

// POST /api/auth/forgot-password

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


// PUT /api/auth/change-password

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

// ==========================================
// ADMIN USER MANAGEMENT
// ==========================================

// GET /api/auth/users

router.get(
    '/users',
    authenticateAdmin,
    getAllUsers
);


// GET /api/auth/users/:id

router.get(
    '/users/:id',
    authenticateAdmin,
    getUserById
);


// PUT /api/auth/users/:id

router.put(
    '/users/:id',
    authenticateAdmin,
    updateUser
);


// DELETE /api/auth/users/:id

router.delete(
    '/users/:id',
    authenticateAdmin,
    deleteUser
);


module.exports = router;

module.exports = router;