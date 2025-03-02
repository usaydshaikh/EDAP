import { body, validationResult } from 'express-validator';

/**
 * Middleware to handle validation errors
 */
export const handleValidationErrors = (redirectPath) => (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        req.flash('error', errors.array().map((error) => error.msg).join(' '));
        return res.status(400).redirect(redirectPath); // Prevents `next()`
    }

    next(); // Pass control to controller
};


/**
 * Validation rules for user registration
 */
export const validateRegistration = [
    body('firstName').notEmpty().withMessage('First name is required').trim(),
    body('lastName').notEmpty().withMessage('Last name is required').trim(),
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

/**
 * Validation rules for user login
 */
export const validateLogin = [
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
];

/**
 * Validation rules for forgot password request
 */
export const validateForgotPassword = [body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail()];

/**
 * Validation rules for resetting password
 */
export const validateResetPassword = [body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')];


export const validateContactForm = [
    body('fullName').notEmpty().withMessage('Full name is required').trim(),
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('message').notEmpty().withMessage('Message is required').trim(),
];