const db = require('../config/database');

const Movie = {

    // ==========================================
    // FIND ALL MOVIES
    // ==========================================

    findAll: async () => {

        const sql = `
            SELECT
                m.movie_id,
                m.title,
                m.description,
                m.category_id,
                c.name AS category_name,
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
                m.created_by_admin,
                m.updated_by_admin,
                m.created_at,
                m.updated_at
            FROM movies m
            INNER JOIN categories c
                ON m.category_id = c.category_id
            ORDER BY m.created_at DESC
        `;

        const [rows] = await db.execute(sql);

        return rows;
    },


    // ==========================================
    // FIND MOVIE BY ID
    // ==========================================

    findById: async (movieId) => {

        const sql = `
            SELECT
                m.movie_id,
                m.title,
                m.description,
                m.category_id,
                c.name AS category_name,
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
                m.created_by_admin,
                m.updated_by_admin,
                m.created_at,
                m.updated_at
            FROM movies m
            INNER JOIN categories c
                ON m.category_id = c.category_id
            WHERE m.movie_id = ?
        `;

        const [rows] = await db.execute(
            sql,
            [movieId]
        );

        return rows;
    },


    // ==========================================
    // CREATE MOVIE
    // ==========================================

    create: async (movie) => {

        const sql = `
            INSERT INTO movies
            (
                title,
                description,
                category_id,
                release_year,
                duration,
                age_rating,
                rental_price,
                rental_duration,
                poster_image,
                backdrop_image,
                trailer_url,
                video_url,
                rating,
                language,
                available,
                featured,
                created_by_admin,
                updated_by_admin
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            movie.title,
            movie.description,
            movie.category_id,
            movie.release_year,
            movie.duration,
            movie.age_rating,
            movie.rental_price,
            movie.rental_duration || 48,
            movie.poster_image,
            movie.backdrop_image || null,
            movie.trailer_url || null,
            movie.video_url || null,
            movie.rating || null,
            movie.language || 'English',
            movie.available !== undefined
                ? movie.available
                : true,
            movie.featured !== undefined
                ? movie.featured
                : false,
            movie.created_by_admin || null,
            movie.updated_by_admin || null
        ];

        const [result] = await db.execute(
            sql,
            values
        );

        return result;
    },


    // ==========================================
    // UPDATE MOVIE
    // ==========================================

    update: async (movieId, movie) => {

        const sql = `
            UPDATE movies
            SET
                title = ?,
                description = ?,
                category_id = ?,
                release_year = ?,
                duration = ?,
                age_rating = ?,
                rental_price = ?,
                rental_duration = ?,
                poster_image = ?,
                backdrop_image = ?,
                trailer_url = ?,
                video_url = ?,
                rating = ?,
                language = ?,
                available = ?,
                featured = ?,
                updated_by_admin = ?
            WHERE movie_id = ?
        `;

        const values = [
            movie.title,
            movie.description,
            movie.category_id,
            movie.release_year,
            movie.duration,
            movie.age_rating,
            movie.rental_price,
            movie.rental_duration,
            movie.poster_image,
            movie.backdrop_image || null,
            movie.trailer_url || null,
            movie.video_url || null,
            movie.rating || null,
            movie.language || 'English',
            movie.available,
            movie.featured,
            movie.updated_by_admin || null,
            movieId
        ];

        const [result] = await db.execute(
            sql,
            values
        );

        return result;
    },


    // ==========================================
    // DELETE MOVIE
    // ==========================================

    delete: async (movieId) => {

        const sql = `
            DELETE FROM movies
            WHERE movie_id = ?
        `;

        const [result] = await db.execute(
            sql,
            [movieId]
        );

        return result;
    },


    // ==========================================
    // FIND MOVIES BY CATEGORY
    // ==========================================

    findByCategory: async (categoryId) => {

        const sql = `
            SELECT
                m.movie_id,
                m.title,
                m.description,
                m.category_id,
                c.name AS category_name,
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
                m.created_at,
                m.updated_at
            FROM movies m
            INNER JOIN categories c
                ON m.category_id = c.category_id
            WHERE m.category_id = ?
            ORDER BY m.created_at DESC
        `;

        const [rows] = await db.execute(
            sql,
            [categoryId]
        );

        return rows;
    },


    // ==========================================
    // SEARCH MOVIES
    // ==========================================

    search: async (searchTerm) => {

        const sql = `
            SELECT
                m.movie_id,
                m.title,
                m.description,
                m.category_id,
                c.name AS category_name,
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
                m.created_at,
                m.updated_at
            FROM movies m
            INNER JOIN categories c
                ON m.category_id = c.category_id
            WHERE
                m.title LIKE ?
                OR m.description LIKE ?
            ORDER BY m.created_at DESC
        `;

        const searchValue = `%${searchTerm}%`;

        const [rows] = await db.execute(
            sql,
            [
                searchValue,
                searchValue
            ]
        );

        return rows;
    }

};

module.exports = Movie;