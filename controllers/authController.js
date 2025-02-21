import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/usersModel.js';
import sendEmail from '../utils/sendEmail.js';
import * as emailTemplate from '../utils/emailTemplate.js';

/**
 * Register User
 */
export const registerUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = {
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email.toLowerCase(),
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
};

/**
 * Login User
 */
export const loginUser = async (req, res) => {
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
};

/**
 * Logout User
 */
export const logoutUser = async (req, res) => {
    try {
        req.flash('success', 'Logged out successfully.');
        req.session.destroy((err) => {
            if (err) {
                console.error('Logout Error:', err);
                return res.status(500).redirect('/dashboard');
            }
            res.clearCookie('connect.sid');
            res.redirect('/login');
        });
    } catch (error) {
        console.error('Unexpected Logout Error:', error);
        res.status(500).redirect('/dashboard');
    }
};

/**
 * Forgot Password
 */
export const forgotPassword = async (req, res) => {
    const user = await User.getUserByEmail(req.body.email.toLowerCase());

    if (!user) {
        req.flash('error', 'User not found.');
        return res.status(404).redirect('/forgot-password');
    }

    try {
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiryUTC = new Date(Date.now() + 3600000).toISOString();

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
};

/**
 * Reset Password
 */
export const resetPassword = async (req, res) => {
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
};
