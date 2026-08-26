const Watchlist = require('../models/Watchlist');


// ==========================================
// GET WATCHLIST
// ==========================================

const getWatchlist = async (req, res) => {

    try {

        const userId =
            req.user.user_id;


        // ==========================================
        // FIND USER WATCHLIST
        // ==========================================

        const results =
            await Watchlist.findByUserId(
                userId
            );


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            message:
                'Watchlist retrieved successfully',

            watchlist:
                results

        });

    } catch (error) {

        console.error(
            'Get watchlist error:',
            error
        );

        return res.status(500).json({

            message:
                'Could not retrieve watchlist'

        });

    }

};


// ==========================================
// ADD TO WATCHLIST
// ==========================================

const addToWatchlist = async (req, res) => {

    try {

        const userId =
            req.user.user_id;


        const {
            movie_id
        } = req.body;


        // ==========================================
        // VALIDATE MOVIE ID
        // ==========================================

        if (!movie_id) {

            return res.status(400).json({

                message:
                    'Movie ID is required'

            });

        }


        // ==========================================
        // FIND MOVIE
        // ==========================================

        const movieResults =
            await Watchlist.findMovieById(
                movie_id
            );


        if (movieResults.length === 0) {

            return res.status(404).json({

                message:
                    'Movie not found'

            });

        }


        // ==========================================
        // CHECK EXISTING WATCHLIST ITEM
        // ==========================================

        const existingResults =
            await Watchlist.findByUserAndMovie(
                userId,
                movie_id
            );


        if (existingResults.length > 0) {

            return res.status(409).json({

                message:
                    'Movie is already in your watchlist'

            });

        }


        // ==========================================
        // ADD MOVIE
        // ==========================================

        const result =
            await Watchlist.create(
                userId,
                movie_id
            );


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(201).json({

            message:
                'Movie added to watchlist successfully',

            watchlist: {

                watchlist_id:
                    result.insertId,

                user_id:
                    userId,

                movie_id:
                    movie_id

            }

        });

    } catch (error) {

        console.error(
            'Add to watchlist error:',
            error
        );

        return res.status(500).json({

            message:
                'Could not add movie to watchlist'

        });

    }

};


// ==========================================
// CHECK WATCHLIST
// ==========================================

const checkWatchlist = async (req, res) => {

    try {

        const userId =
            req.user.user_id;


        const movieId =
            req.params.movie_id;


        // ==========================================
        // VALIDATE MOVIE ID
        // ==========================================

        if (!movieId) {

            return res.status(400).json({

                message:
                    'Movie ID is required'

            });

        }


        // ==========================================
        // CHECK WATCHLIST
        // ==========================================

        const results =
            await Watchlist.findByUserAndMovie(
                userId,
                movieId
            );


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            in_watchlist:
                results.length > 0,

            watchlist:
                results.length > 0
                    ? results[0]
                    : null

        });

    } catch (error) {

        console.error(
            'Check watchlist error:',
            error
        );

        return res.status(500).json({

            message:
                'Could not check watchlist'

        });

    }

};


// ==========================================
// REMOVE FROM WATCHLIST
// ==========================================

const removeFromWatchlist = async (req, res) => {

    try {

        const userId =
            req.user.user_id;


        const movieId =
            req.params.movie_id;


        // ==========================================
        // VALIDATE MOVIE ID
        // ==========================================

        if (!movieId) {

            return res.status(400).json({

                message:
                    'Movie ID is required'

            });

        }


        // ==========================================
        // CHECK WATCHLIST ITEM
        // ==========================================

        const existingResults =
            await Watchlist.findByUserAndMovie(
                userId,
                movieId
            );


        if (existingResults.length === 0) {

            return res.status(404).json({

                message:
                    'Movie is not in your watchlist'

            });

        }


        // ==========================================
        // DELETE WATCHLIST ITEM
        // ==========================================

        const result =
            await Watchlist.delete(
                userId,
                movieId
            );


        if (result.affectedRows === 0) {

            return res.status(404).json({

                message:
                    'Movie is not in your watchlist'

            });

        }


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            message:
                'Movie removed from watchlist successfully'

        });

    } catch (error) {

        console.error(
            'Remove from watchlist error:',
            error
        );

        return res.status(500).json({

            message:
                'Could not remove movie from watchlist'

        });

    }

};


module.exports = {

    getWatchlist,
    addToWatchlist,
    checkWatchlist,
    removeFromWatchlist

};