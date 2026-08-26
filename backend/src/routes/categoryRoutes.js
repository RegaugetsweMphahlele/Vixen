const express =
    require('express');


const {

    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory

} = require('../controllers/categoryController');


const authenticateAdmin =
    require('../middleware/adminMiddleware');


const router =
    express.Router();


// ==========================================
// PUBLIC / USER CATEGORY ACCESS
// ==========================================

// GET /api/categories

router.get(

    '/',

    getCategories

);


// GET /api/categories/:id

router.get(

    '/:id',

    getCategoryById

);


// ==========================================
// ADMIN CATEGORY MANAGEMENT
// ==========================================

// POST /api/categories

router.post(

    '/',

    authenticateAdmin,

    createCategory

);


// PUT /api/categories/:id

router.put(

    '/:id',

    authenticateAdmin,

    updateCategory

);


// DELETE /api/categories/:id

router.delete(

    '/:id',

    authenticateAdmin,

    deleteCategory

);


module.exports =
    router;
