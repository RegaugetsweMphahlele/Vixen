const db = require('../config/database');

const Category = {

    // ==========================================
    // FIND ALL CATEGORIES
    // ==========================================

    findAll: async () => {

        const sql = `
            SELECT
                category_id,
                name,
                description,
                image,
                created_at,
                updated_at
            FROM categories
            ORDER BY name ASC
        `;

        const [rows] = await db.execute(
            sql
        );

        return rows;
    },


    // ==========================================
    // FIND CATEGORY BY ID
    // ==========================================

    findById: async (categoryId) => {

        const sql = `
            SELECT
                category_id,
                name,
                description,
                image,
                created_at,
                updated_at
            FROM categories
            WHERE category_id = ?
        `;

        const [rows] = await db.execute(
            sql,
            [categoryId]
        );

        return rows;
    },


    // ==========================================
    // FIND CATEGORY BY NAME
    // ==========================================

    findByName: async (name) => {

        const sql = `
            SELECT
                category_id,
                name,
                description,
                image,
                created_at,
                updated_at
            FROM categories
            WHERE name = ?
        `;

        const [rows] = await db.execute(
            sql,
            [name]
        );

        return rows;
    },


    // ==========================================
    // CREATE CATEGORY
    // ==========================================

    create: async (category) => {

        const sql = `
            INSERT INTO categories
            (
                name,
                description,
                image
            )
            VALUES (?, ?, ?)
        `;

        const values = [
            category.name,
            category.description || null,
            category.image || null
        ];

        const [result] = await db.execute(
            sql,
            values
        );

        return result;
    },


    // ==========================================
    // UPDATE CATEGORY
    // ==========================================

    update: async (categoryId, category) => {

        const sql = `
            UPDATE categories
            SET
                name = ?,
                description = ?,
                image = ?
            WHERE category_id = ?
        `;

        const values = [
            category.name,
            category.description || null,
            category.image || null,
            categoryId
        ];

        const [result] = await db.execute(
            sql,
            values
        );

        return result;
    },


    // ==========================================
    // DELETE CATEGORY
    // ==========================================

    delete: async (categoryId) => {

        const sql = `
            DELETE FROM categories
            WHERE category_id = ?
        `;

        const [result] = await db.execute(
            sql,
            [categoryId]
        );

        return result;
    }

};

module.exports = Category;