const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const Admin = require('../models/Admin');


// ==========================================
// JWT SECRET
// ==========================================

const JWT_SECRET =
    process.env.JWT_SECRET;


// ==========================================
// ADMIN LOGIN
// ==========================================

const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // ==========================================
        // VALIDATE INPUT
        // ==========================================

        if (!email || !password) {

            return res.status(400).json({

                message:
                    'Email and password are required'

            });

        }


        // ==========================================
        // FIND ADMIN
        // ==========================================

        const results =
            await Admin.findByEmail(
                email
            );


        if (results.length === 0) {

            return res.status(401).json({

                message:
                    'Invalid email or password'

            });

        }


        const admin = results[0];


        // ==========================================
        // CHECK PASSWORD
        // ==========================================

        const passwordMatch =
            await bcrypt.compare(
                password,
                admin.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                message:
                    'Invalid email or password'

            });

        }


        // ==========================================
        // CREATE ADMIN JWT
        // ==========================================

        const token = jwt.sign(

            {
                admin_id:
                    admin.admin_id,

                email:
                    admin.email,

                role:
                    'admin'

            },

            JWT_SECRET,

            {
                expiresIn: '24h'
            }

        );


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            message:
                'Admin login successful',

            token,

            admin: {

                admin_id:
                    admin.admin_id,

                first_name:
                    admin.first_name,

                last_name:
                    admin.last_name,

                email:
                    admin.email

            }

        });

    } catch (error) {

        console.error(
            'Admin login error:',
            error
        );

        return res.status(500).json({

            message:
                'Server error'

        });

    }

};


// ==========================================
// GET ADMIN PROFILE
// ==========================================

const getProfile = async (req, res) => {

    try {

        const adminId =
            req.admin.admin_id;


        // ==========================================
        // FIND ADMIN
        // ==========================================

        const results =
            await Admin.findById(
                adminId
            );


        if (results.length === 0) {

            return res.status(404).json({

                message:
                    'Admin not found'

            });

        }


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            message:
                'Admin profile retrieved successfully',

            admin:
                results[0]

        });

    } catch (error) {

        console.error(
            'Get admin profile error:',
            error
        );

        return res.status(500).json({

            message:
                'Could not retrieve admin profile'

        });

    }

};


// ==========================================
// UPDATE ADMIN PROFILE
// ==========================================

const updateProfile = async (req, res) => {

    try {

        const adminId =
            req.admin.admin_id;


        const {
            first_name,
            last_name,
            email
        } = req.body;


        // ==========================================
        // VALIDATE REQUIRED FIELDS
        // ==========================================

        if (
            !first_name ||
            !last_name ||
            !email
        ) {

            return res.status(400).json({

                message:
                    'First name, last name and email are required'

            });

        }


        // ==========================================
        // CHECK EMAIL
        // ==========================================

        const results =
            await Admin.findByEmail(
                email
            );


        if (
            results.length > 0 &&
            results[0].admin_id !== adminId
        ) {

            return res.status(409).json({

                message:
                    'An admin with this email already exists'

            });

        }


        // ==========================================
        // UPDATE ADMIN
        // ==========================================

        const updatedAdmin = {

            first_name,
            last_name,
            email

        };


        const result =
            await Admin.update(
                adminId,
                updatedAdmin
            );


        if (result.affectedRows === 0) {

            return res.status(404).json({

                message:
                    'Admin not found'

            });

        }


        // ==========================================
        // GET UPDATED ADMIN
        // ==========================================

        const updatedResults =
            await Admin.findById(
                adminId
            );


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            message:
                'Admin profile updated successfully',

            admin:
                updatedResults[0]

        });

    } catch (error) {

        console.error(
            'Update admin profile error:',
            error
        );

        return res.status(500).json({

            message:
                'Could not update admin profile'

        });

    }

};


// ==========================================
// CHANGE ADMIN PASSWORD
// ==========================================

const changePassword = async (req, res) => {

    try {

        const adminId =
            req.admin.admin_id;


        const {
            current_password,
            new_password
        } = req.body;


        // ==========================================
        // VALIDATE FIELDS
        // ==========================================

        if (
            !current_password ||
            !new_password
        ) {

            return res.status(400).json({

                message:
                    'Current password and new password are required'

            });

        }


        // ==========================================
        // VALIDATE NEW PASSWORD
        // ==========================================

        if (new_password.length < 6) {

            return res.status(400).json({

                message:
                    'New password must be at least 6 characters long'

            });

        }


        // ==========================================
        // FIND ADMIN
        // ==========================================

        const results =
            await Admin.findByEmail(
                req.admin.email
            );


        if (results.length === 0) {

            return res.status(404).json({

                message:
                    'Admin not found'

            });

        }


        const admin = results[0];


        // ==========================================
        // CHECK CURRENT PASSWORD
        // ==========================================

        const passwordMatch =
            await bcrypt.compare(
                current_password,
                admin.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                message:
                    'Current password is incorrect'

            });

        }


        // ==========================================
        // PREVENT SAME PASSWORD
        // ==========================================

        const samePassword =
            await bcrypt.compare(
                new_password,
                admin.password
            );


        if (samePassword) {

            return res.status(400).json({

                message:
                    'New password must be different from current password'

            });

        }


        // ==========================================
        // HASH NEW PASSWORD
        // ==========================================

        const hashedPassword =
            await bcrypt.hash(
                new_password,
                10
            );


        // ==========================================
        // UPDATE PASSWORD
        // ==========================================

        const result =
            await Admin.updatePassword(
                adminId,
                hashedPassword
            );


        if (result.affectedRows === 0) {

            return res.status(404).json({

                message:
                    'Admin not found'

            });

        }


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            message:
                'Admin password changed successfully'

        });

    } catch (error) {

        console.error(
            'Change admin password error:',
            error
        );

        return res.status(500).json({

            message:
                'Server error'

        });

    }

};


module.exports = {

    login,
    getProfile,
    updateProfile,
    changePassword

};