const Rental = require('../models/Rental');


// ==========================================
// USER
// GET ALL MY RENTALS
// ==========================================

const getRentals = async (req, res) => {

    try {

        const userId =
            req.user.user_id;


        const rentals =
            await Rental.findByUserId(
                userId
            );


        for (
            const rental
            of rentals
        ) {

            rental.items =
                await Rental.findItemsByRentalId(
                    rental.rental_id
                );

        }


        return res.status(200).json({

            message:
                'Rentals retrieved successfully',

            rentals

        });

    } catch (error) {

        console.error(
            'Get rentals error:',
            error
        );


        return res.status(500).json({

            message:
                'Could not retrieve rentals'

        });

    }

};


// ==========================================
// USER
// GET MY RENTAL BY ID
// ==========================================

const getRentalById = async (
    req,
    res
) => {

    try {

        const userId =
            req.user.user_id;

        const rentalId =
            req.params.id;


        const rentals =
            await Rental.findById(
                rentalId,
                userId
            );


        if (
            rentals.length === 0
        ) {

            return res.status(404).json({

                message:
                    'Rental not found'

            });

        }


        const rental =
            rentals[0];


        rental.items =
            await Rental.findItemsByRentalId(
                rentalId
            );


        return res.status(200).json({

            message:
                'Rental retrieved successfully',

            rental

        });

    } catch (error) {

        console.error(
            'Get rental error:',
            error
        );


        return res.status(500).json({

            message:
                'Could not retrieve rental'

        });

    }

};


// ==========================================
// USER
// CREATE RENTAL
// ==========================================

const createRental = async (
    req,
    res
) => {

    try {

        const userId =
            req.user.user_id;


        const {
            movie_ids
        } = req.body;


        // ==========================================
        // VALIDATE MOVIE IDS
        // ==========================================

        if (
            !Array.isArray(movie_ids) ||
            movie_ids.length === 0
        ) {

            return res.status(400).json({

                message:
                    'At least one movie is required'

            });

        }


        const validMovieIds =
            movie_ids.every(
                movieId =>
                    Number.isInteger(
                        Number(movieId)
                    ) &&
                    Number(movieId) > 0
            );


        if (!validMovieIds) {

            return res.status(400).json({

                message:
                    'Movie IDs must be valid numbers'

            });

        }


        // ==========================================
        // REMOVE DUPLICATES
        // ==========================================

        const uniqueMovieIds =
            [
                ...new Set(
                    movie_ids.map(
                        movieId =>
                            Number(movieId)
                    )
                )
            ];


        // ==========================================
        // FIND MOVIES
        // ==========================================

        const movies =
            await Rental.findMoviesByIds(
                uniqueMovieIds
            );


        if (
            movies.length !==
            uniqueMovieIds.length
        ) {

            return res.status(404).json({

                message:
                    'One or more movies could not be found'

            });

        }


        // ==========================================
        // CHECK AVAILABILITY
        // ==========================================

        const unavailableMovie =
            movies.find(
                movie =>
                    !movie.available
            );


        if (unavailableMovie) {

            return res.status(400).json({

                message:
                    `Movie "${unavailableMovie.title}" is currently unavailable`

            });

        }


        // ==========================================
        // CALCULATE TOTAL
        // ==========================================

        const totalAmount =
            movies.reduce(
                (
                    total,
                    movie
                ) =>
                    total +
                    Number(
                        movie.rental_price
                    ),
                0
            );


        // ==========================================
        // CALCULATE DURATION
        // ==========================================

        const rentalDuration =
            Math.max(
                ...movies.map(
                    movie =>
                        Number(
                            movie.rental_duration
                        )
                )
            );


        // ==========================================
        // CALCULATE EXPIRY
        // ==========================================

        const expiresAt =
            new Date(
                Date.now() +
                rentalDuration *
                60 *
                60 *
                1000
            );


        // ==========================================
        // CREATE RENTAL
        // ==========================================

        const rentalId =
            await Rental.create(
                userId,
                totalAmount,
                expiresAt,
                movies
            );


        // ==========================================
        // GET CREATED RENTAL
        // ==========================================

        const rentals =
            await Rental.findById(
                rentalId,
                userId
            );


        const rental =
            rentals[0];


        rental.items =
            await Rental.findItemsByRentalId(
                rentalId
            );


        return res.status(201).json({

            message:
                'Rental created successfully',

            rental

        });

    } catch (error) {

        console.error(
            'Create rental error:',
            error
        );


        return res.status(500).json({

            message:
                'Could not create rental'

        });

    }

};


// ==========================================
// USER
// UPDATE MY RENTAL STATUS
// ==========================================

const updateRental = async (
    req,
    res
) => {

    try {

        const userId =
            req.user.user_id;

        const rentalId =
            req.params.id;

        const {
            status
        } = req.body;


        if (!status) {

            return res.status(400).json({

                message:
                    'Status is required'

            });

        }


        if (
            status !== 'active' &&
            status !== 'expired'
        ) {

            return res.status(400).json({

                message:
                    'Status must be active or expired'

            });

        }


        const rentals =
            await Rental.findById(
                rentalId,
                userId
            );


        if (
            rentals.length === 0
        ) {

            return res.status(404).json({

                message:
                    'Rental not found'

            });

        }


        const result =
            await Rental.updateStatus(
                rentalId,
                userId,
                status
            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                message:
                    'Rental not found'

            });

        }


        const updatedRentals =
            await Rental.findById(
                rentalId,
                userId
            );


        const rental =
            updatedRentals[0];


        rental.items =
            await Rental.findItemsByRentalId(
                rentalId
            );


        return res.status(200).json({

            message:
                'Rental updated successfully',

            rental

        });

    } catch (error) {

        console.error(
            'Update rental error:',
            error
        );


        return res.status(500).json({

            message:
                'Could not update rental'

        });

    }

};


// ==========================================
// USER
// DELETE MY RENTAL
// ==========================================

const deleteRental = async (
    req,
    res
) => {

    try {

        const userId =
            req.user.user_id;

        const rentalId =
            req.params.id;


        const result =
            await Rental.delete(
                rentalId,
                userId
            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                message:
                    'Rental not found'

            });

        }


        return res.status(200).json({

            message:
                'Rental deleted successfully'

        });

    } catch (error) {

        console.error(
            'Delete rental error:',
            error
        );


        return res.status(500).json({

            message:
                'Could not delete rental'

        });

    }

};


// ==========================================
// ADMIN
// GET ALL RENTALS
// ==========================================

const getAllRentals = async (
    req,
    res
) => {

    try {

        const rentals =
            await Rental.findAll();


        for (
            const rental
            of rentals
        ) {

            rental.items =
                await Rental.findItemsByRentalId(
                    rental.rental_id
                );

        }


        return res.status(200).json({

            message:
                'All rentals retrieved successfully',

            rentals

        });

    } catch (error) {

        console.error(
            'Get all rentals error:',
            error
        );


        return res.status(500).json({

            message:
                'Could not retrieve rentals'

        });

    }

};


// ==========================================
// ADMIN
// GET ANY RENTAL BY ID
// ==========================================

const getAdminRentalById = async (
    req,
    res
) => {

    try {

        const rentalId =
            req.params.id;


        const rentals =
            await Rental.findByIdAdmin(
                rentalId
            );


        if (
            rentals.length === 0
        ) {

            return res.status(404).json({

                message:
                    'Rental not found'

            });

        }


        const rental =
            rentals[0];


        rental.items =
            await Rental.findItemsByRentalId(
                rentalId
            );


        return res.status(200).json({

            message:
                'Rental retrieved successfully',

            rental

        });

    } catch (error) {

        console.error(
            'Get admin rental error:',
            error
        );


        return res.status(500).json({

            message:
                'Could not retrieve rental'

        });

    }

};


// ==========================================
// ADMIN
// UPDATE ANY RENTAL STATUS
// ==========================================

const updateAdminRental = async (
    req,
    res
) => {

    try {

        const rentalId =
            req.params.id;

        const {
            status
        } = req.body;


        if (!status) {

            return res.status(400).json({

                message:
                    'Status is required'

            });

        }


        if (
            status !== 'active' &&
            status !== 'expired'
        ) {

            return res.status(400).json({

                message:
                    'Status must be active or expired'

            });

        }


        const rentals =
            await Rental.findByIdAdmin(
                rentalId
            );


        if (
            rentals.length === 0
        ) {

            return res.status(404).json({

                message:
                    'Rental not found'

            });

        }


        const result =
            await Rental.updateStatusAdmin(
                rentalId,
                status
            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                message:
                    'Rental not found'

            });

        }


        const updatedRentals =
            await Rental.findByIdAdmin(
                rentalId
            );


        const rental =
            updatedRentals[0];


        rental.items =
            await Rental.findItemsByRentalId(
                rentalId
            );


        return res.status(200).json({

            message:
                'Rental updated successfully',

            rental

        });

    } catch (error) {

        console.error(
            'Admin update rental error:',
            error
        );


        return res.status(500).json({

            message:
                'Could not update rental'

        });

    }

};


// ==========================================
// ADMIN
// DELETE ANY RENTAL
// ==========================================

const deleteAdminRental = async (
    req,
    res
) => {

    try {

        const rentalId =
            req.params.id;


        const result =
            await Rental.deleteAdmin(
                rentalId
            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                message:
                    'Rental not found'

            });

        }


        return res.status(200).json({

            message:
                'Rental deleted successfully'

        });

    } catch (error) {

        console.error(
            'Admin delete rental error:',
            error
        );


        return res.status(500).json({

            message:
                'Could not delete rental'

        });

    }

};


module.exports = {

    // USER
    getRentals,
    getRentalById,
    createRental,
    updateRental,
    deleteRental,

    // ADMIN
    getAllRentals,
    getAdminRentalById,
    updateAdminRental,
    deleteAdminRental

};
