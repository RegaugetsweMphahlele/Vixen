const RentalItem = require('../models/RentalItem');


// ==========================================
// GET ALL RENTAL ITEMS
// ==========================================

const getRentalItems = async (req, res) => {

    try {

        const userId =
            req.user.user_id;


        // ==========================================
        // GET ITEMS
        // ==========================================

        const items =
            await RentalItem.findByUserId(
                userId
            );


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            message:
                'Rental items retrieved successfully',

            items

        });

    } catch (error) {

        console.error(
            'Get rental items error:',
            error
        );

        return res.status(500).json({

            message:
                'Could not retrieve rental items'

        });

    }

};


// ==========================================
// GET RENTAL ITEM BY ID
// ==========================================

const getRentalItemById = async (req, res) => {

    try {

        const userId =
            req.user.user_id;

        const rentalItemId =
            req.params.id;


        // ==========================================
        // FIND RENTAL ITEM
        // ==========================================

        const items =
            await RentalItem.findById(
                rentalItemId,
                userId
            );


        // ==========================================
        // CHECK ITEM
        // ==========================================

        if (items.length === 0) {

            return res.status(404).json({

                message:
                    'Rental item not found'

            });

        }


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            message:
                'Rental item retrieved successfully',

            item: items[0]

        });

    } catch (error) {

        console.error(
            'Get rental item error:',
            error
        );

        return res.status(500).json({

            message:
                'Could not retrieve rental item'

        });

    }

};


// ==========================================
// GET ITEMS FOR RENTAL
// ==========================================

const getItemsByRental = async (req, res) => {

    try {

        const userId =
            req.user.user_id;

        const rentalId =
            req.params.id;


        // ==========================================
        // CHECK RENTAL
        // ==========================================

        const rentals =
            await RentalItem.findRentalById(
                rentalId,
                userId
            );


        if (rentals.length === 0) {

            return res.status(404).json({

                message:
                    'Rental not found'

            });

        }


        // ==========================================
        // GET ITEMS
        // ==========================================

        const items =
            await RentalItem.findByRentalId(
                rentalId,
                userId
            );


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            message:
                'Rental items retrieved successfully',

            rental: rentals[0],

            items

        });

    } catch (error) {

        console.error(
            'Get rental items by rental error:',
            error
        );

        return res.status(500).json({

            message:
                'Could not retrieve rental items'

        });

    }

};


// ==========================================
// DELETE RENTAL ITEM
// ==========================================

const deleteRentalItem = async (req, res) => {

    try {

        const userId =
            req.user.user_id;

        const rentalItemId =
            req.params.id;


        // ==========================================
        // FIND RENTAL ITEM
        // ==========================================

        const items =
            await RentalItem.findById(
                rentalItemId,
                userId
            );


        if (items.length === 0) {

            return res.status(404).json({

                message:
                    'Rental item not found'

            });

        }


        // ==========================================
        // CHECK RENTAL STATUS
        // ==========================================

        if (
            items[0].status === 'expired'
        ) {

            return res.status(400).json({

                message:
                    'Expired rental items cannot be removed'

            });

        }


        // ==========================================
        // DELETE ITEM
        // ==========================================

        const result =
            await RentalItem.delete(
                rentalItemId,
                userId
            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                message:
                    'Rental item not found'

            });

        }


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            message:
                'Rental item deleted successfully'

        });

    } catch (error) {

        console.error(
            'Delete rental item error:',
            error
        );

        return res.status(500).json({

            message:
                'Could not delete rental item'

        });

    }

};


module.exports = {

    getRentalItems,
    getRentalItemById,
    getItemsByRental,
    deleteRentalItem

};