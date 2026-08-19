const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// JWT secret
const JWT_SECRET = 'VIXEN_JWT_SECRET_CHANGE_THIS_LATER';

// ==========================================
// EMAIL TRANSPORTER
// ==========================================

const transporter = nodemailer.createTransport({

    service: 'gmail',

    auth: {
        user: 'appvixen@gmail.com',
        pass: 'tziipizroagsamty'
    }

});

// ==========================================
// REGISTER
// ==========================================

const register = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            password,
            profile_image
        } = req.body;

        // Validate required fields
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({
                message: 'First name, last name, email and password are required'
            });
        }

        // Check password length
        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check whether email already exists
        User.findByEmail(email, async (err, results) => {
            if (err) {
                console.error('Database error:', err);

                return res.status(500).json({
                    message: 'Database error'
                });
            }

            if (results.length > 0) {
                return res.status(409).json({
                    message: 'A user with this email already exists'
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const newUser = {
                first_name,
                last_name,
                email,
                password: hashedPassword,
                profile_image
            };

            User.create(newUser, (err, result) => {
                if (err) {
                    console.error('User creation error:', err);

                    return res.status(500).json({
                        message: 'Could not create user'
                    });
                }

                return res.status(201).json({
                    message: 'User registered successfully',
                    user: {
                        user_id: result.insertId,
                        first_name,
                        last_name,
                        email,
                        profile_image: profile_image || null
                    }
                });
            });
        });

    } catch (error) {
        console.error('Registration error:', error);

        return res.status(500).json({
            message: 'Server error'
        });
    }
};


// ==========================================
// LOGIN
// ==========================================

const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        // Find user
        User.findByEmail(email, async (err, results) => {
            if (err) {
                console.error('Database error:', err);

                return res.status(500).json({
                    message: 'Database error'
                });
            }

            if (results.length === 0) {
                return res.status(401).json({
                    message: 'Invalid email or password'
                });
            }

            const user = results[0];

            // Compare password with hashed password
            const passwordMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!passwordMatch) {
                return res.status(401).json({
                    message: 'Invalid email or password'
                });
            }

            // Create JWT
            const token = jwt.sign(
                {
                    user_id: user.user_id,
                    email: user.email
                },
                JWT_SECRET,
                {
                    expiresIn: '24h'
                }
            );

            return res.status(200).json({
                message: 'Login successful',

                token,

                user: {
                    user_id: user.user_id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    profile_image: user.profile_image
                }
            });
        });

    } catch (error) {
        console.error('Login error:', error);

        return res.status(500).json({
            message: 'Server error'
        });
    }
};
// ==========================================
// GET PROFILE
// ==========================================

const getProfile = (req, res) => {

    const userId = req.user.user_id;

    User.findById(userId, (err, results) => {

        if (err) {
            console.error('Get profile error:', err);

            return res.status(500).json({
                message: 'Database error'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        return res.status(200).json({
            message: 'Profile retrieved successfully',
            user: results[0]
        });
    });
};


// ==========================================
// UPDATE PROFILE
// ==========================================

const updateProfile = (req, res) => {

    const userId = req.user.user_id;

    const {
        first_name,
        last_name,
        email,
        profile_image
    } = req.body;


    // Validate required fields
    if (!first_name || !last_name || !email) {

        return res.status(400).json({
            message: 'First name, last name and email are required'
        });

    }


    // Check if another user already uses this email
    User.findByEmail(email, (err, results) => {

        if (err) {

            console.error('Email check error:', err);

            return res.status(500).json({
                message: 'Database error'
            });

        }


        // If the email belongs to another account
        if (
            results.length > 0 &&
            results[0].user_id !== userId
        ) {

            return res.status(409).json({
                message: 'A user with this email already exists'
            });

        }


        const updatedUser = {
            first_name,
            last_name,
            email,
            profile_image
        };


        User.update(
            userId,
            updatedUser,
            (err, result) => {

                if (err) {

                    console.error('Update profile error:', err);

                    return res.status(500).json({
                        message: 'Could not update profile'
                    });

                }


                if (result.affectedRows === 0) {

                    return res.status(404).json({
                        message: 'User not found'
                    });

                }


                // Get the updated user
                User.findById(
                    userId,
                    (err, results) => {

                        if (err) {

                            console.error(
                                'Get updated profile error:',
                                err
                            );

                            return res.status(500).json({
                                message: 'Profile updated but could not retrieve updated data'
                            });

                        }


                        return res.status(200).json({
                            message: 'Profile updated successfully',
                            user: results[0]
                        });

                    }
                );

            }
        );

    });

};


// ==========================================
// DELETE PROFILE
// ==========================================

const deleteProfile = (req, res) => {

    const userId = req.user.user_id;


    User.delete(userId, (err, result) => {

        if (err) {

            console.error('Delete profile error:', err);

            return res.status(500).json({
                message: 'Could not delete account'
            });

        }


        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: 'User not found'
            });

        }


        return res.status(200).json({
            message: 'Account deleted successfully'
        });

    });

};
// ==========================================
// CHANGE PASSWORD
// ==========================================

const changePassword = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const {
            current_password,
            new_password
        } = req.body;


        // Validate fields
        if (!current_password || !new_password) {
            return res.status(400).json({
                message: 'Current password and new password are required'
            });
        }


        // Validate new password length
        if (new_password.length < 6) {
            return res.status(400).json({
                message: 'New password must be at least 6 characters long'
            });
        }


        // Find current user
        User.findByEmail(req.user.email, async (err, results) => {

            if (err) {
                console.error('Password change database error:', err);

                return res.status(500).json({
                    message: 'Database error'
                });
            }


            if (results.length === 0) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }


            const user = results[0];


            // Check current password
            const passwordMatch = await bcrypt.compare(
                current_password,
                user.password
            );


            if (!passwordMatch) {
                return res.status(401).json({
                    message: 'Current password is incorrect'
                });
            }


            // Prevent using the same password
            const samePassword = await bcrypt.compare(
                new_password,
                user.password
            );

            if (samePassword) {
                return res.status(400).json({
                    message: 'New password must be different from current password'
                });
            }


            // Hash new password
            const hashedPassword = await bcrypt.hash(
                new_password,
                10
            );


            // Save new password
            User.updatePassword(
                userId,
                hashedPassword,
                (err, result) => {

                    if (err) {
                        console.error(
                            'Password update error:',
                            err
                        );

                        return res.status(500).json({
                            message: 'Could not change password'
                        });
                    }


                    if (result.affectedRows === 0) {
                        return res.status(404).json({
                            message: 'User not found'
                        });
                    }


                    return res.status(200).json({
                        message: 'Password changed successfully'
                    });

                }
            );

        });

    } catch (error) {

        console.error(
            'Change password error:',
            error
        );

        return res.status(500).json({
            message: 'Server error'
        });

    }
};
// ==========================================
// FORGOT PASSWORD
// ==========================================

const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;


        // ==========================================
        // VALIDATE EMAIL
        // ==========================================

        if (!email) {

            return res.status(400).json({
                message: 'Email is required'
            });

        }


        // ==========================================
        // FIND USER
        // ==========================================

        User.findByEmail(email, async (err, results) => {

            if (err) {

                console.error(
                    'Forgot password database error:',
                    err
                );

                return res.status(500).json({
                    message: 'Database error'
                });

            }


            // ==========================================
            // EMAIL DOES NOT EXIST
            // ==========================================

            if (results.length === 0) {

                return res.status(200).json({
                    message:
                        'If an account with that email exists, a password reset link has been sent.'
                });

            }


            const user = results[0];


            // ==========================================
            // CREATE RESET TOKEN
            // ==========================================

            const resetToken = crypto
                .randomBytes(32)
                .toString('hex');


            // ==========================================
            // TOKEN EXPIRES IN 1 HOUR
            // ==========================================

            const expires = new Date(
                Date.now() + 60 * 60 * 1000
            );


            // ==========================================
            // SAVE TOKEN
            // ==========================================

            User.saveResetToken(
                user.user_id,
                resetToken,
                expires,
                async (err) => {

                    if (err) {

                        console.error(
                            'Save reset token error:',
                            err
                        );

                        return res.status(500).json({
                            message:
                                'Could not create password reset request'
                        });

                    }


                    // ==========================================
                    // RESET URL
                    // ==========================================

                    const resetUrl =
                        `http://localhost:5173/reset-password?token=${resetToken}`;


                    // ==========================================
                    // SEND EMAIL
                    // ==========================================

                    try {

                        await transporter.sendMail({

                            from:
                                '"Vixen Cineflix" <YOUR_GMAIL@gmail.com>',

                            to: user.email,

                            subject:
                                'Vixen Cineflix - Reset Your Password',

                            html: `

                                <div style="
                                    font-family: Arial, sans-serif;
                                    max-width: 600px;
                                    margin: auto;
                                    padding: 30px;
                                    background-color: #111;
                                    color: white;
                                ">

                                    <h1 style="
                                        color: #e50914;
                                    ">
                                        Vixen Cineflix
                                    </h1>


                                    <h2>
                                        Reset Your Password
                                    </h2>


                                    <p>
                                        Hi ${user.first_name},
                                    </p>


                                    <p>
                                        We received a request to reset
                                        your Vixen Cineflix password.
                                    </p>


                                    <p>
                                        Click the button below to create
                                        a new password.
                                    </p>


                                    <div style="
                                        margin: 30px 0;
                                    ">

                                        <a
                                            href="${resetUrl}"
                                            style="
                                                background-color: #e50914;
                                                color: white;
                                                padding: 14px 25px;
                                                text-decoration: none;
                                                border-radius: 5px;
                                                display: inline-block;
                                            "
                                        >
                                            Reset Password
                                        </a>

                                    </div>


                                    <p>
                                        This link will expire in
                                        <strong>1 hour</strong>.
                                    </p>


                                    <p>
                                        If you did not request this
                                        password reset, you can safely
                                        ignore this email.
                                    </p>


                                    <p>
                                        Regards,<br>
                                        Vixen Cineflix Team
                                    </p>

                                </div>

                            `

                        });


                        // ==========================================
                        // SUCCESS
                        // ==========================================

                        return res.status(200).json({

                            message:
                                'If an account with that email exists, a password reset link has been sent.'

                        });

                    } catch (emailError) {

                        console.error(
                            'Email sending error:',
                            emailError
                        );

                        return res.status(500).json({
                            message:
                                'Could not send password reset email'
                        });

                    }

                }
            );

        });

    } catch (error) {

        console.error(
            'Forgot password error:',
            error
        );

        return res.status(500).json({
            message: 'Server error'
        });

    }

};
module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    deleteProfile,
    changePassword,
    forgotPassword
};