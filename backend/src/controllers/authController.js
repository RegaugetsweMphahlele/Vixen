const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const User = require('../models/User');


// ==========================================
// JWT SECRET
// ==========================================

const JWT_SECRET = process.env.JWT_SECRET;


// ==========================================
// EMAIL TRANSPORTER
// ==========================================

const transporter = nodemailer.createTransport({

    service: 'gmail',

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
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


        // ==========================================
        // VALIDATE REQUIRED FIELDS
        // ==========================================

        if (
            !first_name ||
            !last_name ||
            !email ||
            !password
        ) {

            return res.status(400).json({
                message:
                    'First name, last name, email and password are required'
            });

        }


        // ==========================================
        // VALIDATE PASSWORD
        // ==========================================

        if (password.length < 6) {

            return res.status(400).json({
                message:
                    'Password must be at least 6 characters long'
            });

        }


        // ==========================================
        // CHECK EXISTING USER
        // ==========================================

        const results = await User.findByEmail(email);

        if (results.length > 0) {

            return res.status(409).json({
                message:
                    'A user with this email already exists'
            });

        }


        // ==========================================
        // HASH PASSWORD
        // ==========================================

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        // ==========================================
        // CREATE USER
        // ==========================================

        const newUser = {

            first_name,
            last_name,
            email,
            password: hashedPassword,
            profile_image

        };


        const result = await User.create(
            newUser
        );


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(201).json({

            message:
                'User registered successfully',

            user: {

                user_id: result.insertId,
                first_name,
                last_name,
                email,
                profile_image:
                    profile_image || null

            }

        });

    } catch (error) {

        console.error(
            'Registration error:',
            error
        );

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
        // FIND USER
        // ==========================================

        const results =
            await User.findByEmail(email);


        if (results.length === 0) {

            return res.status(401).json({
                message:
                    'Invalid email or password'
            });

        }


        const user = results[0];


        // ==========================================
        // CHECK PASSWORD
        // ==========================================

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({
                message:
                    'Invalid email or password'
            });

        }


        // ==========================================
        // CREATE JWT
        // ==========================================

        const token = jwt.sign(

            {
                user_id: user.user_id,
                email: user.email,
                role: 'user'
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
                'Login successful',

            token,

            user: {

                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                profile_image:
                    user.profile_image

            }

        });

    } catch (error) {

        console.error(
            'Login error:',
            error
        );

        return res.status(500).json({
            message: 'Server error'
        });

    }

};


// ==========================================
// GET PROFILE
// ==========================================

const getProfile = async (req, res) => {

    try {

        const userId =
            req.user.user_id;


        const results =
            await User.findById(userId);


        if (results.length === 0) {

            return res.status(404).json({
                message: 'User not found'
            });

        }


        return res.status(200).json({

            message:
                'Profile retrieved successfully',

            user: results[0]

        });

    } catch (error) {

        console.error(
            'Get profile error:',
            error
        );

        return res.status(500).json({
            message: 'Database error'
        });

    }

};


// ==========================================
// UPDATE PROFILE
// ==========================================

const updateProfile = async (req, res) => {

    try {

        const userId =
            req.user.user_id;


        const {
            first_name,
            last_name,
            email,
            profile_image
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
            await User.findByEmail(email);


        if (
            results.length > 0 &&
            results[0].user_id !== userId
        ) {

            return res.status(409).json({

                message:
                    'A user with this email already exists'

            });

        }


        // ==========================================
        // UPDATE USER
        // ==========================================

        const updatedUser = {

            first_name,
            last_name,
            email,
            profile_image

        };


        const result =
            await User.update(
                userId,
                updatedUser
            );


        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: 'User not found'
            });

        }


        // ==========================================
        // GET UPDATED USER
        // ==========================================

        const updatedResults =
            await User.findById(userId);


        return res.status(200).json({

            message:
                'Profile updated successfully',

            user: updatedResults[0]

        });

    } catch (error) {

        console.error(
            'Update profile error:',
            error
        );

        return res.status(500).json({
            message:
                'Could not update profile'
        });

    }

};


// ==========================================
// DELETE PROFILE
// ==========================================

const deleteProfile = async (req, res) => {

    try {

        const userId =
            req.user.user_id;


        const result =
            await User.delete(userId);


        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: 'User not found'
            });

        }


        return res.status(200).json({

            message:
                'Account deleted successfully'

        });

    } catch (error) {

        console.error(
            'Delete profile error:',
            error
        );

        return res.status(500).json({
            message:
                'Could not delete account'
        });

    }

};


// ==========================================
// CHANGE PASSWORD
// ==========================================

const changePassword = async (req, res) => {

    try {

        const userId =
            req.user.user_id;


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
        // FIND CURRENT USER
        // ==========================================

        const results =
            await User.findByEmail(
                req.user.email
            );


        if (results.length === 0) {

            return res.status(404).json({
                message: 'User not found'
            });

        }


        const user = results[0];


        // ==========================================
        // CHECK CURRENT PASSWORD
        // ==========================================

        const passwordMatch =
            await bcrypt.compare(
                current_password,
                user.password
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
                user.password
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
            await User.updatePassword(
                userId,
                hashedPassword
            );


        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: 'User not found'
            });

        }


        return res.status(200).json({

            message:
                'Password changed successfully'

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

        const results =
            await User.findByEmail(email);


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

        const resetToken =
            crypto
                .randomBytes(32)
                .toString('hex');


        // ==========================================
        // TOKEN EXPIRES IN 1 HOUR
        // ==========================================

        const expires =
            new Date(
                Date.now() +
                60 * 60 * 1000
            );


        // ==========================================
        // SAVE RESET TOKEN
        // ==========================================

        await User.saveResetToken(
            user.user_id,
            resetToken,
            expires
        );


        // ==========================================
        // RESET URL
        // ==========================================

        const resetUrl =
            `http://localhost:5173/reset-password?token=${resetToken}`;


        // ==========================================
        // SEND EMAIL
        // ==========================================

        await transporter.sendMail({

            from:
                `"Vixen Cineflix" <${process.env.EMAIL_USER}>`,

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

    } catch (error) {

        console.error(
            'Forgot password error:',
            error
        );

        return res.status(500).json({

            message:
                'Could not send password reset email'

        });

    }

};
// ==========================================
// GET ALL USERS - ADMIN
// ==========================================

const getAllUsers = async (req, res) => {

    try {

        const results =
            await User.findAll();


        return res.status(200).json({

            message:
                'Users retrieved successfully',

            users:
                results

        });

    } catch (error) {

        console.error(
            'Get all users error:',
            error
        );

        return res.status(500).json({

            message:
                'Could not retrieve users'

        });

    }

};
// ==========================================
// GET USER BY ID - ADMIN
// ==========================================

const getUserById = async (req, res) => {

    try {

        const userId =
            req.params.id;


        const results =
            await User.findById(
                userId
            );


        if (results.length === 0) {

            return res.status(404).json({

                message:
                    'User not found'

            });

        }


        return res.status(200).json({

            message:
                'User retrieved successfully',

            user:
                results[0]

        });

    } catch (error) {

        console.error(
            'Get user by ID error:',
            error
        );

        return res.status(500).json({

            message:
                'Could not retrieve user'

        });

    }

};
// ==========================================
// UPDATE USER - ADMIN
// ==========================================

const updateUser = async (req, res) => {

    try {

        const userId =
            req.params.id;


        const {
            first_name,
            last_name,
            email,
            profile_image
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
        // CHECK USER
        // ==========================================

        const userResults =
            await User.findById(
                userId
            );


        if (userResults.length === 0) {

            return res.status(404).json({

                message:
                    'User not found'

            });

        }


        // ==========================================
        // CHECK EMAIL
        // ==========================================

        const emailResults =
            await User.findByEmail(
                email
            );


        if (
            emailResults.length > 0 &&
            emailResults[0].user_id !== Number(userId)
        ) {

            return res.status(409).json({

                message:
                    'A user with this email already exists'

            });

        }


        // ==========================================
        // UPDATE USER
        // ==========================================

        const updatedUser = {

            first_name,
            last_name,
            email,
            profile_image

        };


        const result =
            await User.update(
                userId,
                updatedUser
            );


        if (result.affectedRows === 0) {

            return res.status(404).json({

                message:
                    'User not found'

            });

        }


        // ==========================================
        // GET UPDATED USER
        // ==========================================

        const updatedResults =
            await User.findById(
                userId
            );


        return res.status(200).json({

            message:
                'User updated successfully',

            user:
                updatedResults[0]

        });

    } catch (error) {

        console.error(
            'Admin update user error:',
            error
        );

        return res.status(500).json({

            message:
                'Could not update user'

        });

    }

};
// ==========================================
// DELETE USER - ADMIN
// ==========================================

const deleteUser = async (req, res) => {

    try {

        const userId =
            req.params.id;


        // ==========================================
        // DELETE USER
        // ==========================================

        const result =
            await User.delete(
                userId
            );


        if (result.affectedRows === 0) {

            return res.status(404).json({

                message:
                    'User not found'

            });

        }


        return res.status(200).json({

            message:
                'User deleted successfully'

        });

    } catch (error) {

        console.error(
            'Admin delete user error:',
            error
        );

        return res.status(500).json({

            message:
                'Could not delete user'

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
    forgotPassword,

    getAllUsers,
    getUserById,
    updateUser,
    deleteUser

};
