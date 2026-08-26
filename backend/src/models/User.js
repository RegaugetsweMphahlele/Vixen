const db = require('../config/database');

const User = {

    // ==========================================
    // FIND USER BY EMAIL
    // ==========================================

    findByEmail: async (email) => {

        const sql = `
            SELECT
                user_id,
                first_name,
                last_name,
                email,
                password,
                profile_image,
                created_at,
                updated_at
            FROM users
            WHERE email = ?
        `;

        const [rows] = await db.execute(
            sql,
            [email]
        );

        return rows;
    },


    // ==========================================
    // FIND USER BY ID
    // ==========================================

    findById: async (userId) => {

        const sql = `
            SELECT
                user_id,
                first_name,
                last_name,
                email,
                profile_image,
                created_at,
                updated_at
            FROM users
            WHERE user_id = ?
        `;

        const [rows] = await db.execute(
            sql,
            [userId]
        );

        return rows;
    },
    // ==========================================
    // FIND ALL USERS
    // ==========================================

    findAll: async () => {

        const sql = `
            SELECT
                user_id,
                first_name,
                last_name,
                email,
                profile_image,
                created_at,
                updated_at
            FROM users
            ORDER BY created_at DESC
        `;

        const [rows] = await db.execute(
            sql
        );

        return rows;
    },


    // ==========================================
    // CREATE USER
    // ==========================================

    create: async (user) => {

        const sql = `
            INSERT INTO users
            (
                first_name,
                last_name,
                email,
                password,
                profile_image
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        const values = [
            user.first_name,
            user.last_name,
            user.email,
            user.password,
            user.profile_image || null
        ];

        const [result] = await db.execute(
            sql,
            values
        );

        return result;
    },


    // ==========================================
    // UPDATE PROFILE
    // ==========================================

    update: async (userId, user) => {

        const sql = `
            UPDATE users
            SET
                first_name = ?,
                last_name = ?,
                email = ?,
                profile_image = ?
            WHERE user_id = ?
        `;

        const values = [
            user.first_name,
            user.last_name,
            user.email,
            user.profile_image || null,
            userId
        ];

        const [result] = await db.execute(
            sql,
            values
        );

        return result;
    },


    // ==========================================
    // DELETE USER
    // ==========================================

    delete: async (userId) => {

        const sql = `
            DELETE FROM users
            WHERE user_id = ?
        `;

        const [result] = await db.execute(
            sql,
            [userId]
        );

        return result;
    },


    // ==========================================
    // UPDATE PASSWORD
    // ==========================================

    updatePassword: async (userId, hashedPassword) => {

        const sql = `
            UPDATE users
            SET password = ?
            WHERE user_id = ?
        `;

        const [result] = await db.execute(
            sql,
            [
                hashedPassword,
                userId
            ]
        );

        return result;
    },


    // ==========================================
    // SAVE RESET TOKEN
    // ==========================================

    saveResetToken: async (
        userId,
        token,
        expires
    ) => {

        const sql = `
            UPDATE users
            SET
                reset_password_token = ?,
                reset_password_expires = ?
            WHERE user_id = ?
        `;

        const [result] = await db.execute(
            sql,
            [
                token,
                expires,
                userId
            ]
        );

        return result;
    },


    // ==========================================
    // FIND USER BY RESET TOKEN
    // ==========================================

    findByResetToken: async (token) => {

        const sql = `
            SELECT
                user_id,
                first_name,
                last_name,
                email,
                password
            FROM users
            WHERE reset_password_token = ?
            AND reset_password_expires > NOW()
        `;

        const [rows] = await db.execute(
            sql,
            [token]
        );

        return rows;
    },


    // ==========================================
    // CLEAR RESET TOKEN
    // ==========================================

    clearResetToken: async (userId) => {

        const sql = `
            UPDATE users
            SET
                reset_password_token = NULL,
                reset_password_expires = NULL
            WHERE user_id = ?
        `;

        const [result] = await db.execute(
            sql,
            [userId]
        );

        return result;
    }

};

module.exports = User;