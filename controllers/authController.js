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
        // Check if user already exists
        const existingUser = await User.getUserByEmail(req.body.email.toLowerCase());
        if (existingUser) {
            req.flash('error', 'Email is already registered.');
            return res.status(400).redirect('/login');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Generate confirmation token and expiry
        const confirmationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiryUTC = new Date(Date.now() + 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 19)
            .replace('T', ' '); // Convert to MySQL DATETIME format

        // Create user in database
        await User.createUser(
            req.body.firstName,
            req.body.lastName,
            req.body.email.toLowerCase(),
            hashedPassword,
            confirmationToken,
            tokenExpiryUTC
        );

        // Send confirmation email
        const confirmUrl = `http://localhost:3000/auth/confirm-email/${confirmationToken}`;
        const emailContent = emailTemplate.confirmationTemplate(confirmUrl);
        await sendEmail(req.body.email.toLowerCase(), 'Confirm Your Email', emailContent);

        req.flash(
            'success',
            'Account created successfully. Please check your email to confirm your account.'
        );
        res.status(201).redirect('/login');
    } catch (error) {
        console.error('Register User Error:', error);
        req.flash('error', 'Error creating account. Please try again.');
        res.status(500).redirect('/login');
    }
};

/**
 * Confirm Email
 */
export const confirmEmail = async (req, res) => {
    try {
        const user = await User.getUserByConfirmationToken(req.params.token);

        if (!user) {
            req.flash('error', 'Invalid or expired confirmation link.');
            return res.status(400).redirect('/login');
        }

        await User.activateUser(user.employee_id);

        req.flash('success', 'Email confirmed successfully. You can now log in.');
        res.redirect('/login');
    } catch (error) {
        console.error('Email Confirmation Error:', error);
        req.flash('error', 'Error confirming email. Please try again.');
        res.status(500).redirect('/login');
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

    if (user && user.is_active !== 1) {
        req.flash('error', 'Please activate your account using the link sent to your email!');
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
 * Update Profile
 */
export const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, currentPassword, newPassword } = req.body;
        const userId = req.session.userID;

        // Fetch existing user data
        const existingUser = await User.getUserByEmployeeId(userId);
        if (!existingUser) {
            req.flash('error', 'User not found.');
            return res.status(404).redirect('/login');
        }

        // Password update logic
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, existingUser.password);
            if (!isMatch) {
                req.flash('error', 'Current password is incorrect.');
                return res.status(401).redirect('/dashboard/account');
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            await User.updatePassword(userId, hashedNewPassword);
        }

        // Get profile image from req.file if uploaded
        const updatedProfilePic = req.file ? req.file.filename : existingUser.profile_image;

        // Use provided values or keep existing values
        const updatedFirstName = firstName || existingUser.first_name;
        const updatedLastName = lastName || existingUser.last_name;

        // Update user profile
        await User.updateUser(userId, updatedFirstName, updatedLastName, updatedProfilePic);

        req.flash('success', 'Profile updated successfully.');
        res.redirect('/dashboard/account');
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while updating your profile.');
        res.status(500).redirect('/dashboard/account');
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
