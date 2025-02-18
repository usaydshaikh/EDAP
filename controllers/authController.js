import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import User from '../models/usersModel.js';

// User creation with validation
export const createUser = [
    // Validation
    body('firstName').notEmpty().withMessage('First name is required').trim(),
    body('lastName').notEmpty().withMessage('Last name is required').trim(),
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

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
