import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/usersModel.js';
import sendEmail from '../utils/sendEmail.js';
import * as emailTemplate from '../utils/emailTemplate.js';

/**
 * Handles validation errors for Express Validator
 */
const handleValidationErrors = (req, res, redirectPath) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash(
            'error',
            errors.array().map((error) => error.msg).join(' ')
        );
        return res.status(400).redirect(redirectPath);
    }
};

/**
 * Create User - Handles user registration with validation
 */
export const createUser = [
    body('firstName').notEmpty().withMessage('First name is required').trim(),
    body('lastName').notEmpty().withMessage('Last name is required').trim(),
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    async (req, res) => {
        if (handleValidationErrors(req, res, '/register')) return;

        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const user = {
                first_name: req.body.firstName,
                last_name: req.body.lastName,
                email: req.body.email.toLowerCase(), // Normalize email for consistency
                password: hashedPassword,
            };

            await User.createUser(user.first_name, user.last_name, user.email, user.password);
            req.flash('success', 'Account created successfully. Please log in.');
            res.status(201).redirect('/login');
        } catch (error) {
            console.error('Create User Error:', error);
            req.flash('error', 'Error creating account. Please try again.');
            res.status(500).redirect('/register');
        }
    },
];

/**
 * Login User - Authenticates user credentials
 */
export const loginUser = [
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),

    async (req, res) => {
        if (handleValidationErrors(req, res, '/login')) return;

        const user = await User.getUserByEmail(req.body.email.toLowerCase());

        if (!user) {
            req.flash('error', 'User not found.');
            return res.status(404).redirect('/login');
        }

        try {
            const isMatch = await bcrypt.compare(req.body.password, user.password);

            if (isMatch) {
                req.session.userID = user.employee_id;
                req.flash('success', 'Login successful.');
                return res.redirect('/dashboard');
            } else {
                req.flash('error', 'Invalid password.');
                return res.status(401).redirect('/login');
            }
        } catch (error) {
            console.error('Login Error:', error);
            req.flash('error', 'An error occurred. Please try again.');
            return res.status(500).redirect('/login');
        }
    },
];

/**
 * Logout User - Ends user session
 */
export const logoutUser = async (req, res) => {
    try {
        req.flash('success', 'Logged out successfully.');
        req.session.destroy((err) => {
            if (err) {
                console.error('Logout Error:', err);
                return res.status(500).redirect('/dashboard');
            }
            res.clearCookie('connect.sid'); // Ensure session cookie is cleared
            res.redirect('/login');
        });
    } catch (error) {
        console.error('Unexpected Logout Error:', error);
        res.status(500).redirect('/dashboard');
    }
};

/**
 * Forgot Password - Generates reset token & sends email
 */
export const forgotPassword = [
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),

    async (req, res) => {
        if (handleValidationErrors(req, res, '/forgot-password')) return;

        const user = await User.getUserByEmail(req.body.email.toLowerCase());

        if (!user) {
            req.flash('error', 'User not found.');
            return res.status(404).redirect('/forgot-password');
        }

        try {
            const resetToken = crypto.randomBytes(32).toString('hex');
            const tokenExpiryUTC = new Date(Date.now() + 3600000).toISOString(); // 1-hour expiration

            await User.storeResetToken(user.employee_id, resetToken, tokenExpiryUTC);

            const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
            const emailContent = emailTemplate.resetPasswordTemplate(resetUrl);

            await sendEmail(user.email, 'Password Reset Request', emailContent);

            req.flash('success', 'Password reset link sent to your email.');
            res.status(200).redirect('/forgot-password');
        } catch (error) {
            console.error('Forgot Password Error:', error);
            req.flash('error', 'Error processing request. Please try again.');
            res.status(500).redirect('/forgot-password');
        }
    },
];

/**
 * Reset Password - Updates user's password after token verification
 */
export const resetPassword = [
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    async (req, res) => {
        if (handleValidationErrors(req, res, `/reset-password/${req.params.token}`)) return;

        const user = await User.getUserByResetToken(req.params.token);

        if (!user) {
            req.flash('error', 'Invalid or expired token.');
            return res.status(400).redirect('/forgot-password');
        }

        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            await User.updatePassword(user.employee_id, hashedPassword);

            req.flash('success', 'Password reset successful. Please log in.');
            res.status(200).redirect('/login');
        } catch (error) {
            console.error('Reset Password Error:', error);
            req.flash('error', 'Error resetting password. Please try again.');
            res.status(500).redirect(`/reset-password/${req.params.token}`);
        }
    },
];
