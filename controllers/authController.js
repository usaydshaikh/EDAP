import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/usersModel.js';
import sendEmail from '../utils/sendEmail.js';
import * as emailTemplate from '../utils/emailTemplate.js';

// User creation with validation
export const createUser = [
    // Validation
    body('firstName').notEmpty().withMessage('First name is required').trim(),
    body('lastName').notEmpty().withMessage('Last name is required').trim(),
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash(
                'error',
                errors
                    .array()
                    .map((error) => error.msg)
                    .join(' ')
            );
            return res.status(400).redirect('/login'); // redirect to the register page with errors
        }

        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            const user = {
                first_name: req.body.firstName,
                last_name: req.body.lastName,
                email: req.body.email,
                password: hashedPassword,
            };

            const userId = await User.createUser(
                user.first_name,
                user.last_name,
                user.email,
                user.password
            );
            req.flash('success', 'Account Created Successfully');
            res.status(201).redirect('/login');
        } catch (error) {
            req.flash('error', 'Error Creating Account');
            res.status(500).redirect('/login');
        }
    },
];

// User login with validation
export const loginUser = [
    // Validation
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),

    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash(
                'error',
                errors
                    .array()
                    .map((error) => error.msg)
                    .join(' ')
            );
            return res.status(400).redirect('/login'); // redirect to the login page with errors
        }

        const user = await User.getUserByEmail(req.body.email);

        if (!user) {
            req.flash('error', 'User Not Found');
            return res.status(404).redirect('/login');
        }

        try {
            const isMatch = await bcrypt.compare(req.body.password, user.password);

            if (isMatch) {
                req.session.userID = user.employee_id;
                return res.redirect('/dashboard');
            } else {
                req.flash('error', 'Password Not Matched');
                return res.status(401).redirect('/login');
            }
        } catch (error) {
            req.flash('error', 'User Not Found');
            return res.status(500).redirect('/login');
        }
    },
];

// User logout
export const logoutUser = async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};

// Forgot Password - Generates reset token and sends an email
export const forgotPassword = [
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),

    // Form Validation
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash(
                'error',
                errors
                    .array()
                    .map((error) => error.msg)
                    .join(' ')
            );
            return res.status(400).redirect('/forgot-password');
        }

        const user = await User.getUserByEmail(req.body.email);

        if (!user) {
            req.flash('error', 'User Not Found');
            return res.status(404).redirect('/forgot-password');
        }

        try {
            const resetToken = crypto.randomBytes(32).toString('hex');

            // Generate token expiry time in UTC
            const tokenExpiryUTC = new Date(Date.now() + 3600000).toISOString();

            await User.storeResetToken(user.employee_id, resetToken, tokenExpiryUTC);

            const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
            const emailContent = emailTemplate.resetPasswordTemplate(resetUrl);

            const emailSent = await sendEmail(user.email, 'Password Reset Request', emailContent);

            if (!emailSent) {
                req.flash('error', 'Failed to send reset email. Please try again.');
                return res.status(500).redirect('/forgot-password');
            }

            req.flash('success', 'Reset password link sent to your email');
            res.status(200).redirect('/forgot-password');
        } catch (error) {
            console.error('Forgot Password Error:', error);
            req.flash('error', 'Error processing request. Please try again.');
            res.status(500).redirect('/forgot-password');
        }
    },
];

// Reset Password - Validates token and updates password
export const resetPassword = [
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash(
                'error',
                errors
                    .array()
                    .map((error) => error.msg)
                    .join(' ')
            );
            return res.status(400).redirect(`/reset-password/${req.params.token}`);
        }

        const user = await User.getUserByResetToken(req.params.token);
        console.log('is it id: ', user);

        if (!user) {
            req.flash('error', 'Invalid or expired token');
            return res.status(400).redirect('/forgot-password');
        }

        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            await User.updatePassword(user.employee_id, hashedPassword);
            req.flash('success', 'Password reset successful. Please login.');
            res.status(200).redirect('/login');
        } catch (error) {
            req.flash('error', 'Error resetting password');
            res.status(500).redirect(`/reset-password/${req.params.token}`);
        }
    },
];
