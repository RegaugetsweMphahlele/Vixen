const db = require('../config/database');

const RentalItem = {

    // ==========================================
    // GET ALL RENTAL ITEMS FOR USER
    // ==========================================

    findByUserId: async (userId) => {

        const sql = `
            SELECT
                ri.rental_item_id,
                ri.rental_id,
                ri.movie_id,
                ri.movie_title,
                ri.price,
                ri.rental_duration,
                ri.created_at,

                r.user_id,
                r.total_amount,
                r.rented_at,
                r.expires_at,
                r.status

            FROM rental_items ri

            INNER JOIN rentals r
                ON ri.rental_id = r.rental_id

            WHERE r.user_id = ?

            ORDER BY ri.created_at DESC
        `;

        const [rows] = await db.execute(
            sql,
            [userId]
        );

        return rows;
    },


    // ==========================================
    // GET RENTAL ITEM BY ID FOR USER
    // ==========================================

    findById: async (
        rentalItemId,
        userId
    ) => {

        const sql = `
            SELECT
                ri.rental_item_id,
                ri.rental_id,
                ri.movie_id,
                ri.movie_title,
                ri.price,
                ri.rental_duration,
                ri.created_at,

                r.user_id,
                r.total_amount,
                r.rented_at,
                r.expires_at,
                r.status

            FROM rental_items ri

            INNER JOIN rentals r
                ON ri.rental_id = r.rental_id

            WHERE ri.rental_item_id = ?
            AND r.user_id = ?
        `;

        const [rows] = await db.execute(
            sql,
            [
                rentalItemId,
                userId
            ]
        );

        return rows;
    },


    // ==========================================
    // GET ITEMS FOR RENTAL
    // ==========================================

    findByRentalId: async (
        rentalId,
        userId
    ) => {

        const sql = `
            SELECT
                ri.rental_item_id,
                ri.rental_id,
                ri.movie_id,
                ri.movie_title,
                ri.price,
                ri.rental_duration,
                ri.created_at

            FROM rental_items ri

            INNER JOIN rentals r
                ON ri.rental_id = r.rental_id

            WHERE ri.rental_id = ?
            AND r.user_id = ?

            ORDER BY ri.rental_item_id ASC
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
    // CHECK RENTAL
    // ==========================================

    findRentalById: async (
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
                status
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
    // CREATE RENTAL ITEM
    // ==========================================

    create: async (
        rentalId,
        movieId,
        movieTitle,
        price,
        rentalDuration
    ) => {

        const sql = `
            INSERT INTO rental_items
            (
                rental_id,
                movie_id,
                movie_title,
                price,
                rental_duration
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await db.execute(
            sql,
            [
                rentalId,
                movieId,
                movieTitle,
                price,
                rentalDuration
            ]
        );

        return result;
    },


    // ==========================================
    // DELETE RENTAL ITEM
    // ==========================================

    delete: async (
        rentalItemId,
        userId
    ) => {

        const sql = `
            DELETE ri

            FROM rental_items ri

            INNER JOIN rentals r
                ON ri.rental_id = r.rental_id

            WHERE ri.rental_item_id = ?
            AND r.user_id = ?
        `;

        const [result] = await db.execute(
            sql,
            [
                rentalItemId,
                userId
            ]
        );

        return result;
    }

};

module.exports = RentalItem;