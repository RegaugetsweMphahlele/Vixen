const Category = require('../models/Category');


// ==========================================
// GET ALL CATEGORIES
// ==========================================

const getCategories = async (req, res) => {

    try {

        const results =
            await Category.findAll();


        return res.status(200).json({

            message:
                'Categories retrieved successfully',

            categories:
                results

        });

    } catch (error) {

        console.error(
            'Get categories error:',
            error
        );

        return res.status(500).json({

            message:
                'Could not retrieve categories'

        });

    }

};


// ==========================================
// GET CATEGORY BY ID
// ==========================================

const getCategoryById = async (req, res) => {

    try {

        const categoryId =
            req.params.id;


        const results =
            await Category.findById(
                categoryId
            );


        if (results.length === 0) {

            return res.status(404).json({

                message:
                    'Category not found'

            });

        }


        return res.status(200).json({

            message:
                'Category retrieved successfully',

            category:
                results[0]

        });

    } catch (error) {

        console.error(
            'Get category error:',
            error
        );

        return res.status(500).json({

            message:
                'Could not retrieve category'

        });

    }

};


// ==========================================
// CREATE CATEGORY
// ==========================================

const createCategory = async (req, res) => {

    try {

        const {
            name,
            description,
            image
        } = req.body;


        // ==========================================
        // VALIDATE REQUIRED FIELDS
        // ==========================================

        if (!name) {

            return res.status(400).json({

                message:
                    'Category name is required'

            });

        }


        // ==========================================
        // CHECK EXISTING CATEGORY
        // ==========================================

        const results =
            await Category.findByName(
                name
            );


        if (results.length > 0) {

            return res.status(409).json({

                message:
                    'A category with this name already exists'

            });

        }


        // ==========================================
        // CREATE CATEGORY
        // ==========================================

        const newCategory = {

            name,
            description,
            image

        };


        const result =
            await Category.create(
                newCategory
            );


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(201).json({

            message:
                'Category created successfully',

            category: {

                category_id:
                    result.insertId,

                name,

                description:
                    description || null,

                image:
                    image || null

            }

        });

    } catch (error) {

        console.error(
            'Create category error:',
            error
        );

        return res.status(500).json({

            message:
                'Could not create category'

        });

    }

};


// ==========================================
// UPDATE CATEGORY
// ==========================================

const updateCategory = async (req, res) => {

    try {

        const categoryId =
            req.params.id;


        const {
            name,
            description,
            image
        } = req.body;


        // ==========================================
        // VALIDATE REQUIRED FIELDS
        // ==========================================

        if (!name) {

            return res.status(400).json({

                message:
                    'Category name is required'

            });

        }


        // ==========================================
        // CHECK CATEGORY EXISTS
        // ==========================================

        const categoryResults =
            await Category.findById(
                categoryId
            );


        if (categoryResults.length === 0) {

            return res.status(404).json({

                message:
                    'Category not found'

            });

        }


        // ==========================================
        // CHECK CATEGORY NAME
        // ==========================================

        const nameResults =
            await Category.findByName(
                name
            );


        if (
            nameResults.length > 0 &&
            nameResults[0].category_id != categoryId
        ) {

            return res.status(409).json({

                message:
                    'A category with this name already exists'

            });

        }


        // ==========================================
        // UPDATE CATEGORY
        // ==========================================

        const updatedCategory = {

            name,
            description,
            image

        };


        const result =
            await Category.update(
                categoryId,
                updatedCategory
            );


        if (result.affectedRows === 0) {

            return res.status(404).json({

                message:
                    'Category not found'

            });

        }


        // ==========================================
        // GET UPDATED CATEGORY
        // ==========================================

        const updatedResults =
            await Category.findById(
                categoryId
            );


        return res.status(200).json({

            message:
                'Category updated successfully',

            category:
                updatedResults[0]

        });

    } catch (error) {

        console.error(
            'Update category error:',
            error
        );

        return res.status(500).json({

            message:
                'Could not update category'

        });

    }

};


// ==========================================
// DELETE CATEGORY
// ==========================================

const deleteCategory = async (req, res) => {

    try {

        const categoryId =
            req.params.id;


        // ==========================================
        // DELETE CATEGORY
        // ==========================================

        const result =
            await Category.delete(
                categoryId
            );


        if (result.affectedRows === 0) {

            return res.status(404).json({

                message:
                    'Category not found'

            });

        }


        return res.status(200).json({

            message:
                'Category deleted successfully'

        });

    } catch (error) {

        console.error(
            'Delete category error:',
            error
        );


        // ==========================================
        // CATEGORY USED BY MOVIES
        // ==========================================

        if (error.code === 'ER_ROW_IS_REFERENCED_2') {

            return res.status(409).json({

                message:
                    'Category cannot be deleted because it is being used by one or more movies'

            });

        }


        return res.status(500).json({

            message:
                'Could not delete category'

        });

    }

};


module.exports = {

    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory

};