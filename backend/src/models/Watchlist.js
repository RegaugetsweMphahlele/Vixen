const db = require('../config/database');

const Watchlist = {

    // ==========================================
    // GET USER WATCHLIST
    // ==========================================

    findByUserId: async (userId) => {

        const sql = `
            SELECT
                w.watchlist_id,
                w.user_id,
                w.movie_id,
                w.created_at,

                m.title,
                m.description,
                m.release_year,
                m.duration,
                m.age_rating,
                m.rental_price,
                m.rental_duration,
                m.poster_image,
                m.backdrop_image,
                m.trailer_url,
                m.video_url,
                m.rating,
                m.language,
                m.available,
                m.featured,

                c.category_id,
                c.name AS category_name

            FROM watchlist w

            INNER JOIN movies m
                ON w.movie_id = m.movie_id

            INNER JOIN categories c
                ON m.category_id = c.category_id

            WHERE w.user_id = ?

            ORDER BY w.created_at DESC
        `;

        const [rows] = await db.execute(
            sql,
            [userId]
        );

        return rows;
    },


    // ==========================================
    // FIND WATCHLIST ITEM
    // ==========================================

    findByUserAndMovie: async (
        userId,
        movieId
    ) => {

        const sql = `
            SELECT
                watchlist_id,
                user_id,
                movie_id,
                created_at
            FROM watchlist
            WHERE user_id = ?
            AND movie_id = ?
        `;

        const [rows] = await db.execute(
            sql,
            [
                userId,
                movieId
            ]
        );

        return rows;
    },


    // ==========================================
    // FIND MOVIE
    // ==========================================

    findMovieById: async (movieId) => {

        const sql = `
            SELECT
                movie_id,
                title,
                available
            FROM movies
            WHERE movie_id = ?
        `;

        const [rows] = await db.execute(
            sql,
            [movieId]
        );

        return rows;
    },


    // ==========================================
    // ADD TO WATCHLIST
    // ==========================================

    create: async (
        userId,
        movieId
    ) => {

        const sql = `
            INSERT INTO watchlist
            (
                user_id,
                movie_id
            )
            VALUES (?, ?)
        `;

        const [result] = await db.execute(
            sql,
            [
                userId,
                movieId
            ]
        );

        return result;
    },


    // ==========================================
    // REMOVE FROM WATCHLIST
    // ==========================================

    delete: async (
        userId,
        movieId
    ) => {

        const sql = `
            DELETE FROM watchlist
            WHERE user_id = ?
            AND movie_id = ?
        `;

        const [result] = await db.execute(
            sql,
            [
                userId,
                movieId
            ]
        );

        return result;
    }

};

module.exports = Watchlist;