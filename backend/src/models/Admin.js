const db = require('../config/database');

const Admin = {

    // ==========================================
    // FIND ADMIN BY EMAIL
    // ==========================================

    findByEmail: async (email) => {

        const sql = `
            SELECT
                admin_id,
                first_name,
                last_name,
                email,
                password,
                created_at,
                updated_at
            FROM admins
            WHERE email = ?
        `;

        const [rows] = await db.execute(
            sql,
            [email]
        );

        return rows;
    },


    // ==========================================
    // FIND ADMIN BY ID
    // ==========================================

    findById: async (adminId) => {

        const sql = `
            SELECT
                admin_id,
                first_name,
                last_name,
                email,
                created_at,
                updated_at
            FROM admins
            WHERE admin_id = ?
        `;

        const [rows] = await db.execute(
            sql,
            [adminId]
        );

        return rows;
    },


    // ==========================================
    // UPDATE ADMIN PROFILE
    // ==========================================

    update: async (
        adminId,
        admin
    ) => {

        const sql = `
            UPDATE admins
            SET
                first_name = ?,
                last_name = ?,
                email = ?
            WHERE admin_id = ?
        `;

        const values = [
            admin.first_name,
            admin.last_name,
            admin.email,
            adminId
        ];

        const [result] = await db.execute(
            sql,
            values
        );

        return result;
    },


    // ==========================================
    // UPDATE ADMIN PASSWORD
    // ==========================================

    updatePassword: async (
        adminId,
        hashedPassword
    ) => {

        const sql = `
            UPDATE admins
            SET password = ?
            WHERE admin_id = ?
        `;

        const [result] = await db.execute(
            sql,
            [
                hashedPassword,
                adminId
            ]
        );

        return result;
    }

};

module.exports = Admin;