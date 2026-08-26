const Movie = require('../models/Movie');


// ==========================================
// GET ALL MOVIES
// ==========================================

const getAllMovies = async (req, res) => {

    try {

        const results =
            await Movie.findAll();


        return res.status(200).json({

            message:
                'Movies retrieved successfully',

            movies: results

        });

    } catch (error) {

        console.error(
            'Get all movies error:',
            error
        );

        return res.status(500).json({

            message:
                'Could not retrieve movies'

        });

    }
};


// ==========================================
// GET MOVIE BY ID
// ==========================================

const getMovieById = async (req, res) => {

    try {

        const movieId =
            req.params.id;


        const results =
            await Movie.findById(movieId);


        if (results.length === 0) {

            return res.status(404).json({

                message:
                    'Movie not found'

            });

        }


        return res.status(200).json({

            message:
                'Movie retrieved successfully',

            movie: results[0]

        });

    } catch (error) {

        console.error(
            'Get movie error:',
            error
        );

        return res.status(500).json({

            message:
                'Could not retrieve movie'

        });

    }
};


// ==========================================
// CREATE MOVIE
// ==========================================

const createMovie = async (req, res) => {

    try {

        const {
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
            featured
        } = req.body;


        // ==========================================
        // VALIDATE REQUIRED FIELDS
        // ==========================================

        if (
            !title ||
            !description ||
            !category_id ||
            !release_year ||
            !duration ||
            !age_rating ||
            rental_price === undefined ||
            !poster_image
        ) {

            return res.status(400).json({

                message:
                    'Title, description, category, release year, duration, age rating, rental price and poster image are required'

            });

        }


        // ==========================================
        // VALIDATE DURATION
        // ==========================================

        if (duration <= 0) {

            return res.status(400).json({

                message:
                    'Duration must be greater than 0'

            });

        }


        // ==========================================
        // VALIDATE RENTAL PRICE
        // ==========================================

        if (rental_price < 0) {

            return res.status(400).json({

                message:
                    'Rental price cannot be negative'

            });

        }


        // ==========================================
        // VALIDATE RATING
        // ==========================================

        if (
            rating !== undefined &&
            rating !== null &&
            (rating < 0 || rating > 10)
        ) {

            return res.status(400).json({

                message:
                    'Rating must be between 0 and 10'

            });

        }


        // ==========================================
        // CREATE MOVIE
        // ==========================================

        const newMovie = {

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
            created_by_admin:
                req.admin.admin_id,

            updated_by_admin:
                req.admin.admin_id


        };


        const result =
            await Movie.create(
                newMovie
            );


        // ==========================================
        // GET CREATED MOVIE
        // ==========================================

        const movie =
            await Movie.findById(
                result.insertId
            );


        return res.status(201).json({

            message:
                'Movie created successfully',

            movie: movie[0]

        });

    } catch (error) {

        console.error(
            'Create movie error:',
            error
        );

        return res.status(500).json({

            message:
                'Could not create movie'

        });

    }
};


// ==========================================
// UPDATE MOVIE
// ==========================================

const updateMovie = async (req, res) => {

    try {

        const movieId =
            req.params.id;


        const {
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
            featured
        } = req.body;


        // ==========================================
        // VALIDATE REQUIRED FIELDS
        // ==========================================

        if (
            !title ||
            !description ||
            !category_id ||
            !release_year ||
            !duration ||
            !age_rating ||
            rental_price === undefined ||
            !poster_image
        ) {

            return res.status(400).json({

                message:
                    'Title, description, category, release year, duration, age rating, rental price and poster image are required'

            });

        }


        // ==========================================
        // VALIDATE DURATION
        // ==========================================

        if (duration <= 0) {

            return res.status(400).json({

                message:
                    'Duration must be greater than 0'

            });

        }


        // ==========================================
        // VALIDATE RENTAL PRICE
        // ==========================================

        if (rental_price < 0) {

            return res.status(400).json({

                message:
                    'Rental price cannot be negative'

            });

        }


        // ==========================================
        // VALIDATE RATING
        // ==========================================

        if (
            rating !== undefined &&
            rating !== null &&
            (rating < 0 || rating > 10)
        ) {

            return res.status(400).json({

                message:
                    'Rating must be between 0 and 10'

            });

        }


        // ==========================================
        // UPDATE MOVIE
        // ==========================================

        const updatedMovie = {

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

            updated_by_admin:
               req.admin.admin_id


        };


        const result =
            await Movie.update(
                movieId,
                updatedMovie
            );


        if (result.affectedRows === 0) {

            return res.status(404).json({

                message:
                    'Movie not found'

            });

        }


        // ==========================================
        // GET UPDATED MOVIE
        // ==========================================

        const updatedResults =
            await Movie.findById(
                movieId
            );


        return res.status(200).json({

            message:
                'Movie updated successfully',

            movie:
                updatedResults[0]

        });

    } catch (error) {

        console.error(
            'Update movie error:',
            error
        );

        return res.status(500).json({

            message:
                'Could not update movie'

        });

    }
};


// ==========================================
// DELETE MOVIE
// ==========================================

const deleteMovie = async (req, res) => {

    try {

        const movieId =
            req.params.id;


        const result =
            await Movie.delete(
                movieId
            );


        if (result.affectedRows === 0) {

            return res.status(404).json({

                message:
                    'Movie not found'

            });

        }


        return res.status(200).json({

            message:
                'Movie deleted successfully'

        });

    } catch (error) {

        console.error(
            'Delete movie error:',
            error
        );

        return res.status(500).json({

            message:
                'Could not delete movie'

        });

    }
};


// ==========================================
// GET MOVIES BY CATEGORY
// ==========================================

const getMoviesByCategory = async (req, res) => {

    try {

        const categoryId =
            req.params.categoryId;


        const results =
            await Movie.findByCategory(
                categoryId
            );


        return res.status(200).json({

            message:
                'Movies retrieved successfully',

            movies: results

        });

    } catch (error) {

        console.error(
            'Get movies by category error:',
            error
        );

        return res.status(500).json({

            message:
                'Could not retrieve movies'

        });

    }
};


// ==========================================
// SEARCH MOVIES
// ==========================================

const searchMovies = async (req, res) => {

    try {

        const {
            search
        } = req.query;


        // ==========================================
        // VALIDATE SEARCH
        // ==========================================

        if (!search) {

            return res.status(400).json({

                message:
                    'Search term is required'

            });

        }


        const results =
            await Movie.search(
                search
            );


        return res.status(200).json({

            message:
                'Movies retrieved successfully',

            movies: results

        });

    } catch (error) {

        console.error(
            'Search movies error:',
            error
        );

        return res.status(500).json({

            message:
                'Could not search movies'

        });

    }
};


module.exports = {

    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
    getMoviesByCategory,
    searchMovies

};