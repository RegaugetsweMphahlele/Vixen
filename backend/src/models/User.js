const db = require('../config/database');

const User = {

    // ==========================================
    // FIND USER BY EMAIL
    // ==========================================

    findByEmail: (email, callback) => {

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

        db.query(sql, [email], callback);
    },


    // ==========================================
    // FIND USER BY ID
    // ==========================================

    findById: (userId, callback) => {

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

        db.query(sql, [userId], callback);
    },


    // ==========================================
    // CREATE USER
    // ==========================================

    create: (user, callback) => {

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

        db.query(sql, values, callback);
    },


    // ==========================================
    // UPDATE PROFILE
    // ==========================================

    update: (userId, user, callback) => {

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

        db.query(sql, values, callback);
    },


    // ==========================================
    // DELETE USER
    // ==========================================

    delete: (userId, callback) => {

        const sql = `
            DELETE FROM users
            WHERE user_id = ?
        `;

        db.query(sql, [userId], callback);
    },


    // ==========================================
    // UPDATE PASSWORD
    // ==========================================

    updatePassword: (userId, hashedPassword, callback) => {

        const sql = `
            UPDATE users
            SET password = ?
            WHERE user_id = ?
        `;

        db.query(
            sql,
            [hashedPassword, userId],
            callback
        );
    },


    // ==========================================
    // SAVE RESET TOKEN
    // ==========================================

    saveResetToken: (userId, token, expires, callback) => {

        const sql = `
            UPDATE users
            SET
                reset_password_token = ?,
                reset_password_expires = ?
            WHERE user_id = ?
        `;

        db.query(
            sql,
            [token, expires, userId],
            callback
        );
    },


    // ==========================================
    // FIND USER BY RESET TOKEN
    // ==========================================

    findByResetToken: (token, callback) => {

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

        db.query(
            sql,
            [token],
            callback
        );
    },


    // ==========================================
    // CLEAR RESET TOKEN
    // ==========================================

    clearResetToken: (userId, callback) => {

        const sql = `
            UPDATE users
            SET
                reset_password_token = NULL,
                reset_password_expires = NULL
            WHERE user_id = ?
        `;

        db.query(
            sql,
            [userId],
            callback
        );
    }

};

module.exports = User;
// const db = require('../config/database');

// const User = {

//     // Find a user by email
//     findByEmail: (email, callback) => {
//         const sql = `
//             SELECT
//                 user_id,
//                 first_name,
//                 last_name,
//                 email,
//                 password,
//                 profile_image,
//                 created_at,
//                 updated_at
//             FROM users
//             WHERE email = ?
//         `;

//         db.query(sql, [email], callback);
//     },


//     // Find a user by ID
//     findById: (userId, callback) => {
//         const sql = `
//             SELECT
//                 user_id,
//                 first_name,
//                 last_name,
//                 email,
//                 profile_image,
//                 created_at,
//                 updated_at
//             FROM users
//             WHERE user_id = ?
//         `;

//         db.query(sql, [userId], callback);
//     },


//     // Create a new user
//     create: (user, callback) => {
//         const sql = `
//             INSERT INTO users
//             (
//                 first_name,
//                 last_name,
//                 email,
//                 password,
//                 profile_image
//             )
//             VALUES (?, ?, ?, ?, ?)
//         `;

//         const values = [
//             user.first_name,
//             user.last_name,
//             user.email,
//             user.password,
//             user.profile_image || null
//         ];

//         db.query(sql, values, callback);
//     },


//     // Update a user's profile
//     update: (userId, user, callback) => {
//         const sql = `
//             UPDATE users
//             SET
//                 first_name = ?,
//                 last_name = ?,
//                 email = ?,
//                 profile_image = ?
//             WHERE user_id = ?
//         `;

//         const values = [
//             user.first_name,
//             user.last_name,
//             user.email,
//             user.profile_image || null,
//             userId
//         ];

//         db.query(sql, values, callback);
//     },


//     // Delete a user
//     delete: (userId, callback) => {
//         const sql = `
//             DELETE FROM users
//             WHERE user_id = ?
//         `;

//         db.query(sql, [userId], callback);
//     }

// };
// // Update user's password
// updatePassword: (userId, hashedPassword, callback) => {
//     const sql = `
//         UPDATE users
//         SET password = ?
//         WHERE user_id = ?
//     `;

//     db.query(
//         sql,
//         [hashedPassword, userId],
//         callback
//     );
// }

// module.exports = User;