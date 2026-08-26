const db = require('../config/database');

const Rental = {

    // ==========================================
    // GET ALL RENTALS FOR USER
    // ==========================================

    findByUserId: async (userId) => {

        const sql = `
            SELECT
                rental_id,
                user_id,
                total_amount,
                rented_at,
                expires_at,
                status,
                created_at,
                updated_at
            FROM rentals
            WHERE user_id = ?
            ORDER BY rented_at DESC
        `;

        const [rows] = await db.execute(
            sql,
            [userId]
        );

        return rows;
    },


    // ==========================================
    // GET ALL RENTALS
    // ADMIN
    // ==========================================

    findAll: async () => {

        const sql = `
            SELECT
                r.rental_id,
                r.user_id,
                u.name AS user_name,
                u.email AS user_email,
                r.total_amount,
                r.rented_at,
                r.expires_at,
                r.status,
                r.created_at,
                r.updated_at
            FROM rentals r
            INNER JOIN users u
                ON r.user_id = u.user_id
            ORDER BY r.rented_at DESC
        `;

        const [rows] = await db.execute(sql);

        return rows;
    },


    // ==========================================
    // GET RENTAL BY ID
    // USER
    // ==========================================

    findById: async (
        rentalId,
        userId
    ) => {

        const sql = `
            SELECT
                rental_id,
                user_id,
                total_amount,
                rented_at,
                expires_at,
                status,
                created_at,
                updated_at
            FROM rentals
            WHERE rental_id = ?
            AND user_id = ?
        `;

        const [rows] = await db.execute(
            sql,
            [
                rentalId,
                userId
            ]
        );

        return rows;
    },


    // ==========================================
    // GET RENTAL BY ID
    // ADMIN
    // ==========================================

    findByIdAdmin: async (rentalId) => {

        const sql = `
            SELECT
                r.rental_id,
                r.user_id,
                u.name AS user_name,
                u.email AS user_email,
                r.total_amount,
                r.rented_at,
                r.expires_at,
                r.status,
                r.created_at,
                r.updated_at
            FROM rentals r
            INNER JOIN users u
                ON r.user_id = u.user_id
            WHERE r.rental_id = ?
        `;

        const [rows] = await db.execute(
            sql,
            [rentalId]
        );

        return rows;
    },


    // ==========================================
    // GET RENTAL ITEMS
    // ==========================================

    findItemsByRentalId: async (rentalId) => {

        const sql = `
            SELECT
                rental_item_id,
                rental_id,
                movie_id,
                movie_title,
                price,
                rental_duration,
                created_at
            FROM rental_items
            WHERE rental_id = ?
            ORDER BY rental_item_id ASC
        `;

        const [rows] = await db.execute(
            sql,
            [rentalId]
        );

        return rows;
    },


    // ==========================================
    // FIND MOVIES FOR RENTAL
    // ==========================================

    findMoviesByIds: async (movieIds) => {

        if (
            !movieIds ||
            movieIds.length === 0
        ) {

            return [];

        }

        const placeholders =
            movieIds
                .map(() => '?')
                .join(', ');


        const sql = `
            SELECT
                movie_id,
                title,
                rental_price,
                rental_duration,
                available
            FROM movies
            WHERE movie_id IN (${placeholders})
        `;


        const [rows] =
            await db.execute(
                sql,
                movieIds
            );


        return rows;
    },


    // ==========================================
    // CREATE RENTAL
    // ==========================================

    create: async (
        userId,
        totalAmount,
        expiresAt,
        items
    ) => {

        const connection =
            await db.getConnection();

        try {

            await connection.beginTransaction();


            // ==========================================
            // CREATE RENTAL
            // ==========================================

            const rentalSql = `
                INSERT INTO rentals
                (
                    user_id,
                    total_amount,
                    rented_at,
                    expires_at,
                    status
                )
                VALUES
                (
                    ?,
                    ?,
                    NOW(),
                    ?,
                    'active'
                )
            `;


            const [rentalResult] =
                await connection.execute(
                    rentalSql,
                    [
                        userId,
                        totalAmount,
                        expiresAt
                    ]
                );


            const rentalId =
                rentalResult.insertId;


            // ==========================================
            // CREATE RENTAL ITEMS
            // ==========================================

            const itemSql = `
                INSERT INTO rental_items
                (
                    rental_id,
                    movie_id,
                    movie_title,
                    price,
                    rental_duration
                )
                VALUES
                (
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                )
            `;


            for (
                const item
                of items
            ) {

                await connection.execute(
                    itemSql,
                    [
                        rentalId,
                        item.movie_id,
                        item.title,
                        item.rental_price,
                        item.rental_duration
                    ]
                );

            }


            await connection.commit();


            return rentalId;

        } catch (error) {

            await connection.rollback();

            throw error;

        } finally {

            connection.release();

        }

    },


    // ==========================================
    // UPDATE RENTAL STATUS
    // USER
    // ==========================================

    updateStatus: async (
        rentalId,
        userId,
        status
    ) => {

        const sql = `
            UPDATE rentals
            SET
                status = ?
            WHERE rental_id = ?
            AND user_id = ?
        `;


        const [result] =
            await db.execute(
                sql,
                [
                    status,
                    rentalId,
                    userId
                ]
            );


        return result;
    },


    // ==========================================
    // UPDATE RENTAL STATUS
    // ADMIN
    // ==========================================

    updateStatusAdmin: async (
        rentalId,
        status
    ) => {

        const sql = `
            UPDATE rentals
            SET
                status = ?
            WHERE rental_id = ?
        `;


        const [result] =
            await db.execute(
                sql,
                [
                    status,
                    rentalId
                ]
            );


        return result;
    },


    // ==========================================
    // DELETE RENTAL
    // USER
    // ==========================================

    delete: async (
        rentalId,
        userId
    ) => {

        const sql = `
            DELETE FROM rentals
            WHERE rental_id = ?
            AND user_id = ?
        `;


        const [result] =
            await db.execute(
                sql,
                [
                    rentalId,
                    userId
                ]
            );


        return result;
    },


    // ==========================================
    // DELETE RENTAL
    // ADMIN
    // ==========================================

    deleteAdmin: async (
        rentalId
    ) => {

        const sql = `
            DELETE FROM rentals
            WHERE rental_id = ?
        `;


        const [result] =
            await db.execute(
                sql,
                [rentalId]
            );


        return result;
    }

};


module.exports = Rental;
